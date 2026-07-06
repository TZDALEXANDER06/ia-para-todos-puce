import type { Metadata } from "next";
import Script from "next/script";
import { Sora, Inter } from "next/font/google";
import { asset } from "./lib/asset";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"]
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "IA para Todos - PUCE Sistemas",
    template: "%s | IA para Todos"
  },
  description:
    "Plataforma educativa de vinculacion PUCE sobre inteligencia artificial, etica, seguridad digital, videos, podcast y recursos para la comunidad.",
  openGraph: {
    title: "IA para Todos - PUCE Sistemas",
    description:
      "Educacion, etica y tecnologia para acercar la inteligencia artificial a estudiantes, docentes, familias y comunidad.",
    url: siteUrl,
    siteName: "IA para Todos",
    images: [asset("/images/aurelio-ia-hero.png")],
    locale: "es_EC",
    type: "website"
  }
};

export const viewport = {
  themeColor: "#0b1e3a"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${sora.variable} ${inter.variable}`}>
      <body>
        <div className="auroraField" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        {gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        ) : null}
        {children}
      </body>
    </html>
  );
}
