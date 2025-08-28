# Sistema de Agendamiento de Citas

Este sistema permite a los clientes agendar citas en negocios de belleza y bienestar de manera intuitiva y eficiente.

## Componentes Principales

### 1. AppointmentBooking.jsx

Componente principal que maneja todo el flujo de agendamiento de citas.

**Características:**

- Flujo paso a paso (4 pasos)
- Selección de tienda, servicio, empleado, fecha y horario
- Validaciones en tiempo real
- Interfaz responsiva y moderna

**Uso:**

```jsx
import AppointmentBooking from "./AppointmentBooking";

// En tu ruta
<Route path="/agendar-cita/:businessId" element={<AppointmentBooking />} />;
```

### 2. UserAppointments.jsx

Muestra todas las citas del usuario con opciones de gestión.

**Características:**

- Lista de citas con estados visuales
- Opción de cancelación para citas pendientes
- Información detallada de cada cita
- Estados: pendiente, confirmada, completada, cancelada

**Uso:**

```jsx
import UserAppointments from "./UserAppointments";

<UserAppointments />;
```

### 3. DatePicker.jsx

Selector de fechas personalizado con calendario visual.

**Características:**

- Calendario mensual interactivo
- Fechas deshabilitadas automáticamente
- Navegación entre meses
- Selección visual clara

**Props:**

- `selectedDate`: Fecha seleccionada
- `onDateSelect`: Callback cuando se selecciona una fecha
- `minDate`: Fecha mínima permitida
- `maxDate`: Fecha máxima permitida
- `disabledDates`: Array de fechas deshabilitadas

### 4. TimeSlotSelector.jsx

Selector de horarios disponibles organizados por categorías.

**Características:**

- Horarios agrupados por mañana, tarde, noche
- Visualización clara de disponibilidad
- Selección intuitiva de horarios
- Información de slots disponibles

**Props:**

- `schedules`: Array de horarios disponibles
- `selectedSchedule`: Horario seleccionado
- `onScheduleSelect`: Callback para selección
- `selectedDate`: Fecha seleccionada
- `employeeName`: Nombre del empleado

### 5. AppointmentConfirmation.jsx

Confirmación final de la cita con términos y condiciones.

**Características:**

- Resumen completo de la cita
- Términos y condiciones obligatorios
- Información importante para el cliente
- Validación antes de confirmar

**Props:**

- `appointmentData`: Datos completos de la cita
- `onConfirm`: Callback para confirmar
- `onBack`: Callback para volver
- `isSubmitting`: Estado de envío

## Servicios

### appointmentService.js

Maneja todas las operaciones relacionadas con citas:

- `createAppointment()`: Crear nueva cita
- `getUserAppointments()`: Obtener citas del usuario
- `getServicesByStore()`: Obtener servicios por tienda
- `getEmployeesByStore()`: Obtener empleados por tienda
- `getAvailableSchedules()`: Obtener horarios disponibles
- `checkTimeSlotAvailability()`: Verificar disponibilidad
- `cancelAppointment()`: Cancelar cita

## Flujo de Agendamiento

1. **Selección de Tienda**: El usuario selecciona una tienda del negocio
2. **Selección de Servicio**: Se muestran los servicios disponibles en la tienda
3. **Selección de Empleado y Fecha**: Se elige el profesional y la fecha deseada
4. **Selección de Horario**: Se muestran los horarios disponibles para esa fecha
5. **Confirmación**: Se revisan todos los detalles y se confirma la cita

## Estados de Cita

- **pendiente**: Cita recién creada, esperando confirmación
- **confirmada**: Cita confirmada por el negocio
- **completada**: Servicio realizado exitosamente
- **cancelada**: Cita cancelada por el cliente o negocio

## Validaciones

- No se permiten fechas pasadas
- Máximo 30 días en adelante
- Verificación de disponibilidad en tiempo real
- Términos y condiciones obligatorios
- Confirmación antes de crear la cita

## Estilos

El sistema utiliza Tailwind CSS con:

- Colores principales: naranja/orange para acciones
- Gradientes suaves para fondos
- Sombras y bordes redondeados
- Iconos de Heroicons
- Diseño responsivo para móvil y desktop

## Dependencias

- React Hooks (useState, useEffect)
- React Router para navegación
- Heroicons para iconos
- Tailwind CSS para estilos
- Servicios personalizados para API calls

## Personalización

Los componentes están diseñados para ser fácilmente personalizables:

- Colores y temas
- Validaciones adicionales
- Campos personalizados
- Integración con sistemas de pago
- Notificaciones por email/SMS
