---
name: snowflake-exam-day-generation
description: >-
  Generates a new daily COF-C03 mock exam question set (60 questions) for the
  SnowPro Core Study App. Use when the user asks to "create Day N", "generate
  Day N", "add a new exam day", or "make tomorrow's mock exam". Enforces the
  decreasing overlap rule, real exam distribution, Challenge Days on multiples
  of 3, and correct file/registry wiring.
---

# Snowflake Exam Day Generation

## What this skill does

Creates a new `ExamDayNN.js` question file in `exam-prep/` and registers it
in `question-registry.js`. Each day is a 60-question timed mock following the
real COF-C03 domain distribution.

---

## Step 1 — Check previous days for overlap

Before writing any questions, read the most recent day file(s) and extract
the `q:` / `topic:` fields to track which topic/scenario combinations are
already covered. Apply the **decreasing overlap budget**:

| Recency | Max overlap |
|---------|-------------|
| Day N-1 (immediately previous) | **≤ 30%** (≤ 18 of 60 questions) |
| Day N-2 (two days ago) | **≤ 20%** (≤ 12 of 60 questions) |
| Day N-3 (three days ago) | **≤ 10%** (≤ 6 of 60 questions) |
| Day N-4 and older | **≤ 5%** (≤ 3 of 60 questions) — avoid verbatim repeats |

Overlap is measured at the **topic + question angle** level. Same topic from a
completely different scenario angle does NOT count as overlap.

---

## Step 2 — Question distribution (mandatory)

Each file must contain **exactly 60 questions** in this breakdown:

| Domain | Weight | Questions |
|--------|--------|-----------|
| D1 Architecture & Features | 31% | **19** |
| D2 Account Mgmt & Governance | 20% | **12** |
| D3 Data Loading & Connectivity | 18% | **11** |
| D4 Performance & Transformation | 21% | **13** |
| D5 Data Collaboration | 10% | **5** |

---

## Step 2b — Difficulty mix (IMPORTANT: Challenge Days)

**Standard days** (days NOT divisible by 3): `~30% easy · ~50% medium · ~20% hard`
= ~18 easy, ~30 medium, ~12 hard

**Challenge Days** (day number divisible by 3 — Day 3, 6, 9, 12…): `~10% easy · ~40% medium · ~50% hard`
= ~6 easy, ~24 medium, ~30 hard

Challenge Days are labeled `Day N — Challenge` in `DAY_META.label` and use
the Challenge Day difficulty header in the file comment block.

---

## Step 3 — Topic rotation guidelines

Rotate through these sub-topics across days. Never use the same question
wording twice. Use different scenarios, numbers, and SQL examples each day.

### Domain 1 sub-topics (rotate each day)
- Architecture layers (Storage / Compute / Cloud Services responsibilities)
- Multi-cluster shared data architecture concept
- Cloud providers (AWS/Azure/GCP support)
- Editions (Standard, Enterprise, BC, VPS) — feature gates
- Snowflake Horizon Catalog pillars
- Apache Iceberg tables (Snowflake-managed vs external catalog)
- Interfaces: Snowsight, SnowSQL, Snow CLI, VS Code Extension, SQL API, Terraform, JDBC/ODBC
- Object hierarchy (Org → Account → DB → Schema → objects)
- Schema-level object types (stages, pipes, streams, tasks, file formats, sequences, UDFs, SPs)
- Virtual warehouse credit sizing, billing (60-sec minimum, per-second)
- Multi-cluster: Auto-scale vs Maximized, STANDARD vs ECONOMY policy
- Warehouse privileges: USAGE, OPERATE, MODIFY, MONITOR, MANAGE WAREHOUSES
- Snowpark-optimized warehouse (16× memory vs standard)
- AUTO_SUSPEND, AUTO_RESUME, STATEMENT_TIMEOUT_IN_SECONDS
- Table types: Permanent, Transient, Temporary, External, Iceberg
- Time Travel data retention (0–90 days), Fail-safe (7 days, Support only)
- Micro-partition internals (size 50–500 MB, columnar, AES-256 encrypted, immutable)
- Views: Standard, Secure, Materialized
- AI/ML: Snowpark, Notebooks, Streamlit in Snowflake (SiS), Cortex (Analyst, Search, Complete, Summarize, Guard), ML Functions, Document AI
- Snowpark Container Services (Docker containers inside Snowflake)
- Timestamp types: TIMESTAMP_TZ, TIMESTAMP_LTZ, TIMESTAMP_NTZ
- GEOGRAPHY vs GEOMETRY data types
- Query tagging (ALTER SESSION SET QUERY_TAG)

