import { Component, OnInit } from '@angular/core';

import { ClienteService } from '../../services/cliente.service';
import { ClienteStatsResponse } from '../../models/cliente.model';

@Component({
  selector: 'app-cliente-stats',
  template: `
    <div class="container-fluid py-4">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">Estadísticas de Clientes</h2>
          <p class="text-muted mb-0">Vista general y métricas de clientes del sistema</p>
        </div>
        <button type="button" 
                class="btn btn-outline-primary-custom"
                routerLink="/clientes">
          <i class="bi bi-arrow-left me-2"></i>
          Volver a Clientes
        </button>
      </div>

      <!-- Stats Cards Grid -->
      <div class="stats-grid">
        <div class="stats-card primary">
          <div class="stats-icon">
            <i class="bi bi-people"></i>
          </div>
          <div class="stats-content">
            <h3>{{stats?.total_clientes || 0}}</h3>
            <p class="mb-0">Total de Clientes</p>
          </div>
        </div>
        
        <div class="stats-card success">
          <div class="stats-icon">
            <i class="bi bi-check-circle"></i>
          </div>
          <div class="stats-content">
            <h3>{{stats?.clientes_activos || 0}}</h3>
            <p class="mb-0">Clientes Activos</p>
          </div>
        </div>
        
        <div class="stats-card danger">
          <div class="stats-icon">
            <i class="bi bi-x-circle"></i>
          </div>
          <div class="stats-content">
            <h3>{{stats?.clientes_inactivos || 0}}</h3>
            <p class="mb-0">Clientes Inactivos</p>
          </div>
        </div>
        
        <div class="stats-card info">
          <div class="stats-icon">
            <i class="bi bi-percent"></i>
          </div>
          <div class="stats-content">
            <h3>{{getActivosPercentage()}}%</h3>
            <p class="mb-0">Tasa de Activación</p>
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
                  {{getActivosPercentage()}}% Activos
                </div>
                <div class="progress-bar bg-danger" 
                     [style.width]="getInactivosPercentage() + '%'"
                     attr.aria-valuenow="{{getInactivosPercentage()}}"
                     aria-valuemin="0" 
                     aria-valuemax="100">
                  {{getInactivosPercentage()}}% Inactivos
                </div>
              </div>
              <div class="d-flex justify-content-between text-small">
                <span><i class="bi bi-circle-fill text-success me-1"></i>Activos: {{stats?.clientes_activos || 0}}</span>
                <span><i class="bi bi-circle-fill text-danger me-1"></i>Inactivos: {{stats?.clientes_inactivos || 0}}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-6 mb-4">
          <div class="card gestel-card">
            <div class="card-header">
              <h6 class="mb-0">
                <i class="bi bi-activity me-2"></i>
                Métricas Clave
              </h6>
            </div>
            <div class="card-body">
              <div class="row text-center">
                <div class="col-6">
                  <div class="metric-item">
                    <h4 class="text-primary mb-1">{{getActivationRate()}}</h4>
                    <p class="mb-0 text-muted">Índice de Activación</p>
                  </div>
                </div>
                <div class="col-6">
                  <div class="metric-item">
                    <h4 class="text-info mb-1">{{getInactivationRate()}}</h4>
                    <p class="mb-0 text-muted">Índice de Inactivación</p>
                  </div>
                </div>
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
export class ClienteStatsComponent implements OnInit {
  stats: ClienteStatsResponse | null = null;
  loading: boolean = false;
  alertMessage: any;

  constructor(private clienteService: ClienteService) { }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    this.clienteService.getStats().subscribe({
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

  getActivosPercentage(): number {
    if (!this.stats || this.stats.total_clientes === 0) return 0;
    return Math.round((this.stats.clientes_activos / this.stats.total_clientes) * 100);
  }

  getInactivosPercentage(): number {
    if (!this.stats || this.stats.total_clientes === 0) return 0;
    return Math.round((this.stats.clientes_inactivos / this.stats.total_clientes) * 100);
  }

  getActivationRate(): string {
    const percentage = this.getActivosPercentage();
    if (percentage >= 80) return 'Excelente';
    if (percentage >= 60) return 'Bueno';
    if (percentage >= 40) return 'Regular';
    return 'Bajo';
  }

  getInactivationRate(): string {
    const percentage = this.getInactivosPercentage();
    if (percentage <= 10) return 'Muy Bajo';
    if (percentage <= 20) return 'Bajo';
    if (percentage <= 30) return 'Moderado';
    return 'Alto';
  }
}