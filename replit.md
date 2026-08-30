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
- `artifacts/milaedia/public/assets/` — verified supplied imagery, reference crop, poster fallback, and the exact uploaded hero opening video.

## Architecture decisions

- The first release is a frontend-first presentation build with local typed data and localStorage for cart/custom-order draft state; live commerce and admin services are intentionally not claimed.
- The public shell and admin shell are separate; admin routes are not included in public navigation.
- The exact uploaded `hero-opening.mov` is the first/source-of-truth hero media. WebM/VP9 and MP4/H.264 visual derivatives cover browsers that cannot decode the supplied HEVC MOV, with `hero-reference.jpg` as the poster fallback.
- Asset filenames are not semantic: the verified map treats `04`/`05` as Berlin window compositions, `03` as the weaving detail, `06` as rug detail, `07`/`14` as lamp studies, `15` as the armchair, and `08` as a non-public project-brief screenshot.
- Hero depth uses nine restrained layered planes, pointer/scroll interpolation, a 1–2 second CSS entrance sequence, and CSS 3D rather than WebGL, prioritizing mobile performance and reduced-motion support.
- Home sections below the hero use IntersectionObserver reveals with opacity, translate, scale, and minute rotateY motion; normal scrolling remains untouched.
- The living archive is a reusable, catalog-backed 3D rug selector: it keeps the active frame centered, flips around the Y axis, and exposes keyboard, arrow, indicator, and swipe controls.
- The brand is online-only; public copy must not imply a showroom, physical visit, or appointment address.

## Product

- Browse editorial collections and products.
- View product details and availability states.
- Add, remove, and adjust items in a local cart.
- Complete a clearly labeled demo checkout flow.
- Submit a custom rug inquiry with reference-image selection.
- Explore the workshop, gallery lightbox, about, contact, legal, and search routes.
- Turn through the five-piece living archive with pointer tilt, keyboard arrows, touch swipe, and accessible controls.
- Open a local demo admin login/dashboard without exposing it in public navigation.

## User preferences

- Preserve the supplied MiLAEDiA visual identity and use actual supplied assets instead of generic stock imagery.
- Keep the experience premium, dark, restrained, cinematic, and mobile-friendly.

## Gotchas

- Do not trust filenames in the supplied asset archive; several PNGs are crops from a composite reference and one is a project-brief screenshot.
- The hero media is reference material, not a source of commercial claims; real payment, inventory, contact delivery, and authentication still need service integration.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
