import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  StatsOverview,
  TopEmployees,
  TopBusinesses,
  UserTrendChart,
} from "../components/AdminStats/index.js";
import {
  UserGroupIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

// Página de dashboard para el administrador
const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const rol = Number(localStorage.getItem("rol_id"));

    if (!token || rol !== 1) {
      navigate("/"); // Redirigir al login si no es admin
    }
  }, [navigate]);

  const name = localStorage.getItem("usuario_nombre");
  const lname = localStorage.getItem("usuario_apellido");

  return (
    <div className="space-y-8 p-6">
      {/* Header del Dashboard */}
      <div className="bg-[#23262B]/95 backdrop-blur-md rounded-2xl p-8 border border-[#31343A]/50 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#F5F5F5] mb-2">
              ¡Bienvenido, {name} {lname}!
            </h1>
            <p className="text-[#B0B3B8] text-lg">
              Panel de administración del sistema Glaminder
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-full flex items-center justify-center shadow-lg">
              <Cog6ToothIcon className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas generales */}
      <div>
        <h2 className="text-2xl font-bold text-[#F5F5F5] mb-6">
          Estadísticas Generales
        </h2>
        <StatsOverview />
      </div>

      {/* Gráfico de tendencias de usuarios */}
      <div>
        <h2 className="text-2xl font-bold text-[#F5F5F5] mb-6">
          Tendencias de Usuarios
        </h2>
        <UserTrendChart />
      </div>

      {/* Top Negocios y Empleados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopBusinesses />
        <TopEmployees />
      </div>
    </div>
  );
};

export default AdminDashboard;
