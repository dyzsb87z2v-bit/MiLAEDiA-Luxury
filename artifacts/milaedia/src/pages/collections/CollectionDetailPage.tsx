import { useCatalog } from '../../context/CatalogContext';
import { ProductCard } from '../../components/ProductCard';
import { MobileRugCarousel } from '../../components/MobileRugCarousel';
import { Link, useParams } from 'wouter';
import NotFound from '../not-found';
import { ArrowLeft } from 'lucide-react';

export function CollectionDetailPage({ onAdd }: { onAdd: (id: string) => void }) {
  const { collectionSlug } = useParams<{ collectionSlug: string }>();
  const { products, collections } = useCatalog();
  
  const collection = collections.find(c => c.slug === collectionSlug);
  if (!collection) return <NotFound />;

  const filtered = products.filter(p => p.collection === collection.slug);

  return (
    <main className="pt-[76px] min-h-[100dvh]">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
        
        <Link href="/collections" className="inline-flex items-center gap-2 font-meta text-[10px] uppercase tracking-[.18em] text-[#b99763] hover:text-[#e7ca9c] mb-12 transition-colors">
          <ArrowLeft size={14} /> Back to collections
        </Link>

        <div className="mb-16 grid gap-10 md:grid-cols-[1fr_1fr] md:items-end">
          <div>
            <div className="font-meta text-[9px] uppercase tracking-[.32em] text-[#b99763]">{collection.subtitle}</div>
            <h1 className="mt-4 font-display text-6xl md:text-8xl text-[#e7ca9c]">{collection.title}</h1>
            <p className="mt-8 max-w-md text-sm leading-8 text-[#c9c7c3]/70">{collection.intro}</p>
          </div>
          <div className="hidden md:block">
            <div className="aspect-[4/3] w-full max-w-[360px] ml-auto overflow-hidden border border-[#b99763]/25 opacity-80">
               <img src={collection.image} alt="" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden">
          {filtered.length > 0 ? (
            <MobileRugCarousel products={filtered} />
          ) : (
            <p className="text-[#c9c7c3]/50 font-meta text-xs">No pieces currently available in this collection.</p>
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.length > 0 ? (
            filtered.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={onAdd} />
            ))
          ) : (
            <p className="text-[#c9c7c3]/50 font-meta text-xs col-span-full">No pieces currently available in this collection.</p>
          )}
        </div>
      </div>
    </main>
  );
}