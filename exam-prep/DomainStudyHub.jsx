import React, { useState } from 'react';
import { Layers, Shield, Upload, Zap, Share2, ChevronRight } from 'lucide-react';

// ── Shared micro-components (mirror TrapsAndGotchas style) ─────────────────────
const CompareTable = ({ headers, rows }) => (
  <div className="overflow-x-auto mt-2">
    <table className="w-full text-xs border-collapse">
      <thead>
        <tr>
          {headers.map(h => (
            <th key={h} className="bg-slate-100 text-slate-600 font-bold px-3 py-2 text-left border border-slate-200">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
            {row.map((cell, j) => (
              <td key={j} className="px-3 py-2 border border-slate-200 text-slate-700 leading-snug">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const CodeSnip = ({ children }) => (
  <pre className="bg-slate-900 text-emerald-300 text-xs rounded-xl p-4 overflow-x-auto leading-relaxed font-mono mt-2">
    <code>{children}</code>
  </pre>
);

const Pill = ({ label, active, onClick, color }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
      active ? `${color} text-white shadow-sm` : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400'
    }`}
  >
    {label}
  </button>
);

const Accordion = ({ title, badge, badgeColor = 'bg-slate-100 text-slate-600', children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-xl border transition-all ${open ? 'border-amber-300 bg-amber-50/40' : 'border-slate-200 bg-white'}`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        <ChevronRight className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${open ? 'rotate-90' : ''}`} />
        <span className="flex-1 font-semibold text-slate-800 text-sm">{title}</span>
        {badge && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${badgeColor}`}>{badge}</span>
        )}
      </button>
      {open && <div className="px-5 pb-5 space-y-3 text-sm">{children}</div>}
    </div>
  );
};

const Traps = ({ list }) => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
    <p className="text-xs font-extrabold text-red-700 uppercase tracking-wide mb-1">Common Traps</p>
    {list.map((t, i) => (
      <div key={i} className="flex items-start gap-2">
        <span className="text-red-500 font-bold text-xs flex-shrink-0 mt-0.5">✗</span>
        <p className="text-xs text-slate-700">{t}</p>
      </div>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// DOMAIN 1: Architecture
// ─────────────────────────────────────────────────────────────────────────────
const D1_SECTIONS = [
  {
    id: '1.1',
    label: '1.1 Architecture',
    items: (
      <div className="space-y-3">
        <Accordion title="Three Architecture Layers" badge="Exam Fave" badgeColor="bg-blue-100 text-blue-700" defaultOpen>
          <CompareTable
            headers={['Layer', 'Responsibilities', 'Key Cache']}
            rows={[
              ['Cloud Services', 'Authentication, query optimization, metadata management, access control, result cache', 'Result Cache (persists after suspend)'],
              ['Compute', 'Virtual warehouses execute queries. Each WH has its own SSD cache.', 'SSD Cache (wiped on suspend)'],
              ['Storage', 'Centralized cloud storage. Micro-partitions (immutable, columnar, 50–500 MB uncompressed).', 'None'],
            ]}
          />
          <Traps list={[
            '"Which layer handles query optimization?" = Cloud Services — NOT compute',
            '"Which layer stores the result cache?" = Cloud Services — it persists across warehouse suspend',
            '"SSD cache survives suspend" = FALSE — completely wiped on suspend',
          ]} />
        </Accordion>

        <Accordion title="Edition Matrix" badge="Memorize" badgeColor="bg-amber-100 text-amber-700">
          <CompareTable
            headers={['Feature', 'Standard', 'Enterprise', 'Biz Critical', 'VPS']}
            rows={[
              ['Multi-cluster WH', 'No', 'Yes', 'Yes', 'Yes'],
              ['Time Travel 90 days', 'No (1 day max)', 'Yes', 'Yes', 'Yes'],
              ['Materialized views', 'No', 'Yes', 'Yes', 'Yes'],
              ['Dynamic data masking', 'No', 'Yes', 'Yes', 'Yes'],
              ['Tri-Secret Secure', 'No', 'No', 'Yes', 'Yes'],
              ['PrivateLink', 'No', 'No', 'Yes', 'Yes'],
              ['HIPAA / PCI', 'No', 'No', 'Yes', 'Yes'],
              ['Sharing via Support only', 'No', 'No', 'No', 'Yes'],
            ]}
          />
          <Traps list={[
            '"Standard Edition supports materialized views" = FALSE — Enterprise+',
            '"Business Critical adds masking policies" = FALSE — Enterprise adds them',
            '"All editions encrypt data at rest" = TRUE — AES-256 on all editions',
          ]} />
        </Accordion>
      </div>
    ),
  },
  {
    id: '1.2',
    label: '1.2 Interfaces',
    items: (
      <div className="space-y-3">
        <Accordion title="Tools Reference" defaultOpen>
          <CompareTable
            headers={['Tool', 'Purpose']}
            rows={[
              ['Snowsight', 'Web UI for queries, dashboards, worksheets'],
              ['SnowSQL', 'CLI for running SQL from terminal. Supports PUT/GET.'],
              ['Snowflake CLI (snow)', 'CLI for managing objects, Streamlit, Notebooks'],
              ['SnowCD', 'Connectivity diagnostic only (DNS, TLS, OCSP, proxy). Does NOT execute queries.'],
              ['SQL API', 'REST API for programmatic SQL — OAuth or JWT only. No username/password.'],
              ['JDBC / ODBC', 'Standard database drivers'],
              ['Python Connector', 'Python-specific driver'],
            ]}
          />
        </Accordion>

        <Accordion title="SQL API — Full Capabilities">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p>✓ Returns responses in <strong>JSON format</strong></p>
            <p>✓ Supports <strong>OAuth or JWT (key-pair)</strong> authentication only</p>
            <p>✓ Pure HTTP/REST — <strong>no language-specific driver required</strong></p>
            <p className="text-red-700">✗ Does NOT support PUT or GET commands (no file transfer)</p>
            <p className="text-red-700">✗ Cannot call third-party REST APIs during execution</p>
            <p className="text-red-700">✗ Does NOT support username/password auth</p>
          </div>
        </Accordion>

        <Accordion title="Session Role Resolution at Login" badge="Exam Trap" badgeColor="bg-red-100 text-red-700">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p>Snowflake determines the current role using this priority:</p>
            <p>1. Role <strong>specified at connection</strong> (must be granted to the user) → becomes current</p>
            <p>2. If no role specified, <strong>user's default role</strong> is used</p>
            <p>3. If no default role exists, <strong>PUBLIC</strong> is used as fallback — login does NOT fail</p>
            <p className="text-red-700 font-semibold">If a specified role is NOT granted to the user → connection error (login fails)</p>
          </div>
        </Accordion>

        <Accordion title="Cancelling a Long-Running Query">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p><strong>Fastest:</strong> Return to the worksheet and click ABORT on the query</p>
            <p>Activity view → cancel works but adds navigation steps</p>
            <p className="text-red-700">SUSPEND warehouse = cancels ALL queries on it (affects other users!)</p>
            <p className="text-red-700">AUTO_SUSPEND = 0 means NEVER suspend — does not abort anything</p>
          </div>
        </Accordion>

        <Accordion title="Worksheet Sharing (Snowsight)">
          <CompareTable
            headers={['Permission', 'What it Grants']}
            rows={[
              ['View only', 'See worksheet contents (SQL text)'],
              ['Edit + View = TRUE', 'See contents + modify SQL — but cannot RUN unless they have the role + privileges that own referenced objects'],
              ['Run', 'Execute queries (still gated by underlying object grants for the user\'s role)'],
            ]}
          />
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-2 text-xs">
            <p className="font-bold text-amber-700">Sharing a worksheet does NOT grant access to underlying tables</p>
            <p className="text-slate-700 mt-1">The recipient still needs their own role and privileges. They can read the SQL but might not be able to run it.</p>
          </div>
        </Accordion>

        <Traps list={[
          '"SnowCD executes queries" = FALSE — it only tests connectivity',
          '"SQL API uses username/password" = FALSE — OAuth or JWT only',
          '"SQL API supports GET/PUT for file transfer" = FALSE — no file commands',
          '"SQL API can call third-party APIs during execution" = FALSE — Snowflake-only',
          '"PUT works from Snowsight" = FALSE — requires local filesystem (SnowSQL or drivers)',
          '"If specified role is not granted, login uses PUBLIC" = FALSE — login fails',
          '"Sharing a worksheet shares the underlying table data" = FALSE — recipient still needs their own grants',
          '"Suspending the warehouse is the fastest way to cancel ONE query" = FALSE — kills all queries on it',
        ]} />
      </div>
    ),
  },
  {
    id: '1.3',
    label: '1.3 Objects',
    items: (
      <div className="space-y-3">
        <Accordion title="Object Hierarchy" defaultOpen>
          <CodeSnip>{`Organization\n  Account\n    Database\n      Schema\n        Table / View / Stage / Pipe / Stream / Task /\n        Sequence / UDF / Procedure / File Format / Share`}</CodeSnip>
          <p className="text-xs font-bold text-slate-700 mt-3">Parameter Precedence (most specific wins):</p>
          <CodeSnip>{`Object level > Session level > Account level\n-- Session TIMEOUT=60 beats Account TIMEOUT=300`}</CodeSnip>
        </Accordion>
        <Accordion title="Key Object Facts">
          <CompareTable
            headers={['Object', 'Key Fact']}
            rows={[
              ['Sequence', 'Unique values only — NOT gap-free or ordered across sessions'],
              ['Pipe', 'Defines a COPY INTO for Snowpipe. Serverless compute.'],
              ['Share', 'Contains references to objects. Consumer gets READ-ONLY access.'],
              ['File Format', 'Named set of parse options (TYPE, DELIMITER, etc.). Reusable.'],
              ['Hybrid Table', 'Row-oriented storage (Unistore). Enforces PK/UNIQUE/FK + supports indexes. Only table type with enforced constraints.'],
              ['Iceberg Table', 'Customer-managed storage (S3/Azure/GCS). Snowflake-managed catalog = full read/write. External catalog (e.g., Glue) = read-only + limited features.'],
            ]}
          />
        </Accordion>

        <Accordion title="External Tables — Allowed Operations" badge="Exam Trap" badgeColor="bg-red-100 text-red-700">
          <CompareTable
            headers={['Operation', 'Allowed?']}
            rows={[
              ['SELECT / JOIN with other tables', 'YES — they participate in queries normally'],
              ['ALTER (refresh, add/drop columns, rename)', 'YES'],
              ['INSERT / UPDATE / DELETE / MERGE', 'NO — read-only'],
              ['Time Travel', 'NO'],
              ['Cloning (standalone or via DB clone)', 'NO — excluded'],
            ]}
          />
        </Accordion>

        <Accordion title="Cloning Snapshot Timing" badge="Exam Fave" badgeColor="bg-blue-100 text-blue-700">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p>The clone captures data at the moment <strong>the CREATE ... CLONE statement is INITIATED</strong> — not when it completes</p>
            <p>Concurrent DML on the source AFTER initiation does NOT appear in the clone</p>
            <p>This is why cloning a 10 TB table is fast — it's a metadata snapshot, not a data copy</p>
          </div>
        </Accordion>

        <Accordion title="MV Invalidation by Schema Changes">
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs space-y-1">
            <p>A materialized view becomes <strong>invalid</strong> if base table columns it references are <strong>dropped</strong></p>
            <p>Renaming a base table column may also invalidate the MV</p>
            <p>Check status: <code className="bg-slate-100 px-1 rounded">SHOW MATERIALIZED VIEWS</code> → invalid_reason column</p>
            <p>Recovery: drop and recreate the MV after schema changes</p>
          </div>
        </Accordion>

        <Accordion title="Account Identifier Formats" badge="Exam Fave" badgeColor="bg-blue-100 text-blue-700">
          <CompareTable
            headers={['Format', 'Example', 'Notes']}
            rows={[
              ['org-account (preferred)', 'myorg-myaccount', 'Used in connection strings and replication'],
              ['Legacy locator', 'xy12345.us-east-1', 'Region-qualified, older format'],
            ]}
          />
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-2 text-xs">
            <p className="font-bold text-amber-700">Snowflake supports 3 cloud platforms: AWS, Azure, GCP</p>
            <p className="text-slate-700 mt-1">Data is NOT automatically replicated across regions or clouds — requires explicit replication groups or Listings.</p>
          </div>
        </Accordion>

        <Traps list={[
          '"Sequences guarantee sequential order" = FALSE — unique only, gaps possible',
          '"Shares contain data copies" = FALSE — they contain references',
          '"Standard Snowflake tables enforce PRIMARY KEY constraints" = FALSE — informational only (Hybrid Tables do enforce)',
          '"Iceberg tables with external catalog support full DML" = FALSE — read-mostly with limited features',
        ]} />
      </div>
    ),
  },
  {
    id: '1.4',
    label: '1.4 Warehouses',
    items: (
      <div className="space-y-3">
        <Accordion title="Credit Table" badge="Memorize" badgeColor="bg-amber-100 text-amber-700" defaultOpen>
          <CompareTable
            headers={['Size', 'Credits/Hour']}
            rows={[
              ['X-Small', '1'],
              ['Small', '2'],
              ['Medium', '4'],
              ['Large', '8'],
              ['X-Large', '16'],
              ['2XL / 3XL / 4XL', '32 / 64 / 128'],
            ]}
          />
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-2 text-xs">
            <p className="font-bold text-amber-700">Billing rules</p>
            <p className="text-slate-700 mt-1">Per-second billing with <strong>60-second minimum per resume</strong>. Query count is irrelevant — only size and runtime matter.</p>
            <p className="text-slate-700 mt-1"><strong>AUTO_SUSPEND = 0</strong> means NEVER auto-suspend (not "suspend immediately").</p>
          </div>
        </Accordion>

        <Accordion title="Scaling Strategies">
          <CompareTable
            headers={['Strategy', 'When to Use', 'Mechanism']}
            rows={[
              ['Scale UP', 'Complex single query is slow', 'Increase warehouse size'],
              ['Scale OUT', 'Many users queuing', 'Multi-cluster with auto-scaling'],
              ['STANDARD policy', 'Adds cluster immediately on queue', 'More responsive, more credits'],
              ['ECONOMY policy', 'Waits 6 min estimate before adding', 'Saves credits, more queuing'],
            ]}
          />
        </Accordion>

        <Accordion title="Warehouse Types">
          <CompareTable
            headers={['Type', 'Use Case']}
            rows={[
              ['Standard (Gen 1/Gen 2)', 'General SQL queries'],
              ['Snowpark-optimized', '16x memory. ML training, large UDFs, Snowpark DataFrames'],
            ]}
          />
        </Accordion>

        <Accordion title="Resize & Timeout Behavior">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p><strong>Resizing mid-query:</strong> Only affects FUTURE queries. Queries already running continue at the OLD size.</p>
            <p><strong>STATEMENT_TIMEOUT_IN_SECONDS:</strong> Default = <strong>172800 seconds (2 days)</strong> at warehouse level. Can be overridden at session or account level.</p>
            <p><strong>STATEMENT_QUEUED_TIMEOUT_IN_SECONDS:</strong> Default = <strong>0</strong> (no queue timeout — queries wait indefinitely).</p>
          </div>
        </Accordion>

        <Traps list={[
          '"ECONOMY scaling reduces queuing" = FALSE — it INCREASES queuing',
          '"Scale UP helps with concurrency" = FALSE — scale OUT helps concurrency',
          '"Warehouse runs 45 seconds, billed 45 seconds" = FALSE — 60-second minimum',
          '"AUTO_SUSPEND = 0 means suspend immediately" = FALSE — means NEVER suspend',
          'ALLOW_OVERLAPPING_EXECUTION = FALSE (default): skips next run if current still running',
          '"Resizing a warehouse speeds up a running query" = FALSE — only applies to future queries',
          '"STATEMENT_TIMEOUT_IN_SECONDS default is 1 hour" = FALSE — default is 172800 s (2 days)',
        ]} />
      </div>
    ),
  },
  {
    id: '1.5',
    label: '1.5 Storage',
    items: (
      <div className="space-y-3">
        <Accordion title="Micro-partitions" defaultOpen>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs space-y-1">
            <p>Immutable, columnar, 50–500 MB uncompressed</p>
            <p>Metadata auto-stored: min/max per column, null count, distinct count</p>
            <p>Cannot be manually defined or resized</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-2 text-xs">
            <p className="font-bold text-amber-700">Clustering Keys</p>
            <p className="text-slate-700 mt-1">Best columns: DATE, TIMESTAMP, low-to-medium cardinality in WHERE/JOIN. Put <strong>lower cardinality first</strong> in multi-column keys.</p>
            <p className="text-slate-700 mt-1">SYSTEM$CLUSTERING_INFORMATION: depth near 1 = well-clustered. High depth = reclustering needed.</p>
            <p className="text-slate-700 mt-1">Automatic Clustering = serverless — NOT tracked by resource monitors.</p>
          </div>
        </Accordion>

        <Accordion title="Table Types">
          <CompareTable
            headers={['Type', 'Time Travel', 'Fail-safe', 'Scope', 'Cloneable?']}
            rows={[
              ['Permanent', '0–90 days (Enterprise)', '7 days', 'Until dropped', 'Yes'],
              ['Transient', '0–1 day', '0 days', 'Until dropped', 'Yes (must say TRANSIENT in clone DDL)'],
              ['Temporary', '0–1 day', '0 days', 'Session only', 'Yes'],
              ['External', 'N/A', 'N/A', 'Points to cloud storage', 'NO'],
              ['Dynamic', 'Follows TARGET_LAG', 'Same as permanent', 'Until dropped', 'NO'],
              ['Iceberg', 'Via external catalog', 'N/A', 'Customer-managed storage', 'Depends'],
            ]}
          />
        </Accordion>

        <Accordion title="View Types">
          <CompareTable
            headers={['Type', 'Key Fact']}
            rows={[
              ['Standard', 'Saved SQL. No storage. Definition visible to granted roles.'],
              ['Materialized', 'Pre-computed. Serverless refresh. ONE table only (no JOINs). Enterprise+.'],
              ['Secure', 'Hides definition from non-owners. Required for sharing. May reduce optimization.'],
            ]}
          />
        </Accordion>

        <Accordion title="Materialized View — Full Restriction List" badge="Memorize" badgeColor="bg-red-100 text-red-700">
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs space-y-1">
            <p className="font-bold text-red-700 mb-1">MVs CANNOT include any of the following:</p>
            <p>✗ JOINs (any kind — single table only)</p>
            <p>✗ UNIONs / UNION ALL</p>
            <p>✗ HAVING clause</p>
            <p>✗ ORDER BY clause</p>
            <p>✗ LIMIT / FETCH FIRST n ROWS</p>
            <p>✗ Window functions (ROW_NUMBER, RANK, LAG, etc.)</p>
            <p>✗ Nested subqueries referencing other tables</p>
            <p>✗ Non-deterministic functions (CURRENT_TIMESTAMP, RANDOM, etc.)</p>
            <p className="font-bold text-green-700 mt-2">✓ Alternative for complex queries: Dynamic Tables (support JOINs, chaining, TARGET_LAG)</p>
          </div>
        </Accordion>

        <Traps list={[
          '"Materialized views support JOINs" = FALSE — single table only (use Dynamic Tables for JOINs)',
          '"External tables support INSERT" = FALSE — read-only, SELECT only',
          '"CREATE TABLE ... CLONE transient_table" = FAILS — must use CREATE TRANSIENT TABLE ... CLONE',
          '"External tables are included in database clones" = FALSE — excluded entirely',
          '"Internal stages can be cloned" = FALSE — external stages CAN',
        ]} />
      </div>
    ),
  },
  {
    id: '1.6',
    label: '1.6 AI/ML',
    items: (
      <div className="space-y-3">
        <Accordion title="Cortex AI & ML Functions" defaultOpen>
          <CompareTable
            headers={['Feature', 'What it Does']}
            rows={[
              ['SUMMARIZE, SENTIMENT, TRANSLATE, COMPLETE', 'Cortex LLM SQL functions — run directly in SQL'],
              ['EXTRACT_ANSWER, CLASSIFY_TEXT', 'Cortex AI SQL functions'],
              ['Cortex Analyst', 'Text-to-SQL via semantic model (YAML). Natural language → SQL.'],
              ['Cortex Search', 'Hybrid search (keyword + vector) over text data'],
              ['FORECAST', 'Time-series prediction — built-in serverless ML'],
              ['ANOMALY_DETECTION', 'Outlier detection — built-in serverless ML'],
            ]}
          />
        </Accordion>

        <Accordion title="Development Runtimes">
          <CompareTable
            headers={['Platform', 'Runs On', 'Key Fact']}
            rows={[
              ['Snowpark', 'Session warehouse', 'DataFrames are LAZY — execution runs on WH, not client. Python/Java/Scala.'],
              ['Streamlit in Snowflake (SiS)', 'Snowflake-managed compute', 'Uses VIEWER\'s role and warehouse. NOT external Streamlit cloud.'],
              ['Snowflake Notebooks', 'WH or Container Service', 'Interactive dev in Snowsight. Python + SQL cells.'],
              ['Native Apps', 'Consumer\'s compute', 'Packaged (code + data) distributed via Marketplace. Installed in consumer account.'],
            ]}
          />
        </Accordion>

        <Accordion title="UDF Languages — Snowpark API vs Native">
          <CompareTable
            headers={['How Created', 'Languages Supported']}
            rows={[
              ['Snowpark API (programmatic)', 'Python, Java, Scala'],
              ['Native CREATE FUNCTION (SQL)', 'SQL, Python, Java, Scala, JavaScript'],
            ]}
          />
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-2 text-xs">
            <p className="font-bold text-amber-700">Trap: JavaScript UDFs exist — but NOT through Snowpark</p>
            <p className="text-slate-700 mt-1">JavaScript is supported via raw SQL (CREATE FUNCTION ... LANGUAGE JAVASCRIPT) but NOT through the Snowpark API. Snowpark = Python/Java/Scala only.</p>
          </div>
        </Accordion>

        <Accordion title="Snowpark Container Services (SPCS)">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p>Run containerized workloads (LLMs, custom APIs, data apps) directly in Snowflake</p>
            <p>Billed by <strong>compute pool</strong> — NOT by virtual warehouse credits</p>
            <p>Compute pools are persistent (not auto-suspended like warehouses by default)</p>
            <p>Enables GPU workloads for ML inference</p>
            <p className="text-red-700">NOT the same as Snowpark (DataFrame API) or Snowflake Notebooks</p>
          </div>
        </Accordion>

        <Traps list={[
          '"Snowpark DataFrames execute on the client" = FALSE — runs on the warehouse',
          '"SiS apps run on a dedicated Streamlit server" = FALSE — Snowflake-managed compute',
          '"FORECAST is an external ML function" = FALSE — built-in ML function (no external infra)',
          '"SPCS is billed by warehouse credits" = FALSE — billed by compute pool',
          '"Snowpark Container Services = Snowpark Python API" = FALSE — SPCS runs containers, Snowpark runs DataFrames on a warehouse',
        ]} />
      </div>
    ),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// DOMAIN 2: Security & Governance
// ─────────────────────────────────────────────────────────────────────────────
const D2_SECTIONS = [
  {
    id: '2.1',
    label: '2.1 Security',
    items: (
      <div className="space-y-3">
        <Accordion title="RBAC + DAC Combined Model" defaultOpen>
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-3 text-xs space-y-2">
            <p><strong>RBAC:</strong> Privileges granted to roles → roles granted to users</p>
            <p><strong>DAC:</strong> Each object has an owner. Owner decides who gets access.</p>
            <p>Both work together — owner (DAC) grants privileges to roles (RBAC).</p>
          </div>
        </Accordion>

        <Accordion title="System Role Hierarchy" badge="Memorize" badgeColor="bg-violet-100 text-violet-700">
          <CodeSnip>{`ACCOUNTADMIN -----> Billing, resource monitors, account settings\n  |-- SECURITYADMIN --> Manage grants on objects (GRANT SELECT, etc.)\n  |     |-- USERADMIN --> Create/manage users and roles\n  |-- SYSADMIN -------> Create databases, warehouses, schemas\nPUBLIC (all roles inherit this)`}</CodeSnip>
          <CompareTable
            headers={['Role', 'Creates', 'Manages', 'Cannot']}
            rows={[
              ['USERADMIN', 'Users, roles', 'Grant roles to users', 'Grant object privileges, create DBs'],
              ['SECURITYADMIN', 'Everything USERADMIN +', 'Object-level grants (SELECT, etc.)', 'Create DBs/warehouses, view billing'],
              ['SYSADMIN', 'Databases, warehouses, schemas', 'Database objects', 'Manage users, view billing'],
              ['ACCOUNTADMIN', 'Resource monitors', 'Billing, account params', 'N/A (can do everything)'],
              ['ORGADMIN', 'Accounts (org level)', 'Org usage, replication', 'Account-level admin within accounts'],
            ]}
          />
        </Accordion>

        <Accordion title="PUBLIC Role" badge="Exam Trap" badgeColor="bg-red-100 text-red-700">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-2">
            <p><strong>PUBLIC</strong> is automatically granted to <strong>every user AND every role</strong> in the account — it cannot be revoked</p>
            <p>Granting a privilege to PUBLIC = giving it to <strong>everyone</strong></p>
            <p>Custom roles: best practice is to grant them up to <strong>SYSADMIN</strong> so SYSADMIN inherits all custom object ownership visibility</p>
          </div>
        </Accordion>

        <Accordion title="Secondary Roles">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-2">
            <p><code className="bg-slate-100 px-1 rounded">USE SECONDARY ROLES ALL</code> — activates all granted roles alongside primary</p>
            <p>Without this, ONLY primary role privileges apply</p>
            <p><code className="bg-slate-100 px-1 rounded">CURRENT_ROLE()</code> = primary only</p>
            <p><code className="bg-slate-100 px-1 rounded">IS_ROLE_IN_SESSION()</code> = primary + secondary + inherited</p>
          </div>
        </Accordion>

        <Accordion title="Authentication Methods">
          <CompareTable
            headers={['Method', 'Use Case', 'Key Fact']}
            rows={[
              ['Username/password', 'Interactive login', 'Basic, not for programmatic'],
              ['MFA (Duo)', 'Interactive + extra security', 'Powered by Duo Security'],
              ['SSO (SAML 2.0)', 'Browser-based federated', 'IdP: Okta, Azure AD, etc.'],
              ['Key-pair (RSA)', 'Programmatic: connectors, Kafka', 'PUBLIC key to Snowflake — private stays local'],
              ['OAuth', 'Programmatic: custom apps, SQL API', 'Token-based'],
              ['SCIM', 'User/group provisioning', 'Automates lifecycle from IdP'],
            ]}
          />
        </Accordion>

        <Accordion title="Network Policies">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-2">
            <p><strong>BLOCKED takes precedence</strong> over ALLOWED (same IP in both = blocked)</p>
            <p><strong>User-level OVERRIDES account-level</strong> — not additive, not merged</p>
          </div>
        </Accordion>

        <Traps list={[
          '"USERADMIN can grant SELECT on tables" = FALSE — that is SECURITYADMIN',
          '"SECURITYADMIN creates databases" = FALSE — that is SYSADMIN',
          '"ORGADMIN has ACCOUNTADMIN access within accounts" = FALSE — org-level only',
          '"Custom role not granted to SYSADMIN — ACCOUNTADMIN can still see its objects" = FALSE',
          '"Database roles work across databases" = FALSE — single database scope',
          '"SQL API supports username/password" = FALSE — OAuth or JWT only',
          '"Kafka connector uses OAuth" = FALSE — key-pair authentication',
          '"RSA_PRIVATE_KEY is set on the Snowflake user" = FALSE — RSA_PUBLIC_KEY is set, private stays local',
          '"SCIM provisions databases" = FALSE — provisions users and maps groups to roles',
          '"PUBLIC role can be revoked from a user" = FALSE — automatically granted to everyone, cannot be revoked',
          '"Granting to SYSADMIN is optional for custom roles" = FALSE — best practice requires it so SYSADMIN can manage all objects',
        ]} />
      </div>
    ),
  },
  {
    id: '2.2',
    label: '2.2 Governance',
    items: (
      <div className="space-y-3">
        <Accordion title="Dynamic Data Masking" badge="Enterprise+" badgeColor="bg-violet-100 text-violet-700" defaultOpen>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p>Conditionally mask column values based on querying role</p>
            <p><strong>NO ROLE BYPASSES</strong> masking policies — not even ACCOUNTADMIN</p>
            <p>Use <code className="bg-slate-100 px-1 rounded">IS_ROLE_IN_SESSION()</code> (not CURRENT_ROLE) to capture secondary roles</p>
            <p>Only <strong>one masking policy per column</strong> at a time</p>
          </div>
        </Accordion>

        <Accordion title="Tag-Based Masking Policies" badge="Enterprise+" badgeColor="bg-violet-100 text-violet-700">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p>Attach a masking policy to a <strong>tag</strong> → every column tagged with it is automatically protected</p>
            <p>Scales governance across thousands of columns without individual column assignments</p>
            <p>Tags <strong>propagate downstream through views</strong> (lineage) — masking follows the data</p>
            <p>Object tag limit: up to <strong>50 unique tag keys per object</strong></p>
            <p className="text-red-700">Tags alone do NOT enforce anything — enforcement requires an attached policy</p>
          </div>
        </Accordion>

        <Accordion title="Masking Policy Structure" badge="Memorize" badgeColor="bg-violet-100 text-violet-700">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p>A masking policy is composed of:</p>
            <p>✓ <strong>Single data type</strong> (input and output type must match)</p>
            <p>✓ <strong>One or more conditions</strong> (CASE/WHEN logic on role context)</p>
            <p>✓ <strong>One or more masking functions</strong> applied based on conditions</p>
            <p className="text-red-700 mt-2">A single policy CANNOT cover multiple data types — need separate policies per type</p>
          </div>
        </Accordion>

        <Accordion title="Privilege Grant Order for Read-Only Table Access" badge="Memorize" badgeColor="bg-violet-100 text-violet-700">
          <CodeSnip>{`-- Correct order to give a custom role read access to a table\nGRANT USAGE   ON DATABASE  my_db        TO ROLE my_role;\nGRANT USAGE   ON SCHEMA    my_db.my_sch TO ROLE my_role;\nGRANT SELECT  ON TABLE     my_db.my_sch.my_tbl TO ROLE my_role;`}</CodeSnip>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-2 text-xs">
            <p className="font-bold text-amber-700">Hierarchy walk: Database → Schema → Table</p>
            <p className="text-slate-700 mt-1">USAGE on the container is required to "see" the next level. The TABLE-level privilege itself is <strong>SELECT</strong> for read (NOT USAGE, NOT OPERATE).</p>
          </div>
        </Accordion>

        <Accordion title="Continuous Data Protection (CDP) Cost Optimization">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p>CDP cost = Time Travel storage + Fail-safe storage</p>
            <p><strong>High-churn dimension tables:</strong> use TRANSIENT tables to skip Fail-safe (saves 7 days of storage charges)</p>
            <p>Periodically copy/clone transient → permanent for backup if needed</p>
            <p className="text-red-700">Temporary tables are session-scoped — not a substitute for transient</p>
            <p className="text-red-700">Extending Time Travel (e.g., 30 days) INCREASES CDP costs significantly on high-churn tables</p>
          </div>
        </Accordion>

        <Accordion title="Row Access Policies" badge="Enterprise+" badgeColor="bg-violet-100 text-violet-700">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p>Filter rows based on querying role</p>
            <p><strong>NO ROLE BYPASSES</strong> row access policies</p>
            <p>CASE with no ELSE = NULL = FALSE = <strong>0 rows</strong> for unmentioned roles</p>
            <p>Can be applied to tables AND views</p>
          </div>
        </Accordion>

        <Accordion title="Data Classification & Object Tagging">
          <CompareTable
            headers={['Feature', 'Key Fact']}
            rows={[
              ['Object Tagging', 'Tags are metadata labels only — no enforcement by themselves. Must attach masking policy to tag.'],
              ['SYSTEM$CLASSIFY(table)', 'Analyzes content, assigns semantic + privacy tags. Supported: NUMBER, STRING, DATE, TIMESTAMP. NOT VARIANT/BINARY.'],
              ['Projection policies', 'Control which roles can SELECT a column (not INSERT)'],
              ['Aggregation policies', 'Require aggregation before returning data'],
            ]}
          />
        </Accordion>

        <Accordion title="Encryption & Key Management">
          <CompareTable
            headers={['Edition', 'Encryption']}
            rows={[
              ['All editions', 'AES-256 at rest, TLS 1.2 in transit'],
              ['Business Critical+', 'Tri-Secret Secure — customer-managed keys via cloud KMS'],
            ]}
          />
          <p className="text-xs text-slate-600 mt-2">Key rotation: automatic (annual) + customer-triggered option.</p>
        </Accordion>

        <Accordion title="Data Lineage">
          <CompareTable
            headers={['View / Object', 'Purpose']}
            rows={[
              ['ACCESS_HISTORY', 'Which objects/columns were read/written by queries'],
              ['OBJECT_DEPENDENCIES', 'View-to-table and other object references'],
              ['Trust Center', 'Security scanners (CIS benchmarks, threat intelligence). Evaluates account posture.'],
            ]}
          />
        </Accordion>

        <Traps list={[
          '"Tags enforce masking automatically" = FALSE — must attach policy to tag',
          '"ACCOUNTADMIN bypasses masking" = FALSE',
          '"Row access policy missing ELSE — unmentioned roles see all rows" = FALSE — 0 rows',
          '"SYSTEM$CLASSIFY works on VARIANT columns" = FALSE — primitive types only',
          '"Projection policy controls INSERT" = FALSE — controls SELECT/projection visibility',
        ]} />
      </div>
    ),
  },
  {
    id: '2.3',
    label: '2.3 Monitoring',
    items: (
      <div className="space-y-3">
        <Accordion title="Resource Monitors" defaultOpen>
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-3 text-xs space-y-1">
            <p><strong>Only ACCOUNTADMIN can CREATE</strong> — non-delegable</p>
            <p><strong>MONITOR + MODIFY are the LEAST privileges</strong> needed to view AND modify resource monitors (less than OWNERSHIP)</p>
            <p>Only track <strong>user-managed warehouse</strong> credits — NOT serverless</p>
            <p>Serverless (Snowpipe, auto-clustering, MVs, SOS) requires <strong>budgets</strong></p>
            <p>TRIGGERS clause in ALTER <strong>replaces</strong> all existing triggers (not additive)</p>
          </div>
          <CompareTable
            headers={['Privilege', 'Allows']}
            rows={[
              ['MONITOR', 'View resource monitor and its usage'],
              ['MODIFY', 'Change credit quotas, triggers, frequency'],
              ['OWNERSHIP', 'Everything above + transfer/drop'],
            ]}
          />
        </Accordion>

        <Accordion title="ACCOUNT_USAGE vs INFORMATION_SCHEMA vs ORGANIZATION_USAGE">
          <CompareTable
            headers={['Property', 'ACCOUNT_USAGE', 'INFORMATION_SCHEMA', 'ORGANIZATION_USAGE']}
            rows={[
              ['Latency', '45 min – 3 hours', 'Near real-time', '2+ hours'],
              ['Retention', '365 days', '7–14 days', '365 days'],
              ['Scope', 'Entire account', 'Current database only', 'All accounts in org'],
              ['Role required', 'IMPORTED PRIVILEGES on SNOWFLAKE DB', 'Any with DB access', 'ORGADMIN'],
            ]}
          />
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-2 text-xs">
            <p className="font-bold text-amber-700">Key ACCOUNT_USAGE views</p>
            <p className="text-slate-700 mt-1">QUERY_HISTORY, ACCESS_HISTORY, LOGIN_HISTORY, WAREHOUSE_METERING_HISTORY, TABLE_STORAGE_METRICS, GRANTS_TO_ROLES, GRANTS_TO_USERS</p>
            <p className="font-bold text-amber-700 mt-2">ORGANIZATION_USAGE use case</p>
            <p className="text-slate-700 mt-1">Cross-account billing analysis and credit consumption across the entire organization — requires ORGADMIN.</p>
          </div>
        </Accordion>

        <Traps list={[
          '"Resource monitors track Snowpipe credits" = FALSE — use budgets',
          '"ALTER RESOURCE MONITOR without TRIGGERS keeps old triggers" = TRUE — but WITH TRIGGERS replaces all',
          '"ACCOUNT_USAGE is real-time" = FALSE — 45 min – 3 hour latency',
          '"INFORMATION_SCHEMA retains 365 days" = FALSE — 7–14 days only',
        ]} />
      </div>
    ),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// DOMAIN 3: Data Loading & Connectivity
// ─────────────────────────────────────────────────────────────────────────────
const D3_SECTIONS = [
  {
    id: '3.1',
    label: '3.1 Loading',
    items: (
      <div className="space-y-3">
        <Accordion title="Optimal File Size & Compression" badge="Memorize" badgeColor="bg-amber-100 text-amber-700" defaultOpen>
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 text-xs space-y-1">
            <p className="font-bold text-teal-700">Recommended file size: <strong>100–250 MB compressed</strong></p>
            <p>Applies to both COPY INTO (bulk) and Snowpipe — balances parallelism vs per-file overhead</p>
            <p className="text-red-700 font-semibold">Too small: high per-file overhead, slow. Too large: limits parallelism.</p>
          </div>
          <CompareTable
            headers={['Compression', 'Notes']}
            rows={[
              ['GZIP', 'Default for PUT command'],
              ['BZIP2 / BROTLI / ZSTD / DEFLATE / RAW_DEFLATE', 'Supported for CSV/JSON'],
              ['Snappy', 'Typical native compression inside Parquet/ORC/Avro files'],
              ['AUTO_DETECT', 'COPY INTO detects compression automatically'],
            ]}
          />
        </Accordion>

        <Accordion title="File Formats Supported">
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 text-xs">
            <p className="font-bold text-teal-700 mb-1">Supported: CSV, JSON, Avro, ORC, Parquet, XML</p>
            <p className="text-red-700 font-semibold">NOT supported: Excel (.xlsx), PDF, binary — must convert first</p>
          </div>
          <CompareTable
            headers={['Option', 'Format', 'What it Does']}
            rows={[
              ['STRIP_OUTER_ARRAY', 'JSON only', 'Remove outer [ ] so each element = 1 row'],
              ['STRIP_NULL_VALUE', 'JSON', 'Convert JSON "null" to SQL NULL'],
              ['FIELD_OPTIONALLY_ENCLOSED_BY', 'CSV only', 'Character wrapping field values (e.g., \'"\'  )'],
              ['PARSE_HEADER', 'CSV', 'Read first row as column headers — enables MATCH_BY_COLUMN_NAME'],
              ['SKIP_HEADER', 'CSV', 'Skip N rows — does NOT parse headers as names'],
              ['ERROR_ON_COLUMN_COUNT_MISMATCH', 'CSV', 'Error if column counts differ (default TRUE)'],
            ]}
          />
        </Accordion>

        <Accordion title="Stage Types">
          <CompareTable
            headers={['Type', 'Reference', 'Scope', 'Cloneable?']}
            rows={[
              ['User stage', '@~', 'Per user (auto-created)', 'No'],
              ['Table stage', '@%table_name', 'Per table (auto-created)', 'No'],
              ['Named internal', '@my_stage', 'User-created standalone', 'NO — "Unsupported feature" error'],
              ['Named external', '@my_ext_stage', 'Points to S3/Azure/GCS', 'YES — metadata cloned'],
            ]}
          />
        </Accordion>

        <Accordion title="COPY INTO — Key Parameters">
          <CodeSnip>{`-- Loading (stage to table)\nCOPY INTO my_table FROM @my_stage FILE_FORMAT = (TYPE=CSV)\n\n-- With transformations\nCOPY INTO my_table(col1, col2)\n  FROM (SELECT $1, UPPER($2) FROM @my_stage) FILE_FORMAT = (TYPE=CSV)\n\n-- Unloading (table to stage)\nCOPY INTO @my_stage FROM my_table FILE_FORMAT = (TYPE=PARQUET)`}</CodeSnip>
          <CompareTable
            headers={['Parameter', 'What it Does']}
            rows={[
              ['ON_ERROR', 'ABORT_STATEMENT (default bulk) / SKIP_FILE (default Snowpipe) / CONTINUE / SKIP_FILE_n'],
              ['VALIDATION_MODE', 'Dry-run: RETURN_ALL_ERRORS, RETURN_n_ROWS — NO DATA LOADED'],
              ['FORCE', 'Bypass metadata dedup. Reload already-loaded files. RISK: duplicates.'],
              ['MATCH_BY_COLUMN_NAME', 'Match by name not position (CASE_SENSITIVE / CASE_INSENSITIVE)'],
              ['PURGE', 'Delete files from stage after successful load'],
              ['TRUNCATECOLUMNS', 'Truncate strings exceeding column length instead of erroring'],
            ]}
          />
        </Accordion>

        <Accordion title="Load Metadata Dedup & METADATA$ Columns">
          <CompareTable
            headers={['Method', 'Retention', 'Consequence']}
            rows={[
              ['Bulk COPY INTO', '64 days', 'Files within 64 days are skipped (unless FORCE)'],
              ['Snowpipe', '14 days', 'Files within 14 days are skipped'],
            ]}
          />
          <CompareTable
            headers={['Pseudo-column', 'Returns']}
            rows={[
              ['METADATA$FILENAME', 'Source filename'],
              ['METADATA$FILE_ROW_NUMBER', 'Row number within the source file'],
              ['METADATA$FILE_CONTENT_KEY', 'MD5 hash of the staged file content'],
              ['METADATA$FILE_LAST_MODIFIED', 'Last-modified timestamp of the staged file'],
              ['METADATA$START_SCAN_TIME', 'Timestamp when COPY/Snowpipe started scanning this file (additional load tracking)'],
            ]}
          />
        </Accordion>

        <Accordion title="PUT / GET / REMOVE">
          <CompareTable
            headers={['Command', 'Direction', 'Stage Type', 'Requires']}
            rows={[
              ['PUT', 'Local file → internal stage', 'Internal ONLY', 'Local filesystem (SnowSQL, drivers)'],
              ['GET', 'Internal stage → local file', 'Internal ONLY', 'Local filesystem'],
              ['REMOVE (RM)', 'Delete files from stage', 'Internal', 'N/A'],
            ]}
          />
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-2 text-xs space-y-1">
            <p>PUT auto-compresses with gzip by default</p>
            <p>PUT supports subfolder paths: @my_stage/2026/april/</p>
            <p>PUT does NOT work from Snowsight (no local filesystem)</p>
            <p>No RENAME or MOVE commands for staged files</p>
          </div>
        </Accordion>

        <Traps list={[
          '"STRIP_OUTER_ARRAY is for CSV" = FALSE — JSON only',
          '"SKIP_HEADER = 1 enables MATCH_BY_COLUMN_NAME" = FALSE — need PARSE_HEADER = TRUE',
          '"ON_ERROR default is the same for COPY and Snowpipe" = FALSE — ABORT vs SKIP_FILE',
          '"VALIDATION_MODE loads data and returns errors" = FALSE — no data loaded (dry-run)',
          '"FORCE = TRUE is safe" = FALSE — creates duplicate rows',
          '"File loaded 50 days ago, COPY without FORCE: loads again" = FALSE — 50 < 64 → skipped',
          '"File loaded via Snowpipe 10 days ago, same file re-arrives: loads again" = FALSE — 10 < 14 → skipped',
          '"Internal stages can be cloned" = FALSE — external stages CAN',
        ]} />
      </div>
    ),
  },
  {
    id: '3.2',
    label: '3.2 Automation',
    items: (
      <div className="space-y-3">
        <Accordion title="Snowpipe & Snowpipe Streaming" defaultOpen>
          <CompareTable
            headers={['Feature', 'Key Facts']}
            rows={[
              ['Snowpipe', 'Serverless compute (no user warehouse). AUTO_INGEST=TRUE (cloud events) or REST API trigger.'],
              ['Snowpipe default ON_ERROR', 'SKIP_FILE — not ABORT_STATEMENT (opposite of bulk COPY)'],
              ['Snowpipe REST API endpoints', 'insertFiles (trigger load), insertReport (load status), loadHistoryScan (query history)'],
              ['Snowpipe Streaming', 'Via Ingest SDK. Inserts rows DIRECTLY without staging files. Sub-minute latency.'],
              ['Snowpipe vs Bulk COPY', 'Snowpipe = continuous micro-batches, serverless billing per-file. Bulk = scheduled, your warehouse.'],
            ]}
          />
        </Accordion>

        <Accordion title="Streams">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p>Track INSERT/UPDATE/DELETE on source table</p>
            <p>Offset advances after <strong>successful DML consumption</strong> (returns 0 rows after)</p>
            <p><code className="bg-slate-100 px-1 rounded">SYSTEM$STREAM_HAS_DATA()</code> — returns TRUE/FALSE (used in task WHEN clauses)</p>
            <p>Stale if unconsumed past table retention — must DROP and RECREATE (cannot ALTER)</p>
            <p><code className="bg-slate-100 px-1 rounded">CHANGE_TRACKING = TRUE</code> enables CHANGES clause without a stream</p>
          </div>
        </Accordion>

        <Accordion title="Tasks">
          <CompareTable
            headers={['Concept', 'Detail']}
            rows={[
              ['Root task', 'Has SCHEDULE (CRON or interval)'],
              ['Child tasks', 'NO schedule — triggered by predecessors in DAG'],
              ['Minimum schedule (warehouse)', '1 minute'],
              ['Minimum schedule (serverless)', '~10 seconds (newer feature)'],
              ['WHEN clause FALSE', 'Task skipped entirely (zero compute, not 0 rows)'],
              ['OPERATE privilege', 'Required to resume/suspend/execute'],
              ['Serverless tasks', 'No WAREHOUSE — uses USER_TASK_MANAGED_INITIAL_WAREHOUSE_SIZE'],
              ['ALLOW_OVERLAPPING_EXECUTION', 'FALSE (default) — skips if previous still running'],
            ]}
          />
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-2 text-xs">
            <p className="font-bold text-amber-700">CRON syntax includes timezone</p>
            <p className="text-slate-700 mt-1"><code className="bg-slate-100 px-1 rounded">USING CRON 0 9 * * MON America/New_York</code> — timezone is mandatory for CRON-based tasks</p>
          </div>
        </Accordion>

        <Accordion title="Dynamic Tables">
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 text-xs space-y-1">
            <p>Defined by a SELECT query + TARGET_LAG</p>
            <p>Snowflake auto-maintains freshness</p>
            <p><strong>Supports JOINs</strong> — unlike materialized views (single table only)</p>
          </div>
        </Accordion>

        <Traps list={[
          '"Snowpipe uses a user warehouse" = FALSE — serverless',
          '"Snowpipe Streaming requires staging files" = FALSE — direct row insertion',
          '"Stale streams can be refreshed with ALTER STREAM" = FALSE — must drop/recreate',
          '"Child tasks in a DAG can have their own SCHEDULE" = FALSE — root task only',
          '"WHEN FALSE = task runs but processes 0 rows" = FALSE — task is skipped, no compute',
          '"Dynamic tables are limited to one base table like MVs" = FALSE — support JOINs',
        ]} />
      </div>
    ),
  },
  {
    id: '3.3',
    label: '3.3 Connectivity',
    items: (
      <div className="space-y-3">
        <Accordion title="Connectors & Drivers" defaultOpen>
          <CompareTable
            headers={['Connector/Driver', 'Use']}
            rows={[
              ['Python Connector', 'Python applications'],
              ['Kafka Connector', 'Streaming ingestion from Kafka (key-pair auth)'],
              ['Spark Connector', 'Spark–Snowflake data exchange'],
              ['JDBC / ODBC', 'Standard database connectivity'],
              ['Node.js, Go, .NET', 'Language-specific drivers'],
            ]}
          />
        </Accordion>

        <Accordion title="Integration Types">
          <CompareTable
            headers={['Integration', 'Purpose']}
            rows={[
              ['Storage integration', 'IAM trust for S3/Azure/GCS access. No inline credentials.'],
              ['API integration', 'Trusted external HTTP endpoints (for external functions, webhooks)'],
              ['Git integration', 'Sync code files from Git repo into Snowflake stage'],
              ['Notification integration', 'Email/webhook delivery for alerts and budgets'],
            ]}
          />
        </Accordion>

        <Traps list={[
          '"Storage integration stores AWS keys" = FALSE — stores Snowflake IAM user ARN; customer grants trust',
          '"API integration is for loading data from REST APIs" = FALSE — for external functions and notifications',
          '"Git integration versions table data" = FALSE — syncs code files (SQL, Python)',
        ]} />
      </div>
    ),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// DOMAIN 4: Performance
// ─────────────────────────────────────────────────────────────────────────────
const D4_SECTIONS = [
  {
    id: '4.1',
    label: '4.1 Query Perf',
    items: (
      <div className="space-y-3">
        <Accordion title="Query Profile Indicators" defaultOpen>
          <CompareTable
            headers={['Indicator', 'Meaning', 'Action']}
            rows={[
              ['Bytes spilled to local storage', 'Moderate impact. WH memory exceeded.', 'Consider upsizing'],
              ['Bytes spilled to remote storage', 'SEVERE. Both memory and SSD exceeded.', 'Upsize warehouse'],
              ['Inefficient pruning', 'Too many partitions scanned', 'Review clustering key or filters'],
              ['Exploding joins', 'Missing/non-selective join = Cartesian product', 'Fix join condition, deduplicate source'],
              ['Queuing', 'Queries waiting for compute', 'Scale OUT (more clusters) or dedicated WH'],
            ]}
          />
        </Accordion>

        <Accordion title="Spilling — Two Recommended Fixes" badge="Memorize" badgeColor="bg-amber-100 text-amber-700">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p>1. <strong>Use a larger warehouse</strong> — more memory per node (Scale UP)</p>
            <p>2. <strong>Fetch only required columns</strong> — avoid SELECT * to reduce data volume in memory</p>
            <p className="text-red-700 mt-2">Multi-cluster (Scale OUT) does NOT fix spilling — only adds concurrency for queueing</p>
            <p className="text-red-700">Cloning the table does NOT help</p>
          </div>
        </Accordion>

        <Accordion title="Pruning Analysis in Query Profile" badge="Memorize" badgeColor="bg-amber-100 text-amber-700">
          <CompareTable
            headers={['Attribute', 'What it Tells You']}
            rows={[
              ['Partitions Total', 'Total micro-partitions in the table'],
              ['Partitions Scanned', 'How many were actually read'],
              ['Ratio (Scanned / Total)', 'High ratio = poor pruning. Low ratio = effective pruning.'],
              ['Bytes Scanned', 'Raw data volume read after pruning'],
              ['% Scanned from Cache', 'Hit rate on warehouse SSD cache (separate from pruning)'],
            ]}
          />
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-2 text-xs">
            <p className="font-bold text-amber-700">Bad pruning indicator</p>
            <p className="text-slate-700 mt-1">If "Partitions Scanned" is close to "Partitions Total," your filter columns aren't aligned with clustering. Consider clustering keys, rewrite filters, or add SOS for selective lookups.</p>
          </div>
        </Accordion>

        <Accordion title="DML That Triggers Re-clustering">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p>Automatic re-clustering is triggered by data-modifying operations:</p>
            <p>✓ <strong>INSERT</strong>, <strong>UPDATE</strong>, <strong>DELETE</strong>, <strong>MERGE</strong>, <strong>COPY INTO</strong> (load)</p>
            <p className="text-red-700 mt-2">Read-only operations do NOT trigger re-clustering: SELECT, SHOW, DESCRIBE, USE</p>
            <p>Re-clustering uses serverless credits — billed separately, not against your warehouse</p>
          </div>
        </Accordion>

        <Accordion title="ACCOUNT_USAGE Performance Views">
          <CompareTable
            headers={['View', 'Purpose']}
            rows={[
              ['QUERY_HISTORY', 'Query text, duration, warehouse, bytes scanned, user'],
              ['WAREHOUSE_METERING_HISTORY', 'Credit consumption per warehouse over time'],
              ['ACCESS_HISTORY', 'Column-level access tracking (lineage)'],
            ]}
          />
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-2 text-xs">
            <p className="font-bold text-amber-700">Query Attribution / QUERY_TAG</p>
            <p className="text-slate-700 mt-1">Track who ran what on which warehouse. Use <code className="bg-slate-100 px-1 rounded">QUERY_TAG</code> session parameter for custom labels. Appears in QUERY_HISTORY for filtering and cost allocation.</p>
          </div>
        </Accordion>

        <Traps list={[
          '"Spilling to local = critical" = FALSE — moderate; REMOTE spilling is critical',
          '"Exploding joins = out of memory" = FALSE — means Cartesian product from bad join condition',
          '"Queuing = scale up" = FALSE — queuing = scale OUT with multi-cluster',
          '"Multi-cluster fixes spilling" = FALSE — Scale UP fixes spilling; Scale OUT fixes queueing',
          '"SELECT triggers re-clustering" = FALSE — only DML (INSERT/UPDATE/DELETE/MERGE/COPY)',
          '"Bytes Scanned attribute alone proves bad pruning" = FALSE — compare Partitions Scanned vs Partitions Total',
        ]} />
      </div>
    ),
  },
  {
    id: '4.2',
    label: '4.2 Optimization',
    items: (
      <div className="space-y-3">
        <Accordion title="When to Use Which Optimization" badge="Decision Guide" badgeColor="bg-amber-100 text-amber-700" defaultOpen>
          <CompareTable
            headers={['Pattern', 'Best Option']}
            rows={[
              ['Equality lookup on high-cardinality column (WHERE id = 123)', 'Search Optimization Service (SOS)'],
              ['Range scan on low-medium cardinality (WHERE date BETWEEN)', 'Clustering key'],
              ['Complex aggregation on pre-filtered subset', 'Materialized view'],
              ['Ad-hoc BI queries scanning large tables', 'Query Acceleration Service (QAS)'],
            ]}
          />
        </Accordion>

        <Accordion title="Query Acceleration Service (QAS)" badge="Enterprise+" badgeColor="bg-amber-100 text-amber-700">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p>Serverless. Offloads portions of eligible queries to additional compute.</p>
            <p>Best for: ad-hoc/BI queries with large scans and selective filters</p>
            <p><code className="bg-slate-100 px-1 rounded">ALTER WAREHOUSE SET ENABLE_QUERY_ACCELERATION = TRUE</code></p>
            <p className="text-red-700">NOT for: data loading, DDL, stored procedures</p>
          </div>
        </Accordion>

        <Accordion title="Search Optimization Service (SOS)" badge="Enterprise+" badgeColor="bg-amber-100 text-amber-700">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p>Creates persistent "search access paths" (index-like structures)</p>
            <p>Best for: selective equality and IN lookups on HIGH-CARDINALITY columns</p>
            <p>Background serverless maintenance process</p>
            <p className="text-red-700">NOT clustering — does not reorganize data</p>
          </div>
        </Accordion>

        <Accordion title="Clustering Keys">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p>Best columns: DATE, TIMESTAMP, low-to-medium cardinality in WHERE/JOIN</p>
            <p>Put <strong>lower cardinality first</strong> in multi-column keys</p>
            <p><code className="bg-slate-100 px-1 rounded">SYSTEM$CLUSTERING_INFORMATION(table, '(col)')</code>: average_depth near 1 = well-clustered</p>
            <p>Automatic Clustering: serverless — NOT tracked by resource monitors</p>
            <p className="font-bold text-amber-700 mt-2">Recommended threshold: tables larger than ~1 TB</p>
            <p>Smaller tables don't benefit — natural load order is sufficient, and re-clustering wastes serverless credits</p>
          </div>
        </Accordion>

        <Accordion title="Materialized Views" badge="Enterprise+" badgeColor="bg-amber-100 text-amber-700">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p>Pre-computed results. Auto-refreshed (serverless). Consumes credits for maintenance.</p>
            <p><strong>ONE base table only</strong> — no JOINs, no subqueries on other tables</p>
            <p>Enterprise Edition required</p>
          </div>
        </Accordion>

        <Traps list={[
          '"SOS clusters the table" = FALSE — creates access paths, does not reorganize',
          '"Clustering key on high-cardinality column (unique per row)" = BAD — expensive reclustering',
          '"MV supports JOINs" = FALSE — use Dynamic Tables for JOINs',
          '"QAS works for data loading" = FALSE — for queries only',
          '"Resource monitors track automatic clustering credits" = FALSE — use budgets',
        ]} />
      </div>
    ),
  },
  {
    id: '4.3',
    label: '4.3 Caching',
    items: (
      <div className="space-y-3">
        <Accordion title="Three Cache Layers" badge="Memorize" badgeColor="bg-amber-100 text-amber-700" defaultOpen>
          <CompareTable
            headers={['Cache', 'Location', 'Survives Suspend?', 'Duration', 'Contents']}
            rows={[
              ['Result cache', 'Cloud Services', 'YES', '24 h per reuse; max 31 days if continuously reused', 'Complete query output'],
              ['Metadata cache', 'Cloud Services', 'YES', 'Always on', 'Row counts, min/max, distinct counts'],
              ['Warehouse (SSD) cache', 'Compute nodes', 'NO — wiped', 'While running', 'Raw data from remote storage'],
            ]}
          />
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-2 text-xs">
            <p className="font-bold text-amber-700">Result cache is account-level (Cloud Services)</p>
            <p className="text-slate-700 mt-1">Any warehouse — or no warehouse — can hit a cached result. The result does NOT belong to the warehouse that created it.</p>
          </div>
        </Accordion>

        <Accordion title="Result Cache Rules & Invalidation Triggers" badge="Exam Fave" badgeColor="bg-blue-100 text-blue-700">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p className="font-bold text-slate-700">Cache HIT requires ALL of:</p>
            <p>✓ Identical query text (character-for-character)</p>
            <p>✓ Underlying micro-partitions unchanged since last run</p>
            <p>✓ Same role context (if masking/row-access policies exist)</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mt-2 text-xs space-y-1">
            <p className="font-bold text-red-700">Cache is INVALIDATED by any of:</p>
            <p>✗ Any DML on the underlying tables (INSERT, UPDATE, DELETE, MERGE)</p>
            <p>✗ Non-deterministic functions: CURRENT_TIMESTAMP(), CURRENT_DATE(), RANDOM(), UUID_STRING()</p>
            <p>✗ UDFs not marked as deterministic</p>
            <p>✗ Changes in data masking or row access policies</p>
            <p>✗ Query text changed (even whitespace or alias)</p>
          </div>
        </Accordion>

        <Accordion title="Metadata Cache Shortcuts">
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 text-xs space-y-1">
            <p><code className="bg-slate-100 px-1 rounded">COUNT(*)</code> on a large table with no WHERE → answered from metadata <strong>instantly (no warehouse)</strong></p>
            <p>MIN/MAX on clustering key columns → may be answered from metadata</p>
          </div>
        </Accordion>

        <Traps list={[
          '"Result cache requires the same warehouse" = FALSE — account-level, any warehouse hits it',
          '"Result cache persists indefinitely" = FALSE — 24 h per reuse, hard max 31 days',
          '"SSD cache survives suspend" = FALSE — completely wiped',
          '"Two users, same query, different roles, table has masking policy → share cache" = FALSE — role-specific',
          '"COUNT(*) requires a warehouse" = FALSE — can be answered from metadata cache',
          '"CURRENT_DATE() in a query hits the result cache" = FALSE — non-deterministic, always re-executes',
        ]} />
      </div>
    ),
  },
  {
    id: '4.4',
    label: '4.4 Transforms',
    items: (
      <div className="space-y-3">
        <Accordion title="Semi-structured Data (VARIANT)" defaultOpen>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p>Stored in VARIANT columns (JSON, Avro, Parquet, XML)</p>
            <p>Access: <code className="bg-slate-100 px-1 rounded">data:key</code> (colon for first level), <code className="bg-slate-100 px-1 rounded">data:key.nested</code></p>
            <p>Both <code className="bg-slate-100 px-1 rounded">data:L1:L2</code> and <code className="bg-slate-100 px-1 rounded">data:L1.L2</code> work. <code className="bg-slate-100 px-1 rounded">data.L1.L2</code> (all dots) FAILS.</p>
            <p>Arrays: 0-indexed. Third element = <code className="bg-slate-100 px-1 rounded">[2]</code></p>
            <p>Extraction returns VARIANT type. Cast with <code className="bg-slate-100 px-1 rounded">::VARCHAR</code>, <code className="bg-slate-100 px-1 rounded">::INTEGER</code> for native types.</p>
          </div>
        </Accordion>

        <Accordion title="Key Functions">
          <CompareTable
            headers={['Function', 'Purpose']}
            rows={[
              ['PARSE_JSON(string)', 'String → VARIANT'],
              ['TO_JSON(variant)', 'VARIANT → String'],
              ['FLATTEN(input => v)', 'Explode array/object into rows. NULL/empty excluded unless OUTER => TRUE.'],
              ['OBJECT_CONSTRUCT(k,v,...)', 'Build JSON from key-value pairs (single row)'],
              ['OBJECT_AGG(key_col, val_col)', 'Aggregate rows into JSON object'],
              ['ARRAY_AGG(col)', 'Aggregate rows into array'],
              ['LISTAGG(col, delim)', 'Concatenate values from rows into delimited string'],
              ['HASH_AGG(*)', 'Single hash of entire result set (for table comparison)'],
              ['QUALIFY', 'Filter on window function results without a subquery'],
              ['RESULT_SCAN(LAST_QUERY_ID())', 'Reuse previous query output'],
            ]}
          />
        </Accordion>

        <Accordion title="Conditional Functions">
          <CompareTable
            headers={['Function', 'What it Does']}
            rows={[
              ['IFF(cond, true_val, false_val)', 'Inline IF-THEN-ELSE'],
              ['NVL(expr, replacement)', 'If NULL, return replacement'],
              ['NVL2(expr, not_null_val, null_val)', 'If NOT NULL return 2nd arg; if NULL return 3rd'],
              ['COALESCE(a, b, c, ...)', 'First non-NULL argument'],
              ['ZEROIFNULL(expr)', 'NULL → 0'],
              ['NULLIFZERO(expr)', '0 → NULL'],
            ]}
          />
        </Accordion>

        <Accordion title="Stored Procedures vs UDFs">
          <CompareTable
            headers={['Feature', 'Stored Procedures', 'UDFs / UDTFs']}
            rows={[
              ['Execute DDL/DML', 'YES', 'NO'],
              ['EXECUTE AS OWNER', 'Default — owner\'s privileges', 'N/A'],
              ['EXECUTE AS CALLER', 'Caller\'s privileges', 'N/A'],
              ['Return type', 'Single value', 'Scalar or tabular'],
            ]}
          />
        </Accordion>

        <Accordion title="Window Functions & QUALIFY">
          <CodeSnip>{`-- QUALIFY filters window function results without a subquery\nSELECT * FROM t\nQUALIFY ROW_NUMBER() OVER (PARTITION BY grp ORDER BY val) = 1\n\n-- Running total\nSELECT SUM(amount) OVER (ORDER BY dt ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)\n\n-- Deduplicate before MERGE to avoid "duplicate row" error\nMERGE INTO target USING (SELECT DISTINCT ... FROM source) src ON ...`}</CodeSnip>
        </Accordion>

        <Accordion title="MERGE Non-Determinism">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p><code className="bg-slate-100 px-1 rounded">ERROR_ON_NONDETERMINISTIC_MERGE</code> — defaults to <strong>TRUE</strong></p>
            <p>If multiple source rows match a single target row → <strong>error</strong> (prevents undefined winner)</p>
            <p>Set to FALSE to allow non-deterministic behavior (last-write-wins, undefined)</p>
            <p className="text-green-700 font-semibold">Best practice: deduplicate source with QUALIFY ROW_NUMBER()=1 before MERGE</p>
          </div>
        </Accordion>

        <Traps list={[
          '"QUALIFY is the same as HAVING" = FALSE — QUALIFY = window functions, HAVING = aggregates',
          '"NVL2 returns the second arg when NULL" = FALSE — returns THIRD arg when NULL',
          '"MERGE with duplicate source rows matching one target" = ERROR — must deduplicate first',
          '"GROUP_CONCAT exists in Snowflake" = FALSE — use LISTAGG',
          '"RUNNING_TOTAL() function exists" = FALSE — use SUM with window frame',
          '"UDFs can execute INSERT statements" = FALSE — only stored procedures',
          '"External functions run on the Snowflake warehouse" = FALSE — run on external service',
          '"ERROR_ON_NONDETERMINISTIC_MERGE defaults to FALSE" = FALSE — it defaults to TRUE (errors on ambiguous match)',
        ]} />
      </div>
    ),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// DOMAIN 5: Data Collaboration
// ─────────────────────────────────────────────────────────────────────────────
const D5_SECTIONS = [
  {
    id: '5.1',
    label: '5.1 Collaboration',
    items: (
      <div className="space-y-3">
        <Accordion title="Zero-Copy Cloning" defaultOpen>
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs space-y-1">
            <p>Zero-copy: no additional storage until data diverges</p>
            <p>Clones inherit source retention at clone time</p>
            <p>Captures transactional snapshot — concurrent DML does NOT affect it</p>
          </div>
          <CompareTable
            headers={['Object', 'Cloneable?', 'Notes']}
            rows={[
              ['Databases', 'YES', 'Full hierarchy'],
              ['Schemas', 'YES', 'All objects within'],
              ['Permanent tables', 'YES', ''],
              ['Transient tables', 'YES', 'Must say CREATE TRANSIENT TABLE ... CLONE'],
              ['External stages', 'YES', 'Metadata/URL pointer only'],
              ['Internal stages', 'NO', '"Unsupported feature" error'],
              ['External tables', 'NO', 'Excluded from DB clones too'],
              ['Dynamic tables', 'NO', ''],
              ['Pipes', 'Partially', 'Cloned SUSPENDED — load history is NOT cloned'],
              ['Tasks', 'YES', 'Cloned in SUSPENDED state — must manually resume'],
              ['Streams', 'YES', 'Clone inherits source offset at clone time'],
              ['Shares, warehouses', 'NO', ''],
            ]}
          />
        </Accordion>

        <Accordion title="DATA_RETENTION_TIME_IN_DAYS = 0" badge="Exam Trap" badgeColor="bg-red-100 text-red-700">
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs space-y-1">
            <p>Setting retention to <strong>0 disables Time Travel entirely</strong> for that object</p>
            <p>Dropped/updated data is <strong>immediately unrecoverable</strong> via Time Travel</p>
            <p>Permanent tables still have <strong>Fail-safe (7 days)</strong> — but that is Support-only</p>
            <p>Transient tables with 0 retention = <strong>zero protection</strong> (no TT, no Fail-safe)</p>
            <p className="text-red-700 font-semibold">UNDROP will FAIL if data retention = 0</p>
          </div>
        </Accordion>

        <Accordion title="Time Travel">
          <CompareTable
            headers={['Edition / Type', 'Max Retention']}
            rows={[
              ['Standard Edition — permanent tables', '1 day (0–1 day)'],
              ['Enterprise+ — permanent tables', '90 days (0–90 days)'],
              ['Transient / Temporary — ALL editions', '1 day (0–1 day)'],
            ]}
          />
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mt-2 text-xs space-y-1">
            <p>Works for DML (INSERT, UPDATE, DELETE, MERGE) AND DROP</p>
            <p>AT(OFFSET =&gt; -300) = 300 SECONDS ago (not rows, not minutes)</p>
            <p>MAX_DATA_EXTENSION_TIME_IN_DAYS (default 14): extends retention to keep streams from going stale</p>
          </div>
        </Accordion>

        <Accordion title="Fail-safe">
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs space-y-1">
            <p>7 days for permanent tables. 0 days for transient/temporary.</p>
            <p><strong>ONLY Snowflake Support</strong> can attempt recovery — NOT user-accessible</p>
            <p>UNDROP is Time Travel (user-accessible). Fail-safe is Support-only.</p>
            <p>Total protection = Time Travel + Fail-safe (e.g., 10 + 7 = 17 days)</p>
          </div>
        </Accordion>

        <Accordion title="Data Replication & Failover">
          <CompareTable
            headers={['Feature', 'Key Fact']}
            rows={[
              ['Replication group', 'Replicate objects to target accounts. Secondary is READ-ONLY.'],
              ['Failover group', 'Extends replication with read-write failover to secondary'],
              ['Scope', 'Works cross-region AND cross-cloud'],
              ['Objects replicable', 'Databases, shares, roles, users, warehouses, resource monitors, network policies'],
            ]}
          />
        </Accordion>

        <Accordion title="UNDROP">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p>Works within Time Travel retention period</p>
            <p>UNDROP TABLE, UNDROP SCHEMA, UNDROP DATABASE</p>
            <p className="text-red-700">Does NOT work for: stages, pipes, warehouses, views</p>
          </div>
        </Accordion>

        <Traps list={[
          '"CREATE TABLE ... CLONE transient_table" = FAILS — must say CREATE TRANSIENT TABLE ... CLONE',
          '"External tables are included in database clones" = FALSE — excluded entirely',
          '"Clone consumes storage immediately" = FALSE — zero-copy until divergence',
          '"Time Travel only works for dropped tables" = FALSE — works for DML too',
          '"Standard Edition supports 90-day Time Travel" = FALSE — 1 day max',
          '"Fail-safe is user-accessible via UNDROP" = FALSE — Fail-safe is Support-only; UNDROP is Time Travel',
          '"Transient tables have 1-day Fail-safe" = FALSE — 0 days always',
          '"Replication group supports failover" = FALSE — that is failover group',
          '"Replicated databases are writable on the secondary" = FALSE — read-only until failover',
        ]} />
      </div>
    ),
  },
  {
    id: '5.2',
    label: '5.2 Sharing',
    items: (
      <div className="space-y-3">
        <Accordion title="What CAN and CANNOT Be Shared" badge="Memorize" badgeColor="bg-amber-100 text-amber-700" defaultOpen>
          <CompareTable
            headers={['CAN Share', 'CANNOT Share']}
            rows={[
              ['Tables (permanent, external, Iceberg)', 'Standard (non-secure) views'],
              ['Secure views', 'Standard UDFs'],
              ['Secure UDFs', 'Stored procedures'],
              ['Secure materialized views', 'Stages (any type)'],
              ['Dynamic tables', 'Sequences'],
              ['', 'File formats, Pipes, Tasks, Streams, Warehouses'],
            ]}
          />
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-2 text-xs">
            <p className="font-bold text-amber-700">ACCOUNTADMIN required to create and manage shares</p>
            <p className="text-slate-700 mt-1">Only ACCOUNTADMIN (or a role with CREATE SHARE privilege) can create a share object.</p>
          </div>
        </Accordion>

        <Accordion title="Direct Shares">
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs space-y-1">
            <p>Same region ONLY</p>
            <p>Zero-copy (no additional storage)</p>
            <p>Consumer access is READ-ONLY — no INSERT/UPDATE/DELETE/MERGE/CLONE</p>
            <p>Consumer <strong>CANNOT run Time Travel queries</strong> on shared objects</p>
            <p>Consumer <strong>CANNOT clone</strong> shared objects (no OWNERSHIP on them)</p>
            <p>Only SECURE views and SECURE UDFs can be added (standard views rejected)</p>
          </div>
          <CompareTable
            headers={['Event', 'Effect on Consumer']}
            rows={[
              ['Provider adds table/column', 'Automatically visible (no action needed)'],
              ['Provider drops shared table', 'Immediately inaccessible'],
              ['Provider revokes the share', 'Consumer DB becomes empty (shell remains)'],
              ['Consumer tries to clone', 'FAILS — no OWNERSHIP'],
              ['Consumer tries to INSERT', 'FAILS — read-only'],
            ]}
          />
        </Accordion>

        <Accordion title="Reader Accounts" badge="Big Trap" badgeColor="bg-red-100 text-red-700">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs space-y-1">
            <p>Consumer without their own Snowflake account — provider creates and PAYS for everything</p>
            <p>Maximum <strong>20 reader accounts</strong> per provider account (default limit)</p>
          </div>
          <CompareTable
            headers={['Reader CAN do', 'Reader CANNOT do']}
            rows={[
              ['Create warehouses', 'CREATE SHARE'],
              ['Create databases, schemas, tables', 'CREATE PIPE'],
              ['Run queries (SELECT, JOIN)', 'CREATE STAGE'],
              ['Create views', 'Access Marketplace'],
              ['Create users/roles within account', 'SHOW PROCEDURES'],
            ]}
          />
        </Accordion>

        <Traps list={[
          '"Direct shares work cross-region" = FALSE — same region only; use Listings for cross-region',
          '"Standard views can be shared" = FALSE — only SECURE views',
          '"Consumer must refresh to see new objects in share" = FALSE — automatic',
          '"Revoking share = consumer DB is dropped" = FALSE — DB shell remains, objects inaccessible',
          '"Consumer can clone shared data" = FALSE — no OWNERSHIP on shared objects',
          '"Consumer can query historical data via Time Travel on shared table" = FALSE — TT not available on shared objects',
          '"Reader Accounts cannot create warehouses" = FALSE — they can (provider pays)',
          '"Reader Accounts cannot create any objects" = FALSE — can create DBs, tables, etc.',
          '"Any role can create a share" = FALSE — requires ACCOUNTADMIN or CREATE SHARE privilege',
          '"Reader Account limit is 100 per account" = FALSE — default limit is 20',
        ]} />
      </div>
    ),
  },
  {
    id: '5.3',
    label: '5.3 Marketplace',
    items: (
      <div className="space-y-3">
        <Accordion title="Listings vs Direct Shares" defaultOpen>
          <CompareTable
            headers={['Feature', 'Direct Share', 'Listing']}
            rows={[
              ['Cross-region', 'NO', 'YES (Cross-Cloud Auto-Fulfillment)'],
              ['Monetization', 'NO', 'YES (providers can charge)'],
              ['Discovery', 'Must know provider account', 'Searchable in Marketplace'],
              ['Multiple consumers', 'Must grant each individually', 'Discoverable by anyone (public) or invited (private)'],
            ]}
          />
        </Accordion>

        <Accordion title="Native Apps">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p>Packaged applications (code + data + Streamlit UI)</p>
            <p>Distributed via Marketplace</p>
            <p>Consumer installs in their own account</p>
            <p>Runs with <strong>consumer's compute</strong> — NOT provider's</p>
          </div>
        </Accordion>

        <Accordion title="Data Clean Rooms" badge="Memorize" badgeColor="bg-rose-100 text-rose-700">
          <CompareTable
            headers={['Provider Tasks', 'Consumer Tasks']}
            rows={[
              ['Create the clean room', 'Install (join) the clean room'],
              ['Add (link) data to the clean room', 'Link their own data to the clean room'],
              ['Define allowed templates / queries', 'Run analyses using approved templates'],
              ['Manage privacy rules', 'View aggregated/permitted results'],
            ]}
          />
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-2 text-xs">
            <p className="font-bold text-amber-700">Privacy guarantee</p>
            <p className="text-slate-700 mt-1">Both parties contribute data, but neither sees the other's raw rows — analysis runs on combined data with controlled output (typically aggregated).</p>
          </div>
        </Accordion>

        <Accordion title="SYSTEM$IS_LISTING_PURCHASED — Marketplace Gating">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p>System function used inside <strong>secure views or secure UDFs</strong> on shared data</p>
            <p>Returns TRUE if the consumer has purchased the Marketplace listing (paid)</p>
            <p>Lets providers gate premium data behind a paywall while keeping a single share</p>
          </div>
          <CodeSnip>{`-- Show full data only to paying consumers; redact otherwise\nCREATE SECURE VIEW premium_data AS\nSELECT\n  customer_id,\n  CASE WHEN SYSTEM$IS_LISTING_PURCHASED('LISTING_ID')\n    THEN sensitive_value\n    ELSE NULL\n  END AS sensitive_value\nFROM raw_data;`}</CodeSnip>
        </Accordion>

        <Accordion title="Numbers to Memorize" badge="Cheat Sheet" badgeColor="bg-rose-100 text-rose-700">
          <CompareTable
            headers={['Concept', 'Value']}
            rows={[
              ['Fail-safe (permanent)', '7 days'],
              ['Fail-safe (transient/temporary)', '0 days'],
              ['Time Travel max (Standard)', '1 day'],
              ['Time Travel max (Enterprise+, permanent)', '90 days'],
              ['Time Travel max (transient/temporary, all editions)', '1 day'],
              ['DATA_RETENTION = 0', 'Disables Time Travel; UNDROP fails'],
              ['MAX_DATA_EXTENSION_TIME default', '14 days'],
              ['COPY metadata retention', '64 days'],
              ['Snowpipe metadata retention', '14 days'],
              ['Optimal load file size', '100–250 MB compressed'],
              ['Multi-cluster WH max clusters', '10'],
              ['Multi-cluster ECONOMY wait time', '6 minutes before adding cluster'],
              ['Result cache TTL (per reuse)', '24 hours; max 31 days if continuously reused'],
              ['STATEMENT_TIMEOUT_IN_SECONDS default', '172800 s (2 days)'],
              ['Reader Account limit per provider', '20 accounts'],
              ['Clustering recommended for tables', '> ~1 TB'],
              ['Direct Share scope', 'Same region only'],
              ['Listing scope', 'Cross-region (Auto-Fulfillment)'],
              ['Reader Account compute billing', 'Provider pays'],
              ['Replicated DB access', 'Read-only (until failover)'],
              ['Task minimum schedule (warehouse)', '1 minute'],
              ['Consumer Time Travel on shared data', 'NOT available'],
            ]}
          />
        </Accordion>

        <Traps list={[
          '"Direct shares support cross-region sharing" = FALSE — use Listings',
          '"Direct shares support monetization" = FALSE — use Listings',
          '"Listings are only public" = FALSE — private listings exist for specific accounts',
          '"Native Apps run on the provider\'s compute" = FALSE — consumer\'s compute',
        ]} />
      </div>
    ),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Study Domains Registry
// ─────────────────────────────────────────────────────────────────────────────
const STUDY_DOMAINS = [
  {
    id: 'd1',
    icon: Layers,
    label: 'D1 · Architecture',
    fullLabel: 'Snowflake AI Data Cloud Features & Architecture',
    weight: '25–30%',
    headerColor: 'bg-blue-700',
    pillColor: 'bg-blue-600',
    dotColor: 'bg-blue-500',
    sections: D1_SECTIONS,
  },
  {
    id: 'd2',
    icon: Shield,
    label: 'D2 · Governance',
    fullLabel: 'Account Management & Data Governance',
    weight: '20–25%',
    headerColor: 'bg-violet-700',
    pillColor: 'bg-violet-600',
    dotColor: 'bg-violet-500',
    sections: D2_SECTIONS,
  },
  {
    id: 'd3',
    icon: Upload,
    label: 'D3 · Data Loading',
    fullLabel: 'Data Loading, Unloading & Connectivity',
    weight: '10–15%',
    headerColor: 'bg-teal-700',
    pillColor: 'bg-teal-600',
    dotColor: 'bg-teal-500',
    sections: D3_SECTIONS,
  },
  {
    id: 'd4',
    icon: Zap,
    label: 'D4 · Performance',
    fullLabel: 'Performance Optimization, Querying & Transformation',
    weight: '10–15%',
    headerColor: 'bg-amber-600',
    pillColor: 'bg-amber-600',
    dotColor: 'bg-amber-500',
    sections: D4_SECTIONS,
  },
  {
    id: 'd5',
    icon: Share2,
    label: 'D5 · Collaboration',
    fullLabel: 'Data Collaboration',
    weight: '10–15%',
    headerColor: 'bg-rose-700',
    pillColor: 'bg-rose-600',
    dotColor: 'bg-rose-500',
    sections: D5_SECTIONS,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Root Component
// ─────────────────────────────────────────────────────────────────────────────
const DomainStudyHub = () => {
  const [domainIdx,  setDomainIdx]  = useState(0);
  const [sectionIdx, setSectionIdx] = useState(0);

  const domain  = STUDY_DOMAINS[domainIdx];
  const section = domain.sections[sectionIdx];
  const Icon    = domain.icon;

  const handleDomainChange = (i) => {
    setDomainIdx(i);
    setSectionIdx(0);
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">

      {/* Header */}
      <div className={`${domain.headerColor} rounded-2xl p-6 text-white`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-white/20 p-2 rounded-xl">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">COF-C03 · Concept Review</p>
            <h2 className="text-xl font-extrabold">{domain.fullLabel}</h2>
          </div>
          <span className="ml-auto bg-white/20 text-white text-sm font-bold px-3 py-1 rounded-full">
            {domain.weight}
          </span>
        </div>
        <p className="text-white/70 text-xs">Key concepts, reference tables, and exam traps organized by sub-domain.</p>
      </div>

      {/* Domain selector tabs */}
      <div className="flex gap-2 flex-wrap">
        {STUDY_DOMAINS.map((d, i) => {
          const DIcon = d.icon;
          return (
            <button
              key={d.id}
              onClick={() => handleDomainChange(i)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                domainIdx === i
                  ? `${d.headerColor} text-white shadow-sm border-transparent`
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
              }`}
            >
              <DIcon className="w-3.5 h-3.5" />
              {d.label}
            </button>
          );
        })}
      </div>

      {/* Sub-section pills */}
      <div className="flex gap-2 flex-wrap">
        {domain.sections.map((s, i) => (
          <Pill
            key={s.id}
            label={s.label}
            active={sectionIdx === i}
            onClick={() => setSectionIdx(i)}
            color={domain.pillColor}
          />
        ))}
      </div>

      {/* Active content */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-2.5 h-2.5 rounded-full ${domain.dotColor}`} />
          <h3 className="font-extrabold text-slate-800 text-base">{section.label}</h3>
        </div>
        <div className="space-y-3">
          {section.items}
        </div>
      </div>

      {/* Bottom nav */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSectionIdx(i => Math.max(0, i - 1))}
          disabled={sectionIdx === 0}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:border-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-4 h-4 rotate-180" /> Prev
        </button>
        <span className="flex-1 text-center text-xs text-slate-400 font-medium">
          {section.label} — {sectionIdx + 1} / {domain.sections.length}
        </span>
        <button
          onClick={() => setSectionIdx(i => Math.min(domain.sections.length - 1, i + 1))}
          disabled={sectionIdx === domain.sections.length - 1}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:border-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default DomainStudyHub;
