import { CreateCategoryDto, UpdateCategoryDto } from "../dto/category.dto.js";
import { CategoryRepository } from "../repositories/category.repository.js";

export class CategoryService {
    constructor(private categoryRepository = new CategoryRepository()) {}

    async createCategory(data: CreateCategoryDto) {
        return this.categoryRepository.create(data);
    }

    async updateCategory(id: number, data: UpdateCategoryDto) {
        return this.categoryRepository.update(id, data);
    }

    async deleteCategory(id: number) {
        return this.categoryRepository.delete(id);
    }

    async findAllCategories() {
        return this.categoryRepository.findAll();
    }

    async findCategoryById(id: number) {
        return this.categoryRepository.findById(id);
    }
}
