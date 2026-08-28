import type { Metadata, Viewport } from "next";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sachchidanandmadhavanand.org"),
  title: {
    default: "શ્રી માધવાનંદ આશ્રમ | સત્સંગ, સેવા અને ગુરુપરંપરા",
    template: "%s | શ્રી માધવાનંદ આશ્રમ",
  },
  description:
    "શ્રી માધવાનંદ આશ્રમ પરિવારનું ગુજરાતી ડિજિટલ ધામ — ગુરુપરંપરા, સત્સંગ, આશ્રમ શાખાઓ, સેવા પ્રવૃત્તિઓ, વેદ રહસ્ય અને કાર્યક્રમોની માહિતી.",
  applicationName: "શ્રી માધવાનંદ આશ્રમ",
  keywords: [
    "શ્રી માધવાનંદ આશ્રમ",
    "સચ્ચિદાનંદ માધવાનંદ",
    "ગુજરાતી સત્સંગ",
    "વેદ રહસ્ય",
    "Madhavanand Ashram",
    "Sachchidanand Madhavanand",
  ],
  openGraph: {
    type: "website",
    locale: "gu_IN",
    siteName: "શ્રી માધવાનંદ આશ્રમ",
    title: "શ્રી માધવાનંદ આશ્રમ",
    description: "સત્સંગથી આત્મકલ્યાણ, સેવાથી સમાજકલ્યાણ.",
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: "શ્રી માધવાનંદ આશ્રમ" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "શ્રી માધવાનંદ આશ્રમ",
    description: "સત્સંગથી આત્મકલ્યાણ, સેવાથી સમાજકલ્યાણ.",
    images: ["/og.svg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#711f2d",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="gu">
      <body>{children}</body>
    </html>
  );
}
