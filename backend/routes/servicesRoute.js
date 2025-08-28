import { Router } from "express";
import ServiceController from "../controllers/servicesController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

const serviceRoutes = Router();

// Rutas
serviceRoutes.post(
  "/",
  verifyToken,
  authorizeRoles(1, 2),
  ServiceController.createService
);
serviceRoutes.get("/", ServiceController.getAllServices);
serviceRoutes.get("/:servicio_id", ServiceController.getServiceById);
serviceRoutes.get("/tienda/:tienda_id", verifyToken, authorizeRoles(1,4), ServiceController.getServicesByStore);
serviceRoutes.put(
  "/:servicio_id",
  verifyToken,
  authorizeRoles(1, 2),
  ServiceController.updateService
);
serviceRoutes.delete(
  "/:servicio_id",
  verifyToken,
  authorizeRoles(1, 2),
  ServiceController.deleteService
);

export default serviceRoutes;
