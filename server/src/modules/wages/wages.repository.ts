import DB from '../../database/database';

export class WagesRepository {
  public async retrieveEmployeeSalary(
    userId: number
  ): Promise<{
    salario_hora: number;
    jornada: number;
  }> {
    const result = await DB.query(
      `SELECT s.salario_hora
          , s.jornada
      FROM empleados e
          INNER JOIN salarios s ON e.id = s.id_empleado
      WHERE e.id = ?;`,
      [userId]
    );

    return { ...result[0] };
  }

  public async retrieveEmployeeHandicaps(
    userId: number,
    year: number,
    month: number
  ): Promise<number> {
    const result = await DB.query(
      `SELECT SUM(cantidad) AS incapacidades_mes
      FROM incapacidades
      WHERE id_empleado = ?
      AND activo = true
      AND YEAR(fecha_salida) = ?
      AND MONTH(fecha_salida) = ?;`,
      [userId, year, month]
    );

    return result[0].incapacidades_mes;
  }

  public async retrieveEmployeeOvertime(
    userId: number,
    year: number,
    month: number
  ): Promise<number> {
    const result = await DB.query(
      `SELECT SUM(cantidad_horas) AS cantidad_horas
      FROM horas_extras
      WHERE activo = true
      AND id_empleado = ?
      AND YEAR(fecha) = ?
      AND MONTH(fecha) = ?
      AND id_estado = 2;`,
      [userId, year, month]
    );
    return result[0].cantidad_horas;
  }

  public async retrieveEmployeePermissions(
    userId: number,
    year: number,
    month: number
  ): Promise<number> {
    const result = await DB.query(
      `SELECT SUM(horas) AS aux
      FROM permisos
      WHERE activo = true
      AND id_empleado = ?
      AND year(fecha_salida) = ?
      AND month(fecha_salida) = ?
      AND id_estado = 2;`,
      [userId, year, month]
    );

    return result[0].aux;
  }

  public async retrieveEmployeeWithholding(userId: number): Promise<number> {
    const result = await DB.query(
      `SELECT (CASE WHEN (SUM(retencion) <> 0) THEN SUM(retencion) ELSE 0 END) as retencion
      FROM retenciones_salariales
      WHERE activo = true AND id_empleado = ?;`,
      [userId]
    );

    return result[0].retencion;
  }

  public async retrieveSalaryCalc({
    userId,
    year,
    month,
  }: {
    userId: number;
    year: number;
    month: number;
  }): Promise<{
    salario_bruto: number;
    impuesto_renta: number;
    salario_neto: number;
    salario: number;
    aguinaldo: number;
    porcentaje_cargas_sociales: number;
    total_deduccion: number;
    salario_especial_chofer?: number;
    total_deduccion_especial?: number;
  }> {
    let specialGrossWage: number;
    const userType = await DB.query(
      `SELECT tipo_empleado FROM empleados WHERE id = ?;`,
      [userId]
    );

    const grossWage = await DB.query(
      `SELECT salario_bruto(${userId}, ${month}, ${year}) AS salario_bruto;`,
      ''
    );

    const netSalary = await DB.query(
      `SELECT salario_neto(${userId}, ${month}, ${year}) AS salario_neto;`,
      ''
    );

    const incomeTax = await await DB.query(
      `SELECT impuesto_renta(${userId}, ${month}, ${year}) AS impuesto_renta;`,
      ''
    );

    const bonus = await await DB.query(
      `SELECT aguinaldo(${userId}, ${month}, ${year}) AS aguinaldo;`,
      ''
    );

    const wage = await await DB.query(
      `SELECT salario(${userId}, ${month}, ${year}) AS salario;`,
      ''
    );

    if (userType[0].tipo_empleado === 3) {
      const special = await DB.query(
        `SELECT salario_bruto_especial(${userId}, ${month}, ${year}) AS salario_especial;`,
        ''
      );
      specialGrossWage = special[0].salario_especial;

      const specialDeduction = specialGrossWage * 0.105;

      return {
        impuesto_renta: incomeTax[0].impuesto_renta,
        porcentaje_cargas_sociales: 10.5,
        salario_bruto: grossWage[0].salario_bruto,
        salario: netSalary[0].salario_neto,
        total_deduccion: netSalary[0].salario_neto * 0.105,
        salario_especial_chofer: specialGrossWage - specialDeduction,
        total_deduccion_especial: specialGrossWage * 0.105,
        salario_neto: wage[0].salario + (specialGrossWage - specialDeduction),
        aguinaldo: bonus[0].aguinaldo,
      };
    }

    return {
      impuesto_renta: incomeTax[0].impuesto_renta,
      porcentaje_cargas_sociales: 10.5,
      salario_bruto: grossWage[0].salario_bruto,
      salario: netSalary[0].salario_neto,
      total_deduccion: netSalary[0].salario_neto * 0.105,
      salario_neto: wage[0].salario,
      aguinaldo: bonus[0].aguinaldo,
    };
  }

  public async addIncrease(userId: number, amount: number) {
    await DB.query(
      `UPDATE salarios SET salario_hora = salario_hora + ${amount} WHERE id_empleado = ?`,
      [userId]
    );
    await DB.query(`INSERT INTO aumentos_salariales SET ?`, {
      id_empleado: userId,
      cantidad: amount,
    });
  }
}
