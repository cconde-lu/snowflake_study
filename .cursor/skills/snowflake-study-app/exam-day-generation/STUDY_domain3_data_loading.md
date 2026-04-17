# Domain 3: Data Loading, Unloading & Connectivity
## Weight: 10-15% (~10-15 questions)

---

## 3.1 Data Loading & Unloading

### File Formats Supported
CSV, JSON, Avro, ORC, Parquet, XML
- **NOT supported**: Excel (.xlsx), PDF, binary (must convert first)

### Key File Format Options
| Option | Format | What it does |
|--------|--------|-------------|
| STRIP_OUTER_ARRAY | JSON | Remove outer [ ] so each element = 1 row |
| STRIP_NULL_VALUE | JSON | Convert JSON "null" to SQL NULL |
| FIELD_OPTIONALLY_ENCLOSED_BY | CSV | Character wrapping field values (e.g., '"') |
| PARSE_HEADER | CSV | Read first row as column headers (for MATCH_BY_COLUMN_NAME) |
| SKIP_HEADER | CSV | Skip N rows (does NOT parse headers as names) |
| ERROR_ON_COLUMN_COUNT_MISMATCH | CSV | Error if file/table column counts differ (default TRUE) |

### Trap
- "STRIP_OUTER_ARRAY is for CSV" = FALSE (JSON only)
- "SKIP_HEADER = 1 enables MATCH_BY_COLUMN_NAME" = FALSE (need PARSE_HEADER = TRUE)
- "FIELD_OPTIONALLY_ENCLOSED_BY is for JSON" = FALSE (CSV only)

### Stage Types
| Type | Reference | Scope | Cloneable? |
|------|-----------|-------|-----------|
| User stage | @~ | Per user (auto-created) | No |
| Table stage | @%table_name | Per table (auto-created) | No |
| Named internal | @my_stage | User-created standalone | NO (internal cannot be cloned) |
| Named external | @my_ext_stage | Points to S3/Azure/GCS | YES (metadata cloned) |

### Trap
- "Internal stages can be cloned" = FALSE ("Unsupported feature" error)
- "External stages store data" = FALSE (they store metadata/URL pointers)

### Server-side Encryption
- Internal stages: automatically encrypted at rest (AES-256) by Snowflake
- External stages: rely on cloud provider encryption + optional client-side encryption

### Directory Tables
- Enabled on stages: provide file-level metadata (URLs, sizes, timestamps, ETags)
- Do NOT return file content. Use for managing unstructured data catalogs.

### COPY INTO Command

**Loading (stage to table):**
```sql
COPY INTO my_table FROM @my_stage FILE_FORMAT = (TYPE=CSV)
```

**Loading with transformations:**
```sql
COPY INTO my_table(col1, col2) FROM (SELECT $1, UPPER($2) FROM @my_stage) FILE_FORMAT = (TYPE=CSV)
```

**Unloading (table to stage):**
```sql
COPY INTO @my_stage FROM my_table FILE_FORMAT = (TYPE=PARQUET)
```

### METADATA$ Pseudo-columns (in COPY INTO SELECT only)
| Column | Returns |
|--------|---------|
| METADATA$FILENAME | Source filename |
| METADATA$FILE_ROW_NUMBER | Row number within the source file |

### Key COPY Parameters
| Parameter | What it does |
|-----------|-------------|
| ON_ERROR | ABORT_STATEMENT (default bulk), SKIP_FILE (default Snowpipe), CONTINUE, SKIP_FILE_n |
| VALIDATION_MODE | Dry-run: RETURN_ALL_ERRORS, RETURN_n_ROWS. NO DATA LOADED. |
| FORCE | Bypass metadata dedup. Reload already-loaded files. RISK: duplicates. |
| MATCH_BY_COLUMN_NAME | Match by name not position (CASE_SENSITIVE / CASE_INSENSITIVE) |
| PURGE | Delete files from stage after successful load |
| TRUNCATECOLUMNS | Truncate strings exceeding column length instead of erroring |

### Load Metadata Retention
| Method | Retention | Consequence |
|--------|-----------|-------------|
| Bulk COPY INTO | 64 days | Files within 64 days are skipped (unless FORCE) |
| Snowpipe | 14 days | Files within 14 days are skipped |

