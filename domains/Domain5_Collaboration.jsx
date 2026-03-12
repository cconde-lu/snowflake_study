import React, { useState } from 'react';
import { Construction } from 'lucide-react';

// ─── Tabs for this domain ─────────────────────────────────────────────────────
// Covers: 5.1 Data protection (Time Travel, Fail-safe, Cloning, Replication)
//         5.2 Data sharing (Provider/Consumer/Reader accounts, Secure Shares, Clean Rooms)
//         5.3 Marketplace & listings (Public/Private listings, Native Apps)

const TABS = [
  { id: 'timetravel',  label: 'Time Travel' },
  { id: 'failsafe',    label: 'Fail-safe' },
  { id: 'cloning',     label: 'Cloning' },
  { id: 'sharing',     label: 'Secure Data Sharing' },
  { id: 'cleanrooms',  label: 'Data Clean Rooms' },
  { id: 'marketplace', label: 'Marketplace & Native Apps' },
  { id: 'quiz',        label: 'Quiz' },
];

const ComingSoon = ({ tab }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <Construction className="w-12 h-12 text-rose-300 mb-4" />
    <h3 className="text-xl font-bold text-slate-700 mb-2">Coming Soon</h3>
    <p className="text-slate-400 text-sm max-w-xs">
      The <span className="font-semibold text-rose-600">{tab}</span> section is being built.
    </p>
  </div>
);

const Domain5_Collaboration = () => {
  const [activeTab, setActiveTab] = useState('timetravel');

  return (
    <div className="space-y-6">
      <div className="flex overflow-x-auto border-b border-slate-200 hide-scrollbar pb-1">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors whitespace-nowrap border-b-2 ${
              activeTab === tab.id
                ? 'border-rose-600 text-rose-700 bg-rose-50/50'
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

export default Domain5_Collaboration;
