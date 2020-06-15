import { differenceInCalendarDays } from 'date-fns';

import { VacationsRepository } from './vacations.repository';
import { Vacation } from './vacation.model';

export class VacationsBusiness {
  constructor(private repository = new VacationsRepository()) {}

  public async createRequest(request: Vacation) {
    const requestedDays = differenceInCalendarDays(
      new Date(request.fecha_entrada),
      new Date(request.fecha_salida)
    );

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
