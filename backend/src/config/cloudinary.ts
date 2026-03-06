import { v2 as cloudinary } from "cloudinary";

const requiredVars = ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"] as const;

for (const varName of requiredVars) {
  if (!process.env[varName]) {
    throw new Error(`Variable de entorno ${varName} no definida`);
  }
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export default cloudinary;
