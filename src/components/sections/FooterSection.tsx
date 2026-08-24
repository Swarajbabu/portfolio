/**
 * ==============================================================================
 * SECTION: FooterSection
 * ==============================================================================
 * Purpose:
 *   Portfolio footer with:
 *   - Inspirational closing note / tagline from portfolio data
 *   - "Built with passion & code" attribution
 *   - Direct shortcut button to the Admin Portal (/admin)
 *
 * Data Source:
 *   - `usePortfolio().data.footer`
 * ==============================================================================
 */

import { usePortfolio } from "@/context/PortfolioContext";
import { Link } from "react-router-dom";
import { Star, Settings } from "lucide-react";

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export const FooterSection = () => {
  /* 1. DATA ---------------------------------------------------------------- */
  const { data } = usePortfolio();

  /* 2. RENDER -------------------------------------------------------------- */
  return (
    <footer 
      className="bg-neo-secondary border-t-4 border-foreground py-8 text-black"
      aria-label="Footer Section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left: Footer Tagline / Note */}
        <p className="font-black text-lg uppercase tracking-wide flex items-center gap-2">
          <Star strokeWidth={3} className="h-5 w-5" fill="black" />
          {data.footer.note}
        </p>

        {/* Right: Attribution & Admin Shortcut Button */}
        <div className="flex items-center gap-4">
          <p className="font-bold text-sm uppercase tracking-widest">
            Built with passion & code
          </p>

          <Link
            to="/admin"
            target="_blank"
            rel="noopener noreferrer"
            className="neo-border bg-neo-accent p-1.5 neo-shadow-sm neo-btn-press hover:bg-card transition-colors flex items-center gap-1 font-black text-xs uppercase"
            title="Admin Portal Settings (Opens in new tab)"
          >
            <Settings className="h-4 w-4" strokeWidth={3} />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        </div>

      </div>
    </footer>
  );
};

export default FooterSection;
