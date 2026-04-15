import React, { useState } from 'react';
import {
  Layers, Shield, Upload, Zap, Share2,
  ChevronRight, Star, BookOpen, CheckCircle, ClipboardList,
  CreditCard, GraduationCap, AlertTriangle,
} from 'lucide-react';

import Domain1 from './domains/Domain1_Architecture.jsx';
import Domain2 from './domains/Domain2_Governance.jsx';
import Domain3 from './domains/Domain3_DataLoading.jsx';
import Domain4 from './domains/Domain4_Performance.jsx';
import Domain5 from './domains/Domain5_Collaboration.jsx';
import ExamPrep     from './exam-prep/ExamPrep.jsx';
import FlashCards   from './exam-prep/FlashCards.jsx';
import QuickQuiz    from './exam-prep/QuickQuiz.jsx';
import StudySession    from './exam-prep/StudySession.jsx';
import TrapsAndGotchas from './exam-prep/TrapsAndGotchas.jsx';

// ─── Domain registry ──────────────────────────────────────────────────────────
const DOMAINS = [
  {
    id: 'd1',
    number: '1.0',
    weight: '31%',
    label: 'Snowflake AI Data Cloud Features & Architecture',
    shortLabel: 'Architecture',
    icon: Layers,
    color: { bg: 'bg-blue-700', light: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-800' },
    topics: [
      '1.1 Architecture layers & editions',
      '1.2 Interfaces & tools (Snowsight, CLI, VS Code)',
      '1.3 Object hierarchy (org, account, DB, schema, objects)',
      '1.4 Virtual warehouses (types, scaling, best practices)',
      '1.5 Storage concepts (micro-partitions, table & view types)',
      '1.6 AI/ML features (Snowpark, Notebooks, SiS, Cortex, ML)',
    ],
    component: Domain1,
  },
  {
    id: 'd2',
    number: '2.0',
    weight: '20%',
    label: 'Account Management & Data Governance',
    shortLabel: 'Governance',
    icon: Shield,
    color: { bg: 'bg-violet-700', light: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', badge: 'bg-violet-100 text-violet-800' },
    topics: [
      '2.1 Security model (RBAC, DAC, network policies)',
      '2.1 Authentication (MFA, SSO, OAuth, key-pair)',
      '2.1 System-defined & custom roles, secondary roles',
      '2.2 Data masking (column-level & row-level security)',
      '2.2 Object tagging, Trust Center, encryption, replication',
      '2.3 Resource monitors, credit usage, ACCOUNT_USAGE',
    ],
    component: Domain2,
  },
  {
    id: 'd3',
    number: '3.0',
    weight: '18%',
    label: 'Data Loading, Unloading & Connectivity',
    shortLabel: 'Data Loading',
    icon: Upload,
    color: { bg: 'bg-teal-700', light: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', badge: 'bg-teal-100 text-teal-800' },
    topics: [
      '3.1 File formats & stage types (internal/external)',
      '3.1 COPY INTO command & error handling',
      '3.2 Snowpipe & Snowpipe Streaming',
      '3.2 Streams, Tasks & Dynamic Tables',
      '3.3 Snowflake drivers & connectors',
      '3.3 Storage, API & Git integrations',
    ],
    component: Domain3,
  },
  {
    id: 'd4',
    number: '4.0',
    weight: '21%',
    label: 'Performance Optimization, Querying & Transformation',
    shortLabel: 'Performance',
    icon: Zap,
    color: { bg: 'bg-amber-600', light: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-800' },
    topics: [
      '4.1 Query Profile & insights (spill, pruning, joins, queuing)',
      '4.1 ACCOUNT_USAGE views & workload management',
      '4.2 Query Acceleration & Search Optimization services',
      '4.2 Clustering keys & materialized views',
      '4.3 Caching (result / metadata / warehouse)',
      '4.4 Transformation (structured, semi-structured, window fns)',
    ],
    component: Domain4,
  },
  {
    id: 'd5',
    number: '5.0',
    weight: '10%',
    label: 'Data Collaboration',
    shortLabel: 'Collaboration',
    icon: Share2,
    color: { bg: 'bg-rose-700', light: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', badge: 'bg-rose-100 text-rose-800' },
    topics: [
      '5.1 Time Travel (AT/BEFORE syntax, retention by edition)',
      '5.1 Fail-safe, Zero-copy Cloning & table type comparison',
      '5.1 Data replication & failover groups (BCDR)',
      '5.2 Provider, Consumer & Reader accounts',
      '5.2 Secure Data Sharing, resharing & data clean rooms',
      '5.3 Marketplace listings (public/private) & Native Apps',
    ],
    component: Domain5,
  },
];

// ─── Landing page card ────────────────────────────────────────────────────────
const DomainCard = ({ domain, onEnter }) => {
  const Icon = domain.icon;
  const c = domain.color;

  return (
    <div
      className={`bg-white rounded-2xl border ${c.border} shadow-sm hover:shadow-md transition-all cursor-pointer group`}
      onClick={() => onEnter(domain.id)}
    >
      <div className={`${c.bg} rounded-t-2xl p-5 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-white/70 text-xs font-semibold tracking-widest uppercase">Domain {domain.number}</p>
            <p className="text-white font-bold text-base leading-tight">{domain.shortLabel}</p>
          </div>
        </div>
        <span className="bg-white/20 text-white text-sm font-bold px-3 py-1 rounded-full">
          {domain.weight}
        </span>
      </div>

      <div className="p-5">
        <p className="text-slate-500 text-xs mb-4 leading-relaxed">{domain.label}</p>
        <ul className="space-y-1.5 mb-5">
          {domain.topics.map(t => (
            <li key={t} className="flex items-center gap-2 text-xs text-slate-600">
              <div className={`w-1.5 h-1.5 rounded-full ${c.bg} flex-shrink-0`}></div>
              {t}
            </li>
          ))}
        </ul>
        <button
          className={`w-full flex items-center justify-center gap-2 ${c.bg} hover:opacity-90 text-white font-semibold text-sm py-2.5 rounded-xl transition-opacity group-hover:gap-3`}
        >
          Study this domain <ChevronRight className="w-4 h-4 transition-all" />
        </button>
      </div>
    </div>
  );
};

// ─── Weight bar ───────────────────────────────────────────────────────────────
const WeightBar = () => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-8">
    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Exam Domain Weightings</p>
    <div className="flex rounded-full overflow-hidden h-5">
      {DOMAINS.map(d => (
        <div
          key={d.id}
          className={`${d.color.bg} flex items-center justify-center`}
          style={{ width: d.weight }}
          title={`${d.shortLabel}: ${d.weight}`}
        >
          <span className="text-white text-[9px] font-bold hidden sm:block">{d.weight}</span>
        </div>
      ))}
    </div>
    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
      {DOMAINS.map(d => (
        <div key={d.id} className="flex items-center gap-1.5 text-xs text-slate-600">
          <div className={`w-2.5 h-2.5 rounded-sm ${d.color.bg}`}></div>
          <span>{d.shortLabel} {d.weight}</span>
        </div>
      ))}
    </div>
  </div>
);

// ─── Root App ─────────────────────────────────────────────────────────────────
const App = () => {
  const [activeDomain,      setActiveDomain]      = useState(null);
  const [showExamPrep,      setShowExamPrep]      = useState(false);
  const [showFlashCards,    setShowFlashCards]    = useState(false);
  const [showQuickQuiz,     setShowQuickQuiz]     = useState(false);
  const [showStudySession,  setShowStudySession]  = useState(false);
  const [showTraps,         setShowTraps]         = useState(false);

  // ── Quick Study sub-views ──────────────────────────────────────────────────
  const quickStudyView = showFlashCards ? 'flashcards'
    : showQuickQuiz    ? 'quickquiz'
    : showStudySession ? 'studysession'
    : showTraps        ? 'traps'
    : null;

  if (quickStudyView) {
    const isFlash   = quickStudyView === 'flashcards';
    const isStudy   = quickStudyView === 'studysession';
    const isTraps   = quickStudyView === 'traps';
    const headerBg  = isFlash ? 'bg-cyan-700' : isStudy ? 'bg-emerald-700' : isTraps ? 'bg-slate-900' : 'bg-slate-700';
    const iconBg    = isFlash ? 'bg-cyan-500'  : isStudy ? 'bg-emerald-500'  : isTraps ? 'bg-red-500'   : 'bg-slate-500';
    const title     = isFlash ? 'Flashcards'   : isStudy ? 'Study Session'   : isTraps ? 'Traps & Gotchas' : 'Quick Quiz';

    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12">
        <header className={`${headerBg} text-white p-4 sm:p-6 shadow-md`}>
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`${iconBg} p-2 rounded-xl`}>
                {isFlash  ? <CreditCard className="w-5 h-5 text-white" />
                : isStudy ? <GraduationCap className="w-5 h-5 text-white" />
                : isTraps ? <AlertTriangle className="w-5 h-5 text-white" />
                : <Zap className="w-5 h-5 text-white" />}
              </div>
              <div>
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">COF-C03 · Study Tools</p>
                <h1 className="text-xl font-bold">{title}</h1>
              </div>
            </div>
            <button
              onClick={() => { setShowFlashCards(false); setShowQuickQuiz(false); setShowStudySession(false); setShowTraps(false); }}
              className="bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              ← Home
            </button>
          </div>
        </header>
        <main className="max-w-3xl mx-auto mt-6 px-4">
          {isFlash ? <FlashCards /> : isStudy ? <StudySession /> : isTraps ? <TrapsAndGotchas /> : <QuickQuiz />}
        </main>
      </div>
    );
  }

  // ── Exam Prep view ─────────────────────────────────────────────────────────
  if (showExamPrep) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12">
        <header className="bg-slate-800 text-white p-4 sm:p-6 shadow-md">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-cyan-500 p-2 rounded-xl">
                <ClipboardList className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">COF-C03 · Practice</p>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Exam Prep</h1>
              </div>
            </div>
            <button
              onClick={() => setShowExamPrep(false)}
              className="bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
            >
              ← Home
            </button>
          </div>
        </header>
        <main className="max-w-5xl mx-auto mt-6 px-4">
          <ExamPrep />
        </main>
      </div>
    );
  }

  // ── Domain view ────────────────────────────────────────────────────────────
  const domain = DOMAINS.find(d => d.id === activeDomain);

  if (activeDomain && domain) {
    const DomainComponent = domain.component;
    const c = domain.color;
    const Icon = domain.icon;

    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12">
        <header className={`${c.bg} text-white p-4 sm:p-6 shadow-md`}>
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon className="w-8 h-8 text-white/70 flex-shrink-0" />
              <div>
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Domain {domain.number} · {domain.weight} of exam</p>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{domain.shortLabel}</h1>
              </div>
            </div>
            <button
              onClick={() => setActiveDomain(null)}
              className="bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
            >
              ← All Domains
            </button>
          </div>
        </header>

        <main className="max-w-5xl mx-auto mt-6 px-4">
          <DomainComponent />
        </main>
      </div>
    );
  }

  // ── Home page ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      <header className="bg-slate-900 text-white p-5 sm:p-8 shadow-lg">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-cyan-500 p-2.5 rounded-xl">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">SnowPro Core Study App</h1>
              <p className="text-slate-400 text-sm font-medium">COF-C03 · Interactive Deep-Dive Guide</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <span className="bg-slate-800 text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Star className="w-3 h-3 text-yellow-400" /> $175 exam · 115 min · ~100 questions
            </span>
            <span className="bg-slate-800 text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <CheckCircle className="w-3 h-3 text-emerald-400" /> 5 official domains
            </span>
            <span className="bg-slate-800 text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-full">
              Launched Feb 16, 2026
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto mt-8 px-4">
        <WeightBar />

        <h2 className="text-lg font-bold text-slate-700 mb-4">Choose a Domain to Study</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {DOMAINS.map(d => (
            <DomainCard key={d.id} domain={d} onEnter={setActiveDomain} />
          ))}
        </div>

        {/* Practice & Assessment section */}
        <h2 className="text-lg font-bold text-slate-700 mb-4">Practice & Assessment</h2>

        {/* Quick Study row */}
        <div className="grid sm:grid-cols-3 gap-4 mb-4">

          {/* Flashcards card */}
          <div
            className="bg-cyan-700 rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer group overflow-hidden"
            onClick={() => setShowFlashCards(true)}
          >
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white/20 p-2.5 rounded-xl flex-shrink-0">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-extrabold text-base leading-tight">Flashcards</h3>
                  <p className="text-cyan-200 text-xs">Key concepts · flip to reveal</p>
                </div>
              </div>
              <p className="text-cyan-100 text-xs mb-4 leading-relaxed">
                106 curated cards covering key facts and exam traps across all 5 domains. Filter by domain, mark what you know.
              </p>
              <div className="flex items-center gap-2 text-white text-xs font-bold group-hover:gap-3 transition-all">
                Open deck <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Study Session card */}
          <div
            className="bg-emerald-700 rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer group overflow-hidden"
            onClick={() => setShowStudySession(true)}
          >
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white/20 p-2.5 rounded-xl flex-shrink-0">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-extrabold text-base leading-tight">Study Session</h3>
                  <p className="text-emerald-200 text-xs">No timer · instant feedback</p>
                </div>
              </div>
              <p className="text-emerald-100 text-xs mb-4 leading-relaxed">
                Review concepts at your own pace. Filter by domain & difficulty, reveal answers immediately, mark what you know.
              </p>
              <div className="flex items-center gap-2 text-white text-xs font-bold group-hover:gap-3 transition-all">
                Start reviewing <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Quick Quiz card */}
          <div
            className="bg-slate-700 rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer group overflow-hidden"
            onClick={() => setShowQuickQuiz(true)}
          >
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white/20 p-2.5 rounded-xl flex-shrink-0">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-extrabold text-base leading-tight">Quick Quiz</h3>
                  <p className="text-slate-300 text-xs">10 questions · refreshes daily</p>
                </div>
              </div>
              <p className="text-slate-300 text-xs mb-4 leading-relaxed">
                A fresh set of 10 questions every day, drawn from all exam day pools. Same questions all day, new set tomorrow.
              </p>
              <div className="flex items-center gap-2 text-white text-xs font-bold group-hover:gap-3 transition-all">
                Start quiz <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Exam Prep card */}
        <div
          className="bg-slate-800 rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer group overflow-hidden mb-4"
          onClick={() => setShowTraps(true)}
        >
          <div className="p-5 sm:flex items-center gap-5">
            <div className="bg-red-500 p-3 rounded-2xl flex-shrink-0 mb-3 sm:mb-0 w-fit">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="text-white text-base font-extrabold">Traps & Gotchas</h3>
                <span className="bg-red-500/20 text-red-300 text-xs font-bold px-2.5 py-1 rounded-full">Reference Guide</span>
              </div>
              <p className="text-slate-300 text-xs mb-2">
                10 trap categories + 5 high-miss patterns. What sounds right but isn't — misleading names, lookalike functions, policy bypasses, fake functions, exact numbers.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Misleading names', 'Fake functions', 'Privilege matrix', 'Sharing edge cases', 'Exact numbers'].map(b => (
                  <span key={b} className="bg-white/10 text-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded-full">{b}</span>
                ))}
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-red-400 font-bold text-sm group-hover:gap-3 transition-all flex-shrink-0">
              Study <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Exam Prep card */}
        <div
          className="bg-slate-800 rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer group overflow-hidden"
          onClick={() => setShowExamPrep(true)}
        >
          <div className="p-6 sm:flex items-center gap-6">
            <div className="bg-cyan-500 p-4 rounded-2xl flex-shrink-0 mb-4 sm:mb-0 w-fit">
              <ClipboardList className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="text-white text-xl font-extrabold">Exam Prep</h3>
                <span className="bg-cyan-500/20 text-cyan-300 text-xs font-bold px-2.5 py-1 rounded-full">Daily Mocks</span>
              </div>
              <p className="text-slate-300 text-sm mb-3">
                60-question timed mock exams following the real COF-C03 domain distribution.
                A new set every day — max 30% overlap from the previous session.
              </p>
              <div className="flex flex-wrap gap-3">
                {['60 questions/day', '115 min clock', 'Real distribution', 'Full review & explanations'].map(b => (
                  <span key={b} className="bg-white/10 text-slate-300 text-[10px] font-semibold px-2.5 py-1 rounded-full">{b}</span>
                ))}
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-cyan-400 font-bold text-sm group-hover:gap-3 transition-all flex-shrink-0">
              Open <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
