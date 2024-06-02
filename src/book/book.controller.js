const bookActions = require("./book.actions");
const { throwCustomError } = require("../../utils/function");

async function CreateBook(data) {
  const CreatedBook = await bookActions.createBook(data);
  return CreatedBook;
}

async function ReadBookWithFilters(filters) {
  const resultadosBusqueda = await bookActions.getBooks(filters);
  return resultadosBusqueda;
}

async function ReadBookById(_id) {
  const book = await bookActions.getBookById(_id);
  return book;
}

async function UpdateBook(id, data) {
  const book = await bookActions.getBookById(id);
  if (!book) {
    return throwCustomError(404, "Libro no encontrado");
  }
  const updatedBook = await bookActions.updateBook(book._id, data);
  return updatedBook;
}

async function DeleteBook(id) {
  const libro_eliminado = await bookActions.deleteBook(id);
  return libro_eliminado;
}

module.exports = {
  CreateBook,
  ReadBookWithFilters,
  ReadBookById,
  UpdateBook,
  DeleteBook
};