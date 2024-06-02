const { createOrder, getOrder, getOrders, updateOrder, deleteOrder } = require('../../../src/order/order.actions');
const Order = require('../../../src/order/order.model');
const User = require('../../../src/user/user.model');
const Libro = require('../../../src/book/book.model');
jest.mock('../../../src/order/order.model');
jest.mock('../../../src/user/user.model');
jest.mock('../../../src/book/book.model');

//  1/3 pruebas unitarias de las funciones de los pedidos  //

describe('Pedido unit Actions', () => {

    describe('READ Order (1 y *)', () => {
        it('debería devolver una orden por ID', async () => {
            const libros = [{ _id: '1', titulo: 'Libro 1' }, { _id: '2', titulo: 'Libro 2' }];
            const pedido = { _id: '1', libros_ids: libros, estado: "en progreso", direccion_envio: "aca" };
            Order.findById.mockResolvedValue(pedido);

            const result = await getOrder('1');

            expect(result).toEqual(pedido);
        });

        it('debería lanzar un error si la orden no existe', async () => {
            Order.findById.mockResolvedValue(null);

            await expect(getOrder('1')).rejects.toThrow('{"code":404,"msg":"Orden inexiste"}');
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
            Order.find.mockResolvedValue(pedidos);

            const results = await getOrders();

            expect(results).toEqual(pedidos);
            expect(Order.find).toHaveBeenCalled();
        });

        it('debería devolver una lista vacía si no hay pedidos', async () => {
            Order.find.mockResolvedValue([]);

            const results = await getOrders();

            expect(results).toEqual([]);
        });

    });



    describe('CREATE Order', () => {
        it('debería crear un nuevo pedido', async () => {
            const libros = [{ _id: '1', titulo: 'Libro 1' }, { _id: '2', titulo: 'Libro 2' }];
            const pedido = { libros_ids: libros, estado: "en progreso", direccion_envio: "aca" };
            const pedir = { _id: '1', ...pedido }
            Order.create.mockResolvedValue(pedir);

            const result = await createOrder(pedido);

            expect(result).toEqual(pedir);
        });

        it('debería lanzar un error si los datos son inválidos', async () => {
            const datos = {}; // Datos inválidos
            Order.create.mockImplementation(() => { throw new Error('{"code":500,"msg":"Error creando en la base de datos"}') });

            await expect(createOrder(datos)).rejects.toThrow('{"code":500,"msg":"Error creando en la base de datos"}');
        });

        it('debería lanzar un error si ocurre un problema al crear el pedido', async () => {
            const datos = { estado: "en progreso" };
            Order.create.mockImplementation(() => { throw new Error('{"code":500,"msg":"Error creando el pedido"}') });

            await expect(createOrder(datos)).rejects.toThrow('{"code":500,"msg":"Error creando el pedido"}');
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

            Order.findByIdAndUpdate.mockResolvedValue(pedidoActualizado);

            const result = await updateOrder(id, datos);

            expect(result).toEqual(pedidoActualizado);

            // Verificar que se llamó a la función de actualización del pedido
            expect(Order.findByIdAndUpdate).toHaveBeenCalledWith(id, datos);
        });

        it('debería lanzar un error si los datos son inválidos', async () => {
            const id = '1';
            const datos = { estado: 'completado', direccion_envio: 'nueva dirección' };

            Order.findByIdAndUpdate.mockResolvedValue(null);

            await expect(updateOrder(id, datos)).rejects.toThrow('{"code":404,"msg":"Pedido no encontrado"}');
        });

    });




    describe('Delete Order', () => {

        it('eliminar una orden', async () => {
            const id = '1';
            const datos = { estado: 'completado', direccion_envio: 'nueva dirección' };
            const pedidoActualizado = {
                _id: id,
                libros_ids: [{ _id: '1', titulo: 'miss me' }, { _id: '2', titulo: 'why' }],
                estado: 'cancelada',
                direccion_envio: 'aca',
            };

            Order.findByIdAndUpdate.mockResolvedValue(pedidoActualizado);

            const result = await deleteOrder(id, datos);

            expect(result).toEqual(pedidoActualizado);

            // Verificar que se llamó a la función de actualización del pedido
            expect(Order.findByIdAndUpdate).toHaveBeenCalledWith(id, datos);
        });

        it('eliminar una orden (ERROR)', async () => {
            const id = '1';
            const datos = { estado: 'completado', direccion_envio: 'nueva dirección' };
            const pedidoActualizado = {
                _id: id,
                libros_ids: [{ _id: '1', titulo: 'miss me' }, { _id: '2', titulo: 'why' }],
                estado: 'cancelada',
                direccion_envio: 'aca',
            };


            Order.findByIdAndUpdate.mockImplementation(() => {
                throw new Error('{"code":500,"msg":"Error actualizando los datos"}');
            });

            await expect(deleteOrder('1')).rejects.toThrow('{"code":500,"msg":"Error actualizando los datos"}');
        });

    });

});