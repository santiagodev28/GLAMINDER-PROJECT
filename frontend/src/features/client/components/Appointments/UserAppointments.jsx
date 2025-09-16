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
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <ExclamationTriangleIcon className="w-10 h-10 text-red-400" />
        </div>
        <h3 className="text-lg font-medium text-[#F5F5F5] mb-2">
          Error al cargar las citas
        </h3>
        <p className="text-[#B0B3B8] mb-6">{error}</p>
        <button
          onClick={loadAppointments}
          className="px-6 py-3 bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white rounded-xl hover:from-[#B47B1C] hover:to-[#D1A04D] transition-all duration-500 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <CalendarIcon className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-lg font-medium text-[#F5F5F5] mb-2">
          No tienes citas programadas
        </h3>
        <p className="text-[#B0B3B8]">Agenda tu primera cita para comenzar</p>
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
    <div className="space-y-8">
      {/* Header */}
      <div className=" backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center justify-center mb-4 md:mb-0">
            <div className="w-16 h-16 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-2xl flex items-center justify-center shadow-lg mr-4">
              <CalendarIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#F5F5F5] mb-2">
                Mis Citas
              </h1>
              <p className="text-[#B0B3B8] text-lg">
                Gestiona todas tus citas programadas
              </p>
            </div>
          </div>
          {/* Filtro de fecha */}
          <div className="flex flex-col items-end gap-2">
            <label className="text-[#B0B3B8] text-sm">Filtrar por fecha:</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="p-2 rounded-lg bg-black/70 border border-white/20 text-[#F5F5F5] focus:ring-2 focus:ring-[#D1A04D]/50 focus:border-[#D1A04D]"
            />
            {filterDate && (
              <button
                onClick={() => setFilterDate("")}
                className="text-xs text-[#D1A04D] hover:underline mt-1"
              >
                Limpiar filtro
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lista de citas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAppointments.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CalendarIcon className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-lg font-medium text-[#F5F5F5] mb-2">
              No tienes citas para esta fecha
            </h3>
            <p className="text-[#B0B3B8]">
              Selecciona otra fecha o agenda una nueva cita
            </p>
          </div>
        ) : (
          filteredAppointments.map((appointment) => (
            <div
              key={appointment.cita_id}
              className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-500 flex flex-col gap-2 hover:bg-black/90"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-lg flex items-center justify-center shadow">
                    <CalendarIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#F5F5F5] text-base">
                      {appointment.servicio_nombre}
                    </h3>
                    <p className="text-xs text-[#B0B3B8]">
                      {appointment.tienda_nombre}
                    </p>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full border text-xs font-medium flex items-center ${getStatusColor(
                    appointment.cita_estado
                  )}`}
                >
                  {getStatusIcon(appointment.cita_estado)}
                  <span className="ml-1 capitalize">
                    {appointment.cita_estado}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 text-xs text-[#B0B3B8] mt-1">
                <span>
                  <ClockIcon className="w-4 h-4 inline mr-1 text-[#D1A04D]" />
                  {appointment.franja_hora_inicio}
                </span>
                <span>
                  <CalendarIcon className="w-4 h-4 inline mr-1 text-[#D1A04D]" />
                  {new Date(appointment.cita_fecha).toLocaleDateString()}
                </span>
                <span>
                  <UserIcon className="w-4 h-4 inline mr-1 text-[#D1A04D]" />
                  {appointment.empleado_nombre} {appointment.empleado_apellido}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 mt-2">
                <span className="text-[#D1A04D] font-bold text-base">
                  ${appointment.servicio_precio}
                </span>
                {appointment.cita_estado === "pendiente" && (
                  <button
                    onClick={() => handleCancelAppointment(appointment.cita_id)}
                    disabled={cancellingId === appointment.cita_id}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold shadow hover:shadow-lg transition-all duration-500"
                  >
                    {cancellingId === appointment.cita_id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                        Cancelando...
                      </>
                    ) : (
                      <>
                        <XCircleIcon className="w-4 h-4 mr-1 inline" />
                        Cancelar
                      </>
                    )}
                  </button>
                )}
                {appointment.cita_estado === "cancelada" && (
                  <span className="text-xs text-[#B0B3B8]">
                    Cancelada el{" "}
                    {new Date(
                      appointment.fecha_cancelacion ||
                        appointment.fecha_modificacion
                    ).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserAppointments;
