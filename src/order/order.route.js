// order.routes.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../auth/auth.actions");
const orderController = require("./order.controller");
const { respondWithError } = require("../../utils/function");

router.post("/", verifyToken, async (req, res) => {
  try {
    const createdOrder = await orderController.CreateOrder(req.body);
    res.status(201).json(createdOrder);
  } catch (e) {
    respondWithError(res, e);
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const order = await orderController.GetOrder(req.params.id);
    res.status(200).json(order);
  } catch (e) {
    respondWithError(res, e);
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    const orders = await orderController.GetOrders(req.userId, req.query);
    res.status(200).json(orders);
  } catch (e) {
    respondWithError(res, e);
  }
});

router.patch("/:id", verifyToken, async (req, res) => {
  try {
    const updatedOrder = await orderController.UpdateOrder(req.params.id, req.body);
    res.status(200).json(updatedOrder);
  } catch (e) {
    respondWithError(res, e);
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deletedOrder = await orderController.DeleteOrder(req.params.id);
    res.status(200).json(deletedOrder);
  } catch (e) {
    respondWithError(res, e);
  }
});

module.exports = router;
