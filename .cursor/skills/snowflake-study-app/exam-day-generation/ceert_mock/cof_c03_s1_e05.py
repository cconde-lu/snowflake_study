import streamlit as st
import random

QUESTIONS = [
    # ======================================================================
    # DOMAIN 1: ARCHITECTURE & FEATURES (9 questions)
    # NEW: Credit calc, 60s billing, temp tables, MCW edition, DT TARGET_LAG,
    #      MV auto-rewrite, CS 10% billing, DT chaining, DT vs MV
    # ======================================================================
    {
        "id": 1, "domain": "D1: Architecture", "multi": False,
        "text": "A data engineer needs to calculate the hourly credit cost of running a LARGE warehouse continuously for 3 hours. Given that each size increase doubles the credits, and an X-Small warehouse costs 1 credit/hour, how many total credits will the LARGE warehouse consume?",
        "options": {
            "A": "24 credits",
            "B": "16 credits",
            "C": "12 credits",
            "D": "32 credits",
        },
        "answer": ["A"],
        "explanation": "X-Small=1, Small=2, Medium=4, Large=8 credits/hour. 8 credits/hour x 3 hours = 24 credits total.",
    },
    {
        "id": 2, "domain": "D1: Architecture", "multi": False,
        "text": "A warehouse is started, runs one query for 45 seconds, and is then suspended. How many seconds of compute are billed?",
        "options": {
            "A": "120 seconds",
            "B": "60 seconds",
            "C": "45 seconds",
            "D": "0 seconds — the warehouse was suspended before 1 minute",
        },
        "answer": ["B"],
        "explanation": "Snowflake bills per-second with a 60-second minimum each time a warehouse starts. Since 45 seconds < 60 seconds, the minimum of 60 seconds applies.",
    },
    {
        "id": 3, "domain": "D1: Architecture", "multi": False,
        "text": "Which Snowflake table type persists only for the duration of the user session and is automatically dropped when the session ends?",
        "options": {
            "A": "Transient table",
            "B": "External table",
            "C": "Permanent table",
            "D": "Temporary table",
        },
        "answer": ["D"],
        "explanation": "Temporary tables exist only within the session that created them and are automatically dropped when the session ends. Transient tables persist across sessions but have no Fail-safe. Permanent tables have full data protection.",
    },
    {
        "id": 4, "domain": "D1: Architecture", "multi": False,
        "text": "Which Snowflake edition is the MINIMUM required to enable multi-cluster warehouses?",
        "options": {
            "A": "Multi-cluster warehouses are available in all editions",
            "B": "Standard",
            "C": "Enterprise",
            "D": "Virtual Private Snowflake",
        },
        "answer": ["C"],
        "explanation": "Multi-cluster warehouses are an Enterprise Edition feature. Standard Edition only supports single-cluster warehouses.",
    },
    {
        "id": 5, "domain": "D1: Architecture", "multi": False,
        "text": "A Dynamic Table is defined with TARGET_LAG = '5 minutes' and references a base table. Which statement best describes how it stays current?",
        "options": {
            "A": "An automated refresh process incrementally updates it to stay within the specified lag",
            "B": "It uses a stream behind the scenes to capture changes and a task to apply them",
            "C": "It re-executes the full query every 5 minutes regardless of changes",
            "D": "It relies on the result cache to serve stale data until 5 minutes elapse",
        },
        "answer": ["A"],
        "explanation": "Dynamic tables use an automated refresh process that determines the schedule to keep data within the target lag. It uses incremental processing when possible, only processing changed data rather than recomputing the entire table.",
    },
    {
        "id": 6, "domain": "D1: Architecture", "multi": False,
        "text": "A Materialized View is created on a single base table. A user queries the base table directly. How does Snowflake handle this?",
        "options": {
            "A": "Snowflake always forces the query to read from the MV instead",
            "B": "The query fails because the MV must be queried directly",
            "C": "The query optimizer may automatically rewrite the query to use the MV if beneficial",
            "D": "The MV is only used if explicitly referenced in the FROM clause",
        },
        "answer": ["C"],
        "explanation": "Unlike dynamic tables, the query optimizer can automatically rewrite queries against the base table to use a materialized view when it determines the MV can satisfy the query more efficiently. This is transparent to the user.",
    },
    {
        "id": 7, "domain": "D1: Architecture", "multi": False,
        "text": "Cloud services usage is billed to your account. Under what condition is cloud services consumption waived?",
        "options": {
            "A": "When total monthly cloud services credits are under 100",
            "B": "Cloud services are always free",
            "C": "When the account is on Enterprise Edition or higher",
            "D": "When daily cloud services usage is less than 10% of daily warehouse usage",
        },
        "answer": ["D"],
        "explanation": "Cloud services are charged only when daily consumption exceeds 10% of the daily virtual warehouse credit usage. If cloud services stay under 10%, they are adjusted (waived) on that day's billing.",
    },
    {
        "id": 8, "domain": "D1: Architecture", "multi": False,
        "text": "A team wants to build a multi-table transformation pipeline declaratively, where each stage materializes results and automatically refreshes. Which Snowflake object is best suited for this?",
        "options": {
            "A": "Dynamic tables chained together",
            "B": "A series of secure views",
            "C": "Materialized views chained together",
            "D": "External tables with auto-refresh",
        },
        "answer": ["A"],
        "explanation": "Dynamic tables support complex queries including joins and can be chained into multi-level pipelines. Materialized views only support a single base table and cannot be based on complex queries with joins.",
    },
    {
        "id": 9, "domain": "D1: Architecture", "multi": False,
        "text": "What is a key difference between a Dynamic Table and a Materialized View?",
        "options": {
            "A": "Dynamic tables cannot use joins; materialized views can",
            "B": "Materialized views are always fresher than dynamic tables",
            "C": "Dynamic tables support complex queries with joins; materialized views support only a single base table",
            "D": "Materialized views require manual scheduling; dynamic tables do not",
        },
        "answer": ["C"],
        "explanation": "Dynamic tables can be based on complex queries with joins and unions. Materialized views are limited to a single base table without joins. However, MV data is always current, while DT data freshness depends on target lag.",
    },
    # ======================================================================
    # DOMAIN 2: ACCOUNT ACCESS & SECURITY (7 questions)
    # NEW: USERADMIN, managed access schemas, masking inheritance, acct vs WH
    #      resource monitors, ACCOUNTADMIN hierarchy
    # REPEAT: SHOW GRANTS OF (E03 miss), SUSPEND vs SUSPEND_IMMEDIATE (E04 miss)
    # ======================================================================
    {
        "id": 10, "domain": "D2: Security", "multi": False,
        "text": "What is the purpose of the USERADMIN system role in Snowflake?",
        "options": {
            "A": "Creating and managing warehouses and databases",
            "B": "Managing account-level settings like billing and resource monitors",
            "C": "Creating users and roles, and granting roles to users",
            "D": "Granting privileges on all objects and managing the role hierarchy",
        },
        "answer": ["C"],
        "explanation": "USERADMIN is designed for creating and managing users and roles. SYSADMIN creates warehouses/databases. ACCOUNTADMIN handles account-level settings. SECURITYADMIN manages the full role hierarchy and grants.",
    },
    {
        "id": 11, "domain": "D2: Security", "multi": False,
        "text": "A managed access schema has been created. Who can grant privileges on objects within that schema?",
        "options": {
            "A": "Only the schema owner or a role with MANAGE GRANTS",
            "B": "Any role with OWNERSHIP on the individual objects",
            "C": "Only ACCOUNTADMIN",
            "D": "Any role with the USAGE privilege on the schema",
        },
        "answer": ["A"],
        "explanation": "In a managed access schema, only the schema owner (the role with OWNERSHIP on the schema) or a role with MANAGE GRANTS can grant or revoke privileges on objects. Individual object owners cannot grant privileges themselves.",
    },
    {
        "id": 12, "domain": "D2: Security", "multi": False,
        "text": "A resource monitor is set with SUSPEND at 80% and SUSPEND_IMMEDIATE at 100%. The combined usage of its assigned warehouses reaches 80%. What happens to currently running queries?",
        "options": {
            "A": "All running queries are immediately terminated",
            "B": "The warehouse is dropped from the account",
            "C": "Running queries complete, but no new queries can start on the warehouses",
            "D": "Nothing happens until 100% is reached",
        },
        "answer": ["C"],
        "explanation": "SUSPEND at 80% allows running queries to finish but prevents new queries. SUSPEND_IMMEDIATE at 100% kills running queries immediately. The two thresholds serve different purposes — graceful vs. hard stop.",
    },
    {
        "id": 13, "domain": "D2: Security", "multi": False,
        "text": "A security admin uses SHOW GRANTS OF ROLE ANALYST. What information is returned?",
        "options": {
            "A": "All roles and users that the ANALYST role has been granted TO (the role hierarchy above)",
            "B": "All privileges granted TO the ANALYST role",
            "C": "All objects owned by the ANALYST role",
            "D": "All users who currently have ANALYST as their active role",
        },
        "answer": ["A"],
        "explanation": "OF ROLE shows which roles and users the specified role has been granted to. TO ROLE shows privileges granted to the role. ON ROLE shows who has been granted the role itself. These three variants serve different purposes.",
    },
    {
        "id": 14, "domain": "D2: Security", "multi": False,
        "text": "A masking policy is applied to a column on the base table. A view is created on that table without its own masking policy. When a user queries the view, does the base table's masking policy apply?",
        "options": {
            "A": "No — views are independent and bypass base table policies",
            "B": "Yes — the masking policy on the base table column is inherited by the view",
            "C": "Only if the view is a secure view",
            "D": "Only if the user has OWNERSHIP on the base table",
        },
        "answer": ["B"],
        "explanation": "Masking policies on base table columns apply when data is accessed through views. The policy follows the column, not the object queried. This ensures data protection regardless of access path.",
    },
    {
        "id": 15, "domain": "D2: Security", "multi": False,
        "text": "A Snowflake account has a resource monitor at the account level with a credit quota of 1000. A second resource monitor with a quota of 200 is assigned to warehouse WH_REPORTS. WH_REPORTS consumes 200 credits. What is the effective limit that triggers the action?",
        "options": {
            "A": "1000 credits — the account-level monitor takes precedence",
            "B": "1200 credits — the quotas are additive",
            "C": "200 credits — the warehouse-level monitor triggers first since its quota is reached",
            "D": "500 credits — the average of both monitors",
        },
        "answer": ["C"],
        "explanation": "When both account-level and warehouse-level resource monitors exist, the more restrictive one triggers first. The warehouse-level monitor at 200 credits is reached before the account-level monitor at 1000, so it triggers.",
    },
    {
        "id": 16, "domain": "D2: Security", "multi": False,
        "text": "Which system role inherits all other system-defined roles by default in the Snowflake role hierarchy?",
        "options": {
            "A": "SECURITYADMIN",
            "B": "SYSADMIN",
            "C": "ORGADMIN",
            "D": "ACCOUNTADMIN",
        },
        "answer": ["D"],
        "explanation": "ACCOUNTADMIN is the top-level role in the default hierarchy. It inherits SYSADMIN and SECURITYADMIN (which itself inherits USERADMIN). ORGADMIN is a separate role for organization-level management.",
    },
    # ======================================================================
    # DOMAIN 3: DATA LOADING & UNLOADING (9 questions)
    # NEW: ON_ERROR defaults (bulk vs Snowpipe), PUT, stage types, table stage
    #      limits, INFER_SCHEMA, storage integrations, STREAM_HAS_DATA task skip
    # REPEAT: TRUNCATECOLUMNS (E03 miss)
    # ======================================================================
    {
        "id": 17, "domain": "D3: Loading", "multi": False,
        "text": "What is the default value of the ON_ERROR parameter when using bulk COPY INTO <table> to load data?",
        "options": {
            "A": "CONTINUE",
            "B": "SKIP_FILE",
            "C": "ABORT_STATEMENT",
            "D": "SKIP_FILE_10",
        },
        "answer": ["C"],
        "explanation": "The default ON_ERROR for bulk COPY INTO is ABORT_STATEMENT — the entire load aborts on the first error. For Snowpipe, the default is SKIP_FILE. This is a common exam trap: different defaults for bulk vs. continuous loading.",
    },
    {
        "id": 18, "domain": "D3: Loading", "multi": False,
        "text": "A COPY INTO command encounters a CSV row where a string value exceeds the target column's VARCHAR(50) length. The load fails. The engineer wants to silently cut the string to 50 characters. Which option should be set?",
        "options": {
            "A": "ON_ERROR = 'CONTINUE'",
            "B": "ERROR_ON_COLUMN_COUNT_MISMATCH = FALSE",
            "C": "FORCE = TRUE",
            "D": "TRUNCATECOLUMNS = TRUE",
        },
        "answer": ["D"],
        "explanation": "TRUNCATECOLUMNS = TRUE silently truncates strings that exceed the target column length. ON_ERROR = CONTINUE skips the entire row on error. ERROR_ON_COLUMN_COUNT_MISMATCH handles mismatched column counts, not lengths.",
    },
    {
        "id": 19, "domain": "D3: Loading", "multi": False,
        "text": "When a Snowpipe with AUTO_INGEST=TRUE encounters an error loading a file, what is its default ON_ERROR behavior?",
        "options": {
            "A": "ABORT_STATEMENT",
            "B": "SKIP_FILE",
            "C": "CONTINUE",
            "D": "SKIP_FILE_10",
        },
        "answer": ["B"],
        "explanation": "Snowpipe's default ON_ERROR is SKIP_FILE, which skips the entire file on error. This differs from bulk COPY INTO, which defaults to ABORT_STATEMENT. This difference is because Snowpipe operates autonomously without user intervention.",
    },
    {
        "id": 20, "domain": "D3: Loading", "multi": False,
        "text": "Which command uploads files from a local filesystem to a Snowflake internal stage?",
        "options": {
            "A": "COPY FILES INTO @stage FROM file://path",
            "B": "UPLOAD file://path TO @stage",
            "C": "PUT file://path @stage",
            "D": "INSERT FILES INTO @stage FROM file://path",
        },
        "answer": ["C"],
        "explanation": "PUT uploads files from a local filesystem to an internal stage. GET does the reverse — downloads from stage to local. Both use the file:// prefix for local paths.",
    },
    {
        "id": 21, "domain": "D3: Loading", "multi": False,
        "text": "A user wants to stage files that will be loaded into multiple tables by multiple users. Which stage type is most appropriate?",
        "options": {
            "A": "Named internal stage (@my_stage)",
            "B": "User stage (@~)",
            "C": "Table stage (@%tablename)",
            "D": "Temporary stage",
        },
        "answer": ["A"],
        "explanation": "Named internal stages are database objects with grantable privileges, supporting multi-user access and loading into multiple tables. User stages are single-user. Table stages are tied to one table and have no grantable privileges.",
    },
    {
        "id": 22, "domain": "D3: Loading", "multi": False,
        "text": "A table stage is referenced as @%my_table. Which of the following is a limitation of table stages?",
        "options": {
            "A": "They cannot be used with COPY INTO",
            "B": "They support data transformations during loading (query as source)",
            "C": "They have no grantable privileges — only the table owner can access them",
            "D": "They can only hold a single file at a time",
        },
        "answer": ["C"],
        "explanation": "Table stages are implicit stages tied to the table — they are not separate database objects. They have no grantable privileges; only the table owner (OWNERSHIP privilege) can stage, list, query, or drop files. They also do not support transformations during loading.",
    },
    {
        "id": 23, "domain": "D3: Loading", "multi": False,
        "text": "You have a set of Parquet files on an external stage. You want Snowflake to automatically detect the column names and types from the files to create a table. Which function do you use?",
        "options": {
            "A": "INFER_SCHEMA()",
            "B": "DESCRIBE STAGE",
            "C": "PARSE_JSON()",
            "D": "SHOW COLUMNS IN STAGE",
        },
        "answer": ["A"],
        "explanation": "INFER_SCHEMA detects column definitions (names, types, ordering) from staged semi-structured files including Parquet, Avro, ORC, JSON, and CSV. It can be used with CREATE TABLE ... USING TEMPLATE for automatic table creation.",
    },
    {
        "id": 24, "domain": "D3: Loading", "multi": False,
        "text": "When creating a named external stage, you must specify a URL pointing to cloud storage. If the storage is private, what is the RECOMMENDED way to provide authentication credentials?",
        "options": {
            "A": "Use a network policy to allow the stage to access cloud storage",
            "B": "Embed AWS_KEY_ID and AWS_SECRET_KEY directly in the CREDENTIALS parameter",
            "C": "Store credentials in a Snowflake secret and reference it in the stage definition",
            "D": "Use a storage integration object to delegate authentication",
        },
        "answer": ["D"],
        "explanation": "Snowflake highly recommends storage integrations for external stages. They delegate authentication to a Snowflake IAM entity, avoiding hard-coded credentials. Direct credentials (AWS_KEY_ID) work but are not recommended.",
    },
    {
        "id": 25, "domain": "D3: Loading", "multi": False,
        "text": "A task is configured with WHEN SYSTEM$STREAM_HAS_DATA('my_stream'). The task's schedule fires every 5 minutes. If the stream has no new data, what happens?",
        "options": {
            "A": "The task runs but processes zero rows",
            "B": "The task is skipped entirely and does not consume warehouse credits",
            "C": "The task fails with an empty stream error",
            "D": "The task still runs and is billed for the minimum 60 seconds",
        },
        "answer": ["B"],
        "explanation": "The WHEN condition is evaluated before the task runs. If SYSTEM$STREAM_HAS_DATA returns FALSE, the task is skipped entirely — no warehouse is started and no credits are consumed.",
    },
    # ======================================================================
    # DOMAIN 4: PERFORMANCE & TRANSFORMATIONS (10 questions)
    # Performance: clustering depth, SOS, result cache, scale out, HLL, spilling
    # Transformations: PIVOT, LATERAL FLATTEN, QUALIFY, VARIANT notation
    # REPEAT: HLL (E03 miss), result cache (core), scale out (core), spilling (core)
    # ======================================================================
    {
        "id": 26, "domain": "D4: Performance", "multi": False,
        "text": "SYSTEM$CLUSTERING_INFORMATION for a table returns an average_depth of 1.2 on the clustering key columns. What does this indicate?",
        "options": {
            "A": "The table is well-clustered with minimal micro-partition overlap",
            "B": "The table is very poorly clustered and needs immediate reclustering",
            "C": "The clustering key was recently dropped",
            "D": "The table has only 1.2 micro-partitions total",
        },
        "answer": ["A"],
        "explanation": "Average clustering depth measures how many micro-partitions overlap for the key columns. A value close to 1 means excellent clustering — each partition has minimal overlap with others, enabling very effective pruning.",
    },
    {
        "id": 27, "domain": "D4: Performance", "multi": False,
        "text": "Which Snowflake feature is designed to accelerate point-lookup queries (equality predicates) and substring searches on large tables, without reorganizing micro-partitions?",
        "options": {
            "A": "Automatic Clustering",
            "B": "Materialized Views",
            "C": "Query Acceleration Service (QAS)",
            "D": "Search Optimization Service (SOS)",
        },
        "answer": ["D"],
        "explanation": "Search Optimization Service creates auxiliary data structures to speed up selective point lookups (equality, IN, LIKE, substring, geo). Unlike clustering, it does not reorganize data. QAS accelerates scatter-heavy queries by offloading work, not point lookups.",
    },
    {
        "id": 28, "domain": "D4: Performance", "multi": False,
        "text": "A user runs an identical SELECT query three times. The first execution takes 8 seconds. The second returns instantly from the result cache. Before the third execution, an INSERT adds one row to the table. How long does the third query take?",
        "options": {
            "A": "Instant — the result cache is not affected by single-row inserts",
            "B": "About 8 seconds — the result cache is invalidated because the underlying data changed",
            "C": "About 4 seconds — only the new row is processed",
            "D": "It depends on whether the warehouse was suspended between queries",
        },
        "answer": ["B"],
        "explanation": "Any DML operation on the underlying table invalidates the result cache for queries against that table. Even a single INSERT forces re-execution. The third query runs against the warehouse again, taking approximately the same time.",
    },
    {
        "id": 29, "domain": "D4: Performance", "multi": False,
        "text": "During peak business hours, users report that queries are taking longer than usual. The Query Profile shows significant time in the 'Queued' state. The warehouse is a single-cluster LARGE. What is the BEST remediation?",
        "options": {
            "A": "Scale up to X-Large to process individual queries faster",
            "B": "Enable multi-cluster auto-scaling (scale out) to handle concurrent query load",
            "C": "Add a clustering key to the most queried table",
            "D": "Increase the statement timeout parameter",
        },
        "answer": ["B"],
        "explanation": "Queuing during peak hours indicates concurrency contention — too many queries for one cluster. Scale out (multi-cluster) adds clusters to handle concurrent users. Scale up makes individual queries faster but doesn't help concurrency.",
    },
    {
        "id": 30, "domain": "D4: Performance", "multi": False,
        "text": "The function HLL() in Snowflake is an alias for which function?",
        "options": {
            "A": "HASH_AGG()",
            "B": "COUNT(DISTINCT)",
            "C": "APPROX_PERCENTILE()",
            "D": "APPROX_COUNT_DISTINCT()",
        },
        "answer": ["D"],
        "explanation": "HLL() is an alias for APPROX_COUNT_DISTINCT(). Both use the HyperLogLog algorithm for approximate cardinality estimation. COUNT(DISTINCT) is the exact (not approximate) equivalent.",
    },
    {
        "id": 31, "domain": "D4: Performance", "multi": False,
        "text": "A query's Query Profile shows 'Bytes Spilled to Remote Storage: 15 GB'. What does this indicate and what is the recommended action?",
        "options": {
            "A": "Intermediate data exceeded both memory and local SSD; scale up to a larger warehouse",
            "B": "Remote storage latency slowed the query; switch to an internal stage",
            "C": "The warehouse is overloaded with concurrent queries; scale out instead",
            "D": "The query result set was too large for the client; paginate the results",
        },
        "answer": ["A"],
        "explanation": "Spilling to remote storage means intermediate data exceeded both warehouse memory AND the local SSD cache, overflowing to cloud storage (S3/Blob/GCS). This is more severe than local spilling. A larger warehouse provides more memory and SSD to prevent both levels of spilling.",
    },
    {
        "id": 32, "domain": "D4: Performance", "multi": False,
        "text": "You need to convert rows into columns — for example, transforming monthly revenue rows into columns like JAN, FEB, MAR. Which SQL clause achieves this natively in Snowflake?",
        "options": {
            "A": "UNPIVOT",
            "B": "PIVOT",
            "C": "TRANSPOSE",
            "D": "CROSSTAB",
        },
        "answer": ["B"],
        "explanation": "PIVOT rotates rows into columns, aggregating values. UNPIVOT does the reverse — columns into rows. TRANSPOSE and CROSSTAB are not Snowflake SQL clauses.",
    },
    {
        "id": 33, "domain": "D4: Performance", "multi": False,
        "text": "A VARIANT column named DATA contains: {'items': [{'name': 'Laptop'}, {'name': 'Mouse'}]}. You need to extract each item name as a separate row. Which approach is correct?",
        "options": {
            "A": "SELECT DATA:items:name FROM table",
            "B": "SELECT f.value:name::STRING FROM table, LATERAL FLATTEN(input => DATA:items) f",
            "C": "SELECT ARRAY_SLICE(DATA:items, 0, 2) FROM table",
            "D": "SELECT PARSE_JSON(DATA):items FROM table",
        },
        "answer": ["B"],
        "explanation": "LATERAL FLATTEN expands an array into individual rows. Each row's value field contains one array element, which can then be traversed with colon notation. Option A would not produce separate rows.",
    },
    {
        "id": 34, "domain": "D4: Performance", "multi": False,
        "text": "Which SQL clause is unique to Snowflake and allows filtering the results of a window function directly, without requiring a subquery or CTE?",
        "options": {
            "A": "HAVING",
            "B": "WITHIN GROUP",
            "C": "QUALIFY",
            "D": "PARTITION BY",
        },
        "answer": ["C"],
        "explanation": "QUALIFY filters results of window functions (like ROW_NUMBER, RANK) directly in the query, similar to how HAVING filters aggregate results. Without QUALIFY, you would need a subquery or CTE to filter on window function output.",
    },
    {
        "id": 35, "domain": "D4: Performance", "multi": False,
        "text": "A Snowflake VARIANT column stores data using bracket notation: DATA['address']['city']. Which alternative notation also works to access the same nested value?",
        "options": {
            "A": "DATA.address.city",
            "B": "GET(DATA, 'address.city')",
            "C": "JSON_EXTRACT(DATA, '$.address.city')",
            "D": "DATA:address.city",
        },
        "answer": ["D"],
        "explanation": "Snowflake supports colon notation (DATA:address.city or DATA:address:city) and bracket notation (DATA['address']['city']). All-dot notation (DATA.address.city) does NOT work — the first accessor must use colon or bracket.",
    },
    # ======================================================================
    # DOMAIN 5: DATA PROTECTION & SHARING (5 questions)
    # REPEAT (E04 miss reinforce): TT+FS transient, TT+FS reverse math
    # NEW: Consumer share limits, reader account billing, Direct Share same-region
    # ======================================================================
    {
        "id": 36, "domain": "D5: Sharing", "multi": False,
        "text": "A transient table has DATA_RETENTION_TIME_IN_DAYS = 1. How many total days of data protection does this table have (Time Travel + Fail-safe combined)?",
        "options": {
            "A": "8 days (1 TT + 7 FS)",
            "B": "7 days (Fail-safe only)",
            "C": "1 day (1 TT + 0 FS)",
            "D": "0 days (transient tables have no protection)",
        },
        "answer": ["C"],
        "explanation": "Transient tables have NO Fail-safe period. Total protection = Time Travel only. With retention=1, the total is 1 day. Only permanent tables get the additional 7-day Fail-safe. Total = TT + FS, and FS=0 for transient.",
    },
    {
        "id": 37, "domain": "D5: Sharing", "multi": False,
        "text": "A data provider shares a table via a Direct Share with a consumer account. Which of the following can the CONSUMER do with the shared data?",
        "options": {
            "A": "Clone the shared table into their own database",
            "B": "Create a view on top of the shared database to query it",
            "C": "Modify the shared table by inserting rows",
            "D": "Re-share the data with a third-party account",
        },
        "answer": ["B"],
        "explanation": "Consumers can create a database from the share and query it (including creating views on shared objects). They CANNOT clone shared objects, modify shared data, or re-share it to another account.",
    },
    {
        "id": 38, "domain": "D5: Sharing", "multi": False,
        "text": "An Enterprise account has a permanent table with total data protection of 37 days. Given that Fail-safe is always 7 days for permanent tables, what is the DATA_RETENTION_TIME_IN_DAYS setting on this table?",
        "options": {
            "A": "37 days",
            "B": "44 days",
            "C": "7 days",
            "D": "30 days",
        },
        "answer": ["D"],
        "explanation": "Total protection = TT + FS. For permanent tables, FS = 7. 37 total - 7 FS = 30 days Time Travel. So DATA_RETENTION_TIME_IN_DAYS = 30. Enterprise edition supports up to 90 days of TT.",
    },
    {
        "id": 39, "domain": "D5: Sharing", "multi": False,
        "text": "What happens when a provider creates a reader account for a non-Snowflake consumer? Who pays for the compute resources the consumer uses?",
        "options": {
            "A": "The provider pays — reader account compute charges appear on the provider's bill",
            "B": "The consumer pays — they are billed directly by Snowflake",
            "C": "Snowflake absorbs the cost as part of the Marketplace fee",
            "D": "Neither — reader accounts cannot execute queries",
        },
        "answer": ["A"],
        "explanation": "Reader accounts (managed accounts) are created and paid for by the provider. All compute costs for warehouses and queries in the reader account appear on the provider's bill. The consumer has no direct Snowflake billing relationship.",
    },
    {
        "id": 40, "domain": "D5: Sharing", "multi": False,
        "text": "A Direct Share allows a provider in us-east-1 to share data with a consumer. In which scenario does the consumer receive the shared data without replication?",
        "options": {
            "A": "The consumer is in any AWS region",
            "B": "The consumer is in the same cloud region (us-east-1) as the provider",
            "C": "The consumer is on a different cloud provider (Azure or GCP)",
            "D": "Direct Shares always require replication regardless of region",
        },
        "answer": ["B"],
        "explanation": "Direct Shares work within the same cloud provider AND region without replication. Cross-region or cross-cloud sharing requires replication or auto-fulfillment through listings. Same-region sharing uses zero-copy — the consumer reads directly from the provider's storage.",
    },
]

