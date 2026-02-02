import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { 
  Provincia, 
  ProvinciaCreate, 
  ProvinciaUpdate, 
  ProvinciaListResponse, 
  ProvinciaStatsResponse,
  PaginationParams 
} from '../models/provincia.model';

@Injectable({
  providedIn: 'root'
})
export class ProvinciaService {
  private apiUrl = `${environment.apiUrl}/v1/provincias`;

  constructor(private http: HttpClient) {}

  getProvincias(params: PaginationParams): Observable<ProvinciaListResponse> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('page_size', params.page_size.toString());

    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }
    if (params.order_by) {
      httpParams = httpParams.set('order_by', params.order_by);
    }
    if (params.order_direction) {
      httpParams = httpParams.set('order_direction', params.order_direction);
    }

    return this.http.get<ProvinciaListResponse>(this.apiUrl, { params: httpParams });
  }

  getProvincia(id: number): Observable<Provincia> {
    return this.http.get<Provincia>(`${this.apiUrl}/${id}`);
  }

  createProvincia(provincia: ProvinciaCreate): Observable<Provincia> {
    return this.http.post<Provincia>(this.apiUrl, provincia);
  }

  updateProvincia(id: number, provincia: ProvinciaUpdate): Observable<Provincia> {
    return this.http.put<Provincia>(`${this.apiUrl}/${id}`, provincia);
  }

  deleteProvincia(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getStats(): Observable<ProvinciaStatsResponse> {
    return this.http.get<ProvinciaStatsResponse>(`${this.apiUrl}/stats/resumen`);
  }

  exportarExcel(params: PaginationParams): Observable<Blob> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('page_size', params.page_size.toString());

    if (params.search) {
      httpParams = httpParams.set('search', params.search);
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