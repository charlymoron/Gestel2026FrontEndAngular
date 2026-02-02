import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClienteListComponent } from './pages/cliente/cliente-list.component';
import { ClienteStatsComponent } from './pages/cliente/cliente-stats.component';
import { EdificioListComponent } from './pages/edificio/edificio-list.component';
import { EdificioStatsComponent } from './pages/edificio/edificio-stats.component';
import { ProvinciaListComponent } from './pages/provincia/provincia-list.component';
import { ProvinciaStatsComponent } from './pages/provincia/provincia-stats.component';
import { EnlaceListComponent } from './pages/enlace/enlace-list.component';
import { ClienteDashboardComponent } from './pages/cliente/cliente-dashboard.component';
import { EdificioDetailComponent } from './pages/edificio/edificio-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/clientes', pathMatch: 'full' },
  { path: 'clientes', component: ClienteListComponent },
  { path: 'clientes/:id/dashboard', component: ClienteDashboardComponent },
  { path: 'clientes-stats', component: ClienteStatsComponent },
  { path: 'edificios', component: EdificioListComponent },
  { path: 'edificios/:id/detail', component: EdificioDetailComponent },
  { path: 'edificios-stats', component: EdificioStatsComponent },
  { path: 'provincias', component: ProvinciaListComponent },
  { path: 'provincias-stats', component: ProvinciaStatsComponent },
  { path: 'enlaces', component: EnlaceListComponent },
  { path: '**', redirectTo: '/clientes' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
