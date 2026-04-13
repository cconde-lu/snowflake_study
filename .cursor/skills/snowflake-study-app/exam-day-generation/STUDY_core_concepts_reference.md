# COF-C03 Study Guide: Core Concepts Quick Reference

## 1. ARCHITECTURE & FEATURES

### Three-Layer Architecture
- **Cloud Services**: Authentication, query parsing/optimization, metadata, access control, result cache
- **Compute (Warehouses)**: Query execution, UDFs, local SSD cache. Independent of storage.
- **Storage**: Centralized cloud storage (S3/Azure Blob/GCS). Micro-partitions, immutable, columnar, 50-500 MB uncompressed.

### Warehouse Billing
| Size | Credits/Hour |
|------|-------------|
| X-Small | 1 |
| Small | 2 |
| Medium | 4 |
| Large | 8 |
| X-Large | 16 |
| 2XL | 32 |
| 3XL | 64 |
| 4XL | 128 |

- Billed per-second, 60-second minimum per resume
- Number of queries is irrelevant; only size and runtime matter
- AUTO_SUSPEND = 0 means NEVER auto-suspend (not "suspend immediately")

### Multi-Cluster Warehouses
- Requires Enterprise Edition or higher
- STANDARD scaling: adds cluster immediately on queuing
- ECONOMY scaling: adds cluster only when estimated busy for 6+ minutes (saves credits, more queuing)
- ALLOW_OVERLAPPING_EXECUTION = FALSE (default): skips next run if current still executing

### Editions Feature Gates
| Feature | Minimum Edition |
|---------|----------------|
| Multi-cluster warehouses | Enterprise |
| Time Travel up to 90 days | Enterprise |
| Materialized views | Enterprise |
| Dynamic data masking | Enterprise |
| Column-level security | Enterprise |
| Tri-Secret Secure (CMK) | Business Critical |
| PrivateLink | Business Critical |
| PHI/HIPAA compliance | Business Critical |
| Data sharing via Support only | VPS |

### Table Types & Data Protection
| Type | Time Travel | Fail-safe | Persists |
|------|------------|-----------|----------|
| Permanent | 0-90 days (Enterprise) | 7 days | Until dropped |
| Transient | 0-1 day (all editions) | 0 days | Until dropped |
| Temporary | 0-1 day | 0 days | Session end |

- Total protection = Time Travel + Fail-safe (e.g., 10 + 7 = 17 days)
- Fail-safe: ONLY Snowflake Support can attempt recovery (not user-accessible)
- CDP cost reduction for high-churn: use transient + reduce retention

### Cloning
- Zero-copy clone: no additional storage until data diverges
- Clones inherit source retention at clone time
- Clone captures transactional snapshot (concurrent DML does not affect it)
- Cloning a transient table requires CREATE TRANSIENT TABLE ... CLONE
- Cloneable: databases, schemas, tables, external stages
- NOT cloneable: internal stages, external tables, pipes, shares, warehouses

### UNDROP
- Works for: tables, schemas, databases (within Time Travel retention)
- Does NOT work for: stages, pipes, warehouses, views

### Streams & Change Tracking
- Stream: tracks INSERT/UPDATE/DELETE on a source table
- CHANGE_TRACKING = TRUE: enables CHANGES clause without creating a stream
- Stream offset advances after successful DML consumption (returns 0 rows after)
- SYSTEM$STREAM_HAS_DATA(): returns TRUE/FALSE (used in task WHEN clauses)
- Stale stream: occurs when unconsumed past retention period; must DROP and RECREATE
- Stream staleness visible via SHOW STREAMS (stale_after column)

### Tasks & DAGs
- Root task: has SCHEDULE (CRON or interval)
- Child tasks: NO schedule; triggered by predecessor completion
- WHEN clause: if FALSE, task is skipped entirely (no compute consumed)
- Serverless tasks: no WAREHOUSE specified, uses USER_TASK_MANAGED_INITIAL_WAREHOUSE_SIZE
- OPERATE privilege: required to resume/suspend/execute a task

