import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import EmployeeController from "../controllers/employeeController.js";

const employeeRoutes = Router();

// Obtener todos los empleados (con filtros)
employeeRoutes.get(
  "/",
  verifyToken,
  authorizeRoles(1, 2, 3, 4),
  EmployeeController.getAllEmployees
);

// Obtener empleado por ID
employeeRoutes.get(
  "/:empleado_id",
  verifyToken,
  authorizeRoles(1, 2, 3, 4),
  EmployeeController.getEmployeeById
);

// Obtener empleado por usuario_id
employeeRoutes.get(
  "/usuario/:usuario_id",
  verifyToken,
  authorizeRoles(1, 2, 3, 4),
  EmployeeController.getEmployeeByUserId
);

// Crear nuevo empleado
employeeRoutes.post(
  "/",
  verifyToken,
  authorizeRoles(1, 2),
  EmployeeController.createEmployee
);

// Crear empleado completo (usuario + empleado)
employeeRoutes.post(
  "/completo",
  verifyToken,
  authorizeRoles(1, 2),
  EmployeeController.createCompleteEmployee
);

// Actualizar empleado
employeeRoutes.put(
  "/:empleado_id",
  verifyToken,
  authorizeRoles(1, 2, 3, 4),
  EmployeeController.updateEmployee
);

// Cambiar estado del empleado
employeeRoutes.put(
  "/:empleado_id/estado",
  verifyToken,
  authorizeRoles(1, 2),
  EmployeeController.changeEmployeeState
);

// Eliminar empleado (soft delete)
employeeRoutes.delete(
  "/:empleado_id",
  verifyToken,
  authorizeRoles(1, 2),
  EmployeeController.deleteEmployee
);

// Reactivar empleado
employeeRoutes.put(
  "/activar/:empleado_id",
  verifyToken,
  authorizeRoles(1, 2),
  EmployeeController.reactivateEmployee
);

// Obtener empleados por tienda
employeeRoutes.get(
  "/tienda/:tienda_id",
  verifyToken,
  authorizeRoles(1, 2, 3, 4),
  EmployeeController.getEmployeesByStore
);

// Obtener empleados por especialidad
employeeRoutes.get(
  "/especialidad",
  verifyToken,
  authorizeRoles(1, 2, 3, 4),
  EmployeeController.getEmployeesBySpecialty
);

// Obtener empleados disponibles para una fecha y horario específicos
employeeRoutes.get(
  "/disponibles/:tienda_id",
  verifyToken,
  authorizeRoles(1, 2, 3, 4),
  EmployeeController.getAvailableEmployees
);

// Obtener estadísticas del empleado
employeeRoutes.get(
  "/:empleado_id/stats",
  verifyToken,
  authorizeRoles(1, 2, 3, 4),
  EmployeeController.getEmployeeStats
);

// Obtener información completa del empleado (con negocio y tienda)
employeeRoutes.get(
  "/:empleado_id/info",
  verifyToken,
  authorizeRoles(1, 2, 3, 4),
  EmployeeController.getEmployeeInfo
);

// Obtener servicios del empleado
employeeRoutes.get(
  "/:empleado_id/servicios",
  verifyToken,
  authorizeRoles(1, 2, 3, 4),
  EmployeeController.getEmployeeServices
);

// Contar empleados por estado
employeeRoutes.get(
  "/count",
  verifyToken,
  authorizeRoles(1, 2),
  EmployeeController.countEmployeesByState
);

// Obtener especialidades únicas
employeeRoutes.get(
  "/especialidades",
  verifyToken,
  authorizeRoles(1, 2),
  EmployeeController.getUniqueSpecialties
);

export default employeeRoutes;
