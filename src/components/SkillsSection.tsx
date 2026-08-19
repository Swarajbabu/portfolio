import { useState, useMemo } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import {
  Sparkles,
  Bot,
  Code2,
  Layout,
  Server,
  Database,
  Cloud,
  Wrench,
  Users,
  Search,
  CheckCircle2,
  Terminal,
  Cpu,
  Layers,
  Zap
} from "lucide-react";

// Curated Vibrant Neo-Color Themes for each Domain
const categoryMeta: Record<string, {
  icon: any;
  cardBg: string;
  headerBg: string;
  headerText: string;
  iconBg: string;
  dotColor: string;
  badgeBg: string;
}> = {
  "AI & Machine Learning": {
    icon: Bot,
    cardBg: "bg-[#FFF9E6]",
    headerBg: "bg-[#FF6B6B]",
    headerText: "text-white",
    iconBg: "bg-[#FFD93D]",
    dotColor: "bg-[#FF6B6B]",
    badgeBg: "bg-black text-white",
  },
  "Languages": {
    icon: Code2,
    cardBg: "bg-[#E6F9FB]",
    headerBg: "bg-[#22A6B3]",
    headerText: "text-white",
    iconBg: "bg-white",
    dotColor: "bg-[#22A6B3]",
    badgeBg: "bg-[#22A6B3] text-white",
  },
  "Frontend": {
    icon: Layout,
    cardBg: "bg-[#EEF2FF]",
    headerBg: "bg-[#6366F1]",
    headerText: "text-white",
    iconBg: "bg-[#FFD93D]",
    dotColor: "bg-[#6366F1]",
    badgeBg: "bg-[#6366F1] text-white",
  },
  "Backend": {
    icon: Server,
    cardBg: "bg-[#FFF1F2]",
    headerBg: "bg-[#EF4444]",
    headerText: "text-white",
    iconBg: "bg-white",
    dotColor: "bg-[#EF4444]",
    badgeBg: "bg-[#EF4444] text-white",
  },
  "Databases": {
    icon: Database,
    cardBg: "bg-[#FEFCE8]",
    headerBg: "bg-[#F59E0B]",
    headerText: "text-black",
    iconBg: "bg-white",
    dotColor: "bg-[#F59E0B]",
    badgeBg: "bg-black text-white",
  },
  "Cloud & DevOps": {
    icon: Cloud,
    cardBg: "bg-[#F0F9FF]",
    headerBg: "bg-[#0284C7]",
    headerText: "text-white",
    iconBg: "bg-[#FFD93D]",
    dotColor: "bg-[#0284C7]",
    badgeBg: "bg-[#0284C7] text-white",
  },
  "Tools & Platforms": {
    icon: Wrench,
    cardBg: "bg-[#FAF5FF]",
    headerBg: "bg-[#A855F7]",
    headerText: "text-white",
    iconBg: "bg-white",
    dotColor: "bg-[#A855F7]",
    badgeBg: "bg-[#A855F7] text-white",
  },
  "Soft Skills": {
    icon: Users,
    cardBg: "bg-[#F0FDF4]",
    headerBg: "bg-[#22C55E]",
    headerText: "text-white",
    iconBg: "bg-[#FFD93D]",
    dotColor: "bg-[#22C55E]",
    badgeBg: "bg-[#22C55E] text-white",
  },
};

