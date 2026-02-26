import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import I18nProvider from "@/components/providers/I18nProvider";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Gorila Studio",
  description: "Fun learning activities for kids",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${nunito.variable} font-sans antialiased bg-zinc-50`}>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
