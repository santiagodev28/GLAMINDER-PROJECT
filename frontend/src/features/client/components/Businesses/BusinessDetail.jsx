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
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <BuildingStorefrontIcon className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-lg font-medium text-[#F5F5F5] mb-2">
          No se encontró el negocio
        </h3>
        <p className="text-[#B0B3B8]">
          El negocio que buscas no está disponible
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header del Negocio */}
      <div className="bg-[#23262B]/95 backdrop-blur-md rounded-2xl p-8 border border-[#31343A]/50 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Información del negocio */}
          <div className="flex-1">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-2xl flex items-center justify-center shadow-lg mr-4">
                <BuildingStorefrontIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#F5F5F5] mb-2">
                  {business.negocio_nombre}
                </h1>
                <p className="text-[#B0B3B8] text-sm">
                  Registrado el:{" "}
                  {new Date(
                    business.negocio_fecha_registro
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>

            <p className="text-[#B0B3B8] text-lg leading-relaxed mb-6">
              {business.negocio_descripcion ||
                "Descubre los mejores servicios de belleza en este establecimiento."}
            </p>

            {/* Información de contacto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-[#B0B3B8]">
                <PhoneIcon className="w-5 h-5 mr-3 text-[#D1A04D]" />
                <span className="truncate">
                  {business.negocio_telefono || "Sin teléfono"}
                </span>
              </div>
              <div className="flex items-center text-[#B0B3B8]">
                <EnvelopeIcon className="w-5 h-5 mr-3 text-[#D1A04D]" />
                <span className="truncate">
                  {business.negocio_correo || "Sin email"}
                </span>
              </div>
            </div>
          </div>

          {/* Botón principal de agendar cita */}
          <div className="flex-shrink-0">
            <Link
              to={`/cliente/agendar-cita/${business.negocio_id}`}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white rounded-xl hover:from-[#B47B1C] hover:to-[#D1A04D] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              <CalendarIcon className="w-6 h-6 mr-3" />
              Agendar Cita
            </Link>
          </div>
        </div>
      </div>

      {/* Tiendas y empleados */}
      <div className="space-y-6">
        {stores.length > 0 ? (
          stores.map((store) => (
            <div
              key={store.tienda_id}
              className="bg-[#23262B]/80 backdrop-blur-md rounded-2xl shadow-lg border border-[#31343A]/50 hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Header de la tienda */}
              <div className="bg-gradient-to-r from-[#D1A04D]/10 to-[#B47B1C]/10 p-6 border-b border-[#31343A]/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-xl flex items-center justify-center shadow-lg mr-4">
                      <BuildingStorefrontIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[#F5F5F5] mb-1">
                        {store.tienda_nombre}
                      </h2>
                      <div className="flex items-center text-[#B0B3B8] text-sm">
                        <MapPinIcon className="w-4 h-4 mr-2 text-[#D1A04D]" />
                        <span>{store.tienda_direccion}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contenido de la tienda */}
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <UserGroupIcon className="w-5 h-5 mr-2 text-[#D1A04D]" />
                  <h3 className="text-lg font-semibold text-[#F5F5F5]">
                    Empleados ({employeesByStore[store.tienda_id]?.length || 0})
                  </h3>
                </div>

                {employeesByStore[store.tienda_id]?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {employeesByStore[store.tienda_id].map((emp) => (
                      <div
                        key={emp.empleado_id}
                        className="bg-[#1F1F1F]/50 backdrop-blur-sm rounded-lg p-4 border border-[#31343A]/30 hover:bg-[#1F1F1F]/70 transition-all duration-300"
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-full flex items-center justify-center shadow-lg mr-3">
                            <span className="text-white font-semibold text-sm">
                              {emp.usuario_nombre?.charAt(0).toUpperCase() ||
                                "E"}
                            </span>
                          </div>
                          <div>
                            <p className="text-[#F5F5F5] font-medium">
                              {emp.usuario_nombre}
                            </p>
                            <p className="text-[#B0B3B8] text-sm">
                              {emp.empleado_especialidad}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#D1A04D]/20 to-[#B47B1C]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <UserGroupIcon className="w-8 h-8 text-[#D1A04D]" />
                    </div>
                    <p className="text-[#B0B3B8]">
                      No hay empleados registrados en esta tienda
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <BuildingStorefrontIcon className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-lg font-medium text-[#F5F5F5] mb-2">
              No hay tiendas disponibles
            </h3>
            <p className="text-[#B0B3B8]">
              Este negocio aún no tiene tiendas registradas
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessDetail;
