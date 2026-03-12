import React, { useState } from 'react';
import { Construction } from 'lucide-react';

// ─── Tabs for this domain ─────────────────────────────────────────────────────
// Covers: 2.1 Security model (RBAC, DAC, Auth, Roles, Network Policies)
//         2.2 Data governance (masking, tagging, privacy, lineage, Trust Center)
//         2.3 Monitoring & cost management (Resource Monitors, ACCOUNT_USAGE)

const TABS = [
  { id: 'rbac',        label: 'RBAC & Roles' },
  { id: 'auth',        label: 'Authentication' },
  { id: 'masking',     label: 'Data Masking' },
  { id: 'tagging',     label: 'Object Tagging' },
  { id: 'governance',  label: 'Governance Tools' },
  { id: 'cost',        label: 'Cost & Monitoring' },
  { id: 'quiz',        label: 'Quiz' },
];

const ComingSoon = ({ tab }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <Construction className="w-12 h-12 text-violet-300 mb-4" />
    <h3 className="text-xl font-bold text-slate-700 mb-2">Coming Soon</h3>
    <p className="text-slate-400 text-sm max-w-xs">
      The <span className="font-semibold text-violet-600">{tab}</span> section is being built.
    </p>
  </div>
);

const Domain2_Governance = () => {
  const [activeTab, setActiveTab] = useState('rbac');

  return (
    <div className="space-y-6">
      <div className="flex overflow-x-auto border-b border-slate-200 hide-scrollbar pb-1">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors whitespace-nowrap border-b-2 ${
              activeTab === tab.id
                ? 'border-violet-600 text-violet-700 bg-violet-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* All tabs are stubs — fill in one at a time */}
      <ComingSoon tab={TABS.find(t => t.id === activeTab)?.label} />
    </div>
  );
};

export default Domain2_Governance;
