import { Outlet } from "react-router-dom";
import Header from "../features/client/components/Header";

const ClientLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header moderno con navegación integrada */}
      <Header />

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
