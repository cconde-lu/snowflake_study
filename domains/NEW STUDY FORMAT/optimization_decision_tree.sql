-- ============================================================================
-- COF-C03 OPTIMIZATION DECISION TREE: 10 Scenarios
-- ============================================================================
-- Run each scenario's SELECT to see the problem description.
-- Think about which tool you'd choose BEFORE scrolling to the answer.
-- Then run the answer query to check yourself.
--
-- Tools to choose from:
--   1. CLUSTERING KEY
--   2. SEARCH OPTIMIZATION SERVICE (SOS)
--   3. QUERY ACCELERATION SERVICE (QAS)
--   4. MATERIALIZED VIEW (MV)
--   5. SCALE UP (larger warehouse)
--   6. SCALE OUT (multi-cluster warehouse)
--   7. DYNAMIC TABLE
-- ============================================================================


-- ============================================================================
-- SCENARIO 1
-- ============================================================================
SELECT '
SCENARIO 1: E-Commerce Orders Table
------------------------------------
Table: ORDERS (50 billion rows)
Query pattern: WHERE order_date BETWEEN ''2026-01-01'' AND ''2026-01-31''
Frequency: Hundreds of times per day by BI dashboards
Column cardinality: order_date has 3,650 distinct values (10 years of dates)
Current state: No clustering key. Query profile shows 95% of partitions scanned.

Which optimization tool should you use?
' AS scenario_1;

-- YOUR ANSWER: _______________

-- Run this to check:
SELECT '
ANSWER: CLUSTERING KEY on (order_date)
WHY: 
  - Range filter (BETWEEN) on a date column = classic clustering use case
  - Low-to-medium cardinality (3,650 values) = ideal for clustering
  - 95% partitions scanned = terrible pruning, clustering will fix this
  - NOT SOS: SOS is for equality lookups (WHERE id = X), not range scans
  - NOT QAS: QAS helps outlier queries, but this is a repeated BI pattern
  - NOT MV: Could work but clustering is simpler and helps ALL queries on this column
' AS answer_1;


-- ============================================================================
-- SCENARIO 2
-- ============================================================================
SELECT '
SCENARIO 2: Customer Lookup Service
------------------------------------
Table: CUSTOMERS (500 million rows)
Query pattern: WHERE customer_id = ''C-9283847''
Frequency: Thousands of point lookups per minute from an API
Column cardinality: customer_id has 500 million distinct values (unique per row)
Current state: Has clustering key on region. Query profile shows full scan on customer_id lookups.

Which optimization tool should you use?
' AS scenario_2;

SELECT '
ANSWER: SEARCH OPTIMIZATION SERVICE on EQUALITY(customer_id)
WHY:
  - Equality lookup (= single value) on VERY HIGH cardinality (unique per row)
  - SOS creates search access paths specifically for this pattern
  - NOT clustering: Clustering on a unique column is expensive and inefficient
  - NOT QAS: QAS offloads scan portions, but SOS avoids the scan entirely
  - NOT MV: Cannot create an MV for every possible customer_id value
  - The existing clustering on region is fine, keep it. ADD SOS for customer_id.
' AS answer_2;


-- ============================================================================
-- SCENARIO 3
-- ============================================================================
SELECT '
SCENARIO 3: Ad-Hoc Analyst Queries
------------------------------------
Table: TRANSACTIONS (10 TB, well-clustered on transaction_date)
Query pattern: Unpredictable. Analysts run diverse queries, some scan 80% of the table.
Frequency: Sporadic, but when they run, they are 10-100x larger than typical queries.
Current state: Most queries finish in seconds. A few analyst queries take 30+ minutes.

Which optimization tool should you use?
' AS scenario_3;

SELECT '
ANSWER: QUERY ACCELERATION SERVICE (QAS)
WHY:
  - Outlier queries that use much more resources than typical = QAS sweet spot
  - QAS offloads large scan portions to serverless compute
  - Table is already well-clustered (so clustering wont help more)
  - NOT SOS: Queries are not point lookups, they are large scans
  - NOT MV: Queries are unpredictable, cannot pre-compute every possible pattern
  - NOT scale up: Would waste credits for the 95% of queries that are already fast
  - QAS only activates for eligible queries, so you only pay when outliers run
' AS answer_3;


