const express = require("express");
const supertest = require("supertest");
const bookRoutes = require("../../../src/book/book.route");
const bookController = require("../../../src/book/book.controller");

const app = express();
app.use(express.json());
app.use("/books", bookRoutes);

// Mockear la función verifyToken para que siempre ejecute next()
jest.mock("../../../src/auth/auth.actions", () => ({
  verifyToken: jest.fn((req, res, next) => next()), // Mockear verifyToken para que ejecute next()
}));

jest.mock("../../../src/book/book.controller");

describe("Book Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new book", async () => {
    const newBook = { title: "Book A", author: "Author A" };
    bookController.CreateBook.mockResolvedValue(newBook);

    const response = await supertest(app)
      .post("/books")
      .expect(201);

    expect(response.body).toEqual(newBook);
  });

  it("should get a book by ID", async () => {
    const bookId = "1";
    const book = { _id: bookId, title: "Book A", author: "Author A" };
    bookController.ReadBookById.mockResolvedValue(book);

    const response = await supertest(app)
      .get(`/books/${bookId}`)
      .expect(200);

    expect(response.body).toEqual(book);
    expect(bookController.ReadBookById).toHaveBeenCalledWith(bookId);
  });

  it("should get all books", async () => {
    const books = [
      { _id: "1", title: "Book A", author: "Author A" },
      { _id: "2", title: "Book B", author: "Author B" },
    ];
    bookController.ReadBookWithFilters.mockResolvedValue(books);

    const response = await supertest(app)
      .get("/books")
      .expect(200);

    expect(response.body).toEqual(books);
    expect(bookController.ReadBookWithFilters).toHaveBeenCalledWith({});
  });

  it("should update a book", async () => {
    const bookId = "1";
    const updatedData = { title: "Updated Book A" };
    const updatedBook = { _id: bookId, title: "Updated Book A", author: "Author A" };
    bookController.UpdateBook.mockResolvedValue(updatedBook);

    const response = await supertest(app)
      .patch(`/books/update/${bookId}`)
      .expect(200);

    expect(response.body).toEqual(updatedBook);
  });

  it("should delete a book", async () => {
    const bookId = "1";
    const deletedBook = { _id: bookId, eliminado: true };
    bookController.DeleteBook.mockResolvedValue(deletedBook);

    const response = await supertest(app)
      .delete(`/books/${bookId}`)
      .expect(200);

    expect(response.body).toEqual(deletedBook);
    expect(bookController.DeleteBook).toHaveBeenCalledWith(bookId);
  });
});
