# 🔧 Fix para Tabla de Auditoría

## Problema
La tabla `auditoria` tiene `usuario_id` como NOT NULL, pero necesitamos permitir NULL para registrar intentos de login fallidos donde no conocemos el usuario.

## Solución
Ejecuta el script `fix_auditoria.sql` en tu base de datos MySQL.

## Pasos

1. **Opción 1: Desde MySQL CLI**
   ```bash
   mysql -u tu_usuario -p tu_base_de_datos < fix_auditoria.sql
   ```

2. **Opción 2: Desde MySQL Workbench o phpMyAdmin**
   - Abre el archivo `fix_auditoria.sql`
   - Copia y pega el contenido
   - Ejecuta el script

3. **Opción 3: Desde Node.js (temporal)**
   Puedes ejecutar este código una vez:
   ```javascript
   import { executeQuery } from './database/connectiondb.js';
   
   const fixAuditoria = async () => {
     await executeQuery(`
       ALTER TABLE auditoria 
       MODIFY COLUMN usuario_id INT NULL;
     `);
     
     await executeQuery(`
       ALTER TABLE auditoria 
       DROP FOREIGN KEY auditoria_ibfk_1;
     `);
     
     await executeQuery(`
       ALTER TABLE auditoria 
       ADD CONSTRAINT fk_auditoria_usuario 
       FOREIGN KEY (usuario_id) 
       REFERENCES usuarios(usuario_id) 
       ON DELETE SET NULL;
     `);
   };
   ```

## Verificación
Después de ejecutar el script, verifica que la tabla permita NULL:
```sql
DESCRIBE auditoria;
```
La columna `usuario_id` debe mostrar `YES` en la columna `Null`.

## Cambios Realizados

1. ✅ Modificado `usuario_id` para permitir NULL
2. ✅ Actualizado foreign key para usar `ON DELETE SET NULL`
3. ✅ Mejorado código para intentar obtener `usuario_id` cuando sea posible
4. ✅ Agregado información adicional en `datos_nuevos` para login fallidos

