const Book = require("./book.model");

async function createBook(data) {
  const newBook = await Book.create(data);
  return newBook;
}

async function getBooks(filters) {
  filters = { ...filters, disponible: true };
  const numberOfBooks = await Book.countDocuments(filters);
  const books = await Book.find(filters);
  return { numberOfBooks, books };
}

async function getBookById(id) {
  const book = await Book.findById(id);
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
  await updatedBook.save();
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