export interface Quality {
  readonly id?: number;
  readonly id_empleado?: number;
  readonly activo?: boolean;
  readonly calificacion?: number;
  readonly nombre_cliente?: string;
  readonly comentario?: string;
  readonly fecha?: Date;
}

export interface DriverRating {
  readonly id_empleado?: null;
  readonly suma_calificaciones?: number;
  readonly cantidad_calificaciones?: number;
  readonly nombre?: string;
  readonly p_apellido?: string;
  readonly s_apellido?: string;
}
