import React, { useState } from 'react';
import { ChevronRight, AlertTriangle, Zap } from 'lucide-react';

// ── Shared micro-components ────────────────────────────────────────────────────
const Trap = ({ children }) => (
  <span className="inline-block bg-red-100 text-red-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide">
    ✗ Trap
  </span>
);
const Truth = () => (
  <span className="inline-block bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide">
    ✓ Truth
  </span>
);
const ExamAngle = () => (
  <span className="inline-block bg-amber-100 text-amber-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide">
    🎯 Exam Angle
  </span>
);

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

const TrapItem = ({ title, trap, truth, examAngle, children }) => (
  <Accordion title={title}>
    <div className="space-y-2">
      <div>
        <Trap /> <span className="ml-1 text-slate-700">{trap}</span>
      </div>
      <div>
        <Truth /> <span className="ml-1 text-slate-700 font-medium">{truth}</span>
      </div>
      {examAngle && (
        <div>
          <ExamAngle /> <span className="ml-1 text-slate-600 italic">{examAngle}</span>
        </div>
      )}
      {children}
    </div>
  </Accordion>
);

// ── DATA ──────────────────────────────────────────────────────────────────────

const TRAP_SECTIONS = [
  {
    id: 'names',
    label: '🏷️ Misleading Names',
    color: 'bg-red-500',
    items: (
      <div className="space-y-3">
        <TrapItem
          title="Reader Account = 'Read-Only'"
          trap="Reader Accounts can only read shared data, no compute or objects."
          truth="Reader Accounts CAN create warehouses, databases, tables, and views. The provider pays for all compute."
          examAngle='"Can a Reader Account consumer create staging tables to join with shared data?" YES.'
        />
        <TrapItem
          title="ECONOMY Scaling = 'Saves Money by Reducing Queuing'"
          trap="Economy mode is always cheaper and better."
          truth="Economy INCREASES queuing. It waits 6 minutes before adding a cluster. STANDARD adds immediately."
          examAngle='"What can reduce queuing?" Increase MAX_CLUSTER_COUNT — NOT switch to ECONOMY.'
        />
        <TrapItem
          title="AUTO_SUSPEND = 0 = 'Suspend Immediately'"
          trap="Setting to 0 means instant suspend."
          truth="AUTO_SUSPEND = 0 means NEVER auto-suspend. The warehouse runs indefinitely."
          examAngle='"A warehouse has AUTO_SUSPEND = 0. What does this mean?" → It never suspends on its own.'
        />
        <TrapItem
          title="USERADMIN = 'Only Users'"
          trap="USERADMIN only creates users."
          truth="USERADMIN creates AND manages BOTH users AND roles, and grants roles to users."
          examAngle='"Which role creates roles?" USERADMIN (not just SECURITYADMIN).'
        />
        <TrapItem
          title="Fail-safe = 'User-Accessible Backup'"
          trap="Fail-safe is like extended Time Travel that you can query."
          truth="Fail-safe is ONLY accessible by Snowflake Support, best-effort recovery. Users cannot query it."
          examAngle='"During Fail-safe, who can recover data?" Only Snowflake Support.'
        />
      </div>
    ),
  },
  {
    id: 'lookalike',
    label: '👯 Looks the Same',
    color: 'bg-violet-500',
    items: (
      <div className="space-y-4">
        <Accordion title="Snowpipe vs Bulk COPY — ON_ERROR default & metadata retention">
          <CompareTable
            headers={['Context', 'ON_ERROR Default', 'Metadata Retention']}
            rows={[
              ['Bulk COPY INTO', 'ABORT_STATEMENT', '64 days'],
              ['Snowpipe', 'SKIP_FILE', '14 days'],
            ]}
          />
          <p className="text-xs text-amber-700 mt-2 font-semibold">🎯 The exam will NOT tell you which context. Read carefully.</p>
        </Accordion>

        <Accordion title="Time Travel by Edition & Table Type">
          <CompareTable
            headers={['Edition', 'Permanent Table Max', 'Transient / Temporary Max']}
            rows={[
              ['Standard', '1 day', '1 day'],
              ['Enterprise+', '90 days', '1 day ← always capped'],
            ]}
          />
          <p className="text-xs text-amber-700 mt-2 font-semibold">🎯 Transient tables ALWAYS max at 1 day, regardless of edition.</p>
        </Accordion>

        <Accordion title="CURRENT_ROLE() vs IS_ROLE_IN_SESSION()">
          <CompareTable
            headers={['Function', 'What it checks']}
            rows={[
              ['CURRENT_ROLE()', 'Primary role ONLY'],
              ['IS_ROLE_IN_SESSION()', 'Primary + secondary + inherited roles'],
            ]}
          />
          <p className="text-xs text-amber-700 mt-2 font-semibold">🎯 Masking policy uses CURRENT_ROLE(). User has primary=ANALYST, secondary=FINANCE. Policy allows FINANCE. User sees MASKED data (CURRENT_ROLE returns ANALYST).</p>
        </Accordion>

        <Accordion title="ACCOUNT_USAGE vs INFORMATION_SCHEMA">
          <CompareTable
            headers={['Property', 'ACCOUNT_USAGE', 'INFORMATION_SCHEMA']}
            rows={[
              ['Latency', '45 min – 3 hours', 'Near real-time (seconds)'],
              ['Retention', 'Up to 365 days', '7–14 days'],
              ['Scope', 'Entire account', 'Current database only'],
              ['Location', 'SNOWFLAKE database', 'Each database'],
            ]}
          />
        </Accordion>

        <Accordion title="SYSTEM$ALLOWLIST() vs SYSTEM$GET_PRIVATELINK_CONFIG()">
          <CompareTable
            headers={['Function', 'Returns']}
            rows={[
              ['SYSTEM$ALLOWLIST()', 'Public hostnames/ports for firewall rules'],
              ['SYSTEM$GET_PRIVATELINK_CONFIG()', 'Private endpoint URLs for PrivateLink setup'],
            ]}
          />
          <p className="text-xs text-amber-700 mt-2 font-semibold">🎯 "Display endpoints for PrivateLink?" = GET_PRIVATELINK_CONFIG. "Firewall rules?" = ALLOWLIST.</p>
        </Accordion>

        <Accordion title="PARSE_JSON() vs TO_JSON()">
          <CompareTable
            headers={['Function', 'Direction']}
            rows={[
              ['PARSE_JSON(string)', 'String → VARIANT'],
              ['TO_JSON(variant)', 'VARIANT → String'],
            ]}
          />
          <p className="text-xs text-slate-600 mt-1">They are inverses: <code className="bg-slate-100 px-1 rounded">{'TO_JSON(PARSE_JSON(\'{"a":1}\'))'}</code> = <code className="bg-slate-100 px-1 rounded">{'\'{"a":1}\''}</code></p>
        </Accordion>

        <Accordion title="OBJECT_CONSTRUCT vs OBJECT_AGG vs ARRAYS_TO_OBJECT">
          <CompareTable
            headers={['Function', 'Input', 'Scope']}
            rows={[
              ["OBJECT_CONSTRUCT('k1',v1,'k2',v2)", 'Explicit key-value pairs', 'Single row'],
              ['OBJECT_CONSTRUCT(*)', 'All columns in current row', 'Single row'],
              ['OBJECT_AGG(key_col, val_col)', 'Column values', 'Across rows (aggregate)'],
              ['ARRAYS_TO_OBJECT(keys_arr, vals_arr)', 'Two parallel arrays', 'Single expression'],
            ]}
          />
        </Accordion>

        <Accordion title="ARRAY_AGG() vs ARRAY_CONSTRUCT()">
          <CompareTable
            headers={['Function', 'Scope']}
            rows={[
              ['ARRAY_AGG(col)', 'Collects values from MULTIPLE ROWS into array'],
              ['ARRAY_CONSTRUCT(1,2,3)', 'Builds array from EXPLICIT ARGUMENTS (single row)'],
            ]}
          />
        </Accordion>

        <Accordion title="STRIP_OUTER_ARRAY vs FIELD_OPTIONALLY_ENCLOSED_BY">
          <CompareTable
            headers={['Option', 'Format', 'Purpose']}
            rows={[
              ['STRIP_OUTER_ARRAY', 'JSON', 'Remove outer [ ] so each element = one row'],
              ['FIELD_OPTIONALLY_ENCLOSED_BY', 'CSV', 'Character wrapping field values (e.g. double-quotes)'],
            ]}
          />
          <p className="text-xs text-amber-700 mt-2 font-semibold">🎯 "Load JSON array elements as separate rows?" = STRIP_OUTER_ARRAY.</p>
        </Accordion>

        <Accordion title="Scale UP vs Scale OUT">
          <CompareTable
            headers={['Strategy', 'When to use']}
            rows={[
              ['Scale UP (bigger T-shirt size)', 'Single complex query is slow — needs more memory/CPU per query'],
              ['Scale OUT (multi-cluster)', 'Many concurrent users are queuing — need more slots'],
            ]}
          />
          <p className="text-xs text-amber-700 mt-2 font-semibold">🎯 "200 BI users, short queries, queuing" = scale OUT (not UP).</p>
        </Accordion>
      </div>
    ),
  },
  {
    id: 'policies',
    label: '🔒 Policy Gotchas',
    color: 'bg-violet-600',
    items: (
      <div className="space-y-3">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm font-extrabold text-red-700 mb-1">⚠️ NO role bypasses Row Access or Masking policies — including ACCOUNTADMIN</p>
        </div>
        <Accordion title="Row Access Policies — The ACCOUNTADMIN Trap">
          <div className="space-y-2 text-xs text-slate-700">
            <p>• NO role bypasses them, including ACCOUNTADMIN</p>
            <p>• A CASE with no ELSE clause returns NULL → treated as FALSE → zero rows returned</p>
            <p className="font-semibold text-red-700">• If the policy does not explicitly mention ADMIN, ADMIN sees ZERO rows</p>
          </div>
        </Accordion>
        <Accordion title="Masking Policies — CURRENT_ROLE Trap">
          <div className="space-y-2 text-xs text-slate-700">
            <p>• NO role bypasses them, including ACCOUNTADMIN</p>
            <p>• CURRENT_ROLE() only checks the <strong>primary</strong> role (trap with secondary roles — use IS_ROLE_IN_SESSION() instead)</p>
            <p>• Tags alone are <strong>metadata labels only</strong>. You must attach a policy TO the tag to enforce masking.</p>
          </div>
        </Accordion>
        <Accordion title="Network Policies — Precedence Rules">
          <div className="space-y-2 text-xs text-slate-700">
            <p>• User-level network policy <strong>OVERRIDES</strong> account-level (does not merge with it)</p>
            <p>• BLOCKED_IP_LIST takes precedence over ALLOWED_IP_LIST</p>
            <p className="font-semibold text-red-700">• Same IP in both lists = BLOCKED</p>
          </div>
        </Accordion>
      </div>
    ),
  },
  {
    id: 'cloning',
    label: '🧬 Cloning',
    color: 'bg-teal-600',
    items: (
      <div className="space-y-3">
        <Accordion title="What CAN vs CANNOT be cloned">
          <CompareTable
            headers={['Can Clone', 'Cannot Clone']}
            rows={[
              ['Databases (full hierarchy)', 'Internal stages (error: "Unsupported feature")'],
              ['Schemas', 'External tables (excluded from DB clones too)'],
              ['Tables (permanent, transient, temp)', 'Dynamic tables, Pipes, Shares, Warehouses'],
              ['External stages', ''],
            ]}
          />
        </Accordion>
        <TrapItem
          title="Transient Clone — Explicit Keyword Required"
          trap="CREATE TABLE target CLONE transient_source works normally."
          truth="You must use CREATE TRANSIENT TABLE target CLONE source. The TRANSIENT keyword is required explicitly."
          examAngle="Missing TRANSIENT → permanent table is created with full Fail-safe overhead."
        />
        <TrapItem
          title="Concurrent DML During Clone"
          trap="An INSERT running in parallel gets included in the clone."
          truth="Clone captures snapshot at statement START. Concurrent INSERTs that commit AFTER the clone starts are NOT reflected."
          examAngle="Clone timestamp is the CLONE statement's execution moment, not completion."
        />
        <TrapItem
          title="COPY GRANTS on Clones"
          trap="Cloned tables automatically inherit all privileges from the source."
          truth="By default, clones have NO grants from the source. Add COPY GRANTS to preserve them: CREATE TABLE t CLONE s COPY GRANTS."
          examAngle='"Role REPORTING has SELECT on source. After clone, does REPORTING have SELECT on clone?" NO — unless COPY GRANTS is used.'
        />
      </div>
    ),
  },
  {
    id: 'streams',
    label: '🌊 Streams & Tasks',
    color: 'bg-teal-700',
    items: (
      <div className="space-y-3">
        <TrapItem
          title="Stale Streams — Cannot be Reset"
          trap="A stale stream can be refreshed with ALTER STREAM ... REFRESH."
          truth="Stale streams CANNOT be refreshed or reset. Must DROP and RECREATE — losing all un-consumed change records."
          examAngle="Prevention: consume streams regularly OR set MAX_DATA_EXTENSION_TIME_IN_DAYS = 14 (default) on the source table."
        />
        <TrapItem
          title="Task WHEN Clause — Zero Compute on Skip"
          trap="A task with WHEN SYSTEM$STREAM_HAS_DATA() = FALSE still charges a small overhead."
          truth="When the WHEN clause is FALSE, the task is SKIPPED ENTIRELY — zero compute consumed, no warehouse starts."
          examAngle="Standard pattern: WHEN SYSTEM$STREAM_HAS_DATA('stream_name') to convert polling to near-event-driven."
        />
        <Accordion title="Task DAG Rules">
          <div className="space-y-2 text-xs text-slate-700">
            <p>• Only the <strong>root task</strong> has a SCHEDULE</p>
            <p>• Child tasks have NO schedule — triggered by predecessor completion</p>
            <p>• ALLOW_OVERLAPPING_EXECUTION = FALSE (default): skips the next run if the current is still running</p>
            <p>• All tasks in a DAG must be RESUMED before the root is resumed</p>
          </div>
        </Accordion>
      </div>
    ),
  },
  {
    id: 'loading',
    label: '📦 Data Loading',
    color: 'bg-amber-600',
    items: (
      <div className="space-y-3">
        <TrapItem
          title="VALIDATION_MODE = Dry Run Only"
          trap="VALIDATION_MODE loads data and also logs errors."
          truth="NO data is loaded. VALIDATION_MODE only validates and returns errors. Zero rows inserted."
          examAngle='"Data is loaded and errors are logged" = WRONG.'
        />
        <TrapItem
          title="FORCE = TRUE = Duplicate Risk"
          trap="FORCE = TRUE just forces the file through — safe to use anytime."
          truth="FORCE bypasses the 64-day deduplication. Loading the same file again = DUPLICATE ROWS in the table."
          examAngle='"Which COPY option risks introducing duplicates?" = FORCE = TRUE.'
        />
        <Accordion title="PUT Command Limitations">
          <div className="space-y-1 text-xs text-slate-700">
            <p>• Works on <strong>internal stages ONLY</strong> (not external stages)</p>
            <p>• Requires a local filesystem client: SnowSQL, JDBC, ODBC, Python connector</p>
            <p className="font-semibold text-red-700">• Does NOT work from Snowsight worksheets</p>
            <p>• Auto-compresses files with gzip by default (AUTO_COMPRESS = TRUE)</p>
          </div>
        </Accordion>
        <Accordion title="External Tables Fine Print">
          <div className="space-y-1 text-xs text-slate-700">
            <p>• Read-only: SELECT only. No INSERT, UPDATE, DELETE, MERGE</p>
            <p>• Cannot be cloned (not directly, not via DB clone)</p>
            <p>• CAN have Materialized Views on top (still read-only, improves query speed)</p>
            <p>• Must run ALTER TABLE ... REFRESH to pick up new files in the stage</p>
          </div>
        </Accordion>
        <Accordion title="METADATA$ Pseudo-Columns in COPY INTO">
          <CompareTable
            headers={['Column', 'What it provides']}
            rows={[
              ['METADATA$FILENAME', 'Source filename for each loaded row'],
              ['METADATA$FILE_ROW_NUMBER', 'Row number within the source file'],
            ]}
          />
          <p className="text-xs text-slate-500 mt-1">Available in the COPY INTO (SELECT ... FROM @stage) subquery only.</p>
        </Accordion>
        <Accordion title="COPY INTO SELECT — Transformations">
          <div className="space-y-1 text-xs text-slate-700">
            <p>• Can apply functions: UPPER($1), CAST, CONCAT, IFF, etc.</p>
            <p>• Can reorder columns: <code className="bg-slate-100 px-1 rounded">SELECT $3, $1, $2 FROM @stage</code></p>
            <p className="font-semibold">Easy to forget this exists — the exam loves it for column mapping questions.</p>
          </div>
        </Accordion>
      </div>
    ),
  },
  {
    id: 'sharing',
    label: '🤝 Sharing',
    color: 'bg-rose-600',
    items: (
      <div className="space-y-3">
        <TrapItem
          title="Direct Shares = Same Region Only"
          trap="Direct shares work across any Snowflake accounts."
          truth="Direct shares require both accounts in the same cloud provider AND region. Cross-region needs Listings or Database Replication."
          examAngle='"Provider on AWS us-east-1, consumer on Azure East US. Direct share?" NO — need DB replication first.'
        />
        <TrapItem
          title="Standard Views Cannot Be Shared"
          trap="Any view can be added to a share."
          truth="Only SECURE views and SECURE UDFs can be added to shares. Standard views fail with an error."
          examAngle='"A developer adds a VIEW to a share. What happens?" Error — must be SECURE VIEW.'
        />
        <TrapItem
          title="Revoking a Share — Empty, Not Dropped"
          trap="When a share is revoked, the consumer's database is automatically dropped."
          truth="Consumer database becomes EMPTY (shell remains, all objects inaccessible). No grace period, no local copy retained. The database itself is NOT dropped."
          examAngle='"Provider revokes share. Consumer queries the database. What happens?" Error — objects inaccessible, not dropped.'
        />
        <Accordion title="Direct Share vs Listing vs DB Replication">
          <CompareTable
            headers={['Feature', 'Direct Share', 'Listing', 'DB Replication']}
            rows={[
              ['Cross-region', 'No', 'Yes', 'Yes'],
              ['Monetization', 'No', 'Yes', 'No'],
              ['Extra storage cost', 'No (zero-copy)', 'Depends', 'Yes (full copy)'],
              ['Failover capable', 'No', 'No', 'Yes'],
            ]}
          />
        </Accordion>
      </div>
    ),
  },
  {
    id: 'resmon',
    label: '💰 Resource Monitors',
    color: 'bg-amber-700',
    items: (
      <div className="space-y-3">
        <TrapItem
          title="Only ACCOUNTADMIN Can Create Resource Monitors"
          trap="SYSADMIN can create and manage resource monitors."
          truth="ONLY ACCOUNTADMIN can CREATE resource monitors. This privilege cannot be delegated."
          examAngle='"Which role creates resource monitors?" ACCOUNTADMIN only.'
        />
        <TrapItem
          title="Resource Monitors Don't Track Serverless Costs"
          trap="Resource monitors track all Snowflake compute charges."
          truth="Resource monitors ONLY track USER-MANAGED warehouse credits. Serverless features (Snowpipe, Automatic Clustering, Materialized Views, Search Optimization, Tasks in serverless mode) are NOT tracked. Use BUDGETS for serverless cost control."
          examAngle='"A Snowpipe load causes unexpected spend. Will the resource monitor catch it?" NO.'
        />
        <TrapItem
          title="ALTER RESOURCE MONITOR TRIGGERS — Replaces, Not Adds"
          trap="ALTER RESOURCE MONITOR adds new triggers to existing ones."
          truth="ALTER with TRIGGERS clause REPLACES ALL existing triggers (not additive). Omit TRIGGERS to preserve existing ones."
          examAngle='"After ALTER, only the new trigger fires." Correct — old triggers were replaced.'
        />
        <Accordion title="Resource Monitor Privilege Reference">
          <CompareTable
            headers={['Privilege', 'What it allows']}
            rows={[
              ['MONITOR', 'View credit usage and trigger history'],
              ['MODIFY', 'Change quota, triggers, and other properties'],
              ['(CREATE)', 'ACCOUNTADMIN only — cannot be granted away'],
            ]}
          />
        </Accordion>
      </div>
    ),
  },
  {
    id: 'performance',
    label: '⚡ Performance',
    color: 'bg-amber-500',
    items: (
      <div className="space-y-3">
        <Accordion title="Three Caching Layers — Quick Reference">
          <CompareTable
            headers={['Cache', 'Layer', 'TTL / When Cleared', 'Cost']}
            rows={[
              ['Result cache', 'Cloud Services', '24 hr; reset on reuse; invalidated by any DML', 'Free — no warehouse'],
              ['Metadata cache', 'Cloud Services', 'Persistent; always available', 'Free — no warehouse'],
              ['Warehouse SSD cache', 'Compute nodes', 'Cleared on SUSPEND or RESIZE', 'Warehouse must be running'],
            ]}
          />
        </Accordion>
        <TrapItem
          title="Result Cache — Role-Specific When Policies Exist"
          trap="The result cache is shared by all users regardless of policies."
          truth="When row access or masking policies are active, result cache entries are role-specific — different roles may get different cached results."
          examAngle='"Two users with different roles run identical SQL. Both get result-cached?" Only if their policies produce the same result.'
        />
        <Accordion title="Clustering Key Best Practices">
          <div className="space-y-1 text-xs text-slate-700">
            <p>✓ Best candidates: DATE, TIMESTAMP, low-to-medium cardinality columns in WHERE / JOIN</p>
            <p>✓ Order matters: put LOWER cardinality column FIRST in multi-column keys</p>
            <p>✗ Avoid: unique-per-row (UUIDs, sequences) or VARIANT columns</p>
            <p>✗ Avoid: monotonically increasing columns (already naturally ordered by insertion)</p>
            <p className="text-amber-700 font-semibold">🎯 Search Optimization is better for high-cardinality equality / IN-list lookups, not range scans.</p>
          </div>
        </Accordion>
        <Accordion title="Spilling — Severity Levels">
          <CompareTable
            headers={['Spill Type', 'Severity', 'Fix']}
            rows={[
              ['Local SSD spill', 'Moderate — consider resizing', 'Scale UP warehouse (more RAM)'],
              ['Remote storage spill', 'Severe — definitely resize', 'Scale UP + rewrite query to reduce intermediate data'],
            ]}
          />
        </Accordion>
      </div>
    ),
  },
  {
    id: 'security',
    label: '🔐 Security',
    color: 'bg-slate-700',
    items: (
      <div className="space-y-3">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700">
          <p className="font-bold mb-1">All Editions — Always On</p>
          <p>AES-256 at rest · TLS 1.2+ in transit · Key rotation available</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700">
          <p className="font-bold mb-1">Business Critical+ Exclusive</p>
          <p>Tri-Secret Secure (customer KMS key) · PrivateLink (no public internet) · HIPAA/PHI compliance</p>
        </div>
        <Accordion title="Authentication Methods — When to Use Each">
          <CompareTable
            headers={['Method', 'Use Case']}
            rows={[
              ['Username / password', 'Interactive login (basic)'],
              ['MFA (Duo)', 'Interactive login with extra security'],
              ['SAML 2.0 SSO', 'Browser-based federated login (Okta, Azure AD)'],
              ['Key-pair (RSA)', 'Programmatic: connectors, Kafka, SnowSQL, CI/CD pipelines'],
              ['OAuth 2.0', 'Programmatic: custom apps, SQL API, third-party tools'],
              ['SCIM', 'Automated user/group provisioning from IdP'],
            ]}
          />
        </Accordion>
        <TrapItem
          title="Key-pair Auth — Which Key Goes to Snowflake?"
          trap="Both the public and private key are registered with Snowflake."
          truth="ONLY the PUBLIC key is registered: ALTER USER svc SET RSA_PUBLIC_KEY = '...'. The private key NEVER leaves the client machine."
          examAngle='"What is stored in Snowflake for key-pair auth?" Only the RSA public key.'
        />
      </div>
    ),
  },
  {
    id: 'obscure',
    label: '🔬 Obscure & Advanced',
    color: 'bg-indigo-600',
    subtitle: 'Super-advanced · low-frequency · high-impact',
    items: (
      <div className="space-y-3">
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-xs text-indigo-900">
          <p className="font-bold mb-1">⚡ Why this section exists</p>
          <p className="leading-relaxed">
            These are the deep-cut traps that appear on maybe 1 exam in 3 — but when they
            show up, well-prepared candidates still miss them because they contradict a
            "common sense" assumption. Memorize each one as a single-sentence rule.
          </p>
        </div>

        <TrapItem
          title="Cloud Services Billing — 10% Free Threshold"
          trap="Cloud Services (metadata, auth, result cache) is always free or always billed."
          truth="Cloud Services is free up to 10% of that day's warehouse credit consumption; only the portion ABOVE 10% is billed."
          examAngle='"Customer sees unexpected CS charges — why?" Their warehouse credits dropped (e.g. heavy SUSPEND), so CS usage crossed 10%.'
        >
          <CodeSnip>{`-- Check CS vs warehouse credits
SELECT
  DATE_TRUNC('day', start_time) AS day,
  SUM(credits_used_compute)         AS wh_credits,
  SUM(credits_used_cloud_services)  AS cs_credits,
  SUM(credits_used_cloud_services)
    / NULLIF(SUM(credits_used_compute), 0) AS cs_ratio
FROM snowflake.account_usage.warehouse_metering_history
GROUP BY 1 ORDER BY 1 DESC;`}</CodeSnip>
        </TrapItem>

        <TrapItem
          title="MAX_DATA_EXTENSION_TIME_IN_DAYS — The Stream Lifeline"
          trap="A stream stays active as long as the base table still has Time Travel."
          truth="A stream becomes STALE after DATA_RETENTION_TIME_IN_DAYS + MAX_DATA_EXTENSION_TIME_IN_DAYS with no consumption. Default MAX_DATA_EXTENSION is 14 days."
          examAngle='"Retention = 1 day, extension = 14 days, no reader for 16 days — stream state?" STALE. Must DROP and recreate.'
        />

        <TrapItem
          title="STATEMENT_TIMEOUT_IN_SECONDS — Lowest Wins"
          trap="Warehouse-level timeout always wins."
          truth="When multiple levels are set (account, warehouse, user, session), the LOWEST non-zero value applies to the query."
          examAngle='"Account=3600, warehouse=1800, session=600. A query runs 1000s — what happens?" Cancelled at 600s (session wins).'
        />

        <TrapItem
          title="EXECUTE AS OWNER + Masking Policy — Whose Role Counts?"
          trap="The caller's role drives masking inside a procedure."
          truth="Inside EXECUTE AS OWNER, CURRENT_ROLE() returns the OWNER role — so the masking policy evaluates against the owner, not the caller. This can expose data or mask it unexpectedly."
          examAngle='"Procedure owner = DATA_ENG, caller = ANALYST, policy allows ANALYST — caller sees?" MASKED (policy sees DATA_ENG).'
        >
          <CodeSnip>{`-- Policy evaluates CURRENT_ROLE() at read time.
-- In EXECUTE AS OWNER, CURRENT_ROLE() = owner, not caller.
-- Fix: use IS_ROLE_IN_SESSION(...) or EXECUTE AS CALLER.
CREATE MASKING POLICY ssn_mask AS (val STRING) RETURNS STRING ->
  CASE
    WHEN IS_ROLE_IN_SESSION('HR') THEN val
    ELSE '***-**-****'
  END;`}</CodeSnip>
        </TrapItem>

        <TrapItem
          title="IMPORTED PRIVILEGES on SNOWFLAKE Database"
          trap="ACCOUNT_USAGE views are automatically visible to custom roles."
          truth="Non-ACCOUNTADMIN roles need GRANT IMPORTED PRIVILEGES ON DATABASE SNOWFLAKE TO ROLE <role> before they can query SNOWFLAKE.ACCOUNT_USAGE views. Database roles (OBJECT_VIEWER, USAGE_VIEWER, GOVERNANCE_VIEWER, SECURITY_VIEWER) are the scoped alternative."
          examAngle='"Custom role gets Object does not exist on SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY — fix?" Grant IMPORTED PRIVILEGES on SNOWFLAKE DB.'
        />

        <TrapItem
          title="COMMIT Inside a Procedure in an Outer Transaction"
          trap="A stored procedure can always run its own BEGIN / COMMIT."
          truth="If the CALLER has already opened a transaction, the procedure cannot issue its own COMMIT. It will raise an error, or its statements are scoped to the outer transaction."
          examAngle='"Procedure with COMMIT fails when called from a script that opened BEGIN — why?" Nested COMMIT is disallowed in outer-txn context.'
        />

        <TrapItem
          title="UNDROP After DROP + CREATE with Same Name"
          trap="UNDROP always restores the most recent dropped object with that name."
          truth="UNDROP restores to the ORIGINAL object name. If a NEW object of the same name was created after the DROP, UNDROP fails until you drop or rename the new one."
          examAngle='"DROP TABLE t1; CREATE TABLE t1 (...); UNDROP TABLE t1; — result?" Error: object already exists. Not a silent overwrite.'
        />

        <TrapItem
          title="Transient Clone — Fail-safe is Gone Forever"
          trap="Cloning a permanent table creates a permanent clone by default."
          truth="CREATE TRANSIENT TABLE copy CLONE perm_tbl; creates a TRANSIENT clone with 0 days Fail-safe — and you cannot convert it back to a permanent table later. Any Fail-safe protection for that data is lost."
          examAngle='"Why is Fail-safe storage cost 0 for this clone?" It was created as TRANSIENT — Fail-safe is always 0 days for transient.'
        />

        <TrapItem
          title="Resource Monitors Do NOT Track Serverless Credits"
          trap="An account-level resource monitor caps ALL Snowflake credits."
          truth="Resource monitors only track USER-managed warehouse credits. Auto-clustering, Snowpipe, Materialized Views, Search Optimization, Replication, and Serverless Tasks are NOT gated by resource monitors. Use BUDGETS for serverless features."
          examAngle='"Account monitor set to 100 credits/day, but 300 credits of auto-clustering ran — bug?" No. Serverless is outside monitors. Use BUDGETS.'
        />

        <TrapItem
          title="Snowpark-Optimized Warehouse — Min Size is Medium"
          trap="You can create a Snowpark-optimized X-Small for cheap ML testing."
          truth="Snowpark-optimized warehouses require MINIMUM size Medium, cost roughly 1.5× a standard warehouse of the same size, and provide ~16× the memory per node — they do NOT provide 16× the compute."
          examAngle='"Smallest Snowpark-optimized warehouse available?" Medium. X-Small and Small are not permitted.'
        />

        <TrapItem
          title="Dynamic Tables — What Can (and Can't) Be a Source"
          trap="A Dynamic Table can be built on top of anything you can query."
          truth="Valid sources: base tables, views, streams, and OTHER Dynamic Tables. NOT valid: external tables, shared tables, tables with row access policies that prevent full scans, materialized views."
          examAngle='"Create DT on top of external S3 table — allowed?" No. External tables are not a supported DT source.'
        />

        <TrapItem
          title="Cortex Analyst — Needs a Semantic Model (YAML)"
          trap="Cortex Analyst works out-of-the-box against any schema."
          truth="Cortex Analyst requires a SEMANTIC MODEL file (YAML) that defines verified dimensions, measures, synonyms, and sample queries. Without it, NL-to-SQL accuracy drops sharply. This is how you 'teach' Cortex your business terms."
          examAngle='"Which Cortex feature requires a YAML semantic model?" Cortex Analyst.'
        />

        <TrapItem
          title="Query Acceleration Service (QAS) — Edition + Scale Factor"
          trap="QAS automatically accelerates any slow query on any edition."
          truth="QAS requires Enterprise edition or higher, is explicitly ENABLED per warehouse (QUERY_ACCELERATION_MAX_SCALE_FACTOR), and only helps queries dominated by LARGE SCANS with filter/aggregation on OUTLIERS. Does NOT help joins, small scans, or result-cache hits."
          examAngle='"Why did QAS not accelerate my JOIN-heavy query?" QAS targets scan-heavy outlier queries only — joins are out of scope.'
        />

        <TrapItem
          title="Bulk COPY vs Snowpipe — ON_ERROR Defaults Differ"
          trap="ON_ERROR default is the same regardless of load path."
          truth="Bulk COPY default is ABORT_STATEMENT (fail fast); Snowpipe default is SKIP_FILE (keep ingesting). Same file format, same COPY options — different defaults based on context."
          examAngle='"A COPY statement with one bad row failed; identical file via Snowpipe succeeded — why?" Different default ON_ERROR.'
        />

        <TrapItem
          title="Reader Account — Not Read-Only"
          trap='"Reader" means the account can only read shared data.'
          truth="Reader Accounts CAN create warehouses, databases, tables, views, and UDFs — and the provider pays for all compute. They CANNOT create shares, pipes, stages, or run certain metadata SHOW commands."
          examAngle='"Can a Reader Account join shared data with local staging tables it created?" YES.'
        />

        <TrapItem
          title="Apache Iceberg — External Catalog Writes Blocked"
          trap="All Iceberg tables behave the same in Snowflake."
          truth="Iceberg tables with a SNOWFLAKE-managed catalog are read/write. Iceberg tables with an EXTERNAL catalog (Glue, Nessie) are READ-ONLY from Snowflake — writes must go through the engine that owns the catalog."
          examAngle='"Insert into external-catalog Iceberg table from Snowflake — result?" Error: read-only in this mode.'
        />

        <TrapItem
          title="Secure Shares — What Is (and Isn't) Shareable"
          trap="You can add any view or UDF to a share."
          truth="Only SECURE views and SECURE UDFs can be added to a share. Standard (non-secure) views are REJECTED with an error. External tables, stages, tasks, streams, and pipes cannot be shared."
          examAngle='"Add view v1 to share — error about secure — fix?" CREATE OR REPLACE SECURE VIEW v1 AS ...'
        />

        <TrapItem
          title="Masking / Row-Access Policies — ACCOUNTADMIN Is NOT Exempt"
          trap="ACCOUNTADMIN can see everything, including masked values."
          truth="NO role bypasses a masking or row access policy. If the policy does not explicitly allow ACCOUNTADMIN, it sees masked values and/or zero rows — just like every other role."
          examAngle='"ACCOUNTADMIN queries masked SSN column — sees?" Masked ***-**-****.'
        />
      </div>
    ),
  },
];

