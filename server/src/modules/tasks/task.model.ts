export interface Task {
  readonly id?: number;
  readonly id_empleado?: number;
  readonly titulo?: string;
  readonly descripcion?: string;
  readonly activo?: boolean;
  readonly fecha_asignacion?: Date;
}
