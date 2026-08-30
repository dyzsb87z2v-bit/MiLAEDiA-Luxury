import { Link, useLocation } from 'wouter';
import { useCatalog } from '../../context/CatalogContext';
import { canAcquireProduct, money } from '../../data/catalog';
import { X, ArrowRight, ShoppingBag } from 'lucide-react';

type CartLine = { id: string; qty: number };

export function CartPage({ cart, update, remove }: { cart: CartLine[]; update: (id: string, qty: number) => void; remove: (id: string) => void }) {
  const { products } = useCatalog();
  const [, setLocation] = useLocation();

  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.id);
    return { ...item, product };
  }).filter(item => item.product);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product?.price || 0) * item.qty, 0);
  const canCheckout = cartItems.every((item) => item.product && canAcquireProduct(item.product));

  return (
    <main className="pt-[76px] min-h-[100dvh]">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
        
        <div className="mb-16">
          <div className="font-meta text-[9px] uppercase tracking-[.32em] text-[#b99763]">Your selection</div>
          <h1 className="mt-4 font-display text-5xl md:text-7xl text-[#e7ca9c]">The Cart.</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center border border-[#b99763]/25 bg-[#0c0a07] py-32 px-5 text-center">
            <ShoppingBag size={48} className="text-[#b99763]/30 mb-6" strokeWidth={1} />
            <h2 className="font-display text-3xl text-[#e7ca9c]">Your cart is empty</h2>
            <p className="mt-4 max-w-sm text-sm text-[#c9c7c3]/60">Pieces added to your selection will appear here.</p>
            <Link href="/collections" className="mt-8 border border-[#b99763]/65 px-8 py-3 font-meta text-[10px] uppercase tracking-[.2em] text-[#e7ca9c] hover:bg-[#b99763] hover:text-[#060506] transition-colors">
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
            <div className="flex flex-col gap-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-6 border border-[#b99763]/25 bg-[#0c0a07] p-5">
                  <Link href={`/products/${item.product!.slug}`} className="shrink-0">
                    <div className="aspect-[3/4] w-24 overflow-hidden border border-[#b99763]/15 md:w-32">
                      <img src={item.product!.image} alt={item.product!.name} className="h-full w-full object-cover opacity-90 transition hover:opacity-100" />
                    </div>
                  </Link>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="font-meta text-[9px] uppercase tracking-[.2em] text-[#b99763]">{item.product!.collection.replace('-', ' ')}</div>
                        <h3 className="mt-2 font-display text-2xl text-[#e7ca9c]"><Link href={`/products/${item.product!.slug}`}>{item.product!.name}</Link></h3>
                        <div className="mt-2 font-meta text-[10px] uppercase tracking-[.1em] text-[#c9c7c3]/50">{item.product!.dimensions}</div>
                      </div>
                      <button onClick={() => remove(item.id)} className="text-[#c9c7c3]/50 hover:text-[#e7ca9c] p-1" aria-label="Remove item">
                        <X size={16} />
                      </button>
                    </div>
                    <div className="flex items-end justify-between mt-6">
                      <div className="font-meta text-xs text-[#b99763]">{money(item.product!.price)}</div>
                      <div className="font-meta text-[10px] text-[#c9c7c3]/50">Qty: {item.qty} (One of one)</div>
                      {!canAcquireProduct(item.product!) && <div className="mt-2 font-meta text-[9px] uppercase tracking-[.12em] text-[#b99763]">No longer available — remove before checkout</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-fit border border-[#b99763]/25 bg-[#0c0a07] p-8">
              <h2 className="font-display text-3xl text-[#e7ca9c]">Order Summary</h2>
              
              <div className="mt-8 space-y-4 border-b border-[#b99763]/15 pb-8">
                <div className="flex justify-between text-sm text-[#c9c7c3]">
                  <span>Subtotal</span>
                  <span className="font-meta">{money(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-[#c9c7c3]">
                  <span>Shipping</span>
                  <span className="text-[#b99763] text-xs uppercase tracking-wide">Calculated at checkout</span>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <span className="font-display text-xl text-[#e7ca9c]">Total</span>
                <span className="font-meta text-lg text-[#e7ca9c]">{money(subtotal)}</span>
              </div>

              <button 
                onClick={() => setLocation('/checkout')}
                disabled={!canCheckout}
                className="mt-10 flex w-full items-center justify-between border border-[#b99763]/65 bg-transparent px-6 py-4 font-meta text-[10px] uppercase tracking-[.2em] text-[#e7ca9c] transition-colors hover:bg-[#b99763] hover:text-[#060506] disabled:cursor-not-allowed disabled:opacity-35"
              >
                <span>Proceed to checkout</span>
                <ArrowRight size={14} />
              </button>
              
              <p className="mt-6 text-center text-xs text-[#c9c7c3]/40">
                Mock checkout mode. No actual payment will be taken.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}