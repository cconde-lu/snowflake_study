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
      {activeTab === 'objects'      && <ObjectsTab />}
      {activeTab === 'warehouses'   && <WarehousesTab />}
      {activeTab === 'storage'      && <StorageTab />}
      {activeTab === 'aiml'         && <AIMLTab />}
      {activeTab === 'quiz'         && <QuizTab />}
      {!['architecture','interfaces','objects','warehouses','storage','aiml','quiz'].includes(activeTab) &&
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
// LEARNING TAB 3 — 1.3 Object Hierarchy
// ═══════════════════════════════════════════════════════════════════════════════

const HIERARCHY_LEVELS = [
  {
    id: 'org',
    emoji: '🌐', label: 'Organization',
    bg: 'bg-violet-600', light: 'bg-violet-50', border: 'border-violet-300', text: 'text-violet-900',
    desc: 'Top-most container. Links all accounts owned by a business entity. Enables cross-account replication, billing consolidation, and ORGANIZATION_USAGE views.',
    objects: ['Accounts', 'Replication groups', 'Failover groups'],
    code: `-- View all accounts in your organization
SHOW ACCOUNTS;

-- Get current organization name
SELECT CURRENT_ORGANIZATION_NAME();`,
  },
  {
    id: 'account',
    emoji: '🏢', label: 'Account',
    bg: 'bg-blue-600', light: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-900',
    desc: 'Primary operating unit. Contains users, roles, warehouses, databases, and all security/governance objects. Billed independently. Identified by org_name.account_name.',
    objects: ['Users', 'Roles', 'Warehouses', 'Databases', 'Integrations', 'Network policies', 'Resource monitors'],
    code: `-- Account-level objects
CREATE USER analyst PASSWORD='xxx' DEFAULT_ROLE='analyst_role';
CREATE ROLE analyst_role;
CREATE WAREHOUSE compute_wh WAREHOUSE_SIZE='MEDIUM';
CREATE DATABASE sales_db;

-- Grant role to user
GRANT ROLE analyst_role TO USER analyst;`,
  },
  {
    id: 'database',
    emoji: '🗄️', label: 'Database',
    bg: 'bg-teal-600', light: 'bg-teal-50', border: 'border-teal-300', text: 'text-teal-900',
    desc: 'Logical grouping of schemas. No hard limits on number of databases per account. Every database automatically contains an INFORMATION_SCHEMA.',
    objects: ['Schemas', 'INFORMATION_SCHEMA (auto-created)'],
    code: `CREATE DATABASE sales_db
  DATA_RETENTION_TIME_IN_DAYS = 7;

-- Clone a database (zero-copy)
CREATE DATABASE sales_db_dev
  CLONE sales_db;`,
  },
  {
    id: 'schema',
    emoji: '📂', label: 'Schema',
    bg: 'bg-slate-600', light: 'bg-slate-50', border: 'border-slate-300', text: 'text-slate-900',
    desc: 'Logical grouping of database objects (tables, views, stages, etc.). The PUBLIC schema is auto-created in every database. Schemas can be TRANSIENT.',
    objects: ['Tables', 'Views', 'Stages', 'File Formats', 'Sequences', 'Pipes', 'Streams', 'Tasks', 'UDFs', 'Stored Procedures', 'Shares', 'ML Models', 'Applications'],
    code: `CREATE SCHEMA sales_db.raw;
CREATE TRANSIENT SCHEMA sales_db.staging;

-- Show all schemas in a database
SHOW SCHEMAS IN DATABASE sales_db;`,
  },
];

const DB_OBJECTS_DATA = [
  {
    id: 'stage',
    emoji: '📤', label: 'Stage',
    color: 'bg-blue-50 border-blue-200', text: 'text-blue-800',
    desc: 'Named storage location for data files used in loading/unloading. Three types: User, Table, and Named stages.',
    subtypes: [
      { name: 'User Stage',  note: '@~  — one per user, auto-created, private' },
      { name: 'Table Stage', note: '@%tablename  — one per table, auto-created' },
      { name: 'Named Stage', note: 'Explicit CREATE STAGE — can be internal or external (cloud)' },
    ],
    code: `-- Internal named stage
CREATE STAGE my_internal_stage;

-- External stage (S3 via storage integration)
CREATE STAGE my_s3_stage
  URL = 's3://my-bucket/path/'
  STORAGE_INTEGRATION = my_s3_int;

-- List files in stage
LIST @my_internal_stage;`,
  },
  {
    id: 'udf',
    emoji: '🔧', label: 'UDF (User-Defined Function)',
    color: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-800',
    desc: 'Custom scalar or tabular function callable from SQL. Supports Java, JavaScript, Python, SQL. Returns a value — does NOT execute DML.',
    subtypes: [
      { name: 'Scalar UDF',   note: 'Returns one value per row' },
      { name: 'Tabular UDF (UDTF)', note: 'Returns a set of rows per input row' },
      { name: 'Secure UDF',   note: 'Hides implementation — like secure views' },
    ],
    code: `-- JavaScript scalar UDF
CREATE OR REPLACE FUNCTION add_tax(price FLOAT, rate FLOAT)
  RETURNS FLOAT
  LANGUAGE JAVASCRIPT
AS $$
  return PRICE * (1 + RATE);
$$;

-- Python UDF
CREATE OR REPLACE FUNCTION to_upper(s STRING)
  RETURNS STRING
  LANGUAGE PYTHON
  RUNTIME_VERSION = '3.11'
  HANDLER = 'compute'
AS $$
def compute(s): return s.upper()
$$;

SELECT add_tax(100.0, 0.08);  -- → 108.0`,
  },
  {
    id: 'fileformat',
    emoji: '📋', label: 'File Format',
    color: 'bg-amber-50 border-amber-200', text: 'text-amber-800',
    desc: 'Named object that describes the format of staged data files. Reusable across COPY INTO commands and external tables. Supported: CSV, JSON, Avro, ORC, Parquet, XML.',
    subtypes: [],
    code: `-- Create a reusable CSV file format
CREATE FILE FORMAT my_csv_fmt
  TYPE = 'CSV'
  FIELD_DELIMITER = ','
  SKIP_HEADER = 1
  NULL_IF = ('NULL', 'null')
  EMPTY_FIELD_AS_NULL = TRUE;

-- Use it in a COPY command
COPY INTO orders
  FROM @my_stage
  FILE_FORMAT = (FORMAT_NAME = 'my_csv_fmt');`,
  },
  {
    id: 'storedproc',
    emoji: '⚙️', label: 'Stored Procedure',
    color: 'bg-rose-50 border-rose-200', text: 'text-rose-800',
    desc: 'Procedural logic with branching, looping, and DML. Can run with caller\'s rights or owner\'s rights. Supports Java, JavaScript, Python, Scala, SQL Scripting.',
    subtypes: [
      { name: "Caller's rights", note: 'Runs with privileges of the CALLING role' },
      { name: "Owner's rights",  note: "Runs with privileges of the OWNER's role (default)" },
    ],
    code: `-- Python stored procedure
CREATE OR REPLACE PROCEDURE clean_old_data(cutoff_date DATE)
  RETURNS STRING
  LANGUAGE PYTHON
  RUNTIME_VERSION = '3.11'
  PACKAGES = ('snowflake-snowpark-python')
  HANDLER = 'run'
AS $$
def run(session, cutoff_date):
  session.sql(
    f"DELETE FROM orders WHERE order_date < '{cutoff_date}'"
  ).collect()
  return 'Done'
$$;

CALL clean_old_data('2023-01-01');`,
  },
  {
    id: 'pipe',
    emoji: '🚿', label: 'Pipe',
    color: 'bg-cyan-50 border-cyan-200', text: 'text-cyan-800',
    desc: 'Powers Snowpipe — auto-ingest files as soon as they land in a stage. Uses a COPY INTO statement internally. Near-real-time micro-batch loading.',
    subtypes: [],
    code: `CREATE PIPE orders_pipe
  AUTO_INGEST = TRUE
AS
  COPY INTO orders
  FROM @my_s3_stage
  FILE_FORMAT = (TYPE = 'JSON');

-- Check pipe status
SELECT SYSTEM$PIPE_STATUS('orders_pipe');

-- Pause / resume
ALTER PIPE orders_pipe PAUSE;
ALTER PIPE orders_pipe RESUME;`,
  },
  {
    id: 'share',
    emoji: '🤝', label: 'Share',
    color: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-800',
    desc: 'Snowflake Secure Data Sharing object. Provider creates a share, adds objects (databases, tables, views), and grants to consumer accounts — zero data movement.',
    subtypes: [],
    code: `-- Provider side: create and populate a share
CREATE SHARE sales_share;
GRANT USAGE ON DATABASE sales_db TO SHARE sales_share;
GRANT USAGE ON SCHEMA   sales_db.public TO SHARE sales_share;
GRANT SELECT ON TABLE   sales_db.public.orders TO SHARE sales_share;

-- Grant share to a consumer account
ALTER SHARE sales_share
  ADD ACCOUNTS = org_name.consumer_acct;

-- Consumer side: create a database from the share
CREATE DATABASE shared_sales
  FROM SHARE provider_org.provider_acct.sales_share;`,
  },
  {
    id: 'sequence',
    emoji: '🔢', label: 'Sequence',
    color: 'bg-purple-50 border-purple-200', text: 'text-purple-800',
    desc: 'Generates unique, sequential integer values. Used as surrogate keys. Values are guaranteed unique but NOT guaranteed gap-free (due to concurrency).',
    subtypes: [],
    code: `CREATE SEQUENCE order_seq
  START = 1
  INCREMENT = 1;

-- Use in INSERT
INSERT INTO orders (order_id, customer)
  VALUES (order_seq.NEXTVAL, 'Acme Corp');

-- Or as column default
CREATE TABLE orders (
  order_id NUMBER DEFAULT order_seq.NEXTVAL,
  customer STRING
);`,
  },
  {
    id: 'mlmodel',
    emoji: '🤖', label: 'ML Model',
    color: 'bg-sky-50 border-sky-200', text: 'text-sky-800',
    desc: 'Registered ML model stored in the Snowflake Model Registry. Supports Python-based models (scikit-learn, XGBoost, PyTorch, etc.). Callable from SQL via model methods.',
    subtypes: [],
    code: `-- Register a model from a Snowpark ML pipeline
-- (after training with Snowpark ML)
reg = Registry(session=session, database_name="ML_DB",
               schema_name="MODELS")
mv = reg.log_model(my_model,
  model_name="churn_predictor",
  version_name="v1",
  sample_input_data=X_train)

-- Call the model from SQL
SELECT churn_predictor!PREDICT(features) AS prediction
FROM customer_features;`,
  },
  {
    id: 'application',
    emoji: '📦', label: 'Application',
    color: 'bg-orange-50 border-orange-200', text: 'text-orange-800',
    desc: 'Snowflake Native App — a packaged application built using the Native App Framework. Can include Streamlit UIs, stored procedures, UDFs, and container workloads.',
    subtypes: [],
    code: `-- Create an application package (provider side)
CREATE APPLICATION PACKAGE my_app_pkg;

-- Create the application (consumer installs it)
CREATE APPLICATION my_app
  FROM APPLICATION PACKAGE my_app_pkg
  USING VERSION v1;

-- Installed apps appear as database-like objects
SHOW APPLICATIONS;`,
  },
];

const PARAM_LEVELS = [
  {
    id: 'account',
    emoji: '🏢', label: 'Account Level',
    bg: 'bg-blue-600', light: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-900',
    who: 'ACCOUNTADMIN / SYSADMIN',
    scope: 'Sets defaults for ALL users and sessions in the account',
    examples: ['TIMEZONE', 'DATA_RETENTION_TIME_IN_DAYS', 'NETWORK_POLICY', 'MIN_DATA_RETENTION_TIME_IN_DAYS'],
    code: `ALTER ACCOUNT SET TIMEZONE = 'America/Chicago';
ALTER ACCOUNT SET DATA_RETENTION_TIME_IN_DAYS = 7;`,
  },
  {
    id: 'user',
    emoji: '👤', label: 'User Level',
    bg: 'bg-indigo-600', light: 'bg-indigo-50', border: 'border-indigo-300', text: 'text-indigo-900',
    who: 'SECURITYADMIN or the user themselves',
    scope: 'Overrides account defaults for that specific user. Becomes default for all their sessions.',
    examples: ['DEFAULT_ROLE', 'DEFAULT_WAREHOUSE', 'DEFAULT_NAMESPACE', 'TIMEZONE'],
    code: `ALTER USER analyst
  SET DEFAULT_ROLE = 'analyst_role'
      DEFAULT_WAREHOUSE = 'analyst_wh'
      TIMEZONE = 'UTC';`,
  },
  {
    id: 'session',
    emoji: '💻', label: 'Session Level',
    bg: 'bg-teal-600', light: 'bg-teal-50', border: 'border-teal-300', text: 'text-teal-900',
    who: 'Any user — applies to current session only',
    scope: 'Temporary override for the current connection. Cleared when the session ends.',
    examples: ['TIMEZONE', 'QUERY_TAG', 'STATEMENT_TIMEOUT_IN_SECONDS', 'DATE_INPUT_FORMAT'],
    code: `ALTER SESSION SET TIMEZONE = 'Europe/London';
ALTER SESSION SET QUERY_TAG = 'etl-pipeline-run-123';
ALTER SESSION SET STATEMENT_TIMEOUT_IN_SECONDS = 300;

-- View current session parameters
SHOW PARAMETERS IN SESSION;`,
  },
  {
    id: 'object',
    emoji: '📦', label: 'Object Level',
    bg: 'bg-slate-600', light: 'bg-slate-50', border: 'border-slate-300', text: 'text-slate-900',
    who: 'User with CREATE/ALTER privilege on that object',
    scope: 'Applies to a specific object only (table, warehouse, schema, etc.)',
    examples: ['DATA_RETENTION_TIME_IN_DAYS (table)', 'MAX_CONCURRENCY_LEVEL (warehouse)', 'AUTO_SUSPEND (warehouse)'],
    code: `-- Override Time Travel at table level
ALTER TABLE orders
  SET DATA_RETENTION_TIME_IN_DAYS = 30;

-- Override at warehouse level
ALTER WAREHOUSE compute_wh
  SET MAX_CONCURRENCY_LEVEL = 8
      AUTO_SUSPEND = 120;`,
  },
];

const CONTEXT_FUNCTIONS = [
  { fn: 'CURRENT_ACCOUNT()',         desc: 'Returns the name of the current account' },
  { fn: 'CURRENT_ORGANIZATION_NAME()', desc: 'Returns the org name' },
  { fn: 'CURRENT_USER()',            desc: 'Returns the logged-in user name' },
  { fn: 'CURRENT_ROLE()',            desc: 'Returns the active role in the session' },
  { fn: 'CURRENT_DATABASE()',        desc: 'Returns the active database' },
  { fn: 'CURRENT_SCHEMA()',          desc: 'Returns the active schema' },
  { fn: 'CURRENT_WAREHOUSE()',       desc: 'Returns the active virtual warehouse' },
  { fn: 'CURRENT_SESSION()',         desc: 'Returns a unique session identifier' },
  { fn: 'CURRENT_TIMESTAMP()',       desc: 'Returns the current date and time (with timezone)' },
  { fn: 'LAST_QUERY_ID()',           desc: 'Returns the query ID of the most recent query in the session' },
];

const ObjectsTab = () => {
  const [activeLevel,   setActiveLevel]   = useState(null);
  const [activeObj,     setActiveObj]     = useState(null);
  const [activeParam,   setActiveParam]   = useState(null);
  const [explorerLevel, setExplorerLevel] = useState('org');

  const currentHierarchy = HIERARCHY_LEVELS.find(l => l.id === explorerLevel);

  return (
    <div className="space-y-5">

      {/* ── Interactive Hierarchy Explorer ── */}
      <InfoCard>
        <SectionHeader icon={Layers} color="bg-blue-600" title="Snowflake Object Hierarchy"
          subtitle="Click each level to explore what objects live there and the key SQL patterns." />

        {/* Funnel / pyramid navigator */}
        <div className="flex flex-col gap-1.5 mb-4">
          {HIERARCHY_LEVELS.map((lvl, i) => (
            <button key={lvl.id} onClick={() => setExplorerLevel(lvl.id)}
              style={{ marginLeft: `${i * 12}px`, marginRight: `${i * 12}px` }}
              className={`rounded-xl border-2 px-4 py-3 flex items-center justify-between transition-all ${
                explorerLevel === lvl.id
                  ? `${lvl.light} ${lvl.border} shadow-md`
                  : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
              }`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{lvl.emoji}</span>
                <span className={`font-bold text-sm ${explorerLevel === lvl.id ? lvl.text : 'text-slate-700'}`}>
                  {lvl.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white hidden sm:block ${lvl.bg}`}>
                  Level {i + 1}
                </span>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${explorerLevel === lvl.id ? 'rotate-90' : ''}`} />
              </div>
            </button>
          ))}
        </div>

        {/* Level detail panel */}
        {currentHierarchy && (
          <div className={`rounded-xl border-2 ${currentHierarchy.border} ${currentHierarchy.light} p-5 space-y-4`}>
            <p className={`text-sm leading-relaxed ${currentHierarchy.text}`}>{currentHierarchy.desc}</p>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Contains</p>
              <div className="flex flex-wrap gap-1.5">
                {currentHierarchy.objects.map((o, i) => (
                  <span key={i} className={`text-xs px-2.5 py-1 rounded-full border font-medium ${currentHierarchy.light} ${currentHierarchy.border} ${currentHierarchy.text}`}>
                    {o}
                  </span>
                ))}
              </div>
            </div>
            <CodeBlock code={currentHierarchy.code} />
          </div>
        )}

        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
          <p className="text-xs font-bold text-yellow-700 mb-1">⚡ Exam Tip — Hierarchy</p>
          <ul className="text-xs text-yellow-700 space-y-1 list-disc pl-4">
            <li><strong>Organization → Account → Database → Schema → Object</strong> — memorize this chain.</li>
            <li>Account is the <strong>primary billing and security boundary</strong> in Snowflake.</li>
            <li>Every database automatically gets a <strong>PUBLIC schema</strong> and an <strong>INFORMATION_SCHEMA</strong>.</li>
            <li>Account-level objects (warehouses, users, roles) are <strong>not inside</strong> any database.</li>
          </ul>
        </div>
      </InfoCard>

      {/* ── Database Objects Explorer ── */}
      <InfoCard>
        <SectionHeader icon={Database} color="bg-blue-600" title="Database Objects"
          subtitle="Objects that live inside a schema. Click each card to see details and SQL patterns." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
          {DB_OBJECTS_DATA.map((obj) => (
            <button key={obj.id} onClick={() => setActiveObj(activeObj === obj.id ? null : obj.id)}
              className={`rounded-xl border text-left p-3 transition-all ${
                activeObj === obj.id ? obj.color + ' shadow-md border-2' : 'border-slate-100 bg-slate-50 hover:border-blue-200'
              }`}>
              <p className="text-xl mb-1">{obj.emoji}</p>
              <p className={`font-bold text-xs ${activeObj === obj.id ? obj.text : 'text-slate-800'}`}>{obj.label}</p>
              <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2 leading-snug">{obj.desc.split('.')[0]}.</p>
            </button>
          ))}
        </div>

        {/* Expanded object detail */}
        {activeObj && (() => {
          const obj = DB_OBJECTS_DATA.find(o => o.id === activeObj);
          return (
            <div className={`rounded-xl border-2 p-5 space-y-3 ${obj.color}`}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{obj.emoji}</span>
                <div>
                  <p className={`font-bold text-base ${obj.text}`}>{obj.label}</p>
                  <p className="text-xs text-slate-500">{obj.desc}</p>
                </div>
              </div>
              {obj.subtypes.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Subtypes / Variants</p>
                  <div className="space-y-1">
                    {obj.subtypes.map((s, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs bg-white/70 rounded-lg px-3 py-2">
                        <CheckCircle className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${obj.text}`} />
                        <span><strong>{s.name}</strong> — {s.note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <CodeBlock code={obj.code} />
            </div>
          );
        })()}
      </InfoCard>

      {/* ── Parameter Hierarchy ── */}
      <InfoCard>
        <SectionHeader icon={Shield} color="bg-blue-600" title="Parameter Hierarchy & Precedence"
          subtitle="Parameters cascade from account → user → session → object. Lower levels override higher ones." />

        {/* Precedence cascade visual */}
        <div className="flex flex-col gap-1 mb-4">
          {PARAM_LEVELS.map((lvl, i) => (
            <div key={lvl.id}>
              <button onClick={() => setActiveParam(activeParam === lvl.id ? null : lvl.id)}
                className={`w-full rounded-xl border-2 px-4 py-3 flex items-center justify-between transition-all ${
                  activeParam === lvl.id ? `${lvl.light} ${lvl.border} shadow-md` : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
                }`}>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full text-white ${lvl.bg}`}>P{i + 1}</span>
                  <span className="text-lg">{lvl.emoji}</span>
                  <div className="text-left">
                    <p className={`font-bold text-sm ${activeParam === lvl.id ? lvl.text : 'text-slate-800'}`}>{lvl.label}</p>
                    <p className="text-xs text-slate-400">{lvl.who}</p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${activeParam === lvl.id ? 'rotate-90' : ''}`} />
              </button>
              {i < PARAM_LEVELS.length - 1 && (
                <div className="flex justify-center my-0.5">
                  <span className="text-xs text-slate-400 font-bold">↓ overridden by</span>
                </div>
              )}
              {activeParam === lvl.id && (
                <div className={`rounded-xl border-2 ${lvl.border} ${lvl.light} p-4 space-y-3 mt-1`}>
                  <p className={`text-sm ${lvl.text}`}>{lvl.scope}</p>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Example parameters</p>
                    <div className="flex flex-wrap gap-1.5">
                      {lvl.examples.map((e, j) => (
                        <code key={j} className={`text-[10px] px-2 py-1 rounded-lg border font-mono ${lvl.light} ${lvl.border} ${lvl.text}`}>{e}</code>
                      ))}
                    </div>
                  </div>
                  <CodeBlock code={lvl.code} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-3">
          <p className="text-xs font-bold text-blue-800 mb-2">📐 Precedence Rule</p>
          <p className="text-xs text-blue-700 leading-relaxed">
            <strong>Object</strong> overrides <strong>Session</strong> overrides <strong>User</strong> overrides <strong>Account</strong>.
            The most specific level always wins. A parameter set at the session level temporarily overrides
            what was set at the account or user level — but only for the duration of that session.
          </p>
        </div>

        <CodeBlock code={`-- View parameters at different scopes
SHOW PARAMETERS IN ACCOUNT;
SHOW PARAMETERS IN SESSION;
SHOW PARAMETERS IN USER analyst;
SHOW PARAMETERS IN WAREHOUSE compute_wh;
SHOW PARAMETERS IN TABLE orders;

-- Check a specific parameter
SHOW PARAMETERS LIKE 'TIMEZONE' IN ACCOUNT;`} />

        <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
          <p className="text-xs font-bold text-yellow-700 mb-1">⚡ Exam Tip — Parameters</p>
          <ul className="text-xs text-yellow-700 space-y-1 list-disc pl-4">
            <li>Three parameter types: <strong>Account</strong>, <strong>Session</strong>, and <strong>Object</strong>.</li>
            <li>Session parameters can be set at Account, User, <em>or</em> Session level — the lowest wins.</li>
            <li><code>ALTER SESSION SET</code> = temporary. <code>ALTER ACCOUNT SET</code> = persistent default for all.</li>
            <li><code>SHOW PARAMETERS IN SESSION</code> reveals the currently active value for every parameter.</li>
          </ul>
        </div>
      </InfoCard>

      {/* ── Context Functions ── */}
      <InfoCard>
        <SectionHeader icon={Search} color="bg-blue-600" title="Context & Session Functions"
          subtitle="Built-in functions that return metadata about the current session — commonly tested." />
        <div className="grid sm:grid-cols-2 gap-2 mb-3">
          {CONTEXT_FUNCTIONS.map((f, i) => (
            <div key={i} className="flex items-start gap-2 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
              <code className="text-xs font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded whitespace-nowrap flex-shrink-0">{f.fn}</code>
              <span className="text-xs text-slate-600">{f.desc}</span>
            </div>
          ))}
        </div>
        <CodeBlock code={`-- Common session context query
SELECT
  CURRENT_ACCOUNT()          AS account,
  CURRENT_ORGANIZATION_NAME() AS org,
  CURRENT_USER()             AS active_user,
  CURRENT_ROLE()             AS active_role,
  CURRENT_DATABASE()         AS active_db,
  CURRENT_SCHEMA()           AS active_schema,
  CURRENT_WAREHOUSE()        AS active_wh,
  CURRENT_TIMESTAMP()        AS now;`} />
      </InfoCard>

      <ExamTip>
        <p>Hierarchy: <strong>Organization → Account → Database → Schema → Object</strong>. Account is the billing and security boundary.</p>
        <p>Object precedence: <strong>Object &gt; Session &gt; User &gt; Account</strong> — most specific level always wins.</p>
        <p><strong>Stages</strong> (for loading), <strong>Pipes</strong> (Snowpipe auto-ingest), <strong>Shares</strong> (zero-copy sharing), and <strong>Sequences</strong> (unique IDs) all live in a schema.</p>
        <p>Stored procs run with <strong>owner's rights by default</strong> — callers get the proc owner's privileges, not their own.</p>
        <p>UDFs return values; they <strong>cannot execute DML</strong>. Stored procs can execute DML.</p>
      </ExamTip>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════════
// LEARNING TAB 4 — 1.4 Virtual Warehouses
// ═══════════════════════════════════════════════════════════════════════════════

const WH_SIZES = [
  { size: 'X-Small', credits: 1,   alias: 'XS', note: 'Default in SQL. Good for UI queries, small ad-hoc.' },
  { size: 'Small',   credits: 2,   alias: 'S',  note: 'Light dev/test workloads.' },
  { size: 'Medium',  credits: 4,   alias: 'M',  note: 'Standard ETL / moderate queries.' },
  { size: 'Large',   credits: 8,   alias: 'L',  note: 'Complex queries, moderate data loads.' },
  { size: 'X-Large', credits: 16,  alias: 'XL', note: 'Default in Snowsight UI. Large-scale production queries.' },
  { size: '2X-Large',credits: 32,  alias: '2XL',note: 'Heavy analytical workloads.' },
  { size: '3X-Large',credits: 64,  alias: '3XL',note: 'Very large data transformations.' },
  { size: '4X-Large',credits: 128, alias: '4XL',note: 'Massive batch jobs, ML training.' },
  { size: '5X-Large',credits: 256, alias: '5XL',note: 'GA on AWS & Azure. Extreme workloads.' },
  { size: '6X-Large',credits: 512, alias: '6XL',note: 'GA on AWS & Azure. Maximum compute.' },
];

const WH_TYPES_DATA = [
  {
    id: 'standard',
    emoji: '⚙️', label: 'Standard (Gen1 & Gen2)',
    badge: 'Default', badgeColor: 'bg-blue-600',
    color: 'bg-blue-50 border-blue-200', text: 'text-blue-900',
    when: 'SQL queries, DML, data loading/unloading, BI reporting, most general workloads.',
    gen2note: 'Gen2 warehouses deliver higher performance per credit for the same size. Not yet default or available in all regions.',
    keyFacts: [
      'Supports all SQL operations: SELECT, DML, COPY INTO',
      'Per-second billing with 60-second minimum per resume',
      'Cache (local SSD) is dropped when warehouse suspends',
      'Multi-cluster available at Enterprise edition+',
    ],
    code: `CREATE WAREHOUSE analytics_wh
  WAREHOUSE_SIZE   = 'LARGE'
  WAREHOUSE_TYPE   = 'STANDARD'   -- default, can omit
  AUTO_SUSPEND     = 300          -- seconds (5 min)
  AUTO_RESUME      = TRUE
  MIN_CLUSTER_COUNT = 1
  MAX_CLUSTER_COUNT = 3           -- Enterprise+ feature
  SCALING_POLICY   = 'STANDARD';  -- or 'ECONOMY'`,
  },
  {
    id: 'snowpark',
    emoji: '🧠', label: 'Snowpark-Optimized',
    badge: 'ML / High-memory', badgeColor: 'bg-violet-600',
    color: 'bg-violet-50 border-violet-200', text: 'text-violet-900',
    when: 'ML model training, large Snowpark Python/Java/Scala workloads that need high memory per node.',
    gen2note: 'Provides 16× more memory per node vs standard by default. Can be configured up to 1 TB (preview on AWS).',
    keyFacts: [
      'Default: 16× memory per node (MEMORY_16X)',
      'Can scale to 256 GB (MEMORY_16X) or 1 TB (MEMORY_64X preview)',
      'Supports CPU architecture selection (default or x86)',
      'Takes longer to start than standard warehouses',
      'NOT beneficial for regular SQL queries',
    ],
    code: `-- Basic Snowpark-optimized warehouse
CREATE WAREHOUSE snowpark_wh
  WAREHOUSE_SIZE   = 'MEDIUM'
  WAREHOUSE_TYPE   = 'SNOWPARK-OPTIMIZED';

-- High-memory variant (256 GB, x86)
CREATE WAREHOUSE ml_training_wh
  WAREHOUSE_SIZE      = 'LARGE'
  WAREHOUSE_TYPE      = 'SNOWPARK-OPTIMIZED'
  RESOURCE_CONSTRAINT = 'MEMORY_16X_X86';

-- Change memory profile on existing WH
ALTER WAREHOUSE ml_training_wh
  SET RESOURCE_CONSTRAINT = 'MEMORY_1X';`,
  },
];

const SCALING_MODES = [
  {
    id: 'up',
    emoji: '⬆️', label: 'Scale UP (Resize)',
    color: 'bg-blue-50 border-blue-200', text: 'text-blue-800',
    when: 'Queries are slow. Complex queries, large data transformations, ML training.',
    howto: 'Increase warehouse size (e.g. Medium → X-Large). Can be done while warehouse is running.',
    caveat: 'Resizing adds compute but does NOT impact already-running queries. New size applies to queued + future queries.',
    code: `-- Scale up while running (takes effect for new/queued queries)
ALTER WAREHOUSE analytics_wh
  SET WAREHOUSE_SIZE = 'X-LARGE';

-- Scale back down after heavy workload completes
ALTER WAREHOUSE analytics_wh
  SET WAREHOUSE_SIZE = 'MEDIUM';`,
  },
  {
    id: 'down',
    emoji: '⬇️', label: 'Scale DOWN (Right-size)',
    color: 'bg-teal-50 border-teal-200', text: 'text-teal-800',
    when: 'Workload is lighter than expected or you want to save credits.',
    howto: 'Decrease warehouse size. Removing compute resources drops associated cache — expect initial slowdown.',
    caveat: 'Cache is partially dropped when scaling down a running warehouse. Trade-off: credits vs cache warmth.',
    code: `ALTER WAREHOUSE analytics_wh
  SET WAREHOUSE_SIZE = 'SMALL';
-- Note: cache for removed nodes is dropped immediately`,
  },
  {
    id: 'out',
    emoji: '↔️', label: 'Scale OUT (Multi-cluster)',
    color: 'bg-violet-50 border-violet-200', text: 'text-violet-800',
    when: 'Many concurrent users/queries are queuing. High concurrency problem. Enterprise edition required.',
    howto: 'Increase MAX_CLUSTER_COUNT. Use Auto-scale mode so Snowflake starts/stops clusters automatically.',
    caveat: 'Multi-cluster does NOT fix slow individual queries — use scale-UP for that. Designed purely for concurrency.',
    code: `-- Auto-scale: min=1, max=5 clusters
CREATE WAREHOUSE concurrent_wh
  WAREHOUSE_SIZE    = 'MEDIUM'
  MIN_CLUSTER_COUNT = 1
  MAX_CLUSTER_COUNT = 5
  SCALING_POLICY    = 'STANDARD';

-- Maximized: always run 3 clusters
ALTER WAREHOUSE concurrent_wh
  SET MIN_CLUSTER_COUNT = 3
      MAX_CLUSTER_COUNT = 3;`,
  },
  {
    id: 'in',
    emoji: '↩️', label: 'Scale IN (Reduce clusters)',
    color: 'bg-amber-50 border-amber-200', text: 'text-amber-800',
    when: 'Off-peak period. Want to reduce credit spend on a multi-cluster warehouse.',
    howto: 'In Auto-scale mode, Snowflake handles this automatically. In Maximized mode, lower MIN/MAX.',
    caveat: 'In Auto-scale, idle clusters shut down after SCALING_POLICY conditions are met (not instantly).',
    code: `-- Economy policy: conserves credits, tolerates queuing
ALTER WAREHOUSE concurrent_wh
  SET SCALING_POLICY = 'ECONOMY';

-- Reduce max clusters during off-peak
ALTER WAREHOUSE concurrent_wh
  SET MAX_CLUSTER_COUNT = 2;`,
  },
];

const USE_CASES_DATA = [
  {
    id: 'adhoc',
    emoji: '🔍', label: 'Ad-hoc / Interactive Queries',
    color: 'bg-blue-50 border-blue-200', text: 'text-blue-800',
    recs: [
      { label: 'Size',          val: 'X-Small to Medium — start small, upsize if slow' },
      { label: 'Auto-suspend',  val: '1–5 minutes (users are interactive, gaps are short)' },
      { label: 'Auto-resume',   val: 'Enabled — users expect instant response' },
      { label: 'Multi-cluster', val: 'If many concurrent analysts, enable auto-scale' },
    ],
    tip: 'Dedicated ad-hoc warehouse per team prevents BI workloads from starving exploratory queries.',
    code: `CREATE WAREHOUSE adhoc_analysts_wh
  WAREHOUSE_SIZE = 'MEDIUM'
  AUTO_SUSPEND   = 120        -- 2 min: short gaps between queries
  AUTO_RESUME    = TRUE;`,
  },
  {
    id: 'loading',
    emoji: '📥', label: 'Data Loading (ETL / ELT)',
    color: 'bg-teal-50 border-teal-200', text: 'text-teal-800',
    recs: [
      { label: 'Size',          val: 'Small to Large — depends on FILE count, not data size' },
      { label: 'Auto-suspend',  val: '5–10 minutes (batch jobs have gaps between runs)' },
      { label: 'Auto-resume',   val: 'Enabled for Snowpipe; manual for scheduled batch' },
      { label: 'Multi-cluster', val: 'Rarely needed — data loading does not benefit from scale-out' },
    ],
    tip: 'Larger warehouse ≠ faster loading. Splitting large files into many small files is more impactful than upsizing.',
    code: `CREATE WAREHOUSE etl_loader_wh
  WAREHOUSE_SIZE = 'LARGE'
  AUTO_SUSPEND   = 300        -- 5 min: batch jobs may have gaps
  AUTO_RESUME    = TRUE;

-- COPY INTO is the load operation
COPY INTO orders
  FROM @my_stage
  FILE_FORMAT = (FORMAT_NAME = 'my_csv_fmt')
  ON_ERROR = 'CONTINUE';`,
  },
  {
    id: 'bi',
    emoji: '📊', label: 'BI & Reporting',
    color: 'bg-amber-50 border-amber-200', text: 'text-amber-800',
    recs: [
      { label: 'Size',          val: 'Medium to X-Large — dashboards hit complex aggregation queries' },
      { label: 'Auto-suspend',  val: '10–15 minutes (report runs may have moderate gaps)' },
      { label: 'Auto-resume',   val: 'Enabled — report tools connect without human intervention' },
      { label: 'Multi-cluster', val: 'Enable if many BI users hit dashboards simultaneously (peak hours)' },
    ],
    tip: 'Dedicated BI warehouse isolates report workloads from ETL. Prevents report delays during heavy transformation jobs.',
    code: `CREATE WAREHOUSE bi_reporting_wh
  WAREHOUSE_SIZE    = 'X-LARGE'
  AUTO_SUSPEND      = 600         -- 10 min
  AUTO_RESUME       = TRUE
  MIN_CLUSTER_COUNT = 1
  MAX_CLUSTER_COUNT = 4           -- handles peak dashboard concurrency
  SCALING_POLICY    = 'STANDARD';`,
  },
  {
    id: 'concurrent',
    emoji: '👥', label: 'High Concurrency (Many Teams)',
    color: 'bg-violet-50 border-violet-200', text: 'text-violet-800',
    recs: [
      { label: 'Isolation',     val: 'Separate warehouses per team — no resource contention' },
      { label: 'Size',          val: 'Size per team\'s typical query complexity' },
      { label: 'Multi-cluster', val: 'Per-team multi-cluster warehouse handles intra-team concurrency' },
      { label: 'Scaling policy','val': 'Standard: minimize queuing. Economy: minimize credits.' },
    ],
    tip: 'Multiple warehouses share the SAME storage with ZERO contention. Cost is per-team compute, not shared storage.',
    code: `-- Separate warehouses per department (best practice)
CREATE WAREHOUSE finance_wh    WAREHOUSE_SIZE = 'MEDIUM' AUTO_SUSPEND = 300;
CREATE WAREHOUSE marketing_wh  WAREHOUSE_SIZE = 'SMALL'  AUTO_SUSPEND = 120;
CREATE WAREHOUSE data_eng_wh   WAREHOUSE_SIZE = 'X-LARGE' AUTO_SUSPEND = 600;

-- Grant usage to each team's role
GRANT USAGE ON WAREHOUSE finance_wh   TO ROLE finance_role;
GRANT USAGE ON WAREHOUSE marketing_wh TO ROLE marketing_role;`,
  },
];

const BILLING_FACTS = [
  { emoji: '⏱️', fact: 'Per-second billing with a 60-second minimum each time the warehouse resumes.' },
  { emoji: '💡', fact: 'Credits charged only while compute resources are running — suspended = $0.' },
  { emoji: '📈', fact: 'Each size step doubles the credits/hour: X-Small=1, Small=2, Medium=4, Large=8 … 6X-Large=512.' },
  { emoji: '🔄', fact: 'Resizing a suspended warehouse is free — new size provisions on next resume.' },
  { emoji: '🔢', fact: 'Multi-cluster: credits = size credits × running clusters. E.g. Medium×3 clusters = 12 credits/hr.' },
  { emoji: '🧊', fact: 'Warehouse cache is dropped on suspend. Resumed warehouse may run slower until cache warms up.' },
];

const WarehousesTab = () => {
  const [openType,    setOpenType]    = useState(null);
  const [openScale,   setOpenScale]   = useState(null);
  const [openUseCase, setOpenUseCase] = useState(null);
  const [sizeFilter,  setSizeFilter]  = useState(null);

  return (
    <div className="space-y-5">

      {/* ── Warehouse Types ── */}
      <InfoCard>
        <SectionHeader icon={Server} color="bg-blue-600" title="Virtual Warehouse Types"
          subtitle="Standard warehouses handle all SQL work. Snowpark-optimized warehouses are specialized for large-memory Python/ML jobs." />
        <div className="space-y-3">
          {WH_TYPES_DATA.map((wh, i) => (
            <div key={wh.id} className={`rounded-xl border overflow-hidden ${wh.color}`}>
              <button onClick={() => setOpenType(openType === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{wh.emoji}</span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-bold text-sm ${wh.text}`}>{wh.label}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${wh.badgeColor}`}>{wh.badge}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">Use when: {wh.when.split('.')[0]}.</p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${openType === i ? 'rotate-90' : ''}`} />
              </button>
              {openType === i && (
                <div className="px-5 pb-5 space-y-3">
                  <div className={`rounded-lg p-3 bg-white/60 border border-white text-xs ${wh.text}`}>
                    <p className="font-bold mb-1">💡 Gen note</p>
                    <p>{wh.gen2note}</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {wh.keyFacts.map((f, j) => (
                      <div key={j} className="flex items-start gap-2 bg-white/70 rounded-lg px-3 py-2 border border-white text-xs">
                        <CheckCircle className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${wh.text}`} />
                        <span className="text-slate-700">{f}</span>
                      </div>
                    ))}
                  </div>
                  <CodeBlock code={wh.code} />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
          <p className="text-xs font-bold text-yellow-700 mb-1">⚡ Exam Tip — Types</p>
          <ul className="text-xs text-yellow-700 space-y-1 list-disc pl-4">
            <li>There are exactly <strong>two</strong> warehouse types: <strong>Standard</strong> and <strong>Snowpark-optimized</strong>.</li>
            <li>Snowpark-optimized = large-memory ML training. Standard = everything else.</li>
            <li>Gen2 standard warehouses offer better price/performance but are <strong>not the default yet</strong>.</li>
          </ul>
        </div>
      </InfoCard>

      {/* ── Warehouse Sizes ── */}
      <InfoCard>
        <SectionHeader icon={BarChart2} color="bg-blue-600" title="Warehouse Sizes & Credit Usage"
          subtitle="10 sizes from X-Small (1 credit/hr) to 6X-Large (512 credits/hr). Each step doubles resources and cost." />
        <div className="overflow-x-auto mb-3">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-600">
                <th className="text-left px-3 py-2 rounded-tl-lg font-semibold">Size</th>
                <th className="text-right px-3 py-2 font-semibold">Credits/hr</th>
                <th className="text-left px-3 py-2 rounded-tr-lg font-semibold">Typical use</th>
              </tr>
            </thead>
            <tbody>
              {WH_SIZES.map((s, i) => (
                <tr key={s.size} onClick={() => setSizeFilter(sizeFilter === i ? null : i)}
                  className={`border-t border-slate-100 cursor-pointer transition-colors ${
                    sizeFilter === i ? 'bg-blue-50' : i % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50 hover:bg-blue-50/30'
                  }`}>
                  <td className="px-3 py-2 font-semibold text-slate-800">{s.size}</td>
                  <td className="px-3 py-2 text-right">
                    <span className="font-mono font-bold text-blue-700">{s.credits}</span>
                  </td>
                  <td className="px-3 py-2 text-slate-500">{s.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-3">
          <p className="text-xs font-bold text-slate-600 mb-2">📐 Billing Formula</p>
          <div className="grid sm:grid-cols-3 gap-2 text-xs">
            {[
              { label: 'Single-cluster',    formula: 'size_credits × hours_running' },
              { label: 'Multi-cluster',     formula: 'size_credits × clusters_running × hours' },
              { label: '60-sec minimum',    formula: 'Each resume = min 1 minute billed' },
            ].map((f, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-lg p-2">
                <p className="font-bold text-slate-700 mb-0.5">{f.label}</p>
                <code className="text-blue-700 font-mono text-[10px]">{f.formula}</code>
              </div>
            ))}
          </div>
        </div>
        <CodeBlock code={`-- Create at a specific size
CREATE WAREHOUSE prod_wh
  WAREHOUSE_SIZE = 'X-LARGE'
  AUTO_SUSPEND   = 300
  AUTO_RESUME    = TRUE;

-- Resize at any time (even while running)
ALTER WAREHOUSE prod_wh SET WAREHOUSE_SIZE = 'LARGE';

-- Suspend to stop credit consumption
ALTER WAREHOUSE prod_wh SUSPEND;

-- View all warehouses (size, state, clusters)
SHOW WAREHOUSES;`} />
        <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
          <p className="text-xs font-bold text-yellow-700 mb-1">⚡ Exam Tip — Billing</p>
          <ul className="text-xs text-yellow-700 space-y-1 list-disc pl-4">
            <li>Billing is <strong>per-second with a 60-second minimum</strong> each time the warehouse resumes.</li>
            <li>Suspended warehouse = <strong>$0 compute cost</strong>. Storage cost continues regardless.</li>
            <li>Larger warehouses help <strong>slow queries</strong>. They do <strong>NOT</strong> always improve data loading.</li>
            <li>Credit usage <strong>doubles</strong> with each size increase (X-Small=1 → Small=2 → Medium=4 etc.).</li>
          </ul>
        </div>
      </InfoCard>

      {/* ── Scaling: Up vs Out ── */}
      <InfoCard>
        <SectionHeader icon={Zap} color="bg-blue-600" title="Scaling: Up vs Out"
          subtitle="Scale UP (resize) to fix slow queries. Scale OUT (multi-cluster) to fix concurrency queuing." />

        {/* Visual decision guide */}
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4">
            <p className="font-bold text-blue-800 text-sm mb-2">⬆️ Scale UP — when queries are slow</p>
            <ul className="text-xs text-blue-700 space-y-1 list-disc pl-4">
              <li>Large, complex queries running too slowly</li>
              <li>Expensive transformations / ML training</li>
              <li>Resize warehouse (e.g. Medium → X-Large)</li>
              <li>Can be done <strong>while warehouse is running</strong></li>
            </ul>
          </div>
          <div className="bg-violet-50 border-2 border-violet-300 rounded-xl p-4">
            <p className="font-bold text-violet-800 text-sm mb-2">↔️ Scale OUT — when queries are queuing</p>
            <ul className="text-xs text-violet-700 space-y-1 list-disc pl-4">
              <li>Many concurrent users / queries piling up</li>
              <li>Peak hours, many teams on one warehouse</li>
              <li>Multi-cluster warehouse (Enterprise+)</li>
              <li>Auto-scale starts/stops clusters automatically</li>
            </ul>
          </div>
        </div>

        {/* Multi-cluster detail */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
          <p className="text-xs font-bold text-slate-700 mb-3">Multi-cluster Modes</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              {
                label: 'Auto-scale Mode',
                badge: 'Recommended',
                badgeColor: 'bg-emerald-500',
                desc: 'MIN < MAX. Snowflake starts clusters when queries queue, stops them when idle. Standard policy = minimize queuing. Economy policy = minimize credits.',
                formula: 'MIN_CLUSTER_COUNT = 1\nMAX_CLUSTER_COUNT = 5',
              },
              {
                label: 'Maximized Mode',
                badge: 'All clusters always on',
                badgeColor: 'bg-amber-500',
                desc: 'MIN = MAX (both > 1). All clusters run continuously — maximum predictable capacity. Best for steady, large concurrency loads.',
                formula: 'MIN_CLUSTER_COUNT = 3\nMAX_CLUSTER_COUNT = 3',
              },
            ].map((m, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-sm text-slate-800">{m.label}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${m.badgeColor}`}>{m.badge}</span>
                </div>
                <p className="text-xs text-slate-600 mb-2">{m.desc}</p>
                <code className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-1 rounded block whitespace-pre">{m.formula}</code>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {SCALING_MODES.map((mode, i) => (
            <div key={mode.id} className={`rounded-xl border overflow-hidden ${mode.color}`}>
              <button onClick={() => setOpenScale(openScale === i ? null : i)}
                className="w-full flex items-center justify-between p-3 text-left">
                <span className={`font-bold text-sm flex items-center gap-2 ${mode.text}`}>
                  <span className="text-lg">{mode.emoji}</span> {mode.label}
                </span>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${openScale === i ? 'rotate-90' : ''}`} />
              </button>
              {openScale === i && (
                <div className="px-4 pb-4 space-y-2">
                  <div className="grid sm:grid-cols-3 gap-2 text-xs">
                    {[
                      { label: 'When',    val: mode.when },
                      { label: 'How',     val: mode.howto },
                      { label: '⚠️ Note', val: mode.caveat },
                    ].map((item, j) => (
                      <div key={j} className="bg-white/70 border border-white rounded-lg p-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                        <p className={`text-xs ${mode.text}`}>{item.val}</p>
                      </div>
                    ))}
                  </div>
                  <CodeBlock code={mode.code} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
          <p className="text-xs font-bold text-yellow-700 mb-1">⚡ Exam Tip — Scaling</p>
          <ul className="text-xs text-yellow-700 space-y-1 list-disc pl-4">
            <li>Slow queries → <strong>Scale UP</strong> (resize). Query queuing → <strong>Scale OUT</strong> (multi-cluster).</li>
            <li>Multi-cluster requires <strong>Enterprise edition</strong> or higher.</li>
            <li>Scaling policies: <strong>Standard</strong> = minimize queuing. <strong>Economy</strong> = minimize credits.</li>
            <li>Resizing a running warehouse has <strong>no effect on currently running queries</strong> — only queued/new ones.</li>
            <li>Data loading performance scales with <strong>number of files</strong>, not warehouse size.</li>
          </ul>
        </div>
      </InfoCard>

      {/* ── Use Cases & Best Practices ── */}
      <InfoCard>
        <SectionHeader icon={BookOpen} color="bg-blue-600" title="Workload-Based Configuration"
          subtitle="The right warehouse config depends entirely on your workload type. Click each scenario to see the recommended approach." />
        <div className="space-y-2 mb-4">
          {USE_CASES_DATA.map((uc, i) => (
            <div key={uc.id} className={`rounded-xl border overflow-hidden ${uc.color}`}>
              <button onClick={() => setOpenUseCase(openUseCase === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{uc.emoji}</span>
                  <span className={`font-bold text-sm ${uc.text}`}>{uc.label}</span>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${openUseCase === i ? 'rotate-90' : ''}`} />
              </button>
              {openUseCase === i && (
                <div className="px-5 pb-5 space-y-3">
                  <div className="grid sm:grid-cols-2 gap-2">
                    {uc.recs.map((r, j) => (
                      <div key={j} className="bg-white/70 border border-white rounded-lg px-3 py-2 text-xs">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{r.label}</p>
                        <p className={`font-semibold mt-0.5 ${uc.text}`}>{r.val}</p>
                      </div>
                    ))}
                  </div>
                  <div className={`rounded-lg p-3 bg-white/60 border border-white text-xs ${uc.text}`}>
                    <span className="font-bold">💡 </span>{uc.tip}
                  </div>
                  <CodeBlock code={uc.code} />
                </div>
              )}
            </div>
          ))}
        </div>
      </InfoCard>

      {/* ── Auto-Suspend & Auto-Resume ── */}
      <InfoCard>
        <SectionHeader icon={RefreshCw} color="bg-blue-600" title="Auto-Suspend & Auto-Resume"
          subtitle="The primary cost-control levers. Suspend stops credit usage; resume restarts it on demand." />
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          {[
            {
              title: '💤 Auto-Suspend',
              color: 'bg-slate-50 border-slate-200',
              text: 'text-slate-800',
              points: [
                'Suspends the warehouse after N seconds of inactivity',
                'Default: enabled. Set to 0 or NULL to disable (use cautiously)',
                'Recommended: 1–10 min for interactive; 5–15 min for batch',
                'Cache is DROPPED on suspend — trade off credits vs warmth',
              ],
            },
            {
              title: '▶️ Auto-Resume',
              color: 'bg-blue-50 border-blue-200',
              text: 'text-blue-800',
              points: [
                'Automatically resumes on any new statement submitted',
                'Default: enabled. Disable to force manual control of costs',
                'Resume typically takes 1–2 seconds (larger WH may take longer)',
                'Each resume starts a new 60-second minimum billing period',
              ],
            },
          ].map((card, i) => (
            <div key={i} className={`rounded-xl border p-4 ${card.color}`}>
              <p className={`font-bold text-sm mb-2 ${card.text}`}>{card.title}</p>
              <ul className="space-y-1">
                {card.points.map((p, j) => (
                  <li key={j} className={`text-xs flex items-start gap-2 ${card.text}`}>
                    <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 opacity-60" /> {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <CodeBlock code={`-- Best-practice warehouse with full config
CREATE WAREHOUSE analytics_wh
  WAREHOUSE_SIZE   = 'MEDIUM'
  AUTO_SUSPEND     = 300       -- 5 minutes idle → suspend
  AUTO_RESUME      = TRUE      -- wake up on any new query
  INITIALLY_SUSPENDED = TRUE;  -- don't start billing on create

-- Change auto-suspend on existing warehouse
ALTER WAREHOUSE analytics_wh
  SET AUTO_SUSPEND = 60;       -- aggressive: suspend after 1 min

-- Disable auto-suspend (always-on) — use carefully!
ALTER WAREHOUSE analytics_wh
  SET AUTO_SUSPEND = 0;        -- NULL also works`} />

        {/* Billing summary */}
        <div className="mt-4 grid sm:grid-cols-3 gap-2">
          {BILLING_FACTS.map((f, i) => (
            <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs">
              <span className="text-lg">{f.emoji}</span>
              <p className="text-slate-600 mt-1 leading-relaxed">{f.fact}</p>
            </div>
          ))}
        </div>
      </InfoCard>

      <ExamTip>
        <p>Two types: <strong>Standard</strong> (all SQL work) and <strong>Snowpark-optimized</strong> (ML/high-memory Python). Multi-cluster = <strong>Enterprise+</strong>.</p>
        <p>Scale <strong>UP</strong> (resize) for slow queries. Scale <strong>OUT</strong> (add clusters) for concurrency queuing. These solve different problems.</p>
        <p>Data loading performance scales with <strong>file count</strong>, not warehouse size — use Small/Medium for loading.</p>
        <p><strong>Economy</strong> scaling policy = prefer keeping clusters full (tolerate queuing, save credits). <strong>Standard</strong> = add clusters aggressively to prevent queuing.</p>
        <p>Auto-suspend drops the local cache — consider the <strong>credits vs cache warmth</strong> tradeoff when setting the timeout.</p>
      </ExamTip>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════════
// LEARNING TAB 6 — 1.6 AI/ML and Application Development Features
// ═══════════════════════════════════════════════════════════════════════════════

const AIML_FEATURES = [
  {
    id: 'snowpark',
    emoji: '🐍',
    label: 'Snowpark',
    badge: 'Compute pushdown library',
    badgeColor: 'bg-blue-600',
    color: 'bg-blue-50 border-blue-200',
    text: 'text-blue-900',
    what: 'Client library (Python, Java, Scala) for building data pipelines and ML workloads that push processing down to Snowflake — no data movement.',
    keyFacts: [
      'Languages: Python, Java, Scala',
      'Core abstraction: DataFrame (lazy evaluation — no data moved until action called)',
      'Pushes all transformations to Snowflake engine — compute stays in Snowflake',
      'Can create UDFs and UDTFs inline in application code',
      'Integrates with VS Code, Jupyter, IntelliJ',
      'ML training → use Snowpark-optimized warehouse (MEMORY_16X+)',
      'Pushdown includes UDFs — custom code runs server-side',
    ],
    useCases: 'Feature engineering, model training, ETL pipelines, batch scoring, inline UDF creation.',
    code: `-- Snowpark Python: build a DataFrame pipeline (nothing runs yet)
from snowflake.snowpark.functions import col, when

session = Session.builder.configs(conn_params).create()

df = session.table("sales")
    .select(col("region"), col("amount"))
    .filter(col("amount") > 1000)
    .with_column("tier", when(col("amount") > 5000, "gold").otherwise("silver"))

# Action: sends SQL to Snowflake, returns results
results = df.collect()

# Inline UDF — code pushed to server
from snowflake.snowpark.types import IntegerType
add_tax = udf(lambda x: x * 1.08,
              return_type=FloatType(),
              input_types=[FloatType()],
              name="add_tax", replace=True)`,
  },
  {
    id: 'notebooks',
    emoji: '📓',
    label: 'Snowflake Notebooks',
    badge: 'Interactive dev environment',
    badgeColor: 'bg-indigo-600',
    color: 'bg-indigo-50 border-indigo-200',
    text: 'text-indigo-900',
    what: 'Jupyter-like environment built into Snowsight. Supports SQL, Python, and Markdown cells. Runs on warehouse or Container Runtime.',
    keyFacts: [
      'Available directly in Snowsight — no external setup',
      'Supports SQL cells, Python cells, and Markdown',
      'Two runtimes: Warehouse runtime & Container Runtime (Preview)',
      'Container Runtime: pre-installed PyTorch, XGBoost, Scikit-learn, HuggingFace',
      'Default notebook warehouse: SYSTEM$STREAMLIT_NOTEBOOK_WH (multi-cluster X-Small)',
      'ML Jobs let external IDEs (VS Code, PyCharm) dispatch to Container Runtime',
      'Seamlessly integrates with Snowpark and Snowflake ML',
    ],
    useCases: 'Exploratory data analysis, model prototyping, large-scale ML training, team data science collaboration.',
    code: `-- SQL cell in a Notebook
SELECT region, SUM(sales) AS total
FROM orders
GROUP BY region;

# Python cell — Snowpark in notebook context
import snowflake.snowpark.functions as F
df = session.table("orders")
df.group_by("region").agg(F.sum("sales").alias("total")).show()`,
  },
  {
    id: 'streamlit',
    emoji: '🖥️',
    label: 'Streamlit in Snowflake (SiS)',
    badge: 'Data app framework',
    badgeColor: 'bg-pink-600',
    color: 'bg-pink-50 border-pink-200',
    text: 'text-pink-900',
    what: 'Deploy Streamlit (open-source Python web app library) apps directly inside Snowflake. No external infrastructure needed — data never leaves Snowflake.',
    keyFacts: [
      'Snowflake manages compute and storage for the app',
      'RBAC governs access — secured like any other Snowflake object',
      'Can be created via Snowsight UI, SQL, or Snowflake CLI',
      'Integrates with Snowpark, UDFs, stored procedures, Native App Framework',
      'Two runtimes: Warehouse (default) and Container Runtime (Preview)',
      'Default SiS notebook warehouse: SYSTEM$STREAMLIT_NOTEBOOK_WH',
      'Can be shared via Snowflake Sharing mechanisms',
    ],
    useCases: 'Internal dashboards, self-service data tools, Cortex Analyst chat apps, ML model demos.',
    code: `-- Create a Streamlit app via SQL
CREATE OR REPLACE STREAMLIT my_dashboard
  ROOT_LOCATION = '@my_stage/dashboard_app'
  MAIN_FILE = 'app.py'
  QUERY_WAREHOUSE = 'analytics_wh';

-- Grant access
GRANT USAGE ON STREAMLIT my_dashboard TO ROLE data_viewer;`,
  },
  {
    id: 'cortex_ai',
    emoji: '🧠',
    label: 'Cortex AI Functions',
    badge: 'SQL-callable LLM functions',
    badgeColor: 'bg-violet-600',
    color: 'bg-violet-50 border-violet-200',
    text: 'text-violet-900',
    what: 'SQL and Python functions that call industry-leading LLMs (Anthropic, Meta, Mistral, OpenAI) hosted inside Snowflake. No data leaves Snowflake.',
    keyFacts: [
      'AI_COMPLETE — generate text / completions with any supported LLM',
      'AI_CLASSIFY — classify text or images into user-defined categories',
      'AI_FILTER — TRUE/FALSE predicate in WHERE or JOIN clauses',
      'AI_EXTRACT — extract structured info from text/documents',
      'AI_SENTIMENT — sentiment score (-1 to 1)',
      'AI_TRANSLATE — translate between languages',
      'AI_SUMMARIZE_AGG / AI_AGG — aggregate summaries across rows',
      'AI_EMBED (EMBED_TEXT_768/1024) — generate vector embeddings',
      'Requires SNOWFLAKE.CORTEX_USER database role + USE AI FUNCTIONS privilege',
      'Billed per token (input + output). Warehouse ≤ MEDIUM recommended.',
    ],
    useCases: 'Sentiment on reviews, NL to SQL, document extraction, content classification, vector search pipelines.',
    code: `-- Text completion with a chosen model
SELECT SNOWFLAKE.CORTEX.COMPLETE(
  'mistral-large2',
  'Summarize this customer feedback: ' || feedback_text
) AS summary
FROM customer_reviews;

-- Classify rows (SQL)
SELECT AI_CLASSIFY(review, ['positive','neutral','negative']) AS sentiment
FROM reviews;

-- Sentiment scoring
SELECT AI_SENTIMENT(comment) AS score FROM tickets;

-- Vector embeddings for similarity search
SELECT AI_EMBED(description) AS embedding FROM products;`,
  },
  {
    id: 'cortex_search',
    emoji: '🔍',
    label: 'Cortex Search',
    badge: 'Hybrid vector + keyword search',
    badgeColor: 'bg-teal-600',
    color: 'bg-teal-50 border-teal-200',
    text: 'text-teal-900',
    what: 'Fully managed search service over Snowflake data. Uses hybrid retrieval (vector + keyword + semantic reranking) for high-quality fuzzy text search. Powers RAG pipelines.',
    keyFacts: [
      'Hybrid retrieval: vector search + keyword search + semantic reranking',
      'No embedding/infra management required — fully serverless',
      'CREATE CORTEX SEARCH SERVICE defines the source query and refresh',
      'TARGET_LAG controls how often the index is refreshed from base data',
      'Supports incremental refresh (same requirements as Dynamic Tables)',
      'Primary keys enable optimized incremental refresh paths',
      'Multi-index: search across multiple columns with different index types',
      'Base table limit: 100M rows for optimal performance',
      'Requires SNOWFLAKE.CORTEX_USER or CORTEX_EMBED_USER database role',
    ],
    useCases: 'RAG chatbots, enterprise search bars, document retrieval, customer support ticket search.',
    code: `-- Create a search service on a text column
CREATE OR REPLACE CORTEX SEARCH SERVICE support_search
  ON transcript_text
  ATTRIBUTES region, agent_id
  WAREHOUSE = search_wh
  TARGET_LAG = '1 hour'
  AS (
    SELECT transcript_text, region, agent_id
    FROM support_transcripts
  );

-- Grant access
GRANT USAGE ON CORTEX SEARCH SERVICE support_search TO ROLE analyst;

-- Preview via SQL
SELECT PARSE_JSON(
  SNOWFLAKE.CORTEX.SEARCH_PREVIEW(
    'support_search',
    '{"query":"internet issues","columns":["transcript_text"],"limit":3}'
  )
)['results'];`,
  },
  {
    id: 'cortex_analyst',
    emoji: '💬',
    label: 'Cortex Analyst',
    badge: 'Natural language → SQL',
    badgeColor: 'bg-amber-600',
    color: 'bg-amber-50 border-amber-200',
    text: 'text-amber-900',
    what: 'LLM-powered REST API that converts natural language business questions into accurate SQL queries against your Snowflake data. Uses Semantic Views (or YAML semantic model) to bridge business language and database schema.',
    keyFacts: [
      'REST API — integrates with Streamlit, Slack, Teams, any chat interface',
      'Powered by state-of-the-art LLMs (Anthropic Claude, Mistral, Meta Llama)',
      'Semantic Views (schema-level objects) define business metrics, dimensions, facts',
      'Legacy: YAML semantic model stored on a stage is still supported',
      'Multi-turn conversations supported — pass conversation history in messages[]',
      'Does NOT train on customer data — data stays in Snowflake governance boundary',
      'Requires SNOWFLAKE.CORTEX_USER or SNOWFLAKE.CORTEX_ANALYST_USER role',
      'Disable via: ALTER ACCOUNT SET ENABLE_CORTEX_ANALYST = FALSE',
      'Credit cost based on messages processed (HTTP 200 responses only)',
    ],
    useCases: 'Self-service analytics for business users, embedded chat interfaces, NL query tools.',
    code: `-- Disable Cortex Analyst for the account
USE ROLE ACCOUNTADMIN;
ALTER ACCOUNT SET ENABLE_CORTEX_ANALYST = FALSE;

-- Grant access to specific role only
USE ROLE ACCOUNTADMIN;
CREATE ROLE cortex_analyst_role;
GRANT DATABASE ROLE SNOWFLAKE.CORTEX_ANALYST_USER
  TO ROLE cortex_analyst_role;
GRANT ROLE cortex_analyst_role TO USER analyst_user;

-- Monitor cost
SELECT * FROM SNOWFLAKE.ACCOUNT_USAGE.CORTEX_ANALYST_USAGE_HISTORY;`,
  },
  {
    id: 'snowflake_ml',
    emoji: '🤖',
    label: 'Snowflake ML',
    badge: 'End-to-end ML platform',
    badgeColor: 'bg-emerald-600',
    color: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-900',
    what: 'Integrated ML platform for end-to-end model development, training, deployment, and monitoring — all inside Snowflake on governed data.',
    keyFacts: [
      'Feature Store — define, manage, store, discover ML features; supports batch + streaming incremental refresh',
      'Model Registry — log, manage, deploy models (trained in or outside Snowflake)',
      'ML Jobs — schedule and automate ML pipelines; dispatch from external IDEs',
      'Experiments — record training runs, compare metrics, pick best model',
      'Model Serving — deploy to Snowpark Container Services for inference',
      'ML Observability — monitor performance drift, Shapley explainability',
      'ML Lineage — trace data → features → datasets → models',
      'Snowflake Datasets — immutable, versioned data snapshots for training',
      'ML Functions — SQL functions for business analysts: forecasting, anomaly detection',
    ],
    useCases: 'Production ML pipelines, model governance, business forecasting (ML Functions), LLM fine-tuning.',
    code: `-- ML Functions: built-in forecasting (no coding)
SELECT SNOWFLAKE.ML.FORECAST(
  INPUT_DATA  => SYSTEM$REFERENCE('VIEW', 'sales_history'),
  TIMESTAMP_COLNAME => 'date',
  TARGET_COLNAME    => 'revenue',
  SERIES_COLNAME    => 'region',
  CONFIG_OBJECT => {'prediction_interval': 0.95}
);

-- Anomaly detection
SELECT SNOWFLAKE.ML.DETECT_ANOMALIES(
  INPUT_DATA     => SYSTEM$REFERENCE('TABLE', 'metrics'),
  TIMESTAMP_COLNAME => 'ts',
  TARGET_COLNAME    => 'value'
);`,
  },
];

const CORTEX_COMPARE = [
  { feature: 'Cortex AI Functions', type: 'SQL functions', purpose: 'Call LLMs to process text (summarize, classify, translate, embed)', billing: 'Per token', useWhen: 'Enrich table data with AI at scale in SQL' },
  { feature: 'Cortex Search',       type: 'Managed service', purpose: 'Hybrid vector+keyword search over text data (RAG, enterprise search)', billing: 'Per GB/mo indexed + warehouse + tokens', useWhen: 'Fuzzy text search or RAG knowledge base' },
  { feature: 'Cortex Analyst',      type: 'REST API',        purpose: 'Natural language → SQL for business Q&A on structured data', billing: 'Per message (HTTP 200)', useWhen: 'Non-technical users need self-service analytics' },
];

const AIMLTab = () => {
  const [open, setOpen] = useState(null);

  return (
    <div className="space-y-5">

      {/* ── Overview cards ── */}
      <InfoCard>
        <SectionHeader icon={Zap} color="bg-violet-600" title="AI/ML & App Dev — Big Picture"
          subtitle="Snowflake provides a full stack for building data apps and ML pipelines — from libraries and notebooks to deployed LLM-powered services." />
        <div className="grid sm:grid-cols-3 gap-3 mb-2">
          {[
            { emoji: '🐍', label: 'Snowpark', desc: 'Push-down data/ML library (Python, Java, Scala)', color: 'bg-blue-50 border-blue-200 text-blue-800' },
            { emoji: '📓', label: 'Notebooks', desc: 'Jupyter-like SQL+Python IDE inside Snowsight', color: 'bg-indigo-50 border-indigo-200 text-indigo-800' },
            { emoji: '🖥️', label: 'Streamlit in Snowflake', desc: 'Deploy Python web apps with no external infra', color: 'bg-pink-50 border-pink-200 text-pink-800' },
            { emoji: '🧠', label: 'Cortex AI Functions', desc: 'SQL-callable LLMs: COMPLETE, CLASSIFY, EMBED...', color: 'bg-violet-50 border-violet-200 text-violet-800' },
            { emoji: '🔍', label: 'Cortex Search', desc: 'Serverless hybrid search for RAG & enterprise search', color: 'bg-teal-50 border-teal-200 text-teal-800' },
            { emoji: '💬', label: 'Cortex Analyst', desc: 'Natural language → SQL via REST API', color: 'bg-amber-50 border-amber-200 text-amber-800' },
            { emoji: '🤖', label: 'Snowflake ML', desc: 'Feature Store, Model Registry, ML Jobs, Observability', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
          ].map((c, i) => (
            <div key={i} className={`rounded-xl border p-3 ${c.color}`}>
              <span className="text-2xl">{c.emoji}</span>
              <p className="font-bold text-sm mt-1 mb-0.5">{c.label}</p>
              <p className="text-xs opacity-80">{c.desc}</p>
            </div>
          ))}
        </div>
      </InfoCard>

      {/* ── Deep dives ── */}
      <InfoCard>
        <SectionHeader icon={BookOpen} color="bg-violet-600" title="Feature Deep Dives"
          subtitle="Click each feature to expand key facts, use cases, and SQL/Python code snippets." />
        <div className="space-y-2">
          {AIML_FEATURES.map((f, i) => (
            <div key={f.id} className={`rounded-xl border overflow-hidden ${f.color}`}>
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{f.emoji}</span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-bold text-sm ${f.text}`}>{f.label}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${f.badgeColor}`}>{f.badge}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{f.what.split('.')[0]}.</p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${open === i ? 'rotate-90' : ''}`} />
              </button>
              {open === i && (
                <div className="px-5 pb-5 space-y-3">
                  <p className={`text-xs leading-relaxed ${f.text}`}>{f.what}</p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {f.keyFacts.map((fact, j) => (
                      <div key={j} className="flex items-start gap-2 bg-white/70 border border-white rounded-lg px-3 py-2">
                        <CheckCircle className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${f.text}`} />
                        <span className="text-xs text-slate-700">{fact}</span>
                      </div>
                    ))}
                  </div>
                  <div className={`rounded-lg p-3 bg-white/60 border border-white text-xs ${f.text}`}>
                    <span className="font-bold">📌 Use cases: </span>{f.useCases}
                  </div>
                  <CodeBlock code={f.code} />
                </div>
              )}
            </div>
          ))}
        </div>
      </InfoCard>

      {/* ── Cortex services comparison ── */}
      <InfoCard>
        <SectionHeader icon={Server} color="bg-violet-600" title="Cortex Services — Side-by-Side"
          subtitle="Three distinct Cortex offerings that are frequently confused on the exam." />
        <div className="overflow-x-auto mb-3">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-600">
                {['Service','Type','Purpose','Billing','Use When'].map((h, i) => (
                  <th key={i} className={`text-left px-3 py-2 font-semibold ${i === 0 ? 'rounded-tl-lg' : i === 4 ? 'rounded-tr-lg' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CORTEX_COMPARE.map((r, i) => (
                <tr key={i} className={`border-t border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                  <td className="px-3 py-2 font-bold text-violet-700">{r.feature}</td>
                  <td className="px-3 py-2 text-slate-600">{r.type}</td>
                  <td className="px-3 py-2 text-slate-600">{r.purpose}</td>
                  <td className="px-3 py-2 text-slate-600 font-mono text-[10px]">{r.billing}</td>
                  <td className="px-3 py-2 text-slate-600">{r.useWhen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
          <p className="text-xs font-bold text-yellow-700 mb-1">⚡ Exam Tip — Cortex Services</p>
          <ul className="text-xs text-yellow-700 space-y-1 list-disc pl-4">
            <li><strong>AI Functions</strong>: call an LLM on table rows in SQL — text processing at scale.</li>
            <li><strong>Cortex Search</strong>: vector+keyword index over text — power RAG or fuzzy search bars.</li>
            <li><strong>Cortex Analyst</strong>: business user types a question → gets SQL-backed answer, no coding needed.</li>
          </ul>
        </div>
      </InfoCard>

      {/* ── Snowpark vs Notebooks vs SiS quick compare ── */}
      <InfoCard>
        <SectionHeader icon={GitBranch} color="bg-violet-600" title="Dev Tools — Quick Compare"
          subtitle="Snowpark, Notebooks, and Streamlit each have distinct roles in the development workflow." />
        <div className="grid sm:grid-cols-3 gap-3 mb-3">
          {[
            {
              emoji: '🐍', label: 'Snowpark',
              color: 'bg-blue-50 border-blue-200', text: 'text-blue-800',
              rows: [
                { q: 'Who uses it?',     a: 'Data engineers, ML engineers, developers' },
                { q: 'Where runs?',      a: 'Client code locally or in Notebooks; compute in Snowflake' },
                { q: 'Key abstraction',  a: 'DataFrame (lazy) + UDFs' },
                { q: 'Best for',         a: 'Pipelines, transformations, ML training' },
              ],
            },
            {
              emoji: '📓', label: 'Notebooks',
              color: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-800',
              rows: [
                { q: 'Who uses it?',     a: 'Data scientists, analysts, engineers' },
                { q: 'Where runs?',      a: 'Inside Snowsight (browser)' },
                { q: 'Key abstraction',  a: 'Cells: SQL + Python + Markdown' },
                { q: 'Best for',         a: 'EDA, prototyping, large-scale ML (Container Runtime)' },
              ],
            },
            {
              emoji: '🖥️', label: 'Streamlit in Snowflake',
              color: 'bg-pink-50 border-pink-200', text: 'text-pink-800',
              rows: [
                { q: 'Who uses it?',     a: 'App developers, data engineers' },
                { q: 'Where runs?',      a: 'Hosted inside Snowflake (no external server)' },
                { q: 'Key abstraction',  a: 'Python Streamlit app + Snowflake object' },
                { q: 'Best for',         a: 'Internal tools, dashboards, Cortex demos' },
              ],
            },
          ].map((tool, i) => (
            <div key={i} className={`rounded-xl border p-4 ${tool.color}`}>
              <p className={`font-bold text-sm mb-3 ${tool.text}`}>{tool.emoji} {tool.label}</p>
              <div className="space-y-2">
                {tool.rows.map((r, j) => (
                  <div key={j}>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{r.q}</p>
                    <p className={`text-xs font-semibold ${tool.text}`}>{r.a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </InfoCard>

      {/* ── ML Functions callout ── */}
      <InfoCard>
        <SectionHeader icon={BarChart2} color="bg-emerald-600" title="Snowflake ML Functions"
          subtitle="Pre-built ML capabilities callable in SQL — no model training required. For business analysts." />
        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          {[
            { emoji: '📈', label: 'Forecasting',         desc: 'Time-series demand/revenue forecasting on structured data. Supports series columns for per-group models.' },
            { emoji: '🚨', label: 'Anomaly Detection',   desc: 'Detect unexpected spikes or dips in numeric time-series data automatically.' },
            { emoji: '🏷️', label: 'Classification',      desc: 'Binary/multi-class classification on tabular data without writing ML code.' },
            { emoji: '📊', label: 'Contribution Explorer', desc: 'Identify which dimensions drive a metric change — ML-powered root cause.' },
          ].map((fn, i) => (
            <div key={i} className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
              <p className="font-bold text-emerald-800 text-sm mb-1">{fn.emoji} {fn.label}</p>
              <p className="text-xs text-emerald-700">{fn.desc}</p>
            </div>
          ))}
        </div>
        <CodeBlock code={`-- Time-series forecast (no Python needed)
CREATE OR REPLACE SNOWFLAKE.ML.FORECAST revenue_forecast (
  INPUT_DATA     => SYSTEM$REFERENCE('VIEW', 'daily_sales'),
  TIMESTAMP_COLNAME  => 'sale_date',
  TARGET_COLNAME     => 'revenue',
  CONFIG_OBJECT      => {'prediction_interval': 0.90}
);

-- Run forecast 30 days ahead
CALL revenue_forecast!FORECAST(FORECASTING_PERIODS => 30);

-- Anomaly detection model
CREATE OR REPLACE SNOWFLAKE.ML.ANOMALY_DETECTION anomaly_model (
  INPUT_DATA      => SYSTEM$REFERENCE('TABLE', 'server_metrics'),
  TIMESTAMP_COLNAME  => 'ts',
  TARGET_COLNAME     => 'cpu_usage'
);
CALL anomaly_model!DETECT_ANOMALIES(
  INPUT_DATA      => SYSTEM$REFERENCE('TABLE', 'server_metrics'),
  TIMESTAMP_COLNAME  => 'ts',
  TARGET_COLNAME     => 'cpu_usage'
);`} />
        <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
          <p className="text-xs font-bold text-yellow-700 mb-1">⚡ Exam Tip — ML Functions</p>
          <ul className="text-xs text-yellow-700 space-y-1 list-disc pl-4">
            <li>ML Functions are <strong>serverless</strong> — they use Snowflake-managed compute, not your warehouse.</li>
            <li>They live in the <strong>SNOWFLAKE.ML</strong> schema and are called with <code>CALL model_object!FORECAST(...)</code> syntax.</li>
            <li>Designed for <strong>business analysts</strong> who need ML insights without writing Python.</li>
          </ul>
        </div>
      </InfoCard>

      <ExamTip>
        <p><strong>Snowpark</strong>: push-down library (Python/Java/Scala). DataFrame is lazy — runs when you call <code>.collect()</code>. Use Snowpark-optimized WH for ML training.</p>
        <p><strong>Notebooks</strong>: SQL+Python cells inside Snowsight. Container Runtime = pre-installed PyTorch/XGBoost. Default WH = SYSTEM$STREAMLIT_NOTEBOOK_WH.</p>
        <p><strong>Streamlit in Snowflake</strong>: Python web app deployed as a Snowflake object. No external server. RBAC-secured. Created via SQL, UI, or Snowflake CLI.</p>
        <p><strong>Cortex AI Functions</strong>: COMPLETE, CLASSIFY, FILTER, EMBED, SENTIMENT, TRANSLATE in SQL. Requires CORTEX_USER role + USE AI FUNCTIONS privilege. Billed per token.</p>
        <p><strong>Cortex Search</strong>: fully managed hybrid (vector+keyword) search. Serverless — no infra to manage. Powers RAG. Uses Dynamic Table refresh mechanics.</p>
        <p><strong>Cortex Analyst</strong>: NL → SQL REST API. Uses Semantic Views (or YAML semantic model). Multi-turn conversations. Does NOT train on customer data.</p>
        <p><strong>Snowflake ML</strong>: Feature Store + Model Registry + ML Jobs + Observability. ML Functions (FORECAST, ANOMALY_DETECTION) in SQL for analysts — serverless, no Python required.</p>
      </ExamTip>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// LEARNING TAB 5 — 1.5 Storage Concepts
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
  { id: 'obj_sort', label: 'Object Sorter',     emoji: '📦', desc: '1.3 — Place objects in the correct hierarchy level' },
  { id: 'obj_mcq',  label: 'Object Types MCQ',  emoji: '🔢', desc: '1.3 — Stages, pipes, UDFs, params, context functions' },
  { id: 'wh',       label: 'WH Scenarios',      emoji: '⚙️', desc: '1.4 — Sizing, scaling, types, billing scenarios' },
  { id: 'storage',  label: 'Storage Concepts',  emoji: '🗄️', desc: '1.5 — Micro-partitions, table types, clustering, views' },
  { id: 'aiml',     label: 'AI/ML Features',    emoji: '🤖', desc: '1.6 — Snowpark, Notebooks, SiS, Cortex, Snowflake ML' },
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
      {active === 'obj_sort' && <ObjectsSortGame />}
      {active === 'obj_mcq'  && <ObjectsMCQChallenge />}
      {active === 'wh'       && <WarehouseScenarioPicker />}
      {active === 'storage'  && <StorageChallenge />}
      {active === 'aiml'     && <AIMLChallenge />}
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

// ── Challenge 4: Warehouse Scenario Picker ───────────────────────────────────
const WH_SCENARIOS_DATA = [
  {
    q: 'Queries on a production warehouse are running slowly. There are only 3 concurrent users. What is the best fix?',
    options: ['Enable multi-cluster warehouses', 'Resize the warehouse to a larger size', 'Add more clusters with MAXIMIZED mode', 'Enable ECONOMY scaling policy'],
    answer: 'Resize the warehouse to a larger size',
    exp: 'Slow queries = scale UP (resize). Multi-cluster fixes concurrency queuing, not individual query speed.',
  },
  {
    q: '150 BI analysts hit dashboards simultaneously every morning at 9am and queries queue heavily. What is the best fix?',
    options: ['Resize warehouse to 6X-Large', 'Enable multi-cluster with Auto-scale mode', 'Use ECONOMY scaling policy', 'Separate analysts onto individual warehouses'],
    answer: 'Enable multi-cluster with Auto-scale mode',
    exp: 'Many concurrent users queuing = scale OUT with multi-cluster. Auto-scale handles peak/off-peak automatically.',
  },
  {
    q: 'A data engineer runs a Python ML training stored procedure that crashes with out-of-memory errors. Which warehouse type should they use?',
    options: ['Standard Gen2', 'Standard Gen1 X-Large', 'Snowpark-optimized', 'Multi-cluster Standard'],
    answer: 'Snowpark-optimized',
    exp: 'Snowpark-optimized warehouses provide 16× more memory per node vs standard — designed specifically for ML training workloads.',
  },
  {
    q: 'A warehouse is sized X-Small (1 credit/hr). It runs for 30 seconds, then is suspended. How many credits are billed?',
    options: ['0.008 (30 seconds)', '0.017 (60 seconds — minimum)', '1.0 (full hour)', '0.5 (half minute rate)'],
    answer: '0.017 (60 seconds — minimum)',
    exp: 'Per-second billing has a 60-second MINIMUM. Running for only 30 seconds still bills a full 60 seconds.',
  },
  {
    q: 'Your ETL pipeline loads 10,000 small CSV files nightly. It is currently slow. What is the best approach?',
    options: ['Upgrade warehouse from Medium to 4X-Large', 'Use a Snowpark-optimized warehouse', 'Keep a Medium warehouse but split files correctly and increase file count', 'Enable multi-cluster for the ETL warehouse'],
    answer: 'Keep a Medium warehouse but split files correctly and increase file count',
    exp: 'Data loading performance scales with NUMBER OF FILES, not warehouse size. Upsizing rarely helps loading.',
  },
  {
    q: 'A multi-cluster Medium warehouse runs in Auto-scale mode with 3 clusters for 1 hour. Cluster 1 runs all hour, Clusters 2 and 3 run for 30 minutes each. What are the total credits billed?',
    options: ['4 credits', '8 credits', '12 credits', '16 credits'],
    answer: '8 credits',
    exp: 'Medium = 4 credits/hr per cluster. Cluster1: 4, Cluster2: 2 (30 min), Cluster3: 2 (30 min) = 4+2+2 = 8 credits.',
  },
  {
    q: 'An analyst needs a dedicated warehouse that wakes up immediately when they submit queries and never leaves data in cache during off-hours. What settings achieve this?',
    options: [
      'AUTO_RESUME=FALSE, AUTO_SUSPEND=0',
      'AUTO_RESUME=TRUE, AUTO_SUSPEND=60',
      'AUTO_RESUME=TRUE, AUTO_SUSPEND=NULL',
      'AUTO_RESUME=FALSE, AUTO_SUSPEND=300',
    ],
    answer: 'AUTO_RESUME=TRUE, AUTO_SUSPEND=60',
    exp: 'AUTO_RESUME=TRUE wakes on demand. AUTO_SUSPEND=60 (1 min) suspends quickly during inactivity, dropping cache and saving credits.',
  },
  {
    q: 'You need a multi-cluster warehouse where ALL clusters are always running for maximum predictable capacity. Which mode do you use?',
    options: ['Auto-scale with STANDARD policy', 'Auto-scale with ECONOMY policy', 'Maximized mode (MIN = MAX > 1)', 'Single-cluster with large size'],
    answer: 'Maximized mode (MIN = MAX > 1)',
    exp: 'Maximized mode: set MIN_CLUSTER_COUNT = MAX_CLUSTER_COUNT = same value > 1. All clusters run continuously.',
  },
  {
    q: 'A multi-cluster warehouse uses ECONOMY scaling policy. How does it decide to start a new cluster?',
    options: [
      'As soon as any query is queued',
      'Only if estimated load will keep the cluster busy for at least 6 minutes',
      'Every 5 minutes during peak hours',
      'When the warehouse reaches 50% utilization',
    ],
    answer: 'Only if estimated load will keep the cluster busy for at least 6 minutes',
    exp: 'ECONOMY policy only starts a new cluster when there is enough estimated workload to justify it (≥6 min of work), conserving credits.',
  },
  {
    q: 'Which warehouse privilege allows a role to suspend, resume, and resize warehouses it does NOT own?',
    options: ['USAGE', 'OPERATE', 'MANAGE WAREHOUSES', 'MODIFY'],
    answer: 'MANAGE WAREHOUSES',
    exp: 'MANAGE WAREHOUSES on ACCOUNT grants MODIFY + MONITOR + OPERATE on ALL warehouses — equivalent to delegating full warehouse management.',
  },
  {
    q: 'You resize a running Large warehouse to X-Large. What happens to the queries currently executing?',
    options: [
      'They are immediately re-run on the larger warehouse',
      'They are cancelled and requeued',
      'They continue on current resources; new size applies only to queued/new queries',
      'The warehouse suspends and resumes at the new size',
    ],
    answer: 'They continue on current resources; new size applies only to queued/new queries',
    exp: 'Resizing never interrupts running queries. New compute resources are used only for queued and future queries.',
  },
  {
    q: 'The default warehouse for Snowflake Notebooks is called…',
    options: ['SYSTEM$DEFAULT_NOTEBOOK_WH', 'SYSTEM$STREAMLIT_NOTEBOOK_WH', 'PUBLIC.NOTEBOOK_WH', 'COMPUTE_WH'],
    answer: 'SYSTEM$STREAMLIT_NOTEBOOK_WH',
    exp: 'SYSTEM$STREAMLIT_NOTEBOOK_WH is the auto-provisioned multi-cluster X-Small warehouse for Notebook workloads. PUBLIC role has USAGE by default.',
  },
];

const WarehouseScenarioPicker = () => {
  const [current, setCurrent] = useState(0);
  const [picked,  setPicked]  = useState(null);
  const [score,   setScore]   = useState(0);
  const [history, setHistory] = useState([]);
  const [done,    setDone]    = useState(false);

  const scenario  = WH_SCENARIOS_DATA[current];
  const isCorrect = picked === scenario?.answer;

  const handlePick = useCallback((opt) => {
    if (picked) return;
    const correct = opt === scenario.answer;
    setPicked(opt);
    if (correct) setScore(s => s + 1);
    setHistory(h => [...h, { ...scenario, picked: opt, correct }]);
  }, [picked, scenario]);

  const next  = () => { if (current + 1 >= WH_SCENARIOS_DATA.length) setDone(true); else { setCurrent(c => c + 1); setPicked(null); }};
  const reset = () => { setCurrent(0); setPicked(null); setScore(0); setHistory([]); setDone(false); };

  if (done) return (
    <div className="space-y-4">
      <InfoCard className="text-center py-8">
        <p className="text-5xl mb-3">{score / WH_SCENARIOS_DATA.length >= 0.9 ? '🎉' : score / WH_SCENARIOS_DATA.length >= 0.7 ? '👍' : '📚'}</p>
        <h3 className="text-2xl font-bold text-slate-800 mb-1">Warehouse Challenge Complete!</h3>
        <p className="text-slate-500 mb-5">Score: <span className="font-bold text-violet-700 text-xl">{score}</span> / {WH_SCENARIOS_DATA.length}</p>
        <button onClick={reset} className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-8 py-3 rounded-xl">Retry</button>
      </InfoCard>
      <InfoCard>
        <h3 className="font-bold text-slate-700 mb-3">Full Review</h3>
        <div className="space-y-2">
          {history.map((h, i) => (
            <div key={i} className={`p-3 rounded-xl border text-xs ${h.correct ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
              <p className="font-medium text-slate-600 mb-1">{h.q}</p>
              {h.correct
                ? <p className="text-emerald-700 font-bold">✓ {h.answer}</p>
                : <><p className="text-red-700">✗ You picked: <span className="font-bold">{h.picked}</span></p>
                   <p className="text-red-700">✓ Correct: <span className="font-bold">{h.answer}</span></p></>
              }
              <p className="text-slate-500 mt-1 italic">{h.exp}</p>
            </div>
          ))}
        </div>
      </InfoCard>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-slate-700">Scenario {current + 1} of {WH_SCENARIOS_DATA.length}</span>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-violet-600">Score: {score}</span>
            <button onClick={reset} className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 font-semibold">
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div className="bg-violet-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(current / WH_SCENARIOS_DATA.length) * 100}%` }} />
        </div>
      </div>

      <InfoCard>
        <p className="text-[10px] font-bold text-violet-600 uppercase tracking-wider mb-2">Warehouse Scenario</p>
        <p className="text-base font-semibold text-slate-800 leading-relaxed mb-5">{scenario.q}</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {scenario.options.map(opt => {
            const isAnswer = opt === scenario.answer;
            const isPicked = opt === picked;
            let cls = 'border-slate-200 bg-white text-slate-700 hover:border-violet-300 hover:bg-violet-50';
            if (picked) {
              if (isAnswer)       cls = 'border-emerald-400 bg-emerald-50 text-emerald-800 font-bold';
              else if (isPicked)  cls = 'border-red-300 bg-red-50 text-red-700 line-through opacity-70';
              else                cls = 'border-slate-100 bg-slate-50 text-slate-300 opacity-40';
            }
            return (
              <button key={opt} disabled={!!picked} onClick={() => handlePick(opt)}
                className={`text-sm px-4 py-3 rounded-xl border text-left transition-all leading-snug ${cls}`}>
                {opt}
              </button>
            );
          })}
        </div>
        {picked && (
          <div className={`mt-4 p-4 rounded-xl border ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
            <p className={`text-sm font-bold mb-1 ${isCorrect ? 'text-emerald-800' : 'text-red-800'}`}>
              {isCorrect ? '✓ Correct!' : `✗ Correct answer: ${scenario.answer}`}
            </p>
            <p className={`text-sm ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>{scenario.exp}</p>
            <button onClick={next}
              className="mt-3 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors">
              {current + 1 < WH_SCENARIOS_DATA.length ? 'Next →' : 'See Results'}
            </button>
          </div>
        )}
      </InfoCard>
    </div>
  );
};

// ── Challenge 5: Object Hierarchy Sorter ─────────────────────────────────────
const OBJ_LEVEL_DATA = [
  { id: 'org',     label: 'Organization', emoji: '🌐', color: 'bg-violet-600', light: 'bg-violet-50', border: 'border-violet-300', text: 'text-violet-800' },
  { id: 'account', label: 'Account',      emoji: '🏢', color: 'bg-blue-600',   light: 'bg-blue-50',   border: 'border-blue-300',   text: 'text-blue-800' },
  { id: 'db',      label: 'Database',     emoji: '🗄️', color: 'bg-teal-600',   light: 'bg-teal-50',   border: 'border-teal-300',   text: 'text-teal-800' },
  { id: 'schema',  label: 'Schema',       emoji: '📂', color: 'bg-slate-600',  light: 'bg-slate-100', border: 'border-slate-300',  text: 'text-slate-800' },
];

const OBJ_SORT_CARDS = [
  { id: 'o1',  text: 'Replication group',             level: 'org',     hint: 'Replication groups are organization-level objects used for cross-account DR.' },
  { id: 'o2',  text: 'Virtual warehouse',              level: 'account', hint: 'Warehouses are account-level — they are not inside any database.' },
  { id: 'o3',  text: 'User',                           level: 'account', hint: 'Users live at the account level, not inside a database.' },
  { id: 'o4',  text: 'Role',                           level: 'account', hint: 'Roles are account-level security objects.' },
  { id: 'o5',  text: 'Network policy',                 level: 'account', hint: 'Network policies are account-level governance objects.' },
  { id: 'o6',  text: 'Schema',                         level: 'db',      hint: 'Schemas are database-level objects — they live inside a database.' },
  { id: 'o7',  text: 'INFORMATION_SCHEMA',             level: 'db',      hint: 'INFORMATION_SCHEMA is auto-created in every database.' },
  { id: 'o8',  text: 'Stage',                          level: 'schema',  hint: 'Stages (named stages) are schema-level objects.' },
  { id: 'o9',  text: 'Pipe',                           level: 'schema',  hint: 'Pipes are schema-level objects that power Snowpipe.' },
  { id: 'o10', text: 'File format',                    level: 'schema',  hint: 'File formats are schema-level, reusable across COPY commands.' },
  { id: 'o11', text: 'Stored procedure',               level: 'schema',  hint: 'Stored procedures live in a schema.' },
  { id: 'o12', text: 'UDF',                            level: 'schema',  hint: 'User-Defined Functions are schema-level objects.' },
  { id: 'o13', text: 'Share',                          level: 'account', hint: 'Shares are account-level objects — you share from account to account.' },
  { id: 'o14', text: 'Resource monitor',               level: 'account', hint: 'Resource monitors are account-level cost control objects.' },
  { id: 'o15', text: 'Sequence',                       level: 'schema',  hint: 'Sequences are schema-level objects for generating unique integers.' },
];

const ObjectsSortGame = () => {
  const [assignments, setAssignments] = useState({});
  const [selected,    setSelected]    = useState(null);
  const [revealed,    setRevealed]    = useState(false);

  const score = Object.entries(assignments).filter(([cid, lid]) =>
    OBJ_SORT_CARDS.find(c => c.id === cid)?.level === lid
  ).length;

  const reset       = () => { setAssignments({}); setSelected(null); setRevealed(false); };
  const unassigned  = OBJ_SORT_CARDS.filter(c => !assignments[c.id]);
  const pickCard    = id  => setSelected(selected === id ? null : id);
  const dropOnLevel = lid => {
    if (!selected || revealed) return;
    setAssignments(p => ({ ...p, [selected]: lid }));
    setSelected(null);
  };
  const removeCard  = cid => {
    if (revealed) return;
    setAssignments(p => { const n = { ...p }; delete n[cid]; return n; });
  };

  return (
    <InfoCard>
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-slate-800">Object Hierarchy Sorter</h3>
        <button onClick={reset} className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 font-semibold">
          <RefreshCw className="w-3 h-3" /> Reset
        </button>
      </div>
      <p className="text-xs text-slate-400 mb-4">
        <strong>Step 1:</strong> Click an object to select it (turns violet).&nbsp;
        <strong>Step 2:</strong> Click the hierarchy level it belongs to. Click a placed chip to remove it.
        {revealed && <span className="ml-2 font-bold text-violet-700">Score: {score}/{OBJ_SORT_CARDS.length}</span>}
      </p>

      {unassigned.length > 0 && (
        <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Objects to sort — {unassigned.length} remaining</p>
          <div className="flex flex-wrap gap-2">
            {unassigned.map(c => (
              <button key={c.id} onClick={() => pickCard(c.id)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                  selected === c.id
                    ? 'bg-violet-600 text-white border-violet-600 shadow-md scale-105'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-violet-300 hover:bg-violet-50'
                }`}>{c.text}</button>
            ))}
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        {OBJ_LEVEL_DATA.map(lvl => {
          const here = OBJ_SORT_CARDS.filter(c => assignments[c.id] === lvl.id);
          return (
            <div key={lvl.id} onClick={() => dropOnLevel(lvl.id)}
              className={`rounded-xl border-2 p-3 min-h-[90px] transition-all ${
                selected ? `${lvl.border} ${lvl.light} shadow-md cursor-pointer` : 'border-slate-200 bg-slate-50'
              }`}>
              <p className={`text-xs font-bold mb-2 ${lvl.text}`}>{lvl.emoji} {lvl.label}</p>
              <div className="flex flex-wrap gap-1">
                {here.map(c => {
                  const ok = c.level === lvl.id;
                  return (
                    <span key={c.id} onClick={e => { e.stopPropagation(); removeCard(c.id); }}
                      title="Click to remove"
                      className={`text-[10px] px-2 py-1 rounded-full border cursor-pointer transition-all ${
                        revealed
                          ? ok ? 'bg-emerald-100 border-emerald-400 text-emerald-800' : 'bg-red-100 border-red-300 text-red-700 line-through'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-red-50 hover:border-red-300'
                      }`}>{c.text}</span>
                  );
                })}
              </div>
              {selected && here.length === 0 && (
                <p className={`text-[10px] italic ${lvl.text} opacity-40`}>Drop here</p>
              )}
            </div>
          );
        })}
      </div>

      {!revealed ? (
        <button onClick={() => setRevealed(true)}
          disabled={Object.keys(assignments).length < OBJ_SORT_CARDS.length}
          className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-violet-200 text-white font-bold py-3 rounded-xl text-sm transition-colors">
          Check Answers ({Object.keys(assignments).length}/{OBJ_SORT_CARDS.length} sorted)
        </button>
      ) : (
        <div className="space-y-2">
          <p className="text-center font-bold text-slate-700 text-lg">
            {score === OBJ_SORT_CARDS.length ? '🎉 Perfect!' : `${score}/${OBJ_SORT_CARDS.length} correct`}
          </p>
          {OBJ_SORT_CARDS.filter(c => assignments[c.id] !== c.level).map(c => (
            <div key={c.id} className="text-xs bg-red-50 border border-red-200 rounded-lg p-2.5 text-red-700">
              <span className="font-bold">"{c.text}"</span> → belongs to{' '}
              <span className="font-bold text-violet-700">
                {OBJ_LEVEL_DATA.find(l => l.id === c.level)?.emoji} {OBJ_LEVEL_DATA.find(l => l.id === c.level)?.label}
              </span>. {c.hint}
            </div>
          ))}
        </div>
      )}
    </InfoCard>
  );
};

// ── Challenge 4b: Object Types MCQ ───────────────────────────────────────────
const OBJECTS_MCQ_DATA = [
  {
    q: 'Which object powers Snowpipe\'s auto-ingest capability?',
    options: ['Stage', 'Pipe', 'Stream', 'Task'],
    answer: 'Pipe',
    hint: 'Pipes define the COPY INTO statement and AUTO_INGEST = TRUE that drives Snowpipe.',
  },
  {
    q: 'A Stored Procedure runs with whose privileges by default?',
    options: ["Caller's role privileges", "Owner's role privileges", "SYSADMIN privileges", "PUBLIC role privileges"],
    answer: "Owner's role privileges",
    hint: "By default, stored procedures run with owner's rights — callers get the owner's privileges, not their own.",
  },
  {
    q: 'What is the key difference between a UDF and a Stored Procedure?',
    options: [
      'UDFs support Python; stored procs do not',
      'UDFs return a value but cannot execute DML; stored procs can',
      'Stored procs are faster than UDFs',
      'UDFs require a warehouse; stored procs do not',
    ],
    answer: 'UDFs return a value but cannot execute DML; stored procs can',
    hint: 'UDFs = return values for use in SELECT. Stored procs = procedural logic including DML like INSERT/DELETE.',
  },
  {
    q: 'Which stage prefix refers to the Table Stage for a table named "orders"?',
    options: ['@~orders', '@%orders', '@#orders', '@orders'],
    answer: '@%orders',
    hint: '@%tablename is the table stage. @~ is the user stage. Named stages use @stagename.',
  },
  {
    q: 'A Sequence in Snowflake guarantees values are…',
    options: [
      'Unique and gap-free',
      'Unique but NOT gap-free',
      'Sequential and always start from 1',
      'Monotonically increasing per session only',
    ],
    answer: 'Unique but NOT gap-free',
    hint: 'Sequences guarantee uniqueness but NOT gap-free ordering — concurrent transactions can cause gaps.',
  },
  {
    q: 'Which parameter level has the highest precedence (overrides all others)?',
    options: ['Account level', 'User level', 'Session level', 'Object level'],
    answer: 'Object level',
    hint: 'Object > Session > User > Account. The most specific setting always wins.',
  },
  {
    q: 'What command temporarily overrides a parameter for the current connection only?',
    options: ['ALTER ACCOUNT SET', 'ALTER USER SET', 'ALTER SESSION SET', 'SET PARAMETER'],
    answer: 'ALTER SESSION SET',
    hint: 'ALTER SESSION SET applies only to the current session — it is cleared when the session ends.',
  },
  {
    q: 'A Share is created on which side of a data sharing relationship?',
    options: ['Consumer side', 'Provider side', 'Both sides simultaneously', 'Marketplace side'],
    answer: 'Provider side',
    hint: 'The data provider creates the Share object, adds database/schema/table grants, then adds consumer accounts.',
  },
  {
    q: 'What function returns the currently active role in the session?',
    options: ['CURRENT_USER()', 'CURRENT_ROLE()', 'CURRENT_ACCOUNT()', 'SESSION_ROLE()'],
    answer: 'CURRENT_ROLE()',
    hint: 'CURRENT_ROLE() returns the active role. CURRENT_USER() returns the logged-in username.',
  },
  {
    q: 'A Named Stage that points to an S3 bucket is known as a(n)…',
    options: ['Internal stage', 'External stage', 'User stage', 'Cloud stage'],
    answer: 'External stage',
    hint: 'Named stages pointing to cloud storage (S3, Azure Blob, GCS) are called External stages.',
  },
  {
    q: 'Which object type encapsulates a packaged application with a Streamlit UI built with the Native App Framework?',
    options: ['UDF', 'Application', 'Stored Procedure', 'ML Model'],
    answer: 'Application',
    hint: 'Snowflake Native Apps are "Application" objects — they can include Streamlit UIs, procedures, and container services.',
  },
  {
    q: 'INFORMATION_SCHEMA is automatically created in…',
    options: ['Every account', 'Every database', 'Every schema', 'Every warehouse'],
    answer: 'Every database',
    hint: 'INFORMATION_SCHEMA is auto-created in every database and contains views for that database\'s metadata.',
  },
];

const ObjectsMCQChallenge = () => {
  const [answers,  setAnswers]  = useState({});
  const [revealed, setRevealed] = useState(false);
  const score = Object.entries(answers).filter(([qi, ans]) => ans === OBJECTS_MCQ_DATA[qi].answer).length;
  const reset = () => { setAnswers({}); setRevealed(false); };

  return (
    <InfoCard>
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-violet-500" /> Object Types — Knowledge Check
        </h3>
        {revealed && (
          <button onClick={reset} className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 font-semibold">
            <RefreshCw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>
      <p className="text-xs text-slate-400 mb-5">
        Select the best answer. Answer all {OBJECTS_MCQ_DATA.length} to check your score.
        {revealed && (
          <span className="ml-2 font-bold text-violet-700">
            Score: {score}/{OBJECTS_MCQ_DATA.length} {score / OBJECTS_MCQ_DATA.length >= 0.9 ? '🎉' : score / OBJECTS_MCQ_DATA.length >= 0.7 ? '👍' : '📚'}
          </span>
        )}
      </p>
      <div className="space-y-4">
        {OBJECTS_MCQ_DATA.map((q, qi) => {
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
                    if (isCorrect)     cls = 'border-emerald-400 bg-emerald-50 text-emerald-800 font-bold';
                    else if (isPicked) cls = 'border-red-300 bg-red-50 text-red-700 line-through opacity-60';
                    else               cls = 'border-slate-100 bg-white text-slate-300 opacity-40';
                  } else if (isPicked) cls = 'border-violet-400 bg-violet-50 text-violet-800 font-semibold';
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
      <button onClick={() => setRevealed(true)}
        disabled={Object.keys(answers).length < OBJECTS_MCQ_DATA.length || revealed}
        className="mt-5 w-full bg-violet-600 hover:bg-violet-700 disabled:bg-violet-200 text-white font-bold py-3 rounded-xl transition-colors text-sm">
        {revealed
          ? `Score: ${score}/${OBJECTS_MCQ_DATA.length} — hit Reset to try again`
          : `Check Answers (${Object.keys(answers).length}/${OBJECTS_MCQ_DATA.length} answered)`}
      </button>
    </InfoCard>
  );
};

// ── Challenge 6: AI/ML Features MCQ ─────────────────────────────────────────
const AIML_MCQ_DATA = [
  {
    q: 'A data scientist writes Snowpark Python code that builds a DataFrame pipeline. When does the SQL actually run in Snowflake?',
    options: ['When the DataFrame is created', 'When the filter is applied', 'When .collect() or another action is called', 'When the session is started'],
    answer: 'When .collect() or another action is called',
    exp: 'Snowpark DataFrames are lazy — transformations are not executed until an action (collect, show, etc.) is called, which sends the compiled SQL to Snowflake.',
  },
  {
    q: 'A developer wants to build an internal analytics dashboard using Python and deploy it inside Snowflake with no external servers. Which feature should they use?',
    options: ['Snowpark stored procedure', 'Snowflake Notebooks', 'Streamlit in Snowflake', 'Cortex Analyst REST API'],
    answer: 'Streamlit in Snowflake',
    exp: 'Streamlit in Snowflake (SiS) lets you deploy Python web apps as Snowflake objects — no external infrastructure needed.',
  },
  {
    q: 'Which privilege combination is required for a user to call Cortex AI Functions like AI_COMPLETE?',
    options: [
      'SYSADMIN role only',
      'SNOWFLAKE.CORTEX_USER database role AND USE AI FUNCTIONS privilege',
      'ACCOUNTADMIN role only',
      'USAGE on the function schema',
    ],
    answer: 'SNOWFLAKE.CORTEX_USER database role AND USE AI FUNCTIONS privilege',
    exp: 'Both are required: the CORTEX_USER database role AND the account-level USE AI FUNCTIONS privilege. By default, both are granted to PUBLIC.',
  },
  {
    q: 'A business analyst wants to ask "What was last month\u0027s revenue by region?" in plain English and get an answer from Snowflake data — without writing SQL. Which Cortex feature handles this?',
    options: ['Cortex AI Functions (AI_COMPLETE)', 'Cortex Search', 'Cortex Analyst', 'Snowflake ML Forecasting'],
    answer: 'Cortex Analyst',
    exp: 'Cortex Analyst converts natural language business questions to SQL using a Semantic View or YAML semantic model — designed for non-technical users.',
  },
  {
    q: 'A team needs low-latency fuzzy search over a large collection of customer support tickets to power an AI chatbot (RAG). Which Cortex service should they use?',
    options: ['Cortex Analyst', 'AI_COMPLETE with a large context window', 'Cortex Search', 'AI_EXTRACT'],
    answer: 'Cortex Search',
    exp: 'Cortex Search provides hybrid vector+keyword search with semantic reranking — purpose-built for RAG knowledge bases and enterprise search.',
  },
  {
    q: 'Which Snowpark warehouse type is recommended for an ML training stored procedure that requires 200 GB of memory?',
    options: ['Standard X-Large', 'Standard 4X-Large', 'Snowpark-optimized with MEMORY_16X', 'Multi-cluster Standard'],
    answer: 'Snowpark-optimized with MEMORY_16X',
    exp: 'Snowpark-optimized warehouses provide 16× memory per node by default (MEMORY_16X = 256 GB). Standard warehouses do not offer per-node memory scaling.',
  },
  {
    q: 'A data analyst wants to forecast sales for the next 30 days using SQL, without writing any Python. Which Snowflake feature enables this?',
    options: ['Snowpark ML model', 'Cortex AI_COMPLETE', 'Snowflake ML Functions (SNOWFLAKE.ML.FORECAST)', 'Snowflake Datasets'],
    answer: 'Snowflake ML Functions (SNOWFLAKE.ML.FORECAST)',
    exp: 'ML Functions like SNOWFLAKE.ML.FORECAST are serverless, SQL-callable ML capabilities — no Python or model training required.',
  },
  {
    q: 'A Cortex Search service is created with TARGET_LAG = \'1 hour\'. What does this mean?',
    options: [
      'The service must respond to queries within 1 hour',
      'The index refreshes from base data approximately every 1 hour',
      'Queries older than 1 hour are expired',
      'The service is available for only 1 hour after creation',
    ],
    answer: 'The index refreshes from base data approximately every 1 hour',
    exp: 'TARGET_LAG in Cortex Search works like Dynamic Tables — it defines the maximum lag between base data changes and the search index being updated.',
  },
  {
    q: 'Which of the following is NOT a Cortex AI Function?',
    options: ['AI_COMPLETE', 'AI_FORECAST', 'AI_CLASSIFY', 'AI_SENTIMENT'],
    answer: 'AI_FORECAST',
    exp: 'AI_FORECAST does not exist. Forecasting is done via SNOWFLAKE.ML.FORECAST (an ML Function). Cortex AI Functions include COMPLETE, CLASSIFY, FILTER, SENTIMENT, TRANSLATE, EMBED, etc.',
  },
  {
    q: 'Streamlit in Snowflake apps can be created via which methods?',
    options: [
      'Snowsight UI only',
      'SQL only',
      'Snowsight UI, SQL, or Snowflake CLI',
      'Snowflake CLI only',
    ],
    answer: 'Snowsight UI, SQL, or Snowflake CLI',
    exp: 'SiS apps can be created and deployed via Snowsight, SQL (CREATE STREAMLIT), or Snowflake CLI — all three methods are supported.',
  },
  {
    q: 'The Snowflake Feature Store is part of which product?',
    options: ['Streamlit in Snowflake', 'Snowpark API', 'Snowflake ML', 'Cortex Search'],
    answer: 'Snowflake ML',
    exp: 'The Feature Store is a component of Snowflake ML — it defines, manages, stores, and discovers ML features with automated incremental refresh from batch and streaming sources.',
  },
  {
    q: 'Cortex Analyst uses which object type to bridge business language and database schema?',
    options: ['External tables', 'Semantic Views (or YAML semantic model on a stage)', 'Dynamic tables', 'Information Schema views'],
    answer: 'Semantic Views (or YAML semantic model on a stage)',
    exp: 'Cortex Analyst relies on Semantic Views (recommended, schema-level objects) or legacy YAML semantic model files on a stage to understand business concepts like metrics, dimensions, and relationships.',
  },
];

const AIMLChallenge = () => {
  const [current, setCurrent] = useState(0);
  const [picked,  setPicked]  = useState(null);
  const [score,   setScore]   = useState(0);
  const [history, setHistory] = useState([]);
  const [done,    setDone]    = useState(false);

  const q = AIML_MCQ_DATA[current];
  const isCorrect = picked === q?.answer;

  const handlePick = useCallback((opt) => {
    if (picked) return;
    const correct = opt === q.answer;
    setPicked(opt);
    if (correct) setScore(s => s + 1);
    setHistory(h => [...h, { ...q, picked: opt, correct }]);
  }, [picked, q]);

  const next  = () => { if (current + 1 >= AIML_MCQ_DATA.length) setDone(true); else { setCurrent(c => c + 1); setPicked(null); }};
  const reset = () => { setCurrent(0); setPicked(null); setScore(0); setHistory([]); setDone(false); };

  if (done) return (
    <div className="space-y-4">
      <InfoCard className="text-center py-8">
        <p className="text-5xl mb-3">{score / AIML_MCQ_DATA.length >= 0.9 ? '🎉' : score / AIML_MCQ_DATA.length >= 0.7 ? '👍' : '📚'}</p>
        <h3 className="text-2xl font-bold text-slate-800 mb-1">AI/ML Challenge Complete!</h3>
        <p className="text-slate-500 mb-5">Score: <span className="font-bold text-violet-700 text-xl">{score}</span> / {AIML_MCQ_DATA.length}</p>
        <button onClick={reset} className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-8 py-3 rounded-xl">Retry</button>
      </InfoCard>
      <InfoCard>
        <h3 className="font-bold text-slate-700 mb-3">Full Review</h3>
        <div className="space-y-2">
          {history.map((h, i) => (
            <div key={i} className={`p-3 rounded-xl border text-xs ${h.correct ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
              <p className="font-medium text-slate-600 mb-1">{h.q}</p>
              {h.correct
                ? <p className="text-emerald-700 font-bold">✓ {h.answer}</p>
                : <><p className="text-red-700">✗ You picked: <span className="font-bold">{h.picked}</span></p>
                   <p className="text-red-700">✓ Correct: <span className="font-bold">{h.answer}</span></p></>
              }
              <p className="text-slate-500 mt-1 italic">{h.exp}</p>
            </div>
          ))}
        </div>
      </InfoCard>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-slate-700">Question {current + 1} of {AIML_MCQ_DATA.length}</span>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-violet-600">Score: {score}</span>
            <button onClick={reset} className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 font-semibold">
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div className="bg-violet-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(current / AIML_MCQ_DATA.length) * 100}%` }} />
        </div>
      </div>

      <InfoCard>
        <p className="text-[10px] font-bold text-violet-600 uppercase tracking-wider mb-2">AI/ML Features Question</p>
        <p className="text-base font-semibold text-slate-800 leading-relaxed mb-5">{q.q}</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {q.options.map(opt => {
            const isAns = opt === q.answer;
            const isPicked = opt === picked;
            let cls = 'border-slate-200 bg-white text-slate-700 hover:border-violet-300 hover:bg-violet-50';
            if (picked) {
              if (isAns)       cls = 'border-emerald-400 bg-emerald-50 text-emerald-800 font-bold';
              else if (isPicked) cls = 'border-red-300 bg-red-50 text-red-700 line-through opacity-70';
              else               cls = 'border-slate-100 bg-slate-50 text-slate-300 opacity-40';
            }
            return (
              <button key={opt} disabled={!!picked} onClick={() => handlePick(opt)}
                className={`text-sm px-4 py-3 rounded-xl border text-left transition-all leading-snug ${cls}`}>
                {opt}
              </button>
            );
          })}
        </div>
        {picked && (
          <div className={`mt-4 p-4 rounded-xl border ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
            <p className={`text-sm font-bold mb-1 ${isCorrect ? 'text-emerald-800' : 'text-red-800'}`}>
              {isCorrect ? '✓ Correct!' : `✗ Correct answer: ${q.answer}`}
            </p>
            <p className={`text-sm ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>{q.exp}</p>
            <button onClick={next}
              className="mt-3 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors">
              {current + 1 < AIML_MCQ_DATA.length ? 'Next →' : 'See Results'}
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
