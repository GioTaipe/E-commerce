import cloudinary from "../config/cloudinary.js";
import { UploadedFile } from "express-fileupload";

// Tipos MIME permitidos para imágenes
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

// Extensiones permitidas
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

// Validar que el archivo sea una imagen válida
function validateImageFile(file: UploadedFile): void {
  // Validar MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    throw new Error(
      `Invalid file type: ${file.mimetype}. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`,
    );
  }

  // Validar extensión del archivo
  const fileExtension = file.name
    .substring(file.name.lastIndexOf("."))
    .toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
    throw new Error(
      `Invalid file extension: ${fileExtension}. Allowed extensions: ${ALLOWED_EXTENSIONS.join(", ")}`,
    );
  }

  // [FIX] Límite alineado con el de express-fileupload en app.ts (5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("El archivo es demasiado grande. Tamaño máximo: 5MB");
  }
}

function sanitizeFileName(name: string): string {
  // Extraer solo el nombre del archivo (sin path traversal)
  const baseName = name.replace(/^.*[\\\/]/, "");
  // Eliminar caracteres especiales, dejar solo alfanuméricos, guiones, puntos y guiones bajos
  return baseName.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export const uploadImage = async (image: UploadedFile): Promise<string> => {
  validateImageFile(image);

  const safeName = sanitizeFileName(image.name);
  const publicId = `${Date.now()}_${safeName.replace(/\.[^.]+$/, "")}`;

  // [FIX] Eliminado console.log de debug y label "https:" accidental
  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "/ECOMMERCE/PRODUCTS",
        public_id: publicId,
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);

        // [FIX] Null check en vez de non-null assertion insegura
        if (!result) return reject(new Error("Cloudinary no devolvió resultado"));
        resolve(result.secure_url);
      },
    );
    stream.end(image.data);
  });
};

export const deleteImage = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId);
};

export const extractPublicId = (cloudinaryUrl: string): string | null => {
  // URL formato: https://res.cloudinary.com/<cloud>/image/upload/v<version>/<public_id>.<ext>
  const match = cloudinaryUrl.match(/\/upload\/v\d+\/(.+)\.[^.]+$/);
  return match?.[1] ?? null;
};
