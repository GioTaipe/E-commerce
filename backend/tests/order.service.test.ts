import { BadRequestError, NotFoundError } from "../src/utils/errors";

// mockTx debe declararse con var para que jest.mock (hoisted) pueda capturarlo
// eslint-disable-next-line no-var
var mockTx: any;

jest.mock("../src/config/prisma", () => ({
  __esModule: true,
  default: {
    $transaction: jest.fn((fn: any) => fn(mockTx)),
  },
}));

// Import DESPUÉS del jest.mock para que el mock se aplique
import { OrderService } from "../src/services/order.service";

function createMockOrderRepo() {
  return {
    findAllByUser: jest.fn(),
    findById: jest.fn(),
  };
}

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

describe("OrderService", () => {
  let service: OrderService;
  let mockOrderRepo: ReturnType<typeof createMockOrderRepo>;
  let mockCartRepo: ReturnType<typeof createMockCartRepo>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockOrderRepo = createMockOrderRepo();
    mockCartRepo = createMockCartRepo();
    service = new OrderService(mockOrderRepo as any, mockCartRepo as any);

    // Reinicializar mockTx en cada test
    mockTx = {
      order: { create: jest.fn() },
      orderItem: { createMany: jest.fn() },
      product: { updateMany: jest.fn() },
      cartItem: { deleteMany: jest.fn() },
    };
  });

  describe("createOrder", () => {
    it("debe lanzar BadRequestError si el carrito está vacío", async () => {
      mockCartRepo.getCartByUserId.mockResolvedValue({ id: 1, items: [] });

      await expect(service.createOrder(1)).rejects.toThrow(BadRequestError);
      await expect(service.createOrder(1)).rejects.toThrow("El carrito está vacío");
    });

    it("debe lanzar BadRequestError si no hay carrito", async () => {
      mockCartRepo.getCartByUserId.mockResolvedValue(null);

      await expect(service.createOrder(1)).rejects.toThrow(BadRequestError);
    });

    it("debe crear orden y decrementar stock correctamente", async () => {
      mockCartRepo.getCartByUserId.mockResolvedValue({
        id: 10,
        items: [
          {
            productId: 1,
            quantity: 2,
            product: { id: 1, name: "Producto A", price: 25.50 },
          },
        ],
      });

      mockTx.order.create.mockResolvedValue({ id: 100, userId: 1, total: 51, status: "pending" });
      mockTx.orderItem.createMany.mockResolvedValue({ count: 1 });
      mockTx.product.updateMany.mockResolvedValue({ count: 1 });
      mockTx.cartItem.deleteMany.mockResolvedValue({ count: 1 });

      const result = await service.createOrder(1);

      expect(result).toEqual(expect.objectContaining({ id: 100 }));
      expect(mockTx.product.updateMany).toHaveBeenCalledWith({
        where: { id: 1, stock: { gte: 2 } },
        data: { stock: { decrement: 2 } },
      });
      expect(mockTx.cartItem.deleteMany).toHaveBeenCalledWith({
        where: { cartId: 10 },
      });
    });

    it("debe lanzar BadRequestError si no hay stock suficiente", async () => {
      mockCartRepo.getCartByUserId.mockResolvedValue({
        id: 10,
        items: [
          {
            productId: 1,
            quantity: 5,
            product: { id: 1, name: "Sin Stock", price: 10 },
          },
        ],
      });

      mockTx.order.create.mockResolvedValue({ id: 100 });
      mockTx.orderItem.createMany.mockResolvedValue({ count: 1 });
      // updateMany retorna count: 0 → stock insuficiente
      mockTx.product.updateMany.mockResolvedValue({ count: 0 });

      await expect(service.createOrder(1)).rejects.toThrow(BadRequestError);
      await expect(service.createOrder(1)).rejects.toThrow("Stock insuficiente");
    });
  });

  describe("getUserOrders", () => {
    it("debe retornar las órdenes del usuario", async () => {
      const mockOrders = [
        { id: 1, userId: 1, total: 50, status: "pending" },
        { id: 2, userId: 1, total: 100, status: "delivered" },
      ];
      mockOrderRepo.findAllByUser.mockResolvedValue(mockOrders);

      const result = await service.getUserOrders(1);

      expect(result).toEqual(mockOrders);
      expect(mockOrderRepo.findAllByUser).toHaveBeenCalledWith(1);
    });
  });

  describe("getOrderById", () => {
    it("debe retornar una orden por su id", async () => {
      const order = { id: 1, userId: 1, total: 50, status: "pending", items: [] };
      mockOrderRepo.findById.mockResolvedValue(order);

      const result = await service.getOrderById(1, 1);

      expect(result).toEqual(order);
      expect(mockOrderRepo.findById).toHaveBeenCalledWith(1, 1);
    });

    it("debe lanzar NotFoundError si la orden no existe", async () => {
      mockOrderRepo.findById.mockResolvedValue(null);

      await expect(service.getOrderById(1, 999)).rejects.toThrow(NotFoundError);
    });
  });
});
