'use client';

import { Suspense } from 'react';
import { PreloaderWrapper } from '@/components/ui/preloader-wrapper';
import { SmoothScroll } from '@/components/ui/smooth-scroll';
import { CommandPalette } from '@/components/ui/command-palette';
import { NavBar } from '@/components/ui/navbar';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';

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
        <SmoothScroll>{children}</SmoothScroll>
      </PreloaderWrapper>
      <ProgressiveBlur
        height="80px"
        position="bottom"
        className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none"
      />
    </>
  );
}
