# 🛡️ Admin CMS & Visitor Analytics Architecture

This directory houses the complete **Admin Content Management System & Visitor Analytics** module.

## 📂 Subdirectories & Structure

```text
src/admin/
├── pages/
│   └── AdminPage.tsx            # Master Admin CMS container
├── components/
│   ├── auth/                    # Security & authentication gates
│   │   ├── AdminAuthLock.tsx    # Password lock screen with 3-attempt brute-force protection
│   │   └── AdminPasskeyModal.tsx # Emergency OTP email delivery & passkey reset modal
│   ├── layout/                  # Administrative chrome & navigation
│   │   ├── AdminHeader.tsx      # Real-time MongoDB status badge, logout, export, and reload
│   │   └── AdminTabsNav.tsx     # 8-tab switcher (Personal -> Analytics)
│   └── tabs/                    # 8 Modular content editors
│       ├── PersonalTab.tsx      # Name, title, avatar, and social links
│       ├── AboutTab.tsx         # Bio description & bullet highlights
│       ├── SkillsTab.tsx        # Technical skills & classifications
│       ├── ProjectsTab.tsx      # Project cards, tags, live links, and media upload
│       ├── CertificationsTab.tsx # Verified certifications & credentials
│       ├── EducationTab.tsx     # Academic degrees & institutions
│       ├── ContactTab.tsx       # Formspree/Web3Forms IDs & contact details
│       └── AnalyticsTab.tsx     # Real-time traffic analytics, Recharts, and geolocation logs
├── services/
│   └── adminApi.ts              # Encapsulated API client for authentication, OTP, and analytics
└── types/
    └── admin.types.ts           # Tab enums, auth payloads, visitor records, and image callbacks
```

## 🔐 Security Features
- **Brute-Force Protection:** 3 consecutive failed login attempts locks the admin IP out for 15 minutes.
- **Bcrypt Hash Verification:** Passcodes are verified against 10-round bcrypt hashes stored in MongoDB Atlas.
- **OTP Recovery Gateway:** Passcode recovery sends a single-use 6-digit OTP to the verified admin email (`swarajvecha@gmail.com`).
- **Real-Time Database Sync:** Saves update MongoDB Atlas immediately via `PUT /api/portfolio`, invalidating the server-side RAM cache in 0ms.

