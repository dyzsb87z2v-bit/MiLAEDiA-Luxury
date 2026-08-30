import { type CSSProperties, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Link, Route, Switch, useLocation, useParams } from 'wouter';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, Clock3, Filter,
  Heart, Instagram, LayoutDashboard, LockKeyhole, Mail, MapPin, Maximize2,
  Menu, Minus, Package, Plus, Search, Send, ShoppingBag, Trash2, UserRound,
  X,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

// Data & Context
import { money } from '@/data/catalog';
import { CatalogProvider, useCatalog } from './context/CatalogContext';


import { WeavePage } from './pages/weave/WeavePage';
import { WorkshopPage } from './pages/workshop/WorkshopPage';
import { GalleryPage } from './pages/gallery/GalleryPage';
import { OrderConfirmationPage } from './pages/checkout/OrderConfirmationPage';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { AboutPage, ContactPage, SearchPage } from './pages/misc';
// Components
import { ProductCard } from './components/ProductCard';
import NotFound from '@/pages/not-found';

// Pages
import { CollectionsPage } from './pages/collections/CollectionsPage';
import { CollectionDetailPage } from './pages/collections/CollectionDetailPage';
import { ProductPage } from './pages/products/ProductPage';
import { CartPage } from './pages/cart/CartPage';
import { CheckoutPage } from './pages/checkout/CheckoutPage';
import { CustomOrderPage } from './pages/custom-order/CustomOrderPage';


import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminGallery } from './pages/admin/AdminGallery';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminContent, AdminInventory, AdminMessages, AdminPricing } from './pages/admin/AdminOperations';
// Admin
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCustomOrders } from './pages/admin/AdminCustomOrders';

const queryClient = new QueryClient();
type CartLine = { id: string; qty: number };

function useLocalCart() {
  const [cart, setCart] = useState<CartLine[]>(() => {
    try { return JSON.parse(localStorage.getItem('milaedia-cart') || '[]'); } catch { return []; }
  });
  useEffect(() => { localStorage.setItem('milaedia-cart', JSON.stringify(cart)); }, [cart]);

  // Note: for one-of-one rugs, qty must never exceed 1. We enforce it here just in case.
  const add = (id: string) => setCart((items) => {
    const found = items.find((item) => item.id === id);
    return found ? items : [...items, { id, qty: 1 }];
  });
  const update = (id: string, qty: number) => setCart((items) => qty < 1 ? items.filter((item) => item.id !== id) : items.map((item) => item.id === id ? { ...item, qty: 1 } : item));
  const remove = (id: string) => setCart((items) => items.filter((item) => item.id !== id));
  const clear = () => setCart([]);

  return { cart, add, update, remove, clear };
}

function Header({ cartCount }: { cartCount: number }) {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const links = [['Workshop', '/workshop'], ['Collections', '/collections'], ['Gallery', '/gallery'], ['About', '/about'], ['Contact', '/contact']];
  return (
    <header className="absolute inset-x-0 top-0 z-30 border-b border-[#b99763]/25 bg-[#060506]/65 backdrop-blur-md">
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-3 sm:px-5 md:px-10">
        <Link href="/" onClick={() => setOpen(false)} className={`group flex items-center gap-2 sm:gap-3 ${location === '/' ? 'hero-intro-brand' : ''}`} data-testid="link-brand">
          <span className="grid h-9 w-9 place-items-center border border-[#b99763]/70 text-[#b99763] transition-colors group-hover:bg-[#b99763] group-hover:text-[#060506]">✦</span>
          <span className="font-display text-[22px] leading-none tracking-[.12em] text-[#e7ca9c] sm:text-[25px] sm:tracking-[.16em]">MiLAEDiA</span>
        </Link>
        <nav className="hidden items-center gap-8 lg:flex">
          {links.map(([label, href]) => <Link key={href} href={href} data-testid={`link-nav-${label.toLowerCase()}`} className={`font-meta text-[10px] uppercase tracking-[.22em] transition-colors ${location === href ? 'text-[#e7ca9c]' : 'text-[#c9c7c3]/70 hover:text-[#e7ca9c]'}`}>{label}</Link>)}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/search" className="hidden text-[#c9c7c3]/80 transition-colors hover:text-[#e7ca9c] md:block" data-testid="link-search"><Search size={17} strokeWidth={1.3} /></Link>
          <Link href="/cart" className="relative flex items-center gap-2 border-l border-[#b99763]/25 pl-4 text-[#c9c7c3]/80 transition-colors hover:text-[#e7ca9c]" data-testid="link-cart">
            <ShoppingBag size={17} strokeWidth={1.3} /><span className="font-meta text-[10px]">{cartCount.toString().padStart(2, '0')}</span>
          </Link>
          <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? 'Close navigation' : 'Open navigation'} className="ml-0 grid min-h-11 min-w-10 place-items-center border-l border-[#b99763]/25 pl-2 text-[#c9c7c3] sm:ml-2 sm:min-w-11 sm:pl-4 lg:hidden" data-testid="button-mobile-menu">{open ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </div>
      {open && <nav id="mobile-navigation" aria-label="Mobile navigation" className="border-t border-[#b99763]/25 bg-[#0c0a07] px-5 py-6 lg:hidden">
        <div className="flex flex-col gap-5">{links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="font-display text-2xl text-[#e7ca9c]" data-testid={`link-mobile-${label.toLowerCase()}`}>{label}<span className="ml-3 font-meta text-[9px] text-[#8d5e37]">↗</span></Link>)}</div>
      </nav>}
    </header>
  );
}

