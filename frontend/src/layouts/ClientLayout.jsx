import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo-2.png";

const ClientLayout = () => {
  return (
    <div className="min-h-screen bg-transparent">
      {/* Header/Navbar principal */}
      <header className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img src={logo} alt="Glaminder Logo" className="h-40 w-auto p-2" />
            </div>

            {/* Barra de búsqueda */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Buscar negocios"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            {/* User menu */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-yellow-600 transition-colors duration-200">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">C</span>
                  </div>
                  <span className="font-medium">Cliente</span>
                </button>
              </div>

              <Link
                to="/"
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Cerrar sesión
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navegación horizontal */}
      <nav className="bg-white shadow-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <Link
              to="/cliente/dashboard"
              className="flex items-center px-4 py-4 text-gray-700 hover:text-yellow-600 border-b-2 border-transparent hover:border-yellow-500 transition-all duration-200 font-medium"
            >
              Dashboard
            </Link>

            <Link
              to="/cliente/servicios"
              className="flex items-center px-4 py-4 text-gray-700 hover:text-yellow-600 border-b-2 border-transparent hover:border-yellow-500 transition-all duration-200 font-medium"
            >
              Servicios
            </Link>

            <Link
              to="/cliente/citas"
              className="flex items-center px-4 py-4 text-gray-700 hover:text-yellow-600 border-b-2 border-transparent hover:border-yellow-500 transition-all duration-200 font-medium"
            >
              Mis Citas
            </Link>

            <Link
              to="/cliente/negocios"
              className="flex items-center px-4 py-4 text-gray-700 hover:text-yellow-600 border-b-2 border-transparent hover:border-yellow-500 transition-all duration-200 font-medium"
            >
              Negocios
            </Link>

            <Link
              to="/cliente/perfil"
              className="flex items-center px-4 py-4 text-gray-700 hover:text-yellow-600 border-b-2 border-transparent hover:border-yellow-500 transition-all duration-200 font-medium"
            >
              Mi Perfil
            </Link>

            {/* Botón de acción rápida */}
            <div className="ml-auto">
              <Link
                to="/cliente/nueva-cita"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Nueva Cita
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ClientLayout;
