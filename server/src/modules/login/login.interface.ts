import { Rol } from 'src/utils/enums';

export interface Login {
  id?: number;
  correo?: string;
  clave?: string;
  tipo_empleado?: Rol;
}
