import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { ProvinciaService } from '../../services/provincia.service';
import { UtilsService } from '../../services/utils.service';
import { Provincia } from '../../models/provincia.model';

@Component({
  selector: 'app-provincia-stats',
  template: `
    <div class="container-fluid py-4">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">Estadísticas de Provincias</h2>
          <p class="text-muted mb-0">Vista general y métricas de provincias del sistema</p>
        </div>
        <button type="button" 
                class="btn btn-outline-primary-custom"
                routerLink="/provincias">
          <i class="bi bi-arrow-left me-2"></i>
          Volver a Provincias
        </button>
      </div>

      <!-- Stats Cards Grid -->
      <div class="stats-grid">
        <div class="stats-card primary">
          <div class="stats-icon">
            <i class="bi bi-geo-alt"></i>
          </div>
          <div class="stats-content">
            <h3>{{stats?.total_provincias || 0}}</h3>
            <p class="mb-0">Total de Provincias</p>
          </div>
        </div>
        
        <div class="stats-card success">
          <div class="stats-icon">
            <i class="bi bi-building"></i>
          </div>
          <div class="stats-content">
            <h3>{{stats?.provincias_con_edificios || 0}}</h3>
            <p class="mb-0">Provincias con Edificios</p>
          </div>
        </div>
        
        <div class="stats-card danger">
          <div class="stats-icon">
            <i class="bi bi-exclamation-triangle"></i>
          </div>
          <div class="stats-content">
            <h3>{{stats?.provincias_sin_edificios || 0}}</h3>
            <p class="mb-0">Provincias sin Edificios</p>
          </div>
        </div>
        
        <div class="stats-card info">
          <div class="stats-icon">
            <i class="bi bi-percent"></i>
          </div>
          <div class="stats-content">
            <h3>{{getCoveragePercentage()}}%</h3>
            <p class="mb-0">Cobertura</p>
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
                     [style.width]="getWithEdificiosPercentage() + '%'"
                     attr.aria-valuenow="{{getWithEdificiosPercentage()}}"
                     aria-valuemin="0" 
                     aria-valuemax="100">
                  {{getWithEdificiosPercentage()}}% con Edificios
                </div>
                <div class="progress-bar bg-danger" 
                     [style.width]="getWithoutEdificiosPercentage() + '%'"
                     attr.aria-valuenow="{{getWithoutEdificiosPercentage()}}"
                     aria-valuemin="0" 
                     aria-valuemax="100">
                  {{getWithoutEdificiosPercentage()}}% sin Edificios
                </div>
              </div>
              <div class="d-flex justify-content-between text-small">
                <span><i class="bi bi-building-fill text-success me-1"></i>Con Edificios: {{stats?.provincias_con_edificios || 0}}</span>
                <span><i class="bi bi-x-circle text-danger me-1"></i>Sin Edificios: {{stats?.provincias_sin_edificios || 0}}</span>
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
                    <h4 class="text-primary mb-1">{{getEdificiosPerProvince()}}</h4>
                    <p class="mb-0 text-muted">Prom. Edif/Prov</p>
                  </div>
                </div>
                <div class="col-6">
                  <div class="metric-item">
                    <h4 class="text-info mb-1">{{getCoverageRate()}}</h4>
                    <p class="mb-0 text-muted">Índice de Cobertura</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Geographic Distribution -->
      <div class="row mt-4">
        <div class="col-12">
          <div class="card gestel-card">
            <div class="card-header">
              <h6 class="mb-0">
                <i class="bi bi-map me-2"></i>
                Distribución Geográfica
              </h6>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-4">
                  <div class="stat-item text-center p-3">
                    <h5 class="text-primary mb-1">{{stats?.provincias_con_edificios || 0}}</h5>
                    <p class="mb-0 text-muted">Provincias Activas</p>
                    <div class="small mt-2">
                      <i class="bi bi-geo-alt text-success"></i>
                      Con cobertura de edificios
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="stat-item text-center p-3">
                    <h5 class="text-warning mb-1">{{stats?.provincias_sin_edificios || 0}}</h5>
                    <p class="mb-0 text-muted">Provincias Inactivas</p>
                    <div class="small mt-2">
                      <i class="bi bi-geo-alt text-danger"></i>
                      Sin cobertura de edificios
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="stat-item text-center p-3">
                    <h5 class="text-info mb-1">{{getTotalActivePercentage()}}%</h5>
                    <p class="mb-0 text-muted">Tasa de Activación</p>
                    <div class="small mt-2">
                      <i class="bi bi-graph-up text-info"></i>
                      Porcentaje de provincias con edificios
                    </div>
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

    .stat-item {
      background: linear-gradient(135deg, var(--gray-50) 0%, var(--gray-100) 100%);
      border-radius: var(--border-radius-lg);
      border: 1px solid var(--gray-200);
      margin-bottom: 1rem;
      transition: all 0.3s ease;
    }

    .stat-item:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .stat-item h5 {
      margin: 0;
      font-weight: 700;
    }

    .stat-item p {
      margin: 0;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    }
  `]
})
export class ProvinciaStatsComponent implements OnInit {
  stats: any;
  loading: boolean = false;
  alertMessage: any;

  constructor(
    private provinciaService: ProvinciaService
  ) { }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    this.provinciaService.getStats().subscribe({
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

  getWithEdificiosPercentage(): number {
    if (!this.stats || this.stats.total_provincias === 0) return 0;
    return Math.round((this.stats.provincias_con_edificios / this.stats.total_provincias) * 100);
  }

  getWithoutEdificiosPercentage(): number {
    if (!this.stats || this.stats.total_provincias === 0) return 0;
    return Math.round((this.stats.provincias_sin_edificios / this.stats.total_provincias) * 100);
  }

  getCoveragePercentage(): number {
    if (!this.stats || this.stats.total_provincias === 0) return 0;
    return Math.round((this.stats.provincias_con_edificios / this.stats.total_provincias) * 100);
  }

  getEdificiosPerProvince(): string {
    if (!this.stats || this.stats.provincias_con_edificios === 0 || this.stats.provincias_con_edificios === null) return '0';
    const avg = (this.stats.provincias_con_edificios / this.stats.total_provincias).toFixed(1);
    return avg;
  }

  getCoverageRate(): string {
    const percentage = this.getCoveragePercentage();
    if (percentage >= 80) return 'Excelente';
    if (percentage >= 60) return 'Bueno';
    if (percentage >= 40) return 'Regular';
    return 'Bajo';
  }

  getTotalActivePercentage(): number {
    if (!this.stats || this.stats.total_provincias === 0) return 0;
    return Math.round((this.stats.provincias_con_edificios / this.stats.total_provincias) * 100);
  }
}