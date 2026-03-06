import type { Request, Response } from "express";
import { ProductService } from "../services/product.services.js";
import { UploadedFile } from "express-fileupload";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { CreateProductDto } from "../dto/product.dto.js";

export class ProductController {
  constructor(private productService = new ProductService()) {}

  create = async (req: Request, res: Response) => {
    const file = req.files?.image as UploadedFile | undefined;

    if (!file) {
      return res.status(400).json({ error: "La imagen del producto es obligatoria (campo 'image')" });
    }

    const dto = plainToInstance(CreateProductDto, req.body, { enableImplicitConversion: true });
    await validateOrReject(dto);

    const product = await this.productService.createProduct(dto, file);
    res.status(201).json(product);
  };

  update = async (req: Request, res: Response) => {
    
    const { id } = req.params;
    const data = { ...req.body };

    const file = req.files?.image;
    if (file) {
      data.imageUrl = file;
    }
    const product = await this.productService.updateProduct(Number(id), data);
    res.json(product);
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.productService.deleteProduct(Number(id));
    res.sendStatus(204);
  };

  getAll = async (req: Request, res: Response) => {
    const products = await this.productService.getAllProducts();
    res.json(products);
  };

  getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await this.productService.getProductById(Number(id));
    res.json(product);
  };
}
