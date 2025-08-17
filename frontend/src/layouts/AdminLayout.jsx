import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

const AdminLayout = () => {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md p-4 flex flex-col justify-between">
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
                <div className="flex justify-center mt-auto mb-4 w-full ">
                    <Link to="/">
                        <button className="block bg-red-500 text-white p-2 rounded-md">
                            Cerrar sesión
                        </button>
                    </Link>
                </div>
            </aside>

            {/* Contenido principal */}
            <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
                <Outlet /> {}
            </main>
        </div>
    );
};

export default AdminLayout;
