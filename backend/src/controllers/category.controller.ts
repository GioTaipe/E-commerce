import type { Request, Response } from "express";
import { CategoryService } from "../services/category.services.js";

export class CategoryController {
    private categoryService: CategoryService;
    
      constructor() {
        this.categoryService = new CategoryService();
      }
    // Crear una nueva categoría
    create = async (req: Request, res: Response) => {
        try {
            const category = await this.categoryService.createCategory(req.body);
            res.status(201).json(category);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };
    // Actualizar una categoría existente
    update = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const category = await this.categoryService.updateCategory(Number(id), req.body);
            res.json(category);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };  
    // Eliminar una categoría
    delete = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await this.categoryService.deleteCategory(Number(id));
            res.sendStatus(204);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };
    // Obtener todas las categorías
    getAll = async (req: Request, res: Response) => {
        try {
            const categories = await this.categoryService.findAllCategories();
            res.json(categories);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }   
    };
}