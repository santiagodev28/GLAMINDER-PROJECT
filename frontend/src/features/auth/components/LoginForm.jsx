import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../authService";
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
      localStorage.setItem("token", token);
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
    <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 flex items-center justify-center min-h-screen ">
      <div className="">
        {/* Logo y título */}
        <div className="text-center mb-2">
          <div className="flex justify-center">
            <img
              src={logo}
              alt="Glaminder Logo"
              className="h-40 w-auto drop-shadow-lg"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Bienvenido
          </h1>
          <p className="text-gray-600 text-lg">Inicia sesión en tu cuenta</p>
        </div>

        {/* Mensaje de éxito */}
        {success && <SuccessMessage show={showSuccess} message={success} />}

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            {/* Campo de contraseña */}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
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
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-yellow-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <ArrowPathIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"/>
                  Iniciando sesión...
                </div>
              ) : (
                "Iniciar sesión"
              )}
            </button>

            {/* Enlace de registro */}
            <div className="text-center pt-4">
              <p className="text-gray-600">
                ¿No tienes una cuenta?{" "}
                <Link
                  to="/registrar"
                  className="font-semibold text-yellow-600 hover:text-yellow-700 transition-colors duration-200 underline decoration-2 underline-offset-2"
                >
                  Regístrate aquí
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

export default LoginForm;
