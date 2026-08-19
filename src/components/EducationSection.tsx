import { usePortfolio } from "@/context/PortfolioContext";
import {
  GraduationCap,
  Sparkles,
  Building2,
  Calendar,
  Award,
  CheckCircle2,
  BookOpen,
  School,
  MapPin,
  Flame
} from "lucide-react";

const EducationSection = () => {
  const { data } = usePortfolio();
  const { education } = data;

  const currentDegree = education.entries[0];
  const previousDegrees = education.entries.slice(1);

  return (
    <section id="education" className="py-20 sm:py-28 bg-neo-cream grid-bg relative overflow-hidden text-black">
      {/* Decorative Background Elements */}
      <div className="absolute top-10 right-10 animate-float-y hidden sm:block opacity-20 pointer-events-none">
        <GraduationCap className="h-28 w-28 text-black" strokeWidth={1} />
      </div>
      <div className="absolute bottom-12 left-6 animate-drift hidden lg:block opacity-20 pointer-events-none">
        <BookOpen className="h-32 w-32 text-black" strokeWidth={1} />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-block border-4 border-black bg-neo-accent px-4 py-1.5 font-black text-sm uppercase tracking-widest shadow-[4px_4px_0px_0px_#000] -rotate-1">
                {education.title}
              </span>
              <span className="border-2 border-black bg-white px-3 py-1 font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#000]">
                {education.entries.length} Milestones
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight">
              Academic Background
            </h2>
            <p className="font-bold text-base text-foreground/70 mt-2 max-w-xl">
              Formal education and rigorous foundational coursework in Computer Science, Machine Learning, and Mathematics.
            </p>
          </div>
        </div>

        {/* Bento Cards Layout */}
        <div className="space-y-6">
          {/* FEATURED SPOTLIGHT CARD: B.TECH CSE (CURRENT DEGREE) */}
          {currentDegree && (
            <div className="border-4 border-black bg-white p-6 sm:p-8 shadow-[8px_8px_0px_0px_#000] hover:shadow-[12px_12px_0px_0px_#000] hover:-translate-y-1 transition-all duration-200">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-6 border-b-2 border-black/10">
                <div className="flex items-center gap-3">
                  <div className="border-2 border-black bg-neo-accent p-3 shadow-[3px_3px_0px_0px_#000]">
                    <GraduationCap className="h-7 w-7 text-black" strokeWidth={2.5} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="border-2 border-black bg-black text-white px-2.5 py-0.5 font-black text-[11px] uppercase tracking-widest">
                        Primary Degree
                      </span>
                      <span className="flex items-center gap-1.5 border border-black bg-[#DCFCE7] px-2.5 py-0.5 font-bold text-[11px] uppercase tracking-wider text-black">
                        <span className="h-2 w-2 rounded-full bg-[#22C55E] animate-pulse" />
                        In Progress
                      </span>
                    </div>
                    <h3 className="font-black text-xl sm:text-2xl lg:text-3xl uppercase tracking-tight text-black">
                      {currentDegree.degree}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="border-2 border-black bg-neo-secondary px-3.5 py-1.5 font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {currentDegree.period}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                {/* University Info & Focus */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center gap-2 font-bold text-base text-black/90">
                    <Building2 className="h-5 w-5 text-black/70 flex-shrink-0" />
                    <span>{currentDegree.org}</span>
                  </div>

                  <div className="space-y-2">
                    {currentDegree.details.map((det: string, dIdx: number) => {
                      if (det.toLowerCase().includes("cgpa")) return null;
                      return (
                        <div key={dIdx} className="flex items-start gap-2 text-sm font-bold text-black/80">
                          <CheckCircle2 className="h-4 w-4 text-black flex-shrink-0 mt-0.5" />
                          <span>{det}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Coursework Tags */}
                  <div className="pt-2">
                    <div className="text-[11px] font-black uppercase tracking-widest text-black/50 mb-2 flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-[#FF6B6B]" /> Core Specializations
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["Artificial Intelligence", "Machine Learning", "Data Structures & Algorithms", "Full Stack Systems", "Cloud Computing"].map((tag) => (
                        <span
                          key={tag}
                          className="border-2 border-black bg-[#FAF8F5] hover:bg-yellow-100 px-3 py-1 font-bold text-xs uppercase tracking-wide shadow-[2px_2px_0px_0px_#000] transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Score Spotlight Box */}
                <div className="border-4 border-black bg-[#FFFDF5] p-6 shadow-[5px_5px_0px_0px_#000] flex flex-col items-center justify-center text-center space-y-2">
                  <div className="border-2 border-black bg-[#FFD93D] p-3 shadow-[2px_2px_0px_0px_#000]">
                    <Award className="h-8 w-8 text-black" strokeWidth={2.5} />
                  </div>
                  <div>
                    <span className="font-black text-2xl sm:text-3xl text-black block tracking-tight">
                      {currentDegree.details.find((d: string) => d.toLowerCase().includes("cgpa") || d.toLowerCase().includes("grade") || d.toLowerCase().includes("percentage")) || "CGPA 7.42"}
                    </span>
                    <span className="text-xs font-black uppercase tracking-widest text-black/60 block mt-1">
                      Academic Standing
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECONDARY DEGREES: 2-COLUMN GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {previousDegrees.map((entry, idx) => {
              const isIntermediate = idx === 0;
              const badgeLabel = isIntermediate ? "Senior Secondary" : "Matriculation";
              const detectedScore = entry.details.find((d: string) => d.toLowerCase().includes("percentage") || d.toLowerCase().includes("cgpa") || d.toLowerCase().includes("grade")) || (isIntermediate ? "94.1% Distinction" : "100% Score");
              const accentColor = isIntermediate ? "bg-[#DFF9FB]" : "bg-[#F3E8FF]";
              const badgeBg = isIntermediate ? "bg-[#22A6B3] text-white" : "bg-[#A855F7] text-white";

              return (
                <div
                  key={idx}
                  className="border-4 border-black bg-white p-6 sm:p-7 shadow-[6px_6px_0px_0px_#000] hover:shadow-[10px_10px_0px_0px_#000] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Meta Bar */}
                    <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b-2 border-black/10">
                      <span className={`border-2 border-black ${badgeBg} px-2.5 py-0.5 font-black text-xs uppercase tracking-widest shadow-[2px_2px_0px_0px_#000]`}>
                        {badgeLabel}
                      </span>
                      <span className="border-2 border-black bg-[#FAF8F5] px-2.5 py-0.5 font-black text-xs uppercase tracking-wider flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {entry.period}
                      </span>
                    </div>

                    {/* Degree Title */}
                    <h4 className="font-black text-lg sm:text-xl uppercase tracking-tight text-black mb-2">
                      {entry.degree}
                    </h4>

                    {/* Institution */}
                    <p className="font-bold text-sm text-black/80 flex items-center gap-2 mb-4">
                      <School className="h-4 w-4 text-black/60 flex-shrink-0" />
                      <span>{entry.org}</span>
                    </p>

                    {/* Details */}
                    <div className="space-y-1.5 mb-6">
                      {entry.details.map((d: string, j: number) => {
                        if (d.toLowerCase().includes("percentage")) return null;
                        return (
                          <div key={j} className="flex items-start gap-2 text-xs sm:text-sm font-bold text-black/70">
                            <CheckCircle2 className="h-3.5 w-3.5 text-black flex-shrink-0 mt-0.5" />
                            <span>{d}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Score Highlight Strip */}
                  <div className={`border-2 border-black ${accentColor} p-3.5 shadow-[3px_3px_0px_0px_#000] flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-black" strokeWidth={2.5} />
                      <span className="font-black text-sm uppercase tracking-tight text-black">
                        {detectedScore}
                      </span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-black/60">
                      Verified
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
