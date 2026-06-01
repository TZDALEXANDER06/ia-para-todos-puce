import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

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
    images: ["/images/aurelio-ia-hero.png"],
    locale: "es_EC",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
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
