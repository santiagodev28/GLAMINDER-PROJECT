import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import AdminService from "../../../../services/adminService.js";

// Componente para mostrar los usuarios registrados por mes
const UserTrendChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AdminService.fetchUserRegistrationTrends();
        console.log(response);

        const formattedData = response.map((item) => {
          // Descomponemos "YYYY-MM"
          const [year, month] = item.mes.split("-");

          // Convertimos a formato "Mes Año"
          const dateMonthYear = new Date(
            parseInt(year),
            parseInt(month) - 1 // en JS enero = 0
          ).toLocaleString("es-CO", {
            month: "short",
            year: "numeric",
          });

          return {
            mes: dateMonthYear,
            usuarios: item.total_usuarios,
          };
        });
        setData(formattedData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#23262B]/80 backdrop-blur-md rounded-xl p-6 border border-[#31343A]/50">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#D1A04D]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
        <p className="text-red-400 text-center">
          Error al cargar los datos: {error.message}
        </p>
      </div>
    );
  }

  // Custom tooltip con el diseño oscuro
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#23262B] border border-[#31343A] rounded-lg p-3 shadow-xl">
          <p className="text-[#B0B3B8] text-sm">{payload[0].payload.mes}</p>
          <p className="text-[#D1A04D] font-bold text-lg">
            {payload[0].value} usuarios
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#23262B]/80 backdrop-blur-md rounded-xl shadow-lg border border-[#31343A]/50">
      <div className="p-6 border-b border-[#31343A]/50">
        <h2 className="text-xl font-semibold text-[#F5F5F5] flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-lg flex items-center justify-center shadow-lg">
            <ChartBarIcon className="w-6 h-6 text-white" />
          </div>
          Usuarios Registrados por Mes
        </h2>
      </div>
      <div className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#31343A" />
            <XAxis 
              dataKey="mes" 
              stroke="#B0B3B8"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#B0B3B8"
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="usuarios"
              stroke="#D1A04D"
              strokeWidth={3}
              dot={{
                r: 6,
                stroke: "#D1A04D",
                strokeWidth: 2,
                fill: "#23262B",
              }}
              activeDot={{
                r: 8,
                stroke: "#D1A04D",
                strokeWidth: 2,
                fill: "#D1A04D",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserTrendChart;
