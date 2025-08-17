import db from "../database/connectiondb.js";

class Request {
    static async createRequest(usuario_id, data) {
        const {
            nombre_negocio,
            direccion_negocio,
            telefono_negocio,
            correo_negocio,
            descripcion_negocio,
        } = data;

        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO solicitudes_propietario 
            (usuario_id, nombre_negocio, direccion_negocio, telefono_negocio, correo_negocio, descripcion_negocio)
           VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    usuario_id,
                    nombre_negocio,
                    direccion_negocio,
                    telefono_negocio,
                    correo_negocio,
                    descripcion_negocio,
                ],
                (err, results) => {
                    if (err) return reject(err);
                    resolve({
                        message: "Peticion en espera.",
                        affected: results.affectedRows,
                    });
                }
            );
        });
    }

    static async getAllRequests() {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT s.solicitud_id, s.nombre_negocio, s.direccion_negocio, s.telefono_negocio, s.correo_negocio, s.descripcion_negocio, s.estado, s.fecha_solicitud, u.usuario_nombre, u.usuario_apellido, u.usuario_correo as usuarios FROM solicitudes_propietario s JOIN usuarios u ON s.usuario_id = u.usuario_id ORDER BY s.fecha_solicitud DESC; `,
                (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                }
            );
        });
    }

    static async getRequestByUserId(usuario_id) {
        try{
            const [rows] = await db.query(
                `SELECT * FROM solicitudes_propietario WHERE usuario_id = ?`,
                [usuario_id]
            );
            return rows;
        } catch (error) {
            console.error("Error al obtener la solicitud:", error);
            throw error;
        }
    }

    static async updateStatusRequest(solicitud_id, estado) {
    return new Promise((resolve, reject) => {
        // Normalizamos estado a minúsculas
        const normalicedStates = estado.toLowerCase();

        // 1. Actualizar el estado de la solicitud
        db.query(
            `UPDATE solicitudes_propietario SET estado = ? WHERE solicitud_id = ?`,
            [normalicedStates, solicitud_id],
            (err, result) => {
                if (err) {
                    console.error("Error en UPDATE:", err);
                    return reject(err);
                }
                if (result.affectedRows === 0) {
                    return reject(new Error("No se encontró la solicitud."));
                }

                console.log(`Solicitud ${solicitud_id} actualizada a estado: ${normalicedStates}`);

                // 2. Obtener el usuario que hizo la solicitud
                db.query(
                    `SELECT usuario_id FROM solicitudes_propietario WHERE solicitud_id = ?`,
                    [solicitud_id],
                    (err, rows) => {
                        if (err) {
                            console.error("Error en SELECT usuario_id:", err);
                            return reject(err);
                        }
                        if (rows.length === 0) {
                            return reject(new Error("Solicitud inválida."));
                        }

                        const usuario_id = rows[0].usuario_id;

                        // 3. Si se aprueba, insertar en propietarios y actualizar rol
                        if (normalicedStates === "aprobado") {
                            db.query(
                                `INSERT INTO propietarios (usuario_id) VALUES (?)`,
                                [usuario_id],
                                (err) => {
                                    if (err) {
                                        console.error("Error insertando en propietarios:", err);
                                        return reject(err);
                                    }

                                    db.query(
                                        `UPDATE usuarios SET rol_id = ?, rol_cambiado = ? WHERE usuario_id = ?`,
                                        [2, 1, usuario_id],
                                        (err) => {
                                            if (err) {
                                                console.error("Error actualizando rol:", err);
                                                return reject(err);
                                            }
                                            resolve({
                                                message: "Estado de la solicitud actualizado.",
                                                solicitud_id,
                                                usuario_id,
                                                estado: normalicedStates,
                                            });
                                        }
                                    );
                                }
                            );
                        } else {
                            resolve({
                                message: "Estado de la solicitud actualizado.",
                                solicitud_id,
                                usuario_id,
                                estado: normalicedStates,
                            });
                        }
                    }
                );
            }
        );
    });
}


}

export default Request;
