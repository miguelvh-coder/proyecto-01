const { GetUserById, GetUsers, CreateUser, UpdateUser, DeleteUser } = require('../../../src/user/user.controller');
const { getUserById, getAllUsers, createUser, userUpdate, deleteUser, putOrderInUser, } = require('../../../src/user/user.actions');
const User = require('../../../src/user/user.model');
const auth = require("../../../src/auth/auth.actions");

jest.mock('../../../src/user/user.model');
jest.mock('../../../src/user/user.actions');

//  2/3 pruebas unitarias de las funciones del usuario  //

describe('Usuario unit Controller', () => {


    describe('READ User (1 y *)', () => {

        it('debería devolver un usuario por ID', async () => {
            const id = '1';
            const usuario = { _id: id, nombre: 'Test Usuario', isDeleted: false };
            getUserById.mockResolvedValue(usuario);

            const result = await GetUserById('1');
            expect(result).toEqual(usuario);
        });

        it('debería lanzar un error si el usuario está eliminado', async () => {
            const usuario = { _id: '1', nombre: 'Test Usuario', isDeleted: true };
            getUserById.mockImplementation(() => {
                throw new Error('{"code":404,"msg":"Usuario no existe"}');
            });
            await expect(GetUserById('1')).rejects.toThrow('{"code":404,"msg":"Usuario no existe"}');
        });

        it('debería lanzar un error si el usuario no existe', async () => {
            getUserById.mockImplementation(() => {
                throw new Error('{"code":404,"msg":"Usuario no existe"}');
            });
            await expect(GetUserById('1')).rejects.toThrow('{"code":404,"msg":"Usuario no existe"}');
        });


        //para varios usuarios
        it('debería devolver una lista de usuarios', async () => {
            const usuarios = [
                { _id: '1', nombre: 'Usuario 1', isDeleted: false },
                { _id: '2', nombre: 'Usuario 2', isDeleted: false },
                { _id: '3', nombre: 'Usuario 3', isDeleted: false },
            ];
            getAllUsers.mockResolvedValue(usuarios);

            const result = await GetUsers();

            expect(result).toEqual(usuarios);
        });

        it('debería devolver una lista vacía si no hay usuarios', async () => {
            getAllUsers.mockResolvedValue([]);

            const result = await GetUsers();

            expect(result).toEqual([]);
        });

    });





    describe('CREATE User', () => {

        it('debería crear un nuevo usuario', async () => {
            const contraseñaI = 'alga';
            const datosI = { _id: '1', contraseña: contraseñaI, nombre: 'Nuevo Usuario', email: 'a@a.a' };
            const datosH = { nombre: 'Nuevo Usuario', email: 'a@a.a' };

            const usuarioCreado = { _id: '1', ...datosH };
            createUser.mockResolvedValue(usuarioCreado);

            const result = await CreateUser(datosI);

            expect(result).toEqual(usuarioCreado);
        });

        it('debería lanzar un error si los datos son inválidos', async () => {
            const datos = {}; // Datos inválidos
            createUser.mockImplementation(() => { throw new Error('{"code":500,"msg":"Error creando el usuario"}') });

            await expect(CreateUser(datos)).rejects.toThrow('{"code":500,"msg":"Error creando el usuario"}');
        });

        it('debería lanzar un error si ocurre un problema al crear el usuario', async () => {
            const datos = { nombre: 'Nuevo Usuario' };
            createUser.mockImplementation(() => { throw new Error('{"code":500,"msg":"Error creando el usuario"}') });

            await expect(CreateUser(datos)).rejects.toThrow('{"code":500,"msg":"Error creando el usuario"}');
        });

    });




    describe('UPDATE User', () => {

        it('debería actualizar los datos de un usuario y devolver la información actualizada', async () => {
            const contraseñaI = 'alga';
            const datosI = { contraseña: contraseñaI, nombre: 'Nuevo Usuario', email: 'a@a.a' };
            const datosH = { nombre: 'Nuevo Usuario', email: 'a@a.a' };

            const usuarioCreado = { id: '1', ...datosH };
            userUpdate.mockResolvedValue(usuarioCreado);

            const result = await UpdateUser('1', datosI);

            expect(result).toEqual(usuarioCreado);
        });

        it('debería lanzar un error si el usuario no existe', async () => {
            const id = '1';
            const datos = { nombre: 'Usuario Actualizado', contraseña: 'nueva_contraseña', email: 'nuevo@correo.com' };

            userUpdate.mockImplementation(() => { throw new Error('{"code":404,"msg":"Usuario no encontrado"}') });

            await expect(UpdateUser(id, datos)).rejects.toThrow('{"code":404,"msg":"Usuario no encontrado"}');
        });

    });




    describe('Delete User', () => {

        it('eliminar un usuario', async () => {
            const datosE = { nombre: 'Nuevo Usuario', email: 'a@a.a', eliminado: true };
            const usuarioCreado = { id: '1', ...datosE };
            deleteUser.mockResolvedValue(usuarioCreado);

            const result = await DeleteUser('1');

            expect(result).toEqual(usuarioCreado);
        });

        it('eliminar un usuario', async () => {
            deleteUser.mockImplementation(() => {
                throw new Error('{"code":500,"msg":"Error actualizando los datos"}');
            });

            await expect(DeleteUser('1')).rejects.toThrow('{"code":500,"msg":"Error actualizando los datos"}');
        });

    });


});