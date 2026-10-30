# 🌟 Portfolio Showcase Architecture

This directory houses the complete **Public-Facing Portfolio Showcase** module.

## 📂 Subdirectories & Structure

```text
src/showcase/
├── pages/
│   └── ShowcasePage.tsx         # Root showcase landing container
├── components/
│   ├── sections/                # 8 Discrete Neo-Brutalist showcase sections
│   │   ├── HeroSection.tsx      # Landing hero banner, typing badge, and CV download
│   │   ├── AboutSection.tsx     # Bio summary & career highlights
│   │   ├── SkillsSection.tsx    # Technical skills classified by domain
│   │   ├── ProjectsSection.tsx  # Interactive project gallery with filters & links
│   │   ├── EducationSection.tsx # Academic timeline & degrees
│   │   ├── CertificationsSection.tsx # Verified industry certifications & badges
│   │   ├── ContactSection.tsx   # Direct inquiry form & social channels
│   │   └── FooterSection.tsx    # Copyright & quick links
│   ├── layout/                  # Navigation & viewport feedback
│   │   ├── Navbar.tsx           # Responsive header with smooth anchor navigation
│   │   ├── NavLink.tsx          # Nav links with hover underline effects
│   │   ├── ScrollProgressBar.tsx # Top viewport reading progress indicator
│   │   └── ScrollToTopButton.tsx # Smooth back-to-top floating button
│   └── common/                  # Reusable animations & loaders
│       ├── FlipCard.tsx         # 3D interactive flip card
│       ├── PortfolioLoadingScreen.tsx # Neo-Brutalist cold-start sync animation
│       └── RevealOnScroll.tsx   # Viewport intersection animation wrapper
└── hooks/
    ├── useScrollReveal.ts       # IntersectionObserver hook for viewport animations
    └── useContentProtection.ts  # Right-click & shortcut protection
```

## 🔄 Data Source & Flow
- **Data Source:** Exclusively sourced from `usePortfolio()` in `@/core/context/PortfolioContext`.
- **Database:** Fetches live records from the MongoDB Atlas `portfolios` collection via `GET /api/portfolio`.
- **Zero Mock Data:** Does not rely on any local hardcoded JSON/TS files. If MongoDB is synchronizing or cold-starting, the animated `PortfolioLoadingScreen` displays until live data is ready.

