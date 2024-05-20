const mongoose = require("mongoose");

const schemaUsuario = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contraseña: { type: String, required: true },
    libros_vendidos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Libro" }],
    libros_comprados: [{ type: mongoose.Schema.Types.ObjectId, ref: "Libro" }],
    eliminado: { type: Boolean, default: false },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const User = mongoose.model("User", schemaUsuario);

module.exports = User;