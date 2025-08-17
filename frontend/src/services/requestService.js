import api from "../api/api.js";

const token = localStorage.getItem("token");

const requestService = {
    getAll: async () => {
        const res = await api.get("/solicitudes", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    },
    getByUser: async (usuario_id) => {
        const res = await api.get(`/solicitudes/usuario/${usuario_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    },
    approve: async (solicitud_id) => {
        const res = await api.put(
            `/solicitudes/aprobar/${solicitud_id}`,
            { estado: "aprobado" }, // <-- cuerpo como segundo argumento
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json", // <-- asegúrate de enviar el header
                },
            }
        );
        return res.data;
    },
    reject: async (solicitud_id) => {
        const res = await api.put(
            `/solicitudes/rechazar/${solicitud_id}`,
            { estado: "rechazado" }, // <-- cuerpo como segundo argumento
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json", // <-- asegúrate de enviar el header
                },
            }
        );
        return res.data;
    },
};

export default requestService;
