"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearToken } from "@/lib/api";

const LINKS = [
  { href: "/animais", label: "Rebanho" },
  { href: "/financeiro", label: "Financeiro" },
  { href: "/maquinas", label: "Máquinas" },
  { href: "/rh", label: "Funcionários" },
  { href: "/obras", label: "Obras" },
];

export default function Nav() {
  const router = useRouter();

  function sair() {
    clearToken();
    router.push("/login");
  }

  return (
    <nav className="border-b border-zinc-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-emerald-800">Fazenda Bela Vista</span>
        <button onClick={sair} className="text-sm text-zinc-500 hover:text-zinc-900">
          Sair
        </button>
      </div>
      {/* Linha de links — em tela de celular não cabem todos lado a lado,
          então quebra pra segunda linha em vez de cortar o último (scroll
          horizontal só confundia, "Obras" ficava cortado na borda). */}
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 sm:mt-0 sm:gap-x-6">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="whitespace-nowrap text-sm text-zinc-600 hover:text-zinc-900"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
