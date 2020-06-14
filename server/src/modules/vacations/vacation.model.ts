export interface Vacation {
  readonly id?: number;
  readonly id_empleado?: number;
  readonly activo?: boolean;
  readonly fecha_entrada?: Date;
  readonly fecha_salida?: Date;
  readonly cantidad?: number;
}

export interface AvailableVacations {
  readonly id?: number;
  readonly id_empleado?: number;
  readonly cantidad?: number;
  readonly activo?: boolean;
  readonly fecha?: Date;
}
