import { useState } from 'react';
import { useCatalog } from '../../context/CatalogContext';
import { Edit2 } from 'lucide-react';

export function AdminCategories() {
  const { collections, updateCollections } = useCatalog();
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});

  const handleEdit = (col: any) => {
    setEditingSlug(col.slug);
    setForm(col);
  };

  const handleSave = () => {
    if (editingSlug) {
      updateCollections(collections.map(c => c.slug === editingSlug ? { ...c, ...form } : c));
    }
    setEditingSlug(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="font-meta text-[9px] uppercase tracking-[.32em] text-[#b99763] mb-2">Category Management</div>
          <h1 className="font-display text-4xl text-[#e7ca9c]">Collections.</h1>
        </div>
      </div>

      <div className="grid gap-4">
        {collections.map(c => (
          <div key={c.slug} className="border border-[#b99763]/25 bg-[#0c0a07] p-5 md:p-8">
            {editingSlug === c.slug ? (
              <div className="space-y-4">
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-transparent font-display text-3xl text-[#e7ca9c] outline-none border-b border-[#b99763]/30 pb-2" />
                <input value={form.subtitle} onChange={e => setForm({...form, subtitle: e.target.value})} className="w-full bg-transparent font-meta text-xs uppercase tracking-widest text-[#b99763] outline-none border-b border-[#b99763]/30 pb-2" />
                <textarea value={form.intro} onChange={e => setForm({...form, intro: e.target.value})} className="w-full bg-transparent text-sm text-[#c9c7c3] outline-none border-b border-[#b99763]/30 pb-2" rows={2} />
                <input value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="w-full bg-transparent text-sm text-[#e7ca9c] outline-none border-b border-[#b99763]/30 pb-2" placeholder="Image URL" />
                <div className="flex gap-4 pt-2">
                  <button onClick={handleSave} className="bg-[#b99763] px-4 py-2 font-meta text-[9px] uppercase tracking-widest text-[#060506]">Save</button>
                  <button onClick={() => setEditingSlug(null)} className="border border-[#b99763]/40 px-4 py-2 font-meta text-[9px] uppercase tracking-widest text-[#c9c7c3]">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-6 md:items-center">
                <img src={c.image} alt="" className="w-24 h-24 object-cover border border-[#b99763]/20" />
                <div className="flex-1">
                  <div className="font-meta text-[9px] uppercase tracking-widest text-[#b99763] mb-2">{c.subtitle}</div>
                  <h3 className="font-display text-2xl text-[#e7ca9c] mb-2">{c.title}</h3>
                  <p className="text-sm text-[#c9c7c3]/70">{c.intro}</p>
                </div>
                <button onClick={() => handleEdit(c)} className="text-[#c9c7c3]/60 hover:text-[#e7ca9c] shrink-0 self-start md:self-auto"><Edit2 size={16} /></button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}