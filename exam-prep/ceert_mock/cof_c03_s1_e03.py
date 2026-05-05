import streamlit as st
import random

QUESTIONS = [
    # ======================================================================
    # D1: ARCHITECTURE (10q) - ALL fresh framings
    # ======================================================================
    {
        "id": 1, "domain": "D1: Architecture", "multi": False,
        "text": "A user notices that COUNT(*) on a 5 billion row table returns instantly without the warehouse resuming. Which component served this result?",
        "options": {
            "A": "The result cache from a previous identical query.",
            "B": "The metadata cache in the Cloud Services layer, which stores row counts.",
            "C": "The local SSD cache on the warehouse nodes.",
            "D": "A materialized view that pre-computed the count.",
        },
        "answer": ["B"],
        "explanation": "Cloud Services stores metadata including row counts, min/max, and distinct counts per micro-partition. Simple metadata queries like COUNT(*) can be answered without a warehouse.",
    },
    {
        "id": 2, "domain": "D1: Architecture", "multi": False,
        "text": "An X-Small warehouse resumes, runs queries for 3 minutes 20 seconds, then two more queries for 45 seconds before suspending. Total billed seconds?",
        "options": {
            "A": "200 seconds (3m20s only, second batch free)",
            "B": "245 seconds (200 + 45, per-second billing for both)",
            "C": "300 seconds (rounded to 5 minutes)",
            "D": "260 seconds (200 + 60-second minimum for second batch)",
        },
        "answer": ["B"],
        "explanation": "The warehouse stays running between queries (it did not suspend between them). Total continuous runtime = 200 + 45 = 245 seconds. The 60s minimum only applies per RESUME, not per query.",
    },
    {
        "id": 3, "domain": "D1: Architecture", "multi": False,
        "text": "A developer adds UNIQUE and NOT NULL constraints to a Snowflake table. What enforcement does Snowflake provide?",
        "options": {
            "A": "Both constraints are fully enforced on every INSERT and UPDATE.",
            "B": "NOT NULL is enforced; UNIQUE is informational only (duplicates allowed).",
            "C": "Neither constraint is enforced; both are informational only.",
            "D": "UNIQUE is enforced; NOT NULL is informational only.",
        },
        "answer": ["B"],
        "explanation": "Snowflake enforces NOT NULL but does NOT enforce UNIQUE, PRIMARY KEY, or FOREIGN KEY constraints. Those are informational/metadata only for BI tools and documentation.",
    },
    {
        "id": 4, "domain": "D1: Architecture", "multi": True,
        "text": "A data team needs to decide between a materialized view and a dynamic table. Which TWO are limitations of materialized views? (Select TWO).",
        "options": {
            "A": "Cannot include JOINs (single base table only).",
            "B": "Cannot be auto-refreshed.",
            "C": "Cannot include aggregate functions.",
            "D": "Cannot include UDFs in the definition.",
            "E": "Require Standard Edition (no edition restriction).",
        },
        "answer": ["A", "D"],
        "explanation": "MVs cannot include JOINs (single table) and cannot include UDFs. They CAN include aggregates and DO auto-refresh. They require Enterprise+.",
    },
    {
        "id": 5, "domain": "D1: Architecture", "multi": False,
        "text": "A team uses separate warehouses for ETL, BI dashboards, and ad-hoc analysis. What best practice does this represent?",
        "options": {
            "A": "Cost minimization through shared compute.",
            "B": "Workload isolation to prevent different teams from impacting each other.",
            "C": "Data replication across availability zones.",
            "D": "Auto-scaling optimization.",
        },
        "answer": ["B"],
        "explanation": "Dedicated warehouses per workload type prevent one team's heavy queries from causing queuing or resource contention for another. This is Snowflake's recommended workload management practice.",
    },
    {
        "id": 6, "domain": "D1: Architecture", "multi": False,
        "text": "Which Snowflake edition is required for Search Optimization Service?",
        "options": {
            "A": "All editions",
            "B": "Enterprise and above",
            "C": "Business Critical and above",
            "D": "Virtual Private Snowflake only",
        },
        "answer": ["B"],
        "explanation": "Search Optimization Service requires Enterprise Edition or higher, same as materialized views, clustering, and dynamic data masking.",
    },
    {
        "id": 7, "domain": "D1: Architecture", "multi": False,
        "text": "A Streamlit in Snowflake app accesses a table. Whose role and warehouse does it use for data access?",
        "options": {
            "A": "The app creator's role and a dedicated serverless pool.",
            "B": "The app viewer's role and warehouse.",
            "C": "ACCOUNTADMIN role and the account's default warehouse.",
            "D": "A shared application role with read-only access.",
        },
        "answer": ["B"],
        "explanation": "SiS apps run using the VIEWER's role and warehouse for data access. This means different viewers may see different data based on their role's privileges.",
    },
    {
        "id": 8, "domain": "D1: Architecture", "multi": False,
        "text": "A child task in a DAG does not have a SCHEDULE defined. How is it triggered?",
        "options": {
            "A": "It inherits the parent's schedule automatically.",
            "B": "It runs when its predecessor task(s) complete successfully.",
            "C": "It must be triggered manually with EXECUTE TASK.",
            "D": "It runs continuously in a loop.",
        },
        "answer": ["B"],
        "explanation": "In a task DAG, only the root task has a SCHEDULE. Child tasks fire when their predecessor(s) complete. Children cannot have their own schedules.",
    },
    {
        "id": 9, "domain": "D1: Architecture", "multi": False,
        "text": "Which Snowflake ML function provides built-in time-series forecasting without external frameworks?",
        "options": {
            "A": "PREDICT()",
            "B": "FORECAST()",
            "C": "TIME_SERIES_MODEL()",
            "D": "ML_TRAIN()",
        },
        "answer": ["B"],
        "explanation": "FORECAST is a built-in Snowflake ML function for time-series prediction. ANOMALY_DETECTION is for outlier detection. Both are serverless and require no external ML frameworks.",
    },
    {
        "id": 10, "domain": "D1: Architecture", "multi": False,
        "text": "How do micro-partitions enable query pruning?",
        "options": {
            "A": "By storing user-defined indexes on frequently queried columns.",
            "B": "By maintaining min/max metadata per column, allowing Snowflake to skip partitions that cannot match filters.",
            "C": "By compressing data so less needs to be scanned.",
            "D": "By distributing data evenly across all warehouse nodes.",
        },
        "answer": ["B"],
        "explanation": "Each micro-partition stores min/max values, null counts, and distinct counts per column. The optimizer uses this metadata to skip (prune) partitions that cannot contain matching rows.",
    },
    # ======================================================================
    # D2: SECURITY (7q) - ALL fresh framings
    # ======================================================================
    {
        "id": 11, "domain": "D2: Security", "multi": False,
        "text": "A new custom role DATA_TEAM is created but not granted to SYSADMIN. An admin using ACCOUNTADMIN tries to query a table owned by DATA_TEAM. What happens?",
        "options": {
            "A": "ACCOUNTADMIN can query any table in the account.",
            "B": "The query fails because ACCOUNTADMIN does not inherit DATA_TEAM's privileges without the hierarchy link.",
            "C": "The query succeeds but returns masked data.",
            "D": "Snowflake automatically grants the role to SYSADMIN.",
        },
        "answer": ["B"],
        "explanation": "If a custom role is not in SYSADMIN's hierarchy, even ACCOUNTADMIN cannot access its objects. Best practice: always grant custom roles to SYSADMIN.",
    },
    {
        "id": 12, "domain": "D2: Security", "multi": False,
        "text": "An admin wants to track which specific COLUMNS were read by analyst queries last month. Which ACCOUNT_USAGE view provides this?",
        "options": {
            "A": "QUERY_HISTORY (contains SQL text but not column-level detail).",
            "B": "ACCESS_HISTORY (tracks column-level data access per query).",
            "C": "LOGIN_HISTORY (tracks authentication events).",
            "D": "OBJECT_DEPENDENCIES (tracks object references, not query access).",
        },
        "answer": ["B"],
        "explanation": "ACCESS_HISTORY provides column-level tracking: DIRECT_OBJECTS_ACCESSED and BASE_OBJECTS_ACCESSED with column detail. QUERY_HISTORY has query text but not column granularity. OBJECT_DEPENDENCIES shows object-to-object references.",
    },
    {
        "id": 13, "domain": "D2: Security", "multi": False,
        "text": "A user connects to Snowflake using a Kafka connector for streaming data ingestion. Which authentication method does this connector require?",
        "options": {
            "A": "Username and password.",
            "B": "SAML 2.0 SSO.",
            "C": "Key-pair (RSA) authentication.",
            "D": "OAuth bearer token.",
        },
        "answer": ["C"],
        "explanation": "The Snowflake Kafka Connector requires key-pair (RSA) authentication. SAML is for browser SSO. OAuth is for custom apps. Username/password is not recommended for programmatic connectors.",
    },
    {
        "id": 14, "domain": "D2: Security", "multi": True,
        "text": "A security audit requires knowing who has what access. Which TWO SHOW GRANTS variants would you use? (Select TWO).",
        "options": {
            "A": "SHOW GRANTS ON TABLE my_table (shows who has access to this table)",
            "B": "SHOW GRANTS TO ROLE analyst (shows what the analyst role can do)",
            "C": "SHOW GRANTS FOR USER jdoe (shows all user privileges)",
            "D": "SHOW GRANTS BY DATABASE (shows all grants in a database)",
            "E": "SHOW GRANTS IN SCHEMA (shows schema-level grants)",
        },
        "answer": ["A", "B"],
        "explanation": "SHOW GRANTS ON <object> = who has access. SHOW GRANTS TO ROLE = what can this role do. Also: SHOW GRANTS OF ROLE = who has this role. FOR USER and BY DATABASE do not exist.",
    },
    {
        "id": 15, "domain": "D2: Security", "multi": False,
        "text": "A row access policy on a sales table restricts rows by region. An analyst not mentioned in the policy queries the table. The policy's CASE has no ELSE clause. How many rows are returned?",
        "options": {
            "A": "All rows (unmentioned roles are not restricted).",
            "B": "Zero rows (CASE returns NULL, treated as FALSE).",
            "C": "An error (missing ELSE causes a syntax failure).",
            "D": "Rows from all regions (default is TRUE when no match).",
        },
        "answer": ["B"],
        "explanation": "A CASE with no matching WHEN and no ELSE returns NULL. In a boolean context (row access), NULL = FALSE = zero rows. No role bypasses this, not even ACCOUNTADMIN.",
    },
    {
        "id": 16, "domain": "D2: Security", "multi": False,
        "text": "What is the purpose of a notification integration in Snowflake?",
        "options": {
            "A": "To send push notifications to the Snowsight mobile app.",
            "B": "To deliver alert and error notifications via email or webhooks.",
            "C": "To notify users when their queries complete.",
            "D": "To integrate with SMS messaging services.",
        },
        "answer": ["B"],
        "explanation": "Notification integrations deliver messages via email or webhooks (Slack, PagerDuty, etc.) for alerts, budget notifications, and Snowpipe error notifications.",
    },
    {
        "id": 17, "domain": "D2: Security", "multi": False,
        "text": "Which ACCOUNT_USAGE view would you query to find object-to-object references (e.g., which views depend on which tables)?",
        "options": {
            "A": "ACCESS_HISTORY",
            "B": "QUERY_HISTORY",
            "C": "OBJECT_DEPENDENCIES",
            "D": "GRANTS_TO_ROLES",
        },
        "answer": ["C"],
        "explanation": "OBJECT_DEPENDENCIES tracks object references: which views reference which tables, which procedures reference which objects. ACCESS_HISTORY tracks query-level data access, not structural dependencies.",
    },
    # ======================================================================
    # D3: DATA LOADING (9q) - ALL fresh framings
    # ======================================================================
    {
        "id": 18, "domain": "D3: Loading", "multi": False,
        "text": "A data engineer loads a file via Snowpipe. 16 days later, the identical file arrives again. What happens?",
        "options": {
            "A": "Skipped (Snowpipe metadata retained for 64 days).",
            "B": "Loaded again (Snowpipe metadata retention is 14 days, 16 > 14).",
            "C": "An error is raised for duplicate detection.",
            "D": "Skipped permanently (metadata never expires for Snowpipe).",
        },
        "answer": ["B"],
        "explanation": "Snowpipe retains load metadata for 14 days. Since 16 > 14, the metadata expired and the file is treated as new. Bulk COPY retention is 64 days (different!).",
    },
    {
        "id": 19, "domain": "D3: Loading", "multi": False,
        "text": "COPY INTO uses ON_ERROR = 'CONTINUE' and PURGE = TRUE. A file has 100 rows, 3 have errors. After loading, what happens to the file?",
        "options": {
            "A": "The file remains because it had errors.",
            "B": "The file is purged because it was processed (97 valid rows loaded).",
            "C": "Only the 3 error rows are removed from the file.",
            "D": "The file is moved to a quarantine folder.",
        },
        "answer": ["B"],
        "explanation": "With CONTINUE, bad rows are skipped but the file is considered processed. PURGE = TRUE deletes files that were processed, even if partially. 97 rows load and the file is purged.",
    },
    {
        "id": 20, "domain": "D3: Loading", "multi": False,
        "text": "A user wants to see what files exist in an internal stage. Which command should they use?",
        "options": {
            "A": "DESCRIBE STAGE @my_stage",
            "B": "SELECT * FROM @my_stage",
            "C": "LIST @my_stage",
            "D": "SHOW FILES IN @my_stage",
        },
        "answer": ["C"],
        "explanation": "LIST (or LS) shows files in a stage. DESCRIBE shows stage properties (not files). SELECT queries data inside files. SHOW FILES does not exist.",
    },
    {
        "id": 21, "domain": "D3: Loading", "multi": True,
        "text": "Which TWO COPY INTO parameters help handle files where column counts or sizes don't match the target table? (Select TWO).",
        "options": {
            "A": "TRUNCATECOLUMNS (truncate oversized strings instead of erroring)",
            "B": "ERROR_ON_COLUMN_COUNT_MISMATCH (error if column counts differ)",
            "C": "PURGE (delete files after load)",
            "D": "FORCE (reload already-loaded files)",
            "E": "PATTERN (regex file filter)",
        },
        "answer": ["A", "B"],
        "explanation": "TRUNCATECOLUMNS handles oversized strings. ERROR_ON_COLUMN_COUNT_MISMATCH handles column count differences. PURGE, FORCE, and PATTERN handle different aspects.",
    },
    {
        "id": 22, "domain": "D3: Loading", "multi": False,
        "text": "A stream on TABLE_A has not been consumed for 30 days. The table's DATA_RETENTION_TIME_IN_DAYS is 14 and MAX_DATA_EXTENSION_TIME_IN_DAYS is 14. Is the stream stale?",
        "options": {
            "A": "Yes, stale after 14 days (retention only).",
            "B": "No, the stream is valid for 28 days (sum of both).",
            "C": "Yes, stale after 14 days (the greater of both values, which are equal).",
            "D": "No, streams never go stale.",
        },
        "answer": ["C"],
        "explanation": "Staleness = GREATER of (retention, max_extension) = GREATER(14, 14) = 14 days. 30 > 14, so the stream is stale. Must DROP and RECREATE. Note: it is the GREATER, not the SUM.",
    },
    {
        "id": 23, "domain": "D3: Loading", "multi": False,
        "text": "What does the GET command do in Snowflake?",
        "options": {
            "A": "Uploads files from local machine to an internal stage.",
            "B": "Downloads files from an internal stage to the local filesystem.",
            "C": "Retrieves query results from the result cache.",
            "D": "Gets the DDL definition of a database object.",
        },
        "answer": ["B"],
        "explanation": "GET downloads files from an INTERNAL stage to local filesystem. PUT does the upload. Both require SnowSQL or drivers (not Snowsight). GET_DDL is a separate function.",
    },
    {
        "id": 24, "domain": "D3: Loading", "multi": False,
        "text": "A COPY INTO command uses ON_ERROR = 'SKIP_FILE_5'. A file has 4 parsing errors. What happens to this file?",
        "options": {
            "A": "The file is skipped (it has errors).",
            "B": "The file is loaded (4 < 5, threshold not reached).",
            "C": "Only the first 5 rows are loaded.",
            "D": "The COPY aborts entirely.",
        },
        "answer": ["B"],
        "explanation": "SKIP_FILE_n skips only when error count >= n. Since 4 < 5, the file is loaded. Bad rows are handled per the error behavior. With 5+ errors, the file would be skipped.",
    },
    {
        "id": 25, "domain": "D3: Loading", "multi": False,
        "text": "A data pipeline needs to automatically detect the column names and types of Parquet files on a stage before creating the target table. Which function helps?",
        "options": {
            "A": "VALIDATE()",
            "B": "DESCRIBE STAGE",
            "C": "INFER_SCHEMA()",
            "D": "SHOW COLUMNS",
        },
        "answer": ["C"],
        "explanation": "INFER_SCHEMA analyzes files on a stage and returns detected column names, types, and order. VALIDATE checks errors after loading. DESCRIBE shows stage properties.",
    },
    {
        "id": 26, "domain": "D3: Loading", "multi": False,
        "text": "A Git integration in Snowflake synchronizes what into a Snowflake stage?",
        "options": {
            "A": "Table data from a remote database.",
            "B": "Code files (SQL, Python) from a Git repository.",
            "C": "Docker container images for Snowpark.",
            "D": "Machine learning model artifacts.",
        },
        "answer": ["B"],
        "explanation": "Git integration syncs code files (SQL scripts, Python, etc.) from a Git repo into a Snowflake stage for use in procedures, Notebooks, and Streamlit apps.",
    },
    # ======================================================================
    # D4: PERFORMANCE & TRANSFORMS (9q) - ALL fresh framings
    # ======================================================================
    {
        "id": 27, "domain": "D4: Performance", "multi": False,
        "text": "An analyst's ad-hoc query scans a 10 TB table and takes 20 minutes. Most other queries on this warehouse finish in under 30 seconds. Which optimization is BEST for this outlier pattern?",
        "options": {
            "A": "Add a clustering key.",
            "B": "Enable Query Acceleration Service.",
            "C": "Create a materialized view.",
            "D": "Increase the warehouse to 4X-Large permanently.",
        },
        "answer": ["B"],
        "explanation": "QAS is designed for outlier queries that use 10-100x more resources than typical. It offloads scan portions to serverless compute. Permanent upsizing wastes credits for the 95% of queries that are already fast.",
    },
    {
        "id": 28, "domain": "D4: Performance", "multi": False,
        "text": "A table is clustered on (country, order_date). A query filters: WHERE order_date = '2026-01-15'. How effective is pruning?",
        "options": {
            "A": "Fully effective, same as filtering on country.",
            "B": "Partially effective, but less than filtering on the leading column (country).",
            "C": "Not effective at all.",
            "D": "It depends on the warehouse size.",
        },
        "answer": ["B"],
        "explanation": "Filtering on a non-leading column (order_date is second) provides SOME pruning but less than filtering on country (first) or both. Put the most commonly filtered, lower-cardinality column first.",
    },
    {
        "id": 29, "domain": "D4: Performance", "multi": False,
        "text": "Two users run the exact same SELECT query. User A gets results in 50ms. User B gets results in 8 seconds. The table has a masking policy. Why the difference?",
        "options": {
            "A": "User B has a slower network connection.",
            "B": "The result cache is role-specific when policies exist, so User B's role has a different cached result.",
            "C": "User B's warehouse is smaller.",
            "D": "User A ran the query more recently.",
        },
        "answer": ["B"],
        "explanation": "When row access or masking policies exist, the result cache is role-specific. Different roles may see different data, so cached results are NOT shared across roles. User A got a cache hit for their role; User B did not.",
    },
    {
        "id": 30, "domain": "D4: Performance", "multi": False,
        "text": "A single ETL job processes a massive aggregation and the Query Profile shows 'Bytes Spilled to Remote Storage'. No other users are on the warehouse. What should you do?",
        "options": {
            "A": "Add more clusters (scale out).",
            "B": "Increase the warehouse size (scale up) for more memory.",
            "C": "Enable ECONOMY scaling policy.",
            "D": "Add a clustering key to the source table.",
        },
        "answer": ["B"],
        "explanation": "Single query + remote spilling + no concurrency = need more memory = scale UP. No queuing means multi-cluster is unnecessary. Key signal: 'single job' + 'no other users' = scale up, not out.",
    },
    {
        "id": 31, "domain": "D4: Performance", "multi": True,
        "text": "Which TWO functions produce approximate results for faster performance on large datasets? (Select TWO).",
        "options": {
            "A": "APPROXIMATE_COUNT_DISTINCT()",
            "B": "COUNT(DISTINCT)",
            "C": "HASH_AGG()",
            "D": "HLL()",
            "E": "SUM()",
        },
        "answer": ["A", "D"],
        "explanation": "APPROXIMATE_COUNT_DISTINCT (and its alias HLL) use HyperLogLog for fast cardinality estimation with a small error margin. COUNT(DISTINCT), HASH_AGG, and SUM are exact.",
    },
    {
        "id": 32, "domain": "D4: Performance", "multi": False,
        "text": "A developer writes: SELECT name, salary, RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS rnk FROM employees QUALIFY rnk <= 3. What does this return?",
        "options": {
            "A": "All employees sorted by salary.",
            "B": "The top 3 highest-paid employees per department.",
            "C": "Exactly 3 rows from the entire table.",
            "D": "An error because QUALIFY cannot reference an alias.",
        },
        "answer": ["B"],
        "explanation": "QUALIFY filters window function results. RANK() partitioned by dept, ordered by salary DESC, filtered to <= 3 returns the top 3 per department. QUALIFY CAN reference column aliases.",
    },
    {
        "id": 33, "domain": "D4: Performance", "multi": False,
        "text": "LATERAL FLATTEN(input => data:items, OUTER => TRUE) is used on a row where data:items is NULL. What happens?",
        "options": {
            "A": "The row is excluded from results (default behavior without OUTER).",
            "B": "The row appears with NULL values in the flattened columns.",
            "C": "An error is raised.",
            "D": "The NULL is converted to an empty array.",
        },
        "answer": ["B"],
        "explanation": "OUTER => TRUE preserves rows with NULL/empty arrays, outputting NULLs in flattened columns (like LEFT JOIN). Without OUTER, NULL rows would be excluded.",
    },
    {
        "id": 34, "domain": "D4: Performance", "multi": False,
        "text": "A query needs the previous row's value for comparison. Which window function retrieves a value from the preceding row?",
        "options": {
            "A": "FIRST_VALUE()",
            "B": "LAG()",
            "C": "LEAD()",
            "D": "NTH_VALUE()",
        },
        "answer": ["B"],
        "explanation": "LAG() accesses the previous row's value. LEAD() accesses the next row. FIRST_VALUE returns the first in the window. NTH_VALUE returns the nth value.",
    },
    {
        "id": 35, "domain": "D4: Performance", "multi": False,
        "text": "What is the difference between VALIDATE() and VALIDATION_MODE in the context of data loading?",
        "options": {
            "A": "They are the same feature with different names.",
            "B": "VALIDATION_MODE is a COPY parameter (dry-run, no load). VALIDATE() is a function that reviews errors from a PREVIOUS load.",
            "C": "VALIDATE() runs before loading. VALIDATION_MODE runs after.",
            "D": "VALIDATE() checks table structure. VALIDATION_MODE checks file contents.",
        },
        "answer": ["B"],
        "explanation": "VALIDATION_MODE in COPY INTO = dry-run, no data loaded, returns errors. VALIDATE(table, job_id) = after-the-fact review of errors from an already-executed COPY. Different timing, different purpose.",
    },
    # ======================================================================
    # D5: SHARING & COLLABORATION (5q) - ALL fresh framings
    # ======================================================================
    {
        "id": 36, "domain": "D5: Sharing", "multi": False,
        "text": "A provider wants to share data with a consumer in a different cloud region. Direct Share does not work. What should they use?",
        "options": {
            "A": "Database replication only.",
            "B": "A Listing with Cross-Cloud Auto-Fulfillment.",
            "C": "A Reader Account in the consumer's region.",
            "D": "An external stage pointing to the consumer's cloud storage.",
        },
        "answer": ["B"],
        "explanation": "Direct Shares are same-region only. Listings with Auto-Fulfillment automatically replicate data to the consumer's region/cloud. Database replication works but requires more manual setup.",
    },
    {
        "id": 37, "domain": "D5: Sharing", "multi": False,
        "text": "A consumer creates a database from a share. They try to run INSERT INTO shared_table VALUES (1,'test'). What happens?",
        "options": {
            "A": "The insert succeeds.",
            "B": "The insert fails because shared data is read-only.",
            "C": "The insert succeeds but is not visible to the provider.",
            "D": "The insert is queued for provider approval.",
        },
        "answer": ["B"],
        "explanation": "Shared data is always read-only for consumers. No INSERT, UPDATE, DELETE, MERGE, or CLONE. To get a writable copy, use CREATE TABLE AS SELECT.",
    },
    {
        "id": 38, "domain": "D5: Sharing", "multi": True,
        "text": "A Reader Account consumer wants to work with shared data. Which TWO things CAN they do? (Select TWO).",
        "options": {
            "A": "Create a virtual warehouse to run queries.",
            "B": "Create local tables to join with shared data.",
            "C": "Create outbound shares to share data with others.",
            "D": "Access the Snowflake Marketplace.",
            "E": "Create pipes for data ingestion.",
        },
        "answer": ["A", "B"],
        "explanation": "Reader Accounts CAN create warehouses and tables (provider pays). They CANNOT create shares, pipes, stages, or access the Marketplace.",
    },
    {
        "id": 39, "domain": "D5: Sharing", "multi": False,
        "text": "A permanent table has DATA_RETENTION_TIME_IN_DAYS = 3 on Enterprise Edition. The table is dropped. Can it be recovered 2 days later?",
        "options": {
            "A": "No, dropped tables cannot be recovered.",
            "B": "Yes, using UNDROP TABLE within the 3-day Time Travel period.",
            "C": "Only by contacting Snowflake Support.",
            "D": "Only if the table was cloned before dropping.",
        },
        "answer": ["B"],
        "explanation": "UNDROP TABLE works within the Time Travel retention period. 2 days < 3 days = within retention. After 3 days, it enters Fail-safe (Support only).",
    },
    {
        "id": 40, "domain": "D5: Sharing", "multi": False,
        "text": "A company wants to list data on the Snowflake Marketplace for all customers to discover. What type of listing and what approval is needed?",
        "options": {
            "A": "Private listing, no approval needed.",
            "B": "Public listing, Snowflake reviews and approves before it goes live.",
            "C": "Public listing, immediately visible to all.",
            "D": "Private listing, Snowflake approval required.",
        },
        "answer": ["B"],
        "explanation": "Public listings require Snowflake review before becoming visible on the Marketplace. Private listings are available immediately to specified accounts without review.",
    },
]

