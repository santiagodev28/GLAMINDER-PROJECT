import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { fetchUserPerMonth } from "../../../../services/adminService.js";

// Componente para mostrar los usuarios registrados por mes
const UserTrendChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchUserPerMonth();
                const formattedData = response.data.map((item) => ({
                    mes: new Date(item.mes).toLocaleString('es-CO', { month: 'short', year: 'numeric' }),
                    usuarios: item.total,
                }));
                console.log(formattedData);
                setData(formattedData)
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) return <div>Cargando datos...</div>;
    if (error) return <div>Error al cargar los datos: {error.message}</div>;

    return (
        <div className="bg-white shadow-md rounded-2xl p-4 mt-6">
            <h2 className="text-lg font-semibold mb-4">Usuarios registrados por mes</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="usuarios" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default UserTrendChart;