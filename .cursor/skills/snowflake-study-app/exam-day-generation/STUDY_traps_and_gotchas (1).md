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


---
---

# TOP 5 MOST-MISSED QUESTION PATTERNS

Analysis of 160 questions across 4 daily exams (Apr 8, 10, 13, 15).
These 5 patterns account for the majority of incorrect answers because
they exploit assumptions that even well-prepared students carry into the exam.

---

## PATTERN 1: "Which Privilege Does What?" Confusion
**Frequency: 18 questions across exams | Estimated miss rate: 55-65%**

Students consistently confuse privileges that sound similar but grant very different access.

### The Privilege Matrix You Must Memorize

**On Warehouses:**
| Privilege | What it grants |
|-----------|---------------|
| USAGE | Run queries using the warehouse |
| OPERATE | Resume, suspend, abort all queries |
| MODIFY | Resize, change properties (auto-suspend, etc.) |
| MONITOR | View warehouse load and query stats |
| OWNERSHIP | All of the above + DROP |

**On Databases:**
| Privilege | What it grants |
|-----------|---------------|
| USAGE | See the database and browse schemas (NOT query tables) |
| CREATE SCHEMA | Create new schemas within the database |
| OWNERSHIP | All privileges + DROP |

**On Schemas:**
| Privilege | What it grants |
|-----------|---------------|
| USAGE | See the schema and browse objects (NOT query them) |
| CREATE TABLE/VIEW/etc. | Create specific object types |
| OWNERSHIP | All privileges + DROP |

**On Resource Monitors:**
| Privilege | What it grants |
|-----------|---------------|
| MONITOR | View credit usage |
| MODIFY | Change quota, triggers, properties |
| (CREATE) | ACCOUNTADMIN only, cannot be delegated |

**On Tasks:**
| Privilege | What it grants |
|-----------|---------------|
| OPERATE | Resume, suspend, EXECUTE TASK |
| OWNERSHIP | All + DROP |

### Why Students Miss This
The exam gives scenarios like: "A role needs to suspend a warehouse but not run queries on it."
Answer: OPERATE (not USAGE). Students pick USAGE because "using" sounds like it covers everything.

### The Full Access Chain for SELECT
To query `DB.SCHEMA.TABLE`, a role needs ALL THREE:
1. USAGE on the database
2. USAGE on the schema
3. SELECT on the table

Missing ANY one = access denied. The exam tests this by asking "which TWO are needed"
and making you forget about the database-level USAGE.

---

## PATTERN 2: "When Does Snowflake Use Owner vs Caller Privileges?"
**Frequency: 12 questions across exams | Estimated miss rate: 50-60%**

Students know views use owner privileges and stored procedures default to owner.
But they get confused about the interactions between:
- Views (always owner)
- Stored procedures (OWNER or CALLER)
- UDFs (neither -- they just compute, no SQL execution)
- Masking policies (evaluated at query time against the CALLING role)

### The Complete Privilege Resolution Map

```
Query: SELECT * FROM my_table
  |
  +-- Row Access Policy? --> Evaluated with QUERYING ROLE's context
  |                          (CURRENT_ROLE() or IS_ROLE_IN_SESSION())
  |
  +-- Masking Policy? -----> Evaluated with QUERYING ROLE's context
  |                          NOT the view owner or procedure owner
  |
  +-- Through a View? -----> View body runs with VIEW OWNER's privileges
  |                          (so the caller doesn't need SELECT on base table)
  |
  +-- Through a Stored Procedure?
       |
       +-- EXECUTE AS OWNER (default): procedure SQL runs with OWNER's privileges
       |   Caller doesn't need privileges on objects the procedure touches.
       |   BUT: masking/row access policies still evaluate against the OWNER role.
       |
       +-- EXECUTE AS CALLER: procedure SQL runs with CALLER's privileges.
           Caller MUST have all necessary privileges on objects.
           Masking/row access policies evaluate against the CALLER role.
```

### The Killer Exam Scenario
"A stored procedure (EXECUTE AS OWNER) queries a table with a masking policy.
The masking policy allows role ANALYST. The procedure owner is DATA_ENG.
The caller is ANALYST. What does the caller see?"

Answer: MASKED data. Why? The procedure runs as DATA_ENG (owner). The masking
policy sees CURRENT_ROLE() = DATA_ENG, not ANALYST. DATA_ENG is not in the
masking policy's allow list.

