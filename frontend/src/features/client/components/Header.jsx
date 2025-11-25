import ButtonCloseSession from "../../../components/buttons/ButtonCloseSession";
import EditProfileModal from "../../../components/modals/EditProfileModal";
import ProfileService from "../../../services/profileService";
import logo from "../../../assets/images/logo.png";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    BuildingStorefrontIcon,
    UserIcon,
    ChevronDownIcon,
    HomeIcon,
    BriefcaseIcon,
    CalendarIcon,
} from "@heroicons/react/24/outline";

const Header = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [user, setUser] = useState(null);
    const dropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const location = useLocation();

    // Cargar datos del usuario
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

    const handleProfileSave = (updatedUser) => {
        setUser(updatedUser);
        setShowEditProfile(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
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
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
            if (
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target)
            ) {
                setIsMobileMenuOpen(false);
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

    const navItems = [
        { path: "/cliente/dashboard", label: "Inicio", icon: HomeIcon },
        { path: "/cliente/negocios", label: "Negocios", icon: BriefcaseIcon },
        { path: "/cliente/mis-citas", label: "Mis Citas", icon: CalendarIcon },
    ];

    return (
        <div className="fixed top-0 left-0 right-0 z-50 w-full flex justify-center pt-4 pb-2">
            <header
                className={`backdrop-blur-lg rounded-2xl w-full max-w-6xl mx-4 transition-all duration-300 ${
                    isScrolled
                        ? "bg-[#1A1C20]/95 shadow-xl"
                        : "bg-[#23262B]/60 shadow-lg"
                }`}
            >
                <div className="px-6 py-3">
                    <div className="flex items-center justify-between">
                        {/* LOGO + BRAND */}
                        <div className="flex items-center transition-all duration-300 hover:scale-105">
                            <Link
                                to="/cliente/dashboard"
                                className="flex items-center transition-all duration-300 hover:scale-105"
                            >
                                <img
                                    src={logo}
                                    alt="Glaminder Logo"
                                    className="h-14 w-auto drop-shadow-lg"
                                />

                                <span
                                    className={`ml-3 text-xl font-bold ${
                                        isScrolled
                                            ? "text-gray-100"
                                            : "text-[#F5F5F5]"
                                    }`}
                                >
                                    Glaminder
                                </span>
                            </Link>
                        </div>

                        {/* DESKTOP NAV */}
                        <nav className="hidden md:flex items-center space-x-6">
                            {[
                                { path: "/cliente/dashboard", label: "Inicio" },
                                {
                                    path: "/cliente/negocios",
                                    label: "Negocios",
                                },
                                {
                                    path: "/cliente/mis-citas",
                                    label: "Mis Citas",
                                },
                            ].map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`font-medium transition-all px-4 py-2 rounded-lg ${
                                        isActive(item.path)
                                            ? "bg-[#D1A04D] text-white shadow-md"
                                            : "text-gray-300 hover:bg-[#31343A] hover:text-white"
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        {/* MOBILE HAMBURGER */}
                        <button
                            className="md:hidden p-2 rounded-lg hover:bg-[#31343A] transition-colors ml-2"
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                        >
                            <svg
                                className="w-6 h-6 text-gray-200"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d={
                                        isMobileMenuOpen
                                            ? "M6 18L18 6M6 6l12 12"
                                            : "M4 6h16M4 12h16M4 18h16"
                                    }
                                />
                            </svg>
                        </button>

                        {/* USER DROPDOWN (DESKTOP) */}
                        <div
                            className="hidden md:block relative"
                            ref={dropdownRef}
                        >
                            <button
                                onClick={toggleDropdown}
                                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#1d1e20] hover:bg-[#3D4149] transition-all duration-200 text-gray-200 hover:text-white"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] flex items-center justify-center">
                                    <UserIcon className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-medium text-sm">
                                    {user?.usuario_nombre || "Usuario"}
                                </span>
                                <ChevronDownIcon
                                    className={`w-4 h-4 transition-transform duration-200 ${
                                        isDropdownOpen
                                            ? "transform rotate-180"
                                            : ""
                                    }`}
                                />
                            </button>

                            {/* DROPDOWN MENU */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-[#1A1C20]/98 backdrop-blur-lg rounded-xl shadow-2xl border border-[#31343A]/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    {/* USER INFO HEADER */}
                                    <div className="px-4 py-4 bg-gradient-to-r from-[#D1A04D]/10 to-[#B47B1C]/10 border-b border-[#31343A]">
                                        <p className="text-sm text-gray-400">
                                            Mi Cuenta
                                        </p>
                                        <p className="text-white font-semibold">
                                            {user?.usuario_nombre}{" "}
                                            {user?.usuario_apellido}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {user?.usuario_correo}
                                        </p>
                                    </div>

                                    {/* DROPDOWN ITEMS */}
                                    <div className="py-2">
                                        {/* Editar Perfil */}
                                        <button
                                            onClick={() => {
                                                setShowEditProfile(true);
                                                setIsDropdownOpen(false);
                                            }}
                                            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-200 hover:bg-[#31343A] hover:text-white transition-colors duration-150"
                                        >
                                            <UserIcon className="w-5 h-5 text-[#D1A04D]" />
                                            <span>Editar Perfil</span>
                                        </button>

                                        {/* Solicitar ser Propietario */}
                                        <Link
                                            to="/cliente/solicitar-propietario"
                                            onClick={() =>
                                                setIsDropdownOpen(false)
                                            }
                                            className="flex items-center space-x-3 px-4 py-3 text-gray-200 hover:bg-[#31343A] hover:text-white transition-colors duration-150"
                                        >
                                            <BuildingStorefrontIcon className="w-5 h-5 text-[#D1A04D]" />
                                            <span>
                                                Solicitar ser propietario
                                            </span>
                                        </Link>

                                        {/* Divisor */}
                                        <div className="my-2 border-t border-[#31343A]"></div>

                                        {/* Cerrar Sesión */}
                                        <div className="px-4 py-2 w-full">
                                            <ButtonCloseSession className="w-full" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* MOBILE MENU */}
                    {isMobileMenuOpen && (
                        <div
                            ref={mobileMenuRef}
                            className="md:hidden mt-4 flex flex-col space-y-1 bg-[#1A1C20]/95 p-4 rounded-xl shadow-xl border border-[#31343A]/50 animate-in fade-in slide-in-from-top-2 duration-200"
                        >
                            {/* Mobile Navigation Links */}
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={closeMobileMenu}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-150 ${
                                            isActive(item.path)
                                                ? "bg-[#D1A04D] text-white"
                                                : "text-gray-200 hover:bg-[#31343A] hover:text-white"
                                        }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="font-medium">
                                            {item.label}
                                        </span>
                                    </Link>
                                );
                            })}

                            {/* Divisor */}
                            <div className="border-t border-[#31343A] my-2"></div>

                            {/* Perfil */}
                            <button
                                onClick={() => {
                                    setShowEditProfile(true);
                                    closeMobileMenu();
                                }}
                                className="flex items-center space-x-3 px-4 py-3 text-gray-200 hover:bg-[#31343A] hover:text-white rounded-lg transition-colors duration-150 text-left w-full"
                            >
                                <UserIcon className="w-5 h-5 text-[#D1A04D]" />
                                <span className="font-medium">
                                    Editar Perfil
                                </span>
                            </button>

                            {/* Solicitar ser Propietario */}
                            <Link
                                to="/cliente/solicitar-propietario"
                                onClick={closeMobileMenu}
                                className="flex items-center space-x-3 px-4 py-3 text-gray-200 hover:bg-[#31343A] hover:text-white rounded-lg transition-colors duration-150"
                            >
                                <BuildingStorefrontIcon className="w-5 h-5 text-[#D1A04D]" />
                                <span className="font-medium">
                                    Solicitar ser propietario
                                </span>
                            </Link>

                            {/* Divisor */}
                            <div className="border-t border-[#31343A] my-2"></div>

                            {/* Cerrar Sesión */}
                            <div className="px-2">
                                <ButtonCloseSession />
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <EditProfileModal
                isOpen={showEditProfile}
                onClose={() => setShowEditProfile(false)}
                onSave={handleProfileSave}
            />
        </div>
    );
};

export default Header;
