import { Link } from "react-router-dom";
import React from "react";

const NavBar = () => {

    return(
        <nav className="bg-white shadow-md border-b border-gray-100 sticky ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 items-center">
          <div className="flex space-x-8 justify-center">
            <Link
              to="/cliente/dashboard"
              className="flex items-center px-4 py-4 text-gray-700 hover:text-yellow-600 border-b-2 border-transparent hover:border-yellow-500 transition-all duration-200 font-medium"
            >
              Inicio
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

            <Link
              to="/cliente/propietario"
              className="flex items-center px-4 py-4 text-gray-700 hover:text-yellow-600 border-b-2 border-transparent hover:border-yellow-500 transition-all duration-200 font-medium">
              Ser Propietario
            </Link>

          </div>
        </div>
      </nav>
    )
}

export default NavBar;