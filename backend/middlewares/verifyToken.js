import jwt from "jsonwebtoken";
import TokenBlacklist from "../models/TokenBlacklist.js";

export const verifyToken = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Espera formato: Bearer <token>

  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  try {
    // Verificar el token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verificar que no esté en la blacklist
    if (decoded.jti) {
      const isBlacklisted = await TokenBlacklist.isTokenBlacklisted(decoded.jti);
      if (isBlacklisted) {
        return res.status(401).json({ error: "Token ha sido invalidado" });
      }
    }

    // Verificar que sea un access token
    if (decoded.type && decoded.type !== 'access') {
      return res.status(401).json({ error: "Tipo de token inválido" });
    }

    req.user = decoded; // Datos del token
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token expirado" });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: "Token inválido" });
    }
    return res.status(403).json({ error: "Error al verificar token" });
  }
};
