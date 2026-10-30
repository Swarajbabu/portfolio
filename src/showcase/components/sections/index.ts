/**
 * ==============================================================================
 * BARREL EXPORT: Portfolio Sections
 * ==============================================================================
 * Purpose:
 *   Provides clean, single-point imports for all main portfolio sections:
 *   - HeroSection
 *   - AboutSection
 *   - SkillsSection
 *   - ProjectsSection
 *   - EducationSection
 *   - CertificationsSection
 *   - ContactSection
 *   - FooterSection
 *
 * Example Usage:
 *   import { HeroSection, ProjectsSection } from "@/showcase/components/sections";
 * ==============================================================================
 */

export { HeroSection } from "./HeroSection";
export { AboutSection } from "./AboutSection";
export { SkillsSection } from "./SkillsSection";
export { ProjectsSection } from "./ProjectsSection";
export { EducationSection } from "./EducationSection";
export { CertificationsSection } from "./CertificationsSection";
export { ContactSection } from "./ContactSection";
export { FooterSection } from "./FooterSection";

export type { ProjectCardItem, ProjectLink } from "./ProjectsSection";
export type { EducationEntry } from "./EducationSection";
export type { CertificationItem } from "./CertificationsSection";
