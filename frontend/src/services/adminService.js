import api from "../api/api.js";

// Servicios para obtener los datos a mostrar en las tablas

export const getUsersByState = async () => {
    const token = localStorage.getItem("token");
    const state = showDeletedUsers ? 0 : 1;
    const res = await api.get(`/usuarios?usuario_estado=${state}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

export const fetchTopEmployees = async (negocio_id) => {
    const token = localStorage.getItem("token");
    const res = await api.get(`/reportes/top-empleados/${negocio_id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

export const fetchTopServices = async (negocio_id) => {
    const token = localStorage.getItem("token");
    const res = await api.get(`/reportes/top-servicios/${negocio_id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

export const fetchTopStores = async (negocio_id) => {
    const token = localStorage.getItem("token");
    const res = await api.get(`/reportes/top-tiendas/${negocio_id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

export const fetchTopBusiness = async (negocio_id) => {
    const token = localStorage.getItem("token");
    const res = await api.get(`/reportes/top-negocios/${negocio_id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

export const fetchAppointmentsTrends = async (negocio_id) => {
    const token = localStorage.getItem("token");
    const res = await api.get(`/reportes/tendencias-citas/${negocio_id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

export const fetchBusinesses = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/negocios", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

export const fetchEmployeesByStore = async (tienda_id) => {
    const token = localStorage.getItem("token");
    const res = await api.get(`/tiendas/${tienda_id}/empleados`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

export const fetchBusinessById = async (negocio_id) => {
    const token = localStorage.getItem("token");
    const res = await api.get(`/negocios/${negocio_id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.json();
};

export const fetchStoresByBusiness = async (negocio_id) => {
    const token = localStorage.getItem("token");
    const res = await api.get(`/negocios/${negocio_id}/tiendas`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};
export const deleteBusiness = async (negocio_id) => {
    try {
        const token = localStorage.getItem("token");

        const res = await api.put(
            `/negocios/desactivar/${negocio_id}`,
            { negocio_estado: 0 }, // ← cuerpo de la petición
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return res;
    } catch (error) {
        console.error("Error en deleteBusiness:", error);
        throw error; // ← importante lanzar el error para manejarlo en el componente
    }
};

export const reactivateBusiness = async (negocio_id) => {
    const token = localStorage.getItem("token");
    const res = await api.put(
        `/negocios/activar/${negocio_id}`,
        { negocio_estado: 1 },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return res;
};

export const fetchUserPerMonth = async (usuario_fecha_registro) => {
    const token = localStorage.getItem("token");
    const res = await api.get(
        `/reportes/usuarios-mes/${usuario_fecha_registro}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return res;
};

export const fetchStatsOverview = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/reportes/estadisticas-resumen", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

export const rolToString = (rol) => {
    switch (rol) {
        case 1:
            return "Administrador";
        case 2:
            return "Propietario";
        case 3:
            return "Empleado";
        case 4:
            return "Cliente";
    }
};
