"use client";

// Campo de valor em reais com máscara "tipo calculadora": o usuário digita só
// números e o campo monta a formatação brasileira conforme digita (os
// últimos 2 dígitos são sempre os centavos). Ex: digitar "100000" mostra
// "1.000,00"; "1000000" mostra "10.000,00"; "100000000" mostra
// "1.000.000,00".
//
// `value`/`onChange` continuam sendo string decimal pura (ex: "1000.00"),
// igual todo outro campo do formulário — só a exibição é mascarada. Isso é
// derivado direto do `value`, sem estado próprio, pra nunca desincronizar
// quando o formulário reseta o campo depois de salvar.

function valorParaExibicao(value) {
  const numero = parseFloat(value);
  if (!value || Number.isNaN(numero) || numero === 0) return "";
  return numero.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function CampoValor({ value, onChange, required, className }) {
  function handleChange(e) {
    const digitos = e.target.value.replace(/\D/g, "");
    const centavos = digitos === "" ? 0 : parseInt(digitos, 10);
    onChange((centavos / 100).toFixed(2));
  }

  return (
    <div className="flex items-center gap-1 rounded border border-zinc-300 px-2">
      <span className="text-sm text-zinc-500">R$</span>
      <input
        type="text"
        inputMode="numeric"
        required={required}
        className={className || "w-full py-1.5 text-sm outline-none"}
        value={valorParaExibicao(value)}
        onChange={handleChange}
        placeholder="0,00"
      />
    </div>
  );
}
