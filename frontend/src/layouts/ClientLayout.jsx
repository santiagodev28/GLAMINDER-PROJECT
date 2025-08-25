import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "../features/client/components/Header";
import NavBar from "../features/client/components/NavBar";

const ClientLayout = () => {
  return (
    <div className="min-h-screen bg-transparent">
      {/* Header/Navbar principal */}
      <Header/>

      {/* Navegación horizontal */}
      <NavBar />

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
