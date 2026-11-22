// Testes de integração: rotas HTTP + regras de negócio funcionando juntas.
const request = require('supertest');
const { createApp } = require('../src/app');
const { TaskStore } = require('../src/tasks');

describe('API de tarefas', () => {
  let app;
  beforeEach(() => {
    app = createApp(new TaskStore());
  });

  test('GET /health responde ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('fluxo completo: criar, listar, concluir, resumir e excluir', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'Configurar pipeline' });
    expect(created.status).toBe(201);
    const id = created.body.id;

    const list = await request(app).get('/api/tasks');
    expect(list.body).toHaveLength(1);

    const toggled = await request(app).patch(`/api/tasks/${id}/toggle`);
    expect(toggled.body.done).toBe(true);

    const summary = await request(app).get('/api/summary');
    expect(summary.body).toEqual({ total: 1, done: 1, pending: 0 });

    const del = await request(app).delete(`/api/tasks/${id}`);
    expect(del.status).toBe(204);
    expect((await request(app).get('/api/tasks')).body).toHaveLength(0);
  });

  test('POST com título inválido retorna 400 e mensagem', async () => {
    const res = await request(app).post('/api/tasks').send({ title: 'a' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/3 caracteres/);
  });

  test('toggle e delete de id inexistente retornam 404', async () => {
    expect((await request(app).patch('/api/tasks/42/toggle')).status).toBe(404);
    expect((await request(app).delete('/api/tasks/42')).status).toBe(404);
  });
});
