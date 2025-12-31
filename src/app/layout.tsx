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
    url: "https://abhishekkpf.vercel.app", // User should update this
    siteName: "Abhishek Singh Portfolio",
  },
  icons: {
    icon: "/removebg.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning style={{ backgroundColor: '#050805' }}>
      <body className={`${outfit.variable} ${hendrigo.variable} ${sacramento.variable}`} style={{ backgroundColor: '#050805', color: '#ededed' }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Abhishek Singh",
              "url": "https://portfolio-test-devaura.vercel.app",
              "jobTitle": "Senior Frontend Engineer",
              "sameAs": [
                "https://github.com/AbhishekS04",
                "https://linkedin.com/in/AbhishekS04",
                "https://twitter.com/AbhishekS04"
              ]
            })
          }}
        />

        {/* Global Film Grain Overlay */}
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            pointerEvents: 'none',
            opacity: 0.05,
            mixBlendMode: 'overlay',
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`
          }}
        />

        <SmoothScroll>
          <PreloaderWrapper>
            {children}
          </PreloaderWrapper>
        </SmoothScroll>
      </body>
    </html>
  );
}
