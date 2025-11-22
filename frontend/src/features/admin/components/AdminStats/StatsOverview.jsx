import { useState, useEffect } from "react";
import AdminService from "../../../../services/adminService.js";
import {
  UserGroupIcon,
  BuildingStorefrontIcon,
  UsersIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

// Componente para mostrar las estadísticas generales
const StatsOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await AdminService.fetchStatsOverview();
        console.log(data);
        setStats(data);
      } catch {
        setError("Error al cargar las estadísticas");
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D1A04D]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
        <p className="text-red-400 text-center">{error}</p>
      </div>
    );
  }

  const formattedStats = [
    {
      title: "Total Usuarios",
      key: "total_usuarios",
      icon: UserGroupIcon,
      description: "Usuarios registrados",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Negocios",
      key: "total_negocios",
      icon: BuildingStorefrontIcon,
      description: "Negocios activos",
      gradient: "from-[#D1A04D] to-[#B47B1C]",
    },
    {
      title: "Empleados",
      key: "total_empleados",
      icon: UsersIcon,
      description: "Empleados activos",
      gradient: "from-green-500 to-green-600",
    },
    {
      title: "Clientes",
      key: "total_clientes",
      icon: UserIcon,
      description: "Clientes registrados",
      gradient: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {formattedStats.map((stat, i) => (
        <div
          key={i}
          className="bg-[#23262B]/80 backdrop-blur-md rounded-xl p-6 border border-[#31343A]/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#B0B3B8] text-sm font-medium">
                {stat.title}
              </p>
              <p className="text-2xl font-bold text-[#F5F5F5] mt-1">
                {stats ? (
                  <span>{stats[stat.key] || 0}</span>
                ) : (
                  <span>0</span>
                )}
              </p>
              <p className="text-xs text-[#B0B3B8] mt-1">
                {stat.description}
              </p>
            </div>
            <div
              className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-lg flex items-center justify-center shadow-lg`}
            >
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;
