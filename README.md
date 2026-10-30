<div align="center">

# Swaraj Vecha — Portfolio & CMS

**A full-stack, database-backed developer portfolio with a live admin dashboard, Neo-Brutalist UI, and a Node/Express + MongoDB Atlas API.**

[![Live Demo](https://img.shields.io/badge/Live-swarajvecha.in-000000?style=for-the-badge)](https://swarajvecha.in)
[![React](https://img.shields.io/badge/React-18-149ECA?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)

</div>

---

## Overview

This repository is **not a static portfolio template** — it's a two-tier application: a React 18 + TypeScript single-page app served to visitors, backed by a standalone Express API that persists all content in MongoDB Atlas and serves a **passcode + OTP-protected admin dashboard** for editing every section of the site without touching code.

Content (hero copy, skills, projects, education, certifications, contact info) lives in MongoDB rather than being hardcoded, so the site can be updated from `/admin` at any time. If the API is unreachable, the app transparently falls back to a bundled local dataset and `localStorage`, so the portfolio never shows a broken or empty page.

**Who this is for:** recruiters and hiring managers evaluating the underlying engineering (not just the visual design), and developers who want to see a realistic small-scale full-stack deployment split across Vercel (frontend) and Render (backend).

---

## 🔒 Security Best Practices

All real credentials and hardcoded secret fallbacks have been purged from the codebase. The server uses `dotenv` to load secrets from `.env` (which is git-ignored), passwords are encrypted with `bcryptjs` (10 rounds), and HTTP headers are secured via `helmet`.

**For Deployers and Contributors:**
1. Copy `.env.example` to `.env` and supply your own MongoDB URI, Cloudinary credentials, and secure admin passcode.
2. Ensure `.env` is never committed.
3. Configure `ALLOWED_ORIGINS` in your environment to restrict CORS to your trusted production and preview domains.

---

## Key Features

### Portfolio (visitor-facing)
- Hero section with animated role/skills typing cycle
- About, Skills (grouped by category), Projects, Education, Certifications & Achievements, and Contact sections
- Neo-Brutalist visual design system (hard shadows, thick borders, bold typography) built on Tailwind CSS + Radix UI primitives (shadcn/ui)
- Scroll-triggered reveal animations, a scroll-progress bar, and a scroll-to-top control
- Client-side content protection (disables right-click and common DevTools shortcuts) with a console warning banner
- Contact form (Formspree-backed) plus a server-side `/api/contact` endpoint that stores submissions in MongoDB
- SEO: canonical URL, Open Graph + Twitter Card meta tags, and JSON-LD `Person` structured data in `index.html`

### Admin dashboard (`/admin`)
- Passcode-gated login with **brute-force protection** (3 failed attempts → 15-minute IP lockout)
- **Email-based OTP flow** to change the admin passcode (OTP sent via Nodemailer/Gmail, with a console-log fallback for local dev)
- Full CRUD editing UI for every content section (personal info, hero, about, skills, projects, education, certifications, contact) that writes directly to MongoDB Atlas
- Image and CV (PDF) uploads to Cloudinary, with a direct-storage fallback if Cloudinary isn't configured
- Built-in **visitor analytics**: IP-based geolocation, device/browser breakdown, daily visit counts (30-day rolling), and a paginated visitor log — all queryable from the dashboard
- JSON export of the full portfolio dataset

### Engineering features
- In-memory (RAM) response cache on `GET /api/portfolio` with a 60-second TTL for near-zero-latency reads, with graceful fallback to stale cache if MongoDB is temporarily unavailable
- Dependency-free, per-IP sliding-window rate limiting on all write/auth endpoints
- CORS configured for a split Vercel/Render deployment
- Vitest unit & security tests for the portfolio context, loading screen, scroll components, bcrypt hashing, and sanitization
- Playwright end-to-end test suite covering homepage navigation, contact submission, and admin lockout

### Planned / not yet implemented
- Automated CI/CD pipeline (GitHub Actions)
- JWT/session-based multi-user admin auth (current model is a single secure passcode)

---

## Technology Stack

| Category | Technology | Purpose |
|---|---|---|
| Frontend framework | React 18 + TypeScript | SPA UI, type safety |
| Build tool | Vite 5 (`@vitejs/plugin-react-swc`) | Dev server & production bundling |
| Styling | Tailwind CSS + `tailwindcss-animate` | Neo-Brutalist design system |
| UI primitives | Radix UI + shadcn/ui, `lucide-react` | Accessible unstyled components, icons |
| Routing | React Router DOM v6 | Client-side routing (`/`, `/admin`, 404) |
| Data fetching / cache | TanStack React Query | API request caching on the client |
| Forms | React Hook Form + Zod | Form state and schema validation |
| Charts | Recharts | Visitor analytics charts in `/admin` |
| Backend runtime | Node.js + Express 4 | REST API server |
| Database | MongoDB Atlas via Mongoose | Persisted portfolio content, contact messages, visitor logs, admin settings |
| Media storage | Cloudinary | Image and CV/PDF hosting |
| Email | Nodemailer (Gmail SMTP) | Admin OTP delivery |
| Analytics (client) | PostHog (`posthog-js`, `@posthog/react`) | Product/usage analytics |
| Testing | Vitest + Testing Library | Unit, component & backend security tests |
| E2E testing | Playwright | Full E2E coverage (homepage, contact, admin auth) |
| Frontend hosting | Vercel (`vercel.json`) | SPA rewrites, asset caching headers |
| Backend hosting | Render (`render.yaml`) | Web service with health check |

---

## Architecture

```mermaid
flowchart TD
    User((Visitor))
    Admin((Admin))

    subgraph Render["Render — Full Stack Host & API"]
        direction TB
        Static["Compiled React SPA (dist/)"]
        API[Express REST API]
        Cache[(In-Memory RAM Cache\n60s TTL)]
        RL[Per-IP Rate Limiter]
    end

    Atlas[(MongoDB Atlas Database\nportfolios / contact_messages\nvisitor_logs / admin_settings)]
    Cloudinary[(Cloudinary\nOptimized Assets + CV PDF)]
    Gmail[Gmail SMTP\nOTP Delivery]
    GeoIP[ip-api.com\nVisitor Geolocation]

    User -->|HTTPS| Static
    Admin -->|HTTPS + passcode| Static
    Static -->|fetch /api/*| API
    API --> Cache
    API --> RL
    API -->|Mongoose| Atlas
    API -->|Upload API| Cloudinary
    API -->|SMTP| Gmail
    API -->|Geolocation lookup| GeoIP
```

The application is deployed full-stack on **Render**, serving the optimized React 18 production build alongside the standalone Express API. All data access is mediated by the Express API, and the admin passcode is checked server-side on every mutating request (`requireAdmin` middleware).

---

## Project Structure

```text
portfolio/
├── e2e/                           # Playwright end-to-end test specs
│   ├── admin.spec.ts              # Admin login & lockout tests
│   ├── contact.spec.ts            # Contact form submission tests
│   └── portfolio.spec.ts          # Public homepage & navigation tests
├── server/
│   ├── server.js                  # Express API: portfolio CRUD, auth, uploads, contact, analytics
│   ├── security.js                # Bcrypt hashing, NoSQL sanitization, XSS stripping, CORS origins
│   └── package.json               # Server dependency manifest
├── src/
│   ├── showcase/                  # 🌟 PART 1: PUBLIC PORTFOLIO SHOWCASE
│   │   ├── pages/
│   │   │   └── ShowcasePage.tsx   # Master showcase landing page
│   │   ├── components/
│   │   │   ├── sections/          # 8 Neo-Brutalist sections (Hero, About, Skills, Projects, etc.)
│   │   │   ├── layout/            # Navbar, Reading progress bar, Scroll-to-top
│   │   │   └── common/            # FlipCard, RevealOnScroll, PortfolioLoadingScreen
│   │   ├── hooks/                 # Showcase interactive hooks (useScrollReveal, useContentProtection)
│   │   └── README.md              # Dedicated Showcase architectural guide
│   ├── admin/                     # 🛡️ PART 2: ADMIN CMS & VISITOR ANALYTICS
│   │   ├── pages/
│   │   │   └── AdminPage.tsx      # Master Admin CMS container
│   │   ├── components/
│   │   │   ├── auth/              # AdminAuthLock (brute-force gate), AdminPasskeyModal (OTP reset)
│   │   │   ├── layout/            # AdminHeader, AdminTabsNav
│   │   │   └── tabs/              # 8 Modular editors (Personal, Projects, Analytics, etc.)
│   │   ├── services/
│   │   │   └── adminApi.ts        # Encapsulated Admin API service
│   │   ├── types/
│   │   │   └── admin.types.ts     # Admin state, visitor logs, and tab types
│   │   └── README.md              # Dedicated Admin CMS architectural guide
│   ├── core/                      # 🌐 SHARED CORE FOUNDATION
│   │   ├── context/
│   │   │   └── PortfolioContext.tsx # Pure database-driven React context (zero local mocks)
│   │   ├── types/
│   │   │   └── portfolio.ts       # Strict TypeScript schema for MongoDB document
│   │   ├── api/
│   │   │   └── apiClient.ts       # Centralized API client
│   │   ├── ui/                    # Reusable Neo-Brutalist design primitives (Radix UI)
│   │   └── utils/                 # cn() class merger & formatting helpers
│   ├── components/ui/             # Primitive UI design system (button, dialog, input, etc.)
│   ├── test/                      # Vitest unit, component, and security tests
│   └── App.tsx                    # Master Router (/ -> ShowcasePage, /admin -> AdminPage)
├── public/                        # Static assets (robots.txt, SVG favicon, OG social card)
├── render.yaml                    # Full-stack Render deployment configuration
├── .env.example                   # Environment variable template (placeholders only)
└── package.json
```

---

## Application Flow

### Portfolio content flow
```text
Visitor loads site
 ↓
PortfolioProvider fetches GET /api/portfolio
 ↓
Express checks RAM cache (60s TTL) → else queries MongoDB Atlas
 ↓
Response cached in RAM + browser localStorage
 ↓
If the request fails or times out (25s) → fall back to bundled src/data/portfolio.ts
 ↓
UI renders (Hero, About, Skills, Projects, Education, Certifications, Contact)
```

### Admin authentication & content update flow
```text
Admin visits /admin
 ↓
Enters passcode → POST /api/admin/verify (rate-limited, 3-attempt lockout)
 ↓
Passcode header (x-admin-passcode) stored in sessionStorage
 ↓
Every subsequent write (PUT /api/portfolio, uploads, analytics) sends the header
 ↓
requireAdmin middleware re-validates against the live MongoDB-stored (or .env fallback) passcode
 ↓
On success: MongoDB updated + RAM cache invalidated instantly
```

### Passcode-change flow
```text
Admin requests OTP → POST /api/admin/request-otp
 ↓
6-digit OTP emailed via Gmail SMTP (or logged to server console if SMTP isn't configured)
 ↓
Admin submits OTP + new passcode → POST /api/admin/change-passcode
 ↓
New passcode persisted to MongoDB (admin_settings collection) + RAM cache
```

---

## Screenshots

No screenshots or demo images are currently committed to the repository (`public/` contains only a favicon-style placeholder and an Open Graph card image).

`TODO: Add screenshots of the Home page, Projects section, Admin login, Admin content editor, and mobile view to a public/screenshots/ (or docs/) directory and reference them here.`

---

## Live Demo

- **Frontend:** [https://swarajvecha.in](https://swarajvecha.in) (per `index.html` canonical/OG tags; deployed via Vercel per `vercel.json`)
- **Backend API:** deployed as a Render web service per `render.yaml` (service name `swaraj-portfolio-backend`); the specific `*.onrender.com` URL is set via the frontend's `VITE_API_URL` and isn't hardcoded in the repo.

`TODO: Add the live Render backend URL here if you want it public (or leave it private and keep only the frontend URL).`

---

## Installation

### Prerequisites
- Node.js 18+ and npm
- A MongoDB Atlas cluster (or any MongoDB-compatible connection string)
- Git
- (Optional) A Cloudinary account for image/CV uploads
- (Optional) A Gmail account with an App Password for OTP email delivery

### Clone the repository
```bash
git clone https://github.com/Swarajbabu/portfolio.git
cd portfolio
```

### Install dependencies
```bash
npm install
```
The `server/` directory has its own `package.json` for Render's isolated build, but `server/server.js` is also runnable directly from the root install via `npm run server`.

### Environment variables

Copy `.env.example` to `.env` **and replace every value with your own credentials** — do not reuse the values currently committed in the example file (see [Security](#security)).

| Variable | Purpose | Required |
|---|---|---|
| `PORT` | Port the Express server listens on | No (defaults to `5000`) |
| `NODE_ENV` | `production` enables static file serving of the built SPA | No |
| `MONGODB_URI` | MongoDB Atlas connection string | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account cloud name | No (falls back to direct/base64 storage) |
| `CLOUDINARY_API_KEY` | Cloudinary API key | No |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | No |
| `ADMIN_PASSCODE` | Fallback admin passcode if none is set in MongoDB | Yes (or set one via the admin UI) |
| `EMAIL_USER` | Gmail address used to send OTP emails | No (OTP logs to console if unset) |
| `EMAIL_PASS` | Gmail App Password | No |
| `SMTP_SERVICE` | Nodemailer service name | No (defaults to `gmail`) |
| `ALLOWED_ORIGINS` | Comma-separated list of permitted CORS origins | No (defaults to localhost & production domain) |
| `VITE_API_URL` | Backend base URL, used by the **frontend** build | Required in production (Vercel); unused/empty for local dev via Vite proxy |

Example `.env` (placeholders only):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/portfolio?retryWrites=true&w=majority
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_PASSCODE=choose_a_strong_passcode
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
SMTP_SERVICE=gmail
ALLOWED_ORIGINS=http://localhost:5173,https://swarajvecha.in,https://your-app.vercel.app
```

---

## Running the Application

### Development
```bash
# Terminal 1 — frontend (Vite dev server)
npm run dev

# Terminal 2 — backend API
npm run server
```

### Production build
```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

### Production start (backend)
```bash
npm start           # equivalent to: node server/server.js
```
When `NODE_ENV=production` and `dist/index.html` exists, the Express server serves the built SPA directly and handles client-side routing fallthrough; otherwise it serves a small JSON API status page at `/`.

### Tests
```bash
npm run lint        # ESLint
npm run typecheck   # tsc -b --noEmit
npm test            # Vitest unit & security tests
npm run test:e2e    # Playwright E2E test suite
```

---

## API Documentation

All endpoints are prefixed with `/api`. Admin-only endpoints require an `x-admin-passcode` header matching the active passcode.

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/portfolio` | Fetch full portfolio content (RAM-cached, 60s TTL) | Public |
| PUT | `/api/portfolio` | Replace the portfolio document | Admin |
| POST | `/api/upload` | Upload a base64 image (≤~5MB) to Cloudinary or store directly | Admin |
| POST | `/api/upload-cv` | Upload a base64 PDF CV (≤~10MB) to Cloudinary | Admin |
| POST | `/api/contact` | Submit a contact form message | Public (rate-limited) |
| GET | `/api/contact/messages` | List the 50 most recent contact messages | Admin |
| POST | `/api/admin/verify` | Verify the admin passcode (3-attempt lockout, 15 min) | Public (rate-limited) |
| POST | `/api/admin/request-otp` | Send a 6-digit OTP to the admin email | Public (rate-limited) |
| POST | `/api/admin/change-passcode` | Verify OTP and set a new admin passcode | Public (OTP-gated, rate-limited) |
| POST | `/api/track-visit` | Log a visitor (IP-based geolocation, device/browser) | Public (rate-limited) |
| GET | `/api/analytics/visitors` | Aggregated visitor analytics (totals, daily counts, top locations, device breakdown, paginated log) | Admin |
| DELETE | `/api/analytics/visitors/:id` | Delete a single visitor log entry | Admin |
| DELETE | `/api/analytics/visitors` | Clear all visitor logs | Admin |
| GET | `/api/health` | Health check (Mongo connection state, Cloudinary config presence) | Public |

---

## Database

**Technology:** MongoDB Atlas, accessed via Mongoose (connection) and the native driver (collection queries).

| Collection | Purpose |
|---|---|
| `portfolios` | Single document (`key: "main_portfolio"`) holding the entire portfolio content tree |
| `contact_messages` | Contact form submissions (name, email, message, IP, user agent, timestamp) |
| `visitor_logs` | Per-visit records (IP, geolocation, device, browser, referrer, page, timestamp) used for analytics |
| `admin_settings` | Single document (`key: "admin_auth"`) storing the current admin passcode |

There is no formal Mongoose schema layer — documents are read/written as plain objects via `mongoose.connection.db.collection(...)`, so validation happens at the API layer (Express route handlers) rather than the database layer.

```mermaid
erDiagram
    PORTFOLIOS {
        string key
        object personal
        object hero
        object about
        object skills
        object projects
        object education
        object experience
        object contact
        date updatedAt
    }
    CONTACT_MESSAGES {
        string name
        string email
        string message
        string ip
        date createdAt
    }
    VISITOR_LOGS {
        string ip
        string city
        string country
        string device
        string browser
        string page
        date visitedAt
    }
    ADMIN_SETTINGS {
        string key
        string passcode
        date updatedAt
    }
```

---

## Authentication & Authorization

- **Model:** a single shared admin passcode (not per-user accounts or JWT sessions). The passcode lives in MongoDB (`admin_settings`) with an environment-variable fallback, and is cached in memory for 30 seconds to avoid a DB round-trip on every request.
- **Login:** `POST /api/admin/verify` checks the supplied passcode server-side; the client stores it in `sessionStorage` (not `localStorage`) and re-sends it as the `x-admin-passcode` header on every admin request.
- **Brute-force protection:** 3 failed attempts from an IP trigger a 15-minute lockout, tracked in an in-memory map.
- **Passcode rotation:** requires a 6-digit OTP emailed to the configured admin address before a new passcode can be set — a meaningful control against someone who guesses or leaks the current passcode.
- **Authorization:** the `requireAdmin` Express middleware gates every mutating and analytics-reading route.
- **Logout:** implemented client-side by clearing the `sessionStorage` entry (ends when the browser tab/session closes).

---

## Security

| Area | Status |
|---|---|
| Password/passcode hashing | ✅ Implemented — admin passcodes are hashed with `bcryptjs` (10 salt rounds), with automatic on-the-fly migration of legacy plaintext credentials and timing-safe comparison |
| Brute-force protection | ✅ Implemented (3-attempt lockout per IP, 15 min) |
| Rate limiting | ✅ Implemented (dependency-free, per-IP, per-endpoint) |
| CORS | ✅ Implemented — restricted to configured `ALLOWED_ORIGINS` / `FRONTEND_URL` with trusted domain and localhost support |
| Input validation | ✅ Implemented — strict format, length limits, and deep recursive NoSQL operator sanitization (`sanitizeNoSql`) |
| Error handling | ✅ Implemented — `sendServerError` hides internal error details in production |
| Secrets management | ✅ Implemented — all real credentials removed from code and `.env.example`, `.env` git-ignored |
| HTTP security headers (CSP, HSTS, etc.) | ✅ Implemented — `helmet` configured with custom Content Security Policy, HSTS, frameguard, and nosniff |
| XSS protection | ✅ Implemented — React escaping + backend tag sanitization stripping executable HTML/script markup |
| NoSQL injection prevention | ✅ Implemented — `sanitizeNoSql` recursively strips keys starting with `$` or containing `.` |
| Client-side "content protection" | ⚠️ Cosmetic UX deterrence — disables right-click/inspect shortcuts with console warning; backed by server-side authorization |

---

## Performance

**Implemented:**
- In-memory RAM cache on the hot-path `GET /api/portfolio` (60s TTL, 0ms serve time on hit) with stale-cache fallback if MongoDB is slow/unreachable
- `Cache-Control` headers on the portfolio API response and on static assets (`vercel.json`, 1-year immutable cache on `/assets`)
- Code-splitting via `React.lazy` for the Admin and NotFound routes
- MongoDB connection pooling (`maxPoolSize: 10`, `minPoolSize: 2`)

**Recommended improvements:**
- Add response compression (`compression` middleware) on the Express server
- Lazy-load below-the-fold sections/images on the public site
- Add database indexes on `visitor_logs.visitedAt` and `contact_messages.createdAt` for the analytics aggregation queries

---

## SEO & Accessibility

**Implemented:** canonical URL, meta description/title, Open Graph tags, Twitter Card tags, and JSON-LD `Person` structured data (all in `index.html`); a `robots.txt` allowing all crawlers.

**Recommended improvements:**
- Add a `sitemap.xml`
- Audit heading hierarchy and ARIA attributes across custom components (the Radix/shadcn `ui/` primitives are accessible by default, but the hand-built sections haven't been explicitly audited)
- Add `alt` text coverage checks for all portfolio/project images (currently sourced dynamically from MongoDB/Cloudinary, so alt text quality depends on admin-entered data)

---

## Testing

**Implemented:**
- **Unit & Security Tests:** Vitest + React Testing Library unit tests covering `PortfolioContext`, loading screen, scroll components, plus full backend security coverage (bcrypt hashing, NoSQL operator sanitization, XSS stripping, and CORS validation).
- **End-to-End (E2E) Tests:** Playwright test specs (`e2e/portfolio.spec.ts`, `e2e/contact.spec.ts`, `e2e/admin.spec.ts`) covering homepage navigation, contact form interactions, and admin authentication lockout gates.

---

## CI/CD

No `.github/workflows` directory exists in this repository — automated CI/CD pipeline is currently omitted per configuration.

---

## Deployment

- **Frontend:** Vercel, configured via `vercel.json` — Vite build, output to `dist/`, SPA rewrite (`/(.*) → /index.html`), 1-year immutable caching on `/assets`.
- **Backend:** Render, configured via `render.yaml` — Node web service (`swaraj-portfolio-backend`), build command `npm install`, start command `node server/server.js`, health check at `/api/health`. Secrets (`MONGODB_URI`, Cloudinary keys, `ADMIN_PASSCODE`, email credentials) are marked `sync: false`, meaning they must be set manually in the Render dashboard rather than committed.
- **Database:** MongoDB Atlas (external, not part of this repo's deployment config).
- **Frontend ↔ backend linkage:** the Vercel deployment must set `VITE_API_URL` to the live Render backend URL at build time.

---

## Production Readiness

| Area | Status |
|---|---|
| Core CRUD / portfolio API | ✅ |
| Admin authentication | ✅ (bcrypt hashing + 3-attempt lockout + OTP rotation) |
| Input validation | ✅ (strict schema + NoSQL sanitization) |
| Error handling | ✅ |
| Rate limiting | ✅ |
| Secrets management | ✅ |
| Testing (unit) | ✅ (Vitest unit & security test suite) |
| Testing (E2E) | ✅ (Playwright E2E test suite) |
| CI/CD | ❌ (Skipped) |
| Monitoring / logging | ❌ (Skipped) |
| SEO | ✅ |
| Documentation | ✅ (this README) |

---

## Engineering Decisions

- **React + Vite over a meta-framework (Next.js, etc.):** the site is a client-rendered SPA with no server-rendering requirement, so Vite keeps the build simple and fast while React Router handles the two real routes (`/` and `/admin`).
- **Two independently deployed services (Vercel + Render) instead of one monolith:** decouples static asset delivery (best served by a CDN/edge network like Vercel) from a long-running Node process that needs a persistent MongoDB connection (better suited to Render).
- **MongoDB over a relational database:** the portfolio content is a single, deeply nested, evolving document (sections, arrays of projects/skills/certifications) that maps naturally onto a document store rather than a normalized relational schema.
- **RAM caching layer in front of MongoDB:** since the portfolio content changes rarely (only via the admin dashboard) but is read on every visitor page load, a short-TTL in-memory cache trades a small staleness window for near-zero read latency without adding external caching infrastructure (e.g. Redis).
- **shadcn/ui + Radix over a full component library:** gives accessible, unstyled primitives that can be fully re-skinned for the custom Neo-Brutalist design system, rather than fighting a themed library's defaults.

---

## Challenges & Solutions

### Challenge: Keeping the site fast while content lives in a remote database
**Solution:** a 60-second in-memory cache on the read-heavy `GET /api/portfolio` endpoint, plus a client-side fallback chain (MongoDB → stale RAM cache → bundled local dataset → `localStorage`).
**Result:** visitors get near-instant page loads, and the site degrades gracefully instead of breaking if MongoDB or the API is briefly unavailable.

### Challenge: Protecting a single-passcode admin panel without a full user/auth system
**Solution:** layered protections around the shared passcode — per-IP rate limiting, a 3-attempt/15-minute lockout, and an email-OTP requirement to change the passcode itself.
**Result:** meaningfully raises the cost of brute-forcing or casually guessing the passcode, without the overhead of a full accounts system for a single-admin site.

### Challenge: Split frontend/backend deployment across two different platforms
**Solution:** an explicit `getApiUrl()` helper (`src/lib/api.ts`) that resolves the backend base URL from `VITE_API_URL` at build time, keeping the frontend platform-agnostic about where the API actually lives.
**Result:** the same frontend build works against local dev (Vite proxy / relative paths) or the live Render backend without code changes.

---

## Future Roadmap

### Phase 1 — Code Quality & Security (Completed ✅)
- Purged all committed plaintext secrets and hardcoded fallbacks
- Migrated admin passcodes to `bcryptjs` hashing (10 salt rounds) with on-the-fly database migration
- Configured `helmet` security headers (CSP, HSTS, X-Frame-Options) and origin-restricted CORS
- Implemented deep recursive NoSQL operator sanitization and XSS tag stripping

### Phase 2 — Testing & Validation (Completed ✅)
- Written comprehensive Playwright E2E specs for homepage, contact form, and admin lockout gates
- Added Vitest security test suite covering password hashing, NoSQL protection, and origin validation

### Phase 3 — CI/CD & Automation
- Stand up a GitHub Actions pipeline (`.github/workflows/ci.yml`) for automated lint, typecheck, unit, and E2E runs

### Phase 4 — Performance & Observability
- Add response compression (`compression` middleware) and database indexes on analytics queries
- Integrate error tracking (e.g., Sentry) and uptime monitoring for `/api/health`

### Phase 5 — Product Features
- Multi-admin accounts with role-based access control
- Sitemap generation + extended JSON-LD schemas

---

## Contributing

1. Fork the repository
2. Clone your fork
   ```bash
   git clone https://github.com/<your-username>/portfolio.git
   cd portfolio
   ```
3. Create a feature branch
   ```bash
   git checkout -b feature/your-feature
   ```
4. Make your changes
5. Run checks
   ```bash
   npm run lint
   npm run typecheck
   npm test
   ```
6. Commit using conventional commits
   ```bash
   git add .
   git commit -m "feat: add ..."
   ```
7. Push and open a pull request
   ```bash
   git push origin feature/your-feature
   ```

---

## License

No `LICENSE` file is currently present in this repository, even though the previous README stated "MIT". `TODO: Add an MIT LICENSE file (or another license of your choosing) if you intend this project to be open-source and reusable — otherwise remove license claims from the README.`

---

## Author

**Swaraj Vecha** — AI/ML & Full Stack Engineer, B.Tech CSE @ Lovely Professional University

- Portfolio: [swarajvecha.in](https://swarajvecha.in)
- GitHub: [@Swarajbabu](https://github.com/Swarajbabu)
- LinkedIn: [linkedin.com/in/laxmiswarajbabu](https://www.linkedin.com/in/laxmiswarajbabu)
- LeetCode: [leetcode.com/u/swarajvecha](https://leetcode.com/u/swarajvecha/)