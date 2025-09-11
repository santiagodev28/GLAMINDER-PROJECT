import api from "../api/api";

class OwnerService {
  // ===== GESTIÓN DE PROPIETARIO =====

  // Obtener información del propietario por usuario_id
  static async getOwnerByUserId(userId) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/propietarios/usuario/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener propietario:", error);
      throw error;
    }
  }

  // Obtener estadísticas del propietario
  static async getOwnerStats(ownerId) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/propietarios/${ownerId}/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener estadísticas del propietario:", error);
      throw error;
    }
  }

  // ===== GESTIÓN DE NEGOCIOS =====

  // Obtener negocios del propietario
  static async getOwnerBusinesses(ownerId, includeInactive = false) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(
        `/propietarios/${ownerId}/negocios?includeInactive=${includeInactive}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener negocios del propietario:", error);
      throw error;
    }
  }

  // ===== GESTIÓN DE TIENDAS =====

  // Obtener tiendas por negocio
  static async getStoresByBusiness(businessId) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/negocios/${businessId}/tiendas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener tiendas del negocio:", error);
      throw error;
    }
  }

  // Crear nueva tienda
  static async createStore(storeData) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/tiendas", storeData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al crear tienda:", error);
      throw error;
    }
  }

  // Actualizar tienda
  static async updateStore(storeId, storeData) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.put(`/tiendas/${storeId}`, storeData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al actualizar tienda:", error);
      throw error;
    }
  }

  // Obtener estadísticas de una tienda
  static async getStoreStats(storeId) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/tiendas/${storeId}/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener estadísticas de la tienda:", error);
      throw error;
    }
  }

  // Obtener categorías de tienda
  static async getStoreCategories() {
    try {
      const response = await api.get("/tienda-categorias");
      return response.data;
    } catch (error) {
      console.error("Error al obtener categorías de tienda:", error);
      throw error;
    }
  }

  // Crear nuevo negocio
  static async createBusiness(businessData) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/negocios", businessData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al crear negocio:", error);
      throw error;
    }
  }

  // Actualizar negocio
  static async updateBusiness(businessId, businessData) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.put(`/negocios/${businessId}`, businessData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al actualizar negocio:", error);
      throw error;
    }
  }

  // Obtener estadísticas de un negocio
  static async getBusinessStats(businessId) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/negocios/${businessId}/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener estadísticas del negocio:", error);
      throw error;
    }
  }

  // ===== GESTIÓN DE EMPLEADOS =====

  // Obtener empleados por tienda
  static async getEmployeesByStore(storeId) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/empleados/tienda/${storeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener empleados:", error);
      throw error;
    }
  }

  // Crear nuevo empleado
  static async createEmployee(employeeData) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/empleados", employeeData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al crear empleado:", error);
      throw error;
    }
  }

  // Crear empleado completo (usuario + empleado)
  static async createCompleteEmployee(employeeData) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/empleados/completo", employeeData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al crear empleado completo:", error);
      throw error;
    }
  }

  // Actualizar empleado
  static async updateEmployee(employeeId, employeeData) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.put(`/empleados/${employeeId}`, employeeData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al actualizar empleado:", error);
      throw error;
    }
  }

  // Cambiar estado del empleado
  static async changeEmployeeState(employeeId, newState) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.put(
        `/empleados/${employeeId}/estado`,
        { nuevo_estado: newState },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error("Error al cambiar estado del empleado:", error);
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

  // Obtener citas por empleado
  static async getAppointmentsByEmployee(employeeId) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/citas/empleado/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener citas del empleado:", error);
      throw error;
    }
  }

  // Obtener todas las citas con filtros
  static async getAllAppointments(filters = {}) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/citas", {
        params: filters,
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener citas:", error);
      throw error;
    }
  }

  // Obtener citas por propietario (solo de sus negocios)
  static async getAppointmentsByOwner(propietario_id, filters = {}) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/citas/propietario/${propietario_id}`, {
        params: filters,
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener citas del propietario:", error);
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

  // Cancelar cita
  static async cancelAppointment(appointmentId, reason = "") {
    try {
      const token = localStorage.getItem("token");
      const response = await api.put(
        `/citas/${appointmentId}/cancelar`,
        { motivo: reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error("Error al cancelar cita:", error);
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

  // Obtener estadísticas de citas
  static async getAppointmentStats() {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/citas/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener estadísticas de citas:", error);
      throw error;
    }
  }

  // ===== GESTIÓN DE SERVICIOS =====

  // Obtener servicios por negocio
  static async getServicesByBusiness(businessId) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/servicios/negocio/${businessId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener servicios:", error);
      throw error;
    }
  }

  // Obtener servicios por propietario (solo de sus negocios)
  static async getServicesByOwner(propietario_id, filters = {}) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(
        `/servicios/propietario/${propietario_id}`,
        {
          params: filters,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener servicios del propietario:", error);
      throw error;
    }
  }

  // ===== GESTIÓN DE CATEGORÍAS DE SERVICIOS =====

  // Obtener todas las categorías de servicios
  static async getServiceCategories() {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/servicio-categorias", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener categorías de servicios:", error);
      throw error;
    }
  }

  // Obtener categorías disponibles para una tienda
  static async getServiceCategoriesByStore(tienda_id) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(
        `/servicio-categorias/tienda/${tienda_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener categorías de la tienda:", error);
      throw error;
    }
  }

  // Crear nuevo servicio
  static async createService(serviceData) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/servicios", serviceData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al crear servicio:", error);
      throw error;
    }
  }

  // Actualizar servicio
  static async updateService(serviceId, serviceData) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.put(`/servicios/${serviceId}`, serviceData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al actualizar servicio:", error);
      throw error;
    }
  }

  // ===== GESTIÓN DE TIENDAS =====

  // Obtener tiendas por negocio
  static async getStoresByBusiness(businessId) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/negocios/${businessId}/tiendas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener tiendas:", error);
      throw error;
    }
  }

  // ===== GESTIÓN DE HORARIOS =====

  // Obtener horarios disponibles para un empleado
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

  // Obtener franjas horarias
  static async getTimeSlots() {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/franjas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener franjas horarias:", error);
      throw error;
    }
  }

  // Horarios
  static async getSchedulesByOwner(propietario_id) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(
        `/horarios/propietario/${propietario_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener horarios:", error);
      throw error;
    }
  }

  static async getEmployeeSchedules(empleado_id) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/horarios/empleado/${empleado_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener horarios del empleado:", error);
      throw error;
    }
  }

  static async getStoreSchedules(tienda_id) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/horarios/tienda/${tienda_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener horarios de la tienda:", error);
      throw error;
    }
  }

  static async createSchedule(scheduleData) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/horarios", scheduleData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al crear horario:", error);
      throw error;
    }
  }

  static async updateSchedule(horario_id, scheduleData) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.put(`/horarios/${horario_id}`, scheduleData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al actualizar horario:", error);
      throw error;
    }
  }

  static async deleteSchedule(horario_id) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.delete(`/horarios/${horario_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al eliminar horario:", error);
      throw error;
    }
  }
}

export default OwnerService;
