import { Router } from "express";
import AuthController from "../controllers/authController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { loginLimiter, registerLimiter, passwordResetLimiter } from "../middlewares/rateLimiter.js";

const authRoutes = Router();

// Iniciar sesión (con rate limiting)
authRoutes.post('/ingresar', loginLimiter, AuthController.userLogin);

// Registrar usuario (con rate limiting)
authRoutes.post('/registrar', registerLimiter, AuthController.userRegister);

// Verificar email
authRoutes.get('/verificar-email/:token', AuthController.verifyEmail);

// Reenviar token de verificación
authRoutes.post('/reenviar-verificacion', AuthController.resendVerificationEmail);

// Refresh token
authRoutes.post('/refresh-token', AuthController.refreshToken);

// Olvidé mi contraseña (con rate limiting)
authRoutes.post('/olvide-contrasena', passwordResetLimiter, AuthController.forgotPassword);

// Restablecer contraseña
authRoutes.post('/restablecer-contrasena/:token', AuthController.resetPassword);

// Cambiar contraseña (requiere autenticación)
authRoutes.put('/cambiar-contrasena/:usuario_id', verifyToken, AuthController.changePassword);

// Cerrar sesión (requiere autenticación)
authRoutes.post('/cerrar-sesion', verifyToken, AuthController.logout);

// Cerrar sesión en todos los dispositivos (requiere autenticación)
authRoutes.post('/cerrar-sesion-todos', verifyToken, AuthController.logoutAll);

// Obtener usuario con rol
authRoutes.get('/usuario/:usuario_id', AuthController.getUserWithRole);

export default authRoutes;