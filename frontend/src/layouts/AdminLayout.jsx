import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  UserIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  UsersIcon,
  BuildingStorefrontIcon,
  DocumentTextIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import EditProfileModal from "../components/modals/EditProfileModal";
import LogoutModal from "../components/modals/LogoutModal";
import ProfileService from "../services/profileService";

const AdminLayout = () => {
  const [user, setUser] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await ProfileService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Error al cargar datos del usuario:", error);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleProfileSave = (updatedUser) => {
    setUser(updatedUser);
    setShowEditProfile(false);
  };

  const navItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: HomeIcon },
    { to: "/admin/estadisticas", label: "Estadísticas", icon: ChartBarIcon },
    { to: "/admin/usuarios", label: "Usuarios", icon: UsersIcon },
    { to: "/admin/negocios", label: "Negocios", icon: BuildingStorefrontIcon },
    { to: "/admin/solicitudes", label: "Solicitudes", icon: DocumentTextIcon },
  ];

  return (
    <div className="flex min-h-screen bg-[#23262B]">
      {/* Sidebar */}
      <aside className="w-72 bg-[#2A2D35] border-r border-[#31343A] shadow-xl flex flex-col">
        <div className="flex-1 p-6">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] bg-clip-text text-transparent">
              GLAMINDER
            </h1>
            <p className="text-[#B0B3B8] text-sm mt-1">Panel de Administración</p>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = window.location.pathname === item.to;
              
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white shadow-lg shadow-[#D1A04D]/20"
                      : "text-[#B0B3B8] hover:bg-[#31343A] hover:text-[#F5F5F5]"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Actions */}
        <div className="p-6 space-y-3 border-t border-[#31343A]">
          {/* User Profile Card */}
          {user && (
            <div className="bg-[#23262B] rounded-xl p-4 border border-[#31343A]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-bold">
                    {ProfileService.getInitials(user)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#F5F5F5] truncate">
                    {ProfileService.getFullName(user)}
                  </p>
                  <p className="text-xs text-[#D1A04D]">
                    {ProfileService.getRoleText(user.rol_id)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEditProfile(true)}
                className="w-full flex items-center justify-center gap-2 text-xs text-[#D1A04D] hover:text-[#B47B1C] transition-colors py-2 px-3 rounded-lg hover:bg-[#31343A] font-medium"
              >
                <UserIcon className="h-4 w-4" />
                <span>Editar Perfil</span>
              </button>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-lg hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300 font-medium"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        onSave={handleProfileSave}
      />

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />
    </div>
  );
};

export default AdminLayout;
