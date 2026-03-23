import React, { useState, useCallback } from 'react';
import {
  Activity, Zap, HardDrive, GitBranch, Construction,
  ChevronRight, RefreshCw, CheckCircle, XCircle, FlaskConical,
  BarChart2, Search, Layers, Eye,
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

// ─── Tab registry — mirrors guide objectives 4.1 → 4.4 ──────────────────────
const TABS = [
  { id: 'queryeval',      label: '📊 4.1 Evaluate Performance' },
  { id: 'queryoptimize',  label: '⚡ 4.2 Optimize Performance' },
  { id: 'caching',        label: '💾 4.3 Caching' },
  { id: 'transformation', label: '🔄 4.4 Transformation' },
  { id: 'quiz',           label: '🧪 Quiz', accent: true },
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

// ─── Domain 4 root ────────────────────────────────────────────────────────────
const Domain4_Performance = () => {
  const [activeTab, setActiveTab] = useState('queryeval');
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
                  : 'border-amber-600 text-amber-700 bg-amber-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'queryeval'      && <QueryEvalTab />}
      {activeTab === 'queryoptimize'  && <QueryOptimizeTab />}
      {activeTab === 'caching'        && <CachingTab />}
      {activeTab === 'transformation' && <TransformationTab />}
      {activeTab === 'quiz'           && <QuizTab />}
      {!['queryeval', 'queryoptimize', 'caching', 'transformation', 'quiz'].includes(activeTab) &&
        <ComingSoon tab={TABS.find(t => t.id === activeTab)?.label} />}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// LEARNING TAB 1 — 4.1 Evaluate Query Performance
// Covers: Query Profile/Insights, bytes spilled, pruning, exploding joins,
//         queuing, ACCOUNT_USAGE views, workload management
// ═══════════════════════════════════════════════════════════════════════════════

const QUERY_PROBLEMS = [
  {
    id: 'spill',
    icon: '💧',
    title: 'Bytes Spilled to Storage',
    severity: 'High',
    desc: 'Occurs when the virtual warehouse runs out of memory and spills data to local SSD (spill to local) or remote cloud storage (spill to remote). Spill to remote is far slower and dramatically increases query time.',
    causes: ['Warehouse size too small for the query', 'Large aggregations or hash joins exceeding memory', 'Insufficient partitioning causing full table scans'],
    fix: 'Scale up the warehouse (larger memory), optimize aggregations, or add clustering keys to reduce data scanned.',
    code: `-- Identify queries with spill using ACCOUNT_USAGE
SELECT query_id, query_text, execution_time,
       bytes_spilled_to_local_storage,
       bytes_spilled_to_remote_storage
FROM   SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY
WHERE  bytes_spilled_to_remote_storage > 0
ORDER  BY bytes_spilled_to_remote_storage DESC
LIMIT  20;`,
  },
  {
    id: 'pruning',
    icon: '✂️',
    title: 'Inefficient Pruning',
    severity: 'Medium',
    desc: 'Snowflake stores data in micro-partitions and uses metadata (min/max per column) to skip partitions that don\'t match query filters. Inefficient pruning means Snowflake scans too many micro-partitions — wasting time and compute.',
    causes: ['No clustering key on a heavily filtered column', 'Filtering on a column with very high cardinality after date truncation', 'Implicit type conversion preventing min/max metadata use'],
    fix: 'Add a clustering key on the frequently filtered column. Check partitions_scanned vs partitions_total in Query Profile.',
    code: `-- Check pruning ratio for recent queries
SELECT query_id,
       partitions_total,
       partitions_scanned,
       ROUND(partitions_scanned / NULLIF(partitions_total, 0) * 100, 1) AS pct_scanned
FROM   SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY
WHERE  start_time >= DATEADD('day', -7, CURRENT_TIMESTAMP)
  AND  partitions_total > 0
ORDER  BY pct_scanned DESC
LIMIT  20;`,
  },
  {
    id: 'joins',
    icon: '💥',
    title: 'Exploding Joins',
    severity: 'Critical',
    desc: 'A join that produces far more rows than expected — typically a Cartesian-like explosion caused by duplicate keys in one or both join sides, or a missing join condition. Visible in Query Profile as a node with output rows >> input rows.',
    causes: ['Duplicate values in join keys (accidental fan-out)', 'Missing ON condition in multi-table join', 'Many-to-many relationship not handled with aggregation first'],
    fix: 'Aggregate or deduplicate before joining. Confirm join keys are unique or that the join multiplicity is intentional.',
    code: `-- Detect exploding joins: output rows far exceed input rows
-- Check in Query Profile → Statistics panel → "Output Rows" node

-- Defensive pattern: deduplicate before join
SELECT o.order_id, c.name
FROM   orders o
JOIN   (SELECT DISTINCT customer_id, name FROM customers) c
         ON o.customer_id = c.customer_id;`,
  },
  {
    id: 'queuing',
    icon: '⏳',
    title: 'Queuing',
    severity: 'Medium',
    desc: 'Queries wait in the warehouse queue because the warehouse is fully occupied with concurrent queries. The Query Profile shows a "Queued" state at the top of the execution tree. Latency is entirely queueing overhead — not actual query time.',
    causes: ['Too many concurrent queries for the warehouse size', 'Single small warehouse handling mixed workload types', 'Long-running queries blocking short ones'],
    fix: 'Enable multi-cluster warehouse auto-scaling, separate workloads into dedicated warehouses, or use query priority settings.',
    code: `-- Identify queries that spent time in queue
SELECT query_id, query_text,
       queued_overload_time,  -- ms spent queued due to warehouse overload
       queued_provisioning_time,
       execution_time
FROM   SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY
WHERE  queued_overload_time > 5000   -- > 5 seconds queued
ORDER  BY queued_overload_time DESC
LIMIT  20;`,
  },
  {
    id: 'union',
    icon: '🔀',
    title: 'UNION without ALL',
    severity: 'Medium',
    desc: 'Using UNION instead of UNION ALL forces Snowflake to add an extra Aggregate node on top of the UnionAll node to eliminate duplicates. This deduplication step is visible in the Query Profile as an additional operator and adds unnecessary overhead when duplicates are acceptable.',
    causes: ['Developer defaults to UNION not realising deduplication has a cost', 'Result sets are already distinct (deduplication is redundant)'],
    fix: 'Use UNION ALL unless deduplication is actually required. UNION ALL avoids the extra Aggregate operator and is always faster.',
    code: `-- UNION forces a deduplication pass (extra Aggregate node in Query Profile)
SELECT customer_id FROM active_customers
UNION
SELECT customer_id FROM vip_customers;

-- UNION ALL: no deduplication — use when duplicates are acceptable or impossible
SELECT customer_id FROM active_customers
UNION ALL
SELECT customer_id FROM vip_customers;`,
  },
];

const ACCOUNT_USAGE_VIEWS = [
  {
    view: 'QUERY_HISTORY',
    latency: '45 min',
    use: 'Full history of all queries: execution time, bytes scanned, partitions scanned/total, spill, warehouse used.',
    code: `SELECT warehouse_name,
       COUNT(*)                              AS total_queries,
       AVG(execution_time) / 1000           AS avg_exec_sec,
       SUM(bytes_scanned) / 1e9             AS gb_scanned
FROM   SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY
WHERE  start_time >= DATEADD('day', -30, CURRENT_TIMESTAMP)
GROUP  BY 1
ORDER  BY 2 DESC;`,
  },
  {
    view: 'QUERY_ATTRIBUTION_HISTORY',
    latency: '8 h',
    use: 'Links query costs (credits) to users, roles, warehouses, and query tags. Useful for chargeback and workload attribution.',
    code: `-- Identify top credit-consuming roles in the last 7 days
SELECT role_name,
       COUNT(*)               AS queries,
       SUM(credits_attributed_compute) AS credits
FROM   SNOWFLAKE.ACCOUNT_USAGE.QUERY_ATTRIBUTION_HISTORY
WHERE  start_time >= DATEADD('day', -7, CURRENT_TIMESTAMP)
GROUP  BY 1
ORDER  BY credits DESC;`,
  },
  {
    view: 'QUERY_INSIGHTS',
    latency: '45 min',
    use: 'AI-generated recommendations for the top resource-consuming queries. Same data surfaced in the Query Profile "Query Insights" pane — queryable programmatically for batch triage.',
    code: `-- Find queries with active AI recommendations in the last 24 hours
SELECT query_id, query_text, impact,
       condition_name, recommendation
FROM   SNOWFLAKE.ACCOUNT_USAGE.QUERY_INSIGHTS
WHERE  start_time >= DATEADD('hour', -24, CURRENT_TIMESTAMP)
ORDER  BY impact DESC
LIMIT  20;`,
  },
];

const QueryEvalTab = () => {
  const [openProblem, setOpenProblem] = useState(null);
  const [openView,    setOpenView]    = useState(null);

  return (
    <div className="space-y-5">
      <InfoCard>
        <SectionHeader
          icon={Activity}
          color="bg-amber-600"
          title="4.1 Evaluate Query Performance"
          subtitle="Query Profile · ACCOUNT_USAGE · Workload management"
        />

        {/* Query Profile overview */}
        <h3 className="font-bold text-slate-700 mb-2">Query Profile &amp; Query Insights</h3>
        <p className="text-sm text-slate-600 mb-3">
          The <strong>Query Profile</strong> in Snowsight visualises the execution plan as an operator tree. Each node shows processing time, output rows, bytes, and memory usage. <strong>Query Insights</strong> is an AI-powered layer that surfaces the most impactful optimisations automatically.
        </p>

        <div className="grid sm:grid-cols-3 gap-3 mb-4 text-xs">
          {[
            { label: 'Profile Overview',     desc: 'Execution time breakdown by component: Processing, Local Disk IO, Remote Disk IO, Network Communication, Synchronization, Initialization.' },
            { label: 'Query Insights',        desc: 'AI-powered pane: surfaces actionable recommendations and conditions. Also queryable via the QUERY_INSIGHTS ACCOUNT_USAGE view.' },
            { label: 'Statistics',            desc: 'IO (bytes scanned, % from cache), Pruning (partitions scanned/total), Spilling (bytes spilled local/remote), and Network metrics.' },
            { label: 'Most Expensive Nodes', desc: 'Lists operators lasting ≥ 1% of total execution time, sorted descending. Start optimisation here.' },
            { label: 'Attributes',            desc: 'Per-operator details for each node: TableScan, Join, Filter, Aggregate, WindowFunction, Sort, and more.' },
          ].map(c => (
            <div key={c.label} className="bg-amber-50 rounded-xl p-3 border border-amber-200">
              <p className="font-bold text-amber-800 mb-1">{c.label}</p>
              <p className="text-amber-700">{c.desc}</p>
            </div>
          ))}
        </div>

        <h3 className="font-bold text-slate-700 mb-2">Common Performance Problems</h3>
        <div className="space-y-2">
          {QUERY_PROBLEMS.map((p, i) => (
            <div key={p.id} className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-4 py-3 text-left bg-slate-50 hover:bg-slate-100 transition-colors"
                onClick={() => setOpenProblem(openProblem === i ? null : i)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{p.icon}</span>
                  <span className="font-semibold text-slate-700 text-sm">{p.title}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded hidden sm:inline ${
                    p.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                    p.severity === 'High'     ? 'bg-orange-100 text-orange-700' :
                                               'bg-amber-100 text-amber-700'
                  }`}>{p.severity}</span>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${openProblem === i ? 'rotate-90' : ''}`} />
              </button>
              {openProblem === i && (
                <div className="px-4 pb-4 pt-2 bg-white space-y-2">
                  <p className="text-sm text-slate-600">{p.desc}</p>
                  <div className="grid sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                      <p className="font-bold text-red-700 mb-1">Common causes</p>
                      <ul className="space-y-0.5 text-red-700">
                        {p.causes.map(c => <li key={c}>• {c}</li>)}
                      </ul>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                      <p className="font-bold text-emerald-700 mb-1">Fix</p>
                      <p className="text-emerald-700">{p.fix}</p>
                    </div>
                  </div>
                  <CodeBlock code={p.code} />
                </div>
              )}
            </div>
          ))}
        </div>
      </InfoCard>

      {/* ACCOUNT_USAGE views */}
      <InfoCard>
        <h3 className="font-bold text-slate-700 mb-1">SNOWFLAKE.ACCOUNT_USAGE Views</h3>
        <p className="text-xs text-slate-500 mb-3">
          Account Usage views are in the shared <strong>SNOWFLAKE</strong> database (ACCOUNT_USAGE schema). They have a latency of 45 min to a few hours but retain data for <strong>1 year</strong>. Require the SNOWFLAKE database privilege or ACCOUNTADMIN role.
        </p>
        <div className="space-y-2">
          {ACCOUNT_USAGE_VIEWS.map((v, i) => (
            <div key={v.view} className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-4 py-3 text-left bg-slate-50 hover:bg-slate-100 transition-colors"
                onClick={() => setOpenView(openView === i ? null : i)}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-amber-700 text-xs font-bold bg-amber-50 px-2 py-0.5 rounded">{v.view}</span>
                  <span className="text-xs text-slate-400 hidden sm:block">latency ~{v.latency}</span>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${openView === i ? 'rotate-90' : ''}`} />
              </button>
              {openView === i && (
                <div className="px-4 pb-4 pt-2 bg-white space-y-2">
                  <p className="text-sm text-slate-600">{v.use}</p>
                  <CodeBlock code={v.code} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Source</th>
                <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Latency</th>
                <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Retention</th>
                <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Best for</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['ACCOUNT_USAGE', '45 min – 8 h', '1 year', 'Historical analysis, governance, chargeback'],
                ['INFORMATION_SCHEMA', 'Real-time (seconds)', '7–14 days', 'Current session monitoring, recent query debugging'],
              ].map(([src, lat, ret, use]) => (
                <tr key={src} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-2 border border-slate-200 font-mono text-amber-700 font-bold">{src}</td>
                  <td className="p-2 border border-slate-200 text-slate-600">{lat}</td>
                  <td className="p-2 border border-slate-200 text-slate-600">{ret}</td>
                  <td className="p-2 border border-slate-200 text-slate-500">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </InfoCard>

      {/* Workload management */}
      <InfoCard>
        <h3 className="font-bold text-slate-700 mb-2">Workload Management Best Practices</h3>
        <p className="text-xs text-slate-500 mb-3">
          Grouping <strong>similar workloads</strong> onto dedicated warehouses prevents slow, resource-heavy queries from blocking fast interactive ones. This is the foundation of Snowflake workload management.
        </p>
        <div className="grid sm:grid-cols-2 gap-3 text-xs mb-4">
          {[
            { title: 'Separate by workload type', items: ['ETL / data loading → dedicated large WH', 'BI / dashboards → multi-cluster WH (auto-scale)', 'Ad-hoc / data science → on-demand WH', 'Critical SLA queries → dedicated, never shared'] },
            { title: 'Warehouse sizing rules', items: ['Start small, scale up for memory-intensive queries', 'Use AUTO_SUSPEND (60 s default) to avoid idle charges', 'Enable AUTO_RESUME so queries trigger restart', 'Multi-cluster auto-scale handles concurrency spikes'] },
          ].map(g => (
            <div key={g.title} className="bg-amber-50 rounded-xl p-3 border border-amber-200">
              <p className="font-bold text-amber-800 mb-1">{g.title}</p>
              <ul className="space-y-0.5 text-amber-700">
                {g.items.map(i => <li key={i}>• {i}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <CodeBlock code={`-- Dedicated ETL warehouse with resource monitor
CREATE WAREHOUSE etl_wh
  WAREHOUSE_SIZE = 'LARGE'
  AUTO_SUSPEND   = 60
  AUTO_RESUME    = TRUE
  MAX_CLUSTER_COUNT = 1;           -- single cluster for batch ETL

-- BI warehouse with auto-scaling for concurrency
CREATE WAREHOUSE bi_wh
  WAREHOUSE_SIZE    = 'MEDIUM'
  MIN_CLUSTER_COUNT = 1
  MAX_CLUSTER_COUNT = 5            -- scales out under load
  SCALING_POLICY    = 'ECONOMY'   -- ECONOMY = fewer, longer-running clusters
  AUTO_SUSPEND      = 120;`} />
      </InfoCard>

      <ExamTip>
        <p>• <strong>Bytes spilled to remote storage</strong> = warehouse too small. Scale up first, then check clustering.</p>
        <p>• <strong>Inefficient pruning</strong>: check <code>partitions_scanned / partitions_total</code> in Query Profile — high ratio means missing or wrong clustering key.</p>
        <p>• <strong>Exploding joins</strong>: output rows >> input rows in the join node. Deduplicate join keys before joining.</p>
        <p>• <strong>Queuing</strong>: time shown as "Queued" in Profile — not a query problem, a concurrency problem. Solution: multi-cluster warehouse or workload separation.</p>
        <p>• <strong>UNION without ALL</strong>: adds an extra Aggregate node in the Query Profile to deduplicate — use UNION ALL unless deduplication is required.</p>
        <p>• <strong>ACCOUNT_USAGE</strong> views: 45 min–8 h latency (QUERY_ATTRIBUTION_HISTORY = 8 h), 1-year retention. <strong>INFORMATION_SCHEMA</strong>: real-time, 7–14 day retention.</p>
        <p>• <strong>Query Insights</strong> pane in Snowsight = AI recommendations; also available as <strong>QUERY_INSIGHTS</strong> ACCOUNT_USAGE view.</p>
        <p>• Best practice: <strong>group similar workloads</strong> onto separate warehouses to prevent interference.</p>
      </ExamTip>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// LEARNING TAB 2 — 4.2 Optimize Query Performance
// Covers: Query acceleration, Search optimization, Clustering keys, Materialized views
// ═══════════════════════════════════════════════════════════════════════════════

const OPTIMIZE_SERVICES = [
  {
    id: 'qas',
    icon: '🚀',
    title: 'Query Acceleration Service (QAS)',
    tag: 'Account-level serverless',
    edition: 'Enterprise',
    desc: 'Offloads portions of eligible queries to a serverless compute pool. Best for ad-hoc queries with large scans, aggregations, or GROUP BY on varying columns — "outlier" queries that are unexpectedly slow.',
    when: ['Ad-hoc / data science queries with large, variable scan ranges', 'Queries that sporadically spike in execution time', 'Aggregations or filters on non-clustered columns'],
    notWhen: 'Does NOT help with queuing (use multi-cluster WH), spill (scale up WH), or join explosions.',
    extra: [
      'Scale factor 0 = unlimited upper bound (no cap on serverless resources)',
      'Billed by the second (serverless) — separate line item from warehouse credits',
      'Use QUERY_ACCELERATION_ELIGIBLE view to identify candidate queries before enabling',
      'SYSTEM$ESTIMATE_QUERY_ACCELERATION returns estimated time per scale factor + ineligibleReason',
      'SQL commands accelerated: SELECT, INSERT, CTAS, COPY INTO',
    ],
    code: `-- Enable QAS on a warehouse with a max scale factor
ALTER WAREHOUSE my_wh SET
  ENABLE_QUERY_ACCELERATION = TRUE
  QUERY_ACCELERATION_MAX_SCALE_FACTOR = 8;  -- 0 = unlimited; default 8

-- Find eligible queries BEFORE enabling (check ACCOUNT_USAGE)
SELECT query_id, eligible_query_acceleration_time, upper_limit_scale_factor
FROM   SNOWFLAKE.ACCOUNT_USAGE.QUERY_ACCELERATION_ELIGIBLE
WHERE  start_time >= DATEADD('day', -7, CURRENT_TIMESTAMP)
ORDER  BY eligible_query_acceleration_time DESC;

-- Estimate savings for a specific query ID
SELECT SYSTEM$ESTIMATE_QUERY_ACCELERATION('<query_id>');`,
  },
  {
    id: 'sos',
    icon: '🔍',
    title: 'Search Optimization Service (SOS)',
    tag: 'Table-level, additional cost',
    edition: 'Enterprise',
    desc: 'Creates a persistent search access path (hidden metadata structure) for equality (=) and IN predicate lookups on high-cardinality columns in large tables. Dramatically speeds up point lookups without needing to cluster the table.',
    when: ['Point lookups on high-cardinality columns (customer_id, email)', 'IN predicates with large value lists', 'VARIANT path lookups in semi-structured data', 'Geospatial point-in-polygon searches'],
    notWhen: 'Does NOT improve range queries (use clustering keys). Does NOT reduce bytes scanned for full-table aggregations.',
    extra: [
      'Supported predicates: =, IN, ARRAY_CONTAINS, ARRAYS_OVERLAP, SEARCH (full-text), LIKE / ILIKE / RLIKE (substring/regex), geospatial functions',
      'search_optimization_progress column in SHOW TABLES — queries are NOT accelerated until this reaches 100%',
      'Can target specific columns to reduce maintenance cost',
    ],
    code: `-- Enable Search Optimization on the whole table
ALTER TABLE customers ADD SEARCH OPTIMIZATION;

-- Or enable only on specific columns (cheaper)
ALTER TABLE orders ADD SEARCH OPTIMIZATION ON EQUALITY(customer_id, status);

-- Check SOS build progress — queries not accelerated until 100%
SHOW TABLES LIKE 'customers';
-- Look for: search_optimization_progress column

-- Check SOS credit usage
SELECT * FROM TABLE(INFORMATION_SCHEMA.SEARCH_OPTIMIZATION_HISTORY(
  DATE_RANGE_START => DATEADD('day', -7, CURRENT_DATE)
));`,
  },
  {
    id: 'clustering',
    icon: '🗂️',
    title: 'Clustering Keys',
    tag: 'Micro-partition organization',
    edition: null,
    desc: 'Snowflake stores data in micro-partitions sorted by insertion order. A clustering key re-sorts micro-partitions by the specified column(s), enabling better pruning. Snowflake automatically re-clusters in the background.',
    when: ['Large tables (100M+ rows) queried with range filters on date/timestamp', 'Slowly changing dimension tables filtered by a surrogate key', 'Large fact tables with frequent date-range WHERE clauses'],
    notWhen: 'Small tables, tables queried without selective WHERE clauses, or columns with very low cardinality (boolean). Cannot be defined on hybrid tables.',
    extra: [
      'Max 3–4 columns per key — more columns adds cost without meaningful benefit',
      'Column order matters: specify lowest cardinality first → highest cardinality last',
      'VARCHAR columns: only the first 5 bytes are used for clustering',
      'Cardinality sweet spot: not too low (boolean → no pruning), not too high (nanosecond timestamp → use TO_DATE(ts) expression to reduce cardinality)',
      'Cannot be defined on hybrid tables',
    ],
    code: `-- Create a table with a clustering key
CREATE TABLE orders (
  order_id   NUMBER,
  order_date DATE,
  amount     DECIMAL
) CLUSTER BY (order_date);  -- Snowflake auto-reclusters

-- Add or change clustering key on existing table
ALTER TABLE orders CLUSTER BY (order_date, region);

-- Remove clustering key
ALTER TABLE orders DROP CLUSTERING KEY;

-- Inspect clustering depth (lower = better clustered)
SELECT SYSTEM$CLUSTERING_INFORMATION('orders', '(order_date)');

-- Check automatic reclustering credit usage
SELECT * FROM SNOWFLAKE.ACCOUNT_USAGE.AUTOMATIC_CLUSTERING_HISTORY
WHERE  start_time >= DATEADD('day', -30, CURRENT_TIMESTAMP);`,
  },
  {
    id: 'matviews',
    icon: '🪟',
    title: 'Materialized Views',
    tag: 'Pre-computed query results',
    edition: 'Enterprise',
    desc: 'A materialized view stores the pre-computed results of a query as actual data. Snowflake auto-refreshes the MV when the base table changes. Queries against the base table that match the MV query are transparently re-routed to the MV.',
    when: ['Expensive aggregations queried frequently from BI tools', 'Pre-filtered subsets of a large table accessed repeatedly'],
    notWhen: 'Base tables that change very frequently (high refresh cost).',
    extra: [
      'Single base table only — no joins of any kind (including self-joins)',
      'No window functions, no HAVING, no ORDER BY, no LIMIT',
      'No GROUP BY ROLLUP / CUBE / GROUPING SETS',
      'No UDFs (any type); all functions must be deterministic',
      'SHOW MATERIALIZED VIEWS → BEHIND_BY column shows how far behind the MV refresh is',
      'If base table column is dropped or altered → MV is suspended and must be recreated',
    ],
    code: `-- Create a materialized view (no warehouse needed for Snowflake-managed refresh)
CREATE MATERIALIZED VIEW daily_revenue_mv AS
SELECT
  DATE_TRUNC('day', order_date) AS order_day,
  region,
  SUM(amount)                   AS total_revenue,
  COUNT(*)                      AS order_count
FROM   orders
GROUP  BY 1, 2;

-- Query uses MV transparently (optimizer decides)
SELECT order_day, total_revenue FROM daily_revenue_mv
WHERE  order_day >= '2024-01-01';

-- Refresh manually if needed
ALTER MATERIALIZED VIEW daily_revenue_mv REFRESH;

-- Check MV lag: BEHIND_BY column
SHOW MATERIALIZED VIEWS;

-- Monitor refresh cost
SELECT * FROM SNOWFLAKE.ACCOUNT_USAGE.MATERIALIZED_VIEW_REFRESH_HISTORY
ORDER  BY start_time DESC;`,
  },
];

const QueryOptimizeTab = () => {
  const [open, setOpen] = useState(null);

  return (
    <div className="space-y-5">
      <InfoCard>
        <SectionHeader
          icon={Zap}
          color="bg-amber-600"
          title="4.2 Optimize Query Performance"
          subtitle="Query Acceleration · Search Optimization · Clustering Keys · Materialized Views"
        />

        <div className="overflow-x-auto mb-4">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Service</th>
                <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Applied at</th>
                <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Best problem</th>
                <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Cost model</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Query Acceleration',      'Warehouse level', 'Ad-hoc large scan outliers',            'Serverless credits per query'],
                ['Search Optimization',     'Table level',     'Point lookups / equality predicates',   'Credit-per-hour for maintenance'],
                ['Clustering Keys',         'Table level',     'Range filter pruning (date/time)',       'Automatic reclustering credits'],
                ['Materialized Views',      'Schema level',    'Repeated expensive aggregations/joins',  'Serverless refresh + storage'],
              ].map(([svc, at, prob, cost]) => (
                <tr key={svc} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-2 border border-slate-200 font-bold text-amber-700">{svc}</td>
                  <td className="p-2 border border-slate-200 text-slate-600">{at}</td>
                  <td className="p-2 border border-slate-200 text-slate-600">{prob}</td>
                  <td className="p-2 border border-slate-200 text-slate-500">{cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-2">
          {OPTIMIZE_SERVICES.map((s, i) => (
            <div key={s.id} className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-4 py-3 text-left bg-slate-50 hover:bg-slate-100 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{s.icon}</span>
                  <span className="font-semibold text-slate-700 text-sm">{s.title}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 hidden sm:inline">{s.tag}</span>
                  {s.edition && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 hidden sm:inline">🏢 {s.edition} Ed.</span>
                  )}
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${open === i ? 'rotate-90' : ''}`} />
              </button>
              {open === i && (
                <div className="px-4 pb-4 pt-2 bg-white space-y-3">
                  <p className="text-sm text-slate-600">{s.desc}</p>
                  <div className="grid sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                      <p className="font-bold text-emerald-800 mb-1">✅ When to use</p>
                      <ul className="space-y-0.5 text-emerald-700">
                        {s.when.map(w => <li key={w}>• {w}</li>)}
                      </ul>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                      <p className="font-bold text-red-700 mb-1">❌ When NOT to use</p>
                      <p className="text-red-700">{s.notWhen}</p>
                    </div>
                  </div>
                  {s.extra && (
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 text-xs">
                      <p className="font-bold text-blue-800 mb-1">📌 Key details</p>
                      <ul className="space-y-0.5 text-blue-700">
                        {s.extra.map(e => <li key={e}>• {e}</li>)}
                      </ul>
                    </div>
                  )}
                  <CodeBlock code={s.code} />
                </div>
              )}
            </div>
          ))}
        </div>
      </InfoCard>

      <ExamTip>
        <p>• <strong>Query Acceleration Service</strong> (Enterprise) = warehouse-level serverless; helps <em>outlier</em> ad-hoc queries with large scans. Scale factor 0 = unlimited. Check QUERY_ACCELERATION_ELIGIBLE view before enabling.</p>
        <p>• <strong>Search Optimization</strong> (Enterprise) = table-level; helps equality / IN / LIKE / SEARCH / geospatial predicates on high-cardinality columns. Build progress in <code>search_optimization_progress</code> — NOT accelerated until 100%.</p>
        <p>• <strong>Clustering Keys</strong>: max 3–4 columns; lowest → highest cardinality order. VARCHAR = first 5 bytes only. Cannot be used on hybrid tables.</p>
        <p>• <strong>Materialized Views</strong> (Enterprise): single base table, NO joins, no window fns, no HAVING/ORDER BY/LIMIT. SHOW MATERIALIZED VIEWS → <code>BEHIND_BY</code> column shows refresh lag.</p>
        <p>• Clustering vs Search Optimization: <strong>clustering = range queries</strong>; <strong>SOS = equality / IN lookups</strong>.</p>
      </ExamTip>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// LEARNING TAB 3 — 4.3 Snowflake Caching
// Covers: Query result cache, Metadata cache, Warehouse (local disk) cache
// ═══════════════════════════════════════════════════════════════════════════════

const CACHE_TYPES = [
  {
    id: 'result',
    icon: '⚡',
    name: 'Query Result Cache',
    layer: 'Cloud Services',
    scope: 'Account-wide',
    desc: 'When an identical query is re-executed, Snowflake returns the cached result instantly — no virtual warehouse needed, no credits consumed. The cache lives in the Cloud Services layer and is accessible from any warehouse in the account.',
    rules: [
      'Query text must match exactly (case-sensitive, whitespace-sensitive)',
      'The underlying table data must not have changed since the last run',
      'The result cache expires after 24 hours of not being used',
      'Timer resets each time the cached result is served (rolling 24 h)',
      'Can be disabled: ALTER SESSION SET USE_CACHED_RESULT = FALSE',
    ],
    code: `-- Check if a query used the result cache
SELECT query_id, query_text, execution_status,
       result_from_cache  -- TRUE when served from result cache
FROM   SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY
WHERE  start_time >= DATEADD('hour', -1, CURRENT_TIMESTAMP)
  AND  result_from_cache = TRUE;

-- Disable result cache for the current session (e.g., for benchmarking)
ALTER SESSION SET USE_CACHED_RESULT = FALSE;`,
  },
  {
    id: 'metadata',
    icon: '📋',
    name: 'Metadata Cache',
    layer: 'Cloud Services',
    scope: 'Account-wide',
    desc: 'Snowflake stores metadata (row count, min/max values, null counts) for every micro-partition in the Cloud Services layer. Certain queries can be answered entirely from metadata without scanning any data — zero compute cost.',
    rules: [
      'COUNT(*) — answered from row count metadata, no scan',
      'MIN() / MAX() on NOT NULL columns — answered from partition metadata',
      'COUNT(DISTINCT col) when column is NOT NULL — answered from metadata',
      'Only works on columns with no nulls for min/max; nulls require scanning',
    ],
    code: `-- These queries use the metadata cache (no warehouse credits):
SELECT COUNT(*) FROM orders;            -- row count from metadata
SELECT MAX(order_date) FROM orders;     -- max from partition metadata
SELECT MIN(amount) FROM orders;         -- min from partition metadata

-- This forces a scan (column has NULLs, so metadata max/min not reliable):
SELECT MAX(discount) FROM orders;       -- discount can be NULL → full scan`,
  },
  {
    id: 'warehouse',
    icon: '🗄️',
    name: 'Warehouse (Local Disk) Cache',
    layer: 'Virtual Warehouse',
    scope: 'Per warehouse instance',
    desc: 'Each virtual warehouse node caches data it has already read from cloud storage on its local SSD. Subsequent queries on the same warehouse that access the same micro-partitions read from the fast local cache instead of cloud storage.',
    rules: [
      'Cache persists only while the warehouse is RUNNING (cleared on SUSPEND)',
      'Scope is per warehouse — a different warehouse has a cold cache',
      'Accessed automatically — no configuration needed',
      'Cache is per-cluster; in a multi-cluster warehouse, different nodes have independent caches',
      'AUTO_SUSPEND clears the cache — consider longer suspend time for heavy repeat workloads',
    ],
    code: `-- Keep warehouse running longer to preserve warm cache for BI dashboards
ALTER WAREHOUSE bi_wh SET AUTO_SUSPEND = 600;  -- 10 minutes

-- Suspend clears the warehouse cache
ALTER WAREHOUSE bi_wh SUSPEND;     -- cache CLEARED
ALTER WAREHOUSE bi_wh RESUME;      -- cache cold again`,
  },
];

const CachingTab = () => {
  const [open, setOpen] = useState(null);

  return (
    <div className="space-y-5">
      <InfoCard>
        <SectionHeader
          icon={HardDrive}
          color="bg-amber-600"
          title="4.3 Snowflake Caching"
          subtitle="Query Result · Metadata · Warehouse (Local Disk)"
        />

        <div className="overflow-x-auto mb-4">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Cache Type</th>
                <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Layer</th>
                <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Scope</th>
                <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Warehouse credits?</th>
                <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Expires</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Query Result',   'Cloud Services', 'Account-wide',       'No',  '24 h (rolling)'],
                ['Metadata',       'Cloud Services', 'Account-wide',       'No',  'Always available'],
                ['Warehouse Disk', 'Virtual WH',     'Per warehouse node', 'Yes', 'On SUSPEND'],
              ].map(([type, layer, scope, wh, exp]) => (
                <tr key={type} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-2 border border-slate-200 font-bold text-amber-700">{type}</td>
                  <td className="p-2 border border-slate-200 text-slate-600">{layer}</td>
                  <td className="p-2 border border-slate-200 text-slate-600">{scope}</td>
                  <td className={`p-2 border border-slate-200 font-bold ${wh === 'No' ? 'text-emerald-600' : 'text-red-500'}`}>{wh}</td>
                  <td className="p-2 border border-slate-200 text-slate-500">{exp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-2">
          {CACHE_TYPES.map((c, i) => (
            <div key={c.id} className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-4 py-3 text-left bg-slate-50 hover:bg-slate-100 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{c.icon}</span>
                  <span className="font-semibold text-slate-700 text-sm">{c.name}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 hidden sm:inline">{c.layer}</span>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${open === i ? 'rotate-90' : ''}`} />
              </button>
              {open === i && (
                <div className="px-4 pb-4 pt-2 bg-white space-y-2">
                  <p className="text-sm text-slate-600">{c.desc}</p>
                  <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 text-xs">
                    <p className="font-bold text-amber-800 mb-1">Key rules</p>
                    <ul className="space-y-0.5 text-amber-700">
                      {c.rules.map(r => <li key={r}>• {r}</li>)}
                    </ul>
                  </div>
                  <CodeBlock code={c.code} />
                </div>
              )}
            </div>
          ))}
        </div>
      </InfoCard>

      {/* Auto-suspend workload recommendations */}
      <InfoCard>
        <h3 className="font-bold text-slate-700 mb-2">Auto-Suspend Recommendations by Workload</h3>
        <p className="text-xs text-slate-500 mb-3">
          A running warehouse burns credits even when idle. Snowflake's official guidance matches <strong>AUTO_SUSPEND</strong> to the expected query interval for each workload type.
        </p>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Workload type</th>
                <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Recommended AUTO_SUSPEND</th>
                <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Reason</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Tasks / Pipelines',       'Immediate (60 s)',   'Batch jobs run at defined intervals — no benefit from keeping WH warm'],
                ['DevOps / Data Science',   '~5 minutes (300 s)', 'Exploratory work has short inter-query gaps — warm cache helps'],
                ['BI / SELECT dashboards',  '≥10 minutes (600 s)', 'Preserve warehouse disk cache for repeated dashboard refreshes'],
              ].map(([wl, suspend, reason]) => (
                <tr key={wl} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-2 border border-slate-200 font-bold text-amber-700">{wl}</td>
                  <td className="p-2 border border-slate-200 text-slate-600">{suspend}</td>
                  <td className="p-2 border border-slate-200 text-slate-500">{reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="font-bold text-slate-700 mb-2">Cache Hit Rate Diagnostics</h3>
        <p className="text-xs text-slate-500 mb-2">Use this query to measure the warehouse (local disk) cache hit rate per warehouse over the last 30 days — a low rate suggests the warehouse is suspending too aggressively.</p>
        <CodeBlock code={`SELECT warehouse_name,
       ROUND(
         SUM(bytes_scanned * percentage_scanned_from_cache)
           / NULLIF(SUM(bytes_scanned), 0) * 100, 1
       ) AS pct_from_cache
FROM   SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY
WHERE  start_time >= DATEADD('month', -1, CURRENT_TIMESTAMP())
  AND  bytes_scanned > 0
GROUP  BY 1
ORDER  BY 2 DESC;`} />
      </InfoCard>

      <ExamTip>
        <p>• <strong>Result cache</strong>: zero credits, returns in milliseconds. Requires <em>exact</em> query text match AND unchanged underlying data. Expires in 24 h (rolling).</p>
        <p>• <strong>Metadata cache</strong>: COUNT(*), MIN/MAX on NOT NULL columns — answered from metadata with <em>no warehouse</em> needed.</p>
        <p>• <strong>Warehouse cache</strong>: local SSD on each warehouse node. Cleared when the warehouse is <strong>SUSPENDED</strong>. Scope = per warehouse (not shared across warehouses).</p>
        <p>• Result cache is <strong>account-wide</strong> — any warehouse can reuse results cached by another warehouse.</p>
        <p>• Disable result cache with <strong>ALTER SESSION SET USE_CACHED_RESULT = FALSE</strong> (useful for benchmarking).</p>
        <p>• <strong>Auto-suspend guidance</strong>: Tasks → immediate; DevOps/Data Science → ~5 min; BI/SELECT → at least 10 min to preserve warm cache.</p>
        <p>• A running warehouse consumes credits even when <em>idle</em> — match AUTO_SUSPEND to actual query interval to avoid waste.</p>
      </ExamTip>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// LEARNING TAB 4 — 4.4 Data Transformation Techniques
// Covers: Structured, semi-structured, unstructured, aggregate & window functions,
//         SQL for query optimization
// ═══════════════════════════════════════════════════════════════════════════════

const WINDOW_FNS = [
  { fn: 'ROW_NUMBER()',     category: 'Ranking', desc: 'Unique sequential number per row. No ties.' },
  { fn: 'RANK()',           category: 'Ranking', desc: 'Rank with gaps — tied rows get the same rank; next rank skips.' },
  { fn: 'DENSE_RANK()',     category: 'Ranking', desc: 'Rank without gaps — tied rows get the same rank; next is consecutive.' },
  { fn: 'NTILE(n)',         category: 'Ranking', desc: 'Divides rows into n roughly equal buckets.' },
  { fn: 'LAG(col, n)',      category: 'Navigation', desc: 'Returns the value n rows before the current row.' },
  { fn: 'LEAD(col, n)',     category: 'Navigation', desc: 'Returns the value n rows after the current row.' },
  { fn: 'FIRST_VALUE(col)', category: 'Navigation', desc: 'First value in the window frame.' },
  { fn: 'LAST_VALUE(col)',  category: 'Navigation', desc: 'Last value in the window frame (requires explicit frame).' },
  { fn: 'SUM() OVER()',     category: 'Aggregate', desc: 'Running or windowed sum without collapsing rows.' },
  { fn: 'AVG() OVER()',     category: 'Aggregate', desc: 'Running or windowed average.' },
  { fn: 'COUNT() OVER()',   category: 'Aggregate', desc: 'Running count in window frame.' },
];

const SEMI_STRUCTURED_FNS = [
  { fn: 'PARSE_JSON()',       desc: 'Converts a JSON string into a VARIANT value.' },
  { fn: 'obj:key',            desc: 'Colon notation — access a top-level key in a VARIANT object.' },
  { fn: 'obj:nested.child',   desc: 'Dot notation — navigate nested VARIANT objects.' },
  { fn: 'obj:arr[0]',         desc: 'Bracket notation — access an array element by index.' },
  { fn: 'FLATTEN()',          desc: 'Table function — explodes a VARIANT array into separate rows.' },
  { fn: 'OBJECT_CONSTRUCT()', desc: 'Builds a VARIANT object from key-value pairs.' },
  { fn: 'ARRAY_AGG()',        desc: 'Aggregates column values into a VARIANT array.' },
  { fn: 'TYPEOF()',           desc: 'Returns the JSON data type of a VARIANT value as a string.' },
  { fn: 'IS_OBJECT() etc.',   desc: 'Type-checking predicates: IS_ARRAY, IS_VARCHAR, IS_NULL_VALUE, etc.' },
];

const TransformationTab = () => {
  const [openSection, setOpenSection] = useState(null);

  const sections = [
    {
      id: 'structured',
      icon: '📊',
      title: 'Structured Data',
      subtitle: 'Standard SQL operations on typed relational columns',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-slate-600">Structured data lives in typed columns (NUMBER, VARCHAR, DATE, BOOLEAN, etc.). Standard ANSI SQL is fully supported. Key optimization patterns are listed below.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Technique</th>
                  <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Why it helps</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['SELECT only needed columns', 'Reduces bytes scanned; Snowflake is columnar — unused columns cost nothing to skip'],
                  ['Push filters as early as possible', 'Filters reduce rows before joins and aggregations — less data shuffled between nodes'],
                  ['Avoid functions on filter columns', 'WHERE DATE_TRUNC(\'day\', ts) = \'2024-01-01\' prevents metadata pruning; use range instead'],
                  ['Use QUALIFY instead of subquery for window deduplication', 'QUALIFY deduplicates in one pass — avoids wrapping the whole query in a subquery'],
                  ['Prefer CTEs for readability and optimizer hints', 'CTEs let the optimizer materialise intermediate results once; avoid re-computing sub-expressions'],
                  ['Prefer UNION ALL over UNION', 'UNION adds an extra Aggregate node in Query Profile to deduplicate — use UNION ALL unless deduplication is actually required'],
                ].map(([tech, why]) => (
                  <tr key={tech} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-2 border border-slate-200 font-medium text-amber-700">{tech}</td>
                    <td className="p-2 border border-slate-200 text-slate-600">{why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <CodeBlock code={`-- QUALIFY: deduplicate to latest row per customer (no subquery)
SELECT customer_id, order_id, order_date, amount
FROM   orders
QUALIFY ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) = 1;

-- Range filter preserves pruning metadata (good)
WHERE order_date BETWEEN '2024-01-01' AND '2024-01-31'

-- Function on filter column defeats pruning (bad)
WHERE DATE_TRUNC('month', order_date) = '2024-01-01'`} />
        </div>
      ),
    },
    {
      id: 'semistructured',
      icon: '🔵',
      title: 'Semi-Structured Data',
      subtitle: 'VARIANT type · JSON / Avro / Parquet · dot-notation · FLATTEN',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-slate-600">Semi-structured data (JSON, Avro, Parquet, ORC, XML) is loaded into <strong>VARIANT</strong> columns. Snowflake optimizes frequently accessed paths automatically (column-level statistics for paths queried more than 100x).</p>

          {/* Structured vs semi-structured callout */}
          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
              <p className="font-bold text-blue-800 mb-1">🔵 Semi-structured (untyped)</p>
              <p className="text-blue-700 mb-1"><code>VARIANT</code>, <code>ARRAY</code>, <code>OBJECT</code> — values are VARIANT. Can be stored inside other VARIANT/OBJECT/ARRAY.</p>
              <p className="text-blue-600 text-[10px]">Example: <code>ARRAY_CONSTRUCT(1, 'a', NULL)</code></p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200">
              <p className="font-bold text-emerald-800 mb-1">🟢 Structured (typed)</p>
              <p className="text-emerald-700 mb-1"><code>ARRAY(NUMBER)</code>, <code>OBJECT(city VARCHAR)</code>, <code>MAP(VARCHAR, NUMBER)</code> — each element has a declared Snowflake type. <strong>Cannot</strong> be nested inside VARIANT/OBJECT/ARRAY.</p>
              <p className="text-emerald-600 text-[10px]">Example: <code>{'{"a":"b"}'}::MAP(VARCHAR, VARCHAR)</code></p>
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 text-xs">
            <p className="font-bold text-amber-800 mb-1">MAP data type</p>
            <p className="text-amber-700"><code>MAP(key_type, value_type)</code> — typed key-value pairs. Keys must be VARCHAR or INTEGER (not NULL). Cast from an OBJECT constant: <code>{'{"a":"b"}'}::MAP(VARCHAR, VARCHAR)</code>.</p>
          </div>

          <div className="overflow-x-auto mb-2">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Function / Syntax</th>
                  <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Description</th>
                </tr>
              </thead>
              <tbody>
                {SEMI_STRUCTURED_FNS.map(f => (
                  <tr key={f.fn} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-2 border border-slate-200 font-mono text-amber-700 font-bold text-[11px]">{f.fn}</td>
                    <td className="p-2 border border-slate-200 text-slate-600">{f.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <CodeBlock code={`-- Load JSON into VARIANT and query paths
CREATE TABLE events (data VARIANT);

-- Dot notation: access nested JSON
SELECT data:user_id::NUMBER   AS user_id,
       data:event.type::VARCHAR AS event_type,
       data:tags[0]::VARCHAR  AS first_tag
FROM   events;

-- FLATTEN: explode a JSON array into rows
SELECT e.data:user_id::NUMBER AS user_id,
       f.value::VARCHAR        AS tag
FROM   events e,
LATERAL FLATTEN(input => e.data:tags) f;

-- OBJECT_CONSTRUCT: build JSON from columns
SELECT OBJECT_CONSTRUCT(
  'id',    order_id,
  'total', amount
) AS order_json
FROM orders;`} />
        </div>
      ),
    },
    {
      id: 'unstructured',
      icon: '📁',
      title: 'Unstructured Data',
      subtitle: 'Staged files · URL functions · Directory tables',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-slate-600">Unstructured files (PDFs, images, audio, video) are stored in Snowflake stages. Access them via URL functions, directory tables, and UDFs. Typically processed by external services or Snowpark.</p>

          <div className="grid sm:grid-cols-3 gap-3 text-xs mb-2">
            {[
              { fn: 'GET_PRESIGNED_URL(@stage, path)', use: 'Generate a time-limited URL for anonymous external access — no Snowflake auth needed.' },
              { fn: 'BUILD_SCOPED_FILE_URL(@stage, path)', use: 'Role-scoped URL valid for 24 h. Snowflake tracks access. For sharing within Snowflake.' },
              { fn: 'BUILD_STAGE_FILE_URL(@stage, path)', use: 'Permanent URL. Requires USAGE/READ on stage. For custom apps that authenticate themselves.' },
            ].map(u => (
              <div key={u.fn} className="bg-amber-50 rounded-xl p-3 border border-amber-200">
                <p className="font-mono font-bold text-amber-800 text-[10px] mb-1">{u.fn}</p>
                <p className="text-amber-700">{u.use}</p>
              </div>
            ))}
          </div>

          <CodeBlock code={`-- List files in a directory table
SELECT relative_path, size, last_modified
FROM   DIRECTORY(@my_stage)
WHERE  relative_path LIKE '%.pdf';

-- Generate a pre-signed URL for a PDF (no Snowflake auth)
SELECT GET_PRESIGNED_URL(@my_stage, 'reports/q4.pdf', 3600) AS url;

-- Process unstructured files with a Python UDF (Snowpark)
CREATE FUNCTION extract_text(file_url VARCHAR)
  RETURNS VARCHAR
  LANGUAGE PYTHON RUNTIME_VERSION = '3.11'
  PACKAGES = ('snowflake-snowpark-python', 'pypdf2')
  HANDLER = 'extract_text_handler';`} />
        </div>
      ),
    },
    {
      id: 'aggregate',
      icon: '∑',
      title: 'Aggregate Functions',
      subtitle: 'GROUP BY · ROLLUP · CUBE · GROUPING SETS',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-slate-600">Aggregate functions collapse multiple rows into a single result. Snowflake supports standard aggregates plus advanced grouping extensions for multi-level roll-ups.</p>

          <div className="overflow-x-auto mb-2">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Extension</th>
                  <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">What it produces</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['ROLLUP(a, b, c)',        'Subtotals for each prefix: (a,b,c), (a,b), (a), () — hierarchical rollup'],
                  ['CUBE(a, b)',             'All combinations: (a,b), (a), (b), () — cross-dimensional totals'],
                  ['GROUPING SETS((a),(b))', 'Explicit list of groupings — mix any combinations without extras'],
                  ['GROUPING(col)',          'Returns 1 when a NULL in a group-by column is a subtotal (rollup) row, 0 for actual NULL data'],
                  ['GROUPING_ID(a, b, ...)', 'Returns a bitmask integer across multiple columns; useful when CUBE produces many combinations'],
                ].map(([ext, desc]) => (
                  <tr key={ext} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-2 border border-slate-200 font-mono text-amber-700 font-bold text-[11px]">{ext}</td>
                    <td className="p-2 border border-slate-200 text-slate-600">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <CodeBlock code={`-- ROLLUP: sales subtotals by region → country → grand total
SELECT region, country, SUM(amount) AS total
FROM   sales
GROUP  BY ROLLUP(region, country);
-- rows: (region,country), (region,NULL), (NULL,NULL)

-- CUBE: all combinations of region and channel
SELECT region, channel, SUM(amount)
FROM   sales
GROUP  BY CUBE(region, channel);

-- GROUPING SETS: only specific groupings (no extras)
SELECT region, channel, SUM(amount)
FROM   sales
GROUP  BY GROUPING SETS((region), (channel), ());

-- GROUPING(): distinguish subtotal NULLs from real NULLs
SELECT region,
       GROUPING(region)      AS is_subtotal,  -- 1 when NULL is from rollup
       SUM(amount)
FROM   sales
GROUP  BY ROLLUP(region);

-- GROUPING_ID(): bitmask across multiple dimensions (useful with CUBE)
SELECT region, channel,
       GROUPING_ID(region, channel) AS grp_id,
       SUM(amount)
FROM   sales
GROUP  BY CUBE(region, channel);
-- grp_id 0=(region,channel), 1=(region), 2=(channel), 3=grand total`} />
        </div>
      ),
    },
    {
      id: 'window',
      icon: '🪟',
      title: 'Window Functions',
      subtitle: 'OVER() · PARTITION BY · ORDER BY · frame specification',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-slate-600">Window functions compute values across a set of rows (the <em>window</em>) without collapsing them. They are applied after WHERE, GROUP BY, and HAVING, but before ORDER BY. Use the <strong>QUALIFY</strong> clause to filter on window function results.</p>

          <div className="overflow-x-auto mb-2">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Function</th>
                  <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Category</th>
                  <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Description</th>
                </tr>
              </thead>
              <tbody>
                {WINDOW_FNS.map(f => (
                  <tr key={f.fn} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-2 border border-slate-200 font-mono text-amber-700 font-bold text-[11px]">{f.fn}</td>
                    <td className="p-2 border border-slate-200 text-xs">
                      <span className={`px-1.5 py-0.5 rounded font-bold ${
                        f.category === 'Ranking'    ? 'bg-blue-100 text-blue-700' :
                        f.category === 'Navigation' ? 'bg-purple-100 text-purple-700' :
                                                      'bg-amber-100 text-amber-700'
                      }`}>{f.category}</span>
                    </td>
                    <td className="p-2 border border-slate-200 text-slate-600">{f.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <CodeBlock code={`-- RANK vs DENSE_RANK vs ROW_NUMBER
SELECT name, score,
       RANK()        OVER (ORDER BY score DESC) AS rank_gaps,
       DENSE_RANK()  OVER (ORDER BY score DESC) AS rank_no_gaps,
       ROW_NUMBER()  OVER (ORDER BY score DESC) AS row_num
FROM   leaderboard;

-- LAG/LEAD: compare to previous/next row
SELECT order_date, amount,
       LAG(amount,  1, 0) OVER (ORDER BY order_date) AS prev_amount,
       LEAD(amount, 1, 0) OVER (ORDER BY order_date) AS next_amount,
       amount - LAG(amount, 1, 0) OVER (ORDER BY order_date) AS delta
FROM   daily_sales;

-- Running total per customer
SELECT customer_id, order_date, amount,
       SUM(amount) OVER (
         PARTITION BY customer_id
         ORDER BY order_date
         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS running_total
FROM   orders;

-- QUALIFY: keep only the latest order per customer
SELECT customer_id, order_id, amount
FROM   orders
QUALIFY ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) = 1;`} />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <InfoCard>
        <SectionHeader
          icon={GitBranch}
          color="bg-amber-600"
          title="4.4 Data Transformation Techniques"
          subtitle="Structured · Semi-structured · Unstructured · Aggregates · Window functions"
        />
        <div className="space-y-2">
          {sections.map((s, i) => (
            <div key={s.id} className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-4 py-3 text-left bg-slate-50 hover:bg-slate-100 transition-colors"
                onClick={() => setOpenSection(openSection === i ? null : i)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{s.icon}</span>
                  <div>
                    <span className="font-semibold text-slate-700 text-sm">{s.title}</span>
                    <span className="text-xs text-slate-400 ml-2 hidden sm:inline">{s.subtitle}</span>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${openSection === i ? 'rotate-90' : ''}`} />
              </button>
              {openSection === i && (
                <div className="px-4 pb-4 pt-2 bg-white">{s.content}</div>
              )}
            </div>
          ))}
        </div>
      </InfoCard>

      <ExamTip>
        <p>• <strong>VARIANT</strong> is the Snowflake type for untyped semi-structured data. Typed equivalents: <code>ARRAY(type)</code>, <code>OBJECT(col type)</code>, <code>MAP(key, value)</code> — cannot nest typed inside untyped.</p>
        <p>• <strong>LATERAL FLATTEN</strong> explodes a VARIANT array into rows — the most common semi-structured transformation pattern on the exam.</p>
        <p>• <strong>QUALIFY</strong> filters on window function results without a subquery — cleaner and faster than wrapping in a CTE.</p>
        <p>• <strong>RANK</strong> has gaps; <strong>DENSE_RANK</strong> has no gaps; <strong>ROW_NUMBER</strong> is always unique.</p>
        <p>• <strong>ROLLUP</strong> = hierarchical subtotals; <strong>CUBE</strong> = all combinations; <strong>GROUPING SETS</strong> = explicit list. Use <strong>GROUPING()</strong> / <strong>GROUPING_ID()</strong> to detect NULL-subtotal rows.</p>
        <p>• Range filters (BETWEEN) preserve micro-partition pruning. Functions on filter columns (DATE_TRUNC) <strong>defeat pruning</strong>.</p>
        <p>• <strong>UNION ALL</strong> is more efficient than <strong>UNION</strong> — UNION adds an extra Aggregate node to deduplicate. Use UNION ALL unless deduplication is required.</p>
      </ExamTip>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// QUIZ — Data & challenge components
// ═══════════════════════════════════════════════════════════════════════════════

const QUERYEVAL_QUIZ_DATA = [
  {
    q: 'A query runs for 45 seconds but the Query Profile shows almost all time is spent in "Queued" state. What is the most likely cause and fix?',
    options: [
      'The query scans too many partitions — add a clustering key',
      'Too many concurrent queries for the warehouse — enable multi-cluster auto-scaling',
      'The warehouse ran out of memory — scale up the warehouse size',
      'The query has an exploding join — deduplicate join keys',
    ],
    answer: 'Too many concurrent queries for the warehouse — enable multi-cluster auto-scaling',
    exp: 'Queuing appears in the Profile as "Queued" time at the top of the tree. It is a concurrency problem, not a query problem. Multi-cluster warehouses auto-scale to handle concurrent load.',
  },
  {
    q: 'Query Profile shows "Bytes Spilled to Remote Storage" for a large aggregation query. What does this indicate and how should you fix it?',
    options: [
      'Too many micro-partitions are scanned — add a clustering key',
      'The warehouse has insufficient memory; the query spilled to cloud storage — scale up the warehouse',
      'The query has duplicate join keys — deduplicate before joining',
      'The query result cache has expired — re-run after warming the cache',
    ],
    answer: 'The warehouse has insufficient memory; the query spilled to cloud storage — scale up the warehouse',
    exp: 'Spill to remote storage means the warehouse exhausted its local SSD and memory, forcing data to be written to the cloud storage layer — which is very slow. The fix is to scale up to a larger warehouse size.',
  },
  {
    q: 'You notice that partitions_scanned = 980 and partitions_total = 1000 for a query filtering by customer email. What is the best optimization?',
    options: [
      'Scale up the warehouse to reduce spill',
      'Enable the Query Acceleration Service',
      'Add a Search Optimization on the email column for equality lookups',
      'Enable multi-cluster warehouse scaling',
    ],
    answer: 'Add a Search Optimization on the email column for equality lookups',
    exp: 'When nearly all partitions are scanned for an equality filter (email = \'...\'), it means pruning is ineffective. Search Optimization Service builds a specialized access path for equality and IN lookups on high-cardinality columns like email.',
  },
  {
    q: 'Which ACCOUNT_USAGE view would you query to find the top 10 roles consuming the most compute credits in the last 30 days?',
    options: [
      'SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY',
      'SNOWFLAKE.ACCOUNT_USAGE.QUERY_ATTRIBUTION_HISTORY',
      'SNOWFLAKE.ACCOUNT_USAGE.WAREHOUSE_METERING_HISTORY',
      'INFORMATION_SCHEMA.QUERY_HISTORY',
    ],
    answer: 'SNOWFLAKE.ACCOUNT_USAGE.QUERY_ATTRIBUTION_HISTORY',
    exp: 'QUERY_ATTRIBUTION_HISTORY links credit consumption to specific users, roles, warehouses, and query tags — designed for chargeback and workload attribution analysis.',
  },
  {
    q: 'You want to prevent a slow ETL batch from impacting interactive BI queries. What is the recommended approach?',
    options: [
      'Increase the MAX_CLUSTER_COUNT on the existing warehouse',
      'Set a resource monitor on the ETL queries',
      'Group similar workloads on separate dedicated warehouses',
      'Use QUERY_ACCELERATION_MAX_SCALE_FACTOR to throttle the ETL queries',
    ],
    answer: 'Group similar workloads on separate dedicated warehouses',
    exp: 'Workload isolation via dedicated warehouses is the Snowflake best practice. ETL queries run on a large ETL warehouse; BI queries run on a separate auto-scaling BI warehouse. Neither workload can starve the other.',
  },
];

const QUERYOPTIMIZE_QUIZ_DATA = [
  {
    q: 'A data science team runs ad-hoc analytical queries that randomly spike to 10–20× the normal duration. The queries scan a large table with no consistent filter pattern. Which optimization service is the best fit?',
    options: [
      'Add a clustering key on the date column',
      'Enable the Query Acceleration Service on their warehouse',
      'Create a materialized view for the aggregation',
      'Enable Search Optimization on the table',
    ],
    answer: 'Enable the Query Acceleration Service on their warehouse',
    exp: 'QAS is designed for ad-hoc outlier queries with large, unpredictable scans. It offloads portions of the query to a serverless pool without requiring any table-level changes — perfect for data science workloads.',
  },
  {
    q: 'Users frequently query a 10-billion-row fact table with WHERE order_date BETWEEN ... filters. Query Profile shows 95% of micro-partitions are scanned. What is the best optimization?',
    options: [
      'Enable Search Optimization on order_date',
      'Add a clustering key on order_date',
      'Enable the Query Acceleration Service',
      'Create a materialized view filtered by order_date',
    ],
    answer: 'Add a clustering key on order_date',
    exp: 'Range filters on date columns are the textbook use case for clustering keys. Clustering re-organizes micro-partitions so Snowflake can skip entire partition ranges outside the date filter, dramatically reducing partitions_scanned.',
  },
  {
    q: 'Users run repeated equality lookups like WHERE customer_id = \'C12345\' on a 5-billion-row table. The table is clustered by order_date. Which service should you add to improve these lookups?',
    options: [
      'Change the clustering key to customer_id',
      'Enable Search Optimization on customer_id',
      'Enable Query Acceleration Service',
      'Create a materialized view filtered by customer_id',
    ],
    answer: 'Enable Search Optimization on customer_id',
    exp: 'SOS builds a specialized access path for equality and IN predicates without reorganizing the table. It\'s ideal when the table already has a clustering key for range queries, and you need fast point lookups on a different column.',
  },
  {
    q: 'A materialized view is built on a large aggregation query. When is the MV automatically refreshed?',
    options: [
      'On a fixed schedule defined at creation time',
      'Only when ALTER MATERIALIZED VIEW … REFRESH is executed manually',
      'Automatically by Snowflake when the underlying base table data changes',
      'At warehouse start-up time',
    ],
    answer: 'Automatically by Snowflake when the underlying base table data changes',
    exp: 'Snowflake automatically maintains materialized views using serverless background compute. When the base table changes, Snowflake incrementally refreshes the MV without user intervention.',
  },
  {
    q: 'Which DDL statement enables the Search Optimization Service on a specific column of an existing table?',
    options: [
      'CREATE SEARCH OPTIMIZATION ON TABLE orders (customer_id)',
      'ALTER TABLE orders ADD SEARCH OPTIMIZATION ON EQUALITY(customer_id)',
      'ALTER TABLE orders ENABLE SEARCH OPTIMIZATION = TRUE',
      'CREATE INDEX ON orders (customer_id)',
    ],
    answer: 'ALTER TABLE orders ADD SEARCH OPTIMIZATION ON EQUALITY(customer_id)',
    exp: 'The correct syntax is ALTER TABLE … ADD SEARCH OPTIMIZATION ON EQUALITY(column_name). You can target specific columns and predicate types (EQUALITY, SUBSTRING, GEO) to minimize cost.',
  },
];

const CACHING_QUIZ_DATA = [
  {
    q: 'A user runs the same SELECT COUNT(*) FROM orders query twice. The second run completes in under 10ms. Which cache is responsible?',
    options: [
      'Warehouse (local disk) cache — data was loaded into warehouse memory',
      'Metadata cache — row count is stored in Cloud Services metadata',
      'Query result cache — the identical query returned the cached result',
      'Both metadata cache and result cache simultaneously',
    ],
    answer: 'Query result cache — the identical query returned the cached result',
    exp: 'While COUNT(*) CAN use the metadata cache, the question describes re-running the same query — the primary mechanism is the result cache, which returns the stored result instantly. (The metadata cache is used when the result cache is cold.)',
  },
  {
    q: 'A data engineer runs benchmarks and needs to measure actual query execution time, not cached results. How should they disable the result cache?',
    options: [
      'ALTER WAREHOUSE my_wh SET USE_CACHED_RESULT = FALSE',
      'ALTER SESSION SET USE_CACHED_RESULT = FALSE',
      'DROP CACHE FOR SESSION;',
      'Result cache cannot be disabled',
    ],
    answer: 'ALTER SESSION SET USE_CACHED_RESULT = FALSE',
    exp: 'USE_CACHED_RESULT is a session-level parameter. Setting it to FALSE for the session disables result cache usage for that session only, allowing true benchmark measurements.',
  },
  {
    q: 'A warehouse is suspended at night. The next morning, BI queries run noticeably slower for the first few minutes before speeding up. What is causing this?',
    options: [
      'The query result cache expired overnight and must be re-warmed',
      'The warehouse local disk cache is cleared on SUSPEND — first queries re-read from cloud storage',
      'The metadata cache is invalidated when the warehouse is suspended',
      'Snowflake is performing automatic reclustering after resume',
    ],
    answer: 'The warehouse local disk cache is cleared on SUSPEND — first queries re-read from cloud storage',
    exp: 'The warehouse (local disk) cache is stored on the warehouse node SSD and is cleared when the warehouse is suspended. After resume, all reads go to cloud storage until data is cached again — causing the "cold start" slowdown.',
  },
  {
    q: 'Which of the following queries is most likely to be answered entirely from the Metadata cache with NO virtual warehouse credits consumed?',
    options: [
      'SELECT * FROM orders WHERE order_date = CURRENT_DATE',
      'SELECT AVG(amount) FROM orders',
      'SELECT COUNT(*) FROM orders',
      'SELECT customer_id FROM orders WHERE status = \'PENDING\'',
    ],
    answer: 'SELECT COUNT(*) FROM orders',
    exp: 'COUNT(*) is answered from partition row count metadata — no warehouse needed. SELECT * and filtered queries require reading actual data. AVG requires scanning amounts which could have NULLs.',
  },
  {
    q: 'The query result cache has a 24-hour rolling window. What resets the expiry timer?',
    options: [
      'Any new INSERT into the base table',
      'Each time the cached result is served to a query',
      'When the warehouse is resumed',
      'Midnight UTC every day',
    ],
    answer: 'Each time the cached result is served to a query',
    exp: 'The result cache uses a rolling 24-hour window. Every time the cached result is served, the 24-hour timer resets. Frequently-run queries can stay cached indefinitely as long as the data has not changed.',
  },
];

const TRANSFORMATION_QUIZ_DATA = [
  {
    q: 'A JSON column contains: {"user": {"id": 42, "tags": ["admin","read"]}}. How do you extract the first tag?',
    options: [
      'col.user.tags[0]::VARCHAR',
      'col:user:tags[0]::VARCHAR',
      'PARSE_JSON(col):user:tags[0]::VARCHAR',
      'FLATTEN(col:user:tags)[0]',
    ],
    answer: 'col:user:tags[0]::VARCHAR',
    exp: 'In Snowflake VARIANT syntax: colon (:) navigates object keys, bracket notation ([n]) accesses array elements. Cast with ::VARCHAR to get a typed value. PARSE_JSON is needed only if the column is VARCHAR, not already VARIANT.',
  },
  {
    q: 'You need to explode a VARIANT array column (tags ARRAY) into separate rows. Which function should you use?',
    options: [
      'UNNEST(tags)',
      'LATERAL FLATTEN(input => tags)',
      'SPLIT(tags, \',\')',
      'ARRAY_AGG(tags)',
    ],
    answer: 'LATERAL FLATTEN(input => tags)',
    exp: 'LATERAL FLATTEN is Snowflake\'s table function for exploding arrays and nested VARIANT structures into rows. UNNEST is not supported in Snowflake. ARRAY_AGG does the opposite — it aggregates rows into an array.',
  },
  {
    q: 'You want the top 1 latest order per customer. Which approach avoids a subquery and produces the cleanest SQL?',
    options: [
      'SELECT … FROM orders WHERE order_id IN (SELECT MAX(order_id) …)',
      'SELECT … FROM orders QUALIFY ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) = 1',
      'SELECT … FROM orders GROUP BY customer_id HAVING MAX(order_date)',
      'SELECT … FROM (SELECT *, RANK() OVER … FROM orders) WHERE rank = 1',
    ],
    answer: 'SELECT … FROM orders QUALIFY ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) = 1',
    exp: 'QUALIFY is Snowflake\'s clause for filtering window function results inline — no subquery needed. It is evaluated after the window functions, similar to HAVING for aggregates.',
  },
  {
    q: 'Which of these GROUP BY extensions produces ALL combinations of the grouping columns, including grand totals and sub-totals for every dimension combination?',
    options: ['ROLLUP', 'CUBE', 'GROUPING SETS', 'PIVOT'],
    answer: 'CUBE',
    exp: 'CUBE generates all 2^n combinations of the specified grouping columns. ROLLUP only generates hierarchical (prefix) subtotals. GROUPING SETS lets you specify an explicit list. PIVOT reshapes rows to columns.',
  },
  {
    q: 'Three window functions are applied to a sales dataset. Which correctly lists RANK, DENSE_RANK, and ROW_NUMBER behaviors when two rows tie?',
    options: [
      'All three produce the same numbers when there are ties',
      'RANK has gaps after ties; DENSE_RANK has no gaps; ROW_NUMBER is always unique',
      'DENSE_RANK has gaps; RANK has no gaps; ROW_NUMBER resets to 1 on ties',
      'ROW_NUMBER is not deterministic with ties; RANK and DENSE_RANK are identical',
    ],
    answer: 'RANK has gaps after ties; DENSE_RANK has no gaps; ROW_NUMBER is always unique',
    exp: 'With scores 100, 100, 90: RANK = 1,1,3 (gap at 2); DENSE_RANK = 1,1,2 (no gap); ROW_NUMBER = 1,2,3 (always unique, order among ties is arbitrary without a tiebreaker).',
  },
];

const QUIZ_SECTIONS = [
  { id: 'queryeval',      label: 'Evaluate Performance',  emoji: '📊', desc: '4.1 — Query Profile, ACCOUNT_USAGE, workload mgmt' },
  { id: 'queryoptimize',  label: 'Optimize Performance',  emoji: '⚡', desc: '4.2 — QAS, Search Optimization, Clustering, MVs' },
  { id: 'caching',        label: 'Caching',                emoji: '💾', desc: '4.3 — Result, Metadata, Warehouse cache' },
  { id: 'transformation', label: 'Transformation',         emoji: '🔄', desc: '4.4 — Semi-structured, Window fns, Aggregates' },
];

// ── Reusable scenario picker ──────────────────────────────────────────────────
const ScenarioPicker = ({ data, themeColor = 'violet' }) => {
  const [current, setCurrent] = useState(0);
  const [picked,  setPicked]  = useState(null);
  const [score,   setScore]   = useState(0);
  const [history, setHistory] = useState([]);
  const [done,    setDone]    = useState(false);

  const q = data[current];
  const isCorrect = picked === q?.answer;

  const handlePick = useCallback((opt) => {
    if (picked) return;
    const correct = opt === q.answer;
    setPicked(opt);
    if (correct) setScore(s => s + 1);
    setHistory(h => [...h, { ...q, picked: opt, correct }]);
  }, [picked, q]);

  const next  = () => { if (current + 1 >= data.length) setDone(true); else { setCurrent(c => c + 1); setPicked(null); } };
  const reset = () => { setCurrent(0); setPicked(null); setScore(0); setHistory([]); setDone(false); };

  if (done) return (
    <div className="space-y-4">
      <InfoCard className="text-center py-8">
        <p className="text-5xl mb-3">{score / data.length >= 0.9 ? '🎉' : score / data.length >= 0.7 ? '👍' : '📚'}</p>
        <h3 className="text-2xl font-bold text-slate-800 mb-1">Challenge Complete!</h3>
        <p className="text-slate-500 mb-5">
          You scored <span className={`font-bold text-${themeColor}-700 text-xl`}>{score}</span> / {data.length}
        </p>
        <button onClick={reset} className={`bg-${themeColor}-600 hover:bg-${themeColor}-700 text-white font-bold px-8 py-3 rounded-xl`}>Retry</button>
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
                    <p className="text-red-600 mt-0.5">Correct: <span className="font-bold">{h.answer}</span></p></>
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
          <span className="text-sm font-bold text-slate-700">Question {current + 1} of {data.length}</span>
          <span className={`text-xs font-semibold text-${themeColor}-600`}>Score: {score}</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div className={`bg-${themeColor}-500 h-2 rounded-full transition-all duration-500`}
            style={{ width: `${(current / data.length) * 100}%` }} />
        </div>
      </div>

      <InfoCard>
        <p className={`text-[10px] font-bold text-${themeColor}-600 uppercase tracking-wider mb-2`}>Scenario</p>
        <p className="text-base font-semibold text-slate-800 leading-relaxed mb-5">{q.q}</p>

        <div className="space-y-2">
          {q.options.map(opt => {
            const isAnswer = opt === q.answer;
            const isPicked = opt === picked;
            let cls = 'border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50 text-slate-700';
            if (picked) {
              if (isAnswer)      cls = 'border-emerald-400 bg-emerald-50 text-emerald-800 font-bold';
              else if (isPicked) cls = 'border-red-300 bg-red-50 text-red-700 opacity-80';
              else               cls = 'border-slate-100 bg-slate-50 text-slate-300 opacity-40';
            }
            return (
              <button key={opt} disabled={!!picked} onClick={() => handlePick(opt)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm flex items-center gap-3 ${cls}`}>
                <span className="flex-1">{opt}</span>
                {picked && isAnswer   && <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                {picked && isPicked && !isAnswer && <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        {picked && (
          <div className={`mt-4 p-4 rounded-xl border ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
            <p className={`text-sm font-bold mb-1 ${isCorrect ? 'text-emerald-800' : 'text-red-800'}`}>
              {isCorrect ? '✓ Correct!' : `✗ The correct answer is: "${q.answer}"`}
            </p>
            <p className={`text-sm ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>{q.exp}</p>
            <button onClick={next}
              className={`mt-3 bg-${themeColor}-600 hover:bg-${themeColor}-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors`}>
              {current + 1 < data.length ? 'Next →' : 'See Results'}
            </button>
          </div>
        )}
      </InfoCard>
    </div>
  );
};

// ── QuizTab ───────────────────────────────────────────────────────────────────
const QuizTab = () => {
  const [active, setActive] = useState('queryeval');

  return (
    <div className="space-y-4">
      <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <FlaskConical className="w-5 h-5 text-violet-600" />
          <p className="font-bold text-violet-800 text-sm">Domain 4 — Knowledge Checks</p>
        </div>
        <div className="grid sm:grid-cols-4 gap-3">
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

      {active === 'queryeval'      && <ScenarioPicker data={QUERYEVAL_QUIZ_DATA}      themeColor="amber" />}
      {active === 'queryoptimize'  && <ScenarioPicker data={QUERYOPTIMIZE_QUIZ_DATA}  themeColor="violet" />}
      {active === 'caching'        && <ScenarioPicker data={CACHING_QUIZ_DATA}        themeColor="blue" />}
      {active === 'transformation' && <ScenarioPicker data={TRANSFORMATION_QUIZ_DATA} themeColor="violet" />}
    </div>
  );
};

export default Domain4_Performance;
