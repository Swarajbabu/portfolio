/**
 * ==============================================================================
 * MASTER BARREL EXPORT: Components
 * ==============================================================================
 * Purpose:
 *   Centralized exports for all sections, layout, common, admin, and UI components.
 *
 * Usage:
 *   import { HeroSection, Navbar, RevealOnScroll } from "@/components";
 *   // Or granularly:
 *   import { HeroSection } from "@/components/sections";
 *   import { Navbar } from "@/components/layout";
 *   import { RevealOnScroll } from "@/components/common";
 *   import { AdminHeader, PersonalTab } from "@/components/admin";
 * ==============================================================================
 */

// 1. Portfolio Sections
export * from "./sections";

// 2. Layout & Navigation
export * from "./layout";

// 3. Common Animation & UI Utilities
export * from "./common";

// 4. Admin CMS & Analytics Components
export * from "./admin";
