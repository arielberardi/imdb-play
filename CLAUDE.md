# CLAUDE.md — Development Guidelines

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

1. This `CLAUDE.md`
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

# AI Self-Update Protocol

Claude is allowed to update this file ONLY when:

1. The user explicitly requests updating CLAUDE.md
2. A new architectural rule is introduced
3. A repeated pattern emerges that should be standardized

When updating:

* Preserve all existing rules
* Modify only relevant sections
* Keep structure intact
* Add a short changelog entry at bottom

Claude must NOT:

* Remove core architectural rules
* Relax strict TypeScript
* Allow dependency upgrades
* Introduce conflicting patterns

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
