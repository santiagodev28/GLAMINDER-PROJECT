import Schedule from "../models/Schedule.js";

class SchedulesController {
  static async getAllSchedules(req, res) {
    try {
      const schedules = await Schedule.getAllSchedules();
      res.status(200).json(schedules);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener los horarios" });
    }
  }

  static async getScheduleById(req, res) {
    try {
      const { schedule_id } = req.params;
      const schedule = await Schedule.getScheduleById(schedule_id);
      res.status(200).json(schedule);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener el horario" });
    }
  }

  static async createSchedule(req, res) {
    try {
      const schedule = req.body;
      const newSchedule = await Schedule.createSchedule(schedule);
      res.status(201).json(newSchedule);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al crear el horario" });
    }
  }

  static async updateSchedule(req, res) {
    try {
      const { schedule_id } = req.params;
      const schedule = req.body;
      const updatedSchedule = await Schedule.updateSchedule(
        schedule_id,
        schedule
      );
      res.status(200).json(updatedSchedule);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al actualizar el horario" });
    }
  }

  static async deleteSchedule(req, res) {
    try {
      const { schedule_id } = req.params;
      const deletedSchedule = await Schedule.deleteSchedule(schedule_id);
      res.status(200).json(deletedSchedule);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al eliminar el horario" });
    }
  }

  // Obtener horarios disponibles por empleado y fecha
  static async getAvailableSchedules(req, res) {
    try {
      const { empleado_id, fecha } = req.params;
      const { duracion_servicio } = req.query;

      console.log("🔍 getAvailableSchedules llamado con:", {
        empleado_id,
        fecha,
        duracion_servicio,
      });

      // Validar que la fecha sea válida
      if (!fecha || !Date.parse(fecha)) {
        console.log("❌ Fecha inválida:", fecha);
        return res.status(400).json({ error: "Fecha inválida" });
      }

      // Validar duración del servicio
      const duracion = duracion_servicio ? parseInt(duracion_servicio) : 30;
      if (isNaN(duracion) || duracion <= 0) {
        console.log("❌ Duración inválida:", duracion_servicio);
        return res
          .status(400)
          .json({ error: "Duración del servicio inválida" });
      }

      console.log("✅ Fecha válida, obteniendo horarios...");

      // Primero probar la conexión a la BD
      try {
        await Schedule.testConnection();
      } catch (error) {
        console.error("❌ Error en conexión a BD:", error);
        return res
          .status(500)
          .json({ error: "Error de conexión a la base de datos" });
      }

      const schedules = await Schedule.getAvailableSchedulesByEmployee(
        empleado_id,
        fecha,
        duracion
      );

      console.log("📅 Horarios obtenidos:", schedules.length);
      res.status(200).json(schedules);
    } catch (error) {
      console.error("❌ Error obteniendo horarios disponibles:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default SchedulesController;
