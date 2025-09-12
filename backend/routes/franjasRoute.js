import express from "express";
import FranjasController from "../controllers/franjasController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(verifyToken);

// Rutas públicas (requieren autenticación)
router.get("/", FranjasController.getAllFranjas);
router.get("/stats", FranjasController.getFranjaStats);
router.get("/:franja_id", FranjasController.getFranjaById);
router.get("/:franja_id/slots", FranjasController.generateTimeSlots);

// Rutas para empleados y administradores
router.get(
  "/empleado/:empleado_id/:fecha",
  FranjasController.getAvailableFranjasByEmployee
);

// Rutas que requieren permisos de administrador o propietario
router.post(
  "/",
  authorizeRoles(1,2,4),
  FranjasController.createFranja
);

router.put(
  "/:franja_id",
  authorizeRoles(1,2,4),
  FranjasController.updateFranja
);

router.delete(
  "/:franja_id",
  authorizeRoles(1,2),
  FranjasController.deleteFranja
);

// Ruta para generar franjas en lote (solo administradores)
router.post(
  "/generar/:empleado_id",
  authorizeRoles(1,2,4),
  FranjasController.generateFranjasForDateRange
);

export default router;
