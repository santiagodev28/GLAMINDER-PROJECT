import { executeQuery } from "../database/connectiondb.js";

class TiendaCategoria {
  // Obtener todas las categorías activas
  static async getAllCategories() {
    const query = `
      SELECT 
        categoria_id,
        categoria_nombre,
        categoria_descripcion
      FROM tienda_categoria 
      WHERE categoria_estado = 1
      ORDER BY categoria_nombre ASC
    `;

    const result = await executeQuery(query);

    if (!result.success) {
      throw new Error(`Error al obtener categorías: ${result.error}`);
    }

    return result.data;
  }

  // Obtener categoría por ID
  static async getCategoryById(categoria_id) {
    const query = `
      SELECT 
        categoria_id,
        categoria_nombre,
        categoria_descripcion
      FROM tienda_categoria 
      WHERE categoria_id = ? AND categoria_estado = 1
    `;

    const result = await executeQuery(query, [categoria_id]);

    if (!result.success) {
      throw new Error(`Error al obtener categoría: ${result.error}`);
    }

    return result.data[0] || null;
  }

  // Crear nueva categoría
  static async createCategory(categoryData) {
    const { categoria_nombre, categoria_descripcion } = categoryData;

    if (!categoria_nombre) {
      throw new Error("El nombre de la categoría es obligatorio");
    }

    const query = `
      INSERT INTO tienda_categoria (categoria_nombre, categoria_descripcion, categoria_estado)
      VALUES (?, ?, 1)
    `;

    const result = await executeQuery(query, [
      categoria_nombre,
      categoria_descripcion,
    ]);

    if (!result.success) {
      throw new Error(`Error al crear categoría: ${result.error}`);
    }

    return {
      success: true,
      categoria_id: result.data.insertId,
      message: "Categoría creada exitosamente",
    };
  }

  // Actualizar categoría
  static async updateCategory(categoria_id, updateData) {
    const { categoria_nombre, categoria_descripcion } = updateData;

    const query = `
      UPDATE tienda_categoria 
      SET categoria_nombre = COALESCE(?, categoria_nombre),
          categoria_descripcion = COALESCE(?, categoria_descripcion)
      WHERE categoria_id = ? AND categoria_estado = 1
    `;

    const result = await executeQuery(query, [
      categoria_nombre,
      categoria_descripcion,
      categoria_id,
    ]);

    if (!result.success) {
      throw new Error(`Error al actualizar categoría: ${result.error}`);
    }

    if (result.data.affectedRows === 0) {
      throw new Error("Categoría no encontrada");
    }

    return {
      success: true,
      message: "Categoría actualizada exitosamente",
    };
  }

  // Desactivar categoría (soft delete)
  static async deactivateCategory(categoria_id) {
    const query = `
      UPDATE tienda_categoria 
      SET categoria_estado = 0
      WHERE categoria_id = ?
    `;

    const result = await executeQuery(query, [categoria_id]);

    if (!result.success) {
      throw new Error(`Error al desactivar categoría: ${result.error}`);
    }

    if (result.data.affectedRows === 0) {
      throw new Error("Categoría no encontrada");
    }

    return {
      success: true,
      message: "Categoría desactivada exitosamente",
    };
  }
}

export default TiendaCategoria;
