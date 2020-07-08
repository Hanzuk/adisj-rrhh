import { Request, Response } from 'express';
import { TravelExpensesBusiness } from './travelExpenses.bussiness';

export class TravelExpensesController {
  constructor(private business: TravelExpensesBusiness = new TravelExpensesBusiness()) {}

  public newTravelEx = async (req: Request, res: Response) => {
    const { id_empleado, motivo, monto } = req.body;

    try {
      await this.business.insertTravelExpense({
        id_empleado,
        motivo,
        monto,
      });

      return res.status(200).send({ message: 'Viaticos insertados' });
    } catch (error) {
      return res.status(400).send({
        message: 'No se pudo insertar los viaticos',
        error,
      });
    }
  };

  // public getVacationsRequests = async (req: Request, res: Response) => {
  //   try {
  //     const requests = await this.business.getRequests();
  //     return res.status(200).send(requests);
  //   } catch (error) {
  //     return res.status(400).send({
  //       message: 'No se pudo obtener las solicitudes de vacaciones',
  //       error,
  //     });
  //   }
  // };

  // public availableDays = async (req: Request, res: Response) => {
  //   try {
  //     const data = await this.business.getAvailableDays(res.locals.authenticated.id);
  //     return res.status(200).send(data);
  //   } catch (error) {
  //     return res.status(400).send({
  //       message: 'No se pudo obtener la cantidad de vacioners disponibles',
  //       error,
  //     });
  //   }
  // };
}
