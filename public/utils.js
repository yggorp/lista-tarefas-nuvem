// Funções puras do frontend (testáveis sem navegador).

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatSummary(s) {
  return `${s.done} de ${s.total} concluídas (${s.pending} pendentes)`;
}

function renderTask(task) {
  const cls = task.done ? 'task done' : 'task';
  const mark = task.done ? 'Desfazer' : 'Concluir';
  return (
    `<li class="${cls}" data-id="${task.id}">` +
    `<span>${escapeHtml(task.title)}</span>` +
    `<button data-action="toggle">${mark}</button>` +
    `<button data-action="remove">Excluir</button>` +
    `</li>`
  );
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { escapeHtml, formatSummary, renderTask };
}
