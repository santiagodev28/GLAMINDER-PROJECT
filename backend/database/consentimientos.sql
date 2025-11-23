-- Tabla para almacenar consentimientos de usuarios
CREATE TABLE IF NOT EXISTS `consentimientos` (
  `consentimiento_id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT NOT NULL,
  `tipo_consentimiento` VARCHAR(100) NOT NULL COMMENT 'TERMINOS_CONDICIONES, POLITICA_PRIVACIDAD, MARKETING, etc.',
  `version` VARCHAR(20) NOT NULL COMMENT 'Versión del documento aceptado (ej: 1.0, 2025-01)',
  `aceptado` BOOLEAN DEFAULT 1,
  `ip_address` VARCHAR(45) NULL,
  `user_agent` TEXT NULL,
  `fecha_consentimiento` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `fecha_revocacion` DATETIME NULL COMMENT 'Fecha en que el usuario revocó el consentimiento',
  INDEX idx_usuario_id (usuario_id),
  INDEX idx_tipo_consentimiento (tipo_consentimiento),
  INDEX idx_fecha_consentimiento (fecha_consentimiento),
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

