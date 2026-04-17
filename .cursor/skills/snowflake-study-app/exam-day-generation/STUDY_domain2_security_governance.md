# Domain 2: Account Management & Data Governance
## Weight: 20-25% (~20-25 questions) | SECOND HEAVIEST

---

## 2.1 Security Model & Principles

### RBAC + DAC Combined
- **RBAC**: Privileges granted to roles, roles granted to users
- **DAC**: Each object has an owner. Owner decides who gets access.
- Both work together. Owner (DAC) grants privileges to roles (RBAC).

### System Role Hierarchy (memorize this diagram)
```
ACCOUNTADMIN -----> Billing, resource monitors, account settings
  |-- SECURITYADMIN --> Manage grants on objects (GRANT SELECT, etc.)
  |     |-- USERADMIN --> Create/manage users and roles
  |-- SYSADMIN -------> Create databases, warehouses, schemas
PUBLIC (all roles inherit this)
```

### Role Quick Reference
| Role | Creates | Manages | Cannot |
|------|---------|---------|--------|
| USERADMIN | Users, roles | Grant roles to users | Grant object privileges, create DBs |
| SECURITYADMIN | Everything USERADMIN + | Object-level grants (SELECT, etc.) | Create DBs/warehouses, view billing |
| SYSADMIN | Databases, warehouses, schemas | Database objects | Manage users, view billing |
| ACCOUNTADMIN | Resource monitors | Billing, account params | N/A (can do everything) |
| ORGADMIN | Accounts (org level) | Org usage, replication | Account-level admin within accounts |

### Functional Roles
- **Account roles**: Exist at account level, can hold privileges on any object
- **Database roles**: Scoped to ONE database. Cannot hold privileges on other databases.
- **Custom roles**: Should always be granted to SYSADMIN (best practice). Orphan roles make objects invisible to admins.

### Secondary Roles
- USE SECONDARY ROLES ALL: activates all granted roles alongside primary
- Without this, ONLY primary role privileges apply
- CURRENT_ROLE() = primary only. IS_ROLE_IN_SESSION() = full graph.

### Traps
- "USERADMIN can grant SELECT on tables" = FALSE (that is SECURITYADMIN)
- "SECURITYADMIN creates databases" = FALSE (that is SYSADMIN)
- "ORGADMIN has ACCOUNTADMIN access within accounts" = FALSE (org-level only)
- "Custom role not granted to SYSADMIN -- ACCOUNTADMIN can still see its objects" = FALSE
- "Database roles work across databases" = FALSE (single database scope)

### Account Identifiers
- **Organization-level**: org_name.account_name (preferred, portable)
- **Account locator**: 8-char alphanumeric (e.g., xy12345, legacy format)
- URLs: org-account.snowflakecomputing.com

### Authentication Methods
| Method | Use Case | Key Fact |
|--------|----------|----------|
| Username/password | Interactive login | Basic, not for programmatic |
| MFA (Duo) | Interactive + extra security | Powered by Duo Security |
| SSO (SAML 2.0) | Browser-based federated | IdP: Okta, Azure AD, etc. |
| Key-pair (RSA) | Programmatic: connectors, Kafka | PUBLIC key to Snowflake, private stays local |
| OAuth | Programmatic: custom apps, SQL API | Token-based |
| SCIM | User/group provisioning | Automates lifecycle from IdP |

### Traps
- "SQL API supports username/password" = FALSE (OAuth or JWT only)
- "Kafka connector uses OAuth" = FALSE (key-pair authentication)
- "RSA_PRIVATE_KEY is set on the Snowflake user" = FALSE (RSA_PUBLIC_KEY is set, private stays local)
- "SCIM provisions databases" = FALSE (it provisions users and maps groups to roles)

### Network Policies
- ALLOWED_IP_LIST + BLOCKED_IP_LIST
- **BLOCKED takes precedence** over ALLOWED (same IP in both = blocked)
- **User-level OVERRIDES account-level** (not additive, not merged)
- REQUIRE_STORAGE_INTEGRATION_FOR_STAGE_CREATION: forces storage integrations (no inline creds)

### Logging & Tracing
- Stored procedures and UDFs can emit custom log messages (INFO, WARN, ERROR)
- Trace spans for performance analysis
- Stored in an event table

---

## 2.2 Data Governance Features

