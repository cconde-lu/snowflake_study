import React, { useState, useCallback } from 'react';
import { RefreshCw, ChevronLeft, ChevronRight, Shuffle, RotateCcw } from 'lucide-react';
import { FLASHCARDS } from './flashcards-data.js';

const DOMAIN_FILTERS = [
  { id: 0, label: 'All',  color: 'bg-slate-600' },
  { id: 1, label: 'D1',   color: 'bg-blue-600'   },
  { id: 2, label: 'D2',   color: 'bg-violet-600'  },
  { id: 3, label: 'D3',   color: 'bg-teal-600'    },
  { id: 4, label: 'D4',   color: 'bg-amber-600'   },
  { id: 5, label: 'D5',   color: 'bg-rose-600'    },
];

const DOMAIN_LABELS = {
  1: 'Architecture',
  2: 'Governance',
  3: 'Data Loading',
  4: 'Performance',
  5: 'Collaboration',
};

const DOMAIN_BADGE = {
  1: 'bg-blue-100 text-blue-800',
  2: 'bg-violet-100 text-violet-800',
  3: 'bg-teal-100 text-teal-800',
  4: 'bg-amber-100 text-amber-800',
  5: 'bg-rose-100 text-rose-800',
};

const seededShuffle = (arr, seed) => {
  let s = seed;
  const rand = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0xFFFFFFFF; };
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

