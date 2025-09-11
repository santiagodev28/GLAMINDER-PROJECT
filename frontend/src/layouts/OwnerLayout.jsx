import { useEffect, useState } from "react";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import {
  HomeIcon,
  BuildingStorefrontIcon,
  UserGroupIcon,
  CalendarIcon,
  CogIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import RoleChangeModal from "../components/modals/RoleChangeModal";
import api from "../api/api";
import { messageChangeRole } from "../services/clientService";

const LayoutOwner = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(() => {
    const usuario = localStorage.getItem("usuario");
    return usuario ? JSON.parse(usuario) : null;
  });
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();

  // Función para determinar si un enlace está activo
  const isActive = (path) => {
    return location.pathname === path;
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    // Consulta el usuario actualizado al backend
    const fetchUser = async () => {
      try {
        const res = await api.get(`/usuarios/${user.usuario_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const updatedUser = Array.isArray(res.data) ? res.data[0] : res.data;
        localStorage.setItem("usuario", JSON.stringify(updatedUser));
        setUser(updatedUser);
        if (updatedUser.rol_cambiado === 1) {
          setShowModal(true);
        }
      } catch (error) {
        console.error("Error al obtener usuario actualizado:", error);
      }
    };
    fetchUser();
  }, []);

  const handleCloseModal = async () => {
    try {
      await messageChangeRole(token, user.usuario_id, 0);
      const updatedUser = { ...user, rol_cambiado: 0 };
      localStorage.setItem("usuario", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error("Error al actualizar rol_cambiado:", error);
    } finally {
      setShowModal(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        No hay usuario autenticado.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex app-background">
      {showModal && (
        <RoleChangeModal onClose={handleCloseModal} title="¡Felicidades!">
          <p className="text-lg text-gray-700">
            Tu rol ha sido actualizado a <strong>Propietario</strong>. Ahora
            puedes gestionar tu(s) negocio(s) desde este panel.
          </p>
        </RoleChangeModal>
      )}

      {/* Sidebar fijo */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-black shadow-2xl p-6 flex flex-col justify-between border-r border-[#31343A]/30 z-40">
        <div>
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#F5F5F5] mb-2">
              GLAMINDER
            </h1>
            <div className="h-1 w-16 bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] rounded-full">
            </div>
          </div>

          {/* Información del usuario */}
          <div className="mb-8 p-4 bg-[#1F1F1F]/50 backdrop-blur-sm rounded-xl border border-[#31343A]/30">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-semibold text-sm">
                  {user?.nombre?.charAt(0).toUpperCase() || "P"}
                </span>
              </div>
              <div>
                <p className="text-[#F5F5F5] font-medium text-sm">
                  {user?.nombre || "Propietario"}
                </p>
                <p className="text-[#B0B3B8] text-xs">Panel de Control</p>
              </div>
            </div>
          </div>

          {/* Navegación */}
          <nav className="space-y-2">
            <Link
              to="/propietario/dashboard"
              className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 ${
                isActive("/propietario/dashboard")
                  ? "bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white shadow-lg"
                  : "text-[#B0B3B8] hover:text-[#F5F5F5] hover:bg-[#1F1F1F]/50"
              }`}
            >
              <HomeIcon className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </Link>

            <Link
              to="/propietario/tiendas"
              className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 ${
                isActive("/propietario/tiendas")
                  ? "bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white shadow-lg"
                  : "text-[#B0B3B8] hover:text-[#F5F5F5] hover:bg-[#1F1F1F]/50"
              }`}
            >
              <BuildingStorefrontIcon className="w-5 h-5" />
              <span className="font-medium">Mis Tiendas</span>
            </Link>

            <Link
              to="/propietario/empleados"
              className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 ${
                isActive("/propietario/empleados")
                  ? "bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white shadow-lg"
                  : "text-[#B0B3B8] hover:text-[#F5F5F5] hover:bg-[#1F1F1F]/50"
              }`}
            >
              <UserGroupIcon className="w-5 h-5" />
              <span className="font-medium">Empleados</span>
            </Link>

            <Link
              to="/propietario/horarios"
              className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 ${
                isActive("/propietario/horarios")
                  ? "bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white shadow-lg"
                  : "text-[#B0B3B8] hover:text-[#F5F5F5] hover:bg-[#1F1F1F]/50"
              }`}
            >
              <ClockIcon className="w-5 h-5" />
              <span className="font-medium">Horarios</span>
            </Link>

            <Link
              to="/propietario/citas"
              className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 ${
                isActive("/propietario/citas")
                  ? "bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white shadow-lg"
                  : "text-[#B0B3B8] hover:text-[#F5F5F5] hover:bg-[#1F1F1F]/50"
              }`}
            >
              <CalendarIcon className="w-5 h-5" />
              <span className="font-medium">Citas</span>
            </Link>

            <Link
              to="/propietario/servicios"
              className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 ${
                isActive("/propietario/servicios")
                  ? "bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white shadow-lg"
                  : "text-[#B0B3B8] hover:text-[#F5F5F5] hover:bg-[#1F1F1F]/50"
              }`}
            >
              <CogIcon className="w-5 h-5" />
              <span className="font-medium">Servicios</span>
            </Link>

            <Link
              to="/propietario/reportes"
              className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 ${
                isActive("/propietario/reportes")
                  ? "bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white shadow-lg"
                  : "text-[#B0B3B8] hover:text-[#F5F5F5] hover:bg-[#1F1F1F]/50"
              }`}
            >
              <ChartBarIcon className="w-5 h-5" />
              <span className="font-medium">Reportes</span>
            </Link>
          </nav>
        </div>

        {/* Botón de cerrar sesión */}
        <div className="mt-auto">
          <Link to="/">
            <button className="w-full flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span className="font-medium">Cerrar Sesión</span>
            </button>
          </Link>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 ml-64 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default LayoutOwner;
