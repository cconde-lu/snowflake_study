// ─────────────────────────────────────────────────────────────────────────────
// EXAM PREP — Day 11  (2026-03-23)
// COF-C03 Mock Exam · 60 questions
// Distribution: D1 31% (19q) | D2 20% (12q) | D3 18% (11q) | D4 21% (13q) | D5 10% (5q)
//
// [STANDARD DAY] Difficulty mix: ~30% Easy (18q) · ~50% Medium (30q) · ~20% Hard (12q)
//
// OVERLAP RULE (decreasing by recency):
//   Day 10 (N-1): ≤ 30% overlap (≤ 18 questions same topic+scenario)
//   Day  9 (N-2): ≤ 20% overlap (≤ 12 questions)
//   Day  8 (N-3): ≤ 10% overlap (≤  6 questions)
//   Day  7 (N-4): ≤  5% overlap (≤  3 questions, avoid verbatim repeats)
//
// DAY 11 vs DAY 10 OVERLAP CHECK:
//   Day 10 heavy on: UUID_STRING, SQL API, micro-partition immutability,
//     SYSTEM$ALLOWLIST, DDM/CURRENT_ROLE, STRIP_OUTER_ARRAY, MATCH_BY_COLUMN_NAME,
//     clustering depth/anti-patterns, semi-structured OBJECT_KEYS/OBJECT_AGG,
//     cloning + Time Travel edge cases, reader accounts, replication failover.
//   Day 11 fresh angles: Editions feature gates, Snowpark-optimized WH,
//     TIMESTAMP types, Cortex AI, Iceberg, secure views, ORGADMIN, key-pair auth,
//     session policies, aggregation policies, Trust Center, Tri-Secret Secure,
//     Storage Integration, COPY INTO VALIDATION_MODE, unload HEADER/SINGLE,
//     Snowpipe Streaming, append-only streams, Dynamic Tables INITIALIZE,
//     INFER_SCHEMA, Git Integration, External Functions, result cache DML
//     invalidation, warehouse cache resize, broadcast joins, MV BEHIND_BY,
//     SOS billing, MERGE, window frame, SP EXECUTE AS, UDF JS vs Python,
//     Snowpark lazy eval, PIVOT, QAS eligible SQL, UNDROP, clone policy
//     propagation, CREATE SHARE privileges, Marketplace private listings, Native Apps.
// ─────────────────────────────────────────────────────────────────────────────

export const DAY_META = {
  day: 11,
  date: '2026-03-23',
  label: 'Day 11 — Governance Deep Dive & Streaming Pipelines',
  totalQuestions: 60,
  timeMinutes: 115,
};

