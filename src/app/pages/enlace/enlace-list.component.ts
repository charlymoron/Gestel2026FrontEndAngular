import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { EnlaceService } from '../../services/enlace.service';
import { EdificioService } from '../../services/edificio.service';
import { UtilsService } from '../../services/utils.service';
import { EnlaceWithRelations } from '../../models/enlace.model';
import { Edificio } from '../../models/edificio.model';

@Component({
  selector: 'app-enlace-list',
  template: `
    <div class="container-fluid py-4">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">Enlaces</h2>
          <p class="text-muted mb-0">
            Gestión de enlaces del sistema
            <span *ngIf="clienteIdFilter" class="badge bg-success ms-2">
              Filtrando por Cliente ID: {{clienteIdFilter}}
            </span>
            <span *ngIf="edificioIdsFilter" class="badge bg-info ms-2">
              Filtrando por Edificios: {{edificioIdsFilter}}
            </span>
          </p>
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
            Nuevo Enlace
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="row mb-4">
        <div class="col-md-3 mb-3">
          <div class="card bg-primary text-white">
            <div class="card-body">
              <h5 class="card-title">{{stats?.total_enlaces || 0}}</h5>
              <p class="card-text">Total Enlaces</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card bg-success text-white">
            <div class="card-body">
              <h5 class="card-title">{{stats?.enlaces_propios || 0}}</h5>
              <p class="card-text">Enlaces Propios</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card bg-warning text-dark">
            <div class="card-body">
              <h5 class="card-title">{{stats?.enlaces_terceros || 0}}</h5>
              <p class="card-text">Enlaces de Terceros</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card bg-info text-white">
            <div class="card-body">
              <h5 class="card-title">{{totalRecords}}</h5>
              <p class="card-text">Mostrando</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Data Table -->
      <div class="card gestel-card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h6 class="mb-0">Listado de Enlaces</h6>
        </div>
        <div class="card-body">
          <div *ngIf="loading" class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2 text-muted">Cargando enlaces...</p>
          </div>

          <div *ngIf="!loading && enlaces.length === 0" class="text-center py-4">
            <i class="bi bi-inbox display-4 text-muted"></i>
            <p class="text-muted mt-2">No se encontraron enlaces para este cliente</p>
          </div>

          <table *ngIf="!loading && enlaces.length > 0" class="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Referencia</th>
                <th>Edificio</th>
                <th>Sucursal</th>
                <th>Cliente</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let enlace of enlaces">
                <td>{{enlace.Id}}</td>
                <td>{{enlace.Referencia}}</td>
                <td>{{enlace.edificio_nombre || 'N/A'}}</td>
                <td>{{enlace.edificio_sucursal || 'N/A'}}</td>
                <td>{{enlace.cliente_nombre || 'N/A'}}</td>
                <td>
                  <span class="badge" 
                        [ngClass]="enlace.EsDeTerceros ? 'badge-warning' : 'badge-success'">
                    {{enlace.EsDeTerceros ? 'De Terceros' : 'Propio'}}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          
          <!-- Pagination -->
          <div *ngIf="totalRecords > 0" class="mt-3">
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
    </div>
  `,
  styles: [`
    .table th {
      background-color: #f8f9fa;
      border-top: none;
    }
  `]
})
export class EnlaceListComponent implements OnInit {
  enlaces: EnlaceWithRelations[] = [];
  stats: any;
  loading: boolean = false;
  clienteIdFilter: string = '';
  edificioIdsFilter: string = '';
  
  // Current cliente_id from query params (as number)
  currentClienteId: number | null = null;

  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;

  // Alert
  alertMessage: any;

  constructor(
    private enlaceService: EnlaceService,
    private edificioService: EdificioService,
    private utilsService: UtilsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Leer query parameters para filtrar automáticamente
    this.route.queryParams.subscribe(params => {
      if (params['cliente_id']) {
        this.clienteIdFilter = params['cliente_id'];
        this.currentClienteId = Number(params['cliente_id']);
      }
      if (params['edificio_ids']) {
        this.edificioIdsFilter = params['edificio_ids'];
      }
    });
    
    this.loadStats();
    this.loadEnlaces();
  }

  loadStats(): void {
    this.enlaceService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        // Error loading stats, continue without stats
      }
    });
  }

  loadEnlaces(): void {
    this.loading = true;
    
    // Priorizar filtro por cliente sobre otros filtros
    if (this.clienteIdFilter) {
      
      // Usar nuevo endpoint específico por cliente
      this.enlaceService.getEnlacesPorCliente(parseInt(this.clienteIdFilter), {
        page: this.currentPage,
        page_size: this.pageSize
      }).subscribe({
        next: (response) => {
          console.log('Enlaces del cliente:', response);
          console.log('Total enlaces del cliente:', response.total);
          
          this.enlaces = response.data || [];
          this.totalRecords = response.total || 0;
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this.showErrorMessage('Error al cargar enlaces del cliente');
        }
      });
    } else {
      // Comportamiento normal sin filtros de cliente
      this.enlaceService.getEnlaces({
        page: this.currentPage,
        page_size: this.pageSize
      }).subscribe({
        next: (response) => {
          this.enlaces = response.data || [];
          this.totalRecords = response.total || 0;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading enlaces:', error);
          this.loading = false;
          this.showErrorMessage('Error al cargar enlaces');
        }
      });
    }
  }

  openCreateModal(): void {
    this.showErrorMessage('Función de creación en desarrollo');
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadEnlaces();
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.currentPage = 1;
    this.loadEnlaces();
  }

  showErrorMessage(message: string): void {
    this.alertMessage = {
      type: 'danger',
      message: message,
      dismissible: true
    };
  }

  volverAlDashboardCliente(): void {
    if (this.currentClienteId) {
      this.router.navigate(['/clientes', this.currentClienteId, 'dashboard']);
    } else {
      this.router.navigate(['/clientes']);
    }
  }
}