// Testes simples do frontend: funções puras de renderização.
const { escapeHtml, formatSummary, renderTask } = require('../public/utils');

describe('utils do frontend', () => {
  test('escapeHtml neutraliza tags e aspas', () => {
    expect(escapeHtml('<script>alert("x")</script>')).toBe(
      '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;'
    );
  });

  test('formatSummary monta o texto do resumo', () => {
    expect(formatSummary({ total: 3, done: 1, pending: 2 })).toBe(
      '1 de 3 concluídas (2 pendentes)'
    );
  });

  test('renderTask marca tarefas concluídas e escapa o título', () => {
    const html = renderTask({ id: 7, title: '<b>Teste</b>', done: true });
    expect(html).toContain('class="task done"');
    expect(html).toContain('data-id="7"');
    expect(html).toContain('&lt;b&gt;Teste&lt;/b&gt;');
    expect(html).toContain('Desfazer');
  });
});
