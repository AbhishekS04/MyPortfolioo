"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminSettings() {
    return (
        <div className="min-h-screen p-6 md:p-12 max-w-4xl mx-auto pb-32 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <span className="text-4xl">⚙️</span>
            </div>
            <h1 className="text-3xl font-medium text-white mb-2">Global Settings</h1>
            <p className="text-white/40 max-w-md mx-auto mb-8">
                This module is currently under development. In the future, you will be able to manage SEO tags, API keys, and theme colors here.
            </p>

            <Link href="/admin" className="px-8 py-3 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-all">
                Return to Dashboard
            </Link>
        </div>
    );
}
