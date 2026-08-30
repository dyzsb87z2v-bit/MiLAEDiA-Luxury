import { useState, useRef, useEffect, CSSProperties } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Product, money } from '../data/catalog';
import { Link } from 'wouter';

export function MobileRugCarousel({ products }: { products: Product[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [turning, setTurning] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const startX = useRef<number | null>(null);
  const dragged = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => () => { if (timeoutRef.current) window.clearTimeout(timeoutRef.current); }, []);
  useEffect(() => {
    setActiveIndex(0);
    setPendingIndex(null);
    setTurning(false);
  }, [products]);

  if (products.length === 0) return null;
  const count = products.length;
  const active = products[Math.min(activeIndex, count - 1)];

  const turnTo = (nextIndex: number) => {
    if (turning || nextIndex === activeIndex) return;
    const forwardDistance = (nextIndex - activeIndex + count) % count;
    setDirection(forwardDistance <= count / 2 ? 1 : -1);
    setPendingIndex(nextIndex);
    setTurning(true);
    timeoutRef.current = window.setTimeout(() => {
      setActiveIndex(nextIndex);
      setPendingIndex(null);
      setTurning(false);
    }, 820);
  };

  const turnBy = (amount: number) => turnTo((activeIndex + amount + count) % count);
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); turnBy(1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); turnBy(-1); }
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); turnBy(1); }
  };
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    startX.current = event.clientX;
    dragged.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (startX.current !== null && Math.abs(event.clientX - startX.current) > 44) turnBy(event.clientX < startX.current ? 1 : -1);
    startX.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (startX.current !== null && Math.abs(event.clientX - startX.current) > 44) {
      dragged.current = true;
      turnBy(event.clientX < startX.current ? 1 : -1);
      startX.current = null;
      return;
    }
    if (event.pointerType === 'touch') return;
    const rect = event.currentTarget.getBoundingClientRect();
    setTilt({ x: ((event.clientX - rect.left) / rect.width - 0.5) * 3, y: -((event.clientY - rect.top) / rect.height - 0.5) * 2 });
  };
  const commitFallbackSwipe = (clientX: number) => {
    if (startX.current === null || Math.abs(clientX - startX.current) <= 44) return;
    dragged.current = true;
    turnBy(clientX < startX.current ? 1 : -1);
    startX.current = null;
  };

  const faces = [
    <div key={`active-${active.id}`} className={`rug-face current ${turning ? (direction === 1 ? 'turn-forward' : 'turn-back') : ''}`}>
      <Link href={`/products/${active.slug}`} className="block h-full w-full" onClick={(event) => { if (dragged.current) event.preventDefault(); }}>
        <img src={active.image} alt={active.name} className="rug-art" draggable={false} />
        <div className="rug-frame-line" />
        <div className="rug-frame-caption"><span>MiLAEDiA / {String(activeIndex + 1).padStart(2, '0')}</span><span>{active.collection.replaceAll('-', ' ')}</span></div>
      </Link>
    </div>,
  ];
  if (pendingIndex !== null) {
    const incoming = products[pendingIndex];
    faces.push(
      <div key={`pending-${incoming.id}`} className={`rug-face incoming ${direction === 1 ? 'from-forward' : 'from-back'}`}>
        <img src={incoming.image} alt={incoming.name} className="rug-art" />
        <div className="rug-frame-line" />
        <div className="rug-frame-caption"><span>MiLAEDiA / {String(pendingIndex + 1).padStart(2, '0')}</span><span>{incoming.collection.replaceAll('-', ' ')}</span></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        className="rug-stage !max-w-full !aspect-[3/4]"
        role="group"
        aria-label={`Use arrow keys or swipe to browse rugs.`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => { startX.current = null; }}
        onPointerMove={handlePointerMove}
        onMouseDown={(event) => { startX.current = event.clientX; dragged.current = false; }}
        onMouseMove={(event) => commitFallbackSwipe(event.clientX)}
        onMouseUp={(event) => commitFallbackSwipe(event.clientX)}
        onTouchStart={(event) => {
          if (event.touches[0]) {
            startX.current = event.touches[0].clientX;
            dragged.current = false;
          }
        }}
        onTouchMove={(event) => {
          if (event.touches[0]) commitFallbackSwipe(event.touches[0].clientX);
        }}
        onTouchEnd={(event) => {
          if (event.changedTouches[0]) commitFallbackSwipe(event.changedTouches[0].clientX);
        }}
        onPointerLeave={() => setTilt({ x: 0, y: 0 })}
        style={{ '--tilt-x': `${tilt.x}deg`, '--tilt-y': `${tilt.y}deg`, touchAction: 'pan-y' } as CSSProperties}
      >
        <div className="rug-frame">{faces}</div>
      </div>
      <div className="mt-7 flex items-end justify-between gap-6 px-4">
        <div className={`min-w-0 transition-opacity duration-500 ${turning ? 'opacity-35' : 'opacity-100'}`} key={active.id} aria-live="polite">
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
          <span className="font-meta text-[9px] text-[#c9c7c3]/35">{String(activeIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
}