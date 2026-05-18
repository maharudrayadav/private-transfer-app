import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "./components/LayoutWrapper";

const outfit = DM_Sans({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const playfair = DM_Sans({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Private Transfer Ireland - Premium Chauffeur & Airport Transfer Services",
  description: "Private Transfer for Business and Leisure in Ireland. Premium chauffeur and airport transfers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${playfair.variable} antialiased`}
    >
      <LayoutWrapper>{children}</LayoutWrapper>
    </html>
  );
}
