import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Product, money } from '../data/catalog';
import { Link } from 'wouter';

export function MobileRugCarousel({ products }: { products: Product[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);
  const startScrollLeft = useRef(0);
  const dragDistance = useRef(0);
  const dragged = useRef(false);
  const scrollTimerRef = useRef<number | null>(null);
  const productKey = products.map((product) => product.id).join('|');

  useEffect(() => {
    setActiveIndex(0);
    trackRef.current?.scrollTo({ left: 0 });
  }, [productKey]);
  useEffect(() => () => {
    if (scrollTimerRef.current) window.clearTimeout(scrollTimerRef.current);
  }, []);

  if (products.length === 0) return null;
  const count = products.length;
  const active = products[Math.min(activeIndex, count - 1)];

  const nearestIndex = () => {
    const track = trackRef.current;
    if (!track) return activeIndex;
    const cards = Array.from(track.children) as HTMLElement[];
    return cards.reduce((nearest, card, index) => (
      Math.abs(card.offsetLeft - track.scrollLeft) < Math.abs(cards[nearest].offsetLeft - track.scrollLeft) ? index : nearest
    ), 0);
  };

  const turnTo = (nextIndex: number, behavior: ScrollBehavior = 'smooth') => {
    const track = trackRef.current;
    const card = track?.children[nextIndex] as HTMLElement | undefined;
    if (!track || !card) return;
    setActiveIndex(nextIndex);
    track.scrollTo({ left: card.offsetLeft, behavior });
  };
  const turnBy = (amount: number) => turnTo((activeIndex + amount + count) % count);
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); turnBy(1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); turnBy(-1); }
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); turnBy(1); }
  };
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    startX.current = event.clientX;
    startScrollLeft.current = event.currentTarget.scrollLeft;
    dragDistance.current = 0;
    dragged.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const finishDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const nextIndex = Math.abs(dragDistance.current) > 44
      ? (activeIndex + (dragDistance.current < 0 ? 1 : -1) + count) % count
      : nearestIndex();
    startX.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    turnTo(nextIndex);
  };
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (startX.current === null) return;
    const distance = event.clientX - startX.current;
    dragDistance.current = distance;
    if (Math.abs(distance) > 5) dragged.current = true;
    event.currentTarget.scrollLeft = startScrollLeft.current - distance;
  };
  const handleScroll = () => {
    if (scrollTimerRef.current) window.clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = window.setTimeout(() => setActiveIndex(nearestIndex()), 80);
  };

  return (
    <div className="w-full">
      <div
        ref={trackRef}
        className="mobile-rug-track"
        role="group"
        aria-label="Swipe or use arrow keys to browse rugs"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onPointerMove={handlePointerMove}
        onScroll={handleScroll}
      >
        {products.map((product, index) => (
          <article key={product.id} className={`mobile-rug-card ${index === activeIndex ? 'is-active' : ''}`}>
            <Link
              href={`/products/${product.slug}`}
              className="block h-full w-full"
              draggable={false}
              onDragStart={(event) => event.preventDefault()}
              onClick={(event) => {
                if (dragged.current) {
                  event.preventDefault();
                  dragged.current = false;
                }
              }}
            >
              <img src={product.image} alt={product.name} className="rug-art" draggable={false} />
              <div className="rug-frame-line" />
              <div className="rug-frame-caption">
                <span>MiLAEDiA / {String(index + 1).padStart(2, '0')}</span>
                <span>{product.collection.replaceAll('-', ' ')}</span>
              </div>
            </Link>
          </article>
        ))}
      </div>
      <div className="mt-7 flex items-end justify-between gap-6 px-4">
        <div className="min-w-0" key={active.id} aria-live="polite">
          <div className="font-meta text-[9px] uppercase tracking-[.32em] text-[#b99763]">{active.era}</div>
          <h3 className="mt-3 truncate font-display text-4xl text-[#e7ca9c]"><Link href={`/products/${active.slug}`}>{active.name}</Link></h3>
          <p className="mt-2 font-meta text-[10px] uppercase tracking-[.1em] text-[#c9c7c3]/45">{active.material} · {active.dimensions}</p>
        </div>
        <span className="shrink-0 font-meta text-sm text-[#b99763]">{money(active.price)}</span>
      </div>
      <div className="mt-7 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => turnBy(-1)} className="grid min-h-11 min-w-11 place-items-center border border-[#b99763]/50 text-[#b99763] transition hover:bg-[#b99763] hover:text-[#060506]"><ArrowLeft size={15} strokeWidth={1.2} /></button>
          <button type="button" onClick={() => turnBy(1)} className="grid min-h-11 min-w-11 place-items-center border border-[#b99763]/50 text-[#b99763] transition hover:bg-[#b99763] hover:text-[#060506]"><ArrowRight size={15} strokeWidth={1.2} /></button>
        </div>
        <div className="flex items-center gap-2">
          {products.map((product, index) => (
            <button
              key={product.id}
              type="button"
              aria-label={`Show ${product.name}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              onClick={() => turnTo(index)}
              className={`h-px transition-all ${index === activeIndex ? 'w-7 bg-[#e7ca9c]' : 'w-3 bg-[#b99763]/35'}`}
            />
          ))}
          <span className="ml-2 font-meta text-[9px] text-[#c9c7c3]/35">{String(activeIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
}