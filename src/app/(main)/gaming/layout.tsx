import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Gaming Profile - Abhishek Singh",
    description: "A cyberpunk-themed showcase of Abhishek Singh's gaming statistics and profile.",
};

export default function GamingLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