### Dynamic Tables
- Defined by a SELECT query with TARGET_LAG
- Snowflake automatically maintains freshness
- Unlike materialized views: supports JOINs and complex transformations

### Sequences
- Guarantee unique values
- Do NOT guarantee gap-free or ordered assignment across concurrent sessions

### Replication
- Replication group: collection of objects replicated to target accounts (read-only)
- Failover group: extends replication with read-write failover capability
- Database Replication: works cross-region and cross-cloud

### Snowpark
- DataFrames are lazily evaluated; computation runs on the session's warehouse
- Snowpark-optimized warehouses: higher memory ratio for ML/large UDFs

### Key Functions
| Function | Purpose |
|----------|---------|
| UUID_STRING() | Generate random UUID v4 |
| SYSTEM$ALLOWLIST() | Firewall allowlist hostnames/ports |
| SYSTEM$GET_PRIVATELINK_CONFIG() | PrivateLink endpoint details |
| SYSTEM$CANCEL_QUERY(id) | Cancel a running query |
| SYSTEM$CLUSTERING_INFORMATION() | Clustering depth/overlap stats |
| SYSTEM$CLASSIFY() | Data classification (semantic/privacy tags) |


## 2. ACCOUNT ACCESS & SECURITY

### System Roles Hierarchy
```
ACCOUNTADMIN (top)
  |-- SECURITYADMIN (grants, inherits USERADMIN)
  |     |-- USERADMIN (create/manage users and roles)
  |-- SYSADMIN (create databases, warehouses, schemas)
PUBLIC (bottom, inherited by all)
```
- ORGADMIN: organization-level only (create accounts, view org usage)
- Custom roles should be granted to SYSADMIN (best practice)
- Orphan roles (not granted to SYSADMIN) make objects invisible to admins

### Key Role Distinctions
- USERADMIN: create users, create roles, grant roles to users
- SECURITYADMIN: all of USERADMIN + manage object-level grants (GRANT SELECT, etc.)
- SYSADMIN: create databases, warehouses, schemas (NOT users)
- ACCOUNTADMIN: billing, resource monitors, account-level settings

### Privilege Highlights
- Resource monitors: only ACCOUNTADMIN can CREATE; MONITOR/MODIFY can be granted
- OPERATE on task: resume, suspend, EXECUTE TASK
- CREATE STAGE + USAGE on storage integration: needed for external stages

### CURRENT_ROLE() vs IS_ROLE_IN_SESSION()
- CURRENT_ROLE(): returns primary role ONLY
- IS_ROLE_IN_SESSION(): checks primary + secondary + inherited roles
- Always prefer IS_ROLE_IN_SESSION() in masking/row access policies

### Secondary Roles
- USE SECONDARY ROLES ALL: activates all granted roles alongside primary
- Without secondary roles, only primary role privileges apply

### Masking Policies
- No role bypasses masking policies (not even ACCOUNTADMIN)
- Tag-based masking: attach policy to a tag; tagged columns inherit automatically
- Tags alone are metadata labels; policies must be attached for enforcement
- Projection policies: control which roles can SELECT a column

### Row Access Policies
- Evaluated for EVERY role (no bypass)
- CASE with no ELSE returns NULL (treated as FALSE = zero rows)
- Policy body is arbitrary SQL logic

### Network Policies
- User-level policy OVERRIDES (not merges with) account-level
- BLOCKED_IP_LIST takes precedence over ALLOWED_IP_LIST
- REQUIRE_STORAGE_INTEGRATION_FOR_STAGE_CREATION: forces storage integrations (no inline creds)

