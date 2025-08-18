import { executeQuery, executeTransaction } from '../database/connectiondb.js';

class Reports {
  // Estados válidos para reportes
  static APPOINTMENT_STATES = {
    PENDING: 'pendiente',
    CONFIRMED: 'confirmada',
    COMPLETED: 'completada',
    CANCELLED: 'cancelada'
  };

  // Períodos válidos para reportes
  static PERIODS = {
    LAST_7_DAYS: 7,
    LAST_30_DAYS: 30,
    LAST_90_DAYS: 90,
    LAST_6_MONTHS: 180,
    LAST_YEAR: 365
  };

  // ===== REPORTES DE CITAS =====

  // Obtener todas las citas por estado con información completa
  static async getAllAppointmentsByState(cita_estado, filters = {}) {
    let query = `
      SELECT 
        c.*,
        u.usuario_nombre AS cliente_nombre, u.usuario_apellido AS cliente_apellido,
        ue.usuario_nombre AS empleado_nombre, ue.usuario_apellido AS empleado_apellido,
        s.servicio_nombre, s.servicio_precio, s.servicio_duracion,
        t.tienda_nombre,
        n.negocio_nombre,
        h.horario_inicio, h.horario_fin
      FROM citas c
      LEFT JOIN usuarios u ON c.usuario_id = u.usuario_id
      LEFT JOIN empleados e ON c.empleado_id = e.empleado_id
      LEFT JOIN usuarios ue ON e.usuario_id = ue.usuario_id
      LEFT JOIN servicios s ON c.servicio_id = s.servicio_id
      LEFT JOIN tiendas t ON c.tienda_id = t.tienda_id
      LEFT JOIN negocios n ON t.negocio_id = n.negocio_id
      LEFT JOIN horarios h ON c.horario_id = h.horario_id
      WHERE c.cita_estado = ?
    `;

    const params = [cita_estado];
    const conditions = [];

    // Aplicar filtros adicionales
    if (filters.negocio_id) {
      conditions.push('n.negocio_id = ?');
      params.push(filters.negocio_id);
    }

    if (filters.tienda_id) {
      conditions.push('c.tienda_id = ?');
      params.push(filters.tienda_id);
    }

    if (filters.fecha_desde) {
      conditions.push('c.cita_fecha >= ?');
      params.push(filters.fecha_desde);
    }

    if (filters.fecha_hasta) {
      conditions.push('c.cita_fecha <= ?');
      params.push(filters.fecha_hasta);
    }

    if (conditions.length > 0) {
      query += ' AND ' + conditions.join(' AND ');
    }

    query += ' ORDER BY c.cita_fecha DESC, h.horario_inicio ASC';

    const result = await executeQuery(query, params);
    
    if (!result.success) {
      throw new Error(`Error al obtener citas por estado: ${result.error}`);
    }

    return result.data;
  }

  // Obtener todas las citas por día específico con información completa
  static async getAppointmentsByDay(cita_fecha, filters = {}) {
    let query = `
      SELECT 
        c.*,
        u.usuario_nombre AS cliente_nombre, u.usuario_apellido AS cliente_apellido,
        ue.usuario_nombre AS empleado_nombre, ue.usuario_apellido AS empleado_apellido,
        s.servicio_nombre, s.servicio_precio,
        t.tienda_nombre,
        h.horario_inicio, h.horario_fin
      FROM citas c
      LEFT JOIN usuarios u ON c.usuario_id = u.usuario_id
      LEFT JOIN empleados e ON c.empleado_id = e.empleado_id
      LEFT JOIN usuarios ue ON e.usuario_id = ue.usuario_id
      LEFT JOIN servicios s ON c.servicio_id = s.servicio_id
      LEFT JOIN tiendas t ON c.tienda_id = t.tienda_id
      LEFT JOIN horarios h ON c.horario_id = h.horario_id
      WHERE DATE(c.cita_fecha) = ?
    `;

    const params = [cita_fecha];
    const conditions = [];

    if (filters.tienda_id) {
      conditions.push('c.tienda_id = ?');
      params.push(filters.tienda_id);
    }

    if (filters.cita_estado) {
      conditions.push('c.cita_estado = ?');
      params.push(filters.cita_estado);
    }

    if (conditions.length > 0) {
      query += ' AND ' + conditions.join(' AND ');
    }

    query += ' ORDER BY h.horario_inicio ASC';

    const result = await executeQuery(query, params);
    
    if (!result.success) {
      throw new Error(`Error al obtener citas por día: ${result.error}`);
    }

    return result.data;
  }

