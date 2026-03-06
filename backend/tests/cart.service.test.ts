import { NotFoundError, BadRequestError } from "../src/utils/errors";

// eslint-disable-next-line no-var
var mockPrisma: any;

jest.mock("../src/config/prisma", () => ({
  __esModule: true,
  default: new Proxy({}, { get: (_t, prop) => mockPrisma?.[prop] }),
}));

import { CartService } from "../src/services/cart.service";

function createMockCartRepo() {
  return {
    getCartByUserId: jest.fn(),
    createCartForUser: jest.fn(),
    addItemToCart: jest.fn(),
    findItemByIdAndUser: jest.fn(),
    updateItemQuantity: jest.fn(),
    removeItem: jest.fn(),
    clearCart: jest.fn(),
  };
}

describe("CartService", () => {
  let service: CartService;
  let mockRepo: ReturnType<typeof createMockCartRepo>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRepo = createMockCartRepo();
    service = new CartService(mockRepo as any);
    mockPrisma = {
      product: {
        findUnique: jest.fn(),
      },
    };
  });

  describe("getCart", () => {
    it("debe retornar el carrito existente", async () => {
      const cart = { id: 1, userId: 1, items: [] };
      mockRepo.getCartByUserId.mockResolvedValue(cart);

      const result = await service.getCart(1);

      expect(result).toEqual(cart);
      expect(mockRepo.createCartForUser).not.toHaveBeenCalled();
    });

    it("debe crear carrito si no existe y luego retornarlo", async () => {
      const newCart = { id: 2, userId: 1, items: [] };
      mockRepo.getCartByUserId
        .mockResolvedValueOnce(null)       // primera llamada: no existe
        .mockResolvedValueOnce(newCart);    // segunda llamada: ya creado

      const result = await service.getCart(1);

      expect(mockRepo.createCartForUser).toHaveBeenCalledWith(1);
      expect(result).toEqual(newCart);
    });
  });

  describe("addToCart", () => {
    it("debe agregar item al carrito existente", async () => {
      const cart = { id: 10, userId: 1, items: [] };
      mockRepo.getCartByUserId.mockResolvedValue(cart);
      mockPrisma.product.findUnique.mockResolvedValue({ id: 5, stock: 10, price: 20 });
      mockRepo.addItemToCart.mockResolvedValue({ id: 1, cartId: 10, productId: 5, quantity: 2 });

      const result = await service.addToCart(1, { productId: 5, quantity: 2 });

      expect(result).toEqual(expect.objectContaining({ productId: 5, quantity: 2 }));
      expect(mockRepo.addItemToCart).toHaveBeenCalledWith(10, 5, 2);
    });

    it("debe crear carrito si no existe y luego agregar item", async () => {
      const cart = { id: 10, userId: 1, items: [] };
      mockRepo.getCartByUserId
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(cart);
      mockPrisma.product.findUnique.mockResolvedValue({ id: 5, stock: 10, price: 20 });
      mockRepo.addItemToCart.mockResolvedValue({ id: 1, cartId: 10, productId: 5, quantity: 1 });

      await service.addToCart(1, { productId: 5, quantity: 1 });

      expect(mockRepo.createCartForUser).toHaveBeenCalledWith(1);
      expect(mockRepo.addItemToCart).toHaveBeenCalledWith(10, 5, 1);
    });

    it("debe lanzar NotFoundError si el producto no existe", async () => {
      mockRepo.getCartByUserId.mockResolvedValue({ id: 10, items: [] });
      mockPrisma.product.findUnique.mockResolvedValue(null);

      await expect(service.addToCart(1, { productId: 99, quantity: 1 }))
        .rejects.toThrow(NotFoundError);
    });

    it("debe lanzar BadRequestError si no hay stock suficiente", async () => {
      mockRepo.getCartByUserId.mockResolvedValue({ id: 10, items: [] });
      mockPrisma.product.findUnique.mockResolvedValue({ id: 5, stock: 1, price: 20 });

      await expect(service.addToCart(1, { productId: 5, quantity: 5 }))
        .rejects.toThrow(BadRequestError);
    });
  });

  describe("updateItem", () => {
    it("debe actualizar la cantidad del item", async () => {
      mockRepo.findItemByIdAndUser.mockResolvedValue({ id: 1, cartId: 10, quantity: 1 });
      mockRepo.updateItemQuantity.mockResolvedValue({ id: 1, quantity: 3 });

      const result = await service.updateItem(1, 1, { quantity: 3 });

      expect(result).toEqual(expect.objectContaining({ quantity: 3 }));
      expect(mockRepo.updateItemQuantity).toHaveBeenCalledWith(1, 3);
    });

    it("debe lanzar NotFoundError si el item no pertenece al usuario", async () => {
      mockRepo.findItemByIdAndUser.mockResolvedValue(null);

      await expect(service.updateItem(1, 999, { quantity: 2 }))
        .rejects.toThrow(NotFoundError);
      expect(mockRepo.updateItemQuantity).not.toHaveBeenCalled();
    });
  });

  describe("removeItem", () => {
    it("debe eliminar el item del carrito", async () => {
      mockRepo.findItemByIdAndUser.mockResolvedValue({ id: 1 });
      mockRepo.removeItem.mockResolvedValue({ id: 1 });

      await service.removeItem(1, 1);

      expect(mockRepo.removeItem).toHaveBeenCalledWith(1);
    });

    it("debe lanzar NotFoundError si el item no pertenece al usuario", async () => {
      mockRepo.findItemByIdAndUser.mockResolvedValue(null);

      await expect(service.removeItem(1, 999))
        .rejects.toThrow(NotFoundError);
      expect(mockRepo.removeItem).not.toHaveBeenCalled();
    });
  });

  describe("clearCart", () => {
    it("debe vaciar el carrito del usuario", async () => {
      mockRepo.getCartByUserId.mockResolvedValue({ id: 10 });
      mockRepo.clearCart.mockResolvedValue({ count: 3 });

      await service.clearCart(1);

      expect(mockRepo.clearCart).toHaveBeenCalledWith(10);
    });

    it("debe lanzar NotFoundError si no hay carrito", async () => {
      mockRepo.getCartByUserId.mockResolvedValue(null);

      await expect(service.clearCart(1)).rejects.toThrow(NotFoundError);
    });
  });
});
