const { CreateBook, ReadBookWithFilters, UpdateBook, DeleteBook, ReadBookById } = require("../../../src/book/book.controller");
const bookActions = require("../../../src/book/book.actions");

jest.mock("../../../src/book/book.actions", () => ({
  createBook: jest.fn(),
  getBooks: jest.fn(),
  getBookById: jest.fn(),
  updateBook: jest.fn(),
  deleteBook: jest.fn()
}));

describe("Book Controller", () => {
  describe("CreateBook", () => {
    it("should create a new book", async () => {
      const newBook = { _id: "1", name: "LIBRA", price: 20000 };
      bookActions.createBook.mockResolvedValue(newBook);

      const result = await CreateBook(newBook);

      expect(result).toEqual(newBook);
    });
  });

  describe("ReadBookWithFilters", () => {
    it("should return a list of books", async () => {
      const books = [
        { _id: "1", name: "LIBRA", price: 20000 },
        { _id: "2", name: "Another Book", price: 30000 }
      ];
      bookActions.getBooks.mockResolvedValue(books);

      const result = await ReadBookWithFilters([]);

      expect(result).toEqual(books);
    });

    it("should throw an error if user does not exist", async () => {
        bookActions.getBookById.mockImplementation(() => { throw new Error('{"code":404,"msg":"Libro not found"}') });
  
        await expect(ReadBookById("1")).rejects.toThrow('{"code":404,"msg":"Libro not found"}');
      });
  });

  describe("UpdateBook", () => {
    it("should update an existing book", async () => {
      const bookId = "1";
      const existingBook = { _id: bookId, name: "LIBRA", price: 20000 };
      const updatedData = { name: "LIBRA Updated", price: 25000 };
      const updatedBook = { ...existingBook, ...updatedData };

      bookActions.getBookById.mockResolvedValue(existingBook);
      bookActions.updateBook.mockResolvedValue(updatedBook);

      const result = await UpdateBook(bookId, updatedData);

      expect(result).toEqual(updatedBook);
    });

    it("should throw an error if book is not found", async () => {
      const bookId = "2";
      bookActions.getBookById.mockResolvedValue(null);

      await expect(UpdateBook(bookId, {})).rejects.toThrow("Libro no encontrado");
    });
  });

  describe("DeleteBook", () => {
    it("should mark a book as deleted", async () => {
      const bookId = "1";
      const deletedBook = { _id: bookId, eliminado: true };

      bookActions.deleteBook.mockResolvedValue(deletedBook);

      const result = await DeleteBook(bookId);

      expect(result).toEqual(deletedBook);
    });
  });
});
