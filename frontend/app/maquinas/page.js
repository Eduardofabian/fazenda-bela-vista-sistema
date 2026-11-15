"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import RequireAuth from "@/components/RequireAuth";

const TIPO_OPCOES = [
  "TRATOR",
  "TRATOR_ESTEIRA",
  "CARRO_PASSEIO",
  "CAMINHONETE",
  "CAMINHAO",
  "MOTO",
  "OUTRO",
];

function MaquinasConteudo() {
  const [maquinas, setMaquinas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // Formulário: nova máquina
  const [mostrarFormMaquina, setMostrarFormMaquina] = useState(false);
  const [salvandoMaquina, setSalvandoMaquina] = useState(false);
  const [formMaquina, setFormMaquina] = useState({
    nome: "",
    modelo: "",
    placa: "",
    tipo: "TRATOR",
    observacoes: "",
  });

  // Formulário: controle de horas
  const [mostrarFormHoras, setMostrarFormHoras] = useState(false);
  const [salvandoHoras, setSalvandoHoras] = useState(false);
  const [erroHoras, setErroHoras] = useState("");
  const [formHoras, setFormHoras] = useState({
    maquina: "",
    data: "",
    horas: "",
    km_inicial: "",
    km_final: "",
    observacao: "",
  });

  // Formulário: peça nova
  const [mostrarFormPeca, setMostrarFormPeca] = useState(false);
  const [salvandoPeca, setSalvandoPeca] = useState(false);
  const [erroPeca, setErroPeca] = useState("");
  const [formPeca, setFormPeca] = useState({
    maquina: "",
    nome: "",
    codigo: "",
    observacoes: "",
  });

  async function carregar() {
    setCarregando(true);
    setErro("");
    try {
      const data = await api.get("/api/maquinas/maquinas/");
      setMaquinas(data.results ?? data);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function handleCriarMaquina(e) {
    e.preventDefault();
    setSalvandoMaquina(true);
    setErro("");
    try {
      await api.post("/api/maquinas/maquinas/", formMaquina);
      setMostrarFormMaquina(false);
      setFormMaquina({ nome: "", modelo: "", placa: "", tipo: "TRATOR", observacoes: "" });
      await carregar();
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvandoMaquina(false);
    }
  }

  async function handleCriarHoras(e) {
    e.preventDefault();
    setSalvandoHoras(true);
    setErroHoras("");
    try {
      const payload = {
        ...formHoras,
        km_inicial: formHoras.km_inicial || null,
        km_final: formHoras.km_final || null,
      };
      await api.post("/api/maquinas/controle-horas/", payload);
      setMostrarFormHoras(false);
      setFormHoras({ maquina: "", data: "", horas: "", km_inicial: "", km_final: "", observacao: "" });
      await carregar();
    } catch (err) {
      setErroHoras(err.message);
    } finally {
      setSalvandoHoras(false);
    }
  }

  async function handleCriarPeca(e) {
    e.preventDefault();
    setSalvandoPeca(true);
    setErroPeca("");
    try {
      await api.post("/api/maquinas/pecas/", formPeca);
      setMostrarFormPeca(false);
      setFormPeca({ maquina: "", nome: "", codigo: "", observacoes: "" });
      await carregar();
    } catch (err) {
      setErroPeca(err.message);
    } finally {
      setSalvandoPeca(false);
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-zinc-900">Máquinas</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setMostrarFormHoras((v) => !v)}
            className="rounded bg-zinc-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800"
          >
            {mostrarFormHoras ? "Cancelar" : "+ Controle de horas"}
          </button>
          <button
            onClick={() => setMostrarFormPeca((v) => !v)}
            className="rounded bg-zinc-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800"
          >
            {mostrarFormPeca ? "Cancelar" : "+ Peça"}
          </button>
          <button
            onClick={() => setMostrarFormMaquina((v) => !v)}
            className="rounded bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-800"
          >
            {mostrarFormMaquina ? "Cancelar" : "+ Nova máquina"}
          </button>
        </div>
      </div>

      {erro && <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>}

      {mostrarFormMaquina && (
        <form
          onSubmit={handleCriarMaquina}
          className="mb-6 grid grid-cols-3 gap-3 rounded border border-zinc-200 bg-white p-4"
        >
          <div>
            <label className="block text-xs font-medium text-zinc-600">Nome</label>
            <input
              required
              className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
              value={formMaquina.nome}
              onChange={(e) => setFormMaquina({ ...formMaquina, nome: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600">Tipo</label>
            <select
              className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
              value={formMaquina.tipo}
              onChange={(e) => setFormMaquina({ ...formMaquina, tipo: e.target.value })}
            >
              {TIPO_OPCOES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600">Modelo (tratores)</label>
            <input
              className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
              value={formMaquina.modelo}
              onChange={(e) => setFormMaquina({ ...formMaquina, modelo: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600">Placa (camionetes/carros)</label>
            <input
              className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
              value={formMaquina.placa}
              onChange={(e) => setFormMaquina({ ...formMaquina, placa: e.target.value })}
            />
          </div>
          <div className="col-span-3">
            <label className="block text-xs font-medium text-zinc-600">Observações</label>
            <input
              className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
              value={formMaquina.observacoes}
              onChange={(e) => setFormMaquina({ ...formMaquina, observacoes: e.target.value })}
            />
          </div>
          <div className="col-span-3">
            <button
              type="submit"
              disabled={salvandoMaquina}
              className="rounded bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
            >
              {salvandoMaquina ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      )}

      {mostrarFormHoras && (
        <form
          onSubmit={handleCriarHoras}
          className="mb-6 grid grid-cols-3 gap-3 rounded border border-zinc-200 bg-white p-4"
        >
          {erroHoras && (
            <p className="col-span-3 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{erroHoras}</p>
          )}
          <div>
            <label className="block text-xs font-medium text-zinc-600">Máquina</label>
            <select
              required
              className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
              value={formHoras.maquina}
              onChange={(e) => setFormHoras({ ...formHoras, maquina: e.target.value })}
            >
              <option value="">—</option>
              {maquinas.map((m) => (
                <option key={m.id} value={m.id}>{m.nome}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600">Data</label>
            <input
              type="date"
              required
              className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
              value={formHoras.data}
              onChange={(e) => setFormHoras({ ...formHoras, data: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600">Horas trabalhadas</label>
            <input
              type="number"
              step="0.1"
              required
              className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
              value={formHoras.horas}
              onChange={(e) => setFormHoras({ ...formHoras, horas: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600">KM inicial (opcional)</label>
            <input
              type="number"
              step="0.1"
              className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
              value={formHoras.km_inicial}
              onChange={(e) => setFormHoras({ ...formHoras, km_inicial: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600">KM final (opcional)</label>
            <input
              type="number"
              step="0.1"
              className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
              value={formHoras.km_final}
              onChange={(e) => setFormHoras({ ...formHoras, km_final: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600">Observação</label>
            <input
              className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
              value={formHoras.observacao}
              onChange={(e) => setFormHoras({ ...formHoras, observacao: e.target.value })}
            />
          </div>
          <div className="col-span-3">
            <button
              type="submit"
              disabled={salvandoHoras}
              className="rounded bg-zinc-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-900 disabled:opacity-50"
            >
              {salvandoHoras ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      )}

      {mostrarFormPeca && (
        <form
          onSubmit={handleCriarPeca}
          className="mb-6 grid grid-cols-3 gap-3 rounded border border-zinc-200 bg-white p-4"
        >
          {erroPeca && (
            <p className="col-span-3 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{erroPeca}</p>
          )}
          <div>
            <label className="block text-xs font-medium text-zinc-600">Máquina</label>
            <select
              required
              className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
              value={formPeca.maquina}
              onChange={(e) => setFormPeca({ ...formPeca, maquina: e.target.value })}
            >
              <option value="">—</option>
              {maquinas.map((m) => (
                <option key={m.id} value={m.id}>{m.nome}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600">Nome da peça</label>
            <input
              required
              className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
              value={formPeca.nome}
              onChange={(e) => setFormPeca({ ...formPeca, nome: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600">Código/modelo</label>
            <input
              className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
              value={formPeca.codigo}
              onChange={(e) => setFormPeca({ ...formPeca, codigo: e.target.value })}
            />
          </div>
          <div className="col-span-3">
            <label className="block text-xs font-medium text-zinc-600">Observações</label>
            <input
              className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
              value={formPeca.observacoes}
              onChange={(e) => setFormPeca({ ...formPeca, observacoes: e.target.value })}
            />
          </div>
          <div className="col-span-3">
            <button
              type="submit"
              disabled={salvandoPeca}
              className="rounded bg-zinc-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-900 disabled:opacity-50"
            >
              {salvandoPeca ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      )}

      {carregando ? (
        <p className="text-sm text-zinc-500">Carregando...</p>
      ) : (
        <div className="space-y-4">
          {maquinas.map((m) => (
            <div key={m.id} className="rounded border border-zinc-200 bg-white p-4">
              <div className="flex items-baseline justify-between">
                <h2 className="font-medium text-zinc-900">
                  {m.nome} <span className="text-sm text-zinc-500">— {m.tipo}</span>
                </h2>
                <span className="text-sm text-zinc-500">
                  {m.modelo && `Modelo: ${m.modelo}`}
                  {m.placa && ` Placa: ${m.placa}`}
                </span>
              </div>
              {m.observacoes && <p className="mt-1 text-sm text-zinc-600">{m.observacoes}</p>}
              <div className="mt-2">
                <span className="text-xs font-medium text-zinc-500">Peças:</span>{" "}
                {m.pecas && m.pecas.length > 0 ? (
                  <span className="text-sm text-zinc-700">
                    {m.pecas.map((p) => `${p.nome}${p.codigo ? ` (${p.codigo})` : ""}`).join(", ")}
                  </span>
                ) : (
                  <span className="text-sm text-zinc-400">nenhuma cadastrada</span>
                )}
              </div>
            </div>
          ))}
          {maquinas.length === 0 && (
            <p className="text-sm text-zinc-500">Nenhuma máquina cadastrada ainda.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function MaquinasPage() {
  return (
    <RequireAuth>
      <MaquinasConteudo />
    </RequireAuth>
  );
}
