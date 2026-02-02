export interface Edificio {
  Id: number;
  ClienteId: number;
  ProvinciaId: number;
  Nombre: string;
  Sucursal: string;
  Direccion?: string;
  Codigo?: string;
  Responsable?: string;
  Telefono?: string;
  Fax?: string;
  Observaciones?: string;
  Email?: string;
  Ciudad?: string;
  Activo?: string;
  FechaDeAlta?: string;
  FechaDeBaja?: string;
}

export interface EdificioWithRelations extends Edificio {
  Cliente?: {
    Id: number;
    RazonSocial: string;
  };
  Provincia?: {
    Id: number;
    Nombre: string;
  };
}

export interface EdificioCreate {
  ClienteId: number;
  ProvinciaId: number;
  Nombre: string;
  Sucursal: string;
  Direccion?: string;
  Codigo?: string;
  Responsable?: string;
  Telefono?: string;
  Fax?: string;
  Observaciones?: string;
  Email?: string;
  Ciudad?: string;
}

export interface EdificioUpdate {
  ClienteId?: number;
  ProvinciaId?: number;
  Nombre?: string;
  Sucursal?: string;
  Direccion?: string;
  Codigo?: string;
  Responsable?: string;
  Telefono?: string;
  Fax?: string;
  Observaciones?: string;
  Email?: string;
  Ciudad?: string;
  Activo?: string;
  FechaDeBaja?: string;
}

export interface EdificioListResponse {
  total: number;
  page: number;
  page_size: number;
  data: EdificioWithRelations[];
}

export interface EdificioStatsResponse {
  total_edificios: number;
  edificios_por_cliente: { [key: string]: number };
  edificios_por_provincia: { [key: string]: number };
  edificios_con_email: number;
  edificios_sin_email: number;
}

export interface PaginationParams {
  page: number;
  page_size: number;
  search?: string;
  cliente_id?: number;
  provincia_id?: number;
  activo?: string;
  order_by?: string;
  order_direction?: string;
}