### Domain 2 sub-topics (rotate each day)
- System roles: ACCOUNTADMIN, SYSADMIN, SECURITYADMIN, USERADMIN, PUBLIC, ORGADMIN
- Custom role design (always grant up to SYSADMIN)
- DAC vs RBAC definitions
- Secondary roles (USE SECONDARY ROLES ALL / NONE)
- Privilege hierarchy (USAGE DB → USAGE schema → SELECT table)
- GRANT OWNERSHIP / transfer of ownership / COPY CURRENT GRANTS
- Authentication: username/password, MFA (Duo), key-pair, SSO/SAML 2.0, OAuth 2.0, SCIM
- External OAuth (third-party IdP via SECURITY INTEGRATION TYPE = EXTERNAL_OAUTH)
- Network policies (account-level vs user-level precedence, allowed/blocked IP lists)
- Session policies (idle timeout, MFA enforcement)
- Dynamic Data Masking (column-level): policy DDL, conditional logic, role-based returns, policy admin role
- Row Access Policies (row-level): transparent filtering, no error thrown, ACCOUNTADMIN not exempt
- Object tagging: CREATE TAG, ALLOWED_VALUES, TAG_REFERENCES, auto-classification categories
- Privacy Policies / Aggregation Policies (minimum group size)
- Trust Center (CIS benchmarks, security scanner)
- Encryption: AES-256 at rest, TLS in transit, key rotation, Tri-Secret Secure (BC+), key hierarchy (root→account→table→file)
- Replication Groups vs Failover Groups, primary/secondary, editions required
- Data Lineage: GET_LINEAGE, OBJECT_DEPENDENCIES, external lineage (OpenLineage)
- Alerts: CREATE ALERT, schedule types, RESUME/SUSPEND, privileges, serverless compute
- Notifications: NOTIFICATION INTEGRATION (Email/Webhook/Queue), SYSTEM$SEND_EMAIL
- Resource Monitors: CREATE, CREDIT_QUOTA, triggers (NOTIFY/SUSPEND/SUSPEND_IMMEDIATE), serverless limitation
- ACCOUNT_USAGE vs INFORMATION_SCHEMA (latency, retention, scope)
- ACCOUNT_USAGE key views: QUERY_HISTORY, LOGIN_HISTORY, ACCESS_HISTORY, WAREHOUSE_METERING_HISTORY, COPY_HISTORY
- Database roles for ACCOUNT_USAGE: OBJECT_VIEWER, USAGE_VIEWER, GOVERNANCE_VIEWER, SECURITY_VIEWER

### Domain 3 sub-topics (rotate each day)
- Stage types: user (@~), table (@%), named internal, named external
- Stage commands: PUT, GET, LIST, REMOVE
- External stage: Storage Integration (IAM role, no credentials stored), STORAGE_ALLOWED_LOCATIONS
- File formats: CSV (options: SKIP_HEADER, FIELD_OPTIONALLY_ENCLOSED_BY, TRIM_SPACE), JSON, Parquet, Avro, ORC, XML
- COPY INTO (load): ON_ERROR options, PURGE, FORCE, VALIDATION_MODE, load history 64 days, column mapping, MATCH_BY_COLUMN_NAME
- COPY INTO (unload): syntax, FILE_FORMAT, SINGLE, HEADER, MAX_FILE_SIZE
- Snowpipe: AUTO_INGEST, cloud event notifications, serverless billing, REST API (insertFiles)
- Snowpipe Streaming: row-level latency, SDK-based ingestion, billing difference from classic
- Streams: standard vs append-only vs insert-only, offset advancement rule (committed DML only), STALE_AFTER, staleness window, METADATA$ACTION, METADATA$ROW_ID
- Tasks: SCHEDULE (CRON/interval), RESUME/SUSPEND, DAG structure (root/child), serverless vs warehouse tasks, SYSTEM$STREAM_HAS_DATA, error notifications
- Dynamic Tables: TARGET_LAG, declarative pipeline alternative to Streams+Tasks, valid source objects, INITIALIZE, FULL vs INCREMENTAL refresh
- Connectors: Kafka, Spark, dbt, Tableau (JDBC/ODBC)
- Connectivity: JDBC, ODBC, Python Connector, .NET Connector, Node.js Driver
- Git Integration (version-control stored procedures/UDFs)
- External Functions & API Integration (call REST APIs from SQL)
- SnowCD (connectivity diagnostic)
- Stage encryption: server-side (SSE) vs client-side (CSE)
- INFER_SCHEMA / GENERATE_COLUMN_DESCRIPTION
- FLATTEN(INPUT => path) with nested navigation

