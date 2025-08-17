import api from "../api/api.js";

// Servicios para el login y registro

export const loginUser = async (email, password) => {
    try {
        const res = await api.post("/auth/ingresar", {
            usuario_correo: email,
            usuario_contrasena: password,
        });
        return res.data;
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        return null;
    }
};
 
export const registerUser = async (userData) => {
    try {
        const res = await api.post("/auth/registrar", userData);
        return { ok: true, message: res.data.message };
    } catch (error) {
        console.error("Registro fallido:", error);
        return {
            ok: false,
            message:
                error.response.data.message || "Error al registrar usuario",
        };
    }
};
