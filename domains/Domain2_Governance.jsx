import React, { useState, useCallback } from 'react';
import {
  Shield, Lock, Users, Eye, Tag, AlertTriangle, BarChart2,
  Construction, ChevronRight, RefreshCw, HelpCircle, CheckCircle, XCircle, FlaskConical,
} from 'lucide-react';

// ─── Shared UI helpers ────────────────────────────────────────────────────────
const ExamTip = ({ children }) => (
  <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-xl p-4">
    <p className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-1">⚡ Exam Tip</p>
    <div className="text-sm text-yellow-800 space-y-1">{children}</div>
  </div>
);

const SectionHeader = ({ icon: Icon, color, title, subtitle }) => (
  <div className="flex items-start gap-3 mb-4">
    <div className={`${color} p-2.5 rounded-xl flex-shrink-0`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
      {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

const InfoCard = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl border border-slate-100 shadow-sm p-5 ${className}`}>
    {children}
  </div>
);

const CodeBlock = ({ code }) => (
  <pre className="bg-slate-900 text-emerald-300 text-xs rounded-xl p-4 overflow-x-auto leading-relaxed font-mono mt-2">
    <code>{code}</code>
  </pre>
);

// ─── Tab registry — mirrors guide objectives 2.1 → 2.3 ──────────────────────
const TABS = [
  { id: 'security',    label: '🔐 2.1 Security Model' },
  { id: 'governance',  label: '🏷️ 2.2 Data Governance' },
  { id: 'monitoring',  label: '📊 2.3 Monitoring & Cost' },
  { id: 'quiz',        label: '🧪 Quiz', accent: true },
];

const ComingSoon = ({ tab }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <Construction className="w-12 h-12 text-violet-300 mb-4" />
    <h3 className="text-xl font-bold text-slate-700 mb-2">Coming Soon</h3>
    <p className="text-slate-400 text-sm max-w-xs">
      The <span className="font-semibold text-violet-600">{tab}</span> section is being built.
    </p>
  </div>
);

// ─── Domain 2 root ────────────────────────────────────────────────────────────
const Domain2_Governance = () => {
  const [activeTab, setActiveTab] = useState('security');
  return (
    <div className="space-y-4">
      {/* Tab nav */}
      <div className="flex overflow-x-auto border-b border-slate-200 pb-px">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-3 font-medium text-sm transition-colors whitespace-nowrap border-b-2 ${
              activeTab === tab.id
                ? tab.accent
                  ? 'border-violet-600 text-violet-700 bg-violet-50/60'
                  : 'border-violet-600 text-violet-700 bg-violet-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'security'   && <SecurityTab />}
      {activeTab === 'governance' && <GovernanceTab />}
      {activeTab === 'monitoring' && <MonitoringTab />}
      {activeTab === 'quiz'       && <QuizTab />}
      {!['security', 'governance', 'monitoring', 'quiz'].includes(activeTab) &&
        <ComingSoon tab={TABS.find(t => t.id === activeTab)?.label} />}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// LEARNING TAB 1 — 2.1 Security Model
// Covers: RBAC, DAC, UBAC, securable object hierarchy, network policies,
//         authentication, system-defined roles, functional/custom roles,
//         secondary roles, account identifiers, logging & tracing
// ═══════════════════════════════════════════════════════════════════════════════

const ROLE_HIERARCHY_DATA = [
  {
    id: 'globalorgadmin',
    name: 'GLOBALORGADMIN',
    level: 0,
    color: 'bg-indigo-800',
    border: 'border-indigo-400',
    textLight: 'text-indigo-100',
    scope: 'Organization Account',
    inherits: [],
    desc: 'Lives only in the organization account. Manages lifecycle of accounts, org users/groups, org-level usage and billing. Replaces ORGADMIN.',
    canDo: ['Create/drop accounts (MANAGE ACCOUNTS)', 'View org-level cost in currency', 'Manage org users & groups', 'Delegate LAF privileges'],
    bestPractice: 'Use GLOBALORGADMIN instead of ORGADMIN for all new organization-level tasks.',
  },
  {
    id: 'orgadmin',
    name: 'ORGADMIN',
    level: 0,
    color: 'bg-purple-700',
    border: 'border-purple-400',
    textLight: 'text-purple-100',
    scope: 'Regular Account',
    inherits: [],
    desc: 'Uses a regular account to manage operations at the org level. Being phased out — use GLOBALORGADMIN in the org account instead.',
    canDo: ['Create/view accounts (legacy)', 'View org-level usage from a regular account'],
    bestPractice: 'Migrate to GLOBALORGADMIN. ORGADMIN will be removed in a future release.',
  },
  {
    id: 'accountadmin',
    name: 'ACCOUNTADMIN',
    level: 1,
    color: 'bg-red-700',
    border: 'border-red-400',
    textLight: 'text-red-100',
    scope: 'Account',
    inherits: ['SECURITYADMIN', 'SYSADMIN'],
    desc: 'Top-level account role. Inherits SYSADMIN and SECURITYADMIN. Only role that can see billing and resource monitors.',
    canDo: ['View billing & credit usage', 'Manage resource monitors', 'Stop any query', 'All SYSADMIN + SECURITYADMIN actions'],
    bestPractice: 'Assign to ≥2 users. Never set as default role. Always require MFA. Do NOT use for daily work.',
  },
  {
    id: 'securityadmin',
    name: 'SECURITYADMIN',
    level: 2,
    color: 'bg-orange-600',
    border: 'border-orange-400',
    textLight: 'text-orange-100',
    scope: 'Account',
    inherits: ['USERADMIN'],
    desc: 'Has MANAGE GRANTS privilege — can grant/revoke any privilege on any object. Inherits USERADMIN.',
    canDo: ['Grant/revoke any privilege (MANAGE GRANTS)', 'Create/manage users and roles', 'Manage network policies'],
    bestPractice: 'Use for security audits and privilege management. Avoid daily use.',
  },
  {
    id: 'useradmin',
    name: 'USERADMIN',
    level: 3,
    color: 'bg-amber-600',
    border: 'border-amber-400',
    textLight: 'text-amber-100',
    scope: 'Account',
    inherits: [],
    desc: 'Dedicated to user and role management only. Has CREATE USER and CREATE ROLE privileges.',
    canDo: ['Create users', 'Create roles', 'Manage roles/users it owns'],
    bestPractice: 'Use for onboarding new users. Cannot modify objects.',
  },
  {
    id: 'sysadmin',
    name: 'SYSADMIN',
    level: 3,
    color: 'bg-blue-700',
    border: 'border-blue-400',
    textLight: 'text-blue-100',
    scope: 'Account',
    inherits: [],
    desc: 'Creates and manages warehouses, databases, and all database objects. Top-level for custom role hierarchies.',
    canDo: ['Create warehouses & databases', 'Grant privileges on owned objects', 'Manage all custom roles assigned to it'],
    bestPractice: 'Grant all custom roles to SYSADMIN so admins can manage every object.',
  },
  {
    id: 'public',
    name: 'PUBLIC',
    level: 4,
    color: 'bg-slate-500',
    border: 'border-slate-400',
    textLight: 'text-slate-100',
    scope: 'Account',
    inherits: [],
    desc: 'Pseudo-role auto-granted to every user and role. Objects owned by PUBLIC are accessible to all.',
    canDo: ['Access PUBLIC-owned objects', 'Automatic membership for all users'],
    bestPractice: 'Do not grant sensitive object privileges to PUBLIC.',
  },
];

const OBJ_HIERARCHY_LEVELS = [
  { label: 'Organization', emoji: '🌐', bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-800', examples: 'Accounts', desc: 'Top-level container. Managed by ORGADMIN.' },
  { label: 'Account', emoji: '🏢', bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-800', examples: 'Users · Roles · Warehouses · Resource Monitors', desc: 'Account-level objects. ACCOUNTADMIN scope.' },
  { label: 'Database', emoji: '🗄️', bg: 'bg-teal-100', border: 'border-teal-300', text: 'text-teal-800', examples: 'Databases', desc: 'Requires USAGE privilege to operate within.' },
  { label: 'Schema', emoji: '📂', bg: 'bg-violet-100', border: 'border-violet-300', text: 'text-violet-800', examples: 'Schemas', desc: 'Requires USAGE on both Database + Schema.' },
  { label: 'Object', emoji: '📋', bg: 'bg-emerald-100', border: 'border-emerald-300', text: 'text-emerald-800', examples: 'Tables · Views · Stages · Pipes · Functions · Sequences', desc: 'Lowest level. Requires specific privilege (SELECT, INSERT, etc.).' },
];

const AUTH_METHODS_DATA = [
  {
    id: 'mfa',
    name: 'MFA',
    full: 'Multi-Factor Authentication',
    icon: '🔒',
    color: 'bg-blue-50 border-blue-200',
    badge: 'bg-blue-100 text-blue-700',
    useCases: ['Snowsight (UI)'],
    desc: 'Adds a second verification step on top of username/password. Snowflake now requires MFA for all password-based users of Snowsight.',
    how: 'User enters password → second factor prompted (passkey, Duo push, TOTP app) → user approves → access granted.',
    exam: 'MFA is enforced via Authentication Policies. All ACCOUNTADMIN users must use MFA. Snowflake requires MFA for Snowsight password users.',
    code: null,
  },
  {
    id: 'sso',
    name: 'Federated / SSO',
    full: 'Federated Authentication & Single Sign-On',
    icon: '🏢',
    color: 'bg-violet-50 border-violet-200',
    badge: 'bg-violet-100 text-violet-700',
    useCases: ['Snowsight (UI)', 'Interactive apps'],
    desc: 'Delegates authentication to an external IdP (Okta, Azure AD, AD FS) via SAML 2.0. Preferred option for Snowsight — users authenticate once for all org apps.',
    how: 'User visits Snowflake → redirected to IdP → authenticates with corporate credentials → SAML 2.0 assertion returned → Snowflake grants access.',
    exam: 'Snowflake = Service Provider (SP). IdP configured via a SAML2 Security Integration. SSO is the preferred Snowsight auth method.',
    code: `-- Create SSO security integration
CREATE SECURITY INTEGRATION my_idp
  TYPE = SAML2
  ENABLED = TRUE
  SAML2_ISSUER = 'https://mycompany.okta.com'
  SAML2_SSO_URL = 'https://mycompany.okta.com/sso/saml'
  SAML2_PROVIDER = 'OKTA'
  SAML2_X509_CERT = '<cert>';`,
  },
  {
    id: 'oauth',
    name: 'OAuth 2.0',
    full: 'OAuth 2.0 Delegated Access',
    icon: '🔑',
    color: 'bg-amber-50 border-amber-200',
    badge: 'bg-amber-100 text-amber-700',
    useCases: ['Interactive apps', 'Service-to-service'],
    desc: 'Token-based delegated access. Snowflake OAuth = Snowflake is the auth server (for BI tools). External OAuth = 3rd-party IdP issues tokens.',
    how: 'App requests access token → user/service approves → app receives short-lived token → app calls Snowflake API using token.',
    exam: 'Snowflake OAuth: Snowflake = auth server + resource server. External OAuth: 3rd-party IdP = auth server, Snowflake = resource server. BI tools (Tableau, Power BI) use Snowflake OAuth.',
    code: `-- Snowflake OAuth for Tableau Desktop
CREATE SECURITY INTEGRATION tableau_oauth
  TYPE = OAUTH
  OAUTH_CLIENT = TABLEAU_DESKTOP
  ENABLED = TRUE;

-- External OAuth (3rd-party IdP issues tokens)
CREATE SECURITY INTEGRATION ext_oauth
  TYPE = EXTERNAL_OAUTH
  EXTERNAL_OAUTH_TYPE = OKTA
  EXTERNAL_OAUTH_ISSUER = 'https://mycompany.okta.com'
  ENABLED = TRUE;`,
  },
  {
    id: 'keypair',
    name: 'Key-Pair Auth',
    full: 'Key-Pair Authentication',
    icon: '🗝️',
    color: 'bg-emerald-50 border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-700',
    useCases: ['Interactive apps', 'Service-to-service'],
    desc: 'RSA 2048-bit (or 4096-bit) key pair. Private key stays on the client; public key is registered in Snowflake. Passwordless — private key never transmitted.',
    how: 'Client signs JWT with private key → Snowflake verifies signature against stored public key → access granted. No password leaves the client.',
    exam: 'Best for service accounts, CLI, Snowpark, and programmatic access. Key rotation: assign RSA_PUBLIC_KEY_2 while RSA_PUBLIC_KEY still valid, then swap.',
    code: `-- Register public key for a service user
ALTER USER svc_etl
  SET RSA_PUBLIC_KEY='MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A...'
      RSA_PUBLIC_KEY_2='MIIBIjANBgkqhkiG9w0B...';  -- for rotation

-- Connect via Python connector
conn = connect(
  user='svc_etl',
  account='myorg-myaccount',
  private_key=load_pem_private_key(pem_data, None)
)`,
  },
  {
    id: 'wif',
    name: 'Workload Identity',
    full: 'Workload Identity Federation (WIF)',
    icon: '☁️',
    color: 'bg-sky-50 border-sky-200',
    badge: 'bg-sky-100 text-sky-700',
    useCases: ['Service-to-service'],
    desc: 'Secretless authentication for cloud workloads (AWS EC2, Azure VMs, GCP VMs, GitHub Actions, Kubernetes). Uses the cloud provider\'s native identity — no keys or passwords to manage.',
    how: 'Workload running on cloud → obtains short-lived attestation from cloud IAM (e.g. AWS IAM role) → driver sends attestation to Snowflake → Snowflake validates → access granted.',
    exam: 'Preferred for service-to-service apps. No secrets to rotate. Also supports OIDC federation for GitHub Actions and Kubernetes.',
    code: `-- Create security integration for AWS workload
CREATE SECURITY INTEGRATION aws_wif
  TYPE = EXTERNAL_OAUTH
  EXTERNAL_OAUTH_TYPE = AWS_IAM
  EXTERNAL_OAUTH_ISSUER = 'https://sts.amazonaws.com'
  ENABLED = TRUE;
-- No secrets to manage — AWS IAM handles identity`,
  },
  {
    id: 'pat',
    name: 'PAT',
    full: 'Programmatic Access Token',
    icon: '🎟️',
    color: 'bg-rose-50 border-rose-200',
    badge: 'bg-rose-100 text-rose-700',
    useCases: ['Interactive apps', 'Service-to-service'],
    desc: 'Short-lived, Snowflake-generated token. Drop-in replacement for single-factor passwords where MFA or stronger methods won\'t work. Scoped to a specific role.',
    how: 'Admin creates PAT scoped to a role → client uses PAT in place of password → Snowflake validates → access granted with scoped role.',
    exam: 'PAT is stronger than password (time-limited, role-scoped, Snowflake-only). GitHub secret scanner auto-detects leaked PATs in public repos and disables them. Network policy required.',
    code: `-- Create a PAT for a user (scoped to analyst role)
-- Done via Snowsight: Admin > Users > [user] > Programmatic Access Tokens
-- Or SQL:
SELECT SYSTEM$CREATE_OAUTH_TOKEN(
  'analyst',         -- role to scope to
  3600               -- TTL in seconds
);`,
  },
];

// ─── Auth use-case comparison matrix ──────────────────────────────────────────
const AUTH_USE_CASES = [
  { method: 'SSO / Federated', snowsight: '⭐ Preferred', interactive: '✅ Strong', s2s: '—', secretless: true },
  { method: 'Password + MFA',  snowsight: '✅ Simple',    interactive: '—',          s2s: '—', secretless: false },
  { method: 'Snowflake OAuth', snowsight: '—',            interactive: '✅ Strong',  s2s: '—', secretless: false },
  { method: 'External OAuth',  snowsight: '—',            interactive: '✅ Strong',  s2s: '✅ Strong', secretless: false },
  { method: 'Key-Pair',        snowsight: '—',            interactive: '✅',         s2s: '✅', secretless: false },
  { method: 'WIF',             snowsight: '—',            interactive: '—',          s2s: '⭐ Preferred', secretless: true },
  { method: 'PAT',             snowsight: '—',            interactive: '✅',         s2s: '✅', secretless: false },
];

const PRIVILEGE_CHAIN = [
  { label: 'USAGE on Warehouse', obj: 'Warehouse', icon: '⚙️', note: 'Compute to run the query' },
  { label: 'USAGE on Database', obj: 'Database', icon: '🗄️', note: 'Enter the database container' },
  { label: 'USAGE on Schema', obj: 'Schema', icon: '📂', note: 'Enter the schema container' },
  { label: 'SELECT on Table', obj: 'Table', icon: '📋', note: 'Actually read the data' },
];

// ─── Interactive: Role Hierarchy Explorer ─────────────────────────────────────
const RoleHierarchyExplorer = () => {
  const [selected, setSelected] = useState('accountadmin');
  const role = ROLE_HIERARCHY_DATA.find(r => r.id === selected);

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500">Click any role to explore its purpose, capabilities, and best practices.</p>

      {/* Visual hierarchy */}
      <div className="bg-slate-50 rounded-xl p-4 space-y-2">
        {/* Row 0: GLOBALORGADMIN + ORGADMIN */}
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setSelected('globalorgadmin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all ${
              selected === 'globalorgadmin' ? 'bg-indigo-800 text-white border-indigo-800 shadow-md scale-105' : 'bg-white text-indigo-700 border-indigo-300 hover:border-indigo-500'
            }`}
          >GLOBALORGADMIN</button>
          <button
            onClick={() => setSelected('orgadmin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all opacity-60 ${
              selected === 'orgadmin' ? 'bg-purple-700 text-white border-purple-700 shadow-md scale-105' : 'bg-white text-purple-700 border-purple-300 hover:border-purple-500'
            }`}
          >ORGADMIN <span className="font-normal italic">(legacy)</span></button>
        </div>
        {/* connector */}
        <div className="flex justify-center"><div className="w-px h-4 bg-slate-300" /></div>
        {/* Row 1: ACCOUNTADMIN */}
        <div className="flex justify-center">
          <button
            onClick={() => setSelected('accountadmin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all ${
              selected === 'accountadmin' ? 'bg-red-700 text-white border-red-700 shadow-md scale-105' : 'bg-white text-red-700 border-red-300 hover:border-red-500'
            }`}
          >ACCOUNTADMIN</button>
        </div>
        {/* connectors to row 2 */}
        <div className="flex justify-center gap-16">
          <div className="w-px h-4 bg-slate-300 ml-[-2rem]" />
          <div className="w-px h-4 bg-slate-300 mr-[-2rem]" />
        </div>
        {/* Row 2: SECURITYADMIN + SYSADMIN */}
        <div className="flex justify-center gap-6">
          {['securityadmin','sysadmin'].map(id => {
            const r = ROLE_HIERARCHY_DATA.find(x => x.id === id);
            return (
              <button
                key={id}
                onClick={() => setSelected(id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all ${
                  selected === id
                    ? `${r.color} text-white border-transparent shadow-md scale-105`
                    : `bg-white ${id === 'securityadmin' ? 'text-orange-700 border-orange-300 hover:border-orange-500' : 'text-blue-700 border-blue-300 hover:border-blue-500'}`
                }`}
              >{r.name}</button>
            );
          })}
        </div>
        {/* connector from SECURITYADMIN to USERADMIN */}
        <div className="flex justify-center">
          <div className="w-px h-4 bg-slate-300 mr-24" />
        </div>
        {/* Row 3: USERADMIN */}
        <div className="flex justify-center">
          <div className="mr-24">
            <button
              onClick={() => setSelected('useradmin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all ${
                selected === 'useradmin' ? 'bg-amber-600 text-white border-amber-600 shadow-md scale-105' : 'bg-white text-amber-700 border-amber-300 hover:border-amber-500'
              }`}
            >USERADMIN</button>
          </div>
        </div>
        {/* Custom roles row */}
        <div className="flex justify-center gap-3 pt-1">
          {['analyst_role','etl_role','bi_role'].map(r => (
            <div key={r} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-200 text-slate-600 border border-dashed border-slate-400">
              {r.replace('_', ' ').toUpperCase()}
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-slate-400 italic">↑ Custom roles — always grant to SYSADMIN ↑</p>
        {/* PUBLIC */}
        <div className="flex justify-center pt-1">
          <button
            onClick={() => setSelected('public')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all ${
              selected === 'public' ? 'bg-slate-500 text-white border-slate-500 shadow-md scale-105' : 'bg-white text-slate-600 border-slate-300 hover:border-slate-500'
            }`}
          >PUBLIC</button>
        </div>
        <p className="text-center text-xs text-slate-400 italic">↑ Auto-granted to every user ↑</p>
      </div>

      {/* Detail panel */}
      {role && (
        <div className={`${role.color} rounded-xl p-4 text-white`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono font-bold text-base">{role.name}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full bg-white/20 ${role.textLight}`}>{role.scope}</span>
          </div>
          <p className="text-sm text-white/90 mb-3">{role.desc}</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">Can Do</p>
              <ul className="space-y-1">
                {role.canDo.map((c, i) => (
                  <li key={i} className="text-xs text-white/90 flex items-start gap-1.5">
                    <span className="text-white/50 mt-0.5">•</span>{c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">Best Practice</p>
              <p className="text-xs text-white/90">{role.bestPractice}</p>
              {role.inherits.length > 0 && (
                <p className="text-xs text-white/70 mt-2">
                  Inherits: {role.inherits.map(r => <span key={r} className="font-mono font-bold text-white/90 mr-1">{r}</span>)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Interactive: Access Control Model Selector ────────────────────────────────
const AccessModelExplorer = () => {
  const [active, setActive] = useState('rbac');
  const models = {
    rbac: {
      name: 'RBAC',
      full: 'Role-Based Access Control',
      color: 'bg-violet-600',
      lightBg: 'bg-violet-50',
      border: 'border-violet-200',
      desc: 'Access privileges are assigned to roles, which are then assigned to users. The primary model in Snowflake.',
      flow: ['Privilege granted to Role', 'Role granted to User', 'User gets all role privileges'],
      example: `GRANT SELECT ON TABLE db.sch.orders TO ROLE analyst;
GRANT ROLE analyst TO USER alice;
-- Alice can now SELECT from orders`,
      keyFact: 'Every SQL action requires a role with the appropriate privilege. You always act as a role, not as yourself.',
    },
    dac: {
      name: 'DAC',
      full: 'Discretionary Access Control',
      color: 'bg-blue-600',
      lightBg: 'bg-blue-50',
      border: 'border-blue-200',
      desc: 'Each securable object has an owner (a role). The owner can grant access to other roles at their discretion.',
      flow: ['Role creates object → becomes owner', 'Owner decides who gets access', 'Owner can transfer ownership'],
      example: `-- SYSADMIN creates a table → owns it
CREATE TABLE sales.orders (...);

-- Owner grants access to another role
GRANT SELECT ON TABLE sales.orders TO ROLE analyst;

-- Transfer ownership
GRANT OWNERSHIP ON TABLE sales.orders TO ROLE data_team;`,
      keyFact: 'In managed access schemas, object owners lose grant rights. Only the schema owner or MANAGE GRANTS holder can grant.',
    },
    ubac: {
      name: 'UBAC',
      full: 'User-Based Access Control',
      color: 'bg-teal-600',
      lightBg: 'bg-teal-50',
      border: 'border-teal-200',
      desc: 'Privileges can be granted directly to users (not through roles). Only effective when USE SECONDARY ROLES = ALL.',
      flow: ['Privilege granted directly to User', 'User activates secondary roles', 'Direct grants + role grants combine'],
      example: `-- Grant directly to a user
GRANT SELECT ON TABLE d1.s1.orders TO USER alice;

-- Alice must have secondary roles enabled
USE SECONDARY ROLES ALL;
SELECT * FROM d1.s1.orders; -- Works`,
      keyFact: 'UBAC is supplemental to RBAC. Use for collaborative/development scenarios like Streamlit apps. Can be disabled account-wide.',
    },
  };
  const m = models[active];

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {Object.entries(models).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${
              active === key ? `${val.color} text-white border-transparent shadow` : `bg-white ${val.border} text-slate-600 hover:border-slate-400`
            }`}
          >{val.name}</button>
        ))}
      </div>
      <div className={`${m.lightBg} border ${m.border} rounded-xl p-4`}>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{m.full}</p>
        <p className="text-sm text-slate-700 mb-3">{m.desc}</p>
        <div className="flex flex-wrap items-center gap-1 mb-3">
          {m.flow.map((step, i) => (
            <React.Fragment key={i}>
              <span className="bg-white border border-slate-200 text-xs text-slate-700 px-2.5 py-1 rounded-full shadow-sm">{step}</span>
              {i < m.flow.length - 1 && <span className="text-slate-400 text-xs">→</span>}
            </React.Fragment>
          ))}
        </div>
        <CodeBlock code={m.example} />
        <p className="text-xs font-medium text-slate-600 mt-2 bg-white/70 rounded-lg px-3 py-2 border border-slate-200">
          📌 {m.keyFact}
        </p>
      </div>
    </div>
  );
};

// ─── Interactive: Object Hierarchy Drill-down ──────────────────────────────────
const ObjectHierarchyExplorer = () => {
  const [activeLevel, setActiveLevel] = useState(null);

  return (
    <div className="space-y-2">
      <p className="text-xs text-slate-500">Click a level to see what it contains and what privileges are required.</p>
      {OBJ_HIERARCHY_LEVELS.map((level, i) => (
        <div key={i}>
          <button
            onClick={() => setActiveLevel(activeLevel === i ? null : i)}
            className={`w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all ${
              activeLevel === i
                ? `${level.bg} ${level.border} shadow-sm`
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
            style={{ marginLeft: `${i * 16}px`, width: `calc(100% - ${i * 16}px)` }}
          >
            <span className="text-base">{level.emoji}</span>
            <div className="flex-1">
              <span className={`font-bold text-sm ${activeLevel === i ? level.text : 'text-slate-700'}`}>{level.label}</span>
              <span className="text-xs text-slate-400 ml-2">{level.examples}</span>
            </div>
            <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${activeLevel === i ? 'rotate-90' : ''}`} />
          </button>
          {activeLevel === i && (
            <div
              className={`${level.bg} border ${level.border} rounded-xl p-3 text-xs ${level.text} mt-1`}
              style={{ marginLeft: `${i * 16 + 8}px` }}
            >
              {level.desc}
              {i > 0 && (
                <p className="mt-1 font-semibold">
                  Required grants: {OBJ_HIERARCHY_LEVELS.slice(1, i + 1).map((l, j) => (
                    <span key={j} className="mr-1">USAGE on {l.label}{j < i - 1 ? ' →' : ''}</span>
                  ))}{i === OBJ_HIERARCHY_LEVELS.length - 1 ? ' → specific privilege (SELECT, INSERT, etc.)' : ''}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-2">
        <p className="text-xs font-bold text-amber-700 mb-1">Minimum privileges to query a table:</p>
        <div className="flex flex-wrap gap-1">
          {PRIVILEGE_CHAIN.map((p, i) => (
            <React.Fragment key={i}>
              <div className="bg-white border border-amber-200 rounded-lg px-2.5 py-1 text-xs">
                <span className="mr-1">{p.icon}</span>
                <span className="font-semibold text-amber-800">{p.label}</span>
                <span className="text-amber-600 ml-1 text-[10px]">({p.note})</span>
              </div>
              {i < PRIVILEGE_CHAIN.length - 1 && <span className="text-amber-400 text-sm self-center">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Interactive: Authentication Method Cards ──────────────────────────────────
const AuthExplorer = () => {
  const [active, setActive] = useState(null);
  const [view, setView] = useState('cards');

  return (
    <div className="space-y-3">
      {/* View toggle */}
      <div className="flex gap-2">
        {[['cards','📋 Methods'],['matrix','🗂️ Use-Case Matrix']].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setView(id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-2 ${
              view === id ? 'bg-violet-700 text-white border-violet-700' : 'bg-white border-violet-200 text-violet-700 hover:border-violet-400'
            }`}
          >{label}</button>
        ))}
      </div>

      {view === 'cards' && (
        <div className="grid sm:grid-cols-2 gap-3">
          {AUTH_METHODS_DATA.map((auth, i) => (
            <button
              key={auth.id}
              onClick={() => setActive(active === i ? null : i)}
              className={`text-left border-2 rounded-xl p-3 transition-all ${
                active === i
                  ? auth.color + ' shadow-md'
                  : 'bg-white border-slate-200 hover:border-violet-300'
              }`}
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{auth.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{auth.name}</p>
                    <p className="text-xs text-slate-500">{auth.full}</p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5 transition-transform ${active === i ? 'rotate-90' : ''}`} />
              </div>
              {/* Use-case badges */}
              <div className="flex flex-wrap gap-1 mt-1">
                {auth.useCases.map(u => (
                  <span key={u} className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">{u}</span>
                ))}
              </div>
              {active === i && (
                <div className="mt-3 space-y-2 text-left">
                  <p className="text-xs text-slate-700">{auth.desc}</p>
                  <div className="bg-white/60 rounded-lg p-2 border border-white/80">
                    <p className="text-xs font-semibold text-slate-600 mb-0.5">How it works:</p>
                    <p className="text-xs text-slate-600">{auth.how}</p>
                  </div>
                  {auth.code && <CodeBlock code={auth.code} />}
                  <p className="text-xs font-medium bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg px-3 py-1.5">
                    📌 {auth.exam}
                  </p>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {view === 'matrix' && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-violet-50">
                <th className="text-left p-2.5 border border-violet-200 font-bold text-violet-700">Method</th>
                <th className="p-2.5 border border-violet-200 font-bold text-violet-700 text-center">Snowsight (UI)</th>
                <th className="p-2.5 border border-violet-200 font-bold text-violet-700 text-center">Interactive Apps</th>
                <th className="p-2.5 border border-violet-200 font-bold text-violet-700 text-center">Service-to-Service</th>
                <th className="p-2.5 border border-violet-200 font-bold text-violet-700 text-center">Secretless?</th>
              </tr>
            </thead>
            <tbody>
              {AUTH_USE_CASES.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="p-2.5 border border-slate-200 font-semibold text-slate-700">{row.method}</td>
                  <td className="p-2.5 border border-slate-200 text-center">{row.snowsight}</td>
                  <td className="p-2.5 border border-slate-200 text-center">{row.interactive}</td>
                  <td className="p-2.5 border border-slate-200 text-center">{row.s2s}</td>
                  <td className="p-2.5 border border-slate-200 text-center">
                    {row.secretless
                      ? <span className="text-emerald-600 font-bold">✅ Yes</span>
                      : <span className="text-slate-400">No</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-slate-500 mt-2">⭐ = Preferred option per Snowflake docs &nbsp;|&nbsp; ✅ = Strong option &nbsp;|&nbsp; — = Not applicable</p>
        </div>
      )}
    </div>
  );
};

// ─── Interactive: Role Types Comparison ───────────────────────────────────────
const RoleTypesPanel = () => {
  const [active, setActive] = useState('account');
  const types = {
    account: {
      label: 'Account Roles',
      color: 'bg-violet-600',
      light: 'bg-violet-50',
      border: 'border-violet-200',
      text: 'text-violet-800',
      scope: 'Entire account',
      activate: 'Directly in a session (USE ROLE)',
      grantTo: 'Users, other account roles',
      canOwn: 'Any object in the account',
      example: 'ANALYST, ETL_ROLE, REPORTING_ROLE',
      note: 'Primary role type for all access control in Snowflake.',
    },
    database: {
      label: 'Database Roles',
      color: 'bg-blue-600',
      light: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      scope: 'Single database',
      activate: 'Cannot activate directly. Must be granted to an account role.',
      grantTo: 'Account roles, other database roles in same DB',
      canOwn: 'Objects within the same database',
      example: 'ANALYTICS_DB.READER, ANALYTICS_DB.WRITER',
      note: 'Useful for data sharing — segment access within a shared database.',
    },
    secondary: {
      label: 'Secondary Roles',
      color: 'bg-teal-600',
      light: 'bg-teal-50',
      border: 'border-teal-200',
      text: 'text-teal-800',
      scope: 'Session-level activation',
      activate: 'USE SECONDARY ROLES ALL / USE SECONDARY ROLES NONE',
      grantTo: 'N/A — these are existing account roles activated additionally',
      canOwn: 'N/A',
      example: 'Session has PRIMARY: analyst, SECONDARY: [etl_role, reporting_role]',
      note: 'Useful for cross-database joins. CREATE objects always use primary role.',
    },
  };
  const t = types[active];

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {Object.entries(types).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-2 ${
              active === key ? `${val.color} text-white border-transparent` : `bg-white ${val.border} ${val.text} hover:shadow-sm`
            }`}
          >{val.label}</button>
        ))}
      </div>
      <div className={`${t.light} border ${t.border} rounded-xl p-4`}>
        <div className="grid sm:grid-cols-2 gap-2 text-xs mb-3">
          {[
            ['Scope', t.scope],
            ['How to activate', t.activate],
            ['Can be granted to', t.grantTo],
            ['Can own objects', t.canOwn],
          ].map(([k, v]) => (
            <div key={k} className="bg-white rounded-lg px-3 py-2 border border-slate-100">
              <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-0.5">{k}</p>
              <p className={`${t.text} font-medium`}>{v}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg px-3 py-2 border border-slate-100 text-xs mb-2">
          <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-0.5">Example</p>
          <p className="font-mono text-slate-700">{t.example}</p>
        </div>
        <p className={`text-xs font-medium ${t.text} bg-white/70 rounded-lg px-3 py-2 border ${t.border}`}>📌 {t.note}</p>
      </div>
      {active === 'secondary' && (
        <CodeBlock code={`-- Activate all granted roles as secondary
USE SECONDARY ROLES ALL;

-- Now you can use privileges from multiple roles at once
SELECT a.* FROM db1.sch.tableA a   -- needs role1
JOIN db2.sch.tableB b ON ...       -- needs role2

-- CREATE always uses primary role only
CREATE TABLE new_table (...);  -- owned by primary role`} />
      )}
    </div>
  );
};

const SecurityTab = () => {
  const [section, setSection] = useState('models');
  const sections = [
    { id: 'models',    label: 'Access Models' },
    { id: 'hierarchy', label: 'Object Hierarchy' },
    { id: 'roles',     label: 'Role Hierarchy' },
    { id: 'roletypes', label: 'Role Types' },
    { id: 'auth',      label: 'Authentication' },
    { id: 'network',   label: 'Network Policies' },
    { id: 'misc',      label: 'Identifiers & Logging' },
  ];

  return (
    <div className="space-y-5">
      <InfoCard>
        <SectionHeader
          icon={Shield}
          color="bg-violet-700"
          title="2.1 Snowflake Security Model"
          subtitle="RBAC · DAC · UBAC · Object hierarchy · Roles · Auth · Network policies"
        />

        {/* Sub-section nav */}
        <div className="flex flex-wrap gap-1.5 mb-5 border-b border-slate-100 pb-4">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                section === s.id
                  ? 'bg-violet-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-violet-100 hover:text-violet-700'
              }`}
            >{s.label}</button>
          ))}
        </div>

        {/* ── Access Models ── */}
        {section === 'models' && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-700">Access Control Models</h3>
            <p className="text-sm text-slate-600">
              Snowflake combines three models. <span className="font-semibold text-violet-700">RBAC</span> is the foundation;
              <span className="font-semibold text-blue-700"> DAC</span> controls object ownership;
              <span className="font-semibold text-teal-700"> UBAC</span> allows direct-to-user grants (supplemental).
            </p>
            <AccessModelExplorer />
            <ExamTip>
              <p>• RBAC is the primary model — always assign privileges to roles, not users directly.</p>
              <p>• DAC: the role that creates an object owns it. Ownership can be transferred with GRANT OWNERSHIP.</p>
              <p>• In a managed access schema, only the schema owner (not object owners) can grant privileges.</p>
              <p>• UBAC (direct user grants) only applies when USE SECONDARY ROLES is set to ALL.</p>
            </ExamTip>
          </div>
        )}

        {/* ── Object Hierarchy ── */}
        {section === 'hierarchy' && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-700">Securable Object Hierarchy</h3>
            <p className="text-sm text-slate-600">
              Every object lives in a container hierarchy. You must have USAGE at each container level
              before you can access the objects inside.
            </p>
            <ObjectHierarchyExplorer />
            <ExamTip>
              <p>• To query a table: USAGE on Warehouse + USAGE on Database + USAGE on Schema + SELECT on Table.</p>
              <p>• Account-level objects (warehouses, databases) need separate grants from schema-level objects.</p>
              <p>• Cloned objects do NOT inherit the source object's grants — only child objects inside a cloned container retain grants.</p>
            </ExamTip>
          </div>
        )}

        {/* ── Role Hierarchy Explorer ── */}
        {section === 'roles' && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-700">System-Defined Role Hierarchy</h3>
            <p className="text-sm text-slate-600">
              Snowflake ships with six system-defined roles arranged in a hierarchy.
              Privileges flow <span className="font-semibold">upward</span> — higher roles inherit all privileges of lower roles in their subtree.
            </p>
            <RoleHierarchyExplorer />
            <ExamTip>
              <p>• ACCOUNTADMIN encapsulates SYSADMIN + SECURITYADMIN — it's the most powerful role.</p>
              <p>• SECURITYADMIN has MANAGE GRANTS — it can grant/revoke any privilege on any object.</p>
              <p>• Custom roles must be granted to SYSADMIN; otherwise ACCOUNTADMIN cannot manage their objects.</p>
              <p>• GLOBALORGADMIN (in org account) replaces ORGADMIN — use it for all new org-level tasks.</p>
              <p>• Cost management roles: grant <span className="font-mono text-xs">APP_USAGE_VIEWER</span> + <span className="font-mono text-xs">USAGE_VIEWER</span> (database role) to view costs; <span className="font-mono text-xs">APP_USAGE_ADMIN</span> + <span className="font-mono text-xs">USAGE_ADMIN</span> to manage budgets/anomalies.</p>
            </ExamTip>
          </div>
        )}

        {/* ── Role Types ── */}
        {section === 'roletypes' && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-700">Role Types</h3>
            <p className="text-sm text-slate-600">
              Snowflake has three distinct types of roles. Each has a different scope and activation mechanism.
            </p>
            <RoleTypesPanel />
            <ExamTip>
              <p>• Database roles cannot be activated directly in a session — they must be granted to an account role.</p>
              <p>• Secondary roles allow combining privileges across multiple roles in one session.</p>
              <p>• CREATE statements always use the primary role — new objects are owned by the primary role.</p>
              <p>• Future grants: use ON FUTURE TABLES IN SCHEMA to auto-grant privileges on new objects.</p>
            </ExamTip>
          </div>
        )}

        {/* ── Authentication ── */}
        {section === 'auth' && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-700">Authentication Methods</h3>
            <p className="text-sm text-slate-600">
              Snowflake supports multiple authentication methods for <span className="font-semibold">human users</span> (Snowsight),
              <span className="font-semibold"> interactive apps</span> (BI tools, custom apps), and
              <span className="font-semibold"> service-to-service</span> workloads.
              Click each card to explore, or switch to the matrix for a quick comparison.
            </p>
            <AuthExplorer />
            <ExamTip>
              <p>• SSO (SAML 2.0) is the preferred Snowsight auth — Snowflake acts as the <span className="font-semibold">Service Provider (SP)</span>.</p>
              <p>• Snowflake OAuth = Snowflake is the auth server. External OAuth = 3rd-party IdP is the auth server.</p>
              <p>• WIF is <span className="font-semibold">secretless</span> (preferred for cloud services) — no keys or passwords to rotate.</p>
              <p>• Key-pair: private key never leaves the client. Use <span className="font-mono text-xs">RSA_PUBLIC_KEY_2</span> for zero-downtime rotation.</p>
              <p>• PAT: time-limited, role-scoped, Snowflake-only token. GitHub secret scanner auto-detects leaked PATs.</p>
              <p>• Authentication Policies can restrict which methods are allowed per account or user.</p>
            </ExamTip>
          </div>
        )}

        {/* ── Network Policies ── */}
        {section === 'network' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-700">Network Policies &amp; Network Rules</h3>
            <p className="text-sm text-slate-600 mb-2">
              Network policies control <span className="font-semibold">inbound</span> access to Snowflake.
              Modern policies use <span className="font-semibold">Network Rules</span> (schema-level objects that group identifiers) rather than raw IP lists.
            </p>

            {/* Precedence visual */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-1">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Policy Precedence (most specific wins)</p>
              <div className="space-y-2">
                {[
                  { label: 'Security Integration Policy', badge: '🏆 Highest', color: 'bg-red-100 border-red-300 text-red-800', note: 'Overrides all. Applied to a specific OAuth/SCIM integration.' },
                  { label: 'User Policy', badge: '2nd', color: 'bg-amber-100 border-amber-300 text-amber-800', note: 'Overrides account policy for that user.' },
                  { label: 'Account Policy', badge: '3rd (Lowest)', color: 'bg-blue-100 border-blue-300 text-blue-800', note: 'Applies to all users unless overridden. Only one per account.' },
                ].map((p, i) => (
                  <div key={i} className={`flex items-start gap-3 rounded-lg border px-3 py-2 ${p.color}`}>
                    <span className="text-xs font-bold whitespace-nowrap">{p.badge}</span>
                    <div>
                      <p className="text-xs font-bold">{p.label}</p>
                      <p className="text-xs opacity-80">{p.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Workflow */}
            <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
              <p className="text-xs font-bold text-violet-700 uppercase tracking-wider mb-2">Modern Workflow (Network Rules)</p>
              <div className="flex flex-wrap gap-1 items-center text-xs mb-3">
                {['1. Create Network Rule(s)', '→', '2. Create Network Policy (add rules to allowed/blocked lists)', '→', '3. Activate policy on account / user / security integration'].map((s, i) => (
                  <span key={i} className={s === '→' ? 'text-violet-400 font-bold' : 'bg-white border border-violet-200 text-violet-700 font-medium px-2 py-1 rounded-lg'}>{s}</span>
                ))}
              </div>
              <div className="grid sm:grid-cols-2 gap-3 mb-3">
                <div className="bg-white rounded-lg p-3 border border-violet-100">
                  <p className="text-xs font-bold text-slate-700 mb-1">Network Rule (schema-level)</p>
                  <ul className="text-xs text-slate-600 space-y-0.5">
                    <li>• Groups identifiers of the same type</li>
                    <li>• Types: IPV4, AWSVPCEID, AZURELINKID</li>
                    <li>• Modes: INGRESS (service), INTERNAL_STAGE</li>
                    <li>• Does NOT specify allow/block — that's the policy's job</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-3 border border-violet-100">
                  <p className="text-xs font-bold text-slate-700 mb-1">Network Policy (account-level)</p>
                  <ul className="text-xs text-slate-600 space-y-0.5">
                    <li>• References network rules in allowed/blocked lists</li>
                    <li>• Blocked takes precedence over allowed for same IP</li>
                    <li>• Private connectivity rules override IPV4 rules</li>
                    <li>• Only ONE policy active per account at a time</li>
                  </ul>
                </div>
              </div>
              <CodeBlock code={`-- Step 1: Create network rules
CREATE NETWORK RULE allow_corp_ips
  MODE = INGRESS TYPE = IPV4
  VALUE_LIST = ('192.168.1.0/24', '10.0.0.0/8');

CREATE NETWORK RULE block_specific_ip
  MODE = INGRESS TYPE = IPV4
  VALUE_LIST = ('192.168.1.99');          -- blocked within allowed range

-- Step 2: Create policy referencing rules
CREATE NETWORK POLICY corp_policy
  ALLOWED_NETWORK_RULE_LIST = ('allow_corp_ips')
  BLOCKED_NETWORK_RULE_LIST = ('block_specific_ip');

-- Step 3a: Activate on account (all users)
ALTER ACCOUNT SET NETWORK_POLICY = corp_policy;

-- Step 3b: Activate on a user (overrides account policy)
ALTER USER svc_app SET NETWORK_POLICY = corp_policy;

-- Step 3c: Activate on a security integration
CREATE SECURITY INTEGRATION oauth_int
  TYPE = OAUTH OAUTH_CLIENT = CUSTOM
  NETWORK_POLICY = corp_policy
  ENABLED = TRUE;`} />
            </div>

            {/* Interaction rules */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <p className="text-xs font-bold text-amber-700 mb-2">Key Interaction Rules</p>
              <div className="space-y-1.5 text-xs text-amber-800">
                <p>• If IP is in BOTH allowed and blocked lists → <span className="font-semibold">blocked wins</span>.</p>
                <p>• Private connectivity (AWSVPCEID/AZURELINKID) rules → <span className="font-semibold">take precedence over IPV4 rules</span>.</p>
                <p>• A security integration policy <span className="font-semibold">does NOT</span> restrict access to internal stages.</p>
                <p>• To temporarily bypass a policy: only Snowflake Support can set <span className="font-mono text-xs">MINS_TO_BYPASS_NETWORK_POLICY</span> on a user.</p>
                <p>• Old-style <span className="font-mono text-xs">ALLOWED_IP_LIST</span>/<span className="font-mono text-xs">BLOCKED_IP_LIST</span> still works but cannot be modified in Snowsight — use SQL.</p>
              </div>
            </div>

            <ExamTip>
              <p>• Precedence: Security Integration policy &gt; User policy &gt; Account policy.</p>
              <p>• Network Rules are schema-level objects — organize identifiers by type. One policy can reference many rules.</p>
              <p>• Blocked IP always beats allowed IP in the same policy.</p>
              <p>• Private VPC endpoint rules (AWSVPCEID) override IPV4 rules.</p>
              <p>• Only one network policy can be active per account at a time.</p>
            </ExamTip>
          </div>
        )}

        {/* ── Identifiers & Logging ── */}
        {section === 'misc' && (
          <div className="space-y-5">

            {/* ── Account Identifiers ── */}
            <div>
              <h3 className="text-sm font-bold text-slate-700 mb-3">Account Identifiers</h3>
              <p className="text-sm text-slate-600 mb-3">
                Every Snowflake account has two identifier formats. The <span className="font-semibold text-violet-700">account name format is preferred</span> — it is portable, human-readable, and stable across cloud/region changes.
              </p>

              {/* Two formats side by side */}
              <div className="grid sm:grid-cols-2 gap-3 mb-3">
                <div className="bg-violet-50 border-2 border-violet-300 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold bg-violet-600 text-white px-2 py-0.5 rounded-full">⭐ PREFERRED</span>
                    <span className="text-xs font-bold text-violet-700 uppercase tracking-wider">Format 1 — Account Name</span>
                  </div>
                  <p className="font-mono text-base text-violet-800 font-bold mb-1">orgname-accountname</p>
                  <p className="font-mono text-xs text-slate-500 mb-3">e.g. <span className="text-violet-700">myorg-prod_us</span></p>
                  <div className="space-y-1.5 text-xs text-slate-700">
                    <p>• Unique within your organization</p>
                    <p>• <span className="font-semibold">Can be renamed</span> after creation</p>
                    <p>• Used in all modern connection strings</p>
                    <p>• URL: <span className="font-mono text-violet-700">orgname-accountname.snowflakecomputing.com</span></p>
                    <p>• SQL fully-qualified: <span className="font-mono">orgname.accountname</span> (dot, not dash)</p>
                    <p>• Data sharing identifier: <span className="font-mono">orgname.accountname</span></p>
                  </div>
                  <CodeBlock code={`-- Get your account identifier in SQL
SELECT CURRENT_ORGANIZATION_NAME()
    || '-' || CURRENT_ACCOUNT_NAME();
-- Returns: myorg-myaccount

-- SQL statement fully-qualified form (dot separator)
CREATE DATABASE mydb AS REPLICA OF myorg.myaccount.mydb;`} />
                </div>
                <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 opacity-90">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold bg-slate-400 text-white px-2 py-0.5 rounded-full">LEGACY</span>
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Format 2 — Account Locator</span>
                  </div>
                  <p className="font-mono text-base text-slate-700 font-bold mb-1">locator.cloudregionid.cloud</p>
                  <p className="font-mono text-xs text-slate-500 mb-3">e.g. <span className="text-slate-600">xy12345.us-east-2.aws</span></p>
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <p>• Auto-assigned by Snowflake at creation</p>
                    <p>• <span className="font-semibold">Cannot be changed</span> once created</p>
                    <p>• Requires extra segments for non-default regions</p>
                    <p>• AWS US West (Oregon): <span className="font-mono">xy12345</span> (no extra segments)</p>
                    <p>• AWS US East (Ohio): <span className="font-mono">xy12345.us-east-2.aws</span></p>
                    <p>• Azure West US 2: <span className="font-mono">xy12345.west-us-2.azure</span></p>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 mt-3 text-xs text-amber-700">
                    ⚠️ Still supported but not recommended. Cannot be modified in Snowsight for policies using old IP list format.
                  </div>
                </div>
              </div>

              {/* Format rules */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-1">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Account Name Requirements</p>
                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-600">
                  <p>✅ Must start with an alphabetic character</p>
                  <p>✅ Letters, numbers, and underscores only</p>
                  <p>✅ Max 63 chars (org + account name + dash)</p>
                  <p>❌ No spaces or special chars except <span className="font-mono">_</span></p>
                  <p>❌ Must not end with <span className="font-mono">_</span></p>
                  <p>⚠️ Underscores unsupported in Okta SSO/SCIM URLs — use hyphens instead</p>
                </div>
              </div>
            </div>

            {/* ── Logging, Tracing & Metrics ── */}
            <div>
              <h3 className="text-sm font-bold text-slate-700 mb-1">Logging, Tracing &amp; Metrics</h3>
              <p className="text-sm text-slate-600 mb-3">
                Snowflake captures observability data (based on the <span className="font-semibold">OpenTelemetry</span> standard) from handler code —
                stored procedures, UDFs, Snowpark, and Streamlit apps — into an <span className="font-semibold">Event Table</span>.
              </p>

              {/* Three telemetry types */}
              <div className="grid sm:grid-cols-3 gap-3 mb-3">
                {[
                  { type: 'Log Messages', icon: '📝', param: 'LOG_LEVEL', levels: 'TRACE · DEBUG · INFO · WARN · ERROR · FATAL · OFF', color: 'bg-blue-50 border-blue-200', text: 'text-blue-700', desc: 'Unstructured strings about code state. All entries ingested — no quantity limit. Queries require parsing.', unlimited: true },
                  { type: 'Trace Events', icon: '🔍', param: 'TRACE_LEVEL', levels: 'ALWAYS · ON_EVENT · OFF', color: 'bg-violet-50 border-violet-200', text: 'text-violet-700', desc: 'Structured key-value spans. Easy to query. Capped at 128 events per span. Great for aggregating behavior.', unlimited: false },
                  { type: 'Metrics', icon: '📊', param: 'METRIC_LEVEL', levels: 'ALL · NONE', color: 'bg-teal-50 border-teal-200', text: 'text-teal-700', desc: 'CPU and memory metrics auto-generated by Snowflake. Binary — either ALL or NONE.', unlimited: false },
                ].map(t => (
                  <div key={t.type} className={`${t.color} border rounded-xl p-3`}>
                    <p className="text-sm font-bold text-slate-800 mb-0.5">{t.icon} {t.type}</p>
                    <p className={`text-xs font-mono font-bold ${t.text} mb-1`}>{t.param}</p>
                    <p className="text-[10px] text-slate-500 mb-2">{t.levels}</p>
                    <p className="text-xs text-slate-600">{t.desc}</p>
                    {t.unlimited && <p className="text-xs text-emerald-600 font-medium mt-1">✅ No quantity limit</p>}
                    {!t.unlimited && <p className="text-xs text-amber-600 font-medium mt-1">⚠️ Quantity limits apply</p>}
                  </div>
                ))}
              </div>

              {/* Level hierarchy */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-3">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Level Scope Hierarchy — More specific overrides more general</p>
                <div className="flex flex-wrap items-center gap-1 text-xs mb-3">
                  {['Account', '→ Database', '→ Schema', '→ Object (Proc/UDF)'].map((s, i) => (
                    <span key={i} className={`px-2.5 py-1 rounded-lg font-medium ${i === 0 ? 'bg-slate-300 text-slate-700' : i === 3 ? 'bg-violet-200 text-violet-800' : 'bg-slate-200 text-slate-600'}`}>{s}</span>
                  ))}
                  <span className="text-slate-400 mx-1">and separately:</span>
                  {['Account', '→ User', '→ Session'].map((s, i) => (
                    <span key={i} className={`px-2.5 py-1 rounded-lg font-medium ${i === 0 ? 'bg-slate-300 text-slate-700' : i === 2 ? 'bg-blue-200 text-blue-800' : 'bg-slate-200 text-slate-600'}`}>{s}</span>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mb-2">When both session and object levels are set, Snowflake uses the <span className="font-semibold">most verbose</span> (e.g. DEBUG beats WARN).</p>
                <CodeBlock code={`-- Set account-wide log level
ALTER ACCOUNT SET LOG_LEVEL = WARN;

-- Override for a specific database (all procs/UDFs in it)
ALTER DATABASE analytics_db SET LOG_LEVEL = INFO;

-- Override for a single UDF
ALTER FUNCTION my_udf(INT) SET LOG_LEVEL = DEBUG;

-- Override for current session only
ALTER SESSION SET LOG_LEVEL = TRACE;

-- Set trace level
ALTER ACCOUNT SET TRACE_LEVEL = ALWAYS;  -- capture all spans
-- ON_EVENT = only spans with events; OFF = none

-- Set metrics
ALTER ACCOUNT SET METRIC_LEVEL = ALL;    -- ALL or NONE only`} />
              </div>

              {/* Event table details */}
              <div className="grid sm:grid-cols-2 gap-3 mb-3">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <p className="text-xs font-bold text-slate-700 mb-2">Event Table Setup</p>
                  <p className="text-xs text-slate-600 mb-2">A regular Snowflake table with a predefined schema. Associate with an account to start capturing telemetry.</p>
                  <CodeBlock code={`-- Create event table (predefined schema)
CREATE EVENT TABLE my_db.my_sch.events;

-- Set as the active event table for the account
ALTER ACCOUNT SET EVENT_TABLE = my_db.my_sch.events;

-- Query log messages
SELECT timestamp, record['message']::STRING AS msg,
       resource_attributes
FROM my_db.my_sch.events
WHERE record_type = 'LOG'
ORDER BY timestamp DESC;`} />
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <p className="text-xs font-bold text-slate-700 mb-2">Log vs Trace — Key Differences</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-violet-50">
                          <th className="text-left p-1.5 border border-violet-200 text-violet-700">Feature</th>
                          <th className="p-1.5 border border-violet-200 text-violet-700 text-center">Logs</th>
                          <th className="p-1.5 border border-violet-200 text-violet-700 text-center">Traces</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ['Structure', 'Plain string', 'Key-value pairs'],
                          ['Grouping', '❌ Independent', '✅ Spans'],
                          ['Quantity limit', '✅ None', '⚠️ 128/span'],
                          ['Query complexity', 'High (parse)', 'Low (structured)'],
                          ['Best for', 'Debug detail', 'Aggregation'],
                        ].map(([feat, log, trace], i) => (
                          <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                            <td className="p-1.5 border border-slate-200 font-medium text-slate-600">{feat}</td>
                            <td className="p-1.5 border border-slate-200 text-center text-slate-600">{log}</td>
                            <td className="p-1.5 border border-slate-200 text-center text-slate-600">{trace}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1.5">
                    ⚠️ Payload limit: 1 MB per record. Exceeded payloads are truncated to timestamp + record_type + resource_attributes only.
                  </div>
                </div>
              </div>

              {/* ACCOUNT_USAGE audit views */}
              <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
                <p className="text-xs font-bold text-violet-700 uppercase tracking-wider mb-2">Key ACCOUNT_USAGE Audit Views</p>
                <div className="space-y-1.5">
                  {[
                    { view: 'LOGIN_HISTORY',        desc: 'All login attempts — success and failure, client info, auth method used.' },
                    { view: 'QUERY_HISTORY',         desc: 'Every query executed — user, warehouse, credits, execution time, status.' },
                    { view: 'ACCESS_HISTORY',        desc: 'What data each query read/wrote — column-level lineage. Key for data auditing.' },
                    { view: 'GRANTS_TO_ROLES',       desc: 'All privilege grants currently active on roles.' },
                    { view: 'GRANTS_TO_USERS',       desc: 'All role grants to users — which user has which role.' },
                  ].map(v => (
                    <div key={v.view} className="flex items-start gap-2 bg-white/70 rounded-lg px-3 py-2 border border-violet-100">
                      <span className="font-mono text-xs font-bold text-violet-700 min-w-[190px] flex-shrink-0">{v.view}</span>
                      <span className="text-xs text-slate-600">{v.desc}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  <span className="font-semibold">Latency:</span> ACCOUNT_USAGE has up to <span className="font-semibold">3-hour latency</span> (some views up to 2 days).
                  Use <span className="font-mono text-violet-700">INFORMATION_SCHEMA</span> for near-real-time data (scoped to current DB, 7–14 day retention).
                </p>
              </div>
            </div>

            <ExamTip>
              <p>• Account name format (<span className="font-mono text-xs">orgname-accountname</span>) is preferred — portable, stable, renameable. Locator is legacy.</p>
              <p>• SQL statements use dot separator: <span className="font-mono text-xs">orgname.accountname</span>. Connection strings use dash: <span className="font-mono text-xs">orgname-accountname</span>.</p>
              <p>• Event tables follow OpenTelemetry standard — captures logs, traces, and metrics from handler code.</p>
              <p>• Logs = unlimited, unstructured strings. Traces = structured spans (128 events/span limit), easy to query.</p>
              <p>• Level hierarchy: Account → Database → Schema → Object (most specific wins). Session overrides use most verbose.</p>
              <p>• 1 MB payload limit per event record — exceeded records are truncated to timestamp + record_type only.</p>
            </ExamTip>
          </div>
        )}
      </InfoCard>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// LEARNING TAB 2 — 2.2 Data Governance
// Covers: Data masking (row-level, column-level), object tagging, privacy policies,
//         Trust Center, encryption key management, alerts, notifications,
//         data replication & failover, data lineage
// ═══════════════════════════════════════════════════════════════════════════════

const GOV_SECTIONS = [
  { id: 'masking',     label: '🎭 Data Masking' },
  { id: 'tagging',     label: '🏷️ Object Tagging' },
  { id: 'privacy',     label: '🔏 Privacy Policies' },
  { id: 'trust',       label: '🛡️ Trust Center' },
  { id: 'encryption',  label: '🔑 Encryption Keys' },
  { id: 'other',       label: '📦 Other Features' },
];

// ── Data Masking sub-section ──────────────────────────────────────────────────
const MASKING_TABS = [
  { id: 'ddm',   label: 'Dynamic Data Masking' },
  { id: 'token', label: 'External Tokenization' },
  { id: 'rap',   label: 'Row Access Policies' },
];

const DataMaskingSection = () => {
  const [activeTab, setActiveTab] = useState('ddm');
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Column-level Security in Snowflake protects sensitive data at query time — the stored data is <strong>never physically modified</strong>. Two masking features exist: Dynamic Data Masking and External Tokenization.
      </p>

      {/* Tab switcher */}
      <div className="flex gap-2 flex-wrap">
        {MASKING_TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === t.id
                ? 'bg-violet-700 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-violet-50 hover:text-violet-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'ddm' && (
        <div className="space-y-3">
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
            <p className="text-xs font-bold text-violet-800 mb-2">What is Dynamic Data Masking?</p>
            <p className="text-xs text-slate-600 mb-2">
              A <strong>schema-level masking policy</strong> is applied to table or view columns. At query time Snowflake rewrites the query to apply the masking expression wherever the column appears (projections, JOINs, WHERE clauses). Authorized roles see real data; others see masked output.
            </p>
            <div className="grid sm:grid-cols-2 gap-2 text-xs">
              {[
                { label: 'Edition required', val: 'Enterprise or higher' },
                { label: 'Object level', val: 'Schema-level object' },
                { label: 'Data changed?', val: 'No — masked at query time only' },
                { label: 'Apply to', val: 'Table columns & view columns' },
              ].map(r => (
                <div key={r.label} className="flex gap-2 bg-white border border-violet-100 rounded-lg px-3 py-2">
                  <span className="font-semibold text-slate-600 min-w-[130px]">{r.label}:</span>
                  <span className="text-slate-700">{r.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-700 mb-1">Policy structure & apply</p>
            <CodeBlock code={`-- Create a masking policy (schema-level object)
CREATE MASKING POLICY email_mask AS (val STRING) RETURNS STRING ->
  CASE
    WHEN CURRENT_ROLE() IN ('PII_ROLE') THEN val        -- authorized: real value
    ELSE REGEXP_REPLACE(val, '.+@', '*****@')           -- others: partially masked
  END;

-- Apply to a new table column
CREATE TABLE customers (
  id   NUMBER,
  email STRING MASKING POLICY email_mask              -- inline assignment
);

-- Apply to an existing column
ALTER TABLE customers MODIFY COLUMN email
  SET MASKING POLICY email_mask;

-- Replace with a different policy in one atomic step
ALTER TABLE customers MODIFY COLUMN email
  SET MASKING POLICY email_mask_v2 FORCE;             -- FORCE replaces in-place`} />
          </div>

          <div>
            <p className="text-xs font-bold text-slate-700 mb-1">Conditional masking (multi-column)</p>
            <CodeBlock code={`-- Conditional masking: second argument is a "visibility" control column
CREATE MASKING POLICY email_visibility AS
  (email VARCHAR, visibility STRING) RETURNS VARCHAR ->
  CASE
    WHEN CURRENT_ROLE() = 'ADMIN' THEN email
    WHEN visibility = 'PUBLIC'    THEN email
    ELSE '***MASKED***'
  END;

ALTER TABLE t1 MODIFY COLUMN email
  SET MASKING POLICY email_visibility USING (email, visibility);`} />
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <p className="text-xs font-bold text-slate-700 mb-2">Management approaches</p>
            <div className="grid sm:grid-cols-3 gap-2 text-xs">
              {[
                { name: 'Centralized', who: 'Security officer creates AND applies all policies.' },
                { name: 'Hybrid', who: 'Security officer creates; individual teams apply policies to their objects.' },
                { name: 'Decentralized', who: 'Individual teams create and apply their own policies.' },
              ].map(m => (
                <div key={m.name} className="bg-white border border-slate-200 rounded-lg p-2">
                  <p className="font-bold text-violet-700 mb-1">{m.name}</p>
                  <p className="text-slate-600">{m.who}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <p className="text-xs font-bold text-slate-700 mb-2">Key privileges</p>
            <div className="space-y-1 text-xs">
              {[
                { priv: 'CREATE MASKING POLICY ON SCHEMA', use: 'Lets a role create new masking policies in a schema.' },
                { priv: 'APPLY MASKING POLICY ON ACCOUNT', use: 'Global — lets a role set/unset any masking policy on any column.' },
                { priv: 'APPLY ON MASKING POLICY <name>', use: 'Scoped — lets a role set/unset a specific policy on columns it owns.' },
                { priv: 'OWNERSHIP ON MASKING POLICY', use: 'Required to ALTER or DROP the masking policy.' },
              ].map(p => (
                <div key={p.priv} className="flex gap-2">
                  <code className="text-violet-700 font-mono min-w-[220px] shrink-0">{p.priv}</code>
                  <span className="text-slate-600">{p.use}</span>
                </div>
              ))}
            </div>
          </div>

          <ExamTip>
            <p>• Masking policies are schema-level objects — a database and schema must exist first.</p>
            <p>• A column can have only ONE masking policy at a time; use FORCE to replace without unsetting first.</p>
            <p>• Policy is evaluated at every location the column appears — projections, JOINs, WHERE clauses.</p>
            <p>• Object owners cannot view masked data and cannot unset policies on their own objects (SoD).</p>
            <p>• APPLY MASKING POLICY ON ACCOUNT also enables DESCRIBE on tables/views for that role.</p>
          </ExamTip>
        </div>
      )}

      {activeTab === 'token' && (
        <div className="space-y-3">
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
            <p className="text-xs font-bold text-violet-800 mb-2">What is External Tokenization?</p>
            <p className="text-xs text-slate-600">
              Data is <strong>tokenized before being loaded into Snowflake</strong> using a third-party tokenization provider. At query runtime, Snowflake calls an external function (REST API) to detokenize data for authorized roles. Unauthorized users always see the token, never the real value.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
              <p className="font-bold text-slate-700 mb-2">Dynamic Data Masking</p>
              <ul className="space-y-1 text-slate-600">
                <li>• Data stored unmasked; masking at query time</li>
                <li>• No third-party provider needed</li>
                <li>• Works with Data Sharing</li>
                <li>• Simpler to set up</li>
              </ul>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
              <p className="font-bold text-slate-700 mb-2">External Tokenization</p>
              <ul className="space-y-1 text-slate-600">
                <li>• Data pre-loaded as tokens — real value never in Snowflake</li>
                <li>• Requires third-party provider + external function</li>
                <li>• Cannot be used with Data Sharing</li>
                <li>• Strongest protection for ultra-sensitive data</li>
              </ul>
            </div>
          </div>

          <CodeBlock code={`-- External tokenization uses an external function in the policy body
CREATE MASKING POLICY ssn_detokenize AS (val STRING) RETURNS STRING ->
  CASE
    WHEN CURRENT_ROLE() IN ('PAYROLL') THEN ssn_unprotect(val)  -- external fn
    ELSE val                                                      -- sees token
  END;

-- ssn_unprotect is an external function calling a tokenization provider REST API`} />

          <ExamTip>
            <p>• External Tokenization requires Enterprise Edition + an external function + API integration.</p>
            <p>• Even without a masking policy, unauthorized users see tokens — real data was never loaded.</p>
            <p>• External functions cannot be used in the context of a Secure Data Share (limitation).</p>
          </ExamTip>
        </div>
      )}

      {activeTab === 'rap' && (
        <div className="space-y-3">
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
            <p className="text-xs font-bold text-violet-800 mb-2">Row Access Policies (Row-level Security)</p>
            <p className="text-xs text-slate-600">
              A row access policy is a <strong>schema-level object</strong> attached to a table or view column. It returns a <strong>BOOLEAN</strong> expression — rows where the expression evaluates to FALSE are filtered out of query results. Only <strong>one RAP per table/view</strong> is allowed.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-2 text-xs">
            {[
              { label: 'Edition required', val: 'Enterprise or higher' },
              { label: 'Return type', val: 'BOOLEAN (TRUE = visible)' },
              { label: 'Max per table', val: 'One RAP per table/view' },
            ].map(r => (
              <div key={r.label} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <p className="font-bold text-slate-700 mb-1">{r.label}</p>
                <p className="text-slate-600">{r.val}</p>
              </div>
            ))}
          </div>

          <CodeBlock code={`-- Create a row access policy
CREATE ROW ACCESS POLICY region_rap AS (region_col VARCHAR) RETURNS BOOLEAN ->
  CURRENT_ROLE() = 'ADMIN'               -- admins see all rows
  OR region_col = CURRENT_REGION();      -- others see only matching region rows

-- Attach to a table (specify mapped column in ON clause)
ALTER TABLE sales ADD ROW ACCESS POLICY region_rap ON (region);

-- Remove
ALTER TABLE sales DROP ROW ACCESS POLICY region_rap;

-- Check policies on a table
SELECT * FROM TABLE(
  INFORMATION_SCHEMA.POLICY_REFERENCES(ref_entity_name => 'SALES', ref_entity_domain => 'TABLE')
);`} />

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
            <p className="font-bold text-slate-700 mb-2">Mapping tables pattern</p>
            <p className="text-slate-600">
              A common pattern is to store role-to-region mappings in a dedicated table and reference it in the RAP body using a subquery. This allows dynamic access control without rewriting the policy when roles change.
            </p>
          </div>

          <ExamTip>
            <p>• RAP returns BOOLEAN — FALSE hides the row; TRUE shows it. One RAP per table maximum.</p>
            <p>• A column can be in a masking policy OR a RAP — not both simultaneously.</p>
            <p>• Use IS_ROLE_IN_SESSION() for role hierarchy checks inside a RAP or masking policy body.</p>
            <p>• POLICY_CONTEXT function lets you simulate how a policy will evaluate without real data.</p>
          </ExamTip>
        </div>
      )}
    </div>
  );
};

// ── Object Tagging sub-section ────────────────────────────────────────────────
const ObjectTaggingSection = () => {
  const [openStep, setOpenStep] = useState(null);
  const HIERARCHY = ['Organization/Account', 'Database', 'Schema', 'Table / View', 'Column'];

  return (
    <div className="space-y-4">
      <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
        <p className="text-xs font-bold text-violet-800 mb-2">What is a tag?</p>
        <p className="text-xs text-slate-600">
          A tag is a <strong>schema-level object</strong> that stores a key-value pair (the value is always a string). It can be assigned to Snowflake objects for classification, cost attribution, and governance. An object can have up to <strong>50 tags</strong>; a table's columns collectively also support up to 50 unique tag-entity associations.
        </p>
      </div>

      {/* Tag inheritance visual */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <p className="text-xs font-bold text-slate-700 mb-3">Tag Inheritance Hierarchy</p>
        <div className="flex items-center flex-wrap gap-1">
          {HIERARCHY.map((level, i) => (
            <React.Fragment key={level}>
              <div className="bg-violet-100 border border-violet-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-violet-800 text-center">
                {level}
              </div>
              {i < HIERARCHY.length - 1 && (
                <ChevronRight className="w-4 h-4 text-violet-400 flex-shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-2">Tags propagate downward — a tag on a table is inherited by all its columns unless explicitly overridden.</p>
      </div>

      {/* How tags get associated */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-slate-700">How a tag gets associated with an object</p>
        {[
          { method: 'Manual assignment', desc: 'CREATE or ALTER an object and specify the tag directly.', badge: 'All editions' },
          { method: 'Tag inheritance', desc: 'Child objects (e.g. columns) automatically inherit tags from parent objects (e.g. tables).', badge: 'All editions' },
          { method: 'Automatic propagation', desc: 'Tags propagate from a source object to dependent objects (e.g. views derived from tagged tables, CTAS).', badge: 'Enterprise+' },
          { method: 'Sensitive data classification', desc: 'Snowflake ML-based classification auto-tags columns detected as PII using a tag map.', badge: 'Enterprise+' },
        ].map((item, i) => (
          <button
            key={item.method}
            onClick={() => setOpenStep(openStep === i ? null : i)}
            className="w-full text-left bg-slate-50 hover:bg-violet-50 border border-slate-200 rounded-xl px-4 py-3 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-700">{item.method}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.badge === 'Enterprise+' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{item.badge}</span>
              </div>
              <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${openStep === i ? 'rotate-90' : ''}`} />
            </div>
            {openStep === i && <p className="mt-2 text-xs text-slate-600">{item.desc}</p>}
          </button>
        ))}
      </div>

      <CodeBlock code={`-- 1. Create a tag (schema-level object)
CREATE TAG pii_tag COMMENT = 'Marks columns containing PII data';

-- 2. Apply manually to a column
ALTER TABLE customers MODIFY COLUMN email
  SET TAG pii_tag = 'email_address';

-- 3. Apply to a table (propagates to columns via inheritance)
ALTER TABLE customers SET TAG pii_tag = 'customer_table';

-- 4. Tag-based masking: assign a masking policy to the tag
--    Any column with pii_tag gets auto-protected by the masking policy
ALTER TAG pii_tag SET MASKING POLICY email_mask;

-- 5. Audit: query tag assignments
SELECT tag_name, tag_value, object_name, column_name
FROM SNOWFLAKE.ACCOUNT_USAGE.TAG_REFERENCES
WHERE tag_name = 'PII_TAG';`} />

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
        <p className="font-bold text-slate-700 mb-2">Tag quotas</p>
        <div className="space-y-1 text-slate-600">
          <p>• Maximum <strong>50 tags per object</strong> (e.g. per table, per warehouse)</p>
          <p>• Maximum <strong>50 unique tags across all columns</strong> of a single table (separate quota from table-level tags)</p>
          <p>• Maximum <strong>100 unique tag-entity associations</strong> per CREATE/ALTER statement</p>
        </div>
      </div>

      <ExamTip>
        <p>• Tags are schema-level objects — creating them requires privileges on the parent database and schema.</p>
        <p>• Tag inheritance is available in all editions; tag propagation and tag-based masking require Enterprise+.</p>
        <p>• A masking policy directly on a column takes precedence over a tag-based masking policy.</p>
        <p>• Use ACCOUNT_USAGE.TAG_REFERENCES to audit tag assignments; INFORMATION_SCHEMA.TAG_REFERENCES for database-level queries.</p>
        <p>• apply_method column in TAG_REFERENCES shows whether a tag was set manually, inherited, or propagated.</p>
      </ExamTip>
    </div>
  );
};

// ── Privacy Policies sub-section ──────────────────────────────────────────────
const PRIVACY_CONTEXT_FNS = [
  { fn: 'CURRENT_ACCOUNT()', use: 'Returns the account locator for the current session.' },
  { fn: 'CURRENT_ROLE()', use: 'Returns the active role in the current session.' },
  { fn: 'CURRENT_USER()', use: 'Returns the name of the executing user.' },
  { fn: 'CURRENT_DATABASE()', use: 'Returns the database containing the privacy-protected table.' },
  { fn: 'CURRENT_SCHEMA()', use: 'Returns the schema containing the privacy-protected table.' },
  { fn: 'INVOKER_ROLE()', use: 'Returns the name of the executing role (useful for views).' },
  { fn: 'INVOKER_SHARE()', use: 'Returns the share name that accessed the table (for sharing).' },
];

const PrivacyPoliciesSection = () => (
  <div className="space-y-4">
    <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
      <p className="text-xs font-bold text-violet-800 mb-2">What are Privacy Policies?</p>
      <p className="text-xs text-slate-600">
        Privacy policies implement <strong>differential privacy</strong> in Snowflake. They associate users with <strong>privacy budgets</strong> — limits on cumulative information that can be extracted from a protected table. Snowflake adds statistical noise to query results to prevent re-identification. When a user exhausts their budget, further queries are blocked.
      </p>
    </div>

    <div className="grid sm:grid-cols-3 gap-2 text-xs">
      {[
        { label: 'Edition required', val: 'Enterprise or higher' },
        { label: 'Object level', val: 'Schema-level object' },
        { label: 'Max per table', val: 'One privacy policy per table/view' },
      ].map(r => (
        <div key={r.label} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
          <p className="font-bold text-slate-700 mb-1">{r.label}</p>
          <p className="text-slate-600">{r.val}</p>
        </div>
      ))}
    </div>

    {/* 3-step workflow */}
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
      <p className="text-xs font-bold text-slate-700 mb-3">Implementation workflow</p>
      <div className="space-y-2">
        {[
          { step: '1', title: 'Create privacy policy', desc: 'Define conditions mapping users/roles to privacy budgets using context functions.' },
          { step: '2', title: 'Assign to table with ENTITY KEY', desc: 'Attach the policy to a table. ENTITY KEY specifies the column that uniquely identifies an individual (e.g. email, user_id) for entity-level privacy.' },
          { step: '3', title: 'Grant SELECT privileges', desc: 'Only grant SELECT after the privacy policy is attached — otherwise analysts access unprotected data.' },
        ].map(s => (
          <div key={s.step} className="flex gap-3">
            <div className="bg-violet-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{s.step}</div>
            <div>
              <p className="text-xs font-semibold text-slate-700">{s.title}</p>
              <p className="text-xs text-slate-500">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    <CodeBlock code={`-- Create a privacy policy
CREATE PRIVACY POLICY my_privacy_policy
  AS () RETURNS PRIVACY_BUDGET ->
    CASE
      WHEN CURRENT_USER() = 'ADMIN'
        THEN NO_PRIVACY_POLICY()                       -- unrestricted access
      WHEN CURRENT_ACCOUNT() = 'MY_ACCOUNT'
        THEN PRIVACY_BUDGET(BUDGET_NAME => 'analysts') -- internal budget
      ELSE PRIVACY_BUDGET(                             -- external accounts
        BUDGET_NAME => 'external.' || CURRENT_ACCOUNT()
      )
    END;

-- Assign to a table with entity key (for entity-level privacy)
ALTER TABLE customer_data
  ADD PRIVACY POLICY my_privacy_policy ENTITY KEY (email);

-- Replace policy atomically (no gap in protection)
ALTER TABLE customer_data
  DROP PRIVACY POLICY old_policy,
  ADD PRIVACY POLICY new_policy ENTITY KEY (email);

-- Remove policy
ALTER TABLE customer_data DROP PRIVACY POLICY my_privacy_policy;`} />

    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
      <p className="text-xs font-bold text-slate-700 mb-2">Context functions usable in privacy policy body</p>
      <div className="space-y-1">
        {PRIVACY_CONTEXT_FNS.map(f => (
          <div key={f.fn} className="flex gap-2 text-xs">
            <code className="text-violet-700 font-mono min-w-[200px] shrink-0">{f.fn}</code>
            <span className="text-slate-600">{f.use}</span>
          </div>
        ))}
      </div>
    </div>

    <ExamTip>
      <p>• Privacy policies implement differential privacy — noise is added to results to prevent re-identification.</p>
      <p>• ENTITY KEY column must uniquely identify an individual; omit for row-level-only protection (NO ENTITY KEY).</p>
      <p>• Always assign the privacy policy BEFORE granting SELECT — otherwise data is unprotected.</p>
      <p>• Drop and add atomically using a single ALTER statement to avoid a protection gap.</p>
      <p>• Privileges: APPLY on policy + OWNERSHIP on table to assign; CREATE PRIVACY POLICY on schema to create.</p>
    </ExamTip>
  </div>
);

// ── Trust Center sub-section ──────────────────────────────────────────────────
const TRUST_TABS = [
  { id: 'overview',  label: 'Overview' },
  { id: 'scanners',  label: 'Scanner Packages' },
  { id: 'findings',  label: 'Findings' },
];

const SCANNER_PACKAGES = [
  {
    name: 'Security Essentials',
    schedule: 'Fixed schedule (free)',
    always: true,
    badge: 'Always enabled',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    checks: [
      'Authentication policy enforcing MFA for all human password users',
      'All human users enrolled in MFA (for password-based auth)',
      'Account-level network policy restricting access to trusted IPs',
      'Event table configured if account uses native app event sharing',
    ],
  },
  {
    name: 'CIS Benchmarks',
    schedule: 'Daily (configurable)',
    always: false,
    badge: 'Optional',
    badgeColor: 'bg-blue-100 text-blue-700',
    checks: [
      'Evaluates account against CIS Snowflake Benchmark best practices',
      'Numbered recommendations (e.g. 3.1 = network policy, 4.10 = masking)',
      'Detects missing masking policies, retention settings, and role overprovisioning',
      'Section 2 scanners require manual SQL review of findings (not surfaced in UI)',
    ],
  },
  {
    name: 'Threat Intelligence',
    schedule: 'Daily + event-driven',
    always: false,
    badge: 'Optional',
    badgeColor: 'bg-amber-100 text-amber-700',
    checks: [
      'Identifies human users with password-only sign-in (no MFA)',
      'Dormant users who have not logged in for 90+ days',
      'High authentication failure rates (potential account takeover)',
      'Logins from unusual/malicious IP addresses (event-driven)',
      'Sensitive parameter changes, admin privilege grants, unusual client apps',
    ],
  },
];

const TrustCenterSection = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [openPkg, setOpenPkg] = useState(0);

  return (
    <div className="space-y-4">
      {/* Tab switcher */}
      <div className="flex gap-2 flex-wrap">
        {TRUST_TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === t.id
                ? 'bg-violet-700 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-violet-50 hover:text-violet-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-3">
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
            <p className="text-xs font-bold text-violet-800 mb-2">What is the Trust Center?</p>
            <p className="text-xs text-slate-600">
              The Trust Center is a <strong>security monitoring dashboard</strong> in Snowsight that evaluates your Snowflake account against security recommendations using scanners. It surfaces <em>findings</em> — configuration issues and anomalous events — and provides remediation guidance. It <strong>detects issues but does not auto-remediate them</strong>.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <p className="text-xs font-bold text-slate-700 mb-2">Required application roles</p>
            <div className="space-y-2 text-xs">
              {[
                { role: 'SNOWFLAKE.TRUST_CENTER_VIEWER', caps: 'View Detections and Violations tabs. Read-only access.' },
                { role: 'SNOWFLAKE.TRUST_CENTER_ADMIN', caps: 'View + manage violations lifecycle, enable/configure scanner packages, change schedules.' },
                { role: 'ORGANIZATION_SECURITY_VIEWER + TRUST_CENTER_ADMIN', caps: 'Required to view the Organization tab (only available in an organization account).' },
              ].map(r => (
                <div key={r.role} className="flex gap-2">
                  <code className="text-violet-700 font-mono min-w-[290px] shrink-0">{r.role}</code>
                  <span className="text-slate-600">{r.caps}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">ACCOUNTADMIN grants these roles. In organization accounts, use GLOBALORGADMIN instead.</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
            <p className="font-bold text-slate-700 mb-2">Common use cases</p>
            <div className="grid sm:grid-cols-2 gap-1 text-slate-600">
              {[
                'Ensure MFA is enforced for all human password users',
                'Find over-privileged roles with ACCOUNTADMIN or SECURITYADMIN',
                'Identify users who have not logged in for 90+ days',
                'Detect logins from unrecognized or malicious IP addresses',
                'Monitor authentication failure anomalies',
                'Review sensitive parameter changes and privilege grants',
              ].map((u, i) => (
                <p key={i}>• {u}</p>
              ))}
            </div>
          </div>

          <ExamTip>
            <p>• Trust Center detects and surfaces security issues — it does NOT auto-fix or block actions.</p>
            <p>• Security Essentials is always enabled and runs on a fixed free schedule; you cannot deactivate it.</p>
            <p>• Organization tab is only available in the organization account, not regular accounts.</p>
          </ExamTip>
        </div>
      )}

      {activeTab === 'scanners' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-600">
            Scanners are grouped into packages. Enable a package to start scanning. The Security Essentials package is always on.
          </p>
          <div className="space-y-2">
            {SCANNER_PACKAGES.map((pkg, i) => (
              <div key={pkg.name} className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenPkg(openPkg === i ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-violet-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-700">{pkg.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${pkg.badgeColor}`}>{pkg.badge}</span>
                    <span className="text-xs text-slate-500">{pkg.schedule}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${openPkg === i ? 'rotate-90' : ''}`} />
                </button>
                {openPkg === i && (
                  <div className="px-4 py-3 bg-white border-t border-slate-200">
                    <p className="text-xs font-semibold text-slate-600 mb-2">What it checks:</p>
                    <ul className="space-y-1">
                      {pkg.checks.map((c, ci) => (
                        <li key={ci} className="text-xs text-slate-600 flex gap-2"><span className="text-violet-400 mt-0.5">•</span>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          <ExamTip>
            <p>• Security Essentials: always on, fixed free schedule — cannot be changed or deactivated.</p>
            <p>• CIS Benchmarks: optional, runs daily by default — evaluates against CIS Snowflake Benchmark numbered recommendations.</p>
            <p>• Threat Intelligence: optional, includes both schedule-based and event-driven scanners for detections.</p>
            <p>• Running scanner packages on demand beyond the free schedule incurs serverless compute cost.</p>
          </ExamTip>
        </div>
      )}

      {activeTab === 'findings' && (
        <div className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p className="text-xs font-bold text-amber-700 mb-2">Violations</p>
              <p className="text-xs text-slate-600 mb-2">
                A <strong>violation</strong> is a <em>persistent</em> configuration finding — it continues to be reported until the misconfiguration is resolved. Examples: users without MFA, no account-level network policy.
              </p>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>• Severity: low / medium / high / critical</li>
                <li>• Lifecycle: open → resolved (suppresses notifications)</li>
                <li>• Can add triage notes and justification for audit</li>
              </ul>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p className="text-xs font-bold text-blue-700 mb-2">Detections (Preview)</p>
              <p className="text-xs text-slate-600 mb-2">
                A <strong>detection</strong> is a <em>one-time event</em> finding. It represents something that happened at a specific point in time. Examples: login from unusual IP, large data transfer to external stage, dormant user sign-in.
              </p>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>• Cannot directly remediate a past event</li>
                <li>• Reported within ~1 hour of the event</li>
                <li>• Lifecycle management not currently supported</li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
            <p className="font-bold text-slate-700 mb-2">Violation lifecycle</p>
            <div className="flex items-center gap-2 flex-wrap">
              {['Open', '→ Triage (add notes)', '→ Resolved (suppresses notifications)', '→ Reopen if needed'].map((s, i) => (
                <span key={i} className={`px-2 py-1 rounded-lg ${i === 0 ? 'bg-red-100 text-red-700' : i === 2 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'} font-medium`}>{s}</span>
              ))}
            </div>
          </div>

          <ExamTip>
            <p>• Violations = persistent config issues; Detections = one-time events. Both are generated by scanners.</p>
            <p>• Resolving a violation suppresses further notifications but does not fix the underlying misconfiguration.</p>
            <p>• Organization tab shows violation counts across all accounts in the org — cannot resolve from there.</p>
          </ExamTip>
        </div>
      )}
    </div>
  );
};

// ── Encryption Key Management sub-section ────────────────────────────────────
const KEY_HIERARCHY = [
  { level: 'Root Key', where: 'Cloud HSM (AWS KMS / Azure Vault / GCP KMS)', desc: 'Stored in and used only within the cloud Hardware Security Module. Never leaves the HSM.' },
  { level: 'Account Master Key (AMK)', where: 'Wrapped by Root Key', desc: 'One per Snowflake account. Rotated automatically every 30 days. Wraps Table Master Keys.' },
  { level: 'Table Master Key (TMK)', where: 'Wrapped by AMK', desc: 'One per table. Rotated every 30 days. Encrypts File Keys for that table.' },
  { level: 'File Key', where: 'Wrapped by TMK', desc: 'One per micro-partition file. Encrypts the actual customer data in storage.' },
];

const EncryptionKeysSection = () => {
  const [openLevel, setOpenLevel] = useState(null);
  return (
    <div className="space-y-4">
      <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
        <p className="text-xs font-bold text-violet-800 mb-2">Snowflake encryption overview</p>
        <p className="text-xs text-slate-600">
          All customer data is encrypted at rest using <strong>AES-256</strong> and in transit using <strong>TLS</strong>. Snowflake uses a <strong>hierarchical key model</strong> — each layer of keys wraps (encrypts) the layer below it, limiting the scope of each key. Keys are managed automatically with no customer configuration required by default.
        </p>
      </div>

      {/* Key hierarchy visual */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <p className="text-xs font-bold text-slate-700 mb-3">Hierarchical Key Model (click a level to explore)</p>
        <div className="space-y-2">
          {KEY_HIERARCHY.map((k, i) => (
            <button
              key={k.level}
              onClick={() => setOpenLevel(openLevel === i ? null : i)}
              className={`w-full text-left rounded-xl px-4 py-3 border transition-colors ${openLevel === i ? 'bg-violet-50 border-violet-300' : 'bg-white border-slate-200 hover:bg-violet-50'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white ${
                    i === 0 ? 'bg-indigo-700' : i === 1 ? 'bg-violet-600' : i === 2 ? 'bg-violet-500' : 'bg-violet-400'
                  }`}>{i + 1}</div>
                  <span className="text-xs font-bold text-slate-700">{k.level}</span>
                  <span className="text-xs text-slate-500 italic">{k.where}</span>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${openLevel === i ? 'rotate-90' : ''}`} />
              </div>
              {openLevel === i && (
                <p className="mt-2 text-xs text-slate-600 pl-10">{k.desc}</p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Snowflake-managed keys */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <p className="text-xs font-bold text-slate-700 mb-3">Snowflake-managed key lifecycle</p>
        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-white border border-slate-200 rounded-xl p-3">
            <p className="font-bold text-violet-700 mb-1">Key Rotation</p>
            <p className="text-slate-600">Keys are automatically rotated when older than <strong>30 days</strong>. The old key is retired (only decrypts) then eventually destroyed. New data uses the new key.</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-3">
            <p className="font-bold text-violet-700 mb-1">Periodic Rekeying <span className="text-amber-600">(Enterprise+)</span></p>
            <p className="text-slate-600">After a retired key is older than <strong>1 year</strong>, all data it protected is re-encrypted with a new key. The old key is then destroyed. Enable with <code className="bg-slate-100 px-1 rounded">PERIODIC_DATA_REKEYING = TRUE</code>.</p>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2">Rekeying happens online in the background — no downtime or query impact.</p>
      </div>

      {/* Customer-managed keys */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <p className="text-xs font-bold text-slate-700 mb-3">Customer-Managed Keys (BYOK) — Tri-Secret Secure</p>
        <p className="text-xs text-slate-600 mb-3">
          <strong>Tri-Secret Secure</strong> combines a Snowflake-managed key with a <strong>customer-managed key (CMK)</strong> stored in the customer's cloud KMS. The two keys form a composite master key. Snowflake cannot decrypt data if the customer revokes their CMK. Requires <strong>Business Critical Edition</strong>.
        </p>
        <div className="grid sm:grid-cols-3 gap-2 text-xs mb-3">
          {[
            { cloud: 'AWS', service: 'AWS Key Management Service (KMS)' },
            { cloud: 'Azure', service: 'Azure Key Vault' },
            { cloud: 'GCP', service: 'Cloud Key Management Service (Cloud KMS)' },
          ].map(c => (
            <div key={c.cloud} className="bg-white border border-slate-200 rounded-xl p-2 text-center">
              <p className="font-bold text-slate-700">{c.cloud}</p>
              <p className="text-slate-500">{c.service}</p>
            </div>
          ))}
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs">
          <p className="font-bold text-amber-800 mb-1">Critical CMK requirements</p>
          <ul className="space-y-1 text-amber-700">
            <li>• Keep the CMK continuously available — if unavailable for more than 10 minutes, all data operations stop.</li>
            <li>• Never delete rotated CMK versions — Snowflake cannot decrypt data encrypted with a deleted key.</li>
            <li>• Snowflake handles temporary failures up to 10 min gracefully; after that, operations cease.</li>
          </ul>
        </div>
      </div>

      <ExamTip>
        <p>• Hierarchical key model: Root Key → AMK → TMK → File Key. Each layer wraps the one below.</p>
        <p>• Key rotation (30 days) retires active keys; periodic rekeying (1 year, Enterprise+) destroys retired keys.</p>
        <p>• Tri-Secret Secure = Snowflake key + customer CMK. Requires Business Critical Edition.</p>
        <p>• Revoking or making CMK unavailable halts all data operations in the account within 10 minutes.</p>
        <p>• Rekeying happens online with no downtime or query performance impact.</p>
      </ExamTip>
    </div>
  );
};

// ── Other Features sub-section ────────────────────────────────────────────────
const OTHER_FEATURE_TABS = [
  { id: 'alerts',      label: '🔔 Alerts' },
  { id: 'notifs',      label: '📣 Notifications' },
  { id: 'replication', label: '🔄 Replication & Failover' },
  { id: 'lineage',     label: '🔗 Data Lineage' },
];

const REPLICATED_OBJECTS = [
  { name: 'Databases & Shares', edition: 'All editions', notes: 'DB replication available to all; share replication available to all.' },
  { name: 'Roles & Grants', edition: 'Business Critical+', notes: 'Includes account and database roles, privilege grant hierarchies.' },
  { name: 'Users', edition: 'Business Critical+', notes: 'Includes auth methods (MFA, key-pair, PAT); users become read-only in target.' },
  { name: 'Warehouses', edition: 'Business Critical+', notes: 'Replicated in suspended state; resume manually in target account.' },
  { name: 'Resource Monitors', edition: 'Business Critical+', notes: 'Non-admin email notification settings replicated if users also replicated.' },
  { name: 'Network Policies & Rules', edition: 'Business Critical+', notes: 'Must include policy DB in object_types to avoid dangling references.' },
  { name: 'Security Integrations', edition: 'Business Critical+', notes: 'SAML2, SCIM, Snowflake OAuth, External OAuth supported.' },
  { name: 'Notification Integrations', edition: 'Business Critical+', notes: 'TYPE=EMAIL, TYPE=QUEUE (outbound), TYPE=WEBHOOK.' },
  { name: 'Tags & Masking Policies', edition: 'Business Critical+', notes: 'Tag assignments are read-only in target; modify in source then replicate.' },
  { name: 'Alerts', edition: 'Business Critical+', notes: 'Replicated as database objects when their database is in the group.' },
  { name: 'Secrets', edition: 'Business Critical+', notes: 'Must be in same group as integrations that reference them.' },
  { name: 'Account Parameters', edition: 'Business Critical+', notes: 'Include ACCOUNT PARAMETERS in object_types list.' },
];

const AlertsContent = () => (
  <div className="space-y-4 text-xs">
    <div className="grid sm:grid-cols-2 gap-3">
      <div className="bg-violet-50 border border-violet-200 rounded-xl p-3">
        <p className="font-bold text-violet-800 mb-1">What is an Alert?</p>
        <p className="text-slate-600 mb-2">A <strong>schema-level object</strong> that combines three things:</p>
        <ul className="space-y-1 text-slate-600">
          <li>• <strong>Condition</strong> — a SQL query; triggers if it returns rows</li>
          <li>• <strong>Action</strong> — SQL to run when condition is true (email, insert, call proc)</li>
          <li>• <strong>Schedule</strong> — interval in minutes or CRON expression</li>
        </ul>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-3">
        <p className="font-bold text-slate-700 mb-2">Required Privileges</p>
        <div className="space-y-1 text-slate-600">
          <p>• <code className="bg-slate-100 px-1 rounded">EXECUTE ALERT</code> on account <span className="text-slate-400">(ACCOUNTADMIN only grants this)</span></p>
          <p>• <code className="bg-slate-100 px-1 rounded">EXECUTE MANAGED ALERT</code> on account <span className="text-slate-400">(for serverless)</span></p>
          <p>• <code className="bg-slate-100 px-1 rounded">CREATE ALERT</code> + <code className="bg-slate-100 px-1 rounded">USAGE</code> on schema</p>
          <p>• <code className="bg-slate-100 px-1 rounded">USAGE</code> on warehouse <span className="text-slate-400">(if not serverless)</span></p>
        </div>
      </div>
    </div>

    <div className="grid sm:grid-cols-2 gap-3">
      <div className="bg-white border border-slate-200 rounded-xl p-3">
        <p className="font-bold text-slate-700 mb-2">Alert on a Schedule</p>
        <ul className="space-y-1 text-slate-600">
          <li>• Runs at fixed intervals regardless of new data</li>
          <li>• Evaluates condition against <strong>all data</strong></li>
          <li>• Good for: credit usage monitors, business rule checks</li>
          <li>• Use <code className="bg-slate-100 px-1 rounded">SCHEDULE = 'N MINUTE'</code> or CRON</li>
        </ul>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-3">
        <p className="font-bold text-slate-700 mb-2">Alert on New Data</p>
        <ul className="space-y-1 text-slate-600">
          <li>• Triggers only when new rows are inserted</li>
          <li>• Evaluates condition against <strong>new rows only</strong></li>
          <li>• Requires change tracking on the source table</li>
          <li>• <strong>Cannot</strong> use CTEs, JOINs, DML, stored proc calls in condition</li>
          <li>• Cannot be triggered with <code className="bg-slate-100 px-1 rounded">EXECUTE ALERT</code></li>
        </ul>
      </div>
    </div>

    <div className="grid sm:grid-cols-2 gap-3">
      <div className="bg-white border border-slate-200 rounded-xl p-3">
        <p className="font-bold text-slate-700 mb-2">Virtual Warehouse vs Serverless</p>
        <div className="space-y-2 text-slate-600">
          <div>
            <p className="font-semibold text-slate-700">Virtual Warehouse</p>
            <p>• You specify a named warehouse; billed per credit usage while running</p>
            <p>• Per-second billing; auto-suspend helps reduce cost</p>
          </div>
          <div>
            <p className="font-semibold text-slate-700">Serverless</p>
            <p>• Omit <code className="bg-slate-100 px-1 rounded">WAREHOUSE</code> parameter</p>
            <p>• Snowflake auto-sizes compute; billed as compute-hours</p>
            <p>• Max equivalent size: XXLARGE warehouse</p>
            <p>• Best for infrequent, low-volume alerts</p>
          </div>
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-3">
        <p className="font-bold text-slate-700 mb-2">Alert Lifecycle Commands</p>
        <div className="space-y-1 text-slate-600">
          <p>• Alerts are <strong>suspended by default</strong> after creation</p>
          <p>• <code className="bg-slate-100 px-1 rounded">ALTER ALERT my_alert RESUME</code> — activate</p>
          <p>• <code className="bg-slate-100 px-1 rounded">ALTER ALERT my_alert SUSPEND</code> — pause</p>
          <p>• <code className="bg-slate-100 px-1 rounded">ALTER ALERT … MODIFY CONDITION EXISTS (…)</code></p>
          <p>• <code className="bg-slate-100 px-1 rounded">ALTER ALERT … MODIFY ACTION …</code></p>
          <p>• <code className="bg-slate-100 px-1 rounded">EXECUTE ALERT my_alert</code> — manual run</p>
          <p>• <code className="bg-slate-100 px-1 rounded">DROP ALERT my_alert</code></p>
        </div>
        <p className="mt-2 text-slate-500">Monitor via: <code className="bg-slate-100 px-1 rounded">INFORMATION_SCHEMA.ALERT_HISTORY</code> or <code className="bg-slate-100 px-1 rounded">ACCOUNT_USAGE.ALERT_HISTORY</code></p>
      </div>
    </div>

    <CodeBlock code={`-- Scheduled alert (virtual warehouse)
CREATE OR REPLACE ALERT spend_alert
  WAREHOUSE = monitor_wh
  SCHEDULE = '30 MINUTE'
  IF (EXISTS (
    SELECT 1 FROM ACCOUNT_USAGE.WAREHOUSE_METERING_HISTORY
    WHERE credits_used > 100
  ))
  THEN CALL SYSTEM$SEND_EMAIL(
    'my_email_int',
    'dba@company.com',
    'Credit Alert',
    'Warehouse credits exceeded threshold'
  );

-- Alert is SUSPENDED by default — must resume
ALTER ALERT spend_alert RESUME;

-- Serverless alert on new data (no WAREHOUSE, no SCHEDULE)
CREATE OR REPLACE ALERT error_alert
  IF (EXISTS (
    SELECT * FROM my_events WHERE record_type = 'EVENT' AND value:state = 'ERROR'
  ))
  THEN CALL notify_on_error();`} />

    <ExamTip>
      <p>• Newly created alerts are <strong>SUSPENDED by default</strong> — you must run <code>ALTER ALERT … RESUME</code>.</p>
      <p>• <code>EXECUTE ALERT</code> privilege can only be granted by a user with the ACCOUNTADMIN role.</p>
      <p>• Serverless alerts require the separate <code>EXECUTE MANAGED ALERT</code> privilege.</p>
      <p>• Alert on new data cannot use CTEs, JOINs, or stored procedure calls in the condition.</p>
      <p>• Use <code>SCHEDULED_TIME()</code> and <code>LAST_SUCCESSFUL_SCHEDULED_TIME()</code> functions inside alert bodies for schedule-aware time ranges.</p>
    </ExamTip>
  </div>
);

const NotificationsContent = () => (
  <div className="space-y-4 text-xs">
    <div className="bg-violet-50 border border-violet-200 rounded-xl p-3">
      <p className="font-bold text-violet-800 mb-1">Notification Integration</p>
      <p className="text-slate-600">A Snowflake object (<code className="bg-violet-100 px-1 rounded">NOTIFICATION INTEGRATION</code>) that acts as the bridge between Snowflake and an external messaging channel. Required before sending any notification.</p>
    </div>

    <div className="grid sm:grid-cols-3 gap-3">
      <div className="bg-white border border-slate-200 rounded-xl p-3">
        <p className="font-bold text-violet-700 mb-2">Email (TYPE=EMAIL)</p>
        <ul className="space-y-1 text-slate-600 mb-2">
          <li>• Recipients must be Snowflake users in the same account</li>
          <li>• Email addresses must be <strong>verified</strong> before use</li>
          <li>• Sent via AWS SES — content retained up to <strong>30 days</strong></li>
          <li>• Supports <code className="bg-slate-100 px-1 rounded">ALLOWED_RECIPIENTS</code>, <code className="bg-slate-100 px-1 rounded">DEFAULT_RECIPIENTS</code>, <code className="bg-slate-100 px-1 rounded">DEFAULT_SUBJECT</code></li>
        </ul>
        <CodeBlock code={`CREATE NOTIFICATION INTEGRATION my_email_int
  TYPE = EMAIL
  ENABLED = TRUE
  ALLOWED_RECIPIENTS = ('dba@co.com');`} />
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-3">
        <p className="font-bold text-violet-700 mb-2">Webhook (TYPE=WEBHOOK)</p>
        <ul className="space-y-1 text-slate-600 mb-2">
          <li>• Supported targets: <strong>Slack</strong>, <strong>Microsoft Teams</strong>, <strong>PagerDuty</strong> only</li>
          <li>• Secret stored as a Snowflake SECRET object</li>
          <li>• Uses <code className="bg-slate-100 px-1 rounded">WEBHOOK_URL</code>, <code className="bg-slate-100 px-1 rounded">WEBHOOK_SECRET</code>, <code className="bg-slate-100 px-1 rounded">WEBHOOK_BODY_TEMPLATE</code></li>
          <li>• Placeholder: <code className="bg-slate-100 px-1 rounded">SNOWFLAKE_WEBHOOK_MESSAGE</code> in template</li>
        </ul>
        <CodeBlock code={`CREATE OR REPLACE SECRET slack_secret
  TYPE = GENERIC_STRING
  SECRET_STRING = 'T00.../B00.../XXX';

CREATE NOTIFICATION INTEGRATION slack_int
  TYPE = WEBHOOK  ENABLED = TRUE
  WEBHOOK_URL = 'https://hooks.slack.com/services/SNOWFLAKE_WEBHOOK_SECRET'
  WEBHOOK_SECRET = mydb.mysch.slack_secret
  WEBHOOK_BODY_TEMPLATE = '{"text":"SNOWFLAKE_WEBHOOK_MESSAGE"}'
  WEBHOOK_HEADERS = ('Content-Type'='application/json');`} />
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-3">
        <p className="font-bold text-violet-700 mb-2">Queue (TYPE=QUEUE)</p>
        <ul className="space-y-1 text-slate-600 mb-2">
          <li>• Sends to cloud message queues</li>
          <li>• <strong>AWS SNS</strong> — account must be on AWS</li>
          <li>• <strong>Azure Event Grid</strong> — account must be on Azure</li>
          <li>• <strong>GCP Pub/Sub</strong> — account must be on GCP</li>
          <li>• Cloud platform of account must match queue cloud</li>
        </ul>
        <p className="text-slate-500 mt-2">Used by: Snowpipe error notifications, task failure handlers, alerts.</p>
      </div>
    </div>

    <div className="bg-white border border-slate-200 rounded-xl p-3">
      <p className="font-bold text-slate-700 mb-2">Sending Notifications: Two Stored Procedures</p>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <p className="font-semibold text-violet-700 mb-1">SYSTEM$SEND_SNOWFLAKE_NOTIFICATION</p>
          <ul className="space-y-1 text-slate-600">
            <li>• Newer, unified procedure</li>
            <li>• Single call can send to <strong>multiple destinations</strong> (email + webhook + queue simultaneously)</li>
            <li>• Supports HTML, plain text, JSON formats</li>
            <li>• Helper functions: <code className="bg-slate-100 px-1 rounded">TEXT_HTML()</code>, <code className="bg-slate-100 px-1 rounded">TEXT_PLAIN()</code>, <code className="bg-slate-100 px-1 rounded">APPLICATION_JSON()</code></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-violet-700 mb-1">SYSTEM$SEND_EMAIL</p>
          <ul className="space-y-1 text-slate-600">
            <li>• Older, email-only procedure</li>
            <li>• Simpler syntax: integration name + recipients + subject + body</li>
            <li>• Still widely used in alerts and tasks</li>
          </ul>
        </div>
      </div>
      <CodeBlock code={`-- Using SYSTEM$SEND_SNOWFLAKE_NOTIFICATION (multi-destination)
CALL SYSTEM$SEND_SNOWFLAKE_NOTIFICATION(
  SNOWFLAKE.NOTIFICATION.TEXT_HTML('<p>Alert triggered</p>'),
  ARRAY_CONSTRUCT(
    SNOWFLAKE.NOTIFICATION.INTEGRATION('my_email_int'),
    SNOWFLAKE.NOTIFICATION.INTEGRATION('slack_int')
  )
);

-- Using SYSTEM$SEND_EMAIL (simple email)
CALL SYSTEM$SEND_EMAIL(
  'my_email_int',
  'dba@company.com',
  'Task completed',
  'Pipeline finished successfully.'
);`} />
    </div>

    <ExamTip>
      <p>• Email notification recipients must be Snowflake users with <strong>verified email addresses</strong> in the same account.</p>
      <p>• Webhook integrations support only <strong>Slack, Microsoft Teams, and PagerDuty</strong> — no other external systems.</p>
      <p>• Email content is processed through AWS SES and may be retained by Snowflake for up to <strong>30 days</strong>.</p>
      <p>• The cloud platform of your Snowflake account must match the cloud provider of the queue (SNS → AWS, Event Grid → Azure, Pub/Sub → GCP).</p>
      <p>• <code>SYSTEM$SEND_SNOWFLAKE_NOTIFICATION</code> can send to multiple integration types in a single call; <code>SYSTEM$SEND_EMAIL</code> is email-only.</p>
    </ExamTip>
  </div>
);

const ReplicationContent = () => {
  const [openRow, setOpenRow] = useState(null);
  return (
    <div className="space-y-4 text-xs">
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-3">
          <p className="font-bold text-violet-800 mb-1">Replication Group</p>
          <ul className="space-y-1 text-slate-600">
            <li>• Defined collection of objects replicated as a unit</li>
            <li>• Secondary group provides <strong>read-only</strong> access</li>
            <li>• Cannot fail over — for read replicas only</li>
            <li>• DB + share replication available to <strong>all editions</strong></li>
            <li>• Other account objects require <strong>Business Critical+</strong></li>
          </ul>
        </div>
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-3">
          <p className="font-bold text-violet-800 mb-1">Failover Group</p>
          <ul className="space-y-1 text-slate-600">
            <li>• A replication group that can also <strong>fail over</strong></li>
            <li>• Secondary is read-only until promoted to primary</li>
            <li>• Promotion gives full read-write access</li>
            <li>• Requires <strong>Business Critical Edition</strong></li>
            <li>• Supports cross-region and cross-cloud failover</li>
          </ul>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-3">
        <p className="font-bold text-slate-700 mb-2">Edition Matrix</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left p-2 border border-slate-200 text-slate-600">Feature</th>
                <th className="text-center p-2 border border-slate-200 text-slate-600">Standard</th>
                <th className="text-center p-2 border border-slate-200 text-slate-600">Enterprise</th>
                <th className="text-center p-2 border border-slate-200 text-slate-600">Business Critical</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Database & Share replication', '✅', '✅', '✅'],
                ['Replication Group (any object)', '✅', '✅', '✅'],
                ['Account-object replication', '✅', '✅', '✅'],
                ['Failover Group', '❌', '❌', '✅'],
                ['Tri-Secret Secure data replication', '❌', '❌', '✅'],
              ].map(([feat, s, e, bc]) => (
                <tr key={feat} className="hover:bg-slate-50">
                  <td className="p-2 border border-slate-200 text-slate-700">{feat}</td>
                  <td className="p-2 border border-slate-200 text-center">{s}</td>
                  <td className="p-2 border border-slate-200 text-center">{e}</td>
                  <td className="p-2 border border-slate-200 text-center">{bc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-3">
        <p className="font-bold text-slate-700 mb-2">Replicated Objects (click to expand)</p>
        <div className="space-y-1">
          {REPLICATED_OBJECTS.map((obj, i) => (
            <div key={obj.name} className="border border-slate-100 rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenRow(openRow === i ? null : i)}
                className="w-full flex items-center justify-between p-2 text-left hover:bg-slate-50"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700">{obj.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${obj.edition === 'All editions' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{obj.edition}</span>
                </div>
                <ChevronRight size={14} className={`text-slate-400 transition-transform ${openRow === i ? 'rotate-90' : ''}`} />
              </button>
              {openRow === i && (
                <div className="px-3 pb-2 text-slate-500">{obj.notes}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-3">
        <p className="font-bold text-slate-700 mb-2">Failover Workflow</p>
        <div className="flex flex-wrap gap-2 items-center text-slate-600">
          {['1. Enable replication in source account', '2. Create primary failover group', '3. Create secondary in target account', '4. Schedule refreshes (REPLICATION_SCHEDULE)', '5. Failover: promote secondary (ALTER FAILOVER GROUP … PRIMARY)'].map((step, i, arr) => (
            <React.Fragment key={step}>
              <span className="bg-violet-50 border border-violet-200 rounded-lg px-2 py-1 text-xs">{step}</span>
              {i < arr.length - 1 && <span className="text-violet-400 font-bold">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <CodeBlock code={`-- Create a replication group (primary account)
CREATE REPLICATION GROUP myrg
  OBJECT_TYPES = DATABASES, ROLES, USERS, WAREHOUSES
  ALLOWED_DATABASES = prod_db
  ALLOWED_ACCOUNTS = myorg.secondary_acct
  REPLICATION_SCHEDULE = '10 MINUTE';

-- Create the secondary group (run on secondary account)
CREATE REPLICATION GROUP myrg
  AS REPLICA OF myorg.primary_acct.myrg;

-- Refresh manually
ALTER REPLICATION GROUP myrg REFRESH;

-- Create a failover group (primary account) — Business Critical+
CREATE FAILOVER GROUP myfg
  OBJECT_TYPES = DATABASES, ROLES
  ALLOWED_DATABASES = prod_db
  ALLOWED_ACCOUNTS = myorg.dr_acct
  REPLICATION_SCHEDULE = '5 MINUTE';

-- Promote secondary to primary (run on secondary/DR account)
ALTER FAILOVER GROUP myfg PRIMARY;

-- Resume scheduled replication after failover (target account)
ALTER FAILOVER GROUP myfg RESUME;`} />

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
        <p className="font-bold text-slate-700 mb-2">Key Caveats</p>
        <div className="grid sm:grid-cols-2 gap-3 text-slate-600">
          <ul className="space-y-1">
            <li>• Secondary objects are <strong>read-only</strong> until promoted</li>
            <li>• Time Travel history is <strong>not replicated</strong></li>
            <li>• Event tables are <strong>not replicated</strong></li>
            <li>• External tables are <strong>not replicated</strong></li>
          </ul>
          <ul className="space-y-1">
            <li>• REPLICATE and FAILOVER privileges are <strong>not replicated</strong> — grant separately in target</li>
            <li>• Dangling references (e.g., network policy referencing unreplicated DB) will fail refresh</li>
            <li>• Replication is asynchronous — secondary may lag</li>
            <li>• Object can only be in one failover group</li>
          </ul>
        </div>
      </div>

      <ExamTip>
        <p>• Failover Groups require <strong>Business Critical Edition</strong>; Replication Groups are available to all editions for DB + share.</p>
        <p>• Secondary objects are <strong>read-only</strong> until you promote the secondary to primary.</p>
        <p>• <code>REPLICATE</code> and <code>FAILOVER</code> privileges are NOT replicated — you must grant them in both source and target accounts.</p>
        <p>• Dangling references cause refresh failures — always include dependent databases (network rules, policy DBs) in the same or a preceding group.</p>
        <p>• After failover, resume scheduled replication with <code>ALTER FAILOVER GROUP … RESUME</code> in each target account.</p>
      </ExamTip>
    </div>
  );
};

const LineageContent = () => (
  <div className="space-y-4 text-xs">
    <div className="grid sm:grid-cols-2 gap-3">
      <div className="bg-violet-50 border border-violet-200 rounded-xl p-3">
        <p className="font-bold text-violet-800 mb-1">What Lineage Captures</p>
        <p className="text-slate-600 mb-2">Two relationship types:</p>
        <div className="space-y-2">
          <div>
            <p className="font-semibold text-slate-700">Data Movement</p>
            <p className="text-slate-600">Data physically copied or materialized: <code className="bg-violet-100 px-1 rounded">CTAS</code>, <code className="bg-violet-100 px-1 rounded">INSERT … SELECT</code>, <code className="bg-violet-100 px-1 rounded">MERGE</code>, <code className="bg-violet-100 px-1 rounded">COPY INTO</code>, <code className="bg-violet-100 px-1 rounded">UPDATE … FROM</code></p>
          </div>
          <div>
            <p className="font-semibold text-slate-700">Object Dependencies</p>
            <p className="text-slate-600">Object references without copying data: <code className="bg-violet-100 px-1 rounded">CREATE VIEW</code>, <code className="bg-violet-100 px-1 rounded">CREATE MATERIALIZED VIEW</code></p>
          </div>
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-3">
        <p className="font-bold text-slate-700 mb-2">Upstream vs Downstream</p>
        <div className="flex flex-col items-center gap-2 my-2">
          <div className="bg-slate-100 rounded-lg px-3 py-1.5 font-semibold text-slate-700">source_table</div>
          <div className="flex items-center gap-2 text-slate-500">
            <span className="text-xs">upstream</span>
            <span className="text-violet-500 font-bold">↑ ↓</span>
            <span className="text-xs">downstream</span>
          </div>
          <div className="bg-violet-100 rounded-lg px-3 py-1.5 font-semibold text-violet-800">target_table</div>
        </div>
        <p className="text-slate-500 text-center">source_table is <strong>upstream</strong> of target_table; target_table is <strong>downstream</strong> of source_table</p>
        <p className="mt-2 text-slate-600">Snowsight reveals lineage one step at a time upstream or downstream from any selected object.</p>
      </div>
    </div>

    <div className="bg-white border border-slate-200 rounded-xl p-3">
      <p className="font-bold text-slate-700 mb-2">Supported Objects</p>
      <div className="flex flex-wrap gap-2">
        {['Tables', 'Views', 'Materialized Views', 'Semantic Views', 'Dynamic Tables', 'External Tables', 'Iceberg Tables', 'Stages', 'Datasets (ML)', 'Feature Views (ML)', 'Models (ML)'].map(o => (
          <span key={o} className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-xs">{o}</span>
        ))}
      </div>
      <p className="mt-2 text-slate-500">Note: Temporary tables, objects in shared databases, and INFORMATION_SCHEMA objects are <strong>not</strong> shown in lineage.</p>
    </div>

    <div className="grid sm:grid-cols-3 gap-3">
      <div className="bg-white border border-slate-200 rounded-xl p-3">
        <p className="font-bold text-slate-700 mb-1">Snowsight Visual Lineage</p>
        <ul className="space-y-1 text-slate-600">
          <li>• Interactive graph in <strong>Catalog » Database Explorer</strong></li>
          <li>• Column-level lineage: trace individual columns upstream/downstream</li>
          <li>• Identify missing tags and masking policies across lineage</li>
          <li>• Select connecting arrows to see the SQL that created the relationship</li>
          <li>• Requires Enterprise Edition+</li>
        </ul>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-3">
        <p className="font-bold text-slate-700 mb-1">Programmatic Access</p>
        <ul className="space-y-1 text-slate-600">
          <li>• <code className="bg-slate-100 px-1 rounded">GET_LINEAGE (SNOWFLAKE.CORE)</code> — function returning lineage data</li>
          <li>• <code className="bg-slate-100 px-1 rounded">ACCOUNT_USAGE.OBJECT_DEPENDENCIES</code> — SQL-queryable view of all dependencies</li>
        </ul>
        <CodeBlock code={`-- Query object dependencies
SELECT *
FROM ACCOUNT_USAGE.OBJECT_DEPENDENCIES
WHERE REFERENCING_OBJECT_NAME = 'MY_VIEW'
ORDER BY DEPENDENCY_TYPE;`} />
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-3">
        <p className="font-bold text-slate-700 mb-1">External Lineage</p>
        <ul className="space-y-1 text-slate-600">
          <li>• Extends lineage to <strong>external ETL tools</strong> (dbt, Airflow)</li>
          <li>• Uses the <strong>OpenLineage</strong> open standard</li>
          <li>• Tools send COMPLETE events via Snowflake REST endpoint</li>
          <li>• Appears in Snowsight lineage graph as "external nodes"</li>
          <li>• Requires <code className="bg-slate-100 px-1 rounded">INGEST LINEAGE</code> privilege on account</li>
        </ul>
      </div>
    </div>

    <div className="bg-white border border-slate-200 rounded-xl p-3">
      <p className="font-bold text-slate-700 mb-2">Access Control & Retention</p>
      <div className="grid sm:grid-cols-2 gap-3 text-slate-600">
        <div>
          <p className="font-semibold text-slate-700 mb-1">Privileges Required</p>
          <ul className="space-y-1">
            <li>• <code className="bg-slate-100 px-1 rounded">VIEW LINEAGE</code> on account — granted to <strong>PUBLIC</strong> by default</li>
            <li>• Any privilege on the objects (e.g., SELECT on a table)</li>
            <li>• <code className="bg-slate-100 px-1 rounded">USAGE</code> on the database and schema</li>
            <li>• <code className="bg-slate-100 px-1 rounded">RESOLVE ALL</code> on account — see full lineage of all objects regardless of other privileges</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-slate-700 mb-1">Retention</p>
          <ul className="space-y-1">
            <li>• Column lineage: retained for <strong>1 year</strong></li>
            <li>• Object lineage: retained for <strong>1 year</strong></li>
            <li>• External lineage events: retained for <strong>1 year</strong></li>
            <li>• Data movement lineage only available from November 2024 onward</li>
            <li>• Object dependency lineage available for objects created before that date</li>
          </ul>
        </div>
      </div>
    </div>

    <ExamTip>
      <p>• Data Lineage requires <strong>Enterprise Edition or higher</strong>.</p>
      <p>• <code>VIEW LINEAGE</code> privilege is granted to the <strong>PUBLIC</strong> role by default — everyone can view lineage.</p>
      <p>• Column-level lineage is <strong>not supported for semantic views</strong>.</p>
      <p>• External lineage uses the <strong>OpenLineage</strong> standard via a Snowflake REST endpoint — supports dbt and Apache Airflow.</p>
      <p>• Object and column lineage is retained for <strong>1 year</strong>. Historical data movement lineage is only available from November 2024 onward.</p>
    </ExamTip>
  </div>
);

const OtherFeaturesSection = () => {
  const [activeOtherTab, setActiveOtherTab] = useState('alerts');
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {OTHER_FEATURE_TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveOtherTab(t.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              activeOtherTab === t.id
                ? 'bg-violet-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-violet-50 hover:text-violet-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {activeOtherTab === 'alerts'      && <AlertsContent />}
      {activeOtherTab === 'notifs'      && <NotificationsContent />}
      {activeOtherTab === 'replication' && <ReplicationContent />}
      {activeOtherTab === 'lineage'     && <LineageContent />}
    </div>
  );
};

// ── Main GovernanceTab component ──────────────────────────────────────────────
const GovernanceTab = () => {
  const [activeSection, setActiveSection] = useState('masking');

  return (
    <div className="space-y-5">
      <InfoCard>
        <SectionHeader
          icon={Eye}
          color="bg-violet-700"
          title="2.2 Data Governance Features"
          subtitle="Masking · Object tagging · Privacy policies · Trust Center · Encryption · More"
        />

        {/* Sub-section pill navigation */}
        <div className="flex flex-wrap gap-2 mb-5">
          {GOV_SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                activeSection === s.id
                  ? 'bg-violet-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-violet-50 hover:text-violet-700'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {activeSection === 'masking'    && <DataMaskingSection />}
        {activeSection === 'tagging'    && <ObjectTaggingSection />}
        {activeSection === 'privacy'    && <PrivacyPoliciesSection />}
        {activeSection === 'trust'      && <TrustCenterSection />}
        {activeSection === 'encryption' && <EncryptionKeysSection />}
        {activeSection === 'other'      && <OtherFeaturesSection />}
      </InfoCard>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// LEARNING TAB 3 — 2.3 Monitoring & Cost Management
// Covers: Resource Monitors, calculating VW credit usage, ACCOUNT_USAGE schema
// ═══════════════════════════════════════════════════════════════════════════════

const MONITORING_TABS = [
  { id: 'rm',      label: '📊 Resource Monitors' },
  { id: 'credits', label: '💳 Credit Usage' },
  { id: 'au',      label: '🗂️ ACCOUNT_USAGE' },
];

const CREDIT_SIZES = [
  { size: 'XS',  credits: 1,   note: 'Baseline — 1 credit/hr' },
  { size: 'S',   credits: 2,   note: '2× XS' },
  { size: 'M',   credits: 4,   note: '2× S' },
  { size: 'L',   credits: 8,   note: '2× M' },
  { size: 'XL',  credits: 16,  note: '2× L' },
  { size: '2XL', credits: 32,  note: '2× XL' },
  { size: '3XL', credits: 64,  note: '2× 2XL' },
  { size: '4XL', credits: 128, note: '2× 3XL' },
];

const USAGE_VIEWS = [
  { view: 'QUERY_HISTORY',             latency: '45 min', category: 'Compute',    dbRole: 'GOVERNANCE_VIEWER', desc: 'All queries executed — status, execution time, credits, user, warehouse, bytes scanned.' },
  { view: 'WAREHOUSE_METERING_HISTORY',latency: '3 hrs',  category: 'Compute',    dbRole: 'USAGE_VIEWER',      desc: 'Credit consumption per warehouse per hour.' },
  { view: 'METERING_HISTORY',          latency: '3 hrs',  category: 'Compute',    dbRole: 'USAGE_VIEWER',      desc: 'All metering (warehouse + serverless + cloud services) per day.' },
  { view: 'STORAGE_USAGE',             latency: '2 hrs',  category: 'Storage',    dbRole: 'USAGE_VIEWER',      desc: 'Daily storage consumption — data, stage, and fail-safe bytes.' },
  { view: 'DATABASE_STORAGE_USAGE_HISTORY', latency: '3 hrs', category: 'Storage', dbRole: 'USAGE_VIEWER',    desc: 'Per-database storage usage over time.' },
  { view: 'LOGIN_HISTORY',             latency: '2 hrs',  category: 'Security',   dbRole: 'SECURITY_VIEWER',   desc: 'All login attempts — success/failure, client type, authentication method.' },
  { view: 'ACCESS_HISTORY',            latency: '3 hrs',  category: 'Governance', dbRole: 'GOVERNANCE_VIEWER', desc: 'What data objects each query read/wrote — key view for data access auditing. Enterprise Edition+.' },
  { view: 'GRANTS_TO_ROLES',           latency: '2 hrs',  category: 'Security',   dbRole: 'SECURITY_VIEWER',   desc: 'All privileges granted to roles — use for access control auditing.' },
  { view: 'GRANTS_TO_USERS',           latency: '2 hrs',  category: 'Security',   dbRole: 'SECURITY_VIEWER',   desc: 'All roles granted to users.' },
  { view: 'COPY_HISTORY',              latency: '2 hrs',  category: 'Load',       dbRole: 'USAGE_VIEWER',      desc: 'History of COPY INTO and Snowpipe load jobs.' },
  { view: 'TASK_HISTORY',              latency: '45 min', category: 'Compute',    dbRole: 'USAGE_VIEWER',      desc: 'Execution records for Tasks — status, error message, scheduled time.' },
  { view: 'TAG_REFERENCES',            latency: '2 hrs',  category: 'Governance', dbRole: 'GOVERNANCE_VIEWER', desc: 'All objects with tags applied — tag name, value, object type.' },
  { view: 'ALERT_HISTORY',             latency: '3 hrs',  category: 'Compute',    dbRole: 'USAGE_VIEWER',      desc: 'Execution history of all alerts — scheduled time, state, error message.' },
  { view: 'REPLICATION_GROUP_REFRESH_HISTORY', latency: '3 hrs', category: 'Governance', dbRole: 'USAGE_VIEWER', desc: 'History of replication group refresh operations.' },
  { view: 'OBJECT_DEPENDENCIES',       latency: '3 hrs',  category: 'Governance', dbRole: 'OBJECT_VIEWER',     desc: 'All object dependency relationships — used for data lineage queries.' },
];

const RM_ACTIONS = [
  { action: 'NOTIFY', trigger: 'Any %', color: 'bg-blue-50 border-blue-200 text-blue-800', desc: 'Send email notification to account admins (and opted-in non-admin users for warehouse monitors). No warehouse action.' },
  { action: 'NOTIFY & SUSPEND', trigger: 'Any %', color: 'bg-amber-50 border-amber-200 text-amber-800', desc: 'Send notification and suspend all assigned warehouses after current statements finish executing.' },
  { action: 'NOTIFY & SUSPEND IMMEDIATELY', trigger: 'Any %', color: 'bg-red-50 border-red-200 text-red-800', desc: 'Send notification and immediately cancel all running queries, then suspend warehouses.' },
];

const ResourceMonitorContent = () => (
  <div className="space-y-4 text-xs">
    <div className="grid sm:grid-cols-2 gap-3">
      <div className="bg-violet-50 border border-violet-200 rounded-xl p-3">
        <p className="font-bold text-violet-800 mb-1">What is a Resource Monitor?</p>
        <p className="text-slate-600 mb-2">A first-class Snowflake object that tracks credit consumption for virtual warehouses and triggers actions when usage reaches defined thresholds.</p>
        <ul className="space-y-1 text-slate-600">
          <li>• Only users with <strong>ACCOUNTADMIN</strong> role can create resource monitors</li>
          <li>• Can be used at <strong>account level</strong> (all warehouses) or <strong>warehouse level</strong> (specific warehouses)</li>
          <li>• One account can only have <strong>one account-level</strong> monitor</li>
          <li>• A warehouse can be assigned to <strong>only one</strong> warehouse-level monitor</li>
          <li>• Does <strong>not</strong> track serverless features, AI services, or storage</li>
        </ul>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-3">
        <p className="font-bold text-slate-700 mb-2">Monitor Properties</p>
        <div className="space-y-2 text-slate-600">
          <div>
            <p className="font-semibold text-slate-700">Credit Quota</p>
            <p>Number of credits allocated for the monitoring interval. Resets at the start of each interval.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-700">Schedule / Frequency</p>
            <p>Options: <code className="bg-slate-100 px-1 rounded">DAILY</code>, <code className="bg-slate-100 px-1 rounded">WEEKLY</code>, <code className="bg-slate-100 px-1 rounded">MONTHLY</code>, <code className="bg-slate-100 px-1 rounded">YEARLY</code>, <code className="bg-slate-100 px-1 rounded">NEVER</code> (no reset). Default: resets at start of each calendar month.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-700">Start / End Timestamp</p>
            <p>Optional. If end is set, warehouses are suspended at that time regardless of quota usage.</p>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white border border-slate-200 rounded-xl p-3">
      <p className="font-bold text-slate-700 mb-2">Threshold Actions (Triggers)</p>
      <p className="text-slate-500 mb-2">Each monitor can have: 1 Suspend, 1 Suspend Immediate, and up to 5 Notify actions. Thresholds can exceed 100%.</p>
      <div className="space-y-2">
        {RM_ACTIONS.map(a => (
          <div key={a.action} className={`border rounded-xl p-3 ${a.color}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-xs">{a.action}</span>
            </div>
            <p className="text-xs opacity-80">{a.desc}</p>
          </div>
        ))}
      </div>
      <p className="mt-2 text-slate-500">Notifications require users to enable them in Snowsight (Admin profile). Non-admins can only receive notifications for <strong>warehouse monitors</strong>, not account monitors.</p>
    </div>

    <div className="bg-white border border-slate-200 rounded-xl p-3">
      <p className="font-bold text-slate-700 mb-2">Assignment Rules & Suspension Resumption</p>
      <div className="grid sm:grid-cols-2 gap-3 text-slate-600">
        <ul className="space-y-1">
          <li>• Account monitor + warehouse monitor can both apply to a warehouse simultaneously</li>
          <li>• Warehouse is suspended when <strong>either</strong> monitor's threshold is reached</li>
          <li>• A suspended warehouse cannot be resumed until: next interval starts, quota is increased, threshold is raised, warehouse is removed from monitor, or monitor is dropped</li>
        </ul>
        <ul className="space-y-1">
          <li>• Max <strong>500 warehouses</strong> per resource monitor</li>
          <li>• <code className="bg-slate-100 px-1 rounded">MODIFY</code> privilege allows changing quota/schedule/actions</li>
          <li>• <code className="bg-slate-100 px-1 rounded">MONITOR</code> privilege allows viewing the monitor</li>
          <li>• Changing monitor type (account ↔ warehouse) requires ACCOUNTADMIN</li>
          <li>• Cannot revert a customized schedule back to default — must drop and recreate</li>
        </ul>
      </div>
    </div>

    <div className="bg-white border border-slate-200 rounded-xl p-3">
      <p className="font-bold text-slate-700 mb-2">Warehouse Cost Controls (beyond resource monitors)</p>
      <div className="grid sm:grid-cols-2 gap-2 text-slate-600">
        {[
          { name: 'AUTO_SUSPEND', desc: 'Auto-suspends idle warehouse. Enabled by default. Suspended = no credits.' },
          { name: 'AUTO_RESUME', desc: 'Auto-starts when queries arrive. Should always pair with AUTO_SUSPEND.' },
          { name: 'STATEMENT_TIMEOUT_IN_SECONDS', desc: 'Cancels runaway queries. Set at account, user, session, or warehouse level.' },
          { name: 'STATEMENT_QUEUED_TIMEOUT_IN_SECONDS', desc: 'Cancels stale queued queries before they run (no credits wasted).' },
        ].map(c => (
          <div key={c.name} className="bg-slate-50 border border-slate-200 rounded-lg p-2">
            <p className="font-mono font-bold text-violet-700 text-xs mb-0.5">{c.name}</p>
            <p className="text-xs text-slate-600">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>

    <CodeBlock code={`-- Create a resource monitor (ACCOUNTADMIN only)
USE ROLE ACCOUNTADMIN;

CREATE OR REPLACE RESOURCE MONITOR monthly_cap
  WITH CREDIT_QUOTA = 500
  FREQUENCY = MONTHLY
  START_TIMESTAMP = IMMEDIATELY
  TRIGGERS
    ON 75 PERCENT DO NOTIFY
    ON 90 PERCENT DO NOTIFY
    ON 100 PERCENT DO SUSPEND
    ON 110 PERCENT DO SUSPEND_IMMEDIATE;

-- Assign to a specific warehouse
ALTER WAREHOUSE analytics_wh SET RESOURCE_MONITOR = monthly_cap;

-- Set account-level resource monitor
ALTER ACCOUNT SET RESOURCE_MONITOR = monthly_cap;

-- Remove from warehouse
ALTER WAREHOUSE analytics_wh UNSET RESOURCE_MONITOR;

-- Add non-admin email notification recipients (warehouse monitors only)
ALTER RESOURCE MONITOR monthly_cap SET NOTIFY_USERS = (analyst_user, data_eng);

-- Modify quota
ALTER RESOURCE MONITOR monthly_cap SET CREDIT_QUOTA = 750;

-- Find warehouses without a resource monitor
SHOW WAREHOUSES
  ->> SELECT "name" AS warehouse_name FROM $1 WHERE "resource_monitor" = 'null';`} />

    <ExamTip>
      <p>• Resource monitors only track <strong>virtual warehouse credits</strong> — not serverless, AI services, or storage.</p>
      <p>• Only <strong>ACCOUNTADMIN</strong> can create resource monitors and assign them to accounts or warehouses.</p>
      <p>• Non-admin users can only receive notifications for <strong>warehouse monitors</strong>, not account monitors.</p>
      <p>• A warehouse is suspended when <strong>either</strong> its warehouse monitor or the account monitor triggers a suspend action — whichever is reached first.</p>
      <p>• Thresholds support values <strong>over 100%</strong> — useful for "warn at 100%, kill at 110%" patterns.</p>
    </ExamTip>
  </div>
);

const CreditUsageContent = () => (
  <div className="space-y-4 text-xs">
    <div className="grid sm:grid-cols-2 gap-3">
      <div className="bg-violet-50 border border-violet-200 rounded-xl p-3">
        <p className="font-bold text-violet-800 mb-1">Virtual Warehouse Credit Usage</p>
        <ul className="space-y-1 text-slate-600">
          <li>• Charged <strong>per second</strong> while warehouse is running</li>
          <li>• <strong>60-second minimum</strong> each time warehouse starts or resizes up</li>
          <li>• Suspended warehouses consume <strong>zero credits</strong></li>
          <li>• Each size up <strong>doubles</strong> the credit/hour rate</li>
          <li>• Resizing down: billed for new + old resources briefly during quiesce</li>
        </ul>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-3">
        <p className="font-bold text-slate-700 mb-2">Types of Compute Costs</p>
        <div className="space-y-2 text-slate-600">
          <div className="flex items-start gap-2">
            <span className="font-semibold text-violet-700 min-w-[120px]">Virtual WH</span>
            <span>User-managed; you control size and duration. Billed per second.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-semibold text-violet-700 min-w-[120px]">Serverless</span>
            <span>Snowflake-managed (Snowpipe, Tasks, Alerts, Auto-clustering). Billed as compute-hours. Cannot use resource monitors.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-semibold text-violet-700 min-w-[120px]">Cloud Services</span>
            <span>Login, compile, optimize, metadata. Billed only if daily usage exceeds <strong>10% of daily VW credits</strong>.</span>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white border border-slate-200 rounded-xl p-3">
      <p className="font-bold text-slate-700 mb-2">Warehouse Size → Credits per Hour</p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-violet-50">
              <th className="text-left p-2 border border-violet-200 font-bold text-violet-700">Size</th>
              <th className="text-left p-2 border border-violet-200 font-bold text-violet-700">Credits/hr</th>
              <th className="text-left p-2 border border-violet-200 font-bold text-violet-700">Credits/sec</th>
              <th className="text-left p-2 border border-violet-200 font-bold text-violet-700">Ratio</th>
            </tr>
          </thead>
          <tbody>
            {CREDIT_SIZES.map((row, i) => (
              <tr key={row.size} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td className="p-2 border border-slate-200 font-mono font-bold text-violet-700">{row.size}</td>
                <td className="p-2 border border-slate-200 font-semibold">{row.credits}</td>
                <td className="p-2 border border-slate-200 text-slate-500">{(row.credits / 3600).toFixed(5)}</td>
                <td className="p-2 border border-slate-200 text-slate-400 text-xs">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-slate-500">Multi-cluster warehouses: multiply per-cluster credits by number of active clusters. Resizing incurs a 1-minute charge for added resources.</p>
    </div>

    <div className="bg-white border border-slate-200 rounded-xl p-3">
      <p className="font-bold text-slate-700 mb-2">Cloud Services 10% Adjustment</p>
      <p className="text-slate-600 mb-2">Cloud services (query compilation, metadata, login) are only billed if their daily consumption exceeds <strong>10% of daily virtual warehouse credits</strong>.</p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <th className="p-2 border border-slate-200 text-slate-600 text-left">Date</th>
              <th className="p-2 border border-slate-200 text-slate-600 text-right">VW Credits</th>
              <th className="p-2 border border-slate-200 text-slate-600 text-right">CS Credits</th>
              <th className="p-2 border border-slate-200 text-slate-600 text-right">CS Adjustment</th>
              <th className="p-2 border border-slate-200 text-slate-600 text-right">Billed</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Nov 1', 100, 20, -10, 110],
              ['Nov 2', 120, 10, -10, 120],
              ['Nov 3', 80,  5,  -5,  80],
              ['Nov 4', 100, 13, -10, 103],
            ].map(([d, vw, cs, adj, billed]) => (
              <tr key={d} className="hover:bg-slate-50">
                <td className="p-2 border border-slate-200">{d}</td>
                <td className="p-2 border border-slate-200 text-right">{vw}</td>
                <td className="p-2 border border-slate-200 text-right">{cs}</td>
                <td className="p-2 border border-slate-200 text-right text-red-600">{adj}</td>
                <td className="p-2 border border-slate-200 text-right font-semibold">{billed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-1 text-slate-500">Adjustment = lesser of (10% × VW credits) or actual CS credits. Calculated daily in UTC.</p>
    </div>

    <div className="bg-white border border-slate-200 rounded-xl p-3">
      <p className="font-bold text-slate-700 mb-2">Billing Key Rules</p>
      <div className="grid sm:grid-cols-2 gap-3 text-slate-600">
        <ul className="space-y-1">
          <li>• Warehouses billed for <strong>60-second minimum</strong> per start/resume</li>
          <li>• Suspend and resume within 1 minute = multiple 1-minute minimum charges</li>
          <li>• Per-second billing after initial 60 seconds</li>
          <li>• Resizing <strong>up</strong>: 1-minute charge for added resources</li>
        </ul>
        <ul className="space-y-1">
          <li>• Serverless compute: billed as <strong>compute-hours</strong> (auto-sized by Snowflake)</li>
          <li>• Compute pools (Snowpark Container Services): billed per VM node-hour</li>
          <li>• Cloud services: billed only if &gt; 10% of daily VW credits</li>
          <li>• <strong>Serverless does NOT count</strong> toward the 10% adjustment base</li>
        </ul>
      </div>
    </div>

    <ExamTip>
      <p>• Virtual warehouse billing: <strong>60-second minimum</strong>, then per-second. Each size = 2× the credits of the previous size.</p>
      <p>• Cloud services charges apply only if daily cloud services exceed <strong>10% of daily virtual warehouse credits</strong> — calculated in UTC daily.</p>
      <p>• Serverless compute (Snowpipe, Tasks, Alerts, Auto-clustering) is billed as compute-hours and is <strong>NOT controlled by resource monitors</strong>.</p>
      <p>• Suspending a warehouse = zero credit consumption. Auto-suspend + auto-resume is the recommended pattern.</p>
    </ExamTip>
  </div>
);

const AccountUsageContent = () => {
  const [filterCat, setFilterCat] = useState('All');
  const categories = ['All', 'Compute', 'Storage', 'Security', 'Governance', 'Load'];
  const filtered = filterCat === 'All' ? USAGE_VIEWS : USAGE_VIEWS.filter(v => v.category === filterCat);
  const catColors = { Compute: 'bg-blue-100 text-blue-700', Storage: 'bg-emerald-100 text-emerald-700', Security: 'bg-red-100 text-red-700', Governance: 'bg-violet-100 text-violet-700', Load: 'bg-amber-100 text-amber-700' };

  return (
    <div className="space-y-4 text-xs">
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-3">
          <p className="font-bold text-violet-800 mb-1">What is ACCOUNT_USAGE?</p>
          <p className="text-slate-600 mb-2">A schema in the shared <code className="bg-violet-100 px-1 rounded">SNOWFLAKE</code> database containing views for object metadata, usage metrics, and audit history for your account.</p>
          <ul className="space-y-1 text-slate-600">
            <li>• Includes records for <strong>dropped objects</strong></li>
            <li>• Historical data retained for <strong>1 year</strong></li>
            <li>• Latency: 45 min to 3 hours depending on the view</li>
            <li>• Access via <code className="bg-violet-100 px-1 rounded">SNOWFLAKE.ACCOUNT_USAGE.&lt;view&gt;</code></li>
          </ul>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3">
          <p className="font-bold text-slate-700 mb-2">ACCOUNT_USAGE vs INFORMATION_SCHEMA</p>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="p-1.5 border border-slate-200 text-left text-slate-600">Feature</th>
                <th className="p-1.5 border border-slate-200 text-left text-slate-600">ACCOUNT_USAGE</th>
                <th className="p-1.5 border border-slate-200 text-left text-slate-600">INFO_SCHEMA</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Dropped objects', '✅ Included', '❌ No'],
                ['Latency', '45 min–3 hrs', 'None (live)'],
                ['Retention', '1 year', '7 days–6 months'],
                ['Scope', 'Entire account', 'Current DB only'],
              ].map(([f, a, i]) => (
                <tr key={f}>
                  <td className="p-1.5 border border-slate-200 text-slate-600">{f}</td>
                  <td className="p-1.5 border border-slate-200 text-slate-700">{a}</td>
                  <td className="p-1.5 border border-slate-200 text-slate-700">{i}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-3">
        <p className="font-bold text-slate-700 mb-2">Access Control — SNOWFLAKE Database Roles</p>
        <p className="text-slate-500 mb-2">Grant fine-grained access to ACCOUNT_USAGE views using predefined SNOWFLAKE database roles instead of the broad <code className="bg-slate-100 px-1 rounded">IMPORTED PRIVILEGES</code>.</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            { role: 'OBJECT_VIEWER', desc: 'Metadata views: TABLES, COLUMNS, DATABASES, VIEWS, STAGES, etc.' },
            { role: 'USAGE_VIEWER', desc: 'Historical usage: QUERY_HISTORY, WAREHOUSE_METERING_HISTORY, STORAGE_USAGE, TASK_HISTORY, etc.' },
            { role: 'GOVERNANCE_VIEWER', desc: 'Governance views: ACCESS_HISTORY, MASKING_POLICIES, TAG_REFERENCES, PRIVACY_POLICIES, POLICY_REFERENCES, etc.' },
            { role: 'SECURITY_VIEWER', desc: 'Security views: LOGIN_HISTORY, GRANTS_TO_ROLES, GRANTS_TO_USERS, NETWORK_POLICIES, USERS, etc.' },
          ].map(r => (
            <div key={r.role} className="bg-slate-50 border border-slate-200 rounded-lg p-2">
              <p className="font-mono font-bold text-violet-700 mb-0.5">{r.role}</p>
              <p className="text-slate-500">{r.desc}</p>
            </div>
          ))}
        </div>
        <CodeBlock code={`-- Grant SNOWFLAKE database role (preferred — fine-grained)
GRANT DATABASE ROLE SNOWFLAKE.USAGE_VIEWER TO ROLE analyst_role;
GRANT DATABASE ROLE SNOWFLAKE.GOVERNANCE_VIEWER TO ROLE dpo_role;

-- Or grant full access (broader — gives all ACCOUNT_USAGE views)
GRANT IMPORTED PRIVILEGES ON DATABASE SNOWFLAKE TO ROLE sysadmin;`} />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-3">
        <p className="font-bold text-slate-700 mb-2">Key Views — filter by category</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setFilterCat(c)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${filterCat === c ? 'bg-violet-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-violet-50 hover:text-violet-700'}`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
          {filtered.map(v => (
            <div key={v.view} className="flex items-start gap-2 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="font-mono font-bold text-violet-700 text-xs">{v.view}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${catColors[v.category]}`}>{v.category}</span>
                  <span className="text-xs text-slate-400">~{v.latency}</span>
                </div>
                <p className="text-slate-600">{v.desc}</p>
                <p className="text-slate-400 mt-0.5">DB Role: <code className="bg-slate-100 px-1 rounded">{v.dbRole}</code></p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CodeBlock code={`-- Credits by warehouse (month-to-date)
SELECT warehouse_name, SUM(credits_used) AS total_credits
FROM SNOWFLAKE.ACCOUNT_USAGE.WAREHOUSE_METERING_HISTORY
WHERE start_time >= DATE_TRUNC('month', CURRENT_DATE)
GROUP BY 1 ORDER BY 2 DESC;

-- Failed logins this month
SELECT user_name, COUNT(*) AS failed_logins
FROM SNOWFLAKE.ACCOUNT_USAGE.LOGIN_HISTORY
WHERE event_timestamp > DATE_TRUNC('month', CURRENT_DATE)
  AND is_success = 'NO'
GROUP BY 1 ORDER BY 2 DESC;

-- What queries accessed sensitive table (data access audit)
SELECT query_id, user_name, query_start_time
FROM SNOWFLAKE.ACCOUNT_USAGE.ACCESS_HISTORY,
     LATERAL FLATTEN(input => base_objects_accessed) f
WHERE f.value:objectName::STRING = 'MY_DB.MY_SCHEMA.CUSTOMERS'
ORDER BY query_start_time DESC
LIMIT 20;

-- All privileges granted to a role
SELECT privilege, granted_on, name
FROM SNOWFLAKE.ACCOUNT_USAGE.GRANTS_TO_ROLES
WHERE grantee_name = 'ANALYST_ROLE'
ORDER BY granted_on DESC;`} />

      <ExamTip>
        <p>• ACCOUNT_USAGE includes <strong>dropped object records</strong> and retains historical data for <strong>1 year</strong>; INFORMATION_SCHEMA is live but limited to the current database.</p>
        <p>• Most ACCOUNT_USAGE views have <strong>45 min–3 hour latency</strong> — use INFORMATION_SCHEMA for near-real-time data.</p>
        <p>• Use <strong>SNOWFLAKE database roles</strong> (<code>USAGE_VIEWER</code>, <code>GOVERNANCE_VIEWER</code>, etc.) for fine-grained access instead of full <code>IMPORTED PRIVILEGES</code>.</p>
        <p>• <code>ACCESS_HISTORY</code> (Enterprise Edition+) is the primary view for <strong>data access auditing</strong> — shows which objects each query read or wrote.</p>
      </ExamTip>
    </div>
  );
};

const MonitoringTab = () => {
  const [activeMonTab, setActiveMonTab] = useState('rm');
  return (
    <div className="space-y-5">
      <InfoCard>
        <SectionHeader
          icon={BarChart2}
          color="bg-violet-700"
          title="2.3 Monitoring & Cost Management"
          subtitle="Resource Monitors · Credit usage · ACCOUNT_USAGE schema"
        />
        <div className="flex flex-wrap gap-2 mb-5">
          {MONITORING_TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveMonTab(t.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                activeMonTab === t.id
                  ? 'bg-violet-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-violet-50 hover:text-violet-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {activeMonTab === 'rm'      && <ResourceMonitorContent />}
        {activeMonTab === 'credits' && <CreditUsageContent />}
        {activeMonTab === 'au'      && <AccountUsageContent />}
      </InfoCard>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// QUIZ TAB — sub-nav + 3 challenges
// ═══════════════════════════════════════════════════════════════════════════════

const QUIZ_SECTIONS = [
  { id: 'security',    label: 'Security & RBAC',      emoji: '🔐', desc: '2.1 — Roles, auth, network policies, access control' },
  { id: 'governance',  label: 'Governance Sorter',    emoji: '🏷️', desc: '2.2 — Sort features into the right governance pillar' },
  { id: 'monitoring',  label: 'Monitoring & Cost',    emoji: '📊', desc: '2.3 — Resource monitors, credits, ACCOUNT_USAGE' },
];

// ── Challenge 1 helpers ───────────────────────────────────────────────────────
const ScenarioPicker = ({ data, themeColor = 'violet' }) => {
  const [current, setCurrent] = useState(0);
  const [picked,  setPicked]  = useState(null);
  const [score,   setScore]   = useState(0);
  const [history, setHistory] = useState([]);
  const [done,    setDone]    = useState(false);

  const q = data[current];
  const isCorrect = picked === q?.answer;

  const handlePick = useCallback((opt) => {
    if (picked) return;
    const correct = opt === q.answer;
    setPicked(opt);
    if (correct) setScore(s => s + 1);
    setHistory(h => [...h, { ...q, picked: opt, correct }]);
  }, [picked, q]);

  const next  = () => { if (current + 1 >= data.length) setDone(true); else { setCurrent(c => c + 1); setPicked(null); }};
  const reset = () => { setCurrent(0); setPicked(null); setScore(0); setHistory([]); setDone(false); };

  if (done) return (
    <div className="space-y-4">
      <InfoCard className="text-center py-8">
        <p className="text-5xl mb-3">{score / data.length >= 0.9 ? '🎉' : score / data.length >= 0.7 ? '👍' : '📚'}</p>
        <h3 className="text-2xl font-bold text-slate-800 mb-1">Challenge Complete!</h3>
        <p className="text-slate-500 mb-5">
          You scored <span className={`font-bold text-${themeColor}-700 text-xl`}>{score}</span> / {data.length}
        </p>
        <button onClick={reset} className={`bg-${themeColor}-600 hover:bg-${themeColor}-700 text-white font-bold px-8 py-3 rounded-xl`}>Retry</button>
      </InfoCard>
      <InfoCard>
        <h3 className="font-bold text-slate-700 mb-3">Full Review</h3>
        <div className="space-y-2">
          {history.map((h, i) => (
            <div key={i} className={`p-3 rounded-xl border text-xs ${h.correct ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
              <p className="font-medium text-slate-600 mb-1">{h.q}</p>
              {h.correct
                ? <p className="text-emerald-700 font-bold">✓ {h.answer}</p>
                : <><p className="text-red-700">✗ You picked: <span className="font-bold">{h.picked}</span></p>
                    <p className="text-red-600 mt-0.5">Correct: <span className="font-bold">{h.answer}</span></p></>
              }
              <p className="text-slate-500 mt-1 italic">{h.exp}</p>
            </div>
          ))}
        </div>
      </InfoCard>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-slate-700">Question {current + 1} of {data.length}</span>
          <span className={`text-xs font-semibold text-${themeColor}-600`}>Score: {score}</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div className={`bg-${themeColor}-500 h-2 rounded-full transition-all duration-500`}
            style={{ width: `${(current / data.length) * 100}%` }} />
        </div>
      </div>

      <InfoCard>
        <p className={`text-[10px] font-bold text-${themeColor}-600 uppercase tracking-wider mb-2`}>Scenario</p>
        <p className="text-base font-semibold text-slate-800 leading-relaxed mb-5">{q.q}</p>

        <div className="space-y-2">
          {q.options.map(opt => {
            const isAnswer = opt === q.answer;
            const isPicked = opt === picked;
            let cls = 'border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50 text-slate-700';
            if (picked) {
              if (isAnswer)      cls = 'border-emerald-400 bg-emerald-50 text-emerald-800 font-bold';
              else if (isPicked) cls = 'border-red-300 bg-red-50 text-red-700 opacity-80';
              else               cls = 'border-slate-100 bg-slate-50 text-slate-300 opacity-40';
            }
            return (
              <button key={opt} disabled={!!picked} onClick={() => handlePick(opt)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm flex items-center gap-3 ${cls}`}>
                <span className="flex-1">{opt}</span>
                {picked && isAnswer  && <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                {picked && isPicked && !isAnswer && <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        {picked && (
          <div className={`mt-4 p-4 rounded-xl border ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
            <p className={`text-sm font-bold mb-1 ${isCorrect ? 'text-emerald-800' : 'text-red-800'}`}>
              {isCorrect ? '✓ Correct!' : `✗ The correct answer is: "${q.answer}"`}
            </p>
            <p className={`text-sm ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>{q.exp}</p>
            <button onClick={next}
              className={`mt-3 bg-${themeColor}-600 hover:bg-${themeColor}-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors`}>
              {current + 1 < data.length ? 'Next →' : 'See Results'}
            </button>
          </div>
        )}
      </InfoCard>
    </div>
  );
};

// ── Challenge 1 data: Security & RBAC ────────────────────────────────────────
const SECURITY_QUIZ_DATA = [
  {
    q: 'A user needs to query tables across 3 databases. Their primary role only grants access to one. What should they do?',
    options: ['Grant all privileges to the primary role', 'Use secondary roles with USE SECONDARY ROLES ALL', 'Create a new role combining all privileges', 'Ask ACCOUNTADMIN to run the queries'],
    answer: 'Use secondary roles with USE SECONDARY ROLES ALL',
    exp: 'USE SECONDARY ROLES ALL activates all roles granted to a user simultaneously, without changing the primary role.',
  },
  {
    q: 'Which system role owns all securable objects by default and should be used sparingly?',
    options: ['SYSADMIN', 'SECURITYADMIN', 'ACCOUNTADMIN', 'ORGADMIN'],
    answer: 'ACCOUNTADMIN',
    exp: 'ACCOUNTADMIN is the top-level role that owns everything by default. Best practice: restrict to 2-3 users and avoid using for daily work.',
  },
  {
    q: 'A role must be able to create users and manage grants on roles, but should NOT manage billing or organizational settings. Which system role is appropriate?',
    options: ['ACCOUNTADMIN', 'SYSADMIN', 'SECURITYADMIN', 'USERADMIN'],
    answer: 'SECURITYADMIN',
    exp: 'SECURITYADMIN can create/manage users, roles, and grant privileges on all roles — without the billing/org scope of ACCOUNTADMIN.',
  },
  {
    q: 'A developer joins the team. They need to create databases, warehouses, and schemas. Which role fits the principle of least privilege?',
    options: ['ACCOUNTADMIN', 'SYSADMIN', 'SECURITYADMIN', 'PUBLIC'],
    answer: 'SYSADMIN',
    exp: 'SYSADMIN can create and manage all compute and data objects — the right level for engineers without exposing billing or user management.',
  },
  {
    q: 'What does Discretionary Access Control (DAC) mean in Snowflake?',
    options: [
      'Only ACCOUNTADMIN can grant privileges',
      'Object owners can grant their own privileges to others',
      'All access is controlled centrally by RBAC policy',
      'Privileges are automatically assigned by role hierarchy',
    ],
    answer: 'Object owners can grant their own privileges to others',
    exp: 'DAC means the OWNER of an object can grant access to it. This complements RBAC — owners decide who else can use their objects.',
  },
  {
    q: 'A company wants to allow employees to log in using their corporate Active Directory credentials. Which Snowflake feature enables this?',
    options: ['Key-pair authentication', 'MFA via Duo', 'Federated Authentication / SAML 2.0 SSO', 'OAuth 2.0 delegated access'],
    answer: 'Federated Authentication / SAML 2.0 SSO',
    exp: 'Federated Authentication lets Snowflake delegate authentication to an external IdP (Okta, AD FS, etc.) via SAML 2.0 — the basis for SSO.',
  },
  {
    q: 'A third-party BI tool needs to connect to Snowflake on behalf of users without them sharing their Snowflake passwords. Which authentication method is correct?',
    options: ['Key-pair authentication', 'OAuth 2.0', 'MFA', 'SCIM provisioning'],
    answer: 'OAuth 2.0',
    exp: 'OAuth 2.0 allows applications to get delegated access tokens so users never share their passwords with the BI tool.',
  },
  {
    q: 'An automated service account needs to authenticate to Snowflake from a CI/CD pipeline without storing a password. What should you use?',
    options: ['Username/password', 'OAuth with browser flow', 'Key-pair authentication with a private key file', 'MFA via Duo push'],
    answer: 'Key-pair authentication with a private key file',
    exp: 'Key-pair authentication is the recommended method for service accounts and automation — no password stored, private key stays with the client.',
  },
  {
    q: 'A network policy is attached to both an account and a specific user. Which policy takes effect when that user connects?',
    options: ['The account-level policy only', 'The user-level policy overrides the account-level policy', 'Both policies are applied together (union of IPs)', 'Both policies are applied together (intersection of IPs)'],
    answer: 'The user-level policy overrides the account-level policy',
    exp: 'User-level network policies take precedence over account-level ones — the user-level policy completely replaces the account policy for that user.',
  },
  {
    q: 'An account-level network policy blocks all IPs except 203.0.113.0/24. A user tries to connect from 10.0.0.5. What happens?',
    options: ['Connection is allowed because private IPs are always permitted', 'Connection is allowed because the account admin can always connect', 'Connection is rejected — the IP is not in the allowed list', 'Snowflake asks for MFA before deciding'],
    answer: 'Connection is rejected — the IP is not in the allowed list',
    exp: 'Network policies allow-list IPs. Any IP not in ALLOWED_IP_LIST is blocked — no exceptions unless a user-level override is in place.',
  },
  {
    q: 'You run: GRANT USAGE ON DATABASE mydb TO ROLE analyst. Can the analyst role now query tables in mydb?',
    options: ['Yes — USAGE on the database is sufficient', 'No — USAGE on database, schema, AND SELECT on table are all required', 'No — only ACCOUNTADMIN can grant SELECT', 'Yes — Snowflake auto-grants child privileges'],
    answer: 'No — USAGE on database, schema, AND SELECT on table are all required',
    exp: 'Access is hierarchical: you need USAGE on database, USAGE on schema, and SELECT on the specific table. Missing any level blocks access.',
  },
  {
    q: 'What is the purpose of the ORGADMIN role?',
    options: [
      'Manage billing and user provisioning within a single account',
      'Create and manage multiple Snowflake accounts within the organization',
      'Assign ACCOUNTADMIN to other roles',
      'Control data sharing across Business Critical accounts',
    ],
    answer: 'Create and manage multiple Snowflake accounts within the organization',
    exp: 'ORGADMIN is an account-level role used to manage an organization — create accounts, view usage across accounts, enable replication, etc.',
  },
  {
    q: 'Which Snowflake feature can be used to capture detailed logs from stored procedures and UDFs for debugging?',
    options: ['QUERY_HISTORY view', 'ACCESS_HISTORY view', 'Logging and Tracing (Event Tables)', 'TASK_HISTORY view'],
    answer: 'Logging and Tracing (Event Tables)',
    exp: 'Logging and Tracing stores log messages and trace spans from stored procedures/UDFs into an Event Table for structured debugging.',
  },
  {
    q: 'A database role is granted SELECT on SCHEMA mydb.myschema. What is a key difference between database roles and account roles?',
    options: [
      'Database roles can be granted to other accounts via data sharing',
      'Database roles can only be used to manage virtual warehouses',
      'Database roles exist at the account level just like account roles',
      'Database roles can only be created by USERADMIN',
    ],
    answer: 'Database roles can be granted to other accounts via data sharing',
    exp: 'Database roles are scoped to a database and can be shared to consumer accounts via Data Sharing — account roles cannot be shared.',
  },
];

// ── Challenge 2 data & component: Governance Sorter ──────────────────────────
const GOV_PILLARS = [
  { id: 'masking',      label: 'Data Masking',        emoji: '🎭', light: 'bg-blue-50',    border: 'border-blue-300',    text: 'text-blue-800' },
  { id: 'tagging',      label: 'Object Tagging',       emoji: '🏷️', light: 'bg-amber-50',   border: 'border-amber-300',   text: 'text-amber-800' },
  { id: 'encryption',   label: 'Encryption & Trust',   emoji: '🔐', light: 'bg-violet-50',  border: 'border-violet-300',  text: 'text-violet-800' },
  { id: 'replication',  label: 'Replication & Lineage',emoji: '🔄', light: 'bg-teal-50',    border: 'border-teal-300',    text: 'text-teal-800' },
  { id: 'monitoring',   label: 'Alerts & Notifications',emoji: '🔔', light: 'bg-rose-50',   border: 'border-rose-300',    text: 'text-rose-800' },
];

const GOV_CARDS = [
  { id: 'g01', text: 'Replace SSN with *** for non-privileged roles at query time',            pillar: 'masking',     hint: 'Dynamic Data Masking hides column values based on role.' },
  { id: 'g02', text: 'Block specific rows from appearing in results based on user role',        pillar: 'masking',     hint: 'Row Access Policies filter rows — part of data masking/security.' },
  { id: 'g03', text: 'Attach "PII" and "GDPR" labels to columns for discovery and governance', pillar: 'tagging',     hint: 'Object Tags are key-value labels attached to Snowflake objects.' },
  { id: 'g04', text: 'Automatically classify sensitive columns as EMAIL or SSN',                pillar: 'tagging',     hint: 'Auto-classification uses system tags to label sensitive data.' },
  { id: 'g05', text: 'Propagate a tag from a table to all its columns automatically',           pillar: 'tagging',     hint: 'Tag lineage (propagation) is a feature of Object Tagging.' },
  { id: 'g06', text: 'Customer-managed encryption keys via AWS KMS integration',               pillar: 'encryption',  hint: 'Tri-Secret Secure uses customer KMS keys — Business Critical.' },
  { id: 'g07', text: 'Check the account against CIS benchmarks for security misconfigurations',pillar: 'encryption',  hint: 'Trust Center scans account security posture using compliance packages.' },
  { id: 'g08', text: 'Periodic key rotation for Snowflake-managed encryption keys',             pillar: 'encryption',  hint: 'Snowflake supports annual automatic key rotation by default.' },
  { id: 'g09', text: 'Replicate databases across regions for business continuity',              pillar: 'replication', hint: 'Replication Groups copy databases and shares to secondary accounts.' },
  { id: 'g10', text: 'Failover to a secondary account when primary is unavailable',            pillar: 'replication', hint: 'Failover Groups (Business Critical+) enable account-level DR.' },
  { id: 'g11', text: 'Track how data flowed from raw table → staging view → mart table',       pillar: 'replication', hint: 'Data Lineage tracks upstream/downstream data movement.' },
  { id: 'g12', text: 'Trigger an email when warehouse credits exceed a threshold',              pillar: 'monitoring',  hint: 'Alerts fire an action when a condition is true — email via SYSTEM$SEND_EMAIL.' },
  { id: 'g13', text: 'Send a Slack message when a pipeline fails using a Webhook integration', pillar: 'monitoring',  hint: 'Notification Integration (Webhook) can post to Slack/Teams/PagerDuty.' },
  { id: 'g14', text: 'Subscribe non-admin users to resource monitor notifications',             pillar: 'monitoring',  hint: 'Non-administrator notifications can be added to resource monitors.' },
];

const GovernanceSortGame = () => {
  const [assignments, setAssignments] = useState({});
  const [selected, setSelected]       = useState(null);
  const [revealed, setRevealed]       = useState(false);

  const score = Object.entries(assignments).filter(([cid, pid]) =>
    GOV_CARDS.find(c => c.id === cid)?.pillar === pid
  ).length;

  const reset = () => { setAssignments({}); setSelected(null); setRevealed(false); };
  const unassigned = GOV_CARDS.filter(c => !assignments[c.id]);

  const pickCard    = (id)  => setSelected(selected === id ? null : id);
  const dropOnPillar = (pid) => {
    if (!selected || revealed) return;
    setAssignments(p => ({ ...p, [selected]: pid }));
    setSelected(null);
  };
  const removeCard = (cid) => {
    if (revealed) return;
    setAssignments(p => { const n = { ...p }; delete n[cid]; return n; });
  };

  return (
    <InfoCard>
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-slate-800">Governance Feature Sorter</h3>
        <button onClick={reset} className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 font-semibold">
          <RefreshCw className="w-3 h-3" /> Reset
        </button>
      </div>
      <p className="text-xs text-slate-400 mb-4">
        <strong>Step 1:</strong> Click a feature to select it (turns purple).&nbsp;
        <strong>Step 2:</strong> Click the governance category it belongs to. Click a placed chip to unplace it.
        {revealed && <span className="ml-2 font-bold text-violet-700">Score: {score}/{GOV_CARDS.length}</span>}
      </p>

      {unassigned.length > 0 && (
        <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Features to sort — {unassigned.length} remaining
          </p>
          <div className="flex flex-wrap gap-2">
            {unassigned.map(c => (
              <button key={c.id} onClick={() => pickCard(c.id)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                  selected === c.id
                    ? 'bg-violet-600 text-white border-violet-600 shadow-md scale-105'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-violet-300 hover:bg-violet-50'
                }`}>
                {c.text}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        {GOV_PILLARS.map(p => {
          const here = GOV_CARDS.filter(c => assignments[c.id] === p.id);
          return (
            <div key={p.id} onClick={() => dropOnPillar(p.id)}
              className={`rounded-xl border-2 p-3 min-h-[90px] transition-all ${
                selected ? `${p.border} ${p.light} shadow-md cursor-pointer` : 'border-slate-200 bg-slate-50'
              }`}>
              <p className={`text-xs font-bold mb-2 ${p.text}`}>{p.emoji} {p.label}</p>
              <div className="flex flex-wrap gap-1">
                {here.map(c => {
                  const ok = c.pillar === p.id;
                  return (
                    <span key={c.id} onClick={e => { e.stopPropagation(); removeCard(c.id); }}
                      title="Click to remove"
                      className={`text-[10px] px-2 py-1 rounded-full border cursor-pointer transition-all ${
                        revealed
                          ? ok ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                               : 'bg-red-100 border-red-300 text-red-700 line-through'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-red-50 hover:border-red-300'
                      }`}>
                      {c.text.length > 35 ? c.text.slice(0, 35) + '…' : c.text}
                    </span>
                  );
                })}
              </div>
              {selected && here.length === 0 && (
                <p className={`text-[10px] italic ${p.text} opacity-40`}>Drop here</p>
              )}
            </div>
          );
        })}
      </div>

      {!revealed ? (
        <button onClick={() => setRevealed(true)}
          disabled={Object.keys(assignments).length < GOV_CARDS.length}
          className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-violet-200 text-white font-bold py-3 rounded-xl text-sm transition-colors">
          Check Answers ({Object.keys(assignments).length}/{GOV_CARDS.length} sorted)
        </button>
      ) : (
        <div className="space-y-2 mt-2">
          <p className="text-center font-bold text-slate-700 text-lg">
            {score === GOV_CARDS.length ? '🎉 Perfect!' : `${score}/${GOV_CARDS.length} correct`}
          </p>
          {GOV_CARDS.filter(c => assignments[c.id] !== c.pillar).map(c => (
            <div key={c.id} className="text-xs bg-red-50 border border-red-200 rounded-lg p-2.5 text-red-700">
              <span className="font-bold">"{c.text}"</span> → belongs to{' '}
              <span className="font-bold text-violet-700">
                {GOV_PILLARS.find(p => p.id === c.pillar)?.emoji} {GOV_PILLARS.find(p => p.id === c.pillar)?.label}
              </span>. {c.hint}
            </div>
          ))}
        </div>
      )}
    </InfoCard>
  );
};

// ── Challenge 3 data: Monitoring & Cost ───────────────────────────────────────
const MONITORING_QUIZ_DATA = [
  {
    q: 'A resource monitor with CREDIT_QUOTA = 200 and FREQUENCY = MONTHLY has a trigger at 100% DO SUSPEND. The account uses 200 credits in a month. What happens?',
    options: [
      'All virtual warehouses are immediately suspended',
      'An email notification is sent but warehouses keep running',
      'Only the assigned warehouse is suspended; others continue',
      'Snowflake prevents new queries but allows running ones to finish',
    ],
    answer: 'All virtual warehouses are immediately suspended',
    exp: 'A SUSPEND trigger on an account-level resource monitor suspends ALL virtual warehouses when the quota is reached.',
  },
  {
    q: 'Which role is REQUIRED to create and modify resource monitors?',
    options: ['SYSADMIN', 'SECURITYADMIN', 'ACCOUNTADMIN', 'USERADMIN'],
    answer: 'ACCOUNTADMIN',
    exp: 'Only ACCOUNTADMIN can create resource monitors and assign them to warehouses — this is a hard requirement.',
  },
  {
    q: 'A resource monitor is set to FREQUENCY = MONTHLY with START_TIMESTAMP = IMMEDIATELY. When does the credit count reset?',
    options: [
      'On the 1st of each calendar month',
      'Every 30 days from the START_TIMESTAMP',
      'On the same day each month as the START_TIMESTAMP',
      'Never — it accumulates until dropped',
    ],
    answer: 'On the same day each month as the START_TIMESTAMP',
    exp: 'The reset date is the same calendar day each period as when the monitor started — not necessarily the 1st of the month.',
  },
  {
    q: 'An X-Small warehouse (1 credit/hr) runs for exactly 45 seconds before auto-suspending. How many credits are billed?',
    options: ['0.0125 (45 seconds)', '0.0167 (60 seconds minimum)', '1.0 (full hour minimum)', '0 (too short to bill)'],
    answer: '0.0167 (60 seconds minimum)',
    exp: 'Snowflake billing has a 60-second minimum per warehouse start. 45 seconds < 60 seconds, so 60 seconds are billed: 1/3600 × 60 ≈ 0.0167 credits.',
  },
  {
    q: 'You resize a warehouse from Medium (4 credits/hr) to Large (8 credits/hr). How do credits change?',
    options: [
      'Credits increase by 2× for each size increase',
      'Credits increase by 4 (fixed increment per size)',
      'Credits double with each size step up',
      'Credits increase linearly — Large = Medium + 1',
    ],
    answer: 'Credits double with each size step up',
    exp: 'Each warehouse size step exactly doubles the credits/hr: XS=1, S=2, M=4, L=8, XL=16, 2XL=32, 3XL=64, 4XL=128, 5XL=256, 6XL=512.',
  },
  {
    q: 'Cloud Services costs are billed to an account under which condition?',
    options: [
      'Always — Cloud Services always generate charges',
      'When Cloud Services usage exceeds 10% of daily virtual warehouse credits',
      'When Cloud Services usage exceeds 10% of monthly compute credits',
      'When the account has no active virtual warehouses that day',
    ],
    answer: 'When Cloud Services usage exceeds 10% of daily virtual warehouse credits',
    exp: 'Snowflake provides a daily credit adjustment: if Cloud Services ≤ 10% of VW credits that day, Cloud Services are free. The threshold is daily, calculated in UTC.',
  },
  {
    q: 'Do resource monitors track credit usage for serverless features like Snowpipe, Tasks, or Search Optimization?',
    options: [
      'Yes — all compute in Snowflake is tracked by resource monitors',
      'No — resource monitors only track virtual warehouse credits',
      'Yes — but only Snowpipe is tracked; Tasks are excluded',
      'Yes — if the resource monitor type is set to SERVERLESS',
    ],
    answer: 'No — resource monitors only track virtual warehouse credits',
    exp: 'Resource monitors apply ONLY to virtual warehouse credit consumption. Serverless features (Snowpipe, Tasks, Search Optimization) are not controlled by resource monitors.',
  },
  {
    q: 'A query in ACCOUNT_USAGE.QUERY_HISTORY shows up with a 90-minute delay compared to when it ran. Is this expected?',
    options: [
      'No — ACCOUNT_USAGE should be real-time',
      'Yes — QUERY_HISTORY has a latency of 45 minutes to 3 hours',
      'Yes — but only for queries taking longer than 10 minutes',
      'No — ACCOUNT_USAGE latency is exactly 24 hours',
    ],
    answer: 'Yes — QUERY_HISTORY has a latency of 45 minutes to 3 hours',
    exp: 'ACCOUNT_USAGE views are NOT real-time. QUERY_HISTORY has up to 45 min – 3 hr latency. For near-real-time data, use INFORMATION_SCHEMA.',
  },
  {
    q: 'You need to audit query history for the past 14 months. Which source should you query?',
    options: [
      'INFORMATION_SCHEMA.QUERY_HISTORY — it has the longest retention',
      'ACCOUNT_USAGE.QUERY_HISTORY — 1-year retention',
      'ACCOUNT_USAGE.QUERY_HISTORY — 14 months is within the 1-year window',
      'INFORMATION_SCHEMA.QUERY_HISTORY_BY_SESSION',
    ],
    answer: 'ACCOUNT_USAGE.QUERY_HISTORY — 1-year retention',
    exp: 'ACCOUNT_USAGE retains data for 1 year (365 days). 14 months exceeds this — you can only query up to 12 months back. INFORMATION_SCHEMA has much shorter retention (typically 7 days).',
  },
  {
    q: 'A data engineer wants access to ACCOUNT_USAGE views for governance auditing but should NOT have full ACCOUNTADMIN. Which database role to grant?',
    options: ['OBJECT_VIEWER', 'GOVERNANCE_VIEWER', 'SECURITY_VIEWER', 'USAGE_VIEWER'],
    answer: 'GOVERNANCE_VIEWER',
    exp: 'GOVERNANCE_VIEWER grants access to governance-related ACCOUNT_USAGE views: policy usage, tag history, data classification results — without admin privileges.',
  },
  {
    q: 'Which ACCOUNT_USAGE view would you query to find the last time a specific user logged in?',
    options: ['QUERY_HISTORY', 'ACCESS_HISTORY', 'LOGIN_HISTORY', 'SESSION_POLICIES_USAGE'],
    answer: 'LOGIN_HISTORY',
    exp: 'LOGIN_HISTORY records every login attempt — successful or not — including user, timestamp, client, and error message if failed.',
  },
  {
    q: 'A warehouse is configured with STATEMENT_TIMEOUT_IN_SECONDS = 300. A query runs for 6 minutes. What happens?',
    options: [
      'The query succeeds — timeout only applies to queued queries',
      'The query is cancelled and an error is returned to the user',
      'The warehouse suspends and the query is requeued',
      'Snowflake logs a warning but lets the query finish',
    ],
    answer: 'The query is cancelled and an error is returned to the user',
    exp: 'STATEMENT_TIMEOUT_IN_SECONDS cancels any query exceeding the timeout and returns an error. 6 minutes = 360 seconds > 300 — the query is terminated.',
  },
];

// ── QuizTab ───────────────────────────────────────────────────────────────────
const QuizTab = () => {
  const [active, setActive] = useState('security');

  return (
    <div className="space-y-4">
      <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <FlaskConical className="w-5 h-5 text-violet-600" />
          <p className="font-bold text-violet-800 text-sm">Domain 2 — Knowledge Checks</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {QUIZ_SECTIONS.map(s => (
            <button key={s.id} onClick={() => setActive(s.id)}
              className={`p-3 rounded-xl border text-center transition-all ${
                active === s.id
                  ? 'bg-violet-600 border-violet-600 text-white shadow-md'
                  : 'bg-white border-violet-200 text-violet-700 hover:bg-violet-100'
              }`}>
              <p className="text-xl mb-1">{s.emoji}</p>
              <p className="font-bold text-xs leading-tight">{s.label}</p>
              <p className={`text-[10px] mt-0.5 leading-snug ${active === s.id ? 'text-violet-200' : 'text-slate-400'}`}>{s.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {active === 'security'   && <ScenarioPicker data={SECURITY_QUIZ_DATA}   themeColor="violet" />}
      {active === 'governance' && <GovernanceSortGame />}
      {active === 'monitoring' && <ScenarioPicker data={MONITORING_QUIZ_DATA} themeColor="blue" />}
    </div>
  );
};

export default Domain2_Governance;
