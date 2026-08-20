import { useState, useMemo, useEffect } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import {
  ExternalLink,
  Github,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Layers,
  Terminal,
  FolderGit2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2
} from "lucide-react";
import RevealOnScroll from "@/components/RevealOnScroll";

interface ProjectCardItem {
  name: string;
  category?: string;
  year?: string;
  description: string;
  tags: string[];
  links?: { label: string; url: string }[];
  image: string;
  impactPoints?: string[];
  githubUrl?: string;
  deployUrl?: string;
  liveUrl?: string;
}

const ProjectsSection = () => {
  const { data } = usePortfolio();
  const { projects } = data;
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [desktopViewAll, setDesktopViewAll] = useState<boolean>(false);
  const [mobileViewAll, setMobileViewAll] = useState<boolean>(false);

  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const ITEMS_PER_PAGE = 2; // Show 2 projects per page on desktop / medium / laptop

  const filterOptions = ["All", "AI / ML & GPT", "Full Stack & Web", "Cloud & DevOps", "FinTech & Trading"];

  const matchesFilter = (project: ProjectCardItem, filter: string) => {
    if (filter === "All") return true;
    const content = `${project.name || ""} ${project.category || ""} ${project.description || ""} ${(project.tags || []).join(" ")}`.toLowerCase();

    if (filter === "AI / ML & GPT") {
      return content.includes("ai") || content.includes("gpt") || content.includes("openai") || content.includes("machine") || content.includes("model");
    }
    if (filter === "Full Stack & Web") {
      return content.includes("react") || content.includes("node") || content.includes("full-stack") || content.includes("full stack") || content.includes("express") || content.includes("web");
    }
    if (filter === "Cloud & DevOps") {
      return content.includes("aws") || content.includes("docker") || content.includes("kubernetes") || content.includes("terraform") || content.includes("jenkins") || content.includes("cloud");
    }
    if (filter === "FinTech & Trading") {
      return content.includes("trade") || content.includes("stock") || content.includes("fintech") || content.includes("finance") || content.includes("chart") || content.includes("zerodha");
    }
    return content.includes(filter.toLowerCase());
  };

  const filteredProjects = useMemo(() => {
    return projects.cards.filter((p: ProjectCardItem) => matchesFilter(p, activeFilter));
  }, [projects.cards, activeFilter]);

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(0);
    setMobileViewAll(false);
  };

  // Keyboard navigation on desktop / medium / laptop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isMobile || desktopViewAll || totalPages <= 1) return;
      if (e.key === "ArrowLeft") {
        setCurrentPage((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "ArrowRight") {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobile, desktopViewAll, totalPages]);

  const visibleProjects = useMemo(() => {
    if (isMobile) {
      if (mobileViewAll) return filteredProjects;
      return filteredProjects.slice(0, 2);
    } else {
      if (desktopViewAll) return filteredProjects;
      const start = currentPage * ITEMS_PER_PAGE;
      return filteredProjects.slice(start, start + ITEMS_PER_PAGE);
    }
  }, [isMobile, mobileViewAll, desktopViewAll, currentPage, filteredProjects]);

  return (
    <section id="projects" className="py-16 sm:py-24 bg-neo-cream grid-bg relative overflow-hidden text-black">
      {/* Decorative Background Elements */}
      <div className="absolute top-12 left-8 animate-float-y hidden sm:block opacity-20 pointer-events-none">
        <FolderGit2 className="h-28 w-28 text-black" strokeWidth={1} />
      </div>
      <div className="absolute bottom-16 right-10 animate-drift hidden lg:block opacity-20 pointer-events-none">
        <Terminal className="h-32 w-32 text-black" strokeWidth={1} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Top Header */}
        <RevealOnScroll animation="fade-down">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-block border-4 border-black bg-neo-accent px-4 py-1.5 font-black text-sm uppercase tracking-widest shadow-[4px_4px_0px_0px_#000] -rotate-1">
                  {projects.title}
                </span>
                <span className="border-2 border-black bg-white px-3 py-1 font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#000]">
                  {filteredProjects.length} Systems
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight">
                Production Systems & Builds
              </h2>
            </div>

            {/* MEDIUM, LARGE & LAPTOP TOP CONTROLS: [< Prev] [1] [2] [Next >] & [VIEW ALL (N)] */}
            <div className="hidden md:flex flex-wrap items-center gap-3 bg-white border-2 border-black p-2 shadow-[4px_4px_0px_0px_#000]">
              {!desktopViewAll && totalPages > 1 && (
                <div className="flex items-center gap-2">
                  {/* Prev Button */}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                    disabled={currentPage === 0}
                    aria-label="Previous Projects Page"
                    className={`border-2 border-black px-2.5 py-1 font-black text-xs uppercase tracking-wider flex items-center gap-1 transition-all neo-btn-press ${
                      currentPage === 0
                        ? "bg-[#FFF9D2] opacity-40 border-black/40 text-black/40 cursor-not-allowed"
                        : "bg-neo-secondary hover:bg-yellow-300 text-black shadow-[2px_2px_0px_0px_#000]"
                    }`}
                    title="Previous projects"
                  >
                    <ChevronLeft className="h-3.5 w-3.5 stroke-[3]" />
                    <span>Prev</span>
                  </button>

                  {/* Page Number Buttons */}
                  {Array.from({ length: totalPages }).map((_, pIdx) => {
                    const isActive = currentPage === pIdx;
                    return (
                      <button
                        key={pIdx}
                        onClick={() => setCurrentPage(pIdx)}
                        className={`w-7 h-7 border-2 border-black font-black text-xs flex items-center justify-center transition-all neo-btn-press ${
                          isActive
                            ? "bg-black text-white shadow-[2px_2px_0px_0px_#FF6B6B] -translate-y-0.5"
                            : "bg-white text-black hover:bg-yellow-100 shadow-[1px_1px_0px_0px_#000]"
                        }`}
                      >
                        {pIdx + 1}
                      </button>
                    );
                  })}

                  {/* Next Button */}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                    disabled={currentPage >= totalPages - 1}
                    aria-label="Next Projects Page"
                    className={`border-2 border-black px-2.5 py-1 font-black text-xs uppercase tracking-wider flex items-center gap-1 transition-all neo-btn-press ${
                      currentPage >= totalPages - 1
                        ? "bg-neo-accent opacity-40 border-black/40 text-black/40 cursor-not-allowed"
                        : "bg-neo-accent hover:bg-red-400 text-black shadow-[2px_2px_0px_0px_#000]"
                    }`}
                    title="Next projects"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-3.5 w-3.5 stroke-[3]" />
                  </button>
                </div>
              )}

              {filteredProjects.length > ITEMS_PER_PAGE && (
                <button
                  onClick={() => setDesktopViewAll(!desktopViewAll)}
                  className="border-2 border-black bg-white hover:bg-neo-secondary px-3.5 py-1.5 font-black text-xs uppercase tracking-wider neo-btn-press shadow-[2px_2px_0px_0px_#000] flex items-center gap-1.5"
                >
                  {desktopViewAll ? (
                    <>
                      <Minimize2 className="h-3.5 w-3.5" />
                      <span>Compact</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="h-3.5 w-3.5" />
                      <span>View All ({filteredProjects.length})</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* ONLY ON MOBILE / SMALL SCREENS: Simple Item Counter */}
            <div className="md:hidden border-2 border-black bg-white px-3.5 py-1.5 font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] self-start">
              Showing {visibleProjects.length} of {filteredProjects.length}
            </div>
          </div>
        </RevealOnScroll>

        {/* Category Filter Pills */}
        <RevealOnScroll animation="fade-up" delay={100}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((filter) => {
                const isSelected = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => handleFilterChange(filter)}
                    className={`border-2 border-black px-3.5 py-1.5 font-black text-xs uppercase tracking-wider transition-all neo-btn-press ${
                      isSelected
                        ? "bg-black text-white shadow-[3px_3px_0px_0px_#FFD93D] -translate-y-0.5"
                        : "bg-white text-black hover:bg-neo-secondary shadow-[2px_2px_0px_0px_#000]"
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </div>
        </RevealOnScroll>

        {/* Projects Cards Container */}
        <div>
          {/* Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {visibleProjects.map((project: ProjectCardItem, i: number) => {
              const actualIndex = (!isMobile && !desktopViewAll) ? currentPage * ITEMS_PER_PAGE + i : i;
              const projectNumber = `#0${actualIndex + 1}`;
              const categoryBadge = project.category || (actualIndex === 0 ? "FinTech & Real-Time" : actualIndex === 1 ? "Cloud & DevOps" : "AI & Full Stack");

              return (
                <RevealOnScroll key={project.name + actualIndex} animation="fade-up" delay={(i % 2) * 150} className="h-full">
                  <div
                    className="group border-4 border-black bg-white shadow-[8px_8px_0px_0px_#000] hover:shadow-[14px_14px_0px_0px_#000] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden h-full"
                  >
                    {/* Project Image Preview Banner */}
                    <div className="relative border-b-4 border-black bg-black h-56 sm:h-64 overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.name}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                      />
                      
                      {/* Subtle Dark Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                      {/* Top Floating Badges */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                        <span className="border-2 border-black bg-neo-accent text-black px-3 py-1 font-black text-xs uppercase tracking-widest shadow-[3px_3px_0px_0px_#000]">
                          {categoryBadge}
                        </span>
                        <span className="border-2 border-black bg-white text-black px-3 py-1 font-black text-xs uppercase tracking-widest shadow-[3px_3px_0px_0px_#000]">
                          {project.year || "2026"}
                        </span>
                      </div>

                      {/* Bottom Image Overlay Strip */}
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs font-black uppercase tracking-wider pointer-events-none">
                        <span className="flex items-center gap-1.5 bg-black/70 px-2.5 py-1 border border-white/20 backdrop-blur-sm">
                          <span className="h-2 w-2 rounded-full bg-[#22C55E] animate-pulse" />
                          Live Verified System
                        </span>
                        <span className="text-white/80 font-black">{projectNumber}</span>
                      </div>
                    </div>

                    {/* Project Body */}
                    <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                      <div>
                        {/* Project Title */}
                        <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black group-hover:text-neo-accent transition-colors leading-snug mb-3">
                          {project.name}
                        </h3>

                        {/* Description */}
                        <p className="font-bold text-sm sm:text-base text-foreground/80 leading-relaxed mb-6">
                          {project.description}
                        </p>

                        {/* Impact / Architectural Highlights */}
                        {project.impactPoints && project.impactPoints.length > 0 && (
                          <div className="border-2 border-black bg-[#FAF8F5] p-4 shadow-[3px_3px_0px_0px_#000] mb-6 space-y-2.5">
                            <div className="text-[11px] font-black uppercase tracking-widest text-black/60 flex items-center gap-1 mb-1">
                              <Sparkles className="h-3.5 w-3.5 text-[#FF6B6B]" /> Key Architectural Milestones
                            </div>
                            {project.impactPoints.slice(0, 3).map((point: string, j: number) => (
                              <div key={j} className="flex items-start gap-2.5 text-xs sm:text-sm font-bold text-black/90">
                                <CheckCircle2 className="h-4 w-4 text-black flex-shrink-0 mt-0.5" />
                                <span>{point}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Tech Stack Pills */}
                        <div>
                          <div className="text-[11px] font-black uppercase tracking-widest text-black/50 mb-2 flex items-center gap-1">
                            <Layers className="h-3 w-3" /> Core Technologies
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {project.tags.slice(0, 8).map((tag: string) => (
                              <span
                                key={tag}
                                className="border-2 border-black bg-[#F4F1EA] hover:bg-neo-secondary px-2.5 py-1 font-bold text-xs uppercase tracking-wide shadow-[2px_2px_0px_0px_#000] transition-colors"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Project Links & Actions */}
                      <div className="pt-6 border-t-2 border-black/10 flex flex-wrap items-center gap-3">
                        {(() => {
                          const githubLink = project.links?.find((l: { label: string; url: string }) => l.label?.toLowerCase().includes("github"))?.url || project.githubUrl || (project.links?.[0]?.url?.includes("github.com") ? project.links[0].url : "");
                          const deployLink = project.links?.find((l: { label: string; url: string }) => l.label?.toLowerCase().includes("live") || l.label?.toLowerCase().includes("demo") || l.label?.toLowerCase().includes("deploy"))?.url || project.deployUrl || project.liveUrl || (project.links?.[1]?.url || "");

                          const hasValidDeploy = deployLink && deployLink.trim() !== "" && deployLink !== "#";

                          return (
                            <>
                              {githubLink && githubLink.trim() !== "" && (
                                <a
                                  href={githubLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 min-w-[140px] border-2 border-black bg-black text-white px-4 py-3 font-black text-xs uppercase tracking-widest neo-btn-press shadow-[4px_4px_0px_0px_#FF6B6B] hover:bg-neutral-800 flex items-center justify-center gap-2 transition-all"
                                >
                                  <Github className="h-4 w-4" />
                                  <span>GitHub Code</span>
                                </a>
                              )}

                              {hasValidDeploy && (
                                <a
                                  href={deployLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 min-w-[140px] border-2 border-black bg-neo-secondary text-black px-4 py-3 font-black text-xs uppercase tracking-widest neo-btn-press shadow-[4px_4px_0px_0px_#000] hover:bg-yellow-300 flex items-center justify-center gap-2 transition-all"
                                >
                                  <span>Live Deploy</span>
                                  <ArrowUpRight className="h-4 w-4 stroke-[3]" />
                                </a>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>

          {/* DESKTOP / MEDIUM / LAPTOP: BOTTOM NEXT & PREV PAGINATION BAR */}
          {!desktopViewAll && totalPages > 1 && (
            <RevealOnScroll animation="fade-up" delay={200}>
              <div className="hidden md:flex justify-center items-center gap-4 mt-12">
                <button
                  onClick={() => {
                    setCurrentPage((prev) => Math.max(prev - 1, 0));
                    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  disabled={currentPage === 0}
                  aria-label="Previous Page"
                  className={`border-3 border-black px-6 py-3 font-black text-sm uppercase tracking-widest neo-shadow-sm neo-btn-press flex items-center gap-2 transition-all ${
                    currentPage === 0
                      ? "bg-gray-200 opacity-40 border-black/40 text-black/40 cursor-not-allowed"
                      : "bg-neo-accent hover:bg-red-400 text-black shadow-[4px_4px_0px_0px_#000]"
                  }`}
                >
                  <ChevronLeft strokeWidth={3} className="h-5 w-5" />
                  <span>Prev</span>
                </button>

                <div className="border-3 border-black bg-white px-5 py-3 font-black text-sm uppercase tracking-widest shadow-[4px_4px_0px_0px_#000] text-center min-w-[140px]">
                  Page {currentPage + 1} of {totalPages}
                </div>

                <button
                  onClick={() => {
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
                    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  disabled={currentPage >= totalPages - 1}
                  aria-label="Next Page"
                  className={`border-3 border-black px-6 py-3 font-black text-sm uppercase tracking-widest neo-shadow-sm neo-btn-press flex items-center gap-2 transition-all ${
                    currentPage >= totalPages - 1
                      ? "bg-gray-200 opacity-40 border-black/40 text-black/40 cursor-not-allowed"
                      : "bg-neo-accent hover:bg-red-400 text-black shadow-[4px_4px_0px_0px_#000]"
                  }`}
                >
                  <span>Next</span>
                  <ChevronRight strokeWidth={3} className="h-5 w-5" />
                </button>
              </div>
            </RevealOnScroll>
          )}

          {/* ONLY ON MOBILE / SMALL SCREENS: VIEW MORE / SHOW LESS BUTTON */}
          {filteredProjects.length > 2 && (
            <div className="md:hidden mt-8 flex justify-center">
              <button
                onClick={() => setMobileViewAll(!mobileViewAll)}
                className="w-full border-4 border-black bg-neo-secondary hover:bg-yellow-300 text-black px-6 py-4 font-black text-sm uppercase tracking-wider shadow-[6px_6px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000] hover:-translate-y-0.5 transition-all neo-btn-press flex items-center justify-center gap-3"
              >
                {mobileViewAll ? (
                  <>
                    <span>Show Less</span>
                    <ChevronUp className="h-5 w-5 stroke-[3]" />
                  </>
                ) : (
                  <>
                    <span>View More Projects ({filteredProjects.length - 2} More)</span>
                    <ChevronDown className="h-5 w-5 stroke-[3]" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
