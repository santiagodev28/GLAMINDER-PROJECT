import Owner from "../models/Owner.js";

// Controlador para los propietarios

class OwnerController {
    static async getAllOwners(req, res) { // Función para obtener todos los propietarios
        try {
            const owners = await Owner.getAllOwners();
            res.json(owners);
        } catch (error) {
            console.error("Error al obtener propietarios:", error);
            res.status(500).json({ error: "Error al obtener propietarios" });
        }
    }

    static async getOwnerById(req, res) { // Función para obtener un propietario por su ID
        try {
            const { propietario_id } = req.params;
            const owner = await Owner.getOwnerById(propietario_id);
            res.json(owner);
        } catch (error) {
            console.error("Error al obtener el propietario:", error);
            res.status(500).json({ error: "Error al obtener el propietario" });
        }
    }



    static async deleteOwner(req, res) { // Función para eliminar un propietario
        try {
            const { propietario_id } = req.params;
            const deletedOwner = await Owner.deleteOwner(propietario_id);
            res.json(deletedOwner);
        } catch (error) {
            console.error("Error al eliminar el propietario:", error);
            res.status(500).json({ error: "Error al eliminar el propietario" });
        }
    }
}

export default OwnerController