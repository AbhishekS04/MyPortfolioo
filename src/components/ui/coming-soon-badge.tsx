import { Hourglass } from "lucide-react";

export const ComingSoonBadge = () => {
    return (
        <div className="group/badge relative inline-flex items-center gap-2 px-5 py-2.5 bg-[#0033FF] text-white rounded-full shadow-xl shadow-black/20 hover:scale-105 transition-all duration-300">
            <Hourglass className="w-4 h-4 fill-current transition-transform duration-[2000ms] ease-in-out group-hover:rotate-[2160deg]" />
            <span className="text-sm font-bold tracking-wide uppercase">Coming Soon</span>
        </div>
    );
};