DOMAINS = [
    "D1: Architecture",
    "D2: Security",
    "D3: Loading",
    "D4: Performance",
    "D5: Sharing",
]

DOMAIN_COLORS = {
    "D1: Architecture": "#4A90D9",
    "D2: Security": "#D94A4A",
    "D3: Loading": "#4AD97A",
    "D4: Performance": "#D9A24A",
    "D5: Sharing": "#1ABC9C",
}


def init_state():
    if "started" not in st.session_state:
        st.session_state.started = False
        st.session_state.current_q = 0
        st.session_state.answers = {}
        st.session_state.submitted = False
        st.session_state.order = list(range(len(QUESTIONS)))
        st.session_state.flagged = set()
        st.session_state.shuffle = True


def start_exam():
    st.session_state.started = True
    st.session_state.current_q = 0
    st.session_state.answers = {}
    st.session_state.submitted = False
    st.session_state.flagged = set()
    order = list(range(len(QUESTIONS)))
    if st.session_state.shuffle:
        random.shuffle(order)
    st.session_state.order = order


def submit_exam():
    st.session_state.submitted = True


def go_to(idx):
    st.session_state.current_q = idx


def calc_score():
    correct = 0
    for i, qi in enumerate(st.session_state.order):
        q = QUESTIONS[qi]
        user_ans = st.session_state.answers.get(i, set())
        if user_ans == set(q["answer"]):
            correct += 1
    return correct


