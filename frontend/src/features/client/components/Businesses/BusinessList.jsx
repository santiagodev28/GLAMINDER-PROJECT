import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminService from "../../../../services/adminService"

const BusinessList = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadBusinesses = async () => {
      try {
        const data = await AdminService.fetchBusinesses();
        setBusinesses(data);
      } catch (error) {
        console.error("Error al cargar negocios:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBusinesses();
  }, []);

  if (loading) return <p className="text-center mt-6">Cargando negocios...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6 ">
      {businesses.map((biz) => (
        <div
          key={biz.negocio_id}
          className="bg-white shadow-md rounded-2xl p-6 border hover:shadow-lg transition duration-300 flex flex-col justify-between"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {biz.negocio_nombre}
          </h2>
          <p className="text-gray-600 mb-2">{biz.negocio_descripcion}</p>
          <p className="text-sm text-gray-500">
            {biz.negocio_telefono}
          </p>
          <p className="text-sm text-gray-500">
             {biz.negocio_correo}
          </p>
          <p className="text-xs text-gray-400 mt-2 mb-4">
            Registrado el: {new Date(biz.negocio_fecha_registro).toLocaleDateString()}
          </p>

          <button
            onClick={() => navigate(`/cliente/negocios/${biz.negocio_id}`)}
            className="mt-auto bg-yellow-500 text-white font-semibold px-5 py-2 rounded-xl shadow-md 
             hover:bg-yellow-600 hover:shadow-lg active:scale-95 transition-all duration-200"
          >
            Ver Negocio
          </button>

        </div>
      ))}
    </div>
  );
};

export default BusinessList;