### Masking Policies (Dynamic Data Masking)
- Conditionally mask column values based on querying role
- **NO ROLE BYPASSES** masking policies (not even ACCOUNTADMIN)
- CURRENT_ROLE() = primary role ONLY
- IS_ROLE_IN_SESSION() = primary + secondary + inherited (preferred in policies)
- Tag-based masking: attach policy to a tag, all tagged columns inherit automatically

### Row Access Policies
- Filter rows based on querying role
- **NO ROLE BYPASSES** row access policies
- CASE with no ELSE = NULL = FALSE = 0 rows for unmentioned roles
- Can be applied to tables AND views

### Privacy Policies
- **Projection policies**: control which roles can SELECT a column
- **Aggregation policies**: require aggregation before returning data

### Object Tagging
- Tags are metadata labels only (no enforcement by themselves)
- Must attach masking policy to tag for enforcement
- Tags can be used for data classification, cost attribution, governance

### Data Classification
- SYSTEM$CLASSIFY(table): analyzes content, assigns semantic + privacy tags
- Semantic categories: NAME, EMAIL, PHONE, etc.
- Privacy categories: IDENTIFIER, QUASI_IDENTIFIER, SENSITIVE
- Supports primitive types (NUMBER, STRING, DATE, TIMESTAMP). NOT VARIANT/BINARY.

### Trust Center
- Security scanners (CIS benchmarks, threat intelligence)
- Evaluates account security posture
- Provides findings with severity and remediation recommendations

### Alerts
- Evaluate a SQL condition on a schedule
- When condition returns rows, trigger an action (notification)

### Notifications
- Delivered via email or webhooks (Slack, PagerDuty, etc.)
- Uses notification integrations

### Data Lineage
- ACCESS_HISTORY: which objects/columns were read/written by queries
- OBJECT_DEPENDENCIES: view-to-table and other object references
- Together enable upstream/downstream lineage analysis

### Encryption Key Management
- All editions: AES-256 at rest, TLS 1.2 in transit
- Business Critical+: Tri-Secret Secure (customer-managed keys via cloud KMS)
- Key rotation is automatic (annual) with option for customer-triggered rotation

### Traps
- "Tags enforce masking automatically" = FALSE (must attach policy to tag)
- "ACCOUNTADMIN bypasses masking" = FALSE
- "Row access policy missing ELSE -- unmentioned roles see all rows" = FALSE (0 rows)
- "SYSTEM$CLASSIFY works on VARIANT columns" = FALSE (primitive types only)
- "Projection policy controls INSERT" = FALSE (controls SELECT/projection visibility)

---

## 2.3 Monitoring & Cost Management

### Resource Monitors
- **Only ACCOUNTADMIN can CREATE** (non-delegable)
- MONITOR privilege = view usage. MODIFY privilege = change properties.
- Only track **user-managed warehouse** credits (NOT serverless)
- Serverless (Snowpipe, auto-clustering, MVs, SOS) requires **budgets**
- TRIGGERS clause in ALTER **replaces** all existing triggers (not additive)
- Account + warehouse monitors are independent (either can trigger)

### Credit Calculation
- Credits = warehouse_size_credits_per_hour * runtime_in_hours
- Per-second billing with 60-second minimum per resume
- Multi-cluster: credits multiply by number of active clusters

### ACCOUNT_USAGE Schema
- Located in SNOWFLAKE database
- 45-min to 3-hour latency
- Up to 365 days retention
- Key views: QUERY_HISTORY, ACCESS_HISTORY, LOGIN_HISTORY, WAREHOUSE_METERING_HISTORY, TABLE_STORAGE_METRICS, GRANTS_TO_ROLES, GRANTS_TO_USERS

### vs INFORMATION_SCHEMA
| Property | ACCOUNT_USAGE | INFORMATION_SCHEMA |
|----------|--------------|-------------------|
| Latency | 45 min - 3 hours | Near real-time |
| Retention | 365 days | 7-14 days |
| Scope | Entire account | Current database only |
| Location | SNOWFLAKE database | Each database |

### Traps
- "Resource monitors track Snowpipe credits" = FALSE (use budgets)
- "ALTER RESOURCE MONITOR without TRIGGERS keeps old triggers" = TRUE (but WITH TRIGGERS replaces all)
- "ACCOUNT_USAGE is real-time" = FALSE (45 min - 3 hour latency)
- "INFORMATION_SCHEMA retains 365 days" = FALSE (7-14 days)
