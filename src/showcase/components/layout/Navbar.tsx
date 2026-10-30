/**
 * ==============================================================================
 * LAYOUT COMPONENT: Navbar
 * ==============================================================================
 * Purpose:
 *   Top fixed neo-brutalist navigation header with:
 *   - Brand logo button (scrolls back to top smoothly)
 *   - Desktop navigation link buttons (About, Skills, Projects, Education, Certifications, Contact)
 *   - Responsive mobile hamburger menu toggle with animated slide-down sheet
 *
 * Data Source:
 *   - `usePortfolio().data.personal.name`
 * ==============================================================================
 */

import { useState } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { Menu, X, Star } from "lucide-react";

/* -------------------------------------------------------------------------- */
/* CONSTANTS                                                                  */
/* -------------------------------------------------------------------------- */

const NAV_LINKS = ["About", "Skills", "Projects", "Education", "Certifications", "Contact"] as const;

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export const Navbar = () => {
  /* 1. STATE & DATA -------------------------------------------------------- */
  const { data } = usePortfolio();
  const [open, setOpen] = useState<boolean>(false);

  const firstName = data?.personal?.name?.split(" ")[0] || "Swaraj";

  /* 2. HANDLERS ------------------------------------------------------------ */
  const scrollTo = (id: string) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setOpen(false);
  };

  /* 3. RENDER -------------------------------------------------------------- */
  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 bg-neo-cream border-b-4 border-foreground"
      aria-label="Main Navigation"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-8 h-16">
        
        {/* Brand Logo Button */}
        <button
          onClick={scrollToTop}
          className="neo-border bg-neo-accent px-4 py-1 font-black text-lg uppercase tracking-tight neo-shadow-sm neo-btn-press text-black"
          aria-label="Scroll to top"
        >
          {firstName}
          <Star className="inline h-4 w-4 ml-1 -mt-1" strokeWidth={3} />
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-2">
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              onClick={() => scrollTo(link)}
              className="font-bold text-sm uppercase tracking-wide px-3 py-2 border-2 border-transparent hover:border-foreground hover:bg-neo-secondary hover:neo-shadow-sm transition-all duration-100 text-black cursor-pointer"
            >
              {link}
            </button>
          ))}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden neo-border p-2 neo-shadow-sm neo-btn-press bg-card text-black cursor-pointer"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X strokeWidth={3} /> : <Menu strokeWidth={3} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {open && (
        <div className="md:hidden border-t-4 border-foreground bg-neo-cream px-4 pb-4 animate-in slide-in-from-top-2 duration-150">
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              onClick={() => scrollTo(link)}
              className="block w-full text-left font-bold text-lg uppercase tracking-wide py-3 px-4 border-b-2 border-foreground hover:bg-neo-secondary transition-all duration-100 text-black cursor-pointer"
            >
              {link}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
