import Auth from "../models/Auth.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Controlador de autenticación
class AuthController {
  static async userLogin(req, res) {
    const { usuario_correo, usuario_contrasena } = req.body;

    if (!usuario_correo || !usuario_contrasena) {
      return res
        .status(400)
        .json({ message: "Por favor completa los campos." });
    }

    try {
      const result = await Auth.verifyCredentials(
        usuario_correo,
        usuario_contrasena
      );

      if (!result.success) {
        return res.status(401).json({ message: result.message });
      }

      const user = result.user;
      const token = jwt.sign(
        { usuario_id: user.usuario_id, rol: user.rol_id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        message: "Inicio de sesión exitoso.",
        token,
        usuario: user,
      });
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      return res.status(500).json({ message: "Error al iniciar sesión." });
    }
  }

  static async userRegister(req, res) {
    try {
      const {
        usuario_nombre,
        usuario_apellido,
        usuario_correo,
        usuario_contrasena,
        usuario_telefono,
        rol_id,
        tienda_id,
        empleado_especialidad,
      } = req.body;

      // Validar campos obligatorios
      if (
        !usuario_nombre ||
        !usuario_apellido ||
        !usuario_correo ||
        !usuario_contrasena ||
        !usuario_telefono
      ) {
        return res.status(400).json({
          message: "Por favor completa todos los campos.",
        });
      }

      // Crear el usuario
      const result = await Auth.createUser({
        usuario_nombre,
        usuario_apellido,
        usuario_correo,
        usuario_contrasena,
        usuario_telefono,
        rol_id,
        tienda_id,
        empleado_especialidad,
      });

      res.status(201).json({
        message: "Usuario registrado exitosamente.",
        data: result.data,
      });
    } catch (error) {
      if (error.message.includes("registrado")) {
        return res.status(400).json({ message: error.message });
      }
      console.error("Error al registrar el usuario:", error.message);
      return res
        .status(500)
        .json({ message: "Error al registrar el usuario." });
    }
  }

  static async changePassword(req, res) {
    try {
      const { usuario_id } = req.params;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res
          .status(400)
          .json({
            message: "Debes proporcionar la contraseña actual y la nueva.",
          });
      }

      const result = await Auth.changePassword(
        usuario_id,
        currentPassword,
        newPassword
      );
      res.json({ message: result.message });
    } catch (error) {
      if (
        error.message === "Usuario no encontrado" ||
        error.message === "Contraseña actual incorrecta"
      ) {
        return res.status(400).json({ message: error.message });
      }
      console.error("Error al cambiar contraseña:", error.message);
      res.status(500).json({ message: "Error al cambiar contraseña." });
    }
  }

  static async getUserWithRole(req, res) {
    try {
      const { usuario_id } = req.params;
      const user = await Auth.getUserWithRole(usuario_id);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado." });
      }
      res.json(user);
    } catch (error) {
      console.error("Error al obtener usuario:", error.message);
      res.status(500).json({ message: "Error al obtener usuario." });
    }
  }
}

export default AuthController;
