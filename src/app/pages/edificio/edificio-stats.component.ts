import { Component, OnInit } from '@angular/core';

import { EdificioService } from '../../services/edificio.service';
import { ClienteService } from '../../services/cliente.service';
import { EdificioStatsResponse } from '../../models/edificio.model';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-edificio-stats',
  template: `
    <div class="container-fluid py-4">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">Estadísticas de Edificios</h2>
          <p class="text-muted mb-0">Vista general y métricas de edificios del sistema</p>
        </div>
        <button type="button" 
                class="btn btn-outline-primary-custom"
                routerLink="/edificios">
          <i class="bi bi-arrow-left me-2"></i>
          Volver a Edificios
        </button>
      </div>

      <!-- Main Stats Cards Grid -->
      <div class="stats-grid">
        <div class="stats-card primary">
          <div class="stats-icon">
            <i class="bi bi-building"></i>
          </div>
          <div class="stats-content">
            <h3>{{stats?.total_edificios || 0}}</h3>
            <p class="mb-0">Total de Edificios</p>
          </div>
        </div>
        
        <div class="stats-card success">
          <div class="stats-icon">
            <i class="bi bi-check-circle"></i>
          </div>
          <div class="stats-content">
            <h3>{{stats?.edificios_con_email || 0}}</h3>
            <p class="mb-0">Edificios con Email</p>
          </div>
        </div>
        
        <div class="stats-card danger">
          <div class="stats-icon">
            <i class="bi bi-x-circle"></i>
          </div>
          <div class="stats-content">
            <h3>{{stats?.edificios_sin_email || 0}}</h3>
            <p class="mb-0">Edificios sin Email</p>
          </div>
        </div>
        
        <div class="stats-card info">
          <div class="stats-icon">
            <i class="bi bi-people"></i>
          </div>
          <div class="stats-content">
            <h3>{{clientes.length}}</h3>
            <p class="mb-0">Clientes con Edificios</p>
          </div>
        </div>
      </div>

      <!-- Additional Stats -->
      <div class="row mt-4">
        <div class="col-md-6 mb-4">
          <div class="card gestel-card">
            <div class="card-header">
              <h6 class="mb-0">
                <i class="bi bi-pie-chart me-2"></i>
                Distribución por Estado
              </h6>
            </div>
            <div class="card-body">
              <div class="progress mb-3" style="height: 25px;">
                <div class="progress-bar bg-success" 
                     [style.width]="getActivosPercentage() + '%'"
                     attr.aria-valuenow="{{getActivosPercentage()}}"
                     aria-valuemin="0" 
                     aria-valuemax="100">
                  {{getActivosPercentage()}}% Con Email
                </div>
                <div class="progress-bar bg-danger" 
                     [style.width]="getInactivosPercentage() + '%'"
                     attr.aria-valuenow="{{getInactivosPercentage()}}"
                     aria-valuemin="0" 
                     aria-valuemax="100">
                  {{getInactivosPercentage()}}% Sin Email
                </div>
              </div>
              <div class="d-flex justify-content-between text-small">
                <span><i class="bi bi-circle-fill text-success me-1"></i>Con Email: {{stats?.edificios_con_email || 0}}</span>
                <span><i class="bi bi-circle-fill text-danger me-1"></i>Sin Email: {{stats?.edificios_sin_email || 0}}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-6 mb-4">
          <div class="card gestel-card">
            <div class="card-header">
              <h6 class="mb-0">
                <i class="bi bi-graph-up me-2"></i>
                Métricas Clave
              </h6>
            </div>
            <div class="card-body">
              <div class="row text-center">
                <div class="col-6">
                  <div class="metric-item">
                    <h4 class="text-primary mb-1">{{getEdificiosPerClient()}}</h4>
                    <p class="mb-0 text-muted">Prom. Edif/Cliente</p>
                  </div>
                </div>
                <div class="col-6">
                  <div class="metric-item">
                    <h4 class="text-info mb-1">{{getActivationRate()}}</h4>
                    <p class="mb-0 text-muted">Índice de Activación</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Charts Section -->
      <div class="row mt-4">
        <div class="col-md-6 mb-4">
          <div class="card gestel-card">
            <div class="card-header">
              <h6 class="mb-0">
                <i class="bi bi-building me-2"></i>
                Top 5 Clientes por Edificios
              </h6>
            </div>
            <div class="card-body">
              <div *ngIf="hasEdificiosPorCliente()">
                <div *ngFor="let item of getTopClientesPorEdificios(); let i = index" 
                     class="d-flex justify-content-between align-items-center mb-2 p-2 rounded bg-light">
                  <span>
                    <span class="badge bg-primary me-2">{{i + 1}}</span>
                    {{item.cliente}}
                  </span>
                  <span class="badge bg-info">{{item.count}} edificios</span>
                </div>
              </div>
              <div *ngIf="!hasEdificiosPorCliente()" class="text-center text-muted py-3">
                <i class="bi bi-inbox display-4"></i>
                <p class="mb-0">No hay datos disponibles</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-6 mb-4">
          <div class="card gestel-card">
            <div class="card-header">
              <h6 class="mb-0">
                <i class="bi bi-geo-alt me-2"></i>
                Top 5 Provincias por Edificios
              </h6>
            </div>
            <div class="card-body">
              <div *ngIf="hasEdificiosPorProvincia()">
                <div *ngFor="let item of getTopProvinciasPorEdificios(); let i = index" 
                     class="d-flex justify-content-between align-items-center mb-2 p-2 rounded bg-light">
                  <span>
                    <span class="badge bg-success me-2">{{i + 1}}</span>
                    {{item.provincia}}
                  </span>
                  <span class="badge bg-warning text-dark">{{item.count}} edificios</span>
                </div>
              </div>
              <div *ngIf="!hasEdificiosPorProvincia()" class="text-center text-muted py-3">
                <i class="bi bi-inbox display-4"></i>
                <p class="mb-0">No hay datos disponibles</p>
              </div>
            </div>
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
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stats-card {
      background: var(--white);
      border-radius: var(--border-radius-lg);
      padding: 0;
      box-shadow: var(--shadow-md);
      border: 1px solid var(--gray-200);
      overflow: hidden;
      transition: all 0.3s ease;
      position: relative;
    }

    .stats-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-xl);
    }

    .stats-card.primary {
      background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-medium) 100%);
      color: var(--white);
      border: none;
    }

    .stats-card.success {
      background: linear-gradient(135deg, var(--success) 0%, #16a34a 100%);
      color: var(--white);
      border: none;
    }

    .stats-card.danger {
      background: linear-gradient(135deg, var(--danger) 0%, #dc2626 100%);
      color: var(--white);
      border: none;
    }

    .stats-card.info {
      background: linear-gradient(135deg, var(--info) 0%, #2563eb 100%);
      color: var(--white);
      border: none;
    }

    .stats-icon {
      position: absolute;
      top: 1rem;
      right: 1rem;
      font-size: 2rem;
      opacity: 0.3;
    }

    .stats-content {
      padding: 1.5rem;
      text-align: center;
    }

    .stats-content h3 {
      font-size: var(--font-size-3xl);
      font-weight: 700;
      margin: 0 0 0.5rem 0;
    }

    .stats-content p {
      font-size: var(--font-size-base);
      opacity: 0.9;
      margin: 0;
    }

    .progress {
      background-color: var(--gray-200);
      border-radius: var(--border-radius-lg);
    }

    .metric-item {
      padding: 1rem;
      border-radius: var(--border-radius);
      background-color: var(--gray-50);
      margin-bottom: 1rem;
      transition: all 0.2s ease;
    }

    .metric-item:hover {
      background-color: var(--gray-100);
      transform: scale(1.02);
    }

    .metric-item h4 {
      margin: 0;
      font-weight: 700;
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    }
  `]
})
export class EdificioStatsComponent implements OnInit {
  stats: EdificioStatsResponse | null = null;
  clientes: Cliente[] = [];
  loading: boolean = false;
  alertMessage: any;

