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
        pending: data.filter((apt) => apt.status === "pendiente").length,
        confirmed: data.filter((apt) => apt.status === "confirmada").length,
        completed: data.filter((apt) => apt.status === "completada").length,
        cancelled: data.filter((apt) => apt.status === "cancelada").length,
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
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header del Dashboard */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-8 border border-orange-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ¡Bienvenido de vuelta! 👋
            </h1>
            <p className="text-gray-600 text-lg">
              Gestiona tus citas y descubre nuevos negocios de belleza
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
              <UserIcon className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Citas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Confirmadas</p>
              <p className="text-2xl font-bold text-blue-600">
                {stats.confirmed}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completadas</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.completed}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Canceladas</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.cancelled}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/cliente/nueva-cita"
          className="group bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl p-6 text-white hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 transform hover:scale-105"
        >
          <div className="flex items-center justify-between">
            <div>
              <PlusIcon className="w-8 h-8 mb-3" />
              <h3 className="text-xl font-semibold mb-2">Nueva Cita</h3>
              <p className="text-orange-100">Agenda tu próxima cita</p>
            </div>
            <ArrowRightIcon className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        </Link>

        <Link
          to="/cliente/negocios"
          className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          <div className="flex items-center justify-between">
            <div>
              <BuildingStorefrontIcon className="w-8 h-8 mb-3 text-orange-500" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                Explorar Negocios
              </h3>
              <p className="text-gray-600">Descubre nuevos lugares</p>
            </div>
            <ArrowRightIcon className="w-6 h-6 text-gray-400 group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        </Link>

        <Link
          to="/cliente/mis-citas"
          className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          <div className="flex items-center justify-between">
            <div>
              <CalendarIcon className="w-8 h-8 mb-3 text-orange-500" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                Mis Citas
              </h3>
              <p className="text-gray-600">Gestiona tus reservas</p>
            </div>
            <ArrowRightIcon className="w-6 h-6 text-gray-400 group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        </Link>
      </div>

      {/* Próximas citas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Próximas Citas
            </h2>
            <Link
              to="/cliente/mis-citas"
              className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-2"
            >
              Ver todas
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="p-6">
          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tienes citas programadas
              </h3>
              <p className="text-gray-500 mb-4">
                ¡Agenda tu primera cita y comienza a disfrutar de nuestros
                servicios!
              </p>
              <Link
                to="/cliente/nueva-cita"
                className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Agendar Cita
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.slice(0, 3).map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <CalendarIcon className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {appointment.serviceName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {appointment.businessName}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500">
                          {new Date(appointment.date).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {appointment.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
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
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
        <div className="text-center">
          <HeartIcon className="w-16 h-16 text-purple-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ¿Te gustó nuestro servicio?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Comparte tu experiencia y ayuda a otros clientes a encontrar los
            mejores negocios de belleza
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium">
              Dejar Reseña
            </button>
            <button className="px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium border border-purple-200">
              Compartir Experiencia
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardClient;
