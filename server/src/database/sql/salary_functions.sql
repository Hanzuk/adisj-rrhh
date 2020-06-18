/* -------------------------------------------------------------------------- */
/*                            Funcion Salario Bruto                           */
/* -------------------------------------------------------------------------- */
DROP FUNCTION IF EXISTS `salario_bruto`;

DELIMITER $$
USE `adisj`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `salario_bruto`(
  _id INT,
  _mes INT,
  _anio INT
) RETURNS DECIMAL(10, 2)
  READS SQL DATA
  DETERMINISTIC
BEGIN
  DECLARE salarioHora DECIMAL(10, 2) DEFAULT 0;
  DECLARE horasJornada INT DEFAULT 0;
  DECLARE diasIncapacitado INT DEFAULT 0;
  DECLARE tempDiasContratado INT DEFAULT 0;
	DECLARE total DECIMAL(10, 2) DEFAULT 0;

  SET diasIncapacitado = (
    SELECT (CASE WHEN (SUM(cantidad) <> 0) THEN SUM(cantidad) ELSE 0 END)
    FROM incapacidades
      WHERE activo = true  AND id_empleado = _id AND YEAR(fecha_salida) = _anio AND MONTH(fecha_salida) = _mes
  );

  SET salarioHora = (SELECT salario_hora FROM salarios	WHERE activo = true	AND id_empleado = _id);
  SET horasJornada = (SELECT jornada FROM salarios	WHERE activo = true	AND id_empleado = _id);

  IF (SELECT tipo_empleado FROM empleados WHERE id = _id) <> 4 THEN
    SET total = (salarioHora * horasJornada * (30 - diasIncapacitado)); --CCSS
	ELSE
    SET tempDiasContratado = (SELECT SUM(dias) FROM contratos_empleados_temporales WHERE id_empleado = _id AND activo = true);

    SET total = (salarioHora * horasJornada * (tempDiasContratado - diasIncapacitado)); --CCSS
  END IF;

  RETURN total;
END$$
DELIMITER ;

/* -------------------------------------------------------------------------- */
/*               Funcion Salario Bruto Chofer Servicio Especial               */
/* -------------------------------------------------------------------------- */

DROP FUNCTION IF EXISTS `salario_bruto_especial`;

DELIMITER $$
USE `adisj`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `salario_bruto_especial`(
  _id INT,
  _mes INT,
  _anio INT
) RETURNS DECIMAL(10, 2)
  READS SQL DATA
  DETERMINISTIC
BEGIN
  -- DECLARE salarioHoraEspecial DECIMAL(10, 2) DEFAULT 0;
  -- DECLARE horasJornadaEspecial INT DEFAULT 0;
	DECLARE total DECIMAL(10, 2) DEFAULT 0;

  -- SET salarioHoraEspecial = (
  --   SELECT (CASE ac.salario_hora WHEN (ac.salario_hora <> 0) THEN ac.salario_hora ELSE 0 END)
  --   FROM asignaciones_choferes ac
  --   INNER JOIN tareas t ON t.id = ac.id_tarea
  --   WHERE t.id_empleado = _id
  -- );
  -- SET horasJornadaEspecial = (
  --   SELECT SELECT (CASE ac.horas_servicio WHEN (ac.horas_servicio <> 0) THEN ac.horas_servicio ELSE 0 END)
  --   FROM asignaciones_choferes ac
  --   INNER JOIN tareas t ON t.id = ac.id_tarea
  --   WHERE t.id_empleado = _id
  -- );

  SET total = (SELECT (CASE WHEN (sum((ac.salario_hora * ac.horas_servicio)) > 0) THEN sum((ac.salario_hora * ac.horas_servicio))
        ELSE 0 END) as salario_bruto
    FROM asignaciones_choferes ac
    INNER JOIN tareas t ON t.id = ac.id_tarea
    WHERE YEAR(t.fecha_asignacion) = _anio AND MONTH(t.fecha_asignacion) = _mes AND t.id_empleado = _id AND ac.tipo_servicio = 'Especial');

  RETURN total;
END$$
DELIMITER ;

