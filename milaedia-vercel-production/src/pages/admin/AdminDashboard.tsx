import { useCatalog } from '../../context/CatalogContext';
import { money } from '../../data/catalog';
import { ArrowRight, Package, Box, TrendingUp } from 'lucide-react';
import { Link } from 'wouter';

export function AdminDashboard() {
  const { products, orders, customOrders, collections } = useCatalog();

  const totalProducts = products.length;
  const available = products.filter(p => p.status === 'available').length;
  const reserved = products.filter(p => p.status !== 'available').length;

  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'NEW' || o.status === 'PENDING').length;
  const pendingCustom = customOrders.filter(o => o.status === 'NEW').length;

  return (
    <div className="max-w-5xl">
      <div className="font-meta text-[9px] uppercase tracking-[.32em] text-[#b99763] mb-2">Gallery Overview</div>
      <h1 className="font-display text-5xl text-[#e7ca9c] mb-10">Good evening.</h1>

      <div className="grid gap-5 md:grid-cols-4 mb-10">
        {[
          { label: 'Available Works', value: String(available).padStart(2, '0'), note: `${totalProducts} total pieces`, icon: Package },
          { label: 'Reserved / Sold', value: String(reserved).padStart(2, '0'), note: 'In archive', icon: Box },
          { label: 'Pending Orders', value: String(pendingOrders).padStart(2, '0'), note: `${pendingCustom} custom inquiries`, icon: ArrowRight },
          { label: 'Total Revenue', value: money(revenue), note: 'Demo mode', icon: TrendingUp },
        ].map(stat => (
          <div key={stat.label} className="border border-[#b99763]/25 bg-[#0c0a07] p-6 flex flex-col">
            <div className="font-meta text-[9px] uppercase tracking-[.18em] text-[#c9c7c3]/60 flex items-center justify-between">
              {stat.label}
              <stat.icon size={13} className="text-[#b99763]" />
            </div>
            <div className="mt-5 font-display text-4xl text-[#e7ca9c] truncate">{stat.value}</div>
            <div className="mt-auto pt-4 font-meta text-[9px] uppercase tracking-[.1em] text-[#c9c7c3]/40">
              {stat.note}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_.8fr]">
        <div className="border border-[#b99763]/25 bg-[#0c0a07]">
          <div className="flex items-center justify-between border-b border-[#b99763]/25 p-6">
            <div className="font-meta text-[10px] uppercase tracking-[.2em] text-[#e7ca9c]">Recent Orders</div>
            <Link href="/admin/orders" className="font-meta text-[9px] uppercase tracking-[.15em] text-[#b99763] hover:text-[#e7ca9c]">View All</Link>
          </div>
          <div className="divide-y divide-[#b99763]/15">
            {orders.slice(0, 5).map(o => (
              <div key={o.id} className="p-6 flex items-center justify-between">
                <div>
                  <div className="font-meta text-xs text-[#e7ca9c]">{o.id}</div>
                  <div className="font-meta text-[10px] text-[#c9c7c3]/60 mt-1">{o.customerName} · {o.date}</div>
                </div>
                <div className="text-right">
                  <div className="font-meta text-xs text-[#b99763]">{money(o.total)}</div>
                  <div className="font-meta text-[9px] uppercase tracking-widest text-[#c9c7c3]/60 mt-1">{o.status}</div>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="p-10 text-center font-meta text-[10px] uppercase tracking-[.1em] text-[#c9c7c3]/40">
                No orders yet.
              </div>
            )}
          </div>
        </div>

        <div className="border border-[#b99763]/25 bg-[#0c0a07]">
          <div className="flex items-center justify-between border-b border-[#b99763]/25 p-6">
            <div className="font-meta text-[10px] uppercase tracking-[.2em] text-[#e7ca9c]">Custom Inquiries</div>
            <Link href="/admin/custom-orders" className="font-meta text-[9px] uppercase tracking-[.15em] text-[#b99763] hover:text-[#e7ca9c]">View All</Link>
          </div>
          <div className="divide-y divide-[#b99763]/15">
            {customOrders.slice(0, 5).map(c => (
              <div key={c.id} className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-meta text-xs text-[#e7ca9c]">{c.id}</div>
                  <div className="font-meta text-[9px] uppercase tracking-[.1em] text-[#b99763]">{c.status}</div>
                </div>
                <div className="font-display text-lg text-[#c9c7c3] truncate">{c.customerName}</div>
                <div className="font-meta text-[9px] text-[#c9c7c3]/50 mt-1 truncate">{c.rugType} · {c.dimensions}</div>
              </div>
            ))}
            {customOrders.length === 0 && (
              <div className="p-10 text-center font-meta text-[10px] uppercase tracking-[.1em] text-[#c9c7c3]/40">
                No custom inquiries yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
