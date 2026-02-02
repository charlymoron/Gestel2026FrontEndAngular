import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { ClienteService } from '../../services/cliente.service';
import { UtilsService } from '../../services/utils.service';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-cliente-list',
  template: `
    <div style="background: #f8f9fa; min-height: 100vh; padding: 20px;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <div>
          <h2 style="margin: 0 0 8px 0; color: #0a4d68; font-size: 24px; font-weight: 700;">Clientes</h2>
          <p style="margin: 0; color: #6c757d;">Gestión de clientes del sistema</p>
        </div>
        <button type="button" 
                style="background: linear-gradient(135deg, #0a4d68 0%, #088395 100%); color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 500; cursor: pointer; display: flex; align-items: center; transition: all 0.2s ease;"
                (click)="openCreateModal()">
          <i class="bi bi-plus-circle" style="margin-right: 8px;"></i>
          Nuevo Cliente
        </button>
      </div>

      <!-- Alert Messages -->
      <div *ngIf="alertMessage" 
           style="position: fixed; top: 16px; left: 16px; right: 16px; z-index: 1060;">
        <div style="background: white; border: 1px solid #e9ecef; border-radius: 8px; padding: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); margin-bottom: 8px;"
             [style.background-color]="alertMessage?.type === 'success' ? '#d4edda' : alertMessage?.type === 'danger' ? '#f8d7da' : '#d1ecf1'"
             [style.border-left]="alertMessage?.type === 'success' ? '4px solid #28a745' : alertMessage?.type === 'danger' ? '4px solid #dc3545' : '4px solid #17a2b8'">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <strong [style.color]="alertMessage?.type === 'success' ? '#155724' : alertMessage?.type === 'danger' ? '#721c24' : '#0c5460'">
                {{ alertMessage?.message }}
              </strong>
            </div>
            <button type="button" 
                    style="background: none; border: none; font-size: 18px; cursor: pointer; padding: 0; margin-left: 16px;"
                    (click)="alertMessage = null">
              ×
            </button>
          </div>
        </div>
      </div>

      <!-- Cliente Form Modal -->
      <div *ngIf="showClienteModal" 
           style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1050; display: flex; align-items: center; justify-content: center;">
        <div style="background: white; border-radius: 12px; min-width: 500px; max-width: 90vw; max-height: 90vh; overflow-y: auto; box-shadow: 0 8px 32px rgba(0,0,0,0.15);">
          <!-- Modal Header -->
          <div style="background: linear-gradient(135deg, #0a4d68 0%, #088395 100%); color: white; padding: 20px 24px; border-radius: 12px 12px 0 0; display: flex; justify-content: space-between; align-items: center;">
            <h5 style="margin: 0; font-size: 18px; font-weight: 600;">
              <i class="bi bi-person-plus" style="margin-right: 8px;"></i>
              {{ clienteModalTitle }}
            </h5>
            <button type="button" 
                    style="background: none; border: none; color: white; font-size: 24px; cursor: pointer; padding: 0;"
                    (click)="closeClienteModal()">
              ×
            </button>
          </div>
          
          <!-- Modal Body -->
          <div style="padding: 24px;">
            <!-- Form -->
            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #0a4d68;">Razón Social *</label>
              <input type="text" 
                     [(ngModel)]="clienteFormData.RazonSocial"
                     style="width: 100%; padding: 12px; border: 2px solid #e9ecef; border-radius: 6px; font-size: 16px;"
                     placeholder="Ingrese la razón social del cliente">
            </div>

            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #0a4d68;">Fecha de Alta</label>
              <input type="text" 
                     [value]="formatDate(clienteFormData.FechaDeAlta)"
                     readonly
                     style="width: 100%; padding: 12px; border: 2px solid #e9ecef; border-radius: 6px; font-size: 16px; background: #f8f9fa;">
            </div>
          </div>
          
          <!-- Modal Footer -->
          <div style="padding: 20px 24px; border-top: 1px solid #e9ecef; display: flex; justify-content: flex-end; gap: 12px; border-radius: 0 0 12px 12px;">
            <button type="button" 
                    style="padding: 12px 24px; border: 1px solid #6c757d; background: white; color: #6c757d; border-radius: 6px; cursor: pointer; font-weight: 500;"
                    (click)="closeClienteModal()">
              Cancelar
            </button>
            <button type="button" 
                    style="padding: 12px 24px; border: none; background: linear-gradient(135deg, #0a4d68 0%, #088395 100%); color: white; border-radius: 6px; cursor: pointer; font-weight: 500;"
                    (click)="onClienteSubmit()">
              <i class="bi bi-check-circle" style="margin-right: 8px;"></i>
              Guardar
            </button>
          </div>
        </div>
      </div>

      <!-- Data Table Section -->
      <div style="background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 24px;">
        <!-- Table Header -->
        <div style="padding: 20px 24px; background: linear-gradient(135deg, #0a4d68 0%, #088395 100%); color: white; border-radius: 12px 12px 0 0; display: flex; justify-content: space-between; align-items: center;">
          <h6 style="margin: 0; font-size: 16px; font-weight: 600;">Listado de Clientes</h6>
          <div style="display: flex; gap: 8px;">
            <button type="button" 
                    style="padding: 6px 12px; border: 1px solid white; color: white; border-radius: 4px; cursor: pointer; font-size: 12px; background: none;"
                    (click)="exportToCsv()">
              <i class="bi bi-file-earmark-csv" style="margin-right: 4px;"></i>
              Exportar CSV
            </button>
            <button type="button" 
                    style="padding: 6px 12px; border: 1px solid white; color: white; border-radius: 4px; cursor: pointer; font-size: 12px; background: none;"
                    (click)="exportToExcel()">
              <i class="bi bi-file-earmark-excel" style="margin-right: 4px;"></i>
              Exportar Excel
            </button>
          </div>
        </div>
        
        <!-- Table -->
        <div style="padding: 24px;">
          <div *ngIf="loading" style="text-align: center; padding: 40px;">
            <div style="display: inline-block; width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #0a4d68; border-radius: 50%; animation: spin 1s linear infinite;"></div>
          </div>
          
          <div *ngIf="!loading && clientes.length === 0" style="text-align: center; padding: 40px; color: #6c757d;">
            <i class="bi bi-inbox" style="font-size: 48px; margin-bottom: 16px;"></i>
            <p style="margin: 8px 0 0 0; font-size: 16px;">No se encontraron clientes</p>
          </div>
          
          <div *ngIf="!loading && clientes.length > 0">
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; background: white;">
                <thead>
                  <tr style="background: linear-gradient(135deg, #0a4d68 0%, #088395 100%); color: white;">
                    <th style="padding: 12px; text-align: left; font-weight: 600; font-size: 14px; border: none;">ID</th>
                    <th style="padding: 12px; text-align: left; font-weight: 600; font-size: 14px; border: none;">Razón Social</th>
                    <th style="padding: 12px; text-align: left; font-weight: 600; font-size: 14px; border: none;">Estado</th>
                    <th style="padding: 12px; text-align: left; font-weight: 600; font-size: 14px; border: none;">Fecha de Alta</th>
                    <th style="padding: 12px; text-align: center; font-weight: 600; font-size: 14px; border: none;">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let cliente of clientes" style="border-bottom: 1px solid #e9ecef; transition: background-color 0.2s ease;">
                    <td style="padding: 12px; color: #495057; font-weight: 500;">{{ cliente.Id }}</td>
                    <td style="padding: 12px; color: #495057;">{{ cliente.RazonSocial }}</td>
                    <td style="padding: 12px; text-align: center;">
                      <span [style]="cliente.Activo === 'S' ? 'background: #28a745; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;' : 'background: #dc3545; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;'">
                        {{ cliente.Activo === 'S' ? 'Activo' : 'Inactivo' }}
                      </span>
                    </td>
                    <td style="padding: 12px;">{{ formatDate(cliente.FechaDeAlta || '') }}</td>
                    <td style="padding: 12px; text-align: center;">
                      <div style="display: flex; gap: 4px; justify-content: center;">
                        <button type="button" 
                                style="padding: 4px 8px; border: 1px solid #0a4d68; color: #0a4d68; background: white; border-radius: 4px; cursor: pointer; font-size: 12px;"
                                (click)="openEditModal(cliente)">
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button type="button" 
                                style="padding: 4px 8px; border: 1px solid #17a2b8; color: #17a2b8; background: white; border-radius: 4px; cursor: pointer; font-size: 12px;"
                                (click)="openViewModal(cliente)">
                          <i class="bi bi-eye"></i>
                        </button>
                        <button type="button" 
                                style="padding: 4px 8px; border: 1px solid #dc3545; color: #dc3545; background: white; border-radius: 4px; cursor: pointer; font-size: 12px;"
                                (click)="confirmDelete(cliente)">
                          <i class="bi bi-trash"></i>
                        </button>
                        <button type="button" 
                                style="padding: 4px 8px; border: 1px solid #28a745; color: #28a745; background: white; border-radius: 4px; cursor: pointer; font-size: 12px;"
                                (click)="navigateToDashboard(cliente)">
                          <i class="bi bi-speedometer2"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading Spinner Style -->
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        tr:hover {
          background-color: #f8f9fa !important;
        }
        button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
      </style>
    </div>
  `
})
export class ClienteListComponent implements OnInit {
  clientes: Cliente[] = [];
  loading: boolean = false;
  showClienteModal: boolean = false;
  clienteModalTitle: string = '';
  clienteFormData: any = {
    RazonSocial: '',
    Activo: 'S',
    FechaDeAlta: ''
  };
  isEditModal: boolean = false;
  isViewModal: boolean = false;
  alertMessage: any;

