import { CreateProductDto } from "../dto/product.dto.js";
import { ProductRepository } from "../repositories/product.repository.js";
import { uploadImage, deleteImage, extractPublicId } from "../utils/cloudinary.js";
import type { UploadedFile } from "express-fileupload";
import { NotFoundError } from "../utils/errors.js";

interface ProductImages {
  image: UploadedFile;
  image2?: UploadedFile;
  image3?: UploadedFile;
}

interface UpdateProductData {
  name?: string;
  description?: string;
  price?: string | number;
  stock?: string | number;
  categoryId?: string | number;
  image?: UploadedFile;
  image2?: UploadedFile;
  image3?: UploadedFile;
  removeImage?: boolean;
  removeImage2?: boolean;
  removeImage3?: boolean;
}

const IMAGE_SLOTS = ["imageUrl", "imageUrl2", "imageUrl3"] as const;
type ImageSlot = (typeof IMAGE_SLOTS)[number];

export class ProductService {
  constructor(private productRepository = new ProductRepository()) {}

  async createProduct(dto: CreateProductDto, images: ProductImages) {
    const imageUrl = await uploadImage(images.image);
    const imageUrl2 = images.image2 ? await uploadImage(images.image2) : null;
    const imageUrl3 = images.image3 ? await uploadImage(images.image3) : null;

    return this.productRepository.create({
      ...dto,
      imageUrl,
      imageUrl2,
      imageUrl3,
    });
  }

  async updateProduct(id: number, data: UpdateProductData) {
    const existing = await this.productRepository.findById(id);
    if (!existing) throw new NotFoundError("Producto no encontrado");

    const updateData: Record<string, unknown> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.stock !== undefined) updateData.stock = Number(data.stock);
    if (data.categoryId !== undefined) updateData.categoryId = Number(data.categoryId);

    // Resuelve el estado final de cada slot considerando reemplazo, borrado o conservar.
    const newFiles = [data.image, data.image2, data.image3];
    const removeFlags = [data.removeImage, data.removeImage2, data.removeImage3];
    const currentUrls: (string | null)[] = [
      existing.imageUrl,
      existing.imageUrl2,
      existing.imageUrl3,
    ];

    const imageMutationRequested = newFiles.some(Boolean) || removeFlags.some(Boolean);

    if (imageMutationRequested) {
      const resolvedUrls: (string | null)[] = [];

      for (let i = 0; i < 3; i++) {
        const file = newFiles[i];
        const remove = removeFlags[i];
        const current = currentUrls[i] ?? null;

        if (file) {
          // Reemplazo: borrar la anterior del mismo slot y subir la nueva.
          await this.deleteCloudinary(current);
          resolvedUrls.push(await uploadImage(file));
        } else if (remove) {
          await this.deleteCloudinary(current);
          resolvedUrls.push(null);
        } else {
          resolvedUrls.push(current);
        }
      }

      // Compactar: las URLs sobrevivientes se reasignan a [imageUrl, imageUrl2, imageUrl3]
      // en orden, para que imageUrl (NOT NULL) siempre tenga valor mientras quede al menos una.
      const surviving = resolvedUrls.filter((url): url is string => url !== null);

      if (surviving.length === 0) {
        throw new Error("AT_LEAST_ONE_IMAGE");
      }

      const compacted: (string | null)[] = [surviving[0]!, surviving[1] ?? null, surviving[2] ?? null];

      IMAGE_SLOTS.forEach((slot, i) => {
        updateData[slot] = compacted[i];
      });
    }

    return this.productRepository.update(id, updateData);
  }

  private async deleteCloudinary(url: string | null) {
    if (!url) return;
    try {
      const publicId = extractPublicId(url);
      if (publicId) await deleteImage(publicId);
    } catch (err) {
      console.warn("Error eliminando imagen de Cloudinary:", err);
    }
  }

  async deleteProduct(id: number) {
    const product = await this.productRepository.findById(id);
    if (!product) throw new NotFoundError("Producto no encontrado");

    // Soft delete: la imagen en Cloudinary y los OrderItems históricos
    // siguen siendo válidos. No tocamos Cloudinary.
    return this.productRepository.delete(id);
  }

  async getAllProducts() {
    return this.productRepository.findAll();
  }

  async getProductById(id: number) {
    const product = await this.productRepository.findById(id);
    if (!product) throw new NotFoundError("Producto no encontrado");
    return product;
  }
}
