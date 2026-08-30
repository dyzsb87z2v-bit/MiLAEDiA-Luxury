# MiLAEDiA Luxury Rug House

An editorial online gallery and demo commerce experience for Persian rugs and tapestries, combining Persian heritage with a European point of view.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/milaedia/src/App.tsx` — public routes, local cart, custom-order flow, checkout demo, and admin demo routes.
- `artifacts/milaedia/src/data/catalog.ts` — local product, collection, and gallery content.
- `artifacts/milaedia/src/index.css` — MiLAEDiA palette, typography, motion, and shared visual tokens.
- `artifacts/milaedia/public/assets/` — verified supplied imagery plus hero reference crop and optional hero film.

## Architecture decisions

- The first release is a frontend-first presentation build with local typed data and localStorage for cart/custom-order draft state; live commerce and admin services are intentionally not claimed.
- The public shell and admin shell are separate; admin routes are not included in public navigation.
- The supplied composite reference crop is the primary hero fallback because the generated film contains malformed embedded lettering; the film remains available as optional media for a later cinematic intro.
- Hero depth uses restrained CSS motion and imagery rather than WebGL, prioritizing mobile performance and reduced-motion support.
- The brand is online-only; public copy must not imply a showroom, physical visit, or appointment address.

## Product

- Browse editorial collections and products.
- View product details and availability states.
- Add, remove, and adjust items in a local cart.
- Complete a clearly labeled demo checkout flow.
- Submit a custom rug inquiry with reference-image selection.
- Explore the workshop, gallery lightbox, about, contact, legal, and search routes.
- Open a local demo admin login/dashboard without exposing it in public navigation.

## User preferences

- Preserve the supplied MiLAEDiA visual identity and use actual supplied assets instead of generic stock imagery.
- Keep the experience premium, dark, restrained, cinematic, and mobile-friendly.

## Gotchas

- Do not trust filenames in the supplied asset archive; several PNGs are crops from a composite reference and one is a project-brief screenshot.
- The hero media is reference material, not a source of commercial claims; real payment, inventory, contact delivery, and authentication still need service integration.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
