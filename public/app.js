const lista = document.getElementById('lista');
const resumo = document.getElementById('resumo');
const erro = document.getElementById('erro');

async function carregar() {
  const [tarefas, sum] = await Promise.all([
    fetch('/api/tasks').then((r) => r.json()),
    fetch('/api/summary').then((r) => r.json()),
  ]);
  lista.innerHTML = tarefas.map(renderTask).join('');
  resumo.textContent = formatSummary(sum);
}

document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = document.getElementById('titulo');
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: input.value }),
  });
  if (!res.ok) {
    erro.textContent = (await res.json()).error;
    return;
  }
  erro.textContent = '';
  input.value = '';
  carregar();
});

lista.addEventListener('click', async (e) => {
  const action = e.target.dataset.action;
  if (!action) return;
  const id = e.target.closest('li').dataset.id;
  if (action === 'toggle') await fetch(`/api/tasks/${id}/toggle`, { method: 'PATCH' });
  if (action === 'remove') await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
  carregar();
});

carregar();
