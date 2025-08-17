import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import RequestController from "../controllers/requestsController.js";

const requestRoutes = Router()

requestRoutes.get('/', verifyToken, authorizeRoles(1), RequestController.getAllRequests)
requestRoutes.get('/usuario/:id', verifyToken, authorizeRoles(1), RequestController.getRequestByUser)
requestRoutes.post('/crear', verifyToken, authorizeRoles(1), RequestController.createRequest)
requestRoutes.put('/aprobar/:id', verifyToken, authorizeRoles(1), RequestController.approveRequest)
requestRoutes.put('/rechazar/:id', verifyToken, authorizeRoles(1), RequestController.rejectRequest)


export default requestRoutes 