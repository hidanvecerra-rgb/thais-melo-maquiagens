import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { BRAND } from "@/lib/siteConfig";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});

const title = "Maquiadora em Ituiutaba MG | Thais Melo Maquiagens";
const description =
  "Maquiagem profissional em Ituiutaba-MG para festas, formaturas, ensaios e ocasiões especiais. Conheça o trabalho de Thais Melo e agende seu horário.";

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.siteUrl),
  title: {
    default: title,
    template: `%s | ${BRAND.legalName}`,
  },
  description,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title,
    description,
    url: BRAND.siteUrl,
    siteName: BRAND.legalName,
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
  manifest: "/manifest.webmanifest",
};

export const viewport = {
  themeColor: "#f8f5f1",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": `${BRAND.siteUrl}/#business`,
      name: BRAND.legalName,
      image: `${BRAND.siteUrl}/icon.svg`,
      url: BRAND.siteUrl,
      telephone: `+${BRAND.whatsappNumber}`,
      priceRange: "R$100–R$300",
      address: {
        "@type": "PostalAddress",
        addressLocality: BRAND.city,
        addressRegion: BRAND.state,
        addressCountry: "BR",
      },
      areaServed: `${BRAND.city} - ${BRAND.state}`,
    },
    {
      "@type": "Person",
      "@id": `${BRAND.siteUrl}/#person`,
      name: BRAND.name,
      jobTitle: BRAND.tagline,
      url: BRAND.siteUrl,
      worksFor: { "@id": `${BRAND.siteUrl}/#business` },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
