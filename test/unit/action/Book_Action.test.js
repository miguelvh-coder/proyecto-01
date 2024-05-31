const request = require('supertest');
const app = require('../app');  // El archivo que inicializa tu app Express
const mongoose = require('mongoose');
const Book = require('../models/book'); // Ajusta la ruta según tu estructura

beforeAll(async () => {
  // Conectar a la base de datos de prueba
  await mongoose.connect('mongodb://localhost:27017/testdb', { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  // Limpiar y cerrar la conexión
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Book API', () => {
  let bookId;

  it('should create a new book', async () => {
    const res = await request(app)
      .post('/books')
      .send({
        title: 'Test Book',
        author: 'Test Author',
        price: 10.99
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    bookId = res.body._id;
  });

  it('should get a book by id', async () => {
    const res = await request(app).get(`/books/${bookId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('title', 'Test Book');
  });

  it('should update a book', async () => {
    const res = await request(app)
      .put(`/books/${bookId}`)
      .send({
        price: 12.99
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('price', 12.99);
  });

  it('should delete a book', async () => {
    const res = await request(app).delete(`/books/${bookId}`);
    expect(res.statusCode).toEqual(204);
  });
});

