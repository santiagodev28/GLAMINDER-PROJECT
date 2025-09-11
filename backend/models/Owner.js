import { executeQuery, executeTransaction } from "../database/connectiondb.js";

class Owner {
  // Estados válidos para propietarios
  static STATES = {
    ACTIVE: 1,
    INACTIVE: 0,
  };

  // Obtener todos los propietarios con información completa
  static async getAllOwners(filters = {}) {
    let query = `
      SELECT 
        p.*,
        u.usuario_nombre, u.usuario_apellido, u.usuario_correo, u.usuario_telefono,
        COUNT(n.negocio_id) as total_negocios,
        COUNT(CASE WHEN n.negocio_estado = 1 THEN 1 END) as negocios_activos
      FROM propietarios p
      LEFT JOIN usuarios u ON p.usuario_id = u.usuario_id
      LEFT JOIN negocios n ON p.propietario_id = n.propietario_id
    `;

    const params = [];
    const conditions = [];

    // Aplicar filtros
    if (filters.estado !== undefined) {
      conditions.push("p.propietario_estado = ?");
      params.push(filters.estado);
    } else {
      // Por defecto, mostrar solo activos
      conditions.push("p.propietario_estado = ?");
      params.push(this.STATES.ACTIVE);
    }

    if (filters.usuario_correo) {
      conditions.push("u.usuario_correo LIKE ?");
      params.push(`%${filters.usuario_correo}%`);
    }

    if (filters.usuario_nombre) {
      conditions.push("(u.usuario_nombre LIKE ? OR u.usuario_apellido LIKE ?)");
      params.push(`%${filters.usuario_nombre}%`, `%${filters.usuario_nombre}%`);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += `
      GROUP BY p.propietario_id, u.usuario_id
      ORDER BY u.usuario_nombre ASC, u.usuario_apellido ASC
    `;

    const result = await executeQuery(query, params);

    if (!result.success) {
      throw new Error(`Error al obtener propietarios: ${result.error}`);
    }

    return result.data;
  }

  // Obtener propietario por ID con información completa
  static async getOwnerById(propietario_id) {
    const query = `
      SELECT 
        p.*,
        u.usuario_nombre, u.usuario_apellido, u.usuario_correo, u.usuario_telefono, u.usuario_estado,
        COUNT(n.negocio_id) as total_negocios,
        COUNT(CASE WHEN n.negocio_estado = 1 THEN 1 END) as negocios_activos
      FROM propietarios p
      LEFT JOIN usuarios u ON p.usuario_id = u.usuario_id
      LEFT JOIN negocios n ON p.propietario_id = n.propietario_id
      WHERE p.propietario_id = ?
      GROUP BY p.propietario_id, u.usuario_id
    `;

    const result = await executeQuery(query, [propietario_id]);

    if (!result.success) {
      throw new Error(`Error al obtener propietario: ${result.error}`);
    }

    return result.data[0] || null;
  }

  // Obtener propietario por usuario_id
  static async getOwnerByUserId(usuario_id) {
    const query = `
      SELECT 
        p.*,
        u.usuario_nombre, u.usuario_apellido, u.usuario_correo, u.usuario_telefono,
        COUNT(n.negocio_id) as total_negocios,
        COUNT(CASE WHEN n.negocio_estado = 1 THEN 1 END) as negocios_activos
      FROM propietarios p
      LEFT JOIN usuarios u ON p.usuario_id = u.usuario_id
      LEFT JOIN negocios n ON p.propietario_id = n.propietario_id
      WHERE p.usuario_id = ?
      GROUP BY p.propietario_id, u.usuario_id
    `;

    const result = await executeQuery(query, [usuario_id]);

    if (!result.success) {
      throw new Error(
        `Error al obtener propietario por usuario: ${result.error}`
      );
    }

    return result.data[0] || null;
  }

  // Crear nuevo propietario
  static async createOwner(ownerData) {
    const { usuario_id, fecha_registro } = ownerData;

    // Validaciones
    if (!usuario_id) {
      throw new Error("El campo usuario_id es obligatorio");
    }

    try {
      // Verificar que el usuario no sea ya propietario
      const existingOwner = await this.getOwnerByUserId(usuario_id);
      if (existingOwner) {
        throw new Error("Este usuario ya está registrado como propietario");
      }

      // Verificar que el usuario existe
      const userQuery =
        "SELECT usuario_id FROM usuarios WHERE usuario_id = ? AND usuario_estado = 1";
      const userResult = await executeQuery(userQuery, [usuario_id]);

      if (!userResult.success || userResult.data.length === 0) {
        throw new Error("El usuario especificado no existe o está inactivo");
      }

      // Crear el propietario
      const query = `
        INSERT INTO propietarios 
        (usuario_id, propietario_fecha_registro, propietario_estado) 
        VALUES (?, ?, ?)
      `;

      const params = [
        usuario_id,
        fecha_registro || new Date().toISOString().split("T")[0],
        this.STATES.ACTIVE,
      ];

      const result = await executeQuery(query, params);

      if (!result.success) {
        throw new Error(`Error al crear propietario: ${result.error}`);
      }

      return {
        success: true,
        propietario_id: result.data.insertId,
        message: "Propietario creado exitosamente",
        data: await this.getOwnerById(result.data.insertId),
      };
    } catch (error) {
      throw new Error(`Error al crear propietario: ${error.message}`);
    }
  }

  // Actualizar propietario
  static async updateOwner(propietario_id, updateData) {
    const { usuario_id, propietario_fecha_registro } = updateData;

    // Verificar que el propietario existe
    const existingOwner = await this.getOwnerById(propietario_id);
    if (!existingOwner) {
      throw new Error("Propietario no encontrado");
    }

    // Si se cambia el usuario, verificar que no sea ya propietario
    if (usuario_id && usuario_id !== existingOwner.usuario_id) {
      const duplicateOwner = await this.getOwnerByUserId(usuario_id);
      if (duplicateOwner) {
        throw new Error("Este usuario ya está registrado como propietario");
      }

      // Verificar que el nuevo usuario existe
      const userQuery =
        "SELECT usuario_id FROM usuarios WHERE usuario_id = ? AND usuario_estado = 1";
      const userResult = await executeQuery(userQuery, [usuario_id]);

      if (!userResult.success || userResult.data.length === 0) {
        throw new Error("El usuario especificado no existe o está inactivo");
      }
    }

    const query = `
      UPDATE propietarios 
      SET usuario_id = COALESCE(?, usuario_id),
          propietario_fecha_registro = COALESCE(?, propietario_fecha_registro)
      WHERE propietario_id = ?
    `;

    const params = [usuario_id, propietario_fecha_registro, propietario_id];
    const result = await executeQuery(query, params);

    if (!result.success) {
      throw new Error(`Error al actualizar propietario: ${result.error}`);
    }

    if (result.data.affectedRows === 0) {
      throw new Error("Propietario no encontrado");
    }

    return {
      success: true,
      message: "Propietario actualizado exitosamente",
      affectedRows: result.data.affectedRows,
      data: await this.getOwnerById(propietario_id),
    };
  }

  // Cambiar estado del propietario
  static async changeOwnerState(propietario_id, nuevo_estado) {
    // Validar estado
    if (!Object.values(this.STATES).includes(nuevo_estado)) {
      throw new Error(`Estado inválido: ${nuevo_estado}`);
    }

    const query =
      "UPDATE propietarios SET propietario_estado = ? WHERE propietario_id = ?";
    const result = await executeQuery(query, [nuevo_estado, propietario_id]);

    if (!result.success) {
      throw new Error(
        `Error al cambiar estado del propietario: ${result.error}`
      );
    }

    if (result.data.affectedRows === 0) {
      throw new Error("Propietario no encontrado");
    }

    const estadoTexto =
      nuevo_estado === this.STATES.ACTIVE ? "activado" : "desactivado";
    return {
      success: true,
      message: `Propietario ${estadoTexto} exitosamente`,
      affectedRows: result.data.affectedRows,
    };
  }

  // Desactivar propietario (soft delete)
  static async deleteOwner(propietario_id) {
    // Verificar si tiene negocios activos
    const hasActiveBusinesses = await this.hasActiveBusinesses(propietario_id);
    if (hasActiveBusinesses) {
      throw new Error(
        "No se puede desactivar un propietario con negocios activos"
      );
    }

    return await this.changeOwnerState(propietario_id, this.STATES.INACTIVE);
  }

  // Reactivar propietario
  static async reactivateOwner(propietario_id) {
    return await this.changeOwnerState(propietario_id, this.STATES.ACTIVE);
  }

  // Verificar si el propietario tiene negocios activos
  static async hasActiveBusinesses(propietario_id) {
    const query = `
      SELECT COUNT(*) as count 
      FROM negocios 
      WHERE propietario_id = ? 
      AND negocio_estado = 1
    `;

    const result = await executeQuery(query, [propietario_id]);

    if (!result.success) {
      throw new Error(`Error al verificar negocios activos: ${result.error}`);
    }

    return result.data[0]?.count > 0;
  }

  // Obtener negocios del propietario
  static async getOwnerBusinesses(propietario_id, includeInactive = false) {
    let query = `
      SELECT 
        n.*,
        COUNT(t.tienda_id) as total_tiendas,
        COUNT(CASE WHEN t.tienda_estado = 1 THEN 1 END) as tiendas_activas
      FROM negocios n
      LEFT JOIN tiendas t ON n.negocio_id = t.negocio_id
      WHERE n.propietario_id = ?
    `;

    const params = [propietario_id];

    if (!includeInactive) {
      query += " AND n.negocio_estado = 1";
    }

    query += `
      GROUP BY n.negocio_id
      ORDER BY n.negocio_nombre ASC
    `;

    const result = await executeQuery(query, params);

    if (!result.success) {
      throw new Error(
        `Error al obtener negocios del propietario: ${result.error}`
      );
    }

    return result.data;
  }

  // Obtener estadísticas del propietario
  static async getOwnerStats(propietario_id) {
    try {
      // Primero verificar que el propietario existe
      const ownerExists = await this.getOwnerById(propietario_id);
      if (!ownerExists) {
        return {
          totalBusinesses: 0,
          negocios_activos: 0,
          total_tiendas: 0,
          tiendas_activas: 0,
          totalEmployees: 0,
          empleados_activos: 0,
          totalAppointments: 0,
          citas_completadas: 0,
          totalRevenue: 0,
        };
      }

      const query = `
        SELECT 
          COUNT(DISTINCT n.negocio_id) as totalBusinesses,
          COUNT(DISTINCT CASE WHEN n.negocio_estado = 1 THEN n.negocio_id END) as negocios_activos,
          COUNT(DISTINCT t.tienda_id) as total_tiendas,
          COUNT(DISTINCT CASE WHEN t.tienda_estado = 1 THEN t.tienda_id END) as tiendas_activas,
          COUNT(DISTINCT e.empleado_id) as totalEmployees,
          COUNT(DISTINCT CASE WHEN e.empleado_estado = 1 THEN e.empleado_id END) as empleados_activos,
          COUNT(DISTINCT c.cita_id) as totalAppointments,
          COUNT(DISTINCT CASE WHEN c.cita_estado = 'completada' THEN c.cita_id END) as citas_completadas,
          COALESCE(SUM(CASE WHEN c.cita_estado = 'completada' THEN s.servicio_precio ELSE 0 END), 0) as totalRevenue
        FROM propietarios p
        LEFT JOIN negocios n ON p.propietario_id = n.propietario_id
        LEFT JOIN tiendas t ON n.negocio_id = t.negocio_id
        LEFT JOIN empleados e ON t.tienda_id = e.tienda_id
        LEFT JOIN franjas_horarias f ON e.empleado_id = f.empleado_id
        LEFT JOIN citas c ON f.franja_id = c.franja_id
        LEFT JOIN servicios s ON c.servicio_id = s.servicio_id
        WHERE p.propietario_id = ?
        GROUP BY p.propietario_id
      `;

      const result = await executeQuery(query, [propietario_id]);

      if (!result.success) {
        throw new Error(
          `Error al obtener estadísticas del propietario: ${result.error}`
        );
      }

      return (
        result.data[0] || {
          totalBusinesses: 0,
          negocios_activos: 0,
          total_tiendas: 0,
          tiendas_activas: 0,
          totalEmployees: 0,
          empleados_activos: 0,
          totalAppointments: 0,
          citas_completadas: 0,
          totalRevenue: 0,
        }
      );
    } catch (error) {
      console.error("Error en getOwnerStats:", error);
      throw error;
    }
  }

  // Contar propietarios por estado
  static async countOwnersByState(estado = this.STATES.ACTIVE) {
    const query =
      "SELECT COUNT(*) as total FROM propietarios WHERE propietario_estado = ?";
    const result = await executeQuery(query, [estado]);

    if (!result.success) {
      throw new Error(`Error al contar propietarios: ${result.error}`);
    }

    return result.data[0]?.total || 0;
  }

  // Buscar propietarios por criterios múltiples
  static async searchOwners(searchTerm) {
    const query = `
      SELECT 
        p.*,
        u.usuario_nombre, u.usuario_apellido, u.usuario_correo, u.usuario_telefono,
        COUNT(n.negocio_id) as total_negocios
      FROM propietarios p
      LEFT JOIN usuarios u ON p.usuario_id = u.usuario_id
      LEFT JOIN negocios n ON p.propietario_id = n.propietario_id
      WHERE p.propietario_estado = 1
      AND (
        u.usuario_nombre LIKE ? 
        OR u.usuario_apellido LIKE ? 
        OR u.usuario_correo LIKE ?
        OR CONCAT(u.usuario_nombre, ' ', u.usuario_apellido) LIKE ?
      )
      GROUP BY p.propietario_id, u.usuario_id
      ORDER BY u.usuario_nombre ASC, u.usuario_apellido ASC
    `;

    const searchPattern = `%${searchTerm}%`;
    const params = [searchPattern, searchPattern, searchPattern, searchPattern];

    const result = await executeQuery(query, params);

    if (!result.success) {
      throw new Error(`Error al buscar propietarios: ${result.error}`);
    }

    return result.data;
  }
}

export default Owner;
