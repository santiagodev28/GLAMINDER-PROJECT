import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  console.log("🔐 verifyToken - Headers:", req.headers);
  console.log(
    "🔐 verifyToken - Authorization header:",
    req.headers["authorization"]
  );

  const token = req.headers["authorization"]?.split(" ")[1]; // Espera formato: Bearer <token>
  console.log(
    "🔐 verifyToken - Token extraído:",
    token ? "Token presente" : "No hay token"
  );

  if (!token) {
    console.log("❌ verifyToken - Token no proporcionado");
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔐 verifyToken - Token decodificado:", decoded);
    req.user = decoded; // Datos del token
    next();
  } catch (error) {
    console.log("❌ verifyToken - Error al verificar token:", error.message);
    return res.status(403).json({ error: "Token inválido o expirado" });
  }
};
