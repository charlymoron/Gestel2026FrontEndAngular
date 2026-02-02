import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { ProvinciaService } from '../../services/provincia.service';
import { UtilsService } from '../../services/utils.service';
import { Provincia } from '../../models/provincia.model';

@Component({
  selector: 'app-provincia-list',
  template: `
    <div class="container-fluid py-4">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">Provincias</h2>
          <p class="text-muted mb-0">Gestión de provincias del sistema</p>
        </div>
        <button type="button" 
                class="btn btn-primary-custom"
                (click)="openCreateModal()">
          <i class="bi bi-plus-circle me-2"></i>
          Nueva Provincia
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="row mb-4">
        <div class="col-md-4 mb-3">
          <div class="card gestel-card">
            <div class="card-body text-center">
              <h3 class="text-primary mb-1">{{stats?.total_provincias || 0}}</h3>
              <p class="mb-0 text-muted">Total de Provincias</p>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="card gestel-card">
            <div class="card-body text-center">
              <h3 class="text-success mb-1">{{stats?.provincias_con_edificios || 0}}</h3>
              <p class="mb-0 text-muted">Provincias con Edificios</p>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="card gestel-card">
            <div class="card-body text-center">
              <h3 class="text-warning mb-1">{{stats?.provincias_sin_edificios || 0}}</h3>
              <p class="mb-0 text-muted">Provincias sin Edificios</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters Panel -->
      <div class="filters-panel">
        <div class="filters-panel-header" (click)="toggleFiltersPanel()">
          <h6>
            <i class="bi bi-funnel me-2"></i>
            Filtros de Búsqueda
          </h6>
          <i class="bi bi-chevron-down toggle-icon" [class.rotated]="filtersPanelOpen"></i>
        </div>
        <div class="filters-panel-body" [class.show]="filtersPanelOpen">
          <app-filters
            [filters]="filterConfigs"
            [filterValues]="filterValues"
            (filterChange)="onFilterChange()">
          </app-filters>
        </div>
      </div>

      <!-- Data Table -->
      <div class="card gestel-card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h6 class="mb-0">Listado de Provincias</h6>
          <div class="d-flex gap-2">
            <button type="button" 
                    class="btn btn-sm btn-outline-secondary"
                    (click)="exportToCsv()">
              <i class="bi bi-file-earmark-csv me-1"></i>
              Exportar CSV
            </button>
            <button type="button" 
                    class="btn btn-sm btn-outline-primary"
                    (click)="exportToExcel()">
              <i class="bi bi-file-earmark-excel me-1"></i>
              Exportar Excel
            </button>
          </div>
        </div>
        <div class="card-body">
          <app-data-table
            [data]="provincias"
            [columns]="tableColumns"
            [actions]="tableActions"
            [loading]="loading"
            [sortBy]="sortBy"
            [sortDirection]="sortDirection"
            (sortChange)="onSortChange($event)">
          </app-data-table>
          
          <!-- Pagination -->
          <div class="mt-3">
            <app-pagination
              [currentPage]="currentPage"
              [pageSize]="pageSize"
              [total]="totalRecords"
              (pageChange)="onPageChange($event)"
              (pageSizeChange)="onPageSizeChange($event)">
            </app-pagination>
          </div>
        </div>
      </div>

      <!-- Alert Messages -->
      <div *ngIf="alertMessage" class="fixed-top mt-3 mx-3" style="z-index: 1060;">
        <app-alert
          [message]="alertMessage"
          (onDismiss)="alertMessage = null">
        </app-alert>
      </div>

      <!-- Confirmation Modal -->
      <app-modal-confirm
        [show]="showConfirmModal"
        [title]="confirmModalTitle"
        [message]="confirmModalMessage"
        [details]="confirmModalDetails"
        (onConfirm)="onConfirmAction()"
        (onCancel)="closeConfirmModal()">
      </app-modal-confirm>
    </div>
  `
})
export class ProvinciaListComponent implements OnInit {
  provincias: Provincia[] = [];
  stats: any;
  loading: boolean = false;
  
  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  
  // Sorting
  sortBy: string = 'Id';
  sortDirection: 'asc' | 'desc' = 'asc';
  
  // Filters
  filterValues: { [key: string]: string } = { search: '' };
  private filterSubject$ = new Subject<{ [key: string]: string }>();
  
  filterConfigs = [
    {
      placeholder: 'Buscar por nombre de provincia',
      field: 'search',
      type: 'text' as const
    }
  ];

  // Table Configuration
  tableColumns = [
    {
      key: 'Id',
      label: 'ID',
      sortable: true,
      width: '80px',
      align: 'center' as const
    },
    {
      key: 'Nombre',
      label: 'Nombre de Provincia',
      sortable: true
    }
  ];

  tableActions = [
    {
      icon: 'bi bi-pencil',
      title: 'Editar',
      class: 'btn-outline-primary btn-sm',
      action: (provincia: Provincia) => this.openEditModal(provincia)
    },
    {
      icon: 'bi bi-eye',
      title: 'Ver Detalles',
      class: 'btn-outline-info btn-sm',
      action: (provincia: Provincia) => this.openViewModal(provincia)
    },
    {
      icon: 'bi bi-trash',
      title: 'Eliminar',
      class: 'btn-outline-danger btn-sm',
      action: (provincia: Provincia) => this.confirmDelete(provincia)
    }
  ];

