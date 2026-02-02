import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { EdificioService } from '../../services/edificio.service';
import { ClienteService } from '../../services/cliente.service';
import { UtilsService } from '../../services/utils.service';
import { EdificioWithRelations } from '../../models/edificio.model';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-edificio-list',
  template: `
    <div class="container-fluid py-4">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">Edificios</h2>
          <p class="text-muted mb-0">Gestión de edificios del sistema</p>
        </div>
        <div class="d-flex gap-2">
          <button type="button" 
                  class="btn btn-outline-secondary"
                  (click)="volverAlDashboardCliente()"
                  *ngIf="currentClienteId">
            <i class="bi bi-arrow-left me-2"></i>
            Volver al Dashboard del Cliente
          </button>
          <button type="button" 
                  class="btn btn-primary-custom"
                  (click)="openCreateModal()">
            <i class="bi bi-plus-circle me-2"></i>
            Nuevo Edificio
          </button>
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
          <h6 class="mb-0">Listado de Edificios</h6>
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
            [data]="edificios"
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
export class EdificioListComponent implements OnInit {
  edificios: EdificioWithRelations[] = [];
  clientes: Cliente[] = [];
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
  filterValues: { [key: string]: string } = { search: '', activo: '' };
  private filterSubject$ = new Subject<{ [key: string]: string }>();
  
  // Current cliente_id from query params
  currentClienteId: number | null = null;
  
  filterConfigs = [
    {
      placeholder: 'Buscar por nombre, sucursal o dirección',
      field: 'search',
      type: 'text' as const
    },
    {
      placeholder: 'Cliente',
      field: 'cliente_id',
      type: 'select' as const,
      options: [] as { value: string; label: string }[]
    },
    {
      placeholder: 'Estado',
      field: 'activo',
      type: 'select' as const,
      options: [
        { value: 'S', label: 'Activo' },
        { value: 'N', label: 'Inactivo' }
      ]
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
      label: 'Nombre',
      sortable: true
    },
    {
      key: 'Sucursal',
      label: 'Sucursal',
      sortable: true
    },
    {
      key: 'Cliente.RazonSocial',
      label: 'Cliente',
      sortable: true
    },
    {
      key: 'Provincia.Nombre',
      label: 'Provincia',
      sortable: true
    },
    {
      key: 'Direccion',
      label: 'Dirección',
      sortable: true
    },
    {
      key: 'Ciudad',
      label: 'Ciudad',
      sortable: true
    },
    {
      key: 'Activo',
      label: 'Estado',
      sortable: true,
      type: 'badge' as const,
      badgeClass: (value: string) => value === 'S' ? 'badge-active' : 'badge-inactive',
      badgeText: (value: string) => value === 'S' ? 'Activo' : 'Inactivo',
      align: 'center' as const
    }
  ];

  tableActions = [
    {
      icon: 'bi bi-building',
      title: 'Ver Detalles',
      class: 'btn-outline-success btn-sm',
      action: (edificio: EdificioWithRelations) => this.navigateToDetail(edificio)
    },
    {
      icon: 'bi bi-pencil',
      title: 'Editar',
      class: 'btn-outline-primary btn-sm',
      action: (edificio: EdificioWithRelations) => this.openEditModal(edificio)
    },
    {
      icon: 'bi bi-eye',
      title: 'Ver Info',
      class: 'btn-outline-info btn-sm',
      action: (edificio: EdificioWithRelations) => this.openViewModal(edificio)
    },
    {
      icon: 'bi bi-trash',
      title: 'Eliminar',
      class: 'btn-outline-danger btn-sm',
      action: (edificio: EdificioWithRelations) => this.confirmDelete(edificio)
    }
  ];

  // Alert
  alertMessage: any;

  // Filters Panel
  filtersPanelOpen: boolean = false;

  // Confirmation Modal
  showConfirmModal: boolean = false;
  confirmModalTitle: string = '';
  confirmModalMessage: string = '';
  confirmModalDetails: string = '';
  private pendingAction: () => void = () => {};

  constructor(
    private edificioService: EdificioService,
    private clienteService: ClienteService,
    private utilsService: UtilsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.filterSubject$.pipe(
      debounceTime(500)
    ).subscribe(filters => {
      this.loadEdificios();
    });
  }

  ngOnInit(): void {
    // Leer query parameters para filtrar automáticamente
    this.route.queryParams.subscribe(params => {
      if (params['cliente_id']) {
        this.filterValues['cliente_id'] = params['cliente_id'];
        this.currentClienteId = Number(params['cliente_id']);
      }
      if (params['activo']) {
        this.filterValues['activo'] = params['activo'];
      }
    });
    
    this.loadClientes();
    this.loadStats();
    this.loadEdificios();
  }

  loadClientes(): void {
    this.clienteService.getClientes({
      page: 1,
      page_size: 1000,
      activo: 'S'
    }).subscribe(response => {
      this.clientes = response.data;
      this.updateFilterOptions();
    });
  }

  updateFilterOptions(): void {
    const clienteOptions = this.clientes.map(cliente => ({
      value: cliente.Id.toString(),
      label: cliente.RazonSocial
    }));
    
    const clienteFilter = this.filterConfigs.find(f => f.field === 'cliente_id');
    if (clienteFilter) {
      clienteFilter.options = clienteOptions;
    }
  }

  loadEdificios(): void {
    this.loading = true;
    
    const params = {
      page: this.currentPage,
      page_size: this.pageSize,
      search: this.filterValues['search'] || '',
      cliente_id: this.filterValues['cliente_id'] ? parseInt(this.filterValues['cliente_id']) : undefined,
      activo: this.filterValues['activo'] || '',
      order_by: this.sortBy,
      order_direction: this.sortDirection
    };

    this.edificioService.getEdificios(params).subscribe({
      next: (response) => {
        this.edificios = response.data;
        this.totalRecords = response.total;
        this.loading = false;
      },
      error: (error) => {
        this.alertMessage = {
          type: 'danger',
          message: 'Error al cargar los edificios. Por favor, inténtelo de nuevo.',
          dismissible: true
        };
        this.loading = false;
      }
    });
  }

  loadStats(): void {
    this.edificioService.getStats().subscribe({
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
    this.loadEdificios();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadEdificios();
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.currentPage = 1;
    this.loadEdificios();
  }

  exportToCsv(): void {
    const params = {
      page: 1,
      page_size: this.totalRecords, // Get all records
      search: this.filterValues['search'] || '',
      cliente_id: this.filterValues['cliente_id'] ? parseInt(this.filterValues['cliente_id']) : undefined,
      activo: this.filterValues['activo'] || '',
      order_by: this.sortBy,
      order_direction: this.sortDirection
    };

    this.edificioService.getEdificios(params).subscribe(response => {
      this.utilsService.exportToCsv(response.data, 'edificios');
      this.showSuccessMessage('Edificios exportados a CSV correctamente');
    });
  }

  exportToExcel(): void {
    const params = {
      page: this.currentPage,
      page_size: this.pageSize,
      search: this.filterValues['search'] || '',
      cliente_id: this.filterValues['cliente_id'] ? parseInt(this.filterValues['cliente_id']) : undefined,
      activo: this.filterValues['activo'] || '',
      order_by: this.sortBy,
      order_direction: this.sortDirection
    };

    this.edificioService.exportarExcel(params).subscribe(blob => {
      this.utilsService.downloadFile(blob, 'edificios.xlsx');
      this.showSuccessMessage('Edificios exportados a Excel correctamente');
    });
  }

  openCreateModal(): void {
    // TODO: Implementar modal de creación
    this.showInfoMessage('Funcionalidad de creación en desarrollo');
  }

  openEditModal(edificio: EdificioWithRelations): void {
    // TODO: Implementar modal de edición
    this.showInfoMessage(`Editando edificio: ${edificio.Nombre}`);
  }

  openViewModal(edificio: EdificioWithRelations): void {
    // TODO: Implementar modal de visualización
    this.showInfoMessage(`Viendo detalles del edificio: ${edificio.Nombre}`);
  }

  confirmDelete(edificio: EdificioWithRelations): void {
    this.confirmModalTitle = 'Eliminar Edificio';
    this.confirmModalMessage = `¿Está seguro de que desea eliminar el edificio "${edificio.Nombre}"?`;
    this.confirmModalDetails = 'Esta acción no se puede deshacer y eliminará permanentemente el edificio del sistema.';
    this.showConfirmModal = true;
    
    this.pendingAction = () => {
      this.deleteEdificio(edificio.Id);
    };
  }

  deleteEdificio(id: number): void {
    this.edificioService.deleteEdificio(id).subscribe({
      next: () => {
        this.showSuccessMessage('Edificio eliminado correctamente');
        this.loadEdificios();
        this.loadStats();
        this.closeConfirmModal();
      },
      error: (error) => {
        this.alertMessage = {
          type: 'danger',
          message: 'Error al eliminar el edificio. Puede que tenga registros asociados.',
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

  navigateToDetail(edificio: EdificioWithRelations): void {
    this.router.navigate(['/edificios', edificio.Id, 'detail']);
  }

  toggleFiltersPanel(): void {
    this.filtersPanelOpen = !this.filtersPanelOpen;
  }

  volverAlDashboardCliente(): void {
    if (this.currentClienteId) {
      this.router.navigate(['/clientes', this.currentClienteId, 'dashboard']);
    } else {
      this.router.navigate(['/clientes']);
    }
  }
}