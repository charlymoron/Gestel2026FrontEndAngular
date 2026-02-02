export interface Provincia {
  Id: number;
  Nombre: string;
}

export interface ProvinciaCreate {
  Nombre: string;
}

export interface ProvinciaUpdate {
  Nombre?: string;
}

export interface ProvinciaListResponse {
  total: number;
  page: number;
  page_size: number;
  data: Provincia[];
}

export interface ProvinciaStatsResponse {
  total_provincias: number;
  provincias_con_edificios: number;
  provincias_sin_edificios: number;
}

export interface PaginationParams {
  page: number;
  page_size: number;
  search?: string;
  order_by?: string;
  order_direction?: string;
}