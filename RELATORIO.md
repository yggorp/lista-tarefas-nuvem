# Relatório: testes automatizados e CI/CD

Disciplina: Desenvolvimento Web para a Nuvem, Unidade 3
Aluno: [SEU NOME]
Repositório: [LINK DO REPOSITÓRIO NO GITHUB]

## 1. Sistema escolhido

Lista de tarefas com API em Node.js (Express) e frontend estático. Permite criar, listar, concluir e excluir tarefas, com validação do título e um resumo de concluídas e pendentes.

## 2. Testes implementados

Foram escritos 14 testes automatizados com Jest e Supertest:

- **Unidade (backend), `tests/tasks.test.js`, 7 testes:** criação com id sequencial, remoção de espaços, título curto ou vazio, título longo, alternância de estado, remoção e resumo.
- **Integração, `tests/api.test.js`, 4 testes:** `/health`, fluxo completo (POST, GET, PATCH, DELETE), erro 400 para título inválido e 404 para id inexistente.
- **Frontend, `tests/frontend.test.js`, 3 testes:** escape de HTML, texto do resumo e renderização de tarefa concluída.

Execução local: `npm test` (resultado: 3 suítes e 14 testes aprovados).

## 3. Pipeline de CI/CD

Arquivo: `.github/workflows/ci-cd.yml` (GitHub Actions).

1. A cada push na `main`, o runner (VM temporária do GitHub) baixa o código, instala o Node.js 20 e as dependências (`npm ci`) e executa `npm test`.
2. Se os testes passam, o job de deploy chama o *Deploy Hook* do Render (a URL fica guardada em um Secret, `RENDER_DEPLOY_HOOK`), e o Render baixa o código novo e publica a aplicação. O deploy automático do próprio Render foi desligado, para que a publicação só aconteça depois dos testes.
3. Por fim, o pipeline chama `GET /health` na URL pública (Secret `APP_URL`) até a aplicação responder. Se não responder em 5 minutos, o job falha.

[INSERIR PRINT OU VÍDEO DO PIPELINE EXECUTADO COM SUCESSO, MOSTRANDO OS DOIS JOBS EM VERDE]

[INSERIR PRINT DA APLICAÇÃO ABERTA NA URL DO RENDER]

## 4. Dificuldades e soluções

[PREENCHA COM O QUE REALMENTE ACONTECEU. Exemplos de pontos que costumam dar problema: URL do Deploy Hook colada com espaço ou aspas no secret; `APP_URL` com barra no final; serviço gratuito do Render hibernando e demorando para responder; Auto-Deploy do Render ligado, o que faria a publicação acontecer antes dos testes.]

## 5. Conclusão

[2 ou 3 frases sobre o que a automação mudou no seu fluxo de trabalho.]
