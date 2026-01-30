# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**PairPay** is a couples expense manager similar to Splitwise, but specifically designed for two-person partnerships. This is a Next.js 16.1.6 project using the App Router architecture with TypeScript, React 19, Tailwind CSS v4, and Supabase as the backend.

### Domain
PairPay helps couples track shared expenses with automatic 50/50 splitting, category-based organization, and balance tracking between partners. The MVP focuses on simplicity: register expenses, see who owes what, and settle balances.

### Tech Stack
- **Frontend**: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4
- **Backend**: Next.js Server Actions + API Routes
- **Database**: Supabase (PostgreSQL) + Prisma ORM
- **Auth**: Supabase Auth (Email/Password)
- **Architecture**: Screaming Architecture (domain-driven folder structure)

## Development Commands

```bash
# Start development server (runs on http://localhost:3000)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

## Package Manager

This project uses **pnpm** as the package manager (see `pnpm-workspace.yaml`). Always use `pnpm` commands, not `npm` or `yarn`.

## Architecture

### Next.js App Router Structure
- Uses Next.js 16 App Router (app directory)
- All routes and pages are defined in the `app/` directory
- `app/layout.tsx` is the root layout wrapping all pages
- `app/page.tsx` is the home page (route `/`)
- Static assets are served from `public/`

### Styling
- Tailwind CSS v4 with PostCSS integration (`@tailwindcss/postcss`)
- Global styles in `app/globals.css`
- Dark mode support using Tailwind's `dark:` prefix

### Fonts
- Uses Next.js font optimization with `next/font/google`
- Geist Sans and Geist Mono fonts loaded and configured as CSS variables (`--font-geist-sans`, `--font-geist-mono`)

### TypeScript Configuration
- Path alias: `@/*` maps to the root directory
- Strict mode enabled
- JSX mode: `react-jsx` (React 19's new JSX transform)
- Module resolution: `bundler`
- Target: ES2017

### React Compiler
- React Compiler is enabled in `next.config.ts` (`reactCompiler: true`)
- This is an experimental compiler that optimizes React components automatically

### Linting
- ESLint configured with Next.js defaults (`eslint-config-next`)
- Uses flat config format (`eslint.config.mjs`)
- Includes TypeScript and Core Web Vitals rules
- Ignores: `.next/`, `out/`, `build/`, `next-env.d.ts`

## Key Technical Details

- **React Version**: 19.2.3 (latest major version)
- **Next.js Version**: 16.1.6
- **TypeScript**: v5
- **Node Types**: @types/node v20
- **Workspace Configuration**: pnpm workspace with ignored built dependencies for `sharp` and `unrs-resolver`

## Database & ORM

### Prisma Setup
- **ORM**: Prisma (type-safe database client)
- **Database**: Supabase PostgreSQL
- Schema location: `prisma/schema.prisma`
- Generated client: `@prisma/client`

### Prisma Commands
```bash
# Generate Prisma Client (after schema changes)
pnpm prisma generate

# Create and apply migrations
pnpm prisma migrate dev --name description

# Open Prisma Studio (database GUI)
pnpm prisma studio

# Push schema changes without migration (development)
pnpm prisma db push

# Reset database (WARNING: deletes all data)
pnpm prisma migrate reset
```

### Supabase Integration
- Prisma works alongside Supabase Auth
- Use Prisma for database operations
- Use Supabase Client for authentication
- Connection string in `.env.local`: `DATABASE_URL`
- Direct connection string for migrations: `DIRECT_URL`

## Authentication & Middleware

### Supabase Proxy (Next.js 15+ Pattern)
This project uses the **proxy pattern** instead of the traditional `middleware.ts` file, which is the recommended approach for Next.js 15+ with Supabase SSR.

#### File Structure
- **`proxy.ts`** (root): Exports the `proxy` function and route matcher config
- **`lib/supabase/middleware.ts`**: Contains the actual Supabase session management logic

#### How It Works
1. The `proxy.ts` file exports a `proxy` function that Next.js calls for matched routes
2. It delegates to `updateSession()` from `lib/supabase/middleware.ts`
3. The middleware handles:
   - Session refresh and cookie management using `@supabase/ssr`
   - Protected route authentication (redirects to `/login` if not authenticated)
   - Auth page redirection (redirects to `/expenses` if already logged in)

#### Route Matching
The proxy runs on all routes except:
- `_next/static` (static files)
- `_next/image` (image optimization)
- `favicon.ico`
- Image files (`.svg`, `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`)

#### Protected Routes
- All routes except `/`, `/login`, and `/register` require authentication
- Unauthenticated users are redirected to `/login`
- Authenticated users accessing auth pages are redirected to `/expenses`

**Note**: Do NOT create a `middleware.ts` file in the root - use the `proxy.ts` pattern as configured.
