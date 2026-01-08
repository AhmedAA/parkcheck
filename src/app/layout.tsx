import type { Metadata } from "next";

const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? "/parkcheck" : "";

export const metadata: Metadata = {
  title: "ParkCheck",
  description: "Check your parking zones accurately",
  // We manually prepend the basePath here to ensure GitHub Pages finds it
  manifest: `${basePath}/manifest.json`,
  icons: {
    apple: `${basePath}/icons/icon-192x192.png`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="da">
      <head>
        <meta name="theme-color" content="#007bff" />
      </head>
      <body>{children}</body>
    </html>
  );
}