-- ============================================================================
-- SCENARIO 4
-- ============================================================================
SELECT '
SCENARIO 4: Executive Dashboard
------------------------------------
Tables: SALES (1B rows), PRODUCTS (10K rows), REGIONS (50 rows)
Query pattern: SELECT region, SUM(revenue) FROM sales JOIN products JOIN regions GROUP BY region
Frequency: Every 5 minutes by an auto-refreshing dashboard
Current state: Query takes 45 seconds each time. Same result every time until new data arrives.

Which optimization tool should you use?
' AS scenario_4;

SELECT '
ANSWER: DYNAMIC TABLE (not materialized view)
WHY:
  - Complex aggregation with JOINs across 3 tables = MV CANNOT do this (single table only)
  - Dynamic table supports JOINs and complex transformations
  - Set TARGET_LAG to match your refresh needs (e.g., 5 minutes)
  - Snowflake auto-maintains it, so the dashboard reads pre-computed results
  - NOT MV: MVs do NOT support JOINs (single table only)
  - NOT clustering: The query is already well-structured, the problem is compute time
  - NOT QAS: The query runs every 5 min (not an outlier), and results are always the same
' AS answer_4;


-- ============================================================================
-- SCENARIO 5
-- ============================================================================
SELECT '
SCENARIO 5: Monthly Revenue Summary
------------------------------------
Table: INVOICES (2B rows)
Query pattern: SELECT MONTH(invoice_date), SUM(amount) FROM invoices GROUP BY 1
Frequency: Run by 5 different reports, identical query each time
Current state: Takes 2 minutes. Always produces the same result until month-end close.

Which optimization tool should you use?
' AS scenario_5;

SELECT '
ANSWER: MATERIALIZED VIEW
WHY:
  - Single table, aggregation query, run repeatedly with identical results
  - This is the textbook MV use case: pre-compute once, read many times
  - MV auto-refreshes when base data changes (serverless)
  - NOT dynamic table: MV is simpler and cheaper for single-table aggregations
  - NOT QAS: Would help speed but MV eliminates the compute entirely
  - NOT clustering: Would help pruning but the query scans all months anyway
  - MV turns a 2-minute query into a sub-second read
' AS answer_5;


-- ============================================================================
-- SCENARIO 6
-- ============================================================================
SELECT '
SCENARIO 6: 200 BI Users at 9 AM
------------------------------------
Warehouse: Medium, single-cluster
Situation: Every morning at 9 AM, 200 analysts open their dashboards simultaneously.
Query profile: Individual queries are fast (2-3 seconds) but queuing reaches 60+ seconds.
Current state: AUTO_SUSPEND = 300, AUTO_RESUME = TRUE, single cluster.

Which optimization tool should you use?
' AS scenario_6;

SELECT '
ANSWER: SCALE OUT (multi-cluster warehouse with auto-scaling)
WHY:
  - Problem is CONCURRENCY (200 users), not query complexity
  - Individual queries are fast (2-3s) = warehouse SIZE is fine
  - Queuing = not enough threads to handle concurrent queries
  - Set MAX_CLUSTER_COUNT = 3-5 with SCALING_POLICY = STANDARD
  - STANDARD adds clusters immediately on queuing (not ECONOMY which waits 6 min)
  - NOT scale up: Bigger warehouse helps single query speed, not concurrency
  - NOT QAS: QAS helps individual outlier queries, not queuing from concurrency
  - NOT clustering/SOS/MV: These optimize individual queries, not concurrency
' AS answer_6;


-- ============================================================================
-- SCENARIO 7
-- ============================================================================
SELECT '
SCENARIO 7: Complex ETL Transformation
------------------------------------
Warehouse: Small
Query: A single complex query with 12 JOINs, 5 subqueries, window functions.
Duration: 45 minutes on a Small warehouse.
Query profile: Spilling to REMOTE storage. No queuing (only 1 user runs this).

Which optimization tool should you use?
' AS scenario_7;

SELECT '
ANSWER: SCALE UP (increase warehouse size)
WHY:
  - Single complex query, no concurrency issue
  - Spilling to REMOTE storage = severe, needs more memory and SSD
  - Scale up from Small to Large or X-Large provides 4-8x more resources
  - NOT scale out: Only 1 user, no queuing, multi-cluster wont help
  - NOT QAS: QAS could help but the root cause is insufficient memory (spilling)
  - NOT clustering: Spilling is a compute resource issue, not a pruning issue
  - After scaling up, if spilling stops, the query may finish in 5-10 minutes
