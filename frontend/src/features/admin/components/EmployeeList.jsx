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
    const [showDeletedEmployees, setShowDeletedEmployees] = useState(false);
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
    }, [tienda_id]);

    const filteredEmployees = showDeletedEmployees
        ? employees
        : employees.filter((e) => e.empleado_estado !== "eliminado");

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
        <div className="p-4">
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
            <h1 className="text-xl font-bold mb-4">Lista de Empleados</h1>
            <DataTable
                data={filteredEmployees}
                columns={columns}
                itemsPerPage={10}
                emptyMessage="No hay empleados para mostrar"
                renderRow={(row, index) => (
                    <tr
                        key={row.empleado_id}
                        className={
                            row.empleado_estado === "eliminado"
                                ? "bg-red-100"
                                : "hover:bg-gray-50 transition-colors"
                        }
                    >
                        {columns.map((column) => (
                            <td key={column.key} className="p-3 border border-gray-300">
                                {column.render
                                    ? column.render(row[column.key], row)
                                    : row[column.key] ?? "-"}
                            </td>
                        ))}
                    </tr>
                )}
            />
            <div className="mt-4">
                <ButtonBack to={`/admin/negocios/${negocio_id}/tiendas`} />
            </div>
        </div>
    );
};

export default EmployeeList;
