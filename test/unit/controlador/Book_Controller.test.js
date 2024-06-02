const { createBook, getBooks, getBookById, updateBook, deleteBook } = require('../../../src/book/book.actions');
const { CreateBook, ReadBookWithFilters, ReadBookById, UpdateBook, DeleteBook } = require('../../../src/book/book.controller');
const Book = require('../../../src/book/book.model');
const auth = require("../../../src/auth/auth.actions");

jest.mock('../../../src/book/book.model');
jest.mock('../../../src/book/book.actions');

//  2/3 pruebas unitarias de las funciones del usuario  //

describe('Books Unit Actions', () => {

  describe('READ Book (1 y *)', () => {

    it('debería devolver un libro por ID', async () => {
      const libro = { _id: '1', nombre: 'LIBRA', precio: '20000' };
      getBookById.mockResolvedValue(libro);

      const result = await ReadBookById('1');
      
      expect(result).toEqual(libro);
    });

    it('debería lanzar un error si el libro está eliminado', async () => {
      const libro = { _id: '1', nombre: 'Test Usuario', eliminado: true };
      getBookById.mockImplementation(() => {
        throw new Error('{"code":404,"msg":"Libro no existe"}');
      });

      await expect(ReadBookById('1')).rejects.toThrow('{"code":404,"msg":"Libro no existe"}');
    });

    it('debería lanzar un error si el libro no existe', async () => {
      getBookById.mockImplementation(() => {
        throw new Error('{"code":404,"msg":"Libro no existe"}');
      });

      await expect(ReadBookById('1')).rejects.toThrow('{"code":404,"msg":"Libro no existe"}');
    });

    //para varios usuarios
    it('debería devolver una lista de libros', async () => {
      const biblioteca = [
        { _id: '1', nombre: 'glory', precio: '20000' },
        { _id: '2', nombre: 'pain', precio: '200000' },
        { _id: '3', nombre: 'blury in day', precio: '24000' },
      ];
      getBooks.mockResolvedValue(biblioteca);

      const results = await ReadBookWithFilters([]);

      expect(results).toEqual(biblioteca);
    });

    it('debería devolver una lista vacía si no hay usuarios', async () => {
      getBooks.mockResolvedValue([]);

      const result = await ReadBookWithFilters([]);

      expect(result).toEqual([]);
    });

  });



  describe('CREATE Book', () => {
    it('debería crear un nuevo usuario', async () => {
      const datos = { nombre: 'Librito', precio: '200' };
      const libroCreado = { _id: '1', ...datos };
      createBook.mockResolvedValue(libroCreado);

      const result = await CreateBook(datos);

      expect(result).toEqual(libroCreado);
    });

    it('debería lanzar un error si los datos son inválidos', async () => {
      const datos = {}; // Datos inválidos
      createBook.mockImplementation(() => { throw new Error('{"code":500,"msg":"Error en los datos del libro"}') });

      await expect(CreateBook(datos)).rejects.toThrow('{"code":500,"msg":"Error en los datos del libro"}');
    });

    it('debería lanzar un error si ocurre un problema al crear el usuario', async () => {
      const datos = { nombre: 'Nuevo libreria' };
      createBook.mockImplementation(() => { throw new Error('{"code":500,"msg":"Error creando en el libro"}') });

      await expect(CreateBook(datos)).rejects.toThrow('{"code":500,"msg":"Error creando en el libro"}');
    });
  });



  describe('UPDATE Libro', () => {

    it('debería actualizar un libro', async () => {
      const id = '1';
      const datos = { nombre: 'Librito Actualizado', precio: '250' };
      const libroActualizado = { _id: id, ...datos };
      getBookById.mockResolvedValue('1');

      updateBook.mockResolvedValue(libroActualizado);
      const result = await UpdateBook(id, datos);
      expect(result).toEqual(libroActualizado);
    });

    it('debería lanzar un error si los datos son inválidos', async () => {
      const id = '1';
      const datos = { nombre: 'Librito Actualizado', precio: '250' };

      updateBook.mockRejectedValue(new Error('{"code":500,"msg":"Error actualizando los datos"}'));

      await expect(UpdateBook(id, datos)).rejects.toThrow('{"code":500,"msg":"Error actualizando los datos"}');
    });

  });



  describe('Delete Book', () => {

    it('eliminar un libro', async () => {
      const eliminando = { eliminado: true };
      const libroE = { _id: '1', ...eliminando };
      deleteBook.mockResolvedValue(libroE); // Mock de la actualización de usuario
      
      const result = await DeleteBook('1'); // Llama a userUpdate
      expect(result).toEqual(libroE);
    });

    it('eliminar un libro con error', async () => {

      deleteBook.mockImplementation(() => {
        throw new Error('{"code":404,"msg":"Libro no encontrado"}');
      });

      await expect(DeleteBook('1')).rejects.toThrow('{"code":404,"msg":"Libro no encontrado"}');
    });

  });


});