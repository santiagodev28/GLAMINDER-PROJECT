import express from "express";
import dotenv from "dotenv";
import cors from "cors";

const app = express();

// Middleware
app.use(express.json());

// Configuración de CORS
app.use(cors({
    origin: "http://localhost:5173"
}));

// Configuración de dotenv
dotenv.config();



export default app;

