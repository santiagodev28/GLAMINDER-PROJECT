import { useEffect, useState } from "react";
import {
  UserGroupIcon,
  CalendarIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import AdminService from "../../../../services/adminService.js";

// Componente para mostrar los empleados más agendados por negocio
const TopEmployees = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopEmployeesByBussines = async () => {
      try {
        const response = await AdminService.fetchTopEmployees();
        console.log(response);
        setEmpleados(response);
      } catch (error) {
        console.error("Error al cargar los mejores empleados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopEmployeesByBussines();
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

  return (
    <div className="bg-[#23262B]/80 backdrop-blur-md rounded-xl shadow-lg border border-[#31343A]/50">
      <div className="p-6 border-b border-[#31343A]/50">
        <h2 className="text-xl font-semibold text-[#F5F5F5] flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-lg flex items-center justify-center shadow-lg">
            <TrophyIcon className="w-6 h-6 text-white" />
          </div>
          Mejores Empleados del Mes
        </h2>
      </div>
      <div className="p-6">
        {empleados.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[#B0B3B8]">
              No hay empleados con citas registradas aún
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {empleados.map((emp, index) => (
              <li
                key={emp.empleado_id}
                className="p-4 bg-[#1F1F1F]/50 backdrop-blur-sm rounded-lg hover:bg-[#1F1F1F]/70 transition-all duration-300 border border-[#31343A]/30 hover:border-[#D1A04D]/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-full flex items-center justify-center shadow-md text-white font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <UserGroupIcon className="w-4 h-4 text-[#B0B3B8]" />
                        <h3 className="font-semibold text-[#F5F5F5]">
                          {emp.empleado_nombre} {emp.empleado_apellido}
                        </h3>
                      </div>
                      <p className="text-sm text-[#B0B3B8]">
                        {emp.empleado_especialidad || "Sin especialidad"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-[#D1A04D]/10 px-4 py-2 rounded-lg border border-[#D1A04D]/30">
                    <CalendarIcon className="w-5 h-5 text-[#D1A04D]" />
                    <span className="font-bold text-[#D1A04D]">
                      {emp.total_citas}
                    </span>
                    <span className="text-sm text-[#B0B3B8]">citas</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TopEmployees;