/* -------------------------------------------------------------------------- */
/*                            Funcion Impuesto Renta                           */
/* -------------------------------------------------------------------------- */
DROP FUNCTION IF EXISTS `impuesto_renta`;

DELIMITER $$
USE `adisj`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `impuesto_renta`(
	_id INT,
  _mes INT,
  _anio INT
) RETURNS DECIMAL(10, 2)
  READS SQL DATA
  DETERMINISTIC
BEGIN
  DECLARE rentaTemp INT DEFAULT 0;
  DECLARE salarioBruto DECIMAL(10, 2) DEFAULT 0;
  DECLARE total DECIMAL(10, 2) DEFAULT 0;

	SET salarioBruto = (SELECT salario_bruto(_id, _mes, _anio));

  IF salarioBruto >= 840000 AND salarioBruto <= 1233000 THEN
    SET rentaTemp = 1233000 - 840000;
    SET total = (rentaTemp * 10) / 100;
  END IF;

  IF salarioBruto > 1233000 AND salarioBruto <= 1163000 THEN
    SET rentaTemp = 1163000 - 1233000;
    SET total = (rentaTemp * 15) / 100;
  END IF;

  IF salarioBruto > 1163000 AND salarioBruto <= 4325000 THEN
    SET rentaTemp = 4325000 - 1163000;
    SET total = (rentaTemp * 20) / 100;
  END IF;

  IF salarioBruto > 4325000 THEN
    SET rentaTemp = 4325000 - 5000000;
    SET total = (rentaTemp * 25) / 100;
  END IF;

  RETURN total;
END$$
DELIMITER ;

/* -------------------------------------------------------------------------- */
/*                            Funcion Salario Neto                            */
/* -------------------------------------------------------------------------- */
USE `adisj`;
DROP FUNCTION IF EXISTS `salario_neto`;

DELIMITER $$
USE `adisj`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `salario_neto`(
	_id INT,
  _mes INT,
  _anio INT
) RETURNS DECIMAL(10, 2)
  READS SQL DATA
  DETERMINISTIC
BEGIN
	DECLARE horasExtra INT DEFAULT 0;
	DECLARE totalPermisos INT DEFAULT 0;
  DECLARE salarioHora DECIMAL(10, 2) DEFAULT 0;
  DECLARE horasJornada INT DEFAULT 0;
	DECLARE totalBonos INT DEFAULT 0;
  DECLARE vacacionesUsadas INT DEFAULT 0;
  DECLARE retenciones DECIMAL(10, 2) DEFAULT 0;
	DECLARE salarioBruto DECIMAL(10, 2) DEFAULT 0;
  DECLARE impuestoRenta DECIMAL(10, 2) DEFAULT 0;
	DECLARE total DECIMAL(10, 2) DEFAULT 0;

	SET salarioBruto = (SELECT salario_bruto(_id, _mes, _anio));
	SET impuestoRenta = (SELECT impuesto_renta(_id, _mes, _anio));

	IF(SELECT tipo_empleado FROM empleados WHERE id = _id) <> 4 THEN
    SET totalPermisos = (
      SELECT (CASE WHEN (SUM(horas) <> 0) THEN SUM(horas) ELSE 0 END)
      FROM permisos
        WHERE activo = true AND id_empleado = _id AND YEAR(fecha_salida) = _anio AND MONTH(fecha_salida) = _mes
    );

    SET horasExtra = (
      SELECT (CASE WHEN (SUM(cantidad_horas) <> 0) THEN SUM(cantidad_horas) ELSE 0 END)
      FROM horas_extras
        WHERE activo = true AND id_estado = 2 AND id_empleado = _id AND YEAR(fecha) = _anio AND MONTH(fecha) = _mes
    );

    SET retenciones = (
      SELECT (CASE WHEN (SUM(retencion) <> 0) THEN SUM(retencion) ELSE 0 END)
      FROM retenciones_salariales
        WHERE activo = true AND id_empleado = _id
    );

    SET vacacionesUsadas = (
      SELECT (CASE WHEN (SUM(cantidad) <> 0) THEN SUM(cantidad) ELSE 0 END)
      FROM vacaciones
        WHERE activo = true AND id_empleado = _id AND YEAR(fecha_salida) = _anio AND MONTH(fecha_salida) = _mes
    );

    SET salarioHora = (SELECT salario_hora FROM salarios WHERE activo = true AND id_empleado = _id);
    SET horasJornada = (SELECT jornada FROM salarios WHERE activo = true AND id_empleado = _id);

	  SET total = ((salarioBruto - retenciones) + (vacacionesUsadas * salarioHora * horasJornada * -1) + (vacacionesUsadas * salarioHora * horasJornada) + (salarioHora * totalPermisos * -1) + (horasExtra * salarioHora * 1.5) + (totalBonos) + ((((salarioHora * horasJornada) ) ) ));

  ELSE
    SET total = salarioBruto;
  END IF;

  RETURN total - impuestoRenta;
