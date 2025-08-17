import { Card, CardContent } from "../../../../components/ui/card";
import { Users, Building2, UserCheck, Group } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchStatsOverview } from "../../../../services/adminService.js";

// Mapeo de íconos para las estadísticas
const iconMap = {
  usuarios: Users,
  negocios: Building2,
  empleados: UserCheck,
  clientes: Group,
};

// Componente para mostrar las estadísticas generales
const StatsOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchStatsOverview();
        console.log(data);
        setStats(data[0]);
      } catch (error) {
        setError("Error al cargar las estadísticas");
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return <div>Cargando estadísticas...</div>;
  if (error) return <div>Error: {error}</div>;

  const formattedStats = [
    {
        title: "Usuarios",
        key: "total_usuarios",
        icon: iconMap.usuarios,
        description: "Usuarios registrados",
    },
    {
        title: "Negocios",
        key: "total_negocios",
        icon: iconMap.negocios,
        description: "Negocios registrados",
    },
    {
        title: "Empleados",
        key: "total_empleados",
        icon: iconMap.empleados,
        description: "Empleados registrados",
    },
    {
        title: "Clientes",
        key: "total_clientes",
        icon: iconMap.clientes,
        description: "Clientes registrados",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {formattedStats.map((stat, i) => (
      <Card key={i} className="bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300">
        <CardContent className="flex flex-col gap-2">
          <stat.icon className="w-6 h-6 text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">{stat.title}</p>
            <p className="text-2xl font-bold">{stats[stat.key]}</p>
            <p className="text-xs text-gray-400">{stat.description}</p>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
  );
};

export default StatsOverview;