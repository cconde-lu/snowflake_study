import React, { useState, useCallback, useMemo } from 'react';
import {
  BookOpen, CheckCircle, XCircle, ChevronRight, ChevronLeft,
  RefreshCw, Filter, RotateCcw, Award,
} from 'lucide-react';
import { ALL_QUESTIONS } from './question-registry.js';

// ── Constants ─────────────────────────────────────────────────────────────────
const DOMAIN_COLORS = {
  1: { bg: 'bg-blue-600',   light: 'bg-blue-50',   border: 'border-blue-200',   badge: 'bg-blue-100 text-blue-800'   },
  2: { bg: 'bg-violet-600', light: 'bg-violet-50', border: 'border-violet-200', badge: 'bg-violet-100 text-violet-800' },
  3: { bg: 'bg-teal-600',   light: 'bg-teal-50',   border: 'border-teal-200',   badge: 'bg-teal-100 text-teal-800'   },
  4: { bg: 'bg-amber-600',  light: 'bg-amber-50',  border: 'border-amber-200',  badge: 'bg-amber-100 text-amber-800'  },
  5: { bg: 'bg-rose-600',   light: 'bg-rose-50',   border: 'border-rose-200',   badge: 'bg-rose-100 text-rose-800'    },
};

const DOMAIN_LABELS = {
  1: 'Architecture', 2: 'Governance', 3: 'Data Loading',
  4: 'Performance',  5: 'Collaboration',
};

const DIFFICULTY_COLORS = {
  easy:   'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100 text-amber-700',
  hard:   'bg-red-100 text-red-700',
};

// Deterministic shuffle by seed integer
const shuffle = (arr, seed = 42) => {
  let s = seed;
  const rand = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0xFFFFFFFF; };
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

// ── Filter Bar ────────────────────────────────────────────────────────────────
const FilterBar = ({ domainFilter, setDomainFilter, diffFilter, setDiffFilter, total }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
      <Filter className="w-3.5 h-3.5" /> Filters · <span className="text-cyan-600">{total} questions</span>
    </div>

    <div>
      <p className="text-[10px] font-semibold text-slate-400 uppercase mb-1.5">Domain</p>
      <div className="flex flex-wrap gap-1.5">
        {[{ id: 0, label: 'All' }, { id: 1, label: 'D1 Architecture' }, { id: 2, label: 'D2 Governance' },
          { id: 3, label: 'D3 Data Loading' }, { id: 4, label: 'D4 Performance' }, { id: 5, label: 'D5 Collaboration' }]
          .map(({ id, label }) => (
            <button key={id} onClick={() => setDomainFilter(id)}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                domainFilter === id
                  ? id === 0 ? 'bg-slate-700 text-white' : `${DOMAIN_COLORS[id]?.bg} text-white`
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}>
              {label}
            </button>
          ))}
      </div>
    </div>

    <div>
      <p className="text-[10px] font-semibold text-slate-400 uppercase mb-1.5">Difficulty</p>
      <div className="flex gap-1.5">
        {[{ id: 'all', label: 'All' }, { id: 'easy', label: 'Easy' }, { id: 'medium', label: 'Medium' }, { id: 'hard', label: 'Hard' }]
          .map(({ id, label }) => (
            <button key={id} onClick={() => setDiffFilter(id)}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                diffFilter === id
                  ? id === 'all' ? 'bg-slate-700 text-white'
                    : id === 'easy' ? 'bg-emerald-500 text-white'
                    : id === 'medium' ? 'bg-amber-500 text-white'
                    : 'bg-red-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}>
              {label}
            </button>
          ))}
      </div>
    </div>
  </div>
);

