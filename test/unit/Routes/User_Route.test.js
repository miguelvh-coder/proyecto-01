const { GetUserById, GetUsers, CreateUser, UpdateUser, DeleteUser } = require('../../../src/user/user.controller');
const request = require('supertest');
const app = require('../../../app');
const User = require('../../../src/user/user.model');

jest.mock('../../../src/user/user.controller');


//  3/3 pruebas unitarias de las funciones del usuario  //




describe('Usuario unit Controller', () => {

    test('debería devolver un usuario por ID', async () => {
        const test_body = { _id: '1', nombre: 'Test Usuario', eliminado: false };
        GetUserById.mockResolvedValue(test_body);
    
        const response = await request(app)
            .get('/:id')
            .send(test_body)
            .set("Accept", "aplication/json");

        console.log(response.body);
    
        expect(response.status).toBe(200);
        expect(response.body).toEqual(test_body);
    });

});