import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BuildingStorefrontIcon,
  UserGroupIcon,
  CalendarIcon,
  ChartBarIcon,
  PlusIcon,
  ArrowRightIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import OwnerService from "../../../services/ownerService";

const OwnerDashboard = () => {
  const [owner, setOwner] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [stores, setStores] = useState([]);
  const [stats, setStats] = useState({
    totalBusinesses: 0,
    totalStores: 0,
    totalEmployees: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    monthlyRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("usuario"));

      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      // Obtener información del propietario
      const ownerData = await OwnerService.getOwnerByUserId(user.usuario_id);
      setOwner(ownerData);

      // Obtener negocios del propietario
      const businessesData = await OwnerService.getOwnerBusinesses(
        ownerData.propietario_id
      );
      setBusinesses(businessesData);

      // Obtener todas las tiendas de todos los negocios
      const allStores = [];
      for (const business of businessesData) {
        const businessStores = await OwnerService.getStoresByBusiness(
          business.negocio_id
        );
        allStores.push(...businessStores);
      }
      setStores(allStores);

      // Obtener estadísticas del propietario
      const ownerStats = await OwnerService.getOwnerStats(
        ownerData.propietario_id
      );
      setStats({
        ...ownerStats,
        totalStores: allStores.length,
      });
    } catch (error) {
      console.error("Error al cargar datos del dashboard:", error);
      setError("Error al cargar los datos del dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#D1A04D]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">{error}</div>
          <button
            onClick={loadDashboardData}
            className="bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white px-6 py-3 rounded-lg hover:from-[#B47B1C] hover:to-[#D1A04D] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header del Dashboard */}
      <div className="bg-[#23262B]/95 backdrop-blur-md rounded-2xl p-8 border border-[#31343A]/50 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#F5F5F5] mb-2">
              ¡Bienvenido, {owner?.usuario?.nombre || "Propietario"}!
            </h1>
            <p className="text-[#B0B3B8] text-lg">
              Gestiona tus negocios y supervisa el rendimiento de tu empresa
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-full flex items-center justify-center shadow-lg">
              <BuildingStorefrontIcon className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-[#23262B]/80 backdrop-blur-md rounded-xl p-6 border border-[#31343A]/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#B0B3B8] text-sm font-medium">Tiendas</p>
              <p className="text-2xl font-bold text-[#F5F5F5]">
                {stats.totalStores || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-lg flex items-center justify-center shadow-lg">
              <BuildingStorefrontIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-[#23262B]/80 backdrop-blur-md rounded-xl p-6 border border-[#31343A]/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#B0B3B8] text-sm font-medium">Empleados</p>
              <p className="text-2xl font-bold text-[#F5F5F5]">
                {stats.totalEmployees || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-lg flex items-center justify-center shadow-lg">
              <UserGroupIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-[#23262B]/80 backdrop-blur-md rounded-xl p-6 border border-[#31343A]/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#B0B3B8] text-sm font-medium">
                Citas Totales
              </p>
              <p className="text-2xl font-bold text-[#F5F5F5]">
                {stats.totalAppointments || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-lg flex items-center justify-center shadow-lg">
              <CalendarIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-[#23262B]/80 backdrop-blur-md rounded-xl p-6 border border-[#31343A]/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#B0B3B8] text-sm font-medium">Pendientes</p>
              <p className="text-2xl font-bold text-[#F5F5F5]">
                {stats.pendingAppointments || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-lg flex items-center justify-center shadow-lg">
              <ClockIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/propietario/tiendas"
          className="group bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-xl p-6 text-white hover:from-[#B47B1C] hover:to-[#D1A04D] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                <BuildingStorefrontIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mis Tiendas</h3>
              <p className="text-white/80">Gestiona tus establecimientos</p>
            </div>
            <ArrowRightIcon className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </Link>

        <Link
          to="/propietario/empleados"
          className="group bg-[#23262B]/80 backdrop-blur-md rounded-xl p-6 border border-[#31343A]/50 hover:border-[#D1A04D]/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-lg flex items-center justify-center mb-3">
                <UserGroupIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#F5F5F5]">
                Empleados
              </h3>
              <p className="text-[#B0B3B8]">Administra tu equipo</p>
            </div>
            <ArrowRightIcon className="w-6 h-6 text-[#B0B3B8] group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </Link>

        <Link
          to="/propietario/citas"
          className="group bg-[#23262B]/80 backdrop-blur-md rounded-xl p-6 border border-[#31343A]/50 hover:border-[#D1A04D]/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-lg flex items-center justify-center mb-3">
                <CalendarIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#F5F5F5]">
                Citas
              </h3>
              <p className="text-[#B0B3B8]">Supervisa las reservas</p>
            </div>
            <ArrowRightIcon className="w-6 h-6 text-[#B0B3B8] group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </Link>
      </div>

      {/* Tiendas recientes */}
      <div className="bg-[#23262B]/80 backdrop-blur-md rounded-xl shadow-lg border border-[#31343A]/50">
        <div className="p-6 border-b border-[#31343A]/50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#F5F5F5]">
              Mis Tiendas
            </h2>
            <Link
              to="/propietario/tiendas"
              className="text-[#D1A04D] hover:text-[#F5C76A] font-medium text-sm flex items-center gap-2 transition-colors duration-300"
            >
              Ver todas
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="p-6">
          {stores.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <BuildingStorefrontIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-medium text-[#F5F5F5] mb-2">
                No tienes tiendas registradas
              </h3>
              <p className="text-[#B0B3B8] mb-6 max-w-md mx-auto">
                ¡Crea tu primera tienda y comienza a ofrecer servicios de
                belleza!
              </p>
              <Link
                to="/propietario/tiendas"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white rounded-lg hover:from-[#B47B1C] hover:to-[#D1A04D] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Crear Tienda
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {stores.slice(0, 3).map((store) => (
                <div
                  key={store.tienda_id}
                  className="flex items-center justify-between p-4 bg-[#1F1F1F]/50 backdrop-blur-sm rounded-lg hover:bg-[#1F1F1F]/70 transition-all duration-300 border border-[#31343A]/30 hover:border-[#D1A04D]/30"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-lg flex items-center justify-center shadow-md">
                      <BuildingStorefrontIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-[#F5F5F5]">
                        {store.tienda_nombre}
                      </h4>
                      <p className="text-sm text-[#B0B3B8]">
                        {store.tienda_direccion || "Sin dirección"}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-[#B0B3B8]">
                          Estado:{" "}
                          {store.tienda_estado === 1 ? "Activa" : "Inactiva"}
                        </span>
                        <span className="text-xs text-[#B0B3B8]">
                          Horario: {store.tienda_hora_apertura} -{" "}
                          {store.tienda_hora_cierre}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-300 ${
                        store.tienda_estado === 1
                          ? "text-green-400 bg-green-500/10 border-green-500/20"
                          : "text-red-400 bg-red-500/10 border-red-500/20"
                      }`}
                    >
                      {store.tienda_estado === 1 ? "Activa" : "Inactiva"}
                    </span>
                    <Link
                      to={`/propietario/tiendas/${store.tienda_id}/detalle`}
                      className="text-[#B0B3B8] hover:text-[#F5F5F5] transition-colors duration-300 p-1 rounded-lg hover:bg-[#31343A]/50"
                    >
                      <ArrowRightIcon className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Acciones adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/propietario/servicios"
          className="group bg-[#23262B]/80 backdrop-blur-md rounded-xl p-6 border border-[#31343A]/50 hover:border-[#D1A04D]/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-lg flex items-center justify-center shadow-lg">
              <ChartBarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#F5F5F5] mb-1">
                Gestión de Servicios
              </h3>
              <p className="text-[#B0B3B8] text-sm">
                Administra los servicios de tus negocios
              </p>
            </div>
            <ArrowRightIcon className="w-5 h-5 text-[#B0B3B8] group-hover:translate-x-1 transition-transform duration-300 ml-auto" />
          </div>
        </Link>

        <Link
          to="/propietario/reportes"
          className="group bg-[#23262B]/80 backdrop-blur-md rounded-xl p-6 border border-[#31343A]/50 hover:border-[#D1A04D]/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-lg flex items-center justify-center shadow-lg">
              <ChartBarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#F5F5F5] mb-1">
                Reportes y Estadísticas
              </h3>
              <p className="text-[#B0B3B8] text-sm">
                Analiza el rendimiento de tu negocio
              </p>
            </div>
            <ArrowRightIcon className="w-5 h-5 text-[#B0B3B8] group-hover:translate-x-1 transition-transform duration-300 ml-auto" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default OwnerDashboard;
