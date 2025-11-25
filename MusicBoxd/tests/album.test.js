const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Album = require('../models/Album');
const User = require('../models/User');

describe('Album Controller', () => {
    let userId;
    let albumId;
    let token;

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/musicboxd-test');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await Album.deleteMany({});
        await User.deleteMany({});

        const registerRes = await request(app)
            .post('/api/auth/register')
            .send({
                nome: 'João Silva',
                email: 'joao@email.com',
                senha: 'senha123456'
            });

        userId = registerRes.body.data.id;
        token = registerRes.body.data.token;
    });

    describe('POST /api/albums', () => {
        it('deve criar um álbum com dados válidos', async () => {
            const res = await request(app)
                .post('/api/albums')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    titulo: 'Nevermind',
                    artista: 'Nirvana',
                    genero: 'Rock',
                    dataLancamento: '1991-09-24'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.titulo).toBe('Nevermind');
            albumId = res.body.data._id;
        });

        it('deve falhar sem token JWT', async () => {
            const res = await request(app)
                .post('/api/albums')
                .send({
                    titulo: 'Nevermind',
                    artista: 'Nirvana',
                    genero: 'Rock',
                    dataLancamento: '1991-09-24'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it('deve falhar com gênero inválido', async () => {
            const res = await request(app)
                .post('/api/albums')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    titulo: 'Nevermind',
                    artista: 'Nirvana',
                    genero: 'GeneroInvalido',
                    dataLancamento: '1991-09-24'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('deve falhar sem título', async () => {
            const res = await request(app)
                .post('/api/albums')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    artista: 'Nirvana',
                    genero: 'Rock',
                    dataLancamento: '1991-09-24'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe('GET /api/albums', () => {
        beforeEach(async () => {
            await request(app)
                .post('/api/albums')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    titulo: 'Nevermind',
                    artista: 'Nirvana',
                    genero: 'Rock',
                    dataLancamento: '1991-09-24'
                });
        });

        it('deve retornar lista de álbuns', async () => {
            const res = await request(app).get('/api/albums');

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    describe('GET /api/albums/:id', () => {
        beforeEach(async () => {
            const albumRes = await request(app)
                .post('/api/albums')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    titulo: 'Nevermind',
                    artista: 'Nirvana',
                    genero: 'Rock',
                    dataLancamento: '1991-09-24'
                });

            albumId = albumRes.body.data._id;
        });

        it('deve retornar um álbum por ID', async () => {
            const res = await request(app).get(`/api/albums/${albumId}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.titulo).toBe('Nevermind');
        });

        it('deve retornar 404 para ID inexistente', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app).get(`/api/albums/${fakeId}`);

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });

    describe('PUT /api/albums/:id', () => {
        beforeEach(async () => {
            const albumRes = await request(app)
                .post('/api/albums')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    titulo: 'Nevermind',
                    artista: 'Nirvana',
                    genero: 'Rock',
                    dataLancamento: '1991-09-24'
                });

            albumId = albumRes.body.data._id;
        });

        it('deve atualizar um álbum', async () => {
            const res = await request(app)
                .put(`/api/albums/${albumId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    titulo: 'Nevermind (Remastered)',
                    artista: 'Nirvana',
                    genero: 'Rock',
                    dataLancamento: '1991-09-24'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.titulo).toBe('Nevermind (Remastered)');
        });

        it('deve falhar ao atualizar sem autorização', async () => {
            const registerRes = await request(app)
                .post('/api/auth/register')
                .send({
                    nome: 'Maria',
                    email: 'maria@email.com',
                    senha: 'senha123456'
                });

            const res = await request(app)
                .put(`/api/albums/${albumId}`)
                .set('Authorization', `Bearer ${registerRes.body.data.token}`)
                .send({
                    titulo: 'Nevermind (Remastered)',
                    artista: 'Nirvana',
                    genero: 'Rock',
                    dataLancamento: '1991-09-24'
                });

            expect(res.statusCode).toBe(403);
        });
    });

    describe('DELETE /api/albums/:id', () => {
        beforeEach(async () => {
            const albumRes = await request(app)
                .post('/api/albums')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    titulo: 'Nevermind',
                    artista: 'Nirvana',
                    genero: 'Rock',
                    dataLancamento: '1991-09-24'
                });

            albumId = albumRes.body.data._id;
        });

        it('deve deletar um álbum', async () => {
            const res = await request(app)
                .delete(`/api/albums/${albumId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);

            const checkRes = await request(app).get(`/api/albums/${albumId}`);
            expect(checkRes.statusCode).toBe(404);
        });

        it('deve falhar ao deletar sem autorização', async () => {
            const registerRes = await request(app)
                .post('/api/auth/register')
                .send({
                    nome: 'Maria',
                    email: 'maria@email.com',
                    senha: 'senha123456'
                });

            const res = await request(app)
                .delete(`/api/albums/${albumId}`)
                .set('Authorization', `Bearer ${registerRes.body.data.token}`);

            expect(res.statusCode).toBe(403);
        });
    });
});
