import { WagesRepository } from './wages.repository';
import { getMonth, getYear } from 'date-fns';

export class WagesBusiness {
  constructor(private repository = new WagesRepository()) {}

  public async getBasicSalaryData(userId: number, year: number, month: number) {
    return this.repository.retrieveEmployeeInfo(userId, year, month);
  }

  public async getSalaryCalc(userId: number, year: number, month: number) {
    return await this.repository.retrieveSalaryCalc(userId, year, month);
  }

  public async addIncrease(userId: number, amount: number) {
    await this.repository.addIncrease(userId, amount);
  }

  public getIncreases() {
    return this.repository.getIncreases();
  }

  public addRetention(data: { id_empleado: number; retencion: number; descripcion: string }) {
    return this.repository.addRetention(data);
  }

  public getRetentions() {
    return this.repository.getRetentions();
  }

  public deleteRetention(id: number) {
    return this.repository.deleteRetention(id);
  }

  public getHandicaps() {
    return this.repository.getHandicaps();
  }

  public addHandicap(data: {
    id_empleado: number;
    fecha_salida: Date;
    fecha_entrada: Date;
    motivo: string;
    cantidad: number;
  }) {
    return this.repository.addHandicap(data);
  }
}
