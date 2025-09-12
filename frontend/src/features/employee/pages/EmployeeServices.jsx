import { useState, useEffect } from "react";
import {
  WrenchScrewdriverIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import EmployeeService from "../../../services/employeeService";

const EmployeeServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const employee = await EmployeeService.getEmployeeFromStorage();

      if (employee && employee.id) {
        const servicesData = await EmployeeService.getEmployeeServices(
          employee.id
        );
        setServices(servicesData);
      }
    } catch (error) {
      console.error("Error al cargar servicios:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0
        ? `${hours}h ${remainingMinutes}min`
        : `${hours}h`;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="bg-[#23262B]/95 backdrop-blur-md rounded-2xl p-8 border border-[#31343A]/50 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#F5F5F5] mb-2">
              Mis Servicios
            </h1>
            <p className="text-[#B0B3B8] text-lg">
              Servicios que puedes ofrecer a los clientes
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-full flex items-center justify-center shadow-lg">
              <WrenchScrewdriverIcon className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de servicios */}
      <div className="bg-[#23262B]/80 backdrop-blur-md rounded-xl p-6 border border-[#31343A]/50 shadow-xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-lg flex items-center justify-center shadow-lg">
            <WrenchScrewdriverIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#F5F5F5]">
              Servicios Disponibles
            </h2>
            <p className="text-[#B0B3B8] text-sm">
              Servicios que puedes realizar
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D1A04D]"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[#31343A]/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <WrenchScrewdriverIcon className="w-8 h-8 text-[#B0B3B8]" />
            </div>
            <h3 className="text-xl font-semibold text-[#F5F5F5] mb-2">
              No tienes servicios asignados
            </h3>
            <p className="text-[#B0B3B8]">
              Contacta con tu administrador para que te asigne servicios
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={service.id || `service-${index}`}
                className="bg-[#31343A]/50 rounded-lg p-6 hover:bg-[#31343A]/70 transition-all duration-300 border border-[#31343A]/30 hover:shadow-lg transform hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-[#F5F5F5]">
                    {service.nombre}
                  </h3>
                  <span className="bg-[#D1A04D]/20 text-[#D1A04D] text-xs font-medium px-3 py-1 rounded-full border border-[#D1A04D]/30">
                    {service.categoria?.nombre || "Sin categoría"}
                  </span>
                </div>

                <p className="text-[#B0B3B8] mb-4 line-clamp-3">
                  {service.descripcion || "Sin descripción disponible"}
                </p>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-[#B0B3B8]">
                      Precio:
                    </span>
                    <span className="text-lg font-bold text-[#D1A04D]">
                      {formatPrice(service.precio)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-[#B0B3B8]">
                      Duración:
                    </span>
                    <span className="text-sm font-semibold text-[#F5F5F5]">
                      {formatDuration(service.duracion)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-[#B0B3B8]">
                      Estado:
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        service.activo
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {service.activo ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </div>

                {service.observaciones && (
                  <div className="mt-4 pt-4 border-t border-[#31343A]/30">
                    <p className="text-xs text-[#B0B3B8] mb-1">
                      Observaciones:
                    </p>
                    <p className="text-sm text-[#F5F5F5]">
                      {service.observaciones}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resumen */}
      {services.length > 0 && (
        <div className="bg-gradient-to-r from-[#D1A04D]/10 to-[#B47B1C]/10 rounded-xl p-6 border border-[#D1A04D]/20">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-lg flex items-center justify-center shadow-lg">
              <ChartBarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#F5F5F5]">
                Resumen de Servicios
              </h2>
              <p className="text-[#B0B3B8] text-sm">
                Estadísticas de tus servicios
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#D1A04D] mb-1">
                {services.length}
              </div>
              <div className="text-sm text-[#B0B3B8]">Total de Servicios</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">
                {services.filter((s) => s.activo).length}
              </div>
              <div className="text-sm text-[#B0B3B8]">Servicios Activos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#F5F5F5] mb-1">
                {Math.round(
                  services.reduce((acc, s) => acc + s.duracion, 0) /
                    services.length
                ) || 0}
              </div>
              <div className="text-sm text-[#B0B3B8]">
                Duración Promedio (min)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeServices;
