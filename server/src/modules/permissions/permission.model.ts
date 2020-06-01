import { Status } from 'src/utils/enums';

export interface Permission {
  id_empleado?: number;
  id_estado?: Status;
  titulo?: string;
  descripcion?: string;
  fecha_salida?: Date;
  horas?: number;
  activo?: boolean;
  solo_admin?: boolean;
}
