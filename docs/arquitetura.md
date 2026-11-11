# Arquitetura — Sistema Fazenda Bela Vista

Status: **nenhuma linha de código ainda.** Este documento é a decisão de arquitetura antes de começar a construir, não uma descrição do que já existe. O que existe hoje é a planilha (`Fazenda Bela Vista - Controle v2.xlsx`), que continua em uso enquanto o sistema não fica pronto.

## 1. Dois produtos, não um

A reunião pediu "um app", mas na prática são dois produtos com engenharia bem diferente:

| | App do Peão | Painel Admin (Leonardo/Gerci) |
|---|---|---|
| Plataforma | Mobile nativo (Android, provavelmente — confirmar se tem iPhone na equipe) | Web |
| Conectividade | **Precisa funcionar sem sinal** (decisão já tomada) | Sempre com internet |
| Complexidade de uso | Mínima — 4 a 5 botões | Painel completo, várias telas |
| Usuários | 1 (o peão) | 2 (Leonardo e Gerci, mesmo nível de permissão) |

Tratar os dois como a mesma coisa tecnicamente é o erro mais comum nesse tipo de projeto, e é o que mais atrasa entrega.

## 2. Stack proposta

- **Backend/API:** Django + Django REST Framework, Python (você já trabalha com Python no dia a dia — isso pesa a favor).
- **Banco de dados:** PostgreSQL (lida bem com dados relacionais do rebanho/financeiro e escala sem drama).
- **Armazenamento de fotos:** S3 (ou equivalente) — não guardar foto no banco.
- **App do peão:** Flutter ou React Native, com banco local (SQLite) no celular + fila de sincronização.
- **Painel admin:** aplicação web separada (pode ser Django com templates server-side pra ir mais rápido, ou um frontend React/Next.js consumindo a mesma API — depende de quanto polimento visual vocês querem).
- **Hospedagem:** AWS (RDS pro Postgres, S3 pras fotos, um serviço gerenciado tipo Elastic Beanstalk ou App Runner pro Django — evita você administrar servidor na mão).

### Por que isso, e o que isso custa

- **App nativo (Flutter/RN) é a parte certa, mas é a mais cara de construir.** Um PWA simples não resolve o offline-first de verdade — service worker de fila de escrita offline é frágil em Android variado, e é exatamente onde o app do peão não pode falhar. Isso significa: se você nunca fez app mobile nativo, essa é a parte do projeto com maior risco técnico e curva de aprendizado, não o backend Django (que já é terreno conhecido pra você).
- **Instalação do app do peão via APK direto** (sem passar pela Play Store) evita processo de revisão de loja — mas qualquer atualização futura precisa ser manual (reinstalar o APK) ou você constrói um updater simples. Pra 1 usuário isso é aceitável, mas é uma decisão consciente, não um detalhe.

## 3. Módulos (bounded contexts no Django)

- `contas` — usuários e papéis (Administrador, Peão)
- `rebanho` — Animal, EventoVida (nascimento/morte), CicloReprodutivo, Vacina, Doença/Acompanhamento
- `financeiro` — Lançamento, Categoria, Fechamento (relatório consolidado)
- `maquinas` — Máquina, Peça, vínculo Máquina↔Peça, ControleDeHoras
- `rh` — Funcionário, DiaTrabalhado
- `obras` — Obra, LançamentoObra
- `sync` — fila de eventos pendentes vindos do app offline, com idempotência (evitar duplicar lançamento se o celular reenviar)

## 4. Fluxo de sincronização (o coração técnico do projeto)

1. Peão lança "vaca 400 morreu" no celular. App grava local na hora, com um ID próprio (UUID), mesmo sem sinal.
2. Lançamento fica marcado como "pendente de envio".
3. Quando o celular pega sinal (na sede, ou em qualquer ponto com 4G), o app dispara os lançamentos pendentes em lote pro backend.
4. Backend usa o UUID pra não duplicar se o mesmo lançamento for reenviado (ex: internet caiu no meio do envio).
5. Foto vai numa fila separada de upload — não trava o lançamento principal se a foto demorar mais pra subir.

## 5. Permissões

- Leonardo e Gerci: mesmo nível, acesso total ao painel admin (decisão já confirmada).
- Peão: só lança nascimento/morte + foto. Vacina e dia trabalhado continuam sendo aviso verbal pro Gerci lançar — ou seja, a precisão desses dois dados depende da disciplina do Gerci, exatamente como na planilha. O app não resolve esse ponto, só documenta o lançamento.

## 6. Pontos em aberto — não assumi nada aqui, preciso de resposta

- Nas anotações manuscritas do Gerci (`Projeto gerci_...pdf`) aparecem dois itens que não consegui ler com confiança: **"controle de celular"** e algo como **"tarifa / demanda"**. Não arrisquei adivinhar o que significam — preciso que você (ou o Gerci) me explique antes de eu considerar isso no escopo.
- "Fechamento" ficou definido como relatório consolidado (não trava lançamento) — bom, isso simplifica o backend. Só uma ressalva: se no futuro vocês quiserem auditoria financeira formal, isso muda esse módulo depois.
- Não ficou claro se o celular do peão é Android, iOS, ou ainda não definido — isso decide se dá pra simplificar pra Android-only (mais barato) ou se precisa suportar os dois.

## 7. Ordem sugerida de construção

1. Backend Django + Postgres com os módulos core (rebanho, financeiro, máquinas) — sem interface ainda, só API testável.
2. Painel admin web (Leonardo/Gerci) — aqui já dá pra usar de verdade, substituindo parte da planilha.
3. App mobile do peão com sync offline — a parte de maior risco, deixada pra depois do backend estar validado.
4. Deploy em produção na AWS.

## 8. Risco que preciso que você reconheça antes de seguir

Esse projeto cresceu de "melhorar uma planilha" para: planilha + backend Django + painel web + app mobile offline-first + upload de foto + sincronização + 7 módulos de domínio diferentes. Isso não é mais projeto de fim de semana — é um sistema de verdade, com meses de trabalho se for 1 pessoa construindo. Vale alinhar expectativa de prazo e orçamento com o Gerci e o Leonardo antes de prometer uma data, porque a lista de requisitos da reunião, se levada a sério (e deveria ser), é grande.
