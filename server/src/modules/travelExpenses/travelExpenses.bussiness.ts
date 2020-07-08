import { TravelExpensesRepository } from './travelExpenses.repository';

export class TravelExpensesBusiness {
  constructor(private repository = new TravelExpensesRepository()) {}

  public async insertTravelExpense(travelEx: { id_empleado: number; motivo: string; monto: number }) {
    return await this.repository.insertTravelExpense(travelEx);
  }

  public getTravelExpense() {
    return this.repository.getTravelExpense();
  }

  public async deleteTravelExpense(id: number) {
    await this.repository.deleteTravelExpense(id);
  }
}
