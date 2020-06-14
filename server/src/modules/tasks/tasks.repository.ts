import DB from '../../database/database';
import { Task } from './task.model';

export class TasksRepository {
  public async insertTask(task: Task) {
    await DB.query('INSERT INTO tareas SET ?', task);
  }

  public async getAllTasks() {
    const result = await DB.query(
      'SELECT id, titulo, descripcion, activo FROM tareas WHERE activo = true',
      ''
    );
    return [...result];
  }
}
