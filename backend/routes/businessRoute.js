import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import BusinessController from "../controllers/businessController.js";

const businessRoutes = Router();

// Crear nuevo negocio
businessRoutes.post('/', verifyToken, authorizeRoles(1,2), BusinessController.createBusiness);

// Obtener todos los negocios (con filtro opcional por estado)
businessRoutes.get('/', verifyToken, authorizeRoles(1,2), BusinessController.getAllBusiness);

// Obtener negocio por ID
businessRoutes.get('/:negocio_id', verifyToken, authorizeRoles(1,2), BusinessController.getBusinessById);

// Obtener negocio por correo
businessRoutes.get('/correo/:negocio_correo', verifyToken, authorizeRoles(1,2), BusinessController.getBusinessByEmail);

// Obtener tiendas de un negocio
businessRoutes.get('/:negocio_id/tiendas', verifyToken, authorizeRoles(1,2), BusinessController.getStoresByBusiness);

// Actualizar negocio
businessRoutes.put('/:negocio_id', verifyToken, authorizeRoles(1,2), BusinessController.updateBusiness);

// Cambiar estado del negocio
businessRoutes.put('/:negocio_id/estado', verifyToken, authorizeRoles(1,2), BusinessController.changeBusinessState);

// Desactivar negocio (soft delete)
businessRoutes.put('/desactivar/:negocio_id', verifyToken, authorizeRoles(1,2), BusinessController.deleteBusiness);

// Reactivar negocio
businessRoutes.put('/activar/:negocio_id', verifyToken, authorizeRoles(1,2), BusinessController.reactivateBusiness);

// Obtener estadísticas del negocio
businessRoutes.get('/:negocio_id/stats', verifyToken, authorizeRoles(1,2), BusinessController.getBusinessStats);

// Buscar negocios por nombre
businessRoutes.get('/buscar', verifyToken, authorizeRoles(1,2), BusinessController.searchBusinessByName);

// Obtener negocios por propietario
businessRoutes.get('/propietario/:propietario_id', verifyToken, authorizeRoles(1,2), BusinessController.getBusinessByOwner);

// Contar negocios por estado
businessRoutes.get('/count', verifyToken, authorizeRoles(1,2), BusinessController.countBusinessByState);

export default businessRoutes;