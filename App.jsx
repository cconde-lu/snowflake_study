import React, { useState } from 'react';
import {
  Layers, Shield, Upload, Zap, Share2,
  ChevronRight, Star, BookOpen, CheckCircle
} from 'lucide-react';

import Domain1 from './domains/Domain1_Architecture.jsx';
import Domain2 from './domains/Domain2_Governance.jsx';
import Domain3 from './domains/Domain3_DataLoading.jsx';
import Domain4 from './domains/Domain4_Performance.jsx';
import Domain5 from './domains/Domain5_Collaboration.jsx';

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
    topics: ['Architecture layers', 'Snowflake editions', 'Object hierarchy', 'Virtual warehouses', 'Storage concepts', 'AI/ML features'],
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
    topics: ['RBAC & DAC', 'Authentication (MFA, SSO, OAuth)', 'Data masking & row access', 'Object tagging', 'Trust Center', 'Resource monitors'],
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
    topics: ['File formats', 'Stages (internal/external)', 'COPY INTO', 'Snowpipe & Snowpipe Streaming', 'Streams & Tasks', 'Connectors & integrations'],
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
    topics: ['Query Profile & insights', 'Caching (result/metadata/warehouse)', 'Clustering keys', 'Materialized views', 'Search optimization', 'Semi-structured data'],
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
    topics: ['Time Travel & Fail-safe', 'Secure Data Sharing', 'Cloning', 'Data clean rooms', 'Marketplace & listings', 'Native Apps'],
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
  const [activeDomain, setActiveDomain] = useState(null);

  const domain = DOMAINS.find(d => d.id === activeDomain);

  if (activeDomain && domain) {
    const DomainComponent = domain.component;
    const c = domain.color;
    const Icon = domain.icon;

    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12">
        {/* Domain header */}
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      {/* Global header */}
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DOMAINS.map(d => (
            <DomainCard key={d.id} domain={d} onEnter={setActiveDomain} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;
