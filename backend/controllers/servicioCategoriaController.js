import ServicioCategoria from "../models/ServicioCategoria.js";

class ServicioCategoriaController {
  // Obtener todas las categorías
  static async getAllCategories(req, res) {
    try {
      const filters = req.query;
      const categories = await ServicioCategoria.getAllCategories(filters);
      res.json(categories);
    } catch (error) {
      console.error("Error al obtener categorías:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  // Obtener categoría por ID
  static async getCategoryById(req, res) {
    try {
      const { categoria_id } = req.params;
      const category = await ServicioCategoria.getCategoryById(categoria_id);

      if (!category) {
        return res.status(404).json({ error: "Categoría no encontrada" });
      }

      res.json(category);
    } catch (error) {
      console.error("Error al obtener categoría:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  // Crear nueva categoría
  static async createCategory(req, res) {
    try {
      const categoryData = req.body;
      const newCategory = await ServicioCategoria.createCategory(categoryData);
      res.status(201).json(newCategory);
    } catch (error) {
      console.error("Error al crear categoría:", error.message);
      if (error.message.includes("Ya existe")) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // Actualizar categoría
  static async updateCategory(req, res) {
    try {
      const { categoria_id } = req.params;
      const categoryData = req.body;
      const updatedCategory = await ServicioCategoria.updateCategory(
        categoria_id,
        categoryData
      );
      res.json(updatedCategory);
    } catch (error) {
      console.error("Error al actualizar categoría:", error.message);
      if (
        error.message.includes("no encontrada") ||
        error.message.includes("Ya existe")
      ) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // Eliminar categoría
  static async deleteCategory(req, res) {
    try {
      const { categoria_id } = req.params;
      const result = await ServicioCategoria.deleteCategory(categoria_id);
      res.json(result);
    } catch (error) {
      console.error("Error al eliminar categoría:", error.message);
      if (
        error.message.includes("no encontrada") ||
        error.message.includes("servicios asociados")
      ) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // Obtener categorías disponibles para una tienda
  static async getCategoriesByStore(req, res) {
    try {
      const { tienda_id } = req.params;
      const categories = await ServicioCategoria.getCategoriesByStore(
        tienda_id
      );
      res.json(categories);
    } catch (error) {
      console.error("Error al obtener categorías de la tienda:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  // Asignar categoría a tienda
  static async assignCategoryToStore(req, res) {
    try {
      const { tienda_id, categoria_id } = req.params;
      const result = await ServicioCategoria.assignCategoryToStore(
        tienda_id,
        categoria_id
      );
      res.json(result);
    } catch (error) {
      console.error("Error al asignar categoría a tienda:", error.message);
      if (error.message.includes("no encontrada")) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // Desasignar categoría de tienda
  static async unassignCategoryFromStore(req, res) {
    try {
      const { tienda_id, categoria_id } = req.params;
      const result = await ServicioCategoria.unassignCategoryFromStore(
        tienda_id,
        categoria_id
      );
      res.json(result);
    } catch (error) {
      console.error("Error al desasignar categoría de tienda:", error.message);
      res.status(500).json({ error: error.message });
    }
  }
}

export default ServicioCategoriaController;
