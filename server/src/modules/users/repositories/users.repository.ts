import DB from '../../../database/database';
import { User, Phone, Address } from '../models/user.model';
import { TempUser } from '../models/temp.model';

export class UsersRepository {
  async create(user: User | TempUser): Promise<void> {
    const result = await DB.query('INSERT INTO empleados SET ?;', {
      cedula: user.cedula,
      nombre: user.nombre,
      p_apellido: user.p_apellido,
      s_apellido: user.s_apellido,
      fecha_nacimiento: user.fecha_nacimiento,
      correo: user.correo,
      clave: user.clave,
      activo: true,
      tipo_empleado: user.tipo_empleado,
    });

    await DB.query('INSERT INTO direcciones SET ?;', {
      id_empleado: result.insertId,
      codigo_provincia: user.direccion.provincia,
      codigo_canton: user.direccion.canton,
      codigo_distrito: user.direccion.distrito,
      direccion: user.direccion.direccion,
    });

    await DB.query(
      'INSERT INTO telefonos (id_empleado, numero, activo, tipo_telefono) VALUES ?;',
      [
        user.telefonos.map((phone) => [
          result.insertId,
          phone.numero,
          true,
          phone.tipo_telefono,
        ]),
      ]
    );

    await DB.query('INSERT INTO salarios SET ?;', {
      id_empleado: result.insertId,
      salario_hora: user.salario_hora,
      jornada: user.jornada,
    });

    if (user instanceof TempUser) {
      await DB.query('INSERT INTO empleados_temporales SET ?;', {
        id_empleado: result.insertId,
        fecha_salida: user.fecha_salida,
        descripcion: user.descripcion,
      });

      await DB.query('INSERT INTO contratos_empleados_temporales SET ?;', {
        id_empleado: result.insertId,
        fecha_contrato: new Date(),
        fecha_salida: user.fecha_salida,
        descripcion: user.descripcion,
      });
    }
  }

  async findOne(userId: number): Promise<User | TempUser> {
    const userInfo = await DB.query(
      `SELECT e.id, e.cedula, e.nombre, e.p_apellido, e.s_apellido, e.fecha_nacimiento, e.fecha_contrato, e.correo, e.activo, te.cargo AS tipo_empleado, s.salario_hora, s.jornada
      FROM empleados e
      INNER JOIN tipo_empleados te
      ON e.tipo_empleado = te.id
      INNER JOIN salarios s
      ON e.id = s.id_empleado
      WHERE e.id = ?;`,
      [userId]
    );

    const phones = await DB.query(
      `SELECT t.id, t.numero, te.nombre AS tipo_telefono
      FROM telefonos t
      INNER JOIN tipo_telefonos te
      ON t.tipo_telefono = te.id
      WHERE t.id_empleado = ?;`,
      [userId]
    );

    const address = await DB.query(
      `SELECT p.nombre AS provincia, c.nombre AS canton, dis.nombre AS distrito, dir.direccion
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

    if (userInfo.tipo_empleado === 'Temporal') {
      const tempInfo = await DB.query(
        `SELECT fecha_salida, descripcion
        FROM empleados_temporales
        WHERE id_empleado = ?;`,
        [userId]
      );
      console.log('UsersRepository -> tempInfo', tempInfo);

      return {
        ...userInfo[0],
        telefonos: [...phones],
        direccion: { ...address[0] },
        ...tempInfo[0],
      };
    }

    return {
      ...userInfo[0],
      telefonos: [...phones],
      direccion: { ...address[0] },
    };
  }

  async findAll(): Promise<User[]> {
    const result = await DB.query(
      `SELECT e.id, e.cedula, e.nombre, e.p_apellido, e.s_apellido, e.fecha_nacimiento, e.fecha_contrato, e.correo, e.activo, te.cargo AS tipo_empleado, s.salario_hora, s.jornada
      FROM empleados e
      INNER JOIN tipo_empleados te
      ON e.tipo_empleado = te.id
      INNER JOIN salarios s
      ON e.id = s.id_empleado;`,
      ''
    );
    return result;
  }

  async update(user: User | TempUser): Promise<void> {
    await DB.query('UPDATE empleados SET ? WHERE id = ?;', [
      {
        cedula: user.cedula,
        nombre: user.nombre,
        p_apellido: user.p_apellido,
        s_apellido: user.s_apellido,
        fecha_nacimiento: user.fecha_nacimiento,
        correo: user.correo,
        clave: user.clave,
        tipo_empleado: user.tipo_empleado,
      },
      user.id,
    ]);

    await DB.query('UPDATE salarios SET ? WHERE id_empleado = ?;', [
      { salario_hora: user.salario_hora, jornada: user.jornada },
      user.id,
    ]);

    await DB.query('UPDATE direcciones SET ? WHERE id_empleado = ?;', [
      {
        codigo_provincia: user.direccion.provincia,
        codigo_canton: user.direccion.canton,
        codigo_distrito: user.direccion.distrito,
        direccion: user.direccion.direccion,
      },
      user.id,
    ]);

    for (const phone of user.telefonos) {
      await DB.query('UPDATE telefonos SET ? WHERE id = ?;', [phone, phone.id]);
    }

    if (user instanceof TempUser) {
      await DB.query(
        'UPDATE empleados_temporales SET ? WHERE id_empleado = ?;',
        [
          {
            descripcion: user.descripcion,
          },
          user.id,
        ]
      );
    }
  }

  async updateContact(contact: {
    id: number;
    correo: string;
    telefonos: Phone[];
    direccion: Address;
  }) {
    await DB.query('UPDATE empleados SET ? WHERE id = ?;', [
      { correo: contact.correo },
      contact.id,
    ]);

    await DB.query('UPDATE direcciones SET ? WHERE id_empleado = ?;', [
      {
        codigo_provincia: contact.direccion.provincia,
        codigo_canton: contact.direccion.canton,
        codigo_distrito: contact.direccion.distrito,
        direccion: contact.direccion.direccion,
      },
      contact.id,
    ]);

    for (const phone of contact.telefonos) {
      await DB.query('UPDATE telefonos SET ? WHERE id = ?;', [phone, phone.id]);
    }
  }

  async reHire(
    userId: number,
    newHireDate: Date,
    newOutDate: Date,
    newDescription: string
  ) {
    await DB.query('UPDATE empleados SET ? WHERE id = ?;', [
      {
        fecha_contrato: newHireDate,
      },
      userId,
    ]);

    await DB.query('UPDATE empleados_temporales SET ? WHERE id_empleado = ?;', [
      {
        fecha_salida: newOutDate,
        descripcion: newDescription,
      },
      userId,
    ]);

    await DB.query('INSERT INTO contratos_empleados_temporales SET ?;', {
      id_empleado: userId,
      fecha_contrato: newHireDate,
      fecha_salida: newOutDate,
      descripcion: newDescription,
    });
  }
}
