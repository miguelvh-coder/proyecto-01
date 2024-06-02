const request = require("supertest");
const express = require("express");
const orderRoutes = require("../../../src/order/order.route");
const orderController = require("../../../src/order/order.controller");

jest.mock("../../../src/order/order.controller", () => ({
  CreateOrder: jest.fn(),
  GetOrder: jest.fn(),
  GetOrders: jest.fn(),
  UpdateOrder: jest.fn(),
  DeleteOrder: jest.fn(),
}));

jest.mock("../../../src/auth/auth.actions", () => ({
  verifyToken: (req, res, next) => {
    req.userId = "testUserId";
    next();
  },
}));

const app = express();
app.use(express.json());
app.use("/orders", orderRoutes);

describe("Order Routes", () => {
  describe("POST /orders", () => {
    it("should create a new order", async () => {
      const newOrder = { _id: "1", product: "Product A", quantity: 1 };
      orderController.CreateOrder.mockResolvedValue(newOrder);

      const response = await request(app)
        .post("/orders")
        .send(newOrder)
        .expect(201);

      expect(response.body).toEqual(newOrder);
      expect(orderController.CreateOrder).toHaveBeenCalledWith(newOrder);
    });
  });

  describe("GET /orders/:id", () => {
    it("should return an order by ID", async () => {
      const order = { _id: "1", product: "Product A", quantity: 1 };
      orderController.GetOrder.mockResolvedValue(order);

      const response = await request(app)
        .get("/orders/1")
        .expect(200);

      expect(response.body).toEqual(order);
      expect(orderController.GetOrder).toHaveBeenCalledWith("1");
    });
  });

  describe("GET /orders", () => {
    it("should return a list of orders", async () => {
      const orders = [
        { _id: "1", product: "Product A", quantity: 1 },
        { _id: "2", product: "Product B", quantity: 2 },
      ];
      orderController.GetOrders.mockResolvedValue(orders);

      const response = await request(app)
        .get("/orders")
        .expect(200);

      expect(response.body).toEqual(orders);
    });
  });

  describe("PATCH /orders/:id", () => {
    it("should update an existing order", async () => {
      const orderId = "1";
      const updatedData = { quantity: 2 };
      const updatedOrder = { _id: orderId, product: "Product A", quantity: 2 };

      orderController.UpdateOrder.mockResolvedValue(updatedOrder);

      const response = await request(app)
        .patch(`/orders/${orderId}`)
        .send(updatedData)
        .expect(200);

      expect(response.body).toEqual(updatedOrder);
      expect(orderController.UpdateOrder).toHaveBeenCalledWith(orderId, updatedData);
    });
  });

  describe("DELETE /orders/:id", () => {
    it("should delete an existing order", async () => {
      const orderId = "1";
      const deletedOrder = { _id: orderId, eliminado: true };

      orderController.DeleteOrder.mockResolvedValue(deletedOrder);

      const response = await request(app)
        .delete(`/orders/${orderId}`)
        .expect(200);

      expect(response.body).toEqual(deletedOrder);
      expect(orderController.DeleteOrder).toHaveBeenCalledWith(orderId);
    });
  });
});
