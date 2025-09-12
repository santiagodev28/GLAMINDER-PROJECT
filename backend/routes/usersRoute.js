import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import { authorizeSelfOrRoles } from "../middlewares/authorizeSelfOrRoles.js";
import UserController from "../controllers/userController.js";

const userRoutes = Router();

// Obtener todos los usuarios
userRoutes.get("/", verifyToken, authorizeRoles(1), UserController.getAllUsers);

// Obtener usuario por ID (permitir que los usuarios obtengan su propia información o que admins/propietarios/empleados obtengan otras)
userRoutes.get(
  "/:usuario_id",
  verifyToken,
  authorizeSelfOrRoles(1, 2, 3),
  UserController.getUserById
);

// Obtener usuario por correo
userRoutes.get(
  "/correo/:usuario_correo",
  verifyToken,
  authorizeRoles(1, 2),
  UserController.getUserByEmail
);

// Crear usuario
userRoutes.post("/", verifyToken, authorizeRoles(1), UserController.createUser);

// Actualizar usuario (permitir que los usuarios editen su propio perfil o que admins/propietarios editen otros)
userRoutes.put(
  "/:usuario_id",
  verifyToken,
  authorizeSelfOrRoles(1, 2),
  UserController.updateUser
);

// Actualizar rol del usuario
userRoutes.put(
  "/:usuario_id/rol",
  verifyToken,
  authorizeRoles(1),
  UserController.updateUserRole
);

// Resetear cambio de rol
userRoutes.put(
  "/:usuario_id/reset-rol",
  verifyToken,
  authorizeRoles(1),
  UserController.resetChangeRole
);

// Eliminar usuario (soft delete)
userRoutes.put(
  "/desactivar/:usuario_id",
  verifyToken,
  authorizeRoles(1),
  UserController.deleteUser
);

// Activar usuario
userRoutes.put(
  "/activar/:usuario_id",
  verifyToken,
  authorizeRoles(1),
  UserController.activateUser
);

// Actualizar campo rol_cambiado
userRoutes.put(
  "/rolCambiado/:usuario_id",
  verifyToken,
  UserController.updateRoleChange
);

// Contar usuarios por estado
userRoutes.get(
  "/count",
  verifyToken,
  authorizeRoles(1),
  UserController.countUsersByStatus
);

export default userRoutes;
