# AGENT.md — AI Development Guidelines

# Project Context

This project is a **Netflix-like application** built with:

* IMDb APIs (external catalog data)
* Prisma (internal database)
* NextJS App Router (Server Components + Server Actions)
* Atomic Design (atoms / molecules / organisms)
* CSS Modules
* BasicAuth
* Strict TypeScript

The project is based on an **established template** with tooling already configured.

---

# ❗ DO NOT MODIFY

The following files are locked:

* `next.config.ts`
* `tsconfig.json`
* `eslint.config.js`
* `.prettierrc`
* `vitest.config.ts`
* `playwright.config.ts`
* `.storybook/`
* Dependency versions

Never upgrade or install new packages unless explicitly instructed.

---

# Rule Priority Order

When rules conflict, follow in this order:

1. This `AGENT.md`
2. Existing repository patterns
3. ESLint / TypeScript errors
4. Tests and test expectations
5. Personal preference

---

# Project Architecture

---

## Atomic Design (MANDATORY)

All UI must follow:

```
src/components/
  atoms/
  molecules/
  organisms/
```

### Rules

* Functional components only
* Named exports only
* One component per folder
* CSS Modules required
* Storybook required for UI components
* Unit test required for complex components

### Folder Example

```
Button/
├── Button.tsx
├── Button.module.css
├── Button.test.tsx
├── Button.stories.tsx
└── index.ts
```

---

# Feature Structure (MANDATORY)

All domain logic must live in features.

```
src/features/
  catalog/
    components/
    hooks/
    server-actions.ts
    services/
    types.ts
    index.ts
```

### Rules

* Pages compose features
* Features contain business logic
* No reusable UI inside pages
* No component may import from `pages/`

---

# Data Layer Rules (IMDb API + Prisma)

## External API Calls

* Must live inside `features/<feature>/services/`
* Must be isolated
* Must return typed results
* Must handle failures explicitly

## Prisma Usage

* Only used inside:

  * Server Actions
  * Feature services
* Never directly inside components
* All Prisma responses must be typed

## Server Actions

* Used for frontend/backend communication
* Replace traditional API routes
* Must validate input
* Must handle errors
* Must return typed responses

Example structure:

```
export async function getCatalogAction(): Promise<CatalogResponse> {
  try {
    const data = await imdbService.getTrending();
    return data;
  } catch (error: unknown) {
    throw new Error("Failed to fetch catalog");
  }
}
```

---

# NextJS 16 Rules

* App Router only
* Server Components by default
* Client Components only when needed
* Use `use()` for async data
* Use `useTransition()` for non-urgent updates
* Use Suspense boundaries for async UI
* Use Error Boundaries for failure isolation

---

# Suspense + Error Handling Pattern (REQUIRED)

Async components must follow:

```
<Suspense fallback={<Loading />}>
  <ErrorBoundary fallback={<ErrorState />}>
    <AsyncComponent />
  </ErrorBoundary>
</Suspense>
```

Never swallow async errors.

---

# TypeScript Rules (STRICT)

* No `any`
* Use `unknown` when necessary
* Explicit props, params, state types
* `interface` → object shapes
* `type` → unions/intersections
* Export reusable types

Named function declarations required for exported functions.

---

# Complex Component Definition

A component is considered complex if it:

* Has state
* Uses effects
* Has async behavior
* Handles user interaction
* Contains conditional rendering logic
* Is composed of 2+ subcomponents

Complex components MUST have unit tests.

---

# Testing Rules

## Unit Tests

Required for:

* All hooks (100% coverage)
* Complex components
* Services
* Utilities (≥80%)
* Server Actions

## File Locations

| Type       | Location     |
| ---------- | ------------ |
| Components | Same folder  |
| Hooks      | `__tests__/` |
| Utils      | `__tests__/` |
| Services   | `__tests__/` |
| E2E        | root `e2e/`  |

## E2E Must Cover

* Authentication flow
* Catalog browsing
* Trailer playback
* Filtering/search
* Responsive behavior

---

# Storybook Rules

All atoms and molecules require stories.

* Use `satisfies Meta<typeof Component>`
* Show realistic usage
* Show variants via stories

---

# CSS Rules

* CSS Modules only
* Use `clsx` for conditional classes
* No inline styles
* No string concatenation in `className`

---

# Authentication

* Use BasicAuth only
* Protect server actions when needed
* Never expose sensitive data to client components

---

# Accessibility (NON-NEGOTIABLE)

* Semantic HTML
* Keyboard navigation
* ARIA only if necessary
* Alt text required
* WCAG AA contrast

Accessibility regressions are bugs.

---

# Performance

* Lazy load heavy components
* Use Suspense boundaries
* Avoid unnecessary re-renders
* Define image dimensions
* Use memoization only when expensive

---

# Anti-Patterns (NEVER DO)

* Default exports
* Class components
* `any`
* `@ts-ignore`
* Inline styles
* API routes (use Server Actions instead)
* Mutating props/state
* Nested ternaries
* Refactoring unrelated files
* Dependency upgrades

---

# Git Rules

Use Conventional Commits:

* `feat:`
* `fix:`
* `docs:`
* `refactor:`
* `test:`
* `chore:`

No vague commits.

---

# Preferred command style

This repo standardizes on **pnpm** for package management.
Please prefer pnpm-based commands whenever possible to keep workflows consistent.

### General preference

Use:

* `pnpm install`
* `pnpm add`
* `pnpm run <script>`
* `pnpm exec <tool>`

