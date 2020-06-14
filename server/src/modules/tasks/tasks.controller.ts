import { TasksBusiness } from './tasks.business';
import { Request, Response } from 'express';
import { Rol } from '../../utils/enums';

export class TasksController {
  constructor(private business = new TasksBusiness()) {}

  public createTask = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { titulo, descripcion } = req.body;

    try {
      await this.business.insertTask({
        id_empleado: parseInt(userId),
        titulo,
        descripcion,
      });

      return res.status(200).send({ message: 'Tarea asignada' });
    } catch (error) {
      return res.status(400).send(error);
    }
  };

  public getTasks = async (req: Request, res: Response) => {
    try {
      const tasks = await this.business.getAllTasks();

      if (res.locals.authenticated.tipo_empleado !== Rol.Admin) {
        return res
          .status(200)
          .send(
            tasks.filter(
              (task) => task.id_empleado === res.locals.authenticated.id
            )
          );
      }

      return res.status(200).send(tasks);
    } catch (error) {
      return res.status(404).send(error);
    }
  };
}
