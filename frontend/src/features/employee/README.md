# Módulo de Empleados

Este módulo contiene la funcionalidad específica para los empleados del sistema Glaminder.

## Estructura

```
employee/
├── pages/
│   ├── EmployeeDashboard.jsx    # Dashboard principal del empleado
│   ├── EmployeeAppointments.jsx # Gestión de citas del empleado
│   ├── EmployeeServices.jsx     # Servicios que ofrece el empleado
│   └── index.js                 # Exportaciones
└── README.md                    # Este archivo
```

## Funcionalidades

### Dashboard del Empleado (`EmployeeDashboard.jsx`)

- Información personal del empleado
- Información del negocio y tienda asignada
- Estadísticas básicas (citas de hoy, completadas, servicios)
- Lista de citas del día actual
- Acciones rápidas para confirmar/completar citas
- Lista de servicios que puede ofrecer

### Gestión de Citas (`EmployeeAppointments.jsx`)

- Vista de todas las citas del empleado
- Filtros por fecha y estado
- Acciones para confirmar y completar citas
- Información detallada de cada cita (cliente, servicio, horarios)

### Servicios del Empleado (`EmployeeServices.jsx`)

- Lista de servicios asignados al empleado
- Información detallada de cada servicio (precio, duración, descripción)
- Resumen estadístico de servicios

## Servicios

### `employeeService.js`

Contiene todos los métodos para interactuar con la API relacionada con empleados:

- `getEmployeeByUserId(userId)` - Obtener empleado por ID de usuario
- `getEmployeeInfo(employeeId)` - Información completa del empleado
- `getEmployeeStats(employeeId)` - Estadísticas del empleado
- `getEmployeeAppointments(employeeId, filters)` - Citas del empleado
- `getTodayAppointments(employeeId)` - Citas de hoy
- `confirmAppointment(appointmentId)` - Confirmar cita
- `completeAppointment(appointmentId)` - Completar cita
- `getEmployeeServices(employeeId)` - Servicios del empleado
- `getEmployeeSchedules(employeeId)` - Horarios del empleado

## Rutas

Las rutas del módulo de empleados están configuradas en `AppRoutes.jsx`:

- `/empleado` - Dashboard principal (ruta por defecto)
- `/empleado/dashboard` - Dashboard del empleado
- `/empleado/citas` - Gestión de citas
- `/empleado/servicios` - Servicios del empleado

## Layout

El layout del empleado (`EmployeeLayout.jsx`) incluye:

- Sidebar con navegación
- Enlaces a las secciones principales
- Botón de cerrar sesión
- Diseño consistente con el resto de la aplicación

## Dependencias

- React Router para navegación
- Tailwind CSS para estilos
- Servicio de API personalizado
- LocalStorage para autenticación
