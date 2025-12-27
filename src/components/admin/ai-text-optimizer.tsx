"use client";

import { useState } from "react";
import { Sparkles, RotateCcw, Loader2 } from "lucide-react";
import { optimizeText } from "@/app/actions/optimize-text";

interface AiTextOptimizerProps {
    currentText: string;
    onOptimized: (newText: string) => void;
    className?: string;
}

export function AiTextOptimizer({ currentText, onOptimized, className = "" }: AiTextOptimizerProps) {
    const [loading, setLoading] = useState(false);
    const [previousText, setPreviousText] = useState<string | null>(null);

    const handleOptimize = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent form submission if inside a form
        if (!currentText?.trim()) return;

        setLoading(true);
        setPreviousText(currentText); // Save for undo

        try {
            const result = await optimizeText(currentText);

            if (result.error) {
                console.error(result.error);
                // Fallback alert if toast isn't set up
                alert("Failed to optimize text: " + result.error);
            } else if (result.optimizedText) {
                onOptimized(result.optimizedText);
            }
        } catch (err) {
            console.error(err);
            alert("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const handleUndo = (e: React.MouseEvent) => {
        e.preventDefault();
        if (previousText !== null) {
            onOptimized(previousText);
            setPreviousText(null); // Reset undo
        }
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <button
                onClick={handleOptimize}
                disabled={loading || !currentText?.trim()}
                className={`
          flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all
          ${loading
                        ? "bg-white/5 text-white/30 cursor-wait"
                        : "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 hover:scale-105 active:scale-95 border border-indigo-500/20"
                    }
        `}
                title="Optimize with AI"
            >
                {loading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                    <Sparkles className="w-3 h-3" />
                )}
                <span>{loading ? "Optimizing..." : "AI Optimize"}</span>
            </button>

            {previousText !== null && !loading && (
                <button
                    onClick={handleUndo}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 text-white/40 text-xs font-medium hover:bg-white/10 hover:text-white transition-all border border-white/5"
                    title="Undo AI changes"
                >
                    <RotateCcw className="w-3 h-3" />
                    <span>Undo</span>
                </button>
            )}
        </div>
    );
}
