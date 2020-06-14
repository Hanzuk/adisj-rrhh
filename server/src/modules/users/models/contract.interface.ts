export interface Contract {
  readonly id?: number;
  readonly id_empleado: number;
  readonly fecha_contrato: Date;
  readonly fecha_salida: Date;
  readonly dias: number;
  readonly descripcion: string;
  readonly activo?: boolean;
}
