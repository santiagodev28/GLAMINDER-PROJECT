import UserTrendChart from "../components/AdminStats/UserTrendChart.jsx";
import StatsOverview from "../components/AdminStats/StatsOverview.jsx";
import TopEmployeesByBussines from "../components/AdminStats/TopEmployeesByBusiness.jsx";
import TopRatedBusiness from "../components/AdminStats/TopRatedBusiness.jsx";

// Página para mostrar las estadísticas
const StatsAdmin = () => {
    return (
        <div className="min-h-screen bg-[#23262B] p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] rounded-xl p-6 shadow-lg">
                    <h1 className="text-3xl font-bold text-white">Estadísticas del Sistema</h1>
                </div>
                
                <StatsOverview />
                <UserTrendChart />
                <TopEmployeesByBussines />
                <TopRatedBusiness />
            </div>
        </div>
    )
}

export default StatsAdmin;