import { useEffect, useState } from "react";
import {
  BuildingStorefrontIcon,
  StarIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import AdminService from "../../../../services/adminService.js";

// Componente para mostrar los negocios con más calificaciones
const TopBusinesses = () => {
  const [negocios, setNegocios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopBusinesses = async () => {
      try {
        const data = await AdminService.fetchTopBusiness();
        console.log("Negocios recibidos:", data);
        setNegocios(data);
      } catch (error) {
        console.error("Error al cargar los mejores negocios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopBusinesses();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#23262B]/80 backdrop-blur-md rounded-xl p-6 border border-[#31343A]/50">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#D1A04D]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#23262B]/80 backdrop-blur-md rounded-xl shadow-lg border border-[#31343A]/50">
      <div className="p-6 border-b border-[#31343A]/50">
        <h2 className="text-xl font-semibold text-[#F5F5F5] flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-lg flex items-center justify-center shadow-lg">
            <BuildingStorefrontIcon className="w-6 h-6 text-white" />
          </div>
          Mejores Negocios del Mes
        </h2>
      </div>
      <div className="p-6">
        {negocios.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[#B0B3B8]">
              No hay negocios con calificaciones aún
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {negocios.map((n, index) => (
              <li
                key={n.negocio_id}
                className="p-4 bg-[#1F1F1F]/50 backdrop-blur-sm rounded-lg hover:bg-[#1F1F1F]/70 transition-all duration-300 border border-[#31343A]/30 hover:border-[#D1A04D]/30"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-full flex items-center justify-center shadow-md text-white font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#F5F5F5] mb-1">
                        {n.negocio_nombre}
                      </h3>
                      <p className="text-sm text-[#B0B3B8] line-clamp-2">
                        {n.negocio_descripcion}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-[#D1A04D]/10 px-3 py-1.5 rounded-lg border border-[#D1A04D]/30">
                    <StarIcon className="w-5 h-5 text-[#D1A04D] fill-[#D1A04D]" />
                    <span className="font-bold text-[#D1A04D]">
                      {parseFloat(n.promedio_calificacion).toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#31343A]/30">
                  <div className="flex items-center gap-4 text-sm text-[#B0B3B8]">
                    <span className="flex items-center gap-1">
                      <StarIcon className="w-4 h-4" />
                      {n.total_calificaciones} calificaciones
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPinIcon className="w-4 h-4" />
                      {n.total_tiendas} tiendas
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TopBusinesses;
