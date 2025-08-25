import User from "../models/User.js";

// Controlador para los usuarios

class UserController {
    static async getAllUsers(req, res) {
        try {
            const estado = req.query.usuario_estado;
            const users = await User.getAllUsers(estado);
            res.json(users);
        } catch (error) {
            console.error("Error al obtener usuarios:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async getUserById(req, res) {
        try {
            const { usuario_id } = req.params;
            const user = await User.getUserById(usuario_id);
            if (!user) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }
            res.json(user);
        } catch (error) {
            console.error("Error al obtener el usuario:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async getUserByEmail(req, res) {
        try {
            const { usuario_correo } = req.params;
            const user = await User.getUserByEmail(usuario_correo);
            if (!user) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }
            res.json(user);
        } catch (error) {
            console.error("Error al obtener usuario por email:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async createUser(req, res) {
        try {
            const userData = req.body;
            const result = await User.createUser(userData);
            res.status(201).json(result);
        } catch (error) {
            console.error("Error al crear usuario:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async updateUser(req, res) {
        try {
            const { usuario_id } = req.params;
            const userData = req.body;
            const result = await User.updateUser(usuario_id, userData);
            res.json(result);
        } catch (error) {
            if (error.message === "Usuario no encontrado") {
                return res.status(404).json({ error: error.message });
            }
            console.error("Error al actualizar usuario:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async updateUserRole(req, res) {
        try {
            const { usuario_id } = req.params;
            const { rol_id } = req.body;
            const result = await User.updateUserRole(usuario_id, rol_id);
            res.json(result);
        } catch (error) {
            if (error.message === "No se encontró el usuario") {
                return res.status(404).json({ error: error.message });
            }
            console.error("Error al actualizar rol:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async resetChangeRole(req, res) {
        try {
            const { usuario_id } = req.params;
            const result = await User.resetChangeRole(usuario_id);
            res.json(result);
        } catch (error) {
            if (error.message === "Usuario no encontrado") {
                return res.status(404).json({ error: error.message });
            }
            console.error("Error al resetear cambio de rol:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteUser(req, res) {
        try {
            const { usuario_id } = req.params;
            const result = await User.deleteUser(usuario_id);
            res.json(result);
        } catch (error) {
            if (error.message === "Usuario no encontrado") {
                return res.status(404).json({ error: error.message });
            }
            console.error("Error al eliminar usuario:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async activateUser(req, res) {
        try {
            const { usuario_id } = req.params;
            const result = await User.activateUser(usuario_id);
            res.json(result);
        } catch (error) {
            if (error.message === "Usuario no encontrado") {
                return res.status(404).json({ error: error.message });
            }
            console.error("Error al activar usuario:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async updateRoleChange(req, res) {
        try {
            const { usuario_id } = req.params;
            const { rol_cambiado } = req.body;
            const result = await User.updateRoleChange(usuario_id, rol_cambiado);
            res.json(result);
        } catch (error) {
            if (error.message === "Usuario no encontrado") {
                return res.status(404).json({ error: error.message });
            }
            console.error("Error al actualizar rol_cambiado:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async countUsersByStatus(req, res) {
        try {
            const estado = req.query.usuario_estado || 1;
            const total = await User.countUsersByStatus(estado);
            res.json({ total });
        } catch (error) {
            console.error("Error al contar usuarios:", error.message);
            res.status(500).json({ error: error.message });
        }
    }
}

export default UserController;
