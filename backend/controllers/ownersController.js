import Owner from "../models/Owner.js";

// Controlador para los propietarios

class OwnerController {
    static async getAllOwners(req, res) {
        try {
            const filters = req.query;
            const owners = await Owner.getAllOwners(filters);
            res.json(owners);
        } catch (error) {
            console.error("Error al obtener propietarios:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async getOwnerById(req, res) {
        try {
            const { propietario_id } = req.params;
            const owner = await Owner.getOwnerById(propietario_id);
            if (!owner) {
                return res.status(404).json({ error: "Propietario no encontrado" });
            }
            res.json(owner);
        } catch (error) {
            console.error("Error al obtener el propietario:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async getOwnerByUserId(req, res) {
        try {
            const { usuario_id } = req.params;
            const owner = await Owner.getOwnerByUserId(usuario_id);
            if (!owner) {
                return res.status(404).json({ error: "Propietario no encontrado" });
            }
            res.json(owner);
        } catch (error) {
            console.error("Error al obtener propietario por usuario:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async createOwner(req, res) {
        try {
            const ownerData = req.body;
            const newOwner = await Owner.createOwner(ownerData);
            res.status(201).json(newOwner);
        } catch (error) {
            if (error.message.includes("obligatorio")) {
                return res.status(400).json({ error: error.message });
            }
            if (error.message.includes("ya está registrado como propietario")) {
                return res.status(400).json({ error: error.message });
            }
            if (error.message.includes("no existe o está inactivo")) {
                return res.status(400).json({ error: error.message });
            }
            console.error("Error al crear el propietario:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async updateOwner(req, res) {
        try {
            const { propietario_id } = req.params;
            const updateData = req.body;
            const updatedOwner = await Owner.updateOwner(propietario_id, updateData);
            res.json(updatedOwner);
        } catch (error) {
            if (error.message === "Propietario no encontrado") {
                return res.status(404).json({ error: error.message });
            }
            if (error.message.includes("ya está registrado como propietario")) {
                return res.status(400).json({ error: error.message });
            }
            if (error.message.includes("no existe o está inactivo")) {
                return res.status(400).json({ error: error.message });
            }
            console.error("Error al actualizar el propietario:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async changeOwnerState(req, res) {
        try {
            const { propietario_id } = req.params;
            const { nuevo_estado } = req.body;
            const result = await Owner.changeOwnerState(propietario_id, nuevo_estado);
            res.json(result);
        } catch (error) {
            if (error.message === "Propietario no encontrado") {
                return res.status(404).json({ error: error.message });
            }
            if (error.message.includes("Estado inválido")) {
                return res.status(400).json({ error: error.message });
            }
            console.error("Error al cambiar estado del propietario:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteOwner(req, res) {
        try {
            const { propietario_id } = req.params;
            const deletedOwner = await Owner.deleteOwner(propietario_id);
            res.json(deletedOwner);
        } catch (error) {
            if (error.message.includes("negocios activos")) {
                return res.status(400).json({ error: error.message });
            }
            if (error.message === "Propietario no encontrado") {
                return res.status(404).json({ error: error.message });
            }
            console.error("Error al eliminar el propietario:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async reactivateOwner(req, res) {
        try {
            const { propietario_id } = req.params;
            const reactivatedOwner = await Owner.reactivateOwner(propietario_id);
            res.json(reactivatedOwner);
        } catch (error) {
            if (error.message === "Propietario no encontrado") {
                return res.status(404).json({ error: error.message });
            }
            console.error("Error al reactivar el propietario:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async getOwnerBusinesses(req, res) {
        try {
            const { propietario_id } = req.params;
            const { includeInactive } = req.query;
            const businesses = await Owner.getOwnerBusinesses(propietario_id, includeInactive === "true");
            res.json(businesses);
        } catch (error) {
            console.error("Error al obtener negocios del propietario:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async getOwnerStats(req, res) {
        try {
            const { propietario_id } = req.params;
            const stats = await Owner.getOwnerStats(propietario_id);
            res.json(stats);
        } catch (error) {
            console.error("Error al obtener estadísticas del propietario:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async countOwnersByState(req, res) {
        try {
            const { estado } = req.query;
            const total = await Owner.countOwnersByState(estado);
            res.json({ total });
        } catch (error) {
            console.error("Error al contar propietarios:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async searchOwners(req, res) {
        try {
            const { searchTerm } = req.query;
            const owners = await Owner.searchOwners(searchTerm);
            res.json(owners);
        } catch (error) {
            console.error("Error al buscar propietarios:", error.message);
            res.status(500).json({ error: error.message });
        }
    }
}

export default OwnerController;