import { TasksBusiness } from './tasks.business';
import { Request, Response } from 'express';
import { Rol } from '../../utils/enums';
import { UsersBusiness } from '../users/users.business';
import { DriverTask } from './interfaces/driverTask.interface';

export class TasksController {
  constructor(private taskBusiness = new TasksBusiness(), private userBusiness = new UsersBusiness()) {}

  public createTask = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { titulo, descripcion } = req.body;

    try {
      await this.taskBusiness.insertTask({
        id_empleado: parseInt(userId),
        titulo,
        descripcion,
      });

      return res.status(200).send({ message: 'Tarea asignada' });
    } catch (error) {
      return res.status(400).send(error);
    }
  };

  public createTaskDriver = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { titulo, descripcion, asignacion_chofer } = req.body;

    if (!asignacion_chofer) {
      return res.status(400).send({ message: 'Faltan datos para asignar esta tarea' });
    }

    try {
      const userInfo = await this.userBusiness.getEmployee(parseInt(userId));
      if (userInfo.tipo_empleado !== Rol.Chofer) {
        return res.status(400).send({
          message: 'Este tipo de empleado no puede recibir este tipo de tarea',
        });
      }

      let driverTask: DriverTask;

      if (asignacion_chofer.tipo_servicio === 'Especial') {
        driverTask = {
          vehiculo: asignacion_chofer.vehiculo,
          horario: 4,
          tipo_servicio: asignacion_chofer.tipo_servicio,
          horas_servicio: asignacion_chofer.horas_servicio,
          salario_hora: asignacion_chofer.salario_hora,
        };
      } else {
        driverTask = {
          vehiculo: asignacion_chofer.vehiculo,
          horario: asignacion_chofer.horario,
          tipo_servicio: asignacion_chofer.tipo_servicio,
          horas_servicio: userInfo.jornada,
          salario_hora: userInfo.salario_hora,
        };
      }

      await this.taskBusiness.insertTaskDriver(
        { id_empleado: parseInt(userId), titulo, descripcion },
        driverTask,
        asignacion_chofer.dias
      );

      return res.status(200).send({ message: 'Tarea asignada' });
    } catch (error) {
      return res.status(400).send(error);
    }
  };

  public getTasks = async (req: Request, res: Response) => {
    try {
      const tasks = await this.taskBusiness.getAllTasks();

      if (res.locals.authenticated.tipo_empleado !== Rol.Admin) {
        return res.status(200).send(tasks.filter((task) => task.id_empleado === res.locals.authenticated.id));
      }

      return res.status(200).send(tasks);
    } catch (error) {
      return res.status(404).send(error);
    }
  };

  public getTask = async (req: Request, res: Response) => {
    const { taskId } = req.params;
    try {
      const task = await this.taskBusiness.getTask(parseInt(taskId));

      return res.status(200).send(task);
    } catch (error) {
      return res.status(404).send(error);
    }
  };

  public deleteTask = async (req: Request, res: Response) => {
    const { taskId } = req.params;
    try {
      await this.taskBusiness.deleteATask(parseInt(taskId));

      return res.status(200).send({ message: 'Tarea eliminda con éxito' });
    } catch (error) {
      return res.status(404).send(error);
    }
  };

  public schedule = async (req: Request, res: Response) => {
    try {
      const data = await this.taskBusiness.getSchedule();

      return res.status(200).send(data);
    } catch (error) {
      return res.status(404).send(error);
    }
  };
}
