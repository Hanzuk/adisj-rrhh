CREATE DATABASE adisj;

USE adisj;

CREATE TABLE tipo_empleados (
  id TINYINT AUTO_INCREMENT NOT NULL,
  cargo VARCHAR(50) NOT NULL,
  activo BOOLEAN DEFAULT true NOT NULL,
  CONSTRAINT pk_tipo_empleados PRIMARY KEY(id)
);

CREATE TABLE empleados (
  id INT NOT NULL AUTO_INCREMENT,
  cedula VARCHAR(9) UNIQUE NOT NULL,
  nombre VARCHAR(50) NOT NULL,
  p_apellido VARCHAR(30) NOT NULL,
  s_apellido VARCHAR(30) NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  fecha_contrato DATETIME DEFAULT NOW() NOT NULL,
  correo VARCHAR(200) UNIQUE NOT NULL,
  clave VARCHAR(200) NOT NULL,
  activo BOOLEAN NOT NULL,
  -- aprobado BOOLEAN DEFAULT false NOT NULL,
  tipo_empleado TINYINT NOT NULL,
  CONSTRAINT pk_empleados PRIMARY KEY(id),
  CONSTRAINT fk_empleados_tipo_empleado FOREIGN KEY(tipo_empleado) REFERENCES tipo_empleados(id)
);

CREATE TABLE empleados_temporales (
  id INT AUTO_INCREMENT,
  id_empleado INT NOT NULL,
  fecha_salida DATETIME NOT NULL,
  descripcion VARCHAR(300) NOT NULL,
  CONSTRAINT pk_empleados_temporales PRIMARY KEY(id),
  CONSTRAINT fk_empleados_temporales_id_empleado FOREIGN KEY(id_empleado) REFERENCES empleados(id)
);

-- Registro para las veces que se ha contratado cierto empleado temporal
CREATE TABLE contratos_empleados_temporales (
  id INT AUTO_INCREMENT,
  id_empleado INT NOT NULL,
  fecha_contrato DATETIME NOT NULL,
  fecha_salida DATETIME NOT NULL,
  descripcion VARCHAR(300) NOT NULL,
  CONSTRAINT pk_contratos_empleados_temporales PRIMARY KEY(id),
  CONSTRAINT fk_contratos_empleados_temporales_id_empleado FOREIGN KEY(id_empleado) REFERENCES empleados(id)
);

CREATE TABLE tipo_telefonos (
  id TINYINT AUTO_INCREMENT,
  nombre VARCHAR(50) NOT NULL,
  CONSTRAINT pk_tipo_telefonos PRIMARY KEY(id)
);

CREATE TABLE telefonos (
  id INT NOT NULL AUTO_INCREMENT,
  id_empleado INT NOT NULL,
  numero VARCHAR(8) NOT NULL,
  activo BOOLEAN DEFAULT false NOT NULL,
  tipo_telefono TINYINT DEFAULT 1 NOT NULL,
  CONSTRAINT pk_telefonos PRIMARY KEY(id),
  CONSTRAINT fk_telefonos_id_empleado FOREIGN KEY(id_empleado) REFERENCES empleados(id),
  CONSTRAINT fk_telefonos_tipo_telefono FOREIGN KEY(tipo_telefono) REFERENCES tipo_telefonos(id)
);

CREATE TABLE estados (
  id TINYINT AUTO_INCREMENT NOT NULL,
  estado VARCHAR(20) NOT NULL,
  activo BOOLEAN DEFAULT true NOT NULL,
  CONSTRAINT pk_estados PRIMARY KEY(id)
);

CREATE TABLE permisos (
  id INT NOT NULL AUTO_INCREMENT,
  id_empleado INT NOT NULL,
  id_estado TINYINT DEFAULT 1 NOT NULL,
  titulo VARCHAR(100) NOT NULL,
  descripcion VARCHAR(100) NOT NULL,
  fecha_solicitud DATETIME DEFAULT NOW() NOT NULL,
  fecha_salida DATETIME NOT NULL,
  horas TINYINT NOT NULL,
  activo BOOLEAN DEFAULT true NOT NULL,
  solo_admin BOOLEAN DEFAULT false NOT NULL, -- Permite al empleado no ver mas sus permisos solicitados
  CONSTRAINT pk_permisos PRIMARY KEY(id),
  CONSTRAINT fk_permisos_id_empleado FOREIGN KEY(id_empleado) REFERENCES empleados(id),
  CONSTRAINT fk_permisos_id_estado FOREIGN KEY(id_estado) REFERENCES estados(id)
);

