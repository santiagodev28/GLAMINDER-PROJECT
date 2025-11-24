import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  loginUser,
  resendVerificationEmail,
} from "../../../services/authService.js";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../../assets/images/logo-2.png";
import {
  ArrowPathIcon,
  AtSymbolIcon,
  LockClosedIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

// Componente para el formulario de login
const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    const registerSuccess = localStorage.getItem("registroExitoso");
    if (registerSuccess === "true") {
      toast.success(
        "¡Registro exitoso!",
        {
          position: "top-right",
          autoClose: 5000,
        }
      );
      localStorage.removeItem("registroExitoso");
    }
    // Resetear intentos cuando el componente se monta
    setAttemptsRemaining(3);
  }, []);

  // Resetear intentos cuando cambia el email (nuevo intento con diferente usuario)
  useEffect(() => {
    if (email) {
      setAttemptsRemaining(3);
    }
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevenir propagación del evento

    setIsLoading(true);

    try {
      const data = await loginUser(email, password);

      // Si hay error (incluyendo email no verificado)
      if (data.error || !data) {
        // Si el email no está verificado, mostrar opción para reenviar
        if (data.email_verificado === false) {
          toast.error(
            "Por favor verifica tu correo electrónico antes de iniciar sesión.",
            {
              position: "top-right",
              autoClose: 6000,
            }
          );
          setShowResendVerification(true);
          setResendEmail(email);
          // No decrementar intentos si el email no está verificado
        } else if (data.rateLimited) {
          // Manejar rate limiting específicamente
          toast.error(
            `⚠️ ${
              data.message ||
              "Demasiados intentos. Por favor espera 15 minutos."
            }`,
            {
              position: "top-right",
              autoClose: 10000,
            }
          );
          setAttemptsRemaining(0);
        } else {
          // Decrementar intentos restantes
          const newAttempts = attemptsRemaining > 0 ? attemptsRemaining - 1 : 0;
          setAttemptsRemaining(newAttempts);

          if (newAttempts > 0) {
            toast.error(
              `❌ Credenciales incorrectas. Te quedan ${newAttempts} intento${
                newAttempts > 1 ? "s" : ""
              } de 3.`,
              {
                position: "top-right",
                autoClose: 5000,
              }
            );
          } else {
            toast.error(
              "❌ Has agotado tus 3 intentos. Por favor espera 15 minutos antes de intentar de nuevo.",
              {
                position: "top-right",
                autoClose: 8000,
              }
            );
          }
        }
        return;
      }

      // Si todo está bien, resetear intentos y mostrar éxito
      setAttemptsRemaining(3);
      toast.success("¡Inicio de sesión exitoso!", {
        position: "top-right",
        autoClose: 2000,
      });

      const { usuario } = data;
      if (usuario) {
        setTimeout(() => {
          if (usuario.rol_id === 1) navigate("/admin/dashboard");
          else if (usuario.rol_id === 2) navigate("/propietario");
          else if (usuario.rol_id === 3) navigate("/empleado");
          else if (usuario.rol_id === 4) navigate("/cliente");
        }, 500);
      }
    } catch (error) {
      console.error("Error en handleSubmit:", error);
      toast.error("Error al iniciar sesión. Inténtalo de nuevo.", {
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
              <div className="mt-2 text-center">
                {/* Enlace de olvido de contraseña */}
                <Link
                  to="/olvide-contrasena"
                  className="text-sm text-[#F5C76A] hover:text-[#D1A04D] transition-colors duration-200 underline decoration-2 underline-offset-2"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            {/* Indicador de intentos restantes */}
            {attemptsRemaining < 3 && attemptsRemaining > 0 && (
              <div className="bg-yellow-50/10 border border-yellow-500/30 rounded-xl p-3">
                <p className="text-sm text-yellow-300 text-center">
                  Te quedan {attemptsRemaining} intento
                  {attemptsRemaining > 1 ? "s" : ""} de 3
                </p>
              </div>
            )}

            {attemptsRemaining === 0 && (
              <div className="bg-red-50/10 border border-red-500/30 rounded-xl p-3">
                <p className="text-sm text-red-300 text-center">
                  Has agotado tus 3 intentos. Por favor espera 15 minutos antes
                  de intentar de nuevo.
                </p>
              </div>
            )}

            {/* Opción para reenviar verificación */}
            {showResendVerification && (
              <div className="bg-blue-50/10 border border-blue-500/30 rounded-xl p-4">
                <div className="flex flex-col gap-3">
                  <p className="text-sm text-blue-300">
                    ¿No recibiste el correo de verificación?
                  </p>
                  <button
                    type="button"
                    onClick={async () => {
                      setIsResending(true);
                      const result = await resendVerificationEmail(resendEmail);
                      if (result.ok) {
                        toast.success(
                          "Correo de verificación reenviado. Por favor revisa tu bandeja de entrada.",
                          {
                            position: "top-right",
                            autoClose: 5000,
                          }
                        );
                        setShowResendVerification(false);
                      } else {
                        toast.error(
                          result.message || "Error al reenviar correo",
                          {
                            position: "top-right",
                            autoClose: 5000,
                          }
                        );
                      }
                      setIsResending(false);
                    }}
                    disabled={isResending}
                    className="flex items-center justify-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <EnvelopeIcon className="h-4 w-4" />
                    {isResending
                      ? "Reenviando..."
                      : "Reenviar correo de verificación"}
                  </button>
                </div>
              </div>
            )}

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={isLoading || attemptsRemaining === 0}
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
