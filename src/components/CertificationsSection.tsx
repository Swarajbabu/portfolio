import { useState } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { Award, ExternalLink, Star, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import FlipCard from "./FlipCard";

const CertificationsSection = () => {
  const { data } = usePortfolio();
  const { experience } = data;
  const items = experience.items;
  const itemsPerPage = 3;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const [currentPage, setCurrentPage] = useState(0);

  const handlePrev = () => {
    setCurrentPage((prev) => (prev <= 0 ? totalPages - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev >= totalPages - 1 ? 0 : prev + 1));
  };

  const visibleItems = items.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  return (
    <section id="certifications" className="py-20 sm:py-28 bg-neo-cream grid-bg relative overflow-hidden text-black">
      {/* Decorative elements with active animations */}
      <div className="absolute top-14 left-6 animate-float-x hidden sm:block pointer-events-none">
        <Star className="h-10 w-10 text-black fill-neo-secondary shadow-[2px_2px_0px_0px_#000]" strokeWidth={2.5} />
      </div>
      <div className="absolute bottom-12 right-8 animate-pulse-scale hidden sm:block pointer-events-none">
        <div className="border-4 border-black bg-neo-secondary w-10 h-10 rotate-6 shadow-[3px_3px_0px_0px_#000]" />
      </div>
      <div className="absolute top-1/3 right-6 animate-wiggle hidden lg:block pointer-events-none">
        <Zap className="h-10 w-10 text-black fill-neo-accent shadow-[2px_2px_0px_0px_#000]" strokeWidth={2.5} />
      </div>
      <div className="absolute bottom-1/3 left-8 animate-drift hidden sm:block pointer-events-none">
        <div className="border-4 border-black bg-neo-muted w-9 h-9 -rotate-12 shadow-[3px_3px_0px_0px_#000]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header with Navigation Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
          <span className="inline-block neo-border bg-neo-muted px-4 py-2 font-black text-sm uppercase tracking-widest neo-shadow-sm -rotate-1">
            {experience.title} ({items.length})
          </span>

          {totalPages > 1 && (
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                aria-label="Previous page"
                className="neo-border bg-neo-accent px-4 py-2 font-black text-xs uppercase tracking-widest neo-shadow-sm neo-btn-press hover:bg-neo-secondary flex items-center gap-1 transition-colors"
              >
                <ChevronLeft strokeWidth={3} className="h-4 w-4" />
                Prev
              </button>
              <span className="font-black text-sm uppercase tracking-widest px-2 min-w-[90px] text-center">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={handleNext}
                aria-label="Next page"
                className="neo-border bg-neo-accent px-4 py-2 font-black text-xs uppercase tracking-widest neo-shadow-sm neo-btn-press hover:bg-neo-secondary flex items-center gap-1 transition-colors"
              >
                Next
                <ChevronRight strokeWidth={3} className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* 3 Visible Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-300 min-h-[380px]">
          {visibleItems.map((item, index) => {
            const globalIndex = currentPage * itemsPerPage + index;
            return (
              <FlipCard
                key={item.role + globalIndex}
                className="h-full"
                front={
                  <div
                    className="neo-border bg-card neo-shadow-md flex flex-col h-full overflow-hidden"
                    style={{ transform: `rotate(${globalIndex % 2 === 0 ? 0.5 : -0.5}deg)` }}
                  >
                    <div className={`p-4 border-b-4 border-foreground ${globalIndex % 3 === 0 ? "bg-neo-accent" : globalIndex % 3 === 1 ? "bg-neo-secondary" : "bg-neo-muted"}`}>
                      <div className="flex items-center gap-3">
                        <Award strokeWidth={3} className="h-6 w-6" />
                        <span className="font-black text-xs uppercase tracking-widest">{item.period}</span>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col bg-card">
                      <h3 className="font-black text-lg uppercase tracking-tight mb-1">{item.role}</h3>
                      <p className="font-bold text-sm mb-4">{item.org}</p>
                      <ul className="space-y-2 flex-1">
                        {item.bullets?.map((b, j) => (
                          <li key={j} className="font-medium text-sm">• {b}</li>
                        ))}
                      </ul>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 neo-border bg-foreground text-card px-4 py-2 font-black text-sm uppercase tracking-wide neo-btn-press flex items-center justify-center gap-2"
                          style={{ boxShadow: "4px 4px 0px 0px #FFD93D" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          View <ExternalLink strokeWidth={3} className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                }
                back={
                  <div 
                    className="border-4 border-black bg-neo-cream shadow-[6px_6px_0px_0px_#000] h-full w-full p-3 flex flex-col overflow-hidden items-center justify-between"
                    style={{ transform: `rotate(${globalIndex % 2 === 0 ? -0.5 : 0.5}deg)` }}
                  >
                    {/* Certificate Preview Image */}
                    <div className="relative w-full flex-1 border-2 border-black bg-black overflow-hidden flex items-center justify-center p-2">
                      <img 
                        src={item.image} 
                        alt={item.role}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Single Clean Action Footer */}
                    <div className="w-full pt-3 flex items-center justify-between gap-2">
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border-2 border-black bg-neo-accent hover:bg-black hover:text-white text-black px-4 py-2 font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-[3px_3px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#FFD93D] transition-all"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Open Link <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <span className="text-[10px] font-black uppercase tracking-wider text-black/50">
                          Credential Verified
                        </span>
                      )}
                    </div>
                  </div>
                }
              />
            );
          })}
        </div>

        {/* Page indicators */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`h-3.5 w-3.5 neo-border ${
                  currentPage === i ? "bg-neo-accent scale-125" : "bg-neo-cream hover:bg-neo-muted"
                } transition-all duration-200`}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CertificationsSection;