This trips up even strong students because they think "the caller is ANALYST,
and the policy allows ANALYST, so it should work." But the EXECUTE AS OWNER
means the masking policy evaluates against the OWNER's role.

---

## PATTERN 3: "What's the Exact Number?" Retention & Billing Values
**Frequency: 15 questions across exams | Estimated miss rate: 45-55%**

The exam loves testing exact numeric values. One number off = wrong answer.

### The Numbers You MUST Know Cold

**Billing:**
| Size | Credits/Hour |
|------|-------------|
| X-Small | 1 |
| Small | 2 |
| Medium | 4 |
| Large | 8 |
| X-Large | 16 |
| 2XL-6XL | 32, 64, 128, 256, 512 |
| Minimum billing | 60 seconds per resume |

**Retention:**
| What | Duration |
|------|----------|
| Bulk COPY metadata | 64 days |
| Snowpipe metadata | 14 days |
| Result cache | 24 hours |
| Standard TT (permanent) | 0-1 day |
| Enterprise TT (permanent) | 0-90 days |
| Transient TT (all editions) | 0-1 day |
| Temporary TT (all editions) | 0-1 day |
| Fail-safe (permanent) | 7 days |
| Fail-safe (transient) | 0 days |
| Fail-safe (temporary) | 0 days |
| ACCOUNT_USAGE latency | 45 min - 3 hours |
| ACCOUNT_USAGE retention | 365 days |
| INFORMATION_SCHEMA retention | 7-14 days |

**MAX_DATA_EXTENSION_TIME_IN_DAYS:**
| Default | 14 days |
|---------|---------|
| Purpose | Extends retention to keep streams from going stale |

### How the Exam Tricks You
- "A file was loaded 50 days ago. COPY INTO without FORCE. Loaded or skipped?"
  Answer: Skipped (50 < 64 days).
- "A file was loaded via Snowpipe 10 days ago. Same file re-arrives. Loaded or skipped?"
  Answer: Skipped (10 < 14 days).
- "A file was loaded 70 days ago via bulk COPY. COPY INTO without FORCE."
  Answer: LOADED (70 > 64 days, metadata expired).

The exam NEVER tells you the retention period. You must know 64 vs 14.

---

## PATTERN 4: "What Can/Cannot Be Done with Shared Objects?"
**Frequency: 14 questions across exams | Estimated miss rate: 50-60%**

Students know sharing is "read-only" but get confused about edge cases.

### The Complete Sharing Rules

**What the PROVIDER must do:**
- Only SECURE views and SECURE UDFs can be added to shares
- GRANT USAGE on database + GRANT USAGE on schema to the share
- GRANT SELECT on specific tables/views to the share
- Standard (non-secure) views are REJECTED with an error

**What the CONSUMER can do:**
- CREATE DATABASE FROM SHARE (creates a read-only database)
- SELECT from shared objects
- See schema changes automatically (new columns, new tables added to share)
- Nothing else. No INSERT, UPDATE, DELETE, MERGE, CLONE.

**What happens when the share is revoked:**
- Consumer database becomes EMPTY (shell remains, all objects inaccessible)
- No grace period, no local copy retained
- NOT automatically dropped -- just empty

**Reader Account capabilities (the name is misleading):**
- CAN: create warehouses, databases, tables, views, run queries
- CANNOT: CREATE SHARE, CREATE PIPE, CREATE STAGE, SHOW PROCEDURES
- Provider pays for ALL compute

**Direct Share vs Listing vs Replication:**
| Feature | Direct Share | Listing | DB Replication |
|---------|-------------|---------|----------------|
| Cross-region | No | Yes | Yes |
| Monetization | No | Yes | No |
| Extra storage | No (zero-copy) | Depends | Yes (full copy) |
| Consumer access | Read-only | Read-only | Read-only (default) |
| Failover | No | No | Yes (failover groups) |

### The Killer Exam Scenarios
1. "Provider adds a new table to the share. Consumer must ___."
   Answer: Do nothing. Visible automatically.

2. "Provider adds a column to a shared table. Consumer must ___."
   Answer: Do nothing. Visible automatically.

3. "Can the consumer clone a shared table?"
   Answer: No. They don't have OWNERSHIP.

4. "Can a Reader Account create a warehouse?"
   Answer: YES. (Most students say no because "Reader" sounds read-only.)

---

## PATTERN 5: "Which Function Actually Exists?" Fake vs Real
**Frequency: 22 questions across exams | Estimated miss rate: 40-50%**

