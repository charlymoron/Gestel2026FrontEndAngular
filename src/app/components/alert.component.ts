import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface AlertMessage {
  type: 'success' | 'warning' | 'danger' | 'info';
  message: string;
  title?: string;
  dismissible?: boolean;
}

@Component({
  selector: 'app-alert',
  template: `
    <div *ngIf="show" 
         class="alert alert-{{message.type}} alert-custom alert-{{message.type}}-custom {{message.dismissible ? 'alert-dismissible' : ''}}" 
         role="alert">
      <div *ngIf="message.title" class="alert-title">
        <strong>{{message.title}}</strong>
      </div>
      <div class="alert-message">
        {{message.message}}
      </div>
      <button *ngIf="message.dismissible" 
              type="button" 
              class="btn-close" 
              aria-label="Close"
              (click)="dismiss()">
      </button>
    </div>
  `,
  styles: [`
    .alert-title {
      margin-bottom: 0.25rem;
      font-weight: 600;
    }
    
    .alert-message {
      font-size: 0.9rem;
    }
    
    .alert-dismissible {
      padding-right: 3rem;
    }
    
    .btn-close {
      position: absolute;
      top: 0;
      right: 0;
      padding: 0.75rem 1rem;
    }
  `]
})
export class AlertComponent {
  @Input() message!: AlertMessage;
  @Input() autoClose: boolean = false;
  @Input() autoCloseDelay: number = 5000;
  @Output() onDismiss = new EventEmitter<void>();

  show: boolean = true;
  private timeoutId: any;

  ngOnInit() {
    if (this.autoClose) {
      this.timeoutId = setTimeout(() => {
        this.dismiss();
      }, this.autoCloseDelay);
    }
  }

  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  dismiss() {
    this.show = false;
    this.onDismiss.emit();
  }
}