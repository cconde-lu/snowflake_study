# QUICK RECALL: One-Liner Definitions
## 5-second answers. If you hesitate, study more.

---

## ARCHITECTURE

**What are Snowflake's 3 layers?**
Cloud Services (auth, optimization, metadata) | Compute (warehouses) | Storage (micro-partitions)

**What does the Cloud Services layer do?**
Authentication, query parsing/optimization, metadata management, access control, result cache.

**What does the Compute layer do?**
Executes queries via virtual warehouses. Local SSD cache lives here.

**What does the Storage layer do?**
Stores data as immutable, columnar micro-partitions (50-500 MB uncompressed).

**What is a micro-partition?**
Immutable, columnar storage unit. 50-500 MB uncompressed. Auto-managed. Stores min/max/null/distinct metadata.

**What is a virtual warehouse?**
Named compute cluster. Billed per-second (60s min). Sizes: XS=1, S=2, M=4, L=8, XL=16 credits/hr.

**What is a Snowpark-optimized warehouse?**
16x more memory per node. For ML training, large UDFs, memory-intensive Snowpark operations.

**What is AUTO_SUSPEND = 0?**
NEVER auto-suspend. NOT "suspend immediately."

---

## OBJECTS

**What is a file format?**
Named, reusable set of parse options (TYPE, DELIMITER, SKIP_HEADER, etc.).

**What is a stage?**
Location for data files. User (@~), table (@%tbl), named internal (@stg), named external (@ext_stg).

**What is a pipe?**
Defines a COPY INTO for Snowpipe. Serverless. Triggered by cloud events or REST API.

**What is a stream?**
Change tracking on a table. Records INSERT/UPDATE/DELETE. Offset advances after DML consumption.

**What is a task?**
Scheduled SQL execution. Root task has SCHEDULE. Child tasks triggered by predecessors (DAG).

**What is a sequence?**
Generates unique values. NOT gap-free. NOT ordered across sessions.

**What is a dynamic table?**
Table defined by a SELECT query + TARGET_LAG. Supports JOINs. Auto-maintained by Snowflake.

**What is a PRIMARY KEY in Snowflake?**
Informational/metadata ONLY. NOT enforced. Does NOT prevent duplicates.

---

## TABLE TYPES

| Type | Time Travel | Fail-safe | Scope |
|------|------------|-----------|-------|
| Permanent | 0-90 days (Enterprise) | 7 days | Until dropped |
| Transient | 0-1 day | 0 days | Until dropped |
| Temporary | 0-1 day | 0 days | Session only |
| External | N/A | N/A | Read-only, points to cloud storage |

## VIEW TYPES

| Type | Key fact |
|------|----------|
| Standard | Saved SQL. Definition visible to granted roles. |
| Materialized | Pre-computed. ONE table only. No JOINs. Auto-refresh (serverless). Enterprise+. |
| Secure | Hides definition. Required for sharing. |

---

## SECURITY

**What does USERADMIN do?**
Creates and manages users AND roles. Grants roles to users.

**What does SECURITYADMIN do?**
Everything USERADMIN + object-level grants (GRANT SELECT, etc.).

**What does SYSADMIN do?**
Creates databases, warehouses, schemas.

**What does ACCOUNTADMIN do?**
Everything + billing, resource monitors, account settings.

**What does ORGADMIN do?**
Organization-level: create accounts, view org usage. NOT account-level admin.

**What is DAC?**
Discretionary Access Control. Each object has an owner who decides access.

**What is a managed access schema?**
Only schema owner + MANAGE GRANTS roles can grant privileges. Object owners CANNOT.

**What encryption does Snowflake use?**
AES-256 at rest + TLS 1.2 in transit. All editions. Tri-Secret Secure = Business Critical+.

---

## DATA LOADING

**Default ON_ERROR for COPY INTO?** ABORT_STATEMENT.
**Default ON_ERROR for Snowpipe?** SKIP_FILE.
**COPY metadata retention?** 64 days.
**Snowpipe metadata retention?** 14 days.
**What does VALIDATION_MODE do?** Dry-run. NO data loaded. Returns errors only.
**What does FORCE = TRUE do?** Bypasses dedup. Reloads files. Risk: duplicates.
**What does PURGE = TRUE do?** Deletes files from stage after successful load.
**What does MATCH_BY_COLUMN_NAME do?** Matches by name not position.
**What does TRUNCATECOLUMNS do?** Truncates oversized strings instead of erroring.
**What does PARTITION BY do in COPY INTO unload?** Splits output into files by column values.
**PUT uploads to?** Internal stages ONLY. Auto-gzip. Requires local filesystem (not Snowsight).
**GET downloads from?** Internal stages to local filesystem.

---

## PERFORMANCE

**Result cache**: Cloud Services. 24h. No warehouse needed. Invalidated by DML. Role-specific with policies.
**SSD cache**: Warehouse nodes. Wiped on suspend. Cold start on resume.
**Metadata cache**: Cloud Services. Always on. Row counts, min/max. COUNT(*) without warehouse.

**When to use CLUSTERING KEY?** Range/equality filters on low-medium cardinality columns. Lower cardinality first.
**When to use SOS?** Equality/IN lookups on HIGH cardinality columns. Creates search access paths.
**When to use QAS?** Outlier queries using 10-100x more resources than typical.
**When to use MV?** Same single-table aggregation repeated. No JOINs.
**When to use DYNAMIC TABLE?** Complex query with JOINs that needs auto-refresh.
**Scale UP for?** Single complex query (more memory/compute).
**Scale OUT for?** Many users queuing (more clusters). STANDARD = immediate. ECONOMY = waits 6 min.

---

## SHARING

**Direct Share scope?** Same region only. Zero-copy. Read-only.
**Listing scope?** Cross-region (Auto-Fulfillment). Supports monetization.
**What can be shared?** Tables, secure views, secure UDFs, external tables.
**What CANNOT be shared?** Standard views, stored procedures, warehouses, stages.
**Reader Account?** CAN create warehouses/tables/DBs. Provider pays. Name is misleading.
**Share revoked?** Consumer DB becomes empty (shell remains, objects inaccessible).
**IMPORT SHARE privilege?** Required to get/install Marketplace listings.
