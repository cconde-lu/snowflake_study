import streamlit as st
import random

QUESTIONS = [
    # ======================================================================
    # DOMAIN 1: ARCHITECTURE & FEATURES (10 questions)
    # ======================================================================
    {
        "id": 1, "domain": "D1: Architecture", "multi": False,
        "text": "Which Snowflake layer is responsible for authentication, query optimization, and metadata management?",
        "options": {
            "A": "Storage Layer",
            "B": "Cloud Services Layer",
            "C": "Compute Layer",
            "D": "Data Exchange Layer",
        },
        "answer": ["B"],
        "explanation": "Cloud Services handles auth, query parsing/optimization, metadata, access control, and the result cache. Storage stores data. Compute executes queries.",
    },
    {
        "id": 2, "domain": "D1: Architecture", "multi": False,
        "text": "What is the purpose of a file format object in Snowflake?",
        "options": {
            "A": "To define the physical layout of micro-partitions.",
            "B": "To define a reusable set of data parsing options for loading and unloading.",
            "C": "To specify the encryption method for staged files.",
            "D": "To create a mapping between external and internal column names.",
        },
        "answer": ["B"],
        "explanation": "A file format is a named, reusable object that defines parsing options (TYPE, DELIMITER, SKIP_HEADER, etc.) used with COPY INTO and stages.",
    },
    {
        "id": 3, "domain": "D1: Architecture", "multi": False,
        "text": "A Large warehouse runs for exactly 1 hour. How many credits are consumed?",
        "options": {
            "A": "4 credits",
            "B": "8 credits",
            "C": "16 credits",
            "D": "1 credit",
        },
        "answer": ["B"],
        "explanation": "Credits per hour by size: XS=1, S=2, M=4, L=8, XL=16. Large = 8 credits/hour.",
    },
    {
        "id": 4, "domain": "D1: Architecture", "multi": False,
        "text": "Why is the PRIMARY KEY constraint used on standard tables in Snowflake?",
        "options": {
            "A": "To enforce uniqueness and prevent duplicate rows.",
            "B": "To cluster data and improve query performance.",
            "C": "To indicate unique identifiers for metadata and documentation purposes.",
            "D": "To encrypt the primary key column automatically.",
        },
        "answer": ["C"],
        "explanation": "Snowflake PRIMARY KEY constraints are informational/metadata ONLY. They are NOT enforced. Duplicates ARE allowed. They indicate intended identifiers for documentation and BI tools.",
    },
    {
        "id": 5, "domain": "D1: Architecture", "multi": False,
        "text": "A materialized view references a base table. The base table has a column dropped. What happens to the materialized view?",
        "options": {
            "A": "The MV automatically adapts to the new schema.",
            "B": "The MV may become invalid if it referenced the dropped column.",
            "C": "The MV is automatically dropped.",
            "D": "Nothing, MVs are independent of the base table schema.",
        },
        "answer": ["B"],
        "explanation": "If a column referenced by the MV is dropped from the base table, the MV becomes invalid. From real exam: this is a key consideration when using MVs.",
    },
    {
        "id": 6, "domain": "D1: Architecture", "multi": True,
        "text": "What is the impact of selecting one Snowflake edition over another? (Select TWO).",
        "options": {
            "A": "The edition will impact the unit costs for storage.",
            "B": "The edition will impact which regions can be accessed.",
            "C": "The edition will determine the unit costs for compute credits.",
            "D": "The edition will impact the total allowed storage space.",
            "E": "The edition will set a limit on compute credits that can be consumed.",
        },
        "answer": ["A", "C"],
        "explanation": "Higher editions have higher unit costs for both storage and compute. Editions do NOT limit regions, storage space, or credit consumption.",
    },
    {
        "id": 7, "domain": "D1: Architecture", "multi": False,
        "text": "What does the parameter hierarchy mean in Snowflake?",
        "options": {
            "A": "Account settings always override session settings.",
            "B": "Object-level settings override session settings, which override account settings.",
            "C": "Session settings are the only level that can be changed.",
            "D": "All parameters must be set at the account level.",
        },
        "answer": ["B"],
        "explanation": "Parameter precedence: Object > Session > Account. The most specific level wins.",
    },
    {
        "id": 8, "domain": "D1: Architecture", "multi": False,
        "text": "Snowpark DataFrames are evaluated lazily. Where does the computation actually execute?",
        "options": {
            "A": "On the client machine running the Python code.",
            "B": "On the Snowflake virtual warehouse assigned to the session.",
            "C": "In a Snowflake-managed serverless pool.",
            "D": "On a dedicated Snowpark compute cluster.",
        },
        "answer": ["B"],
        "explanation": "Snowpark pushes computation to the session's warehouse. The client builds the plan lazily; evaluation runs SQL on the warehouse.",
    },
    {
        "id": 9, "domain": "D1: Architecture", "multi": False,
        "text": "What type of warehouse provides 16x more memory per node for ML training workloads?",
        "options": {
            "A": "Standard Gen 1",
            "B": "Standard Gen 2",
            "C": "Snowpark-optimized",
            "D": "Multi-cluster warehouse",
        },
        "answer": ["C"],
        "explanation": "Snowpark-optimized warehouses have 16x memory-to-compute ratio. Designed for ML training, large UDFs, and memory-intensive Snowpark operations.",
    },
    {
        "id": 10, "domain": "D1: Architecture", "multi": True,
        "text": "Which TWO activities can be monitored directly from the Snowsight Activity tab? (Select TWO).",
        "options": {
            "A": "Login history",
            "B": "Query history",
            "C": "Copy history",
            "D": "Event usage history",
            "E": "Warehouse metering history",
        },
        "answer": ["B", "C"],
        "explanation": "The Snowsight Activity tab shows Query History and Copy History directly. Login, events, and warehouse metering require ACCOUNT_USAGE views.",
    },
    # ======================================================================
    # DOMAIN 2: ACCOUNT ACCESS & SECURITY (7 questions)
    # ======================================================================
    {
        "id": 11, "domain": "D2: Security", "multi": False,
        "text": "Which system role is specifically designed to create and manage users and roles?",
        "options": {
            "A": "SYSADMIN",
            "B": "SECURITYADMIN",
            "C": "USERADMIN",
            "D": "ACCOUNTADMIN",
        },
        "answer": ["C"],
        "explanation": "USERADMIN creates/manages users and roles. SYSADMIN creates DBs/warehouses. SECURITYADMIN manages object grants. ACCOUNTADMIN manages billing/account settings.",
    },
    {
        "id": 12, "domain": "D2: Security", "multi": False,
        "text": "What type of encryption does Snowflake use by default for data at rest on ALL editions?",
        "options": {
            "A": "AES-128",
            "B": "AES-256",
            "C": "RSA-2048",
            "D": "TLS 1.2",
        },
        "answer": ["B"],
        "explanation": "All editions: AES-256 at rest, TLS 1.2 in transit. Tri-Secret Secure (customer-managed keys) requires Business Critical+.",
    },
    {
        "id": 13, "domain": "D2: Security", "multi": False,
        "text": "In a managed access schema, who can grant privileges on objects? (Select the BEST answer).",
        "options": {
            "A": "Any role that owns an object in the schema.",
            "B": "Only the schema owner and roles with MANAGE GRANTS privilege.",
            "C": "Only ACCOUNTADMIN.",
            "D": "Any role with USAGE on the schema.",
        },
        "answer": ["B"],
        "explanation": "In a managed access schema, ONLY the schema owner and MANAGE GRANTS roles can grant privileges. Individual object owners CANNOT grant access (unlike regular schemas).",
    },
    {
        "id": 14, "domain": "D2: Security", "multi": False,
        "text": "A company needs to protect PHI data and requires HIPAA compliance. What is the minimum Snowflake edition?",
        "options": {
            "A": "Standard",
            "B": "Enterprise",
            "C": "Business Critical",
            "D": "Virtual Private Snowflake",
        },
        "answer": ["C"],
        "explanation": "Business Critical is the minimum for HIPAA/PHI compliance, Tri-Secret Secure, and PrivateLink.",
    },
    {
        "id": 15, "domain": "D2: Security", "multi": False,
        "text": "What is it called when a customer-managed key is combined with a Snowflake-managed key to create a composite encryption key?",
        "options": {
            "A": "Hierarchical key model",
            "B": "Client-side encryption",
            "C": "Tri-Secret Secure",
            "D": "Key-pair authentication",
        },
        "answer": ["C"],
        "explanation": "Tri-Secret Secure combines customer KMS key + Snowflake key = composite encryption key. Requires Business Critical+.",
    },
    {
        "id": 16, "domain": "D2: Security", "multi": True,
        "text": "Which TWO criteria does Snowflake use to determine the current role when a session starts? (Select TWO).",
        "options": {
            "A": "If a role was specified in the connection and granted to the user, that role becomes current.",
            "B": "If no role was specified and a default role is set, the default role becomes current.",
            "C": "If no role was specified and no default is set, the login fails.",
            "D": "If a specified role is not granted to the user, it is silently ignored.",
            "E": "If a specified role is not granted, it is automatically granted.",
        },
        "answer": ["A", "B"],
        "explanation": "A: Specified + granted = becomes current. B: No role specified = default role used. C is wrong (PUBLIC is used, login succeeds). D is wrong (error, not silent). E is wrong (not auto-granted).",
    },
    {
        "id": 17, "domain": "D2: Security", "multi": False,
        "text": "A column has a masking policy applied. An analyst needs to see the full values but currently sees masked data. What should be changed?",
        "options": {
            "A": "Grant the analyst ACCOUNTADMIN role.",
            "B": "Modify the masking policy to include the analyst's role.",
            "C": "Remove the masking policy from the column.",
            "D": "Grant the analyst OWNERSHIP on the table.",
        },
        "answer": ["B"],
        "explanation": "Modify the policy to include the analyst's role. ACCOUNTADMIN does NOT bypass masking. Removing the policy or granting OWNERSHIP are overkill.",
    },
    # ======================================================================
    # DOMAIN 3: DATA LOADING & UNLOADING (9 questions)
    # ======================================================================
    {
        "id": 18, "domain": "D3: Loading", "multi": False,
        "text": "What is the default file format for unloading data using COPY INTO <location>?",
        "options": {
            "A": "JSON",
            "B": "CSV",
            "C": "Parquet",
            "D": "Avro",
        },
        "answer": ["B"],
        "explanation": "Default unload format is CSV with gzip compression.",
    },
    {
        "id": 19, "domain": "D3: Loading", "multi": False,
        "text": "Which information is put in the STORAGE_ALLOWED_LOCATIONS parameter when creating a storage integration?",
        "options": {
            "A": "A table name.",
            "B": "A user, table, or named internal stage.",
            "C": "A cloud provider name.",
            "D": "S3 bucket, GCS bucket, or Azure container folder path.",
        },
        "answer": ["D"],
        "explanation": "STORAGE_ALLOWED_LOCATIONS specifies the cloud storage paths that the integration is allowed to access.",
    },
    {
        "id": 20, "domain": "D3: Loading", "multi": True,
        "text": "What mechanisms can trigger Snowpipe to load staged files? (Select TWO).",
        "options": {
            "A": "Cloud messaging (S3 SQS, Azure Event Grid, GCS Pub/Sub)",
            "B": "Email integrations",
            "C": "Error notifications",
            "D": "REST API endpoints (insertFiles)",
            "E": "Snowsight button clicks",
        },
        "answer": ["A", "D"],
        "explanation": "Snowpipe is triggered by: 1) Cloud event notifications (AUTO_INGEST=TRUE) or 2) REST API calls (insertFiles endpoint).",
    },
    {
        "id": 21, "domain": "D3: Loading", "multi": False,
        "text": "A user needs to upload a file from their local machine to their personal default stage in a folder called current_data. Which command?",
        "options": {
            "A": "PUT file:///sales.csv @current_data",
            "B": "PUT file:///sales.csv @~/current_data",
            "C": "PUT file:///sales.csv @%current_data",
            "D": "COPY INTO @~/current_data FROM file:///sales.csv",
        },
        "answer": ["B"],
        "explanation": "@~ is the user stage (personal default). @% is the table stage. PUT to @~/current_data uploads into that subfolder. COPY INTO does not upload local files.",
    },
    {
        "id": 22, "domain": "D3: Loading", "multi": False,
        "text": "What does the VALIDATION_MODE parameter do in COPY INTO?",
        "options": {
            "A": "Validates data and loads it, logging errors to a table.",
            "B": "Validates data without loading it and returns any errors found.",
            "C": "Validates the target table schema before loading.",
            "D": "Validates credentials for the stage connection.",
        },
        "answer": ["B"],
        "explanation": "VALIDATION_MODE is a dry-run. NO data is loaded. It validates and returns errors. Useful for pre-checking files.",
    },
    {
        "id": 23, "domain": "D3: Loading", "multi": False,
        "text": "What does adding PARTITION BY in a COPY INTO <location> (unload) command do?",
        "options": {
            "A": "Partitions the target table for faster queries.",
            "B": "Splits unloaded table rows into separate files based on column values.",
            "C": "Defines a partitioning scheme for the stage.",
            "D": "Filters rows to unload based on partition values.",
        },
        "answer": ["B"],
        "explanation": "PARTITION BY in COPY INTO unload splits output into separate files by column values. Example: PARTITION BY (region) creates one file per region.",
    },
    {
        "id": 24, "domain": "D3: Loading", "multi": False,
        "text": "How does a stream in Snowflake know when it will become stale?",
        "options": {
            "A": "By using DATA_RETENTION_TIME_IN_DAYS alone.",
            "B": "By using the lesser of retention and MAX_DATA_EXTENSION_TIME_IN_DAYS.",
            "C": "By using the greater of retention and MAX_DATA_EXTENSION_TIME_IN_DAYS.",
            "D": "By using the sum of both values.",
        },
        "answer": ["C"],
        "explanation": "Stream staleness = the GREATER of DATA_RETENTION_TIME_IN_DAYS and MAX_DATA_EXTENSION_TIME_IN_DAYS. The extension keeps the stream alive longer.",
    },
    {
        "id": 25, "domain": "D3: Loading", "multi": False,
        "text": "When creating an external stage for S3, what is the primary security benefit of using a STORAGE INTEGRATION?",
        "options": {
            "A": "It encrypts files in the bucket using Snowflake keys.",
            "B": "It grants temporary permissions to unload data.",
            "C": "It deploys stored procedures from a private Git repository.",
            "D": "It avoids storing hard-coded credentials in the stage definition.",
        },
        "answer": ["D"],
        "explanation": "Storage integrations use IAM trust relationships. The primary benefit is avoiding hard-coded AWS keys in stage definitions.",
    },
    {
        "id": 26, "domain": "D3: Loading", "multi": False,
        "text": "A company needs continuous, automatic data loading from S3 into Snowflake as soon as files appear. Which tool meets this requirement?",
        "options": {
            "A": "Snowflake CLI",
            "B": "Snowpipe",
            "C": "Snowpark",
            "D": "SnowSQL",
        },
        "answer": ["B"],
        "explanation": "Snowpipe provides continuous, automatic ingestion triggered by cloud event notifications. CLI, SnowSQL, and Snowpark are for running commands/code, not continuous auto-ingestion.",
    },
    # ======================================================================
    # DOMAIN 4: PERFORMANCE & TRANSFORMATION (9 questions)
    # ======================================================================
    {
        "id": 27, "domain": "D4: Performance", "multi": False,
        "text": "A warehouse shows consistent spilling (local and remote) AND queuing during peak hours. What is the MOST efficient solution?",
        "options": {
            "A": "Increase the warehouse size.",
            "B": "Use a multi-cluster warehouse with STANDARD scaling.",
            "C": "Use a multi-cluster warehouse with ECONOMY scaling.",
            "D": "Shorten the STATEMENT_QUEUED_TIMEOUT_IN_SECONDS.",
        },
        "answer": ["B"],
        "explanation": "Spilling needs more resources AND queuing needs more concurrency. Multi-cluster with STANDARD scaling addresses BOTH: larger effective compute + immediate cluster addition for concurrency. Scale up alone only fixes spilling.",
    },
    {
        "id": 28, "domain": "D4: Performance", "multi": False,
        "text": "A Query Profile shows all partitions are being scanned on a table with no clustering key. Queries filter on a date column with 3,000 distinct values. Best optimization?",
        "options": {
            "A": "Enable Search Optimization Service on the date column.",
            "B": "Add a clustering key on the date column.",
            "C": "Enable Query Acceleration Service.",
            "D": "Create a materialized view.",
        },
        "answer": ["B"],
        "explanation": "Low-medium cardinality (3,000 values) + filter column + poor pruning = clustering key. SOS is for high-cardinality equality lookups. QAS is for outlier queries.",
    },
    {
        "id": 29, "domain": "D4: Performance", "multi": False,
        "text": "Which type of query would benefit MOST from enabling the Query Acceleration Service?",
        "options": {
            "A": "Queries with no filters or aggregation.",
            "B": "Queries that are queued in the warehouse.",
            "C": "Queries that use more resources than the typical query.",
            "D": "All queries benefit equally from QAS.",
        },
        "answer": ["C"],
        "explanation": "QAS accelerates outlier queries that use significantly more resources than typical. It does not help queuing (use multi-cluster) or filterless queries.",
    },
    {
        "id": 30, "domain": "D4: Performance", "multi": True,
        "text": "Based on Query Profile analysis, which TWO columns benefit MOST from a clustering key? (Select TWO).",
        "options": {
            "A": "A column frequently in ORDER BY operations.",
            "B": "A column frequently in WHERE operations.",
            "C": "A column frequently in GROUP BY operations.",
            "D": "A column frequently in AGGREGATE operations.",
            "E": "A column frequently in JOIN operations.",
        },
        "answer": ["B", "E"],
        "explanation": "Clustering keys improve pruning for WHERE filters and JOIN conditions. ORDER BY, GROUP BY, and aggregations benefit less from clustering.",
    },
    {
        "id": 31, "domain": "D4: Performance", "multi": False,
        "text": "A warehouse suspends. When it resumes, the first query is slow. Why?",
        "options": {
            "A": "The result cache expired during suspension.",
            "B": "The local SSD cache was cleared on suspend and data must be fetched from remote storage.",
            "C": "The query was too large for memory.",
            "D": "The result cache needed to be retrieved from another warehouse.",
        },
        "answer": ["B"],
        "explanation": "SSD cache is wiped on suspend (cold start). Data must be re-fetched from remote storage. Result cache lives in Cloud Services and survives suspension.",
    },
    {
        "id": 32, "domain": "D4: Performance", "multi": False,
        "text": "Which query can benefit from the result cache?",
        "options": {
            "A": "SELECT customer_id FROM Customer WHERE city = 'Chicago'",
            "B": "SELECT customer_id FROM Customer WHERE state = $VState",
            "C": "SELECT UUID_STRING() FROM Customers WHERE state = 'AZ'",
            "D": "SELECT customer_id FROM Customer WHERE tag = UUID_STRING()",
        },
        "answer": ["A"],
        "explanation": "Result cache requires identical query text + deterministic functions. A is deterministic. B uses session variable (text changes). C and D use UUID_STRING() (non-deterministic).",
    },
    {
        "id": 33, "domain": "D4: Performance", "multi": False,
        "text": "When semi-structured data includes dates as string values, what Snowflake recommendation OPTIMIZES pruning and MINIMIZES storage?",
        "options": {
            "A": "Store the data as VARIANT.",
            "B": "Store the data as ARRAY.",
            "C": "Strip the outer array using TRY_PARSE_JSON.",
            "D": "Flatten the key data into relational columns.",
        },
        "answer": ["D"],
        "explanation": "Snowflake recommends flattening frequently queried date/timestamp fields into native relational columns. This enables micro-partition pruning and reduces storage vs strings inside VARIANT.",
    },
    {
        "id": 34, "domain": "D4: Performance", "multi": False,
        "text": "When unloading relational data to JSON, which function converts each row into a single VARIANT JSON object?",
        "options": {
            "A": "ARRAY_AGG",
            "B": "OBJECT_CONSTRUCT",
            "C": "PARSE_JSON",
            "D": "TO_VARIANT",
        },
        "answer": ["B"],
        "explanation": "OBJECT_CONSTRUCT(*) converts each row into {col_name: value, ...} JSON. Used with COPY INTO @stage to unload as JSON.",
    },
    {
        "id": 35, "domain": "D4: Performance", "multi": False,
        "text": "A virtual warehouse was used for 5 minutes and 15 seconds then shut down. How many seconds is the customer billed for?",
        "options": {
            "A": "300 seconds",
            "B": "315 seconds",
            "C": "320 seconds",
            "D": "360 seconds",
        },
        "answer": ["B"],
        "explanation": "Per-second billing with 60-second minimum. 5m15s = 315 seconds. Since 315 > 60, the exact 315 seconds is billed.",
    },
    # ======================================================================
    # DOMAIN 5: DATA COLLABORATION & SHARING (5 questions)
    # ======================================================================
    {
        "id": 36, "domain": "D5: Sharing", "multi": False,
        "text": "What is true about Snowflake Secure Data Sharing?",
        "options": {
            "A": "Data is physically copied to the consumer account.",
            "B": "Only views can be shared, not tables.",
            "C": "Data is shared without copying, using Snowflake's metadata layer.",
            "D": "Both accounts must be in different regions.",
        },
        "answer": ["C"],
        "explanation": "Secure Data Sharing provides zero-copy access via metadata references. No data is copied. Tables and secure views can be shared.",
    },
    {
        "id": 37, "domain": "D5: Sharing", "multi": True,
        "text": "Which database objects can be shared with Secure Data Sharing? (Select TWO).",
        "options": {
            "A": "Secure views",
            "B": "Materialized views",
            "C": "External stages",
            "D": "External tables",
            "E": "Dynamic tables",
        },
        "answer": ["A", "D"],
        "explanation": "Secure views and external tables can be shared. Standard views, materialized views, stages, and dynamic tables cannot be directly shared.",
    },
    {
        "id": 38, "domain": "D5: Sharing", "multi": False,
        "text": "What role is needed to create a Reader Account for a consumer who does not have a Snowflake account?",
        "options": {
            "A": "SYSADMIN",
            "B": "ACCOUNTADMIN",
            "C": "USERADMIN",
            "D": "SECURITYADMIN",
        },
        "answer": ["B"],
        "explanation": "Only ACCOUNTADMIN can create Reader Accounts. The provider pays for all compute in the Reader Account.",
    },
    {
        "id": 39, "domain": "D5: Sharing", "multi": False,
        "text": "What privilege does a user need to receive or request data from the Snowflake Marketplace?",
        "options": {
            "A": "CREATE DATA EXCHANGE LISTING",
            "B": "CREATE SHARE",
            "C": "IMPORT SHARE",
            "D": "IMPORTED PRIVILEGES",
        },
        "answer": ["C"],
        "explanation": "IMPORT SHARE privilege is required to get/install Marketplace listings. CREATE SHARE is for providers. IMPORTED PRIVILEGES grants access to shared DB objects.",
    },
    {
        "id": 40, "domain": "D5: Sharing", "multi": False,
        "text": "What happens when a table with a column referencing a sequence is cloned?",
        "options": {
            "A": "A new independent sequence is created for the clone.",
            "B": "The clone references the same original sequence.",
            "C": "The default is removed from the cloned table.",
            "D": "The clone fails because sequences cannot be referenced in clones.",
        },
        "answer": ["B"],
        "explanation": "The cloned table references the SAME original sequence. The sequence is NOT duplicated. Both tables share it. Validated via live SQL.",
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
    st.set_page_config(page_title="S1-E01 Baseline", page_icon="3", layout="wide")
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
    st.title("COF-C03 Season 1, Exam 01 - BASELINE")
    st.markdown("**40 Questions | Calibrated to Real Exam Difficulty**")
    st.markdown("---")
    col1, col2 = st.columns(2)
    with col1:
        st.markdown("**Domain Distribution (matches real exam)**")
        for d in DOMAINS:
            count = sum(1 for q in QUESTIONS if q["domain"] == d)
            st.markdown(f"- {d} ({count}q)")
    with col2:
        st.markdown("**Calibration**")
        st.markdown(
            "- 46% basic recall, 36% scenario, 18% discrimination\n"
            "- 32% easy, 43% medium, 25% hard\n"
            "- 74% single-select, 26% multi-select\n"
            "- Mandatory: scale up/out, optimization tools,\n"
            "  sharing, billing, Query Profile, cache, Snowpipe\n"
            "- Questions sourced from real exam patterns"
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
    st.title("Season 1, Exam 01 - Results")
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
