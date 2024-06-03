const express = require("express");
const supertest = require("supertest");
const orderRoutes = require("../../../src/order/order.route");
const orderController = require("../../../src/order/order.controller");

const app = express();
app.use(express.json());
app.use("/orders", orderRoutes);

// Mockear la función verifyToken para que siempre ejecute next()
jest.mock("../../../src/auth/auth.actions", () => ({
  verifyToken: jest.fn((req, res, next) => next()), // Mockear verifyToken para que ejecute next()
}));

jest.mock("../../../src/order/order.controller");

describe("Order Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new order", async () => {
    const newOrder = { item: "Book", quantity: 2, total: 20 };
    const createdOrder = { _id: "1", ...newOrder };
    orderController.CreateOrder.mockResolvedValue(createdOrder);

    const response = await supertest(app)
      .post("/orders")
      .send(newOrder)
      .expect(201);

    expect(response.body).toEqual(createdOrder);
    expect(orderController.CreateOrder).toHaveBeenCalledWith(newOrder);
  });

  it("should get an order by ID", async () => {
    const orderId = "1";
    const order = { _id: orderId, item: "Book", quantity: 2, total: 20 };
    orderController.GetOrder.mockResolvedValue(order);

    const response = await supertest(app)
      .get(`/orders/${orderId}`)
      .expect(200);

    expect(response.body).toEqual(order);
    expect(orderController.GetOrder).toHaveBeenCalledWith(orderId);
  });

  it("should get all orders", async () => {
    const userId = "123";
    const orders = [
      { _id: "1", item: "Book", quantity: 2, total: 20 },
      { _id: "2", item: "Movie", quantity: 1, total: 10 },
    ];
    orderController.GetOrders.mockResolvedValue(orders);
    
    const response = await supertest(app)
      .get("/orders")
      .expect(200);

    expect(response.body).toEqual(orders);
  });

  it("should update an order", async () => {
    const orderId = "1";
    const updatedData = { quantity: 3 };
    const updatedOrder = { _id: orderId, item: "Book", quantity: 3, total: 30 };
    orderController.UpdateOrder.mockResolvedValue(updatedOrder);

    const response = await supertest(app)
      .patch(`/orders/${orderId}`)
      .send(updatedData)
      .expect(200);

    expect(response.body).toEqual(updatedOrder);
    expect(orderController.UpdateOrder).toHaveBeenCalledWith(orderId, updatedData);
  });

  it("should delete an order", async () => {
    const orderId = "1";
    const deletedOrder = { _id: orderId, deleted: true };
    orderController.DeleteOrder.mockResolvedValue(deletedOrder);

    const response = await supertest(app)
      .delete(`/orders/${orderId}`)
      .expect(200);

    expect(response.body).toEqual(deletedOrder);
    expect(orderController.DeleteOrder).toHaveBeenCalledWith(orderId);
  });
});