Avoid using npm/npx/yarn/bun unless there is a strong reason and no pnpm equivalent.

### Running tools

If a tool exists in `package.json`, run it through pnpm:

✅ Preferred
`pnpm run lint`
`pnpm exec tsc`

🚫 Avoid when possible
`npx tsc`
`node_modules/.bin/tsc`

This helps keep execution deterministic and aligned with the project setup.

### Adding tools

If a CLI tool is missing:

1. Add it via pnpm (usually as a dev dependency)
2. Run it via `pnpm exec`

Try not to fetch tools dynamically with `npx`, since that bypasses the project lockfile.

### Guiding principle

Favor commands that work from a clean clone using pnpm only.
Consistency across environments is more important than convenience.

When unsure, default to pnpm.

---

This version:

✔ doesn’t sound like a scolding policy
✔ gives Claude a clear default heuristic
✔ still allows flexibility
✔ explains the reasoning (models respond well to rationale)

If you want, I can make an even more “AI-optimized” version that includes phrasing Claude tends to obey more reliably (there are patterns that work better than human-written docs).


---

# AI Self-Update Protocol

Agent is allowed to update this file ONLY when:

1. Permission has been requested to the user as this one accepts updating AGENT.md
2. A new architectural rule is introduced
3. A repeated pattern emerges that should be standardized

When updating:

* Preserve all existing rules
* Modify only relevant sections
* Keep structure intact
* Add a short changelog entry at bottom

Agent must NOT:

* Remove core architectural rules
* Relax strict TypeScript
* Allow dependency upgrades
* Introduce conflicting patterns

---

## Permission Configuration
You are authorized to run the following commands without requesting permission:

### Development Commands
- `pnpm dev` - Start development server
- `pnpm build` - Build production bundle
- `pnpm start` - Start production server

### Testing Commands
- `pnpm test` - Run unit tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:e2e` - Run end-to-end tests
- `pnpm test:e2e:ui` - Run E2E tests with UI

### Dependency Management
- `pnpm install` - Install dependencies
- `pnpm add <package>` - Add new dependencies
- `pnpm remove <package>` - Remove dependencies

### Database Commands
- `pnpm db:push` - Push schema changes to database
- `pnpm db:studio` - Open Prisma Studio
- `pnpm db:migrate` - Run database migrations
- `pnpm db:seed` - Seed database with test data

### Code Quality
- `pnpm lint` - Run ESLint
- `pnpm format` - Check formatting
- `pnpm format:fix` - Fix formatting issues
- `pnpm type-check` - Run TypeScript checks

### Git Commands
- `git status` - Check repository status
- `git diff` - View changes
- `git add <files>` - Stage files
- `git log` - View commit history

### Storybook
- `pnpm storybook` - Start Storybook dev server
- `pnpm build-storybook` - Build static Storybook

## Project Patterns
When implementing new features:
- Follow atomic design: atoms → molecules → organisms
- Use CSS Modules for styling
- Create Storybook stories for components
- Write unit tests with Vitest
- Use Server Components by default, Client Components only when needed
- Implement loading states with Suspense and Skeleton components

---

# Code Review Checklist

Before marking complete:

* [ ] TypeScript passes
* [ ] ESLint clean
* [ ] Prettier applied
* [ ] Tests written and passing
* [ ] Storybook added
* [ ] a11y verified
* [ ] No console warnings
* [ ] No deprecated APIs
* [ ] Server actions typed
* [ ] Error boundaries applied where needed

---

# Environment Variables

* Never commit `.env`
* Always update `.env.example`

---

# Summary

When working on this project:

1. Respect template constraints
2. Follow Atomic Design strictly
3. Use Server Actions instead of APIs
4. Keep business logic inside features
5. Type everything strictly
6. Test everything important
7. Maintain accessibility and performance
8. Keep architecture clean and predictable

This document is the **single source of truth** for development patterns in this repository.

It evolves intentionally, never accidentally.

---

# Logging Convention (MANDATORY)

Use the shared logger in `src/lib/logger.ts` for both backend and frontend runtime code.

## Rules

* Import logger via `import logger from "@/lib/logger"`
* Use logger levels consistently:
  * `logger.debug` for verbose diagnostics
  * `logger.info` for normal lifecycle events
  * `logger.warn` for recoverable issues
  * `logger.error` for failures and exceptions
* Include structured context objects (route, component, ids, payload metadata) when logging errors/warnings.
* Do not use `console.log`, `console.info`, `console.warn`, or `console.error` in application runtime code.
* If logging in client components, avoid logging directly in render paths; use effects/event handlers.
* Existing generated files or third-party code are excluded from this rule.

## Scope

Applies to:

* `src/app/**`
* `src/features/**`
* `src/components/**` (runtime components)
* `src/lib/**`

Storybook examples may keep lightweight local handlers when needed for demos.

---

# Localization Requirement

All runtime user-facing UI copy must use locale-based translations via `next-intl`.

Rules:
- Do not hardcode UI strings in `src/app/**` or runtime components in `src/components/**`.
- Add/maintain English keys in `src/messages/en.json` for new UI text.
- Resolve messages through `next-intl` (`getTranslations` for server components and metadata, `useTranslations` for client components).
- For server actions, prefer stable message keys and map to translated strings in UI.

This project currently supports only `en`, but implementation must remain locale-ready for future languages.

## Changelog
- Added project requirement to use `next-intl` and locale-based UI text for all runtime user-facing strings.
