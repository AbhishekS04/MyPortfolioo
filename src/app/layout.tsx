import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { hendrigo, sacramento } from "@/lib/fonts";
import { PreloaderWrapper } from "@/components/ui/preloader-wrapper";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Experimental Grid Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} ${hendrigo.variable} ${sacramento.variable}`}>
        <SmoothScroll>
          <PreloaderWrapper>
            {children}
          </PreloaderWrapper>
        </SmoothScroll>
      </body>
    </html>
  );
}
