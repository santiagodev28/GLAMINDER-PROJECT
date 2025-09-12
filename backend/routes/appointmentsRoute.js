import { Router } from "express";
import AppointmentsController from "../controllers/appointmentsController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

const appointmentRoutes = Router();

// Estadísticas de citas (DEBE IR PRIMERO)
appointmentRoutes.get(
  "/stats",
  verifyToken,
  authorizeRoles(1, 2),
  AppointmentsController.getAppointmentStats
);

// Obtener todas las citas (con filtros)
appointmentRoutes.get(
  "/",
  verifyToken,
  authorizeRoles(1, 2, 4),
  AppointmentsController.getAllAppointments
);

// Obtener citas por propietario (solo de sus negocios)
appointmentRoutes.get(
  "/propietario/:propietario_id",
  verifyToken,
  authorizeRoles(1, 2),
  AppointmentsController.getAppointmentsByOwner
);

// Obtener cita por ID
appointmentRoutes.get(
  "/:cita_id",
  verifyToken,
  authorizeRoles(1, 2, 4),
  AppointmentsController.getAppointmentById
);

// Crear nueva cita
appointmentRoutes.post(
  "/",
  verifyToken,
  authorizeRoles(1, 2, 4),
  AppointmentsController.createAppointment
);

// Actualizar cita
appointmentRoutes.put(
  "/:cita_id",
  verifyToken,
  authorizeRoles(1, 2),
  AppointmentsController.updateAppointment
);

// Cambiar estado de cita
appointmentRoutes.put(
  "/:cita_id/estado",
  verifyToken,
  authorizeRoles(1, 2),
  AppointmentsController.changeStateAppointment
);

// Cancelar cita
appointmentRoutes.put(
  "/:cita_id/cancelar",
  verifyToken,
  authorizeRoles(1, 2, 4),
  AppointmentsController.cancelAppointment
);

// Confirmar cita
appointmentRoutes.put(
  "/:cita_id/confirmar",
  verifyToken,
  authorizeRoles(1, 2, 3, 4),
  AppointmentsController.confirmAppointment
);

// Completar cita
appointmentRoutes.put(
  "/:cita_id/completar",
  verifyToken,
  authorizeRoles(1, 2, 3, 4),
  AppointmentsController.completeAppointment
);

// Eliminar cita (solo si está pendiente)
appointmentRoutes.delete(
  "/:cita_id",
  verifyToken,
  authorizeRoles(1, 2, 4),
  AppointmentsController.deleteAppointment
);

// Obtener mis citas (para clientes) - DEBE IR ANTES de /usuario/:usuario_id
appointmentRoutes.get(
  "/usuario/mis-citas",
  verifyToken,
  authorizeRoles(4),
  AppointmentsController.getMyAppointments
);

// Obtener citas por usuario
appointmentRoutes.get(
  "/usuario/:usuario_id",
  verifyToken,
  authorizeRoles(1, 2, 4),
  AppointmentsController.getAppointmentsByUser
);

// Obtener citas por empleado
appointmentRoutes.get(
  "/empleado/:empleado_id",
  verifyToken,
  authorizeRoles(1, 2, 3),
  AppointmentsController.getAppointmentsByEmployee
);

// Obtener horarios disponibles para un empleado en una fecha
appointmentRoutes.get(
  "/empleado/:empleado_id/horarios",
  verifyToken,
  authorizeRoles(1, 2),
  AppointmentsController.getAvailableTimeSlots
);

export default appointmentRoutes;
