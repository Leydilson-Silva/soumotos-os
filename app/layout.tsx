import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}