DOMAINS = ["D1: Architecture", "D2: Security", "D3: Loading", "D4: Performance", "D5: Sharing"]
DOMAIN_COLORS = {
    "D1: Architecture": "#4A90D9",
    "D2: Security": "#D94A4A",
    "D3: Loading": "#4AD94A",
    "D4: Performance": "#D9A84A",
    "D5: Sharing": "#9B59B6",
}

st.set_page_config(page_title="S1-E05 | COF-C03", layout="wide")
st.markdown("""<style>
    .domain-tag { padding: 2px 10px; border-radius: 12px; color: white; font-weight: bold; font-size: 0.85em; }
    div[data-testid="stRadio"] > label { font-size: 1.0em; }
</style>""", unsafe_allow_html=True)


def calc_score():
    return sum(1 for i, qi in enumerate(st.session_state.order)
               if st.session_state.answers.get(i, set()) == set(QUESTIONS[qi]["answer"]))


def calc_domain_scores():
    stats = {d: {"correct": 0, "total": 0} for d in DOMAINS}
    for i, qi in enumerate(st.session_state.order):
        q = QUESTIONS[qi]
        stats[q["domain"]]["total"] += 1
        if st.session_state.answers.get(i, set()) == set(q["answer"]):
            stats[q["domain"]]["correct"] += 1
    return stats