### Domain 4 sub-topics (rotate each day)
- Result cache: 24-hr TTL, shared across users, invalidated by DML, requires same SQL, disable with USE_CACHED_RESULT=FALSE
- Metadata cache: SHOW commands, Cloud Services layer, free
- Warehouse (local SSD) cache: ephemeral, lost on suspend OR resize, warm-up time
- Micro-partition pruning: min/max metadata, function wrapping breaks pruning, OR predicate nuance
- Query Profile nodes: TableScan (rows filtered ratio), Aggregate, Sort, Join, Exchange
- Spilling: local SSD vs remote storage severity, causes, fixes (resize, rewrite)
- Broadcast joins vs hash joins
- Clustering keys: DDL (CLUSTER BY), expression keys, SYSTEM$CLUSTERING_INFORMATION, average_depth, SUSPEND RECLUSTER vs DROP CLUSTERING KEY
- Materialized Views: auto-refresh (serverless), restrictions, MV vs result cache, SHOW MATERIALIZED VIEWS BEHIND_BY
- Search Optimization Service: equality/IN, SUBSTRING/LIKE predicates, billing (storage + serverless)
- Semi-structured: VARIANT, PARSE_JSON, OBJECT_CONSTRUCT, ARRAY_AGG, OBJECT_AGG, FLATTEN, INFER_SCHEMA, STRIP_OUTER_ARRAY, STRIP_NULL_VALUES, :: cast, colon notation
- SQL transformations: MERGE, window functions (ROWS vs RANGE frame), QUALIFY, COPY GRANTS, CTEs, PIVOT/UNPIVOT
- UDFs (scalar, tabular, JS, Python, Java) — limitations per language
- Stored Procedures: DDL, EXECUTE AS OWNER vs CALLER, COMMIT inside SP in outer transaction
- Dynamic Tables: TARGET_LAG, INITIALIZE, incremental vs full refresh
- Snowpark DataFrame API (lazy eval, write modes, collect)
- Query Acceleration Service (Enterprise): outlier queries, large scans, scale factor

### Domain 5 sub-topics (rotate each day)
- Time Travel: AT / BEFORE syntax (TIMESTAMP, OFFSET seconds, STATEMENT ID), AT vs BEFORE difference
- UNDROP (table, schema, database) — restores all contained objects
- Fail-safe: 7 days, Support-only, no SQL access, permanent/transient/temp differences, storage cost
- Zero-copy cloning: instant, copy-on-write micro-partitions, schema/DB cloning, transient clone has no Fail-safe
- Clone behavior with policies (masking/row access policies carried over by reference)
- Secure Data Sharing: zero-copy, CREATE SHARE DDL, GRANT <privilege> TO SHARE
- Reader accounts (non-Snowflake consumers) — provider pays for compute
- CREATE DATABASE FROM SHARE (consumer side)
- Database roles in sharing context
- Snowflake Marketplace: listings (free/paid), data products, provider vs consumer
- Private Data Exchange
- Data Clean Rooms (privacy-preserving joins)
- Native Apps (Snowflake Native Application Framework): package, install, Streamlit UI
- What happens when a provider revokes/drops a shared object

