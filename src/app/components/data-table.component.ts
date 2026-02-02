import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface ColumnConfig {
  key: string;
  label: string;
  sortable?: boolean;
  searchable?: boolean;
  type?: 'text' | 'date' | 'badge' | 'actions';
  badgeClass?: (value: any) => string;
  badgeText?: (value: any) => string;
  formatDate?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  actions?: ActionButton[];
}

export interface ActionButton {
  icon: string;
  title: string;
  class: string;
  action: (item: any) => void;
  disabled?: (item: any) => boolean;
}

@Component({
  selector: 'app-data-table',
  template: `
    <div class="gestel-table">
      <div *ngIf="loading" class="spinner-container">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>
      
      <div *ngIf="!loading && data.length === 0" class="text-center py-4">
        <i class="bi bi-inbox display-4 text-muted"></i>
        <p class="text-muted mt-2">No se encontraron registros</p>
      </div>
      
      <table *ngIf="!loading && data.length > 0" class="table table-hover">
        <thead>
          <tr>
            <th *ngFor="let column of columns"
                [style.width]="column.width || 'auto'"
                [class.text-start]="!column.align || column.align === 'left'"
                [class.text-center]="column.align === 'center'"
                [class.text-end]="column.align === 'right'">
              <div *ngIf="!column.sortable" class="d-flex align-items-center">
                {{column.label}}
              </div>
              <div *ngIf="column.sortable" 
                   class="d-flex align-items-center cursor-pointer"
                   (click)="onSort(column.key)">
                {{column.label}}
                <i *ngIf="sortBy === column.key" 
                   class="bi ms-1"
                   [class.bi-chevron-up]="sortDirection === 'asc'"
                   [class.bi-chevron-down]="sortDirection === 'desc'">
                </i>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of data; let i = index">
            <td *ngFor="let column of columns"
                [class.text-start]="!column.align || column.align === 'left'"
                [class.text-center]="column.align === 'center'"
                [class.text-end]="column.align === 'right'">
              
              <!-- Text Column -->
              <div *ngIf="!column.type || column.type === 'text'">
                {{getNestedValue(item, column.key)}}
              </div>
              
              <!-- Date Column -->
              <div *ngIf="column.type === 'date'">
                {{formatDate(getNestedValue(item, column.key))}}
              </div>
              
              <!-- Badge Column -->
              <div *ngIf="column.type === 'badge'" class="text-center">
                <span class="badge" 
                      [ngClass]="column.badgeClass ? column.badgeClass(getNestedValue(item, column.key)) : 'bg-secondary'">
                  {{column.badgeText ? column.badgeText(getNestedValue(item, column.key)) : getNestedValue(item, column.key)}}
                </span>
              </div>
              
              <!-- Actions Column -->
              <div *ngIf="column.type === 'actions'" class="btn-group">
                <button *ngFor="let action of (column.actions || actions)"
                        type="button"
                        class="btn btn-sm"
                        [ngClass]="action.class"
                        [title]="action.title"
                        [disabled]="action.disabled && action.disabled(item)"
                        (click)="action.action(item)">
                  <i [class]="action.icon"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .cursor-pointer {
      cursor: pointer;
      user-select: none;
    }
    
    .cursor-pointer:hover {
      color: var(--primary-medium);
    }
    
    .btn-group .btn {
      margin-right: 0.25rem;
    }
    
    .btn-group .btn:last-child {
      margin-right: 0;
    }
  `]
})
export class DataTableComponent {
  @Input() data: any[] = [];
  @Input() columns: ColumnConfig[] = [];
  @Input() actions: ActionButton[] = [];
  @Input() loading: boolean = false;
  @Input() sortBy: string = '';
  @Input() sortDirection: 'asc' | 'desc' = 'asc';

  @Output() sortChange = new EventEmitter<{ field: string; direction: 'asc' | 'desc' }>();

  constructor() { }

  onSort(field: string): void {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (this.sortBy === field) {
      direction = this.sortDirection === 'asc' ? 'desc' : 'asc';
    }
    
    this.sortChange.emit({ field, direction });
  }

  getNestedValue(obj: any, path: string): any {
    if (!path) return obj;
    
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : '';
    }, obj);
  }

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
}