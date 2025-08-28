import { Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import ClientLayout from "../layouts/ClientLayout";
import OwnerLayout from "../layouts/OwnerLayout";

// Importación de las páginas y componentes
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import AdminDashboard from "../features/admin/pages/AdminDashboard";
import UserAdmin from "../features/admin/pages/UserAdmin";
import BussinesAdmin from "../features/admin/pages/BussinesAdmin";
import StoresByBusinessTable from "../features/admin/components/StoresByBusiness";
import EmployeeList from "../features/admin/components/EmployeeList";
import BusinessStats from "../features/admin/components/BusinessStats";
import StatsAdmin from "../features/admin/pages/StatsAdmin";
import RequestsAdmin from "../features/admin/pages/RequestsAdmin";
import RequestOwner from "../features/client/components/RequestOwner";
import BusinessList from "../features/client/components/Businesses/BusinessList";
import BusinessDetail from "../features/client/components/Businesses/BusinessDetail";
import AppointmentBooking from "../features/client/components/Appointments/AppointmentBooking";
import UserAppointments from "../features/client/components/Appointments/UserAppointments";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/ingresar" element={<Login />} />
      <Route path="/registrar" element={<Register />} />

      {/* Layout de administrador */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/usuarios" element={<UserAdmin />} />
        <Route path="/admin/negocios" element={<BussinesAdmin />} />
        <Route path="/admin/solicitudes" element={<RequestsAdmin />} />
        <Route
          path="/admin/negocios/:negocio_id/tiendas"
          element={<StoresByBusinessTable />}
        />
        <Route
          path="/admin/negocios/:negocio_id/tiendas/:tienda_id/empleados"
          element={<EmployeeList />}
        />
        <Route
          path="/admin/negocios/:negocio_id/estadisticas"
          element={<BusinessStats />}
        />
        <Route path="/admin/estadisticas" element={<StatsAdmin />} />
      </Route>

      {/* Layout de Cliente */}
      <Route path="/cliente" element={<ClientLayout />}>
        {/* Aquí puedes agregar rutas específicas para el cliente */}
        <Route path="/cliente/propietario" element={<RequestOwner />} />
        <Route path="/cliente/dashboard" element={<BusinessList />} />
        <Route path="/cliente/negocios/:id" element={<BusinessDetail />} />
        <Route
          path="/cliente/agendar-cita/:businessId"
          element={<AppointmentBooking />}
        />
        <Route path="/cliente/mis-citas" element={<UserAppointments />} />
      </Route>

      {/* Layout de Propietario */}
      <Route path="/propietario" element={<OwnerLayout />}></Route>
    </Routes>
  );
};

export default AppRoutes;
