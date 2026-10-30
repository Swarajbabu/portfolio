/**
 * ==============================================================================
 * SECTION: HeroSection
 * ==============================================================================
 * Purpose:
 *   The landing hero banner that introduces the developer with:
 *   - Current role badge & animated rotating headlines
 *   - Dynamic cycling typing text for technologies built with
 *   - Primary & Secondary Call-to-Action (CTA) buttons (Projects & Resume)
 *   - Neo-brutalist framed profile avatar with animated floating badges
 *
 * Data Source:
 *   - `usePortfolio().data.hero` & `usePortfolio().data.personal`
 * ==============================================================================
 */

import { useState, useEffect } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { ArrowRight, Star, Download, Terminal, Cpu, Database } from "lucide-react";
import defaultHeroImage from "@/assets/swaraj-hero.jpg";

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export const HeroSection = () => {
  /* 1. DATA & STATE -------------------------------------------------------- */
  const { data } = usePortfolio();
  if (!data) return null;
  const { hero, personal } = data;
  const [currentWord, setCurrentWord] = useState<number>(0);

  const firstName = personal.name.split(" ")[0] || "Swaraj";

  /* 2. TYPING / WORD ROTATION EFFECT --------------------------------------- */
  useEffect(() => {
    const cycleLength = hero.typingCycle?.length || 1;
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % cycleLength);
    }, 2000);
    return () => clearInterval(interval);
  }, [hero.typingCycle]);

  /* 3. EVENT HANDLERS ------------------------------------------------------ */
  const handleScrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  /* 4. RENDER -------------------------------------------------------------- */
  return (
    <section 
      id="hero" 
      className="min-h-screen pt-16 bg-neo-cream grid-bg relative overflow-hidden"
      aria-label="Hero Section"
    >
      {/* 4.1 DECORATIVE FLOATING NEO-ELEMENTS */}
      <div className="absolute top-24 right-8 sm:right-16 animate-spin-slow z-0 opacity-20 sm:opacity-100 pointer-events-none">
        <Star className="h-12 w-12 sm:h-20 sm:w-20 stroke-black fill-neo-secondary neo-shadow-sm" strokeWidth={2} />
      </div>

      <div className="absolute top-1/2 right-1/4 animate-drift z-0 hidden xl:block pointer-events-none">
        <div className="p-2 bg-neo-secondary neo-border-thin neo-shadow-sm -rotate-3">
          <Terminal className="h-6 w-6 sm:h-10 sm:w-10 text-black" />
        </div>
      </div>

      <div className="absolute bottom-20 right-10 animate-float-x z-0 hidden md:block pointer-events-none">
        <div className="p-3 bg-neo-accent neo-border-thin neo-shadow-sm rotate-12">
          <Database className="h-8 w-8 sm:h-12 sm:w-12 text-black" />
        </div>
      </div>

      <div className="absolute top-20 left-1/2 -translate-x-1/2 animate-wiggle z-0 opacity-20 hidden lg:block pointer-events-none">
        <Cpu className="h-16 w-16 text-neo-muted" strokeWidth={1} />
      </div>

      {/* 4.2 MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col-reverse lg:flex-row items-center justify-between min-h-[calc(100vh-4rem)] py-12 gap-8 lg:gap-12">
        
        {/* --- LEFT: Headings, Typing Badge & Action Buttons --- */}
        <div className="flex-1 z-10">
          {/* Role Pill */}
          <div className="mb-6">
            <span className="inline-block neo-border bg-neo-accent px-4 py-2 font-black text-sm uppercase tracking-widest neo-shadow-sm rotate-1">
              {personal.role}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-4">
            <span className="block">{hero.headlineOne.split(" ")[0]}</span>
            <span className="block text-stroke">{hero.headlineOne.split(" ").slice(1).join(" ")}</span>
          </h1>

          {/* Dynamic Technology Typing Badge */}
          <div className="neo-border bg-card inline-block px-6 py-3 neo-shadow-md mb-8 -rotate-1 max-w-xl">
            <p className="font-bold text-lg sm:text-xl">
              I build things with{" "}
              <span className="inline-block bg-neo-secondary px-2 border-2 border-foreground font-black transition-all duration-300">
                {hero.typingCycle[currentWord] || hero.typingCycle[0]}
              </span>
            </p>
          </div>

          {/* Subheadline Summary */}
          <p className="font-bold text-lg sm:text-xl max-w-lg mb-10 leading-relaxed text-black/85">
            {hero.subheadline}
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Primary CTA: Smooth Scroll to Projects */}
            <button
              onClick={handleScrollToProjects}
              className="neo-border bg-neo-accent px-8 py-4 font-black text-lg uppercase tracking-wide neo-shadow-md neo-btn-press flex items-center justify-center gap-3 hover:brightness-105 transition-all"
            >
              {hero.primaryCta}
              <ArrowRight strokeWidth={3} className="h-6 w-6" />
            </button>

            {/* Secondary CTA: Download CV */}
            <a
              href={personal.resumeUrl}
              download={`${personal.name.replace(/\s+/g, "_")}_CV.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="neo-border bg-neo-secondary px-8 py-4 font-black text-lg uppercase tracking-wide neo-shadow-md neo-btn-press flex items-center justify-center gap-3 hover:brightness-105 transition-all"
            >
              {hero.secondaryCta}
              <Download strokeWidth={3} className="h-6 w-6" />
            </a>
          </div>
        </div>

        {/* --- RIGHT: Profile Avatar with Neo-Brutalist Frame --- */}
        <div className="flex-shrink-0 relative z-10">
          {/* Layered Color Offset Shadows */}
          <div className="absolute inset-0 bg-neo-accent neo-border translate-x-4 translate-y-4 sm:translate-x-6 sm:translate-y-6" />
          <div className="absolute inset-0 bg-neo-secondary neo-border translate-x-2 translate-y-2 sm:translate-x-3 sm:translate-y-3" />

          {/* Avatar Container */}
          <div className="relative neo-border bg-neo-cream p-3 sm:p-4" style={{ boxShadow: "8px 8px 0px 0px #000" }}>
            <div className="neo-border overflow-hidden">
              <img
                src={personal.avatar || defaultHeroImage}
                alt={personal.name}
                className="w-56 h-72 sm:w-72 sm:h-96 object-cover object-top hover:scale-105 transition-all duration-300"
              />
            </div>

            {/* Name Badge */}
            <div 
              className="absolute -bottom-4 -right-4 sm:-bottom-5 sm:-right-5 neo-border bg-neo-accent px-3 py-1.5 sm:px-4 sm:py-2 rotate-3 z-20"
              style={{ boxShadow: "4px 4px 0px 0px #000" }}
            >
              <span className="font-black text-xs sm:text-sm uppercase tracking-widest">{firstName} ★</span>
            </div>

            {/* Accent Star Tag */}
            <div 
              className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 neo-border bg-neo-muted p-1.5 sm:p-2 -rotate-6 z-20"
              style={{ boxShadow: "3px 3px 0px 0px #000" }}
            >
              <Star className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={3} fill="black" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
