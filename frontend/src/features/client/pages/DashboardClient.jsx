import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  BuildingStorefrontIcon,
  PlusIcon,
  ArrowRightIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import appointmentService from "../../../services/appointmentService";

const DashboardClient = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getUserAppointments();
      setAppointments(data);

      // Calcular estadísticas
      const statsData = {
        total: data.length,
        pending: data.filter((apt) => apt.cita_estado === "pendiente").length,
        confirmed: data.filter((apt) => apt.cita_estado === "confirmada")
          .length,
        completed: data.filter((apt) => apt.cita_estado === "completada")
          .length,
        cancelled: data.filter((apt) => apt.cita_estado === "cancelada").length,
      };
      setStats(statsData);
    } catch (error) {
      console.error("Error cargando datos del dashboard:", error);
    } finally {
      setLoading(false);
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
        return <ClockIcon className="w-5 h-5" />;
      case "confirmada":
        return <CalendarIcon className="w-5 h-5" />;
      case "completada":
        return <CalendarIcon className="w-5 h-5" />;
      case "cancelada":
        return <CalendarIcon className="w-5 h-5" />;
      default:
        return <ClockIcon className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#D1A04D]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header del Dashboard */}
      <div className="bg-[#23262B]/95 backdrop-blur-md rounded-2xl p-8 border border-[#31343A]/50 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#F5F5F5] mb-2">
              ¡Bienvenido de vuelta!
            </h1>
            <p className="text-[#B0B3B8] text-lg">
              Gestiona tus citas y descubre nuevos negocios de belleza
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-full flex items-center justify-center shadow-lg">
              <UserIcon className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/cliente/nueva-cita"
          className="group bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-xl p-6 text-white hover:from-[#B47B1C] hover:to-[#D1A04D] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                <PlusIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Nueva Cita</h3>
              <p className="text-white/80">Agenda tu próxima cita</p>
            </div>
            <ArrowRightIcon className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </Link>

        <Link
          to="/cliente/negocios"
          className="group bg-[#23262B]/80 backdrop-blur-md rounded-xl p-6 border border-[#31343A]/50 hover:border-[#D1A04D]/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-lg flex items-center justify-center mb-3">
                <BuildingStorefrontIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#F5F5F5]">
                Explorar Negocios
              </h3>
              <p className="text-[#B0B3B8]">Descubre nuevos lugares</p>
            </div>
            <ArrowRightIcon className="w-6 h-6 text-[#B0B3B8] group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </Link>

        <Link
          to="/cliente/mis-citas"
          className="group bg-[#23262B]/80 backdrop-blur-md rounded-xl p-6 border border-[#31343A]/50 hover:border-[#D1A04D]/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-lg flex items-center justify-center mb-3">
                <CalendarIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#F5F5F5]">
                Mis Citas
              </h3>
              <p className="text-[#B0B3B8]">Gestiona tus reservas</p>
            </div>
            <ArrowRightIcon className="w-6 h-6 text-[#B0B3B8] group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </Link>
      </div>

      {/* Próximas citas */}
      <div className="bg-[#23262B]/80 backdrop-blur-md rounded-xl shadow-lg border border-[#31343A]/50">
        <div className="p-6 border-b border-[#31343A]/50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#F5F5F5]">
              Próximas Citas
            </h2>
            <Link
              to="/cliente/mis-citas"
              className="text-[#D1A04D] hover:text-[#F5C76A] font-medium text-sm flex items-center gap-2 transition-colors duration-300"
            >
              Ver todas
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="p-6">
          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CalendarIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-medium text-[#F5F5F5] mb-2">
                No tienes citas programadas
              </h3>
              <p className="text-[#B0B3B8] mb-6 max-w-md mx-auto">
                ¡Agenda tu primera cita y comienza a disfrutar de nuestros
                servicios!
              </p>
              <Link
                to="/cliente/nueva-cita"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white rounded-lg hover:from-[#B47B1C] hover:to-[#D1A04D] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Agendar Cita
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.slice(0, 3).map((appointment) => (
                <div
                  key={appointment.cita_id}
                  className="flex items-center justify-between p-4 bg-[#1F1F1F]/50 backdrop-blur-sm rounded-lg hover:bg-[#1F1F1F]/70 transition-all duration-300 border border-[#31343A]/30 hover:border-[#D1A04D]/30"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-lg flex items-center justify-center shadow-md">
                      <CalendarIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-[#F5F5F5]">
                        {appointment.servicio_nombre}
                      </h4>
                      <p className="text-sm text-[#B0B3B8]">
                        {appointment.tienda_nombre}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-[#B0B3B8]">
                          {new Date(
                            appointment.cita_fecha
                          ).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-[#B0B3B8]">
                          {appointment.horario_hora_inicio}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-300 ${getStatusColor(
                        appointment.cita_estado
                      )}`}
                    >
                      {appointment.cita_estado}
                    </span>
                    <button className="text-[#B0B3B8] hover:text-[#F5F5F5] transition-colors duration-300 p-1 rounded-lg hover:bg-[#31343A]/50">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recomendaciones */}
      <div className="bg-gradient-to-br from-[#23262B] to-[#1F1F1F] rounded-2xl p-8 border border-[#31343A]/50 shadow-2xl">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <HeartIcon className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#F5F5F5] mb-4">
            ¿Te gustó nuestro servicio?
          </h2>
          <p className="text-[#B0B3B8] mb-8 max-w-2xl mx-auto text-lg">
            Comparte tu experiencia y ayuda a otros clientes a encontrar los
            mejores negocios de belleza
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white rounded-lg hover:from-[#B47B1C] hover:to-[#D1A04D] transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105">
              Dejar Reseña
            </button>
            <button className="px-8 py-4 bg-[#23262B]/80 backdrop-blur-md text-[#D1A04D] rounded-lg hover:bg-[#31343A]/50 transition-all duration-300 font-medium border border-[#D1A04D]/30 hover:border-[#D1A04D]/50 shadow-lg hover:shadow-xl transform hover:scale-105">
              Compartir Experiencia
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardClient;
