import React from 'react';

export default function ItemCard({ item, onDragStart, onTouchStart }) {
  return (
    <div
      className="rounded-xl px-4 py-3 bg-white/70 backdrop-blur border border-slate-200 shadow-sm active:scale-[0.98] transition-transform touch-manipulation"
      draggable
      onDragStart={(e) => onDragStart(e, item)}
      onTouchStart={(e) => onTouchStart(e, item)}
      role="button"
      aria-label={`Drag ${item.name}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-slate-800 font-medium">{item.name}</span>
        <span className="text-slate-500 text-sm">${Math.abs(item.amount).toLocaleString()}</span>
      </div>
    </div>
  );
}
