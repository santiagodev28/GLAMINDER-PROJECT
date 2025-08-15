import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import RequestController from "../controllers/requestsController.js";

const requestRoutes = Router()

requestRoutes.post('/', verifyToken, authorizeRoles(4), RequestController.createRequest)

export default requestRoutes