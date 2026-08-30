import { ArrowLeft, Search } from 'lucide-react';
import { Link } from 'wouter';

export default function NotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center px-5 pt-[76px]">
      <div className="max-w-lg text-center">
        <div className="font-meta text-[11px] tracking-[.35em] text-[#8d5e37]">04 / 04 — LOST FRAME</div>
        <h1 className="mt-6 font-display text-8xl leading-[.78] text-[#e7ca9c] md:text-9xl">Not<br /><i className="text-[#b99763]">here.</i></h1>
        <p className="mx-auto mt-7 max-w-sm text-sm leading-7 text-[#c9c7c3]/60">The piece you are looking for has moved on. The collection is still open.</p>
        <div className="mt-9 flex justify-center gap-5">
          <Link href="/" className="inline-flex items-center gap-3 border border-[#b99763]/55 px-4 py-3 font-meta text-[10px] uppercase tracking-[.16em] text-[#e7ca9c]" data-testid="link-404-home"><ArrowLeft size={14} /> Return home</Link>
          <Link href="/search" className="inline-flex items-center gap-3 border border-[#b99763]/20 px-4 py-3 font-meta text-[10px] uppercase tracking-[.16em] text-[#b99763]" data-testid="link-404-search"><Search size={14} /> Search</Link>
        </div>
      </div>
    </main>
  );
}