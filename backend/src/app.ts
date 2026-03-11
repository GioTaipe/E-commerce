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
    'https://e-commerce-1-ap6o.onrender.com'
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

// Middleware de errores
app.use(errorHandler);

export default app;
