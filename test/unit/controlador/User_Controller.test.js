const { GetUserById, createUser, updateUser, deleteUser, GetUsers } = require('../../../src/user/user.controller');
const User = require('../../../src/user/user.model');
const auth = require("../../../src/auth/auth.actions");
const userActions = require('../../../src/user/user.actions');

jest.mock('../../../src/user/user.model');
jest.mock('../../../src/auth/auth.actions');

//  2/3 pruebas unitarias de las funciones del usuario  //

describe('Usuario unit Controller', () => {


    describe('READ User (1 y *)', () => {

        it('debería devolver un usuario por ID', async () => {
            const usuario = { _id: '1', nombre: 'Test Usuario', isDeleted: false };
            User.findById.mockResolvedValue(usuario);

            const result = await GetUserById('1');

            expect(result).toEqual(usuario);
        });

        it('debería lanzar un error si el usuario está eliminado', async () => {
            const usuario = { _id: '1', nombre: 'Test Usuario', isDeleted: true };
            User.findById.mockResolvedValue(null);

            await expect(GetUserById('1')).rejects.toThrow('{"code":404,"msg":"Usuario no existe"}');
        });

        it('debería lanzar un error si el usuario no existe', async () => {
            User.findById.mockResolvedValue(null);

            await expect(GetUserById('1')).rejects.toThrow('{"code":404,"msg":"Usuario no existe"}');
        });


        //para varios usuarios
        it('debería devolver una lista de usuarios', async () => {
            const usuarios = [
                { _id: '1', nombre: 'Usuario 1', isDeleted: false },
                { _id: '2', nombre: 'Usuario 2', isDeleted: false },
                { _id: '3', nombre: 'Usuario 3', isDeleted: false },
            ];
            User.find.mockResolvedValue(usuarios);

            const result = await GetUsers();

            expect(result).toEqual(usuarios);
        });

        it('debería devolver una lista vacía si no hay usuarios', async () => {
            User.find.mockResolvedValue([]);

            const result = await GetUsers();

            expect(result).toEqual([]);
        });

    });


    describe('CREATE User', () => {

        it('debería crear un nuevo usuario', async () => {
            const datos = { id: '1', nombre: 'Nuevo Usuario', email: 'a@a.a' };
            const usuarioCreado = { contraseña: 'alga', ...datos };
            User.create.mockResolvedValue(usuarioCreado);

            const result = await createUser(usuarioCreado);

            expect(result).toEqual(datos);
        });

        it('debería lanzar un error si los datos son inválidos', async () => {
            const datos = {}; // Datos inválidos
            User.create.mockImplementation(() => { throw new Error('{"code":500,"msg":"Error creando el usuario"}') });

            await expect(createUser(datos)).rejects.toThrow('{"code":500,"msg":"Error creando el usuario"}');
        });

        it('debería lanzar un error si ocurre un problema al crear el usuario', async () => {
            const datos = { nombre: 'Nuevo Usuario' };
            User.create.mockImplementation(() => { throw new Error('{"code":500,"msg":"Error creando el usuario"}') });

            await expect(createUser(datos)).rejects.toThrow('{"code":500,"msg":"Error creando el usuario"}');
        });

    });



    describe('UPDATE User', () => {

        it('debería actualizar los datos de un usuario y devolver la información actualizada', async () => {
            const id = '1';
            const datos = { nombre: 'Usuario Actualizado', contraseña: 'nueva_contraseña', email: 'nuevo@correo.com' };
            const datosActualizados = { id: '1', nombre: 'Usuario Actualizado', email: 'nuevo@correo.com', contraseña: 'hashed_nueva_contraseña' };
            const usuarioActualizado = { id: '1', nombre: 'Usuario Actualizado', email: 'nuevo@correo.com' };

            auth.encryptPassword.mockResolvedValue('hashed_nueva_contraseña');
            userActions.userUpdate.mockResolvedValue(datosActualizados);

            const result = await updateUser(id, datos);

            expect(result).toEqual(usuarioActualizado);

            // Verificar que la contraseña fue encriptada
            expect(auth.encryptPassword).toHaveBeenCalledWith('nueva_contraseña');
        });

        it('debería lanzar un error si el usuario no existe', async () => {
            const id = '1';
            const datos = { nombre: 'Usuario Actualizado', contraseña: 'nueva_contraseña', email: 'nuevo@correo.com' };

            userActions.userUpdate.mockResolvedValue(null);

            await expect(updateUser(id, datos)).rejects.toThrow('{"code":404,"msg":"Usuario no encontrado"}');
        });

    });


});