import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import 'leaflet/dist/leaflet.css';

const inter = Inter({ subsets: ["latin"] });

const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? "/parkcheck" : "";

export const metadata: Metadata = {
  title: "Parkcheck",
  description: "Check if you have parked legally.",
  manifest: `${basePath}/manifest.json`,
  icons: {
    apple: `${basePath}/icons/icon-192x192.png`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}