export const QUESTIONS = [

  // ── DOMAIN 1: Architecture & Features (19 questions) ─────────────────────

  {
    id: 'd1_d11_01',
    domain: 1,
    topic: 'Architecture Layers — Responsibilities',
    difficulty: 'easy',
    q: 'A Snowflake administrator needs to understand which layer handles query optimisation, metadata management, and access control enforcement. Which architectural layer is responsible?',
    options: [
      'The Storage layer — it stores both data files and the metadata required to plan query execution',
      'The Cloud Services layer — it handles query optimisation, metadata management, transaction coordination, authentication, and access control without consuming warehouse credits for most operations',
      'The Virtual Warehouse (Compute) layer — the warehouse nodes optimise each query before executing it locally',
      'The Network layer — all governance and security is handled at the network perimeter before reaching Snowflake',
    ],
    answer: 'The Cloud Services layer — it handles query optimisation, metadata management, transaction coordination, authentication, and access control without consuming warehouse credits for most operations',
    exp: 'The Cloud Services layer is the "brain" of Snowflake — it handles: query parsing and optimisation, metadata management, authentication and authorisation, result and metadata caching, and transaction management. It runs on Snowflake-managed compute and is billed only when it exceeds 10% of daily warehouse credits. The Storage layer holds micro-partition data; the Compute (warehouse) layer executes query operators.',
  },

  {
    id: 'd1_d11_02',
    domain: 1,
    topic: 'Snowflake Editions — Enterprise Features',
    difficulty: 'easy',
    q: 'Which capability is available ONLY on Enterprise edition or higher — NOT on Standard edition?',
    options: [
      'Virtual warehouses with AUTO_SUSPEND and AUTO_RESUME',
      'Time Travel data retention of up to 90 days (Standard is limited to 1 day)',
      'Snowsight web interface and Snowflake Marketplace access',
      'Secure Data Sharing to other Snowflake accounts',
    ],
    answer: 'Time Travel data retention of up to 90 days (Standard is limited to 1 day)',
    exp: 'Standard edition supports Time Travel up to 1 day (DATA_RETENTION_TIME_IN_DAYS = 0 or 1). Enterprise edition unlocks up to 90 days of Time Travel, Automatic Clustering, Materialized Views, Database Replication and Failover, Multi-cluster Warehouses, and Tri-Secret Secure (on Business Critical). AUTO_SUSPEND/AUTO_RESUME, Snowsight, and Secure Data Sharing are available on all editions.',
  },

  {
    id: 'd1_d11_03',
    domain: 1,
    topic: 'Multi-cluster Warehouse — AUTO_SCALE vs MAXIMIZED',
    difficulty: 'easy',
    q: 'A BI team sets MIN_CLUSTER_COUNT = 2 and MAX_CLUSTER_COUNT = 5 on their warehouse. In MAXIMIZED mode, how many clusters run when the warehouse is active?',
    options: [
      'All 5 clusters start immediately when the warehouse is resumed and remain running until it is suspended — MAXIMIZED always runs at MAX_CLUSTER_COUNT, regardless of actual query load',
      'Clusters scale from MIN to MAX based on queue depth — MAXIMIZED and AUTO_SCALE behave identically',
      'Exactly 2 clusters (MIN_CLUSTER_COUNT) — MAXIMIZED mode locks the cluster count at the minimum to conserve credits',
      'The mode is irrelevant when MAX_CLUSTER_COUNT equals MIN_CLUSTER_COUNT — they only differ when MIN < MAX',
    ],
    answer: 'All 5 clusters start immediately when the warehouse is resumed and remain running until it is suspended — MAXIMIZED always runs at MAX_CLUSTER_COUNT, regardless of actual query load',
    exp: 'MAXIMIZED mode starts MAX_CLUSTER_COUNT clusters as soon as the warehouse resumes, keeping all of them running continuously. It eliminates query queue latency at the cost of always-on compute. AUTO_SCALE mode is the default and spins clusters up/down based on actual demand, balancing cost and throughput. MAXIMIZED is preferred when query arrival rate is consistently high and zero-queue latency is critical.',
  },

  {
    id: 'd1_d11_04',
    domain: 1,
    topic: 'Snowpark-optimized Warehouse',
    difficulty: 'easy',
    q: 'A data scientist is training a machine learning model using Snowpark Python on very large DataFrames and needs significantly more memory than a standard warehouse provides. What should they use?',
    options: [
      'A 4X-Large standard warehouse — the largest standard size provides enough memory for any Snowpark workload',
      'A Snowpark-optimized warehouse — these have approximately 16× more memory per node than a standard warehouse of the same size, making them designed specifically for memory-intensive ML, data science, and large Snowpark workloads',
      'A multi-cluster warehouse with AUTO_SCALE — scaling out adds more nodes, effectively multiplying available memory',
      'An external Python environment connected via Snowflake\'s Python Connector — Snowpark itself cannot train ML models in Snowflake',
    ],
    answer: 'A Snowpark-optimized warehouse — these have approximately 16× more memory per node than a standard warehouse of the same size, making them designed specifically for memory-intensive ML, data science, and large Snowpark workloads',
    exp: 'Snowpark-optimized warehouses use memory-optimised node types with roughly 16× more RAM per node than a standard warehouse of the same T-shirt size. This is essential for Snowpark Python workloads that keep large DataFrames or model weights in memory. They bill at the same credit rate per hour as standard warehouses of the same size but are provisioned from a different EC2/VM family. They are created with WAREHOUSE_TYPE = \'SNOWPARK-OPTIMIZED\'.',
  },

  {
    id: 'd1_d11_05',
    domain: 1,
    topic: 'Table Types — Temporary vs Transient',
    difficulty: 'easy',
    q: 'What is the key distinction between a Temporary table and a Transient table in Snowflake?',
    options: [
      'Temporary tables support up to 90 days of Time Travel; Transient tables have no Time Travel at all',
      'Temporary tables are session-scoped and automatically dropped at session end; Transient tables persist across sessions but have no Fail-safe and at most 1 day of Time Travel',
      'Transient tables are automatically replicated across regions; Temporary tables exist only in the primary region',
      'Temporary tables support DML (INSERT, UPDATE, DELETE); Transient tables are read-only staging areas',
    ],
    answer: 'Temporary tables are session-scoped and automatically dropped at session end; Transient tables persist across sessions but have no Fail-safe and at most 1 day of Time Travel',
    exp: 'Both Temporary and Transient tables omit Fail-safe (7-day protected storage), reducing CDP storage costs. The critical difference is lifetime: a Temporary table exists only for the duration of the session that created it and is invisible to other sessions. A Transient table is a permanent schema object visible to all authorised users but trades the Fail-safe and extended Time Travel (max 1 day) for lower storage costs — ideal for staging tables that are regularly overwritten.',
  },

  {
    id: 'd1_d11_06',
    domain: 1,
    topic: 'Secure Views',
    difficulty: 'easy',
    q: 'A data engineer creates a VIEW over a sensitive table. Another user with SELECT on the view runs SHOW VIEWS and can see the view\'s DDL definition. To prevent this, what should the engineer create instead?',
    options: [
      'A SECURE VIEW — secure views hide the underlying query definition from all users except the owner. Non-owners see the view name and schema but cannot inspect the SQL used to define it, protecting proprietary logic and sensitive column references.',
      'A MATERIALIZED VIEW — materialized views store pre-computed results, so the underlying SQL cannot be inspected by querying the result',
      'A STANDARD VIEW with ROW ACCESS POLICY — adding a row policy encrypts the view definition from non-privileged users',
      'A STREAM on the source table — streams expose only the change feed, not the base query logic',
    ],
    answer: 'A SECURE VIEW — secure views hide the underlying query definition from all users except the owner. Non-owners see the view name and schema but cannot inspect the SQL used to define it, protecting proprietary logic and sensitive column references.',
    exp: 'CREATE SECURE VIEW adds the SECURE keyword, which instructs Snowflake to hide the view\'s SQL definition from non-owners in SHOW VIEWS, INFORMATION_SCHEMA.VIEWS, and GET_DDL(). Additionally, a secure view disables certain query optimisations that could leak information about the underlying data (e.g., predicate push-down that might reveal column values through error messages). Standard views expose their DDL to anyone with SHOW VIEWS privilege.',
  },

  {
    id: 'd1_d11_07',
    domain: 1,
    topic: 'Apache Iceberg Tables — Catalog Modes',
    difficulty: 'medium',
    q: 'What is the functional difference between a Snowflake-managed Iceberg table and an external-catalog Iceberg table in Snowflake?',
    options: [
      'Snowflake-managed Iceberg tables are read-only; external-catalog tables support full DML including INSERT and DELETE',
      'Snowflake-managed tables store data in Snowflake internal stages; external-catalog tables only work on data already in S3 — there is no difference in DML capabilities',
      'Snowflake-managed Iceberg tables use Snowflake as the catalog and support full DML (INSERT, UPDATE, DELETE, MERGE). External-catalog tables register an existing Iceberg catalog (e.g., AWS Glue, Polaris) and are currently read-only in Snowflake — ideal for sharing data across engines without data movement.',
      'There is no functional difference — both modes support full read/write access and are interchangeable depending on storage preference',
    ],
    answer: 'Snowflake-managed Iceberg tables use Snowflake as the catalog and support full DML (INSERT, UPDATE, DELETE, MERGE). External-catalog tables register an existing Iceberg catalog (e.g., AWS Glue, Polaris) and are currently read-only in Snowflake — ideal for sharing data across engines without data movement.',
    exp: 'Iceberg tables in Snowflake come in two modes: (1) Snowflake as Iceberg catalog — Snowflake manages the metadata and supports full read/write. Data is stored in an external object store (your S3/GCS/Azure). (2) External catalog — Snowflake connects to an external Iceberg catalog (like Apache Polaris, AWS Glue, or Databricks Unity Catalog) and can query those tables read-only. This enables multi-engine data lakehouse architectures where Spark, Trino, and Snowflake share the same table format.',
  },

  {
    id: 'd1_d11_08',
    domain: 1,
    topic: 'Cortex AI Functions',
    difficulty: 'medium',
    q: 'A developer wants to generate a SQL query from a natural-language business question using Snowflake\'s built-in AI capabilities. Which Cortex feature is designed for this?',
    options: [
      'SNOWFLAKE.CORTEX.COMPLETE() — a general-purpose LLM function for completing any prompt, including SQL generation',
      'SNOWFLAKE.CORTEX.SUMMARIZE() — the summarization function automatically converts natural language into SQL when the input describes a data question',
      'SNOWFLAKE.CORTEX.SEARCH() — the semantic search function retrieves relevant SQL examples from a pre-indexed query library',
      'Cortex Analyst — a Snowflake-hosted service that translates natural-language business questions into SQL queries over a semantic model defined in YAML. It is purpose-built for business analyst self-service and is separate from COMPLETE().',
    ],
    answer: 'Cortex Analyst — a Snowflake-hosted service that translates natural-language business questions into SQL queries over a semantic model defined in YAML. It is purpose-built for business analyst self-service and is separate from COMPLETE().',
    exp: 'Cortex Analyst is the natural-language-to-SQL product. It uses a semantic model (defined in YAML, referencing tables and their business meaning) to translate questions like "What were total sales by region last quarter?" into correct SQL. CORTEX.COMPLETE() is a raw LLM inference function — it can generate SQL but requires careful prompting and does not have built-in schema awareness. CORTEX.SUMMARIZE() is for text summarization. CORTEX.SEARCH() enables semantic search over unstructured text.',
  },

  {
    id: 'd1_d11_09',
    domain: 1,
    topic: 'Timestamp Types — TIMESTAMP_LTZ',
    difficulty: 'medium',
    q: 'A table column is defined as TIMESTAMP_LTZ. A user in UTC−5 inserts \'2026-01-15 10:00:00\'. Another user in UTC+9 queries it. What does the UTC+9 user see?',
    options: [
      'The raw stored value \'2026-01-15 10:00:00\' — TIMESTAMP_LTZ stores values exactly as entered with no timezone conversion',
      'NULL — TIMESTAMP_LTZ rejects inserts that do not include an explicit timezone offset',
      'An error — TIMESTAMP_LTZ values cannot be displayed to users in different timezones without explicit CONVERT_TIMEZONE() calls',
      '\'2026-01-16 00:00:00\' — TIMESTAMP_LTZ (Local Time Zone) stores the absolute UTC instant and displays it converted to the querying session\'s local timezone. UTC−5 → 15:00 UTC → displayed as 00:00 UTC+9 next day.',
    ],
    answer: '\'2026-01-16 00:00:00\' — TIMESTAMP_LTZ (Local Time Zone) stores the absolute UTC instant and displays it converted to the querying session\'s local timezone. UTC−5 → 15:00 UTC → displayed as 00:00 UTC+9 next day.',
    exp: 'TIMESTAMP_LTZ stores a UTC absolute instant internally. On display, it converts the stored UTC value to the session\'s TIMEZONE parameter setting. The UTC−5 insert of 10:00 AM = 15:00 UTC. The UTC+9 user sees 15:00 UTC + 9 hours = 00:00 the next day. TIMESTAMP_NTZ stores no timezone information — always displays as-entered. TIMESTAMP_TZ stores both the UTC instant and a timezone offset — always shows with the original offset, regardless of the session timezone.',
  },

  {
    id: 'd1_d11_10',
    domain: 1,
    topic: 'STATEMENT_TIMEOUT_IN_SECONDS',
    difficulty: 'medium',
    q: 'A Snowflake administrator sets STATEMENT_TIMEOUT_IN_SECONDS = 300 at the session level AND the warehouse has it set to 600. A query runs for 350 seconds. What happens?',
    options: [
      'The query is killed after 300 seconds — the session-level setting takes precedence over the warehouse-level setting; the more restrictive (lower) session timeout applies',
      'The query runs until 600 seconds — warehouse settings always override session settings for compute-related parameters',
      'The query runs to completion — STATEMENT_TIMEOUT_IN_SECONDS only applies to DDL statements, not SELECT queries',
      'The query is killed after 600 seconds — the warehouse setting is more authoritative than the session setting for execution parameters',
    ],
    answer: 'The query is killed after 300 seconds — the session-level setting takes precedence over the warehouse-level setting; the more restrictive (lower) session timeout applies',
    exp: 'When STATEMENT_TIMEOUT_IN_SECONDS is set at multiple levels (account, warehouse, session, object), Snowflake uses the most restrictive (lowest non-zero) value applicable to the current context. A session-level override of 300 seconds takes precedence over the warehouse\'s 600 seconds. After 300 seconds, the query is cancelled with an error. This parameter applies to all statement types — SELECT, DML, DDL, and stored procedures alike.',
  },

  {
    id: 'd1_d11_11',
    domain: 1,
    topic: 'GEOGRAPHY vs GEOMETRY Data Types',
    difficulty: 'medium',
    q: 'A geospatial engineer is storing GPS coordinates for a worldwide delivery network. Should they use GEOGRAPHY or GEOMETRY?',
    options: [
      'GEOMETRY — it is the universal geospatial type in Snowflake and handles both flat-plane and spherical-globe calculations equally well',
      'Either type works — GEOGRAPHY and GEOMETRY are aliases for the same underlying type in Snowflake',
      'GEOGRAPHY — it models the Earth as a sphere (WGS84 geodetic model) and correctly handles operations like distance and area on a globe. GEOMETRY models a flat 2D Euclidean plane — appropriate for local coordinate systems (floor plans, CAD data) but not for worldwide coordinates where Earth\'s curvature matters.',
      'GEOMETRY — GPS coordinates are always provided as flat decimal degree pairs, and GEOMETRY stores them natively without conversion overhead',
    ],
    answer: 'GEOGRAPHY — it models the Earth as a sphere (WGS84 geodetic model) and correctly handles operations like distance and area on a globe. GEOMETRY models a flat 2D Euclidean plane — appropriate for local coordinate systems (floor plans, CAD data) but not for worldwide coordinates where Earth\'s curvature matters.',
    exp: 'GEOGRAPHY uses the WGS84 spheroid model — the same model used by GPS systems. Functions like ST_DISTANCE on GEOGRAPHY correctly account for Earth\'s curvature, so the distance between New York and London is calculated along the great circle, not a flat plane. GEOMETRY uses a flat 2D Cartesian coordinate system where straight lines are truly straight — appropriate for engineering drawings, building floorplans, or local mapping at scales where curvature is negligible.',
  },

  {
    id: 'd1_d11_12',
    domain: 1,
    topic: 'ORGADMIN Role — Account Management',
    difficulty: 'medium',
    q: 'Which operations can ONLY be performed by a user with the ORGADMIN role activated?',
    options: [
      'Creating new virtual warehouses and assigning resource monitors',
      'Granting system-defined roles to users and managing network policies at the user level',
      'Managing data sharing between accounts within the same organisation and running SHOW ACCOUNTS across the organisation',
      'Creating new databases and schemas at the account level and setting retention policies',
    ],
    answer: 'Managing data sharing between accounts within the same organisation and running SHOW ACCOUNTS across the organisation',
    exp: 'ORGADMIN is an organisation-level role that can: (1) SHOW ACCOUNTS — list all Snowflake accounts in the organisation, (2) manage cross-account replication and Failover Groups at the org level, (3) manage the organisation\'s Snowflake contract and spend (in conjunction with Snowflake support). Within a specific account, ACCOUNTADMIN holds the top privileges. ORGADMIN does not automatically have ACCOUNTADMIN rights in every account — it is scoped to org-level operations.',
  },

  {
    id: 'd1_d11_13',
    domain: 1,
    topic: 'Snowpark Container Services',
    difficulty: 'medium',
    q: 'What type of workloads is Snowpark Container Services (SPCS) designed to run inside Snowflake?',
    options: [
      'Custom containerised applications (Docker images) that require arbitrary runtimes, GPUs, or long-running services — running directly inside the Snowflake perimeter with access to Snowflake data, eliminating the need to extract data to an external compute environment',
      'Pre-built Snowflake-provided ML model containers that can be called as SQL functions without any custom Docker images',
      'Only Python UDFs packaged as wheel files — SPCS is the internal name for the Snowpark Python execution environment for UDFs',
      'Containerised ETL jobs that replace Snowpipe and Streams by running Apache Spark inside Snowflake nodes',
    ],
    answer: 'Custom containerised applications (Docker images) that require arbitrary runtimes, GPUs, or long-running services — running directly inside the Snowflake perimeter with access to Snowflake data, eliminating the need to extract data to an external compute environment',
    exp: 'Snowpark Container Services lets customers deploy Docker containers inside Snowflake\'s network perimeter. Use cases include: serving ML inference endpoints, running LLMs with GPU acceleration, hosting long-lived microservices (web APIs, schedulers), and processing data with non-Python/Java runtimes. SPCS services can query Snowflake tables directly via the Snowpark library, and Snowflake handles orchestration, networking, and secrets management. This is distinct from Snowpark UDFs (short-lived, stateless functions).',
  },

  {
    id: 'd1_d11_14',
    domain: 1,
    topic: 'AUTO_SUSPEND — Minimum Value',
    difficulty: 'medium',
    q: 'A developer sets AUTO_SUSPEND = 10 on a virtual warehouse. What is the minimum valid value, and what happens if a lower value is specified?',
    options: [
      'The minimum is 1 second; values below 1 are rejected with a validation error',
      'The minimum is 60 seconds — Snowflake enforces a 60-second minimum regardless of what value is specified; lower values are silently rounded up to 60',
      'There is no minimum; AUTO_SUSPEND = 0 means the warehouse suspends immediately after the last query completes',
      'The minimum is 60 seconds and Snowflake rejects values below 60 with an error — including AUTO_SUSPEND = 10, which would fail at warehouse creation or ALTER',
    ],
    answer: 'The minimum is 60 seconds — Snowflake enforces a 60-second minimum regardless of what value is specified; lower values are silently rounded up to 60',
    exp: 'AUTO_SUSPEND specifies idle seconds before the warehouse suspends. The minimum enforced value is 60 seconds — Snowflake rounds up any value below 60 to 60. Setting AUTO_SUSPEND = 0 does not mean "suspend immediately"; Snowflake treats it as disabling auto-suspend (the warehouse never auto-suspends). AUTO_SUSPEND is set in seconds, not minutes. The 60-second minimum balances cost savings with the 60-second minimum billing on each resume.',
  },

  {
    id: 'd1_d11_15',
    domain: 1,
    topic: 'Standard vs Secure vs Materialized Views',
    difficulty: 'medium',
    q: 'A team creates a standard view, a secure view, and a materialized view over the same base table. Which statement correctly distinguishes all three?',
    options: [
      'Standard: query definition visible to all users with SHOW VIEWS; Secure: query definition hidden from non-owners; Materialized: pre-computed result stored as data, auto-refreshed by Snowflake, query definition visible to all users',
      'All three hide the underlying query definition — the only difference is performance: standard is slowest, secure is medium, materialized is fastest',
      'Standard and Secure views both execute the base query at query time; Materialized views execute once on creation and are never refreshed unless manually triggered',
      'Secure views require a virtual warehouse to evaluate; standard and materialized views use the Cloud Services layer only',
    ],
    answer: 'Standard: query definition visible to all users with SHOW VIEWS; Secure: query definition hidden from non-owners; Materialized: pre-computed result stored as data, auto-refreshed by Snowflake, query definition visible to all users',
    exp: 'Standard views: transparent DDL, evaluated at query time, no storage cost. Secure views (CREATE SECURE VIEW): DDL hidden from non-owners, blocks certain optimisations that could expose row-level data, evaluated at query time. Materialized views: pre-computed result set stored as actual micro-partitions, auto-refreshed by Snowflake when the base table changes (serverless background maintenance), stored as physical data. Secure materialized views combine both properties: CREATE SECURE MATERIALIZED VIEW.',
  },

  {
    id: 'd1_d11_16',
    domain: 1,
    topic: 'Query Tagging for Attribution',
    difficulty: 'medium',
    q: 'A cost-allocation team wants every query run by their ETL pipeline to be tagged with the application name so it appears in QUERY_ATTRIBUTION_HISTORY. What is the standard Snowflake mechanism?',
    options: [
      'Add a /* comment */ at the beginning of every SQL statement — Snowflake extracts comments as query tags automatically',
      'Create a TAG object and attach it to the service account user — all queries by that user inherit the tag value',
      'Run GRANT QUERY_TAG on the ETL role — the tag is automatically applied to all queries executed by that role',
      'Run ALTER SESSION SET QUERY_TAG = \'etl-pipeline-v2\' at session start — all subsequent queries in that session carry this tag, visible in QUERY_HISTORY.QUERY_TAG and QUERY_ATTRIBUTION_HISTORY for chargeback',
    ],
    answer: 'Run ALTER SESSION SET QUERY_TAG = \'etl-pipeline-v2\' at session start — all subsequent queries in that session carry this tag, visible in QUERY_HISTORY.QUERY_TAG and QUERY_ATTRIBUTION_HISTORY for chargeback',
    exp: 'ALTER SESSION SET QUERY_TAG = \'...\' applies a string tag to all queries executed in the current session. The tag appears in QUERY_HISTORY.QUERY_TAG and can be used in QUERY_ATTRIBUTION_HISTORY for cost attribution and chargeback. Tags can also be set per-statement: ALTER SESSION SET QUERY_TAG = \'...\' before the statement, then reset. Snowflake also supports the COMMENT clause on some statements, but QUERY_TAG is the purpose-built attribution mechanism.',
  },

  {
    id: 'd1_d11_17',
    domain: 1,
    topic: 'Business Critical — Tri-Secret Secure',
    difficulty: 'hard',
    q: 'What is Tri-Secret Secure in Snowflake Business Critical edition, and what does it protect against?',
    options: [
      'Tri-Secret Secure means Snowflake encrypts data with three separate AES-256 keys applied in sequence — making decryption exponentially harder than single-key encryption',
      'Tri-Secret Secure combines a Snowflake-managed key, a customer-managed key (CMK) in the customer\'s cloud KMS, and Snowflake staff physical access controls. Data can only be decrypted when BOTH Snowflake\'s key AND the customer\'s CMK are available — so even Snowflake cannot decrypt the data if the customer revokes their CMK.',
      'Tri-Secret Secure is a three-factor authentication requirement for ACCOUNTADMIN logins: password, MFA device, and a hardware security key',
      'Tri-Secret Secure refers to the three network security controls: TLS in transit, AES-256 at rest, and VPN-only access — available on all Business Critical accounts by default',
    ],
    answer: 'Tri-Secret Secure combines a Snowflake-managed key, a customer-managed key (CMK) in the customer\'s cloud KMS, and Snowflake staff physical access controls. Data can only be decrypted when BOTH Snowflake\'s key AND the customer\'s CMK are available — so even Snowflake cannot decrypt the data if the customer revokes their CMK.',
    exp: 'Tri-Secret Secure requires a SECURITY INTEGRATION with the customer\'s cloud KMS (AWS KMS, Azure Key Vault, or GCP Cloud KMS). Every encryption operation combines Snowflake\'s internal key with the customer\'s CMK. If the customer revokes or disables their CMK, all data becomes inaccessible — even to Snowflake employees. This is the highest available data sovereignty control on the platform. It requires Business Critical edition and adds query latency due to the KMS call on each decryption.',
  },

  {
    id: 'd1_d11_18',
    domain: 1,
    topic: 'Fail-safe — Table Type Differences',
    difficulty: 'hard',
    q: 'An architect is designing a data platform and needs to know the Fail-safe behaviour for each table type. Which statement is correct?',
    options: [
      'Permanent tables: 7 days Fail-safe. Transient tables: 7 days Fail-safe. Temporary tables: 0 days Fail-safe.',
      'Permanent tables: 7 days Fail-safe. Transient tables: 0 days Fail-safe. Temporary tables: 0 days Fail-safe — only permanent tables carry the full Fail-safe protection.',
      'All table types have 7 days of Fail-safe — it is a platform-level protection that cannot be removed',
      'Permanent tables: 7 days Fail-safe on Enterprise, 1 day on Standard. Transient and Temporary: 1 day Fail-safe on all editions.',
    ],
    answer: 'Permanent tables: 7 days Fail-safe. Transient tables: 0 days Fail-safe. Temporary tables: 0 days Fail-safe — only permanent tables carry the full Fail-safe protection.',
    exp: 'Fail-safe is a 7-day additional protection period AFTER Time Travel expires, applied exclusively to permanent tables. During Fail-safe, data is managed by Snowflake Support only — there is no SQL access. Transient tables sacrifice both extended Time Travel (max 1 day) AND Fail-safe (0 days) in exchange for lower CDP storage costs. Temporary tables also have 0 Fail-safe days. External tables have 0 Time Travel and 0 Fail-safe since the data lives in external cloud storage.',
  },

  {
    id: 'd1_d11_19',
    domain: 1,
    topic: 'Zero-copy Cloning — DATA_RETENTION_TIME inheritance',
    difficulty: 'hard',
    q: 'A permanent table orders has DATA_RETENTION_TIME_IN_DAYS = 30. A developer clones it: CREATE TRANSIENT TABLE orders_test CLONE orders. What is orders_test\'s Time Travel retention?',
    options: [
      '30 days — clones inherit the source\'s DATA_RETENTION_TIME_IN_DAYS unconditionally',
      '0 days — TRANSIENT tables always have 0 days of Time Travel regardless of any explicit or inherited setting',
      '1 day — the maximum for a TRANSIENT table is 1 day. The clone cannot exceed the transient table type\'s maximum, even if the source has a higher retention.',
      '7 days — the Fail-safe period is converted to Time Travel retention when cloning across table types',
    ],
    answer: '1 day — the maximum for a TRANSIENT table is 1 day. The clone cannot exceed the transient table type\'s maximum, even if the source has a higher retention.',
    exp: 'When cloning, the target\'s table type determines the maximum possible DATA_RETENTION_TIME_IN_DAYS. A TRANSIENT table has a maximum of 1 day (setting to 0 is also valid). Even if you explicitly set DATA_RETENTION_TIME_IN_DAYS = 30 on a TRANSIENT table, Snowflake caps it at 1 day. The clone inherits from the source as a starting point but is constrained by its own type limits. This is a common trap: creating a transient clone of a permanent table for testing, then discovering it has minimal Time Travel.',
  },

  // ── DOMAIN 2: Account Management & Governance (12 questions) ─────────────

  {
    id: 'd2_d11_01',
    domain: 2,
    topic: 'RBAC vs DAC',
    difficulty: 'easy',
    q: 'In Snowflake, what is the difference between RBAC (Role-Based Access Control) and DAC (Discretionary Access Control)?',
    options: [
      'RBAC and DAC are synonyms in Snowflake — both refer to the system of granting privileges through roles',
      'RBAC means privileges are granted to roles which are assigned to users — access is defined at the role level, not per user. DAC means object owners can grant privileges on their objects to other roles — every Snowflake object has an owner who controls access to it.',
      'RBAC is Snowflake\'s internal access system; DAC is the external OAuth-based access control for third-party integrations',
      'RBAC is mandatory for all accounts; DAC is optional and must be enabled with ALTER ACCOUNT SET ENABLE_DAC = TRUE',
    ],
    answer: 'RBAC means privileges are granted to roles which are assigned to users — access is defined at the role level, not per user. DAC means object owners can grant privileges on their objects to other roles — every Snowflake object has an owner who controls access to it.',
    exp: 'Snowflake uses both models simultaneously. RBAC: all privileges flow through roles, not directly to users. Users have roles; roles have privileges. This centralises access control and makes it manageable at scale. DAC: every object (table, warehouse, database, etc.) has an owner role. The owner has full control and can grant privileges on that object to other roles — discretion is exercised by the owner. Together, these models give Snowflake a flexible, hierarchical access control system.',
  },

  {
    id: 'd2_d11_02',
    domain: 2,
    topic: 'USERADMIN Role',
    difficulty: 'easy',
    q: 'What is the primary purpose of the USERADMIN system role in Snowflake?',
    options: [
      'USERADMIN manages user and role lifecycle — it can CREATE USER, DROP USER, CREATE ROLE, DROP ROLE, and GRANT ROLE TO USER. It cannot grant privileges on data objects (tables, databases) — that requires SYSADMIN or SECURITYADMIN.',
      'USERADMIN is the role designated for IT administrators to manage warehouse sizing and credit allocation',
      'USERADMIN has the same privileges as SECURITYADMIN but is restricted to managing users in a single schema',
      'USERADMIN can grant any privilege to any role — it is the delegated administration role for sub-accountadmins',
    ],
    answer: 'USERADMIN manages user and role lifecycle — it can CREATE USER, DROP USER, CREATE ROLE, DROP ROLE, and GRANT ROLE TO USER. It cannot grant privileges on data objects (tables, databases) — that requires SYSADMIN or SECURITYADMIN.',
    exp: 'USERADMIN is scoped strictly to identity management: create/drop users and roles, assign roles to users. It is intentionally limited — it cannot grant object privileges (SELECT, INSERT, USAGE) which are the domain of SYSADMIN (for objects under SYSADMIN\'s hierarchy) or SECURITYADMIN (which inherits USERADMIN and also has MANAGE GRANTS). The separation of identity management (USERADMIN) from access control (SECURITYADMIN) and object management (SYSADMIN) follows least-privilege principle.',
  },

  {
    id: 'd2_d11_03',
    domain: 2,
    topic: 'Key-pair Authentication',
    difficulty: 'easy',
    q: 'A service account for a CI/CD pipeline needs to authenticate to Snowflake without storing a password. Key-pair authentication is chosen. What must be stored in Snowflake?',
    options: [
      'The private key — Snowflake stores the private key and uses it to verify the service account\'s signatures',
      'Both the public and private key — Snowflake needs the full key pair to perform mutual TLS authentication',
      'The public key hash (fingerprint) only — Snowflake stores a SHA256 hash of the public key for verification',
      'The public key — the service account holds the private key locally. On authentication, Snowflake verifies the signed JWT using the public key registered on the user with ALTER USER ... SET RSA_PUBLIC_KEY.',
    ],
    answer: 'The public key — the service account holds the private key locally. On authentication, Snowflake verifies the signed JWT using the public key registered on the user with ALTER USER ... SET RSA_PUBLIC_KEY.',
    exp: 'Key-pair auth follows standard asymmetric cryptography: the client generates a 2048-bit or 4096-bit RSA key pair. The PUBLIC key is uploaded to Snowflake (ALTER USER svc_account SET RSA_PUBLIC_KEY = \'MIIBIjAN...\') and stored in Snowflake\'s metadata. The PRIVATE key never leaves the client\'s secure key store. During authentication, the client creates a JWT signed with the private key; Snowflake verifies the signature using the stored public key. No password is transmitted or stored.',
  },

  {
    id: 'd2_d11_04',
    domain: 2,
    topic: 'ORGADMIN vs ACCOUNTADMIN Scope',
    difficulty: 'easy',
    q: 'A Snowflake organisation has 8 accounts. An administrator needs to list all accounts in the organisation. Which role must be active?',
    options: [
      'ACCOUNTADMIN in any one of the 8 accounts — ACCOUNTADMIN has full visibility across all accounts in the organisation',
      'SYSADMIN — it is the top-level role for organisational management in Snowflake',
      'ORGADMIN — it is the organisation-level role that can run SHOW ACCOUNTS to list all accounts in the organisation, view organisational-level usage, and manage cross-account operations',
      'SECURITYADMIN — security roles have cross-account visibility for audit and compliance purposes',
    ],
    answer: 'ORGADMIN — it is the organisation-level role that can run SHOW ACCOUNTS to list all accounts in the organisation, view organisational-level usage, and manage cross-account operations',
    exp: 'ORGADMIN is enabled on one designated account in the organisation (the "org admin account") and can be granted to specific users. SHOW ACCOUNTS returns all accounts in the org when run with ORGADMIN active. ACCOUNTADMIN in one account does not grant visibility into other accounts — it is scoped to that single account. ORGADMIN is also used for managing Business Critical cross-cloud replication at the org level and to view consolidated credit usage.',
  },

  {
    id: 'd2_d11_05',
    domain: 2,
    topic: 'Session Policies',
    difficulty: 'medium',
    q: 'A security team wants to ensure all interactive user sessions are terminated after 30 minutes of inactivity. What Snowflake feature enforces this?',
    options: [
      'A Network Policy with an IDLE_TIMEOUT = 1800 parameter — network policies control both IP access and session length',
      'ALTER ACCOUNT SET STATEMENT_TIMEOUT_IN_SECONDS = 1800 — statement timeouts also apply to idle sessions',
      'A Session Policy with SESSION_IDLE_TIMEOUT_MINS = 30 — session policies control idle session timeout and can be applied at the account level or to specific users/roles. After the timeout, users must re-authenticate.',
      'GRANT IDLE_TIMEOUT ON ACCOUNT TO ROLE SYSADMIN — a DDL grant activates the platform-level idle timeout enforcement',
    ],
    answer: 'A Session Policy with SESSION_IDLE_TIMEOUT_MINS = 30 — session policies control idle session timeout and can be applied at the account level or to specific users/roles. After the timeout, users must re-authenticate.',
    exp: 'Session policies (CREATE SESSION POLICY ... SET SESSION_IDLE_TIMEOUT_MINS = N) define how long a session can remain idle before being terminated. They can be applied at the account level (ALTER ACCOUNT SET SESSION POLICY) or assigned to specific users or roles. After the idle timeout, the user\'s session is closed and they must log in again. Session policies can also enforce MFA requirements. Network policies govern which IPs can connect — they do not control session length.',
  },

  {
    id: 'd2_d11_06',
    domain: 2,
    topic: 'External OAuth — Security Integration',
    difficulty: 'medium',
    q: 'A developer is integrating a third-party identity provider (Okta) with Snowflake so users can authenticate using OAuth 2.0 tokens from Okta. What Snowflake object is required?',
    options: [
      'CREATE EXTERNAL OAUTH INTEGRATION TYPE = EXTERNAL_OAUTH EXTERNAL_OAUTH_TYPE = OKTA — a Security Integration of type EXTERNAL_OAUTH that specifies the IdP, token endpoint, issuer, and audience validates tokens from the external IdP before granting Snowflake access',
      'CREATE SAML INTEGRATION — SAML 2.0 is the correct protocol for Okta; OAuth is not supported for user authentication',
      'ALTER USER SET OAUTH_CLIENT = \'okta\' — setting the OAuth client on each user routes their logins through Okta automatically',
      'CREATE API INTEGRATION TYPE = OAUTH — API integrations are the Snowflake mechanism for all external OAuth providers',
    ],
    answer: 'CREATE EXTERNAL OAUTH INTEGRATION TYPE = EXTERNAL_OAUTH EXTERNAL_OAUTH_TYPE = OKTA — a Security Integration of type EXTERNAL_OAUTH that specifies the IdP, token endpoint, issuer, and audience validates tokens from the external IdP before granting Snowflake access',
    exp: 'A Security Integration with TYPE = EXTERNAL_OAUTH and EXTERNAL_OAUTH_TYPE = OKTA (or AZURE, PING_FEDERATE, or CUSTOM) configures Snowflake to accept JWT access tokens issued by the external IdP. Key parameters include EXTERNAL_OAUTH_ISSUER (IdP\'s issuer URI), EXTERNAL_OAUTH_JWS_KEYS_URL (JWKS endpoint for token signature verification), EXTERNAL_OAUTH_TOKEN_USER_MAPPING_CLAIM (which claim maps to the Snowflake user), and EXTERNAL_OAUTH_AUDIENCE_LIST. SAML integrations handle SSO login flows, not API-to-API token flows.',
  },

  {
    id: 'd2_d11_07',
    domain: 2,
    topic: 'Object Tagging — TAG_REFERENCES',
    difficulty: 'medium',
    q: 'A governance team wants a query that shows all columns in the database that have the tag SENSITIVITY = \'PII\' applied. Which function/view should they use?',
    options: [
      'SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE COLUMN_COMMENT LIKE \'%PII%\' — column comments store tag values in Snowflake',
      'SHOW TAGS IN DATABASE — returns a list of all tag assignments across the database in one output',
      'SELECT * FROM SNOWFLAKE.ACCOUNT_USAGE.TAGS WHERE TAG_VALUE = \'PII\' — the TAGS view stores all current tag assignments',
      'SELECT * FROM TABLE(SNOWFLAKE.INFORMATION_SCHEMA.TAG_REFERENCES(\'SENSITIVITY\', \'TAG\')) WHERE TAG_VALUE = \'PII\' — TAG_REFERENCES() is the function for discovering all objects tagged with a specific tag and value',
    ],
    answer: 'SELECT * FROM TABLE(SNOWFLAKE.INFORMATION_SCHEMA.TAG_REFERENCES(\'SENSITIVITY\', \'TAG\')) WHERE TAG_VALUE = \'PII\' — TAG_REFERENCES() is the function for discovering all objects tagged with a specific tag and value',
    exp: 'TAG_REFERENCES(tag_name, tag_domain) is an INFORMATION_SCHEMA table function that returns all associations between a specific tag and Snowflake objects. The output includes the tagged object\'s name, type (TABLE, COLUMN, WAREHOUSE, etc.), the tag value, and the level at which it was applied (directly or inherited). TAG_REFERENCES_ALL_COLUMNS(object_name, object_domain) is the variant for listing all tags on all columns of a specific table. ACCOUNT_USAGE.TAG_REFERENCES is the equivalent with historical retention.',
  },

  {
    id: 'd2_d11_08',
    domain: 2,
    topic: 'Aggregation Policies',
    difficulty: 'medium',
    q: 'A data team attaches an Aggregation Policy (minimum_group_size = 5) to a table. A user runs SELECT COUNT(*), region FROM sensitive_data GROUP BY region and the result for one region has only 3 rows. What is returned for that region?',
    options: [
      'The row count 3 is returned normally — Aggregation Policies only apply to non-aggregate SELECT queries',
      'That region\'s row is omitted from the result set entirely — groups below the minimum size are suppressed from the output',
      'An error is raised: "Aggregation Policy violation: insufficient group size"',
      'NULL is returned for COUNT(*) for that region, but the region name is still shown in the results',
    ],
    answer: 'That region\'s row is omitted from the result set entirely — groups below the minimum size are suppressed from the output',
    exp: 'Aggregation Policies enforce privacy by preventing the disclosure of statistics on groups with too few members (a k-anonymity-style control). When minimum_group_size = 5, any GROUP BY bucket with fewer than 5 underlying rows is silently dropped from the result — neither the group key nor the aggregate value appears. This prevents re-identification from small cohort statistics. The policy is applied transparently; the user does not receive an error — they simply do not see the suppressed rows.',
  },

  {
    id: 'd2_d11_09',
    domain: 2,
    topic: 'Trust Center',
    difficulty: 'medium',
    q: 'What does Snowflake Trust Center assess and report on?',
    options: [
      'Network latency and uptime metrics between the customer\'s on-premises systems and Snowflake\'s cloud endpoints',
      'Credit consumption by role and warehouse, identifying cost inefficiencies and budget overruns',
      'The security posture of the Snowflake account against recognised industry benchmarks (CIS Snowflake Benchmark), including checks for MFA enforcement, network policy coverage, admin role usage, password complexity, and audit logging gaps',
      'Data quality metrics — row counts, null rates, and schema drift across all tables in the account',
    ],
    answer: 'The security posture of the Snowflake account against recognised industry benchmarks (CIS Snowflake Benchmark), including checks for MFA enforcement, network policy coverage, admin role usage, password complexity, and audit logging gaps',
    exp: 'Trust Center is Snowflake\'s built-in security scanning tool. It continuously evaluates the account against the CIS Snowflake Benchmark controls (e.g., "Are all ACCOUNTADMIN users enrolled in MFA?", "Is there a network policy applied at the account level?", "Are there users without MFA?"). Results are shown in Snowsight as a scored risk summary with remediation guidance. Trust Center is not a cost tool (that\'s Snowsight cost management) or a data quality tool.',
  },

  {
    id: 'd2_d11_10',
    domain: 2,
    topic: 'Encryption Key Hierarchy',
    difficulty: 'hard',
    q: 'Snowflake uses a hierarchical encryption key architecture. Arranging from highest to lowest in the hierarchy, which sequence is correct?',
    options: [
      'Root key → Account master key → Table master key → File key — data files are encrypted with a file key, which is wrapped by the table master key, which is wrapped by the account master key, all ultimately derived from the root key managed by Snowflake',
      'Account master key → Root key → File key → Table master key — the account key is the top of the hierarchy',
      'File key → Table key → Account key → Root key — keys are arranged from smallest data scope to largest scope, bottom-up',
      'Root key → Table master key → Account master key → File key — the root key directly encrypts table keys for efficiency',
    ],
    answer: 'Root key → Account master key → Table master key → File key — data files are encrypted with a file key, which is wrapped by the table master key, which is wrapped by the account master key, all ultimately derived from the root key managed by Snowflake',
    exp: 'Snowflake\'s key hierarchy: (1) Root key — Snowflake-managed, highest level. (2) Account master key — unique per account. (3) Table master key — unique per table. (4) File key — unique per micro-partition file, used to encrypt the actual data. Each key encrypts (wraps) the key below it. Key rotation at the account level rotates the account master key and re-wraps all table master keys — without re-encrypting the data files themselves. For Tri-Secret Secure, the customer\'s CMK is integrated at the account master key level.',
  },

  {
    id: 'd2_d11_11',
    domain: 2,
    topic: 'Replication Groups vs Failover Groups',
    difficulty: 'hard',
    q: 'What is the key functional difference between a Replication Group and a Failover Group in Snowflake?',
    options: [
      'Replication Groups replicate only data; Failover Groups replicate only account objects (users, roles, warehouses) — they must be combined for full DR',
      'Replication Groups are for within-region replication; Failover Groups are for cross-region replication',
      'Replication Groups support read-only secondary replicas for analytics offloading. Failover Groups add the ability to promote the secondary to primary (ALTER DATABASE ... PRIMARY), enabling actual disaster recovery with a switchover — Replication Groups alone cannot be promoted.',
      'Failover Groups replicate data between cloud providers; Replication Groups only work within the same cloud provider and region',
    ],
    answer: 'Replication Groups support read-only secondary replicas for analytics offloading. Failover Groups add the ability to promote the secondary to primary (ALTER DATABASE ... PRIMARY), enabling actual disaster recovery with a switchover — Replication Groups alone cannot be promoted.',
    exp: 'Both Replication Groups and Failover Groups replicate a set of databases and account objects to one or more secondary accounts. The critical distinction is promotion capability: Replication Groups create read-only secondaries (useful for offloading read workloads to a different region) but cannot be promoted to primary. Failover Groups can be promoted — ALTER FAILOVER GROUP ... PRIMARY — which is the mechanism for DR switchover. Business Critical edition is required for both cross-cloud and cross-region replication.',
  },

  {
    id: 'd2_d11_12',
    domain: 2,
    topic: 'ACCOUNT_USAGE Database Roles',
    difficulty: 'medium',
    q: 'A data engineer needs read access to SNOWFLAKE.ACCOUNT_USAGE views to monitor query history and warehouse credit usage, but should NOT have full ACCOUNTADMIN access. Which database role grants the minimum necessary access?',
    options: [
      'SYSADMIN — it includes read access to all ACCOUNT_USAGE views as part of system administration',
      'USAGE_VIEWER — this database role in the SNOWFLAKE database grants SELECT on warehouse metering history, query history, and usage-related views without exposing security-sensitive views like LOGIN_HISTORY or ACCESS_HISTORY',
      'PUBLIC — the PUBLIC role automatically has read access to all ACCOUNT_USAGE views for monitoring purposes',
      'GOVERNANCE_VIEWER — this role provides read access to all governance and security views, including query history and credit usage',
    ],
    answer: 'USAGE_VIEWER — this database role in the SNOWFLAKE database grants SELECT on warehouse metering history, query history, and usage-related views without exposing security-sensitive views like LOGIN_HISTORY or ACCESS_HISTORY',
    exp: 'Snowflake defines several database roles within the SNOWFLAKE database to grant scoped access to ACCOUNT_USAGE: OBJECT_VIEWER (DDL/schema objects), USAGE_VIEWER (credit and warehouse usage metrics), GOVERNANCE_VIEWER (policies, tags, classification), SECURITY_VIEWER (security-sensitive views like LOGIN_HISTORY, ACCESS_HISTORY). USAGE_VIEWER is the right fit for cost monitoring without security audit access. Grant these via: GRANT DATABASE ROLE SNOWFLAKE.USAGE_VIEWER TO ROLE my_analyst_role.',
  },

  // ── DOMAIN 3: Data Loading, Unloading & Connectivity (11 questions) ───────

  {
    id: 'd3_d11_01',
    domain: 3,
    topic: 'Stage Types — Syntax',
    difficulty: 'easy',
    q: 'A developer wants to list files that have been PUT to the user stage for user ALICE. Which LIST command is correct?',
    options: [
      'LIST @ALICE — the user stage is referenced by the user\'s login name',
      'LIST @USER.ALICE — the USER prefix identifies a user stage',
      'LIST @~/ALICE — the ~/ prefix is used for external stages only',
      'LIST @~ — the user stage is always referenced as @~ (tilde), regardless of which user owns it, and is only accessible from a session authenticated as that user',
    ],
    answer: 'LIST @~ — the user stage is always referenced as @~ (tilde), regardless of which user owns it, and is only accessible from a session authenticated as that user',
    exp: 'In Snowflake\'s stage naming convention: @~ is the user stage (per-user, auto-created, not shareable). @% is the table stage (per-table, auto-created). @stage_name is a named stage. The user stage @~ is session-scoped — you can only access your own user stage. You cannot LIST @~ while authenticated as another user. Named stages (including external stages) are the appropriate choice for shared or production data loading.',
  },

  {
    id: 'd3_d11_02',
    domain: 3,
    topic: 'Storage Integration — Security Model',
    difficulty: 'easy',
    q: 'Why does a Snowflake Storage Integration for an S3 external stage use an IAM role ARN rather than an access key and secret key?',
    options: [
      'IAM role ARNs are required by S3 for all cross-account access — access keys are not accepted for external stage authentication',
      'Storage Integrations store no credentials in Snowflake at all. Instead, Snowflake assumes a customer-created IAM role (via an AWS STS AssumeRole call) — the credentials are ephemeral tokens generated at access time, eliminating the security risk of storing long-lived secrets in Snowflake metadata.',
      'S3 access keys are limited to 10 MB/s transfer — IAM role assumptions provide higher throughput for bulk data loading',
      'IAM role ARNs automatically rotate every 24 hours, meeting Snowflake\'s mandatory credential rotation policy for external stages',
    ],
    answer: 'Storage Integrations store no credentials in Snowflake at all. Instead, Snowflake assumes a customer-created IAM role (via an AWS STS AssumeRole call) — the credentials are ephemeral tokens generated at access time, eliminating the security risk of storing long-lived secrets in Snowflake metadata.',
    exp: 'The Storage Integration pattern works as follows: the customer creates an IAM role in their AWS account, grants it the necessary S3 permissions, and adds Snowflake\'s IAM user (provided by DESCRIBE INTEGRATION) as a trusted principal. When Snowflake needs to access S3, it calls AWS STS to assume the customer\'s IAM role and gets a short-lived token. No static access key/secret is stored — this is the principle of least privilege and avoids credential leakage through Snowflake metadata or backups.',
  },

  {
    id: 'd3_d11_03',
    domain: 3,
    topic: 'COPY INTO Unload — HEADER Option',
    difficulty: 'easy',
    q: 'A developer unloads a Snowflake table to CSV files on an S3 external stage. They want the first row of each file to contain column names. Which COPY INTO option achieves this?',
    options: [
      'INCLUDE_HEADER = TRUE — the parameter to add column name headers to unloaded CSV files',
      'COLUMN_NAMES = TRUE — this flag writes the column names in the file format definition',
      'SCHEMA = TRUE — setting schema to TRUE embeds column metadata at the top of each file',
      'HEADER = TRUE in the FILE_FORMAT — when unloading to CSV, HEADER = TRUE writes column names as the first row of each output file. The column names come from the SELECT column aliases or the table column names.',
    ],
    answer: 'HEADER = TRUE in the FILE_FORMAT — when unloading to CSV, HEADER = TRUE writes column names as the first row of each output file. The column names come from the SELECT column aliases or the table column names.',
    exp: 'When using COPY INTO @stage FROM (SELECT ...) FILE_FORMAT = (TYPE = CSV HEADER = TRUE), each output file starts with a header row listing the column names. If the query uses aliases (e.g., SELECT first_name AS name), the alias is used as the header. HEADER = TRUE is a file format option valid for CSV unload — it is not recognised for Parquet, Avro, or ORC (those formats embed schema in the file structure). SINGLE = TRUE can be combined with HEADER = TRUE to produce a single file with a header.',
  },

  {
    id: 'd3_d11_04',
    domain: 3,
    topic: 'COPY INTO — VALIDATION_MODE',
    difficulty: 'medium',
    q: 'What does COPY INTO orders FROM @my_stage VALIDATION_MODE = \'RETURN_ERRORS\' do?',
    options: [
      'It loads the data and returns a result set of all rows that had errors — a partial load with an error report',
      'It validates all files in the stage against the table\'s schema without loading any data. It returns only the rows that WOULD have caused errors, including the file name, line number, and error message. No data is loaded.',
      'It loads a 1% sample of rows and validates them for errors before committing the full load',
      'VALIDATION_MODE is only valid for JSON files — it performs schema validation against a JSON Schema document',
    ],
    answer: 'It validates all files in the stage against the table\'s schema without loading any data. It returns only the rows that WOULD have caused errors, including the file name, line number, and error message. No data is loaded.',
    exp: 'VALIDATION_MODE is a dry-run option for COPY INTO. With RETURN_ERRORS, Snowflake scans all staged files for parsing and type errors without inserting any rows. The output is a result set listing each error: file name, line number, byte position, column name, error description. Other VALIDATION_MODE values: RETURN_N_ROWS (return first N valid rows as a preview), RETURN_ALL_ERRORS (return all errors from all files). This allows pre-flight checking before committing to a load.',
  },

  {
    id: 'd3_d11_05',
    domain: 3,
    topic: 'Snowpipe Streaming — Latency vs Classic Snowpipe',
    difficulty: 'medium',
    q: 'A development team is comparing Snowpipe (classic) and Snowpipe Streaming for a real-time fraud detection use case. What is the key latency difference?',
    options: [
      'Classic Snowpipe provides sub-second latency; Snowpipe Streaming is batch-oriented with 5-minute latency',
      'Both have identical latency — the only difference is the API surface (REST vs SDK)',
      'Classic Snowpipe batch-loads files from a stage with latency of around 1 minute or more, depending on file size and arrival rate. Snowpipe Streaming uses a row-level SDK to ingest individual rows with approximately 1-second end-to-end latency into Snowflake tables, making it suitable for real-time use cases.',
      'Snowpipe Streaming has higher latency than classic Snowpipe because each row triggers a separate COPY INTO transaction',
    ],
    answer: 'Classic Snowpipe batch-loads files from a stage with latency of around 1 minute or more, depending on file size and arrival rate. Snowpipe Streaming uses a row-level SDK to ingest individual rows with approximately 1-second end-to-end latency into Snowflake tables, making it suitable for real-time use cases.',
    exp: 'Classic Snowpipe requires data to be staged as files first (PUT or cloud event notification), then loads the files with ~1-minute latency and bills per file loaded (serverless compute). Snowpipe Streaming (Java/Python SDK) allows applications to write rows directly to Snowflake channels without intermediate staging, achieving ~1-second latency. It bills differently — by data ingested volume, not by file. Snowpipe Streaming is the right choice for fraud detection, real-time dashboards, or CDC from transactional databases.',
  },

  {
    id: 'd3_d11_06',
    domain: 3,
    topic: 'Streams — Append-only Type',
    difficulty: 'medium',
    q: 'An engineer creates an APPEND-ONLY stream on a table. What change events does the stream capture compared to a standard stream?',
    options: [
      'Append-only streams capture INSERTs and UPDATEs but not DELETEs — they provide all changes except row deletions',
      'Append-only streams capture only INSERT events. UPDATE and DELETE operations on the source table are NOT reflected in the stream — it is optimised for tables where rows are only ever added, not modified or removed.',
      'Append-only streams are identical to standard streams — "append-only" describes the stream\'s consumption pattern, not what it captures',
      'Append-only streams capture DELETEs only — they track which rows have been removed from the table',
    ],
    answer: 'Append-only streams capture only INSERT events. UPDATE and DELETE operations on the source table are NOT reflected in the stream — it is optimised for tables where rows are only ever added, not modified or removed.',
    exp: 'An APPEND_ONLY = TRUE stream records only net-new rows (inserts) into the source table. It ignores UPDATE and DELETE operations entirely. This is more efficient than a standard stream for high-volume append workloads (like event logs or sensor data) because it does not need to track before/after images for modified rows. Standard streams capture all changes: INSERT (METADATA$ACTION = INSERT, METADATA$ISUPDATE = FALSE), UPDATE (two rows: delete + insert with METADATA$ISUPDATE = TRUE), and DELETE (METADATA$ACTION = DELETE).',
  },

  {
    id: 'd3_d11_07',
    domain: 3,
    topic: 'Tasks — SYSTEM$STREAM_HAS_DATA',
    difficulty: 'medium',
    q: 'A scheduled Snowflake Task runs every 5 minutes to process a stream. When there is no new data in the stream, the task still executes, consuming credits. What is the correct solution?',
    options: [
      'Add a WHEN clause: WHEN SYSTEM$STREAM_HAS_DATA(\'my_stream\') — this conditional makes the task skip execution if the referenced stream is empty, consuming zero compute when there is no data to process',
      'Set a task SCHEDULE = \'USING CRON 0 * * * *\' to run less frequently — less frequent scheduling reduces wasted runs',
      'Convert the task to a serverless task — serverless tasks automatically detect empty streams and skip processing internally',
      'Create a separate "watchdog" task that monitors the stream and calls EXECUTE TASK my_task only when data is detected',
    ],
    answer: 'Add a WHEN clause: WHEN SYSTEM$STREAM_HAS_DATA(\'my_stream\') — this conditional makes the task skip execution if the referenced stream is empty, consuming zero compute when there is no data to process',
    exp: 'WHEN SYSTEM$STREAM_HAS_DATA(\'stream_name\') in the task definition is the canonical pattern for event-driven processing with Streams + Tasks. The function returns TRUE if the stream has unconsumed change records, FALSE if empty. When the WHEN clause evaluates to FALSE, the task is skipped entirely — no warehouse starts, no credits are consumed. This converts a polling pattern into a near-event-driven one. SYSTEM$STREAM_HAS_DATA can also be referenced in task DAG dependencies.',
  },

  {
    id: 'd3_d11_08',
    domain: 3,
    topic: 'Dynamic Tables — INITIALIZE',
    difficulty: 'medium',
    q: 'When creating a Dynamic Table, what does the INITIALIZE parameter control?',
    options: [
      'INITIALIZE controls the initial TARGET_LAG — a higher value means the table initialises more slowly with less compute',
      'INITIALIZE = \'ON_SCHEDULE\' means the table is created empty and only filled on the first scheduled refresh. INITIALIZE = \'ON_CREATE\' (the default) triggers an immediate full refresh at creation time to populate the table before the first scheduled cycle.',
      'INITIALIZE specifies the Snowflake warehouse to use for the initial full load — subsequent refreshes use the serverless compute model',
      'INITIALIZE defines the starting point in the source table\'s change history — similar to AT TIMESTAMP for Time Travel',
    ],
    answer: 'INITIALIZE = \'ON_SCHEDULE\' means the table is created empty and only filled on the first scheduled refresh. INITIALIZE = \'ON_CREATE\' (the default) triggers an immediate full refresh at creation time to populate the table before the first scheduled cycle.',
    exp: 'When you CREATE DYNAMIC TABLE ... INITIALIZE = ON_CREATE (default), Snowflake immediately performs a full refresh so the table is populated with current data right away. INITIALIZE = ON_SCHEDULE creates the table in an empty state and waits for the first refresh cycle (driven by TARGET_LAG) before populating it. ON_SCHEDULE is useful when you want to defer the compute cost of the initial full load to a specific time window. Both modes subsequently use incremental refreshes when possible, falling back to full refresh when needed.',
  },

  {
    id: 'd3_d11_09',
    domain: 3,
    topic: 'INFER_SCHEMA',
    difficulty: 'hard',
    q: 'What does INFER_SCHEMA() do in Snowflake and which file formats does it support?',
    options: [
      'INFER_SCHEMA automatically detects CSV column delimiters and determines the number of columns — it works on CSV files only',
      'INFER_SCHEMA creates a table with inferred column names and types by scanning sample rows from a staged file — it works on all Snowflake-supported file formats including CSV, JSON, Avro, ORC, and Parquet',
      'INFER_SCHEMA reads the embedded metadata schema from columnar file formats (Parquet, Avro, ORC) and returns the column names and Snowflake data types. It does NOT support CSV or JSON (which have no embedded schema). The result can be used with CREATE TABLE USING TEMPLATE to auto-create a matching table.',
      'INFER_SCHEMA is a UI-only feature in Snowsight — it is not available as a SQL function',
    ],
    answer: 'INFER_SCHEMA reads the embedded metadata schema from columnar file formats (Parquet, Avro, ORC) and returns the column names and Snowflake data types. It does NOT support CSV or JSON (which have no embedded schema). The result can be used with CREATE TABLE USING TEMPLATE to auto-create a matching table.',
    exp: 'INFER_SCHEMA reads schema metadata embedded in self-describing file formats: Parquet, Avro, and ORC. It returns a result set with COLUMN_NAME, TYPE, NULLABLE, and other metadata. This powers the CREATE TABLE ... USING TEMPLATE (SELECT ARRAY_AGG(OBJECT_CONSTRUCT(*)) FROM TABLE(INFER_SCHEMA(...))) pattern for auto-creating tables without manually writing column definitions. CSV has no embedded schema (column names and types are not stored in the file), so INFER_SCHEMA does not support it.',
  },

  {
    id: 'd3_d11_10',
    domain: 3,
    topic: 'Git Integration',
    difficulty: 'hard',
    q: 'What types of Snowflake objects can be stored and version-controlled using Snowflake\'s Git Integration?',
    options: [
      'Only Snowflake worksheets and Snowsight dashboard definitions — Git Integration is scoped to the UI layer',
      'Any flat text files in a Git repository — Snowflake treats all files as generic text and does not distinguish object types',
      'Stored procedures, UDFs, tasks, and Streamlit app files — essentially any code artifact that can be stored as a file in a Git repository can be referenced and deployed from a Git stage in Snowflake',
      'Only Python UDFs — Git Integration was designed specifically to manage Python package dependencies for UDFs using requirements.txt files',
    ],
    answer: 'Stored procedures, UDFs, tasks, and Streamlit app files — essentially any code artifact that can be stored as a file in a Git repository can be referenced and deployed from a Git stage in Snowflake',
    exp: 'Snowflake Git Integration creates a Git Repository object backed by a linked Git repo (GitHub, GitLab, Bitbucket, etc.). Files in the repo are accessible via a special internal stage (@git_repo_name/branches/main/). You can reference stored procedure handler files, UDF code, Streamlit app files, SQL migration scripts, and task logic directly from the Git stage — enabling code review, versioning, and CI/CD workflows for Snowflake objects. The integration also supports secrets for private repos.',
  },

  {
    id: 'd3_d11_11',
    domain: 3,
    topic: 'External Functions — API Integration',
    difficulty: 'hard',
    q: 'A data engineer wants to call an external REST API (e.g., a fraud scoring service) from a Snowflake SQL query. What is the correct Snowflake architecture for this?',
    options: [
      'Create an API INTEGRATION object pointing to an API Gateway endpoint in the customer\'s cloud account, then CREATE EXTERNAL FUNCTION that references the integration. The function is called as a scalar SQL function — Snowflake sends batches of rows to the API Gateway which proxies to the REST service, and the results are returned as a column in the result set.',
      'Use a Python UDF with the requests library — Python UDFs can make HTTP calls to external services directly',
      'Create a TASK that calls SYSTEM$HTTP_REQUEST() on a schedule to fetch data from the external API and store results in a staging table',
      'Use Snowpark Container Services to host a microservice that wraps the external API — external functions are only for internal Snowflake services',
    ],
    answer: 'Create an API INTEGRATION object pointing to an API Gateway endpoint in the customer\'s cloud account, then CREATE EXTERNAL FUNCTION that references the integration. The function is called as a scalar SQL function — Snowflake sends batches of rows to the API Gateway which proxies to the REST service, and the results are returned as a column in the result set.',
    exp: 'External Functions allow SQL UDFs to call HTTP endpoints outside Snowflake. The architecture requires: (1) An API Gateway (AWS API Gateway, Azure API Management, or GCP API Gateway) that acts as a proxy between Snowflake and the target REST service. (2) A Snowflake API INTEGRATION object that specifies the allowed URL prefixes and credentials. (3) A CREATE EXTERNAL FUNCTION statement that maps SQL input/output columns to the API\'s JSON request/response format. Snowflake batches rows, calls the API, and returns the response columns to the query.',
  },

  // ── DOMAIN 4: Performance, Querying & Transformation (13 questions) ───────

  {
    id: 'd4_d11_01',
    domain: 4,
    topic: 'Result Cache — DML Invalidation',
    difficulty: 'easy',
    q: 'A user runs SELECT SUM(amount) FROM orders and the result is cached. A colleague then runs INSERT INTO orders VALUES (999, 50.00). What happens to the cached result?',
    options: [
      'Nothing — the result cache holds the value for 24 hours regardless of DML on the underlying table',
      'The cache entry is immediately invalidated when the DML commits — any subsequent identical SELECT must re-execute against the warehouse and return the updated sum',
      'The cache is soft-invalidated: the next query returns the cached value but triggers a background re-computation',
      'Only the ACCOUNTADMIN role can manually invalidate specific cache entries after a DML change',
    ],
    answer: 'The cache entry is immediately invalidated when the DML commits — any subsequent identical SELECT must re-execute against the warehouse and return the updated sum',
    exp: 'The result cache is invalidated whenever the underlying table\'s data changes (INSERT, UPDATE, DELETE, MERGE, TRUNCATE, COPY INTO, or the table is swapped). Snowflake tracks the table\'s current version — if the version has changed since the result was cached, the cached entry is not served. The 24-hour TTL is a maximum; DML invalidation is the primary eviction trigger. This ensures cached results are never stale — they either represent the current data or have been evicted.',
  },

  {
    id: 'd4_d11_02',
    domain: 4,
    topic: 'Warehouse Local Cache — Cleared on Resize',
    difficulty: 'easy',
    q: 'A BI team\'s warehouse is warm from a morning of dashboard queries. An admin scales it from MEDIUM to LARGE. What happens to the warehouse local SSD cache?',
    options: [
      'The cache is preserved — Snowflake migrates the cached micro-partition files to the new node configuration',
      'Only the metadata portion of the cache is cleared; data files remain cached on the original nodes',
      'The cache is completely cleared — resizing a warehouse provisions new compute nodes, none of which have any cached micro-partitions. The next queries will read cold from cloud storage until the new nodes warm up.',
      'The cache is cleared only if the resize crosses a T-shirt size boundary (e.g., XS to XL), not for small size changes',
    ],
    answer: 'The cache is completely cleared — resizing a warehouse provisions new compute nodes, none of which have any cached micro-partitions. The next queries will read cold from cloud storage until the new nodes warm up.',
    exp: 'Resizing a virtual warehouse (scaling up or down) provisions new EC2/VM nodes at the new size. The old nodes are released. Since the cache lives on the local SSD of each node, all cached data is lost — the new nodes start cold. This is an important operational consideration: avoid resizing active BI warehouses during peak query periods as the performance dip from cold cache can be significant. The warehouse local cache is also cleared on SUSPEND; it persists only while the warehouse runs.',
  },

  {
    id: 'd4_d11_03',
    domain: 4,
    topic: 'Broadcast Join vs Hash Join',
    difficulty: 'easy',
    q: 'Snowflake\'s query optimiser automatically chooses between broadcast joins and hash joins. In which scenario would a BROADCAST join be preferred?',
    options: [
      'When both tables are large and have equal row counts — broadcast is always faster when table sizes are symmetric',
      'When the query includes an ORDER BY clause — broadcast joins are required to maintain sort order across distributed nodes',
      'When the query spans multiple warehouses — broadcast is the only join type supported across multi-cluster configurations',
      'When one table is significantly smaller than the other — Snowflake broadcasts the smaller table to all warehouse nodes so each node can perform a local hash join, avoiding network shuffling of the large table\'s data across nodes',
    ],
    answer: 'When one table is significantly smaller than the other — Snowflake broadcasts the smaller table to all warehouse nodes so each node can perform a local hash join, avoiding network shuffling of the large table\'s data across nodes',
    exp: 'Broadcast join: the smaller table is replicated to every compute node in the warehouse. Each node then performs a local hash lookup join against its portion of the larger table — no shuffling of the big table is needed. This is highly efficient when one side of the join fits comfortably in each node\'s memory. Hash join: both tables are partitioned by the join key and shuffled so matching keys land on the same node — used when both tables are large. Snowflake\'s optimiser estimates table sizes and picks the join type automatically.',
  },

  {
    id: 'd4_d11_04',
    domain: 4,
    topic: 'Materialized Views — BEHIND_BY',
    difficulty: 'medium',
    q: 'After heavy DML on a base table, a query against a materialized view appears to return slightly stale results. Where can an engineer check how far behind the MV\'s refresh is?',
    options: [
      'SHOW MATERIALIZED VIEWS — the BEHIND_BY column indicates the lag between the base table\'s current state and the most recently refreshed MV snapshot',
      'SELECT * FROM SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY WHERE QUERY_TEXT LIKE \'%MV%\' — query history shows MV refresh events',
      'ALTER MATERIALIZED VIEW my_mv STATUS — this DDL command returns the current refresh status including lag',
      'DESCRIBE MATERIALIZED VIEW my_mv — the REFRESH_LAG field in the output shows the current lag in seconds',
    ],
    answer: 'SHOW MATERIALIZED VIEWS — the BEHIND_BY column indicates the lag between the base table\'s current state and the most recently refreshed MV snapshot',
    exp: 'SHOW MATERIALIZED VIEWS returns one row per materialized view with columns including: NAME, SCHEMA_NAME, DATABASE_NAME, INVALID (whether the MV is suspended due to a base table change), INVALID_REASON, BEHIND_BY (how far behind the MV is relative to the base table — expressed as a time interval), and LAST_REFRESH_START / LAST_REFRESH_END timestamps. A high BEHIND_BY value means the MV background refresh is lagging — possibly because the base table changes faster than Snowflake can refresh, or the MV has been suspended.',
  },

  {
    id: 'd4_d11_05',
    domain: 4,
    topic: 'Search Optimization Service — Billing',
    difficulty: 'medium',
    q: 'A DBA enables Search Optimization on a large customers table. What are the two ongoing cost components?',
    options: [
      'Search Optimization has no additional cost — the optimisation is funded by the existing query compute credits',
      'Serverless credits for building and maintaining the search access path, plus storage for the search access path data structure that is persisted alongside the table\'s micro-partitions',
      'A per-query surcharge added to warehouse credits whenever a query uses the search access path',
      'A one-time setup fee based on the table\'s size at the time of ADD SEARCH OPTIMIZATION, plus standard storage costs for the initial build artifact',
    ],
    answer: 'Serverless credits for building and maintaining the search access path, plus storage for the search access path data structure that is persisted alongside the table\'s micro-partitions',
    exp: 'Search Optimization Service has two billing components: (1) Build and maintenance compute: Snowflake runs background serverless jobs to build and incrementally update the search access path as the table changes — these are billed as serverless credits (separate from warehouse credits). (2) Storage: the search access path is a persistent data structure that can add significant storage overhead (often 10–100% of the base table size, depending on which columns are optimised). Use INFORMATION_SCHEMA.SEARCH_OPTIMIZATION_HISTORY() to monitor both components.',
  },

  {
    id: 'd4_d11_06',
    domain: 4,
    topic: 'MERGE Statement',
    difficulty: 'medium',
    q: 'What is the primary use case for the Snowflake MERGE statement?',
    options: [
      'To combine two query result sets into a single result set, similar to UNION ALL but with deduplication',
      'To validate that source and target tables have matching schemas before a load operation',
      'To synchronise a target table with source data in a single atomic statement — matching rows are updated (WHEN MATCHED THEN UPDATE), new rows are inserted (WHEN NOT MATCHED THEN INSERT), and optionally matching rows are deleted (WHEN MATCHED AND ... THEN DELETE). This replaces separate DELETE + INSERT ETL patterns.',
      'To merge multiple micro-partitions into fewer, larger partitions to improve query performance after heavy DML',
    ],
    answer: 'To synchronise a target table with source data in a single atomic statement — matching rows are updated (WHEN MATCHED THEN UPDATE), new rows are inserted (WHEN NOT MATCHED THEN INSERT), and optionally matching rows are deleted (WHEN MATCHED AND ... THEN DELETE). This replaces separate DELETE + INSERT ETL patterns.',
    exp: 'MERGE (also called "upsert") is the standard SQL idempotent load pattern. The syntax: MERGE INTO target USING source ON (join condition) WHEN MATCHED THEN UPDATE SET ... WHEN NOT MATCHED THEN INSERT (...) VALUES (...). A single MERGE replaces: SELECT → INSERT for new rows, UPDATE for changed rows. It is fully ACID and atomic. Snowflake MERGE supports multiple WHEN MATCHED clauses with different conditions. A common use case is CDC (Change Data Capture) pipelines where the source stream contains a mix of inserts, updates, and deletes.',
  },

  {
    id: 'd4_d11_07',
    domain: 4,
    topic: 'Window Functions — ROWS vs RANGE Frame',
    difficulty: 'medium',
    q: 'A query uses SUM(amount) OVER (ORDER BY order_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW). What does the ROWS keyword specify compared to RANGE?',
    options: [
      'ROWS means the function processes one row at a time sequentially; RANGE means it processes all rows simultaneously in parallel',
      'ROWS defines the frame boundary in terms of physical row positions — CURRENT ROW means only the current physical row. RANGE defines boundaries in terms of column value ranges — CURRENT ROW includes all rows with the same ORDER BY column value as the current row (handling ties differently).',
      'ROWS and RANGE are synonymous in Snowflake — the distinction is a legacy SQL standard artifact with no functional difference',
      'ROWS requires a numeric ORDER BY column; RANGE supports all data types including VARCHAR and DATE',
    ],
    answer: 'ROWS defines the frame boundary in terms of physical row positions — CURRENT ROW means only the current physical row. RANGE defines boundaries in terms of column value ranges — CURRENT ROW includes all rows with the same ORDER BY column value as the current row (handling ties differently).',
    exp: 'ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW: includes all rows from the first row up to and including the current physical row — ties in the ORDER BY column are handled by inclusion order (non-deterministic without a tiebreaker). RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW: includes all rows whose ORDER BY value is ≤ the current row\'s value — all ties with the current row are included in the frame. For running totals where ties should be treated equally, RANGE is semantically cleaner. ROWS is more deterministic per position.',
  },

  {
    id: 'd4_d11_08',
    domain: 4,
    topic: 'Stored Procedures — EXECUTE AS OWNER vs CALLER',
    difficulty: 'medium',
    q: 'A stored procedure that queries a sensitive table is created with EXECUTE AS CALLER. A user without SELECT on that table calls the procedure. What happens?',
    options: [
      'The procedure executes successfully — EXECUTE AS CALLER grants the caller temporary elevated access to any tables the procedure touches',
      'The procedure raises a permission error for the caller — EXECUTE AS CALLER means the procedure runs with the CALLING USER\'s privileges. Since the caller lacks SELECT on the sensitive table, the query inside the procedure fails with an access denied error.',
      'The procedure executes as the owner regardless — EXECUTE AS CALLER is only advisory and does not change the actual execution context',
      'The procedure is suspended automatically — Snowflake detects the privilege gap and requires the procedure owner to re-grant access',
    ],
    answer: 'The procedure raises a permission error for the caller — EXECUTE AS CALLER means the procedure runs with the CALLING USER\'s privileges. Since the caller lacks SELECT on the sensitive table, the query inside the procedure fails with an access denied error.',
    exp: 'EXECUTE AS CALLER: the procedure runs with the caller\'s current role and privileges. If the caller cannot SELECT the table, the procedure cannot SELECT it either — no privilege elevation occurs. EXECUTE AS OWNER: the procedure always runs with the owner\'s role privileges, regardless of who calls it. This enables a "controlled elevation" pattern: grant EXECUTE on the procedure to a role without direct table access, and the procedure can access tables the caller cannot directly. EXECUTE AS OWNER is the default for stored procedures in Snowflake.',
  },

  {
    id: 'd4_d11_09',
    domain: 4,
    topic: 'UDFs — JavaScript vs Python Tabular Functions',
    difficulty: 'medium',
    q: 'Which statement correctly describes a capability difference between JavaScript and Python UDFs in Snowflake?',
    options: [
      'JavaScript UDFs support tabular (table) UDFs that return multiple rows; Python UDFs return only scalar values',
      'JavaScript UDFs can import external npm packages from the internet; Python UDFs are limited to built-in Python standard library',
      'Python UDFs can be defined as tabular functions (UDTFs) that return a table result set with multiple rows. JavaScript UDFs are scalar only — they return a single value per row and cannot return multiple output rows from one input row.',
      'Python UDFs run in a secure sandbox and cannot make network calls; JavaScript UDFs can call external APIs without restrictions',
    ],
    answer: 'Python UDFs can be defined as tabular functions (UDTFs) that return a table result set with multiple rows. JavaScript UDFs are scalar only — they return a single value per row and cannot return multiple output rows from one input row.',
    exp: 'User-Defined Table Functions (UDTFs) return a result set with potentially multiple rows per input row — useful for parsing, exploding, or generating data. Python UDTFs are defined with RETURNS TABLE (...) and implement a process() method that yields rows. JavaScript UDFs (both scalar and aggregate) are supported but not tabular — JavaScript cannot return multiple rows per call. Java and Python are the primary languages for UDTFs in Snowflake. Scala also supports UDTFs. SQL UDFs support table-returning but are limited to a single SELECT statement.',
  },

  {
    id: 'd4_d11_10',
    domain: 4,
    topic: 'Snowpark DataFrame — Lazy Evaluation',
    difficulty: 'medium',
    q: 'A Python developer builds a chain of Snowpark DataFrame transformations: df.filter(...).join(...).group_by(...).agg(...). When does Snowflake actually execute the SQL against the warehouse?',
    options: [
      'Each transformation (filter, join, group_by, agg) is executed immediately as a separate SQL statement on the warehouse',
      'Execution happens when the DataFrame is assigned to a variable — Snowflake resolves the DataFrame immediately on assignment',
      'Execution is deferred (lazy) — Snowflake builds a logical query plan but only submits it to the warehouse when a terminal action is called, such as .collect(), .show(), .write.save_as_table(), or .to_pandas(). This allows Snowflake to optimise the entire chain as one query.',
      'Execution is deferred until the Python script terminates — Snowflake batches all DataFrame operations in a session and submits them as a transaction at exit',
    ],
    answer: 'Execution is deferred (lazy) — Snowflake builds a logical query plan but only submits it to the warehouse when a terminal action is called, such as .collect(), .show(), .write.save_as_table(), or .to_pandas(). This allows Snowflake to optimise the entire chain as one query.',
    exp: 'Snowpark follows the same lazy evaluation model as Apache Spark. Transformation methods (filter, join, select, group_by, agg, union) are "transformations" that build a logical plan without executing SQL. Action methods (collect, show, count, to_pandas, write.save_as_table) trigger execution. This design allows Snowflake to combine multiple logical operations into a single optimised SQL statement rather than running separate queries for each transformation — dramatically reducing round-trips and overhead.',
  },

  {
    id: 'd4_d11_11',
    domain: 4,
    topic: 'PIVOT',
    difficulty: 'medium',
    q: 'A table has columns (product, quarter, revenue). A developer wants to transform it so each product becomes a row and each quarter (Q1, Q2, Q3, Q4) becomes a separate column containing the revenue. What SQL feature achieves this?',
    options: [
      'UNPIVOT — this transposes columns to rows, which is the correct operation to produce wide-format quarter columns from row data',
      'FLATTEN — the FLATTEN table function reshapes JSON arrays into tabular format including column-per-key transformations',
      'CROSSTAB — a Snowflake-specific function that generates a cross-tabulated pivot table from a two-column input',
      'PIVOT — PIVOT rotates row values into columns. The query: SELECT * FROM sales PIVOT (SUM(revenue) FOR quarter IN (\'Q1\', \'Q2\', \'Q3\', \'Q4\')) transforms the quarter rows into separate Q1, Q2, Q3, Q4 columns grouped by product.',
    ],
    answer: 'PIVOT — PIVOT rotates row values into columns. The query: SELECT * FROM sales PIVOT (SUM(revenue) FOR quarter IN (\'Q1\', \'Q2\', \'Q3\', \'Q4\')) transforms the quarter rows into separate Q1, Q2, Q3, Q4 columns grouped by product.',
    exp: 'PIVOT syntax in Snowflake: SELECT * FROM table PIVOT (aggregate(value_col) FOR category_col IN (val1, val2, val3)). The column referenced in FOR becomes the source of new column names; the aggregate is applied to the value column for each category value. UNPIVOT does the reverse — transforms wide-format columns back into rows. FLATTEN handles VARIANT arrays/objects, not relational pivoting. CROSSTAB is not a Snowflake function.',
  },

  {
    id: 'd4_d11_12',
    domain: 4,
    topic: 'Query Acceleration Service — Eligible SQL Types',
    difficulty: 'hard',
    q: 'Which SQL statement types does the Query Acceleration Service (QAS) accelerate?',
    options: [
      'Only SELECT statements — QAS exclusively accelerates query reads and has no effect on write operations',
      'SELECT, INSERT INTO ... SELECT, CREATE TABLE AS SELECT (CTAS), and COPY INTO — QAS can accelerate the large-scan portions of these statements when the warehouse has ENABLE_QUERY_ACCELERATION = TRUE',
      'All Snowflake DML statements including UPDATE, DELETE, and MERGE — QAS offloads any operation that touches micro-partitions',
      'Only ad-hoc, unparameterised queries — QAS cannot accelerate parameterised or prepared statement patterns',
    ],
    answer: 'SELECT, INSERT INTO ... SELECT, CREATE TABLE AS SELECT (CTAS), and COPY INTO — QAS can accelerate the large-scan portions of these statements when the warehouse has ENABLE_QUERY_ACCELERATION = TRUE',
    exp: 'QAS offloads eligible portions of queries (specifically large table scans and aggregations) to a serverless compute pool. The supported statement types are: SELECT (all forms), INSERT INTO ... SELECT (read-heavy transforms), CREATE TABLE AS SELECT (CTAS), and COPY INTO (data loading with large staged file scans). UPDATE, DELETE, and MERGE are NOT accelerated by QAS — they require the full warehouse compute for their write operations. The QAS_QUERY_ACCELERATION_ELIGIBLE_HISTORY view shows which queries were accelerated.',
  },

  {
    id: 'd4_d11_13',
    domain: 4,
    topic: 'Query Profile — Spill Diagnosis',
    difficulty: 'hard',
    q: 'A query\'s Profile Overview pane shows: Processing 12%, Local Disk IO 38%, Remote Disk IO 50%. What is the most likely cause and correct fix?',
    options: [
      'The query is heavily pruned — 88% of time is spent on disk IO, which is normal for well-clustered tables with many partitions',
      'The warehouse network card is saturated — Remote Disk IO measures network traffic and should be reduced by moving the warehouse region closer to the data',
      'Significant spill to remote storage — the warehouse ran out of memory AND local SSD space, forcing data to be written to cloud object storage (the slowest spill tier). Fix: scale up the warehouse to increase memory; also check if aggregations or joins can be optimised to reduce intermediate data size.',
      'The table lacks a clustering key — Local Disk IO and Remote Disk IO both indicate full partition scans that would be eliminated by CLUSTER BY on the filter column',
    ],
    answer: 'Significant spill to remote storage — the warehouse ran out of memory AND local SSD space, forcing data to be written to cloud object storage (the slowest spill tier). Fix: scale up the warehouse to increase memory; also check if aggregations or joins can be optimised to reduce intermediate data size.',
    exp: 'In the Profile Overview breakdown, "Remote Disk IO" specifically refers to spill operations to cloud object storage — the most expensive form of data movement. When memory is exhausted, Snowflake first spills to local SSD (Local Disk IO shows as high); when the SSD is also exhausted, it spills to remote storage. A 50% Remote Disk IO time is extremely severe. The primary fix is scaling up (larger warehouse = more RAM per node). Secondary fixes: rewrite joins or aggregations to reduce intermediate result size, add clustering to reduce data scanned.',
  },

  // ── DOMAIN 5: Data Collaboration (5 questions) ────────────────────────────

  {
    id: 'd5_d11_01',
    domain: 5,
    topic: 'UNDROP — Restores Contained Objects',
    difficulty: 'easy',
    q: 'A developer accidentally runs DROP SCHEMA prod.analytics. The schema contained 15 tables. They immediately run UNDROP SCHEMA analytics. What is restored?',
    options: [
      'Only the schema container is restored — all tables inside it are permanently deleted and must be recreated manually',
      'The schema and all contained tables that were dropped as part of the DROP SCHEMA are restored — UNDROP schema cascades recovery to all objects that were part of the schema at the time of the drop, provided the Time Travel window has not expired',
      'The schema is restored but tables must be individually UNDROPped by name',
      'UNDROP SCHEMA restores the schema and its metadata but the table data (micro-partitions) must be recovered from Fail-safe by Snowflake Support',
    ],
    answer: 'The schema and all contained tables that were dropped as part of the DROP SCHEMA are restored — UNDROP schema cascades recovery to all objects that were part of the schema at the time of the drop, provided the Time Travel window has not expired',
    exp: 'UNDROP restores the dropped object AND all objects it contained at the time of the drop. UNDROP SCHEMA restores the schema plus all tables, views, stages, pipes, and other schema-level objects it held. UNDROP DATABASE restores the database, all schemas inside it, and all objects within those schemas. The recovery is limited to the Time Travel window (DATA_RETENTION_TIME_IN_DAYS) — if the window has expired, the objects are unrecoverable via UNDROP but may still be recoverable from Fail-safe by Snowflake Support (for permanent objects).',
  },

  {
    id: 'd5_d11_02',
    domain: 5,
    topic: 'Zero-copy Cloning — Policy Propagation',
    difficulty: 'easy',
    q: 'A table with a Dynamic Data Masking policy assigned to a column is cloned: CREATE TABLE prod_copy CLONE prod_original. What happens to the masking policy on prod_copy?',
    options: [
      'The masking policy is copied by value — a new independent masking policy is created on prod_copy that mirrors the original policy logic but is unlinked from the original',
      'The masking policy assignment is carried over by reference — prod_copy\'s column references the SAME masking policy object as prod_original. If the policy is altered, both tables are affected by the change.',
      'The masking policy is NOT copied — cloned tables start without any column policies; they must be manually reassigned',
      'The masking policy is copied but immediately suspended on the clone — the DBA must explicitly activate it with ALTER TABLE prod_copy ... RESUME MASKING POLICY',
    ],
    answer: 'The masking policy assignment is carried over by reference — prod_copy\'s column references the SAME masking policy object as prod_original. If the policy is altered, both tables are affected by the change.',
    exp: 'Zero-copy cloning carries over masking policies (DDM), row access policies (RAP), and object tags by reference — not by value. The cloned table\'s columns point to the same policy objects. This is intentional: security controls travel with the data automatically, preventing a clone from accidentally exposing sensitive data. However, it also means changes to the shared policy affect both source and clone. To decouple, a new policy must be explicitly created and assigned to the clone. Row access policies and tags behave identically.',
  },

  {
    id: 'd5_d11_03',
    domain: 5,
    topic: 'Secure Data Sharing — CREATE SHARE Privileges',
    difficulty: 'medium',
    q: 'What privilege is required to CREATE a Secure Data Share in Snowflake?',
    options: [
      'SYSADMIN — it manages all database objects including shares',
      'SECURITYADMIN — data sharing is a security-sensitive operation managed by the security role',
      'Any custom role — GRANT CREATE SHARE ON ACCOUNT can delegate share creation to any role',
      'ACCOUNTADMIN — only ACCOUNTADMIN (or a role granted the CREATE SHARE privilege from ACCOUNTADMIN) can create a share. The share itself requires GRANT <privilege> ON <object> TO SHARE to add objects.',
    ],
    answer: 'ACCOUNTADMIN — only ACCOUNTADMIN (or a role granted the CREATE SHARE privilege from ACCOUNTADMIN) can create a share. The share itself requires GRANT <privilege> ON <object> TO SHARE to add objects.',
    exp: 'Creating a Snowflake Data Share requires the CREATE SHARE privilege on the account, which is held by ACCOUNTADMIN by default. The workflow: (1) ACCOUNTADMIN creates the share: CREATE SHARE my_share. (2) ACCOUNTADMIN or SYSADMIN grants objects into the share: GRANT USAGE ON DATABASE mydb TO SHARE my_share; GRANT USAGE ON SCHEMA mydb.public TO SHARE my_share; GRANT SELECT ON TABLE mydb.public.orders TO SHARE my_share. (3) ACCOUNTADMIN adds the consumer account: ALTER SHARE my_share ADD ACCOUNTS = consumer_account.',
  },

  {
    id: 'd5_d11_04',
    domain: 5,
    topic: 'Marketplace — Private Listings',
    difficulty: 'medium',
    q: 'What is the key characteristic of a PRIVATE listing on the Snowflake Marketplace versus a PUBLIC listing?',
    options: [
      'Private listings contain encrypted data that only the listed consumer can decrypt; public listings have unencrypted data accessible to all',
      'Private listings are visible only to specifically invited consumer accounts — they do not appear in Marketplace search results for the general public. Public listings are discoverable by all Snowflake users browsing the Marketplace.',
      'Private listings support real-time streaming data; public listings are limited to static batch data',
      'Private listings require the consumer to be on Business Critical edition; public listings are available to all editions',
    ],
    answer: 'Private listings are visible only to specifically invited consumer accounts — they do not appear in Marketplace search results for the general public. Public listings are discoverable by all Snowflake users browsing the Marketplace.',
    exp: 'Snowflake Marketplace has two listing visibility modes. Public listings: searchable and accessible by any Snowflake account (subject to approval workflow for paid listings). Private listings: the provider explicitly specifies which consumer accounts can see and install the listing — it does not appear in the general Marketplace catalog. Private listings are used for: sharing with specific business partners, internal sharing between business units in the same organisation, or beta/test access before a public launch. Both listing types use zero-copy Secure Data Sharing under the hood.',
  },

  {
    id: 'd5_d11_05',
    domain: 5,
    topic: 'Native Apps Framework',
    difficulty: 'medium',
    q: 'A vendor has built a Snowflake Native App and published it on the Marketplace. A consumer installs it. What can the consumer do with the installed Native App?',
    options: [
      'The consumer gets full read access to the vendor\'s source code and data — Native Apps share all intellectual property with consumers',
      'The consumer can run the app\'s Streamlit UI, execute the app\'s stored procedures on their own data, and view any dashboards the app provides — all within the consumer\'s own account and without the vendor seeing the consumer\'s data',
      'The consumer can only view static reports generated by the vendor — they cannot execute any code or provide their own data as input',
      'The consumer automatically gets a Reader Account that runs the app — no installation into the consumer\'s own account occurs',
    ],
    answer: 'The consumer can run the app\'s Streamlit UI, execute the app\'s stored procedures on their own data, and view any dashboards the app provides — all within the consumer\'s own account and without the vendor seeing the consumer\'s data',
    exp: 'Native Apps are installed INTO the consumer\'s Snowflake account. The app can include: Streamlit web UIs, stored procedures, UDFs, Snowpark code, tables, and views. The consumer runs the app against their own data — the vendor\'s logic executes in the consumer\'s account under the consumer\'s compute costs. Crucially, the vendor cannot see the consumer\'s data. The vendor\'s source code is protected — consumers can use the app but cannot view the underlying SQL or Python logic. This is the key advantage over sharing code directly.',
  },

];
