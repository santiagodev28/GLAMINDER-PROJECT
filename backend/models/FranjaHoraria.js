import { executeQuery, executeTransaction } from "../database/connectiondb.js";

class FranjaHoraria {
  // Estados válidos para franjas horarias
  static STATES = {
    ACTIVE: 1,
    INACTIVE: 0,
  };

  // ===== MÉTODOS CRUD BÁSICOS =====

  // Obtener todas las franjas horarias
  static async getAllFranjas(filters = {}) {
    let query = `
      SELECT 
        f.*,
        h.horario_dia,
        h.horario_inicio,
        h.horario_fin,
        u.usuario_nombre AS empleado_nombre,
        u.usuario_apellido AS empleado_apellido,
        t.tienda_nombre,
        n.negocio_nombre,
        COUNT(c.cita_id) as total_citas_programadas
      FROM franjas_horarias f
      LEFT JOIN horarios h ON f.horario_id = h.horario_id
      LEFT JOIN empleados e ON f.empleado_id = e.empleado_id
      LEFT JOIN usuarios u ON e.usuario_id = u.usuario_id
      LEFT JOIN tiendas t ON f.tienda_id = t.tienda_id
      LEFT JOIN negocios n ON t.negocio_id = n.negocio_id
      LEFT JOIN citas c ON f.franja_id = c.franja_id AND c.cita_estado NOT IN ('cancelada')
    `;

    const params = [];
    const conditions = [];

    // Aplicar filtros
    if (filters.franja_estado !== undefined) {
      conditions.push("f.franja_estado = ?");
      params.push(filters.franja_estado);
    } else {
      // Por defecto, mostrar solo activas
      conditions.push("f.franja_estado = ?");
      params.push(this.STATES.ACTIVE);
    }

    if (filters.empleado_id) {
      conditions.push("f.empleado_id = ?");
      params.push(filters.empleado_id);
    }

    if (filters.tienda_id) {
      conditions.push("f.tienda_id = ?");
      params.push(filters.tienda_id);
    }

    if (filters.franja_fecha) {
      conditions.push("f.franja_fecha = ?");
      params.push(filters.franja_fecha);
    }

    if (filters.franja_disponible !== undefined) {
      conditions.push("f.franja_disponible = ?");
      params.push(filters.franja_disponible);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += `
      GROUP BY f.franja_id
      ORDER BY f.franja_fecha ASC, f.franja_hora_inicio ASC
    `;

    const result = await executeQuery(query, params);

    if (!result.success) {
      throw new Error(`Error al obtener franjas horarias: ${result.error}`);
    }

    return result.data;
  }

  // Obtener franja por ID
  static async getFranjaById(franja_id) {
    const query = `
      SELECT 
        f.*,
        h.horario_dia,
        h.horario_inicio,
        h.horario_fin,
        u.usuario_nombre AS empleado_nombre,
        u.usuario_apellido AS empleado_apellido,
        e.empleado_especialidad,
        t.tienda_nombre,
        n.negocio_nombre
      FROM franjas_horarias f
      LEFT JOIN horarios h ON f.horario_id = h.horario_id
      LEFT JOIN empleados e ON f.empleado_id = e.empleado_id
      LEFT JOIN usuarios u ON e.usuario_id = u.usuario_id
      LEFT JOIN tiendas t ON f.tienda_id = t.tienda_id
      LEFT JOIN negocios n ON t.negocio_id = n.negocio_id
      WHERE f.franja_id = ?
    `;

    const result = await executeQuery(query, [franja_id]);

    if (!result.success) {
      throw new Error(`Error al obtener franja horaria: ${result.error}`);
    }

    return result.data[0] || null;
  }

  // Crear nueva franja horaria
  static async createFranja(franjaData) {
    const {
      horario_id,
      empleado_id,
      tienda_id,
      franja_fecha,
      franja_hora_inicio,
      franja_hora_fin,
      franja_duracion_minutos = 30,
    } = franjaData;

    // Validaciones básicas
    if (
      !horario_id ||
      !empleado_id ||
      !tienda_id ||
      !franja_fecha ||
      !franja_hora_inicio ||
      !franja_hora_fin
    ) {
      throw new Error("Todos los campos son obligatorios");
    }

    // Validar que no exista una franja duplicada
    const existingFranja = await this.checkDuplicateFranja(
      empleado_id,
      franja_fecha,
      franja_hora_inicio,
      franja_hora_fin
    );

    if (existingFranja) {
      throw new Error(
        "Ya existe una franja horaria para este empleado en esta fecha y horario"
      );
    }

    const query = `
      INSERT INTO franjas_horarias 
      (horario_id, empleado_id, tienda_id, franja_fecha, franja_hora_inicio, franja_hora_fin, franja_duracion_minutos, franja_estado)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      horario_id,
      empleado_id,
      tienda_id,
      franja_fecha,
      franja_hora_inicio,
      franja_hora_fin,
      franja_duracion_minutos,
      this.STATES.ACTIVE,
    ];

    const result = await executeQuery(query, params);

    if (!result.success) {
      throw new Error(`Error al crear franja horaria: ${result.error}`);
    }

    return {
      success: true,
      franja_id: result.data.insertId,
      message: "Franja horaria creada exitosamente",
      data: await this.getFranjaById(result.data.insertId),
    };
  }

  // Actualizar franja horaria
  static async updateFranja(franja_id, updateData) {
    const {
      franja_hora_inicio,
      franja_hora_fin,
      franja_disponible,
      franja_duracion_minutos,
    } = updateData;

    // Verificar que la franja existe
    const existingFranja = await this.getFranjaById(franja_id);
    if (!existingFranja) {
      throw new Error("Franja horaria no encontrada");
    }

    const query = `
      UPDATE franjas_horarias 
      SET franja_hora_inicio = COALESCE(?, franja_hora_inicio),
          franja_hora_fin = COALESCE(?, franja_hora_fin),
          franja_disponible = COALESCE(?, franja_disponible),
          franja_duracion_minutos = COALESCE(?, franja_duracion_minutos)
      WHERE franja_id = ?
    `;

    const params = [
      franja_hora_inicio,
      franja_hora_fin,
      franja_disponible,
      franja_duracion_minutos,
      franja_id,
    ];

    const result = await executeQuery(query, params);

    if (!result.success) {
      throw new Error(`Error al actualizar franja horaria: ${result.error}`);
    }

    if (result.data.affectedRows === 0) {
      throw new Error("Franja horaria no encontrada");
    }

    return {
      success: true,
      message: "Franja horaria actualizada exitosamente",
      data: await this.getFranjaById(franja_id),
    };
  }

  // Eliminar franja horaria
  static async deleteFranja(franja_id) {
    // Verificar que la franja existe
    const existingFranja = await this.getFranjaById(franja_id);
    if (!existingFranja) {
      throw new Error("Franja horaria no encontrada");
    }

    // Verificar si tiene citas asociadas
    const hasCitas = await this.hasAppointments(franja_id);
    if (hasCitas) {
      throw new Error(
        "No se puede eliminar una franja horaria que tiene citas asociadas"
      );
    }

    const query = "DELETE FROM franjas_horarias WHERE franja_id = ?";
    const result = await executeQuery(query, [franja_id]);

    if (!result.success) {
      throw new Error(`Error al eliminar franja horaria: ${result.error}`);
    }

    return {
      success: true,
      message: "Franja horaria eliminada exitosamente",
      affectedRows: result.data.affectedRows,
    };
  }

  // ===== MÉTODOS DE CONSULTA ESPECÍFICOS =====

  // Obtener franjas disponibles por empleado y fecha
  static async getAvailableFranjasByEmployee(empleado_id, fecha) {
    try {
      console.log("🚀 getAvailableFranjasByEmployee iniciado");
      console.log("👤 empleado_id:", empleado_id);
      console.log("📅 fecha:", fecha);

      const query = `
        SELECT 
          f.*,
          h.horario_dia,
          h.horario_inicio,
          h.horario_fin,
          u.usuario_nombre,
          u.usuario_apellido,
          e.empleado_especialidad
        FROM franjas_horarias f
        LEFT JOIN horarios h ON f.horario_id = h.horario_id
        LEFT JOIN empleados e ON f.empleado_id = e.empleado_id
        LEFT JOIN usuarios u ON e.usuario_id = u.usuario_id
        WHERE f.empleado_id = ? 
        AND f.franja_fecha = ?
        AND f.franja_estado = 1
        AND f.franja_disponible = 1
        ORDER BY f.franja_hora_inicio ASC
      `;

      const params = [empleado_id, fecha];

      console.log("🔍 Query:", query);
      console.log("📊 Parámetros:", params);

      const result = await executeQuery(query, params);

      if (!result.success) {
        throw new Error(
          `Error al obtener franjas disponibles: ${result.error}`
        );
      }

      console.log("📅 Franjas disponibles encontradas:", result.data.length);
      if (result.data.length > 0) {
        console.log("📅 Franjas encontradas:");
        result.data.forEach((franja, index) => {
          console.log(
            `  ${index + 1}. Franja ${franja.franja_id}: ${
              franja.franja_hora_inicio
            } - ${franja.franja_hora_fin}`
          );
        });
      }

      return result.data;
    } catch (error) {
      throw new Error(
        `Error al obtener franjas disponibles por empleado: ${error.message}`
      );
    }
  }

  // Generar franjas horarias automáticamente para un rango de fechas
  static async generateFranjasForDateRange(
    empleado_id,
    fecha_inicio,
    fecha_fin
  ) {
    try {
      console.log("🚀 generateFranjasForDateRange iniciado");
      console.log("👤 empleado_id:", empleado_id);
      console.log("📅 fecha_inicio:", fecha_inicio);
      console.log("📅 fecha_fin:", fecha_fin);

      // Obtener horarios del empleado
      const horariosQuery = `
        SELECT h.*, e.tienda_id
        FROM horarios h
        LEFT JOIN empleados e ON h.empleado_id = e.empleado_id
        WHERE h.empleado_id = ? AND h.horario_estado = 1
      `;

      const horariosResult = await executeQuery(horariosQuery, [empleado_id]);

      if (!horariosResult.success) {
        throw new Error(
          `Error al obtener horarios del empleado: ${horariosResult.error}`
        );
      }

      const horarios = horariosResult.data;
      console.log("📅 Horarios encontrados:", horarios.length);

      if (horarios.length === 0) {
        throw new Error("El empleado no tiene horarios configurados");
      }

      const franjasGeneradas = [];
      const fechaInicio = new Date(fecha_inicio);
      const fechaFin = new Date(fecha_fin);

      // Generar franjas para cada día en el rango
      for (
        let fecha = new Date(fechaInicio);
        fecha <= fechaFin;
        fecha.setDate(fecha.getDate() + 1)
      ) {
        const fechaStr = fecha.toISOString().split("T")[0];
        const diaSemana = this.getDayName(fecha.getDay());

        console.log(`📅 Procesando fecha: ${fechaStr} (${diaSemana})`);

        // Buscar horarios para este día de la semana
        const horariosDelDia = horarios.filter(
          (h) => h.horario_dia === diaSemana
        );
        console.log(`📅 Horarios para ${diaSemana}:`, horariosDelDia.length);

        for (const horario of horariosDelDia) {
          // Verificar si ya existe una franja para este horario en esta fecha
          const franjaExistente = await this.checkDuplicateFranja(
            empleado_id,
            fechaStr,
            horario.horario_hora_inicio,
            horario.horario_hora_fin
          );

          if (!franjaExistente) {
            // Crear la franja horaria
            const franjaData = {
              horario_id: horario.horario_id,
              empleado_id: empleado_id,
              tienda_id: horario.tienda_id,
              franja_fecha: fechaStr,
              franja_hora_inicio: horario.horario_hora_inicio,
              franja_hora_fin: horario.horario_hora_fin,
              franja_duracion_minutos: 30, // Duración por defecto
            };

            const nuevaFranja = await this.createFranja(franjaData);
            franjasGeneradas.push(nuevaFranja.data);
            console.log(
              `✅ Franja creada: ${fechaStr} ${horario.horario_hora_inicio}-${horario.horario_hora_fin}`
            );
          } else {
            console.log(
              `⚠️ Franja ya existe: ${fechaStr} ${horario.horario_hora_inicio}-${horario.horario_hora_fin}`
            );
          }
        }
      }

      return {
        success: true,
        message: `Se generaron ${franjasGeneradas.length} franjas horarias`,
        franjas_generadas: franjasGeneradas,
        total_franjas: franjasGeneradas.length,
      };
    } catch (error) {
      throw new Error(`Error al generar franjas horarias: ${error.message}`);
    }
  }

  // ===== MÉTODOS UTILITARIOS =====

  // Verificar si existe una franja duplicada
  static async checkDuplicateFranja(empleado_id, fecha, hora_inicio, hora_fin) {
    const query = `
      SELECT franja_id 
      FROM franjas_horarias 
      WHERE empleado_id = ? 
      AND franja_fecha = ? 
      AND franja_hora_inicio = ? 
      AND franja_hora_fin = ?
    `;

    const result = await executeQuery(query, [
      empleado_id,
      fecha,
      hora_inicio,
      hora_fin,
    ]);

    if (!result.success) {
      throw new Error(`Error al verificar franja duplicada: ${result.error}`);
    }

    return result.data.length > 0;
  }

  // Verificar si tiene citas asociadas
  static async hasAppointments(franja_id) {
    const query = `
      SELECT COUNT(*) as count 
      FROM citas 
      WHERE franja_id = ? 
      AND cita_estado NOT IN ('cancelada', 'completada')
    `;

    const result = await executeQuery(query, [franja_id]);

    if (!result.success) {
      throw new Error(`Error al verificar citas: ${result.error}`);
    }

    return result.data[0].count > 0;
  }

  // Obtener nombre del día de la semana
  static getDayName(dayNumber) {
    const days = [
      "domingo",
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábado",
    ];
    return days[dayNumber];
  }

  // Generar slots de tiempo para una franja
  static generateTimeSlots(
    franja_hora_inicio,
    franja_hora_fin,
    duracion_minutos = 30
  ) {
    const slots = [];

    // Convertir las horas a minutos desde medianoche
    const parseTime = (timeStr) => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const formatTime = (minutes) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}`;
    };

    const startMinutes = parseTime(franja_hora_inicio);
    const endMinutes = parseTime(franja_hora_fin);

    let currentMinutes = startMinutes;
    let slotIndex = 0;

    while (currentMinutes < endMinutes) {
      const slotEndMinutes = currentMinutes + duracion_minutos;

      if (slotEndMinutes <= endMinutes) {
        slots.push({
          slot_index: slotIndex, // Índice único para cada slot
          hora_inicio: formatTime(currentMinutes),
          hora_fin: formatTime(slotEndMinutes),
          duracion_minutos: duracion_minutos,
        });
        console.log(
          `🔧 Slot generado: index=${slotIndex}, inicio=${formatTime(
            currentMinutes
          )}, fin=${formatTime(slotEndMinutes)}`
        );
        slotIndex++;
      }

      currentMinutes = slotEndMinutes;
    }

    return slots;
  }

  // Obtener estadísticas de franjas
  static async getFranjaStats(filters = {}) {
    let query = `
      SELECT 
        COUNT(*) as total_franjas,
        COUNT(CASE WHEN franja_estado = 1 THEN 1 END) as franjas_activas,
        COUNT(CASE WHEN franja_disponible = 1 THEN 1 END) as franjas_disponibles,
        COUNT(DISTINCT franja_fecha) as dias_con_franjas,
        COUNT(DISTINCT empleado_id) as empleados_con_franjas
      FROM franjas_horarias
    `;

    const params = [];
    const conditions = [];

    if (filters.empleado_id) {
      conditions.push("empleado_id = ?");
      params.push(filters.empleado_id);
    }

    if (filters.fecha_inicio && filters.fecha_fin) {
      conditions.push("franja_fecha BETWEEN ? AND ?");
      params.push(filters.fecha_inicio, filters.fecha_fin);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    const result = await executeQuery(query, params);

    if (!result.success) {
      throw new Error(`Error al obtener estadísticas: ${result.error}`);
    }

    return result.data[0];
  }
}

export default FranjaHoraria;
