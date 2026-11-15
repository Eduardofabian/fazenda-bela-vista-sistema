import "./globals.css";

export const metadata = {
  title: "Fazenda Bela Vista — Painel",
  description: "Painel administrativo da Fazenda Bela Vista",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-zinc-50">{children}</body>
    </html>
  );
}
