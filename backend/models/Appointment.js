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
        h.horario_inicio, h.horario_fin
      FROM citas c
      LEFT JOIN usuarios u ON c.usuario_id = u.usuario_id
      LEFT JOIN empleados e ON c.empleado_id = e.empleado_id
      LEFT JOIN usuarios ue ON e.usuario_id = ue.usuario_id
      LEFT JOIN tiendas t ON c.tienda_id = t.tienda_id
      LEFT JOIN servicios s ON c.servicio_id = s.servicio_id
      LEFT JOIN horarios h ON c.horario_id = h.horario_id
    `;

    const params = [];
    const conditions = [];

    // Aplicar filtros
    if (filters.usuario_id) {
      conditions.push("c.usuario_id = ?");
      params.push(filters.usuario_id);
    }

    if (filters.empleado_id) {
      conditions.push("c.empleado_id = ?");
      params.push(filters.empleado_id);
    }

    if (filters.tienda_id) {
      conditions.push("c.tienda_id = ?");
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

    query += " ORDER BY c.cita_fecha ASC, h.horario_inicio ASC";

    const result = await executeQuery(query, params);

    if (!result.success) {
      throw new Error(`Error al obtener citas: ${result.error}`);
    }

    return result.data;
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
        h.horario_inicio, h.horario_fin
      FROM citas c
      LEFT JOIN usuarios u ON c.usuario_id = u.usuario_id
      LEFT JOIN empleados e ON c.empleado_id = e.empleado_id
      LEFT JOIN usuarios ue ON e.usuario_id = ue.usuario_id
      LEFT JOIN tiendas t ON c.tienda_id = t.tienda_id
      LEFT JOIN servicios s ON c.servicio_id = s.servicio_id
      LEFT JOIN horarios h ON c.horario_id = h.horario_id
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
    const {
      usuario_id,
      empleado_id,
      tienda_id,
      servicio_id,
      cita_fecha,
      horario_id,
    } = appointmentData;

    // Validar datos requeridos
    if (
      !usuario_id ||
      !empleado_id ||
      !tienda_id ||
      !servicio_id ||
      !cita_fecha ||
      !horario_id
    ) {
      throw new Error("Todos los campos son requeridos");
    }

    try {
      // Verificar disponibilidad del horario
      const isAvailable = await this.checkTimeSlotAvailability(
        empleado_id,
        cita_fecha,
        horario_id
      );

      if (!isAvailable) {
        throw new Error("El horario seleccionado no está disponible");
      }

      // Crear la cita
      const query = `
        INSERT INTO citas 
        (usuario_id, empleado_id, tienda_id, servicio_id, cita_fecha, horario_id, cita_estado) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        usuario_id,
        empleado_id,
        tienda_id,
        servicio_id,
        cita_fecha,
        horario_id,
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

  // Verificar disponibilidad de horario
  static async checkTimeSlotAvailability(
    empleado_id,
    fecha,
    horario_id,
    exclude_cita_id = null
  ) {
    let query = `
      SELECT COUNT(*) as count 
      FROM citas 
      WHERE empleado_id = ? 
        AND DATE(cita_fecha) = ? 
        AND horario_id = ? 
        AND cita_estado NOT IN ('cancelada', 'completada')
    `;

    const params = [empleado_id, fecha, horario_id];

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
        SELECT c.horario_id 
        FROM citas c 
        WHERE c.empleado_id = ? 
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
        COUNT(*) as total_citas,
        SUM(CASE WHEN cita_estado = 'pendiente' THEN 1 ELSE 0 END) as pendientes,
        SUM(CASE WHEN cita_estado = 'confirmada' THEN 1 ELSE 0 END) as confirmadas,
        SUM(CASE WHEN cita_estado = 'completada' THEN 1 ELSE 0 END) as completadas,
        SUM(CASE WHEN cita_estado = 'cancelada' THEN 1 ELSE 0 END) as canceladas
      FROM citas
    `;

    const params = [];
    const conditions = [];

    if (filters.tienda_id) {
      conditions.push("tienda_id = ?");
      params.push(filters.tienda_id);
    }

    if (filters.fecha_inicio && filters.fecha_fin) {
      conditions.push("cita_fecha BETWEEN ? AND ?");
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

export default Appointment;
