START TRANSACTION;
-- Base de datos: glaminderdb

DROP DATABASE IF EXISTS `glaminderdb`;
CREATE DATABASE `glaminderdb`;
USE `glaminderdb`;

DROP TABLE IF EXISTS `roles`, `usuarios`, `empleados`, `propietarios`, `negocios`, `tiendas`, `servicios`, `calificaciones`, `calificaciones_negocios`, `calificaciones_empleados`, `horarios`, `citas`;

-- Tabla roles
CREATE TABLE `roles` (
  `rol_id` INT AUTO_INCREMENT PRIMARY KEY,
  `rol_nombre` VARCHAR(50)
);

-- Datos Roles
INSERT INTO `roles` (`rol_id`,`rol_nombre`) VALUES 
(1,'Administrador'),
(2,'Propietario'),
(3,'Empleado'),
(4,'Cliente');

-- Tabla usuarios
CREATE TABLE `usuarios` (
  `usuario_id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_nombre` VARCHAR(100),
  `usuario_apellido` VARCHAR(100),
  `usuario_correo` VARCHAR(150) UNIQUE,
  `usuario_telefono` VARCHAR(10),
  `usuario_contrasena` VARCHAR(255),
  `usuario_fecha_registro` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `usuario_estado` BOOLEAN DEFAULT 1,  
  `rol_cambiado` BOOLEAN DEFAULT 0,
  `rol_id` INT
);

-- Datos Usuarios
INSERT INTO `usuarios` (`usuario_id`,`usuario_nombre`,`usuario_apellido`, `usuario_correo`,`usuario_telefono`,`usuario_contrasena`,`rol_id`) VALUES 
(1,'Santiago','Hurtado','shurtado308@gmail.com','3108778515','1033702510',1),
(2,'Ana', 'Sanchez', 'ana@gmail.com','3006547890', '1029384756', 1),
(3,'Carlos','Perez','carlos@gmail','3006547890','1029384756',4),
(4,'Juan','Gomez','juan@gmail','3006547890','1029384756',3),
(5,'Maria','Lopez','maria@gmail','3006547890','1029384756',4),
(6,'Pedro','Martinez','pedro@gmail','3006547890','1029384756',2);

