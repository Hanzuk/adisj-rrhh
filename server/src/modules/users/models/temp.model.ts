import { User } from './user.model';

export class TempUser extends User {
  readonly fecha_salida: Date;
  readonly descripcion: string;

  constructor({
    id,
    cedula,
    nombre,
    p_apellido,
    s_apellido,
    fecha_nacimiento,
    fecha_contrato,
    correo,
    clave,
    activo,
    tipo_empleado,
    salario_hora,
    jornada,
    telefonos,
    direccion,
    fecha_salida,
    descripcion,
  }: TempUser) {
    super({
      id,
      cedula,
      nombre,
      p_apellido,
      s_apellido,
      fecha_nacimiento,
      fecha_contrato,
      correo,
      clave,
      activo,
      tipo_empleado,
      salario_hora,
      jornada,
      telefonos,
      direccion,
    });
    this.fecha_salida = fecha_salida;
    this.descripcion = descripcion;
  }
}
