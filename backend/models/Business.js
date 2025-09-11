import { executeQuery } from "../database/connectiondb.js";

class Business {
  // Estados válidos para negocios
  static STATES = {
    ACTIVE: 1,
    INACTIVE: 0,
  };

  // Obtener todos los negocios con filtro opcional por estado
  static async getAllBusiness(estado = null) {
    let query = "SELECT * FROM negocios";
    const params = [];

    if (estado !== null && !isNaN(estado)) {
      query += " WHERE negocio_estado = ?";
      params.push(Number(estado));
    }

    query += " ORDER BY negocio_nombre ASC";

    const result = await executeQuery(query, params);

    if (!result.success) {
      throw new Error(`Error al obtener negocios: ${result.error}`);
    }

    return result.data;
  }

  // Obtener negocio por ID
  static async getBusinessById(negocio_id) {
    const query = "SELECT * FROM negocios WHERE negocio_id = ?";
    const result = await executeQuery(query, [negocio_id]);

    if (!result.success) {
      throw new Error(`Error al obtener negocio: ${result.error}`);
    }

    return result.data[0] || null;
  }

  // Obtener negocio por correo (útil para validaciones)
  static async getBusinessByEmail(negocio_correo) {
    const query = "SELECT * FROM negocios WHERE negocio_correo = ?";
    const result = await executeQuery(query, [negocio_correo]);

    if (!result.success) {
      throw new Error(`Error al buscar negocio por email: ${result.error}`);
    }

    return result.data[0] || null;
  }

  // Obtener tiendas de un negocio con información detallada
  static async getStoresByBusiness(negocio_id) {
    const query = `
      SELECT 
        t.*,
        COUNT(e.empleado_id) as total_empleados,
        COUNT(s.servicio_id) as total_servicios
      FROM tiendas t
      LEFT JOIN empleados e ON t.tienda_id = e.tienda_id
      LEFT JOIN servicios s ON t.tienda_id = s.tienda_id
      WHERE t.negocio_id = ?
      GROUP BY t.tienda_id
      ORDER BY t.tienda_nombre ASC
    `;

    const result = await executeQuery(query, [negocio_id]);

    if (!result.success) {
      throw new Error(`Error al obtener tiendas del negocio: ${result.error}`);
    }

    return result.data;
  }

