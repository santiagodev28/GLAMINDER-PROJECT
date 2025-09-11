import React, { useState, useEffect } from "react";
import OwnerService from "../../../services/ownerService";

const ReportsAndStats = () => {
  const [ownerStats, setOwnerStats] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState("");
  const [businessStats, setBusinessStats] = useState(null);
  const [appointmentStats, setAppointmentStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedBusiness) {
      loadBusinessStats();
    }
  }, [selectedBusiness]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const user = JSON.parse(localStorage.getItem("usuario"));
      const ownerData = await OwnerService.getOwnerByUserId(user.usuario_id);

      // Cargar estadísticas del propietario
      const stats = await OwnerService.getOwnerStats(ownerData.propietario_id);
      setOwnerStats(stats);

      // Cargar negocios
      const businessesData = await OwnerService.getOwnerBusinesses(
        ownerData.propietario_id
      );
      setBusinesses(businessesData);

      if (businessesData.length > 0) {
        setSelectedBusiness(businessesData[0].negocio_id);
      }

      // Cargar estadísticas de citas
      const appointmentStatsData = await OwnerService.getAppointmentStats();
      setAppointmentStats(appointmentStatsData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setError(
        "Error al cargar los datos. Verifica que tengas datos en tu cuenta."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadBusinessStats = async () => {
    try {
      const stats = await OwnerService.getBusinessStats(selectedBusiness);
      setBusinessStats(stats);
    } catch (error) {
      console.error("Error al cargar estadísticas del negocio:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">
            Error al cargar los datos
          </div>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-[#23262B]/95 backdrop-blur-md rounded-2xl p-8 border border-[#31343A]/50 shadow-2xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#F5F5F5] mb-2">
              Reportes y Estadísticas
            </h1>
            <p className="text-[#B0B3B8]">Análisis detallado de tu negocio</p>
          </div>
          <div className="flex space-x-4">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
              className="px-4 py-2 bg-[#1F1F1F]/50 border border-[#31343A] rounded-xl text-[#F5F5F5] focus:ring-2 focus:ring-[#D1A04D] focus:border-transparent placeholder-[#B0B3B8]"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
              className="px-4 py-2 bg-[#1F1F1F]/50 border border-[#31343A] rounded-xl text-[#F5F5F5] focus:ring-2 focus:ring-[#D1A04D] focus:border-transparent placeholder-[#B0B3B8]"
            />
          </div>
        </div>
      </div>

      {/* Selector de negocio */}
      <div className="bg-[#23262B]/80 backdrop-blur-md rounded-2xl p-6 border border-[#31343A]/50 shadow-lg">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-[#F5F5F5]">
            Seleccionar negocio:
          </label>
          <select
            value={selectedBusiness}
            onChange={(e) => setSelectedBusiness(e.target.value)}
            className="px-4 py-2 bg-[#1F1F1F]/50 border border-[#31343A] rounded-xl text-[#F5F5F5] focus:ring-2 focus:ring-[#D1A04D] focus:border-transparent"
          >
            {businesses.map((business) => (
              <option key={business.negocio_id} value={business.negocio_id}>
                {business.negocio_nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Estadísticas generales del propietario */}
      {ownerStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#23262B]/80 backdrop-blur-md rounded-2xl p-6 border border-[#31343A]/50 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[#B0B3B8]">
                  Total Negocios
                </p>
                <p className="text-2xl font-semibold text-[#F5F5F5]">
                  {ownerStats.totalBusinesses || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#23262B]/80 backdrop-blur-md rounded-2xl p-6 border border-[#31343A]/50 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[#B0B3B8]">
                  Total Empleados
                </p>
                <p className="text-2xl font-semibold text-[#F5F5F5]">
                  {ownerStats.totalEmployees || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#23262B]/80 backdrop-blur-md rounded-2xl p-6 border border-[#31343A]/50 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[#B0B3B8]">
                  Total Citas
                </p>
                <p className="text-2xl font-semibold text-[#F5F5F5]">
                  {ownerStats.totalAppointments || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#23262B]/80 backdrop-blur-md rounded-2xl p-6 border border-[#31343A]/50 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[#B0B3B8]">
                  Ingresos Totales
                </p>
                <p className="text-2xl font-semibold text-[#F5F5F5]">
                  ${(ownerStats.totalRevenue || 0).toLocaleString("es-CO")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas del negocio seleccionado */}
      {businessStats && (
        <div className="bg-[#23262B]/80 backdrop-blur-md rounded-2xl p-6 border border-[#31343A]/50 shadow-lg">
          <h2 className="text-xl font-semibold text-[#F5F5F5] mb-4">
            Estadísticas del Negocio
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-[#1F1F1F]/30 rounded-xl border border-[#31343A]/30">
              <div className="text-3xl font-bold text-[#D1A04D] mb-2">
                {businessStats.totalEmployees || 0}
              </div>
              <div className="text-sm text-[#B0B3B8]">Empleados Activos</div>
            </div>
            <div className="text-center p-4 bg-[#1F1F1F]/30 rounded-xl border border-[#31343A]/30">
              <div className="text-3xl font-bold text-[#D1A04D] mb-2">
                {businessStats.total_citas || 0}
              </div>
              <div className="text-sm text-[#B0B3B8]">Citas Totales</div>
            </div>
            <div className="text-center p-4 bg-[#1F1F1F]/30 rounded-xl border border-[#31343A]/30">
              <div className="text-3xl font-bold text-[#D1A04D] mb-2">
                {businessStats.completedAppointments || 0}
              </div>
              <div className="text-sm text-[#B0B3B8]">Citas Completadas</div>
            </div>
            <div className="text-center p-4 bg-[#1F1F1F]/30 rounded-xl border border-[#31343A]/30">
              <div className="text-3xl font-bold text-[#D1A04D] mb-2">
                {businessStats.pendingAppointments || 0}
              </div>
              <div className="text-sm text-[#B0B3B8]">Citas Pendientes</div>
            </div>
            <div className="text-center p-4 bg-[#1F1F1F]/30 rounded-xl border border-[#31343A]/30">
              <div className="text-3xl font-bold text-[#D1A04D] mb-2">
                {businessStats.cancelledAppointments || 0}
              </div>
              <div className="text-sm text-[#B0B3B8]">Citas Canceladas</div>
            </div>
            <div className="text-center p-4 bg-[#1F1F1F]/30 rounded-xl border border-[#31343A]/30">
              <div className="text-3xl font-bold text-[#D1A04D] mb-2">
                ${(businessStats.totalRevenue || 0).toLocaleString("es-CO")}
              </div>
              <div className="text-sm text-[#B0B3B8]">Ingresos Totales</div>
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas de citas */}
      {appointmentStats && (
        <div className="bg-[#23262B]/80 backdrop-blur-md rounded-2xl p-6 border border-[#31343A]/50 shadow-lg">
          <h2 className="text-xl font-semibold text-[#F5F5F5] mb-4">
            Análisis de Citas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-[#F5F5F5] mb-3">
                Estado de Citas
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#B0B3B8]">Pendientes</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-[#1F1F1F]/50 rounded-full h-2">
                      <div
                        className="bg-[#D1A04D] h-2 rounded-full"
                        style={{
                          width: `${
                            (appointmentStats.pending /
                              appointmentStats.total) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-[#F5F5F5]">
                      {appointmentStats.pending || 0}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#B0B3B8]">Confirmadas</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-[#1F1F1F]/50 rounded-full h-2">
                      <div
                        className="bg-[#D1A04D] h-2 rounded-full"
                        style={{
                          width: `${
                            (appointmentStats.confirmed /
                              appointmentStats.total) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-[#F5F5F5]">
                      {appointmentStats.confirmed || 0}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#B0B3B8]">Completadas</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-[#1F1F1F]/50 rounded-full h-2">
                      <div
                        className="bg-[#D1A04D] h-2 rounded-full"
                        style={{
                          width: `${
                            (appointmentStats.completed /
                              appointmentStats.total) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-[#F5F5F5]">
                      {appointmentStats.completed || 0}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#B0B3B8]">Canceladas</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-[#1F1F1F]/50 rounded-full h-2">
                      <div
                        className="bg-[#D1A04D] h-2 rounded-full"
                        style={{
                          width: `${
                            (appointmentStats.cancelled /
                              appointmentStats.total) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-[#F5F5F5]">
                      {appointmentStats.cancelled || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-[#F5F5F5] mb-3">
                Métricas Clave
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-[#B0B3B8]">
                    Tasa de Completación
                  </span>
                  <span className="text-sm font-medium text-[#F5F5F5]">
                    {appointmentStats.completionRate || 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#B0B3B8]">
                    Tasa de Cancelación
                  </span>
                  <span className="text-sm font-medium text-[#F5F5F5]">
                    {appointmentStats.cancellationRate || 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#B0B3B8]">
                    Citas Promedio por Día
                  </span>
                  <span className="text-sm font-medium text-[#F5F5F5]">
                    {appointmentStats.averagePerDay || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#B0B3B8]">
                    Ingresos Promedio por Cita
                  </span>
                  <span className="text-sm font-medium text-[#F5F5F5]">
                    $
                    {(appointmentStats.averageRevenue || 0).toLocaleString(
                      "es-CO"
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resumen de rendimiento */}
      <div className="bg-[#23262B]/80 backdrop-blur-md rounded-2xl p-6 border border-[#31343A]/50 shadow-lg">
        <h2 className="text-xl font-semibold text-[#F5F5F5] mb-4">
          Resumen de Rendimiento
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-[#1F1F1F]/30 rounded-xl border border-[#31343A]/30">
            <div className="text-2xl font-bold text-[#D1A04D] mb-2">
              {ownerStats?.totalBusinesses || 0}
            </div>
            <div className="text-sm text-[#B0B3B8]">Negocios Activos</div>
          </div>
          <div className="text-center p-4 bg-[#1F1F1F]/30 rounded-xl border border-[#31343A]/30">
            <div className="text-2xl font-bold text-[#D1A04D] mb-2">
              {ownerStats?.totalEmployees || 0}
            </div>
            <div className="text-sm text-[#B0B3B8]">Empleados Activos</div>
          </div>
          <div className="text-center p-4 bg-[#1F1F1F]/30 rounded-xl border border-[#31343A]/30">
            <div className="text-2xl font-bold text-[#D1A04D] mb-2">
              {ownerStats?.totalAppointments || 0}
            </div>
            <div className="text-sm text-[#B0B3B8]">Citas Este Mes</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAndStats;
