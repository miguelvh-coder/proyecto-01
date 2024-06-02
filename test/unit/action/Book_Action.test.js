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
      const libro = { _id: '1', nombre: 'Test Usuario', eliminado: true };
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
      const datos = { nombre: 'Librito', precio: '200' };
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



  describe('UPDATE Libro', () => {

    it('debería actualizar un libro', async () => {
      const id = '1';
      const datos = { nombre: 'Librito Actualizado', precio: '250' };
      const libroActualizado = { _id: id, ...datos };

      Book.findByIdAndUpdate.mockResolvedValue(libroActualizado);
      const result = await updateBook(id, datos);
      expect(result).toEqual(libroActualizado);

      // Verificar que se llamó a la función de actualización del libro
      expect(Book.findByIdAndUpdate).toHaveBeenCalledWith(id, datos);
    });

    it('debería lanzar un error si los datos son inválidos', async () => {
      const id = '1';
      const datos = { nombre: 'Librito Actualizado', precio: '250' };

      Book.findByIdAndUpdate.mockRejectedValue(new Error('{"code":500,"msg":"Error actualizando los datos"}'));

      await expect(updateBook(id, datos)).rejects.toThrow('{"code":500,"msg":"Error actualizando los datos"}');
    });

  });



  describe('Delete Book', () => {

    it('eliminar un libro', async () => {
      const datos = { nombre: 'Nuevo Libro', precio: '2000' };
      const LibroCreado = { id: '1', ...datos };
      Book.create.mockResolvedValue(LibroCreado); // Mock de la creación de usuario
      const a = await createBook(datos);

      const eliminando = { eliminado: true };
      const libroE = { _id: '1', ...eliminando };
      Book.findByIdAndUpdate.mockResolvedValue(libroE); // Mock de la actualización de usuario
      
      const result = await deleteBook('1'); // Llama a userUpdate
      expect(result).toEqual(libroE);
    });

    it('eliminar un libro con error', async () => {
      const datos = { nombre: 'libreta', precio: '2000' };
      const libroC= { _id: '1', ...datos };
      Book.create.mockResolvedValue(libroC); // Mock de la creación de usuario
      await createBook(datos);

      Book.findByIdAndUpdate.mockImplementation(() => {
        throw new Error('{"code":500,"msg":"Error actualizando los datos"}');
      });

      await expect(deleteBook('1')).rejects.toThrow('{"code":500,"msg":"Error actualizando los datos"}');
    });

  });


})

