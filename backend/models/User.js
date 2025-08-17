import db from "../database/connectiondb.js";
import bycript from "bcrypt";

class User {
    static async getAllUsers(usuario_estado) {
        return new Promise((resolve, reject) => {
            let query = "SELECT * FROM usuarios";
            const params = [];

            if (usuario_estado !== undefined && !isNaN(usuario_estado)) {
                query += " WHERE usuario_estado = ?";
                params.push(Number(usuario_estado));
            }

            db.query(query, params, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    static async getUserById(usuario_id) {
        return new Promise((resolve, reject) => {
            db.query(
                "SELECT * FROM usuarios WHERE usuario_id = ?",
                [usuario_id],
                (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                }
            );
        });
    }

    static async updateUser(usuario_id, usuario) {
        return new Promise((resolve, reject) => {
            const {
                usuario_nombre,
                usuario_apellido,
                usuario_correo,
                usuario_contrasena,
                usuario_telefono,
                rol_id,
            } = usuario;
            const hashedPassword = bycript.hashSync(usuario_contrasena, 10);

            db.query(
                "UPDATE usuarios SET usuario_nombre = ?, usuario_apellido = ?, usuario_correo = ?, usuario_contrasena = ?, usuario_telefono = ?, rol_id = ? WHERE usuario_id = ?",
                [
                    usuario_nombre,
                    usuario_apellido,
                    usuario_correo,
                    hashedPassword,
                    usuario_telefono,
                    rol_id,
                    usuario_id,
                ],
                (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                }
            );
        });
    }

    static async resetChangeRole(usuario_id) {
        return new Promise((resolve, reject) => {
            db.query(
                "UPDATE usuarios SET rol_cambiado = 0 WHERE usuario_id = ?",
                [usuario_id],
                (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                }
            );
        });
    }

    static async updateUserRole(usuario_id, rol_id) {
        const [result] = await db.query(
            `UPDATE usuarios SET rol_id = ? WHERE usuario_id = ?`,
            [rol_id, usuario_id]
        );
        if (result.affectedRows === 0) {
            throw new Error("No se encontró el usuario.");
        }
        return {
            message: "Estado de la solicitud actualizado correctamente.",
            affected: result.affectedRows,
        };
    }

    static async deleteUser(usuario_id) {
        return new Promise((resolve, reject) => {
            db.query(
                "UPDATE usuarios SET usuario_estado = ? WHERE usuario_id = ?",
                [0, usuario_id],
                (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                }
            );
        });
    }
}

export default User;
