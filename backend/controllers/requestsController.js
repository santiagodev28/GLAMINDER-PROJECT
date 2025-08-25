import Request from "../models/Request.js";
import User from "../models/User.js";

class RequestController {
    static async createRequest(req, res) {
        try {
            const request = req.body;
            const user = req.user.usuario_id;
            const newRequest = await Request.createRequest(user, request);
            res.status(201).json(newRequest);
        } catch (error) {
            console.error("Error al crear la peticion:", error);
            res.status(500).json({ 
                error: "Error al crear la peticion.",
                details: error.message 
            });
        }
    }

    static async getAllRequests(req, res) {
        try {
            const filters = req.query; // Para permitir filtros opcionales
            const requests = await Request.getAllRequests(filters);
            res.status(200).json(requests);
        } catch (error) {
            console.error("Error al obtener las solicitudes:", error);
            res.status(500).json({
                error: "Error al obtener las solicitudes.",
                details: error.message
            });
        }
    }

    static async getRequestByUser(req, res) {
        try {
            const userId = req.user.usuario_id;
            // ✅ CORREGIDO: Usar el método correcto (plural)
            const requests = await Request.getRequestsByUserId(userId);
            
            if (requests.length === 0) {
                return res.status(404).json({ 
                    message: "No se encontró ninguna solicitud para este usuario." 
                });
            }
            
            // Retornar la más reciente (primera en el array por el ORDER BY DESC)
            res.status(200).json(requests[0]);
        } catch (error) {
            console.error("Error al obtener la solicitud:", error);
            res.status(500).json({ 
                error: "Error al obtener la solicitud.",
                details: error.message 
            });
        }
    }

    static async approveRequest(req, res) {
        try {
            const { id } = req.params;
            const adminId = req.user?.usuario_id; // ID del admin que aprueba
            
            // ✅ CORREGIDO: Usar el método correcto y pasar admin_id
            const result = await Request.updateRequestStatus(id, "aprobado", adminId);
            
            res.status(200).json({
                message: `Solicitud ${id} aprobada exitosamente`,
                data: result
            });
        } catch (error) {
            console.error("Error al aprobar la solicitud:", error);
            res.status(500).json({
                error: "Error al aprobar la solicitud",
                details: error.message
            });
        }
    }

    static async rejectRequest(req, res) {
        try {
            const { id } = req.params;
            const adminId = req.user?.usuario_id; // ID del admin que rechaza
            
            console.log(`Rechazando solicitud ${id} por admin ${adminId}`);
            
            // ✅ CORREGIDO: Usar el método correcto y pasar admin_id
            const result = await Request.updateRequestStatus(id, "rechazado", adminId);
            
            res.status(200).json({
                message: `Solicitud ${id} rechazada exitosamente`,
                data: result
            });
        } catch (error) {
            console.error("Error al rechazar la solicitud:", error);
            res.status(500).json({
                error: "Error al rechazar la solicitud",
                details: error.message
            });
        }
    }

    // ✅ MÉTODOS ADICIONALES ÚTILES

    static async getRequestById(req, res) {
        try {
            const { id } = req.params;
            const request = await Request.getRequestById(id);
            
            if (!request) {
                return res.status(404).json({
                    message: "Solicitud no encontrada"
                });
            }
            
            res.status(200).json(request);
        } catch (error) {
            console.error("Error al obtener solicitud por ID:", error);
            res.status(500).json({
                error: "Error al obtener la solicitud",
                details: error.message
            });
        }
    }

    static async getPendingRequests(req, res) {
        try {
            const pendingRequests = await Request.getPendingRequests();
            res.status(200).json(pendingRequests);
        } catch (error) {
            console.error("Error al obtener solicitudes pendientes:", error);
            res.status(500).json({
                error: "Error al obtener solicitudes pendientes",
                details: error.message
            });
        }
    }

    static async getRequestsStats(req, res) {
        try {
            const filters = req.query;
            const stats = await Request.getRequestsStats(filters);
            res.status(200).json(stats);
        } catch (error) {
            console.error("Error al obtener estadísticas:", error);
            res.status(500).json({
                error: "Error al obtener estadísticas",
                details: error.message
            });
        }
    }

    static async searchRequests(req, res) {
        try {
            const { term } = req.query;
            
            if (!term) {
                return res.status(400).json({
                    error: "Término de búsqueda requerido"
                });
            }
            
            const requests = await Request.searchRequests(term);
            res.status(200).json(requests);
        } catch (error) {
            console.error("Error al buscar solicitudes:", error);
            res.status(500).json({
                error: "Error al buscar solicitudes",
                details: error.message
            });
        }
    }
}

export default RequestController;