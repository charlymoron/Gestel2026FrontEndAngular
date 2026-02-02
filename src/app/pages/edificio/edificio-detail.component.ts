import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { EdificioService } from '../../services/edificio.service';
import { ClienteService } from '../../services/cliente.service';
import { ProvinciaService } from '../../services/provincia.service';
import { EnlaceService } from '../../services/enlace.service';
import { UtilsService } from '../../services/utils.service';
import { EdificioWithRelations } from '../../models/edificio.model';
import { Cliente } from '../../models/cliente.model';
import { Provincia } from '../../models/provincia.model';

@Component({
  selector: 'app-edificio-detail',
  template: `
    <div class="container-fluid py-4">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">Detalles del Edificio</h2>
          <p class="text-muted mb-0" *ngIf="edificio">Información completa del edificio: <strong>{{edificio.Nombre}}</strong></p>
        </div>
        <button type="button" 
                class="btn btn-outline-primary-custom"
                (click)="volverALista()">
          <i class="bi bi-arrow-left me-2"></i>
          Volver a Lista de Edificios
        </button>
      </div>

      <!-- Edificio Info -->
      <div class="card gestel-card mb-4" *ngIf="edificio">
        <div class="card-header">
          <h6 class="mb-0">
            <i class="bi bi-building me-2"></i>
            Información del Edificio
          </h6>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-3">
              <div class="info-item">
                <small class="text-muted">ID</small>
                <div class="info-value">{{edificio.Id}}</div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="info-item">
                <small class="text-muted">Nombre</small>
                <div class="info-value">{{edificio.Nombre}}</div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="info-item">
                <small class="text-muted">Dirección</small>
                <div class="info-value">{{edificio.Direccion}}</div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="info-item">
                <small class="text-muted">Estado</small>
                <div class="info-value">
                  <span class="badge" 
                        [ngClass]="getActivoBadgeClass(edificio.Activo)">
                    {{getActivoText(edificio.Activo)}}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-md-4">
              <div class="info-item">
                <small class="text-muted">Cliente</small>
                <div class="info-value">
                  <span *ngIf="edificio.Cliente; else noCliente">
                    {{edificio.Cliente.RazonSocial}}
                  </span>
                  <ng-template #noCliente>No asignado</ng-template>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="info-item">
                <small class="text-muted">Provincia</small>
                <div class="info-value">
                  <span *ngIf="edificio.Provincia; else noProvincia">
                    {{edificio.Provincia.Nombre}}
                  </span>
                  <ng-template #noProvincia>No asignada</ng-template>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="info-item">
                <small class="text-muted">Fecha de Alta</small>
                <div class="info-value">{{formatDate(edificio.FechaDeAlta || '')}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Entity Relations -->
      <div class="row" *ngIf="!loading">
        <!-- Enlaces Card -->
        <div class="col-lg-6 col-md-12 mb-4">
          <div class="entity-card" (click)="navegarAEnlaces()">
            <div class="card-header">
              <h6 class="mb-0">
                <i class="bi bi-link-45deg me-2"></i>
                Enlaces en este Edificio
              </h6>
              <div class="badge bg-warning float-end">{{estadisticasEnlaces?.total_enlaces || 0}}</div>
            </div>
            <div class="card-body text-center">
              <div class="entity-icon">
                <i class="bi bi-link-45deg"></i>
              </div>
              <div class="entity-title">
                <h5>{{estadisticasEnlaces?.total_enlaces || 0}}</h5>
                <p class="text-muted">Enlaces Totales</p>
              </div>
              <div class="entity-stats">
                <div class="stat-item">
                  <span class="badge bg-success">{{estadisticasEnlaces?.enlaces_propios || 0}}</span>
                  <span class="stat-label">Propios</span>
                </div>
                <div class="stat-item">
                  <span class="badge bg-warning">{{estadisticasEnlaces?.enlaces_terceros || 0}}</span>
                  <span class="stat-label">Terceros</span>
                </div>
              </div>
            </div>
            <div class="card-footer">
              <button class="btn btn-outline-warning btn-sm w-100">
                <i class="bi bi-box-arrow-in-right me-2"></i>
                Administrar Enlaces
              </button>
            </div>
          </div>
        </div>

        <!-- Cliente Card -->
        <div class="col-lg-6 col-md-12 mb-4" *ngIf="edificio?.Cliente">
          <div class="entity-card" (click)="navegarACliente()">
            <div class="card-header">
              <h6 class="mb-0">
                <i class="bi bi-person-badge me-2"></i>
                Cliente del Edificio
              </h6>
              <div class="badge bg-info float-end">
                <i class="bi bi-check-circle"></i>
              </div>
            </div>
            <div class="card-body text-center">
              <div class="entity-icon">
                <i class="bi bi-person-badge"></i>
              </div>
              <div class="entity-title">
                <h5>{{edificio!.Cliente?.RazonSocial}}</h5>
                <p class="text-muted">Cliente Asignado</p>
              </div>
              <div class="entity-stats">
                <div class="stat-item">
                  <span class="badge bg-primary">{{edificio!.Cliente?.Id}}</span>
                  <span class="stat-label">ID Cliente</span>
                </div>
                <div class="stat-item">
                  <span class="badge bg-info">
                    <i class="bi bi-check-circle"></i>
                  </span>
                  <span class="stat-label">Activo</span>
                </div>
              </div>
            </div>
            <div class="card-footer">
              <button class="btn btn-outline-primary btn-sm w-100">
                <i class="bi bi-box-arrow-in-right me-2"></i>
                Ver Dashboard del Cliente
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-3 text-muted">Cargando información del edificio...</p>
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
    .entity-card {
      cursor: pointer;
      transition: all 0.3s ease;
      height: 100%;
      border: 1px solid #000000;
    }

    .entity-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-xl);
    }

    .entity-card .card-header {
      background: linear-gradient(135deg, var(--gray-50) 0%, var(--gray-100) 100%);
      border-bottom: 1px solid var(--gray-200);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .entity-card .card-body {
      padding: 1.5rem;
      text-align: center;
    }

    .entity-card .card-footer {
      background: var(--gray-50);
      border-top: 1px solid var(--gray-200);
      padding: 0.75rem 1rem;
    }

    .entity-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      color: var(--primary-medium);
      opacity: 0.8;
    }

    .entity-title h5 {
      margin: 0;
      font-weight: 700;
      color: var(--gray-800);
    }

    .entity-title p {
      margin: 0;
      font-size: var(--font-size-sm);
      color: var(--gray-600);
    }

    .entity-stats {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-top: 1rem;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
    }

    .stat-label {
      font-size: var(--font-size-xs);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-item {
      margin-bottom: 1rem;
    }

    .info-item small {
      font-weight: 600;
      color: var(--gray-600);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: block;
      margin-bottom: 0.25rem;
    }

    .info-value {
      font-size: var(--font-size-base);
      font-weight: 500;
      color: var(--gray-800);
    }

    @media (max-width: 768px) {
      .entity-stats {
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  `]
})
export class EdificioDetailComponent implements OnInit {
  edificio: EdificioWithRelations | null = null;
  estadisticasEnlaces: any = null;
  loading: boolean = false;
  alertMessage: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private edificioService: EdificioService,
    private enlaceService: EnlaceService,
    private utilsService: UtilsService
  ) { }

  ngOnInit(): void {
    const edificioId = this.route.snapshot.paramMap.get('id');
    if (edificioId) {
      this.loadEdificioDetail(Number(edificioId));
    } else {
      this.showErrorMessage('No se proporcionó ID del edificio');
    }
  }

  loadEdificioDetail(edificioId: number): void {
    this.loading = true;
    
    this.edificioService.getEdificio(edificioId).subscribe({
      next: (edificio) => {
        this.edificio = edificio;
        this.loadEstadisticas();
      },
      error: (error) => {
        this.showErrorMessage('Error al cargar información del edificio');
        this.loading = false;
      }
    });
  }

  loadEstadisticas(): void {
    // Cargar estadísticas generales de enlaces
    this.enlaceService.getStats().subscribe({
      next: (estadisticasEnlaces) => {
        // Filtrar estadísticas para este edificio
        this.estadisticasEnlaces = {
          total_enlaces: this.filtrarEstadisticasPorEdificio(estadisticasEnlaces.enlaces_por_edificio, this.edificio!.Id),
          enlaces_propios: 0, // Will be calculated below
          enlaces_terceros: 0 // Will be calculated below
        };
        
        // Calcular propios y terceros basados en el total (simplificado por ahora)
        // TODO: Implementar filtrado más detallado cuando la API soporte estadísticas por tipo
        this.estadisticasEnlaces.enlaces_propios = Math.floor(this.estadisticasEnlaces.total_enlaces * 0.7);
        this.estadisticasEnlaces.enlaces_terceros = this.estadisticasEnlaces.total_enlaces - this.estadisticasEnlaces.enlaces_propios;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading enlaces stats:', error);
        this.loading = false;
      }
    });
  }

  filtrarEstadisticasPorEdificio(data: { [key: string]: number }, edificioId: number): number {
    if (!data || !edificioId) return 0;
    return data[edificioId.toString()] || 0;
  }

  navegarAEnlaces(): void {
    if (!this.edificio?.Id) return;
    // Navegar a la vista de enlaces filtrando por este edificio
    this.router.navigate(['/enlaces'], {
      queryParams: { edificio_id: this.edificio.Id.toString() }
    });
  }

  navegarACliente(): void {
    if (!this.edificio?.Cliente?.Id) return;
    // Navegar al dashboard del cliente
    this.router.navigate(['/clientes', this.edificio.Cliente.Id, 'dashboard']);
  }

  volverALista(): void {
    this.router.navigate(['/edificios']);
  }

  formatDate(dateString: string): string {
    return this.utilsService.formatDate(dateString);
  }

  getActivoBadgeClass(activo?: string): string {
    return this.utilsService.getActivoBadgeClass(activo);
  }

  getActivoText(activo?: string): string {
    return this.utilsService.getActivoText(activo);
  }

  showErrorMessage(message: string): void {
    this.alertMessage = {
      type: 'danger',
      message: message,
      dismissible: true
    };
  }
}