// ─────────────────────────────────────────────────────────────────────────────
// Flashcard data — COF-C03 key concepts + exam traps
// Each card: { id, domain, topic, front, back }
// front = question/prompt shown face-up
// back  = concise answer shown after flip
// ─────────────────────────────────────────────────────────────────────────────

export const FLASHCARDS = [

  // ── Domain 1: Architecture & Features (18 cards) ──────────────────────────

  {
    id: 'fc_d1_01', domain: 1, topic: 'Architecture',
    front: 'What are the 3 layers of Snowflake\'s architecture?',
    back:  'Database Storage · Virtual Warehouse (Compute) · Cloud Services\n\nStorage = cloud object store (S3/GCS/Blob)\nCompute = MPP virtual warehouse clusters\nCloud Services = auth, metadata, optimizer, transactions',
  },
  {
    id: 'fc_d1_02', domain: 1, topic: 'Architecture',
    front: 'Which layer handles query parsing, optimization, and access control — and runs without a virtual warehouse?',
    back:  'Cloud Services Layer\n\nAlways on, Snowflake-managed. Only billed when it exceeds 10% of daily VW credits (in UTC).',
  },
  {
    id: 'fc_d1_03', domain: 1, topic: 'Architecture',
    front: 'What edition is the MINIMUM for: Multi-cluster VWs + Dynamic Data Masking + Materialized Views?',
    back:  'Enterprise\n\nStandard: core features only.\nEnterprise: adds MCWHs, DDM, MVs, Row Access Policies, Search Optimization.\nBusiness Critical: adds Tri-Secret Secure, Failover, PrivateLink.',
  },
  {
    id: 'fc_d1_04', domain: 1, topic: 'Architecture',
    front: '⚠️ TRAP: When are Cloud Services credits charged?',
    back:  'Only when Cloud Services usage exceeds 10% of the day\'s virtual warehouse credits.\n\nCalculated daily in UTC. Below 10% = free adjustment.',
  },
  {
    id: 'fc_d1_05', domain: 1, topic: 'Virtual Warehouses',
    front: 'Credit/hour for each warehouse size (XS → 4XL)?',
    back:  'XS=1 · S=2 · M=4 · L=8 · XL=16 · 2XL=32 · 3XL=64 · 4XL=128\n\nEach step UP doubles credits. Billed per second, 60-second minimum per start.',
  },
  {
    id: 'fc_d1_06', domain: 1, topic: 'Virtual Warehouses',
    front: '⚠️ TRAP: A warehouse runs for 30 seconds then suspends. How many seconds are billed?',
    back:  '60 seconds (minimum billing unit)\n\nSnowflake bills per second but enforces a 60-second minimum each time the warehouse starts.',
  },
  {
    id: 'fc_d1_07', domain: 1, topic: 'Virtual Warehouses',
    front: 'Scale UP vs Scale OUT — what\'s the difference?',
    back:  'Scale UP = resize to larger warehouse → improves individual query speed\nScale OUT = multi-cluster → improves concurrency (more users without queuing)\n\nQueuing = scale out. Slow queries = scale up.',
  },
  {
    id: 'fc_d1_08', domain: 1, topic: 'Virtual Warehouses',
    front: 'STANDARD vs ECONOMY scaling policy in multi-cluster warehouses',
    back:  'STANDARD: starts new cluster as soon as any query queues\nECONOMY: only starts a cluster if estimated load would keep it busy ≥6 minutes\n\nECONOMY conserves credits. STANDARD prioritizes speed.',
  },
  {
    id: 'fc_d1_09', domain: 1, topic: 'Storage Concepts',
    front: 'Permanent vs Transient vs Temporary tables — key differences?',
    back:  'Permanent: full Time Travel (0–90d Enterprise), 7-day Fail-safe\nTransient: max 1-day TT, NO Fail-safe — good for ETL staging\nTemporary: session-scoped, max 1-day TT, NO Fail-safe — auto-dropped on session end',
  },
  {
    id: 'fc_d1_10', domain: 1, topic: 'Storage Concepts',
    front: '⚠️ TRAP: Who can access data in Fail-safe?',
    back:  'Only Snowflake Support — NOT accessible via SQL by any user, including ACCOUNTADMIN.\n\nFail-safe = 7 days after Time Travel expires. Last resort recovery only.',
  },
  {
    id: 'fc_d1_11', domain: 1, topic: 'Storage Concepts',
    front: 'What is a micro-partition?',
    back:  'Contiguous storage unit containing 50–500 MB of uncompressed data.\nStored columnar + compressed.\nEach has min/max, null count, distinct count metadata per column → enables pruning.',
  },
  {
    id: 'fc_d1_12', domain: 1, topic: 'Storage Concepts',
    front: 'Standard view vs Secure view vs Materialized view',
    back:  'Standard: SQL definition visible to anyone with SHOW\nSecure: hides definition — required for Data Sharing\nMaterialized: pre-computed result on disk, auto-refreshed by serverless compute — Enterprise+',
  },
  {
    id: 'fc_d1_13', domain: 1, topic: 'Interfaces & Tools',
    front: 'Which tool: version-controlled Snowflake infra-as-code alongside AWS/Azure/GCP resources?',
    back:  'Terraform Provider for Snowflake\n\nDeclaratively manages warehouses, databases, roles, grants in HCL. Enables GitOps workflows.',
  },
  {
    id: 'fc_d1_14', domain: 1, topic: 'Interfaces & Tools',
    front: '⚠️ TRAP: Snow CLI vs SnowSQL — which is the modern developer tool?',
    back:  'Snow CLI (Snowflake CLI) is the modern tool — supports Snowpark projects, Streamlit apps, Native Apps, CI/CD scripting.\n\nSnowSQL is the classic SQL-only interactive client.',
  },
  {
    id: 'fc_d1_15', domain: 1, topic: 'Architecture',
    front: 'Which Snowflake edition gives fully dedicated, isolated infrastructure — no shared hardware at all?',
    back:  'Virtual Private Snowflake (VPS)\n\nHighest tier. Separate Cloud Services layer, dedicated hardware, for strict data isolation requirements.',
  },
  {
    id: 'fc_d1_16', domain: 1, topic: 'AI/ML Features',
    front: 'Cortex Analyst vs Cortex Search — what\'s the difference?',
    back:  'Cortex Analyst: natural-language → SQL queries on structured/tabular data\nCortex Search: full-text semantic search over unstructured/text data\n\nAnalyst = tables. Search = documents.',
  },
  {
    id: 'fc_d1_17', domain: 1, topic: 'AI/ML Features',
    front: 'What is Snowpark?',
    back:  'API for writing data pipelines and ML code in Python, Java, or Scala that runs inside Snowflake.\n\nUses DataFrame API with lazy evaluation — SQL executes only when an action (collect, write) is called.',
  },
  {
    id: 'fc_d1_18', domain: 1, topic: 'Architecture',
    front: '⚠️ TRAP: On which cloud platforms can Snowflake accounts be deployed?',
    back:  'AWS, Microsoft Azure, and Google Cloud Platform\n\nNO on-premises deployments. Multi-cloud support, but an account lives on one cloud/region.',
  },

  // ── Domain 2: Account Management & Governance (18 cards) ─────────────────

  {
    id: 'fc_d2_01', domain: 2, topic: 'RBAC',
    front: 'Role hierarchy: which system role inherits from all others at the top?',
    back:  'ACCOUNTADMIN\n  └─ SYSADMIN (creates objects)\n  └─ SECURITYADMIN (manages roles/users)\n       └─ USERADMIN (creates users/roles only)\n  └─ PUBLIC (all users)\n\nParent inherits all child privileges.',
  },
  {
    id: 'fc_d2_02', domain: 2, topic: 'RBAC',
    front: '⚠️ TRAP: Which direction does role inheritance flow in Snowflake?',
    back:  'Parent inherits from child — BOTTOM UP.\n\nWhen role A is granted TO role B, role B (parent) inherits ALL of role A\'s (child) privileges.',
  },
  {
    id: 'fc_d2_03', domain: 2, topic: 'RBAC',
    front: 'What 3 privilege levels are needed to query a table?',
    back:  '1. USAGE on the DATABASE\n2. USAGE on the SCHEMA\n3. SELECT on the TABLE\n\nMissing any one level = access denied. No shortcuts.',
  },
  {
    id: 'fc_d2_04', domain: 2, topic: 'RBAC',
    front: 'What does USE SECONDARY ROLES ALL do?',
    back:  'Activates all roles granted to the current user as secondary roles for the session.\n\nPrivileges from all roles combine. Primary role stays the same (still the owner role for new objects).',
  },
  {
    id: 'fc_d2_05', domain: 2, topic: 'RBAC',
    front: '⚠️ TRAP: Where should all custom roles be granted to ensure SYSADMIN can manage their objects?',
    back:  'All custom roles should be granted up to SYSADMIN.\n\nIf a custom role owns objects but isn\'t in the SYSADMIN hierarchy, those objects become unmanaged orphans.',
  },
  {
    id: 'fc_d2_06', domain: 2, topic: 'Authentication',
    front: '5 authentication methods in Snowflake — name them',
    back:  '1. Username/password\n2. MFA (Duo Security)\n3. Key-pair (RSA — recommended for service accounts)\n4. Federated Auth / SSO (SAML 2.0)\n5. OAuth 2.0 (delegated access for apps)',
  },
  {
    id: 'fc_d2_07', domain: 2, topic: 'Authentication',
    front: 'Which protocol automates user provisioning/deprovisioning from an IdP (Okta, Azure AD)?',
    back:  'SCIM (System for Cross-domain Identity Management)\n\nNOT SAML — SAML handles authentication. SCIM handles lifecycle (create/update/delete users and groups).',
  },
  {
    id: 'fc_d2_08', domain: 2, topic: 'Network Policies',
    front: '⚠️ TRAP: Account-level vs user-level network policy — which wins?',
    back:  'User-level policy OVERRIDES the account-level policy for that specific user.\n\nAlso: if a IP is in both ALLOWED and BLOCKED lists → BLOCKED wins.',
  },
  {
    id: 'fc_d2_09', domain: 2, topic: 'Data Masking',
    front: 'Dynamic Data Masking — how does it work?',
    back:  'A masking policy function is attached to a column. It evaluates CURRENT_ROLE() (or other context functions) at query time and returns:\n• Real value for privileged roles\n• Masked value (NULL, ***, fixed string) for others\n\nNo data is physically altered.',
  },
  {
    id: 'fc_d2_10', domain: 2, topic: 'Data Masking',
    front: 'Row Access Policy — what does it do and what does the user see when denied?',
    back:  'Filters rows transparently at query time — the user sees only rows the policy allows.\n\nNO error is thrown. The filtered-out rows simply don\'t appear. Evaluated by Cloud Services before returning results.',
  },
  {
    id: 'fc_d2_11', domain: 2, topic: 'Object Tagging',
    front: 'What is tag lineage / tag propagation?',
    back:  'When a tag is set at the TABLE level, it automatically propagates to all COLUMNS of that table.\n\nDoes NOT auto-propagate to downstream views by default.',
  },
  {
    id: 'fc_d2_12', domain: 2, topic: 'Encryption',
    front: '⚠️ TRAP: What is Tri-Secret Secure, and which edition requires it?',
    back:  'Tri-Secret Secure = customer-managed key (AWS KMS / Azure Key Vault / GCP KMS) + Snowflake key + composite master key.\n\nRequires Business Critical. Without customer\'s CMK, Snowflake CANNOT decrypt data.',
  },
  {
    id: 'fc_d2_13', domain: 2, topic: 'Replication',
    front: 'Secondary database state — can you write to it?',
    back:  'Read-only. All DML (INSERT, UPDATE, DELETE, MERGE) is blocked on secondary databases.\n\nData flows only: primary → refresh → secondary.',
  },
  {
    id: 'fc_d2_14', domain: 2, topic: 'ACCOUNT_USAGE',
    front: 'ACCOUNT_USAGE vs INFORMATION_SCHEMA — 4 key differences',
    back:  'ACCOUNT_USAGE: 1-year retention · 45min–3hr latency · account-wide · includes dropped objects\nINFORMATION_SCHEMA: 7–14 day retention · near-real-time · current DB only · no dropped objects',
  },
  {
    id: 'fc_d2_15', domain: 2, topic: 'ACCOUNT_USAGE',
    front: 'Which ACCOUNT_USAGE view shows which tables/columns a user accessed?',
    back:  'ACCESS_HISTORY\n\nShows per-query: objects accessed, columns projected/filtered, user, warehouse, timestamp. The primary audit trail for data access compliance.',
  },
  {
    id: 'fc_d2_16', domain: 2, topic: 'ACCOUNT_USAGE',
    front: '⚠️ TRAP: Resource monitors track credits for which compute type?',
    back:  'Virtual warehouses ONLY.\n\nServerless features (Snowpipe, Tasks, Search Optimization, Clustering) are NOT tracked or controlled by resource monitors.',
  },
  {
    id: 'fc_d2_17', domain: 2, topic: 'RBAC',
    front: 'What is Discretionary Access Control (DAC) in Snowflake?',
    back:  'Object owners can grant their own privileges to other roles — they have discretion over who accesses their objects.\n\nComplements RBAC. Together: RBAC defines role hierarchy, DAC allows owner-driven delegation.',
  },
  {
    id: 'fc_d2_18', domain: 2, topic: 'Trust Center',
    front: 'What does the Snowflake Trust Center do?',
    back:  'Continuously scans the account against security benchmarks (e.g. CIS).\nSurfaces risks: users without MFA, over-privileged roles, weak network policies, etc.\n\nNot encryption — it\'s a security posture scanner.',
  },

  // ── Domain 3: Data Loading & Connectivity (15 cards) ─────────────────────

  {
    id: 'fc_d3_01', domain: 3, topic: 'Stages',
    front: '3 types of internal stages — how are they created?',
    back:  'User stage (@~): auto-created per user, private\nTable stage (@%table): auto-created per table\nNamed stage: must CREATE STAGE — reusable, shareable, most flexible',
  },
  {
    id: 'fc_d3_02', domain: 3, topic: 'Stages',
    front: 'How do you securely connect an external stage to S3 without storing AWS credentials in Snowflake?',
    back:  'Storage Integration\n\nUses an IAM role (cross-account trust) — no AWS_KEY_ID / AWS_SECRET_KEY stored in Snowflake. The IAM role ARN is referenced in the stage definition.',
  },
  {
    id: 'fc_d3_03', domain: 3, topic: 'COPY INTO',
    front: '⚠️ TRAP: Default ON_ERROR behavior for COPY INTO?',
    back:  'ABORT_STATEMENT — the entire load is rolled back on the first parsing error.\n\nOther options: CONTINUE (skip bad rows), SKIP_FILE (skip file on any error), SKIP_FILE_<n> (skip file after n errors).',
  },
  {
    id: 'fc_d3_04', domain: 3, topic: 'COPY INTO',
    front: '⚠️ TRAP: A file was already loaded via COPY INTO. You run it again. What happens?',
    back:  'The file is SKIPPED — Snowflake tracks load history for 64 days per stage/table.\n\nTo force reload: add FORCE = TRUE (warning: can create duplicates).',
  },
  {
    id: 'fc_d3_05', domain: 3, topic: 'COPY INTO',
    front: 'What does VALIDATION_MODE = \'RETURN_ERRORS\' do?',
    back:  'Dry-run: parses all files and returns errors WITHOUT loading any data.\n\nNo rows are written. Use it to check file quality before committing a load.',
  },
  {
    id: 'fc_d3_06', domain: 3, topic: 'Snowpipe',
    front: 'Snowpipe vs COPY INTO — 3 key differences',
    back:  'Snowpipe: serverless compute · triggered by cloud events · near-real-time · no WH needed\nCOPY INTO: uses virtual warehouse · manual/scheduled · batch · warehouse credits',
  },
  {
    id: 'fc_d3_07', domain: 3, topic: 'Snowpipe',
    front: '⚠️ TRAP: Does a resource monitor control Snowpipe credit usage?',
    back:  'NO. Snowpipe uses serverless compute — resource monitors only apply to virtual warehouse credits.\n\nSame applies to: Snowflake Tasks (serverless), Search Optimization, Automatic Clustering.',
  },
  {
    id: 'fc_d3_08', domain: 3, topic: 'Streams',
    front: 'What is a Snowflake Stream?',
    back:  'A CDC (Change Data Capture) object that records DML changes (INSERT / UPDATE / DELETE) on a source table since the last consumption.\n\nOffset advances only after changes are consumed in a COMMITTED DML transaction.',
  },
  {
    id: 'fc_d3_09', domain: 3, topic: 'Streams',
    front: 'Standard stream vs Append-only stream',
    back:  'Standard: captures INSERT + UPDATE + DELETE\nAppend-only: captures only INSERT operations\n\nAppend-only is more efficient for insert-heavy tables (event logs, raw ingestion).',
  },
  {
    id: 'fc_d3_10', domain: 3, topic: 'Tasks',
    front: '⚠️ TRAP: A new Task is created. Will it run on its schedule immediately?',
    back:  'NO — Tasks are created in SUSPENDED state.\n\nYou must run: ALTER TASK <name> RESUME\n\nSame for Alerts — also created suspended.',
  },
  {
    id: 'fc_d3_11', domain: 3, topic: 'Tasks',
    front: 'In a Task DAG, which tasks need a SCHEDULE and which need to be RESUMED?',
    back:  'Only the ROOT task has a SCHEDULE.\nAll child tasks have no SCHEDULE but must be RESUMED.\n\nRoot triggers children after completing.',
  },
  {
    id: 'fc_d3_12', domain: 3, topic: 'File Formats',
    front: 'STRIP_OUTER_ARRAY = TRUE — what does it do when loading JSON?',
    back:  'Removes the top-level array brackets from a JSON array file.\nEach element becomes a separate row.\n\nWithout it: the entire array is stored as one VARIANT value in a single row.',
  },
  {
    id: 'fc_d3_13', domain: 3, topic: 'Connectivity',
    front: 'Which Snowflake feature lets you call an external REST API from inside a SQL query?',
    back:  'External Function (backed by an API Integration)\n\nThe API Integration defines the endpoint URL and security. The External Function wraps it as a callable SQL function.',
  },
  {
    id: 'fc_d3_14', domain: 3, topic: 'Connectivity',
    front: 'Snowpipe vs Snowpipe Streaming — key difference',
    back:  'Snowpipe: file-based, triggered by cloud event notifications, batch\nSnowpipe Streaming: row-level via SDK, latency in seconds, no file staging needed\n\nStreaming = lower latency; classic Snowpipe = simpler file-based pipeline.',
  },
  {
    id: 'fc_d3_15', domain: 3, topic: 'COPY INTO',
    front: 'PUT vs GET commands — what do they do?',
    back:  'PUT file://local/path @stage — uploads local file TO a Snowflake internal stage\nGET @stage/file file://local/ — downloads FROM stage to local path\n\nAvailable in SnowSQL and JDBC/ODBC drivers, NOT in Snowsight.',
  },

  // ── Domain 4: Performance & Transformation (15 cards) ────────────────────

  {
    id: 'fc_d4_01', domain: 4, topic: 'Caching',
    front: '3 types of caching in Snowflake — where does each live?',
    back:  '1. Result cache — Cloud Services, 24 hrs, shared across ALL users\n2. Metadata cache — Cloud Services, SHOW commands, free (no VW needed)\n3. Local SSD cache — Virtual Warehouse nodes, lost on suspend',
  },
  {
    id: 'fc_d4_02', domain: 4, topic: 'Caching',
    front: '⚠️ TRAP: What invalidates the result cache?',
    back:  'Underlying data changes (DML on source tables) or 24 hours elapsed.\n\nRole changes, warehouse suspend/resume, and user changes do NOT invalidate it — unless the table has Row Access Policies.',
  },
  {
    id: 'fc_d4_03', domain: 4, topic: 'Caching',
    front: '⚠️ TRAP: SHOW commands — do they use a virtual warehouse?',
    back:  'NO — SHOW commands are served by the Cloud Services metadata cache.\n\nNo warehouse credits consumed. Free.',
  },
  {
    id: 'fc_d4_04', domain: 4, topic: 'Query Optimization',
    front: 'How does Snowflake prune micro-partitions?',
    back:  'Each micro-partition stores min/max values per column. The optimizer skips partitions where the filter value is outside the min/max range.\n\n⚠️ Wrapping a filter column in a function (YEAR(date), LOWER(name)) breaks pruning.',
  },
  {
    id: 'fc_d4_05', domain: 4, topic: 'Query Optimization',
    front: 'What do "bytes spilled to local storage" and "bytes spilled to remote storage" mean in Query Profile?',
    back:  'Spill = warehouse ran out of memory for intermediate results.\n\nLocal SSD spill: bad → fix by resizing warehouse\nRemote storage spill (S3/Blob/GCS): very bad → orders of magnitude slower than local SSD',
  },
  {
    id: 'fc_d4_06', domain: 4, topic: 'Clustering',
    front: 'When should you define a clustering key on a table?',
    back:  'When the table is large (multiple GB/TB) and queries frequently filter on the same column(s), but natural ingestion order doesn\'t co-locate those values.\n\nNot needed for small tables — overhead outweighs benefit.',
  },
  {
    id: 'fc_d4_07', domain: 4, topic: 'Clustering',
    front: 'What does high average_depth in SYSTEM$CLUSTERING_INFORMATION indicate?',
    back:  'Poor clustering — many micro-partitions have overlapping values on the clustering key.\n\nIdeal depth ≈ 1 (no overlap). Values >2–3 = re-clustering likely needed.',
  },
  {
    id: 'fc_d4_08', domain: 4, topic: 'Clustering',
    front: '⚠️ TRAP: What compute does automatic re-clustering use?',
    back:  'Serverless compute — NOT a virtual warehouse.\n\nBilled separately (not VW credits). Not controlled by resource monitors.',
  },
  {
    id: 'fc_d4_09', domain: 4, topic: 'Materialized Views',
    front: '⚠️ TRAP: Can a Materialized View use CURRENT_TIMESTAMP() or RANDOM()?',
    back:  'NO — non-deterministic functions are not allowed in Materialized View definitions.\n\nAlso prohibited: subqueries, HAVING, LIMIT, JavaScript UDFs.',
  },
  {
    id: 'fc_d4_10', domain: 4, topic: 'Search Optimization',
    front: 'Search Optimization Service — what query pattern does it target?',
    back:  'Selective point lookups on high-cardinality columns:\nWHERE user_id = 12345\nWHERE email IN (\'a@b.com\', \'c@d.com\')\n\nNOT for range scans or full table aggregations.',
  },
  {
    id: 'fc_d4_11', domain: 4, topic: 'Semi-Structured Data',
    front: 'How do you navigate nested JSON in a VARIANT column?',
    back:  'Colon notation: data:user:name\nBracket notation: data["user"]["name"]\nCast: data:user:name::VARCHAR\n\nFLATTEN() expands arrays into rows.',
  },
  {
    id: 'fc_d4_12', domain: 4, topic: 'Semi-Structured Data',
    front: 'What does the QUALIFY clause do?',
    back:  'Filters rows based on a window function result — applied AFTER the window computation.\n\nExample: QUALIFY ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC) = 1\n(equivalent to a CTE with WHERE on rn)',
  },
  {
    id: 'fc_d4_13', domain: 4, topic: 'Transformations',
    front: '⚠️ TRAP: MERGE error — "non-deterministic MERGE". What causes it?',
    back:  'A source row matches MORE than one target row.\n\nSnowflake disallows this. Fix: deduplicate the source using a CTE before the MERGE.',
  },
  {
    id: 'fc_d4_14', domain: 4, topic: 'Transformations',
    front: 'Stored Procedure vs UDF — key differences',
    back:  'Stored Proc: can execute DDL + DML + transactions + CALL other procs · EXECUTE AS OWNER or CALLER\nUDF: returns a value · called inside SQL · cannot execute DDL or transactions',
  },
  {
    id: 'fc_d4_15', domain: 4, topic: 'Transformations',
    front: 'What is a Dynamic Table?',
    back:  'Declarative, incrementally-refreshed table defined by a SQL query + TARGET_LAG.\n\nSnowflake automatically keeps it fresh within the lag window.\nReplaces complex Streams + Tasks pipelines.',
  },

  // ── Domain 5: Data Collaboration (14 cards) ───────────────────────────────

  {
    id: 'fc_d5_01', domain: 5, topic: 'Time Travel',
    front: '3 Time Travel query syntaxes — what are they?',
    back:  'AT (TIMESTAMP => \'2026-01-01\'::TIMESTAMP)\nAT (OFFSET => -3600)  ← seconds from now\nAT (STATEMENT => \'<query_id>\')\n\nBEFORE also works: gets state just before that point.',
  },
  {
    id: 'fc_d5_02', domain: 5, topic: 'Time Travel',
    front: 'Max Time Travel retention by edition and table type?',
    back:  'Standard: 0–1 day (permanent tables)\nEnterprise+: 0–90 days (permanent tables)\nTransient/Temporary: 0–1 day on ANY edition\nFail-safe: always 7 days after TT (permanent only)',
  },
  {
    id: 'fc_d5_03', domain: 5, topic: 'Time Travel',
    front: '⚠️ TRAP: A table was dropped 2 days ago. Default retention = 1 day. Can UNDROP recover it?',
    back:  'NO — UNDROP uses Time Travel. With 1-day retention, the window expired after 1 day.\n\nFail-safe (days 1–7 after drop) is accessible only by Snowflake Support, not via SQL.',
  },
  {
    id: 'fc_d5_04', domain: 5, topic: 'Cloning',
    front: 'Zero-copy clone — what is the storage cost at creation time?',
    back:  '0 additional storage at clone time.\n\nThe clone shares all existing micro-partitions with the source (copy-on-write). Storage is only consumed when the clone is modified.',
  },
  {
    id: 'fc_d5_05', domain: 5, topic: 'Cloning',
    front: '⚠️ TRAP: You clone a database that has Dynamic Data Masking policies. What happens to the policies in the clone?',
    back:  'The cloned objects REFERENCE the original masking/row access policy objects — they are not deep-copied.\n\nIf the policies are in a different DB, dropping the original DB can break the clone (dangling references).',
  },
  {
    id: 'fc_d5_06', domain: 5, topic: 'Cloning',
    front: 'Can you clone a table to a historical point using Time Travel?',
    back:  'Yes:\nCREATE TABLE restored CLONE orders AT (TIMESTAMP => \'2026-03-01\'::TIMESTAMP)\n\nCombines zero-copy cloning with Time Travel for instant point-in-time recovery.',
  },
  {
    id: 'fc_d5_07', domain: 5, topic: 'Data Sharing',
    front: 'How is data transferred in Snowflake Secure Data Sharing?',
    back:  'Zero-copy — NO data is transferred.\n\nThe consumer gets a live read-only reference to the provider\'s micro-partitions. Queries run on the consumer\'s VW but read provider data.',
  },
  {
    id: 'fc_d5_08', domain: 5, topic: 'Data Sharing',
    front: '⚠️ TRAP: What edition does a DATA SHARING CONSUMER need?',
    back:  'ANY edition — including Standard.\n\nConsumers don\'t need a specific edition. Providers must be Standard+ for basic sharing; Business Critical for Failover-backed shares.',
  },
  {
    id: 'fc_d5_09', domain: 5, topic: 'Data Sharing',
    front: 'What is a Reader Account?',
    back:  'A Snowflake-managed account provisioned BY the data provider for consumers who don\'t have their own Snowflake account.\n\nCompute (virtual warehouse) runs on the reader account — billed to the provider.',
  },
  {
    id: 'fc_d5_10', domain: 5, topic: 'Data Sharing',
    front: '3-step DDL to share a table to a consumer account',
    back:  '1. CREATE SHARE my_share;\n2. GRANT USAGE ON DATABASE d TO SHARE my_share;\n   GRANT USAGE ON SCHEMA d.s TO SHARE my_share;\n   GRANT SELECT ON TABLE d.s.t TO SHARE my_share;\n3. ALTER SHARE my_share ADD ACCOUNTS = consumer_account;',
  },
  {
    id: 'fc_d5_11', domain: 5, topic: 'Marketplace',
    front: 'Snowflake Marketplace — is data copied to the consumer?',
    back:  'No — powered by Secure Data Sharing (zero-copy). Consumer queries provider\'s live data directly.\n\nNo data transfer costs. Data is always current.',
  },
  {
    id: 'fc_d5_12', domain: 5, topic: 'Data Sharing',
    front: 'Database roles vs Account roles in Data Sharing',
    back:  'Database roles CAN be shared to consumer accounts via Data Sharing — consumers can be granted the database role.\n\nAccount roles CANNOT be shared to other accounts.',
  },
  {
    id: 'fc_d5_13', domain: 5, topic: 'Collaboration',
    front: 'What is a Data Clean Room in Snowflake?',
    back:  'Privacy-preserving collaboration: two parties run joint analyses on overlapping data WITHOUT either seeing the other\'s raw records.\n\nUse case: advertiser + publisher matching audiences without exposing underlying customer data.',
  },
  {
    id: 'fc_d5_14', domain: 5, topic: 'Collaboration',
    front: '⚠️ TRAP: Fail-safe exists for which table types?',
    back:  'Permanent tables only — 7 days after Time Travel expires.\n\nTransient tables: NO Fail-safe\nTemporary tables: NO Fail-safe\n\nFail-safe adds storage cost — use transient tables when recovery is not needed.',
  },

  // ── Domain 1: Additional Cards (Days 2–4 coverage) ────────────────────────

  {
    id: 'fc_d1_19', domain: 1, topic: 'Architecture',
    front: 'Business Critical edition — what 2 features distinguish it from Enterprise?',
    back:  'PrivateLink (AWS/Azure/GCP private network connectivity — traffic never traverses the public internet)\nTri-Secret Secure (customer-managed encryption key)\n\nAlso: compliance certifications for HIPAA/PHI, PCI-DSS, SOC 2 Type II with BAA agreements.',
  },
  {
    id: 'fc_d1_20', domain: 1, topic: 'Storage Concepts',
    front: 'What is a Snowflake External Table, and what are its key limitations?',
    back:  'Read-only table querying files in cloud object storage (S3/GCS/Blob) via an external stage.\n\n⚠️ Limitations:\n• No DML (INSERT/UPDATE/DELETE)\n• Must run ALTER EXTERNAL TABLE … REFRESH to pick up new files\n• No micro-partition pruning metadata → slower queries than native tables',
  },
  {
    id: 'fc_d1_21', domain: 1, topic: 'AI/ML Features',
    front: 'What are Snowflake Notebooks?',
    back:  'Cell-based interactive development environments (Python / SQL / Markdown) that run INSIDE Snowflake on a virtual warehouse or compute pool.\n\nNo external Jupyter server needed. Direct access to Snowflake data + Snowpark APIs. Great for data exploration and ML development.',
  },
  {
    id: 'fc_d1_22', domain: 1, topic: 'Object Hierarchy',
    front: 'Which objects are ACCOUNT-LEVEL in Snowflake (not inside any DB)?',
    back:  'Virtual Warehouses\nResource Monitors\nUsers\nRoles\nIntegrations (Storage, Notification, API, Security)\nNetwork Policies\nShares\nReplication / Failover Groups\n\n⚠️ Everything else (DB, Schema, Table, View, Stage, Stream, Task…) lives inside a database.',
  },
  {
    id: 'fc_d1_23', domain: 1, topic: 'Storage Concepts',
    front: 'Snowflake Apache Iceberg table — what is the key benefit?',
    back:  'Interoperability — data is stored as open Parquet files + Iceberg metadata in YOUR object store.\n\nOther engines (Spark, Trino, Flink) can read the same data via Iceberg catalog.\nSnowflake-managed Iceberg: supports DML, Time Travel, governance — looks like a native table.',
  },
  {
    id: 'fc_d1_24', domain: 1, topic: 'Virtual Warehouses',
    front: '⚠️ TRAP: MODIFY vs OPERATE privilege on a warehouse',
    back:  'OPERATE = suspend / resume the warehouse\nMODIFY = resize (change SIZE, AUTO_SUSPEND, AUTO_RESUME, etc.)\nUSAGE = run queries\nMONITOR = view warehouse stats/query history\n\nThink: OPERATE = on/off switch, MODIFY = knobs & dials.',
  },
  {
    id: 'fc_d1_25', domain: 1, topic: 'Virtual Warehouses',
    front: 'AUTO_SUSPEND + AUTO_RESUME — how do they work together?',
    back:  'AUTO_SUSPEND = N seconds of inactivity before Snowflake suspends the warehouse (saves credits)\nAUTO_RESUME = TRUE means any submitted query automatically wakes the warehouse\n\n⚠️ With AUTO_RESUME = FALSE, queries fail if the warehouse is suspended — someone must RESUME manually.',
  },
  {
    id: 'fc_d1_26', domain: 1, topic: 'Virtual Warehouses',
    front: 'Multi-cluster: Auto-scale vs Maximized mode',
    back:  'Auto-scale: MIN < MAX — clusters start/stop based on queue depth (STANDARD or ECONOMY policy)\nMaximized: MIN = MAX — ALL clusters always running, no scale-down\n\nUse Maximized when you need instant, guaranteed capacity for consistently heavy concurrent workloads.',
  },

  // ── Domain 2: Additional Cards (Days 2–4 coverage) ────────────────────────

  {
    id: 'fc_d2_19', domain: 2, topic: 'RBAC',
    front: 'What is ORGADMIN and what can ONLY it do?',
    back:  'ORGADMIN is an account-level role that manages the Snowflake Organization:\n• CREATE ACCOUNT (create new Snowflake accounts)\n• View cross-account usage\n• Enable replication between accounts\n• Link accounts to an org\n\n⚠️ It does NOT replace ACCOUNTADMIN for in-account operations.',
  },
  {
    id: 'fc_d2_20', domain: 2, topic: 'RBAC',
    front: '⚠️ TRAP: GRANT OWNERSHIP — what happens to existing grants?',
    back:  'By default, existing grants are REVOKED when ownership transfers.\n\nTo preserve them:\nGRANT OWNERSHIP ON TABLE t TO ROLE new_owner COPY CURRENT GRANTS;\n\nWithout COPY CURRENT GRANTS, roles that previously had SELECT on the table lose it.',
  },
  {
    id: 'fc_d2_21', domain: 2, topic: 'Authentication',
    front: 'What is a Session Policy in Snowflake?',
    back:  'A schema-level object that controls session behavior:\n• SESSION_IDLE_TIMEOUT_MINS (auto-logout after inactivity)\n• SESSION_UI_IDLE_TIMEOUT_MINS (Snowsight idle)\n• MFA_ENROLLMENT (Optional / Required)\n\nApplied at ACCOUNT or USER level. User-level overrides account-level.',
  },
  {
    id: 'fc_d2_22', domain: 2, topic: 'ACCOUNT_USAGE',
    front: 'Resource Monitor trigger actions — what are the 3 levels?',
    back:  'NOTIFY — sends email alert, warehouse keeps running\nSUSPEND — waits for current queries to finish, then suspends\nSUSPEND_IMMEDIATE — aborts running queries instantly and suspends\n\nAll three can be set at different % thresholds (e.g., 75% = notify, 100% = suspend).',
  },
  {
    id: 'fc_d2_23', domain: 2, topic: 'Replication',
    front: '⚠️ TRAP: Replication Group vs Failover Group — what\'s the difference?',
    back:  'Replication Group: replicates objects across regions/clouds (read-only secondary)\nFailover Group: everything Replication Group does PLUS can be promoted (failover/failback)\n\nFailover Group is a superset. Use Failover Groups for DR. Both require Business Critical+ for account objects.',
  },
  {
    id: 'fc_d2_24', domain: 2, topic: 'Data Masking',
    front: 'What is an Aggregation Policy and what does it prevent?',
    back:  'A privacy policy that requires a minimum number of rows to be aggregated before results are returned.\n\nPrevents re-identification: if a GROUP BY bucket has fewer rows than the minimum group size, the result for that group is suppressed.\n\nExample: medical data — you can\'t isolate a single patient\'s record.',
  },

  // ── Domain 3: Additional Cards (Days 2–4 coverage) ────────────────────────

  {
    id: 'fc_d3_16', domain: 3, topic: 'COPY INTO',
    front: 'COPY INTO for UNLOAD — what\'s the syntax direction?',
    back:  'COPY INTO @stage FROM table (unload: table → stage)\nvs.\nCOPY INTO table FROM @stage (load: stage → table)\n\nKey unload options:\nSINGLE = TRUE (one file)\nHEADER = TRUE (include column names)\nFILE_FORMAT = (TYPE = CSV COMPRESSION = NONE)',
  },
  {
    id: 'fc_d3_17', domain: 3, topic: 'Snowpipe',
    front: 'How does Snowpipe AUTO_INGEST work on AWS?',
    back:  '1. File lands in S3\n2. S3 Event Notification → SQS message\n3. Snowpipe monitors the SQS queue\n4. Snowpipe auto-triggers a serverless load\n\n⚠️ No polling delay — near-real-time. The SQS ARN must be configured in the PIPE\'s notification_channel.',
  },
  {
    id: 'fc_d3_18', domain: 3, topic: 'COPY INTO',
    front: '⚠️ TRAP: What does PURGE = TRUE do in COPY INTO?',
    back:  'Deletes the source staged files AFTER a successful load.\n\nDefault = FALSE (files stay in stage).\n⚠️ PURGE only deletes on SUCCESS. Files that fail to load are NOT purged.',
  },
  {
    id: 'fc_d3_19', domain: 3, topic: 'Connectivity',
    front: 'What is the Snowflake Kafka Connector?',
    back:  'A Kafka Connect plugin that reads messages from Kafka topics and ingests them into Snowflake tables via Snowpipe (serverless).\n\nDeployed as a Kafka Connect worker — no custom code needed.\nHandles Avro, JSON, schema evolution. Uses Snowpipe for near-real-time ingestion.',
  },

  // ── Domain 4: Additional Cards (Days 2–4 coverage) ────────────────────────

  {
    id: 'fc_d4_16', domain: 4, topic: 'Query Optimization',
    front: 'What is a broadcast join in Snowflake?',
    back:  'When one table is small enough to fit in each node\'s memory, Snowflake sends (broadcasts) the entire small table to every compute node.\n\nEach node joins its portion of the large table locally — no network shuffle needed.\nAutomatically chosen by the optimizer. Efficient for fact + small dimension table joins.',
  },
  {
    id: 'fc_d4_17', domain: 4, topic: 'Semi-Structured Data',
    front: 'What does FLATTEN() do in Snowflake?',
    back:  'Explodes (unnests) a VARIANT array into one row per element using a LATERAL join.\n\nExample:\nSELECT f.value:item::VARCHAR\nFROM my_table,\nLATERAL FLATTEN(INPUT => data:items) f;\n\nf.value = element, f.index = position, f.key = object key (if object).',
  },
  {
    id: 'fc_d4_18', domain: 4, topic: 'Transformations',
    front: 'What is a UDTF (Tabular UDF) and how is it called?',
    back:  'A UDF that returns a TABLE (multiple rows + columns) instead of a scalar value.\n\nCalled inside a FROM clause:\nSELECT * FROM TABLE(my_udtf(arg));\n\nSupported in Python, Java, JavaScript. Used for complex per-row transformations that need to produce multiple output rows.',
  },
  {
    id: 'fc_d4_19', domain: 4, topic: 'Transformations',
    front: 'GROUPING SETS / ROLLUP / CUBE — what problem do they solve?',
    back:  'Compute aggregations at multiple levels of granularity in ONE query (without UNION ALL).\n\nROLLUP(a, b): grand total + (a) + (a, b) subtotals\nCUBE(a, b): all 4 combinations (a, b), (a), (b), ()\nGROUPING SETS((a),(b),()): explicitly list each grouping level\n\nUse for pivot-style reports and hierarchical aggregations.',
  },
  {
    id: 'fc_d4_20', domain: 4, topic: 'Query Profile',
    front: 'What does an Exchange node in Query Profile represent?',
    back:  'A network data shuffle between worker nodes inside the warehouse.\n\nOccurs during: hash joins (redistribute rows by join key) and GROUP BY (redistribute by group key).\n\n⚠️ High Exchange cost → large data redistribution. Fix: pre-aggregate, filter early, or consider clustering to co-locate join keys.',
  },
  {
    id: 'fc_d4_21', domain: 4, topic: 'Materialized Views',
    front: '⚠️ TRAP: Key difference between Materialized View and Result Cache',
    back:  'Materialized View: permanent named schema object, explicit DDL, own storage, refreshed by background serverless compute, survives indefinitely\n\nResult Cache: automatic, anonymous, 24-hour TTL, shared across ALL users, invalidated by DML, no DDL needed\n\nBoth improve query speed — but MVs are persistent; result cache is ephemeral.',
  },

  // ── Domain 5: Additional Cards (Days 2–4 coverage) ────────────────────────

  {
    id: 'fc_d5_15', domain: 5, topic: 'Time Travel',
    front: 'Can UNDROP recover a SCHEMA or DATABASE (not just a table)?',
    back:  'YES — UNDROP works at all three levels:\nUNDROP TABLE t\nUNDROP SCHEMA s\nUNDROP DATABASE d\n\n⚠️ The Time Travel window must not have expired. If it has, only Snowflake Support can attempt Fail-safe recovery (permanent tables only, 7 days).',
  },
  {
    id: 'fc_d5_16', domain: 5, topic: 'Data Sharing',
    front: 'What is a Snowflake Private Data Exchange?',
    back:  'An invitation-only, branded data sharing hub for B2B data sharing with specific partners.\n\nUnlike the public Snowflake Marketplace (visible to all), a Private Exchange is:\n• Not publicly discoverable\n• Requires an invitation\n• Used for partner/customer data products\n\nPowered by Secure Data Sharing (zero-copy) under the hood.',
  },
];
