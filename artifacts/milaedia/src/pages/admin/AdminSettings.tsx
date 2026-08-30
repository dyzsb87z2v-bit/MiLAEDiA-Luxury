export function AdminSettings() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <div className="font-meta text-[9px] uppercase tracking-[.32em] text-[#b99763] mb-2">System</div>
        <h1 className="font-display text-4xl text-[#e7ca9c]">Settings.</h1>
      </div>

      <div className="border border-[#b99763]/25 bg-[#0c0a07] p-8 md:p-12 space-y-8">
        <div>
          <h2 className="font-display text-2xl text-[#e7ca9c] mb-2">Development Limitations</h2>
          <p className="text-sm leading-7 text-[#c9c7c3]/70">
            This administrative interface is currently operating in development mode.
            Authentication uses a signed, HTTP-only server session. Catalogue, order, and content changes are persisted only in this browser's <code className="font-meta text-xs text-[#b99763]">localStorage</code>.
          </p>
        </div>

        <div className="border-t border-[#b99763]/15 pt-8">
          <h2 className="font-display text-2xl text-[#e7ca9c] mb-2">Data Persistence</h2>
          <p className="text-sm leading-7 text-[#c9c7c3]/70">
            Clearing your browser data will reset the catalogue, gallery, and orders to their initial mock states.
          </p>
          <button 
            onClick={() => {
              if (window.confirm('Reset all development data? This cannot be undone.')) {
                Object.keys(localStorage)
                  .filter((key) => key.startsWith('milaedia-'))
                  .forEach((key) => localStorage.removeItem(key));
                window.location.reload();
              }
            }}
            className="mt-6 border border-[#7b311d]/50 text-[#7b311d] px-6 py-3 font-meta text-[10px] uppercase tracking-widest hover:bg-[#7b311d] hover:text-[#060506] transition-colors"
          >
            Reset All Data
          </button>
        </div>
      </div>
    </div>
  );
}