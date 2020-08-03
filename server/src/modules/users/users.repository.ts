import DB from '../../database/database';
import { IUser } from './models/user.interface';
import { IAddress } from './models/address.interface';
import { IPhone } from './models/phone.interface';
import { ISalary } from './models/salary.interface';
import { ITemporaryUser, ITemporaryContract } from './models/temporary.interface';

interface IUserInfo extends IUser, ISalary {
  telefonos: IPhone[];
  direccion: IAddress;
  info_contrato?: {
    actual: ITemporaryUser;
    anteriores: ITemporaryContract[];
  };
}

export class UsersRepository {
  async savePermanent(basic: IUser, address: IAddress, phones: IPhone[], salary: ISalary): Promise<void> {
    try {
      await DB.startTransaction();
      const user = await DB.query('INSERT INTO empleados SET ?;', basic);
      address.id_empleado = parseInt(user.insertId);
      salary.id_empleado = parseInt(user.insertId);

      await Promise.all([
        DB.query('INSERT INTO direcciones SET ?;', address),
        DB.query('INSERT INTO telefonos (id_empleado, numero, activo, tipo_telefono) VALUES ?;', [
          phones.map((phone) => [parseInt(user.insertId), phone.numero, true, phone.tipo_telefono]),
        ]),
        DB.query('INSERT INTO salarios SET ?;', salary),
      ]);

      await DB.commitTransaction();
    } catch (error) {
      await DB.rollbackTransaction();
      throw error;
    }
  }

  async saveTemporary(
    basic: IUser,
    address: IAddress,
    phones: IPhone[],
    salary: ISalary,
    temp: ITemporaryUser,
    contract: ITemporaryContract
  ): Promise<void> {
    try {
      await DB.startTransaction();
      const user = await DB.query('INSERT INTO empleados SET ?;', basic);
      address.id_empleado = parseInt(user.insertId);
      salary.id_empleado = parseInt(user.insertId);
      temp.id_empleado = parseInt(user.insertId);
      contract.id_empleado = parseInt(user.insertId);

      await Promise.all([
        DB.query('INSERT INTO direcciones SET ?;', address),
        DB.query('INSERT INTO telefonos (id_empleado, numero, activo, tipo_telefono) VALUES ?;', [
          phones.map((phone) => [parseInt(user.insertId), phone.numero, true, phone.tipo_telefono]),
        ]),
        DB.query('INSERT INTO salarios SET ?;', salary),
        DB.query('INSERT INTO empleados_temporales SET ?;', temp),
        DB.query('INSERT INTO contratos_empleados_temporales SET ?;', contract),
      ]);

      await DB.commitTransaction();
    } catch (error) {
      await DB.rollbackTransaction();
      throw error;
    }
  }

  async getOneEmployee(userId: number): Promise<IUserInfo> {
    const data = await Promise.all([
      DB.query(
        'SELECT id, cedula, nombre, p_apellido, s_apellido, fecha_nacimiento, fecha_contrato, correo, tipo_empleado FROM empleados WHERE activo = true AND id = ?;',
        [userId]
      ),
      DB.query(
        'SELECT t.id , t.numero , te.nombre AS tipo_telefono FROM telefonos t INNER JOIN tipo_telefonos te ON t.tipo_telefono = te.id WHERE t.id_empleado = ? AND t.activo = true;',
        [userId]
      ),
      DB.query(
        'SELECT p.nombre AS provincia, c.nombre AS canton, dis.nombre AS distrito, dir.direccion FROM direcciones dir INNER JOIN provincias p ON dir.codigo_provincia = p.codigo INNER JOIN cantones c ON dir.codigo_canton = c.codigo INNER JOIN distritos dis ON dir.codigo_distrito = dis.codigo WHERE dir.id_empleado = ? AND dir.activo = true;',
        [userId]
      ),
      DB.query('SELECT salario_hora, jornada FROM salarios WHERE id_empleado = ? AND activo = true;', [userId]),
      DB.query('SELECT fecha_salida, descripcion FROM empleados_temporales WHERE id_empleado = ?;', [userId]),
      DB.query(
        'SELECT fecha_contrato, fecha_salida, dias, descripcion FROM contratos_empleados_temporales WHERE id_empleado = ? AND activo = false;',
        [userId]
      ),
    ]);

    if (data[0][0].tipo_empleado !== 4) {
      return {
        ...data[0][0],
        telefonos: data[1],
        direccion: { ...data[2][0] },
        ...data[3][0],
      };
    }

    return {
      ...data[0][0],
      telefonos: data[1],
      direccion: { ...data[2][0] },
      ...data[3][0],
      info_contrato: {
        actual: { ...data[4][0] },
        anteriores: data[5],
      },
    };
  }

  async getAllEmployees(): Promise<IUser[]> {
    const result = await DB.query(
      `SELECT e.id
          , e.nombre
          , e.p_apellido
          , e.s_apellido
          , e.fecha_contrato
          , te.cargo AS tipo_empleado
      FROM empleados e
          INNER JOIN tipo_empleados te ON e.tipo_empleado = te.id
      WHERE e.activo = true`,
      ''
    );
    return [...result];
  }

  async updateEmployeeBasic(
    userId: number,
    basicData: {
      correo: string;
      clave: string;
      tipo_empleado: number;
    }
  ): Promise<void> {
    if (basicData.tipo_empleado === 4) {
      await Promise.all([
        DB.query('INSERT INTO empleados_temporales SET ?;', { id_empleado: userId, fecha_salida: '', descripcion: '' }),
        DB.query('INSERT INTO contratos_empleados_temporales SET ?;', {
          id_empleado: userId,
          fecha_salida: '',
          descripcion: '',
        }),
      ]);
    }

    await DB.query('UPDATE empleados SET ? WHERE id = ?;', [basicData, userId]);
  }

  async updateEmployeeSalary(userId: number, salaryData: { salario_hora: number; jornada: number }): Promise<void> {
    await DB.query('UPDATE salarios SET ? WHERE id_empleado = ?;', [salaryData, userId]);
  }

  async rehire(rehireData: ITemporaryContract) {
    //REVIEW: Transaccion?
    await Promise.all([
      DB.query('UPDATE empleados SET ? WHERE id = ?;', [
        {
          fecha_contrato: rehireData.fecha_contrato,
        },
        rehireData.id_empleado,
      ]),
      DB.query('UPDATE empleados_temporales SET ? WHERE id_empleado = ?;', [
        {
          fecha_salida: rehireData.fecha_salida,
          descripcion: rehireData.descripcion,
        },
        rehireData.id_empleado,
      ]),
      DB.query('UPDATE contratos_empleados_temporales SET activo = false WHERE id_empleado = ?;', [
        rehireData.id_empleado,
      ]),
      DB.query('INSERT INTO contratos_empleados_temporales SET ?;', rehireData),
    ]);
  }

  async fire(data: { id_empleado: number; descripcion: string }) {
    await Promise.all([
      DB.query('INSERT INTO despidos SET ?;', data),
      DB.query('UPDATE empleados SET ? WHERE id = ?;', [{ activo: false }, data.id_empleado]),
    ]);
  }

  async addressCatalog() {
    const catalogues = await Promise.all([
      DB.query('SELECT codigo, nombre FROM provincias;', ''),
      DB.query('SELECT codigo, nombre, codigo_provincia FROM cantones;', ''),
      DB.query('SELECT codigo, nombre, codigo_canton FROM distritos;', ''),
    ]);

    return {
      provinces: [...catalogues[0]],
      cantones: [...catalogues[1]],
      districts: [...catalogues[2]],
    };
  }
}
