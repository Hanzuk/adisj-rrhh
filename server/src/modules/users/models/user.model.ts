export interface Phone {
  id?: number;
  numero: string;
  tipo_telefono: string | number;
}

export interface Address {
  provincia: number;
  canton: number;
  distrito: number;
  direccion: string;
}

// REVIEW: Tal vez con interfaces? :v
export class User {
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
  readonly tipo_empleado: number | string;
  readonly salario_hora: number;
  readonly jornada: number;
  readonly telefonos: Phone[];
  readonly direccion: Address;

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
  }: User) {
    if (id !== undefined) this.id = id;
    this.cedula = cedula;
    this.nombre = nombre;
    this.p_apellido = p_apellido;
    this.s_apellido = s_apellido;
    this.fecha_nacimiento = fecha_nacimiento;
    if (fecha_contrato !== undefined) this.fecha_contrato = fecha_contrato;
    this.correo = correo;
    if (clave !== undefined) this.clave = clave;
    this.activo = activo;
    this.tipo_empleado = tipo_empleado;
    this.salario_hora = salario_hora;
    this.jornada = jornada;
    this.telefonos = telefonos;
    this.direccion = direccion;
  }
}
