import type { Request, Response } from "express";
import { ProductService } from "../services/product.services";

const productService = new ProductService();

export class ProductController {
  private productService = new ProductService();

  // Crear un nuevo producto
  create = async (req: Request, res: Response) => {
    try {
      const product = await this.productService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  // Actualizar un producto existente
  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const product = await this.productService.updateProduct(Number(id), req.body);
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  // Eliminar un producto
  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.productService.deleteProduct(Number(id));
      res.sendStatus(204);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  // Obtener todos los productos
  getAll = async (req: Request, res: Response) => {
    try {
      const products = await this.productService.getAllProducts();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  // Obtener un producto por ID
  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const product = await this.productService.getProductById(Number(id));
      res.json(product);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };
}