### Authentication
- SSO: SAML 2.0 (Okta, Azure AD)
- Programmatic clients: key-pair (RSA) or OAuth
- SQL API: OAuth tokens or JWT from key-pair
- Kafka connector: key-pair authentication
- SCIM: automates user/group provisioning from IdP
- Key-pair: RSA_PUBLIC_KEY set on user (private key stays local, never sent to Snowflake)

### Encryption
- All editions: AES-256 at rest, TLS 1.2 in transit (default)
- Business Critical+: Tri-Secret Secure (customer-managed keys via cloud KMS)

### Governance Views (ACCOUNT_USAGE)
| View | What it tracks |
|------|---------------|
| ACCESS_HISTORY | Column-level data access (which role queried which columns) |
| QUERY_HISTORY | Query execution details (text, duration, warehouse) |
| LOGIN_HISTORY | Authentication events |
| WAREHOUSE_METERING_HISTORY | Credit consumption per warehouse |
| TABLE_STORAGE_METRICS | Storage by table (active, time travel, fail-safe) |

- ACCOUNT_USAGE: 45min-3hr latency, up to 365 days retention
- INFORMATION_SCHEMA: near real-time, current database only, 7-14 day retention


## 3. PERFORMANCE CONCEPTS

### Caching Layers
| Cache | Location | Survives Suspend? | Duration |
|-------|----------|-------------------|----------|
| Result cache | Cloud Services | Yes | 24 hours (reuse resets timer) |
| Local SSD/disk cache | Warehouse nodes | No (wiped on suspend) | While running |
| Metadata cache | Cloud Services | Yes | Always (row counts, min/max) |

- Result cache is role-specific when row access or masking policies exist
- COUNT(*) can be answered from metadata without a warehouse

### Clustering
- Best columns: DATE, TIMESTAMP, low-to-medium cardinality used in WHERE/JOIN
- Put lower-cardinality column first in multi-column keys
- SYSTEM$CLUSTERING_INFORMATION: average_depth near 1 = good; high depth/overlap = poor
- Automatic Clustering: serverless compute (not tracked by resource monitors)
- Search Optimization Service: best for high-cardinality equality/IN lookups (creates search access paths)

### Scale Up vs Scale Out
- Scale UP (bigger warehouse): improves single complex query performance
- Scale OUT (multi-cluster): improves concurrency (many users, short queries)

### Query Profile Indicators
| Indicator | Meaning |
|-----------|---------|
| Spilling to local storage | Moderate impact; consider upsizing |
| Spilling to remote storage | Severe impact; upsize warehouse |
| Exploding joins | Missing/non-selective join condition (Cartesian product) |
| High bytes over network | Data redistribution for JOINs across nodes |
| Table pruning stats | Partitions scanned vs total = pruning efficiency |


## 4. DATA LOADING & UNLOADING

### COPY INTO Defaults
| Context | ON_ERROR Default |
|---------|-----------------|
| Bulk COPY INTO | ABORT_STATEMENT |
| Snowpipe | SKIP_FILE |

### Load Metadata Retention
| Method | Retention |
|--------|-----------|
| Bulk COPY INTO | 64 days |
| Snowpipe | 14 days |

- FORCE = TRUE: bypasses deduplication, risks duplicate rows

### Key COPY Parameters
| Parameter | Purpose |
|-----------|---------|
| ON_ERROR | ABORT_STATEMENT, SKIP_FILE, CONTINUE, SKIP_FILE_n |
| VALIDATION_MODE | Dry-run only, no data loaded (RETURN_ALL_ERRORS, RETURN_n_ROWS) |
| MATCH_BY_COLUMN_NAME | Match by name instead of position (CASE_SENSITIVE/INSENSITIVE) |
| ERROR_ON_COLUMN_COUNT_MISMATCH | Error if column counts differ (default TRUE) |
| FORCE | Reload already-loaded files |
| PARSE_HEADER | Read first CSV row as column headers |
| TRUNCATECOLUMNS | Truncate strings exceeding column length |

