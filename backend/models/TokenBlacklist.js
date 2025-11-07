import { executeQuery } from "../database/connectiondb.js";

class TokenBlacklist {
  // Agregar token a la blacklist
  static async addToken(tokenData) {
    const {
      token_jti,
      usuario_id,
      token_type = "access",
      fecha_expiracion,
    } = tokenData;

    const query = `
            INSERT INTO token_blacklist 
            (token_jti, usuario_id, token_type, fecha_expiracion)
            VALUES (?, ?, ?, ?)
        `;

    const params = [token_jti, usuario_id, token_type, fecha_expiracion];

    const result = await executeQuery(query, params);

    if (!result.success) {
      throw new Error(`Error al agregar token a blacklist: ${result.error}`);
    }

    return result.data.insertId;
  }

  // Verificar si un token está en la blacklist
  static async isTokenBlacklisted(token_jti) {
    const query = `
            SELECT * FROM token_blacklist 
            WHERE token_jti = ? AND fecha_expiracion > NOW()
            LIMIT 1
        `;

    const result = await executeQuery(query, [token_jti]);

    if (!result.success) {
      throw new Error(`Error al verificar blacklist: ${result.error}`);
    }

    return result.data.length > 0;
  }

  // Agregar todos los tokens de un usuario a la blacklist (cerrar sesión en todos los dispositivos)
  static async blacklistAllUserTokens(usuario_id) {
    // Primero obtenemos todos los tokens activos del usuario desde refresh_tokens
    const getTokensQuery = `
            SELECT jti, fecha_expiracion 
            FROM refresh_tokens 
            WHERE usuario_id = ? AND revocado = 0 AND fecha_expiracion > NOW()
        `;

    const tokensResult = await executeQuery(getTokensQuery, [usuario_id]);

    if (!tokensResult.success) {
      throw new Error(
        `Error al obtener tokens del usuario: ${tokensResult.error}`
      );
    }

    // Agregamos cada token a la blacklist
    let blacklistedCount = 0;
    for (const token of tokensResult.data) {
      try {
        await this.addToken({
          token_jti: token.jti,
          usuario_id,
          token_type: "refresh",
          fecha_expiracion: token.fecha_expiracion,
        });
        blacklistedCount++;
      } catch (error) {
        console.error(`Error al agregar token a blacklist: ${error.message}`);
      }
    }

    // También revocamos los refresh tokens
    const RefreshToken = (await import("./RefreshToken.js")).default;
    await RefreshToken.revokeAllUserTokens(usuario_id);

    return blacklistedCount;
  }

  // Limpiar tokens expirados de la blacklist
  static async cleanExpiredTokens() {
    const query = `
            DELETE FROM token_blacklist 
            WHERE fecha_expiracion < NOW()
        `;

    const result = await executeQuery(query, []);

    if (!result.success) {
      console.error(`Error al limpiar blacklist: ${result.error}`);
    }

    return result.data.affectedRows || 0;
  }
}

export default TokenBlacklist;
