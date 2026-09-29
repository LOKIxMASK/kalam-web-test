import type { Metadata, Viewport } from "next";
import { Manrope, Caveat } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KalamSpark by Acubotz | World's First Smallest Animatronic Study Companion",
  description:
    "Meet KalamSpark, the study companion. Igniting curiosity, inspiring innovation. Talk to Kalam out loud, get homework explained step by step, plan the week and focus after dark. Inspired by Dr. A.P.J. Abdul Kalam.",
  openGraph: {
    title: "KalamSpark by Acubotz",
    description: "World's first smallest animatronic study companion. Igniting curiosity, inspiring innovation.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050812",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${manrope.variable} ${caveat.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
