import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

const title = "Thais Melo Maquiagens — Agende seu horário";
const description =
  "Agende sua maquiagem social ou aula de automaquiagem em Ituiutaba - MG. Confirmação direto no WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL("https://thais-melo-maquiagens.vercel.app"),
  title,
  description,
  openGraph: {
    title,
    description,
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
