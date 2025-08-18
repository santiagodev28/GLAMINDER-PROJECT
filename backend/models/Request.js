import { executeQuery, executeTransaction } from '../database/connectiondb.js';

class Request {
  // Estados válidos para solicitudes de propietario
  static STATES = {
    PENDING: 'pendiente',
    APPROVED: 'aprobado',
    REJECTED: 'rechazado'
  };

  // Roles de usuario
  static USER_ROLES = {
    ADMIN: 1,
    OWNER: 2,
    EMPLOYEE: 3,
    CLIENT: 4
  };

  // ===== MÉTODOS CRUD BÁSICOS =====

  // Crear nueva solicitud de propietario
  static async createRequest(usuario_id, requestData) {
    const {
      nombre_negocio,
      direccion_negocio,
      telefono_negocio,
      correo_negocio,
      descripcion_negocio
    } = requestData;

    // Validaciones básicas
    if (!usuario_id || !nombre_negocio || !direccion_negocio) {
      throw new Error('Los campos usuario_id, nombre_negocio y direccion_negocio son obligatorios');
    }

    try {
      // Verificar que el usuario existe y no es ya propietario
      const userValidation = await this.validateUserForRequest(usuario_id);
      if (!userValidation.isValid) {
        throw new Error(userValidation.message);
      }

      // Verificar si ya tiene una solicitud pendiente
      const existingRequest = await this.getActiveRequestByUserId(usuario_id);
      if (existingRequest) {
        throw new Error('Ya tienes una solicitud pendiente. Espera a que sea procesada.');
      }

      // Crear la solicitud
      const query = `
        INSERT INTO solicitudes_propietario 
        (usuario_id, nombre_negocio, direccion_negocio, telefono_negocio, 
         correo_negocio, descripcion_negocio, estado, fecha_solicitud)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
      `;

      const params = [
        usuario_id,
        nombre_negocio,
        direccion_negocio,
        telefono_negocio || null,
        correo_negocio || null,
        descripcion_negocio || null,
        this.STATES.PENDING
      ];

      const result = await executeQuery(query, params);
      
      if (!result.success) {
        throw new Error(`Error al crear solicitud: ${result.error}`);
      }

      return {
        success: true,
        solicitud_id: result.data.insertId,
        message: 'Solicitud creada exitosamente. Está en espera de aprobación.',
        data: await this.getRequestById(result.data.insertId)
      };

    } catch (error) {
      throw new Error(`Error al crear solicitud: ${error.message}`);
    }
  }

