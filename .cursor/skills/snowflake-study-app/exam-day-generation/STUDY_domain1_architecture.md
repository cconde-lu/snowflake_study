# Domain 1: Snowflake AI Data Cloud Features & Architecture
## Weight: 25-30% (~25-30 questions) | HEAVIEST DOMAIN

---

## 1.1 Architecture (Three Layers)

### What to know
- **Cloud Services**: Authentication, query optimization, metadata, result cache, access control
- **Compute**: Virtual warehouses execute queries. Independent of storage. SSD cache lives here.
- **Storage**: Centralized cloud storage. Micro-partitions (immutable, columnar, 50-500 MB uncompressed).

### Traps
- "Which layer handles query optimization?" = Cloud Services (NOT compute)
- "Which layer stores the result cache?" = Cloud Services (persists across warehouse suspend)
- "Which layer stores micro-partitions?" = Storage (NOT compute, even though compute reads them)
- SSD cache is on compute nodes but is wiped on suspend. Result cache is on Cloud Services and survives.

### Edition Matrix (memorize this)
| Feature | Standard | Enterprise | Biz Critical | VPS |
|---------|----------|------------|--------------|-----|
| Multi-cluster WH | No | Yes | Yes | Yes |
| Time Travel 90 days | No (1 day max) | Yes | Yes | Yes |
| Materialized views | No | Yes | Yes | Yes |
| Dynamic data masking | No | Yes | Yes | Yes |
| Tri-Secret Secure | No | No | Yes | Yes |
| PrivateLink | No | No | Yes | Yes |
| HIPAA/PCI compliance | No | No | Yes | Yes |
| Sharing via Support only | No | No | No | Yes |

### Trap
- "Standard Edition supports materialized views" = FALSE (Enterprise+)
- "Business Critical adds masking policies" = FALSE (Enterprise adds them)
- "All editions encrypt data at rest" = TRUE (AES-256 on all)

---

## 1.2 Interfaces & Tools

### What to know
| Tool | Purpose |
|------|---------|
| Snowsight | Web UI for queries, dashboards, worksheets |
| SnowSQL | CLI for running SQL from terminal |
| Snowflake CLI (snow) | CLI for managing Snowflake objects, Streamlit, Notebooks |
| SnowCD | Connectivity diagnostic tool (DNS, TLS, OCSP, proxy) |
| SQL API | REST API for programmatic SQL execution (OAuth/JWT auth) |
| JDBC/ODBC | Standard database drivers |
| Python Connector | Python-specific driver |

### Traps
- "SnowCD executes queries" = FALSE (it only tests connectivity)
- "SQL API uses username/password" = FALSE (OAuth or JWT only)
- "PUT works from Snowsight" = FALSE (requires local filesystem: SnowSQL/drivers)

---

## 1.3 Object Hierarchy & Types

### Hierarchy
```
Organization
  Account
    Database
      Schema
        Table / View / Stage / Pipe / Stream / Task / Sequence / UDF / Procedure / File Format / Share
```

### Parameter Precedence (most specific wins)
```
Object level > Session level > Account level
```
- If session sets TIMEOUT=60 and account sets TIMEOUT=300, session wins (60).
- SHOW PARAMETERS IN SESSION / IN ACCOUNT / FOR WAREHOUSE to inspect.

### Key Object Facts
| Object | Key fact to remember |
|--------|---------------------|
| Sequence | Unique values, NOT gap-free or ordered across sessions |
| Pipe | Defines a COPY INTO for Snowpipe. Serverless compute. |
| Share | Contains references to objects. Consumer gets read-only access. |
| File Format | Named set of parse options (TYPE, DELIMITER, etc.). Reusable. |

### Traps
- "Sequences guarantee sequential order" = FALSE (unique only, gaps possible)
- "Shares contain data copies" = FALSE (they contain references)

---

## 1.4 Virtual Warehouses

### Credit Table (MUST memorize)
| Size | Credits/Hour |
|------|-------------|
| X-Small | 1 |
| Small | 2 |
| Medium | 4 |
| Large | 8 |
| X-Large | 16 |
| 2XL | 32 | 3XL = 64 | 4XL = 128 |

### Billing rules
- Per-second billing, 60-second minimum PER RESUME
- Query count is irrelevant. Only size and runtime matter.
- AUTO_SUSPEND = 0 means NEVER auto-suspend (trap: not "suspend immediately")

