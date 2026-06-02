import { NotFoundError } from "../src/utils/errors";

jest.mock("../src/utils/cloudinary", () => ({
  __esModule: true,
  uploadImage: jest.fn(() =>
    Promise.resolve("https://res.cloudinary.com/demo/image/upload/v1234567890/ECOMMERCE/PRODUCTS/test.jpg")
  ),
  deleteImage: jest.fn(() => Promise.resolve()),
  extractPublicId: jest.fn((url: string) => {
    const match = url.match(/\/upload\/v\d+\/(.+)\.[^.]+$/);
    return match ? match[1] : null;
  }),
}));

import { ProductService } from "../src/services/product.services";
import { uploadImage, deleteImage, extractPublicId } from "../src/utils/cloudinary";

const mockUpload = uploadImage as jest.MockedFunction<typeof uploadImage>;
const mockDelete = deleteImage as jest.MockedFunction<typeof deleteImage>;
const mockExtract = extractPublicId as jest.MockedFunction<typeof extractPublicId>;

function createMockProductRepo() {
  return {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
}

function createMockFile(name = "test.jpg"): any {
  return {
    name,
    data: Buffer.from("fake-image"),
    size: 1024,
    mimetype: "image/jpeg",
    mv: jest.fn(),
  };
}

const CLOUDINARY_URL = "https://res.cloudinary.com/demo/image/upload/v1234567890/ECOMMERCE/PRODUCTS/test.jpg";

describe("ProductService", () => {
  let service: ProductService;
  let mockRepo: ReturnType<typeof createMockProductRepo>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRepo = createMockProductRepo();
    service = new ProductService(mockRepo as any);
  });

  describe("getAllProducts", () => {
    it("debe retornar todos los productos", async () => {
      const products = [
        { id: 1, name: "Producto A", price: 10 },
        { id: 2, name: "Producto B", price: 20 },
      ];
      mockRepo.findAll.mockResolvedValue(products);

      const result = await service.getAllProducts();

      expect(result).toEqual(products);
      expect(mockRepo.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("getProductById", () => {
    it("debe retornar un producto por su id", async () => {
      const product = { id: 1, name: "Producto A", price: 10 };
      mockRepo.findById.mockResolvedValue(product);

      const result = await service.getProductById(1);

      expect(result).toEqual(product);
      expect(mockRepo.findById).toHaveBeenCalledWith(1);
    });

    it("debe retornar null si el producto no existe", async () => {
      mockRepo.findById.mockResolvedValue(null);

      const result = await service.getProductById(999);

      expect(result).toBeNull();
    });
  });

  describe("createProduct", () => {
    it("debe subir imagen principal y crear el producto", async () => {
      const dto = { name: "Nuevo", description: "Desc", price: 50, stock: 10, categoryId: 1 };
      const file = createMockFile();
      mockRepo.create.mockResolvedValue({ id: 1, ...dto, imageUrl: CLOUDINARY_URL });

      const result = await service.createProduct(dto as any, { image: file });

      expect(mockUpload).toHaveBeenCalledWith(file);
      expect(mockRepo.create).toHaveBeenCalledWith(expect.objectContaining({
        ...dto,
        imageUrl: CLOUDINARY_URL,
        imageUrl2: null,
        imageUrl3: null,
      }));
      expect(result.id).toBe(1);
    });

    it("debe subir las 3 imágenes cuando se proporcionan", async () => {
      const dto = { name: "Nuevo", description: "Desc", price: 50, stock: 10, categoryId: 1 };
      const image = createMockFile("1.jpg");
      const image2 = createMockFile("2.jpg");
      const image3 = createMockFile("3.jpg");
      mockRepo.create.mockResolvedValue({ id: 1 });

      await service.createProduct(dto as any, { image, image2, image3 });

      expect(mockUpload).toHaveBeenCalledTimes(3);
      expect(mockRepo.create).toHaveBeenCalledWith(expect.objectContaining({
        imageUrl: CLOUDINARY_URL,
        imageUrl2: CLOUDINARY_URL,
        imageUrl3: CLOUDINARY_URL,
      }));
    });
  });

  describe("updateProduct", () => {
    it("debe actualizar campos sin imagen", async () => {
      mockRepo.findById.mockResolvedValue({ id: 1, name: "Viejo", imageUrl: null });
      mockRepo.update.mockResolvedValue({ id: 1, name: "Nuevo" });

      const result = await service.updateProduct(1, { name: "Nuevo" });

      expect(result.name).toBe("Nuevo");
      expect(mockUpload).not.toHaveBeenCalled();
    });

    it("debe subir nueva imagen principal y eliminar la anterior", async () => {
      const oldUrl = "https://res.cloudinary.com/demo/image/upload/v1234567890/ECOMMERCE/PRODUCTS/old.jpg";
      mockRepo.findById.mockResolvedValue({
        id: 1,
        name: "Prod",
        imageUrl: oldUrl,
        imageUrl2: null,
        imageUrl3: null,
      });
      mockRepo.update.mockResolvedValue({ id: 1, imageUrl: CLOUDINARY_URL });

      const file = createMockFile("new.jpg");
      await service.updateProduct(1, { image: file });

      expect(mockExtract).toHaveBeenCalledWith(oldUrl);
      expect(mockDelete).toHaveBeenCalledWith("ECOMMERCE/PRODUCTS/old");
      expect(mockUpload).toHaveBeenCalledWith(file);
    });

    it("debe lanzar NotFoundError si el producto no existe", async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(service.updateProduct(999, { name: "X" }))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe("deleteProduct", () => {
    it("debe hacer soft delete sin tocar Cloudinary", async () => {
      const productUrl = "https://res.cloudinary.com/demo/image/upload/v1234567890/ECOMMERCE/PRODUCTS/img.jpg";
      mockRepo.findById.mockResolvedValue({ id: 1, imageUrl: productUrl });
      mockRepo.delete.mockResolvedValue({ id: 1, isActive: false });

      const result = await service.deleteProduct(1);

      expect(mockDelete).not.toHaveBeenCalled();
      expect(mockRepo.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1, isActive: false });
    });

    it("debe lanzar NotFoundError si el producto no existe", async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(service.deleteProduct(999))
        .rejects.toThrow(NotFoundError);
    });
  });
});