def calc_domain_scores():
    domain_stats = {d: {"correct": 0, "total": 0} for d in DOMAINS}
    for i, qi in enumerate(st.session_state.order):
        q = QUESTIONS[qi]
        domain_stats[q["domain"]]["total"] += 1
        user_ans = st.session_state.answers.get(i, set())
        if user_ans == set(q["answer"]):
            domain_stats[q["domain"]]["correct"] += 1
    return domain_stats


def main():
    st.set_page_config(page_title="S1-E03", page_icon="3", layout="wide")
    st.markdown("""<style>
        .stRadio > div { gap: 0.3rem; }
        div[data-testid="stHorizontalBlock"] { align-items: center; }
        .domain-tag { display:inline-block; padding:2px 10px; border-radius:12px;
                      color:white; font-size:0.8rem; font-weight:600; }
        </style>""", unsafe_allow_html=True)
    init_state()
    if not st.session_state.started:
        render_landing()
    elif st.session_state.submitted:
        render_results()
    else:
        render_exam()


def render_landing():
    st.title("COF-C03 S1-E03")
    st.markdown("**40 Questions | 100% Fresh Framings | No Repeats from E01/E02**")
    st.markdown("---")
    col1, col2 = st.columns(2)
    with col1:
        st.markdown("**Domain Distribution**")
        for d in DOMAINS:
            count = sum(1 for q in QUESTIONS if q["domain"] == d)
            st.markdown(f"- {d} ({count}q)")
    with col2:
        st.markdown("**What's different from E01/E02**")
        st.markdown(
            "- ZERO repeated questions from E01 or E02\n"
            "- Same concepts, completely different angles\n"
            "- NEW: NOT NULL enforced but UNIQUE not (Q3)\n"
            "- NEW: MV cannot include UDFs (Q4)\n"
            "- NEW: SiS uses viewer's role (Q7)\n"
            "- NEW: Orphan role invisible to admins (Q11)\n"
            "- NEW: OBJECT_DEPENDENCIES vs ACCESS_HISTORY (Q12,Q17)\n"
            "- NEW: SKIP_FILE_5 threshold (Q24)\n"
            "- NEW: Snowpipe 14-day reverse trap (Q18)\n"
            "- NEW: PURGE+CONTINUE interaction (Q19)\n"
            "- NEW: Stream staleness GREATER not SUM (Q22)\n"
            "- NEW: APPROXIMATE_COUNT_DISTINCT + HLL (Q31)\n"
            "- NEW: VALIDATE vs VALIDATION_MODE distinction (Q35)\n"
            "- NEW: Public listing requires Snowflake approval (Q40)"
        )
    st.session_state.shuffle = st.checkbox("Shuffle question order", value=True)
    st.button("Start Exam", on_click=start_exam, type="primary", use_container_width=True)


