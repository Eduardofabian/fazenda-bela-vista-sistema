"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import RequireAuth from "@/components/RequireAuth";
import CampoValor from "@/components/CampoValor";

const TIPO_OPCOES = ["RECEITA", "DESPESA"];
const CATEGORIA_OPCOES = [
  "DIESEL_TRATORES",
  "DIESEL_CAMIONETES",
  "INSUMO_SAL",
  "INSUMO_VACINAS",
  "CERCAS_OBRAS",
  "NOTAS_FISCAIS",
  "VENDA_GADO",
  "OUTROS",
];
const FORMA_PAGAMENTO_OPCOES = [
  "DINHEIRO",
  "PIX",
  "TRANSFERENCIA",
  "BOLETO",
  "CARTAO",
  "CHEQUE",
  "OUTROS",
];

function LancamentosConteudo() {
  const searchParams = useSearchParams();
  const obraDaUrl = searchParams.get("obra") || "";

  const [lancamentos, setLancamentos] = useState([]);
  const [maquinas, setMaquinas] = useState([]);
  const [obras, setObras] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  // Vindo do link "ver gastos dessa obra" em /obras — filtra direto, sem
  // aparecer como dropdown (é um link de atalho, não um filtro de tela).
  const [filtroObra] = useState(obraDaUrl);

  const [form, setForm] = useState({
    data: "",
    categoria: "OUTROS",
    tipo: "DESPESA",
    descricao: "",
    fornecedor: "",
    valor: "",
    forma_pagamento: "",
    maquina: "",
    obra: "",
  });

  // Fechamento (relatório consolidado)
  const [fechInicio, setFechInicio] = useState("");
  const [fechFim, setFechFim] = useState("");
  const [fechamento, setFechamento] = useState(null);
  const [fechErro, setFechErro] = useState("");

  async function carregar() {
    setCarregando(true);
    setErro("");
    try {
      const params = new URLSearchParams();
      if (filtroTipo) params.set("tipo", filtroTipo);
      if (filtroCategoria) params.set("categoria", filtroCategoria);
      if (filtroObra) params.set("obra", filtroObra);
      const qs = params.toString() ? `?${params.toString()}` : "";
      const data = await api.get(`/api/financeiro/lancamentos/${qs}`);
      setLancamentos(data.results ?? data);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  async function carregarOpcoes() {
    try {
      const [m, o] = await Promise.all([
        api.get("/api/maquinas/maquinas/"),
        api.get("/api/obras/obras/"),
      ]);
      setMaquinas(m.results ?? m);
      setObras(o.results ?? o);
    } catch (err) {
      // não trava a tela principal por isso — só os selects ficam vazios
      console.error(err);
    }
  }

  useEffect(() => {
    carregarOpcoes();
  }, []);

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroTipo, filtroCategoria, filtroObra]);

  async function handleCriar(e) {
    e.preventDefault();
    setSalvando(true);
    setErro("");
    try {
      const payload = {
        ...form,
        maquina: form.maquina || null,
        obra: form.obra || null,
        forma_pagamento: form.forma_pagamento || "",
      };
      await api.post("/api/financeiro/lancamentos/", payload);
      setMostrarForm(false);
      setForm({ ...form, descricao: "", fornecedor: "", valor: "" });
      await carregar();
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvando(false);
    }
  }

  async function handleFechamento(e) {
    e.preventDefault();
    setFechErro("");
    setFechamento(null);
    try {
      const data = await api.get(
        `/api/financeiro/lancamentos/fechamento/?inicio=${fechInicio}&fim=${fechFim}`
      );
      setFechamento(data);
    } catch (err) {
      setFechErro(err.message);
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-lg font-semibold text-zinc-900">Financeiro — Lançamentos</h1>
        <button
          onClick={() => setMostrarForm((v) => !v)}
          className="rounded bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-800"
        >
          {mostrarForm ? "Cancelar" : "+ Novo lançamento"}
        </button>
      </div>

      {filtroObra && (
        <p className="mb-4 rounded bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Mostrando só os gastos da obra selecionada.{" "}
          <a href="/financeiro" className="underline">Ver todos os lançamentos</a>
        </p>
      )}

      {erro && <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>}

      {mostrarForm && (
        <form
          onSubmit={handleCriar}
          className="mb-6 grid grid-cols-1 gap-3 rounded border border-zinc-200 bg-white p-4 sm:grid-cols-2 md:grid-cols-3"
        >
          <div>
            <label className="block text-xs font-medium text-zinc-600">Data</label>
            <input
              type="date"
              required
              className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
              value={form.data}
              onChange={(e) => setForm({ ...form, data: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600">Tipo</label>
            <select
              className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            >
              {TIPO_OPCOES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600">Categoria</label>
            <select
              className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
            >
              {CATEGORIA_OPCOES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-zinc-600">Descrição</label>
            <input
              required
              className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600">Valor</label>
            <CampoValor
              required
              value={form.valor}
              onChange={(valor) => setForm({ ...form, valor })}
              className="w-full py-1.5 text-sm outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600">Fornecedor</label>
            <input
              className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
              value={form.fornecedor}
              onChange={(e) => setForm({ ...form, fornecedor: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600">Forma de pagamento</label>
            <select
              className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
              value={form.forma_pagamento}
              onChange={(e) => setForm({ ...form, forma_pagamento: e.target.value })}
            >
              <option value="">—</option>
              {FORMA_PAGAMENTO_OPCOES.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600">Máquina (opcional)</label>
            <select
              className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
              value={form.maquina}
              onChange={(e) => setForm({ ...form, maquina: e.target.value })}
            >
              <option value="">—</option>
              {maquinas.map((m) => (
                <option key={m.id} value={m.id}>{m.nome}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600">
              Obra (opcional — só categoria Cercas/Obras)
            </label>
            <select
              className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
              value={form.obra}
              onChange={(e) => setForm({ ...form, obra: e.target.value })}
            >
              <option value="">—</option>
              {obras.map((o) => (
                <option key={o.id} value={o.id}>{o.descricao}</option>
              ))}
            </select>
          </div>
          <div className="col-span-3">
            <button
              type="submit"
              disabled={salvando}
              className="rounded bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
            >
              {salvando ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      )}

      <div className="mb-4 flex flex-wrap gap-3">
        <select
          className="rounded border border-zinc-300 px-2 py-1.5 text-sm"
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
        >
          <option value="">Todos os tipos</option>
          {TIPO_OPCOES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select
          className="rounded border border-zinc-300 px-2 py-1.5 text-sm"
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
        >
          <option value="">Todas as categorias</option>
          {CATEGORIA_OPCOES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {carregando ? (
        <p className="text-sm text-zinc-500">Carregando...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left text-zinc-500">
                <th className="py-2 pr-4">Data</th>
                <th className="py-2 pr-4">Tipo</th>
                <th className="py-2 pr-4">Categoria</th>
                <th className="py-2 pr-4">Descrição</th>
                <th className="py-2 pr-4">Valor</th>
                <th className="py-2 pr-4">Forma</th>
              </tr>
            </thead>
            <tbody>
              {lancamentos.map((l) => (
                <tr key={l.id} className="border-b border-zinc-100">
                  <td className="py-2 pr-4">{l.data}</td>
                  <td className="py-2 pr-4">{l.tipo}</td>
                  <td className="py-2 pr-4">{l.categoria}</td>
                  <td className="py-2 pr-4">{l.descricao}</td>
                  <td className="py-2 pr-4">R$ {l.valor}</td>
                  <td className="py-2 pr-4 text-zinc-500">{l.forma_pagamento}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-10 rounded border border-zinc-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-zinc-900">
          Fechamento (soma por tipo/categoria num período)
        </h2>
        <form onSubmit={handleFechamento} className="mb-4 flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-600">Início</label>
            <input
              type="date"
              required
              className="rounded border border-zinc-300 px-2 py-1.5 text-sm"
              value={fechInicio}
              onChange={(e) => setFechInicio(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600">Fim</label>
            <input
              type="date"
              required
              className="rounded border border-zinc-300 px-2 py-1.5 text-sm"
              value={fechFim}
              onChange={(e) => setFechFim(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="rounded bg-zinc-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-900"
          >
            Calcular
          </button>
        </form>

        {fechErro && <p className="text-sm text-red-700">{fechErro}</p>}

        {fechamento && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-zinc-500">
                  <th className="py-1 pr-4">Tipo</th>
                  <th className="py-1 pr-4">Categoria</th>
                  <th className="py-1 pr-4">Total</th>
                </tr>
              </thead>
              <tbody>
                {fechamento.map((row, i) => (
                  <tr key={i} className="border-b border-zinc-100">
                    <td className="py-1 pr-4">{row.tipo}</td>
                    <td className="py-1 pr-4">{row.categoria}</td>
                    <td className="py-1 pr-4">R$ {row.total}</td>
                  </tr>
                ))}
                {fechamento.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-2 text-zinc-500">
                      Nenhum lançamento nesse período.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FinanceiroPage() {
  return (
    <RequireAuth>
      <LancamentosConteudo />
    </RequireAuth>
  );
}
