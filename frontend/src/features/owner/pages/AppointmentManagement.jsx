import React, { useState, useEffect } from "react";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import OwnerService from "../../../services/ownerService";

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [ownerData, setOwnerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    date: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (ownerData) {
      loadAppointments();
    }
  }, [filters, ownerData]);

  const loadData = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("usuario"));
      const ownerData = await OwnerService.getOwnerByUserId(user.usuario_id);
      const businessesData = await OwnerService.getOwnerBusinesses(
        ownerData.propietario_id
      );
      setOwnerData(ownerData);
      setBusinesses(businessesData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const loadAppointments = async () => {
    try {
      const queryFilters = {};
      if (filters.status) queryFilters.estado = filters.status;
      if (filters.date) queryFilters.fecha = filters.date;

      const appointmentsData = await OwnerService.getAppointmentsByOwner(
        ownerData.propietario_id,
        queryFilters
      );
      setAppointments(appointmentsData);
    } catch (error) {
      console.error("Error al cargar citas:", error);
      setError("Error al cargar las citas");
    }
  };

  const handleConfirmAppointment = async (appointmentId) => {
    try {
      await OwnerService.confirmAppointment(appointmentId);
      loadAppointments();
    } catch (error) {
      console.error("Error al confirmar cita:", error);
      alert("Error al confirmar la cita");
    }
  };

  const handleCancelAppointment = async (appointmentId, reason) => {
    try {
      await OwnerService.cancelAppointment(appointmentId, reason);
      loadAppointments();
    } catch (error) {
      console.error("Error al cancelar cita:", error);
      alert("Error al cancelar la cita");
    }
  };

  const handleCompleteAppointment = async (appointmentId) => {
    try {
      await OwnerService.completeAppointment(appointmentId);
      loadAppointments();
    } catch (error) {
      console.error("Error al completar cita:", error);
      alert("Error al completar la cita");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pendiente":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "confirmada":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "completada":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "cancelada":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const getStatusActions = (appointment) => {
    const actions = [];

    if (appointment.cita_estado === "pendiente") {
      actions.push(
        <button
          key="confirm"
          onClick={() => handleConfirmAppointment(appointment.cita_id)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <CheckCircleIcon className="w-4 h-4 inline mr-1" />
          Confirmar
        </button>
      );
      actions.push(
        <button
          key="cancel"
          onClick={() => {
            const reason = prompt("Motivo de cancelación:");
            if (reason) handleCancelAppointment(appointment.cita_id, reason);
          }}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg text-sm hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <XCircleIcon className="w-4 h-4 inline mr-1" />
          Cancelar
        </button>
      );
    }

    if (appointment.cita_estado === "confirmada") {
      actions.push(
        <button
          key="complete"
          onClick={() => handleCompleteAppointment(appointment.cita_id)}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg text-sm hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <CheckCircleIcon className="w-4 h-4 inline mr-1" />
          Completar
        </button>
      );
    }

    return actions;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#D1A04D]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-4 py-6 sm:p-6">
      {/* Header del Dashboard */}
      <div className="bg-[#23262B]/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-[#31343A]/50 shadow-2xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#F5F5F5] mb-2">
              Gestión de Citas
            </h1>
            <p className="text-[#B0B3B8] text-lg">
              Administra las citas de tus negocios
            </p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-[#23262B]/80 backdrop-blur-md rounded-xl p-6 border border-[#31343A]/50 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#B0B3B8] mb-2">
              Estado
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="w-full px-4 py-3 bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#31343A]/50 rounded-xl text-[#F5F5F5] focus:ring-2 focus:ring-[#D1A04D]/50 focus:border-[#D1A04D]/50 transition-all duration-300"
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="confirmada">Confirmada</option>
              <option value="completada">Completada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#B0B3B8] mb-2">
              Fecha
            </label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="w-full px-4 py-3 bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#31343A]/50 rounded-xl text-[#F5F5F5] focus:ring-2 focus:ring-[#D1A04D]/50 focus:border-[#D1A04D]/50 transition-all duration-300"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setFilters({ status: "", date: "" })}
              className="w-full bg-[#31343A] text-[#B0B3B8] py-3 px-6 rounded-xl hover:bg-[#3A3F47] hover:text-[#F5F5F5] transition-all duration-300 font-medium"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-[#23262B]/80 backdrop-blur-md rounded-xl p-6 border border-[#31343A]/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 flex-shrink-0">
              <ExclamationTriangleIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#B0B3B8]">Pendientes</p>
              <p className="text-2xl font-semibold text-[#F5F5F5]">
                {
                  appointments.filter((apt) => apt.cita_estado === "pendiente")
                    .length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#23262B]/80 backdrop-blur-md rounded-xl p-6 border border-[#31343A]/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex-shrink-0">
              <CheckCircleIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#B0B3B8]">Confirmadas</p>
              <p className="text-2xl font-semibold text-[#F5F5F5]">
                {
                  appointments.filter((apt) => apt.cita_estado === "confirmada")
                    .length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#23262B]/80 backdrop-blur-md rounded-xl p-6 border border-[#31343A]/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 flex-shrink-0">
              <CheckCircleIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#B0B3B8]">Completadas</p>
              <p className="text-2xl font-semibold text-[#F5F5F5]">
                {
                  appointments.filter((apt) => apt.cita_estado === "completada")
                    .length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#23262B]/80 backdrop-blur-md rounded-xl p-6 border border-[#31343A]/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 flex-shrink-0">
              <XCircleIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#B0B3B8]">Canceladas</p>
              <p className="text-2xl font-semibold text-[#F5F5F5]">
                {
                  appointments.filter((apt) => apt.cita_estado === "cancelada")
                    .length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de citas */}
      <div className="bg-[#23262B]/80 backdrop-blur-md rounded-xl border border-[#31343A]/50 shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-[#31343A]/50">
          <h2 className="text-lg font-semibold text-[#F5F5F5]">Citas</h2>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CalendarIcon className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-lg font-medium text-[#F5F5F5] mb-2">
              No hay citas
            </h3>
            <p className="text-[#B0B3B8]">
              No se encontraron citas con los filtros aplicados
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#31343A]/50">
              <thead className="bg-[#1F1F1F]/30">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#B0B3B8] uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#B0B3B8] uppercase tracking-wider">
                    Servicio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#B0B3B8] uppercase tracking-wider">
                    Empleado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#B0B3B8] uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#B0B3B8] uppercase tracking-wider">
                    Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#B0B3B8] uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#B0B3B8] uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[#23262B]/50 divide-y divide-[#31343A]/50">
                {appointments.map((appointment) => (
                  <tr
                    key={appointment.cita_id}
                    className="hover:bg-[#1F1F1F]/20 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-[#F5F5F5]">
                          {appointment.cliente?.nombre || "N/A"}
                        </div>
                        <div className="text-sm text-[#B0B3B8]">
                          {appointment.cliente?.correo || "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#F5F5F5]">
                        {appointment.servicio?.servicio_nombre || "N/A"}
                      </div>
                      <div className="text-sm text-[#D1A04D] font-medium">
                        ${appointment.servicio?.servicio_precio || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#F5F5F5]">
                        {appointment.empleado?.usuario?.nombre || "N/A"}
                      </div>
                      <div className="text-sm text-[#B0B3B8]">
                        {appointment.empleado?.empleado_especialidad || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F5F5F5]">
                      {new Date(appointment.cita_fecha).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F5F5F5]">
                      {appointment.cita_hora}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                          appointment.cita_estado
                        )}`}
                      >
                        {appointment.cita_estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {getStatusActions(appointment)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentManagement;
