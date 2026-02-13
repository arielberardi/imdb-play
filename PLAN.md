```md
# PLAN.md — Netflix-like App (Next.js App Router + Prisma + IMDb APIs)

This plan is written so an automated coding agent (Claude Code / Codex) can execute it sequentially with clear checkpoints. It assumes the project scaffold + base folder structure already exist.

---

## 0) Guiding Principles

### Goals
- Netflix-like browsing UX (hero + rails/carousels, detail pages, watchlist/favorites, continue watching)
- Server-first (Next.js App Router, Server Components, Server Actions)
- Strict TypeScript end-to-end
- Atomic Design components (atoms / molecules / organisms)
- CSS Modules
- Suspense + Skeletons for loading states
- Robust error handling (route-level `error.tsx`, `not-found.tsx`, custom error UI)
- Accessibility-first navigation (mouse + keyboard: tab/shift-tab for regions, arrows for intra-rail navigation)

### Non-goals (for v1)
- DRM streaming / full video hosting (trailers only via external providers)
- Complex recommendations engine
- Social features

### Definition of Done (DoD)
- TypeScript strict passes, lint passes
- Core routes implemented: Home, Films, Series, Search, Detail, Auth
- BasicAuth works (signup/signin/signout)
- Watchlist/Favorites persist in Prisma
- Continue watching persists and is reflected on Home rails
- Keyboard navigation works across rails and within rail items
- Loading states show skeletons; errors show friendly pages

---

## 1) System Architecture

### 1.1 Data Sources
- **External**: IMDb APIs (catalog + trailers where available)
- **Internal**: Prisma DB for:
  - Users (BasicAuth)
  - Favorites
  - Watchlist
  - ContinueWatching progress
  - Cached metadata (optional, for performance / rate limits)

### 1.2 Rendering Strategy
- Use Server Components for pages and most data-fetching.
- Use Client Components for:
  - Carousels/rails keyboard navigation
  - Play button interactions (open modal / navigate to trailer)
  - Favorite/watchlist toggles (call Server Actions)
  - Continue watching resume interactions
- Use `Suspense` boundaries around expensive sections (hero, each rail, search results).

### 1.3 Routing (App Router)
- `/` Home
- `/auth/sign-in`
- `/auth/sign-up`
- `/films`
- `/series`
- `/search`
- `/title/[id]` (detail page; ID is external IMDb id)
- `/api/auth/*` only if needed; prefer Server Actions + cookies

---

## 3) Phase 1 — Foundations (Environment, Types, Error Handling)

### 3.1 Environment & Validation
**Steps**
1. Add env schema validation (`zod`) in `src/lib/utils/env.ts`.
2. Required env vars:
   - `DATABASE_URL`
   - `IMDB_API_KEY` (or equivalent for the chosen IMDb API provider)
   - `SESSION_SECRET`
3. Ensure Next config supports server-side fetch caching rules as needed.

**Acceptance**
- App fails fast with friendly error if env is missing.

### 3.2 Global Layout & Error Surfaces
**Steps**
1. Implement:
   - `app/layout.tsx` (Navbar + main + Footer)
   - `app/error.tsx` (route-level error UI; client component)
   - `app/not-found.tsx`
   - `app/loading.tsx` (global skeleton)
2. Add section-level `loading.tsx` for heavy routes where useful (home rails, detail page).

**Acceptance**
- Broken fetch displays `error.tsx` instead of white screen.

### 3.3 Atomic Component Baseline
**Steps**
1. Build atoms: `Button`, `Input`, `Skeleton`, `Icon`, `Tag`.
2. Define CSS module patterns (BEM-ish naming).
3. Add molecules: `AssetCard`, `Rail` (without keyboard nav yet), `SearchBar`.

**Acceptance**
- Components compile and render in at least one page.

---

## 4) Phase 2 — Prisma Models & Database

### 4.1 Prisma Schema (Initial)
**Implement in `prisma/schema.prisma`**
- `User`
- `Session` (optional if using cookie-only stateless session; otherwise store sessions)
- `Favorite`
- `Watchlist`
- `ContinueWatching`
- Optional: `CachedTitle` (store snapshot of IMDb metadata to reduce API calls)

**Suggested Model Fields**
- `User`: id, email (unique), passwordHash, createdAt, updatedAt
- `Favorite`: id, userId, imdbId, mediaType, createdAt (unique composite: userId+imdbId)
- `Watchlist`: same pattern
- `ContinueWatching`: userId, imdbId, mediaType, progressSeconds, durationSeconds, updatedAt
- `CachedTitle`: imdbId unique, payload JSON, updatedAt

**Steps**
1. Define schema.
2. Run migrations.
3. Add Prisma client in `src/lib/prisma/client.ts` with singleton pattern for dev.

**Acceptance**
- `prisma migrate` succeeds.
- Can create/read user records via a simple test script or server action.

---

## 5) Phase 3 — Authentication (BasicAuth)

### 5.1 Password Hashing + Session
**Steps**
1. Implement password hashing:
   - `bcrypt` or `argon2`
   - `src/lib/auth/password.ts`: `hashPassword`, `verifyPassword`
2. Implement cookie session:
   - Signed cookie using `SESSION_SECRET`
   - `src/lib/auth/session.ts`: createSession, readSession, destroySession
   - Store `userId` + issuedAt
3. Add route guards:
   - `requireUser()` helper for Server Components / Actions
   - `getOptionalUser()`

**Acceptance**
- Signup creates user and sets session cookie.
- Signin verifies and sets cookie.
- Signout clears cookie.

### 5.2 Auth Pages + Actions
**Steps**
1. Pages:
   - `/auth/sign-up` with `AuthForm` (client)
   - `/auth/sign-in`
2. Server Actions:
   - `auth.actions.ts`: `signUp`, `signIn`, `signOut`
3. Display user status in Navbar (Sign in / Sign out).

**Acceptance**
- End-to-end auth flow works.

---

## 6) Phase 4 — IMDb API Client + Normalized Domain Types

### 6.1 IMDb Client
**Steps**
1. `src/lib/imdb/client.ts`:
   - typed fetch wrapper
   - timeout, retries (light), error mapping
   - caching strategy:
     - Use `fetch` with `next: { revalidate: ... }` for catalog
     - No-store for user-personalized queries
2. `types.ts`:
   - Provider response types (as needed)
   - Internal normalized types: `Title`, `Person`, `Trailer`, `Episode`, `Season`

### 6.2 Mapping Layer
**Steps**
1. `mappers.ts` converts provider payload → internal types.
2. `queries.ts` exposes functions:
   - `getTrending()`
   - `getPopularMovies()`
   - `getPopularSeries()`
   - `getByGenre(mediaType, genre)`
   - `searchTitles(query)`
   - `getTitleDetails(imdbId)`
   - `getTitleTrailers(imdbId)`
   - `getEpisodes(imdbId)` (for series)
3. Add optional caching to Prisma (`CachedTitle`) if needed:
   - `getTitleDetails` checks cache first, refreshes on expiry.

**Acceptance**
- Can fetch trending + details for one title from Server Components.

---

## 7) Phase 5 — Home Page (Hero + Rails)

### 7.1 Home Data Model
**Rails to show**
- Trending
- Popular Movies
- Popular Series
- Continue Watching (personalized; requires auth)
- Favorites (personalized; requires auth)

**Steps**
1. `app/(public)/page.tsx`:
   - Render `Hero` in `Suspense`
   - Render multiple `RailsSection` blocks
2. Each rail:
   - Server component wrapper fetches rail list
   - Passes normalized `Title[]` to client `Rail` for keyboard nav

### 7.2 Skeletons
**Steps**
1. Implement skeleton variants:
   - `HeroSkeleton`
   - `RailSkeleton`
2. Wrap each section with `Suspense fallback={<RailSkeleton />}`

**Acceptance**
- Home loads progressively; rails show skeletons while fetching.

---

## 8) Phase 6 — Films & Series Pages (Category Filters)

### 8.1 Filtering UI
**Steps**
1. Add `FilterChips` molecule:
   - genre list
   - active selection
2. Server-side filtering with query params:
   - `/films?genre=Action`
   - `/series?genre=Drama`
3. Use `searchParams` in page Server Component to fetch correct rail list.

### 8.2 Pagination (Optional v1.1)
- If API supports paging, add “Load more” (client) calling a server action or route handler.

**Acceptance**
- Changing genre updates results (via navigation / link).

---

## 9) Phase 7 — Search Page

### 9.1 Search UX
**Steps**
1. `/search` page:
   - `SearchBar` (client) with debounced input updating URL query param (`?q=...`)
   - Results section Server Component keyed by `q` to fetch `searchTitles(q)`
2. Skeleton for results; empty states.

**Acceptance**
- Typing shows results; URL is shareable.

---

## 10) Phase 8 — Detail Page (Title Info + Trailer + Cast + Episodes)

### 10.1 Detail Layout
**Steps**
1. `/title/[id]/page.tsx` fetches:
   - `getTitleDetails(id)`
   - `getTitleTrailers(id)` (if available)
   - `getEpisodes(id)` if series
2. Render `AssetDetails` organism:
   - Poster / backdrop
   - Title, description, rating, year, genres
   - Cast list
   - Trailer play button (opens modal or navigates to trailer route)
   - Favorite / Watchlist buttons (client; server actions)
   - If series: `EpisodeSelector` with seasons/episodes
     - If episode-specific trailer unavailable, fall back to series trailer

### 10.2 Trailer Playback
**Approach**
- Use a modal overlay with an embedded player (YouTube/hosted trailer URL).
- If the IMDb API returns multiple providers, select best available.

**Acceptance**
- User can play trailer; series episode selection updates displayed episode info.

---

## 11) Phase 9 — Watchlist, Favorites, Continue Watching

### 11.1 Server Actions
**Steps**
1. `favorites.actions.ts`:
   - `addFavorite(imdbId, mediaType)`
   - `removeFavorite(imdbId)`
   - `listFavorites()`
2. `watchlist.actions.ts` similarly
3. `progress.actions.ts`:
   - `upsertProgress(imdbId, progressSeconds, durationSeconds)`
   - `listContinueWatching()`

### 11.2 UI Integration
**Steps**
1. Detail page buttons call actions and update UI optimistically.
2. Home rails:
   - Favorites and ContinueWatching rails only show if signed in
3. Add small badges on cards for:
   - Favorited
   - In watchlist
   - Progress bar (continue watching)

**Acceptance**
- Data persists and shows correctly across reloads.

---

## 12) Phase 10 — Keyboard Navigation & Accessibility

### 12.1 Navigation Model
**Requirements**
- Tab/Shift+Tab moves between major regions: Navbar → Hero → Rail1 → Rail2 → Footer
- Within a rail: arrow keys move left/right between cards
- Between rails: arrow up/down moves focus to previous/next rail (keeping nearest index if possible)
- Enter/Space activates focused card (go to detail)
- Visible focus ring always present

### 12.2 Implementation (Roving Tabindex + Region Focus)
**Steps**
1. `src/lib/a11y/rovingTabindex.ts`:
   - a hook to manage `tabIndex` for items
2. `focusRegion.ts`:
   - register “regions” (hero, each rail)
   - allow up/down to jump regions
3. `keymap.ts`:
   - define consistent key handling
4. In `Rail` (client):
   - each card is a focusable element
   - manage roving tabindex
   - handle arrow keys
5. Add `aria-label`s and landmarks:
   - `<nav aria-label="Primary">`
   - `<main>`
   - Rails as `<section aria-label="Trending">`

**Acceptance**
- Full browsing works with keyboard only.

---

## 13) Phase 11 — Error Handling & Resilience

### 13.1 App Router Error Boundaries
**Steps**
1. Add `error.tsx` for major route groups:
   - `app/(public)/error.tsx`
   - `app/(auth)/error.tsx`
   - `app/title/[id]/error.tsx`
2. Add `not-found.tsx` for unknown title IDs.

### 13.2 IMDb API Failure Modes
**Steps**
1. In IMDb client:
   - map non-200 to typed errors
2. In pages:
   - if 404: call `notFound()`
   - otherwise throw error so `error.tsx` catches
3. Add fallback UI for missing fields (no trailer, no cast, etc.)

**Acceptance**
- API outage doesn’t crash entire app; user sees friendly error.

---

## 14) Phase 12 — Performance, Caching, and Polishing

### 14.1 Caching Strategy
**Steps**
1. For catalog rails: use `revalidate` (e.g., 1–6 hours)
2. For detail pages: shorter revalidate (e.g., 1 hour)
3. For user-personalized rails: `no-store`

### 14.2 Image Optimization
**Steps**
1. Use `next/image` for posters/backdrops
2. Provide blur placeholders if available
3. Skeletons for image loading

### 14.3 CSS Modules Consistency
**Steps**
1. Create a small design token approach (spacing, radii) via CSS variables in `globals.css`
2. Keep modules scoped, avoid global leakage

**Acceptance**
- Lighthouse improves; pages feel snappy.

---

## 15) Phase 13 — Testing (Optional but Recommended)

### 15.1 Unit & Integration
**Steps**
1. Unit tests for:
   - auth helpers
   - IMDb mappers
2. Integration tests for:
   - server actions with test DB

### 15.2 Accessibility Checks
**Steps**
1. Add automated a11y checks (if tooling exists)
2. Manual keyboard walkthrough checklist:
   - Home rails
   - Detail page episode selection
   - Search results navigation

---

## 16) Execution Order Checklist (Agent-Friendly)

1. Env validation + global layout + error pages
2. Atoms + baseline UI
3. Prisma schema + migrate + Prisma client
4. BasicAuth (hashing + signed cookie session) + auth pages
5. IMDb client + normalized types + mapping layer
6. Home page (hero + rails) + skeletons
7. Films + Series pages with genre filter via searchParams
8. Search page with debounced URL query
9. Detail page with trailer + cast + favorite/watchlist + episodes
10. Server actions for favorites/watchlist/progress + integrate rails
11. Keyboard navigation (roving tabindex + region focus)
12. Error resilience for API failures + not-found
13. Performance pass (caching, images)
14. Testing + a11y checklist

---

## 17) Open Decisions (Pick Early)

- Exact IMDb API provider endpoints & trailer availability shape (impacts `types.ts` & `mappers.ts`)
- Trailer playback approach (modal vs dedicated `/watch/[id]`)
- Whether to persist cached external metadata in Prisma (`CachedTitle`) in v1 or add later

---

## 18) Acceptance Criteria (MVP)

- Users can sign up / sign in / sign out
- Users can browse Home, Films, Series, Search
- Users can open Detail pages and play at least one trailer when available
- Users can add/remove favorites & watchlist
- Continue watching updates when “play” is used (simulate progress update for MVP)
- Fully keyboard navigable rails (tab + arrows) with visible focus indicators
- Skeleton loading states present and error pages catch failures
```
