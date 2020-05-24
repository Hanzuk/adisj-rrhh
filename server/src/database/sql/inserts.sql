USE adisj;

-- Nuevo administrador
INSERT INTO empleados (cedula, nombre, p_apellido, s_apellido, fecha_nacimiento, correo, clave, activo, tipo_empleado) VALUES('123456789', 'Roberto', 'Duarte', 'Vindas', '1998-12-27', 'rober98@gmail.com', 'patito123', true, 1);
INSERT INTO telefonos (id_empleado, numero, activo, tipo_telefono) VALUES(1, '88453584', true, 1);
INSERT INTO direcciones (id_empleado, codigo_provincia, codigo_canton, codigo_distrito, direccion) VALUES(1, 1, 104, 10403, '100 mts norte de la escuela, segunda casa a mano derecha');
INSERT INTO salarios (id_empleado, salario_hora, jornada) VALUES(1, '2378.69', 8);

-- Nuevo empleado permanente
INSERT INTO empleados (cedula, nombre, p_apellido, s_apellido, fecha_nacimiento, correo, clave, activo, tipo_empleado) VALUES('987654321', 'Carlos', 'Fuentes', 'Amador', '1974-07-10', 'carlos74@gmail.com', 'patito123', true, 3);
INSERT INTO telefonos (id_empleado, numero, activo, tipo_telefono) VALUES(2, '75874536', true, 1);
INSERT INTO direcciones (id_empleado, codigo_provincia, codigo_canton, codigo_distrito, direccion) VALUES(2, 1, 104, 10403, '100 mts sur del abastecedor, casa color blanco');
INSERT INTO salarios (id_empleado, salario_hora, jornada) VALUES(2, '1691.30', 8);

-- Nuevo empleado temporal
INSERT INTO empleados (cedula, nombre, p_apellido, s_apellido, fecha_nacimiento, correo, clave, activo, tipo_empleado) VALUES('789456123', 'Miguel', 'Brenes', 'Delgado', '1984-08-19', 'miguel84@gmail.com', 'patito123', true, 4);
INSERT INTO telefonos (id_empleado, numero, activo, tipo_telefono) VALUES(3, '75452598', true, 1);
INSERT INTO direcciones (id_empleado, codigo_provincia, codigo_canton, codigo_distrito, direccion) VALUES(3, 1, 104, 10403, '100 mts sur de la iglesia, casa verde frente a la plaza');
INSERT INTO salarios (id_empleado, salario_hora, jornada) VALUES(3, '1425.10', 8);
INSERT INTO empleados_temporales (id_empleado, fecha_salida, descripcion) VALUES(3, '2020-05-27', 'Contratado para instalacion de luces');
INSERT INTO contratos_empleados_temporales (id_empleado, fecha_contrato, fecha_salida, descripcion) VALUES(3, (SELECT fecha_contrato FROM empleados WHERE id = 3), (SELECT fecha_salida FROM empleados_temporales WHERE id_empleado = 3), (SELECT descripcion FROM empleados_temporales WHERE id_empleado = 3));

-- Nuevo permiso
INSERT INTO permisos (id_empleado, id_estado, titulo, descripcion, fecha_salida, horas) VALUES(2, 1, 'Cita', 'Tengo una cita con el dentista', '2020-05-29', 3);
-- Permiso aprobado
UPDATE permisos SET id_estado = 2 WHERE id = 1;
-- Permiso borrado por empleado normal (el admin aun puede verlo)
UPDATE permisos SET borrar = true WHERE id = 1;