  constructor(
    private edificioService: EdificioService,
    private clienteService: ClienteService
  ) { }

  ngOnInit(): void {
    this.loadStats();
    this.loadClientes();
  }

  loadStats(): void {
    this.loading = true;
    this.edificioService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loading = false;
      },
      error: (error) => {
        this.alertMessage = {
          type: 'danger',
          message: 'Error al cargar las estadísticas. Por favor, inténtelo de nuevo.',
          dismissible: true
        };
        this.loading = false;
      }
    });
  }

  loadClientes(): void {
    this.clienteService.getClientes({
      page: 1,
      page_size: 1000,
      activo: 'S'
    }).subscribe(response => {
      this.clientes = response.data;
    });
  }

  getActivosPercentage(): number {
    if (!this.stats || this.stats.total_edificios === 0) return 0;
    return Math.round((this.stats.edificios_con_email / this.stats.total_edificios) * 100);
  }

  getInactivosPercentage(): number {
    if (!this.stats || this.stats.total_edificios === 0) return 0;
    return Math.round((this.stats.edificios_sin_email / this.stats.total_edificios) * 100);
  }

  getEdificiosPerClient(): string {
    if (this.clientes.length === 0) return '0';
    const avg = ((this.stats?.total_edificios || 0) / this.clientes.length).toFixed(1);
    return avg;
  }

  getActivationRate(): string {
    const percentage = this.getActivosPercentage();
    if (percentage >= 80) return 'Excelente';
    if (percentage >= 60) return 'Bueno';
    if (percentage >= 40) return 'Regular';
    return 'Bajo';
  }

  getTopClientesPorEdificios() {
    if (!this.stats?.edificios_por_cliente) return [];
    return Object.entries(this.stats.edificios_por_cliente)
      .map(([cliente, count]) => ({ cliente, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  getTopProvinciasPorEdificios() {
    if (!this.stats?.edificios_por_provincia) return [];
    return Object.entries(this.stats.edificios_por_provincia)
      .map(([provincia, count]) => ({ provincia, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  hasEdificiosPorCliente(): boolean {
    if (!this.stats?.edificios_por_cliente) return false;
    return Object.keys(this.stats.edificios_por_cliente).length > 0;
  }

  hasEdificiosPorProvincia(): boolean {
    if (!this.stats?.edificios_por_provincia) return false;
    return Object.keys(this.stats.edificios_por_provincia).length > 0;
  }
}