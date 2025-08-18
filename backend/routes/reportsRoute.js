import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import ReportsController from "../controllers/reportsController.js";

const reportRoutes = Router();

// Citas por estado
reportRoutes.get('/citas/estado/:cita_estado', verifyToken, authorizeRoles(1,2), ReportsController.getAllAppointmentsByState);

// Citas por día específico
reportRoutes.get('/citas/dia/:cita_fecha', verifyToken, authorizeRoles(1,2), ReportsController.getAppointmentsByDay);

// Servicios más agendados
reportRoutes.get('/servicios/mas-agendados', verifyToken, authorizeRoles(1,2), ReportsController.getMostScheduledServices);

// Empleados más agendados
reportRoutes.get('/empleados/mas-agendados', verifyToken, authorizeRoles(1,2), ReportsController.getMostScheduledEmployees);

// Tiendas con más citas
reportRoutes.get('/tiendas/top', verifyToken, authorizeRoles(1,2), ReportsController.getTopStores);

// Negocios con mejores calificaciones
reportRoutes.get('/negocios/top', verifyToken, authorizeRoles(1,2), ReportsController.getTopBusinessByRating);

// Tendencias de agendamientos por mes
reportRoutes.get('/citas/tendencias', verifyToken, authorizeRoles(1,2), ReportsController.getAppointmentsTrends);

// Usuarios registrados por mes
reportRoutes.get('/usuarios/tendencias', verifyToken, authorizeRoles(1,2), ReportsController.getUserRegistrationTrends);

// Resumen general de estadísticas
reportRoutes.get('/estadisticas/resumen', verifyToken, authorizeRoles(1,2), ReportsController.getStatsOverview);

// Reporte de rendimiento por período
reportRoutes.get('/rendimiento', verifyToken, authorizeRoles(1,2), ReportsController.getPerformanceReport);

// Reporte de satisfacción del cliente
reportRoutes.get('/satisfaccion', verifyToken, authorizeRoles(1,2), ReportsController.getCustomerSatisfactionReport);

// Reporte personalizado (POST para consultas avanzadas)
reportRoutes.post('/personalizado', verifyToken, authorizeRoles(1,2), ReportsController.getCustomReport);

export default reportRoutes;