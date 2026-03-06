import { CategoryService } from "../src/services/category.services";

function createMockCategoryRepo() {
  return {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
}

describe("CategoryService", () => {
  let service: CategoryService;
  let mockRepo: ReturnType<typeof createMockCategoryRepo>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRepo = createMockCategoryRepo();
    service = new CategoryService(mockRepo as any);
  });

  describe("findAllCategories", () => {
    it("debe retornar todas las categorías", async () => {
      const categories = [
        { id: 1, name: "Electrónica" },
        { id: 2, name: "Ropa" },
      ];
      mockRepo.findAll.mockResolvedValue(categories);

      const result = await service.findAllCategories();

      expect(result).toEqual(categories);
      expect(mockRepo.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("findCategoryById", () => {
    it("debe retornar una categoría por su id", async () => {
      const category = { id: 1, name: "Electrónica" };
      mockRepo.findById.mockResolvedValue(category);

      const result = await service.findCategoryById(1);

      expect(result).toEqual(category);
      expect(mockRepo.findById).toHaveBeenCalledWith(1);
    });

    it("debe retornar null si la categoría no existe", async () => {
      mockRepo.findById.mockResolvedValue(null);

      const result = await service.findCategoryById(999);

      expect(result).toBeNull();
    });
  });

  describe("createCategory", () => {
    it("debe crear una categoría", async () => {
      const dto = { name: "Nueva Categoría" };
      mockRepo.create.mockResolvedValue({ id: 1, ...dto });

      const result = await service.createCategory(dto);

      expect(result).toEqual(expect.objectContaining({ name: "Nueva Categoría" }));
      expect(mockRepo.create).toHaveBeenCalledWith(dto);
    });
  });

  describe("updateCategory", () => {
    it("debe actualizar una categoría", async () => {
      mockRepo.update.mockResolvedValue({ id: 1, name: "Actualizada" });

      const result = await service.updateCategory(1, { name: "Actualizada" });

      expect(result.name).toBe("Actualizada");
      expect(mockRepo.update).toHaveBeenCalledWith(1, { name: "Actualizada" });
    });
  });

  describe("deleteCategory", () => {
    it("debe eliminar una categoría", async () => {
      mockRepo.delete.mockResolvedValue({ id: 1, name: "Eliminada" });

      const result = await service.deleteCategory(1);

      expect(result).toEqual({ id: 1, name: "Eliminada" });
      expect(mockRepo.delete).toHaveBeenCalledWith(1);
    });
  });
});
