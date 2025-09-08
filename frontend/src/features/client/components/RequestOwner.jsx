import { useState } from "react";
import logo from "../../../assets/images/logo-2.png";
import {
  ArrowPathIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/solid";
import { requestOwner } from "../../../services/clientService.js";

const RequestOwner = () => {
  const [business, setBusiness] = useState({
    nombre_negocio: "",
    direccion_negocio: "",
    telefono_negocio: "",
    correo_negocio: "",
    descripcion_negocio: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setBusiness({
      ...business,
      [e.target.name]: e.target.value,
    });
  };

  const sendRequest = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess("");
    setError("");

    try {
      const token = localStorage.getItem("token");
      const data = await requestOwner(business, token);

      if (data) {
        setSuccess("¡Solicitud enviada! Un administrador lo revisará.");
        setBusiness({
          nombre_negocio: "",
          direccion_negocio: "",
          telefono_negocio: "",
          correo_negocio: "",
          descripcion_negocio: "",
        });
      } else {
        setError("No se pudo enviar la solicitud. Intenta nuevamente.");
      }
    } catch (err) {
      console.error("Error al enviar solicitud:", err);
      setError("Ocurrió un error en el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#1A1A1A] via-[#23262B] to-[#1F1F1F] flex items-center justify-center min-h-screen">
      <div className="w-full max-w-lg">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <img
            src={logo}
            alt="Glaminder Logo"
            className="h-32 mx-auto drop-shadow-lg"
          />
          <h1 className="text-3xl font-bold text-[#F5F5F5] mb-2">
            Panel de Cliente
          </h1>
          <p className="text-[#B0B3B8]">Solicita convertirte en propietario</p>
        </div>

        {/* Mensajes */}
        {success && (
          <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4 mb-6 text-green-400 backdrop-blur-sm">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 mb-6 text-red-400 backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form
          onSubmit={sendRequest}
          className="bg-[#23262B]/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-[#31343A]/50 space-y-6"
        >
          <div>
            <label className="block text-sm font-semibold text-[#F5F5F5] mb-3">
              Nombre del negocio
            </label>
            <input
              type="text"
              name="nombre_negocio"
              value={business.nombre_negocio}
              onChange={handleChange}
              required
              className="w-full border border-[#31343A] rounded-xl p-4 bg-[#1F1F1F]/50 text-[#F5F5F5] placeholder-[#B0B3B8] focus:outline-none focus:ring-2 focus:ring-[#D1A04D] focus:border-[#D1A04D] transition-all duration-300"
              placeholder="Ingresa el nombre de tu negocio"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#F5F5F5] mb-3">
              Dirección
            </label>
            <input
              type="text"
              name="direccion_negocio"
              value={business.direccion_negocio}
              onChange={handleChange}
              required
              className="w-full border border-[#31343A] rounded-xl p-4 bg-[#1F1F1F]/50 text-[#F5F5F5] placeholder-[#B0B3B8] focus:outline-none focus:ring-2 focus:ring-[#D1A04D] focus:border-[#D1A04D] transition-all duration-300"
              placeholder="Ingresa la dirección de tu negocio"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#F5F5F5] mb-3">
              Teléfono
            </label>
            <input
              type="text"
              name="telefono_negocio"
              value={business.telefono_negocio}
              onChange={handleChange}
              className="w-full border border-[#31343A] rounded-xl p-4 bg-[#1F1F1F]/50 text-[#F5F5F5] placeholder-[#B0B3B8] focus:outline-none focus:ring-2 focus:ring-[#D1A04D] focus:border-[#D1A04D] transition-all duration-300"
              placeholder="Ingresa el teléfono de contacto"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#F5F5F5] mb-3">
              Correo del negocio
            </label>
            <input
              type="email"
              name="correo_negocio"
              value={business.correo_negocio}
              onChange={handleChange}
              className="w-full border border-[#31343A] rounded-xl p-4 bg-[#1F1F1F]/50 text-[#F5F5F5] placeholder-[#B0B3B8] focus:outline-none focus:ring-2 focus:ring-[#D1A04D] focus:border-[#D1A04D] transition-all duration-300"
              placeholder="Ingresa el correo del negocio"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#F5F5F5] mb-3">
              Descripción
            </label>
            <textarea
              name="descripcion_negocio"
              value={business.descripcion_negocio}
              onChange={handleChange}
              rows="4"
              className="w-full border border-[#31343A] rounded-xl p-4 bg-[#1F1F1F]/50 text-[#F5F5F5] placeholder-[#B0B3B8] focus:outline-none focus:ring-2 focus:ring-[#D1A04D] focus:border-[#D1A04D] transition-all duration-300 resize-none"
              placeholder="Describe tu negocio y los servicios que ofreces"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white font-semibold py-4 px-6 rounded-xl hover:from-[#B47B1C] hover:to-[#D1A04D] focus:outline-none focus:ring-2 focus:ring-[#D1A04D] focus:ring-offset-2 focus:ring-offset-[#23262B] transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <ArrowPathIcon className="animate-spin h-5 w-5" />
                Enviando solicitud...
              </>
            ) : (
              <>
                <BuildingStorefrontIcon className="h-5 w-5" />
                Solicitar cuenta de propietario
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestOwner;
