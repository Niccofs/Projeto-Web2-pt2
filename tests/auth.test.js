const request = require('supertest');
const app = require('../api/index');
const User = require('../models/user');
const mongoose = require('mongoose');
const { MONGODB_URL } = require('../config');

beforeAll(async () => {
  await mongoose.connect(MONGODB_URL);
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('Testes de Autenticação', () => {
  it('deve cadastrar um novo usuário', async () => {
    const res = await request(app)
      .post('/api/cadastrar')
      .send({
        nome: 'Usuário Teste',
        email: 'teste@teste.com',
        senha: '123456'
      });
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('mensagem', 'Usuário cadastrado com sucesso');
  });

  it('deve fazer login com sucesso', async () => {
    // Primeiro cadastra o usuário
    await request(app)
      .post('/api/cadastrar')
      .send({
        nome: 'Usuário Teste',
        email: 'teste@teste.com',
        senha: '123456'
      });

    // Tenta fazer login
    const res = await request(app)
      .post('/api/logar')
      .send({
        email: 'teste@teste.com',
        senha: '123456'
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});