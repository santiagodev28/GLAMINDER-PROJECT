import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../../services/authService.js";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
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
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    aceptaTerminos: false,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const regex = {
    name: /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]{3,40}$/,
    email: /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/,
    phone: /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/,
    password:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/,
  };

  // Validar un campo específico
  const validateField = (field, value) => {
    let errorMsg = "";

    switch (field) {
      case "name":
        if (!value.trim()) {
          errorMsg = "El nombre es requerido";
        } else if (!regex.name.test(value)) {
          errorMsg = "Nombre inválido (Mínimo 3 letras, solo letras)";
        }
        break;

      case "lastName":
        if (!value.trim()) {
          errorMsg = "El apellido es requerido";
        } else if (!regex.name.test(value)) {
          errorMsg = "Apellido inválido (Mínimo 3 letras, solo letras)";
        }
        break;

      case "email":
        if (!value.trim()) {
          errorMsg = "El correo es requerido";
        } else if (!regex.email.test(value)) {
          errorMsg = "Correo inválido (ejemplo: usuario@dominio.com)";
        }
        break;

      case "phone":
        if (!value.trim()) {
          errorMsg = "El teléfono es requerido";
        } else if (!regex.phone.test(value)) {
          errorMsg = "Teléfono inválido (Formato: 300-000-0000)";
        }
        break;

      case "password":
        if (!value.trim()) {
          errorMsg = "La contraseña es requerida";
        } else if (value.length < 8) {
          errorMsg = "La contraseña debe tener al menos 8 caracteres";
        } else if (!regex.password.test(value)) {
          errorMsg =
            "Debe incluir mayúscula, minúscula, número y símbolo (@$!%*?&)";
        }
        break;

      case "confirmPassword":
        if (!value.trim()) {
          errorMsg = "Confirma tu contraseña";
        } else if (value !== formData.password) {
          errorMsg = "Las contraseñas no coinciden";
        }
        break;

      case "aceptaTerminos":
        if (!value) {
          errorMsg = "Debes aceptar los términos y condiciones";
        }
        break;

      default:
        break;
    }

    return errorMsg;
  };

  // Validar todos los campos
  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach((field) => {
      const errorMsg = validateField(field, formData[field]);
      if (errorMsg) {
        newErrors[field] = errorMsg;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Formatear teléfono automáticamente (300-000-0000)
  const formatPhone = (value) => {
    // Remover todo excepto números
    const numbers = value.replace(/\D/g, '');
    
    // Limitar a 10 dígitos
    const limitedNumbers = numbers.slice(0, 10);
    
    // Aplicar formato 300-000-0000
    if (limitedNumbers.length <= 3) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 6) {
      return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3)}`;
    } else {
      return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3, 6)}-${limitedNumbers.slice(6)}`;
    }
  };

  // Manejar cambios en los campos
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    let fieldValue = type === "checkbox" ? checked : value;

    // Formatear teléfono automáticamente
    if (id === "phone" && type !== "checkbox") {
      fieldValue = formatPhone(value);
    }

    setFormData((prev) => ({ ...prev, [id]: fieldValue }));

    // Solo validar si el campo ha sido tocado
    if (touched[id]) {
      const errorMsg = validateField(id, fieldValue);
      setErrors((prev) => ({ ...prev, [id]: errorMsg }));
    }
  };

  // Manejar cuando un campo pierde el foco
  const handleBlur = (e) => {
    const { id } = e.target;

    setTouched((prev) => ({ ...prev, [id]: true }));

    const errorMsg = validateField(id, formData[id]);
    setErrors((prev) => ({ ...prev, [id]: errorMsg }));
  };

  // Limpiar errores cuando se cambia un campo
  const handleFocus = (e) => {
    const { id } = e.target;
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  // Validar contraseña en tiempo real
  useEffect(() => {
    if (touched.confirmPassword && formData.confirmPassword) {
      const errorMsg = validateField(
        "confirmPassword",
        formData.confirmPassword
      );
      setErrors((prev) => ({ ...prev, confirmPassword: errorMsg }));
    }
  }, [formData.password, formData.confirmPassword, touched.confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Marcar todos los campos como tocados
    const allTouched = {};
    Object.keys(formData).forEach((field) => {
      allTouched[field] = true;
    });
    setTouched(allTouched);

    // Validar formulario
    if (!validateForm()) {
      toast.error("Por favor corrige los errores en el formulario.", {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await registerUser({
        usuario_nombre: formData.name,
        usuario_apellido: formData.lastName,
        usuario_correo: formData.email,
        usuario_contrasena: formData.password,
        usuario_telefono: formData.phone,
        acepta_terminos: formData.aceptaTerminos,
      });

      if (res?.ok) {
        toast.success(
          res.message || 
          "Usuario registrado exitosamente. Por favor verifica tu correo electrónico antes de iniciar sesión.",
          {
            position: "top-right",
            autoClose: 6000,
          }
        );
        localStorage.setItem("registroExitoso", "true");
        localStorage.setItem("emailRegistrado", formData.email);
        setTimeout(() => navigate("/ingresar"), 3000);
      } else {
        toast.error(res?.message || "Error al registrar el usuario.", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      toast.error("Error al registrar el usuario. Inténtalo de nuevo.", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Función para obtener la clase del borde del input
  const getInputBorderClass = (fieldName) => {
    if (!touched[fieldName]) {
      return "border-[#31343A]";
    }
    if (errors[fieldName]) {
      return "border-red-500 focus:border-red-500 focus:ring-red-500";
    }
    return "border-green-500 focus:border-green-500 focus:ring-green-500";
  };

  // Función para mostrar el icono de estado
  const getStatusIcon = (fieldName) => {
    if (!touched[fieldName]) return null;

    if (errors[fieldName]) {
      return (
        <ExclamationCircleIcon className="h-5 w-5 text-red-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
      );
    }

    if (formData[fieldName] && !errors[fieldName]) {
      return (
        <CheckCircleIcon className="h-5 w-5 text-green-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-4">
      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/login.jpeg')`,
        }}
      />

      {/* Overlay oscuro para mejorar legibilidad */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Contenido del formulario */}
      <div className="relative z-10 max-w-2xl w-full px-4">
        {/* Logo y título */}
        <div className="text-center mb-4">
          <div className="flex justify-center">
            <img
              src={logo}
              alt="Glaminder Logo"
              className="h-20 w-auto drop-shadow-lg"
            />
          </div>
          <h1 className="text-3xl font-bold text-[#F5F5F5] mb-1">
            Crear cuenta
          </h1>
          <p className="text-[#B0B3B8] text-base">
            Únete a Glaminder y comienza tu experiencia
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-black/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 border border-[#23262B]/60">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campos de nombre y apellido en fila */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-[#B0B3B8] mb-2"
                >
                  Nombre *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-[#B0B3B8]" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    required
                    autoFocus
                    className={`block w-full pl-10 pr-10 py-2.5 text-base border rounded-lg bg-transparent text-[#F5F5F5] placeholder-[#B0B3B8] focus:outline-none focus:ring-2 focus:ring-[#D1A04D] focus:border-transparent transition-all duration-200 ${getInputBorderClass(
                      "name"
                    )}`}
                    placeholder="Ingresa tu nombre"
                  />
                  {getStatusIcon("name")}
                  {errors.name && touched.name && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-semibold text-[#B0B3B8] mb-2"
                >
                  Apellido *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-[#B0B3B8]" />
                  </div>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    required
                    className={`block w-full pl-10 pr-10 py-2.5 text-base border rounded-lg bg-transparent text-[#F5F5F5] placeholder-[#B0B3B8] focus:outline-none focus:ring-2 focus:ring-[#D1A04D] focus:border-transparent transition-all duration-200 ${getInputBorderClass(
                      "lastName"
                    )}`}
                    placeholder="Ingresa tu apellido"
                  />
                  {getStatusIcon("lastName")}
                  {errors.lastName && touched.lastName && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <ExclamationCircleIcon className="h-4 w-4 mr-1" />
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
                className="block text-sm font-semibold text-[#B0B3B8] mb-2"
              >
                Correo electrónico *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AtSymbolIcon className="h-5 w-5 text-[#B0B3B8]" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                  required
                  className={`block w-full pl-10 pr-10 py-2.5 text-base border rounded-lg bg-transparent text-[#F5F5F5] placeholder-[#B0B3B8] focus:outline-none focus:ring-2 focus:ring-[#D1A04D] focus:border-transparent transition-all duration-200 ${getInputBorderClass(
                    "email"
                  )}`}
                  placeholder="usuario@dominio.com"
                />
                {getStatusIcon("email")}
                {errors.email && touched.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Campo de teléfono */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-semibold text-[#B0B3B8] mb-2"
              >
                Teléfono *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PhoneIcon className="h-5 w-5 text-[#B0B3B8]" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                  required
                  maxLength={12}
                  className={`block w-full pl-10 pr-10 py-2.5 text-base border rounded-lg bg-transparent text-[#F5F5F5] placeholder-[#B0B3B8] focus:outline-none focus:ring-2 focus:ring-[#D1A04D] focus:border-transparent transition-all duration-200 ${getInputBorderClass(
                    "phone"
                  )}`}
                  placeholder="300-000-0000"
                />
                {getStatusIcon("phone")}
                {errors.phone && touched.phone && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Campos de contraseña en fila */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-[#B0B3B8] mb-2"
                >
                  Contraseña *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-[#B0B3B8]" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    required
                    className={`block w-full pl-10 pr-10 py-2.5 text-base border rounded-lg bg-transparent text-[#F5F5F5] placeholder-[#B0B3B8] focus:outline-none focus:ring-2 focus:ring-[#D1A04D] focus:border-transparent transition-all duration-200 ${getInputBorderClass(
                      "password"
                    )}`}
                    placeholder="Mínimo 8 caracteres"
                  />
                  {getStatusIcon("password")}
                  {errors.password && touched.password && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-[#B0B3B8] mb-2"
                >
                  Confirmar Contraseña *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-[#B0B3B8]" />
                  </div>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    required
                    className={`block w-full pl-10 pr-10 py-2.5 text-base border rounded-lg bg-transparent text-[#F5F5F5] placeholder-[#B0B3B8] focus:outline-none focus:ring-2 focus:ring-[#D1A04D] focus:border-transparent transition-all duration-200 ${getInputBorderClass(
                      "confirmPassword"
                    )}`}
                    placeholder="Repite tu contraseña"
                  />
                  {getStatusIcon("confirmPassword")}
                  {errors.confirmPassword && touched.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Checkbox de términos y condiciones */}
            <div>
              <div className="flex items-start">
                <div className="flex items-center h-5 mt-0.5">
                  <input
                    id="aceptaTerminos"
                    type="checkbox"
                    checked={formData.aceptaTerminos}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className="w-4 h-4 text-[#D1A04D] bg-transparent border-[#31343A] rounded focus:ring-[#D1A04D] focus:ring-2"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="aceptaTerminos"
                    className="text-[#B0B3B8] cursor-pointer leading-relaxed"
                  >
                    Acepto los{" "}
                    <Link
                      to="/terminos-condiciones"
                      target="_blank"
                      className="text-[#F5C76A] hover:text-[#D1A04D] underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      términos y condiciones
                    </Link>{" "}
                    y la{" "}
                    <Link
                      to="/politica-privacidad"
                      target="_blank"
                      className="text-[#F5C76A] hover:text-[#D1A04D] underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      política de privacidad
                    </Link>
                  </label>
                  {errors.aceptaTerminos && touched.aceptaTerminos && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                      {errors.aceptaTerminos}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={
                  isLoading || 
                  Object.keys(errors).some((key) => errors[key]) ||
                  !formData.aceptaTerminos
                }
                className="w-full bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-[#F5F5F5] font-semibold py-3 px-6 rounded-lg hover:from-[#B47B1C] hover:to-[#D1A04D] focus:outline-none focus:ring-2 focus:ring-[#D1A04D] focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl text-base"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                    Registrando...
                  </div>
                ) : (
                  "Crear cuenta"
                )}
              </button>
            </div>

            {/* Enlace de login */}
            <div className="text-center pt-2">
              <p className="text-[#B0B3B8] text-sm">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  to="/ingresar"
                  className="font-semibold text-[#F5C76A] hover:text-[#D1A04D] transition-colors duration-200 underline decoration-2 underline-offset-2"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-4">
          <p className="text-[#B0B3B8] text-sm drop-shadow-lg">
            © 2025 Glaminder. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
