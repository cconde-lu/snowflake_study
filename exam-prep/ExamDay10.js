// ─────────────────────────────────────────────────────────────────────────────
// EXAM PREP — Day 10  (2026-03-16)
// COF-C03 Mock Exam · 60 questions
// Distribution: D1 31% (19q) | D2 20% (12q) | D3 18% (11q) | D4 21% (13q) | D5 10% (5q)
//
// [STANDARD DAY] Difficulty mix: ~30% Easy (18q) · ~50% Medium (28q) · ~20% Hard (14q)
//
// OVERLAP RULE (decreasing by recency):
//   Day 9 (N-1): ≤ 30% overlap (≤ 18 questions same topic+scenario)
//   Day 8 (N-2): ≤ 20% overlap (≤ 12 questions)
//   Day 7 (N-3): ≤ 10% overlap (≤  6 questions)
//   Day 6 (N-4): ≤  5% overlap (≤  3 questions, avoid verbatim repeats)
//
// THEME: Covers study-note topics — PUT folder paths, edition billing, OBJECT_KEYS,
//   JSON parsing, OBJECT_AGG, resource monitors, USAGE privilege, cloning while source
//   is live, clustering column types, DDM vs RAP, STRIP_OUTER_ARRAY vs
//   FIELD_OPTIONALLY_ENCLOSED_BY, SYSTEM$ALLOWLIST / SYSTEM$GET_PRIVATELINK_CONFIG,
//   transient tables for CDP cost reduction, UUID_STRING, COPY INTO parameters,
//   stale streams, exploding joins, ACCESS_HISTORY, worksheet permissions,
//   external table operations, three caching layers, scaling policies.
// ─────────────────────────────────────────────────────────────────────────────

export const DAY_META = {
  day: 10,
  date: '2026-03-16',
  label: 'Day 10 — Study Notes Review',
  totalQuestions: 60,
  timeMinutes: 115,
};

