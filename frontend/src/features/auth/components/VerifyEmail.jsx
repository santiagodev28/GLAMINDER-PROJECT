import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { verifyEmail, resendVerificationEmail } from "../../../services/authService.js";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  EnvelopeIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import logo from "../../../assets/images/logo-2.png";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [resending, setResending] = useState(false);
  const hasVerifiedRef = useRef(false); // Ref para evitar múltiples verificaciones

  useEffect(() => {
    // Solo verificar una vez si hay token y no se ha verificado aún
    if (token && !hasVerifiedRef.current && status === "verifying") {
      console.log('[VerifyEmail] Token recibido de useParams:', token ? token.substring(0, 8) + '...' : 'null');
      
      hasVerifiedRef.current = true; // Marcar como verificado inmediatamente para evitar múltiples llamadas

      const verify = async () => {
        try {
          const result = await verifyEmail(token);
          if (result.ok) {
            setStatus("success");
            setMessage(result.message || "Email verificado exitosamente");
            setTimeout(() => {
              navigate("/ingresar");
            }, 3000);
          } else {
            setStatus("error");
            setMessage(result.message || "Error al verificar email");
          }
        } catch (error) {
          console.error('[VerifyEmail] Error:', error);
          setStatus("error");
          setMessage("Error al verificar email. Por favor intenta de nuevo.");
        }
      };

      verify();
    } else if (!token) {
      setStatus("error");
      setMessage("Token de verificación no proporcionado.");
    }
  }, [token, status, navigate]);

  const handleResend = async () => {
    if (!email) {
      setMessage("Por favor ingresa tu correo electrónico");
      return;
    }

    setResending(true);
    setMessage("");

    try {
      const result = await resendVerificationEmail(email);
      if (result.ok) {
        setMessage("Correo de verificación reenviado. Por favor revisa tu bandeja de entrada.");
        setStatus("success");
      } else {
        setMessage(result.message || "Error al reenviar correo");
      }
    } catch (error) {
      setMessage("Error al reenviar correo. Por favor intenta de nuevo.");
    } finally {
      setResending(false);
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

      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Contenido */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-black/90 backdrop-blur-md rounded-3xl shadow-2xl px-10 py-10 border border-[#23262B]/60">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src={logo}
              alt="Glaminder Logo"
              className="h-24 w-auto drop-shadow-lg"
            />
          </div>

          {/* Estado: Verificando */}
          {status === "verifying" && (
            <div className="text-center">
              <ArrowPathIcon className="h-16 w-16 text-[#D1A04D] mx-auto mb-4 animate-spin" />
              <h2 className="text-2xl font-bold text-[#F5F5F5] mb-2">
                Verificando email...
              </h2>
              <p className="text-[#B0B3B8]">
                Por favor espera mientras verificamos tu correo electrónico.
              </p>
            </div>
          )}

          {/* Estado: Éxito */}
          {status === "success" && (
            <div className="text-center">
              <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#F5F5F5] mb-2">
                ¡Email verificado!
              </h2>
              <p className="text-[#B0B3B8] mb-6">{message}</p>
              <p className="text-sm text-[#B0B3B8]">
                Redirigiendo al login en 3 segundos...
              </p>
              <Link
                to="/ingresar"
                className="mt-4 inline-block text-[#D1A04D] hover:text-[#F5C76A] transition-colors"
              >
                Ir al login ahora
              </Link>
            </div>
          )}

          {/* Estado: Error */}
          {status === "error" && (
            <div className="text-center">
              <ExclamationCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#F5F5F5] mb-2">
                Error al verificar
              </h2>
              <p className="text-[#B0B3B8] mb-6">{message}</p>

              {/* Formulario para reenviar */}
              <div className="mt-6 space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-[#B0B3B8] mb-2"
                  >
                    Ingresa tu correo para reenviar el enlace
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-[#B0B3B8]" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-[#31343A] rounded-xl bg-transparent text-[#F5F5F5] placeholder-[#B0B3B8] focus:outline-none focus:ring-2 focus:ring-[#D1A04D] focus:border-transparent"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="w-full font-semibold py-3 px-6 rounded-xl bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-[#F5F5F5] hover:from-[#B47B1C] hover:to-[#D1A04D] focus:outline-none focus:ring-2 focus:ring-[#D1A04D] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resending ? (
                    <div className="flex items-center justify-center">
                      <ArrowPathIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                      Reenviando...
                    </div>
                  ) : (
                    "Reenviar correo de verificación"
                  )}
                </button>
              </div>

              <div className="mt-6 text-center">
                <Link
                  to="/ingresar"
                  className="text-[#D1A04D] hover:text-[#F5C76A] transition-colors underline"
                >
                  Volver al login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;

