---
name: snowflake-exam-day-generation
description: >-
  Generates a new daily COF-C03 mock exam question set (60 questions) for the
  SnowPro Core Study App. Use when the user asks to "create Day N", "generate
  Day N", "add a new exam day", or "make tomorrow's mock exam". Enforces the
  30% overlap rule, real exam distribution, and correct file/registry wiring.
---

# Snowflake Exam Day Generation

## What this skill does

Creates a new `ExamDayNN.js` question file in `exam-prep/` and registers it
in `ExamPrep.jsx`. Each day is a 60-question timed mock following the real
COF-C03 domain distribution.

---

## Step 1 — Check previous days for overlap

Before writing any questions, read the most recent day file(s):

```
exam-prep/ExamDay01.js
exam-prep/ExamDay02.js
...
```

Extract the `q:` field from every question. Keep a mental list of topics and
question angles already used. The new day must share **≤ 30% overlap** with
the immediately preceding day (≤ 18 of 60 questions can be on the same
topic/scenario combination).

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

Difficulty mix per day: **~30% easy, ~50% medium, ~20% hard**.

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
- Apache Iceberg tables
- Interfaces: Snowsight, SnowSQL, Snow CLI, VS Code Extension, SQL API, Terraform, JDBC/ODBC
- Object hierarchy (Org → Account → DB → Schema → objects)
- Schema-level object types (stages, pipes, streams, tasks, file formats, sequences, UDFs, SPs)
- Virtual warehouse credit sizing, billing (60-sec minimum, per-second)
- Multi-cluster: Auto-scale vs Maximized, STANDARD vs ECONOMY policy
- Warehouse privileges: USAGE, OPERATE, MODIFY, MONITOR, MANAGE WAREHOUSES
- Snowpark-optimized warehouse
- AUTO_SUSPEND, AUTO_RESUME, STATEMENT_TIMEOUT_IN_SECONDS
- Table types: Permanent, Transient, Temporary, External, Iceberg
- Time Travel data retention (0–90 days), Fail-safe (7 days, Support only)
- Micro-partition internals (size 50–500 MB, columnar, AES-256 encrypted)
- Views: Standard, Secure, Materialized
- AI/ML: Snowpark, Notebooks, Streamlit in Snowflake (SiS), Cortex (Analyst, Search, Complete, Summarize, Guard), ML Functions, Document AI

### Domain 2 sub-topics (rotate each day)
- System roles: ACCOUNTADMIN, SYSADMIN, SECURITYADMIN, USERADMIN, PUBLIC, ORGADMIN
- Custom role design (always grant up to SYSADMIN)
- DAC vs RBAC definitions
- Secondary roles (USE SECONDARY ROLES ALL / NONE)
- Privilege hierarchy (USAGE DB → USAGE schema → SELECT table)
- GRANT OWNERSHIP / transfer of ownership
- Authentication: username/password, MFA (Duo), key-pair, SSO/SAML 2.0, OAuth 2.0, SCIM
- Network policies (account-level vs user-level precedence, allowed/blocked IP lists)
- Session policies (idle timeout, MFA enforcement)
- Dynamic Data Masking (column-level): policy DDL, conditional logic, role-based returns
- Row Access Policies (row-level): transparent filtering, no error thrown
- Object tagging: CREATE TAG, ALLOWED_VALUES, TAG_REFERENCES, auto-classification
- Privacy Policies / Aggregation Policies (minimum group size)
- Trust Center (CIS benchmarks, security scanner)
- Encryption: AES-256 at rest, TLS in transit, key rotation, Tri-Secret Secure (BC+)
- Replication Groups vs Failover Groups, primary/secondary, editions required
- Data Lineage: GET_LINEAGE, OBJECT_DEPENDENCIES, external lineage (OpenLineage)
- Alerts: CREATE ALERT, schedule types, RESUME/SUSPEND, privileges
- Notifications: NOTIFICATION INTEGRATION (Email/Webhook/Queue), SYSTEM$SEND_EMAIL
- Resource Monitors: CREATE, CREDIT_QUOTA, triggers (NOTIFY/SUSPEND/SUSPEND_IMMEDIATE)
- ACCOUNT_USAGE vs INFORMATION_SCHEMA (latency, retention, scope)
- ACCOUNT_USAGE key views: QUERY_HISTORY, LOGIN_HISTORY, ACCESS_HISTORY, WAREHOUSE_METERING_HISTORY, COPY_HISTORY
- Database roles for ACCOUNT_USAGE: OBJECT_VIEWER, USAGE_VIEWER, GOVERNANCE_VIEWER, SECURITY_VIEWER

