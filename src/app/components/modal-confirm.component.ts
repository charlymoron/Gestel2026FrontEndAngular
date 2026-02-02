import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-confirm',
  template: `
    <div class="modal fade" 
         [class.show]="show" 
         [style.display]="show ? 'block' : 'none'"
         [attr.aria-hidden]="!show"
         tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{title}}</h5>
            <button type="button" 
                    class="btn-close btn-close-white" 
                    aria-label="Close"
                    (click)="onCancel.emit()">
            </button>
          </div>
          <div class="modal-body">
            <p>{{message}}</p>
            <div *ngIf="details" class="text-muted small mt-2">
              {{details}}
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" 
                    class="btn btn-outline-secondary"
                    (click)="onCancel.emit()">
              {{cancelText}}
            </button>
            <button type="button" 
                    class="btn btn-danger"
                    (click)="onConfirm.emit()">
              {{confirmText}}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div *ngIf="show" class="modal-backdrop fade show" (click)="onCancel.emit()"></div>
  `,
  styles: [`
    .modal {
      z-index: 1050;
    }
    
    .modal-backdrop {
      z-index: 1040;
    }
    
    .modal.show {
      display: block !important;
      opacity: 1;
    }
    
    .modal-backdrop.show {
      opacity: 0.5;
    }
  `]
})
export class ModalConfirmComponent {
  @Input() show: boolean = false;
  @Input() title: string = 'Confirmar Acción';
  @Input() message: string = '¿Está seguro de realizar esta acción?';
  @Input() details?: string;
  @Input() confirmText: string = 'Confirmar';
  @Input() cancelText: string = 'Cancelar';

  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  constructor() { }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.onCancel.emit();
    }
  }
}