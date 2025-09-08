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
