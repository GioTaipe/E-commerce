import { AuthService } from "../src/services/auth.services";
import { ConflictError, UnauthorizedError, NotFoundError } from "../src/utils/errors";
import bcrypt from "bcrypt";

// Mock del repositorio
function createMockUserRepo() {
  return {
    findByEmail: jest.fn(),
    createUser: jest.fn(),
    deleteUser: jest.fn(),
    findById: jest.fn(),
    updateUser: jest.fn(),
  };
}

// Mock de jwt para evitar dependencia de config
jest.mock("../src/utils/jwt", () => ({
  generateToken: jest.fn(() => "mock-token-123"),
}));

describe("AuthService", () => {
  let service: AuthService;
  let mockRepo: ReturnType<typeof createMockUserRepo>;

  beforeEach(() => {
    mockRepo = createMockUserRepo();
    service = new AuthService(mockRepo as any);
  });

  describe("register", () => {
    it("debe registrar un usuario nuevo correctamente", async () => {
      mockRepo.findByEmail.mockResolvedValue(null);
      mockRepo.createUser.mockResolvedValue({
        id: 1,
        name: "Test User",
        email: "test@example.com",
        role: "customer",
      });

      const result = await service.register({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      expect(result).toEqual({
        id: 1,
        name: "Test User",
        email: "test@example.com",
        role: "customer",
      });
      expect(mockRepo.findByEmail).toHaveBeenCalledWith("test@example.com");
      expect(mockRepo.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Test User",
          email: "test@example.com",
          role: "customer",
        })
      );
    });

    it("debe lanzar ConflictError si el email ya existe", async () => {
      mockRepo.findByEmail.mockResolvedValue({ id: 1, email: "test@example.com" });

      await expect(
        service.register({
          name: "Test",
          email: "test@example.com",
          password: "password123",
        })
      ).rejects.toThrow(ConflictError);

      expect(mockRepo.createUser).not.toHaveBeenCalled();
    });

    it("debe hashear la contraseña antes de guardar", async () => {
      mockRepo.findByEmail.mockResolvedValue(null);
      mockRepo.createUser.mockResolvedValue({ id: 1 });

      await service.register({
        name: "Test",
        email: "test@example.com",
        password: "password123",
      });

      const savedData = mockRepo.createUser.mock.calls[0]![0];
      expect(savedData.passwordHash).not.toBe("password123");
      expect(await bcrypt.compare("password123", savedData.passwordHash)).toBe(true);
    });

    it("debe asignar siempre el rol customer", async () => {
      mockRepo.findByEmail.mockResolvedValue(null);
      mockRepo.createUser.mockResolvedValue({ id: 1 });

      await service.register({
        name: "Test",
        email: "test@example.com",
        password: "password123",
      });

      const savedData = mockRepo.createUser.mock.calls[0]![0];
      expect(savedData.role).toBe("customer");
    });
  });

  describe("login", () => {
    const hashedPassword = bcrypt.hashSync("password123", 10);

    it("debe retornar usuario y token con credenciales válidas", async () => {
      mockRepo.findByEmail.mockResolvedValue({
        id: 1,
        name: "Test",
        email: "test@example.com",
        passwordHash: hashedPassword,
        role: "customer",
      });

      const result = await service.login({
        email: "test@example.com",
        password: "password123",
      });

      expect(result.token).toBe("mock-token-123");
      expect(result.user).toEqual(
        expect.objectContaining({
          id: 1,
          email: "test@example.com",
        })
      );
      expect(result.user).not.toHaveProperty("passwordHash");
    });

    it("debe lanzar UnauthorizedError si el email no existe", async () => {
      mockRepo.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: "noexiste@example.com", password: "password123" })
      ).rejects.toThrow(UnauthorizedError);
    });

    it("debe lanzar UnauthorizedError si la contraseña es incorrecta", async () => {
      mockRepo.findByEmail.mockResolvedValue({
        id: 1,
        email: "test@example.com",
        passwordHash: hashedPassword,
        role: "customer",
      });

      await expect(
        service.login({ email: "test@example.com", password: "wrongpassword" })
      ).rejects.toThrow(UnauthorizedError);
    });
  });

  describe("createUserWithRole", () => {
    it("debe crear un usuario con rol admin", async () => {
      mockRepo.findByEmail.mockResolvedValue(null);
      mockRepo.createUser.mockResolvedValue({
        id: 2,
        name: "Admin User",
        email: "admin@example.com",
        role: "admin",
      });

      const result = await service.createUserWithRole({
        name: "Admin User",
        email: "admin@example.com",
        password: "password123",
        role: "admin",
      });

      expect(result.role).toBe("admin");
      const savedData = mockRepo.createUser.mock.calls[0]![0];
      expect(savedData.role).toBe("admin");
    });

    it("debe crear un usuario con rol customer", async () => {
      mockRepo.findByEmail.mockResolvedValue(null);
      mockRepo.createUser.mockResolvedValue({
        id: 3,
        name: "Customer",
        email: "customer@example.com",
        role: "customer",
      });

      const result = await service.createUserWithRole({
        name: "Customer",
        email: "customer@example.com",
        password: "password123",
        role: "customer",
      });

      expect(result.role).toBe("customer");
    });

    it("debe lanzar ConflictError si el email ya existe", async () => {
      mockRepo.findByEmail.mockResolvedValue({ id: 1, email: "admin@example.com" });

      await expect(
        service.createUserWithRole({
          name: "Admin",
          email: "admin@example.com",
          password: "password123",
          role: "admin",
        })
      ).rejects.toThrow(ConflictError);

      expect(mockRepo.createUser).not.toHaveBeenCalled();
    });

    it("debe hashear la contraseña antes de guardar", async () => {
      mockRepo.findByEmail.mockResolvedValue(null);
      mockRepo.createUser.mockResolvedValue({ id: 2 });

      await service.createUserWithRole({
        name: "Admin",
        email: "admin@example.com",
        password: "securePass",
        role: "admin",
      });

      const savedData = mockRepo.createUser.mock.calls[0]![0];
      expect(savedData.passwordHash).not.toBe("securePass");
      expect(await bcrypt.compare("securePass", savedData.passwordHash)).toBe(true);
    });
  });

  describe("deleteUser", () => {
    it("debe eliminar un usuario existente", async () => {
      mockRepo.deleteUser.mockResolvedValue({ id: 1, name: "Test", email: "test@example.com" });

      const result = await service.deleteUser(1);

      expect(result).toEqual(expect.objectContaining({ id: 1 }));
      expect(mockRepo.deleteUser).toHaveBeenCalledWith(1);
    });

    it("debe lanzar NotFoundError si el usuario no existe", async () => {
      mockRepo.deleteUser.mockResolvedValue(null);

      await expect(service.deleteUser(999)).rejects.toThrow(NotFoundError);
    });
  });

  describe("updateUser", () => {
    it("debe actualizar nombre y email", async () => {
      mockRepo.updateUser.mockResolvedValue({
        id: 1,
        name: "Nuevo Nombre",
        email: "nuevo@example.com",
      });

      const result = await service.updateUser(1, { name: "Nuevo Nombre", email: "nuevo@example.com" });

      expect(result.name).toBe("Nuevo Nombre");
      expect(mockRepo.updateUser).toHaveBeenCalledWith(1, { name: "Nuevo Nombre", email: "nuevo@example.com" });
    });

    // [FIX] Test actualizado: ahora el service pasa passwordHash (no password) al repo
    it("debe hashear la contraseña si se actualiza", async () => {
      mockRepo.updateUser.mockResolvedValue({ id: 1 });

      await service.updateUser(1, { password: "newPassword123" });

      const savedData = mockRepo.updateUser.mock.calls[0]![1];
      expect(savedData.passwordHash).toBeDefined();
      expect(savedData.passwordHash).not.toBe("newPassword123");
      expect(await bcrypt.compare("newPassword123", savedData.passwordHash)).toBe(true);
    });

    it("debe lanzar NotFoundError si el usuario no existe", async () => {
      mockRepo.updateUser.mockResolvedValue(null);

      await expect(service.updateUser(999, { name: "X" })).rejects.toThrow(NotFoundError);
    });
  });
});
