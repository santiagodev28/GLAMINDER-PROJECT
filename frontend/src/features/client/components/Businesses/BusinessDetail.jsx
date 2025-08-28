import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AdminService from "../../../../services/adminService";

const BusinessDetail = () => {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [stores, setStores] = useState([]);
  const [employeesByStore, setEmployeesByStore] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Info negocio
        const bizData = await AdminService.fetchBusinessById(id);
        setBusiness(bizData);

        // 2. Tiendas
        const storesData = await AdminService.fetchStoresByBusiness(id);
        setStores(storesData);

        // 3. Empleados por tienda
        const employeesData = {};
        for (const store of storesData) {
          const emps = await AdminService.fetchEmployeesByStore(
            store.tienda_id
          );
          employeesData[store.tienda_id] = emps;
        }
        setEmployeesByStore(employeesData);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) return <p className="text-center mt-6">Cargando negocio...</p>;
  if (!business)
    return <p className="text-center mt-6">No se encontró el negocio</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Info negocio */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {business.negocio_nombre}
            </h1>
            <p className="text-gray-600 mb-2">{business.negocio_descripcion}</p>
            <p className="text-sm text-gray-500">
              {" "}
              {business.negocio_telefono}
            </p>
            <p className="text-sm text-gray-500"> {business.negocio_correo}</p>
          </div>

          {/* Botón principal de agendar cita */}
          <div className="mt-4 md:mt-0">
            <Link
              to={`/cliente/agendar-cita/${business.negocio_id}`}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg
                className="w-6 h-6 mr-2"
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
              Agendar Cita
            </Link>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-2">
          Registrado el:{" "}
          {new Date(business.negocio_fecha_registro).toLocaleDateString()}
        </p>
      </div>

      {/* Tiendas y empleados */}
      <div className="space-y-6">
        {stores.map((store) => (
          <div
            key={store.tienda_id}
            className="bg-gray-50 rounded-xl shadow p-4"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {store.tienda_nombre}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {store.tienda_direccion}
            </p>

            <h3 className="text-lg font-medium mb-2">Empleados:</h3>
            {employeesByStore[store.tienda_id]?.length > 0 ? (
              <ul className="list-disc list-inside text-gray-700">
                {employeesByStore[store.tienda_id].map((emp) => (
                  <li key={emp.empleado_id}>
                    {emp.usuario_nombre} - {emp.empleado_especialidad}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">
                No hay empleados registrados.
              </p>
            )}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link
                to={`/cliente/agendar-cita/${business.negocio_id}`}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
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
                Agendar Cita
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessDetail;
