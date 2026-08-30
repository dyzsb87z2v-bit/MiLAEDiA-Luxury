import { useEffect, useState } from 'react';
import { useCatalog } from '../../context/CatalogContext';
import { Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const customOrderSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(5, 'Required'),
  rugType: z.string().min(1, 'Required'),
  width: z.string().min(1, 'Required'),
  length: z.string().min(1, 'Required'),
  unit: z.enum(['cm', 'ft']),
  colorDirection: z.string().min(1, 'Required'),
  pattern: z.string().min(1, 'Required'),
  requirements: z.string(),
});

export function CustomOrderPage() {
  const { addCustomOrder } = useCatalog();
  const [step, setStep] = useState<'form' | 'review' | 'submitted'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [referenceName, setReferenceName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const form = useForm<z.infer<typeof customOrderSchema>>({
    resolver: zodResolver(customOrderSchema),
    defaultValues: {
      firstName: '', lastName: '', email: '', phone: '', rugType: '', width: '', length: '', unit: 'cm', colorDirection: '', pattern: '', requirements: ''
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/') || file.size > 10 * 1024 * 1024) {
        setUploadError('Choose an image file smaller than 10 MB.');
        e.target.value = '';
        return;
      }
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setReferenceName(file.name);
      setUploadError('');
    }
  };

  const handleReview = (data: z.infer<typeof customOrderSchema>) => {
    setStep('review');
  };

  const onSubmit = () => {
    const data = form.getValues();
    setIsSubmitting(true);
    setTimeout(() => {
      addCustomOrder({
        id: `CO-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
        customerName: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        rugType: data.rugType,
        dimensions: `${data.width} × ${data.length} ${data.unit}`,
        colorDirection: data.colorDirection,
        pattern: data.pattern,
        requirements: data.requirements,
        referenceImage: referenceName ? `Development upload: ${referenceName}` : undefined,
        date: new Date().toISOString(),
        status: 'NEW'
      });
      setIsSubmitting(false);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setStep('submitted');
    }, 1500);
  };

  if (step === 'submitted') {
    return (
      <main className="pt-[76px] min-h-[100dvh]">
        <div className="mx-auto max-w-[800px] px-5 py-24 md:px-10 md:py-32 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-[#b99763] bg-[#0c0a07] text-[#b99763] mb-8">
            <Check size={24} />
          </div>
          <h1 className="font-display text-5xl text-[#e7ca9c]">Inquiry Received.</h1>
          <p className="mt-6 text-sm leading-8 text-[#c9c7c3]/70">
             This development inquiry has been saved locally in this browser. No message or image was uploaded to the gallery.
          </p>
        </div>
      </main>
    );
  }

  if (step === 'review') {
    const data = form.getValues();
    return (
      <main className="pt-[76px] min-h-[100dvh]">
        <div className="mx-auto max-w-[800px] px-5 py-16 md:px-10 md:py-24">
          <div className="mb-12 border-b border-[#b99763]/25 pb-6">
            <div className="font-meta text-[9px] uppercase tracking-[.32em] text-[#b99763]">Review Step</div>
            <h1 className="mt-4 font-display text-4xl text-[#e7ca9c]">Confirm details.</h1>
          </div>
          
          <div className="space-y-10">
            <div className="grid md:grid-cols-2 gap-8 border border-[#b99763]/25 p-8 bg-[#0c0a07]">
              <div>
                <h3 className="font-meta text-[9px] uppercase tracking-[.2em] text-[#b99763] mb-4">Contact</h3>
                <p className="text-sm text-[#e7ca9c]">{data.firstName} {data.lastName}</p>
                <p className="text-sm text-[#c9c7c3]/80 mt-1">{data.email}</p>
                <p className="text-sm text-[#c9c7c3]/80 mt-1">{data.phone}</p>
              </div>
              <div>
                <h3 className="font-meta text-[9px] uppercase tracking-[.2em] text-[#b99763] mb-4">Format</h3>
                <p className="text-sm text-[#e7ca9c]">{data.rugType}</p>
                <p className="text-sm text-[#c9c7c3]/80 mt-1">{data.width} × {data.length} {data.unit}</p>
              </div>
              <div className="md:col-span-2 border-t border-[#b99763]/15 pt-8 mt-4">
                <h3 className="font-meta text-[9px] uppercase tracking-[.2em] text-[#b99763] mb-4">Aesthetics</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-xs text-[#c9c7c3]/50 mb-1">Color</div>
                    <p className="text-sm text-[#e7ca9c]">{data.colorDirection}</p>
                  </div>
                  <div>
                    <div className="text-xs text-[#c9c7c3]/50 mb-1">Pattern</div>
                    <p className="text-sm text-[#e7ca9c]">{data.pattern}</p>
                  </div>
                  {data.requirements && (
                    <div className="md:col-span-2 mt-2">
                      <div className="text-xs text-[#c9c7c3]/50 mb-1">Additional Requirements</div>
                      <p className="text-sm text-[#e7ca9c]">{data.requirements}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {previewUrl && (
                <div className="md:col-span-2 border-t border-[#b99763]/15 pt-8 mt-4">
                  <h3 className="font-meta text-[9px] uppercase tracking-[.2em] text-[#b99763] mb-4">Reference Upload (Dev mode only)</h3>
                  <img src={previewUrl} alt="Reference preview" className="h-40 w-auto object-cover border border-[#b99763]/30" />
                </div>
              )}
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={onSubmit}
                disabled={isSubmitting}
                className="flex-1 border border-[#b99763] bg-[#b99763] px-10 py-5 font-meta text-[10px] uppercase tracking-[.2em] text-[#060506] transition-colors hover:bg-[#e7ca9c] disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Confirm & Submit'}
              </button>
              <button 
                onClick={() => setStep('form')}
                className="border border-[#b99763]/40 px-10 py-5 font-meta text-[10px] uppercase tracking-[.2em] text-[#e7ca9c] transition-colors hover:text-[#b99763]"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-[76px] min-h-[100dvh]">
      <div className="mx-auto max-w-[1000px] px-5 py-16 md:px-10 md:py-24">
        
        <div className="mb-16">
          <div className="font-meta text-[9px] uppercase tracking-[.32em] text-[#b99763]">Bespoke</div>
          <h1 className="mt-4 font-display text-5xl md:text-7xl text-[#e7ca9c]">Custom Order.</h1>
          <p className="mt-6 max-w-lg text-sm leading-8 text-[#c9c7c3]/70">
            Commission a piece made specifically for your space. Fill out the details below to start a conversation with our network of ateliers.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(handleReview)} className="space-y-12">
          
          <section className="border border-[#b99763]/25 bg-[#0c0a07] p-8 md:p-12">
            <h2 className="font-display text-2xl text-[#e7ca9c] border-b border-[#b99763]/15 pb-4 mb-8">1. Dimensions & Format</h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="block font-meta text-[10px] uppercase tracking-[.15em] text-[#c9c7c3]/60 mb-2">Rug Type</label>
                <select {...form.register('rugType')} className="w-full border border-[#b99763]/25 bg-[#060506] p-4 text-sm text-[#e7ca9c] focus:border-[#b99763] focus:outline-none transition-colors">
                  <option value="">Select type...</option>
                  <option value="Wool">Wool</option>
                  <option value="Silk">Silk</option>
                  <option value="Wool & Silk">Wool & Silk</option>
                  <option value="Tapestry">Tapestry (Wall)</option>
                </select>
                {form.formState.errors.rugType && <p className="text-xs text-[#7b311d] mt-2">{form.formState.errors.rugType.message}</p>}
              </div>
              <div>
                <label className="block font-meta text-[10px] uppercase tracking-[.15em] text-[#c9c7c3]/60 mb-2">Width</label>
                <input {...form.register('width')} type="number" step="any" className="w-full border border-[#b99763]/25 bg-[#060506] p-4 text-sm text-[#e7ca9c] focus:border-[#b99763] focus:outline-none transition-colors" />
                {form.formState.errors.width && <p className="text-xs text-[#7b311d] mt-2">{form.formState.errors.width.message}</p>}
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block font-meta text-[10px] uppercase tracking-[.15em] text-[#c9c7c3]/60 mb-2">Length</label>
                  <input {...form.register('length')} type="number" step="any" className="w-full border border-[#b99763]/25 bg-[#060506] p-4 text-sm text-[#e7ca9c] focus:border-[#b99763] focus:outline-none transition-colors" />
                  {form.formState.errors.length && <p className="text-xs text-[#7b311d] mt-2">{form.formState.errors.length.message}</p>}
                </div>
                <div className="w-24">
                  <label className="block font-meta text-[10px] uppercase tracking-[.15em] text-[#c9c7c3]/60 mb-2">Unit</label>
                  <select {...form.register('unit')} className="w-full border border-[#b99763]/25 bg-[#060506] p-4 text-sm text-[#e7ca9c] focus:border-[#b99763] focus:outline-none transition-colors">
                    <option value="cm">cm</option>
                    <option value="ft">ft</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          <section className="border border-[#b99763]/25 bg-[#0c0a07] p-8 md:p-12">
            <h2 className="font-display text-2xl text-[#e7ca9c] border-b border-[#b99763]/15 pb-4 mb-8">2. Aesthetics</h2>
            <div className="grid gap-8">
              <div>
                <label className="block font-meta text-[10px] uppercase tracking-[.15em] text-[#c9c7c3]/60 mb-2">Color Direction</label>
                <input {...form.register('colorDirection')} placeholder="e.g. Midnight blue field with ivory accents" className="w-full border border-[#b99763]/25 bg-[#060506] p-4 text-sm text-[#e7ca9c] focus:border-[#b99763] focus:outline-none transition-colors" />
                {form.formState.errors.colorDirection && <p className="text-xs text-[#7b311d] mt-2">{form.formState.errors.colorDirection.message}</p>}
              </div>
              <div>
                <label className="block font-meta text-[10px] uppercase tracking-[.15em] text-[#c9c7c3]/60 mb-2">Pattern / Style</label>
                <input {...form.register('pattern')} placeholder="e.g. Traditional central medallion, minimal border" className="w-full border border-[#b99763]/25 bg-[#060506] p-4 text-sm text-[#e7ca9c] focus:border-[#b99763] focus:outline-none transition-colors" />
                {form.formState.errors.pattern && <p className="text-xs text-[#7b311d] mt-2">{form.formState.errors.pattern.message}</p>}
              </div>
              <div>
                <label className="block font-meta text-[10px] uppercase tracking-[.15em] text-[#c9c7c3]/60 mb-2">Additional Requirements (Optional)</label>
                <textarea {...form.register('requirements')} rows={4} className="w-full border border-[#b99763]/25 bg-[#060506] p-4 text-sm text-[#e7ca9c] focus:border-[#b99763] focus:outline-none transition-colors" />
              </div>
              
              <div className="border border-dashed border-[#b99763]/40 p-8 text-center relative overflow-hidden">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
                  title="Upload reference image"
                />
                {!previewUrl ? (
                  <div className="pointer-events-none">
                    <span className="font-meta text-[10px] uppercase tracking-[.2em] text-[#b99763]">Upload your own image</span>
                    <p className="mt-2 text-xs text-[#c9c7c3]/50">Provide references for color or pattern (local preview only)</p>
                    <span className="inline-block mt-4 px-2 py-1 text-[8px] bg-[#b99763]/20 text-[#b99763] uppercase tracking-widest font-meta rounded-sm">Dev Only</span>
                  </div>
                ) : (
                  <div className="pointer-events-none flex flex-col items-center">
                    <img src={previewUrl} alt="Preview" className="h-32 object-contain mb-4 border border-[#b99763]/30" />
                    <span className="font-meta text-[10px] uppercase tracking-[.2em] text-[#b99763]">Change image</span>
                  </div>
                )}
              </div>
              {uploadError && <p role="alert" className="text-xs text-[#e7ca9c]">{uploadError}</p>}
            </div>
          </section>

          <section className="border border-[#b99763]/25 bg-[#0c0a07] p-8 md:p-12">
            <h2 className="font-display text-2xl text-[#e7ca9c] border-b border-[#b99763]/15 pb-4 mb-8">3. Contact</h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <label className="block font-meta text-[10px] uppercase tracking-[.15em] text-[#c9c7c3]/60 mb-2">First Name</label>
                <input {...form.register('firstName')} className="w-full border border-[#b99763]/25 bg-[#060506] p-4 text-sm text-[#e7ca9c] focus:border-[#b99763] focus:outline-none transition-colors" />
                {form.formState.errors.firstName && <p className="text-xs text-[#7b311d] mt-2">{form.formState.errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block font-meta text-[10px] uppercase tracking-[.15em] text-[#c9c7c3]/60 mb-2">Last Name</label>
                <input {...form.register('lastName')} className="w-full border border-[#b99763]/25 bg-[#060506] p-4 text-sm text-[#e7ca9c] focus:border-[#b99763] focus:outline-none transition-colors" />
                {form.formState.errors.lastName && <p className="text-xs text-[#7b311d] mt-2">{form.formState.errors.lastName.message}</p>}
              </div>
              <div>
                <label className="block font-meta text-[10px] uppercase tracking-[.15em] text-[#c9c7c3]/60 mb-2">Email Address</label>
                <input {...form.register('email')} className="w-full border border-[#b99763]/25 bg-[#060506] p-4 text-sm text-[#e7ca9c] focus:border-[#b99763] focus:outline-none transition-colors" />
                {form.formState.errors.email && <p className="text-xs text-[#7b311d] mt-2">{form.formState.errors.email.message}</p>}
              </div>
              <div>
                <label className="block font-meta text-[10px] uppercase tracking-[.15em] text-[#c9c7c3]/60 mb-2">Phone Number</label>
                <input {...form.register('phone')} className="w-full border border-[#b99763]/25 bg-[#060506] p-4 text-sm text-[#e7ca9c] focus:border-[#b99763] focus:outline-none transition-colors" />
                {form.formState.errors.phone && <p className="text-xs text-[#7b311d] mt-2">{form.formState.errors.phone.message}</p>}
              </div>
            </div>
          </section>

          <div className="flex justify-end pt-8">
            <button 
              type="submit"
              className="border border-[#b99763] bg-[#b99763] px-10 py-5 font-meta text-[10px] uppercase tracking-[.2em] text-[#060506] transition-colors hover:bg-[#e7ca9c]"
            >
              Review Details
            </button>
          </div>

        </form>

      </div>
    </main>
  );
}