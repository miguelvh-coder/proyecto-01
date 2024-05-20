const mongoose = require("mongoose");

const schemaPedido = new mongoose.Schema(
  {
    comprador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    vendedor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    libros_ids: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Libro", required: true },
    ],
    direccion_envio: { type: String, required: true },
    total: { type: Number, required: true },
    estado: { type: String, default: "en progreso" },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Order = mongoose.model("pedidos", schemaPedido);

module.exports = Order;