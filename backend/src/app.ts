import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import fileUpload from 'express-fileupload';
import categoryRoutes from "./routes/category.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import { config } from "./config/index.js";

const app = express();

// Cabeceras de seguridad HTTP
app.use(helmet());

// Configuración de CORS (soporta múltiples orígenes separados por coma en FRONTEND_URL)
const allowedOrigins = config.frontendUrl.split(",").map(o => o.trim());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parsear JSON con límite de tamaño
app.use(express.json({ limit: '1mb' }));

// Configuración segura de file uploads
app.use(fileUpload({
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  },
  abortOnLimit: true,
  safeFileNames: true,
  preserveExtension: true,
  createParentPath: true
}));

app.use("/auth", authRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

// Middleware de errores
app.use(errorHandler);

export default app;
