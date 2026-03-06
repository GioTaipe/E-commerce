import dotenv from "dotenv";
dotenv.config();

// Helper para validar variables de entorno requeridas
function getRequiredEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}

export const config = {
    jwtSecret: getRequiredEnv("JWT_SECRET"),
    jwtExpiry: process.env.JWT_EXPIRY || "1h",
    dbUrl: getRequiredEnv("DATABASE_URL"),
    nodeEnv: process.env.NODE_ENV || "development",
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:3001"
};
