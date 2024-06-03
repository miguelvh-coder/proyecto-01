const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('../../src/user/user.route');
const bookRoutes = require('../../src/book/book.route');
const orderRoutes = require('../../src/order/order.route'); // Ajusta la ruta según tu estructura de proyecto
const { verifyToken } = require('../../src/auth/auth.actions'); // Ajusta la ruta según tu estructura de proyecto

// Configurar la aplicación Express
const app = express();

app.use(bodyParser.json());

// Usar las rutas de orden
app.use('/orders', orderRoutes);
app.use('/books', bookRoutes);
app.use('/users', userRoutes);

// Middleware de autenticación simulado
jest.mock('../../src/auth/auth.actions', () => ({
  verifyToken: (req, res, next) => {
    req.userId = 'testUserId';
    next();
  },
}));

module.exports = app;
