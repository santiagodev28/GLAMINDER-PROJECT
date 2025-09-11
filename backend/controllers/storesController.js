import Stores from "../models/Store.js";

class StoresController {
  static async getAllStores(req, res) {
    try {
      const stores = await Stores.getAllStores();
      res.status(200).json(stores);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  static async getStoreByBusiness(req, res) {
    try {
      const { negocio_id } = req.params;
      const store = await Stores.getStoreByBusiness(negocio_id);
      res.status(200).json(store);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getEmployeesByStore(req, res) {
    try {
      const { tienda_id } = req.params;
      const employees = await Stores.getEmployeesByStore(tienda_id);
      res.status(200).json(employees);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getStoreStats(req, res) {
    try {
      const { tienda_id } = req.params;
      const stats = await Stores.getStoreStats({ tienda_id });
      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createStore(req, res) {
    try {
      const store = req.body;
      const newStore = await Stores.createStore(store);
      res.status(201).json(newStore);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateStore(req, res) {
    try {
      const { tienda_id } = req.params;
      const store = req.body;
      const updatedStore = await Stores.updateStore(tienda_id, store);
      res.status(200).json(updatedStore);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteStore(req, res) {
    try {
      const { tienda_id } = req.params;
      const deletedStore = await Stores.deleteStore(0, tienda_id);
      res.status(200).json(deletedStore);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default StoresController;
