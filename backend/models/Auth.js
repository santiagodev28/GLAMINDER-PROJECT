import db from "../database/connectiondb.js";
import bycript from "bcrypt";

class Auth {
    // Buscar usuario por correo electrónico
    static async findUserByEmail(usuario_correo) {
        return new Promise((resolve, reject) => {
            db.query(
                "SELECT * FROM usuarios WHERE usuario_correo = ?",
                [usuario_correo],
                (err, results) => {
                    if (err) return reject(err);
                    resolve(results[0]);
                }
            );
        });
    }

    // Crear nuevo usuario
    static async createUser(user) {
        const {
            usuario_nombre,
            usuario_apellido,
            usuario_correo,
            usuario_contrasena,
            usuario_telefono,
            rol_id,
        } = user;

        const hashedPassword = bycript.hashSync(usuario_contrasena, 10);

        const rolDefault = 4;

        return new Promise((resolve, reject) => {
            db.query(
                "INSERT INTO usuarios (usuario_nombre, usuario_apellido, usuario_correo, usuario_contrasena, usuario_telefono, rol_id) VALUES (?, ?, ?, ?, ?, ?)",
                [
                    usuario_nombre,
                    usuario_apellido,
                    usuario_correo,
                    hashedPassword,
                    usuario_telefono,
                    rolDefault
                ],
                (err, results) => {
                    if (err) return reject(err);

                    const userId = results.insertId;

                    // Si el rol es 3 (empleado)
                    if (rol_id == 3) {
                        db.query(
                            "INSERT INTO empleados (usuario_id, tienda_id, empleado_especialidad) VALUES (?, ?, ?)",
                            [userId, tienda_id, empleado_especialidad],
                            (err, results) => {
                                if (err) return reject(err);
                                return resolve({ userId, role: "empleado" });
                            }
                        );

                    // Si el rol es 2 (propietario)
                    } else if (rol_id == 2) {
                        db.query(
                            "INSERT INTO propietarios (usuario_id) VALUES (?)",
                            [userId],
                            (err, results) => {
                                if (err) return reject(err);
                                return resolve({ userId, role: "propietario" });
                            }
                        );

                    // Si el rol es 4 (cliente) u otro válido sin tabla adicional
                    } else {
                        return resolve({ userId, role: "cliente" });
                    }
                }
            );
        });
    }
}

export default Auth;