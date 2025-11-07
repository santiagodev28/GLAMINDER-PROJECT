import { executeQuery, executeTransaction } from "../database/connectiondb.js";

class Consent {
  // Registrar un consentimiento
  static async recordConsent(consentData) {
    const {
      usuario_id,
      tipo_consentimiento,
      version = "1.0",
      aceptado = true,
      ip_address = null,
      user_agent = null,
    } = consentData;

    const query = `
      INSERT INTO consentimientos 
      (usuario_id, tipo_consentimiento, version, aceptado, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const params = [
      usuario_id,
      tipo_consentimiento,
      version,
      aceptado ? 1 : 0,
      ip_address,
      user_agent,
    ];

    const result = await executeQuery(query, params);

    if (!result.success) {
      throw new Error(`Error al registrar consentimiento: ${result.error}`);
    }

    return {
      success: true,
      consentimiento_id: result.data.insertId,
    };
  }

  // Revocar un consentimiento
  static async revokeConsent(usuario_id, tipo_consentimiento) {
    const query = `
      UPDATE consentimientos 
      SET aceptado = 0, fecha_revocacion = NOW()
      WHERE usuario_id = ? 
      AND tipo_consentimiento = ?
      AND aceptado = 1
      ORDER BY fecha_consentimiento DESC
      LIMIT 1
    `;

    const result = await executeQuery(query, [usuario_id, tipo_consentimiento]);

    if (!result.success) {
      throw new Error(`Error al revocar consentimiento: ${result.error}`);
    }

    return {
      success: true,
      affectedRows: result.data.affectedRows,
    };
  }

  // Obtener consentimientos de un usuario
  static async getUserConsents(usuario_id) {
    const query = `
      SELECT * FROM consentimientos 
      WHERE usuario_id = ?
      ORDER BY fecha_consentimiento DESC
    `;

    const result = await executeQuery(query, [usuario_id]);

    if (!result.success) {
      throw new Error(`Error al obtener consentimientos: ${result.error}`);
    }

    return result.data;
  }

  // Verificar si un usuario tiene un consentimiento activo
  static async hasActiveConsent(usuario_id, tipo_consentimiento) {
    const query = `
      SELECT * FROM consentimientos 
      WHERE usuario_id = ? 
      AND tipo_consentimiento = ?
      AND aceptado = 1
      ORDER BY fecha_consentimiento DESC
      LIMIT 1
    `;

    const result = await executeQuery(query, [usuario_id, tipo_consentimiento]);

    if (!result.success) {
      return false;
    }

    return result.data.length > 0;
  }

  // Obtener la versión actual de términos y condiciones
  static getCurrentTermsVersion() {
    // Esto puede venir de una configuración o constante
    return "1.0";
  }
}

export default Consent;

