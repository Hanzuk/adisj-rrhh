import { Request, Response } from 'express';
import { TravelExpensesBusiness } from './travelExpenses.bussiness';
import { Rol } from '../../utils/enums';

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

  public getTravelEx = async (req: Request, res: Response) => {
    try {
      const data = await this.business.getTravelExpense();

      if (res.locals.authenticated.tipo_empleado !== Rol.Admin) {
        return res.status(200).send(data.filter((item) => item.id_empleado === res.locals.authenticated.id));
      }

      return res.status(200).send(data);
    } catch (error) {
      return res.status(400).send({
        message: 'No se pudo obtener los viaticos.',
        error,
      });
    }
  };

  public delete = async (req: Request, res: Response) => {
    try {
      const { travelExpId } = req.params;

      await this.business.deleteTravelExpense(parseInt(travelExpId));

      return res.status(200).send({ message: 'Viaticos eliminados' });
    } catch (error) {
      return res.status(400).send({
        message: 'No se pudo eliminar los viaticos.',
        error,
      });
    }
  };
}
