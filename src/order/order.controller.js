const { respondWithError, throwCustomError } = require("../../utils/function");
const bookActions = require("../book/book.actions");
const orderActions = require("./order.actions");

async function CreateOrder(data) {
  const createdOrder = await orderActions.createOrder(data);
  return createdOrder;
}

async function GetOrder(idOrder) {
  const order = await orderActions.getOrder(idOrder);

  if (!order) {
    return throwCustomError(404, "El pedido no existe");
  }

  
  return order;
}

async function GetOrders(userId, filters) {
  const orders = await orderActions.getOrders(userId, filters);
  return orders;
}

async function UpdateOrder(idOrder, data) {
  
  const orden_actualizada = orderActions.updateOrder(idOrder, data);
  if(!orden_actualizada){
    return throwCustomError(404, "Pedido no encontrado");
  }
  return orden_actualizada

  
}

async function DeleteOrder(idOrder) {

  const order = await orderActions.deleteOrder(idOrder);
  if(!order){
    return throwCustomError(404, "Pedido no encontrado");
  }
  return order;
}


module.exports = {
  CreateOrder,
  GetOrder,
  GetOrders,
  UpdateOrder,
  DeleteOrder
};
