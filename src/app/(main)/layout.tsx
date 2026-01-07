"use client";

import { Suspense } from "react";
import { PreloaderWrapper } from "@/components/ui/preloader-wrapper";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
import { CommandPalette } from "@/components/ui/command-palette";
import { NavBar } from "@/components/ui/navbar";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <CommandPalette />
            <Suspense fallback={null}>
                <NavBar />
            </Suspense>
            <PreloaderWrapper>
                <SmoothScroll>
                    {children}
                </SmoothScroll>
            </PreloaderWrapper>
        </>
    );
}
