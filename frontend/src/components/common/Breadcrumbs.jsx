import { Link } from "react-router-dom";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline";

/**
 * Componente de breadcrumbs para navegación
 * @param {Array} items - Array de objetos con { label, path } para cada breadcrumb
 * @param {String} homePath - Ruta del home (default: "/admin/dashboard")
 */
const Breadcrumbs = ({ items = [], homePath = "/admin/dashboard" }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm mb-4" aria-label="Breadcrumb">
      <Link
        to={homePath}
        className="text-gray-500 hover:text-[#D1A04D] transition-colors flex items-center"
        aria-label="Inicio"
      >
        <HomeIcon className="h-5 w-5" />
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRightIcon className="h-4 w-4 text-gray-400" />
          {index === items.length - 1 ? (
            <span className="text-gray-700 font-medium">{item.label}</span>
          ) : (
            <Link
              to={item.path}
              className="text-gray-500 hover:text-[#D1A04D] transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumbs;

