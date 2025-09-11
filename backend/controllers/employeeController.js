import Employee from "../models/Employee.js";

// Controlador para los empleados

class EmployeeController {
  static async getAllEmployees(req, res) {
    try {
      const filters = req.query;
      const employees = await Employee.getAllEmployees(filters);
      res.json(employees);
    } catch (error) {
      console.error("Error al obtener empleados:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async getEmployeeById(req, res) {
    try {
      const { empleado_id } = req.params;
      const employee = await Employee.getEmployeeById(empleado_id);
      if (!employee) {
        return res.status(404).json({ error: "Empleado no encontrado" });
      }
      res.json(employee);
    } catch (error) {
      console.error("Error al obtener el empleado:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async getEmployeeByUserId(req, res) {
    try {
      const { usuario_id } = req.params;
      const employee = await Employee.getEmployeeByUserId(usuario_id);
      if (!employee) {
        return res.status(404).json({ error: "Empleado no encontrado" });
      }
      res.json(employee);
    } catch (error) {
      console.error("Error al obtener empleado por usuario:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async createEmployee(req, res) {
    try {
      const employeeData = req.body;
      const newEmployee = await Employee.createEmployee(employeeData);
      res.status(201).json(newEmployee);
    } catch (error) {
      if (error.message.includes("obligatorios")) {
        return res.status(400).json({ error: error.message });
      }
      if (error.message.includes("registrado como empleado")) {
        return res.status(400).json({ error: error.message });
      }
      if (error.message.includes("no existe o está inactiva")) {
        return res.status(400).json({ error: error.message });
      }
      console.error("Error al crear el empleado:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async createCompleteEmployee(req, res) {
    try {
      const employeeData = req.body;
      const newEmployee = await Employee.createCompleteEmployee(employeeData);
      res.status(201).json(newEmployee);
    } catch (error) {
      if (error.message.includes("obligatorios")) {
        return res.status(400).json({ error: error.message });
      }
      if (error.message.includes("ya está registrado")) {
        return res.status(400).json({ error: error.message });
      }
      if (error.message.includes("no existe o está inactiva")) {
        return res.status(400).json({ error: error.message });
      }
      console.error("Error al crear el empleado completo:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async updateEmployee(req, res) {
    try {
      const { empleado_id } = req.params;
      const updateData = req.body;
      const updatedEmployee = await Employee.updateEmployee(
        empleado_id,
        updateData
      );
      res.json(updatedEmployee);
    } catch (error) {
      if (error.message === "Empleado no encontrado") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes("registrado como empleado")) {
        return res.status(400).json({ error: error.message });
      }
      if (error.message.includes("no existe o está inactiva")) {
        return res.status(400).json({ error: error.message });
      }
      console.error("Error al actualizar el empleado:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async changeEmployeeState(req, res) {
    try {
      const { empleado_id } = req.params;
      const { nuevo_estado } = req.body;
      const result = await Employee.changeEmployeeState(
        empleado_id,
        nuevo_estado
      );
      res.json(result);
    } catch (error) {
      if (error.message === "Empleado no encontrado") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes("Estado inválido")) {
        return res.status(400).json({ error: error.message });
      }
      console.error("Error al cambiar estado del empleado:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteEmployee(req, res) {
    try {
      const { empleado_id } = req.params;
      const deletedEmployee = await Employee.deleteEmployee(empleado_id);
      res.json(deletedEmployee);
    } catch (error) {
      if (error.message.includes("citas pendientes")) {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === "Empleado no encontrado") {
        return res.status(404).json({ error: error.message });
      }
      console.error("Error al eliminar el empleado:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async reactivateEmployee(req, res) {
    try {
      const { empleado_id } = req.params;
      const reactivatedEmployee = await Employee.reactivateEmployee(
        empleado_id
      );
      res.json(reactivatedEmployee);
    } catch (error) {
      if (error.message === "Empleado no encontrado") {
        return res.status(404).json({ error: error.message });
      }
      console.error("Error al reactivar el empleado:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async getEmployeesByStore(req, res) {
    try {
      const { tienda_id } = req.params;
      const employees = await Employee.getEmployeesByStore(tienda_id);
      res.json(employees);
    } catch (error) {
      console.error("Error al obtener empleados por tienda:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async getEmployeesBySpecialty(req, res) {
    try {
      const { especialidad } = req.query;
      const employees = await Employee.getEmployeesBySpecialty(especialidad);
      res.json(employees);
    } catch (error) {
      console.error(
        "Error al obtener empleados por especialidad:",
        error.message
      );
      res.status(500).json({ error: error.message });
    }
  }

  static async getAvailableEmployees(req, res) {
    try {
      const { tienda_id } = req.params;
      const { fecha, horario_id } = req.query;
      const employees = await Employee.getAvailableEmployees(
        tienda_id,
        fecha,
        horario_id
      );
      res.json(employees);
    } catch (error) {
      console.error("Error al obtener empleados disponibles:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async getEmployeeStats(req, res) {
    try {
      const { empleado_id } = req.params;
      const { fecha_inicio, fecha_fin } = req.query;
      const stats = await Employee.getEmployeeStats(
        empleado_id,
        fecha_inicio,
        fecha_fin
      );
      res.json(stats);
    } catch (error) {
      console.error(
        "Error al obtener estadísticas del empleado:",
        error.message
      );
      res.status(500).json({ error: error.message });
    }
  }

  static async countEmployeesByState(req, res) {
    try {
      const { estado, tienda_id } = req.query;
      const total = await Employee.countEmployeesByState(estado, tienda_id);
      res.json({ total });
    } catch (error) {
      console.error("Error al contar empleados:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async getUniqueSpecialties(req, res) {
    try {
      const specialties = await Employee.getUniqueSpecialties();
      res.json(specialties);
    } catch (error) {
      console.error("Error al obtener especialidades:", error.message);
      res.status(500).json({ error: error.message });
    }
  }
}

export default EmployeeController;
