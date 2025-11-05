import { CreateCategoryDto, UpdateCategoryDto } from "../dto/category.dto";
import { CategoryRepository } from "../repositories/category.repository";

const categoryRepository = new CategoryRepository();    
export class CategoryService {
    async createCategory(data: CreateCategoryDto) {
        return categoryRepository.create(data);
    }

    async updateCategory(id: number, data: UpdateCategoryDto) {
        return categoryRepository.update(id, data);
    }

    async deleteCategory(id: number) {
        return categoryRepository.delete(id);
    }

    async findAllCategories() {
        return categoryRepository.findAll();
    }

    async findCategoryById(id: number) {
        return categoryRepository.findById(id);
    }
}