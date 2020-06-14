import { PhoneType } from '../../../utils/enums';

export interface IPhone {
  readonly id?: number;
  id_empleado: number;
  readonly numero: string;
  activo: boolean;
  readonly tipo_telefono: PhoneType;
}
