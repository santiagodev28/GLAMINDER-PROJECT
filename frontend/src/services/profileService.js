import api from "../api/api.js";

// Servicio para manejar operaciones de perfil de usuario
class ProfileService {
  // Obtener información del usuario actual
  static async getCurrentUser() {
    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("usuario");

      if (!token || !userData) {
        throw new Error("No hay sesión activa");
      }

      const parsedUser = JSON.parse(userData);
      return parsedUser;
    } catch (error) {
      console.error("Error al obtener usuario actual:", error);
      throw error;
    }
  }

  // Actualizar perfil de usuario
  static async updateProfile(profileData) {
    try {
      const token = localStorage.getItem("token");
      const userData = JSON.parse(localStorage.getItem("usuario"));

      if (!token || !userData) {
        throw new Error("No hay sesión activa");
      }

      const response = await api.put(
        `/usuarios/${userData.usuario_id}`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Actualizar datos en localStorage
        const updatedUser = {
          ...userData,
          ...profileData,
        };
        localStorage.setItem("usuario", JSON.stringify(updatedUser));

        return {
          success: true,
          data: updatedUser,
          message: "Perfil actualizado exitosamente",
        };
      }

      throw new Error("Error al actualizar perfil");
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      throw error;
    }
  }

  // Obtener información actualizada del usuario desde el servidor
  static async refreshUserData() {
    try {
      const token = localStorage.getItem("token");
      const userData = JSON.parse(localStorage.getItem("usuario"));

      if (!token || !userData) {
        throw new Error("No hay sesión activa");
      }

      const response = await api.get(`/usuarios/${userData.usuario_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        // Actualizar datos en localStorage con la información del servidor
        localStorage.setItem("usuario", JSON.stringify(response.data));
        return response.data;
      }

      throw new Error("Error al obtener datos actualizados");
    } catch (error) {
      console.error("Error al refrescar datos de usuario:", error);
      throw error;
    }
  }

  // Validar datos del perfil
  static validateProfileData(data) {
    const errors = {};

    if (!data.usuario_nombre || !data.usuario_nombre.trim()) {
      errors.usuario_nombre = "El nombre es requerido";
    }

    if (!data.usuario_apellido || !data.usuario_apellido.trim()) {
      errors.usuario_apellido = "El apellido es requerido";
    }

    if (!data.usuario_correo || !data.usuario_correo.trim()) {
      errors.usuario_correo = "El correo es requerido";
    } else if (!/\S+@\S+\.\S+/.test(data.usuario_correo)) {
      errors.usuario_correo = "El correo no es válido";
    }

    if (data.usuario_contrasena && data.usuario_contrasena.length < 6) {
      errors.usuario_contrasena =
        "La contraseña debe tener al menos 6 caracteres";
    }

    if (data.usuario_contrasena !== data.confirmar_contrasena) {
      errors.confirmar_contrasena = "Las contraseñas no coinciden";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  // Obtener nombre completo del usuario
  static getFullName(user) {
    if (!user) return "Usuario";
    return (
      `${user.usuario_nombre || ""} ${user.usuario_apellido || ""}`.trim() ||
      "Usuario"
    );
  }

  // Obtener iniciales del usuario
  static getInitials(user) {
    if (!user) return "U";
    const firstName = user.usuario_nombre || "";
    const lastName = user.usuario_apellido || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";
  }

  // Obtener rol como texto
  static getRoleText(rolId) {
    const roles = {
      1: "Administrador",
      2: "Propietario",
      3: "Empleado",
      4: "Cliente",
    };
    return roles[rolId] || "Usuario";
  }
}

export default ProfileService;
