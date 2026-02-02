import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { 
  Enlace, 
  EnlaceCreate, 
  EnlaceUpdate, 
  EnlaceWithRelations,
  EnlaceListResponse, 
  EnlaceStatsResponse,
  PaginationParams 
} from '../models/enlace.model';

@Injectable({
  providedIn: 'root'
})
export class EnlaceService {
  private apiUrl = `${environment.apiUrl}/v1/enlaces`;

  constructor(private http: HttpClient) {}

  getEnlaces(params: PaginationParams): Observable<EnlaceListResponse> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('page_size', params.page_size.toString());

    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }
    if (params.edificio_id) {
      httpParams = httpParams.set('edificio_id', params.edificio_id.toString());
    }
    if (params.edificio_ids) {
      httpParams = httpParams.set('edificio_ids', params.edificio_ids.toString());
    }
    if (params.es_de_terceros !== undefined) {
      httpParams = httpParams.set('es_de_terceros', params.es_de_terceros.toString());
    }
    if (params.order_by) {
      httpParams = httpParams.set('order_by', params.order_by);
    }
    if (params.order_direction) {
      httpParams = httpParams.set('order_direction', params.order_direction);
    }

    return this.http.get<EnlaceListResponse>(this.apiUrl, { params: httpParams });
  }

  getEnlace(id: number): Observable<EnlaceWithRelations> {
    return this.http.get<EnlaceWithRelations>(`${this.apiUrl}/${id}`);
  }

  createEnlace(enlace: EnlaceCreate): Observable<EnlaceWithRelations> {
    return this.http.post<EnlaceWithRelations>(this.apiUrl, enlace);
  }

  updateEnlace(id: number, enlace: EnlaceUpdate): Observable<EnlaceWithRelations> {
    return this.http.put<EnlaceWithRelations>(`${this.apiUrl}/${id}`, enlace);
  }

  deleteEnlace(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getStats(): Observable<EnlaceStatsResponse> {
    return this.http.get<EnlaceStatsResponse>(`${this.apiUrl}/stats/resumen`);
  }

  getStatsPorCliente(clienteId: number): Observable<EnlaceStatsResponse> {
    return this.http.get<EnlaceStatsResponse>(`${this.apiUrl}/stats/por-cliente/${clienteId}`);
  }

  getEnlacesPorCliente(
    clienteId: number, 
    params: PaginationParams
  ): Observable<EnlaceListResponse> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('page_size', params.page_size.toString());

    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }
    if (params.es_de_terceros !== undefined) {
      httpParams = httpParams.set('es_de_terceros', params.es_de_terceros.toString());
    }
    if (params.order_by) {
      httpParams = httpParams.set('order_by', params.order_by);
    }
    if (params.order_direction) {
      httpParams = httpParams.set('order_direction', params.order_direction);
    }

    return this.http.get<EnlaceListResponse>(`${this.apiUrl}/por-cliente/${clienteId}`, { params: httpParams });
  }

  exportarExcel(params: PaginationParams): Observable<Blob> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('page_size', params.page_size.toString());

    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }
    if (params.edificio_id) {
      httpParams = httpParams.set('edificio_id', params.edificio_id.toString());
    }
    if (params.es_de_terceros !== undefined) {
      httpParams = httpParams.set('es_de_terceros', params.es_de_terceros.toString());
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