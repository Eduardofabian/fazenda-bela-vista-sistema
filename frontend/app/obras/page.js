"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import RequireAuth from "@/components/RequireAuth";

function ObrasConteudo() {
  const [obras, setObras] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [form, setForm] = useState({ descricao: "", data_inicio: "" });

  async function carregar() {
    setCarregando(true);
    setErro("");
    try {
      const data = await api.get("/api/obras/obras/");
      setObras(data.results ?? data);
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
      await api.post("/api/obras/obras/", form);
      setMostrarForm(false);
      setForm({ descricao: "", data_inicio: "" });
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
        <h1 className="text-lg font-semibold text-zinc-900">Obras</h1>
        <button
          onClick={() => setMostrarForm((v) => !v)}
          className="rounded bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-800"
        >
          {mostrarForm ? "Cancelar" : "+ Nova obra"}
        </button>
      </div>

      <p className="mb-4 rounded bg-zinc-100 px-3 py-2 text-sm text-zinc-600">
        Gasto de obra não é lançado aqui — é em{" "}
        <a href="/financeiro" className="text-emerald-700 underline">Financeiro</a>, com categoria
        &quot;Cercas / Obras&quot; e a obra selecionada no lançamento.
      </p>

      {erro && <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>}

      {mostrarForm && (
        <form
          onSubmit={handleCriar}
          className="mb-6 grid grid-cols-1 gap-3 rounded border border-zinc-200 bg-white p-4 sm:grid-cols-2"
        >
          <div>
            <label className="block text-xs font-medium text-zinc-600">Descrição</label>
            <input
              required
              className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              placeholder="Ex: Cerca de madeira — divisa norte"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600">Data de início</label>
            <input
              type="date"
              required
              className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
              value={form.data_inicio}
              onChange={(e) => setForm({ ...form, data_inicio: e.target.value })}
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
        <div className="overflow-x-auto">
          <table className="w-full min-w-[400px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left text-zinc-500">
                <th className="py-2 pr-4">Descrição</th>
                <th className="py-2 pr-4">Início</th>
                <th className="py-2 pr-4">Gastos</th>
              </tr>
            </thead>
            <tbody>
              {obras.map((o) => (
                <tr key={o.id} className="border-b border-zinc-100">
                  <td className="py-2 pr-4">{o.descricao}</td>
                  <td className="py-2 pr-4">{o.data_inicio}</td>
                  <td className="py-2 pr-4">
                    <a
                      href={`/financeiro?obra=${o.id}`}
                      className="text-emerald-700 underline"
                    >
                      ver no financeiro
                    </a>
                  </td>
                </tr>
              ))}
              {obras.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-2 text-zinc-500">Nenhuma obra cadastrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function ObrasPage() {
  return (
    <RequireAuth>
      <ObrasConteudo />
    </RequireAuth>
  );
}
