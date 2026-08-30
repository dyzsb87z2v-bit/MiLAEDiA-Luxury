import { useState } from 'react';
import { useParams, Link, useLocation } from 'wouter';
import { useCatalog } from '../../context/CatalogContext';
import { canAcquireProduct, money } from '../../data/catalog';
import { ArrowLeft, ZoomIn, Plus, Heart } from 'lucide-react';
import NotFound from '../not-found';
import { ProductCard } from '../../components/ProductCard';

export function ProductPage({ onAdd }: { onAdd: (id: string) => void }) {
  const { productSlug } = useParams<{ productSlug: string }>();
  const { products, collections } = useCatalog();
  const [, setLocation] = useLocation();
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const product = products.find(p => p.slug === productSlug);
  if (!product) return <NotFound />;

  const related = products.filter(p => p.collection === product.collection && p.id !== product.id).slice(0, 3);
  const collectionName = collections.find(c => c.slug === product.collection)?.title || product.collection.replace('-', ' ');
  const isAvailable = canAcquireProduct(product);

  return (
    <main className="pt-[76px] min-h-[100dvh]">
      <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-10 md:py-16">
        
        <Link href="/collections" className="inline-flex items-center gap-2 font-meta text-[10px] uppercase tracking-[.18em] text-[#b99763] hover:text-[#e7ca9c] mb-8 transition-colors">
          <ArrowLeft size={14} /> Back to archive
        </Link>

        <div className="grid gap-12 md:grid-cols-[1.2fr_0.8fr] lg:gap-24">
          
          <div className="relative">
            <div 
              className={`relative aspect-[3/4] md:aspect-auto md:min-h-[80vh] w-full overflow-hidden border border-[#b99763]/25 bg-[#0c0a07] ${isFullscreen ? 'fixed inset-0 z-50 md:min-h-[100dvh]' : ''}`}
            >
              <img 
                src={product.image} 
                alt={product.name} 
                className={`h-full w-full object-cover transition-transform duration-700 ${isFullscreen ? 'cursor-zoom-out object-contain' : 'cursor-zoom-in hover:scale-[1.02]'}`}
                onClick={() => setIsFullscreen(!isFullscreen)}
              />
              {!isFullscreen && (
                <button 
                  onClick={() => setIsFullscreen(true)}
                  className="absolute bottom-4 right-4 bg-[#060506]/80 p-3 border border-[#b99763]/25 text-[#b99763] hover:text-[#e7ca9c] transition"
                  aria-label="Fullscreen view"
                >
                  <ZoomIn size={18} strokeWidth={1.2} />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col pt-4 md:pt-10">
            <div className="font-meta text-[9px] uppercase tracking-[.32em] text-[#b99763]">{collectionName}</div>
            <h1 className="mt-4 font-display text-5xl md:text-6xl text-[#e7ca9c]">{product.name}</h1>
            
            <div className="mt-6 flex items-center gap-4">
              <div className="border border-[#e7ca9c]/45 bg-[#0c0a07] px-3 py-1 font-meta text-[10px] uppercase tracking-[.15em] text-[#e7ca9c]">
                {product.status.replace('-', ' ')}
              </div>
              <span className="font-meta text-lg text-[#b99763]">{money(product.price)}</span>
            </div>

            <p className="mt-10 text-sm leading-8 text-[#c9c7c3]/70">{product.description}</p>
            
            <div className="mt-12 grid grid-cols-2 gap-y-6 border-y border-[#b99763]/25 py-8">
              <div>
                <div className="font-meta text-[9px] uppercase tracking-[.2em] text-[#b99763]">Era</div>
                <div className="mt-2 text-sm text-[#e7ca9c]">{product.era || 'Available on request'}</div>
              </div>
              <div>
                <div className="font-meta text-[9px] uppercase tracking-[.2em] text-[#b99763]">Origin</div>
                <div className="mt-2 text-sm text-[#e7ca9c]">{product.origin || 'Available on request'}</div>
              </div>
              <div>
                <div className="font-meta text-[9px] uppercase tracking-[.2em] text-[#b99763]">Material</div>
                <div className="mt-2 text-sm text-[#e7ca9c]">{product.material || 'Available on request'}</div>
              </div>
              <div>
                <div className="font-meta text-[9px] uppercase tracking-[.2em] text-[#b99763]">Dimensions</div>
                <div className="mt-2 text-sm text-[#e7ca9c]">{product.dimensions || 'Available on request'}</div>
              </div>
            </div>

            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
              {isAvailable ? (
                <button 
                  onClick={() => { onAdd(product.id); setLocation('/cart'); }}
                  className="flex-1 border border-[#b99763]/65 bg-transparent px-8 py-4 font-meta text-[10px] uppercase tracking-[.2em] text-[#e7ca9c] transition-colors hover:bg-[#b99763] hover:text-[#060506]"
                >
                  Acquire Piece
                </button>
              ) : (
                <Link href="/custom-order" className="flex flex-1 items-center justify-center border border-[#b99763]/65 bg-transparent px-8 py-4 font-meta text-[10px] uppercase tracking-[.2em] text-[#e7ca9c] transition-colors hover:bg-[#b99763] hover:text-[#060506]">
                  Inquire / Custom Order
                </Link>
              )}
              <Link href="/weave" className="flex items-center justify-center border border-[#b99763]/25 px-6 hover:bg-[#0c0a07] transition" aria-label="Inspect weave">
                <ZoomIn size={18} className="text-[#b99763]" />
              </Link>
            </div>
            
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-32 border-t border-[#b99763]/25 pt-20">
            <h2 className="font-display text-4xl text-[#e7ca9c]">Related pieces</h2>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {related.map(r => (
                <ProductCard key={r.id} product={r} onAdd={onAdd} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}