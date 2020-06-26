import { UsersRepository } from './users.repository';
import { IUser } from './models/user.interface';
import { IAddress } from './models/address.interface';
import { IPhone } from './models/phone.interface';
import { ISalary } from './models/salary.interface';
import { ITemporaryUser, ITemporaryContract } from './models/temporary.interface';
import { Rol } from '../../utils/enums';

export class UsersBusiness {
  constructor(private repository: UsersRepository = new UsersRepository()) {}

  async savePermanent(basic: IUser, address: IAddress, phones: IPhone[], salary: ISalary) {
    await this.repository.savePermanent(basic, address, phones, salary);
  }

  async saveTemporaryEmployee(
    basic: IUser,
    address: IAddress,
    phones: IPhone[],
    salary: ISalary,
    temp: ITemporaryUser,
    contract: ITemporaryContract
  ) {
    await this.repository.saveTemporary(basic, address, phones, salary, temp, contract);
  }

  async getEmployee(userId: number) {
    return await this.repository.getOneEmployee(userId);
  }

  async getEmployees() {
    return await this.repository.getAllEmployees();
  }

  async update(
    userId: number,
    basicData: {
      cedula: string;
      nombre: string;
      p_apellido: string;
      s_apellido: string;
      fecha_nacimiento: Date;
      clave: string;
    },
    salaryData: { salario_hora: number; jornada: number }
  ) {
    const { salario_hora } = await this.repository.getOneEmployee(userId);

    if (salaryData.salario_hora > salario_hora) throw new Error('Los aumentos al salario no se pueden realizar aqui');

    await this.repository.updateEmployeeBasic(userId, basicData);
    await this.repository.updateEmployeeSalary(userId, salaryData);
  }

  async reHire(rehireData: ITemporaryContract) {
    const user = await this.repository.getOneEmployee(rehireData.id_empleado);

    if (user.tipo_empleado !== Rol.Temporal) {
      throw new Error();
    }

    await this.repository.rehire(rehireData);
  }

  async fire(data: { id_empleado: number; descripcion: string }) {
    await this.repository.fire(data);
  }

  async getCatalog() {
    return await this.repository.addressCatalog();
  }
}
