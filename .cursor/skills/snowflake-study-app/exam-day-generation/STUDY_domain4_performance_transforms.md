# Domain 4: Performance Optimization, Querying & Transformation
## Weight: 10-15% (~10-15 questions)

---

## 4.1 Evaluate Query Performance

### Query Profile Indicators
| Indicator | Meaning | Action |
|-----------|---------|--------|
| Bytes spilled to local storage | Moderate impact. Warehouse memory exceeded. | Consider upsizing |
| Bytes spilled to remote storage | SEVERE impact. Both memory and SSD exceeded. | Upsize warehouse |
| Inefficient pruning | Too many partitions scanned vs total | Review clustering key or filters |
| Exploding joins | Missing/non-selective join = Cartesian product | Fix join condition, deduplicate source |
| Queuing | Queries waiting for compute | Scale out (more clusters) or use dedicated warehouse |

### Traps
- "Spilling to local = critical" = FALSE (moderate; remote spilling is critical)
- "Exploding joins = out of memory" = FALSE (it means Cartesian product from bad join condition)
- "Queuing = scale up" = FALSE (queuing = scale OUT with multi-cluster)

### ACCOUNT_USAGE Views for Performance
| View | Purpose |
|------|---------|
| QUERY_HISTORY | Query text, duration, warehouse, bytes scanned, user |
| WAREHOUSE_METERING_HISTORY | Credit consumption per warehouse over time |
| ACCESS_HISTORY | Column-level access tracking (lineage) |

### Query Attribution
- Track who ran what, on which warehouse, how many credits consumed
- Use QUERY_TAG session parameter for custom labels (department, project)
- QUERY_TAG appears in QUERY_HISTORY for filtering and cost allocation

### Workload Management Best Practices
- Group similar workloads into dedicated warehouses (workload isolation)
- BI users -> multi-cluster warehouse with auto-scaling
- ETL jobs -> dedicated warehouse sized for the heaviest transformation
- Ad-hoc analysts -> separate warehouse to avoid impacting production

---

## 4.2 Optimize Query Performance

### Query Acceleration Service (QAS)
- Serverless. Offloads portions of eligible queries to additional compute.
- Best for: ad-hoc/BI queries with large scans and selective filters
- Enabled per warehouse: ALTER WAREHOUSE SET ENABLE_QUERY_ACCELERATION = TRUE
- NOT for: data loading, DDL, stored procedures

### Search Optimization Service (SOS)
- Creates persistent "search access paths" (index-like structures)
- Best for: selective equality and IN lookups on HIGH-CARDINALITY columns
- Background serverless maintenance process
- NOT clustering. Does not reorganize data.

### Clustering Keys
- Best columns: DATE, TIMESTAMP, low-to-medium cardinality in WHERE/JOIN
- Lower cardinality column FIRST in multi-column keys
- SYSTEM$CLUSTERING_INFORMATION(table, '(col)'): average_depth near 1 = well-clustered
- Automatic Clustering: serverless, NOT tracked by resource monitors

### When to use which
| Pattern | Best option |
|---------|-------------|
| Equality lookup, high cardinality (WHERE id = 123) | Search Optimization Service |
| Range scan, low-medium cardinality (WHERE date BETWEEN) | Clustering key |
| Complex aggregation on pre-filtered subset | Materialized view |
| Ad-hoc BI queries scanning large tables | QAS |

### Materialized Views
- Pre-computed results. Auto-refreshed (serverless).
- **ONE base table only** (no JOINs, no subqueries on other tables)
- Enterprise Edition required
- Consumes credits for maintenance

### Traps
- "SOS clusters the table" = FALSE (creates access paths, does not reorganize)
- "Clustering key on high-cardinality column (unique per row)" = BAD (expensive reclustering)
- "MV supports JOINs" = FALSE (use dynamic tables for that)
- "QAS works for data loading" = FALSE (for queries only)
- "Resource monitors track automatic clustering credits" = FALSE (use budgets)

---

## 4.3 Snowflake Caching

### Three Cache Layers
| Cache | Location | Survives Suspend? | Duration | Contents |
|-------|----------|-------------------|----------|----------|
| Result cache | Cloud Services | YES | 24 hours (reuse resets) | Complete query output |
| Metadata cache | Cloud Services | YES | Always on | Row counts, min/max, distinct counts |
| Warehouse (SSD) cache | Compute nodes | NO (wiped) | While running | Raw data from remote storage |

### Result Cache Rules
- Requires: identical query text AND unchanged underlying data
- Does NOT require: same warehouse, same user, warehouse to be running
- Role-specific when row access or masking policies exist
- Each reuse resets the 24-hour timer
- Any DML on underlying tables invalidates the cache

### Metadata Cache Shortcuts
- COUNT(*) on a large table with no WHERE -> answered from metadata instantly (no warehouse)
- MIN/MAX on clustering key columns -> may be answered from metadata

### Traps
- "Result cache requires the same warehouse" = FALSE
- "Result cache persists indefinitely" = FALSE (24 hours)
- "SSD cache survives suspend" = FALSE (completely wiped)
- "Two users, same query, different roles, table has masking policy -> share cache" = FALSE (role-specific)
- "COUNT(*) requires a warehouse" = FALSE (can be answered from metadata)

