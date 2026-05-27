import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Agentation } from "agentation";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Arclight — which feeder to fix first",
  description:
    "A geospatial decision engine that fuses climate exposure, asset vulnerability, and Ontario electrification load growth to rank grid feeders by where hardening pays off most.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="bg-bg text-fg antialiased">
        {children}
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}
