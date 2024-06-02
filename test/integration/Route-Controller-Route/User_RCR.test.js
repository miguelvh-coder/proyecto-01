const request = require("supertest");
const express = require("express");
const userRoutes = require("../../../src/user/user.route");
const userController = require("../../../src/user/user.controller");
const { verifyToken } = require("../../../src/auth/auth.actions");

jest.mock("../../../src/user/user.controller", () => ({
  GetUserById: jest.fn(),
  GetUsers: jest.fn(),
  CreateUser: jest.fn(),
  UpdateUser: jest.fn(),
  DeleteUser: jest.fn(),
}));

jest.mock("../../../src/auth/auth.actions", () => ({
  verifyToken: (req, res, next) => {
    req.userId = "testUserId";
    next();
  },
}));

const app = express();
app.use(express.json());
app.use("/users", userRoutes);

describe("User Routes", () => {
  describe("GET /users/:id", () => {
    it("should return a user by ID", async () => {
      const user = { _id: "1", email: "test@example.com", name: "Test User" };
      userController.GetUserById.mockResolvedValue(user);

      const response = await request(app)
        .get("/users/1")
        .expect(200);

      expect(response.body).toEqual(user);
      expect(userController.GetUserById).toHaveBeenCalledWith("1");
    });
  });

  describe("GET /users", () => {
    it("should return a list of users", async () => {
      const users = [
        { _id: "1", email: "test1@example.com", name: "Test User 1" },
        { _id: "2", email: "test2@example.com", name: "Test User 2" },
      ];
      userController.GetUsers.mockResolvedValue(users);

      const response = await request(app)
        .get("/users")
        .expect(200);

      expect(response.body).toEqual(users);
    });
  });

  describe("POST /users", () => {
    it("should create a new user", async () => {
      const newUser = { _id: "1", email: "test@example.com", name: "Test User" };
      userController.CreateUser.mockResolvedValue(newUser);

      const response = await request(app)
        .post("/users")
        .send(newUser)
        .expect(201);

      expect(response.body).toEqual(newUser);
      expect(userController.CreateUser).toHaveBeenCalledWith(newUser);
    });
  });

  describe("PATCH /users/:id", () => {
    it("should update an existing user", async () => {
      const userId = "1";
      const updatedData = { name: "Updated User" };
      const updatedUser = { _id: userId, email: "test@example.com", name: "Updated User" };

      userController.UpdateUser.mockResolvedValue(updatedUser);

      const response = await request(app)
        .patch(`/users/${userId}`)
        .send(updatedData)
        .expect(200);

      expect(response.body).toEqual(updatedUser);
      expect(userController.UpdateUser).toHaveBeenCalledWith(userId, updatedData);
    });
  });

  describe("DELETE /users/:id", () => {
    it("should delete an existing user", async () => {
      const userId = "1";
      const deletedUser = { _id: userId, eliminado: true };

      userController.DeleteUser.mockResolvedValue(deletedUser);

      const response = await request(app)
        .delete(`/users/${userId}`)
        .expect(200);

      expect(response.body).toEqual(deletedUser);
      expect(userController.DeleteUser).toHaveBeenCalledWith(userId);
    });
  });
});
