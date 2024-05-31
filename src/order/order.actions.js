const Order = require("./order.model");
const bookActions = require("../book/book.actions");
const userActions = require("../user/user.actions");

const { respondWithError, throwCustomError } = require("../../utils/function");

async function createOrder(data) {
  const newOrder = await Order.create(data);
  return newOrder;
}

async function getOrder(idOrder) {
  const order = await Order.findById(idOrder);
  if(order){return order;}else{
    return throwCustomError( 404, "Orden inexiste" );
  }
}

async function getOrders(userId, filtros) {
  const user = await userActions.getUserById(userId);
  if (Object.keys(filtros).length === 0) {
    const ordersPromises = user.books_purchased.map(async (orderId) => {
      const order = await Order.findById(orderId);
      return order;
    });

    const orders = await Promise.all(ordersPromises);
    console.log("orders", orders);
    return orders;
  } else {
    const orders = await user.books_purchased.map(async (orderId) => {
      const order = await Order.findById(orderId);
      const cumpleFiltros = await validarfiltros(filtros || {}, order);
      return cumpleFiltros ? order : null;
    });
    return orders;
  }
}

async function validarfiltros(filtros, order) {
  const camposValidos = ["fecha_inicio", "fecha_fin", "estado"];

  const camposFiltros = Object.keys(filtros);

  const filtrosValidos = camposFiltros.every((filtro) =>
    camposValidos.includes(filtro)
  );

  const estadosValidos = ["en progreso", "completado", "cancelado"];

  if (filtros.estado && !estadosValidos.includes(filtros.estado)) {
    throw new Error("El filtro de estado contiene un valor invalido");
  }

  if (!filtrosValidos) {
    throw new Error("Los filtros proporcionados contienen campos invalidos");
  }

  if (order.estado && order.estado !== filtros.estado) {
    return false;  
  }

  if (filtros.fecha_inicio && order.createdAt < filtros.fecha_inicio) {
    return false;  
  }

  if (filtros.fecha_fin && order.createdAt > filtros.fecha_fin) {
    return false;  
  }

  return true;
}

async function verifyUser(order, userId) {
  return order.comprador.equals(userId) || order.vendedor.equals(userId);
}

async function updateOrderComprador(order, estado) {
  if (estado !== "cancelar") {
    return throwCustomError(400, "El estado solicitado es invalido.");
  }
  await bookActions.returnStatusBooks(order.libros_ids);
  order.estado = estado;
  await order.save();
  return order;
}

async function updateOrderVendedor(order, estado) {
  if (estado !== "cancelar" && estado !== "completar") {
    return throwCustomError(400, "El estado proporcionado es invalido.");
  }
  if (estado === "cancelar") {
    await bookActions.returnStatusBooks(order.libros_ids);
  }
  order.estado = estado;
  await order.save();
  return order;
}

module.exports = {
  createOrder,
  getOrder,
  getOrders,
  verifyUser,
  updateOrderComprador,
  updateOrderVendedor,
};