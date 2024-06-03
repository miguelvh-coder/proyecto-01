const express = require('express');
const app = express();

app.use(express.json());

const userRoutes = require('./src/user/user.route');
app.use('/users', userRoutes);
const bookRoutes = require('./src/book/book.route');
app.use('/books', bookRoutes);

module.exports = app;
