import { executeQuery } from "../database/connectiondb.js";

class RefreshToken {
  // Guardar un refresh token
  static async saveToken(tokenData) {
    const {
      usuario_id,
      token,
      jti,
      fecha_expiracion,
      ip_address = null,
      user_agent = null,
    } = tokenData;

    const query = `
            INSERT INTO refresh_tokens 
            (usuario_id, token, jti, fecha_expiracion, ip_address, user_agent)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

    const params = [
      usuario_id,
      token,
      jti,
      fecha_expiracion,
      ip_address,
      user_agent,
    ];

    const result = await executeQuery(query, params);

    if (!result.success) {
      throw new Error(`Error al guardar refresh token: ${result.error}`);
    }

    return result.data.insertId;
  }

  // Buscar refresh token por token
  static async findByToken(token) {
    const query = `
            SELECT * FROM refresh_tokens 
            WHERE token = ? AND revocado = 0 AND fecha_expiracion > NOW()
            LIMIT 1
        `;

    const result = await executeQuery(query, [token]);

    if (!result.success) {
      throw new Error(`Error al buscar refresh token: ${result.error}`);
    }

    return result.data[0] || null;
  }

  // Buscar refresh token por JTI
  static async findByJti(jti) {
    const query = `
            SELECT * FROM refresh_tokens 
            WHERE jti = ? AND revocado = 0 AND fecha_expiracion > NOW()
            LIMIT 1
        `;

    const result = await executeQuery(query, [jti]);

    if (!result.success) {
      throw new Error(`Error al buscar refresh token por JTI: ${result.error}`);
    }

    return result.data[0] || null;
  }

  // Revocar un refresh token
  static async revokeToken(token) {
    const query = `
            UPDATE refresh_tokens 
            SET revocado = 1 
            WHERE token = ?
        `;

    const result = await executeQuery(query, [token]);

    if (!result.success) {
      throw new Error(`Error al revocar refresh token: ${result.error}`);
    }

    return result.data.affectedRows > 0;
  }

  // Revocar todos los refresh tokens de un usuario
  static async revokeAllUserTokens(usuario_id) {
    const query = `
            UPDATE refresh_tokens 
            SET revocado = 1 
            WHERE usuario_id = ? AND revocado = 0
        `;

    const result = await executeQuery(query, [usuario_id]);

    if (!result.success) {
      throw new Error(`Error al revocar tokens del usuario: ${result.error}`);
    }

    return result.data.affectedRows;
  }

  // Limpiar tokens expirados
  static async cleanExpiredTokens() {
    const query = `
            DELETE FROM refresh_tokens 
            WHERE fecha_expiracion < NOW() OR revocado = 1
        `;

    const result = await executeQuery(query, []);

    if (!result.success) {
      console.error(`Error al limpiar tokens expirados: ${result.error}`);
    }

    return result.data.affectedRows || 0;
  }
}

export default RefreshToken;
