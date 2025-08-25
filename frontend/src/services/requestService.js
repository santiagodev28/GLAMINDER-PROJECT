import api from "../api/api.js";

// FUNCIÓN PARA OBTENER TOKEN ACTUALIZADO
const getToken = () => {
    return localStorage.getItem("token");
};

// FUNCIÓN PARA CREAR HEADERS CON TOKEN ACTUAL
const getAuthHeaders = () => {
    const token = getToken();
    if (!token) {
        throw new Error("Token no encontrado. Por favor inicia sesión.");
    }
    
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
};

const requestService = {
    // Obtener todas las solicitudes (solo para admins)
    getAll: async () => {
        try {
            const res = await api.get("/solicitudes", {
                headers: getAuthHeaders(),
            });
            return res.data;
        } catch (error) {
            console.error("Error al obtener solicitudes:", error);
            throw error;
        }
    },

    // CORREGIDO: Obtener solicitudes del usuario actual (sin parámetro)
    getByCurrentUser: async () => {
        try {
            const res = await api.get("/solicitudes/usuario/mis-solicitudes", {
                headers: getAuthHeaders(),
            });
            return res.data;
        } catch (error) {
            console.error("Error al obtener solicitudes del usuario:", error);
            throw error;
        }
    },

    // Crear nueva solicitud
    create: async (requestData) => {
        try {
            const res = await api.post("/solicitudes/crear", requestData, {
                headers: getAuthHeaders(),
            });
            return res.data;
        } catch (error) {
            console.error("Error al crear solicitud:", error);
            throw error;
        }
    },

    // CORREGIDO: Aprobar solicitud (sin pasar estado en el body)
    approve: async (solicitud_id) => {
        try {
            const res = await api.put(
                `/solicitudes/aprobar/${solicitud_id}`,
                {}, // ← Body vacío, el estado se define en el backend
                {
                    headers: getAuthHeaders(),
                }
            );
            return res.data;
        } catch (error) {
            console.error("Error al aprobar solicitud:", error);
            throw error;
        }
    },

    // CORREGIDO: Rechazar solicitud (sin pasar estado en el body)
    reject: async (solicitud_id) => {
        try {
            const res = await api.put(
                `/solicitudes/rechazar/${solicitud_id}`,
                {}, // ← Body vacío, el estado se define en el backend
                {
                    headers: getAuthHeaders(),
                }
            );
            return res.data;
        } catch (error) {
            console.error("Error al rechazar solicitud:", error);
            throw error;
        }
    },

    // MÉTODOS ADICIONALES ÚTILES

    // Obtener solicitud por ID
    getById: async (solicitud_id) => {
        try {
            const res = await api.get(`/solicitudes/${solicitud_id}`, {
                headers: getAuthHeaders(),
            });
            return res.data;
        } catch (error) {
            console.error("Error al obtener solicitud:", error);
            throw error;
        }
    },

    // Obtener solo solicitudes pendientes
    getPending: async () => {
        try {
            const res = await api.get("/solicitudes/pendientes", {
                headers: getAuthHeaders(),
            });
            return res.data;
        } catch (error) {
            console.error("Error al obtener solicitudes pendientes:", error);
            throw error;
        }
    },

    // Obtener estadísticas
    getStats: async (filters = {}) => {
        try {
            const params = new URLSearchParams(filters);
            const res = await api.get(`/solicitudes/stats?${params}`, {
                headers: getAuthHeaders(),
            });
            return res.data;
        } catch (error) {
            console.error("Error al obtener estadísticas:", error);
            throw error;
        }
    },

    // Buscar solicitudes
    search: async (term) => {
        try {
            const res = await api.get(`/solicitudes/buscar?term=${encodeURIComponent(term)}`, {
                headers: getAuthHeaders(),
            });
            return res.data;
        } catch (error) {
            console.error("Error al buscar solicitudes:", error);
            throw error;
        }
    },

    // MÉTODO DE COMPATIBILIDAD (para no romper código existente)
    getByUser: async (usuario_id) => {
        console.warn("getByUser está obsoleto, usa getByCurrentUser() en su lugar");
        return await this.getByCurrentUser();
    }
};

export default requestService;