  constructor(
    private clienteService: ClienteService,
    private utilsService: UtilsService,
    private router: Router
  ) {
    console.log('Constructor cliente-list inicializado');
  }

  ngOnInit(): void {
    console.log('ngOnInit cliente-list ejecutado');
    this.loadClientes();
  }

  loadClientes(): void {
    this.loading = true;
    const params = {
      page: 1,
      page_size: 100,
      search: '',
      activo: '',
      order_by: 'Id',
      order_direction: 'asc'
    };

    this.clienteService.getClientes(params).subscribe({
      next: (response) => {
        this.clientes = response.data || [];
        this.loading = false;
        console.log('Clientes cargados:', this.clientes.length);
      },
      error: (error) => {
        console.error('Error cargando clientes:', error);
        this.loading = false;
        this.showErrorMessage('Error al cargar los clientes');
      }
    });
  }

  openCreateModal(): void {
    console.log('openCreateModal ejecutado');
    this.clienteModalTitle = 'Nuevo Cliente';
    this.clienteFormData = {
      RazonSocial: '',
      Activo: 'S',
      FechaDeAlta: new Date().toISOString().split('T')[0]
    };
    this.isEditModal = false;
    this.isViewModal = false;
    this.showClienteModal = true;
  }

  openEditModal(cliente: Cliente): void {
    this.clienteModalTitle = 'Editar Cliente';
    this.clienteFormData = {
      Id: cliente.Id,
      RazonSocial: cliente.RazonSocial,
      Activo: cliente.Activo || 'S',
      FechaDeAlta: cliente.FechaDeAlta || ''
    };
    this.isEditModal = true;
    this.isViewModal = false;
    this.showClienteModal = true;
  }

