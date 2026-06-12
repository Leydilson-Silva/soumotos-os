import type { Metadata, Viewport } from "next";
import "./globals.css";

// Configurações de visualização para mobile (evita zoom indesejado em inputs)
export const viewport: Viewport = {
  themeColor: "#EAB308", // Amarelo característico da SOUMOTOS
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "SOUMOTOS - Ordem de Serviço",
  description: "Sistema interno de checklist e OS para a SOUMOTOS",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.png",
    apple: "/icon-192x192.png", // Ícone para iOS
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SOUMOTOS",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className="antialiased">{children}</body>
    </html>
  );
}
