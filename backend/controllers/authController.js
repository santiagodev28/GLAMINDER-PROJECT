import Auth from "../models/Auth.js";
import crypto from "crypto";
import { sendResetEmail } from "../utils/emailService.js";
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

  static async forgotPassword(req, res) {
    try {
      console.log('[forgotPassword] Iniciando proceso de recuperación');
      const { usuario_correo } = req.body;
      console.log(`[forgotPassword] Correo recibido: ${usuario_correo}`);
      
      const user = await Auth.findUserByEmail(usuario_correo);
      console.log(`[forgotPassword] Usuario encontrado: ${user ? 'Sí (ID: ' + user.usuario_id + ')' : 'No'}`);

      // Mensaje genérico, no revelar si existe o no
      const genericResponse = {
        message:
          "Si el correo está registrado, te enviaremos un enlace para restablecer la contraseña.",
      };

      if (!user) {
        console.log('[forgotPassword] Usuario no encontrado, retornando respuesta genérica');
        // Siempre 200 para evitar enumeración
        return res.json(genericResponse);
      }

      const token = crypto.randomBytes(32).toString("hex");
      console.log(`[forgotPassword] Token generado (primeros 8 chars): ${token.substring(0, 8)}...`);
      
      await Auth.saveResetToken(user.usuario_id, token);
      console.log('[forgotPassword] Token guardado en BD');

      // Usa tu URL de frontend y la ruta que ya mapeaste (/restablecer-contrasena/:token)
      const appBase = process.env.APP_BASE_URL || "http://localhost:5173";
      const resetURL = `${appBase}/restablecer-contrasena/${token}`;
      console.log(`[forgotPassword] URL de reset generada: ${resetURL}`);

      // Enviar correo (si tienes EMAIL_USER/EMAIL_PASS configurados)
      try {
        console.log('[forgotPassword] Intentando enviar correo...');
        await sendResetEmail(usuario_correo, resetURL);
        console.log('[forgotPassword] Correo enviado exitosamente');
      } catch (mailErr) {
        // En desarrollo, puedes loguear el enlace si no hay SMTP
        console.log(`[DEV] ⚠️ No se pudo enviar correo (${mailErr.message})`);
        console.log(`[DEV] 🔗 Enlace reset para ${usuario_correo}:`);
        console.log(`[DEV] ${resetURL}`);
      }

      console.log('[forgotPassword] Retornando respuesta exitosa');
      return res.json(genericResponse);
    } catch (error) {
      console.error("[forgotPassword] ❌ ERROR:", error.message);
      console.error(error.stack);
      res.status(500).json({ message: "Error al iniciar restablecimiento de contraseña." });
    }
  }

  static async resetPassword(req, res) {
    const { token } = req.params;
    const { newPassword, confirmNewPassword } = req.body;

    console.log(`[resetPassword] Token recibido (primeros 8 chars): ${token.substring(0, 8)}...`);
    console.log(`[resetPassword] Contraseñas coinciden: ${newPassword === confirmNewPassword}`);

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Las contraseñas no coinciden." });
    }
    try {
      const user = await Auth.findByToken(token);
      if (!user) {
        console.log('[resetPassword] Token inválido o expirado');
        // Mantener 400/404 cuando el token no sirve
        return res.status(400).json({ message: "Token inválido o expirado." });
      }
      console.log(`[resetPassword] Usuario encontrado: ${user.usuario_id}`);
      await Auth.updatePassword(user.usuario_id, newPassword);
      console.log('[resetPassword] Contraseña actualizada exitosamente');
      res.json({ message: "Contraseña restablecida exitosamente." });
    } catch (error) {
      console.error("[resetPassword] ❌ ERROR:", error.message);
      console.error(error.stack);
      res.status(500).json({ message: "Error al restablecer contraseña." });
    }
  }
}

export default AuthController;