The exam includes plausible-sounding function names as distractors.
You must know which functions are REAL and which are FABRICATED.

### Functions That EXIST (validated via live SQL)

**System Functions:**
| Function | Purpose |
|----------|---------|
| SYSTEM$ALLOWLIST() | Firewall allowlist hostnames/ports |
| SYSTEM$GET_PRIVATELINK_CONFIG() | PrivateLink endpoints |
| SYSTEM$CANCEL_QUERY(id) | Cancel a running query |
| SYSTEM$STREAM_HAS_DATA(stream) | TRUE if stream has unconsumed data |
| SYSTEM$CLUSTERING_INFORMATION(tbl, key) | Clustering depth/overlap |
| SYSTEM$CLASSIFY(table, options) | Data classification |

**Scalar Functions:**
| Function | Purpose |
|----------|---------|
| UUID_STRING() | Generate random UUID v4 |
| PARSE_JSON(string) | String to VARIANT |
| TO_JSON(variant) | VARIANT to string |
| OBJECT_KEYS(variant) | Array of top-level keys |
| OBJECT_CONSTRUCT('k1',v1,...) | Build JSON object |
| OBJECT_CONSTRUCT(*) | Build JSON from entire row |
| ARRAYS_TO_OBJECT(keys, vals) | Two arrays to JSON object |
| STRIP_NULL_VALUE(variant) | JSON null to SQL NULL |
| IFF(cond, true, false) | Inline IF-THEN-ELSE |
| HASH_AGG(*) | Hash of entire result set |
| GET_DDL(type, name) | Returns CREATE DDL |
| LAST_QUERY_ID() | Query ID of last execution |

**Table Functions:**
| Function | Purpose |
|----------|---------|
| RESULT_SCAN(query_id) | Return previous result set |
| SPLIT_TO_TABLE(str, delim) | Split string into rows |
| VALIDATE(table, job_id) | Errors from previous COPY |
| INFER_SCHEMA(location, format) | Detect file schema |
| GENERATOR(ROWCOUNT => n) | Produce n synthetic rows |
| FLATTEN(input => variant) | Explode arrays/objects |

### Functions That DO NOT EXIST (common exam distractors)
| Fake Name | What exam uses it for | Real Alternative |
|-----------|----------------------|------------------|
| SYSTEM$ABORT_STATEMENT() | Cancel queries | SYSTEM$CANCEL_QUERY() |
| SYSTEM$WHITELIST() | Firewall rules | SYSTEM$ALLOWLIST() |
| SYSTEM$STREAM_RESET() | Reset stale stream | DROP + RECREATE |
| RANDOM_UUID() | Generate UUID | UUID_STRING() |
| GENERATE_UUID() | Generate UUID | UUID_STRING() |
| SYS_GUID() | Generate UUID | UUID_STRING() |
| GET_KEYS() | Object keys | OBJECT_KEYS() |
| VARIANT_KEYS() | Object keys | OBJECT_KEYS() |
| GROUP_CONCAT() | String aggregation | LISTAGG() |
| LOAD_ERRORS() | Load error review | VALIDATE() |
| MAP_COLUMNS_BY_NAME | Column matching | MATCH_BY_COLUMN_NAME |
| COLUMN_MAPPING | Column matching | MATCH_BY_COLUMN_NAME |
| STRIP_QUOTES() | Remove JSON quotes | ::VARCHAR cast |

### How the Exam Uses This
The four options will include:
- The correct function (real)
- A plausible fake that sounds almost identical
- A real function that does something different
- A completely unrelated function

Example: "Which function cancels a running query?"
A) CANCEL_QUERY() -- fake
B) SYSTEM$CANCEL_QUERY() -- REAL, correct
C) ABORT_QUERY() -- fake
D) SYSTEM$ABORT_STATEMENT() -- fake but sounds very real

The trick is that D sounds extremely plausible (SYSTEM$ prefix + ABORT + STATEMENT)
but it does not exist. Only SYSTEM$CANCEL_QUERY() is real.



---

# PRIVILEGE CONFUSION MATRIX: ALL 18 QUESTIONS DECODED

Each scenario shows the EXACT permission chain, what the role CAN and CANNOT do,
and the specific GRANT statements needed. Organized by object type.

---

## WAREHOUSE PRIVILEGES (4 questions: Apr8-Q17, Apr13-Q13 context, Apr15-Q16, Apr15-Q20)

