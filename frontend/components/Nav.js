"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearToken } from "@/lib/api";

const LINKS = [
  { href: "/animais", label: "Rebanho" },
  { href: "/financeiro", label: "Financeiro" },
  { href: "/maquinas", label: "Máquinas" },
  // próximos módulos entram aqui conforme forem construídos (rh, obras) —
  // ver TAREFA02.
];

export default function Nav() {
  const router = useRouter();

  function sair() {
    clearToken();
    router.push("/login");
  }

  return (
    <nav className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-3">
      <div className="flex items-center gap-6">
        <span className="font-semibold text-emerald-800">Fazenda Bela Vista</span>
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="text-sm text-zinc-600 hover:text-zinc-900">
            {l.label}
          </Link>
        ))}
      </div>
      <button onClick={sair} className="text-sm text-zinc-500 hover:text-zinc-900">
        Sair
      </button>
    </nav>
  );
}