END$$
DELIMITER ;

/* -------------------------------------------------------------------------- */
/*                         Funcion Salario Neto Chofer                        */
/* -------------------------------------------------------------------------- */
USE `adisj`;
DROP FUNCTION IF EXISTS `salario_neto_chofer`;

DELIMITER $$
USE `adisj`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `salario_neto_chofer`(
	_id INT,
  _mes INT,
  _anio INT
) RETURNS DECIMAL(10, 2)
  READS SQL DATA
  DETERMINISTIC
BEGIN
	DECLARE horasExtra INT DEFAULT 0;
	DECLARE totalPermisos INT DEFAULT 0;
  DECLARE salarioHora DECIMAL(10, 2) DEFAULT 0;
  DECLARE horasJornada INT DEFAULT 0;
	DECLARE totalBonos INT DEFAULT 0;
  DECLARE vacacionesUsadas INT DEFAULT 0;
  DECLARE retenciones DECIMAL(10, 2) DEFAULT 0;
	DECLARE salarioBruto DECIMAL(10, 2) DEFAULT 0;
  DECLARE impuestoRenta DECIMAL(10, 2) DEFAULT 0;
	DECLARE total DECIMAL(10, 2) DEFAULT 0;

	SET salarioBruto = (SELECT salario_bruto(_id, _mes, _anio));
	SET impuestoRenta = (SELECT impuesto_renta(_id, _mes, _anio));

	IF(SELECT tipo_empleado FROM empleados WHERE id = _id) <> 4 THEN
    SET totalPermisos = (
      SELECT (CASE WHEN (SUM(horas) <> 0) THEN SUM(horas) ELSE 0 END)
      FROM permisos
        WHERE activo = true AND id_empleado = _id AND YEAR(fecha_salida) = _anio AND MONTH(fecha_salida) = _mes
    );

    SET retenciones = (
      SELECT (CASE WHEN (SUM(retencion) <> 0) THEN SUM(retencion) ELSE 0 END)
      FROM retenciones_salariales
        WHERE activo = true AND id_empleado = _id
    );

    SET vacacionesUsadas = (
      SELECT (CASE WHEN (SUM(cantidad) <> 0) THEN SUM(cantidad) ELSE 0 END)
      FROM vacaciones
        WHERE activo = true AND id_empleado = _id AND YEAR(fecha_salida) = _anio AND MONTH(fecha_salida) = _mes
    );

    SET salarioHora = (SELECT salario_hora FROM salarios WHERE activo = true AND id_empleado = _id);
    SET horasJornada = (SELECT jornada FROM salarios WHERE activo = true AND id_empleado = _id);

	  SET total = ((salarioBruto - retenciones) + (vacacionesUsadas * salarioHora * horasJornada * -1) + (vacacionesUsadas * salarioHora * horasJornada) + (salarioHora * totalPermisos * -1) + (horasExtra * salarioHora * 1.5) + (totalBonos) + ((((salarioHora * horasJornada) * 5) * 50) / 100));

  ELSE
    SET total = salarioBruto;
  END IF;

  RETURN total - impuestoRenta;
END$$
DELIMITER ;

/* -------------------------------------------------------------------------- */
/*                          Funcion Cargas Sociales                          */
/* -------------------------------------------------------------------------- */
USE `adisj`;
DROP FUNCTION IF EXISTS `salario`;

