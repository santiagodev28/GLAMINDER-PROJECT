export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;

    console.log("🔐 authorizeRoles - Usuario:", user);
    console.log("🔐 authorizeRoles - Roles permitidos:", allowedRoles);
    console.log("🔐 authorizeRoles - Rol del usuario:", user?.rol);

    if (!user || !allowedRoles.includes(user.rol)) {
      console.log("❌ authorizeRoles - Acceso denegado");
      return res
        .status(403)
        .json({ error: "No tienes permiso para acceder a esta ruta" });
    }

    console.log("✅ authorizeRoles - Acceso permitido");
    next();
  };
};
