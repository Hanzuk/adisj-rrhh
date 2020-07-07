import DB from '../../database/database';
import { Task } from './task.model';
import { DriverTask } from './interfaces/driverTask.interface';

export class TasksRepository {
  public async insertTask(task: Task) {
    const result = await DB.query('INSERT INTO tareas SET ?', task);
    return parseInt(result.insertId);
  }

  public async insertTaskDriver(task: DriverTask, days: string[]) {
    for (const day of days) {
      task.dia = day;
      await DB.query('INSERT INTO asignaciones_choferes SET ?', task);
    }
  }

  public async getOneTask(
    taskId: number
  ): Promise<{
    id: number;
    titulo: string;
    descripcion: string;
    asignada_a: string;
  }> {
    const result = await DB.query(
      `SELECT t.id
        , t.titulo
        , t.descripcion
        , CONCAT(e.nombre, ' ', e.p_apellido) AS asignada_a
      FROM tareas t
      INNER JOIN empleados e ON t.id_empleado = e.id
      WHERE t.id = ?;`,
      [taskId]
    );
    return { ...result[0] };
  }

  public async getAllTasks(): Promise<Task[]> {
    const result = await DB.query(
      `SELECT t.id
        , t.id_empleado
        , t.titulo
        , t.descripcion
        , CONCAT(e.nombre, ' ', e.p_apellido) AS asignada_a
        , t.fecha_asignacion
      FROM tareas t
      INNER JOIN empleados e ON t.id_empleado = e.id
      ORDER BY t.fecha_asignacion DESC;`,
      ''
    );

    return [...result];
  }

  public async getDriverTask(
    taskId: number
  ): Promise<
    {
      dia: string;
      tipo_servicio: string;
      salario_hora: number;
      horas_servicio: number;
      vehiculo: string;
      hora_entrada: Date;
      hora_salida: Date;
    }[]
  > {
    const result = await DB.query(
      `SELECT ac.id_tarea
          , ac.dia
          , ac.tipo_servicio
          , ac.salario_hora
          , ac.horas_servicio
          , ac.vehiculo
          , hc.hora_entrada
          , hc.hora_salida
      FROM asignaciones_choferes ac
      INNER JOIN tareas t ON ac.id_tarea = t.id
      INNER JOIN horarios_choferes hc ON ac.horario = hc.id
      WHERE t.id = ?;`,
      [taskId]
    );
    return [...result];
  }

  public async deleteTask(taskId: number) {
    await Promise.all([
      DB.query('DELETE FROM asignaciones_choferes WHERE id_tarea = ?;', [taskId]),
      DB.query('DELETE FROM tareas WHERE id = ?;', [taskId]),
    ]);
  }

  public getSchedule() {
    return DB.query('SELECT id,hora_entrada,hora_salida FROM horarios_choferes;', '');
  }
}
