// user.routes.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../auth/auth.actions");
const userController = require("./user.controller");
const { respondWithError } = require("../../utils/function");

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const user = await userController.GetUserById(req.params.id);
    res.status(200).json(user);
  } catch (e) {
    respondWithError(res, e);
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    const users = await userController.GetUsers();
    res.status(200).json(users);
  } catch (e) {
    respondWithError(res, e);
  }
});

router.post("/", async (req, res) => {
  try {
    const createdUser = await userController.CreateUser(req.body);
    res.status(201).json(createdUser);
  } catch (e) {
    respondWithError(res, e);
  }
});

router.patch("/:id", verifyToken, async (req, res) => {
  try {
    const updatedUser = await userController.UpdateUser(req.params.id, req.body);
    res.status(200).json(updatedUser);
  } catch (e) {
    respondWithError(res, e);
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deletedUser = await userController.DeleteUser(req.params.id);
    res.status(200).json(deletedUser);
  } catch (e) {
    respondWithError(res, e);
  }
});

module.exports = router;
