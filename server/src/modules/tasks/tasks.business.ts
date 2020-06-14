import { TasksRepository } from './tasks.repository';
import { Task } from './task.model';

export class TasksBusiness {
  constructor(private repository = new TasksRepository()) {}

  public async insertTask(task: Task) {
    await this.repository.insertTask(task);
  }

  public async getAllTasks() {
    return await this.repository.getAllTasks();
  }
}
