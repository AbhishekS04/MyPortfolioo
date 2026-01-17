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
};

export const metadata: Metadata = {
  title: {
    default: "Abhishek Singh | Portfolio",
    template: "%s | Abhishek Singh",
  },
  description: "Product Engineer specializing in React, Next.js, and high-performance web applications with a focus on interaction design.",
  applicationName: "Abhishek Singh",
  authors: [{ name: "Abhishek Singh", url: "https://abhishekkpf.vercel.app" }],
  generator: "Next.js",
  keywords: [
    "Abhishek Singh",
    "Product Engineer",
    "Full Stack Engineer",
    "Creative Developer",
    "React Developer",
    "Next.js Developer",
    "Frontend Architect",
    "UI/UX Design",
    "Interaction Design",
    "Web Development",
    "JavaScript",
    "TypeScript",
    "Portfolio",
  ],
  referrer: "origin-when-cross-origin",
  creator: "Abhishek Singh",
  publisher: "Abhishek Singh",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://abhishekkpf.vercel.app"),
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "o4NYyEymJnvH_de5Ee_BhhTIkgAcGNH4kK9ovHsZKuw",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Abhishek Singh",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://abhishekkpf.vercel.app",
    title: "Abhishek Singh | Product Engineer & Portfolio",
    description: "Personal portfolio of Abhishek Singh, a Product Engineer specializing in building premium web experiences.",
    siteName: "Abhishek Singh",
    images: [
      {
        url: "/og-image.png", // Recommended to add this asset
        width: 1200,
        height: 630,
        alt: "Abhishek Singh | Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abhishek Singh | Portfolio",
    description: "Product Engineer specializing in React, Next.js, and interaction design.",
    creator: "@_abhishek2304",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/removebg.png", type: "image/png" },
    ],
    apple: [
      { url: "/removebg.png", sizes: "180x180", type: "image/png" },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Person",
                "name": "Abhishek Singh",
                "url": "https://abhishekkpf.vercel.app",
                "image": "https://abhishekkpf.vercel.app/removebg.png",
                "jobTitle": "Product Engineer",
                "description": "Product Engineer specializing in React, Next.js, and interaction design.",
                "sameAs": [
                  "https://github.com/AbhishekS04",
                  "https://www.linkedin.com/in/abhishek-singh-045312292",
                  "https://instagram.com/abhi3hekk",
                  "https://x.com/_abhishek2304"
                ],
                "knowsAbout": [
                  "React",
                  "Next.js",
                  "TypeScript",
                  "Product Engineering",
                  "Interaction Design",
                  "Full Stack Development"
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "Abhishek Singh Portfolio",
                "url": "https://abhishekkpf.vercel.app",
                "publisher": {
                  "@type": "Person",
                  "name": "Abhishek Singh"
                }
              }
            ])
          }}
        />
        {children}
      </body>
    </html>
  );
}
