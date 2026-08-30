import { useEffect, useMemo, useState } from 'react';
import { Link } from 'wouter';
import { Save } from 'lucide-react';
import { useCatalog, type CustomOrder } from '../../context/CatalogContext';
import { money, type ProductStatus } from '../../data/catalog';

const fieldClass = 'w-full border border-[#b99763]/30 bg-[#060506] px-3 py-2 text-sm text-[#e7ca9c] outline-none focus:border-[#b99763]';
const labelClass = 'font-meta text-[9px] uppercase tracking-[.16em] text-[#c9c7c3]/55';

function AdminHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <header className="mb-10">
      <div className="font-meta text-[9px] uppercase tracking-[.32em] text-[#b99763]">{eyebrow}</div>
      <h1 className="mt-2 font-display text-4xl text-[#e7ca9c]">{title}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[#c9c7c3]/60">{copy}</p>
    </header>
  );
}

export function AdminInventory() {
  const { products, updateProduct } = useCatalog();
  return (
    <div className="max-w-6xl">
      <AdminHeading eyebrow="Inventory control" title="Availability ledger." copy="Development records update the public catalogue in this browser. Unique pieces are limited to a stock value of zero or one." />
      <div className="grid gap-4">
        {products.map((product) => (
          <article key={product.id} className="grid gap-5 border border-[#b99763]/25 bg-[#0c0a07] p-5 sm:grid-cols-[64px_1fr_130px_190px] sm:items-end">
            <img src={product.image} alt="" className="h-20 w-16 object-cover" />
            <div>
              <div className="font-display text-xl text-[#e7ca9c]">{product.name}</div>
              <div className="mt-1 font-meta text-[9px] uppercase tracking-[.12em] text-[#c9c7c3]/45">{product.id}</div>
            </div>
            <label>
              <span className={labelClass}>Stock</span>
              <select
                className={`${fieldClass} mt-2`}
                value={product.stock}
                onChange={(event) => updateProduct(product.id, { stock: Number(event.target.value) })}
                data-testid={`select-stock-${product.id}`}
              >
                <option value={0}>0</option>
                <option value={1}>1</option>
              </select>
            </label>
            <label>
              <span className={labelClass}>Availability</span>
              <select
                className={`${fieldClass} mt-2`}
                value={product.status}
                onChange={(event) => {
                  const status = event.target.value as ProductStatus;
                  updateProduct(product.id, { status, stock: status === 'available' ? 1 : 0 });
                }}
                data-testid={`select-availability-${product.id}`}
              >
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
                <option value="made-to-order">Made to order</option>
              </select>
            </label>
          </article>
        ))}
      </div>
    </div>
  );
}

export function AdminPricing() {
  const { products, updateProduct } = useCatalog();
  return (
    <div className="max-w-6xl">
      <AdminHeading eyebrow="Pricing control" title="Price register." copy="Standard and optional presentation prices are stored locally for this development catalogue." />
      <div className="grid gap-4">
        {products.map((product) => (
          <article key={product.id} className="grid gap-5 border border-[#b99763]/25 bg-[#0c0a07] p-5 md:grid-cols-[1fr_160px_130px_180px] md:items-end">
            <div>
              <div className="font-display text-xl text-[#e7ca9c]">{product.name}</div>
              <div className="mt-2 font-meta text-xs text-[#b99763]">{money(product.salePrice ?? product.price, product.currency)}</div>
            </div>
            <label>
              <span className={labelClass}>Standard price</span>
              <input className={`${fieldClass} mt-2`} type="number" min="0" value={product.price} onChange={(event) => updateProduct(product.id, { price: Number(event.target.value) })} />
            </label>
            <label>
              <span className={labelClass}>Currency</span>
              <select className={`${fieldClass} mt-2`} value={product.currency} onChange={(event) => updateProduct(product.id, { currency: event.target.value })}>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
              </select>
            </label>
            <label>
              <span className={labelClass}>Presentation price</span>
              <input
                className={`${fieldClass} mt-2`}
                type="number"
                min="0"
                placeholder="Optional"
                value={product.salePrice ?? ''}
                onChange={(event) => updateProduct(product.id, { salePrice: event.target.value ? Number(event.target.value) : undefined })}
              />
            </label>
          </article>
        ))}
      </div>
    </div>
  );
}

const nextMessageStatus: Record<CustomOrder['status'], CustomOrder['status']> = {
  NEW: 'REVIEWING',
  REVIEWING: 'QUOTED',
  QUOTED: 'APPROVED',
  APPROVED: 'IN PRODUCTION',
  'IN PRODUCTION': 'COMPLETED',
  COMPLETED: 'COMPLETED',
};

