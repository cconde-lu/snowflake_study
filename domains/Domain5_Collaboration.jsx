import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  Shield, Share2, ShoppingBag, ChevronRight,
  CheckCircle, XCircle, FlaskConical, Construction,
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

const CodeBlock = ({ code }) => (
  <pre className="bg-slate-900 text-emerald-300 text-xs rounded-xl p-4 overflow-x-auto leading-relaxed font-mono mt-2">
    <code>{code}</code>
  </pre>
);

// ─── Tab registry — mirrors guide objectives 5.1 → 5.3 ──────────────────────
const TABS = [
  { id: 'protection',  label: '🛡️ 5.1 Data Protection' },
  { id: 'sharing',     label: '🤝 5.2 Data Sharing' },
  { id: 'marketplace', label: '🛒 5.3 Marketplace & Listings' },
  { id: 'quiz',        label: '🧪 Quiz', accent: true },
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

// ─── Domain 5 root ────────────────────────────────────────────────────────────
const Domain5_Collaboration = () => {
  const [activeTab, setActiveTab] = useState('protection');
  return (
    <div className="space-y-4">
      <div className="flex overflow-x-auto border-b border-slate-200 pb-px">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-3 font-medium text-sm transition-colors whitespace-nowrap border-b-2 ${
              activeTab === tab.id
                ? tab.accent
                  ? 'border-violet-600 text-violet-700 bg-violet-50/60'
                  : 'border-rose-600 text-rose-700 bg-rose-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'protection'  && <ProtectionTab />}
      {activeTab === 'sharing'     && <SharingTab />}
      {activeTab === 'marketplace' && <MarketplaceTab />}
      {activeTab === 'quiz'        && <QuizTab />}
      {!['protection', 'sharing', 'marketplace', 'quiz'].includes(activeTab) &&
        <ComingSoon tab={TABS.find(t => t.id === activeTab)?.label} />}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// LEARNING TAB 1 — 5.1 Data Collaboration & Protection
// Covers: Time Travel · Fail-safe · Zero-copy Cloning · Data Replication & Failover
// ═══════════════════════════════════════════════════════════════════════════════

const TT_SYNTAX = [
  {
    keyword: 'AT(TIMESTAMP => ...)',
    use: 'Query or clone data as of a specific past timestamp.',
    code: `-- Query orders as they existed on Jan 15
SELECT * FROM orders
  AT(TIMESTAMP => '2024-01-15 12:00:00'::TIMESTAMP_LTZ);

-- Clone a table at a historical timestamp
CREATE TABLE orders_jan15 CLONE orders
  AT(TIMESTAMP => '2024-01-15 00:00:00'::TIMESTAMP_LTZ);`,
  },
  {
    keyword: 'AT(OFFSET => -N)',
    use: 'Query data N seconds in the past relative to now. Negative integer = seconds back.',
    code: `-- Query data as it was 1 hour ago
SELECT * FROM orders AT(OFFSET => -3600);

-- Clone to capture the state 30 minutes ago
CREATE TABLE orders_backup CLONE orders
  AT(OFFSET => -1800);`,
  },
  {
    keyword: 'AT(STATEMENT => \'query_id\')',
    use: 'Query data as it was immediately after a given query executed.',
    code: `-- Capture state just after a specific statement ran
SELECT * FROM orders
  AT(STATEMENT => '01abc123-0000-1234-abcd-000000000001');`,
  },
  {
    keyword: 'BEFORE(STATEMENT => \'query_id\')',
    use: 'Query data as it was immediately before a specific query. Perfect for undoing accidental DML.',
    code: `-- Undo pattern: clone the table to the state BEFORE the bad DELETE
CREATE TABLE orders_recovery CLONE orders
  BEFORE(STATEMENT => '01abc123-0000-1234-abcd-000000000001');`,
  },
];

const CLONE_CAN = [
  { obj: 'Database', note: 'Recursively clones all contained schemas and tables.' },
  { obj: 'Schema', note: 'Clones all tables, views, stages, file formats, etc. within.' },
  { obj: 'Table (permanent / transient / temporary)', note: 'Most common. Zero-copy — no data movement.' },
  { obj: 'Stream', note: 'Clone inherits the same offset as the source stream.' },
  { obj: 'Named Stage', note: 'References same underlying storage; files are not duplicated.' },
  { obj: 'File Format', note: 'Exact copy of format definition.' },
  { obj: 'Sequence', note: 'Starts from the same current value as the source.' },
  { obj: 'Task', note: 'Cloned in SUSPENDED state.' },
  { obj: 'Pipe', note: 'Clone state depends on AUTO_INGEST: FALSE → PAUSED; TRUE → STOPPED_CLONED (won\'t accumulate event notifications until resumed).' },
];

const ProtectionTab = () => {
  const [openTT,    setOpenTT]    = useState(null);
  const [openClone, setOpenClone] = useState(null);

  return (
    <div className="space-y-5">
      {/* Time Travel */}
      <InfoCard>
        <SectionHeader
          icon={Shield}
          color="bg-rose-700"
          title="5.1 Data Collaboration & Protection"
          subtitle="Time Travel · Fail-safe · Zero-copy Cloning · Replication & Failover"
        />

        <h3 className="font-bold text-slate-700 mb-2">Time Travel</h3>
        <p className="text-xs text-slate-500 mb-3">
          Time Travel lets you query, clone, and restore any data from within the retention window — no backup needed.
        </p>

        <div className="overflow-x-auto mb-3">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Edition / Object</th>
                <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Max Retention</th>
                <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Default</th>
                <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Notes</th>
              </tr>
            </thead>
            <tbody>
              {[
                { ed: 'Standard edition',       max: '1 day',  def: '1 day',  note: 'Cannot exceed 1 day regardless of setting.' },
                { ed: 'Enterprise+ edition',    max: '90 days', def: '1 day', note: 'Set per-object with DATA_RETENTION_TIME_IN_DAYS.' },
                { ed: 'Temporary table',        max: '1 day',  def: '0 days', note: 'Designed to reduce storage; set 0 to disable.' },
                { ed: 'Transient table',        max: '1 day',  def: '0 days', note: 'No Fail-safe; lower storage cost than permanent.' },
              ].map(r => (
                <tr key={r.ed} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-2 border border-slate-200 font-bold text-rose-700">{r.ed}</td>
                  <td className="p-2 border border-slate-200 text-slate-700">{r.max}</td>
                  <td className="p-2 border border-slate-200 text-slate-500">{r.def}</td>
                  <td className="p-2 border border-slate-200 text-slate-500">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h4 className="text-xs font-bold text-slate-600 mb-2 mt-4">AT / BEFORE Syntax — click to expand</h4>
        <div className="space-y-2 mb-4">
          {TT_SYNTAX.map((s, i) => (
            <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-4 py-3 text-left bg-slate-50 hover:bg-slate-100 transition-colors"
                onClick={() => setOpenTT(openTT === i ? null : i)}
              >
                <span className="font-mono text-rose-700 text-xs font-bold bg-rose-50 px-2 py-0.5 rounded">{s.keyword}</span>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${openTT === i ? 'rotate-90' : ''}`} />
              </button>
              {openTT === i && (
                <div className="px-4 pb-4 pt-2 bg-white">
                  <p className="text-sm text-slate-600 mb-2">{s.use}</p>
                  <CodeBlock code={s.code} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div className="bg-rose-50 rounded-xl p-3 border border-rose-200">
            <p className="text-xs font-bold text-rose-800 mb-1">UNDROP commands</p>
            <CodeBlock code={`UNDROP TABLE orders;
UNDROP SCHEMA my_schema;
UNDROP DATABASE my_db;
UNDROP DYNAMIC TABLE my_dyn_table;
UNDROP ICEBERG TABLE my_iceberg_table;
UNDROP NOTEBOOK my_notebook;
UNDROP EXTERNAL VOLUME my_ext_vol;
UNDROP TAG my_tag;
UNDROP ACCOUNT my_account;`} />
            <p className="text-xs text-rose-700 mt-2">Restores the most recently dropped version within the Time Travel window. Once retention expires, UNDROP is no longer possible.</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <p className="text-xs font-bold text-slate-700 mb-1">Storage impact</p>
            <ul className="text-xs text-slate-600 space-y-1">
              <li>• Historical data for the full retention window is stored and billed</li>
              <li>• Longer retention = higher storage cost</li>
              <li>• Set <span className="font-mono font-bold">DATA_RETENTION_TIME_IN_DAYS = 0</span> to disable (transient tables default to 0)</li>
              <li>• Transient tables avoid Fail-safe storage cost; use for large staging tables</li>
            </ul>
          </div>
        </div>
      </InfoCard>

      {/* Fail-safe */}
      <InfoCard>
        <h3 className="font-bold text-slate-700 mb-2">Fail-safe</h3>
        <p className="text-xs text-slate-500 mb-3">
          Fail-safe is a non-configurable, 7-day safety net that begins <em>after</em> the Time Travel window expires — exclusively for permanent tables and only accessible by Snowflake Support.
        </p>

        <div className="grid sm:grid-cols-3 gap-3 mb-3">
          {[
            { label: 'Duration', val: '7 days (fixed, non-configurable)', color: 'rose' },
            { label: 'Access', val: 'Snowflake Support only — not directly user-accessible', color: 'amber' },
            { label: 'Applies to', val: 'Permanent tables only. Transient & Temporary = NO Fail-safe.', color: 'slate' },
          ].map(c => (
            <div key={c.label} className={`bg-${c.color}-50 rounded-xl p-3 border border-${c.color}-200`}>
              <p className={`text-xs font-bold text-${c.color}-700 mb-1`}>{c.label}</p>
              <p className={`text-xs text-${c.color}-800`}>{c.val}</p>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Table Type</th>
                <th className="text-center p-2 font-bold text-slate-600 border border-slate-200">Time Travel</th>
                <th className="text-center p-2 font-bold text-slate-600 border border-slate-200">Fail-safe</th>
                <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Storage billed</th>
              </tr>
            </thead>
            <tbody>
              {[
                { type: 'Permanent', tt: '0–90 days (Enterprise+) / 0–1 day (Standard)', fs: '7 days', cost: 'Active + Time Travel + Fail-safe' },
                { type: 'Transient', tt: '0–1 day',  fs: 'None', cost: 'Active + Time Travel only' },
                { type: 'Temporary', tt: '0–1 day',  fs: 'None', cost: 'Active + Time Travel only (session-scoped)' },
              ].map(r => (
                <tr key={r.type} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-2 border border-slate-200 font-bold text-rose-700">{r.type}</td>
                  <td className="p-2 border border-slate-200 text-center text-slate-600">{r.tt}</td>
                  <td className="p-2 border border-slate-200 text-center text-slate-600">{r.fs}</td>
                  <td className="p-2 border border-slate-200 text-slate-500">{r.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 space-y-2">
          <p className="text-xs text-amber-700 bg-amber-50 rounded-lg p-2 border border-amber-200">
            ⚠️ <strong>Best-effort only</strong>: Fail-safe recovery is <em>not guaranteed</em>. It may take several hours to several days. Snowflake Support initiates recovery on a best-effort basis.
          </p>
          <p className="text-xs text-slate-600 bg-slate-50 rounded-lg p-2 border border-slate-200">
            🚫 <strong>Limitation</strong>: Fail-safe does <strong>not</strong> support tables that contain data ingested via <strong>Snowpipe Streaming Classic</strong>.
          </p>
        </div>
      </InfoCard>

      {/* Zero-copy Cloning */}
      <InfoCard>
        <h3 className="font-bold text-slate-700 mb-2">Zero-copy Cloning</h3>
        <p className="text-xs text-slate-500 mb-3">
          Cloning creates an independent copy using only metadata — no physical data is duplicated. Both source and clone share micro-partitions until one is modified (copy-on-write).
        </p>

        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          <div className="bg-rose-50 rounded-xl p-3 border border-rose-200">
            <p className="text-xs font-bold text-rose-800 mb-1">Clone syntax examples</p>
            <CodeBlock code={`-- Basic clone (live state)
CREATE TABLE orders_backup CLONE orders;

-- Clone and copy the source's grants to the new object
CREATE TABLE orders_backup CLONE orders COPY GRANTS;

-- Clone at a historical timestamp
CREATE TABLE orders_snapshot CLONE orders
  AT(TIMESTAMP => '2024-06-01'::TIMESTAMP_LTZ);

-- Undo bad DML: clone to the state before a statement
CREATE TABLE orders_recovery CLONE orders
  BEFORE(STATEMENT => '01abc123-...');

-- Clone an entire database
CREATE DATABASE prod_clone CLONE production_db;`} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-700 mb-2">Clone key rules</p>
            <ul className="text-xs text-slate-600 space-y-1.5">
              <li>🔹 <strong>Metadata-only</strong> at creation — instant and zero storage cost initially</li>
              <li>🔹 <strong>Copy-on-write</strong>: new micro-partitions created only for changed data</li>
              <li>🔹 Object-level <strong>grants NOT inherited</strong> by clone (parent DB/schema grants are); use <span className="font-mono font-bold">COPY GRANTS</span> to explicitly copy source grants to the clone</li>
              <li>🔹 <strong>Temp tables</strong> can only clone to temp; transient can clone to transient or temp</li>
              <li>🔹 Cloned <strong>tasks</strong> start SUSPENDED; <strong>pipes</strong> start PAUSED (AUTO_INGEST=FALSE) or STOPPED_CLONED (AUTO_INGEST=TRUE)</li>
              <li>🔹 Can clone at a <strong>historical Time Travel point</strong></li>
            </ul>
          </div>
        </div>

        <h4 className="text-xs font-bold text-slate-600 mb-2">Objects that support cloning</h4>
        <div className="grid sm:grid-cols-2 gap-1.5">
          {CLONE_CAN.map((c, i) => (
            <button
              key={i}
              className="flex items-start gap-2 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100 text-left hover:bg-rose-50 hover:border-rose-200 transition-colors"
              onClick={() => setOpenClone(openClone === i ? null : i)}
            >
              <span className="text-rose-500 font-bold text-xs mt-0.5">✓</span>
              <div>
                <span className="text-xs font-bold text-slate-700">{c.obj}</span>
                {openClone === i && (
                  <p className="text-xs text-slate-500 mt-0.5">{c.note}</p>
                )}
              </div>
              <ChevronRight className={`w-3 h-3 text-slate-300 ml-auto mt-0.5 transition-transform flex-shrink-0 ${openClone === i ? 'rotate-90' : ''}`} />
            </button>
          ))}
        </div>
      </InfoCard>

      {/* Replication & Failover */}
      <InfoCard>
        <h3 className="font-bold text-slate-700 mb-2">Data Replication & Failover</h3>
        <p className="text-xs text-slate-500 mb-3">
          Snowflake replicates databases and account objects across regions and cloud providers to support Business Continuity and Disaster Recovery (BCDR).
        </p>

        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <p className="text-xs font-bold text-slate-700 mb-1">Replication Groups</p>
            <ul className="text-xs text-slate-600 space-y-1">
              <li>• Replicate databases and account objects (roles, users, warehouses, integrations) to other regions</li>
              <li>• Secondary accounts are <strong>read-only</strong></li>
              <li>• Refresh on demand or on an automatic schedule</li>
              <li>• Cross-region and cross-cloud (AWS ↔ Azure ↔ GCP) supported</li>
            </ul>
          </div>
          <div className="bg-rose-50 rounded-xl p-3 border border-rose-200">
            <p className="text-xs font-bold text-rose-700 mb-1">Failover Groups (extends Replication)</p>
            <ul className="text-xs text-rose-800 space-y-1">
              <li>• All replication features <strong>plus</strong> failover capability</li>
              <li>• Supports <strong>client redirect</strong>: clients automatically connect to the new primary after failover</li>
              <li>• Failover promotes a secondary to primary (old primary becomes secondary)</li>
              <li>• Only <strong>one primary</strong> at a time per failover group</li>
            </ul>
          </div>
        </div>

        <div className="overflow-x-auto mb-4">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Feature</th>
                <th className="text-center p-2 font-bold text-slate-600 border border-slate-200">Required Edition</th>
                <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Notes</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Database Replication', 'All editions', 'Replicate individual databases across regions'],
                ['Share Replication', 'All editions', 'Replicate data shares alongside databases'],
                ['Replication Groups', 'All editions', 'Group databases + account objects for coordinated replication'],
                ['Failover Groups', 'Business Critical+', 'Adds client redirect + promotion; requires BC edition'],
              ].map(([feat, ed, note]) => (
                <tr key={feat} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-2 border border-slate-200 font-medium text-slate-700">{feat}</td>
                  <td className={`p-2 border border-slate-200 text-center font-bold ${ed === 'All editions' ? 'text-emerald-600' : 'text-amber-600'}`}>{ed}</td>
                  <td className="p-2 border border-slate-200 text-slate-500">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <CodeBlock code={`-- On the primary account: create a failover group
CREATE FAILOVER GROUP my_fg
  OBJECT_TYPES = DATABASES, ROLES, WAREHOUSES
  ALLOWED_DATABASES = my_db
  ALLOWED_ACCOUNTS = myorg.secondary_account
  REPLICATION_SCHEDULE = '10 MINUTES';  -- optional auto-refresh

-- On the secondary account: create replica
CREATE FAILOVER GROUP my_fg
  AS REPLICA OF myorg.primary_account.my_fg;

-- Manually refresh the secondary
ALTER FAILOVER GROUP my_fg REFRESH;

-- Failover: run on secondary to promote it to primary
ALTER FAILOVER GROUP my_fg PRIMARY;

-- After failover: scheduled refreshes on all secondary groups are suspended.
-- Each target account must resume them explicitly:
ALTER FAILOVER GROUP my_fg RESUME;

-- Check whether current account is primary
SELECT SYSTEM$IS_CURRENT_ACCOUNT_PRIMARY();`} />

        <div className="mt-3 grid sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
            <p className="font-bold text-amber-800 mb-1">RPO vs RTO</p>
            <p className="text-amber-700"><strong>RPO</strong> (Recovery Point Objective): max acceptable data loss — controlled by replication frequency.</p>
            <p className="text-amber-700 mt-1"><strong>RTO</strong> (Recovery Time Objective): max acceptable downtime — client redirect minimizes RTO by routing transparently to the new primary.</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <p className="font-bold text-slate-700 mb-1">Cross-region & cross-cloud</p>
            <p className="text-slate-600">Replication supports any combination of AWS, Azure, and GCP regions — including across cloud providers. Replication credits are billed to the <strong>source account</strong>.</p>
          </div>
        </div>
      </InfoCard>

      <ExamTip>
        <p>• <strong>Standard</strong> max Time Travel = 1 day. <strong>Enterprise+</strong> = up to 90 days per object.</p>
        <p>• <strong>Fail-safe</strong>: 7 days, non-configurable, Snowflake Support only — <strong>permanent tables only</strong>. Transient and Temporary tables have NO Fail-safe. Recovery is <strong>best-effort, not guaranteed</strong> (hours to days). Does <strong>not</strong> support tables with Snowpipe Streaming Classic data.</p>
        <p>• <strong>Zero-copy clone</strong> is a metadata operation — instant, no data copied. Copy-on-write happens only when data actually changes.</p>
        <p>• Cloned objects do <strong>NOT inherit grants</strong> (parent DB/schema grants are inherited but not object-level grants). Use <span className="font-mono">COPY GRANTS</span> in the clone statement to explicitly carry over source grants.</p>
        <p>• Cloned <strong>tasks start SUSPENDED</strong>; cloned <strong>pipes: AUTO_INGEST=FALSE → PAUSED; AUTO_INGEST=TRUE → STOPPED_CLONED</strong> (won't accumulate event notifications until resumed).</p>
        <p>• <strong>Failover group</strong> = replication group + client redirect + promotion. One primary at a time; run <span className="font-mono">ALTER FAILOVER GROUP … PRIMARY</span> on the <strong>secondary</strong> to promote it. Afterward, each secondary's scheduled refreshes are suspended — run <span className="font-mono">ALTER FAILOVER GROUP … RESUME</span> to re-enable them.</p>
        <p>• <strong>Edition requirements</strong>: Database / Share replication and Replication Groups are available on <strong>all editions</strong>. Failover Groups (with client redirect) require <strong>Business Critical edition or higher</strong>.</p>
        <p>• <span className="font-mono">SYSTEM$IS_CURRENT_ACCOUNT_PRIMARY()</span> — used in BCDR health checks and failover automation.</p>
      </ExamTip>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// LEARNING TAB 2 — 5.2 Snowflake's Data Sharing Capabilities
// Covers: Provider/Consumer/Reader accounts · Secure Data Sharing · Resharing ·
//         Direct shares · Data Clean Rooms
// ═══════════════════════════════════════════════════════════════════════════════

const SHAREABLE_OBJECTS = [
  { obj: 'Tables',                        ok: true  },
  { obj: 'External tables',               ok: true  },
  { obj: 'Dynamic tables',                ok: true  },
  { obj: 'Iceberg tables',                ok: true  },
  { obj: 'Externally managed Delta Lake tables', ok: true },
  { obj: 'Secure views',                  ok: true  },
  { obj: 'Secure materialized views',     ok: true  },
  { obj: 'Secure UDFs',                   ok: true  },
  { obj: 'Regular (non-secure) views',    ok: true,  caveat: 'Requires OVERRIDE SHARE RESTRICTIONS = TRUE; not recommended — hides nothing from consumer' },
  { obj: 'Regular (non-secure) UDFs',     ok: true,  caveat: 'Shareable but secure UDFs are always preferred to protect logic' },
  { obj: 'Semantic views',                ok: true  },
  { obj: 'Cortex Search services',        ok: true  },
  { obj: 'Models (USER_MODEL, CORTEX_FINETUNED, DOC_AI)', ok: true },
  { obj: 'Stored procedures',             ok: false },
  { obj: 'Temporary tables',              ok: false },
];

const SharingTab = () => {
  const [open, setOpen] = useState(null);

  const sections = [
    {
      id: 'accounts',
      icon: '👥',
      title: 'Provider, Consumer & Reader Accounts',
      subtitle: 'Three roles in every Snowflake sharing relationship',
      content: (
        <div className="space-y-3">
          <div className="grid sm:grid-cols-3 gap-3 text-xs">
            {[
              {
                role: 'Provider',
                color: 'rose',
                emoji: '📤',
                desc: 'The account that owns the data and creates shares. Sets what is shared and with whom. Data never leaves the provider\'s account.',
                bullets: [
                  'Creates SHARE objects',
                  'Grants access to database objects within the share',
                  'Adds consumer accounts (ALTER SHARE ADD ACCOUNTS)',
                  'Can enable resharing by specific consumers',
                  'Can create Reader accounts for non-Snowflake customers',
                ],
              },
              {
                role: 'Consumer',
                color: 'blue',
                emoji: '📥',
                desc: 'A Snowflake account that receives shared data. Can query the data — cannot perform DML on it.',
                bullets: [
                  'Creates a database FROM SHARE',
                  'Can query shared objects (SELECT only)',
                  'Cannot INSERT, UPDATE, or DELETE shared data',
                  'Pays own compute credits to query shared data',
                  'Can reshare only if provider explicitly enables it',
                ],
              },
              {
                role: 'Reader Account',
                color: 'violet',
                emoji: '👁️',
                desc: 'A Snowflake-managed account created by a provider for customers who have no Snowflake account of their own.',
                bullets: [
                  'Created via CREATE MANAGED ACCOUNT',
                  'Can only query shared data — no other Snowflake features',
                  'Compute credits billed to the PROVIDER',
                  'Ideal for distributing data to external third parties',
                  'Provider manages users and access within the reader account',
                ],
              },
            ].map(r => (
              <div key={r.role} className={`bg-${r.color}-50 rounded-xl p-3 border border-${r.color}-200`}>
                <p className={`text-sm font-bold text-${r.color}-700 mb-1`}>{r.emoji} {r.role}</p>
                <p className={`text-${r.color}-800 mb-2`}>{r.desc}</p>
                <ul className={`space-y-0.5 text-${r.color}-700`}>
                  {r.bullets.map((b, i) => <li key={i}>• {b}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-xs text-amber-700 bg-amber-50 rounded-lg p-2 border border-amber-200">
            ⚠️ Reader account compute is billed to the <strong>provider</strong>. Standard consumer account compute is billed to the <strong>consumer</strong>.
          </p>
        </div>
      ),
    },
    {
      id: 'sharing',
      icon: '🔗',
      title: 'Secure Data Sharing',
      subtitle: 'Live data access with zero data movement — direct micro-partition pointers',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            Snowflake sharing gives consumers <strong>direct read access to the provider's micro-partitions</strong>. No data is copied or transferred — consumers always see the provider's current data.
          </p>

          <div className="grid sm:grid-cols-2 gap-3 text-xs mb-2">
            <div className="bg-rose-50 rounded-xl p-3 border border-rose-200">
              <p className="font-bold text-rose-700 mb-1">Provider: create and populate a share</p>
              <CodeBlock code={`-- 1. Create the share object
CREATE SHARE my_share;

-- 2. Grant access to the database
GRANT USAGE ON DATABASE sales_db TO SHARE my_share;

-- 3. Grant access to the schema
GRANT USAGE ON SCHEMA sales_db.public TO SHARE my_share;

-- 4. Grant access to specific objects
GRANT SELECT ON TABLE sales_db.public.orders
  TO SHARE my_share;

-- 5. Add a consumer account
ALTER SHARE my_share
  ADD ACCOUNTS = myorg.consumer_account;`} />
            </div>
            <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
              <p className="font-bold text-blue-700 mb-1">Consumer: mount the share</p>
              <CodeBlock code={`-- Create a local database from the inbound share
CREATE DATABASE shared_sales
  FROM SHARE provider_org.provider_acct.my_share;

-- Query shared data directly (SELECT only)
SELECT * FROM shared_sales.public.orders
WHERE order_date >= CURRENT_DATE - 7;

-- List all available inbound shares
SHOW SHARES;`} />
            </div>
          </div>

          <h4 className="text-xs font-bold text-slate-600 mb-2">Shareable vs. Non-shareable Objects</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SHAREABLE_OBJECTS.map(o => (
              <div key={o.obj} className={`flex items-start gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${
                o.ok
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-red-50 border-red-200 text-red-600'
              }`}>
                <span className="font-bold mt-0.5">{o.ok ? '✓' : '✗'}</span>
                <span>{o.obj}{o.caveat && <span className="block font-normal text-amber-600 text-[10px] leading-tight mt-0.5">{o.caveat}</span>}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-amber-700 bg-amber-50 rounded-lg p-2 border border-amber-200 mt-1">
            ⚠️ <strong>Secure views / UDFs are always recommended</strong> for sharing — they hide the definition SQL from consumers. Regular views and UDFs are technically shareable but expose internal logic. Regular views additionally require <span className="font-mono">OVERRIDE SHARE RESTRICTIONS = TRUE</span>.
          </p>
        </div>
      ),
    },
    {
      id: 'resharing',
      icon: '🔄',
      title: 'Sharing, Resharing & Direct Shares',
      subtitle: 'How shares flow between accounts',
      content: (
        <div className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <p className="font-bold text-slate-700 mb-1">Direct Shares</p>
              <p className="text-slate-600 mb-2">The provider adds specific consumer account identifiers directly to the share. Access is immediate once the consumer creates a database from the share.</p>
              <CodeBlock code={`ALTER SHARE my_share
  ADD ACCOUNTS = myorg.partner_account_1,
                 myorg.partner_account_2;`} />
            </div>
            <div className="bg-rose-50 rounded-xl p-3 border border-rose-200">
              <p className="font-bold text-rose-700 mb-1">Resharing (Provider must explicitly allow)</p>
              <p className="text-rose-800 mb-2">Consumers can reshare data only if the <strong>provider explicitly grants SHARE privilege</strong> to the consumer account. By default, consumers <strong>cannot reshare</strong>.</p>
              <CodeBlock code={`-- Provider grants resharing rights to a reseller
GRANT SHARE my_share
  TO ACCOUNT myorg.reseller_account;

-- Reseller creates their own share from the same data
-- and adds their end-consumers`} />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'cleanrooms',
      icon: '🔐',
      title: 'Data Clean Rooms',
      subtitle: 'Privacy-preserving collaboration — no raw data exposed between parties',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            A data clean room enables two parties to run analyses on overlapping datasets <strong>without either party seeing the other's raw records</strong>. Built on the Native Apps Framework.
          </p>

          <div className="grid sm:grid-cols-2 gap-3 text-xs mb-2">
            <div className="bg-rose-50 rounded-xl p-3 border border-rose-200">
              <p className="font-bold text-rose-700 mb-1">How it works</p>
              <ul className="space-y-1 text-rose-800">
                <li>• Provider installs a clean room Native App into the consumer's account</li>
                <li>• Both parties contribute their data within the app</li>
                <li>• Queries run inside the clean room — only aggregate/overlap results are returned</li>
                <li>• Neither party can see the other's individual records</li>
              </ul>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <p className="font-bold text-slate-700 mb-1">Common use cases</p>
              <ul className="space-y-1 text-slate-600">
                <li>📺 <strong>Advertising:</strong> audience overlap analysis between brands</li>
                <li>🏥 <strong>Healthcare:</strong> cross-org patient outcome research</li>
                <li>💳 <strong>Financial services:</strong> fraud pattern matching</li>
                <li>🛒 <strong>Retail:</strong> loyalty program cross-brand analytics</li>
              </ul>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
            <p className="font-bold text-amber-800 mb-1">Built on Native Apps Framework</p>
            <p className="text-amber-700">
              Snowflake's clean room product uses the Native Apps Framework — the app logic runs inside the consumer's account governed by the provider's rules. This architecture prevents raw data exposure while enabling collaborative analysis.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <InfoCard>
        <SectionHeader
          icon={Share2}
          color="bg-rose-700"
          title="5.2 Snowflake's Data Sharing Capabilities"
          subtitle="Provider · Consumer · Reader accounts · Secure Data Sharing · Resharing · Clean Rooms"
        />
        <div className="space-y-2">
          {sections.map((s, i) => (
            <div key={s.id} className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-4 py-3 text-left bg-slate-50 hover:bg-slate-100 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{s.icon}</span>
                  <div>
                    <span className="font-semibold text-slate-700 text-sm">{s.title}</span>
                    <span className="text-xs text-slate-400 ml-2 hidden sm:inline">{s.subtitle}</span>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${open === i ? 'rotate-90' : ''}`} />
              </button>
              {open === i && (
                <div className="px-4 pb-4 pt-2 bg-white">{s.content}</div>
              )}
            </div>
          ))}
        </div>
      </InfoCard>

      <ExamTip>
        <p>• Shared data <strong>never moves</strong> — consumers read directly from the provider's micro-partitions.</p>
        <p>• Consumers can only <strong>SELECT</strong> shared data — no INSERT, UPDATE, or DELETE allowed.</p>
        <p>• <strong>Reader accounts</strong>: created and managed by the provider, compute billed to the <strong>provider</strong>.</p>
        <p>• Only <strong>secure views</strong> (not regular views) can be added to a share. Regular views expose definition SQL.</p>
        <p>• Resharing requires the provider to <strong>explicitly grant permission</strong>. Consumers cannot reshare by default.</p>
        <p>• <strong>Data clean rooms</strong> use the Native Apps Framework — no raw data is ever exposed between collaborating parties.</p>
      </ExamTip>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// LEARNING TAB 3 — 5.3 Snowflake Marketplace & Listings
// Covers: Snowflake Marketplace · Public/Private Listings · Native Apps Framework
// ═══════════════════════════════════════════════════════════════════════════════

const MarketplaceTab = () => {
  const [open, setOpen] = useState(null);

  const sections = [
    {
      id: 'marketplace',
      icon: '🛒',
      title: 'Snowflake Marketplace',
      subtitle: 'Central exchange for live data products and apps',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            The Snowflake Marketplace is a data exchange where providers publish data products and apps. Consumers discover and mount them instantly — <strong>no ETL, no data movement, always current</strong>.
          </p>

          <div className="grid sm:grid-cols-3 gap-3 text-xs">
            {[
              { icon: '⚡', label: 'No data movement', desc: 'Consumers get live access — data is always up to date. No copying or downloading needed.' },
              { icon: '🔒', label: 'Provider retains control', desc: 'Provider can revoke access at any time. Data never leaves the provider\'s account.' },
              { icon: '☁️', label: 'No ingestion pipeline', desc: 'Consumer pays only for their own compute to query data. No ETL infrastructure needed.' },
            ].map(f => (
              <div key={f.label} className="bg-rose-50 rounded-xl p-3 border border-rose-200 text-center">
                <p className="text-2xl mb-1">{f.icon}</p>
                <p className="font-bold text-rose-700 mb-1">{f.label}</p>
                <p className="text-rose-800">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto mt-2">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Aspect</th>
                  <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Traditional data sharing</th>
                  <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Snowflake Marketplace</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Data delivery',  'File downloads, FTP, API exports',     'Live — direct partition access, no copy'],
                  ['Freshness',      'Stale (as of last export)',             'Always current (real-time provider data)'],
                  ['Infrastructure', 'Consumer builds ingest pipeline',       'None — query directly after mounting'],
                  ['Access control', 'Hard to revoke once delivered',         'Provider revokes instantly at any time'],
                  ['Discovery',      'Direct outreach / sales contracts',     'Searchable catalog in Snowsight'],
                ].map(([a, t, s]) => (
                  <tr key={a} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-2 border border-slate-200 font-medium text-slate-600">{a}</td>
                    <td className="p-2 border border-slate-200 text-slate-500">{t}</td>
                    <td className="p-2 border border-slate-200 text-rose-700">{s}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      id: 'listings',
      icon: '📋',
      title: 'Listings — Public vs. Private',
      subtitle: 'How providers publish data products on the Marketplace',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            A <strong>listing</strong> packages a share (or Native App) with a title, description, data dictionary, and sample queries. Listings can be public or private.
          </p>

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
              <p className="font-bold text-emerald-700 text-sm mb-2">🌍 Public Listing</p>
              <ul className="space-y-1.5 text-emerald-800">
                <li>• Discoverable by <strong>any Snowflake account</strong> in the Marketplace catalog</li>
                <li>• No approval required to browse</li>
                <li>• Provider can require an access request before granting</li>
                <li>• Can be <strong>free or paid</strong></li>
                <li>• Best for: open datasets, commercial data products, weather/financial data</li>
              </ul>
            </div>
            <div className="bg-rose-50 rounded-xl p-4 border border-rose-200">
              <p className="font-bold text-rose-700 text-sm mb-2">🔒 Private Listing</p>
              <ul className="space-y-1.5 text-rose-800">
                <li>• Shared with <strong>specific named accounts only</strong></li>
                <li>• Not visible in the public Marketplace catalog</li>
                <li>• Consumer must be directly invited by the provider</li>
                <li>• Can also be <strong>paid</strong></li>
                <li>• Best for: partner sharing, B2B, confidential or sensitive datasets</li>
              </ul>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Feature</th>
                  <th className="text-center p-2 font-bold text-slate-600 border border-slate-200">Public</th>
                  <th className="text-center p-2 font-bold text-slate-600 border border-slate-200">Private</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Discoverable in public Marketplace catalog', '✓', '✗'],
                  ['Restricted to specific invited accounts',    '✗', '✓'],
                  ['Can be paid',                                '✓', '✓'],
                  ['Provider controls final access grant',       '✓', '✓'],
                  ['Data movement required',                     '✗', '✗'],
                ].map(([f, pub, priv]) => (
                  <tr key={f} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-2 border border-slate-200 text-slate-600">{f}</td>
                    <td className="p-2 border border-slate-200 text-center font-bold text-emerald-600">{pub}</td>
                    <td className="p-2 border border-slate-200 text-center font-bold text-rose-600">{priv}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 className="text-xs font-bold text-slate-600 mb-2 mt-3">Listing Access Types</h4>
          <div className="grid sm:grid-cols-3 gap-3 text-xs">
            {[
              {
                type: 'Free',
                color: 'emerald',
                emoji: '🆓',
                desc: 'Consumer gets immediate full access. No payment or trial period required.',
                note: 'Best for open / public-good datasets',
              },
              {
                type: 'Limited Trial',
                color: 'amber',
                emoji: '⏱️',
                desc: 'Trial window of 1–90 days with full or partial data. Consumer must request full access after trial.',
                note: 'Let consumers evaluate before committing',
              },
              {
                type: 'Paid',
                color: 'rose',
                emoji: '💳',
                desc: 'Full access granted after payment. Billing uses Snowflake pricing models (flat-fee, usage-based, etc.).',
                note: 'Commercial monetization of data products',
              },
            ].map(a => (
              <div key={a.type} className={`bg-${a.color}-50 rounded-xl p-3 border border-${a.color}-200`}>
                <p className={`font-bold text-${a.color}-700 mb-1`}>{a.emoji} {a.type}</p>
                <p className={`text-${a.color}-800 mb-1`}>{a.desc}</p>
                <p className={`italic text-${a.color}-600`}>{a.note}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'nativeapps',
      icon: '📦',
      title: 'Native Apps Framework',
      subtitle: "Package and distribute apps that run inside the consumer's Snowflake account",
      content: (
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            The Native Apps Framework lets providers package <strong>application logic + data + Snowflake components</strong> into a versioned app that runs entirely inside the <strong>consumer's own Snowflake account</strong>.
          </p>

          <div className="grid sm:grid-cols-2 gap-3 text-xs mb-2">
            <div className="bg-rose-50 rounded-xl p-3 border border-rose-200">
              <p className="font-bold text-rose-700 mb-1">Key characteristics</p>
              <ul className="space-y-1 text-rose-800">
                <li>• App runs <strong>inside the consumer's account</strong> — not on provider infra</li>
                <li>• Provider <strong>cannot see consumer data</strong> (privacy preserved)</li>
                <li>• Provider's query history is <strong>redacted</strong> from the consumer's account (IP protection)</li>
                <li>• Provider ships: stored procedures, UDFs, Streamlit UIs, reference data</li>
                <li>• Versioned releases — provider can push updates</li>
                <li>• Consumer grants only the privileges the app requests</li>
                <li>• Apps can include <strong>Snowpark Container Services (SPCS)</strong> to run containerized workloads</li>
                <li>• <strong>Generally Available (GA)</strong> on AWS, Azure, and GCP</li>
              </ul>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <p className="font-bold text-slate-700 mb-1">Key objects</p>
              <ul className="space-y-1 text-slate-600">
                <li>• <span className="font-mono font-bold">APPLICATION PACKAGE</span>: provider's container for all app versions and data content</li>
                <li>• <span className="font-mono font-bold">APPLICATION</span>: an installed instance in the consumer's account</li>
                <li>• <span className="font-mono font-bold">SETUP.SQL</span>: runs during consumer installation to create app objects</li>
                <li>• Distributed via a Marketplace <strong>listing</strong></li>
              </ul>
            </div>
          </div>

          <CodeBlock code={`-- Provider: create an application package
CREATE APPLICATION PACKAGE my_app_package;

-- Add a version (points to files in a named stage)
ALTER APPLICATION PACKAGE my_app_package
  ADD VERSION v1 USING '@my_stage/app_v1/';

-- Consumer installs from Marketplace:
CREATE APPLICATION my_analytics_app
  FROM APPLICATION PACKAGE provider_org.my_app_package
  USING VERSION v1;

-- Invoke the app after installation
CALL my_analytics_app.public.run_analysis();`} />

          <h4 className="text-xs font-bold text-slate-600 mb-2">Common Native App use cases</h4>
          <div className="grid sm:grid-cols-3 gap-2 text-xs">
            {[
              { label: 'Data Clean Rooms',    desc: 'Privacy-preserving collaboration built on Native Apps' },
              { label: 'ML Models / Cortex',  desc: 'Pre-trained models packaged as apps for consumer data enrichment' },
              { label: 'BI / Analytics Kits', desc: 'Snowsight dashboards + pipelines packaged as portable apps' },
            ].map(u => (
              <div key={u.label} className="bg-rose-50 rounded-xl p-2.5 border border-rose-200 text-center">
                <p className="font-bold text-rose-700 mb-0.5">{u.label}</p>
                <p className="text-rose-800">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <InfoCard>
        <SectionHeader
          icon={ShoppingBag}
          color="bg-rose-700"
          title="5.3 Marketplace & Listings"
          subtitle="Snowflake Marketplace · Public/Private Listings · Native Apps Framework"
        />
        <div className="space-y-2">
          {sections.map((s, i) => (
            <div key={s.id} className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-4 py-3 text-left bg-slate-50 hover:bg-slate-100 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{s.icon}</span>
                  <div>
                    <span className="font-semibold text-slate-700 text-sm">{s.title}</span>
                    <span className="text-xs text-slate-400 ml-2 hidden sm:inline">{s.subtitle}</span>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${open === i ? 'rotate-90' : ''}`} />
              </button>
              {open === i && (
                <div className="px-4 pb-4 pt-2 bg-white">{s.content}</div>
              )}
            </div>
          ))}
        </div>
      </InfoCard>

      <ExamTip>
        <p>• Marketplace data is always <strong>live and current</strong> — no ETL, no stale snapshots, zero data movement.</p>
        <p>• <strong>Public listing</strong>: discoverable by any Snowflake account in the catalog. <strong>Private listing</strong>: visible only to specifically invited accounts.</p>
        <p>• <strong>Native Apps</strong> run <strong>inside the consumer's account</strong> — the provider cannot access the consumer's data. Provider query history is <strong>redacted</strong> (IP protection). Apps can include <strong>SPCS</strong> for containerized workloads. GA on AWS, Azure, and GCP.</p>
        <p>• Key objects: <strong>APPLICATION PACKAGE</strong> (provider creates + versions) → <strong>APPLICATION</strong> (consumer installs).</p>
        <p>• Data Clean Rooms are built on the Native Apps Framework — no raw data is exposed during collaborative analysis.</p>
      </ExamTip>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// QUIZ — Data & challenge components
// ═══════════════════════════════════════════════════════════════════════════════

const PROTECTION_QUIZ_DATA = [
  {
    q: 'What is the maximum Time Travel retention period available on Snowflake Standard edition?',
    options: ['0 days', '7 days', '1 day', '90 days'],
    answer: '1 day',
    exp: 'Standard edition is capped at 1 day. Enterprise+ can go up to 90 days. Temporary and Transient tables default to 0 days and max out at 1 day regardless of edition.',
  },
  {
    q: 'Which table types have NO Fail-safe protection? (Choose the best answer)',
    options: [
      'Permanent tables only',
      'Temporary and Transient tables',
      'External tables',
      'All tables have Fail-safe by default',
    ],
    answer: 'Temporary and Transient tables',
    exp: 'Fail-safe (the 7-day post-retention safety net) only applies to Permanent tables. Temporary and Transient tables have no Fail-safe — this is by design to reduce storage cost.',
  },
  {
    q: 'A permanent table\'s Time Travel window has expired. The data is still needed. Who can retrieve it, and from where?',
    options: [
      'The table owner, using UNDROP TABLE',
      'Only Snowflake Support, from the Fail-safe store',
      'Any user with ACCOUNTADMIN, using AT(OFFSET => -1)',
      'No one — data is permanently gone after Time Travel expires',
    ],
    answer: 'Only Snowflake Support, from the Fail-safe store',
    exp: 'Fail-safe is a 7-day window after Time Travel expires. Data in Fail-safe is NOT user-accessible — only Snowflake Support can initiate a recovery. Importantly, recovery is best-effort and not guaranteed; it may take several hours to several days. Fail-safe also does not support tables with data ingested via Snowpipe Streaming Classic.',
  },
  {
    q: 'You need to instantly create a copy of a 5 TB production table for testing without duplicating storage. Which feature should you use?',
    options: [
      'CREATE TABLE … AS SELECT * FROM production',
      'Zero-copy clone (CREATE TABLE test CLONE production)',
      'COPY INTO to an internal stage',
      'Data Replication Group',
    ],
    answer: 'Zero-copy clone (CREATE TABLE test CLONE production)',
    exp: 'Zero-copy cloning is a metadata-only operation — no data is physically copied. Source and clone share micro-partitions until data diverges. Instant, and zero additional storage cost at creation time.',
  },
  {
    q: 'A developer accidentally ran DELETE FROM orders WHERE TRUE. Which Time Travel syntax is best for recovering the data by cloning to the state just before that statement?',
    options: [
      'AT(OFFSET => -60)',
      'BEFORE(STATEMENT => \'<query_id>\')',
      'AT(TIMESTAMP => SYSDATE() - 1)',
      'UNDROP TABLE orders',
    ],
    answer: 'BEFORE(STATEMENT => \'<query_id>\')',
    exp: 'BEFORE(STATEMENT => \'<query_id>\') targets the exact moment before a specific statement ran — perfect for undoing accidental DML. UNDROP only applies to dropped objects, not truncated/deleted data.',
  },
  {
    q: 'You clone a table that has role-level SELECT grants applied. Does the clone inherit those grants?',
    options: [
      'Yes — all grants are fully inherited by the clone',
      'No — cloned objects do not inherit object-level grants from the source',
      'Yes — only if the clone is in the same schema',
      'Only ACCOUNTADMIN grants are inherited',
    ],
    answer: 'No — cloned objects do not inherit object-level grants from the source',
    exp: 'Object-level grants are NOT inherited by a clone. If you clone a database, child schemas/tables do inherit the parent\'s grants, but the object-level grants on the source are not carried over to the clone.',
  },
  {
    q: 'What happens to a Task object when it is cloned?',
    options: [
      'It is cloned and immediately starts running on its schedule',
      'It is cloned in SUSPENDED state',
      'Cloning tasks is not supported',
      'It is cloned and then automatically resumed after 60 seconds',
    ],
    answer: 'It is cloned in SUSPENDED state',
    exp: 'Cloned Tasks are always created in SUSPENDED state to prevent unintended execution. You must explicitly run ALTER TASK <clone_name> RESUME to activate it.',
  },
  {
    q: 'A Failover Group is configured between a primary account in US-East and a secondary in EU-West. Which account runs the FAILOVER command to promote the secondary?',
    options: [
      'The primary account runs ALTER FAILOVER GROUP … FAILOVER',
      'The secondary account runs ALTER FAILOVER GROUP … FAILOVER',
      'Either account can run the FAILOVER command',
      'FAILOVER must be initiated from Snowflake Support portal',
    ],
    answer: 'The secondary account runs ALTER FAILOVER GROUP … FAILOVER',
    exp: 'The failover command is executed on the secondary account to promote it to primary. The correct syntax is ALTER FAILOVER GROUP <name> PRIMARY (not FAILOVER). The original primary is automatically demoted to a secondary once failover completes. After failover, scheduled refreshes on all secondary groups are suspended — run ALTER FAILOVER GROUP … RESUME to re-enable them.',
  },
];

const SHARING_QUIZ_DATA = [
  {
    q: 'A provider creates a Reader Account for a partner who does not have Snowflake. The partner runs expensive queries. Who is billed for the compute?',
    options: [
      'The partner (reader account)',
      'Snowflake directly',
      'The provider account',
      'Compute is free for reader accounts',
    ],
    answer: 'The provider account',
    exp: 'Reader accounts are Snowflake-managed accounts created by the provider. The provider is billed for all compute resources consumed by reader account users.',
  },
  {
    q: 'A consumer creates a database FROM SHARE and needs to update some rows in the shared table. What happens?',
    options: [
      'The consumer can UPDATE rows and changes are visible to the provider',
      'The consumer receives an error — shared data is SELECT-only',
      'The consumer can UPDATE but changes are local to their database copy',
      'The consumer must request WRITE access via the Marketplace',
    ],
    answer: 'The consumer receives an error — shared data is SELECT-only',
    exp: 'Consumers can only SELECT from shared objects. INSERT, UPDATE, DELETE, and DDL are not allowed on shared data. The data is read-only on the consumer side.',
  },
  {
    q: 'A provider wants to share business logic that queries two sensitive tables. Which object type can they safely add to the share?',
    options: [
      'A regular view that joins the two tables',
      'A stored procedure',
      'A secure view that joins the two tables',
      'A copy of the tables in a staging schema',
    ],
    answer: 'A secure view that joins the two tables',
    exp: 'Secure views are the recommended object to share sensitive business logic. Regular (non-secure) views are technically shareable but require OVERRIDE SHARE RESTRICTIONS = TRUE and expose the view definition SQL to the consumer, potentially leaking column names and logic. For exam purposes, "secure view" is always the correct answer when protecting view logic. Stored procedures cannot be shared.',
  },
  {
    q: 'How does a consumer account access data that has been shared with them by a provider?',
    options: [
      'The provider sends a CSV export; the consumer imports it',
      'The consumer runs CREATE DATABASE … FROM SHARE to mount the share as a local database',
      'The consumer uses a cross-account query with the provider\'s account URL',
      'The consumer installs a Snowflake connector that copies the data hourly',
    ],
    answer: 'The consumer runs CREATE DATABASE … FROM SHARE to mount the share as a local database',
    exp: 'Consumers mount a share by running CREATE DATABASE <name> FROM SHARE <provider>.<share_name>. This creates a local database with read-only access pointing to the provider\'s data — no data is copied.',
  },
  {
    q: 'A consumer wants to reshare data they received from a provider with another downstream account. Under what condition can they do this?',
    options: [
      'Never — consumers can never reshare shared data',
      'Only if the provider has explicitly granted the consumer permission to reshare',
      'Always — any consumer can reshare any data they receive',
      'Only if the data is first copied into the consumer\'s own tables',
    ],
    answer: 'Only if the provider has explicitly granted the consumer permission to reshare',
    exp: 'By default, consumers cannot reshare. The provider must explicitly GRANT the consumer the ability to share the data. This ensures the original provider maintains control over data distribution.',
  },
  {
    q: 'Which architectural framework do Snowflake Data Clean Rooms use?',
    options: [
      'Snowpipe Streaming channels',
      'Native Apps Framework',
      'Replication Groups',
      'External Functions via API integration',
    ],
    answer: 'Native Apps Framework',
    exp: 'Data Clean Rooms are built on Snowflake\'s Native Apps Framework. The app runs inside the consumer\'s account, ensuring neither party exposes raw data — only query results (aggregates) are returned.',
  },
  {
    q: 'A provider adds a regular (non-secure) table to a share. A consumer then creates a secure view on the shared table in their own account. Is this possible?',
    options: [
      'No — consumers cannot create views on shared objects',
      'Yes — consumers can create views on top of shared tables in their own account',
      'Yes, but only if the provider also shares the source schema',
      'No — shared objects must be queried directly; no derived objects allowed',
    ],
    answer: 'Yes — consumers can create views on top of shared tables in their own account',
    exp: 'Consumers can query shared tables and build their own views, materialized views, and other objects on top of shared data in their own account. This enables consumers to further transform or restrict the shared data for their own use cases.',
  },
  {
    q: 'In Snowflake\'s data sharing model, where does the shared data physically reside?',
    options: [
      'In a shared cloud bucket managed by Snowflake between both accounts',
      'In the consumer\'s account — data is copied on first access',
      'In the provider\'s account — consumers access it via direct micro-partition pointers',
      'In both accounts simultaneously, kept in sync by replication',
    ],
    answer: 'In the provider\'s account — consumers access it via direct micro-partition pointers',
    exp: 'Data never moves. Snowflake shares data by giving consumers direct read access to the provider\'s micro-partitions. There is no copying, syncing, or movement — consumers always read live data from the provider\'s account.',
  },
];

const MARKETPLACE_QUIZ_DATA = [
  {
    q: 'A company wants to publish a proprietary dataset on the Snowflake Marketplace so that any Snowflake customer can discover and access it. Which listing type should they use?',
    options: ['Private listing', 'Public listing', 'Direct share', 'Secure view'],
    answer: 'Public listing',
    exp: 'A Public listing is discoverable by any Snowflake account in the Marketplace catalog. Private listings are only visible to specifically invited accounts. Direct shares bypass listings entirely.',
  },
  {
    q: 'A provider wants to share a data product only with two specific partner companies who both have Snowflake accounts. Which approach is most appropriate?',
    options: [
      'Publish a public Marketplace listing and let them request access',
      'Use a private listing targeted at those two specific accounts',
      'Create a Reader account for each partner',
      'Export CSV files to each partner via S3',
    ],
    answer: 'Use a private listing targeted at those two specific accounts',
    exp: 'Private listings are only visible to the specific accounts the provider invites. They do not appear in the public Marketplace. This is ideal for B2B or partner-specific data sharing.',
  },
  {
    q: 'A consumer mounts a Marketplace dataset in their account. The provider updates the underlying table with new data. When does the consumer see the update?',
    options: [
      'The next time the consumer runs ALTER DATABASE … REFRESH',
      'After the Marketplace re-runs the daily sync job',
      'Immediately — Marketplace data is always live with no movement',
      'After 24 hours — Marketplace uses a daily replication schedule',
    ],
    answer: 'Immediately — Marketplace data is always live with no movement',
    exp: 'Marketplace data is live. Consumers access the provider\'s micro-partitions directly — there is no copy or ETL pipeline. Any update made by the provider is immediately visible to consumers.',
  },
  {
    q: 'A provider builds a Native App that enriches consumer data using ML models. In whose Snowflake account does the app run?',
    options: [
      'The provider\'s account — the consumer sends data for processing',
      'The consumer\'s own Snowflake account',
      'A shared neutral Snowflake account managed by Snowflake',
      'The Snowflake Marketplace account',
    ],
    answer: 'The consumer\'s own Snowflake account',
    exp: 'Native Apps run inside the consumer\'s account. The app logic and reference data are installed there. This ensures the provider cannot access the consumer\'s data — privacy is preserved by architecture.',
  },
  {
    q: 'What is the difference between APPLICATION PACKAGE and APPLICATION in the Native Apps Framework?',
    options: [
      'APPLICATION PACKAGE is the consumer\'s installed copy; APPLICATION is the provider\'s template',
      'APPLICATION PACKAGE is the provider\'s versioned container; APPLICATION is the consumer\'s installed instance',
      'They are the same object — just different names in different editions',
      'APPLICATION PACKAGE is only used for Marketplace listings; APPLICATION is for direct shares',
    ],
    answer: 'APPLICATION PACKAGE is the provider\'s versioned container; APPLICATION is the consumer\'s installed instance',
    exp: 'The APPLICATION PACKAGE is created and managed by the provider. It holds all versions of the app and its data content. When a consumer installs the app, Snowflake creates an APPLICATION object in the consumer\'s account.',
  },
  {
    q: 'A company wants to allow two competing advertisers to measure audience overlap without either seeing the other\'s customer list. Which Snowflake feature enables this?',
    options: [
      'Secure Data Sharing with row-level security policies',
      'Data Clean Room (built on Native Apps Framework)',
      'Failover Group with two replicas',
      'Private listing with restricted columns',
    ],
    answer: 'Data Clean Room (built on Native Apps Framework)',
    exp: 'Data Clean Rooms are purpose-built for privacy-preserving collaboration. Neither party sees the other\'s raw records — only aggregate query results are returned. Clean rooms are built on the Native Apps Framework.',
  },
  {
    q: 'A consumer discovers and mounts a public Marketplace dataset. Where are the query compute costs billed?',
    options: [
      'To the data provider who published the listing',
      'To Snowflake — Marketplace queries are free',
      'To the consumer\'s own Snowflake account',
      'Shared 50/50 between provider and consumer',
    ],
    answer: 'To the consumer\'s own Snowflake account',
    exp: 'For standard Marketplace listings (not Reader Accounts), the consumer pays for the compute used to query the shared data. The provider pays nothing for consumer queries — they only pay for their own storage and compute.',
  },
  {
    q: 'Which Snowflake feature would you use to distribute a pre-trained ML scoring function so customers can run it against their own data without seeing its implementation?',
    options: [
      'Secure UDF added to a direct share',
      'Native App containing the model as a stored procedure',
      'Public Marketplace listing with a regular UDF',
      'External Function calling a provider-hosted API',
    ],
    answer: 'Native App containing the model as a stored procedure',
    exp: 'A Native App packages stored procedures, UDFs, and model logic inside the consumer\'s account. The provider controls the logic but cannot access the consumer\'s data. This is the recommended pattern for distributing ML models and enrichment logic on Snowflake.',
  },
];


// ── Shuffle helper ────────────────────────────────────────────────────────────
const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

// ── Reusable scenario picker ──────────────────────────────────────────────────
const ScenarioPicker = ({ data, themeColor = 'violet' }) => {
  // Build a fresh shuffled deck (questions + options) each attempt
  const buildDeck = useCallback(
    () => shuffle(data).map(q => ({ ...q, options: shuffle(q.options) })),
    [data],
  );

  const [deck,    setDeck]    = useState(() => buildDeck());
  const [current, setCurrent] = useState(0);
  const [picked,  setPicked]  = useState(null);
  const [score,   setScore]   = useState(0);
  const [streak,  setStreak]  = useState(0);
  const [best,    setBest]    = useState(0);
  const [history, setHistory] = useState([]);
  const [done,    setDone]    = useState(false);

  const q = deck[current];
  const isCorrect = picked === q?.answer;
  const total = deck.length;
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;

  const handlePick = useCallback((opt) => {
    if (picked) return;
    const correct = opt === q.answer;
    setPicked(opt);
    if (correct) {
      setScore(s => s + 1);
      setStreak(s => {
        const next = s + 1;
        setBest(b => Math.max(b, next));
        return next;
      });
    } else {
      setStreak(0);
    }
    setHistory(h => [...h, { ...q, picked: opt, correct }]);
  }, [picked, q]);

  const next = useCallback(() => {
    if (current + 1 >= total) setDone(true);
    else { setCurrent(c => c + 1); setPicked(null); }
  }, [current, total]);

  const reset = (newShuffle = true) => {
    if (newShuffle) setDeck(buildDeck());
    setCurrent(0); setPicked(null); setScore(0);
    setStreak(0);  setHistory([]); setDone(false);
  };

  // Keyboard shortcuts: 1-4 = pick option, Enter/Space = next
  useEffect(() => {
    if (done) return;
    const handler = (e) => {
      if (!picked) {
        const idx = parseInt(e.key, 10) - 1;
        if (idx >= 0 && idx < q.options.length) handlePick(q.options[idx]);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [picked, done, q, handlePick, next]);

  // Grade helper
  const grade = useMemo(() => {
    const r = pct;
    if (r >= 90) return { label: 'A', msg: 'Exam-ready!',       color: 'emerald', emoji: '🎉' };
    if (r >= 75) return { label: 'B', msg: 'Almost there!',     color: 'blue',    emoji: '👍' };
    if (r >= 60) return { label: 'C', msg: 'Keep practicing.',  color: 'amber',   emoji: '📖' };
    return            { label: 'F', msg: 'More study needed.', color: 'red',     emoji: '📚' };
  }, [pct]);

  // ── Results screen ──────────────────────────────────────────────────────────
  if (done) return (
    <div className="space-y-4">
      <div className={`bg-${grade.color}-50 border border-${grade.color}-200 rounded-2xl p-5 text-center`}>
        <p className="text-5xl mb-2">{grade.emoji}</p>
        <h3 className="text-2xl font-bold text-slate-800 mb-0.5">Challenge Complete!</h3>
        <p className={`text-4xl font-black text-${grade.color}-600 my-2`}>{grade.label}</p>
        <p className="text-slate-600 text-sm mb-1">
          <span className="font-bold text-slate-800 text-lg">{score}</span> / {total} correct
          <span className="mx-2 text-slate-300">·</span>
          <span className="font-bold">{pct}%</span>
          <span className="mx-2 text-slate-300">·</span>
          Best streak <span className="font-bold text-amber-600">🔥 {best}</span>
        </p>
        <p className={`text-sm text-${grade.color}-700 font-semibold mb-4`}>{grade.msg}</p>

        {/* Score bar */}
        <div className="w-full bg-slate-100 rounded-full h-3 mb-4 overflow-hidden">
          <div className={`bg-${grade.color}-500 h-3 rounded-full transition-all duration-700`}
            style={{ width: `${pct}%` }} />
        </div>

        <div className="flex gap-3 justify-center">
          <button onClick={() => reset(true)}
            className={`bg-${themeColor}-600 hover:bg-${themeColor}-700 text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm`}>
            🔀 New Shuffle
          </button>
          <button onClick={() => reset(false)}
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold px-6 py-2.5 rounded-xl transition-colors text-sm">
            ↺ Same Order
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <h3 className="font-bold text-slate-700 mb-3 text-sm">Full Review</h3>
        <div className="space-y-2">
          {history.map((h, i) => (
            <div key={i} className={`p-3 rounded-xl border text-xs ${h.correct ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
              <p className="font-medium text-slate-600 mb-1">
                <span className="text-slate-400 mr-1">Q{i + 1}.</span>{h.q}
              </p>
              {h.correct
                ? <p className="text-emerald-700 font-bold">✓ {h.answer}</p>
                : <>
                    <p className="text-red-700">✗ You picked: <span className="font-bold">{h.picked}</span></p>
                    <p className="text-red-600 mt-0.5">Correct: <span className="font-bold">{h.answer}</span></p>
                  </>
              }
              <p className="text-slate-500 mt-1 italic">{h.exp}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Question screen ─────────────────────────────────────────────────────────
  return (
    <div className="space-y-3">

      {/* Header bar: progress + streak */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-slate-700">
            Q{current + 1} <span className="text-slate-400 font-normal">/ {total}</span>
          </span>
          <div className="flex items-center gap-3">
            {streak >= 2 && (
              <span className="text-xs font-bold text-amber-600 animate-pulse">
                🔥 {streak} streak
              </span>
            )}
            <span className={`text-xs font-semibold text-${themeColor}-600`}>
              ✓ {score} pts
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
          <div className={`bg-${themeColor}-500 h-2 rounded-full transition-all duration-500`}
            style={{ width: `${((current) / total) * 100}%` }} />
        </div>

        {/* Question pip dots (max 15 shown, rest as +N) */}
        <div className="flex items-center gap-1 flex-wrap">
          {deck.slice(0, 15).map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${
              i < current
                ? (history[i]?.correct ? 'bg-emerald-400' : 'bg-red-400')
                : i === current
                  ? `bg-${themeColor}-500 w-4`
                  : 'bg-slate-200'
            } ${i === current ? 'w-4' : 'w-1.5'}`} />
          ))}
          {total > 15 && (
            <span className="text-[10px] text-slate-400 ml-1">+{total - 15} more</span>
          )}
        </div>
      </div>

      {/* Question card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <p className={`text-[10px] font-bold text-${themeColor}-600 uppercase tracking-wider mb-2`}>Scenario</p>
        <p className="text-base font-semibold text-slate-800 leading-relaxed mb-4">{q.q}</p>

        <div className="space-y-2">
          {q.options.map((opt, idx) => {
            const isAnswer = opt === q.answer;
            const isPicked = opt === picked;
            let cls = `border-slate-200 bg-white hover:border-${themeColor}-300 hover:bg-${themeColor}-50 text-slate-700 cursor-pointer`;
            if (picked) {
              if (isAnswer)       cls = 'border-emerald-400 bg-emerald-50 text-emerald-800 font-bold cursor-default';
              else if (isPicked)  cls = 'border-red-300    bg-red-50    text-red-700 opacity-80 cursor-default';
              else                cls = 'border-slate-100  bg-slate-50  text-slate-300 opacity-40 cursor-default';
            }
            return (
              <button key={opt} disabled={!!picked} onClick={() => handlePick(opt)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm flex items-center gap-3 ${cls}`}>
                <span className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                  picked && isAnswer ? 'border-emerald-500 bg-emerald-500 text-white' :
                  picked && isPicked && !isAnswer ? 'border-red-400 bg-red-100 text-red-600' :
                  !picked ? `border-${themeColor}-300 text-${themeColor}-500` : 'border-slate-200 text-slate-300'
                }`}>{idx + 1}</span>
                <span className="flex-1">{opt}</span>
                {picked && isAnswer              && <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                {picked && isPicked && !isAnswer && <XCircle     className="w-4 h-4 text-red-400    flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        {picked && (
          <div className={`mt-4 p-4 rounded-xl border ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
            <p className={`text-sm font-bold mb-1 ${isCorrect ? 'text-emerald-800' : 'text-red-800'}`}>
              {isCorrect ? `✓ Correct! ${streak >= 3 ? '🔥'.repeat(Math.min(streak, 5)) : ''}` : `✗ Correct answer: "${q.answer}"`}
            </p>
            <p className={`text-sm ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>{q.exp}</p>
            <div className="flex items-center gap-2 mt-3">
              <button onClick={next}
                className={`bg-${themeColor}-600 hover:bg-${themeColor}-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors`}>
                {current + 1 < total ? 'Next →' : 'See Results'}
              </button>
              <span className="text-[10px] text-slate-400">or press Enter / Space</span>
            </div>
          </div>
        )}

        {!picked && (
          <p className="text-[10px] text-slate-400 mt-3 text-right">
            Press <kbd className="bg-slate-100 px-1 py-0.5 rounded text-slate-500 font-mono">1</kbd>–
            <kbd className="bg-slate-100 px-1 py-0.5 rounded text-slate-500 font-mono">{q.options.length}</kbd> to select
          </p>
        )}
      </div>
    </div>
  );
};

// ── QuizTab ───────────────────────────────────────────────────────────────────
const ALL_QUIZ_DATA = [
  ...PROTECTION_QUIZ_DATA.map(q => ({ ...q, _tag: '🛡️' })),
  ...SHARING_QUIZ_DATA.map(q => ({ ...q, _tag: '🤝' })),
  ...MARKETPLACE_QUIZ_DATA.map(q => ({ ...q, _tag: '🛒' })),
];

const QUIZ_SECTIONS = [
  { id: 'protection',  label: 'Data Protection',       emoji: '🛡️', desc: '5.1 — Time Travel, Fail-safe, Cloning, Failover', count: PROTECTION_QUIZ_DATA.length },
  { id: 'sharing',     label: 'Data Sharing',           emoji: '🤝', desc: '5.2 — Provider/Consumer/Reader, Secure Shares, Clean Rooms', count: SHARING_QUIZ_DATA.length },
  { id: 'marketplace', label: 'Marketplace & Listings', emoji: '🛒', desc: '5.3 — Marketplace, Public/Private listings, Native Apps', count: MARKETPLACE_QUIZ_DATA.length },
  { id: 'all',         label: 'Mix All',                emoji: '⚡', desc: `All ${ALL_QUIZ_DATA.length} questions, shuffled`, count: ALL_QUIZ_DATA.length },
];

const QuizTab = () => {
  const [active, setActive] = useState('protection');

  // Re-mount ScenarioPicker when section changes so state resets cleanly
  const quizKey = active;

  return (
    <div className="space-y-4">
      <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <FlaskConical className="w-5 h-5 text-violet-600" />
          <p className="font-bold text-violet-800 text-sm">Domain 5 — Knowledge Checks</p>
          <span className="ml-auto text-[10px] text-violet-500 bg-violet-100 px-2 py-0.5 rounded-full">
            Questions shuffle on every attempt
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {QUIZ_SECTIONS.map(s => (
            <button key={s.id} onClick={() => setActive(s.id)}
              className={`p-3 rounded-xl border text-center transition-all ${
                active === s.id
                  ? 'bg-violet-600 border-violet-600 text-white shadow-md'
                  : 'bg-white border-violet-200 text-violet-700 hover:bg-violet-100'
              }`}>
              <p className="text-xl mb-0.5">{s.emoji}</p>
              <p className="font-bold text-xs leading-tight">{s.label}</p>
              <p className={`text-[10px] mt-0.5 leading-snug ${active === s.id ? 'text-violet-200' : 'text-slate-400'}`}>
                {s.count} Qs
              </p>
            </button>
          ))}
        </div>
      </div>

      {active === 'protection'  && <ScenarioPicker key={quizKey} data={PROTECTION_QUIZ_DATA}  themeColor="rose" />}
      {active === 'sharing'     && <ScenarioPicker key={quizKey} data={SHARING_QUIZ_DATA}     themeColor="violet" />}
      {active === 'marketplace' && <ScenarioPicker key={quizKey} data={MARKETPLACE_QUIZ_DATA} themeColor="blue" />}
      {active === 'all'         && <ScenarioPicker key={quizKey} data={ALL_QUIZ_DATA}          themeColor="violet" />}
    </div>
  );
};

export default Domain5_Collaboration;
