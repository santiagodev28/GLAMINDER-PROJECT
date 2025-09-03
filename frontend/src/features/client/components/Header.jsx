import ButtonCloseSession from "../../../components/buttons/ButtonCloseSession";
import logo from "../../../assets/images/logo-2.png";
import { useState, useEffect, useRef } from "react";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Simular datos del usuario (esto debería venir de tu contexto de autenticación)
  const name = localStorage.getItem("usuario_nombre"); // Reemplazar con el nombre real del usuario

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Cerrar dropdown cuando se haga clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Top Teal Strip - Adaptado a naranja */}
      <div className="h-1 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500"></div>

      {/* Main Header */}
      <header className="bg-white shadow-lg border-b border-gray-100 rounded-b-lg mx-4">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Side - Logo/Brand */}
            <div className="flex items-center">
              <span className="ml-3 text-xl font-bold text-gray-800">
                Glaminder
              </span>
            </div>

            {/* Center - Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="/cliente/dashboard"
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors duration-200"
              >
                Inicio
              </a>
              <a
                href="/cliente/negocios"
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors duration-200"
              >
                Negocios
              </a>
              <a
                href="/cliente/mis-citas"
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors duration-200"
              >
                Mis Citas
              </a>
            </nav>

            {/* Right Side - Search and User */}
            <div className="flex items-center space-x-4">
              {/* Search Icon */}
              <button className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200">
                <svg
                  className="w-5 h-5"
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
              </button>

              {/* User Dropdown */}
              <div className="relative " ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-orange-50 transition-all duration-200"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-semibold text-sm">
                      {name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:block text-gray-700 font-medium">
                    {name}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute flex flex-col right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50 items-center justify-center">
                    <a
                      href="/cliente/perfil"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors duration-200"
                    >
                      <svg
                        className="w-4 h-4 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Ver mi perfil
                    </a>
                    <div className="border-t border-gray-100 w-full py-1"></div>
                    <ButtonCloseSession />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
