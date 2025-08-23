import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ButtonBack  from "../../../components/buttons/ButtonBack";
import AdminService from "../../../services/adminService.js";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Componente para mostrar las estadísticas de un negocio
const BussinesStats = () => {
    const { negocio_id } = useParams();
    const [topEmployees, setTopEmployees] = useState([]);
    const [topServices, setTopServices] = useState([]);
    const [topStores, setTopStores] = useState([]);
    const [appointmentsTrends, setAppointmentsTrends] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const employees = await AdminService.fetchTopEmployees(negocio_id);
                const services = await AdminService.fetchTopServices(negocio_id);
                const stores = await AdminService.fetchTopStores(negocio_id);
                const trends = await AdminService.fetchAppointmentsTrends(negocio_id);

                setTopEmployees(employees);
                setTopServices(services);
                setTopStores(stores);
                setAppointmentsTrends(trends);
            } catch (error) {
                console.error("Error al obtener los datos:", error);
            }
        };
        fetchData();
    }, [negocio_id]);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 flex flex-col gap-4">
            <h1 className="text-2xl font-bold mb-4">Estadísticas de Negocio</h1>

            <section className="flex flex-col gap-2">
                <h2 className="text-lg font-bold">Empleados más destacados</h2>
                <ul className="list-disc list-inside">
                    {topEmployees.map((e) => (
                        <li key={e.empleado_id}>
                            {e.nombre} {e.apellido} - {e.total_citas} citas agendadas
                        </li>
                    ))}
                </ul>
            </section>

            <section className="flex flex-col gap-2">
                <h2 className="text-lg font-bold">Servicios más destacados</h2>
                <ul className="list-disc list-inside">
                    {topServices.map((s) => (
                        <li key={s.servicio_id}>{s.servicio_nombre} - {s.total_solicitudes} solicitudes</li>
                    ))}
                </ul>
            </section>

            <section className="flex flex-col gap-2">
                <h2 className="text-lg font-bold">Tiendas más destacadas</h2>
                <ul className="list-disc list-inside">
                    {topStores.map((t) => (
                        <li key={t.tienda_id}>{t.tienda_nombre} - {t.total_visitas} visitas</li>
                    ))}
                </ul>
            </section>

            <section className="flex flex-col gap-2 mb-4">
                <h2 className="text-lg font-bold">Agendamientos por mes</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={appointmentsTrends}>
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="total" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </section>
            <ButtonBack to="/admin/negocios" />
            </div>
        </div>
    )
}

export default BussinesStats;
