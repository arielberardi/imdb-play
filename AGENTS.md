# AGENTS.md - AI Development Guidelines

## Purpose
This document is a reusable baseline for projects that follow a modern web template with:
- Next.js App Router
- TypeScript (strict)
- Component-driven UI (Atomic Design)
- Server-side data/services (e.g., Prisma + external APIs)
- CSS Modules
- Storybook
- Unit + E2E testing

Use this file as the single source of truth for architecture, quality gates, and delivery standards.

---

## Rule Priority
When rules conflict, follow this order:
1. `AGENTS.md`
2. Existing repository architecture and conventions
3. TypeScript and ESLint constraints
4. Test expectations
5. Personal preference

---

## Core Non-Negotiables
- Must ensure Storybook coverage for required UI components.
- Must ensure Unit Testing coverage for logic and complex UI.
- Must ensure E2E coverage for critical user journeys.
- Must use `pnpm` only for dependency and script execution.
- Must use shared logger, never `console.*` in runtime app code.
- Must finish with lint and format checks passing.
- Must maintain accessibility standards (WCAG AA baseline).
- Must maintain responsive behavior (mobile-first + desktop).

---

## Package Manager Policy (MANDATORY)
Use `pnpm` only.

Required command style:
- `pnpm install`
- `pnpm add <pkg>`
- `pnpm remove <pkg>`
- `pnpm run <script>`
- `pnpm exec <tool>`

Do not use:
- `npm`
- `npx`
- `yarn`
- `bun`

If a tool is missing, add it via `pnpm` and run via `pnpm exec`.

---

## Architecture Rules

### Atomic Design (MANDATORY)
UI components must follow:

```text
src/components/
  atoms/
  molecules/
  organisms/
```

Rules:
- Functional components only
- Named exports only
- One component per folder
- CSS Modules required
- Storybook required for atoms and molecules
- Unit tests required for complex components

### Feature-First Domain Logic (MANDATORY)
Business logic must live under `src/features/<feature>/`.

Suggested structure:

```text
src/features/
  <feature>/
    components/
    hooks/
    services/
    server-actions.ts
    validators.ts
    types.ts
    index.ts
```

Rules:
- Pages compose features, not business logic.
- Reusable domain logic must not be implemented in route/page files.
- Components must not import from page-level route modules.

---

## Data and Server Rules

### Services
- External API/database access must be isolated in feature services.
- Services must return typed results.
- Service failures must be handled explicitly.

### Server Actions
- Use Server Actions for frontend/backend operations when applicable.
- Validate all inputs.
- Return typed responses.
- Handle auth/error cases explicitly.

### Database Access
- Database clients (e.g., Prisma) allowed only in services and server actions.
- Never access database client directly from UI components.

---

## Next.js and Rendering Rules
- App Router only.
- Server Components by default.
- Use Client Components only when needed.
- Use Suspense boundaries for async UI.
- Use error boundaries for isolation and recovery.

Required async boundary pattern:

```tsx
<Suspense fallback={<Loading />}>
  <ErrorBoundary fallback={<ErrorState />}>
    <AsyncComponent />
  </ErrorBoundary>
</Suspense>
```

---

## TypeScript Rules (STRICT)
- No `any`.
- Use `unknown` when needed.
- Explicit types for props, params, and return values.
- Use `interface` for object shapes.
- Use `type` for unions/intersections.
- Export reusable types.
- No `@ts-ignore`.

---

## Logging Convention (MANDATORY)
Use project logger (for example `src/lib/logger.ts`) for runtime logging.

Rules:
- Import logger through the project alias/path standard.
- Use levels consistently: `debug`, `info`, `warn`, `error`.
- Include structured context for warnings/errors.
- Do not use `console.log`, `console.info`, `console.warn`, `console.error` in runtime app code.

Scope: app runtime code (`src/app/**`, `src/features/**`, `src/components/**`, `src/lib/**`).

---

## Testing Policy (MANDATORY)

