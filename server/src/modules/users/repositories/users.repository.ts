import DB from '../../../database/database';
import { User, Phone, Address } from '../models/user.model';
import { TempUser } from '../models/temp.model';
import { IUser } from '../models/user.interface';
import { IAddress } from '../models/address.interface';
import { IPhone } from '../models/phone.interface';
import { ISalary } from '../models/salary.interface';
import {
  ITemporaryUser,
  ITemporaryContract,
} from '../models/temporary.interface';

interface IUserInfo extends IUser, ISalary {
  telefonos: IPhone[];
  direccion: IAddress;
  info_contrato?: {
    actual: ITemporaryUser;
    anteriores: ITemporaryContract[];
  };
}
export class UsersRepository {
  /**
   * Inserta los datos básicos en la tabla de empleados
   * @returns El id del empleado insertado
   */
  async saveEmployeeBasic(employeeData: IUser): Promise<number> {
    const result = await DB.query('INSERT INTO empleados SET ?;', employeeData);
    return parseInt(result.insertId);
  }

  async saveEmployeeAddres(addressData: IAddress): Promise<void> {
    await DB.query('INSERT INTO direcciones SET ?;', addressData);
  }

  async saveEmployeePhones(phonesData: IPhone[]): Promise<void> {
    await DB.query(
      'INSERT INTO telefonos (id_empleado, numero, activo, tipo_telefono) VALUES ?;',
      [
        phonesData.map((phone) => [
          phone.id_empleado,
          phone.numero,
          phone.activo,
          phone.tipo_telefono,
        ]),
      ]
    );
  }

  async saveEmployeeSalary(salaryData: ISalary): Promise<void> {
    await DB.query('INSERT INTO salarios SET ?;', salaryData);
  }

  async saveTemporaryEmployee(
    temporaryEmployee: ITemporaryUser
  ): Promise<void> {
    await DB.query(
      'INSERT INTO empleados_temporales SET ?;',
      temporaryEmployee
    );
  }

  async saveTemporaryContract(contractData: ITemporaryContract): Promise<void> {
    await DB.query(
      'INSERT INTO contratos_empleados_temporales SET ?;',
      contractData
    );
  }

  async getEmployeeBasic(userId: number): Promise<IUser> {
    const userInfo = await DB.query(
      `SELECT id
          , cedula
          , nombre
          , p_apellido
          , s_apellido
          , fecha_nacimiento
          , fecha_contrato
          , correo
          , tipo_empleado
      FROM empleados
      WHERE activo = true AND id = ?;`,
      [userId]
    );

    return { ...userInfo[0] };
  }

  async getEmployeePhones(userId: number): Promise<IPhone[]> {
    const phones = await DB.query(
      `SELECT t.id
          , t.numero
          , te.nombre AS tipo_telefono
      FROM telefonos t
          INNER JOIN tipo_telefonos te ON t.tipo_telefono = te.id
      WHERE t.id_empleado = ? AND t.activo = true;`,
      [userId]
    );

    return [...phones];
  }

  async getEmployeeAddress(userId: number): Promise<IAddress> {
    const address = await DB.query(
      `SELECT p.nombre AS provincia
          , c.nombre AS canton
          , dis.nombre AS distrito
          , dir.direccion
      FROM direcciones dir
          INNER JOIN provincias p ON dir.codigo_provincia = p.codigo
          INNER JOIN cantones c ON dir.codigo_canton = c.codigo
          INNER JOIN distritos dis ON dir.codigo_distrito = dis.codigo
      WHERE dir.id_empleado = ? AND dir.activo = true;`,
      [userId]
    );

    return { ...address[0] };
  }

  async getEmployeeSalary(userId: number): Promise<ISalary> {
    const salary = await DB.query(
      `SELECT salario_hora, jornada FROM salarios
      WHERE id_empleado = ? AND activo = true;`,
      [userId]
    );

    return { ...salary[0] };
  }

  async getTemEmployee(userId: number): Promise<ITemporaryUser> {
    const result = await DB.query(
      `SELECT fecha_salida, descripcion FROM empleados_temporales
      WHERE id_empleado = ?;`,
      [userId]
    );
    return { ...result[0] };
  }

  async getTemEmployeeContracts(userId: number): Promise<ITemporaryContract[]> {
    const result = await DB.query(
      `SELECT fecha_contrato, fecha_salida, dias, descripcion
      FROM contratos_empleados_temporales
      WHERE id_empleado = ? AND activo = false;`,
      [userId]
    );
    return [...result];
  }

  async getOneEmployee(userId: number): Promise<IUserInfo> {
    const basic = await this.getEmployeeBasic(userId);
    const phones = await this.getEmployeePhones(userId);
    const address = await this.getEmployeeAddress(userId);
    const salary = await this.getEmployeeSalary(userId);

    if (basic.tipo_empleado !== 4) {
      return {
        ...basic,
        telefonos: phones,
        direccion: address,
        ...salary,
      };
    }

    const tempData = await this.getTemEmployee(userId);
    const contracts = await this.getTemEmployeeContracts(userId);

    return {
      ...basic,
      telefonos: phones,
      direccion: address,
      ...salary,
      info_contrato: {
        actual: tempData,
        anteriores: contracts,
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

  async rehire(
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

    await DB.query(
      'UPDATE contratos_empleados_temporales SET activo = false WHERE id_empleado = ?;',
      [userId]
    );

    await DB.query('INSERT INTO contratos_empleados_temporales SET ?;', {
      id_empleado: userId,
      fecha_contrato: newHireDate,
      fecha_salida: newOutDate,
      descripcion: newDescription,
    });
  }

  async fire(data: { id_empleado: number; descripcion: string }) {
    await DB.query('INSERT INTO despidos SET ?;', data);
    await DB.query('UPDATE empleados SET ? WHERE id = ?;', [
      { activo: false },
      data.id_empleado,
    ]);
  }
}
