import React, { useState } from 'react';
import { Construction } from 'lucide-react';

// ─── Tabs for this domain ─────────────────────────────────────────────────────
// Covers: 4.1 Query performance (Query Profile, ACCOUNT_USAGE, workload mgmt)
//         4.2 Optimization (Query acceleration, Search optimization, Clustering, MVs)
//         4.3 Caching (result / metadata / warehouse)
//         4.4 Transformation (structured, semi-structured, unstructured, window fns)

const TABS = [
  { id: 'caching',      label: 'Caching' },
  { id: 'queryprofile', label: 'Query Profile' },
  { id: 'clustering',   label: 'Clustering Keys' },
  { id: 'matviews',     label: 'Materialized Views' },
  { id: 'semistructured', label: 'Semi-Structured Data' },
  { id: 'optimization', label: 'Optimization Services' },
  { id: 'quiz',         label: 'Quiz' },
];

const ComingSoon = ({ tab }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <Construction className="w-12 h-12 text-amber-300 mb-4" />
    <h3 className="text-xl font-bold text-slate-700 mb-2">Coming Soon</h3>
    <p className="text-slate-400 text-sm max-w-xs">
      The <span className="font-semibold text-amber-600">{tab}</span> section is being built.
    </p>
  </div>
);

const Domain4_Performance = () => {
  const [activeTab, setActiveTab] = useState('caching');

  return (
    <div className="space-y-6">
      <div className="flex overflow-x-auto border-b border-slate-200 hide-scrollbar pb-1">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors whitespace-nowrap border-b-2 ${
              activeTab === tab.id
                ? 'border-amber-600 text-amber-700 bg-amber-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ComingSoon tab={TABS.find(t => t.id === activeTab)?.label} />
    </div>
  );
};

export default Domain4_Performance;
