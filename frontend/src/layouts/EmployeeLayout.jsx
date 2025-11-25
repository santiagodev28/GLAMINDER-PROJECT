import { useEffect, useState } from "react";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import {
  HomeIcon,
  CalendarIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import RoleChangeModal from "../components/modals/RoleChangeModal";
import EditProfileModal from "../components/modals/EditProfileModal";
import ProfileService from "../services/profileService";
import api from "../api/api";
import { messageChangeRole } from "../services/clientService";

const EmployeeLayout = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

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

  const handleProfileSave = (updatedUser) => {
    setUser(updatedUser);
    setShowEditProfile(false);
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

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
            Tu rol ha sido actualizado a <strong>Empleado</strong>. Ahora puedes
            gestionar tus citas y servicios desde este panel.
          </p>
        </RoleChangeModal>
      )}

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar fijo */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-black shadow-2xl p-6 flex flex-col justify-between border-r border-[#31343A]/30 z-40 transform transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#F5F5F5] mb-2">
              GLAMINDER
            </h1>
            <div className="h-1 w-16 bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] rounded-full"></div>
          </div>

          {/* Información del usuario */}
          <div className="mb-8 p-4 bg-[#1F1F1F]/50 backdrop-blur-sm rounded-xl border border-[#31343A]/30">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-semibold text-sm">
                  {ProfileService.getInitials(user)}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-[#F5F5F5] font-medium text-sm">
                  {ProfileService.getFullName(user)}
                </p>
                <p className="text-[#B0B3B8] text-xs">
                  {ProfileService.getRoleText(user?.rol_id)}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowEditProfile(true);
                closeSidebar();
              }}
              className="w-full flex items-center justify-center space-x-2 text-xs text-[#D1A04D] hover:text-[#F5F5F5] transition-colors py-2 px-3 rounded-lg hover:bg-[#31343A]/30"
            >
              <UserIcon className="h-4 w-4" />
              <span>Editar Perfil</span>
            </button>
          </div>

          {/* Navegación */}
          <nav className="space-y-2">
            <Link
              to="/empleado/dashboard"
              onClick={closeSidebar}
              className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 ${
                isActive("/empleado/dashboard")
                  ? "bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white shadow-lg"
                  : "text-[#B0B3B8] hover:text-[#F5F5F5] hover:bg-[#1F1F1F]/50"
              }`}
            >
              <HomeIcon className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </Link>

            <Link
              to="/empleado/citas"
              onClick={closeSidebar}
              className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 ${
                isActive("/empleado/citas")
                  ? "bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white shadow-lg"
                  : "text-[#B0B3B8] hover:text-[#F5F5F5] hover:bg-[#1F1F1F]/50"
              }`}
            >
              <CalendarIcon className="w-5 h-5" />
              <span className="font-medium">Mis Citas</span>
            </Link>

            <Link
              to="/empleado/servicios"
              onClick={closeSidebar}
              className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 ${
                isActive("/empleado/servicios")
                  ? "bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white shadow-lg"
                  : "text-[#B0B3B8] hover:text-[#F5F5F5] hover:bg-[#1F1F1F]/50"
              }`}
            >
              <CogIcon className="w-5 h-5" />
              <span className="font-medium">Mis Servicios</span>
            </Link>
          </nav>
        </div>

        {/* Botón de cerrar sesión */}
        <div className="mt-auto">
          <Link to="/" onClick={closeSidebar}>
            <button className="w-full flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span className="font-medium">Cerrar Sesión</span>
            </button>
          </Link>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 w-full min-h-screen lg:ml-64 overflow-x-hidden">
        <div className="lg:hidden sticky top-0 z-20 bg-black/70 backdrop-blur-sm px-4 py-3 flex items-center justify-between border-b border-[#31343A]/30">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg bg-[#1F1F1F]/60 border border-[#31343A]/50 text-[#F5F5F5] hover:bg-[#31343A]/70 transition-colors"
            aria-label="Alternar menú"
          >
            {isSidebarOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
          <div className="text-sm text-[#F5F5F5] font-medium">
            {ProfileService.getFullName(user)}
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </main>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        onSave={handleProfileSave}
      />
    </div>
  );
};

export default EmployeeLayout;