CREATE TABLE horas_extras (
  id INT AUTO_INCREMENT,
  id_empleado INT NOT NULL,
  id_estado TINYINT DEFAULT 1 NOT NULL,
  cantidad_horas TINYINT DEFAULT 0 NOT NULL,
  descripcion VARCHAR(300) NOT NULL,
  fecha DATETIME DEFAULT NOW() NOT NULL,
  activo BOOLEAN DEFAULT true NOT NULL,
  CONSTRAINT pk_horas_extras PRIMARY KEY(id),
  CONSTRAINT fk_horas_extras_id_empleado FOREIGN KEY(id_empleado) REFERENCES empleados(id),
  CONSTRAINT fk_horas_extras_id_estado FOREIGN KEY(id_estado) REFERENCES estados(id),
  CONSTRAINT ch_horas_extras CHECK(cantidad_horas > 0)
);

CREATE TABLE despidos (
  id INT auto_increment NOT NULL,
	id_empleado INT NOT NULL,
  descripcion VARCHAR(300) NOT NULL,
  fecha_despido DATETIME default NOW() NOT NULL,
  activo BOOLEAN default true NOT NULL,
  CONSTRAINT pk_despidos PRIMARY KEY(id),
  CONSTRAINT fk_despidos_id_empleados FOREIGN KEY(id_empleado) REFERENCES empleados(id)
);

CREATE TABLE provincias (
  codigo SMALLINT(5) NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(45) NOT NULL,
  CONSTRAINT pk_provincias PRIMARY KEY(codigo)
);

CREATE TABLE cantones (
  codigo SMALLINT(5) NOT NULL,
  nombre VARCHAR(45) NOT NULL,
  codigo_provincia SMALLINT(5) NOT NULL,
  CONSTRAINT pk_cantones PRIMARY KEY(codigo),
  CONSTRAINT fk_cantones_codigo_provincia FOREIGN KEY(codigo_provincia) REFERENCES provincias(codigo)
);

CREATE TABLE distritos (
  codigo INT(10) NOT NULL,
  nombre VARCHAR(45) NOT NULL,
  codigo_canton SMALLINT(5) NOT NULL,
  CONSTRAINT pk_distritos PRIMARY KEY(codigo),
  CONSTRAINT fk_distritos_codigo_canton FOREIGN KEY(codigo_canton) REFERENCES cantones(codigo)
);

CREATE TABLE direcciones (
  id INT AUTO_INCREMENT,
  id_empleado INT NOT NULL,
  codigo_provincia SMALLINT DEFAULT 1 NOT NULL,
  codigo_canton SMALLINT DEFAULT 114 NOT NULL,
  codigo_distrito INT DEFAULT 11401 NOT NULL,
  direccion VARCHAR(300) DEFAULT ' ' NOT NULL,
  activo BOOLEAN DEFAULT true NOT NULL,
  CONSTRAINT pk_direcciones PRIMARY KEY(id),
  CONSTRAINT fk_direcciones_id_empleado FOREIGN KEY(id_empleado) REFERENCES empleados(id),
  CONSTRAINT fk_direcciones_codigo_provincia FOREIGN KEY(codigo_provincia) REFERENCES provincias(codigo),
  CONSTRAINT fk_direcciones_codigo_canton FOREIGN KEY(codigo_canton) REFERENCES cantones(codigo),
  CONSTRAINT fk_direcciones_codigo_distrito FOREIGN KEY(codigo_distrito) REFERENCES distritos(codigo)
);

CREATE TABLE vacaciones_disponibles (
  id INT AUTO_INCREMENT,
  id_empleado INT NOT NULL,
  cantidad INT DEFAULT 0 NOT NULL,
  activo BOOLEAN DEFAULT true NOT NULL,
	fecha DATETIME DEFAULT NOW() NOT NULL,
  CONSTRAINT pk_dias_disponibles PRIMARY KEY(id),
  CONSTRAINT fk_dias_disponibles_id_empleado FOREIGN KEY(id_empleado) REFERENCES empleados(id)
);

CREATE TABLE vacaciones (
  id INT AUTO_INCREMENT,
  id_empleado INT NOT NULL,
  activo BOOLEAN DEFAULT true NOT NULL,
  fecha_entrada DATETIME NOT NULL,
  fecha_salida DATETIME NOT NULL,
  CONSTRAINT pk_vacaciones PRIMARY KEY(id),
  CONSTRAINT fk_vacaciones_id_empleado FOREIGN KEY(id_empleado) REFERENCES empleados(id)
);

