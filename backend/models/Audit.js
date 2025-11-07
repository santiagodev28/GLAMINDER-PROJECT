import { executeQuery } from "../database/connectiondb.js";

class Audit {
  // Registrar una acción en la auditoría
  static async logAction(auditData) {
    const {
      usuario_id,
      accion,
      tabla_afectada,
      registro_id = null,
      datos_anteriores = null,
      datos_nuevos = null,
      ip_address = null,
      user_agent = null,
    } = auditData;

    const query = `
            INSERT INTO auditoria 
            (usuario_id, accion, tabla_afectada, registro_id, datos_anteriores, datos_nuevos, ip_address, user_agent)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

    const params = [
      usuario_id,
      accion,
      tabla_afectada,
      registro_id,
      datos_anteriores ? JSON.stringify(datos_anteriores) : null,
      datos_nuevos ? JSON.stringify(datos_nuevos) : null,
      ip_address,
      user_agent,
    ];

    const result = await executeQuery(query, params);

    if (!result.success) {
      console.error(`Error al registrar auditoría: ${result.error}`);
      // No lanzamos error para no interrumpir el flujo principal
    }

    return result.success;
  }

  // Obtener registros de auditoría con filtros
  static async getAuditLogs(filters = {}) {
    let query = `
            SELECT a.*, u.usuario_nombre, u.usuario_apellido, u.usuario_correo
            FROM auditoria a
            LEFT JOIN usuarios u ON a.usuario_id = u.usuario_id
            WHERE 1=1
        `;

    const params = [];

    if (filters.usuario_id) {
      query += " AND a.usuario_id = ?";
      params.push(filters.usuario_id);
    }

    if (filters.tabla_afectada) {
      query += " AND a.tabla_afectada = ?";
      params.push(filters.tabla_afectada);
    }

    if (filters.accion) {
      query += " AND a.accion = ?";
      params.push(filters.accion);
    }

    if (filters.fecha_desde) {
      query += " AND a.fecha_accion >= ?";
      params.push(filters.fecha_desde);
    }

    if (filters.fecha_hasta) {
      query += " AND a.fecha_accion <= ?";
      params.push(filters.fecha_hasta);
    }

    query += " ORDER BY a.fecha_accion DESC";

    if (filters.limit) {
      query += " LIMIT ?";
      params.push(filters.limit);
    }

    const result = await executeQuery(query, params);

    if (!result.success) {
      throw new Error(
        `Error al obtener registros de auditoría: ${result.error}`
      );
    }

    // Parsear JSON fields
    return result.data.map((log) => ({
      ...log,
      datos_anteriores: log.datos_anteriores
        ? JSON.parse(log.datos_anteriores)
        : null,
      datos_nuevos: log.datos_nuevos ? JSON.parse(log.datos_nuevos) : null,
    }));
  }
}

export default Audit;
