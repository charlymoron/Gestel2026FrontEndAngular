import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ClienteFormData {
  Id?: number;
  RazonSocial: string;
  Activo: string;
  FechaDeAlta: string;
  FechaDeBaja?: string | null;
}

@Component({
  selector: 'app-cliente-form-modal',
  template: `
    <div class="modal fade show d-block" [class.show]="show" [style.display]="show ? 'block' : 'none'" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="clienteModalTitle" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header" style="background-color: var(--gestel-primary); color: white; border-radius: 15px 15px 0 0;">
            <h5 class="modal-title" id="clienteModalTitle">
              <i class="bi bi-person-plus me-2" *ngIf="!isEdit"></i>
              <i class="bi bi-person-pencil me-2" *ngIf="isEdit"></i>
              {{title}}
            </h5>
            <button type="button" class="btn-close btn-close-white" (click)="onCloseClick()"></button>
          </div>
          <div class="modal-body">
            <form #clienteForm="ngForm" (ngSubmit)="onSubmitClick()">
              <!-- Razón Social -->
              <div class="mb-3">
                <label for="razonSocial" class="form-label">Razón Social *</label>
                <input type="text" 
                       class="form-control" 
                       id="razonSocial" 
                       name="razonSocial"
                       [(ngModel)]="formData.RazonSocial"
                       required
                       [readonly]="isView"
                       placeholder="Ingrese la razón social del cliente">
              </div>

              <!-- Estado (solo para edición) -->
              <div class="mb-3" *ngIf="isEdit && !isView">
                <label for="activo" class="form-label">Estado</label>
                <select class="form-select" 
                        id="activo" 
                        name="activo"
                        [(ngModel)]="formData.Activo">
                  <option value="S">Activo</option>
                  <option value="N">Inactivo</option>
                </select>
              </div>

              <!-- Fecha de Alta (solo lectura) -->
              <div class="mb-3">
                <label for="fechaAlta" class="form-label">Fecha de Alta</label>
                <input type="text" 
                       class="form-control" 
                       id="fechaAlta" 
                       name="fechaAlta"
                       [value]="formatDate(formData.FechaDeAlta)"
                       readonly>
              </div>

              <!-- Fecha de Baja (solo para edición) -->
              <div class="mb-3" *ngIf="isEdit && !isView">
                <label for="fechaBaja" class="form-label">Fecha de Baja</label>
                <input type="date" 
                       class="form-control" 
                       id="fechaBaja" 
                       name="fechaBaja"
                       [(ngModel)]="formData.FechaDeBaja">
              </div>

              <!-- Información solo para vista -->
              <div *ngIf="isView" class="row">
                <div class="col-md-6">
                  <label class="form-label">Estado</label>
                  <p class="form-control-plaintext">
                    <span class="badge" 
                          [ngClass]="formData.Activo === 'S' ? 'bg-success' : 'bg-danger'">
                      {{formData.Activo === 'S' ? 'Activo' : 'Inactivo'}}
                    </span>
                  </p>
                </div>
                <div class="col-md-6" *ngIf="formData.FechaDeBaja">
                  <label class="form-label">Fecha de Baja</label>
                  <p class="form-control-plaintext">{{formatDate(formData.FechaDeBaja)}}</p>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="onCloseClick()">
              <i class="bi bi-x-circle me-1"></i>
              {{isView ? 'Cerrar' : 'Cancelar'}}
            </button>
            <button type="button" 
                    class="btn btn-primary" 
                    *ngIf="!isView"
                    (click)="onSubmitClick()"
                    [disabled]="!clienteForm.valid || !formData.RazonSocial.trim()">
              <i class="bi bi-check-circle me-1"></i>
              {{isEdit ? 'Actualizar' : 'Guardar'}}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-content {
      border-radius: 15px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
    
    .form-label {
      font-weight: 600;
      color: var(--gestel-primary);
    }
    
    .form-control:focus {
      border-color: var(--gestel-primary);
      box-shadow: 0 0 0 0.2rem rgba(44, 122, 167, 0.25);
    }
  `]
})
export class ClienteFormModalComponent {
  @Input() show: boolean = false;
  @Input() title: string = '';
  @Input() formData: ClienteFormData = {
    RazonSocial: '',
    Activo: 'S',
    FechaDeAlta: ''
  };
  @Input() isEdit: boolean = false;
  @Input() isView: boolean = false;

  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<ClienteFormData>();

  formatDate(dateString: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  onSubmitClick(): void {
    if (this.formData.RazonSocial.trim()) {
      this.onSubmit.emit(this.formData);
    }
  }

  onCloseClick(): void {
    this.onClose.emit();
  }
}