export const QUESTIONS = [

  // ── DOMAIN 1: Architecture & Features (19 questions) ─────────────────────

  {
    id: 'd1_d10_01',
    domain: 1,
    topic: 'UUID_STRING',
    difficulty: 'easy',
    q: 'What does the UUID_STRING() function return in Snowflake?',
    options: [
      'A universally unique identifier as a VARCHAR in the standard 8-4-4-4-12 hyphenated format (e.g., \'f47ac10b-58cc-4372-a567-0e02b2c3d479\') — generated fresh and randomly each call',
      'A hash of the current session ID and the current timestamp, combined to form a unique 32-char hex string',
      'A sequential integer that increments globally across the Snowflake account to guarantee ordering',
      'A base-64 encoded random 128-bit value without hyphens, shorter than the UUID format',
    ],
    answer: 'A universally unique identifier as a VARCHAR in the standard 8-4-4-4-12 hyphenated format (e.g., \'f47ac10b-58cc-4372-a567-0e02b2c3d479\') — generated fresh and randomly each call',
    exp: 'UUID_STRING() returns a Version 4 (random) UUID as a VARCHAR string, following the RFC 4122 8-4-4-4-12 hyphen format. It is non-deterministic — each call produces a new value. Common uses include generating surrogate keys for MERGE operations or unique batch IDs. Unlike SEQUENCES, UUIDs require no shared state and can be generated in parallel without coordination.',
  },

  {
    id: 'd1_d10_02',
    domain: 1,
    topic: 'Snowsight Worksheet Permissions',
    difficulty: 'easy',
    q: 'A Snowflake user wants to share a Snowsight worksheet with a colleague so the colleague can both view AND run it. How is this done?',
    options: [
      'Export the worksheet as a .sql file and share it by email — that is the only supported method',
      'Run GRANT WORKSHEET TO USER colleague_name — a DDL command for worksheet access control',
      'From the worksheet\'s "..." menu choose Share, then add the colleague with "Can view" or "Can edit" permissions — Snowsight worksheets support in-app sharing with granular permission levels',
      'Worksheets are automatically visible to all users who share the same active role — no explicit sharing step is needed',
    ],
    answer: 'From the worksheet\'s "..." menu choose Share, then add the colleague with "Can view" or "Can edit" permissions — Snowsight worksheets support in-app sharing with granular permission levels',
    exp: 'Snowsight worksheets can be shared directly in the UI via the three-dot menu → Share. You specify individual users or roles and choose between view-only and edit access. The shared worksheet remains owned by the creator; collaborators access it in their "Shared with me" section. This does not require any SQL DDL — it is a UI-only capability within Snowsight.',
  },

  {
    id: 'd1_d10_03',
    domain: 1,
    topic: 'Result Cache',
    difficulty: 'easy',
    q: 'A user runs SELECT COUNT(*) FROM large_events WHERE region = \'US\' and gets a result in 30 seconds. Two hours later, no data has changed and the identical query runs in under 200 ms. Which caching layer is responsible?',
    options: [
      'Warehouse local SSD cache — the micro-partition files for large_events are still cached on the warehouse nodes',
      'External CDN cache — Snowflake caches common BI query results on edge nodes for fast delivery',
      'Result cache — Snowflake caches the exact output of every query for up to 24 hours. An identical SQL on unchanged data is served directly from this cache by the Cloud Services layer, without starting any warehouse compute.',
      'Metadata cache — the Cloud Services layer pre-computes aggregate statistics and returns them instantly',
    ],
    answer: 'Result cache — Snowflake caches the exact output of every query for up to 24 hours. An identical SQL on unchanged data is served directly from this cache by the Cloud Services layer, without starting any warehouse compute.',
    exp: 'The result cache is managed by the Cloud Services layer and shared across all users in the account. A cache hit requires: identical SQL text (including whitespace and case), unchanged underlying data (no DML since the original execution), same session parameters that affect query results, and no non-deterministic functions. When all conditions are met, no warehouse is needed — the result is returned at zero compute cost.',
  },

  {
    id: 'd1_d10_04',
    domain: 1,
    topic: 'External Tables',
    difficulty: 'easy',
    q: 'A developer tries INSERT INTO ext_orders VALUES (1, \'Alice\', 99.99) on a Snowflake external table. What happens?',
    options: [
      'The INSERT succeeds and Snowflake creates a new Parquet file in the external storage location',
      'The INSERT is queued until the next ALTER TABLE ext_orders REFRESH is run',
      'The INSERT succeeds but the row is stored in Snowflake\'s metadata only — not written to external storage',
      'The INSERT fails with an error — external tables are read-only in Snowflake. They reflect files in cloud storage but do not support INSERT, UPDATE, DELETE, or MERGE.',
    ],
    answer: 'The INSERT fails with an error — external tables are read-only in Snowflake. They reflect files in cloud storage but do not support INSERT, UPDATE, DELETE, or MERGE.',
    exp: 'External tables provide a SQL interface over files that live outside Snowflake — in S3, Azure Blob, or GCS. Because Snowflake does not own the underlying files, all DML is blocked. The only way to add data visible through an external table is to write new files to the external storage location directly, then run ALTER TABLE ... REFRESH to update the table\'s partition metadata.',
  },

  {
    id: 'd1_d10_05',
    domain: 1,
    topic: 'Virtual Warehouse Billing Model',
    difficulty: 'easy',
    q: 'How does Snowflake calculate virtual warehouse compute costs?',
    options: [
      'Credits consumed = warehouse size (credits/hour) × hours running, billed per second with a 60-second minimum per start. A larger warehouse burns more credits per hour, not per query.',
      'Compute is billed per query — each SQL statement has a fixed credit cost proportional to the rows it scans',
      'Compute is billed per GB of data processed — denser data with more columns costs more credits',
      'Warehouses are billed at a flat monthly rate based on their configured size, regardless of actual usage',
    ],
    answer: 'Credits consumed = warehouse size (credits/hour) × hours running, billed per second with a 60-second minimum per start. A larger warehouse burns more credits per hour, not per query.',
    exp: 'Snowflake bills warehouse compute by time, not by query volume. A 2X-Large (16 credits/hr) running for 30 minutes costs 8 credits — identical to running an X-Large (8 credits/hr) for 60 minutes. Billing is per-second with a 60-second minimum each time the warehouse starts (cold or resume). AUTO_SUSPEND prevents idle billing; AUTO_RESUME starts the warehouse automatically on the next query.',
  },

  {
    id: 'd1_d10_06',
    domain: 1,
    topic: 'Multi-cluster Warehouses — Scaling Policies',
    difficulty: 'easy',
    q: 'What is the key operational difference between STANDARD and ECONOMY scaling policies in a multi-cluster warehouse?',
    options: [
      'STANDARD supports larger cluster sizes; ECONOMY caps each cluster at X-Small regardless of the configured size',
      'STANDARD is only available on Enterprise edition; ECONOMY is available on all editions including Standard',
      'STANDARD starts a new cluster as soon as any query is queued; ECONOMY waits until the system predicts at least 6 continuous minutes of demand before spinning up a new cluster — optimising for cost at the price of more queuing',
      'STANDARD and ECONOMY refer to the per-credit dollar price tier, not to the auto-scaling trigger behaviour',
    ],
    answer: 'STANDARD starts a new cluster as soon as any query is queued; ECONOMY waits until the system predicts at least 6 continuous minutes of demand before spinning up a new cluster — optimising for cost at the price of more queuing',
    exp: 'STANDARD scaling prioritises low latency: spin up immediately on queue pressure. ECONOMY scaling prioritises cost: tolerate some queuing and only add a cluster when the load is expected to last. Choose STANDARD for interactive BI workloads where sub-second response matters. Choose ECONOMY for batchable ETL workloads where a few extra seconds of queue time is acceptable. Both policies use the same SUSPEND logic to scale down when load drops.',
  },

  {
    id: 'd1_d10_07',
    domain: 1,
    topic: 'Zero-copy Cloning — Live Source',
    difficulty: 'medium',
    q: 'While CREATE TABLE orders_backup CLONE orders is executing, another session runs DELETE FROM orders WHERE year < 2020. What does orders_backup contain?',
    options: [
      'The clone contains the post-DELETE state — cloning waits for all in-flight DML on the source to commit before taking its snapshot',
      'orders_backup captures the state of orders at the exact instant the CLONE statement began executing — DML that commits AFTER the clone starts is NOT reflected in the clone',
      'The clone operation fails with a "dirty read" error because a concurrent DML on the source is detected',
      'orders_backup and orders share the same micro-partitions, so the DELETE immediately affects both tables',
    ],
    answer: 'orders_backup captures the state of orders at the exact instant the CLONE statement began executing — DML that commits AFTER the clone starts is NOT reflected in the clone',
    exp: 'Zero-copy cloning is a point-in-time operation: it snapshots the source\'s micro-partition references at the moment the CLONE statement begins. Any DML that commits on the source after that point creates new micro-partitions; the clone retains the original references and is unaffected. This is analogous to Time Travel with BEFORE(STATEMENT => ...) at the start of the CLONE statement itself.',
  },

  {
    id: 'd1_d10_08',
    domain: 1,
    topic: 'Continuous Data Protection — Transient Tables',
    difficulty: 'medium',
    q: 'A high-volume ETL pipeline drops and recreates a large staging table dozens of times per day. Storage costs are high due to Continuous Data Protection overhead. What is the BEST table type to minimise this?',
    options: [
      'A permanent table with DATA_RETENTION_TIME_IN_DAYS = 0 — disabling Time Travel also eliminates Fail-safe',
      'A temporary table — temporary tables have no Fail-safe and are automatically dropped when the session ends',
      'A secure view over the staging data — views have no storage overhead at all',
      'A transient table — transient tables have 0 days of Fail-safe and at most 1 day of Time Travel, eliminating the 7-day Fail-safe storage that drives CDP costs for high-churn staging data',
    ],
    answer: 'A transient table — transient tables have 0 days of Fail-safe and at most 1 day of Time Travel, eliminating the 7-day Fail-safe storage that drives CDP costs for high-churn staging data',
    exp: 'Continuous Data Protection (CDP) costs come from Time Travel storage (up to 90 days × data size) plus 7 days of Fail-safe. For a staging table that is completely replaced many times per day, paying Fail-safe on every version is wasteful. A TRANSIENT table has 0 Fail-safe days and max 1 day Time Travel — dramatically reducing CDP overhead. Permanent tables with DATA_RETENTION_TIME_IN_DAYS = 0 also lose Fail-safe, but transient is the canonical design intent for staging data.',
  },

  {
    id: 'd1_d10_09',
    domain: 1,
    topic: 'Snowflake SQL API',
    difficulty: 'medium',
    q: 'What is the Snowflake SQL API and what problem does it solve?',
    options: [
      'A RESTful HTTP API that allows any application or tool to submit SQL statements to Snowflake using standard HTTP requests — supports both synchronous and asynchronous execution, enabling language-agnostic integrations without a native driver',
      'An in-process SQL compiler that converts SQL to Snowflake bytecode for 10× faster execution compared to standard parsing',
      'A GraphQL endpoint for querying Snowflake metadata objects (tables, schemas, columns) without writing SQL',
      'A WebSocket-based streaming interface for pushing query results to clients row-by-row as the warehouse produces them',
    ],
    answer: 'A RESTful HTTP API that allows any application or tool to submit SQL statements to Snowflake using standard HTTP requests — supports both synchronous and asynchronous execution, enabling language-agnostic integrations without a native driver',
    exp: 'The Snowflake SQL API (v2) accepts SQL statements via POST /api/v2/statements. For long queries, use async=true in the request body — the response returns a 202 with a statementHandle. Poll GET /api/v2/statements/{handle} until status = "success", then retrieve paginated result partitions. This is ideal for serverless functions, microservices, and tools that cannot install a Snowflake driver but can make HTTP calls.',
  },

  {
    id: 'd1_d10_10',
    domain: 1,
    topic: 'Types of Cache',
    difficulty: 'medium',
    q: 'Snowflake has three distinct caching layers. Which option correctly describes all three?',
    options: [
      'L1 (CPU registers per warehouse node), L2 (SSD per warehouse), L3 (cloud object storage) — a standard CPU memory hierarchy',
      'Read cache (recently queried data), Write cache (pending uncommitted DML), Spill cache (overflow from warehouse RAM)',
      'Metadata cache (object statistics and micro-partition metadata, Cloud Services layer, always free), Result cache (exact query output, 24-hour TTL, Cloud Services, no warehouse needed), Warehouse local SSD cache (recently scanned micro-partition files, lost on warehouse suspend or resize)',
      'Result cache (per warehouse, 8-hour TTL), Schema cache (DDL definitions, per session), Partition cache (micro-partition data, per query)',
    ],
    answer: 'Metadata cache (object statistics and micro-partition metadata, Cloud Services layer, always free), Result cache (exact query output, 24-hour TTL, Cloud Services, no warehouse needed), Warehouse local SSD cache (recently scanned micro-partition files, lost on warehouse suspend or resize)',
    exp: 'The three caches serve different layers: (1) Metadata cache — maintained in Cloud Services; stores micro-partition statistics for pruning and SHOW command results; always available at no compute cost. (2) Result cache — also in Cloud Services; returns identical query output within 24 hours if data is unchanged; no warehouse credits consumed. (3) Warehouse local SSD cache — lives on the compute nodes; caches raw micro-partition files from cloud storage to speed up re-reads; evicted when the warehouse suspends or is resized.',
  },

  {
    id: 'd1_d10_11',
    domain: 1,
    topic: 'ACCOUNT_USAGE vs INFORMATION_SCHEMA Latency',
    difficulty: 'medium',
    q: 'A security team needs to query failed login attempts from the LAST 15 MINUTES with the freshest possible data. Which view should they use?',
    options: [
      'SNOWFLAKE.ACCOUNT_USAGE.LOGIN_HISTORY — it has sub-minute latency for all account events',
      'SNOWFLAKE.INFORMATION_SCHEMA.LOGIN_HISTORY(TIME_RANGE_START => DATEADD(\'minute\', -15, CURRENT_TIMESTAMP())) — INFORMATION_SCHEMA functions return near-real-time data (seconds of latency) for recent activity. ACCOUNT_USAGE has up to 45 minutes of latency but retains 1 year of history.',
      'Both views have identical latency — the choice depends only on data retention needs',
      'SELECT * FROM SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY WHERE ERROR_CODE IS NOT NULL — login events are stored in QUERY_HISTORY not LOGIN_HISTORY',
    ],
    answer: 'SNOWFLAKE.INFORMATION_SCHEMA.LOGIN_HISTORY(TIME_RANGE_START => DATEADD(\'minute\', -15, CURRENT_TIMESTAMP())) — INFORMATION_SCHEMA functions return near-real-time data (seconds of latency) for recent activity. ACCOUNT_USAGE has up to 45 minutes of latency but retains 1 year of history.',
    exp: 'INFORMATION_SCHEMA table functions (LOGIN_HISTORY, QUERY_HISTORY, etc.) query directly from the live event pipeline — latency is typically seconds. The trade-off is limited retention (7 days for most functions). ACCOUNT_USAGE.LOGIN_HISTORY retains 365 days but can lag up to 45 minutes. For real-time security monitoring and alerting, INFORMATION_SCHEMA is the right tool. For historical trend analysis or compliance reports, use ACCOUNT_USAGE.',
  },

  {
    id: 'd1_d10_12',
    domain: 1,
    topic: 'Resource Monitors — Account vs Warehouse Level',
    difficulty: 'medium',
    q: 'A resource monitor with CREDIT_QUOTA = 500 is set at the ACCOUNT level. Another with CREDIT_QUOTA = 50 is assigned to a specific WAREHOUSE. The warehouse hits 50 credits. What happens?',
    options: [
      'The account-level monitor takes precedence — only the account monitor\'s actions fire; warehouse-level monitors are for reporting only',
      'Both monitors trigger simultaneously and the most restrictive combined action applies',
      'The warehouse monitor is ignored because the account has not yet reached its 500-credit quota',
      'The warehouse-level resource monitor fires its configured actions (NOTIFY, SUSPEND, or SUSPEND_IMMEDIATE) independently and immediately. The account-level monitor continues tracking total account usage separately and fires when that total reaches 500.',
    ],
    answer: 'The warehouse-level resource monitor fires its configured actions (NOTIFY, SUSPEND, or SUSPEND_IMMEDIATE) independently and immediately. The account-level monitor continues tracking total account usage separately and fires when that total reaches 500.',
    exp: 'Account-level and warehouse-level resource monitors operate independently. A warehouse monitor tracks only that warehouse\'s credit usage and fires based on its own quota. The account-level monitor tracks all credits across all warehouses. A team can have tight warehouse-level budgets for individual cost centres and a higher account-level backstop quota. They do not interfere with each other — both can trigger in the same billing period.',
  },

  {
    id: 'd1_d10_13',
    domain: 1,
    topic: 'Automatic Clustering — Edition Requirement',
    difficulty: 'medium',
    q: 'A team on Snowflake Standard edition defines CLUSTER BY (order_date) on a large table. Will Snowflake automatically maintain the clustering over time as new data arrives?',
    options: [
      'Yes — Automatic Clustering is a core platform feature available on all editions including Standard',
      'No — Automatic Clustering (the background re-clustering service) requires Enterprise edition or higher. On Standard, the clustering key is defined but the background service does not actively maintain it.',
      'Yes — but only for tables under 100 GB; larger tables require Enterprise edition for Automatic Clustering',
      'Automatic Clustering is available on Standard edition but must be explicitly enabled with ALTER TABLE ... RESUME RECLUSTER',
    ],
    answer: 'No — Automatic Clustering (the background re-clustering service) requires Enterprise edition or higher. On Standard, the clustering key is defined but the background service does not actively maintain it.',
    exp: 'On Standard edition, you can declare CLUSTER BY on a table but Snowflake\'s automated background reclustering service will not run. The initial micro-partition layout reflects the load order. As DML fragments clustering over time, no background job repairs it — the clustering depth degrades silently. Enterprise edition customers also pay for reclustering via serverless compute credits. For Standard edition tables, manual reclustering (ALTER TABLE ... RECLUSTER) is possible but uncommon.',
  },

  {
    id: 'd1_d10_14',
    domain: 1,
    topic: 'Zero-copy Cloning — Time Travel Clock',
    difficulty: 'medium',
    q: 'A developer clones a table: CREATE TABLE orders_test CLONE orders. When does orders_test\'s own Time Travel clock START?',
    options: [
      'orders_test\'s Time Travel clock starts from the moment of the clone operation. The clone\'s own change history begins from zero at creation time — you cannot query orders_test AT a timestamp before it was created.',
      'orders_test inherits the source table\'s full Time Travel history — you can query orders_test AT any timestamp valid for the original orders table',
      'orders_test has no Time Travel at all — cloned tables start with DATA_RETENTION_TIME_IN_DAYS = 0 by default',
      'orders_test\'s Time Travel clock starts from the time of the most recent DML on the source table, not from the clone time',
    ],
    answer: 'orders_test\'s Time Travel clock starts from the moment of the clone operation. The clone\'s own change history begins from zero at creation time — you cannot query orders_test AT a timestamp before it was created.',
    exp: 'A cloned table is a new independent object. Its Time Travel history covers only changes made AFTER the clone was created. It inherits the source\'s micro-partition data (via zero-copy) but NOT the source\'s change log. You can still use Time Travel on the ORIGINAL table to query its history before the clone. DATA_RETENTION_TIME_IN_DAYS on the clone is inherited from the source\'s setting (or schema/database default) unless overridden.',
  },

  {
    id: 'd1_d10_15',
    domain: 1,
    topic: 'Clustering Keys — Column Type Selection',
    difficulty: 'medium',
    q: 'A data engineer must choose a clustering key for a 2 TB transactions table. Which column is the BEST candidate?',
    options: [
      'transaction_id — a UUID that uniquely identifies each transaction, guaranteeing maximum key cardinality',
      'transaction_date — a DATE column with ~730 distinct values over 2 years; queries almost always filter by date range, and the column has bounded, evenly-distributed cardinality ideal for partition pruning',
      'is_refunded — a BOOLEAN column with only 2 distinct values; low cardinality means each partition covers half the table',
      'created_at — a TIMESTAMP_NTZ that increments monotonically with each new transaction insert',
    ],
    answer: 'transaction_date — a DATE column with ~730 distinct values over 2 years; queries almost always filter by date range, and the column has bounded, evenly-distributed cardinality ideal for partition pruning',
    exp: 'The ideal clustering column is (1) frequently used in WHERE/JOIN predicates, (2) has medium-to-high cardinality (enough distinct values to create narrow partition ranges), and (3) is NOT monotonically increasing. transaction_id is too unique — every partition has a unique range but queries rarely filter by ID range. is_refunded is too low cardinality — partitions span half the data. created_at (monotonically increasing timestamp) provides no pruning benefit for historical range queries. transaction_date hits the sweet spot.',
  },

  {
    id: 'd1_d10_16',
    domain: 1,
    topic: 'Clustering Keys — Depth Degradation',
    difficulty: 'hard',
    q: 'After months of heavy UPDATEs and INSERTs, SYSTEM$CLUSTERING_INFORMATION(\'transactions\') reports average_depth = 9.2. What does this indicate and what action is appropriate?',
    options: [
      'Excellent clustering — depth of 9.2 means each micro-partition cleanly contains exactly 9 distinct date values with zero overlap',
      'The table has 9.2% overlap between adjacent partitions, which is within the acceptable threshold for production tables',
      'Clustering has been suspended — 9.2 is the number of days since the last Automatic Clustering run',
      'Significant clustering degradation — average_depth of 9.2 means each micro-partition\'s key range overlaps with roughly 9 other partitions on average. DML has fragmented the layout. Automatic Clustering (if on Enterprise) should recluster the table, or the team can run ALTER TABLE transactions RESUME RECLUSTER to force the service to reprioritise it.',
    ],
    answer: 'Significant clustering degradation — average_depth of 9.2 means each micro-partition\'s key range overlaps with roughly 9 other partitions on average. DML has fragmented the layout. Automatic Clustering (if on Enterprise) should recluster the table, or the team can run ALTER TABLE transactions RESUME RECLUSTER to force the service to reprioritise it.',
    exp: 'average_depth in SYSTEM$CLUSTERING_INFORMATION measures the average number of micro-partitions whose key ranges overlap for any given key value. A depth close to 1.0 means near-perfect clustering (each key value lives in at most 1 partition). A depth of 9.2 means queries scanning a single date value must read ~9 partitions on average instead of 1 — severely degrading pruning efficiency. Regular DML (especially UPDATEs which delete + reinsert) is the primary cause of depth increase.',
  },

  {
    id: 'd1_d10_17',
    domain: 1,
    topic: 'Snowflake SQL API — Async Execution',
    difficulty: 'hard',
    q: 'A long-running query is submitted via the Snowflake SQL API. The client\'s HTTP connection times out after 30 seconds but the query is still running. What is the correct pattern to retrieve the result later?',
    options: [
      'Submit the request with async=true in the body — the API responds immediately with a 202 and a statementHandle. Poll GET /api/v2/statements/{statementHandle} until status = "success", then retrieve the result pages using the provided partition URLs.',
      'Retry the identical POST request — the SQL API detects duplicate SQL text and returns the existing result without re-executing',
      'The query is automatically cancelled on client disconnect — resubmit with a larger timeout on the HTTP client',
      'Switch to WebSocket mode — synchronous HTTP is unsuitable for queries over 30 seconds and WebSocket is required for long-running statements',
    ],
    answer: 'Submit the request with async=true in the body — the API responds immediately with a 202 and a statementHandle. Poll GET /api/v2/statements/{statementHandle} until status = "success", then retrieve the result pages using the provided partition URLs.',
    exp: 'The SQL API\'s asynchronous mode is designed precisely for long queries in HTTP environments. "async": true in the POST body returns a 202 Accepted immediately, along with a statementHandle UUID. The query continues running in Snowflake\'s Cloud Services. Polling the status endpoint costs no compute. Once status = "success", the response includes resultSetMetaData and partition download URLs. This pattern avoids gateway timeouts and is the recommended approach for any query expected to run longer than a few seconds.',
  },

  {
    id: 'd1_d10_18',
    domain: 1,
    topic: 'Micro-partitions — Immutability and DML',
    difficulty: 'hard',
    q: 'Snowflake micro-partitions are described as "immutable." How does this property affect the way UPDATE statements work internally?',
    options: [
      'UPDATE statements are prohibited on immutable micro-partitions — use DELETE + INSERT instead',
      'UPDATE locks the affected micro-partitions for the duration of the transaction, then modifies them in-place when the transaction commits',
      'Each UPDATE rewrites only the changed column values within the affected micro-partition, leaving unchanged columns untouched in the original partition',
      'UPDATE creates NEW micro-partitions containing the updated rows and marks the old partitions as deleted (copy-on-write semantics). The old partitions become the basis for Time Travel and Fail-safe. This is why heavy UPDATE workloads can degrade clustering and increase CDP storage costs.',
    ],
    answer: 'UPDATE creates NEW micro-partitions containing the updated rows and marks the old partitions as deleted (copy-on-write semantics). The old partitions become the basis for Time Travel and Fail-safe. This is why heavy UPDATE workloads can degrade clustering and increase CDP storage costs.',
    exp: 'Immutability means a micro-partition is written once and never modified in place. Any DML (INSERT, UPDATE, DELETE, MERGE) that touches rows in a partition results in the entire partition being rewritten as a new partition, with the old one retired. Retired partitions are retained for Time Travel (up to 90 days) and then Fail-safe (7 days for permanent tables), which is why tables with frequent small UPDATEs can accumulate significant CDP storage overhead compared to append-only tables.',
  },

  {
    id: 'd1_d10_19',
    domain: 1,
    topic: 'Zero-copy Cloning — Shared Database from Sharing',
    difficulty: 'hard',
    q: 'A consumer account has mounted a shared database customers_shared from a provider\'s Secure Data Share. They run CREATE DATABASE customers_local CLONE customers_shared. What is TRUE about customers_local?',
    options: [
      'customers_local is a live linked copy — it automatically reflects provider updates just like the original share',
      'customers_local becomes a fully independent, writable local database with the data as of the clone moment — it is no longer connected to the share, and provider updates are NOT reflected',
      'The clone fails — shared databases from Data Sharing cannot be cloned in Snowflake',
      'customers_local is read-only but disconnected — it holds a static copy that cannot be updated by DML',
    ],
    answer: 'customers_local becomes a fully independent, writable local database with the data as of the clone moment — it is no longer connected to the share, and provider updates are NOT reflected',
    exp: 'Cloning a shared database creates an independent copy in the consumer\'s account. The clone is owned by the consumer, supports full DML, and is completely decoupled from the provider\'s share. This is a supported pattern for consumers who want a writable, point-in-time copy of shared data (e.g., for testing or transformation), while still maintaining the live share for operational queries. Any masking or row access policies from the provider are also carried over to the clone at the time of creation.',
  },

  // ── DOMAIN 2: Account Access & Security (12 questions) ────────────────────

  {
    id: 'd2_d10_01',
    domain: 2,
    topic: 'USAGE Privilege — Scope',
    difficulty: 'easy',
    q: 'In Snowflake, on which object types can the USAGE privilege be granted?',
    options: [
      'Only virtual warehouses — USAGE is a warehouse-specific privilege that grants query execution rights',
      'Tables and views only — USAGE grants read access to data objects without needing SELECT',
      'Databases, schemas, warehouses, integrations, and certain other shared objects — USAGE on a database and schema is required before objects inside them can be referenced, and USAGE on a warehouse lets users run queries',
      'Only stages and file formats — USAGE controls who can reference staged files and format definitions in COPY INTO',
    ],
    answer: 'Databases, schemas, warehouses, integrations, and certain other shared objects — USAGE on a database and schema is required before objects inside them can be referenced, and USAGE on a warehouse lets users run queries',
    exp: 'USAGE is a foundational privilege that "unlocks" containers and shared resources without granting access to the data inside them. To query a table, a role typically needs: USAGE on the database + USAGE on the schema + SELECT on the table + USAGE on a warehouse. USAGE on its own does not permit data reads — it only enables navigation to the object. For warehouses, USAGE specifically allows submitting queries but not modifying the warehouse configuration (that needs MODIFY or OPERATE).',
  },

  {
    id: 'd2_d10_02',
    domain: 2,
    topic: 'Resource Monitors — Purpose',
    difficulty: 'easy',
    q: 'What is the primary purpose of a Snowflake Resource Monitor?',
    options: [
      'To set credit quotas on warehouses or the entire account, trigger email notifications when thresholds are hit, and optionally suspend warehouses to prevent runaway compute costs',
      'To track row-level data changes in tables for compliance auditing and lineage reporting',
      'To monitor query execution plans and alert the team when a query\'s estimated cost exceeds a defined threshold',
      'To automatically resize warehouses up and down based on real-time credit burn rate',
    ],
    answer: 'To set credit quotas on warehouses or the entire account, trigger email notifications when thresholds are hit, and optionally suspend warehouses to prevent runaway compute costs',
    exp: 'Resource Monitors let administrators set CREDIT_QUOTA limits with percentage-based triggers. At each threshold, actions can be: NOTIFY (send an email alert to designated users), SUSPEND (let running queries finish, then stop the warehouse), or SUSPEND_IMMEDIATE (cancel in-flight queries immediately). They can be scoped to an individual warehouse or the entire account. Resource Monitors do NOT apply to serverless features like Snowpipe, Tasks, or Automatic Clustering.',
  },

  {
    id: 'd2_d10_03',
    domain: 2,
    topic: 'ACCESS_HISTORY — What It Records',
    difficulty: 'easy',
    q: 'What type of events does the SNOWFLAKE.ACCOUNT_USAGE.ACCESS_HISTORY view record?',
    options: [
      'Only failed queries and permission-denied errors — it is an audit log of security violations',
      'DDL changes (CREATE, ALTER, DROP) on all database objects across the account',
      'Row counts and byte sizes read from each table per day for storage utilisation reporting',
      'Read and write operations on data objects — which columns were accessed, by which user/role/query, at what time. Includes DIRECT_OBJECTS_ACCESSED (top-level objects in the query) and BASE_OBJECTS_ACCESSED (underlying source tables/views).',
    ],
    answer: 'Read and write operations on data objects — which columns were accessed, by which user/role/query, at what time. Includes DIRECT_OBJECTS_ACCESSED (top-level objects in the query) and BASE_OBJECTS_ACCESSED (underlying source tables/views).',
    exp: 'ACCESS_HISTORY is Snowflake\'s column-level audit trail. Each row represents one query and lists every column read or written, along with the user, role, warehouse, and timestamp. BASE_OBJECTS_ACCESSED is especially powerful for lineage: if a user queries VIEW_A which joins TABLE_B and TABLE_C, BASE_OBJECTS_ACCESSED contains TABLE_B and TABLE_C — exposing the true data sources. This view has up to 45-minute latency and retains 1 year of history on Enterprise edition and above.',
  },

  {
    id: 'd2_d10_04',
    domain: 2,
    topic: 'Network Policies',
    difficulty: 'easy',
    q: 'What does a Snowflake network policy control?',
    options: [
      'Row-level data access restrictions based on the user\'s source IP address and their assigned role simultaneously',
      'Allowed and blocked IP address ranges for connecting to a Snowflake account or individual user — network policies enforce network-layer access control independently of role-based privileges',
      'Encryption algorithms and TLS versions required for connections between clients and Snowflake',
      'Maximum concurrent connections or query slots per user or role',
    ],
    answer: 'Allowed and blocked IP address ranges for connecting to a Snowflake account or individual user — network policies enforce network-layer access control independently of role-based privileges',
    exp: 'A network policy specifies ALLOWED_IP_LIST and BLOCKED_IP_LIST using CIDR notation. It can be applied at the account level (affects everyone) or overridden at the user level for specific users. If a connection request comes from an IP not in the allowed list (or explicitly in the blocked list), it is rejected before authentication even takes place. Network policies are commonly used to restrict access to corporate VPN IPs or specific office ranges.',
  },

  {
    id: 'd2_d10_05',
    domain: 2,
    topic: 'Dynamic Data Masking vs Row Access Policy',
    difficulty: 'medium',
    q: 'A SALARY column must return NULL for any user NOT in the HR_ROLE, but all other columns in the table should remain visible to everyone. Should a masking policy or a Row Access Policy be used?',
    options: [
      'A Row Access Policy — it is the standard tool for restricting visibility of specific column values based on role',
      'Both must be used together — a masking policy hides the value while a Row Access Policy prevents metadata leakage',
      'A Dynamic Data Masking policy — masking operates at the column level, returning a masked/NULL value for specific columns based on context. Row Access Policies filter entire ROWS, not individual column values.',
      'A secure view that excludes the SALARY column for non-HR roles — policies are not appropriate for column-level restrictions',
    ],
    answer: 'A Dynamic Data Masking policy — masking operates at the column level, returning a masked/NULL value for specific columns based on context. Row Access Policies filter entire ROWS, not individual column values.',
    exp: 'The key distinction: Dynamic Data Masking (DDM) operates per-column — the row is returned but the column value is transformed (e.g., replaced with NULL, a fixed string, or a partial value). Row Access Policies (RAP) operate per-row — entire rows are filtered out if the policy condition is false. When the requirement is "hide this column from some users but show the row," DDM is the correct tool. When the requirement is "show only certain rows to certain users," RAP is correct.',
  },

  {
    id: 'd2_d10_06',
    domain: 2,
    topic: 'SYSTEM$GET_PRIVATELINK_CONFIG',
    difficulty: 'medium',
    q: 'An engineer configuring AWS PrivateLink for a Snowflake account needs the VPC Endpoint Service Name and the private DNS hostname. Which function provides this?',
    options: [
      'SYSTEM$GET_PRIVATELINK_CONFIG() — returns a JSON object containing the PrivateLink endpoint service name, private DNS hostname, and other details needed to create the AWS VPC endpoint on the customer side',
      'SYSTEM$ALLOWLIST() — returns the full list of Snowflake IP ranges and hostnames to allowlist for PrivateLink',
      'SHOW PRIVATELINKS — a DDL command listing all configured PrivateLink connections for the account',
      'SELECT * FROM SNOWFLAKE.ACCOUNT_USAGE.PRIVATELINK_CONNECTIONS — a view for querying all active endpoints',
    ],
    answer: 'SYSTEM$GET_PRIVATELINK_CONFIG() — returns a JSON object containing the PrivateLink endpoint service name, private DNS hostname, and other details needed to create the AWS VPC endpoint on the customer side',
    exp: 'SYSTEM$GET_PRIVATELINK_CONFIG() returns a JSON payload with fields like privatelink-account-name, privatelink-vpce-id, privatelink-account-url, and regionless-privatelink-account-url. This information is required by the cloud administrator to create the VPC endpoint (AWS) or Private Endpoint (Azure) on the customer\'s cloud account. It is distinct from SYSTEM$ALLOWLIST(), which returns public IP ranges for firewall allowlisting when PrivateLink is NOT used.',
  },

  {
    id: 'd2_d10_07',
    domain: 2,
    topic: 'ACCESS_HISTORY — BASE_OBJECTS_ACCESSED',
    difficulty: 'medium',
    q: 'A user queries VIEW_SALES, which is defined as SELECT * FROM TABLE_ORDERS JOIN TABLE_PRODUCTS. In ACCESS_HISTORY, which column shows TABLE_ORDERS and TABLE_PRODUCTS, and which shows VIEW_SALES?',
    options: [
      'BASE_OBJECTS_ACCESSED shows VIEW_SALES; DIRECT_OBJECTS_ACCESSED shows TABLE_ORDERS and TABLE_PRODUCTS',
      'QUERY_OBJECTS lists all three; there is no BASE_OBJECTS / DIRECT_OBJECTS distinction',
      'DIRECT_OBJECTS_ACCESSED lists all three objects since they are all ultimately accessed by the query',
      'DIRECT_OBJECTS_ACCESSED shows VIEW_SALES (the object referenced in the user\'s FROM clause); BASE_OBJECTS_ACCESSED shows TABLE_ORDERS and TABLE_PRODUCTS (the underlying source tables the data actually came from)',
    ],
    answer: 'DIRECT_OBJECTS_ACCESSED shows VIEW_SALES (the object referenced in the user\'s FROM clause); BASE_OBJECTS_ACCESSED shows TABLE_ORDERS and TABLE_PRODUCTS (the underlying source tables the data actually came from)',
    exp: 'ACCESS_HISTORY distinguishes between direct access (what the user explicitly wrote in their query) and base access (the actual source objects Snowflake read to satisfy the query). DIRECT_OBJECTS_ACCESSED = the objects named in the SQL. BASE_OBJECTS_ACCESSED = the leaf-level tables/views ultimately scanned. This separation is essential for data lineage: a compliance audit asking "who accessed customer data" is better answered by BASE_OBJECTS_ACCESSED than DIRECT_OBJECTS_ACCESSED.',
  },

  {
    id: 'd2_d10_08',
    domain: 2,
    topic: 'SYSTEM$ALLOWLIST',
    difficulty: 'medium',
    q: 'A network administrator needs to configure an on-premises firewall to allow all traffic to and from Snowflake. Which function provides the comprehensive list of DNS hostnames and IP CIDRs to allowlist?',
    options: [
      'SYSTEM$GET_PRIVATELINK_CONFIG() — returns all Snowflake network addresses including public firewall entries',
      'SYSTEM$ALLOWLIST() — returns a JSON array of Snowflake hostnames and IP CIDR blocks that should be permitted in the customer\'s network firewall to allow Snowflake traffic for the account\'s cloud region',
      'SHOW NETWORK_POLICIES — lists all Snowflake network policies and their associated IP allowlists',
      'SELECT * FROM SNOWFLAKE.ACCOUNT_USAGE.NETWORK_ALLOWED_IPS — a view listing all current firewall allowlist entries',
    ],
    answer: 'SYSTEM$ALLOWLIST() — returns a JSON array of Snowflake hostnames and IP CIDR blocks that should be permitted in the customer\'s network firewall to allow Snowflake traffic for the account\'s cloud region',
    exp: 'SYSTEM$ALLOWLIST() is the authoritative source for firewall configuration. It returns host entries for all Snowflake endpoints the account needs to reach: the account itself, OCSP (certificate validation), stage access, and internal Snowflake services. Running this function from the account ensures the output is specific to the account\'s cloud provider and region. SYSTEM$ALLOWLIST_PRIVATELINK() is the variant for accounts using AWS PrivateLink or Azure Private Link, which returns the private IP ranges instead of public ones.',
  },

  {
    id: 'd2_d10_09',
    domain: 2,
    topic: 'Dynamic Data Masking — CURRENT_ROLE Evaluation',
    difficulty: 'medium',
    q: 'A masking policy checks CURRENT_ROLE() = \'HR_ROLE\' to decide whether to show the full salary. A user\'s PRIMARY role is ANALYST but they have activated HR_ROLE as a SECONDARY role. What value do they see?',
    options: [
      'The unmasked salary — masking policies automatically check all active roles including secondary roles',
      'An error — masking policies cannot evaluate when the user has multiple active roles simultaneously',
      'The masked (NULL) value — masking policies evaluate CURRENT_ROLE(), which returns only the PRIMARY active role. Since the primary role is ANALYST (not HR_ROLE), the condition is FALSE and the value is masked. To check secondary roles, the policy must use IS_ROLE_IN_SESSION(\'HR_ROLE\') instead.',
      'The unmasked salary — Snowflake automatically elevates to the most permissive role when evaluating masking policies',
    ],
    answer: 'The masked (NULL) value — masking policies evaluate CURRENT_ROLE(), which returns only the PRIMARY active role. Since the primary role is ANALYST (not HR_ROLE), the condition is FALSE and the value is masked. To check secondary roles, the policy must use IS_ROLE_IN_SESSION(\'HR_ROLE\') instead.',
    exp: 'This is a common masking policy pitfall. CURRENT_ROLE() always returns the single primary active role. If a user has activated secondary roles via USE SECONDARY ROLES ALL, CURRENT_ROLE() still returns only the primary. To write a masking policy that honours secondary roles, use IS_ROLE_IN_SESSION(\'HR_ROLE\') which returns TRUE if the role is active as either primary OR secondary. Updating the masking policy to use IS_ROLE_IN_SESSION() is the fix without requiring users to change their primary role.',
  },

  {
    id: 'd2_d10_10',
    domain: 2,
    topic: 'Resource Monitors — SUSPEND vs SUSPEND_IMMEDIATE',
    difficulty: 'hard',
    q: 'A resource monitor has ON 100 PERCENT DO SUSPEND and ON 120 PERCENT DO SUSPEND_IMMEDIATE. Both thresholds are crossed within a single billing cycle. What is the behavioural difference between the two actions?',
    options: [
      'SUSPEND stops the warehouse permanently (requires manual ALTER WAREHOUSE ... RESUME); SUSPEND_IMMEDIATE also stops it permanently but additionally sends an escalation alert to ACCOUNTADMIN',
      'SUSPEND waits for all currently running queries to complete naturally, then prevents new queries from starting. SUSPEND_IMMEDIATE cancels all currently executing queries immediately and stops the warehouse — any in-flight work is lost and must be retried.',
      'SUSPEND and SUSPEND_IMMEDIATE are identical in behaviour — both cancel running queries and stop the warehouse immediately',
      'SUSPEND drops the warehouse from the account; SUSPEND_IMMEDIATE pauses it with the ability to auto-resume on the next query',
    ],
    answer: 'SUSPEND waits for all currently running queries to complete naturally, then prevents new queries from starting. SUSPEND_IMMEDIATE cancels all currently executing queries immediately and stops the warehouse — any in-flight work is lost and must be retried.',
    exp: 'The distinction matters for workloads where partial results are costly to re-run. SUSPEND is "graceful" — it drains the current run queue before freezing. SUSPEND_IMMEDIATE is "hard stop" — it kills running queries without warning. A best-practice pattern is: 80% → NOTIFY, 100% → SUSPEND (allow current work to finish), 110% → SUSPEND_IMMEDIATE (emergency brake). After either action, the warehouse can be manually resumed by ACCOUNTADMIN or SYSADMIN.',
  },

  {
    id: 'd2_d10_11',
    domain: 2,
    topic: 'Privileges — Cloned Objects',
    difficulty: 'hard',
    q: 'Role REPORTING has SELECT on table sales_data. A developer runs CREATE TABLE sales_data_2025 CLONE sales_data. Does REPORTING automatically get SELECT on sales_data_2025?',
    options: [
      'Yes — cloning copies all privileges from the source object to the clone automatically',
      'Yes — but only if the role executing the CLONE has the MANAGE GRANTS privilege',
      'Yes — cloned objects inherit all grants unless the CLONE statement explicitly includes the DROP GRANTS clause',
      'No — a cloned object does NOT inherit grants from the source. The executing role becomes the owner of sales_data_2025 and all privileges must be re-granted explicitly. Add COPY GRANTS to the CLONE statement to transfer existing grants: CREATE TABLE sales_data_2025 CLONE sales_data COPY GRANTS.',
    ],
    answer: 'No — a cloned object does NOT inherit grants from the source. The executing role becomes the owner of sales_data_2025 and all privileges must be re-granted explicitly. Add COPY GRANTS to the CLONE statement to transfer existing grants: CREATE TABLE sales_data_2025 CLONE sales_data COPY GRANTS.',
    exp: 'This is a frequent cause of silent permission breakage in production. By default, cloning creates a new object with only the owner\'s (cloning role\'s) privileges. Existing grants on the source are not copied. Adding COPY GRANTS to the CLONE statement preserves all non-ownership privileges from the source object to the clone at creation time. This saves manually re-granting each privilege to each role that previously had access.',
  },

  {
    id: 'd2_d10_12',
    domain: 2,
    topic: 'Dynamic Data Masking — Conditional Policy Priority',
    difficulty: 'hard',
    q: 'A table column has a masking policy assigned directly at the column level AND a tag-based masking policy applied via a tag on the same column. Which policy takes precedence?',
    options: [
      'The tag-based policy takes precedence — tags are applied at a higher scope and override direct assignments',
      'Column-level masking policy assignments take precedence over tag-based policies — a direct assignment on a column overrides any policy inherited through a tag applied to that column',
      'Both policies are evaluated and the most restrictive result (more masking) is returned to the user',
      'The most recently assigned policy (by assignment timestamp) takes precedence regardless of assignment scope',
    ],
    answer: 'Column-level masking policy assignments take precedence over tag-based policies — a direct assignment on a column overrides any policy inherited through a tag applied to that column',
    exp: 'Snowflake\'s masking policy resolution follows a specificity hierarchy: a policy directly set on a column with ALTER TABLE ... MODIFY COLUMN ... SET MASKING POLICY is the most specific and wins over a policy applied via a tag on the same column. This is analogous to CSS specificity: the more specific selector wins. Administrators can leverage tags for broad default masking across many columns, then selectively override individual columns with stricter or different column-level policies.',
  },

  // ── DOMAIN 3: Data Loading, Unloading & Connectivity (11 questions) ───────

  {
    id: 'd3_d10_01',
    domain: 3,
    topic: 'Stage Commands — PUT with Folder Path',
    difficulty: 'easy',
    q: 'A developer wants to upload a file orders_jan.csv to a specific subfolder inside an internal named stage (my_stage) at the path data/2026/jan/. Which PUT command is correct?',
    options: [
      'PUT file:///local/orders_jan.csv @my_stage SUBFOLDER=\'data/2026/jan/\'',
      'PUT file:///local/orders_jan.csv @my_stage FOLDER \'data/2026/jan/\'',
      'PUT file:///local/orders_jan.csv @my_stage/data/2026/jan/ — stage paths support folder hierarchy using the / separator directly in the stage reference. Files land at the specified prefix inside the stage.',
      'PUT file:///local/orders_jan.csv @my_stage DIRECTORY=\'data/2026/jan/\'',
    ],
    answer: 'PUT file:///local/orders_jan.csv @my_stage/data/2026/jan/ — stage paths support folder hierarchy using the / separator directly in the stage reference. Files land at the specified prefix inside the stage.',
    exp: 'Snowflake internal stages support hierarchical folder paths using the / separator appended to the stage name. @my_stage/data/2026/jan/ creates a virtual path inside the stage. When referencing staged files in COPY INTO, use the same prefix: COPY INTO orders FROM @my_stage/data/2026/jan/. LIST @my_stage/data/2026/jan/ will show only files under that prefix. There is no FOLDER, SUBFOLDER, or DIRECTORY keyword in PUT — the path is embedded directly in the stage reference.',
  },

  {
    id: 'd3_d10_02',
    domain: 3,
    topic: 'COPY INTO — PURGE Parameter',
    difficulty: 'easy',
    q: 'A COPY INTO statement includes PURGE = TRUE. What happens to the source stage files after a successful load?',
    options: [
      'Source files in the stage are automatically deleted after a successful COPY INTO — PURGE = TRUE removes loaded files, reducing stage storage costs and preventing future accidental double-loads. Files that failed to load are NOT deleted.',
      'PURGE = TRUE purges the table\'s Time Travel history before loading, freeing up space for the incoming data',
      'PURGE = TRUE resets the Snowflake load history for those files, allowing them to be re-loaded without FORCE = TRUE',
      'PURGE = TRUE truncates all existing rows in the target table before inserting the new data (equivalent to TRUNCATE + INSERT)',
    ],
    answer: 'Source files in the stage are automatically deleted after a successful COPY INTO — PURGE = TRUE removes loaded files, reducing stage storage costs and preventing future accidental double-loads. Files that failed to load are NOT deleted.',
    exp: 'PURGE = TRUE is a housekeeping convenience: once files are successfully loaded, they are deleted from the stage automatically so you do not need a separate REMOVE command. This is useful for internal stages where accumulating processed files would add storage cost. Note: files that encountered errors during load are retained regardless of PURGE = TRUE, allowing inspection and reprocessing.',
  },

  {
    id: 'd3_d10_03',
    domain: 3,
    topic: 'File Formats — STRIP_OUTER_ARRAY',
    difficulty: 'easy',
    q: 'A JSON file contains a top-level array of objects: [{"id":1},{"id":2},{"id":3}]. A developer loads it with COPY INTO without setting STRIP_OUTER_ARRAY. How many rows are inserted?',
    options: [
      'Zero rows — COPY INTO fails with an error when the root of the JSON document is an array, not an object',
      'Three rows — Snowflake automatically detects top-level arrays and loads each element as a separate row by default',
      'One row — without STRIP_OUTER_ARRAY = TRUE, the entire file is treated as a single VARIANT value and loaded as one row containing the full array. STRIP_OUTER_ARRAY = TRUE splits the array into one row per element.',
      'The number of rows depends on the warehouse size — larger warehouses parallelise the array splitting',
    ],
    answer: 'One row — without STRIP_OUTER_ARRAY = TRUE, the entire file is treated as a single VARIANT value and loaded as one row containing the full array. STRIP_OUTER_ARRAY = TRUE splits the array into one row per element.',
    exp: 'STRIP_OUTER_ARRAY is one of the most common JSON loading parameters. Without it, a file containing [obj1, obj2, obj3] lands in the table as a single VARIANT cell holding the entire array — not three rows. Setting STRIP_OUTER_ARRAY = TRUE in the FILE FORMAT tells Snowflake to peel off the outer array brackets and load each element as its own row. NDJSON files (one object per line, no outer array) do not need this parameter.',
  },

  {
    id: 'd3_d10_04',
    domain: 3,
    topic: 'File Formats — FIELD_OPTIONALLY_ENCLOSED_BY',
    difficulty: 'medium',
    q: 'A CSV file uses double-quote characters to enclose field values that contain commas: "Smith, Jr.",42,"New York, NY". What file format parameter correctly handles this quoting?',
    options: [
      'QUOTED_FIELDS = TRUE — enables automatic detection and stripping of field enclosure characters',
      'ESCAPE = \'"\' — treats double-quote as an escape character applied around field values with special characters',
      'COLUMN_DELIMITER = \'"\' — changes the column delimiter from comma to double-quote for this file',
      'FIELD_OPTIONALLY_ENCLOSED_BY = \'"\' — specifies that field values may be enclosed in double-quotes. When set, Snowflake strips the enclosing quotes and treats the quoted content (including embedded commas) as a single field value.',
    ],
    answer: 'FIELD_OPTIONALLY_ENCLOSED_BY = \'"\' — specifies that field values may be enclosed in double-quotes. When set, Snowflake strips the enclosing quotes and treats the quoted content (including embedded commas) as a single field value.',
    exp: 'STRIP_OUTER_ARRAY is for JSON arrays; FIELD_OPTIONALLY_ENCLOSED_BY is the analogous concept for CSV files. They address different problems: STRIP_OUTER_ARRAY removes the outer [ ] from a JSON file so elements load as rows. FIELD_OPTIONALLY_ENCLOSED_BY=\'"\' strips double-quote field delimiters from CSV so commas inside quotes are not treated as column separators. The "optionally" means some fields can be quoted and others not — Snowflake handles both in the same file.',
  },

  {
    id: 'd3_d10_05',
    domain: 3,
    topic: 'Streams — Staleness',
    difficulty: 'medium',
    q: 'When does a Snowflake stream become STALE, and what are the consequences?',
    options: [
      'A stream becomes stale when the Time Travel data underpinning its offset expires — if the stream is not consumed before the source table\'s retention window elapses (typically 14 days of inactivity on Enterprise), the stream\'s change records are gone and the stream must be recreated',
      'A stream becomes stale after 24 hours of inactivity and automatically resets its offset to the current table state',
      'A stream becomes stale when the source table undergoes a schema change (ADD COLUMN, RENAME), but it can be refreshed by ALTER STREAM ... REFRESH',
      'A stream becomes stale after the source table is suspended — it resumes automatically when the source is active again',
    ],
    answer: 'A stream becomes stale when the Time Travel data underpinning its offset expires — if the stream is not consumed before the source table\'s retention window elapses (typically 14 days of inactivity on Enterprise), the stream\'s change records are gone and the stream must be recreated',
    exp: 'Streams track changes relative to an offset in the source table\'s Time Travel history. The STALE_AFTER timestamp (visible in SHOW STREAMS) shows when the stream will expire if not consumed. If the stream\'s offset falls outside the available Time Travel window — because no consuming DML transaction committed before the window expired — the stream becomes stale. A stale stream returns an error and must be dropped and recreated (losing the un-consumed change records). Keeping DATA_RETENTION_TIME_IN_DAYS high and monitoring STALE_AFTER prevents data loss.',
  },

  {
    id: 'd3_d10_06',
    domain: 3,
    topic: 'External Tables — Operations and REFRESH',
    difficulty: 'medium',
    q: 'New Parquet files have been added to the S3 path backing an external table. Immediately after adding the files, a query on the external table returns no new rows. What is required?',
    options: [
      'The external table must be dropped and recreated — it does not dynamically detect new files',
      'The warehouse must be restarted to clear the stale partition metadata from its local SSD cache',
      'ALTER TABLE ext_orders REFRESH — this re-scans the external stage path for new, modified, or removed files and updates the external table\'s internal partition metadata. Without REFRESH (or cloud event auto-refresh), Snowflake is unaware of file changes.',
      'New files are only visible after the next scheduled reclustering cycle runs on the external table',
    ],
    answer: 'ALTER TABLE ext_orders REFRESH — this re-scans the external stage path for new, modified, or removed files and updates the external table\'s internal partition metadata. Without REFRESH (or cloud event auto-refresh), Snowflake is unaware of file changes.',
    exp: 'External tables maintain a metadata catalog of the files on the external stage. ALTER TABLE ... REFRESH forces a re-scan of the stage path and synchronises the catalog with the actual file system state. For near-real-time ingestion, configure cloud event notifications (S3 SQS events, Azure Event Grid, GCS Pub/Sub) on the stage so Snowflake auto-refreshes the metadata when files arrive — eliminating the need for manual REFRESH calls.',
  },

  {
    id: 'd3_d10_07',
    domain: 3,
    topic: 'File Formats — NDJSON vs JSON Array',
    difficulty: 'medium',
    q: 'A data team has two JSON file formats: File A is a top-level array ([{...},{...}]) and File B is newline-delimited JSON (one object per line, no outer array). Which FILE FORMAT settings correctly load each as one row per JSON object?',
    options: [
      'File A: TYPE = JSON, STRIP_OUTER_ARRAY = TRUE — removes the outer array so each element is a row. File B: TYPE = JSON (no special parameter needed) — each newline-delimited object is already a separate record.',
      'File A: TYPE = JSON_ARRAY. File B: TYPE = NDJSON — Snowflake has dedicated type tokens for each format',
      'Both require STRIP_OUTER_ARRAY = TRUE — the parameter is needed regardless of whether the file has an outer array',
      'File A: TYPE = JSON, RECORD_DELIMITER = \']\'. File B: TYPE = JSON, RECORD_DELIMITER = \'\\n\' — record delimiter controls how objects are separated',
    ],
    answer: 'File A: TYPE = JSON, STRIP_OUTER_ARRAY = TRUE — removes the outer array so each element is a row. File B: TYPE = JSON (no special parameter needed) — each newline-delimited object is already a separate record.',
    exp: 'Snowflake\'s JSON parser handles both file layouts through the STRIP_OUTER_ARRAY parameter. For an outer-array file, STRIP_OUTER_ARRAY = TRUE tells the parser to peel off the [ ] and load each element as its own row. For NDJSON, the file already has one top-level object per line and Snowflake naturally loads each as a separate row without any additional parameter. There is no separate NDJSON type in Snowflake — TYPE = JSON handles both layouts.',
  },

  {
    id: 'd3_d10_08',
    domain: 3,
    topic: 'COPY INTO — ON_ERROR Options',
    difficulty: 'medium',
    q: 'A COPY INTO loads 200 stage files. File #37 contains a row with a data type mismatch. With the DEFAULT on_error behaviour, what happens?',
    options: [
      'Only the single bad row is skipped; all other rows in all 200 files are loaded successfully',
      'The entire load is rolled back (ON_ERROR = ABORT_STATEMENT is the default) — no rows are inserted from any file, and the bad file is logged in COPY_HISTORY. Use ON_ERROR = CONTINUE or SKIP_FILE to change this.',
      'File #37 is skipped automatically; the remaining 199 files are loaded successfully',
      'COPY INTO prompts the user to choose how to handle the error interactively',
    ],
    answer: 'The entire load is rolled back (ON_ERROR = ABORT_STATEMENT is the default) — no rows are inserted from any file, and the bad file is logged in COPY_HISTORY. Use ON_ERROR = CONTINUE or SKIP_FILE to change this.',
    exp: 'The default ON_ERROR = ABORT_STATEMENT means any error aborts and rolls back the entire COPY INTO statement, even if 199 of 200 files were fine. ON_ERROR = CONTINUE skips bad rows/files and continues loading valid data. ON_ERROR = SKIP_FILE skips the entire file containing the error but continues with other files. ON_ERROR = SKIP_FILE_<num> skips a file only if it has more than N errors. Choosing the right ON_ERROR value is critical for resilient pipelines.',
  },

  {
    id: 'd3_d10_09',
    domain: 3,
    topic: 'COPY INTO — MATCH_BY_COLUMN_NAME',
    difficulty: 'hard',
    q: 'A Parquet file has columns (customer_id, order_date, total_amount). The target Snowflake table has the same column names in a different order (total_amount, customer_id, order_date). Which COPY INTO approach correctly maps columns by name rather than position?',
    options: [
      'COPY INTO orders FROM @stage/file.parquet FILE_FORMAT = (TYPE = PARQUET) MATCH_BY_COLUMN_NAME = CASE_INSENSITIVE — maps Parquet column names to target table columns by name, making column order in the file irrelevant',
      'COPY INTO orders (customer_id, order_date, total_amount) FROM @stage/file.parquet — an explicit column list in COPY INTO overrides the file\'s column order',
      'COPY INTO orders FROM (SELECT $1, $2, $3 FROM @stage/file.parquet) — positional stage column references align with the table\'s column order',
      'Parquet files always match by column name automatically — no parameter is needed for columnar formats',
    ],
    answer: 'COPY INTO orders FROM @stage/file.parquet FILE_FORMAT = (TYPE = PARQUET) MATCH_BY_COLUMN_NAME = CASE_INSENSITIVE — maps Parquet column names to target table columns by name, making column order in the file irrelevant',
    exp: 'MATCH_BY_COLUMN_NAME = CASE_INSENSITIVE (or CASE_SENSITIVE) is available for Parquet, Avro, and ORC formats — column-rich formats that embed column names in the file schema. When set, Snowflake maps each file column to the table column with the matching name, regardless of position. This is far safer than positional mapping ($1, $2) when file schemas evolve. For CSV (which has no column name metadata), MATCH_BY_COLUMN_NAME is not applicable.',
  },

  {
    id: 'd3_d10_10',
    domain: 3,
    topic: 'Snowpipe — Auto-ingest with S3',
    difficulty: 'hard',
    q: 'To trigger Snowpipe automatically when new files arrive in an S3 bucket — without any manual intervention — which components must be configured?',
    options: [
      'Configure the S3 bucket to send s3:ObjectCreated event notifications to an SQS queue, then create a Snowpipe with AUTO_INGEST = TRUE referencing that SQS queue ARN — S3 notifies SQS, Snowflake polls SQS to detect arrivals and triggers COPY INTO',
      'Create a Lambda function that calls the Snowpipe REST API\'s insertFiles endpoint on each S3 PUT event',
      'Schedule a Snowflake Task every 1 minute to run LIST @s3_stage and call SYSTEM$PIPE_FORCE_RESUME() for new files',
      'Configure S3 to POST directly to the Snowpipe REST API endpoint on every object creation event — no SQS queue is needed',
    ],
    answer: 'Configure the S3 bucket to send s3:ObjectCreated event notifications to an SQS queue, then create a Snowpipe with AUTO_INGEST = TRUE referencing that SQS queue ARN — S3 notifies SQS, Snowflake polls SQS to detect arrivals and triggers COPY INTO',
    exp: 'The Snowpipe auto-ingest architecture for S3 has two components: (1) An SQS queue subscribed to s3:ObjectCreated events on the target bucket/prefix. (2) A Snowpipe with AUTO_INGEST = TRUE that includes the SQS queue ARN. Snowflake\'s infrastructure polls the SQS queue, picks up new event messages, and automatically loads the referenced files. For Azure, the equivalent is Event Grid + Azure Queue Storage. For GCP, it is Pub/Sub. The REST API insertFiles endpoint is an alternative for pull-based or Lambda-triggered patterns.',
  },

  {
    id: 'd3_d10_11',
    domain: 3,
    topic: 'Tasks — CRON Schedule Syntax',
    difficulty: 'hard',
    q: 'A Snowflake Task must run at 06:00 AM UTC every Monday and Friday. Which schedule expression is correct?',
    options: [
      'SCHEDULE = \'EVERY WEEK ON MON,FRI AT 06:00 UTC\'',
      'SCHEDULE = \'CRON 0 6 * * MON,FRI UTC\'',
      'SCHEDULE = \'06:00 UTC MON FRI WEEKLY\'',
      'SCHEDULE = \'USING CRON 0 6 * * 1,5 UTC\' — Snowflake Task CRON uses: minute hour day month day-of-week (0=Sun, 1=Mon … 5=Fri), followed by the timezone. USING CRON is the required keyword prefix.',
    ],
    answer: 'SCHEDULE = \'USING CRON 0 6 * * 1,5 UTC\' — Snowflake Task CRON uses: minute hour day month day-of-week (0=Sun, 1=Mon … 5=Fri), followed by the timezone. USING CRON is the required keyword prefix.',
    exp: 'Snowflake Task CRON syntax follows the standard five-field cron format (minute hour day-of-month month day-of-week) but requires the USING CRON prefix and a trailing timezone identifier. Day-of-week numbering: 0 = Sunday, 1 = Monday ... 5 = Friday, 6 = Saturday. The timezone (e.g., UTC, America/New_York, Europe/London) controls when the job fires locally. SCHEDULE = \'N MINUTE\' is the simpler interval syntax for fixed-interval tasks without day-of-week targeting.',
  },

  // ── DOMAIN 4: Performance, Querying & Transformation (13 questions) ───────

  {
    id: 'd4_d10_01',
    domain: 4,
    topic: 'Semi-structured — OBJECT_KEYS',
    difficulty: 'easy',
    q: 'What does OBJECT_KEYS(variant_col) return when applied to a VARIANT OBJECT in Snowflake?',
    options: [
      'The total count of keys in the object as an INTEGER — useful for schema discovery',
      'A VARIANT containing only the values (without keys) of all top-level key-value pairs',
      'The alphabetically first key of the object as a VARCHAR string',
      'An ARRAY of VARCHAR values containing all top-level key names of the JSON object — e.g., OBJECT_KEYS(PARSE_JSON(\'{"a":1,"b":2}\')) returns [\'a\', \'b\']',
    ],
    answer: 'An ARRAY of VARCHAR values containing all top-level key names of the JSON object — e.g., OBJECT_KEYS(PARSE_JSON(\'{"a":1,"b":2}\')) returns [\'a\', \'b\']',
    exp: 'OBJECT_KEYS() is a schema-discovery function for semi-structured data: it returns a VARIANT ARRAY of the top-level property names of a VARIANT OBJECT. Combined with FLATTEN, you can iterate over all keys dynamically. It only returns TOP-LEVEL keys — it does not recurse into nested objects. To count keys, wrap it: ARRAY_SIZE(OBJECT_KEYS(col)). Returns NULL if the input is NULL or not an OBJECT.',
  },

  {
    id: 'd4_d10_02',
    domain: 4,
    topic: 'Semi-structured — TRY_PARSE_JSON vs PARSE_JSON',
    difficulty: 'easy',
    q: 'What is the key difference between PARSE_JSON() and TRY_PARSE_JSON() in Snowflake?',
    options: [
      'PARSE_JSON validates syntax and returns a BOOLEAN; TRY_PARSE_JSON parses and returns a VARIANT',
      'Both parse a JSON string into VARIANT, but TRY_PARSE_JSON returns NULL for invalid JSON instead of raising an error. PARSE_JSON throws a SQL error on malformed input — making TRY_PARSE_JSON the safer choice for pipelines with unknown input quality.',
      'PARSE_JSON handles nested objects; TRY_PARSE_JSON only handles flat (non-nested) JSON objects',
      'TRY_PARSE_JSON is faster because it uses a simplified parser that skips type inference for numeric strings',
    ],
    answer: 'Both parse a JSON string into VARIANT, but TRY_PARSE_JSON returns NULL for invalid JSON instead of raising an error. PARSE_JSON throws a SQL error on malformed input — making TRY_PARSE_JSON the safer choice for pipelines with unknown input quality.',
    exp: 'TRY_PARSE_JSON follows the same TRY_ convention as TRY_TO_NUMBER, TRY_TO_DATE, etc. — convert and return NULL on failure rather than aborting the query. Use PARSE_JSON when input is guaranteed valid (e.g., data coming from a controlled API). Use TRY_PARSE_JSON for raw, user-generated, or third-party data where malformed JSON is possible. Pairing TRY_PARSE_JSON with WHERE col IS NOT NULL filters out the bad rows for downstream processing.',
  },

  {
    id: 'd4_d10_03',
    domain: 4,
    topic: 'Semi-structured — OBJECT_CONSTRUCT',
    difficulty: 'easy',
    q: 'Which function builds a VARIANT OBJECT from explicit key-value pairs in Snowflake SQL?',
    options: [
      'JSON_OBJECT(\'name\', name_col, \'age\', age_col) — the ANSI SQL standard function for JSON object creation',
      'BUILD_OBJECT(\'name\', name_col, \'age\', age_col) — Snowflake\'s proprietary object builder',
      'OBJECT_CONSTRUCT(\'name\', name_col, \'age\', age_col) — creates a VARIANT OBJECT with the given keys and values. NULL values are excluded by default; use OBJECT_CONSTRUCT_KEEP_NULL() to retain them.',
      'TO_OBJECT(\'name\', name_col, \'age\', age_col) — converts a key-value argument list to a VARIANT',
    ],
    answer: 'OBJECT_CONSTRUCT(\'name\', name_col, \'age\', age_col) — creates a VARIANT OBJECT with the given keys and values. NULL values are excluded by default; use OBJECT_CONSTRUCT_KEEP_NULL() to retain them.',
    exp: 'OBJECT_CONSTRUCT takes alternating key (string) and value (any type) arguments and returns a VARIANT OBJECT. Keys whose values are NULL are silently dropped from the resulting object — a frequent gotcha when building payloads for APIs or downstream systems that expect all keys to be present. OBJECT_CONSTRUCT_KEEP_NULL() preserves NULL values as JSON null. JSON_OBJECT is ANSI SQL but not supported in Snowflake; BUILD_OBJECT and TO_OBJECT are not valid functions.',
  },

  {
    id: 'd4_d10_04',
    domain: 4,
    topic: 'Clustering Keys — Good Column Characteristics',
    difficulty: 'medium',
    q: 'Which set of column characteristics makes a column an IDEAL candidate for a Snowflake clustering key?',
    options: [
      'Frequently used in WHERE, JOIN, or GROUP BY predicates AND has medium-to-high cardinality (enough distinct values to create narrow, non-overlapping partition ranges) AND values are NOT monotonically increasing — these properties yield the most effective partition pruning',
      'A primary key with a unique value per row — uniqueness maximises the number of distinct partition ranges',
      'A column with very few distinct values (2–10) — low cardinality ensures the maximum number of rows share the same partition, minimising the partition count',
      'A column that is never used in WHERE clauses — clustering should compensate for columns the optimizer cannot use for pruning on its own',
    ],
    answer: 'Frequently used in WHERE, JOIN, or GROUP BY predicates AND has medium-to-high cardinality (enough distinct values to create narrow, non-overlapping partition ranges) AND values are NOT monotonically increasing — these properties yield the most effective partition pruning',
    exp: 'A clustering key is most valuable when queries are highly selective on that column (frequent in WHERE/JOIN), the column has cardinality high enough to produce narrow partition ranges (ideally dozens to thousands of distinct values per table), and the values are distributed across the historical data rather than always increasing. Too low cardinality (e.g., a boolean) means each partition spans half the table. Too high uniqueness (e.g., UUID) means all partitions have non-overlapping ranges but queries never filter by that key.',
  },

  {
    id: 'd4_d10_05',
    domain: 4,
    topic: 'Semi-structured — Colon Path Notation',
    difficulty: 'medium',
    q: 'A VARIANT column event_payload contains {"user": {"id": 42, "country": "MX"}, "action": "click"}. What is the MOST CONCISE way to extract the country as a VARCHAR?',
    options: [
      'GET(GET(event_payload, \'user\'), \'country\')::VARCHAR — nested GET() calls navigate the hierarchy',
      'event_payload[\'user\'][\'country\']::VARCHAR — bracket notation accesses nested object keys',
      'JSON_EXTRACT(event_payload, \'$.user.country\')::VARCHAR — JSONPath syntax with the $ root reference',
      'event_payload:user:country::VARCHAR — colon path notation navigates nested VARIANT objects using colons as separators; ::VARCHAR casts the VARIANT result. This is the most idiomatic and concise Snowflake syntax.',
    ],
    answer: 'event_payload:user:country::VARCHAR — colon path notation navigates nested VARIANT objects using colons as separators; ::VARCHAR casts the VARIANT result. This is the most idiomatic and concise Snowflake syntax.',
    exp: 'Snowflake supports three equivalent syntaxes for VARIANT path traversal: colon notation (col:key1:key2), bracket notation (col[\'key1\'][\'key2\']), and GET() function calls. All three are valid and produce identical results. Colon notation is the most concise and idiomatic in Snowflake SQL. Bracket notation is preferred by those familiar with Python/JavaScript. GET() is useful when the key is dynamic (a variable). JSON_EXTRACT() is not a Snowflake function — Snowflake uses its own path operators instead of JSONPath.',
  },

  {
    id: 'd4_d10_06',
    domain: 4,
    topic: 'Semi-structured — ARRAY_TO_STRING',
    difficulty: 'medium',
    q: 'A VARIANT column categories contains a JSON array [\'snowflake\', \'cloud\', \'data\']. How do you produce the comma-separated string \'snowflake,cloud,data\'?',
    options: [
      'LISTAGG(categories::STRING, \',\') — aggregates the VARIANT array elements into a delimited string',
      'ARRAY_TO_STRING(categories, \',\') — converts a VARIANT ARRAY to a delimited VARCHAR string, joining each element with the specified separator character',
      'TO_VARCHAR(categories) — casting the VARIANT array to VARCHAR produces a comma-separated string without brackets',
      'FLATTEN(categories) combined with LISTAGG(VALUE::STRING, \',\') — the only correct way to convert a VARIANT array column to a delimited string',
    ],
    answer: 'ARRAY_TO_STRING(categories, \',\') — converts a VARIANT ARRAY to a delimited VARCHAR string, joining each element with the specified separator character',
    exp: 'ARRAY_TO_STRING(array_variant, separator) is the direct function for this transformation. It iterates the array elements and joins their string representations with the separator. NULL elements produce an empty string in the join. TO_VARCHAR on a VARIANT array produces the JSON array notation (with brackets and quotes), not the clean delimited string. LISTAGG is an aggregate function that works across rows — it requires FLATTEN first to expand the array into rows, making ARRAY_TO_STRING far more concise for this use case.',
  },

  {
    id: 'd4_d10_07',
    domain: 4,
    topic: 'Query Anti-patterns — Exploding Join',
    difficulty: 'medium',
    q: 'A developer joins orders (1M rows) to order_items (5M rows) on order_id and the result has 50M rows — 10× more than expected. What is the most likely cause?',
    options: [
      'A CROSS JOIN was unintentionally used instead of an INNER JOIN',
      'The warehouse is too small and is creating duplicate rows during the spill-to-disk operation',
      'An "exploding join" — order_id is NOT unique in one or both tables. Duplicate order_id values on either side cause a many-to-many match, where each duplicate on the left side matches every duplicate on the right side, multiplying the row count geometrically.',
      'Snowflake\'s broadcast join chose the wrong table as the broadcast side, creating row duplication',
    ],
    answer: 'An "exploding join" — order_id is NOT unique in one or both tables. Duplicate order_id values on either side cause a many-to-many match, where each duplicate on the left side matches every duplicate on the right side, multiplying the row count geometrically.',
    exp: 'An exploding join produces far more output rows than input rows and is almost always caused by unexpected many-to-many relationship (duplicate join keys on both sides). Detection: compare COUNT(*) before and after the join; check for duplicates with COUNT(*) vs COUNT(DISTINCT join_key). Fix: identify which table has unexpected duplicates (usually a data quality issue) and deduplicate using QUALIFY ROW_NUMBER() OVER (PARTITION BY key ORDER BY ...) = 1 before the join, or by adding additional join predicates to narrow the match.',
  },

  {
    id: 'd4_d10_08',
    domain: 4,
    topic: 'Semi-structured — OBJECT_AGG',
    difficulty: 'medium',
    q: 'A table has rows (category VARCHAR, total_sales NUMBER). How do you build a single JSON object {"Electronics": 52000, "Clothing": 31000, ...} with one key per category using a single query?',
    options: [
      'SELECT OBJECT_AGG(category, total_sales::VARIANT) FROM category_sales — OBJECT_AGG(key_col, value_col) aggregates all rows into one VARIANT OBJECT where each row contributes a key-value pair',
      'SELECT OBJECT_CONSTRUCT(category, total_sales) FROM category_sales — OBJECT_CONSTRUCT builds one object per row, not an aggregate across all rows',
      'SELECT TO_OBJECT(LISTAGG(category, \',\'), LISTAGG(total_sales::STRING, \',\')) FROM category_sales',
      'SELECT JSON_AGG(category, total_sales) FROM category_sales — JSON_AGG is Snowflake\'s aggregation function for building JSON objects',
    ],
    answer: 'SELECT OBJECT_AGG(category, total_sales::VARIANT) FROM category_sales — OBJECT_AGG(key_col, value_col) aggregates all rows into one VARIANT OBJECT where each row contributes a key-value pair',
    exp: 'OBJECT_AGG is the object equivalent of ARRAY_AGG: it reduces multiple rows into a single VARIANT OBJECT. The first argument provides the string key, the second provides the value (must be castable to VARIANT). Duplicate keys cause the last value to win. Pairing with GROUP BY lets you build nested objects per partition. JSON_AGG is not a Snowflake function. OBJECT_CONSTRUCT builds one object per row from explicit key-value pairs — it is not an aggregate.',
  },

  {
    id: 'd4_d10_09',
    domain: 4,
    topic: 'Clustering — Depth Metric',
    difficulty: 'medium',
    q: 'SYSTEM$CLUSTERING_INFORMATION(\'orders\') returns {"average_overlaps": 0.5, "average_depth": 1.3}. What does average_depth of 1.3 indicate?',
    options: [
      'The table has 1.3 TB of redundant data stored across overlapping micro-partitions',
      'The clustering service has run 1.3 times on average per partition since the table was created',
      '1.3% of micro-partitions have key range overlaps — indicating near-perfect clustering',
      'Each micro-partition\'s key range overlaps with an average of 1.3 other partitions — a value close to 1.0 means excellent clustering (minimal overlap). This table is very well-clustered and requires little reclustering effort.',
    ],
    answer: 'Each micro-partition\'s key range overlaps with an average of 1.3 other partitions — a value close to 1.0 means excellent clustering (minimal overlap). This table is very well-clustered and requires little reclustering effort.',
    exp: 'average_depth is the key health metric for a clustered table. A value of 1.0 means perfect clustering: every micro-partition contains exactly one "layer" of key values with no range overlap from other partitions. Values between 1 and 3 are generally healthy. Values above 5–6 indicate meaningful degradation from DML fragmentation. A high depth means queries scanning a narrow key range must read many more partitions than necessary — directly impacting query performance and credits spent on scanning.',
  },

  {
    id: 'd4_d10_10',
    domain: 4,
    topic: 'Clustering — When a Large Table Benefits',
    difficulty: 'medium',
    q: 'A 3 TB orders table consistently shows "Partitions scanned: 4,200 / 4,200" in the Query Profile for queries like WHERE order_date = \'2026-01-15\'. What does this indicate and what is the recommended action?',
    options: [
      'Perfect clustering — scanning all 4,200 partitions confirms the query fully utilises all available data',
      'The table is too large for the current warehouse — upgrade to a larger warehouse to reduce scan time',
      'The table has no useful clustering for the order_date predicate — all 4,200 micro-partitions are scanned because order_date values are spread across every partition. Applying CLUSTER BY (order_date) and enabling Automatic Clustering would co-locate rows by date, allowing Snowflake to prune most partitions for date-specific queries.',
      'CLUSTER BY is unnecessary — add a Search Optimization Service index on order_date for point-lookup acceleration instead',
    ],
    answer: 'The table has no useful clustering for the order_date predicate — all 4,200 micro-partitions are scanned because order_date values are spread across every partition. Applying CLUSTER BY (order_date) and enabling Automatic Clustering would co-locate rows by date, allowing Snowflake to prune most partitions for date-specific queries.',
    exp: '"Partitions scanned: N/N" in the Query Profile means zero pruning occurred — every partition had to be read. This is the clear signal that the table\'s physical layout does not match the query\'s predicate. For range or equality predicates on a date column, CLUSTER BY (order_date) is the standard solution. Search Optimization Service is complementary for point-lookup predicates (equality, IN lists, LIKE searches) but is not a replacement for clustering on range filters.',
  },

  {
    id: 'd4_d10_11',
    domain: 4,
    topic: 'Clustering — Monotonically Increasing Anti-pattern',
    difficulty: 'hard',
    q: 'A developer proposes CLUSTER BY (created_at) on a high-volume event table where created_at is a TIMESTAMP that increases with each insert. Why is this a poor clustering choice for historical range queries?',
    options: [
      'TIMESTAMP columns cannot be used as clustering keys — only DATE, NUMBER, and VARCHAR are supported',
      'Monotonically increasing clustering keys work perfectly — they create perfectly ordered partitions with no range overlap',
      'A monotonically increasing key means each new micro-partition always has a key range strictly higher than all existing partitions. Every partition\'s range is already unique and non-overlapping, so there is nothing for the pruning algorithm to eliminate. Historical range queries (e.g., WHERE created_at BETWEEN ...) still scan all partitions within the range — the key provides no extra pruning benefit, while Automatic Clustering wastes credits trying to maintain it.',
      'TIMESTAMP clustering keys fail silently for queries using DATE(created_at) in the WHERE clause — use CLUSTER BY (DATE(created_at)) instead',
    ],
    answer: 'A monotonically increasing key means each new micro-partition always has a key range strictly higher than all existing partitions. Every partition\'s range is already unique and non-overlapping, so there is nothing for the pruning algorithm to eliminate. Historical range queries (e.g., WHERE created_at BETWEEN ...) still scan all partitions within the range — the key provides no extra pruning benefit, while Automatic Clustering wastes credits trying to maintain it.',
    exp: 'The pruning benefit of clustering comes from overlapping value ranges: when different partitions share overlapping ranges, only a subset contain the query\'s target values. Monotonically increasing keys (auto-increment IDs, event timestamps, Snowflake sequence numbers) naturally produce non-overlapping partitions in insertion order — meaning Snowflake\'s micro-partition metadata already tracks them correctly without any clustering key. Defining a clustering key on such a column wastes reclustering credits without improving query performance.',
  },

  {
    id: 'd4_d10_12',
    domain: 4,
    topic: 'Query Anti-patterns — Exploding Join Fix',
    difficulty: 'hard',
    q: 'A query joining dim_date (365 rows) to fact_sales (100M rows) on date_key produces 500M result rows — 5× the fact table size. After investigating, fact_sales has duplicate date_key values (multiple rows per date) AND dim_date has 5 rows per date_key due to a bug. How is this fixed?',
    options: [
      'Deduplicate BOTH tables before the join — either fix the source data (preferred) or apply QUALIFY ROW_NUMBER() OVER (PARTITION BY date_key ORDER BY ...) = 1 to each table before joining. Eliminating duplicates from both sides collapses the many-to-many back to a one-to-many join.',
      'Switch from INNER JOIN to LEFT JOIN — LEFT JOIN avoids row multiplication from duplicate keys on the right side',
      'Add ORDER BY date_key to the query — sorting prevents Snowflake from creating duplicate matches during the hash join phase',
      'Increase the warehouse size — the row multiplication is caused by insufficient memory forcing Snowflake to re-process partition batches',
    ],
    answer: 'Deduplicate BOTH tables before the join — either fix the source data (preferred) or apply QUALIFY ROW_NUMBER() OVER (PARTITION BY date_key ORDER BY ...) = 1 to each table before joining. Eliminating duplicates from both sides collapses the many-to-many back to a one-to-many join.',
    exp: 'An exploding join with duplicates on both sides is the worst case: 5 dim_date rows × N fact_sales rows per date = 5N output rows per date. The fix must target the root cause — duplicate keys. The cleanest approach is deduplicating in a CTE or subquery before the join. QUALIFY ROW_NUMBER() = 1 is an efficient deduplication pattern in Snowflake. LEFT vs INNER JOIN does not change the cardinality when the right side has duplicates. Warehouse size has no effect on the mathematical output cardinality.',
  },

  {
    id: 'd4_d10_13',
    domain: 4,
    topic: 'Semi-structured — VARIANT Type Coercion',
    difficulty: 'hard',
    q: 'A VARIANT column data contains the string value "null" (a JSON null literal). A developer runs: data:status::VARCHAR. What is returned?',
    options: [
      'The string \'null\' — VARIANT preserves the JSON null literal as the four-character string when cast to VARCHAR',
      'An empty string \'\' — Snowflake converts JSON null to an empty string when casting to VARCHAR',
      'The SQL NULL value — Snowflake maps JSON null (the literal) to SQL NULL when casting a VARIANT containing null to a concrete type. This means IS NULL checks correctly identify JSON null values after casting.',
      'An error — VARIANT columns containing JSON null cannot be cast to VARCHAR and require TRY_TO_VARCHAR instead',
    ],
    answer: 'The SQL NULL value — Snowflake maps JSON null (the literal) to SQL NULL when casting a VARIANT containing null to a concrete type. This means IS NULL checks correctly identify JSON null values after casting.',
    exp: 'In Snowflake, JSON null (the literal null in a JSON document) is stored as a special VARIANT value distinct from SQL NULL. However, when you cast it to a concrete type with ::VARCHAR (or any other type), the JSON null maps to SQL NULL. This coercion is intentional and makes null-handling consistent: you can use IS NULL / IS NOT NULL on cast results just like regular columns. If you need to distinguish between SQL NULL (absent key) and JSON null (explicit null value), use the raw VARIANT path before casting.',
  },

  // ── DOMAIN 5: Data Collaboration (5 questions) ────────────────────────────

  {
    id: 'd5_d10_01',
    domain: 5,
    topic: 'Secure Data Sharing — Consumer Compute Costs',
    difficulty: 'easy',
    q: 'When a data consumer queries a shared table in a Snowflake Secure Data Share, who pays for the virtual warehouse compute?',
    options: [
      'The data provider — they are responsible for all compute costs when any consumer queries shared data',
      'The data consumer — the consumer\'s own virtual warehouse executes the query. The provider only pays for the storage of their shared objects; all query compute is billed to the consumer.',
      'Costs are split 50/50 between provider and consumer based on the number of rows returned',
      'There is no compute cost for shared data queries — Snowflake waives warehouse charges as an incentive to share data',
    ],
    answer: 'The data consumer — the consumer\'s own virtual warehouse executes the query. The provider only pays for the storage of their shared objects; all query compute is billed to the consumer.',
    exp: 'This is a core advantage of Snowflake\'s sharing model. The provider incurs no additional compute cost as consumers grow or query intensively. The consumer\'s warehouse accesses the shared micro-partitions directly from the provider\'s cloud storage — no data is copied. The exception is Reader Accounts, where the provider creates the account and pays for that account\'s compute on behalf of non-Snowflake consumers.',
  },

  {
    id: 'd5_d10_02',
    domain: 5,
    topic: 'Marketplace Listings — Provider vs Consumer Costs',
    difficulty: 'easy',
    q: 'A company publishes a dataset on the Snowflake Marketplace. What are the provider\'s ongoing technical billing obligations?',
    options: [
      'The provider pays for the storage of the shared data objects in their Snowflake account. Consumer query compute is billed to the consumer. Revenue sharing or listing fees are commercial terms negotiated separately from the technical billing model.',
      'The provider pays for both storage AND all compute generated by consumer queries — Marketplace listings shift the compute cost model to the provider',
      'Providers have zero costs — Snowflake covers all storage and compute for Marketplace listings to incentivise data publishing',
      'Providers pay a per-query fee to Snowflake for each time a consumer accesses the listing',
    ],
    answer: 'The provider pays for the storage of the shared data objects in their Snowflake account. Consumer query compute is billed to the consumer. Revenue sharing or listing fees are commercial terms negotiated separately from the technical billing model.',
    exp: 'The technical billing model for Marketplace is identical to regular Secure Data Sharing: the provider holds the data (pays for storage), and the consumer executes queries against it (pays for compute). There is no per-query charge from Snowflake for data access. Marketplace adds the discovery and commercial layer on top — providers can offer free or paid listings, and Snowflake facilitates revenue sharing for paid listings, but those are contractual/financial terms, not additional storage/compute charges.',
  },

  {
    id: 'd5_d10_03',
    domain: 5,
    topic: 'Cross-cloud Data Sharing',
    difficulty: 'medium',
    q: 'A Snowflake account on AWS us-east-1 wants to share live data with a partner on Azure East US. What is the correct approach?',
    options: [
      'Add the Azure account directly to the share — cross-cloud sharing is natively supported and works the same as same-cloud sharing',
      'Use Database Replication or auto-fulfillment: replicate the database to a Snowflake account on Azure East US, then share locally from that account. Direct live sharing across cloud providers is not supported — consumers must be on the same cloud/region as the provider or access a local replica.',
      'Export the shared data to Azure Blob Storage and have the consumer load it into their Snowflake account using COPY INTO',
      'Cross-cloud shares require both accounts to be in the same Snowflake Organisation and same business region — cloud platform differences block all sharing',
    ],
    answer: 'Use Database Replication or auto-fulfillment: replicate the database to a Snowflake account on Azure East US, then share locally from that account. Direct live sharing across cloud providers is not supported — consumers must be on the same cloud/region as the provider or access a local replica.',
    exp: 'Snowflake Data Sharing requires both provider and consumer to be in the same cloud provider AND region. Cross-cloud or cross-region sharing requires an intermediate replication step: replicate the database to a secondary account in the target cloud/region (using a Replication Group or the Marketplace auto-fulfillment feature), then share from that secondary account. Business Critical edition is required for cross-cloud replication. The consumer then queries the local replica at no additional cross-cloud data transfer cost from Snowflake\'s perspective.',
  },

  {
    id: 'd5_d10_04',
    domain: 5,
    topic: 'Reader Accounts — Limitations',
    difficulty: 'medium',
    q: 'What is a key limitation of a Snowflake Reader Account compared to a standard Snowflake consumer account?',
    options: [
      'Reader Accounts cannot query data from shares — they can only download data as CSV files via the Snowsight export feature',
      'Reader Accounts are capped at 1 TB of shared data access per calendar month',
      'Reader Accounts cannot create their own database objects, load their own data into Snowflake, or re-share data with other accounts. They are read-only consumers of the provider\'s shared data. The provider also pays for the Reader Account\'s compute costs.',
      'Reader Accounts cannot use virtual warehouses — they must use a Snowflake-managed serverless compute tier',
    ],
    answer: 'Reader Accounts cannot create their own database objects, load their own data into Snowflake, or re-share data with other accounts. They are read-only consumers of the provider\'s shared data. The provider also pays for the Reader Account\'s compute costs.',
    exp: 'Reader Accounts are provisioned by the data provider for consumers who do not have their own Snowflake accounts. They are intentionally restricted: no ability to create tables, stages, load data, or create their own shares. They can only query the data the provider has shared with them. Critically, the provider bears the compute costs for Reader Account queries — unlike regular Snowflake consumers who pay for their own compute. This cost shift should be factored into the decision to use Reader Accounts vs. encouraging consumers to get their own Snowflake accounts.',
  },

  {
    id: 'd5_d10_05',
    domain: 5,
    topic: 'Replication — Failover Topology After Promotion',
    difficulty: 'hard',
    q: 'A Business Critical account uses database replication: Account A (primary) replicates to Account B (secondary). Account A becomes unavailable and Account B is promoted to primary via a failover. What is the state of the replication topology after promotion?',
    options: [
      'Account A\'s data is permanently lost — failover destroys all data on the failed primary to prevent split-brain scenarios',
      'Account A automatically becomes the new secondary and immediately begins replicating from Account B',
      'Both accounts now hold independent copies of the same data — no replication relationship exists post-failover and both act as equal primaries',
      'After failover, Account B is the new primary. Account A (once restored) becomes a standby with no active replication role. A new replication relationship must be manually configured to establish Account A as the secondary — data is not automatically synchronised back.',
    ],
    answer: 'After failover, Account B is the new primary. Account A (once restored) becomes a standby with no active replication role. A new replication relationship must be manually configured to establish Account A as the secondary — data is not automatically synchronised back.',
    exp: 'Failover in Snowflake is not automatic — it requires deliberate action (ALTER DATABASE ... PRIMARY). After Account B is promoted to primary, Account A is demoted but does not automatically resume replication in the reverse direction once it recovers. The DBA must explicitly reconfigure replication: ALTER DATABASE ... ENABLE REPLICATION TO ACCOUNTS ... with Account B as the new source. This controlled topology change prevents accidental data overwrites and gives administrators control over the recovery sequence.',
  },

];
