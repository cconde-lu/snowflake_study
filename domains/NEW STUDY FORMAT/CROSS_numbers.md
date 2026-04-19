# NUMBERS YOU MUST MEMORIZE
## Every numeric value that appears on the real exam

---

## WAREHOUSE CREDITS PER HOUR
| XS | S | M | L | XL | 2XL | 3XL | 4XL |
|----|---|---|---|----|-----|-----|-----|
| 1  | 2 | 4 | 8 | 16 | 32  | 64  | 128 |

Each size DOUBLES. Billing: per-second, 60-second minimum per resume.

## RETENTION PERIODS
| What | Duration |
|------|----------|
| Bulk COPY metadata | **64 days** |
| Snowpipe metadata | **14 days** |
| Result cache | **24 hours** |
| Time Travel - Standard Edition (permanent) | 0-1 day |
| Time Travel - Enterprise+ (permanent) | 0-90 days |
| Time Travel - Transient (ALL editions) | 0-1 day |
| Time Travel - Temporary (ALL editions) | 0-1 day |
| Fail-safe - Permanent | **7 days** |
| Fail-safe - Transient | **0 days** |
| Fail-safe - Temporary | **0 days** |
| ACCOUNT_USAGE latency | 45 min - 3 hours |
| ACCOUNT_USAGE retention | **365 days** |
| INFORMATION_SCHEMA retention | 7-14 days |
| MAX_DATA_EXTENSION_TIME default | **14 days** |

## FORMULAS
| Formula | Example |
|---------|---------|
| Total data protection | Time Travel + Fail-safe (e.g., 10 + 7 = 17 days) |
| Stream staleness | GREATER of (retention, MAX_DATA_EXTENSION) |
| Credits consumed | size_credits/hr x hours x active_clusters |
| Billing per resume | MAX(actual_seconds, 60) |

## EDITION GATES
| Feature | Minimum Edition |
|---------|----------------|
| Multi-cluster warehouses | Enterprise |
| Time Travel 2-90 days | Enterprise |
| Materialized views | Enterprise |
| Dynamic data masking | Enterprise |
| Column-level security | Enterprise |
| Search Optimization Service | Enterprise |
| Tri-Secret Secure (CMK) | Business Critical |
| PrivateLink | Business Critical |
| HIPAA/PHI compliance | Business Critical |
| Data sharing via Support only | VPS |

## QUICK TEST: Can you answer these in 5 seconds each?

1. Large warehouse credits per hour? **8**
2. COPY metadata retention? **64 days**
3. Snowpipe metadata retention? **14 days**
4. Result cache duration? **24 hours**
5. Fail-safe for permanent tables? **7 days**
6. Fail-safe for transient tables? **0 days**
7. Minimum edition for masking policies? **Enterprise**
8. Minimum edition for Tri-Secret Secure? **Business Critical**
9. ACCOUNT_USAGE latency? **45 min - 3 hours**
10. Total protection for 10-day TT permanent table? **17 days**
11. Billing for 45-second warehouse run? **60 seconds (minimum)**
12. Billing for 5m15s warehouse run? **315 seconds (exact)**
13. Default ON_ERROR for bulk COPY? **ABORT_STATEMENT**
14. Default ON_ERROR for Snowpipe? **SKIP_FILE**
15. MAX_DATA_EXTENSION default? **14 days**