  // ===== REPORTES DE SERVICIOS =====

  // Servicios más agendados con información completa
  static async getMostScheduledServices(limit = 5, filters = {}) {
    let query = `
      SELECT 
        s.servicio_id,
        s.servicio_nombre,
        s.servicio_precio,
        s.servicio_duracion,
        COUNT(c.cita_id) as total_citas,
        COUNT(CASE WHEN c.cita_estado = 'completada' THEN 1 END) as citas_completadas,
        ROUND(AVG(s.servicio_precio), 2) as precio_promedio,
        SUM(CASE WHEN c.cita_estado = 'completada' THEN s.servicio_precio ELSE 0 END) as ingresos_generados
      FROM servicios s
      LEFT JOIN citas c ON s.servicio_id = c.servicio_id
    `;

    const params = [];
    const conditions = ['s.servicio_estado = 1'];

    // Aplicar filtros
    if (filters.negocio_id) {
      query += ' LEFT JOIN tiendas t ON c.tienda_id = t.tienda_id';
      conditions.push('t.negocio_id = ?');
      params.push(filters.negocio_id);
    }

    if (filters.fecha_desde) {
      conditions.push('c.cita_fecha >= ?');
      params.push(filters.fecha_desde);
    }

    if (filters.fecha_hasta) {
      conditions.push('c.cita_fecha <= ?');
      params.push(filters.fecha_hasta);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += `
      GROUP BY s.servicio_id
      HAVING total_citas > 0
      ORDER BY total_citas DESC
      LIMIT ?
    `;
    params.push(limit);

    const result = await executeQuery(query, params);
    
    if (!result.success) {
      throw new Error(`Error al obtener servicios más agendados: ${result.error}`);
    }

    return result.data;
  }

  // ===== REPORTES DE EMPLEADOS =====

  // Empleados más agendados con información completa
  static async getMostScheduledEmployees(limit = 5, filters = {}) {
    let query = `
      SELECT 
        e.empleado_id,
        u.usuario_nombre AS empleado_nombre,
        u.usuario_apellido AS empleado_apellido,
        e.empleado_especialidad,
        t.tienda_nombre,
        COUNT(c.cita_id) as total_citas,
        COUNT(CASE WHEN c.cita_estado = 'completada' THEN 1 END) as citas_completadas,
        COUNT(CASE WHEN c.cita_estado = 'cancelada' THEN 1 END) as citas_canceladas,
        ROUND(AVG(CASE WHEN c.cita_estado = 'completada' THEN s.servicio_precio END), 2) as ingreso_promedio_por_cita,
        SUM(CASE WHEN c.cita_estado = 'completada' THEN s.servicio_precio ELSE 0 END) as ingresos_generados
      FROM empleados e
      JOIN usuarios u ON e.usuario_id = u.usuario_id
      JOIN tiendas t ON e.tienda_id = t.tienda_id
      LEFT JOIN citas c ON e.empleado_id = c.empleado_id
      LEFT JOIN servicios s ON c.servicio_id = s.servicio_id
    `;

    const params = [];
    const conditions = ['e.empleado_estado = 1'];

    // Aplicar filtros
    if (filters.negocio_id) {
      conditions.push('t.negocio_id = ?');
      params.push(filters.negocio_id);
    }

    if (filters.tienda_id) {
      conditions.push('e.tienda_id = ?');
      params.push(filters.tienda_id);
    }

    if (filters.fecha_desde) {
      conditions.push('c.cita_fecha >= ?');
      params.push(filters.fecha_desde);
    }

    if (filters.fecha_hasta) {
      conditions.push('c.cita_fecha <= ?');
      params.push(filters.fecha_hasta);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += `
      GROUP BY e.empleado_id
      HAVING total_citas > 0
      ORDER BY total_citas DESC
      LIMIT ?
    `;
    params.push(limit);

    const result = await executeQuery(query, params);
    
    if (!result.success) {
      throw new Error(`Error al obtener empleados más agendados: ${result.error}`);
    }

    return result.data;
  }

  // ===== REPORTES DE TIENDAS =====

  // Tiendas con más citas
  static async getTopStores(negocio_id = null, limit = 5, filters = {}) {
    let query = `
      SELECT 
        t.tienda_id,
        t.tienda_nombre,
        t.tienda_direccion,
        n.negocio_nombre,
        COUNT(c.cita_id) as total_citas,
        COUNT(CASE WHEN c.cita_estado = 'completada' THEN 1 END) as citas_completadas,
        COUNT(CASE WHEN c.cita_estado = 'cancelada' THEN 1 END) as citas_canceladas,
        SUM(CASE WHEN c.cita_estado = 'completada' THEN s.servicio_precio ELSE 0 END) as ingresos_generados,
        COUNT(DISTINCT e.empleado_id) as total_empleados
      FROM tiendas t
      JOIN negocios n ON t.negocio_id = n.negocio_id
      LEFT JOIN citas c ON t.tienda_id = c.tienda_id
      LEFT JOIN servicios s ON c.servicio_id = s.servicio_id
      LEFT JOIN empleados e ON t.tienda_id = e.tienda_id AND e.empleado_estado = 1
    `;

    const params = [];
    const conditions = ['t.tienda_estado = 1'];

    if (negocio_id) {
      conditions.push('t.negocio_id = ?');
      params.push(negocio_id);
    }

    if (filters.fecha_desde) {
      conditions.push('c.cita_fecha >= ?');
      params.push(filters.fecha_desde);
    }

    if (filters.fecha_hasta) {
      conditions.push('c.cita_fecha <= ?');
      params.push(filters.fecha_hasta);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += `
      GROUP BY t.tienda_id
      ORDER BY total_citas DESC
      LIMIT ?
    `;
    params.push(limit);

    const result = await executeQuery(query, params);
    
    if (!result.success) {
      throw new Error(`Error al obtener tiendas top: ${result.error}`);
    }

    return result.data;
  }

  // ===== REPORTES DE NEGOCIOS =====

  // Negocios con mejores calificaciones
  static async getTopBusinessByRating(limit = 5) {
    const query = `
      SELECT 
        n.negocio_id,
        n.negocio_nombre,
        n.negocio_descripcion,
        ROUND(AVG(c.calificacion_puntuacion), 1) AS promedio_calificacion,
        COUNT(c.calificacion_id) AS total_calificaciones,
        COUNT(DISTINCT t.tienda_id) as total_tiendas,
        COUNT(DISTINCT ci.cita_id) as total_citas
      FROM negocios n
      LEFT JOIN calificaciones_negocios cn ON n.negocio_id = cn.negocio_id
      LEFT JOIN calificaciones c ON cn.calificacion_id = c.calificacion_id
      LEFT JOIN tiendas t ON n.negocio_id = t.negocio_id AND t.tienda_estado = 1
      LEFT JOIN citas ci ON t.tienda_id = ci.tienda_id
      WHERE n.negocio_estado = 1
      GROUP BY n.negocio_id
      HAVING total_calificaciones > 0
      ORDER BY promedio_calificacion DESC, total_calificaciones DESC
      LIMIT ?
    `;

    const result = await executeQuery(query, [limit]);
    
    if (!result.success) {
      throw new Error(`Error al obtener negocios top por calificación: ${result.error}`);
    }

    return result.data;
  }

  // ===== REPORTES DE TENDENCIAS =====

  // Tendencias de agendamientos por mes
  static async getAppointmentsTrends(negocio_id = null, months = 6) {
    let query = `
      SELECT 
        DATE_FORMAT(c.cita_fecha, '%Y-%m') AS mes,
        COUNT(*) AS total_citas,
        COUNT(CASE WHEN c.cita_estado = 'completada' THEN 1 END) as citas_completadas,
        COUNT(CASE WHEN c.cita_estado = 'cancelada' THEN 1 END) as citas_canceladas,
        SUM(CASE WHEN c.cita_estado = 'completada' THEN s.servicio_precio ELSE 0 END) as ingresos_mes
      FROM citas c
      LEFT JOIN servicios s ON c.servicio_id = s.servicio_id
    `;

    const params = [];
    const conditions = [];

    if (negocio_id) {
      query += ' JOIN tiendas t ON c.tienda_id = t.tienda_id';
      conditions.push('t.negocio_id = ?');
      params.push(negocio_id);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += `
      GROUP BY mes
      ORDER BY mes DESC
      LIMIT ?
    `;
    params.push(months);

    const result = await executeQuery(query, params);
    
    if (!result.success) {
      throw new Error(`Error al obtener tendencias de citas: ${result.error}`);
    }

    return result.data.reverse(); // Ordenar cronológicamente
  }

  // Usuarios registrados por mes
  static async getUserRegistrationTrends(months = 6, fecha_desde = null) {
    let query = `
      SELECT 
        DATE_FORMAT(usuario_fecha_registro, '%Y-%m') AS mes,
        COUNT(*) AS total_usuarios,
        COUNT(CASE WHEN rol_id = 4 THEN 1 END) as clientes_registrados,
        COUNT(CASE WHEN rol_id = 3 THEN 1 END) as empleados_registrados,
        COUNT(CASE WHEN rol_id = 2 THEN 1 END) as propietarios_registrados
      FROM usuarios
      WHERE usuario_estado = 1
    `;

    const params = [];

    if (fecha_desde) {
      query += ' AND usuario_fecha_registro >= ?';
      params.push(fecha_desde);
    }

    query += `
      GROUP BY mes
      ORDER BY mes DESC
      LIMIT ?
    `;
    params.push(months);

    const result = await executeQuery(query, params);
    
    if (!result.success) {
      throw new Error(`Error al obtener tendencias de registro: ${result.error}`);
    }

    return result.data.reverse(); // Ordenar cronológicamente
  }

  // ===== RESUMEN EJECUTIVO =====

  // Resumen general de estadísticas
  static async getStatsOverview(negocio_id = null) {
    let query = `
      SELECT 
        (SELECT COUNT(*) FROM usuarios WHERE usuario_estado = 1) AS total_usuarios,
        (SELECT COUNT(*) FROM usuarios WHERE rol_id = 4 AND usuario_estado = 1) AS total_clientes,
        (SELECT COUNT(*) FROM negocios WHERE negocio_estado = 1) AS total_negocios,
        (SELECT COUNT(*) FROM empleados WHERE empleado_estado = 1) AS total_empleados,
        (SELECT COUNT(*) FROM tiendas WHERE tienda_estado = 1) AS total_tiendas,
        (SELECT COUNT(*) FROM servicios WHERE servicio_estado = 1) AS total_servicios
    `;

    if (negocio_id) {
      query = `
        SELECT 
          (SELECT COUNT(DISTINCT c.usuario_id) FROM citas c JOIN tiendas t ON c.tienda_id = t.tienda_id WHERE t.negocio_id = ?) AS total_clientes,
          (SELECT COUNT(*) FROM tiendas WHERE negocio_id = ? AND tienda_estado = 1) AS total_tiendas,
          (SELECT COUNT(*) FROM empleados e JOIN tiendas t ON e.tienda_id = t.tienda_id WHERE t.negocio_id = ? AND e.empleado_estado = 1) AS total_empleados,
          (SELECT COUNT(*) FROM servicios s JOIN tiendas t ON s.tienda_id = t.tienda_id WHERE t.negocio_id = ? AND s.servicio_estado = 1) AS total_servicios,
          (SELECT COUNT(*) FROM citas c JOIN tiendas t ON c.tienda_id = t.tienda_id WHERE t.negocio_id = ?) AS total_citas,
          (SELECT SUM(s.servicio_precio) FROM citas c JOIN servicios s ON c.servicio_id = s.servicio_id JOIN tiendas t ON c.tienda_id = t.tienda_id WHERE t.negocio_id = ? AND c.cita_estado = 'completada') AS ingresos_totales
      `;
    }

    const params = negocio_id ? [negocio_id, negocio_id, negocio_id, negocio_id, negocio_id, negocio_id] : [];
    const result = await executeQuery(query, params);
    
    if (!result.success) {
      throw new Error(`Error al obtener resumen de estadísticas: ${result.error}`);
    }

    return result.data[0];
  }

  // ===== REPORTES AVANZADOS =====

  // Reporte de rendimiento por período
  static async getPerformanceReport(negocio_id = null, fecha_desde, fecha_hasta) {
    let query = `
      SELECT 
        COUNT(c.cita_id) as total_citas,
        COUNT(CASE WHEN c.cita_estado = 'completada' THEN 1 END) as citas_completadas,
        COUNT(CASE WHEN c.cita_estado = 'cancelada' THEN 1 END) as citas_canceladas,
        ROUND((COUNT(CASE WHEN c.cita_estado = 'completada' THEN 1 END) * 100.0 / COUNT(c.cita_id)), 2) as tasa_completacion,
        SUM(CASE WHEN c.cita_estado = 'completada' THEN s.servicio_precio ELSE 0 END) as ingresos_periodo,
        ROUND(AVG(CASE WHEN c.cita_estado = 'completada' THEN s.servicio_precio END), 2) as ticket_promedio,
        COUNT(DISTINCT c.usuario_id) as clientes_unicos,
        COUNT(DISTINCT c.empleado_id) as empleados_activos
      FROM citas c
      LEFT JOIN servicios s ON c.servicio_id = s.servicio_id
    `;

    const params = [];
    const conditions = ['c.cita_fecha BETWEEN ? AND ?'];
    params.push(fecha_desde, fecha_hasta);

    if (negocio_id) {
      query += ' JOIN tiendas t ON c.tienda_id = t.tienda_id';
      conditions.push('t.negocio_id = ?');
      params.push(negocio_id);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const result = await executeQuery(query, params);
    
    if (!result.success) {
      throw new Error(`Error al obtener reporte de rendimiento: ${result.error}`);
    }

    return result.data[0];
  }

  // Reporte de satisfacción del cliente
  static async getCustomerSatisfactionReport(negocio_id = null, limit = 10) {
    let query = `
      SELECT 
        n.negocio_nombre,
        COUNT(c.calificacion_id) as total_calificaciones,
        ROUND(AVG(c.calificacion_puntuacion), 2) as puntuacion_promedio,
        COUNT(CASE WHEN c.calificacion_puntuacion >= 4 THEN 1 END) as calificaciones_positivas,
        COUNT(CASE WHEN c.calificacion_puntuacion <= 2 THEN 1 END) as calificaciones_negativas,
        ROUND((COUNT(CASE WHEN c.calificacion_puntuacion >= 4 THEN 1 END) * 100.0 / COUNT(c.calificacion_id)), 2) as porcentaje_satisfaccion
      FROM negocios n
      LEFT JOIN calificaciones_negocios cn ON n.negocio_id = cn.negocio_id
      LEFT JOIN calificaciones c ON cn.calificacion_id = c.calificacion_id
      WHERE n.negocio_estado = 1
    `;

    const params = [];

    if (negocio_id) {
      query += ' AND n.negocio_id = ?';
      params.push(negocio_id);
    }

    query += `
      GROUP BY n.negocio_id
      HAVING total_calificaciones > 0
      ORDER BY puntuacion_promedio DESC, total_calificaciones DESC
      LIMIT ?
    `;
    params.push(limit);

    const result = await executeQuery(query, params);
    
    if (!result.success) {
      throw new Error(`Error al obtener reporte de satisfacción: ${result.error}`);
    }

    return result.data;
  }

  // ===== MÉTODOS UTILITARIOS =====

  // Obtener fechas para períodos predefinidos
  static getDateRange(period) {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - period);
    
    return {
      fecha_desde: startDate.toISOString().split('T')[0],
      fecha_hasta: today.toISOString().split('T')[0]
    };
  }

  // Validar estado de cita
  static isValidAppointmentState(state) {
    return Object.values(this.APPOINTMENT_STATES).includes(state);
  }

  // Obtener reporte personalizado
  static async getCustomReport(query, params = []) {
    const result = await executeQuery(query, params);
    
    if (!result.success) {
      throw new Error(`Error en reporte personalizado: ${result.error}`);
    }

    return result.data;
  }
}

export default Reports;