function Footer() {
  return <footer className="border-t border-[#b99763]/25 bg-[#0c0a07]">
    <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 md:grid-cols-[1.2fr_1fr_1fr_1fr] md:px-10">
      <div><div className="font-display text-3xl tracking-[.14em] text-[#e7ca9c]">MiLAEDiA</div><p className="mt-4 max-w-xs text-sm leading-7 text-[#c9c7c3]/60">Persian heritage.<br />European vision. Worldwide.</p><div className="mt-8 flex gap-4 text-[#b99763]"><Instagram size={16} strokeWidth={1.3} /><Mail size={16} strokeWidth={1.3} /></div></div>
      <div><div className="font-meta text-[10px] uppercase tracking-[.18em] text-[#8d5e37]">Explore</div><div className="mt-5 flex flex-col gap-3 text-sm text-[#c9c7c3]/70"><Link href="/collections" data-testid="link-footer-collections">Collections</Link><Link href="/gallery" data-testid="link-footer-gallery">Gallery</Link><Link href="/workshop" data-testid="link-footer-workshop">The Workshop</Link><Link href="/custom-order" data-testid="link-footer-custom">Custom order</Link></div></div>
      <div><div className="font-meta text-[10px] uppercase tracking-[.18em] text-[#8d5e37]">Online only</div><div className="mt-5 text-sm leading-7 text-[#c9c7c3]/70">Berlin · Tehran · Budapest<br />Private sourcing worldwide<br /><span className="text-[#b99763]">By message or email</span></div></div>
      <div><div className="font-meta text-[10px] uppercase tracking-[.18em] text-[#8d5e37]">Notes</div><div className="mt-5 flex flex-col gap-3 text-sm text-[#c9c7c3]/70"><Link href="/privacy" data-testid="link-footer-privacy">Privacy</Link><Link href="/terms" data-testid="link-footer-terms">Terms</Link><Link href="/shipping-returns" data-testid="link-footer-shipping">Shipping & returns</Link></div></div>
    </div>
    <div className="border-t border-[#b99763]/15 px-5 py-5 md:px-10"><div className="mx-auto flex max-w-[1440px] justify-between font-meta text-[9px] uppercase tracking-[.16em] text-[#c9c7c3]/35"><span>© 2024 MiLAEDiA</span><span>Berlin · Tehran · Budapest</span></div></div>
  </footer>;
}

function Shell({ children, cartCount }: { children: ReactNode; cartCount: number }) {
  const [location] = useLocation();
  const isAdmin = location.startsWith('/admin');
  return isAdmin ? <>{children}</> : <div className="grain min-h-[100dvh] bg-[#060506] text-[#e7ca9c]"><Header cartCount={cartCount} />{children}<Footer /></div>;
}

function Eyebrow({ children }: { children: ReactNode }) { return <div className="font-meta text-[9px] uppercase tracking-[.32em] text-[#b99763]">{children}</div>; }
function Rule() { return <div className="h-px w-full bg-[#b99763]/25" />; }
function SectionIntro({ kicker, title, copy }: { kicker: string; title: ReactNode; copy?: string }) { return <div className="grid gap-5 md:grid-cols-[.8fr_1.5fr] md:items-end"><div><Eyebrow>{kicker}</Eyebrow><h2 className="mt-3 font-display text-5xl leading-[.92] text-[#e7ca9c] md:text-7xl">{title}</h2></div>{copy && <p className="max-w-md text-sm leading-7 text-[#c9c7c3]/65">{copy}</p>}</div>; }

