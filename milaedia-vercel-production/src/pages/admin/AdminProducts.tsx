import { useState } from 'react';
import { useCatalog } from '../../context/CatalogContext';
import { money, Product, ProductStatus } from '../../data/catalog';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';

export function AdminProducts() {
  const { products, collections, updateProduct, addProduct, deleteProduct } = useCatalog();
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()));

  const [form, setForm] = useState<Partial<Product>>({});

  const handleEdit = (p: Product) => {
    setEditingId(p.id);
    setForm(p);
  };

  const handleSave = () => {
    if (editingId) {
      const pData = {
        ...form,
        stock: Number(form.stock) || 0,
        price: Number(form.price) || 0
      };
      
      if (editingId === 'new') {
        addProduct({
          ...(pData as Product),
          id: `P-${Date.now()}`,
          slug: pData.name?.toLowerCase().replace(/\s+/g, '-') || 'new-product',
          image: pData.image || '/assets/09_antique_rug.png',
          images: pData.images || []
        });
      } else {
        updateProduct(editingId, pData);
      }
    }
    setEditingId(null);
  };

  if (editingId) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="font-meta text-[9px] uppercase tracking-[.32em] text-[#b99763] mb-2">{editingId === 'new' ? 'New piece' : 'Edit piece'}</div>
            <h1 className="font-display text-3xl md:text-4xl text-[#e7ca9c]">{form.name || 'Untitled Piece'}</h1>
          </div>
          <button type="button" onClick={() => setEditingId(null)} className="text-[#c9c7c3]/60 hover:text-[#e7ca9c]"><X size={24} /></button>
        </div>

        <div className="border border-[#b99763]/30 bg-[#0c0a07] p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="block border-b border-[#b99763]/35 pb-2">
              <span className="font-meta text-[9px] uppercase tracking-[.14em] text-[#c9c7c3]/45">Name</span>
              <input type="text" value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} className="mt-2 w-full bg-transparent text-sm text-[#e7ca9c] outline-none" required />
            </label>
            <label className="block border-b border-[#b99763]/35 pb-2">
              <span className="font-meta text-[9px] uppercase tracking-[.14em] text-[#c9c7c3]/45">Category</span>
              <select value={form.category || ''} onChange={e => setForm({...form, category: e.target.value})} className="mt-2 w-full bg-transparent text-sm text-[#e7ca9c] outline-none appearance-none">
                <option value="Rugs" className="bg-[#0c0a07]">Rugs</option>
                <option value="Tapestries" className="bg-[#0c0a07]">Tapestries</option>
                <option value="Other" className="bg-[#0c0a07]">Other</option>
              </select>
            </label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <label className="block border-b border-[#b99763]/35 pb-2">
              <span className="font-meta text-[9px] uppercase tracking-[.14em] text-[#c9c7c3]/45">Price</span>
              <input type="number" value={form.price || ''} onChange={e => setForm({...form, price: Number(e.target.value)})} className="mt-2 w-full bg-transparent text-sm text-[#e7ca9c] outline-none" required />
            </label>
            <label className="block border-b border-[#b99763]/35 pb-2">
              <span className="font-meta text-[9px] uppercase tracking-[.14em] text-[#c9c7c3]/45">Currency</span>
              <select value={form.currency || 'EUR'} onChange={e => setForm({...form, currency: e.target.value})} className="mt-2 w-full bg-transparent text-sm text-[#e7ca9c] outline-none appearance-none">
                <option value="EUR" className="bg-[#0c0a07]">EUR</option>
                <option value="USD" className="bg-[#0c0a07]">USD</option>
                <option value="GBP" className="bg-[#0c0a07]">GBP</option>
              </select>
            </label>
            <label className="block border-b border-[#b99763]/35 pb-2">
              <span className="font-meta text-[9px] uppercase tracking-[.14em] text-[#c9c7c3]/45">Stock</span>
              <input type="number" value={form.stock || 0} onChange={e => setForm({...form, stock: Number(e.target.value)})} className="mt-2 w-full bg-transparent text-sm text-[#e7ca9c] outline-none" />
            </label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="block border-b border-[#b99763]/35 pb-2">
              <span className="font-meta text-[9px] uppercase tracking-[.14em] text-[#c9c7c3]/45">Availability Status</span>
              <select value={form.status || 'available'} onChange={e => setForm({...form, status: e.target.value as ProductStatus})} className="mt-2 w-full bg-transparent text-sm text-[#e7ca9c] outline-none appearance-none">
                <option value="available" className="bg-[#0c0a07]">Available</option>
                <option value="reserved" className="bg-[#0c0a07]">Reserved</option>
                <option value="sold" className="bg-[#0c0a07]">Sold</option>
                <option value="made-to-order" className="bg-[#0c0a07]">Made to order</option>
              </select>
            </label>
            <label className="flex items-center gap-4 border-b border-[#b99763]/35 pb-2 h-full">
              <input type="checkbox" checked={form.featured || false} onChange={e => setForm({...form, featured: e.target.checked})} className="bg-transparent outline-none accent-[#b99763]" />
              <span className="font-meta text-[9px] uppercase tracking-[.14em] text-[#c9c7c3]/45">Featured in gallery</span>
            </label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="block border-b border-[#b99763]/35 pb-2">
              <span className="font-meta text-[9px] uppercase tracking-[.14em] text-[#c9c7c3]/45">Collection</span>
              <select value={form.collection || ''} onChange={e => setForm({...form, collection: e.target.value})} className="mt-2 w-full bg-transparent text-sm text-[#e7ca9c] outline-none appearance-none">
                {collections.map(c => <option key={c.slug} value={c.slug} className="bg-[#0c0a07]">{c.title}</option>)}
              </select>
            </label>
            <label className="block border-b border-[#b99763]/35 pb-2">
              <span className="font-meta text-[9px] uppercase tracking-[.14em] text-[#c9c7c3]/45">Origin</span>
              <input type="text" value={form.origin || ''} onChange={e => setForm({...form, origin: e.target.value})} placeholder="e.g. Kerman, Iran" className="mt-2 w-full bg-transparent text-sm text-[#e7ca9c] outline-none" />
            </label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <label className="block border-b border-[#b99763]/35 pb-2">
              <span className="font-meta text-[9px] uppercase tracking-[.14em] text-[#c9c7c3]/45">Dimensions</span>
              <input type="text" value={form.dimensions || ''} onChange={e => setForm({...form, dimensions: e.target.value})} className="mt-2 w-full bg-transparent text-sm text-[#e7ca9c] outline-none" />
            </label>
            <label className="block border-b border-[#b99763]/35 pb-2">
              <span className="font-meta text-[9px] uppercase tracking-[.14em] text-[#c9c7c3]/45">Material</span>
              <input type="text" value={form.material || ''} onChange={e => setForm({...form, material: e.target.value})} className="mt-2 w-full bg-transparent text-sm text-[#e7ca9c] outline-none" />
            </label>
            <label className="block border-b border-[#b99763]/35 pb-2">
              <span className="font-meta text-[9px] uppercase tracking-[.14em] text-[#c9c7c3]/45">Weaving Type</span>
              <input type="text" value={form.weavingType || ''} onChange={e => setForm({...form, weavingType: e.target.value})} className="mt-2 w-full bg-transparent text-sm text-[#e7ca9c] outline-none" />
            </label>
          </div>

          <label className="block border-b border-[#b99763]/35 pb-2">
            <span className="font-meta text-[9px] uppercase tracking-[.14em] text-[#c9c7c3]/45">Primary Image URL</span>
            <input type="text" value={form.image || ''} onChange={e => setForm({...form, image: e.target.value})} className="mt-2 w-full bg-transparent text-sm text-[#e7ca9c] outline-none" />
          </label>
          
          <label className="block border-b border-[#b99763]/35 pb-2">
            <span className="font-meta text-[9px] uppercase tracking-[.14em] text-[#c9c7c3]/45">Description</span>
            <textarea value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} className="mt-2 w-full bg-transparent text-sm text-[#e7ca9c] outline-none" rows={4} />
          </label>
          <div className="flex gap-4 pt-6">
            <button type="button" onClick={handleSave} className="bg-[#b99763] px-6 py-3 font-meta text-[10px] uppercase tracking-[.18em] text-[#060506] hover:bg-[#e7ca9c] transition">Save Piece</button>
            <button type="button" onClick={() => setEditingId(null)} className="border border-[#b99763]/40 px-6 py-3 font-meta text-[10px] uppercase tracking-[.18em] text-[#c9c7c3] hover:text-[#e7ca9c] transition">Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="font-meta text-[9px] uppercase tracking-[.32em] text-[#b99763] mb-2">Catalogue Management</div>
          <h1 className="font-display text-4xl text-[#e7ca9c]">Archive pieces.</h1>
        </div>
        <button 
          onClick={() => {
            setEditingId('new');
            setForm({ 
              name: '', price: 0, currency: 'EUR', stock: 1, featured: false, status: 'available', category: 'Rugs', collection: collections[0].slug, era: 'Available on request', material: 'Available on request', weavingType: 'Available on request', dimensions: 'Available on request', origin: 'Available on request', description: '', accent: '#B99763', images: [] 
            });
          }}
          className="flex items-center justify-center gap-3 bg-[#b99763] px-5 py-3 font-meta text-[10px] uppercase tracking-[.18em] text-[#060506] hover:bg-[#e7ca9c] transition"
        >
          Add Piece <Plus size={14} />
        </button>
      </div>

      <div className="border border-[#b99763]/25 bg-[#0c0a07] mb-6 flex items-center p-4">
        <Search size={16} className="text-[#b99763] mr-3" />
        <input 
          type="text" 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          placeholder="Search by name or ID..."
          className="bg-transparent outline-none w-full font-meta text-xs text-[#e7ca9c]"
        />
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block border border-[#b99763]/25 bg-[#0c0a07]">
        <div className="grid grid-cols-[80px_2fr_1fr_1fr_1fr_100px] gap-4 p-4 border-b border-[#b99763]/25 font-meta text-[9px] uppercase tracking-[.18em] text-[#c9c7c3]/60">
          <div>Image</div>
          <div>Details</div>
          <div>Collection</div>
          <div>Status</div>
          <div>Price</div>
          <div className="text-right">Actions</div>
        </div>
        <div className="divide-y divide-[#b99763]/15">
          {filtered.map(p => (
            <div key={p.id} className="grid grid-cols-[80px_2fr_1fr_1fr_1fr_100px] gap-4 p-4 items-center group">
              <img src={p.image} alt={p.name} className="w-12 h-16 object-cover border border-[#b99763]/20" />
              <div>
                <div className="font-display text-xl text-[#e7ca9c]">{p.name}</div>
                <div className="font-meta text-[9px] text-[#c9c7c3]/50 mt-1">{p.id}</div>
              </div>
              <div className="font-meta text-[10px] text-[#c9c7c3]/70">{p.collection.replace('-', ' ')}</div>
              <div>
                <span className={`inline-block px-2 py-1 font-meta text-[8px] uppercase tracking-widest border ${p.status === 'available' ? 'border-[#b99763]/40 text-[#b99763]' : 'border-[#7b311d]/40 text-[#7b311d]'}`}>
                  {p.status.replace('-', ' ')}
                </span>
                <div className="font-meta text-[8px] text-[#c9c7c3]/40 mt-1">Stock: {p.stock}</div>
              </div>
              <div className="font-meta text-xs text-[#e7ca9c]">{money(p.price, p.currency)}</div>
              <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(p)} className="text-[#b99763] hover:text-[#e7ca9c]"><Edit2 size={16} /></button>
                <button onClick={() => deleteProduct(p.id)} className="text-[#7b311d] hover:text-[#e7ca9c]"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden grid gap-4">
        {filtered.map(p => (
          <div key={p.id} className="border border-[#b99763]/25 bg-[#0c0a07] p-4 flex gap-4">
             <img src={p.image} alt={p.name} className="w-20 h-24 object-cover border border-[#b99763]/20" />
             <div className="flex-1">
                <div className="font-meta text-[8px] uppercase tracking-widest text-[#b99763] mb-1">{p.collection.replace('-', ' ')}</div>
                <div className="font-display text-lg text-[#e7ca9c] leading-tight">{p.name}</div>
                <div className="flex items-center justify-between mt-3">
                  <div className="font-meta text-[10px] text-[#e7ca9c]">{money(p.price, p.currency)}</div>
                  <span className={`px-2 py-1 font-meta text-[8px] uppercase tracking-widest border ${p.status === 'available' ? 'border-[#b99763]/40 text-[#b99763]' : 'border-[#7b311d]/40 text-[#7b311d]'}`}>
                    {p.status.replace('-', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-end gap-4 mt-4 border-t border-[#b99763]/15 pt-3">
                  <button onClick={() => handleEdit(p)} className="text-[#b99763] hover:text-[#e7ca9c]"><Edit2 size={14} /></button>
                  <button onClick={() => deleteProduct(p.id)} className="text-[#7b311d] hover:text-[#e7ca9c]"><Trash2 size={14} /></button>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}