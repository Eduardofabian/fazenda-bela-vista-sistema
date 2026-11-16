"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import RequireAuth from "@/components/RequireAuth";

const SEXO_OPCOES = [
  { value: "FEMEA", label: "Fêmea" },
  { value: "MACHO", label: "Macho" },
];
const CATEGORIA_OPCOES = [
  "VACA",
  "NOVILHA",
  "NOVILHO",
  "BOI",
  "TOURO",
  "BEZERRO",
];
const ORIGEM_OPCOES = ["NASCIMENTO", "COMPRA", "INVENTARIO_INICIAL"];

function AnimaisConteudo() {
  const [animais, setAnimais] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [form, setForm] = useState({
    numero_brinco: "",
    sexo: "FEMEA",
    categoria: "VACA",
    origem: "NASCIMENTO",
    data_nascimento_ou_entrada: "",
    observacoes: "",
  });

  async function carregar() {
    setCarregando(true);
    setErro("");
    try {
      const data = await api.get("/api/rebanho/animais/");
      setAnimais(data.results ?? data);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function handleCriar(e) {
    e.preventDefault();
    setSalvando(true);
    setErro("");
    try {
      const payload = { ...form, data_nascimento_ou_entrada: form.data_nascimento_ou_entrada || null };
      await api.post("/api/rebanho/animais/", payload);
      setMostrarForm(false);
      setForm({ ...form, numero_brinco: "", observacoes: "" });
      await carregar();
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-lg font-semibold text-zinc-900">Rebanho — Animais</h1>
        <button
          onClick={() => setMostrarForm((v) => !v)}
          className="rounded bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-800"
        >
          {mostrarForm ? "Cancelar" : "+ Novo animal"}
        </button>
      </div>

      {erro && (
        <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>
      )}

      {mostrarForm && (
        <form
          onSubmit={handleCriar}
          className="mb-6 grid grid-cols-1 gap-3 rounded border border-zinc-200 bg-white p-4 sm:grid-cols-2"
        >
          <div>
            <label className="block text-xs font-medium text-zinc-600">Número do brinco</label>
            <input
              className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
              value={form.numero_brinco}
              onChange={(e) => setForm({ ...form, numero_brinco: e.target.value })}
              placeholder="ex: 400 (ou deixe vazio pra S/N)"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600">Sexo</label>
            <select
              className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
              value={form.sexo}
              onChange={(e) => setForm({ ...form, sexo: e.target.value })}
            >
              {SEXO_OPCOES.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
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
          <div>
            <label className="block text-xs font-medium text-zinc-600">Origem</label>
            <select
              className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
              value={form.origem}
              onChange={(e) => setForm({ ...form, origem: e.target.value })}
            >
              {ORIGEM_OPCOES.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600">Data nascimento/entrada</label>
            <input
              type="date"
              className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
              value={form.data_nascimento_ou_entrada}
              onChange={(e) => setForm({ ...form, data_nascimento_ou_entrada: e.target.value })}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-zinc-600">Observações</label>
            <input
              className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
              value={form.observacoes}
              onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
            />
          </div>
          <div className="col-span-2">
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

      {carregando ? (
        <p className="text-sm text-zinc-500">Carregando...</p>
      ) : (
        <>
          {/* Celular: cada animal como cartão (sem rolagem lateral). */}
          <div className="space-y-2 sm:hidden">
            {animais.map((a) => (
              <div key={a.id} className="rounded border border-zinc-200 bg-white p-3 text-sm">
                <div className="flex items-baseline justify-between">
                  <span className="font-medium text-zinc-900">
                    {a.numero_brinco || "S/N"}
                  </span>
                  <span className="text-xs text-zinc-500">{a.status}</span>
                </div>
                <dl className="mt-1 grid grid-cols-2 gap-x-2 gap-y-1 text-zinc-600">
                  <div className="flex gap-1">
                    <dt className="text-zinc-400">Sexo:</dt>
                    <dd>{a.sexo}</dd>
                  </div>
                  <div className="flex gap-1">
                    <dt className="text-zinc-400">Categoria:</dt>
                    <dd>{a.categoria}</dd>
                  </div>
                  {a.categoria === "VACA" && (
                    <div className="col-span-2 flex gap-1">
                      <dt className="text-zinc-400">Dias sem parir:</dt>
                      <dd>{a.dias_desde_ultimo_parto ?? "sem registro"}</dd>
                    </div>
                  )}
                  {a.observacoes && (
                    <div className="col-span-2 flex gap-1">
                      <dt className="text-zinc-400">Obs:</dt>
                      <dd>{a.observacoes}</dd>
                    </div>
                  )}
                </dl>
              </div>
            ))}
            {animais.length === 0 && (
              <p className="text-sm text-zinc-500">Nenhum animal cadastrado.</p>
            )}
          </div>

          {/* Telas maiores: tabela de verdade. */}
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-zinc-500">
                  <th className="py-2 pr-4">Brinco</th>
                  <th className="py-2 pr-4">Sexo</th>
                  <th className="py-2 pr-4">Categoria</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Dias sem parir</th>
                  <th className="py-2 pr-4">Observações</th>
                </tr>
              </thead>
              <tbody>
                {animais.map((a) => (
                  <tr key={a.id} className="border-b border-zinc-100">
                    <td className="py-2 pr-4 font-medium">{a.numero_brinco || "S/N"}</td>
                    <td className="py-2 pr-4">{a.sexo}</td>
                    <td className="py-2 pr-4">{a.categoria}</td>
                    <td className="py-2 pr-4">{a.status}</td>
                    <td className="py-2 pr-4">
                      {a.categoria === "VACA"
                        ? a.dias_desde_ultimo_parto ?? "sem registro"
                        : "—"}
                    </td>
                    <td className="py-2 pr-4 text-zinc-500">{a.observacoes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default function AnimaisPage() {
  return (
    <RequireAuth>
      <AnimaisConteudo />
    </RequireAuth>
  );
}
