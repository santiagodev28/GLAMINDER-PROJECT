import api from "../api/api";

class EmployeeService {
  // ===== GESTIÓN DE EMPLEADO =====

  // Obtener información del empleado por usuario_id
  static async getEmployeeByUserId(userId) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/empleados/usuario/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener empleado:", error);
      throw error;
    }
  }

  // Obtener información del empleado desde localStorage
  static async getEmployeeFromStorage() {
    try {
      const usuario = JSON.parse(localStorage.getItem("usuario"));
      if (!usuario || !usuario.usuario_id) {
        throw new Error("No hay información de usuario en localStorage");
      }
      return await this.getEmployeeByUserId(usuario.usuario_id);
    } catch (error) {
      console.error("Error al obtener empleado desde localStorage:", error);
      throw error;
    }
  }

  // Obtener información completa del empleado (con negocio y tienda)
  static async getEmployeeInfo(employeeId) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/empleados/${employeeId}/info`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener información del empleado:", error);
      throw error;
    }
  }

  // Obtener estadísticas del empleado
  static async getEmployeeStats(employeeId) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/empleados/${employeeId}/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener estadísticas del empleado:", error);
      throw error;
    }
  }

  // ===== GESTIÓN DE CITAS =====

  // Obtener citas del empleado
  static async getEmployeeAppointments(employeeId, filters = {}) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/citas/empleado/${employeeId}`, {
        params: filters,
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener citas del empleado:", error);
      throw error;
    }
  }

  // Obtener citas de hoy del empleado
  static async getTodayAppointments(employeeId) {
    try {
      const token = localStorage.getItem("token");
      const today = new Date().toISOString().split("T")[0];
      const response = await api.get(`/citas/empleado/${employeeId}`, {
        params: { fecha: today },
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener citas de hoy:", error);
      throw error;
    }
  }

  // Confirmar cita
  static async confirmAppointment(appointmentId) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.put(
        `/citas/${appointmentId}/confirmar`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error al confirmar cita:", error);
      throw error;
    }
  }

  // Completar cita
  static async completeAppointment(appointmentId) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.put(
        `/citas/${appointmentId}/completar`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error al completar cita:", error);
      throw error;
    }
  }

  // ===== GESTIÓN DE SERVICIOS =====

  // Obtener servicios que ofrece el empleado
  static async getEmployeeServices(employeeId) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/empleados/${employeeId}/servicios`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener servicios del empleado:", error);
      throw error;
    }
  }

  // ===== GESTIÓN DE HORARIOS =====

  // Obtener horarios del empleado
  static async getEmployeeSchedules(employeeId) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/horarios/empleado/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener horarios del empleado:", error);
      throw error;
    }
  }

  // Obtener horarios disponibles para una fecha específica
  static async getAvailableSchedules(employeeId, date) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(
        `/horarios/empleado/${employeeId}/${date}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener horarios disponibles:", error);
      throw error;
    }
  }
}

export default EmployeeService;
