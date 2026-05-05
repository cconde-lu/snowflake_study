import streamlit as st
import random

QUESTIONS = [
    # ======================================================================
    # DOMAIN 1: ARCHITECTURE & FEATURES (10 questions)
    # All 10 FRESH angles not used in E01-E03
    # ======================================================================
    {
        "id": 1, "domain": "D1: Architecture", "multi": False,
        "text": "A COUNT(*) query on a 500-billion-row table returns instantly without consuming any warehouse credits. Which Snowflake component made this possible?",
        "options": {
            "A": "SSD cache on the compute nodes",
            "B": "Metadata cache in the Cloud Services layer",
            "C": "Result cache from a prior identical query",
            "D": "Search Optimization Service pre-computed the count",
        },
        "answer": ["B"],
        "explanation": "The metadata cache stores row counts, min/max, null counts, and distinct counts per micro-partition. COUNT(*) is resolved from metadata alone, requiring no warehouse. SSD cache requires a running warehouse. Result cache needs a prior identical query. SOS does not pre-compute counts.",
    },
    {
        "id": 2, "domain": "D1: Architecture", "multi": False,
        "text": "Your company uses Snowflake Standard Edition. The data team requests dynamic data masking on salary columns. What must happen first?",
        "options": {
            "A": "Create a masking policy and attach it to the column",
            "B": "Upgrade to Enterprise Edition or higher",
            "C": "Enable Tri-Secret Secure on the account",
            "D": "Grant the SECURITYADMIN role to the data team lead",
        },
        "answer": ["B"],
        "explanation": "Dynamic data masking requires Enterprise Edition or higher. Standard Edition does not support masking policies. Tri-Secret Secure is Business Critical+ and unrelated to masking. Granting SECURITYADMIN alone does not enable the feature.",
    },
    {
        "id": 3, "domain": "D1: Architecture", "multi": False,
        "text": "A developer writes a UDF that attempts to run ALTER TABLE inside it. What happens?",
        "options": {
            "A": "The ALTER TABLE executes successfully inside the UDF",
            "B": "The UDF compiles but the ALTER TABLE is silently skipped",
            "C": "The UDF fails because UDFs cannot execute DDL or DML statements",
            "D": "The UDF succeeds only if the caller has OWNERSHIP on the table",
        },
        "answer": ["C"],
        "explanation": "UDFs return scalar or tabular values and CANNOT execute DDL or DML. Only stored procedures (called with CALL) can execute DDL/DML. UDFs are used in expressions like SELECT or WHERE.",
    },
    {
        "id": 4, "domain": "D1: Architecture", "multi": True,
        "text": "Which TWO statements about Snowflake sequences are correct? (Select TWO).",
        "options": {
            "A": "Sequences guarantee gap-free, consecutive values",
            "B": "Sequences generate unique values but gaps are possible",
            "C": "Sequences guarantee values are returned in order across concurrent sessions",
            "D": "Sequences are NOT duplicated when a table referencing them is cloned",
            "E": "Sequences automatically reset to 1 when the referencing table is truncated",
        },
        "answer": ["B", "D"],
        "explanation": "Sequences generate unique values but are NOT gap-free and NOT ordered across sessions. When a table with a sequence default is cloned, both tables share the SAME original sequence (not duplicated). Sequences do not reset on TRUNCATE.",
    },
    {
        "id": 5, "domain": "D1: Architecture", "multi": False,
        "text": "A team needs to run complex JOINs that auto-refresh on a schedule without manual SQL execution. Materialized views cannot be used. Which object fits?",
        "options": {
            "A": "Standard view with a scheduled task",
            "B": "Dynamic table with a TARGET_LAG",
            "C": "Temporary table refreshed by a stream",
            "D": "External table with AUTO_REFRESH",
        },
        "answer": ["B"],
        "explanation": "Dynamic tables support JOINs (unlike MVs which are single-table only) and auto-refresh based on TARGET_LAG. No manual SQL needed. Standard views don't store data. External tables point to external files.",
    },
    {
        "id": 6, "domain": "D1: Architecture", "multi": False,
        "text": "An analyst runs the same SELECT query twice within 10 minutes. The underlying table had no DML between runs. The second query returns in milliseconds with zero warehouse credit usage. What served the result?",
        "options": {
            "A": "The SSD cache on the warehouse nodes",
            "B": "The metadata cache in Cloud Services",
            "C": "The result cache in the Cloud Services layer",
            "D": "The query was optimized away by the query planner",
        },
        "answer": ["C"],
        "explanation": "Result cache serves identical query results for 24 hours (no DML changes, same role, same query text). It lives in Cloud Services and requires no warehouse. SSD cache still needs a running warehouse. Metadata cache only answers specific metadata queries like COUNT(*).",
    },
    {
        "id": 7, "domain": "D1: Architecture", "multi": False,
        "text": "Which Snowflake tool would you use to diagnose DNS resolution and TLS certificate issues between your network and Snowflake?",
        "options": {
            "A": "SnowSQL",
            "B": "SnowCD",
            "C": "Snowflake CLI (snow)",
            "D": "SQL API",
        },
        "answer": ["B"],
        "explanation": "SnowCD is the connectivity diagnostics tool for DNS, TLS, and OCSP checks. It does NOT execute queries. SnowSQL is a CLI for SQL. Snowflake CLI manages objects. SQL API is REST-based SQL execution.",
    },
    {
        "id": 8, "domain": "D1: Architecture", "multi": True,
        "text": "Which TWO objects are automatically created for every user without any explicit CREATE statement? (Select TWO).",
        "options": {
            "A": "User stage (@~)",
            "B": "Default warehouse",
            "C": "Table stage (@%table_name) for each table the user creates",
            "D": "Default database",
            "E": "Personal schema",
        },
        "answer": ["A", "C"],
        "explanation": "User stages (@~) are auto-created per user. Table stages (@%table_name) are auto-created per table. Warehouses, databases, and schemas must be explicitly created or assigned.",
    },
    {
        "id": 9, "domain": "D1: Architecture", "multi": False,
        "text": "A Streamlit app deployed in Snowflake is running slowly. Where does the app's compute actually execute?",
        "options": {
            "A": "On the end user's browser",
            "B": "On Snowflake-managed compute within the account",
            "C": "On the developer's local machine",
            "D": "On a dedicated external cloud VM",
        },
        "answer": ["B"],
        "explanation": "Streamlit in Snowflake runs on Snowflake-managed compute inside the account, not on the client's browser or local machine. The browser only renders the UI.",
    },
    {
        "id": 10, "domain": "D1: Architecture", "multi": False,
        "text": "A session parameter is set at three levels: account=10, session=20, object=30. What value does the session use?",
        "options": {
            "A": "10 (account level always wins)",
            "B": "20 (session level applies to sessions)",
            "C": "30 (most specific level wins)",
            "D": "The average of all three values",
        },
        "answer": ["C"],
        "explanation": "Parameter hierarchy: Object > Session > Account. The most specific level wins. Object-level (30) overrides session (20) which overrides account (10).",
    },
    # ======================================================================
    # DOMAIN 2: ACCOUNT ACCESS & SECURITY (7 questions)
    # Reinforces SHOW GRANTS (E03 miss) + 6 fresh angles
    # ======================================================================
    {
        "id": 11, "domain": "D2: Security", "multi": True,
        "text": "An auditor asks: 'Show me every privilege the ANALYST role has, and also show me which users and roles have been granted the ANALYST role.' Which TWO commands provide this information? (Select TWO).",
        "options": {
            "A": "SHOW GRANTS TO ROLE ANALYST",
            "B": "SHOW GRANTS OF ROLE ANALYST",
            "C": "SHOW GRANTS FOR USER analyst_user",
            "D": "SHOW GRANTS ON ROLE ANALYST",
            "E": "SHOW GRANTS BY ROLE ANALYST",
        },
        "answer": ["A", "B"],
        "explanation": "SHOW GRANTS TO ROLE = what privileges the role holds. SHOW GRANTS OF ROLE = who (users/roles) has been granted this role. FOR USER and BY ROLE are invalid syntax. ON ROLE shows grants on the role object itself, not what the role can do.",
    },
    {
        "id": 12, "domain": "D2: Security", "multi": False,
        "text": "A network policy has ALLOWED_IP_LIST = '10.0.0.0/24' and BLOCKED_IP_LIST = '10.0.0.50'. A connection comes from 10.0.0.50. What happens?",
        "options": {
            "A": "Connection succeeds because ALLOWED takes precedence",
            "B": "Connection is denied because BLOCKED takes precedence over ALLOWED",
            "C": "Connection succeeds because user-level overrides account-level",
            "D": "An error is thrown due to conflicting rules",
        },
        "answer": ["B"],
        "explanation": "BLOCKED_IP_LIST takes precedence over ALLOWED_IP_LIST. Even though 10.0.0.50 is within the allowed range, the explicit block denies the connection. No error is thrown; it's a silent deny.",
    },
    {
        "id": 13, "domain": "D2: Security", "multi": False,
        "text": "A junior DBA creates a custom role called ETL_ROLE but does not grant it to any system role. Which problem does this cause?",
        "options": {
            "A": "The role cannot be used by any user",
            "B": "ACCOUNTADMIN cannot see objects created by ETL_ROLE",
            "C": "The role is automatically dropped after 24 hours",
            "D": "The role inherits all privileges from PUBLIC",
        },
        "answer": ["B"],
        "explanation": "Best practice: grant custom roles to SYSADMIN so ACCOUNTADMIN (which inherits SYSADMIN) can see all objects. Without this grant, objects created by ETL_ROLE become 'orphaned' from the admin hierarchy. The role still works, but admins lose visibility.",
    },
    {
        "id": 14, "domain": "D2: Security", "multi": False,
        "text": "A resource monitor is configured to track credits on three warehouses. When does it trigger a SUSPEND action?",
        "options": {
            "A": "When ANY one of the three warehouses exceeds its individual credit threshold",
            "B": "When the COMBINED credit usage across all three warehouses reaches the threshold",
            "C": "Only when all three warehouses simultaneously exceed the threshold",
            "D": "Resource monitors cannot track multiple warehouses",
        },
        "answer": ["B"],
        "explanation": "A resource monitor tracks the aggregate (combined) credit usage across all assigned warehouses. The threshold applies to the total, not per-warehouse. A single warehouse consuming all credits can trigger it.",
    },
    {
        "id": 15, "domain": "D2: Security", "multi": False,
        "text": "Which authentication method should a Kafka connector use to authenticate with Snowflake for streaming data ingestion?",
        "options": {
            "A": "Username and password",
            "B": "SAML 2.0 SSO",
            "C": "Key-pair authentication (RSA)",
            "D": "Multi-factor authentication (MFA)",
        },
        "answer": ["C"],
        "explanation": "Key-pair (RSA) authentication is recommended for programmatic connectors like Kafka, JDBC drivers, and SnowSQL. SSO and MFA are for interactive/browser login. Username/password is less secure for automation.",
    },
    {
        "id": 16, "domain": "D2: Security", "multi": False,
        "text": "A tag called PII_LEVEL is attached to 200 columns across the account. No masking policy is attached to the tag. What protection does the tag provide?",
        "options": {
            "A": "The tagged columns are automatically masked for non-admin roles",
            "B": "The tag provides metadata classification only, no data protection",
            "C": "The tag blocks SELECT queries on those columns",
            "D": "The tag encrypts the column values with a tag-specific key",
        },
        "answer": ["B"],
        "explanation": "Tags are metadata labels ONLY. They do NOT enforce any protection by themselves. You must attach a masking policy to a tag (tag-based masking) for enforcement. Without a policy, tags are just documentation.",
    },
    {
        "id": 17, "domain": "D2: Security", "multi": True,
        "text": "Which TWO views from SNOWFLAKE.ACCOUNT_USAGE would you query to find both who ran queries yesterday and what data they accessed at the column level? (Select TWO).",
        "options": {
            "A": "QUERY_HISTORY",
            "B": "ACCESS_HISTORY",
            "C": "OBJECT_DEPENDENCIES",
            "D": "LOGIN_HISTORY",
            "E": "WAREHOUSE_METERING_HISTORY",
        },
        "answer": ["A", "B"],
        "explanation": "QUERY_HISTORY shows who ran queries (user, query text, duration). ACCESS_HISTORY tracks column-level data access (which columns were read/modified). OBJECT_DEPENDENCIES shows object-to-object references, not user access. LOGIN_HISTORY is auth events only.",
    },
    # ======================================================================
    # DOMAIN 3: DATA LOADING & UNLOADING (9 questions)
    # Reinforces TRUNCATECOLUMNS (E03 miss) + 8 fresh angles
    # ======================================================================
    {
        "id": 18, "domain": "D3: Loading", "multi": False,
        "text": "A COPY INTO command fails with 'String too long for column VARCHAR(50)'. The team wants to load the data anyway, truncating oversized values rather than failing. Which parameter fixes this?",
        "options": {
            "A": "ON_ERROR = CONTINUE",
            "B": "TRUNCATECOLUMNS = TRUE",
            "C": "FORCE = TRUE",
            "D": "ERROR_ON_COLUMN_COUNT_MISMATCH = FALSE",
        },
        "answer": ["B"],
        "explanation": "TRUNCATECOLUMNS = TRUE truncates strings that exceed the target column length instead of erroring. ON_ERROR = CONTINUE skips bad rows (doesn't fix them). FORCE reloads already-loaded files. ERROR_ON_COLUMN_COUNT_MISMATCH handles column count differences, not string length.",
    },
    {
        "id": 19, "domain": "D3: Loading", "multi": False,
        "text": "A bulk COPY INTO loaded files 60 days ago. Running the same COPY INTO again today skips those files. Running it 70 days later, the same files load again as new. Why?",
        "options": {
            "A": "Snowflake purged the files from the stage after 60 days",
            "B": "Bulk COPY metadata expires after 64 days, so files appear new",
            "C": "The warehouse cache was cleared after 60 days",
            "D": "The FORCE parameter was automatically enabled after timeout",
        },
        "answer": ["B"],
        "explanation": "Bulk COPY INTO metadata (which tracks loaded files for deduplication) expires after 64 days. After that, files are treated as new and loaded again. Snowpipe metadata lasts 14 days. This is not related to stage cleanup or cache.",
    },
    {
        "id": 20, "domain": "D3: Loading", "multi": False,
        "text": "A Snowpipe job encounters corrupt rows in a file. What is the DEFAULT behavior?",
        "options": {
            "A": "The entire load job aborts",
            "B": "The entire file is skipped",
            "C": "Only the corrupt rows are skipped, valid rows are loaded",
            "D": "The file is moved to a quarantine stage",
        },
        "answer": ["B"],
        "explanation": "Snowpipe default ON_ERROR = SKIP_FILE. The entire file with errors is skipped. Bulk COPY default is ABORT_STATEMENT. CONTINUE would skip only bad rows. There is no automatic quarantine stage.",
    },
    {
        "id": 21, "domain": "D3: Loading", "multi": False,
        "text": "You need to load a JSON file where each element is nested inside an outer array [ ]. Without any special option, Snowflake loads the entire array as one row. Which file format option fixes this?",
        "options": {
            "A": "STRIP_NULL_VALUES = TRUE",
            "B": "STRIP_OUTER_ARRAY = TRUE",
            "C": "MATCH_BY_COLUMN_NAME = CASE_INSENSITIVE",
            "D": "PARSE_HEADER = TRUE",
        },
        "answer": ["B"],
        "explanation": "STRIP_OUTER_ARRAY = TRUE removes the outer [ ] from JSON, loading each array element as a separate row. STRIP_NULL_VALUES converts JSON null to SQL NULL. MATCH_BY_COLUMN_NAME and PARSE_HEADER are for CSV-like matching.",
    },
    {
        "id": 22, "domain": "D3: Loading", "multi": True,
        "text": "Which TWO COPY INTO parameters would you combine to load files matching a naming pattern AND automatically delete them from the stage after successful loading? (Select TWO).",
        "options": {
            "A": "PATTERN = '.*sales.*[.]csv'",
            "B": "FILES = ('sales_jan.csv', 'sales_feb.csv')",
            "C": "PURGE = TRUE",
            "D": "FORCE = TRUE",
            "E": "VALIDATION_MODE = 'RETURN_ALL_ERRORS'",
        },
        "answer": ["A", "C"],
        "explanation": "PATTERN filters files by regex. PURGE = TRUE deletes successfully loaded files from the stage. FILES specifies exact names (not a pattern). FORCE reloads already-loaded files. VALIDATION_MODE is dry-run only (no loading).",
    },
    {
        "id": 23, "domain": "D3: Loading", "multi": False,
        "text": "A data engineer needs to track the source filename for each row loaded into a table. Which approach works during COPY INTO with a SELECT transform?",
        "options": {
            "A": "Use CURRENT_FILENAME() system function",
            "B": "Use the METADATA$FILENAME pseudo-column in the SELECT",
            "C": "Enable FILE_TRACKING = TRUE on the stage",
            "D": "Query COPY_HISTORY after loading to join filenames",
        },
        "answer": ["B"],
        "explanation": "METADATA$FILENAME is a pseudo-column available during COPY INTO with SELECT transforms. It returns the source filename for each row. CURRENT_FILENAME() and FILE_TRACKING do not exist. COPY_HISTORY shows file-level info, not row-level.",
    },
    {
        "id": 24, "domain": "D3: Loading", "multi": False,
        "text": "A stream on TABLE_A has not been consumed for 30 days. The table has DATA_RETENTION_TIME_IN_DAYS=1 and MAX_DATA_EXTENSION_TIME_IN_DAYS=14. What is the stream's status?",
        "options": {
            "A": "Active, because 30 days is within the default extension",
            "B": "Stale, because 30 days exceeds the greater of retention (1) and extension (14)",
            "C": "Active, because streams never go stale on permanent tables",
            "D": "Stale, because 30 days exceeds DATA_RETENTION_TIME_IN_DAYS (1 day)",
        },
        "answer": ["B"],
        "explanation": "Stream staleness threshold = GREATER of (DATA_RETENTION_TIME, MAX_DATA_EXTENSION_TIME) = MAX(1, 14) = 14 days. 30 days > 14 days, so the stream is stale. Must DROP and RECREATE. Cannot be refreshed with ALTER.",
    },
    {
        "id": 25, "domain": "D3: Loading", "multi": False,
        "text": "A task DAG has a root task and three child tasks. The developer tries to add a SCHEDULE clause to one of the child tasks. What happens?",
        "options": {
            "A": "The child task runs on its own schedule independently",
            "B": "The command fails because only the root task can have a SCHEDULE",
            "C": "The child task's schedule overrides the root task's schedule",
            "D": "Both schedules run, creating parallel execution paths",
        },
        "answer": ["B"],
        "explanation": "In a task DAG, only the root task has a SCHEDULE. Child tasks are triggered by their predecessors completing. Adding a SCHEDULE to a child task is not allowed.",
    },
    {
        "id": 26, "domain": "D3: Loading", "multi": True,
        "text": "Which TWO statements about Snowpipe Streaming (via the Ingest SDK) are true? (Select TWO).",
        "options": {
            "A": "Rows are inserted directly without staging files first",
            "B": "It uses the same cloud event notifications as regular Snowpipe",
            "C": "It provides lower latency than file-based Snowpipe",
            "D": "It requires a user-managed warehouse for processing",
            "E": "Rows are immediately written as micro-partitions",
        },
        "answer": ["A", "C"],
        "explanation": "Snowpipe Streaming inserts rows directly (no file staging) with lower latency than file-based Snowpipe. Rows go to internal buffers first, then asynchronously migrated to micro-partitions (not immediately). It does not use cloud events and is serverless.",
    },
    # ======================================================================
    # DOMAIN 4: PERFORMANCE & TRANSFORMATION (9 questions)
    # Reinforces HLL/approximate functions (E03 miss) + 8 fresh angles
    # ======================================================================
    {
        "id": 27, "domain": "D4: Performance", "multi": True,
        "text": "Which TWO functions return approximate cardinality estimates using the HyperLogLog algorithm? (Select TWO).",
        "options": {
            "A": "HLL()",
            "B": "APPROX_COUNT_DISTINCT()",
            "C": "COUNT(DISTINCT col)",
            "D": "HASH_AGG()",
            "E": "CHECKSUM_AGG()",
        },
        "answer": ["A", "B"],
        "explanation": "HLL() is an alias for APPROX_COUNT_DISTINCT(). Both use the HyperLogLog algorithm for fast approximate cardinality estimation with a small error margin. COUNT(DISTINCT) is exact. HASH_AGG() and CHECKSUM_AGG() compute hash-based aggregates, not cardinality estimates.",
    },
    {
        "id": 28, "domain": "D4: Performance", "multi": False,
        "text": "A table has a clustering key on (region, order_date). A query filters WHERE order_date = '2026-01-15' but does NOT filter on region. How effective is partition pruning?",
        "options": {
            "A": "Highly effective because order_date is in the clustering key",
            "B": "Partially effective, but less optimal than if region were also filtered",
            "C": "Not effective at all because the first clustering column is not filtered",
            "D": "Pruning only works if all clustering columns are in the WHERE clause",
        },
        "answer": ["B"],
        "explanation": "Pruning is partially effective because order_date metadata exists in micro-partitions, but since region (the first/lower-cardinality column) is not filtered, the pruning is less precise than filtering on both columns. It's not completely ineffective.",
    },
    {
        "id": 29, "domain": "D4: Performance", "multi": False,
        "text": "A warehouse processes a single complex analytical query that spills heavily to remote storage but there is NO queuing. What is the best fix?",
        "options": {
            "A": "Enable multi-cluster with STANDARD scaling",
            "B": "Scale UP to a larger warehouse size",
            "C": "Enable Query Acceleration Service",
            "D": "Add a clustering key to the queried table",
        },
        "answer": ["B"],
        "explanation": "Single complex query + spilling + no queuing = needs more memory/compute per node = scale UP. Multi-cluster addresses concurrency/queuing, not single-query memory. QAS helps outlier queries but scaling up directly addresses spilling.",
    },
    {
        "id": 30, "domain": "D4: Performance", "multi": False,
        "text": "SYSTEM$CLUSTERING_INFORMATION returns an average_depth of 15 for a table. What does this indicate?",
        "options": {
            "A": "The table is well-clustered (depth near 1 is ideal)",
            "B": "The table is poorly clustered and would benefit from reclustering",
            "C": "The table has 15 micro-partitions",
            "D": "The clustering key has 15 columns",
        },
        "answer": ["B"],
        "explanation": "Clustering depth near 1.0 is ideal (well-clustered). A depth of 15 means significant overlap between micro-partitions, causing poor pruning. The table would benefit from adding or adjusting a clustering key. Depth is not the partition count or column count.",
    },
    {
        "id": 31, "domain": "D4: Performance", "multi": False,
        "text": "A dashboard query runs repeatedly every 5 minutes by 200 concurrent BI users. The underlying data changes hourly via ETL. Which optimization MOST reduces warehouse cost?",
        "options": {
            "A": "Create a materialized view on the query",
            "B": "Increase the warehouse size to handle 200 users",
            "C": "Rely on the result cache since the query is identical and data hasn't changed",
            "D": "Create a clustering key on the dashboard filter columns",
        },
        "answer": ["C"],
        "explanation": "Result cache serves identical queries for up to 24 hours with zero warehouse credits when data hasn't changed. With hourly ETL, the cache is valid between refreshes. 200 users running the same query = massive cost savings from cache. MV adds serverless cost. Scaling up costs more.",
    },
    {
        "id": 32, "domain": "D4: Performance", "multi": False,
        "text": "A table stores a UUID column (billions of unique values). Point lookups on UUID are slow despite a clustering key on another column. Which optimization targets this specific problem?",
        "options": {
            "A": "Add UUID as the first column in the clustering key",
            "B": "Enable Search Optimization Service on the UUID column",
            "C": "Enable Query Acceleration Service",
            "D": "Create a materialized view filtered on UUID",
        },
        "answer": ["B"],
        "explanation": "Search Optimization Service (SOS) creates search access paths optimized for equality/IN lookups on HIGH cardinality columns like UUIDs. Clustering is for low-medium cardinality range filters. QAS handles outlier queries. MVs don't optimize point lookups.",
    },
    {
        "id": 33, "domain": "D4: Performance", "multi": True,
        "text": "Which TWO statements about the FLATTEN function are correct? (Select TWO).",
        "options": {
            "A": "FLATTEN converts a VARIANT array into rows (one row per element)",
            "B": "FLATTEN can only be used on ARRAY types, not OBJECT types",
            "C": "FLATTEN is used with LATERAL in the FROM clause",
            "D": "FLATTEN modifies the original table data in place",
            "E": "FLATTEN requires Enterprise Edition or higher",
        },
        "answer": ["A", "C"],
        "explanation": "FLATTEN explodes arrays/objects into rows and is used with LATERAL JOIN in the FROM clause. It works on both ARRAY and OBJECT types. It does not modify data (it's a table function). Available on all editions.",
    },
    {
        "id": 34, "domain": "D4: Performance", "multi": False,
        "text": "An analyst runs SELECT * FROM large_table WHERE region IN ('US', 'EU', 'APAC'). The table has no clustering key. Query Profile shows 95% of partitions scanned. The region column has 5 distinct values. Best optimization?",
        "options": {
            "A": "Enable Search Optimization Service on the region column",
            "B": "Add a clustering key with region as the first column",
            "C": "Scale up the warehouse to XL",
            "D": "Rewrite the query to use UNION ALL instead of IN",
        },
        "answer": ["B"],
        "explanation": "Region has 5 distinct values (very low cardinality) and is used in WHERE filters = ideal clustering key candidate. SOS is for high cardinality equality lookups. Scaling up doesn't reduce partitions scanned. UNION ALL doesn't improve pruning.",
    },
    {
        "id": 35, "domain": "D4: Performance", "multi": False,
        "text": "Which Snowflake function converts semi-structured JSON keys and values from a single row into a relational column format (key, value, path)?",
        "options": {
            "A": "PARSE_JSON()",
            "B": "OBJECT_CONSTRUCT()",
            "C": "FLATTEN()",
            "D": "TRY_PARSE_JSON()",
        },
        "answer": ["C"],
        "explanation": "FLATTEN with RECURSIVE => TRUE on an OBJECT produces rows with KEY, VALUE, PATH columns from nested JSON. PARSE_JSON converts a string to VARIANT. OBJECT_CONSTRUCT builds JSON from relational columns (the reverse). TRY_PARSE_JSON is a safe parse variant.",
    },
    # ======================================================================
    # DOMAIN 5: DATA COLLABORATION & SHARING (5 questions)
    # All 5 FRESH angles not used in E01-E03
    # ======================================================================
    {
        "id": 36, "domain": "D5: Sharing", "multi": False,
        "text": "A consumer creates a database from a share and attempts to run INSERT INTO on a shared table. What happens?",
        "options": {
            "A": "The INSERT succeeds and data is stored in the consumer's account",
            "B": "The INSERT fails because shared objects are read-only",
            "C": "The INSERT succeeds but changes are visible only to the consumer",
            "D": "The INSERT is queued until the provider approves it",
        },
        "answer": ["B"],
        "explanation": "Shared data is READ-ONLY. Consumers cannot INSERT, UPDATE, DELETE, MERGE, or CLONE shared objects. To get a writable copy, the consumer must CREATE TABLE AS SELECT from the shared object.",
    },
    {
        "id": 37, "domain": "D5: Sharing", "multi": False,
        "text": "A provider shares data with a consumer via a direct share. The provider then drops a table included in the share. What does the consumer experience?",
        "options": {
            "A": "The table remains available from a cached copy",
            "B": "The consumer's entire shared database is dropped automatically",
            "C": "The table becomes immediately inaccessible to the consumer",
            "D": "The consumer gets a notification but can still query for 24 hours",
        },
        "answer": ["C"],
        "explanation": "When a provider drops a shared table, it becomes immediately inaccessible to consumers. There is no cached copy, grace period, or notification. The consumer's database shell remains but the object is gone.",
    },
    {
        "id": 38, "domain": "D5: Sharing", "multi": True,
        "text": "Which TWO capabilities does a Reader Account have that might surprise someone given its name? (Select TWO).",
        "options": {
            "A": "Create and manage virtual warehouses",
            "B": "Create shares to share data with other accounts",
            "C": "Create databases, schemas, and tables",
            "D": "Access the Snowflake Marketplace",
            "E": "Create storage integrations for external stages",
        },
        "answer": ["A", "C"],
        "explanation": "Despite the name 'Reader', these accounts CAN create warehouses, databases, schemas, tables, views, users, and roles. They CANNOT create shares, access Marketplace, or create pipes/stages. The provider pays for all compute.",
    },
    {
        "id": 39, "domain": "D5: Sharing", "multi": False,
        "text": "A company needs to share data with a partner in a DIFFERENT cloud region. Direct shares do not work cross-region. What Snowflake feature enables this?",
        "options": {
            "A": "Replication groups with manual refresh",
            "B": "Listings with Auto-Fulfillment",
            "C": "Database cloning across accounts",
            "D": "External tables pointing to the partner's bucket",
        },
        "answer": ["B"],
        "explanation": "Direct shares are same-region only. Listings with Auto-Fulfillment replicate data cross-region (and cross-cloud) automatically. Replication groups are for DR/failover. Cloning is within an account. External tables point to files, not cross-account sharing.",
    },
    {
        "id": 40, "domain": "D5: Sharing", "multi": False,
        "text": "A permanent table has DATA_RETENTION_TIME_IN_DAYS = 10 and the default 7-day fail-safe. What is the total data protection window?",
        "options": {
            "A": "10 days",
            "B": "7 days",
            "C": "17 days",
            "D": "3 days",
        },
        "answer": ["C"],
        "explanation": "Total data protection = Time Travel + Fail-safe. 10 days (Time Travel) + 7 days (Fail-safe) = 17 days. Time Travel is user-accessible (UNDROP, AT/BEFORE). Fail-safe is Snowflake Support only.",
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
    st.set_page_config(page_title="S1-E04", page_icon="4", layout="wide")
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
    st.title("COF-C03 Season 1, Exam 04")
    st.markdown("**40 Questions | 70%+ Fresh Angles | Max 30% Concept Overlap**")
    st.markdown("---")
    col1, col2 = st.columns(2)
    with col1:
        st.markdown("**Domain Distribution**")
        for d in DOMAINS:
            count = sum(1 for q in QUESTIONS if q["domain"] == d)
            st.markdown(f"- {d} ({count}q)")
    with col2:
        st.markdown("**Focus Areas (from E03 misses)**")
        st.markdown(
            "- SHOW GRANTS valid variants (ON, TO ROLE, OF ROLE)\n"
            "- TRUNCATECOLUMNS for oversized strings\n"
            "- HLL() = APPROX_COUNT_DISTINCT() alias\n"
            "- 70%+ brand-new question angles\n"
            "- Debug/reverse/edge-case framings"
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
    st.title("Season 1, Exam 04 - Results")
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
    st.subheader("Domain Breakdown (use this to update PERFORMANCE_TRACKER.md)")
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
