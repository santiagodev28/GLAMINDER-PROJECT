import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import csrf from "csurf";
import { apiLimiter } from "./middlewares/rateLimiter.js";

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
import tiendaCategoriaRoutes from "./routes/tiendaCategoriaRoute.js";
import servicioCategoriaRoutes from "./routes/servicioCategoriaRoute.js";

const app = express();

// Configuración de dotenv (debe ir primero)
dotenv.config();

// Configuración de Helmet para seguridad de headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false, // Permitir recursos externos si es necesario
}));

// Configuración de CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true, // Necesario para CSRF
  })
);

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de CSRF (solo para rutas que lo requieran)
// Nota: CSRF puede causar problemas con APIs REST puras, 
// así que lo aplicaremos selectivamente si es necesario
const csrfProtection = csrf({ 
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
});

// Rate limiting general para todas las rutas
app.use('/api', apiLimiter);

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
app.use("/api/tienda-categorias", tiendaCategoriaRoutes);
app.use("/api/servicio-categorias", servicioCategoriaRoutes);

export default app;
