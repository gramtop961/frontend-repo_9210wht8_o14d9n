import React, { useEffect, useMemo, useRef, useState } from 'react';
import GameHeader from './components/GameHeader';
import ItemCard from './components/ItemCard';
import DropZone from './components/DropZone';
import ScoreBoard from './components/ScoreBoard';

const INITIAL_ITEMS = [
  { id: 'cash', name: 'Cash in bank', amount: 5000, type: 'asset' },
  { id: 'inventory', name: 'Inventory', amount: 3500, type: 'asset' },
  { id: 'equipment', name: 'Equipment', amount: 4200, type: 'asset' },
  { id: 'accounts_receivable', name: 'Accounts Receivable', amount: 1800, type: 'asset' },
  { id: 'loan', name: 'Bank Loan', amount: -4000, type: 'liability' },
  { id: 'credit_card', name: 'Credit Card Balance', amount: -1200, type: 'liability' },
  { id: 'accounts_payable', name: 'Accounts Payable', amount: -2300, type: 'liability' },
  { id: 'taxes_due', name: 'Taxes Due', amount: -1000, type: 'liability' },
];

export default function App() {
  const [pool, setPool] = useState(INITIAL_ITEMS);
  const [assets, setAssets] = useState([]);
  const [liabilities, setLiabilities] = useState([]);

  // Touch drag state
  const draggingItem = useRef(null);

  const totals = useMemo(() => {
    const assetsTotal = assets.reduce((s, i) => s + Math.abs(i.amount), 0);
    const liabilitiesTotal = liabilities.reduce((s, i) => s + Math.abs(i.amount), 0);
    return { assetsTotal, liabilitiesTotal, remaining: assetsTotal - liabilitiesTotal };
  }, [assets, liabilities]);

  const onDragStart = (e, item) => {
    e.dataTransfer.setData('application/item-id', item.id);
    e.dataTransfer.effectAllowed = 'move';
    draggingItem.current = item;
  };

  const onTouchStart = (e, item) => {
    draggingItem.current = item;
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  const dropTo = (target) => (e) => {
    e.preventDefault();
    let itemId = e.dataTransfer?.getData('application/item-id');
    let item = draggingItem.current || pool.find((p) => p.id === itemId) || assets.find((a) => a.id === itemId) || liabilities.find((l) => l.id === itemId);
    if (!item) return;

    // remove from all buckets
    setPool((prev) => prev.filter((p) => p.id !== item.id));
    setAssets((prev) => prev.filter((p) => p.id !== item.id));
    setLiabilities((prev) => prev.filter((p) => p.id !== item.id));

    // add to target
    if (target === 'assets') setAssets((prev) => [...prev, item]);
    if (target === 'liabilities') setLiabilities((prev) => [...prev, item]);
  };

  const dropBack = (e) => {
    e.preventDefault();
    let itemId = e.dataTransfer?.getData('application/item-id');
    let item = draggingItem.current || assets.find((a) => a.id === itemId) || liabilities.find((l) => l.id === itemId);
    if (!item) return;

    setAssets((prev) => prev.filter((p) => p.id !== item.id));
    setLiabilities((prev) => prev.filter((p) => p.id !== item.id));
    setPool((prev) => [...prev, item]);
  };

  const reset = () => {
    setPool(INITIAL_ITEMS);
    setAssets([]);
    setLiabilities([]);
  };

  // Touch drop helpers for big touch screens
  const onTouchEndZone = (target) => (e) => {
    if (!draggingItem.current) return;
    if (target === 'assets') setAssets((prev) => [...prev.filter((p) => p.id !== draggingItem.current.id), draggingItem.current]);
    if (target === 'liabilities') setLiabilities((prev) => [...prev.filter((p) => p.id !== draggingItem.current.id), draggingItem.current]);
    setPool((prev) => prev.filter((p) => p.id !== draggingItem.current.id));
    draggingItem.current = null;
  };

  const onTouchEndPool = () => {
    if (!draggingItem.current) return;
    setAssets((prev) => prev.filter((p) => p.id !== draggingItem.current.id));
    setLiabilities((prev) => prev.filter((p) => p.id !== draggingItem.current.id));
    setPool((prev) => [...prev.filter((p) => p.id !== draggingItem.current.id), draggingItem.current]);
    draggingItem.current = null;
  };

  const remaining = totals.remaining;
  const balanced = remaining === 0 && assets.length + liabilities.length === INITIAL_ITEMS.length;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-rose-50 via-sky-50 to-emerald-50 flex flex-col items-stretch">
      <div className="max-w-5xl w-full mx-auto px-4 md:px-6">
        <GameHeader />

        {/* Pool of items */}
        <section
          className="rounded-2xl p-4 md:p-6 bg-white/60 backdrop-blur border border-slate-200 shadow-sm"
          onDrop={dropBack}
          onDragOver={allowDrop}
          onTouchEnd={onTouchEndPool}
        >
          <h2 className="text-lg md:text-xl font-semibold text-slate-700 mb-3 select-none">Drag these</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {pool.map((item) => (
              <ItemCard key={item.id} item={item} onDragStart={onDragStart} onTouchStart={onTouchStart} />
            ))}
            {pool.length === 0 && <p className="text-slate-400 italic">All items placed. Adjust if needed.</p>}
          </div>
        </section>

        {/* Drop zones */}
        <section className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div onDrop={dropTo('assets')} onDragOver={allowDrop} onTouchEnd={onTouchEndZone('assets')}>
            <DropZone title="Assets" items={assets} pastel="green" />
          </div>
          <div onDrop={dropTo('liabilities')} onDragOver={allowDrop} onTouchEnd={onTouchEndZone('liabilities')}>
            <DropZone title="Liabilities" items={liabilities} pastel="rose" />
          </div>
        </section>

        <ScoreBoard
          assetsTotal={totals.assetsTotal}
          liabilitiesTotal={totals.liabilitiesTotal}
          remaining={remaining}
          onReset={reset}
        />

        {balanced && (
          <div className="mt-6 md:mt-8 p-4 md:p-6 rounded-2xl bg-gradient-to-r from-emerald-100 via-sky-100 to-rose-100 border border-slate-200 shadow-sm text-center">
            <p className="text-lg md:text-xl font-semibold text-slate-700">Perfect balance! 🎉</p>
            <p className="text-slate-600 mt-1">You've matched every item correctly. Tap reset to play again.</p>
          </div>
        )}

        <footer className="py-10" />
      </div>
    </div>
  );
}
