"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

export function RatingStatsCard() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        fetch('/api/ratings')
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error(err));
    }, []);

    if (!stats) return (
        <div className="h-full min-h-[200px] bg-[#111] border border-white/5 rounded-[28px] animate-pulse" />
    );

    // Calculate percentages for bars
    const getPercent = (count: number) => {
        if (!stats.total) return 0;
        return (count / stats.total) * 100;
    };

    return (
        <div className="bg-[#111] border border-white/5 rounded-[28px] p-6 text-white min-h-[300px]">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-lg font-medium text-white">Feedback</h3>
                    <p className="text-sm text-white/40">User experience ratings</p>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-3xl font-bold text-white">{stats.average}</span>
                    <div className="flex text-emerald-500">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                                key={s}
                                className={`w-3 h-3 ${s <= Math.round(stats.average) ? 'fill-current' : 'opacity-30'}`}
                            />
                        ))}
                    </div>
                    <span className="text-xs text-white/30 mt-1">{stats.total} total</span>
                </div>
            </div>

            <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-3">
                        <span className="text-xs font-mono text-white/40 w-3">{star}</span>
                        <Star className="w-3 h-3 text-white/20" />

                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                                style={{ width: `${getPercent(stats.counts[star])}%` }}
                            />
                        </div>

                        <span className="text-xs font-mono text-white/40 w-6 text-right">
                            {stats.counts[star]}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
