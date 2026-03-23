import React, { useState, useCallback } from 'react';
import {
  Upload, Database, Zap, Plug, Construction,
  ChevronRight, RefreshCw, CheckCircle, XCircle, FlaskConical,
  HardDrive, Cloud, GitBranch, Activity,
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

// ─── Tab registry — mirrors guide objectives 3.1 → 3.3 ──────────────────────
const TABS = [
  { id: 'loading',    label: '📦 3.1 Data Loading & Unloading' },
  { id: 'ingestion',  label: '⚡ 3.2 Automated Ingestion' },
  { id: 'connectors', label: '🔌 3.3 Connectors & Integrations' },
  { id: 'quiz',       label: '🧪 Quiz', accent: true },
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

// ─── Domain 3 root ────────────────────────────────────────────────────────────
const Domain3_DataLoading = () => {
  const [activeTab, setActiveTab] = useState('loading');
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
                  : 'border-teal-600 text-teal-700 bg-teal-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'loading'    && <LoadingTab />}
      {activeTab === 'ingestion'  && <IngestionTab />}
      {activeTab === 'connectors' && <ConnectorsTab />}
      {activeTab === 'quiz'       && <QuizTab />}
      {!['loading', 'ingestion', 'connectors', 'quiz'].includes(activeTab) &&
        <ComingSoon tab={TABS.find(t => t.id === activeTab)?.label} />}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// LEARNING TAB 1 — 3.1 Data Loading & Unloading
// Covers: File formats, Stages (internal/external), COPY INTO, Error handling
// ═══════════════════════════════════════════════════════════════════════════════

const FILE_FORMATS = [
  {
    id: 'csv',
    name: 'CSV / Delimited',
    icon: '📄',
    best: 'Tabular structured data',
    canUnload: true,
    notes: 'Most common format. Supports custom delimiters, SKIP_HEADER, NULL_IF, ESCAPE chars, FIELD_OPTIONALLY_ENCLOSED_BY, and PARSE_HEADER (auto-detect column names from header row). Any valid delimiter supported — default is comma.',
    code: `CREATE FILE FORMAT my_csv
  TYPE = 'CSV'
  FIELD_DELIMITER = ','
  SKIP_HEADER = 1               -- skip column-header row
  NULL_IF = ('NULL', 'null', '')
  EMPTY_FIELD_AS_NULL = TRUE
  COMPRESSION = AUTO;           -- auto-detect gzip, bzip2, zstd, etc.`,
  },
  {
    id: 'json',
    name: 'JSON',
    icon: '🔵',
    best: 'Semi-structured / nested data',
    canUnload: true,
    notes: 'Loaded into VARIANT columns. STRIP_OUTER_ARRAY unwraps top-level arrays into individual rows. On unload, Snowflake outputs NDJSON (newline-delimited JSON) — not comma-separated arrays.',
    code: `CREATE FILE FORMAT my_json
  TYPE = 'JSON'
  STRIP_OUTER_ARRAY = TRUE   -- each array element → its own row
  STRIP_NULL_VALUES = FALSE  -- keep null fields in output
  ALLOW_DUPLICATE = FALSE;   -- reject duplicate object keys`,
  },
  {
    id: 'parquet',
    name: 'Parquet',
    icon: '🟦',
    best: 'Columnar analytics, big data pipelines',
    canUnload: true,
    notes: 'Columnar binary format. USE_LOGICAL_TYPE = TRUE maps Parquet logical types to Snowflake types. USE_VECTORIZED_SCANNER = TRUE dramatically speeds up loading. SNAPPY_COMPRESSION is deprecated — use COMPRESSION = SNAPPY instead.',
    code: `CREATE FILE FORMAT my_parquet
  TYPE = 'PARQUET'
  USE_LOGICAL_TYPE = TRUE       -- map Parquet logical → Snowflake types
  USE_VECTORIZED_SCANNER = TRUE -- faster loading (preview, future default)
  COMPRESSION = AUTO;           -- auto-detect Snappy, gzip, LZO, etc.`,
  },
  {
    id: 'avro',
    name: 'Avro',
    icon: '🟧',
    best: 'Schema-embedded row storage, Kafka pipelines',
    canUnload: false,
    notes: 'LOAD ONLY — Avro cannot be used for unloading. Row-based binary format with embedded Avro schema. Common in Kafka → Snowpipe pipelines. Schema is self-describing inside the file.',
    code: `CREATE FILE FORMAT my_avro
  TYPE = 'AVRO'
  COMPRESSION = AUTO;  -- auto-detect gzip, brotli, zstd, deflate`,
  },
  {
    id: 'orc',
    name: 'ORC',
    icon: '🟩',
    best: 'Hadoop / Hive ecosystems',
    canUnload: false,
    notes: 'LOAD ONLY — ORC cannot be used for unloading. Optimized Row Columnar format, common in Hadoop/Hive. Snowflake loads ORC data into VARIANT columns. Use MATCH_BY_COLUMN_NAME to load into structured columns.',
    code: `CREATE FILE FORMAT my_orc
  TYPE = 'ORC'
  TRIM_SPACE = FALSE;`,
  },
  {
    id: 'xml',
    name: 'XML',
    icon: '🔶',
    best: 'Legacy enterprise / B2B integrations',
    canUnload: false,
    notes: 'LOAD ONLY — XML cannot be used for unloading. Loaded into VARIANT. STRIP_OUTER_ELEMENT exposes 2nd-level elements as separate rows. Use XMLGET() function and dot-notation to navigate elements.',
    code: `CREATE FILE FORMAT my_xml
  TYPE = 'XML'
  STRIP_OUTER_ELEMENT = TRUE;  -- 2nd-level elements → separate rows`,
  },
];

const STAGE_TYPES = [
  {
    id: 'user',
    name: 'User Stage',
    ref: '@~',
    scope: 'Per user — private',
    desc: 'Every user gets a personal stage automatically. Cannot be altered or dropped. Only accessible by the owning user.',
    bestFor: 'Quick personal uploads, testing.',
    canAltDrop: false,
    code: `-- Upload a file to your user stage
PUT file:///tmp/data.csv @~;

-- Load from user stage
COPY INTO my_table FROM @~/data.csv.gz;`,
  },
  {
    id: 'table',
    name: 'Table Stage',
    ref: '@%table_name',
    scope: 'Per table — shared with table owners',
    desc: 'Every table gets a stage automatically. Cannot be altered or dropped. Anyone with table privileges can access it.',
    bestFor: 'Loading data into a specific table from multiple users.',
    canAltDrop: false,
    code: `-- Upload to table stage
PUT file:///tmp/orders.csv @%orders;

-- Load from table stage (no FROM clause needed — same table)
COPY INTO orders FROM @%orders;`,
  },
  {
    id: 'named_int',
    name: 'Named Internal Stage',
    ref: '@stage_name',
    scope: 'Schema-level, shareable',
    desc: 'Explicitly created. Fully configurable — encryption, file format, compression. Can be shared across users/roles.',
    bestFor: 'Production pipelines, team-shared staging.',
    canAltDrop: true,
    code: `-- Create named internal stage
CREATE STAGE my_stage
  FILE_FORMAT = (TYPE = 'CSV' SKIP_HEADER = 1)
  ENCRYPTION = (TYPE = 'SNOWFLAKE_SSE'); -- server-side encryption

-- Upload & load
PUT file:///tmp/sales.csv @my_stage;
COPY INTO sales_table FROM @my_stage;`,
  },
  {
    id: 'named_ext',
    name: 'Named External Stage',
    ref: '@ext_stage_name',
    scope: 'Schema-level, points to cloud storage',
    desc: 'Points to an S3 bucket, Azure Blob container, or GCS bucket. Uses a storage integration or credentials for auth.',
    bestFor: 'Loading from cloud data lakes, Snowpipe auto-ingest.',
    canAltDrop: true,
    code: `-- External stage pointing to S3 via storage integration
CREATE STAGE my_s3_stage
  URL = 's3://my-bucket/data/'
  STORAGE_INTEGRATION = my_s3_integration
  FILE_FORMAT = (TYPE = 'PARQUET');

-- Load from external stage
COPY INTO my_table FROM @my_s3_stage;`,
  },
];

const ON_ERROR_OPTIONS = [
  { opt: 'ABORT_STATEMENT', effect: 'Default. Aborts the COPY command on the first error; no rows are loaded.', safe: true },
  { opt: 'CONTINUE', effect: 'Skips all bad rows and continues loading all valid rows. Errors are logged.', safe: false },
  { opt: 'SKIP_FILE', effect: 'Skips the entire file if any error is found. Continues with other files.', safe: true },
  { opt: 'SKIP_FILE_<n>', effect: 'Skips file when the error count in that file reaches n (e.g., SKIP_FILE_5).', safe: true },
  { opt: 'SKIP_FILE_<n>%', effect: 'Skips file when error percentage in the file reaches n% (e.g., SKIP_FILE_10%).', safe: true },
];

const LoadingTab = () => {
  const [openFormat, setOpenFormat] = useState(null);
  const [openStage,  setOpenStage]  = useState(null);

  return (
    <div className="space-y-5">
      <InfoCard>
        <SectionHeader
          icon={Upload}
          color="bg-teal-700"
          title="3.1 Data Loading & Unloading"
          subtitle="File formats · Stage types · COPY INTO · Error handling"
        />

        {/* Load vs Unload definitions */}
        <div className="grid sm:grid-cols-2 gap-3 mb-4 mt-1">
          <div className="rounded-xl border border-teal-200 bg-teal-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">📥</span>
              <span className="font-bold text-teal-800 text-sm">Loading (Ingestion)</span>
            </div>
            <p className="text-xs text-teal-900 leading-relaxed">
              Moving data <strong>into</strong> a Snowflake table from an external source. Files sit in a <em>stage</em> (internal or external) first; the <code className="bg-teal-100 px-1 rounded font-mono">COPY INTO &lt;table&gt;</code> command reads them and inserts rows. Snowflake validates format, applies transformations, and tracks load history.
            </p>
            <p className="text-[11px] text-teal-700 mt-2 font-medium">Key commands: <code className="bg-teal-100 px-1 rounded font-mono">PUT</code> → stage, <code className="bg-teal-100 px-1 rounded font-mono">COPY INTO &lt;table&gt;</code> → load</p>
          </div>
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">📤</span>
              <span className="font-bold text-blue-800 text-sm">Unloading (Export)</span>
            </div>
            <p className="text-xs text-blue-900 leading-relaxed">
              Moving data <strong>out of</strong> a Snowflake table into files on a stage or cloud storage. <code className="bg-blue-100 px-1 rounded font-mono">COPY INTO &lt;location&gt;</code> writes query results to files. Use <code className="bg-blue-100 px-1 rounded font-mono">GET</code> to download from an internal stage to a local machine.
            </p>
            <p className="text-[11px] text-blue-700 mt-2 font-medium">Key commands: <code className="bg-blue-100 px-1 rounded font-mono">COPY INTO @stage</code> → unload, <code className="bg-blue-100 px-1 rounded font-mono">GET</code> → download</p>
          </div>
        </div>

        {/* File Formats */}
        <h3 className="font-bold text-slate-700 mb-2 mt-2">File Formats</h3>

        {/* Load / Unload support matrix */}
        <div className="overflow-x-auto mb-3">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Format</th>
                <th className="text-center p-2 font-bold text-slate-600 border border-slate-200">Load</th>
                <th className="text-center p-2 font-bold text-slate-600 border border-slate-200">Unload</th>
                <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Type</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'CSV / Delimited', load: true,  unload: true,  type: 'Structured' },
                { name: 'JSON',            load: true,  unload: true,  type: 'Semi-structured' },
                { name: 'Parquet',         load: true,  unload: true,  type: 'Semi-structured' },
                { name: 'Avro',            load: true,  unload: false, type: 'Semi-structured' },
                { name: 'ORC',             load: true,  unload: false, type: 'Semi-structured' },
                { name: 'XML',             load: true,  unload: false, type: 'Semi-structured' },
              ].map(r => (
                <tr key={r.name} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-2 border border-slate-200 font-medium text-slate-700">{r.name}</td>
                  <td className="p-2 border border-slate-200 text-center">
                    <span className="text-emerald-600 font-bold">✓</span>
                  </td>
                  <td className="p-2 border border-slate-200 text-center">
                    {r.unload
                      ? <span className="text-emerald-600 font-bold">✓</span>
                      : <span className="text-red-400 font-bold">✗</span>}
                  </td>
                  <td className="p-2 border border-slate-200 text-slate-500">{r.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-amber-700 bg-amber-50 rounded-lg px-3 py-1.5 border border-amber-200 mb-3">⚠️ Only <strong>CSV, JSON, and Parquet</strong> support unloading. Avro, ORC, and XML are <strong>load only</strong>. JSON unloads as <strong>NDJSON</strong> (not array format).</p>

        <div className="space-y-2">
          {FILE_FORMATS.map((f, i) => (
            <div key={f.id} className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-4 py-3 text-left bg-slate-50 hover:bg-slate-100 transition-colors"
                onClick={() => setOpenFormat(openFormat === i ? null : i)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{f.icon}</span>
                  <span className="font-semibold text-slate-700 text-sm">{f.name}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded hidden sm:inline ${f.canUnload ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                    {f.canUnload ? 'Load + Unload' : 'Load only'}
                  </span>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${openFormat === i ? 'rotate-90' : ''}`} />
              </button>
              {openFormat === i && (
                <div className="px-4 pb-4 pt-2 bg-white">
                  <p className="text-xs text-teal-700 font-semibold mb-1">Best for: {f.best}</p>
                  <p className="text-sm text-slate-600 mb-2">{f.notes}</p>
                  <CodeBlock code={f.code} />
                </div>
              )}
            </div>
          ))}
        </div>
      </InfoCard>

      {/* Stages */}
      <InfoCard>
        <h3 className="font-bold text-slate-700 mb-1">Stage Types</h3>
        <p className="text-xs text-slate-500 mb-3">A stage is a named location (internal or external) where data files live before/after loading.</p>
        <div className="space-y-2">
          {STAGE_TYPES.map((s, i) => (
            <div key={s.id} className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-4 py-3 text-left bg-slate-50 hover:bg-slate-100 transition-colors"
                onClick={() => setOpenStage(openStage === i ? null : i)}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-teal-700 text-xs font-bold bg-teal-50 px-2 py-0.5 rounded">{s.ref}</span>
                  <span className="font-semibold text-slate-700 text-sm">{s.name}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded hidden sm:inline ${s.canAltDrop ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {s.canAltDrop ? 'ALTER/DROP ✓' : 'auto-created'}
                  </span>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${openStage === i ? 'rotate-90' : ''}`} />
              </button>
              {openStage === i && (
                <div className="px-4 pb-4 pt-2 bg-white space-y-2">
                  <p className="text-sm text-slate-600">{s.desc}</p>
                  <p className="text-xs text-teal-700 font-semibold">Best for: {s.bestFor}</p>
                  <p className="text-xs text-slate-500">Scope: {s.scope}</p>
                  <CodeBlock code={s.code} />
                </div>
              )}
            </div>
          ))}
        </div>
      </InfoCard>

      {/* Stage Encryption & Unstructured Data */}
      <InfoCard>
        <h3 className="font-bold text-slate-700 mb-3">Stage Encryption & Unstructured Data Access</h3>
        <p className="text-xs text-slate-500 mb-3">Internal stages always encrypt files. The encryption type determines whether pre-signed, file, or scoped URLs can be used to access staged files externally.</p>

        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <p className="text-xs font-bold text-slate-700 mb-1">Default (Client-side / SNOWFLAKE_FULL)</p>
            <p className="text-xs text-slate-600 mb-2">Files are <strong>client-side encrypted</strong> using AES-256 by default. Snowflake owns the keys. Files are <strong>unreadable</strong> via pre-signed, file, or scoped URLs. Use for Tri-Secret Secure compliance.</p>
            <CodeBlock code={`CREATE STAGE my_stage;
-- default: client-side encrypted
-- staged files NOT accessible via external URLs`} />
          </div>
          <div className="bg-teal-50 rounded-xl p-3 border border-teal-200">
            <p className="text-xs font-bold text-teal-700 mb-1">SNOWFLAKE_SSE (Server-side)</p>
            <p className="text-xs text-teal-800 mb-2">Required to access staged files via pre-signed, scoped, or file URLs. <strong>Cannot be changed after stage creation.</strong> Does NOT support Tri-Secret Secure.</p>
            <CodeBlock code={`CREATE STAGE my_int_stage
  ENCRYPTION = (TYPE = 'SNOWFLAKE_SSE')
  DIRECTORY  = (ENABLE = TRUE);`} />
          </div>
        </div>

        <p className="text-xs font-bold text-slate-600 mb-2">3 URL Types for Staged File Access</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">URL Type</th>
                <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">SQL Function</th>
                <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Expires</th>
                <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Best for</th>
              </tr>
            </thead>
            <tbody>
              {[
                { type: 'Scoped URL',     fn: 'BUILD_SCOPED_FILE_URL()',  exp: '24 h (results cache)',       use: 'Share with specific roles; Snowflake logs who accessed' },
                { type: 'File URL',       fn: 'BUILD_STAGE_FILE_URL()',   exp: 'Permanent',                  use: 'Custom apps; role needs stage USAGE / READ privilege' },
                { type: 'Pre-signed URL', fn: 'GET_PRESIGNED_URL()',      exp: 'Configurable (user-defined)', use: 'BI tools, anonymous browser access — no auth needed' },
              ].map(r => (
                <tr key={r.type} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-2 border border-slate-200 font-bold text-teal-700">{r.type}</td>
                  <td className="p-2 border border-slate-200 font-mono text-slate-600">{r.fn}</td>
                  <td className="p-2 border border-slate-200 text-slate-500">{r.exp}</td>
                  <td className="p-2 border border-slate-200 text-slate-600">{r.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-amber-700 bg-amber-50 rounded-lg p-2 border border-amber-200 mt-3">⚠️ Encryption type <strong>cannot be changed</strong> after stage creation. Use <strong>SNOWFLAKE_FULL</strong> (not SSE) if Tri-Secret Secure compliance is required.</p>
      </InfoCard>

      {/* COPY INTO */}
      <InfoCard>
        <h3 className="font-bold text-slate-700 mb-3">COPY INTO Command</h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Loading (Stage → Table)</p>
            <CodeBlock code={`COPY INTO my_table
  FROM @my_stage/folder/
  FILE_FORMAT  = (FORMAT_NAME = 'my_csv')
  ON_ERROR     = 'CONTINUE'
  MATCH_BY_COLUMN_NAME = CASE_INSENSITIVE -- map by col name
  PURGE        = TRUE;   -- delete file after successful load`} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Unloading (Table → Stage)</p>
            <CodeBlock code={`COPY INTO @my_stage/export/
  FROM (SELECT * FROM orders WHERE year = 2024)
  FILE_FORMAT  = (TYPE = 'PARQUET')
  SINGLE       = FALSE       -- multiple output files (default)
  MAX_FILE_SIZE = 104857600  -- max 100 MB per file
  PARTITION BY (DATE_TRUNC('month', order_date)); -- partitioned`} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <p className="text-xs font-bold text-slate-700 mb-1">Transformation during load</p>
            <p className="text-xs text-slate-600">COPY INTO supports transformations inline — no intermediate table needed:</p>
            <ul className="text-xs text-slate-600 mt-1 space-y-0.5">
              <li>• Column reordering</li>
              <li>• Column omission (skip source columns)</li>
              <li>• Casts / type conversions</li>
              <li>• Truncating strings to column length</li>
            </ul>
            <CodeBlock code={`COPY INTO target(a, c)     -- load only cols a & c
  FROM (SELECT $1, $3::DATE  -- $3 cast to DATE
        FROM @my_stage);`} />
          </div>
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <p className="text-xs font-bold text-slate-700 mb-1">Schema Detection (INFER_SCHEMA)</p>
            <p className="text-xs text-slate-600 mb-1">Automatically detect column definitions from staged semi-structured files (Parquet, Avro, ORC, JSON, CSV). Supports CREATE TABLE … USING TEMPLATE.</p>
            <CodeBlock code={`-- Detect schema from staged Parquet files
SELECT * FROM TABLE(
  INFER_SCHEMA(
    LOCATION => '@my_stage',
    FILE_FORMAT => 'my_parquet'
  )
);

-- Create table with detected schema
CREATE TABLE auto_table
  USING TEMPLATE (
    SELECT ARRAY_AGG(OBJECT_CONSTRUCT(*))
    FROM TABLE(INFER_SCHEMA(...))
  );`} />
          </div>
        </div>

        <h3 className="font-bold text-slate-700 mb-3 mt-2">ON_ERROR Options</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Option</th>
                <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Behavior</th>
              </tr>
            </thead>
            <tbody>
              {ON_ERROR_OPTIONS.map(o => (
                <tr key={o.opt} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-2 border border-slate-200 font-mono text-teal-700 font-bold">{o.opt}</td>
                  <td className="p-2 border border-slate-200 text-slate-600">{o.effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          <div className="p-3 bg-teal-50 rounded-xl border border-teal-200">
            <p className="text-xs font-bold text-teal-700 mb-1">Directory Tables</p>
            <p className="text-xs text-teal-800">Catalog of staged files (path, size, last_modified, etag). Refresh manually with <span className="font-mono font-bold">ALTER STAGE … REFRESH</span> or automatically via event notifications. Query with <span className="font-mono font-bold">SELECT * FROM DIRECTORY(@stage_name)</span>.</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs font-bold text-slate-700 mb-1">GET — Download from Internal Stage</p>
            <p className="text-xs text-slate-600 mb-1">After unloading to an internal stage, use the GET command to download files to your local machine.</p>
            <CodeBlock code={`GET @my_stage/export/
  file:///tmp/exports/;`} />
          </div>
        </div>
      </InfoCard>

      <ExamTip>
        <p>• <strong>User stage (@~)</strong> and <strong>table stage (@%)</strong> are auto-created — cannot be dropped or altered.</p>
        <p>• <strong>Only CSV, JSON, Parquet</strong> support unloading. Avro, ORC, XML are <strong>load only</strong>.</p>
        <p>• <strong>JSON unloads as NDJSON</strong> (newline-delimited) — not as a top-level array.</p>
        <p>• <strong>SNOWFLAKE_SSE</strong> is required for pre-signed/scoped/file URL access. Cannot be changed after stage creation.</p>
        <p>• Default <strong>ON_ERROR = ABORT_STATEMENT</strong> — one bad row stops the entire load.</p>
        <p>• COPY INTO is <strong>idempotent</strong> — won't re-load already-loaded files within 64 days (use FORCE = TRUE to override).</p>
        <p>• COPY INTO supports <strong>inline transformations</strong>: column reordering, omission, casts — no intermediate table needed.</p>
        <p>• <strong>PARTITION BY</strong> in COPY INTO (unload) writes data into a directory structure — useful for data lake patterns.</p>
      </ExamTip>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// LEARNING TAB 2 — 3.2 Automated Data Ingestion
// Covers: Snowpipe, Snowpipe Streaming, Streams, Tasks, Dynamic Tables, Openflow
// ═══════════════════════════════════════════════════════════════════════════════

const STREAM_TYPES = [
  {
    name: 'Standard (default)',
    tracking: 'INSERT, UPDATE, DELETE, table truncates. Joins deletes + inserts to produce row-level delta.',
    tables: 'Standard tables, dynamic tables, Iceberg tables, directory tables, views',
    note: 'Updates appear as a DELETE + INSERT pair with METADATA$ISUPDATE = TRUE.',
  },
  {
    name: 'Append-only',
    tracking: 'Row inserts only. Updates, deletes, and truncates are NOT captured.',
    tables: 'Standard tables, dynamic tables, Iceberg tables, views',
    note: 'More performant than standard for ELT scenarios that only need new rows.',
  },
  {
    name: 'Insert-only',
    tracking: 'Row inserts only. Delete operations on an inserted set are not recorded.',
    tables: 'External tables & externally managed Iceberg tables only',
    note: 'Files added to cloud storage appear as inserts; removed files are ignored.',
  },
];

const TASK_COMPUTE = [
  {
    type: 'Serverless (SNOWFLAKE_MANAGED)',
    when: 'Short, frequent tasks; strict schedule adherence; unpredictable load',
    cost: 'Credits per compute-hour. Snowflake auto-sizes within MIN/MAX warehouse bounds.',
    priv: 'EXECUTE MANAGED TASK privilege required on account',
  },
  {
    type: 'User-managed warehouse',
    when: 'Long-running SQL, complex transforms, heavily concurrent task workloads',
    cost: 'Per-second warehouse billing (60-second minimum on resume)',
    priv: 'USAGE on warehouse + EXECUTE TASK on account',
  },
];

const IngestionTab = () => {
  const [open, setOpen] = useState(null);

  const sections = [
    {
      id: 'snowpipe',
      icon: '🚿',
      title: 'Snowpipe',
      subtitle: 'Serverless, event-triggered, file-based micro-batch loading',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-slate-600">A <strong>pipe</strong> is a named Snowflake object containing a COPY statement. Snowpipe loads files from a stage automatically — no virtual warehouse needed. Triggered via cloud event notifications (S3 SQS, Azure Event Grid, GCS Pub/Sub) or the REST API.</p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Category</th>
                  <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Bulk (COPY INTO)</th>
                  <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Snowpipe</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Compute', 'User virtual warehouse', 'Snowflake-supplied (serverless)'],
                  ['Load history retention', '64 days (in table metadata)', '14 days (in pipe metadata)'],
                  ['Transactions', 'Always single transaction', 'Combined/split by file size'],
                  ['REST auth', 'Standard session auth', 'Key-pair authentication + JWT'],
                  ['Use case', 'Large batch, one-time loads', 'Continuous micro-batch, near real-time'],
                ].map(([cat, bulk, pipe]) => (
                  <tr key={cat} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-2 border border-slate-200 font-medium text-slate-600">{cat}</td>
                    <td className="p-2 border border-slate-200 text-slate-500">{bulk}</td>
                    <td className="p-2 border border-slate-200 text-teal-700">{pipe}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-teal-50 rounded-lg p-3 border border-teal-200">
              <p className="font-bold text-teal-800 mb-1">File deduplication</p>
              <p className="text-teal-700">Snowpipe tracks file path + name per pipe. It will NOT reload a file with the same name even if the file content changed (different eTag). Use a unique filename per load batch.</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <p className="font-bold text-slate-700 mb-1">Pipe DDL commands</p>
              <ul className="space-y-0.5 text-slate-600">
                <li>• <span className="font-mono">CREATE PIPE</span></li>
                <li>• <span className="font-mono">ALTER PIPE</span> (pause/resume)</li>
                <li>• <span className="font-mono">DESCRIBE PIPE</span></li>
                <li>• <span className="font-mono">SHOW PIPES</span></li>
                <li>• <span className="font-mono">DROP PIPE</span></li>
              </ul>
            </div>
          </div>
          <CodeBlock code={`-- Auto-ingest pipe: S3 SQS event triggers load
CREATE PIPE my_pipe
  AUTO_INGEST = TRUE
AS
  COPY INTO raw_events
  FROM @my_s3_stage
  FILE_FORMAT = (TYPE = 'JSON' STRIP_OUTER_ARRAY = TRUE);

-- Check pipe status & queue depth
SELECT SYSTEM$PIPE_STATUS('my_pipe');

-- Pause / resume
ALTER PIPE my_pipe SET PIPE_EXECUTION_PAUSED = TRUE;`} />
        </div>
      ),
    },
    {
      id: 'streaming',
      icon: '🌊',
      title: 'Snowpipe Streaming',
      subtitle: 'Sub-second, row-level ingestion via SDK — no file staging',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-slate-600">Snowpipe Streaming writes rows <em>directly</em> into Snowflake tables via the Snowflake Ingest SDK — no staging files required. Two architectures are available:</p>

          <div className="grid sm:grid-cols-2 gap-3 text-xs mb-2">
            <div className="bg-teal-50 rounded-xl p-3 border border-teal-200">
              <p className="font-bold text-teal-800 mb-1">⚡ High-Performance (Recommended)</p>
              <ul className="space-y-0.5 text-teal-700">
                <li>• Uses <span className="font-mono font-bold">snowpipe-streaming</span> SDK</li>
                <li>• Requires a PIPE object; channels open against it</li>
                <li>• Throughput-based pricing (credits per uncompressed GB)</li>
                <li>• Server-side schema validation at ingest time</li>
                <li>• REST API for direct lightweight ingestion</li>
              </ul>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <p className="font-bold text-slate-700 mb-1">Classic Architecture (GA)</p>
              <ul className="space-y-0.5 text-slate-600">
                <li>• Uses <span className="font-mono font-bold">snowflake-ingest-sdk</span></li>
                <li>• No PIPE object — channels open against tables directly</li>
                <li>• Billed on compute + active client connections</li>
                <li>• Established pipelines; consider migrating to high-perf</li>
              </ul>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Feature</th>
                  <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Snowpipe</th>
                  <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Snowpipe Streaming</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Unit of ingestion',  'Files on a stage',          'Rows via SDK channel'],
                  ['Latency',            'Seconds to minutes',        'Sub-second (auto-flush ~1s)'],
                  ['Staging required?',  'Yes (internal/external)',   'No'],
                  ['Pipe object',        'Required',                  'Required (high-perf) / Optional (classic)'],
                  ['Insert-only?',       'No — uses COPY INTO',       'Yes — only INSERT; modify via streams'],
                  ['Ordering',           'Not guaranteed across files','Ordered within each channel'],
                ].map(([f, p, s]) => (
                  <tr key={f} className="border-b border-slate-100">
                    <td className="p-2 border border-slate-200 font-medium text-slate-600">{f}</td>
                    <td className="p-2 border border-slate-200 text-slate-500">{p}</td>
                    <td className="p-2 border border-slate-200 text-teal-700">{s}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <p className="font-bold text-slate-700 mb-1">Channels & Offset Tokens</p>
            <p className="text-slate-600 mb-1">A <strong>channel</strong> is a logical named streaming connection to a Snowflake table. Data is flushed every ~1 second automatically. Channels are long-lived — reuse across process restarts.</p>
            <p className="text-slate-600">An <strong>offset token</strong> is a user-defined string (e.g. Kafka partition offset) stored by Snowflake per channel. Used by the client to track ingestion progress and avoid re-sending data after a crash. Inactive channels are deleted after <strong>30 days</strong>.</p>
          </div>
        </div>
      ),
    },
    {
      id: 'streams',
      icon: '🔁',
      title: 'Streams (CDC)',
      subtitle: 'Change Data Capture — track DML changes as an offset pointer',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-slate-600">A stream stores an <strong>offset</strong> (not data) against a source object. When queried, it returns the CDC delta between the offset and the current table version. The offset advances only when the stream is consumed in a DML transaction.</p>

          <div className="grid sm:grid-cols-3 gap-2 text-xs mb-1">
            {[
              { col: 'METADATA$ACTION',   desc: 'INSERT or DELETE. Updates appear as DELETE + INSERT pair.' },
              { col: 'METADATA$ISUPDATE', desc: 'TRUE when the INSERT/DELETE pair came from an UPDATE statement.' },
              { col: 'METADATA$ROW_ID',   desc: 'Unique immutable row ID for tracking individual row changes over time.' },
            ].map(m => (
              <div key={m.col} className="bg-teal-50 rounded-lg p-2 border border-teal-200">
                <p className="font-mono font-bold text-teal-800 text-[10px]">{m.col}</p>
                <p className="text-teal-700 mt-0.5">{m.desc}</p>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Type</th>
                  <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Tracks</th>
                  <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Supported Sources</th>
                </tr>
              </thead>
              <tbody>
                {STREAM_TYPES.map(s => (
                  <tr key={s.name} className="border-b border-slate-100">
                    <td className="p-2 border border-slate-200 font-bold text-teal-700">{s.name}</td>
                    <td className="p-2 border border-slate-200 text-slate-600">{s.tracking}</td>
                    <td className="p-2 border border-slate-200 text-slate-500">{s.tables}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <CodeBlock code={`-- Standard stream on a table
CREATE STREAM orders_stream ON TABLE orders;

-- Append-only stream (more efficient for insert-only sources)
CREATE STREAM events_stream ON TABLE events
  APPEND_ONLY = TRUE;

-- Consume stream in a DML transaction (advances offset)
BEGIN;
  MERGE INTO orders_summary t
  USING orders_stream s ON t.id = s.order_id
  WHEN MATCHED AND s.METADATA$ACTION = 'DELETE' THEN DELETE
  WHEN NOT MATCHED AND s.METADATA$ACTION = 'INSERT' THEN INSERT (...);
COMMIT;

-- Check for unconsumed changes (also prevents stream staleness if empty)
SELECT SYSTEM$STREAM_HAS_DATA('orders_stream');

-- CHANGES clause: read-only CDC without advancing offset
SELECT * FROM orders
  CHANGES(INFORMATION => DEFAULT)
  AT(TIMESTAMP => '2024-01-01 00:00:00'::TIMESTAMP_LTZ);`} />

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <p className="font-bold text-amber-800 mb-1">Stream Staleness</p>
              <p className="text-amber-700">Streams go stale when the offset falls outside the source table's data retention period. Snowflake extends retention up to <strong>14 days max</strong> (or MAX_DATA_EXTENSION_TIME_IN_DAYS) to prevent staleness. A stale stream must be <strong>dropped and recreated</strong>.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <p className="font-bold text-slate-700 mb-1">Multiple Consumers</p>
              <p className="text-slate-600">Create a <strong>separate stream per consumer</strong>. A stream only stores an offset — creating multiple streams on the same table is very low cost. Once a stream's change data is consumed, it's gone for that stream.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'tasks',
      icon: '⏰',
      title: 'Tasks & Task Graphs',
      subtitle: 'Scheduled or triggered SQL automation — build DAG pipelines',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-slate-600">Tasks automate SQL statements, stored procedures, and Snowpark code. They run on a fixed schedule (CRON or interval), or are <strong>triggered</strong> by stream events. Tasks can be chained into a <strong>task graph (DAG)</strong>.</p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Compute</th>
                  <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Best for</th>
                  <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Required privilege</th>
                </tr>
              </thead>
              <tbody>
                {TASK_COMPUTE.map(t => (
                  <tr key={t.type} className="border-b border-slate-100">
                    <td className="p-2 border border-slate-200 font-bold text-teal-700">{t.type}</td>
                    <td className="p-2 border border-slate-200 text-slate-600">{t.when}</td>
                    <td className="p-2 border border-slate-200 font-mono text-slate-500 text-[10px]">{t.priv}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <CodeBlock code={`-- Serverless triggered task (no SCHEDULE, no WAREHOUSE)
CREATE TASK load_triggered
  TARGET_COMPLETION_INTERVAL = '15 MINUTES'  -- serverless sizing hint
  WHEN SYSTEM$STREAM_HAS_DATA('orders_stream')
AS
  INSERT INTO orders_staging SELECT * FROM orders_stream;

-- Scheduled task with WHEN guard
CREATE TASK load_scheduled
  WAREHOUSE = my_wh
  SCHEDULE = 'USING CRON 0 * * * * UTC'     -- every hour
  WHEN SYSTEM$STREAM_HAS_DATA('orders_stream')
AS
  INSERT INTO orders_staging SELECT * FROM orders_stream;

-- Child task (runs after root)
CREATE TASK summarize_task
  AFTER load_scheduled
AS
  MERGE INTO orders_summary ...;

-- Resume child tasks FIRST, then root
ALTER TASK summarize_task RESUME;
ALTER TASK load_scheduled RESUME;

-- OR resume all tasks in a graph at once
SELECT SYSTEM$TASK_DEPENDENTS_ENABLE('load_scheduled');`} />

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-teal-50 rounded-xl p-3 border border-teal-200">
              <p className="font-bold text-teal-800 mb-1">Task Graph features</p>
              <ul className="space-y-0.5 text-teal-700">
                <li>• Max <strong>1000 tasks</strong> per graph; 100 parents/children per task</li>
                <li>• <strong>OVERLAP_POLICY</strong>: NO_OVERLAP (default) / ALLOW_CHILD_OVERLAP / ALLOW_ALL_OVERLAP</li>
                <li>• <strong>Finalizer task</strong>: runs after all tasks complete or fail</li>
                <li>• <strong>TASK_AUTO_RETRY_ATTEMPTS</strong>: auto-retry on failure</li>
                <li>• <strong>SUSPEND_TASK_AFTER_NUM_FAILURES</strong>: default 10</li>
              </ul>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <p className="font-bold text-slate-700 mb-1">Triggered tasks key rules</p>
              <ul className="space-y-0.5 text-slate-600">
                <li>• No SCHEDULE parameter — event-driven only</li>
                <li>• No compute used until stream has data</li>
                <li>• Run at most every <strong>30 seconds</strong> by default</li>
                <li>• Serverless triggered tasks require TARGET_COMPLETION_INTERVAL</li>
                <li>• Health check every 12 h prevents stream staleness</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'dynamic',
      icon: '🔄',
      title: 'Dynamic Tables',
      subtitle: 'Declarative materialized pipeline — define query, Snowflake manages refresh',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-slate-600">Dynamic tables are automatically refreshed based on a query you define. Snowflake handles the refresh schedule to keep data within your specified <strong>target lag</strong> — no custom scheduling code needed.</p>

          <div className="grid sm:grid-cols-2 gap-3 text-xs mb-2">
            <div className="bg-teal-50 rounded-xl p-3 border border-teal-200">
              <p className="font-bold text-teal-800 mb-1">When to use dynamic tables</p>
              <ul className="space-y-0.5 text-teal-700">
                <li>• Materialize query results without custom pipeline code</li>
                <li>• Chain multiple tables for multi-step transformations</li>
                <li>• Only need to specify target freshness (not exact schedule)</li>
                <li>• Slowly Changing Dimensions (SCD Type 1 / 2)</li>
                <li>• Pre-compute slow joins + aggregations incrementally</li>
              </ul>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <p className="font-bold text-slate-700 mb-1">vs. Streams + Tasks</p>
              <ul className="space-y-0.5 text-slate-600">
                <li>• Declarative — no procedural pipeline code</li>
                <li>• Snowflake owns scheduling and execution</li>
                <li>• Incremental processing where supported</li>
                <li>• Immutability constraints keep specific rows static</li>
                <li>• Less control for complex branching / conditional logic</li>
              </ul>
            </div>
          </div>
          <CodeBlock code={`-- Dynamic table with 1-minute target lag
CREATE DYNAMIC TABLE daily_revenue
  TARGET_LAG = '1 minute'      -- data <= 1 min behind base table
  WAREHOUSE = my_wh
AS
  SELECT
    DATE_TRUNC('day', order_date) AS order_day,
    SUM(amount)                   AS total_revenue
  FROM raw_orders
  GROUP BY 1;

-- Chain dynamic tables (downstream depends on upstream)
CREATE DYNAMIC TABLE revenue_summary
  TARGET_LAG = '5 minutes'
  WAREHOUSE = my_wh
AS SELECT * FROM daily_revenue WHERE total_revenue > 1000;

-- Manually trigger a refresh
ALTER DYNAMIC TABLE daily_revenue REFRESH;

-- Suspend / resume
ALTER DYNAMIC TABLE daily_revenue SUSPEND;
ALTER DYNAMIC TABLE daily_revenue RESUME;`} />
        </div>
      ),
    },
    {
      id: 'openflow',
      icon: '🔀',
      title: 'Openflow',
      subtitle: 'Generally Available — built on Apache NiFi; exam may include basic awareness',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-slate-600">Snowflake Openflow is a fully managed integration service built on <strong>Apache NiFi</strong> that connects any data source to any destination, handling structured and unstructured data in both batch and streaming modes.</p>

          <div className="grid sm:grid-cols-2 gap-3 text-xs mb-2">
            <div className="bg-teal-50 rounded-xl p-3 border border-teal-200">
              <p className="font-bold text-teal-800 mb-1">Snowflake Deployment (SPCS)</p>
              <p className="text-teal-700">Runs inside Snowpark Container Services. Snowflake manages the infrastructure. Available on AWS + Azure commercial regions. Easiest to deploy and operate — native Snowflake security.</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <p className="font-bold text-slate-700 mb-1">BYOC (Bring Your Own Cloud)</p>
              <p className="text-slate-600">Openflow data plane runs in your own VPC (AWS commercial). You control the environment; Snowflake manages the control plane. Suitable for private/sensitive data preprocessing.</p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <p className="font-bold text-slate-700 mb-1">Key use cases</p>
            <ul className="space-y-0.5 text-slate-600">
              <li>• CDC replication from databases (MySQL, PostgreSQL, Oracle, SQL Server) into Snowflake</li>
              <li>• Real-time event ingestion from Apache Kafka, Kinesis, etc.</li>
              <li>• Unstructured data ingestion from Google Drive, Box, SharePoint for AI/Cortex</li>
              <li>• SaaS platform ingestion (Salesforce, LinkedIn Ads, Jira, Workday)</li>
            </ul>
          </div>
          <p className="text-xs text-amber-700 bg-amber-50 rounded-lg p-2 border border-amber-200">📋 The Domain 3 guide notes Openflow <em>"will not be tested until it's globally GA"</em>. It is now GA on AWS + Azure commercial regions. Expect basic awareness questions on the exam.</p>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <InfoCard>
        <SectionHeader
          icon={Zap}
          color="bg-teal-700"
          title="3.2 Automated Data Ingestion"
          subtitle="Snowpipe · Snowpipe Streaming · Streams · Tasks · Dynamic Tables · Openflow"
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
        <p>• <strong>Snowpipe load history</strong> = 14 days (pipe metadata). Bulk COPY load history = 64 days (table metadata).</p>
        <p>• <strong>Snowpipe REST API</strong> requires key-pair authentication + JWT — standard session auth is NOT supported.</p>
        <p>• <strong>Snowpipe Streaming</strong>: two architectures — high-performance (new PIPE-based, throughput pricing) vs classic (table-channel, compute pricing). High-perf is recommended for new projects.</p>
        <p>• Streams are <strong>offset pointers, not data</strong>. Offset advances ONLY on DML transaction commit, not on plain SELECT.</p>
        <p>• <strong>Updates</strong> in a standard stream appear as a DELETE + INSERT pair with METADATA$ISUPDATE = TRUE.</p>
        <p>• Snowflake extends stream source retention up to <strong>14 days max</strong> to prevent staleness. A stale stream must be recreated.</p>
        <p>• Tasks are created <strong>SUSPENDED</strong>. For a DAG: resume child tasks first, then the root (or use SYSTEM$TASK_DEPENDENTS_ENABLE).</p>
        <p>• <strong>Triggered tasks</strong> use WHEN clause + no SCHEDULE. No compute used until stream fires. Serverless triggered tasks require TARGET_COMPLETION_INTERVAL.</p>
        <p>• <strong>Dynamic Tables</strong>: specify target lag, Snowflake owns the schedule. Supports incremental refresh where possible. Ideal for SCDs and pre-computed aggregations.</p>
      </ExamTip>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// LEARNING TAB 3 — 3.3 Connectors & Integrations
// Covers: Drivers, Connectors, Storage Integration, API Integration, Git Integration
// ═══════════════════════════════════════════════════════════════════════════════

const DRIVERS = [
  {
    name: 'JDBC Driver',
    lang: 'Java / JVM',
    use: 'BI tools, Java apps, enterprise integrations (Tableau, Informatica)',
    note: 'Standard JDBC interface. Used by most BI and ETL tools. Supports TLS 1.2 and TLS 1.3.',
  },
  {
    name: 'ODBC Driver',
    lang: 'Any platform (Windows / macOS / Linux)',
    use: 'Excel, Power BI, generic SQL client tools',
    note: 'Open Database Connectivity standard. Widely supported. Supports TLS 1.2 and TLS 1.3.',
  },
  {
    name: 'Snowflake Connector for Python',
    lang: 'Python',
    use: 'Data engineering scripts, pandas, Snowpark, notebooks',
    note: 'pip install snowflake-connector-python. Supports cursor API and pandas DataFrame integration. Supports TLS 1.2 and TLS 1.3.',
  },
  {
    name: '.NET Driver',
    lang: 'C# / .NET',
    use: '.NET apps, Azure integrations, ADO.NET clients',
    note: 'NuGet package. TLS 1.3 supported on Windows (.NET 3.0+ / .NET Framework 4.8+). macOS support pending .NET 10.',
  },
  {
    name: 'Go Snowflake Driver',
    lang: 'Go (Golang)',
    use: 'Cloud-native microservices, high-throughput pipelines',
    note: 'gosnowflake module. Full standard operations support. Supports TLS 1.2 and TLS 1.3.',
  },
  {
    name: 'Node.js Driver',
    lang: 'JavaScript / Node.js',
    use: 'Server-side JS apps, REST APIs that query Snowflake',
    note: 'npm package snowflake-sdk. Native asynchronous interface. Supports TLS 1.2 and TLS 1.3.',
  },
  {
    name: 'PHP PDO Driver',
    lang: 'PHP',
    use: 'PHP web applications, legacy enterprise apps',
    note: 'PHP Data Objects (PDO) interface. Supports all standard Snowflake operations. Supports TLS 1.2 and TLS 1.3.',
  },
];

const NATIVE_CONNECTORS = [
  {
    name: 'Kafka Connector',
    icon: '📨',
    desc: 'Streams data from Apache Kafka topics directly into Snowflake tables. Uses Snowpipe or Snowpipe Streaming under the hood — no manual file staging required. Also available as a high-performance variant.',
    key: 'Supports Avro and JSON. Auto-creates target tables. Configurable batch size and flush interval.',
    code: `-- Configured via Kafka Connect worker properties (no SQL):
-- snowflake.topic2table.map = my-topic:my_table
-- snowflake.ingestion.method = SNOWPIPE_STREAMING`,
  },
  {
    name: 'Spark Connector',
    icon: '⚡',
    desc: 'Integrates Apache Spark with Snowflake for high-throughput reads and writes. Data is staged in cloud storage and bulk-loaded via COPY INTO. Supports push-down of Spark SQL to the Snowflake engine.',
    key: 'Optimized for bulk loads from Spark. Predicate and projection push-down to Snowflake reduces data transfer.',
    code: `val df = spark.read
  .format("snowflake")
  .options(sfOptions)
  .option("dbtable", "ORDERS")
  .load()`,
  },
  {
    name: 'Snowflake Connector for ServiceNow®',
    icon: '🎫',
    desc: 'Ingests ServiceNow table data into Snowflake automatically. Supports initial historical load and incremental changes. Deployed as a Native App.',
    key: 'Auto-refreshes data on your configured schedule. Managed via Snowsight.',
    code: `-- Deployed as a Native App from Snowflake Marketplace
-- No SQL DDL required; configured through Snowsight UI`,
  },
  {
    name: 'Snowflake Connectors for MySQL / PostgreSQL',
    icon: '🗄️',
    desc: 'Load data from MySQL or PostgreSQL databases into Snowflake. Supports initial snapshot and ongoing CDC (change data capture) replication. Deployed as Native Apps.',
    key: 'Supports both full load and incremental replication. Each connector is a separate Native App.',
    code: `-- Deployed as Native Apps; configured in Snowsight
-- Supports initial load + CDC replication`,
  },
  {
    name: 'dbt (Data Build Tool)',
    icon: '🔧',
    desc: 'Transforms data already in Snowflake using SQL SELECT statements. Manages model dependencies and runs incremental or full-refresh transformations. Connects via the Snowflake Python connector.',
    key: 'dbt is a transformation tool, not an ingestion tool. Runs inside Snowflake — no data leaves the platform.',
    code: `-- dbt model (models/orders_summary.sql)
{{ config(materialized='incremental') }}
SELECT customer_id, SUM(amount) AS total
FROM {{ ref('raw_orders') }}
GROUP BY 1`,
  },
];

const INTEGRATIONS = [
  {
    id: 'storage',
    name: 'Storage Integration',
    icon: '☁️',
    desc: 'An account-level Snowflake object that stores a generated IAM entity (AWS IAM role, GCS service account, Azure service principal) for accessing external cloud storage. Removes the need to embed credentials in stage definitions.',
    providers: [
      { cloud: 'Amazon S3', param: "STORAGE_PROVIDER = 'S3'", extra: 'STORAGE_AWS_ROLE_ARN required. Use S3CHINA for China regions, S3GOV for US GovCloud.' },
      { cloud: 'Google Cloud Storage', param: "STORAGE_PROVIDER = 'GCS'", extra: 'No extra credentials — uses GCS service account generated by Snowflake.' },
      { cloud: 'Microsoft Azure', param: "STORAGE_PROVIDER = 'AZURE'", extra: 'AZURE_TENANT_ID required. Supports Azure Blob, ADLS Gen2, Fabric OneLake.' },
    ],
    warn: "⚠️ CREATE OR REPLACE STORAGE INTEGRATION breaks all existing stage links (stages link by hidden ID, not name). Must re-run ALTER STAGE … SET STORAGE_INTEGRATION to relink.",
    code: `-- S3 example: restrict to specific paths
CREATE STORAGE INTEGRATION my_s3_int
  TYPE = EXTERNAL_STAGE
  STORAGE_PROVIDER = 'S3'
  STORAGE_AWS_ROLE_ARN = 'arn:aws:iam::123456789:role/snowflake-role'
  ENABLED = TRUE
  STORAGE_ALLOWED_LOCATIONS = ('s3://my-bucket/data/', 's3://my-bucket/exports/')
  STORAGE_BLOCKED_LOCATIONS = ('s3://my-bucket/sensitive/');  -- optional block list

-- Reference in a stage (no keys ever in the stage definition)
CREATE STAGE my_ext_stage
  URL = 's3://my-bucket/data/'
  STORAGE_INTEGRATION = my_s3_int;

-- Check the generated IAM identity to configure trust in AWS
DESC INTEGRATION my_s3_int;  -- shows STORAGE_AWS_IAM_USER_ARN`,
  },
  {
    id: 'api',
    name: 'API Integration',
    icon: '🔗',
    desc: 'Stores authentication credentials and allowed endpoints for two use cases: (1) External Functions that call HTTPS proxy services (AWS API Gateway, Azure API Management, GCS API Gateway), and (2) Git repository access (API_PROVIDER = git_https_api).',
    providers: [
      { cloud: 'AWS API Gateway', param: 'API_PROVIDER = aws_api_gateway', extra: 'API_AWS_ROLE_ARN required. Also supports aws_private_api_gateway, aws_gov_api_gateway.' },
      { cloud: 'Azure API Management', param: 'API_PROVIDER = azure_api_management', extra: 'AZURE_TENANT_ID + AZURE_AD_APPLICATION_ID required.' },
      { cloud: 'Google Cloud API Gateway', param: 'API_PROVIDER = google_api_gateway', extra: 'GOOGLE_AUDIENCE (JWT audience claim) required.' },
      { cloud: 'Git repository', param: 'API_PROVIDER = git_https_api', extra: 'Used with CREATE GIT REPOSITORY. Supports personal access token, GitHub App, or OAuth2.' },
    ],
    warn: '💡 API integration requires CREATE INTEGRATION privilege — only ACCOUNTADMIN by default. API_ALLOWED_PREFIXES is required and treated as URL prefixes (all resources under that path are allowed).',
    code: `-- External Function integration (AWS)
CREATE API INTEGRATION my_api_int
  API_PROVIDER = aws_api_gateway
  API_AWS_ROLE_ARN = 'arn:aws:iam::123456789:role/my-role'
  API_ALLOWED_PREFIXES = ('https://xyz.execute-api.us-east-1.amazonaws.com/prod/')
  ENABLED = TRUE;

-- External function that calls a REST API from SQL
CREATE EXTERNAL FUNCTION score_customer(id NUMBER)
  RETURNS VARIANT
  API_INTEGRATION = my_api_int
  AS 'https://xyz.execute-api.us-east-1.amazonaws.com/prod/score';

-- Git integration (separate API_PROVIDER value)
CREATE API INTEGRATION git_api_int
  API_PROVIDER = git_https_api
  API_ALLOWED_PREFIXES = ('https://github.com/my-org/')
  ENABLED = TRUE;`,
  },
  {
    id: 'git',
    name: 'Git Integration',
    icon: '🔀',
    desc: 'Synchronizes a remote Git repository to a full local clone inside Snowflake (all branches, tags, commits). The Git repository clone acts like a named stage — files can be referenced in stored procedures, UDFs, and tasks.',
    platforms: ['GitHub', 'GitLab', 'Bitbucket', 'Azure DevOps', 'AWS CodeCommit'],
    warn: '📌 Writing back to the remote repository is only supported from Workspaces, Streamlit apps, and Snowflake Notebooks — not from tasks or stored procedures.',
    code: `-- 1. Create API integration for Git (requires ACCOUNTADMIN)
CREATE API INTEGRATION git_api_int
  API_PROVIDER = git_https_api
  API_ALLOWED_PREFIXES = ('https://github.com/my-org/')
  ALLOWED_AUTHENTICATION_SECRETS = ALL
  ENABLED = TRUE;

-- 2. Create Git repository (full clone of remote)
CREATE GIT REPOSITORY my_repo
  API_INTEGRATION = git_api_int
  GIT_CREDENTIALS = my_github_secret    -- personal access token secret
  ORIGIN = 'https://github.com/my-org/my-repo.git';

-- 3. Fetch latest changes from remote
ALTER GIT REPOSITORY my_repo FETCH;

-- 4. Reference files from any branch (like a stage)
EXECUTE IMMEDIATE FROM @my_repo/branches/main/scripts/init.sql;

-- 5. Use repo files as handler code for UDFs/procedures
CREATE PROCEDURE my_proc()
  RETURNS STRING
  LANGUAGE PYTHON RUNTIME_VERSION = '3.11'
  IMPORTS = ('@my_repo/branches/main/src/utils.py')
  HANDLER = 'utils.run';

-- Other DDL
SHOW GIT REPOSITORIES;
SHOW GIT BRANCHES IN GIT REPOSITORY my_repo;
SHOW GIT TAGS IN GIT REPOSITORY my_repo;`,
  },
];

const ConnectorsTab = () => {
  const [openDriver,    setOpenDriver]    = useState(null);
  const [openConnector, setOpenConnector] = useState(null);
  const [openInt,       setOpenInt]       = useState(null);

  return (
    <div className="space-y-5">
      {/* Drivers */}
      <InfoCard>
        <SectionHeader
          icon={Plug}
          color="bg-teal-700"
          title="3.3 Connectors & Integrations"
          subtitle="Drivers · Connectors · Storage / API / Git integrations"
        />

        <h3 className="font-bold text-slate-700 mb-2">Snowflake Drivers</h3>
        <p className="text-xs text-slate-500 mb-3">Drivers let applications connect to Snowflake using standard protocols (JDBC, ODBC) or language-native packages. All drivers support TLS 1.2 and TLS 1.3 (except .NET on macOS, pending .NET 10).</p>
        <div className="space-y-2">
          {DRIVERS.map((d, i) => (
            <div key={d.name} className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-4 py-3 text-left bg-slate-50 hover:bg-slate-100 transition-colors"
                onClick={() => setOpenDriver(openDriver === i ? null : i)}
              >
                <div className="flex items-center gap-3">
                  <HardDrive className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span className="font-semibold text-slate-700 text-sm">{d.name}</span>
                  <span className="text-xs text-slate-400 hidden sm:block">{d.lang}</span>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${openDriver === i ? 'rotate-90' : ''}`} />
              </button>
              {openDriver === i && (
                <div className="px-4 pb-3 pt-2 bg-white space-y-1">
                  <p className="text-xs font-bold text-teal-700">Use case: {d.use}</p>
                  <p className="text-sm text-slate-600">{d.note}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </InfoCard>

      {/* Connectors */}
      <InfoCard>
        <h3 className="font-bold text-slate-700 mb-2">Snowflake Connectors</h3>
        <p className="text-xs text-slate-500 mb-3">Native Snowflake Connectors provide turnkey integration for popular tools and databases. They handle initial historical loads plus incremental changes — no manual API coding required. Most modern connectors are deployed as <strong>Native Apps</strong> from Snowflake Marketplace.</p>
        <div className="space-y-2">
          {NATIVE_CONNECTORS.map((c, i) => (
            <div key={c.name} className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-4 py-3 text-left bg-slate-50 hover:bg-slate-100 transition-colors"
                onClick={() => setOpenConnector(openConnector === i ? null : i)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{c.icon}</span>
                  <span className="font-semibold text-slate-700 text-sm">{c.name}</span>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${openConnector === i ? 'rotate-90' : ''}`} />
              </button>
              {openConnector === i && (
                <div className="px-4 pb-4 pt-2 bg-white space-y-2">
                  <p className="text-sm text-slate-600">{c.desc}</p>
                  <p className="text-xs text-teal-700 font-semibold">{c.key}</p>
                  <CodeBlock code={c.code} />
                </div>
              )}
            </div>
          ))}
        </div>
      </InfoCard>

      {/* Integrations */}
      <InfoCard>
        <h3 className="font-bold text-slate-700 mb-2">Storage, API & Git Integrations</h3>
        <p className="text-xs text-slate-500 mb-3">Integration objects are <strong>account-level</strong> Snowflake objects that store credentials and endpoint definitions securely — keeping secrets out of stage, function, and repository definitions. Creating integrations requires the <span className="font-mono font-bold">CREATE INTEGRATION</span> privilege (ACCOUNTADMIN by default).</p>
        <div className="space-y-2">
          {INTEGRATIONS.map((int, i) => (
            <div key={int.id} className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-4 py-3 text-left bg-slate-50 hover:bg-slate-100 transition-colors"
                onClick={() => setOpenInt(openInt === i ? null : i)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{int.icon}</span>
                  <span className="font-semibold text-slate-700 text-sm">{int.name}</span>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${openInt === i ? 'rotate-90' : ''}`} />
              </button>
              {openInt === i && (
                <div className="px-4 pb-4 pt-2 bg-white space-y-3">
                  <p className="text-sm text-slate-600">{int.desc}</p>

                  {int.providers && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50">
                            <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Cloud / Provider</th>
                            <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Key parameter</th>
                            <th className="text-left p-2 font-bold text-slate-600 border border-slate-200">Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {int.providers.map(p => (
                            <tr key={p.cloud} className="border-b border-slate-100 hover:bg-slate-50">
                              <td className="p-2 border border-slate-200 font-bold text-teal-700">{p.cloud}</td>
                              <td className="p-2 border border-slate-200 font-mono text-slate-600 text-[11px]">{p.param}</td>
                              <td className="p-2 border border-slate-200 text-slate-500">{p.extra}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {int.platforms && (
                    <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 text-xs">
                      <p className="font-bold text-teal-800 mb-1">Supported Git platforms</p>
                      <div className="flex flex-wrap gap-2">
                        {int.platforms.map(p => (
                          <span key={p} className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-medium">{p}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-amber-700 bg-amber-50 rounded-lg p-2 border border-amber-200">{int.warn}</p>
                  <CodeBlock code={int.code} />
                </div>
              )}
            </div>
          ))}
        </div>
      </InfoCard>

      <ExamTip>
        <p>• Official Snowflake drivers: <strong>JDBC, ODBC, Python, .NET, Go, Node.js, PHP PDO</strong> — all support TLS 1.2 and TLS 1.3.</p>
        <p>• <strong>Kafka Connector</strong> uses Snowpipe or Snowpipe Streaming under the hood — no manual staging required.</p>
        <p>• <strong>Storage integration</strong> stores an IAM entity (not keys) at the account level. The URL in every stage using it must fall within STORAGE_ALLOWED_LOCATIONS.</p>
        <p>• <strong>CREATE OR REPLACE STORAGE INTEGRATION</strong> breaks existing stage links — must ALTER STAGE … SET STORAGE_INTEGRATION to relink all affected stages.</p>
        <p>• <strong>API integration</strong> is required for both External Functions and Git repository access. API_ALLOWED_PREFIXES acts as a URL prefix — all sub-paths are allowed.</p>
        <p>• <strong>Git integration</strong> = API integration (API_PROVIDER = git_https_api) + CREATE GIT REPOSITORY. Supported platforms: GitHub, GitLab, Bitbucket, Azure DevOps, AWS CodeCommit.</p>
        <p>• Git repository files are accessed like a named stage. <strong>Writing back to remote</strong> is only supported from Workspaces, Streamlit apps, and Notebooks.</p>
        <p>• All integration objects require <strong>CREATE INTEGRATION</strong> privilege — only ACCOUNTADMIN has it by default.</p>
      </ExamTip>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// QUIZ — Data & challenge components
// ═══════════════════════════════════════════════════════════════════════════════

const LOADING_QUIZ_DATA = [
  {
    q: 'A user uploads a CSV file and wants to load it only into their own tables without creating a named stage. Which stage type should they use?',
    options: ['Named internal stage', 'External stage (S3)', 'User stage (@~)', 'Table stage (@%table)'],
    answer: 'User stage (@~)',
    exp: 'Every Snowflake user automatically has a personal user stage (@~). It is private and requires no CREATE STAGE command — perfect for personal quick loads.',
  },
  {
    q: 'A team of engineers all need to load data into the ORDERS table. They want to share a staging area without creating a named stage. What is the best option?',
    options: ['User stage for each engineer', 'Table stage @%orders', 'External stage pointing to S3', 'Create a named internal stage'],
    answer: 'Table stage @%orders',
    exp: 'The table stage @%orders is accessible by anyone with WRITE privilege on that table — perfect for team-shared loading without creating a separate named stage.',
  },
  {
    q: 'You run COPY INTO and one file contains 3 bad rows out of 10,000. With the default ON_ERROR setting, what happens?',
    options: [
      'The 3 bad rows are skipped; 9,997 rows are loaded',
      'The entire COPY command is aborted — no rows are loaded',
      'The file is skipped; other files are still loaded',
      'Snowflake logs a warning and loads all rows including the bad ones',
    ],
    answer: 'The entire COPY command is aborted — no rows are loaded',
    exp: 'Default ON_ERROR = ABORT_STATEMENT. Any error aborts the entire COPY statement immediately. To skip bad rows use ON_ERROR = CONTINUE; to skip bad files use SKIP_FILE.',
  },
  {
    q: 'A COPY INTO job should skip a file entirely if more than 5% of its rows have errors. Which ON_ERROR setting achieves this?',
    options: ['ON_ERROR = SKIP_FILE', 'ON_ERROR = SKIP_FILE_5%', 'ON_ERROR = CONTINUE', 'ON_ERROR = ABORT_STATEMENT'],
    answer: 'ON_ERROR = SKIP_FILE_5%',
    exp: 'SKIP_FILE_<n>% skips the entire file when the error percentage in that file reaches n%. SKIP_FILE (without a number) skips on the first error, not a percentage threshold.',
  },
  {
    q: 'You want to load JSON data where the top-level structure is an array of objects. Each object should become a separate row. Which file format option do you set?',
    options: [
      'TYPE = JSON with STRIP_OUTER_ARRAY = TRUE',
      'TYPE = JSON with NULL_IF = (\'[]\')',
      'TYPE = PARQUET',
      'TYPE = JSON with FIELD_DELIMITER = \',\'',
    ],
    answer: 'TYPE = JSON with STRIP_OUTER_ARRAY = TRUE',
    exp: 'STRIP_OUTER_ARRAY = TRUE unwraps the outer JSON array so each element becomes an individual row in the target VARIANT column — a very common exam scenario.',
  },
  {
    q: 'After a successful COPY INTO, you want staged files to be automatically deleted from the internal stage. Which COPY option enables this?',
    options: ['FORCE = TRUE', 'PURGE = TRUE', 'OVERWRITE = TRUE', 'AUTO_INGEST = TRUE'],
    answer: 'PURGE = TRUE',
    exp: 'PURGE = TRUE deletes staged files from the stage after they are successfully loaded. This keeps storage costs down and avoids confusion about which files have already been processed.',
  },
  {
    q: 'A directory table is created on a stage. What is its primary purpose?',
    options: [
      'To store the actual data loaded into Snowflake tables',
      'To maintain a catalog of staged files with metadata (path, size, etag)',
      'To provide automatic compression of staged files',
      'To enforce row-level security on staged data',
    ],
    answer: 'To maintain a catalog of staged files with metadata (path, size, etag)',
    exp: 'A directory table is an additional object on a stage that catalogs the staged files — their path, size, last_modified timestamp, and etag. You query it with SELECT * FROM DIRECTORY(@stage_name).',
  },
  {
    q: 'Which file format is best suited for loading data coming from a Kafka pipeline where schema is embedded in the data file itself?',
    options: ['CSV', 'JSON', 'Avro', 'XML'],
    answer: 'Avro',
    exp: 'Avro is a row-based format that embeds the schema within the file itself (via Avro schema). It is the standard format in Kafka pipelines and is natively supported by the Snowflake Kafka Connector.',
  },
];

const INGESTION_QUIZ_DATA = [
  {
    q: 'New files arrive in an S3 bucket every few minutes. You need them auto-loaded into Snowflake without managing a warehouse. Which feature should you use?',
    options: ['Scheduled COPY INTO task', 'Snowpipe with AUTO_INGEST = TRUE', 'Snowpipe Streaming', 'Dynamic Table with low target lag'],
    answer: 'Snowpipe with AUTO_INGEST = TRUE',
    exp: 'Snowpipe with AUTO_INGEST = TRUE uses S3 event notifications (SQS) to automatically trigger file loading as soon as files land. No warehouse management — it is serverless.',
  },
  {
    q: 'A sensor network sends row-level events that must appear in Snowflake within 1 second. Which ingestion method is most appropriate?',
    options: ['Snowpipe (file-based)', 'COPY INTO from external stage', 'Snowpipe Streaming (SDK row-level)', 'Dynamic Table with 1-minute lag'],
    answer: 'Snowpipe Streaming (SDK row-level)',
    exp: 'Snowpipe Streaming uses the Ingest SDK to write rows directly with sub-second latency. No file staging required. Regular Snowpipe is file-based with minutes latency.',
  },
  {
    q: 'You create a stream on a table, then read from it in a SELECT statement (no transaction). Does the stream offset advance?',
    options: [
      'Yes — any SELECT from the stream advances the offset',
      'No — the offset only advances when the stream is consumed inside a DML transaction',
      'Yes — but only if the SELECT returns at least one row',
      'No — streams cannot be queried with SELECT',
    ],
    answer: 'No — the offset only advances when the stream is consumed inside a DML transaction',
    exp: 'Stream offsets only advance when the stream is consumed in a DML statement (INSERT, MERGE, UPDATE) inside an explicit transaction. A plain SELECT does NOT advance the offset.',
  },
  {
    q: 'Which stream type should you use on a table that only ever has rows appended (no updates or deletes), to minimize overhead?',
    options: ['Standard stream', 'Append-only stream', 'Insert-only stream', 'CDC stream'],
    answer: 'Append-only stream',
    exp: 'Append-only streams track only INSERT operations and ignore UPDATE/DELETE. They have lower overhead than standard streams, which must track all DML change types.',
  },
  {
    q: 'You create a task and execute it immediately. It appears to do nothing. What is the most likely reason?',
    options: [
      'The task SQL has a syntax error',
      'Tasks require a virtual warehouse to be defined first',
      'Tasks are created in SUSPENDED state and must be RESUMEd before they run',
      'Tasks can only run on a CRON schedule, not immediately',
    ],
    answer: 'Tasks are created in SUSPENDED state and must be RESUMEd before they run',
    exp: 'All tasks are created in SUSPENDED state by default. You must run ALTER TASK <name> RESUME before the task begins executing on its schedule.',
  },
  {
    q: 'A task has a WHEN clause: WHEN SYSTEM$STREAM_HAS_DATA(\'my_stream\'). The schedule fires but the stream is empty. What happens?',
    options: [
      'The task SQL still executes — WHEN is just a hint',
      'The task is skipped for this run — no compute is used',
      'The task fails with an error',
      'The task suspends itself automatically',
    ],
    answer: 'The task is skipped for this run — no compute is used',
    exp: 'The WHEN clause is a pre-condition. If SYSTEM$STREAM_HAS_DATA() returns FALSE, Snowflake skips the task run entirely and no warehouse credits are consumed.',
  },
  {
    q: 'What is "target lag" in the context of Dynamic Tables?',
    options: [
      'The delay between writing and reading data in a stream',
      'The maximum acceptable age of the data in the dynamic table vs. its base objects',
      'The time it takes Snowflake to compile the dynamic table query',
      'The retention window for Time Travel on the dynamic table',
    ],
    answer: 'The maximum acceptable age of the data in the dynamic table vs. its base objects',
    exp: 'Target lag defines how stale the dynamic table\'s data is allowed to be compared to its base tables. Snowflake automatically schedules refreshes to keep the table within the target lag window.',
  },
  {
    q: 'A stream on a table becomes stale. What must you do to resume CDC tracking?',
    options: [
      'Run ALTER STREAM my_stream RESUME',
      'Drop and recreate the stream',
      'Run SYSTEM$REFRESH_STREAM(\'my_stream\')',
      'Extend the Time Travel retention on the stream',
    ],
    answer: 'Drop and recreate the stream',
    exp: 'A stale stream cannot be recovered. The offset has fallen outside the source table\'s Time Travel window. You must DROP and recreate the stream — losing any unprocessed changes.',
  },
];

const CONNECTORS_QUIZ_DATA = [
  {
    q: 'A Java-based ETL application needs to connect to Snowflake using the standard relational database protocol supported by all JVM apps. Which driver should it use?',
    options: ['ODBC Driver', 'JDBC Driver', 'Python Connector', 'Node.js Driver'],
    answer: 'JDBC Driver',
    exp: 'JDBC (Java Database Connectivity) is the standard protocol for JVM-based apps. The Snowflake JDBC driver is used by Java apps, Spark (legacy mode), and many BI tools running on the JVM.',
  },
  {
    q: 'A data analyst uses Power BI on Windows to connect to Snowflake. Which driver is most appropriate?',
    options: ['JDBC Driver', 'Python Connector', 'ODBC Driver', 'Node.js Driver'],
    answer: 'ODBC Driver',
    exp: 'ODBC (Open Database Connectivity) is the standard on Windows platforms and is used by Excel, Power BI, and most Windows-native analytics tools.',
  },
  {
    q: 'An engineering team uses Apache Kafka to stream events. They want events to land in Snowflake tables automatically. Which component handles this?',
    options: ['Spark Connector', 'Kafka Connector', 'Python Connector', 'Snowflake JDBC Driver'],
    answer: 'Kafka Connector',
    exp: 'The Snowflake Kafka Connector bridges Kafka topics directly to Snowflake tables using Snowpipe or Snowpipe Streaming under the hood. No manual staging or COPY commands needed.',
  },
  {
    q: 'You want to load data from an S3 bucket into Snowflake without embedding AWS access keys in the stage definition. What Snowflake object stores the cloud credentials securely?',
    options: ['External stage with inline credentials', 'Storage integration', 'API integration', 'Network policy'],
    answer: 'Storage integration',
    exp: 'A storage integration is an account-level object that stores the cloud credentials and IAM role ARN for external storage. External stages reference it by name — no embedded secrets.',
  },
  {
    q: 'You need to call an AWS Lambda function from within a Snowflake SQL query and return the result. Which Snowflake objects are required?',
    options: [
      'External function + API integration',
      'External stage + storage integration',
      'UDF + network policy',
      'Task + API integration',
    ],
    answer: 'External function + API integration',
    exp: 'External functions invoke external REST APIs (e.g., Lambda via API Gateway) from SQL. An API integration object stores the endpoint configuration. Together they allow SQL → REST → Lambda calls.',
  },
  {
    q: 'A team wants to deploy Snowpark stored procedures directly from their GitHub repository without manually uploading files. Which integration enables this?',
    options: ['Storage integration pointing to GitHub', 'Git integration + Git repository stage', 'API integration with GitHub REST API', 'Kafka Connector'],
    answer: 'Git integration + Git repository stage',
    exp: 'The Git integration creates a secure connection to a Git repository. A Git repository stage then acts as a named stage backed by the repo — files can be referenced and executed directly from it.',
  },
  {
    q: 'dbt (Data Build Tool) is used to transform data in Snowflake. Which Snowflake driver does dbt use to connect?',
    options: ['JDBC Driver', 'Kafka Connector', 'Python Connector (snowflake-connector-python)', 'ODBC Driver'],
    answer: 'Python Connector (snowflake-connector-python)',
    exp: 'dbt Core and dbt Cloud connect to Snowflake using the dbt-snowflake adapter, which uses the Snowflake Python connector (snowflake-connector-python) under the hood.',
  },
  {
    q: 'Which statement about the Spark Connector is correct?',
    options: [
      'It uses Snowpipe Streaming for row-level writes',
      'It stages data in cloud storage and uses COPY INTO for bulk reads/writes',
      'It connects via ODBC for compatibility with Spark SQL',
      'It is only supported on AWS, not Azure or GCP',
    ],
    answer: 'It stages data in cloud storage and uses COPY INTO for bulk reads/writes',
    exp: 'The Snowflake Spark Connector optimizes throughput by staging data in cloud storage (S3/Azure/GCS) and using COPY INTO for bulk transfers — not row-by-row inserts. It also supports query push-down.',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// QUIZ — Challenge data arrays
// ═══════════════════════════════════════════════════════════════════════════════

// ── 3.1a  Stage Classifier data ───────────────────────────────────────────────
const STAGE_CLASSIFIER_DATA = [
  { text: 'Auto-created for every user — cannot be dropped, altered, or shared', answer: 'User (@~)', hint: '@~ is private and always exists — no DDL needed.' },
  { text: 'Referenced with @~ and stores files privately for the owning user only', answer: 'User (@~)', hint: 'The ~ symbol denotes the current user\'s personal stage.' },
  { text: 'Auto-created for every table — accessible to anyone with table privileges', answer: 'Table (@%)', hint: '@%tablename is the table\'s own staging area, shared by all table-privilege holders.' },
  { text: 'Referenced with @%table_name — no CREATE STAGE command needed', answer: 'Table (@%)', hint: 'The % prefix denotes a table stage that is auto-provisioned.' },
  { text: 'Explicitly created with CREATE STAGE — supports custom file formats and encryption', answer: 'Named Internal', hint: 'Named internal stages require DDL and are the standard for production pipelines.' },
  { text: 'The only internal stage type that supports SNOWFLAKE_SSE and can be shared across roles', answer: 'Named Internal', hint: 'SNOWFLAKE_SSE is set at stage creation and cannot be changed afterwards.' },
  { text: 'Points to an S3 bucket, Azure Blob, or GCS path — requires a URL parameter', answer: 'Named External', hint: 'External stages reference cloud storage outside Snowflake via a URL.' },
  { text: 'Used with AUTO_INGEST = TRUE so Snowpipe reacts to new cloud file events', answer: 'Named External', hint: 'Snowpipe auto-ingest monitors an external stage path via SQS/Event Grid/Pub Sub.' },
];
const STAGE_OPTIONS = ['User (@~)', 'Table (@%)', 'Named Internal', 'Named External'];
const STAGE_COLORS  = {
  'User (@~)':      'border-teal-300 bg-teal-50 text-teal-800',
  'Table (@%)':     'border-blue-300 bg-blue-50 text-blue-800',
  'Named Internal': 'border-violet-300 bg-violet-50 text-violet-800',
  'Named External': 'border-amber-300 bg-amber-50 text-amber-800',
};

// ── 3.1b  File Format Matcher data ────────────────────────────────────────────
const FORMAT_MATCH_DATA = [
  { text: 'Load only — embeds its own schema inside the binary file; standard for Kafka pipelines', answer: 'Avro', hint: 'Avro is row-based binary with self-describing schema — load only.' },
  { text: 'Unloads as NDJSON — one JSON object per line, NOT a top-level array', answer: 'JSON', hint: 'JSON unloads as newline-delimited JSON (NDJSON). Not a JSON array.' },
  { text: 'Columnar binary — supports load and unload with SNAPPY_COMPRESSION', answer: 'Parquet', hint: 'Parquet is the only columnar format that supports both load and unload.' },
  { text: 'Most common format for tabular data — supports SKIP_HEADER and PARSE_HEADER', answer: 'CSV', hint: 'CSV is the most widely used format. PARSE_HEADER auto-detects column names.' },
  { text: 'Load only — STRIP_OUTER_ELEMENT splits 2nd-level elements into individual rows', answer: 'XML', hint: 'XML loads into VARIANT. STRIP_OUTER_ELEMENT is key for multi-row XML files.' },
  { text: 'Load only — Optimized Row Columnar format from the Hadoop/Hive ecosystem', answer: 'ORC', hint: 'ORC is load-only and originates from Hadoop.' },
  { text: 'Supports FIELD_OPTIONALLY_ENCLOSED_BY to handle quoted text containing delimiters', answer: 'CSV', hint: 'FIELD_OPTIONALLY_ENCLOSED_BY is a CSV-specific option for quoted fields.' },
  { text: 'Binary row-based format — rows and schema embedded; row-level delta via streams', answer: 'Avro', hint: 'Avro is row-based binary. Only standard for Kafka → Snowpipe.' },
];
const FORMAT_OPTIONS = ['CSV', 'JSON', 'Parquet', 'Avro', 'ORC', 'XML'];
const FORMAT_COLORS  = {
  'CSV':     'border-slate-300 bg-slate-50 text-slate-700',
  'JSON':    'border-blue-300 bg-blue-50 text-blue-800',
  'Parquet': 'border-teal-300 bg-teal-50 text-teal-800',
  'Avro':    'border-orange-300 bg-orange-50 text-orange-800',
  'ORC':     'border-green-300 bg-green-50 text-green-800',
  'XML':     'border-rose-300 bg-rose-50 text-rose-800',
};

// ── 3.2  Ingestion Tool Sorter data ───────────────────────────────────────────
const INGESTION_PILLARS = [
  { id: 'snowpipe',  label: 'Snowpipe',          color: 'bg-teal-600',   lightBg: 'bg-teal-50',   border: 'border-teal-300'   },
  { id: 'streaming', label: 'Snowpipe Streaming', color: 'bg-blue-600',   lightBg: 'bg-blue-50',   border: 'border-blue-300'   },
  { id: 'streams',   label: 'Streams (CDC)',      color: 'bg-violet-600', lightBg: 'bg-violet-50', border: 'border-violet-300' },
  { id: 'tasks',     label: 'Tasks',              color: 'bg-amber-600',  lightBg: 'bg-amber-50',  border: 'border-amber-300'  },
  { id: 'dynamic',   label: 'Dynamic Tables',     color: 'bg-rose-600',   lightBg: 'bg-rose-50',   border: 'border-rose-300'   },
];
const INGESTION_CARDS_DATA = [
  { id: 'c1',  text: 'Load S3 files automatically — serverless, event-triggered, file-based',               pillar: 'snowpipe',  hint: 'Snowpipe is file-based and triggered by cloud events (SQS, Event Grid, Pub Sub).' },
  { id: 'c2',  text: 'Write IoT rows directly into a table with sub-second latency using a Java SDK',       pillar: 'streaming', hint: 'Snowpipe Streaming bypasses file staging — rows go directly via SDK channel.' },
  { id: 'c3',  text: 'Track INSERT/UPDATE/DELETE changes on a source table as a CDC delta',                  pillar: 'streams',   hint: 'Streams are offset-based CDC objects that record DML changes between two points.' },
  { id: 'c4',  text: 'Schedule a MERGE statement to run every hour using CRON syntax',                      pillar: 'tasks',     hint: 'Tasks execute SQL/procedures on a fixed schedule or when triggered by a stream.' },
  { id: 'c5',  text: 'Declare a query and let Snowflake refresh it within a 5-minute target lag',            pillar: 'dynamic',   hint: 'Dynamic Tables are declarative — you define the query, Snowflake owns the schedule.' },
  { id: 'c6',  text: 'Fire a pipe when new files land in an S3 bucket via SQS event notification',          pillar: 'snowpipe',  hint: 'AUTO_INGEST = TRUE uses cloud event notifications to trigger Snowpipe.' },
  { id: 'c7',  text: 'Ingest Kafka topic records directly — no file staging required',                      pillar: 'streaming', hint: 'Snowpipe Streaming writes rows directly without staging files.' },
  { id: 'c8',  text: 'Run SQL only when SYSTEM$STREAM_HAS_DATA() returns TRUE — event-driven, no idle cost',pillar: 'tasks',     hint: 'Triggered tasks fire on stream events — no compute used when stream is empty.' },
  { id: 'c9',  text: 'Chain transformations declaratively for SCD and pre-aggregation pipelines',           pillar: 'dynamic',   hint: 'Dynamic Tables are ideal for SCDs, joins, and aggregation pipelines.' },
  { id: 'c10', text: 'Append-only object that records new rows for downstream ELT consumers',               pillar: 'streams',   hint: 'Append-only streams track only INSERT ops — efficient for ELT patterns.' },
];

const QUIZ_SECTIONS = [
  { id: 'stage_sort',  label: 'Stage Sorter',        emoji: '🏗️', desc: '3.1 — Assign each property to the correct stage type' },
  { id: 'fmt_match',   label: 'Format Matcher',      emoji: '📄', desc: '3.1 — Match each statement to the right file format' },
  { id: 'load_mcq',    label: 'Loading Scenarios',   emoji: '📦', desc: '3.1 — COPY INTO, ON_ERROR, encryption, INFER_SCHEMA' },
  { id: 'ingest_sort', label: 'Ingestion Sorter',    emoji: '🔀', desc: '3.2 — Place each use case in the right ingestion tool' },
  { id: 'ingest_mcq',  label: 'Ingestion Scenarios', emoji: '⚡', desc: '3.2 — Snowpipe, Streams, Tasks, Dynamic Tables' },
  { id: 'conn_mcq',    label: 'Connectors',          emoji: '🔌', desc: '3.3 — Drivers, connectors, integrations scenarios' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// QUIZ — Reusable components
// ═══════════════════════════════════════════════════════════════════════════════

// ── Per-row classifier (used for Stage + Format challenges) ───────────────────
const RowClassifier = ({ title, subtitle, data, options, colors }) => {
  const [answers,  setAnswers]  = useState({});
  const [revealed, setRevealed] = useState(false);

  const answered = Object.keys(answers).length;
  const score    = Object.entries(answers).filter(([qi, ans]) => ans === data[+qi].answer).length;
  const emoji    = score / data.length >= 0.9 ? '🎉' : score / data.length >= 0.7 ? '👍' : '📚';
  const reset    = () => { setAnswers({}); setRevealed(false); };

  return (
    <InfoCard>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-bold text-slate-700">{title}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        </div>
        <button onClick={reset} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50">
          <RefreshCw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Legend chips */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {options.map(opt => (
          <span key={opt} className={`text-xs font-bold px-2 py-1 rounded-lg border ${colors[opt]}`}>{opt}</span>
        ))}
      </div>

      <div className="space-y-2">
        {data.map((item, i) => {
          const chosen    = answers[i];
          const isCorrect = revealed && chosen === item.answer;
          const isWrong   = revealed && chosen && chosen !== item.answer;
          return (
            <div key={i} className={`p-3 rounded-xl border transition-all ${
              !revealed ? 'border-slate-200 bg-white'
              : isCorrect ? 'border-emerald-300 bg-emerald-50'
              : isWrong  ? 'border-red-200 bg-red-50'
              : 'border-slate-200 bg-slate-50'
            }`}>
              <p className="text-sm text-slate-700 mb-2 leading-snug">{item.text}</p>
              <div className="flex flex-wrap gap-1.5">
                {options.map(opt => {
                  const isPicked = chosen === opt;
                  const isAnswer = revealed && opt === item.answer;
                  let cls = 'border-slate-200 text-slate-500 hover:border-violet-300 hover:bg-violet-50';
                  if (!revealed) {
                    if (isPicked) cls = 'border-violet-500 bg-violet-100 text-violet-800 font-bold';
                  } else {
                    if (isAnswer)       cls = 'border-emerald-400 bg-emerald-100 text-emerald-800 font-bold';
                    else if (isPicked)  cls = 'border-red-300 bg-red-100 text-red-700 line-through opacity-70';
                    else                cls = 'border-slate-100 text-slate-300 opacity-40';
                  }
                  return (
                    <button key={opt} disabled={!!revealed}
                      onClick={() => setAnswers(a => ({ ...a, [i]: opt }))}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${cls}`}>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {revealed && <p className="text-xs text-slate-500 mt-1.5 italic">{item.hint}</p>}
            </div>
          );
        })}
      </div>

      {revealed ? (
        <div className="mt-5 p-4 bg-violet-50 rounded-xl border border-violet-200 text-center">
          <p className="text-3xl mb-1">{emoji}</p>
          <p className="font-bold text-violet-800">Score: {score} / {data.length}</p>
          <button onClick={reset} className="mt-3 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold px-6 py-2 rounded-xl">Retry</button>
        </div>
      ) : (
        <button disabled={answered < data.length} onClick={() => setRevealed(true)}
          className={`mt-5 w-full py-3 rounded-xl font-bold text-sm transition-all ${
            answered < data.length
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-violet-600 hover:bg-violet-700 text-white'
          }`}>
          {answered < data.length ? `Answer all questions (${answered}/${data.length})` : 'Check Answers'}
        </button>
      )}
    </InfoCard>
  );
};

// ── Pillar sort game (used for Ingestion challenge) ───────────────────────────
const PillarSortGame = ({ title, subtitle, pillars, cards }) => {
  const [placed,   setPlaced]   = useState({});
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const unplaced = cards.filter(c => !placed[c.id]);
  const allPlaced = unplaced.length === 0;
  const score = Object.entries(placed).filter(([cid, pid]) => {
    const card = cards.find(c => c.id === cid);
    return card && card.pillar === pid;
  }).length;
  const emoji = score / cards.length >= 0.9 ? '🎉' : score / cards.length >= 0.7 ? '👍' : '📚';
  const reset = () => { setPlaced({}); setSelected(null); setRevealed(false); };

  const handleCardClick = (cardId) => {
    if (revealed) return;
    setSelected(s => s === cardId ? null : cardId);
  };
  const handlePillarClick = (pillarId) => {
    if (!selected || revealed) return;
    setPlaced(p => ({ ...p, [selected]: pillarId }));
    setSelected(null);
  };
  const handleChipRemove = (cardId) => {
    if (revealed) return;
    setPlaced(p => { const n = { ...p }; delete n[cardId]; return n; });
  };

  return (
    <InfoCard>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-bold text-slate-700">{title}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        </div>
        <button onClick={reset} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50">
          <RefreshCw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Unplaced card pool */}
      {unplaced.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Use Cases to Sort <span className="text-slate-400 font-normal">({unplaced.length} remaining)</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {unplaced.map(card => (
              <button key={card.id} onClick={() => handleCardClick(card.id)}
                className={`text-xs px-3 py-2 rounded-xl border transition-all text-left max-w-sm leading-snug ${
                  selected === card.id
                    ? 'border-violet-500 bg-violet-100 text-violet-800 shadow-md font-bold'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:bg-violet-50'
                }`}>
                {card.text}
              </button>
            ))}
          </div>
          {selected && (
            <p className="text-xs text-violet-600 font-bold mt-2">↓ Click a tool bucket below to place it</p>
          )}
        </div>
      )}

      {/* Pillar buckets */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        {pillars.map(pillar => {
          const pillarCards = cards.filter(c => placed[c.id] === pillar.id);
          return (
            <div key={pillar.id} onClick={() => handlePillarClick(pillar.id)}
              className={`rounded-xl border-2 p-3 transition-all min-h-[90px] ${
                selected && !revealed
                  ? `cursor-pointer ${pillar.border} ${pillar.lightBg} shadow-md`
                  : `${pillar.border} bg-white`
              }`}>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg text-white mb-2 inline-block ${pillar.color}`}>{pillar.label}</span>
              <div className="space-y-1 mt-1">
                {pillarCards.map(card => {
                  const correct = revealed && card.pillar === pillar.id;
                  const wrong   = revealed && card.pillar !== pillar.id;
                  return (
                    <div key={card.id} className={`text-xs px-2 py-1.5 rounded-lg border flex items-start gap-1.5 ${
                      revealed
                        ? correct ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                  : 'bg-red-50 border-red-200 text-red-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}>
                      <span className="flex-1 leading-snug">{card.text}</span>
                      {!revealed && (
                        <button onClick={e => { e.stopPropagation(); handleChipRemove(card.id); }}
                          className="text-slate-300 hover:text-red-400 flex-shrink-0">✕</button>
                      )}
                      {revealed && correct && <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />}
                      {revealed && wrong   && <XCircle    className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Wrong-answer hints after reveal */}
      {revealed && (() => {
        const wrong = cards.filter(c => placed[c.id] !== c.pillar);
        if (!wrong.length) return null;
        return (
          <div className="space-y-1 mb-4">
            {wrong.map(c => (
              <div key={c.id} className="text-xs p-2 bg-amber-50 border border-amber-200 rounded-lg">
                <span className="font-bold text-amber-700">Correct: </span>
                <span className="text-amber-800">{pillars.find(p => p.id === c.pillar)?.label}</span>
                <span className="text-amber-700"> — {c.hint}</span>
              </div>
            ))}
          </div>
        );
      })()}

      {revealed ? (
        <div className="p-4 bg-violet-50 rounded-xl border border-violet-200 text-center">
          <p className="text-3xl mb-1">{emoji}</p>
          <p className="font-bold text-violet-800">Score: {score} / {cards.length}</p>
          <button onClick={reset} className="mt-3 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold px-6 py-2 rounded-xl">Retry</button>
        </div>
      ) : (
        <button disabled={!allPlaced} onClick={() => setRevealed(true)}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
            !allPlaced ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-violet-600 hover:bg-violet-700 text-white'
          }`}>
          {!allPlaced ? `Place ${unplaced.length} remaining card${unplaced.length !== 1 ? 's' : ''}` : 'Check Answers'}
        </button>
      )}
    </InfoCard>
  );
};

// ── Sequential scenario picker ────────────────────────────────────────────────
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
          You scored <span className="font-bold text-violet-700 text-xl">{score}</span> / {data.length}
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
          <button onClick={reset} className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600">
            <RefreshCw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div className="bg-violet-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(current / data.length) * 100}%` }} />
        </div>
      </div>

      <InfoCard>
        <p className="text-[10px] font-bold text-violet-600 uppercase tracking-wider mb-2">Scenario</p>
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
                {picked && isAnswer            && <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                {picked && isPicked && !isAnswer && <XCircle   className="w-4 h-4 text-red-400 flex-shrink-0" />}
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
              className="mt-3 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors">
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
  const [active, setActive] = useState('stage_sort');

  return (
    <div className="space-y-4">
      <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <FlaskConical className="w-5 h-5 text-violet-600" />
          <p className="font-bold text-violet-800 text-sm">Domain 3 — Knowledge Checks</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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

      {active === 'stage_sort'  && (
        <RowClassifier
          title="Stage Type Classifier"
          subtitle="Assign each property to the correct stage type."
          data={STAGE_CLASSIFIER_DATA}
          options={STAGE_OPTIONS}
          colors={STAGE_COLORS}
        />
      )}
      {active === 'fmt_match'   && (
        <RowClassifier
          title="File Format Matcher"
          subtitle="Match each statement to the correct file format."
          data={FORMAT_MATCH_DATA}
          options={FORMAT_OPTIONS}
          colors={FORMAT_COLORS}
        />
      )}
      {active === 'load_mcq'    && <ScenarioPicker data={LOADING_QUIZ_DATA} />}
      {active === 'ingest_sort' && (
        <PillarSortGame
          title="Ingestion Tool Sorter"
          subtitle="Select a use case chip, then click the correct tool bucket to place it."
          pillars={INGESTION_PILLARS}
          cards={INGESTION_CARDS_DATA}
        />
      )}
      {active === 'ingest_mcq'  && <ScenarioPicker data={INGESTION_QUIZ_DATA} />}
      {active === 'conn_mcq'    && <ScenarioPicker data={CONNECTORS_QUIZ_DATA} />}
    </div>
  );
};

export default Domain3_DataLoading;