### The 4 Warehouse Privileges
```
USAGE    --> Run queries using the warehouse
OPERATE  --> Resume, suspend, abort queries
MODIFY   --> Resize, change auto-suspend, properties
OWNERSHIP --> All of the above + DROP
```

### Scenario W1: "ops_team needs to suspend a warehouse but NOT run queries"
**BEFORE:**
```sql
-- ops_team has no grants on WH
SHOW GRANTS TO ROLE ops_team;
-- (empty)
```
Result: Cannot suspend. Cannot run queries.

**AFTER:**
```sql
GRANT OPERATE ON WAREHOUSE my_wh TO ROLE ops_team;
```
Result: CAN resume/suspend/abort. CANNOT run queries (needs USAGE for that).

### Scenario W2: "analyst needs to run queries but NOT control the warehouse"
**BEFORE:**
```sql
-- analyst has no grants on WH
```
Result: Cannot run queries. Cannot suspend/resume.

**AFTER:**
```sql
GRANT USAGE ON WAREHOUSE my_wh TO ROLE analyst;
```
Result: CAN run queries. CANNOT suspend/resume/abort (needs OPERATE).

### Scenario W3: "admin needs to resize a warehouse"
**BEFORE:**
```sql
GRANT USAGE ON WAREHOUSE my_wh TO ROLE admin;
GRANT OPERATE ON WAREHOUSE my_wh TO ROLE admin;
```
Result: CAN run queries. CAN suspend/resume. CANNOT resize.

**AFTER (add MODIFY):**
```sql
GRANT MODIFY ON WAREHOUSE my_wh TO ROLE admin;
```
Result: NOW CAN resize, change auto-suspend, change scaling policy.

### Scenario W4: STATEMENT_TIMEOUT interaction
```sql
ALTER SESSION SET STATEMENT_TIMEOUT_IN_SECONDS = 120;
-- Query running 150 seconds --> CANCELLED at 120s
-- This is a session parameter, not a privilege, but tests often
-- put it alongside warehouse questions to confuse.
```

---

## DATABASE + SCHEMA + TABLE ACCESS CHAIN (5 questions: Apr8-Q15, Apr10-Q15, Apr13-Q13, Apr15-Q18, Apr15-Q19)

### The Full Chain Required for SELECT
```
GRANT USAGE ON DATABASE my_db TO ROLE analyst;      -- Step 1: See the DB
GRANT USAGE ON SCHEMA my_db.my_schema TO ROLE analyst; -- Step 2: See the schema
GRANT SELECT ON TABLE my_db.my_schema.t1 TO ROLE analyst; -- Step 3: Query the table
```
ALL THREE are required. Missing ANY one = "Object does not exist or not authorized."

### Scenario D1: "Role has SELECT on table but nothing else"
**BEFORE:**
```sql
GRANT SELECT ON TABLE db.schema.t1 TO ROLE reader;
-- Missing: USAGE on database and schema
```
Result: ERROR. "Object does not exist or not authorized."
The role cannot even SEE the database to navigate to the table.

**AFTER (fix):**
```sql
GRANT USAGE ON DATABASE db TO ROLE reader;
GRANT USAGE ON SCHEMA db.schema TO ROLE reader;
-- Now SELECT works because the full chain is complete
```

### Scenario D2: "What does USAGE on a database grant?"
```
USAGE on database = Can see the DB in SHOW DATABASES, can USE DATABASE,
                    can browse schemas. CANNOT query tables.
USAGE on schema   = Can see the schema, browse objects. CANNOT query.
SELECT on table   = Can query. But ONLY if USAGE on DB + schema also granted.
```
TRAP: "USAGE on database lets you query tables" = WRONG.

### Scenario D3: "Role needs to CREATE schemas but not DROP them"
**GRANT:**
```sql
GRANT USAGE ON DATABASE my_db TO ROLE dev;
GRANT CREATE SCHEMA ON DATABASE my_db TO ROLE dev;
```
Result: CAN create schemas. CANNOT drop schemas (that requires OWNERSHIP).

### Scenario D4: "What privilege creates external stages referencing storage integrations?"
```sql
GRANT CREATE STAGE ON SCHEMA my_db.my_schema TO ROLE loader;
GRANT USAGE ON INTEGRATION my_s3_int TO ROLE loader;
-- Both required. Missing either = failure.
```

---

## RESOURCE MONITOR PRIVILEGES (2 questions: Apr13-Q12, Apr15-Q25)

