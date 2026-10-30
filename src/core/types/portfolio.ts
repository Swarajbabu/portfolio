/**
 * ==============================================================================
 * CORE SCHEMA: PortfolioData TypeScript Contract
 * ==============================================================================
 * Purpose:
 *   Strict type definitions for the MongoDB Atlas `portfolios` collection document.
 *   Ensures type-safety across both the Showcase and Admin CMS modules.
 * ==============================================================================
 */

export interface PersonalDetails {
  name: string;
  role: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  instagram: string;
  resumeUrl: string;
  avatar: string;
  socials: {
    linkedin: string;
    github: string;
    leetcode: string;
    codechef?: string;
    hackerrank?: string;
    twitter?: string;
  };
}

export interface HeroSectionData {
  headlineOne: string;
  headlineTwo: string;
  subheadline: string;
  typingCycle: string[];
  primaryCta: string;
  secondaryCta: string;
}

export interface AboutSectionData {
  title: string;
  bio: string;
  highlights: string[];
}

export interface SkillGroup {
  heading: string;
  items: string[];
}

export interface SkillsSectionData {
  title: string;
  groups: SkillGroup[];
}

export interface ProjectCard {
  name: string;
  category: string;
  year: string;
  description: string;
  tags: string[];
  links: Array<{ label: string; url: string }>;
  image: string;
  impactPoints: string[];
}

export interface ProjectsSectionData {
  title: string;
  cards: ProjectCard[];
}

export interface EducationEntry {
  period: string;
  degree: string;
  org: string;
  details: string[];
}

export interface EducationSectionData {
  title: string;
  entries: EducationEntry[];
}

export interface CertificationItem {
  role: string;
  org: string;
  period: string;
  url: string;
  image: string;
  bullets: string[];
}

export interface ExperienceSectionData {
  title: string;
  items: CertificationItem[];
}

export interface ContactAltChannel {
  label: string;
  value: string;
}

export interface ContactSectionData {
  title: string;
  copy: string;
  formspreeId: string;
  formspreeUrl: string;
  web3FormsKey: string;
  fields: string[];
  submitLabel: string;
  altContacts: ContactAltChannel[];
}

export interface FooterSectionData {
  note: string;
}

export interface PortfolioData {
  personal: PersonalDetails;
  hero: HeroSectionData;
  about: AboutSectionData;
  skills: SkillsSectionData;
  projects: ProjectsSectionData;
  education: EducationSectionData;
  experience: ExperienceSectionData;
  contact: ContactSectionData;
  footer: FooterSectionData;
  updatedAt?: string | Date;
}