  // Alert
  alertMessage: any;

  // Confirmation Modal
  showConfirmModal: boolean = false;
  confirmModalTitle: string = '';
  confirmModalMessage: string = '';
  confirmModalDetails: string = '';
  private pendingAction: () => void = () => {};

  // Filters Panel
  filtersPanelOpen: boolean = false;

  constructor(
    private provinciaService: ProvinciaService,
    private utilsService: UtilsService
  ) {
    this.filterSubject$.pipe(
      debounceTime(500)
    ).subscribe(filters => {
      this.loadProvincias();
    });
  }

  ngOnInit(): void {
    this.loadStats();
    this.loadProvincias();
  }

  loadProvincias(): void {
    this.loading = true;
    
    const params = {
      page: this.currentPage,
      page_size: this.pageSize,
      search: this.filterValues['search'] || '',
      order_by: this.sortBy,
      order_direction: this.sortDirection
    };

    this.provinciaService.getProvincias(params).subscribe({
      next: (response) => {
        this.provincias = response.data;
        this.totalRecords = response.total;
        this.loading = false;
      },
      error: (error) => {
        this.alertMessage = {
          type: 'danger',
          message: 'Error al cargar las provincias. Por favor, inténtelo de nuevo.',
          dismissible: true
        };
        this.loading = false;
      }
    });
  }

  loadStats(): void {
    this.provinciaService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
      }
    });
  }

  onFilterChange(): void {
    this.filterSubject$.next(this.filterValues);
  }

  onSortChange(event: { field: string; direction: 'asc' | 'desc' }): void {
    this.sortBy = event.field;
    this.sortDirection = event.direction;
    this.loadProvincias();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProvincias();
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.currentPage = 1;
    this.loadProvincias();
  }

  exportToCsv(): void {
    const params = {
      page: 1,
      page_size: this.totalRecords, // Get all records
      search: this.filterValues['search'] || '',
      order_by: this.sortBy,
      order_direction: this.sortDirection
    };

    this.provinciaService.getProvincias(params).subscribe(response => {
      this.utilsService.exportToCsv(response.data, 'provincias');
      this.showSuccessMessage('Provincias exportadas a CSV correctamente');
    });
  }

  exportToExcel(): void {
    const params = {
      page: this.currentPage,
      page_size: this.pageSize,
      search: this.filterValues['search'] || '',
      order_by: this.sortBy,
      order_direction: this.sortDirection
    };

    this.provinciaService.exportarExcel(params).subscribe(blob => {
      this.utilsService.downloadFile(blob, 'provincias.xlsx');
      this.showSuccessMessage('Provincias exportadas a Excel correctamente');
    });
  }

  openCreateModal(): void {
    // TODO: Implementar modal de creación
    this.showInfoMessage('Funcionalidad de creación en desarrollo');
  }

  openEditModal(provincia: Provincia): void {
    // TODO: Implementar modal de edición
    this.showInfoMessage(`Editando provincia: ${provincia.Nombre}`);
  }

  openViewModal(provincia: Provincia): void {
    // TODO: Implementar modal de visualización
    this.showInfoMessage(`Viendo detalles de la provincia: ${provincia.Nombre}`);
  }

  confirmDelete(provincia: Provincia): void {
    this.confirmModalTitle = 'Eliminar Provincia';
    this.confirmModalMessage = `¿Está seguro de que desea eliminar la provincia "${provincia.Nombre}"?`;
    this.confirmModalDetails = 'Esta acción no se puede deshacer y eliminará permanentemente la provincia del sistema.';
    this.showConfirmModal = true;
    
    this.pendingAction = () => {
      this.deleteProvincia(provincia.Id);
    };
  }

  deleteProvincia(id: number): void {
    this.provinciaService.deleteProvincia(id).subscribe({
      next: () => {
        this.showSuccessMessage('Provincia eliminada correctamente');
        this.loadProvincias();
        this.loadStats();
        this.closeConfirmModal();
      },
      error: (error) => {
        this.alertMessage = {
          type: 'danger',
          message: 'Error al eliminar la provincia. Puede que tenga registros asociados.',
          dismissible: true
        };
        this.closeConfirmModal();
      }
    });
  }

  onConfirmAction(): void {
    this.pendingAction();
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
    this.confirmModalTitle = '';
    this.confirmModalMessage = '';
    this.confirmModalDetails = '';
    this.pendingAction = () => {};
  }

  toggleFiltersPanel(): void {
    this.filtersPanelOpen = !this.filtersPanelOpen;
  }

  showSuccessMessage(message: string): void {
    this.alertMessage = {
      type: 'success',
      message: message,
      dismissible: true,
      autoClose: true
    };
  }

  showInfoMessage(message: string): void {
    this.alertMessage = {
      type: 'info',
      message: message,
      dismissible: true,
      autoClose: true
    };
  }
}