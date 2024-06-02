const request = require("supertest");
const express = require("express");
const bookRoutes = require("../../../src/book/book.route");
const bookController = require("../../../src/book/book.controller");
const { verifyToken } = require("../../../src/auth/auth.actions");

jest.mock("../../../src/book/book.controller", () => ({
  CreateBook: jest.fn(),
  ReadBookById: jest.fn(),
  ReadBookWithFilters: jest.fn(),
  UpdateBook: jest.fn(),
  DeleteBook: jest.fn(),
}));

jest.mock("../../../src/auth/auth.actions", () => ({
  verifyToken: (req, res, next) => {
    req.userId = "testUserId";
    next();
  },
}));

const app = express();
app.use(express.json());
app.use("/books", bookRoutes);

describe("Book Routes", () => {
  describe("POST /books", () => {
    it("should create a new book", async () => {
      const newBook = { _id: "1", title: "Book A", author: "Author A" };
      bookController.CreateBook.mockResolvedValue(newBook);

      const response = await request(app)
        .post("/books")
        .send(newBook)
        .expect(201);

      expect(response.body).toEqual(newBook);
      expect(bookController.CreateBook).toHaveBeenCalledWith(newBook);
    });
  });

  describe("GET /books/:id", () => {
    it("should return a book by ID", async () => {
      const book = { _id: "1", title: "Book A", author: "Author A" };
      bookController.ReadBookById.mockResolvedValue(book);

      const response = await request(app)
        .get("/books/1")
        .expect(200);

      expect(response.body).toEqual(book);
      expect(bookController.ReadBookById).toHaveBeenCalledWith("1");
    });

    it("should return 404 if book does not exist", async () => {
        const error = new Error("Libro no existe");
        error.status = 404;
        bookController.ReadBookById.mockRejectedValue(error);
    
        const response = await request(app)
          .get("/books/2")
          .expect(404);
    
        expect(response.body).toEqual({ message: "Libro no existe" });
      });
  });

  describe("GET /books", () => {
    it("should return a list of books", async () => {
      const books = [
        { _id: "1", title: "Book A", author: "Author A" },
        { _id: "2", title: "Book B", author: "Author B" },
      ];
      bookController.ReadBookWithFilters.mockResolvedValue(books);

      const response = await request(app)
        .get("/books")
        .expect(200);

      expect(response.body).toEqual(books);
    });
  });

  describe("PATCH /books/update/:id", () => {
    it("should update an existing book", async () => {
      const bookId = "1";
      const updatedData = { title: "Updated Book A" };
      const updatedBook = { _id: bookId, title: "Updated Book A", author: "Author A" };

      bookController.UpdateBook.mockResolvedValue(updatedBook);

      const response = await request(app)
        .patch(`/books/update/${bookId}`)
        .send(updatedData)
        .expect(200);

      expect(response.body).toEqual(updatedBook);
      expect(bookController.UpdateBook).toHaveBeenCalledWith(bookId, updatedData);
    });

    it("should return 404 if book is not found", async () => {
        const error = new Error("Libro no encontrado");
        error.status = 404;
        bookController.UpdateBook.mockRejectedValue(error);
    
        const response = await request(app)
          .patch("/books/update/2")
          .send({})
          .expect(404);
    
        expect(response.body).toEqual({ message: "Libro no encontrado" });
      });
  });

  describe("DELETE /books/:id", () => {
    it("should delete an existing book", async () => {
      const bookId = "1";
      const deletedBook = { _id: bookId, eliminado: true };

      bookController.DeleteBook.mockResolvedValue(deletedBook);

      const response = await request(app)
        .delete(`/books/${bookId}`)
        .expect(200);

      expect(response.body).toEqual(deletedBook);
      expect(bookController.DeleteBook).toHaveBeenCalledWith(bookId);
    });
  });
});
