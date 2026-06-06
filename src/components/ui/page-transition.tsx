"use client";

import { m } from "framer-motion";
import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <m.div
      key={pathname}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
      className="w-full h-full"
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </m.div>
  );
}
