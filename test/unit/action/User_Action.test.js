const { getUserById, userUpdate, deleteUser, putOrderInUser } = require('../../../src/user/user.actions');
const Usuario = require('../../../src/user/user.model');
jest.mock('../../../src/user/user.model');


describe('Usuario Actions', () => {

  describe('getUsuarioMongo', () => {
    it('debería devolver un usuario por ID', async () => {
      const usuario = { _id: '1', nombre: 'Test Usuario', isDeleted: false };
      Usuario.findById.mockResolvedValue(usuario);

      const result = await getUsuarioMongo('1');

      expect(result).toEqual(usuario);
    });

    it('debería lanzar un error si el usuario está eliminado', async () => {
      const usuario = { _id: '1', nombre: 'Test Usuario', isDeleted: true };
      Usuario.findById.mockResolvedValue(usuario);

      await expect(getUsuarioMongo('1')).rejects.toThrow('{"code":404,"msg":"Usuario no existe"}');
    });

    it('debería lanzar un error si el usuario no existe', async () => {
      Usuario.findById.mockResolvedValue(null);

      await expect(getUsuarioMongo('1')).rejects.toThrow('{"code":404,"msg":"Usuario no existe"}');
    });
  });

  describe('createUsuarioMongo', () => {
    it('debería crear un nuevo usuario', async () => {
      const datos = { nombre: 'Nuevo Usuario' };
      const usuarioCreado = { _id: '1', ...datos };
      Usuario.create.mockResolvedValue(usuarioCreado);

      const result = await createUsuarioMongo(datos);

      expect(result).toEqual(usuarioCreado);
    });

    it('debería lanzar un error si los datos son inválidos', async () => {
      const datos = {}; // Datos inválidos
      Usuario.create.mockImplementation(() => { throw new Error('{"code":500,"msg":"Error creando en la base de datos"}') });

      await expect(createUsuarioMongo(datos)).rejects.toThrow('{"code":500,"msg":"Error creando en la base de datos"}');
    });

    it('debería lanzar un error si ocurre un problema al crear el usuario', async () => {
      const datos = { nombre: 'Nuevo Usuario' };
      Usuario.create.mockImplementation(() => { throw new Error('{"code":500,"msg":"Error creando en la base de datos"}') });

      await expect(createUsuarioMongo(datos)).rejects.toThrow('{"code":500,"msg":"Error creando en la base de datos"}');
    });
  });
})