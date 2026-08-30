import { ReactNode } from 'react';
import { useCatalog } from '../context/CatalogContext';
import { Link } from 'wouter';

export function AboutPage() {
  return (
    <main className="pt-[76px] min-h-[100dvh]">
      <div className="mx-auto max-w-[1000px] px-5 py-16 md:px-10 md:py-24">
        <div className="font-meta text-[9px] uppercase tracking-[.32em] text-[#b99763]">The Gallery</div>
        <h1 className="mt-4 font-display text-5xl md:text-7xl text-[#e7ca9c]">About MiLAEDiA.</h1>
        <p className="mt-12 text-sm leading-8 text-[#c9c7c3]/70">
          MiLAEDiA is a private gallery dedicated to Persian rugs and tapestries, bridging the craft of Iran with the contemporary context of Berlin and the historical interiors of Europe.
        </p>
      </div>
    </main>
  );
}

export function ContactPage() {
  return (
    <main className="pt-[76px] min-h-[100dvh]">
      <div className="mx-auto max-w-[1000px] px-5 py-16 md:px-10 md:py-24">
        <div className="font-meta text-[9px] uppercase tracking-[.32em] text-[#b99763]">Contact</div>
        <h1 className="mt-4 font-display text-5xl md:text-7xl text-[#e7ca9c]">Get in touch.</h1>
        <p className="mt-12 text-sm leading-8 text-[#c9c7c3]/70">
          For inquiries regarding specific pieces, private viewing appointments in Berlin, or sourcing requests, please reach out to our curation team.
        </p>
      </div>
    </main>
  );
}

export function SearchPage({ onAdd }: { onAdd: (id: string) => void }) {
  return (
    <main className="pt-[76px] min-h-[100dvh]">
      <div className="mx-auto max-w-[1000px] px-5 py-16 md:px-10 md:py-24">
        <div className="font-meta text-[9px] uppercase tracking-[.32em] text-[#b99763]">Search</div>
        <h1 className="mt-4 font-display text-5xl md:text-7xl text-[#e7ca9c]">Find a piece.</h1>
        <div className="mt-12">
          <input type="text" placeholder="Search archive..." className="w-full border-b border-[#b99763]/25 bg-transparent p-4 text-2xl text-[#e7ca9c] focus:border-[#b99763] focus:outline-none" />
        </div>
      </div>
    </main>
  );
}