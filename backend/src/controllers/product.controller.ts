import type { Request, Response } from "express";
import { ProductService } from "../services/product.services.js";
import { UploadedFile } from "express-fileupload";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateProductDto } from "../dto/product.dto.js";

export class ProductController {
  constructor(private productService = new ProductService()) {}

  create = async (req: Request, res: Response) => {
    const image = req.files?.image as UploadedFile | undefined;
    const image2 = req.files?.image2 as UploadedFile | undefined;
    const image3 = req.files?.image3 as UploadedFile | undefined;

    if (!image) {
      return res.status(400).json({ error: "La imagen principal del producto es obligatoria (campo 'image')" });
    }

    const dto = plainToInstance(CreateProductDto, req.body, { enableImplicitConversion: true });
    // [FIX] validate() + respuesta 400 con mensajes — validateOrReject lanzaba un array
    // de ValidationError que el errorHandler no reconocía y devolvía 500 sin detalle.
    const errors = await validate(dto, { whitelist: true, forbidNonWhitelisted: true });
    if (errors.length > 0) {
      const messages = errors.map((err) => Object.values(err.constraints || {})).flat();
      return res.status(400).json({ errors: messages });
    }

    const images: { image: UploadedFile; image2?: UploadedFile; image3?: UploadedFile } = { image };
    if (image2) images.image2 = image2;
    if (image3) images.image3 = image3;

    const product = await this.productService.createProduct(dto, images);
    res.status(201).json(product);
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = { ...req.body } as Record<string, unknown>;

    const image = req.files?.image as UploadedFile | undefined;
    const image2 = req.files?.image2 as UploadedFile | undefined;
    const image3 = req.files?.image3 as UploadedFile | undefined;

    if (image) data.image = image;
    if (image2) data.image2 = image2;
    if (image3) data.image3 = image3;

    try {
      const product = await this.productService.updateProduct(Number(id), data);
      res.json(product);
    } catch (err) {
      if (err instanceof Error && err.message === "AT_LEAST_ONE_IMAGE") {
        return res.status(400).json({ error: "El producto debe conservar al menos una imagen" });
      }
      throw err;
    }
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
