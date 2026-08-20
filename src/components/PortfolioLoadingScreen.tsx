import React, { useState, useEffect } from "react";
import { Server, Coffee, Database, Sparkles, Star, Terminal, Zap, ArrowRight } from "lucide-react";

interface PortfolioLoadingScreenProps {
  onSkip?: () => void;
}

export const PortfolioLoadingScreen: React.FC<PortfolioLoadingScreenProps> = ({ onSkip }) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Stage details based on elapsed cold-start seconds
  const getStageInfo = () => {
    if (elapsedSeconds < 3) {
      return {
        title: "Connecting to Server",
        desc: "Establishing secure link to portfolio backend...",
        progress: Math.min(25, Math.max(8, elapsedSeconds * 8)),
        icon: <Zap className="h-8 w-8 text-black animate-pulse" />,
        badge: "STAGE 1/4 • HANDSHAKE",
      };
    }
    if (elapsedSeconds < 8) {
      return {
        title: "Waking Up Cloud Instance",
        desc: "Render free tier instance is spinning up from sleep mode...",
        progress: Math.min(60, 25 + (elapsedSeconds - 3) * 7),
        icon: <Coffee className="h-8 w-8 text-black animate-bounce" />,
        badge: "STAGE 2/4 • SERVER BOOT",
      };
    }
    if (elapsedSeconds < 14) {
      return {
        title: "Fetching Portfolio Data",
        desc: "Syncing live projects, skills & experiences from MongoDB Atlas...",
        progress: Math.min(88, 60 + (elapsedSeconds - 8) * 5),
        icon: <Database className="h-8 w-8 text-black animate-spin-slow" />,
        badge: "STAGE 3/4 • DATABASE SYNC",
      };
    }
    return {
      title: "Finalizing Experience",
      desc: "Loading assets and assembling interactive components...",
      progress: Math.min(96, 88 + (elapsedSeconds - 14) * 2),
      icon: <Sparkles className="h-8 w-8 text-black animate-pulse-scale" />,
      badge: "STAGE 4/4 • READYING UI",
    };
  };

  const stage = getStageInfo();

  return (
    <div className="min-h-screen bg-neo-cream grid-bg flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden select-none">
      {/* Background Neo-brutalist decorative elements */}
      <div className="absolute top-12 right-10 animate-spin-slow opacity-30 pointer-events-none hidden sm:block">
        <Star className="h-16 w-16 stroke-black fill-neo-secondary neo-shadow-sm" strokeWidth={2} />
      </div>

      <div className="absolute bottom-16 left-12 animate-drift opacity-30 pointer-events-none hidden md:block">
        <div className="p-3 bg-neo-secondary neo-border-thin neo-shadow-sm -rotate-6">
          <Terminal className="h-8 w-8 text-black" />
        </div>
      </div>

      <div className="absolute top-24 left-16 animate-float-y opacity-30 pointer-events-none hidden lg:block">
        <div className="p-3 bg-neo-accent neo-border-thin neo-shadow-sm rotate-6">
          <Server className="h-8 w-8 text-black" />
        </div>
      </div>

      {/* Center Main Loading Card */}
      <div className="bg-white neo-border neo-shadow-lg p-6 sm:p-10 max-w-lg w-full text-center relative z-10 mx-auto">
        {/* Top Brand Chip */}
        <div className="inline-flex items-center gap-2 bg-neo-secondary border-2 border-black px-3.5 py-1 font-black text-xs uppercase tracking-wider neo-shadow-sm mb-6 -rotate-1">
          <span className="h-2 w-2 rounded-full bg-black animate-ping" />
          <span>SWARAJ VECHA • PORTFOLIO</span>
        </div>

        {/* Animated Icon Box */}
        <div className="w-20 h-20 mx-auto mb-6 bg-neo-accent neo-border neo-shadow-sm flex items-center justify-center rotate-2">
          {stage.icon}
        </div>

        {/* Stage Badge */}
        <div className="inline-block bg-neo-muted neo-border-thin px-2.5 py-0.5 font-bold text-[11px] uppercase tracking-wider mb-2">
          {stage.badge}
        </div>

        {/* Main Loading Title */}
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black mb-2">
          {stage.title}
        </h2>

        {/* Dynamic Descriptive Subtext */}
        <p className="text-sm font-semibold text-gray-700 min-h-[2.5rem] flex items-center justify-center mb-6 px-2">
          {stage.desc}
        </p>

        {/* Neo-brutalist Progress Bar */}
        <div className="w-full bg-[#f0ede6] border-3 border-black h-6 p-0.5 shadow-[4px_4px_0px_0px_#000] mb-3 overflow-hidden">
          <div
            className="h-full bg-neo-secondary border-r-2 border-black transition-all duration-500 ease-out flex items-center justify-end pr-2 font-black text-[10px] text-black tracking-wider"
            style={{ width: `${stage.progress}%` }}
          >
            {Math.round(stage.progress)}%
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center justify-between text-xs font-bold text-gray-700 px-1 mb-6">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
            </span>
            <span>Server Initializing</span>
          </div>
          <div className="font-mono bg-gray-100 border border-black px-2 py-0.5">
            ⏱️ {elapsedSeconds}s
          </div>
        </div>

        {/* Render Free-Tier Explainer Box */}
        <div className="bg-neo-cream border-2 border-black p-3.5 text-left neo-shadow-sm mb-4">
          <div className="flex items-start gap-2.5">
            <div className="p-1 bg-neo-secondary border border-black text-xs font-black shrink-0 mt-0.5">
              💡 NOTE
            </div>
            <p className="text-xs font-semibold text-gray-800 leading-relaxed">
              Render&apos;s free backend sleeps when inactive. On the first visit, cold-start initialization takes ~10–15 seconds to boot and retrieve live data.
            </p>
          </div>
        </div>

        {/* Skip to Local / Cached Data fallback if waiting > 7s */}
        {elapsedSeconds >= 7 && onSkip && (
          <div className="pt-2">
            <button
              onClick={onSkip}
              className="inline-flex items-center gap-1.5 text-xs font-black text-black bg-white border-2 border-black px-3.5 py-1.5 hover:bg-neo-secondary transition-colors neo-btn-press shadow-[3px_3px_0px_0px_#000]"
            >
              <span>Continue with local fallback data</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioLoadingScreen;
