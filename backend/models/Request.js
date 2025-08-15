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
}


export default Request