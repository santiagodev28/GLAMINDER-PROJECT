import { Router } from "express";
import AuthController from "../controllers/authController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { loginLimiter, registerLimiter, passwordResetLimiter } from "../middlewares/rateLimiter.js";

const authRoutes = Router();

// Iniciar sesión
authRoutes.post('/ingresar', loginLimiter, AuthController.userLogin);

// Registrar usuario
authRoutes.post('/registrar', registerLimiter, AuthController.userRegister);

// Cambiar contraseña
authRoutes.put('/cambiar-contrasena/:usuario_id', verifyToken, AuthController.changePassword);

// Obtener usuario con rol
authRoutes.get('/usuario/:usuario_id', AuthController.getUserWithRole);

export default authRoutes;