### Warehouse Types
| Type | Use case |
|------|----------|
| Standard (Gen 1/Gen 2) | General SQL queries |
| Snowpark-optimized | 16x memory. ML training, large UDFs, Snowpark DataFrames |

### Scaling
| Strategy | When | Mechanism |
|----------|------|-----------|
| Scale UP | Complex single query is slow | Increase warehouse size |
| Scale OUT | Many users queuing | Multi-cluster with auto-scaling |
| STANDARD scaling | Adds cluster immediately on queue | More responsive, more credits |
| ECONOMY scaling | Waits 6 min estimate before adding | Saves credits, more queuing |

### Traps
- "ECONOMY scaling reduces queuing" = FALSE (it increases queuing)
- "Scale UP helps with concurrency" = FALSE (scale OUT does)
- "Warehouse runs for 45 seconds, billed 45 seconds" = FALSE (billed 60-second minimum)
- ALLOW_OVERLAPPING_EXECUTION = FALSE (default): skips next run if current still executing

---

## 1.5 Storage Concepts

### Micro-partitions
- Immutable, columnar, 50-500 MB uncompressed
- Metadata stored automatically: min/max per column, null count, distinct count
- Cannot be manually defined or resized

### Clustering
- Best columns: DATE, TIMESTAMP, low-to-medium cardinality in WHERE/JOIN
- Put LOWER cardinality column FIRST in multi-column keys
- SYSTEM$CLUSTERING_INFORMATION: depth near 1 = good, high depth = bad
- Automatic Clustering = serverless (NOT tracked by resource monitors)

### Table Types
| Type | Time Travel | Fail-safe | Scope | Cloneable? |
|------|------------|-----------|-------|-----------|
| Permanent | 0-90 days (Enterprise) | 7 days | Until dropped | Yes |
| Transient | 0-1 day | 0 days | Until dropped | Yes (must say TRANSIENT in clone DDL) |
| Temporary | 0-1 day | 0 days | Session only | Yes |
| External | N/A | N/A | Points to cloud storage | NO |
| Dynamic | Defined by query + TARGET_LAG | Same as permanent | Until dropped | NO |
| Iceberg | Via external catalog | N/A | Customer-managed storage | Depends |

### View Types
| Type | Key fact |
|------|----------|
| Standard | Saved SQL. No storage. Definition visible to granted roles. |
| Materialized | Pre-computed. Serverless refresh. ONE table only (no JOINs). Enterprise+. |
| Secure | Hides definition from non-owners. Required for sharing. May reduce optimization. |

### Traps
- "Materialized views support JOINs" = FALSE (single table only). Dynamic tables support JOINs.
- "External tables support INSERT" = FALSE (read-only, SELECT only)
- "Cloning a transient table with CREATE TABLE ... CLONE" = FAILS. Must use CREATE TRANSIENT TABLE ... CLONE.
- "External tables are included in database clones" = FALSE (excluded entirely)
- "Internal stages can be cloned" = FALSE. External stages CAN.

---

## 1.6 AI/ML & Application Development

### Cortex AI SQL Functions
SUMMARIZE, SENTIMENT, TRANSLATE, COMPLETE, EXTRACT_ANSWER, CLASSIFY_TEXT
- Run directly in SQL. No external infrastructure needed.

### Cortex Analyst
- Text-to-SQL: natural language questions converted to SQL via a semantic model (YAML)

### Cortex Search
- Hybrid search (keyword + vector) over text data

### Snowflake ML Functions
- FORECAST (time-series prediction)
- ANOMALY_DETECTION (outlier detection)
- Built-in, serverless, no ML framework required

### Snowpark
- DataFrames evaluated LAZILY. Computation runs on the session's WAREHOUSE (not client).
- Supports Python, Java, Scala.

### Streamlit in Snowflake (SiS)
- Apps run inside Snowflake-managed compute (not client, not external Streamlit cloud)
- Uses viewer's role and warehouse for data access

### Snowflake Notebooks
- Interactive development environment in Snowsight
- Supports Python and SQL cells
- Runs on Snowflake compute (warehouse or container service)

### Native Apps
- Packaged apps (code + data) distributed via Marketplace
- Consumer installs in their own account

### Traps
- "Snowpark DataFrames execute on the client" = FALSE (on the warehouse)
- "SiS apps run on a dedicated Streamlit server" = FALSE (Snowflake-managed compute)
- "FORECAST is an external ML function" = FALSE (built-in ML function)
