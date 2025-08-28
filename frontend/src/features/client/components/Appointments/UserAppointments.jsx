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
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "confirmada":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "completada":
        return "text-green-600 bg-green-50 border-green-200";
      case "cancelada":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-6">
        <p className="text-red-600">{error}</p>
        <button
          onClick={loadAppointments}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-12">
        <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No tienes citas programadas
        </h3>
        <p className="text-gray-500">Agenda tu primera cita para comenzar</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Mis Citas</h1>
        <p className="text-gray-600">Gestiona todas tus citas programadas</p>
      </div>

      <div className="space-y-6">
        {appointments.map((appointment) => (
          <div
            key={appointment.cita_id}
            className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              {/* Información principal */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {appointment.servicio_nombre}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <BuildingStorefrontIcon className="w-4 h-4 mr-2" />
                        <span>{appointment.tienda_nombre}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <UserIcon className="w-4 h-4 mr-2" />
                        <span>
                          {appointment.empleado_nombre}{" "}
                          {appointment.empleado_apellido}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        <span>
                          {new Date(
                            appointment.cita_fecha
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <ClockIcon className="w-4 h-4 mr-2" />
                        <span>{appointment.horario_hora_inicio}</span>
                      </div>
                    </div>
                  </div>

                  {/* Estado de la cita */}
                  <div
                    className={`px-3 py-1 rounded-full border text-sm font-medium flex items-center ${getStatusColor(
                      appointment.cita_estado
                    )}`}
                  >
                    {getStatusIcon(appointment.cita_estado)}
                    <span className="ml-1 capitalize">
                      {appointment.cita_estado}
                    </span>
                  </div>
                </div>

                {/* Precio */}
                <div className="text-lg font-bold text-orange-600">
                  ${appointment.servicio_precio}
                </div>
              </div>

              {/* Acciones */}
              <div className="mt-4 lg:mt-0 lg:ml-6">
                {appointment.cita_estado === "pendiente" && (
                  <button
                    onClick={() => handleCancelAppointment(appointment.cita_id)}
                    disabled={cancellingId === appointment.cita_id}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {cancellingId === appointment.cita_id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Cancelando...
                      </>
                    ) : (
                      <>
                        <XCircleIcon className="w-4 h-4 mr-2" />
                        Cancelar
                      </>
                    )}
                  </button>
                )}

                {appointment.cita_estado === "cancelada" && (
                  <span className="text-sm text-gray-500">
                    Cancelada el{" "}
                    {new Date(
                      appointment.fecha_cancelacion ||
                        appointment.fecha_modificacion
                    ).toLocaleDateString()}
                  </span>
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
