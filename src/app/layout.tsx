import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { bolivia } from "@/lib/fonts";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport = {
  themeColor: "#050805",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevent zooming for app-like feel
};

export const metadata: Metadata = {
  title: "Abhishek Singh | Portfolio",
  description: "Product Engineer specializing in React, Next.js, and interaction design.",
  applicationName: "Abhishek Singh",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Abhishek Singh",
  },
  keywords: ["Product Engineer", "Full Stack Engineer", "React", "Next.js", "Portfolio", "Web Development"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://abhishekkpf.vercel.app", // User should update this
    title: "Abhishek Singh | Portfolio",
    description: "Product Engineer.",
    siteName: "Abhishek Singh",
  },
  icons: {
    icon: "/removebg.png",
    apple: "/removebg.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning style={{ backgroundColor: '#050805' }}>
      <body className={`${outfit.variable} ${bolivia.variable}`} style={{ backgroundColor: '#050805', color: '#ededed' }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Abhishek Singh",
              "url": "https://abhishekkpf.vercel.app",
              "jobTitle": "Product Engineer",
              "sameAs": [
                "https://github.com/AbhishekS04",
                "https://linkedin.com/in/AbhishekS04",
                "https://twitter.com/AbhishekS04"
              ]
            })
          }}
        />
        {children}
      </body>
    </html>
  );
}
