// Cliente da API Django. Token fica no localStorage (igual o app mobile vai
// fazer depois) — simples, funciona bem pra um painel com 2 usuários.

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("fazenda_token");
}

export function setToken(token) {
  localStorage.setItem("fazenda_token", token);
}

export function clearToken() {
  localStorage.removeItem("fazenda_token");
}

// Transforma o erro padrão do DRF (ex: {"valor": ["Este campo é
// obrigatório."], "non_field_errors": ["..."]}) numa frase legível. Se não
// for esse formato (erro 500, HTML de debug, etc.), cai pro texto crú.
async function mensagemDeErro(res) {
  const texto = await res.text();
  try {
    const dados = JSON.parse(texto);
    const partes = [];
    for (const [campo, valores] of Object.entries(dados)) {
      const lista = Array.isArray(valores) ? valores : [valores];
      const prefixo = campo === "non_field_errors" || campo === "detail" ? "" : `${campo}: `;
      partes.push(`${prefixo}${lista.join(" ")}`);
    }
    if (partes.length > 0) return partes.join(" — ");
  } catch {
    // não era JSON — segue pro texto crú abaixo
  }
  return `Erro ${res.status}: ${texto}`;
}

async function request(path, { method = "GET", body } = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Token ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    clearToken();
    if (typeof window !== "undefined") window.location.href = "/login";
    throw new Error("Sessão expirada, faça login de novo.");
  }

  if (!res.ok) {
    throw new Error(await mensagemDeErro(res));
  }

  if (res.status === 204) return null;
  return res.json();
}

export async function login(username, password) {
  const res = await fetch(`${API_URL}/api/auth-token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Usuário ou senha inválidos.");
  const data = await res.json();
  setToken(data.token);
  return data.token;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body }),
  patch: (path, body) => request(path, { method: "PATCH", body }),
  del: (path) => request(path, { method: "DELETE" }),
};
