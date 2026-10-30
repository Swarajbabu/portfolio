/**
 * ==============================================================================
 * PAGE: ShowcasePage (Public Portfolio Landing)
 * ==============================================================================
 * Purpose:
 *   The primary visitor-facing portfolio landing page.
 *   - Renders 8 Neo-Brutalist sections purely driven by MongoDB Atlas data.
 *   - Provides interactive reading progress, smooth scrolling, and dynamic themes.
 *   - Displays an animated loading screen while the database synchronizes.
 *   - Displays an interactive retry banner if the database is waking up.
 * ==============================================================================
 */

import React from "react";
import { usePortfolio } from "@/core/context/PortfolioContext";
import { RefreshCw, ServerOff } from "lucide-react";

// 1. Showcase Page Sections
import {
  HeroSection,
  AboutSection,
  SkillsSection,
  ProjectsSection,
  EducationSection,
  CertificationsSection,
  ContactSection,
  FooterSection,
} from "@/showcase/components/sections";

// 2. Layout Components
import {
  Navbar,
  ScrollProgressBar,
  ScrollToTopButton,
} from "@/showcase/components/layout";

// 3. Common UI & Loaders
import { PortfolioLoadingScreen } from "@/showcase/components/common";

export const ShowcasePage: React.FC = () => {
  const { data, isLoading, isMongoConnected, error, refetch, skipLoading } = usePortfolio();

  // 1. Cold-start Loading State during backend / database sync
  if (isLoading) {
    return <PortfolioLoadingScreen onSkip={skipLoading} />;
  }

  // 2. Database Connection Error State (Strictly no local mock fallbacks)
  if (!data || error) {
    return (
      <div className="min-h-screen bg-neo-cream grid-bg flex items-center justify-center p-6">
        <div 
          className="neo-border bg-card p-8 sm:p-12 max-w-lg w-full text-center"
          style={{ boxShadow: "8px 8px 0px 0px #000" }}
        >
          <div className="inline-block p-4 bg-neo-accent neo-border mb-6 rotate-3">
            <ServerOff className="h-12 w-12 text-black" strokeWidth={2.5} />
          </div>
          
          <h1 className="text-3xl font-black uppercase tracking-tight mb-4">
            Connecting to Database
          </h1>
          
          <p className="font-bold text-black/80 mb-8 leading-relaxed">
            {error || "The server is currently establishing a secure connection to MongoDB Atlas. Please click below to refresh."}
          </p>

          <button
            onClick={() => refetch()}
            className="w-full neo-border bg-neo-secondary px-6 py-4 font-black text-lg uppercase tracking-wider neo-shadow-md neo-btn-press flex items-center justify-center gap-3 hover:brightness-105 transition-all"
          >
            <RefreshCw className="h-5 w-5 animate-spin" />
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // 3. Main Showcase Page Render
  return (
    <div className="min-h-screen bg-neo-cream font-sans selection:bg-neo-accent selection:text-black">
      {/* Top Reading Progress Bar */}
      <ScrollProgressBar />

      {/* Main Navigation Header */}
      <Navbar />

      {/* Main Portfolio Sections */}
      <main id="main-content">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <EducationSection />
        <CertificationsSection />
        <ContactSection />
      </main>

      {/* Footer & Floating Controls */}
      <FooterSection />
      <ScrollToTopButton />
    </div>
  );
};

export default ShowcasePage;