### Required Test Types
- Unit tests: required for services, server actions, validators, hooks, utilities, and complex components.
- E2E tests: required for critical user flows.
- Storybook: required for atoms and molecules; recommended for organisms when reusable.

### Complex Component Definition
A component is complex if it includes one or more:
- state
- effects
- async behavior
- user interaction logic
- non-trivial conditional rendering
- composition of multiple interactive subcomponents

Complex components must have unit tests.

### Test Placement Conventions (MANDATORY)
- Component tests: colocated in component folder.
- Non-component tests (services/server actions/hooks/validators/utils): nearest `__tests__/` directory.
- E2E tests: root `e2e/`.
- Do not place non-component tests next to implementation files.

### Minimum E2E Coverage Areas
- Authentication flow
- Primary content browsing/navigation
- Search and filtering
- Key media interaction (e.g., playback/trailer)
- Responsive behavior

---

## Storybook Policy (MANDATORY)
- Atoms and molecules must include stories.
- Use typed Storybook metadata (`satisfies Meta<typeof Component>` when applicable).
- Include realistic states/variants.
- Keep stories aligned with runtime behavior and accessibility.

---

## Accessibility Policy (MANDATORY)
- Use semantic HTML.
- Ensure keyboard accessibility for interactive controls.
- Use ARIA only when semantic HTML is insufficient.
- Provide alt text for images.
- Maintain WCAG AA contrast.
- Accessibility regressions are considered bugs.

---

## Responsive Design Policy (MANDATORY)
- Implement mobile-first layouts.
- Verify major flows on small, medium, and large viewports.
- Avoid fixed dimensions that break on narrow screens.
- Ensure navigation, forms, and interactive media are usable on mobile and desktop.

---

## CSS and UI Rules
- CSS Modules only (unless project explicitly defines alternative).
- Use `clsx` (or approved utility) for conditional classes.
- Avoid inline styles in production components.
- Avoid className string concatenation patterns that reduce readability.

---

## Anti-Patterns (NEVER)
- Default exports for components/modules where named exports are standard.
- Class components.
- `any` and `@ts-ignore`.
- Runtime `console.*` logging.
- Mutating props/state.
- Refactoring unrelated files in feature PRs.
- Dependency upgrades without explicit request.
- Package manager drift from `pnpm`.

---

## Quality Gates Before Completion (MANDATORY)
All must pass before marking work complete:
- Type checks pass
- Lint passes
- Format check passes
- Required unit tests pass
- Required E2E tests pass (or clearly documented fixture gating)
- Storybook coverage present where required
- No accessibility regressions
- No runtime console usage

Recommended checklist:
- [ ] `pnpm run lint` passes
- [ ] `pnpm run format` (or repo equivalent) passes
- [ ] `pnpm test` passes
- [ ] `pnpm test:e2e` passes or justified fixture gating documented
- [ ] Storybook stories added/updated for required components
- [ ] Non-component tests are inside `__tests__/`
- [ ] Responsive behavior validated
- [ ] Accessibility validated

---

## Environment and Secrets
- Never commit `.env` files.
- Update `.env.example` when introducing or changing required variables.
- Avoid exposing sensitive data in client components.

---

## Git and Commit Rules
Use Conventional Commits:
- `feat:`
- `fix:`
- `refactor:`
- `test:`
- `docs:`
- `chore:`

Commits must be specific and non-vague.

---

## Implementation Defaults for AI Agents
When uncertain, default to:
1. preserving architecture
2. adding tests with behavior-focused assertions
3. using `pnpm`
4. using shared logger
5. validating accessibility and responsiveness
6. shipping only when lint/format/tests are green

---

## Changelog
- Replaced project-specific guidance with reusable template for similar Next.js/TypeScript/Atomic projects.
- Added explicit mandatory policies for Storybook, Unit Testing, E2E, pnpm-only usage, logger-only runtime logging, lint/format success, accessibility, and responsive design.