const SkillsSection = () => {
  const { data } = usePortfolio();
  const { skills } = data;
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = ["All", ...skills.groups.map((g) => g.heading)];

  // Filter skills based on selected category & search query
  const filteredGroups = useMemo(() => {
    return skills.groups
      .filter((group) => activeCategory === "All" || group.heading === activeCategory)
      .map((group) => {
        if (!searchQuery.trim()) return group;
        const matchingItems = group.items.filter((item) =>
          item.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return { ...group, items: matchingItems };
      })
      .filter((group) => group.items.length > 0);
  }, [skills.groups, activeCategory, searchQuery]);

  const totalSkillCount = useMemo(() => {
    return skills.groups.reduce((acc, g) => acc + g.items.length, 0);
  }, [skills.groups]);

  return (
    <section id="skills" className="py-20 sm:py-32 bg-neo-cream grid-bg relative overflow-hidden text-black">
      {/* Subtle Background Elements */}
      <div className="absolute top-10 right-10 animate-float-y hidden sm:block opacity-25 pointer-events-none">
        <Cpu className="h-28 w-28 text-black" strokeWidth={1} />
      </div>
      <div className="absolute bottom-16 left-8 animate-drift hidden lg:block opacity-20 pointer-events-none">
        <Terminal className="h-32 w-32 text-black" strokeWidth={1} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-block border-4 border-black bg-neo-accent px-4 py-2 font-black text-sm uppercase tracking-widest shadow-[4px_4px_0px_0px_#000] -rotate-1">
                {skills.title}
              </span>
              <span className="border-2 border-black bg-white px-3 py-1 font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#000]">
                {totalSkillCount} Core Skills
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight">
              Technical Arsenal & Expertise
            </h2>
            <p className="font-bold text-base text-foreground/70 mt-2 max-w-xl">
              Specialized tools, frameworks, and methodologies I leverage to design scalable full-stack applications and intelligent AI systems.
            </p>
          </div>

          {/* Quick Search Bar */}
          <div className="relative min-w-[260px] sm:min-w-[320px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-black/60" />
            <input
              type="text"
              placeholder="Search skill (e.g. PyTorch, React, AWS)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-3 border-black bg-white pl-10 pr-4 py-3 font-bold text-sm text-black placeholder:text-black/40 focus:bg-yellow-50 focus:outline-none shadow-[4px_4px_0px_0px_#000] transition-all"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`border-2 border-black px-4 py-2 font-black text-xs uppercase tracking-wider transition-all neo-btn-press ${
                  isSelected
                    ? "bg-black text-white shadow-[4px_4px_0px_0px_#FFD93D] -translate-y-0.5"
                    : "bg-white text-black hover:bg-neo-secondary shadow-[2px_2px_0px_0px_#000]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Vibrant Colorful Bento Cards Grid */}
        {filteredGroups.length === 0 ? (
          <div className="border-4 border-black bg-white p-12 text-center shadow-[6px_6px_0px_0px_#000]">
            <p className="font-black text-lg uppercase tracking-wide">No matching skills found for "{searchQuery}"</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
              className="mt-4 border-2 border-black bg-neo-accent px-4 py-2 font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] neo-btn-press"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredGroups.map((group, idx) => {
              const meta = categoryMeta[group.heading] || {
                icon: Layers,
                cardBg: "bg-[#FFFDF5]",
                headerBg: "bg-black",
                headerText: "text-white",
                iconBg: "bg-[#FFD93D]",
                dotColor: "bg-black",
                badgeBg: "bg-black text-white",
              };
              const IconComponent = meta.icon;
              const isHighlight = group.heading === "AI & Machine Learning";

              return (
                <div
                  key={group.heading + idx}
                  className={`group border-4 border-black ${meta.cardBg} shadow-[7px_7px_0px_0px_#000] hover:shadow-[12px_12px_0px_0px_#000] hover:-translate-y-1.5 transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                    isHighlight && activeCategory === "All" && !searchQuery
                      ? "md:col-span-2 lg:col-span-2"
                      : ""
                  }`}
                >
                  {/* Vibrant Card Top Header Bar */}
                  <div className={`border-b-3 border-black ${meta.headerBg} ${meta.headerText} p-3.5 sm:p-4 flex items-center justify-between`}>
                    <div className="flex items-center gap-2.5">
                      <div className={`border-2 border-black ${meta.iconBg} p-1.5 shadow-[2px_2px_0px_0px_#000] text-black`}>
                        <IconComponent className="h-4 w-4" strokeWidth={2.5} />
                      </div>
                      <div>
                        <h3 className="font-black text-base sm:text-lg uppercase tracking-tight leading-none">
                          {group.heading}
                        </h3>
                        {isHighlight && (
                          <span className="text-[9px] font-black uppercase tracking-widest text-yellow-200 flex items-center gap-1 mt-0.5">
                            <Sparkles className="h-2.5 w-2.5 inline" /> Primary Specialization
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="border-2 border-black bg-white text-black px-2 py-0.5 font-black text-[10px] sm:text-xs shadow-[2px_2px_0px_0px_#000]">
                      {group.items.length} Skills
                    </span>
                  </div>

                  {/* Card Content with Compact High-Contrast Badges */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <div
                          key={item}
                          className="border-2 border-black bg-white hover:bg-black hover:text-white px-2.5 py-1 font-bold text-[11px] sm:text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#FFD93D] hover:-translate-y-0.5 transition-all duration-150 flex items-center gap-1.5 cursor-default group/pill"
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${meta.dotColor} group-hover/pill:bg-[#FFD93D] transition-colors`} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Micro-Badge */}
                    <div className="pt-2.5 border-t border-black/10 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-black/60">
                      <span className="flex items-center gap-1">
                        <Zap className="h-3 w-3 text-black" /> Production Ready
                      </span>
                      <CheckCircle2 className="h-3.5 w-3.5 text-black/50" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default SkillsSection;
