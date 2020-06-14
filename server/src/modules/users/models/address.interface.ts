export interface IAddress {
  readonly id?: number;
  id_empleado: number;
  readonly codigo_provincia?: number;
  readonly codigo_canton?: number;
  readonly codigo_distrito?: number;
  readonly direccion?: string;
  readonly activo?: boolean;
}
