const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Music = require('../models/Music');
const User = require('../models/User');

describe('Music Controller', () => {
    let userId;
    let musicId;
    let token;

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/musicboxd-test');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await Music.deleteMany({});
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

    describe('POST /api/musicas', () => {
        it('deve criar uma música com dados válidos', async () => {
            const res = await request(app)
                .post('/api/musicas')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    titulo: 'Smells Like Teen Spirit',
                    artista: 'Nirvana',
                    genero: 'Rock',
                    duracao: 301,
                    dataLancamento: '1991-09-24'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.titulo).toBe('Smells Like Teen Spirit');
            musicId = res.body.data._id;
        });

        it('deve falhar sem token JWT', async () => {
            const res = await request(app)
                .post('/api/musicas')
                .send({
                    titulo: 'Smells Like Teen Spirit',
                    artista: 'Nirvana',
                    genero: 'Rock',
                    duracao: 301,
                    dataLancamento: '1991-09-24'
                });

            expect(res.statusCode).toBe(401);
        });

        it('deve falhar com duração inválida', async () => {
            const res = await request(app)
                .post('/api/musicas')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    titulo: 'Smells Like Teen Spirit',
                    artista: 'Nirvana',
                    genero: 'Rock',
                    duracao: -10,
                    dataLancamento: '1991-09-24'
                });

            expect(res.statusCode).toBe(400);
        });
    });

    describe('GET /api/musicas', () => {
        beforeEach(async () => {
            await request(app)
                .post('/api/musicas')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    titulo: 'Smells Like Teen Spirit',
                    artista: 'Nirvana',
                    genero: 'Rock',
                    duracao: 301,
                    dataLancamento: '1991-09-24'
                });
        });

        it('deve retornar lista de músicas', async () => {
            const res = await request(app).get('/api/musicas');

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });

        it('deve filtrar por gênero', async () => {
            const res = await request(app)
                .get('/api/musicas')
                .query({ genero: 'Rock' });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.length > 0).toBe(true);
        });
    });

    describe('GET /api/musicas/:id', () => {
        beforeEach(async () => {
            const musicRes = await request(app)
                .post('/api/musicas')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    titulo: 'Smells Like Teen Spirit',
                    artista: 'Nirvana',
                    genero: 'Rock',
                    duracao: 301,
                    dataLancamento: '1991-09-24'
                });

            musicId = musicRes.body.data._id;
        });

        it('deve retornar uma música por ID', async () => {
            const res = await request(app).get(`/api/musicas/${musicId}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data.titulo).toBe('Smells Like Teen Spirit');
        });

        it('deve retornar 404 para ID inexistente', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app).get(`/api/musicas/${fakeId}`);

            expect(res.statusCode).toBe(404);
        });
    });

    describe('PUT /api/musicas/:id', () => {
        beforeEach(async () => {
            const musicRes = await request(app)
                .post('/api/musicas')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    titulo: 'Smells Like Teen Spirit',
                    artista: 'Nirvana',
                    genero: 'Rock',
                    duracao: 301,
                    dataLancamento: '1991-09-24'
                });

            musicId = musicRes.body.data._id;
        });

        it('deve atualizar uma música', async () => {
            const res = await request(app)
                .put(`/api/musicas/${musicId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    titulo: 'Smells Like Teen Spirit (Remaster)',
                    artista: 'Nirvana',
                    genero: 'Rock',
                    duracao: 310,
                    dataLancamento: '1991-09-24'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.duracao).toBe(310);
        });
    });

    describe('DELETE /api/musicas/:id', () => {
        beforeEach(async () => {
            const musicRes = await request(app)
                .post('/api/musicas')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    titulo: 'Smells Like Teen Spirit',
                    artista: 'Nirvana',
                    genero: 'Rock',
                    duracao: 301,
                    dataLancamento: '1991-09-24'
                });

            musicId = musicRes.body.data._id;
        });

        it('deve deletar uma música', async () => {
            const res = await request(app)
                .delete(`/api/musicas/${musicId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
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
                .delete(`/api/musicas/${musicId}`)
                .set('Authorization', `Bearer ${registerRes.body.data.token}`);

            expect(res.statusCode).toBe(403);
        });
    });
});
