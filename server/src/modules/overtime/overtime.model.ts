import { Status } from '../../utils/enums';

export interface Overtime {
  id?: number;
  id_empleado?: number;
  id_estado?: number;
  cantidad_horas?: number;
  descripcion?: string;
  fecha?: Date;
  activo?: boolean;
}
