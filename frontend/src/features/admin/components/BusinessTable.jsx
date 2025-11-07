import { useEffect, useState } from "react";
import AdminService from "../../../services/adminService.js";
import { Link } from "react-router-dom";
import ButtonBack from "../../../components/buttons/ButtonBack";
import DataTable from "../../../components/common/DataTable";
import Breadcrumbs from "../../../components/common/Breadcrumbs";

// Componente para mostrar la tabla de negocios
const BusinessTable = () => {
  const [businesses, setBusinesses] = useState([]);
  const [showDeletedBusinesses, setShowDeletedBusinesses] = useState(false);

  const formatDate = (date) => {
    return new Date(date).toLocaleString("es-CO");
  };

  const loadBusinesses = async () => {
    try {
      const businesses = await AdminService.fetchBusinesses();
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

  // Filtrar negocios
  const filteredBusinesses = businesses.filter((b) =>
    showDeletedBusinesses
      ? b.negocio_estado === 0
      : b.negocio_estado === 1
  );

  // Configuración de columnas para DataTable
  const columns = [
    { key: "negocio_id", label: "ID", sortable: true },
    { key: "negocio_nombre", label: "Nombre", sortable: true },
    { key: "negocio_correo", label: "Correo", sortable: true },
    {
      key: "negocio_fecha_registro",
      label: "Fecha Registro",
      sortable: true,
      render: (value) => formatDate(value),
    },
    {
      key: "acciones",
      label: "Acciones",
      sortable: false,
      render: (_, row) => (
        <div>
          <Link to={`/admin/negocios/${row.negocio_id}/tiendas`}>
            <button className="text-blue-600 hover:underline mr-2">
              Ver Tiendas
            </button>
          </Link>

          <Link to={`/admin/negocios/${row.negocio_id}/estadisticas`}>
            <button className="text-green-600 hover:underline mr-2">
              Ver Estadísticas
            </button>
          </Link>

          {!showDeletedBusinesses ? (
            <button
              className="text-red-600 hover:underline"
              onClick={() => handleBusinessDelete(row.negocio_id)}
            >
              Eliminar
            </button>
          ) : (
            <button
              className="text-green-600 hover:underline"
              onClick={() => handleReactivate(row.negocio_id)}
            >
              Reactivar
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <Breadcrumbs
        items={[{ label: "Negocios", path: "/admin/negocios" }]}
        homePath="/admin/dashboard"
      />
      <h2 className="text-2xl font-bold mb-4">Negocios Registrados</h2>
      <DataTable
        data={filteredBusinesses}
        columns={columns}
        itemsPerPage={10}
        emptyMessage="No hay negocios para mostrar"
      />
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
