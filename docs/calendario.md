# Calendário — Sistema Fazenda Bela Vista

Base de cálculo: 5–10h/semana (média 7,5h), a partir de 11/11/2026.

Isto **não** entrega o sistema completo até 31/12/2026. Entrega o sistema completo em ritmo part-time até algo entre **jun/2027 e set/2027**. Se "este ano" é inegociável, a seção final deste documento mostra o único jeito de chegar lá: cortar escopo, não comprimir prazo.

## Fase 1 — Backend core (11/11/2026 → 31/12/2026, ~50-70h)

Sem interface ainda — só API testável via Postman/scripts.

- Semana 1-2 (11/11 – 24/11): setup Django + Postgres, modelo `rebanho` (Animal, EventoVida, CicloReprodutivo)
- Semana 3-4 (25/11 – 08/12): modelo `financeiro` (Lançamento, Categoria) + `maquinas` (Máquina, Peça)
- Semana 5-6 (09/12 – 22/12): modelo `rh` + `obras` + permissões (Administrador/Peão)
- Semana 7 (23/12 – 31/12): ajustes, provavelmente mais curta por conta das festas — não conte essa semana como produtiva de verdade

**Entrega real até 31/12: backend funcionando, sem tela nenhuma.** Isso é trabalho de fundação, não é algo pra mostrar pro Gerci/Leonardo ainda.

## Fase 2 — Painel admin web (jan/2027 → mar/2027, ~60-100h)

- Telas substituindo cada aba da planilha (rebanho, financeiro, máquinas, RH, obras)
- Dashboard com os KPIs que já existem na planilha
- Esse é o primeiro ponto onde dá pra falar "Leonardo e Gerci já podem usar isso em vez da planilha"

**Marco: painel admin em uso real — meta realista fim de março/2027.**

## Fase 3 — App mobile offline-first (abr/2027 → jun/2027, ~100-150h)

- Maior risco do projeto: você nunca construiu app com sync offline antes
- Reserve as primeiras 2-3 semanas só pra prova de conceito de sincronização (gravar local, enfileirar, reenviar) antes de construir telas
- Upload de foto em fila separada

## Fase 4 — Deploy AWS + testes end-to-end (jun/2027 → jul/2027, ~30-50h)

- RDS, S3, deploy do backend, testes com Leonardo/Gerci usando de verdade
- Buffer pra bugs que só aparecem em uso real

**Meta de conclusão do sistema completo: julho/2027**, nesse ritmo de horas.

---

## Se "este ano" é inegociável: a única alternativa é cortar escopo, não prazo

Com 35–70h, o que cabe de verdade até 31/12 é **uma dessas opções**, não o sistema completo:

- **Opção A — Protótipo navegável do painel admin**, sem backend real por trás (dados mockados), só pra Gerci e Leonardo verem a direção e aprovarem antes de você construir de verdade. ~40-50h, viável.
- **Opção B — Backend funcionando + planilha continua sendo a interface** (o Django já valida e guarda os dados que hoje só ficam na planilha, mas ninguém usa tela nova ainda). ~50-70h, viável, mas pouco "mostrável".
- **Opção C — Aumentar as horas disponíveis** (contratar alguém pra tocar uma frente enquanto você toca outra, ou negociar menos horas no seu emprego atual temporariamente) — essa é a única forma real de aproximar o calendário completo de dezembro, porque o problema não é o plano, é a quantidade de horas.

Escolher entre essas opções é decisão sua e do Gerci/Leonardo — eu não vou fingir que dá pra ter as três coisas (escopo completo, qualidade, 7 semanas) ao mesmo tempo.
