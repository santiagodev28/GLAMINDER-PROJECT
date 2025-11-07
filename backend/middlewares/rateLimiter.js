import rateLimit from 'express-rate-limit';

// Rate limiter general para API
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP en 15 minutos
  message: 'Demasiadas solicitudes desde esta IP, por favor intenta de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter estricto para login
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 3, // máximo 3 intentos de login por IP en 15 minutos
  message: 'Demasiados intentos de inicio de sesión. Por favor intenta de nuevo en 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // No contar requests exitosos
  handler: (req, res) => {
    res.status(429).json({
      message: 'Demasiados intentos de inicio de sesión. Por favor intenta de nuevo en 15 minutos.',
      retryAfter: Math.ceil(15 * 60), // segundos
    });
  },
});

// Rate limiter para registro
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // máximo 3 registros por IP en 1 hora
  message: 'Demasiados intentos de registro, por favor intenta de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter para recuperación de contraseña
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // máximo 3 solicitudes por IP en 1 hora
  message: 'Demasiadas solicitudes de recuperación de contraseña, por favor intenta de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

