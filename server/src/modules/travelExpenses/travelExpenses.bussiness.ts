import { TravelExpensesRepository } from './travelExpenses.repository';

export class TravelExpensesBusiness {
  constructor(private repository = new TravelExpensesRepository()) {}

  public async insertTravelExpense(travelEx: { id_empleado: number; motivo: string; monto: number }) {
    return await this.repository.insertTravelExpense(travelEx);
  }

  // public async getAvailableDays(userId: number) {
  //   return await this.repository.getAvailableDays(userId);
  // }
}
