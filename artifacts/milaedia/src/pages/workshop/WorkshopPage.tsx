import { Link } from 'wouter';

function Eyebrow({ children }: { children: React.ReactNode }) { return <div className="font-meta text-[9px] uppercase tracking-[.32em] text-[#b99763]">{children}</div>; }

export function WorkshopPage() {
  return (
    <main className="pt-[76px]">
      <section className="mx-auto grid max-w-[1440px] gap-10 px-5 py-16 md:grid-cols-[.8fr_1.2fr] md:px-10 md:py-24">
        <div>
          <Eyebrow>The process</Eyebrow>
          <h1 className="mt-6 font-display text-6xl leading-[.8] text-[#e7ca9c] md:text-9xl">Hands<br /><i className="text-[#b99763]">remember.</i></h1>
          <p className="mt-10 max-w-sm text-sm leading-7 text-[#c9c7c3]/65">
            In Iran, a rug is not made by machine or by schedule. It is made by thousands of decisions, held in the hands and the eye. The process is inherently unhurried.
          </p>
        </div>
        <div className="relative aspect-[.9] overflow-hidden border border-[#b99763]/25 md:aspect-[1.1]">
          <img src="/assets/03_hero_weaving_woman.png" alt="Hand-weaving detail" className="h-full w-full object-cover" />
          <div className="absolute bottom-4 left-4 border border-[#b99763]/45 bg-[#060506]/80 px-3 py-2">
            <Eyebrow>Yazd, Iran</Eyebrow>
          </div>
        </div>
      </section>
      
      <section className="border-y border-[#b99763]/25 bg-[#0c0a07]">
        <div className="mx-auto grid max-w-[1440px] gap-14 px-5 py-24 md:grid-cols-3 md:px-10">
          <div>
            <Eyebrow>01 — The knot</Eyebrow>
            <h2 className="mt-4 font-display text-4xl text-[#e7ca9c]">Slow is a material.</h2>
          </div>
          <p className="text-sm leading-8 text-[#c9c7c3]/65">
            Each knot is a small act of attention. We work with ateliers whose methods have passed through generations, not because tradition is a badge, but because the hand leaves something the eye can feel.
          </p>
          <p className="text-sm leading-8 text-[#c9c7c3]/65">
            The tension of the warp, the weight of the beater, the cutting of the pile—every step introduces subtle variations that make a piece irreplaceable.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10">
        <div className="grid gap-4 md:grid-cols-[1.35fr_.65fr]">
          <img src="/assets/06_gallery_luxury_rug_room.png" alt="Rug textile detail" className="h-[440px] w-full object-cover md:h-[620px]" />
          <div className="flex flex-col justify-between border border-[#b99763]/25 p-7 md:p-10">
            <div>
              <Eyebrow>02 — The palette</Eyebrow>
              <h2 className="mt-4 font-display text-5xl text-[#e7ca9c]">Colour is<br /><i className="text-[#b99763]">weather.</i></h2>
            </div>
            <p className="text-sm leading-7 text-[#c9c7c3]/65">
              Cochineal, indigo, walnut husk, saffron. Natural dyes age with a room; they do not simply match it. They fade elegantly, gaining a patinated depth that synthetic colors can never replicate.
            </p>
          </div>
        </div>
      </section>

      {/* Cultural Bridge Section */}
      <section className="border-t border-[#b99763]/25 bg-[#0c0a07] overflow-hidden">
        <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32">
          <div className="text-center mb-20">
            <Eyebrow>The Journey</Eyebrow>
            <h2 className="mt-4 font-display text-5xl text-[#e7ca9c] max-w-2xl mx-auto">Three cities.<br /><i className="text-[#b99763]">One dialogue.</i></h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-[#b99763]/15 hidden md:block -translate-y-1/2 z-0" />
            
            <div className="bg-[#060506] border border-[#b99763]/25 relative z-10">
              <div className="aspect-[4/5]">
                  <img src="/assets/03_hero_weaving_woman.png" alt="Hand-weaving detail representing craft in Iran" className="w-full h-full object-cover opacity-80" />
              </div>
              <div className="p-8">
                <div className="font-meta text-xs uppercase tracking-[.2em] text-[#b99763]">Iran</div>
                <div className="mt-2 font-display text-3xl text-[#e7ca9c]">The Craft.</div>
                <p className="mt-4 text-sm text-[#c9c7c3]/60">Where the knots are tied. Sourcing directly from private ateliers and historical archives.</p>
              </div>
            </div>

            <div className="bg-[#060506] border border-[#b99763]/25 relative z-10 md:-translate-y-12">
              <div className="aspect-[4/5]">
                 <img src="/assets/04_workshop_weaving_woman.png" alt="Berlin Gallery" className="w-full h-full object-cover opacity-80 grayscale-[30%]" />
              </div>
              <div className="p-8">
                <div className="font-meta text-xs uppercase tracking-[.2em] text-[#b99763]">Berlin</div>
                <div className="mt-2 font-display text-3xl text-[#e7ca9c]">The Edit.</div>
                <p className="mt-4 text-sm text-[#c9c7c3]/60">Our primary gallery space. A contemporary context for ancient objects.</p>
              </div>
            </div>

            <div className="bg-[#060506] border border-[#b99763]/25 relative z-10 md:translate-y-12">
              <div className="aspect-[4/5]">
                  <img src="/assets/15_luxury_armchair.png" alt="Refined European interior detail" className="w-full h-full object-cover opacity-80" />
              </div>
              <div className="p-8">
                <div className="font-meta text-xs uppercase tracking-[.2em] text-[#b99763]">Hungary</div>
                <div className="mt-2 font-display text-3xl text-[#e7ca9c]">The Bridge.</div>
                <p className="mt-4 text-sm text-[#c9c7c3]/60">Connecting Eastern craft with Central European collecting culture and historical interiors.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}