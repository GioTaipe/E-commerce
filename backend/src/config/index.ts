import dotenv from "dotenv";
dotenv.config();

export const config = {
    jwtSecret: process.env.JWT_SECRET || "fallback_secret",
    dbUrl: process.env.DATABASE_URL
};
