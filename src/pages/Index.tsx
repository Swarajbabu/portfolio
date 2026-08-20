import { usePortfolio } from "@/context/PortfolioContext";
import PortfolioLoadingScreen from "@/components/PortfolioLoadingScreen";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import EducationSection from "@/components/EducationSection";
import CertificationsSection from "@/components/CertificationsSection";
import ContactSection from "@/components/ContactSection";
import FooterSection from "@/components/FooterSection";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import ScrollToTopButton from "@/components/ScrollToTopButton";

const Index = () => {
  const { isLoading, skipLoading } = usePortfolio();

  if (isLoading) {
    return <PortfolioLoadingScreen onSkip={skipLoading} />;
  }

  return (
    <div className="min-h-screen">
      <ScrollProgressBar />
      <Navbar />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <EducationSection />
      <CertificationsSection />
      <ContactSection />
      <FooterSection />
      <ScrollToTopButton />
    </div>
  );
};

export default Index;
