const { createOrder, getOrder, getOrders, updateOrderComprador, updateOrderVendedor } = require('../../../src/order/order.actions');
const Order = require('../../../src/order/order.model');
jest.mock('../../../src/order/order.model');


//  1/3 pruebas unitarias de las funciones de los pedidos  //

describe('Pedido unit Actions', () => {

    describe('READ Order (1 y *)', () => {
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
    
        //para varios usuarios
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


});