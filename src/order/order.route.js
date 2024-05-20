const express = require("express");
const router = express.Router();

const orderController = require("./order.controller");

const { respondWithError, throwCustomError } = require("../../utils/functions");

const { verifyToken } = require("../auth/auth.actions");

async function PostOrder(req, res) {
  try {
    req.body.comprador = req.userId;
    const createdOrder = await orderController.createOrder(req.body);
    res.status(201).json(createdOrder);
  } catch (e) {
    respondWithError(res, e);
  }
}

async function GetOrder(req, res) {
  try {
    const order = await orderController.getOrder(req.params.id, req.userId);
    res.status(200).json(order);
  } catch (e) {
    respondWithError(res, e);
  }
}

async function GetOrders(req, res) {
  try {
    const orders = await orderController.getOrders(req.userId, req.query);
    res.status(200).json(orders);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

async function UpdateOrder(req, res) {
  try {
    const order = await orderController.updateOrder(req.params.id, req.userId, req.body);
    res.status(200).json(order);
  } catch (e) {
    throwCustomError(res.status, e);
  }
}

router.post("/", verifyToken, PostOrder); //Crear una orden
router.get("/:id", verifyToken, GetOrder); //Obtener una orden
router.get("/", verifyToken, GetOrders); //Obtener las ordenes
router.patch("/update/:id", verifyToken, UpdateOrder); //Actualizar una orden

module.exports = router;