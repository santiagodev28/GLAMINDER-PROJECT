import { Router } from "express";
import ServicioCategoriaController from "../controllers/servicioCategoriaController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

const servicioCategoriaRoutes = Router();

// Obtener todas las categorías
servicioCategoriaRoutes.get(
  "/",
  verifyToken,
  authorizeRoles(1, 2, 4),
  ServicioCategoriaController.getAllCategories
);

// Obtener categoría por ID
servicioCategoriaRoutes.get(
  "/:categoria_id",
  verifyToken,
  authorizeRoles(1, 2, 4),
  ServicioCategoriaController.getCategoryById
);

// Crear nueva categoría (solo admin y propietarios)
servicioCategoriaRoutes.post(
  "/",
  verifyToken,
  authorizeRoles(1, 2),
  ServicioCategoriaController.createCategory
);

// Actualizar categoría (solo admin y propietarios)
servicioCategoriaRoutes.put(
  "/:categoria_id",
  verifyToken,
  authorizeRoles(1, 2),
  ServicioCategoriaController.updateCategory
);

// Eliminar categoría (solo admin y propietarios)
servicioCategoriaRoutes.delete(
  "/:categoria_id",
  verifyToken,
  authorizeRoles(1, 2),
  ServicioCategoriaController.deleteCategory
);

// Obtener categorías disponibles para una tienda específica
servicioCategoriaRoutes.get(
  "/tienda/:tienda_id",
  verifyToken,
  authorizeRoles(1, 2, 4),
  ServicioCategoriaController.getCategoriesByStore
);

// Asignar categoría a tienda (solo admin y propietarios)
servicioCategoriaRoutes.post(
  "/tienda/:tienda_id/categoria/:categoria_id",
  verifyToken,
  authorizeRoles(1, 2),
  ServicioCategoriaController.assignCategoryToStore
);

// Desasignar categoría de tienda (solo admin y propietarios)
servicioCategoriaRoutes.delete(
  "/tienda/:tienda_id/categoria/:categoria_id",
  verifyToken,
  authorizeRoles(1, 2),
  ServicioCategoriaController.unassignCategoryFromStore
);

export default servicioCategoriaRoutes;
