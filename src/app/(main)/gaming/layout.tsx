import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Gaming Profile",
    description: "A cyberpunk-themed showcase of Abhishek Singh's gaming statistics and profile.",
    openGraph: {
        title: "Gaming Profile | Abhishek Singh",
        description: "A cyberpunk-themed showcase of Abhishek Singh's gaming statistics and profile.",
        url: "https://abhisheksingh.tech/gaming",
        siteName: "Abhishek Singh Portfolio",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Gaming Profile | Abhishek Singh",
        description: "A cyberpunk-themed showcase of Abhishek Singh's gaming statistics and profile.",
        images: ["/og-image.jpg"],
    },
    alternates: {
        canonical: "https://abhisheksingh.tech/gaming"
    }
};

export default function GamingLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
