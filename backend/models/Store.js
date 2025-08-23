import { executeQuery, executeTransaction } from '../database/connectiondb.js';

class Store {
  // Estados válidos para tiendas
  static STATES = {
    ACTIVE: 1,
    INACTIVE: 0
  };

  // Tipos de tienda
  static TYPES = {
    PRINCIPAL: 'principal',
    SUCURSAL: 'sucursal',
    POPUP: 'popup',
    ONLINE: 'online'
  };

  // Estados de operación
  static OPERATION_STATUS = {
    ABIERTA: 'abierta',
    CERRADA: 'cerrada',
    MANTENIMIENTO: 'mantenimiento',
    TEMPORAL: 'temporal'
  };

  // ===== MÉTODOS CRUD BÁSICOS =====

  // Obtener todas las tiendas con información completa
  static async getAllStores(filters = {}) {
    let query = `
      SELECT 
        t.*,
        n.negocio_nombre,
        n.negocio_descripcion,
        n.negocio_estado,
        COUNT(DISTINCT e.empleado_id) as total_empleados,
        COUNT(CASE WHEN e.empleado_estado = 1 THEN 1 END) as empleados_activos,
        COUNT(DISTINCT s.servicio_id) as total_servicios,
        COUNT(CASE WHEN s.servicio_estado = 1 THEN 1 END) as servicios_activos,
        COUNT(DISTINCT c.cita_id) as total_citas,
        COUNT(CASE WHEN c.cita_estado = 'completada' THEN 1 END) as citas_completadas,
        SUM(CASE WHEN c.cita_estado = 'completada' THEN s.servicio_precio ELSE 0 END) as ingresos_totales
      FROM tiendas t
      LEFT JOIN negocios n ON t.negocio_id = n.negocio_id
      LEFT JOIN empleados e ON t.tienda_id = e.tienda_id
      LEFT JOIN servicios s ON t.tienda_id = s.tienda_id
      LEFT JOIN citas c ON s.servicio_id = c.servicio_id
    `;

    const params = [];
    const conditions = [];

    // Aplicar filtros
    if (filters.tienda_estado !== undefined) {
      conditions.push('t.tienda_estado = ?');
      params.push(filters.tienda_estado);
    } else {
      // Por defecto, mostrar solo activas
      conditions.push('t.tienda_estado = ?');
      params.push(this.STATES.ACTIVE);
    }

    if (filters.negocio_id) {
      conditions.push('t.negocio_id = ?');
      params.push(filters.negocio_id);
    }

    if (filters.tienda_ciudad) {
      conditions.push('t.tienda_ciudad LIKE ?');
      params.push(`%${filters.tienda_ciudad}%`);
    }

    if (filters.tienda_tipo) {
      conditions.push('t.tienda_tipo = ?');
      params.push(filters.tienda_tipo);
    }

    if (filters.search) {
      conditions.push('(t.tienda_nombre LIKE ? OR t.tienda_direccion LIKE ? OR t.tienda_ciudad LIKE ?)');
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (filters.fecha_apertura_desde) {
      conditions.push('t.tienda_fecha_apertura >= ?');
      params.push(filters.fecha_apertura_desde);
    }

    if (filters.fecha_apertura_hasta) {
      conditions.push('t.tienda_fecha_apertura <= ?');
      params.push(filters.fecha_apertura_hasta);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += `
      GROUP BY t.tienda_id
      ORDER BY t.tienda_nombre ASC
    `;

    const result = await executeQuery(query, params);
    
    if (!result.success) {
      throw new Error(`Error al obtener tiendas: ${result.error}`);
    }

    return result.data;
  }

  // Obtener tienda por ID con información completa
  static async getStoreById(tienda_id) {
    const query = `
      SELECT 
        t.*,
        n.negocio_nombre,
        n.negocio_descripcion,
        n.negocio_estado,
        n.negocio_telefono,
        n.negocio_correo,
        COUNT(DISTINCT e.empleado_id) as total_empleados,
        COUNT(CASE WHEN e.empleado_estado = 1 THEN 1 END) as empleados_activos,
        COUNT(DISTINCT s.servicio_id) as total_servicios,
        COUNT(CASE WHEN s.servicio_estado = 1 THEN 1 END) as servicios_activos,
        COUNT(DISTINCT c.cita_id) as total_citas,
        COUNT(CASE WHEN c.cita_estado = 'completada' THEN 1 END) as citas_completadas,
        COUNT(CASE WHEN c.cita_estado = 'cancelada' THEN 1 END) as citas_canceladas,
        SUM(CASE WHEN c.cita_estado = 'completada' THEN s.servicio_precio ELSE 0 END) as ingresos_totales,
        MIN(c.cita_fecha) as primera_cita,
        MAX(c.cita_fecha) as ultima_cita,
        AVG(CASE WHEN c.cita_estado = 'completada' THEN s.servicio_precio END) as ticket_promedio
      FROM tiendas t
      LEFT JOIN negocios n ON t.negocio_id = n.negocio_id
      LEFT JOIN empleados e ON t.tienda_id = e.tienda_id
      LEFT JOIN servicios s ON t.tienda_id = s.tienda_id
      LEFT JOIN citas c ON s.servicio_id = c.servicio_id
      WHERE t.tienda_id = ?
      GROUP BY t.tienda_id
    `;

    const result = await executeQuery(query, [tienda_id]);
    
    if (!result.success) {
      throw new Error(`Error al obtener tienda: ${result.error}`);
    }

    return result.data[0] || null;
  }

  // Crear nueva tienda
  static async createStore(storeData) {
    const {
      negocio_id,
      tienda_nombre,
      tienda_direccion,
      tienda_telefono,
      tienda_correo,
      tienda_ciudad,
      tienda_fecha_apertura,
      tienda_tipo = this.TYPES.SUCURSAL,
      tienda_estado_operacion = this.OPERATION_STATUS.ABIERTA,
      tienda_capacidad_maxima = 10,
      tienda_horario_apertura = '09:00',
      tienda_horario_cierre = '18:00'
    } = storeData;

    // Validaciones básicas
    if (!negocio_id || !tienda_nombre || !tienda_direccion || !tienda_ciudad) {
      throw new Error('Los campos negocio_id, tienda_nombre, tienda_direccion y tienda_ciudad son obligatorios');
    }

    // Validar email si se proporciona
    if (tienda_correo && !this.isValidEmail(tienda_correo)) {
      throw new Error('Formato de correo electrónico inválido');
    }

    // Validar teléfono si se proporciona
    if (tienda_telefono && !this.isValidPhone(tienda_telefono)) {
      throw new Error('Formato de teléfono inválido');
    }

    // Validar tipo de tienda
    if (!Object.values(this.TYPES).includes(tienda_tipo.toLowerCase())) {
      throw new Error(`Tipo de tienda inválido: ${tienda_tipo}. Debe ser uno de: ${Object.values(this.TYPES).join(', ')}`);
    }

    // Validar fecha de apertura
    if (tienda_fecha_apertura && new Date(tienda_fecha_apertura) > new Date()) {
      console.warn('La fecha de apertura es futura');
    }

    try {
      // Verificar que el negocio existe y está activo
      const businessValidation = await this.validateBusiness(negocio_id);
      if (!businessValidation.isValid) {
        throw new Error(businessValidation.message);
      }

      // Verificar que no existe una tienda con el mismo nombre en la misma ciudad para el mismo negocio
      const existingStore = await this.checkDuplicateStore(negocio_id, tienda_nombre, tienda_ciudad);
      if (existingStore) {
        throw new Error('Ya existe una tienda con ese nombre en esa ciudad para este negocio');
      }

      const query = `
        INSERT INTO tiendas 
        (negocio_id, tienda_nombre, tienda_direccion, tienda_telefono, 
         tienda_correo, tienda_ciudad, tienda_fecha_apertura, tienda_tipo,
         tienda_estado_operacion, tienda_capacidad_maxima, tienda_horario_apertura,
         tienda_horario_cierre, tienda_estado, fecha_creacion)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;

      const params = [
        negocio_id,
        tienda_nombre.trim(),
        tienda_direccion.trim(),
        tienda_telefono || null,
        tienda_correo || null,
        tienda_ciudad.trim(),
        tienda_fecha_apertura || new Date(),
        tienda_tipo.toLowerCase(),
        tienda_estado_operacion.toLowerCase(),
        tienda_capacidad_maxima,
        tienda_horario_apertura,
        tienda_horario_cierre,
        this.STATES.ACTIVE
      ];

      const result = await executeQuery(query, params);
      
      if (!result.success) {
        throw new Error(`Error al crear tienda: ${result.error}`);
      }

      return {
        success: true,
        tienda_id: result.data.insertId,
        message: 'Tienda creada exitosamente',
        data: await this.getStoreById(result.data.insertId)
      };

    } catch (error) {
      throw new Error(`Error al crear tienda: ${error.message}`);
    }
  }

  // Actualizar tienda
  static async updateStore(tienda_id, updateData) {
    const {
      negocio_id,
      tienda_nombre,
      tienda_direccion,
      tienda_telefono,
      tienda_correo,
      tienda_ciudad,
      tienda_fecha_apertura,
      tienda_tipo,
      tienda_estado_operacion,
      tienda_capacidad_maxima,
      tienda_horario_apertura,
      tienda_horario_cierre
    } = updateData;

    // Verificar que la tienda existe
    const existingStore = await this.getStoreById(tienda_id);
    if (!existingStore) {
      throw new Error('Tienda no encontrada');
    }

    // Validaciones si se proporcionan nuevos valores
    if (tienda_correo && !this.isValidEmail(tienda_correo)) {
      throw new Error('Formato de correo electrónico inválido');
    }

    if (tienda_telefono && !this.isValidPhone(tienda_telefono)) {
      throw new Error('Formato de teléfono inválido');
    }

    if (tienda_tipo && !Object.values(this.TYPES).includes(tienda_tipo.toLowerCase())) {
      throw new Error(`Tipo de tienda inválido: ${tienda_tipo}`);
    }

    if (tienda_estado_operacion && !Object.values(this.OPERATION_STATUS).includes(tienda_estado_operacion.toLowerCase())) {
      throw new Error(`Estado de operación inválido: ${tienda_estado_operacion}`);
    }

    // Verificar negocio si se cambia
    if (negocio_id && negocio_id !== existingStore.negocio_id) {
      const businessValidation = await this.validateBusiness(negocio_id);
      if (!businessValidation.isValid) {
        throw new Error(businessValidation.message);
      }
    }

    // Verificar duplicado si se cambia nombre o ciudad
    if ((tienda_nombre && tienda_nombre !== existingStore.tienda_nombre) ||
        (tienda_ciudad && tienda_ciudad !== existingStore.tienda_ciudad)) {
      const newNegocioId = negocio_id || existingStore.negocio_id;
      const newNombre = tienda_nombre || existingStore.tienda_nombre;
      const newCiudad = tienda_ciudad || existingStore.tienda_ciudad;
      
      const existingDuplicate = await this.checkDuplicateStore(newNegocioId, newNombre, newCiudad, tienda_id);
      if (existingDuplicate) {
        throw new Error('Ya existe una tienda con ese nombre en esa ciudad para este negocio');
      }
    }

    const query = `
      UPDATE tiendas 
      SET negocio_id = COALESCE(?, negocio_id),
          tienda_nombre = COALESCE(?, tienda_nombre),
          tienda_direccion = COALESCE(?, tienda_direccion),
          tienda_telefono = COALESCE(?, tienda_telefono),
          tienda_correo = COALESCE(?, tienda_correo),
          tienda_ciudad = COALESCE(?, tienda_ciudad),
          tienda_fecha_apertura = COALESCE(?, tienda_fecha_apertura),
          tienda_tipo = COALESCE(?, tienda_tipo),
          tienda_estado_operacion = COALESCE(?, tienda_estado_operacion),
          tienda_capacidad_maxima = COALESCE(?, tienda_capacidad_maxima),
          tienda_horario_apertura = COALESCE(?, tienda_horario_apertura),
          tienda_horario_cierre = COALESCE(?, tienda_horario_cierre),
          fecha_modificacion = NOW()
      WHERE tienda_id = ?
    `;

    const params = [
      negocio_id,
      tienda_nombre?.trim(),
      tienda_direccion?.trim(),
      tienda_telefono,
      tienda_correo,
      tienda_ciudad?.trim(),
      tienda_fecha_apertura,
      tienda_tipo?.toLowerCase(),
      tienda_estado_operacion?.toLowerCase(),
      tienda_capacidad_maxima,
      tienda_horario_apertura,
      tienda_horario_cierre,
      tienda_id
    ];

    const result = await executeQuery(query, params);
    
    if (!result.success) {
      throw new Error(`Error al actualizar tienda: ${result.error}`);
    }

    if (result.data.affectedRows === 0) {
      throw new Error('Tienda no encontrada');
    }

    return {
      success: true,
      message: 'Tienda actualizada exitosamente',
      affectedRows: result.data.affectedRows,
      data: await this.getStoreById(tienda_id)
    };
  }

  // Cambiar estado de la tienda
  static async changeStoreState(tienda_id, nuevo_estado) {
    // Validar estado
    if (!Object.values(this.STATES).includes(nuevo_estado)) {
      throw new Error(`Estado inválido: ${nuevo_estado}`);
    }

    // Si se va a desactivar, verificar citas futuras y empleados activos
    if (nuevo_estado === this.STATES.INACTIVE) {
      const hasFutureCitas = await this.hasFutureAppointments(tienda_id);
      if (hasFutureCitas) {
        throw new Error('No se puede desactivar una tienda con citas programadas');
      }

      const hasActiveEmployees = await this.hasActiveEmployees(tienda_id);
      if (hasActiveEmployees) {
        console.warn('La tienda tiene empleados activos. Considera desactivar primero a los empleados.');
      }
    }

    const query = 'UPDATE tiendas SET tienda_estado = ?, fecha_modificacion = NOW() WHERE tienda_id = ?';
    const result = await executeQuery(query, [nuevo_estado, tienda_id]);
    
    if (!result.success) {
      throw new Error(`Error al cambiar estado de la tienda: ${result.error}`);
    }

    if (result.data.affectedRows === 0) {
      throw new Error('Tienda no encontrada');
    }

    const estadoTexto = nuevo_estado === this.STATES.ACTIVE ? 'activada' : 'desactivada';
    return {
      success: true,
      message: `Tienda ${estadoTexto} exitosamente`,
      affectedRows: result.data.affectedRows
    };
  }

  // Eliminar tienda (hard delete con validaciones estrictas)
  static async deleteStore(tienda_id) {
    // Verificar que la tienda existe
    const existingStore = await this.getStoreById(tienda_id);
    if (!existingStore) {
      throw new Error('Tienda no encontrada');
    }

    // Verificar si hay datos asociados que impidan la eliminación
    const hasEmployees = await this.hasAnyEmployees(tienda_id);
    const hasServices = await this.hasAnyServices(tienda_id);
    const hasCitas = await this.hasAnyAppointments(tienda_id);

    if (hasEmployees || hasServices || hasCitas) {
      throw new Error('No se puede eliminar una tienda que tiene empleados, servicios o citas asociadas. Considera desactivarla en su lugar.');
    }

    const query = 'DELETE FROM tiendas WHERE tienda_id = ?';
    const result = await executeQuery(query, [tienda_id]);
    
    if (!result.success) {
      throw new Error(`Error al eliminar tienda: ${result.error}`);
    }

    return {
      success: true,
      message: 'Tienda eliminada exitosamente',
      affectedRows: result.data.affectedRows
    };
  }

  // ===== MÉTODOS DE CONSULTA ESPECÍFICOS =====

  // Obtener tiendas por negocio
  static async getStoresByBusiness(negocio_id, includeInactive = false) {
    const filters = { negocio_id };
    if (includeInactive) {
      filters.tienda_estado = undefined;
    }
    return await this.getAllStores(filters);
  }

  // Obtener empleados de una tienda
  static async getEmployeesByStore(tienda_id, includeInactive = false) {
    let query = `
      SELECT 
        e.*,
        u.usuario_nombre,
        u.usuario_apellido,
        u.usuario_correo,
        u.usuario_telefono,
        COUNT(DISTINCT c.cita_id) as total_citas,
        COUNT(CASE WHEN c.cita_estado = 'completada' THEN 1 END) as citas_completadas
      FROM empleados e
      INNER JOIN usuarios u ON e.usuario_id = u.usuario_id
      LEFT JOIN citas c ON e.empleado_id = c.empleado_id
      WHERE e.tienda_id = ?
    `;

    const params = [tienda_id];

    if (!includeInactive) {
      query += ' AND e.empleado_estado = 1';
    }

    query += `
      GROUP BY e.empleado_id
      ORDER BY u.usuario_nombre ASC, u.usuario_apellido ASC
    `;

    const result = await executeQuery(query, params);
    
    if (!result.success) {
      throw new Error(`Error al obtener empleados de la tienda: ${result.error}`);
    }

    return result.data;
  }

  // Obtener servicios de una tienda
  static async getServicesByStore(tienda_id, includeInactive = false) {
    let query = `
      SELECT 
        s.*,
        COUNT(DISTINCT c.cita_id) as total_citas,
        COUNT(CASE WHEN c.cita_estado = 'completada' THEN 1 END) as citas_completadas,
        SUM(CASE WHEN c.cita_estado = 'completada' THEN s.servicio_precio ELSE 0 END) as ingresos_totales
      FROM servicios s
      LEFT JOIN citas c ON s.servicio_id = c.servicio_id
      WHERE s.tienda_id = ?
    `;

    const params = [tienda_id];

    if (!includeInactive) {
      query += ' AND s.servicio_estado = 1';
    }

    query += `
      GROUP BY s.servicio_id
      ORDER BY s.servicio_nombre ASC
    `;

    const result = await executeQuery(query, params);
    
    if (!result.success) {
      throw new Error(`Error al obtener servicios de la tienda: ${result.error}`);
    }

    return result.data;
  }

  // Obtener tiendas por ciudad
  static async getStoresByCity(ciudad, filters = {}) {
    return await this.getAllStores({ ...filters, tienda_ciudad: ciudad });
  }

  // Buscar tiendas
  static async searchStores(searchTerm, filters = {}) {
    return await this.getAllStores({ ...filters, search: searchTerm });
  }

  // ===== VALIDACIONES Y UTILIDADES =====

  // Validar negocio
  static async validateBusiness(negocio_id) {
    const query = 'SELECT negocio_id, negocio_estado FROM negocios WHERE negocio_id = ?';
    const result = await executeQuery(query, [negocio_id]);
    
    if (!result.success) {
      return {
        isValid: false,
        message: 'Error al validar negocio'
      };
    }

    if (result.data.length === 0) {
      return {
        isValid: false,
        message: 'Negocio no encontrado'
      };
    }

    if (result.data[0].negocio_estado !== 1) {
      return {
        isValid: false,
        message: 'El negocio está inactivo'
      };
    }

    return {
      isValid: true,
      message: 'Negocio válido'
    };
  }

  // Verificar tienda duplicada
  static async checkDuplicateStore(negocio_id, tienda_nombre, tienda_ciudad, exclude_tienda_id = null) {
    let query = 'SELECT tienda_id FROM tiendas WHERE negocio_id = ? AND tienda_nombre = ? AND tienda_ciudad = ?';
    const params = [negocio_id, tienda_nombre.trim(), tienda_ciudad.trim()];

    if (exclude_tienda_id) {
      query += ' AND tienda_id != ?';
      params.push(exclude_tienda_id);
    }

    const result = await executeQuery(query, params);
    
    if (!result.success) {
      throw new Error(`Error al verificar tienda duplicada: ${result.error}`);
    }

    return result.data.length > 0;
  }

  // Verificar si tiene citas futuras
  static async hasFutureAppointments(tienda_id) {
    const query = `
      SELECT COUNT(*) as count 
      FROM citas c
      INNER JOIN servicios s ON c.servicio_id = s.servicio_id
      WHERE s.tienda_id = ? 
      AND c.cita_fecha >= CURDATE()
      AND c.cita_estado NOT IN ('cancelada', 'completada')
    `;

    const result = await executeQuery(query, [tienda_id]);
    
    if (!result.success) {
      throw new Error(`Error al verificar citas futuras: ${result.error}`);
    }

    return result.data[0]?.count > 0;
  }

  // Verificar si tiene empleados activos
  static async hasActiveEmployees(tienda_id) {
    const query = 'SELECT COUNT(*) as count FROM empleados WHERE tienda_id = ? AND empleado_estado = 1';
    const result = await executeQuery(query, [tienda_id]);
    
    if (!result.success) {
      throw new Error(`Error al verificar empleados activos: ${result.error}`);
    }

    return result.data[0]?.count > 0;
  }

  // Verificar si tiene empleados (cualquier estado)
  static async hasAnyEmployees(tienda_id) {
    const query = 'SELECT COUNT(*) as count FROM empleados WHERE tienda_id = ?';
    const result = await executeQuery(query, [tienda_id]);
    
    if (!result.success) {
      throw new Error(`Error al verificar empleados: ${result.error}`);
    }

    return result.data[0]?.count > 0;
  }

  // Verificar si tiene servicios
  static async hasAnyServices(tienda_id) {
    const query = 'SELECT COUNT(*) as count FROM servicios WHERE tienda_id = ?';
    const result = await executeQuery(query, [tienda_id]);
    
    if (!result.success) {
      throw new Error(`Error al verificar servicios: ${result.error}`);
    }

    return result.data[0]?.count > 0;
  }

  // Verificar si tiene citas
  static async hasAnyAppointments(tienda_id) {
    const query = `
      SELECT COUNT(*) as count 
      FROM citas c
      INNER JOIN servicios s ON c.servicio_id = s.servicio_id
      WHERE s.tienda_id = ?
    `;
    
    const result = await executeQuery(query, [tienda_id]);
    
    if (!result.success) {
      throw new Error(`Error al verificar citas: ${result.error}`);
    }

    return result.data[0]?.count > 0;
  }

  // Validar email
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validar teléfono
  static isValidPhone(phone) {
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,15}$/;
    return phoneRegex.test(phone);
  }

  // ===== REPORTES Y ESTADÍSTICAS =====

  // Obtener estadísticas de tiendas
  static async getStoreStats(filters = {}) {
    let query = `
      SELECT 
        COUNT(*) as total_tiendas,
        COUNT(CASE WHEN t.tienda_estado = 1 THEN 1 END) as tiendas_activas,
        COUNT(DISTINCT t.tienda_ciudad) as ciudades_atendidas,
        COUNT(DISTINCT t.negocio_id) as negocios_con_tiendas,
        AVG(DATEDIFF(CURDATE(), t.tienda_fecha_apertura)) as dias_promedio_operacion,
        MIN(t.tienda_fecha_apertura) as tienda_mas_antigua,
        MAX(t.tienda_fecha_apertura) as tienda_mas_reciente
      FROM tiendas t
    `;

    const params = [];
    const conditions = [];

    if (filters.negocio_id) {
      conditions.push('t.negocio_id = ?');
      params.push(filters.negocio_id);
    }

    if (filters.tienda_ciudad) {
      conditions.push('t.tienda_ciudad = ?');
      params.push(filters.tienda_ciudad);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const result = await executeQuery(query, params);
    
    if (!result.success) {
      throw new Error(`Error al obtener estadísticas de tiendas: ${result.error}`);
    }

    return result.data[0];
  }

  // Obtener tiendas con mejor rendimiento
  static async getTopPerformingStores(limit = 10, filters = {}) {
    let query = `
      SELECT 
        t.*,
        n.negocio_nombre,
        COUNT(DISTINCT c.cita_id) as total_citas,
        COUNT(CASE WHEN c.cita_estado = 'completada' THEN 1 END) as citas_completadas,
        SUM(CASE WHEN c.cita_estado = 'completada' THEN s.servicio_precio ELSE 0 END) as ingresos_totales,
        AVG(CASE WHEN c.cita_estado = 'completada' THEN s.servicio_precio END) as ticket_promedio,
        COUNT(DISTINCT e.empleado_id) as total_empleados,
        COUNT(DISTINCT s.servicio_id) as total_servicios,
        ROUND((COUNT(CASE WHEN c.cita_estado = 'completada' THEN 1 END) / COUNT(c.cita_id)) * 100, 2) as tasa_completacion
      FROM tiendas t
      LEFT JOIN negocios n ON t.negocio_id = n.negocio_id
      LEFT JOIN servicios s ON t.tienda_id = s.tienda_id
      LEFT JOIN citas c ON s.servicio_id = c.servicio_id
      LEFT JOIN empleados e ON t.tienda_id = e.tienda_id
      WHERE t.tienda_estado = 1
    `;

    const params = [];

    if (filters.fecha_desde) {
      query += ' AND c.cita_fecha >= ?';
      params.push(filters.fecha_desde);
    }

    if (filters.fecha_hasta) {
      query += ' AND c.cita_fecha <= ?';
      params.push(filters.fecha_hasta);
    }

    if (filters.negocio_id) {
      query += ' AND t.negocio_id = ?';
      params.push(filters.negocio_id);
    }

    query += `
      GROUP BY t.tienda_id
      HAVING total_citas > 0
      ORDER BY ingresos_totales DESC, citas_completadas DESC, tasa_completacion DESC
      LIMIT ?
    `;
    params.push(limit);

    const result = await executeQuery(query, params);
    
    if (!result.success) {
      throw new Error(`Error al obtener tiendas con mejor rendimiento: ${result.error}`);
    }

    return result.data;
  }

  // Obtener distribución de tiendas por ciudad
  static async getStoresByCity() {
    const query = `
      SELECT 
        t.tienda_ciudad,
        COUNT(*) as total_tiendas,
        COUNT(CASE WHEN t.tienda_estado = 1 THEN 1 END) as tiendas_activas,
        COUNT(DISTINCT t.negocio_id) as negocios_en_ciudad,
        COUNT(DISTINCT e.empleado_id) as total_empleados,
        COUNT(DISTINCT s.servicio_id) as total_servicios,
        SUM(CASE WHEN c.cita_estado = 'completada' THEN s.servicio_precio ELSE 0 END) as ingresos_ciudad
      FROM tiendas t
      LEFT JOIN empleados e ON t.tienda_id = e.tienda_id
      LEFT JOIN servicios s ON t.tienda_id = s.tienda_id
      LEFT JOIN citas c ON s.servicio_id = c.servicio_id
      GROUP BY t.tienda_ciudad
      ORDER BY total_tiendas DESC, tiendas_activas DESC
    `;

    const result = await executeQuery(query);
    
    if (!result.success) {
      throw new Error(`Error al obtener distribución de tiendas por ciudad: ${result.error}`);
    }

    return result.data;
  }

  // Obtener ocupación promedio de tiendas
  static async getStoreOccupancyStats(tienda_id = null, fecha_desde = null, fecha_hasta = null) {
    let query = `
      SELECT 
        t.tienda_id,
        t.tienda_nombre,
        t.tienda_capacidad_maxima,
        COUNT(DISTINCT DATE(c.cita_fecha)) as dias_con_actividad,
        COUNT(c.cita_id) as total_citas_periodo,
        COUNT(CASE WHEN c.cita_estado = 'completada' THEN 1 END) as citas_completadas_periodo,
        ROUND(AVG(citas_por_dia.citas_diarias), 2) as promedio_citas_por_dia,
        ROUND(MAX(citas_por_dia.citas_diarias), 0) as max_citas_en_un_dia,
        ROUND((AVG(citas_por_dia.citas_diarias) / t.tienda_capacidad_maxima) * 100, 2) as porcentaje_ocupacion_promedio
      FROM tiendas t
      LEFT JOIN servicios s ON t.tienda_id = s.tienda_id
      LEFT JOIN citas c ON s.servicio_id = c.servicio_id
      LEFT JOIN (
        SELECT 
          s2.tienda_id,
          DATE(c2.cita_fecha) as fecha,
          COUNT(c2.cita_id) as citas_diarias
        FROM servicios s2
        INNER JOIN citas c2 ON s2.servicio_id = c2.servicio_id
        WHERE c2.cita_estado NOT IN ('cancelada')
        GROUP BY s2.tienda_id, DATE(c2.cita_fecha)
      ) citas_por_dia ON t.tienda_id = citas_por_dia.tienda_id
      WHERE t.tienda_estado = 1
    `;

    const params = [];

    if (tienda_id) {
      query += ' AND t.tienda_id = ?';
      params.push(tienda_id);
    }

    if (fecha_desde) {
      query += ' AND c.cita_fecha >= ?';
      params.push(fecha_desde);
    }

    if (fecha_hasta) {
      query += ' AND c.cita_fecha <= ?';
      params.push(fecha_hasta);
    }

    query += `
      GROUP BY t.tienda_id
      ORDER BY porcentaje_ocupacion_promedio DESC
    `;

    const result = await executeQuery(query, params);
    
    if (!result.success) {
      throw new Error(`Error al obtener estadísticas de ocupación: ${result.error}`);
    }

    return result.data;
  }

  // ===== MÉTODOS UTILITARIOS =====

  // Obtener tipos disponibles
  static getAvailableTypes() {
    return Object.values(this.TYPES);
  }

  // Obtener estados de operación disponibles
  static getAvailableOperationStatuses() {
    return Object.values(this.OPERATION_STATUS);
  }

  // Validar tipo de tienda
  static isValidType(tipo) {
    return Object.values(this.TYPES).includes(tipo.toLowerCase());
  }

  // Validar estado de operación
  static isValidOperationStatus(estado) {
    return Object.values(this.OPERATION_STATUS).includes(estado.toLowerCase());
  }

  // Formatear tienda para respuesta
  static formatStoreResponse(store) {
    if (!store) return null;

    const fechaApertura = new Date(store.tienda_fecha_apertura);
    const diasOperacion = Math.floor((new Date() - fechaApertura) / (1000 * 60 * 60 * 24));
    const añosOperacion = Math.floor(diasOperacion / 365);
    
    // Calcular horarios
    const horarioApertura = store.tienda_horario_apertura || '09:00';
    const horarioCierre = store.tienda_horario_cierre || '18:00';
    const startTime = new Date(`1970-01-01T${horarioApertura}:00`);
    const endTime = new Date(`1970-01-01T${horarioCierre}:00`);
    const horasOperacion = (endTime - startTime) / (1000 * 60 * 60);

    return {
      ...store,
      dias_operacion: diasOperacion,
      años_operacion: añosOperacion,
      horas_operacion_diarias: horasOperacion,
      es_tienda_nueva: diasOperacion <= 90, // Menos de 3 meses
      es_tienda_establecida: diasOperacion >= 365, // Más de 1 año
      tasa_ocupacion: store.tienda_capacidad_maxima > 0 ? 
        Math.round((store.total_empleados / store.tienda_capacidad_maxima) * 100) : 0,
      estado_operacion_display: store.tienda_estado_operacion?.charAt(0).toUpperCase() + 
                               store.tienda_estado_operacion?.slice(1) || 'No definido',
      tipo_display: store.tienda_tipo?.charAt(0).toUpperCase() + 
                   store.tienda_tipo?.slice(1) || 'No definido',
      contacto_completo: {
        telefono: store.tienda_telefono || 'No disponible',
        correo: store.tienda_correo || 'No disponible',
        direccion_completa: `${store.tienda_direccion}, ${store.tienda_ciudad}`
      }
    };
  }

  // Calcular distancia entre tiendas (aproximada usando coordenadas si las tienes)
  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return Math.round(distance * 100) / 100;
  }

  // Verificar si la tienda está abierta en un horario específico
  static isStoreOpenAt(store, hora) {
    if (store.tienda_estado !== this.STATES.ACTIVE || 
        store.tienda_estado_operacion !== this.OPERATION_STATUS.ABIERTA) {
      return false;
    }

    const horaConsulta = new Date(`1970-01-01T${hora}:00`);
    const horaApertura = new Date(`1970-01-01T${store.tienda_horario_apertura || '09:00'}:00`);
    const horaCierre = new Date(`1970-01-01T${store.tienda_horario_cierre || '18:00'}:00`);

    return horaConsulta >= horaApertura && horaConsulta <= horaCierre;
  }

  // Obtener horario de atención formateado
  static getFormattedSchedule(store) {
    const apertura = store.tienda_horario_apertura || '09:00';
    const cierre = store.tienda_horario_cierre || '18:00';
    
    return {
      horario_completo: `${apertura} - ${cierre}`,
      apertura: apertura,
      cierre: cierre,
      esta_abierta_ahora: this.isStoreOpenAt(store, new Date().toTimeString().slice(0, 5)),
      proxima_apertura: apertura,
      proxima_cierre: cierre
    };
  }

  // Generar reporte de tienda
  static async generateStoreReport(tienda_id, fecha_desde = null, fecha_hasta = null) {
    const store = await this.getStoreById(tienda_id);
    if (!store) {
      throw new Error('Tienda no encontrada');
    }

    const employees = await this.getEmployeesByStore(tienda_id);
    const services = await this.getServicesByStore(tienda_id);
    const occupancyStats = await this.getStoreOccupancyStats(tienda_id, fecha_desde, fecha_hasta);

    return {
      informacion_general: this.formatStoreResponse(store),
      estadisticas_ocupacion: occupancyStats[0] || null,
      empleados: {
        total: employees.length,
        activos: employees.filter(emp => emp.empleado_estado === 1).length,
        lista: employees
      },
      servicios: {
        total: services.length,
        activos: services.filter(serv => serv.servicio_estado === 1).length,
        ingresos_totales: services.reduce((sum, serv) => sum + (serv.ingresos_totales || 0), 0),
        lista: services
      },
      horarios: this.getFormattedSchedule(store),
      fecha_reporte: new Date().toISOString(),
      periodo_analizado: {
        desde: fecha_desde || 'Todos los registros',
        hasta: fecha_hasta || 'Presente'
      }
    };
  }
}

export default Store;