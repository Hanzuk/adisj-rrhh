import { WagesRepository } from './wages.repository';
import { getMonth, getYear } from 'date-fns';

export class WagesBusiness {
  constructor(private repository = new WagesRepository()) {}

  public async getBasicSalaryData(
    userId: number
  ): Promise<{
    salario_hora: number;
    jornada: number;
    horas_extras: number;
    incapacidades_mes: number;
    permisos: number;
  }> {
    const salary = await this.repository.retrieveEmployeeSalary(userId);
    const overtime = await this.repository.retrieveEmployeeOvertime(
      userId,
      getYear(new Date()),
      getMonth(new Date()) + 1
    );
    const handicaps = await this.repository.retrieveEmployeeHandicaps(
      userId,
      getYear(new Date()),
      getMonth(new Date()) + 1
    );
    const permissions = await this.repository.retrieveEmployeePermissions(
      userId,
      getYear(new Date()),
      getMonth(new Date()) + 1
    );

    return {
      salario_hora: salary.salario_hora,
      jornada: salary.jornada,
      horas_extras: overtime === null ? 0 : overtime,
      incapacidades_mes: handicaps === null ? 0 : handicaps,
      permisos: permissions === null ? 0 : permissions,
    };
  }

  public async getSalaryCalc(userId: number) {
    return await this.repository.retrieveSalaryCalc(
      userId,
      getYear(new Date()),
      getMonth(new Date()) + 1
    );
  }
}
