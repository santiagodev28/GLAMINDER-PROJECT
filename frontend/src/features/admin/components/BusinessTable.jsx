import { useEffect, useState } from "react";
import {
  fetchBusinesses,
  deleteBusiness,
  reactivateBusiness,
} from "../../../services/adminService.js";
import { Link } from "react-router-dom";
import ButtonBack  from "../../../components/buttons/ButtonBack";

// Componente para mostrar la tabla de negocios
const BusinessTable = () => {
  const [businesses, setBusinesses] = useState([]);
  const [showDeletedBusinesses, setShowDeletedBusinesses] = useState(false);

  const formatDate = (date) => {
    return new Date(date).toLocaleString("es-CO");
  };

  const loadBusinesses = async () => {
    try {
      const businesses = await fetchBusinesses();
      setBusinesses(businesses);
    } catch (error) {
      console.error("Error al obtener negocios:", error);
    }
  };

  useEffect(() => {
    loadBusinesses();
  }, []);

  const handleBusinessDelete = async (negocio_id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de querer eliminar este negocio?"
    );
    if (!confirmDelete) return;

    try {
      const res = await deleteBusiness(negocio_id);

      if (res.status === 200) {
        alert("Negocio eliminado con éxito");
        await loadBusinesses(); // recargar lista actualizada
      } else {
        alert("No se pudo eliminar el negocio");
      }
    } catch (error) {
      console.error("Error al eliminar el negocio:", error);
    }
  };

  const handleReactivate = async (negocio_id) => {
    const confirmReactivate = window.confirm(
      "¿Estás seguro de querer reactivar este negocio?"
    );
    if (!confirmReactivate) return;
    try {
      const res = await reactivateBusiness(negocio_id);
      if (res.status === 200) {
        alert("Negocio reactivado con éxito");
        await loadBusinesses();
      } else {
        alert("No se pudo reactivar el negocio");
      }
    } catch (error) {
      console.error("Error al reactivar el negocio:", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Negocios Registrados</h2>
      <table className="w-full border text-left">
        <thead className="bg-gray-100">
          <tr className="bg-gray-300">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Correo</th>
            <th className="p-2 border">Fecha Registro</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {businesses
            .filter((b) =>
              showDeletedBusinesses
                ? b.negocio_estado === 0
                : b.negocio_estado === 1
            )
            .map((b) => (
              <tr key={b.negocio_id}>
                <td className="p-2 border">{b.negocio_id}</td>
                <td className="p-2 border">{b.negocio_nombre}</td>
                <td className="p-2 border">{b.negocio_correo}</td>
                <td className="p-2 border">
                  {formatDate(b.negocio_fecha_registro)}
                </td>
                <td className="p-2 border">
                  <Link to={`/admin/negocios/${b.negocio_id}/tiendas`}>
                    <button className="text-blue-600 hover:underline mr-2">
                      Ver Tiendas
                    </button>
                  </Link>
                  
                  <Link to={`/admin/negocios/${b.negocio_id}/estadisticas`}>
                    <button className="text-green-600 hover:underline mr-2">
                      Ver Estadísticas
                    </button>
                  </Link>

                  {!showDeletedBusinesses ? (
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleBusinessDelete(b.negocio_id)}
                    >
                      Eliminar
                    </button>
                  ) : (
                    <button
                      className="text-green-600 hover:underline"
                      onClick={() => handleReactivate(b.negocio_id)}
                    >
                      Reactivar
                    </button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="flex flex-col gap-2 py-4">
        <button
          className="text-center w-full bg-slate-600 py-2 px-4 rounded text-white hover:bg-slate-700"
          onClick={() => setShowDeletedBusinesses(!showDeletedBusinesses)}
        >
          {showDeletedBusinesses
            ? "Mostrar Negocios Activos"
            : "Mostrar Negocios Eliminados"}
        </button>
        <ButtonBack to="/admin/dashboard" />
      </div>
    </div>
  );
};

export default BusinessTable;
