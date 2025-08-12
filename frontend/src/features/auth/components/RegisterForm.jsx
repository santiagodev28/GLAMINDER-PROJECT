import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../authService";
import { Link } from "react-router-dom";
import logo from "../../../assets/images/logo-2.png";
import {
  UserIcon,
  AtSymbolIcon,
  PhoneIcon,
  LockClosedIcon,
  UserGroupIcon,
  ChevronDownIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

// Componente para el formulario de registro
const RegisterForm = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rol, setRol] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const regex = {
    name: /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]{3,40}$/,
    email: /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/,
    phone: /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/,
    password:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/,
  };

  const validateFields = (field, value) => {
    let errorMsg = "";
    switch (field) {
      case "name":
        if (!regex.name.test(value)) {
          errorMsg = "Nombre inválido (Mínimo 3 letras)";
        }
        break;
      case "lastName":
        if (!regex.name.test(value)) {
          errorMsg = "Apellido inválido (Mínimo 3 letras)";
        }
        break;
      case "email":
        if (!regex.email.test(value)) {
          errorMsg = "Correo inválido (ejemplo: usuario@dominio.com)";
        }
        break;
      case "phone":
        if (!regex.phone.test(value)) {
          errorMsg = "Teléfono inválido (Formato: 300-000-0000)";
        }
        break;
      case "password":
        if (!regex.password.test(value)) {
          errorMsg = "Incluya minimo (A,a,1,@)";
        }
        break;
      case "confirmPassword":
        if (value !== formData.password) {
          errorMsg = "Las contraseñas no coinciden";
        }
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    validateFields(id, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    Object.keys(formData).forEach((field) =>
      validateFields(field, formData[field])
    );
    if (Object.values(errors).some(Boolean)) return;

    setIsLoading(false);
    try {
      const res = await registerUser({
        usuario_nombre: formData.name,
        usuario_apellido: formData.lastName,
        usuario_correo: formData.email,
        usuario_contrasena: formData.password,
        usuario_telefono: formData.phone,
      });

      if (res?.ok) {
        setSuccess(res.message || "Usuario registrado exitosamente.");
        localStorage.setItem("registroExitoso", "true");
        setTimeout(() => navigate("/ingresar"), 1000);
      } else {
        setError(res?.message || "Error al registrar el usuario.");
      }
    } catch (error) {
      setError("Error al registrar el usuario. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Logo y título */}
        <div className="text-center mb-4">
          <div className="flex justify-center">
            <img
              src={logo}
              alt="Glaminder Logo"
              className="h-32 w-auto drop-shadow-lg"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-1">
            Crear cuenta
          </h1>
          <p className="text-gray-600 text-lg">
            Únete a Glaminder y comienza tu experiencia
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campos de nombre y apellido en fila */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Nombre
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    autoFocus
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Ingresa tu nombre"
                  />

                  {errors.name && (
                    <p className="text-red-500 text-sm absolute">
                      {errors.name}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Apellido
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Ingresa tu apellido"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm absolute">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Campo de email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AtSymbolIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="usuario@dominio.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm absolute">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Campo de teléfono */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Teléfono
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="300-000-0000"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm absolute">
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Campos de contraseña en fila */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Mínimo 8 caracteres"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm absolute ">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Repite tu contraseña"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm absolute">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Mensajes de error y éxito */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-400 mr-2"/>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2"/>
                  <p className="text-sm text-green-600">{success}</p>
                </div>
              </div>
            )}

            {/* Botones */}
            <div className="space-y-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-yellow-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <ArrowPathIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"/>
                    Registrando...
                  </div>
                ) : (
                  "Crear cuenta"
                )}
              </button>
            </div>

            {/* Enlace de login */}
            <div className="text-center pt-2">
              <p className="text-gray-600">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  to="/ingresar"
                  className="font-semibold text-yellow-600 hover:text-yellow-700 transition-colors duration-200 underline decoration-2 underline-offset-2"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            © 2024 Glaminder. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
