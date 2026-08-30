import { useState } from 'react';
import { useLocation } from 'wouter';
import { useCatalog } from '../../context/CatalogContext';
import { canAcquireProduct, money } from '../../data/catalog';
import { ShieldCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const checkoutSchema = z.object({
  email: z.string().email('Invalid email'),
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  address: z.string().min(1, 'Required'),
  city: z.string().min(1, 'Required'),
  country: z.string().min(1, 'Required'),
  postalCode: z.string().min(1, 'Required')
});

export function CheckoutPage({ cart, clearCart }: { cart: { id: string; qty: number }[]; clearCart: () => void }) {
  const { products, addOrder } = useCatalog();
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.id);
    return { ...item, product };
  }).filter(item => item.product);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product?.price || 0) * item.qty, 0);

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: '', firstName: '', lastName: '', address: '', city: '', country: '', postalCode: ''
    }
  });

  const onSubmit = (data: z.infer<typeof checkoutSchema>) => {
    setIsSubmitting(true);
    // Simulate payment
    setTimeout(() => {
      const orderId = `ML-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
      addOrder({
        id: orderId,
        customerName: `${data.firstName} ${data.lastName}`,
        email: data.email,
        address: `${data.address}, ${data.city}, ${data.country}`,
        date: new Date().toISOString(),
        total: subtotal,
        status: 'PENDING',
        paymentStatus: 'MOCK / NOT PROCESSED',
        items: cart.map(c => ({ id: c.id, qty: c.qty }))
      });
      clearCart();
      setLocation(`/order-confirmation/${orderId}`);
    }, 1500);
  };

  const invalidCart = cartItems.length === 0 || cartItems.some((item) => !item.product || !canAcquireProduct(item.product));

  if (invalidCart) return (
    <main className="grid min-h-[75vh] place-items-center px-5 pt-[76px]">
      <div className="max-w-lg border border-[#b99763]/25 bg-[#0c0a07] p-8 text-center">
        <h1 className="font-display text-4xl text-[#e7ca9c]">Selection requires review.</h1>
        <p className="mt-4 text-sm leading-7 text-[#c9c7c3]/65">One or more pieces are no longer available. Return to the cart to update the selection.</p>
        <button type="button" onClick={() => setLocation('/cart')} className="mt-7 border border-[#b99763]/55 px-5 py-3 font-meta text-[10px] uppercase tracking-[.16em] text-[#e7ca9c]">Return to cart</button>
      </div>
    </main>
  );

  return (
    <main className="pt-[76px] min-h-[100dvh]">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10">
        
        <div className="grid gap-16 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <div className="mb-10">
              <div className="font-meta text-[9px] uppercase tracking-[.32em] text-[#b99763]">Secure Checkout</div>
              <h1 className="mt-4 font-display text-4xl text-[#e7ca9c]">Acquisition details</h1>
            </div>

            <div className="mb-8 border-l-2 border-[#b99763] bg-[#0c0a07] p-5">
              <p className="text-sm text-[#c9c7c3]/80">
                <strong className="text-[#e7ca9c]">Development Mode:</strong> This is a mock checkout. No real payment will be processed. You can enter dummy data.
              </p>
            </div>

            <form id="checkout-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
              
              {/* Contact */}
              <section>
                <h2 className="font-display text-2xl text-[#e7ca9c] border-b border-[#b99763]/25 pb-4 mb-6">Contact Information</h2>
                <div className="grid gap-6">
                  <div>
                    <label className="block font-meta text-[10px] uppercase tracking-[.15em] text-[#c9c7c3]/60 mb-2">Email Address</label>
                    <input {...form.register('email')} className="w-full border border-[#b99763]/25 bg-[#060506] p-4 text-sm text-[#e7ca9c] focus:border-[#b99763] focus:outline-none transition-colors" />
                    {form.formState.errors.email && <span className="text-xs text-[#7b311d] mt-1 block">{form.formState.errors.email.message}</span>}
                  </div>
                </div>
              </section>

              {/* Shipping */}
              <section>
                <h2 className="font-display text-2xl text-[#e7ca9c] border-b border-[#b99763]/25 pb-4 mb-6">Shipping Address</h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block font-meta text-[10px] uppercase tracking-[.15em] text-[#c9c7c3]/60 mb-2">First Name</label>
                    <input {...form.register('firstName')} className="w-full border border-[#b99763]/25 bg-[#060506] p-4 text-sm text-[#e7ca9c] focus:border-[#b99763] focus:outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block font-meta text-[10px] uppercase tracking-[.15em] text-[#c9c7c3]/60 mb-2">Last Name</label>
                    <input {...form.register('lastName')} className="w-full border border-[#b99763]/25 bg-[#060506] p-4 text-sm text-[#e7ca9c] focus:border-[#b99763] focus:outline-none transition-colors" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-meta text-[10px] uppercase tracking-[.15em] text-[#c9c7c3]/60 mb-2">Address</label>
                    <input {...form.register('address')} className="w-full border border-[#b99763]/25 bg-[#060506] p-4 text-sm text-[#e7ca9c] focus:border-[#b99763] focus:outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block font-meta text-[10px] uppercase tracking-[.15em] text-[#c9c7c3]/60 mb-2">City</label>
                    <input {...form.register('city')} className="w-full border border-[#b99763]/25 bg-[#060506] p-4 text-sm text-[#e7ca9c] focus:border-[#b99763] focus:outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block font-meta text-[10px] uppercase tracking-[.15em] text-[#c9c7c3]/60 mb-2">Country</label>
                    <input {...form.register('country')} className="w-full border border-[#b99763]/25 bg-[#060506] p-4 text-sm text-[#e7ca9c] focus:border-[#b99763] focus:outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block font-meta text-[10px] uppercase tracking-[.15em] text-[#c9c7c3]/60 mb-2">Postal Code</label>
                    <input {...form.register('postalCode')} className="w-full border border-[#b99763]/25 bg-[#060506] p-4 text-sm text-[#e7ca9c] focus:border-[#b99763] focus:outline-none transition-colors" />
                  </div>
                </div>
              </section>

              {/* Payment */}
              <section>
                <div className="flex items-center justify-between border-b border-[#b99763]/25 pb-4 mb-6">
                  <h2 className="font-display text-2xl text-[#e7ca9c]">Payment</h2>
                  <ShieldCheck size={20} className="text-[#b99763]" />
                </div>
                <div className="border border-[#b99763]/25 bg-[#0c0a07] p-6">
                  <div className="font-meta text-[10px] uppercase tracking-[.16em] text-[#e7ca9c]">Mock payment — not processed</div>
                  <p className="mt-3 text-sm leading-7 text-[#c9c7c3]/60">No card or banking details are collected. Confirming creates a local development order only.</p>
                </div>
              </section>

            </form>
          </div>

          <div>
            <div className="sticky top-32 border border-[#b99763]/25 bg-[#0c0a07] p-8">
              <h2 className="font-display text-2xl text-[#e7ca9c] mb-8">Summary</h2>
              
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="aspect-[3/4] w-16 overflow-hidden border border-[#b99763]/15">
                      <img src={item.product!.image} alt={item.product!.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-lg text-[#e7ca9c] leading-tight">{item.product!.name}</h3>
                      <div className="mt-1 font-meta text-[9px] uppercase text-[#c9c7c3]/50">Qty: {item.qty}</div>
                      <div className="mt-2 font-meta text-xs text-[#b99763]">{money(item.product!.price)}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-4 border-t border-[#b99763]/15 pt-8">
                <div className="flex justify-between text-sm text-[#c9c7c3]">
                  <span>Subtotal</span>
                  <span className="font-meta">{money(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-[#c9c7c3]">
                  <span>Shipping</span>
                  <span className="font-meta text-[#e7ca9c]">Complimentary</span>
                </div>
              </div>

              <div className="mt-8 flex justify-between border-t border-[#b99763]/25 pt-6">
                <span className="font-display text-xl text-[#e7ca9c]">Total</span>
                <span className="font-meta text-xl text-[#e7ca9c]">{money(subtotal)}</span>
              </div>

              <button 
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="mt-10 w-full border border-[#b99763] bg-[#b99763] px-6 py-4 font-meta text-[10px] uppercase tracking-[.2em] text-[#060506] transition-colors hover:bg-[#e7ca9c] disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : 'Confirm Acquisition'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}