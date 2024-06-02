const { createOrder, getOrder, getOrders, updateOrder, deleteOrder } = require('../../../src/order/order.actions');
const { CreateOrder, GetOrder, GetOrders, UpdateOrder, DeleteOrder } = require('../../../src/order/order.controller');
const Order = require('../../../src/order/order.model');
const auth = require("../../../src/auth/auth.actions");

jest.mock('../../../src/order/order.model');
jest.mock('../../../src/order/order.actions');

//  2/3 pruebas unitarias de las funciones del usuario  //

describe('Usuario unit Controller', () => {

    describe('READ Order (1 y *)', () => {

        it('debería devolver una orden por ID', async () => {
            const libros = [{ _id: '1', titulo: 'Libro 1' }, { _id: '2', titulo: 'Libro 2' }];
            const pedido = { _id: '1', libros_ids: libros, estado: "en progreso", direccion_envio: "aca" };
            getOrder.mockResolvedValue(pedido);

            const result = await GetOrder('1');

            expect(result).toEqual(pedido);
        });

        it('debería lanzar un error si la orden no existe', async () => {
            getOrder.mockImplementation(() => {
                throw new Error('{"code":404,"msg":"Orden inexiste"}');
            });

            await expect(GetOrder('1')).rejects.toThrow('{"code":404,"msg":"Orden inexiste"}');
        });

        //para varios pedidos
        it('debería devolver una lista de pedidos', async () => {

            const libros1 = [{ _id: '1', titulo: 'Libro 1' }, { _id: '2', titulo: 'Libro 2' }];
            const libros2 = [{ _id: '1', titulo: 'a' }, { _id: '2', titulo: 'patata' }];
            const libros3 = [{ _id: '1', titulo: 'e' }, { _id: '2', titulo: 'cursed' }];
            const pedidos = [
                { _id: '1', libros_ids: libros1, estado: "en progreso", direccion_envio: "aca" },
                { _id: '2', libros_ids: libros2, estado: "en progreso", direccion_envio: "uninorte" },
                { _id: '3', libros_ids: libros3, estado: "en progreso", direccion_envio: "alla" },
            ];
            getOrders.mockResolvedValue(pedidos);

            const results = await GetOrders();

            expect(results).toEqual(pedidos);
        });

        it('debería devolver una lista vacía si no hay pedidos', async () => {
            getOrders.mockResolvedValue([]);

            const results = await GetOrders();

            expect(results).toEqual([]);
        });

    });



    describe('CREATE Order', () => {
        it('debería crear un nuevo pedido', async () => {
            const libros = [{ _id: '1', titulo: 'Libro 1' }, { _id: '2', titulo: 'Libro 2' }];
            const pedido = { libros_ids: libros, estado: "en progreso", direccion_envio: "aca" };
            const pedir = { _id: '1', ...pedido }
            createOrder.mockResolvedValue(pedir);

            const result = await CreateOrder(pedido);

            expect(result).toEqual(pedir);
        });

        it('debería lanzar un error si los datos son inválidos', async () => {
            const datos = {}; // Datos inválidos
            createOrder.mockImplementation(() => { throw new Error('{"code":500,"msg":"Error creando en la base de datos"}') });

            await expect(CreateOrder(datos)).rejects.toThrow('{"code":500,"msg":"Error creando en la base de datos"}');
        });

        it('debería lanzar un error si ocurre un problema al crear el pedido', async () => {
            const datos = { estado: "en progreso" };
            createOrder.mockImplementation(() => { throw new Error('{"code":500,"msg":"Error creando el pedido"}') });

            await expect(CreateOrder(datos)).rejects.toThrow('{"code":500,"msg":"Error creando el pedido"}');
        });
    });




    describe('UPDATE Order', () => {

        it('debería actualizar un pedido', async () => {
            const id = '1';
            const datos = { estado: 'completado', direccion_envio: 'nueva dirección' };
            const pedidoActualizado = {
                _id: id,
                libros_ids: [{ _id: '1', titulo: 'miss me' }, { _id: '2', titulo: 'why' }],
                estado: 'completado',
                direccion_envio: 'aca',
            };

            updateOrder.mockResolvedValue(pedidoActualizado);

            const result = await UpdateOrder(id, datos);

            expect(result).toEqual(pedidoActualizado);
        });

        it('debería lanzar un error si los datos son inválidos', async () => {
            const id = '1';
            const datos = { estado: 'completado', direccion_envio: 'nueva dirección' };

            updateOrder.mockImplementation(() => { throw new Error('{"code":404,"msg":"Pedido no encontrado"}') });

            await expect(UpdateOrder(id, datos)).rejects.toThrow('{"code":404,"msg":"Pedido no encontrado"}');
        });

    });




    describe('Delete Order', () => {
        //en realidad no se borra, sino que se cancela
        it('eliminar una orden', async () => {
            const id = '1';
            const datos = { estado: 'completado', direccion_envio: 'nueva dirección' };
            const pedidoCancelado = {
                _id: id,
                libros_ids: [{ _id: '1', titulo: 'miss me' }, { _id: '2', titulo: 'why' }],
                estado: 'cancelada',
                direccion_envio: 'aca',
            };

            deleteOrder.mockResolvedValue(pedidoCancelado);

            const result = await DeleteOrder(id, datos);

            expect(result).toEqual(pedidoCancelado);
        });

        it('eliminar una orden (ERROR)', async () => {
            const id = '1';
            const datos = { estado: 'completado', direccion_envio: 'nueva dirección' };
            const pedidoCancelado = {
                _id: id,
                libros_ids: [{ _id: '1', titulo: 'miss me' }, { _id: '2', titulo: 'why' }],
                estado: 'cancelada',
                direccion_envio: 'aca',
            };


            deleteOrder.mockImplementation(() => {
                throw new Error('{"code":500,"msg":"Error actualizando los datos"}');
            });

            await expect(DeleteOrder('1')).rejects.toThrow('{"code":500,"msg":"Error actualizando los datos"}');
        });

    });

});