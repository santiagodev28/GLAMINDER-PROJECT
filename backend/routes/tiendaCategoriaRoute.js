import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import TiendaCategoriaController from "../controllers/tiendaCategoriaController.js";

const tiendaCategoriaRoutes = Router();

// Rutas públicas (para obtener categorías)
tiendaCategoriaRoutes.get("/", TiendaCategoriaController.getAllCategories);
tiendaCategoriaRoutes.get(
  "/:categoria_id",
  TiendaCategoriaController.getCategoryById
);

// Rutas protegidas (solo administradores)
tiendaCategoriaRoutes.post(
  "/",
  verifyToken,
  authorizeRoles(1),
  TiendaCategoriaController.createCategory
);
tiendaCategoriaRoutes.put(
  "/:categoria_id",
  verifyToken,
  authorizeRoles(1),
  TiendaCategoriaController.updateCategory
);
tiendaCategoriaRoutes.delete(
  "/:categoria_id",
  verifyToken,
  authorizeRoles(1),
  TiendaCategoriaController.deactivateCategory
);

export default tiendaCategoriaRoutes;
