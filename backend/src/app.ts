import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import fileUpload from "express-fileupload";
import categoryRoutes from "./routes/category.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";

const app = express();

// Cabeceras de seguridad HTTP
app.use(helmet());
app.use(cors({origin: [
    'http://localhost:3000',
    'https://e-commerce-production-8d3a.up.railway.app',
    'https://e-commerce-weld-gamma-28.vercel.app'
  ],
  methods: ['GET', 'POST', 'PATCH','PUT' ,'DELETE', 'OPTIONS']
}));

// Parsear JSON con límite de tamaño
app.use(express.json({ limit: "1mb" }));

// Configuración segura de file uploads
app.use(
  fileUpload({
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB máximo
    },
    abortOnLimit: true,
    safeFileNames: true,
    preserveExtension: true,
    createParentPath: true,
  }),
);

app.use("/auth", authRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

// Ruta no encontrada: responde en el mismo formato { error } que el resto de la API
app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

// Middleware de errores
app.use(errorHandler);

export default app;
