import { Router } from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';
import UserController from '../controllers/userController.js';



const userRoutes = Router();
// Rutas
userRoutes.put('/rolCambiado/:usuario_id', verifyToken, authorizeRoles(1,2,4), UserController.changeRole);
userRoutes.put('/desactivar/:usuario_id', verifyToken, authorizeRoles(1), UserController.deleteUser);

userRoutes.get('/', verifyToken, authorizeRoles(1), UserController.getAllUsers);
userRoutes.get('/:usuario_id', verifyToken, authorizeRoles(1,2), UserController.getUserById);
userRoutes.put('/:usuario_id',  verifyToken, authorizeRoles(1,2), UserController.updateUser);

export default userRoutes;