import React, { useState, useCallback } from 'react';
import {
  ClipboardList, ChevronRight, RefreshCw, CheckCircle, XCircle,
  Clock, BarChart2, BookOpen, ChevronLeft, Award,
} from 'lucide-react';

import { ALL_DAYS } from './question-registry.js';

// ── Helpers ───────────────────────────────────────────────────────────────────
const DOMAIN_COLORS = {
  1: { bg: 'bg-blue-600',   light: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-700',   badge: 'bg-blue-100 text-blue-800'   },
  2: { bg: 'bg-violet-600', light: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', badge: 'bg-violet-100 text-violet-800' },
  3: { bg: 'bg-teal-600',   light: 'bg-teal-50',   border: 'border-teal-200',   text: 'text-teal-700',   badge: 'bg-teal-100 text-teal-800'   },
  4: { bg: 'bg-amber-600',  light: 'bg-amber-50',  border: 'border-amber-200',  text: 'text-amber-700',  badge: 'bg-amber-100 text-amber-800'  },
  5: { bg: 'bg-rose-600',   light: 'bg-rose-50',   border: 'border-rose-200',   text: 'text-rose-700',   badge: 'bg-rose-100 text-rose-800'    },
};

const DOMAIN_LABELS = {
  1: 'Architecture',
  2: 'Governance',
  3: 'Data Loading',
  4: 'Performance',
  5: 'Collaboration',
};

const DIFFICULTY_COLORS = {
  easy:   'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100 text-amber-700',
  hard:   'bg-red-100 text-red-700',
};

// ── Multi-select helpers ──────────────────────────────────────────────────────
const isCorrect = (q, userAnswer) => {
  if (q.multi) {
    if (!Array.isArray(userAnswer) || !Array.isArray(q.answers)) return false;
    const a = [...userAnswer].sort();
    const e = [...q.answers].sort();
    return a.length === e.length && a.every((v, i) => v === e[i]);
  }
  return userAnswer === q.answer;
};

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

// ── Timer hook ────────────────────────────────────────────────────────────────
const useExamTimer = (totalSeconds, onExpire) => {
  const [seconds, setSeconds] = useState(totalSeconds);
  const [running, setRunning] = useState(false);
  const intervalRef = React.useRef(null);

  const start = useCallback(() => {
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          onExpire();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }, [onExpire]);

  const stop = useCallback(() => {
    clearInterval(intervalRef.current);
    setRunning(false);
  }, []);

  React.useEffect(() => () => clearInterval(intervalRef.current), []);

  return { seconds, running, start, stop };
};

// ── Day selector (landing) ────────────────────────────────────────────────────
const DaySelector = ({ onSelect }) => (
  <div className="space-y-4">
    <div className="bg-slate-800 rounded-2xl p-6 text-white">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-cyan-500 p-2 rounded-xl">
          <ClipboardList className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold">Exam Prep — Daily Mocks</h2>
          <p className="text-slate-400 text-xs">COF-C03 · 60 questions · 115 min · real distribution</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-5 text-center">
        {[
          { label: '60', sub: 'questions/day' },
          { label: '115 min', sub: 'exam clock' },
          { label: '≈80%', sub: 'passing score' },
        ].map(s => (
          <div key={s.label} className="bg-white/10 rounded-xl p-3">
            <p className="text-white font-extrabold text-lg">{s.label}</p>
            <p className="text-slate-400 text-[10px] font-medium">{s.sub}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Exam distribution reference */}
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Exam Distribution (COF-C03)</p>
      <div className="flex rounded-full overflow-hidden h-4 mb-3">
        {[
          { d: 1, w: 31, label: 'D1' },
          { d: 2, w: 20, label: 'D2' },
          { d: 3, w: 18, label: 'D3' },
          { d: 4, w: 21, label: 'D4' },
          { d: 5, w: 10, label: 'D5' },
        ].map(seg => (
          <div key={seg.d} className={`${DOMAIN_COLORS[seg.d].bg} flex items-center justify-center`}
            style={{ width: `${seg.w}%` }} title={`Domain ${seg.d}: ${seg.w}%`}>
            <span className="text-white text-[9px] font-bold hidden sm:block">{seg.w}%</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {[
          { d: 1, w: '31%', label: 'Architecture', q: 19 },
          { d: 2, w: '20%', label: 'Governance', q: 12 },
          { d: 3, w: '18%', label: 'Data Loading', q: 11 },
          { d: 4, w: '21%', label: 'Performance', q: 13 },
          { d: 5, w: '10%', label: 'Collaboration', q: 5 },
        ].map(s => (
          <div key={s.d} className="flex items-center gap-1.5 text-xs text-slate-600">
            <div className={`w-2.5 h-2.5 rounded-sm ${DOMAIN_COLORS[s.d].bg}`}></div>
            <span>D{s.d} {s.label} — {s.w} ({s.q}q)</span>
          </div>
        ))}
      </div>
    </div>

    {/* Day cards */}
    <h3 className="text-sm font-bold text-slate-700">Available Mock Exams</h3>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {ALL_DAYS.map((day, i) => (
        <button key={i} onClick={() => onSelect(i)}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-cyan-300 transition-all text-left p-5 group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-extrabold text-slate-800">Day {day.meta.day}</span>
            <span className="bg-cyan-100 text-cyan-700 text-[10px] font-bold px-2 py-1 rounded-full">
              {day.meta.date}
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-600 mb-1">{day.meta.label}</p>
          <p className="text-xs text-slate-400 mb-4">{day.meta.totalQuestions} questions · {day.meta.timeMinutes} min</p>
          <div className="flex items-center gap-2 text-cyan-600 text-xs font-bold group-hover:gap-3 transition-all">
            Start Exam <ChevronRight className="w-4 h-4" />
          </div>
        </button>
      ))}

      {/* Placeholder for future days */}
      <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-5 flex flex-col items-center justify-center text-center min-h-[140px]">
        <p className="text-slate-300 text-3xl mb-2">+</p>
        <p className="text-slate-400 text-xs font-medium">Next day coming soon</p>
        <p className="text-slate-300 text-[10px] mt-1">Ask the AI to generate Day {ALL_DAYS.length + 1}</p>
      </div>
    </div>
  </div>
);

// ── Exam Engine ───────────────────────────────────────────────────────────────
const ExamEngine = ({ dayIndex, onBack }) => {
  const { meta, questions } = ALL_DAYS[dayIndex];

  const [phase, setPhase]     = useState('ready'); // ready | running | review
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});   // { questionId: chosenOption }
  const [flagged, setFlagged] = useState({});   // { questionId: true }
  const [showExp, setShowExp] = useState(false);

  const handleExpire = useCallback(() => setPhase('review'), []);
  const { seconds, start: startTimer, stop: stopTimer } = useExamTimer(
    meta.timeMinutes * 60,
    handleExpire,
  );

  const q = questions[current];
  const picked = answers[q?.id];  // string (single) or string[] (multi)
  const totalAnswered = Object.keys(answers).filter(id => {
    const a = answers[id];
    return Array.isArray(a) ? a.length > 0 : !!a;
  }).length;

  const score = questions.filter(q => isCorrect(q, answers[q.id])).length;
  const pct   = Math.round((score / questions.length) * 100);

  const byDomain = questions.reduce((acc, q) => {
    if (!acc[q.domain]) acc[q.domain] = { total: 0, correct: 0 };
    acc[q.domain].total++;
    if (isCorrect(q, answers[q.id])) acc[q.domain].correct++;
    return acc;
  }, {});

  const handleAnswer = (opt) => {
    if (phase !== 'running') return;
    if (q.multi) {
      setAnswers(a => {
        const cur = Array.isArray(a[q.id]) ? a[q.id] : [];
        if (cur.includes(opt)) {
          return { ...a, [q.id]: cur.filter(o => o !== opt) };
        }
        if (cur.length < (q.answers?.length ?? 2)) {
          return { ...a, [q.id]: [...cur, opt] };
        }
        return a; // at selection limit, ignore extra clicks
      });
    } else {
      setAnswers(a => ({ ...a, [q.id]: opt }));
    }
    setShowExp(false);
  };

  const goNext = () => { setShowExp(false); if (current + 1 < questions.length) setCurrent(c => c + 1); };
  const goPrev = () => { setShowExp(false); if (current > 0) setCurrent(c => c - 1); };
  const toggleFlag = () => setFlagged(f => ({ ...f, [q.id]: !f[q.id] }));

  const submitExam = () => { stopTimer(); setPhase('review'); };

  // ── Ready screen ────────────────────────────────────────────────────────────
  if (phase === 'ready') return (
    <div className="space-y-4">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 font-medium">
        <ChevronLeft className="w-4 h-4" /> All Days
      </button>
      <div className="bg-slate-800 rounded-2xl p-6 text-white">
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">Mock Exam · Day {meta.day}</p>
        <h2 className="text-2xl font-extrabold mb-1">{meta.label}</h2>
        <p className="text-slate-300 text-sm">{meta.date}</p>
        <div className="grid grid-cols-3 gap-3 mt-5 text-center">
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-white font-extrabold text-lg">{meta.totalQuestions}</p>
            <p className="text-slate-400 text-[10px]">Questions</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-white font-extrabold text-lg">{meta.timeMinutes} min</p>
            <p className="text-slate-400 text-[10px]">Time Limit</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-white font-extrabold text-lg">≈80%</p>
            <p className="text-slate-400 text-[10px]">Pass Target</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
        <h3 className="font-bold text-slate-700">Instructions</h3>
        {[
          'The exam clock starts when you click "Start Exam" and cannot be paused.',
          `All ${meta.totalQuestions} questions must be answered before submitting — flag uncertain answers for review.`,
          'After submitting (or when time runs out), you\'ll see your full score breakdown by domain.',
          'Most questions have one correct answer. Questions marked "Select 2" require selecting all correct options — partial credit is NOT given.',
          'Passing the real exam requires approximately 80% (scaled scoring).',
        ].map((t, i) => (
          <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
            <span className="w-5 h-5 bg-cyan-100 text-cyan-700 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
            {t}
          </div>
        ))}
      </div>
      <button onClick={() => { setPhase('running'); startTimer(); }}
        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-4 rounded-2xl text-base transition-colors flex items-center justify-center gap-2">
        <Clock className="w-5 h-5" /> Start Exam — {meta.timeMinutes} min clock begins
      </button>
    </div>
  );

  // ── Review screen ────────────────────────────────────────────────────────────
  if (phase === 'review') return (
    <div className="space-y-4">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 font-medium">
        <ChevronLeft className="w-4 h-4" /> All Days
      </button>

      {/* Score card */}
      <div className={`rounded-2xl p-6 text-white ${pct >= 80 ? 'bg-emerald-600' : pct >= 65 ? 'bg-amber-500' : 'bg-red-500'}`}>
        <div className="flex items-center gap-3 mb-4">
          <Award className="w-8 h-8 text-white/80" />
          <div>
            <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">Day {meta.day} Results</p>
            <h2 className="text-2xl font-extrabold">{pct >= 80 ? '🎉 Pass!' : pct >= 65 ? '👍 Close!' : '📚 Keep Studying'}</h2>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-white/20 rounded-xl p-3">
            <p className="text-white font-extrabold text-2xl">{pct}%</p>
            <p className="text-white/70 text-[10px]">Overall Score</p>
          </div>
          <div className="bg-white/20 rounded-xl p-3">
            <p className="text-white font-extrabold text-2xl">{score}/{questions.length}</p>
            <p className="text-white/70 text-[10px]">Correct</p>
          </div>
          <div className="bg-white/20 rounded-xl p-3">
            <p className="text-white font-extrabold text-2xl">{formatTime(meta.timeMinutes * 60 - seconds)}</p>
            <p className="text-white/70 text-[10px]">Time Used</p>
          </div>
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
                  <span className={`text-xs font-bold ${dpct >= 80 ? 'text-emerald-600' : dpct >= 65 ? 'text-amber-600' : 'text-red-500'}`}>
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

      {/* Full question review */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Full Question Review</p>
        <div className="space-y-4">
          {questions.map((q, i) => {
            const userAnswer = answers[q.id];
            const correct = isCorrect(q, userAnswer);
            const hasAnswer = Array.isArray(userAnswer) ? userAnswer.length > 0 : !!userAnswer;
            const c = DOMAIN_COLORS[q.domain];
            const correctLabel = q.multi
              ? q.answers?.join(' | ')
              : q.answer;
            const userLabel = Array.isArray(userAnswer)
              ? userAnswer.join(' | ')
              : userAnswer;
            return (
              <div key={q.id} className={`rounded-xl border p-4 text-sm ${correct ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-start gap-2 mb-2">
                  {correct
                    ? <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    : <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />}
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-1.5 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.badge}`}>D{q.domain} {DOMAIN_LABELS[q.domain]}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[q.difficulty]}`}>{q.difficulty}</span>
                      {q.multi && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">Select {q.answers?.length}</span>}
                    </div>
                    <p className="font-medium text-slate-700 mb-2">{i + 1}. {q.q}</p>
                    {!correct && hasAnswer && (
                      <p className="text-red-600 text-xs mb-1">✗ Your answer: <span className="font-semibold">{userLabel}</span></p>
                    )}
                    {!correct && !hasAnswer && (
                      <p className="text-slate-400 text-xs mb-1 italic">Not answered</p>
                    )}
                    <p className={`text-xs font-semibold mb-1 ${correct ? 'text-emerald-700' : 'text-red-700'}`}>
                      ✓ Correct: {correctLabel}
                    </p>
                    <p className="text-xs text-slate-500 italic">{q.exp}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ── Running exam ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full bg-cyan-500 animate-pulse`}></div>
          <span className="text-sm font-bold text-slate-700">Q {current + 1} / {questions.length}</span>
        </div>
        <div className="flex-1 mx-2">
          <div className="w-full bg-slate-100 rounded-full h-1.5">
            <div className="bg-cyan-500 h-1.5 rounded-full transition-all"
              style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
          </div>
        </div>
        <div className={`flex items-center gap-1.5 font-mono font-bold text-sm px-3 py-1 rounded-lg ${
          seconds < 600 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-700'
        }`}>
          <Clock className="w-3.5 h-3.5" /> {formatTime(seconds)}
        </div>
        <span className="text-xs text-slate-400 hidden sm:block">{totalAnswered}/{questions.length} answered</span>
      </div>

      {/* Question card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${DOMAIN_COLORS[q.domain].badge}`}>
            D{q.domain} · {DOMAIN_LABELS[q.domain]}
          </span>
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${DIFFICULTY_COLORS[q.difficulty]}`}>
            {q.difficulty}
          </span>
          {q.multi && (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">
              Select {q.answers?.length}
            </span>
          )}
          <span className="text-[10px] text-slate-400 font-medium ml-auto">{q.topic}</span>
          <button onClick={toggleFlag}
            className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${
              flagged[q.id] ? 'bg-amber-100 border-amber-300 text-amber-700' : 'bg-white border-slate-200 text-slate-400 hover:border-amber-300'
            }`}>
            {flagged[q.id] ? '🚩 Flagged' : '🏳 Flag'}
          </button>
        </div>

        <p className="text-base font-semibold text-slate-800 leading-relaxed mb-2">{q.q}</p>
        {q.multi && (
          <p className="text-xs text-purple-600 font-semibold mb-4">
            Choose {q.answers?.length} answers — {Array.isArray(picked) ? picked.length : 0}/{q.answers?.length} selected
          </p>
        )}
        {!q.multi && <div className="mb-3" />}

        <div className="space-y-2">
          {q.options.map(opt => {
            const isPicked = q.multi
              ? Array.isArray(picked) && picked.includes(opt)
              : picked === opt;
            return (
              <button key={opt} onClick={() => handleAnswer(opt)}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all flex items-center gap-3 ${
                  isPicked
                    ? 'border-cyan-400 bg-cyan-50 text-cyan-900 font-semibold'
                    : 'border-slate-200 bg-white hover:border-cyan-300 hover:bg-cyan-50/50 text-slate-700'
                }`}>
                {q.multi ? (
                  // Checkbox indicator for multi-select
                  <span className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center ${
                    isPicked ? 'border-cyan-500 bg-cyan-500' : 'border-slate-300'
                  }`}>
                    {isPicked && <span className="text-white text-[10px] font-black leading-none">✓</span>}
                  </span>
                ) : (
                  // Radio indicator for single-select
                  <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                    isPicked ? 'border-cyan-500 bg-cyan-500' : 'border-slate-300'
                  }`}>
                    {isPicked && <span className="w-2 h-2 bg-white rounded-full"></span>}
                  </span>
                )}
                <span className="flex-1">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation peek */}
        {(q.multi ? Array.isArray(picked) && picked.length > 0 : !!picked) && (
          <div className="mt-3">
            <button onClick={() => setShowExp(v => !v)}
              className="text-xs text-slate-400 hover:text-slate-600 underline">
              {showExp ? 'Hide' : 'Peek at'} explanation (review mode)
            </button>
            {showExp && (
              <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 italic">
                <span className="font-bold text-emerald-700 not-italic">
                  Correct: {q.multi ? q.answers?.join(' AND ') : q.answer}
                </span>
                <br />{q.exp}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3">
        <button onClick={goPrev} disabled={current === 0}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:border-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
          <ChevronLeft className="w-4 h-4" /> Prev
        </button>

        {current + 1 < questions.length ? (
          <button onClick={goNext}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 rounded-xl text-sm font-bold text-white transition-colors">
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={submitExam}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-sm font-bold text-white transition-colors">
            <CheckCircle className="w-4 h-4" /> Submit Exam
          </button>
        )}
      </div>

      {/* Question navigator grid */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Question Navigator</p>
        <div className="flex flex-wrap gap-1.5">
          {questions.map((qq, i) => (
            <button key={qq.id} onClick={() => { setShowExp(false); setCurrent(i); }}
              className={`w-7 h-7 rounded-lg text-[10px] font-bold border transition-all ${
                i === current
                  ? 'bg-cyan-600 border-cyan-600 text-white'
                  : flagged[qq.id]
                  ? 'bg-amber-100 border-amber-300 text-amber-700'
                  : (Array.isArray(answers[qq.id]) ? answers[qq.id].length > 0 : !!answers[qq.id])
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'
              }`}>
              {i + 1}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 mt-3">
          {[
            { cls: 'bg-emerald-50 border-emerald-300 text-emerald-700', label: 'Answered' },
            { cls: 'bg-amber-100 border-amber-300 text-amber-700',      label: 'Flagged' },
            { cls: 'bg-white border-slate-200 text-slate-500',           label: 'Unanswered' },
            { cls: 'bg-cyan-600 border-cyan-600 text-white',            label: 'Current' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <div className={`w-4 h-4 rounded border ${s.cls}`}></div>
              {s.label}
            </div>
          ))}
        </div>
      </div>

      {/* Submit button (bottom) */}
      <button onClick={submitExam}
        className="w-full border-2 border-dashed border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50 text-emerald-700 font-bold py-3 rounded-2xl text-sm transition-all">
        Finish & Submit ({totalAnswered}/{questions.length} answered)
      </button>
    </div>
  );
};

// ── Root ExamPrep component ────────────────────────────────────────────────────
const ExamPrep = () => {
  const [selectedDay, setSelectedDay] = useState(null);

  if (selectedDay !== null) {
    return <ExamEngine dayIndex={selectedDay} onBack={() => setSelectedDay(null)} />;
  }

  return <DaySelector onSelect={setSelectedDay} />;
};

export default ExamPrep;
