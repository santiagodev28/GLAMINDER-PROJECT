import { Outlet } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  UserIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import EditProfileModal from "../components/modals/EditProfileModal";
import LogoutModal from "../components/modals/LogoutModal";
import ProfileService from "../services/profileService";

const AdminLayout = () => {
  const [user, setUser] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

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

  return (
    <div className="flex min-h-screen app-background">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-6">GLAMINDER</h1>
          <nav className="space-y-2">
            <Link to="/admin/dashboard" className="block">
              Estadísticas generales
            </Link>
            <Link to="/admin/usuarios" className="block">
              Usuarios
            </Link>
            <Link to="/admin/negocios" className="block">
              Negocios
            </Link>
            <Link to="/admin/solicitudes" className="block">
              Solicitudes
            </Link>
          </nav>
        </div>

        {/* User Info & Actions */}
        <div className="space-y-4">
          {/* User Profile Card */}
          {user && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {ProfileService.getInitials(user)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {ProfileService.getFullName(user)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {ProfileService.getRoleText(user.rol_id)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEditProfile(true)}
                className="w-full flex items-center justify-center space-x-2 text-xs text-blue-600 hover:text-blue-800 transition-colors"
              >
                <UserIcon className="h-4 w-4" />
                <span>Editar Perfil</span>
              </button>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center justify-center space-x-2 bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-6 overflow-y-auto">
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
