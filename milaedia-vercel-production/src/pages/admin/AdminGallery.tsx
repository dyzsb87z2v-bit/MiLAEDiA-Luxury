import { useState } from 'react';
import { useCatalog } from '../../context/CatalogContext';
import { Edit2 } from 'lucide-react';

export function AdminGallery() {
  const { gallery, updateGallery } = useCatalog();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});

  const handleEdit = (img: any) => {
    setEditingId(img.id);
    setForm(img);
  };

  const handleSave = () => {
    if (editingId) {
      updateGallery(gallery.map(img => img.id === editingId ? { ...img, ...form } : img));
    }
    setEditingId(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="font-meta text-[9px] uppercase tracking-[.32em] text-[#b99763] mb-2">Gallery Management</div>
          <h1 className="font-display text-4xl text-[#e7ca9c]">Visual Archive.</h1>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.map(img => (
          <div key={img.id} className="border border-[#b99763]/25 bg-[#0c0a07] p-4 flex flex-col">
            {editingId === img.id ? (
              <div className="space-y-4">
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-transparent font-display text-xl text-[#e7ca9c] outline-none border-b border-[#b99763]/30 pb-1" />
                <input value={form.note} onChange={e => setForm({...form, note: e.target.value})} className="w-full bg-transparent font-meta text-xs uppercase tracking-widest text-[#b99763] outline-none border-b border-[#b99763]/30 pb-1" />
                <input value={form.src} onChange={e => setForm({...form, src: e.target.value})} className="w-full bg-transparent text-xs text-[#c9c7c3] outline-none border-b border-[#b99763]/30 pb-1" placeholder="Image URL" />
                <div className="flex gap-4 pt-2">
                  <button onClick={handleSave} className="bg-[#b99763] px-3 py-1.5 font-meta text-[9px] uppercase tracking-widest text-[#060506]">Save</button>
                  <button onClick={() => setEditingId(null)} className="border border-[#b99763]/40 px-3 py-1.5 font-meta text-[9px] uppercase tracking-widest text-[#c9c7c3]">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="aspect-[4/3] w-full overflow-hidden mb-4 border border-[#b99763]/20">
                  <img src={img.src} alt={img.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex justify-between items-start mt-auto">
                  <div>
                    <h3 className="font-display text-xl text-[#e7ca9c] mb-1">{img.title}</h3>
                    <div className="font-meta text-[9px] uppercase tracking-widest text-[#b99763]">{img.note}</div>
                  </div>
                  <button onClick={() => handleEdit(img)} className="text-[#c9c7c3]/60 hover:text-[#e7ca9c] shrink-0 p-1"><Edit2 size={14} /></button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}