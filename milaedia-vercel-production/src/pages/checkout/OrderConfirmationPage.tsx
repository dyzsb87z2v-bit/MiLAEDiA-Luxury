import { useCatalog } from '../../context/CatalogContext';
import { money } from '../../data/catalog';
import { useParams, Link } from 'wouter';
import { Check } from 'lucide-react';
import NotFound from '../not-found';

export function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders } = useCatalog();
  
  const order = orders.find(o => o.id === orderId);
  if (!order) return <NotFound />;

  return (
    <main className="pt-[76px] min-h-[100dvh]">
      <div className="mx-auto max-w-[800px] px-5 py-24 md:px-10 md:py-32">
        <div className="flex flex-col items-center text-center">
          <div className="grid h-16 w-16 place-items-center rounded-full border border-[#b99763] bg-[#0c0a07] text-[#b99763]">
            <Check size={24} />
          </div>
          
          <h1 className="mt-8 font-display text-5xl text-[#e7ca9c]">Mock Order Saved</h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-[#c9c7c3]/70">
            Thank you, {order.customerName}. This development order exists only in this browser. No payment was taken, no email was sent, and no fulfilment has started.
          </p>
          
          <div className="mt-12 w-full border border-[#b99763]/25 bg-[#0c0a07] p-8 md:p-12 text-left">
            <div className="flex flex-col md:flex-row justify-between border-b border-[#b99763]/15 pb-8 mb-8 gap-6">
              <div>
                <div className="font-meta text-[9px] uppercase tracking-[.2em] text-[#b99763]">Order Reference</div>
                <div className="mt-2 font-display text-2xl text-[#e7ca9c]">{order.id}</div>
              </div>
              <div>
                <div className="font-meta text-[9px] uppercase tracking-[.2em] text-[#b99763]">Date</div>
                <div className="mt-2 font-meta text-sm text-[#e7ca9c]">{new Date(order.date).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="font-meta text-[9px] uppercase tracking-[.2em] text-[#b99763]">Total</div>
                <div className="mt-2 font-meta text-sm text-[#e7ca9c]">{money(order.total)}</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="font-meta text-[9px] uppercase tracking-[.2em] text-[#b99763]">Shipping to</div>
                <div className="mt-2 text-sm leading-6 text-[#c9c7c3]/80">
                  {order.customerName}<br />
                  {order.address}
                </div>
              </div>
              <div>
                <div className="font-meta text-[9px] uppercase tracking-[.2em] text-[#b99763]">Payment status</div>
                <div className="mt-2 text-sm leading-6 text-[#c9c7c3]/80">
                  {order.paymentStatus}<br />
                  Presentation mode only.
                </div>
              </div>
            </div>
          </div>

          <Link href="/collections" className="mt-16 border-b border-[#b99763] pb-2 font-meta text-[10px] uppercase tracking-[.2em] text-[#e7ca9c] hover:text-[#b99763] transition-colors">
            Return to Gallery
          </Link>
        </div>
      </div>
    </main>
  );
}