' AS answer_7;


-- ============================================================================
-- SCENARIO 8
-- ============================================================================
SELECT '
SCENARIO 8: Multi-Column Filter
------------------------------------
Table: EVENTS (20B rows)
Query pattern: WHERE region = ''US'' AND event_date BETWEEN ''2026-01-01'' AND ''2026-03-31''
Column cardinality: region has 8 values, event_date has 3,650 values
Current state: No clustering. Query scans 90% of partitions.

Which optimization tool AND which column order?
' AS scenario_8;

SELECT '
ANSWER: CLUSTERING KEY on (region, event_date) -- lower cardinality FIRST
WHY:
  - Multi-column filter with range scan = clustering key
  - region (8 values) has LOWER cardinality = put it FIRST
  - event_date (3,650 values) has HIGHER cardinality = put it SECOND
  - Snowflake recommends lower cardinality first in multi-column keys
  - NOT (event_date, region): Would be less effective for region-only filters
  - NOT SOS: SOS is for equality, not BETWEEN range scans
  - NOT QAS: This is a repeated pattern, not an outlier query
' AS answer_8;


-- ============================================================================
-- SCENARIO 9
-- ============================================================================
SELECT '
SCENARIO 9: Text Search in Product Descriptions
------------------------------------
Table: PRODUCTS (10M rows, VARIANT column with JSON including description field)
Query pattern: WHERE data:description::VARCHAR LIKE ''%wireless%''
Frequency: Customer-facing search API, hundreds of requests per second
Current state: Full table scan every time. Very slow.

Which optimization tool should you use?
' AS scenario_9;

SELECT '
ANSWER: SEARCH OPTIMIZATION SERVICE on SUBSTRING(data:description)
WHY:
  - SOS supports substring/LIKE predicates on VARIANT paths (not just equality)
  - High-frequency API calls need low-latency point lookups
  - NOT clustering: LIKE with leading wildcard (%) cannot be pruned by clustering
  - NOT QAS: QAS helps outlier queries, not high-frequency API patterns
  - NOT MV: Cannot pre-compute every possible search term
  - SOS builds access paths that handle LIKE/substring efficiently
  - For full-text/semantic search, consider Cortex Search instead
' AS answer_9;


-- ============================================================================
-- SCENARIO 10
-- ============================================================================
SELECT '
SCENARIO 10: The Trick Question
------------------------------------
Table: DAILY_METRICS (1M rows, tiny table)
Query: SELECT AVG(metric_value) FROM daily_metrics WHERE date = CURRENT_DATE()
Duration: 150ms
User complaint: "Can we make this faster?"

Which optimization tool should you use?
' AS scenario_10;

SELECT '
ANSWER: NONE. The query is already fast enough.
WHY:
  - 150ms for a 1M row table is excellent performance
  - The table is small enough that Snowflake handles it efficiently without optimization
  - Adding clustering, SOS, QAS, or MVs would add maintenance overhead and cost
  - Optimization tools have COSTS: clustering uses serverless credits, SOS uses storage,
    QAS uses serverless credits, MVs use serverless refresh credits
  - EXAM TRAP: Not every slow-sounding query needs optimization
  - The real exam includes scenarios where the best answer is "do nothing"
  - Rule of thumb: If the query runs in under 1 second on a small table, leave it alone
' AS answer_10;


-- ============================================================================
-- DECISION TREE CHEAT SHEET
-- ============================================================================
SELECT '
QUICK DECISION TREE:
====================

Is the query SLOW because of...

1. Too many partitions scanned (poor pruning)?
   +-- Filter on low/medium cardinality column (dates, regions, status)?
   |   --> CLUSTERING KEY (put lower cardinality first)
   +-- Equality lookup on high cardinality (unique IDs)?
       --> SEARCH OPTIMIZATION SERVICE

2. Query is an outlier (10-100x more resources than typical)?
   --> QUERY ACCELERATION SERVICE

3. Same complex query runs repeatedly with same results?
   +-- Single table, aggregation?
   |   --> MATERIALIZED VIEW
   +-- Multiple tables, JOINs, complex logic?
       --> DYNAMIC TABLE

4. Too many users queuing?
   --> SCALE OUT (multi-cluster, STANDARD scaling)

5. Single query spilling to remote storage?
   --> SCALE UP (bigger warehouse)

6. Query is already fast (< 1 second)?
   --> DO NOTHING
' AS decision_tree;
