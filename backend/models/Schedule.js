import { executeQuery, executeTransaction } from "../database/connectiondb.js";

class Schedule {
  // Estados válidos para horarios
  static STATES = {
    ACTIVE: 1,
    INACTIVE: 0,
  };

  // Días de la semana válidos
  static DAYS = {
    LUNES: "lunes",
    MARTES: "martes",
    MIERCOLES: "miércoles",
    JUEVES: "jueves",
    VIERNES: "viernes",
    SABADO: "sábado",
    DOMINGO: "domingo",
  };

  // Tipos de horario
  static TYPES = {
    GENERAL: "general", // Horarios generales de tienda
    EMPLOYEE: "empleado", // Horarios específicos de empleado
  };

  // ===== MÉTODOS CRUD BÁSICOS =====

  // Obtener todos los horarios con información completa
  static async getAllSchedules(filters = {}) {
    let query = `
      SELECT 
        h.*,
        e.empleado_id,
        u.usuario_nombre AS empleado_nombre,
        u.usuario_apellido AS empleado_apellido,
        t.tienda_nombre,
        n.negocio_nombre,
        COUNT(c.cita_id) as total_citas_programadas
      FROM horarios h
      LEFT JOIN empleados e ON h.empleado_id = e.empleado_id
      LEFT JOIN usuarios u ON e.usuario_id = u.usuario_id
      LEFT JOIN tiendas t ON e.tienda_id = t.tienda_id
      LEFT JOIN negocios n ON t.negocio_id = n.negocio_id
      LEFT JOIN citas c ON h.horario_id = c.horario_id AND c.cita_estado NOT IN ('cancelada')
    `;

    const params = [];
    const conditions = [];

    // Aplicar filtros
    if (filters.horario_estado !== undefined) {
      conditions.push("h.horario_activo = ?");
      params.push(filters.horario_estado);
    } else {
      // Por defecto, mostrar solo activos
      conditions.push("h.horario_activo = ?");
      params.push(this.STATES.ACTIVE);
    }

    if (filters.horario_dia) {
      conditions.push("h.horario_dia = ?");
      params.push(filters.horario_dia);
    }

    if (filters.empleado_id) {
      conditions.push("h.empleado_id = ?");
      params.push(filters.empleado_id);
    }

    if (filters.tienda_id) {
      conditions.push("t.tienda_id = ?");
      params.push(filters.tienda_id);
    }

    if (filters.negocio_id) {
      conditions.push("n.negocio_id = ?");
      params.push(filters.negocio_id);
    }

    if (filters.disponible_fecha) {
      // Filtrar horarios disponibles para una fecha específica
      conditions.push(`
        h.horario_id NOT IN (
          SELECT horario_id 
          FROM citas 
          WHERE DATE(cita_fecha) = ? 
          AND cita_estado NOT IN ('cancelada', 'completada')
        )
      `);
      params.push(filters.disponible_fecha);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += `
      GROUP BY h.horario_id
      ORDER BY h.horario_dia ASC, h.horario_inicio ASC
    `;

    const result = await executeQuery(query, params);

    if (!result.success) {
      throw new Error(`Error al obtener horarios: ${result.error}`);
    }

    return result.data;
  }

  // Obtener horario por ID con información completa
  static async getScheduleById(horario_id) {
    const query = `
      SELECT 
        h.*,
        e.empleado_id,
        u.usuario_nombre AS empleado_nombre,
        u.usuario_apellido AS empleado_apellido,
        e.empleado_especialidad,
        t.tienda_nombre,
        n.negocio_nombre,
        COUNT(c.cita_id) as total_citas_programadas,
        COUNT(CASE WHEN c.cita_estado = 'completada' THEN 1 END) as citas_completadas
      FROM horarios h
      LEFT JOIN empleados e ON h.empleado_id = e.empleado_id
      LEFT JOIN usuarios u ON e.usuario_id = u.usuario_id
      LEFT JOIN tiendas t ON e.tienda_id = t.tienda_id
      LEFT JOIN negocios n ON t.negocio_id = n.negocio_id
      LEFT JOIN citas c ON h.horario_id = c.horario_id
      WHERE h.horario_id = ?
      GROUP BY h.horario_id
    `;

    const result = await executeQuery(query, [horario_id]);

    if (!result.success) {
      throw new Error(`Error al obtener horario: ${result.error}`);
    }

    return result.data[0] || null;
  }

  // Crear nuevo horario
  static async createSchedule(scheduleData) {
    const {
      empleado_id,
      horario_dia,
      horario_hora_inicio,
      horario_hora_fin,
      horario_tipo = this.TYPES.GENERAL,
      horario_duracion_cita = 30,
    } = scheduleData;

    // Validaciones básicas
    if (!horario_dia || !horario_hora_inicio || !horario_hora_fin) {
      throw new Error(
        "Los campos horario_dia, horario_hora_inicio y horario_hora_fin son obligatorios"
      );
    }

    // Validar día de la semana
    if (!Object.values(this.DAYS).includes(horario_dia.toLowerCase())) {
      throw new Error(
        `Día inválido: ${horario_dia}. Debe ser uno de: ${Object.values(
          this.DAYS
        ).join(", ")}`
      );
    }

    // Validar horarios
    const validation = this.validateTimeRange(
      horario_hora_inicio,
      horario_hora_fin
    );
    if (!validation.isValid) {
      throw new Error(validation.message);
    }

    try {
      // Si tiene empleado_id, verificar que el empleado existe
      if (empleado_id) {
        const employeeValidation = await this.validateEmployee(empleado_id);
        if (!employeeValidation.isValid) {
          throw new Error(employeeValidation.message);
        }

        // Verificar conflictos de horario para el empleado
        const hasConflict = await this.checkScheduleConflict(
          empleado_id,
          horario_dia,
          horario_hora_inicio,
          horario_hora_fin
        );
        if (hasConflict) {
          throw new Error(
            "El empleado ya tiene un horario que se superpone en este día y horario"
          );
        }
      }

      const query = `
        INSERT INTO horarios 
        (empleado_id, horario_dia, horario_hora_inicio, horario_hora_fin, 
         horario_tipo, horario_duracion_cita, horario_estado, fecha_creacion)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
      `;

      const params = [
        empleado_id || null,
        horario_dia.toLowerCase(),
        horario_hora_inicio,
        horario_hora_fin,
        horario_tipo,
        horario_duracion_cita,
        this.STATES.ACTIVE,
      ];

      const result = await executeQuery(query, params);

      if (!result.success) {
        throw new Error(`Error al crear horario: ${result.error}`);
      }

      return {
        success: true,
        horario_id: result.data.insertId,
        message: "Horario creado exitosamente",
        data: await this.getScheduleById(result.data.insertId),
      };
    } catch (error) {
      throw new Error(`Error al crear horario: ${error.message}`);
    }
  }

  // Actualizar horario
  static async updateSchedule(horario_id, updateData) {
    const {
      empleado_id,
      horario_dia,
      horario_hora_inicio,
      horario_hora_fin,
      horario_tipo,
      horario_duracion_cita,
    } = updateData;

    // Verificar que el horario existe
    const existingSchedule = await this.getScheduleById(horario_id);
    if (!existingSchedule) {
      throw new Error("Horario no encontrado");
    }

    // Validaciones si se proporcionan nuevos valores
    if (
      horario_dia &&
      !Object.values(this.DAYS).includes(horario_dia.toLowerCase())
    ) {
      throw new Error(`Día inválido: ${horario_dia}`);
    }

    if (horario_hora_inicio && horario_hora_fin) {
      const validation = this.validateTimeRange(
        horario_hora_inicio,
        horario_hora_fin
      );
      if (!validation.isValid) {
        throw new Error(validation.message);
      }
    }

    // Verificar empleado si se cambia
    if (empleado_id && empleado_id !== existingSchedule.empleado_id) {
      const employeeValidation = await this.validateEmployee(empleado_id);
      if (!employeeValidation.isValid) {
        throw new Error(employeeValidation.message);
      }

      // Verificar conflictos
      const newDay = horario_dia || existingSchedule.horario_dia;
      const newStart =
        horario_hora_inicio || existingSchedule.horario_hora_inicio;
      const newEnd = horario_hora_fin || existingSchedule.horario_hora_fin;

      const hasConflict = await this.checkScheduleConflict(
        empleado_id,
        newDay,
        newStart,
        newEnd,
        horario_id
      );
      if (hasConflict) {
        throw new Error(
          "El empleado ya tiene un horario que se superpone en este día y horario"
        );
      }
    }

    // Verificar si hay citas programadas antes de hacer cambios significativos
    if (
      (horario_hora_inicio &&
        horario_hora_inicio !== existingSchedule.horario_hora_inicio) ||
      (horario_hora_fin &&
        horario_hora_fin !== existingSchedule.horario_hora_fin)
    ) {
      const hasFutureCitas = await this.hasFutureAppointments(horario_id);
      if (hasFutureCitas) {
        throw new Error(
          "No se puede modificar el horario porque tiene citas programadas"
        );
      }
    }

    const query = `
      UPDATE horarios 
      SET empleado_id = COALESCE(?, empleado_id),
          horario_dia = COALESCE(?, horario_dia),
          horario_hora_inicio = COALESCE(?, horario_hora_inicio),
          horario_hora_fin = COALESCE(?, horario_hora_fin),
          horario_tipo = COALESCE(?, horario_tipo),
          horario_duracion_cita = COALESCE(?, horario_duracion_cita),
          fecha_modificacion = NOW()
      WHERE horario_id = ?
    `;

    const params = [
      empleado_id,
      horario_dia?.toLowerCase(),
      horario_hora_inicio,
      horario_hora_fin,
      horario_tipo,
      horario_duracion_cita,
      horario_id,
    ];

    const result = await executeQuery(query, params);

    if (!result.success) {
      throw new Error(`Error al actualizar horario: ${result.error}`);
    }

    if (result.data.affectedRows === 0) {
      throw new Error("Horario no encontrado");
    }

    return {
      success: true,
      message: "Horario actualizado exitosamente",
      affectedRows: result.data.affectedRows,
      data: await this.getScheduleById(horario_id),
    };
  }

  // Cambiar estado del horario
  static async changeScheduleState(horario_id, nuevo_estado) {
    // Validar estado
    if (!Object.values(this.STATES).includes(nuevo_estado)) {
      throw new Error(`Estado inválido: ${nuevo_estado}`);
    }

    // Si se va a desactivar, verificar citas futuras
    if (nuevo_estado === this.STATES.INACTIVE) {
      const hasFutureCitas = await this.hasFutureAppointments(horario_id);
      if (hasFutureCitas) {
        throw new Error(
          "No se puede desactivar un horario con citas programadas"
        );
      }
    }

    const query =
      "UPDATE horarios SET horario_estado = ?, fecha_modificacion = NOW() WHERE horario_id = ?";
    const result = await executeQuery(query, [nuevo_estado, horario_id]);

    if (!result.success) {
      throw new Error(`Error al cambiar estado del horario: ${result.error}`);
    }

    if (result.data.affectedRows === 0) {
      throw new Error("Horario no encontrado");
    }

    const estadoTexto =
      nuevo_estado === this.STATES.ACTIVE ? "activado" : "desactivado";
    return {
      success: true,
      message: `Horario ${estadoTexto} exitosamente`,
      affectedRows: result.data.affectedRows,
    };
  }

  // Eliminar horario (hard delete con validaciones)
  static async deleteSchedule(horario_id) {
    // Verificar que el horario existe
    const existingSchedule = await this.getScheduleById(horario_id);
    if (!existingSchedule) {
      throw new Error("Horario no encontrado");
    }

    // Verificar si hay citas asociadas
    const hasCitas = await this.hasAnyAppointments(horario_id);
    if (hasCitas) {
      throw new Error(
        "No se puede eliminar un horario que tiene citas asociadas. Considera desactivarlo en su lugar."
      );
    }

    const query = "DELETE FROM horarios WHERE horario_id = ?";
    const result = await executeQuery(query, [horario_id]);

    if (!result.success) {
      throw new Error(`Error al eliminar horario: ${result.error}`);
    }

    return {
      success: true,
      message: "Horario eliminado exitosamente",
      affectedRows: result.data.affectedRows,
    };
  }

  // ===== MÉTODOS DE CONSULTA ESPECÍFICOS =====

  // Obtener horarios por empleado
  static async getSchedulesByEmployee(empleado_id, includeInactive = false) {
    const filters = { empleado_id };
    if (includeInactive) {
      filters.horario_estado = undefined;
    }
    return await this.getAllSchedules(filters);
  }

  // Obtener horarios por día
  static async getSchedulesByDay(horario_dia, filters = {}) {
    return await this.getAllSchedules({
      ...filters,
      horario_dia: horario_dia.toLowerCase(),
    });
  }

  // Obtener horarios disponibles para una fecha específica
  static async getAvailableSchedules(fecha, filters = {}) {
    return await this.getAllSchedules({ ...filters, disponible_fecha: fecha });
  }

  // Obtener horarios disponibles por empleado y fecha específica
  static async getAvailableSchedulesByEmployee(empleado_id, fecha) {
    try {
      console.log("🚀 getAvailableSchedulesByEmployee iniciado");
      console.log("👤 empleado_id:", empleado_id);
      console.log("📅 fecha:", fecha);

      // Obtener el día de la semana de la fecha
      const fechaObj = new Date(fecha);
      const diasSemana = [
        "domingo",
        "lunes",
        "martes",
        "miércoles",
        "jueves",
        "viernes",
        "sábado",
      ];
      const diaSemana = diasSemana[fechaObj.getDay()];

      // Obtener horarios del empleado para ese día (usando nombres de días)
      let query = `
        SELECT 
          h.horario_id,
          h.tienda_id,
          h.empleado_id,
          h.horario_dia,
          h.horario_inicio,
          h.horario_fin,
          h.horario_activo,
          h.horario_hora_inicio,
          h.horario_hora_fin,
          u.usuario_nombre,
          u.usuario_apellido,
          e.empleado_especialidad
        FROM horarios h
        LEFT JOIN empleados e ON h.empleado_id = e.empleado_id
        LEFT JOIN usuarios u ON e.usuario_id = u.usuario_id
        WHERE h.empleado_id = ? 
        AND h.horario_dia = ?
        AND h.horario_activo = 1
      `;

      // Usar el nombre del día de la semana
      const params = [empleado_id, diaSemana];

      console.log("🔍 Query:", query);
      console.log("📊 Parámetros:", params);
      console.log("📅 Día de la semana calculado:", diaSemana);
      console.log("📅 Fecha original:", fecha);

      const result = await executeQuery(query, params);

      if (!result.success) {
        throw new Error(
          `Error al obtener horarios del empleado: ${result.error}`
        );
      }

      console.log("📅 Horarios encontrados en BD:", result.data.length);
      console.log("📅 Datos de horarios:", result.data);

      // Debug: Ver todas las citas existentes para este empleado y fecha
      const debugQuery = `
        SELECT cita_id, horario_id, cita_fecha, cita_estado
        FROM citas 
        WHERE empleado_id = ? 
        AND cita_fecha = ?
      `;
      const debugResult = await executeQuery(debugQuery, [empleado_id, fecha]);
      console.log(
        "🔍 Debug - Todas las citas para este empleado y fecha:",
        debugResult.data
      );

      // Filtrar horarios que no tengan citas programadas para esa fecha
      const horariosDisponibles = [];

      for (const horario of result.data) {
        console.log(
          `🔍 Verificando disponibilidad para horario ${horario.horario_id}`
        );

        // Verificar si hay citas programadas para este horario en esta fecha
        const citasQuery = `
          SELECT COUNT(*) as total_citas
          FROM citas 
          WHERE empleado_id = ? 
          AND horario_id = ? 
          AND cita_fecha = ?
          AND cita_estado NOT IN ('cancelada', 'completada')
        `;

        const citasParams = [empleado_id, horario.horario_id, fecha];
        console.log(`📊 Parámetros de verificación de citas:`, citasParams);

        const citasResult = await executeQuery(citasQuery, citasParams);

        if (citasResult.success) {
          const totalCitas = citasResult.data[0].total_citas;
          console.log(
            `📅 Horario ${horario.horario_id}: ${totalCitas} citas encontradas`
          );

          if (totalCitas === 0) {
            horariosDisponibles.push(horario);
            console.log(
              `✅ Horario ${horario.horario_id} marcado como disponible`
            );
          } else {
            console.log(
              `❌ Horario ${horario.horario_id} NO disponible (${totalCitas} citas)`
            );
          }
        } else {
          console.log(
            `❌ Error verificando citas para horario ${horario.horario_id}:`,
            citasResult.error
          );
        }
      }

      console.log(
        "Horarios disponibles después de filtrar citas:",
        horariosDisponibles.length
      );
      return horariosDisponibles;
    } catch (error) {
      throw new Error(
        `Error al obtener horarios disponibles por empleado: ${error.message}`
      );
    }
  }

  // Obtener horarios por tienda
  static async getSchedulesByStore(tienda_id) {
    return await this.getAllSchedules({ tienda_id });
  }

  // Método de prueba para verificar conexión a BD
  static async testConnection() {
    try {
      const query = "SELECT COUNT(*) as total FROM horarios";
      const result = await executeQuery(query);
      console.log(
        "✅ Conexión a BD exitosa. Total horarios:",
        result.data[0].total
      );
      return result.data[0].total;
    } catch (error) {
      console.error("❌ Error de conexión a BD:", error);
      throw error;
    }
  }

  // ===== VALIDACIONES Y UTILIDADES =====

  // Validar rango de tiempo
  static validateTimeRange(inicio, fin) {
    const startTime = new Date(`1970-01-01T${inicio}:00`);
    const endTime = new Date(`1970-01-01T${fin}:00`);

    if (startTime >= endTime) {
      return {
        isValid: false,
        message: "La hora de inicio debe ser anterior a la hora de fin",
      };
    }

    // Validar duración mínima (15 minutos)
    const diffMinutes = (endTime - startTime) / (1000 * 60);
    if (diffMinutes < 15) {
      return {
        isValid: false,
        message: "La duración del horario debe ser de al menos 15 minutos",
      };
    }

    return {
      isValid: true,
      message: "Rango de tiempo válido",
    };
  }

  // Validar empleado
  static async validateEmployee(empleado_id) {
    const query =
      "SELECT empleado_id, empleado_estado FROM empleados WHERE empleado_id = ?";
    const result = await executeQuery(query, [empleado_id]);

    if (!result.success) {
      return {
        isValid: false,
        message: "Error al validar empleado",
      };
    }

    if (result.data.length === 0) {
      return {
        isValid: false,
        message: "Empleado no encontrado",
      };
    }

    if (result.data[0].empleado_estado !== 1) {
      return {
        isValid: false,
        message: "El empleado está inactivo",
      };
    }

    return {
      isValid: true,
      message: "Empleado válido",
    };
  }

  // Verificar conflictos de horario
  static async checkScheduleConflict(
    empleado_id,
    dia,
    hora_inicio,
    hora_fin,
    exclude_horario_id = null
  ) {
    let query = `
      SELECT horario_id 
      FROM horarios 
      WHERE empleado_id = ? 
      AND horario_dia = ? 
      AND horario_estado = 1
      AND (
        (horario_hora_inicio <= ? AND horario_hora_fin > ?) OR
        (horario_hora_inicio < ? AND horario_hora_fin >= ?) OR
        (horario_hora_inicio >= ? AND horario_hora_fin <= ?)
      )
    `;

    const params = [
      empleado_id,
      dia.toLowerCase(),
      hora_inicio,
      hora_inicio,
      hora_fin,
      hora_fin,
      hora_inicio,
      hora_fin,
    ];

    if (exclude_horario_id) {
      query += " AND horario_id != ?";
      params.push(exclude_horario_id);
    }

    const result = await executeQuery(query, params);

    if (!result.success) {
      throw new Error(`Error al verificar conflictos: ${result.error}`);
    }

    return result.data.length > 0;
  }

  // Verificar si tiene citas futuras
  static async hasFutureAppointments(horario_id) {
    const query = `
      SELECT COUNT(*) as count 
      FROM citas 
      WHERE horario_id = ? 
      AND cita_fecha >= CURDATE()
      AND cita_estado NOT IN ('cancelada', 'completada')
    `;

    const result = await executeQuery(query, [horario_id]);

    if (!result.success) {
      throw new Error(`Error al verificar citas futuras: ${result.error}`);
    }

    return result.data[0]?.count > 0;
  }

  // Verificar si tiene citas (cualquier fecha)
  static async hasAnyAppointments(horario_id) {
    const query = "SELECT COUNT(*) as count FROM citas WHERE horario_id = ?";
    const result = await executeQuery(query, [horario_id]);

    if (!result.success) {
      throw new Error(`Error al verificar citas: ${result.error}`);
    }

    return result.data[0]?.count > 0;
  }

  // ===== REPORTES Y ESTADÍSTICAS =====

  // Obtener estadísticas de horarios
  static async getScheduleStats(filters = {}) {
    let query = `
      SELECT 
        COUNT(*) as total_horarios,
        COUNT(CASE WHEN h.horario_estado = 1 THEN 1 END) as horarios_activos,
        COUNT(CASE WHEN h.empleado_id IS NOT NULL THEN 1 END) as horarios_asignados,
        COUNT(DISTINCT h.horario_dia) as dias_configurados,
        COUNT(DISTINCT h.empleado_id) as empleados_con_horarios,
        AVG(TIME_TO_SEC(TIMEDIFF(h.horario_hora_fin, h.horario_hora_inicio))/3600) as horas_promedio_jornada
      FROM horarios h
    `;

    const params = [];
    const conditions = [];

    if (filters.empleado_id) {
      query +=
        " LEFT JOIN empleados e ON h.empleado_id = e.empleado_id LEFT JOIN tiendas t ON e.tienda_id = t.tienda_id";
      conditions.push("e.empleado_id = ?");
      params.push(filters.empleado_id);
    }

    if (filters.tienda_id) {
      if (!query.includes("JOIN tiendas")) {
        query +=
          " LEFT JOIN empleados e ON h.empleado_id = e.empleado_id LEFT JOIN tiendas t ON e.tienda_id = t.tienda_id";
      }
      conditions.push("t.tienda_id = ?");
      params.push(filters.tienda_id);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    const result = await executeQuery(query, params);

    if (!result.success) {
      throw new Error(
        `Error al obtener estadísticas de horarios: ${result.error}`
      );
    }

    return result.data[0];
  }

  // Obtener horarios más utilizados
  static async getMostUsedSchedules(limit = 10, filters = {}) {
    let query = `
      SELECT 
        h.*,
        u.usuario_nombre AS empleado_nombre,
        u.usuario_apellido AS empleado_apellido,
        COUNT(c.cita_id) as total_citas,
        COUNT(CASE WHEN c.cita_estado = 'completada' THEN 1 END) as citas_completadas,
        ROUND(AVG(s.servicio_precio), 2) as precio_promedio_servicio
      FROM horarios h
      LEFT JOIN empleados e ON h.empleado_id = e.empleado_id
      LEFT JOIN usuarios u ON e.usuario_id = u.usuario_id
      LEFT JOIN citas c ON h.horario_id = c.horario_id
      LEFT JOIN servicios s ON c.servicio_id = s.servicio_id
      WHERE h.horario_estado = 1
    `;

    const params = [];

    if (filters.fecha_desde) {
      query += " AND c.cita_fecha >= ?";
      params.push(filters.fecha_desde);
    }

    if (filters.fecha_hasta) {
      query += " AND c.cita_fecha <= ?";
      params.push(filters.fecha_hasta);
    }

    query += `
      GROUP BY h.horario_id
      HAVING total_citas > 0
      ORDER BY total_citas DESC
      LIMIT ?
    `;
    params.push(limit);

    const result = await executeQuery(query, params);

    if (!result.success) {
      throw new Error(
        `Error al obtener horarios más utilizados: ${result.error}`
      );
    }

    return result.data;
  }

  // ===== MÉTODOS UTILITARIOS =====

  // Obtener días disponibles
  static getAvailableDays() {
    return Object.values(this.DAYS);
  }

  // Validar día
  static isValidDay(dia) {
    return Object.values(this.DAYS).includes(dia.toLowerCase());
  }

  // Formatear horario para respuesta
  static formatScheduleResponse(schedule) {
    if (!schedule) return null;

    const startTime = new Date(`1970-01-01T${schedule.horario_hora_inicio}:00`);
    const endTime = new Date(`1970-01-01T${schedule.horario_hora_fin}:00`);
    const durationMinutes = (endTime - startTime) / (1000 * 60);

    return {
      ...schedule,
      duracion_jornada_minutos: durationMinutes,
      duracion_jornada_horas: Math.round((durationMinutes / 60) * 100) / 100,
      slots_disponibles: Math.floor(
        durationMinutes / (schedule.horario_duracion_cita || 30)
      ),
      dia_semana_numero: this.getDayNumber(schedule.horario_dia),
    };
  }

  // Obtener número del día de la semana
  static getDayNumber(dia) {
    const dayNumbers = {
      lunes: 1,
      martes: 2,
      miércoles: 3,
      jueves: 4,
      viernes: 5,
      sábado: 6,
      domingo: 0,
    };
    return dayNumbers[dia.toLowerCase()] || 0;
  }

  // Generar slots de tiempo para un horario
  static generateTimeSlots(
    horario_hora_inicio,
    horario_hora_fin,
    duracion_cita = 30
  ) {
    const slots = [];
    const start = new Date(`1970-01-01T${horario_hora_inicio}:00`);
    const end = new Date(`1970-01-01T${horario_hora_fin}:00`);

    let current = new Date(start);
    while (current < end) {
      const slotEnd = new Date(current.getTime() + duracion_cita * 60000);
      if (slotEnd <= end) {
        slots.push({
          hora_inicio: current.toTimeString().slice(0, 5),
          hora_fin: slotEnd.toTimeString().slice(0, 5),
        });
      }
      current = slotEnd;
    }

    return slots;
  }
}

export default Schedule;
