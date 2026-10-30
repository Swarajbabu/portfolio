/**
 * ==============================================================================
 * SECTION: ProjectsSection (Recruiter 15-Second High-Conversion Showcase)
 * ==============================================================================
 * Purpose:
 *   Engineered for maximum recruiter impact & 15-second scanability:
 *   - Instant 3-Column Grid on Desktop: Top 6 projects visible directly
 *   - "Load More / View More" Expand Toggle if more than 6 projects exist
 *   - Instant Visual Hierarchy: Title -> 1-Line Value Hook -> Key Highlights -> Tech Pills -> CTAs
 *   - 1-Click Direct Links: High-contrast [GitHub Code] & [Live Demo ↗] buttons
 *   - Fast Category Filter Chips (AI/ML, Full Stack, DevOps, FinTech)
 *
 * Data Source:
 *   - `usePortfolio().data.projects`
 * ==============================================================================
 */

import { useState, useMemo, useEffect } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import {
  Github,
  ArrowUpRight,
  CheckCircle2,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FolderGit2,
  Terminal
} from "lucide-react";
import RevealOnScroll from "@/showcase/components/common/RevealOnScroll";
import { getOptimizedImageUrl } from "@/core/utils/imageOptimizer";

/* -------------------------------------------------------------------------- */
/* 1. TYPES & CONSTANTS                                                       */
/* -------------------------------------------------------------------------- */

export interface ProjectLink {
  label: string;
  url: string;
}

export interface ProjectCardItem {
  name: string;
  category?: string;
  year?: string;
  description: string;
  tags: string[];
  links?: ProjectLink[];
  image: string;
  impactPoints?: string[];
  githubUrl?: string;
  deployUrl?: string;
  liveUrl?: string;
}

const FILTER_OPTIONS = [
  "All",
  "AI / ML & GPT",
  "Full Stack & Web",
  "Cloud & DevOps",
  "FinTech & Trading"
];

const INITIAL_PROJECTS_COUNT = 6;

/* -------------------------------------------------------------------------- */
/* 2. FILTER HELPER FUNCTION                                                  */
/* -------------------------------------------------------------------------- */

