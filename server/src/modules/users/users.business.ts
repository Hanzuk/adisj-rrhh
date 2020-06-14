import { UsersRepository } from './users.repository';
import { IUser } from './models/user.interface';
import { IAddress } from './models/address.interface';
import { IPhone } from './models/phone.interface';
import { ISalary } from './models/salary.interface';
import {
  ITemporaryUser,
  ITemporaryContract,
} from './models/temporary.interface';
import { Rol } from '../../utils/enums';

export class UsersBusiness {
  constructor(private repository: UsersRepository = new UsersRepository()) {}

  async saveEmployee(
    employeeData: IUser,
    addressData: IAddress,
    phonesData: IPhone[],
    salaryData: ISalary
  ) {
    const employeeId = await this.repository.saveEmployeeBasic(employeeData);

    addressData.id_empleado = employeeId;
    for (const phone of phonesData) {
      phone.id_empleado = employeeId;
      phone.activo = true;
    }
    salaryData.id_empleado = employeeId;

    await this.repository.saveEmployeeAddres(addressData);
    await this.repository.saveEmployeePhones(phonesData);
    await this.repository.saveEmployeeSalary(salaryData);

    return employeeId;
  }

  async saveTemporaryEmployee(
    temporaryEmployee: ITemporaryUser,
    contractData: ITemporaryContract
  ) {
    await this.repository.saveTemporaryEmployee(temporaryEmployee);
    await this.repository.saveTemporaryContract(contractData);
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
    const salary = await this.repository.getEmployeeSalary(userId);

    await this.repository.updateEmployeeBasic(userId, basicData);

    if (salary.salario_hora > salaryData.salario_hora)
      throw new Error('Los aumentos al salario no se pueden realizar aqui');

    await this.repository.updateEmployeeSalary(userId, salaryData);
  }

  async reHire(
    userId: number,
    newHireDate: Date = new Date(),
    newOutDate: Date,
    newDescription: string
  ) {
    const user = await this.repository.getOneEmployee(userId);

    if (user.tipo_empleado !== Rol.Temporal) {
      throw new Error();
    }

    await this.repository.rehire(
      userId,
      newHireDate,
      newOutDate,
      newDescription
    );
  }

  async fire(data: { id_empleado: number; descripcion: string }) {
    await this.repository.fire(data);
  }
}
