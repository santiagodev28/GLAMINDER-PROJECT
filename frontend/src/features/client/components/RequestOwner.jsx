import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../../assets/images/logo-2.png";
import {
  ArrowPathIcon,
  BuildingStorefrontIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { requestOwner } from "../../../services/clientService.js";

const RequestOwner = () => {
  const navigate = useNavigate();
  const [business, setBusiness] = useState({
    nombre_negocio: "",
    direccion_negocio: "",
    telefono_negocio: "",
    correo_negocio: "",
    descripcion_negocio: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setBusiness({
      ...business,
      [e.target.name]: e.target.value,
    });
  };

  const sendRequest = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const data = await requestOwner(business, token);

      if (data) {
        toast.success("¡Solicitud enviada! Un administrador lo revisará pronto.", {
          position: "top-right",
          autoClose: 3000,
        });
        setBusiness({
          nombre_negocio: "",
          direccion_negocio: "",
          telefono_negocio: "",
          correo_negocio: "",
          descripcion_negocio: "",
        });
        setTimeout(() => {
          navigate("/cliente/dashboard");
        }, 2000);
      } else {
        toast.error("No se pudo enviar la solicitud. Intenta nuevamente.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error("Error al enviar solicitud:", err);
      toast.error("Ocurrió un error en el servidor.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = () => {
    navigate(-1);
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6"
      onClick={handleBackdropClick}
    >
      {/* Modal */}
      <div
        className="bg-[#23262B] rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl border border-[#31343A] max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
        onClick={handleModalClick}
      >
        {/* Header Modal */}
        <div className="sticky top-0 flex items-center justify-between p-4 sm:p-6 border-b border-[#31343A] bg-[#23262B] z-10 gap-2">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="p-1.5 sm:p-2 bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] rounded-lg sm:rounded-xl flex-shrink-0">
              <BuildingStorefrontIcon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-xl font-bold text-[#F5F5F5] truncate">
                Solicitud de Propietario
              </h2>
              <p className="text-xs text-[#B0B3B8] hidden sm:block">Completa tu información</p>
            </div>
          </div>
          <button
            onClick={handleBackdropClick}
            className="p-1.5 sm:p-2 hover:bg-[#31343A] rounded-lg transition-colors flex-shrink-0"
          >
            <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6 text-[#B0B3B8]" />
          </button>
        </div>

        {/* Contenido Modal */}
        <div className="p-4 sm:p-6">
          <form onSubmit={sendRequest} className="space-y-3 sm:space-y-4">
            {/* Nombre del negocio */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#B0B3B8] mb-1.5 sm:mb-2 flex items-center gap-2">
                <BuildingOfficeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D1A04D] flex-shrink-0" />
                <span>Nombre del negocio</span>
                <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="nombre_negocio"
                  value={business.nombre_negocio}
                  onChange={handleChange}
                  required
                  className="block w-full px-2.5 sm:px-3 py-2 sm:py-3 border border-[#31343A] rounded-lg sm:rounded-xl bg-transparent text-[#F5F5F5] placeholder-[#B0B3B8] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D1A04D] focus:border-[#D1A04D] transition-all duration-200"
                  placeholder="Ej: Salón de Belleza Premium"
                />
              </div>
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#B0B3B8] mb-1.5 sm:mb-2 flex items-center gap-2">
                <MapPinIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D1A04D] flex-shrink-0" />
                <span>Dirección</span>
                <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="direccion_negocio"
                  value={business.direccion_negocio}
                  onChange={handleChange}
                  required
                  className="block w-full px-2.5 sm:px-3 py-2 sm:py-3 border border-[#31343A] rounded-lg sm:rounded-xl bg-transparent text-[#F5F5F5] placeholder-[#B0B3B8] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D1A04D] focus:border-[#D1A04D] transition-all duration-200"
                  placeholder="Ej: Calle Principal 123, Apartado 4B"
                />
              </div>
            </div>

            {/* Grid de Teléfono y Correo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {/* Teléfono */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[#B0B3B8] mb-1.5 sm:mb-2 flex items-center gap-2">
                  <PhoneIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D1A04D] flex-shrink-0" />
                  <span>Teléfono</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="telefono_negocio"
                    value={business.telefono_negocio}
                    onChange={handleChange}
                    className="block w-full px-2.5 sm:px-3 py-2 sm:py-3 border border-[#31343A] rounded-lg sm:rounded-xl bg-transparent text-[#F5F5F5] placeholder-[#B0B3B8] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D1A04D] focus:border-[#D1A04D] transition-all duration-200"
                    placeholder="Ej: 310-123-4567"
                  />
                </div>
              </div>

              {/* Correo */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[#B0B3B8] mb-1.5 sm:mb-2 flex items-center gap-2">
                  <EnvelopeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D1A04D] flex-shrink-0" />
                  <span>Correo del negocio</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="correo_negocio"
                    value={business.correo_negocio}
                    onChange={handleChange}
                    className="block w-full px-2.5 sm:px-3 py-2 sm:py-3 border border-[#31343A] rounded-lg sm:rounded-xl bg-transparent text-[#F5F5F5] placeholder-[#B0B3B8] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D1A04D] focus:border-[#D1A04D] transition-all duration-200"
                    placeholder="Ej: contacto@negocio.com"
                  />
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#B0B3B8] mb-1.5 sm:mb-2 flex items-center gap-2">
                <DocumentTextIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D1A04D] flex-shrink-0" />
                <span>Descripción del negocio</span>
                <span className="text-red-400">*</span>
              </label>
              <textarea
                name="descripcion_negocio"
                value={business.descripcion_negocio}
                onChange={handleChange}
                required
                rows="3"
                className="block w-full px-2.5 sm:px-3 py-2 sm:py-3 border border-[#31343A] rounded-lg sm:rounded-xl bg-transparent text-[#F5F5F5] placeholder-[#B0B3B8] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D1A04D] focus:border-[#D1A04D] transition-all duration-200 resize-none"
                placeholder="Describe tu negocio, servicios que ofreces, horarios, especialidades, etc."
              ></textarea>
              <p className="text-xs text-[#B0B3B8] mt-1 sm:mt-2">
                Mínimo 20 caracteres - Este texto ayudará a los administradores a revisar tu solicitud
              </p>
            </div>

            {/* Info */}
            <div className="p-2.5 sm:p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg sm:rounded-xl">
              <p className="text-xs sm:text-xs text-blue-300">
                💡 <span className="font-semibold">Nota:</span> Tu solicitud será revisada por nuestro equipo de administración. Nos pondremos en contacto pronto.
              </p>
            </div>

            {/* Botones */}
            <div className="flex gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-[#31343A]">
              <button
                type="button"
                onClick={handleBackdropClick}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-[#B0B3B8] bg-[#31343A] hover:bg-[#3A3D42] rounded-lg sm:rounded-xl transition-colors font-semibold text-xs sm:text-base"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-[#F5F5F5] hover:from-[#B47B1C] hover:to-[#D1A04D] rounded-lg sm:rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs sm:text-base"
              >
                {isLoading ? (
                  <>
                    <ArrowPathIcon className="animate-spin h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <BuildingStorefrontIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>Solicitar acceso</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestOwner;