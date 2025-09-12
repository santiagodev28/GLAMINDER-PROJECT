// Middleware para autorizar que un usuario edite su propio perfil o que tenga roles específicos
export const authorizeSelfOrRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const user = req.user; // Usuario autenticado
      const { usuario_id } = req.params; // ID del usuario a editar

      // Verificar si el usuario está editando su propio perfil
      if (user.usuario_id === parseInt(usuario_id)) {
        return next(); // Permitir editar su propio perfil
      }

      // Si no es su propio perfil, verificar si tiene los roles permitidos
      if (allowedRoles.includes(user.rol_id)) {
        return next(); // Permitir si tiene el rol adecuado
      }

      // Si no cumple ninguna condición, denegar acceso
      return res.status(403).json({
        error: "No tienes permisos para realizar esta acción",
      });
    } catch (error) {
      console.error("Error en authorizeSelfOrRoles:", error);
      return res.status(500).json({
        error: "Error interno del servidor",
      });
    }
  };
};
