import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FlightWise AI - Recomendaciones Inteligentes de Vuelos",
  description: "FlightWise AI transforma datos de vuelos en recomendaciones inteligentes, ayudando a los usuarios a decidir cuándo y cómo viajar al mejor precio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} antialiased font-montserrat`}
      >
        {children}
      </body>
    </html>
  );
}
