import { Outlet } from "react-router-dom";
import Header from "../features/client/components/Header";

const ClientLayout = () => {
  return (
    <div className="min-h-screen app-background">
      {/* Header flotante moderno */}
      <Header />

      {/* Contenido principal */}
      <main className="flex-1 px-6 pt-40 pb-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ClientLayout;
