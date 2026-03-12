import React, { useState } from 'react';
import { Construction } from 'lucide-react';

// ─── Tabs for this domain ─────────────────────────────────────────────────────
// Covers: 3.1 File formats, Stages, COPY INTO, error handling
//         3.2 Snowpipe, Snowpipe Streaming, Streams, Tasks, Dynamic Tables
//         3.3 Connectors, drivers, storage/API/Git integrations

const TABS = [
  { id: 'stages',      label: 'Stages' },
  { id: 'fileformats', label: 'File Formats' },
  { id: 'copyinto',    label: 'COPY INTO' },
  { id: 'snowpipe',    label: 'Snowpipe' },
  { id: 'streams',     label: 'Streams & Tasks' },
  { id: 'dynamic',     label: 'Dynamic Tables' },
  { id: 'connectors',  label: 'Connectors' },
  { id: 'quiz',        label: 'Quiz' },
];

const ComingSoon = ({ tab }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <Construction className="w-12 h-12 text-teal-300 mb-4" />
    <h3 className="text-xl font-bold text-slate-700 mb-2">Coming Soon</h3>
    <p className="text-slate-400 text-sm max-w-xs">
      The <span className="font-semibold text-teal-600">{tab}</span> section is being built.
    </p>
  </div>
);

const Domain3_DataLoading = () => {
  const [activeTab, setActiveTab] = useState('stages');

  return (
    <div className="space-y-6">
      <div className="flex overflow-x-auto border-b border-slate-200 hide-scrollbar pb-1">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors whitespace-nowrap border-b-2 ${
              activeTab === tab.id
                ? 'border-teal-600 text-teal-700 bg-teal-50/50'
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

export default Domain3_DataLoading;
