const express = require('express');
const app = express();

app.use(express.json());

const userRoutes = require('./src/user/user.route');
app.use('/users', userRoutes);

module.exports = app;
