import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { EdificioService } from '../../services/edificio.service';
import { EnlaceService } from '../../services/enlace.service';
import { UtilsService } from '../../services/utils.service';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-cliente-dashboard',
  template: `
    <div class="container-fluid py-4">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">Dashboard del Cliente</h2>
          <p class="text-muted mb-0" *ngIf="cliente">Vista general del cliente: <strong>{{cliente.RazonSocial}}</strong></p>
        </div>
        <button type="button" 
                class="btn btn-outline-primary-custom"
                (click)="volverALista()">
          <i class="bi bi-arrow-left me-2"></i>
          Volver a Lista de Clientes
        </button>
      </div>



      <!-- Entity Cards -->
      <div class="row" *ngIf="!loading">
        <!-- Edificios Card -->
        <div class="col-lg-4 col-md-6 mb-4">
          <div class="entity-card" (click)="navegarAEdificios()">
            <div class="card-header">
              <h6 class="mb-0">
                <i class="bi bi-building me-2"></i>
                Edificios
              </h6>
              <div class="badge bg-info float-end">{{estadisticas?.total_edificios || 0}}</div>
            </div>
            <div class="card-body text-center">
              <div class="entity-icon">
                <i class="bi bi-building"></i>
              </div>
              <div class="entity-title">
                <h5>{{estadisticas?.total_edificios || 0}}</h5>
                <p class="text-muted">Edificios Totales</p>
              </div>
              <div class="entity-stats">
                <div class="stat-item">
                  <span class="badge bg-success">{{estadisticas?.edificios_activos || 0}}</span>
                  <span class="stat-label">Activos</span>
                </div>
                <div class="stat-item">
                  <span class="badge bg-danger">{{estadisticas?.edificios_inactivos || 0}}</span>
                  <span class="stat-label">Inactivos</span>
                </div>
              </div>
            </div>
            <div class="card-footer">
              <button class="btn btn-outline-primary btn-sm w-100">
                <i class="bi bi-box-arrow-in-right me-2"></i>
                Administrar Edificios
              </button>
            </div>
          </div>
        </div>

        <!-- Enlaces Card -->
        <div class="col-lg-4 col-md-6 mb-4">
          <div class="entity-card" (click)="navegarAEnlaces()">
            <div class="card-header">
              <h6 class="mb-0">
                <i class="bi bi-link-45deg me-2"></i>
                Enlaces
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

        <!-- Dominios Card -->
        <div class="col-lg-4 col-md-6 mb-4">
          <div class="entity-card">
            <div class="card-header">
              <h6 class="mb-0">
                <i class="bi bi-globe me-2"></i>
                Dominios
              </h6>
              <div class="badge bg-secondary float-end">
                <i class="bi bi-hourglass"></i>
              </div>
            </div>
            <div class="card-body text-center">
              <div class="entity-icon">
                <i class="bi bi-globe"></i>
              </div>
              <div class="entity-title">
                <h5>-</h5>
                <p class="text-muted">Dominios</p>
              </div>
              <div class="entity-stats">
                <div class="stat-item">
                  <span class="badge bg-secondary">
                    <i class="bi bi-hourglass"></i>
                  </span>
                  <span class="stat-label">Próximamente</span>
                </div>
              </div>
            </div>
            <div class="card-footer">
              <button class="btn btn-outline-secondary btn-sm w-100" disabled>
                <i class="bi bi-box-arrow-in-right me-2"></i>
                Administrar Dominios
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
        <p class="mt-3 text-muted">Cargando información del dashboard...</p>
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

    @media (max-width: 768px) {
      .entity-stats {
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  `]
})
export class ClienteDashboardComponent implements OnInit {
  cliente: Cliente | null = null;
  estadisticas: any = null;
  estadisticasEnlaces: any = null;
  loading: boolean = false;
  alertMessage: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clienteService: ClienteService,
    private edificioService: EdificioService,
    private enlaceService: EnlaceService,
    private utilsService: UtilsService
  ) { }

  ngOnInit(): void {
    const clienteId = this.route.snapshot.paramMap.get('id');
    if (clienteId) {
      this.loadClienteDashboard(Number(clienteId));
    } else {
      this.showErrorMessage('No se proporcionó ID del cliente');
    }
  }

  loadClienteDashboard(clienteId: number): void {
    this.loading = true;
    
    this.clienteService.getCliente(clienteId).subscribe({
      next: (cliente) => {
        this.cliente = cliente;
        this.loadEstadisticas();
      },
      error: (error) => {
        this.showErrorMessage('Error al cargar información del cliente');
        this.loading = false;
      }
    });
  }

  loadEstadisticas(): void {
    
    this.edificioService.getStatsPorCliente(this.cliente!.Id).subscribe({
      next: (estadisticas) => {
        this.estadisticas = {
          total_edificios: estadisticas.total_edificios || 0,
          edificios_activos: estadisticas.edificios_con_email || 0,
          edificios_inactivos: estadisticas.edificios_sin_email || 0
        };
      },
      error: (error) => {
        this.estadisticas = { total_edificios: 0, edificios_activos: 0, edificios_inactivos: 0 };
      }
    });

    this.enlaceService.getStatsPorCliente(this.cliente!.Id).subscribe({
      next: (estadisticasEnlaces) => {
        this.estadisticasEnlaces = estadisticasEnlaces;
        this.loading = false;
      },
      error: (error) => {
        this.estadisticasEnlaces = { total_enlaces: 0, enlaces_propios: 0, enlaces_terceros: 0 };
        this.loading = false;
      }
    });
  }

  filtrarEstadisticasPorCliente(data: any[], clienteId: number): any {
    if (!data || !clienteId) {
      return { total: 0, activos: 0, inactivos: 0 };
    }
    
    const clienteStat = data.find((item: any) => item.cliente_id === clienteId);
    if (!clienteStat) {

      return { total: 0, activos: 0, inactivos: 0 };
    }
    
    return {
      total: clienteStat.total_edificios || 0,
      activos: clienteStat.edificios_activos || 0,
      inactivos: clienteStat.edificios_inactivos || 0
    };
  }

  navegarAEdificios(): void {
    if (!this.cliente?.Id) return;
    
    this.router.navigate(['/edificios'], {
      queryParams: { cliente_id: this.cliente.Id.toString(), activo: 'S' }
    });
  }

  navegarAEnlaces(): void {
    if (!this.cliente?.Id) return;
    
    this.router.navigate(['/enlaces'], {
      queryParams: { cliente_id: this.cliente.Id.toString() }
    });
  }

  navegarADominios(): void {
    if (!this.cliente?.Id) return;
    
    this.router.navigate(['/dominios'], {
      queryParams: { cliente_id: this.cliente.Id.toString() }
    });
  }

  volverALista(): void {
    this.router.navigate(['/clientes']);
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