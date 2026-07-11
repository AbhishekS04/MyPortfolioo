"use client";

import {
  m,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Smartphone,
  Crosshair,
  X,
  Zap,
  Cpu,
  Shield,
  Activity,
  Trophy,
  Binary,
  Wifi,
  Terminal,
} from "lucide-react";
import { useState, useRef, MouseEvent, useEffect } from "react";

// --- CYBER-SPEC DATA --- //
const GAMES = [
  {
    id: "bgmi",
    name: "BGMI",
    fullname: "BATTLEGROUNDS MOBILE INDIA",
    ign: "AbhiOp",
    kd: "5.2",
    rank: "Conqueror Grade",
    icon: Smartphone,
    accent: "#10b981", // Emerald
    unit: "01",
  },
  {
    id: "codm",
    name: "CODM",
    fullname: "Call of Duty: Mobile",
    ign: "Ghost_04",
    kd: "3.8",
    rank: "Legendary Series",
    icon: Crosshair,
    accent: "#f59e0b", // Amber
    unit: "02",
  },
];

// --- 3D TILT POD COMPONENT --- //
interface CombatPodProps {
  children: React.ReactNode;
  onClick: () => void;
  accent: string;
}
function CombatPod({ children, onClick, accent }: CombatPodProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 400, damping: 60 });
  const mouseY = useSpring(y, { stiffness: 400, damping: 60 });

  function onMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set(clientX - left - width / 2);
    y.set(clientY - top - height / 2);
  }
  const rotateX = useTransform(mouseY, [-150, 150], [8, -8]);
  const rotateY = useTransform(mouseX, [-150, 150], [-8, 8]);

  return (
    <m.div
      style={{ perspective: 1000 }}
      className="group relative cursor-pointer w-full max-w-[300px] sm:max-w-sm"
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <m.div
        style={{ rotateX, rotateY }}
        className="aspect-[4/5] md:aspect-square relative preserve-3d transition-all duration-500 rounded-[32px] overflow-hidden bg-[#0a0a0a] border border-white/5 flex flex-col"
      >
        {/* Visual Layers */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

        {/* Floating Glow */}
        <m.div
          className="absolute -inset-[100px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${accent}88 0%, transparent 70%)`,
          }}
        />

        {children}

        {/* Neon Corner Accents */}
        <div className="absolute top-0 right-0 p-4">
          <div
            className="w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_10px_currentColor]"
            style={{ backgroundColor: accent, color: accent }}
          />
        </div>
      </m.div>
    </m.div>
  );
}

