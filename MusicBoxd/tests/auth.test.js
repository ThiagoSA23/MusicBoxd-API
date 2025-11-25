const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');

describe('Auth Controller', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/musicboxd-test');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await User.deleteMany({});
    });

    describe('POST /api/auth/register', () => {
        it('deve registrar um novo usuário com dados válidos', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    nome: 'João Silva',
                    email: 'joao@email.com',
                    senha: 'senha123456'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('token');
            expect(res.body.data.email).toBe('joao@email.com');
        });

        it('deve falhar com email vazio', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    nome: 'João Silva',
                    email: '',
                    senha: 'senha123456'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('deve falhar com senha menor que 6 caracteres', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    nome: 'João Silva',
                    email: 'joao@email.com',
                    senha: '123'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('deve falhar com email duplicado', async () => {
            await request(app)
                .post('/api/auth/register')
                .send({
                    nome: 'João Silva',
                    email: 'joao@email.com',
                    senha: 'senha123456'
                });

            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    nome: 'Maria Silva',
                    email: 'joao@email.com',
                    senha: 'senha123456'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('deve falhar com email inválido', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    nome: 'João Silva',
                    email: 'emailinvalido',
                    senha: 'senha123456'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            await request(app)
                .post('/api/auth/register')
                .send({
                    nome: 'João Silva',
                    email: 'joao@email.com',
                    senha: 'senha123456'
                });
        });

        it('deve fazer login com credenciais válidas', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'joao@email.com',
                    senha: 'senha123456'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('token');
        });

        it('deve falhar com senha incorreta', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'joao@email.com',
                    senha: 'senhaerrada'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it('deve falhar com email não registrado', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'naoexiste@email.com',
                    senha: 'senha123456'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it('deve falhar sem email ou senha', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'joao@email.com'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });
});
