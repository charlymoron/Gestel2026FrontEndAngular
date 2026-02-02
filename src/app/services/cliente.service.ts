import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { 
  Cliente, 
  ClienteCreate, 
  ClienteUpdate, 
  ClienteListResponse, 
  ClienteStatsResponse,
  PaginationParams 
} from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = `${environment.apiUrl}/v1/clientes`;

  constructor(private http: HttpClient) {}

  getClientes(params: PaginationParams): Observable<ClienteListResponse> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('page_size', params.page_size.toString());

    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }
    if (params.activo) {
      httpParams = httpParams.set('activo', params.activo);
    }
    if (params.order_by) {
      httpParams = httpParams.set('order_by', params.order_by);
    }
    if (params.order_direction) {
      httpParams = httpParams.set('order_direction', params.order_direction);
    }

    return this.http.get<ClienteListResponse>(this.apiUrl, { params: httpParams });
  }

  getCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  createCliente(cliente: ClienteCreate): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }

  updateCliente(id: number, cliente: ClienteUpdate): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, cliente);
  }

  deleteCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getStats(): Observable<ClienteStatsResponse> {
    return this.http.get<ClienteStatsResponse>(`${this.apiUrl}/stats/resumen`);
  }

  exportarExcel(params: PaginationParams): Observable<Blob> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('page_size', params.page_size.toString());

    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }
    if (params.activo) {
      httpParams = httpParams.set('activo', params.activo);
    }
    if (params.order_by) {
      httpParams = httpParams.set('order_by', params.order_by);
    }
    if (params.order_direction) {
      httpParams = httpParams.set('order_direction', params.order_direction);
    }

    return this.http.get(`${this.apiUrl}/exportar/excel`, { 
      params: httpParams,
      responseType: 'blob'
    }).pipe(
      map(blob => {
        return new Blob([blob], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
      })
    );
  }
}