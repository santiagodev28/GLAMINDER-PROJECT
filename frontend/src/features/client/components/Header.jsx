import ButtonCloseSession from "../../../components/buttons/ButtonCloseSession";
import logo from "../../../assets/images/logo.png";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { BuildingStorefrontIcon } from "@heroicons/react/24/outline";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  // Simular datos del usuario (esto debería venir de tu contexto de autenticación)
  const name = localStorage.getItem("usuario_nombre");

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Detectar scroll para cambiar el estilo del header
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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

  // Función para determinar si un enlace está activo
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full flex justify-center pt-6 pb-4">
      {/* Header Flotante */}
      <header
        className={`backdrop-blur-md rounded-2xl w-full max-w-6xl mx-4 transition-all duration-300 hover:shadow-3xl ${
          isScrolled
            ? "bg-[#23262B]/60 shadow-2xl "
            : "bg-[#23262B]/20 shadow-lg"
        }`}
      >
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left Side - Logo/Brand */}
            <div className="flex items-center transition-all duration-300 hover:scale-105">
              <img
                src={logo}
                alt="Glaminder Logo"
                className="h-20 w-auto drop-shadow-lg transition-all duration-300"
              />

              <span
                className={`ml-4 text-2xl font-bold transition-all duration-300 ${
                  isScrolled ? "text-gray-800" : "text-[#F5F5F5]"
                }`}
              >
                Glaminder
              </span>
            </div>

            {/* Center - Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/cliente/dashboard"
                className={`font-medium transition-all duration-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D1A04D]/50 ${
                  isActive("/cliente/dashboard")
                    ? isScrolled
                      ? "text-white bg-[#D1A04D] border border-[#D1A04D] shadow-lg"
                      : "text-[#F5F5F5] bg-[#D1A04D]/20 border border-[#D1A04D]/30 shadow-lg"
                    : isScrolled
                    ? "text-[#F5F5F5] hover:text-[#D1A04D] hover:bg-[#31343A]/50 hover:shadow-md"
                    : "text-[#B0B3B8] hover:text-[#F5F5F5] hover:bg-[#31343A] hover:shadow-md"
                }`}
              >
                Inicio
              </Link>
              <Link
                to="/cliente/negocios"
                className={`font-medium transition-all duration-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D1A04D]/50 ${
                  isActive("/cliente/negocios")
                    ? isScrolled
                      ? "text-white bg-[#D1A04D] border border-[#D1A04D] shadow-lg"
                      : "text-[#F5F5F5] bg-[#D1A04D]/20 border border-[#D1A04D]/30 shadow-lg"
                    : isScrolled
                    ? "text-[#F5F5F5] hover:text-[#D1A04D] hover:bg-[#31343A]/50 hover:shadow-md"
                    : "text-[#B0B3B8] hover:text-[#F5F5F5] hover:bg-[#31343A] hover:shadow-md"
                }`}
              >
                Negocios
              </Link>
              <Link
                to="/cliente/mis-citas"
                className={`font-medium transition-all duration-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D1A04D]/50 ${
                  isActive("/cliente/mis-citas")
                    ? isScrolled
                      ? "text-white bg-[#D1A04D] border border-[#D1A04D] shadow-lg"
                      : "text-[#F5F5F5] bg-[#D1A04D]/20 border border-[#D1A04D]/30 shadow-lg"
                    : isScrolled
                    ? "text-[#F5F5F5] hover:text-[#D1A04D] hover:bg-[#31343A]/50 hover:shadow-md"
                    : "text-[#B0B3B8] hover:text-[#F5F5F5] hover:bg-[#31343A] hover:shadow-md"
                }`}
              >
                Mis Citas
              </Link>
            </nav>

            {/* Right Side - Search and User */}
            <div className="flex items-center space-x-4">
              {/* Search Icon */}

              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className={`flex items-center space-x-3 p-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D1A04D]/50 hover:shadow-md ${
                    isScrolled ? "hover:bg-gray-100" : "hover:bg-[#31343A]"
                  }`}
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
                    <span className="text-white font-semibold text-sm">
                      {name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <span
                    className={`hidden sm:block font-medium transition-all duration-300 ${
                      isScrolled ? "text-gray-700" : "text-[#F5F5F5]"
                    }`}
                  >
                    {name || "Usuario"}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-all duration-300 ${
                      isScrolled ? "text-gray-500" : "text-[#B0B3B8]"
                    } ${isDropdownOpen ? "rotate-180" : ""}`}
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
                  <div
                    className={`absolute flex flex-col right-0 mt-2 w-48 backdrop-blur-md rounded-xl shadow-2xl py-2 z-50 transition-all duration-300 animate-in slide-in-from-top-2 ${
                      isScrolled
                        ? "bg-white/95 border border-gray-200/50"
                        : "bg-[#23262B]/95 border border-[#31343A]"
                    }`}
                  >
                    <Link
                      to="/cliente/perfil"
                      className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 mx-2 focus:outline-none focus:ring-2 focus:ring-[#D1A04D]/50 ${
                        isScrolled
                          ? "text-gray-700 hover:bg-gray-100 hover:text-[#D1A04D]"
                          : "text-[#B0B3B8] hover:bg-[#31343A] hover:text-[#F5F5F5]"
                      }`}
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <svg
                        className="w-4 h-4 mr-3 transition-all duration-300"
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
                    </Link>
                    <Link
                      to="/cliente/solicitar-propietario"
                      className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 mx-2 focus:outline-none focus:ring-2 focus:ring-[#D1A04D]/50 ${
                        isScrolled
                          ? "text-gray-700 hover:bg-gray-100 hover:text-[#D1A04D]"
                          : "text-[#B0B3B8] hover:bg-[#31343A] hover:text-[#F5F5F5]"
                      }`}
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <BuildingStorefrontIcon className="w-4 h-4 mr-3 transition-all duration-300" />
                      Solicitar ser propietario
                    </Link>
                    <div
                      className={`border-t w-full my-1 transition-all duration-300 ${
                        isScrolled ? "border-gray-200" : "border-[#31343A]"
                      }`}
                    ></div>
                    <div className="mx-2">
                      <ButtonCloseSession />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
