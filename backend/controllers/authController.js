import Auth from "../models/Auth.js";
import RefreshToken from "../models/RefreshToken.js";
import TokenBlacklist from "../models/TokenBlacklist.js";
import Audit from "../models/Audit.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

class AuthController {
  // LOGIN SIN EMAIL VERIFICADO
  static async userLogin(req, res) {
    const { usuario_correo, usuario_contrasena } = req.body;
    const ip_address = req.ip || req.connection.remoteAddress;
    const user_agent = req.get("user-agent");

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

      // NO MÁS VALIDACIÓN DE EMAIL VERIFICADO

      const accessJti = uuidv4();
      const accessToken = jwt.sign(
        {
          usuario_id: user.usuario_id,
          rol: user.rol_id,
          jti: accessJti,
          type: "access",
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      const refreshJti = uuidv4();
      const refreshToken = jwt.sign(
        {
          usuario_id: user.usuario_id,
          rol: user.rol_id,
          jti: refreshJti,
          type: "refresh",
        },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
      );

      // Guardar refresh token
      const refreshExpires = new Date();
      refreshExpires.setDate(refreshExpires.getDate() + 7);

      await RefreshToken.saveToken({
        usuario_id: user.usuario_id,
        token: refreshToken,
        jti: refreshJti,
        fecha_expiracion: refreshExpires,
        ip_address,
        user_agent,
      });

      return res.status(200).json({
        message: "Inicio de sesión exitoso.",
        accessToken,
        refreshToken,
        usuario: user,
      });
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      return res.status(500).json({ message: "Error al iniciar sesión." });
    }
  }

  // REGISTRO SIN EMAIL VERIFICACIÓN
  static async userRegister(req, res) {
    try {
      const result = await Auth.createUser({
        ...req.body,
        ip_address: req.ip,
        user_agent: req.get("user-agent"),
      });

      return res.status(201).json({
        message: "Usuario registrado exitosamente.",
        data: result.data,
      });
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      return res.status(500).json({ message: error.message });
    }
  }

  // Cambio de contraseña SIN EMAIL
  static async changePassword(req, res) {
    try {
      const { usuario_id } = req.params;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
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
      res.status(500).json({ message: error.message });
    }
  }

  static async getUserWithRole(req, res) {
    try {
      const user = await Auth.getUserWithRole(req.params.usuario_id);
      if (!user)
        return res.status(404).json({ message: "Usuario no encontrado" });

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener usuario" });
    }
  }
}

export default AuthController;