  openViewModal(cliente: Cliente): void {
    this.clienteModalTitle = 'Ver Detalles del Cliente';
    this.clienteFormData = {
      Id: cliente.Id,
      RazonSocial: cliente.RazonSocial,
      Activo: cliente.Activo || 'S',
      FechaDeAlta: cliente.FechaDeAlta || ''
    };
    this.isEditModal = false;
    this.isViewModal = true;
    this.showClienteModal = true;
  }

  closeClienteModal(): void {
    this.showClienteModal = false;
    this.clienteModalTitle = '';
    this.clienteFormData = {
      RazonSocial: '',
      Activo: 'S',
      FechaDeAlta: ''
    };
  }

  onClienteSubmit(): void {
    console.log('onClienteSubmit ejecutado', this.clienteFormData);
    console.log('Es modo edición:', this.isEditModal);
    
    if (this.isEditModal) {
      // Actualizar cliente existente
      this.clienteService.updateCliente(this.clienteFormData.Id, this.clienteFormData).subscribe({
        next: (response) => {
          console.log('Cliente actualizado exitosamente:', response);
          this.showSuccessMessage('Cliente actualizado correctamente');
          this.loadClientes();
          this.closeClienteModal();
        },
        error: (error) => {
          console.error('Error actualizando cliente:', error);
          this.showErrorMessage('Error al actualizar el cliente');
        }
      });
    } else {
      // Crear nuevo cliente
      const newCliente = {
        RazonSocial: this.clienteFormData.RazonSocial,
        Activo: 'S',
        FechaDeAlta: new Date().toISOString().split('T')[0]
      };
      
      this.clienteService.createCliente(newCliente).subscribe({
        next: (response) => {
          console.log('Cliente creado exitosamente:', response);
          this.showSuccessMessage('Cliente creado correctamente');
          this.loadClientes();
          this.closeClienteModal();
        },
        error: (error) => {
          console.error('Error creando cliente:', error);
          this.showErrorMessage('Error al crear el cliente');
        }
      });
    }
  }

