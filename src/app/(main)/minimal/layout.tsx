import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Minimal Mode | Abhishek Singh",
    description: "A simplified, distraction-free view of Abhishek Singh's portfolio.",
};

export default function MinimalLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