### COPY INTO with Transformations
- Supports SELECT subquery: COPY INTO tbl FROM (SELECT $1, UPPER($2) FROM @stage)
- METADATA$FILENAME: capture source filename per row
- METADATA$FILE_ROW_NUMBER: capture row number within source file

### File Format Options
| Option | Format | Purpose |
|--------|--------|---------|
| STRIP_OUTER_ARRAY | JSON | Remove outer [ ] brackets; each element = one row |
| FIELD_OPTIONALLY_ENCLOSED_BY | CSV | Character wrapping field values (e.g., double quotes) |
| STRIP_NULL_VALUE | JSON | Convert JSON "null" to SQL NULL |

### Stages
| Type | Reference | Scope |
|------|-----------|-------|
| User stage | @~ | Per-user, auto-created |
| Table stage | @%table_name | Per-table, auto-created |
| Named internal | @my_stage | User-created, standalone |
| Named external | @my_ext_stage | Points to S3/Azure/GCS |

### PUT / GET
- PUT: uploads to INTERNAL stages only; auto-compresses with gzip; no warehouse needed
- PUT supports subfolder paths: @my_stage/2026/april/
- PUT does NOT work from Snowsight worksheets (requires local filesystem)
- GET: downloads from internal stages to local filesystem

### Snowpipe
- Serverless compute (no user warehouse)
- AUTO_INGEST = TRUE: triggered by cloud event notifications (S3 -> SQS -> Snowflake)
- SQS queue retention pitfall: if messages expire (default 4 days), files are never loaded

### Post-Load Error Review
- VALIDATE(table_name, job_id => 'query_id'): returns row-level errors from a specific load
- INFER_SCHEMA(): detect file schema before loading

### External Tables
- Read-only (SELECT only; no INSERT/UPDATE/DELETE/MERGE)
- Cannot be cloned
- Can have materialized views on them (still read-only, improves read performance)


## 5. DATA TRANSFORMATIONS

### VARIANT / Semi-Structured
| Syntax | Works? |
|--------|--------|
| data:LEVEL1.LEVEL2 | Yes (colon first, then dots) |
| data:LEVEL1:LEVEL2 | Yes (all colons) |
| data['L1']['L2'] | Yes (bracket notation) |
| data.LEVEL1.LEVEL2 | NO (all-dots fails) |

- Arrays are 0-indexed: third element = [2]
- Colon extraction returns VARIANT (with quotes for strings)
- Cast to native type: data:name::VARCHAR strips quotes

### Key Semi-Structured Functions
| Function | Purpose |
|----------|---------|
| PARSE_JSON() | String -> VARIANT |
| TO_JSON() | VARIANT -> String (inverse of PARSE_JSON) |
| OBJECT_KEYS() | Returns array of top-level keys |
| OBJECT_CONSTRUCT() | Build JSON from key-value pairs (single row) |
| OBJECT_CONSTRUCT(*) | Build JSON from entire row (column names = keys) |
| OBJECT_AGG() | Aggregate multiple rows into JSON object |
| ARRAYS_TO_OBJECT() | Two arrays (keys, values) -> JSON object |
| ARRAY_AGG() | Aggregate values from rows into array |
| ARRAY_CONSTRUCT() | Build array from explicit arguments |
| STRIP_NULL_VALUE() | Convert JSON null to SQL NULL |
| FLATTEN / LATERAL FLATTEN | Explode arrays/objects into rows |

### FLATTEN Behavior
- Default: NULL/empty arrays are EXCLUDED (rows dropped)
- OUTER => TRUE: NULL rows preserved with NULL in flattened columns (like LEFT JOIN)

### Other Transformations
| Feature | Purpose |
|---------|---------|
| PIVOT | Rows -> Columns (wide format) |
| UNPIVOT | Columns -> Rows (long format) |
| SPLIT_TO_TABLE() | Split string by delimiter into rows |
| GENERATOR(ROWCOUNT => n) | Produce n synthetic rows |
| TABLE(my_udtf(args)) | Call table function in FROM clause |