### Domain 3 sub-topics (rotate each day)
- Stage types: user (@~), table (@%), named internal, named external
- Stage commands: PUT, GET, LIST, REMOVE
- External stage: Storage Integration (IAM role, no credentials stored)
- File formats: CSV (options), JSON, Parquet, Avro, ORC, XML
- COPY INTO (load): ON_ERROR options (ABORT_STATEMENT, CONTINUE, SKIP_FILE), PURGE, FORCE, VALIDATION_MODE, load history 64 days, column mapping
- COPY INTO (unload): syntax, FILE_FORMAT, SINGLE, HEADER, MAX_FILE_SIZE
- Snowpipe: AUTO_INGEST, cloud event notifications, serverless billing, REST API (insertFiles)
- Snowpipe Streaming: row-level latency, SDK-based ingestion
- Streams: standard vs append-only vs insert-only, offset advancement rule, STALE_AFTER, staleness window
- Tasks: SCHEDULE (CRON/interval), RESUME/SUSPEND, DAG structure (root/child), serverless vs warehouse tasks
- Dynamic Tables: TARGET_LAG, declarative pipeline alternative to Streams+Tasks
- Connectors: Kafka, Spark, dbt, Tableau (JDBC/ODBC)
- Connectivity: JDBC, ODBC, Python Connector, .NET Connector, Node.js Driver
- Git Integration (version-control stored procedures/UDFs)
- External Functions & API Integration (call REST APIs from SQL)
- SnowCD (connectivity diagnostic)

### Domain 4 sub-topics (rotate each day)
- Result cache: 24-hr TTL, shared across users, invalidated by DML, requires same SQL
- Metadata cache: SHOW commands, Cloud Services layer, free
- Warehouse (local SSD) cache: ephemeral, lost on suspend, warm-up time
- Micro-partition pruning: min/max metadata, function wrapping breaks pruning
- Query Profile nodes: TableScan, Aggregate, Sort, Join, Exchange
- Spilling: local SSD vs remote storage, causes, fixes (resize, rewrite)
- Broadcast joins vs hash joins
- Clustering keys: DDL (CLUSTER BY), expression keys, SYSTEM$CLUSTERING_INFORMATION, average_depth, automatic re-clustering (serverless)
- Materialized Views: auto-refresh (serverless), restrictions (no non-deterministic, no subquery, no UDF), MV vs result cache vs regular view
- Search Optimization Service: point lookups, equality/IN predicates, billing (storage + serverless), ALTER TABLE … ADD SEARCH OPTIMIZATION
- Semi-structured: VARIANT, PARSE_JSON, OBJECT_CONSTRUCT, ARRAY_AGG, FLATTEN, INFER_SCHEMA, STRIP_OUTER_ARRAY, :: cast, colon notation
- SQL transformations: MERGE, window functions, QUALIFY, COPY GRANTS, CTEs
- UDFs (scalar, tabular, JS, Python, Java)
- Stored Procedures: DDL, EXECUTE AS OWNER vs CALLER, languages
- Dynamic Tables: TARGET_LAG, INITIALIZE, incremental refresh
- Snowpark DataFrame API

### Domain 5 sub-topics (rotate each day)
- Time Travel: AT / BEFORE syntax (TIMESTAMP, OFFSET seconds, STATEMENT ID)
- UNDROP (table, schema, database)
- Fail-safe: 7 days, Support-only, no SQL access, permanent/transient/temp differences
- Zero-copy cloning: instant, copy-on-write micro-partitions, schema/DB cloning
- Clone behavior with policies (masking/row access policies carried over by reference)
- Secure Data Sharing: zero-copy, CREATE SHARE DDL, GRANT <privilege> TO SHARE
- Reader accounts (non-Snowflake consumers)
- CREATE DATABASE FROM SHARE (consumer side)
- Database roles in sharing context
- Snowflake Marketplace: listings (free/paid), data products, provider vs consumer
- Private Data Exchange
- Data Clean Rooms (privacy-preserving joins)
- Native Apps (Snowflake Native Application Framework): package, install, Streamlit UI

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

## Step 5 — File header template

```js
// ─────────────────────────────────────────────────────────────────────────────
// EXAM PREP — Day N  (<date>)
// COF-C03 Mock Exam · 60 questions
// Distribution: D1 31% (19q) | D2 20% (12q) | D3 18% (11q) | D4 21% (13q) | D5 10% (5q)
// Difficulty mix: ~30% Easy, ~50% Medium, ~20% Hard
//
// DAILY GENERATION RULE:
//   Each new day of questions must share ≤ 30% overlap with the previous day.
//   Before writing a new day, list the question IDs from the previous file and
//   ensure fewer than 18 of the 60 questions are repeated verbatim.
//   Rotate topics, scenarios, and SQL examples each day.
//
// DAY N vs DAY N-1 OVERLAP CHECK:
//   List key topics covered in previous day and what is fresh in this day.
// ─────────────────────────────────────────────────────────────────────────────

export const DAY_META = {
  day: N,
  date: 'YYYY-MM-DD',
  label: 'Day N — <Theme>',
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

## Step 6 — Wire into ExamPrep.jsx

After writing the file, update `exam-prep/ExamPrep.jsx`:

1. Add the import at the top of the day registry block:
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
- [ ] ≤ 18 questions overlap with the previous day (topic+scenario level)
- [ ] Difficulty: ~18 easy, ~30 medium, ~12 hard
- [ ] ExamPrep.jsx updated with import and ALL_DAYS entry
- [ ] ReadLints run on both new files — zero errors