### The Restriction
```
CREATE RESOURCE MONITOR --> ACCOUNTADMIN ONLY (cannot be delegated)
MONITOR                 --> View credit usage
MODIFY                  --> Change quota, triggers, assigned warehouses
```

### Scenario R1: "Non-ACCOUNTADMIN role needs to view resource monitor usage"
**BEFORE:**
```sql
-- analyst has no grants on resource monitor
SHOW RESOURCE MONITORS; -- Empty or access denied
```

**AFTER:**
```sql
GRANT MONITOR ON RESOURCE MONITOR my_rm TO ROLE analyst;
```
Result: CAN view credit usage, remaining quota. CANNOT change quota or triggers.

### Scenario R2: "Resource monitor shows 0 credits for auto-clustering"
```
Resource monitors ONLY track user-managed warehouse credits.
Serverless features (auto-clustering, Snowpipe, MVs, SOS) are NOT tracked.
Use BUDGETS for serverless cost monitoring.
```
TRAP: "Account-level resource monitor tracks all credits" = WRONG.

---

## ROLE HIERARCHY & INHERITANCE (3 questions: Apr8-Q12, Apr13-Q13, Apr15-Q12)

### System Role Hierarchy
```
ACCOUNTADMIN
  |-- SECURITYADMIN (manages grants)
  |     |-- USERADMIN (creates users and roles)
  |-- SYSADMIN (creates DBs, warehouses, schemas)
PUBLIC (everyone)
```

### Scenario H1: "USERADMIN scope"
```
USERADMIN can:    CREATE USER, CREATE ROLE, GRANT ROLE ... TO USER/ROLE
USERADMIN cannot: GRANT SELECT ON TABLE, CREATE DATABASE, view billing
```
TRAP: "USERADMIN grants object privileges" = WRONG (that is SECURITYADMIN or OWNERSHIP).

### Scenario H2: "Role revoked from user"
**BEFORE:**
```sql
GRANT ROLE analyst TO USER jdoe;
-- jdoe can USE ROLE analyst and query tables analyst has SELECT on
```

**AFTER:**
```sql
REVOKE ROLE analyst FROM USER jdoe;
-- jdoe IMMEDIATELY loses all privileges from analyst
-- Unless analyst is inherited through another role jdoe still has
```

### Scenario H3: "Custom role not granted to SYSADMIN"
```sql
CREATE ROLE data_team;
GRANT OWNERSHIP ON TABLE secret_data TO ROLE data_team;
-- data_team is NOT granted to SYSADMIN
```
Result: ACCOUNTADMIN (via SYSADMIN) CANNOT see or manage secret_data.
The table is invisible to all admin roles. This is why Snowflake best practice
says: always grant custom roles to SYSADMIN.

---

## MASKING & ROW ACCESS POLICY EVALUATION (3 questions: Apr8-Q19, Apr13-Q14-Q15, Apr15-Q14-Q15)

### Who Gets Evaluated?
```
Masking policy:     Evaluates against the QUERYING context
Row access policy:  Evaluates against the QUERYING context
Secure view:        Runs with OWNER's privileges on base table
Stored proc (OWNER): Runs with OWNER's privileges
Stored proc (CALLER): Runs with CALLER's privileges
```

### Scenario M1: "ACCOUNTADMIN queries a masked column"
**Policy:**
```sql
CREATE MASKING POLICY ssn_mask AS (val STRING) RETURNS STRING ->
  CASE WHEN CURRENT_ROLE() = 'HR' THEN val
       ELSE '***-**-****'
  END;
```

**Query by ACCOUNTADMIN:**
```
CURRENT_ROLE() = 'ACCOUNTADMIN' --> not 'HR' --> sees '***-**-****'
```
NO ROLE BYPASSES MASKING POLICIES. Not even ACCOUNTADMIN.

### Scenario M2: "Primary=ANALYST, Secondary=FINANCE, policy allows FINANCE"
**Policy uses CURRENT_ROLE():**
```sql
CASE WHEN CURRENT_ROLE() IN ('HR','FINANCE') THEN val ELSE masked END
```
CURRENT_ROLE() returns 'ANALYST' (primary only). Result: MASKED.

**Fix -- policy uses IS_ROLE_IN_SESSION():**
```sql
CASE WHEN IS_ROLE_IN_SESSION('HR') OR IS_ROLE_IN_SESSION('FINANCE')
     THEN val ELSE masked END
```
IS_ROLE_IN_SESSION('FINANCE') returns TRUE. Result: UNMASKED.

