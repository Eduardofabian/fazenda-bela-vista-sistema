# Painel Admin — Fazenda Bela Vista

Next.js (App Router, JavaScript puro, Tailwind) consumindo a API Django em `../backend`.

## Setup

```bash
npm install
```

Crie `.env.local` na raiz deste `frontend/` (não vem no repo, é local) com:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Depois:

```bash
npm run dev
```

Abre em http://localhost:3000. Precisa do backend rodando (`docker compose up` na raiz do projeto) com `CORS_ALLOWED_ORIGINS=http://localhost:3000` no `.env` do backend (já é o default).

## O que já existe

- `/login` — autenticação por token (POST `/api/auth-token/`), guardado em `localStorage`.
- `/animais` — módulo completo (listar, criar) do rebanho. **Serve de padrão pra replicar nos próximos módulos** (financeiro, máquinas, rh, obras) — ver `TAREFA02_FRONTEND.MD`.
- `lib/api.js` — cliente HTTP com token, usar como base pros próximos módulos.
- `components/RequireAuth.js` — guarda de autenticação (redireciona pra `/login` sem token) + navegação.

## Status

Fase 2 do calendário (`docs/calendario.md`), em andamento. Só o módulo Rebanho está completo; os outros seguem o mesmo padrão.
