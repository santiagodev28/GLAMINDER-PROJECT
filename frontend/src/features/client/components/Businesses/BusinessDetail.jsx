import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
          const emps = await AdminService.fetchEmployeesByStore(store.tienda_id);
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
  if (!business) return <p className="text-center mt-6">No se encontró el negocio</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Info negocio */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">{business.negocio_nombre}</h1>
        <p className="text-gray-600 mb-2">{business.negocio_descripcion}</p>
        <p className="text-sm text-gray-500"> {business.negocio_telefono}</p>
        <p className="text-sm text-gray-500"> {business.negocio_correo}</p>
        <p className="text-xs text-gray-400 mt-2">
          Registrado el: {new Date(business.negocio_fecha_registro).toLocaleDateString()}
        </p>
      </div>

      {/* Tiendas y empleados */}
      <div className="space-y-6">
        {stores.map((store) => (
          <div key={store.tienda_id} className="bg-gray-50 rounded-xl shadow p-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {store.tienda_nombre}
            </h2>
            <p className="text-sm text-gray-600 mb-4">{store.tienda_direccion}</p>

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
              <p className="text-sm text-gray-500">No hay empleados registrados.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessDetail;