DELIMITER $$
USE `adisj`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `salario`(
	_id INT,
  _mes INT,
  _anio INT
) RETURNS DECIMAL(10, 2)
  READS SQL DATA
  DETERMINISTIC
BEGIN
  DECLARE ccss_obrero INT DEFAULT 0;
	DECLARE salarioHora DECIMAL(10, 2) DEFAULT 0;
  DECLARE horasJornada INT DEFAULT 0;
  DECLARE salarioNeto DECIMAL(10, 2) DEFAULT 0;
  DECLARE salarioDia DECIMAL(10, 2) ;
	DECLARE total DECIMAL(10, 2) DEFAULT 0;

  SET salarioHora = (SELECT salario_hora FROM salarios WHERE activo = true AND id_empleado = _id);
  SET horasJornada = (SELECT jornada FROM salarios WHERE activo = true AND id_empleado = _id);

	SET salarioDia = (salarioHora * horasJornada);
  SET salarioNeto = (SELECT salario_neto(_id, _mes, _anio));
  SET ccss_obrero = (((salarioNeto * 10.5) / 100) * -1);
  SET total =  (salarioNeto + ccss_obrero);

  RETURN total;
END $$
DELIMITER ;

/* -------------------------------------------------------------------------- */
/*                              Funcion Aguinaldo                             */
/* -------------------------------------------------------------------------- */
DROP FUNCTION IF EXISTS `aguinaldo`;

DELIMITER $$
USE `adisj`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `aguinaldo`(
	_id INT,
  _mes INT,
  _anio INT
) RETURNS DECIMAL(10, 2)
  READS SQL DATA
  DETERMINISTIC