---

## 4.4 Data Transformation Techniques

### Structured Data
- Standard SQL: SELECT, JOIN, GROUP BY, HAVING, ORDER BY, LIMIT
- Window functions, CTEs, subqueries

### Semi-Structured Data (VARIANT)
- Stored in VARIANT columns (JSON, Avro, Parquet, XML)
- Access: data:key (colon for first level), data:key.nested (dot for nested)
- Both data:L1:L2 and data:L1.L2 work. data.L1.L2 (all dots) FAILS.
- Arrays: 0-indexed. Third element = [2].
- Extraction returns VARIANT type. Cast with ::VARCHAR, ::INTEGER to get native types.
- Casting removes JSON quotes from strings.

### Key Functions
| Function | Purpose |
|----------|---------|
| PARSE_JSON(string) | String -> VARIANT |
| TO_JSON(variant) | VARIANT -> String |
| OBJECT_KEYS(obj) | Array of top-level keys |
| OBJECT_CONSTRUCT(k1,v1,...) | Build JSON from key-value pairs |
| OBJECT_CONSTRUCT(*) | Build JSON from entire row |
| OBJECT_AGG(key_col, val_col) | Aggregate rows into JSON object |
| ARRAYS_TO_OBJECT(keys, vals) | Two arrays -> JSON object |
| ARRAY_AGG(col) | Aggregate rows into array |
| ARRAY_CONSTRUCT(a,b,c) | Build array from explicit values |
| FLATTEN(input => variant) | Explode array/object into rows |
| STRIP_NULL_VALUE(v) | JSON null -> SQL NULL |

### FLATTEN Behavior
- Default: NULL/empty arrays EXCLUDED (rows dropped)
- OUTER => TRUE: NULL rows preserved with NULLs in flattened columns (like LEFT JOIN)

### Unstructured Data
- Stored in stages (not tables). PDFs, images, video.
- Access via directory tables (file metadata) + scoped/presigned URLs
- Process with Java/Python UDFs or Cortex AI functions

### Aggregate Functions
- SUM, COUNT, AVG, MIN, MAX, LISTAGG, ARRAY_AGG, OBJECT_AGG, HASH_AGG
- LISTAGG(col, delimiter): concatenate values from rows into delimited string
- HASH_AGG(*): single hash of entire result set (for table comparison)

### Window Functions
- ROW_NUMBER(), RANK(), DENSE_RANK(), NTILE()
- LAG(), LEAD(), FIRST_VALUE(), LAST_VALUE()
- SUM/COUNT/AVG with OVER (ORDER BY ... ROWS BETWEEN ...) for running totals
- **QUALIFY**: filters on window function results WITHOUT a subquery
  ```sql
  SELECT * FROM t QUALIFY ROW_NUMBER() OVER (PARTITION BY grp ORDER BY val) = 1
  ```

### Conditional Functions
| Function | What it does |
|----------|-------------|
| IFF(cond, true_val, false_val) | Inline IF-THEN-ELSE |
| NVL(expr, replacement) | If NULL, return replacement |
| NVL2(expr, not_null_val, null_val) | If NOT NULL return 2nd arg, if NULL return 3rd |
| COALESCE(a, b, c, ...) | First non-NULL argument |
| DECODE(val, s1,r1, s2,r2, ..., default) | Compact CASE expression |
| ZEROIFNULL(expr) | NULL -> 0 |
| NULLIFZERO(expr) | 0 -> NULL |

### SQL Optimization Patterns
- Use QUALIFY instead of subquery for window function filtering
- Use LATERAL FLATTEN for per-row array explosion
- Use MERGE for upsert (but deduplicate source first to avoid duplicate-row error)
- Use SAMPLE(n) for random n% sample (probabilistic, not exact)
- Use RESULT_SCAN(LAST_QUERY_ID()) to reuse previous query output

### Stored Procedures vs UDFs
| | Stored Procedures | UDFs / UDTFs |
|---|---|---|
| Execute DDL/DML | YES | NO |
| EXECUTE AS OWNER (default) | Owner's privileges | N/A |
| EXECUTE AS CALLER | Caller's privileges | N/A |
| Return type | Single value | Scalar or tabular |
| Run on | Warehouse | Warehouse |

### External Functions
- Computation on external service (AWS Lambda, Azure Functions)
- Requires API integration
- Snowflake sends data out, receives results back

### Traps
- "QUALIFY is the same as HAVING" = FALSE (QUALIFY = window functions, HAVING = aggregates)
- "NVL2 returns the second arg when NULL" = FALSE (returns THIRD arg when NULL)
- "MERGE with duplicate source rows matching one target" = ERROR (must deduplicate)
- "GROUP_CONCAT exists in Snowflake" = FALSE (use LISTAGG)
- "RUNNING_TOTAL() function exists" = FALSE (use SUM with window frame)
- "UDFs can execute INSERT statements" = FALSE (only stored procedures)
- "External functions run on the Snowflake warehouse" = FALSE (external service)
