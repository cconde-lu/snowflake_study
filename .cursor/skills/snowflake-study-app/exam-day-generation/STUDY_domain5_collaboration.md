# Domain 5: Data Collaboration
## Weight: 10-15% (~10-15 questions)

---

## 5.1 Data Collaboration & Protection

### Cloning
- Zero-copy: no additional storage until data diverges
- Clones inherit source retention at clone time
- Captures transactional snapshot (concurrent DML does not affect it)

**Cloneable objects:**
| Object | Cloneable? | Notes |
|--------|-----------|-------|
| Databases | YES | Full hierarchy (schemas, tables, views, etc.) |
| Schemas | YES | All objects within |
| Tables (permanent, transient, temporary) | YES | Transient clone requires TRANSIENT keyword |
| External stages | YES | Metadata/URL pointer only |
| Internal stages | NO | "Unsupported feature" error |
| External tables | NO | Excluded from DB clones too |
| Dynamic tables | NO | |
| Pipes, shares, warehouses | NO | |

### Traps
- "CREATE TABLE ... CLONE transient_table" = FAILS (must say CREATE TRANSIENT TABLE ... CLONE)
- "External tables are included in database clones" = FALSE (excluded entirely)
- "Clone consumes storage immediately" = FALSE (zero-copy until divergence)
- "Concurrent INSERT during clone affects the clone" = FALSE (snapshot at statement start)

### Time Travel
- Access historical data via AT(OFFSET => -n) or BEFORE(STATEMENT => 'qid')
- Works for DML (INSERT, UPDATE, DELETE, MERGE) and DROP
- Retention inherited from nearest parent with explicit setting (schema > database)
- Standard Edition: 0-1 day. Enterprise+: 0-90 days for permanent tables.
- Transient/Temporary: 0-1 day on ALL editions.
- MAX_DATA_EXTENSION_TIME_IN_DAYS (default 14): extends retention to keep streams from going stale

### Traps
- "Time Travel only works for dropped tables" = FALSE (works for DML too)
- "Standard Edition supports 90-day Time Travel" = FALSE (1 day max)
- "Setting 5-day retention on Standard Edition" = ERROR (max 1 day)
- "AT(OFFSET => -300)" = 300 SECONDS ago (not rows, not minutes)

### Fail-safe
- 7 days for permanent tables. 0 days for transient/temporary.
- ONLY Snowflake Support can attempt recovery (NOT user-accessible)
- Total protection = Time Travel + Fail-safe (e.g., 10 + 7 = 17 days)

### Traps
- "Fail-safe is user-accessible via UNDROP" = FALSE (Fail-safe is Support-only; UNDROP is Time Travel)
- "Transient tables have 1-day Fail-safe" = FALSE (0 days, always)
- "ACCOUNTADMIN can recover from Fail-safe" = FALSE (only Snowflake Support)

### UNDROP
- Works within Time Travel retention period
- UNDROP TABLE, UNDROP SCHEMA, UNDROP DATABASE
- Does NOT work for: stages, pipes, warehouses, views

### Data Replication & Failover
- **Replication group**: collection of objects replicated to target accounts (read-only on secondary)
- **Failover group**: extends replication with read-write failover to secondary
- Can replicate: databases, shares, roles, users, warehouses, resource monitors, network policies
- Works cross-region AND cross-cloud

### Traps
- "Replication group supports failover" = FALSE (that is failover group)
- "Replication only works within the same cloud provider" = FALSE (cross-cloud supported)
- "Replicated databases are writable on the secondary" = FALSE (read-only until failover)

---

## 5.2 Data Sharing Capabilities

### Roles in Sharing
| Role | What they do |
|------|-------------|
| Provider | Creates share, adds objects, grants to consumers |
| Consumer | Creates database from share, queries shared data (read-only) |
| Reader Account | Consumer without own Snowflake account. Provider creates and pays for it. |

