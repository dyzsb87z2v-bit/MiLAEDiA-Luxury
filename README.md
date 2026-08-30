# MiLAEDiA — Production Export

MiLAEDiA is a cinematic editorial gallery and clearly labeled demo-commerce experience for Persian rugs and tapestries. This repository is a pnpm workspace containing the React/Vite frontend, the small Express API used by the admin session, and the shared workspace libraries.

## Requirements

- Node.js 24 (Node 20+ should work for the frontend)
- pnpm 9+

## Install

```bash
pnpm install
```

## Run locally

Run the frontend and API in separate terminals:

```bash
PORT=5173 BASE_PATH=/milaedia/ pnpm --filter @workspace/milaedia run dev
```

```bash
PORT=8080 NODE_ENV=development SESSION_SECRET=replace-with-a-long-random-value \
  pnpm --filter @workspace/api-server run dev
```

The frontend expects `/api` requests to be reverse-proxied to the API server. In local development, configure your hosting proxy or Vite middleware so `/api/*` reaches port 8080.

For a root deployment, use `BASE_PATH=/` instead of `/milaedia/`.

## Build and serve

```bash
pnpm run typecheck
PORT=5173 BASE_PATH=/milaedia/ pnpm --filter @workspace/milaedia run build
pnpm --filter @workspace/milaedia run serve
```

The static frontend output is written to `artifacts/milaedia/dist/public`. Host that directory on a static provider and reverse-proxy `/api` to the Express API if admin session functionality is required.

To build the API:

```bash
pnpm --filter @workspace/api-server run build
PORT=8080 NODE_ENV=production SESSION_SECRET=replace-with-a-long-random-value \
  pnpm --filter @workspace/api-server run start
```

## Environment variables

### Frontend build

- `PORT` — Vite dev/preview port.
- `BASE_PATH` — public URL prefix, for example `/milaedia/` or `/`.

### API server

- `PORT` — API listening port.
- `NODE_ENV` — use `production` for production cookie behavior.
- `SESSION_SECRET` — required; use a long random value and keep it outside source control.
- `ADMIN_EMAIL` — required for production admin login.
- `ADMIN_PASSWORD` — required for production admin login.
- `LOG_LEVEL` — optional API log level.
- `DATABASE_URL` — required only if the shared database package is enabled for future persistent features.

The current catalogue, gallery content, cart, custom-order draft, and demo orders are stored in the browser through typed local data and localStorage. Payment processing, email delivery, cloud uploads, and permanent catalogue persistence are not enabled.

## Important media and assets

All public media used by the website is included in:

```text
artifacts/milaedia/public/assets/
```

The Hero source-of-truth MOV is:

```text
artifacts/milaedia/public/assets/hero-opening.mov
```

Browser-compatible derivatives are also included:

```text
artifacts/milaedia/public/assets/hero-opening-browser.webm
artifacts/milaedia/public/assets/hero-opening-browser.mp4
```

The Hero poster fallback is `hero-reference.jpg`. The Heritage Window Gallery uses the supplied Persian rug, tapestry, workshop, interior, and Hero media from the same assets directory. No external image URLs are required.

## Routes

Public routes:

- `/`
- `/collections`
- `/collections/:slug`
- `/products/:id`
- `/gallery`
- `/weave`
- `/workshop`
- `/about`
- `/contact`
- `/search`
- `/cart`
- `/checkout`
- `/order-confirmation`
- `/custom-order`

Admin routes:

- `/admin/login`
- `/admin/dashboard`
- `/admin/products`
- `/admin/orders`
- `/admin/custom-orders`
- `/admin/categories`
- `/admin/pricing`
- `/admin/inventory`
- `/admin/customers`
- `/admin/messages`
- `/admin/content`
- `/admin/gallery`
- `/admin/settings`

## Project map

- `artifacts/milaedia/src/App.tsx` — public shell, homepage, routes, Hero, Heritage Window Gallery, cart wiring, and admin route composition.
- `artifacts/milaedia/src/index.css` — visual tokens, responsive layout, motion, 3D depth, carousel, and window-gallery styles.
- `artifacts/milaedia/src/components/MobileRugCarousel.tsx` — mobile scroll-snap rug interaction.
- `artifacts/milaedia/src/pages/weave/WeavePage.tsx` — textile inspection viewer.
- `artifacts/milaedia/src/context/CatalogContext.tsx` — development catalogue and local persistence.
- `artifacts/milaedia/src/context/AdminAuthContext.tsx` — signed API session integration.
- `artifacts/api-server/src/routes/admin-auth.ts` — development/production admin session endpoints.
- `lib/` — shared API, database, and generated workspace libraries.

## Migration notes and limitations

The project can be built and served outside Replit with Node and pnpm. The Replit Vite plugins are development-only and are skipped when `REPL_ID` is absent. The frontend still needs a normal reverse proxy or same-origin deployment for `/api/admin/*` requests.

The admin UI is protected by signed HTTP-only cookies, but the catalogue and administrative records remain local development data. Before production use, replace the local repository with a server-side database, implement server-side CRUD authorization, configure secure deployment secrets, and add real payment, email, upload, and fulfilment services.