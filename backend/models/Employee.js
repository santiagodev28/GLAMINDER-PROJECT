import { executeQuery, executeTransaction } from '../database/connectiondb.js';

class Employee {
  // Estados válidos para empleados
  static STATES = {
    ACTIVE: 1,
    INACTIVE: 0
  };

  // Obtener todos los empleados con información completa
  static async getAllEmployees(filters = {}) {
    let query = `
      SELECT 
        e.*,
        u.usuario_nombre, u.usuario_apellido, u.usuario_correo, u.usuario_telefono,
        t.tienda_nombre, t.tienda_direccion,
        n.negocio_nombre
      FROM empleados e
      LEFT JOIN usuarios u ON e.usuario_id = u.usuario_id
      LEFT JOIN tiendas t ON e.tienda_id = t.tienda_id
      LEFT JOIN negocios n ON t.negocio_id = n.negocio_id
    `;

    const params = [];
    const conditions = [];

    // Aplicar filtros
    if (filters.tienda_id) {
      conditions.push('e.tienda_id = ?');
      params.push(filters.tienda_id);
    }

    if (filters.negocio_id) {
      conditions.push('n.negocio_id = ?');
      params.push(filters.negocio_id);
    }

    if (filters.especialidad) {
      conditions.push('e.empleado_especialidad LIKE ?');
      params.push(`%${filters.especialidad}%`);
    }

    if (filters.estado !== undefined) {
      conditions.push('e.empleado_estado = ?');
      params.push(filters.estado);
    } else {
      // Por defecto, mostrar solo activos
      conditions.push('e.empleado_estado = ?');
      params.push(this.STATES.ACTIVE);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY u.usuario_nombre ASC, u.usuario_apellido ASC';

    const result = await executeQuery(query, params);
    
    if (!result.success) {
      throw new Error(`Error al obtener empleados: ${result.error}`);
    }

    return result.data;
  }

  // Obtener empleado por ID con información completa
  static async getEmployeeById(empleado_id) {
    const query = `
      SELECT 
        e.*,
        u.usuario_nombre, u.usuario_apellido, u.usuario_correo, u.usuario_telefono, u.usuario_estado,
        t.tienda_nombre, t.tienda_direccion, t.tienda_telefono,
        n.negocio_nombre, n.negocio_id
      FROM empleados e
      LEFT JOIN usuarios u ON e.usuario_id = u.usuario_id
      LEFT JOIN tiendas t ON e.tienda_id = t.tienda_id
      LEFT JOIN negocios n ON t.negocio_id = n.negocio_id
      WHERE e.empleado_id = ?
    `;

    const result = await executeQuery(query, [empleado_id]);
    
    if (!result.success) {
      throw new Error(`Error al obtener empleado: ${result.error}`);
    }

    return result.data[0] || null;
  }

  // Obtener empleado por usuario_id
  static async getEmployeeByUserId(usuario_id) {
    const query = `
      SELECT 
        e.*,
        u.usuario_nombre, u.usuario_apellido, u.usuario_correo, u.usuario_telefono,
        t.tienda_nombre, t.tienda_direccion,
        n.negocio_nombre, n.negocio_id
      FROM empleados e
      LEFT JOIN usuarios u ON e.usuario_id = u.usuario_id
      LEFT JOIN tiendas t ON e.tienda_id = t.tienda_id
      LEFT JOIN negocios n ON t.negocio_id = n.negocio_id
      WHERE e.usuario_id = ?
    `;

    const result = await executeQuery(query, [usuario_id]);
    
    if (!result.success) {
      throw new Error(`Error al obtener empleado por usuario: ${result.error}`);
    }

    return result.data[0] || null;
  }

  // Crear nuevo empleado
  static async createEmployee(employeeData) {
    const { usuario_id, tienda_id, empleado_especialidad, salario, fecha_contratacion } = employeeData;

    // Validaciones
    if (!usuario_id || !tienda_id || !empleado_especialidad) {
      throw new Error('Los campos usuario_id, tienda_id y empleado_especialidad son obligatorios');
    }

    try {
      // Verificar que el usuario no sea ya empleado
      const existingEmployee = await this.getEmployeeByUserId(usuario_id);
      if (existingEmployee) {
        throw new Error('Este usuario ya está registrado como empleado');
      }

      // Verificar que la tienda existe
      const storeQuery = 'SELECT tienda_id FROM tiendas WHERE tienda_id = ? AND tienda_estado = 1';
      const storeResult = await executeQuery(storeQuery, [tienda_id]);
      
      if (!storeResult.success || storeResult.data.length === 0) {
        throw new Error('La tienda especificada no existe o está inactiva');
      }

      // Crear el empleado
      const query = `
        INSERT INTO empleados 
        (usuario_id, tienda_id, empleado_especialidad, empleado_salario, fecha_contratacion, empleado_estado) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      const params = [
        usuario_id,
        tienda_id,
        empleado_especialidad,
        salario || null,
        fecha_contratacion || new Date().toISOString().split('T')[0],
        this.STATES.ACTIVE
      ];

      const result = await executeQuery(query, params);
      
      if (!result.success) {
        throw new Error(`Error al crear empleado: ${result.error}`);
      }

      return {
        success: true,
        empleado_id: result.data.insertId,
        message: 'Empleado creado exitosamente',
        data: await this.getEmployeeById(result.data.insertId)
      };

    } catch (error) {
      throw new Error(`Error al crear empleado: ${error.message}`);
    }
  }

  // Actualizar empleado
  static async updateEmployee(empleado_id, updateData) {
    const { usuario_id, tienda_id, empleado_especialidad, empleado_salario, fecha_contratacion } = updateData;

    // Verificar que el empleado existe
    const existingEmployee = await this.getEmployeeById(empleado_id);
    if (!existingEmployee) {
      throw new Error('Empleado no encontrado');
    }

    // Si se cambia el usuario, verificar que no sea ya empleado
    if (usuario_id && usuario_id !== existingEmployee.usuario_id) {
      const duplicateEmployee = await this.getEmployeeByUserId(usuario_id);
      if (duplicateEmployee) {
        throw new Error('Este usuario ya está registrado como empleado');
      }
    }

    // Si se cambia la tienda, verificar que existe
    if (tienda_id && tienda_id !== existingEmployee.tienda_id) {
      const storeQuery = 'SELECT tienda_id FROM tiendas WHERE tienda_id = ? AND tienda_estado = 1';
      const storeResult = await executeQuery(storeQuery, [tienda_id]);
      
      if (!storeResult.success || storeResult.data.length === 0) {
        throw new Error('La tienda especificada no existe o está inactiva');
      }
    }

    const query = `
      UPDATE empleados 
      SET usuario_id = COALESCE(?, usuario_id),
          tienda_id = COALESCE(?, tienda_id),
          empleado_especialidad = COALESCE(?, empleado_especialidad),
          empleado_salario = COALESCE(?, empleado_salario),
          fecha_contratacion = COALESCE(?, fecha_contratacion)
      WHERE empleado_id = ?
    `;

    const params = [usuario_id, tienda_id, empleado_especialidad, empleado_salario, fecha_contratacion, empleado_id];
    const result = await executeQuery(query, params);
    
    if (!result.success) {
      throw new Error(`Error al actualizar empleado: ${result.error}`);
    }

    if (result.data.affectedRows === 0) {
      throw new Error('Empleado no encontrado');
    }

    return {
      success: true,
      message: 'Empleado actualizado exitosamente',
      affectedRows: result.data.affectedRows,
      data: await this.getEmployeeById(empleado_id)
    };
  }

  // Cambiar estado del empleado
  static async changeEmployeeState(empleado_id, nuevo_estado) {
    // Validar estado
    if (!Object.values(this.STATES).includes(nuevo_estado)) {
      throw new Error(`Estado inválido: ${nuevo_estado}`);
    }

    const query = 'UPDATE empleados SET empleado_estado = ? WHERE empleado_id = ?';
    const result = await executeQuery(query, [nuevo_estado, empleado_id]);
    
    if (!result.success) {
      throw new Error(`Error al cambiar estado del empleado: ${result.error}`);
    }

    if (result.data.affectedRows === 0) {
      throw new Error('Empleado no encontrado');
    }

    const estadoTexto = nuevo_estado === this.STATES.ACTIVE ? 'activado' : 'desactivado';
    return {
      success: true,
      message: `Empleado ${estadoTexto} exitosamente`,
      affectedRows: result.data.affectedRows
    };
  }

  // Desactivar empleado (soft delete)
  static async deleteEmployee(empleado_id) {
    // Verificar si tiene citas pendientes
    const hasPendingAppointments = await this.hasPendingAppointments(empleado_id);
    if (hasPendingAppointments) {
      throw new Error('No se puede desactivar un empleado con citas pendientes o confirmadas');
    }

    return await this.changeEmployeeState(empleado_id, this.STATES.INACTIVE);
  }

  // Reactivar empleado
  static async reactivateEmployee(empleado_id) {
    return await this.changeEmployeeState(empleado_id, this.STATES.ACTIVE);
  }

  // Verificar si el empleado tiene citas pendientes
  static async hasPendingAppointments(empleado_id) {
    const query = `
      SELECT COUNT(*) as count 
      FROM citas 
      WHERE empleado_id = ? 
      AND cita_estado IN ('pendiente', 'confirmada')
      AND cita_fecha >= CURDATE()
    `;

    const result = await executeQuery(query, [empleado_id]);
    
    if (!result.success) {
      throw new Error(`Error al verificar citas pendientes: ${result.error}`);
    }

    return result.data[0]?.count > 0;
  }

  // Obtener empleados por tienda
  static async getEmployeesByStore(tienda_id) {
    return await this.getAllEmployees({ tienda_id });
  }

  // Obtener empleados por especialidad
  static async getEmployeesBySpecialty(especialidad) {
    return await this.getAllEmployees({ especialidad });
  }

  // Obtener empleados disponibles para una fecha y horario específicos
  static async getAvailableEmployees(tienda_id, fecha, horario_id) {
    const query = `
      SELECT 
        e.*,
        u.usuario_nombre, u.usuario_apellido
      FROM empleados e
      JOIN usuarios u ON e.usuario_id = u.usuario_id
      WHERE e.tienda_id = ? 
      AND e.empleado_estado = ?
      AND e.empleado_id NOT IN (
        SELECT c.empleado_id 
        FROM citas c 
        WHERE DATE(c.cita_fecha) = ? 
        AND c.horario_id = ?
        AND c.cita_estado NOT IN ('cancelada', 'completada')
      )
      ORDER BY u.usuario_nombre ASC
    `;

    const result = await executeQuery(query, [tienda_id, this.STATES.ACTIVE, fecha, horario_id]);
    
    if (!result.success) {
      throw new Error(`Error al obtener empleados disponibles: ${result.error}`);
    }

    return result.data;
  }

  // Obtener estadísticas del empleado
  static async getEmployeeStats(empleado_id, fecha_inicio = null, fecha_fin = null) {
    let query = `
      SELECT 
        COUNT(*) as total_citas,
        COUNT(CASE WHEN cita_estado = 'completada' THEN 1 END) as citas_completadas,
        COUNT(CASE WHEN cita_estado = 'cancelada' THEN 1 END) as citas_canceladas,
        AVG(CASE WHEN cita_estado = 'completada' THEN s.servicio_precio END) as ingreso_promedio
      FROM citas c
      LEFT JOIN servicios s ON c.servicio_id = s.servicio_id
      WHERE c.empleado_id = ?
    `;

    const params = [empleado_id];

    if (fecha_inicio && fecha_fin) {
      query += ' AND c.cita_fecha BETWEEN ? AND ?';
      params.push(fecha_inicio, fecha_fin);
    }

    const result = await executeQuery(query, params);
    
    if (!result.success) {
      throw new Error(`Error al obtener estadísticas del empleado: ${result.error}`);
    }

    return result.data[0];
  }

  // Contar empleados por estado
  static async countEmployeesByState(estado = this.STATES.ACTIVE, tienda_id = null) {
    let query = 'SELECT COUNT(*) as total FROM empleados WHERE empleado_estado = ?';
    const params = [estado];

    if (tienda_id) {
      query += ' AND tienda_id = ?';
      params.push(tienda_id);
    }

    const result = await executeQuery(query, params);
    
    if (!result.success) {
      throw new Error(`Error al contar empleados: ${result.error}`);
    }

    return result.data[0]?.total || 0;
  }

  // Obtener especialidades únicas
  static async getUniqueSpecialties() {
    const query = `
      SELECT DISTINCT empleado_especialidad 
      FROM empleados 
      WHERE empleado_estado = ? 
      AND empleado_especialidad IS NOT NULL
      ORDER BY empleado_especialidad ASC
    `;

    const result = await executeQuery(query, [this.STATES.ACTIVE]);
    
    if (!result.success) {
      throw new Error(`Error al obtener especialidades: ${result.error}`);
    }

    return result.data.map(row => row.empleado_especialidad);
  }
}

export default Employee;