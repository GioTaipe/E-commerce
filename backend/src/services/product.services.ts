import { CreateProductDto } from "../dto/product.dto.js";
import { ProductRepository } from "../repositories/product.repository.js";
import { uploadImage, deleteImage, extractPublicId } from "../utils/cloudinary.js";
import type { UploadedFile } from "express-fileupload";
import { NotFoundError } from "../utils/errors.js";

interface UpdateProductData {
  name?: string;
  description?: string;
  price?: string;
  stock?: string | number;
  imageUrl?: string | UploadedFile;
  categoryId?: string | number;
}


export class ProductService {
    constructor(private productRepository = new ProductRepository()) {}

    async createProduct(dto: CreateProductDto, image: UploadedFile) {

        const imageUrl = await uploadImage(image);

        return this.productRepository.create({
            ...dto,
            imageUrl,
        });
    }


    async updateProduct(id: number, data: UpdateProductData) {
        const existing = await this.productRepository.findById(id);
        if (!existing) throw new NotFoundError("Producto no encontrado");

        // Si hay una nueva imagen como UploadedFile, procesarla
        if (data.imageUrl && typeof data.imageUrl !== "string") {
            const file = data.imageUrl as UploadedFile;

            // Eliminar imagen anterior de Cloudinary
            if (existing.imageUrl) {
                try {
                    const oldPublicId = extractPublicId(existing.imageUrl);
                    if (oldPublicId) {
                        await deleteImage(oldPublicId);
                    }
                } catch (err) {
                    console.warn("Error eliminando imagen anterior de Cloudinary:", err);
                }
            }

            data.imageUrl = await uploadImage(file);
        }

        // Construir objeto limpio para el repositorio
        const { imageUrl, stock, categoryId, ...rest } = data;
        const updateData: Record<string, unknown> = { ...rest };

        if (typeof imageUrl === "string") {
            updateData.imageUrl = imageUrl;
        }
        if (stock !== undefined) {
            updateData.stock = Number(stock);
        }
        if (categoryId !== undefined) {
            updateData.categoryId = Number(categoryId);
        }

        return this.productRepository.update(id, updateData);
    }

    async deleteProduct(id: number) {
        const product = await this.productRepository.findById(id);
        if (!product) throw new NotFoundError("Producto no encontrado");

        // Eliminar imagen de Cloudinary
        if (product.imageUrl) {
            try {
                const publicId = extractPublicId(product.imageUrl);
                if (publicId) {
                    await deleteImage(publicId);
                }
            } catch (err) {
                console.warn("Error eliminando imagen de Cloudinary:", err);
            }
        }

        return this.productRepository.delete(id);
    }

    async getAllProducts() {
        return this.productRepository.findAll();
    }

    async getProductById(id: number) {
        return this.productRepository.findById(id);
    }
}