const PATTERN_SECTIONS = [
  {
    id: 'p1',
    label: 'P1 · Privilege Confusion',
    subtitle: '18 questions · ~60% miss rate',
    color: 'bg-red-500',
    items: (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm font-bold text-red-700">The Full Access Chain for SELECT</p>
          <p className="text-xs text-slate-700 mt-1">To query <code className="bg-slate-100 px-1 rounded">DB.SCHEMA.TABLE</code>, a role needs ALL THREE:</p>
          <ol className="list-decimal list-inside text-xs text-slate-700 mt-1 space-y-0.5">
            <li>USAGE on the <strong>database</strong></li>
            <li>USAGE on the <strong>schema</strong></li>
            <li>SELECT on the <strong>table</strong></li>
          </ol>
          <p className="text-xs text-red-700 font-semibold mt-2">Missing ANY one = access denied. The exam asks "which TWO are needed" to make you forget the database USAGE.</p>
        </div>

        <Accordion title="Warehouse Privileges">
          <CompareTable
            headers={['Privilege', 'What it grants']}
            rows={[
              ['USAGE', 'Run queries using the warehouse'],
              ['OPERATE', 'Resume, suspend, abort ALL running queries'],
              ['MODIFY', 'Resize, change properties (auto-suspend, auto-resume, etc.)'],
              ['MONITOR', 'View warehouse load and query stats'],
              ['OWNERSHIP', 'All of the above + DROP'],
            ]}
          />
          <p className="text-xs text-amber-700 mt-2 font-semibold">🎯 "A role needs to suspend a warehouse but not run queries." = OPERATE (not USAGE).</p>
        </Accordion>

        <Accordion title="Database & Schema Privileges">
          <CompareTable
            headers={['Level', 'Privilege', 'What it grants']}
            rows={[
              ['Database', 'USAGE', 'See the database + browse schemas (NOT query tables)'],
              ['Database', 'CREATE SCHEMA', 'Create new schemas'],
              ['Schema', 'USAGE', 'See the schema + browse objects (NOT query them)'],
              ['Schema', 'CREATE TABLE', 'Create tables within the schema'],
              ['Table', 'SELECT', 'Read rows from the table'],
            ]}
          />
        </Accordion>

        <Accordion title="Task & Resource Monitor Privileges">
          <CompareTable
            headers={['Object', 'Privilege', 'What it grants']}
            rows={[
              ['Task', 'OPERATE', 'Resume, suspend, EXECUTE TASK'],
              ['Task', 'OWNERSHIP', 'All + DROP'],
              ['Resource Monitor', 'MONITOR', 'View credit usage'],
              ['Resource Monitor', 'MODIFY', 'Change quota and triggers'],
              ['Resource Monitor', '(CREATE)', 'ACCOUNTADMIN only — cannot be delegated'],
            ]}
          />
        </Accordion>
      </div>
    ),
  },
  {
    id: 'p2',
    label: 'P2 · Owner vs Caller Privileges',
    subtitle: '12 questions · ~55% miss rate',
    color: 'bg-violet-600',
    items: (
      <div className="space-y-4">
        <CodeSnip>{`Query: SELECT * FROM my_table
  |
  +-- Row Access Policy? ──> Evaluated with QUERYING ROLE's context
  |                           (CURRENT_ROLE() or IS_ROLE_IN_SESSION())
  |
  +-- Masking Policy? ────> Evaluated with QUERYING ROLE's context
  |                           NOT the view/procedure owner
  |
  +-- Through a View? ────> View body runs with VIEW OWNER's privileges
  |                          (caller doesn't need SELECT on base table)
  |
  +-- Stored Procedure (EXECUTE AS OWNER, default):
  |     Procedure SQL runs with OWNER's privileges
  |     BUT masking/row access still evaluate against OWNER role
  |
  +-- Stored Procedure (EXECUTE AS CALLER):
        Procedure SQL runs with CALLER's privileges
        Masking/row access evaluate against CALLER role`}</CodeSnip>

        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4">
          <p className="text-sm font-bold text-amber-800">☠️ Killer Exam Scenario</p>
          <p className="text-xs text-slate-700 mt-2">A stored procedure (<strong>EXECUTE AS OWNER</strong>) queries a table with a masking policy. The policy allows role ANALYST. Procedure owner = DATA_ENG. Caller = ANALYST.</p>
          <p className="text-xs font-bold text-red-700 mt-2">What does the caller see? → MASKED data.</p>
          <p className="text-xs text-slate-600 mt-1">Why? Procedure runs as DATA_ENG. Masking policy evaluates CURRENT_ROLE() = DATA_ENG. DATA_ENG is not in the allow list. The fact that the CALLER is ANALYST is irrelevant under EXECUTE AS OWNER.</p>
        </div>
      </div>
    ),
  },
  {
    id: 'p3',
    label: 'P3 · Exact Numbers',
    subtitle: '15 questions · ~50% miss rate',
    color: 'bg-amber-600',
    items: (
      <div className="space-y-4">
        <Accordion title="Warehouse Credits per Hour">
          <CompareTable
            headers={['Size', 'Credits/Hour', 'Size', 'Credits/Hour']}
            rows={[
              ['X-Small', '1', 'X-Large', '16'],
              ['Small', '2', '2X-Large', '32'],
              ['Medium', '4', '3X-Large', '64'],
              ['Large', '8', '4X-Large', '128'],
              ['', '', 'Minimum billing', '60 seconds per resume'],
            ]}
          />
        </Accordion>

        <Accordion title="Retention & Latency Numbers — Memorize These Cold">
          <CompareTable
            headers={['What', 'Duration']}
            rows={[
              ['Bulk COPY metadata (dedup window)', '64 days'],
              ['Snowpipe metadata (dedup window)', '14 days'],
              ['Result cache TTL', '24 hours (resets on each reuse)'],
              ['Standard edition Time Travel (permanent)', '0–1 day'],
              ['Enterprise edition Time Travel (permanent)', '0–90 days'],
              ['Transient / Temporary Time Travel (all editions)', '0–1 day ← always'],
              ['Fail-safe (permanent tables)', '7 days (Support-only)'],
              ['Fail-safe (transient / temporary)', '0 days'],
              ['ACCOUNT_USAGE latency', '45 min – 3 hours'],
              ['ACCOUNT_USAGE retention', '365 days'],
              ['INFORMATION_SCHEMA retention', '7–14 days'],
              ['MAX_DATA_EXTENSION_TIME_IN_DAYS default', '14 days (keeps streams alive)'],
            ]}
          />
        </Accordion>

        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 space-y-2 text-xs">
          <p className="font-bold text-amber-800">☠️ Dedup Window Tricks</p>
          <p className="text-slate-700">• "File loaded 50 days ago, COPY without FORCE. Loaded or skipped?" → <strong>SKIPPED</strong> (50 &lt; 64)</p>
          <p className="text-slate-700">• "Snowpipe file from 10 days ago re-arrives. Loaded or skipped?" → <strong>SKIPPED</strong> (10 &lt; 14)</p>
          <p className="text-slate-700">• "Bulk COPY file from 70 days ago, no FORCE." → <strong>LOADED</strong> (70 &gt; 64, metadata expired)</p>
          <p className="text-red-700 font-semibold">The exam NEVER tells you the retention period. You must know 64 vs 14.</p>
        </div>
      </div>
    ),
  },
  {
    id: 'p4',
    label: 'P4 · Shared Objects Rules',
    subtitle: '14 questions · ~55% miss rate',
    color: 'bg-rose-600',
    items: (
      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <p className="text-xs font-bold text-emerald-700 mb-2">Consumer CAN</p>
            <ul className="text-xs text-slate-700 space-y-1">
              <li>✓ CREATE DATABASE FROM SHARE</li>
              <li>✓ SELECT from shared objects</li>
              <li>✓ See schema changes automatically (new cols, new tables)</li>
            </ul>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-xs font-bold text-red-700 mb-2">Consumer CANNOT</p>
            <ul className="text-xs text-slate-700 space-y-1">
              <li>✗ INSERT, UPDATE, DELETE, MERGE on shared objects</li>
              <li>✗ CLONE shared objects (no OWNERSHIP)</li>
              <li>✗ Create any objects inside the shared DB</li>
            </ul>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <p className="text-xs font-bold text-emerald-700 mb-2">Reader Account CAN</p>
            <ul className="text-xs text-slate-700 space-y-1">
              <li>✓ Create warehouses, databases, tables, views</li>
              <li>✓ Run queries (provider pays compute)</li>
              <li>✓ Join shared data with their own tables</li>
            </ul>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-xs font-bold text-red-700 mb-2">Reader Account CANNOT</p>
            <ul className="text-xs text-slate-700 space-y-1">
              <li>✗ CREATE SHARE</li>
              <li>✗ CREATE PIPE</li>
              <li>✗ CREATE STAGE</li>
              <li>✗ SHOW PROCEDURES</li>
            </ul>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 space-y-1 text-xs">
          <p className="font-bold text-amber-800">Killer Exam Scenarios</p>
          <p className="text-slate-700">1. "Provider adds a new table to the share. Consumer must ___." → <strong>Nothing — visible automatically.</strong></p>
          <p className="text-slate-700">2. "Can the consumer clone a shared table?" → <strong>No — no OWNERSHIP.</strong></p>
          <p className="text-slate-700">3. "Can a Reader Account create a warehouse?" → <strong>YES</strong> (most say no because "Reader" sounds read-only).</p>
          <p className="text-slate-700">4. "Share is revoked. Consumer queries the database." → <strong>Database is EMPTY, not dropped.</strong></p>
        </div>
      </div>
    ),
  },
  {
    id: 'p5',
    label: 'P5 · Fake Functions',
    subtitle: '22 questions · ~45% miss rate',
    color: 'bg-red-600',
    items: (
      <div className="space-y-4">
        <Accordion title="Real System Functions">
          <CompareTable
            headers={['Function', 'Purpose']}
            rows={[
              ['SYSTEM$ALLOWLIST()', 'Firewall allowlist hostnames/ports'],
              ['SYSTEM$GET_PRIVATELINK_CONFIG()', 'PrivateLink endpoint URLs'],
              ['SYSTEM$CANCEL_QUERY(id)', 'Cancel a running query'],
              ['SYSTEM$STREAM_HAS_DATA(stream)', 'TRUE if stream has unconsumed data'],
              ['SYSTEM$CLUSTERING_INFORMATION(tbl, key)', 'Clustering depth/overlap stats'],
              ['SYSTEM$CLASSIFY(table, options)', 'Auto data classification'],
            ]}
          />
        </Accordion>

        <Accordion title="Real Scalar & Table Functions">
          <CompareTable
            headers={['Function', 'Purpose']}
            rows={[
              ['UUID_STRING()', 'Generate random UUID v4'],
              ['PARSE_JSON(string)', 'String → VARIANT'],
              ['TO_JSON(variant)', 'VARIANT → String'],
              ['OBJECT_KEYS(variant)', 'Array of top-level keys of a VARIANT object'],
              ['IFF(cond, true, false)', 'Inline IF-THEN-ELSE'],
              ['HASH_AGG(*)', 'Hash of entire result set (change detection)'],
              ['GET_DDL(type, name)', 'Returns CREATE DDL for an object'],
              ['LAST_QUERY_ID()', 'Query ID of last executed statement'],
              ['RESULT_SCAN(query_id)', 'Return previous result set as a table'],
              ['GENERATOR(ROWCOUNT => n)', 'Produce n synthetic rows'],
              ['FLATTEN(input => variant)', 'Explode arrays/objects into rows'],
              ['INFER_SCHEMA(location, format)', 'Detect schema from Parquet/Avro/ORC files'],
              ['VALIDATE(table, job_id)', 'Errors from a previous COPY INTO job'],
            ]}
          />
        </Accordion>

        <Accordion title="☠️ Functions That DO NOT EXIST — Common Distractors">
          <CompareTable
            headers={['Fake Name', 'Real Alternative']}
            rows={[
              ['SYSTEM$ABORT_STATEMENT()', 'SYSTEM$CANCEL_QUERY()'],
              ['SYSTEM$WHITELIST()', 'SYSTEM$ALLOWLIST()'],
              ['SYSTEM$STREAM_RESET()', 'DROP + RECREATE the stream'],
              ['RANDOM_UUID() / GENERATE_UUID() / SYS_GUID()', 'UUID_STRING()'],
              ['GET_KEYS() / VARIANT_KEYS()', 'OBJECT_KEYS()'],
              ['GROUP_CONCAT()', 'LISTAGG()'],
              ['LOAD_ERRORS()', 'VALIDATE(table, job_id)'],
              ['MAP_COLUMNS_BY_NAME / COLUMN_MAPPING', 'MATCH_BY_COLUMN_NAME (COPY option)'],
              ['STRIP_QUOTES()', '::VARCHAR cast'],
            ]}
          />
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mt-2">
            <p className="text-xs font-bold text-red-700">Example — "Which function cancels a running query?"</p>
            <p className="text-xs text-slate-700 mt-1">A) CANCEL_QUERY() — fake</p>
            <p className="text-xs text-slate-700">B) <strong>SYSTEM$CANCEL_QUERY()</strong> — REAL ✓</p>
            <p className="text-xs text-slate-700">C) ABORT_QUERY() — fake</p>
            <p className="text-xs text-red-700 font-semibold">D) SYSTEM$ABORT_STATEMENT() — fake but sounds very real! (SYSTEM$ prefix + ABORT + STATEMENT)</p>
          </div>
        </Accordion>
      </div>
    ),
  },
  {
    id: 'p6',
    label: 'P6 · Privilege Matrix',
    subtitle: '18 questions decoded',
    color: 'bg-orange-500',
    items: (
      <div className="space-y-4">
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <p className="text-sm font-bold text-orange-700">All 18 Privilege Scenarios — Full Grant Chains</p>
          <p className="text-xs text-slate-600 mt-1">Every scenario shows EXACT permission chains, what the role CAN and CANNOT do, and the specific GRANT statements needed.</p>
        </div>

        {/* ── Warehouse ── */}
        <Accordion title="Warehouse Privileges — 4 Questions (USAGE / OPERATE / MODIFY)">
          <CompareTable
            headers={['Privilege', 'What it Allows']}
            rows={[
              ['USAGE',     'Run queries using the warehouse'],
              ['OPERATE',   'Resume, suspend, abort queries — NOT run queries'],
              ['MODIFY',    'Resize, change auto-suspend, change scaling policy'],
              ['OWNERSHIP', 'All of the above + DROP'],
            ]}
          />
          <div className="space-y-3 mt-3">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <p className="text-xs font-bold text-slate-700">W1 — suspend only (no queries)</p>
              <CodeSnip code={`GRANT OPERATE ON WAREHOUSE my_wh TO ROLE ops_team;\n-- CAN: resume/suspend/abort\n-- CANNOT: run queries (needs USAGE)`} />
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <p className="text-xs font-bold text-slate-700">W2 — run queries (no control)</p>
              <CodeSnip code={`GRANT USAGE ON WAREHOUSE my_wh TO ROLE analyst;\n-- CAN: run queries\n-- CANNOT: suspend/resume/abort (needs OPERATE)`} />
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <p className="text-xs font-bold text-slate-700">W3 — resize (needs USAGE + OPERATE + MODIFY)</p>
              <CodeSnip code={`GRANT USAGE   ON WAREHOUSE my_wh TO ROLE admin;\nGRANT OPERATE ON WAREHOUSE my_wh TO ROLE admin;\nGRANT MODIFY  ON WAREHOUSE my_wh TO ROLE admin;\n-- NOW CAN: resize, change auto-suspend, change scaling policy`} />
            </div>
          </div>
        </Accordion>

        {/* ── DB + Schema + Table ── */}
        <Accordion title="Database → Schema → Table Access Chain — 5 Questions">
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3">
            <p className="text-xs font-bold text-red-700">ALL THREE grants required for SELECT. Missing ANY one = "Object does not exist or not authorized."</p>
          </div>
          <CodeSnip code={`GRANT USAGE ON DATABASE my_db TO ROLE analyst;         -- Step 1\nGRANT USAGE ON SCHEMA my_db.my_schema TO ROLE analyst;  -- Step 2\nGRANT SELECT ON TABLE my_db.my_schema.t1 TO ROLE analyst; -- Step 3`} />
          <div className="space-y-3 mt-3">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <p className="text-xs font-bold text-slate-700">D1 — SELECT granted but no USAGE chain</p>
              <p className="text-xs text-slate-600 mt-1">GRANT SELECT on table alone → ERROR. Role cannot even SEE the database to navigate to the table.</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <p className="text-xs font-bold text-slate-700">D2 — USAGE on DB lets you query? WRONG.</p>
              <p className="text-xs text-slate-600 mt-1">USAGE on database = can browse schemas. CANNOT query tables. USAGE on schema = can see objects. CANNOT query. SELECT on table = can query — ONLY if USAGE on DB + schema also granted.</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <p className="text-xs font-bold text-slate-700">D4 — External stage using storage integration</p>
              <CodeSnip code={`GRANT CREATE STAGE ON SCHEMA my_db.my_schema TO ROLE loader;\nGRANT USAGE ON INTEGRATION my_s3_int TO ROLE loader;\n-- Both required. Missing either = failure.`} />
            </div>
          </div>
        </Accordion>

        {/* ── Resource Monitors ── */}
        <Accordion title="Resource Monitor Privileges — 2 Questions">
          <CompareTable
            headers={['Privilege', 'Who / What']}
            rows={[
              ['CREATE RESOURCE MONITOR', 'ACCOUNTADMIN ONLY — cannot be delegated to any other role'],
              ['MONITOR',                 'View credit usage and remaining quota'],
              ['MODIFY',                  'Change quota, triggers, assigned warehouses'],
            ]}
          />
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mt-3">
            <p className="text-xs font-bold text-red-700">Trap — "Account-level resource monitor tracks all credits" = WRONG</p>
            <p className="text-xs text-slate-700 mt-1">Resource monitors ONLY track user-managed warehouse credits. Serverless features (auto-clustering, Snowpipe, MVs, SOS) are NOT tracked. Use BUDGETS for serverless cost monitoring.</p>
          </div>
        </Accordion>

        {/* ── Role Hierarchy ── */}
        <Accordion title="Role Hierarchy & Inheritance — 3 Questions">
          <CodeSnip code={`ACCOUNTADMIN\n  |-- SECURITYADMIN  (manages grants + users)\n  |     |-- USERADMIN (creates users and roles only)\n  |-- SYSADMIN       (creates DBs, warehouses, schemas)\nPUBLIC              (auto-granted to everyone)`} />
          <div className="space-y-3 mt-3">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <p className="text-xs font-bold text-slate-700">H1 — USERADMIN scope</p>
              <p className="text-xs text-green-700 mt-1">CAN: CREATE USER, CREATE ROLE, GRANT ROLE to USER/ROLE</p>
              <p className="text-xs text-red-700">CANNOT: GRANT SELECT ON TABLE, CREATE DATABASE, view billing</p>
              <p className="text-xs font-bold text-orange-700 mt-1">TRAP: "USERADMIN grants object privileges" = WRONG — that's SECURITYADMIN or object OWNERSHIP.</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <p className="text-xs font-bold text-slate-700">H3 — Custom role NOT granted to SYSADMIN</p>
              <CodeSnip code={`CREATE ROLE data_team;\nGRANT OWNERSHIP ON TABLE secret_data TO ROLE data_team;\n-- data_team is NOT granted to SYSADMIN\n-- ACCOUNTADMIN (via SYSADMIN) CANNOT see or manage secret_data\n-- Best practice: always grant custom roles to SYSADMIN`} />
            </div>
          </div>
        </Accordion>

        {/* ── Masking & RAP ── */}
        <Accordion title="Masking & Row Access Policy Evaluation — 4 Questions">
          <CompareTable
            headers={['Object', 'Evaluates Against']}
            rows={[
              ['Masking policy',          'QUERYING role context (CURRENT_ROLE)'],
              ['Row access policy',       'QUERYING role context (CURRENT_ROLE)'],
              ['Secure view',             "OWNER's privileges on base table"],
              ['Stored proc OWNER',       "OWNER's privileges"],
              ['Stored proc CALLER',      "CALLER's privileges"],
            ]}
          />
          <div className="space-y-3 mt-3">
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-xs font-bold text-red-700">M1 — ACCOUNTADMIN still sees masked data</p>
              <p className="text-xs text-slate-700 mt-1">NO ROLE bypasses masking policies — not even ACCOUNTADMIN. CURRENT_ROLE() = 'ACCOUNTADMIN' is not 'HR', so it sees masked value.</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <p className="text-xs font-bold text-slate-700">M2 — Secondary roles + CURRENT_ROLE() vs IS_ROLE_IN_SESSION()</p>
              <p className="text-xs text-slate-600 mt-1">Primary=ANALYST, Secondary=FINANCE. Policy uses CURRENT_ROLE() → returns 'ANALYST' only → MASKED. Fix: use IS_ROLE_IN_SESSION('FINANCE') → returns TRUE → UNMASKED.</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-xs font-bold text-red-700">M3 — RAP with no ELSE clause → 0 rows for unmatched roles</p>
              <p className="text-xs text-slate-700 mt-1">CASE with no ELSE returns NULL. NULL in boolean context = FALSE. Unmentioned roles see ZERO rows — they do NOT bypass the policy.</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <p className="text-xs font-bold text-slate-700">M4 — User-level network policy OVERRIDES account-level (not additive)</p>
              <CodeSnip code={`-- Account: allows 10.0.0.0/8\n-- User JDOE: allows 192.168.1.0/24\n-- JDOE from 10.0.0.5 --> user policy applies --> NOT in /24 --> BLOCKED`} />
            </div>
          </div>
        </Accordion>

        {/* ── EXECUTE AS ── */}
        <Accordion title="EXECUTE AS OWNER vs CALLER — 3 Questions">
          <CompareTable
            headers={['Mode', 'Runs As', 'Masking Policy Sees']}
            rows={[
              ['EXECUTE AS OWNER (default)', "Procedure owner's role", "Owner's role — not the caller's"],
              ['EXECUTE AS CALLER',          "Caller's current role",  "Caller's role"],
            ]}
          />
          <div className="space-y-3 mt-3">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <p className="text-xs font-bold text-slate-700">E1 — ANALYST calls OWNER proc, gets data without direct SELECT</p>
              <CodeSnip code={`-- Proc owner: DATA_ENG (has SELECT on secret_table)\n-- ANALYST: no SELECT on secret_table\nGRANT USAGE ON PROCEDURE get_data() TO ROLE analyst;\n-- ANALYST calls it → runs as DATA_ENG → SUCCESS`} />
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <p className="text-xs font-bold text-slate-700">E2 — CALLER proc fails for ANALYST</p>
              <CodeSnip code={`-- EXECUTE AS CALLER\n-- ANALYST calls it → runs as ANALYST → no SELECT → FAILS\n-- DATA_ENG calls it → runs as DATA_ENG → has SELECT → SUCCESS`} />
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-xs font-bold text-red-700">The Masking Interaction (hardest scenario)</p>
              <p className="text-xs text-slate-700 mt-1">Proc = EXECUTE AS OWNER (owner = DATA_ENG). Table has masking policy: allows ANALYST. Caller is ANALYST.</p>
              <p className="text-xs text-slate-700 mt-1">→ Proc runs as DATA_ENG → masking sees CURRENT_ROLE() = 'DATA_ENG' → not ANALYST → DATA IS MASKED even though the caller is ANALYST.</p>
            </div>
          </div>
        </Accordion>

        {/* ── Quick Reference ── */}
        <Accordion title="Quick Reference — What Grant Do I Need?">
          <CompareTable
            headers={['I want to…', 'I need…']}
            rows={[
              ['Run queries on a warehouse',          'USAGE on warehouse'],
              ['Suspend/resume a warehouse',           'OPERATE on warehouse'],
              ['Resize a warehouse',                   'MODIFY on warehouse'],
              ['See a database exists',                'USAGE on database'],
              ['Browse objects in a schema',           'USAGE on database + USAGE on schema'],
              ['SELECT from a table',                  'USAGE on DB + USAGE on schema + SELECT on table'],
              ['Create a table in a schema',           'USAGE on DB + USAGE on schema + CREATE TABLE on schema'],
              ['Create a schema in a DB',              'USAGE on DB + CREATE SCHEMA on DB'],
              ['View resource monitor usage',          'MONITOR on resource monitor'],
              ['Create a resource monitor',            'Must be ACCOUNTADMIN (non-delegable)'],
              ['Create an external stage',             'CREATE STAGE on schema + USAGE on storage integration'],
              ['Execute a task manually',              'OPERATE on task'],
              ['Call a stored procedure',              'USAGE on procedure'],
              ['See column-level access history',      'SELECT on SNOWFLAKE.ACCOUNT_USAGE.ACCESS_HISTORY'],
            ]}
          />
        </Accordion>
      </div>
    ),
  },
];

