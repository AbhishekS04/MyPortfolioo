import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Minimal',
  description:
    "A simplified, distraction-free view of Abhishek Singh's portfolio.",
  openGraph: {
    title: 'Minimal | Abhishek Singh',
    description:
      "A simplified, distraction-free view of Abhishek Singh's portfolio.",
    url: 'https://abhisheksingh.tech/minimal',
    siteName: 'Abhishek Singh Portfolio',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Minimal | Abhishek Singh',
    description:
      "A simplified, distraction-free view of Abhishek Singh's portfolio.",
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://abhisheksingh.tech/minimal',
  },
};

export default function MinimalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
