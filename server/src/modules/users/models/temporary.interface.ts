export interface ITemporaryUser {
  readonly id?: number;
  id_empleado: number;
  readonly fecha_salida: Date;
  readonly descripcion: string;
}

export interface ITemporaryContract {
  readonly id?: number;
  id_empleado: number;
  readonly fecha_contrato: Date;
  readonly fecha_salida: Date;
  readonly dias: number;
  readonly descripcion: string;
  readonly activo?: boolean;
}