def render_exam():
    total = len(QUESTIONS)
    cur = st.session_state.current_q
    qi = st.session_state.order[cur]
    q = QUESTIONS[qi]
    answered_count = len(st.session_state.answers)
    with st.sidebar:
        st.markdown(f"**Progress: {answered_count}/{total}**")
        st.progress(answered_count / total)
        flagged_count = len(st.session_state.flagged)
        if flagged_count:
            st.markdown(f"Flagged: {flagged_count}")
        st.markdown("---")
        st.markdown("**Navigator**")
        cols_per_row = 5
        for row_start in range(0, total, cols_per_row):
            cols = st.columns(cols_per_row)
            for j, col in enumerate(cols):
                idx = row_start + j
                if idx >= total:
                    break
                with col:
                    is_flagged = idx in st.session_state.flagged
                    btn_type = "primary" if idx == cur else "secondary"
                    prefix = "* " if is_flagged else ""
                    st.button(f"{prefix}{idx+1}", key=f"nav_{idx}", on_click=go_to, args=(idx,), type=btn_type, use_container_width=True)
        st.markdown("---")
        if answered_count == total:
            st.button("Submit Exam", on_click=submit_exam, type="primary", use_container_width=True)
        else:
            st.button("Submit Exam", on_click=submit_exam, use_container_width=True)
            st.caption(f"{total - answered_count} unanswered")
    color = DOMAIN_COLORS.get(q["domain"], "#888")
    st.markdown(f'<span class="domain-tag" style="background:{color}">{q["domain"]}</span>', unsafe_allow_html=True)
    st.markdown(f"### Question {cur + 1} of {total}")
    st.markdown(q["text"])
    if q["multi"]:
        st.caption("Select all that apply.")
        selected = st.session_state.answers.get(cur, set())
        new_selected = set()
        for key, val in q["options"].items():
            checked = key in selected
            if st.checkbox(f"**{key}.** {val}", value=checked, key=f"q{cur}_{key}"):
                new_selected.add(key)
        if new_selected:
            st.session_state.answers[cur] = new_selected
        elif cur in st.session_state.answers and not new_selected:
            del st.session_state.answers[cur]
    else:
        option_labels = [f"{k}. {v}" for k, v in q["options"].items()]
        option_keys = list(q["options"].keys())
        prev = st.session_state.answers.get(cur, set())
        prev_idx = 0
        if prev:
            prev_key = list(prev)[0]
            if prev_key in option_keys:
                prev_idx = option_keys.index(prev_key)
        choice = st.radio("Select your answer:", option_labels, index=prev_idx, key=f"radio_{cur}", label_visibility="collapsed")
        if choice:
            chosen_key = choice.split(".")[0].strip()
            st.session_state.answers[cur] = {chosen_key}
    is_flagged = cur in st.session_state.flagged
    col_flag, col_prev, col_next = st.columns([2, 1, 1])
    with col_flag:
        flag_label = "Unflag" if is_flagged else "Flag for Review"
        if st.button(flag_label, use_container_width=True):
            if is_flagged:
                st.session_state.flagged.discard(cur)
            else:
                st.session_state.flagged.add(cur)
            st.rerun()
    with col_prev:
        if cur > 0:
            st.button("Previous", on_click=go_to, args=(cur - 1,), use_container_width=True)
    with col_next:
        if cur < total - 1:
            st.button("Next", on_click=go_to, args=(cur + 1,), use_container_width=True, type="primary")


