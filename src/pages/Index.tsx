import { usePortfolio } from "@/context/PortfolioContext";

// 1. Portfolio Page Sections
import {
  HeroSection,
  AboutSection,
  SkillsSection,
  ProjectsSection,
  EducationSection,
  CertificationsSection,
  ContactSection,
  FooterSection,
} from "@/components/sections";

// 2. Global Layout Components
import {
  Navbar,
  ScrollProgressBar,
  ScrollToTopButton,
} from "@/components/layout";

// 3. Shared Common UI & Loaders
import { PortfolioLoadingScreen } from "@/components/common";

const Index = () => {
  const { isLoading, skipLoading } = usePortfolio();

  // Show cold-start loading screen during backend synchronization
  if (isLoading) {
    return <PortfolioLoadingScreen onSkip={skipLoading} />;
  }

  return (
    <div className="min-h-screen">
      {/* Top Reading Progress Bar */}
      <ScrollProgressBar />

      {/* Main Navigation Header */}
      <Navbar />

      {/* Main Page Sections */}
      <main>
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

export default Index;
