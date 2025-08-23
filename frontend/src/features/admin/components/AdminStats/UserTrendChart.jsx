import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
} from "recharts";
import { useEffect, useState } from "react";
import AdminService from "../../../../services/adminService.js";

// Componente para mostrar los usuarios registrados por mes
const UserTrendChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response =
                    await AdminService.fetchUserRegistrationTrends();
                console.log(response);

                const formattedData = response.map((item) => {
                    // Descomponemos "YYYY-MM"
                    const [year, month] = item.mes.split("-");

                    // Convertimos a formato "Mes Año"
                    const dateMonthYear = new Date( 
                        parseInt(year),
                        parseInt(month) - 1 // en JS enero = 0
                    ).toLocaleString("es-CO", {
                        month: "short",
                        year: "numeric",
                    });

                    return {
                        mes: dateMonthYear,
                        usuarios: item.total_usuarios,
                    };
                });
                setData(formattedData);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div>Cargando datos...</div>;
    if (error) return <div>Error al cargar los datos: {error.message}</div>;

    return (
        <div className="bg-white shadow-md rounded-2xl p-4 mt-6">
            <h2 className="text-lg font-semibold mb-4">
                Usuarios registrados por mes
            </h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <Line strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="usuarios"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{
                            r: 6,
                            stroke: "#3b82f6",
                            strokeWidth: 2,
                            fill: "#fff",
                        }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default UserTrendChart;