export default function GamingPage() {
  const [selectedGame, setSelectedGame] = useState<
    (typeof GAMES)[number] | null
  >(null);
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white/20 font-mono flex flex-col items-center relative overflow-x-hidden max-w-full">
      {/* --- CYBER BACKGROUND SYSTEM (STRICT BOUNDARIES) --- */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Tech Grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        {/* Center Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at center, transparent 0%, #050505 90%)",
          }}
        />

        {/* Wandering Pulse (Clamped to prevent overflow) */}
        <m.div
          animate={{
            left: ["-5%", "70%", "-5%"],
            top: ["10%", "60%", "10%"],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute w-[500px] h-[500px] blur-[150px] opacity-[0.04] bg-emerald-500 rounded-full"
        />
      </div>

      {/* --- NAVIGATION HUD --- */}
      <header className="fixed top-0 inset-x-0 p-4 sm:p-6 lg:p-8 z-50 flex justify-between items-start pointer-events-none">
        <div className="flex flex-col gap-3 pointer-events-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/5 backdrop-blur-2xl border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all group shadow-xl"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="uppercase tracking-[0.2em] text-[9px] font-black">
              Archive_Exit
            </span>
          </button>

          <div className="hidden md:flex items-center gap-3 text-[7px] uppercase font-black tracking-widest text-white/10 ml-1">
            <div className="flex items-center gap-1.5">
              <Wifi size={9} /> LINK_UP
            </div>
            <div className="flex items-center gap-1.5">
              <Terminal size={9} /> NODE_04
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end text-right pointer-events-auto">
          <div className="flex items-center gap-2.5 text-white/70 font-black tabular-nums">
            <span className="text-base sm:text-2xl tracking-tighter">
              {currentTime}
            </span>
            <div className="w-[1px] h-4 sm:h-6 bg-white/10" />
            <span className="text-[9px] uppercase tracking-[0.2em] text-emerald-500/50 font-bold hidden xs:inline">
              Feed_On
            </span>
          </div>
          <p className="text-[7px] uppercase tracking-widest text-white/10 font-black mt-1">
            SYS_REL_2.6
          </p>
        </div>
      </header>

      {/* --- MAIN INTERFACE (SAFE ZONES) --- */}
      <main className="relative z-10 w-full max-w-5xl flex flex-col items-center pt-28 sm:pt-40 pb-20 px-4 overflow-x-hidden">
        {/* Tech Title */}
        <m.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-14 sm:mb-24 text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-[8px] uppercase font-black text-emerald-500/60 tracking-[0.3em]">
            <Binary size={10} className="animate-pulse" />
            Accessing Identity_Grid
          </div>
          <h1 className="text-[42px] sm:text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-tight opacity-95">
            Gaming <br className="sm:hidden" /> Profile
          </h1>
        </m.div>

        {/* Grid of Pods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 w-full place-items-center">
          {GAMES.map((game, i) => (
            <m.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="w-full flex justify-center"
            >
              <CombatPod
                onClick={() => setSelectedGame(game)}
                accent={game.accent}
              >
                <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-between z-10">
                  <div className="flex justify-between items-start">
                    <div className="text-5xl font-black opacity-[0.03] text-white italic select-none">
                      {game.unit}
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/5 group-hover:bg-white/20 transition-all">
                      <game.icon
                        size={28}
                        className="text-white/40 group-hover:text-white transition-all transform group-hover:scale-110"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-[1px] bg-emerald-500/30" />
                        <span className="text-[9px] uppercase font-black text-white/30 tracking-[0.2em]">
                          {game.fullname}
                        </span>
                      </div>
                      <h2 className="text-5xl font-black uppercase italic tracking-tighter group-hover:translate-x-1 transition-transform">
                        {game.name}
                      </h2>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-white/5 group-hover:border-white/10 transition-colors">
                      <div className="flex flex-col">
                        <span className="text-[7px] uppercase font-black text-white/20 tracking-widest mb-0.5">
                          Rec_Status
                        </span>
                        <span className="text-[11px] font-black uppercase text-emerald-500/80 group-hover:text-emerald-400">
                          Expand identity &rarr;
                        </span>
                      </div>
                      <Cpu size={16} className="text-white/10" />
                    </div>
                  </div>
                </div>
              </CombatPod>
            </m.div>
          ))}
        </div>
      </main>

      {/* --- IDENTITY SHEET (MODAL) --- */}
      <AnimatePresence>
        {selectedGame && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedGame(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-4 sm:p-10"
          >
            <m.div
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl bg-[#0c0c0c] border border-white/10 rounded-[42px] sm:rounded-[64px] overflow-hidden flex flex-col relative p-10 sm:p-16 shadow-[0_0_150px_-30px_rgba(255,255,255,0.08)] max-h-[95vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]"
            >
              {/* HUD Corners */}
              <div className="absolute top-8 left-8 w-5 h-5 border-t border-l border-white/10" />
              <div className="absolute bottom-8 right-8 w-5 h-5 border-b border-r border-white/10" />
              <Shield
                size={160}
                className="absolute -bottom-14 -right-14 text-white/[0.01] pointer-events-none"
              />

              <div className="flex justify-between items-start mb-14">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 text-emerald-500 font-black text-[10px] tracking-[0.4em] uppercase">
                    <div className="w-2 h-2 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    Verified_Node_Access
                  </div>
                  <h3 className="text-5xl sm:text-7xl font-black uppercase italic tracking-tighter leading-none">
                    {selectedGame.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedGame(null)}
                  className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all group shrink-0"
                >
                  <X
                    size={20}
                    className="group-hover:rotate-90 transition-transform text-white/40 group-hover:text-white"
                  />
                </button>
              </div>

              <div className="space-y-12">
                {/* Operative ID Section */}
                <div className="space-y-3">
                  <p className="text-[10px] uppercase font-black text-white/20 tracking-[0.5em]">
                    Identity_ID
                  </p>
                  <div className="flex items-center gap-6">
                    <p className="text-5xl sm:text-7xl font-black tracking-tighter text-white/90">
                      {selectedGame.ign}
                    </p>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-emerald-500/40 to-transparent" />
                  </div>
                </div>

                {/* Combat Grid */}
                <div className="grid grid-cols-2 gap-10 sm:gap-14 pt-12 border-t border-white/5">
                  <div className="space-y-3">
                    <p className="text-[10px] uppercase font-black text-white/20 tracking-[0.3em] flex items-center gap-2">
                      <Zap size={14} className="text-emerald-500/50" />{" "}
                      Performance
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl sm:text-6xl font-black tabular-nums">
                        {selectedGame.kd}
                      </span>
                      <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                        K/D
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] uppercase font-black text-white/20 tracking-[0.3em] flex items-center gap-2">
                      <Trophy size={14} className="text-emerald-500/50" />{" "}
                      Rank_Class
                    </p>
                    <p className="text-2xl sm:text-3xl font-black text-white/80 uppercase italic tracking-tight">
                      {selectedGame.rank}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer HUD info */}
              <div className="mt-16 pt-10 border-t border-white/5 flex justify-between items-center text-[10px] uppercase font-black tracking-[0.3em] text-white/5 select-none">
                <span>SYSTEM_ID: 0x84_GAMING</span>
                <span className="text-emerald-500/20">Archive.04</span>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>

      {/* --- BOTTOM HUD TICKER (DESKTOP) --- */}
      <footer className="fixed bottom-0 inset-x-0 p-8 z-40 hidden lg:flex justify-between items-center pointer-events-none opacity-20">
        <div className="text-[9px] uppercase font-black tracking-[0.6em] text-white/30">
          SVR_G_PROTOCOL_V6
        </div>
        <div className="flex gap-10 text-[8px] uppercase font-black tracking-[0.3em] text-white/20">
          <span className="flex items-center gap-2">
            <Cpu size={10} /> UNIT_SYNC_DONE
          </span>
          <span className="flex items-center gap-2">
            <Binary size={10} /> DECRYPT_PASSED
          </span>
        </div>
      </footer>
    </div>
  );
}
