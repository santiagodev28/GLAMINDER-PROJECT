import { logout } from "../../services/authService.js";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const ButtonCloseSession = ({ logoutAll = false, className = "" }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await logout(logoutAll);
            navigate("/");
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            navigate("/");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleLogout}
            disabled={isLoading}
            className={`
                bg-red-400 text-white px-4 py-3 rounded-lg 
                hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed 
                transition-all duration-200
                w-full
                ${className}
            `}
        >
            {isLoading ? "Cerrando..." : logoutAll ? "Cerrar sesión en todos los dispositivos" : "Cerrar sesión"}
        </button>
    );
};

export default ButtonCloseSession;

