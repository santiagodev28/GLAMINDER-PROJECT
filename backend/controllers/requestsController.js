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
            res.status(500).json({ error: "Error al crear la peticion." });
        }
    }

    static async getAllRequests(req, res) {
        try {
            const requests = await Request.getAllRequests();
            res.status(200).json(requests);
        } catch (error) {
            console.error("Error al obtener las solicitudes:", error);
            res.status(500).json({
                error: "Error al obtener las solicitudes.",
            });
        }
    }
    static async getRequestByUser(req, res) {
        try {
            const userId = req.user.usuario_id;
            const request = await Request.getRequestByUserId(userId);
            if (request.length === 0) {
                return res
                    .status(404)
                    .json({ message: "No se encontró la solicitud." });
            }
            res.status(200).json(request[0]);
        } catch (error) {
            console.error("Error al obtener la solicitud:", error);
            res.status(500).json({ error: "Error al obtener la solicitud." });
        }
    }
    static async approveRequest(req, res) {
        try {
            const { id } = req.params; // <-- ya viene de la URL
            const result = await Request.updateStatusRequest(id, req.body.estado || "aprobado");
            res.json({
                message: `Solicitud ${id} actualizada a estado: aprobado`,
                result,
            });
        } catch (error) {
            res.status(500).json({
                message: "Error al aprobar la solicitud",
                error,
            });
        }
    }

    static async rejectRequest(req, res) {
        console.log("Rechazando solicitud con body:", req.body);
        try {
            const { id } = req.params; // <-- ya viene de la URL
            const result = await Request.updateStatusRequest(id, req.body.estado || "rechazado");
            res.json({
                message: `Solicitud ${id} actualizada a estado: rechazada`,
                result,
            });
        } catch (error) {
            res.status(500).json({
                message: "Error al rechazar la solicitud",
                error,
            });
        }
    }
}

export default RequestController;
