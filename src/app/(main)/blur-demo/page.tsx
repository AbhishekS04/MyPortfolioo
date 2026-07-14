'use client';

import { useState } from 'react';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';
import { Terminal } from 'lucide-react';

// Mock content items for scrollable area (defined statically outside render to maintain purity)
const MOCK_LOGS = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  timestamp: `2026-07-14T22:38:${String(i).padStart(2, '0')}Z`,
  event: `SYS_EVENT_0${i}::SUB_SYSTEM_INITIALIZED`,
  details: `Initializing node protocol ${100 - i}% - SECURE_FEED_STABLE`,
}));

export default function BlurDemoPage() {
  const [position, setPosition] = useState<'top' | 'bottom' | 'both'>('bottom');
  const [height, setHeight] = useState('40%');

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 sm:p-12 md:p-24 selection:bg-emerald-500/30 selection:text-emerald-50">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono tracking-widest uppercase">
            <Terminal size={14} className="animate-pulse" />
            Component Playground
          </div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">
            Progressive Blur
          </h1>
          <p className="text-white/40 text-sm font-mono">
            Interactive demonstration of the smooth gradient-blur edge overlay.
          </p>
        </div>

        {/* Controls */}
        <div className="p-6 bg-[#0c0c0c] border border-white/5 rounded-2xl flex flex-wrap gap-6 items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xs uppercase font-black text-white/30 tracking-wider">
              Position:
            </span>
            <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
              {(['top', 'bottom', 'both'] as const).map((pos) => (
                <button
                  key={pos}
                  onClick={() => setPosition(pos)}
                  className={`px-3 py-1.5 rounded-lg text-xs uppercase font-mono transition-all ${
                    position === pos
                      ? 'bg-white/10 text-white font-bold'
                      : 'text-white/40 hover:text-white/80'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs uppercase font-black text-white/30 tracking-wider">
              Height:
            </span>
            <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
              {['20%', '40%', '60%'].map((h) => (
                <button
                  key={h}
                  onClick={() => setHeight(h)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    height === h
                      ? 'bg-white/10 text-white font-bold'
                      : 'text-white/40 hover:text-white/80'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable Container with ProgressiveBlur */}
        <div className="relative border border-white/10 rounded-[32px] overflow-hidden bg-[#0a0a0a] shadow-2xl">
          {/* Scrollable Content */}
          <div className="h-[400px] w-full overflow-y-auto p-8 space-y-4 scrollbar-thin">
            {MOCK_LOGS.map((log) => (
              <div
                key={log.id}
                className="p-5 bg-[#0c0c0c]/80 border border-white/5 rounded-2xl hover:border-white/10 transition-colors"
              >
                <div className="flex justify-between items-center text-[10px] text-white/30 font-mono mb-2 uppercase">
                  <span>{log.timestamp.slice(11, 19)}</span>
                  <span className="text-emerald-500/60 font-bold">
                    Node #{log.id}
                  </span>
                </div>
                <div className="text-sm font-mono text-white/90 font-medium">
                  {log.event}
                </div>
                <div className="text-xs font-mono text-white/50 mt-1">
                  {log.details}
                </div>
              </div>
            ))}
          </div>

          {/* Progressive Blur Overlays */}
          {position === 'both' ? (
            <>
              <ProgressiveBlur
                height={height}
                position="top"
                className="pointer-events-none"
              />
              <ProgressiveBlur
                height={height}
                position="bottom"
                className="pointer-events-none"
              />
            </>
          ) : (
            <ProgressiveBlur
              height={height}
              position={position}
              className="pointer-events-none"
            />
          )}
        </div>
      </div>
    </main>
  );
}
