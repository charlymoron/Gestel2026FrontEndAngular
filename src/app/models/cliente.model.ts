export interface Cliente {
  Id: number;
  RazonSocial: string;
  Activo?: string;
  FechaDeAlta?: string;
  FechaDeBaja?: string;
}

export interface ClienteCreate {
  RazonSocial: string;
  Activo?: string;
  FechaDeAlta?: string;
}

export interface ClienteUpdate {
  RazonSocial?: string;
  Activo?: string;
  FechaDeAlta?: string;
  FechaDeBaja?: string | null;
}

export interface ClienteListResponse {
  total: number;
  page: number;
  page_size: number;
  data: Cliente[];
}

export interface ClienteStatsResponse {
  total_clientes: number;
  clientes_activos: number;
  clientes_inactivos: number;
}

export interface PaginationParams {
  page: number;
  page_size: number;
  search?: string;
  activo?: string;
  order_by?: string;
  order_direction?: string;
}