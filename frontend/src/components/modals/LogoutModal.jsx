import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { logout } from "../../services/authService.js";
import { useNavigate } from "react-router-dom";

const LogoutModal = ({ isOpen, onClose }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutAll, setLogoutAll] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout(logoutAll);
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      navigate("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            Cerrar Sesión
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoggingOut}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            ¿Deseas cerrar sesión en este dispositivo o en todos los dispositivos?
          </p>

          {/* Options */}
          <div className="space-y-3 mb-6">
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="logoutOption"
                checked={!logoutAll}
                onChange={() => setLogoutAll(false)}
                disabled={isLoggingOut}
                className="mr-3"
              />
              <div>
                <div className="font-medium text-gray-900">
                  Solo este dispositivo
                </div>
                <div className="text-sm text-gray-500">
                  Mantendrás tu sesión activa en otros dispositivos
                </div>
              </div>
            </label>

            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="logoutOption"
                checked={logoutAll}
                onChange={() => setLogoutAll(true)}
                disabled={isLoggingOut}
                className="mr-3"
              />
              <div>
                <div className="font-medium text-gray-900">
                  Todos los dispositivos
                </div>
                <div className="text-sm text-gray-500">
                  Cerrarás sesión en todos los dispositivos donde hayas iniciado sesión
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            disabled={isLoggingOut}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoggingOut ? (
              <>
                <span className="animate-spin">⏳</span>
                Cerrando...
              </>
            ) : (
              "Cerrar Sesión"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;

