import DB from '../../database/database';
import { Profile, Phone, Address } from './profile.model';

export class ProfilesRepository {
  public async getMyInfo(userId: number) {
    const userInfo = await DB.query(
      `SELECT e.id
          , e.cedula
          , e.nombre
          , e.p_apellido
          , e.s_apellido
          , e.fecha_nacimiento
          , e.fecha_contrato
          , e.correo
          , e.activo
          , te.cargo AS tipo_empleado
          , s.salario_hora
          , s.jornada
      FROM empleados e
          INNER JOIN tipo_empleados te
          ON e.tipo_empleado = te.id
          INNER JOIN salarios s
          ON e.id = s.id_empleado
      WHERE e.id = ?;`,
      [userId]
    );

    const phones = await DB.query(
      `SELECT t.id
          , t.numero
          , te.nombre AS tipo_telefono
      FROM telefonos t
          INNER JOIN tipo_telefonos te
          ON t.tipo_telefono = te.id
      WHERE t.id_empleado = ?;`,
      [userId]
    );

    const address = await DB.query(
      `SELECT p.nombre AS provincia
          , c.nombre AS canton
          , dis.nombre AS distrito
          , dir.direccion
      FROM direcciones dir
          INNER JOIN provincias p
          ON dir.codigo_provincia = p.codigo
          INNER JOIN cantones c
          ON dir.codigo_canton = c.codigo
          INNER JOIN distritos dis
          ON dir.codigo_distrito = dis.codigo
      WHERE dir.id_empleado = ?;`,
      [userId]
    );

    return {
      ...userInfo[0],
      telefonos: [...phones],
      direccion: { ...address[0] },
    };
  }

  public async editMyInfo(
    userId: number,
    newInfo: {
      cedula: string;
      nombre: string;
      p_apellido: string;
      s_apellido: string;
      fecha_nacimiento: Date;
      codigo_provincia: number;
      codigo_canton: number;
      codigo_distrito: number;
      direccion: string;
      telefonos: { numero: string; tipo_telefono: number }[];
    },
    oldPhones: number[]
  ) {
    await DB.query('UPDATE empleados SET ? WHERE id = ?', [
      {
        cedula: newInfo.cedula,
        nombre: newInfo.nombre,
        p_apellido: newInfo.p_apellido,
        s_apellido: newInfo.s_apellido,
        fecha_nacimiento: newInfo.fecha_nacimiento,
      },
      userId,
    ]);

    for await (const phoneId of oldPhones) {
      DB.query('DELETE FROM telefonos WHERE id = ?;', [phoneId]);
    }

    await DB.query('INSERT INTO telefonos (id_empleado, numero, activo, tipo_telefono) VALUES ?;', [
      newInfo.telefonos.map((phone) => [userId, phone.numero, true, phone.tipo_telefono]),
    ]);

    await DB.query('UPDATE direcciones SET ? WHERE id_empleado = ?', [
      {
        codigo_provincia: newInfo.codigo_provincia,
        codigo_canton: newInfo.codigo_canton,
        codigo_distrito: newInfo.codigo_distrito,
        direccion: newInfo.direccion,
      },
      userId,
    ]);
  }
}
