"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/api";
import Nav from "./Nav";

// Guarda simples de autenticação pras páginas do painel (tudo menos /login).
// Não é segurança de verdade (token no localStorage, checagem só no client) —
// a segurança real é a API exigir o token em toda chamada. Isso aqui só evita
// mostrar a tela vazia antes de redirecionar.
export default function RequireAuth({ children }) {
  const router = useRouter();
  const [verificado, setVerificado] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
    } else {
      setVerificado(true);
    }
  }, [router]);

  if (!verificado) return null;

  return (
    <>
      <Nav />
      {/* min-w-0 é o que impede o <main> de crescer pra caber as tabelas
          largas — <body> é flex-col (ver layout.js) e, por padrão, um item
          flex tem min-width:auto (baseado no conteúdo), não 0. Sem isso, o
          overflow-x-auto das tabelas não tem efeito nenhum no celular. */}
      <main className="mx-auto w-full min-w-0 max-w-5xl p-4 sm:p-6">{children}</main>
    </>
  );
}
