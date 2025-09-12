import { useState, useEffect } from "react";
import {
  BuildingOfficeIcon,
  BuildingStorefrontIcon,
  CalendarIcon,
  CheckCircleIcon,
  WrenchScrewdriverIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import EmployeeService from "../../../services/employeeService";

const EmployeeDashboard = () => {
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [employeeServices, setEmployeeServices] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployeeData();
  }, []);

  const loadEmployeeData = async () => {
    try {
      setLoading(true);

      // Obtener información del empleado
      const employee = await EmployeeService.getEmployeeFromStorage();
      setEmployeeInfo(employee);

      if (employee && employee.id) {
        // Obtener citas de hoy
        const appointments = await EmployeeService.getTodayAppointments(
          employee.id
        );
        setTodayAppointments(appointments);

        // Obtener servicios del empleado
        const services = await EmployeeService.getEmployeeServices(employee.id);
        setEmployeeServices(services);

        // Obtener estadísticas
        const employeeStats = await EmployeeService.getEmployeeStats(
          employee.id
        );
        setStats(employeeStats);
      }
    } catch (error) {
      console.error("Error al cargar datos del empleado:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAppointment = async (appointmentId) => {
    try {
      await EmployeeService.confirmAppointment(appointmentId);
      loadEmployeeData(); // Recargar datos
    } catch (error) {
      console.error("Error al confirmar cita:", error);
    }
  };

  const handleCompleteAppointment = async (appointmentId) => {
    try {
      await EmployeeService.completeAppointment(appointmentId);
      loadEmployeeData(); // Recargar datos
    } catch (error) {
      console.error("Error al completar cita:", error);
    }
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#D1A04D]"></div>
      </div>
    );
  }

  if (!employeeInfo) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">
            No se pudo cargar la información del empleado
          </div>
          <button
            onClick={loadEmployeeData}
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
              ¡Hola, {employeeInfo.nombre}!
            </h1>
            <p className="text-[#B0B3B8] text-lg">
              Bienvenido a tu panel de empleado
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-full flex items-center justify-center shadow-lg">
              <UserIcon className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Información del negocio y tienda */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#23262B]/80 backdrop-blur-md rounded-xl p-6 border border-[#31343A]/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-lg flex items-center justify-center shadow-lg">
              <BuildingOfficeIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#F5F5F5]">
                Información del Negocio
              </h2>
              <p className="text-[#B0B3B8] text-sm">Datos de la empresa</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-[#B0B3B8] text-sm font-medium">Nombre</p>
              <p className="text-[#F5F5F5] text-lg font-semibold">
                {employeeInfo.negocio?.nombre || "No disponible"}
              </p>
            </div>
            <div>
              <p className="text-[#B0B3B8] text-sm font-medium">Dirección</p>
              <p className="text-[#F5F5F5]">
                {employeeInfo.negocio?.direccion || "No disponible"}
              </p>
            </div>
            <div>
              <p className="text-[#B0B3B8] text-sm font-medium">Teléfono</p>
              <p className="text-[#F5F5F5]">
                {employeeInfo.negocio?.telefono || "No disponible"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#23262B]/80 backdrop-blur-md rounded-xl p-6 border border-[#31343A]/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-lg flex items-center justify-center shadow-lg">
              <BuildingStorefrontIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#F5F5F5]">
                Información de la Tienda
              </h2>
              <p className="text-[#B0B3B8] text-sm">Tu lugar de trabajo</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-[#B0B3B8] text-sm font-medium">Nombre</p>
              <p className="text-[#F5F5F5] text-lg font-semibold">
                {employeeInfo.tienda?.nombre || "No disponible"}
              </p>
            </div>
            <div>
              <p className="text-[#B0B3B8] text-sm font-medium">Dirección</p>
              <p className="text-[#F5F5F5]">
                {employeeInfo.tienda?.direccion || "No disponible"}
              </p>
            </div>
            <div>
              <p className="text-[#B0B3B8] text-sm font-medium">Ciudad</p>
              <p className="text-[#F5F5F5]">
                {employeeInfo.tienda?.ciudad || "No disponible"}
              </p>
            </div>
            <div>
              <p className="text-[#B0B3B8] text-sm font-medium">Teléfono</p>
              <p className="text-[#F5F5F5]">
                {employeeInfo.tienda?.telefono || "No disponible"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#23262B]/80 backdrop-blur-md rounded-xl p-6 border border-[#31343A]/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#B0B3B8] text-sm font-medium">Citas de Hoy</p>
              <p className="text-2xl font-bold text-[#F5F5F5]">
                {stats?.citas_hoy || 0}
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
              <p className="text-[#B0B3B8] text-sm font-medium">Completadas</p>
              <p className="text-2xl font-bold text-[#F5F5F5]">
                {stats?.citas_completadas || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-lg flex items-center justify-center shadow-lg">
              <CheckCircleIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-[#23262B]/80 backdrop-blur-md rounded-xl p-6 border border-[#31343A]/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#B0B3B8] text-sm font-medium">Servicios</p>
              <p className="text-2xl font-bold text-[#F5F5F5]">
                {employeeServices.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-lg flex items-center justify-center shadow-lg">
              <WrenchScrewdriverIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Citas de hoy */}
      <div className="bg-[#23262B]/80 backdrop-blur-md rounded-xl p-6 border border-[#31343A]/50 shadow-xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-lg flex items-center justify-center shadow-lg">
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#F5F5F5]">
              Citas de Hoy
            </h2>
            <p className="text-[#B0B3B8] text-sm">{formatDate(new Date())}</p>
          </div>
        </div>

        {todayAppointments.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#31343A]/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="w-8 h-8 text-[#B0B3B8]" />
            </div>
            <p className="text-[#B0B3B8] text-lg">
              No tienes citas programadas para hoy
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {todayAppointments.map((appointment, index) => (
              <div
                key={appointment.id || `today-appointment-${index}`}
                className="bg-[#31343A]/50 rounded-lg p-4 hover:bg-[#31343A]/70 transition-all duration-300 border border-[#31343A]/30"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <span className="text-2xl font-bold text-[#D1A04D]">
                        {formatTime(appointment.hora_inicio)}
                      </span>
                      <span className="text-[#F5F5F5] font-medium">
                        {appointment.servicio?.nombre || "Servicio"}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          appointment.estado === "confirmada"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : appointment.estado === "pendiente"
                            ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                            : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                        }`}
                      >
                        {appointment.estado}
                      </span>
                    </div>
                    <div className="text-[#B0B3B8] space-y-1">
                      <p>
                        <span className="font-medium">Cliente:</span>{" "}
                        <span className="text-[#F5F5F5]">
                          {appointment.cliente?.nombre || "N/A"}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">Duración:</span>{" "}
                        <span className="text-[#F5F5F5]">
                          {appointment.servicio?.duracion || "N/A"} minutos
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">Precio:</span>{" "}
                        <span className="text-[#F5F5F5]">
                          ${appointment.servicio?.precio || "N/A"}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {appointment.estado === "pendiente" && (
                      <button
                        onClick={() => handleConfirmAppointment(appointment.id)}
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        Confirmar
                      </button>
                    )}
                    {appointment.estado === "confirmada" && (
                      <button
                        onClick={() =>
                          handleCompleteAppointment(appointment.id)
                        }
                        className="bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-[#B47B1C] hover:to-[#D1A04D] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        Completar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Servicios que ofrece */}
      <div className="bg-[#23262B]/80 backdrop-blur-md rounded-xl p-6 border border-[#31343A]/50 shadow-xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-lg flex items-center justify-center shadow-lg">
            <WrenchScrewdriverIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#F5F5F5]">
              Servicios que Ofreces
            </h2>
            <p className="text-[#B0B3B8] text-sm">
              Servicios que puedes realizar
            </p>
          </div>
        </div>

        {employeeServices.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#31343A]/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <WrenchScrewdriverIcon className="w-8 h-8 text-[#B0B3B8]" />
            </div>
            <p className="text-[#B0B3B8] text-lg">
              No tienes servicios asignados
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {employeeServices.map((service, index) => (
              <div
                key={service.id || `service-${index}`}
                className="bg-[#31343A]/50 rounded-lg p-4 hover:bg-[#31343A]/70 transition-all duration-300 border border-[#31343A]/30 hover:shadow-lg transform hover:scale-105"
              >
                <h3 className="font-semibold text-lg mb-2 text-[#F5F5F5]">
                  {service.nombre}
                </h3>
                <p className="text-[#B0B3B8] text-sm mb-3">
                  {service.descripcion}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-[#D1A04D] font-bold text-lg">
                    ${service.precio}
                  </span>
                  <span className="text-[#B0B3B8] text-sm">
                    {service.duracion} min
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