### Traps
- "ON_ERROR default is the same for COPY and Snowpipe" = FALSE (ABORT vs SKIP_FILE)
- "VALIDATION_MODE loads data and returns errors" = FALSE (no data loaded)
- "FORCE = TRUE is safe" = FALSE (creates duplicate rows)
- "COPY INTO loads data when VALIDATION_MODE is set" = FALSE (dry-run only)
- "File loaded 50 days ago, COPY without FORCE: loads again" = FALSE (50 < 64, skipped)
- "File loaded via Snowpipe 10 days ago, same file re-arrives: loads again" = FALSE (10 < 14, skipped)

### PUT / GET
| Command | Direction | Stage type | Requires |
|---------|-----------|-----------|----------|
| PUT | Local file -> internal stage | Internal ONLY | Local filesystem (SnowSQL, drivers) |
| GET | Internal stage -> local file | Internal ONLY | Local filesystem |
| REMOVE (RM) | Delete files from stage | Internal | N/A |

- PUT auto-compresses with gzip by default
- PUT supports subfolder paths: @my_stage/2026/april/
- PUT does NOT work from Snowsight (no local filesystem)
- No RENAME or MOVE commands for staged files

### Post-Load Utilities
| Function | Purpose |
|----------|---------|
| VALIDATE(table, job_id) | Row-level errors from a specific COPY INTO |
| INFER_SCHEMA(location, format) | Detect file schema (column names, types) before loading |
| COPY_HISTORY (Info Schema) | Load history metadata |

---

## 3.2 Automated Data Ingestion

### Snowpipe
- Serverless compute (no user warehouse)
- Two trigger methods:
  1. AUTO_INGEST = TRUE: cloud event notifications (S3->SQS, Azure->Event Grid, GCS->Pub/Sub)
  2. REST API: manual trigger via insertFiles endpoint
- Default ON_ERROR = SKIP_FILE

### Snowpipe Streaming
- Via Ingest SDK: inserts rows DIRECTLY without staging files
- Lower latency than file-based Snowpipe
- Rows go to internal buffers, asynchronously migrated to micro-partitions

### Trap
- "Snowpipe uses a user warehouse" = FALSE (serverless)
- "Snowpipe Streaming requires staging files" = FALSE (direct row insertion)
- "SQS messages expire and files never load" = TRUE if retention exceeded (default 4 days)

### Streams
- Track INSERT/UPDATE/DELETE on source table
- Offset advances after successful DML consumption (returns 0 rows after)
- SYSTEM$STREAM_HAS_DATA(): TRUE/FALSE (used in task WHEN clauses)
- Stale if unconsumed past table retention: must DROP and RECREATE
- CHANGE_TRACKING = TRUE enables CHANGES clause without a stream

### Tasks
- Root task: has SCHEDULE (CRON or interval)
- Child tasks: NO schedule (triggered by predecessors in DAG)
- WHEN clause FALSE = task skipped entirely (zero compute)
- OPERATE privilege to resume/suspend/execute
- Serverless tasks: no WAREHOUSE, uses USER_TASK_MANAGED_INITIAL_WAREHOUSE_SIZE
- ALLOW_OVERLAPPING_EXECUTION = FALSE (default): skips if previous still running

### Dynamic Tables
- Defined by a SELECT query + TARGET_LAG
- Snowflake auto-maintains freshness
- Supports JOINs (unlike materialized views)

### Traps
- "Stale streams can be refreshed with ALTER STREAM" = FALSE (must drop/recreate)
- "Child tasks in a DAG can have their own SCHEDULE" = FALSE (root only)
- "WHEN FALSE = task runs but processes 0 rows" = FALSE (task is skipped, no compute)
- "Dynamic tables are limited to one base table like MVs" = FALSE (support JOINs)

---

## 3.3 Connectors & Integrations

### Snowflake Connectors/Drivers
| Connector/Driver | Use |
|-----------------|-----|
| Python Connector | Python applications |
| Kafka Connector | Streaming ingestion from Kafka (key-pair auth) |
| Spark Connector | Spark-Snowflake data exchange |
| JDBC / ODBC | Standard database connectivity |
| Node.js, Go, .NET drivers | Language-specific drivers |

### Integration Types
| Integration | Purpose |
|-------------|---------|
| Storage integration | IAM trust for S3/Azure/GCS access. No inline credentials. |
| API integration | Trusted external HTTP endpoints (for external functions, webhooks) |
| Git integration | Sync code files from Git repo into Snowflake stage |
| Notification integration | Email/webhook delivery for alerts and budgets |

### Traps
- "Storage integration stores AWS keys" = FALSE (stores Snowflake IAM user ARN, customer grants trust)
- "API integration is for loading data from REST APIs" = FALSE (for external functions and notifications)
- "Git integration versions table data" = FALSE (syncs code files: SQL, Python)
