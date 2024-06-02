// book.routes.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../auth/auth.actions");
const bookController = require("./book.controller");
const { respondWithError } = require("../../utils/function");

router.post("/", verifyToken, async (req, res) => {
  try {
    const createdBook = await bookController.CreateBook(req.body);
    res.status(201).json(createdBook);
  } catch (e) {
    respondWithError(res, e);
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const book = await bookController.ReadBookById(req.params.id);
    res.status(200).json(book);
  } catch (e) {
    respondWithError(res, e);
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    const books = await bookController.ReadBookWithFilters(req.query);
    res.status(200).json(books);
  } catch (e) {
    respondWithError(res, e);
  }
});

router.patch("/update/:id", verifyToken, async (req, res) => {
  try {
    const updatedBook = await bookController.UpdateBook(req.params.id, req.body);
    res.status(200).json(updatedBook);
  } catch (e) {
    respondWithError(res, e);
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deletedBook = await bookController.DeleteBook(req.params.id);
    res.status(200).json(deletedBook);
  } catch (e) {
    respondWithError(res, e);
  }
});

module.exports = router;
