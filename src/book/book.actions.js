const Book = require("./book.model");
const { respondWithError, throwCustomError } = require("../../utils/function");

async function createBook(data) {
  const newBook = await Book.create(data);
  return newBook;
}

async function getBooks() {
  const filters = { eliminado: false };
  //const numberOfBooks = await Book.countDocuments(filters);
  const books = await Book.find(filters);
  return books;
}

async function getBookById(_id) {
  const book = await Book.findById(_id);
  if(!book){
    return throwCustomError( 404, "Libro no existe" );
  }
  if(book.eliminado){
    return throwCustomError( 404, "Libro no existe" );
  }
  return book;
}

async function changeStatusBook(book) {
  book.disponible = false;
  await book.save();
  return book;
}

async function returnStatusBooks(libros_ids) {
  const books = await Book.find({ _id: { $in: libros_ids } });
  books.every((book) => {
    book.disponible = true;
    book.save();
  });
}

async function changeStatusBooks(libros_ids) {
  const books = await Book.find({ _id: { $in: libros_ids } });
  books.every((book) => bookActions.changeStatusBooks(book));
}

async function verifySeller(books_ids) {
  const books = await Book.find({ _id: { $in: books_ids } });
  const firstSalesman = books[0].dueño;
  return books.every((book) => book.dueño.equals(firstSalesman));
}

async function getBooksOverallValue(books_ids) {
  const books = await Book.find({ _id: { $in: books_ids } });
  return books.reduce((acc, book) => acc + book.precio, 0);
}

async function getSeller(books_ids) {
  const books = await Book.find({ _id: { $in: books_ids } });
  return books[0].dueño;
}
async function updateBook(book_id, data) {
  const updatedBook = await Book.findByIdAndUpdate(book_id, data);
  return updatedBook;
}

async function deleteBook(book_id) {
  const BookDeleted = await Book.findByIdAndUpdate(book_id, { eliminado: true });
  return BookDeleted;
}

module.exports = {
  createBook,
  getBooks,
  getBookById,
  changeStatusBook,
  returnStatusBooks,
  changeStatusBooks,
  verifySeller,
  getBooksOverallValue,
  getSeller,
  updateBook,
  deleteBook
};