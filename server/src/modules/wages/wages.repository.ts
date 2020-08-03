import DB from '../../database/database';

export class WagesRepository {
  public async retrieveEmployeeInfo(userId: number, year: number, month: number) {
    const info = await Promise.all([
      DB.query(
        'SELECT s.salario_hora, s.jornada FROM empleados e INNER JOIN salarios s ON e.id = s.id_empleado WHERE e.id = ?;',
        [userId]
      ),
      DB.query(
        `SELECT SUM(cantidad) AS incapacidades_mes FROM incapacidades WHERE id_empleado = ? AND activo = true
        AND YEAR(fecha_salida) = ? AND MONTH(fecha_salida) = ?;`,
        [userId, year, month]
      ),
      DB.query(
        `SELECT SUM(cantidad_horas) AS cantidad_horas
        FROM horas_extras WHERE activo = true AND id_empleado = ?
        AND YEAR(fecha) = ? AND MONTH(fecha) = ? AND id_estado = 2;`,
        [userId, year, month]
      ),
      DB.query(
        `SELECT SUM(horas) AS aux FROM permisos WHERE activo = true
        AND id_empleado = ? AND year(fecha_salida) = ? AND month(fecha_salida) = ? AND id_estado = 2;`,
        [userId, year, month]
      ),
      DB.query(
        `SELECT (CASE WHEN (SUM(retencion) <> 0) THEN SUM(retencion) ELSE 0 END) as retencion
        FROM retenciones_salariales
        WHERE activo = true AND id_empleado = ?;`,
        [userId]
      ),
      DB.query(
        `SELECT CONCAT(nombre, ' ', p_apellido) as empleado
        FROM empleados
        WHERE id = ?;`,
        [userId]
      ),
    ]);

    return {
      ...info[0][0],
      ...info[1].incapacidades_mes,
      ...info[2].cantidad_horas,
      ...info[3].aux,
      ...info[4].retencion,
      ...info[5][0],
    };
  }

  public async retrieveSalaryCalc(
    userId: number,
    year: number,
    month: number
  ): Promise<{
    salario_bruto: number;
    impuesto_renta: number;
    salario_neto: number;
    aguinaldo: number;
    total_deduccion: number;
    salario_especial_chofer?: number;
    total_deduccion_especial?: number;
    horas_permisos: number;
    horas_extras: number;
    retenciones: number;
  }> {
    let specialGrossWage: number;

    const info = await Promise.all([
      DB.query(`SELECT tipo_empleado FROM empleados WHERE id = ?;`, [userId]),
      DB.query(`SELECT salario_bruto(${userId}, ${month}, ${year}) AS salario_bruto;`, ''),
      DB.query(`SELECT impuesto_renta(${userId}, ${month}, ${year}) AS impuesto_renta;`, ''),
      DB.query(`SELECT salario_neto(${userId}, ${month}, ${year}) AS salario_neto;`, ''),
      DB.query(`SELECT aguinaldo(${userId}, ${month}, ${year}) AS aguinaldo;`, ''),
      DB.query(
        `SELECT (CASE WHEN (SUM(horas) <> 0) THEN SUM(horas) ELSE 0 END) as horas_permisos FROM permisos WHERE MONTH(fecha_solicitud) = ${month} AND YEAR(fecha_solicitud) = ${year} AND id_estado = 2 AND id_empleado = ${userId};`,
        ''
      ),
      DB.query(
        `SELECT (CASE WHEN (SUM(cantidad_horas) <> 0) THEN SUM(cantidad_horas) ELSE 0 END) as horas_extras FROM horas_extras WHERE MONTH(fecha) = ${month} AND YEAR(fecha) = ${year} AND id_estado = 2 AND id_empleado = ${userId};`,
        ''
      ),
      DB.query(
        `SELECT (CASE WHEN (SUM(retencion) <> 0) THEN SUM(retencion) ELSE 0 END) as retenciones FROM retenciones_salariales WHERE id_empleado = ${userId} AND activo = 1;`,
        ''
      ),
    ]);

    // Al salario bruto ya se la aplico la renta

    if (info[0][0].tipo_empleado === 3) {
      const special = await DB.query(
        `SELECT salario_base_especial(${userId}, ${month}, ${year}) AS salario_especial;`,
        ''
      );
      specialGrossWage = special[0].salario_especial;

      const specialDeduction = specialGrossWage * 0.105;

      return {
        salario_bruto: info[1][0].salario_bruto,
        impuesto_renta: info[2][0].impuesto_renta,
        total_deduccion: info[1][0].salario_bruto * 0.105,
        salario_especial_chofer: specialGrossWage - specialDeduction,
        total_deduccion_especial: specialGrossWage * 0.105,
        salario_neto: info[3][0].salario_neto + (specialGrossWage - specialDeduction) - info[2][0].impuesto_renta,
        aguinaldo: info[4][0].aguinaldo,
        horas_permisos: info[5][0].horas_permisos,
        horas_extras: info[6][0].horas_extras,
        retenciones: info[7][0].retenciones,
      };
    }

    return {
      salario_bruto: info[1][0].salario_bruto,
      impuesto_renta: info[2][0].impuesto_renta,
      total_deduccion: info[1][0].salario_bruto * 0.105,
      salario_neto: info[3][0].salario_neto - info[2][0].impuesto_renta,
      aguinaldo: info[4][0].aguinaldo,
      horas_permisos: info[5][0].horas_permisos,
      horas_extras: info[6][0].horas_extras,
      retenciones: info[7][0].retenciones,
    };
  }

  public async addIncrease(userId: number, amount: number) {
    await DB.query(`UPDATE salarios SET salario_hora = salario_hora + ${amount} WHERE id_empleado = ?`, [userId]);
    await DB.query(`INSERT INTO aumentos_salariales SET ?`, {
      id_empleado: userId,
      cantidad: amount,
    });
  }

  public getIncreases() {
    return DB.query(
      `SELECT e.nombre, e.p_apellido, aus.id, aus.cantidad, aus.fecha FROM aumentos_salariales aus INNER JOIN empleados e ON e.id = aus.id_empleado WHERE aus.activo = 1;`,
      ''
    );
  }

  public addRetention(data: { id_empleado: number; retencion: number; descripcion: string }) {
    return DB.query(`INSERT INTO retenciones_salariales SET ?`, data);
  }

  public getRetentions() {
    return DB.query(
      `SELECT e.nombre, e.p_apellido, rs.id, rs.retencion, rs.descripcion, rs.fecha FROM retenciones_salariales rs INNER JOIN empleados e ON e.id = rs.id_empleado`,
      ''
    );
  }

  public deleteRetention(id: number) {
    return DB.query(`DELETE FROM retenciones_salariales WHERE id = ?`, [id]);
  }

  public getHandicaps() {
    return DB.query(
      `SELECT e.nombre, e.p_apellido, i.id, i.fecha_salida, i.fecha_entrada, i.motivo FROM incapacidades i INNER JOIN empleados e ON e.id = i.id_empleado WHERE i.activo = 1;`,
      ''
    );
  }

  public addHandicap(data: {
    id_empleado: number;
    fecha_salida: Date;
    fecha_entrada: Date;
    motivo: string;
    cantidad: number;
  }) {
    return DB.query(`INSERT INTO incapacidades SET ?;`, data);
  }
}
