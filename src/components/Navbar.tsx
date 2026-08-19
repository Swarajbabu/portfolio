import { useState } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { Menu, X, Star } from "lucide-react";

const Navbar = () => {
  const { data } = usePortfolio();
  const [open, setOpen] = useState(false);
  const links = ["About", "Skills", "Projects", "Education", "Certifications", "Contact"];

  const firstName = data.personal.name.split(" ")[0] || "Swaraj";

  const scrollTo = (id: string) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-neo-cream border-b-4 border-foreground">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-8 h-16">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="neo-border bg-neo-accent px-4 py-1 font-black text-lg uppercase tracking-tight neo-shadow-sm neo-btn-press"
        >
          {firstName}<Star className="inline h-4 w-4 ml-1 -mt-1" strokeWidth={3} />
        </button>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-2">
          {links.map((l) => (
            <button
              key={l}
              onClick={() => scrollTo(l)}
              className="font-bold text-sm uppercase tracking-wide px-3 py-2 border-2 border-transparent hover:border-foreground hover:bg-neo-secondary hover:neo-shadow-sm transition-all duration-100"
            >
              {l}
            </button>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden neo-border p-2 neo-shadow-sm neo-btn-press bg-card"
          aria-label="Toggle menu"
        >
          {open ? <X strokeWidth={3} /> : <Menu strokeWidth={3} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t-4 border-foreground bg-neo-cream px-4 pb-4">
          {links.map((l) => (
            <button
              key={l}
              onClick={() => scrollTo(l)}
              className="block w-full text-left font-bold text-lg uppercase tracking-wide py-3 px-4 border-b-2 border-foreground hover:bg-neo-secondary transition-all duration-100"
            >
              {l}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
