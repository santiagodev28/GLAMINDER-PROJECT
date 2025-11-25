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
import ProfileService from "../../../services/profileService";

const DashboardClient = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
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

      // Cargar datos del usuario y citas en paralelo
      const [userData, appointmentsData] = await Promise.all([
        ProfileService.getCurrentUser(),
        appointmentService.getUserAppointments(),
      ]);

      setUser(userData);
      setAppointments(appointmentsData);

      // Calcular estadísticas
      const statsData = {
        total: appointmentsData.length,
        pending: appointmentsData.filter(
          (apt) => apt.cita_estado === "pendiente"
        ).length,
        confirmed: appointmentsData.filter(
          (apt) => apt.cita_estado === "confirmada"
        ).length,
        completed: appointmentsData.filter(
          (apt) => apt.cita_estado === "completada"
        ).length,
        cancelled: appointmentsData.filter(
          (apt) => apt.cita_estado === "cancelada"
        ).length,
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
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-0">
      {/* Header del Dashboard */}
      <div className="backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            {/* Saludo con tipografía especial */}
            <div className="mb-4">
              <h1 className="text-3xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F5C76A] via-[#D1A04D] to-[#B47B1C] mb-3 font-serif tracking-wide">
                ¡Hola, {user?.usuario_nombre || "hermosa"}!
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] rounded-full mb-4"></div>
            </div>

            {/* Mensaje cálido */}
            <p className="text-[#F5F5F5] text-base sm:text-xl font-medium mb-2">
              Tu belleza merece lo mejor
            </p>
            <p className="text-[#B0B3B8] text-sm sm:text-lg">
              Descubre servicios increíbles y agenda tu próxima cita
            </p>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
        {/* Nueva Cita - Card principal */}
        <Link
          to="/cliente/negocios"
          className="group relative bg-gradient-to-br from-[#D1A04D] via-[#B47B1C] to-[#9A6B15] rounded-2xl p-6 sm:p-8 text-white hover:from-[#B47B1C] hover:to-[#D1A04D] transition-all duration-500 transform hover:-translate-y-2 shadow-2xl hover:shadow-3xl overflow-hidden"
        >
          {/* Efecto de brillo de fondo */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 rounded-2xl flex items-center justify-center transition-all duration-500">
                <PlusIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 transition-transform duration-500">
              Nueva Cita
            </h3>
            <p className="text-white/90 text-sm sm:text-lg mb-3 sm:mb-4">
              Reserva tu próxima experiencia de belleza
            </p>

            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                ¡Es gratis!
              </span>
              <ArrowRightIcon className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-500" />
            </div>
          </div>
        </Link>

        {/* Explorar Negocios */}
        <Link
          to="/cliente/negocios"
          className="group relative bg-black/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/20 hover:border-[#D1A04D]/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
        >
          {/* Efecto de partículas */}
          <div className="absolute top-4 right-4 w-2 h-2 bg-[#D1A04D] rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-8 right-8 w-1 h-1 bg-[#F5C76A] rounded-full opacity-40 group-hover:opacity-80 transition-opacity duration-500"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-2xl flex items-center justify-center transition-all duration-500">
                <BuildingStorefrontIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-[#F5F5F5] transition-transform duration-500">
              Explorar Negocios
            </h3>
            <p className="text-[#B0B3B8] text-sm sm:text-lg mb-3 sm:mb-4">
              Descubre salones y spas increíbles cerca de ti
            </p>
          </div>
        </Link>

        {/* Mis Citas */}
        <Link
          to="/cliente/mis-citas"
          className="group relative bg-black/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/20 hover:border-[#D1A04D]/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
        >
          {/* Efecto de partículas */}
          <div className="absolute top-4 right-4 w-2 h-2 bg-[#D1A04D] rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-8 right-8 w-1 h-1 bg-[#F5C76A] rounded-full opacity-40 group-hover:opacity-80 transition-opacity duration-500"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-2xl flex items-center justify-center transition-all duration-500">
                <CalendarIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-[#F5F5F5] transition-transform duration-500">
              Mis Citas
            </h3>
            <p className="text-[#B0B3B8] text-sm sm:text-lg mb-3 sm:mb-4">
              Gestiona y revisa todas tus reservas
            </p>

            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium bg-[#D1A04D]/20 text-[#D1A04D] px-3 py-1 rounded-full">
                {stats.pending} pendientes
              </span>
              <ArrowRightIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#B0B3B8] transition-all duration-500" />
            </div>
          </div>
        </Link>
      </div>

      {/* Próximas citas */}
      <div className="bg-black/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 hover:shadow-3xl transition-all duration-500">
        <div className="p-6 sm:p-8 border-b border-white/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-3xl font-bold text-[#F5F5F5] bg-gradient-to-r from-white to-[#F5C76A] bg-clip-text text-transparent">
                  Próximas Citas
                </h2>
                <p className="text-[#B0B3B8] text-sm sm:text-lg">Tu agenda de belleza</p>
              </div>
            </div>
            <Link
              to="/cliente/mis-citas"
              className="text-[#D1A04D] hover:text-[#F5C76A] font-semibold text-sm sm:text-lg flex items-center gap-2 sm:gap-3 transition-all duration-500 bg-[#D1A04D]/10 px-3 sm:px-4 py-2 rounded-xl hover:bg-[#D1A04D]/20 whitespace-nowrap"
            >
              Ver todas
              <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </div>

        <div className="p-5 sm:p-8">
          {appointments.filter((apt) => apt.cita_estado === "pendiente")
            .length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="relative mb-6 sm:mb-8">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-full flex items-center justify-center mx-auto shadow-2xl hover:shadow-3xl transition-all duration-500 hover:rotate-6">
                  <CalendarIcon className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                </div>
                {/* Efecto de brillo */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-[#F5F5F5] mb-3 sm:mb-4 bg-gradient-to-r from-white to-[#F5C76A] bg-clip-text text-transparent">
                ¡Tu agenda está vacía!
              </h3>
              <p className="text-[#B0B3B8] mb-6 sm:mb-8 max-w-lg mx-auto text-base sm:text-xl">
                Es hora de consentirte. Descubre servicios increíbles y agenda
                tu próxima experiencia de belleza.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link
                  to="/cliente/negocios"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white rounded-2xl hover:from-[#B47B1C] hover:to-[#D1A04D] transition-all duration-500 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 font-semibold text-base sm:text-lg"
                >
                  <PlusIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                  Agendar Cita
                </Link>
                <Link
                  to="/cliente/negocios"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-md text-white rounded-2xl hover:bg-white/20 transition-all duration-500 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 font-semibold text-base sm:text-lg border border-white/20"
                >
                  <BuildingStorefrontIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                  Explorar Negocios
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {appointments
                .filter((apt) => apt.cita_estado === "pendiente")
                .slice(0, 3)
                .map((appointment, index) => {
                  // Función para obtener el icono del servicio
                  const getServiceIcon = (serviceName) => {
                    const name = serviceName.toLowerCase();
                    if (name.includes("corte") || name.includes("pelo"))
                      return <UserIcon className="w-8 h-8 text-white" />;
                    if (name.includes("maquillaje") || name.includes("makeup"))
                      return <HeartIcon className="w-8 h-8 text-white" />;
                    if (name.includes("uñas") || name.includes("manicure"))
                      return <CalendarIcon className="w-8 h-8 text-white" />;
                    if (name.includes("facial") || name.includes("piel"))
                      return <HeartIcon className="w-8 h-8 text-white" />;
                    if (name.includes("masaje") || name.includes("relax"))
                      return <HeartIcon className="w-8 h-8 text-white" />;
                    if (name.includes("ceja") || name.includes("brow"))
                      return <UserIcon className="w-8 h-8 text-white" />;
                    return <HeartIcon className="w-8 h-8 text-white" />;
                  };

                  // Función para determinar si es hoy, mañana, etc.
                  const getTimeIndicator = (date) => {
                    const today = new Date();
                    const appointmentDate = new Date(date);
                    const diffTime = appointmentDate - today;
                    const diffDays = Math.ceil(
                      diffTime / (1000 * 60 * 60 * 24)
                    );

                    if (diffDays === 0)
                      return {
                        text: "Hoy",
                        color: "bg-red-500/20 text-red-400 border-red-500/30",
                      };
                    if (diffDays === 1)
                      return {
                        text: "Mañana",
                        color:
                          "bg-orange-500/20 text-orange-400 border-orange-500/30",
                      };
                    if (diffDays <= 7)
                      return {
                        text: "Esta semana",
                        color:
                          "bg-blue-500/20 text-blue-400 border-blue-500/30",
                      };
                    return {
                      text: "Próximamente",
                      color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
                    };
                  };

                  const timeIndicator = getTimeIndicator(
                    appointment.cita_fecha
                  );

                  return (
                    <div
                      key={appointment.cita_id}
                      className="group relative bg-black/80 backdrop-blur-sm rounded-2xl p-5 sm:p-8 hover:bg-black/90 transition-all duration-500 border border-white/20 hover:border-[#D1A04D]/50 hover:shadow-2xl transform hover:-translate-y-1 overflow-hidden"
                    >
                      {/* Efecto de brillo */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

                      <div className="relative z-10">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center space-x-4 sm:space-x-6 w-full sm:flex-1">
                            {/* Icono del servicio */}
                            <div className="relative flex-shrink-0">
                              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500">
                                {getServiceIcon(appointment.servicio_nombre)}
                              </div>
                              {/* Efecto de brillo en el icono */}
                              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>

                            <div className="flex-1">
                              <h4 className="font-bold text-[#F5F5F5] text-lg sm:text-xl mb-1 sm:mb-2 transition-transform duration-500">
                                {appointment.servicio_nombre}
                              </h4>
                              <p className="text-[#B0B3B8] text-sm sm:text-lg mb-2 sm:mb-3">
                                {appointment.tienda_nombre}
                              </p>

                              {/* Información de fecha y hora */}
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
                                <div className="flex items-center space-x-2">
                                  <CalendarIcon className="w-4 h-4 text-[#B0B3B8]" />
                                  <span className="text-xs sm:text-sm text-[#F5F5F5] font-medium">
                                    {new Date(
                                      appointment.cita_fecha
                                    ).toLocaleDateString("es-ES", {
                                      weekday: "short",
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <ClockIcon className="w-4 h-4 text-[#B0B3B8]" />
                                  <span className="text-xs sm:text-sm text-[#F5F5F5] font-medium">
                                    {appointment.horario_hora_inicio}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                            {/* Indicador de tiempo */}
                            <span
                              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all duration-500 text-center sm:text-left ${timeIndicator.color}`}
                            >
                              {timeIndicator.text}
                            </span>

                            {/* Estado de la cita */}
                            <span
                              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all duration-500 text-center sm:text-left ${getStatusColor(
                                appointment.cita_estado
                              )}`}
                            >
                              {appointment.cita_estado}
                            </span>

                            {/* Botón de opciones */}
                            <button className="text-[#B0B3B8] hover:text-[#F5F5F5] transition-all duration-500 p-2 sm:p-3 rounded-xl hover:bg-white/10 flex-shrink-0">
                              <svg
                                className="w-5 h-5 sm:w-6 sm:h-6"
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
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* Recomendaciones */}
      <div className="bg-black/90 rounded-2xl p-6 sm:p-8 border border-[#31343A]/50 shadow-2xl">
        <div className="text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
            <HeartIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#F5F5F5] mb-3 sm:mb-4">
            ¿Te gustó nuestro servicio?
          </h2>
          <p className="text-[#B0B3B8] mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-lg">
            Comparte tu experiencia y ayuda a otros clientes a encontrar los
            mejores negocios de belleza
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white rounded-lg hover:from-[#B47B1C] hover:to-[#D1A04D] transition-all duration-500 font-medium shadow-lg hover:shadow-xl transform text-sm sm:text-base">
              Dejar Reseña
            </button>
            <button className="px-6 sm:px-8 py-3 sm:py-4 bg-black/80 backdrop-blur-md text-[#D1A04D] rounded-lg hover:bg-black/90 transition-all duration-500 font-medium border border-[#D1A04D]/30 hover:border-[#D1A04D]/50 shadow-lg hover:shadow-xl transform text-sm sm:text-base">
              Compartir Experiencia
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 sm:mt-12 py-6 sm:py-8 text-center text-[#B0B3B8] text-xs sm:text-sm border-t border-[#31343A]/50">
        <div className="flex flex-col items-center gap-2">
          <span>
            © {new Date().getFullYear()} Glaminder. Todos los derechos
            reservados.
          </span>
          <span>
            Hecho con <span className="text-[#D1A04D]">♥</span> por el equipo
            Glaminder
          </span>
        </div>
      </footer>
    </div>
  );
};

export default DashboardClient;