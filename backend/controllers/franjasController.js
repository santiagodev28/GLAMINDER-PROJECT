import FranjaHoraria from "../models/FranjaHoraria.js";

class FranjasController {
  // Obtener todas las franjas horarias
  static async getAllFranjas(req, res) {
    try {
      const filters = req.query;
      const franjas = await FranjaHoraria.getAllFranjas(filters);
      res.status(200).json(franjas);
    } catch (error) {
      console.error("Error al obtener franjas horarias:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Obtener franja por ID
  static async getFranjaById(req, res) {
    try {
      const { franja_id } = req.params;
      const franja = await FranjaHoraria.getFranjaById(franja_id);

      if (!franja) {
        return res.status(404).json({ error: "Franja horaria no encontrada" });
      }

      res.status(200).json(franja);
    } catch (error) {
      console.error("Error al obtener franja horaria:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Crear nueva franja horaria
  static async createFranja(req, res) {
    try {
      const franjaData = req.body;
      const newFranja = await FranjaHoraria.createFranja(franjaData);
      res.status(201).json(newFranja);
    } catch (error) {
      console.error("Error al crear franja horaria:", error);
      res.status(400).json({ error: error.message });
    }
  }

  // Actualizar franja horaria
  static async updateFranja(req, res) {
    try {
      const { franja_id } = req.params;
      const updateData = req.body;
      const updatedFranja = await FranjaHoraria.updateFranja(
        franja_id,
        updateData
      );
      res.status(200).json(updatedFranja);
    } catch (error) {
      console.error("Error al actualizar franja horaria:", error);
      res.status(400).json({ error: error.message });
    }
  }

  // Eliminar franja horaria
  static async deleteFranja(req, res) {
    try {
      const { franja_id } = req.params;
      const deletedFranja = await FranjaHoraria.deleteFranja(franja_id);
      res.status(200).json(deletedFranja);
    } catch (error) {
      console.error("Error al eliminar franja horaria:", error);
      res.status(400).json({ error: error.message });
    }
  }

  // Obtener franjas disponibles por empleado y fecha
  static async getAvailableFranjasByEmployee(req, res) {
    try {
      const { empleado_id, fecha } = req.params;

      console.log("🔍 getAvailableFranjasByEmployee llamado con:", {
        empleado_id,
        fecha,
      });

      // Validar que la fecha sea válida
      if (!fecha || !Date.parse(fecha)) {
        console.log("❌ Fecha inválida:", fecha);
        return res.status(400).json({ error: "Fecha inválida" });
      }

      console.log("✅ Fecha válida, obteniendo franjas...");

      const franjas = await FranjaHoraria.getAvailableFranjasByEmployee(
        empleado_id,
        fecha
      );

      console.log("📅 Franjas obtenidas:", franjas.length);
      res.status(200).json(franjas);
    } catch (error) {
      console.error("❌ Error obteniendo franjas disponibles:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Generar franjas horarias para un rango de fechas
  static async generateFranjasForDateRange(req, res) {
    try {
      const { empleado_id } = req.params;
      const { fecha_inicio, fecha_fin } = req.body;

      console.log("🔍 generateFranjasForDateRange llamado con:", {
        empleado_id,
        fecha_inicio,
        fecha_fin,
      });

      // Validar fechas
      if (
        !fecha_inicio ||
        !fecha_fin ||
        !Date.parse(fecha_inicio) ||
        !Date.parse(fecha_fin)
      ) {
        return res.status(400).json({ error: "Fechas inválidas" });
      }

      if (new Date(fecha_inicio) > new Date(fecha_fin)) {
        return res
          .status(400)
          .json({
            error: "La fecha de inicio debe ser anterior a la fecha de fin",
          });
      }

      const result = await FranjaHoraria.generateFranjasForDateRange(
        empleado_id,
        fecha_inicio,
        fecha_fin
      );

      console.log("✅ Franjas generadas:", result.total_franjas);
      res.status(200).json(result);
    } catch (error) {
      console.error("❌ Error generando franjas horarias:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Obtener estadísticas de franjas
  static async getFranjaStats(req, res) {
    try {
      const filters = req.query;
      const stats = await FranjaHoraria.getFranjaStats(filters);
      res.status(200).json(stats);
    } catch (error) {
      console.error("Error al obtener estadísticas de franjas:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Generar slots de tiempo para una franja
  static async generateTimeSlots(req, res) {
    try {
      const { franja_id } = req.params;
      const { duracion_minutos = 30 } = req.query;

      const franja = await FranjaHoraria.getFranjaById(franja_id);

      if (!franja) {
        return res.status(404).json({ error: "Franja horaria no encontrada" });
      }

      const slots = FranjaHoraria.generateTimeSlots(
        franja.franja_hora_inicio,
        franja.franja_hora_fin,
        parseInt(duracion_minutos)
      );

      res.status(200).json({
        franja_id: franja.franja_id,
        franja_hora_inicio: franja.franja_hora_inicio,
        franja_hora_fin: franja.franja_hora_fin,
        duracion_minutos: parseInt(duracion_minutos),
        slots: slots,
        total_slots: slots.length,
      });
    } catch (error) {
      console.error("Error al generar slots de tiempo:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default FranjasController;
