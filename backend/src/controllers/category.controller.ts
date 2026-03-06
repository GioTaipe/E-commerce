import type { Request, Response } from "express";
import { CategoryService } from "../services/category.services.js";

export class CategoryController {
    constructor(private categoryService = new CategoryService()) {}

    create = async (req: Request, res: Response) => {
        const category = await this.categoryService.createCategory(req.body);
        res.status(201).json(category);
    };

    update = async (req: Request, res: Response) => {
        const { id } = req.params;
        const category = await this.categoryService.updateCategory(Number(id), req.body);
        res.json(category);
    };

    delete = async (req: Request, res: Response) => {
        const { id } = req.params;
        await this.categoryService.deleteCategory(Number(id));
        res.sendStatus(204);
    };

    getAll = async (req: Request, res: Response) => {
        const categories = await this.categoryService.findAllCategories();
        
        res.json(categories);
    };
}