function useSceneParallax() {
  const ref = useRef<HTMLDivElement>(null);
  const [point, setPoint] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;
    const tick = () => {
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;
      setPoint({ x: current.x, y: current.y });
      if (Math.abs(target.x - current.x) > 0.002 || Math.abs(target.y - current.y) > 0.002) frame = requestAnimationFrame(tick);
      else frame = 0;
    };
    const start = () => { if (!frame) frame = requestAnimationFrame(tick); };
    const move = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      target.x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2));
      target.y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2));
      start();
    };
    const reset = () => { target.x = 0; target.y = 0; start(); };
    const scroll = () => {
      const rect = node.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      target.y = Math.max(-0.65, Math.min(0.65, (viewportCenter - (rect.top + rect.height / 2)) / Math.max(rect.height, window.innerHeight)));
      start();
    };
    node.addEventListener('pointermove', move);
    node.addEventListener('pointerleave', reset);
    node.addEventListener('pointercancel', reset);
    window.addEventListener('scroll', scroll, { passive: true });
    scroll();
    return () => {
      node.removeEventListener('pointermove', move);
      node.removeEventListener('pointerleave', reset);
      node.removeEventListener('pointercancel', reset);
      window.removeEventListener('scroll', scroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return { ref, point };
}

function HeroScene() {
  const { ref, point } = useSceneParallax();
  const style = {
    '--scene-x': `${point.x * 12}px`,
    '--scene-y': `${point.y * 8}px`,
  } as CSSProperties;
  return <div ref={ref} className="hero-scene absolute inset-0 overflow-hidden" style={style} aria-hidden="true">
    <div className="hero-layer hero-city-layer">
      <img src="/assets/04_workshop_weaving_woman.png" alt="" className="h-full w-full object-cover object-left" />
    </div>
    <div className="hero-layer hero-architecture-layer">
      <img src="/assets/05_folded_silk_rugs.png" alt="" className="h-full w-full object-cover object-center" />
    </div>
    <div className="hero-layer hero-video-layer">
      <video autoPlay muted playsInline loop preload="metadata" poster="/assets/hero-reference.jpg" aria-hidden="true">
        <source src="/assets/hero-opening.mov" type="video/quicktime" />
        <source src="/assets/hero-opening-browser.webm" type="video/webm" />
        <source src="/assets/hero-opening-browser.mp4" type="video/mp4" />
      </video>
    </div>
    <div className="hero-layer hero-interior-layer">
      <picture>
        <source media="(max-width: 767px)" srcSet="/assets/02_hero_persian_rug.png" />
        <img src="/assets/hero-reference.jpg" alt="" className="h-full w-full object-cover" fetchPriority="high" />
      </picture>
    </div>
    <div className="hero-layer hero-wall-rug-layer"><img src="/assets/06_gallery_luxury_rug_room.png" alt="" className="h-full w-full object-cover object-center" /></div>
    <div className="hero-layer hero-floor-rug-layer"><img src="/assets/09_antique_rug.png" alt="" className="h-full w-full object-cover object-center" /></div>
    <div className="hero-layer hero-city-detail-layer"><img src="/assets/05_folded_silk_rugs.png" alt="" className="h-full w-full object-cover object-left" /></div>
    <div className="hero-layer hero-weaver-layer"><img src="/assets/03_hero_weaving_woman.png" alt="" className="h-full w-full object-cover object-right-bottom" /></div>
    <div className="hero-light-layer" />
    <div className="hero-atmosphere-layer" />
  </div>;
}

function useScrollReveals() {
  const rootRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (!targets.length) return;
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targets.forEach((target) => target.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01, rootMargin: '0px 0px -8% 0px' });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);
  return rootRef;
}

