import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Importar rutas
import userRoutes from "./routes/usersRoute.js";
import authRoutes from "./routes/authRoute.js";
import rolRoutes from "./routes/rolRoute.js";
import businessRoutes from "./routes/businessRoute.js";
import serviceRoutes from "./routes/servicesRoute.js";
import ownerRoutes from "./routes/ownersRoutes.js";
import employeeRoutes from "./routes/employeesRoute.js";
import reportRoutes from "./routes/reportsRoute.js";
import storesRoutes from "./routes/storesRoute.js";
import scheduleRoutes from "./routes/schedulesRoutes.js";
import appointmentRoutes from "./routes/appointmentsRoute.js";
import requestRoutes from "./routes/requestRoute.js";
import franjasRoutes from "./routes/franjasRoute.js";

const app = express();

// Middleware
app.use(express.json());

// Configuración de CORS
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// Configuración de dotenv
dotenv.config();

// Rutas
app.use("/api/usuarios", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/roles", rolRoutes);
app.use("/api/negocios", businessRoutes);
app.use("/api/servicios", serviceRoutes);
app.use("/api/empleados", employeeRoutes);
app.use("/api/propietarios", ownerRoutes);
app.use("/api/reportes", reportRoutes);
app.use("/api/tiendas", storesRoutes);
app.use("/api/citas", appointmentRoutes);
app.use("/api/horarios", scheduleRoutes);
app.use("/api/franjas", franjasRoutes);
app.use("/api/solicitudes", requestRoutes);

export default app;
