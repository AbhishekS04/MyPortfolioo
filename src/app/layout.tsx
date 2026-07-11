import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { bolivia } from "@/lib/fonts";
import "./globals.css";
import { FramerProvider } from "@/components/providers/framer-provider";

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
  description:
    "Abhishek Singh is a self-taught Full Stack Developer and student at Adamas University, Kolkata, India. With 2+ years of experience, he specializes in React, Next.js, and TypeScript — always building, always learning.",
  applicationName: "Abhishek Singh",
  authors: [{ name: "Abhishek Singh", url: "https://abhisheksingh.tech" }],
  generator: "Next.js",
  keywords: [
    "Abhishek Singh",
    "Full Stack Developer",
    "Web Developer",
    "Frontend Developer",
    "Creative Developer",
    "React Developer",
    "Next.js Developer",
    "Student Developer",
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
  metadataBase: new URL("https://abhisheksingh.tech"),
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
    url: "https://abhisheksingh.tech",
    title: "Abhishek Singh | Full Stack Developer & Portfolio",
    description:
      "Personal portfolio of Abhishek Singh — a self-taught Full Stack Developer and student from Kolkata, India, who loves building with React and Next.js.",
    siteName: "Abhishek Singh",
    images: [
      {
        url: "/og-image-about.png",
        width: 1200,
        height: 630,
        alt: "Abhishek Singh | Full Stack Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abhishek Singh | Portfolio",
    description:
      "Abhishek Singh is a self-taught Full Stack Developer from Kolkata, India — a student who loves learning everything and building things with React and Next.js.",
    creator: "@_abhishek2304",
    images: ["/og-image-about.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/removebg.png", type: "image/png" },
    ],
    apple: [{ url: "/removebg.png", sizes: "180x180", type: "image/png" }],
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
    <html
      lang="en"
      suppressHydrationWarning
      style={{ backgroundColor: "#050805" }}
    >
      <body
        className={`${outfit.variable} ${bolivia.variable}`}
        style={{ backgroundColor: "#050805", color: "#ededed" }}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                // Person entity — this is the canonical Knowledge Graph node for Abhishek Singh
                "@context": "https://schema.org",
                "@type": "Person",
                "@id": "https://abhisheksingh.tech/#person",
                name: "Abhishek Singh",
                url: "https://abhisheksingh.tech",
                image: {
                  "@type": "ImageObject",
                  "@id": "https://abhisheksingh.tech/#portrait",
                  url: "https://abhisheksingh.tech/abhishek-singh-full-stack-developer.avif",
                  contentUrl:
                    "https://abhisheksingh.tech/abhishek-singh-full-stack-developer.avif",
                  description:
                    "Abhishek Singh — Full Stack Developer from Kolkata, India",
                  name: "Abhishek Singh Portrait",
                  width: 800,
                  height: 800,
                },
                jobTitle: "Full Stack Developer",
                description:
                  "Abhishek Singh is a self-taught Full Stack Developer and student at Adamas University, Kolkata, India. With 2+ years of experience, he specializes in React, Next.js, TypeScript, and interaction design. He loves learning everything — from backend systems to design — and is always building something new.",
                birthDate: "2004-10-23",
                birthPlace: {
                  "@type": "Place",
                  name: "India",
                },
                nationality: "Indian",
                email: "Abhishek23main@gmail.com",
                alumniOf: [
                  {
                    "@type": "EducationalOrganization",
                    name: "Adamas University",
                    url: "https://adamasuniversity.ac.in",
                  },
                ],
                homeLocation: {
                  "@type": "Place",
                  name: "Kolkata, West Bengal, India",
                },
                sameAs: [
                  "https://abhisheksingh.tech",
                  "https://github.com/AbhishekS04",
                  "https://www.linkedin.com/in/abhishek-singh-045312292",
                  "https://www.instagram.com/abhi3hekk/",
                  "https://x.com/_abhishek2304",
                  "https://twitter.com/_abhishek2304",
                ],
                knowsAbout: [
                  "React",
                  "Next.js",
                  "TypeScript",
                  "Full Stack Development",
                  "Interaction Design",
                  "Frontend Architecture",
                  "UI/UX Design",
                  "Node.js",
                  "Supabase",
                  "Tailwind CSS",
                  "PostgreSQL",
                  "Framer Motion",
                ],
                worksFor: {
                  "@type": "Organization",
                  name: "Freelance / Self-Employed",
                },
                hasOccupation: {
                  "@type": "Occupation",
                  name: "Full Stack Developer",
                  occupationLocation: {
                    "@type": "Country",
                    name: "India",
                  },
                  skills:
                    "React, Next.js, TypeScript, UI/UX Design, Full Stack Development, Node.js",
                },
              },
              {
                // ProfilePage entity — tells Google this URL IS the profile page for the Person above
                "@context": "https://schema.org",
                "@type": "ProfilePage",
                "@id": "https://abhisheksingh.tech/#profile",
                url: "https://abhisheksingh.tech",
                name: "Abhishek Singh — Full Stack Developer Portfolio",
                dateModified: "2026-05-01T00:00:00.000Z",
                mainEntity: {
                  "@id": "https://abhisheksingh.tech/#person",
                },
              },
              {
                // WebSite entity — enables Google Sitelinks Search Box
                "@context": "https://schema.org",
                "@type": "WebSite",
                "@id": "https://abhisheksingh.tech/#website",
                name: "Abhishek Singh Portfolio",
                url: "https://abhisheksingh.tech",
                description:
                  "Portfolio of Abhishek Singh, a self-taught Full Stack Developer specializing in React, Next.js, and modern web experiences.",
                author: {
                  "@id": "https://abhisheksingh.tech/#person",
                },
                publisher: {
                  "@id": "https://abhisheksingh.tech/#person",
                },
                inLanguage: "en-US",
                potentialAction: {
                  "@type": "SearchAction",
                  target:
                    "https://abhisheksingh.tech/works?q={search_term_string}",
                  "query-input": "required name=search_term_string",
                },
              },
            ]),
          }}
        />
        <FramerProvider>{children}</FramerProvider>
      </body>
    </html>
  );
}
