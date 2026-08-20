import { usePortfolio } from "@/context/PortfolioContext";
import { User, MapPin, Star, Cpu, Terminal, Code2 } from "lucide-react";
import RevealOnScroll from "@/components/RevealOnScroll";

const AboutSection = () => {
  const { data } = usePortfolio();
  const { about, personal } = data;

  return (
    <section id="about" className="py-20 sm:py-28 bg-neo-cream grid-bg relative overflow-hidden text-black">
      {/* Decorative floating animated elements */}
      <div className="absolute top-12 right-10 animate-float-y hidden sm:block z-0 pointer-events-none">
        <div className="p-3 bg-neo-accent border-3 border-black shadow-[3px_3px_0px_0px_#000] rotate-12">
          <Terminal className="h-8 w-8 text-black" strokeWidth={2.5} />
        </div>
      </div>
      
      <div className="absolute bottom-16 left-6 animate-wiggle hidden sm:block z-0 pointer-events-none">
        <Star className="h-12 w-12 stroke-black fill-neo-secondary shadow-[2px_2px_0px_0px_#000]" strokeWidth={2} />
      </div>

      <div className="absolute top-1/2 right-6 animate-pulse-scale hidden lg:block z-0 pointer-events-none">
        <div className="p-2.5 bg-neo-muted border-3 border-black shadow-[3px_3px_0px_0px_#000] -rotate-6">
          <Cpu className="h-8 w-8 text-black" strokeWidth={2} />
        </div>
      </div>

      <div className="absolute bottom-24 right-1/4 animate-drift hidden sm:block z-0 pointer-events-none">
        <div className="p-2.5 bg-neo-secondary border-3 border-black shadow-[3px_3px_0px_0px_#000] rotate-3">
          <Code2 className="h-7 w-7 text-black" strokeWidth={2.5} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <RevealOnScroll animation="fade-down">
          <div className="mb-12">
            <span className="inline-block neo-border bg-neo-muted px-4 py-2 font-black text-sm uppercase tracking-widest neo-shadow-sm -rotate-2">
              {about.title}
            </span>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Bio card */}
          <RevealOnScroll animation="fade-right" className="lg:col-span-3">
            <div className="neo-border bg-card p-8 neo-shadow-lg neo-card-hover h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="neo-border bg-neo-accent p-3">
                    <User strokeWidth={3} className="h-6 w-6" />
                  </div>
                  <h3 className="font-black text-2xl uppercase tracking-tight">Who I Am</h3>
                </div>
                <p className="font-bold text-lg leading-relaxed mb-6">{about.bio}</p>
              </div>
              <div className="flex items-center gap-2 neo-border-thin px-4 py-2 bg-neo-secondary inline-block self-start">
                <MapPin strokeWidth={3} className="h-5 w-5" />
                <span className="font-bold">{personal.location}</span>
              </div>
            </div>
          </RevealOnScroll>

          {/* Highlights */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {about.highlights.map((h, i) => (
              <RevealOnScroll key={i} animation="fade-left" delay={i * 120}>
                <div
                  className={`neo-border p-6 neo-shadow-sm neo-card-hover ${
                    i % 3 === 0 ? "bg-neo-accent" : i % 3 === 1 ? "bg-neo-secondary" : "bg-neo-muted"
                  }`}
                  style={{ transform: `rotate(${i % 2 === 0 ? 1 : -1}deg)` }}
                >
                  <div className="flex items-start gap-2">
                    <Star strokeWidth={3} className="h-5 w-5 mt-0.5 flex-shrink-0" fill="black" />
                    <p className="font-bold text-base">{h}</p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
