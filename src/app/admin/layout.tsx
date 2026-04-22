"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";
import { ToastProvider } from "@/components/ui/toast";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const supabase = createClient();

  // 1. Security: Disable Right Click & Inspector
  useEffect(() => {
    // Disable Right Click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    // NOTE: We only block these specific keys. We do NOT block Backspace.
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.shiftKey && e.key === "J") ||
        (e.ctrlKey && e.key === "u")
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // 2. Auth Check
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session && pathname !== "/admin/login") {
        router.replace("/admin/login");
      } else if (session && pathname === "/admin/login") {
        router.replace("/admin");
        setAuthorized(true);
      } else {
        setAuthorized(true);
      }
      setIsLoading(false);
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session && pathname !== "/admin/login") {
        router.replace("/admin/login");
        setAuthorized(false);
      } else if (session && pathname === "/admin/login") {
        router.replace("/admin");
        setAuthorized(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [router, pathname, supabase]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-white/50" />
      </div>
    );
  }

  // Prevent flashing protected content
  if (!authorized && pathname !== "/admin/login") {
    return null;
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
        {children}
      </div>
    </ToastProvider>
  );
}
