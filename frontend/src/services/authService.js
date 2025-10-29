import api from "../api/api.js";
import { useNavigate } from "react-router-dom";

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

export const forgotPassword = async (email) => {
    try {
        const res = await api.post("/auth/olvide-contrasena", { usuario_correo: email });
        return { ok: true, message: res.data.message };
    } catch (error) {
        console.error("Error al enviar correo de restablecimiento:", error);
        return {
            ok: false,
            message:
                error.response.data.message || "Error al enviar correo de restablecimiento",
        };
    }
};

export const resetPassword = async (token, newPassword, confirmNewPassword) => {
    if (newPassword !== confirmNewPassword) {
        return { ok: false, message: "Las contraseñas no coinciden." };
    }
    try {
        const res = await api.post(`/auth/restablecer-contrasena/${token}`, {
            newPassword,
            confirmNewPassword,
        });
        return { ok: true, message: res.data.message };
    } catch (error) {
        console.error("Error al restablecer contraseña:", error);
        return {
            ok: false,
            message:
                error.response.data.message || "Error al restablecer contraseña",
        };
    }
};

function useAuth() {
  const navigate = useNavigate();

  const logout = () => {
    // Quitar el token del almacenamiento
    localStorage.removeItem("token");

    // limpiar info del usuario
    localStorage.removeItem("user");

    // Redirigir al login
    navigate("/");
  };

  return { logout };
}

export default useAuth;
