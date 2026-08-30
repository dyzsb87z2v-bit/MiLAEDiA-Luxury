import { useCatalog } from '../../context/CatalogContext';
import { money } from '../../data/catalog';

export function AdminCustomers() {
  const { orders, customOrders } = useCatalog();

  // Simple aggregation for development
  const customerMap = new Map<string, { email: string, orderCount: number, customCount: number, spent: number, lastActive: string }>();

  orders.forEach(o => {
    const key = o.email;
    const existing = customerMap.get(key) || { email: o.email, orderCount: 0, customCount: 0, spent: 0, lastActive: o.date };
    existing.orderCount += 1;
    existing.spent += o.total;
    if (new Date(o.date) > new Date(existing.lastActive)) existing.lastActive = o.date;
    customerMap.set(key, existing);
  });

  customOrders.forEach(o => {
    const key = o.email;
    const existing = customerMap.get(key) || { email: o.email, orderCount: 0, customCount: 0, spent: 0, lastActive: o.date };
    existing.customCount += 1;
    if (new Date(o.date) > new Date(existing.lastActive)) existing.lastActive = o.date;
    customerMap.set(key, existing);
  });

  const customers = Array.from(customerMap.values()).sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime());

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="font-meta text-[9px] uppercase tracking-[.32em] text-[#b99763] mb-2">Customer Records</div>
          <h1 className="font-display text-4xl text-[#e7ca9c]">Clientele.</h1>
        </div>
      </div>

      <div className="border border-[#b99763]/25 bg-[#0c0a07]">
        <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 p-4 border-b border-[#b99763]/25 font-meta text-[9px] uppercase tracking-[.18em] text-[#c9c7c3]/60">
          <div>Client Email</div>
          <div className="hidden md:block">Orders</div>
          <div className="hidden md:block">Inquiries</div>
          <div className="hidden md:block">Total Spent</div>
          <div className="text-right md:text-left">Last Active</div>
        </div>
        <div className="divide-y divide-[#b99763]/15">
          {customers.map(c => (
            <div key={c.email} className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 p-4 items-center">
              <div className="font-meta text-sm text-[#e7ca9c]">{c.email}</div>
              <div className="hidden md:block font-meta text-xs text-[#c9c7c3]/80">{c.orderCount}</div>
              <div className="hidden md:block font-meta text-xs text-[#c9c7c3]/80">{c.customCount}</div>
              <div className="hidden md:block font-meta text-xs text-[#b99763]">{money(c.spent)}</div>
              <div className="font-meta text-[10px] text-[#c9c7c3]/50 text-right md:text-left">{new Date(c.lastActive).toLocaleDateString()}</div>
              
              {/* Mobile expansion */}
              <div className="col-span-2 md:hidden grid grid-cols-3 mt-2 border-t border-[#b99763]/15 pt-2">
                <div>
                  <div className="font-meta text-[8px] text-[#b99763] uppercase">Orders</div>
                  <div className="font-meta text-xs text-[#c9c7c3]/80 mt-1">{c.orderCount}</div>
                </div>
                <div>
                  <div className="font-meta text-[8px] text-[#b99763] uppercase">Inquiries</div>
                  <div className="font-meta text-xs text-[#c9c7c3]/80 mt-1">{c.customCount}</div>
                </div>
                <div>
                  <div className="font-meta text-[8px] text-[#b99763] uppercase">Spent</div>
                  <div className="font-meta text-xs text-[#b99763] mt-1">{money(c.spent)}</div>
                </div>
              </div>
            </div>
          ))}
          {customers.length === 0 && (
            <div className="p-10 text-center font-meta text-[10px] uppercase tracking-[.1em] text-[#c9c7c3]/40">
              No clients found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}