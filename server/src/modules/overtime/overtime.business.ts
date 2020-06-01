import { OvertimeRepository } from './overtime.repository';
import { Overtime } from './overtime.model';

export class OvertimeBusiness {
  constructor(private repository = new OvertimeRepository()) {}

  async create(overtime: Overtime) {
    await this.repository.create(overtime);
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async onlyAdminUpdate(overtimeId: number, overtime: Overtime) {
    await this.repository.onlyAdminUpdate(overtimeId, overtime);
  }

  async allUpdate(overtimeId: number, overtime: Overtime) {
    await this.repository.allUpdate(overtimeId, overtime);
  }
}
