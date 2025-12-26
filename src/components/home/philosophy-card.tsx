export function PhilosophyCard() {
    return (
        <div className="w-full h-full bg-[#1c1c1c] rounded-[32px] p-8 flex flex-col justify-between group relative overflow-hidden border border-white/5">

            {/* Header */}
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Typography & Main Colors</span>
            </div>

            {/* Main Content */}
            <div className="flex flex-col gap-4 mt-2">
                {/* Large Typography Preview */}
                <h2 className="text-7xl font-sans font-medium text-white tracking-tight leading-none">
                    Aa
                </h2>

                {/* Alphabet Sample */}
                <p className="text-xs text-white/40 font-mono leading-relaxed uppercase tracking-widest max-w-[80%]">
                    ABCDEFGHIJKLM<br />NOPQRSTUVWXYZ
                </p>
            </div>

            {/* Footer / Colors */}
            <div className="flex items-center gap-3 mt-auto pt-6">
                <div className="w-10 h-10 rounded-xl bg-[#FF4D00] shadow-sm ring-1 ring-white/10" />
                <div className="w-10 h-10 rounded-xl bg-[#FFB800] shadow-sm ring-1 ring-white/10" />
                <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] shadow-sm ring-1 ring-white/10 border border-white/10" />
                <div className="w-10 h-10 rounded-xl bg-[#9CA3AF] shadow-sm ring-1 ring-white/10" />
                <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] shadow-sm ring-1 ring-white/10" />
            </div>

            {/* Gentle Noise/Texture */}
            <div className="absolute inset-0 bg-white/[0.02] pointer-events-none mix-blend-overlay" />
        </div>
    )
}
