import { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, ArrowLeft, Move } from 'lucide-react';
import { Link } from 'wouter';

export function WeavePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  
  // Touch specific
  const initialPinchDistance = useRef<number | null>(null);
  const initialPinchScale = useRef<number>(1);

  // Bounded pan constraints
  const clampPosition = (x: number, y: number, s: number) => {
    if (!imageRef.current || !containerRef.current) return { x, y };
    
    // Simplistic bounding: if scaled, allow pan up to scale bounds
    const maxOffset = (s - 1) * 300; // rough estimation based on half width/height
    return {
      x: Math.min(Math.max(x, -maxOffset), maxOffset),
      y: Math.min(Math.max(y, -maxOffset), maxOffset),
    };
  };

  const setBoundedScaleAndPosition = (newScale: number, cx?: number, cy?: number) => {
    const s = Math.max(1, Math.min(newScale, 8));
    setScale(s);
    if (s === 1) {
      setPosition({ x: 0, y: 0 });
    } else {
      setPosition(prev => clampPosition(prev.x, prev.y, s));
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setBoundedScaleAndPosition(scale - e.deltaY * 0.01);
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
      setPosition(clampPosition(newX, newY, scale));
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };
  
  // Pinch to zoom
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
  
  const handleTouchEnd = () => {
    initialPinchDistance.current = null;
  };

  const reset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {
        setIsFullscreen(!isFullscreen);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const preventScroll = (e: WheelEvent) => e.preventDefault();
    el.addEventListener('wheel', preventScroll, { passive: false });
    
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    
    return () => {
      el.removeEventListener('wheel', preventScroll);
      document.removeEventListener('fullscreenchange', handleFsChange);
    };
  }, []);

  return (
    <main className="min-h-[100dvh] bg-[#060506] flex flex-col md:flex-row">
      {/* Viewer Panel */}
      <div 
        ref={containerRef}
        className={`relative flex-1 ${isFullscreen ? 'h-screen w-screen' : 'h-[60vh] md:h-[100dvh]'} overflow-hidden cursor-crosshair border-b md:border-b-0 md:border-r border-[#b99763]/25 bg-[#080706]`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        aria-label="Macro textile viewer. Use scroll wheel or pinch to zoom. Drag to pan when zoomed."
        style={{ touchAction: 'none' }}
      >
        <img 
          ref={imageRef}
          src="/assets/03_hero_weaving_woman.png"
          alt="Rug weave macro detail, showing generic structural fibers"
          className={`absolute inset-0 w-full h-full object-contain transition-transform ${isDragging ? 'duration-0' : 'duration-200'}`}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center'
          }}
          draggable={false}
        />
        
        <div className="absolute inset-x-0 top-0 p-4 md:p-6 flex justify-between items-start pointer-events-none z-10">
          {!isFullscreen && (
            <Link href="/" className="pointer-events-auto inline-flex items-center gap-2 border border-[#b99763]/25 bg-[#060506]/80 px-4 py-2 font-meta text-[9px] uppercase tracking-[.2em] text-[#b99763] hover:text-[#e7ca9c] backdrop-blur-md">
              <ArrowLeft size={12} /> Exit macro
            </Link>
          )}
          {isFullscreen && <div />}
          
          <div className="pointer-events-auto flex flex-col gap-2">
            <button onClick={() => setBoundedScaleAndPosition(scale + 1)} aria-label="Zoom in" className="grid h-10 w-10 place-items-center border border-[#b99763]/25 bg-[#060506]/80 text-[#b99763] hover:text-[#e7ca9c] backdrop-blur-md"><ZoomIn size={16} /></button>
            <button onClick={() => setBoundedScaleAndPosition(scale - 1)} aria-label="Zoom out" className="grid h-10 w-10 place-items-center border border-[#b99763]/25 bg-[#060506]/80 text-[#b99763] hover:text-[#e7ca9c] backdrop-blur-md"><ZoomOut size={16} /></button>
            <button onClick={reset} aria-label="Reset view" className="grid h-10 w-10 place-items-center border border-[#b99763]/25 bg-[#060506]/80 text-[#b99763] hover:text-[#e7ca9c] backdrop-blur-md"><RotateCcw size={16} /></button>
            <button onClick={toggleFullscreen} aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"} className="grid h-10 w-10 place-items-center border border-[#b99763]/25 bg-[#060506]/80 text-[#b99763] hover:text-[#e7ca9c] backdrop-blur-md">
              <Maximize2 size={16} />
            </button>
            {scale > 1 && (
              <div className="mt-4 grid h-10 w-10 place-items-center text-[#c9c7c3]/40" aria-hidden="true">
                <Move size={16} />
              </div>
            )}
          </div>
        </div>
        
        {/* Instruction overlay briefly shown */}
        {scale === 1 && !isDragging && (
          <div className="absolute inset-x-0 bottom-8 flex justify-center pointer-events-none">
            <span className="font-meta text-[10px] uppercase tracking-widest text-[#b99763] bg-[#060506]/80 px-4 py-2 border border-[#b99763]/20 backdrop-blur-md">
              Scroll or pinch to inspect
            </span>
          </div>
        )}
      </div>

      {/* Info Panel */}
      <div className={`w-full md:w-[420px] bg-[#0c0a07] flex flex-col justify-center p-8 md:p-12 overflow-y-auto ${isFullscreen ? 'hidden' : ''}`}>
        <div className="font-meta text-[9px] uppercase tracking-[.32em] text-[#b99763]">Microscopic View</div>
        <h1 className="mt-4 font-display text-4xl text-[#e7ca9c]">The Anatomy of a Knot.</h1>
        <p className="mt-6 text-sm leading-7 text-[#c9c7c3]/70">
          A Persian rug is an architecture of thousands of individual knots, tied by hand onto a foundational grid. Note: This generic structural representation illustrates typical handwoven construction, rather than a specific piece.
        </p>

        <div className="mt-12 space-y-10">
          <div>
            <div className="flex items-center gap-4 border-b border-[#b99763]/15 pb-2">
              <span className="font-meta text-[10px] text-[#b99763]">01</span>
              <h2 className="font-display text-2xl text-[#e7ca9c]">Warp & Weft</h2>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#c9c7c3]/60">The structural skeleton. The warp runs vertically, held under tension on the loom. The weft weaves horizontally after each row of knots to lock them in place.</p>
          </div>
          <div>
            <div className="flex items-center gap-4 border-b border-[#b99763]/15 pb-2">
              <span className="font-meta text-[10px] text-[#b99763]">02</span>
              <h2 className="font-display text-2xl text-[#e7ca9c]">The Knot</h2>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#c9c7c3]/60">Typical Persian knots (Senneh) are asymmetrical, allowing for fluid, curvilinear designs. Each knot is a single strand of colored wool or silk, pulled through the warp.</p>
          </div>
          <div>
            <div className="flex items-center gap-4 border-b border-[#b99763]/15 pb-2">
              <span className="font-meta text-[10px] text-[#b99763]">03</span>
              <h2 className="font-display text-2xl text-[#e7ca9c]">The Pile</h2>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#c9c7c3]/60">Once knotted, the ends are cut. The density of these ends forms the surface you touch. Higher knot counts create sharper images and a silkier hand.</p>
          </div>
        </div>
      </div>
    </main>
  );
}