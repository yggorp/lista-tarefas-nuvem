// Testes de unidade do backend (regras de negócio).
const { TaskStore } = require('../src/tasks');

describe('TaskStore', () => {
  let store;
  beforeEach(() => {
    store = new TaskStore();
  });

  test('cria tarefa com id sequencial e done=false', () => {
    const a = store.create('Estudar CI/CD');
    const b = store.create('Fazer deploy');
    expect(a).toEqual({ id: 1, title: 'Estudar CI/CD', done: false });
    expect(b.id).toBe(2);
  });

  test('remove espaços do título', () => {
    expect(store.create('  Ler material  ').title).toBe('Ler material');
  });

  test('rejeita título curto, vazio ou não textual', () => {
    expect(() => store.create('ab')).toThrow('pelo menos 3');
    expect(() => store.create('')).toThrow();
    expect(() => store.create(undefined)).toThrow();
  });

  test('rejeita título longo demais', () => {
    expect(() => store.create('x'.repeat(121))).toThrow('no máximo 120');
  });

  test('alterna o estado de conclusão', () => {
    const t = store.create('Escrever relatório');
    expect(store.toggle(t.id).done).toBe(true);
    expect(store.toggle(t.id).done).toBe(false);
    expect(store.toggle(999)).toBeNull();
  });

  test('remove tarefa existente e informa quando não existe', () => {
    const t = store.create('Tarefa temporária');
    expect(store.remove(t.id)).toBe(true);
    expect(store.remove(t.id)).toBe(false);
    expect(store.list()).toHaveLength(0);
  });

  test('calcula o resumo', () => {
    const a = store.create('Primeira tarefa');
    store.create('Segunda tarefa');
    store.toggle(a.id);
    expect(store.summary()).toEqual({ total: 2, done: 1, pending: 1 });
  });
});