BEGIN
	DECLARE totalMes INT DEFAULT 12;
  DECLARE totalTemporal INT DEFAULT 0;
  DECLARE totalAnio INT DEFAULT 0;
  DECLARE totalSalarioHora INT DEFAULT 0;
  DECLARE totalHorasJornada INT DEFAULT 0;
  DECLARE totalBonos INT DEFAULT 0;
  DECLARE totalHorasExtra INT DEFAULT 0;
  DECLARE totalRetenciones INT DEFAULT 0;
  DECLARE auxBonos INT DEFAULT 0;
  DECLARE auxHorasExtra INT DEFAULT 0;
  DECLARE hora INT DEFAULT 0;
	DECLARE total INT DEFAULT 0;
  DECLARE salarioAnual INT DEFAULT 0;
  DECLARE resultado INT DEFAULT 0;
  DECLARE anioContratacion INT;
  DECLARE mesContratacion INT;
  DECLARE mesCount INT;
  DECLARE bruto INT DEFAULT 0;

  SET bruto = (SELECT salario_bruto(_id, _mes, _anio));

  IF(SELECT tipo_empleado FROM empleados WHERE id = _id) <> 4 THEN
    SET totalAnio = _anio - 1;

    IF (SELECT SUM(salario_hora) FROM salarios WHERE activo = true AND id_empleado = _id) <> 0 THEN
		  SET totalSalarioHora = (SELECT salario_hora FROM salarios WHERE activo = true	AND id_empleado = _id);
		  SET totalHorasJornada = (SELECT jornada FROM salarios WHERE activo = true	AND id_empleado = _id);
      SET hora = (SELECT salario_hora FROM salarios WHERE activo = true	AND id_empleado = _id);
    END IF;

    SET anioContratacion =  (SELECT YEAR(fecha_contrato) FROM empleados WHERE id = _id);

    IF anioContratacion <> YEAR(NOW()) THEN
	    IF (SELECT SUM(cantidad_horas) FROM horas_extras WHERE activo = true AND id_empleado = _id AND id_estado = 2 AND YEAR(fecha) = totalAnio AND MONTH(fecha) = totalMes) <> 0 THEN
			  SET totalHorasExtra = (SELECT SUM(cantidad_horas) FROM horas_extra WHERE activo = true AND id_estado = 2 AND id_empleado = _id  AND YEAR(fecha) = totalAnio AND MONTH(fecha) = totalMes);
	    END IF;

      IF (SELECT SUM(retencion) FROM retenciones_salariales WHERE activo = true AND id_empleado = _id AND YEAR(fecha) = _anio AND MONTH(fecha) = _mes) <> 0 THEN
			  SET totalRetenciones = (SELECT SUM(retencion) FROM retenciones_salariales WHERE activo = true AND id_empleado = _id AND YEAR(fecha) = _anio AND MONTH(fecha) = _mes);
	    END IF;

      SET totalAnio = totalAnio + 1 ;
      SET totalMes = 1;
      SET auxBonos = totalBonos;
      SET auxHorasExtra = totalHorasExtra;
      SET totalBonos = 0;
      SET totalHorasExtra = 0;

      WHILE totalMes < 11 do
        IF (SELECT SUM(cantidad_horas) FROM horas_extras WHERE activo = true AND id_empleado = _id AND id_estado = 2 AND YEAR(fecha) = totalAnio AND MONTH(fecha) = totalMes) <> 0 THEN
            SET totalHorasExtra = (SELECT SUM(cantidad_horas) FROM horas_extras WHERE activo = true AND id_estado = 2 AND id_empleado = _id AND YEAR(fecha) = totalAnio AND MONTH(fecha) = totalMes);
        END IF;

        SET auxBonos = auxBonos + totalBonos;
        SET auxHorasExtra = auxHorasExtra + totalHorasExtra;
        SET totalBonos = 0;
        SET totalHorasExtra = 0;
        SET totalMes = totalMes + 1;
      END WHILE;

      SET salarioAnual =  (((totalSalarioHora * totalHorasJornada) * 30) * 12);
      SET total = salarioAnual + auxBonos + (hora * auxHorasExtra * 1.5);
      SET resultado = total / 12;
    ELSE
      SET mesContratacion =  (SELECT MONTH(fecha_contrato) FROM empleados WHERE id = _id);
      SET mesCount = ((mesContratacion - 11) * -1 );
      SET totalMes = mesContratacion;

      IF (SELECT SUM(retencion) FROM retenciones_salariales WHERE activo = true AND id_empleado = _id AND YEAR(fecha) = _anio AND MONTH(fecha) = _mes) <> 0 THEN
        SET totalRetenciones = (SELECT SUM(retencion) FROM retenciones_salariales WHERE activo = true AND id_empleado = _id AND YEAR(fecha) = _anio AND MONTH(fecha) = _mes);
      END IF;

      WHILE totalMes < 11 do
        IF (SELECT SUM(cantidad_horas) FROM horas_extras WHERE activo = true AND id_empleado = _id AND id_estado = 2 AND YEAR(fecha) = anioContratacion AND MONTH(fecha) = totalMes) <> 0 THEN
          SET totalHorasExtra = (SELECT SUM(cantidad_horas) FROM horas_extras WHERE activo = true AND id_estado = 2 AND id_empleado = _id AND YEAR(fecha) = anioContratacion AND MONTH(fecha) = totalMes);
        END IF;

        SET auxBonos = auxBonos + totalBonos;
        SET auxHorasExtra = auxHorasExtra + totalHorasExtra;
        SET totalBonos = 0;
        SET totalHorasExtra = 0;
        SET totalMes = totalMes + 1;
      END WHILE;

      SET salarioAnual =  (((totalSalarioHora * totalHorasJornada) * 30) * mesContratacion);
	    SET total = (salarioAnual + auxBonos + (hora * auxHorasExtra * 1.5) - 2 * totalRetenciones);
      SET resultado = total / mesContratacion;

    END IF;
  ELSE
    -- IF(SELECT SUM(dias) FROM contratos_empleados_temporales WHERE activo = true AND id_empleado =_id) <> 0 THEN
    --   SET totalTemporal = (SELECT SUM(dias) FROM contratos_empleados_temporales WHERE id_empleado = _id AND activo = true AND YEAR(fecha_contrato) = _anio AND MONTH(fecha_contrato) = _mes);
    -- END IF;

    -- SET resultado = (bruto * totalTemporal) / 12;
    SET resultado = 0;
  END IF;

  RETURN resultado;
END$$
DELIMITER ;
