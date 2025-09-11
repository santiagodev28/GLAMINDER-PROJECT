import TiendaCategoria from "../models/TiendaCategoria.js";

class TiendaCategoriaController {
  // Obtener todas las categorías
  static async getAllCategories(req, res) {
    try {
      const categories = await TiendaCategoria.getAllCategories();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Obtener categoría por ID
  static async getCategoryById(req, res) {
    try {
      const { categoria_id } = req.params;
      const category = await TiendaCategoria.getCategoryById(categoria_id);

      if (!category) {
        return res.status(404).json({ error: "Categoría no encontrada" });
      }

      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Crear nueva categoría
  static async createCategory(req, res) {
    try {
      const categoryData = req.body;
      const result = await TiendaCategoria.createCategory(categoryData);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Actualizar categoría
  static async updateCategory(req, res) {
    try {
      const { categoria_id } = req.params;
      const updateData = req.body;
      const result = await TiendaCategoria.updateCategory(
        categoria_id,
        updateData
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Desactivar categoría
  static async deactivateCategory(req, res) {
    try {
      const { categoria_id } = req.params;
      const result = await TiendaCategoria.deactivateCategory(categoria_id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default TiendaCategoriaController;
