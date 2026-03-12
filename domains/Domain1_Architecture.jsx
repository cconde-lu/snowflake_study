import React, { useState, useCallback } from 'react';
import {
  Layers, Construction, BookOpen, Terminal, Code2, Plug,
  Monitor, Shield, Server, Database, Link, CheckCircle, XCircle,
  RefreshCw, ChevronRight, Zap, Lock, Search, GitBranch, BarChart2,
  HelpCircle, FlaskConical,
} from 'lucide-react';

// ─── Shared UI helpers ────────────────────────────────────────────────────────
const ExamTip = ({ children }) => (
  <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-xl p-4">
    <p className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-1">⚡ Exam Tip</p>
    <div className="text-sm text-yellow-800 space-y-1">{children}</div>
  </div>
);

const SectionHeader = ({ icon: Icon, color, title, subtitle }) => (
  <div className="flex items-start gap-3 mb-4">
    <div className={`${color} p-2.5 rounded-xl flex-shrink-0`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
      {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

const InfoCard = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl border border-slate-100 shadow-sm p-5 ${className}`}>
    {children}
  </div>
);

// ─── Tab registry — mirrors guide objectives 1.1 → 1.6 ──────────────────────
// Horizon Catalog is folded into 1.1 (it describes the overall platform layer)
// Editions are folded into 1.1 (guide lists them under 1.1)
const TABS = [
  { id: 'architecture', label: '☁️ 1.1 Architecture' },
  { id: 'interfaces',   label: '🔌 1.2 Interfaces & Tools' },
  { id: 'objects',      label: '📦 1.3 Object Hierarchy' },
  { id: 'warehouses',   label: '⚙️ 1.4 Virtual Warehouses' },
  { id: 'storage',      label: '🗄️ 1.5 Storage Concepts' },
  { id: 'aiml',         label: '🤖 1.6 AI/ML Features' },
  { id: 'quiz',         label: '🧪 Quiz', accent: true },
];

const ComingSoon = ({ tab }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <Construction className="w-12 h-12 text-blue-300 mb-4" />
    <h3 className="text-xl font-bold text-slate-700 mb-2">Coming Soon</h3>
    <p className="text-slate-400 text-sm max-w-xs">
      The <span className="font-semibold text-blue-600">{tab}</span> section is being built.
    </p>
  </div>
);

// ─── Domain 1 root ────────────────────────────────────────────────────────────
const Domain1_Architecture = () => {
  const [activeTab, setActiveTab] = useState('architecture');
  return (
    <div className="space-y-4">
      {/* Tab nav */}
      <div className="flex overflow-x-auto border-b border-slate-200 pb-px">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-3 font-medium text-sm transition-colors whitespace-nowrap border-b-2 ${
              activeTab === tab.id
                ? tab.accent
                  ? 'border-violet-600 text-violet-700 bg-violet-50/60'
                  : 'border-blue-600 text-blue-700 bg-blue-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'architecture' && <ArchitectureTab />}
      {activeTab === 'interfaces'   && <InterfacesTab />}
      {activeTab === 'storage'      && <StorageTab />}
      {activeTab === 'quiz'         && <QuizTab />}
      {!['architecture','interfaces','storage','quiz'].includes(activeTab) &&
        <ComingSoon tab={TABS.find(t => t.id === activeTab)?.label} />}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// LEARNING TAB 1 — 1.1 Architecture + Editions + Horizon overview
// ═══════════════════════════════════════════════════════════════════════════════

const LAYERS = [
  {
    id: 'cloud',
    emoji: '☁️',
    label: 'Cloud Services Layer',
    sublabel: 'The Brain',
    bg: 'bg-blue-600',
    lightBg: 'bg-blue-50',
    border: 'border-blue-300',
    textColor: 'text-blue-900',
    billing: 'Included free (charged only if >10% of daily compute)',
    responsibilities: [
      { icon: Lock,      text: 'Authentication & access control' },
      { icon: Search,    text: 'Query parsing, optimization & compilation' },
      { icon: Database,  text: 'Metadata & transaction management' },
      { icon: Server,    text: 'Infrastructure management (auto-patching, upgrades)' },
      { icon: Shield,    text: 'Security policies & encryption key management' },
    ],
    keyFact: 'Runs 24/7. Only charged if Cloud Services exceeds 10% of daily compute credits.',
  },
  {
    id: 'compute',
    emoji: '⚙️',
    label: 'Compute Layer',
    sublabel: 'Virtual Warehouses — The Muscle',
    bg: 'bg-indigo-600',
    lightBg: 'bg-indigo-50',
    border: 'border-indigo-300',
    textColor: 'text-indigo-900',
    billing: 'Per-second while running (60-second minimum)',
    responsibilities: [
      { icon: Zap,       text: 'Executes SQL queries via MPP cluster' },
      { icon: Database,  text: 'Local SSD cache (Warehouse Cache)' },
      { icon: Server,    text: 'Multiple warehouses can read the same data simultaneously' },
      { icon: RefreshCw, text: 'Auto-suspend & auto-resume to control cost' },
      { icon: Layers,    text: 'Completely independent of storage — scale freely' },
    ],
    keyFact: 'Multiple virtual warehouses can query the SAME storage concurrently — zero resource contention.',
  },
  {
    id: 'storage',
    emoji: '🗄️',
    label: 'Database Storage Layer',
    sublabel: 'The Foundation',
    bg: 'bg-slate-600',
    lightBg: 'bg-slate-50',
    border: 'border-slate-300',
    textColor: 'text-slate-900',
    billing: 'Per TB/month (compressed size)',
    responsibilities: [
      { icon: Database,  text: 'Columnar, compressed, micro-partitioned format' },
      { icon: Server,    text: 'Stored on cloud object storage (S3 / Azure Blob / GCS)' },
      { icon: Lock,      text: 'Always encrypted at rest (AES-256)' },
      { icon: Shield,    text: 'Customers never manage storage hardware' },
      { icon: RefreshCw, text: 'Time Travel data stored here (up to 90 days)' },
    ],
    keyFact: 'You never see the actual files. Snowflake manages all storage — you pay only for compressed bytes.',
  },
];

const EDITIONS = [
  {
    name: 'Standard',      emoji: '🥉', tagline: 'Core SQL data warehouse',
    color: 'bg-slate-50 border-slate-200', border: 'border-slate-200', text: 'text-slate-700',
    features: [
      'Full SQL + advanced DML (MERGE, multi-table INSERT)',
      'Time Travel up to 1 day (extended up to 90 days available)',
      'Always-on AES-256 encryption at rest and in transit',
      'Fail-safe: 7-day disaster recovery beyond Time Travel',
      'SOC 2 Type II, Federated SSO, MFA, OAuth, network policies',
      'Snowpipe, Streams, Tasks, UDFs, Stored Procedures',
      'Snowpark, Streamlit, Cortex AI functions',
      'Database & share replication between accounts',
    ],
    adds: null,
  },
  {
    name: 'Enterprise',    emoji: '🥈', tagline: 'For large-scale enterprise workloads',
    color: 'bg-blue-50 border-blue-200', border: 'border-blue-200', text: 'text-blue-800',
    features: [
      'Everything in Standard',
      'Multi-cluster virtual warehouses (auto-scale for high concurrency)',
      'Column-level Security — Dynamic Data Masking',
      'Row-level Security — Row Access Policies',
      'Aggregation & Projection policies',
      'Search Optimization Service & Materialized Views',
      'Periodic rekeying of encrypted data',
    ],
    adds: 'Multi-cluster warehouses + column/row-level security + advanced policies',
  },
  {
    name: 'Business Critical', emoji: '🥇', tagline: 'For sensitive / regulated data',
    color: 'bg-amber-50 border-amber-200', border: 'border-amber-200', text: 'text-amber-800',
    features: [
      'Everything in Enterprise',
      'HIPAA, HITRUST CSF, PCI-DSS compliance support',
      'Tri-Secret Secure (customer-managed encryption keys via cloud KMS)',
      'AWS PrivateLink / Azure Private Link / GCP Private Service Connect',
      'Database Failover and Failback (Business Continuity & DR)',
      'Support for PHI data handling',
    ],
    adds: 'Compliance certifications + customer-managed keys + private connectivity + failover',
  },
  {
    name: 'Virtual Private Snowflake (VPS)', emoji: '🔒', tagline: 'Completely dedicated environment',
    color: 'bg-rose-50 border-rose-200', border: 'border-rose-200', text: 'text-rose-800',
    features: [
      'Everything in Business Critical',
      'Fully dedicated Snowflake infrastructure (no shared hardware)',
      'Highest security isolation — isolated from all other Snowflake accounts',
      'Dedicated metadata store and compute resource pool',
      'No Snowflake Marketplace (private listings only)',
      'Used by government, defense, and highly regulated financial institutions',
    ],
    adds: 'Dedicated isolated infrastructure — zero shared resources with other accounts',
  },
];

const HORIZON_PILLARS_LEARN = [
  {
    emoji: '🤖', label: 'Context for AI', color: 'bg-sky-50 border-sky-200', text: 'text-sky-800',
    points: [
      'Snowflake Intelligence — natural language Q&A over your data',
      'Powered by Cortex AI Functions, Cortex Analyst, and Cortex Search',
      'AI agents understand your business via semantic views and search services',
      'Cross-region inference; all results stay secure and governed',
    ],
  },
  {
    emoji: '🔍', label: 'Data Discovery', color: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-800',
    points: [
      'One catalog for Snowflake, Apache Iceberg™, external sources and BI tools',
      'Internal Marketplace listings — share governed products without copying data',
      'Automatic sensitive data classification across the estate',
    ],
  },
  {
    emoji: '🛡️', label: 'Security & Governance', color: 'bg-violet-50 border-violet-200', text: 'text-violet-800',
    points: [
      'Dynamic data masking (column-level) and row access policies',
      'Data lineage tracking — know where every column came from',
      'Access history + Time Travel for auditing and compliance',
      'Governance tags and permissions travel with shared data products',
    ],
  },
  {
    emoji: '🔗', label: 'Interoperability', color: 'bg-teal-50 border-teal-200', text: 'text-teal-800',
    points: [
      'Consistent metadata & permissions across Snowflake, Spark, and Iceberg engines',
      'Enforce masking/row-access on Iceberg tables queried from Apache Spark',
      'Every engine sees the same definitions, lineage, and policy behavior',
    ],
  },
  {
    emoji: '♻️', label: 'Business Continuity', color: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-800',
    points: [
      'Database and account replication across regions and clouds',
      'Failover / failback managed centrally — single pane of glass',
      'Data, policies, and configs stay aligned across environments',
    ],
  },
];

const SNOWGRID_FEATURES = [
  { emoji: '🌐', title: 'Cross-Cloud, Cross-Region', desc: 'Connect a data ecosystem spanning AWS, Azure, and GCP — different regions and cloud providers — using listings and collaboration features.' },
  { emoji: '🔐', title: 'Unified Governance', desc: 'Apply the same security policies, masking rules, and access controls consistently across all clouds and regions.' },
  { emoji: '♻️', title: 'Replication & Disaster Recovery', desc: 'Replicate databases, shares, and account objects across regions. Failover/failback for business continuity without leaving Snowflake.' },
  { emoji: '🤝', title: 'Cross-Cloud Data Sharing', desc: 'Cross-cloud auto-fulfillment lets consumers on a different cloud provider access shared data seamlessly — no data movement required.' },
];

const ArchitectureTab = () => {
  const [activeLayer, setActiveLayer] = useState(null);
  const [openEdition, setOpenEdition] = useState(null);
  const [openPillar,  setOpenPillar]  = useState(null);
  const [openGrid,    setOpenGrid]    = useState(null);
  const layer = LAYERS.find(l => l.id === activeLayer);

  return (
    <div className="space-y-5">
      <InfoCard>
        <SectionHeader icon={Layers} color="bg-blue-600" title="Snowflake's Three-Layer Architecture"
          subtitle="A hybrid of shared-disk and shared-nothing — storage, compute, and services are fully decoupled. Click each layer to explore." />

        {/* Hybrid architecture callout */}
        <div className="mb-4 grid sm:grid-cols-2 gap-2 text-xs">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
            <p className="font-bold text-blue-800 mb-1">📀 Like Shared-Disk</p>
            <p className="text-blue-700">Central storage accessible from all compute nodes — simple data management, no data duplication across warehouses.</p>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3">
            <p className="font-bold text-indigo-800 mb-1">⚙️ Like Shared-Nothing</p>
            <p className="text-indigo-700">MPP clusters where each node works independently — high performance, massive parallelism, free scale-out.</p>
          </div>
        </div>

        {/* Visual stack */}
        <div className="space-y-2 mb-4">
          {LAYERS.map((l, i) => (
            <button key={l.id} onClick={() => setActiveLayer(activeLayer === l.id ? null : l.id)}
              className={`w-full text-left rounded-xl border-2 transition-all px-5 py-4 flex items-center justify-between group ${
                activeLayer === l.id ? `${l.lightBg} ${l.border} shadow-md` : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
              }`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{l.emoji}</span>
                <div>
                  <p className={`font-bold text-sm ${activeLayer === l.id ? l.textColor : 'text-slate-800'}`}>{l.label}</p>
                  <p className="text-xs text-slate-400">{l.sublabel}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full hidden sm:block ${l.bg} text-white`}>
                  {['Top','Middle','Bottom'][i]}
                </span>
                <ChevronRight className={`w-5 h-5 text-slate-300 transition-transform ${activeLayer === l.id ? 'rotate-90' : ''}`} />
              </div>
            </button>
          ))}
        </div>

        {/* Expanded detail */}
        {layer && (
          <div className={`rounded-xl border-2 ${layer.border} ${layer.lightBg} p-5 space-y-4`}>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className={`font-bold text-base ${layer.textColor}`}>{layer.emoji} {layer.label}</h3>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${layer.bg} text-white`}>
                💰 {layer.billing}
              </span>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {layer.responsibilities.map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-start gap-2 bg-white/70 rounded-lg px-3 py-2 border border-white">
                  <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${layer.textColor}`} />
                  <span className="text-sm text-slate-700">{text}</span>
                </div>
              ))}
            </div>
            <div className={`rounded-lg p-3 ${layer.lightBg} border ${layer.border}`}>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">🎯 Key Exam Fact</p>
              <p className={`text-sm font-semibold ${layer.textColor}`}>{layer.keyFact}</p>
            </div>
          </div>
        )}
      </InfoCard>

      {/* Billing comparison table */}
      <InfoCard>
        <h3 className="font-bold text-slate-700 mb-3 text-sm uppercase tracking-wider">Billing at a Glance</h3>
        <div className="space-y-2">
          {LAYERS.map(l => (
            <div key={l.id} className={`flex items-center gap-3 p-3 rounded-lg ${l.lightBg} border ${l.border}`}>
              <span className="text-lg flex-shrink-0">{l.emoji}</span>
              <p className={`font-semibold text-sm ${l.textColor} flex-1`}>{l.label}</p>
              <p className="text-xs text-slate-600 text-right">{l.billing}</p>
            </div>
          ))}
        </div>
      </InfoCard>

      <ExamTip>
        <p>Storage and compute are <strong>fully decoupled</strong> — you scale each independently.</p>
        <p>Cloud Services is <strong>not billed per query</strong> — only charged if it exceeds 10% of daily compute.</p>
        <p>Compute bills per-second with a <strong>60-second minimum</strong>; storage bills per compressed TB/month.</p>
      </ExamTip>

      {/* ── Editions (guide 1.1) ── */}
      <InfoCard>
        <h3 className="font-bold text-slate-700 mb-1 text-sm uppercase tracking-wider">Snowflake Editions</h3>
        <p className="text-xs text-slate-400 mb-4">
          Each edition adds capabilities on top of the previous. Click an edition to compare features.
        </p>
        <div className="space-y-2">
          {EDITIONS.map((e, i) => (
            <div key={i} className={`rounded-xl border overflow-hidden ${e.color}`}>
              <button onClick={() => setOpenEdition(openEdition === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{e.emoji}</span>
                  <div>
                    <p className={`font-bold text-sm ${e.text}`}>{e.name}</p>
                    <p className="text-xs text-slate-500">{e.tagline}</p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${openEdition === i ? 'rotate-90' : ''}`} />
              </button>
              {openEdition === i && (
                <div className="px-5 pb-4 space-y-1">
                  {e.features.map((f, j) => (
                    <div key={j} className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${e.text}`} />
                      {f}
                    </div>
                  ))}
                  {e.adds && (
                    <div className={`mt-3 rounded-lg px-3 py-2 ${e.color} border ${e.border}`}>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Adds over previous</p>
                      <p className={`text-xs font-semibold ${e.text}`}>{e.adds}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
          <p className="text-xs font-bold text-yellow-700 mb-1">⚡ Exam Tip — Editions</p>
          <ul className="text-xs text-yellow-700 space-y-1 list-disc pl-4">
            <li>Time Travel up to <strong>90 days</strong> requires Enterprise or higher (Standard = 1 day max).</li>
            <li>Multi-cluster warehouses (for high concurrency) require <strong>Enterprise+</strong>.</li>
            <li>Column-level security (dynamic data masking) requires <strong>Enterprise+</strong>.</li>
            <li>Business Critical adds HIPAA, PCI-DSS compliance and <strong>Tri-Secret Secure</strong> encryption.</li>
          </ul>
        </div>
      </InfoCard>

      {/* ── Horizon Catalog overview (platform layer, not in guide but part of arch) ── */}
      <InfoCard>
        <h3 className="font-bold text-slate-700 mb-1 text-sm uppercase tracking-wider">
          Snowflake Horizon Catalog — The Governance Layer
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Horizon sits on top of the three-layer architecture. It is not a separate compute or storage layer
          — it is the unified governance and catalog surface across all your data, engines, and clouds.
        </p>
        <div className="space-y-2">
          {HORIZON_PILLARS_LEARN.map((p, i) => (
            <div key={i} className={`rounded-xl border ${p.color} overflow-hidden`}>
              <button onClick={() => setOpenPillar(openPillar === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left">
                <span className={`font-bold text-sm flex items-center gap-2 ${p.text}`}>
                  <span className="text-lg">{p.emoji}</span> {p.label}
                </span>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${openPillar === i ? 'rotate-90' : ''}`} />
              </button>
              {openPillar === i && (
                <ul className="px-5 pb-4 space-y-2">
                  {p.points.map((pt, j) => (
                    <li key={j} className={`flex items-start gap-2 text-sm ${p.text}`}>
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 opacity-70" />
                      {pt}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
          <p className="text-xs font-bold text-yellow-700 mb-1">⚡ Exam Tip — Horizon</p>
          <ul className="text-xs text-yellow-700 space-y-1 list-disc pl-4">
            <li>Horizon <strong>doesn't store data</strong> — it governs access to data across all engines.</li>
            <li>Applies the same masking/row-access policies to native tables <strong>and</strong> Apache Iceberg tables.</li>
            <li>Snowflake Intelligence (natural-language Q&A) is powered by Cortex AI on top of Horizon.</li>
          </ul>
        </div>
      </InfoCard>

      {/* ── Snowgrid (cross-cloud/cross-region technology layer) ── */}
      <InfoCard>
        <SectionHeader icon={GitBranch} color="bg-blue-600" title="Snowgrid — Cross-Cloud & Cross-Region"
          subtitle="Snowflake's technology layer that connects data ecosystems across cloud providers and geographic regions." />
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          {SNOWGRID_FEATURES.map((f, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p className="text-lg mb-1">{f.emoji}</p>
              <p className="font-bold text-sm text-slate-800 mb-1">{f.title}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
          <p className="text-xs font-bold text-blue-800 mb-1">🌐 Supported Cloud Providers</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {['☁️ Amazon Web Services (AWS)', '☁️ Microsoft Azure', '☁️ Google Cloud Platform (GCP)'].map(c => (
              <span key={c} className="text-xs bg-white border border-blue-200 text-blue-700 px-3 py-1 rounded-full font-medium">{c}</span>
            ))}
          </div>
        </div>
        <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
          <p className="text-xs font-bold text-yellow-700 mb-1">⚡ Exam Tip — Snowgrid</p>
          <ul className="text-xs text-yellow-700 space-y-1 list-disc pl-4">
            <li>Snowgrid is what enables <strong>cross-cloud auto-fulfillment</strong> in the Snowflake Marketplace.</li>
            <li>Replication and failover work across regions <strong>within and across</strong> cloud providers via Snowgrid.</li>
            <li>Governance policies travel with data even across clouds — Snowgrid enforces them consistently.</li>
          </ul>
        </div>
      </InfoCard>

      <ExamTip>
        <p>Architecture is a <strong>hybrid</strong>: shared-disk simplicity + shared-nothing MPP performance.</p>
        <p>Storage and compute are <strong>fully decoupled</strong> — scale each independently at any time.</p>
        <p>Cloud Services is <strong>not billed per query</strong> — only charged if it exceeds 10% of daily compute credits.</p>
        <p>Compute bills per-second with a <strong>60-second minimum</strong>; storage bills per compressed TB/month.</p>
        <p><strong>Snowgrid</strong> is the cross-cloud/cross-region layer — enables replication, failover, and Marketplace auto-fulfillment.</p>
      </ExamTip>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// LEARNING TAB 2 — 1.2 Interfaces & Tools  (pure reference content)
// ═══════════════════════════════════════════════════════════════════════════════

const ALL_TOOLS = [
  { id: 'snowsight',   name: 'Snowsight',           category: 'Web UI',       color: 'bg-blue-600',   icon: Monitor,
    desc: 'Primary browser-based UI. Run SQL, view Query Profile, manage worksheets, databases, stages. Supports Notebooks and Streamlit. No install required.' },
  { id: 'snow_cli',   name: 'Snowflake CLI',        category: 'CLI',          color: 'bg-slate-700',  icon: Terminal,
    desc: 'Modern extensible open-source CLI for developer workloads — Native Apps, Snowpark, Streamlit, git integration, DDL, and bulk loads. Recommended for new workflows.' },
  { id: 'snowsql',    name: 'SnowSQL',              category: 'CLI',          color: 'bg-slate-500',  icon: Terminal,
    desc: 'Legacy CLI client. Still used for scripted SQL, batch operations and CI/CD pipelines. Being superseded by Snowflake CLI.' },
  { id: 'snowcd',     name: 'SnowCD',               category: 'CLI',          color: 'bg-slate-400',  icon: Terminal,
    desc: 'Connectivity diagnostic tool. Identifies and fixes client connectivity issues — run before escalating support tickets.' },
  { id: 'vscode',     name: 'VS Code Extension',   category: 'IDE',          color: 'bg-indigo-600', icon: Code2,
    desc: 'Connect to Snowflake inside VS Code. SQL autocomplete, object sidebar browser, inline query results. Primary IDE integration for exam.' },
  { id: 'terraform',  name: 'Terraform Provider',  category: 'IaC',          color: 'bg-purple-600', icon: Server,
    desc: 'Manage warehouses, databases, roles, and grants as version-controlled infrastructure code. Community-maintained.' },
  { id: 'python',     name: 'Python Connector',    category: 'Driver',       color: 'bg-yellow-500', icon: Code2,
    desc: 'Standard driver for Python applications and Snowpark pipelines. Most common programmatic interface for custom apps.' },
  { id: 'jdbc_odbc',  name: 'JDBC / ODBC',         category: 'Driver',       color: 'bg-teal-600',   icon: Plug,
    desc: 'Connect any BI tool (Tableau, Power BI, Looker) or legacy application to Snowflake via standard database protocols.' },
  { id: 'sql_api',    name: 'Snowflake SQL API',   category: 'API',          color: 'bg-cyan-600',   icon: Link,
    desc: 'REST API for programmatically submitting SQL statements and managing Snowflake resources — ideal for serverless applications.' },
  { id: 'kafka',      name: 'Kafka Connector',     category: 'Connector',    color: 'bg-orange-500', icon: Plug,
    desc: 'Stream data from Apache Kafka topics into Snowflake tables continuously.' },
  { id: 'spark',      name: 'Spark Connector',     category: 'Connector',    color: 'bg-orange-600', icon: Plug,
    desc: 'Run existing Apache Spark workloads directly against Snowflake storage.' },
  { id: 'api_int',    name: 'API Integration',     category: 'Integration',  color: 'bg-rose-500',   icon: Link,
    desc: 'Call external REST APIs from inside a Snowflake SQL query (External Functions). Requires an API Integration object.' },
  { id: 'storage_int',name: 'Storage Integration', category: 'Integration',  color: 'bg-green-600',  icon: Database,
    desc: 'Connect Snowflake to S3, Azure Blob or GCS for external stages using cloud IAM roles — no credentials stored in Snowflake.' },
  { id: 'git_int',    name: 'Git Integration',     category: 'Integration',  color: 'bg-slate-800',  icon: GitBranch,
    desc: 'Link a Git repository to a Snowflake stage to version-control stored procedures and UDFs.' },
];

const TOOL_GROUPS = ['Web UI','CLI','IDE','IaC','Driver','API','Connector','Integration'];

const InterfacesTab = () => {
  const [selected, setSelected] = useState(null);
  const tool = ALL_TOOLS.find(t => t.id === selected);
  const Icon = tool?.icon;

  return (
    <div className="space-y-5">
      <InfoCard>
        <SectionHeader icon={BookOpen} color="bg-blue-600" title="Interfaces & Tools"
          subtitle="Exam objective 1.2. You'll need to match tools to use cases — not memorise syntax." />

        {TOOL_GROUPS.map(group => {
          const groupTools = ALL_TOOLS.filter(t => t.category === group);
          return (
            <div key={group} className="mb-5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{group}</p>
              <div className="grid sm:grid-cols-2 gap-2">
                {groupTools.map(t => {
                  const TIcon = t.icon;
                  const isActive = selected === t.id;
                  return (
                    <button key={t.id} onClick={() => setSelected(isActive ? null : t.id)}
                      className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                        isActive ? 'border-blue-400 bg-blue-50' : 'border-slate-100 bg-slate-50 hover:border-blue-200'
                      }`}>
                      <div className={`${t.color} p-2 rounded-lg flex-shrink-0 mt-0.5`}>
                        <TIcon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-800">{t.name}</p>
                        <p className="text-xs text-slate-500 leading-snug mt-0.5 line-clamp-2">{t.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Expanded tool detail */}
        {tool && (
          <div className="mt-2 bg-slate-50 border-2 border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className={`${tool.color} p-2 rounded-lg`}><Icon className="w-4 h-4 text-white" /></div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{tool.category}</p>
                <p className="font-bold text-slate-800">{tool.name}</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{tool.desc}</p>
          </div>
        )}
      </InfoCard>

      <InfoCard>
        <h3 className="font-bold text-slate-700 mb-3 text-sm uppercase tracking-wider">CLI Tools — Quick Compare</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-600">
                <th className="text-left px-3 py-2 rounded-tl-lg font-semibold">Tool</th>
                <th className="text-left px-3 py-2 font-semibold">Primary Use</th>
                <th className="text-left px-3 py-2 rounded-tr-lg font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { tool: 'Snowflake CLI', use: 'Native Apps, Snowpark, Streamlit, developer workflows, scripting', status: '✅ Recommended (current)', color: 'text-slate-700' },
                { tool: 'SnowSQL',       use: 'Scripted SQL, batch DDL/DML, CI/CD pipelines',                    status: '⚠️ Legacy (still works)',   color: 'text-slate-500' },
                { tool: 'SnowCD',        use: 'Client connectivity diagnostics and troubleshooting',             status: '🔧 Diagnostic tool',        color: 'text-slate-500' },
              ].map((r, i) => (
                <tr key={i} className={`border-t border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                  <td className="px-3 py-2 font-semibold text-slate-800">{r.tool}</td>
                  <td className={`px-3 py-2 ${r.color}`}>{r.use}</td>
                  <td className="px-3 py-2">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </InfoCard>

      <ExamTip>
        <p><strong>Snowsight</strong> = browser UI, no install. <strong>Snowflake CLI</strong> = modern scripting/dev. <strong>SnowSQL</strong> = legacy CLI. <strong>SnowCD</strong> = connectivity diagnostics.</p>
        <p><strong>JDBC/ODBC</strong> = BI tools. <strong>Kafka Connector</strong> = streaming ingest. <strong>Storage Integration</strong> = external stage auth via IAM roles.</p>
        <p><strong>SQL API</strong> = REST API for programmatic SQL. <strong>API Integration</strong> = call external REST APIs <em>from</em> Snowflake SQL. <strong>Git Integration</strong> = version-control code in Snowflake.</p>
        <p>VS Code Extension is the primary <strong>IDE integration</strong> tested on the exam (1.2 objective).</p>
      </ExamTip>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// LEARNING TAB 3 — 1.5 Storage Concepts
// ═══════════════════════════════════════════════════════════════════════════════

const CodeBlock = ({ code }) => (
  <pre className="bg-slate-900 text-emerald-300 text-xs rounded-xl p-4 overflow-x-auto leading-relaxed font-mono mt-2">
    <code>{code}</code>
  </pre>
);

const TABLE_TYPES_DATA = [
  {
    id: 'permanent',
    emoji: '🏛️', label: 'Permanent', badge: 'Default',
    color: 'bg-blue-50 border-blue-200', text: 'text-blue-800', badgeColor: 'bg-blue-600',
    timeTravel: '0–90 days (edition-dependent)',
    failSafe: '7 days',
    storage: 'Persists until explicitly dropped',
    useCase: 'Production tables — fact tables, dimension tables, all long-lived data.',
    code: `CREATE TABLE sales_facts (
  id        NUMBER,
  sale_date DATE,
  amount    FLOAT
);
-- Permanent by default — no keyword needed`,
  },
  {
    id: 'temporary',
    emoji: '⏱️', label: 'Temporary', badge: 'Session-scoped',
    color: 'bg-amber-50 border-amber-200', text: 'text-amber-800', badgeColor: 'bg-amber-500',
    timeTravel: '0–1 day',
    failSafe: 'None (0 days)',
    storage: 'Auto-dropped at end of session',
    useCase: 'ETL staging, session-specific intermediate results. Never visible to other sessions.',
    code: `CREATE TEMPORARY TABLE session_stage (
  raw_json VARIANT
);
-- Dropped automatically when the session ends`,
  },
  {
    id: 'transient',
    emoji: '🔄', label: 'Transient', badge: 'No Fail-safe',
    color: 'bg-teal-50 border-teal-200', text: 'text-teal-800', badgeColor: 'bg-teal-600',
    timeTravel: '0–1 day',
    failSafe: 'None (0 days)',
    storage: 'Persists across sessions until dropped',
    useCase: 'Short-lived shared data (e.g. dev/test scratch tables). Cheaper — no Fail-safe storage cost.',
    code: `CREATE TRANSIENT TABLE dev_scratch (
  id     NUMBER,
  val    STRING
);
-- Persists until dropped, but NO Fail-safe recovery`,
  },
  {
    id: 'external',
    emoji: '☁️', label: 'External', badge: 'Read-only',
    color: 'bg-slate-50 border-slate-200', text: 'text-slate-700', badgeColor: 'bg-slate-500',
    timeTravel: 'None',
    failSafe: 'None',
    storage: 'Data lives in external cloud storage (S3/Azure/GCS)',
    useCase: 'Query data lake files without loading them. Read-only — no INSERT/UPDATE/DELETE.',
    code: `CREATE EXTERNAL TABLE ext_logs (
  log_ts  TIMESTAMP AS (value:ts::TIMESTAMP),
  msg     STRING    AS (value:msg::STRING)
)
LOCATION = @my_s3_stage/logs/
FILE_FORMAT = (TYPE = 'JSON');`,
  },
  {
    id: 'iceberg',
    emoji: '🧊', label: 'Apache Iceberg™', badge: 'Open format',
    color: 'bg-cyan-50 border-cyan-200', text: 'text-cyan-800', badgeColor: 'bg-cyan-600',
    timeTravel: 'Via Iceberg metadata',
    failSafe: 'None (external storage)',
    storage: 'Data in external cloud storage; Snowflake acts as Iceberg catalog',
    useCase: 'Existing data lakes you can\'t or won\'t move into Snowflake. Interoperable with Spark, Trino, etc.',
    code: `CREATE ICEBERG TABLE iceberg_events (
  event_id   NUMBER,
  event_time TIMESTAMP
)
CATALOG = 'SNOWFLAKE'
EXTERNAL_VOLUME = 'my_ext_volume'
BASE_LOCATION = 'events/';`,
  },
  {
    id: 'dynamic',
    emoji: '⚡', label: 'Dynamic', badge: 'Auto-refresh',
    color: 'bg-violet-50 border-violet-200', text: 'text-violet-800', badgeColor: 'bg-violet-600',
    timeTravel: '0–90 days',
    failSafe: '7 days',
    storage: 'Materialized result of a query — auto-refreshed by Snowflake',
    useCase: 'Automated pipelines replacing complex task chains. Define freshness SLA; Snowflake handles the refresh.',
    code: `CREATE DYNAMIC TABLE daily_sales
  TARGET_LAG = '1 hour'
  WAREHOUSE = my_wh
AS
  SELECT date, SUM(amount) AS total
  FROM raw_sales
  GROUP BY date;`,
  },
  {
    id: 'hybrid',
    emoji: '🔀', label: 'Hybrid', badge: 'OLTP+OLAP',
    color: 'bg-rose-50 border-rose-200', text: 'text-rose-800', badgeColor: 'bg-rose-600',
    timeTravel: '0–90 days',
    failSafe: '7 days',
    storage: 'Row-based index + columnar storage — optimized for mixed workloads',
    useCase: 'Transactional + analytical workloads on the same data (Unistore). Supports row-locking, PK/FK constraints.',
    code: `CREATE HYBRID TABLE users (
  user_id  NUMBER PRIMARY KEY,
  email    STRING  UNIQUE NOT NULL,
  created  TIMESTAMP
);
-- Supports referential integrity + low-latency row lookups`,
  },
];

const VIEW_TYPES_DATA = [
  {
    label: 'Standard View', emoji: '👁️',
    color: 'bg-blue-50 border-blue-200', text: 'text-blue-800',
    points: [
      'Stored query — no data is persisted',
      'Always returns fresh results by re-running the underlying SQL',
      'No storage cost; compute cost each time it is queried',
    ],
    code: `CREATE VIEW active_customers AS
  SELECT id, name
  FROM customers
  WHERE status = 'ACTIVE';`,
  },
  {
    label: 'Secure View', emoji: '🔒',
    color: 'bg-violet-50 border-violet-200', text: 'text-violet-800',
    points: [
      'Hides the view definition (DDL) from non-owners — no data leakage via SHOW VIEW',
      'Disables certain optimizer shortcuts that could expose data through query plans',
      'Slight performance cost vs. standard views — use for data privacy, not convenience',
    ],
    code: `CREATE SECURE VIEW vip_customers AS
  SELECT id, name
  FROM customers
  WHERE tier = 'VIP';
-- Non-owners cannot see the WHERE clause`,
  },
  {
    label: 'Materialized View', emoji: '🗂️',
    color: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-800',
    points: [
      'Pre-computed and physically stored — query hits cached results, not base table',
      'Automatically maintained by Snowflake as the base table changes',
      'Uses storage + background compute credits (serverless); requires Enterprise+',
      'Best for expensive aggregations queried repeatedly',
    ],
    code: `CREATE MATERIALIZED VIEW daily_totals AS
  SELECT sale_date, SUM(amount) AS total
  FROM sales
  GROUP BY sale_date;
-- Snowflake refreshes this automatically`,
  },
];

const MICRO_PARTITION_FACTS = [
  { emoji: '📦', title: 'Size',        detail: '50 MB – 500 MB of uncompressed data per micro-partition (stored compressed, so physically smaller).' },
  { emoji: '🔢', title: 'Columnar',    detail: 'Columns stored independently within each micro-partition — only columns referenced by a query are scanned.' },
  { emoji: '✂️', title: 'Pruning',     detail: 'Query engine reads the min/max metadata per partition. Partitions that can\'t match the WHERE clause are skipped entirely.' },
  { emoji: '🤖', title: 'Automatic',   detail: 'Micro-partitioning happens transparently on all tables. No DDL required — Snowflake manages it.' },
  { emoji: '📊', title: 'Metadata',    detail: 'Each micro-partition stores: range of values per column, number of distinct values, and optimization stats.' },
  { emoji: '🚫', title: 'No skew',     detail: 'Micro-partitions can overlap in value ranges, which (combined with small uniform size) prevents the partition skew common in traditional DWs.' },
];

const CLUSTERING_FACTS = [
  { title: 'What is a clustering key?', body: 'One or more columns (or expressions) that co-locate rows with similar values into the same micro-partitions. Reduces partitions scanned for range/filter queries.' },
  { title: 'When to use clustering', body: 'Large tables (multi-TB), queries that heavily filter on the same 1–3 columns, and tables that are queried much more often than they are updated.' },
  { title: 'Cardinality sweet spot', body: 'Choose columns with moderate cardinality — not too few distinct values (Boolean) and not too many (nanosecond timestamps). Use expressions like TO_DATE(ts) to reduce cardinality.' },
  { title: 'Automatic Clustering', body: 'Snowflake reclusters automatically using serverless compute. No warehouse needed. Suspend with ALTER TABLE … SUSPEND RECLUSTER to pause credit usage.' },
  { title: 'Cost tradeoff', body: 'Clustering consumes credits (compute + potential extra storage from reclustering). Only worth it when query savings outweigh maintenance cost.' },
  { title: 'Hybrid tables exception', body: 'Clustering keys cannot be defined on Hybrid tables. Hybrid tables are always ordered by primary key.' },
];

const StorageTab = () => {
  const [openTable, setOpenTable]     = useState(null);
  const [openView,  setOpenView]      = useState(null);
  const [openCluster, setOpenCluster] = useState(null);

  return (
    <div className="space-y-5">

      {/* ── Micro-partitions ── */}
      <InfoCard>
        <SectionHeader icon={Database} color="bg-blue-600" title="Micro-partitions"
          subtitle="Snowflake's automatic, columnar storage unit — the foundation of all query pruning." />
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          {MICRO_PARTITION_FACTS.map((f, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <p className="text-base mb-1">{f.emoji} <span className="font-bold text-sm text-slate-800">{f.title}</span></p>
              <p className="text-xs text-slate-600 leading-relaxed">{f.detail}</p>
            </div>
          ))}
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-3">
          <p className="text-xs font-bold text-blue-800 mb-2">📐 How Pruning Works</p>
          <div className="space-y-1 text-xs text-blue-700">
            <p>1. Query arrives with a <code className="bg-blue-100 px-1 rounded">WHERE sale_date = '2024-01-15'</code> predicate.</p>
            <p>2. Cloud Services checks micro-partition metadata — min/max date ranges stored per partition.</p>
            <p>3. Any partition whose date range cannot include Jan 15 is <strong>pruned</strong> (skipped entirely).</p>
            <p>4. Only matching partitions are sent to the Virtual Warehouse to actually scan.</p>
          </div>
        </div>
        <CodeBlock code={`-- Check clustering depth and overlap for a table
SELECT SYSTEM$CLUSTERING_INFORMATION('my_table', '(sale_date)');

-- Check overall clustering depth
SELECT SYSTEM$CLUSTERING_DEPTH('my_table', '(sale_date)');`} />
        <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
          <p className="text-xs font-bold text-yellow-700 mb-1">⚡ Exam Tip</p>
          <ul className="text-xs text-yellow-700 space-y-1 list-disc pl-4">
            <li>Micro-partitioning is <strong>automatic and transparent</strong> — no DDL needed.</li>
            <li>Each micro-partition is <strong>50–500 MB uncompressed</strong>; stored compressed (much smaller).</li>
            <li>Columnar storage = only the columns a query references are actually scanned.</li>
            <li>Pruning skips partitions whose min/max range can't satisfy the WHERE predicate.</li>
          </ul>
        </div>
      </InfoCard>

      {/* ── Data Clustering ── */}
      <InfoCard>
        <SectionHeader icon={BarChart2} color="bg-blue-600" title="Data Clustering & Clustering Keys"
          subtitle="Explicitly define how data is co-located in micro-partitions for large, heavily-filtered tables." />
        <div className="space-y-2 mb-4">
          {CLUSTERING_FACTS.map((f, i) => (
            <div key={i} className={`rounded-xl border overflow-hidden ${openCluster === i ? 'border-blue-300 bg-blue-50' : 'border-slate-100 bg-slate-50'}`}>
              <button onClick={() => setOpenCluster(openCluster === i ? null : i)}
                className="w-full flex items-center justify-between p-3 text-left">
                <span className="font-semibold text-sm text-slate-800">{f.title}</span>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${openCluster === i ? 'rotate-90' : ''}`} />
              </button>
              {openCluster === i && (
                <p className="px-4 pb-3 text-sm text-slate-600 leading-relaxed">{f.body}</p>
              )}
            </div>
          ))}
        </div>

        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">SQL Patterns</p>
        <CodeBlock code={`-- Define a clustering key at table creation
CREATE TABLE orders (
  order_id   NUMBER,
  order_date DATE,
  region     STRING,
  amount     FLOAT
) CLUSTER BY (order_date, region);

-- Add / change clustering key on existing table
ALTER TABLE orders CLUSTER BY (TO_DATE(order_date), region);

-- Drop the clustering key
ALTER TABLE orders DROP CLUSTERING KEY;

-- Suspend / Resume Automatic Clustering (controls credit spend)
ALTER TABLE orders SUSPEND RECLUSTER;
ALTER TABLE orders RESUME  RECLUSTER;

-- Check clustering health
SELECT SYSTEM$CLUSTERING_INFORMATION('orders', '(order_date)');`} />

        <div className="mt-3 grid sm:grid-cols-3 gap-2 text-xs">
          {[
            { label: 'Good cardinality', ex: 'date, region, category', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
            { label: 'Too low cardinality', ex: 'Boolean, Y/N, gender', color: 'bg-red-50 border-red-200 text-red-700' },
            { label: 'Too high cardinality', ex: 'nanosecond timestamp, UUID', color: 'bg-red-50 border-red-200 text-red-700' },
          ].map((c, i) => (
            <div key={i} className={`rounded-lg border p-2 ${c.color}`}>
              <p className="font-bold mb-0.5">{c.label}</p>
              <p className="opacity-80">{c.ex}</p>
            </div>
          ))}
        </div>

        <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
          <p className="text-xs font-bold text-yellow-700 mb-1">⚡ Exam Tip — Clustering</p>
          <ul className="text-xs text-yellow-700 space-y-1 list-disc pl-4">
            <li>Only beneficial for <strong>very large tables (multi-TB)</strong> — not for small tables.</li>
            <li>Max <strong>3–4 columns</strong> per clustering key — more columns = more cost, diminishing returns.</li>
            <li>Order matters: put <strong>lowest cardinality column first</strong> in multi-column keys.</li>
            <li>Automatic Clustering is <strong>serverless</strong> — no warehouse required, billed separately.</li>
            <li><strong>Hybrid tables</strong> cannot have clustering keys — always ordered by primary key.</li>
            <li>Cloned tables start with Automatic Clustering <strong>suspended</strong>.</li>
          </ul>
        </div>
      </InfoCard>

      {/* ── Table Types ── */}
      <InfoCard>
        <SectionHeader icon={Layers} color="bg-blue-600" title="Table Types"
          subtitle="Snowflake supports 7 table types — each with different persistence, Time Travel, and Fail-safe behaviour." />

        {/* Comparison summary */}
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-600">
                <th className="text-left px-3 py-2 rounded-tl-lg font-semibold">Type</th>
                <th className="text-left px-3 py-2 font-semibold">Time Travel</th>
                <th className="text-left px-3 py-2 font-semibold">Fail-safe</th>
                <th className="text-left px-3 py-2 rounded-tr-lg font-semibold">Persists?</th>
              </tr>
            </thead>
            <tbody>
              {TABLE_TYPES_DATA.map((t, i) => (
                <tr key={t.id} className={`border-t border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                  <td className="px-3 py-2 font-semibold text-slate-800">{t.emoji} {t.label}</td>
                  <td className="px-3 py-2 text-slate-600">{t.timeTravel}</td>
                  <td className="px-3 py-2 text-slate-600">{t.failSafe}</td>
                  <td className="px-3 py-2 text-slate-600">{t.storage.split('—')[0].trim()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Expandable detail per type */}
        <div className="space-y-2">
          {TABLE_TYPES_DATA.map((t, i) => (
            <div key={t.id} className={`rounded-xl border overflow-hidden ${t.color}`}>
              <button onClick={() => setOpenTable(openTable === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{t.emoji}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm ${t.text}`}>{t.label}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${t.badgeColor}`}>{t.badge}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{t.useCase.split('.')[0]}.</p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${openTable === i ? 'rotate-90' : ''}`} />
              </button>
              {openTable === i && (
                <div className="px-4 pb-4 space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {[
                      { label: 'Time Travel', val: t.timeTravel },
                      { label: 'Fail-safe',   val: t.failSafe },
                      { label: 'Persistence', val: t.storage },
                    ].map((stat, j) => (
                      <div key={j} className="bg-white/70 rounded-lg p-2 border border-white">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                        <p className={`font-semibold text-xs mt-0.5 ${t.text}`}>{stat.val}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-slate-600">{t.useCase}</p>
                  <CodeBlock code={t.code} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
          <p className="text-xs font-bold text-yellow-700 mb-1">⚡ Exam Tip — Table Types</p>
          <ul className="text-xs text-yellow-700 space-y-1 list-disc pl-4">
            <li><strong>Temporary</strong> = session-scoped, invisible to others, auto-dropped. <strong>Transient</strong> = persists across sessions, no Fail-safe.</li>
            <li>Both Temporary and Transient have <strong>no Fail-safe</strong> — lower storage cost but no disaster recovery.</li>
            <li><strong>External tables</strong> are <strong>read-only</strong> — data lives in a cloud stage, not inside Snowflake.</li>
            <li><strong>Dynamic tables</strong> replace task chains — define a query and a freshness target, Snowflake handles the rest.</li>
            <li><strong>Hybrid tables</strong> support row-locking and PK/FK enforcement — designed for Unistore (transactional + analytical).</li>
          </ul>
        </div>
      </InfoCard>

      {/* ── View Types ── */}
      <InfoCard>
        <SectionHeader icon={BookOpen} color="bg-blue-600" title="View Types"
          subtitle="Standard, Secure, and Materialized — each has distinct storage, performance, and privacy characteristics." />
        <div className="space-y-3">
          {VIEW_TYPES_DATA.map((v, i) => (
            <div key={i} className={`rounded-xl border overflow-hidden ${v.color}`}>
              <button onClick={() => setOpenView(openView === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left">
                <span className={`font-bold text-sm flex items-center gap-2 ${v.text}`}>
                  <span className="text-xl">{v.emoji}</span> {v.label}
                </span>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${openView === i ? 'rotate-90' : ''}`} />
              </button>
              {openView === i && (
                <div className="px-4 pb-4 space-y-3">
                  <ul className="space-y-1">
                    {v.points.map((pt, j) => (
                      <li key={j} className={`flex items-start gap-2 text-sm ${v.text}`}>
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 opacity-70" /> {pt}
                      </li>
                    ))}
                  </ul>
                  <CodeBlock code={v.code} />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
          <p className="text-xs font-bold text-yellow-700 mb-1">⚡ Exam Tip — Views</p>
          <ul className="text-xs text-yellow-700 space-y-1 list-disc pl-4">
            <li><strong>Standard view</strong>: no storage, fresh every query. <strong>Materialized view</strong>: pre-computed + stored, auto-maintained by Snowflake.</li>
            <li><strong>Secure view</strong>: hides the DDL definition — use for data privacy, not performance.</li>
            <li>Materialized Views require <strong>Enterprise edition or higher</strong>.</li>
            <li>Materialized Views can also have a <strong>clustering key</strong> defined on them.</li>
          </ul>
        </div>
      </InfoCard>

      <ExamTip>
        <p>Micro-partitions are <strong>automatic, columnar, and 50–500 MB</strong> — no manual partitioning ever.</p>
        <p>Clustering keys are for <strong>large, heavily-filtered tables only</strong> — they cost credits to maintain.</p>
        <p><strong>Temp</strong> = session only + no Fail-safe. <strong>Transient</strong> = persists + no Fail-safe. <strong>Permanent</strong> = full protection.</p>
        <p><strong>Secure view</strong> hides DDL. <strong>Materialized view</strong> pre-computes and stores results. Both serve distinct exam scenarios.</p>
      </ExamTip>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// QUIZ TAB — all interactive challenges in one place
// ═══════════════════════════════════════════════════════════════════════════════

const QUIZ_SECTIONS = [
  { id: 'layers',   label: 'Which Layer?',      emoji: '☁️', desc: '1.1 — Assign tasks to the correct architecture layer' },
  { id: 'editions', label: 'Editions Quiz',     emoji: '🏷️', desc: '1.1 — Match features to the right Snowflake edition' },
  { id: 'horizon',  label: 'Horizon Pillars',   emoji: '🌐', desc: '1.1 — Sort capabilities into the right Horizon pillar' },
  { id: 'tools',    label: 'Tool Scenarios',    emoji: '🔌', desc: '1.2 — Pick the right tool for each scenario' },
  { id: 'storage',  label: 'Storage Concepts',  emoji: '🗄️', desc: '1.5 — Micro-partitions, table types, clustering, views' },
];

const QuizTab = () => {
  const [active, setActive] = useState('layers');

  return (
    <div className="space-y-4">
      {/* Quiz sub-nav */}
      <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <FlaskConical className="w-5 h-5 text-violet-600" />
          <p className="font-bold text-violet-800 text-sm">Domain 1 — Knowledge Checks</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {QUIZ_SECTIONS.map(s => (
            <button key={s.id} onClick={() => setActive(s.id)}
              className={`p-3 rounded-xl border text-center transition-all ${
                active === s.id
                  ? 'bg-violet-600 border-violet-600 text-white shadow-md'
                  : 'bg-white border-violet-200 text-violet-700 hover:bg-violet-100'
              }`}>
              <p className="text-xl mb-1">{s.emoji}</p>
              <p className="font-bold text-xs leading-tight">{s.label}</p>
              <p className={`text-[10px] mt-0.5 leading-snug ${active === s.id ? 'text-violet-200' : 'text-slate-400'}`}>{s.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {active === 'layers'   && <LayerQuiz />}
      {active === 'editions' && <EditionsQuiz />}
      {active === 'horizon'  && <HorizonSortGame />}
      {active === 'tools'    && <ToolScenarioGame />}
      {active === 'storage'  && <StorageChallenge />}
    </div>
  );
};

// ── Challenge 1: Which Layer? ─────────────────────────────────────────────────
const LAYER_QUIZ_DATA = [
  { text: 'Parsing and optimizing a SQL query before execution',  answer: 'cloud',   hint: 'Query optimization = Cloud Services — before the VW even starts.' },
  { text: 'Executing a query against actual data rows',           answer: 'compute', hint: 'Execution = MPP cluster = the Virtual Warehouse (Compute layer).' },
  { text: 'Storing the physical table data on disk',              answer: 'storage', hint: 'Physical data at rest = Database Storage Layer.' },
  { text: 'Managing roles and access privileges',                 answer: 'cloud',   hint: 'Access control and metadata = Cloud Services.' },
  { text: 'Encrypting data at rest with AES-256',                 answer: 'storage', hint: 'AES-256 at rest = encrypted in the storage layer.' },
  { text: 'Tracking query history and usage metadata',            answer: 'cloud',   hint: 'Metadata management is always Cloud Services.' },
  { text: 'Caching recently-scanned micro-partitions locally',    answer: 'compute', hint: 'The local SSD cache lives on the Virtual Warehouse (Compute).' },
  { text: 'Auto-patching and upgrading the Snowflake platform',   answer: 'cloud',   hint: 'Infrastructure management = Cloud Services.' },
  { text: 'Billing per compressed terabyte per month',            answer: 'storage', hint: 'Storage is billed per TB/month of compressed data.' },
  { text: 'Billing per-second with a 60-second minimum',         answer: 'compute', hint: 'That per-second billing is for Virtual Warehouse compute.' },
];

const LayerQuiz = () => {
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState(false);

  const score = Object.entries(answers).filter(([qi, ans]) => ans === LAYER_QUIZ_DATA[qi].answer).length;
  const reset = () => { setAnswers({}); setRevealed(false); };

  return (
    <InfoCard>
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-violet-500" /> Which Layer Handles This?
        </h3>
        {revealed && (
          <button onClick={reset} className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 font-semibold">
            <RefreshCw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>
      <p className="text-xs text-slate-400 mb-5">
        Click the layer responsible for each task. Answer all {LAYER_QUIZ_DATA.length} to check your score.
        {revealed && <span className="ml-2 font-bold text-violet-700">Score: {score}/{LAYER_QUIZ_DATA.length}</span>}
      </p>

      <div className="space-y-3">
        {LAYER_QUIZ_DATA.map((q, qi) => {
          const picked = answers[qi];
          return (
            <div key={qi} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <p className="text-sm font-medium text-slate-700 mb-2">"{q.text}"</p>
              <div className="flex flex-wrap gap-2">
                {LAYERS.map(l => {
                  const isCorrect = l.id === q.answer;
                  const isPicked  = picked === l.id;
                  let cls = 'border-slate-200 bg-white text-slate-600 hover:border-blue-300';
                  if (revealed) {
                    if (isCorrect)         cls = 'border-emerald-400 bg-emerald-50 text-emerald-800 font-bold';
                    else if (isPicked)     cls = 'border-red-300 bg-red-50 text-red-700 line-through opacity-60';
                    else                   cls = 'border-slate-100 bg-white text-slate-300 opacity-40';
                  } else if (isPicked)     cls = `${l.border} ${l.lightBg} ${l.textColor} font-semibold`;
                  return (
                    <button key={l.id} disabled={revealed}
                      onClick={() => setAnswers(p => ({ ...p, [qi]: l.id }))}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${cls}`}>
                      {l.emoji} {l.label.replace(' Layer','').replace(' Services',' Svcs')}
                    </button>
                  );
                })}
              </div>
              {revealed && (
                <p className={`text-xs mt-2 italic ${picked === q.answer ? 'text-emerald-600' : 'text-red-500'}`}>
                  {picked === q.answer ? '✓ Correct! ' : '✗ Incorrect. '}{q.hint}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => setRevealed(true)}
        disabled={Object.keys(answers).length < LAYER_QUIZ_DATA.length || revealed}
        className="mt-5 w-full bg-violet-600 hover:bg-violet-700 disabled:bg-violet-200 text-white font-bold py-3 rounded-xl transition-colors text-sm">
        {revealed
          ? `Score: ${score}/${LAYER_QUIZ_DATA.length} — hit Reset to try again`
          : `Check Answers (${Object.keys(answers).length}/${LAYER_QUIZ_DATA.length} answered)`}
      </button>
    </InfoCard>
  );
};

// ── Challenge 2: Editions Quiz ────────────────────────────────────────────────
const EDITIONS_QUIZ_DATA = [
  { text: 'Multi-cluster virtual warehouses for high concurrency',       answer: 'Enterprise',       hint: 'Multi-cluster = auto-scale for concurrency = Enterprise+.' },
  { text: 'Dynamic Data Masking (column-level security)',                answer: 'Enterprise',       hint: 'Column-level security requires Enterprise or higher.' },
  { text: 'Row Access Policies (row-level security)',                    answer: 'Enterprise',       hint: 'Row-level security is also an Enterprise+ feature.' },
  { text: 'Tri-Secret Secure (customer-managed encryption keys)',        answer: 'Business Critical', hint: 'Customer-managed KMS keys = Business Critical.' },
  { text: 'HIPAA and HITRUST CSF compliance support for PHI data',      answer: 'Business Critical', hint: 'PHI / HIPAA compliance certifications = Business Critical.' },
  { text: 'Database Failover and Failback for business continuity',      answer: 'Business Critical', hint: 'Failover/failback is a BC/DR feature — Business Critical.' },
  { text: 'AWS PrivateLink / Azure Private Link network isolation',      answer: 'Business Critical', hint: 'Private network connectivity = Business Critical.' },
  { text: 'Completely dedicated Snowflake infrastructure',               answer: 'VPS',              hint: 'Dedicated isolated environment = Virtual Private Snowflake.' },
  { text: 'No shared cloud resources with any other Snowflake account', answer: 'VPS',              hint: 'VPS is the only edition with zero shared hardware.' },
  { text: 'Core SQL, encryption, Snowpipe, Streams, Tasks, Snowpark',   answer: 'Standard',         hint: 'All these core features are available in Standard edition.' },
  { text: 'Materialized Views and Search Optimization Service',          answer: 'Enterprise',       hint: 'These advanced performance features require Enterprise.' },
  { text: 'Snowflake Marketplace access (public listings)',              answer: 'Standard',         hint: 'Marketplace is available from Standard — VPS is the exception (no public listings).' },
];

const EDITION_OPTIONS = ['Standard', 'Enterprise', 'Business Critical', 'VPS'];
const EDITION_COLORS  = {
  'Standard':          'border-slate-300 bg-slate-50 text-slate-700',
  'Enterprise':        'border-blue-300 bg-blue-50 text-blue-800',
  'Business Critical': 'border-amber-300 bg-amber-50 text-amber-800',
  'VPS':               'border-rose-300 bg-rose-50 text-rose-800',
};

const EditionsQuiz = () => {
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState(false);

  const score = Object.entries(answers).filter(([qi, ans]) => ans === EDITIONS_QUIZ_DATA[qi].answer).length;
  const reset = () => { setAnswers({}); setRevealed(false); };

  return (
    <InfoCard>
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-violet-500" /> Which Edition Introduces This?
        </h3>
        {revealed && (
          <button onClick={reset} className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 font-semibold">
            <RefreshCw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>
      <p className="text-xs text-slate-400 mb-5">
        Select the <em>minimum</em> edition that includes each feature. Answer all {EDITIONS_QUIZ_DATA.length} to check your score.
        {revealed && <span className="ml-2 font-bold text-violet-700">Score: {score}/{EDITIONS_QUIZ_DATA.length}</span>}
      </p>

      <div className="space-y-3">
        {EDITIONS_QUIZ_DATA.map((q, qi) => {
          const picked = answers[qi];
          return (
            <div key={qi} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <p className="text-sm font-medium text-slate-700 mb-2">"{q.text}"</p>
              <div className="flex flex-wrap gap-2">
                {EDITION_OPTIONS.map(opt => {
                  const isCorrect = opt === q.answer;
                  const isPicked  = picked === opt;
                  let cls = `${EDITION_COLORS[opt]} border hover:opacity-80`;
                  if (revealed) {
                    if (isCorrect)     cls = 'border-emerald-400 bg-emerald-50 text-emerald-800 font-bold';
                    else if (isPicked) cls = 'border-red-300 bg-red-50 text-red-700 line-through opacity-60';
                    else               cls = 'border-slate-100 bg-white text-slate-300 opacity-40';
                  } else if (isPicked) cls = `${EDITION_COLORS[opt]} border-2 font-semibold`;
                  return (
                    <button key={opt} disabled={revealed}
                      onClick={() => setAnswers(p => ({ ...p, [qi]: opt }))}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${cls}`}>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {revealed && (
                <p className={`text-xs mt-2 italic ${picked === q.answer ? 'text-emerald-600' : 'text-red-500'}`}>
                  {picked === q.answer ? '✓ Correct! ' : `✗ Incorrect — minimum edition is ${q.answer}. `}{q.hint}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => setRevealed(true)}
        disabled={Object.keys(answers).length < EDITIONS_QUIZ_DATA.length || revealed}
        className="mt-5 w-full bg-violet-600 hover:bg-violet-700 disabled:bg-violet-200 text-white font-bold py-3 rounded-xl transition-colors text-sm">
        {revealed
          ? `Score: ${score}/${EDITIONS_QUIZ_DATA.length} — hit Reset to try again`
          : `Check Answers (${Object.keys(answers).length}/${EDITIONS_QUIZ_DATA.length} answered)`}
      </button>
    </InfoCard>
  );
};

// ── Challenge 3: Horizon Pillar Sorter ────────────────────────────────────────
const PILLARS_DATA = [
  { id: 'ai',         label: 'Context for AI',        emoji: '🤖', color: 'bg-sky-500',     light: 'bg-sky-50',     border: 'border-sky-300',     text: 'text-sky-800' },
  { id: 'discovery',  label: 'Data Discovery',         emoji: '🔍', color: 'bg-indigo-500',  light: 'bg-indigo-50',  border: 'border-indigo-300',  text: 'text-indigo-800' },
  { id: 'security',   label: 'Security & Governance',  emoji: '🛡️', color: 'bg-violet-500',  light: 'bg-violet-50',  border: 'border-violet-300',  text: 'text-violet-800' },
  { id: 'interop',    label: 'Interoperability',        emoji: '🔗', color: 'bg-teal-500',    light: 'bg-teal-50',    border: 'border-teal-300',    text: 'text-teal-800' },
  { id: 'continuity', label: 'Business Continuity',    emoji: '♻️', color: 'bg-emerald-500', light: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-800' },
];

const HORIZON_CARDS_DATA = [
  { id: 'h1',  text: 'Snowflake Intelligence natural-language Q&A',             pillar: 'ai',         hint: 'Intelligence is the AI assistant layer of Horizon.' },
  { id: 'h2',  text: 'Cortex Analyst + Cortex Search power responses',          pillar: 'ai',         hint: 'Cortex functions are the AI backbone.' },
  { id: 'h3',  text: 'One catalog for Snowflake, Iceberg & external sources',   pillar: 'discovery',  hint: 'One place for all data resources = discovery.' },
  { id: 'h4',  text: 'Internal Marketplace listings without copying data',      pillar: 'discovery',  hint: 'Share governed products in-place.' },
  { id: 'h5',  text: 'Dynamic data masking on sensitive columns',               pillar: 'security',   hint: 'Masking is a security/governance feature.' },
  { id: 'h6',  text: 'Row access policies for fine-grained filtering',         pillar: 'security',   hint: 'Row-level security = governance.' },
  { id: 'h7',  text: 'Data lineage tracking across all engines',               pillar: 'security',   hint: 'Lineage = knowing data provenance = governance.' },
  { id: 'h8',  text: 'Same metadata & permissions for Snowflake and Spark',    pillar: 'interop',    hint: 'Consistent rules across all engines = interop.' },
  { id: 'h9',  text: 'Govern Iceberg tables queried from external engines',    pillar: 'interop',    hint: 'Iceberg + external engines = interoperability.' },
  { id: 'h10', text: 'Database and account replication across regions',        pillar: 'continuity', hint: 'Replication across regions = business continuity.' },
  { id: 'h11', text: 'Failover / failback from a single management pane',      pillar: 'continuity', hint: 'Failover = continuity.' },
  { id: 'h12', text: 'Automatic sensitive data classification',                pillar: 'discovery',  hint: 'Auto-classification helps teams discover sensitive data.' },
];

const HorizonSortGame = () => {
  const [assignments, setAssignments] = useState({});
  const [selected, setSelected]       = useState(null);
  const [revealed, setRevealed]       = useState(false);

  const score = Object.entries(assignments).filter(([cid, pid]) =>
    HORIZON_CARDS_DATA.find(c => c.id === cid)?.pillar === pid
  ).length;

  const reset = () => { setAssignments({}); setSelected(null); setRevealed(false); };
  const unassigned = HORIZON_CARDS_DATA.filter(c => !assignments[c.id]);

  const pickCard = (id)    => setSelected(selected === id ? null : id);
  const dropOnPillar = (pid) => {
    if (!selected || revealed) return;
    setAssignments(p => ({ ...p, [selected]: pid }));
    setSelected(null);
  };
  const removeCard = (cid) => {
    if (revealed) return;
    setAssignments(p => { const n = { ...p }; delete n[cid]; return n; });
  };

  return (
    <InfoCard>
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-slate-800">Horizon Pillar Sorter</h3>
        <button onClick={reset} className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 font-semibold">
          <RefreshCw className="w-3 h-3" /> Reset
        </button>
      </div>
      <p className="text-xs text-slate-400 mb-4">
        <strong>Step 1:</strong> Click a capability to select it (turns blue).&nbsp;
        <strong>Step 2:</strong> Click the pillar it belongs to. Click a placed chip to unplace it.
        {revealed && <span className="ml-2 font-bold text-violet-700">Score: {score}/12</span>}
      </p>

      {/* Card pool */}
      {unassigned.length > 0 && (
        <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Capabilities to sort — {unassigned.length} remaining
          </p>
          <div className="flex flex-wrap gap-2">
            {unassigned.map(c => (
              <button key={c.id} onClick={() => pickCard(c.id)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                  selected === c.id
                    ? 'bg-violet-600 text-white border-violet-600 shadow-md scale-105'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-violet-300 hover:bg-violet-50'
                }`}>
                {c.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pillar zones */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        {PILLARS_DATA.map(p => {
          const here = HORIZON_CARDS_DATA.filter(c => assignments[c.id] === p.id);
          return (
            <div key={p.id} onClick={() => dropOnPillar(p.id)}
              className={`rounded-xl border-2 p-3 min-h-[90px] transition-all ${
                selected ? `${p.border} ${p.light} shadow-md cursor-pointer` : 'border-slate-200 bg-slate-50'
              }`}>
              <p className={`text-xs font-bold mb-2 ${p.text}`}>{p.emoji} {p.label}</p>
              <div className="flex flex-wrap gap-1">
                {here.map(c => {
                  const ok = c.pillar === p.id;
                  return (
                    <span key={c.id} onClick={e => { e.stopPropagation(); removeCard(c.id); }}
                      title="Click to remove"
                      className={`text-[10px] px-2 py-1 rounded-full border cursor-pointer transition-all ${
                        revealed
                          ? ok ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                               : 'bg-red-100 border-red-300 text-red-700 line-through'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-red-50 hover:border-red-300'
                      }`}>
                      {c.text.length > 32 ? c.text.slice(0,32)+'…' : c.text}
                    </span>
                  );
                })}
              </div>
              {selected && here.length === 0 && (
                <p className={`text-[10px] italic ${p.text} opacity-40`}>Drop here</p>
              )}
            </div>
          );
        })}
      </div>

      {!revealed ? (
        <button onClick={() => setRevealed(true)}
          disabled={Object.keys(assignments).length < HORIZON_CARDS_DATA.length}
          className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-violet-200 text-white font-bold py-3 rounded-xl text-sm transition-colors">
          Check Answers ({Object.keys(assignments).length}/12 sorted)
        </button>
      ) : (
        <div className="space-y-2">
          <p className="text-center font-bold text-slate-700 text-lg">
            {score === 12 ? '🎉 Perfect!' : `${score}/12 correct`}
          </p>
          {HORIZON_CARDS_DATA.filter(c => assignments[c.id] !== c.pillar).map(c => (
            <div key={c.id} className="text-xs bg-red-50 border border-red-200 rounded-lg p-2.5 text-red-700">
              <span className="font-bold">"{c.text}"</span> → belongs to{' '}
              <span className="font-bold text-violet-700">
                {PILLARS_DATA.find(p=>p.id===c.pillar)?.emoji} {PILLARS_DATA.find(p=>p.id===c.pillar)?.label}
              </span>. {c.hint}
            </div>
          ))}
        </div>
      )}
    </InfoCard>
  );
};

// ── Challenge 3: Tool Scenarios ───────────────────────────────────────────────
const SCENARIOS_DATA = [
  { q: 'A BI analyst wants to run SQL, view dashboards, and explore data — all in a browser with zero install.', answer: 'snowsight',    exp: 'Snowsight is the web-based primary UI — no installation needed.' },
  { q: 'A DevOps engineer needs to provision warehouses, databases, and roles as version-controlled infrastructure.', answer: 'terraform',    exp: 'Terraform Provider manages Snowflake resources declaratively as code.' },
  { q: 'A data engineer wants to trigger Snowflake queries and load data from a custom Python microservice.', answer: 'python',       exp: 'The Python Connector (or Snowpark) is the standard programmatic interface from Python.' },
  { q: 'An event-streaming pipeline needs to continuously push Kafka topic messages into a Snowflake table.', answer: 'kafka',        exp: 'The Kafka Connector is built specifically for Kafka → Snowflake ingestion.' },
  { q: 'A developer wants Snowflake SQL autocomplete and object browsing without leaving VS Code.', answer: 'vscode',       exp: 'The VS Code Extension adds SQL IntelliSense and object explorer inside VS Code.' },
  { q: 'A team wants to run existing Apache Spark jobs directly against data stored in Snowflake.', answer: 'spark',        exp: 'The Spark Connector bridges Spark workloads with Snowflake storage.' },
  { q: 'An admin needs to call an external payment REST API from inside a Snowflake SQL query.', answer: 'api_int',     exp: 'API Integration enables External Functions — calling external REST APIs from SQL.' },
  { q: 'A team needs to connect Power BI or Tableau directly to Snowflake for reporting.', answer: 'jdbc_odbc',   exp: 'JDBC/ODBC are the standard protocols for BI tools.' },
  { q: 'An admin wants to automate database setup via shell scripts in a CI/CD pipeline.', answer: 'snow_cli',    exp: 'Snowflake CLI is the modern choice for scripting and automation.' },
  { q: 'A Snowflake stage must connect to S3 securely without storing AWS credentials inside Snowflake.', answer: 'storage_int', exp: 'Storage Integration uses cloud IAM roles — no credentials stored in Snowflake.' },
  { q: 'A dev team wants to version-control stored procedures and UDFs in a remote Git repository.', answer: 'git_int',     exp: 'Git Integration links a Git repo to a Snowflake stage for code versioning.' },
  { q: 'A user is getting connection errors when trying to reach Snowflake. Which tool diagnoses the issue?', answer: 'snowcd',      exp: 'SnowCD (Snowflake Connectivity Diagnostic) is built specifically to identify and fix connectivity problems.' },
  { q: 'A serverless app needs to submit SQL statements to Snowflake over HTTPS without installing any driver.', answer: 'sql_api',     exp: 'The Snowflake SQL API is a REST API — perfect for serverless or browser-based apps with no driver.' },
];

const ToolScenarioGame = () => {
  const [current, setCurrent] = useState(0);
  const [picked,  setPicked]  = useState(null);
  const [score,   setScore]   = useState(0);
  const [history, setHistory] = useState([]);
  const [done,    setDone]    = useState(false);

  const scenario  = SCENARIOS_DATA[current];
  const isCorrect = picked === scenario?.answer;

  const handlePick = useCallback((toolId) => {
    if (picked) return;
    const correct = toolId === scenario.answer;
    setPicked(toolId);
    if (correct) setScore(s => s + 1);
    setHistory(h => [...h, { ...scenario, picked: toolId, correct }]);
  }, [picked, scenario]);

  const next  = () => { if (current + 1 >= SCENARIOS_DATA.length) setDone(true); else { setCurrent(c=>c+1); setPicked(null); }};
  const reset = () => { setCurrent(0); setPicked(null); setScore(0); setHistory([]); setDone(false); };

  if (done) return (
    <div className="space-y-4">
      <InfoCard className="text-center py-8">
        <p className="text-5xl mb-3">{score / SCENARIOS_DATA.length >= 0.9 ? '🎉' : score / SCENARIOS_DATA.length >= 0.7 ? '👍' : '📚'}</p>
        <h3 className="text-2xl font-bold text-slate-800 mb-1">Challenge Complete!</h3>
        <p className="text-slate-500 mb-5">
          You scored <span className="font-bold text-violet-700 text-xl">{score}</span> / {SCENARIOS_DATA.length}
        </p>
        <button onClick={reset} className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-8 py-3 rounded-xl">Retry</button>
      </InfoCard>
      <InfoCard>
        <h3 className="font-bold text-slate-700 mb-3">Full Review</h3>
        <div className="space-y-2">
          {history.map((h, i) => (
            <div key={i} className={`p-3 rounded-xl border text-xs ${h.correct ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
              <p className="font-medium text-slate-600 mb-1">{h.q}</p>
              {h.correct
                ? <p className="text-emerald-700 font-bold">✓ {ALL_TOOLS.find(t=>t.id===h.answer)?.name}</p>
                : <p className="text-red-700">✗ You picked <span className="font-bold">{ALL_TOOLS.find(t=>t.id===h.picked)?.name}</span> — correct: <span className="font-bold">{ALL_TOOLS.find(t=>t.id===h.answer)?.name}</span></p>
              }
            </div>
          ))}
        </div>
      </InfoCard>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-slate-700">Scenario {current + 1} of {SCENARIOS_DATA.length}</span>
          <span className="text-xs font-semibold text-violet-600">Score: {score}</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div className="bg-violet-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(current / SCENARIOS_DATA.length) * 100}%` }} />
        </div>
      </div>

      {/* Question */}
      <InfoCard>
        <p className="text-[10px] font-bold text-violet-600 uppercase tracking-wider mb-2">Scenario</p>
        <p className="text-base font-semibold text-slate-800 leading-relaxed mb-5">{scenario.q}</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {ALL_TOOLS.map(tool => {
            const TIcon = tool.icon;
            const isAnswer = tool.id === scenario.answer;
            const isPicked = tool.id === picked;
            let cls = 'border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50';
            if (picked) {
              if (isAnswer)        cls = 'border-emerald-400 bg-emerald-50 font-bold';
              else if (isPicked)   cls = 'border-red-300 bg-red-50 opacity-70';
              else                 cls = 'border-slate-100 bg-slate-50 opacity-30';
            }
            return (
              <button key={tool.id} disabled={!!picked} onClick={() => handlePick(tool.id)}
                className={`flex items-center gap-2 px-3 py-3 rounded-xl border transition-all text-left ${cls}`}>
                <div className={`p-1.5 rounded-lg flex-shrink-0 ${
                  picked && isAnswer ? 'bg-emerald-500' : picked && isPicked ? 'bg-red-400' : tool.color
                }`}>
                  <TIcon className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 leading-tight">{tool.name}</p>
                  <p className="text-[10px] text-slate-400">{tool.category}</p>
                </div>
                {picked && isAnswer && <CheckCircle className="w-4 h-4 text-emerald-500 ml-auto flex-shrink-0" />}
                {picked && isPicked && !isAnswer && <XCircle className="w-4 h-4 text-red-400 ml-auto flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        {picked && (
          <div className={`mt-4 p-4 rounded-xl border ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
            <p className={`text-sm font-bold mb-1 ${isCorrect ? 'text-emerald-800' : 'text-red-800'}`}>
              {isCorrect ? '✓ Correct!' : `✗ Answer: ${ALL_TOOLS.find(t => t.id === scenario.answer)?.name}`}
            </p>
            <p className={`text-sm ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>{scenario.exp}</p>
            <button onClick={next}
              className="mt-3 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors">
              {current + 1 < SCENARIOS_DATA.length ? 'Next →' : 'See Results'}
            </button>
          </div>
        )}
      </InfoCard>
    </div>
  );
};

// ── Challenge 5: Storage Concepts MCQ ────────────────────────────────────────
const STORAGE_MCQ_DATA = [
  {
    q: 'What is the size range of a Snowflake micro-partition (uncompressed)?',
    options: ['1 MB – 10 MB', '50 MB – 500 MB', '1 GB – 10 GB', '5 MB – 50 MB'],
    answer: '50 MB – 500 MB',
    hint: 'Micro-partitions are 50–500 MB of uncompressed data — stored compressed so physically smaller.',
  },
  {
    q: 'A Temporary table is dropped automatically when…',
    options: ['The database is restarted', 'The session ends', 'After 24 hours', 'The user logs out'],
    answer: 'The session ends',
    hint: 'Temporary tables are session-scoped — they vanish the moment the session closes.',
  },
  {
    q: 'Which table type persists across sessions but has NO Fail-safe period?',
    options: ['Permanent', 'Temporary', 'Transient', 'External'],
    answer: 'Transient',
    hint: 'Transient tables persist until dropped but have 0 days of Fail-safe — useful for dev/test scratch data.',
  },
  {
    q: 'Which SQL command suspends Automatic Clustering on a table?',
    options: [
      'ALTER TABLE t DROP CLUSTERING KEY',
      'ALTER TABLE t SUSPEND RECLUSTER',
      'ALTER TABLE t DISABLE CLUSTERING',
      'ALTER TABLE t PAUSE CLUSTER BY',
    ],
    answer: 'ALTER TABLE t SUSPEND RECLUSTER',
    hint: 'SUSPEND RECLUSTER pauses credit spend without removing the clustering key. RESUME RECLUSTER re-enables it.',
  },
  {
    q: 'What is the maximum recommended number of columns in a Snowflake clustering key?',
    options: ['1', '2', '3–4', '10'],
    answer: '3–4',
    hint: 'Snowflake recommends max 3–4 columns per clustering key. More columns increases cost faster than benefit.',
  },
  {
    q: 'Which view type hides its DDL definition from non-owners to protect data privacy?',
    options: ['Standard view', 'Secure view', 'Materialized view', 'External table'],
    answer: 'Secure view',
    hint: 'Secure views hide the view definition — a non-owner cannot see the WHERE clause or underlying logic.',
  },
  {
    q: 'An External table in Snowflake is…',
    options: [
      'A table stored outside the account region',
      'A read-only table whose data lives in a cloud stage',
      'A table that automatically syncs from an external database',
      'A transient table shared across accounts',
    ],
    answer: 'A read-only table whose data lives in a cloud stage',
    hint: 'External tables are read-only. The data files remain in S3/Azure/GCS — Snowflake queries them without loading.',
  },
  {
    q: 'What does a Materialized View do that a Standard View does not?',
    options: [
      'Hides the SQL definition from non-owners',
      'Pre-computes and physically stores the query result',
      'Allows DML operations on the view',
      'Works across different schemas automatically',
    ],
    answer: 'Pre-computes and physically stores the query result',
    hint: 'Materialized views store pre-computed results. Queries hit cached data — much faster for expensive aggregations.',
  },
  {
    q: 'Which table type is optimized for mixed transactional and analytical workloads (Unistore)?',
    options: ['Permanent', 'Dynamic', 'External', 'Hybrid'],
    answer: 'Hybrid',
    hint: 'Hybrid tables support row-locking, PK/FK constraints, and are built for Unistore — combining OLTP and OLAP.',
  },
  {
    q: 'In a multi-column clustering key, Snowflake recommends ordering columns by…',
    options: [
      'Alphabetical order',
      'Highest cardinality first',
      'Lowest cardinality first',
      'Column data type (numeric before string)',
    ],
    answer: 'Lowest cardinality first',
    hint: 'Put the lowest-cardinality column first. A high-cardinality column first reduces the effectiveness of subsequent columns.',
  },
  {
    q: 'Automatic Clustering reclustering uses which type of compute?',
    options: ['A dedicated virtual warehouse you specify', 'Serverless compute (no warehouse needed)', 'The default warehouse', 'Shared pool warehouse'],
    answer: 'Serverless compute (no warehouse needed)',
    hint: 'Automatic Clustering is serverless — Snowflake manages compute internally. No warehouse to specify or pay for.',
  },
  {
    q: 'A Dynamic table differs from a Materialized view primarily because it…',
    options: [
      'Is read-only and cannot be queried',
      'Supports a user-defined TARGET_LAG freshness SLA and replaces task chains',
      'Requires manual refresh commands',
      'Does not store any results',
    ],
    answer: 'Supports a user-defined TARGET_LAG freshness SLA and replaces task chains',
    hint: 'Dynamic tables have a TARGET_LAG parameter (freshness target) and are designed to replace complex task/stream pipelines.',
  },
];

const StorageChallenge = () => {
  const [answers,  setAnswers]  = useState({});
  const [revealed, setRevealed] = useState(false);
  const score = Object.entries(answers).filter(([qi, ans]) => ans === STORAGE_MCQ_DATA[qi].answer).length;
  const reset = () => { setAnswers({}); setRevealed(false); };

  return (
    <InfoCard>
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-violet-500" /> Storage Concepts — Knowledge Check
        </h3>
        {revealed && (
          <button onClick={reset} className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 font-semibold">
            <RefreshCw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>
      <p className="text-xs text-slate-400 mb-5">
        Select the best answer for each question. Answer all {STORAGE_MCQ_DATA.length} to check your score.
        {revealed && (
          <span className="ml-2 font-bold text-violet-700">
            Score: {score}/{STORAGE_MCQ_DATA.length} {score / STORAGE_MCQ_DATA.length >= 0.9 ? '🎉' : score / STORAGE_MCQ_DATA.length >= 0.7 ? '👍' : '📚'}
          </span>
        )}
      </p>

      <div className="space-y-4">
        {STORAGE_MCQ_DATA.map((q, qi) => {
          const picked = answers[qi];
          return (
            <div key={qi} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-800 mb-3">
                <span className="text-violet-400 font-bold mr-1">{qi + 1}.</span> {q.q}
              </p>
              <div className="grid sm:grid-cols-2 gap-2">
                {q.options.map(opt => {
                  const isCorrect = opt === q.answer;
                  const isPicked  = picked === opt;
                  let cls = 'border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:bg-violet-50';
                  if (revealed) {
                    if (isCorrect)        cls = 'border-emerald-400 bg-emerald-50 text-emerald-800 font-bold';
                    else if (isPicked)    cls = 'border-red-300 bg-red-50 text-red-700 line-through opacity-60';
                    else                  cls = 'border-slate-100 bg-white text-slate-300 opacity-40';
                  } else if (isPicked)    cls = 'border-violet-400 bg-violet-50 text-violet-800 font-semibold';
                  return (
                    <button key={opt} disabled={revealed}
                      onClick={() => setAnswers(p => ({ ...p, [qi]: opt }))}
                      className={`text-xs px-3 py-2 rounded-lg border text-left transition-all ${cls}`}>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {revealed && (
                <p className={`text-xs mt-2 italic ${picked === q.answer ? 'text-emerald-600' : 'text-red-500'}`}>
                  {picked === q.answer ? '✓ Correct! ' : `✗ Answer: ${q.answer}. `}{q.hint}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => setRevealed(true)}
        disabled={Object.keys(answers).length < STORAGE_MCQ_DATA.length || revealed}
        className="mt-5 w-full bg-violet-600 hover:bg-violet-700 disabled:bg-violet-200 text-white font-bold py-3 rounded-xl transition-colors text-sm">
        {revealed
          ? `Score: ${score}/${STORAGE_MCQ_DATA.length} — hit Reset to try again`
          : `Check Answers (${Object.keys(answers).length}/${STORAGE_MCQ_DATA.length} answered)`}
      </button>
    </InfoCard>
  );
};

export default Domain1_Architecture;
