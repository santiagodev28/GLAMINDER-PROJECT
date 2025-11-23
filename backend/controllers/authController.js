import Auth from "../models/Auth.js";
import RefreshToken from "../models/RefreshToken.js";
import TokenBlacklist from "../models/TokenBlacklist.js";
import Audit from "../models/Audit.js";
import crypto from "crypto";
import { sendResetEmail, sendVerificationEmail, sendPasswordChangeEmail } from "../utils/emailService.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

// Controlador de autenticación
class AuthController {
  static async userLogin(req, res) {
    const { usuario_correo, usuario_contrasena } = req.body;
    const ip_address = req.ip || req.connection.remoteAddress;
    const user_agent = req.get('user-agent');

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
        // Intentar obtener el usuario_id si el email existe (para auditoría)
        let usuario_id_audit = null;
        try {
          const userByEmail = await Auth.findUserByEmail(usuario_correo);
          if (userByEmail) {
            usuario_id_audit = userByEmail.usuario_id;
          }
        } catch (err) {
          // Si no se puede obtener, usar null
          console.log('[userLogin] No se pudo obtener usuario_id para auditoría');
        }

        // Registrar intento fallido de login
        try {
          await Audit.logAction({
            usuario_id: usuario_id_audit,
            accion: 'LOGIN_FAILED',
            tabla_afectada: 'usuarios',
            registro_id: usuario_id_audit,
            datos_nuevos: {
              intento_email: usuario_correo,
              razon: result.message || 'Credenciales incorrectas'
            },
            ip_address,
            user_agent,
          });
        } catch (auditError) {
          console.error('Error al registrar auditoría:', auditError.message || auditError);
        }
        return res.status(401).json({ message: result.message });
      }

      const user = result.user;

      // Verificar si el email está verificado
      if (!user.email_verificado) {
        // Registrar intento de login con email no verificado
        try {
          await Audit.logAction({
            usuario_id: user.usuario_id,
            accion: 'LOGIN_FAILED',
            tabla_afectada: 'usuarios',
            registro_id: user.usuario_id,
            datos_nuevos: {
              razon: 'Email no verificado'
            },
            ip_address,
            user_agent,
          });
        } catch (auditError) {
          console.error('Error al registrar auditoría:', auditError.message || auditError);
        }
        return res.status(403).json({ 
          message: "Por favor verifica tu correo electrónico antes de iniciar sesión.",
          email_verificado: false
        });
      }

