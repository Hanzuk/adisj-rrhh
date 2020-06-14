export interface ISalary {
  readonly id?: number;
  id_empleado: number;
  readonly salario_hora: number;
  readonly jornada: number;
  readonly activo?: boolean;
}
