import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../../../services/authService.js";
import { toast } from "react-toastify";
import logo from "../../../assets/images/logo-2.png";
import { LockClosedIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);

  // Decodificar el token si viene codificado en la URL
  useEffect(() => {
    if (token) {
      try {
        // El token puede venir codificado, intentar decodificarlo
        const decodedToken = decodeURIComponent(token);
        // Si el token cambió, actualizar la URL (aunque esto no es necesario si el backend lo maneja)
      } catch (error) {
        console.error("Error al decodificar token:", error);
      }
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Validaciones básicas
    if (newPassword.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres.", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("Las contraseñas no coinciden.", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    setIsLoading(true);

    try {
      // Decodificar el token antes de enviarlo
      const decodedToken = token ? decodeURIComponent(token) : token;
      const result = await resetPassword(
        decodedToken,
        newPassword,
        confirmNewPassword
      );

      if (result.ok) {
        setPasswordReset(true);
        toast.success(
          result.message || "Contraseña restablecida exitosamente.",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          navigate("/ingresar");
        }, 2000);
      } else {
        toast.error(result.message || "Error al restablecer la contraseña.", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (err) {
      toast.error("Ocurrió un error inesperado. Inténtalo de nuevo.", {
        position: "top-right",
        autoClose: 5000,
      });
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
                Restablecer contraseña
              </h1>
              <p className="text-[#B0B3B8] text-lg">
                Ingresa tu nueva contraseña
              </p>
            </div>
            <img
              src={logo}
              alt="Glaminder Logo"
              className="h-30 w-auto drop-shadow-lg"
            />
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo de nueva contraseña */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-semibold text-[#B0B3B8] mb-2"
              >
                Nueva contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-[#B0B3B8]" />
                </div>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  autoFocus
                  className="block w-full pl-10 pr-3 py-3 border border-[#31343A] rounded-xl bg-transparent text-[#F5F5F5] placeholder-[#B0B3B8] focus:outline-none focus:ring-2 focus:ring-[#D1A04D] focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Campo de confirmar contraseña */}
            <div>
              <label
                htmlFor="confirmNewPassword"
                className="block text-sm font-semibold text-[#B0B3B8] mb-2"
              >
                Confirmar contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-[#B0B3B8]" />
                </div>
                <input
                  type="password"
                  id="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-[#31343A] rounded-xl bg-transparent text-[#F5F5F5] placeholder-[#B0B3B8] focus:outline-none focus:ring-2 focus:ring-[#D1A04D] focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Mensaje informativo después de restablecer */}
            {passwordReset && (
              <div className="bg-green-50/10 border border-green-500/30 rounded-xl p-4"></div>
            )}

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={isLoading || passwordReset}
              className="w-full font-semibold py-3 px-6 rounded-xl bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-[#F5F5F5] hover:from-[#B47B1C] hover:to-[#D1A04D] focus:outline-none focus:ring-2 focus:ring-[#D1A04D] focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <ArrowPathIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Restableciendo...
                </div>
              ) : passwordReset ? (
                "Redirigiendo al login..."
              ) : (
                "Restablecer contraseña"
              )}
            </button>

            {/* Enlace para regresar */}
            <div className="text-center pt-4">
              <p className="text-[#B0B3B8]">
                ¿Recordaste tu contraseña?{" "}
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

export default ResetPassword;
