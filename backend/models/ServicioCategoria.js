import { executeQuery } from "../database/connectiondb.js";

class ServicioCategoria {
  // Estados válidos para categorías
  static STATES = {
    ACTIVE: 1,
    INACTIVE: 0,
  };

  // Obtener todas las categorías
  static async getAllCategories(filters = {}) {
    let query = `
      SELECT 
        sc.*,
        COUNT(DISTINCT tcs.tienda_id) as total_tiendas,
        COUNT(DISTINCT s.servicio_id) as total_servicios
      FROM servicio_categoria sc
      LEFT JOIN tienda_categoria_servicio tcs ON sc.categoria_id = tcs.categoria_id AND tcs.estado = 1
      LEFT JOIN servicios s ON sc.categoria_id = s.categoria_id
    `;

    const params = [];
    const conditions = [];

    // Aplicar filtros
    if (filters.estado !== undefined) {
      conditions.push("sc.categoria_estado = ?");
      params.push(filters.estado);
    }

    if (filters.tienda_id) {
      conditions.push("tcs.tienda_id = ?");
      params.push(filters.tienda_id);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " GROUP BY sc.categoria_id ORDER BY sc.categoria_nombre ASC";

    const result = await executeQuery(query, params);

    if (!result.success) {
      throw new Error(`Error al obtener categorías: ${result.error}`);
    }

    return result.data;
  }

  // Obtener categoría por ID
  static async getCategoryById(categoria_id) {
    const query = `
      SELECT 
        sc.*,
        COUNT(DISTINCT tcs.tienda_id) as total_tiendas,
        COUNT(DISTINCT s.servicio_id) as total_servicios
      FROM servicio_categoria sc
      LEFT JOIN tienda_categoria_servicio tcs ON sc.categoria_id = tcs.categoria_id AND tcs.estado = 1
      LEFT JOIN servicios s ON sc.categoria_id = s.categoria_id
      WHERE sc.categoria_id = ?
      GROUP BY sc.categoria_id
    `;

    const result = await executeQuery(query, [categoria_id]);

    if (!result.success) {
      throw new Error(`Error al obtener categoría: ${result.error}`);
    }

    return result.data[0] || null;
  }

  // Crear nueva categoría
  static async createCategory(categoryData) {
    const {
      categoria_nombre,
      categoria_descripcion,
      categoria_estado = 1,
    } = categoryData;

    // Validar campos requeridos
    if (!categoria_nombre) {
      throw new Error("El nombre de la categoría es requerido");
    }

    // Verificar si ya existe una categoría con el mismo nombre
    const existingCategory = await this.getCategoryByName(categoria_nombre);
    if (existingCategory) {
      throw new Error("Ya existe una categoría con este nombre");
    }

    const query = `
      INSERT INTO servicio_categoria (categoria_nombre, categoria_descripcion, categoria_estado)
      VALUES (?, ?, ?)
    `;

    const params = [categoria_nombre, categoria_descripcion, categoria_estado];
    const result = await executeQuery(query, params);

    if (!result.success) {
      throw new Error(`Error al crear categoría: ${result.error}`);
    }

    return {
      categoria_id: result.data.insertId,
      categoria_nombre,
      categoria_descripcion,
      categoria_estado,
    };
  }

  // Actualizar categoría
  static async updateCategory(categoria_id, categoryData) {
    const { categoria_nombre, categoria_descripcion, categoria_estado } =
      categoryData;

    // Verificar si la categoría existe
    const existingCategory = await this.getCategoryById(categoria_id);
    if (!existingCategory) {
      throw new Error("Categoría no encontrada");
    }

    // Si se está cambiando el nombre, verificar que no exista otra categoría con el mismo nombre
    if (
      categoria_nombre &&
      categoria_nombre !== existingCategory.categoria_nombre
    ) {
      const duplicateCategory = await this.getCategoryByName(categoria_nombre);
      if (duplicateCategory) {
        throw new Error("Ya existe una categoría con este nombre");
      }
    }

    const query = `
      UPDATE servicio_categoria 
      SET categoria_nombre = COALESCE(?, categoria_nombre),
          categoria_descripcion = COALESCE(?, categoria_descripcion),
          categoria_estado = COALESCE(?, categoria_estado)
      WHERE categoria_id = ?
    `;

    const params = [
      categoria_nombre,
      categoria_descripcion,
      categoria_estado,
      categoria_id,
    ];
    const result = await executeQuery(query, params);

    if (!result.success) {
      throw new Error(`Error al actualizar categoría: ${result.error}`);
    }

    return await this.getCategoryById(categoria_id);
  }

  // Eliminar categoría (soft delete)
  static async deleteCategory(categoria_id) {
    // Verificar si la categoría existe
    const existingCategory = await this.getCategoryById(categoria_id);
    if (!existingCategory) {
      throw new Error("Categoría no encontrada");
    }

    // Verificar si hay servicios asociados
    const servicesQuery = `
      SELECT COUNT(*) as count FROM servicios WHERE categoria_id = ?
    `;
    const servicesResult = await executeQuery(servicesQuery, [categoria_id]);

    if (servicesResult.success && servicesResult.data[0].count > 0) {
      throw new Error(
        "No se puede eliminar la categoría porque tiene servicios asociados"
      );
    }

    const query = `
      UPDATE servicio_categoria 
      SET categoria_estado = 0 
      WHERE categoria_id = ?
    `;

    const result = await executeQuery(query, [categoria_id]);

    if (!result.success) {
      throw new Error(`Error al eliminar categoría: ${result.error}`);
    }

    return { message: "Categoría eliminada exitosamente" };
  }

  // Obtener categoría por nombre
  static async getCategoryByName(categoria_nombre) {
    const query = `
      SELECT * FROM servicio_categoria 
      WHERE categoria_nombre = ? AND categoria_estado = 1
    `;

    const result = await executeQuery(query, [categoria_nombre]);

    if (!result.success) {
      throw new Error(`Error al buscar categoría: ${result.error}`);
    }

    return result.data[0] || null;
  }

  // Obtener categorías disponibles para una tienda específica
  static async getCategoriesByStore(tienda_id) {
    const query = `
      SELECT 
        sc.*,
        CASE WHEN tcs.tienda_id IS NOT NULL THEN 1 ELSE 0 END as disponible_en_tienda
      FROM servicio_categoria sc
      LEFT JOIN tienda_categoria_servicio tcs ON sc.categoria_id = tcs.categoria_id 
        AND tcs.tienda_id = ? AND tcs.estado = 1
      WHERE sc.categoria_estado = 1
      ORDER BY sc.categoria_nombre ASC
    `;

    const result = await executeQuery(query, [tienda_id]);

    if (!result.success) {
      throw new Error(
        `Error al obtener categorías de la tienda: ${result.error}`
      );
    }

    return result.data;
  }

  // Asignar categoría a tienda
  static async assignCategoryToStore(tienda_id, categoria_id) {
    // Verificar que la tienda y categoría existen
    const storeQuery = `SELECT tienda_id FROM tiendas WHERE tienda_id = ?`;
    const categoryQuery = `SELECT categoria_id FROM servicio_categoria WHERE categoria_id = ? AND categoria_estado = 1`;

    const [storeResult, categoryResult] = await Promise.all([
      executeQuery(storeQuery, [tienda_id]),
      executeQuery(categoryQuery, [categoria_id]),
    ]);

    if (!storeResult.success || !storeResult.data.length) {
      throw new Error("Tienda no encontrada");
    }

    if (!categoryResult.success || !categoryResult.data.length) {
      throw new Error("Categoría no encontrada");
    }

    const query = `
      INSERT INTO tienda_categoria_servicio (tienda_id, categoria_id, estado)
      VALUES (?, ?, 1)
      ON DUPLICATE KEY UPDATE estado = 1
    `;

    const result = await executeQuery(query, [tienda_id, categoria_id]);

    if (!result.success) {
      throw new Error(`Error al asignar categoría a tienda: ${result.error}`);
    }

    return { message: "Categoría asignada exitosamente a la tienda" };
  }

  // Desasignar categoría de tienda
  static async unassignCategoryFromStore(tienda_id, categoria_id) {
    const query = `
      UPDATE tienda_categoria_servicio 
      SET estado = 0 
      WHERE tienda_id = ? AND categoria_id = ?
    `;

    const result = await executeQuery(query, [tienda_id, categoria_id]);

    if (!result.success) {
      throw new Error(
        `Error al desasignar categoría de tienda: ${result.error}`
      );
    }

    return { message: "Categoría desasignada exitosamente de la tienda" };
  }
}

export default ServicioCategoria;
