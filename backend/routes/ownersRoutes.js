import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import OwnerController from "../controllers/ownersController.js";

const ownerRoutes = Router();

// Obtener todos los propietarios (con filtros)
ownerRoutes.get('/', verifyToken, authorizeRoles(1,2), OwnerController.getAllOwners);

// Obtener propietario por ID
ownerRoutes.get('/:propietario_id', verifyToken, authorizeRoles(1,2), OwnerController.getOwnerById);

// Obtener propietario por usuario_id
ownerRoutes.get('/usuario/:usuario_id', verifyToken, authorizeRoles(1,2), OwnerController.getOwnerByUserId);

// Crear nuevo propietario
ownerRoutes.post('/', verifyToken, authorizeRoles(1,2), OwnerController.createOwner);

// Actualizar propietario
ownerRoutes.put('/:propietario_id', verifyToken, authorizeRoles(1,2), OwnerController.updateOwner);

// Cambiar estado del propietario
ownerRoutes.put('/:propietario_id/estado', verifyToken, authorizeRoles(1,2), OwnerController.changeOwnerState);

// Eliminar propietario (soft delete)
ownerRoutes.delete('/:propietario_id', verifyToken, authorizeRoles(1,2), OwnerController.deleteOwner);

// Reactivar propietario
ownerRoutes.put('/activar/:propietario_id', verifyToken, authorizeRoles(1,2), OwnerController.reactivateOwner);

// Obtener negocios del propietario
ownerRoutes.get('/:propietario_id/negocios', verifyToken, authorizeRoles(1,2), OwnerController.getOwnerBusinesses);

// Obtener estadísticas del propietario
ownerRoutes.get('/:propietario_id/stats', verifyToken, authorizeRoles(1,2), OwnerController.getOwnerStats);

// Contar propietarios por estado
ownerRoutes.get('/count', verifyToken, authorizeRoles(1,2), OwnerController.countOwnersByState);


export default ownerRoutes;