import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface PaginationData {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

@Component({
  selector: 'app-pagination',
  template: `
    <div class="d-flex justify-content-between align-items-center flex-wrap">
      <div class="d-flex align-items-center mb-2 mb-md-0">
        <span class="me-2">Mostrar</span>
        <select class="form-select form-select-sm" 
                style="width: auto;"
                [(ngModel)]="selectedPageSize"
                (change)="onPageSizeChange()">
          <option [ngValue]="10">10</option>
          <option [ngValue]="25">25</option>
          <option [ngValue]="50">50</option>
          <option [ngValue]="100">100</option>
        </select>
        <span class="ms-2">de {{total}} registros</span>
      </div>
      
      <nav aria-label="Paginación">
        <ul class="pagination mb-0">
          <li class="page-item" [class.disabled]="currentPage === 1">
            <button class="page-link" 
                    (click)="goToPage(1)"
                    [disabled]="currentPage === 1">
              <i class="bi bi-chevron-double-left"></i>
            </button>
          </li>
          
          <li class="page-item" [class.disabled]="currentPage === 1">
            <button class="page-link" 
                    (click)="goToPage(currentPage - 1)"
                    [disabled]="currentPage === 1">
              <i class="bi bi-chevron-left"></i>
            </button>
          </li>
          
          <li *ngFor="let page of getPagesToShow()" 
              class="page-item" 
              [class.active]="page === currentPage"
              [class.disabled]="page === '...'">
            <button class="page-link" 
                    (click)="goToPage(page)"
                    [disabled]="page === '...'">
              {{page}}
            </button>
          </li>
          
          <li class="page-item" [class.disabled]="currentPage === totalPages">
            <button class="page-link" 
                    (click)="goToPage(currentPage + 1)"
                    [disabled]="currentPage === totalPages">
              <i class="bi bi-chevron-right"></i>
            </button>
          </li>
          
          <li class="page-item" [class.disabled]="currentPage === totalPages">
            <button class="page-link" 
                    (click)="goToPage(totalPages)"
                    [disabled]="currentPage === totalPages">
              <i class="bi bi-chevron-double-right"></i>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  `,
  styles: [`
    .page-link {
      cursor: pointer;
    }
    
    .page-link:hover:not(:disabled) {
      background-color: var(--gray-50);
    }
    
    .page-item.disabled .page-link {
      cursor: not-allowed;
    }
  `]
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() pageSize: number = 10;
  @Input() total: number = 0;
  
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  selectedPageSize: number = 10;

  get totalPages(): number {
    return Math.ceil(this.total / this.pageSize);
  }

  ngOnInit() {
    this.selectedPageSize = this.pageSize;
  }

  ngOnChanges() {
    if (this.pageSize !== this.selectedPageSize) {
      this.selectedPageSize = this.pageSize;
    }
  }

  getPagesToShow(): (number | string)[] {
    const pages: (number | string)[] = [];
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      pages.push(totalPages);
    }

    return pages;
  }

  goToPage(page: number | string): void {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  onPageSizeChange(): void {
    this.pageSizeChange.emit(this.selectedPageSize);
  }
}