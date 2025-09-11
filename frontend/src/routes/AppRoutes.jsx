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
import DashboardClient from "../features/client/pages/DashboardClient";

// Importaciones del propietario
import OwnerDashboard from "../features/owner/pages/OwnerDashboard";
import StoreManagement from "../features/owner/pages/StoreManagement";
import EmployeeManagement from "../features/owner/pages/EmployeeManagement";
import AppointmentManagement from "../features/owner/pages/AppointmentManagement";
import ServiceManagement from "../features/owner/pages/ServiceManagement";
import ScheduleManagement from "../features/owner/pages/ScheduleManagement";
import ReportsAndStats from "../features/owner/pages/ReportsAndStats";

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
        {/* Ruta por defecto - Dashboard */}
        <Route index element={<DashboardClient />} />
        <Route path="/cliente/propietario" element={<RequestOwner />} />
        <Route
          path="/cliente/solicitar-propietario"
          element={<RequestOwner />}
        />
        <Route path="/cliente/dashboard" element={<DashboardClient />} />
        <Route path="/cliente/negocios" element={<BusinessList />} />
        <Route path="/cliente/negocios/:id" element={<BusinessDetail />} />
        <Route
          path="/cliente/agendar-cita/:businessId"
          element={<AppointmentBooking />}
        />
        <Route path="/cliente/mis-citas" element={<UserAppointments />} />
      </Route>

      {/* Layout de Propietario */}
      <Route path="/propietario" element={<OwnerLayout />}>
        {/* Ruta por defecto - Dashboard */}
        <Route index element={<OwnerDashboard />} />
        <Route path="/propietario/dashboard" element={<OwnerDashboard />} />
        <Route path="/propietario/tiendas" element={<StoreManagement />} />
        <Route
          path="/propietario/tiendas/nueva"
          element={<StoreManagement />}
        />
        <Route
          path="/propietario/tiendas/:id/detalle"
          element={<StoreManagement />}
        />
        <Route path="/propietario/empleados" element={<EmployeeManagement />} />
        <Route path="/propietario/horarios" element={<ScheduleManagement />} />
        <Route path="/propietario/citas" element={<AppointmentManagement />} />
        <Route path="/propietario/servicios" element={<ServiceManagement />} />
        <Route path="/propietario/reportes" element={<ReportsAndStats />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
