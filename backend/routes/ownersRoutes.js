import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import OwnerController from "../controllers/ownersController.js";

const ownerRoutes = Router();

// Rutas
ownerRoutes.get('/', OwnerController.getAllOwners);
ownerRoutes.get('/:propietario_id', verifyToken,authorizeRoles(1), OwnerController.getOwnerById);
ownerRoutes.delete('/:propietario_id', OwnerController.deleteOwner);

export default ownerRoutes