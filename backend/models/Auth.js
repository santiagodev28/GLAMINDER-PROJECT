import { executeQuery, executeTransaction } from "../database/connectiondb.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import Consent from "./Consent.js";

class Auth {
  // Buscar usuario por correo electrónico
  static async findUserByEmail(usuario_correo) {
    const query = "SELECT * FROM usuarios WHERE usuario_correo = ?";
    const result = await executeQuery(query, [usuario_correo]);

    if (!result.success) {
      throw new Error(`Error al buscar usuario: ${result.error}`);
    }

    return result.data[0] || null;
  }

  // Verificar si el email ya existe
  static async emailExists(usuario_correo) {
    const user = await this.findUserByEmail(usuario_correo);
    return user !== null;
  }

  // Crear nuevo usuario con rol específico
  static async createUser(userData) {
    const {
      usuario_nombre,
      usuario_apellido,
      usuario_correo,
      usuario_contrasena,
      usuario_telefono,
      rol_id,
      tienda_id, // Para empleados
      empleado_especialidad, // Para empleados
      acepta_terminos, // Consentimiento de términos
      ip_address, // Para auditoría de consentimiento
      user_agent, // Para auditoría de consentimiento
    } = userData;

    // Verificar si el email ya existe
    if (await this.emailExists(usuario_correo)) {
      throw new Error("El correo electrónico ya está registrado");
    }

    // Verificar que el usuario haya aceptado los términos
    if (!acepta_terminos) {
      throw new Error(
        "Debes aceptar los términos y condiciones para registrarte"
      );
    }

    // Hashear contraseña de forma asíncrona
    const hashedPassword = await bcrypt.hash(usuario_contrasena, 10);
    const rolDefault = rol_id || 4; // Cliente por defecto

    // Preparar queries para transacción
    const queries = [];

    // Generar token de verificación de email (sin hashear para enviarlo por email)
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    const hashedVerificationToken = crypto
      .createHash("sha256")
      .update(emailVerificationToken)
      .digest("hex");
    const emailVerificationExpires = new Date();
    emailVerificationExpires.setHours(emailVerificationExpires.getHours() + 24); // 24 horas

    // Log para debugging
    console.log(
      `[Auth.createUser] Token generado (primeros 8 chars): ${emailVerificationToken.substring(
        0,
        8
      )}...`
    );
    console.log(
      `[Auth.createUser] Token hasheado para BD (primeros 8 chars): ${hashedVerificationToken.substring(
        0,
        8
      )}...`
    );

    // Query principal para insertar usuario
    queries.push({
      query: `INSERT INTO usuarios 
              (usuario_nombre, usuario_apellido, usuario_correo, usuario_contrasena, usuario_telefono, rol_id, email_verification_token, email_verification_expires) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      params: [
        usuario_nombre,
        usuario_apellido,
        usuario_correo,
        hashedPassword,
        usuario_telefono,
        rolDefault,
        hashedVerificationToken,
        emailVerificationExpires,
      ],
    });

    try {
      // Ejecutar transacción
      const transactionResult = await executeTransaction(queries);

      if (!transactionResult.success) {
        throw new Error(`Error en transacción: ${transactionResult.error}`);
      }

      const userId = transactionResult.results[0].insertId;
      let roleInfo = { userId, role: "cliente" };

      // Crear registro adicional según el rol
      if (rolDefault == 3) {
        // Empleado
        roleInfo = await this.createEmployeeRecord(
          userId,
          tienda_id,
          empleado_especialidad
        );
      } else if (rolDefault == 2) {
        // Propietario
        roleInfo = await this.createOwnerRecord(userId);
      }

      // Registrar consentimiento de términos y condiciones
      try {
        await Consent.recordConsent({
          usuario_id: userId,
          tipo_consentimiento: "TERMINOS_CONDICIONES",
          version: Consent.getCurrentTermsVersion(),
          aceptado: true,
          ip_address: ip_address || null,
          user_agent: user_agent || null,
        });
      } catch (consentError) {
        console.error("Error al registrar consentimiento:", consentError);
        // No lanzamos error para no interrumpir el registro, pero lo registramos
      }

      return {
        success: true,
        data: {
          userId: roleInfo.userId,
          role: roleInfo.role,
          usuario_nombre,
          usuario_correo,
          emailVerificationToken,
          message: "Usuario creado exitosamente",
        },
      };
    } catch (error) {
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  }

  // Crear registro de empleado
  static async createEmployeeRecord(userId, tienda_id, empleado_especialidad) {
    if (!tienda_id || !empleado_especialidad) {
      throw new Error(
        "Para empleados se requiere tienda_id y empleado_especialidad"
      );
    }

    const query =
      "INSERT INTO empleados (usuario_id, tienda_id, empleado_especialidad) VALUES (?, ?, ?)";
    const result = await executeQuery(query, [
      userId,
      tienda_id,
      empleado_especialidad,
    ]);

    if (!result.success) {
      throw new Error(`Error al crear registro de empleado: ${result.error}`);
    }

    return { userId, role: "empleado" };
  }

  // Crear registro de propietario
  static async createOwnerRecord(userId) {
    const query = "INSERT INTO propietarios (usuario_id) VALUES (?)";
    const result = await executeQuery(query, [userId]);

    if (!result.success) {
      throw new Error(
        `Error al crear registro de propietario: ${result.error}`
      );
    }

    return { userId, role: "propietario" };
  }

  // Verificar credenciales de login
  static async verifyCredentials(usuario_correo, usuario_contrasena) {
    try {
      // Buscar usuario
      const user = await this.findUserByEmail(usuario_correo);

      if (!user) {
        return { success: false, message: "Credenciales inválidas" };
      }

      // Verificar si el usuario está activo
      if (user.usuario_estado === 0) {
        return { success: false, message: "Usuario desactivado" };
      }

      // Verificar contraseña
      const passwordMatch = await bcrypt.compare(
        usuario_contrasena,
        user.usuario_contrasena
      );

      if (!passwordMatch) {
        return { success: false, message: "Credenciales inválidas" };
      }

      // Remover contraseña del objeto de respuesta
      const { usuario_contrasena: _, ...userWithoutPassword } = user;

      return {
        success: true,
        user: userWithoutPassword,
        message: "Login exitoso",
      };
    } catch (error) {
      throw new Error(`Error al verificar credenciales: ${error.message}`);
    }
  }

  // Cambiar contraseña
  static async changePassword(usuario_id, currentPassword, newPassword) {
    try {
      // Obtener usuario actual
      const getUserQuery =
        "SELECT usuario_contrasena FROM usuarios WHERE usuario_id = ?";
      const userResult = await executeQuery(getUserQuery, [usuario_id]);

      if (!userResult.success || userResult.data.length === 0) {
        throw new Error("Usuario no encontrado");
      }

      const user = userResult.data[0];

      // Verificar contraseña actual
      const passwordMatch = await bcrypt.compare(
        currentPassword,
        user.usuario_contrasena
      );

      if (!passwordMatch) {
        throw new Error("Contraseña actual incorrecta");
      }

      // Hashear nueva contraseña
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Actualizar contraseña
      const updateQuery =
        "UPDATE usuarios SET usuario_contrasena = ? WHERE usuario_id = ?";
      const updateResult = await executeQuery(updateQuery, [
        hashedNewPassword,
        usuario_id,
      ]);

      if (!updateResult.success) {
        throw new Error(
          `Error al actualizar contraseña: ${updateResult.error}`
        );
      }

      return {
        success: true,
        message: "Contraseña actualizada exitosamente",
      };
    } catch (error) {
      throw new Error(`Error al cambiar contraseña: ${error.message}`);
    }
  }

  // Obtener información completa del usuario con su rol
  static async getUserWithRole(usuario_id) {
    const query = `
      SELECT u.*, r.rol_nombre 
      FROM usuarios u 
      LEFT JOIN roles r ON u.rol_id = r.rol_id 
      WHERE u.usuario_id = ?
    `;

    const result = await executeQuery(query, [usuario_id]);

    if (!result.success) {
      throw new Error(`Error al obtener usuario: ${result.error}`);
    }

    const user = result.data[0];
    if (!user) {
      return null;
    }

    // Remover contraseña del objeto de respuesta
    const { usuario_contrasena: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Recuperacion de contraseñas...

  // Guardar token de restablecimiento (hasheado) con expiración
  static async saveResetToken(usuario_id, rawToken) {
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");
    // 1 hora de validez
    const updateQuery = `
      UPDATE usuarios 
      SET reset_token = ?, reset_expires = DATE_ADD(NOW(), INTERVAL 1 HOUR)
      WHERE usuario_id = ?
    `;
    const result = await executeQuery(updateQuery, [hashedToken, usuario_id]);
    if (!result.success) {
      throw new Error(
        `Error al guardar token de restablecimiento: ${result.error}`
      );
    }
    return true;
  }

  // Buscar usuario por token válido
  static async findByToken(rawToken) {
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");
    const findQuery = `
      SELECT * 
      FROM usuarios 
      WHERE reset_token = ? AND reset_expires IS NOT NULL AND reset_expires > NOW()
      LIMIT 1
    `;
    const result = await executeQuery(findQuery, [hashedToken]);
    if (!result.success) {
      throw new Error(`Error al buscar por token: ${result.error}`);
    }
    return result.data[0] || null;
  }

  // Actualizar contraseña y limpiar token
  static async updatePassword(usuario_id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updateQuery = `
      UPDATE usuarios
      SET usuario_contrasena = ?, reset_token = NULL, reset_expires = NULL
      WHERE usuario_id = ?
    `;
    const result = await executeQuery(updateQuery, [
      hashedPassword,
      usuario_id,
    ]);
    if (!result.success) {
      throw new Error(`Error al actualizar contraseña: ${result.error}`);
    }
    return true;
  }

  // Verificar email con token
  static async verifyEmail(token) {
    if (!token || typeof token !== "string" || token.trim() === "") {
      return { success: false, message: "Token de verificación inválido" };
    }

    // Limpiar el token (eliminar espacios, saltos de línea, etc.)
    const cleanToken = token.trim();

    // Hashear el token para compararlo con el almacenado
    const hashedToken = crypto
      .createHash("sha256")
      .update(cleanToken)
      .digest("hex");

    console.log(
      `[Auth.verifyEmail] Token recibido (primeros 8 chars): ${cleanToken.substring(
        0,
        8
      )}...`
    );
    console.log(
      `[Auth.verifyEmail] Token hasheado (primeros 8 chars): ${hashedToken.substring(
        0,
        8
      )}...`
    );

    // Primero verificar si existe algún token que coincida (para debugging)
    const debugQuery = `
      SELECT usuario_id, email_verification_token, email_verification_expires, email_verificado
      FROM usuarios 
      WHERE email_verification_token IS NOT NULL
      LIMIT 5
    `;
    const debugResult = await executeQuery(debugQuery, []);
    if (debugResult.success) {
      console.log(
        `[Auth.verifyEmail] Tokens en BD (primeros 5):`,
        debugResult.data.map((u) => ({
          id: u.usuario_id,
          token_stored: u.email_verification_token
            ? u.email_verification_token.substring(0, 16) + "..."
            : null,
          expires: u.email_verification_expires,
          verified: u.email_verificado,
        }))
      );
    }

    const query = `
            UPDATE usuarios 
            SET email_verificado = 1, 
                email_verification_token = NULL, 
                email_verification_expires = NULL
            WHERE email_verification_token = ? 
            AND email_verification_expires > NOW()
        `;

    console.log(
      `[Auth.verifyEmail] Buscando token hasheado: ${hashedToken.substring(
        0,
        16
      )}...`
    );

    const result = await executeQuery(query, [hashedToken]);

    if (!result.success) {
      throw new Error(`Error al verificar email: ${result.error}`);
    }

    console.log(
      `[Auth.verifyEmail] Filas afectadas: ${result.data.affectedRows}`
    );

    if (result.data.affectedRows === 0) {
      // Verificar si el usuario ya está verificado (token ya fue usado)
      const checkVerifiedQuery = `
        SELECT usuario_id, email_verificado, email_verification_token 
        FROM usuarios 
        WHERE email_verification_token = ?
        LIMIT 1
      `;
      const checkVerifiedResult = await executeQuery(checkVerifiedQuery, [
        hashedToken,
      ]);

      if (checkVerifiedResult.success && checkVerifiedResult.data.length > 0) {
        const user = checkVerifiedResult.data[0];
        if (user.email_verificado) {
          console.log(
            `[Auth.verifyEmail] Token ya fue utilizado. Usuario ${user.usuario_id} ya está verificado.`
          );
          return {
            success: true,
            message: "Email ya verificado anteriormente.",
          };
        }
      }

      // Verificar si el token existe pero expiró
      const checkExpiredQuery = `
        SELECT usuario_id, email_verification_expires FROM usuarios 
        WHERE email_verification_token = ?
        LIMIT 1
      `;
      const checkExpiredResult = await executeQuery(checkExpiredQuery, [
        hashedToken,
      ]);

      if (checkExpiredResult.success && checkExpiredResult.data.length > 0) {
        const user = checkExpiredResult.data[0];
        console.log(
          `[Auth.verifyEmail] Token encontrado pero expirado. Expira: ${user.email_verification_expires}`
        );
        return {
          success: false,
          message:
            "Token de verificación expirado. Por favor solicita uno nuevo.",
        };
      }

      // Verificar si hay algún token similar (para debugging)
      const similarQuery = `
        SELECT usuario_id, email_verification_token 
        FROM usuarios 
        WHERE email_verification_token LIKE ?
        LIMIT 1
      `;
      const similarResult = await executeQuery(similarQuery, [
        `${hashedToken.substring(0, 8)}%`,
      ]);
      if (similarResult.success && similarResult.data.length > 0) {
        console.log(
          `[Auth.verifyEmail] ⚠️ Token similar encontrado pero no coincide exactamente`
        );
        console.log(
          `[Auth.verifyEmail] Token en BD: ${similarResult.data[0].email_verification_token.substring(
            0,
            16
          )}...`
        );
        console.log(
          `[Auth.verifyEmail] Token recibido: ${hashedToken.substring(
            0,
            16
          )}...`
        );
      }

      return {
        success: false,
        message: "Token de verificación inválido o ya utilizado.",
      };
    }

    return { success: true, message: "Email verificado exitosamente" };
  }

  // Reenviar token de verificación
  static async resendVerificationToken(usuario_correo) {
    const user = await this.findUserByEmail(usuario_correo);

    if (!user) {
      return { success: false, message: "Usuario no encontrado" };
    }

    if (user.email_verificado) {
      return { success: false, message: "El email ya está verificado" };
    }

    // Generar nuevo token (sin hashear para enviarlo por email)
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(emailVerificationToken)
      .digest("hex");
    const emailVerificationExpires = new Date();
    emailVerificationExpires.setHours(emailVerificationExpires.getHours() + 24);

    const query = `
            UPDATE usuarios 
            SET email_verification_token = ?, 
                email_verification_expires = ?
            WHERE usuario_id = ?
        `;

    const result = await executeQuery(query, [
      hashedToken,
      emailVerificationExpires,
      user.usuario_id,
    ]);

    if (!result.success) {
      throw new Error(`Error al reenviar token: ${result.error}`);
    }

    return {
      success: true,
      emailVerificationToken, // Retornar el token sin hashear para enviarlo por email
      message: "Token de verificación reenviado",
    };
  }
}

export default Auth;
