// Regras de negócio da lista de tarefas (sem dependência de Express, fácil de testar).

class TaskStore {
  constructor() {
    this.tasks = [];
    this.nextId = 1;
  }

  list() {
    return this.tasks.map((t) => ({ ...t }));
  }

  create(title) {
    const clean = typeof title === 'string' ? title.trim() : '';
    if (clean.length < 3) {
      throw new Error('O título deve ter pelo menos 3 caracteres.');
    }
    if (clean.length > 120) {
      throw new Error('O título deve ter no máximo 120 caracteres.');
    }
    const task = { id: this.nextId++, title: clean, done: false };
    this.tasks.push(task);
    return { ...task };
  }

  toggle(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return null;
    task.done = !task.done;
    return { ...task };
  }

  remove(id) {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;
    this.tasks.splice(index, 1);
    return true;
  }

  summary() {
    const total = this.tasks.length;
    const done = this.tasks.filter((t) => t.done).length;
    return { total, done, pending: total - done };
  }
}

module.exports = { TaskStore };
