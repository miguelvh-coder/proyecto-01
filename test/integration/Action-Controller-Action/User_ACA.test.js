const { GetUserById, GetUsers, CreateUser, UpdateUser, DeleteUser } = require("../../../src/user/user.controller");
const userActions = require("../../../src/user/user.actions");
const auth = require("../../../src/auth/auth.actions");
const Test = require("supertest/lib/test");

jest.mock("../../../src/user/user.actions", () => ({
  getUserById: jest.fn(),
  getAllUsers: jest.fn(),
  createUser: jest.fn(),
  userUpdate: jest.fn(),
  deleteUser: jest.fn()
}));

jest.mock("../../../src/auth/auth.actions", () => ({
  encryptPassword: jest.fn()
}));

describe("User Controller", () => {
  describe("GetUserById", () => {
    it("should return a user by ID", async () => {
      const user = { _id: "1", nombre: "John Doe", email: "john@example.com", eliminado: false };
      userActions.getUserById.mockResolvedValue(user);

      const result = await GetUserById("1");

      expect(result).toEqual(user);
    });

    it("should throw an error if user does not exist", async () => {
      userActions.getUserById.mockImplementation(() => { throw new Error('{"code":404,"msg":"Usuario no encontrado"}') });

      await expect(GetUserById("1")).rejects.toThrow('{"code":404,"msg":"Usuario no encontrado"}');
    });
  });

  describe("GetUsers", () => {
    it("should return a list of users", async () => {
      const users = [
        { _id: "1", nombre: "John Doe", email: "john@example.com", eliminado: false },
        { _id: "2", nombre: "Jane Doe", email: "jane@example.com", eliminado: false }
      ];
      userActions.getAllUsers.mockResolvedValue(users);

      const result = await GetUsers();

      expect(result).toEqual(users);
    });
  });

  describe("CreateUser", () => {
    it("should create a new user", async () => {
      const newUser = { _id: "1", nombre: "John Doe", email: "john@example.com" };
      const userData = { nombre: "John Doe", email: "john@example.com", contraseña: "password123" };

      auth.encryptPassword.mockResolvedValue("encryptedPassword123");
      userActions.createUser.mockResolvedValue({ ...newUser, contraseña: "encryptedPassword123" });

      const result = await CreateUser(userData);

      expect(result).toEqual(newUser);
      expect(auth.encryptPassword).toHaveBeenCalledWith("password123");
    });
  });

  describe("UpdateUser", () => {
    it("should update an existing user", async () => {
      const userId = "1";
      const existingUser = { _id: userId, nombre: "John Doe", email: "john@example.com" };
      const updatedData = { nombre: "John Doe Updated", email: "john.updated@example.com", contraseña: "newpassword123" };
      const updatedUser = { ...existingUser, ...updatedData, contraseña: "encryptedNewPassword123" };

      auth.encryptPassword.mockResolvedValue("encryptedNewPassword123");
      userActions.userUpdate.mockResolvedValue(updatedUser);

      const result = await UpdateUser(userId, updatedData);

      expect(result).toEqual({
        id: updatedUser.id,
        email: updatedUser.email,
        nombre: updatedUser.nombre,
      });
      expect(auth.encryptPassword).toHaveBeenCalledWith("newpassword123");
    });
  });

  describe("DeleteUser", () => {
    it("should mark a user as deleted", async () => {
      const userId = "1";
      const deletedUser = { _id: userId, eliminado: true };

      userActions.deleteUser.mockResolvedValue(deletedUser);

      const result = await DeleteUser(userId);

      expect(result).toEqual(deletedUser);
    });
  });
});
