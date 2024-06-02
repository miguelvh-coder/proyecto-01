const { CreateOrder, GetOrder, GetOrders, UpdateOrder, DeleteOrder } = require("../../../src/order/order.controller");
const orderActions = require("../../../src/order/order.actions");

jest.mock("../../../src/order/order.actions", () => ({
  createOrder: jest.fn(),
  getOrder: jest.fn(),
  getOrders: jest.fn(),
  updateOrder: jest.fn(),
  deleteOrder: jest.fn()
}));

describe("Order Controller", () => {
  describe("CreateOrder", () => {
    it("should create a new order", async () => {
      const newOrder = { _id: "1", product: "Product A", quantity: 2, status: "pending" };
      orderActions.createOrder.mockResolvedValue(newOrder);

      const result = await CreateOrder(newOrder);

      expect(result).toEqual(newOrder);
    });
  });

  describe("GetOrder", () => {
    it("should return an order by ID", async () => {
      const order = { _id: "1", product: "Product A", quantity: 2, status: "pending" };
      orderActions.getOrder.mockResolvedValue(order);

      const result = await GetOrder("1");

      expect(result).toEqual(order);
    });

    it("should throw an error if order does not exist", async () => {
      orderActions.getOrder.mockResolvedValue(null);

      await expect(GetOrder("2")).rejects.toThrow("El pedido no existe");
    });
  });

  describe("GetOrders", () => {
    it("should return a list of orders", async () => {
      const orders = [
        { _id: "1", product: "Product A", quantity: 2, status: "pending" },
        { _id: "2", product: "Product B", quantity: 1, status: "shipped" }
      ];
      orderActions.getOrders.mockResolvedValue(orders);

      const result = await GetOrders();

      expect(result).toEqual(orders);
    });
  });

  describe("UpdateOrder", () => {
    it("should update an existing order", async () => {
      const orderId = "1";
      const existingOrder = { _id: orderId, product: "Product A", quantity: 2, status: "pending" };
      const updatedData = { status: "shipped" };
      const updatedOrder = { ...existingOrder, ...updatedData };

      orderActions.updateOrder.mockResolvedValue(updatedOrder);

      const result = await UpdateOrder(orderId, updatedData);

      expect(result).toEqual(updatedOrder);
    });

    it("should throw an error if order is not found", async () => {
      const orderId = "2";
      orderActions.updateOrder.mockImplementation(() => { throw new Error('{"code":404,"msg":"Pedido no encontrado"}') });

      await expect(UpdateOrder(orderId, {})).rejects.toThrow('{"code":404,"msg":"Pedido no encontrado"}');
    });
  });

  describe("DeleteOrder", () => {
    it("should mark an order as cancelled", async () => {
      const orderId = "1";
      const cancelledOrder = { _id: orderId, status: "cancelada" };

      orderActions.deleteOrder.mockResolvedValue(cancelledOrder);

      const result = await DeleteOrder(orderId);

      expect(result).toEqual(cancelledOrder);
    });

    it("should throw an error if order is not found", async () => {
      const orderId = "2";
      orderActions.deleteOrder.mockImplementation(() => { throw new Error('{"code":404,"msg":"Pedido no encontrado"}') });

      await expect(DeleteOrder(orderId)).rejects.toThrow('{"code":404,"msg":"Pedido no encontrado"}');
    });
  });
});
