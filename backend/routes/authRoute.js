import { Router } from "express";
import AuthController from "../controllers/authController.js";


const authRoutes = Router();

// Iniciar sesión
authRoutes.post('/ingresar', AuthController.userLogin);

// Registrar usuario
authRoutes.post('/registrar', AuthController.userRegister);

// Olvidé mi contraseña
authRoutes.post('/olvide-contrasena', AuthController.forgotPassword);

// Restablecer contraseña
authRoutes.post('/restablecer-contrasena/:token', AuthController.resetPassword);

// Cambiar contraseña
authRoutes.put('/cambiar-contrasena/:usuario_id', AuthController.changePassword);

// Obtener usuario con rol
authRoutes.get('/usuario/:usuario_id', AuthController.getUserWithRole);


export default authRoutes;