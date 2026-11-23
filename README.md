# Lista de tarefas com CI/CD

Aplicação web simples (API Express + frontend estático) criada para a Unidade 3 de Desenvolvimento Web para a Nuvem. O foco é o pipeline: a cada `git push` na branch `main`, o GitHub Actions executa os testes e, se todos passarem, dispara o deploy automático no Render.

Aplicação publicada: https://lista-tarefas-nuvem-hb5r.onrender.com

## Funcionalidades

- Criar, listar, concluir e excluir tarefas.
- Validação do título (de 3 a 120 caracteres).
- Resumo de tarefas concluídas e pendentes.
- Rota `GET /health` para monitoramento de uptime.

## Estrutura

```
src/tasks.js        regras de negócio
src/app.js          rotas HTTP (Express)
src/server.js       inicialização do servidor
public/             frontend (HTML, JS)
tests/              testes de unidade, integração e frontend (Jest + Supertest)
.github/workflows/  pipeline de CI/CD
```

## Executar localmente

Requisitos: Node.js 20 ou superior.

```bash
npm install
npm start          # http://localhost:3000
npm test           # executa os testes
```

## Testes automatizados

| Arquivo | Tipo | O que verifica |
| --- | --- | --- |
| `tests/tasks.test.js` | Unidade (backend) | Regras de negócio: criação, validação, toggle, remoção e resumo |
| `tests/api.test.js` | Integração | Rotas HTTP do fluxo completo, códigos 201, 204, 400 e 404 |
| `tests/frontend.test.js` | Frontend | Funções puras de renderização e escape de HTML |

## Pipeline (`.github/workflows/ci-cd.yml`)

1. **test**: baixa o código, instala o Node.js 20, roda `npm ci` e `npm test`.
2. **deploy**: depende do job `test` e só roda em push na `main`. Chama o *Deploy Hook* do Render, que baixa a versão nova do repositório e a publica. Em seguida, o pipeline consulta `/health` até a aplicação responder (até 5 minutos). Se não responder, o job falha.

### Secrets necessários (Settings > Secrets and variables > Actions)

| Secret | Conteúdo |
| --- | --- |
| `RENDER_DEPLOY_HOOK` | URL do Deploy Hook do serviço no Render (Settings > Deploy Hook) |
| `APP_URL` | URL pública do serviço, por exemplo `https://lista-tarefas.onrender.com`, sem barra no final |

## Configuração do Render

1. Em render.com, entre com a conta do GitHub e clique em **New > Web Service**, escolhendo este repositório.
2. Preencha: **Runtime** Node, **Build Command** `npm ci --omit=dev`, **Start Command** `npm start`, **Instance Type** Free.
3. Em **Advanced**, defina **Health Check Path** como `/health` e **Auto-Deploy** como **No**, para que o deploy só aconteça pelo pipeline, depois dos testes.
4. Depois de criado, copie a URL do serviço e, em **Settings > Deploy Hook**, a URL do hook. Cadastre as duas como secrets no GitHub.
5. O plano gratuito hiberna o serviço depois de um período sem uso, então a primeira requisição pode demorar cerca de um minuto.
