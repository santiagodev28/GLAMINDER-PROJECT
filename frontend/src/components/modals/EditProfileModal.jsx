import { useState, useEffect } from "react";
import {
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  LockClosedIcon,
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
  const [user, setUser] = useState(null);

  // Cargar datos del usuario actual
  useEffect(() => {
    if (isOpen) {
      loadCurrentUser();
    }
  }, [isOpen]);

  const loadCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("usuario");

      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
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

        onSave(updatedUser);
        onClose();
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Editar Perfil
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error general */}
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              name="usuario_nombre"
              value={formData.usuario_nombre}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.usuario_nombre ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Ingresa tu nombre"
            />
            {errors.usuario_nombre && (
              <p className="mt-1 text-sm text-red-600">
                {errors.usuario_nombre}
              </p>
            )}
          </div>

          {/* Apellido */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apellido *
            </label>
            <input
              type="text"
              name="usuario_apellido"
              value={formData.usuario_apellido}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.usuario_apellido ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Ingresa tu apellido"
            />
            {errors.usuario_apellido && (
              <p className="mt-1 text-sm text-red-600">
                {errors.usuario_apellido}
              </p>
            )}
          </div>

          {/* Correo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico *
            </label>
            <div className="relative">
              <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="usuario_correo"
                value={formData.usuario_correo}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.usuario_correo ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="correo@ejemplo.com"
              />
            </div>
            {errors.usuario_correo && (
              <p className="mt-1 text-sm text-red-600">
                {errors.usuario_correo}
              </p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <div className="relative">
              <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                name="usuario_telefono"
                value={formData.usuario_telefono}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Número de teléfono"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nueva Contraseña
            </label>
            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                name="usuario_contrasena"
                value={formData.usuario_contrasena}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.usuario_contrasena
                    ? "border-red-300"
                    : "border-gray-300"
                }`}
                placeholder="Dejar vacío para no cambiar"
              />
            </div>
            {errors.usuario_contrasena && (
              <p className="mt-1 text-sm text-red-600">
                {errors.usuario_contrasena}
              </p>
            )}
          </div>

          {/* Confirmar Contraseña */}
          {formData.usuario_contrasena && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Nueva Contraseña
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  name="confirmar_contrasena"
                  value={formData.confirmar_contrasena}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.confirmar_contrasena
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="Confirma tu nueva contraseña"
                />
              </div>
              {errors.confirmar_contrasena && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmar_contrasena}
                </p>
              )}
            </div>
          )}

          {/* Botones */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
