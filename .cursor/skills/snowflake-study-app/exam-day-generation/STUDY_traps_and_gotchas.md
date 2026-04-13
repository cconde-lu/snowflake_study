# COF-C03 Study Guide: Traps, Gotchas & Commonly Confused Concepts

## HOW TO USE THIS FILE
Every item below is a concept that catches prepared students on the exam.
Each entry has: the TRAP (what you might think), the TRUTH (what is actually correct),
and WHY it matters (the exam angle).

---

## TRAP 1: Misleading Names

### Reader Account = "Read-Only"
- TRAP: Reader Accounts can only read shared data, no compute or objects.
- TRUTH: Reader Accounts CAN create warehouses, databases, tables, and views. The provider pays for all compute.
- EXAM ANGLE: "Can a Reader Account consumer create staging tables to join with shared data?" YES.

### ECONOMY Scaling = "Saves Money by Reducing Queuing"
- TRAP: Economy mode is always cheaper and better.
- TRUTH: Economy INCREASES queuing. It waits 6 minutes before adding a cluster. STANDARD adds immediately.
- EXAM ANGLE: "What can reduce queuing?" Increase MAX_CLUSTER_COUNT, NOT switch to ECONOMY.

### AUTO_SUSPEND = 0 = "Suspend Immediately"
- TRAP: Setting to 0 means instant suspend.
- TRUTH: AUTO_SUSPEND = 0 means NEVER auto-suspend. The warehouse runs indefinitely.
- EXAM ANGLE: "A warehouse has AUTO_SUSPEND = 0. What does this mean?" It never suspends on its own.

### USERADMIN = "Only Users"
- TRAP: USERADMIN only creates users.
- TRUTH: USERADMIN creates AND manages BOTH users AND roles, and grants roles to users.
- EXAM ANGLE: "Which role creates roles?" USERADMIN (not just SECURITYADMIN).

### Fail-safe = "User-Accessible Backup"
- TRAP: Fail-safe is like extended Time Travel that you can query.
- TRUTH: Fail-safe is ONLY accessible by Snowflake Support, best-effort recovery. Users cannot query it.
- EXAM ANGLE: "During Fail-safe, who can recover data?" Only Snowflake Support.

---

## TRAP 2: Things That Look the Same but Differ

### Snowpipe ON_ERROR vs Bulk COPY ON_ERROR
| Context | Default |
|---------|---------|
| Bulk COPY INTO | ABORT_STATEMENT |
| Snowpipe | SKIP_FILE |
- EXAM ANGLE: They will NOT tell you which context. Read carefully.

### Snowpipe Metadata Retention vs COPY Metadata Retention
| Method | Days |
|--------|------|
| Bulk COPY INTO | 64 days |
| Snowpipe | 14 days |
- EXAM ANGLE: "File loaded 30 days ago, re-PUT, COPY without FORCE. Skipped?" YES (30 < 64).

### Standard Edition Time Travel vs Enterprise Time Travel
| Edition | Permanent Table Max | Transient Table Max |
|---------|--------------------|--------------------|
| Standard | 1 day | 1 day |
| Enterprise+ | 90 days | 1 day |
- EXAM ANGLE: Transient tables ALWAYS max at 1 day, regardless of edition.

### CURRENT_ROLE() vs IS_ROLE_IN_SESSION()
| Function | What it checks |
|----------|---------------|
| CURRENT_ROLE() | Primary role ONLY |
| IS_ROLE_IN_SESSION() | Primary + secondary + inherited roles |
- EXAM ANGLE: Masking policy uses CURRENT_ROLE(). User has primary=ANALYST, secondary=FINANCE. Policy allows FINANCE. User sees MASKED data (CURRENT_ROLE returns ANALYST).

### ACCOUNT_USAGE vs INFORMATION_SCHEMA
| Property | ACCOUNT_USAGE | INFORMATION_SCHEMA |
|----------|--------------|-------------------|
| Latency | 45 min - 3 hours | Near real-time |
| Retention | Up to 365 days | 7-14 days |
| Scope | Entire account | Current database only |
| Location | SNOWFLAKE database | Each database |

### SYSTEM$ALLOWLIST() vs SYSTEM$GET_PRIVATELINK_CONFIG()
| Function | Returns |
|----------|---------|
| SYSTEM$ALLOWLIST() | Public hostnames/ports for firewall rules |
| SYSTEM$GET_PRIVATELINK_CONFIG() | Private endpoint URLs for PrivateLink |
- EXAM ANGLE: "Display endpoints for PrivateLink?" = GET_PRIVATELINK_CONFIG. "Firewall rules?" = ALLOWLIST.

