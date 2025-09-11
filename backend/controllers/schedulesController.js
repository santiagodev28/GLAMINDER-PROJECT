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

  // Obtener horarios de un empleado específico
  static async getEmployeeSchedules(req, res) {
    try {
      const { empleado_id } = req.params;

      if (!empleado_id) {
        return res.status(400).json({ error: "ID de empleado es requerido" });
      }

      const schedules = await Schedule.getEmployeeSchedules(empleado_id);
      res.json(schedules);
    } catch (error) {
      console.error("Error al obtener horarios del empleado:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Obtener horarios de una tienda específica
  static async getStoreSchedules(req, res) {
    try {
      const { tienda_id } = req.params;

      if (!tienda_id) {
        return res.status(400).json({ error: "ID de tienda es requerido" });
      }

      const schedules = await Schedule.getStoreSchedules(tienda_id);
      res.json(schedules);
    } catch (error) {
      console.error("Error al obtener horarios de la tienda:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Obtener horarios por propietario (todos los empleados de sus tiendas)
  static async getSchedulesByOwner(req, res) {
    try {
      const { propietario_id } = req.params;

      if (!propietario_id) {
        return res
          .status(400)
          .json({ error: "ID de propietario es requerido" });
      }

      const schedules = await Schedule.getSchedulesByOwner(propietario_id);
      res.json(schedules);
    } catch (error) {
      console.error("Error al obtener horarios del propietario:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default SchedulesController;
