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

app.set("trust proxy", 1);

// Configuración de dotenv (debe ir primero)
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

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

// Permitir múltiples orígenes
const allowedOrigins = [
  'http://localhost:5173', // desarrollo local
  'https://glaminder-project-olx3ym6ro-santiago-s-projects-b9272573.vercel.app/' // frontend en Vercel
];

app.use(cors({
  origin: function(origin, callback){
    // Permitir requests sin origen (Postman, curl, etc)
    if(!origin) return callback(null, true);

    // Permitir localhost y Vercel
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Permitir cualquier subdominio de Vercel automáticamente
    if (/\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }

    // Si no coincide, rechazar
    console.log('CORS blocked origin:', origin);
    return callback(new Error('El CORS no permite este origen'), false);
  },
  credentials: true
}));

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


app.get("/", (req, res) => {
  res.send("Backend funcionando ✔️");
});

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
