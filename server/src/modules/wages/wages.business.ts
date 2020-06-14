import { WagesRepository } from './wages.repository';
import moment from 'moment';

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
    const year = moment().year(),
      month = moment().month() + 1;

    const salary = await this.repository.retrieveEmployeeSalary(userId);
    const overtime = await this.repository.retrieveEmployeeOvertime(
      userId,
      year,
      month
    );
    const handicaps = await this.repository.retrieveEmployeeHandicaps(
      userId,
      year,
      month
    );
    const permissions = await this.repository.retrieveEmployeePermissions(
      userId,
      year,
      month
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
    const year = moment().year(),
      month = moment().month() + 1;

    return await this.repository.retrieveSalaryCalc(userId, year, month);
  }
}