### PARSE_JSON() vs TO_JSON()
| Function | Direction |
|----------|-----------|
| PARSE_JSON() | String -> VARIANT |
| TO_JSON() | VARIANT -> String |
- They are inverses. TO_JSON(PARSE_JSON('{"a":1}')) = '{"a":1}'.

### OBJECT_CONSTRUCT() vs OBJECT_AGG() vs ARRAYS_TO_OBJECT()
| Function | Input | Scope |
|----------|-------|-------|
| OBJECT_CONSTRUCT('k1',v1,'k2',v2) | Explicit key-value pairs | Single row |
| OBJECT_CONSTRUCT(*) | All columns in current row | Single row |
| OBJECT_AGG(key_col, val_col) | Column values | Across rows (aggregate) |
| ARRAYS_TO_OBJECT(keys_arr, vals_arr) | Two parallel arrays | Single expression |

### ARRAY_AGG() vs ARRAY_CONSTRUCT()
| Function | Scope |
|----------|-------|
| ARRAY_AGG() | Collects values from MULTIPLE ROWS into array |
| ARRAY_CONSTRUCT(1,2,3) | Builds array from EXPLICIT ARGUMENTS |

### STRIP_OUTER_ARRAY vs FIELD_OPTIONALLY_ENCLOSED_BY
| Option | Format | Purpose |
|--------|--------|---------|
| STRIP_OUTER_ARRAY | JSON | Remove outer [ ] so each element = row |
| FIELD_OPTIONALLY_ENCLOSED_BY | CSV | Character wrapping field values (quotes) |
- EXAM ANGLE: "Load JSON array elements as separate rows?" = STRIP_OUTER_ARRAY.

### Scale UP vs Scale OUT
| Strategy | When to use |
|----------|-------------|
| Scale UP (bigger warehouse) | Single complex query is slow |
| Scale OUT (multi-cluster) | Many concurrent users are queuing |
- EXAM ANGLE: "200 BI users, short queries, queuing" = scale OUT.

---

## TRAP 3: Policies That No One Bypasses

### Row Access Policies
- NO role bypasses them, including ACCOUNTADMIN
- A CASE with no ELSE returns NULL = treated as FALSE = zero rows
- If policy does not mention ADMIN, ADMIN sees zero rows

### Masking Policies
- NO role bypasses them, including ACCOUNTADMIN
- CURRENT_ROLE() only checks primary role (trap with secondary roles)
- Tags alone are metadata labels. Must attach policy to tag for enforcement.

### Network Policies
- User-level OVERRIDES account-level (does not merge)
- BLOCKED_IP_LIST takes precedence over ALLOWED_IP_LIST
- Same IP in both = BLOCKED

---

## TRAP 4: Cloning Gotchas

### What CAN be cloned
- Databases (full hierarchy), schemas, tables, external stages

### What CANNOT be cloned
- Internal stages: "Unsupported feature: Cloning internal and temporary stages"
- External tables: "Cannot clone from an external table" (also excluded from DB clones)
- Dynamic tables, pipes, shares, warehouses

### Transient Clone Trap
- Cloning a transient table with CREATE TABLE ... CLONE FAILS
- Must use CREATE TRANSIENT TABLE ... CLONE (explicit keyword required)

### Concurrent DML During Clone
- Clone captures snapshot at statement start. Concurrent INSERT does NOT affect clone.

---

## TRAP 5: Stream & Task Edge Cases

### Stale Streams
- If stream is not consumed within table's DATA_RETENTION_TIME_IN_DAYS, it becomes STALE
- Stale streams CANNOT be refreshed or reset. Must DROP and RECREATE.
- Prevention: consume stream regularly or increase table retention

### Task WHEN Clause
- WHEN SYSTEM$STREAM_HAS_DATA() = FALSE: task is SKIPPED entirely, zero compute consumed
- Common pattern: stream + task + WHEN clause for event-driven processing

### Task DAG Rules
- Only root task has SCHEDULE
- Child tasks have NO schedule (triggered by predecessor)
- ALLOW_OVERLAPPING_EXECUTION = FALSE (default): skips next run if current is still executing

---

## TRAP 6: Data Loading Fine Print

### VALIDATION_MODE = Dry Run
- NO data is loaded. Only validates and returns errors.
- Common trap: "Data is loaded and errors are logged" = WRONG.

