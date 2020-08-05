import DB from '../../database/database';

export class DashboardRepository {
  async adminDashData(): Promise<{
    permisos: number;
    horas_extras: number;
    permisos_tramitados: number;
    horas_extras_tramitadas: number;
    tareas: number;
    amonestaciones: number;
    felicitaciones: number;
  }> {
    const data = await Promise.all([
      DB.query(
        'SELECT COUNT(*) AS permisos FROM permisos WHERE activo = true AND id_estado = 1 AND MONTH(fecha_solicitud) = MONTH(CURDATE()) AND YEAR(fecha_solicitud) = YEAR(CURDATE());',
        ''
      ),
      DB.query(
        'SELECT COUNT(*) AS horas_extras FROM horas_extras WHERE activo = true AND id_estado = 1 AND MONTH(fecha) = MONTH(CURDATE()) AND YEAR(fecha) = YEAR(CURDATE());',
        ''
      ),
      DB.query(
        'SELECT COUNT(*) AS permisos_tr FROM permisos WHERE activo = true AND (id_estado = 2 OR id_estado = 3) AND MONTH(fecha_solicitud) = MONTH(CURDATE()) AND YEAR(fecha_solicitud) = YEAR(CURDATE());',
        ''
      ),
      DB.query(
        'SELECT COUNT(*) AS horas_extras_tr FROM horas_extras WHERE activo = true AND (id_estado = 2 OR id_estado = 3) AND MONTH(fecha) = MONTH(CURDATE()) AND YEAR(fecha) = YEAR(CURDATE());',
        ''
      ),
      DB.query(
        'SELECT COUNT(*) AS tareas FROM tareas WHERE activo = true AND MONTH(fecha_asignacion) = MONTH(CURDATE()) AND YEAR(fecha_asignacion) = YEAR(CURDATE());',
        ''
      ),
      DB.query(
        'SELECT COUNT(*) AS amonestaciones FROM amonestaciones WHERE activo = true AND MONTH(fecha) = MONTH(CURDATE()) AND YEAR(fecha) = YEAR(CURDATE());',
        ''
      ),
      DB.query(
        'SELECT COUNT(*) AS felicitaciones FROM felicitaciones WHERE activo = true AND MONTH(fecha) = MONTH(CURDATE()) AND YEAR(fecha) = YEAR(CURDATE());',
        ''
      ),
    ]);

    return {
      permisos: data[0][0].permisos,
      horas_extras: data[1][0].horas_extras,
      permisos_tramitados: data[2][0].permisos_tr,
      horas_extras_tramitadas: data[3][0].horas_extras_tr,
      tareas: data[4][0].tareas,
      amonestaciones: data[5][0].amonestaciones,
      felicitaciones: data[6][0].felicitaciones,
    };
  }

  async employeeDashData(
    userId: number
  ): Promise<{
    permisos_aprobados: number;
    permisos_rechazados: number;
    horas_extras_aprobados: number;
    horas_extras_rechazados: number;
    permisos_solicitados: number;
    horas_extras_solicitados: number;
    tareas_asignadas: number;
    amonestaciones: number;
    felicitaciones: number;
  }> {
    const data = await Promise.all([
      DB.query(
        'SELECT COUNT(*) AS permisos_a FROM permisos WHERE activo = true AND id_estado = 2 AND MONTH(fecha_solicitud) = MONTH(CURDATE()) AND YEAR(fecha_solicitud) = YEAR(CURDATE()) AND id_empleado = ?;',
        [userId]
      ),
      DB.query(
        'SELECT COUNT(*) AS permisos_r FROM permisos WHERE activo = true AND id_estado = 3 AND MONTH(fecha_solicitud) = MONTH(CURDATE()) AND YEAR(fecha_solicitud) = YEAR(CURDATE()) AND id_empleado = ?;',
        [userId]
      ),
      DB.query(
        'SELECT COUNT(*) AS horas_extras_a FROM horas_extras WHERE activo = true AND id_estado = 2 AND MONTH(fecha) = MONTH(CURDATE()) AND YEAR(fecha) = YEAR(CURDATE()) AND id_empleado = ?;',
        [userId]
      ),
      DB.query(
        'SELECT COUNT(*) AS horas_extras_r FROM horas_extras WHERE activo = true AND id_estado = 3 AND MONTH(fecha) = MONTH(CURDATE()) AND YEAR(fecha) = YEAR(CURDATE()) AND id_empleado = ?;',
        [userId]
      ),
      DB.query(
        'SELECT COUNT(*) AS permisos_soli FROM permisos WHERE activo = true AND (id_estado = 2 OR id_estado = 3) AND MONTH(fecha_solicitud) = MONTH(CURDATE()) AND YEAR(fecha_solicitud) = YEAR(CURDATE()) AND id_empleado = ?;',
        [userId]
      ),
      DB.query(
        'SELECT COUNT(*) AS horas_extras_soli FROM horas_extras WHERE activo = true AND (id_estado = 2 OR id_estado = 3) AND MONTH(fecha) = MONTH(CURDATE()) AND YEAR(fecha) = YEAR(CURDATE()) AND id_empleado = ?;',
        [userId]
      ),
      DB.query(
        'SELECT COUNT(*) AS tareas FROM tareas WHERE activo = true AND MONTH(fecha_asignacion) = MONTH(CURDATE()) AND YEAR(fecha_asignacion) = YEAR(CURDATE()) AND id_empleado = ?;',
        [userId]
      ),
      DB.query(
        'SELECT COUNT(*) AS amonestaciones FROM amonestaciones WHERE activo = true AND MONTH(fecha) = MONTH(CURDATE()) AND YEAR(fecha) = YEAR(CURDATE()) AND id_empleado = ?;',
        [userId]
      ),
      DB.query(
        'SELECT COUNT(*) AS felicitaciones FROM felicitaciones WHERE activo = true AND MONTH(fecha) = MONTH(CURDATE()) AND YEAR(fecha) = YEAR(CURDATE()) AND id_empleado = ?;',
        [userId]
      ),
    ]);

    return {
      permisos_aprobados: data[0][0].permisos_a,
      permisos_rechazados: data[1][0].permisos_r,
      horas_extras_aprobados: data[2][0].horas_extras_a,
      horas_extras_rechazados: data[3][0].horas_extras_r,
      permisos_solicitados: data[4][0].permisos_soli,
      horas_extras_solicitados: data[5][0].horas_extras_soli,
      tareas_asignadas: data[6][0].tareas,
      amonestaciones: data[7][0].amonestaciones,
      felicitaciones: data[8][0].felicitaciones,
    };
  }
}
