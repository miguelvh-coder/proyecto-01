const { getUserById, getAllUsers, createUser, userUpdate, deleteUser} = require('../../../src/user/user.actions');
const User = require('../../../src/user/user.model');
jest.mock('../../../src/user/user.model');


//  1/3 pruebas unitarias de las funciones del usuario  //

describe('Usuario unit Actions', () => {

  describe('READ User (1)', () => {
    it('debería devolver un usuario por ID', async () => {
      const usuario = { _id: '1', nombre: 'Test Usuario', isDeleted: false };
      User.findById.mockResolvedValue(usuario);

      const result = await getUserById('1');

      expect(result).toEqual(usuario);
    });

    it('debería lanzar un error si el usuario está eliminado', async () => {
      const usuario = { _id: '1', nombre: 'Test Usuario', isDeleted: true };
      User.findById.mockResolvedValue(null);

      await expect(getUserById('1')).rejects.toThrow('{"code":404,"msg":"Usuario no existe"}');
    });

    it('debería lanzar un error si el usuario no existe', async () => {
      User.findById.mockResolvedValue(null);

      await expect(getUserById('1')).rejects.toThrow('{"code":404,"msg":"Usuario no existe"}');
    });

  });


  describe('READ User (*)', () => {

    it('debería devolver una lista de usuarios', async () => {
      const usuarios = [
        { _id: '1', nombre: 'Usuario 1', isDeleted: false },
        { _id: '2', nombre: 'Usuario 2', isDeleted: false },
        { _id: '3', nombre: 'Usuario 3', isDeleted: false },
      ];
      User.find.mockResolvedValue(usuarios);
  
      const result = await getAllUsers();
  
      expect(result).toEqual(usuarios);
    });
  
    it('debería devolver una lista vacía si no hay usuarios', async () => {
      User.find.mockResolvedValue([]);
  
      const result = await getAllUsers();
  
      expect(result).toEqual([]);
    });

  });



  describe('CREATE User', () => {
    it('debería crear un nuevo usuario', async () => {
      const datos = { nombre: 'Nuevo Usuario' };
      const usuarioCreado = { _id: '1', ...datos };
      User.create.mockResolvedValue(usuarioCreado);

      const result = await createUser(datos);

      expect(result).toEqual(usuarioCreado);
    });

    it('debería lanzar un error si los datos son inválidos', async () => {
      const datos = {}; // Datos inválidos
      User.create.mockImplementation(() => { throw new Error('{"code":500,"msg":"Error creando en la base de datos"}') });

      await expect(createUser(datos)).rejects.toThrow('{"code":500,"msg":"Error creando en la base de datos"}');
    });

    it('debería lanzar un error si ocurre un problema al crear el usuario', async () => {
      const datos = { nombre: 'Nuevo Usuario' };
      User.create.mockImplementation(() => { throw new Error('{"code":500,"msg":"Error creando en la base de datos"}') });

      await expect(createUser(datos)).rejects.toThrow('{"code":500,"msg":"Error creando en la base de datos"}');
    });
  });



  describe('UPDATE User', () => {

    it('debería actualizar un nuevo usuario', async () => {
      const datos = { nombre: 'Nuevo Usuario' };
      const usuarioCreado = { _id: '1', ...datos };
      User.create.mockResolvedValue(usuarioCreado); // Mock de la creación de usuario
      const a = await createUser(datos);

      const nuevos_datos = { nombre: 'Nuevo NOMBRE' };
      const usuarioActualizado = { _id: '1', ...nuevos_datos };
      User.findByIdAndUpdate.mockResolvedValue(usuarioActualizado); // Mock de la actualización de usuario

      const result = await userUpdate('1', nuevos_datos); // Llama a userUpdate
      expect(result).toEqual(usuarioActualizado);
    });

    it('debería lanzar un error si los datos son inválidos', async () => {
      const datos = { nombre: 'Nuevo Usuario' };
      const usuarioCreado = { _id: '1', ...datos };
      User.create.mockResolvedValue(usuarioCreado); // Mock de la creación de usuario
      await createUser(datos);

      const nuevos_datos = {};
      User.findByIdAndUpdate.mockRejectedValue(new Error('{"code":500,"msg":"Error actualizando los datos"}')); // Mock de la actualización de usuario

      await expect(userUpdate('1', nuevos_datos)).rejects.toThrow('{"code":500,"msg":"Error actualizando los datos"}');
    });

  });


  describe('Delete User', () => {

    it('eliminar un usuario', async () => {
      const datos = { nombre: 'Nuevo Usuario', eliminado: false };
      const usuarioCreado = { _id: '1', ...datos };
      User.create.mockResolvedValue(usuarioCreado); // Mock de la creación de usuario
      const a = await createUser(datos);

      const eliminando = { eliminado: true };
      const usuarioActualizado = { _id: '1', ...eliminando };
      User.findByIdAndUpdate.mockResolvedValue(usuarioActualizado); // Mock de la actualización de usuario

      const result = await deleteUser('1'); // Llama a userUpdate
      expect(result).toEqual(usuarioActualizado);
    });

    it('eliminar un usuario', async () => {
      const datos = { nombre: 'Nuevo Usuario', eliminado: false };
      const usuarioCreado = { _id: '1', ...datos };
      User.create.mockResolvedValue(usuarioCreado); // Mock de la creación de usuario
      await createUser(datos);

      User.findByIdAndUpdate.mockImplementation(() => {
        throw new Error('{"code":500,"msg":"Error actualizando los datos"}');
      });

      await expect(deleteUser('1')).rejects.toThrow('{"code":500,"msg":"Error actualizando los datos"}');
    });

  });

})