// ── Question Card ─────────────────────────────────────────────────────────────
const QuestionCard = ({ q, picked, revealed, onPick, onReveal, onMark, status, index, total }) => {
  const c = DOMAIN_COLORS[q.domain];
  const isCorrect = picked === q.answer;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-2">
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${c.badge}`}>
          D{q.domain} · {DOMAIN_LABELS[q.domain]}
        </span>
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${DIFFICULTY_COLORS[q.difficulty]}`}>
          {q.difficulty}
        </span>
        <span className="text-[10px] text-slate-400 font-medium ml-auto">{q.topic}</span>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-500">{index + 1} / {total}</span>
        <div className="flex-1 bg-slate-100 rounded-full h-1.5">
          <div className="bg-cyan-500 h-1.5 rounded-full transition-all"
            style={{ width: `${((index + 1) / total) * 100}%` }} />
        </div>
      </div>

      {/* Question */}
      <p className="text-base font-semibold text-slate-800 leading-relaxed">{q.q}</p>

      {/* Options */}
      <div className="space-y-2">
        {q.options.map((opt) => {
          let cls = 'border-slate-200 bg-white hover:border-cyan-300 hover:bg-cyan-50/50 text-slate-700';
          if (revealed) {
            if (opt === q.answer)
              cls = 'border-emerald-400 bg-emerald-50 text-emerald-800 font-semibold';
            else if (opt === picked)
              cls = 'border-red-300 bg-red-50 text-red-700 line-through opacity-60';
            else
              cls = 'border-slate-100 bg-white text-slate-400 opacity-40';
          } else if (picked === opt) {
            cls = 'border-cyan-400 bg-cyan-50 text-cyan-900 font-semibold';
          }

          return (
            <button key={opt} onClick={() => !revealed && onPick(opt)}
              disabled={revealed}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all flex items-start gap-3 ${cls} ${revealed ? 'cursor-default' : 'cursor-pointer'}`}>
              {revealed && opt === q.answer && <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />}
              {revealed && opt === picked && opt !== q.answer && <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />}
              {(!revealed || (opt !== q.answer && opt !== picked)) && <span className="w-4 h-4 flex-shrink-0" />}
              <span className="flex-1">{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Reveal / explanation */}
      {!revealed && picked && (
        <button onClick={onReveal}
          className="w-full py-2.5 bg-slate-700 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-colors">
          Reveal Answer
        </button>
      )}

      {revealed && (
        <div className="space-y-3">
          <div className={`rounded-xl p-4 border text-sm ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
            <p className={`font-bold mb-1 ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
              {isCorrect ? '✓ Correct!' : '✗ Incorrect'}{!picked && ' (skipped)'}
            </p>
            {!isCorrect && (
              <p className="text-sm font-semibold text-emerald-700 mb-2">✓ Correct: {q.answer}</p>
            )}
            <p className="text-slate-600 text-xs leading-relaxed italic">{q.exp}</p>
          </div>

          {/* Mark buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => onMark('got')}
              className={`py-2.5 rounded-xl font-bold text-sm transition-all border-2 ${
                status === 'got'
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : 'bg-white border-emerald-300 text-emerald-700 hover:bg-emerald-50'
              }`}>
              ✓ Got it
            </button>
            <button onClick={() => onMark('review')}
              className={`py-2.5 rounded-xl font-bold text-sm transition-all border-2 ${
                status === 'review'
                  ? 'bg-amber-500 border-amber-500 text-white'
                  : 'bg-white border-amber-300 text-amber-700 hover:bg-amber-50'
              }`}>
              🔁 Review again
            </button>
          </div>
        </div>
      )}

      {/* Skip (before answer) */}
      {!revealed && !picked && (
        <button onClick={onReveal}
          className="text-xs text-slate-400 hover:text-slate-600 underline w-full text-center">
          Skip — reveal answer
        </button>
      )}
    </div>
  );
};

// ── Results Screen ─────────────────────────────────────────────────────────────
const ResultsScreen = ({ deck, answers, marks, onRestart, onReviewOnly }) => {
  const correct    = deck.filter(q => answers[q.id] === q.answer).length;
  const got        = deck.filter(q => marks[q.id] === 'got').length;
  const needReview = deck.filter(q => marks[q.id] === 'review').length;
  const skipped    = deck.filter(q => !answers[q.id]).length;
  const pct        = Math.round((correct / deck.length) * 100);

  const byDomain = deck.reduce((acc, q) => {
    if (!acc[q.domain]) acc[q.domain] = { total: 0, correct: 0 };
    acc[q.domain].total++;
    if (answers[q.id] === q.answer) acc[q.domain].correct++;
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {/* Score card */}
      <div className={`rounded-2xl p-6 text-white ${pct >= 80 ? 'bg-emerald-600' : pct >= 60 ? 'bg-amber-500' : 'bg-rose-600'}`}>
        <div className="flex items-center gap-3 mb-4">
          <Award className="w-8 h-8 text-white/80" />
          <div>
            <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">Study Session Complete</p>
            <h2 className="text-2xl font-extrabold">{pct >= 80 ? '🎉 Excellent!' : pct >= 60 ? '👍 Good progress!' : '📚 Keep reviewing'}</h2>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { label: 'Score', val: `${pct}%` },
            { label: 'Correct', val: `${correct}/${deck.length}` },
            { label: 'Got It', val: got },
            { label: 'To Review', val: needReview },
          ].map(s => (
            <div key={s.label} className="bg-white/20 rounded-xl p-2">
              <p className="text-white font-extrabold text-lg">{s.val}</p>
              <p className="text-white/70 text-[10px]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Domain breakdown */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Score by Domain</p>
        <div className="space-y-3">
          {Object.entries(byDomain).map(([d, stat]) => {
            const dpct = Math.round((stat.correct / stat.total) * 100);
            const c = DOMAIN_COLORS[d];
            return (
              <div key={d}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-700">D{d} {DOMAIN_LABELS[d]}</span>
                  <span className={`text-xs font-bold ${dpct >= 80 ? 'text-emerald-600' : dpct >= 60 ? 'text-amber-600' : 'text-red-500'}`}>
                    {stat.correct}/{stat.total} ({dpct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className={`${c.bg} h-2 rounded-full transition-all`} style={{ width: `${dpct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid sm:grid-cols-2 gap-3">
        {needReview > 0 && (
          <button onClick={onReviewOnly}
            className="py-3 rounded-xl font-bold text-sm bg-amber-500 hover:bg-amber-600 text-white transition-colors flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4" /> Review {needReview} marked questions
          </button>
        )}
        <button onClick={onRestart}
          className="py-3 rounded-xl font-bold text-sm bg-slate-700 hover:bg-slate-800 text-white transition-colors flex items-center justify-center gap-2">
          <RotateCcw className="w-4 h-4" /> New Session
        </button>
      </div>
    </div>
  );
};

// ── Root StudySession ──────────────────────────────────────────────────────────
const StudySession = () => {
  const [domainFilter, setDomainFilter] = useState(0);
  const [diffFilter,   setDiffFilter]   = useState('all');
  const [shuffleSeed,  setShuffleSeed]  = useState(1);
  const [phase,        setPhase]        = useState('config'); // config | studying | results
  const [index,        setIndex]        = useState(0);
  const [answers,      setAnswers]      = useState({});  // { qId: chosenOption }
  const [revealed,     setRevealed]     = useState({});  // { qId: true }
  const [marks,        setMarks]        = useState({});  // { qId: 'got' | 'review' }

  // ── Filtered & shuffled deck ────────────────────────────────────────────────
  const deck = useMemo(() => {
    let pool = ALL_QUESTIONS;
    if (domainFilter !== 0) pool = pool.filter(q => q.domain === domainFilter);
    if (diffFilter !== 'all') pool = pool.filter(q => q.difficulty === diffFilter);
    return shuffle(pool, shuffleSeed);
  }, [domainFilter, diffFilter, shuffleSeed]);

  const q        = deck[index];
  const picked   = answers[q?.id];
  const isRevealed = revealed[q?.id];
  const status   = marks[q?.id];

  const startSession = useCallback(() => {
    setIndex(0);
    setAnswers({});
    setRevealed({});
    setMarks({});
    setPhase('studying');
  }, []);

  const handlePick = useCallback((opt) => {
    setAnswers(a => ({ ...a, [q.id]: opt }));
  }, [q]);

  const handleReveal = useCallback(() => {
    setRevealed(r => ({ ...r, [q.id]: true }));
  }, [q]);

  const handleMark = useCallback((val) => {
    setMarks(m => ({ ...m, [q.id]: val }));
  }, [q]);

  const goNext = () => {
    if (index + 1 >= deck.length) {
      setPhase('results');
    } else {
      setIndex(i => i + 1);
    }
  };

  const goPrev = () => {
    if (index > 0) setIndex(i => i - 1);
  };

  const handleReviewOnly = () => {
    const reviewIds = new Set(Object.entries(marks).filter(([, v]) => v === 'review').map(([k]) => k));
    // Reset state for review-only mode
    setAnswers({});
    setRevealed({});
    setMarks({});
    setIndex(0);
    setShuffleSeed(s => s + 1);
    setDomainFilter(0);
    setDiffFilter('all');
    setPhase('config');
  };

  const handleRestart = () => {
    setShuffleSeed(s => s + 1);
    setDomainFilter(0);
    setDiffFilter('all');
    setPhase('config');
  };

  // ── Config screen ───────────────────────────────────────────────────────────
  if (phase === 'config') {
    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="bg-slate-800 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-cyan-500 p-2 rounded-xl">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold">Study Session</h2>
              <p className="text-slate-400 text-xs">No timer · Immediate feedback · Concept review</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-5 text-center">
            {[
              { label: ALL_QUESTIONS.length.toString(), sub: 'total questions' },
              { label: 'Instant', sub: 'answer reveal' },
              { label: 'Self-mark', sub: 'got it / review' },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-xl p-3">
                <p className="text-white font-extrabold text-lg">{s.label}</p>
                <p className="text-slate-400 text-[10px] font-medium">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        <FilterBar
          domainFilter={domainFilter} setDomainFilter={setDomainFilter}
          diffFilter={diffFilter}     setDiffFilter={setDiffFilter}
          total={deck.length}
        />

        {deck.length === 0 ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center text-sm text-red-600 font-medium">
            No questions match these filters. Try a wider selection.
          </div>
        ) : (
          <button onClick={startSession}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-4 rounded-2xl text-base transition-colors flex items-center justify-center gap-2">
            <BookOpen className="w-5 h-5" /> Start Session — {deck.length} questions
          </button>
        )}

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-xs text-slate-500 space-y-1">
          <p className="font-bold text-slate-700 mb-2">How Study Session works</p>
          {[
            'Read the question, pick an answer, then click "Reveal Answer".',
            'The correct answer is highlighted and a full explanation is shown.',
            'Mark each question "Got it" or "Review again" to track weak areas.',
            'Skip a question by clicking "Skip — reveal answer" without picking.',
            'After finishing, review your score by domain and re-drill marked questions.',
          ].map((t, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="w-4 h-4 bg-cyan-100 text-cyan-700 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
              {t}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Results screen ──────────────────────────────────────────────────────────
  if (phase === 'results') {
    return (
      <div className="max-w-2xl mx-auto">
        <ResultsScreen
          deck={deck}
          answers={answers}
          marks={marks}
          onRestart={handleRestart}
          onReviewOnly={handleReviewOnly}
        />
      </div>
    );
  }

  // ── Studying screen ─────────────────────────────────────────────────────────
  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Top bar */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 flex items-center gap-3">
        <button onClick={() => setPhase('config')}
          className="text-slate-400 hover:text-slate-600 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
            <span>Q {index + 1} / {deck.length}</span>
            <span className="text-emerald-600">{Object.values(marks).filter(v => v === 'got').length} got · {Object.values(marks).filter(v => v === 'review').length} to review</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5">
            <div className="bg-cyan-500 h-1.5 rounded-full transition-all"
              style={{ width: `${((index + 1) / deck.length) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Question */}
      <QuestionCard
        q={q}
        picked={picked}
        revealed={isRevealed}
        onPick={handlePick}
        onReveal={handleReveal}
        onMark={handleMark}
        status={status}
        index={index}
        total={deck.length}
      />

      {/* Navigation */}
      {isRevealed && (
        <div className="flex items-center gap-3">
          <button onClick={goPrev} disabled={index === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:border-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>

          {index + 1 < deck.length ? (
            <button onClick={goNext}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 rounded-xl text-sm font-bold text-white transition-colors">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={goNext}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-sm font-bold text-white transition-colors">
              <Award className="w-4 h-4" /> Finish Session
            </button>
          )}
        </div>
      )}

      {/* Question navigator */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Question Navigator</p>
        <div className="flex flex-wrap gap-1.5">
          {deck.map((qq, i) => (
            <button key={qq.id} onClick={() => setIndex(i)}
              className={`w-7 h-7 rounded-lg text-[10px] font-bold border transition-all ${
                i === index
                  ? 'bg-cyan-600 border-cyan-600 text-white'
                  : marks[qq.id] === 'got'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : marks[qq.id] === 'review'
                  ? 'bg-amber-100 border-amber-300 text-amber-700'
                  : revealed[qq.id]
                  ? 'bg-slate-100 border-slate-300 text-slate-500'
                  : 'bg-white border-slate-200 text-slate-400 hover:border-slate-400'
              }`}>
              {i + 1}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 mt-3">
          {[
            { cls: 'bg-cyan-600 border-cyan-600 text-white',              label: 'Current' },
            { cls: 'bg-emerald-50 border-emerald-300 text-emerald-700',  label: 'Got it' },
            { cls: 'bg-amber-100 border-amber-300 text-amber-700',        label: 'Review' },
            { cls: 'bg-slate-100 border-slate-300 text-slate-500',        label: 'Revealed' },
            { cls: 'bg-white border-slate-200 text-slate-400',            label: 'Unseen' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <div className={`w-4 h-4 rounded border ${s.cls}`} />
              {s.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudySession;
