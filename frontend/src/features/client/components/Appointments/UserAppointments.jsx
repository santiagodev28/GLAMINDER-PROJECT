import { useState, useEffect } from "react";
import appointmentService from "../../../../services/appointmentService";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  BuildingStorefrontIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const UserAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);
  // Obtener la fecha actual en formato yyyy-mm-dd
  const todayStr = new Date().toISOString().slice(0, 10);
  const [filterDate, setFilterDate] = useState(todayStr);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getUserAppointments();
      setAppointments(data);
    } catch (error) {
      console.error("Error cargando citas:", error);
      setError("Error al cargar las citas");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm("¿Estás seguro de que quieres cancelar esta cita?")) {
      return;
    }

    try {
      setCancellingId(appointmentId);
      await appointmentService.cancelAppointment(appointmentId);

      // Recargar citas
      await loadAppointments();
    } catch (error) {
      console.error("Error cancelando cita:", error);
      setError("Error al cancelar la cita");
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pendiente":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      case "confirmada":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "completada":
        return "text-green-400 bg-green-500/10 border-green-500/20";
      case "cancelada":
        return "text-red-400 bg-red-500/10 border-red-500/20";
      default:
        return "text-[#B0B3B8] bg-[#31343A]/50 border-[#31343A]";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pendiente":
        return <ExclamationTriangleIcon className="w-5 h-5" />;
      case "confirmada":
        return <CheckCircleIcon className="w-5 h-5" />;
      case "completada":
        return <CheckCircleIcon className="w-5 h-5" />;
      case "cancelada":
        return <XCircleIcon className="w-5 h-5" />;
      default:
        return <ExclamationTriangleIcon className="w-5 h-5" />;
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
      <div className="text-center py-8 sm:py-12 px-4 sm:px-0">
        <div className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <ExclamationTriangleIcon className="w-10 h-10 text-red-400" />
        </div>
        <h3 className="text-base sm:text-lg font-medium text-[#F5F5F5] mb-2">
          Error al cargar las citas
        </h3>
        <p className="text-[#B0B3B8] text-xs sm:text-sm mb-6">{error}</p>
        <button
          onClick={loadAppointments}
          className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white rounded-xl hover:from-[#B47B1C] hover:to-[#D1A04D] transition-all duration-500 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-xs sm:text-base"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 px-4 sm:px-0">
        <div className="w-20 h-20 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <CalendarIcon className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-base sm:text-lg font-medium text-[#F5F5F5] mb-2">
          No tienes citas programadas
        </h3>
        <p className="text-[#B0B3B8] text-xs sm:text-sm">
          Agenda tu primera cita para comenzar
        </p>
      </div>
    );
  }

  // Filtrar citas por fecha si hay filtro
  const filteredAppointments = filterDate
    ? appointments.filter(
        (apt) =>
          new Date(apt.cita_fecha).toISOString().slice(0, 10) === filterDate
      )
    : appointments;

  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-0">
      {/* Header */}
      <div className="backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          {/* Título y descripción */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <CalendarIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#F5F5F5]">
                Mis Citas
              </h1>
              <p className="text-[#B0B3B8] text-xs sm:text-base mt-1">
                Gestiona todas tus citas programadas
              </p>
            </div>
          </div>

          {/* Filtro de fecha */}
          <div className="flex flex-col gap-2 sm:items-end">
            <label className="text-[#B0B3B8] text-xs sm:text-sm font-medium">
              Filtrar por fecha:
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="p-2 sm:p-3 rounded-lg bg-black/70 border border-white/20 text-[#F5F5F5] text-xs sm:text-sm focus:ring-2 focus:ring-[#D1A04D]/50 focus:border-[#D1A04D] transition-all duration-300"
              />
              {filterDate && (
                <button
                  onClick={() => setFilterDate("")}
                  className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-[#D1A04D] hover:text-[#F5F5F5] bg-[#D1A04D]/10 hover:bg-[#D1A04D]/20 rounded-lg border border-[#D1A04D]/30 hover:border-[#D1A04D]/50 transition-all duration-300 font-medium"
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-black/80 backdrop-blur-sm border border-white/10 rounded-xl p-3 sm:p-4 text-center">
          <p className="text-2xl sm:text-3xl font-bold text-[#D1A04D]">
            {appointments.length}
          </p>
          <p className="text-xs sm:text-sm text-[#B0B3B8] mt-1">Total de citas</p>
        </div>
        <div className="bg-black/80 backdrop-blur-sm border border-white/10 rounded-xl p-3 sm:p-4 text-center">
          <p className="text-2xl sm:text-3xl font-bold text-blue-400">
            {appointments.filter((a) => a.cita_estado === "confirmada").length}
          </p>
          <p className="text-xs sm:text-sm text-[#B0B3B8] mt-1">Confirmadas</p>
        </div>
        <div className="bg-black/80 backdrop-blur-sm border border-white/10 rounded-xl p-3 sm:p-4 text-center">
          <p className="text-2xl sm:text-3xl font-bold text-yellow-400">
            {appointments.filter((a) => a.cita_estado === "pendiente").length}
          </p>
          <p className="text-xs sm:text-sm text-[#B0B3B8] mt-1">Pendientes</p>
        </div>
        <div className="bg-black/80 backdrop-blur-sm border border-white/10 rounded-xl p-3 sm:p-4 text-center">
          <p className="text-2xl sm:text-3xl font-bold text-green-400">
            {appointments.filter((a) => a.cita_estado === "completada").length}
          </p>
          <p className="text-xs sm:text-sm text-[#B0B3B8] mt-1">Completadas</p>
        </div>
      </div>

      {/* Lista de citas */}
      {filteredAppointments.length === 0 ? (
        <div className="col-span-full text-center py-8 sm:py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CalendarIcon className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-base sm:text-lg font-medium text-[#F5F5F5] mb-2">
            No tienes citas para esta fecha
          </h3>
          <p className="text-[#B0B3B8] text-xs sm:text-sm">
            Selecciona otra fecha o agenda una nueva cita
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment.cita_id}
              className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:border-white/30 transition-all duration-300 hover:shadow-lg flex flex-col"
            >
              {/* Header de la tarjeta */}
              <div className="bg-gradient-to-r from-[#D1A04D]/10 to-[#B47B1C]/10 p-4 sm:p-6 border-b border-white/10">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-[#F5F5F5] text-sm sm:text-base truncate">
                        {appointment.servicio_nombre}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#B0B3B8] mt-1 flex items-center gap-1">
                        <BuildingStorefrontIcon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="truncate">{appointment.tienda_nombre}</span>
                      </p>
                    </div>
                  </div>
                  <div
                    className={`px-2 sm:px-3 py-1 rounded-full border text-xs font-medium flex items-center gap-1 flex-shrink-0 ${getStatusColor(
                      appointment.cita_estado
                    )}`}
                  >
                    {getStatusIcon(appointment.cita_estado)}
                    <span className="capitalize hidden sm:inline">
                      {appointment.cita_estado}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detalles de la cita */}
              <div className="p-4 sm:p-6 space-y-3 flex-1">
                {/* Fecha y Hora */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-[#B0B3B8]">
                    <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#D1A04D] flex-shrink-0" />
                    <span>
                      {new Date(appointment.cita_fecha).toLocaleDateString(
                        "es-ES",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-[#B0B3B8]">
                    <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#D1A04D] flex-shrink-0" />
                    <span>{appointment.franja_hora_inicio}</span>
                  </div>
                </div>

                {/* Empleado */}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#B0B3B8] pt-2 border-t border-white/10">
                  <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#D1A04D] flex-shrink-0" />
                  <span>
                    {appointment.empleado_nombre} {appointment.empleado_apellido}
                  </span>
                </div>

                {/* Precio */}
                <div className="pt-2 border-t border-white/10">
                  <p className="text-[#D1A04D] font-bold text-lg sm:text-xl">
                    ${appointment.servicio_precio}
                  </p>
                </div>
              </div>

              {/* Footer con acciones */}
              <div className="p-4 sm:p-6 border-t border-white/10 bg-black/50">
                {appointment.cita_estado === "pendiente" && (
                  <button
                    onClick={() => handleCancelAppointment(appointment.cita_id)}
                    disabled={cancellingId === appointment.cita_id}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm font-semibold shadow hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {cancellingId === appointment.cita_id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Cancelando...</span>
                      </>
                    ) : (
                      <>
                        <XCircleIcon className="w-4 h-4" />
                        <span>Cancelar Cita</span>
                      </>
                    )}
                  </button>
                )}
                {appointment.cita_estado === "confirmada" && (
                  <p className="text-xs sm:text-sm text-green-400 text-center font-medium">
                    ✓ Cita Confirmada
                  </p>
                )}
                {appointment.cita_estado === "completada" && (
                  <p className="text-xs sm:text-sm text-green-400 text-center font-medium">
                    ✓ Cita Completada
                  </p>
                )}
                {appointment.cita_estado === "cancelada" && (
                  <p className="text-xs sm:text-sm text-red-400 text-center">
                    Cancelada el{" "}
                    {new Date(
                      appointment.fecha_cancelacion ||
                        appointment.fecha_modificacion
                    ).toLocaleDateString("es-ES")}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserAppointments;