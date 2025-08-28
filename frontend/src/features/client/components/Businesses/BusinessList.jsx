import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AdminService from "../../../../services/adminService";

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
    <div className="p-6">
      {/* Header con botón de mis citas */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Negocios Disponibles
          </h1>
          <p className="text-gray-600">
            Explora y agenda citas en los mejores negocios de belleza
          </p>
        </div>

        <div className="mt-4 sm:mt-0">
          <Link
            to="/cliente/mis-citas"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Mis Citas
          </Link>
        </div>
      </div>

      {/* Grid de negocios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {businesses.map((biz) => (
          <div
            key={biz.negocio_id}
            className="bg-white shadow-md rounded-2xl p-6 border hover:shadow-lg transition duration-300 flex flex-col justify-between"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {biz.negocio_nombre}
            </h2>
            <p className="text-gray-600 mb-2">{biz.negocio_descripcion}</p>
            <p className="text-sm text-gray-500">{biz.negocio_telefono}</p>
            <p className="text-sm text-gray-500">{biz.negocio_correo}</p>
            <p className="text-xs text-gray-400 mt-2 mb-4">
              Registrado el:{" "}
              {new Date(biz.negocio_fecha_registro).toLocaleDateString()}
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
    </div>
  );
};

export default BusinessList;
