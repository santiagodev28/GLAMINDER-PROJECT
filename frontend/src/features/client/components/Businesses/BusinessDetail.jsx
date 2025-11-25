import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AdminService from "../../../../services/adminService";
import {
  BuildingStorefrontIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const BusinessDetail = () => {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [stores, setStores] = useState([]);
  const [employeesByStore, setEmployeesByStore] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Info negocio
        const bizData = await AdminService.fetchBusinessById(id);
        setBusiness(bizData);

        // 2. Tiendas
        const storesData = await AdminService.fetchStoresByBusiness(id);
        setStores(storesData);

        // 3. Empleados por tienda
        const employeesData = {};
        for (const store of storesData) {
          const emps = await AdminService.fetchEmployeesByStore(
            store.tienda_id
          );
          employeesData[store.tienda_id] = emps;
        }
        setEmployeesByStore(employeesData);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#D1A04D]"></div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="text-center py-12 sm:py-16">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <BuildingStorefrontIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>
        <h3 className="text-base sm:text-lg font-medium text-[#F5F5F5] mb-2">
          No se encontró el negocio
        </h3>
        <p className="text-[#B0B3B8] text-sm sm:text-base">
          El negocio que buscas no está disponible
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-0">
      {/* Header del Negocio */}
      <div className="backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Información del negocio */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 mb-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <BuildingStorefrontIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#F5F5F5] mb-2">
                  {business.negocio_nombre}
                </h1>
                <p className="text-[#B0B3B8] text-xs sm:text-sm">
                  Registrado el:{" "}
                  {new Date(
                    business.negocio_fecha_registro
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>

            <p className="text-[#B0B3B8] text-sm sm:text-lg leading-relaxed mb-6">
              {business.negocio_descripcion ||
                "Descubre los mejores servicios de belleza en este establecimiento."}
            </p>

            {/* Información de contacto */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-center text-[#B0B3B8] text-sm">
                <PhoneIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-[#D1A04D] flex-shrink-0" />
                <span className="truncate">
                  {business.negocio_telefono || "Sin teléfono"}
                </span>
              </div>
              <div className="flex items-center text-[#B0B3B8] text-sm">
                <EnvelopeIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-[#D1A04D] flex-shrink-0" />
                <span className="truncate">
                  {business.negocio_correo || "Sin email"}
                </span>
              </div>
            </div>
          </div>

          {/* Botón principal de agendar cita */}
          <div className="flex-shrink-0 w-full sm:w-auto">
            <Link
              to={`/cliente/agendar-cita/${business.negocio_id}`}
              className="inline-flex items-center justify-center w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white rounded-xl hover:from-[#B47B1C] hover:to-[#D1A04D] transition-all duration-500 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 text-sm sm:text-base"
            >
              <CalendarIcon className="w-4 h-4 sm:w-6 sm:h-6 mr-2" />
              Agendar Cita
            </Link>
          </div>
        </div>
      </div>

      {/* Tiendas y empleados */}
      <div className="space-y-4 sm:space-y-6">
        {stores.length > 0 ? (
          stores.map((store) => (
            <div
              key={store.tienda_id}
              className="bg-black/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/10 hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Header de la tienda */}
              <div className="bg-gradient-to-r from-[#D1A04D]/10 to-[#B47B1C]/10 p-4 sm:p-6 border-b border-white/20">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <BuildingStorefrontIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-[#F5F5F5] mb-1">
                        {store.tienda_nombre}
                      </h2>
                      <div className="flex items-center text-[#B0B3B8] text-xs sm:text-sm">
                        <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-[#D1A04D]" />
                        <span>{store.tienda_direccion}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contenido de la tienda */}
              <div className="p-4 sm:p-6">
                <div className="flex items-center mb-4">
                  <UserGroupIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-[#D1A04D]" />
                  <h3 className="text-base sm:text-lg font-semibold text-[#F5F5F5]">
                    Empleados ({employeesByStore[store.tienda_id]?.length || 0})
                  </h3>
                </div>

                {employeesByStore[store.tienda_id]?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {employeesByStore[store.tienda_id].map((emp) => (
                      <div
                        key={emp.empleado_id}
                        className="bg-black/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20 hover:bg-black/70 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                            <span className="text-white font-semibold text-xs sm:text-sm">
                              {emp.usuario_nombre?.charAt(0).toUpperCase() ||
                                "E"}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-[#F5F5F5] font-medium text-sm truncate">
                              {emp.usuario_nombre}
                            </p>
                            <p className="text-[#B0B3B8] text-xs truncate">
                              {emp.empleado_especialidad}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#D1A04D]/20 to-[#B47B1C]/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <UserGroupIcon className="w-6 h-6 sm:w-8 sm:h-8 text-[#D1A04D]" />
                    </div>
                    <p className="text-[#B0B3B8] text-sm sm:text-base">
                      No hay empleados registrados en esta tienda
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 sm:py-16">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <BuildingStorefrontIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-[#F5F5F5] mb-2">
              No hay tiendas disponibles
            </h3>
            <p className="text-[#B0B3B8] text-sm sm:text-base">
              Este negocio aún no tiene tiendas registradas
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessDetail;