# 🧩 Components & Sections Architecture Guide

Welcome to the **Swaraj Portfolio Components System**! This directory is structured to make understanding, maintaining, and editing any part of the portfolio intuitive and enjoyable for anyone.

---

## 📁 Directory Hierarchy

```
src/components/
├── 📂 sections/                  # All main page portfolio sections
│   ├── HeroSection.tsx           # 1. Hero banner, typing cycle & CTAs
│   ├── AboutSection.tsx          # 2. Bio, highlights & location
│   ├── SkillsSection.tsx         # 3. Categorized skills, search & proficiency
│   ├── ProjectsSection.tsx       # 4. Production builds, filters & pagination
│   ├── EducationSection.tsx      # 5. Academic timeline, degree & coursework
│   ├── CertificationsSection.tsx # 6. Credentials & 3D FlipCards
│   ├── ContactSection.tsx        # 7. Form, email/phone & social badges
│   ├── FooterSection.tsx         # 8. Footer branding & admin portal link
│   └── index.ts                  # Barrel export for all 8 sections
│
├── 📂 layout/                    # Global layout & navigation UI
│   ├── Navbar.tsx                # Fixed header navbar with mobile drawer
│   ├── NavLink.tsx               # Neo-brutalist navigation link wrapper
│   ├── ScrollProgressBar.tsx     # Fixed top reading progress indicator
│   ├── ScrollToTopButton.tsx     # Floating bottom-right back-to-top button
│   └── index.ts                  # Barrel export for layout components
│
├── 📂 common/                    # Shared animation & UI utility components
│   ├── RevealOnScroll.tsx        # IntersectionObserver scroll animation wrapper
│   ├── FlipCard.tsx              # Interactive 3D flip card component
│   ├── PortfolioLoadingScreen.tsx# 4-stage animated loading screen
│   └── index.ts                  # Barrel export for common components
│
├── 📂 admin/                     # Admin CMS & Analytics dashboard components
│   ├── AdminAuthLock.tsx         # Passcode unlock form with 15-min lockout protection
│   ├── AdminPasskeyModal.tsx     # Email OTP passkey change & reset modal
│   ├── AdminHeader.tsx           # Admin action header (Save, Reset, Export, Passkey)
│   ├── AdminTabsNav.tsx          # Responsive tab switcher
│   ├── types.ts                  # Admin & Analytics TypeScript definitions
│   ├── 📂 tabs/                  # Dedicated tab editors
│   │   ├── PersonalTab.tsx       # Personal info, avatar & CV upload
│   │   ├── AboutTab.tsx          # Bio & highlights editor
│   │   ├── SkillsTab.tsx         # Technical arsenal & domains editor
│   │   ├── ProjectsTab.tsx       # Production builds & media upload
│   │   ├── CertificationsTab.tsx # 3D FlipCard credentials editor
│   │   ├── EducationTab.tsx      # Academic degrees & coursework
│   │   ├── ContactTab.tsx        # Contact copy & email gateways (Formspree/Web3Forms)
│   │   ├── AnalyticsTab.tsx      # Live visitor metrics, charts & traffic logs
│   │   └── index.ts              # Barrel export for all tabs
│   └── index.ts                  # Barrel export for admin components
│
├── 📂 ui/                        # Atomic Neo-brutalist / Radix UI primitives
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   └── ...
│
├── index.ts                      # Master barrel export (@/components)
└── README.md                     # This documentation guide
```

---

## 🚀 Clean Import Convention

You can import components either from their specific domain folder or the central `@/components` alias:

```typescript
// Option 1: Clean Domain Imports (Recommended)
import { HeroSection, ProjectsSection } from "@/components/sections";
import { Navbar, ScrollToTopButton } from "@/components/layout";
import { RevealOnScroll, FlipCard } from "@/components/common";
import { AdminAuthLock, PersonalTab, AnalyticsTab } from "@/components/admin";

// Option 2: Central Barrel Import
import { HeroSection, Navbar, RevealOnScroll, AdminHeader } from "@/components";
```

---

## 🔄 How Data Flows into Components

All portfolio dynamic data lives in `src/context/PortfolioContext.tsx` and falls back to `src/data/portfolio.ts`.

```
MongoDB Backend / API  ───┐
                          ├─►  PortfolioContext (usePortfolio)  ─►  Section & Admin Components
Default Fallback Data  ───┘
```

---

## 🛠️ Step-by-Step "How to Edit" Recipes

### 1. How to Edit the Hero Section
- **File**: [`src/components/sections/HeroSection.tsx`](file:///c:/Users/ASUS/Desktop/CV/Swaraj%20Portfolio/src/components/sections/HeroSection.tsx)
- **Data**: `data.hero` & `data.personal`

### 2. How to Add or Edit a Project
- **File**: [`src/components/sections/ProjectsSection.tsx`](file:///c:/Users/ASUS/Desktop/CV/Swaraj%20Portfolio/src/components/sections/ProjectsSection.tsx)
- **Admin Tab**: [`src/components/admin/tabs/ProjectsTab.tsx`](file:///c:/Users/ASUS/Desktop/CV/Swaraj%20Portfolio/src/components/admin/tabs/ProjectsTab.tsx)

### 3. How to Add or Edit a Skill
- **File**: [`src/components/sections/SkillsSection.tsx`](file:///c:/Users/ASUS/Desktop/CV/Swaraj%20Portfolio/src/components/sections/SkillsSection.tsx)
- **Admin Tab**: [`src/components/admin/tabs/SkillsTab.tsx`](file:///c:/Users/ASUS/Desktop/CV/Swaraj%20Portfolio/src/components/admin/tabs/SkillsTab.tsx)

### 4. How to Edit the Admin Dashboard Tabs
- Look inside [`src/components/admin/tabs/`](file:///c:/Users/ASUS/Desktop/CV/Swaraj%20Portfolio/src/components/admin/tabs) where each tab is its own standalone component under ~100-200 lines.
