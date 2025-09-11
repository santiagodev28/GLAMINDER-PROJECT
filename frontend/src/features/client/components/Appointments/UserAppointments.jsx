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
          className="px-6 py-3 bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white rounded-xl hover:from-[#B47B1C] hover:to-[#D1A04D] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-[#23262B]/95 backdrop-blur-md rounded-2xl p-8 border border-[#31343A]/50 shadow-2xl">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
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
        </div>
      </div>

      {/* Lista de citas */}
      <div className="space-y-6">
        {appointments.map((appointment) => (
          <div
            key={appointment.cita_id}
            className="bg-[#23262B]/80 backdrop-blur-md rounded-2xl shadow-lg border border-[#31343A]/50 hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            {/* Header de la cita */}
            <div className="bg-gradient-to-r from-[#D1A04D]/10 to-[#B47B1C]/10 p-6 border-b border-[#31343A]/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-xl flex items-center justify-center shadow-lg mr-4">
                    <CalendarIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#F5F5F5] mb-1">
                      {appointment.servicio_nombre}
                    </h3>
                    <div className="text-lg font-bold text-[#D1A04D]">
                      ${appointment.servicio_precio}
                    </div>
                  </div>
                </div>

                {/* Estado de la cita */}
                <div
                  className={`px-4 py-2 rounded-full border text-sm font-medium flex items-center ${getStatusColor(
                    appointment.cita_estado
                  )}`}
                >
                  {getStatusIcon(appointment.cita_estado)}
                  <span className="ml-2 capitalize">
                    {appointment.cita_estado}
                  </span>
                </div>
              </div>
            </div>

            {/* Contenido de la cita */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información del servicio */}
                <div className="space-y-4">
                  <div className="flex items-center text-[#B0B3B8]">
                    <BuildingStorefrontIcon className="w-5 h-5 mr-3 text-[#D1A04D]" />
                    <div>
                      <p className="text-sm text-[#B0B3B8]">Tienda</p>
                      <p className="text-[#F5F5F5] font-medium">
                        {appointment.tienda_nombre}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-[#B0B3B8]">
                    <UserIcon className="w-5 h-5 mr-3 text-[#D1A04D]" />
                    <div>
                      <p className="text-sm text-[#B0B3B8]">Profesional</p>
                      <p className="text-[#F5F5F5] font-medium">
                        {appointment.empleado_nombre}{" "}
                        {appointment.empleado_apellido}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fecha y hora */}
                <div className="space-y-4">
                  <div className="flex items-center text-[#B0B3B8]">
                    <CalendarIcon className="w-5 h-5 mr-3 text-[#D1A04D]" />
                    <div>
                      <p className="text-sm text-[#B0B3B8]">Fecha</p>
                      <p className="text-[#F5F5F5] font-medium">
                        {new Date(appointment.cita_fecha).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-[#B0B3B8]">
                    <ClockIcon className="w-5 h-5 mr-3 text-[#D1A04D]" />
                    <div>
                      <p className="text-sm text-[#B0B3B8]">Hora</p>
                      <p className="text-[#F5F5F5] font-medium">
                        {appointment.franja_hora_inicio}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="mt-6 pt-6 border-t border-[#31343A]/30">
                {appointment.cita_estado === "pendiente" && (
                  <button
                    onClick={() => handleCancelAppointment(appointment.cita_id)}
                    disabled={cancellingId === appointment.cita_id}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
                  >
                    {cancellingId === appointment.cita_id ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Cancelando...
                      </>
                    ) : (
                      <>
                        <XCircleIcon className="w-5 h-5 mr-3" />
                        Cancelar Cita
                      </>
                    )}
                  </button>
                )}

                {appointment.cita_estado === "cancelada" && (
                  <div className="text-center">
                    <span className="text-[#B0B3B8] text-sm">
                      Cancelada el{" "}
                      {new Date(
                        appointment.fecha_cancelacion ||
                          appointment.fecha_modificacion
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserAppointments;