### Scenario M3: "Row access policy with no ELSE clause"
**Policy:**
```sql
CREATE ROW ACCESS POLICY region_filter AS (region VARCHAR) RETURNS BOOLEAN ->
  CASE WHEN CURRENT_ROLE() = 'SALES' THEN region = 'US' END;
  -- NO ELSE clause
```

**Query by ADMIN role (not mentioned):**
```
CASE returns NULL (no matching WHEN, no ELSE)
NULL in boolean context = FALSE
Result: ADMIN sees ZERO rows
```
TRAP: "Unmentioned roles bypass the policy" = WRONG. They get NULL = FALSE = 0 rows.

### Scenario M4: "Network policy override"
```sql
-- Account level: allows 10.0.0.0/8
ALTER ACCOUNT SET NETWORK_POLICY = acct_policy;

-- User level on JDOE: allows 192.168.1.0/24
ALTER USER JDOE SET NETWORK_POLICY = user_policy;
```
JDOE connecting from 10.0.0.5:
- User-level policy OVERRIDES account-level (not additive)
- 10.0.0.5 is NOT in 192.168.1.0/24
- Result: BLOCKED

---

## EXECUTE AS OWNER vs CALLER (2 questions: Apr8-Q12 context, Apr10-Q12, Apr15-Q17)

### Scenario E1: EXECUTE AS OWNER (default)
```sql
-- Procedure created by role DATA_ENG
CREATE PROCEDURE get_data()
  RETURNS TABLE()
  EXECUTE AS OWNER  -- default
  AS $$ SELECT * FROM secret_table $$;

-- DATA_ENG has SELECT on secret_table
-- ANALYST does NOT have SELECT on secret_table

GRANT USAGE ON PROCEDURE get_data() TO ROLE analyst;
```

**ANALYST calls the procedure:**
```
Procedure runs as DATA_ENG (owner)
DATA_ENG has SELECT on secret_table --> SUCCESS
ANALYST gets the data even without direct SELECT
```

### Scenario E2: EXECUTE AS CALLER
```sql
CREATE PROCEDURE get_data()
  RETURNS TABLE()
  EXECUTE AS CALLER
  AS $$ SELECT * FROM secret_table $$;
```

**ANALYST calls the procedure:**
```
Procedure runs as ANALYST (caller)
ANALYST does NOT have SELECT on secret_table --> FAILS
```

**DATA_ENG calls the same procedure:**
```
Procedure runs as DATA_ENG (caller)
DATA_ENG has SELECT --> SUCCESS
```

### The Masking Policy Interaction (hardest scenario)
```sql
-- Procedure: EXECUTE AS OWNER (owner = DATA_ENG)
-- Table has masking policy: allows ANALYST role
-- Caller is ANALYST
```
What happens:
1. Procedure runs as DATA_ENG (owner)
2. Masking policy evaluates CURRENT_ROLE() = 'DATA_ENG'
3. Policy allows ANALYST, not DATA_ENG
4. Result: DATA IS MASKED even though the caller is ANALYST
5. The owner's role context is what the policy sees

---

## QUICK REFERENCE: "WHAT GRANT DO I NEED?"

| I want to... | I need... |
|---|---|
| Run queries on a warehouse | USAGE on warehouse |
| Suspend/resume a warehouse | OPERATE on warehouse |
| Resize a warehouse | MODIFY on warehouse |
| See a database exists | USAGE on database |
| Browse objects in a schema | USAGE on database + USAGE on schema |
| SELECT from a table | USAGE on DB + USAGE on schema + SELECT on table |
| Create a table in a schema | USAGE on DB + USAGE on schema + CREATE TABLE on schema |
| Create a schema in a DB | USAGE on DB + CREATE SCHEMA on DB |
| View resource monitor usage | MONITOR on resource monitor |
| Create a resource monitor | Must be ACCOUNTADMIN (non-delegable) |
| Create an external stage | CREATE STAGE on schema + USAGE on storage integration |
| Execute a task manually | OPERATE on task |
| Call a stored procedure | USAGE on procedure |
| See column-level access history | SELECT on SNOWFLAKE.ACCOUNT_USAGE.ACCESS_HISTORY |
| View granted privileges | SHOW GRANTS TO ROLE / GRANTS_TO_ROLES view |