### FORCE = TRUE = Duplicates
- Bypasses 64-day deduplication. Same file loaded again = duplicate rows.

### PUT Limitations
- Internal stages ONLY (not external)
- Requires local filesystem (SnowSQL, JDBC, ODBC, Python connector)
- Does NOT work from Snowsight worksheets
- Auto-compresses with gzip by default

### External Tables
- Read-only: SELECT only. No INSERT, UPDATE, DELETE, MERGE.
- Cannot be cloned (not directly, not via DB clone)
- Can have materialized views (still read-only, improves performance)

### MATCH_BY_COLUMN_NAME
- Matches file columns to table columns by NAME (not position)
- PARSE_HEADER = TRUE: reads first CSV row as column headers

### METADATA$ Pseudo-Columns
- METADATA$FILENAME: source filename per row
- METADATA$FILE_ROW_NUMBER: row number within source file
- Available in COPY INTO SELECT subquery only

### COPY INTO SELECT Transformations
- Can apply functions: UPPER($1), CAST, CONCAT, etc.
- Can reorder columns: (SELECT $3, $1, $2 FROM @stage)
- Powerful but easy to forget it exists

---

## TRAP 7: Sharing & Replication

### Direct Shares = Same Region Only
- Cross-region requires Listings or Database Replication
- Listings support monetization; Direct Shares do not

### Secure Views Required for Sharing
- Standard views CANNOT be added to shares (error: "Non-secure object")
- Secure views hide definition + filter logic from consumers

### Revoking a Share
- Consumer database becomes EMPTY (not dropped, just inaccessible)
- No "grace period" or local copy retained

### Reader Account Capabilities
- CAN: create warehouses, databases, tables, run queries
- CANNOT: CREATE SHARE, CREATE PIPE, CREATE STAGE, SHOW PROCEDURES
- Provider pays for all Reader Account compute

---

## TRAP 8: Resource Monitor Gotchas

### Creation
- ONLY ACCOUNTADMIN can create resource monitors (cannot delegate)

### Scope
- Only track USER-MANAGED warehouse credits
- Do NOT track serverless (Snowpipe, auto-clustering, MVs, search optimization)
- Serverless cost tracking requires BUDGETS

### Triggers
- ALTER RESOURCE MONITOR with TRIGGERS clause REPLACES all existing triggers (not additive)
- Omitting TRIGGERS in ALTER preserves existing triggers
- Account-level and warehouse-level monitors are independent (either can trigger)

### Privileges
- MONITOR: view usage
- MODIFY: change properties

---

## TRAP 9: Performance Misconceptions

### Result Cache
- Lives in Cloud Services layer (no warehouse needed)
- Persists 24 hours; each reuse resets the 24-hour timer
- Invalidated when underlying data changes (any DML)
- Role-specific when row access or masking policies exist

### SSD Cache
- Lives on warehouse nodes
- WIPED on warehouse suspend (cold start on resume)

### Metadata Cache
- Lives in Cloud Services
- Answers COUNT(*), MIN/MAX without warehouse
- Always available

### Clustering Key Best Practices
- Best: DATE, TIMESTAMP, low-to-medium cardinality columns in WHERE/JOIN
- Order: lower cardinality column FIRST
- Avoid: very high cardinality (unique per row) or VARIANT columns
- Search Optimization: better for high-cardinality equality lookups

### Spilling
- To local storage: moderate impact (consider upsizing)
- To remote storage: severe impact (definitely upsize)
- More memory = less spilling = bigger warehouse helps

### Exploding Joins
- Missing or non-selective join condition = Cartesian product
- Output rows >> input rows = warning in query profile

---

## TRAP 10: Security & Encryption

### All Editions
- AES-256 at rest + TLS 1.2 in transit (always, by default)

### Business Critical+
- Tri-Secret Secure (customer-managed keys via cloud KMS)
- PrivateLink (private connectivity, no public internet)
- HIPAA/PHI compliance

### Authentication Methods
| Method | Use Case |
|--------|----------|
| Username/password | Interactive login |
| MFA (Duo) | Interactive login with extra security |
| SAML 2.0 SSO | Browser-based federated login |
| Key-pair (RSA) | Programmatic: connectors, Kafka, SnowSQL |
| OAuth | Programmatic: custom apps, SQL API |
| SCIM | Automated user/group provisioning from IdP |

### Key-Pair Setup
- Only PUBLIC key is registered with Snowflake (ALTER USER SET RSA_PUBLIC_KEY)
- Private key NEVER leaves the client machine
