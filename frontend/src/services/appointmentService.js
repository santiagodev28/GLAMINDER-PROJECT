import api from "../api/api.js";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const appointmentService = {
  // Crear nueva cita
  createAppointment: async (appointmentData) => {
    try {
      const res = await api.post("/citas", appointmentData, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      console.error("Error al crear cita:", error);
      throw error;
    }
  },

  // Obtener citas del usuario actual
  getUserAppointments: async () => {
    try {
      const res = await api.get("/citas/usuario/mis-citas", {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      console.error("Error al obtener citas del usuario:", error);
      throw error;
    }
  },

  // Obtener servicios disponibles por tienda
  getServicesByStore: async (tienda_id) => {
    try {
      console.log("Intentando obtener servicios para tienda:", tienda_id);
      console.log("Headers enviados:", getAuthHeaders());

      const res = await api.get(`/servicios/tienda/${tienda_id}`, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      console.error("Error al obtener servicios:", error);
      console.error("Status:", error.response?.status);
      console.error("Data:", error.response?.data);
      console.error("Headers:", error.response?.headers);
      throw error;
    }
  },

  // Obtener empleados disponibles por tienda
  getEmployeesByStore: async (tienda_id) => {
    try {
      console.log("Intentando obtener empleados para tienda:", tienda_id);
      console.log("Headers enviados:", getAuthHeaders());

      const res = await api.get(`/empleados/tienda/${tienda_id}`, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      console.error("Error al obtener empleados:", error);
      console.error("Status:", error.response?.status);
      console.error("Data:", error.response?.data);
      console.error("Headers:", error.response?.headers);
      throw error;
    }
  },

  // Obtener horarios disponibles por empleado y fecha (usando el nuevo sistema de franjas)
  getAvailableSchedules: async (empleado_id, fecha, duracion_servicio = 30) => {
    try {
      console.log(
        "Intentando obtener horarios para empleado:",
        empleado_id,
        "fecha:",
        fecha,
        "duracion:",
        duracion_servicio
      );
      console.log(
        "URL:",
        `/horarios/empleado/${empleado_id}/${fecha}?duracion_servicio=${duracion_servicio}`
      );
      console.log("Headers enviados:", getAuthHeaders());

      const res = await api.get(`/horarios/empleado/${empleado_id}/${fecha}`, {
        params: { duracion_servicio },
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      console.error("Error al obtener horarios:", error);
      console.error("Status:", error.response?.status);
      console.error("Data:", error.response?.data);
      console.error("URL intentada:", error.config?.url);
      throw error;
    }
  },

  // Obtener franjas horarias disponibles por empleado y fecha (nuevo endpoint)
  getAvailableFranjas: async (empleado_id, fecha) => {
    try {
      console.log(
        "Intentando obtener franjas para empleado:",
        empleado_id,
        "fecha:",
        fecha
      );
      console.log("URL:", `/franjas/empleado/${empleado_id}/${fecha}`);
      console.log("Headers enviados:", getAuthHeaders());

      const res = await api.get(`/franjas/empleado/${empleado_id}/${fecha}`, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      console.error("Error al obtener franjas:", error);
      console.error("Status:", error.response?.status);
      console.error("Data:", error.response?.data);
      console.error("URL intentada:", error.config?.url);
      throw error;
    }
  },

  // Verificar disponibilidad de horario
  checkTimeSlotAvailability: async (empleado_id, fecha, horario_id) => {
    try {
      const res = await api.get(`/citas/verificar-disponibilidad`, {
        params: { empleado_id, fecha, horario_id },
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      console.error("Error al verificar disponibilidad:", error);
      throw error;
    }
  },

  // Cancelar cita
  cancelAppointment: async (cita_id) => {
    try {
      const res = await api.put(
        `/citas/${cita_id}/cancelar`,
        {},
        {
          headers: getAuthHeaders(),
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error al cancelar cita:", error);
      throw error;
    }
  },

  // Obtener cita por ID
  getAppointmentById: async (cita_id) => {
    try {
      const res = await api.get(`/citas/${cita_id}`, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      console.error("Error al obtener cita:", error);
      throw error;
    }
  },

  // Generar franjas horarias para un rango de fechas (solo administradores)
  generateFranjasForDateRange: async (empleado_id, fecha_inicio, fecha_fin) => {
    try {
      console.log(
        "Generando franjas para empleado:",
        empleado_id,
        "desde:",
        fecha_inicio,
        "hasta:",
        fecha_fin
      );

      const res = await api.post(
        `/franjas/generar/${empleado_id}`,
        {
          fecha_inicio,
          fecha_fin,
        },
        {
          headers: getAuthHeaders(),
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error al generar franjas:", error);
      throw error;
    }
  },

  // Obtener slots de tiempo para una franja específica
  getTimeSlotsForFranja: async (franja_id, duracion_minutos = 30) => {
    try {
      const res = await api.get(`/franjas/${franja_id}/slots`, {
        params: { duracion_minutos },
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      console.error("Error al obtener slots de tiempo:", error);
      throw error;
    }
  },

  // Obtener estadísticas de franjas horarias
  getFranjaStats: async (filters = {}) => {
    try {
      const res = await api.get("/franjas/stats", {
        params: filters,
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      console.error("Error al obtener estadísticas de franjas:", error);
      throw error;
    }
  },
};

export default appointmentService;