### Stored Procedures vs UDFs
| Capability | Stored Procedures | UDFs/UDTFs |
|------------|-------------------|------------|
| Execute DDL/DML | Yes | No |
| EXECUTE AS OWNER | Default (owner's privileges) | N/A |
| EXECUTE AS CALLER | Optional (caller's privileges) | N/A |
| Return type | Single value | Scalar or tabular |

### External Functions
- Computation happens on external service (AWS Lambda, Azure Functions)
- Requires API integration
- Snowflake sends data out, receives results back

### MERGE Gotcha
- Multiple source rows matching one target row: "Duplicate row detected" error
- Source must be deduplicated before MERGE

### UDF Volatility
- IMMUTABLE: same inputs always produce same outputs (enables caching)
- VOLATILE (default): results may vary


## 6. DATA PROTECTION, GOVERNANCE & SHARING

### Time Travel
- Works for DML (INSERT, UPDATE, DELETE, MERGE) and DROP
- Syntax: AT(OFFSET => -n) or BEFORE(STATEMENT => 'query_id')
- Retention inherited from nearest parent with explicit setting
- Standard Edition: 0-1 day; Enterprise+: up to 90 days

### Data Sharing
- Direct Shares: same region only, zero-copy (no extra storage), read-only for consumer
- Listings: cross-region (via Auto-Fulfillment), support monetization
- Only SECURE views and SECURE UDFs can be added to shares
- Revoking a share removes all access (consumer DB becomes empty)
- Reader Accounts: CAN create warehouses, tables, databases (provider pays compute)

### Data Classification
- SYSTEM$CLASSIFY(): analyzes column content, assigns semantic/privacy tags
- Supports primitive types (NUMBER, STRING, DATE, TIMESTAMP)
- Does not support VARIANT, BINARY, GEOGRAPHY

### Sharing vs Replication
| Feature | Direct Share | Database Replication |
|---------|-------------|---------------------|
| Scope | Same region | Cross-region/cross-cloud |
| Storage cost | Zero (shared) | Yes (physical copy) |
| Consumer access | Read-only | Read-only (default) |
| Failover | No | Yes (failover groups) |

### Secure Views
- Hide view definition from non-owners
- Query profile hides internal filter logic from consumers
- Required for sharing

### Resource Monitors
- Only ACCOUNTADMIN can CREATE
- Only track user-managed warehouse credits (NOT serverless)
- Serverless (Snowpipe, auto-clustering, MVs) requires budgets
- TRIGGERS clause in ALTER fully REPLACES existing triggers (not additive)
- MONITOR privilege: view usage; MODIFY privilege: change properties


---

## PRACTICE QUIZ: SELF-TEST (80 Questions with Answer Key)

### Instructions
Cover the answers below each question. Try to answer from memory.
Rate yourself: Confident / Guessed / Missed -- then review the section.

---

### SECTION A: ARCHITECTURE & FEATURES (20 Questions)

**A1.** What are the three layers of Snowflake's architecture?
> Cloud Services, Compute (Warehouses), Storage

**A2.** How many credits per hour does a Medium warehouse consume?
> 4 credits/hour

**A3.** What is the billing model for warehouse compute?
> Per-second billing with a 60-second minimum each time the warehouse resumes

**A4.** What does AUTO_SUSPEND = 0 mean?
> The warehouse NEVER auto-suspends (runs indefinitely until manually suspended)

**A5.** Which edition is the minimum for multi-cluster warehouses?
> Enterprise

**A6.** STANDARD scaling adds a cluster when ______. ECONOMY adds when ______.
> STANDARD: immediately when any query is queued. ECONOMY: when estimated busy for 6+ minutes.

**A7.** What is the Fail-safe period for a transient table?
> 0 days (no Fail-safe on any edition)

**A8.** A permanent table has 10-day Time Travel. What is its total data protection window?
> 17 days (10 TT + 7 Fail-safe)

**A9.** Which objects CAN be cloned? (Name 4)
> Databases, schemas, tables, external stages

**A10.** Which objects CANNOT be cloned? (Name 4)
> Internal stages, external tables, pipes, shares

**A11.** A 2 TB table is cloned. How much additional storage is consumed immediately?
> 0 bytes (zero-copy until data diverges)

**A12.** What happens to the clone if the source table receives an INSERT during the clone operation?
> Clone captures a snapshot at statement start; the concurrent INSERT is NOT included

**A13.** What does UNDROP work for?
> Tables, schemas, databases (within Time Travel retention)

**A14.** A stream is not consumed for longer than the table's retention period. What happens?
> The stream becomes stale and must be dropped and recreated

**A15.** What does SYSTEM$STREAM_HAS_DATA() return?
> TRUE if unconsumed change data exists, FALSE otherwise

**A16.** In a task DAG, can child tasks have their own SCHEDULE?
> No. Only the root task has a SCHEDULE. Child tasks are triggered by predecessors.

**A17.** A task's WHEN clause evaluates to FALSE. What happens?
> The task run is skipped entirely. No compute is consumed.

**A18.** Do sequences guarantee gap-free, ordered values across concurrent sessions?
> No. They guarantee uniqueness only.

**A19.** What distinguishes a failover group from a replication group?
> A failover group adds read-write failover capability to a secondary account

**A20.** Where does Snowpark DataFrame computation execute?
> On the virtual warehouse assigned to the session

---

### SECTION B: ACCOUNT ACCESS & SECURITY (20 Questions)

**B1.** Which system role creates and manages users AND roles?
> USERADMIN

**B2.** Which system role creates databases and warehouses?
> SYSADMIN

**B3.** Which role is the ONLY role that can create resource monitors?
> ACCOUNTADMIN

**B4.** SECURITYADMIN inherits which role?
> USERADMIN

**B5.** Why should custom roles be granted to SYSADMIN?
> So ACCOUNTADMIN (via SYSADMIN) can see and manage all objects. Orphan roles make objects invisible.

**B6.** CURRENT_ROLE() returns what?
> The active primary role ONLY

**B7.** IS_ROLE_IN_SESSION('FINANCE') returns TRUE when?
> When FINANCE is the primary role, any active secondary role, or inherited via the role hierarchy

**B8.** A masking policy checks CURRENT_ROLE() = 'FINANCE'. User's primary is ANALYST, secondary is FINANCE. What do they see?
> Masked data (CURRENT_ROLE returns ANALYST, not FINANCE)

**B9.** Does ACCOUNTADMIN bypass row access policies?
> No. No role bypasses row access or masking policies.

**B10.** A row access policy CASE has no ELSE clause. What happens for unmatched roles?
> CASE returns NULL, treated as FALSE. The role sees zero rows.

**B11.** A network policy is set at account level AND user level. Which takes precedence?
> User-level overrides (replaces) account-level entirely

**B12.** An IP is in both ALLOWED_IP_LIST and BLOCKED_IP_LIST. What happens?
> BLOCKED takes precedence. The IP is blocked.

**B13.** What is tag-based masking?
> Attach a masking policy to a tag. Any column with that tag automatically inherits the policy.

**B14.** Do tags alone enforce any access control?
> No. Tags are metadata labels only. Policies must be attached separately.

**B15.** What protocol does Snowflake SSO use?
> SAML 2.0

**B16.** What authentication does the Kafka connector use?
> Key-pair (RSA) authentication

**B17.** In key-pair auth, which key is registered with Snowflake?
> The PUBLIC key (ALTER USER SET RSA_PUBLIC_KEY). Private key stays local.

**B18.** What does SCIM automate?
> User and group (role) provisioning/deprovisioning from an identity provider

**B19.** What encryption does Snowflake apply by default on ALL editions?
> AES-256 at rest, TLS 1.2 in transit

**B20.** Which edition is required for Tri-Secret Secure (customer-managed keys)?
> Business Critical

---

### SECTION C: PERFORMANCE CONCEPTS (15 Questions)

**C1.** Name the three caching layers in Snowflake.
> Result cache (Cloud Services), local SSD cache (warehouse nodes), metadata cache (Cloud Services)

**C2.** Which cache survives a warehouse suspend?
> Result cache and metadata cache (both in Cloud Services). SSD cache is wiped.

**C3.** How long does the result cache persist?
> 24 hours (each reuse resets the timer)

**C4.** SELECT COUNT(*) on a huge table returns in <1 second without the warehouse running. Why?
> Snowflake answers from metadata cache (Cloud Services stores row counts)

**C5.** Two users run the same query. User A gets a cache hit, User B does not. Table has a masking policy. Why?
> Result cache is role-specific when policies exist. Different roles = different cached results.

**C6.** Which columns make the BEST clustering keys?
> DATE, TIMESTAMP, or low-to-medium cardinality columns frequently used in WHERE/JOIN

**C7.** In a multi-column clustering key, which column should come first?
> The lower-cardinality column

**C8.** SYSTEM$CLUSTERING_INFORMATION shows average_depth = 1.2, overlap = 0.3. Good or bad?
> Good. Low depth (near 1) and low overlap indicate well-clustered data.

**C9.** What is the Search Optimization Service best for?
> Selective equality and IN predicate lookups on high-cardinality columns

**C10.** Query profile shows "Spilling to Remote Storage". What should you do?
> Increase the warehouse size (more memory to reduce spilling)

**C11.** Query profile shows "Exploding Joins". What does this mean?
> Missing or non-selective join condition causing a Cartesian product

**C12.** 200 BI users run short concurrent queries and experience queuing. Scale up or scale out?
> Scale OUT (multi-cluster warehouse with more clusters)

**C13.** A single complex query is slow. Scale up or scale out?
> Scale UP (increase warehouse size for more compute power)

**C14.** What is a Snowpark-optimized warehouse designed for?
> Memory-intensive workloads (ML training, large Python UDFs)

**C15.** Are resource monitors able to track Automatic Clustering credits?
> No. Resource monitors only track user-managed warehouse credits. Serverless requires budgets.

---

### SECTION D: DATA LOADING & UNLOADING (15 Questions)

**D1.** What is the default ON_ERROR for bulk COPY INTO?
> ABORT_STATEMENT

**D2.** What is the default ON_ERROR for Snowpipe?
> SKIP_FILE

**D3.** How long is bulk COPY INTO load metadata retained?
> 64 days

**D4.** How long is Snowpipe load metadata retained?
> 14 days

**D5.** What does VALIDATION_MODE = 'RETURN_ALL_ERRORS' do?
> Dry-run only. No data is loaded. Validates and returns all errors found.

**D6.** What does FORCE = TRUE do in COPY INTO?
> Bypasses deduplication. Previously loaded files are loaded again, risking duplicates.

**D7.** Which file format option loads each JSON array element as a separate row?
> STRIP_OUTER_ARRAY = TRUE

**D8.** Which file format option specifies a character that wraps CSV field values?
> FIELD_OPTIONALLY_ENCLOSED_BY (e.g., '"')

**D9.** PUT uploads files to which type of stage?
> Internal stages ONLY (not external)

**D10.** Can PUT be executed from a Snowsight worksheet?
> No. PUT requires a local filesystem (SnowSQL, JDBC, ODBC, Python connector)

**D11.** What triggers AUTO_INGEST Snowpipe on S3?
> S3 event notifications -> SQS -> Snowflake

**D12.** What pseudo-column captures the source filename in a COPY INTO SELECT?
> METADATA$FILENAME

**D13.** Which table function returns row-level errors from a previous COPY INTO?
> VALIDATE(table_name, job_id => 'query_id')

**D14.** What does MATCH_BY_COLUMN_NAME do?
> Matches file columns to table columns by name instead of ordinal position

**D15.** What operations are supported on external tables?
> SELECT only (read-only). No INSERT, UPDATE, DELETE, or MERGE.

---

### SECTION E: DATA TRANSFORMATIONS (10 Questions)

**E1.** PARSE_JSON() converts ______ to ______. TO_JSON() does the reverse.
> String to VARIANT. TO_JSON converts VARIANT to string.

**E2.** data:name returns "Alice" with quotes. How do you remove them?
> Cast: data:name::VARCHAR

**E3.** VARIANT arrays are ___-indexed. Third element is at index ___.
> 0-indexed. Third element = [2]

**E4.** Which syntax does NOT work for VARIANT traversal: data:L1.L2, data:L1:L2, data.L1.L2?
> data.L1.L2 (all-dots fails with syntax error)

**E5.** OBJECT_CONSTRUCT() vs OBJECT_AGG(): which one aggregates across rows?
> OBJECT_AGG() aggregates across rows. OBJECT_CONSTRUCT() builds from a single row.

**E6.** LATERAL FLATTEN with OUTER => TRUE on a NULL array: row included or excluded?
> INCLUDED with NULL values in flattened columns (like a LEFT JOIN)

**E7.** Can UDFs execute DDL or DML statements?
> No. Only stored procedures can execute DDL/DML.

**E8.** EXECUTE AS OWNER (default for stored procedures) means the procedure runs with whose privileges?
> The owner role's privileges (not the caller's)

**E9.** A MERGE has multiple source rows matching one target row. What happens?
> "Duplicate row detected" error. Source must be deduplicated.

**E10.** PIVOT converts ______ to ______. UNPIVOT does the reverse.
> Rows to columns. UNPIVOT converts columns to rows.

---

### SECTION F: DATA PROTECTION, GOVERNANCE & SHARING (10 Questions -- Rapid Fire)

**F1.** Direct Shares work within what scope?
> Same region only

**F2.** Can a standard (non-secure) view be added to a share?
> No. Only secure views and secure UDFs.

**F3.** A provider revokes a share. What happens to the consumer's database?
> It becomes empty (all objects inaccessible, no local copy retained)

**F4.** Can Reader Accounts create warehouses?
> Yes (provider pays for the compute)

**F5.** Who can access data during the Fail-safe period?
> Only Snowflake Support (best-effort, not user-accessible)

**F6.** Time Travel retention is set at database (14 days) and schema (1 day). Table has no explicit setting. What retention does the table get?
> 1 day (inherits from nearest parent with explicit setting = schema)

**F7.** Which ACCOUNT_USAGE view tracks column-level data access?
> ACCESS_HISTORY

**F8.** ACCOUNT_USAGE has _____ latency and up to _____ retention.
> 45min-3hr latency, up to 365 days retention

**F9.** What does SYSTEM$CLASSIFY() do?
> Analyzes column data and assigns semantic (NAME, EMAIL) and privacy (IDENTIFIER, SENSITIVE) tags

**F10.** How do you minimize CDP storage for a high-churn dimension table?
> Use transient table (0-day Fail-safe) + reduce DATA_RETENTION_TIME_IN_DAYS to minimum needed

---

### SCORING GUIDE

| Score | Level | Action |
|-------|-------|--------|
| 72-80 (90%+) | Exam Ready | Focus on speed and edge cases |
| 60-71 (75-89%) | Almost There | Review missed sections, retake in 2 days |
| 48-59 (60-74%) | Needs Work | Study the reference sections above, retake daily |
| Below 48 (<60%) | Foundation Gaps | Re-read each section carefully before retaking |
