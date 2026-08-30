import { useState } from 'react';
import { useCatalog } from '../../context/CatalogContext';
import { ProductCard } from '../../components/ProductCard';
import { MobileRugCarousel } from '../../components/MobileRugCarousel';
import { Link } from 'wouter';

export function CollectionsPage({ onAdd }: { onAdd: (id: string) => void }) {
  const { products, collections } = useCatalog();
  const [filter, setFilter] = useState('All');

  const filtered = products.filter((p) => 
    (filter === 'All' || p.collection === filter)
  );

  return (
    <main className="pt-[76px] min-h-[100dvh]">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
        
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="font-meta text-[9px] uppercase tracking-[.32em] text-[#b99763]">Curated archive</div>
            <h1 className="mt-4 font-display text-5xl md:text-7xl text-[#e7ca9c]">The Collections.</h1>
          </div>
          
          <div className="flex flex-wrap gap-4 md:justify-end">
            <button
              onClick={() => setFilter('All')}
              className={`font-meta text-[10px] uppercase tracking-[.18em] transition-colors ${filter === 'All' ? 'text-[#b99763] border-b border-[#b99763]' : 'text-[#c9c7c3]/50 hover:text-[#e7ca9c]'}`}
            >
              All Pieces
            </button>
            {collections.map(c => (
              <button
                key={c.slug}
                onClick={() => setFilter(c.slug)}
                className={`font-meta text-[10px] uppercase tracking-[.18em] transition-colors ${filter === c.slug ? 'text-[#b99763] border-b border-[#b99763]' : 'text-[#c9c7c3]/50 hover:text-[#e7ca9c]'}`}
              >
                {c.title}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden">
          <MobileRugCarousel products={filtered} />
        </div>

        {/* Desktop View */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((product, i) => (
             <ProductCard key={product.id} product={product} onAdd={onAdd} />
          ))}
        </div>
      </div>
    </main>
  );
}