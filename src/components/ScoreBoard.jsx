import React from 'react';

function format(n) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 0 });
}

export default function ScoreBoard({ assetsTotal, liabilitiesTotal, remaining, onReset }) {
  const balanced = remaining === 0 && assetsTotal > 0 && liabilitiesTotal > 0;
  return (
    <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 select-none">
      <div className="rounded-xl p-4 bg-emerald-50/80 border border-emerald-200">
        <p className="text-sm text-emerald-700">Assets</p>
        <p className="text-2xl font-bold text-emerald-900">${format(assetsTotal)}</p>
      </div>
      <div className="rounded-xl p-4 bg-rose-50/80 border border-rose-200">
        <p className="text-sm text-rose-700">Liabilities</p>
        <p className="text-2xl font-bold text-rose-900">${format(liabilitiesTotal)}</p>
      </div>
      <div className={`rounded-xl p-4 ${balanced ? 'bg-sky-50/80 border-sky-200' : 'bg-amber-50/80 border-amber-200'} border`}>
        <p className={`text-sm ${balanced ? 'text-sky-700' : 'text-amber-700'}`}>{balanced ? 'Balanced' : 'Difference'}</p>
        <p className={`text-2xl font-bold ${balanced ? 'text-sky-900' : 'text-amber-900'}`}>${format(Math.abs(remaining))}</p>
      </div>
      <button
        onClick={onReset}
        className="rounded-xl p-4 bg-white/90 hover:bg-white border border-slate-200 shadow-sm text-slate-700 font-semibold active:scale-[0.98] transition">
        Reset
      </button>
    </div>
  );
}
