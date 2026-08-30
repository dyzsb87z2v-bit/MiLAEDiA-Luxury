import { useCatalog } from '../../context/CatalogContext';
import { Edit2 } from 'lucide-react';
import { useState } from 'react';

export function AdminCustomOrders() {
  const { customOrders, updateCustomOrder } = useCatalog();
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="font-meta text-[9px] uppercase tracking-[.32em] text-[#b99763] mb-2">Inquiry Management</div>
          <h1 className="font-display text-4xl text-[#e7ca9c]">Custom requests.</h1>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block border border-[#b99763]/25 bg-[#0c0a07]">
        <div className="grid grid-cols-[1fr_2fr_2fr_1fr_1fr_100px] gap-4 p-4 border-b border-[#b99763]/25 font-meta text-[9px] uppercase tracking-[.18em] text-[#c9c7c3]/60">
          <div>Reference</div>
          <div>Collector</div>
          <div>Requirements</div>
          <div>Date</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>
        <div className="divide-y divide-[#b99763]/15">
          {customOrders.map(o => (
            <div key={o.id} className="grid grid-cols-[1fr_2fr_2fr_1fr_1fr_100px] gap-4 p-4 items-center group">
              <div className="font-meta text-[10px] text-[#e7ca9c]">{o.id}</div>
              <div>
                <div className="font-display text-lg text-[#e7ca9c]">{o.customerName}</div>
                <div className="font-meta text-[9px] text-[#c9c7c3]/50 mt-1">{o.email}</div>
              </div>
              <div className="pr-4">
                <div className="font-meta text-[10px] text-[#e7ca9c] truncate">{o.rugType}</div>
                <div className="font-meta text-[9px] text-[#c9c7c3]/50 mt-1 truncate">{o.dimensions}</div>
              </div>
              <div className="font-meta text-[10px] text-[#c9c7c3]/70">{new Date(o.date).toLocaleDateString()}</div>
              <div>
                {editingId === o.id ? (
                  <select 
                    className="bg-transparent border border-[#b99763]/40 text-[#e7ca9c] font-meta text-[9px] uppercase tracking-widest px-2 py-1 outline-none appearance-none"
                    value={o.status}
                    onChange={(e) => {
                      updateCustomOrder(o.id, { status: e.target.value as any });
                      setEditingId(null);
                    }}
                    onBlur={() => setEditingId(null)}
                    autoFocus
                  >
                    {['NEW', 'REVIEWING', 'QUOTED', 'APPROVED', 'IN PRODUCTION', 'COMPLETED'].map(s => <option key={s} value={s} className="bg-[#0c0a07]">{s}</option>)}
                  </select>
                ) : (
                  <button 
                    onClick={() => setEditingId(o.id)}
                    className="inline-block px-2 py-1 font-meta text-[8px] uppercase tracking-widest border border-[#b99763]/40 text-[#b99763] hover:text-[#e7ca9c] transition-colors"
                  >
                    {o.status}
                  </button>
                )}
              </div>
              <div className="text-right opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setEditingId(o.id)} className="text-[#c9c7c3]/60 hover:text-[#e7ca9c]"><Edit2 size={15} /></button>
              </div>
            </div>
          ))}
          {customOrders.length === 0 && (
            <div className="p-10 text-center font-meta text-[10px] uppercase tracking-[.1em] text-[#c9c7c3]/40">
              No custom inquiries yet.
            </div>
          )}
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden grid gap-4">
        {customOrders.map(o => (
          <div key={o.id} className="border border-[#b99763]/25 bg-[#0c0a07] p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="font-meta text-[9px] text-[#e7ca9c] mb-1">{o.id}</div>
                <div className="font-display text-xl text-[#e7ca9c]">{o.customerName}</div>
                <div className="font-meta text-[9px] text-[#c9c7c3]/60 mt-1">{new Date(o.date).toLocaleDateString()}</div>
              </div>
            </div>
            
            <div className="mb-4 border-b border-[#b99763]/15 pb-4 space-y-2">
              <div>
                <span className="font-meta text-[9px] uppercase text-[#b99763] mr-2">Email</span>
                <span className="text-sm text-[#c9c7c3]/80">{o.email}</span>
              </div>
              <div>
                <span className="font-meta text-[9px] uppercase text-[#b99763] mr-2">Type</span>
                <span className="text-sm text-[#c9c7c3]/80">{o.rugType}</span>
              </div>
              <div>
                <span className="font-meta text-[9px] uppercase text-[#b99763] mr-2">Dims</span>
                <span className="text-sm text-[#c9c7c3]/80">{o.dimensions}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              {editingId === o.id ? (
                <select 
                  className="bg-transparent border border-[#b99763]/40 text-[#e7ca9c] font-meta text-[9px] uppercase tracking-widest px-2 py-1 outline-none appearance-none"
                  value={o.status}
                  onChange={(e) => {
                    updateCustomOrder(o.id, { status: e.target.value as any });
                    setEditingId(null);
                  }}
                  onBlur={() => setEditingId(null)}
                  autoFocus
                >
                  {['NEW', 'REVIEWING', 'QUOTED', 'APPROVED', 'IN PRODUCTION', 'COMPLETED'].map(s => <option key={s} value={s} className="bg-[#0c0a07]">{s}</option>)}
                </select>
              ) : (
                <button 
                  onClick={() => setEditingId(o.id)}
                  className="inline-block px-2 py-1 font-meta text-[8px] uppercase tracking-widest border border-[#b99763]/40 text-[#b99763] hover:text-[#e7ca9c] transition-colors"
                >
                  {o.status}
                </button>
              )}
              <button onClick={() => setEditingId(o.id)} className="text-[#c9c7c3]/60 hover:text-[#e7ca9c]"><Edit2 size={15} /></button>
            </div>
          </div>
        ))}
        {customOrders.length === 0 && (
          <div className="p-10 text-center font-meta text-[10px] uppercase tracking-[.1em] text-[#c9c7c3]/40 border border-[#b99763]/25 bg-[#0c0a07]">
            No custom inquiries yet.
          </div>
        )}
      </div>

    </div>
  );
}