      // Generar JTI único para el access token
      const accessJti = uuidv4();
      const accessToken = jwt.sign(
        { 
          usuario_id: user.usuario_id, 
          rol: user.rol_id,
          jti: accessJti,
          type: 'access'
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Generar refresh token
      const refreshJti = uuidv4();
      const refreshToken = jwt.sign(
        {
          usuario_id: user.usuario_id,
          rol: user.rol_id,
          jti: refreshJti,
          type: 'refresh'
        },
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Guardar refresh token en BD
      const refreshExpires = new Date();
      refreshExpires.setDate(refreshExpires.getDate() + 7); // 7 días

      await RefreshToken.saveToken({
        usuario_id: user.usuario_id,
        token: refreshToken,
        jti: refreshJti,
        fecha_expiracion: refreshExpires,
        ip_address,
        user_agent,
      });

      // Registrar login exitoso en auditoría
      try {
        await Audit.logAction({
          usuario_id: user.usuario_id,
          accion: 'LOGIN',
          tabla_afectada: 'usuarios',
          registro_id: user.usuario_id,
          ip_address,
          user_agent,
        });
      } catch (auditError) {
        console.error('Error al registrar auditoría:', auditError);
      }

      res.status(200).json({
        message: "Inicio de sesión exitoso.",
        accessToken,
        refreshToken,
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
      acepta_terminos,
    } = req.body;

    const ip_address = req.ip || req.connection.remoteAddress;
    const user_agent = req.get('user-agent');

    // Validar campos obligatorios
    if (!usuario_nombre || !usuario_apellido || !usuario_correo || !usuario_contrasena || !usuario_telefono) {
      return res.status(400).json({ message: "Por favor completa todos los campos." });
    }

    // Validar aceptación de términos
    if (!acepta_terminos) {
      return res.status(400).json({ message: "Debes aceptar los términos y condiciones para registrarte." });
    }

    // Crear usuario
    const result = await Auth.createUser({
      usuario_nombre,
      usuario_apellido,
      usuario_correo,
      usuario_contrasena,
      usuario_telefono,
      rol_id,
      tienda_id,
      empleado_especialidad,
      acepta_terminos,
      ip_address,
      user_agent,
    });

    // ⚡ Protección contra token undefined
    const rawToken = result?.data?.emailVerificationToken || null;
    const userId = result?.data?.userId || null;

    const appBase = process.env.FRONTEND_URL || "http://localhost:5173";
    const encodedToken = rawToken ? encodeURIComponent(rawToken) : null;
    const verificationURL = encodedToken ? `${appBase}/verificar-email/${encodedToken}` : null;

    console.log(`[userRegister] Token generado: ${rawToken ? rawToken.substring(0,8) : 'null'}`);
    console.log(`[userRegister] URL de verificación: ${verificationURL || 'null'}`);

    // Enviar correo (no rompe si falla)
    if (rawToken) {
      try {
        await sendVerificationEmail(result.data.usuario_correo, verificationURL, result.data.usuario_nombre);
        console.log(`[userRegister] Correo de verificación enviado a ${result.data.usuario_correo}`);
      } catch (mailErr) {
        console.warn(`[userRegister] ⚠️ No se pudo enviar correo: ${mailErr.message}`);
        console.log(`[userRegister] Link de verificación: ${verificationURL}`);
      }
    }

    // Auditoría segura
    if (userId) {
      try {
        await Audit.logAction({
          usuario_id: userId,
          accion: 'CREATE',
          tabla_afectada: 'usuarios',
          registro_id: userId,
          datos_nuevos: { usuario_nombre, usuario_apellido, usuario_correo, rol_id: rol_id || 4 },
          ip_address,
          user_agent,
        });
      } catch (auditError) {
        console.warn('Error al registrar auditoría:', auditError);
      }
    }

    res.status(201).json({
      message: "Usuario registrado exitosamente. Por favor verifica tu correo electrónico.",
      data: {
        ...result.data,
        emailVerificationToken: undefined,
      },
    });

  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    if (error.message.includes("registrado")) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Error al registrar el usuario." });
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

      // Obtener información del usuario para enviar email
      try {
        const user = await Auth.getUserWithRole(usuario_id);
        if (user && user.usuario_correo) {
          const nombreCompleto = `${user.usuario_nombre || ''} ${user.usuario_apellido || ''}`.trim() || 'Usuario';
          await sendPasswordChangeEmail(
            user.usuario_correo,
            nombreCompleto,
            req.ip || req.connection.remoteAddress,
            req.get('user-agent')
          );
        }
      } catch (emailError) {
        console.error('Error al enviar correo de cambio de contraseña:', emailError);
        // No fallar la operación si el email falla
      }

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
      // Codificar el token para la URL
      const encodedToken = encodeURIComponent(token);
      const resetURL = `${appBase}/restablecer-contrasena/${encodedToken}`;
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
    let { token } = req.params;
    const { newPassword, confirmNewPassword } = req.body;

    // Decodificar el token si viene codificado en la URL
    try {
      token = decodeURIComponent(token);
    } catch (error) {
      console.log('[resetPassword] Token ya decodificado o error al decodificar');
    }

    console.log(`[resetPassword] Token recibido (primeros 8 chars): ${token ? token.substring(0, 8) : 'null'}...`);
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

      // Registrar cambio de contraseña en auditoría
      try {
        await Audit.logAction({
          usuario_id: user.usuario_id,
          accion: 'PASSWORD_RESET',
          tabla_afectada: 'usuarios',
          registro_id: user.usuario_id,
          ip_address: req.ip || req.connection.remoteAddress,
          user_agent: req.get('user-agent'),
        });
      } catch (auditError) {
        console.error('Error al registrar auditoría:', auditError);
      }

      // Enviar correo de confirmación de cambio de contraseña
      try {
        if (user.usuario_correo) {
          const nombreCompleto = `${user.usuario_nombre || ''} ${user.usuario_apellido || ''}`.trim() || 'Usuario';
          await sendPasswordChangeEmail(
            user.usuario_correo,
            nombreCompleto,
            req.ip || req.connection.remoteAddress,
            req.get('user-agent')
          );
        }
      } catch (emailError) {
        console.error('Error al enviar correo de cambio de contraseña:', emailError);
        // No fallar la operación si el email falla
      }

      res.json({ message: "Contraseña restablecida exitosamente." });
    } catch (error) {
      console.error("[resetPassword] ❌ ERROR:", error.message);
      console.error(error.stack);
      res.status(500).json({ message: "Error al restablecer contraseña." });
    }
  }

  // Verificar email con token
  static async verifyEmail(req, res) {
    let { token } = req.params;

    console.log(`[verifyEmail] ========== INICIO VERIFICACIÓN ==========`);
    console.log(`[verifyEmail] Token recibido (primeros 16 chars): ${token ? token.substring(0, 16) : 'null'}...`);

    // Validar que el token existe
    if (!token || token.trim() === '') {
      console.log('[verifyEmail] ❌ Token vacío o no proporcionado');
      return res.status(400).json({ message: "Token de verificación no proporcionado." });
    }

    try {
      // Express NO decodifica automáticamente los parámetros de URL
      // Debemos decodificarlo manualmente
      let decodedToken = token;
      try {
        decodedToken = decodeURIComponent(token);
        console.log(`[verifyEmail] Token decodificado (primeros 16 chars): ${decodedToken.substring(0, 16)}...`);
      } catch (decodeError) {
        console.log('[verifyEmail] Token no requiere decodificación o ya está decodificado');
      }

      // Limpiar espacios en blanco
      const cleanToken = decodedToken.trim();
      console.log(`[verifyEmail] Token limpio (longitud): ${cleanToken.length} caracteres`);

      const result = await Auth.verifyEmail(cleanToken);

      if (!result.success) {
        console.log(`[verifyEmail] ❌ Verificación fallida: ${result.message}`);
        return res.status(400).json({ message: result.message });
      }

      console.log(`[verifyEmail] ✅ Verificación exitosa: ${result.message}`);
      console.log(`[verifyEmail] ========== FIN VERIFICACIÓN ==========`);
      res.json({ message: result.message });
    } catch (error) {
      console.error("[verifyEmail] ❌ Error inesperado:", error.message);
      console.error(error.stack);
      res.status(500).json({ message: "Error al verificar email." });
    }
  }

  // Reenviar token de verificación
  static async resendVerificationEmail(req, res) {
    const { usuario_correo } = req.body;

    if (!usuario_correo) {
      return res.status(400).json({ message: "Correo electrónico requerido." });
    }

    try {
      const result = await Auth.resendVerificationToken(usuario_correo);

      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      // Enviar correo
      const appBase = process.env.APP_BASE_URL || "http://localhost:5173";
      // Codificar el token para la URL
      const encodedToken = encodeURIComponent(result.emailVerificationToken);
      const verificationURL = `${appBase}/verificar-email/${encodedToken}`;

      try {
        const user = await Auth.findUserByEmail(usuario_correo);
        await sendVerificationEmail(
          usuario_correo,
          verificationURL,
          user.usuario_nombre
        );
      } catch (mailErr) {
        console.log(`[DEV] ⚠️ No se pudo enviar correo (${mailErr.message})`);
        console.log(`[DEV] 🔗 Enlace de verificación: ${verificationURL}`);
      }

      res.json({ message: "Token de verificación reenviado. Por favor revisa tu correo." });
    } catch (error) {
      console.error("Error al reenviar token:", error.message);
      res.status(500).json({ message: "Error al reenviar token de verificación." });
    }
  }

  // Refresh access token
  static async refreshToken(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token requerido." });
    }

    try {
      // Verificar que el refresh token existe y es válido
      const storedToken = await RefreshToken.findByToken(refreshToken);

      if (!storedToken) {
        return res.status(401).json({ message: "Refresh token inválido o expirado." });
      }

      // Verificar el JWT
      let decoded;
      try {
        decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
      } catch (jwtError) {
        return res.status(401).json({ message: "Refresh token inválido." });
      }

      // Verificar que el JTI coincide
      if (decoded.jti !== storedToken.jti) {
        return res.status(401).json({ message: "Refresh token inválido." });
      }

      // Generar nuevo access token
      const accessJti = uuidv4();
      const newAccessToken = jwt.sign(
        {
          usuario_id: decoded.usuario_id,
          rol: decoded.rol,
          jti: accessJti,
          type: 'access'
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({
        accessToken: newAccessToken,
        message: "Token renovado exitosamente."
      });
    } catch (error) {
      console.error("Error al refrescar token:", error.message);
      res.status(500).json({ message: "Error al refrescar token." });
    }
  }

  // Cerrar sesión (invalidar tokens)
  static async logout(req, res) {
    const user = req.user; // Del middleware verifyToken
    const { refreshToken } = req.body;

    try {
      // Si se proporciona refresh token, revocarlo
      if (refreshToken) {
        try {
          await RefreshToken.revokeToken(refreshToken);
        } catch (error) {
          console.error('Error al revocar refresh token:', error);
          // No fallar el logout si esto falla
        }
      }

      // Si hay un token en el header, agregarlo a la blacklist
      const token = req.headers["authorization"]?.split(" ")[1];
      if (token && user && user.usuario_id) {
        try {
          // Verificar que el usuario existe antes de agregar a blacklist
          const userExists = await Auth.getUserWithRole(user.usuario_id);
          
          if (userExists) {
            const decoded = jwt.decode(token);
            if (decoded && decoded.jti) {
              const expiresAt = new Date(decoded.exp * 1000);
              await TokenBlacklist.addToken({
                token_jti: decoded.jti,
                usuario_id: user.usuario_id,
                token_type: 'access',
                fecha_expiracion: expiresAt,
              });
            }
          } else {
            console.log(`[logout] Usuario ${user.usuario_id} no existe, omitiendo blacklist`);
          }
        } catch (error) {
          console.error('Error al agregar token a blacklist:', error);
          // No fallar el logout si esto falla
        }
      }

      // Registrar logout en auditoría
      if (user && user.usuario_id) {
        try {
          // Verificar que el usuario existe antes de registrar auditoría
          const userExists = await Auth.getUserWithRole(user.usuario_id);
          
          if (userExists) {
            await Audit.logAction({
              usuario_id: user.usuario_id,
              accion: 'LOGOUT',
              tabla_afectada: 'usuarios',
              registro_id: user.usuario_id,
              ip_address: req.ip || req.connection.remoteAddress,
              user_agent: req.get('user-agent'),
            });
          } else {
            console.log(`[logout] Usuario ${user.usuario_id} no existe, omitiendo auditoría`);
          }
        } catch (auditError) {
          console.error('Error al registrar auditoría:', auditError);
          // No fallar el logout si esto falla
        }
      }

      res.json({ message: "Sesión cerrada exitosamente." });
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
      res.status(500).json({ message: "Error al cerrar sesión." });
    }
  }

  // Cerrar sesión en todos los dispositivos
  static async logoutAll(req, res) {
    const user = req.user; // Del middleware verifyToken

    if (!user || !user.usuario_id) {
      return res.status(401).json({ message: "Usuario no autenticado." });
    }

    try {
      // Verificar que el usuario existe
      const userExists = await Auth.getUserWithRole(user.usuario_id);
      
      if (!userExists) {
        console.log(`[logoutAll] Usuario ${user.usuario_id} no existe`);
        return res.status(404).json({ message: "Usuario no encontrado." });
      }

      // Invalidar todos los tokens del usuario
      try {
        await TokenBlacklist.blacklistAllUserTokens(user.usuario_id);
      } catch (error) {
        console.error('Error al invalidar tokens:', error);
        // Continuar aunque falle
      }

      // Registrar logout en auditoría
      try {
        await Audit.logAction({
          usuario_id: user.usuario_id,
          accion: 'LOGOUT_ALL',
          tabla_afectada: 'usuarios',
          registro_id: user.usuario_id,
          ip_address: req.ip || req.connection.remoteAddress,
          user_agent: req.get('user-agent'),
        });
      } catch (auditError) {
        console.error('Error al registrar auditoría:', auditError);
        // No fallar la operación si esto falla
      }

      res.json({ message: "Sesiones cerradas en todos los dispositivos exitosamente." });
    } catch (error) {
      console.error("Error al cerrar todas las sesiones:", error.message);
      res.status(500).json({ message: "Error al cerrar todas las sesiones." });
    }
  }
}

export default AuthController;