// ── Root Component ────────────────────────────────────────────────────────────
const TrapsAndGotchas = () => {
  const [tab,         setTab]         = useState('traps');  // 'traps' | 'patterns'
  const [activeIndex, setActiveIndex] = useState(0);

  const sections = tab === 'traps' ? TRAP_SECTIONS : PATTERN_SECTIONS;
  const active   = sections[activeIndex];

  return (
    <div className="space-y-4 max-w-3xl mx-auto">

      {/* Header */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-red-500 p-2 rounded-xl">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold">Traps & Gotchas</h2>
            <p className="text-slate-400 text-xs">11 trap categories · 6 pattern sections · COF-C03 exam traps</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4 text-center">
          {[
            { label: '11', sub: 'trap categories' },
            { label: '6', sub: 'top miss patterns' },
            { label: '55%', sub: 'avg miss rate' },
          ].map(s => (
            <div key={s.label} className="bg-white/10 rounded-xl p-3">
              <p className="text-white font-extrabold text-lg">{s.label}</p>
              <p className="text-slate-400 text-[10px] font-medium">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main tab toggle */}
      <div className="flex gap-2">
        <button onClick={() => { setTab('traps'); setActiveIndex(0); }}
          className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
            tab === 'traps'
              ? 'bg-red-500 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400'
          }`}>
          <AlertTriangle className="w-4 h-4" /> ⚠️ Traps (11)
        </button>
        <button onClick={() => { setTab('patterns'); setActiveIndex(0); }}
          className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
            tab === 'patterns'
              ? 'bg-violet-600 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400'
          }`}>
          <Zap className="w-4 h-4" /> 🎯 Top 6 Patterns
        </button>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 flex-wrap">
        {sections.map((s, i) => (
          <Pill
            key={s.id}
            label={s.label}
            active={activeIndex === i}
            onClick={() => setActiveIndex(i)}
            color={s.color}
          />
        ))}
      </div>

      {/* Active section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${active.color}`} />
          <h3 className="font-extrabold text-slate-800 text-base">{active.label}</h3>
          {active.subtitle && (
            <span className="ml-auto text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
              {active.subtitle}
            </span>
          )}
        </div>
        {active.items}
      </div>

      {/* Bottom nav */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveIndex(i => Math.max(0, i - 1))}
          disabled={activeIndex === 0}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:border-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-4 h-4 rotate-180" /> Prev
        </button>
        <span className="flex-1 text-center text-xs text-slate-400 font-medium">
          {activeIndex + 1} / {sections.length}
        </span>
        <button
          onClick={() => setActiveIndex(i => Math.min(sections.length - 1, i + 1))}
          disabled={activeIndex === sections.length - 1}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:border-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TrapsAndGotchas;
