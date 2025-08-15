import Request from "../models/Request.js"

class RequestController {
    static async createRequest(req,res){
        try {
            const request = req.body;
            const user = req.user.usuario_id;
            console.log("body recibido:", req.body)
            console.log("usuario:", req.user)
            const newRequest = await Request.createRequest(user, request );
            res.status(201).json(newRequest);
        } catch (error) {
            console.error("Error al crear la peticion:", error);
            res.status(500).json({ error: "Error al crear la peticion." });
        }
    }
}

export default RequestController