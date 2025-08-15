import api from "../../../api/api";

const closeSession = async (token) => {
    try {
        const res = await api.post(
            "/auth/cerrarSesion",
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return res.data;
    } catch (error) {
        console.error("Error al cerrar la sesión:", error);
        return null;
    }
};
