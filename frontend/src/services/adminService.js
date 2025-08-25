import api from "../api/api.js";

const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// =======================
//  Usuarios
// =======================
const getUsersByState = async (showDeletedUsers = false) => {
    const state = showDeletedUsers ? 0 : 1;
    const res = await api.get(`/usuarios?usuario_estado=${state}`, {
        headers: getAuthHeaders(),
    });
    return res.data;
};

const deleteUser = async (usuario_id) => {
    const res = await api.put(
        `/usuarios/desactivar/${usuario_id}`,
        {
            usuario_estado: 0,
        },
        {
            headers: getAuthHeaders(),
        }
    );
    return res.data;
};

// =======================
// Negocios y tiendas
// =======================
const fetchBusinesses = async () => {
    const res = await api.get("/negocios", {
        headers: getAuthHeaders(),
    });
    return res.data;
};

const fetchBusinessById = async (negocio_id) => {
    const res = await api.get(`/negocios/${negocio_id}`, {
        headers: getAuthHeaders(),
    });
    return res.data;
};

const fetchStoresByBusiness = async (negocio_id) => {
    const res = await api.get(`/negocios/${negocio_id}/tiendas`, {
        headers: getAuthHeaders(),
    });
    return res.data;
};

const fetchEmployeesByStore = async (tienda_id) => {
    const res = await api.get(`/tiendas/${tienda_id}/empleados`, {
        headers: getAuthHeaders(),
    });
    return res.data;
};

const deleteBusiness = async (negocio_id) => {
    const res = await api.put(
        `/negocios/desactivar/${negocio_id}`,
        { negocio_estado: 0 },
        { headers: getAuthHeaders() }
    );
    return res.data;
};

const reactivateBusiness = async (negocio_id) => {
    const res = await api.put(
        `/negocios/activar/${negocio_id}`,
        { negocio_estado: 1 },
        { headers: getAuthHeaders() }
    );
    return res.data;
};

// =======================
// Reportes (según reportsRoute.js)
// =======================

// Citas
const fetchAppointmentsByState = async (cita_estado) => {
    const res = await api.get(`/reportes/citas/estado/${cita_estado}`, {
        headers: getAuthHeaders(),
    });
    return res.data;
};

const fetchAppointmentsByDay = async (cita_fecha) => {
    const res = await api.get(`/reportes/citas/dia/${cita_fecha}`, {
        headers: getAuthHeaders(),
    });
    return res.data;
};

const fetchAppointmentsTrends = async () => {
    const res = await api.get(`/reportes/citas/tendencias`, {
        headers: getAuthHeaders(),
    });
    return res.data;
};

// Servicios
const fetchTopServices = async () => {
    const res = await api.get(`/reportes/servicios/mas-agendados`, {
        headers: getAuthHeaders(),
    });
    return res.data;
};

// Empleados
const fetchTopEmployees = async () => {
    const res = await api.get(`/reportes/empleados/mas-agendados`, {
        headers: getAuthHeaders(),
    });
    return res.data;
};

// Tiendas
const fetchTopStores = async () => {
    const res = await api.get(`/reportes/tiendas/top`, {
        headers: getAuthHeaders(),
    });
    return res.data;
};

// Negocios
const fetchTopBusiness = async () => {
    const res = await api.get(`/reportes/negocios/top`, {
        headers: getAuthHeaders(),
    });
    return res.data;
};

// Usuarios registrados por mes
const fetchUserRegistrationTrends = async () => {
    const res = await api.get(`/reportes/usuarios/tendencias`, {
        headers: getAuthHeaders(),
    });
    return res.data;
};

// Estadísticas generales
const fetchStatsOverview = async () => {
    const res = await api.get(`/reportes/estadisticas/resumen`, {
        headers: getAuthHeaders(),
    });
    return res.data;
};

// Rendimiento
const fetchPerformanceReport = async () => {
    const res = await api.get(`/reportes/rendimiento`, {
        headers: getAuthHeaders(),
    });
    return res.data;
};

// Satisfacción del cliente
const fetchCustomerSatisfaction = async () => {
    const res = await api.get(`/reportes/satisfaccion`, {
        headers: getAuthHeaders(),
    });
    return res.data;
};

// Reporte personalizado
const fetchCustomReport = async (payload) => {
    const res = await api.post(`/reportes/personalizado`, payload, {
        headers: getAuthHeaders(),
    });
    return res.data;
};

// =======================
// Utilidades
// =======================
const rolToString = (rol) => {
    switch (rol) {
        case 1:
            return "Administrador";
        case 2:
            return "Propietario";
        case 3:
            return "Empleado";
        case 4:
            return "Cliente";
        default:
            return "Desconocido";
    }
};

// =======================
// Exportar como objeto único
// =======================
const AdminService = {
    getUsersByState,
    deleteUser,
    fetchBusinesses,
    fetchBusinessById,
    fetchStoresByBusiness,
    fetchEmployeesByStore,
    deleteBusiness,
    reactivateBusiness,
    fetchAppointmentsByState,
    fetchAppointmentsByDay,
    fetchAppointmentsTrends,
    fetchTopServices,
    fetchTopEmployees,
    fetchTopStores,
    fetchTopBusiness,
    fetchUserRegistrationTrends,
    fetchStatsOverview,
    fetchPerformanceReport,
    fetchCustomerSatisfaction,
    fetchCustomReport,
    rolToString,
};

export default AdminService;
