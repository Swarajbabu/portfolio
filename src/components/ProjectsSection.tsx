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
  Maximize2,
  Minimize2
} from "lucide-react";

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
  const [viewAll, setViewAll] = useState<boolean>(false);

  const ITEMS_PER_PAGE = 2; // Keep max 2 projects on screen so page height stays neat and compact

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

  // Reset to first page when filter changes
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(0);
  };

  const paginatedProjects = useMemo(() => {
    if (viewAll) return filteredProjects;
    const start = currentPage * ITEMS_PER_PAGE;
    return filteredProjects.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProjects, currentPage, viewAll]);

  // Keyboard navigation (Left / Right arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewAll || totalPages <= 1) return;
      if (e.key === "ArrowLeft") {
        setCurrentPage((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "ArrowRight") {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewAll, totalPages]);

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
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-6 gap-6">
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

          {/* TOP CONTROLS: Neo-Brutalist Pagination & View All Toggle */}
          <div className="flex flex-wrap items-center gap-3 bg-white border-2 border-black p-2 shadow-[4px_4px_0px_0px_#000]">
            {!viewAll && totalPages > 1 && (
              <div className="flex items-center gap-2">
                {/* Prev Button */}
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                  disabled={currentPage === 0}
                  aria-label="Previous Projects"
                  className={`w-8 h-8 border-2 border-black flex items-center justify-center font-black transition-all neo-btn-press ${
                    currentPage === 0
                      ? "bg-[#FFF9D2] opacity-40 border-black/40 text-black/40 cursor-not-allowed"
                      : "bg-neo-secondary hover:bg-yellow-300 text-black shadow-[2px_2px_0px_0px_#000]"
                  }`}
                  title="Previous projects (or press left arrow)"
                >
                  <ChevronLeft className="h-4 w-4 stroke-[3]" />
                </button>

                {/* Page Number Buttons */}
                {Array.from({ length: totalPages }).map((_, pIdx) => {
                  const isActive = currentPage === pIdx;
                  return (
                    <button
                      key={pIdx}
                      onClick={() => setCurrentPage(pIdx)}
                      className={`w-8 h-8 border-2 border-black font-black text-sm flex items-center justify-center transition-all neo-btn-press ${
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
                  aria-label="Next Projects"
                  className={`w-8 h-8 border-2 border-black flex items-center justify-center font-black transition-all neo-btn-press ${
                    currentPage >= totalPages - 1
                      ? "bg-neo-accent opacity-40 border-black/40 text-black/40 cursor-not-allowed"
                      : "bg-neo-accent hover:bg-red-400 text-black shadow-[2px_2px_0px_0px_#000]"
                  }`}
                  title="Next projects (or press right arrow)"
                >
                  <ChevronRight className="h-4 w-4 stroke-[3]" />
                </button>
              </div>
            )}

            {filteredProjects.length > ITEMS_PER_PAGE && (
              <button
                onClick={() => setViewAll(!viewAll)}
                className="border-2 border-black bg-white hover:bg-neo-secondary px-3.5 py-1.5 font-black text-xs uppercase tracking-wider neo-btn-press shadow-[2px_2px_0px_0px_#000] flex items-center gap-1.5"
              >
                {viewAll ? (
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
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((filter) => {
              const isSelected = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => handleFilterChange(filter)}
                  className={`border-2 border-black px-3 py-1 font-black text-xs uppercase tracking-wider transition-all neo-btn-press ${
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

        {/* Projects Cards Container with Side Floating Arrows */}
        <div className="relative">
          {/* Left Floating Quick Nav Arrow */}
          {!viewAll && currentPage > 0 && (
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              aria-label="Previous Page"
              className="hidden xl:flex absolute -left-7 top-1/2 -translate-y-1/2 z-20 h-14 w-14 border-4 border-black bg-neo-secondary hover:bg-yellow-300 items-center justify-center shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-x-1 transition-all neo-btn-press"
            >
              <ChevronLeft className="h-7 w-7 text-black stroke-[3]" />
            </button>
          )}

          {/* Right Floating Quick Nav Arrow */}
          {!viewAll && currentPage < totalPages - 1 && (
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
              aria-label="Next Page"
              className="hidden xl:flex absolute -right-7 top-1/2 -translate-y-1/2 z-20 h-14 w-14 border-4 border-black bg-neo-accent hover:bg-red-400 items-center justify-center shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:translate-x-1 transition-all neo-btn-press"
            >
              <ChevronRight className="h-7 w-7 text-black stroke-[3]" />
            </button>
          )}

          {/* Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {paginatedProjects.map((project: ProjectCardItem, i: number) => {
              const actualIndex = viewAll ? i : currentPage * ITEMS_PER_PAGE + i;
              const projectNumber = `#0${actualIndex + 1}`;
              const categoryBadge = project.category || (actualIndex === 0 ? "FinTech & Real-Time" : actualIndex === 1 ? "Cloud & DevOps" : "AI & Full Stack");

              return (
                <div
                  key={project.name + actualIndex}
                  className="group border-4 border-black bg-white shadow-[8px_8px_0px_0px_#000] hover:shadow-[14px_14px_0px_0px_#000] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
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

                    {/* Project Links & Actions (Deploy Link only shows if URL exists!) */}
                    <div className="pt-6 border-t-2 border-black/10 flex flex-wrap items-center gap-3">
                      {/* 1. GitHub Code Button (if available) */}
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

                            {/* Show Deploy Button ONLY IF deployLink exists and is valid */}
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
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
