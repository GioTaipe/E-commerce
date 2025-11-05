import { CreateProductDto, UpdateProductDto } from "../dto/product.dto";
import { ProductRepository } from "../repositories/product.repository";
import { uploadToS3 } from "../utils/s3.js";

const productRepository = new ProductRepository();

export class ProductService {
    async createProduct(data: CreateProductDto) {
        
        if (data.imageUrl) {
            const imageUrl = await uploadToS3(data.imageUrl);
            data.imageUrl = imageUrl;
        }
        return productRepository.create(data);
    }

    async updateProduct(id: number, data: UpdateProductDto) {
        return productRepository.update(id, data);
    }

    async deleteProduct(id: number) {
        return productRepository.delete(id);
    }

    async getAllProducts() {
        return productRepository.findAll();
    }

    async getProductById(id: number) {
        return productRepository.findById(id);
    }
}