def main():
    if "started" not in st.session_state:
        st.session_state.started = False
    if not st.session_state.started:
        render_start()
    elif st.session_state.get("submitted", False):
        render_results()
    else:
        render_exam()


def render_start():
    st.title("COF-C03 SnowPro Core — Season 1, Exam 05")
    st.markdown("**40 questions** | D1=9, D2=7, D3=9, D4=10, D5=5")
    st.markdown("**70% NEW concepts** | 30% reinforcement from E01-E04 misses")
    st.markdown("---")
    st.markdown("""
**New topics in this exam:**
- Credit calculations, 60s billing minimum, cloud services 10% waiver
- Dynamic Tables (TARGET_LAG, chaining, DT vs MV)
- Managed access schemas, masking policy inheritance
- Account vs warehouse resource monitors
- ON_ERROR defaults (bulk vs Snowpipe), PUT/GET, stage types
- INFER_SCHEMA, storage integrations, SYSTEM$STREAM_HAS_DATA
- Search Optimization Service, QUALIFY, PIVOT
- Consumer share limitations, Direct Share same-region zero-copy

**Reinforced from previous misses:**
- TT + Fail-safe additive math (E04 miss)
- SUSPEND vs SUSPEND_IMMEDIATE (E04 miss)
- TRUNCATECOLUMNS (E03 miss)
- HLL = APPROX_COUNT_DISTINCT (E03 miss)
    """)
    if st.button("Start Exam", type="primary", use_container_width=True):
        order = list(range(len(QUESTIONS)))
        random.shuffle(order)
        st.session_state.order = order
        st.session_state.answers = {}
        st.session_state.flagged = set()
        st.session_state.current = 0
        st.session_state.submitted = False
        st.session_state.started = True
        st.experimental_rerun()


