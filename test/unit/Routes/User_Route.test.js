const express = require("express");
const supertest = require("supertest");
const userRoutes = require("../../../src/user/user.route");
const userController = require("../../../src/user/user.controller");

const app = express();
app.use(express.json());
app.use("/users", userRoutes);

// Mockear la función verifyToken para que siempre ejecute next()
jest.mock("../../../src/auth/auth.actions", () => ({
  verifyToken: jest.fn((req, res, next) => next()), // Mockear verifyToken para que ejecute next()
}));

jest.mock("../../../src/user/user.controller");

describe("User Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get a user by ID", async () => {
    const userId = "1";
    const user = { _id: userId, username: "testuser", email: "test@example.com" };
    userController.GetUserById.mockResolvedValue(user);

    const response = await supertest(app)
      .get(`/users/${userId}`)
      .expect(200);

    expect(response.body).toEqual(user);
    expect(userController.GetUserById).toHaveBeenCalledWith(userId);
  });

  it("should get all users", async () => {
    const users = [
      { _id: "1", username: "user1", email: "user1@example.com" },
      { _id: "2", username: "user2", email: "user2@example.com" },
    ];
    userController.GetUsers.mockResolvedValue(users);

    const response = await supertest(app)
      .get("/users")
      .expect(200);

    expect(response.body).toEqual(users);
    expect(userController.GetUsers).toHaveBeenCalled();
  });

  it("should create a new user", async () => {
    const newUser = { username: "newuser", email: "newuser@example.com", password: "password123" };
    const createdUser = { _id: "3", ...newUser };
    userController.CreateUser.mockResolvedValue(createdUser);

    const response = await supertest(app)
      .post("/users")
      .send(newUser)
      .expect(201);

    expect(response.body).toEqual(createdUser);
    expect(userController.CreateUser).toHaveBeenCalledWith(newUser);
  });

  it("should update a user", async () => {
    const userId = "1";
    const updatedData = { username: "updateduser" };
    const updatedUser = { _id: userId, username: "updateduser", email: "test@example.com" };
    userController.UpdateUser.mockResolvedValue(updatedUser);

    const response = await supertest(app)
      .patch(`/users/${userId}`)
      .send(updatedData)
      .expect(200);

    expect(response.body).toEqual(updatedUser);
    expect(userController.UpdateUser).toHaveBeenCalledWith(userId, updatedData);
  });

  it("should delete a user", async () => {
    const userId = "1";
    const deletedUser = { _id: userId, deleted: true };
    userController.DeleteUser.mockResolvedValue(deletedUser);

    const response = await supertest(app)
      .delete(`/users/${userId}`)
      .expect(200);

    expect(response.body).toEqual(deletedUser);
    expect(userController.DeleteUser).toHaveBeenCalledWith(userId);
  });
});
