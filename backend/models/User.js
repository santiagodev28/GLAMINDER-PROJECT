import { executeQuery } from "../database/connectiondb.js";
import bcrypt from "bcrypt";

class User {
    // Obtener todos los usuarios con filtro opcional por estado
    static async getAllUsers(usuario_estado) {
        let query = "SELECT * FROM usuarios";
        const params = [];

        if (usuario_estado !== undefined && !isNaN(usuario_estado)) {
            query += " WHERE usuario_estado = ?";
            params.push(Number(usuario_estado));
        }

        const result = await executeQuery(query, params);

        if (!result.success) {
            throw new Error(`Error al obtener usuarios: ${result.error}`);
        }

        return result.data;
    }

    // Obtener usuario por ID
    static async getUserById(usuario_id) {
        const query = "SELECT * FROM usuarios WHERE usuario_id = ?";
        const result = await executeQuery(query, [usuario_id]);

        if (!result.success) {
            throw new Error(`Error al obtener usuario: ${result.error}`);
        }

        return result.data[0] || null;
    }

    // Obtener usuario por email (útil para autenticación)
    static async getUserByEmail(usuario_correo) {
        const query = "SELECT * FROM usuarios WHERE usuario_correo = ?";
        const result = await executeQuery(query, [usuario_correo]);

        if (!result.success) {
            throw new Error(
                `Error al obtener usuario por email: ${result.error}`
            );
        }

        return result.data[0] || null;
    }

    // Crear nuevo usuario
    static async createUser(userData) {
        const {
            usuario_nombre,
            usuario_apellido,
            usuario_correo,
            usuario_contrasena,
            usuario_telefono,
            rol_id = 4, // Rol por defecto
        } = userData;

        // Hashear contraseña
        const hashedPassword = await bcrypt.hash(usuario_contrasena, 10);

        const query = `
      INSERT INTO usuarios 
      (usuario_nombre, usuario_apellido, usuario_correo, usuario_contrasena, usuario_telefono, rol_id) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

        const params = [
            usuario_nombre,
            usuario_apellido,
            usuario_correo,
            hashedPassword,
            usuario_telefono,
            rol_id,
        ];

        const result = await executeQuery(query, params);

        if (!result.success) {
            throw new Error(`Error al crear usuario: ${result.error}`);
        }

        return {
            usuario_id: result.data.insertId,
            usuario_nombre,
            usuario_correo,
            message: "Usuario creado exitosamente",
        };
    }

    // Actualizar usuario
    static async updateUser(usuario_id, userData) {
        const {
            usuario_nombre,
            usuario_apellido,
            usuario_correo,
            usuario_contrasena,
            usuario_telefono,
            rol_id,
        } = userData;

        // Hashear contraseña si se proporciona
        const hashedPassword = usuario_contrasena
            ? await bcrypt.hash(usuario_contrasena, 10)
            : null;

        const query = `
      UPDATE usuarios 
      SET usuario_nombre = ?, usuario_apellido = ?, usuario_correo = ?, 
          usuario_contrasena = ?, usuario_telefono = ?, rol_id = ? 
      WHERE usuario_id = ?
    `;

        const params = [
            usuario_nombre,
            usuario_apellido,
            usuario_correo,
            hashedPassword,
            usuario_telefono,
            rol_id,
            usuario_id,
        ];

        const result = await executeQuery(query, params);

        if (!result.success) {
            throw new Error(`Error al actualizar usuario: ${result.error}`);
        }

        if (result.data.affectedRows === 0) {
            throw new Error("Usuario no encontrado");
        }

        return {
            message: "Usuario actualizado exitosamente",
            affectedRows: result.data.affectedRows,
        };
    }

    // Actualizar solo el rol del usuario
    static async updateUserRole(usuario_id, rol_id) {
        const query = "UPDATE usuarios SET rol_id = ? WHERE usuario_id = ?";
        const result = await executeQuery(query, [rol_id, usuario_id]);

        if (!result.success) {
            throw new Error(`Error al actualizar rol: ${result.error}`);
        }

        if (result.data.affectedRows === 0) {
            throw new Error("No se encontró el usuario");
        }

        return {
            message: "Rol de usuario actualizado correctamente",
            affectedRows: result.data.affectedRows,
        };
    }

    // Resetear cambio de rol
    static async resetChangeRole(usuario_id) {
        const query =
            "UPDATE usuarios SET rol_cambiado = 0 WHERE usuario_id = ?";
        const result = await executeQuery(query, [usuario_id]);

        if (!result.success) {
            throw new Error(`Error al resetear cambio de rol: ${result.error}`);
        }

        if (result.data.affectedRows === 0) {
            throw new Error("Usuario no encontrado");
        }

        return {
            message: "Cambio de rol reseteado exitosamente",
            affectedRows: result.data.affectedRows,
        };
    }

    // Eliminar usuario (soft delete)
    static async deleteUser(usuario_id) {
        const query =
            "UPDATE usuarios SET usuario_estado = 0 WHERE usuario_id = ?";
        const result = await executeQuery(query, [usuario_id]);

        if (!result.success) {
            throw new Error(`Error al eliminar usuario: ${result.error}`);
        }

        if (result.data.affectedRows === 0) {
            throw new Error("Usuario no encontrado");
        }

        return {
            message: "Usuario eliminado exitosamente",
            affectedRows: result.data.affectedRows,
        };
    }

    // Activar usuario
    static async activateUser(usuario_id) {
        const query =
            "UPDATE usuarios SET usuario_estado = 1 WHERE usuario_id = ?";
        const result = await executeQuery(query, [usuario_id]);

        if (!result.success) {
            throw new Error(`Error al activar usuario: ${result.error}`);
        }

        if (result.data.affectedRows === 0) {
            throw new Error("Usuario no encontrado");
        }

        return {
            message: "Usuario activado exitosamente",
            affectedRows: result.data.affectedRows,
        };
    }

    // Verificar contraseña (útil para login)
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    // Actualizar campo rol_cambiado
    static async updateRoleChange(usuario_id, rol_cambiado) {
        const query =
            "UPDATE usuarios SET rol_cambiado = ? WHERE usuario_id = ?";
        const result = await executeQuery(query, [rol_cambiado, usuario_id]);

        if (!result.success) {
            throw new Error(`Error al actualizar rol_cambiado: ${result.error}`);
        }

        if (result.data.affectedRows === 0) {
            throw new Error("Usuario no encontrado");
        }

        return {
            message: "Campo rol_cambiado actualizado exitosamente",
            affectedRows: result.data.affectedRows,
        };
    }
    // Contar usuarios por estado
    static async countUsersByStatus(usuario_estado = 1) {
        const query =
            "SELECT COUNT(*) as total FROM usuarios WHERE usuario_estado = ?";
        const result = await executeQuery(query, [usuario_estado]);

        if (!result.success) {
            throw new Error(`Error al contar usuarios: ${result.error}`);
        }

        return result.data[0]?.total || 0;
    }
}

export default User;