### Direct Shares
- Same region ONLY
- Zero-copy (no additional storage)
- Consumer access is READ-ONLY (no INSERT/UPDATE/DELETE/MERGE/CLONE)
- Only SECURE views and SECURE UDFs can be added (standard views rejected)

### What happens with shares
| Event | Effect on consumer |
|-------|-------------------|
| Provider adds table/column to share | Automatically visible (no action needed) |
| Provider drops a shared table | Immediately inaccessible |
| Provider revokes the share | Consumer DB becomes empty (shell remains) |
| Consumer tries to clone shared table | FAILS (no OWNERSHIP) |
| Consumer tries to INSERT into shared table | FAILS (read-only) |

### Resharing
- Consumer can share received data onward to another account
- Original provider must enable resharing
- No additional copies created

### Data Clean Rooms
- Secure environment for multi-party collaboration
- Parties run approved queries on combined data WITHOUT seeing each other's raw data
- Enforced through secure views and policies

### Reader Accounts (THE BIG TRAP)
| Can do | Cannot do |
|--------|-----------|
| Create warehouses | CREATE SHARE |
| Create databases, schemas, tables | CREATE PIPE |
| Run queries (SELECT, JOIN with own tables) | CREATE STAGE |
| Create views | SHOW PROCEDURES |
| Create users/roles within account | Access Marketplace |

- Provider pays for ALL Reader Account compute and storage
- Name is misleading: "Reader" sounds read-only but they CAN create objects

### Traps
- "Reader Accounts cannot create warehouses" = FALSE (they can, provider pays)
- "Reader Accounts cannot create any objects" = FALSE (can create DBs, tables, etc.)
- "Direct shares work cross-region" = FALSE (same region only; use Listings for cross-region)
- "Standard views can be shared" = FALSE (only SECURE views)
- "Consumer must refresh to see new objects in share" = FALSE (automatic)
- "Revoking share = consumer DB is dropped" = FALSE (DB shell remains, objects inaccessible)
- "Consumer can clone shared data" = FALSE (no OWNERSHIP on shared objects)

---

## 5.3 Snowflake Marketplace & Listings

### Marketplace
- Public hub for discovering and consuming data, Native Apps, and services
- Available to all Snowflake customers

### Listing Types
| Type | Scope | Monetization |
|------|-------|-------------|
| Private listing | Specific invited accounts | Optional |
| Public listing | All Snowflake customers | Optional |

### Listings vs Direct Shares
| Feature | Direct Share | Listing |
|---------|-------------|---------|
| Cross-region | NO | YES (via Cross-Cloud Auto-Fulfillment) |
| Monetization | NO | YES (providers can charge) |
| Discovery | Must know provider account | Searchable in Marketplace |
| Multiple consumers | Must grant each individually | Discoverable by anyone (public) or invited (private) |

### Native Apps
- Packaged applications (code + data + Streamlit UI)
- Distributed via Marketplace
- Consumer installs in their own account
- Runs with consumer's compute

### Traps
- "Direct shares support cross-region sharing" = FALSE (use Listings)
- "Direct shares support monetization" = FALSE (use Listings)
- "Listings are only public" = FALSE (private listings exist for specific accounts)
- "Native Apps run on the provider's compute" = FALSE (consumer's compute)

---

## DOMAIN 5 CHEAT SHEET: Numbers to Memorize

| Concept | Value |
|---------|-------|
| Fail-safe (permanent) | 7 days |
| Fail-safe (transient/temporary) | 0 days |
| Time Travel max (Standard) | 1 day |
| Time Travel max (Enterprise+, permanent) | 90 days |
| Time Travel max (transient/temporary, all editions) | 1 day |
| MAX_DATA_EXTENSION_TIME default | 14 days |
| COPY metadata retention | 64 days |
| Snowpipe metadata retention | 14 days |
| Direct Share scope | Same region only |
| Listing scope | Cross-region (Auto-Fulfillment) |
| Reader Account compute billing | Provider pays |
| Replicated DB access | Read-only (until failover) |
