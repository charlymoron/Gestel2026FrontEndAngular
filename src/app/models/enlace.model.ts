export interface Enlace {
  Id: number;
  EdificioId: number;
  Referencia: string;
  EsDeTerceros: boolean;
}

export interface EnlaceWithRelations extends Enlace {
  edificio_nombre?: string;
  edificio_sucursal?: string;
  cliente_nombre?: string;
}

export interface EnlaceCreate {
  EdificioId: number;
  Referencia: string;
  EsDeTerceros?: boolean;
}

export interface EnlaceUpdate {
  EdificioId?: number;
  Referencia?: string;
  EsDeTerceros?: boolean;
}

export interface EnlaceListResponse {
  total: number;
  page: number;
  page_size: number;
  data: EnlaceWithRelations[];
}

export interface EnlaceStatsResponse {
  total_enlaces: number;
  enlaces_propios: number;
  enlaces_terceros: number;
  enlaces_por_edificio: { [key: string]: number };
}

export interface PaginationParams {
  page: number;
  page_size: number;
  search?: string;
  edificio_id?: number;
  edificio_ids?: string;
  es_de_terceros?: boolean;
  order_by?: string;
  order_direction?: string;
}