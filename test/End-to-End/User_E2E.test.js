const request = require('supertest');
const app = require('./test-setup');
const userController = require('../../src/user/user.controller');

jest.mock('../../src/user/user.controller', () => ({
  CreateUser: jest.fn(),
  GetUserById: jest.fn(),
  GetUsers: jest.fn(),
  UpdateUser: jest.fn(),
  DeleteUser: jest.fn(),
}));

describe('User End-to-End Tests', () => {
  it('should create a new user', async () => {
    const newUser = { _id: '1', email: 'test@example.com', nombre: 'Test User' };
    userController.CreateUser.mockResolvedValue(newUser);

    const response = await request(app)
      .post('/users')
      .send({ email: 'test@example.com', nombre: 'Test User', contraseña: 'password' })
      .expect(201);

    expect(response.body).toEqual(newUser);
  });

  it('should get a user by ID', async () => {
    const user = { _id: '1', email: 'test@example.com', nombre: 'Test User' };
    userController.GetUserById.mockResolvedValue(user);

    const response = await request(app)
      .get('/users/1')
      .expect(200);

    expect(response.body).toEqual(user);
  });

  it('should get all users', async () => {
    const users = [
      { _id: '1', email: 'test1@example.com', nombre: 'Test User 1' },
      { _id: '2', email: 'test2@example.com', nombre: 'Test User 2' },
    ];
    userController.GetUsers.mockResolvedValue(users);

    const response = await request(app)
      .get('/users')
      .expect(200);

    expect(response.body).toEqual(users);
  });

  it('should update a user', async () => {
    const updatedUser = { _id: '1', email: 'test@example.com', nombre: 'Updated User' };
    userController.UpdateUser.mockResolvedValue(updatedUser);

    const response = await request(app)
      .patch('/users/1')
      .send({ nombre: 'Updated User' })
      .expect(200);

    expect(response.body).toEqual(updatedUser);
  });

  it('should delete a user', async () => {
    const deletedUser = { _id: '1', email: 'test@example.com', nombre: 'Test User', eliminado: true };
    userController.DeleteUser.mockResolvedValue(deletedUser);

    const response = await request(app)
      .delete('/users/1')
      .expect(200);

    expect(response.body).toEqual(deletedUser);
  });
});
