import { Router } from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';
import UserController from '../controllers/userController.js';



const userRoutes = Router();
// Rutas
userRoutes.get('/', verifyToken, authorizeRoles(1), UserController.getAllUsers);
userRoutes.get('/:usuario_id', verifyToken, authorizeRoles(1), UserController.getUserById);
userRoutes.put('/:usuario_id',  verifyToken, authorizeRoles(1), UserController.updateUser);
userRoutes.put('/desactivar/:usuario_id', verifyToken, authorizeRoles(1), UserController.deleteUser);

export default userRoutes;