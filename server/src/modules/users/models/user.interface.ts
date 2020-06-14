import { Rol } from '../../../utils/enums';

export interface IUser {
  readonly id?: number;
  readonly cedula: string;
  readonly nombre: string;
  readonly p_apellido: string;
  readonly s_apellido: string;
  readonly fecha_nacimiento: Date;
  readonly fecha_contrato?: Date;
  readonly correo: string;
  readonly clave?: string;
  readonly activo?: boolean;
  readonly tipo_empleado: Rol;
}