CREATE TABLE asistencias (
  asistencia BOOLEAN DEFAULT false NOT NULL,
  fecha DATETIME DEFAULT NOW(),
  id_empleado INT NOT NULL,
  contador_dias INT DEFAULT 0 NOT NULL,
  CONSTRAINT pk_asistencias PRIMARY KEY(id_empleado, fecha),
  CONSTRAINT fk_asistencias_id_empleados FOREIGN KEY(id_empleado) REFERENCES empleados(id)
);

CREATE TABLE salarios (
  id INT AUTO_INCREMENT,
  id_empleado INT NOT NULL,
  salario_hora DECIMAL(10, 2) NOT NULL,
  jornada TINYINT NOT NULL,
  activo BOOLEAN DEFAULT true NOT NULL,
  CONSTRAINT pk_salarios PRIMARY KEY(id),
  CONSTRAINT fk_salarios_id_empleado FOREIGN KEY(id_empleado) REFERENCES empleados(id)
);

CREATE TABLE asignaciones_choferes (
  id TINYINT AUTO_INCREMENT,
  dia VARCHAR(10) NOT NULL,
  tipo_servicio VARCHAR(10) NOT NULL,
  salario_hora DECIMAL(10, 2) NOT NULL,
  vehiculo VARCHAR(50) NOT NULL,
  hora_entrada DATETIME NOT NULL,
  hora_salida DATETIME NOT NULL,
  CONSTRAINT pk_asignaciones_choferes PRIMARY KEY(id)
);

CREATE TABLE tareas (
  id INT AUTO_INCREMENT,
  id_empleado INT NOT NULL,
  titulo VARCHAR(100) NOT NULL,
  descripcion VARCHAR(300) NOT NULL,
  activo BOOLEAN DEFAULT true NOT NULL,
  fecha_asignacion DATETIME DEFAULT NOW() NOT NULL,
  asignacion_chofer TINYINT NOT NULL,
  CONSTRAINT pk_tareas PRIMARY KEY(id),
  CONSTRAINT fk_tareas_id_empleado FOREIGN KEY(id_empleado) REFERENCES empleados(id),
  CONSTRAINT fk_tareas_asignacion_chofer FOREIGN KEY(asignacion_chofer) REFERENCES asignaciones_choferes(id)
);

CREATE TABLE aumentos_salariales (
	id INT AUTO_INCREMENT,
  id_empleado INT NOT NULL,
  fecha DATETIME DEFAULT NOW() NOT NULL,
  cantidad DECIMAL(10, 2) NOT NULL,
  activo BOOLEAN DEFAULT true NOT NULL,
  CONSTRAINT pk_aumentos_salariales PRIMARY KEY(id),
	CONSTRAINT fk_aumentos_salariales_id_empleado FOREIGN KEY(id_empleado) REFERENCES empleados(id),
  CONSTRAINT ch_aumentos_salariales CHECK(cantidad >= 0)
);

CREATE TABLE retenciones_salariales (
	id INT AUTO_INCREMENT,
  id_empleado INT NOT NULL,
	retencion DECIMAL(10, 2) DEFAULT 0 NOT NULL,
  fecha DATETIME DEFAULT NOW() NOT NULL,
  descripcion VARCHAR(300) NOT NULL,
  activo BOOLEAN DEFAULT true NOT NULL,
  CONSTRAINT pk_retenciones_salariales PRIMARY KEY(id),
  CONSTRAINT fk_retenciones_salariales_id_empleado FOREIGN KEY(id_empleado) REFERENCES empleados(id)
);

CREATE TABLE incapacidades (
  id INT AUTO_INCREMENT,
  id_empleado INT NOT NULL,
  fecha_salida DATE NOT NULL,
  fecha_entrada DATE NOT NULL,
  motivo VARCHAR(200) NOT NULL,
  CONSTRAINT pk_incapacidades PRIMARY KEY(id),
  CONSTRAINT fk_incapacidades_id_empleados FOREIGN KEY(id_empleado) REFERENCES empleados(id)
);

CREATE TABLE control_calidad (
  id INT AUTO_INCREMENT,
  id_empleado INT NOT NULL,
  activo BOOLEAN DEFAULT false NOT NULL,
  calificacion DECIMAL(2, 1) NOT NULL,
  nombre_cliente VARCHAR(20) NOT NULL,
  comentario VARCHAR(200) NOT NULL,
  fecha DATETIME DEFAULT NOW() NOT NULL,
  CONSTRAINT pk_control_calidad PRIMARY KEY(id),
  CONSTRAINT fk_control_calidad_id_empleado FOREIGN KEY(id_empleado) REFERENCES empleados(id)
);
