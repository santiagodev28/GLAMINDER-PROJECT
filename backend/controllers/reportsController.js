import Reports from "../models/Report.js";

class ReportsController {
    static async getAllAppointmentsByState(req, res) {
        try {
            const { cita_estado } = req.params;
            const filters = req.query;
            const appointments = await Reports.getAllAppointmentsByState(cita_estado, filters);
            res.json(appointments);
        } catch (error) {
            console.error("Error al obtener citas por estado:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async getAppointmentsByDay(req, res) {
        try {
            const { cita_fecha } = req.params;
            const filters = req.query;
            const appointments = await Reports.getAppointmentsByDay(cita_fecha, filters);
            res.json(appointments);
        } catch (error) {
            console.error("Error al obtener citas por día:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async getMostScheduledServices(req, res) {
        try {
            const { limit } = req.query;
            const filters = req.query;
            const services = await Reports.getMostScheduledServices(Number(limit) || 5, filters);
            res.json(services);
        } catch (error) {
            console.error("Error al obtener servicios más agendados:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async getMostScheduledEmployees(req, res) {
        try {
            const { limit } = req.query;
            const filters = req.query;
            const employees = await Reports.getMostScheduledEmployees(Number(limit) || 5, filters);
            res.json(employees);
        } catch (error) {
            console.error("Error al obtener empleados más agendados:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async getTopStores(req, res) {
        try {
            const { negocio_id } = req.query;
            const { limit } = req.query;
            const filters = req.query;
            const stores = await Reports.getTopStores(negocio_id, Number(limit) || 5, filters);
            res.json(stores);
        } catch (error) {
            console.error("Error al obtener tiendas top:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async getTopBusinessByRating(req, res) {
        try {
            const { limit } = req.query;
            const business = await Reports.getTopBusinessByRating(Number(limit) || 5);
            res.json(business);
        } catch (error) {
            console.error("Error al obtener negocios top por calificación:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async getAppointmentsTrends(req, res) {
        try {
            const { negocio_id, months } = req.query;
            const trends = await Reports.getAppointmentsTrends(negocio_id, Number(months) || 6);
            res.json(trends);
        } catch (error) {
            console.error("Error al obtener tendencias de citas:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async getUserRegistrationTrends(req, res) {
        try {
            const { months, fecha_desde } = req.query;
            const trends = await Reports.getUserRegistrationTrends(Number(months) || 6, fecha_desde);
            res.json(trends);
        } catch (error) {
            console.error("Error al obtener tendencias de registro:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async getStatsOverview(req, res) {
        try {
            const { negocio_id } = req.query;
            const stats = await Reports.getStatsOverview(negocio_id);
            res.json(stats);
        } catch (error) {
            console.error("Error al obtener resumen de estadísticas:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async getPerformanceReport(req, res) {
        try {
            const { negocio_id, fecha_desde, fecha_hasta } = req.query;
            const report = await Reports.getPerformanceReport(negocio_id, fecha_desde, fecha_hasta);
            res.json(report);
        } catch (error) {
            console.error("Error al obtener reporte de rendimiento:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async getCustomerSatisfactionReport(req, res) {
        try {
            const { negocio_id, limit } = req.query;
            const report = await Reports.getCustomerSatisfactionReport(negocio_id, Number(limit) || 10);
            res.json(report);
        } catch (error) {
            console.error("Error al obtener reporte de satisfacción:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async getCustomReport(req, res) {
        try {
            const { query, params } = req.body;
            const report = await Reports.getCustomReport(query, params);
            res.json(report);
        } catch (error) {
            console.error("Error en reporte personalizado:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

}

export default ReportsController;