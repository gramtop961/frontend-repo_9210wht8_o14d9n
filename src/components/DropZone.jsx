import React from 'react';

export default function DropZone({ title, items, onDrop, onDragOver, pastel }) {
  return (
    <div
      className={`flex-1 rounded-2xl p-4 md:p-6 border-2 border-dashed ${
        pastel === 'green'
          ? 'bg-emerald-50/70 border-emerald-200'
          : 'bg-rose-50/70 border-rose-200'
      }`}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <h3 className="text-lg md:text-xl font-semibold text-slate-700 mb-3 select-none">{title}</h3>
      <div className="space-y-3 min-h-[200px]">
        {items.map((it) => (
          <div key={it.id} className="">
            <div className="rounded-lg px-4 py-2 bg-white/80 border border-slate-200 shadow-sm text-slate-700 flex items-center justify-between">
              <span>{it.name}</span>
              <span className="text-slate-500 text-sm">${Math.abs(it.amount).toLocaleString()}</span>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-slate-400 text-sm italic">Drop items here</div>
        )}
      </div>
    </div>
  );
}
