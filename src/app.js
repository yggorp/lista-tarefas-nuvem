const path = require('path');
const express = require('express');
const { TaskStore } = require('./tasks');

function createApp(store = new TaskStore()) {
  const app = express();
  app.use(express.json());
  app.use(express.static(path.join(__dirname, '..', 'public')));

  // Rota usada por monitoramento (uptime) e pelo pipeline após o deploy.
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
  });

  app.get('/api/tasks', (req, res) => {
    res.json(store.list());
  });

  app.get('/api/summary', (req, res) => {
    res.json(store.summary());
  });

  app.post('/api/tasks', (req, res) => {
    try {
      const task = store.create(req.body && req.body.title);
      res.status(201).json(task);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  app.patch('/api/tasks/:id/toggle', (req, res) => {
    const task = store.toggle(Number(req.params.id));
    if (!task) return res.status(404).json({ error: 'Tarefa não encontrada.' });
    res.json(task);
  });

  app.delete('/api/tasks/:id', (req, res) => {
    const ok = store.remove(Number(req.params.id));
    if (!ok) return res.status(404).json({ error: 'Tarefa não encontrada.' });
    res.status(204).end();
  });

  return app;
}

module.exports = { createApp };
