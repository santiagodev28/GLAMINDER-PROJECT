-- Script para corregir la tabla de auditoría y permitir usuario_id NULL
-- Ejecutar este script si la tabla ya existe

-- Modificar la columna usuario_id para permitir NULL
ALTER TABLE `auditoria` 
  MODIFY COLUMN `usuario_id` INT NULL COMMENT 'NULL para acciones sin usuario (ej: login fallido)';

-- Eliminar la foreign key existente
ALTER TABLE `auditoria` 
  DROP FOREIGN KEY `auditoria_ibfk_1`;

-- Recrear la foreign key con ON DELETE SET NULL
ALTER TABLE `auditoria` 
  ADD CONSTRAINT `fk_auditoria_usuario` 
  FOREIGN KEY (`usuario_id`) 
  REFERENCES `usuarios`(`usuario_id`) 
  ON DELETE SET NULL;

