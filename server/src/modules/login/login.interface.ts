import { Rol } from 'src/utils/enums';

export interface Login {
  id?: number;
  nombre?: string;
  p_apellido?: string;
  correo?: string;
  clave?: string;
  tipo_empleado?: Rol;
}
