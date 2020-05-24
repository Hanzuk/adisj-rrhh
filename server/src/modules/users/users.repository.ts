import DB from '../../database/database';
import { User, TemporaryUser } from './users.model';

export class UsersRepository {
  async create(user: User): Promise<void> {
    const result = await DB.query('INSERT INTO empleados SET ?;', {
      cedula: user.idCard,
      nombre: user.name,
      p_apellido: user.lastName1,
      s_apellido: user.lastName2,
      fecha_nacimiento: user.birthdate,
      correo: user.email,
      clave: user.password,
      activo: true,
      tipo_empleado: user.rol,
    });

    await DB.query(
      'INSERT INTO telefonos (id_empleado, numero, activo, tipo_telefono) VALUES ?;',
      [user.phones.map((x) => [result.insertId, x.number, true, x.type])]
    );

    await DB.query('INSERT INTO direcciones SET ?;', {
      id_empleado: result.insertId,
      codigo_provincia: user.address.province,
      codigo_canton: user.address.canton,
      codigo_distrito: user.address.district,
      direccion: user.address.address,
    });

    await DB.query('INSERT INTO salarios SET ?;', {
      id_empleado: result.insertId,
      salario_hora: user.salary,
      jornada: 8,
    });
  }

  async createTemporary(user: TemporaryUser): Promise<void> {
    const result = await DB.query('INSERT INTO empleados SET ?;', {
      cedula: user.idCard,
      nombre: user.name,
      p_apellido: user.lastName1,
      s_apellido: user.lastName2,
      fecha_nacimiento: user.birthdate,
      correo: user.email,
      clave: user.password,
      activo: true,
      tipo_empleado: user.rol,
    });

    await DB.query(
      'INSERT INTO telefonos (id_empleado, numero, activo, tipo_telefono) VALUES ?;',
      [user.phones.map((x) => [result.insertId, x.number, true, x.type])]
    );

    await DB.query('INSERT INTO direcciones SET ?;', {
      id_empleado: result.insertId,
      codigo_provincia: user.address.province,
      codigo_canton: user.address.canton,
      codigo_distrito: user.address.district,
      direccion: user.address.address,
    });

    await DB.query('INSERT INTO salarios SET ?;', {
      id_empleado: result.insertId,
      salario_hora: user.salary,
      jornada: 8,
    });

    await DB.query('INSERT INTO empleados_temporales SET ?;', {
      id_empleado: result.insertId,
      fecha_salida: user.departureDate,
      descripcion: user.description,
    });

    await DB.query('INSERT INTO contratos_empleados_temporales SET ?;', {
      id_empleado: result.insertId,
      fecha_contrato: new Date(),
      fecha_salida: user.departureDate,
      descripcion: user.description,
    });
  }
}
