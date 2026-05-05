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

        <Accordion title="Architecture Layer — Cannot-Do Matrix" badge="5-Point Audit" badgeColor="bg-purple-100 text-purple-700">
          <CompareTable
            headers={['Layer', 'CANNOT Do', 'Common Confusion']}
            rows={[
              ['Cloud Services', 'Cannot run user queries; cannot store data; cannot persist beyond account', 'Mistaken for "where the result cache lives" — TRUE; mistaken for "where queries execute" — FALSE'],
              ['Compute (Virtual WH)', 'Cannot store query results long-term; cannot persist SSD cache across suspend; cannot share state across warehouses', 'Mistaken for "where pruning happens" — pruning is in Cloud Services optimizer'],
              ['Storage', 'Cannot be queried directly; cannot be modified in place (micro-partitions are immutable); cannot have user-defined partition sizes', 'Mistaken for "where compute happens" — storage is purely persistent layer'],
            ]}
          />
        </Accordion>

        <Accordion title="Account-Level Limits & Defaults" badge="Memorize" badgeColor="bg-amber-100 text-amber-700">
          <CompareTable
            headers={['Limit', 'Value', 'Notes']}
            rows={[
              ['Max columns per table', '5000+ (very high)', 'Practical cap, not a hard exam number'],
              ['Max databases per account', 'No documented hard limit', 'Soft limit, large in practice'],
              ['Max query text length', '1,000,000 characters', 'Hard limit on a single SQL statement'],
              ['Max QUERY_TAG length', '2000 characters', 'Truncated beyond this'],
              ['Default session idle timeout', '4 hours', 'CLIENT_SESSION_KEEP_ALIVE = FALSE by default'],
              ['Default LOCK_TIMEOUT', '43,200 s (12 hours)', 'Session-level parameter'],
              ['Default ABORT_DETACHED_QUERY', 'FALSE', 'Disconnected client → query keeps running'],
              ['Default USE_CACHED_RESULT', 'TRUE', 'Result cache is opt-OUT, not opt-IN'],
            ]}
          />
        </Accordion>

        <Accordion title="Edition — Cross-Region & Replication Notes">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p>VPS (Virtual Private Snowflake) — completely isolated metadata store; <strong>cannot</strong> share via Direct Share normally (Support-mediated)</p>
            <p>Failover Groups require <strong>Business Critical+</strong> on BOTH source and target accounts</p>
            <p>Replication itself works at all editions, but <strong>failover</strong> is BC+</p>
            <p>HIPAA / PCI / FedRAMP compliance start at <strong>Business Critical</strong></p>
            <p className="text-red-700">Edition is set per ACCOUNT — not per database, schema, or warehouse</p>
          </div>
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

        <Accordion title="Session & Connection Defaults" badge="Memorize" badgeColor="bg-amber-100 text-amber-700">
          <CompareTable
            headers={['Parameter', 'Default', 'Effect']}
            rows={[
              ['CLIENT_SESSION_KEEP_ALIVE', 'FALSE', 'Session expires after 4 h idle. Set TRUE for long-running app connections.'],
              ['CLIENT_SESSION_KEEP_ALIVE_HEARTBEAT_FREQUENCY', '3600 s (1 hr)', 'Heartbeat interval when KEEP_ALIVE = TRUE'],
              ['STATEMENT_TIMEOUT_IN_SECONDS', '172800 (2 days)', 'Max time a query can run before auto-cancel'],
              ['STATEMENT_QUEUED_TIMEOUT_IN_SECONDS', '0 (no timeout)', 'Queries wait forever in queue by default'],
              ['QUERY_TAG', '(empty)', 'Custom session label visible in QUERY_HISTORY'],
              ['TIMEZONE', 'America/Los_Angeles', 'Account default unless overridden'],
              ['USE_CACHED_RESULT', 'TRUE', 'Result cache enabled; set FALSE to force recompute'],
              ['DEFAULT_DDL_COLLATION', '(empty)', 'No default collation on new objects'],
            ]}
          />
        </Accordion>

        <Accordion title="User Object Defaults — DEFAULT_ROLE / WAREHOUSE / NAMESPACE">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p>A USER object can store these defaults that apply at login when no override is specified:</p>
            <p>✓ <strong>DEFAULT_ROLE</strong> — the role activated automatically (still must be granted to the user)</p>
            <p>✓ <strong>DEFAULT_WAREHOUSE</strong> — the warehouse used when SQL is run</p>
            <p>✓ <strong>DEFAULT_NAMESPACE</strong> — sets a database (and optionally schema) so unqualified table names resolve</p>
            <p>✓ <strong>DEFAULT_SECONDARY_ROLES</strong> — controls which secondary roles activate at login (typically 'ALL')</p>
            <p className="text-red-700 mt-2">Setting DEFAULT_ROLE = X does NOT grant role X — it must be granted separately</p>
            <p className="text-red-700">DEFAULT_WAREHOUSE = X does NOT grant USAGE on warehouse X — privilege must exist</p>
          </div>
        </Accordion>

        <Accordion title="Snowsight vs SnowSQL — Cannot-Do Matrix" badge="5-Point Audit" badgeColor="bg-purple-100 text-purple-700">
          <CompareTable
            headers={['Tool', 'Cannot Do', 'Confused With']}
            rows={[
              ['Snowsight (web UI)', 'PUT/GET file transfer; bulk scripted automation; piping shell output to SQL', 'Often confused with Classic Console (legacy UI being retired)'],
              ['SnowSQL (CLI)', 'Render dashboards or charts; build Streamlit apps; manage worksheets', 'Often confused with Snowflake CLI ("snow") — different tool'],
              ['Snowflake CLI ("snow")', 'Replace SnowSQL for ad-hoc SQL by default (it has SQL but is object/Snowpark-focused)', 'Confused with SnowSQL; "snow" handles Streamlit/Notebooks/Native Apps deployment'],
              ['SnowCD', 'Execute queries; authenticate; transfer files', 'Confused with snowsql — SnowCD only diagnoses connectivity (DNS, TLS, OCSP, proxy)'],
              ['SQL API', 'PUT/GET; call out to third-party REST APIs during execution; username/password auth', 'Confused with REST drivers — SQL API is HTTP-only, not a driver wrapper'],
            ]}
          />
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
          '"Setting DEFAULT_ROLE on a user grants that role" = FALSE — grant must be done separately',
          '"Disconnecting the client cancels the running query" = FALSE — ABORT_DETACHED_QUERY defaults FALSE; query continues',
          '"USE_CACHED_RESULT defaults to FALSE" = FALSE — defaults TRUE (cache is opt-out)',
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

        <Accordion title="Object Defaults & Limits" badge="Memorize" badgeColor="bg-amber-100 text-amber-700">
          <CompareTable
            headers={['Object', 'Default / Limit', 'Notes']}
            rows={[
              ['Sequence — START WITH', '1', 'INCREMENT defaults to 1; NOORDER is default'],
              ['Sequence — ORDER vs NOORDER', 'NOORDER (default)', 'NOORDER = better performance, gaps possible. ORDER = sequential, more contention.'],
              ['Database — DATA_RETENTION_TIME_IN_DAYS', '1 day', 'Inherited by schemas/tables unless overridden'],
              ['Schema — managed access', 'OFF (default)', 'When ON, only schema owner grants privileges on contained objects'],
              ['Table — column count', 'No documented hard cap (very high)', 'Practical limit only'],
              ['Identifier — case sensitivity', 'Case-FOLDED to UPPER unless quoted', '"my_table" vs my_table — quoted preserves exact case'],
              ['Identifier — max length', '255 characters', 'Applies to DB/schema/table/column names'],
              ['Pipe — owner', 'Role that creates it', 'Pipe runs as its owner; OWNERSHIP transfer changes execution role'],
            ]}
          />
        </Accordion>

        <Accordion title="Table Type — Full Cannot-Do Matrix" badge="5-Point Audit" badgeColor="bg-purple-100 text-purple-700">
          <CompareTable
            headers={['Table Type', 'Cannot Do', 'Edition Gate']}
            rows={[
              ['Permanent', 'Avoid Fail-safe charges (always 7 days)', 'All editions'],
              ['Transient', 'Time Travel beyond 1 day; Fail-safe', 'All editions'],
              ['Temporary', 'Outlive session; be queried by other sessions; have Fail-safe', 'All editions'],
              ['External', 'INSERT/UPDATE/DELETE/MERGE; Time Travel; standalone clone; be in DB clones', 'All editions'],
              ['Dynamic', 'DML directly (only via TARGET_LAG refresh); cloning', 'Enterprise+ recommended'],
              ['Iceberg (Snowflake-managed catalog)', 'Be queried by external catalogs without limitations', 'All editions'],
              ['Iceberg (external catalog)', 'Full DML; some features limited; read-mostly', 'All editions'],
              ['Hybrid (Unistore)', 'Be created without indexes/PK; preview limits apply', 'Preview/Enterprise+'],
              ['Event', 'Be modified directly; only used by EVENT_TABLE for telemetry', 'All editions'],
            ]}
          />
        </Accordion>

        <Accordion title="View Type — Full Comparison">
          <CompareTable
            headers={['Aspect', 'Standard View', 'Secure View', 'Materialized View', 'Dynamic Table']}
            rows={[
              ['Definition visible', 'YES (granted roles)', 'NO (only owner)', 'NO (Secure flag implicit)', 'YES'],
              ['Storage cost', 'NO', 'NO', 'YES (pre-computed)', 'YES (full table)'],
              ['Refresh', 'On-the-fly (always)', 'On-the-fly', 'Auto (serverless)', 'TARGET_LAG-driven'],
              ['JOINs', 'YES', 'YES', 'NO (single table)', 'YES'],
              ['Shareable', 'NO', 'YES', 'YES (Secure MV)', 'YES'],
              ['Edition required', 'All', 'All', 'Enterprise+', 'Enterprise recommended'],
            ]}
          />
        </Accordion>

        <Accordion title="Unsupported Features for External & Iceberg Tables">
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs space-y-1">
            <p className="font-bold text-red-700">External Tables CANNOT:</p>
            <p>✗ Be the target of INSERT, UPDATE, DELETE, or MERGE</p>
            <p>✗ Have Time Travel (no AT/BEFORE)</p>
            <p>✗ Be cloned (standalone OR included in a database clone)</p>
            <p>✗ Be replicated via replication groups</p>
            <p>✗ Have constraints (PK/FK/UNIQUE)</p>
            <p className="font-bold text-red-700 mt-2">Iceberg Tables (external catalog) CANNOT:</p>
            <p>✗ Be the target of all DML (depends on catalog)</p>
            <p>✗ Use some Snowflake-only features (replication, certain optimizations)</p>
          </div>
        </Accordion>

        <Traps list={[
          '"Sequences guarantee sequential order" = FALSE — unique only, gaps possible',
          '"Sequences with ORDER guarantee gap-free" = FALSE — guarantees order in single session, not gap-free',
          '"Shares contain data copies" = FALSE — they contain references',
          '"Standard Snowflake tables enforce PRIMARY KEY constraints" = FALSE — informational only (Hybrid Tables do enforce)',
          '"Iceberg tables with external catalog support full DML" = FALSE — read-mostly with limited features',
          '"Identifiers are case-sensitive by default" = FALSE — folded to UPPER unless quoted',
          '"Schemas inherit DATA_RETENTION from the database automatically" = TRUE if not overridden — but it CAN be overridden at schema/table level',
          '"External tables can be cloned as part of a database clone" = FALSE — excluded entirely',
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

        <Accordion title="Warehouse Parameters — Complete Defaults" badge="Memorize" badgeColor="bg-amber-100 text-amber-700">
          <CompareTable
            headers={['Parameter', 'Default', 'Notes']}
            rows={[
              ['WAREHOUSE_SIZE', 'XSMALL', 'On CREATE if not specified'],
              ['AUTO_SUSPEND', '600 s (10 min)', '0 = NEVER suspend; NULL = NEVER suspend'],
              ['AUTO_RESUME', 'TRUE', 'Resumes automatically on incoming query'],
              ['INITIALLY_SUSPENDED', 'FALSE', 'Created in STARTED state by default'],
              ['MIN_CLUSTER_COUNT', '1', 'Multi-cluster only — minimum running clusters'],
              ['MAX_CLUSTER_COUNT', '1', '1 = single-cluster (default). >1 = multi-cluster.'],
              ['SCALING_POLICY', 'STANDARD', 'STANDARD adds clusters faster; ECONOMY waits for 6-min queue'],
              ['MAX clusters allowed', '10', 'Hard maximum on multi-cluster warehouses'],
              ['WAREHOUSE_TYPE', 'STANDARD', 'STANDARD or SNOWPARK-OPTIMIZED'],
              ['ENABLE_QUERY_ACCELERATION', 'FALSE', 'Must be enabled per warehouse for QAS'],
              ['QUERY_ACCELERATION_MAX_SCALE_FACTOR', '8', 'Max additional compute multiplier (1–100)'],
              ['RESOURCE_MONITOR', 'NULL', 'Optional — assign to enforce credit limits'],
            ]}
          />
        </Accordion>

        <Accordion title="Multi-Cluster Warehouse — Defaults & Behaviors">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p>MIN=1, MAX=1 → effectively single-cluster (no auto-scaling)</p>
            <p>MIN=N, MAX=N (with N&gt;1) → "Maximized mode" — always runs N clusters; SCALING_POLICY ignored</p>
            <p>MIN=1, MAX&gt;1 → "Auto-scale mode" — adds/removes clusters based on queue + policy</p>
            <p>STANDARD policy: adds cluster on queue immediately</p>
            <p>ECONOMY policy: waits ~6 minutes of queue before adding a cluster (saves credits)</p>
            <p className="text-red-700 mt-2">Multi-cluster ≠ Snowpark-Optimized. Different concepts. Multi-cluster = horizontal scaling, Snowpark-Optimized = bigger memory footprint.</p>
          </div>
        </Accordion>

        <Accordion title="Warehouse Cannot-Do Matrix" badge="5-Point Audit" badgeColor="bg-purple-100 text-purple-700">
          <CompareTable
            headers={['Warehouse Type', 'Cannot Do', 'Confused With']}
            rows={[
              ['Standard', 'Run large-memory ML/UDFs efficiently; train large models', 'Snowpark-Optimized — same scaling but 16x memory'],
              ['Snowpark-Optimized', 'Be smaller than MEDIUM (entry size); run cheaply for tiny workloads', 'Standard with Snowpark API — that is just normal queries'],
              ['Multi-cluster (any size)', 'Speed up ONE query; replace Scale UP for spilling', 'Scale UP — different problem (single-query memory)'],
              ['Compute Pool (SPCS)', 'Be billed via warehouse credits', 'Warehouses — separate billing model'],
              ['Serverless (Snowpipe/Tasks/MV/SOS)', 'Be tracked by Resource Monitors', 'Warehouse credits — serverless has separate budget tracking'],
            ]}
          />
        </Accordion>

        <Accordion title="Suspend & Resume Behaviors">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p><strong>Suspend</strong> drops SSD cache immediately (warm cache lost)</p>
            <p><strong>Resume</strong> restarts from cold cache — first query after resume reads from remote storage</p>
            <p><strong>Manual SUSPEND</strong> while queries running: queries finish first (normally), then suspend kicks in</p>
            <p><strong>ALTER WAREHOUSE SUSPEND</strong> with running queries: queries are <strong>aborted</strong> immediately if forced; otherwise wait</p>
            <p>AUTO_SUSPEND timer is reset on every query — clock starts when warehouse goes idle</p>
            <p>60-second minimum billing per resume — even a 5-second query bills 60 s</p>
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
          '"AUTO_SUSPEND default is 5 minutes" = FALSE — default is 600 s (10 minutes)',
          '"MAX_CLUSTER_COUNT default is auto-detect" = FALSE — defaults to 1 (single cluster)',
          '"Maximized mode (MIN=MAX) respects SCALING_POLICY" = FALSE — policy is ignored when MIN=MAX',
          '"Snowpark-Optimized warehouses come in XSMALL" = FALSE — start at MEDIUM',
          '"ENABLE_QUERY_ACCELERATION is on by default" = FALSE — must be opted in per warehouse',
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

        <Accordion title="Storage Layer Defaults & Limits" badge="Memorize" badgeColor="bg-amber-100 text-amber-700">
          <CompareTable
            headers={['Item', 'Value', 'Notes']}
            rows={[
              ['Micro-partition size', '50–500 MB uncompressed', '~16 MB compressed typical; immutable, columnar'],
              ['Micro-partition trigger', 'Auto on every load', 'Cannot be manually defined or sized'],
              ['Compression', 'Auto (Snowflake-managed)', 'Customer pays for COMPRESSED bytes only'],
              ['Storage cost', 'Per-TB compressed/month', 'Plus Time Travel + Fail-safe additions'],
              ['DATA_RETENTION_TIME_IN_DAYS — default', '1 day', 'Inherited DB → Schema → Table unless overridden'],
              ['DATA_RETENTION_TIME_IN_DAYS — min/max (Standard)', '0 / 1', 'Permanent and transient/temp same on Standard'],
              ['DATA_RETENTION_TIME_IN_DAYS — max (Enterprise+)', '90 (permanent only)', 'Transient/temp still capped at 1'],
              ['Fail-safe (permanent)', '7 days fixed', 'Cannot be configured — Snowflake-managed'],
              ['Fail-safe (transient/temp)', '0 days', 'No Fail-safe ever'],
              ['MIN_DATA_RETENTION_TIME_IN_DAYS (account)', '0 default', 'Account-level floor — overrides any object setting'],
              ['MAX_DATA_EXTENSION_TIME_IN_DAYS', '14 days default', 'Stream-driven retention extension cap'],
            ]}
          />
        </Accordion>

        <Accordion title="View Type — Cannot-Do Matrix" badge="5-Point Audit" badgeColor="bg-purple-100 text-purple-700">
          <CompareTable
            headers={['View Type', 'Cannot Do', 'Confused With']}
            rows={[
              ['Standard view', 'Be shared (must be Secure); hide its definition', 'Materialized view — standard recomputes every time'],
              ['Secure view', 'Take advantage of certain optimizations (definition not pushed down)', 'Standard view — same syntax + SECURE keyword'],
              ['Materialized view', 'JOINs, UNIONs, ORDER BY, HAVING, window functions, non-deterministic functions', 'Dynamic table — DT supports JOINs, MV does not'],
              ['Dynamic table', 'Be modified directly (read-only target); be cloned; replace MV for single-table simple cases (overkill)', 'Materialized view — DT has full SQL but is a real table with storage'],
            ]}
          />
        </Accordion>

        <Accordion title="Clustering — When NOT to Use">
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs space-y-1">
            <p>✗ Tables &lt; 1 TB — natural load order suffices</p>
            <p>✗ Highly transactional tables (frequent INSERT/UPDATE) — re-clustering cost dominates</p>
            <p>✗ Columns with very high cardinality (e.g., unique IDs) — use Search Optimization Service (SOS) instead</p>
            <p>✗ Low-cardinality columns alone (e.g., country with 200 values) — pruning gains are small</p>
            <p>✗ Tables already well-clustered by load pattern (e.g., always loaded by date)</p>
          </div>
        </Accordion>

        <Accordion title="Stages — Defaults & Cannot-Do Matrix">
          <CompareTable
            headers={['Stage Type', 'Default URL', 'Cannot Do']}
            rows={[
              ['User stage (@~)', 'Auto-created per user', 'Be shared with another user; be cloned; be dropped (lifecycle = user lifecycle)'],
              ['Table stage (@%table)', 'Auto-created per table', 'Have file format defaults; be standalone; be cloned'],
              ['Named internal', 'Created on Snowflake-managed storage', 'Be cloned ("Unsupported feature"); be referenced cross-account'],
              ['Named external', 'Points to S3/Azure/GCS via URL', 'Provide row-level access controls on data within; bypass external IAM rules'],
            ]}
          />
        </Accordion>

        <Traps list={[
          '"Materialized views support JOINs" = FALSE — single table only (use Dynamic Tables for JOINs)',
          '"External tables support INSERT" = FALSE — read-only, SELECT only',
          '"CREATE TABLE ... CLONE transient_table" = FAILS — must use CREATE TRANSIENT TABLE ... CLONE',
          '"External tables are included in database clones" = FALSE — excluded entirely',
          '"Internal stages can be cloned" = FALSE — external stages CAN',
          '"DATA_RETENTION_TIME_IN_DAYS default is 0" = FALSE — default is 1 day',
          '"Standard Edition transient tables can have 90-day retention" = FALSE — transient is always 0–1 day',
          '"Fail-safe is configurable from 0 to 30 days" = FALSE — fixed at 7 days for permanent, 0 for transient/temp',
          '"Clustering helps tables of any size" = FALSE — recommended only for tables &gt; ~1 TB',
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

        <Accordion title="Compute Type Confusion — Where Does Each Run?" badge="5-Point Audit" badgeColor="bg-purple-100 text-purple-700">
          <CompareTable
            headers={['Tech', 'Runs On', 'Billing', 'Cannot']}
            rows={[
              ['Snowpark DataFrames (Python/Java/Scala)', 'Standard or Snowpark-Optimized warehouse', 'Warehouse credits', 'Run on client; run without a warehouse'],
              ['Streamlit in Snowflake (SiS)', 'Snowflake-managed serverless compute', 'Warehouse credits (viewer\'s WH)', 'Be hosted on streamlit.io; access internet without external integration'],
              ['Snowflake Notebooks', 'Warehouse OR Snowpark Container Services', 'Warehouse credits OR compute-pool credits', 'Be embedded in arbitrary external apps'],
              ['Snowpark Container Services (SPCS)', 'Compute Pools (Kubernetes-like)', 'Compute-pool credits (per node-hour)', 'Use warehouse credits; run on serverless tasks'],
              ['Native Apps', 'Consumer\'s warehouse / compute', 'CONSUMER pays for compute', 'Run on provider\'s account; auto-scale provider compute'],
              ['External Functions', 'Customer-hosted endpoint via API gateway', 'Snowflake bills cloud-services time only', 'Run inside Snowflake; access Snowflake DB directly'],
              ['Cortex LLM functions', 'Snowflake-hosted GPU infra', 'Per-token pricing, no warehouse needed', 'Be customized with custom-trained models (use Cortex Fine-Tuning)'],
            ]}
          />
        </Accordion>

        <Accordion title="Cortex Functions — Edition & Region Notes">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p>Cortex LLM functions (COMPLETE, SUMMARIZE, TRANSLATE, SENTIMENT, EXTRACT_ANSWER, CLASSIFY_TEXT) — region availability varies; cross-region inference can be enabled when local region lacks the model</p>
            <p>FORECAST and ANOMALY_DETECTION — built-in ML, generally available all editions</p>
            <p>Cortex Search and Cortex Analyst — preview/GA varies by region</p>
            <p>Cortex Fine-Tuning — supported only on specific models (e.g., mistral-7b, llama2-70b)</p>
            <p className="text-red-700 mt-2">Cortex calls are billed PER-TOKEN (input + output) — not warehouse seconds</p>
          </div>
        </Accordion>

        <Accordion title="Snowpark API — What it Cannot Do">
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs space-y-1">
            <p>✗ Run JavaScript UDFs (only Python/Java/Scala via API; JS via raw SQL only)</p>
            <p>✗ Execute outside a Snowflake session (always remote — DataFrames are lazy)</p>
            <p>✗ Replace SQL — UDFs/UDTFs/sprocs still work for in-DB compute</p>
            <p>✗ Be used for streaming inserts (use Snowpipe Streaming SDK separately)</p>
            <p>✗ Avoid warehouse costs — ALL execution requires a running warehouse</p>
          </div>
        </Accordion>

        <Traps list={[
          '"Snowpark DataFrames execute on the client" = FALSE — runs on the warehouse',
          '"SiS apps run on a dedicated Streamlit server" = FALSE — Snowflake-managed compute',
          '"FORECAST is an external ML function" = FALSE — built-in ML function (no external infra)',
          '"SPCS is billed by warehouse credits" = FALSE — billed by compute pool',
          '"Snowpark Container Services = Snowpark Python API" = FALSE — SPCS runs containers, Snowpark runs DataFrames on a warehouse',
          '"Cortex LLM functions consume warehouse credits" = FALSE — billed per token',
          '"Native Apps run on the provider\'s compute" = FALSE — consumer pays for compute',
          '"External functions execute inside Snowflake" = FALSE — call out to customer-hosted endpoint',
          '"Snowpark supports JavaScript UDFs" = FALSE — Python/Java/Scala only via API',
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

        <Accordion title="Authentication Defaults & Limits" badge="Memorize" badgeColor="bg-amber-100 text-amber-700">
          <CompareTable
            headers={['Item', 'Default / Limit', 'Notes']}
            rows={[
              ['Password min length', '8 characters', 'Plus complexity rules (mix of cases, digits)'],
              ['MFA provider', 'Duo Security', 'Built-in; no extra license'],
              ['MFA enrollment', 'User self-enrollment', 'Cannot be globally forced without authentication policy'],
              ['SAML2 IdP types', 'Okta, Azure AD, Ping, ADFS, custom', 'Configured via SECURITY_INTEGRATION'],
              ['Key-pair: max keys per user', '2', 'RSA_PUBLIC_KEY and RSA_PUBLIC_KEY_2 (for rotation)'],
              ['Key-pair: key size', '2048-bit RSA min, 4096 recommended', 'PEM format'],
              ['OAuth flow types', 'Snowflake OAuth, External OAuth', 'External = Okta/Azure/Custom IdP'],
              ['SCIM endpoint format', 'https://&lt;account&gt;.snowflakecomputing.com/scim/v2/', 'OAuth bearer token from SCIM integration'],
              ['Session token (default lifetime)', '4 hours idle / ~1 hour active', 'Master token longer; refreshed by drivers'],
            ]}
          />
        </Accordion>

        <Accordion title="Network Policy Defaults & Limits">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p><strong>Default state:</strong> No network policy → all IPs allowed</p>
            <p><strong>BLOCKED_IP_LIST</strong> takes precedence over ALLOWED_IP_LIST (same IP in both = blocked)</p>
            <p><strong>User-level policy</strong> overrides account-level (not additive)</p>
            <p>Supports CIDR ranges (e.g., 10.0.0.0/24)</p>
            <p>Maximum entries per list: large (no exam-relevant cap)</p>
            <p>Network policies do NOT control where queries are EXECUTED — only where connections originate</p>
            <p className="text-red-700 mt-2">Locking yourself out: account-level policy that excludes your IP → must contact Support</p>
          </div>
        </Accordion>

        <Accordion title="Role Type Confusion Matrix" badge="5-Point Audit" badgeColor="bg-purple-100 text-purple-700">
          <CompareTable
            headers={['Role Type', 'Scope', 'Cannot', 'Confused With']}
            rows={[
              ['Account role (custom)', 'Account-wide', 'Be granted to objects directly', 'Database role — different scope'],
              ['Database role', 'Single database only', 'Hold privileges on objects outside the parent database', 'Account role — DB roles do NOT propagate cross-DB'],
              ['Application role (Native App)', 'Within installed Native App', 'Be used outside the app context', 'Custom roles — not interchangeable'],
              ['Instance role (Native App)', 'Per app instance', 'Survive app uninstall', 'Application roles — instance-specific permissions'],
              ['System role (PUBLIC)', 'Auto-granted to all', 'Be revoked', 'Custom default role — PUBLIC is automatic'],
            ]}
          />
        </Accordion>

        <Accordion title="Authentication Policies (Newer Feature)">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p>Restrict allowed AUTHENTICATION_METHODS (e.g., only SAML + KEY_PAIR; block PASSWORD)</p>
            <p>Restrict allowed CLIENT_TYPES (e.g., only DRIVERS; block SNOWFLAKE_UI)</p>
            <p>Restrict allowed SECURITY_INTEGRATIONS (e.g., only Okta; block default password)</p>
            <p>Force MFA for password-based logins (MFA_AUTHENTICATION_METHODS = ('PASSWORD'))</p>
            <p>Applied at <strong>account or user level</strong> (user overrides account)</p>
            <p className="text-red-700 mt-2">Authentication policy is the modern way to enforce MFA — older approach was per-user MFA enrollment</p>
          </div>
        </Accordion>

        <Accordion title="Federated Auth (SSO) Behaviors">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p>SAML 2.0 — browser-redirect to IdP for sign-in</p>
            <p>SnowSQL supports SSO via <code className="bg-slate-100 px-1 rounded">--authenticator externalbrowser</code></p>
            <p>Drivers (JDBC/ODBC/Python) support EXTERNALBROWSER, SNOWFLAKE_JWT, OAUTH</p>
            <p>SCIM = automated user/group sync from IdP. SCIM does NOT replace SAML; they pair together</p>
            <p>SAML logs in users; SCIM provisions users into Snowflake first</p>
            <p className="text-red-700">Disabling password and using SSO only = "single sign-on enforced" — set via authentication policy</p>
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
          '"BLOCKED_IP_LIST is additive with ALLOWED_IP_LIST" = FALSE — BLOCKED takes precedence',
          '"User-level network policy adds to account-level" = FALSE — user-level OVERRIDES account-level',
          '"MFA can be forced globally without an authentication policy" = FALSE — needed authentication policy or per-user enrollment',
          '"SCIM and SAML are alternatives" = FALSE — they pair (SCIM provisions, SAML signs-in)',
          '"Key-pair authentication supports only one public key per user" = FALSE — supports two for rotation',
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

        <Accordion title="Policy Defaults & Limits" badge="Memorize" badgeColor="bg-amber-100 text-amber-700">
          <CompareTable
            headers={['Policy', 'Default / Limit', 'Notes']}
            rows={[
              ['Masking policies per column', '1', 'Cannot stack multiple masking policies on the same column'],
              ['Row access policies per table', '1', 'Cannot stack; replace to change'],
              ['Tag keys per object', '50 max', 'Hard limit'],
              ['Tag string length', '256 characters', 'Per tag value'],
              ['Tag allowed values', 'Optional ALLOWED_VALUES list', 'Enforced if specified; otherwise free-form'],
              ['Aggregation policy min group size', 'Configurable (e.g., 5)', 'Smaller groups suppressed in output'],
              ['Projection policy', 'Per column', 'Controls visibility of column in SELECT/projection'],
              ['Edition required', 'Enterprise+', 'For all governance policies (masking, row access, tag, aggregation, projection)'],
            ]}
          />
        </Accordion>

        <Accordion title="Policy Type Confusion Matrix" badge="5-Point Audit" badgeColor="bg-purple-100 text-purple-700">
          <CompareTable
            headers={['Policy', 'What it Filters', 'What it Cannot', 'Confused With']}
            rows={[
              ['Masking policy', 'Column VALUES (transforms data per role)', 'Block reads entirely; affect INSERT', 'Row access — masking changes the value, not the row'],
              ['Row access policy', 'Which ROWS the role sees', 'Change values; affect INSERT directly', 'Masking — RAP filters rows, masking changes columns'],
              ['Projection policy', 'Whether the COLUMN can be projected (SELECT)', 'Affect filters in WHERE; mask values', 'Column-level grants — projection policies are evaluated per query'],
              ['Aggregation policy', 'Forces minimum group size in aggregations', 'Block individual row reads; mask values', 'Differential privacy — aggregation policies are simpler k-anonymity-style'],
              ['Tag-based policy', 'Auto-attach a policy via tag', 'Enforce anything by itself', 'Tags alone — tags are metadata; policy must be attached'],
            ]}
          />
        </Accordion>

        <Accordion title="What Policies CANNOT Do">
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs space-y-1">
            <p>✗ ACCOUNTADMIN cannot bypass masking or row access policies (no role-bypass)</p>
            <p>✗ Multiple masking policies on the same column (one per column max)</p>
            <p>✗ Cover multiple data types in one masking policy (one type per policy)</p>
            <p>✗ Be applied to external tables (most policies — tables only)</p>
            <p>✗ Reference data outside Snowflake (no external lookups in policy bodies)</p>
            <p>✗ Apply to sequences, stages, file formats (object types without DML)</p>
            <p>✗ Auto-decrypt — they hide/transform values, not encrypt them</p>
          </div>
        </Accordion>

        <Accordion title="Object Tagging — How Propagation Works">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p>Tags propagate <strong>downstream through views</strong> — column lineage carries tags</p>
            <p>Tags propagate <strong>via cloning</strong> — clone inherits source tags</p>
            <p>Tags can be set at: account, database, schema, table, view, column, warehouse, pipe, role, user, share</p>
            <p>Tag inheritance: object-level tag wins over inherited; explicit unset removes inheritance</p>
            <p><code className="bg-slate-100 px-1 rounded">SNOWFLAKE.ACCOUNT_USAGE.TAG_REFERENCES</code> shows where tags are applied</p>
            <p><code className="bg-slate-100 px-1 rounded">SYSTEM$GET_TAG('tag_name', 'object', 'TABLE')</code> returns the value</p>
          </div>
        </Accordion>

        <Accordion title="Encryption — Hierarchy & Rotation">
          <CompareTable
            headers={['Layer', 'Key', 'Rotation']}
            rows={[
              ['Root key (Snowflake)', 'Master key per account', 'Annually (auto)'],
              ['Account master key', 'Wraps table master keys', 'Annually'],
              ['Table master key', 'Wraps file keys', 'Annually'],
              ['File key', 'Wraps individual file', 'Per-file generation'],
              ['Tri-Secret Secure (BC+)', 'Customer key + Snowflake key composite', 'Customer-controlled rotation'],
            ]}
          />
        </Accordion>

        <Traps list={[
          '"Tags enforce masking automatically" = FALSE — must attach policy to tag',
          '"ACCOUNTADMIN bypasses masking" = FALSE',
          '"Row access policy missing ELSE — unmentioned roles see all rows" = FALSE — 0 rows',
          '"SYSTEM$CLASSIFY works on VARIANT columns" = FALSE — primitive types only',
          '"Projection policy controls INSERT" = FALSE — controls SELECT/projection visibility',
          '"Multiple masking policies can be stacked on a column" = FALSE — one per column maximum',
          '"One masking policy can handle multiple data types" = FALSE — one data type per policy',
          '"Tag limit per object is unlimited" = FALSE — 50 unique tag keys max',
          '"Tags propagate to downstream views automatically" = TRUE — column lineage carries tags',
          '"Aggregation policy applies row-level masking" = FALSE — enforces minimum group size in aggregations',
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

        <Accordion title="Resource Monitor — Defaults & Limits" badge="Memorize" badgeColor="bg-amber-100 text-amber-700">
          <CompareTable
            headers={['Item', 'Default / Limit', 'Notes']}
            rows={[
              ['CREDIT_QUOTA', 'Required (no default)', 'Must be specified at creation'],
              ['FREQUENCY', 'MONTHLY', 'DAILY / WEEKLY / MONTHLY / YEARLY / NEVER'],
              ['START_TIMESTAMP', 'IMMEDIATELY', 'Or explicit timestamp'],
              ['END_TIMESTAMP', 'NULL (no end)', 'Optional cutoff'],
              ['Trigger types', 'NOTIFY / SUSPEND / SUSPEND_IMMEDIATE', 'Multiple triggers per monitor'],
              ['Max triggers', 'Many (no exam-relevant cap)', 'Each trigger independent'],
              ['ALTER ... SET TRIGGERS', 'REPLACES all existing triggers', 'Not additive!'],
              ['Privilege to view', 'MONITOR', 'Plus MODIFY to change quotas'],
              ['Privilege to create', 'ACCOUNTADMIN only', 'Cannot delegate CREATE'],
              ['Tracks', 'User-managed warehouse credits only', 'Serverless requires Budgets'],
            ]}
          />
        </Accordion>

        <Accordion title="Trigger Action Differences">
          <CompareTable
            headers={['Action', 'Effect on Running Queries', 'Use Case']}
            rows={[
              ['NOTIFY', 'No effect — sends notification only', 'Early warning at 75%, 90%, etc.'],
              ['SUSPEND', 'Running queries finish; no new queries', 'Soft cutoff; allow current work to complete'],
              ['SUSPEND_IMMEDIATE', 'Aborts ALL running queries instantly', 'Hard cutoff; protect from runaway costs'],
            ]}
          />
        </Accordion>

        <Accordion title="Budgets vs Resource Monitors — Cannot-Do Matrix" badge="5-Point Audit" badgeColor="bg-purple-100 text-purple-700">
          <CompareTable
            headers={['Feature', 'Resource Monitor', 'Budget']}
            rows={[
              ['Tracks user warehouse credits', 'YES', 'YES'],
              ['Tracks serverless (Snowpipe, MV, SOS, auto-clustering)', 'NO', 'YES'],
              ['Tracks Cortex (LLM tokens)', 'NO', 'YES'],
              ['Suspend warehouses', 'YES', 'NO (notification only)'],
              ['Notification only', 'YES', 'YES (only mode)'],
              ['Per-warehouse target', 'YES', 'YES'],
              ['Account-wide target', 'YES (one monitor)', 'YES'],
              ['Configurable threshold %', 'YES', 'YES'],
            ]}
          />
        </Accordion>

        <Accordion title="ACCOUNT_USAGE Latency Cheat Sheet">
          <CompareTable
            headers={['View', 'Typical Latency', 'Retention']}
            rows={[
              ['QUERY_HISTORY', '45 min', '365 days'],
              ['LOGIN_HISTORY', '~2 hours', '365 days'],
              ['ACCESS_HISTORY', '~3 hours', '365 days'],
              ['WAREHOUSE_METERING_HISTORY', '~3 hours', '365 days'],
              ['STORAGE_USAGE', '~daily', '365 days'],
              ['DATABASE_STORAGE_USAGE_HISTORY', '~daily', '365 days'],
              ['GRANTS_TO_ROLES', '~2 hours', '365 days'],
              ['TABLE_STORAGE_METRICS', '~daily', '365 days'],
              ['INFORMATION_SCHEMA equivalents', 'Near real-time', '7–14 days only'],
            ]}
          />
        </Accordion>

        <Accordion title="Trust Center & Compliance Reporting">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p><strong>Trust Center</strong> — built-in security posture scanner</p>
            <p>Scanners include CIS Benchmark for Snowflake, threat intelligence, security best practices</p>
            <p>Findings categorized by severity (CRITICAL / HIGH / MEDIUM / LOW)</p>
            <p>Requires <strong>ACCOUNTADMIN</strong> or specific Trust Center role</p>
            <p>Some scanners require <strong>Enterprise+</strong> edition</p>
            <p className="text-red-700">Trust Center does NOT enforce remediation — it surfaces findings; admins must act</p>
          </div>
        </Accordion>

        <Traps list={[
          '"Resource monitors track Snowpipe credits" = FALSE — use budgets',
          '"ALTER RESOURCE MONITOR without TRIGGERS keeps old triggers" = TRUE — but WITH TRIGGERS replaces all',
          '"ACCOUNT_USAGE is real-time" = FALSE — 45 min – 3 hour latency',
          '"INFORMATION_SCHEMA retains 365 days" = FALSE — 7–14 days only',
          '"SUSPEND trigger aborts all running queries" = FALSE — that is SUSPEND_IMMEDIATE',
          '"SECURITYADMIN can create resource monitors" = FALSE — ACCOUNTADMIN only',
          '"Default frequency for a resource monitor is DAILY" = FALSE — MONTHLY',
          '"Resource monitors track Cortex token spend" = FALSE — use budgets',
          '"Trust Center automatically remediates issues" = FALSE — surfaces findings only',
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

        <Accordion title="COPY INTO — Complete Default Values" badge="Memorize" badgeColor="bg-amber-100 text-amber-700">
          <CompareTable
            headers={['Parameter', 'Default', 'Notes']}
            rows={[
              ['ON_ERROR (bulk COPY)', 'ABORT_STATEMENT', 'Stops on first error'],
              ['ON_ERROR (Snowpipe)', 'SKIP_FILE', 'Skips bad files, continues'],
              ['SIZE_LIMIT', 'NULL (no limit)', 'Max bytes loaded per COPY'],
              ['FORCE', 'FALSE', 'TRUE bypasses metadata dedup → duplicates risk'],
              ['PURGE', 'FALSE', 'TRUE deletes source files after success'],
              ['MATCH_BY_COLUMN_NAME', 'NONE', 'Set to CASE_SENSITIVE / CASE_INSENSITIVE for name matching'],
              ['ENFORCE_LENGTH', 'TRUE', 'Errors if string > column length'],
              ['TRUNCATECOLUMNS', 'FALSE', 'TRUE silently truncates instead of erroring'],
              ['LOAD_HISTORY (BULK)', '64 days', 'Files in load_history are skipped'],
              ['LOAD_HISTORY (Snowpipe)', '14 days', 'Files in pipe load_history are skipped'],
              ['VALIDATION_MODE', 'NULL (live load)', 'RETURN_n_ROWS or RETURN_ERRORS for dry-run'],
              ['INCLUDE_METADATA', 'NULL', 'Add METADATA$ pseudo-cols (newer feature)'],
            ]}
          />
        </Accordion>

        <Accordion title="File Format Defaults — Per Type">
          <CompareTable
            headers={['Format', 'Key Default']}
            rows={[
              ['CSV — FIELD_DELIMITER', '","'],
              ['CSV — RECORD_DELIMITER', '"\\n"'],
              ['CSV — SKIP_HEADER', '0'],
              ['CSV — PARSE_HEADER', 'FALSE'],
              ['CSV — FIELD_OPTIONALLY_ENCLOSED_BY', 'NONE'],
              ['CSV — TRIM_SPACE', 'FALSE'],
              ['CSV — NULL_IF', '("\\\\N")'],
              ['CSV — ESCAPE', 'NONE'],
              ['CSV — ESCAPE_UNENCLOSED_FIELD', '"\\\\\\\\"'],
              ['CSV — EMPTY_FIELD_AS_NULL', 'TRUE'],
              ['CSV — ERROR_ON_COLUMN_COUNT_MISMATCH', 'TRUE'],
              ['JSON — STRIP_OUTER_ARRAY', 'FALSE'],
              ['JSON — STRIP_NULL_VALUES', 'FALSE'],
              ['JSON — IGNORE_UTF8_ERRORS', 'FALSE'],
              ['Compression', 'AUTO (auto-detect)'],
              ['PUT compression', 'GZIP (auto-applied)'],
            ]}
          />
        </Accordion>

        <Accordion title="ON_ERROR Options — Full List">
          <CompareTable
            headers={['Value', 'Behavior', 'Use Case']}
            rows={[
              ['ABORT_STATEMENT', 'Stop the entire COPY on first error (default for bulk)', 'Strict, all-or-nothing batch loads'],
              ['CONTINUE', 'Continue past errors, log them, load valid rows', 'Best-effort load with later error review'],
              ['SKIP_FILE', 'Skip the entire file containing any error (default for Snowpipe)', 'File-level atomicity'],
              ['SKIP_FILE_n', 'Skip file when error count reaches n (e.g., SKIP_FILE_5)', 'Small error tolerance per file'],
              ['SKIP_FILE_n%', 'Skip file when error percentage reaches n', 'Tolerate small percentage of bad rows'],
            ]}
          />
        </Accordion>

        <Accordion title="VALIDATION_MODE Options">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p><strong>VALIDATION_MODE = RETURN_n_ROWS</strong> — return up to n rows that would be loaded; <strong>NO data loaded</strong></p>
            <p><strong>VALIDATION_MODE = RETURN_ERRORS</strong> — return all error rows from the load attempt; <strong>NO data loaded</strong></p>
            <p><strong>VALIDATION_MODE = RETURN_ALL_ERRORS</strong> — historical mode (post-load): query errors after a normal COPY ran with CONTINUE</p>
            <p>VALIDATION_MODE on a bulk COPY <strong>requires the same target table</strong> — no schema change required</p>
            <p className="text-red-700 mt-2">Cannot be combined with FORCE; cannot be used with COPY INTO &lt;location&gt; (unloading)</p>
          </div>
        </Accordion>

        <Accordion title="Loading — Cannot-Do Matrix" badge="5-Point Audit" badgeColor="bg-purple-100 text-purple-700">
          <CompareTable
            headers={['Operation', 'Cannot Do', 'Confused With']}
            rows={[
              ['PUT', 'Run from Snowsight; copy from a remote machine; rename files; move files between stages', 'COPY — PUT is local→stage, COPY is stage→table'],
              ['GET', 'Run from Snowsight; download from external stages', 'COPY INTO &lt;location&gt; — that is unload to stage'],
              ['COPY INTO &lt;table&gt;', 'Transform aggressively (only column SELECT/CAST/UPPER allowed); join multiple files; load Excel/PDF', 'INSERT — COPY is bulk-optimized for staged files'],
              ['COPY INTO &lt;location&gt;', 'Append to existing files (always creates new); GZIP-rezip existing', 'PUT — UNLOAD is table→stage'],
              ['Snowpipe', 'Use schema evolution by default (must be enabled); transform aggressively; replace bulk for huge initial loads', 'Bulk COPY — Snowpipe is for continuous micro-batches'],
              ['Snowpipe Streaming', 'Be triggered by cloud events; use file-based source', 'Snowpipe (file-based) — Streaming is row-based via SDK'],
            ]}
          />
        </Accordion>

        <Accordion title="MATCH_BY_COLUMN_NAME Requirements">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p>Works with: <strong>JSON, Avro, ORC, Parquet, CSV (with PARSE_HEADER = TRUE)</strong></p>
            <p>Modes: <strong>NONE</strong> (default — positional), <strong>CASE_SENSITIVE</strong>, <strong>CASE_INSENSITIVE</strong></p>
            <p>Source columns missing in target: ignored (no error)</p>
            <p>Target columns missing in source: filled with NULL</p>
            <p>Used together with <strong>schema evolution</strong> (ENABLE_SCHEMA_EVOLUTION = TRUE on table) to auto-add new columns</p>
            <p className="text-red-700 mt-2">Without PARSE_HEADER = TRUE, CSV cannot use MATCH_BY_COLUMN_NAME — falls back to positional</p>
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
          '"PUT default compression is none" = FALSE — GZIP applied automatically',
          '"ENFORCE_LENGTH defaults FALSE" = FALSE — defaults TRUE (errors on overflow)',
          '"COPY INTO &lt;location&gt; can append to existing files" = FALSE — always creates new files',
          '"Excel files can be loaded directly via COPY" = FALSE — must convert to CSV/Parquet first',
          '"Snowpipe enables schema evolution by default" = FALSE — must be enabled per table',
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

        <Accordion title="Snowpipe — Defaults & Limits" badge="Memorize" badgeColor="bg-amber-100 text-amber-700">
          <CompareTable
            headers={['Item', 'Default / Limit', 'Notes']}
            rows={[
              ['ON_ERROR (Snowpipe)', 'SKIP_FILE', 'Different from bulk COPY'],
              ['AUTO_INGEST', 'FALSE', 'TRUE = listen to cloud event notifications (S3/SNS, Azure Event Grid, GCS Pub/Sub)'],
              ['Latency target', '~1 minute', 'Best-effort; not guaranteed real-time'],
              ['REST API: insertFiles batch', 'Up to 5000 files per call', 'Larger lists rejected'],
              ['Load history retention', '14 days', 'Files within 14 days deduplicated'],
              ['Billing', 'Per-file overhead + serverless compute seconds', 'No warehouse credits'],
              ['Pipe ownership', 'Role that creates it', 'OWNERSHIP transfer changes execution role'],
              ['Stale pipes', 'Pipe paused if files not flowing', 'Resume manually with ALTER PIPE ... RESUME'],
              ['Recommended file size', '100–250 MB compressed', 'Same as bulk COPY'],
            ]}
          />
        </Accordion>

        <Accordion title="Snowpipe REST API Endpoints">
          <CompareTable
            headers={['Endpoint', 'Purpose']}
            rows={[
              ['insertFiles', 'Trigger load for a list of files (up to 5000 per call)'],
              ['insertReport', 'Get per-file load status (returned by Snowpipe)'],
              ['loadHistoryScan', 'Query load history for a time range (auditing/recovery)'],
            ]}
          />
        </Accordion>

        <Accordion title="Snowpipe vs Snowpipe Streaming Cannot-Do" badge="5-Point Audit" badgeColor="bg-purple-100 text-purple-700">
          <CompareTable
            headers={['Aspect', 'Snowpipe (file-based)', 'Snowpipe Streaming']}
            rows={[
              ['Source', 'Files in stage (S3/Azure/GCS)', 'Direct rows via SDK or Kafka connector v2'],
              ['Latency', '~1 minute', 'Sub-second to seconds'],
              ['Cannot do', 'Sub-second latency; ingest a row outside file landing', 'Use cloud event triggers; load from staged files'],
              ['Idempotency', 'Filename-based dedup (14 d)', 'Channel + offset-based ordering'],
              ['Parallel client connections', 'Many writers OK', 'Per-channel ordering preserved'],
              ['Schema evolution', 'Optional (ENABLE_SCHEMA_EVOLUTION)', 'Supported'],
            ]}
          />
        </Accordion>

        <Accordion title="Stream Type Variations" badge="Exam Trap" badgeColor="bg-red-100 text-red-700">
          <CompareTable
            headers={['Stream Type', 'Tracks', 'Use Case']}
            rows={[
              ['Standard', 'INSERT, UPDATE, DELETE', 'Full CDC of changes'],
              ['APPEND_ONLY', 'INSERT only (UPDATE/DELETE invisible)', 'Faster — only adds matter (e.g., event ingestion)'],
              ['INSERT_ONLY (external tables)', 'INSERT-equivalent for files added to external stage', 'External-table-style CDC'],
            ]}
          />
          <CodeSnip>{`-- Standard\nCREATE STREAM s ON TABLE t;\n\n-- Append-only\nCREATE STREAM s ON TABLE t APPEND_ONLY = TRUE;\n\n-- External table\nCREATE STREAM s ON EXTERNAL TABLE et INSERT_ONLY = TRUE;`}</CodeSnip>
        </Accordion>

        <Accordion title="Stream — Defaults & Limits">
          <CompareTable
            headers={['Item', 'Default / Limit', 'Notes']}
            rows={[
              ['SHOW_INITIAL_ROWS', 'FALSE', 'TRUE on creation = first read returns ALL existing rows'],
              ['Offset advance', 'After successful DML consumption', 'Read alone doesn\'t advance — must consume in DML'],
              ['CHANGE_TRACKING required on source', 'YES (auto-enabled when stream is created)', 'Stream creation enables it implicitly'],
              ['Stale threshold', 'Source table retention (extension cap = 14 days default)', 'Past this → stale, must drop/recreate'],
              ['ALTER STREAM', 'Limited (cannot refresh stale)', 'Can only change comments/tags'],
              ['SYSTEM$STREAM_HAS_DATA', 'Returns TRUE/FALSE', 'Used in WHEN clauses on tasks'],
              ['Multiple streams on one table', 'Allowed', 'Each has its own offset'],
            ]}
          />
        </Accordion>

        <Accordion title="Task — Defaults & Limits">
          <CompareTable
            headers={['Item', 'Default / Limit', 'Notes']}
            rows={[
              ['Min schedule (warehouse task)', '1 minute', 'CRON or interval'],
              ['Min schedule (serverless task)', '~10 seconds', 'Newer feature'],
              ['Max DAG depth', '1000 tasks', 'Across all predecessors+children'],
              ['Max children per parent', '~100', 'Soft limit'],
              ['ALLOW_OVERLAPPING_EXECUTION', 'FALSE', 'TRUE = run new instance even if previous still running'],
              ['USER_TASK_TIMEOUT_MS', '3,600,000 (1 hour)', 'Max task runtime; auto-fails after'],
              ['SUSPEND_TASK_AFTER_NUM_FAILURES', '0 (disabled)', 'N consecutive failures → auto-suspend'],
              ['Privilege to start', 'OPERATE on task + EXECUTE TASK on account (for resume)', 'Plus USAGE on warehouse if not serverless'],
              ['CRON timezone', 'Mandatory in CRON expression', 'e.g., "USING CRON 0 9 * * MON America/New_York"'],
            ]}
          />
        </Accordion>

        <Accordion title="Task DAG Rules">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p>Only the <strong>root task has a SCHEDULE</strong> — children are triggered by predecessors</p>
            <p>Use <code className="bg-slate-100 px-1 rounded">AFTER &lt;task&gt;</code> in CREATE TASK to define predecessors</p>
            <p>A child can have <strong>multiple predecessors</strong> (waits for ALL by default)</p>
            <p>Tasks cannot share schedules — only ONE root per DAG</p>
            <p>RESUMING a child without a resumed root → never runs (no scheduler)</p>
            <p>Suspending root suspends DAG; suspending a child only stops that branch</p>
            <p className="text-red-700 mt-2">DAG cycles are rejected at CREATE/ALTER time</p>
          </div>
        </Accordion>

        <Accordion title="Dynamic Tables — Defaults & Limits">
          <CompareTable
            headers={['Item', 'Default / Limit', 'Notes']}
            rows={[
              ['TARGET_LAG', 'Required — DOWNSTREAM or interval', 'DOWNSTREAM = inherit from downstream consumers'],
              ['Min TARGET_LAG', '1 minute', 'Below this is rejected'],
              ['Refresh mode', 'AUTO (incremental when possible)', 'Falls back to FULL when query not incrementalable'],
              ['INITIALIZE', 'ON_CREATE (default)', 'ON_SCHEDULE delays first refresh'],
              ['Cannot DML directly', 'Read-only target', 'Use refresh, not INSERT/UPDATE/DELETE'],
              ['Supports JOIN, UNION, window funcs?', 'YES', 'Unlike materialized views'],
              ['Cloning', 'NOT supported', 'Cannot clone DT'],
              ['Replication', 'Supported', 'Via replication groups'],
            ]}
          />
        </Accordion>

        <Accordion title="Snowpipe vs Tasks vs Streams vs Dynamic Tables — Confusion Matrix">
          <CompareTable
            headers={['Capability', 'Snowpipe', 'Tasks', 'Streams', 'Dynamic Tables']}
            rows={[
              ['Triggers on file landing', 'YES', 'NO', 'NO', 'NO'],
              ['Continuous transformation', 'NO', 'YES (via SQL)', 'NO (just CDC)', 'YES (declarative)'],
              ['Maintains state', 'Filename hashes', 'No state', 'Offset', 'Materialized result'],
              ['Schedule', '~1 min event', 'CRON/interval', 'N/A — passive', 'TARGET_LAG'],
              ['Compute', 'Serverless', 'Warehouse OR serverless', 'No compute (metadata)', 'Serverless'],
              ['Imperative SQL', 'COPY (one statement)', 'Any SQL', 'N/A', 'Single SELECT'],
            ]}
          />
        </Accordion>

        <Traps list={[
          '"Snowpipe uses a user warehouse" = FALSE — serverless',
          '"Snowpipe Streaming requires staging files" = FALSE — direct row insertion',
          '"Stale streams can be refreshed with ALTER STREAM" = FALSE — must drop/recreate',
          '"Child tasks in a DAG can have their own SCHEDULE" = FALSE — root task only',
          '"WHEN FALSE = task runs but processes 0 rows" = FALSE — task is skipped, no compute',
          '"Dynamic tables are limited to one base table like MVs" = FALSE — support JOINs',
          '"insertFiles can take 10000 files per call" = FALSE — 5000 max',
          '"APPEND_ONLY streams capture UPDATEs" = FALSE — only INSERTs',
          '"INSERT_ONLY streams work on internal tables" = FALSE — external tables only',
          '"Reading from a stream advances its offset" = FALSE — offset only advances on consuming DML',
          '"Tasks can have CRON without a timezone" = FALSE — timezone is mandatory in CRON',
          '"Multiple streams on one table conflict" = FALSE — each tracks its own offset independently',
          '"USER_TASK_TIMEOUT_MS default is unlimited" = FALSE — defaults to 3,600,000 ms (1 hour)',
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

        <Accordion title="Driver Defaults & Behaviors" badge="Memorize" badgeColor="bg-amber-100 text-amber-700">
          <CompareTable
            headers={['Driver / Connector', 'Default Auth', 'Notable Default']}
            rows={[
              ['Python Connector', 'Username/password', 'Auto-commit ON; supports paramstyle = "pyformat"'],
              ['JDBC Driver', 'Username/password', 'Connection pool not built-in (use HikariCP)'],
              ['ODBC Driver', 'Username/password', 'Compatible with BI tools (Tableau, Power BI)'],
              ['Spark Connector', 'Username/password or key-pair', 'Pushdown enabled by default; reads via internal stage'],
              ['Kafka Connector v1', 'Key-pair only (no username/password)', 'Stages files internally, then Snowpipe loads'],
              ['Kafka Connector v2 / Snowpipe Streaming', 'Key-pair only', 'Direct row writes via SDK; no file staging'],
              ['Node.js / Go / .NET / PHP', 'Username/password (also OAuth, JWT)', 'Newer drivers support modern auth'],
            ]}
          />
        </Accordion>

        <Accordion title="Storage Integration — Cloud Provider Specifics">
          <CompareTable
            headers={['Cloud', 'Snowflake side', 'Customer side']}
            rows={[
              ['AWS S3', 'STORAGE_AWS_ROLE_ARN, AWS_EXTERNAL_ID', 'Customer creates IAM Role with trust policy back to Snowflake'],
              ['Azure Blob/ADLS', 'STORAGE_AZURE_TENANT_ID, AZURE_CONSENT_URL', 'Admin consents to Snowflake app in Azure AD'],
              ['GCS', 'STORAGE_GCP_SERVICE_ACCOUNT', 'Customer grants role to that GCP service account'],
            ]}
          />
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mt-2 text-xs space-y-1">
            <p>Storage integrations are <strong>not credentials</strong> — they are trust relationships</p>
            <p>The Snowflake account already has an identity in your cloud — you grant it permissions on YOUR storage</p>
            <p>One integration = many stages can use it (don\'t need integration per stage)</p>
            <p className="text-red-700">Cannot use cross-cloud (e.g., one integration cannot mix S3 + Azure)</p>
          </div>
        </Accordion>

        <Accordion title="Integration Type — Cannot-Do Matrix" badge="5-Point Audit" badgeColor="bg-purple-100 text-purple-700">
          <CompareTable
            headers={['Integration', 'Cannot Do', 'Confused With']}
            rows={[
              ['Storage integration', 'Authenticate to non-cloud storage; use across multiple clouds', 'External stage — storage integration is the trust, stage is the URL'],
              ['API integration', 'Load data via SELECT (use COPY); replace external stages', 'Storage integration — different trust; API integration is for HTTPS endpoints'],
              ['Notification integration', 'Send arbitrary HTTP webhooks (must be Snowflake-supported targets)', 'API integration — notifications are limited to email/SNS/Pub/Sub/Event Grid'],
              ['Git integration', 'Replace external stages; version data', 'External stage — Git syncs code files (SQL, Python, etc.)'],
              ['Security integration', 'Authenticate users (it integrates IdP); replace user table', 'Storage integration — different concept'],
            ]}
          />
        </Accordion>

        <Accordion title="PrivateLink (Network Connectivity)">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p><strong>AWS PrivateLink</strong>, <strong>Azure Private Link</strong>, <strong>GCP Private Service Connect</strong></p>
            <p>Edition gate: <strong>Business Critical+</strong> (or specifically licensed Enterprise in some cases)</p>
            <p>Provides a private endpoint in the customer\'s VPC — traffic never traverses the public internet</p>
            <p>Each region has its own PrivateLink endpoint (cross-region requires separate setup)</p>
            <p>Supports both inbound (clients → Snowflake) and outbound (Snowflake → customer services) configurations</p>
            <p className="text-red-700">PrivateLink does not provide compliance by itself — pair with Tri-Secret Secure for full BC features</p>
          </div>
        </Accordion>

        <Traps list={[
          '"Storage integration stores AWS keys" = FALSE — stores Snowflake IAM user ARN; customer grants trust',
          '"API integration is for loading data from REST APIs" = FALSE — for external functions and notifications',
          '"Git integration versions table data" = FALSE — syncs code files (SQL, Python)',
          '"Kafka Connector uses username/password" = FALSE — key-pair only',
          '"Spark Connector reads directly without staging" = FALSE — uses internal stage under the hood',
          '"Storage integration works across clouds" = FALSE — one cloud per integration',
          '"PrivateLink is available on Standard edition" = FALSE — Business Critical+',
          '"Notification integration sends arbitrary webhooks" = FALSE — limited to supported targets (email, SNS, Pub/Sub, Event Grid)',
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

        <Accordion title="Query Profile — Reading the Numbers" badge="Memorize" badgeColor="bg-amber-100 text-amber-700">
          <CompareTable
            headers={['Indicator', 'Where', 'What "bad" looks like']}
            rows={[
              ['Partitions Scanned / Partitions Total', 'TableScan operator', 'Ratio close to 1 → poor pruning'],
              ['Bytes Scanned', 'TableScan', 'Always check — but only meaningful with Total context'],
              ['Bytes Scanned from Cache', 'TableScan', 'Low % = no SSD reuse (cold WH)'],
              ['Bytes Spilled to Local', 'Sort/Aggregate/Join', 'Any value = WH memory exceeded — moderate'],
              ['Bytes Spilled to Remote', 'Sort/Aggregate/Join', 'Any value = SEVERE — both memory AND SSD exceeded'],
              ['Output rows >> input rows in JOIN', 'Join operator', 'Exploding join → bad join condition'],
              ['Pruning by Search Optimization Service', 'TableScan', 'Indicates SOS is being used'],
              ['Time spent in remote disk I/O', 'Per-operator', 'High = poor pruning or no clustering'],
              ['Time spent in synchronization', 'Per-operator', 'High = waiting on shuffles or joins'],
            ]}
          />
        </Accordion>

        <Accordion title="Query Profile Operators — What They Mean">
          <CompareTable
            headers={['Operator', 'Function']}
            rows={[
              ['TableScan', 'Read micro-partitions from storage (or cache)'],
              ['Filter', 'Apply WHERE predicates'],
              ['Join (Inner/Left/Right/Full)', 'Combine two inputs based on key'],
              ['Aggregate', 'GROUP BY / aggregations'],
              ['Sort', 'ORDER BY / window function partitioning'],
              ['Result', 'Final returned rows'],
              ['Generator', 'TABLE(GENERATOR(...)) — synthetic rows'],
              ['Flatten', 'Explode VARIANT array/object into rows'],
              ['UnionAll / Union', 'Combine multiple inputs'],
            ]}
          />
        </Accordion>

        <Accordion title="Performance Symptoms — What to Fix" badge="5-Point Audit" badgeColor="bg-purple-100 text-purple-700">
          <CompareTable
            headers={['Symptom', 'Root Cause', 'Fix', 'NOT a Fix']}
            rows={[
              ['Single query slow + spilling to remote', 'WH memory exceeded', 'Scale UP (larger WH); SELECT fewer columns', 'Multi-cluster (no help)'],
              ['Many users queuing', 'Concurrency exceeded WH capacity', 'Scale OUT (multi-cluster) or dedicated WH', 'Larger WH alone'],
              ['High Partitions Scanned ratio', 'Filter not aligned with clustering / no clustering', 'Add clustering key; rewrite filter; SOS for selective lookups', 'Larger WH'],
              ['Repeated identical queries slow', 'Result cache miss', 'Verify USE_CACHED_RESULT = TRUE; check non-deterministic functions', 'Larger WH'],
              ['Aggregation queries slow + repetitive', 'No materialization', 'Materialized View (Enterprise+) or Dynamic Table', 'Clustering key (less effective)'],
              ['Highly selective lookups slow', 'High-cardinality predicate, no index', 'Search Optimization Service', 'Clustering (for ranges, not point lookups)'],
              ['Large ad-hoc scan with selective filter', 'Pre-aggregation impractical, ad-hoc query', 'Query Acceleration Service', 'Larger WH (under-utilizes)'],
              ['Exploding joins', 'Cartesian-style join from missing key', 'Fix join condition; deduplicate input', 'Larger WH'],
            ]}
          />
        </Accordion>

        <Traps list={[
          '"Spilling to local = critical" = FALSE — moderate; REMOTE spilling is critical',
          '"Exploding joins = out of memory" = FALSE — means Cartesian product from bad join condition',
          '"Queuing = scale up" = FALSE — queuing = scale OUT with multi-cluster',
          '"Multi-cluster fixes spilling" = FALSE — Scale UP fixes spilling; Scale OUT fixes queueing',
          '"SELECT triggers re-clustering" = FALSE — only DML (INSERT/UPDATE/DELETE/MERGE/COPY)',
          '"Bytes Scanned attribute alone proves bad pruning" = FALSE — compare Partitions Scanned vs Partitions Total',
          '"Repeated query slow → larger warehouse" = FALSE — first verify cache rules; non-deterministic funcs break cache',
          '"Slow aggregation → clustering key" = FALSE — MV or Dynamic Table is the right answer',
          '"Highly selective point lookup → clustering" = FALSE — Search Optimization Service is the right answer',
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

        <Accordion title="Optimization Service — Defaults & Limits" badge="Memorize" badgeColor="bg-amber-100 text-amber-700">
          <CompareTable
            headers={['Service', 'Default / Limit', 'Notes']}
            rows={[
              ['QAS — ENABLE_QUERY_ACCELERATION', 'FALSE', 'Per-warehouse opt-in'],
              ['QAS — MAX_SCALE_FACTOR', '8 (default), 100 (max)', 'Multiplier on additional compute'],
              ['QAS billing', 'Serverless credits', 'Tracked in QUERY_ACCELERATION_HISTORY'],
              ['SOS billing', 'Serverless storage + maintenance', 'Per-column overhead'],
              ['SOS edition', 'Enterprise+', 'Not Standard'],
              ['MV edition', 'Enterprise+', 'Not Standard'],
              ['Auto-clustering billing', 'Serverless credits', 'NOT user-warehouse — separate budget'],
              ['Auto-clustering edition', 'All editions support clustering, but auto-clustering is recommended on Enterprise+', 'Cluster key DDL allowed everywhere'],
              ['Dynamic Table edition', 'Enterprise (recommended)', 'TARGET_LAG-driven serverless refresh'],
            ]}
          />
        </Accordion>

        <Accordion title="Optimization Confusion Matrix" badge="5-Point Audit" badgeColor="bg-purple-100 text-purple-700">
          <CompareTable
            headers={['Service', 'Best For', 'Cannot Help With']}
            rows={[
              ['Clustering key', 'Range scans on low-medium cardinality (DATE/TIMESTAMP); large tables (>1 TB)', 'Highly selective point lookups; tiny tables; high-cardinality lookups'],
              ['Search Optimization Service', 'Equality lookups on high-cardinality columns (e.g., WHERE id = 12345)', 'Range scans; aggregations; tiny tables (overhead dominates)'],
              ['Materialized View', 'Repetitive aggregation/filter on a single table', 'JOINs; transient/temp tables; tiny tables'],
              ['Dynamic Table', 'Continuous transformation including JOINs', 'Sub-minute latency (use Streams + Tasks); read-heavy without transformation'],
              ['Query Acceleration Service', 'Ad-hoc queries with large scans + selective filter', 'Data loading; DDL; small queries; stored procedure bodies'],
            ]}
          />
        </Accordion>

        <Accordion title="What Each Optimization CANNOT Help With">
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs space-y-1">
            <p className="font-bold text-red-700">Clustering CANNOT:</p>
            <p>✗ Replace SOS for high-cardinality point lookups</p>
            <p>✗ Reorganize external tables or transient tables (clustering on transient is often pointless)</p>
            <p>✗ Be applied to columns with deterministic-only functions (e.g., expressions are limited)</p>
            <p className="font-bold text-red-700 mt-2">Search Optimization CANNOT:</p>
            <p>✗ Help with range queries (BETWEEN, &gt;, &lt;)</p>
            <p>✗ Be added to columns of certain types (geography, semi-structured access paths varies)</p>
            <p>✗ Replace clustering for sequential scans</p>
            <p className="font-bold text-red-700 mt-2">Materialized Views CANNOT:</p>
            <p>✗ Use JOINs, UNIONs, ORDER BY, HAVING, LIMIT, window functions, non-deterministic functions</p>
            <p>✗ Be created on transient or temporary tables</p>
            <p>✗ Be created in Standard Edition</p>
            <p className="font-bold text-red-700 mt-2">QAS CANNOT:</p>
            <p>✗ Accelerate DDL or DML</p>
            <p>✗ Accelerate stored procedure bodies (only individual queries)</p>
            <p>✗ Replace clustering — QAS scans more data, just with more compute</p>
          </div>
        </Accordion>

        <Accordion title="Re-clustering — When Snowflake Acts">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p>Snowflake auto-reclusters tables that drift past a threshold (depth-based)</p>
            <p>Triggered when: <strong>data is modified</strong> (INSERT/UPDATE/DELETE/MERGE/COPY)</p>
            <p>NOT triggered by: SELECT, SHOW, DESCRIBE, USE, EXPLAIN</p>
            <p><code className="bg-slate-100 px-1 rounded">SYSTEM$CLUSTERING_INFORMATION</code> shows depth and partition stats</p>
            <p>Use <code className="bg-slate-100 px-1 rounded">ALTER TABLE ... SUSPEND/RESUME RECLUSTER</code> to control</p>
            <p>Re-clustering uses serverless credits (not your warehouse)</p>
          </div>
        </Accordion>

        <Traps list={[
          '"SOS clusters the table" = FALSE — creates access paths, does not reorganize',
          '"Clustering key on high-cardinality column (unique per row)" = BAD — expensive reclustering',
          '"MV supports JOINs" = FALSE — use Dynamic Tables for JOINs',
          '"QAS works for data loading" = FALSE — for queries only',
          '"Resource monitors track automatic clustering credits" = FALSE — use budgets',
          '"QAS_MAX_SCALE_FACTOR can be 1000" = FALSE — max is 100',
          '"SOS works on Standard Edition" = FALSE — Enterprise+',
          '"Reclustering happens for SELECT activity" = FALSE — only DML triggers it',
          '"Clustering helps a 10 GB table" = FALSE typically — recommended for tables &gt; ~1 TB',
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

        <Accordion title="Cache Defaults & Hard Limits" badge="Memorize" badgeColor="bg-amber-100 text-amber-700">
          <CompareTable
            headers={['Cache', 'TTL', 'Hard Limit', 'Disable Method']}
            rows={[
              ['Result cache', '24 h per reuse', 'Max 31 days if continuously reused', 'USE_CACHED_RESULT = FALSE'],
              ['Metadata cache', 'Always fresh (auto-updated)', 'No size limit', 'Cannot disable'],
              ['Warehouse SSD cache', 'While running', 'Bounded by node SSD size', 'Suspend warehouse → wiped'],
            ]}
          />
        </Accordion>

        <Accordion title="Cache — What Each CANNOT Cache" badge="5-Point Audit" badgeColor="bg-purple-100 text-purple-700">
          <CompareTable
            headers={['Cache', 'CANNOT Cache']}
            rows={[
              ['Result cache', 'Queries with non-deterministic functions (CURRENT_TIMESTAMP, RANDOM, UUID); queries against external tables (limited); queries with policies that returned different output last time; queries calling external functions; queries on data that changed; queries from a SHOW command'],
              ['Metadata cache', 'Computations beyond row counts/min/max/distinct; query results; user-defined function bodies'],
              ['Warehouse SSD cache', 'Result rows (those go to result cache); raw data after suspend (wiped)'],
            ]}
          />
        </Accordion>

        <Accordion title="Result Cache — Confusing Edge Cases">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p><strong>Different roles, same query, masked column:</strong> different cache entries (output differs)</p>
            <p><strong>Different roles, same query, no policy on cols:</strong> same cache entry can be reused</p>
            <p><strong>Different warehouses, same query:</strong> SAME cache entry — result cache is account-level (Cloud Services)</p>
            <p><strong>NO warehouse running, same query:</strong> SAME cache entry served (no compute needed)</p>
            <p><strong>Whitespace-only difference in query text:</strong> cache MISS — query text must match character-by-character</p>
            <p><strong>Different alias on a column:</strong> cache MISS</p>
            <p><strong>Underlying table altered (column added/dropped):</strong> cache invalidated</p>
            <p><strong>Underlying table TRUNCATEd:</strong> cache invalidated</p>
          </div>
        </Accordion>

        <Accordion title="Metadata-Only Queries (No Warehouse Needed)">
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 text-xs space-y-1">
            <p>These can be answered without spinning up a warehouse:</p>
            <p>✓ <code className="bg-slate-100 px-1 rounded">SELECT COUNT(*) FROM table</code> (no WHERE)</p>
            <p>✓ <code className="bg-slate-100 px-1 rounded">SELECT MIN(col), MAX(col) FROM table</code> if metadata available</p>
            <p>✓ <code className="bg-slate-100 px-1 rounded">SHOW</code> commands (tables, schemas, etc.)</p>
            <p>✓ <code className="bg-slate-100 px-1 rounded">DESCRIBE</code> commands</p>
            <p>✓ <code className="bg-slate-100 px-1 rounded">SELECT CURRENT_VERSION()</code></p>
            <p className="text-red-700 mt-2">A WHERE clause typically forces a warehouse to scan partitions</p>
          </div>
        </Accordion>

        <Traps list={[
          '"Result cache requires the same warehouse" = FALSE — account-level, any warehouse hits it',
          '"Result cache persists indefinitely" = FALSE — 24 h per reuse, hard max 31 days',
          '"SSD cache survives suspend" = FALSE — completely wiped',
          '"Two users, same query, different roles, table has masking policy → share cache" = FALSE — role-specific',
          '"COUNT(*) requires a warehouse" = FALSE — can be answered from metadata cache',
          '"CURRENT_DATE() in a query hits the result cache" = FALSE — non-deterministic, always re-executes',
          '"Result cache invalidates only when DML changes data" = FALSE — also invalidated by ALTER TABLE, policy changes, query text change',
          '"Whitespace differences are normalized for cache lookup" = FALSE — exact text match required',
          '"USE_CACHED_RESULT must be enabled per session" = FALSE — TRUE by default',
          '"SHOW commands consume warehouse credits" = FALSE — answered from metadata',
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

        <Accordion title="Procedure vs UDF — Cannot-Do Matrix" badge="5-Point Audit" badgeColor="bg-purple-100 text-purple-700">
          <CompareTable
            headers={['Capability', 'Stored Procedure', 'Scalar UDF', 'UDTF (Table UDF)']}
            rows={[
              ['Execute DDL', 'YES', 'NO', 'NO'],
              ['Execute DML', 'YES', 'NO', 'NO'],
              ['Begin/commit transactions', 'YES', 'NO', 'NO'],
              ['Return type', 'Single scalar', 'Scalar', 'Tabular (rows)'],
              ['Be called in SELECT', 'NO (must CALL)', 'YES (in expression)', 'YES (via TABLE() syntax)'],
              ['Run in caller\'s privileges', 'Optional (EXECUTE AS CALLER)', 'Always caller', 'Always caller'],
              ['Cache results', 'NO', 'YES (deterministic only)', 'NO'],
              ['Languages', 'SQL, JavaScript, Python, Java, Scala', 'SQL, JS, Python, Java, Scala', 'Same'],
            ]}
          />
        </Accordion>

        <Accordion title="EXECUTE AS — OWNER vs CALLER">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p><strong>EXECUTE AS OWNER (default):</strong> Procedure runs with the OWNER\'s privileges. Caller doesn\'t need privileges on referenced objects.</p>
            <p><strong>EXECUTE AS CALLER:</strong> Procedure runs with the CALLER\'s privileges. Caller needs all privileges on referenced objects.</p>
            <p>UDFs always run as caller — no EXECUTE AS keyword</p>
            <p className="text-red-700 mt-2">EXECUTE AS OWNER is dangerous if a high-privilege role owns a procedure that a low-privilege role can call — privilege escalation risk</p>
            <p>Best practice: use EXECUTE AS CALLER for routines that should respect caller permissions</p>
          </div>
        </Accordion>

        <Accordion title="Function Confusion — Lookalikes & Edge Cases">
          <CompareTable
            headers={['Group', 'Functions', 'Key Difference']}
            rows={[
              ['NULL handling', 'NVL / NVL2 / IFNULL / COALESCE', 'NVL = COALESCE 2-arg; NVL2 has 3 args; IFNULL synonym for NVL'],
              ['Conditional', 'IFF / DECODE / CASE', 'IFF is short ternary; DECODE = old SQL CASE-WHEN-equality'],
              ['JSON parse', 'PARSE_JSON / TO_JSON / TO_VARIANT', 'PARSE_JSON: string→variant; TO_JSON: variant→string; TO_VARIANT: any→variant cast'],
              ['Object build', 'OBJECT_CONSTRUCT / OBJECT_AGG', 'CONSTRUCT = single row; AGG = aggregate from many rows'],
              ['Aggregation', 'LISTAGG / ARRAY_AGG / GROUP_CONCAT', 'GROUP_CONCAT does not exist in Snowflake; LISTAGG returns string; ARRAY_AGG returns array'],
              ['Hashing', 'HASH / HASH_AGG / MD5', 'HASH = single value hash; HASH_AGG = whole table hash; MD5 = string MD5'],
              ['Date diff', 'DATEDIFF / TIMESTAMPDIFF', 'TIMESTAMPDIFF is alias for DATEDIFF'],
            ]}
          />
        </Accordion>

        <Accordion title="VARIANT Path Syntax — Common Pitfalls">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p><strong>Valid:</strong> <code className="bg-slate-100 px-1 rounded">data:user.name</code></p>
            <p><strong>Valid:</strong> <code className="bg-slate-100 px-1 rounded">data:user:name</code></p>
            <p><strong>Valid:</strong> <code className="bg-slate-100 px-1 rounded">data:items[0].id</code></p>
            <p><strong>INVALID:</strong> <code className="bg-slate-100 px-1 rounded">data.user.name</code> (cannot start path with dot — must use colon for first level)</p>
            <p><strong>VALID alternative:</strong> <code className="bg-slate-100 px-1 rounded">GET_PATH(data, 'user.name')</code></p>
            <p>Extracted values are VARIANT — must <code className="bg-slate-100 px-1 rounded">::VARCHAR</code> or <code className="bg-slate-100 px-1 rounded">::INTEGER</code> to get native type</p>
            <p>Comparing VARIANT to literal string without cast may fail or behave unexpectedly</p>
          </div>
        </Accordion>

        <Accordion title="Transaction Behavior — Defaults & Auto-Commits">
          <CompareTable
            headers={['Statement Type', 'Auto-Commit Behavior']}
            rows={[
              ['DDL (CREATE, ALTER, DROP)', 'Auto-commits (always)'],
              ['DML (INSERT/UPDATE/DELETE/MERGE)', 'Inside transaction if BEGIN was issued; otherwise auto-commits'],
              ['SELECT (read)', 'No transaction effect'],
              ['BEGIN / COMMIT / ROLLBACK', 'Explicit transaction control'],
              ['CALL stored_procedure(...)', 'Procedure runs in implicit transaction; can manage own'],
              ['Multi-statement transaction', 'Requires BEGIN; ends with COMMIT or ROLLBACK'],
            ]}
          />
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-2 text-xs">
            <p className="font-bold text-amber-700">DDL within a transaction → auto-commits</p>
            <p className="text-slate-700 mt-1">Any DDL statement (CREATE TABLE, ALTER, DROP) commits any prior open transaction. There is no "DDL within transaction" semantics.</p>
          </div>
        </Accordion>

        <Accordion title="MERGE Behavior — Single-Row vs Multi-Row Match">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p><strong>ERROR_ON_NONDETERMINISTIC_MERGE</strong> session parameter — default <strong>TRUE</strong></p>
            <p>If multiple source rows match one target row → ERROR by default (prevents undefined winner)</p>
            <p>Set FALSE to allow non-deterministic last-wins behavior (not recommended)</p>
            <p>Best practice: deduplicate source with QUALIFY ROW_NUMBER() = 1 before MERGE</p>
            <p>WHEN MATCHED branch can have UPDATE or DELETE (or both with conditions)</p>
            <p>WHEN NOT MATCHED branch can only have INSERT</p>
            <p>WHEN NOT MATCHED BY SOURCE can have DELETE (Snowflake-specific extension)</p>
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
          '"DDL inside BEGIN...COMMIT is part of the transaction" = FALSE — DDL auto-commits',
          '"data.user.name is valid VARIANT path syntax" = FALSE — must start with colon: data:user.name',
          '"Stored procedures can be called in a SELECT expression" = FALSE — must use CALL',
          '"EXECUTE AS OWNER is the safer default" = NUANCED — protects callers from needing privileges, but creates escalation risk if owner has high privileges',
          '"UDFs can begin/commit transactions" = FALSE — only procedures',
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

        <Accordion title="Time Travel — All Forms of Reference" badge="Memorize" badgeColor="bg-amber-100 text-amber-700">
          <CodeSnip>{`-- AT vs BEFORE\nSELECT * FROM t AT(OFFSET => -300);     -- 300 SECONDS ago (now-300s)\nSELECT * FROM t AT(TIMESTAMP => '2026-01-01 12:00:00'::TIMESTAMP_NTZ);\nSELECT * FROM t AT(STATEMENT => '01abcd...');  -- query ID — at moment that query ran\nSELECT * FROM t BEFORE(STATEMENT => '01abcd...'); -- just BEFORE that statement\nSELECT * FROM t BEFORE(TIMESTAMP => '...');\n\n-- UNDROP\nUNDROP TABLE my_dropped_table;`}</CodeSnip>
          <CompareTable
            headers={['Reference', 'Meaning']}
            rows={[
              ['OFFSET', 'Negative seconds from now (e.g., -300 = 5 minutes ago)'],
              ['TIMESTAMP', 'Specific timestamp; rounded to micro-partition closest to time'],
              ['STATEMENT', 'Query ID; AT = at the moment the statement ran; BEFORE = just before'],
              ['UNDROP', 'Restore most-recently-dropped object of the same name'],
            ]}
          />
        </Accordion>

        <Accordion title="Time Travel CANNOT" badge="5-Point Audit" badgeColor="bg-purple-100 text-purple-700">
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs space-y-1">
            <p>✗ Be used on external tables (no AT/BEFORE clause)</p>
            <p>✗ Recover dropped warehouses (warehouses don\'t have Time Travel)</p>
            <p>✗ Recover dropped views (views are not stored data)</p>
            <p>✗ Recover dropped stages, pipes (not Time Travel-able)</p>
            <p>✗ Be used after DATA_RETENTION = 0 — Time Travel is disabled</p>
            <p>✗ Span more than the table\'s retention setting at the moment of the action</p>
            <p>✗ Be extended retroactively after expiration — once expired, data is gone</p>
            <p>✗ Coexist with secondary read replicas in some replication contexts</p>
          </div>
        </Accordion>

        <Accordion title="Cloning — Defaults & Behaviors">
          <CompareTable
            headers={['Detail', 'Behavior']}
            rows={[
              ['Storage at clone time', 'Zero — clone shares micro-partitions until divergence'],
              ['Snapshot moment', 'When CREATE ... CLONE is INITIATED (not when it completes)'],
              ['Concurrent DML on source', 'NOT visible in clone (clone is point-in-time)'],
              ['Privileges on clone', 'Inherits container privileges (e.g., schema-level grants); object-level privileges NOT cloned by default'],
              ['COPY GRANTS option', 'CREATE ... CLONE ... COPY GRANTS — replicate object-level grants'],
              ['Streams on cloned source', 'Cloned object can have NEW streams; source stream offset is independent'],
              ['Tasks in clone', 'Cloned in SUSPENDED state — must manually resume'],
              ['Pipes in clone', 'Cloned SUSPENDED; load history NOT cloned (re-loads possible)'],
              ['External tables', 'NOT cloned — excluded entirely from DB clones'],
              ['Internal stages', 'NOT cloned (Unsupported feature error)'],
            ]}
          />
        </Accordion>

        <Accordion title="Replication & Failover — Defaults & Limits">
          <CompareTable
            headers={['Item', 'Default / Limit', 'Notes']}
            rows={[
              ['Replication group', 'Manual create; objects must be added explicitly', 'Read-only on secondary'],
              ['Failover group', 'Manual create; subset of replication groups', 'Allows promote secondary → primary'],
              ['Edition for replication', 'All editions (basic database replication available)', 'Cross-region/cloud also available'],
              ['Edition for failover', 'Business Critical+ on BOTH source and target', 'Hard requirement'],
              ['Schedule', 'Default = ON_DEMAND (manual REFRESH)', 'Can be scheduled (e.g., every 60 min)'],
              ['Replicable objects', 'DBs, shares, roles, users, warehouses, integrations, network policies', 'NOT: stages (internal), tasks history, query history'],
              ['Direction', 'One-way at a time', 'Promote secondary to flip direction'],
              ['Time Travel after failover', 'Inherits target retention settings', 'Pre-failover history is target-side only'],
            ]}
          />
        </Accordion>

        <Accordion title="What Cannot Be Replicated">
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs space-y-1">
            <p>✗ Internal stages (named) — only external stages metadata replicated</p>
            <p>✗ Streams — must be recreated post-failover</p>
            <p>✗ Tasks — replicated as objects, but execution state varies</p>
            <p>✗ Query history / load history</p>
            <p>✗ Result cache</p>
            <p>✗ Account-level metadata that doesn\'t belong to a replication group</p>
            <p>✗ Reader accounts (must be recreated)</p>
            <p>✗ Some integrations (storage, API, notification — verify each)</p>
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
          '"AT(OFFSET => -300) means 300 minutes ago" = FALSE — 300 SECONDS ago',
          '"Cloning automatically copies object-level grants" = FALSE — must specify COPY GRANTS',
          '"Failover groups work on Standard edition" = FALSE — Business Critical+',
          '"UNDROP works on dropped views" = FALSE — views are not Time Travel-able',
          '"Clone of a pipe inherits its load history" = FALSE — pipes cloned suspended; load history NOT cloned',
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

        <Accordion title="Share — Defaults & Limits" badge="Memorize" badgeColor="bg-amber-100 text-amber-700">
          <CompareTable
            headers={['Item', 'Default / Limit', 'Notes']}
            rows={[
              ['Privilege to create share', 'ACCOUNTADMIN (or CREATE SHARE granted)', 'Cannot delegate to SECURITYADMIN by default'],
              ['Share scope', 'Account-level object', 'Not in any database'],
              ['Direct share scope', 'Same region only', 'Cross-region requires Listings'],
              ['Reader account limit (default)', '20 per provider account', 'Hard default; raise with Support'],
              ['Consumer storage charge', '0 (provider pays)', 'Zero-copy share — no consumer storage'],
              ['Consumer compute charge', 'Consumer\'s own warehouse', 'Reader Accounts: provider pays'],
              ['Number of consumers per share', 'No documented limit', 'Add accounts via ALTER SHARE'],
              ['Share refresh cadence', 'Real-time (no manual refresh)', 'Consumer sees changes immediately'],
            ]}
          />
        </Accordion>

        <Accordion title="Share Type Confusion Matrix" badge="5-Point Audit" badgeColor="bg-purple-100 text-purple-700">
          <CompareTable
            headers={['Type', 'Cross-region?', 'Monetization?', 'Compute Billed To']}
            rows={[
              ['Direct Share', 'NO (same region)', 'NO', 'Consumer'],
              ['Listing (Marketplace public)', 'YES (auto-fulfillment)', 'YES (paid listings)', 'Consumer'],
              ['Listing (private)', 'YES', 'YES (or free)', 'Consumer'],
              ['Reader Account', 'Same as direct share (region-bound)', 'NO', 'PROVIDER'],
              ['Native App', 'YES (via Marketplace)', 'YES', 'Consumer'],
              ['Data Clean Room', 'YES (Marketplace deployment)', 'YES', 'Both contribute compute'],
            ]}
          />
        </Accordion>

        <Accordion title="What CAN and CANNOT Be Shared — Full List">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p className="font-bold text-green-700">CAN share:</p>
            <p>✓ Tables (permanent, external, Iceberg)</p>
            <p>✓ Secure views</p>
            <p>✓ Secure UDFs (SECURE keyword)</p>
            <p>✓ Secure materialized views</p>
            <p>✓ Dynamic tables</p>
            <p className="font-bold text-red-700 mt-2">CANNOT share:</p>
            <p>✗ Standard (non-secure) views</p>
            <p>✗ Standard UDFs / regular UDFs</p>
            <p>✗ Stored procedures</p>
            <p>✗ Stages (internal or external)</p>
            <p>✗ Sequences</p>
            <p>✗ File formats</p>
            <p>✗ Pipes, Tasks, Streams</p>
            <p>✗ Warehouses (consumer brings own)</p>
            <p>✗ Roles, users (separate replication)</p>
          </div>
        </Accordion>

        <Accordion title="Consumer Restrictions — Direct Shares">
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs space-y-1">
            <p className="font-bold text-red-700">Consumer of a Direct Share CANNOT:</p>
            <p>✗ INSERT/UPDATE/DELETE/MERGE on shared objects (read-only)</p>
            <p>✗ CLONE shared objects (no OWNERSHIP)</p>
            <p>✗ Run Time Travel queries on shared data</p>
            <p>✗ Add masking/row access policies (provider controls)</p>
            <p>✗ Replicate the shared database to another region (must be re-shared)</p>
            <p>✗ See dropped objects (revocation is immediate)</p>
            <p>✗ Re-share with another account (no re-sharing of received shares)</p>
          </div>
        </Accordion>

        <Accordion title="Reader Accounts — Cannot-Do Matrix">
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs space-y-1">
            <p className="font-bold text-red-700">Reader Account CANNOT:</p>
            <p>✗ CREATE SHARE (no outbound sharing)</p>
            <p>✗ CREATE PIPE (no Snowpipe automation)</p>
            <p>✗ CREATE STAGE (named stages restricted)</p>
            <p>✗ Access Snowflake Marketplace</p>
            <p>✗ SHOW PROCEDURES on certain system schemas</p>
            <p>✗ Be replicated (must be recreated post-failover)</p>
            <p>✗ Use Reader Accounts for compute beyond what provider pays</p>
            <p className="font-bold text-green-700 mt-2">Reader Account CAN:</p>
            <p>✓ Create warehouses (provider pays)</p>
            <p>✓ Create databases, schemas, tables, views</p>
            <p>✓ Run queries against shared data</p>
            <p>✓ Have its own users and roles within the account</p>
          </div>
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
          '"Consumer can re-share received data with another account" = FALSE — no re-sharing of received shares',
          '"Reader Accounts can be replicated" = FALSE — must be recreated post-failover',
          '"Stored procedures and standard UDFs can be shared" = FALSE — only SECURE UDFs',
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

        <Accordion title="Numbers to Memorize — Master Cheat Sheet" badge="Cheat Sheet" badgeColor="bg-rose-100 text-rose-700">
          <CompareTable
            headers={['Concept', 'Value']}
            rows={[
              ['Fail-safe (permanent)', '7 days'],
              ['Fail-safe (transient/temporary)', '0 days'],
              ['Time Travel max (Standard)', '1 day'],
              ['Time Travel max (Enterprise+, permanent)', '90 days'],
              ['Time Travel max (transient/temporary, all editions)', '1 day'],
              ['DATA_RETENTION default', '1 day (DB → schema → table inheritance)'],
              ['DATA_RETENTION = 0', 'Disables Time Travel; UNDROP fails'],
              ['MAX_DATA_EXTENSION_TIME default', '14 days'],
              ['COPY metadata retention', '64 days'],
              ['Snowpipe metadata retention', '14 days'],
              ['Snowpipe insertFiles batch limit', '5000 files per call'],
              ['Snowpipe latency target', '~1 minute'],
              ['Optimal load file size', '100–250 MB compressed'],
              ['Micro-partition size', '50–500 MB uncompressed (~16 MB compressed)'],
              ['Multi-cluster WH max clusters', '10'],
              ['Multi-cluster ECONOMY wait time', '6 minutes before adding cluster'],
              ['MAX_CLUSTER_COUNT default', '1 (single cluster)'],
              ['MIN_CLUSTER_COUNT default', '1'],
              ['SCALING_POLICY default', 'STANDARD'],
              ['AUTO_SUSPEND default', '600 s (10 min)'],
              ['AUTO_SUSPEND = 0', 'NEVER suspend (not "immediate")'],
              ['AUTO_RESUME default', 'TRUE'],
              ['Per-resume billing minimum', '60 seconds'],
              ['QAS_MAX_SCALE_FACTOR default / max', '8 / 100'],
              ['Result cache TTL (per reuse)', '24 hours'],
              ['Result cache hard max', '31 days if continuously reused'],
              ['STATEMENT_TIMEOUT_IN_SECONDS default', '172800 s (2 days)'],
              ['STATEMENT_QUEUED_TIMEOUT_IN_SECONDS default', '0 (no timeout)'],
              ['LOCK_TIMEOUT default', '43200 s (12 hours)'],
              ['Session idle timeout default', '4 hours'],
              ['CLIENT_SESSION_KEEP_ALIVE default', 'FALSE'],
              ['ABORT_DETACHED_QUERY default', 'FALSE'],
              ['USE_CACHED_RESULT default', 'TRUE'],
              ['ERROR_ON_NONDETERMINISTIC_MERGE default', 'TRUE'],
              ['Identifier max length', '255 characters'],
              ['QUERY_TAG max length', '2000 characters'],
              ['SQL statement max length', '1,000,000 characters'],
              ['Tag keys per object max', '50'],
              ['Tag value length max', '256 characters'],
              ['Masking policies per column', '1'],
              ['Row access policies per table', '1'],
              ['Reader Account limit per provider', '20 accounts'],
              ['Clustering recommended for tables', '> ~1 TB'],
              ['Direct Share scope', 'Same region only'],
              ['Listing scope', 'Cross-region (Auto-Fulfillment)'],
              ['Reader Account compute billing', 'Provider pays'],
              ['Replicated DB access', 'Read-only (until failover)'],
              ['Failover requires edition', 'Business Critical+ on both source AND target'],
              ['PrivateLink edition', 'Business Critical+'],
              ['Task minimum schedule (warehouse)', '1 minute'],
              ['Task minimum schedule (serverless)', '~10 seconds'],
              ['USER_TASK_TIMEOUT_MS default', '3,600,000 ms (1 hour)'],
              ['Task DAG max depth', '1000 tasks'],
              ['Dynamic Table min TARGET_LAG', '1 minute'],
              ['Stream stale threshold', 'Source retention + extension cap (default 14 days)'],
              ['Resource Monitor default frequency', 'MONTHLY'],
              ['Resource Monitor CREATE privilege', 'ACCOUNTADMIN only'],
              ['Resource Monitor min privileges to view+modify', 'MONITOR + MODIFY'],
              ['ACCOUNT_USAGE retention', '365 days (typical)'],
              ['ACCOUNT_USAGE latency', '45 min – 3 hours'],
              ['INFORMATION_SCHEMA retention', '7–14 days'],
              ['Default password min length', '8 characters'],
              ['Key-pair max keys per user', '2 (for rotation)'],
              ['Min key size', '2048-bit RSA'],
              ['Network policy precedence', 'BLOCKED > ALLOWED; user > account'],
              ['Encryption at rest', 'AES-256 (all editions)'],
              ['Tri-Secret Secure', 'Business Critical+'],
              ['Consumer Time Travel on shared data', 'NOT available'],
              ['Snowpark languages', 'Python, Java, Scala (NOT JavaScript)'],
              ['JavaScript UDF', 'Via raw SQL only (NOT Snowpark API)'],
              ['VARIANT path syntax', 'data:key (colon required at root); GET_PATH() alternative'],
              ['DDL within transaction', 'Auto-commits any open transaction'],
              ['DEFAULT_ROLE', 'Does NOT grant role; only sets default'],
              ['DEFAULT_WAREHOUSE', 'Does NOT grant USAGE; only sets default'],
            ]}
          />
        </Accordion>

        <Accordion title="Listing Type Variations" badge="Memorize" badgeColor="bg-amber-100 text-amber-700">
          <CompareTable
            headers={['Listing Type', 'Discoverability', 'Monetization', 'Notes']}
            rows={[
              ['Public free', 'Anyone can discover via Marketplace search', 'NO', 'Default for community/promotional data'],
              ['Public paid', 'Anyone can discover; payment required to access', 'YES', 'Subscription or one-time'],
              ['Private', 'Visible only to specifically invited accounts', 'Optional', 'For B2B / partner sharing'],
              ['Personalized', 'Customized data per consumer', 'Typically YES', 'Newer feature; per-consumer instance'],
              ['Free vs Free Trial', 'Free always; Free Trial converts to paid after period', 'Free Trial supports paid conversion', 'Different from Public free'],
            ]}
          />
        </Accordion>

        <Accordion title="Marketplace — Defaults & Limits">
          <CompareTable
            headers={['Item', 'Default / Limit', 'Notes']}
            rows={[
              ['Provider role', 'ACCOUNTADMIN required to create listings', 'Plus PROVIDER profile setup'],
              ['Provider profile', 'One per account', 'Shows on Marketplace listings'],
              ['Auto-Fulfillment (cross-cloud)', 'Provider opts in per listing', 'Snowflake handles cross-region replication'],
              ['Listing approval', 'Snowflake review required for public listings', 'Private listings skip review'],
              ['Listing region', 'Listing must be available in regions where consumer is', 'Auto-Fulfillment expands availability'],
              ['Pricing models', 'Free, Paid (one-time), Paid (subscription)', 'Currency = USD typically'],
              ['Trial period', 'Provider configurable', '30 days common'],
            ]}
          />
        </Accordion>

        <Accordion title="Native Apps — Defaults & Architecture">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <p>App package = code (SQL, Python, Streamlit) + version</p>
            <p>Provider creates an APPLICATION PACKAGE → adds versions → publishes via Listing</p>
            <p>Consumer installs APPLICATION from Listing → app runs in consumer\'s account</p>
            <p>Consumer\'s compute (warehouse) is used; provider does NOT pay for compute</p>
            <p>App can request privileges from consumer (e.g., access to consumer tables)</p>
            <p>Application roles: APP_ADMIN (admin tasks), APP_PUBLIC (default user role)</p>
            <p className="text-red-700 mt-2">Provider code is opaque to consumer (provider IP protected); consumer data is opaque to provider</p>
          </div>
        </Accordion>

        <Accordion title="Data Clean Rooms — Workflow Detail">
          <CompareTable
            headers={['Step', 'Provider', 'Consumer']}
            rows={[
              ['1. Create clean room', 'YES (publishes via Listing)', '—'],
              ['2. Define templates', 'YES (allowed analyses + privacy rules)', '—'],
              ['3. Install / join', '—', 'YES'],
              ['4. Link own data', 'YES (provider data)', 'YES (consumer data)'],
              ['5. Run analysis', '—', 'YES (using approved templates only)'],
              ['6. View results', '—', 'YES (aggregated/permitted output)'],
              ['7. Manage policies', 'YES (privacy budget, k-anonymity)', '—'],
            ]}
          />
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-2 text-xs">
            <p className="font-bold text-amber-700">Privacy guarantee</p>
            <p className="text-slate-700 mt-1">Both parties contribute data; neither sees the other\'s raw rows. Output is the controlled result of the approved template (typically aggregated).</p>
          </div>
        </Accordion>

        <Accordion title="Marketplace Cannot-Do Matrix" badge="5-Point Audit" badgeColor="bg-purple-100 text-purple-700">
          <CompareTable
            headers={['Capability', 'Cannot Do']}
            rows={[
              ['Listing payment', 'Cannot mix payment models (one model per listing)'],
              ['Listing visibility', 'Cannot make a listing both Public and Private (different listings required)'],
              ['Listing data', 'Cannot include non-shareable objects (procedures, standard UDFs, stages)'],
              ['Native App', 'Cannot run on provider compute; cannot access consumer data without explicit grants'],
              ['Personalized listing', 'Cannot serve same physical data to all consumers — per-consumer instance'],
              ['Auto-Fulfillment', 'Cannot work without provider opt-in per listing'],
              ['Clean Room', 'Cannot allow consumer to see provider\'s raw rows (and vice versa)'],
            ]}
          />
        </Accordion>

        <Traps list={[
          '"Direct shares support cross-region sharing" = FALSE — use Listings',
          '"Direct shares support monetization" = FALSE — use Listings',
          '"Listings are only public" = FALSE — private listings exist for specific accounts',
          '"Native Apps run on the provider\'s compute" = FALSE — consumer\'s compute',
          '"Auto-Fulfillment is automatic for all listings" = FALSE — provider must opt in',
          '"Clean Room consumers see raw provider rows" = FALSE — only approved aggregated outputs',
          '"Personalized listings serve identical data to all consumers" = FALSE — per-consumer instance',
          '"Free Trial listings stay free forever" = FALSE — convert to paid after trial',
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
