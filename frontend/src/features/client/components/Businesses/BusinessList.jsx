import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AdminService from "../../../../services/adminService";
import {
  BuildingStorefrontIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  StarIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

const BusinessList = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadBusinesses = async () => {
      try {
        const data = await AdminService.fetchBusinesses();
        setBusinesses(data);
      } catch (error) {
        console.error("Error al cargar negocios:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBusinesses();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#D1A04D]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-0">
      {/* Header del Dashboard */}
      <div className="bg-black/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#F5F5F5] mb-2">
              Negocios Disponibles
            </h1>
            <p className="text-[#B0B3B8] text-sm sm:text-lg">
              Explora y agenda citas en los mejores negocios de belleza
            </p>
          </div>
          <Link
            to="/cliente/mis-citas"
            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white rounded-xl hover:from-[#B47B1C] hover:to-[#D1A04D] transition-all duration-500 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 text-sm sm:text-base whitespace-nowrap"
          >
            <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Mis Citas
          </Link>
        </div>
      </div>

      {/* Grid de negocios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {businesses.map((biz) => (
          <div
            key={biz.negocio_id}
            className="group bg-black/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-500 h-auto sm:h-[500px] flex flex-col"
          >
            {/* Imagen placeholder */}
            <div className="relative h-40 sm:h-48 bg-gradient-to-br from-[#D1A04D]/20 to-[#B47B1C]/20 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-2xl flex items-center justify-center shadow-lg">
                  <BuildingStorefrontIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              </div>
              {/* Overlay para efecto hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* Contenido de la tarjeta */}
            <div className="p-4 sm:p-6 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#F5F5F5] mb-2 group-hover:text-[#D1A04D] transition-colors duration-500 line-clamp-2">
                  {biz.negocio_nombre}
                </h3>
                <p className="text-[#B0B3B8] text-xs sm:text-sm leading-relaxed line-clamp-2">
                  {biz.negocio_descripcion ||
                    "Descubre los mejores servicios de belleza en este establecimiento."}
                </p>

                {/* Información de contacto */}
                <div className="space-y-2 mt-4">
                  <div className="flex items-center text-[#B0B3B8] text-xs sm:text-sm">
                    <PhoneIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-[#D1A04D] flex-shrink-0" />
                    <span className="truncate">
                      {biz.negocio_telefono || "Sin teléfono"}
                    </span>
                  </div>
                  <div className="flex items-center text-[#B0B3B8] text-xs sm:text-sm">
                    <EnvelopeIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-[#D1A04D] flex-shrink-0" />
                    <span className="truncate">
                      {biz.negocio_correo || "Sin email"}
                    </span>
                  </div>
                  <div className="flex items-center text-[#B0B3B8] text-xs">
                    <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-[#D1A04D] flex-shrink-0" />
                    <span>
                      Reg:{" "}
                      {new Date(
                        biz.negocio_fecha_registro
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Rating placeholder */}
                <div className="flex items-center mt-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className="w-3 h-3 sm:w-4 sm:h-4 text-[#D1A04D] fill-current"
                      />
                    ))}
                  </div>
                  <span className="text-[#B0B3B8] text-xs sm:text-sm ml-2">(4.8)</span>
                </div>
              </div>

              {/* Botón de acción - Siempre en la parte inferior */}
              <button
                onClick={() => navigate(`/cliente/negocios/${biz.negocio_id}`)}
                className="mt-4 sm:mt-6 w-full bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white font-semibold py-2 sm:py-3 px-4 rounded-xl hover:from-[#B47B1C] hover:to-[#D1A04D] transition-all duration-500 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 text-sm sm:text-base"
              >
                Ver Negocio
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Estado vacío */}
      {businesses.length === 0 && (
        <div className="text-center py-12 sm:py-16">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <BuildingStorefrontIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h3 className="text-base sm:text-lg font-medium text-[#F5F5F5] mb-2">
            No hay negocios disponibles
          </h3>
          <p className="text-[#B0B3B8] text-sm sm:text-base">
            Pronto tendremos más opciones para ti
          </p>
        </div>
      )}
    </div>
  );
};

export default BusinessList;