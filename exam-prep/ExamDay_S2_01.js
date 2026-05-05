// ─────────────────────────────────────────────────────────────────────────────
// EXAM PREP — Season 2 · Day 1  (2026-04-06)
// COF-C03 Mock Exam · 40 questions
// Source: ceert_mock/cof_c03_s2_e01_questions.json
// Distribution: D1 32% (13q) | D2 20% (8q) | D3 18% (7q) | D4 22% (9q) | D5 8% (3q)
//
// FORMAT NOTES:
//   - Multi-select questions include `multi: true` and an `answers` array with
//     ALL correct option texts. The `answer` field holds the PRIMARY correct
//     option for backward compatibility with single-answer grading in
//     ExamPrep.jsx. To grade multi-select strictly, update the renderer to
//     check `q.multi ? arrayMatch(picked, q.answers) : picked === q.answer`.
// ─────────────────────────────────────────────────────────────────────────────

export const DAY_META = {
  day: 'S2-01',
  date: '2026-04-06',
  label: 'Season 2 · Day 1 — Mock Exam (Mixed Domain)',
  totalQuestions: 40,
  timeMinutes: 75,
};

export const QUESTIONS = [

  // ── DOMAIN 1: Architecture & Features (13 questions) ───────────────────────

  {
    id: 's2d01_01',
    domain: 1,
    topic: 'Session Role Resolution',
    difficulty: 'medium',
    multi: true,
    q: 'What criteria does Snowflake use to determine the current role when initiating a session? (Select TWO)',
    options: [
      'If a role was specified as part of the connection and that role has been granted to the Snowflake user, the specified role becomes the current role.',
      'If no role was specified as part of the connection and a default role has been defined for the Snowflake user, that role becomes the current role.',
      'If no role was specified as part of the connection and a default role has not been set for the Snowflake user, the session will not be initiated and the log in will fail.',
      'If a role was specified as part of the connection and that role has not been granted to the Snowflake user, it will be ignored and the default role will become the current role.',
      'If a role was specified as part of the connection and that role has not been granted to the Snowflake user, the role is automatically granted, and it becomes the current role.',
    ],
    answer: 'If a role was specified as part of the connection and that role has been granted to the Snowflake user, the specified role becomes the current role.',
    answers: [
      'If a role was specified as part of the connection and that role has been granted to the Snowflake user, the specified role becomes the current role.',
      'If no role was specified as part of the connection and a default role has been defined for the Snowflake user, that role becomes the current role.',
    ],
    exp: 'When connecting, if a role is specified AND granted to the user, it becomes current. If no role is specified, the user\'s default role is used. If no default exists, PUBLIC is used (login does NOT fail). If a specified role is NOT granted, the connection fails — Snowflake does NOT silently fall back or auto-grant the role.',
  },

  {
    id: 's2d01_03',
    domain: 1,
    topic: 'Materialized View — Schema Invalidation',
    difficulty: 'medium',
    q: 'What is a key consideration when using a Snowflake materialized view?',
    options: [
      'A materialized view only supports inner joins between component tables.',
      'A materialized view must have the same clustering key as one of the component tables.',
      'A materialized view can only be used when the background service has had time to update after DML operations.',
      'A materialized view may become invalid if the underlying base table columns have been dropped.',
    ],
    answer: 'A materialized view may become invalid if the underlying base table columns have been dropped.',
    exp: 'A materialized view becomes invalid if the base table columns it references are dropped. MVs do NOT support joins at all (single base table only — not just "inner joins"). They do NOT require matching clustering keys. MVs can be queried before the background refresh completes — Snowflake handles staleness transparently and will use the base table when needed.',
  },

  {
    id: 's2d01_07',
    domain: 1,
    topic: 'PRIMARY KEY Constraint Purpose',
    difficulty: 'easy',
    q: 'Why is the PRIMARY KEY constraint used on standard tables?',
    options: [
      'To encrypt data in the table and ensure security',
      'To cluster data in the table and improve performance',
      'To enforce data integrity by preventing duplicate values',
      'To indicate unique identifiers for metadata purposes',
    ],
    answer: 'To indicate unique identifiers for metadata purposes',
    exp: 'On standard Snowflake tables, PRIMARY KEY constraints are NOT enforced — they are informational/metadata only. They document intent, help BI tools understand the data model, and feed query optimizer hints, but do not prevent duplicates. Note: Hybrid Tables (Unistore) are the exception — they DO enforce PK/UNIQUE/FK constraints.',
  },

  {
    id: 's2d01_17',
    domain: 1,
    topic: 'Snowflake SQL API — Capabilities',
    difficulty: 'medium',
    multi: true,
    q: 'What are the capabilities of Snowflake SQL API? (Select TWO)',
    options: [
      'Requires installing a language-specific driver',
      'Returns responses in JSON',
      'Supports OAuth for authentication',
      'Can call third-party REST APIs during SQL execution',
      'Can support GET and PUT commands',
    ],
    answer: 'Returns responses in JSON',
    answers: [
      'Returns responses in JSON',
      'Supports OAuth for authentication',
    ],
    exp: 'The Snowflake SQL API is a REST API that returns responses in JSON and supports OAuth + key-pair (JWT) authentication. It does NOT require a language-specific driver (HTTP-only is the point). It cannot call third-party APIs during execution. It does NOT support GET/PUT file commands.',
  },

  {
    id: 's2d01_20',
    domain: 1,
    topic: 'Cloning — Snapshot Timing',
    difficulty: 'medium',
    q: 'If a source table is updated while cloning is in progress, what data will be included in the cloned table?',
    options: [
      'All data from the timestamp when the user runs the query.',
      'All data from the timestamp when the user session was created.',
      'All data from the timestamp when the clone statement was initiated.',
      'All data from the timestamp when the clone statement was completed.',
    ],
    answer: 'All data from the timestamp when the clone statement was initiated.',
    exp: 'Cloning uses the snapshot of data at the time the CREATE ... CLONE statement is INITIATED. Any DML changes made to the source table while the clone runs are NOT included. This is what makes zero-copy cloning fast even on multi-TB tables — it\'s a metadata snapshot, not a data copy.',
  },

  {
    id: 's2d01_24',
    domain: 1,
    topic: 'Cancelling a Long-Running Query',
    difficulty: 'easy',
    q: 'A complex query has been running in Snowsight for more than one hour while other queries succeed. What is the FASTEST way to cancel the long-running query?',
    options: [
      'Immediately suspend the virtual warehouse that the query is running on.',
      'Return to the worksheet and abort the query.',
      'Set the auto_suspend virtual warehouse property to 0.',
      'Find the query in the query activity view and cancel the query.',
    ],
    answer: 'Return to the worksheet and abort the query.',
    exp: 'The fastest way is to return to the worksheet where the query was launched and click the abort button. Suspending the warehouse would cancel ALL queries on it (impacting other users). The Activity view also works but adds navigation steps. AUTO_SUSPEND = 0 means NEVER suspend — does not abort anything.',
  },

  {
    id: 's2d01_25',
    domain: 1,
    topic: 'Edition Pricing Impact',
    difficulty: 'medium',
    multi: true,
    q: 'What is the impact of selecting one Snowflake edition over another? (Select TWO)',
    options: [
      'The edition will impact the unit costs for storage.',
      'The edition will impact which regions can be accessed by the accounts.',
      'The edition will determine the unit costs for the compute credits.',
      'The edition will impact the total allowed storage space.',
      'The edition will set a limit on the number of compute credits that can be consumed.',
    ],
    answer: 'The edition will impact the unit costs for storage.',
    answers: [
      'The edition will impact the unit costs for storage.',
      'The edition will determine the unit costs for the compute credits.',
    ],
    exp: 'Higher Snowflake editions have higher per-credit costs and higher per-TB storage costs. Editions do NOT restrict regions, cap total storage, or limit credit consumption — those are governed by Resource Monitors, not edition.',
  },

  {
    id: 's2d01_28',
    domain: 1,
    topic: 'External Tables — Allowed Operations',
    difficulty: 'medium',
    multi: true,
    q: 'Which operations can be performed on Snowflake external tables? (Select TWO)',
    options: [
      'INSERT',
      'JOIN',
      'RENAME',
      'DELETE FROM',
      'ALTER',
    ],
    answer: 'JOIN',
    answers: ['JOIN', 'ALTER'],
    exp: 'External tables are read-only — INSERT, UPDATE, DELETE, and MERGE are not allowed. They CAN participate in JOINs with other tables and CAN be ALTERed (e.g., REFRESH, ADD/DROP columns, change auto_refresh). RENAME is not a standard external-table operation. They are also excluded from database clones and cannot use Time Travel.',
  },

  {
    id: 's2d01_30',
    domain: 1,
    topic: 'Stream Staleness Calculation',
    difficulty: 'medium',
    q: 'How can a user determine when a stream will become stale?',
    options: [
      'By using the value of DATA_RETENTION_TIME_IN_DAYS',
      'By using the lesser value of DATA_RETENTION_TIME_IN_DAYS and MAX_DATA_EXTENSION_TIME_IN_DAYS',
      'By using the greater value of DATA_RETENTION_TIME_IN_DAYS and MAX_DATA_EXTENSION_TIME_IN_DAYS',
      'By using the sum of the values of DATA_RETENTION_TIME_IN_DAYS and MAX_DATA_EXTENSION_TIME_IN_DAYS',
    ],
    answer: 'By using the greater value of DATA_RETENTION_TIME_IN_DAYS and MAX_DATA_EXTENSION_TIME_IN_DAYS',
    exp: 'Per Snowflake docs: STALE_AFTER = last consumption time + GREATER(DATA_RETENTION_TIME_IN_DAYS, MAX_DATA_EXTENSION_TIME_IN_DAYS). Once stale, the stream cannot be refreshed — it must be DROPped and recreated.',
  },

  {
    id: 's2d01_32',
    domain: 1,
    topic: 'Snowpark-Optimized Warehouse',
    difficulty: 'medium',
    q: 'A Snowflake Practitioner is using Snowflake to run an ML model, but training is taking much longer than expected. Which step will accelerate the training?',
    options: [
      'Add additional clusters to the virtual warehouse.',
      'Use a Snowpark-optimized virtual warehouse.',
      'Use the search optimization service.',
      'Enable the query acceleration service.',
    ],
    answer: 'Use a Snowpark-optimized virtual warehouse.',
    exp: 'Snowpark-optimized warehouses provide 16x more memory per node, designed for memory-intensive ML training and large UDFs. Multi-cluster addresses CONCURRENCY (queueing), not single-query memory. SOS is for selective point lookups. QAS targets ad-hoc BI queries with large scans, not ML training.',
  },

  {
    id: 's2d01_33',
    domain: 1,
    topic: 'Snowpark API Languages',
    difficulty: 'easy',
    q: 'What computer language can be selected when creating UDFs using the Snowpark API?',
    options: [
      'Swift',
      'JavaScript',
      'Python',
      'SQL',
    ],
    answer: 'Python',
    exp: 'The Snowpark API supports Python, Java, and Scala for creating UDFs. JavaScript UDFs exist in Snowflake but are created via raw SQL (CREATE FUNCTION ... LANGUAGE JAVASCRIPT), NOT through the Snowpark API. SQL UDFs are also created via SQL, not Snowpark. Swift is not supported.',
  },

  {
    id: 's2d01_35',
    domain: 1,
    topic: 'Worksheet Sharing',
    difficulty: 'medium',
    q: 'A user shares a worksheet (ANALYST role) with a Developer (DEVELOPER role only). Granting Edit with View = True permissions. What can the Developer do?',
    options: [
      'Run the worksheet.',
      'View the results of the most recent worksheet version.',
      'View the contents of the worksheet.',
      'Share the worksheet with other users.',
    ],
    answer: 'View the contents of the worksheet.',
    exp: 'With Edit + View permissions but without the ANALYST role, the Developer can read the worksheet\'s SQL but cannot RUN it (running requires the role with privileges on the referenced objects). They cannot view prior results (also role-dependent) or re-share without proper permissions. Sharing a worksheet does NOT grant access to the underlying data — recipients still need their own grants.',
  },

  {
    id: 's2d01_40',
    domain: 1,
    topic: 'Warehouse Billing — Per-Second',
    difficulty: 'easy',
    q: 'A virtual warehouse was used for 5 minutes and 15 seconds and then shut down. How many seconds will the customer be charged for?',
    options: [
      '300 seconds',
      '315 seconds',
      '320 seconds',
      '360 seconds',
    ],
    answer: '315 seconds',
    exp: 'Snowflake billing: 60-second minimum on each resume, then per-second after that. The warehouse ran continuously for 5 min 15 sec = 315 seconds. Since 315 > 60, no minimum padding applies and there is NO rounding up to the next minute — the customer pays exactly 315 seconds.',
  },

  // ── DOMAIN 2: Security & Governance (8 questions) ──────────────────────────

  {
    id: 's2d01_10',
    domain: 2,
    topic: 'Storage Integration — Security Benefit',
    difficulty: 'easy',
    q: 'When creating an external stage for Amazon S3, which is the primary security benefit of using a STORAGE INTEGRATION object compared to embedding credentials directly?',
    options: [
      'It grants temporary, revocable permissions to unload data to the external bucket, in addition to read access.',
      'It automatically encrypts the data files in the external bucket using Snowflake keys before loading.',
      'It allows Snowflake to deploy and version-control stored procedures from a private Git repository stored in Amazon S3.',
      'It avoids the need to store hard-coded credentials in the stage definition.',
    ],
    answer: 'It avoids the need to store hard-coded credentials in the stage definition.',
    exp: 'Storage integrations use IAM trust relationships (AWS IAM roles, Azure managed identities, GCP service accounts) instead of inline AWS access keys. This avoids storing hard-coded credentials in the stage definition — the security benefit. Encryption happens transparently regardless of integration choice.',
  },

  {
    id: 's2d01_12',
    domain: 2,
    topic: 'ACCESS_HISTORY — Governance Use',
    difficulty: 'medium',
    multi: true,
    q: 'How can the ACCESS_HISTORY view in ACCOUNT_USAGE be used to review data governance? (Select TWO)',
    options: [
      'Identify queries run by a particular user.',
      'Identify access to the roles given to a user.',
      'Identify SQL statements that failed to run.',
      'Identify objects that were modified by a query.',
      'Identify object dependencies.',
    ],
    answer: 'Identify queries run by a particular user.',
    answers: [
      'Identify queries run by a particular user.',
      'Identify objects that were modified by a query.',
    ],
    exp: 'ACCESS_HISTORY tracks WHO accessed WHAT. It exposes USER_NAME (queries by user) and OBJECTS_MODIFIED (objects written/altered). Role grants live in GRANTS_TO_USERS. Failed statements are in QUERY_HISTORY. Object dependencies live in OBJECT_DEPENDENCIES.',
  },

  {
    id: 's2d01_15',
    domain: 2,
    topic: 'Custom Roles vs System Roles',
    difficulty: 'easy',
    q: 'A user wants to add additional privileges to system-defined roles for their virtual warehouse. How does Snowflake recommend they accomplish this?',
    options: [
      'Grant the additional privileges to a custom role.',
      'Grant the additional privileges to the ACCOUNTADMIN role.',
      'Grant the additional privileges to the SYSADMIN role.',
      'Grant the additional privileges to the ORGADMIN role.',
    ],
    answer: 'Grant the additional privileges to a custom role.',
    exp: 'Snowflake best practice: never modify system-defined roles directly. Create custom roles for specific privilege bundles and grant those custom roles upward into the system role hierarchy (typically to SYSADMIN). This preserves the RBAC model and gives granular control.',
  },

  {
    id: 's2d01_22',
    domain: 2,
    topic: 'Masking Policy Structure',
    difficulty: 'medium',
    q: 'What does a masking policy consist of in Snowflake?',
    options: [
      'A single data type, with one or more conditions, and one or more masking functions',
      'A single data type, with only one condition, and only one masking function',
      'Multiple data types, with only one condition, and one or more masking functions',
      'Multiple data types, with one or more conditions, and one or more masking functions',
    ],
    answer: 'A single data type, with one or more conditions, and one or more masking functions',
    exp: 'A masking policy is bound to a SINGLE data type (input and output type must match), but its body can contain MULTIPLE conditions (CASE/WHEN on role context) and apply DIFFERENT masking functions per branch. Need protection on multiple data types? Create separate policies.',
  },

  {
    id: 's2d01_27',
    domain: 2,
    topic: 'Privilege Grant Order — Read-Only Table Access',
    difficulty: 'medium',
    q: 'Which order of object privileges should be used to grant a custom role read-only access on a table?',
    options: [
      '1.Schema USAGE → 2.Database USAGE → 3.Table USAGE',
      '1.Schema USAGE → 2.Database USAGE → 3.Table SELECT',
      '1.Database USAGE → 2.Schema USAGE → 3.Table SELECT',
      '1.Database USAGE → 2.Schema USAGE → 3.Table OPERATE',
    ],
    answer: '1.Database USAGE → 2.Schema USAGE → 3.Table SELECT',
    exp: 'Privilege walk follows the container hierarchy: USAGE on Database → USAGE on Schema → SELECT on Table. USAGE is required to "see" the next level. The table-level read privilege is SELECT (NOT USAGE on table, NOT OPERATE — OPERATE is for warehouses/tasks).',
  },

  {
    id: 's2d01_31',
    domain: 2,
    topic: 'Resource Monitor Privileges',
    difficulty: 'medium',
    multi: true,
    q: 'What are the least privileges needed to view and modify resource monitors? (Select TWO)',
    options: [
      'SELECT',
      'OWNERSHIP',
      'MONITOR',
      'MODIFY',
      'USAGE',
    ],
    answer: 'MONITOR',
    answers: ['MONITOR', 'MODIFY'],
    exp: 'MONITOR allows viewing the resource monitor and its usage. MODIFY allows changing properties (credit quota, triggers, frequency). Together they\'re the LEAST-privilege pair for viewing AND modifying — less than OWNERSHIP. SELECT/USAGE don\'t apply to resource monitors.',
  },

  {
    id: 's2d01_36',
    domain: 2,
    topic: 'CDP Cost Optimization — Transient Tables',
    difficulty: 'medium',
    q: 'How can a user MINIMIZE Continuous Data Protection costs when using large, high-churn dimension tables?',
    options: [
      'Create transient tables and periodically copy them to permanent tables.',
      'Create temporary tables and periodically copy them to permanent tables.',
      'Create regular tables with extended Time Travel and Fail-safe settings.',
      'Create regular tables with default Time Travel and Fail-safe settings.',
    ],
    answer: 'Create transient tables and periodically copy them to permanent tables.',
    exp: 'Transient tables have NO Fail-safe (saves 7 days of storage charges) and up to 1 day of Time Travel. For high-churn dimensions, this minimizes CDP costs. Periodic copy to permanent provides a recovery point. Temporary tables only live within a session. Extending TT/Fail-safe INCREASES costs.',
  },

  {
    id: 's2d01_38',
    domain: 2,
    topic: 'Dynamic Data Masking — Edition',
    difficulty: 'easy',
    q: 'Which is the MINIMUM Snowflake edition required to use Dynamic Data Masking?',
    options: [
      'Standard',
      'Enterprise',
      'Business Critical',
      'Virtual Private Snowflake (VPS)',
    ],
    answer: 'Enterprise',
    exp: 'Dynamic Data Masking requires Enterprise Edition or higher. It is NOT available on Standard. Same gate applies to: Materialized Views, Multi-cluster Warehouses, Search Optimization, Query Acceleration, and Time Travel beyond 1 day.',
  },

  // ── DOMAIN 3: Data Loading & Connectivity (7 questions) ────────────────────

  {
    id: 's2d01_02',
    domain: 3,
    topic: 'Snowpipe — File Sizing',
    difficulty: 'easy',
    q: 'A team receives 5 TB of raw CSV log data every day via Snowpipe from S3. Large files cause slow loads, errors fail entire jobs, and debugging is hard. Which action will optimize the ingestion process?',
    options: [
      'Process all 5 TB of data using COPY INTO.',
      'Break the large file into smaller files.',
      'Process data continuously as it arrives.',
      'Use micro-batching for bulk processing with streaming for real-time data.',
    ],
    answer: 'Break the large file into smaller files.',
    exp: 'Snowflake recommends splitting large files into 100–250 MB compressed chunks for Snowpipe. This enables parallel loading across nodes, isolates errors to individual files (Snowpipe SKIP_FILE default), and dramatically simplifies debugging.',
  },

  {
    id: 's2d01_05',
    domain: 3,
    topic: 'User Stage Path Syntax',
    difficulty: 'easy',
    q: 'A user needs to upload sales.csv from their local machine into their personal default stage inside a folder named current_data. Which command should the user run?',
    options: [
      'PUT file:///sales.csv @current_data',
      'PUT file:///sales.csv @~/current_data',
      'PUT file:///sales.csv #%current_data',
      'PUT \'file:///sales.csv\' @current_data',
    ],
    answer: 'PUT file:///sales.csv @~/current_data',
    exp: 'The user stage is referenced with @~ (tilde). To place files in a subfolder, append /folder_name → @~/current_data. @current_data points to a NAMED stage (not a user stage). #%table_name is invalid syntax (the table-stage form is @%table_name).',
  },

  {
    id: 's2d01_09',
    domain: 3,
    topic: 'STRIP_OUTER_ARRAY for JSON',
    difficulty: 'easy',
    q: 'COPY INTO <table> is loading staged JSON data but it all goes into a single row. What FILE_FORMAT parameter will load the data into separate table rows?',
    options: [
      'PARSE_HEADER',
      'STRIP_OUTER_ARRAY',
      'FIELD_OPTIONALLY_ENCLOSED_BY',
      'STRIP_OUTER_ELEMENT',
    ],
    answer: 'STRIP_OUTER_ARRAY',
    exp: 'When JSON data is wrapped in an outer array [...], COPY INTO treats the entire array as one VARIANT row. STRIP_OUTER_ARRAY = TRUE removes the outer brackets so each array element becomes its own row. STRIP_OUTER_ELEMENT is not a real option.',
  },

  {
    id: 's2d01_19',
    domain: 3,
    topic: 'OBJECT_CONSTRUCT — Unload to JSON',
    difficulty: 'medium',
    q: 'A user needs to convert relational table rows to a VARIANT column and unload into a file. Which function should be used in the COPY command?',
    options: [
      'TO_VARIANT',
      'PARSE_JSON',
      'CHECK_JSON',
      'OBJECT_CONSTRUCT',
    ],
    answer: 'OBJECT_CONSTRUCT',
    exp: 'OBJECT_CONSTRUCT(*) (or with explicit key/value pairs) builds a single VARIANT/OBJECT from columns, ideal for unloading relational data as JSON. TO_VARIANT casts a single value. PARSE_JSON converts a string TO VARIANT (opposite direction). CHECK_JSON validates only.',
  },

  {
    id: 's2d01_23',
    domain: 3,
    topic: 'FLATTEN — Semi-Structured to Relational',
    difficulty: 'easy',
    q: 'Which function can be used to convert semi-structured data into a relational representation?',
    options: [
      'FLATTEN',
      'OBJECT_KEYS',
      'PARSE_JSON',
      'ARRAYS_TO_OBJECT',
    ],
    answer: 'FLATTEN',
    exp: 'FLATTEN explodes arrays/objects into rows with KEY, VALUE, PATH, INDEX, SEQ, THIS columns — turning semi-structured into relational form. Use with LATERAL. OBJECT_KEYS returns the keys of an object as an array. PARSE_JSON converts a string to VARIANT. ARRAYS_TO_OBJECT zips two arrays into an object.',
  },

  {
    id: 's2d01_26',
    domain: 3,
    topic: 'COPY INTO — Optimal File Strategy',
    difficulty: 'medium',
    q: 'A user needs to ingest 1 GB of data from an external stage using COPY INTO. How can this be done with MAXIMUM performance and LEAST cost?',
    options: [
      'Ingest the data in a compressed format as a single file.',
      'Ingest the data in an uncompressed format as a single file.',
      'Split the file into smaller files of 100-250 MB each, compress and ingest each of the smaller files.',
      'Split the file into smaller files of 100-250 MB each and ingest each of the smaller files in an uncompressed format.',
    ],
    answer: 'Split the file into smaller files of 100-250 MB each, compress and ingest each of the smaller files.',
    exp: 'Best practice: 100–250 MB COMPRESSED chunks. Splitting enables parallel loading across warehouse nodes; compression reduces transfer + storage costs. A single file (compressed or not) cannot be parallelized.',
  },

  {
    id: 's2d01_34',
    domain: 3,
    topic: 'Snowpipe METADATA$START_SCAN_TIME',
    difficulty: 'medium',
    q: 'When using COPY INTO <table> with Snowpipe, setting which parameter will provide additional record loading information?',
    options: [
      'SYSTIMESTAMP',
      'METADATA$START_SCAN_TIME',
      'LOCALTIMESTAMP',
      'CURRENT_TIMESTAMP',
    ],
    answer: 'METADATA$START_SCAN_TIME',
    exp: 'METADATA$START_SCAN_TIME is a pseudo-column available during COPY/Snowpipe ingestion that records when the scan of each file began — useful for ingestion-time tracking. SYSTIMESTAMP, LOCALTIMESTAMP, CURRENT_TIMESTAMP are session/wallclock functions, not file-scan metadata.',
  },

  // ── DOMAIN 4: Performance Optimization (9 questions) ───────────────────────

  {
    id: 's2d01_06',
    domain: 4,
    topic: 'Spilling — Recommended Fixes',
    difficulty: 'medium',
    multi: true,
    q: 'What are the recommended steps to address poor SQL query performance due to data spilling? (Select TWO)',
    options: [
      'Clone the base table.',
      'Fetch required attributes only.',
      'Use a larger virtual warehouse.',
      'Process the data in smaller batches.',
      'Add another cluster in the virtual warehouse.',
    ],
    answer: 'Use a larger virtual warehouse.',
    answers: [
      'Use a larger virtual warehouse.',
      'Fetch required attributes only.',
    ],
    exp: 'Spilling = warehouse out of memory. Fixes: (1) Scale UP to a larger warehouse for more memory. (2) Reduce data volume by selecting only required columns. Cloning doesn\'t help. Multi-cluster (Scale OUT) addresses CONCURRENCY (queueing), not per-query memory pressure.',
  },

  {
    id: 's2d01_11',
    domain: 4,
    topic: 'Clustering — When to Apply',
    difficulty: 'medium',
    multi: true,
    q: 'Which factors indicate that a table may benefit from clustering? (Select TWO)',
    options: [
      'The table is 1 TB or larger.',
      'The table is an external table.',
      'The response time is greater than 10 seconds.',
      'The table is queried with many different filters on different columns.',
      'A large number of micro-partitions are scanned but just a subset of data is retrieved.',
    ],
    answer: 'The table is 1 TB or larger.',
    answers: [
      'The table is 1 TB or larger.',
      'A large number of micro-partitions are scanned but just a subset of data is retrieved.',
    ],
    exp: 'Clustering pays off when: (1) tables are multi-TB (typically 1 TB+) so reclustering serverless cost is justified, and (2) Query Profile shows poor pruning — many partitions scanned but few rows returned. External tables can\'t be clustered. Many different filter columns makes choosing one clustering key futile. Response time alone is not an indicator.',
  },

  {
    id: 's2d01_13',
    domain: 4,
    topic: 'DML That Triggers Re-clustering',
    difficulty: 'medium',
    multi: true,
    q: 'If a table has a clustering key defined, which DML operations will trigger re-clustering? (Select TWO)',
    options: [
      'SELECT',
      'MERGE',
      'COPY',
      'SHOW',
      'DESCRIBE',
    ],
    answer: 'MERGE',
    answers: ['MERGE', 'COPY'],
    exp: 'Automatic re-clustering is triggered by data-modifying operations. MERGE updates rows. COPY INTO loads new rows. SELECT/SHOW/DESCRIBE are read-only. Re-clustering uses serverless credits, billed separately from your warehouse.',
  },

  {
    id: 's2d01_14',
    domain: 4,
    topic: 'Clustering — Most Beneficial Operations',
    difficulty: 'medium',
    multi: true,
    q: 'Based on a Query Profile, which scenarios will benefit MOST from a clustering key? (Select TWO)',
    options: [
      'A column that appears most frequently in ORDER BY operations',
      'A column that appears most frequently in WHERE operations',
      'A column that appears most frequently in GROUP BY operations',
      'A column that appears most frequently in AGGREGATE operations',
      'A column that appears most frequently in JOIN operations',
    ],
    answer: 'A column that appears most frequently in WHERE operations',
    answers: [
      'A column that appears most frequently in WHERE operations',
      'A column that appears most frequently in JOIN operations',
    ],
    exp: 'Clustering improves PRUNING — partition elimination BEFORE data is scanned. WHERE clauses and JOIN predicates filter early, so they benefit. ORDER BY, GROUP BY, and aggregations execute AFTER data is read — clustering doesn\'t help those operations.',
  },

  {
    id: 's2d01_16',
    domain: 4,
    topic: 'Clustering Key — Column Selection',
    difficulty: 'medium',
    multi: true,
    q: 'What type of columns does Snowflake recommend be used as clustering keys? (Select TWO)',
    options: [
      'A VARIANT column',
      'A column with very low cardinality',
      'A column with very high cardinality',
      'A column that is most actively used in selective filters',
      'A column that is most actively used in join predicates',
    ],
    answer: 'A column that is most actively used in selective filters',
    answers: [
      'A column that is most actively used in selective filters',
      'A column that is most actively used in join predicates',
    ],
    exp: 'Best clustering candidates: columns used in selective WHERE filters and JOIN predicates with low-to-medium cardinality. Very low cardinality (e.g., boolean) gives weak pruning. Very high cardinality (e.g., UUID) leads to constant reclustering. VARIANT directly is not recommended — extract a typed expression instead.',
  },

  {
    id: 's2d01_21',
    domain: 4,
    topic: 'Query Profile — Pruning Analysis',
    difficulty: 'medium',
    multi: true,
    q: 'Which attributes in a Query Profile would a user examine to determine if bad pruning is an issue? (Select TWO)',
    options: [
      'Scan progress',
      'Number of rows unloaded',
      'Partitions total',
      'Partitions scanned',
      'Percentage scanned from cache',
    ],
    answer: 'Partitions total',
    answers: ['Partitions total', 'Partitions scanned'],
    exp: 'Compare Partitions Scanned vs Partitions Total. If scanned ≈ total, pruning isn\'t working — consider clustering, rewrite filters, or add SOS. Scan progress is a real-time indicator. Rows unloaded applies to COPY INTO unload. % scanned from cache measures the SSD cache, separate from pruning.',
  },

  {
    id: 's2d01_29',
    domain: 4,
    topic: 'Result Cache — Storage Location',
    difficulty: 'easy',
    q: 'Where does Snowflake store the data output from a query executed in the past 24 hours?',
    options: [
      'In a micro-partition',
      'In a remote disk',
      'In the result cache',
      'In the local disk cache',
    ],
    answer: 'In the result cache',
    exp: 'Query results live in the result cache (in the Cloud Services layer) for 24 hours per reuse, up to a maximum of 31 days if continuously reused. This is a persistent, account-level cache — any warehouse can hit it. Micro-partitions store base data; local disk is the warehouse SSD cache (wiped on suspend).',
  },

  {
    id: 's2d01_37',
    domain: 4,
    topic: 'Result Cache — Determinism Requirements',
    difficulty: 'medium',
    q: 'Which query can benefit from the result cache when data hasn\'t changed since last execution?',
    options: [
      'SELECT customer_id as ID FROM Customers WHERE city = \'Chicago\';',
      'SELECT customer_id as ID FROM Customers WHERE state = ##state;',
      'SELECT UUID_STRING() as ID FROM Customers WHERE state = \'AZ\';',
      'SELECT customer_id as ID FROM Customers WHERE tag = UUID_STRING();',
    ],
    answer: 'SELECT customer_id as ID FROM Customers WHERE city = \'Chicago\';',
    exp: 'Result cache requires identical query text AND fully deterministic content. Option A is fully deterministic. B uses a session variable (changes the substituted text each call). C and D use UUID_STRING() — non-deterministic, never cached.',
  },

  {
    id: 's2d01_39',
    domain: 4,
    topic: 'Exploding Joins',
    difficulty: 'easy',
    q: 'Which use case is an example of an exploding join?',
    options: [
      'When a table is joined with itself and starts spilling',
      'When multiple tables are joined but records do not match',
      'When a table with a CTE is joined',
      'When multiple tables are joined without providing a join condition',
    ],
    answer: 'When multiple tables are joined without providing a join condition',
    exp: 'An exploding join (Cartesian product) happens when there\'s no proper join condition (or a non-selective one), so every row in one table matches every row in the other — output grows multiplicatively. Spilling is a memory symptom; CTEs are unrelated.',
  },

  // ── DOMAIN 5: Data Collaboration (3 questions) ─────────────────────────────

  {
    id: 's2d01_04',
    domain: 5,
    topic: 'Data Clean Rooms — Provider vs Consumer',
    difficulty: 'medium',
    multi: true,
    q: 'Which tasks correspond to the provider when two organizations want to work in collaboration and review data using a Data Clean Room? (Select TWO)',
    options: [
      'Join data in the target account',
      'Install the clean room',
      'Analyze data',
      'Add data to a clean room',
      'Create the clean room',
    ],
    answer: 'Create the clean room',
    answers: ['Create the clean room', 'Add data to a clean room'],
    exp: 'Provider tasks: CREATE the clean room and ADD (link) data to it. Consumer tasks: INSTALL (join) the clean room, link their own data, and ANALYZE using approved templates. Neither party sees the other\'s raw rows.',
  },

  {
    id: 's2d01_08',
    domain: 5,
    topic: 'Shareable Database Objects',
    difficulty: 'medium',
    multi: true,
    q: 'Which database objects can be shared with Secure Data Sharing? (Select TWO)',
    options: [
      'Views',
      'Materialized views',
      'External stages',
      'External tables',
      'Dynamic tables',
    ],
    answer: 'External tables',
    answers: ['External tables', 'Dynamic tables'],
    exp: 'Shareable: tables, external tables, dynamic tables, SECURE views, SECURE materialized views, SECURE UDFs, Iceberg tables. Standard (non-secure) views and MVs cannot be shared. Stages, sequences, file formats, pipes, tasks, streams, and warehouses are NOT shareable.',
  },

  {
    id: 's2d01_18',
    domain: 5,
    topic: 'SYSTEM$IS_LISTING_PURCHASED — Marketplace Gating',
    difficulty: 'hard',
    q: 'Which system function can manage access to data in a share and display certain data only to paying customers?',
    options: [
      'SYSTEM$ALLOWLIST',
      'SYSTEM$ALLOWLIST_PRIVATELINK',
      'SYSTEM$AUTHORIZE_PRIVATELINK',
      'SYSTEM$_LISTING_PURCHASED',
    ],
    answer: 'SYSTEM$_LISTING_PURCHASED',
    exp: 'SYSTEM$IS_LISTING_PURCHASED() (note option uses a shortened form) is used inside secure views/UDFs to gate access based on whether the consumer purchased the Marketplace listing. SYSTEM$ALLOWLIST returns IPs/hostnames Snowflake calls; the PRIVATELINK functions return PrivateLink config — none relate to listing payment status.',
  },

];
