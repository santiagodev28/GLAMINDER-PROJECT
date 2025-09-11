import { Router } from "express";
import SchedulesController from "../controllers/schedulesController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

const scheduleRoutes = Router();

// Rutas
scheduleRoutes.get("/", SchedulesController.getAllSchedules);

// Rutas específicas deben ir ANTES de las genéricas
scheduleRoutes.get(
  "/empleado/:empleado_id/:fecha",
  verifyToken,
  authorizeRoles(1, 2, 4),
  SchedulesController.getAvailableSchedules
);

// Obtener horarios de un empleado específico
scheduleRoutes.get(
  "/empleado/:empleado_id",
  verifyToken,
  authorizeRoles(1, 2),
  SchedulesController.getEmployeeSchedules
);

// Obtener horarios de una tienda específica
scheduleRoutes.get(
  "/tienda/:tienda_id",
  verifyToken,
  authorizeRoles(1, 2),
  SchedulesController.getStoreSchedules
);

// Obtener horarios por propietario (todos los empleados de sus tiendas)
scheduleRoutes.get(
  "/propietario/:propietario_id",
  verifyToken,
  authorizeRoles(1, 2),
  SchedulesController.getSchedulesByOwner
);

scheduleRoutes.get("/:cita_id", SchedulesController.getScheduleById);
scheduleRoutes.post(
  "/",
  verifyToken,
  authorizeRoles(1, 2),
  SchedulesController.createSchedule
);
scheduleRoutes.put(
  "/:cita_id",
  verifyToken,
  authorizeRoles(1, 2),
  SchedulesController.updateSchedule
);
scheduleRoutes.delete(
  "/:cita_id",
  verifyToken,
  authorizeRoles(1, 2),
  SchedulesController.deleteSchedule
);

export default scheduleRoutes;