const FlashCards = () => {
  const [domainFilter, setDomainFilter] = useState(0);
  const [shuffleSeed, setShuffleSeed]   = useState(1);
  const [index, setIndex]               = useState(0);
  const [flipped, setFlipped]           = useState(false);
  const [known, setKnown]               = useState({});   // { cardId: true }

  const baseCards = domainFilter === 0
    ? FLASHCARDS
    : FLASHCARDS.filter(c => c.domain === domainFilter);

  const deck = seededShuffle(baseCards, shuffleSeed);
  const card  = deck[index];
  const total = deck.length;
  const knownCount = deck.filter(c => known[c.id]).length;

  const goTo = useCallback((i) => {
    setIndex(Math.max(0, Math.min(i, total - 1)));
    setFlipped(false);
  }, [total]);

  const shuffle = () => {
    setShuffleSeed(s => s + 1);
    setIndex(0);
    setFlipped(false);
  };

  const resetKnown = () => setKnown({});

  const toggleKnown = () => {
    setKnown(k => ({ ...k, [card.id]: !k[card.id] }));
  };

  const handleFilterChange = (id) => {
    setDomainFilter(id);
    setIndex(0);
    setFlipped(false);
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto">

      {/* Header */}
      <div className="bg-slate-800 rounded-2xl p-5 text-white">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-extrabold">Flashcards</h2>
          <span className="text-slate-400 text-xs font-medium">{FLASHCARDS.length} total cards</span>
        </div>
        <p className="text-slate-400 text-xs">Tap the card to flip · Filter by domain · Mark cards you know</p>
      </div>

      {/* Domain filter */}
      <div className="flex gap-2 flex-wrap">
        {DOMAIN_FILTERS.map(f => (
          <button key={f.id} onClick={() => handleFilterChange(f.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              domainFilter === f.id
                ? `${f.color} text-white shadow`
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400'
            }`}>
            {f.label}
            {f.id !== 0 && (
              <span className={`ml-1 ${domainFilter === f.id ? 'text-white/70' : 'text-slate-400'}`}>
                ({FLASHCARDS.filter(c => c.domain === f.id).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Progress bar + stats */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
          <span>Card {index + 1} / {total}
            {domainFilter !== 0 && <span className="text-slate-400 font-normal ml-1">in D{domainFilter}</span>}
          </span>
          <span className="text-emerald-600">{knownCount} known · {total - knownCount} to review</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-1.5">
          <div className="bg-cyan-500 h-1.5 rounded-full transition-all"
            style={{ width: `${((index + 1) / total) * 100}%` }} />
        </div>
      </div>

      {/* Flip card */}
      <div
        className="cursor-pointer select-none"
        style={{ perspective: '1200px' }}
        onClick={() => setFlipped(f => !f)}
      >
        <div style={{
          transition: 'transform 0.45s ease',
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          position: 'relative',
          minHeight: '260px',
        }}>
          {/* Front */}
          <div style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
            className="absolute inset-0 bg-white rounded-2xl border border-slate-200 shadow-md p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${DOMAIN_BADGE[card.domain]}`}>
                D{card.domain} · {DOMAIN_LABELS[card.domain]}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">{card.topic}</span>
              {known[card.id] && (
                <span className="ml-auto text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">✓ Known</span>
              )}
            </div>
            <div className="flex-1 flex items-center justify-center">
              <p className="text-lg font-semibold text-slate-800 text-center leading-relaxed whitespace-pre-line">
                {card.front}
              </p>
            </div>
            <p className="text-center text-slate-300 text-xs mt-4">Tap to reveal answer</p>
          </div>

          {/* Back */}
          <div style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
            className="absolute inset-0 bg-slate-800 rounded-2xl border border-slate-700 shadow-md p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${DOMAIN_BADGE[card.domain]}`}>
                D{card.domain} · {DOMAIN_LABELS[card.domain]}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">{card.topic}</span>
            </div>
            <div className="flex-1 flex items-center justify-center overflow-y-auto">
              <p className="text-sm text-slate-100 leading-relaxed whitespace-pre-line text-center">
                {card.back}
              </p>
            </div>
            <p className="text-center text-slate-500 text-xs mt-4">Tap to flip back</p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={toggleKnown}
          className={`py-3 rounded-xl font-bold text-sm transition-all border-2 ${
            known[card.id]
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'bg-white border-emerald-300 text-emerald-700 hover:bg-emerald-50'
          }`}>
          {known[card.id] ? '✓ Known' : 'Mark as Known'}
        </button>
        <button onClick={() => { goTo(index); setFlipped(false); setKnown(k => { const n = {...k}; delete n[card.id]; return n; }); }}
          className="py-3 rounded-xl font-bold text-sm bg-white border-2 border-amber-300 text-amber-700 hover:bg-amber-50 transition-all">
          Review Again
        </button>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3">
        <button onClick={() => goTo(index - 1)} disabled={index === 0}
          className="flex items-center gap-1.5 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:border-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex-1 justify-center">
          <ChevronLeft className="w-4 h-4" /> Prev
        </button>
        <button onClick={() => goTo(index + 1)} disabled={index === total - 1}
          className="flex items-center gap-1.5 px-4 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-xl text-sm font-bold text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all flex-1 justify-center">
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Deck controls */}
      <div className="flex gap-3">
        <button onClick={shuffle}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:border-slate-400 transition-all">
          <Shuffle className="w-3.5 h-3.5" /> Shuffle Deck
        </button>
        <button onClick={() => { setIndex(0); setFlipped(false); }}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:border-slate-400 transition-all">
          <RotateCcw className="w-3.5 h-3.5" /> Restart Deck
        </button>
        <button onClick={resetKnown}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:border-slate-400 transition-all">
          <RefreshCw className="w-3.5 h-3.5" /> Reset Known
        </button>
      </div>

      {/* Mini card navigator */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Card Navigator</p>
        <div className="flex flex-wrap gap-1.5">
          {deck.map((c, i) => (
            <button key={c.id} onClick={() => goTo(i)}
              className={`w-7 h-7 rounded-lg text-[10px] font-bold border transition-all ${
                i === index
                  ? 'bg-cyan-600 border-cyan-600 text-white'
                  : known[c.id]
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'
              }`}>
              {i + 1}
            </button>
          ))}
        </div>
        <div className="flex gap-3 mt-3">
          {[
            { cls: 'bg-cyan-600 border-cyan-600 text-white', label: 'Current' },
            { cls: 'bg-emerald-50 border-emerald-300 text-emerald-700', label: 'Known' },
            { cls: 'bg-white border-slate-200 text-slate-500', label: 'To review' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <div className={`w-4 h-4 rounded border ${s.cls}`}></div>
              {s.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlashCards;
