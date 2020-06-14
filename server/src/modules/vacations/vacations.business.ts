import moment from 'moment';

import { VacationsRepository } from './vacations.repository';
import { Vacation } from './vacation.model';

export class VacationsBusiness {
  constructor(private repository = new VacationsRepository()) {}

  public async createRequest(request: Vacation) {
    const outDate = moment(request.fecha_salida);
    const entryDate = moment(request.fecha_entrada);

    const requestedDays = entryDate.diff(outDate, 'days');

    const availableDays = await this.repository.getAvailableDays(
      request.id_empleado
    );

    if (Object.keys(availableDays).length === 0) {
      throw new Error('No tienes dias para salicitar vacaciones');
    }

    if (requestedDays > availableDays.cantidad) {
      throw new Error(
        'No cuentas con suficientes días para solicitar estas vacaciones.'
      );
    }

    await this.repository.insertRequest({
      ...request,
      cantidad: requestedDays,
    });

    await this.repository.updateAvailableDays({
      id: availableDays.id,
      cantidad: availableDays.cantidad - requestedDays,
    });
  }

  public async getRequests() {
    return await this.repository.getRequests();
  }
}
