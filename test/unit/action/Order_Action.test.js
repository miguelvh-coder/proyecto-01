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

        it('debería lanzar un error si el usuario está eliminado', async () => {
            const usuario = { _id: '1', nombre: 'Test Usuario', isDeleted: true };
            User.findById.mockResolvedValue(null);
      
            await expect(getUserById('1')).rejects.toThrow('{"code":404,"msg":"Usuario no existe"}');
          });

    });


});