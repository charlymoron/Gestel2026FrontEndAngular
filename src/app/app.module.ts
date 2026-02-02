import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Components
import { AlertComponent } from './components/alert.component';
import { ModalConfirmComponent } from './components/modal-confirm.component';
import { PaginationComponent } from './components/pagination.component';
import { FiltersComponent } from './components/filters.component';
import { DataTableComponent } from './components/data-table.component';
import { ClienteFormModalComponent } from './components/cliente-form-modal.component';

// Pages
import { ClienteListComponent } from './pages/cliente/cliente-list.component';
import { ClienteStatsComponent } from './pages/cliente/cliente-stats.component';
import { EdificioListComponent } from './pages/edificio/edificio-list.component';
import { EdificioStatsComponent } from './pages/edificio/edificio-stats.component';
import { ProvinciaListComponent } from './pages/provincia/provincia-list.component';
import { ProvinciaStatsComponent } from './pages/provincia/provincia-stats.component';
import { EnlaceListComponent } from './pages/enlace/enlace-list.component';
import { ClienteDashboardComponent } from './pages/cliente/cliente-dashboard.component';
import { EdificioDetailComponent } from './pages/edificio/edificio-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    ModalConfirmComponent,
    PaginationComponent,
    FiltersComponent,
    DataTableComponent,
    ClienteFormModalComponent,
    ClienteListComponent,
    ClienteStatsComponent,
    EdificioListComponent,
    EdificioStatsComponent,
    ProvinciaListComponent,
    ProvinciaStatsComponent,
    EnlaceListComponent,
    ClienteDashboardComponent,
    EdificioDetailComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }