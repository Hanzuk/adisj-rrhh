import { TasksRepository } from './tasks.repository';
import { Task } from './task.model';
import { DriverTask } from './interfaces/driverTask.interface';

export class TasksBusiness {
  constructor(private repository = new TasksRepository()) {}

  public async insertTask(task: Task) {
    await this.repository.insertTask(task);
  }

  public async insertTaskDriver(
    task: Task,
    driverTask: DriverTask,
    days: string[]
  ) {
    driverTask.id_tarea = await this.repository.insertTask(task);
    await this.repository.insertTaskDriver(driverTask, days);
  }

  public async getAllTasks() {
    return await this.repository.getAllTasks();
  }

  public async getTask(taskId: number) {
    const task = await this.repository.getOneTask(taskId);
    const driverTask = await this.repository.getDriverTask(taskId);
    if (driverTask.length > 0) {
      return {
        ...task,
        horario: [...driverTask],
      };
    }
    return await this.repository.getOneTask(taskId);
  }

  public async deleteATask(taskId: number) {
    await this.repository.deleteTask(taskId);
  }
}
