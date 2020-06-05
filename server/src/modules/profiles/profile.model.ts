export interface Phone {
  readonly id?: number;
  readonly numero?: string;
  readonly tipo_telefono?: number;
}

export interface Address {
  readonly codigo_provincia?: number;
  readonly codigo_canton?: number;
  readonly codigo_distrito?: number;
  readonly direccion?: string;
}

export interface Profile {
  readonly id?: number;
  readonly cedula?: string;
  readonly nombre?: string;
  readonly p_apellido?: string;
  readonly s_apellido?: string;
  readonly fecha_nacimiento?: Date;
  readonly fecha_contrato?: Date;
  readonly correo?: string;
  readonly clave?: string;
  readonly activo?: boolean;
  readonly tipo_empleado?: number;
  readonly salario_hora?: number;
  readonly jornada?: number;
  readonly telefonos?: Phone[];
  readonly direccion?: Address;
}
