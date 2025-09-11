import Appointment from "../models/Appointment.js";

class AppointmentsController {
  static async getAllAppointments(req, res) {
    try {
      const filters = req.query;
      const appointments = await Appointment.getAllAppointments(filters);
      res.json(appointments);
    } catch (error) {
      console.error("Error al obtener citas:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async getAppointmentsByOwner(req, res) {
    try {
      const { propietario_id } = req.params;
      const filters = req.query;
      const appointments = await Appointment.getAppointmentsByOwner(
        propietario_id,
        filters
      );
      res.json(appointments);
    } catch (error) {
      console.error("Error al obtener citas del propietario:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async getAppointmentById(req, res) {
    try {
      const { cita_id } = req.params;
      const appointment = await Appointment.getAppointmentById(cita_id);
      if (!appointment) {
        return res.status(404).json({ error: "Cita no encontrada" });
      }
      res.json(appointment);
    } catch (error) {
      console.error("Error al obtener cita:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async createAppointment(req, res) {
    try {
      console.log("🔍 createAppointment llamado con datos:", req.body);
      console.log("👤 Usuario del token:", req.user);
      console.log("🔐 Headers de autorización:", req.headers.authorization);

      const appointmentData = req.body;
      const result = await Appointment.createAppointment(appointmentData);
      console.log("✅ Cita creada exitosamente:", result);
      res.status(201).json(result);
    } catch (error) {
      console.error("❌ Error al crear cita:", error.message);
      res.status(400).json({ error: error.message });
    }
  }

  static async updateAppointment(req, res) {
    try {
      const { cita_id } = req.params;
      const updateData = req.body;
      const result = await Appointment.updateAppointment(cita_id, updateData);
      res.json(result);
    } catch (error) {
      if (error.message === "Cita no encontrada") {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }

  static async changeStateAppointment(req, res) {
    try {
      const { cita_id } = req.params;
      const { nuevo_estado } = req.body;
      const result = await Appointment.changeStateAppointment(
        cita_id,
        nuevo_estado
      );
      res.json(result);
    } catch (error) {
      if (error.message.includes("Cita no encontrada")) {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }

  static async cancelAppointment(req, res) {
    try {
      const { cita_id } = req.params;
      const { motivo } = req.body;
      const result = await Appointment.cancelAppointment(cita_id, motivo);
      res.json(result);
    } catch (error) {
      if (error.message === "Cita no encontrada") {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }

  static async confirmAppointment(req, res) {
    try {
      const { cita_id } = req.params;
      const result = await Appointment.confirmAppointment(cita_id);
      res.json(result);
    } catch (error) {
      if (error.message === "Cita no encontrada") {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }

  static async completeAppointment(req, res) {
    try {
      const { cita_id } = req.params;
      const { observaciones } = req.body;
      const result = await Appointment.completeAppointment(
        cita_id,
        observaciones
      );
      res.json(result);
    } catch (error) {
      if (error.message === "Cita no encontrada") {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteAppointment(req, res) {
    try {
      const { cita_id } = req.params;
      const result = await Appointment.deleteAppointment(cita_id);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAppointmentsByUser(req, res) {
    try {
      const { usuario_id } = req.params;
      const { estado } = req.query;
      const appointments = await Appointment.getAppointmentsByUser(
        usuario_id,
        estado
      );
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getMyAppointments(req, res) {
    try {
      console.log("🔍 getMyAppointments llamado");
      console.log("👤 Usuario del token:", req.user);

      // Obtener el usuario_id del token JWT
      const usuario_id = req.user.usuario_id;
      const { estado } = req.query;

      console.log("📊 Parámetros de búsqueda:", { usuario_id, estado });

      const appointments = await Appointment.getAppointmentsByUser(
        usuario_id,
        estado
      );

      console.log("📅 Citas encontradas:", appointments.length);
      console.log("📅 Datos de citas:", appointments);

      res.json(appointments);
    } catch (error) {
      console.error("❌ Error en getMyAppointments:", error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getAppointmentsByEmployee(req, res) {
    try {
      const { empleado_id } = req.params;
      const { fecha } = req.query;
      const appointments = await Appointment.getAppointmentsByEmployee(
        empleado_id,
        fecha
      );
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAvailableTimeSlots(req, res) {
    try {
      const { empleado_id } = req.params;
      const { fecha } = req.query;
      const slots = await Appointment.getAvailableTimeSlots(empleado_id, fecha);
      res.json(slots);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAppointmentStats(req, res) {
    try {
      console.log("🔍 Endpoint /api/citas/stats llamado");
      const filters = req.query;
      const stats = await Appointment.getAppointmentStats(filters);
      console.log("🔍 Estadísticas de citas obtenidas:", stats);
      res.json(stats);
    } catch (error) {
      console.error("Error al obtener estadísticas de citas:", error.message);
      res.status(500).json({ error: error.message });
    }
  }
}

export default AppointmentsController;
