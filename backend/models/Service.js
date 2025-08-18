import { executeQuery, executeTransaction } from '../database/connectiondb.js';

class Service {
  // Estados válidos para servicios
  static STATES = {
    ACTIVE: 1,
    INACTIVE: 0
  };

  // Tipos de servicio
  static TYPES = {
    INDIVIDUAL: 'individual',
    GRUPAL: 'grupal',
    DOMICILIO: 'domicilio'
  };

  // Categorías de servicio
  static CATEGORIES = {
    CORTE: 'corte',
    TINTE: 'tinte',
    TRATAMIENTO: 'tratamiento',
    PEINADO: 'peinado',
    MANICURE: 'manicure',
    PEDICURE: 'pedicure',
    FACIAL: 'facial',
    MASAJE: 'masaje',
    OTROS: 'otros'
  };

  // ===== MÉTODOS CRUD BÁSICOS =====

  // Obtener todos los servicios con información completa
  static async getAllServices(filters = {}) {
    let query = `
      SELECT 
        s.*,
        t.tienda_nombre,
        t.tienda_direccion,
        n.negocio_nombre,
        n.negocio_id,
        COUNT(DISTINCT c.cita_id) as total_citas,
        COUNT(CASE WHEN c.cita_estado = 'completada' THEN 1 END) as citas_completadas,
        AVG(CASE WHEN c.cita_estado = 'completada' THEN s.servicio_precio END) as precio_promedio_facturado
      FROM servicios s
      LEFT JOIN tiendas t ON s.tienda_id = t.tienda_id
      LEFT JOIN negocios n ON t.negocio_id = n.negocio_id
      LEFT JOIN citas c ON s.servicio_id = c.servicio_id
    `;

    const params = [];
    const conditions = [];

    // Aplicar filtros
    if (filters.servicio_estado !== undefined) {
      conditions.push('s.servicio_estado = ?');
      params.push(filters.servicio_estado);
    } else {
      // Por defecto, mostrar solo activos
      conditions.push('s.servicio_estado = ?');
      params.push(this.STATES.ACTIVE);
    }

    if (filters.tienda_id) {
      conditions.push('s.tienda_id = ?');
      params.push(filters.tienda_id);
    }

    if (filters.negocio_id) {
      conditions.push('n.negocio_id = ?');
      params.push(filters.negocio_id);
    }

    if (filters.servicio_categoria) {
      conditions.push('s.servicio_categoria = ?');
      params.push(filters.servicio_categoria);
    }

    if (filters.servicio_tipo) {
      conditions.push('s.servicio_tipo = ?');
      params.push(filters.servicio_tipo);
    }

    if (filters.precio_min) {
      conditions.push('s.servicio_precio >= ?');
      params.push(filters.precio_min);
    }

    if (filters.precio_max) {
      conditions.push('s.servicio_precio <= ?');
      params.push(filters.precio_max);
    }

    if (filters.duracion_min) {
      conditions.push('s.servicio_duracion >= ?');
      params.push(filters.duracion_min);
    }

    if (filters.duracion_max) {
      conditions.push('s.servicio_duracion <= ?');
      params.push(filters.duracion_max);
    }

    if (filters.search) {
      conditions.push('(s.servicio_nombre LIKE ? OR s.servicio_descripcion LIKE ?)');
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += `
      GROUP BY s.servicio_id
      ORDER BY s.servicio_nombre ASC
    `;

    const result = await executeQuery(query, params);
    
    if (!result.success) {
      throw new Error(`Error al obtener servicios: ${result.error}`);
    }

    return result.data;
  }

  // Obtener servicio por ID con información completa
  static async getServiceById(servicio_id) {
    const query = `
      SELECT 
        s.*,
        t.tienda_nombre,
        t.tienda_direccion,
        t.tienda_telefono,
        n.negocio_nombre,
        n.negocio_id,
        COUNT(DISTINCT c.cita_id) as total_citas,
        COUNT(CASE WHEN c.cita_estado = 'completada' THEN 1 END) as citas_completadas,
        COUNT(CASE WHEN c.cita_estado = 'cancelada' THEN 1 END) as citas_canceladas,
        AVG(CASE WHEN c.cita_estado = 'completada' THEN s.servicio_precio END) as precio_promedio_facturado,
        MIN(c.cita_fecha) as primera_cita,
        MAX(c.cita_fecha) as ultima_cita
      FROM servicios s
      LEFT JOIN tiendas t ON s.tienda_id = t.tienda_id
      LEFT JOIN negocios n ON t.negocio_id = n.negocio_id
      LEFT JOIN citas c ON s.servicio_id = c.servicio_id
      WHERE s.servicio_id = ?
      GROUP BY s.servicio_id
    `;

    const result = await executeQuery(query, [servicio_id]);
    
    if (!result.success) {
      throw new Error(`Error al obtener servicio: ${result.error}`);
    }

    return result.data[0] || null;
  }

  // Crear nuevo servicio
  static async createService(serviceData) {
    const {
      tienda_id,
      servicio_nombre,
      servicio_descripcion,
      servicio_precio,
      servicio_duracion,
      servicio_categoria,
      servicio_tipo = this.TYPES.INDIVIDUAL,
      servicio_capacidad_maxima = 1
    } = serviceData;

    // Validaciones básicas
    if (!tienda_id || !servicio_nombre || !servicio_precio || !servicio_duracion || !servicio_categoria) {
      throw new Error('Los campos tienda_id, servicio_nombre, servicio_precio, servicio_duracion y servicio_categoria son obligatorios');
    }

    // Validar precio
    if (servicio_precio <= 0) {
      throw new Error('El precio del servicio debe ser mayor a 0');
    }

    // Validar duración
    if (servicio_duracion <= 0) {
      throw new Error('La duración del servicio debe ser mayor a 0 minutos');
    }

    // Validar categoría
    if (!Object.values(this.CATEGORIES).includes(servicio_categoria.toLowerCase())) {
      throw new Error(`Categoría inválida: ${servicio_categoria}. Debe ser una de: ${Object.values(this.CATEGORIES).join(', ')}`);
    }

    // Validar tipo
    if (!Object.values(this.TYPES).includes(servicio_tipo.toLowerCase())) {
      throw new Error(`Tipo de servicio inválido: ${servicio_tipo}. Debe ser uno de: ${Object.values(this.TYPES).join(', ')}`);
    }

    try {
      // Verificar que la tienda existe
      const storeValidation = await this.validateStore(tienda_id);
      if (!storeValidation.isValid) {
        throw new Error(storeValidation.message);
      }

      // Verificar que no existe un servicio con el mismo nombre en la tienda
      const existingService = await this.checkDuplicateService(tienda_id, servicio_nombre);
      if (existingService) {
        throw new Error('Ya existe un servicio con ese nombre en esta tienda');
      }

      const query = `
        INSERT INTO servicios 
        (tienda_id, servicio_nombre, servicio_descripcion, servicio_precio, 
         servicio_duracion, servicio_categoria, servicio_tipo, servicio_capacidad_maxima,
         servicio_estado, fecha_creacion)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;

      const params = [
        tienda_id,
        servicio_nombre.trim(),
        servicio_descripcion ? servicio_descripcion.trim() : null,
        servicio_precio,
        servicio_duracion,
        servicio_categoria.toLowerCase(),
        servicio_tipo.toLowerCase(),
        servicio_capacidad_maxima,
        this.STATES.ACTIVE
      ];

      const result = await executeQuery(query, params);
      
      if (!result.success) {
        throw new Error(`Error al crear servicio: ${result.error}`);
      }

      return {
        success: true,
        servicio_id: result.data.insertId,
        message: 'Servicio creado exitosamente',
        data: await this.getServiceById(result.data.insertId)
      };

    } catch (error) {
      throw new Error(`Error al crear servicio: ${error.message}`);
    }
  }

  // Actualizar servicio
  static async updateService(servicio_id, updateData) {
    const {
      tienda_id,
      servicio_nombre,
      servicio_descripcion,
      servicio_precio,
      servicio_duracion,
      servicio_categoria,
      servicio_tipo,
      servicio_capacidad_maxima
    } = updateData;

    // Verificar que el servicio existe
    const existingService = await this.getServiceById(servicio_id);
    if (!existingService) {
      throw new Error('Servicio no encontrado');
    }

    // Validaciones si se proporcionan nuevos valores
    if (servicio_precio !== undefined && servicio_precio <= 0) {
      throw new Error('El precio del servicio debe ser mayor a 0');
    }

    if (servicio_duracion !== undefined && servicio_duracion <= 0) {
      throw new Error('La duración del servicio debe ser mayor a 0 minutos');
    }

    if (servicio_categoria && !Object.values(this.CATEGORIES).includes(servicio_categoria.toLowerCase())) {
      throw new Error(`Categoría inválida: ${servicio_categoria}`);
    }

    if (servicio_tipo && !Object.values(this.TYPES).includes(servicio_tipo.toLowerCase())) {
      throw new Error(`Tipo de servicio inválido: ${servicio_tipo}`);
    }

    // Verificar tienda si se cambia
    if (tienda_id && tienda_id !== existingService.tienda_id) {
      const storeValidation = await this.validateStore(tienda_id);
      if (!storeValidation.isValid) {
        throw new Error(storeValidation.message);
      }
    }

    // Verificar nombre duplicado si se cambia
    if (servicio_nombre && servicio_nombre !== existingService.servicio_nombre) {
      const newTiendaId = tienda_id || existingService.tienda_id;
      const existingDuplicate = await this.checkDuplicateService(newTiendaId, servicio_nombre, servicio_id);
      if (existingDuplicate) {
        throw new Error('Ya existe un servicio con ese nombre en esta tienda');
      }
    }

    // Verificar si hay citas futuras antes de hacer cambios de precio o duración significativos
    if ((servicio_precio && Math.abs(servicio_precio - existingService.servicio_precio) > existingService.servicio_precio * 0.2) ||
        (servicio_duracion && Math.abs(servicio_duracion - existingService.servicio_duracion) > 15)) {
      const hasFutureCitas = await this.hasFutureAppointments(servicio_id);
      if (hasFutureCitas) {
        console.warn('Servicio tiene citas futuras, los cambios pueden afectar las citas programadas');
      }
    }

    const query = `
      UPDATE servicios 
      SET tienda_id = COALESCE(?, tienda_id),
          servicio_nombre = COALESCE(?, servicio_nombre),
          servicio_descripcion = COALESCE(?, servicio_descripcion),
          servicio_precio = COALESCE(?, servicio_precio),
          servicio_duracion = COALESCE(?, servicio_duracion),
          servicio_categoria = COALESCE(?, servicio_categoria),
          servicio_tipo = COALESCE(?, servicio_tipo),
          servicio_capacidad_maxima = COALESCE(?, servicio_capacidad_maxima),
          fecha_modificacion = NOW()
      WHERE servicio_id = ?
    `;

    const params = [
      tienda_id,
      servicio_nombre?.trim(),
      servicio_descripcion?.trim(),
      servicio_precio,
      servicio_duracion,
      servicio_categoria?.toLowerCase(),
      servicio_tipo?.toLowerCase(),
      servicio_capacidad_maxima,
      servicio_id
    ];

    const result = await executeQuery(query, params);
    
    if (!result.success) {
      throw new Error(`Error al actualizar servicio: ${result.error}`);
    }

    if (result.data.affectedRows === 0) {
      throw new Error('Servicio no encontrado');
    }

    return {
      success: true,
      message: 'Servicio actualizado exitosamente',
      affectedRows: result.data.affectedRows,
      data: await this.getServiceById(servicio_id)
    };
  }

  // Cambiar estado del servicio
  static async changeServiceState(servicio_id, nuevo_estado) {
    // Validar estado
    if (!Object.values(this.STATES).includes(nuevo_estado)) {
      throw new Error(`Estado inválido: ${nuevo_estado}`);
    }

    // Si se va a desactivar, verificar citas futuras
    if (nuevo_estado === this.STATES.INACTIVE) {
      const hasFutureCitas = await this.hasFutureAppointments(servicio_id);
      if (hasFutureCitas) {
        throw new Error('No se puede desactivar un servicio con citas programadas');
      }
    }

    const query = 'UPDATE servicios SET servicio_estado = ?, fecha_modificacion = NOW() WHERE servicio_id = ?';
    const result = await executeQuery(query, [nuevo_estado, servicio_id]);
    
    if (!result.success) {
      throw new Error(`Error al cambiar estado del servicio: ${result.error}`);
    }

    if (result.data.affectedRows === 0) {
      throw new Error('Servicio no encontrado');
    }

    const estadoTexto = nuevo_estado === this.STATES.ACTIVE ? 'activado' : 'desactivado';
    return {
      success: true,
      message: `Servicio ${estadoTexto} exitosamente`,
      affectedRows: result.data.affectedRows
    };
  }

  // Eliminar servicio (hard delete con validaciones)
  static async deleteService(servicio_id) {
    // Verificar que el servicio existe
    const existingService = await this.getServiceById(servicio_id);
    if (!existingService) {
      throw new Error('Servicio no encontrado');
    }

    // Verificar si hay citas asociadas
    const hasCitas = await this.hasAnyAppointments(servicio_id);
    if (hasCitas) {
      throw new Error('No se puede eliminar un servicio que tiene citas asociadas. Considera desactivarlo en su lugar.');
    }

    const query = 'DELETE FROM servicios WHERE servicio_id = ?';
    const result = await executeQuery(query, [servicio_id]);
    
    if (!result.success) {
      throw new Error(`Error al eliminar servicio: ${result.error}`);
    }

    return {
      success: true,
      message: 'Servicio eliminado exitosamente',
      affectedRows: result.data.affectedRows
    };
  }

  // ===== MÉTODOS DE CONSULTA ESPECÍFICOS =====

  // Obtener servicios por tienda
  static async getServicesByStore(tienda_id, includeInactive = false) {
    const filters = { tienda_id };
    if (includeInactive) {
      filters.servicio_estado = undefined;
    }
    return await this.getAllServices(filters);
  }

  // Obtener servicios por categoría
  static async getServicesByCategory(servicio_categoria, filters = {}) {
    return await this.getAllServices({ ...filters, servicio_categoria: servicio_categoria.toLowerCase() });
  }

  // Obtener servicios por rango de precios
  static async getServicesByPriceRange(precio_min, precio_max, filters = {}) {
    return await this.getAllServices({ ...filters, precio_min, precio_max });
  }

  // Obtener servicios por duración
  static async getServicesByDuration(duracion_min, duracion_max = null, filters = {}) {
    const newFilters = { ...filters, duracion_min };
    if (duracion_max) {
      newFilters.duracion_max = duracion_max;
    }
    return await this.getAllServices(newFilters);
  }

  // Buscar servicios
  static async searchServices(searchTerm, filters = {}) {
    return await this.getAllServices({ ...filters, search: searchTerm });
  }

  // ===== VALIDACIONES Y UTILIDADES =====

  // Validar tienda
  static async validateStore(tienda_id) {
    const query = 'SELECT tienda_id, tienda_estado FROM tiendas WHERE tienda_id = ?';
    const result = await executeQuery(query, [tienda_id]);
    
    if (!result.success) {
      return {
        isValid: false,
        message: 'Error al validar tienda'
      };
    }

    if (result.data.length === 0) {
      return {
        isValid: false,
        message: 'Tienda no encontrada'
      };
    }

    if (result.data[0].tienda_estado !== 1) {
      return {
        isValid: false,
        message: 'La tienda está inactiva'
      };
    }

    return {
      isValid: true,
      message: 'Tienda válida'
    };
  }

  // Verificar servicio duplicado
  static async checkDuplicateService(tienda_id, servicio_nombre, exclude_servicio_id = null) {
    let query = 'SELECT servicio_id FROM servicios WHERE tienda_id = ? AND servicio_nombre = ?';
    const params = [tienda_id, servicio_nombre.trim()];

    if (exclude_servicio_id) {
      query += ' AND servicio_id != ?';
      params.push(exclude_servicio_id);
    }

    const result = await executeQuery(query, params);
    
    if (!result.success) {
      throw new Error(`Error al verificar servicio duplicado: ${result.error}`);
    }

    return result.data.length > 0;
  }

  // Verificar si tiene citas futuras
  static async hasFutureAppointments(servicio_id) {
    const query = `
      SELECT COUNT(*) as count 
      FROM citas 
      WHERE servicio_id = ? 
      AND cita_fecha >= CURDATE()
      AND cita_estado NOT IN ('cancelada', 'completada')
    `;

    const result = await executeQuery(query, [servicio_id]);
    
    if (!result.success) {
      throw new Error(`Error al verificar citas futuras: ${result.error}`);
    }

    return result.data[0]?.count > 0;
  }

  // Verificar si tiene citas (cualquier fecha)
  static async hasAnyAppointments(servicio_id) {
    const query = 'SELECT COUNT(*) as count FROM citas WHERE servicio_id = ?';
    const result = await executeQuery(query, [servicio_id]);
    
    if (!result.success) {
      throw new Error(`Error al verificar citas: ${result.error}`);
    }

    return result.data[0]?.count > 0;
  }

  // ===== REPORTES Y ESTADÍSTICAS =====

  // Obtener estadísticas de servicios
  static async getServiceStats(filters = {}) {
    let query = `
      SELECT 
        COUNT(*) as total_servicios,
        COUNT(CASE WHEN s.servicio_estado = 1 THEN 1 END) as servicios_activos,
        COUNT(DISTINCT s.servicio_categoria) as categorias_disponibles,
        COUNT(DISTINCT s.tienda_id) as tiendas_con_servicios,
        AVG(s.servicio_precio) as precio_promedio,
        MIN(s.servicio_precio) as precio_minimo,
        MAX(s.servicio_precio) as precio_maximo,
        AVG(s.servicio_duracion) as duracion_promedio,
        MIN(s.servicio_duracion) as duracion_minima,
        MAX(s.servicio_duracion) as duracion_maxima
      FROM servicios s
    `;

    const params = [];
    const conditions = [];

    if (filters.tienda_id) {
      conditions.push('s.tienda_id = ?');
      params.push(filters.tienda_id);
    }

    if (filters.negocio_id) {
      query += ' LEFT JOIN tiendas t ON s.tienda_id = t.tienda_id';
      conditions.push('t.negocio_id = ?');
      params.push(filters.negocio_id);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const result = await executeQuery(query, params);
    
    if (!result.success) {
      throw new Error(`Error al obtener estadísticas de servicios: ${result.error}`);
    }

    return result.data[0];
  }

  // Obtener servicios más solicitados
  static async getMostRequestedServices(limit = 10, filters = {}) {
    let query = `
      SELECT 
        s.*,
        t.tienda_nombre,
        COUNT(c.cita_id) as total_citas,
        COUNT(CASE WHEN c.cita_estado = 'completada' THEN 1 END) as citas_completadas,
        SUM(CASE WHEN c.cita_estado = 'completada' THEN s.servicio_precio ELSE 0 END) as ingresos_totales,
        AVG(CASE WHEN c.cita_estado = 'completada' THEN s.servicio_precio END) as precio_promedio
      FROM servicios s
      LEFT JOIN tiendas t ON s.tienda_id = t.tienda_id
      LEFT JOIN citas c ON s.servicio_id = c.servicio_id
      WHERE s.servicio_estado = 1
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

    if (filters.tienda_id) {
      query += ' AND s.tienda_id = ?';
      params.push(filters.tienda_id);
    }

    query += `
      GROUP BY s.servicio_id
      HAVING total_citas > 0
      ORDER BY total_citas DESC, citas_completadas DESC
      LIMIT ?
    `;
    params.push(limit);

    const result = await executeQuery(query, params);
    
    if (!result.success) {
      throw new Error(`Error al obtener servicios más solicitados: ${result.error}`);
    }

    return result.data;
  }

  // Obtener servicios por categoría con estadísticas
  static async getServicesByCategory(categoria = null) {
    let query = `
      SELECT 
        s.servicio_categoria,
        COUNT(*) as total_servicios,
        COUNT(CASE WHEN s.servicio_estado = 1 THEN 1 END) as servicios_activos,
        AVG(s.servicio_precio) as precio_promedio,
        MIN(s.servicio_precio) as precio_minimo,
        MAX(s.servicio_precio) as precio_maximo,
        AVG(s.servicio_duracion) as duracion_promedio,
        COUNT(DISTINCT c.cita_id) as total_citas_categoria
      FROM servicios s
      LEFT JOIN citas c ON s.servicio_id = c.servicio_id AND c.cita_estado = 'completada'
    `;

    const params = [];

    if (categoria) {
      query += ' WHERE s.servicio_categoria = ?';
      params.push(categoria.toLowerCase());
    }

    query += `
      GROUP BY s.servicio_categoria
      ORDER BY total_servicios DESC, precio_promedio DESC
    `;

    const result = await executeQuery(query, params);
    
    if (!result.success) {
      throw new Error(`Error al obtener servicios por categoría: ${result.error}`);
    }

    return result.data;
  }

  // ===== MÉTODOS UTILITARIOS =====

  // Obtener categorías disponibles
  static getAvailableCategories() {
    return Object.values(this.CATEGORIES);
  }

  // Obtener tipos disponibles
  static getAvailableTypes() {
    return Object.values(this.TYPES);
  }

  // Validar categoría
  static isValidCategory(categoria) {
    return Object.values(this.CATEGORIES).includes(categoria.toLowerCase());
  }

  // Validar tipo
  static isValidType(tipo) {
    return Object.values(this.TYPES).includes(tipo.toLowerCase());
  }

  // Formatear servicio para respuesta
  static formatServiceResponse(service) {
    if (!service) return null;

    const precioPorMinuto = service.servicio_precio / service.servicio_duracion;
    const categoriaCapitalizada = service.servicio_categoria.charAt(0).toUpperCase() + 
                                 service.servicio_categoria.slice(1);

    return {
      ...service,
      servicio_categoria_display: categoriaCapitalizada,
      precio_por_minuto: Math.round(precioPorMinuto * 100) / 100,
      duracion_horas: Math.round(service.servicio_duracion / 60 * 100) / 100,
      es_servicio_largo: service.servicio_duracion > 120, // Más de 2 horas
      es_servicio_premium: service.servicio_precio > 100000, // Precio alto (ajustar según moneda)
      disponibilidad_estimada: service.servicio_capacidad_maxima > 1 ? 'grupal' : 'individual'
    };
  }

  // Calcular precio con descuento
  static calculateDiscountedPrice(precio_original, porcentaje_descuento) {
    if (porcentaje_descuento < 0 || porcentaje_descuento > 100) {
      throw new Error('El porcentaje de descuento debe estar entre 0 y 100');
    }
    
    const descuento = (precio_original * porcentaje_descuento) / 100;
    return Math.round((precio_original - descuento) * 100) / 100;
  }

  // Estimar tiempo total para múltiples servicios
  static calculateTotalDuration(servicios) {
    if (!Array.isArray(servicios) || servicios.length === 0) {
      return 0;
    }

    return servicios.reduce((total, servicio) => {
      return total + (servicio.servicio_duracion || 0);
    }, 0);
  }
}

export default Service;