  confirmDelete(cliente: Cliente): void {
    if (confirm(`¿Está seguro de que desea eliminar el cliente "${cliente.RazonSocial}"?`)) {
      this.deleteCliente(cliente.Id);
    }
  }

  deleteCliente(id: number): void {
    this.clienteService.deleteCliente(id).subscribe({
      next: () => {
        this.showSuccessMessage('Cliente eliminado correctamente');
        this.loadClientes();
      },
      error: (error) => {
        this.showErrorMessage('Error al eliminar el cliente');
      }
    });
  }

  exportToCsv(): void {
    try {
      this.utilsService.exportToCsv(this.clientes, 'clientes');
      this.showSuccessMessage('Clientes exportados a CSV correctamente');
    } catch (error) {
      console.error('Error exportando CSV:', error);
      this.showErrorMessage('Error al exportar a CSV');
    }
  }

  exportToExcel(): void {
    const params = {
      page: 1,
      page_size: 100,
      search: '',
      activo: '',
      order_by: 'Id',
      order_direction: 'asc'
    };

    this.clienteService.exportarExcel(params).subscribe({
      next: (blob) => {
        this.utilsService.downloadFile(blob, 'clientes.xlsx');
        this.showSuccessMessage('Clientes exportados a Excel correctamente');
      },
      error: (error) => {
        console.error('Error exportando Excel:', error);
        this.showErrorMessage('Error al exportar a Excel');
      }
    });
  }

  navigateToDashboard(cliente: Cliente): void {
    console.log('Navegando al dashboard del cliente:', cliente.Id);
    // Por ahora mostramos un mensaje
    alert(`Navegando al dashboard del cliente ${cliente.RazonSocial} (ID: ${cliente.Id})`);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  showSuccessMessage(message: string): void {
    this.alertMessage = {
      type: 'success',
      message: message,
      dismissible: true,
      autoClose: true
    };
  }

  showErrorMessage(message: string): void {
    this.alertMessage = {
      type: 'danger',
      message: message,
      dismissible: true
    };
  }
}