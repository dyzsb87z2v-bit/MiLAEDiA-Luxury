import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useCatalog } from '../../context/CatalogContext';
import { ZoomIn, ZoomOut, X, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

export function GalleryPage() {
  const { gallery } = useCatalog();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  
  // Lightbox Zoom & Pan State
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  
  // Touch specific
  const initialPinchDistance = useRef<number | null>(null);
  const initialPinchScale = useRef<number>(1);

  const setBoundedScaleAndPosition = (newScale: number) => {
    const s = Math.max(1, Math.min(newScale, 5));
    setScale(s);
    if (s === 1) {
      setPosition({ x: 0, y: 0 });
    } else {
      const maxOffset = (s - 1) * 300; 
      setPosition(prev => ({
        x: Math.min(Math.max(prev.x, -maxOffset), maxOffset),
        y: Math.min(Math.max(prev.y, -maxOffset), maxOffset),
      }));
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (lightboxIndex === null) return;
    if (e.key === 'Escape') setLightboxIndex(null);
    if (e.key === 'Tab' && containerRef.current) {
      const focusable = Array.from(containerRef.current.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])')).filter((element) => !element.hasAttribute('disabled'));
      if (focusable.length) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    if (scale === 1) {
      if (e.key === 'ArrowRight') setLightboxIndex((lightboxIndex + 1) % gallery.length);
      if (e.key === 'ArrowLeft') setLightboxIndex((lightboxIndex - 1 + gallery.length) % gallery.length);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, gallery.length, scale]);

  const lightboxOpen = lightboxIndex !== null;
  useLayoutEffect(() => {
    if (lightboxOpen) closeButtonRef.current?.focus();
  }, [lightboxOpen]);
  useEffect(() => {
    if (!lightboxOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, [lightboxOpen]);
  
  // Reset zoom on index change
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [lightboxIndex]);

  // Prevent scroll when zoomed in lightbox
  useEffect(() => {
    const el = containerRef.current;
    if (!el || lightboxIndex === null) return;
    const preventScroll = (e: WheelEvent) => { if (scale > 1) e.preventDefault(); };
    el.addEventListener('wheel', preventScroll, { passive: false });
    return () => el.removeEventListener('wheel', preventScroll);
  }, [lightboxIndex, scale]);

  const handleWheel = (e: React.WheelEvent) => {
    if (lightboxIndex !== null) {
      setBoundedScaleAndPosition(scale - e.deltaY * 0.01);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.current.x;
      const newY = e.clientY - dragStart.current.y;
      const maxOffset = (scale - 1) * 300;
      setPosition({
        x: Math.min(Math.max(newX, -maxOffset), maxOffset),
        y: Math.min(Math.max(newY, -maxOffset), maxOffset),
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialPinchDistance.current = dist;
      initialPinchScale.current = scale;
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialPinchDistance.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = dist / initialPinchDistance.current;
      setBoundedScaleAndPosition(initialPinchScale.current * ratio);
    }
  };

  return (
    <main className="pt-[76px] min-h-[100dvh]">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
        
        <div className="mb-20">
          <div className="font-meta text-[9px] uppercase tracking-[.32em] text-[#b99763]">Visual Archive</div>
          <h1 className="mt-4 font-display text-5xl md:text-7xl text-[#e7ca9c]">The Gallery.</h1>
          <p className="mt-6 max-w-md text-sm leading-8 text-[#c9c7c3]/70">
            A visual record of pieces held, spaces inhabited, and the light that reveals them.
          </p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {gallery.map((img, i) => (
            <button
              type="button"
              key={img.id} 
              className="mb-6 block w-full break-inside-avoid relative group cursor-zoom-in border border-[#b99763]/25 bg-[#0c0a07] overflow-hidden text-left"
              onClick={() => {
                previousFocusRef.current = document.activeElement as HTMLElement;
                setLightboxIndex(i);
              }}
              aria-label={`Open ${img.title} in image viewer`}
            >
              <img src={img.src} alt={img.title} className="w-full h-auto object-cover opacity-90 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060506] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute bottom-0 left-0 p-5 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <div className="font-display text-2xl text-[#e7ca9c]">{img.title}</div>
                <div className="mt-1 font-meta text-[9px] uppercase tracking-[.15em] text-[#c9c7c3]/50">{img.note}</div>
              </div>
              <div className="absolute top-4 right-4 text-[#b99763] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <ZoomIn size={18} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <div 
          ref={containerRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#060506]/95 backdrop-blur-md overflow-hidden"
          onClick={() => { if (scale === 1) setLightboxIndex(null); }}
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => { initialPinchDistance.current = null; }}
          aria-modal="true"
          role="dialog"
          style={{ touchAction: 'none' }}
        >
          {/* Controls Layer */}
          <div className="absolute inset-0 pointer-events-none z-10 flex justify-between p-6">
            <div className="pointer-events-auto flex flex-col gap-2">
              <button onClick={(e) => { e.stopPropagation(); setBoundedScaleAndPosition(scale + 1); }} aria-label="Zoom in" className="grid h-12 w-12 place-items-center bg-[#060506]/80 border border-[#b99763]/20 text-[#b99763] hover:text-[#e7ca9c] rounded-full backdrop-blur-md"><ZoomIn size={20} /></button>
              <button onClick={(e) => { e.stopPropagation(); setBoundedScaleAndPosition(scale - 1); }} aria-label="Zoom out" className="grid h-12 w-12 place-items-center bg-[#060506]/80 border border-[#b99763]/20 text-[#b99763] hover:text-[#e7ca9c] rounded-full backdrop-blur-md"><ZoomOut size={20} /></button>
              <button onClick={(e) => { e.stopPropagation(); setBoundedScaleAndPosition(1); }} aria-label="Reset zoom" className="grid h-12 w-12 place-items-center bg-[#060506]/80 border border-[#b99763]/20 text-[#b99763] hover:text-[#e7ca9c] rounded-full backdrop-blur-md"><RotateCcw size={20} /></button>
            </div>
            <button 
              ref={closeButtonRef}
              className="pointer-events-auto h-12 w-12 grid place-items-center bg-[#060506]/80 border border-[#b99763]/20 text-[#c9c7c3] hover:text-[#e7ca9c] rounded-full backdrop-blur-md transition-colors" 
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
              aria-label="Close lightbox"
            >
              <X size={24} />
            </button>
          </div>
          
          {scale === 1 && (
            <>
              <button 
                className="absolute left-6 z-20 text-[#b99763] hover:text-[#e7ca9c] p-4 transition-colors"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + gallery.length) % gallery.length); }}
                aria-label="Previous image"
              >
                <ChevronLeft size={36} />
              </button>

              <button 
                className="absolute right-6 z-20 text-[#b99763] hover:text-[#e7ca9c] p-4 transition-colors"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % gallery.length); }}
                aria-label="Next image"
              >
                <ChevronRight size={36} />
              </button>
            </>
          )}

          <img 
            src={gallery[lightboxIndex].src} 
            alt={gallery[lightboxIndex].title} 
            className={`max-h-[85vh] max-w-[85vw] object-contain border border-[#b99763]/25 ${isDragging ? 'duration-0 cursor-grabbing' : 'duration-200 cursor-grab'}`}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            }}
            onClick={(e) => e.stopPropagation()}
            draggable={false}
          />

          {scale === 1 && (
            <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none z-10" onClick={(e) => e.stopPropagation()}>
              <div className="font-display text-2xl text-[#e7ca9c]">{gallery[lightboxIndex].title}</div>
              <div className="mt-2 font-meta text-[10px] uppercase tracking-[.2em] text-[#c9c7c3]/50">{gallery[lightboxIndex].note}</div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}