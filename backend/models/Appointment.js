import { executeQuery, executeTransaction } from "../database/connectiondb.js";

class Appointment {
  // Estados válidos para las citas
  static STATES = {
    PENDING: "pendiente",
    CONFIRMED: "confirmada",
    COMPLETED: "completada",
    CANCELLED: "cancelada",
  };

  // Obtener todas las citas con información detallada
  static async getAllAppointments(filters = {}) {
    let query = `
      SELECT 
        c.*,
        u.usuario_nombre, u.usuario_apellido, u.usuario_telefono,
        ue.usuario_nombre AS empleado_nombre, ue.usuario_apellido AS empleado_apellido,
        t.tienda_nombre,
        s.servicio_nombre, s.servicio_precio, s.servicio_duracion,
        f.franja_hora_inicio, f.franja_hora_fin,
        h.horario_dia, h.horario_inicio, h.horario_fin
      FROM citas c
      LEFT JOIN usuarios u ON c.usuario_id = u.usuario_id
      LEFT JOIN franjas_horarias f ON c.franja_id = f.franja_id
      LEFT JOIN horarios h ON f.horario_id = h.horario_id
      LEFT JOIN empleados e ON f.empleado_id = e.empleado_id
      LEFT JOIN usuarios ue ON e.usuario_id = ue.usuario_id
      LEFT JOIN tiendas t ON f.tienda_id = t.tienda_id
      LEFT JOIN servicios s ON c.servicio_id = s.servicio_id
    `;

    const params = [];
    const conditions = [];

    // Aplicar filtros
    if (filters.usuario_id) {
      conditions.push("c.usuario_id = ?");
      params.push(filters.usuario_id);
    }

    if (filters.empleado_id) {
      conditions.push("f.empleado_id = ?");
      params.push(filters.empleado_id);
    }

    if (filters.tienda_id) {
      conditions.push("f.tienda_id = ?");
      params.push(filters.tienda_id);
    }

    if (filters.estado) {
      conditions.push("c.cita_estado = ?");
      params.push(filters.estado);
    }

    if (filters.fecha) {
      conditions.push("DATE(c.cita_fecha) = ?");
      params.push(filters.fecha);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY c.cita_fecha ASC, f.franja_hora_inicio ASC";

    const result = await executeQuery(query, params);

    if (!result.success) {
      throw new Error(`Error al obtener citas: ${result.error}`);
    }

    return result.data;
  }

  // Obtener citas por propietario (solo de sus negocios)
  static async getAppointmentsByOwner(propietario_id, filters = {}) {
    let query = `
      SELECT 
        c.*,
        u.usuario_nombre, u.usuario_apellido, u.usuario_telefono, u.usuario_correo,
        ue.usuario_nombre AS empleado_nombre, ue.usuario_apellido AS empleado_apellido,
        t.tienda_nombre, t.tienda_ciudad,
        s.servicio_nombre, s.servicio_precio, s.servicio_duracion,
        f.franja_hora_inicio, f.franja_hora_fin,
        h.horario_dia, h.horario_inicio, h.horario_fin,
        n.negocio_nombre, n.negocio_id
      FROM citas c
      LEFT JOIN usuarios u ON c.usuario_id = u.usuario_id
      LEFT JOIN franjas_horarias f ON c.franja_id = f.franja_id
      LEFT JOIN horarios h ON f.horario_id = h.horario_id
      LEFT JOIN empleados e ON f.empleado_id = e.empleado_id
      LEFT JOIN usuarios ue ON e.usuario_id = ue.usuario_id
      LEFT JOIN tiendas t ON f.tienda_id = t.tienda_id
      LEFT JOIN servicios s ON c.servicio_id = s.servicio_id
      LEFT JOIN negocios n ON t.negocio_id = n.negocio_id
      WHERE n.propietario_id = ?
    `;

    const params = [propietario_id];
    const conditions = [];

    // Aplicar filtros adicionales
    if (filters.negocio_id) {
      conditions.push("n.negocio_id = ?");
      params.push(filters.negocio_id);
    }

    if (filters.tienda_id) {
      conditions.push("t.tienda_id = ?");
      params.push(filters.tienda_id);
    }

    if (filters.estado) {
      conditions.push("c.cita_estado = ?");
      params.push(filters.estado);
    }

    if (filters.fecha) {
      conditions.push("DATE(c.cita_fecha) = ?");
      params.push(filters.fecha);
    }

    if (conditions.length > 0) {
      query += " AND " + conditions.join(" AND ");
    }

    query += " ORDER BY c.cita_fecha ASC, f.franja_hora_inicio ASC";

    const result = await executeQuery(query, params);

    if (!result.success) {
      throw new Error(
        `Error al obtener citas del propietario: ${result.error}`
      );
    }

    // Estructurar los datos para que coincidan con lo que espera el frontend
    return result.data.map((appointment) => ({
      ...appointment,
      cliente: {
        nombre: appointment.usuario_nombre,
        apellido: appointment.usuario_apellido,
        telefono: appointment.usuario_telefono,
        correo: appointment.usuario_correo,
      },
      empleado: {
        usuario: {
          nombre: appointment.empleado_nombre,
          apellido: appointment.empleado_apellido,
        },
        empleado_especialidad: appointment.empleado_especialidad,
      },
      servicio: {
        servicio_nombre: appointment.servicio_nombre,
        servicio_precio: appointment.servicio_precio,
        servicio_duracion: appointment.servicio_duracion,
      },
      tienda: {
        tienda_nombre: appointment.tienda_nombre,
        tienda_ciudad: appointment.tienda_ciudad,
      },
      negocio: {
        negocio_nombre: appointment.negocio_nombre,
        negocio_id: appointment.negocio_id,
      },
    }));
  }

  // Obtener cita por ID con información detallada
  static async getAppointmentById(cita_id) {
    const query = `
      SELECT 
        c.*,
        u.usuario_nombre, u.usuario_apellido, u.usuario_telefono, u.usuario_correo,
        ue.usuario_nombre AS empleado_nombre, ue.usuario_apellido AS empleado_apellido,
        t.tienda_nombre, t.tienda_direccion,
        s.servicio_nombre, s.servicio_precio, s.servicio_duracion,
        f.franja_hora_inicio, f.franja_hora_fin,
        h.horario_dia, h.horario_inicio, h.horario_fin
      FROM citas c
      LEFT JOIN usuarios u ON c.usuario_id = u.usuario_id
      LEFT JOIN franjas_horarias f ON c.franja_id = f.franja_id
      LEFT JOIN horarios h ON f.horario_id = h.horario_id
      LEFT JOIN empleados e ON f.empleado_id = e.empleado_id
      LEFT JOIN usuarios ue ON e.usuario_id = ue.usuario_id
      LEFT JOIN tiendas t ON f.tienda_id = t.tienda_id
      LEFT JOIN servicios s ON c.servicio_id = s.servicio_id
      WHERE c.cita_id = ?
    `;

    const result = await executeQuery(query, [cita_id]);

    if (!result.success) {
      throw new Error(`Error al obtener cita: ${result.error}`);
    }

    return result.data[0] || null;
  }

  // Crear nueva cita con validaciones
  static async createAppointment(appointmentData) {
    console.log("🔍 Appointment.createAppointment recibió:", appointmentData);

    const {
      usuario_id,
      empleado_id,
      tienda_id,
      servicio_id,
      cita_fecha,
      franja_id, // franja_id real
      slot_inicio,
      slot_fin,
    } = appointmentData;

    console.log("🔍 Campos extraídos:", {
      usuario_id,
      empleado_id,
      tienda_id,
      servicio_id,
      cita_fecha,
      franja_id,
      slot_inicio,
      slot_fin,
    });

    // Validar datos requeridos
    const requiredFields = {
      usuario_id,
      empleado_id,
      tienda_id,
      servicio_id,
      cita_fecha,
      franja_id,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      console.error("❌ Campos faltantes:", missingFields);
      throw new Error(
        `Todos los campos son requeridos. Faltantes: ${missingFields.join(
          ", "
        )}`
      );
    }

    try {
      // Si se proporcionan slot_inicio y slot_fin, verificar disponibilidad del slot específico
      if (slot_inicio && slot_fin) {
        console.log("🔍 Verificando disponibilidad del slot:", {
          franja_id,
          slot_inicio,
          slot_fin,
          cita_fecha,
        });

        const isSlotAvailable = await this.checkSlotAvailability(
          franja_id,
          slot_inicio,
          slot_fin,
          cita_fecha
        );

        console.log("🔍 Resultado de checkSlotAvailability:", isSlotAvailable);

        if (!isSlotAvailable) {
          throw new Error("El horario seleccionado no está disponible");
        }
      } else {
        console.log("🔍 Verificando disponibilidad de la franja completa:", {
          franja_id,
          cita_fecha,
        });

        // Verificar disponibilidad de la franja horaria completa
        const isAvailable = await this.checkFranjaAvailability(
          franja_id,
          cita_fecha
        );

        console.log("🔍 Resultado de checkFranjaAvailability:", isAvailable);

        if (!isAvailable) {
          throw new Error("La franja horaria seleccionada no está disponible");
        }
      }

      // Crear la cita usando franja_id
      const query = `
        INSERT INTO citas 
        (usuario_id, franja_id, servicio_id, cita_fecha, slot_inicio, slot_fin, cita_estado) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        usuario_id,
        franja_id, // franja_id real
        servicio_id,
        cita_fecha,
        slot_inicio,
        slot_fin,
        this.STATES.PENDING,
      ];

      const result = await executeQuery(query, params);

      if (!result.success) {
        throw new Error(`Error al crear cita: ${result.error}`);
      }

      return {
        success: true,
        cita_id: result.data.insertId,
        message: "Cita creada exitosamente",
        data: await this.getAppointmentById(result.data.insertId),
      };
    } catch (error) {
      throw new Error(`Error al crear cita: ${error.message}`);
    }
  }

  // Verificar disponibilidad de franja horaria
  static async checkFranjaAvailability(
    franja_id,
    fecha,
    exclude_cita_id = null
  ) {
    let query = `
      SELECT COUNT(*) as count 
      FROM citas 
      WHERE franja_id = ? 
        AND DATE(cita_fecha) = ? 
        AND cita_estado NOT IN ('cancelada', 'completada')
    `;

    const params = [franja_id, fecha];

    // Excluir cita específica (útil para actualizaciones)
    if (exclude_cita_id) {
      query += " AND cita_id != ?";
      params.push(exclude_cita_id);
    }

    const result = await executeQuery(query, params);

    if (!result.success) {
      throw new Error(`Error al verificar disponibilidad: ${result.error}`);
    }

    return result.data[0].count === 0;
  }

  // Verificar disponibilidad de slot específico dentro de una franja
  static async checkSlotAvailability(
    franja_id,
    slot_inicio,
    slot_fin,
    fecha,
    exclude_cita_id = null
  ) {
    console.log("🔍 checkSlotAvailability llamado con:", {
      franja_id,
      slot_inicio,
      slot_fin,
      fecha,
      exclude_cita_id,
    });

    let query = `
      SELECT COUNT(*) as count 
      FROM citas c
      WHERE c.franja_id = ? 
        AND DATE(c.cita_fecha) = ? 
        AND c.cita_estado NOT IN ('cancelada', 'completada')
        AND (
          (c.slot_inicio <= ? AND c.slot_fin > ?) OR
          (c.slot_inicio < ? AND c.slot_fin >= ?) OR
          (c.slot_inicio >= ? AND c.slot_fin <= ?)
        )
    `;

    const params = [
      franja_id,
      fecha,
      slot_inicio,
      slot_inicio,
      slot_fin,
      slot_fin,
      slot_inicio,
      slot_fin,
    ];

    // Excluir cita específica (útil para actualizaciones)
    if (exclude_cita_id) {
      query += " AND c.cita_id != ?";
      params.push(exclude_cita_id);
    }

    const result = await executeQuery(query, params);

    if (!result.success) {
      throw new Error(
        `Error al verificar disponibilidad del slot: ${result.error}`
      );
    }

    return result.data[0].count === 0;
  }

  // Verificar disponibilidad de horario (método legacy para compatibilidad)
  static async checkTimeSlotAvailability(
    empleado_id,
    fecha,
    horario_id,
    exclude_cita_id = null
  ) {
    // Redirigir al nuevo método de franjas
    return await this.checkFranjaAvailability(
      horario_id,
      fecha,
      exclude_cita_id
    );
  }

  // Actualizar cita
  static async updateAppointment(cita_id, updateData) {
    const { tienda_id, servicio_id, cita_fecha, horario_id, empleado_id } =
      updateData;

    // Verificar que la cita existe y está en estado válido para actualizar
    const existingAppointment = await this.getAppointmentById(cita_id);
    if (!existingAppointment) {
      throw new Error("Cita no encontrada");
    }

    if (existingAppointment.cita_estado === this.STATES.COMPLETED) {
      throw new Error("No se puede actualizar una cita completada");
    }

    // Si se cambia empleado, fecha u horario, verificar disponibilidad
    if (empleado_id || cita_fecha || horario_id) {
      const emp_id = empleado_id || existingAppointment.empleado_id;
      const fecha =
        cita_fecha ||
        existingAppointment.cita_fecha.toISOString().split("T")[0];
      const hor_id = horario_id || existingAppointment.horario_id;

      const isAvailable = await this.checkTimeSlotAvailability(
        emp_id,
        fecha,
        hor_id,
        cita_id
      );
      if (!isAvailable) {
        throw new Error("El nuevo horario no está disponible");
      }
    }

    const query = `
      UPDATE citas 
      SET tienda_id = COALESCE(?, tienda_id),
          servicio_id = COALESCE(?, servicio_id),
          cita_fecha = COALESCE(?, cita_fecha),
          horario_id = COALESCE(?, horario_id),
          empleado_id = COALESCE(?, empleado_id)
      WHERE cita_id = ?
    `;

    const params = [
      tienda_id,
      servicio_id,
      cita_fecha,
      horario_id,
      empleado_id,
      cita_id,
    ];
    const result = await executeQuery(query, params);

    if (!result.success) {
      throw new Error(`Error al actualizar cita: ${result.error}`);
    }

    if (result.data.affectedRows === 0) {
      throw new Error("Cita no encontrada");
    }

    return {
      success: true,
      message: "Cita actualizada exitosamente",
      data: await this.getAppointmentById(cita_id),
    };
  }

  // Cambiar estado de cita
  static async changeStateAppointment(cita_id, nuevo_estado) {
    // Validar estado
    if (!Object.values(this.STATES).includes(nuevo_estado)) {
      throw new Error(`Estado inválido: ${nuevo_estado}`);
    }

    const query = "UPDATE citas SET cita_estado = ? WHERE cita_id = ?";
    const result = await executeQuery(query, [nuevo_estado, cita_id]);

    if (!result.success) {
      throw new Error(`Error al cambiar estado: ${result.error}`);
    }

    if (result.data.affectedRows === 0) {
      throw new Error("Cita no encontrada");
    }

    return {
      success: true,
      message: `Cita ${nuevo_estado} exitosamente`,
      data: await this.getAppointmentById(cita_id),
    };
  }

  // Cancelar cita
  static async cancelAppointment(cita_id, motivo = null) {
    const existingAppointment = await this.getAppointmentById(cita_id);
    if (!existingAppointment) {
      throw new Error("Cita no encontrada");
    }

    if (existingAppointment.cita_estado === this.STATES.COMPLETED) {
      throw new Error("No se puede cancelar una cita completada");
    }

    // Si hay motivo, guardarlo
    if (motivo) {
      const updateQuery =
        "UPDATE citas SET cita_observaciones = ? WHERE cita_id = ?";
      await executeQuery(updateQuery, [motivo, cita_id]);
    }

    return await this.changeStateAppointment(cita_id, this.STATES.CANCELLED);
  }

  // Confirmar cita
  static async confirmAppointment(cita_id) {
    return await this.changeStateAppointment(cita_id, this.STATES.CONFIRMED);
  }

  // Completar cita
  static async completeAppointment(cita_id, observaciones = null) {
    // Si hay observaciones, guardarlas
    if (observaciones) {
      const updateQuery =
        "UPDATE citas SET cita_observaciones = ? WHERE cita_id = ?";
      await executeQuery(updateQuery, [observaciones, cita_id]);
    }

    return await this.changeStateAppointment(cita_id, this.STATES.COMPLETED);
  }

  // Eliminar cita (solo si está pendiente)
  static async deleteAppointment(cita_id) {
    const query = "DELETE FROM citas WHERE cita_id = ? AND cita_estado = ?";
    const result = await executeQuery(query, [cita_id, this.STATES.PENDING]);

    if (!result.success) {
      throw new Error(`Error al eliminar cita: ${result.error}`);
    }

    return {
      success: true,
      deleted: result.data.affectedRows > 0,
      message:
        result.data.affectedRows > 0
          ? "Cita eliminada exitosamente"
          : "No se pudo eliminar la cita. Solo se pueden eliminar citas pendientes",
    };
  }

  // Obtener citas por usuario
  static async getAppointmentsByUser(usuario_id, estado = null) {
    const filters = { usuario_id };
    if (estado) filters.estado = estado;

    return await this.getAllAppointments(filters);
  }

  // Obtener citas por empleado
  static async getAppointmentsByEmployee(empleado_id, fecha = null) {
    const filters = { empleado_id };
    if (fecha) filters.fecha = fecha;

    return await this.getAllAppointments(filters);
  }

  // Obtener horarios disponibles para un empleado en una fecha
  static async getAvailableTimeSlots(empleado_id, fecha) {
    const query = `
      SELECT h.* 
      FROM horarios h
      WHERE h.horario_id NOT IN (
        SELECT fh.horario_id 
        FROM franjas_horarias fh
        INNER JOIN citas c ON fh.franja_id = c.franja_id
        WHERE fh.empleado_id = ? 
          AND DATE(c.cita_fecha) = ?
          AND c.cita_estado NOT IN ('cancelada', 'completada')
      )
      ORDER BY h.horario_inicio ASC
    `;

    const result = await executeQuery(query, [empleado_id, fecha]);

    if (!result.success) {
      throw new Error(`Error al obtener horarios disponibles: ${result.error}`);
    }

    return result.data;
  }

  // Estadísticas de citas
  static async getAppointmentStats(filters = {}) {
    let query = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN cita_estado = 'pendiente' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN cita_estado = 'confirmada' THEN 1 ELSE 0 END) as confirmed,
        SUM(CASE WHEN cita_estado = 'completada' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN cita_estado = 'cancelada' THEN 1 ELSE 0 END) as cancelled,
        COALESCE(SUM(CASE WHEN cita_estado = 'completada' THEN s.servicio_precio ELSE 0 END), 0) as totalRevenue,
        COALESCE(AVG(CASE WHEN cita_estado = 'completada' THEN s.servicio_precio ELSE NULL END), 0) as averageRevenue,
        COUNT(CASE WHEN cita_estado = 'completada' THEN 1 END) as completedCount
      FROM citas c
      LEFT JOIN servicios s ON c.servicio_id = s.servicio_id
    `;

    const params = [];
    const conditions = [];

    if (filters.tienda_id) {
      conditions.push("c.tienda_id = ?");
      params.push(filters.tienda_id);
    }

    if (filters.fecha_inicio && filters.fecha_fin) {
      conditions.push("c.cita_fecha BETWEEN ? AND ?");
      params.push(filters.fecha_inicio, filters.fecha_fin);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    const result = await executeQuery(query, params);

    if (!result.success) {
      throw new Error(`Error al obtener estadísticas: ${result.error}`);
    }

    const stats = result.data[0];

    // Calcular métricas adicionales
    const total = stats.total || 0;
    const completed = stats.completed || 0;
    const cancelled = stats.cancelled || 0;

    return {
      ...stats,
      totalRevenue: stats.totalRevenue || 0,
      averageRevenue: stats.averageRevenue || 0,
      averagePerDay: total > 0 ? Math.round(total / 30) : 0, // Aproximación de 30 días
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      cancellationRate: total > 0 ? Math.round((cancelled / total) * 100) : 0,
    };
  }
}

export default Appointment;
