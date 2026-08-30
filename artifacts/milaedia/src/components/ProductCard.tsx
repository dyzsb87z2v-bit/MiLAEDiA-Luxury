import { Link } from 'wouter';
import { ArrowUpRight, Plus } from 'lucide-react';
import { canAcquireProduct, Product, money } from '../data/catalog';

export function ProductCard({ product, onAdd }: { product: Product; onAdd: (id: string) => void }) {
  const isAvailable = canAcquireProduct(product);

  return (
    <article className="archive-card group" data-testid={`card-product-${product.id}`}>
      <Link href={`/products/${product.slug}`} className="block" data-testid={`link-product-${product.id}`}>
        <div className="relative aspect-[4/5] overflow-hidden border border-[#b99763]/25 bg-[#0c0a07]">
          <img src={product.image} alt={product.name} className="archive-card-image h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]" loading="lazy" />
          <div className="absolute left-3 top-3 border border-[#e7ca9c]/45 bg-[#060506]/70 px-2 py-1 font-meta text-[8px] uppercase tracking-[.15em] text-[#e7ca9c]">
            {product.status.replace('-', ' ')}
          </div>
          <div className="absolute bottom-3 right-3 grid h-9 w-9 translate-y-2 place-items-center border border-[#e7ca9c]/0 bg-[#060506]/80 text-[#e7ca9c] opacity-0 transition group-hover:translate-y-0 group-hover:border-[#e7ca9c]/50 group-hover:opacity-100">
            <ArrowUpRight size={15} strokeWidth={1.2} />
          </div>
        </div>
      </Link>
      <div className="flex items-start justify-between gap-4 pt-4">
        <div>
          <div className="font-display text-2xl text-[#e7ca9c]">{product.name}</div>
          <div className="mt-1 font-meta text-[9px] uppercase tracking-[.12em] text-[#c9c7c3]/45">
            {product.material} · {product.dimensions}
          </div>
        </div>
        {isAvailable && (
          <button onClick={() => onAdd(product.id)} type="button" className="mt-1 text-[#b99763] transition-colors hover:text-[#e7ca9c]" data-testid={`button-add-${product.id}`} aria-label="Add to cart">
            <Plus size={17} strokeWidth={1.2} />
          </button>
        )}
      </div>
      <div className="mt-3 font-meta text-xs text-[#b99763]">{money(product.price)}</div>
    </article>
  );
}