const matchesFilter = (project: ProjectCardItem, filter: string): boolean => {
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

/* -------------------------------------------------------------------------- */
/* 3. COMPONENT                                                               */
/* -------------------------------------------------------------------------- */

export const ProjectsSection = () => {
  /* 3.1 DATA & STATE ------------------------------------------------------- */
  const { data } = usePortfolio();
  if (!data) return null;
  const { projects } = data;

  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [showAllProjects, setShowAllProjects] = useState<boolean>(false);

  /* 3.2 FILTERED PROJECTS COMPUTATION -------------------------------------- */
  const filteredProjects = useMemo(() => {
    return (projects.cards || []).filter((p: ProjectCardItem) => matchesFilter(p, activeFilter));
  }, [projects.cards, activeFilter]);

  // Reset showAll when filter changes
  useEffect(() => {
    setShowAllProjects(false);
  }, [activeFilter]);

  const displayedProjects = useMemo(() => {
    if (showAllProjects) return filteredProjects;
    return filteredProjects.slice(0, INITIAL_PROJECTS_COUNT);
  }, [filteredProjects, showAllProjects]);

  /* 3.3 RENDER ------------------------------------------------------------- */
  return (
    <section 
      id="projects" 
      className="py-14 sm:py-20 bg-neo-cream grid-bg relative overflow-hidden text-black"
      aria-label="Projects Section"
    >
      {/* Background Decorative Icons */}
      <div className="absolute top-12 left-8 animate-float-y hidden sm:block opacity-15 pointer-events-none">
        <FolderGit2 className="h-24 w-24 text-black" strokeWidth={1} />
      </div>
      <div className="absolute bottom-16 right-10 animate-drift hidden lg:block opacity-15 pointer-events-none">
        <Terminal className="h-28 w-28 text-black" strokeWidth={1} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        
        {/* --- SECTION HEADER --- */}
        <RevealOnScroll animation="fade-down">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-block border-4 border-black bg-neo-accent px-3.5 py-1 font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_#000] -rotate-1">
                  {projects.title}
                </span>
                <span className="border-2 border-black bg-white px-2.5 py-0.5 font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#000]">
                  {projects.cards?.length || 0} Production Systems
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight">
                Featured Engineering Builds
              </h2>
            </div>

            {/* Category Filter Pills for instant recruiter targeting */}
            <div className="flex flex-wrap gap-1.5">
              {FILTER_OPTIONS.map((filter) => {
                const isSelected = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`border-2 border-black px-3 py-1.5 font-black text-xs uppercase tracking-wider transition-all neo-btn-press ${
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

        {/* --- RECRUITER 3-COLUMN SCAN GRID (6 INITIALLY + LOAD MORE) --- */}
        {displayedProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch">
            {displayedProjects.map((project: ProjectCardItem, idx: number) => {
              const projectNum = `#0${idx + 1}`;
              const categoryBadge = project.category || (idx === 0 ? "FinTech" : idx === 1 ? "Cloud & DevOps" : "AI & GenAI");

              const githubLink = project.links?.find((l: ProjectLink) => l.label?.toLowerCase().includes("github"))?.url || project.githubUrl || (project.links?.[0]?.url?.includes("github.com") ? project.links[0].url : "");
              const deployLink = project.links?.find((l: ProjectLink) => l.label?.toLowerCase().includes("live") || l.label?.toLowerCase().includes("demo") || l.label?.toLowerCase().includes("deploy"))?.url || project.deployUrl || project.liveUrl || (project.links?.[1]?.url || "");
              const hasValidDeploy = deployLink && deployLink.trim() !== "" && deployLink !== "#";

              return (
                <RevealOnScroll 
                  key={project.name + idx} 
                  animation="fade-up" 
                  delay={(idx % 3) * 100}
                  className="h-full flex flex-col"
                >
                  <div className="group border-4 border-black bg-white shadow-[6px_6px_0px_0px_#000] hover:shadow-[10px_10px_0px_0px_#000] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden h-full">
                    
                    {/* Visual Image Banner */}
                    <div className="relative border-b-4 border-black bg-black h-44 sm:h-48 overflow-hidden">
                      <img
                        src={getOptimizedImageUrl(project.image, { width: 600, quality: "auto", format: "auto" })}
                        loading="lazy"
                        decoding="async"
                        width={600}
                        height={340}
                        alt={project.name}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 opacity-95 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                        <span className="border-2 border-black bg-neo-accent text-black px-2.5 py-0.5 font-black text-[11px] uppercase tracking-wider shadow-[2px_2px_0px_0px_#000]">
                          {categoryBadge}
                        </span>
                        <span className="border-2 border-black bg-white text-black px-2.5 py-0.5 font-black text-[11px] uppercase tracking-wider shadow-[2px_2px_0px_0px_#000]">
                          {project.year || "2026"}
                        </span>
                      </div>

                      {/* Bottom Status Tag */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-[11px] font-black uppercase tracking-wider pointer-events-none">
                        <span className="flex items-center gap-1.5 bg-black/80 px-2 py-0.5 border border-white/20">
                          <span className="h-2 w-2 rounded-full bg-[#22C55E] animate-pulse" />
                          Live Verified
                        </span>
                        <span className="text-white/90 font-mono font-black">{projectNum}</span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        {/* Title */}
                        <h3 className="text-lg font-black uppercase tracking-tight text-black group-hover:text-neo-accent transition-colors leading-snug line-clamp-2">
                          {project.name}
                        </h3>

                        {/* Description (Punchy 2 lines) */}
                        <p className="font-bold text-xs text-black/75 leading-relaxed line-clamp-3">
                          {project.description}
                        </p>

                        {/* Architectural Impact Points (Key Recruiter Hooks) */}
                        {project.impactPoints && project.impactPoints.length > 0 && (
                          <div className="border-2 border-black bg-[#FAF8F5] p-3 shadow-[2px_2px_0px_0px_#000] space-y-1.5">
                            <div className="text-[10px] font-black uppercase tracking-widest text-black/60 flex items-center gap-1">
                              <Sparkles className="h-3 w-3 text-[#FF6B6B]" /> Architectural Highlights
                            </div>
                            {project.impactPoints.slice(0, 2).map((point: string, j: number) => (
                              <div key={j} className="flex items-start gap-1.5 text-[11px] sm:text-xs font-bold text-black/90 leading-tight">
                                <CheckCircle2 className="h-3.5 w-3.5 text-black flex-shrink-0 mt-0.5" />
                                <span className="line-clamp-2">{point}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Core Technologies Badges */}
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-black/50 mb-1.5 flex items-center gap-1">
                            <Layers className="h-3 w-3" /> Core Tech Stack
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {project.tags.slice(0, 6).map((tag: string) => (
                              <span
                                key={tag}
                                className="border border-black bg-[#F4F1EA] hover:bg-neo-secondary px-2 py-0.5 font-bold text-[10px] uppercase tracking-wide shadow-[1px_1px_0px_0px_#000] transition-colors"
                              >
                                {tag}
                              </span>
                            ))}
                            {project.tags.length > 6 && (
                              <span className="border border-black bg-white px-1.5 py-0.5 font-black text-[10px] text-black/60">
                                +{project.tags.length - 6}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Direct Recruiter 1-Click Action Buttons */}
                      <div className="pt-3.5 border-t-2 border-black/10 flex items-center gap-2">
                        {githubLink && githubLink.trim() !== "" && (
                          <a
                            href={githubLink}
                            aria-label={`View ${project.name} source code on GitHub`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 border-2 border-black bg-black text-white px-3 py-2.5 font-black text-xs uppercase tracking-wider neo-btn-press shadow-[3px_3px_0px_0px_#FF6B6B] hover:bg-neutral-800 flex items-center justify-center gap-1.5 transition-all text-center"
                          >
                            <Github className="h-3.5 w-3.5" />
                            <span>Code</span>
                          </a>
                        )}

                        {hasValidDeploy && (
                          <a
                            href={deployLink}
                            aria-label={`View live deployment for ${project.name}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 border-2 border-black bg-neo-secondary text-black px-3 py-2.5 font-black text-xs uppercase tracking-wider neo-btn-press shadow-[3px_3px_0px_0px_#000] hover:bg-yellow-300 flex items-center justify-center gap-1.5 transition-all text-center"
                          >
                            <span>Live Demo</span>
                            <ArrowUpRight className="h-3.5 w-3.5 stroke-[3]" />
                          </a>
                        )}
                      </div>

                    </div>
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        )}

        {/* --- LOAD MORE / SHOW LESS BUTTON (TRIGGERED WHEN > 6 PROJECTS) --- */}
        {filteredProjects.length > INITIAL_PROJECTS_COUNT && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setShowAllProjects(!showAllProjects)}
              className="border-4 border-black bg-neo-secondary hover:bg-yellow-300 text-black px-8 py-3.5 font-black text-sm uppercase tracking-wider shadow-[6px_6px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000] hover:-translate-y-0.5 transition-all neo-btn-press flex items-center gap-3 cursor-pointer"
            >
              {showAllProjects ? (
                <>
                  <span>Show Fewer Projects</span>
                  <ChevronUp className="h-5 w-5 stroke-[3]" />
                </>
              ) : (
                <>
                  <span>View More Projects ({filteredProjects.length - INITIAL_PROJECTS_COUNT} More)</span>
                  <ChevronDown className="h-5 w-5 stroke-[3]" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <div className="border-4 border-black bg-white p-8 text-center shadow-[6px_6px_0px_0px_#000] max-w-md mx-auto my-6">
            <h3 className="text-lg font-black uppercase mb-2">No Projects in this Category</h3>
            <button
              onClick={() => setActiveFilter("All")}
              className="mt-3 border-2 border-black bg-neo-secondary px-3.5 py-1.5 font-black text-xs uppercase tracking-wider neo-btn-press shadow-[2px_2px_0px_0px_#000]"
            >
              Show All Projects
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

export default ProjectsSection;
