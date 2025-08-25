import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import RequestController from "../controllers/requestsController.js";

const requestRoutes = Router();

// ✅ RUTAS PARA ADMINISTRADORES
// Obtener todas las solicitudes (solo admins)
requestRoutes.get('/', verifyToken, authorizeRoles(1), RequestController.getAllRequests);

// Obtener estadísticas (solo admins)
requestRoutes.get('/stats', verifyToken, authorizeRoles(1), RequestController.getRequestsStats);

// Obtener solicitudes pendientes (solo admins)
requestRoutes.get('/pendientes', verifyToken, authorizeRoles(1), RequestController.getPendingRequests);

// Buscar solicitudes (solo admins)
requestRoutes.get('/buscar', verifyToken, authorizeRoles(1), RequestController.searchRequests);

// Obtener solicitud específica por ID (solo admins)
requestRoutes.get('/:id', verifyToken, authorizeRoles(1), RequestController.getRequestById);

// Aprobar solicitud (solo admins)
requestRoutes.put('/aprobar/:id', verifyToken, authorizeRoles(1), RequestController.approveRequest);

// Rechazar solicitud (solo admins)
requestRoutes.put('/rechazar/:id', verifyToken, authorizeRoles(1), RequestController.rejectRequest);

//  RUTAS PARA USUARIOS
requestRoutes.get('/usuario/mis-solicitudes', verifyToken, RequestController.getRequestByUser);

requestRoutes.post('/crear', verifyToken, authorizeRoles(4), RequestController.createRequest);

export default requestRoutes;