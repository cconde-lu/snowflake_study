import React, { useState } from 'react';
import { RefreshCw, ChevronLeft } from 'lucide-react';

// ─── Daily seed ───────────────────────────────────────────────────────────────
const getDailySeed = () => {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
};

const seededShuffle = (arr, seed) => {
  const a = [...arr];
  let s = seed >>> 0;
  for (let i = a.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const TODAY_LABEL = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const DAILY_SEED  = getDailySeed();

// ─── Quick Recall Data ────────────────────────────────────────────────────────
const RECALL_DATA = [
  { id: 'a1', cat: 'Architecture', q: "What are Snowflake's 3 layers?", a: "Cloud Services (auth, optimization, metadata) | Compute (virtual warehouses) | Storage (micro-partitions)" },
  { id: 'a2', cat: 'Architecture', q: "What does the Cloud Services layer do?", a: "Authentication, query parsing/optimization, metadata management, access control, result cache." },
  { id: 'a3', cat: 'Architecture', q: "What does the Compute layer do?", a: "Executes queries via virtual warehouses. Local SSD cache lives here." },
  { id: 'a4', cat: 'Architecture', q: "What does the Storage layer do?", a: "Stores data as immutable, columnar micro-partitions. 50–500 MB uncompressed. Auto-managed." },
  { id: 'a5', cat: 'Architecture', q: "What is a micro-partition?", a: "Immutable, columnar storage unit. 50–500 MB uncompressed. Auto-managed. Stores min/max/null/distinct metadata." },
  { id: 'a6', cat: 'Architecture', q: "What is a virtual warehouse?", a: "Named compute cluster. Billed per-second (60s min). XS=1, S=2, M=4, L=8, XL=16 credits/hr." },
  { id: 'a7', cat: 'Architecture', q: "What is a Snowpark-optimized warehouse?", a: "16× more memory per node. For ML training, large UDFs, memory-intensive Snowpark operations." },
  { id: 'a8', cat: 'Architecture', q: "What is AUTO_SUSPEND = 0?", a: "NEVER auto-suspend. NOT 'suspend immediately' — it disables auto-suspend entirely." },
  { id: 'o1', cat: 'Objects', q: "What is a file format?", a: "Named, reusable set of parse options: TYPE, DELIMITER, SKIP_HEADER, etc." },
  { id: 'o2', cat: 'Objects', q: "What are the stage types?", a: "User (@~), Table (@%tbl), Named internal (@stg_name), Named external (@ext_stg)." },
  { id: 'o3', cat: 'Objects', q: "What is a pipe?", a: "Defines a COPY INTO for Snowpipe. Serverless. Triggered by cloud events or REST API." },
  { id: 'o4', cat: 'Objects', q: "What is a stream?", a: "Change tracking on a table/view. Records INSERT/UPDATE/DELETE. Offset advances after DML consumption." },
  { id: 'o5', cat: 'Objects', q: "What is a task?", a: "Scheduled SQL execution. Root task has SCHEDULE. Child tasks triggered by predecessors (DAG)." },
  { id: 'o6', cat: 'Objects', q: "What is a sequence?", a: "Generates unique values. NOT gap-free. NOT ordered across sessions." },
  { id: 'o7', cat: 'Objects', q: "What is a dynamic table?", a: "Table defined by SELECT + TARGET_LAG. Supports JOINs. Auto-maintained by Snowflake." },
  { id: 'o8', cat: 'Objects', q: "What is a PRIMARY KEY in Snowflake?", a: "Informational/metadata ONLY. NOT enforced. Does NOT prevent duplicates." },
  { id: 't1', cat: 'Table & View Types', q: "Permanent table: Time Travel & Fail-safe?", a: "Time Travel: 0–90 days (Enterprise+) or 0–1 day (Standard). Fail-safe: 7 days." },
  { id: 't2', cat: 'Table & View Types', q: "Transient table: Time Travel & Fail-safe?", a: "Time Travel: 0–1 day. Fail-safe: 0 days. All editions." },
  { id: 't3', cat: 'Table & View Types', q: "Temporary table: scope & retention?", a: "Session-scoped only. Time Travel: 0–1 day. Fail-safe: 0 days. Dropped at session end." },
  { id: 't4', cat: 'Table & View Types', q: "External table: Time Travel & Fail-safe?", a: "N/A — read-only, points to cloud storage. No Time Travel or Fail-safe." },
  { id: 't5', cat: 'Table & View Types', q: "What is a Materialized View?", a: "Pre-computed query result. ONE table only. No JOINs. Auto-refresh (serverless). Enterprise+." },
  { id: 't6', cat: 'Table & View Types', q: "What is a Secure View?", a: "Hides query definition from non-privileged users. Required for Secure Data Sharing." },
  { id: 't7', cat: 'Table & View Types', q: "What is a Standard View?", a: "Saved SQL query. Definition is visible to all users with GRANT." },
  { id: 's1', cat: 'Security', q: "What does USERADMIN do?", a: "Creates and manages users AND roles. Grants roles to users." },
  { id: 's2', cat: 'Security', q: "What does SECURITYADMIN do?", a: "Everything USERADMIN + object-level grants (GRANT SELECT, GRANT USAGE, etc.)." },
  { id: 's3', cat: 'Security', q: "What does SYSADMIN do?", a: "Creates databases, warehouses, schemas, and other named objects." },
  { id: 's4', cat: 'Security', q: "What does ACCOUNTADMIN do?", a: "Everything + billing, resource monitors, account-level settings. Top of role hierarchy." },
  { id: 's5', cat: 'Security', q: "What does ORGADMIN do?", a: "Organization-level only: create accounts, view org usage. NOT account-level admin." },
  { id: 's6', cat: 'Security', q: "What is DAC?", a: "Discretionary Access Control. Each object has an owner who controls access grants." },
  { id: 's7', cat: 'Security', q: "What is a managed access schema?", a: "Only schema owner + MANAGE GRANTS privilege holders can grant. Object owners CANNOT." },
  { id: 's8', cat: 'Security', q: "What encryption does Snowflake use?", a: "AES-256 at rest + TLS 1.2 in transit. All editions. Tri-Secret Secure (CMK) = Business Critical+." },
  { id: 'd1', cat: 'Data Loading', q: "Default ON_ERROR for bulk COPY INTO?", a: "ABORT_STATEMENT — stops the entire load on the first error." },
  { id: 'd2', cat: 'Data Loading', q: "Default ON_ERROR for Snowpipe?", a: "SKIP_FILE — skips the failing file and continues." },
  { id: 'd3', cat: 'Data Loading', q: "COPY metadata retention period?", a: "64 days — tracks which files have already been loaded (dedup window)." },
  { id: 'd4', cat: 'Data Loading', q: "Snowpipe metadata retention period?", a: "14 days." },
  { id: 'd5', cat: 'Data Loading', q: "What does VALIDATION_MODE do in COPY INTO?", a: "Dry-run: validates files and returns errors. Loads NO data." },
  { id: 'd6', cat: 'Data Loading', q: "What does FORCE = TRUE do in COPY INTO?", a: "Bypasses dedup metadata — reloads already-loaded files. Risk: duplicates." },
  { id: 'd7', cat: 'Data Loading', q: "What does PURGE = TRUE do in COPY INTO?", a: "Deletes source files from the stage after a successful load." },
  { id: 'd8', cat: 'Data Loading', q: "What does MATCH_BY_COLUMN_NAME do?", a: "Maps source columns to target by name, not by position." },
  { id: 'd9', cat: 'Data Loading', q: "What does TRUNCATECOLUMNS do?", a: "Truncates oversized string values to fit the target column instead of erroring." },
  { id: 'd10', cat: 'Data Loading', q: "PUT command: where does it upload?", a: "Internal stages ONLY. Auto-gzips. Requires local filesystem — not available in Snowsight." },
  { id: 'd11', cat: 'Data Loading', q: "GET command: what does it do?", a: "Downloads files from internal stages to local filesystem." },
  { id: 'p1', cat: 'Performance', q: "What is the result cache?", a: "Cloud Services layer. 24-hour TTL. No warehouse needed. Invalidated by DML. Role-specific with masking policies." },
  { id: 'p2', cat: 'Performance', q: "What is the SSD (warehouse) cache?", a: "Local disk on warehouse nodes. Holds recently read micro-partition data. Wiped on suspend." },
  { id: 'p3', cat: 'Performance', q: "What is the metadata cache?", a: "Cloud Services layer. Always on. Row counts, min/max. Powers COUNT(*) without a running warehouse." },
  { id: 'p4', cat: 'Performance', q: "When to use a CLUSTERING KEY?", a: "Range/equality filters on large tables with low-medium cardinality columns. Lowest cardinality first." },
  { id: 'p5', cat: 'Performance', q: "When to use Search Optimization Service (SOS)?", a: "Equality/IN point lookups on HIGH cardinality columns. Creates search access paths." },
  { id: 'p6', cat: 'Performance', q: "When to use Query Acceleration Service (QAS)?", a: "Outlier queries using 10–100× more resources than typical queries." },
  { id: 'p7', cat: 'Performance', q: "Scale UP vs Scale OUT?", a: "UP = bigger warehouse for a single complex query. OUT = more clusters for many concurrent users queuing." },
  { id: 'p8', cat: 'Performance', q: "Multi-cluster STANDARD vs ECONOMY policy?", a: "STANDARD: adds cluster immediately. ECONOMY: waits ~6 min to confirm sustained load." },
  { id: 'sh1', cat: 'Sharing', q: "Direct Share scope?", a: "Same region + cloud provider only. Zero-copy. Consumers get read-only access." },
  { id: 'sh2', cat: 'Sharing', q: "Marketplace Listing scope?", a: "Cross-region (via Auto-Fulfillment replication). Supports free and paid monetization." },
  { id: 'sh3', cat: 'Sharing', q: "What can be shared directly?", a: "Tables, secure views, secure UDFs, external tables." },
  { id: 'sh4', cat: 'Sharing', q: "What CANNOT be shared directly?", a: "Standard views, stored procedures, warehouses, stages." },
  { id: 'sh5', cat: 'Sharing', q: "What is a Reader Account?", a: "Managed Snowflake account for consumers without Snowflake. Provider pays compute. CAN create DBs/warehouses." },
  { id: 'sh6', cat: 'Sharing', q: "What happens when a share is revoked?", a: "Consumer's DB becomes an empty shell — objects are inaccessible but the DB container still exists." },
  { id: 'sh7', cat: 'Sharing', q: "What is the IMPORT SHARE privilege?", a: "Required for a user to view and install Snowflake Marketplace listings." },
];

const RECALL_CATS    = [...new Set(RECALL_DATA.map(r => r.cat))];
const DAILY_RECALL_IDS = new Set(
  seededShuffle(RECALL_DATA, DAILY_SEED).slice(0, 15).map(r => r.id)
);

// ─── Numbers Data ─────────────────────────────────────────────────────────────
const WAREHOUSE_TABLE = [
  { size: 'XS', credits: 1 },  { size: 'S',   credits: 2 },
  { size: 'M',  credits: 4 },  { size: 'L',   credits: 8 },
  { size: 'XL', credits: 16 }, { size: '2XL', credits: 32 },
  { size: '3XL', credits: 64 }, { size: '4XL', credits: 128 },
];

const RETENTION_ROWS = [
  { label: 'Bulk COPY metadata',                        val: '64 days' },
  { label: 'Snowpipe metadata',                         val: '14 days' },
  { label: 'Result cache',                              val: '24 hours' },
  { label: 'Time Travel – Standard Edition (permanent)',val: '0–1 day' },
  { label: 'Time Travel – Enterprise+ (permanent)',     val: '0–90 days' },
  { label: 'Time Travel – Transient / Temporary',       val: '0–1 day' },
  { label: 'Fail-safe – Permanent',                     val: '7 days' },
  { label: 'Fail-safe – Transient / Temporary',         val: '0 days' },
  { label: 'ACCOUNT_USAGE latency',                     val: '45 min – 3 hrs' },
  { label: 'ACCOUNT_USAGE retention',                   val: '365 days' },
  { label: 'INFORMATION_SCHEMA retention',              val: '7–14 days' },
  { label: 'MAX_DATA_EXTENSION_TIME default',           val: '14 days' },
];

const EDITION_ROWS = [
  { feature: 'Multi-cluster warehouses',     edition: 'Enterprise' },
  { feature: 'Time Travel 2–90 days',        edition: 'Enterprise' },
  { feature: 'Materialized Views',           edition: 'Enterprise' },
  { feature: 'Dynamic Data Masking',         edition: 'Enterprise' },
  { feature: 'Column-level Security',        edition: 'Enterprise' },
  { feature: 'Search Optimization Service', edition: 'Enterprise' },
  { feature: 'Tri-Secret Secure (CMK)',      edition: 'Business Critical' },
  { feature: 'PrivateLink',                  edition: 'Business Critical' },
  { feature: 'HIPAA/PHI compliance',         edition: 'Business Critical' },
  { feature: 'Data sharing via Support only',edition: 'VPS' },
];

const NUMBERS_QUIZ = [
  { id: 'n1',  q: 'S (Small) warehouse credits/hour?',               a: '2' },
  { id: 'n2',  q: 'M (Medium) warehouse credits/hour?',              a: '4' },
  { id: 'n3',  q: 'L (Large) warehouse credits/hour?',               a: '8' },
  { id: 'n4',  q: 'XL warehouse credits/hour?',                      a: '16' },
  { id: 'n5',  q: '2XL warehouse credits/hour?',                     a: '32' },
  { id: 'n6',  q: '3XL warehouse credits/hour?',                     a: '64' },
  { id: 'n7',  q: '4XL warehouse credits/hour?',                     a: '128' },
  { id: 'n8',  q: 'Bulk COPY metadata retention?',                   a: '64 days' },
  { id: 'n9',  q: 'Snowpipe metadata retention?',                    a: '14 days' },
  { id: 'n10', q: 'Result cache duration?',                          a: '24 hours' },
  { id: 'n11', q: 'Fail-safe for permanent tables?',                 a: '7 days' },
  { id: 'n12', q: 'Fail-safe for transient tables?',                 a: '0 days' },
  { id: 'n13', q: 'Max Time Travel on Enterprise+ permanent table?', a: '90 days' },
  { id: 'n14', q: 'ACCOUNT_USAGE data retention?',                   a: '365 days' },
  { id: 'n15', q: 'ACCOUNT_USAGE latency?',                          a: '45 min – 3 hours' },
  { id: 'n16', q: 'MAX_DATA_EXTENSION_TIME default?',                a: '14 days' },
  { id: 'n17', q: 'Minimum billing per warehouse resume?',           a: '60 seconds' },
  { id: 'n18', q: 'Total protection: 10-day TT + permanent fail-safe?', a: '17 days (10 + 7)' },
  { id: 'n19', q: 'Default ON_ERROR for bulk COPY INTO?',            a: 'ABORT_STATEMENT' },
  { id: 'n20', q: 'Default ON_ERROR for Snowpipe?',                  a: 'SKIP_FILE' },
  { id: 'n21', q: 'Micro-partition uncompressed size range?',        a: '50–500 MB' },
  { id: 'n22', q: 'Snowpark-optimized warehouse memory multiplier?', a: '16× more memory per node' },
  { id: 'n23', q: 'Minimum edition for Dynamic Data Masking?',       a: 'Enterprise' },
  { id: 'n24', q: 'Minimum edition for Multi-cluster warehouses?',   a: 'Enterprise' },
  { id: 'n25', q: 'Minimum edition for Tri-Secret Secure?',         a: 'Business Critical' },
];

const DAILY_QUIZ = seededShuffle(NUMBERS_QUIZ, DAILY_SEED).slice(0, 10);

// ─── Optimizer Data ───────────────────────────────────────────────────────────
const TOOLS = [
  { id: 'CLUSTERING',    label: '🗂 Clustering Key',          bg: 'bg-blue-600',   light: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-700' },
  { id: 'SOS',           label: '🔍 Search Optimization',     bg: 'bg-violet-600', light: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700' },
  { id: 'QAS',           label: '⚡ Query Acceleration',       bg: 'bg-amber-600',  light: 'bg-amber-50',  border: 'border-amber-200',  text: 'text-amber-700' },
  { id: 'MV',            label: '📋 Materialized View',        bg: 'bg-teal-600',   light: 'bg-teal-50',   border: 'border-teal-200',   text: 'text-teal-700' },
  { id: 'DYNAMIC_TABLE', label: '🔄 Dynamic Table',            bg: 'bg-emerald-600',light: 'bg-emerald-50',border: 'border-emerald-200',text: 'text-emerald-700' },
  { id: 'SCALE_OUT',     label: '↔️ Scale Out',               bg: 'bg-indigo-600', light: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700' },
  { id: 'SCALE_UP',      label: '⬆️ Scale Up',                bg: 'bg-orange-600', light: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
  { id: 'DO_NOTHING',    label: '✅ Do Nothing',               bg: 'bg-slate-600',  light: 'bg-slate-50',  border: 'border-slate-200',  text: 'text-slate-700' },
];

const TOOL_MAP = Object.fromEntries(TOOLS.map(t => [t.id, t]));

const SCENARIOS = [
  {
    id: 1, title: 'E-Commerce Orders Table',
    context: [
      'Table: ORDERS (50 billion rows)',
      "Query: WHERE order_date BETWEEN '2026-01-01' AND '2026-01-31'",
      'Frequency: Hundreds of times/day by BI dashboards',
      'Cardinality: order_date has 3,650 distinct values (10 years of dates)',
      'Current state: No clustering. Query profile shows 95% of partitions scanned.',
    ],
    answer: 'CLUSTERING',
    hint: 'Look at the filter type (range vs equality) and column cardinality.',
    why: [
      'Range filter (BETWEEN) on a date column = classic clustering use case',
      'Low-to-medium cardinality (3,650 values) = ideal for clustering',
      '95% partitions scanned = terrible pruning — clustering will fix this',
      'NOT SOS: SOS is for equality lookups (= exact value), not range scans',
      'NOT QAS: QAS helps outlier queries, not a high-frequency repeated BI pattern',
    ],
  },
  {
    id: 2, title: 'Customer Lookup Service',
    context: [
      'Table: CUSTOMERS (500 million rows)',
      "Query: WHERE customer_id = 'C-9283847'",
      'Frequency: Thousands of point lookups per minute from an API',
      'Cardinality: customer_id has 500 million distinct values (unique per row)',
      'Current state: Has clustering on region. Full scan on customer_id lookups.',
    ],
    answer: 'SOS',
    hint: 'Focus on the filter type (equality vs range) and the extreme cardinality.',
    why: [
      'Equality lookup (= single value) on VERY high cardinality (unique per row)',
      'SOS creates search access paths specifically for this pattern',
      'NOT clustering: Clustering on a unique column is expensive and inefficient',
      'NOT QAS: QAS offloads scan portions, but SOS avoids the scan entirely',
      'Keep the region clustering. ADD SOS for customer_id.',
    ],
  },
  {
    id: 3, title: 'Ad-Hoc Analyst Queries',
    context: [
      'Table: TRANSACTIONS (10 TB, already well-clustered on transaction_date)',
      'Query pattern: Unpredictable — diverse queries scanning up to 80% of the table',
      'Frequency: Sporadic, but when they run, they are 10–100× larger than typical',
      'Current state: Most queries finish in seconds. A few take 30+ minutes.',
    ],
    answer: 'QAS',
    hint: 'The key clue is "10–100× larger than typical" and the table is already well-clustered.',
    why: [
      'Outlier queries using much more resources than typical = QAS sweet spot',
      'QAS offloads large scan portions to serverless compute',
      'Table is already well-clustered — more clustering improvements are not possible',
      'NOT SOS: Queries are large scans, not equality point lookups',
      'NOT MV: Queries are unpredictable — cannot pre-compute every pattern',
      'QAS only activates for eligible queries — you only pay when outliers run',
    ],
  },
  {
    id: 4, title: 'Executive Dashboard',
    context: [
      'Tables: SALES (1B rows), PRODUCTS (10K rows), REGIONS (50 rows)',
      'Query: SELECT region, SUM(revenue) FROM sales JOIN products JOIN regions GROUP BY region',
      'Frequency: Every 5 minutes by an auto-refreshing dashboard',
      'Current state: Query takes 45 seconds each run. Same result until new data arrives.',
    ],
    answer: 'DYNAMIC_TABLE',
    hint: 'Watch for JOINs across multiple tables — this is the key differentiator from MV.',
    why: [
      'Complex aggregation with JOINs across 3 tables = MV CANNOT do this (single table only)',
      'Dynamic Table supports JOINs and complex transformations',
      'Set TARGET_LAG = 5 minutes to match the refresh need',
      'NOT MV: Materialized Views do NOT support JOINs — single table only',
      'NOT QAS: Runs every 5 min (not an outlier), results are always pre-computable',
    ],
  },
  {
    id: 5, title: 'Monthly Revenue Summary',
    context: [
      'Table: INVOICES (2 billion rows)',
      'Query: SELECT MONTH(invoice_date), SUM(amount) FROM invoices GROUP BY 1',
      'Frequency: Run by 5 different reports — identical query each time',
      'Current state: Takes 2 minutes. Same result until month-end close.',
    ],
    answer: 'MV',
    hint: "The query is on a single table, it's an aggregation, and the exact same query runs repeatedly.",
    why: [
      'Single table, aggregation query, run repeatedly = textbook MV use case',
      'MV pre-computes once — all 5 reports read the fast pre-computed result',
      'MV auto-refreshes serverlessly when base data changes',
      'NOT Dynamic Table: MV is simpler and cheaper for single-table aggregations',
      'NOT QAS: QAS speeds the query but MV eliminates the compute entirely',
    ],
  },
  {
    id: 6, title: '200 BI Users at 9 AM',
    context: [
      'Warehouse: Medium, single-cluster',
      'Situation: 200 analysts open dashboards simultaneously every morning at 9 AM',
      'Query profile: Individual queries are fast (2–3 seconds). Queue wait reaches 60+ seconds.',
      'Current state: AUTO_SUSPEND = 300, AUTO_RESUME = TRUE, single cluster.',
    ],
    answer: 'SCALE_OUT',
    hint: 'Individual queries are already fast. The problem is too many users at the same time.',
    why: [
      'Problem is CONCURRENCY (200 users), not individual query complexity',
      'Queuing = not enough threads — warehouse SIZE is already fine',
      'Set MAX_CLUSTER_COUNT = 3–5, SCALING_POLICY = STANDARD',
      'STANDARD adds clusters immediately on queuing (ECONOMY waits ~6 min)',
      'NOT scale up: Bigger warehouse helps single query speed, not concurrency',
      'NOT QAS: QAS helps individual outlier queries, not queue depth',
    ],
  },
  {
    id: 7, title: 'Complex ETL Transformation',
    context: [
      'Warehouse: Small',
      'Query: Single query with 12 JOINs, 5 subqueries, window functions',
      'Duration: 45 minutes on a Small warehouse',
      'Query profile: Spilling to REMOTE storage. No queuing — only 1 user runs this.',
    ],
    answer: 'SCALE_UP',
    hint: 'Single query, spilling to remote storage, no concurrency — those three signals together.',
    why: [
      'Single complex query, no concurrency issue',
      'Spilling to REMOTE storage = severe memory exhaustion — needs more memory/SSD',
      'Scale up from Small to Large or X-Large provides 4–8× more resources',
      'NOT scale out: Only 1 user, no queuing — multi-cluster will not help',
      'NOT QAS: Root cause is insufficient memory (spilling), not an outlier query pattern',
    ],
  },
  {
    id: 8, title: 'Multi-Column Filter',
    context: [
      'Table: EVENTS (20 billion rows)',
      "Query: WHERE region = 'US' AND event_date BETWEEN '2026-01-01' AND '2026-03-31'",
      'Cardinality: region has 8 values, event_date has 3,650 values',
      'Current state: No clustering. Query scans 90% of partitions.',
    ],
    answer: 'CLUSTERING',
    hint: 'Multi-column range filter with different cardinalities — watch the column ORDER.',
    why: [
      'Multi-column filter with range scan = clustering key',
      'region (8 values) = LOWER cardinality → put it FIRST in the key',
      'event_date (3,650 values) = HIGHER cardinality → put it SECOND',
      'Correct key: CLUSTER BY (region, event_date)',
      'NOT (event_date, region): Less effective for region-only filter queries',
    ],
  },
  {
    id: 9, title: 'Variant JSON Text Search',
    context: [
      'Table: PRODUCTS (10 million rows, VARIANT column with JSON)',
      "Query: WHERE data:description::VARCHAR LIKE '%wireless%'",
      'Frequency: Customer-facing search API, hundreds of requests per second',
      'Current state: Full table scan every time. Very slow.',
    ],
    answer: 'SOS',
    hint: "A LIKE with a leading wildcard on semi-structured data — clustering can't help here.",
    why: [
      'SOS supports SUBSTRING/LIKE predicates on VARIANT paths (not just equality)',
      'High-frequency API search needs low-latency, not full table scans',
      "NOT clustering: LIKE with leading wildcard (%) cannot be pruned by clustering",
      'NOT MV: Cannot pre-compute every possible search term',
      'SOS builds access paths that handle LIKE/substring on VARIANT fields',
      'For full-text semantic search, consider Cortex Search as an alternative',
    ],
  },
  {
    id: 10, title: 'The Trick Question',
    context: [
      'Table: DAILY_METRICS (1 million rows — tiny table)',
      'Query: SELECT AVG(metric_value) FROM daily_metrics WHERE date = CURRENT_DATE()',
      'Duration: 150 milliseconds',
      'User complaint: "Can we make this faster?"',
    ],
    answer: 'DO_NOTHING',
    hint: 'Check the query duration and table size before reaching for any optimization tool.',
    why: [
      '150ms for 1M rows is excellent — the query is already fast',
      'EXAM TRAP: Not every query needs optimization. Every tool has ongoing costs.',
      'Clustering uses serverless credits, SOS uses storage, MVs have refresh costs',
      'Rule of thumb: Under 1 second on a small table — leave it alone',
      'The real exam includes "do nothing" as the correct answer',
    ],
  },
];

// ─── Decision Tree ────────────────────────────────────────────────────────────
const TREE = {
  root: {
    q: "Why is the query slow (or what is the performance problem)?",
    crumb: 'Start',
    options: [
      { label: '🔍 Too many micro-partitions scanned — poor data pruning', next: 'pruning' },
      { label: '⚡ Single outlier query using 10–100× more resources than typical', next: 'qas' },
      { label: '🔄 Same complex query repeats with identical results', next: 'repeated' },
      { label: '👥 Many concurrent users queuing — not individual query speed', next: 'scale_out' },
      { label: '💾 Single query spilling to remote storage (memory exhausted)', next: 'scale_up' },
      { label: '✅ The query is already fast (under 1 second)', next: 'nothing' },
    ],
  },
  pruning: {
    q: "What is the filter pattern and column cardinality?",
    crumb: 'Poor pruning',
    options: [
      { label: '📅 Range filter (BETWEEN, >, <) on dates/regions — low/medium cardinality', next: 'ans_clustering' },
      { label: '🎯 Equality (= exact value) on very high cardinality column (IDs, UUIDs)', next: 'ans_sos_eq' },
      { label: "📝 LIKE / substring search on text or VARIANT (JSON) fields", next: 'ans_sos_sub' },
    ],
  },
  repeated: {
    q: "What is the query structure?",
    crumb: 'Repeated query',
    options: [
      { label: '📊 Single table only — aggregation (SUM, COUNT, GROUP BY). No JOINs.', next: 'ans_mv' },
      { label: '🔗 Multiple tables with JOINs, or a complex transformation pipeline', next: 'ans_dt' },
    ],
  },
  ans_clustering: {
    type: 'answer', toolId: 'CLUSTERING',
    crumb: 'Clustering Key',
    summary: 'Add a clustering key on the low/medium cardinality filter column. For multi-column keys, put the LOWEST cardinality column first.',
    when: [
      'Range filter (BETWEEN, >, <) on date / region / status columns',
      'Column cardinality: hundreds to tens of thousands of distinct values',
      'Query profile shows high % of micro-partitions scanned (poor pruning)',
      'Query runs frequently enough to justify automatic reclustering cost',
    ],
    notWhen: [
      'High cardinality unique columns (IDs, UUIDs) → use SOS EQUALITY instead',
      "LIKE with leading wildcard → SOS SUBSTRING handles this, clustering cannot",
      'Table is small (< 1M rows) — Snowflake handles it natively without clustering',
    ],
  },
  ans_sos_eq: {
    type: 'answer', toolId: 'SOS',
    crumb: 'SOS — Equality',
    summary: 'Enable Search Optimization Service with EQUALITY() on the high-cardinality column. Builds search access paths to skip full table scans on point lookups.',
    when: [
      'Equality lookup (WHERE col = value) on unique or near-unique columns',
      'Very high cardinality: millions or billions of distinct values',
      'High-frequency API lookups (customer IDs, order IDs, UUIDs)',
    ],
    notWhen: [
      'Range queries (BETWEEN, >, <) → use Clustering Key instead',
      'Low/medium cardinality columns → clustering is more efficient and cheaper',
    ],
  },
  ans_sos_sub: {
    type: 'answer', toolId: 'SOS',
    crumb: 'SOS — Substring',
    summary: "Enable Search Optimization Service with SUBSTRING() on the text or VARIANT path. Handles LIKE predicates with leading wildcards that clustering cannot optimize.",
    when: [
      "LIKE with leading wildcard (e.g., LIKE '%wireless%')",
      'Substring search on text columns or VARIANT/JSON path fields',
      'High-frequency customer-facing search APIs (product search, autocomplete)',
    ],
    notWhen: [
      "LIKE without leading wildcard (e.g., LIKE 'wire%') → clustering may help",
      'Full-text/semantic search → consider Cortex Search instead',
    ],
  },
  qas: {
    type: 'answer', toolId: 'QAS',
    crumb: 'QAS',
    summary: 'Enable Query Acceleration Service on the warehouse. It auto-detects eligible outlier queries and offloads large scan portions to serverless compute — you only pay when it activates.',
    when: [
      'Individual queries using 10–100× more resources than typical (outliers)',
      'Unpredictable / ad-hoc analyst queries on large tables',
      'Table is already well-clustered — no further pruning improvements possible',
    ],
    notWhen: [
      'Concurrency queuing from many users → Scale Out instead',
      'Memory spilling on a single query → Scale Up first',
      'Repeated identical queries → MV or Dynamic Table is cheaper',
    ],
  },
  ans_mv: {
    type: 'answer', toolId: 'MV',
    crumb: 'Materialized View',
    summary: 'Create a Materialized View on the single-table aggregation. Snowflake auto-refreshes it serverlessly when base data changes — all reads become sub-second.',
    when: [
      'Single base table only — no JOINs (this is an absolute constraint)',
      'Same aggregation (SUM, COUNT, GROUP BY) runs repeatedly by multiple consumers',
      'Result data changes infrequently (batch loads, not real-time)',
      'Enterprise edition or higher required',
    ],
    notWhen: [
      'Query involves JOINs across multiple tables → use Dynamic Table instead',
      'Unpredictable / ad-hoc queries — result cannot be pre-computed',
    ],
  },
  ans_dt: {
    type: 'answer', toolId: 'DYNAMIC_TABLE',
    crumb: 'Dynamic Table',
    summary: 'Create a Dynamic Table with the desired TARGET_LAG. Supports JOINs, CTEs, window functions. Snowflake auto-maintains the entire pipeline.',
    when: [
      'Query involves JOINs across multiple tables',
      'Complex transformation logic (CTEs, window functions, multi-step pipelines)',
      "Need a defined freshness SLA (e.g., TARGET_LAG = '5 minutes')",
      'Replacing brittle Streams + Tasks pipelines with a declarative model',
    ],
    notWhen: [
      'Single-table aggregation, no JOINs → Materialized View is simpler and cheaper',
      'Real-time (millisecond) freshness → Dynamic Table has a minimum lag constraint',
    ],
  },
  scale_out: {
    type: 'answer', toolId: 'SCALE_OUT',
    crumb: 'Scale Out',
    summary: 'Enable multi-cluster warehousing. Individual queries are already fast — you need more concurrent capacity. Use STANDARD scaling policy for immediate cluster spin-up on queuing.',
    when: [
      'Many concurrent users queuing — queue wait time exceeds individual query time',
      'Individual queries are fast (seconds) but wait time is unacceptable',
      'Morning / end-of-day peak usage patterns',
      'STANDARD scaling adds a cluster immediately when queuing starts',
    ],
    notWhen: [
      'Single slow query → Scale Up instead',
      'Outlier queries → QAS instead',
      'ECONOMY scaling: waits ~6 min before adding cluster — bad for sharp morning spikes',
    ],
  },
  scale_up: {
    type: 'answer', toolId: 'SCALE_UP',
    crumb: 'Scale Up',
    summary: 'Increase the warehouse size (e.g., Small → Large or X-Large). More memory and local SSD eliminates spilling to remote storage and dramatically reduces query time.',
    when: [
      'Query profile shows spilling to LOCAL or REMOTE storage',
      'Single complex query (many JOINs, window functions, heavy subqueries)',
      'No concurrency issue — just one slow query at a time',
    ],
    notWhen: [
      'Multiple users queuing → Scale Out instead',
      'Poor pruning on large table → Clustering Key is more cost-effective',
      'Outlier among otherwise fast queries → QAS may be cheaper than a permanent size increase',
    ],
  },
  nothing: {
    type: 'answer', toolId: 'DO_NOTHING',
    crumb: 'Do Nothing',
    summary: "The query is already performing well. Every optimization tool has ongoing maintenance costs (credits, storage). Applying them here would cost more than it saves.",
    when: [
      'Query completes in under 1 second',
      'Table is small (millions of rows or fewer)',
      '"Slow" is user perception, not an objective measured performance issue',
    ],
    notWhen: [
      '30+ minute queries on large tables always warrant investigation',
      'Spilling to remote storage is always worth fixing',
      'Do not confuse "acceptable today" with "will be acceptable at 10× data volume"',
    ],
  },
};

// ─── Quick Recall Tab ─────────────────────────────────────────────────────────
const QuickRecallTab = () => {
  const [filter,   setFilter]   = useState('today');
  const [revealed, setRevealed] = useState(new Set());
  const [marks,    setMarks]    = useState({});

  const visible =
    filter === 'today' ? RECALL_DATA.filter(r => DAILY_RECALL_IDS.has(r.id)) :
    filter === 'all'   ? RECALL_DATA :
    RECALL_DATA.filter(r => r.cat === filter);

  const gotCount    = Object.values(marks).filter(v => v === 'got').length;
  const reviewCount = Object.values(marks).filter(v => v === 'review').length;
  const dirty       = revealed.size > 0 || Object.keys(marks).length > 0;

  const FILTERS = [
    { id: 'today', label: `⭐ Today's Focus (15)` },
    { id: 'all',   label: `All (${RECALL_DATA.length})` },
    ...RECALL_CATS.map(c => ({ id: c, label: c })),
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-100 shadow-sm px-3 py-2">
          <span className="text-emerald-500">✓</span>
          <span className="text-xs font-bold text-slate-700">{gotCount} got it</span>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-100 shadow-sm px-3 py-2">
          <span className="text-orange-500">↺</span>
          <span className="text-xs font-bold text-slate-700">{reviewCount} review</span>
        </div>
        <div className="ml-auto bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
          <span className="text-amber-700 text-xs font-semibold">📅 {TODAY_LABEL}</span>
        </div>
        {dirty && (
          <button
            onClick={() => { setRevealed(new Set()); setMarks({}); }}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            <RefreshCw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors
              ${filter === f.id
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-600'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {visible.map(item => {
          const isRevealed = revealed.has(item.id);
          const m          = marks[item.id];
          const isToday    = DAILY_RECALL_IDS.has(item.id);

          return (
            <div
              key={item.id}
              className={`rounded-xl border shadow-sm transition-all
                ${m === 'got'    ? 'bg-emerald-50 border-emerald-200'
                : m === 'review' ? 'bg-orange-50 border-orange-200'
                : 'bg-white border-slate-100 hover:border-orange-200'}`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.cat}</span>
                  {isToday && <span className="bg-amber-100 text-amber-700 text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ml-2">⭐ Today</span>}
                </div>
                <p className="text-sm font-semibold text-slate-700 mb-3 leading-snug">{item.q}</p>
                {isRevealed ? (
                  <div className="space-y-2">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                      <p className="text-xs text-slate-700 leading-relaxed">{item.a}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setMarks(prev => ({ ...prev, [item.id]: 'got' }))}
                        className={`flex-1 text-xs font-bold py-1.5 rounded-lg transition-colors
                          ${m === 'got' ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'}`}
                      >✓ Got it</button>
                      <button
                        onClick={() => setMarks(prev => ({ ...prev, [item.id]: 'review' }))}
                        className={`flex-1 text-xs font-bold py-1.5 rounded-lg transition-colors
                          ${m === 'review' ? 'bg-orange-500 text-white' : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200'}`}
                      >↺ Review</button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setRevealed(prev => new Set([...prev, item.id]))}
                    className="w-full text-xs font-bold py-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-100 transition-colors"
                  >Reveal Answer</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Numbers Tab ──────────────────────────────────────────────────────────────
const NumbersTab = () => {
  const [mode,     setMode]     = useState('study');
  const [qIdx,     setQIdx]     = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [score,    setScore]    = useState({ got: 0, miss: 0 });
  const [done,     setDone]     = useState(false);

  const current = DAILY_QUIZ[qIdx];
  const total   = DAILY_QUIZ.length;

  const advance = result => {
    setScore(prev => ({ ...prev, [result]: prev[result] + 1 }));
    if (qIdx + 1 >= total) { setDone(true); }
    else { setQIdx(i => i + 1); setRevealed(false); }
  };

  const resetQuiz = () => { setQIdx(0); setRevealed(false); setScore({ got: 0, miss: 0 }); setDone(false); };

  const pct   = score.got / total;
  const emoji = pct >= 0.9 ? '🎉' : pct >= 0.7 ? '👍' : '📚';
  const msg   = pct >= 0.9 ? "Numbers mastered — you're exam-ready!"
              : pct >= 0.7 ? 'Good recall. A few gaps remain.'
              : 'Keep drilling — exact numbers are heavily tested.';

  const editionBadge = ed =>
    ed === 'Enterprise'        ? 'bg-blue-100 text-blue-700' :
    ed === 'Business Critical' ? 'bg-violet-100 text-violet-700' :
                                  'bg-red-100 text-red-700';

  return (
    <div>
      <div className="flex gap-1.5 bg-slate-100 rounded-xl p-1 mb-5">
        {[{ id: 'study', label: '📖 Reference Tables' }, { id: 'quiz', label: '🎯 Daily Quiz (10 Q)' }].map(m => (
          <button key={m.id} onClick={() => setMode(m.id)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors
              ${mode === m.id ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >{m.label}</button>
        ))}
      </div>

      {mode === 'study' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-orange-50 border-b border-orange-100 px-4 py-3">
              <h3 className="font-bold text-orange-700 text-sm">⚡ Warehouse Credits Per Hour</h3>
              <p className="text-orange-500 text-xs mt-0.5">Each size DOUBLES. Billing: per-second, 60-second minimum per resume.</p>
            </div>
            <div className="p-4 overflow-x-auto">
              <table className="w-full min-w-[380px] text-xs border-collapse">
                <thead><tr className="bg-slate-50">{WAREHOUSE_TABLE.map(r => <th key={r.size} className="px-3 py-2 text-center font-bold text-slate-500 border border-slate-100">{r.size}</th>)}</tr></thead>
                <tbody><tr>{WAREHOUSE_TABLE.map(r => <td key={r.size} className="px-3 py-3 text-center font-extrabold text-orange-600 text-sm border border-slate-100">{r.credits}</td>)}</tr></tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-blue-50 border-b border-blue-100 px-4 py-3">
              <h3 className="font-bold text-blue-700 text-sm">⏱ Retention Periods</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {RETENTION_ROWS.map((row, i) => (
                <div key={i} className={`flex items-center justify-between px-4 py-2.5 ${i % 2 !== 0 ? 'bg-slate-50/50' : ''}`}>
                  <span className="text-xs text-slate-600 flex-1 pr-4">{row.label}</span>
                  <span className="text-xs font-bold text-slate-800 whitespace-nowrap">{row.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-violet-50 border-b border-violet-100 px-4 py-3">
              <h3 className="font-bold text-violet-700 text-sm">🏛 Edition Gates</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {EDITION_ROWS.map((row, i) => (
                <div key={i} className={`flex items-center justify-between px-4 py-2.5 ${i % 2 !== 0 ? 'bg-slate-50/50' : ''}`}>
                  <span className="text-xs text-slate-600 flex-1 pr-4">{row.feature}</span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap ${editionBadge(row.edition)}`}>{row.edition}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-100 px-4 py-3">
              <h3 className="font-bold text-slate-700 text-sm">🧮 Key Formulas</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {[
                { f: 'Total data protection',  ex: 'Time Travel + Fail-safe  →  e.g. 10 + 7 = 17 days' },
                { f: 'Stream staleness check', ex: 'GREATER of (retention period, MAX_DATA_EXTENSION)' },
                { f: 'Credits consumed',        ex: 'size_credits/hr × hours × active_clusters' },
                { f: 'Billing per resume',      ex: 'MAX(actual_seconds, 60)' },
              ].map((row, i) => (
                <div key={i} className="px-4 py-3">
                  <p className="text-xs font-bold text-slate-700 mb-0.5">{row.f}</p>
                  <p className="text-xs text-slate-500">{row.ex}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {mode === 'quiz' && (
        done ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
            <div className="text-5xl mb-3">{emoji}</div>
            <h3 className="text-2xl font-extrabold text-slate-700 mb-1">{score.got} / {total}</h3>
            <p className="text-slate-500 text-sm mb-6">{msg}</p>
            <button onClick={resetQuiz}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl transition-colors inline-flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-semibold text-slate-500 tabular-nums w-10 text-right">{qIdx + 1}/{total}</span>
              <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-orange-500 h-full rounded-full transition-all duration-300" style={{ width: `${(qIdx / total) * 100}%` }} />
              </div>
              <span className="text-xs font-bold text-emerald-600 tabular-nums">{score.got} ✓</span>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">📅 Daily Quiz · {TODAY_LABEL}</p>
              <p className="text-center text-base font-bold text-slate-700 leading-snug mb-6">{current.q}</p>
              {!revealed ? (
                <button onClick={() => setRevealed(true)}
                  className="w-full bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-600 font-bold py-3 rounded-xl transition-colors">
                  Reveal Answer
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="bg-slate-50 border-2 border-orange-100 rounded-xl p-4 text-center">
                    <p className="text-xl font-extrabold text-slate-800">{current.a}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => advance('got')}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl transition-colors">✓ Got it</button>
                    <button onClick={() => advance('miss')}
                      className="bg-orange-100 hover:bg-orange-200 text-orange-700 font-bold py-2.5 rounded-xl transition-colors">↺ Missed it</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};

// ─── Optimization Tab ─────────────────────────────────────────────────────────
const OptimizationTab = () => {
  const [mode,     setMode]     = useState('quiz');

  // Quiz state
  const [qIdx,     setQIdx]     = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [results,  setResults]  = useState([]);
  const [quizDone, setQuizDone] = useState(false);

  // Tree state
  const [path, setPath] = useState(['root']);

  // ── Quiz helpers ────────────────────────────────────────────────────────────
  const scenario = SCENARIOS[qIdx];

  const revealQuiz = () => {
    if (!selected) return;
    const correct = selected === scenario.answer;
    setResults(prev => [...prev, { id: scenario.id, correct }]);
    setRevealed(true);
  };

  const nextScenario = () => {
    if (qIdx + 1 >= SCENARIOS.length) { setQuizDone(true); }
    else { setQIdx(i => i + 1); setSelected(null); setRevealed(false); }
  };

  const resetQuiz = () => { setQIdx(0); setSelected(null); setRevealed(false); setResults([]); setQuizDone(false); };

  const score    = results.filter(r => r.correct).length;
  const quizPct  = score / SCENARIOS.length;
  const quizEmoji = quizPct >= 0.9 ? '🎉' : quizPct >= 0.7 ? '👍' : '📚';

  // ── Tree helpers ─────────────────────────────────────────────────────────────
  const currentNodeId = path[path.length - 1];
  const currentNode   = TREE[currentNodeId];
  const goNext = nextId => setPath(prev => [...prev, nextId]);
  const goBack = () => setPath(prev => prev.slice(0, -1));
  const resetTree = () => setPath(['root']);

  const toolColors = {
    CLUSTERING:    { header: 'bg-blue-600',    badge: 'bg-blue-100 text-blue-700',    dot: 'bg-blue-500' },
    SOS:           { header: 'bg-violet-600',  badge: 'bg-violet-100 text-violet-700',dot: 'bg-violet-500' },
    QAS:           { header: 'bg-amber-600',   badge: 'bg-amber-100 text-amber-700',  dot: 'bg-amber-500' },
    MV:            { header: 'bg-teal-600',    badge: 'bg-teal-100 text-teal-700',    dot: 'bg-teal-500' },
    DYNAMIC_TABLE: { header: 'bg-emerald-600', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
    SCALE_OUT:     { header: 'bg-indigo-600',  badge: 'bg-indigo-100 text-indigo-700',dot: 'bg-indigo-500' },
    SCALE_UP:      { header: 'bg-orange-600',  badge: 'bg-orange-100 text-orange-700',dot: 'bg-orange-500' },
    DO_NOTHING:    { header: 'bg-slate-600',   badge: 'bg-slate-100 text-slate-700',  dot: 'bg-slate-500' },
  };

  return (
    <div>
      {/* Mode toggle */}
      <div className="flex gap-1.5 bg-slate-100 rounded-xl p-1 mb-5">
        {[
          { id: 'quiz', label: '🎮 Scenario Quiz (10)' },
          { id: 'tree', label: '🌳 Decision Tree' },
        ].map(m => (
          <button key={m.id} onClick={() => setMode(m.id)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors
              ${mode === m.id ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >{m.label}</button>
        ))}
      </div>

      {/* ── SCENARIO QUIZ ── */}
      {mode === 'quiz' && (
        quizDone ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
            <div className="text-5xl mb-3">{quizEmoji}</div>
            <h3 className="text-2xl font-extrabold text-slate-700 mb-1">{score} / {SCENARIOS.length}</h3>
            <p className="text-slate-500 text-sm mb-6">
              {quizPct >= 0.9 ? 'Excellent — you can correctly identify every optimization tool!' :
               quizPct >= 0.7 ? 'Good work. Review the scenarios you missed.' :
               'Keep practicing — optimizer questions appear frequently on the exam.'}
            </p>
            <div className="grid grid-cols-5 gap-1.5 mb-6 max-w-sm mx-auto">
              {results.map((r, i) => (
                <div key={i} className={`rounded-lg py-1.5 text-center text-xs font-bold
                  ${r.correct ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {r.correct ? '✓' : '✗'} {i + 1}
                </div>
              ))}
            </div>
            <button onClick={resetQuiz}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl transition-colors inline-flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
          </div>
        ) : (
          <div>
            {/* Progress */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-semibold text-slate-500 tabular-nums">Scenario {qIdx + 1}/{SCENARIOS.length}</span>
              <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-orange-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(qIdx / SCENARIOS.length) * 100}%` }} />
              </div>
              <span className="text-xs font-bold text-emerald-600">{score} ✓</span>
            </div>

            {/* Scenario card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-4 overflow-hidden">
              <div className="bg-slate-800 px-5 py-3 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Scenario {scenario.id}</span>
                  <h3 className="text-white font-extrabold text-sm leading-tight">{scenario.title}</h3>
                </div>
                {!revealed && (
                  <span className="bg-orange-500/20 text-orange-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    💡 {scenario.hint.split(' ').slice(0, 5).join(' ')}…
                  </span>
                )}
              </div>
              <div className="p-5">
                <div className="space-y-1 mb-4">
                  {scenario.context.map((line, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="text-slate-300 mt-0.5 flex-shrink-0">▸</span>
                      <span className="font-mono leading-relaxed">{line}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm font-bold text-slate-700">Which optimization tool should you use?</p>
              </div>
            </div>

            {/* Tool buttons */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {TOOLS.map(tool => {
                const isSelected = selected === tool.id;
                const isCorrect  = revealed && tool.id === scenario.answer;
                const isWrong    = revealed && isSelected && tool.id !== scenario.answer;
                const isDimmed   = revealed && !isSelected && tool.id !== scenario.answer;

                return (
                  <button
                    key={tool.id}
                    onClick={() => !revealed && setSelected(tool.id)}
                    disabled={revealed}
                    className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all text-left
                      ${isDimmed ? 'opacity-30 cursor-default' : 'cursor-pointer'}
                      ${isCorrect  ? `${tool.bg} text-white border-transparent shadow-md` :
                        isWrong    ? 'bg-red-500 text-white border-transparent' :
                        isSelected ? `${tool.bg} text-white border-transparent shadow-md` :
                        `${tool.light} ${tool.border} ${tool.text} hover:opacity-80`}`}
                  >
                    {isCorrect ? '✓ ' : isWrong ? '✗ ' : ''}{tool.label}
                  </button>
                );
              })}
            </div>

            {/* Reveal / Next */}
            {!revealed ? (
              <button
                onClick={revealQuiz}
                disabled={!selected}
                className={`w-full font-bold py-3 rounded-xl transition-colors
                  ${selected
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
              >
                {selected ? 'Reveal Answer' : 'Select a tool first'}
              </button>
            ) : (
              <div className="space-y-3">
                <div className={`rounded-xl border-l-4 p-4
                  ${selected === scenario.answer ? 'bg-emerald-50 border-emerald-400' : 'bg-red-50 border-red-400'}`}>
                  <p className={`text-xs font-extrabold mb-2 ${selected === scenario.answer ? 'text-emerald-700' : 'text-red-700'}`}>
                    {selected === scenario.answer ? '✓ Correct!' : `✗ Incorrect — the answer is ${TOOL_MAP[scenario.answer]?.label}`}
                  </p>
                  <ul className="space-y-1">
                    {scenario.why.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <span className="text-slate-400 mt-0.5 flex-shrink-0">•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button onClick={nextScenario}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors">
                  {qIdx + 1 < SCENARIOS.length ? `Next Scenario →` : 'See Results'}
                </button>
              </div>
            )}
          </div>
        )
      )}

      {/* ── DECISION TREE ── */}
      {mode === 'tree' && (
        <div>
          {/* Breadcrumb path */}
          {path.length > 1 && (
            <div className="flex items-center gap-1 flex-wrap mb-4">
              {path.map((nodeId, i) => (
                <React.Fragment key={nodeId}>
                  {i > 0 && <span className="text-slate-300 text-xs">›</span>}
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                    ${i === path.length - 1
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-slate-400 hover:text-slate-600 cursor-pointer'}`}
                    onClick={() => i < path.length - 1 && setPath(path.slice(0, i + 1))}
                  >
                    {TREE[nodeId]?.crumb || nodeId}
                  </span>
                </React.Fragment>
              ))}
            </div>
          )}

          {currentNode?.type === 'answer' ? (
            // ── Answer node ──
            (() => {
              const tc   = toolColors[currentNode.toolId] || toolColors.DO_NOTHING;
              const tool = TOOL_MAP[currentNode.toolId];
              return (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className={`${tc.header} px-5 py-4`}>
                    <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mb-0.5">Recommended Tool</p>
                    <h3 className="text-white text-lg font-extrabold leading-tight">{tool?.label} {currentNode.crumb !== tool?.label.replace(/^[^ ]+ /, '') ? '' : ''}</h3>
                    <p className="text-white/80 text-xs mt-1">{currentNode.crumb}</p>
                  </div>
                  <div className="p-5 space-y-4">
                    <p className="text-sm text-slate-600 leading-relaxed">{currentNode.summary}</p>

                    <div>
                      <p className="text-xs font-extrabold text-emerald-700 mb-2">✅ Use when:</p>
                      <ul className="space-y-1.5">
                        {currentNode.when.map((w, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                            <span className={`w-1.5 h-1.5 rounded-full ${tc.dot} mt-1.5 flex-shrink-0`} />
                            {w}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-xs font-extrabold text-red-600 mb-2">❌ Not when:</p>
                      <ul className="space-y-1.5">
                        {currentNode.notWhen.map((w, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-300 mt-1.5 flex-shrink-0" />
                            {w}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button onClick={goBack}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors">
                        <ChevronLeft className="w-3.5 h-3.5" /> Back
                      </button>
                      <button onClick={resetTree}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold transition-colors border border-orange-200">
                        <RefreshCw className="w-3.5 h-3.5" /> Try Another Path
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            // ── Question node ──
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-100 px-5 py-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  {path.length === 1 ? 'Step 1 — Diagnose the problem' : `Step ${path.length} — Narrow down`}
                </p>
                <p className="text-base font-bold text-slate-700 leading-snug">{currentNode?.q}</p>
              </div>
              <div className="p-4 space-y-2">
                {currentNode?.options?.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => goNext(opt.next)}
                    className="w-full text-left px-4 py-3 rounded-xl bg-slate-50 hover:bg-orange-50 border border-slate-100 hover:border-orange-200 text-sm text-slate-700 hover:text-orange-700 font-medium transition-all group flex items-start gap-3"
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-200 group-hover:bg-orange-200 text-slate-600 group-hover:text-orange-700 text-[10px] font-extrabold flex-shrink-0 flex items-center justify-center mt-0.5 transition-colors">
                      {i + 1}
                    </span>
                    <span className="leading-snug">{opt.label}</span>
                  </button>
                ))}
              </div>
              {path.length > 1 && (
                <div className="px-5 pb-4">
                  <button onClick={goBack}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 font-semibold transition-colors">
                    <ChevronLeft className="w-3.5 h-3.5" /> Back
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Reference cheat sheet */}
          {path.length === 1 && (
            <div className="mt-5 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="bg-slate-800 px-4 py-3">
                <h3 className="text-white text-xs font-extrabold">📋 Quick Decision Cheat Sheet</h3>
              </div>
              <div className="divide-y divide-slate-50">
                {[
                  { signal: 'Range filter, low/medium cardinality column',     tool: '🗂 Clustering Key',       tc: 'text-blue-600' },
                  { signal: 'Equality lookup, very high cardinality column',   tool: '🔍 Search Optimization',   tc: 'text-violet-600' },
                  { signal: 'LIKE / substring on text or VARIANT field',       tool: '🔍 Search Optimization',   tc: 'text-violet-600' },
                  { signal: 'Single outlier query (10–100× typical)',           tool: '⚡ Query Acceleration',    tc: 'text-amber-600' },
                  { signal: 'Repeated single-table aggregation (no JOINs)',    tool: '📋 Materialized View',      tc: 'text-teal-600' },
                  { signal: 'Repeated query with JOINs / complex pipeline',    tool: '🔄 Dynamic Table',          tc: 'text-emerald-600' },
                  { signal: 'Many concurrent users queuing',                   tool: '↔️ Scale Out',             tc: 'text-indigo-600' },
                  { signal: 'Single query spilling to remote storage',         tool: '⬆️ Scale Up',              tc: 'text-orange-600' },
                  { signal: 'Query already fast (< 1 second)',                 tool: '✅ Do Nothing',             tc: 'text-slate-600' },
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                    <span className="text-xs text-slate-500 flex-1">{row.signal}</span>
                    <span className={`text-xs font-bold whitespace-nowrap ${row.tc}`}>{row.tool}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Root Component ───────────────────────────────────────────────────────────
const CrossStudy = () => {
  const [activeTab, setActiveTab] = useState('recall');

  const TABS = [
    { id: 'recall',    label: '⚡ Quick Recall', count: RECALL_DATA.length },
    { id: 'numbers',   label: '🔢 Numbers',       count: NUMBERS_QUIZ.length },
    { id: 'optimizer', label: '🌳 Optimizer',      count: SCENARIOS.length },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-1.5 flex gap-1.5">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl text-sm font-bold transition-all
              ${activeTab === tab.id
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
          >
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold
              ${activeTab === tab.id ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {activeTab === 'recall'    && <QuickRecallTab />}
      {activeTab === 'numbers'   && <NumbersTab />}
      {activeTab === 'optimizer' && <OptimizationTab />}
    </div>
  );
};

export default CrossStudy;