function RugSelector() {
  const { products } = useCatalog();
  const [activeIndex, setActiveIndex] = useState(0);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [turning, setTurning] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const startX = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const count = products.length;
  const displayIndex = Math.min(activeIndex, Math.max(0, count - 1));
  const active = products[displayIndex];

  useEffect(() => () => { if (timeoutRef.current) window.clearTimeout(timeoutRef.current); }, []);
  useEffect(() => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setActiveIndex((index) => Math.min(index, Math.max(0, products.length - 1)));
    setPendingIndex(null);
    setTurning(false);
  }, [products]);

  const turnTo = (nextIndex: number) => {
    if (count === 0 || turning || nextIndex === displayIndex) return;
    const forwardDistance = (nextIndex - displayIndex + count) % count;
    setDirection(forwardDistance <= count / 2 ? 1 : -1);
    setPendingIndex(nextIndex);
    setTurning(true);
    timeoutRef.current = window.setTimeout(() => {
      setActiveIndex(nextIndex);
      setPendingIndex(null);
      setTurning(false);
    }, 820);
  };
  const turnBy = (amount: number) => {
    if (count > 0) turnTo((displayIndex + amount + count) % count);
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); turnBy(1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); turnBy(-1); }
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); turnBy(1); }
  };
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => { startX.current = event.clientX; };
  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (startX.current !== null && Math.abs(event.clientX - startX.current) > 44) turnBy(event.clientX < startX.current ? 1 : -1);
    startX.current = null;
  };
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return;
    const rect = event.currentTarget.getBoundingClientRect();
    setTilt({ x: ((event.clientX - rect.left) / rect.width - 0.5) * 3, y: -((event.clientY - rect.top) / rect.height - 0.5) * 2 });
  };
  if (!active) {
    return <section className="rug-selector border-y border-[#b99763]/25 bg-[#0c0a07]">
      <div className="mx-auto max-w-[1440px] px-5 py-24 text-center md:px-10">
        <Eyebrow>The living archive</Eyebrow>
        <h2 className="mt-4 font-display text-5xl text-[#e7ca9c]">The next edit is being prepared.</h2>
        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#c9c7c3]/60">No works are currently listed. Please return as the archive evolves.</p>
      </div>
    </section>;
  }

  const faces = [
    <div key={`active-${active.id}`} className={`rug-face current ${turning ? (direction === 1 ? 'turn-forward' : 'turn-back') : ''}`}>
      <img src={active.image} alt="" className="rug-art" />
      <div className="rug-frame-line" />
      <div className="rug-frame-caption"><span>MiLAEDiA / {String(displayIndex + 1).padStart(2, '0')}</span><span>{active.collection.replaceAll('-', ' ')}</span></div>
    </div>,
  ];
  if (pendingIndex !== null) {
    const incoming = products[pendingIndex];
    if (incoming) faces.push(<div key={`pending-${incoming.id}`} className={`rug-face incoming ${direction === 1 ? 'from-forward' : 'from-back'}`}>
      <img src={incoming.image} alt="" className="rug-art" />
      <div className="rug-frame-line" />
      <div className="rug-frame-caption"><span>MiLAEDiA / {String(pendingIndex + 1).padStart(2, '0')}</span><span>{incoming.collection.replaceAll('-', ' ')}</span></div>
    </div>);
  }

  return <section className="rug-selector border-y border-[#b99763]/25 bg-[#0c0a07]">
    <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-24 md:grid-cols-[.72fr_1.28fr] md:items-center md:px-10 md:py-32">
      <div>
        <Eyebrow>The living archive</Eyebrow>
        <h2 className="mt-4 max-w-md font-display text-6xl leading-[.86] text-[#e7ca9c] md:text-8xl">Turn the<br /><i className="text-[#b99763]">piece.</i></h2>
        <p className="mt-8 max-w-sm text-sm leading-7 text-[#c9c7c3]/65">A closer edit of works held in the house. Turn the frame slowly; each piece is one of one.</p>
        <div className="mt-10 flex items-center gap-4">
          <button type="button" onClick={() => turnBy(-1)} aria-label="Previous rug" className="grid min-h-11 min-w-11 place-items-center border border-[#b99763]/50 text-[#b99763] transition hover:bg-[#b99763] hover:text-[#060506]" data-testid="button-rug-previous"><ArrowLeft size={15} strokeWidth={1.2} /></button>
          <button type="button" onClick={() => turnBy(1)} aria-label="Next rug" className="grid min-h-11 min-w-11 place-items-center border border-[#b99763]/50 text-[#b99763] transition hover:bg-[#b99763] hover:text-[#060506]" data-testid="button-rug-next"><ArrowRight size={15} strokeWidth={1.2} /></button>
          <span className="ml-2 font-meta text-[9px] uppercase tracking-[.16em] text-[#c9c7c3]/45">Swipe or use arrows</span>
        </div>
      </div>
      <div>
        <div
          className="rug-stage"
          role="group"
          aria-label={`${active.name}. Use arrow keys or swipe to browse rugs.`}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => { startX.current = null; }}
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setTilt({ x: 0, y: 0 })}
          style={{ '--tilt-x': `${tilt.x}deg`, '--tilt-y': `${tilt.y}deg` } as CSSProperties}
          data-testid="rug-selector-stage"
        >
          <div className="rug-frame">{faces}</div>
        </div>
        <div className="mt-7 flex items-end justify-between gap-6">
          <div className={`min-w-0 transition-opacity duration-500 ${turning ? 'opacity-35' : 'opacity-100'}`} key={active.id} aria-live="polite">
            <Eyebrow>{active.era} · {active.origin}</Eyebrow>
            <h3 className="mt-3 truncate font-display text-4xl text-[#e7ca9c] md:text-5xl">{active.name}</h3>
            <p className="mt-2 font-meta text-[10px] uppercase tracking-[.1em] text-[#c9c7c3]/45">{active.material} · {active.dimensions}</p>
          </div>
          <span className="shrink-0 font-meta text-sm text-[#b99763]">{money(active.price)}</span>
        </div>
        <div className="mt-7 flex items-center gap-2" aria-label="Rug selection">
          {products.map((product, index) => <button key={product.id} type="button" aria-label={`Show ${product.name}`} aria-current={index === displayIndex ? 'true' : undefined} onClick={() => turnTo(index)} className={`h-px transition-all duration-500 ${index === displayIndex ? 'w-10 bg-[#e7ca9c]' : 'w-5 bg-[#b99763]/35 hover:bg-[#b99763]'}`} data-testid={`button-rug-indicator-${index}`} />)}
          <span className="ml-2 font-meta text-[9px] text-[#c9c7c3]/35">{String(displayIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  </section>;
}

function HomePage({ onAdd }: { onAdd: (id: string) => void }) {
  const revealRoot = useScrollReveals();
  const { collections, products } = useCatalog();
  const heritageWindows: Array<{ title: string; note: string; image: string; alt: string; video?: string; cta?: boolean }> = [
    { title: 'ANCIENT PERSIA', note: 'THE ART OF HANDWEAVING', image: '/assets/09_antique_rug.png', alt: 'Antique Persian rug detail' },
    { title: 'HANDWOVEN', note: 'CRAFTED THREAD BY THREAD', image: '/assets/10_handwoven_silk_rug.png', alt: 'Handwoven silk rug detail' },
    { title: 'IRAN', note: 'WHERE THE THREAD BECOMES MEMORY', image: '/assets/03_hero_weaving_woman.png', alt: 'Hand-weaving detail from the atelier', video: '/assets/hero-presentation.mp4' },
    { title: 'BERLIN', note: 'A CONTEMPORARY HOME FOR HERITAGE', image: '/assets/04_workshop_weaving_woman.png', alt: 'Berlin gallery atmosphere at dusk', video: '/assets/hero-opening-browser.mp4' },
    { title: 'HUNGARY', note: 'A EUROPEAN CULTURAL BRIDGE', image: '/assets/15_luxury_armchair.png', alt: 'Refined Central European interior detail' },
    { title: 'OBJECTS WITH A PAST.', note: 'THE RUG / COLLECTED / HELD', image: '/assets/12_antique_silk_tapestry.png', alt: 'Antique silk tapestry detail' },
    { title: 'THE WEAVE', note: 'EXAMINE THE WEAVE →', image: '/assets/06_gallery_luxury_rug_room.png', alt: 'Rug in a gallery interior', cta: true },
  ];
  return <main ref={revealRoot}>
    <section className="hero-section hero-cinematic relative flex items-end overflow-hidden border-b border-[#b99763]/25 pt-24">
      <HeroScene />
      <div className="absolute inset-0 bg-gradient-to-r from-[#060506]/90 via-[#060506]/25 to-[#060506]/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#060506] via-transparent to-[#060506]/35" />
      <div className="hero-intro-curtain absolute inset-0 z-[4]" aria-hidden="true" />
      <div className="hero-content relative z-[2] mx-auto w-full max-w-[1440px] px-5 pb-16 md:px-10 md:pb-24">
        <div className="max-w-sm">
          <h1 className="sr-only">MiLAEDiA — Persian Heritage. European Vision. Worldwide.</h1>
          <div className="hero-intro-eyebrow"><Eyebrow>Private gallery · Berlin</Eyebrow></div>
          <p className="hero-intro-headline mt-4 max-w-xs font-display text-3xl leading-[1.05] text-[#e7ca9c] md:text-4xl">Objects with a past.</p>
          <p className="hero-intro-description mt-5 max-w-xs text-sm leading-7 text-[#c9c7c3]/78">Rare Persian rugs and tapestries, gathered for rooms that understand the value of time.</p>
          <div className="hero-intro-cta">
            <Link href="/collections" className="mt-7 inline-flex items-center gap-4 border border-[#b99763]/65 px-5 py-3 font-meta text-[10px] uppercase tracking-[.2em] text-[#e7ca9c] transition-colors hover:bg-[#b99763] hover:text-[#060506]" data-testid="link-enter-collections">Enter the collection <ArrowRight size={14} strokeWidth={1.2} /></Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-7 right-5 z-[3] hidden font-meta text-[9px] uppercase tracking-[.22em] text-[#c9c7c3]/55 md:block"><span className="text-[#b99763]">01</span> / 05 — Berlin salon</div>
    </section>
    <section data-reveal className="reveal-on-scroll mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36"><SectionIntro kicker="A house of pieces" title={<>Collected,<br /><i className="text-[#b99763]">not produced.</i></>} copy="MiLAEDiA is a private gallery for Persian rugs and tapestries. We look for the small, unrepeatable things: a particular red, a softened edge, the trace of a hand." /><div className="mt-16 grid gap-4 md:grid-cols-[1.15fr_.85fr]"><div className="relative min-h-[460px] overflow-hidden border border-[#b99763]/25"><img src="/assets/06_gallery_luxury_rug_room.png" alt="MiLAEDiA Berlin gallery interior" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#060506] p-6 pt-24"><Eyebrow>01 — The Berlin gallery</Eyebrow><p className="mt-2 font-display text-3xl text-[#e7ca9c]">A room for looking slowly.</p></div></div><div className="flex flex-col justify-end border border-[#b99763]/25 bg-[#0c0a07] p-7 md:p-10"><div className="font-display text-[100px] leading-none text-[#7b311d]">“</div><p className="max-w-sm font-display text-3xl leading-[1.08] text-[#e7ca9c]">The best rugs do not decorate a room. They alter its sense of time.</p><div className="mt-10 flex items-center gap-3"><div className="h-px w-8 bg-[#b99763]" /><span className="font-meta text-[9px] uppercase tracking-[.18em] text-[#c9c7c3]/55">MiLAEDiA archive note 04</span></div></div></div></section>
    <section id="heritage-windows" data-reveal className="reveal-on-scroll border-y border-[#b99763]/25 bg-[#0c0a07]">
      <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
        <div className="flex flex-col gap-5 border-b border-[#b99763]/20 pb-10 md:flex-row md:items-end md:justify-between">
          <SectionIntro kicker="Heritage window gallery" title={<>Seven windows<br /><i className="text-[#b99763]">into the house.</i></>} />
          <p className="max-w-sm text-sm leading-7 text-[#c9c7c3]/60">An architectural edit of origin, material and the rooms in which these objects continue to live.</p>
        </div>
        <div className="heritage-window-grid mt-12 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-12 md:gap-6">
          {heritageWindows.map((window, index) => (
            (() => {
              const frame = <figure key={window.title} className={`heritage-window ${index === 0 ? 'md:col-span-3 md:translate-y-8' : index === 1 ? 'md:col-span-3 md:-translate-y-5' : index === 2 ? 'md:col-span-2 md:translate-y-14' : index === 3 ? 'md:col-span-2 md:-translate-y-2' : index === 4 ? 'md:col-span-2 md:translate-y-10' : index === 5 ? 'md:col-span-3 md:-translate-y-8' : 'md:col-span-3 md:translate-y-5'}`}>
                <div className="heritage-window-image aspect-[.72] overflow-hidden">
                  <img src={window.image} alt={window.alt} className="h-full w-full object-cover" loading="lazy" />
                  {window.video && <video className="heritage-window-video" autoPlay muted playsInline loop preload="none" poster="/assets/hero-poster.jpg" aria-hidden="true"><source src={window.video} type="video/mp4" /></video>}
                </div>
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#060506] via-[#060506]/75 to-transparent px-3 pb-4 pt-14 sm:px-5 sm:pb-5">
                  <div className="font-display text-xl text-[#e7ca9c] sm:text-2xl">{window.title}</div>
                  <div className="mt-1 font-meta text-[8px] uppercase tracking-[.16em] text-[#b99763]">{window.note}</div>
                </figcaption>
              </figure>;
              return window.cta ? <Link key={window.title} href="/weave" className="heritage-window-link" aria-label="Examine the weave">{frame}</Link> : frame;
            })()
          ))}
        </div>
      </div>
    </section>
    <RugSelector />
    <section data-reveal className="reveal-on-scroll border-y border-[#b99763]/25 bg-[#0c0a07]"><div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10"><div className="flex items-end justify-between gap-6"><SectionIntro kicker="The edit" title={<>Five ways<br /><i className="text-[#b99763]">to enter.</i></>} /><Link href="/collections" className="hidden items-center gap-3 font-meta text-[10px] uppercase tracking-[.2em] text-[#b99763] md:flex" data-testid="link-all-collections">View all <ArrowUpRight size={14} /></Link></div><div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{collections.map((item, i) => <Link href={`/collections/${item.slug}`} key={item.slug} className={`collection-card group relative overflow-hidden border border-[#b99763]/25 ${i === 0 ? 'lg:translate-y-10' : i === 3 ? 'lg:-translate-y-6' : ''}`} data-testid={`card-collection-${item.slug}`}><div className="aspect-[.78]"><img src={item.image} alt={item.title} className="collection-card-image h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" /></div><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#060506] p-4 pt-16"><div className="font-display text-2xl text-[#e7ca9c]">{item.title}</div><div className="mt-1 font-meta text-[8px] uppercase tracking-[.14em] text-[#b99763]">{item.subtitle}</div></div></Link>)}</div></div></section>
    <section data-reveal className="reveal-on-scroll mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36"><SectionIntro kicker="Available now" title={<>The quiet<br /><i className="text-[#b99763]">standouts.</i></>} copy="A small selection of works currently in the gallery. Every piece is one of one; availability is confirmed personally." /><div className="mt-14 grid gap-x-5 gap-y-14 md:grid-cols-3">{products.slice(0, 3).map((product) => <ProductCard key={product.id} product={product} onAdd={onAdd} />)}</div></section>
    <section data-reveal className="reveal-on-scroll relative min-h-[490px] overflow-hidden border-y border-[#b99763]/25"><img src="/assets/05_folded_silk_rugs.png" alt="Berlin interior at dusk" className="absolute inset-0 h-full w-full object-cover opacity-55" /><div className="absolute inset-0 bg-[#060506]/35" /><div className="relative mx-auto flex min-h-[490px] max-w-[1440px] items-center justify-between gap-10 px-5 md:px-10"><div><Eyebrow>For a particular room</Eyebrow><h2 className="mt-5 max-w-xl font-display text-6xl leading-[.86] text-[#e7ca9c] md:text-8xl">Make it<br /><i className="text-[#b99763]">yours.</i></h2></div><div className="max-w-xs"><p className="text-sm leading-7 text-[#c9c7c3]/70">Tell us about the space, the light and the feeling you are after. We will make a considered edit from our network in Iran and Europe.</p><Link href="/custom-order" className="mt-7 inline-flex items-center gap-4 border-b border-[#b99763] pb-2 font-meta text-[10px] uppercase tracking-[.2em] text-[#e7ca9c]" data-testid="link-custom-home">Begin a custom conversation <ArrowUpRight size={14} /></Link></div></div></section>
  </main>;
}

function RedirectToConfirmation({ total }: { total: number }) { const id = `ML-${Date.now().toString().slice(-6)}`; return <ConfirmationContent id={id} total={total} />; }
function ConfirmationContent({ id, total }: { id: string; total: number }) { return <main className="grid min-h-[75vh] place-items-center px-5 pt-[76px]"><div className="max-w-xl text-center"><div className="mx-auto grid h-14 w-14 place-items-center border border-[#b99763] text-[#b99763]"><Check size={23} strokeWidth={1.1} /></div><Eyebrow>Demo order confirmed</Eyebrow><h1 className="mt-5 font-display text-6xl text-[#e7ca9c]">A considered<br /><i className="text-[#b99763]">choice.</i></h1><p className="mt-5 text-sm leading-7 text-[#c9c7c3]/65">Your reference <span className="font-meta text-[#e7ca9c]">{id}</span> has been saved locally. Total: <span className="font-meta text-[#b99763]">{money(total)}</span>.</p><p className="mt-3 font-meta text-[9px] uppercase tracking-[.14em] text-[#c9c7c3]/35">No payment has been taken — this is a presentation demo.</p><Link href="/" className="mt-8 inline-flex items-center gap-3 border border-[#b99763]/55 px-5 py-3 font-meta text-[10px] uppercase tracking-[.18em] text-[#e7ca9c]" data-testid="link-order-confirmation-home">Return home <ArrowRight size={14} /></Link></div></main>; }

function LegalPage({ title, label }: { title: ReactNode; label: string }) { return <main className="pt-[76px]"><div className="mx-auto max-w-3xl px-5 py-16 md:px-10 md:py-24"><Eyebrow>{label}</Eyebrow><h1 className="mt-6 font-display text-7xl text-[#e7ca9c]">{title}</h1><div className="mt-12 space-y-8 text-sm leading-8 text-[#c9c7c3]/65"><p>MiLAEDiA is a presentation-first gallery experience. This page outlines the principles that would guide a live service; no transaction, payment or message is processed in this demo.</p><p>All catalogue descriptions, availability notes and delivery estimates are for presentation only. Works are unique and would be confirmed personally before any purchase agreement.</p><Rule /><p>For questions about this page, contact the gallery at hello@milaedia.com.</p></div></div></main>; }

function Router({ cart, onAdd, update, remove, clearCart }: { cart: CartLine[]; onAdd: (id: string) => void; update: (id: string, qty: number) => void; remove: (id: string) => void; clearCart: () => void }) {
  return (
    <Switch>
      <Route path="/" component={() => <HomePage onAdd={onAdd} />} />
      <Route path="/workshop" component={WorkshopPage} />
      <Route path="/weave" component={WeavePage} />
      <Route path="/collections/:collectionSlug" component={() => <CollectionDetailPage onAdd={onAdd} />} />
      <Route path="/collections" component={() => <CollectionsPage onAdd={onAdd} />} />
      <Route path="/gallery" component={GalleryPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/custom-order" component={CustomOrderPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/products/:productSlug" component={() => <ProductPage onAdd={onAdd} />} />
      <Route path="/cart" component={() => <CartPage cart={cart} update={update} remove={remove} />} />
      <Route path="/checkout" component={() => <CheckoutPage cart={cart} clearCart={clearCart} />} />
      <Route path="/order-confirmation/:orderId" component={OrderConfirmationPage} />
      <Route path="/search" component={() => <SearchPage onAdd={onAdd} />} />
      <Route path="/privacy" component={() => <LegalPage title="Privacy" label="Notes / 01" />} />
      <Route path="/terms" component={() => <LegalPage title="Terms" label="Notes / 02" />} />
      <Route path="/shipping-returns" component={() => <LegalPage title={<>Shipping<br /><i className="text-[#b99763]">& returns.</i></>} label="Notes / 03" />} />

      {/* Admin routes */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={() => <AdminLayout><AdminDashboard /></AdminLayout>} />
      <Route path="/admin/products" component={() => <AdminLayout><AdminProducts /></AdminLayout>} />
      <Route path="/admin/orders" component={() => <AdminLayout><AdminOrders /></AdminLayout>} />
      <Route path="/admin/categories" component={() => <AdminLayout><AdminCategories /></AdminLayout>} />
      <Route path="/admin/custom-orders" component={() => <AdminLayout><AdminCustomOrders /></AdminLayout>} />
      <Route path="/admin/inventory" component={() => <AdminLayout><AdminInventory /></AdminLayout>} />
      <Route path="/admin/pricing" component={() => <AdminLayout><AdminPricing /></AdminLayout>} />
      <Route path="/admin/customers" component={() => <AdminLayout><AdminCustomers /></AdminLayout>} />
      <Route path="/admin/messages" component={() => <AdminLayout><AdminMessages /></AdminLayout>} />
      <Route path="/admin/content" component={() => <AdminLayout><AdminContent /></AdminLayout>} />
      <Route path="/admin/gallery" component={() => <AdminLayout><AdminGallery /></AdminLayout>} />
      <Route path="/admin/settings" component={() => <AdminLayout><AdminSettings /></AdminLayout>} />

      <Route component={NotFound} />
    </Switch>
  );
}
function App() { const { cart, add, update, remove, clear } = useLocalCart(); const cartCount = cart.reduce((sum, item) => sum + item.qty, 0); return <QueryClientProvider client={queryClient}><TooltipProvider><ErrorBoundary><AdminAuthProvider><CatalogProvider><Shell cartCount={cartCount}><Router cart={cart} onAdd={add} update={update} remove={remove} clearCart={clear} /></Shell></CatalogProvider></AdminAuthProvider></ErrorBoundary></TooltipProvider><Toaster /></QueryClientProvider>; }
export default App;