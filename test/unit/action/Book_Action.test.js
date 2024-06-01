const { createBook, getBooks, getBookById, updateBook, deleteBook } = require('../../../src/book/book.actions');
const Book = require('../../../src/book/book.model');
jest.mock('../../../src/book/book.model');


//  1/3 pruebas unitarias de las funciones del usuario  //

describe('Books Unit Actions', () => {

  describe('READ Book (1 y *)', () => {

    it('debería devolver un libro por ID', async () => {
      const libro = { _id: '1', nombre: 'LIBRA', precio: '20000' };
      Book.findById.mockResolvedValue(libro);

      const result = await getBookById('1');

      expect(result).toEqual(libro);
    });

    it('debería lanzar un error si el libro está eliminado', async () => {
      const libro = { _id: '1', nombre: 'Test Usuario', isDeleted: true };
      Book.findById.mockResolvedValue(null);

      await expect(getBookById('1')).rejects.toThrow('{"code":404,"msg":"Libro no existe"}');
    });

    it('debería lanzar un error si el libro no existe', async () => {
      Book.findById.mockResolvedValue(null);

      await expect(getBookById('1')).rejects.toThrow('{"code":404,"msg":"Libro no existe"}');
    });

    //para varios usuarios
    it('debería devolver una lista de libros', async () => {
      const biblioteca = [
        { _id: '1', nombre: 'glory', precio: '20000' },
        { _id: '2', nombre: 'pain', precio: '200000' },
        { _id: '3', nombre: 'blury in day', precio: '24000' },
      ];
      Book.find.mockResolvedValue(biblioteca);

      const results = await getBooks();

      expect(results).toEqual(biblioteca);
    });

    it('debería devolver una lista vacía si no hay usuarios', async () => {
      Book.find.mockResolvedValue([]);

      const result = await getBooks();

      expect(result).toEqual([]);
    });

  });



  describe('CREATE Book', () => {
    it('debería crear un nuevo usuario', async () => {
      const datos = { nombre: 'Librito', preci: '200' };
      const libroCreado = { _id: '1', ...datos };
      Book.create.mockResolvedValue(libroCreado);

      const result = await createBook(datos);

      expect(result).toEqual(libroCreado);
    });

    it('debería lanzar un error si los datos son inválidos', async () => {
      const datos = {}; // Datos inválidos
      Book.create.mockImplementation(() => { throw new Error('{"code":500,"msg":"Error en los datos del libro"}') });

      await expect(createBook(datos)).rejects.toThrow('{"code":500,"msg":"Error en los datos del libro"}');
    });

    it('debería lanzar un error si ocurre un problema al crear el usuario', async () => {
      const datos = { nombre: 'Nuevo libreria' };
      Book.create.mockImplementation(() => { throw new Error('{"code":500,"msg":"Error creando en el libro"}') });

      await expect(createBook(datos)).rejects.toThrow('{"code":500,"msg":"Error creando en el libro"}');
    });
  });


})

