import Business from "../models/Business.js";

class BusinessController {
  static async getAllBusiness(req, res) {
    try {
      const { estado } = req.query;
      const business = await Business.getAllBusiness(estado);
      res.json(business);
    } catch (error) {
      console.error("Error al obtener los negocios:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async getBusinessById(req, res) {
    try {
      const { negocio_id } = req.params;
      const business = await Business.getBusinessById(negocio_id);
      if (!business) {
        return res.status(404).json({ error: "Negocio no encontrado" });
      }
      res.json(business);
    } catch (error) {
      console.error("Error al obtener el negocio:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async getBusinessByEmail(req, res) {
    try {
      const { negocio_correo } = req.params;
      const business = await Business.getBusinessByEmail(negocio_correo);
      if (!business) {
        return res.status(404).json({ error: "Negocio no encontrado" });
      }
      res.json(business);
    } catch (error) {
      console.error("Error al buscar negocio por email:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async getStoresByBusiness(req, res) {
    try {
      const { negocio_id } = req.params;
      const stores = await Business.getStoresByBusiness(negocio_id);
      res.json(stores);
    } catch (error) {
      console.error("Error al obtener las tiendas:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async createBusiness(req, res) {
    try {
      const businessData = req.body;
      const newBusiness = await Business.createBusiness(businessData);
      res.status(201).json(newBusiness);
    } catch (error) {
      if (error.message.includes("correo electrónico")) {
        return res.status(400).json({ error: error.message });
      }
      if (error.message.includes("obligatorios")) {
        return res.status(400).json({ error: error.message });
      }
      console.error("Error al crear el negocio:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async updateBusiness(req, res) {
    try {
      const { negocio_id } = req.params;
      const updateData = req.body;
      const updatedBusiness = await Business.updateBusiness(
        negocio_id,
        updateData
      );
      res.json(updatedBusiness);
    } catch (error) {
      if (error.message === "Negocio no encontrado") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes("correo electrónico")) {
        return res.status(400).json({ error: error.message });
      }
      console.error("Error al actualizar el negocio:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async changeBusinessState(req, res) {
    try {
      const { negocio_id } = req.params;
      const { nuevo_estado } = req.body;
      const result = await Business.changeBusinessState(
        negocio_id,
        nuevo_estado
      );
      res.json(result);
    } catch (error) {
      if (error.message === "Negocio no encontrado") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes("Estado inválido")) {
        return res.status(400).json({ error: error.message });
      }
      console.error("Error al cambiar estado del negocio:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteBusiness(req, res) {
    try {
      const { negocio_id } = req.params;
      const canDelete = await Business.canDeleteBusiness(negocio_id);
      if (!canDelete) {
        return res
          .status(400)
          .json({
            error:
              "No se puede eliminar el negocio porque tiene tiendas activas.",
          });
      }
      const deletedBusiness = await Business.deleteBusiness(negocio_id);
      res.json(deletedBusiness);
    } catch (error) {
      if (error.message === "Negocio no encontrado") {
        return res.status(404).json({ error: error.message });
      }
      console.error("Error al eliminar el negocio:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async reactivateBusiness(req, res) {
    try {
      const { negocio_id } = req.params;
      const reactivatedBusiness = await Business.reactivateBusiness(negocio_id);
      res.json(reactivatedBusiness);
    } catch (error) {
      if (error.message === "Negocio no encontrado") {
        return res.status(404).json({ error: error.message });
      }
      console.error("Error al reactivar el negocio:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async getBusinessStats(req, res) {
    try {
      const { negocio_id } = req.params;
      const stats = await Business.getBusinessStats(negocio_id);
      res.json(stats);
    } catch (error) {
      console.error(
        "Error al obtener estadísticas del negocio:",
        error.message
      );
      res.status(500).json({ error: error.message });
    }
  }

  static async searchBusinessByName(req, res) {
    try {
      const { nombre } = req.query;
      const business = await Business.searchBusinessByName(nombre);
      res.json(business);
    } catch (error) {
      console.error("Error al buscar negocios por nombre:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async getBusinessByOwner(req, res) {
    try {
      const { propietario_id } = req.params;
      const business = await Business.getBusinessByOwner(propietario_id);
      res.json(business);
    } catch (error) {
      console.error(
        "Error al obtener negocios del propietario:",
        error.message
      );
      res.status(500).json({ error: error.message });
    }
  }

  static async countBusinessByState(req, res) {
    try {
      const { estado } = req.query;
      const total = await Business.countBusinessByState(estado);
      res.json({ total });
    } catch (error) {
      console.error("Error al contar negocios:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async getBusinessStats(req, res) {
    try {
      const { negocio_id } = req.params;
      const stats = await Business.getBusinessStats(negocio_id);
      res.json(stats);
    } catch (error) {
      console.error(
        "Error al obtener estadísticas del negocio:",
        error.message
      );
      res.status(500).json({ error: error.message });
    }
  }
}

export default BusinessController;