def render_results():
    total = len(QUESTIONS)
    correct = calc_score()
    pct = (correct / total) * 100
    domain_stats = calc_domain_scores()
    passed = pct >= 75
    st.title("S1-E03 Results")
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("Score", f"{correct}/{total}")
    with col2:
        st.metric("Percentage", f"{pct:.1f}%")
    with col3:
        if passed:
            st.metric("Status", "PASS", delta="75% target")
        else:
            st.metric("Status", "KEEP GOING", delta=f"{pct - 75:.1f}% from 75%", delta_color="inverse")
    st.markdown("---")
    st.subheader("Domain Breakdown")
    for domain in DOMAINS:
        stats = domain_stats[domain]
        if stats["total"] == 0:
            continue
        d_pct = (stats["correct"] / stats["total"]) * 100
        color = DOMAIN_COLORS.get(domain, "#888")
        col_name, col_bar, col_score = st.columns([2, 3, 1])
        with col_name:
            st.markdown(f'<span class="domain-tag" style="background:{color}">{domain}</span>', unsafe_allow_html=True)
        with col_bar:
            st.progress(stats["correct"] / stats["total"])
        with col_score:
            st.markdown(f"**{stats['correct']}/{stats['total']}** ({d_pct:.0f}%)")
    st.markdown("---")
    st.subheader("Question Review")
    filter_choice = st.radio("Show:", ["All Questions", "Incorrect Only", "Flagged Only"], horizontal=True)
    for i, qi in enumerate(st.session_state.order):
        q = QUESTIONS[qi]
        user_ans = st.session_state.answers.get(i, set())
        is_correct = user_ans == set(q["answer"])
        if filter_choice == "Incorrect Only" and is_correct:
            continue
        if filter_choice == "Flagged Only" and i not in st.session_state.flagged:
            continue
        flag_mark = " [FLAGGED]" if i in st.session_state.flagged else ""
        with st.expander(f"Q{i+1}. {q['text'][:80]}...  {'CORRECT' if is_correct else 'INCORRECT'}{flag_mark}"):
            st.markdown(q["text"])
            st.markdown("")
            for key, val in q["options"].items():
                is_answer = key in q["answer"]
                is_user = key in user_ans
                if is_answer and is_user:
                    st.markdown(f":green[**{key}. {val}**  (Your answer - Correct)]")
                elif is_answer and not is_user:
                    st.markdown(f":green[**{key}. {val}**  (Correct answer)]")
                elif not is_answer and is_user:
                    st.markdown(f":red[~~{key}. {val}~~  (Your answer)]")
                else:
                    st.markdown(f"{key}. {val}")
            st.markdown("")
            st.info(f"**Explanation:** {q['explanation']}")
    st.markdown("---")
    if st.button("Retake Exam", type="primary", use_container_width=True):
        st.session_state.started = False
        st.rerun()


if __name__ == "__main__":
    main()
