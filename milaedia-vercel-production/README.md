# MiLAEDiA — Vercel Production Export

This is the standalone source export of the current MiLAEDiA website. The project root contains the actual React/Vite application, not the Replit workspace shell or the mockup sandbox.

## Run locally

Requirements: Node.js 20+ and pnpm 9+.

```bash
pnpm install
pnpm run dev
```

Open the Vite URL shown in the terminal.

## Verify and build

```bash
pnpm run typecheck
pnpm run build
pnpm run preview
```

The production website is emitted to `dist/`. The production build is a static Vite site and can be deployed directly to Vercel.

## Vercel deployment

This project includes `vercel.json` with:

- `pnpm run build`
- `dist` as the output directory
- SPA fallback rewrites to `index.html`
- `/api/admin/*` kept available for the included Vercel function

Import this folder as the repository root in Vercel. No Replit workflow, preview server, mockup sandbox, or Replit-only plugin is required.

## Environment variables

For the included admin session function:

- `SESSION_SECRET` — required signing secret.
- `ADMIN_EMAIL` — production admin email.
- `ADMIN_PASSWORD` — production admin password.

The public catalogue, cart, demo checkout, custom-order draft, gallery content, and admin records currently use local typed data and browser localStorage. Real database persistence, payment processing, email delivery, fulfilment, and cloud uploads still need to be connected before production commerce use.

## Application source

- `src/App.tsx` — current MiLAEDiA Home/Hero, public routes, Heritage Window Gallery, cart wiring, and admin route composition.
- `src/pages/` — collections, products, gallery, workshop, weave, checkout, custom order, and admin pages.
- `src/components/` — shared UI, rug cards, mobile rug carousel, and admin shell.
- `src/context/` — catalogue/local persistence and admin authentication contexts.
- `src/data/catalog.ts` — product, collection, and gallery data.
- `src/index.css` — MiLAEDiA design system, responsive layout, animation, parallax, 3D, carousel, and window-gallery styles.
- `public/assets/` — all supplied images, fonts configuration, Hero media, and poster fallbacks.
- `api/admin/[...path].ts` — standalone Vercel-compatible admin session endpoint.

## Hero media

The supplied Gemini Hero media is included at:

```text
public/assets/hero-opening.mov
public/assets/hero-opening-browser.mp4
public/assets/hero-opening-browser.webm
public/assets/hero-poster.jpg
public/assets/hero-reference.jpg
```

The website uses the MOV first, then WebM and MP4 browser derivatives, with poster fallback.

## Routes

Public:

`/`, `/collections`, `/collections/:slug`, `/products/:id`, `/gallery`, `/weave`, `/workshop`, `/about`, `/contact`, `/search`, `/cart`, `/checkout`, `/order-confirmation`, `/custom-order`

Admin:

`/admin/login`, `/admin/dashboard`, `/admin/products`, `/admin/orders`, `/admin/custom-orders`, `/admin/categories`, `/admin/pricing`, `/admin/inventory`, `/admin/customers`, `/admin/messages`, `/admin/content`, `/admin/gallery`, `/admin/settings`