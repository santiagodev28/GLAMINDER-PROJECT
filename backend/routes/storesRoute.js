import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import StoresController from "../controllers/storesController.js";

const storeRoutes = Router();

// Rutas
storeRoutes.get("/", StoresController.getAllStores);
storeRoutes.get("/:tienda_id/empleados", StoresController.getEmployeesByStore);
storeRoutes.get("/:tienda_id/stats", StoresController.getStoreStats);
storeRoutes.get("/:negocio_id", StoresController.getStoreByBusiness);
storeRoutes.post(
  "/",
  verifyToken,
  authorizeRoles(1, 2),
  StoresController.createStore
);
storeRoutes.put(
  "/:tienda_id",
  verifyToken,
  authorizeRoles(1, 2),
  StoresController.updateStore
);
storeRoutes.delete(
  "/:tienda_id",
  verifyToken,
  authorizeRoles(1, 2),
  StoresController.deleteStore
);

export default storeRoutes;
