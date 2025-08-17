import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import { fetchTopBusiness } from "../../../../services/adminService.js";

// Componente para mostrar los negocios con más calificaciones
const TopBusinesses = () => {
  const [negocios, setNegocios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopBusinesses = async () => {
      try {
        const data = await fetchTopBusiness();
        console.log("Negocios recibidos:", data); 
        setNegocios(data); 
      } catch (error) {
        console.error("Error al cargar los mejores negocios:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchTopBusinesses();
  }, []);
  

  if (loading) return <div>Cargando mejores negocios...</div>;

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 mt-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Building2 className="text-blue-600" /> Mejores negocios del mes
      </h2>
      <ul className="space-y-2">
        {negocios.map((n, index) => (
          <li key={n.negocio_id} className="flex flex-col">
            <div className="flex justify-between">
              <span>{index + 1}. {n.negocio_nombre}</span>
              <span className="text-yellow-600 font-bold">
                ⭐ {parseFloat(n.promedio_calificacion).toFixed(1)} ({n.total_calificaciones} calificaciones)
              </span>
            </div>
            <p className="text-sm text-gray-500">{n.negocio_descripcion}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopBusinesses;