def go_to(idx):
    st.session_state.current = idx


def render_exam():
    total = len(QUESTIONS)
    cur = st.session_state.current
    qi = st.session_state.order[cur]
    q = QUESTIONS[qi]

    top_cols = st.columns([3, 1, 1])
    with top_cols[0]:
        st.caption(f"Question {cur + 1} of {total}")
        st.progress((cur + 1) / total)
    with top_cols[1]:
        answered = len(st.session_state.answers)
        st.metric("Answered", f"{answered}/{total}")
    with top_cols[2]:
        flagged_count = len(st.session_state.flagged)
        st.metric("Flagged", str(flagged_count))

    color = DOMAIN_COLORS.get(q["domain"], "#888")
    st.markdown(f'<span class="domain-tag" style="background:{color}">{q["domain"]}</span>', unsafe_allow_html=True)
    st.markdown(f"### Q{cur + 1}. {q['text']}")

    prev_answer = st.session_state.answers.get(cur, set())

    if q["multi"]:
        st.caption("Select TWO answers.")
        for key, val in q["options"].items():
            checked = key in prev_answer
            if st.checkbox(f"{key}. {val}", value=checked, key=f"opt_{cur}_{key}"):
                prev_answer.add(key)
            else:
                prev_answer.discard(key)
        st.session_state.answers[cur] = prev_answer
    else:
        options_list = [f"{k}. {v}" for k, v in q["options"].items()]
        prev_idx = None
        if prev_answer:
            prev_key = list(prev_answer)[0]
            for idx, opt in enumerate(options_list):
                if opt.startswith(f"{prev_key}."):
                    prev_idx = idx
                    break
        radio_kwargs = {"label": "Select your answer:", "options": options_list, "key": f"radio_{cur}"}
        if prev_idx is not None:
            radio_kwargs["index"] = prev_idx
        selected = st.radio(**radio_kwargs)
        if selected:
            st.session_state.answers[cur] = {selected[0]}

    is_flagged = cur in st.session_state.flagged
    flag_label = "Unflag" if is_flagged else "Flag for Review"
    if st.button(flag_label, key=f"flag_{cur}"):
        if is_flagged:
            st.session_state.flagged.discard(cur)
        else:
            st.session_state.flagged.add(cur)
        st.experimental_rerun()

    st.markdown("---")
    nav_cols = st.columns(3)
    with nav_cols[0]:
        if cur > 0:
            st.button("Previous", on_click=go_to, args=(cur - 1,), use_container_width=True)
    with nav_cols[1]:
        if answered == total:
            if st.button("Submit Exam", type="primary", use_container_width=True):
                st.session_state.submitted = True
                st.experimental_rerun()
    with nav_cols[2]:
        if cur < total - 1:
            st.button("Next", on_click=go_to, args=(cur + 1,), use_container_width=True, type="primary")


def render_results():
    total = len(QUESTIONS)
    correct = calc_score()
    pct = (correct / total) * 100
    domain_stats = calc_domain_scores()
    passed = pct >= 75
    st.title("Season 1, Exam 05 - Results")
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
        st.experimental_rerun()


if __name__ == "__main__":
    main()