  // Crear nuevo negocio
  static async createBusiness(businessData) {
    const {
      negocio_nombre,
      negocio_direccion,
      negocio_telefono,
      negocio_correo,
      negocio_descripcion,
      propietario_id, // Agregamos el propietario
    } = businessData;

    // Validaciones
    if (
      !negocio_nombre ||
      !negocio_direccion ||
      !negocio_telefono ||
      !negocio_correo
    ) {
      throw new Error(
        "Los campos nombre, dirección, teléfono y correo son obligatorios"
      );
    }

    // Verificar si el correo ya existe
    const existingBusiness = await this.getBusinessByEmail(negocio_correo);
    if (existingBusiness) {
      throw new Error(
        "Ya existe un negocio registrado con ese correo electrónico"
      );
    }

    try {
      const query = `
        INSERT INTO negocios 
        (negocio_nombre, negocio_direccion, negocio_telefono, negocio_correo, negocio_descripcion, propietario_id, negocio_estado) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        negocio_nombre,
        negocio_direccion,
        negocio_telefono,
        negocio_correo,
        negocio_descripcion || null,
        propietario_id || null,
        this.STATES.ACTIVE,
      ];

      const result = await executeQuery(query, params);

      if (!result.success) {
        throw new Error(`Error al crear negocio: ${result.error}`);
      }

      return {
        success: true,
        negocio_id: result.data.insertId,
        message: "Negocio creado exitosamente",
        data: await this.getBusinessById(result.data.insertId),
      };
    } catch (error) {
      throw new Error(`Error al crear negocio: ${error.message}`);
    }
  }

  // Actualizar negocio
  static async updateBusiness(negocio_id, updateData) {
    const {
      negocio_nombre,
      negocio_direccion,
      negocio_telefono,
      negocio_correo,
      negocio_descripcion,
    } = updateData;

    // Verificar que el negocio existe
    const existingBusiness = await this.getBusinessById(negocio_id);
    if (!existingBusiness) {
      throw new Error("Negocio no encontrado");
    }

    // Si se cambia el correo, verificar que no exista otro negocio con ese correo
    if (negocio_correo && negocio_correo !== existingBusiness.negocio_correo) {
      const duplicateEmail = await this.getBusinessByEmail(negocio_correo);
      if (duplicateEmail) {
        throw new Error(
          "Ya existe un negocio registrado con ese correo electrónico"
        );
      }
    }

    const query = `
      UPDATE negocios 
      SET negocio_nombre = COALESCE(?, negocio_nombre),
          negocio_direccion = COALESCE(?, negocio_direccion),
          negocio_telefono = COALESCE(?, negocio_telefono),
          negocio_correo = COALESCE(?, negocio_correo),
          negocio_descripcion = COALESCE(?, negocio_descripcion)
      WHERE negocio_id = ?
    `;

    const params = [
      negocio_nombre,
      negocio_direccion,
      negocio_telefono,
      negocio_correo,
      negocio_descripcion,
      negocio_id,
    ];

    const result = await executeQuery(query, params);

    if (!result.success) {
      throw new Error(`Error al actualizar negocio: ${result.error}`);
    }

    if (result.data.affectedRows === 0) {
      throw new Error("Negocio no encontrado");
    }

    return {
      success: true,
      message: "Negocio actualizado exitosamente",
      affectedRows: result.data.affectedRows,
      data: await this.getBusinessById(negocio_id),
    };
  }

  // Cambiar estado del negocio
  static async changeBusinessState(negocio_id, nuevo_estado) {
    // Validar estado
    if (!Object.values(this.STATES).includes(nuevo_estado)) {
      throw new Error(`Estado inválido: ${nuevo_estado}`);
    }

    const query = "UPDATE negocios SET negocio_estado = ? WHERE negocio_id = ?";
    const result = await executeQuery(query, [nuevo_estado, negocio_id]);

    if (!result.success) {
      throw new Error(`Error al cambiar estado del negocio: ${result.error}`);
    }

    if (result.data.affectedRows === 0) {
      throw new Error("Negocio no encontrado");
    }

    const estadoTexto =
      nuevo_estado === this.STATES.ACTIVE ? "activado" : "desactivado";
    return {
      success: true,
      message: `Negocio ${estadoTexto} exitosamente`,
      affectedRows: result.data.affectedRows,
    };
  }

  // Desactivar negocio (soft delete)
  static async deleteBusiness(negocio_id) {
    return await this.changeBusinessState(negocio_id, this.STATES.INACTIVE);
  }

  // Reactivar negocio
  static async reactivateBusiness(negocio_id) {
    return await this.changeBusinessState(negocio_id, this.STATES.ACTIVE);
  }

  // Obtener estadísticas del negocio
  static async getBusinessStats(negocio_id) {
    const query = `
      SELECT 
        n.negocio_nombre,
        COUNT(DISTINCT t.tienda_id) as total_tiendas,
        COUNT(DISTINCT e.empleado_id) as total_empleados,
        COUNT(DISTINCT s.servicio_id) as total_servicios,
        COUNT(DISTINCT c.cita_id) as total_citas,
        COUNT(DISTINCT CASE WHEN c.cita_estado = 'completada' THEN c.cita_id END) as completedAppointments,
        COUNT(DISTINCT CASE WHEN c.cita_estado = 'pendiente' THEN c.cita_id END) as pendingAppointments,
        COUNT(DISTINCT CASE WHEN c.cita_estado = 'cancelada' THEN c.cita_id END) as cancelledAppointments,
        COALESCE(SUM(CASE WHEN c.cita_estado = 'completada' THEN s.servicio_precio ELSE 0 END), 0) as totalRevenue
      FROM negocios n
      LEFT JOIN tiendas t ON n.negocio_id = t.negocio_id
      LEFT JOIN empleados e ON t.tienda_id = e.tienda_id
      LEFT JOIN servicios s ON t.tienda_id = s.tienda_id
        LEFT JOIN franjas_horarias f ON t.tienda_id = f.tienda_id
        LEFT JOIN citas c ON f.franja_id = c.franja_id
      WHERE n.negocio_id = ?
      GROUP BY n.negocio_id
    `;

    const result = await executeQuery(query, [negocio_id]);

    if (!result.success) {
      throw new Error(`Error al obtener estadísticas: ${result.error}`);
    }

    return (
      result.data[0] || {
        total_tiendas: 0,
        total_empleados: 0,
        total_servicios: 0,
        total_citas: 0,
        completedAppointments: 0,
        pendingAppointments: 0,
        cancelledAppointments: 0,
        totalRevenue: 0,
      }
    );
  }

  // Buscar negocios por nombre
  static async searchBusinessByName(nombre) {
    const query = `
      SELECT * FROM negocios 
      WHERE negocio_nombre LIKE ? 
      AND negocio_estado = ? 
      ORDER BY negocio_nombre ASC
    `;

    const result = await executeQuery(query, [
      `%${nombre}%`,
      this.STATES.ACTIVE,
    ]);

    if (!result.success) {
      throw new Error(`Error al buscar negocios: ${result.error}`);
    }

    return result.data;
  }

  // Obtener negocios por propietario
  static async getBusinessByOwner(propietario_id) {
    const query = `
      SELECT n.*, COUNT(t.tienda_id) as total_tiendas
      FROM negocios n
      LEFT JOIN tiendas t ON n.negocio_id = t.negocio_id
      WHERE n.propietario_id = ?
      GROUP BY n.negocio_id
      ORDER BY n.negocio_nombre ASC
    `;

    const result = await executeQuery(query, [propietario_id]);

    if (!result.success) {
      throw new Error(
        `Error al obtener negocios del propietario: ${result.error}`
      );
    }

    return result.data;
  }

  // Contar negocios por estado
  static async countBusinessByState(estado = this.STATES.ACTIVE) {
    const query =
      "SELECT COUNT(*) as total FROM negocios WHERE negocio_estado = ?";
    const result = await executeQuery(query, [estado]);

    if (!result.success) {
      throw new Error(`Error al contar negocios: ${result.error}`);
    }

    return result.data[0]?.total || 0;
  }

  // Verificar si un negocio puede ser eliminado (no tiene tiendas activas)
  static async canDeleteBusiness(negocio_id) {
    const query = `
      SELECT COUNT(*) as tiendas_activas
      FROM tiendas 
      WHERE negocio_id = ? AND tienda_estado = 1
    `;

    const result = await executeQuery(query, [negocio_id]);

    if (!result.success) {
      throw new Error(`Error al verificar eliminación: ${result.error}`);
    }

    return result.data[0]?.tiendas_activas === 0;
  }
}

export default Business;
