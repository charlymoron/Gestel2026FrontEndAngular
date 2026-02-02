import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface ErrorMessage {
  severity: 'error' | 'warning' | 'success' | 'info';
  summary: string;
  detail: string;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {

  constructor() { }

  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: ErrorMessage = {
      severity: 'error',
      summary: 'Error',
      detail: 'Ha ocurrido un error inesperado'
    };

    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage.detail = `Error del cliente: ${error.error.message}`;
    } else {
      // Error del servidor
      switch (error.status) {
        case 400:
          errorMessage.summary = 'Error de Validación';
          errorMessage.detail = error.error?.detail || 'Los datos enviados no son válidos';
          break;
        case 404:
          errorMessage.summary = 'No Encontrado';
          errorMessage.detail = error.error?.detail || 'El recurso solicitado no existe';
          break;
        case 409:
          errorMessage.summary = 'Conflicto';
          errorMessage.detail = error.error?.detail || 'El recurso tiene dependencias que impiden la operación';
          break;
        case 500:
          errorMessage.summary = 'Error del Servidor';
          errorMessage.detail = 'Error interno del servidor. Por favor, inténtelo más tarde';
          break;
        default:
          errorMessage.detail = error.error?.detail || `Error del servidor: ${error.status}`;
      }
    }

    console.error('Error occurred:', error, errorMessage);
    return throwError(() => errorMessage);
  }

  showSuccess(message: string, title: string = 'Éxito'): ErrorMessage {
    return {
      severity: 'success',
      summary: title,
      detail: message
    };
  }

  showWarning(message: string, title: string = 'Advertencia'): ErrorMessage {
    return {
      severity: 'warning',
      summary: title,
      detail: message
    };
  }

  showInfo(message: string, title: string = 'Información'): ErrorMessage {
    return {
      severity: 'info',
      summary: title,
      detail: message
    };
  }
}