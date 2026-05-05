import streamlit as st
import random

QUESTIONS = [
    # ======================================================================
    # D1: ARCHITECTURE & FEATURES (10 questions)
    # ======================================================================
    {
        "id": 1, "domain": "D1: Architecture", "multi": False,
        "text": "Which Snowflake feature allows automatic continuous loading from cloud storage WITHOUT requiring a user-managed warehouse?",
        "options": {
            "A": "Scheduled tasks with COPY INTO",
            "B": "Snowpipe",
            "C": "Dynamic tables",
            "D": "Materialized views",
        },
        "answer": ["B"],
        "explanation": "Snowpipe uses serverless compute (not a user warehouse) for continuous auto-ingestion triggered by cloud event notifications or REST API.",
    },
    {
        "id": 2, "domain": "D1: Architecture", "multi": False,
        "text": "A sequence is used as a default value in a table. Two sessions call nextval concurrently. Are values guaranteed to be sequential with no gaps?",
        "options": {
            "A": "Yes, sequences always produce sequential, gap-free values.",
            "B": "No, sequences guarantee uniqueness but not gap-free or ordered delivery.",
            "C": "Yes, but only within the same warehouse.",
            "D": "No, sequences produce random values.",
        },
        "answer": ["B"],
        "explanation": "Snowflake sequences guarantee unique values but NOT gap-free or sequential across sessions. Values are allocated in batches, causing potential gaps.",
    },
    {
        "id": 3, "domain": "D1: Architecture", "multi": False,
        "text": "What is the key difference between a standard view and a secure view?",
        "options": {
            "A": "Secure views are faster because they are pre-computed.",
            "B": "Secure views hide their SQL definition from non-owner roles.",
            "C": "Standard views support JOINs; secure views do not.",
            "D": "Secure views can only reference one table.",
        },
        "answer": ["B"],
        "explanation": "Secure views hide their definition from non-owners, preventing data leakage. Standard views expose their SQL. Both support JOINs and multiple tables. MVs (not secure views) are pre-computed.",
    },
    {
        "id": 4, "domain": "D1: Architecture", "multi": False,
        "text": "A warehouse resumes, runs a query for 30 seconds, then suspends. How many seconds are billed?",
        "options": {
            "A": "30 seconds",
            "B": "60 seconds",
            "C": "90 seconds",
            "D": "0 seconds (under 1 minute is free)",
        },
        "answer": ["B"],
        "explanation": "Per-second billing with 60-second minimum per resume. 30 < 60, so charged 60 seconds.",
    },
    {
        "id": 5, "domain": "D1: Architecture", "multi": True,
        "text": "Which TWO Snowflake features use serverless compute managed by Snowflake? (Select TWO).",
        "options": {
            "A": "Automatic Clustering",
            "B": "User-created virtual warehouses",
            "C": "Snowpipe",
            "D": "Running SELECT queries",
            "E": "User-Defined Functions",
        },
        "answer": ["A", "C"],
        "explanation": "Automatic Clustering and Snowpipe use Snowflake-managed serverless compute. Warehouses, queries, and UDFs run on user-managed compute.",
    },
    {
        "id": 6, "domain": "D1: Architecture", "multi": False,
        "text": "What does a dynamic table provide that a materialized view cannot?",
        "options": {
            "A": "Automatic refresh.",
            "B": "Support for JOINs and complex transformations.",
            "C": "Pre-computed results for faster reads.",
            "D": "Serverless maintenance.",
        },
        "answer": ["B"],
        "explanation": "Dynamic tables support JOINs and complex transformations. MVs are limited to a single base table with no JOINs. Both auto-refresh and pre-compute.",
    },
    {
        "id": 7, "domain": "D1: Architecture", "multi": False,
        "text": "Which tool tests connectivity between a client and Snowflake, checking DNS, TLS, and OCSP?",
        "options": {
            "A": "SnowSQL",
            "B": "Snowflake CLI (snow)",
            "C": "SnowCD",
            "D": "Snowsight",
        },
        "answer": ["C"],
        "explanation": "SnowCD (Connectivity Diagnostic) tests network connectivity. It does NOT execute queries. SnowSQL runs SQL. Snowflake CLI manages objects. Snowsight is the web UI.",
    },
    {
        "id": 8, "domain": "D1: Architecture", "multi": False,
        "text": "Storage billing in Snowflake is calculated based on what?",
        "options": {
            "A": "Per query execution.",
            "B": "Monthly average of compressed data stored, including Time Travel and Fail-safe.",
            "C": "A flat monthly rate regardless of data volume.",
            "D": "Storage is included in compute credits.",
        },
        "answer": ["B"],
        "explanation": "Storage is billed monthly based on the average amount of compressed data stored, including active data, Time Travel data, and Fail-safe data. Separate from compute.",
    },
    {
        "id": 9, "domain": "D1: Architecture", "multi": False,
        "text": "Cortex Analyst converts what into SQL queries?",
        "options": {
            "A": "Python DataFrames",
            "B": "Natural language questions using a semantic model",
            "C": "Stored procedure code",
            "D": "Query Profile output",
        },
        "answer": ["B"],
        "explanation": "Cortex Analyst is a text-to-SQL service. It takes natural language questions and generates SQL using a semantic model (YAML) that describes tables, joins, and metrics.",
    },
    {
        "id": 10, "domain": "D1: Architecture", "multi": False,
        "text": "What happens when a task's WHEN condition evaluates to FALSE?",
        "options": {
            "A": "The task runs but processes zero rows.",
            "B": "The task is skipped entirely and no compute is consumed.",
            "C": "The task is automatically suspended.",
            "D": "An error is logged to the task history.",
        },
        "answer": ["B"],
        "explanation": "When WHEN evaluates to FALSE, the entire task run is skipped. No warehouse is resumed, no compute consumed. Common pattern: WHEN SYSTEM$STREAM_HAS_DATA().",
    },
    # ======================================================================
    # D2: ACCOUNT ACCESS & SECURITY (7 questions)
    # ======================================================================
    {
        "id": 11, "domain": "D2: Security", "multi": False,
        "text": "Which Snowflake feature allows organizations to manage user identities via an external identity provider?",
        "options": {
            "A": "MFA",
            "B": "SCIM",
            "C": "Key-pair authentication",
            "D": "Network policies",
        },
        "answer": ["B"],
        "explanation": "SCIM automates user and group provisioning/deprovisioning from an external IdP (Okta, Azure AD, etc.).",
    },
    {
        "id": 12, "domain": "D2: Security", "multi": False,
        "text": "What privilege must be granted to a role so it can create tables in a specific schema?",
        "options": {
            "A": "USAGE on the schema",
            "B": "CREATE TABLE on the schema",
            "C": "OWNERSHIP of the schema",
            "D": "INSERT on the schema",
        },
        "answer": ["B"],
        "explanation": "CREATE TABLE on the schema grants table creation ability. USAGE allows browsing. OWNERSHIP grants everything. The role also needs USAGE on the database and schema.",
    },
    {
        "id": 13, "domain": "D2: Security", "multi": True,
        "text": "How can ACCESS_HISTORY be used to review data governance? (Select TWO).",
        "options": {
            "A": "Identify queries run by a particular user.",
            "B": "Identify access to roles given to a user.",
            "C": "Identify SQL statements that failed to run.",
            "D": "Identify objects that were modified by a query.",
            "E": "Identify object dependencies.",
        },
        "answer": ["A", "D"],
        "explanation": "ACCESS_HISTORY tracks which user ran queries (A) and which objects were read/written/modified (D). Role grants use GRANTS_TO_USERS. Failed SQL uses QUERY_HISTORY. Dependencies use OBJECT_DEPENDENCIES.",
    },
    {
        "id": 14, "domain": "D2: Security", "multi": False,
        "text": "A column has a masking policy that allows role FINANCE. A user queries through a view that reads this column. The user's role is ANALYST. What do they see?",
        "options": {
            "A": "Unmasked data because views bypass masking.",
            "B": "Masked data because the policy follows the column through views.",
            "C": "An error because masking blocks view access.",
            "D": "Unmasked data because the view owner has FINANCE role.",
        },
        "answer": ["B"],
        "explanation": "Masking policies follow the column, not the object. Querying through a view still evaluates the policy against the querying role. ANALYST is not FINANCE, so data is masked.",
    },
    {
        "id": 15, "domain": "D2: Security", "multi": False,
        "text": "What is the effect of granting OPERATE privilege on a warehouse?",
        "options": {
            "A": "The role can execute queries on the warehouse.",
            "B": "The role can resume, suspend, and abort queries on the warehouse.",
            "C": "The role can resize the warehouse.",
            "D": "The role can drop the warehouse.",
        },
        "answer": ["B"],
        "explanation": "OPERATE = resume, suspend, abort queries. USAGE = execute queries. MODIFY = resize, change properties. OWNERSHIP = all + drop.",
    },
    {
        "id": 16, "domain": "D2: Security", "multi": False,
        "text": "Which edition is the MINIMUM required to use Dynamic Data Masking?",
        "options": {
            "A": "Standard",
            "B": "Enterprise",
            "C": "Business Critical",
            "D": "Virtual Private Snowflake",
        },
        "answer": ["B"],
        "explanation": "Dynamic Data Masking requires Enterprise Edition or higher.",
    },
    {
        "id": 17, "domain": "D2: Security", "multi": False,
        "text": "Higher Snowflake editions impact which costs?",
        "options": {
            "A": "Only compute credit unit costs.",
            "B": "Only storage unit costs.",
            "C": "Both storage and compute unit costs.",
            "D": "Neither. Pricing is the same across all editions.",
        },
        "answer": ["C"],
        "explanation": "Higher editions have higher unit costs for BOTH storage and compute. Standard is cheapest per unit. Business Critical and VPS are more expensive per TB and per credit.",
    },
    # ======================================================================
    # D3: DATA LOADING & UNLOADING (9 questions)
    # ======================================================================
    {
        "id": 18, "domain": "D3: Loading", "multi": False,
        "text": "What is the primary security benefit of using a STORAGE INTEGRATION for an external stage?",
        "options": {
            "A": "It encrypts data files in the bucket.",
            "B": "It grants temporary unload permissions.",
            "C": "It avoids storing hard-coded credentials in the stage definition.",
            "D": "It deploys stored procedures from a Git repository.",
        },
        "answer": ["C"],
        "explanation": "Storage integrations use IAM trust relationships. No AWS keys or secrets are stored in the stage definition itself.",
    },
    {
        "id": 19, "domain": "D3: Loading", "multi": False,
        "text": "What does the MATCH_BY_COLUMN_NAME option do in COPY INTO?",
        "options": {
            "A": "Loads only columns that exist in both file and table.",
            "B": "Matches file columns to table columns by name instead of position.",
            "C": "Validates column name uniqueness before loading.",
            "D": "Renames columns to match the target table.",
        },
        "answer": ["B"],
        "explanation": "MATCH_BY_COLUMN_NAME matches by name not ordinal position. Useful for Parquet, Avro, ORC where column order may differ.",
    },
    {
        "id": 20, "domain": "D3: Loading", "multi": False,
        "text": "What does a directory table on a stage provide?",
        "options": {
            "A": "The data content of all files.",
            "B": "File-level metadata: URLs, sizes, last-modified timestamps.",
            "C": "The schema of the files.",
            "D": "Access control lists for each file.",
        },
        "answer": ["B"],
        "explanation": "Directory tables provide file-level metadata (not content). Useful for managing unstructured data and building file catalogs.",
    },
    {
        "id": 21, "domain": "D3: Loading", "multi": False,
        "text": "A COPY INTO uses ON_ERROR = 'SKIP_FILE_3'. A file has exactly 2 parsing errors. What happens?",
        "options": {
            "A": "The file is skipped because it has errors.",
            "B": "The file is loaded because 2 < 3 (threshold not reached).",
            "C": "Only the first 3 rows are loaded.",
            "D": "The entire COPY aborts.",
        },
        "answer": ["B"],
        "explanation": "SKIP_FILE_n skips when errors >= n. Since 2 < 3, the file IS loaded (bad rows handled per other settings). With 3+ errors, it would be skipped.",
    },
    {
        "id": 22, "domain": "D3: Loading", "multi": True,
        "text": "Which TWO are valid stage file operations? (Select TWO).",
        "options": {
            "A": "LIST @my_stage (view files)",
            "B": "REMOVE @my_stage/file.csv (delete files)",
            "C": "RENAME @my_stage/old.csv TO new.csv",
            "D": "MOVE @my_stage/file.csv TO @other_stage",
            "E": "EDIT @my_stage/file.csv",
        },
        "answer": ["A", "B"],
        "explanation": "LIST (LS) and REMOVE (RM) are the only file operations. No RENAME, MOVE, or EDIT commands for staged files.",
    },
    {
        "id": 23, "domain": "D3: Loading", "multi": False,
        "text": "A stage has FILE_FORMAT set to pipe-delimited CSV. A COPY INTO command specifies FILE_FORMAT = (TYPE=CSV FIELD_DELIMITER=','). Which delimiter is used?",
        "options": {
            "A": "Pipe (stage format wins).",
            "B": "Comma (COPY inline format overrides stage format).",
            "C": "An error for conflicting formats.",
            "D": "System default (tab).",
        },
        "answer": ["B"],
        "explanation": "File format precedence: COPY INTO inline > stage-level > schema/database defaults. Inline always wins.",
    },
    {
        "id": 24, "domain": "D3: Loading", "multi": False,
        "text": "Snowpipe Streaming (via the Ingest SDK) differs from standard Snowpipe in what key way?",
        "options": {
            "A": "Streaming uses a user warehouse; standard is serverless.",
            "B": "Streaming inserts rows directly without staging files.",
            "C": "Standard supports JSON only; Streaming supports all formats.",
            "D": "They are identical services.",
        },
        "answer": ["B"],
        "explanation": "Snowpipe Streaming inserts rows directly via SDK without intermediate files. Standard Snowpipe loads files from stages.",
    },
    {
        "id": 25, "domain": "D3: Loading", "multi": False,
        "text": "A Kafka connector sends data to Snowflake. What authentication method does it use?",
        "options": {
            "A": "Username and password",
            "B": "OAuth tokens",
            "C": "Key-pair (RSA) authentication",
            "D": "SAML 2.0 SSO",
        },
        "answer": ["C"],
        "explanation": "The Snowflake Kafka Connector uses key-pair (RSA) authentication for secure programmatic access.",
    },
    {
        "id": 26, "domain": "D3: Loading", "multi": False,
        "text": "Which function can be used to examine the structure of files in a stage before loading?",
        "options": {
            "A": "DESCRIBE STAGE",
            "B": "INFER_SCHEMA",
            "C": "VALIDATE",
            "D": "SHOW FILE FORMATS",
        },
        "answer": ["B"],
        "explanation": "INFER_SCHEMA analyzes files in a stage and returns detected column names, types, and order. VALIDATE checks errors after loading. DESCRIBE shows stage properties.",
    },
    # ======================================================================
    # D4: PERFORMANCE & TRANSFORMATION (9 questions)
    # ======================================================================
    {
        "id": 27, "domain": "D4: Performance", "multi": False,
        "text": "A complex 8-table JOIN query scans all partitions. The Query Profile shows inefficient pruning. What is the root cause?",
        "options": {
            "A": "The warehouse is too small.",
            "B": "Pruning is not being performed efficiently because filter columns are not aligned with data layout.",
            "C": "Too many JOINs prevent pruning.",
            "D": "The result cache has expired.",
        },
        "answer": ["B"],
        "explanation": "All partitions scanned = pruning failure. Filter columns are not aligned with clustering. Fix: add clustering keys on frequently filtered columns.",
    },
    {
        "id": 28, "domain": "D4: Performance", "multi": False,
        "text": "A standard warehouse has increasing queuing at the same time each day due to many concurrent users. Which is the MOST cost-effective solution?",
        "options": {
            "A": "Scale up the warehouse.",
            "B": "Run the warehouse in Auto-scale mode.",
            "C": "Run the warehouse in Maximized mode.",
            "D": "Use a Snowpark-optimized warehouse.",
        },
        "answer": ["B"],
        "explanation": "Auto-scale (multi-cluster, auto-scaling) adds clusters during peak and removes them when demand drops. Most cost-effective for predictable daily spikes. Maximized runs all clusters always (expensive).",
    },
    {
        "id": 29, "domain": "D4: Performance", "multi": False,
        "text": "Which table characteristic will PREVENT the Query Acceleration Service from accelerating queries?",
        "options": {
            "A": "The table has a large number of micro-partitions.",
            "B": "The table has Search Optimization configured.",
            "C": "A clustering key is defined on a GEOMETRY column.",
            "D": "The table was created with CREATE TABLE AS SELECT.",
        },
        "answer": ["C"],
        "explanation": "QAS does not support tables with clustering keys on GEOMETRY columns. Large partition counts, SOS, and CTAS tables do not block QAS.",
    },
    {
        "id": 30, "domain": "D4: Performance", "multi": True,
        "text": "Which TWO scenarios benefit MOST from a clustering key? (Select TWO).",
        "options": {
            "A": "Filtering on a column in ORDER BY frequently.",
            "B": "Filtering on a column in WHERE frequently.",
            "C": "Filtering on a column in GROUP BY frequently.",
            "D": "Filtering on a column in AGGREGATE operations.",
            "E": "Filtering on a column in JOIN conditions frequently.",
        },
        "answer": ["B", "E"],
        "explanation": "Clustering improves pruning for WHERE filters and JOIN conditions by aligning data with min/max metadata.",
    },
    {
        "id": 31, "domain": "D4: Performance", "multi": False,
        "text": "An ETL pipeline runs a single complex transformation spilling to REMOTE storage. No queuing. What should you do?",
        "options": {
            "A": "Add more clusters (scale out).",
            "B": "Enable Query Acceleration Service.",
            "C": "Increase the warehouse size (scale up).",
            "D": "Add a clustering key.",
        },
        "answer": ["C"],
        "explanation": "Single query + remote spilling + no queuing = need more memory = scale UP. Multi-cluster does not help a single query. QAS could help but the root cause is insufficient memory. Clustering helps pruning, not spilling.",
    },
    {
        "id": 32, "domain": "D4: Performance", "multi": False,
        "text": "How does query pruning optimize performance in Snowflake?",
        "options": {
            "A": "By terminating queries after a timeout.",
            "B": "By pulling results from the result cache.",
            "C": "By removing unnecessary query clauses.",
            "D": "By preventing unnecessary scanning of micro-partitions.",
        },
        "answer": ["D"],
        "explanation": "Pruning uses micro-partition metadata (min/max) to skip partitions that cannot contain matching rows. It reduces data scanned, not query structure.",
    },
    {
        "id": 33, "domain": "D4: Performance", "multi": False,
        "text": "A user runs SELECT col1:city::VARCHAR FROM my_table where col1 is VARIANT containing {\"city\":\"Denver\"}. What is returned?",
        "options": {
            "A": "\"Denver\" (with quotes)",
            "B": "Denver (without quotes)",
            "C": "NULL",
            "D": "An error",
        },
        "answer": ["B"],
        "explanation": "Casting with ::VARCHAR strips the JSON quotes. Without the cast, you would get \"Denver\" with quotes. The cast returns the clean string.",
    },
    {
        "id": 34, "domain": "D4: Performance", "multi": False,
        "text": "Which SQL clause filters on window function results without requiring a subquery?",
        "options": {
            "A": "HAVING",
            "B": "WHERE",
            "C": "QUALIFY",
            "D": "FILTER",
        },
        "answer": ["C"],
        "explanation": "QUALIFY filters after window functions. Example: QUALIFY ROW_NUMBER() OVER (...) = 1. HAVING filters after GROUP BY aggregates.",
    },
    {
        "id": 35, "domain": "D4: Performance", "multi": False,
        "text": "A multi-cluster warehouse has 2 active clusters, each X-Large (16 credits/hr), running for 30 minutes. Total credits consumed?",
        "options": {
            "A": "8 credits",
            "B": "16 credits",
            "C": "32 credits",
            "D": "64 credits",
        },
        "answer": ["B"],
        "explanation": "2 clusters x 16 credits/hr x 0.5 hours = 16 credits. Multi-cluster multiplies credits by active cluster count.",
    },
    # ======================================================================
    # D5: DATA COLLABORATION & SHARING (5 questions)
    # ======================================================================
    {
        "id": 36, "domain": "D5: Sharing", "multi": False,
        "text": "How does Snowflake's data sharing work with Reader Accounts?",
        "options": {
            "A": "The reader must have their own Snowflake subscription.",
            "B": "The provider provisions and pays for a reader account so non-Snowflake users can access shared data.",
            "C": "Reader accounts can only view metadata, not data.",
            "D": "Reader accounts are limited to 1 TB of shared data.",
        },
        "answer": ["B"],
        "explanation": "Reader Accounts are created by the provider for consumers without Snowflake. Provider pays for all compute. Despite the name, readers CAN create warehouses, tables, etc.",
    },
    {
        "id": 37, "domain": "D5: Sharing", "multi": True,
        "text": "Which TWO objects can be shared via Snowflake Secure Data Sharing? (Select TWO).",
        "options": {
            "A": "Secure views",
            "B": "Secure UDFs",
            "C": "Standard (non-secure) views",
            "D": "Stored procedures",
            "E": "Warehouses",
        },
        "answer": ["A", "B"],
        "explanation": "Secure views AND secure UDFs can be shared. Standard views are rejected. Stored procedures and warehouses cannot be shared.",
    },
    {
        "id": 38, "domain": "D5: Sharing", "multi": False,
        "text": "A Direct Share can share data with consumers in which scope?",
        "options": {
            "A": "Any Snowflake account in any region.",
            "B": "Only accounts within the same region.",
            "C": "Only accounts within the same cloud provider.",
            "D": "Only accounts within the same organization.",
        },
        "answer": ["B"],
        "explanation": "Direct Shares are same-region only. For cross-region sharing, use Listings with Cross-Cloud Auto-Fulfillment.",
    },
    {
        "id": 39, "domain": "D5: Sharing", "multi": False,
        "text": "When working with high-churn dimension tables, what is the recommended approach to manage costs?",
        "options": {
            "A": "Set Time Travel to 90 days for maximum protection.",
            "B": "Make tables transient and back up daily using cloning to a permanent table.",
            "C": "Increase warehouse size to handle the churn.",
            "D": "Disable Time Travel entirely and rely on Fail-safe.",
        },
        "answer": ["B"],
        "explanation": "Transient tables eliminate Fail-safe costs. Daily cloning provides backup. Clone is zero-copy so backup cost is minimal. This balances cost savings with protection. From real exam.",
    },
    {
        "id": 40, "domain": "D5: Sharing", "multi": False,
        "text": "A provider adds a new column to a table that is already included in a share. What must the consumer do?",
        "options": {
            "A": "Recreate the shared database.",
            "B": "Run ALTER DATABASE REFRESH.",
            "C": "Nothing. The new column is visible automatically.",
            "D": "Request the provider to re-grant access.",
        },
        "answer": ["C"],
        "explanation": "Schema changes (new columns, new tables added to share) are automatically visible to consumers. No action needed.",
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
    st.set_page_config(page_title="S1-E02", page_icon="3", layout="wide")
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
    st.title("COF-C03 S1-E02")
    st.markdown("**40 Questions | Calibrated | New Topics + Reinforcement**")
    st.markdown("---")
    col1, col2 = st.columns(2)
    with col1:
        st.markdown("**Domain Distribution**")
        for d in DOMAINS:
            count = sum(1 for q in QUESTIONS if q["domain"] == d)
            st.markdown(f"- {d} ({count}q)")
    with col2:
        st.markdown("**Adjustments from S1-E01 (38/40)**")
        st.markdown(
            "- NEW: multi-cluster credit math scenario\n"
            "- NEW: file format precedence (COPY > stage)\n"
            "- NEW: SKIP_FILE_3 threshold behavior\n"
            "- NEW: GEOMETRY blocks QAS\n"
            "- NEW: directory tables, INFER_SCHEMA\n"
            "- NEW: Snowpipe Streaming vs standard\n"
            "- REINFORCE: edition costs (storage + compute)\n"
            "- REINFORCE: combined spilling+queuing (vs single)\n"
            "- REINFORCE: masking through views"
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
    st.title("S1-E02 Results")
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
