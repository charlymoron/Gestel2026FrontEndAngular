import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface FilterConfig {
  placeholder: string;
  field: string;
  type: 'text' | 'select' | 'date';
  options?: { value: string; label: string }[];
}

@Component({
  selector: 'app-filters',
  template: `
    <div class="card gestel-card mb-3">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h6 class="mb-0">
          <i class="bi bi-funnel me-2"></i>
          Filtros
        </h6>
        <button *ngIf="hasActiveFilters" 
                type="button" 
                class="btn btn-sm btn-outline-secondary"
                (click)="clearFilters()">
          <i class="bi bi-x-circle me-1"></i>
          Limpiar
        </button>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <div *ngFor="let filter of filters" 
               [class]="getFilterColClass()">
            
            <!-- Text Input -->
            <div *ngIf="filter.type === 'text'" class="form-floating">
              <input type="text" 
                     class="form-control" 
                     [id]="filter.field"
                     [placeholder]="filter.placeholder"
                     [(ngModel)]="filterValues[filter.field]"
                     (input)="onFilterChange()"
                     debounce="300">
              <label [for]="filter.field">{{filter.placeholder}}</label>
            </div>
            
            <!-- Select Input -->
            <div *ngIf="filter.type === 'select'" class="form-floating">
              <select class="form-select" 
                      [id]="filter.field"
                      [(ngModel)]="filterValues[filter.field]"
                      (change)="onFilterChange()">
                <option value="">Todos</option>
                <option *ngFor="let option of filter.options" 
                        [value]="option.value">
                  {{option.label}}
                </option>
              </select>
              <label [for]="filter.field">{{filter.placeholder}}</label>
            </div>
            
            <!-- Date Input -->
            <div *ngIf="filter.type === 'date'" class="form-floating">
              <input type="date" 
                     class="form-control" 
                     [id]="filter.field"
                     [(ngModel)]="filterValues[filter.field]"
                     (change)="onFilterChange()">
              <label [for]="filter.field">{{filter.placeholder}}</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .form-floating > .form-control,
    .form-floating > .form-select {
      height: calc(3.5rem + 2px);
    }
    
    .form-floating > label {
      color: var(--gray-600);
    }
  `]
})
export class FiltersComponent {
  @Input() filters: FilterConfig[] = [];
  @Input() filterValues: { [key: string]: string } = {};
  @Output() filterChange = new EventEmitter<{ [key: string]: string }>();

  constructor() { }

  get hasActiveFilters(): boolean {
    return Object.values(this.filterValues).some(value => value && value.trim() !== '');
  }

  getFilterColClass(): string {
    const filterCount = this.filters.length;
    if (filterCount <= 1) return 'col-12';
    if (filterCount <= 2) return 'col-md-6';
    if (filterCount <= 3) return 'col-md-4';
    return 'col-md-3';
  }

  onFilterChange(): void {
    this.filterChange.emit(this.filterValues);
  }

  clearFilters(): void {
    Object.keys(this.filterValues).forEach(key => {
      this.filterValues[key] = '';
    });
    this.filterChange.emit(this.filterValues);
  }

  setFilter(field: string, value: string): void {
    this.filterValues[field] = value;
    this.filterChange.emit(this.filterValues);
  }

  getFilterValue(field: string): string {
    return this.filterValues[field] || '';
  }
}