export function AdminMessages() {
  const { customOrders, updateCustomOrder } = useCatalog();
  return (
    <div className="max-w-5xl">
      <AdminHeading eyebrow="Inquiry desk" title="Messages." copy="Custom-order conversations appear here until a dedicated delivery service and production inbox are connected." />
      {customOrders.length === 0 ? (
        <div className="border border-[#b99763]/25 bg-[#0c0a07] p-12 text-center">
          <p className="font-display text-2xl text-[#e7ca9c]">No inquiries have arrived.</p>
          <p className="mt-3 text-sm text-[#c9c7c3]/55">Submissions from the public custom-order form will be listed here.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {customOrders.map((message) => (
            <article key={message.id} className="border border-[#b99763]/25 bg-[#0c0a07] p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="font-meta text-[9px] uppercase tracking-[.18em] text-[#b99763]">{message.id} · {message.status}</div>
                  <h2 className="mt-2 font-display text-2xl text-[#e7ca9c]">{message.customerName}</h2>
                  <p className="mt-1 text-xs text-[#c9c7c3]/55">{message.email} · {message.phone}</p>
                  <p className="mt-5 max-w-2xl text-sm leading-7 text-[#c9c7c3]/70">{message.requirements || `${message.rugType}, ${message.dimensions}, ${message.colorDirection}, ${message.pattern}`}</p>
                </div>
                <button
                  type="button"
                  disabled={message.status === 'COMPLETED'}
                  onClick={() => updateCustomOrder(message.id, { status: nextMessageStatus[message.status] })}
                  className="shrink-0 border border-[#b99763]/45 px-4 py-2 font-meta text-[9px] uppercase tracking-[.15em] text-[#e7ca9c] disabled:opacity-35"
                >
                  Advance status
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

type ContentDraft = {
  collectionNote: string;
  inquiryPromise: string;
  privateViewingNote: string;
};

const defaultContent: ContentDraft = {
  collectionNote: 'Every piece is one of one; availability is confirmed personally.',
  inquiryPromise: 'The gallery reviews each request before discussing possibilities, timing and pricing.',
  privateViewingNote: 'Private digital viewings are arranged by message or email.',
};

export function AdminContent() {
  const [draft, setDraft] = useState<ContentDraft>(() => {
    try {
      return JSON.parse(localStorage.getItem('milaedia-content-settings') || '') as ContentDraft;
    } catch {
      return defaultContent;
    }
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const timeout = window.setTimeout(() => setSaved(false), 2400);
    return () => window.clearTimeout(timeout);
  }, [saved]);

  const entries = useMemo(() => Object.entries(draft) as [keyof ContentDraft, string][], [draft]);
  const labels: Record<keyof ContentDraft, string> = {
    collectionNote: 'Collection availability note',
    inquiryPromise: 'Inquiry response note',
    privateViewingNote: 'Private viewing note',
  };

  return (
    <div className="max-w-4xl">
      <AdminHeading eyebrow="Editorial control" title="House copy." copy="These development-only notes prepare the content architecture for a future shared repository. Collection descriptions are edited under Categories." />
      <form
        className="space-y-6 border border-[#b99763]/25 bg-[#0c0a07] p-6 md:p-10"
        onSubmit={(event) => {
          event.preventDefault();
          localStorage.setItem('milaedia-content-settings', JSON.stringify(draft));
          setSaved(true);
        }}
      >
        {entries.map(([key, value]) => (
          <label key={key} className="block">
            <span className={labelClass}>{labels[key]}</span>
            <textarea className={`${fieldClass} mt-2 min-h-24`} value={value} onChange={(event) => setDraft((current) => ({ ...current, [key]: event.target.value }))} />
          </label>
        ))}
        <div className="flex items-center gap-4">
          <button type="submit" className="inline-flex items-center gap-3 bg-[#b99763] px-5 py-3 font-meta text-[10px] uppercase tracking-[.18em] text-[#060506]">
            <Save size={14} /> Save copy
          </button>
          {saved && <span role="status" className="font-meta text-[9px] uppercase tracking-[.16em] text-[#b99763]">Saved locally</span>}
        </div>
      </form>
      <Link href="/admin/categories" className="mt-5 inline-block font-meta text-[9px] uppercase tracking-[.15em] text-[#b99763]">Edit collection content →</Link>
    </div>
  );
}