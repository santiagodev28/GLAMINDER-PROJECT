import Audit from "../models/Audit.js";

/**
 * Middleware para registrar acciones en la auditoría
 * @param {string} accion - Acción realizada (CREATE, UPDATE, DELETE, etc.)
 * @param {string} tabla_afectada - Nombre de la tabla afectada
 */
export const auditMiddleware = (accion, tabla_afectada) => {
  return async (req, res, next) => {
    // Guardar referencia a la función original de res.json
    const originalJson = res.json.bind(res);

    // Interceptar res.json para capturar la respuesta
    res.json = async function (data) {
      // Si la operación fue exitosa (status 200-299)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const usuario_id = req.user?.usuario_id || null;
          const registro_id = req.params.id || req.body?.id || data?.id || null;

          // Determinar datos anteriores y nuevos según la acción
          let datos_anteriores = null;
          let datos_nuevos = null;

          if (accion === 'UPDATE' && req.body) {
            datos_nuevos = { ...req.body };
            // Si hay datos originales en req.originalData (debe ser establecido antes)
            if (req.originalData) {
              datos_anteriores = req.originalData;
            }
          } else if (accion === 'CREATE' && req.body) {
            datos_nuevos = { ...req.body };
            // Eliminar contraseñas de los datos
            if (datos_nuevos.usuario_contrasena) {
              delete datos_nuevos.usuario_contrasena;
            }
          } else if (accion === 'DELETE') {
            // Si hay datos originales antes de eliminar
            if (req.originalData) {
              datos_anteriores = req.originalData;
            }
          }

          // Registrar en auditoría
          await Audit.logAction({
            usuario_id,
            accion,
            tabla_afectada,
            registro_id,
            datos_anteriores,
            datos_nuevos,
            ip_address: req.ip || req.connection.remoteAddress,
            user_agent: req.get('user-agent'),
          });
        } catch (error) {
          // No interrumpir la respuesta si falla la auditoría
          console.error('Error al registrar auditoría:', error);
        }
      }

      // Llamar a la función original
      return originalJson(data);
    };

    next();
  };
};

/**
 * Middleware simple para registrar acciones específicas
 */
export const logAction = async (req, accion, tabla_afectada, registro_id = null, datos_anteriores = null, datos_nuevos = null) => {
  try {
    const usuario_id = req.user?.usuario_id || null;
    
    await Audit.logAction({
      usuario_id,
      accion,
      tabla_afectada,
      registro_id,
      datos_anteriores,
      datos_nuevos,
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.get('user-agent'),
    });
  } catch (error) {
    console.error('Error al registrar auditoría:', error);
  }
};

