import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { 
  Edificio, 
  EdificioCreate, 
  EdificioUpdate, 
  EdificioWithRelations,
  EdificioListResponse, 
  EdificioStatsResponse,
  PaginationParams 
} from '../models/edificio.model';

@Injectable({
  providedIn: 'root'
})
export class EdificioService {
  private apiUrl = `${environment.apiUrl}/v1/edificios`;

  constructor(private http: HttpClient) {}

  getEdificios(params: PaginationParams): Observable<EdificioListResponse> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('page_size', params.page_size.toString());

    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }
    if (params.cliente_id) {
      httpParams = httpParams.set('cliente_id', params.cliente_id.toString());
    }
    if (params.provincia_id) {
      httpParams = httpParams.set('provincia_id', params.provincia_id.toString());
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

    return this.http.get<EdificioListResponse>(this.apiUrl, { params: httpParams });
  }

  getEdificio(id: number): Observable<EdificioWithRelations> {
    return this.http.get<EdificioWithRelations>(`${this.apiUrl}/${id}`);
  }

  createEdificio(edificio: EdificioCreate): Observable<EdificioWithRelations> {
    return this.http.post<EdificioWithRelations>(this.apiUrl, edificio);
  }

  updateEdificio(id: number, edificio: EdificioUpdate): Observable<EdificioWithRelations> {
    return this.http.put<EdificioWithRelations>(`${this.apiUrl}/${id}`, edificio);
  }

  deleteEdificio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getStats(): Observable<EdificioStatsResponse> {
    return this.http.get<EdificioStatsResponse>(`${this.apiUrl}/stats/resumen`);
  }

  getStatsPorCliente(clienteId: number): Observable<EdificioStatsResponse> {
    return this.http.get<EdificioStatsResponse>(`${this.apiUrl}/stats/por-cliente/${clienteId}`);
  }

  exportarExcel(params: PaginationParams): Observable<Blob> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('page_size', params.page_size.toString());

    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }
    if (params.cliente_id) {
      httpParams = httpParams.set('cliente_id', params.cliente_id.toString());
    }
    if (params.provincia_id) {
      httpParams = httpParams.set('provincia_id', params.provincia_id.toString());
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