---

## Step 4 — Question object format

Every question must follow this exact TypeScript-like shape:

```js
{
  id: 'd<domain>_d<day>_<seq>',   // e.g. 'd1_d3_01' for Day3 Domain1 Q1
  domain: 1,                       // integer 1–5
  topic: 'Topic Name',             // from the sub-topics list above
  difficulty: 'easy' | 'medium' | 'hard',
  q: 'Full question text ending with ?',
  options: ['A', 'B', 'C', 'D'],  // exactly 4 options
  answer: 'Exact text of correct option', // must match one of options exactly
  exp: 'Concise explanation (1–3 sentences) shown after answering.',
}
```

ID convention: `d<domain>_d<dayNumber>_<twoDigitSeq>` — e.g. `d1_d3_01`.

---

## Step 4b — Answer position rules

**The correct answer must NOT be consistently the longest option.**
- Deliberately place the correct answer in positions A, B, C, D roughly equally (~25% each).
- For at least 30% of questions, make the correct answer one of the shorter options.
- Vary option lengths so test-takers cannot guess by length pattern.

---

## Step 5 — File header template

```js
// ─────────────────────────────────────────────────────────────────────────────
// EXAM PREP — Day N  (<date>)
// COF-C03 Mock Exam · 60 questions
// Distribution: D1 31% (19q) | D2 20% (12q) | D3 18% (11q) | D4 21% (13q) | D5 10% (5q)
//
// [STANDARD DAY] Difficulty mix: ~30% Easy, ~50% Medium, ~20% Hard
// [CHALLENGE DAY — Day divisible by 3] Difficulty mix: ~10% Easy, ~40% Medium, ~50% Hard
//
// OVERLAP RULE (decreasing by recency):
//   Day N-1: ≤ 30% overlap (≤ 18 questions same topic+scenario)
//   Day N-2: ≤ 20% overlap (≤ 12 questions)
//   Day N-3: ≤ 10% overlap (≤  6 questions)
//   Day N-4+: ≤  5% overlap (≤  3 questions, avoid verbatim repeats)
//
// DAY N vs DAY N-1 OVERLAP CHECK:
//   List key topics covered in previous day and what is fresh in this day.
// ─────────────────────────────────────────────────────────────────────────────

export const DAY_META = {
  day: N,
  date: 'YYYY-MM-DD',
  label: 'Day N — <Theme>',          // Add " — Challenge" suffix for multiples of 3
  totalQuestions: 60,
  timeMinutes: 115,
};

export const QUESTIONS = [
  // ── DOMAIN 1: Architecture & Features (19 questions) ─────────────────────
  // ── DOMAIN 2: Account Management & Governance (12 questions) ─────────────
  // ── DOMAIN 3: Data Loading, Unloading & Connectivity (11 questions) ───────
  // ── DOMAIN 4: Performance, Querying & Transformation (13 questions) ───────
  // ── DOMAIN 5: Data Collaboration (5 questions) ────────────────────────────
];
```

---

## Step 6 — Wire into question-registry.js

After writing the file, update `exam-prep/question-registry.js`:

1. Add the import:
```js
import { DAY_META as D0N_META, QUESTIONS as D0N_Q } from './ExamDayNN.js';
```

2. Add the entry to `ALL_DAYS`:
```js
{ meta: D0N_META, questions: D0N_Q },
```

3. Update the placeholder comment for the *next* day.

---

## Step 7 — Quality checklist

Before finishing, verify:
- [ ] Exactly 60 questions total (19 + 12 + 11 + 13 + 5)
- [ ] All `answer` values exactly match one of the 4 `options`
- [ ] No duplicate `id` values across all day files
- [ ] Overlap with Day N-1 ≤ 18 questions, Day N-2 ≤ 12, Day N-3 ≤ 6
- [ ] Correct difficulty mix (standard: ~18/30/12, challenge: ~6/24/30)
- [ ] Answer positions spread across A/B/C/D (~25% each); correct answer ≠ always longest
- [ ] question-registry.js updated with import and ALL_DAYS entry
- [ ] ReadLints run on new file — zero errors
