import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../../services/authService.js";
import { Link } from "react-router-dom";
import SuccessMessage from "./SuccessMessage";
import logo from "../../../assets/images/logo-2.png";
import {
  ExclamationCircleIcon,
  ArrowPathIcon,
  AtSymbolIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

// Componente para el formulario de login
const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const registerSuccess = localStorage.getItem("registroExitoso");
    if (registerSuccess === "true") {
      setSuccess("¡Registro exitoso!");
      setShowSuccess(true);
      localStorage.removeItem("registroExitoso");

      setTimeout(() => setShowSuccess(false), 2500);

      setTimeout(() => setSuccess(""), 3000);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await loginUser(email, password);
      if (!data) {
        setError("Credenciales incorrectas.");
        return;
      }

      const { token, usuario } = data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      localStorage.setItem("usuario_nombre", usuario.usuario_nombre);
      localStorage.setItem("usuario_apellido", usuario.usuario_apellido);
      localStorage.setItem("rol_id", usuario.rol_id);

      if (usuario.rol_id === 1) navigate("/admin/dashboard");
      else if (usuario.rol_id === 2) navigate("/propietario");
      else if (usuario.rol_id === 3) navigate("/empleado");
      else if (usuario.rol_id === 4) navigate("/cliente");
    } catch (error) {
      setError("Error al iniciar sesión. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
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
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-black/90 backdrop-blur-md rounded-3xl shadow-2xl px-10 py-10 border border-[#23262B]/60">
          {/* Logo y título */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-[#F5F5F5] mb-1">
                Bienvenido
              </h1>
              <p className="text-[#B0B3B8] text-lg">
                Inicie sesión en su cuenta
              </p>
            </div>
            <img
              src={logo}
              alt="Glaminder Logo"
              className="h-30 w-auto drop-shadow-lg"
            />
          </div>

          {/* Mensaje de éxito */}
          {success && <SuccessMessage show={showSuccess} message={success} />}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo de email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[#B0B3B8] mb-2"
              >
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AtSymbolIcon className="h-5 w-5 text-[#B0B3B8]" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="block w-full pl-10 pr-3 py-3 border border-[#31343A] rounded-xl bg-transparent text-[#F5F5F5] placeholder-[#B0B3B8] focus:outline-none focus:ring-2 focus:ring-[#D1A04D] focus:border-transparent transition-all duration-200"
                  placeholder="@gmail.com"
                />
              </div>
            </div>

            {/* Campo de contraseña */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-[#B0B3B8] mb-2"
              >
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-[#B0B3B8]" />
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-[#31343A] rounded-xl bg-transparent text-[#F5F5F5] placeholder-[#B0B3B8] focus:outline-none focus:ring-2 focus:ring-[#D1A04D] focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex gap-2">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-400 " />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full font-semibold py-3 px-6 rounded-xl bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-[#F5F5F5] hover:from-[#B47B1C] hover:to-[#D1A04D] focus:outline-none focus:ring-2 focus:ring-[#D1A04D] focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <ArrowPathIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Iniciando sesión...
                </div>
              ) : (
                "Iniciar sesión"
              )}
            </button>

            {/* Enlace de registro */}
            <div className="text-center pt-4">
              <p className="text-[#B0B3B8]">
                ¿No tienes una cuenta?{" "}
                <Link
                  to="/registrar"
                  className="font-semibold text-[#F5C76A] hover:text-[#D1A04D] transition-colors duration-200 underline decoration-2 underline-offset-2"
                >
                  Regístrese aquí
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 text-center pb-8 z-10">
        <p className="text-[#B0B3B8] text-sm drop-shadow-lg">
          © 2025 Glaminder. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
