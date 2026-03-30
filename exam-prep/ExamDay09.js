// ─────────────────────────────────────────────────────────────────────────────
// EXAM PREP — Day 9  (2026-03-16)
// COF-C03 Mock Exam · 60 questions
// Difficulty mix: ~30% Easy (17q) · ~50% Medium (30q) · ~20% Hard (13q)
//
// Domain distribution (standard):
//   D1 Architecture & Features       19q
//   D2 Account & Security            12q
//   D3 Data Movement                 11q
//   D4 Query Performance             13q
//   D5 Data Sharing & Collab          5q
//
// Answer positions: A=15  B=15  C=15  D=15
//
// OVERLAP RULE:
//   Day 8 (N-1): ≤ 30% overlap (≤ 18 questions)
//   Day 7 (N-2): ≤ 20% overlap (≤ 12 questions)
//   Day 6 (N-3): ≤ 10% overlap (≤  6 questions)
// ─────────────────────────────────────────────────────────────────────────────

export const DAY_META = {
  day: 9,
  date: '2026-03-16',
  label: 'Day 9 — Standard Practice',
  totalQuestions: 60,
  timeMinutes: 115,
};

export const QUESTIONS = [

  // ── DOMAIN 1: Architecture & Features (19 questions) ─────────────────────

  {
    id: 'd1_d9_01',
    domain: 1,
    topic: 'Storage Layer',
    difficulty: 'easy',
    q: 'Where does Snowflake physically store table data?',
    options: [
      'In compressed, columnar micro-partition files in cloud object storage (S3, Azure Blob, or GCS) — fully managed by Snowflake and independent of compute',
      'On local SSDs attached to virtual warehouse nodes — data is co-located with compute for fast access',
      'In a shared NFS filesystem co-located with the Cloud Services layer',
      'On Snowflake-proprietary hardware in private data centres adjacent to cloud regions',
    ],
    answer: 'In compressed, columnar micro-partition files in cloud object storage (S3, Azure Blob, or GCS) — fully managed by Snowflake and independent of compute',
    exp: 'Snowflake\'s shared-disk storage layer persists all data as encrypted, compressed columnar files in the cloud provider\'s object storage. Because storage is fully decoupled from compute, warehouses of any size can access the same data, and storage is billed independently at cloud object-storage rates regardless of whether any warehouse is running.',
  },

  {
    id: 'd1_d9_02',
    domain: 1,
    topic: 'External Tables',
    difficulty: 'easy',
    q: 'What is the defining characteristic of an EXTERNAL TABLE in Snowflake compared with a regular permanent table?',
    options: [
      'External tables support up to 30 days of Time Travel; regular tables support up to 90 days',
      'External tables can only be queried by the ACCOUNTADMIN role; regular tables use standard RBAC',
      'The data for an external table lives in files in cloud storage outside Snowflake\'s managed storage — Snowflake provides a query layer but does not own or persist the data',
      'External tables use virtual warehouse compute while regular tables use serverless compute',
    ],
    answer: 'The data for an external table lives in files in cloud storage outside Snowflake\'s managed storage — Snowflake provides a query layer but does not own or persist the data',
    exp: 'An external table is a read-only, schema-on-read overlay on files already stored in cloud object storage (e.g., S3). Snowflake reads the files at query time via a named external stage but never copies or manages them. Because Snowflake does not control the data, external tables offer 0 days of Time Travel and no Fail-safe.',
  },

  {
    id: 'd1_d9_03',
    domain: 1,
    topic: 'Warehouse Privileges',
    difficulty: 'easy',
    q: 'A user is granted the USAGE privilege on a virtual warehouse. What does that allow them to do?',
    options: [
      'Start, stop, resize, and modify the warehouse configuration',
      'Submit queries to run on the warehouse and view its current status',
      'View query history for all users who have executed queries on the warehouse',
      'Change the warehouse\'s AUTO_SUSPEND and AUTO_RESUME settings',
    ],
    answer: 'Submit queries to run on the warehouse and view its current status',
    exp: 'USAGE on a warehouse is the minimum privilege needed to execute queries against it. It does not grant the ability to modify warehouse properties (that requires MODIFY), view other users\' query history (query history visibility is governed by account parameters), or start/stop the warehouse on demand (that requires OPERATE). Typically, end-user roles receive USAGE only.',
  },

  {
    id: 'd1_d9_04',
    domain: 1,
    topic: 'Snowflake Interfaces',
    difficulty: 'easy',
    q: 'Which Snowflake interface is BEST suited for scripting and automating Snowflake operations from a terminal or CI/CD pipeline?',
    options: [
      'Snowsight — the browser-based UI designed for interactive analytics and dashboards',
      'The JDBC driver — connects third-party BI tools to Snowflake using the standard protocol',
      'The Snowflake REST SQL API — a REST-based API for executing SQL statements over HTTP',
      'SnowSQL — a command-line SQL client that supports scripting, named variables, output formatting, and non-interactive execution for automation',
    ],
    answer: 'SnowSQL — a command-line SQL client that supports scripting, named variables, output formatting, and non-interactive execution for automation',
    exp: 'SnowSQL is Snowflake\'s official CLI client. It supports connection profiles, variable substitution, file output, and can execute SQL files non-interactively — making it ideal for shell scripts and CI/CD pipelines. Snowsight is a GUI tool, the REST API requires HTTP client setup, and the JDBC driver is intended for Java applications and BI tools, not scripting.',
  },

  {
    id: 'd1_d9_05',
    domain: 1,
    topic: 'Object Hierarchy',
    difficulty: 'easy',
    q: 'In Snowflake\'s object hierarchy, what is a SCHEMA?',
    options: [
      'A logical container within a database that groups related objects (tables, views, stages, UDFs, etc.) — the second level below a database in the three-level hierarchy',
      'A definition file that describes the column names and data types for a table',
      'An account-level construct that holds multiple databases in a single namespace',
      'A synonym for a database in Snowflake — schemas and databases are interchangeable terms',
    ],
    answer: 'A logical container within a database that groups related objects (tables, views, stages, UDFs, etc.) — the second level below a database in the three-level hierarchy',
    exp: 'Snowflake uses a three-level namespace: Account → Database → Schema. A schema groups related objects and is referenced as database.schema.object_name. Every new database automatically receives two schemas: INFORMATION_SCHEMA (system metadata views) and PUBLIC (a default schema for user objects). Access control can be set at the schema level, making it a natural boundary for data domains or teams.',
  },

  {
    id: 'd1_d9_06',
    domain: 1,
    topic: 'Edition Features',
    difficulty: 'easy',
    q: 'Which of the following features requires Snowflake Enterprise edition (or higher) and is NOT available on Standard edition?',
    options: [
      'Time Travel for up to 1 day on permanent tables',
      'Snowpipe for continuous data loading',
      'Materialized Views — creating and querying MVs requires Enterprise edition or higher',
      'Zero-copy cloning of tables and databases',
    ],
    answer: 'Materialized Views — creating and querying MVs requires Enterprise edition or higher',
    exp: 'Materialized Views are an Enterprise feature. Standard edition supports Time Travel (up to 1 day), Snowpipe, and zero-copy cloning. Enterprise unlocks Materialized Views, Search Optimization Service, multi-cluster warehouses, column-level security (Dynamic Data Masking), and extended Time Travel (up to 90 days). Business Critical adds failover, Tri-Secret Secure, and enhanced compliance features.',
  },

  {
    id: 'd1_d9_07',
    domain: 1,
    topic: 'Horizon — Security & Governance',
    difficulty: 'medium',
    q: 'Which features belong to the SECURITY & GOVERNANCE pillar of the Snowflake Horizon framework?',
    options: [
      'Snowflake Marketplace, Private Data Exchange, and Data Clean Rooms',
      'Dynamic Data Masking, Row Access Policies, Network Policies, MFA enforcement, and Trust Center — tools for controlling who can see which data and auditing that access',
      'SYSTEM$CLASSIFY, object tagging, and data lineage visualization',
      'Aggregation Policies, Projection Policies, and privacy-preserving join techniques',
    ],
    answer: 'Dynamic Data Masking, Row Access Policies, Network Policies, MFA enforcement, and Trust Center — tools for controlling who can see which data and auditing that access',
    exp: 'Snowflake Horizon organizes governance capabilities into four pillars: Discovery (tagging, classification, lineage), Security & Governance (masking, row access, network policies, MFA, Trust Center scanners), Privacy (aggregation policies, projection policies, Data Clean Rooms), and Collaboration (Marketplace, shares, Native Apps). Each pillar targets a different aspect of responsible data management.',
  },

  {
    id: 'd1_d9_08',
    domain: 1,
    topic: 'Cortex AI — COMPLETE',
    difficulty: 'medium',
    q: 'What does the SNOWFLAKE.CORTEX.COMPLETE function enable in Snowflake SQL?',
    options: [
      'Automatically completes partial SQL queries using an LLM-based SQL writing assistant',
      'Optimizes stored procedure code by rewriting it for better warehouse performance',
      'Generates Snowflake Data Catalog descriptions for tables and columns automatically',
      'Calls a large language model (e.g., Mistral, Llama, Arctic) directly from SQL to generate text, summarise, translate, classify, or perform NLP tasks on Snowflake data',
    ],
    answer: 'Calls a large language model (e.g., Mistral, Llama, Arctic) directly from SQL to generate text, summarise, translate, classify, or perform NLP tasks on Snowflake data',
    exp: 'CORTEX.COMPLETE(model_name, prompt) is a scalar SQL function that invokes a hosted LLM without leaving Snowflake. The model runs on Snowflake\'s Cortex AI compute — data never leaves the Snowflake perimeter. Common use cases include text summarisation (SUMMARIZE shortcut), sentiment analysis, email generation from row data, and language translation. Billing is per token consumed.',
  },

  {
    id: 'd1_d9_09',
    domain: 1,
    topic: 'Snowflake Notebooks',
    difficulty: 'medium',
    q: 'Snowflake Notebooks let users write SQL and Python cells interactively in Snowsight. What compute resource executes the Python (Snowpark) cells?',
    options: [
      'The virtual warehouse connected to the notebook session — Python (Snowpark) code runs as a Snowpark workload on the warehouse\'s nodes',
      'A dedicated serverless Python sandbox separate from virtual warehouses — no warehouse credits are consumed for Python cells',
      'Cortex AI compute — notebook Python cells always use the AI-optimised compute tier',
      'Local browser compute via WebAssembly — Snowflake offloads lightweight Python to the client',
    ],
    answer: 'The virtual warehouse connected to the notebook session — Python (Snowpark) code runs as a Snowpark workload on the warehouse\'s nodes',
    exp: 'Snowflake Notebooks execute Python code using the Snowpark engine on the virtual warehouse selected for the session (or a Snowpark-optimised warehouse for heavy ML work). SQL cells also run on that warehouse. Because compute is tied to a warehouse, Python cell costs are measured in warehouse credits. For GPU or ML-heavy workloads, a Snowpark Container Services runtime can optionally be used instead.',
  },

  {
    id: 'd1_d9_10',
    domain: 1,
    topic: 'Multi-cluster Warehouses — MAXIMIZED',
    difficulty: 'medium',
    q: 'A multi-cluster warehouse is configured with MIN_CLUSTER_COUNT = MAX_CLUSTER_COUNT = 4 and SCALING_POLICY = STANDARD. What does this configuration create?',
    options: [
      'A warehouse that auto-scales from 1 to 4 clusters based on queue depth',
      'An invalid configuration — MIN and MAX cluster counts must differ for a multi-cluster warehouse',
      'MAXIMIZED mode — all 4 clusters run constantly regardless of load, guaranteeing maximum concurrency at the cost of always consuming credits for 4 clusters',
      'A warehouse that activates all 4 clusters only during peak hours defined in the warehouse schedule',
    ],
    answer: 'MAXIMIZED mode — all 4 clusters run constantly regardless of load, guaranteeing maximum concurrency at the cost of always consuming credits for 4 clusters',
    exp: 'When MIN_CLUSTER_COUNT = MAX_CLUSTER_COUNT = N, the warehouse is in MAXIMIZED mode: N clusters are always running and no auto-scaling occurs. This eliminates cluster spin-up latency but you pay for all N clusters at all times. AUTO mode (MIN < MAX) starts with MIN clusters and scales out on queue pressure. MAXIMIZED is appropriate when consistent low-latency at high concurrency is more important than cost optimisation.',
  },

  {
    id: 'd1_d9_11',
    domain: 1,
    topic: 'Table Types — Temporary vs Transient',
    difficulty: 'medium',
    q: 'What is the key difference between a TEMPORARY table and a TRANSIENT table in Snowflake?',
    options: [
      'Temporary tables are only available in Enterprise edition; transient tables are available on all editions',
      'Temporary tables are session-scoped — they exist only for the duration of the creating session and are invisible to other sessions; transient tables persist across sessions like permanent tables but have no Fail-safe and at most 1 day of Time Travel',
      'Temporary tables support up to 7 days of Time Travel; transient tables support 0 days',
      'Temporary tables use external cloud storage; transient tables use Snowflake\'s internal storage',
    ],
    answer: 'Temporary tables are session-scoped — they exist only for the duration of the creating session and are invisible to other sessions; transient tables persist across sessions like permanent tables but have no Fail-safe and at most 1 day of Time Travel',
    exp: 'Temporary tables provide session isolation: they are created, used, and automatically dropped within a single session. No other session sees them. Transient tables behave like regular permanent tables (cross-session, visible to others with the right privileges) but trade the 7-day Fail-safe for a lower storage cost — useful for staging or ETL tables where paying for recovery storage is unnecessary.',
  },

  {
    id: 'd1_d9_12',
    domain: 1,
    topic: 'Apache Iceberg Tables',
    difficulty: 'medium',
    q: 'A team wants an Apache Iceberg table in Snowflake where they need full DML support (INSERT, UPDATE, DELETE, MERGE). Which catalog type should they use?',
    options: [
      'External catalog (e.g., AWS Glue) — external catalogs provide the most complete DML support for Iceberg tables',
      'Hive Metastore catalog — the open-source catalog enables all DML operations on Iceberg tables',
      'Object Storage catalog — direct metadata access without a catalog layer unlocks all DML operations',
      'Snowflake-managed Iceberg catalog — when Snowflake acts as the catalog, full DML is supported. External catalogs (Glue, HMS) provide read-only access in Snowflake.',
    ],
    answer: 'Snowflake-managed Iceberg catalog — when Snowflake acts as the catalog, full DML is supported. External catalogs (Glue, HMS) provide read-only access in Snowflake.',
    exp: 'Snowflake supports Iceberg tables in two modes. With Snowflake-managed catalog, Snowflake owns the Iceberg metadata and enables full DML (INSERT, UPDATE, DELETE, MERGE), automatic compaction, and Time Travel. With an external catalog (AWS Glue, Hive Metastore), Snowflake can query the table but only in read-only mode because it does not control the metadata. Teams needing writes must use the Snowflake-managed path.',
  },

  {
    id: 'd1_d9_13',
    domain: 1,
    topic: 'Snowflake Data Cloud',
    difficulty: 'medium',
    q: 'What is the Snowflake "Data Cloud" concept?',
    options: [
      'A global network where data can be seamlessly and securely shared, exchanged, and monetised across organisations, industries, and cloud platforms — powered by the Marketplace, Secure Sharing, and Data Clean Rooms to eliminate data silos',
      'Snowflake\'s proprietary cloud storage service that competes with AWS S3 and Azure Blob Storage',
      'A compute pooling system where multiple Snowflake accounts share virtual warehouse resources across accounts',
      'The branding for Snowflake\'s highest-tier edition (above Business Critical)',
    ],
    answer: 'A global network where data can be seamlessly and securely shared, exchanged, and monetised across organisations, industries, and cloud platforms — powered by the Marketplace, Secure Sharing, and Data Clean Rooms to eliminate data silos',
    exp: 'The Snowflake Data Cloud is a strategic vision, not a specific product tier or feature. It describes an interconnected ecosystem of Snowflake accounts that can share live data without copying it (Secure Data Sharing), discover and access third-party datasets (Marketplace), and collaborate while preserving privacy (Data Clean Rooms). This cross-cloud, cross-organisation data network is the platform\'s differentiating concept.',
  },

  {
    id: 'd1_d9_14',
    domain: 1,
    topic: 'Fail-safe — Table Types',
    difficulty: 'medium',
    q: 'Which statement correctly describes Fail-safe periods across different Snowflake table types?',
    options: [
      'All table types have the same 7-day Fail-safe period regardless of type',
      'Permanent tables = 7 days Fail-safe, Transient tables = 3 days, Temporary tables = 1 day',
      'Permanent tables have 7 days of Fail-safe; both TRANSIENT and TEMPORARY tables have 0 days of Fail-safe',
      'Fail-safe is only available on Enterprise edition; Standard edition tables have no Fail-safe regardless of type',
    ],
    answer: 'Permanent tables have 7 days of Fail-safe; both TRANSIENT and TEMPORARY tables have 0 days of Fail-safe',
    exp: 'Fail-safe is a fixed 7-day disaster recovery window provided automatically for PERMANENT tables — data is recoverable by Snowflake Support only. TRANSIENT and TEMPORARY tables sacrifice Fail-safe entirely (0 days) in exchange for lower storage costs and session-scoped lifecycle. Because transient/temporary tables are designed for ephemeral or intermediate data, paying for Fail-safe storage would be wasteful.',
  },

  {
    id: 'd1_d9_15',
    domain: 1,
    topic: 'Time Travel — Dynamic Table Reference',
    difficulty: 'hard',
    q: 'A stored procedure must run a Time Travel query but the table name is stored in a session variable (let tbl = \'orders\'). Which syntax correctly resolves the variable as a table identifier with an AT modifier?',
    options: [
      'SELECT * FROM :tbl AT(OFFSET => -3600) — colon-bind syntax works for table names in Time Travel queries',
      'SELECT * FROM IDENTIFIER(:tbl) AT(OFFSET => -3600) — IDENTIFIER() resolves a variable string to an object name and is compatible with Time Travel modifiers',
      'SELECT * FROM TABLE(:tbl) AT(OFFSET => -3600) — TABLE() resolves string variables to table references in any SQL context',
      'EXECUTE IMMEDIATE \'SELECT * FROM \' || tbl || \' AT(OFFSET => -3600)\' — dynamic SQL is the only option for variable table names with Time Travel',
    ],
    answer: 'SELECT * FROM IDENTIFIER(:tbl) AT(OFFSET => -3600) — IDENTIFIER() resolves a variable string to an object name and is compatible with Time Travel modifiers',
    exp: 'The IDENTIFIER() pseudo-function allows variable strings to be used wherever Snowflake expects a static object name — including in FROM clauses combined with AT/BEFORE Time Travel modifiers. Colon-binding (:tbl) works for binding literal values in DML, not object names. TABLE() is used to call a table function, not to dereference a string as a table name. EXECUTE IMMEDIATE would work but is the less idiomatic approach when IDENTIFIER() suffices.',
  },

  {
    id: 'd1_d9_16',
    domain: 1,
    topic: 'Micro-partitions — Data Loading Order',
    difficulty: 'hard',
    q: 'A large table has NO clustering key. Data is loaded in daily batches via COPY INTO, each batch adding ~1 million rows. How are the resulting micro-partitions physically organised?',
    options: [
      'Micro-partitions are globally sorted by the first non-NULL column value as Snowflake automatically sorts at each load',
      'Micro-partitions are ordered by insertion timestamp — each batch produces partitions sorted by load time only',
      'All micro-partitions from all loads are merged and globally re-sorted nightly by Snowflake\'s background maintenance service',
      'New micro-partitions are created per batch in roughly the natural insertion order — without a clustering key, no global sorting occurs; partition boundaries follow the data as it arrives, potentially interleaving value ranges across partitions',
    ],
    answer: 'New micro-partitions are created per batch in roughly the natural insertion order — without a clustering key, no global sorting occurs; partition boundaries follow the data as it arrives, potentially interleaving value ranges across partitions',
    exp: 'Snowflake creates micro-partitions as data is ingested, preserving natural insertion order within each batch. Without a clustering key, there is no post-load sort; value ranges across partitions overlap over time, reducing pruning effectiveness for range predicates. Adding a clustering key triggers Automatic Clustering (background service) to reorganise partitions so that value ranges are aligned, improving pruning. The CLUSTER_BY expression explicitly defines the desired physical order.',
  },

  {
    id: 'd1_d9_17',
    domain: 1,
    topic: 'Warehouse Query Queue',
    difficulty: 'hard',
    q: 'A single-cluster virtual warehouse is fully occupied. Two queries arrive simultaneously: one submitted by a SYSADMIN role and one by an ANALYST role. Is there a built-in query priority mechanism?',
    options: [
      'Queries are processed in strict FIFO arrival order regardless of role — Snowflake warehouses have no priority mechanism; workload isolation is achieved through separate warehouses instead',
      'System-defined roles (SYSADMIN, ACCOUNTADMIN) always receive higher queue priority over custom roles',
      'The larger query (by estimated cost) is always executed first to maximise warehouse utilisation efficiency',
      'Snowflake uses a round-robin scheduler that alternates between concurrently queued queries from different roles',
    ],
    answer: 'Queries are processed in strict FIFO arrival order regardless of role — Snowflake warehouses have no priority mechanism; workload isolation is achieved through separate warehouses instead',
    exp: 'Snowflake\'s standard virtual warehouses queue overflowing queries in FIFO order with no role-based priority. The recommended pattern for mixing latency-sensitive and batch workloads is dedicated warehouses per workload type (e.g., a small ANALYST warehouse for interactive queries, a LARGE BATCH warehouse for ETL). Resource Monitors and warehouse auto-suspend/resume complement this separation. There is no built-in priority queue within a single warehouse.',
  },

  {
    id: 'd1_d9_18',
    domain: 1,
    topic: 'Horizon — Four Pillars',
    difficulty: 'hard',
    q: 'The Snowflake Horizon framework is organised into four pillars. Which answer correctly matches each pillar to its primary features?',
    options: [
      'Discovery (object tagging, data classification, lineage, quality), Security & Governance (DDM, RAP, network policies, Trust Center), Privacy (Aggregation Policy, Projection Policy, Clean Rooms), Collaboration (Secure Sharing, Marketplace, Native Apps)',
      'Tagging (tags, classification), Masking (DDM, RAP), Sharing (Marketplace, Exchange), Governance (RBAC, Network Policies)',
      'Discovery (tagging, lineage, data quality), Compliance (HIPAA, SOC 2 readiness), Security (network policies, MFA), Collaboration (sharing, marketplace)',
      'Tagging pillar, Policy pillar, Sharing pillar, Audit pillar — the four governance pillars of Horizon',
    ],
    answer: 'Discovery (object tagging, data classification, lineage, quality), Security & Governance (DDM, RAP, network policies, Trust Center), Privacy (Aggregation Policy, Projection Policy, Clean Rooms), Collaboration (Secure Sharing, Marketplace, Native Apps)',
    exp: 'Snowflake Horizon\'s four pillars are: (1) Discovery — find and understand data assets via tags, SYSTEM$CLASSIFY, lineage, and data quality metrics; (2) Security & Governance — enforce who can see what via masking, row access, network policies, RBAC, and Trust Center; (3) Privacy — minimise re-identification risk with aggregation policies, projection policies, and Clean Rooms; (4) Collaboration — share and monetise data via Secure Data Sharing, Marketplace listings, and Native Apps.',
  },

  {
    id: 'd1_d9_19',
    domain: 1,
    topic: 'Snowpark vs Python Connector',
    difficulty: 'hard',
    q: 'A Python developer asks when to choose Snowpark Python over the Snowflake Python Connector. What is the key architectural difference?',
    options: [
      'The Python Connector is read-only; Snowpark enables writes and DDL operations',
      'Snowpark provides a DataFrame API that builds and executes data pipelines INSIDE Snowflake (pushdown to warehouse); the Python Connector is a thin driver for issuing SQL commands FROM a Python client — Snowpark for transformation logic, Connector for command execution',
      'The Python Connector requires Business Critical edition; Snowpark is available on all editions',
      'Snowpark and the Python Connector are the same library with different import paths maintained for backward compatibility',
    ],
    answer: 'Snowpark provides a DataFrame API that builds and executes data pipelines INSIDE Snowflake (pushdown to warehouse); the Python Connector is a thin driver for issuing SQL commands FROM a Python client — Snowpark for transformation logic, Connector for command execution',
    exp: 'The Python Connector behaves like JDBC/ODBC: you write SQL as strings, send them to Snowflake, and get results back. Snowpark is a high-level API where you compose transformations using DataFrame operations; Snowflake translates the DataFrame plan to SQL and executes it in the warehouse. Snowpark is preferred for data engineering pipelines (ETL, ML feature prep) because data stays in Snowflake. The Connector is preferred for administrative scripts, DDL automation, and lightweight query execution.',
  },

  // ── DOMAIN 2: Account Access & Security (12 questions) ────────────────────

  {
    id: 'd2_d9_01',
    domain: 2,
    topic: 'System Roles — SECURITYADMIN',
    difficulty: 'easy',
    q: 'What is the primary purpose of the SECURITYADMIN system-defined role in Snowflake?',
    options: [
      'Creating and managing virtual warehouses and assigning warehouse-level quotas',
      'Owning all databases, schemas, and tables by default for centralised data management',
      'Managing account-level security — creating and managing roles and users, granting/revoking privileges, and overseeing network and authentication policies. Includes the MANAGE GRANTS privilege and the USERADMIN role.',
      'Running account-level operations such as viewing billing, setting credit quotas, and enabling account features',
    ],
    answer: 'Managing account-level security — creating and managing roles and users, granting/revoking privileges, and overseeing network and authentication policies. Includes the MANAGE GRANTS privilege and the USERADMIN role.',
    exp: 'SECURITYADMIN is the role for security administration. It inherits USERADMIN (create/manage users and roles) and is additionally granted MANAGE GRANTS — allowing it to grant any privilege to any role. However, SECURITYADMIN does not own data objects (SYSADMIN does). Separating SECURITYADMIN from SYSADMIN follows the principle of least privilege: one role manages access control, another manages data.',
  },

  {
    id: 'd2_d9_02',
    domain: 2,
    topic: 'Access Control — DAC',
    difficulty: 'easy',
    q: 'In Snowflake\'s access control model, what is Discretionary Access Control (DAC)?',
    options: [
      'Each object has an owner, and that owner decides who else can access it — owners have discretion over grants on their own objects',
      'All access decisions are made centrally by ACCOUNTADMIN only; no other role can grant privileges',
      'A security model requiring two separate role approvals before any privilege is granted',
      'An access control method based on data sensitivity labels applied to columns',
    ],
    answer: 'Each object has an owner, and that owner decides who else can access it — owners have discretion over grants on their own objects',
    exp: 'Snowflake combines two models: Role-Based Access Control (RBAC) assigns privileges to roles, which are then assigned to users; Discretionary Access Control (DAC) means that the role owning an object controls who else gets access to it. In practice, the role that created (owns) a table can GRANT SELECT on it to other roles. This owner-centric model is \'discretionary\' because access decisions rest with the owning role rather than a central authority.',
  },

  {
    id: 'd2_d9_03',
    domain: 2,
    topic: 'Privilege Management',
    difficulty: 'easy',
    q: 'Which SQL statement removes the SELECT privilege on a table from a role in Snowflake?',
    options: [
      'REMOVE SELECT ON TABLE orders FROM ROLE analyst_role',
      'DROP PRIVILEGE SELECT FROM ROLE analyst_role ON TABLE orders',
      'DELETE GRANT SELECT ON TABLE orders TO ROLE analyst_role',
      'REVOKE SELECT ON TABLE orders FROM ROLE analyst_role',
    ],
    answer: 'REVOKE SELECT ON TABLE orders FROM ROLE analyst_role',
    exp: 'The REVOKE command is the standard SQL DDL for removing a previously granted privilege. Syntax: REVOKE <privilege> ON <object_type> <object_name> FROM ROLE <role_name>. REMOVE, DROP PRIVILEGE, and DELETE GRANT are not valid Snowflake SQL. Privileges can only be revoked by the role that granted them or by a role holding the MANAGE GRANTS privilege (SECURITYADMIN).',
  },

  {
    id: 'd2_d9_04',
    domain: 2,
    topic: 'System Roles — ORGADMIN',
    difficulty: 'medium',
    q: 'What is the ORGADMIN role in Snowflake?',
    options: [
      'A role spanning all databases and schemas in an account with full DML rights across all objects',
      'An organisation-level role that manages Snowflake accounts within the organisation — can create accounts, view aggregated usage across all accounts, enable replication and failover features, and access org-level billing',
      'A custom role typically created by large enterprises to manage multi-department data access governance',
      'The role assigned to the primary designated contact person for a Snowflake account\'s support tickets',
    ],
    answer: 'An organisation-level role that manages Snowflake accounts within the organisation — can create accounts, view aggregated usage across all accounts, enable replication and failover features, and access org-level billing',
    exp: 'ORGADMIN operates at the Snowflake Organization level — above the individual account. It allows creating new Snowflake accounts under the same organisation, viewing cross-account usage (SNOWFLAKE.ORGANIZATION_USAGE schema), enabling/disabling replication between accounts, and accessing org-level contracts and billing. Only accounts with the ORGADMIN feature enabled can use this role. It is distinct from ACCOUNTADMIN, which manages a single account.',
  },

  {
    id: 'd2_d9_05',
    domain: 2,
    topic: 'Aggregation Policy',
    difficulty: 'medium',
    q: 'An AGGREGATION POLICY is applied to a table with a minimum group size of 5. A user runs a GROUP BY query where one group contains only 3 rows. What happens?',
    options: [
      'The query fails with an "insufficient group size" access error',
      'The group of 3 rows is returned but with NULL values for all aggregate function columns',
      'The group of 3 rows is excluded from the result set — Aggregation Policies suppress groups below the minimum threshold to prevent re-identification of individuals',
      'The group is automatically merged with the nearest other group to satisfy the minimum size requirement',
    ],
    answer: 'The group of 3 rows is excluded from the result set — Aggregation Policies suppress groups below the minimum threshold to prevent re-identification of individuals',
    exp: 'Aggregation Policies enforce privacy-preserving query patterns. Groups with fewer rows than the policy\'s minimum group size are silently removed from query results. The policy does not throw an error or distort values — it simply omits the group entirely, which the analyst may or may not notice. This technique (k-anonymity enforcement) is common for queries on sensitive data such as healthcare records or employee surveys where small group sizes could reveal individual identities.',
  },

  {
    id: 'd2_d9_06',
    domain: 2,
    topic: 'Row Access Policy — IS_ROLE_IN_SESSION',
    difficulty: 'medium',
    q: 'A Row Access Policy must allow a user to see a row if the \'DATA_OWNER\' role is active as EITHER their primary role OR any of their secondary roles. Which function correctly handles both cases?',
    options: [
      'IS_ROLE_IN_SESSION(\'DATA_OWNER\') — returns TRUE if the specified role is active in the current session as either a primary or secondary role',
      'CURRENT_ROLE() = \'DATA_OWNER\' — checks only the current active primary role',
      'HAS_ROLE(\'DATA_OWNER\') — a dedicated function for role membership checking in RAP definitions',
      'INVOKER_ROLE() = \'DATA_OWNER\' — checks the role that invoked the current execution context',
    ],
    answer: 'IS_ROLE_IN_SESSION(\'DATA_OWNER\') — returns TRUE if the specified role is active in the current session as either a primary or secondary role',
    exp: 'CURRENT_ROLE() returns only the primary active role. When a user activates secondary roles (USE SECONDARY ROLES ALL), IS_ROLE_IN_SESSION() is the correct function to check whether a specific role is active in the session regardless of primary/secondary status. This is critical for Row Access Policies that need to honour all active roles. HAS_ROLE() is not a Snowflake built-in function; INVOKER_ROLE() is used in stored procedure contexts.',
  },

  {
    id: 'd2_d9_07',
    domain: 2,
    topic: 'Data Lineage — SYSTEM$GET_LINEAGE',
    difficulty: 'medium',
    q: 'A data engineer wants to programmatically retrieve all upstream source tables and views that feed into a specific view — to audit data dependencies before modifying a source table. Which function enables this?',
    options: [
      'SYSTEM$OBJECT_DEPENDENCIES(\'view_name\') — returns a JSON tree of all compile-time and runtime dependencies',
      'GET_DDL(\'VIEW\', \'view_name\') — the DDL text shows which source tables are referenced',
      'INFORMATION_SCHEMA.OBJECT_DEPENDENCIES — a standard view for querying object lineage relationships',
      'SYSTEM$GET_LINEAGE(\'VIEW\', \'MY_DB.MY_SCHEMA.MY_VIEW\', ...) — returns the data lineage graph for the specified object showing upstream sources and downstream consumers',
    ],
    answer: 'SYSTEM$GET_LINEAGE(\'VIEW\', \'MY_DB.MY_SCHEMA.MY_VIEW\', ...) — returns the data lineage graph for the specified object showing upstream sources and downstream consumers',
    exp: 'SYSTEM$GET_LINEAGE is a system function introduced with Snowflake Horizon that returns lineage information as a structured JSON/table result. It traverses both upstream (sources feeding the object) and downstream (objects consuming it) edges in the lineage graph. GET_DDL only shows the static SQL definition, missing runtime lineage. INFORMATION_SCHEMA.OBJECT_DEPENDENCIES does exist but SYSTEM$GET_LINEAGE is the dedicated lineage function for Horizon use cases.',
  },

  {
    id: 'd2_d9_08',
    domain: 2,
    topic: 'Trust Center',
    difficulty: 'medium',
    q: 'Snowflake\'s Trust Center includes a built-in security scanner. Against which security framework does it benchmark a Snowflake account\'s security configuration?',
    options: [
      'NIST CSF (Cybersecurity Framework) — the Trust Center maps all checks to NIST CSF categories',
      'CIS Benchmarks (Center for Internet Security) — the Trust Center scanner evaluates the account against CIS Benchmark controls specific to Snowflake security configuration',
      'OWASP Top 10 — the Trust Center focuses on application-layer vulnerabilities relevant to SQL queries',
      'SOC 2 Type II controls — the Trust Center acts as a direct audit readout of SOC 2 requirements',
    ],
    answer: 'CIS Benchmarks (Center for Internet Security) — the Trust Center scanner evaluates the account against CIS Benchmark controls specific to Snowflake security configuration',
    exp: 'Snowflake Trust Center\'s Security Essentials scanner measures your account against the CIS Snowflake Benchmark — a standardised set of security best-practice controls. The scanner checks for issues like MFA enforcement, network policy gaps, admin role overuse, and audit logging coverage. Results are displayed as pass/fail findings with remediation guidance. Organisations can also create custom scanner packages for their own internal policies.',
  },

  {
    id: 'd2_d9_09',
    domain: 2,
    topic: 'COPY GRANTS — CREATE OR REPLACE',
    difficulty: 'medium',
    q: 'A developer runs CREATE OR REPLACE TABLE orders_staging AS SELECT * FROM raw_orders. The original orders_staging had SELECT granted to the REPORTING role. Without COPY GRANTS, what happens to that grant?',
    options: [
      'The REPORTING role\'s SELECT grant is preserved — CREATE OR REPLACE carries all grants forward automatically',
      'The REPORTING role\'s SELECT grant is suspended and can be reactivated by running RESUME GRANT',
      'The REPORTING role loses its SELECT grant — CREATE OR REPLACE internally drops and recreates the object, revoking all non-ownership grants. Use COPY GRANTS to preserve them.',
      'Only DML grants (INSERT, UPDATE, DELETE) are revoked; SELECT is always preserved on CREATE OR REPLACE',
    ],
    answer: 'The REPORTING role loses its SELECT grant — CREATE OR REPLACE internally drops and recreates the object, revoking all non-ownership grants. Use COPY GRANTS to preserve them.',
    exp: 'CREATE OR REPLACE is semantically equivalent to DROP + CREATE. The old object is destroyed along with all its grants (except for the new owner who executes the statement). This is a common source of silent permission breakage in production environments. Adding COPY GRANTS to the statement copies all privilege grants from the old object to the newly created one, preventing downstream access disruption.',
  },

  {
    id: 'd2_d9_10',
    domain: 2,
    topic: 'Dynamic Data Masking — USING Clause',
    difficulty: 'medium',
    q: 'A masking policy needs to conditionally unmask an email column based on both the querying role AND a second column (customer_tier) in the same row. Which DDL feature enables cross-column conditional masking logic?',
    options: [
      'The USING clause in CREATE MASKING POLICY — it passes additional columns from the masked table as arguments to the policy function, enabling multi-column conditional logic',
      'The WHEN clause in CREATE MASKING POLICY — similar to a CASE expression evaluated at policy level',
      'A nested Row Access Policy applied before the masking policy evaluates',
      'CREATE CONDITIONAL MASKING POLICY — a separate DDL object type for multi-column masking conditions',
    ],
    answer: 'The USING clause in CREATE MASKING POLICY — it passes additional columns from the masked table as arguments to the policy function, enabling multi-column conditional logic',
    exp: 'By default, a masking policy function only receives the value of the masked column as an argument. The USING clause in ALTER TABLE ... MODIFY COLUMN ... SET MASKING POLICY policy_name USING (col1, col2, ...) passes additional column values to the policy function at query time. This allows the policy body to branch on session context AND row-level data simultaneously — for example, unmasking an email only if the caller is ANALYST and the row\'s customer_tier = \'PREMIUM\'.',
  },

  {
    id: 'd2_d9_11',
    domain: 2,
    topic: 'Encryption Key Rotation',
    difficulty: 'hard',
    q: 'An account admin triggers encryption key rotation for a Snowflake table. What actually happens to the physical data files?',
    options: [
      'All existing micro-partition files are immediately re-encrypted with the new key — users experience a brief read-only window during rotation',
      'The table is locked for ~15 minutes while Snowflake re-encrypts files in a background job',
      'New data files created after rotation use the new key; old files retain the old key until rewritten by DML',
      'Key rotation re-encrypts the table encryption key (TEK) in the key hierarchy rather than re-writing data files — the operation is fast and non-disruptive regardless of table size because data bytes do not change',
    ],
    answer: 'Key rotation re-encrypts the table encryption key (TEK) in the key hierarchy rather than re-writing data files — the operation is fast and non-disruptive regardless of table size because data bytes do not change',
    exp: 'Snowflake uses envelope encryption: each file is encrypted with a File Encryption Key (FEK), which is itself encrypted with a Table Encryption Key (TEK), which is encrypted with the Account Master Key. Key rotation re-wraps the TEK (and FEKs) in the hierarchy without touching the actual data bytes. This makes rotation fast even for petabyte-scale tables and causes no table downtime. For Tri-Secret Secure, rotation involves the customer-managed key in addition to Snowflake-managed keys.',
  },

  {
    id: 'd2_d9_12',
    domain: 2,
    topic: 'Row Access Policy — External Table References',
    difficulty: 'hard',
    q: 'A Row Access Policy needs to consult a separate permission lookup table (e.g., user_region_access) to decide which rows the current user can see. Can a Snowflake RAP body reference other tables?',
    options: [
      'No — Row Access Policies can only reference session context functions like CURRENT_ROLE() and CURRENT_USER(); querying external tables inside a policy is not supported',
      'Yes — RAP functions can query other Snowflake tables (e.g., permission lookup tables) in their SQL body, enabling dynamic row-level filtering driven by centralised permission data',
      'Only if the referenced table is in the same schema as the table the policy is attached to',
      'Yes — but only if the referenced table is a secure view, not a regular base table',
    ],
    answer: 'Yes — RAP functions can query other Snowflake tables (e.g., permission lookup tables) in their SQL body, enabling dynamic row-level filtering driven by centralised permission data',
    exp: 'Row Access Policy functions are SQL UDFs (or JavaScript UDFs) and can contain a SELECT statement that queries another table in their body. A common pattern is a central entitlement table (user → allowed_regions) that the RAP queries: RETURN EXISTS (SELECT 1 FROM access_control WHERE username = CURRENT_USER() AND region = val). Care must be taken to ensure the lookup table itself is secured and the policy role has access to it. Recursive policy loops should also be avoided.',
  },

  // ── DOMAIN 3: Data Movement (11 questions) ────────────────────────────────

  {
    id: 'd3_d9_01',
    domain: 3,
    topic: 'Stage Commands — GET',
    difficulty: 'easy',
    q: 'Which command downloads files from a Snowflake stage to the local file system?',
    options: [
      'PULL @my_stage/file.csv file:///local/path/ — downloads staged files to the local machine',
      'DOWNLOAD @my_stage/file.csv TO \'/local/path/\' — fetches files from stages to a local directory',
      'GET @my_stage/file.csv file:///local/path/ — the GET command transfers files from a named stage to local storage',
      'COPY OUT @my_stage/file.csv TO \'/local/path/\' — unloads stage files to the local file system',
    ],
    answer: 'GET @my_stage/file.csv file:///local/path/ — the GET command transfers files from a named stage to local storage',
    exp: 'GET is the inverse of PUT. PUT uploads local files to a Snowflake internal stage; GET downloads them back. Syntax: GET @stage_path local_file_uri. This command must be run via SnowSQL or the JDBC/ODBC driver — it is not available in Snowsight. External stage files cannot be retrieved with GET; only internal stage files are accessible through this command.',
  },

  {
    id: 'd3_d9_02',
    domain: 3,
    topic: 'COPY INTO — FORCE',
    difficulty: 'easy',
    q: 'A file was already loaded via COPY INTO 2 days ago (within the 64-day deduplication window). A data engineer needs to reload it to correct an upstream data error. Which COPY INTO option forces a reload?',
    options: [
      'COPY INTO my_table FROM @stage/file.csv FORCE = TRUE — bypasses the load history check and reloads the file even if it was previously loaded',
      'COPY INTO my_table FROM @stage/file.csv RELOAD = TRUE — the RELOAD option signals a forced re-execution',
      'COPY INTO my_table FROM @stage/file.csv ON_ERROR = RELOAD — treats the previously-loaded state as an error condition',
      'ALTER STAGE my_stage CLEAR LOAD_HISTORY — clears the history, then run COPY INTO normally',
    ],
    answer: 'COPY INTO my_table FROM @stage/file.csv FORCE = TRUE — bypasses the load history check and reloads the file even if it was previously loaded',
    exp: 'Snowflake maintains a 64-day load history per stage to deduplicate files. Normally, COPY INTO skips files already in that history. FORCE = TRUE overrides this safety check, allowing the file to be loaded again — useful for correction/replay scenarios. Note: FORCE = TRUE will insert duplicate rows if the table does not have deduplication logic (e.g., MERGE or a unique constraint equivalent). RELOAD and ON_ERROR = RELOAD are not valid COPY INTO options.',
  },

  {
    id: 'd3_d9_03',
    domain: 3,
    topic: 'Snowpipe — Load Audit',
    difficulty: 'easy',
    q: 'After a Snowpipe event loads files, where can an engineer query a detailed audit record of which files were loaded, row counts, and any error messages?',
    options: [
      'SHOW PIPES — the STATUS column contains per-file load details and error messages',
      'SNOWFLAKE.ACCOUNT_USAGE.COPY_HISTORY (or INFORMATION_SCHEMA.COPY_HISTORY for the last 14 days) — records every file load, status, error messages, and row counts for all COPY INTO and Snowpipe loads',
      'Snowpipe keeps its own internal error log accessible only via SYSTEM$PIPE_STATUS()',
      'SNOWFLAKE.ACCOUNT_USAGE.SNOWPIPE_HISTORY — a dedicated view for Snowpipe-specific metrics separate from COPY_HISTORY',
    ],
    answer: 'SNOWFLAKE.ACCOUNT_USAGE.COPY_HISTORY (or INFORMATION_SCHEMA.COPY_HISTORY for the last 14 days) — records every file load, status, error messages, and row counts for all COPY INTO and Snowpipe loads',
    exp: 'COPY_HISTORY consolidates load records from both batch COPY INTO and Snowpipe. ACCOUNT_USAGE.COPY_HISTORY retains 365 days of history with up to a 45-minute latency; INFORMATION_SCHEMA.COPY_HISTORY covers the last 14 days with no latency. SYSTEM$PIPE_STATUS() is useful for checking whether a pipe is running and its queue depth but does not provide per-file load records. There is no separate SNOWPIPE_HISTORY view — COPY_HISTORY serves both mechanisms.',
  },

  {
    id: 'd3_d9_04',
    domain: 3,
    topic: 'Storage Integration — STORAGE_ALLOWED_LOCATIONS',
    difficulty: 'medium',
    q: 'When creating a Storage Integration for an external stage, what is the purpose of the STORAGE_ALLOWED_LOCATIONS parameter?',
    options: [
      'Specifies the IAM roles that are permitted to assume the integration\'s identity when accessing storage',
      'Sets the maximum file size the integration is allowed to read from the cloud storage location',
      'Defines the encryption algorithm applied to files read through the storage integration',
      'Restricts which cloud storage paths (bucket/container prefixes) the integration can access — acts as a security boundary so the integration cannot be used to create stages pointing to unauthorised locations',
    ],
    answer: 'Restricts which cloud storage paths (bucket/container prefixes) the integration can access — acts as a security boundary so the integration cannot be used to create stages pointing to unauthorised locations',
    exp: 'A Storage Integration encapsulates cloud credentials (IAM role ARN for AWS, service principal for Azure, etc.) so they are not exposed to users. STORAGE_ALLOWED_LOCATIONS = (\'s3://my-bucket/prod/\') confines the integration to specific prefixes. Even if a user creates an external stage using this integration, they can only point it to allowed paths. Complementarily, STORAGE_BLOCKED_LOCATIONS can explicitly deny sub-paths within an allowed prefix.',
  },

  {
    id: 'd3_d9_05',
    domain: 3,
    topic: 'File Formats — ORC',
    difficulty: 'medium',
    q: 'A data team wants to load Apache ORC format files into Snowflake. What is required?',
    options: [
      'ORC files cannot be loaded into Snowflake — convert to Parquet first before ingestion',
      'ORC files require at least a Medium warehouse size for the columnar decompression workload',
      'Create a file format with TYPE = ORC and reference it in COPY INTO — Snowflake natively supports ORC. Without MATCH_BY_COLUMN_NAME, the data lands in a single VARIANT column.',
      'ORC files must be staged in an internal stage; loading directly from external stages is not supported for ORC',
    ],
    answer: 'Create a file format with TYPE = ORC and reference it in COPY INTO — Snowflake natively supports ORC. Without MATCH_BY_COLUMN_NAME, the data lands in a single VARIANT column.',
    exp: 'Snowflake supports ORC (Optimized Row Columnar) as a native semi-structured format alongside JSON, Avro, Parquet, and XML. A FILE FORMAT with TYPE = ORC is used in COPY INTO to load ORC files. By default, Snowflake loads each ORC record into a single VARIANT column. Adding MATCH_BY_COLUMN_NAME = CASE_INSENSITIVE maps ORC columns to table columns by name, enabling loading into structured columns.',
  },

  {
    id: 'd3_d9_06',
    domain: 3,
    topic: 'Streams — INSERT_ONLY',
    difficulty: 'medium',
    q: 'When should you use an INSERT_ONLY stream instead of a standard (default) stream?',
    options: [
      'When the source is an external table (which only supports INSERT_ONLY), or when the workload is purely append-based and you want a more efficient stream that tracks only new inserts — INSERT_ONLY streams skip the UPDATE/DELETE metadata overhead',
      'When the stream needs to capture UPDATE and DELETE operations in addition to INSERTs',
      'When the stream is consumed by a serverless Task — standard streams are incompatible with serverless Tasks',
      'When the source table has a clustering key — INSERT_ONLY streams bypass reclustering read overhead',
    ],
    answer: 'When the source is an external table (which only supports INSERT_ONLY), or when the workload is purely append-based and you want a more efficient stream that tracks only new inserts — INSERT_ONLY streams skip the UPDATE/DELETE metadata overhead',
    exp: 'Standard streams track all DML changes (INSERT, UPDATE, DELETE) using before/after row metadata (METADATA$ACTION, METADATA$ISUPDATE). INSERT_ONLY streams only record newly inserted rows and are more lightweight — no before-image or update tracking. External tables do not support DML, so INSERT_ONLY is the only stream type they support. For log tables, event tables, or Kafka ingestion patterns where data is only ever appended, INSERT_ONLY streams are both correct and more efficient.',
  },

  {
    id: 'd3_d9_07',
    domain: 3,
    topic: 'Dynamic Tables vs Materialized Views',
    difficulty: 'medium',
    q: 'Both Dynamic Tables and Materialized Views keep pre-computed results up to date. What is the key operational difference in how freshness is managed?',
    options: [
      'Materialized Views have a configurable TARGET_LAG; Dynamic Tables refresh instantly after every base table change',
      'Dynamic Tables use incremental refresh logs; Materialized Views use micro-partition metadata for their refresh strategy',
      'They are functionally identical — Dynamic Tables are simply the new name for Materialized Views in recent Snowflake releases',
      'Materialized Views refresh automatically on a serverless basis triggered by base table DML (always near-real-time); Dynamic Tables use a declarative TARGET_LAG you set (e.g., \'5 minutes\', \'1 hour\') — you control the acceptable freshness window',
    ],
    answer: 'Materialized Views refresh automatically on a serverless basis triggered by base table DML (always near-real-time); Dynamic Tables use a declarative TARGET_LAG you set (e.g., \'5 minutes\', \'1 hour\') — you control the acceptable freshness window',
    exp: 'Materialized Views are maintained by a Snowflake-managed background service that triggers incremental refreshes immediately after base table changes — the latency is typically seconds. Dynamic Tables are a newer construct designed for complex pipelines: you declare the maximum tolerable lag (TARGET_LAG) and Snowflake schedules refreshes to meet it. Dynamic Tables support a broader SQL surface (including joins across multiple tables, CTEs, and UDFs) that MVs do not, making them the preferred choice for multi-step transformation pipelines.',
  },

  {
    id: 'd3_d9_08',
    domain: 3,
    topic: 'Tasks — ALLOW_OVERLAPPING_EXECUTION',
    difficulty: 'medium',
    q: 'A Snowflake Task is scheduled every 1 minute but a typical run takes 90 seconds. By default, what happens when the next 1-minute schedule trigger fires while the previous run is still executing?',
    options: [
      'The previous run is immediately cancelled and a fresh run starts on the schedule',
      'The new scheduled run is skipped — by default Snowflake does not start a new Task run while the previous one is still executing. Set ALLOW_OVERLAPPING_EXECUTION = TRUE to override this.',
      'Both runs execute in parallel — Snowflake always honours the schedule regardless of prior run status',
      'The Task automatically pauses itself and requires a manual RESUME after detecting schedule slippage',
    ],
    answer: 'The new scheduled run is skipped — by default Snowflake does not start a new Task run while the previous one is still executing. Set ALLOW_OVERLAPPING_EXECUTION = TRUE to override this.',
    exp: 'The default ALLOW_OVERLAPPING_EXECUTION = FALSE prevents concurrent Task runs, which is the safe default for Tasks that process streams or maintain state (re-entrant execution would cause duplicate processing). Setting it to TRUE allows overlapping runs — useful for idempotent Tasks like health checks or metadata refreshes. Monitoring SNOWFLAKE.ACCOUNT_USAGE.TASK_HISTORY for SKIPPED_ON_EXECUTION states can reveal if schedule slippage is chronic and the Task schedule should be lengthened.',
  },

  {
    id: 'd3_d9_09',
    domain: 3,
    topic: 'Snowpipe Streaming',
    difficulty: 'medium',
    q: 'Snowpipe Streaming enables row-level, low-latency ingestion into Snowflake without staging files first. Which SDK does it use?',
    options: [
      'The Snowflake Python Connector with a special streaming=True parameter flag',
      'The Snowflake JDBC Driver with streaming extensions for continuous write workloads',
      'The Snowflake Ingest SDK (Java and Python) — provides a channel-based streaming write API that pushes rows directly into Snowflake without any file staging step',
      'The Kafka Connect Snowflake Connector — all row-level streaming must go through Kafka',
    ],
    answer: 'The Snowflake Ingest SDK (Java and Python) — provides a channel-based streaming write API that pushes rows directly into Snowflake without any file staging step',
    exp: 'Snowpipe Streaming is built on the Snowflake Ingest SDK (separate from the standard Python Connector). Producers open a Channel on a target table and call insertRows() to push data in real time. Snowflake buffers and commits rows with latency typically under 1 second. This is different from file-based Snowpipe (which requires PUT then COPY or event triggers). Kafka Connector can use Snowpipe Streaming under the hood but the SDK itself is usable directly for custom producers.',
  },

  {
    id: 'd3_d9_10',
    domain: 3,
    topic: 'COPY INTO — Transformation During Load',
    difficulty: 'hard',
    q: 'A CSV stage file has columns (raw_date STRING, amount_str STRING, region_code STRING). During load, the engineer must parse raw_date to DATE, cast amount_str to NUMBER, and uppercase region_code — all in one step. Which COPY INTO syntax achieves this?',
    options: [
      'COPY INTO orders (order_date, amount, region) FROM (SELECT TO_DATE($1,\'YYYY-MM-DD\'), $2::NUMBER(10,2), UPPER($3) FROM @my_stage/file.csv) FILE_FORMAT = (...) — a SELECT sub-query inside COPY INTO enables column transformations during load',
      'Add a TRANSFORM clause: COPY INTO orders TRANSFORM (TO_DATE($1), $2::NUMBER, UPPER($3)) FILE_FORMAT = (...)',
      'Transformations are not supported during COPY INTO — load raw data into a staging table first, then INSERT...SELECT with the transformations into the target',
      'Use the FILE_FORMAT COLUMN_TRANSFORMS option to specify per-column transformation expressions',
    ],
    answer: 'COPY INTO orders (order_date, amount, region) FROM (SELECT TO_DATE($1,\'YYYY-MM-DD\'), $2::NUMBER(10,2), UPPER($3) FROM @my_stage/file.csv) FILE_FORMAT = (...) — a SELECT sub-query inside COPY INTO enables column transformations during load',
    exp: 'Snowflake COPY INTO supports a sub-query (SELECT ... FROM @stage) that references positional stage columns ($1, $2, ...) and applies any standard SQL transformation functions (type casts, string functions, date parsing, etc.) inline. The result columns are loaded directly into the target table. This avoids the cost of a two-step load (raw → staging → final) for simple transformations. Complex logic or error branching still benefits from a staged approach.',
  },

  {
    id: 'd3_d9_11',
    domain: 3,
    topic: 'Streams — Offset After Failed DML',
    difficulty: 'hard',
    q: 'A Task runs MERGE INTO target_table USING (SELECT * FROM orders_stream) .... The MERGE fails due to a constraint violation and is fully rolled back. What happens to the stream offset?',
    options: [
      'The stream offset advances past the consumed records — failed DML still marks stream records as consumed',
      'The stream records are permanently lost — a stream consumed by a failed DML transaction cannot be replayed',
      'The stream offset partially advances — records merged before the failure are marked consumed; only the remaining records stay',
      'The stream offset does NOT advance — stream offsets only move on a successfully committed DML transaction. After a rollback, all records remain available in the stream for the next consumption attempt.',
    ],
    answer: 'The stream offset does NOT advance — stream offsets only move on a successfully committed DML transaction. After a rollback, all records remain available in the stream for the next consumption attempt.',
    exp: 'Streams use transaction-aware offsets: the offset advances atomically as part of the DML commit. If the DML transaction is rolled back (due to an error, explicit ROLLBACK, or session failure), the stream offset is rolled back too. The next Task execution will find the same unconsumed records in the stream and retry the entire operation. This exactly-once delivery guarantee (when combined with idempotent target logic) is one of the key benefits of the stream + Task pattern.',
  },

  // ── DOMAIN 4: Query Performance & Optimisation (13 questions) ─────────────

  {
    id: 'd4_d9_01',
    domain: 4,
    topic: 'Window Functions — LAG',
    difficulty: 'easy',
    q: 'A query needs to compare each sale row\'s amount with the PREVIOUS row\'s amount in date order — without a self-join. Which window function is best suited?',
    options: [
      'FIRST_VALUE(amount) OVER (ORDER BY sale_date) — returns the first amount in the window',
      'LAST_VALUE(amount) OVER (ORDER BY sale_date) — returns the last amount in the window',
      'ROW_NUMBER() OVER (ORDER BY sale_date) — assigns a sequential row number but doesn\'t access other rows\' values',
      'LAG(amount, 1) OVER (ORDER BY sale_date) — returns the amount from 1 row behind the current row in the ordered window, enabling row-over-row comparison without a self-join',
    ],
    answer: 'LAG(amount, 1) OVER (ORDER BY sale_date) — returns the amount from 1 row behind the current row in the ordered window, enabling row-over-row comparison without a self-join',
    exp: 'LAG(expr, offset, default) is a window function that accesses a previous row\'s value in the current window frame order. LEAD() is the forward equivalent. Both are O(n) passes over sorted data and far more efficient than self-joins for sequential comparison. The optional default argument controls what is returned for the first row (where no previous row exists) — typically NULL or 0.',
  },

  {
    id: 'd4_d9_02',
    domain: 4,
    topic: 'QUALIFY Clause',
    difficulty: 'easy',
    q: 'What is the purpose of the QUALIFY clause in Snowflake SQL?',
    options: [
      'QUALIFY is a synonym for HAVING — it filters GROUP BY aggregation results',
      'QUALIFY filters the result of a window function inline — it applies a predicate on a window function\'s output without needing a subquery or CTE wrapper',
      'QUALIFY limits query wall-clock time — queries exceeding the time are auto-cancelled and "qualified" for review',
      'QUALIFY specifies which schema to use when resolving ambiguous object names in multi-schema queries',
    ],
    answer: 'QUALIFY filters the result of a window function inline — it applies a predicate on a window function\'s output without needing a subquery or CTE wrapper',
    exp: 'Without QUALIFY, to filter on a window function result you would need: SELECT * FROM (SELECT *, ROW_NUMBER() OVER (...) AS rn FROM t) WHERE rn = 1. QUALIFY collapses this to: SELECT * FROM t QUALIFY ROW_NUMBER() OVER (...) = 1. It evaluates after window functions but before the final SELECT, analogous to how HAVING evaluates after GROUP BY. QUALIFY is a Snowflake extension to ANSI SQL also present in BigQuery.',
  },

  {
    id: 'd4_d9_03',
    domain: 4,
    topic: 'MERGE Statement',
    difficulty: 'easy',
    q: 'When is a MERGE statement the appropriate SQL command to use in Snowflake?',
    options: [
      'When combining two tables side-by-side using column-aligned concatenation',
      'When inserting multiple rows from a VALUES clause in a single atomic statement',
      'When performing conditional INSERT, UPDATE, or DELETE in a single atomic operation based on whether matching rows exist in the target — the standard pattern for SCD Type 1 upserts and CDC processing',
      'When aggregating data from multiple source tables using UNION semantics',
    ],
    answer: 'When performing conditional INSERT, UPDATE, or DELETE in a single atomic operation based on whether matching rows exist in the target — the standard pattern for SCD Type 1 upserts and CDC processing',
    exp: 'MERGE INTO target USING source ON condition WHEN MATCHED THEN UPDATE / WHEN NOT MATCHED THEN INSERT is the canonical upsert pattern. It atomically handles three cases: matched rows (update or delete), unmatched rows from source (insert), and unmatched rows from target (delete, if using WHEN NOT MATCHED BY SOURCE). It is the preferred way to apply Change Data Capture (CDC) feeds and maintain slowly changing dimension tables.',
  },

  {
    id: 'd4_d9_04',
    domain: 4,
    topic: 'Warehouse Cache — Local SSD',
    difficulty: 'medium',
    q: 'What specific data is stored in the virtual warehouse\'s LOCAL (SSD) disk cache?',
    options: [
      'Recently scanned micro-partition file data — when the warehouse reads micro-partitions from cloud storage, it caches those files on local SSD so subsequent queries accessing the same data avoid re-downloading from cloud storage',
      'Query result sets — the local cache stores recent query outputs for sub-second re-execution by any user',
      'Table metadata — column names, data types, and statistics for fast DDL and schema lookups',
      'Session state — credentials, active role, and session parameters for faster re-authentication',
    ],
    answer: 'Recently scanned micro-partition file data — when the warehouse reads micro-partitions from cloud storage, it caches those files on local SSD so subsequent queries accessing the same data avoid re-downloading from cloud storage',
    exp: 'The local SSD cache (also called the "data cache" or "warehouse cache") stores compressed micro-partition files that were recently downloaded from cloud object storage. When a subsequent query touches the same partitions, they are read from fast local disk instead of cloud storage, dramatically reducing I/O latency. This cache is lost when the warehouse is suspended or resized — which is why suspending and resuming warehouses frequently can hurt performance for repeated workloads.',
  },

  {
    id: 'd4_d9_05',
    domain: 4,
    topic: 'JavaScript UDFs — Capabilities',
    difficulty: 'medium',
    q: 'Which operation is a JavaScript UDF in Snowflake CAPABLE of performing?',
    options: [
      'Making outbound HTTP calls to enrich data from external REST APIs at query time',
      'Reading files directly from a Snowflake internal stage during execution',
      'Spawning parallel threads to process multiple input rows concurrently inside one call',
      'Performing synchronous in-memory computation — string manipulation, regex parsing, mathematical calculations, and JSON traversal — using standard JavaScript within a sandboxed environment',
    ],
    answer: 'Performing synchronous in-memory computation — string manipulation, regex parsing, mathematical calculations, and JSON traversal — using standard JavaScript within a sandboxed environment',
    exp: 'JavaScript UDFs run in a sandboxed, single-threaded V8 engine on the warehouse. They can only perform pure, synchronous computation using standard JavaScript — no network access, no file I/O, no async/Promises, no multi-threading. For external HTTP calls, use External Functions (which invoke an API Gateway and Lambda). For stage file access, use Snowpark or stored procedures with directory tables. JavaScript UDFs are powerful for custom string/math transformations that SQL cannot express.',
  },

  {
    id: 'd4_d9_06',
    domain: 4,
    topic: 'Stored Procedures — EXECUTE AS',
    difficulty: 'medium',
    q: 'A stored procedure is defined with EXECUTE AS CALLER. A user with limited table access calls the procedure. The procedure contains a SELECT on a table the caller cannot read. What happens?',
    options: [
      'The procedure succeeds — EXECUTE AS CALLER means the procedure owner\'s rights are used for SQL inside it',
      'The procedure fails with a permission error — EXECUTE AS CALLER means all SQL inside the procedure runs with the CALLING USER\'s privileges, not the owner\'s. If the caller lacks SELECT on the table, the query fails.',
      'The procedure succeeds but returns only the rows the caller is permitted to see via their Row Access Policy',
      'EXECUTE AS CALLER and EXECUTE AS OWNER behave identically for SQL inside procedures; the difference only affects external network calls',
    ],
    answer: 'The procedure fails with a permission error — EXECUTE AS CALLER means all SQL inside the procedure runs with the CALLING USER\'s privileges, not the owner\'s. If the caller lacks SELECT on the table, the query fails.',
    exp: 'EXECUTE AS OWNER (the default) lets a procedure with elevated privileges perform operations the caller could not normally do — useful for controlled privilege escalation. EXECUTE AS CALLER is the opposite: the procedure inherits the caller\'s rights, making it safer but more restrictive. EXECUTE AS CALLER is appropriate when you want to enforce that users only see data they already have access to, even through a procedure abstraction.',
  },

  {
    id: 'd4_d9_07',
    domain: 4,
    topic: 'Search Optimization — DDL',
    difficulty: 'medium',
    q: 'Which DDL statement enables Search Optimization Service on a specific table in Snowflake?',
    options: [
      'CREATE SEARCH INDEX ON orders (order_id, customer_email) — creates a search index object for the table',
      'ALTER TABLE orders SET SEARCH_OPTIMIZATION = TRUE — sets a property flag on the table',
      'ALTER TABLE orders ADD SEARCH OPTIMIZATION — adds search optimization to the table; use ON <expression> to target specific columns or predicate types',
      'CREATE SEARCH OPTIMIZATION SERVICE FOR orders — a separate service object distinct from the table',
    ],
    answer: 'ALTER TABLE orders ADD SEARCH OPTIMIZATION — adds search optimization to the table; use ON <expression> to target specific columns or predicate types',
    exp: 'ALTER TABLE orders ADD SEARCH OPTIMIZATION is the correct DDL. Once added, Snowflake\'s background service builds and maintains a specialised access path for equality, IN-list, and LIKE/CONTAINS predicates. You can restrict optimisation to specific columns with ADD SEARCH OPTIMIZATION ON EQUALITY(col1, col2) or ON SUBSTRING(email_col). To remove it: ALTER TABLE orders DROP SEARCH OPTIMIZATION. Note: SOS requires Enterprise edition and has ongoing storage and compute costs for maintenance.',
  },

  {
    id: 'd4_d9_08',
    domain: 4,
    topic: 'FLATTEN — KEY vs INDEX',
    difficulty: 'medium',
    q: 'When using LATERAL FLATTEN on a VARIANT OBJECT (not an array), what does the KEY output column contain?',
    options: [
      'The key string for each key-value pair in the object (e.g., \'name\', \'age\', \'city\') — for objects, KEY is the field name; INDEX is NULL since objects are unordered',
      'A zero-based integer index for each key-value pair, reflecting their order in the JSON source',
      'The full dot-path from the root VARIANT column to the current nested element (e.g., \'address.city\')',
      'KEY is NULL for objects — only ARRAY flattening produces non-NULL KEY values',
    ],
    answer: 'The key string for each key-value pair in the object (e.g., \'name\', \'age\', \'city\') — for objects, KEY is the field name; INDEX is NULL since objects are unordered',
    exp: 'FLATTEN returns the output columns: SEQ, KEY, INDEX, VALUE, THIS, PATH. For a VARIANT OBJECT, KEY is the field name (string), VALUE is the field\'s value, and INDEX is NULL (objects have no positional ordering). For a VARIANT ARRAY, KEY is NULL and INDEX is the zero-based integer position of each element. PATH gives the full access path from the root to the current value. Understanding these semantics is essential for correctly querying nested semi-structured data.',
  },

  {
    id: 'd4_d9_09',
    domain: 4,
    topic: 'QUALIFY — Practical Use',
    difficulty: 'medium',
    q: 'A query must return only the single row with the highest sale_amount per customer_id. Which pattern correctly and efficiently uses QUALIFY?',
    options: [
      'SELECT customer_id, sale_amount FROM sales GROUP BY customer_id QUALIFY MAX(sale_amount)',
      'SELECT * FROM sales WHERE ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY sale_amount DESC) = 1',
      'SELECT * FROM (SELECT *, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY sale_amount DESC) AS rn FROM sales) WHERE rn = 1',
      'SELECT * FROM sales QUALIFY ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY sale_amount DESC) = 1 — QUALIFY filters on the window result inline without a subquery',
    ],
    answer: 'SELECT * FROM sales QUALIFY ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY sale_amount DESC) = 1 — QUALIFY filters on the window result inline without a subquery',
    exp: 'Option D is the idiomatic Snowflake pattern. Options B and C have equivalent logic but are more verbose — the WHERE clause cannot reference window function aliases, so they wrap in a subquery. Option A is syntactically invalid: QUALIFY follows a boolean expression on a window function, not a standalone aggregate. QUALIFY makes deduplication queries significantly cleaner, especially when applied after complex window computations.',
  },

  {
    id: 'd4_d9_10',
    domain: 4,
    topic: 'Search Optimization — Supported Predicates',
    difficulty: 'medium',
    q: 'Which query patterns does Search Optimization Service accelerate for point-lookup style queries?',
    options: [
      'Range scans (BETWEEN, <, >) — SOS specialises in time-range queries on date and numeric columns',
      'Equality (=), IN lists, LIKE \'%term%\' / CONTAINS substring searches, and geospatial point lookups — SOS builds specialised access paths for these non-clustering lookup patterns',
      'Only exact equality predicates (=) — substring and IN-list patterns still require full scans without a clustering key',
      'GROUP BY aggregations on high-cardinality columns — SOS pre-aggregates frequent patterns to speed up analytics',
    ],
    answer: 'Equality (=), IN lists, LIKE \'%term%\' / CONTAINS substring searches, and geospatial point lookups — SOS builds specialised access paths for these non-clustering lookup patterns',
    exp: 'Search Optimization Service is purpose-built for selective point lookups that clustering keys cannot efficiently address. It supports: equality predicates, IN-list membership, substring searches (LIKE \'%..%\', CONTAINS), geospatial predicates (ST_CONTAINS, ST_WITHIN), and VARIANT path equality. It does NOT accelerate range scans — for ranges, a well-chosen clustering key is still the primary tool. SOS works best when the predicate would otherwise scan most of the table\'s micro-partitions.',
  },

  {
    id: 'd4_d9_11',
    domain: 4,
    topic: 'Materialized Views — Unsupported Constructs',
    difficulty: 'hard',
    q: 'Which SQL construct in a view\'s definition would prevent it from being created as a MATERIALIZED VIEW in Snowflake?',
    options: [
      'A GROUP BY clause with SUM and COUNT aggregations — GROUP BY is not supported in MV definitions',
      'An INNER JOIN between two tables — joins are not supported in Materialized Views',
      'A scalar subquery in the SELECT list, or a call to a non-deterministic function like CURRENT_TIMESTAMP() — these prevent MV creation because the result cannot be deterministically refreshed',
      'A LIMIT / FETCH FIRST N ROWS clause — MVs do not support limiting the number of rows they materialise',
    ],
    answer: 'A scalar subquery in the SELECT list, or a call to a non-deterministic function like CURRENT_TIMESTAMP() — these prevent MV creation because the result cannot be deterministically refreshed',
    exp: 'Materialized Views have several SQL restrictions: no subqueries in the SELECT list or WHERE clause, no non-deterministic functions (CURRENT_DATE, RANDOM, SEQ), no UDFs, no window functions, no HAVING, no UNION/INTERSECT/EXCEPT, no LIMIT, and no CTEs. Aggregations (GROUP BY with SUM, COUNT, etc.) are fully supported. Simple JOINs are supported in MVs. If a view requires any restricted construct, use a Dynamic Table instead, which has a much broader SQL surface.',
  },

  {
    id: 'd4_d9_12',
    domain: 4,
    topic: 'Clustering — Expression-Based Keys',
    difficulty: 'hard',
    q: 'A table stores events with a TIMESTAMP_NTZ column event_time. Almost all queries filter by calendar date (WHERE DATE(event_time) = \'2026-01-15\'). Which clustering key expression best supports this pattern?',
    options: [
      'CLUSTER BY (DATE(event_time)) — clustering on the derived DATE expression aligns micro-partitions by date, enabling effective pruning for date-equality filters even though the column is a full TIMESTAMP',
      'CLUSTER BY (event_time) — clustering on the full timestamp provides the same pruning as DATE(event_time) because dates are a strict subset of timestamps',
      'CLUSTER BY (YEAR(event_time), MONTH(event_time)) — a year+month compound is always superior to a single date expression for time-series tables',
      'Clustering keys cannot use expression functions — only raw column values are permitted',
    ],
    answer: 'CLUSTER BY (DATE(event_time)) — clustering on the derived DATE expression aligns micro-partitions by date, enabling effective pruning for date-equality filters even though the column is a full TIMESTAMP',
    exp: 'Snowflake clustering keys support any deterministic expression, including function calls like DATE(), YEAR(), TRUNC(), SUBSTRING(), etc. CLUSTER BY (DATE(event_time)) bins all rows for the same calendar date into the same micro-partitions. When a query filters WHERE DATE(event_time) = \'2026-01-15\', Snowflake can prune all partitions whose date range doesn\'t include that date. CLUSTER BY (event_time) would not group by date as cleanly because timestamps vary within a day, leading to many partitions spanning the same date.',
  },

  {
    id: 'd4_d9_13',
    domain: 4,
    topic: 'Query Acceleration Service — Verification',
    difficulty: 'hard',
    q: 'How can a data engineer confirm that the Query Acceleration Service (QAS) contributed to a specific query\'s execution?',
    options: [
      'Check the Query Profile for a dedicated "QAS Acceleration" node — QAS-accelerated queries always show this node',
      'Run SHOW QUERY_ACCELERATION_STATUS — it lists all queries that have benefited from QAS in the last 24 hours',
      'QAS is completely transparent with no observable query-level indicator of its contribution',
      'Query SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY and look at QUERY_ACCELERATION_BYTES_SCANNED and QUERY_ACCELERATION_PARTITIONS_SCANNED — non-zero values confirm QAS processed a portion of that query',
    ],
    answer: 'Query SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY and look at QUERY_ACCELERATION_BYTES_SCANNED and QUERY_ACCELERATION_PARTITIONS_SCANNED — non-zero values confirm QAS processed a portion of that query',
    exp: 'QUERY_HISTORY includes columns QUERY_ACCELERATION_BYTES_SCANNED and QUERY_ACCELERATION_PARTITIONS_SCANNED. When QAS handles part of a query\'s scan, these columns are non-zero. The Query Profile in Snowsight also shows a "Query Acceleration" section for eligible queries. Additionally, SNOWFLAKE.ACCOUNT_USAGE.QUERY_ACCELERATION_HISTORY provides QAS credit consumption aggregated by warehouse and time. Warehouses must have ENABLE_QUERY_ACCELERATION = TRUE for any query to use QAS.',
  },

  // ── DOMAIN 5: Data Sharing & Collaboration (5 questions) ──────────────────

  {
    id: 'd5_d9_01',
    domain: 5,
    topic: 'Time Travel — AT OFFSET',
    difficulty: 'easy',
    q: 'A developer runs: SELECT * FROM orders AT(OFFSET => -3600). What does this query return?',
    options: [
      'All rows inserted into orders within the last 3,600 seconds (1 hour)',
      'All rows deleted from orders within the last 3,600 seconds',
      'The complete state of the orders table as it existed exactly 3,600 seconds (1 hour) ago',
      'All rows where a timestamp column value falls within the last 3,600 seconds',
    ],
    answer: 'The complete state of the orders table as it existed exactly 3,600 seconds (1 hour) ago',
    exp: 'AT(OFFSET => N) returns a historical snapshot of the table at the current time + N seconds. A negative offset goes back in time: OFFSET => -3600 means "1 hour ago." This is a full table snapshot — not a delta of changes. To see what changed in that period, use a stream or compare two AT snapshots. The OFFSET is measured in seconds relative to the statement execution time, not relative to data load time.',
  },

  {
    id: 'd5_d9_02',
    domain: 5,
    topic: 'Fail-safe — Temporary Tables',
    difficulty: 'easy',
    q: 'A TEMPORARY table is created in a Snowflake session. How many days of Fail-safe protection does it have?',
    options: [
      '0 days — temporary tables have no Fail-safe. When the session ends, the table is gone with no recovery path through Snowflake Support.',
      '1 day — temporary tables have the same Fail-safe duration as transient tables',
      '7 days — temporary tables have the same Fail-safe as permanent tables',
      'The Fail-safe duration is inherited from the containing schema\'s DATA_RETENTION_TIME_IN_DAYS setting',
    ],
    answer: '0 days — temporary tables have no Fail-safe. When the session ends, the table is gone with no recovery path through Snowflake Support.',
    exp: 'Temporary tables are session-scoped: they are automatically dropped when the creating session ends. Because they are inherently short-lived, Snowflake provides 0 days of both Time Travel (configurable, but max 1 day) and Fail-safe (always 0) for temporary tables. Transient tables also have 0 Fail-safe days. Only permanent tables receive the 7-day Fail-safe window that Snowflake Support can access for disaster recovery.',
  },

  {
    id: 'd5_d9_03',
    domain: 5,
    topic: 'Secure Data Sharing — Shareable Objects',
    difficulty: 'medium',
    q: 'Which object types can be added to a Snowflake Secure Share for consumers to access?',
    options: [
      'Only tables — views and UDFs cannot be included directly in a share',
      'Only Materialized Views — they provide a stable, versioned interface for consumers',
      'Tables and views only — UDFs and stored procedures cannot be shared via a share object',
      'Tables, secure views, secure materialized views, and secure UDFs — all shareable objects must carry the SECURE attribute to protect the underlying logic from consumers',
    ],
    answer: 'Tables, secure views, secure materialized views, and secure UDFs — all shareable objects must carry the SECURE attribute to protect the underlying logic from consumers',
    exp: 'A Snowflake Secure Share can include: tables, secure views (CREATE SECURE VIEW), secure materialized views, and secure UDFs. The SECURE keyword is required for views and UDFs so that consumers cannot use SHOW VIEWS or DESCRIBE to inspect the underlying definition. Regular (non-secure) views cannot be added to a share. External tables are not shareable. Shared data is read-only for consumers; DML on shared objects is not permitted.',
  },

  {
    id: 'd5_d9_04',
    domain: 5,
    topic: 'Data Clean Rooms',
    difficulty: 'medium',
    q: 'What is a Snowflake Data Clean Room, and what problem does it solve?',
    options: [
      'A specialised table type that automatically masks all PII columns for every consumer',
      'A privacy-preserving environment where two or more parties run agreed-upon analytics on their combined datasets WITHOUT either party ever seeing the other\'s raw underlying data — enabling joint analysis while preserving data sovereignty',
      'A scheduled compliance job that scans tables for sensitive data patterns and auto-applies masking policies',
      'A certification framework that verifies Snowflake accounts meet HIPAA and GDPR data residency requirements',
    ],
    answer: 'A privacy-preserving environment where two or more parties run agreed-upon analytics on their combined datasets WITHOUT either party ever seeing the other\'s raw underlying data — enabling joint analysis while preserving data sovereignty',
    exp: 'Data Clean Rooms address the challenge of collaborative analytics where parties cannot (legally or commercially) share raw data. Each participant keeps their data in their own Snowflake account; the Clean Room exposes only pre-approved SQL queries (e.g., an overlap count or aggregate model training) that produce aggregate results neither party can reverse-engineer to see the other\'s individual records. Snowflake\'s Native App Framework powers the Clean Room abstraction, using Secure Data Sharing under the hood.',
  },

  {
    id: 'd5_d9_05',
    domain: 5,
    topic: 'Cloning — Streams Behaviour',
    difficulty: 'hard',
    q: 'A table orders has an active stream orders_stream. A developer runs: CREATE TABLE orders_clone CLONE orders. What is the behaviour of orders_stream after cloning?',
    options: [
      'orders_stream is also cloned automatically and will independently track changes on orders_clone',
      'The original orders_stream continues tracking only the original orders table — cloning does NOT copy streams to the clone; to track changes on orders_clone, a new stream must be explicitly created on it',
      'The clone operation fails because tables with active streams cannot be cloned in Snowflake',
      'orders_stream splits and tracks changes on BOTH tables simultaneously after the clone operation, merging their change records',
    ],
    answer: 'The original orders_stream continues tracking only the original orders table — cloning does NOT copy streams to the clone; to track changes on orders_clone, a new stream must be explicitly created on it',
    exp: 'Zero-copy cloning copies the table\'s data (micro-partition references) at the time of the clone but does NOT copy associated streams, tasks, or policies. The original orders_stream is unaffected — it continues consuming changes on the original orders table with its existing offset unchanged. If you need change tracking on the cloned table, run CREATE STREAM new_stream ON TABLE orders_clone. This is an important distinction when cloning for testing: your ETL stream does not accidentally consume data from the test clone.',
  },

];
