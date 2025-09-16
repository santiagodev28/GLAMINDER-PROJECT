import { Outlet } from "react-router-dom";
import Header from "../features/client/components/Header";

const ClientLayout = () => {
  return (
    <div className="min-h-screen relative">
      {/* Imagen de fondo de barbería */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
        }}
      ></div>

      {/* Overlay oscuro para mejor contraste */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>

      {/* Header flotante moderno */}
      <div className="relative z-[9999]">
        <Header />
      </div>

      {/* Contenido principal */}
      <main className="relative z-10 flex-1 px-6 pt-40 pb-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ClientLayout;
