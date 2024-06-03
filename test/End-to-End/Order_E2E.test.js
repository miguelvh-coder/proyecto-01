const request = require('supertest');
const app = require('./test-setup');
const orderController = require('../../src/order/order.controller');

jest.mock('../../src/order/order.controller', () => ({
    CreateOrder: jest.fn(),
    GetOrder: jest.fn(),
    GetOrders: jest.fn(),
    UpdateOrder: jest.fn(),
    DeleteOrder: jest.fn(),
}));

describe('Order End-to-End Tests', () => {
    it('should create a new order', async () => {
        // Mockear el comportamiento del controlador para la creación de órdenes
        const libros = [{ _id: '1', titulo: 'Libro 1' }, { _id: '2', titulo: 'Libro 2' }];
        const pedido = { libros_ids: libros.map(libro => libro._id), estado: "en progreso", direccion_envio: "aca" };
        const newOrder = { _id: '1', ...pedido };
        orderController.CreateOrder.mockResolvedValue(newOrder);

        // Hacer una solicitud POST a la ruta de creación de órdenes
        const response = await request(app)
            .post('/orders')
            .send(pedido)
            .expect(201);

        // Verificar que la respuesta sea la esperada
        expect(response.body).toEqual(newOrder);
    });


    it('should get an order by ID', async () => {
        const orderId = '1';
        const order = { _id: orderId, libros_ids: ['1', '2'], estado: "en progreso", direccion_envio: "aca" };
        orderController.GetOrder.mockResolvedValue(order);

        const response = await request(app)
            .get(`/orders/${orderId}`)
            .expect(200);

        expect(response.body).toEqual(order);
    });

    it('should get all orders', async () => {
        const orders = [
            { _id: '1', libros_ids: ['1'], estado: "en progreso", direccion_envio: "aca" },
            { _id: '2', libros_ids: ['2'], estado: "completado", direccion_envio: "allá" }
        ];
        orderController.GetOrders.mockResolvedValue(orders);

        const response = await request(app)
            .get('/orders')
            .expect(200);

        expect(response.body).toEqual(orders);
    });

    it('should update an order', async () => {
        const orderId = '1';
        const updateData = { estado: "completado", direccion_envio: "allá" };
        const updatedOrder = { _id: orderId, ...updateData };
        orderController.UpdateOrder.mockResolvedValue(updatedOrder);

        const response = await request(app)
            .patch(`/orders/${orderId}`)
            .send(updateData)
            .expect(200);

        expect(response.body).toEqual(updatedOrder);
    });

    it('should delete (cancel) an order', async () => {
        const orderId = '1';
        const cancelledOrder = { _id: orderId, estado: "cancelada", direccion_envio: "aca" };
        orderController.DeleteOrder.mockResolvedValue(cancelledOrder);

        const response = await request(app)
            .delete(`/orders/${orderId}`)
            .expect(200);

        expect(response.body).toEqual(cancelledOrder);
    });

    it('should return 404 if order not found on get', async () => {
        const nonExistentOrderId = 'nonexistent';
        orderController.GetOrder.mockRejectedValue(new Error("Pedido no encontrado"));

        const response = await request(app)
            .get(`/orders/${nonExistentOrderId}`);

        expect(response.body).toEqual({ message: "Pedido no encontrado" });
    });

    it('should return 404 if order not found on update', async () => {
        const nonExistentOrderId = 'nonexistent';
        orderController.UpdateOrder.mockRejectedValue(new Error("Pedido no encontrado"));

        const response = await request(app)
            .patch(`/orders/${nonExistentOrderId}`)
            .send({ estado: "completado", direccion_envio: "allá" });

        expect(response.body).toEqual({ message: "Pedido no encontrado" });
    });

    it('should return 404 if order not found on delete', async () => {
        const nonExistentOrderId = 'nonexistent';
        orderController.DeleteOrder.mockRejectedValue(new Error("Pedido no encontrado"));

        const response = await request(app)
            .delete(`/orders/${nonExistentOrderId}`);

        expect(response.body).toEqual({ message: "Pedido no encontrado" });
    });


});