-- Tabla empleados
CREATE TABLE `empleados` (
  `empleado_id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT,
  `tienda_id` INT,
  `empleado_especialidad` VARCHAR(100),
  `empleado_estado` BOOLEAN DEFAULT 1
);

-- Datos Empleados
INSERT INTO `empleados` (`empleado_id`,`usuario_id`,`tienda_id`, `empleado_especialidad`) VALUES 
(1,4,1,'Barbero');

-- Tabla solicitud de propietario
CREATE TABLE `solicitudes_propietario` (
  `solicitud_id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT NOT NULL,
  `nombre_negocio` VARCHAR(150) NOT NULL,
  `direccion_negocio` VARCHAR(200) NOT NULL,
  `telefono_negocio` VARCHAR(15),
  `correo_negocio` VARCHAR(150),
  `descripcion_negocio` TEXT,
  `estado` ENUM('pendiente', 'aprobado', 'rechazado') DEFAULT 'pendiente',
  `fecha_solicitud` DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Datos Solicitudes Propietario
INSERT INTO `solicitudes_propietario` (`solicitud_id`,`usuario_id`,`nombre_negocio`,`direccion_negocio`,`telefono_negocio`,`correo_negocio`,`descripcion_negocio`) VALUES
(1,3, 'Barberia Glam', 'Calle 123 #45-67', '3001234567', 'barberiaglam@gmail', 'Barberia Glam es una empresa dedicada al servicio de barberia.');

-- Tabla propietarios
CREATE TABLE `propietarios` (
  `propietario_id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT,
  `propietario_estado` BOOLEAN DEFAULT 1
);

-- Datos Propietarios
INSERT INTO `propietarios` (`propietario_id`,`usuario_id`) VALUES
(1,3);


-- Tabla negocios
CREATE TABLE `negocios` (
  `negocio_id` INT AUTO_INCREMENT PRIMARY KEY,
  `propietario_id` INT,
  `negocio_nombre` VARCHAR(150),
  `negocio_direccion` VARCHAR(200),
  `negocio_telefono` VARCHAR(15),
  `negocio_correo` VARCHAR(150),
  `negocio_descripcion` TEXT,
  `negocio_fecha_registro` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `negocio_estado` BOOLEAN DEFAULT 1
);

-- Datos Negocios
INSERT INTO `negocios` (`negocio_id`,`propietario_id`,`negocio_nombre`,`negocio_direccion`,`negocio_telefono`,`negocio_correo`,`negocio_descripcion`) VALUES
(1,1,'Exclusivos','Calle 123 #45-67, Bogotá','3213119804','exclusi@gmail.com','Empresa de belleza dedicada al servicio de barberia ubicada en la ciudad de bogota.');


-- Tabla tiendas
CREATE TABLE `tiendas` (
  `tienda_id` INT AUTO_INCREMENT PRIMARY KEY,
  `negocio_id` INT,
  `tienda_nombre` VARCHAR(100), 
  `tienda_direccion` VARCHAR(200),
  `tienda_telefono` VARCHAR(10),
  `tienda_correo` VARCHAR(150),
  `tienda_ciudad` VARCHAR(50),
  `tienda_activa` BOOLEAN,
  `tienda_fecha_apertura` DATE,
  `tienda_estado` BOOLEAN DEFAULT 1
);

-- Datos Tiendas
INSERT INTO `tiendas` (`tienda_id`,`negocio_id`,`tienda_nombre`,`tienda_direccion`,`tienda_telefono`,`tienda_correo`,`tienda_ciudad`,`tienda_activa`,`tienda_fecha_apertura`) VALUES
(1,1,'Exclusivos VIP','Tv. 5r Bis #04, Cdad. Bolívar','3123534739','excluvip@gmail.com', 'Bogotá', 1, '2020-01-01');

-- Tabla servicios
CREATE TABLE `servicios` (
  `servicio_id` INT AUTO_INCREMENT PRIMARY KEY,
  `tienda_id` INT,
  `servicio_nombre` VARCHAR(100),
  `servicio_descripcion` TEXT,
  `servicio_precio` DECIMAL(10,2),
  `servicio_duracion` INT,  
  `servicio_categoria` VARCHAR(50),
  `servicio_estado` BOOLEAN DEFAULT 1
);
-- Datos Servicios
INSERT INTO `servicios` (`servicio_id`,`tienda_id`,`servicio_nombre`,`servicio_descripcion`,`servicio_precio`,`servicio_duracion`,`servicio_categoria`) VALUES
(1, 1, 'Corte de Cabello Clasico', 'Corte profesional clasico para hombre.', 15000.00, 30, 'Corte de Cabello Hombre'),
(2, 1, 'Corte de Cabello Cuchilla', 'Corte profesional Moderno con cuchilla para hombre.', 20000.00, 45, 'Corte de Cabello Hombre');


-- Tabla calificaciones
CREATE TABLE `calificaciones` (
  `calificacion_id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT,
  `calificacion_puntuacion` TINYINT,
  `calificacion_comentario` TEXT,
  `calificacion_imagen` TEXT,
  `calificacion_fecha` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Datos Calificaciones
INSERT INTO `calificaciones` (`calificacion_id`,`usuario_id`,`calificacion_puntuacion`,`calificacion_comentario`,`calificacion_imagen`,`calificacion_fecha`) VALUES
(1, 1, 5, 'Excelente servicio', 'imagen.jpg','2025-05-26 00:19:56');

-- Tabla calificaciones_negocios
CREATE TABLE `calificaciones_negocios` (
  `negocio_id` INT,
  `calificacion_id` INT
);
-- Datos Calificaciones Negocios
INSERT INTO `calificaciones_negocios` (`negocio_id`,`calificacion_id`) VALUES
(1, 1);

-- Tabla calificaciones_empleados
CREATE TABLE `calificaciones_empleados` (
  `calificacion_id` INT,
  `empleado_id` INT
);
-- Datos Calificaciones Empleados
INSERT INTO `calificaciones_empleados` (`calificacion_id`,`empleado_id`) VALUES
(1, 1);

-- Tabla horarios
CREATE TABLE `horarios` (
  `horario_id` INT AUTO_INCREMENT PRIMARY KEY,
  `tienda_id` INT,
  `empleado_id` INT,
  `horario_dia` VARCHAR(20),
  `horario_inicio` TIME,
  `horario_fin` TIME,
  `horario_activo` BOOLEAN,
  `horario_tipo` VARCHAR(20) DEFAULT 'cita',
  `horario_estado` TINYINT DEFAULT 1,
  `horario_hora_inicio` TIME,
  `horario_hora_fin` TIME
);
-- Datos Horarios - Múltiples horarios por empleado por día
INSERT INTO `horarios` (`horario_id`,`tienda_id`,`empleado_id`,`horario_dia`,`horario_inicio`,`horario_fin`,`horario_activo`,`horario_tipo`,`horario_estado`,`horario_hora_inicio`,`horario_hora_fin`) VALUES
-- Horarios del empleado 1 (Juan) - Lunes: Mañana y Tarde
(1, 1, 1, 'lunes', '09:00:00', '12:00:00', true, 'cita', 1, '09:00:00', '12:00:00'),
(2, 1, 1, 'lunes', '14:00:00', '17:00:00', true, 'cita', 1, '14:00:00', '17:00:00'),
-- Martes: Solo mañana
(3, 1, 1, 'martes', '09:00:00', '13:00:00', true, 'cita', 1, '09:00:00', '13:00:00'),
-- Miércoles: Mañana y tarde
(4, 1, 1, 'miércoles', '08:00:00', '12:00:00', true, 'cita', 1, '08:00:00', '12:00:00'),
(5, 1, 1, 'miércoles', '15:00:00', '19:00:00', true, 'cita', 1, '15:00:00', '19:00:00'),
-- Jueves: Jornada completa
(6, 1, 1, 'jueves', '09:00:00', '17:00:00', true, 'cita', 1, '09:00:00', '17:00:00'),
-- Viernes: Solo tarde
(7, 1, 1, 'viernes', '13:00:00', '17:00:00', true, 'cita', 1, '13:00:00', '17:00:00'),
-- Sábado: Solo mañana
(8, 1, 1, 'sábado', '09:00:00', '12:00:00', true, 'cita', 1, '09:00:00', '12:00:00');

-- Tabla franjas_horarias
CREATE TABLE `franjas_horarias` (
  `franja_id` INT AUTO_INCREMENT PRIMARY KEY,
  `horario_id` INT NOT NULL,
  `empleado_id` INT NOT NULL,
  `tienda_id` INT NOT NULL,
  `franja_fecha` DATE NOT NULL,
  `franja_hora_inicio` TIME NOT NULL,
  `franja_hora_fin` TIME NOT NULL,
  `franja_disponible` BOOLEAN DEFAULT 1,
  `franja_duracion_minutos` INT DEFAULT 30,
  `franja_estado` TINYINT DEFAULT 1
);

-- Datos Franjas Horarias
INSERT INTO `franjas_horarias` (`franja_id`,`horario_id`,`empleado_id`,`tienda_id`,`franja_fecha`,`franja_hora_inicio`,`franja_hora_fin`,`franja_disponible`) VALUES
(1, 1, 1, 1, '2025-05-23', '09:00:00', '17:00:00', true);

-- Tabla citas
CREATE TABLE `citas` (
  `cita_id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT,
  `franja_id` INT,
  `servicio_id` INT,
  `cita_fecha` DATE,
  `slot_inicio` TIME,
  `slot_fin` TIME,
  `cita_estado` ENUM('pendiente', 'confirmada', 'cancelada', 'completada'),
  `cita_motivo_cancelacion` TEXT,
  `cita_fecha_creacion` DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Datos Citas
INSERT INTO `citas` (`cita_id`,`usuario_id`,`servicio_id`,`franja_id`,`cita_fecha`, `cita_estado`, `cita_motivo_cancelacion`) VALUES
(1, 5, 1, 1,'2025-05-23', 'pendiente', '');

-- Claves foráneas
ALTER TABLE `usuarios` ADD FOREIGN KEY (`rol_id`) REFERENCES `roles`(`rol_id`);
ALTER TABLE `empleados` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`usuario_id`);
ALTER TABLE `empleados` ADD FOREIGN KEY (`tienda_id`) REFERENCES `tiendas`(`tienda_id`);
ALTER TABLE `propietarios` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`usuario_id`);
ALTER TABLE `negocios` ADD FOREIGN KEY (`propietario_id`) REFERENCES `propietarios`(`propietario_id`);
ALTER TABLE `tiendas` ADD FOREIGN KEY (`negocio_id`) REFERENCES `negocios`(`negocio_id`);
ALTER TABLE `servicios` ADD FOREIGN KEY (`tienda_id`) REFERENCES `tiendas`(`tienda_id`);
ALTER TABLE `calificaciones` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`usuario_id`);
ALTER TABLE `calificaciones_negocios` ADD FOREIGN KEY (`negocio_id`) REFERENCES `negocios`(`negocio_id`);
ALTER TABLE `calificaciones_negocios` ADD FOREIGN KEY (`calificacion_id`) REFERENCES `calificaciones`(`calificacion_id`);
ALTER TABLE `calificaciones_empleados` ADD FOREIGN KEY (`calificacion_id`) REFERENCES `calificaciones`(`calificacion_id`);
ALTER TABLE `calificaciones_empleados` ADD FOREIGN KEY (`empleado_id`) REFERENCES `empleados`(`empleado_id`);
ALTER TABLE `horarios` ADD FOREIGN KEY (`tienda_id`) REFERENCES `tiendas`(`tienda_id`);
ALTER TABLE `horarios` ADD FOREIGN KEY (`empleado_id`) REFERENCES `empleados`(`empleado_id`);
ALTER TABLE `citas` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`usuario_id`);
ALTER TABLE `citas` ADD FOREIGN KEY (`servicio_id`) REFERENCES `servicios`(`servicio_id`);
ALTER TABLE `citas` ADD FOREIGN KEY (`franja_id`) REFERENCES `franjas_horarias`(`franja_id`);
ALTER TABLE `franjas_horarias` ADD FOREIGN KEY (`horario_id`) REFERENCES `horarios`(`horario_id`);
ALTER TABLE `franjas_horarias` ADD FOREIGN KEY (`empleado_id`) REFERENCES `empleados`(`empleado_id`);
ALTER TABLE `franjas_horarias` ADD FOREIGN KEY (`tienda_id`) REFERENCES `tiendas`(`tienda_id`);

ALTER TABLE `solicitudes_propietario` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`usuario_id`);

COMMIT;
-- -- Fin de la transacción