/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // Gera .next/standalone com só o necessário pra rodar (sem node_modules
  // completo) — usado pelo Dockerfile de produção.
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