  // Obtener todas las solicitudes con información del usuario
  static async getAllRequests(filters = {}) {
    let query = `
      SELECT 
        s.*,
        u.usuario_nombre,
        u.usuario_apellido,
        u.usuario_correo,
        u.usuario_telefono,
        u.usuario_fecha_registro
      FROM solicitudes_propietario s
      JOIN usuarios u ON s.usuario_id = u.usuario_id
    `;

    const params = [];
    const conditions = [];

    // Aplicar filtros
    if (filters.estado) {
      conditions.push('s.estado = ?');
      params.push(filters.estado);
    }

    if (filters.fecha_desde) {
      conditions.push('DATE(s.fecha_solicitud) >= ?');
      params.push(filters.fecha_desde);
    }

    if (filters.fecha_hasta) {
      conditions.push('DATE(s.fecha_solicitud) <= ?');
      params.push(filters.fecha_hasta);
    }

    if (filters.usuario_nombre) {
      conditions.push('(u.usuario_nombre LIKE ? OR u.usuario_apellido LIKE ?)');
      params.push(`%${filters.usuario_nombre}%`, `%${filters.usuario_nombre}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY s.fecha_solicitud DESC';

    const result = await executeQuery(query, params);
    
    if (!result.success) {
      throw new Error(`Error al obtener solicitudes: ${result.error}`);
    }

    return result.data;
  }

  // Obtener solicitud por ID
  static async getRequestById(solicitud_id) {
    const query = `
      SELECT 
        s.*,
        u.usuario_nombre,
        u.usuario_apellido,
        u.usuario_correo,
        u.usuario_telefono,
        u.usuario_fecha_registro
      FROM solicitudes_propietario s
      JOIN usuarios u ON s.usuario_id = u.usuario_id
      WHERE s.solicitud_id = ?
    `;

    const result = await executeQuery(query, [solicitud_id]);
    
    if (!result.success) {
      throw new Error(`Error al obtener solicitud: ${result.error}`);
    }

    return result.data[0] || null;
  }

  // Obtener solicitudes por usuario_id
  static async getRequestsByUserId(usuario_id) {
    const query = `
      SELECT 
        s.*,
        u.usuario_nombre,
        u.usuario_apellido,
        u.usuario_correo
      FROM solicitudes_propietario s
      JOIN usuarios u ON s.usuario_id = u.usuario_id
      WHERE s.usuario_id = ?
      ORDER BY s.fecha_solicitud DESC
    `;

    const result = await executeQuery(query, [usuario_id]);
    
    if (!result.success) {
      throw new Error(`Error al obtener solicitudes del usuario: ${result.error}`);
    }

    return result.data;
  }

  // Obtener solicitud activa (pendiente) por usuario_id
  static async getActiveRequestByUserId(usuario_id) {
    const query = `
      SELECT * FROM solicitudes_propietario 
      WHERE usuario_id = ? AND estado = ?
      ORDER BY fecha_solicitud DESC
      LIMIT 1
    `;

    const result = await executeQuery(query, [usuario_id, this.STATES.PENDING]);
    
    if (!result.success) {
      throw new Error(`Error al obtener solicitud activa: ${result.error}`);
    }

    return result.data[0] || null;
  }

  // ===== PROCESAMIENTO DE SOLICITUDES =====

  // Actualizar estado de solicitud (método principal)
  static async updateRequestStatus(solicitud_id, nuevo_estado, admin_id = null) {
    // Validar estado
    if (!Object.values(this.STATES).includes(nuevo_estado.toLowerCase())) {
      throw new Error(`Estado inválido: ${nuevo_estado}`);
    }

    const estadoNormalizado = nuevo_estado.toLowerCase();

    try {
      // Verificar que la solicitud existe
      const existingRequest = await this.getRequestById(solicitud_id);
      if (!existingRequest) {
        throw new Error('Solicitud no encontrada');
      }

      // Verificar que la solicitud está pendiente
      if (existingRequest.estado !== this.STATES.PENDING) {
        throw new Error(`La solicitud ya fue ${existingRequest.estado}`);
      }

      // Procesar según el estado
      if (estadoNormalizado === this.STATES.APPROVED) {
        return await this.approveRequest(solicitud_id, existingRequest.usuario_id, admin_id);
      } else if (estadoNormalizado === this.STATES.REJECTED) {
        return await this.rejectRequest(solicitud_id, admin_id);
      } else {
        throw new Error('Estado no válido para procesamiento');
      }

    } catch (error) {
      throw new Error(`Error al actualizar solicitud: ${error.message}`);
    }
  }

  // Aprobar solicitud (transacción completa)
  static async approveRequest(solicitud_id, usuario_id, admin_id = null) {
    const queries = [
      // 1. Actualizar estado de la solicitud
      {
        query: `
          UPDATE solicitudes_propietario 
          SET estado = ?, fecha_procesamiento = NOW(), procesado_por = ?
          WHERE solicitud_id = ?
        `,
        params: [this.STATES.APPROVED, admin_id, solicitud_id]
      },
      // 2. Crear registro de propietario
      {
        query: `
          INSERT INTO propietarios (usuario_id, propietario_fecha_registro, propietario_estado)
          VALUES (?, NOW(), 1)
        `,
        params: [usuario_id]
      },
      // 3. Actualizar rol del usuario
      {
        query: `
          UPDATE usuarios 
          SET rol_id = ?, rol_cambiado = 1
          WHERE usuario_id = ?
        `,
        params: [this.USER_ROLES.OWNER, usuario_id]
      }
    ];

    try {
      const result = await executeTransaction(queries);
      
      if (!result.success) {
        throw new Error(`Error en transacción de aprobación: ${result.error}`);
      }

      return {
        success: true,
        message: 'Solicitud aprobada exitosamente. El usuario ahora es propietario.',
        solicitud_id,
        usuario_id,
        estado: this.STATES.APPROVED,
        propietario_id: result.data[1].insertId,
        data: await this.getRequestById(solicitud_id)
      };

    } catch (error) {
      throw new Error(`Error al aprobar solicitud: ${error.message}`);
    }
  }

  // Rechazar solicitud
  static async rejectRequest(solicitud_id, admin_id = null) {
    const query = `
      UPDATE solicitudes_propietario 
      SET estado = ?, fecha_procesamiento = NOW(), procesado_por = ?
      WHERE solicitud_id = ?
    `;

    const result = await executeQuery(query, [this.STATES.REJECTED, admin_id, solicitud_id]);
    
    if (!result.success) {
      throw new Error(`Error al rechazar solicitud: ${result.error}`);
    }

    if (result.data.affectedRows === 0) {
      throw new Error('Solicitud no encontrada');
    }

    return {
      success: true,
      message: 'Solicitud rechazada exitosamente',
      solicitud_id,
      estado: this.STATES.REJECTED,
      data: await this.getRequestById(solicitud_id)
    };
  }

  // ===== VALIDACIONES Y UTILIDADES =====

  // Validar usuario para crear solicitud
  static async validateUserForRequest(usuario_id) {
    // Verificar que el usuario existe y está activo
    const userQuery = `
      SELECT usuario_id, rol_id, usuario_estado, usuario_nombre, usuario_apellido
      FROM usuarios 
      WHERE usuario_id = ?
    `;

    const userResult = await executeQuery(userQuery, [usuario_id]);
    
    if (!userResult.success) {
      return {
        isValid: false,
        message: 'Error al validar usuario'
      };
    }

    if (userResult.data.length === 0) {
      return {
        isValid: false,
        message: 'Usuario no encontrado'
      };
    }

    const user = userResult.data[0];

    if (user.usuario_estado !== 1) {
      return {
        isValid: false,
        message: 'Usuario inactivo'
      };
    }

    // Verificar que no es ya propietario
    if (user.rol_id === this.USER_ROLES.OWNER) {
      return {
        isValid: false,
        message: 'El usuario ya es propietario'
      };
    }

    // Verificar que no existe como propietario en la tabla
    const ownerQuery = 'SELECT propietario_id FROM propietarios WHERE usuario_id = ?';
    const ownerResult = await executeQuery(ownerQuery, [usuario_id]);
    
    if (ownerResult.success && ownerResult.data.length > 0) {
      return {
        isValid: false,
        message: 'El usuario ya está registrado como propietario'
      };
    }

    return {
      isValid: true,
      message: 'Usuario válido para solicitud'
    };
  }

  // ===== REPORTES Y ESTADÍSTICAS =====

  // Obtener estadísticas de solicitudes
  static async getRequestsStats(filters = {}) {
    let query = `
      SELECT 
        COUNT(*) as total_solicitudes,
        COUNT(CASE WHEN estado = '${this.STATES.PENDING}' THEN 1 END) as pendientes,
        COUNT(CASE WHEN estado = '${this.STATES.APPROVED}' THEN 1 END) as aprobadas,
        COUNT(CASE WHEN estado = '${this.STATES.REJECTED}' THEN 1 END) as rechazadas,
        ROUND(AVG(CASE WHEN estado != '${this.STATES.PENDING}' THEN 
          DATEDIFF(fecha_procesamiento, fecha_solicitud) END), 1) as dias_promedio_procesamiento
      FROM solicitudes_propietario
    `;

    const params = [];
    const conditions = [];

    if (filters.fecha_desde) {
      conditions.push('fecha_solicitud >= ?');
      params.push(filters.fecha_desde);
    }

    if (filters.fecha_hasta) {
      conditions.push('fecha_solicitud <= ?');
      params.push(filters.fecha_hasta);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const result = await executeQuery(query, params);
    
    if (!result.success) {
      throw new Error(`Error al obtener estadísticas: ${result.error}`);
    }

    return result.data[0];
  }

  // Obtener solicitudes por mes
  static async getRequestsTrends(months = 6) {
    const query = `
      SELECT 
        DATE_FORMAT(fecha_solicitud, '%Y-%m') AS mes,
        COUNT(*) AS total_solicitudes,
        COUNT(CASE WHEN estado = '${this.STATES.APPROVED}' THEN 1 END) as aprobadas,
        COUNT(CASE WHEN estado = '${this.STATES.REJECTED}' THEN 1 END) as rechazadas,
        COUNT(CASE WHEN estado = '${this.STATES.PENDING}' THEN 1 END) as pendientes
      FROM solicitudes_propietario
      GROUP BY mes
      ORDER BY mes DESC
      LIMIT ?
    `;

    const result = await executeQuery(query, [months]);
    
    if (!result.success) {
      throw new Error(`Error al obtener tendencias: ${result.error}`);
    }

    return result.data.reverse(); // Orden cronológico
  }

  // ===== MÉTODOS DE CONSULTA ESPECÍFICOS =====

  // Obtener solicitudes pendientes
  static async getPendingRequests() {
    return await this.getAllRequests({ estado: this.STATES.PENDING });
  }

  // Obtener solicitudes por estado
  static async getRequestsByStatus(estado) {
    if (!Object.values(this.STATES).includes(estado)) {
      throw new Error(`Estado inválido: ${estado}`);
    }

    return await this.getAllRequests({ estado });
  }

  // Contar solicitudes por estado
  static async countRequestsByStatus(estado) {
    const query = 'SELECT COUNT(*) as total FROM solicitudes_propietario WHERE estado = ?';
    const result = await executeQuery(query, [estado]);
    
    if (!result.success) {
      throw new Error(`Error al contar solicitudes: ${result.error}`);
    }

    return result.data[0]?.total || 0;
  }

  // Buscar solicitudes
  static async searchRequests(searchTerm) {
    const query = `
      SELECT 
        s.*,
        u.usuario_nombre,
        u.usuario_apellido,
        u.usuario_correo
      FROM solicitudes_propietario s
      JOIN usuarios u ON s.usuario_id = u.usuario_id
      WHERE s.nombre_negocio LIKE ?
      OR u.usuario_nombre LIKE ?
      OR u.usuario_apellido LIKE ?
      OR u.usuario_correo LIKE ?
      OR CONCAT(u.usuario_nombre, ' ', u.usuario_apellido) LIKE ?
      ORDER BY s.fecha_solicitud DESC
    `;

    const searchPattern = `%${searchTerm}%`;
    const params = Array(5).fill(searchPattern);
    
    const result = await executeQuery(query, params);
    
    if (!result.success) {
      throw new Error(`Error al buscar solicitudes: ${result.error}`);
    }

    return result.data;
  }

  // ===== MÉTODOS UTILITARIOS =====

  // Validar estado
  static isValidState(estado) {
    return Object.values(this.STATES).includes(estado.toLowerCase());
  }

  // Obtener estados disponibles
  static getAvailableStates() {
    return Object.values(this.STATES);
  }

  // Formatear solicitud para respuesta
  static formatRequestResponse(request) {
    if (!request) return null;

    return {
      ...request,
      puede_procesar: request.estado === this.STATES.PENDING,
      dias_desde_solicitud: Math.floor(
        (new Date() - new Date(request.fecha_solicitud)) / (1000 * 60 * 60 * 24)
      )
    };
  }
}

export default Request;