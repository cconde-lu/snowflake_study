import React, { useState, useCallback, useMemo } from 'react';
import { CheckCircle, XCircle, ChevronRight, ChevronLeft, RefreshCw, Zap, Award } from 'lucide-react';
import { ALL_QUESTIONS } from './question-registry.js';

const DOMAIN_COLORS = {
  1: { bg: 'bg-blue-600',   badge: 'bg-blue-100 text-blue-800'     },
  2: { bg: 'bg-violet-600', badge: 'bg-violet-100 text-violet-800'  },
  3: { bg: 'bg-teal-600',   badge: 'bg-teal-100 text-teal-800'     },
  4: { bg: 'bg-amber-600',  badge: 'bg-amber-100 text-amber-800'   },
  5: { bg: 'bg-rose-600',   badge: 'bg-rose-100 text-rose-800'     },
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

// Deterministic shuffle seeded by a string (e.g. today's date)
const seededShuffle = (arr, seedStr) => {
  let seed = [...seedStr].reduce((a, c) => a + c.charCodeAt(0), 0);
  const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 0xFFFFFFFF; };
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

const getDailyQuestions = (count = 10) => {
  const dateStr = new Date().toISOString().slice(0, 10);
  return seededShuffle(ALL_QUESTIONS, dateStr).slice(0, count);
};

const QUESTIONS_PER_DAY = 10;

const QuickQuiz = () => {
  const questions = useMemo(() => getDailyQuestions(QUESTIONS_PER_DAY), []);

  const [phase,   setPhase]   = useState('ready');   // ready | running | review
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});        // { questionId: chosenOption }
  const [history, setHistory] = useState([]);
  const [score,   setScore]   = useState(0);
  const [done,    setDone]    = useState(false);

  const q = questions[current];
  const picked = answers[q?.id];
  const isCorrect = picked === q?.answer;
  const totalAnswered = Object.keys(answers).length;
  const pct = Math.round((score / QUESTIONS_PER_DAY) * 100);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  const handlePick = useCallback((opt) => {
    if (picked || phase !== 'running') return;
    const correct = opt === q.answer;
    setAnswers(a => ({ ...a, [q.id]: opt }));
    if (correct) setScore(s => s + 1);
    setHistory(h => [...h, { ...q, picked: opt, correct }]);
  }, [picked, q, phase]);

  const next = () => {
    if (current + 1 >= QUESTIONS_PER_DAY) setDone(true);
    else setCurrent(c => c + 1);
  };

  const reset = () => {
    setCurrent(0); setAnswers({}); setHistory([]);
    setScore(0); setDone(false); setPhase('ready');
  };

  // ── Ready screen ────────────────────────────────────────────────────────────
  if (phase === 'ready') return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="bg-slate-800 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-cyan-500 p-2 rounded-xl">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold">Quick Quiz</h2>
            <p className="text-slate-400 text-xs">{today} · Refreshes daily</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { v: QUESTIONS_PER_DAY, l: 'Questions' },
            { v: 'All domains', l: 'Coverage' },
            { v: '~5 min', l: 'Est. time' },
          ].map(s => (
            <div key={s.l} className="bg-white/10 rounded-xl p-3">
              <p className="text-white font-extrabold text-base">{s.v}</p>
              <p className="text-slate-400 text-[10px]">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Today's questions preview</p>
        <div className="space-y-2">
          {questions.map((q, i) => (
            <div key={q.id} className="flex items-center gap-2.5 text-xs text-slate-600">
              <span className="w-5 h-5 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                {i + 1}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${DOMAIN_COLORS[q.domain].badge}`}>
                D{q.domain}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${DIFFICULTY_COLORS[q.difficulty]}`}>
                {q.difficulty}
              </span>
              <span className="truncate">{q.topic}</span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => setPhase('running')}
        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-4 rounded-2xl text-base transition-colors flex items-center justify-center gap-2">
        <Zap className="w-5 h-5" /> Start Quick Quiz
      </button>
    </div>
  );

  // ── Done / Review screen ────────────────────────────────────────────────────
  if (done) return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className={`rounded-2xl p-6 text-white ${pct >= 80 ? 'bg-emerald-600' : pct >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}>
        <div className="flex items-center gap-3 mb-4">
          <Award className="w-8 h-8 text-white/80" />
          <div>
            <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">Quick Quiz · {today}</p>
            <h2 className="text-2xl font-extrabold">
              {pct >= 80 ? '🎉 Great job!' : pct >= 60 ? '👍 Getting there!' : '📚 Keep studying'}
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-white/20 rounded-xl p-3">
            <p className="text-white font-extrabold text-2xl">{pct}%</p>
            <p className="text-white/70 text-[10px]">Score</p>
          </div>
          <div className="bg-white/20 rounded-xl p-3">
            <p className="text-white font-extrabold text-2xl">{score}/{QUESTIONS_PER_DAY}</p>
            <p className="text-white/70 text-[10px]">Correct</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Review</p>
        <div className="space-y-3">
          {history.map((h, i) => (
            <div key={h.id} className={`rounded-xl border p-3 text-xs ${h.correct ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-start gap-2">
                {h.correct
                  ? <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  : <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-1 mb-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${DOMAIN_COLORS[h.domain].badge}`}>
                      D{h.domain}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${DIFFICULTY_COLORS[h.difficulty]}`}>
                      {h.difficulty}
                    </span>
                  </div>
                  <p className="font-medium text-slate-700 mb-1">{i + 1}. {h.q}</p>
                  {!h.correct && (
                    <p className="text-red-600 mb-0.5">✗ You picked: {h.picked}</p>
                  )}
                  <p className={`font-semibold ${h.correct ? 'text-emerald-700' : 'text-red-700'}`}>
                    ✓ {h.answer}
                  </p>
                  <p className="text-slate-500 italic mt-1">{h.exp}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={reset}
        className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-slate-400 text-slate-700 font-bold py-3 rounded-2xl text-sm transition-all">
        <RefreshCw className="w-4 h-4" /> Redo Today's Quiz
      </button>
    </div>
  );

  // ── Running screen ──────────────────────────────────────────────────────────
  return (
    <div className="space-y-4 max-w-xl mx-auto">
      {/* Progress */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 flex items-center gap-3">
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
          <span className="text-sm font-bold text-slate-700">Q {current + 1}/{QUESTIONS_PER_DAY}</span>
        </div>
        <div className="flex-1">
          <div className="w-full bg-slate-100 rounded-full h-1.5">
            <div className="bg-cyan-500 h-1.5 rounded-full transition-all"
              style={{ width: `${((current) / QUESTIONS_PER_DAY) * 100}%` }} />
          </div>
        </div>
        <span className="text-xs font-semibold text-cyan-600 flex-shrink-0">+{score} correct</span>
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
          <span className="text-[10px] text-slate-400 ml-auto">{q.topic}</span>
        </div>

        <p className="text-base font-semibold text-slate-800 leading-relaxed mb-5">{q.q}</p>

        <div className="space-y-2">
          {q.options.map(opt => {
            const isPicked  = picked === opt;
            const isAnswer  = opt === q.answer;
            let cls = 'border-slate-200 bg-white hover:border-cyan-300 hover:bg-cyan-50/50 text-slate-700';
            if (picked) {
              if (isAnswer)      cls = 'border-emerald-400 bg-emerald-50 text-emerald-800 font-bold';
              else if (isPicked) cls = 'border-red-300 bg-red-50 text-red-700 opacity-80';
              else               cls = 'border-slate-100 bg-slate-50 text-slate-300 opacity-40';
            }
            return (
              <button key={opt} disabled={!!picked} onClick={() => handlePick(opt)}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all flex items-center gap-3 ${cls}`}>
                <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                  isPicked && !picked ? 'border-cyan-500 bg-cyan-500'
                  : picked && isAnswer ? 'border-emerald-500 bg-emerald-500'
                  : 'border-slate-300'
                }`}>
                  {((isPicked && !picked) || (picked && isAnswer)) && (
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                  )}
                </span>
                <span className="flex-1">{opt}</span>
                {picked && isAnswer  && <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                {picked && isPicked && !isAnswer && <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        {picked && (
          <div className={`mt-4 p-4 rounded-xl border ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
            <p className={`text-sm font-bold mb-1 ${isCorrect ? 'text-emerald-800' : 'text-red-800'}`}>
              {isCorrect ? '✓ Correct!' : `✗ Answer: "${q.answer}"`}
            </p>
            <p className={`text-sm ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>{q.exp}</p>
            <button onClick={next}
              className="mt-3 w-full bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
              {current + 1 < QUESTIONS_PER_DAY ? <>Next <ChevronRight className="w-4 h-4" /></> : <>See Results <Award className="w-4 h-4" /></>}
            </button>
          </div>
        )}
      </div>

      {/* Dot navigation */}
      <div className="flex justify-center gap-2">
        {questions.map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full transition-all ${
            i < current ? (answers[questions[i].id] === questions[i].answer ? 'bg-emerald-400' : 'bg-red-400')
            : i === current ? 'bg-cyan-500 w-4'
            : 'bg-slate-200'
          }`} />
        ))}
      </div>
    </div>
  );
};

export default QuickQuiz;
