import { useEffect, useState } from "react";
import AdminService from "../../../services/adminService.js";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import ButtonBack from "../../../components/buttons/ButtonBack";
import DataTable from "../../../components/common/DataTable";
import Breadcrumbs from "../../../components/common/Breadcrumbs";
// Componente para mostrar la lista de empleados
const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const { tienda_id, negocio_id } = useParams();
  

    const loadEmployees = async () => {
        try {
            const data = await AdminService.fetchEmployeesByStore(tienda_id);
            setEmployees(data);
        } catch (error) {
            console.error("Error al cargar empleados:", error);
        }
    };

    useEffect(() => {
        loadEmployees();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tienda_id]);

    const filteredEmployees = employees.filter((e) => e.empleado_estado !== "eliminado");

    // Configuración de columnas para DataTable
    const columns = [
        { key: "usuario_nombre", label: "Nombre", sortable: true },
        { key: "usuario_apellido", label: "Apellido", sortable: true },
        { key: "usuario_correo", label: "Email", sortable: true },
        { key: "usuario_telefono", label: "Teléfono", sortable: true },
        { key: "empleado_especialidad", label: "Cargo", sortable: true },
        { key: "empleado_estado", label: "Estado", sortable: true },
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
                        {
                            label: "Empleados",
                            path: `/admin/negocios/${negocio_id}/tiendas/${tienda_id}/empleados`,
                        },
                    ]}
                    homePath="/admin/dashboard"
                />
                <h1 className="text-3xl font-bold mb-6 text-[#F5F5F5]">Lista de Empleados</h1>
                
                <div className="bg-[#2A2D35] rounded-xl border border-[#31343A] shadow-lg overflow-hidden">
                    <DataTable
                        data={filteredEmployees}
                        columns={columns}
                        itemsPerPage={10}
                        emptyMessage="No hay empleados para mostrar"
                        renderRow={(row) => (
                            <tr
                                key={row.empleado_id}
                                className={
                                    row.empleado_estado === "eliminado"
                                        ? "bg-red-900/20 border-red-500/20"
                                        : "hover:bg-[#31343A]/30 transition-colors"
                                }
                            >
                                {columns.map((column) => (
                                    <td key={column.key} className="p-3 border-b border-[#31343A] text-[#F5F5F5]">
                                        {column.render
                                            ? column.render(row[column.key], row)
                                            : row[column.key] ?? "-"}
                                    </td>
                                ))}
                            </tr>
                        )}
                    />
                </div>
                
                <div className="mt-6">
                    <ButtonBack to={`/admin/negocios/${negocio_id}/tiendas`} />
                </div>
            </div>
        </div>
    );
};

export default EmployeeList;
