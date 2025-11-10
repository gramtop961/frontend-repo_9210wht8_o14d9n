import React from 'react';

export default function GameHeader() {
  return (
    <header className="w-full text-center py-6 md:py-8 select-none">
      <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 tracking-tight">
        Asset vs Liability
      </h1>
      <p className="mt-3 md:mt-4 max-w-2xl mx-auto text-slate-600 text-sm md:text-base">
        Drag each financial item into the correct bucket. Classify everything correctly so the
        totals balance. Designed for touch — press, drag, and drop. Pastel vibes included.
      </p>
    </header>
  );
}
