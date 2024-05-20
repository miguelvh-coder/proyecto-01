const { respondWithError, throwCustomError } = require("../../utils/functions");
const bookActions = require("../book/book.actions");
const userActions = require("../user/user.actions");
const orderActions = require("./order.actions");

async function createOrder(data) {
  const { libros_ids } = data;

  const verifySeller = await bookActions.verifyOnlySalesman(libros_ids);

  if (!verifySeller)
    return throwCustomError(
      400,
      "Solo es posible comprar libros del mismo vendedor."
    );

  data.vendedor = await bookActions.getSeller(libros_ids);

  if (data.vendedor === data.comprador)
    return throwCustomError(400, "No esta permitido realizar compras a ti mismo.");

  data.total = await bookActions.getBooksTotalPrice(libros_ids);

  const createdOrder = await orderActions.createOrder(data);
  await bookActions.changeStatusBooks(libros_ids);
  await userActions.putOrderInUser(data.comprador, createdOrder._id, 0); // comprador = 0
  await userActions.putOrderInUser(data.vendedor, createdOrder._id, 1); //  vendedor = 1
  return createdOrder;
}

async function getOrder(idOrder, userId) {
  const order = await orderActions.getOrder(idOrder);

  if (!order) {
    return throwCustomError(404, "El pedido no existe");
  }

  const verify = await orderActions.verifyUser(order, userId);
  if (!verify) {
    return throwCustomError(
      403,
      "No tienes permisos para realizar esta acción, solo el comprador o vendedor pueden ver el pedido"
    );
  }
  return order;
}

async function getOrders(userId, filters) {
  const orders = await orderActions.getOrders(userId, filters);
  return orders;
}

async function updateOrder(idOrder, userId, data) {
  const { estado } = data;
  const order = await orderActions.getOrder(idOrder);

  if (!order) {
    return throwCustomError(404, "El pedido no existe.");
  }

  const verify = await orderActions.verifyUser(order, userId);

  if (!verify) {
    return throwCustomError(
      403,
      "No tiene permiso para realizar esta acción, solo el comprador o vendedor tienen permitido ver el pedido"
    );
  }

  if (estado) {
    if (estado === "cancelar" && order.estado !== "en progreso") {
      return throwCustomError(
        400,
        "No es posible cancelar un pedido que no está en progreso."
      );
    }

    return order.comprador === userId
      ? await orderActions.updateOrderComprador(order, estado)
      : await orderActions.updateOrderVendedor(order, estado);
  }
}
module.exports = {
  createOrder,
  getOrder,
  getOrders,
  updateOrder,
};
