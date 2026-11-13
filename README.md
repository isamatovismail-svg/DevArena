# DevArena ⚡

> Next-generation competitive programming and algorithmic challenge platform inspired by LeetCode and Codeforces, engineered with Next.js 14 App Router, TypeScript, Tailwind CSS, Prisma ORM, and SQLite.

![DevArena Status](https://img.shields.io/badge/status-production--ready%20MVP-success?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/typescript-strict%20mode-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/next.js-14.2.18-black?style=for-the-badge)

---

## 1. Product Vision & Overview

DevArena is a full-stack competitive programming ecosystem where developers:
- Practice algorithmic challenges across multiple categories (Arrays, DP, Graphs, Binary Search, Linked Lists, etc.).
- Write, reset, test, and submit code in Python 3, JavaScript (Node.js), C++20, and Java 17 via a customized **Monaco Editor**.
- Compete in scheduled, time-gated programming rounds with automated scoring and dynamic rank progression.
- Inspect submission test cases, execution runtimes, and memory utilization.
- Track problem-solving metrics and 30-day activity through interactive **Recharts** charts.
- Unlock activity-driven achievements and badges.
- Ascend the global Elo rating leaderboard.
- Manage platform problems, contests, and users via the role-gated **Admin Console**.

---

## 2. Technology Stack

- **Framework**: Next.js 14 (App Router, Server Actions, Route Handlers)
- **Language**: TypeScript (strict mode, no downlevel iteration errors)
- **Styling & UI**: Tailwind CSS (dark-first aesthetic, `#0a0a0f` background, purple/blue accents)
- **Database**: SQLite with Prisma ORM 5.22
- **Editor**: `@monaco-editor/react` (VS Code-grade editing, syntax highlighting, theme integration)
- **Authentication**: Encrypted session cookies via `iron-session` + password hashing with `bcryptjs`
- **Charts**: Recharts (Activity AreaChart & Solved By Difficulty Donut Chart)
- **Icons**: Lucide React
- **Validation**: Zod schema validation on all inputs and API routes
- **Testing**: Jest & `ts-jest` for business logic and utilities

---

## 3. Demo Credentials

> ⚠️ **IMPORTANT**: These demo accounts are automatically populated by the database seed script for evaluation and testing. Change or remove them before deploying to a public production environment!

| Role | Username | Email | Password | Rating |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | `admin` | `admin@devarena.dev` | `admin123` | 2500 (Grandmaster) |
| **User** | `alice_codes` | `alice@example.com` | `demo123` | 1850 (Candidate Master) |
| **User** | `bob_dev` | `bob@example.com` | `demo123` | 1620 (Expert) |
| **User** | `carol_algo` | `carol@example.com` | `demo123` | 2120 (Master) |

---

## 4. Architecture & Security Requirements

### Sandbox Execution & Judge0 Adapter
DevArena adheres to strict code execution security:
- **Zero In-Process Execution**: Submitted code is **never** executed directly within the host Next.js server process.
- **Judge0 Adapter** (`services/judgeService.ts`): Connects to any standard Judge0 API endpoint (`JUDGE0_API_URL` and `JUDGE0_API_KEY`).
- **Graceful Demo Simulation Mode**: When Judge0 credentials are omitted, DevArena safely activates a clearly labeled **Demo Mode**:
  - Displays a visible banner on execution.
  - Explains that live external sandbox credentials are required for compilation.
  - Generates realistic test case validation so full platform interaction, scoring, and achievement triggers remain functional.

---

## 5. Completed Requirements Checklist

- [x] **Public Pages**
  - [x] Landing Page (`/`) with live DB statistics, platform pillars, and featured problem sets.
  - [x] Login (`/login`) with demo account quick-fill and validation.
  - [x] Registration (`/register`) with alphanumeric validation and instant session initialization.
  - [x] Problems Catalog (`/problems`) with search, difficulty filter, category filter, sorting, and pagination.
  - [x] Problem Workspace (`/problems/[slug]`) with specifications, examples, constraints, Monaco editor, and testcase viewer.
  - [x] Contests (`/contests`) with live status (Live, Upcoming, Past) and round details.
  - [x] Contest Details & Arena (`/contests/[slug]`) with registration, problems, and round leaderboard.
  - [x] Global Leaderboard (`/leaderboard`) with Elo rating, rank badges, and podium top-3.
  - [x] Public User Profiles (`/u/[username]`) with solved distribution chart, stats, and achievements.

- [x] **Authenticated Member Pages**
  - [x] User Dashboard (`/dashboard`) with authentic database stats, 30-day activity chart, and recommendations.
  - [x] Submission History (`/submissions`) with status filters, test results inspection modal, and code preview.
  - [x] Achievements Grid (`/achievements`) with progress summary and unlocked honors.
  - [x] Account Settings (`/settings`) with profile updates and password change.

- [x] **Administration Console**
  - [x] Admin Dashboard (`/admin`) with real-time platform statistics and live submission streams.
  - [x] Problem Management (`/admin/problems`) to create, inspect, and delete challenges.
  - [x] Contest Management (`/admin/contests`) with problem multi-selection and schedule configuration.
  - [x] User Management (`/admin/users`) with role viewing and account directories.

- [x] **Engineering & Quality**
  - [x] Strict TypeScript compilation (`tsc --noEmit` exits 0).
  - [x] ESLint validation (`next lint` exits 0 with 0 errors).
  - [x] Unit test suite (`npm test` passes 11/11 tests across 3 suites).
  - [x] Production build (`next build` succeeds with optimized static and dynamic route generation).
  - [x] Normalized Prisma SQLite database with seed data (16 original problems, 3 contests, 10 achievements, sample submissions).

---

## 6. Installation & Quickstart

### Prerequisites
- Node.js `>= 18.17.0`
- npm `>= 9.0.0`

### Setup Steps
```bash
# 1. Clone repository
git clone https://github.com/your-username/DevArena.git
cd DevArena

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env

# 4. Initialize Database & Generate Prisma Client
npm run db:generate
npx prisma db push

# 5. Populate Seed Data (16 problems, contests, achievements, demo accounts)
npm run db:seed

# 6. Run Development Server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to access DevArena.

---

## 7. Environment Variables Reference

See `.env.example`:

| Variable | Description | Default |
| :--- | :--- | :--- |
| `DATABASE_URL` | SQLite connection string | `"file:./dev.db"` |
| `SESSION_SECRET` | 32+ character random secret for iron-session | `"devarena-dev-secret-key-change-in-production-32chars"` |
| `JUDGE0_API_URL` | Endpoint of Judge0 instance | `""` (leave blank for Demo Mode) |
| `JUDGE0_API_KEY` | RapidAPI or self-hosted Judge0 secret key | `""` |
| `NEXT_PUBLIC_APP_URL`| Root application URL | `"http://localhost:3000"` |

---

## 8. Development & Build Commands

```bash
# Start Next.js development server
npm run dev

# Run TypeScript strict typecheck
npm run typecheck

# Run ESLint check
npm run lint

# Run Jest unit test suite
npm test

# Produce optimized production build
npm run build

# Start production server
npm run start

# Database reset & re-seed
npm run db:reset
```

---

## 9. Deployment Notes

- **Hosting**: Can be deployed on Vercel, Railway, Fly.io, or standard Node.js Docker containers.
- **Database**: The MVP uses SQLite (`dev.db`). For high-concurrency multi-region deployments, switch `provider = "postgresql"` in `prisma/schema.prisma` and supply a Postgres connection URL.
- **Production Session**: Ensure `SESSION_SECRET` is set to a cryptographically strong 32-character string in your host environment secrets.
