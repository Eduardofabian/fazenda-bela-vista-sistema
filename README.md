# Sistema Fazenda Bela Vista

Backend Django para o sistema de gestão da Fazenda Bela Vista (Rondônia).
Ver arquitetura completa em `docs/arquitetura.md` e calendário em `docs/calendario.md`.

## Status (11/11/2026)

Fase 1 — backend core, em andamento. Sem interface ainda (nem admin panel, nem app mobile).

- [x] Scaffold Django + apps (contas, rebanho, financeiro, maquinas, rh, obras, sync)
- [x] Modelo `rebanho` (Animal, EventoVida, CicloReprodutivo, RegistroSaude)
- [ ] Modelo `financeiro`
- [ ] Modelo `maquinas` (+ Peças)
- [ ] Modelo `rh` + `obras`
- [ ] Permissões por papel (Administrador / Peão / Contador)

## Rodando localmente (requer Docker)

```bash
cp .env.example .env
docker compose up --build
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py createsuperuser
```

Admin em http://localhost:8000/admin/

## Decisões em aberto (ver docs/arquitetura.md seção 6)

- "controle de celular" e "tarifa/demanda" — itens das anotações do Gerci ainda não esclarecidos.
- Duração de gestação bovina (283 dias) é premissa a confirmar.
- Celular do peão: Android definido, ou ainda em aberto?
