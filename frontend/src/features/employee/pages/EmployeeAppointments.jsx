import { useState, useEffect } from "react";
import {
  CalendarIcon,
  MagnifyingGlassIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import EmployeeService from "../../../services/employeeService";

const EmployeeAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para obtener la fecha actual en formato YYYY-MM-DD
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Función para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible";

    // Crear la fecha en zona horaria local para evitar problemas de UTC
    const [year, month, day] = dateString.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

    if (isNaN(date.getTime())) {
      return "Fecha inválida";
    }

    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const [filters, setFilters] = useState({
    fecha: getCurrentDate(),
    estado: "todos",
  });

  // Debug: mostrar el estado de los filtros
  console.log("🔍 Estado actual de filters:", filters);
  console.log("📅 Fecha del filtro formateada:", formatDate(filters.fecha));

  useEffect(() => {
    loadAppointments();
  }, [filters]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const employee = await EmployeeService.getEmployeeFromStorage();

      if (employee && employee.id) {
        console.log("Filtros enviados:", filters);
        const appointmentsData = await EmployeeService.getEmployeeAppointments(
          employee.id,
          filters
        );
        console.log("Citas recibidas:", appointmentsData);
        console.log("Tipo de datos:", typeof appointmentsData);
        console.log("Es array:", Array.isArray(appointmentsData));
        if (Array.isArray(appointmentsData) && appointmentsData.length > 0) {
          console.log("Primera cita:", appointmentsData[0]);
          console.log(
            "Campos de la primera cita:",
            Object.keys(appointmentsData[0])
          );
        }
        setAppointments(appointmentsData);
      }
    } catch (error) {
      console.error("Error al cargar citas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAppointment = async (appointmentId) => {
    try {
      await EmployeeService.confirmAppointment(appointmentId);
      loadAppointments();
    } catch (error) {
      console.error("Error al confirmar cita:", error);
    }
  };

  const handleCompleteAppointment = async (appointmentId) => {
    try {
      await EmployeeService.completeAppointment(appointmentId);
      loadAppointments();
    } catch (error) {
      console.error("Error al completar cita:", error);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Hora no disponible";

    try {
      const time = new Date(`2000-01-01T${timeString}`);
      if (isNaN(time.getTime())) {
        return "Hora inválida";
      }

      return time.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Hora inválida";
    }
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case "confirmada":
        return "bg-green-100 text-green-800";
      case "pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "completada":
        return "bg-blue-100 text-blue-800";
      case "cancelada":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (estado) => {
    switch (estado) {
      case "confirmada":
        return "Confirmada";
      case "pendiente":
        return "Pendiente";
      case "completada":
        return "Completada";
      case "cancelada":
        return "Cancelada";
      default:
        return estado;
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="bg-[#23262B]/95 backdrop-blur-md rounded-2xl p-8 border border-[#31343A]/50 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#F5F5F5] mb-2">
              Mis Citas
            </h1>
            <p className="text-[#B0B3B8] text-lg">
              Gestiona tus citas programadas
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-full flex items-center justify-center shadow-lg">
              <CalendarIcon className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-[#23262B]/80 backdrop-blur-md rounded-xl p-6 border border-[#31343A]/50 shadow-xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-lg flex items-center justify-center shadow-lg">
            <MagnifyingGlassIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#F5F5F5]">Filtros</h2>
            <p className="text-[#B0B3B8] text-sm">
              Filtra tus citas por fecha y estado
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#B0B3B8] mb-2">
              Fecha
            </label>
            <input
              type="date"
              value={filters.fecha}
              onChange={(e) =>
                setFilters({ ...filters, fecha: e.target.value })
              }
              className="w-full px-4 py-3 bg-[#31343A]/50 border border-[#31343A]/30 rounded-lg text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#D1A04D] focus:border-transparent transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#B0B3B8] mb-2">
              Estado
            </label>
            <select
              value={filters.estado}
              onChange={(e) =>
                setFilters({ ...filters, estado: e.target.value })
              }
              className="w-full px-4 py-3 bg-[#31343A]/50 border border-[#31343A]/30 rounded-lg text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#D1A04D] focus:border-transparent transition-all duration-200"
            >
              <option value="todos">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="confirmada">Confirmada</option>
              <option value="completada">Completada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de citas */}
      <div className="bg-[#23262B]/80 backdrop-blur-md rounded-xl p-6 border border-[#31343A]/50 shadow-xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-lg flex items-center justify-center shadow-lg">
            <ClipboardDocumentListIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#F5F5F5]">
              Citas - {formatDate(filters.fecha)}
            </h2>
            <p className="text-[#B0B3B8] text-sm">Lista de citas programadas</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D1A04D]"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#31343A]/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="w-8 h-8 text-[#B0B3B8]" />
            </div>
            <p className="text-[#B0B3B8] text-lg">
              No tienes citas programadas para esta fecha
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment, index) => (
              <div
                key={appointment.cita_id || `appointment-${index}`}
                className="bg-[#31343A]/50 rounded-lg p-6 hover:bg-[#31343A]/70 transition-all duration-300 border border-[#31343A]/30 hover:shadow-lg"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="text-3xl font-bold text-[#D1A04D]">
                        {formatTime(appointment.franja_hora_inicio)}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          appointment.cita_estado
                        )}`}
                      >
                        {getStatusText(appointment.cita_estado)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-xl text-[#F5F5F5] mb-2">
                          {appointment.servicio_nombre || "Servicio"}
                        </h3>
                        <p className="text-[#B0B3B8] mb-3">
                          {appointment.servicio_descripcion ||
                            "Sin descripción"}
                        </p>
                        <div className="space-y-2">
                          <p>
                            <span className="font-medium text-[#B0B3B8]">
                              Cliente:
                            </span>{" "}
                            <span className="text-[#F5F5F5]">
                              {appointment.usuario_nombre
                                ? `${appointment.usuario_nombre} ${appointment.usuario_apellido}`
                                : "N/A"}
                            </span>
                          </p>
                          <p>
                            <span className="font-medium text-[#B0B3B8]">
                              Teléfono:
                            </span>{" "}
                            <span className="text-[#F5F5F5]">
                              {appointment.usuario_telefono || "N/A"}
                            </span>
                          </p>
                          <p>
                            <span className="font-medium text-[#B0B3B8]">
                              Email:
                            </span>{" "}
                            <span className="text-[#F5F5F5]">
                              {appointment.usuario_correo || "N/A"}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="bg-[#31343A]/30 rounded-lg p-4">
                          <p className="text-[#B0B3B8] mb-1">
                            <span className="font-medium">Duración:</span>{" "}
                            <span className="text-[#F5F5F5]">
                              {appointment.servicio_duracion || "N/A"} minutos
                            </span>
                          </p>
                          <p className="text-[#B0B3B8] mb-1">
                            <span className="font-medium">Precio:</span>{" "}
                            <span className="text-[#F5F5F5]">
                              ${appointment.servicio_precio || "N/A"}
                            </span>
                          </p>
                          <p className="text-[#B0B3B8]">
                            <span className="font-medium">Hora de fin:</span>{" "}
                            <span className="text-[#F5F5F5]">
                              {formatTime(appointment.franja_hora_fin)}
                            </span>
                          </p>
                        </div>

                        {appointment.cita_observaciones && (
                          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                            <p className="font-medium text-yellow-400 mb-1">
                              Observaciones:
                            </p>
                            <p className="text-sm text-[#B0B3B8]">
                              {appointment.cita_observaciones}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    {appointment.cita_estado === "pendiente" && (
                      <button
                        onClick={() =>
                          handleConfirmAppointment(appointment.cita_id)
                        }
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        Confirmar Cita
                      </button>
                    )}
                    {appointment.cita_estado === "confirmada" && (
                      <button
                        onClick={() =>
                          handleCompleteAppointment(appointment.cita_id)
                        }
                        className="bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-[#B47B1C] hover:to-[#D1A04D] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        Marcar como Completada
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeAppointments;
