const request = require('supertest');
const app = require('./test-setup');
const bookController = require('../../src/book/book.controller');

const bookActions = require('../../src/book/book.actions');
jest.mock('../../src/book/book.actions');


jest.mock('../../src/book/book.controller', () => ({
  CreateBook: jest.fn(),
  ReadBookWithFilters: jest.fn(),
  ReadBookById: jest.fn(),
  UpdateBook: jest.fn(),
  DeleteBook: jest.fn(),
}));

describe('Book End-to-End Tests', () => {
  it('should create a new book', async () => {
    const newBook = { titulo: 'Libro Nuevo', autor: 'Autor Nuevo', descripcion: 'Descripción del libro nuevo' };
    const createdBook = { _id: '1', ...newBook };
    bookController.CreateBook.mockResolvedValue(createdBook);

    const response = await request(app)
      .post('/books')
      .send(newBook)
      .expect(201);

    expect(response.body).toEqual(createdBook);
  });

  it('should get a book by ID', async () => {
    const bookId = '1';
    const book = { _id: bookId, titulo: 'Libro Existente', autor: 'Autor Existente', descripcion: 'Descripción del libro existente' };
    bookController.ReadBookById.mockResolvedValue(book);

    const response = await request(app)
      .get(`/books/${bookId}`)
      .expect(200);

    expect(response.body).toEqual(book);
  });

  it('should get all books with filters', async () => {
    const filters = { autor: 'Autor Existente' };
    const books = [
      { _id: '1', titulo: 'Libro 1', autor: 'Autor Existente', descripcion: 'Descripción del libro 1' },
      { _id: '2', titulo: 'Libro 2', autor: 'Autor Existente', descripcion: 'Descripción del libro 2' }
    ];
    bookController.ReadBookWithFilters.mockResolvedValue(books);

    const response = await request(app)
      .get('/books')
      .query(filters)
      .expect(200);

    expect(response.body).toEqual(books);
  });


  it('should update a book', async () => {
    const bookId = '1';
    const updateData = { titulo: 'Libro Actualizado', autor: 'Autor Actualizado', descripcion: 'Descripción del libro actualizado' };
    const updatedBook = { _id: bookId, ...updateData };
    bookController.UpdateBook.mockResolvedValue(updatedBook);

    const response = await request(app)
      .patch(`/books/update/${bookId}`)
      .send(updateData).expect(200);

    expect(response.body).toEqual(updatedBook);
  });


  it('should delete a book', async () => {
    const bookId = '1';
    const deletedBook = { _id: bookId, titulo: 'Libro Eliminado', autor: 'Autor Eliminado', descripcion: 'Descripción del libro eliminado', eliminado: true };
    bookController.DeleteBook.mockResolvedValue(deletedBook);

    const response = await request(app)
      .delete(`/books/${bookId}`)
      .expect(200);

    expect(response.body).toEqual(deletedBook);
  });

  it('should return 404 if book not found on get', async () => {
    const nonExistentBookId = 'nonexistent';
    bookController.ReadBookById.mockRejectedValue(new Error("Libro no existe"));

    const response = await request(app)
      .get(`/books/${nonExistentBookId}`);

    expect(response.body).toEqual({ message: "Libro no existe" });
  });

  it('should return 404 if book not found on update', async () => {
    const nonExistentBookId = 'nonexistent';
    bookController.UpdateBook.mockRejectedValue({ code: 404, message: "Libro no encontrado" });

    const response = await request(app)
      .patch(`/books/update/${nonExistentBookId}`)
      .send({ titulo: 'Libro Actualizado', autor: 'Autor Actualizado', descripcion: 'Descripción del libro actualizado' });

    expect(response.body).toEqual({ message: "Libro no encontrado" });
  });

  it('should return 404 if book not found on delete', async () => {
    const nonExistentBookId = 'nonexistent';
    bookController.DeleteBook.mockRejectedValue(new Error("Libro no encontrado"));

    const response = await request(app)
      .delete(`/books/${nonExistentBookId}`);

    expect(response.body).toEqual({ message: "Libro no encontrado" });
  });
});
