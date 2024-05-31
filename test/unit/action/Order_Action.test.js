const { createOrder, getOrder, getOrders, updateOrderComprador, updateOrderVendedor } = require('../../../src/order/order.actions');
const Order = require('../../../src/order/order.model');
jest.mock('../../../src/order/order.model');