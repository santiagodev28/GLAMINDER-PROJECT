import { useState, useEffect } from "react";
import {
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  LockClosedIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import api from "../../api/api";

const EditProfileModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    usuario_nombre: "",
    usuario_apellido: "",
    usuario_correo: "",
    usuario_telefono: "",
    usuario_contrasena: "",
    confirmar_contrasena: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Cargar datos del usuario actual
  useEffect(() => {
    if (isOpen) {
      loadCurrentUser();
      setSuccessMessage("");
      setErrors({});
    }
  }, [isOpen]);

  const loadCurrentUser = async () => {
    try {
      const userData = localStorage.getItem("usuario");

      if (userData) {
        const parsedUser = JSON.parse(userData);
        setFormData({
          usuario_nombre: parsedUser.usuario_nombre || "",
          usuario_apellido: parsedUser.usuario_apellido || "",
          usuario_correo: parsedUser.usuario_correo || "",
          usuario_telefono: parsedUser.usuario_telefono || "",
          usuario_contrasena: "",
          confirmar_contrasena: "",
        });
      }
    } catch (error) {
      console.error("Error al cargar datos del usuario:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.usuario_nombre.trim()) {
      newErrors.usuario_nombre = "El nombre es requerido";
    }

    if (!formData.usuario_apellido.trim()) {
      newErrors.usuario_apellido = "El apellido es requerido";
    }

    if (!formData.usuario_correo.trim()) {
      newErrors.usuario_correo = "El correo es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.usuario_correo)) {
      newErrors.usuario_correo = "El correo no es válido";
    }

    if (formData.usuario_contrasena && formData.usuario_contrasena.length < 6) {
      newErrors.usuario_contrasena =
        "La contraseña debe tener al menos 6 caracteres";
    }

    if (formData.usuario_contrasena !== formData.confirmar_contrasena) {
      newErrors.confirmar_contrasena = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccessMessage("");
    
    try {
      const token = localStorage.getItem("token");
      const userData = JSON.parse(localStorage.getItem("usuario"));

      // Preparar datos para enviar (solo incluir contraseña si se proporciona)
      const updateData = {
        usuario_nombre: formData.usuario_nombre,
        usuario_apellido: formData.usuario_apellido,
        usuario_correo: formData.usuario_correo,
        usuario_telefono: formData.usuario_telefono,
        rol_id: userData.rol_id, // Mantener el rol actual
      };

      // Solo incluir contraseña si se proporciona
      if (formData.usuario_contrasena) {
        updateData.usuario_contrasena = formData.usuario_contrasena;
      }

      const response = await api.put(
        `/usuarios/${userData.usuario_id}`,
        updateData,
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
          usuario_nombre: formData.usuario_nombre,
          usuario_apellido: formData.usuario_apellido,
          usuario_correo: formData.usuario_correo,
          usuario_telefono: formData.usuario_telefono,
        };
        localStorage.setItem("usuario", JSON.stringify(updatedUser));

        setSuccessMessage("Perfil actualizado exitosamente");
        
        // Esperar un momento antes de cerrar para que el usuario vea el mensaje
        setTimeout(() => {
          onSave(updatedUser);
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      if (error.response?.data?.error) {
        setErrors({ general: error.response.data.error });
      } else {
        setErrors({ general: "Error al actualizar el perfil" });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#23262B] rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-[#31343A]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#31343A]">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] rounded-xl">
              <UserIcon className="h-6 w-6 text-[#F5F5F5]" />
            </div>
            <h2 className="text-2xl font-bold text-[#F5F5F5]">
              Editar Perfil
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#31343A] rounded-lg transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-[#B0B3B8]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Mensaje de éxito */}
          {successMessage && (
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center space-x-3">
              <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
              <p className="text-sm text-green-400">{successMessage}</p>
            </div>
          )}

          {/* Error general */}
          {errors.general && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center space-x-3">
              <ExclamationCircleIcon className="h-5 w-5 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-400">{errors.general}</p>
            </div>
          )}

          {/* Nombre */}
          <div>
            <label className="block text-sm font-semibold text-[#B0B3B8] mb-2">
              Nombre *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-[#B0B3B8]" />
              </div>
              <input
                type="text"
                name="usuario_nombre"
                value={formData.usuario_nombre}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-3 border rounded-xl bg-transparent text-[#F5F5F5] placeholder-[#B0B3B8] focus:outline-none focus:ring-2 focus:ring-[#D1A04D] focus:border-transparent transition-all duration-200 ${
                  errors.usuario_nombre ? "border-red-500/50" : "border-[#31343A]"
                }`}
                placeholder="Ingresa tu nombre"
              />
            </div>
            {errors.usuario_nombre && (
              <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                <ExclamationCircleIcon className="h-4 w-4" />
                <span>{errors.usuario_nombre}</span>
              </p>
            )}
          </div>

          {/* Apellido */}
          <div>
            <label className="block text-sm font-semibold text-[#B0B3B8] mb-2">
              Apellido *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-[#B0B3B8]" />
              </div>
              <input
                type="text"
                name="usuario_apellido"
                value={formData.usuario_apellido}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-3 border rounded-xl bg-transparent text-[#F5F5F5] placeholder-[#B0B3B8] focus:outline-none focus:ring-2 focus:ring-[#D1A04D] focus:border-transparent transition-all duration-200 ${
                  errors.usuario_apellido ? "border-red-500/50" : "border-[#31343A]"
                }`}
                placeholder="Ingresa tu apellido"
              />
            </div>
            {errors.usuario_apellido && (
              <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                <ExclamationCircleIcon className="h-4 w-4" />
                <span>{errors.usuario_apellido}</span>
              </p>
            )}
          </div>

          {/* Correo */}
          <div>
            <label className="block text-sm font-semibold text-[#B0B3B8] mb-2">
              Correo Electrónico *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon className="h-5 w-5 text-[#B0B3B8]" />
              </div>
              <input
                type="email"
                name="usuario_correo"
                value={formData.usuario_correo}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-3 border rounded-xl bg-transparent text-[#F5F5F5] placeholder-[#B0B3B8] focus:outline-none focus:ring-2 focus:ring-[#D1A04D] focus:border-transparent transition-all duration-200 ${
                  errors.usuario_correo ? "border-red-500/50" : "border-[#31343A]"
                }`}
                placeholder="correo@ejemplo.com"
              />
            </div>
            {errors.usuario_correo && (
              <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                <ExclamationCircleIcon className="h-4 w-4" />
                <span>{errors.usuario_correo}</span>
              </p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-semibold text-[#B0B3B8] mb-2">
              Teléfono
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PhoneIcon className="h-5 w-5 text-[#B0B3B8]" />
              </div>
              <input
                type="tel"
                name="usuario_telefono"
                value={formData.usuario_telefono}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-[#31343A] rounded-xl bg-transparent text-[#F5F5F5] placeholder-[#B0B3B8] focus:outline-none focus:ring-2 focus:ring-[#D1A04D] focus:border-transparent transition-all duration-200"
                placeholder="Número de teléfono"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#31343A] pt-4">
            <p className="text-sm text-[#B0B3B8] mb-4">
              Cambiar contraseña (opcional)
            </p>
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-semibold text-[#B0B3B8] mb-2">
              Nueva Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-[#B0B3B8]" />
              </div>
              <input
                type="password"
                name="usuario_contrasena"
                value={formData.usuario_contrasena}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-3 border rounded-xl bg-transparent text-[#F5F5F5] placeholder-[#B0B3B8] focus:outline-none focus:ring-2 focus:ring-[#D1A04D] focus:border-transparent transition-all duration-200 ${
                  errors.usuario_contrasena ? "border-red-500/50" : "border-[#31343A]"
                }`}
                placeholder="Dejar vacío para no cambiar"
              />
            </div>
            {errors.usuario_contrasena && (
              <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                <ExclamationCircleIcon className="h-4 w-4" />
                <span>{errors.usuario_contrasena}</span>
              </p>
            )}
          </div>

          {/* Confirmar Contraseña */}
          {formData.usuario_contrasena && (
            <div>
              <label className="block text-sm font-semibold text-[#B0B3B8] mb-2">
                Confirmar Nueva Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-[#B0B3B8]" />
                </div>
                <input
                  type="password"
                  name="confirmar_contrasena"
                  value={formData.confirmar_contrasena}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl bg-transparent text-[#F5F5F5] placeholder-[#B0B3B8] focus:outline-none focus:ring-2 focus:ring-[#D1A04D] focus:border-transparent transition-all duration-200 ${
                    errors.confirmar_contrasena ? "border-red-500/50" : "border-[#31343A]"
                  }`}
                  placeholder="Confirma tu nueva contraseña"
                />
              </div>
              {errors.confirmar_contrasena && (
                <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                  <ExclamationCircleIcon className="h-4 w-4" />
                  <span>{errors.confirmar_contrasena}</span>
                </p>
              )}
            </div>
          )}

          {/* Botones */}
          <div className="flex space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-[#B0B3B8] bg-[#31343A] hover:bg-[#3A3D42] rounded-xl transition-colors font-semibold"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-[#F5F5F5] hover:from-[#B47B1C] hover:to-[#D1A04D] rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Guardando...</span>
                </div>
              ) : (
                "Guardar Cambios"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
