import { WagesBusiness } from './wages.business';
import { Request, Response } from 'express';

export class WagesController {
  constructor(private business = new WagesBusiness()) {}

  public calcSalary = async (req: Request, res: Response) => {
    const { employeesIds, year, month } = req.body;

    try {
      let calcs = [];

      for (const id of employeesIds) {
        const data = await Promise.all([
          this.business.getBasicSalaryData(parseInt(id), year, month),
          this.business.getSalaryCalc(parseInt(id), year, month),
        ]);

        calcs.push({ ...data[0], ...data[1] });
      }

      return res.status(200).send(calcs);
    } catch (error) {
      return res.status(400).send(error);
    }
  };

  public increaseSalary = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { cantidad } = req.body;

    try {
      await this.business.addIncrease(parseInt(userId), parseFloat(cantidad));
      return res.status(200).send({ message: 'Aumento salarial realizado' });
    } catch (error) {
      return res.status(400).send(error);
    }
  };

  public increases = async (req: Request, res: Response) => {
    try {
      const data = await this.business.getIncreases();
      return res.status(200).send(data);
    } catch (error) {
      return res.status(400).send(error);
    }
  };

  public newRetention = async (req: Request, res: Response) => {
    const { id, amount, reason } = req.body;

    try {
      await this.business.addRetention({ id_empleado: id, retencion: amount, descripcion: reason });
      return res.status(200).send({ message: 'Retencion salarial realizado' });
    } catch (error) {
      return res.status(400).send(error);
    }
  };

  public retentions = async (req: Request, res: Response) => {
    try {
      const data = await this.business.getRetentions();
      return res.status(200).send(data);
    } catch (error) {
      return res.status(400).send(error);
    }
  };

  public delete = async (req: Request, res: Response) => {
    const { retentionId } = req.params;

    try {
      await this.business.deleteRetention(parseInt(retentionId));
      return res.status(200).send({ message: 'Retencion eliminada' });
    } catch (error) {
      return res.status(400).send(error);
    }
  };

  public handicaps = async (req: Request, res: Response) => {
    try {
      const data = await this.business.getHandicaps();
      return res.status(200).send(data);
    } catch (error) {
      return res.status(400).send(error);
    }
  };

  public newHandicap = async (req: Request, res: Response) => {
    const { id_empleado, fecha_entrada, fecha_salida, motivo, cantidad } = req.body;
    try {
      const data = await this.business.addHandicap({ id_empleado, fecha_entrada, fecha_salida, motivo, cantidad });
      return res.status(200).send(data);
    } catch (error) {
      return res.status(400).send(error);
    }
  };
}
