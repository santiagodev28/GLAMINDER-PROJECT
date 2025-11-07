import api from "../api/api.js";

// Servicios para el login y registro

export const loginUser = async (email, password) => {
    try {
        const res = await api.post("/auth/ingresar", {
            usuario_correo: email,
            usuario_contrasena: password,
        });
        
        // Guardar tokens
        if (res.data.accessToken) {
            localStorage.setItem("token", res.data.accessToken);
        }
        if (res.data.refreshToken) {
            localStorage.setItem("refreshToken", res.data.refreshToken);
        }
        if (res.data.usuario) {
            localStorage.setItem("usuario", JSON.stringify(res.data.usuario));
            localStorage.setItem("usuario_nombre", res.data.usuario.usuario_nombre);
            localStorage.setItem("usuario_apellido", res.data.usuario.usuario_apellido);
            localStorage.setItem("rol_id", res.data.usuario.rol_id);
        }
        
        return res.data;
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        
        // Manejar error 429 (Rate Limit) específicamente
        if (error.response?.status === 429) {
            const errorMessage = error.response?.data?.message || 
                "⚠️ Has excedido el límite de 3 intentos. Por favor espera 15 minutos antes de intentar de nuevo.";
            return { 
                error: true, 
                message: errorMessage,
                rateLimited: true,
                retryAfter: error.response?.data?.retryAfter || 900 // 15 minutos en segundos
            };
        }
        
        // Manejar otros errores HTTP
        if (error.response) {
            const errorMessage = error.response?.data?.message || "Error al iniciar sesión";
            return { 
                error: true, 
                message: errorMessage,
                email_verificado: error.response?.data?.email_verificado
            };
        }
        
        // Error de red u otro error
        return { 
            error: true, 
            message: "Error de conexión. Por favor verifica tu internet e intenta de nuevo."
        };
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
                error.response?.data?.message || "Error al registrar usuario",
        };
    }
};

// Verificar email con token
export const verifyEmail = async (token) => {
    try {
        // El token ya viene decodificado de useParams, pero lo codificamos para la URL
        // para asegurar que caracteres especiales se manejen correctamente
        const encodedToken = encodeURIComponent(token);
        const res = await api.get(`/auth/verificar-email/${encodedToken}`);
        return { ok: true, message: res.data.message };
    } catch (error) {
        console.error("Error al verificar email:", error);
        return {
            ok: false,
            message: error.response?.data?.message || "Error al verificar email",
        };
    }
};

// Reenviar token de verificación
export const resendVerificationEmail = async (email) => {
    try {
        const res = await api.post("/auth/reenviar-verificacion", {
            usuario_correo: email,
        });
        return { ok: true, message: res.data.message };
    } catch (error) {
        console.error("Error al reenviar verificación:", error);
        return {
            ok: false,
            message: error.response?.data?.message || "Error al reenviar verificación",
        };
    }
};

// Refresh access token
export const refreshAccessToken = async () => {
    try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
            throw new Error("No hay refresh token disponible");
        }

        const res = await api.post("/auth/refresh-token", {
            refreshToken,
        });

        if (res.data.accessToken) {
            localStorage.setItem("token", res.data.accessToken);
            return { ok: true, accessToken: res.data.accessToken };
        }

        return { ok: false, message: "No se recibió nuevo token" };
    } catch (error) {
        console.error("Error al refrescar token:", error);
        // Si falla, limpiar tokens y forzar login
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        return {
            ok: false,
            message: error.response?.data?.message || "Error al refrescar token",
        };
    }
};

// Cerrar sesión
export const logout = async (logoutAll = false) => {
    try {
        const token = localStorage.getItem("token");
        const refreshToken = localStorage.getItem("refreshToken");

        if (token) {
            const endpoint = logoutAll 
                ? "/auth/cerrar-sesion-todos" 
                : "/auth/cerrar-sesion";
            
            await api.post(endpoint, { refreshToken }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        }
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        // Continuar con la limpieza local aunque falle el servidor
    } finally {
        // Limpiar tokens y datos del usuario
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("usuario");
        localStorage.removeItem("usuario_nombre");
        localStorage.removeItem("usuario_apellido");
        localStorage.removeItem("rol_id");
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

  const handleLogout = async (logoutAll = false) => {
    await logout(logoutAll);
    navigate("/");
  };

  return { logout: handleLogout };
}

export default useAuth;
