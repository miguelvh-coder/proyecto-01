const { createOrder, getOrder, getOrders, updateOrderComprador, updateOrderVendedor } = require('../../../src/order/order.actions');
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
            const datos = { nombre: 'Nuevo Usuario' };
            const usuarioCreado = { _id: '1', ...datos };
            User.create.mockResolvedValue(usuarioCreado);

            const libros1 = [{ _id: '1', titulo: 'Libro 1' }, { _id: '2', titulo: 'Libro 2' }];
            const libros2 = [{ _id: '1', titulo: 'a' }, { _id: '2', titulo: 'patata' }];
            const libros3 = [{ _id: '1', titulo: 'e' }, { _id: '2', titulo: 'cursed' }];
            const pedidos = [
                { _id: '1', libros_ids: libros1, estado: "en progreso", direccion_envio: "aca" },
                { _id: '2', libros_ids: libros2, estado: "en progreso", direccion_envio: "uninorte" },
                { _id: '3', libros_ids: libros3, estado: "en progreso", direccion_envio: "alla" },
            ];
            User.find.mockResolvedValue(pedidos);

            const results = await getOrders();

            expect(results).toEqual(pedidos);
        });

        it('debería devolver una lista vacía si no hay pedidos', async () => {
            Order.find.mockResolvedValue([]);

            const result = await getOrders();

            expect(result).toEqual([]);
        });



    });


});