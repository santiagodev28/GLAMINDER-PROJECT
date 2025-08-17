import { useEffect, useState } from "react";
import { Award } from "lucide-react";
import { useParams } from "react-router-dom";
import { fetchTopEmployees } from "../../../../services/adminService.js";

// Componente para mostrar los empleados más agendados por negocio
const TopEmployees = () => {
    const { negocio_id } = useParams();
    const [empleados, setEmpleados] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopEmployeesByBussines = async () => {
            try {
                const response = await fetchTopEmployees(negocio_id);
                setEmpleados(response);
            } catch (error) {
                console.error("Error al cargar los mejores empleados:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTopEmployeesByBussines();
    }, [negocio_id]);

    if (loading) return <div>Cargando mejores empleados...</div>;

    return (
        <div className="bg-white shadow-md rounded-2xl p-4 mt-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Award className="text-yellow-500" /> Mejores empleados del mes
            </h2>
            <ul className="space-y-2">
                {empleados.map((emp, index) => (
                    <li key={emp.empleado_id} className="flex justify-between items-center">
                        <span>{index + 1}. {emp.nombre} {emp.apellido}</span>
                        <span className="text-blue-600 font-bold">{emp.total_citas} citas</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TopEmployees;
