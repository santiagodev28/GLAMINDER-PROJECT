import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ButtonBack  from "../../../components/buttons/ButtonBack";
import AdminService from "../../../services/adminService.js";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrophyIcon, BriefcaseIcon, BuildingStorefrontIcon, ChartBarIcon } from "@heroicons/react/24/outline";

// Componente para mostrar las estadísticas de un negocio
const BussinesStats = () => {
    const { negocio_id } = useParams();
    const [topEmployees, setTopEmployees] = useState([]);
    const [topServices, setTopServices] = useState([]);
    const [topStores, setTopStores] = useState([]);
    const [appointmentsTrends, setAppointmentsTrends] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
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
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [negocio_id]);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#23262B] border border-[#31343A] p-3 rounded-lg shadow-lg">
                    <p className="text-[#F5F5F5] font-medium">{payload[0].payload.mes}</p>
                    <p className="text-[#D1A04D]">
                        Citas: <span className="font-bold">{payload[0].value}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#23262B] p-6 flex items-center justify-center">
                <div className="text-[#F5F5F5] text-lg">Cargando estadísticas...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#23262B] p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] rounded-xl p-6 mb-6 shadow-lg">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <ChartBarIcon className="h-8 w-8" />
                        Estadísticas de Negocio
                    </h1>
                </div>

                <div className="grid gap-6">
                    {/* Empleados más destacados */}
                    <section className="bg-[#2A2D35] rounded-xl border border-[#31343A] p-6 shadow-lg backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg">
                                <TrophyIcon className="h-6 w-6 text-blue-400" />
                            </div>
                            <h2 className="text-xl font-bold text-[#F5F5F5]">Empleados más destacados</h2>
                        </div>
                        {topEmployees.length > 0 ? (
                            <ul className="space-y-2">
                                {topEmployees.map((e, index) => (
                                    <li key={e.empleado_id} className="flex items-center gap-3 p-3 bg-[#23262B] rounded-lg border border-[#31343A] hover:border-[#D1A04D] transition-colors">
                                        <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-full text-white font-bold text-sm">
                                            {index + 1}
                                        </span>
                                        <span className="text-[#F5F5F5] flex-1">
                                            {e.nombre} {e.apellido}
                                        </span>
                                        <span className="text-[#D1A04D] font-semibold">
                                            {e.total_citas} citas
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-[#B0B3B8] text-center py-4">No hay datos disponibles</p>
                        )}
                    </section>

                    {/* Servicios más destacados */}
                    <section className="bg-[#2A2D35] rounded-xl border border-[#31343A] p-6 shadow-lg backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg">
                                <BriefcaseIcon className="h-6 w-6 text-green-400" />
                            </div>
                            <h2 className="text-xl font-bold text-[#F5F5F5]">Servicios más destacados</h2>
                        </div>
                        {topServices.length > 0 ? (
                            <ul className="space-y-2">
                                {topServices.map((s, index) => (
                                    <li key={s.servicio_id} className="flex items-center gap-3 p-3 bg-[#23262B] rounded-lg border border-[#31343A] hover:border-[#D1A04D] transition-colors">
                                        <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-full text-white font-bold text-sm">
                                            {index + 1}
                                        </span>
                                        <span className="text-[#F5F5F5] flex-1">
                                            {s.servicio_nombre}
                                        </span>
                                        <span className="text-[#D1A04D] font-semibold">
                                            {s.total_solicitudes} solicitudes
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-[#B0B3B8] text-center py-4">No hay datos disponibles</p>
                        )}
                    </section>

                    {/* Tiendas más destacadas */}
                    <section className="bg-[#2A2D35] rounded-xl border border-[#31343A] p-6 shadow-lg backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg">
                                <BuildingStorefrontIcon className="h-6 w-6 text-purple-400" />
                            </div>
                            <h2 className="text-xl font-bold text-[#F5F5F5]">Tiendas más destacadas</h2>
                        </div>
                        {topStores.length > 0 ? (
                            <ul className="space-y-2">
                                {topStores.map((t, index) => (
                                    <li key={t.tienda_id} className="flex items-center gap-3 p-3 bg-[#23262B] rounded-lg border border-[#31343A] hover:border-[#D1A04D] transition-colors">
                                        <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-full text-white font-bold text-sm">
                                            {index + 1}
                                        </span>
                                        <span className="text-[#F5F5F5] flex-1">
                                            {t.tienda_nombre}
                                        </span>
                                        <span className="text-[#D1A04D] font-semibold">
                                            {t.total_visitas} visitas
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-[#B0B3B8] text-center py-4">No hay datos disponibles</p>
                        )}
                    </section>

                    {/* Agendamientos por mes */}
                    <section className="bg-[#2A2D35] rounded-xl border border-[#31343A] p-6 shadow-lg backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-gradient-to-br from-[#D1A04D]/20 to-[#B47B1C]/20 rounded-lg">
                                <ChartBarIcon className="h-6 w-6 text-[#D1A04D]" />
                            </div>
                            <h2 className="text-xl font-bold text-[#F5F5F5]">Agendamientos por mes</h2>
                        </div>
                        {appointmentsTrends.length > 0 ? (
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={appointmentsTrends}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#31343A" />
                                    <XAxis 
                                        dataKey="mes" 
                                        stroke="#B0B3B8"
                                        tick={{ fill: '#B0B3B8' }}
                                    />
                                    <YAxis 
                                        stroke="#B0B3B8"
                                        tick={{ fill: '#B0B3B8' }}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="total" fill="#D1A04D" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-[#B0B3B8] text-center py-8">No hay datos de tendencias disponibles</p>
                        )}
                    </section>
                </div>

                <div className="mt-6">
                    <ButtonBack to="/admin/negocios" />
                </div>
            </div>
        </div>
    )
}

export default BussinesStats;
