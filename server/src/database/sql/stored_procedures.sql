USE adisj;

-- Nuevo empleado temporal
DROP PROCEDURE IF EXISTS 'nuevo_empleado_temporal';

DELIMITER $$
USE 'adisj'$$
CREATE DEFINER='root'@'localhost' PROCEDURE 'nuevo_empleado_temporal' (
	IN _cedula VARCHAR(9),
  IN _nombre VARCHAR(50),
  IN _p_apellido VARCHAR(30),
  IN _s_apellido VARCHAR(30),
  IN _fecha_nacimiento DATE,
  IN _correo VARCHAR(200),
  IN _clave VARCHAR(200),
  IN _activo BOOLEAN,
  IN _tipo_empleado TINYINT,
  IN _codigo_provincia INT,
	IN _codigo_canton INT,
	IN _codigo_distrito INT,
	IN _direccion VARCHAR(300)
)
BEGIN
  DECLARE _fecha_contrato DATETIME;
  SELECT fecha_contrato INTO _fecha_contrato FROM empleados WHERE id = _


END$$
DELIMITER ;
