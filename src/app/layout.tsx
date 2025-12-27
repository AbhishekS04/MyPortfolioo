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
  title: {
    default: "Abhishek Singh | Portfolio",
    template: "%s | Abhishek Singh",
  },
  description: "Senior Frontend Engineer & UI System Designer specializing in performant, aesthetic, and scalable web applications.",
  keywords: ["Frontend Engineer", "UI Designer", "React", "Next.js", "Portfolio", "Web Development"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://portfolio-test-devaura.vercel.app", // User should update this
    siteName: "Abhishek Singh Portfolio",
  },
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
