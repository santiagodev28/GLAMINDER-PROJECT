import { executeQuery, executeTransaction } from "../database/connectiondb.js";
import bcrypt from "bcrypt";
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

  // Crear nuevo usuario SIN VERIFICACIÓN DE EMAIL
  static async createUser(userData) {
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
      ip_address,
      user_agent,
    } = userData;

    if (await this.emailExists(usuario_correo)) {
      throw new Error("El correo electrónico ya está registrado");
    }

    if (!acepta_terminos) {
      throw new Error(
        "Debes aceptar los términos y condiciones para registrarte"
      );
    }

    const hashedPassword = await bcrypt.hash(usuario_contrasena, 10);
    const rolDefault = rol_id || 1;

    const queries = [];

    // Insertar sin campos de verificación
    queries.push({
      query: `INSERT INTO usuarios 
              (usuario_nombre, usuario_apellido, usuario_correo, usuario_contrasena, usuario_telefono, rol_id) 
              VALUES (?, ?, ?, ?, ?, ?)`,
      params: [
        usuario_nombre,
        usuario_apellido,
        usuario_correo,
        hashedPassword,
        usuario_telefono,
        rolDefault,
      ],
    });

    try {
      const transactionResult = await executeTransaction(queries);

      if (!transactionResult.success) {
        throw new Error(`Error en transacción: ${transactionResult.error}`);
      }

      const userId = transactionResult.results[0].insertId;
      let roleInfo = { userId, role: "cliente" };

      if (rolDefault == 3) {
        roleInfo = await this.createEmployeeRecord(
          userId,
          tienda_id,
          empleado_especialidad
        );
      } else if (rolDefault == 2) {
        roleInfo = await this.createOwnerRecord(userId);
      }

      // Registrar consentimiento
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
      }

      return {
        success: true,
        data: {
          userId: roleInfo.userId,
          role: roleInfo.role,
          usuario_nombre,
          usuario_correo,
          message: "Usuario creado exitosamente",
        },
      };
    } catch (error) {
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  }

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

  // Verificar credenciales
  static async verifyCredentials(usuario_correo, usuario_contrasena) {
    try {
      const user = await this.findUserByEmail(usuario_correo);

      if (!user) {
        return { success: false, message: "Credenciales inválidas" };
      }

      if (user.usuario_estado === 0) {
        return { success: false, message: "Usuario desactivado" };
      }

      const passwordMatch = await bcrypt.compare(
        usuario_contrasena,
        user.usuario_contrasena
      );

      if (!passwordMatch) {
        return { success: false, message: "Credenciales inválidas" };
      }

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
    const getUserQuery =
      "SELECT usuario_contrasena FROM usuarios WHERE usuario_id = ?";
    const userResult = await executeQuery(getUserQuery, [usuario_id]);

    if (!userResult.success || userResult.data.length === 0) {
      throw new Error("Usuario no encontrado");
    }

    const user = userResult.data[0];
    const passwordMatch = await bcrypt.compare(
      currentPassword,
      user.usuario_contrasena
    );

    if (!passwordMatch) {
      throw new Error("Contraseña actual incorrecta");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

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
  }

  // Obtener usuario con rol
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
    if (!user) return null;

    const { usuario_contrasena: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

export default Auth;
