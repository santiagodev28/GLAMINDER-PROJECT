# Sistema de Múltiples Horarios por Empleado

## 📋 Resumen

Este documento describe el nuevo sistema implementado para manejar múltiples horarios por empleado en Glaminder. El sistema permite que cada empleado tenga varios horarios de trabajo en un mismo día (ej: 9:00-12:00 y 14:00-17:00).

## 🏗️ Arquitectura del Sistema

### Base de Datos

#### Tabla `horarios` (Horarios Base)

- **Propósito**: Define los horarios base por día de la semana para cada empleado
- **Características**:
  - Un empleado puede tener múltiples registros para el mismo día
  - Ejemplo: Lunes 9:00-12:00 y Lunes 14:00-17:00

#### Tabla `franjas_horarias` (Horarios Específicos)

- **Propósito**: Genera horarios específicos para fechas concretas basados en los horarios base
- **Características**:
  - Se generan automáticamente para cada fecha
  - Manejan la disponibilidad en tiempo real
  - Se relacionan directamente con las citas

#### Tabla `citas` (Actualizada)

- **Cambio Principal**: Ahora usa `franja_id` en lugar de `horario_id`
- **Beneficio**: Mayor flexibilidad y control de disponibilidad

## 🔄 Flujo de Funcionamiento

### 1. Configuración de Horarios

```sql
-- Ejemplo: Empleado con múltiples horarios el lunes
INSERT INTO horarios (empleado_id, horario_dia, horario_hora_inicio, horario_hora_fin) VALUES
(1, 'lunes', '09:00:00', '12:00:00'),  -- Mañana
(1, 'lunes', '14:00:00', '17:00:00');  -- Tarde
```

### 2. Generación Automática de Franjas

- Cuando un cliente solicita horarios disponibles, el sistema:
  1. Verifica si existen franjas para esa fecha
  2. Si no existen, las genera automáticamente basándose en los horarios base
  3. Filtra las franjas disponibles (sin citas programadas)

### 3. Reserva de Citas

- El cliente selecciona una franja horaria específica
- El sistema verifica disponibilidad
- Se crea la cita vinculada a la franja horaria

## 🚀 Nuevas Funcionalidades

### API Endpoints

#### Franjas Horarias

- `GET /api/franjas/empleado/:empleado_id/:fecha` - Obtener franjas disponibles
- `POST /api/franjas/generar/:empleado_id` - Generar franjas para un rango de fechas
- `GET /api/franjas/:franja_id/slots` - Generar slots de tiempo para una franja

#### Horarios (Actualizados)

- `GET /api/horarios/empleado/:empleado_id/:fecha` - Obtener horarios disponibles (ahora usa franjas)

### Modelos

#### FranjaHoraria.js

- Gestión completa de franjas horarias
- Generación automática basada en horarios base
- Verificación de disponibilidad

#### Schedule.js (Actualizado)

- Integración con FranjaHoraria
- Generación automática de franjas cuando es necesario
- Compatibilidad con el frontend existente

#### Appointment.js (Actualizado)

- Uso de franjas_horarias en lugar de horarios directos
- Consultas optimizadas con JOINs apropiados

## 📊 Ejemplos de Uso

### Configuración de Horarios Múltiples

```javascript
// Empleado con horario partido los lunes
const horariosLunes = [
  {
    empleado_id: 1,
    horario_dia: "lunes",
    horario_hora_inicio: "09:00:00",
    horario_hora_fin: "12:00:00",
  },
  {
    empleado_id: 1,
    horario_dia: "lunes",
    horario_hora_inicio: "14:00:00",
    horario_hora_fin: "17:00:00",
  },
];
```

### Obtención de Horarios Disponibles

```javascript
// El sistema automáticamente:
// 1. Genera franjas para la fecha si no existen
// 2. Filtra las franjas disponibles
// 3. Retorna los horarios en formato compatible

const horariosDisponibles = await Schedule.getAvailableSchedulesByEmployee(
  1,
  "2025-01-27"
);
// Resultado: [
//   { franja_id: 1, horario_hora_inicio: '09:00:00', horario_hora_fin: '12:00:00' },
//   { franja_id: 2, horario_hora_inicio: '14:00:00', horario_hora_fin: '17:00:00' }
// ]
```

## 🔧 Configuración y Migración

### 1. Actualizar Base de Datos

```bash
# Ejecutar el script SQL actualizado
mysql -u usuario -p glaminderdb < backend/database/glaminderdb.sql
```

### 2. Instalar Dependencias

```bash
cd backend
npm install
```

### 3. Probar el Sistema

```bash
# Ejecutar script de prueba
node backend/test-multiple-schedules.js
```

## 🎯 Beneficios del Nuevo Sistema

### Para Empleados

- **Flexibilidad**: Pueden tener horarios partidos o múltiples turnos
- **Control**: Cada franja horaria se maneja independientemente
- **Disponibilidad**: El sistema respeta automáticamente las citas existentes

### Para Clientes

- **Más Opciones**: Ven todos los horarios disponibles del empleado
- **Mejor Experiencia**: Selección más granular de horarios
- **Disponibilidad Real**: Solo ven horarios realmente disponibles

### Para Administradores

- **Gestión Simplificada**: Configuración intuitiva de horarios
- **Escalabilidad**: Fácil agregar más empleados y horarios
- **Reportes**: Mejor visibilidad de la utilización de horarios

## 🔍 Monitoreo y Debugging

### Logs Importantes

- Generación de franjas horarias
- Verificación de disponibilidad
- Creación de citas

### Métricas Clave

- Número de franjas generadas por día
- Tasa de utilización de horarios
- Tiempo de respuesta de consultas

## 🚨 Consideraciones Importantes

### Rendimiento

- Las franjas se generan bajo demanda para evitar sobrecarga
- Se implementan índices apropiados en la base de datos
- Las consultas están optimizadas con JOINs eficientes

### Consistencia de Datos

- Las franjas se generan automáticamente cuando es necesario
- Se evitan duplicados mediante validaciones
- Las citas se vinculan correctamente a las franjas

### Compatibilidad

- El frontend existente sigue funcionando sin cambios
- Los endpoints mantienen compatibilidad hacia atrás
- La migración es transparente para el usuario final

## 📈 Próximos Pasos

1. **Testing Exhaustivo**: Pruebas con múltiples empleados y escenarios complejos
2. **Optimización**: Monitoreo de rendimiento y ajustes según sea necesario
3. **Funcionalidades Adicionales**:
   - Horarios recurrentes
   - Excepciones de horario
   - Notificaciones automáticas
4. **Frontend**: Actualizaciones para aprovechar al máximo las nuevas funcionalidades

---

**Desarrollado por**: Equipo Glaminder  
**Fecha**: Enero 2025  
**Versión**: 2.0.0
