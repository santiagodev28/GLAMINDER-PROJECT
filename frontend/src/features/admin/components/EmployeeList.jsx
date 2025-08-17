import { useEffect, useState } from "react";
import { fetchEmployeesByStore} from "../../../services/adminService.js";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import ButtonBack  from "../../../components/buttons/ButtonBack";
// Componente para mostrar la lista de empleados
const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [showDeletedEmployees, setShowDeletedEmployees] = useState(false);
    const { tienda_id, negocio_id } = useParams();
  

    const loadEmployees = async () => {
        try {
            const data = await fetchEmployeesByStore(tienda_id);
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
        : employees.filter(e => e.empleado_estado !== "eliminado");

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Lista de Empleados</h1>

            

            <table className="w-full border-collapse border border-gray-300 mb-4">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border p-2">Nombre</th>
                        <th className="border p-2">Apellido</th>
                        <th className="border p-2">Email</th>
                        <th className="border p-2">Teléfono</th>
                        <th className="border p-2">Cargo</th>
                        <th className="border p-2">Estado</th>

                    </tr>
                </thead>
                <tbody>
                    {filteredEmployees.map((e) => (
                        <tr key={e.empleado_id} className={e.empleado_estado === "eliminado" ? "bg-red-100" : ""}>
                            <td className="border p-2">{e.usuario_nombre}</td>
                            <td className="border p-2">{e.usuario_apellido}</td>
                            <td className="border p-2">{e.usuario_correo}</td>
                            <td className="border p-2">{e.usuario_telefono}</td>
                            <td className="border p-2">{e.empleado_especialidad}</td>
                            <td className="border p-2">{e.empleado_estado}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ButtonBack to={`/admin/negocios/${negocio_id}/tiendas`} />
        </div>
    );
};

export default EmployeeList;
