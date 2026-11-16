"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import RequireAuth from "@/components/RequireAuth";

function RhConteudo() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [dias, setDias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [filtroFuncionario, setFiltroFuncionario] = useState("");

  // Formulário: funcionário novo
  const [mostrarFormFuncionario, setMostrarFormFuncionario] = useState(false);
  const [salvandoFuncionario, setSalvandoFuncionario] = useState(false);
  const [formFuncionario, setFormFuncionario] = useState({
    nome: "",
    funcao: "",
    data_admissao: "",
  });

  // Formulário: dia trabalhado
  const [mostrarFormDia, setMostrarFormDia] = useState(false);
  const [salvandoDia, setSalvandoDia] = useState(false);
  const [erroDia, setErroDia] = useState("");
  const [formDia, setFormDia] = useState({
    funcionario: "",
    data: "",
    trabalhou: true,
  });

  async function carregarFuncionarios() {
    const data = await api.get("/api/rh/funcionarios/");
    setFuncionarios(data.results ?? data);
  }

  async function carregarDias() {
    const qs = filtroFuncionario ? `?funcionario=${filtroFuncionario}` : "";
    const data = await api.get(`/api/rh/dias-trabalhados/${qs}`);
    setDias(data.results ?? data);
  }

  async function carregarTudo() {
    setCarregando(true);
    setErro("");
    try {
      await Promise.all([carregarFuncionarios(), carregarDias()]);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarTudo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    carregarDias().catch((err) => setErro(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroFuncionario]);

  async function handleCriarFuncionario(e) {
    e.preventDefault();
    setSalvandoFuncionario(true);
    setErro("");
    try {
      await api.post("/api/rh/funcionarios/", formFuncionario);
      setMostrarFormFuncionario(false);
      setFormFuncionario({ nome: "", funcao: "", data_admissao: "" });
      await carregarFuncionarios();
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvandoFuncionario(false);
    }
  }

  async function handleCriarDia(e) {
    e.preventDefault();
    setSalvandoDia(true);
    setErroDia("");
    try {
      await api.post("/api/rh/dias-trabalhados/", formDia);
      setMostrarFormDia(false);
      setFormDia({ funcionario: formDia.funcionario, data: "", trabalhou: true });
      await carregarDias();
    } catch (err) {
      // erro específico: dia duplicado (UniqueConstraint) — a API devolve
      // isso como erro não-de-campo; mostramos a mensagem real da API, não
      // um texto genérico.
      setErroDia(err.message);
    } finally {
      setSalvandoDia(false);
    }
  }

  function nomeFuncionario(id) {
    const f = funcionarios.find((x) => String(x.id) === String(id));
    return f ? f.nome : `#${id}`;
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-lg font-semibold text-zinc-900">Funcionários</h1>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setMostrarFormDia((v) => !v)}
            className="rounded bg-zinc-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800"
          >
            {mostrarFormDia ? "Cancelar" : "+ Dia trabalhado"}
          </button>
          <button
            onClick={() => setMostrarFormFuncionario((v) => !v)}
            className="rounded bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-800"
          >
            {mostrarFormFuncionario ? "Cancelar" : "+ Novo funcionário"}
          </button>
        </div>
      </div>

      {erro && <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>}

      {mostrarFormFuncionario && (
        <form
          onSubmit={handleCriarFuncionario}
          className="mb-6 grid grid-cols-1 gap-3 rounded border border-zinc-200 bg-white p-4 sm:grid-cols-3"
        >
          <div>
            <label className="block text-xs font-medium text-zinc-600">Nome</label>
            <input
              required
              className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
              value={formFuncionario.nome}
              onChange={(e) => setFormFuncionario({ ...formFuncionario, nome: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600">Função</label>
            <input
              required
              className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
              value={formFuncionario.funcao}
              onChange={(e) => setFormFuncionario({ ...formFuncionario, funcao: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600">Data de admissão</label>
            <input
              type="date"
              required
              className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
              value={formFuncionario.data_admissao}
              onChange={(e) =>
                setFormFuncionario({ ...formFuncionario, data_admissao: e.target.value })
              }
            />
          </div>
          <div className="col-span-3">
            <button
              type="submit"
              disabled={salvandoFuncionario}
              className="rounded bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
            >
              {salvandoFuncionario ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      )}

      {mostrarFormDia && (
        <form
          onSubmit={handleCriarDia}
          className="mb-6 grid grid-cols-1 gap-3 rounded border border-zinc-200 bg-white p-4 sm:grid-cols-3"
        >
          {erroDia && (
            <p className="col-span-3 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{erroDia}</p>
          )}
          <div>
            <label className="block text-xs font-medium text-zinc-600">Funcionário</label>
            <select
              required
              className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
              value={formDia.funcionario}
              onChange={(e) => setFormDia({ ...formDia, funcionario: e.target.value })}
            >
              <option value="">—</option>
              {funcionarios.map((f) => (
                <option key={f.id} value={f.id}>{f.nome}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600">Data</label>
            <input
              type="date"
              required
              className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
              value={formDia.data}
              onChange={(e) => setFormDia({ ...formDia, data: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600">Trabalhou?</label>
            <select
              className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
              value={formDia.trabalhou ? "sim" : "nao"}
              onChange={(e) => setFormDia({ ...formDia, trabalhou: e.target.value === "sim" })}
            >
              <option value="sim">Sim</option>
              <option value="nao">Não (faltou)</option>
            </select>
          </div>
          <div className="col-span-3">
            <button
              type="submit"
              disabled={salvandoDia}
              className="rounded bg-zinc-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-900 disabled:opacity-50"
            >
              {salvandoDia ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      )}

      {carregando ? (
        <p className="text-sm text-zinc-500">Carregando...</p>
      ) : (
        <>
          <h2 className="mb-2 text-sm font-semibold text-zinc-900">Funcionários cadastrados</h2>
          <div className="mb-8 overflow-x-auto">
            <table className="w-full min-w-[400px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-zinc-500">
                  <th className="py-2 pr-4">Nome</th>
                  <th className="py-2 pr-4">Função</th>
                  <th className="py-2 pr-4">Admissão</th>
                </tr>
              </thead>
              <tbody>
                {funcionarios.map((f) => (
                  <tr key={f.id} className="border-b border-zinc-100">
                    <td className="py-2 pr-4">{f.nome}</td>
                    <td className="py-2 pr-4">{f.funcao}</td>
                    <td className="py-2 pr-4">{f.data_admissao}</td>
                  </tr>
                ))}
                {funcionarios.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-2 text-zinc-500">Nenhum funcionário cadastrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-zinc-900">Dias trabalhados</h2>
            <select
              className="rounded border border-zinc-300 px-2 py-1.5 text-sm"
              value={filtroFuncionario}
              onChange={(e) => setFiltroFuncionario(e.target.value)}
            >
              <option value="">Todos os funcionários</option>
              {funcionarios.map((f) => (
                <option key={f.id} value={f.id}>{f.nome}</option>
              ))}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-zinc-500">
                  <th className="py-2 pr-4">Funcionário</th>
                  <th className="py-2 pr-4">Data</th>
                  <th className="py-2 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {dias.map((d) => (
                  <tr key={d.id} className="border-b border-zinc-100">
                    <td className="py-2 pr-4">{nomeFuncionario(d.funcionario)}</td>
                    <td className="py-2 pr-4">{d.data}</td>
                    <td className="py-2 pr-4">{d.trabalhou ? "Trabalhou" : "Faltou"}</td>
                  </tr>
                ))}
                {dias.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-2 text-zinc-500">Nenhum dia registrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default function RhPage() {
  return (
    <RequireAuth>
      <RhConteudo />
    </RequireAuth>
  );
}
