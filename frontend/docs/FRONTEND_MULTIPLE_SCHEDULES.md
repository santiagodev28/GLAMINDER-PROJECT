# Frontend - Sistema de Múltiples Horarios por Empleado

## 📋 Resumen

Este documento describe las actualizaciones realizadas en el frontend para soportar el nuevo sistema de múltiples horarios por empleado en Glaminder.

## 🔄 Cambios Realizados

### **1. appointmentService.js - Servicios Actualizados**

#### Nuevos Endpoints

- `getAvailableFranjas(empleado_id, fecha)` - Obtener franjas horarias directamente
- `generateFranjasForDateRange(empleado_id, fecha_inicio, fecha_fin)` - Generar franjas en lote
- `getTimeSlotsForFranja(franja_id, duracion_minutos)` - Obtener slots de tiempo para una franja
- `getFranjaStats(filters)` - Obtener estadísticas de franjas

#### Endpoint Actualizado

- `getAvailableSchedules(empleado_id, fecha)` - Ahora usa `/horarios/empleado/` que internamente maneja franjas

### **2. TimeSlotSelector.jsx - Componente Mejorado**

#### Nuevas Funcionalidades

- **Generación automática de slots**: Crea slots de tiempo basados en las franjas horarias
- **Múltiples horarios por día**: Muestra todos los horarios disponibles del empleado
- **Información detallada**: Muestra duración, franja horaria, y disponibilidad
- **Agrupación por categorías**: Mañana, tarde, noche organizadas visualmente

#### Mejoras en la UI

- Contador de horarios por categoría
- Información de duración de cada slot
- Detalles de la franja horaria seleccionada
- Mejor feedback visual para horarios disponibles/no disponibles

### **3. AppointmentBooking.jsx - Compatibilidad**

#### Actualización de Datos

- Usa `franja_id` en lugar de `horario_id` cuando está disponible
- Mantiene compatibilidad hacia atrás con el sistema anterior

## 🚀 Nuevas Funcionalidades

### **Generación de Slots de Tiempo**

El componente `TimeSlotSelector` ahora genera automáticamente slots de tiempo basados en las franjas horarias:

```javascript
// Ejemplo de slot generado
{
  franja_id: 1,
  horario_id: 1,
  hora_inicio: "09:00",
  hora_fin: "09:30",
  franja_hora_inicio: "09:00",
  franja_hora_fin: "12:00",
  empleado_id: 1,
  tienda_id: 1,
  franja_duracion_minutos: 30,
  franja_disponible: true
}
```

### **Agrupación Inteligente**

Los horarios se agrupan automáticamente por categorías de tiempo:

- **Mañana**: 6:00 - 12:00
- **Tarde**: 12:00 - 17:00
- **Noche**: 17:00 - 21:00
- **Madrugada**: 21:00 - 6:00

### **Información Detallada**

Cada slot muestra:

- Hora de inicio y fin
- Duración en minutos
- Estado de disponibilidad
- Información de la franja horaria

## 📊 Ejemplos de Uso

### **Cargar Horarios Disponibles**

```javascript
// Usar el servicio actualizado
const horarios = await appointmentService.getAvailableSchedules(
  1,
  "2025-01-27"
);

// O usar franjas directamente
const franjas = await appointmentService.getAvailableFranjas(1, "2025-01-27");
```

### **Generar Franjas en Lote**

```javascript
// Solo para administradores
const result = await appointmentService.generateFranjasForDateRange(
  1, // empleado_id
  "2025-01-27", // fecha_inicio
  "2025-01-30" // fecha_fin
);
```

### **Obtener Slots de Tiempo**

```javascript
const slots = await appointmentService.getTimeSlotsForFranja(
  franja_id,
  30 // duracion_minutos
);
```

## 🧪 Componente de Prueba

### **TestMultipleSchedules.jsx**

Se ha creado un componente de prueba completo que permite:

1. **Seleccionar empleado y fecha**
2. **Cargar horarios disponibles**
3. **Generar franjas horarias**
4. **Ver datos de debug**
5. **Probar la selección de horarios**

#### Uso del Componente de Prueba

```jsx
import TestMultipleSchedules from "./components/test/TestMultipleSchedules";

// En tu aplicación
<TestMultipleSchedules />;
```

### **Utilidades de Prueba**

```javascript
import {
  testMultipleSchedulesFrontend,
  checkAvailability,
} from "./utils/testMultipleSchedules";

// Probar el sistema completo
const result = await testMultipleSchedulesFrontend();

// Verificar disponibilidad
const availability = await checkAvailability(1, "2025-01-27");
```

## 🎯 Beneficios del Nuevo Sistema

### **Para Desarrolladores**

- **Código más limpio**: Separación clara entre horarios base y franjas específicas
- **Mejor debugging**: Componente de prueba con información detallada
- **APIs flexibles**: Múltiples endpoints para diferentes necesidades

### **Para Usuarios**

- **Más opciones**: Ven todos los horarios disponibles del empleado
- **Mejor UX**: Información clara sobre duración y disponibilidad
- **Selección granular**: Pueden elegir slots específicos de tiempo

### **Para Administradores**

- **Gestión simplificada**: Generación automática de franjas
- **Visibilidad completa**: Estadísticas y monitoreo detallado
- **Escalabilidad**: Fácil agregar más empleados y horarios

## 🔧 Configuración y Uso

### **1. Instalar Dependencias**

```bash
cd frontend
npm install
```

### **2. Usar el Componente de Prueba**

```jsx
// En tu archivo de rutas o componente principal
import TestMultipleSchedules from "./components/test/TestMultipleSchedules";

function App() {
  return (
    <div>
      <TestMultipleSchedules />
    </div>
  );
}
```

### **3. Integrar en Componentes Existentes**

```jsx
// En cualquier componente que necesite horarios
import appointmentService from "../services/appointmentService";

const MyComponent = () => {
  const [horarios, setHorarios] = useState([]);

  useEffect(() => {
    const loadHorarios = async () => {
      const data = await appointmentService.getAvailableSchedules(
        1,
        "2025-01-27"
      );
      setHorarios(data);
    };
    loadHorarios();
  }, []);

  return (
    <TimeSlotSelector
      schedules={horarios}
      selectedSchedule={selectedSchedule}
      onScheduleSelect={setSelectedSchedule}
      selectedDate="2025-01-27"
      employeeName="Juan Gomez"
    />
  );
};
```

## 🚨 Consideraciones Importantes

### **Compatibilidad**

- El sistema mantiene compatibilidad con el frontend existente
- Los componentes existentes siguen funcionando sin cambios
- La migración es transparente para el usuario final

### **Rendimiento**

- Los slots se generan en el frontend para mejor responsividad
- Las consultas están optimizadas en el backend
- Se implementa caché local para evitar consultas repetidas

### **Seguridad**

- Los endpoints requieren autenticación
- Solo administradores pueden generar franjas en lote
- Validación de datos en frontend y backend

## 📈 Próximos Pasos

1. **Testing Exhaustivo**: Probar con múltiples empleados y escenarios
2. **Optimización**: Implementar caché y optimizaciones de rendimiento
3. **Funcionalidades Adicionales**:
   - Filtros por categoría de tiempo
   - Búsqueda de horarios
   - Notificaciones en tiempo real
4. **Mejoras de UX**:
   - Animaciones de transición
   - Indicadores de carga mejorados
   - Feedback visual más rico

---

**Desarrollado por**: Equipo Glaminder  
**Fecha**: Enero 2025  
**Versión**: 2.0.0
