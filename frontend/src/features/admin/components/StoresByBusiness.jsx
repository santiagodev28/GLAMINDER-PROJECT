import { useEffect, useState } from "react";
import AdminService from "../../../services/adminService.js";
import { useParams, Link } from "react-router-dom";
import ButtonBack from "../../../components/buttons/ButtonBack";
import DataTable from "../../../components/common/DataTable";
import Breadcrumbs from "../../../components/common/Breadcrumbs";
// Componente para mostrar las tiendas de un negocio
const StoresByBusinessTable = () => {
    const { negocio_id } = useParams();
    const [stores, setStores] = useState([]);

    useEffect(() => {
        const loadStores = async () => {
            try {
                const stores = await AdminService.fetchStoresByBusiness(negocio_id);
                setStores(stores);
            } catch (error) {
                console.error("Error al obtener las tiendas:", error);
            }
        } 
        loadStores();
    }, [negocio_id]);

    // Configuración de columnas para DataTable
    const columns = [
        { key: "tienda_nombre", label: "Nombre", sortable: true },
        { key: "tienda_direccion", label: "Dirección", sortable: true },
        { key: "tienda_telefono", label: "Teléfono", sortable: true },
        { key: "tienda_correo", label: "Correo", sortable: true },
        { key: "tienda_ciudad", label: "Ciudad", sortable: true },
        { key: "tienda_activa", label: "Estado", sortable: true },
        {
            key: "acciones",
            label: "Acciones",
            sortable: false,
            render: (_, row) => (
                <Link
                    to={`/admin/negocios/${negocio_id}/tiendas/${row.tienda_id}/empleados`}
                >
                    <button className="text-[#D1A04D] hover:text-[#B47B1C] font-medium transition-colors">
                        Ver Empleados
                    </button>
                </Link>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-[#23262B] p-6">
            <div className="max-w-7xl mx-auto">
                <Breadcrumbs
                    items={[
                        { label: "Negocios", path: "/admin/negocios" },
                        {
                            label: "Tiendas",
                            path: `/admin/negocios/${negocio_id}/tiendas`,
                        },
                    ]}
                    homePath="/admin/dashboard"
                />
                <h1 className="text-3xl font-bold mb-6 text-[#F5F5F5]">Tiendas del Negocio</h1>
                
                <div className="bg-[#2A2D35] rounded-xl border border-[#31343A] shadow-lg overflow-hidden">
                    <DataTable
                        data={stores}
                        columns={columns}
                        itemsPerPage={10}
                        emptyMessage="No hay tiendas para mostrar"
                    />
                </div>
                
                <div className="mt-6">
                    <ButtonBack to="/admin/negocios" />
                </div>
            </div>
        </div>
    );
}

export default StoresByBusinessTable;
