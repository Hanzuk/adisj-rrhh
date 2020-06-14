export interface Task {
  readonly id?: number;
  readonly id_empleado?: number;
  readonly titulo?: string;
  readonly descripcion?: string;
  readonly activo?: boolean;
  readonly fecha_asignacion?: Date;
}

export interface DriverTask {
  readonly id?: number;
  readonly dia?: number;
  readonly tipo_servicio?: string;
  readonly salario_hora?: number;
  readonly vehiculo?: string;
  readonly horario?: number;
}
