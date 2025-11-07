import RefreshToken from "../models/RefreshToken.js";
import TokenBlacklist from "../models/TokenBlacklist.js";

/**
 * Limpia tokens expirados de la base de datos
 * Debe ejecutarse periódicamente (ej: cada hora con un cron job)
 */
export const cleanupExpiredTokens = async () => {
  try {
    console.log('[Cleanup] Iniciando limpieza de tokens expirados...');
    
    const refreshTokensCleaned = await RefreshToken.cleanExpiredTokens();
    const blacklistTokensCleaned = await TokenBlacklist.cleanExpiredTokens();
    
    console.log(`[Cleanup] Tokens limpiados - Refresh: ${refreshTokensCleaned}, Blacklist: ${blacklistTokensCleaned}`);
    
    return {
      refreshTokensCleaned,
      blacklistTokensCleaned,
    };
  } catch (error) {
    console.error('[Cleanup] Error al limpiar tokens:', error);
    throw error;
  }
};

// Si se ejecuta directamente, limpiar tokens
if (import.meta.url === `file://${process.argv[1]}`) {
  cleanupExpiredTokens()
    .then(() => {
      console.log('[Cleanup] Limpieza completada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('[Cleanup] Error:', error);
      process.exit(1);
    });
}

