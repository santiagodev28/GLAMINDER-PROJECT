import Services from "../models/Service.js";

class ServiceController {
  static async getAllServices(req, res) {
    try {
      const services = await Services.getAllServices();
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getServicesByOwner(req, res) {
    try {
      const { propietario_id } = req.params;
      const filters = req.query;
      const services = await Services.getServicesByOwner(
        propietario_id,
        filters
      );
      res.json(services);
    } catch (error) {
      console.error(
        "Error al obtener servicios del propietario:",
        error.message
      );
      res.status(500).json({ error: error.message });
    }
  }

  static async getServiceById(req, res) {
    try {
      const { servicio_id } = req.params;
      const service = await Services.getServiceById(servicio_id);
      res.status(200).json(service);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createService(req, res) {
    try {
      const service = req.body;
      console.log("Datos recibidos para crear servicio:", service);
      const newService = await Services.createService(service);
      res.status(201).json(newService);
    } catch (error) {
      console.error("Error al crear servicio:", error.message);
      console.error("Stack trace:", error.stack);
      res.status(500).json({ error: error.message });
    }
  }

  static async updateService(req, res) {
    try {
      const { servicio_id } = req.params;
      const service = req.body;
      const updatedService = await Services.updateService(servicio_id, service);
      res.status(200).json(updatedService);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteService(req, res) {
    try {
      const { servicio_id } = req.params;
      const deletedService = await Services.deleteService(servicio_id);
      res.status(200).json(deletedService);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Obtener servicios por tienda
  static async getServicesByStore(req, res) {
    try {
      const { tienda_id } = req.params;
      const { includeInactive } = req.query;

      const services = await Services.getServicesByStore(
        tienda_id,
        includeInactive === "true"
      );

      res.status(200).json(services);
    } catch (error) {
      console.error("Error obteniendo servicios por tienda:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default ServiceController;
