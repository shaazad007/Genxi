# Genxi — Hybrid SEO Automation Build Plan

**Revision:** 2026-11-25 | **Status:** planning; T039 source audit complete; application implementation not started | **Initial worker:** GitHub Actions | **Future worker:** Google Cloud + Firebase

Genxi is an independent Flutter Shopify app for Pakistani clothing brands. It reads product images with Gemini Vision, combines them with owner checkbox input (gala, daaman, sleeve embroidery, dupatta, trouser), generates English SEO and publishes approved changes to Shopify. Reuse AutoGenSEO source where appropriate; do not modify its existing repository or production data.

## 1. Scope and delivery stages

- Preserve the original v1 product flow: OAuth installation, categories/thumbnails, long-press checkboxes, queue, editable review, publishing, description, meta title/description, keywords, image alt text, 10-product trial, paid plans and read-only Theme Health reports.
- Stage A: GitHub-first implementation (Phases 1–7). No Google Cloud/Firebase deployment required for this pilot. Use the portable local HTTPS control API for development and an independently hosted HTTPS endpoint for any unattended/public merchant service. GitHub Actions is a batch runner, not a permanent OAuth/webhook server.
- Stage B: Google Cloud + Firebase integration only after explicit owner opt-in (Phases 8–9). A common worker and queue contract allows switching without rewriting Flutter or SEO logic.
- No automatic theme edits, global markets or Search Console integration. Public Shopify listing remains outside initial own-store pilot; a compliant public distribution/review path is required before onboarding unrelated merchant stores (custom distribution does not cover arbitrary independent stores). Do not promise paid plans before distribution/billing is approved.

## 2. Independent identity and source migration

- Source: https://github.com/shaazad007/AutogenSeo (main). Target: proposed private `shaazad007/Genxi` (not created by this revision). Proposed Flutter package/project `genxi`; Android application ID `com.genxi.app` subject to availability; separate Shopify app/client ID, redirect URL, signing, brand assets, environments, GitHub secrets, Firebase project and GCP service accounts.
- Audit source and record exact commit SHA, license and attribution before copying. Duplicate complete reusable source into a new repository; do not use the old repo as runtime dependency. Prefer a clean initial commit, excluding credentials, `.env`, production data, old queue/history, caches, artifacts and private shop identifiers; preserve required license notices. Keep inherited Actions disabled until Genxi preview tests pass. Do not push to or change AutoGenSEO.
- Current inspected source: https://github.com/shaazad007/AutogenSeo/blob/main/.github/workflows/auto-process.yml (blob SHA `0025684bf7905efd88a8b11e25b94a71e28203ac`, inspected 2026-11-25). Node 20, `index.js`, modes preview/live/profile-backfill/collections/enqueue/queue-worker, collection handles, request/logical IDs and publication range, serialized runs, progress/queue commits and safe rebase. Current schedule is 03:00, 09:00, 15:00, 21:10 UTC (08:00, 14:00, 20:00, 02:10 PKT); scheduled source run is profile-backfill, NOT general SEO. Source default manual limit is 10; scheduled backfill requests 100000 with time budget; do not copy that cap or timeout blindly. Genxi defaults to preview and configurable small batches.
- Existing chat history describes shared Vision/SEO generation, `ai-done`, sequential collections, Gemini → Groq → Cloudflare Workers AI fallback and queue dedupe. Re-audit actual code before reuse; no claim of current verified full engine or metafield schema. Map metafield namespace/key to Genxi explicitly; avoid changing existing store fields without approval.

### T039 source audit record (2026-11-25)

- Upstream repository: [shaazad007/AutogenSeo](https://github.com/shaazad007/AutogenSeo), branch `main`, audited commit [`1d22e41cf4827dd36305cdc30a8114341d6e6995`](https://github.com/shaazad007/AutogenSeo/commit/1d22e41cf4827dd36305cdc30a8114341d6e6995), committed 2026-11-24 23:50:02 UTC.
- Audited blobs: workflow `0025684bf7905efd88a8b11e25b94a71e28203ac`; `index.js` `fbe0d8d7b06e4225c545888419ad72378fab7b9f`; `package.json` `931baf94a612a2871229a2ca406f5d63c81cb91e`.
- License/provenance: GitHub API reports no license metadata; no root `LICENSE`, `LICENCE`, or `COPYING` file was found; `package.json` declares `license: UNLICENSED` and `private: true`. For this private migration, the user explicitly started T040, and the authenticated GitHub login `shaazad007` matches the upstream owner and has admin permission. This is task-specific authorization, not a general public license. Do not publicly redistribute the source without separate rights.
- Workflow/code facts verified at the pinned commit: Node.js 20; `index.js`; modes include preview/live/profile-backfill/collections/enqueue/queue-worker/scheduled; manual limit defaults to 10; Actions concurrency serializes the worker; scheduled profile-backfill runs at 03:00, 09:00, 15:00, and 21:10 UTC (08:00, 14:00, 20:00, 02:10 PKT), requesting limit 100000 with an internal time budget. These operational defaults are upstream-specific.
- Evidence: [pinned workflow](https://github.com/shaazad007/AutogenSeo/blob/1d22e41cf4827dd36305cdc30a8114341d6e6995/.github/workflows/auto-process.yml), [pinned package metadata](https://github.com/shaazad007/AutogenSeo/blob/1d22e41cf4827dd36305cdc30a8114341d6e6995/package.json). Source backup before recording: `AI_WORKSPACE/backups/genxi-source-20261125_021833Z.zip` (verified; local `local.properties` excluded).

## 3. Hybrid architecture and mode contract

```text
Flutter app → authenticated Genxi control API → authoritative queue + mode controller
                                              ├─ GitHub Actions adapter (initial)
                                              └─ Cloud Run Jobs adapter (later)
Both adapters → same portable Node.js worker → AI providers → approved Shopify writes
```

- Suggested repository layout: `app/`, `engine/`, `control-api/`, `adapters/github/`, `adapters/gcp/`, `infra/`, `.github/workflows/`, `tests/`, `docs/`. Preserve source layout where needed during migration.
- Define provider-neutral contracts: `ExecutionAdapter` (enqueue, dispatch, status, stop/drain), `StateAdapter` (atomic claim, heartbeat, checkpoint, usage, mode), and `SecretProvider`. Common job fields: shop ID, logical job ID, request ID, product IDs, collection, date bounds, generation schema/version, state, attempt, cursor, timestamps, lease owner/expiry, mode epoch and per-product result/idempotency key. No secrets in job payloads.
- Stage A authority: private Genxi repository state snapshots (sanitized queue, usage and result metadata) using serialized writes and compare-and-swap on branch SHA. App caches products/queue locally; authoritative remote state survives app closure. The controller must authenticate each tenant; never expose GitHub tokens in Flutter. Repository state must contain no merchant tokens, images, unredacted sensitive logs or product payloads. Retention and deletion must cover Git history; avoid putting personal information there in the first place.
- Stage B authority: Firestore transactions and tenant-scoped records for queue, lease, usage and active mode. Both workers read/write the same authority after migration; GitHub authenticates using OIDC/workload identity federation with narrowly scoped service identity. No dual queue authorities, no continuous bidirectional mirroring. Migrate once after drain; verify counts, IDs, usage, checkpoints and pending operations, then switch authority. Keep sanitized read-only backup, define rollback/reconciliation.
- Settings: `GITHUB`, `GOOGLE_CLOUD`, `PAUSED`; separate health/configured flags and optional `autoFailoverEnabled` (off by default until both modes pass QA). Initial state GitHub active, Google Cloud not configured. Both integrations may be configured, but only one execution provider may claim work. Show active mode, pending/processing/done counts, last heartbeat, switch progress and quota status.
- Switch through authenticated Genxi mode control (not simply disabling a workflow in GitHub UI): stop new claims, drain or reconcile active work, increment mode epoch, revoke/expire leases, verify target readiness and quota, activate target and resume pending items. Workers re-check lease/fence before Shopify mutation; Shopify cannot participate in Firestore transactions, so unknown write outcomes require read-back reconciliation before retry. Reuse saved generation result where safe; never assume exactly-once external calls. If target unavailable, remain PAUSED; do not silently spend money. Manual external disabling is detected via health/watchdog only once independent control plane exists. Both workers disabled = paused.
- Auto failover only for eligible provider outages/runner quota when secondary is configured, healthy and within limits; never use it to evade a shared AI/Shopify quota. Source schedules can be adapted to Genxi queue-worker, manual dispatch and configurable cron; keep one active scheduler/claim gate.

## 4. OAuth, security and original product flow

1. User taps Login with Shopify and enters shop domain; portable HTTPS control API starts authorization code grant for standalone app. Validate shop domain, callback HMAC, state nonce, redirect and scope.
2. Exchange authorization code server-side. Return a short-lived one-use app session exchange code via verified app/universal link; never place Shopify access tokens in URL/deep links.
3. Remote unattended workers need authorized offline access when phone is off: replace original device-only token rule with encrypted server-side per-shop token vault, refresh/expiry handling where supported, rotation and revocation. Initial own-store pilot may use dedicated GitHub secrets for that store; for multi-shop pilot, secure persistent control API vault and authenticated short-lived worker credential retrieval are mandatory. No multi-tenant secrets in a shared repo, workflow input or mobile binary.
4. Server API mediates Shopify GraphQL Admin calls; use least-privilege scopes (`read_products`, `write_products`, optional `read_themes` after approval), API version pinning, pagination, throttling/backoff. Mandatory app/uninstalled and privacy webhooks authenticated and processed idempotently. Cancel pending jobs, revoke access and delete applicable data.
5. App caches products, tags, previews and queue view on device; worker fetches images on demand, processes in memory, never persist server image binaries. Verify safe image URL fetch, size/time limits and provider privacy terms. Store only minimum result/checkpoint/usage data required for restart and review, with retention and tenant access controls. AI-generated SEO text remains editable; publish only after explicit approval, or separately authorized live rules.
6. Preserve Roman Urdu/English UI, English SEO, owner checkbox-vs-image conflict warnings, validation, fallback, 10-product trial, plans and read-only theme reports.

## 5. DevOps and free-tier policy

| Component | GitHub-first | Google Cloud/Firebase later |
|---|---|---|
| Execution | GitHub Actions Linux standard runner | Cloud Run Jobs, bounded tasks |
| Control API / OAuth | Portable Node service; local HTTPS pilot or independent host | Cloud Run service, min instances 0 |
| Scheduler | GitHub cron/manual dispatch | Cloud Scheduler authenticated job |
| State | Private repo sanitized state, serialized commits/CAS | Firestore transactional queue/usage/mode |
| Credentials | Genxi GitHub secrets + secure control API vault | Secret Manager, encrypted tenant vault, IAM/WIF |
| Auth | Genxi session + Shopify OAuth | Same Shopify OAuth, Firebase Auth if useful |
| Observability | Redacted logs, short retention | Cloud Logging, usage alerts, redaction |

- Free-tier-first, not a guarantee of zero cost. Private Actions included usage is account/plan dependent; inspect current allowance and set applicable zero-spend budget/stop rules. Do not assume old 2,000-minute figure or unlimited private usage. Schedule/job duration and storage count against limits. Public standard-runner jobs are generally free, but Genxi is private for tenant/security isolation.
- Cloud Run/Cloud Scheduler require Cloud Billing; Firebase linked project uses Blaze (pay-as-you-go with no-cost quotas), not Spark-only. Cloud Scheduler provides three free jobs per billing account per month; use one shared scheduler where possible. Check actual region/billing-account quotas for Cloud Run Jobs vs services, Firestore operations/storage, Secret Manager access/versions, Artifact Registry, build, logs, egress and AI APIs. No unapproved billable feature or automatic paid upgrade.
- Set configurable conservative quota ceilings, reserve headroom, limit instances/tasks, batch size, timeout, retry, log/artifact retention, cap schedule frequency and pause before estimated limits. Budget alerts are not hard cost caps; reconcile measured usage with provider billing dashboards; pause on missing/stale quota evidence. Owner must approve linking billing and accept residual cost risk before Cloud deployment. Do not claim a guaranteed zero-dollar service.
- Reference docs (checked 2026-11-25): [GitHub billing](https://docs.github.com/en/actions/concepts/billing-and-usage), [included usage](https://docs.github.com/en/billing/reference/product-usage-included), [Cloud Run](https://cloud.google.com/run/pricing), [Scheduler](https://cloud.google.com/scheduler/pricing), [Firestore](https://firebase.google.com/docs/firestore/pricing), [Firebase plans](https://firebase.google.com/docs/projects/billing/firebase-pricing-plans), [Shopify distribution](https://shopify.dev/docs/apps/launch/distribution), [Shopify access tokens](https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens).

## 6. Agent rules and acceptance

- Follow this file and `genxi-dashboard.html`. Preserve original T001–T038 IDs; new T039–T061 add source migration and hybrid DevOps. Existing descriptions/dependencies changed where necessary for remote operation and safety. T039 is complete as a source audit only; no application code has been copied or implemented.
- Model labels carried from original (Luna Medium/High, Sol 5.6 Medium) are historical assignment labels, not guaranteed available model IDs; select available equivalents. Report Roman Urdu; code/comments English.
- On `Task Txxx shuru karo`, read plan, verify dependencies Done, inspect repo/AGENTS.md, implement, test and record evidence. Pending = not started/blocked; Implemented = code written but unverified; Done = verified acceptance. Update both files in same commit; no fabricated status. Do not deploy, enable billing, publish live products or change original repo without appropriate owner approval.
- Stage A acceptance: independent Genxi identity and repo, GitHub preview and approved live test, durable queue/resume/tenant isolation, review/publish, cost guard and webhook tests. Stage B acceptance: both providers same contract, migrated authoritative state, switch both directions, interruption recovery, no duplicate publish, shared usage limits and no uncontrolled charges. Phase 8 is deliberately deferred until owner opts in; GitHub launch does not depend on Cloud readiness.

**Next task:** T040 Done. Private repository `shaazad007/Genxi` contains the verified migration at commit `7e74aff30ccc45e858e08536c967b8f23e1deb37`; no inherited workflow is present. T041 is the next Pending task and has not been started. The user directed this session to ignore `MASTER_WORKFLOW.md`; no numeric stage or transition is asserted. Pre-implementation backup `backups/SOURCE_BACKUP_2026-11-25_15-45-59_BEFORE_T040_REPO_IMPORT.zip` verified 23/23 entries. Do not automatically advance stages.

## 7. Phases and tasks

### Phase 1: Foundation & independent identity

| ID | Task | Model | Level | Depends on | Status |
|---|---|---|---|---|---|
| T001 | Genxi repo structure, README, environment template and AGENTS.md | Luna | Medium | T040 | Pending |
| T002 | Create independent Genxi Shopify app; validate distribution and scopes | Luna | Medium | T041 | Pending |
| T003 | Portable Node.js control API and health endpoint; local HTTPS pilot gateway | Luna | Medium | T001, T042 | Pending |
| T004 | Server-only secrets, encrypted token vault and redacted logging | Luna | High | T003 | Pending |
| T005 | Genxi design tokens, app ID and white/green UI | Luna | Medium | T001, T040 | Pending |
| T039 | Audit AutoGenSEO source, pin upstream commit, record license/provenance | Luna | Medium | - | Done |
| T040 | Create separate private Genxi repository; copy source only, disable inherited workflows; reset identity | Luna | High | T039 | Done |
| T041 | Audit inherited secrets, shop IDs, history, data, workflows and package identifiers | Luna | High | T040 | Pending |
| T042 | Extract portable engine and execution/state adapter interfaces | Luna | High | T001, T041 | Pending |

### Phase 2: OAuth and Login

| ID | Task | Model | Level | Depends on | Status |
|---|---|---|---|---|---|
| T006 | /auth/install redirect to Shopify | Sol 5.6 | Medium | T002, T003 | Pending |
| T007 | /auth/callback: HMAC check, state nonce, code to token | Sol 5.6 | Medium | T006, T004 | Pending |
| T008 | One-time deep-link code exchange; encrypted server-side offline token vault | Sol 5.6 | Medium | T007 | Pending |
| T009 | App: Login with Shopify and secure Genxi session storage | Luna | High | T005, T008 | Pending |
| T010 | Session check, re-auth, logout | Luna | Medium | T009 | Pending |
| T011 | Mandatory webhooks: app/uninstalled, data request and redact | Luna | High | T007 | Pending |

### Phase 3: AI Processing Backend

| ID | Task | Model | Level | Depends on | Status |
|---|---|---|---|---|---|
| T012 | POST /generate contract; shared worker input schema | Luna | High | T003, T042 | Pending |
| T013 | Gemini vision prompt with Pakistani fashion vocabulary | Sol 5.6 | Medium | T012 | Pending |
| T014 | Structured JSON output, validation, retries | Luna | High | T013 | Pending |
| T015 | Fallback chain: Gemini → Groq → Cloudflare Workers AI | Luna | High | T014 | Pending |
| T016 | No server image storage; scrub logs, previews and artifacts | Luna | Medium | T012 | Pending |
| T017 | Durable per-shop usage counter and rate limit | Sol 5.6 | Medium | T012, T043 | Pending |
| T043 | GitHub durable state adapter: per-shop queue, checkpoint, CAS and usage ledger | Luna | High | T042, T004 | Pending |
| T044 | GitHub Actions runner: preview/live, enqueue, schedule, bounded retry and concurrency | Luna | High | T042, T043, T015, T016, T008 | Pending |
| T046 | GitHub pilot control-plane deployment and secure per-shop job authorization | Luna | High | T008, T011, T044 | Pending |
| T047 | GitHub free allowance guard, workflow timeout, AI quota and safe pause | Luna | High | T044, T017 | Pending |

### Phase 4: App UI and Product Flow

| ID | Task | Model | Level | Depends on | Status |
|---|---|---|---|---|---|
| T018 | App shell and bottom navigation | Luna | Medium | T005 | Pending |
| T019 | Shopify GraphQL Admin API adapter: scoped collections/products, pagination | Sol 5.6 | Medium | T008 | Pending |
| T020 | Local cache, tags and queue view; sync authoritative durable queue | Luna | High | T018, T043 | Pending |
| T021 | Home screen: 3 KPIs, progress, recent items | Luna | Medium | T018, T020 | Pending |
| T022 | Categories screen and thumbnail grid | Luna | Medium | T018, T019 | Pending |
| T023 | Long-press checkbox sheet and apply-to-rest | Luna | High | T020, T022 | Pending |
| T024 | Product detail screen | Luna | Medium | T022 | Pending |
| T025 | Queue and processing flow via execution adapter, preview/live guard | Sol 5.6 | Medium | T012, T014, T020, T023, T044, T045, T047 | Pending |
| T026 | Review screen: editable fields, tag-vs-image warning | Luna | High | T025 | Pending |
| T027 | Publish approved SEO to Shopify with idempotent reconciliation | Sol 5.6 | Medium | T019, T026, T043 | Pending |
| T045 | Hybrid mode API and app Settings: GitHub active; Cloud not configured; pause/resume | Luna | High | T018, T044 | Pending |

### Phase 5: Trial and Plans

| ID | Task | Model | Level | Depends on | Status |
|---|---|---|---|---|---|
| T028 | Server-side trial counter enforcement | Luna | High | T017 | Pending |
| T029 | Plans screen and plan limits | Luna | Medium | T018, T028 | Pending |
| T030 | Shopify Billing API, subject to approved distribution model | Sol 5.6 | Medium | T007, T029, T002 | Pending |

### Phase 6: Theme Health (read-only)

| ID | Task | Model | Level | Depends on | Status |
|---|---|---|---|---|---|
| T031 | read_themes permission flow | Luna | Medium | T007 | Pending |
| T032 | Theme analyzer: schema, heavy scripts, lazy loading, mobile | Sol 5.6 | Medium | T031 | Pending |
| T033 | Issue report as MD files and Health tab | Luna | High | T018, T032 | Pending |
| T034 | Fix-it-for-me request button (no auto-edit) | Luna | Medium | T033 | Pending |

### Phase 7: GitHub-first QA and Launch

| ID | Task | Model | Level | Depends on | Status |
|---|---|---|---|---|---|
| T035 | GitHub-first end-to-end test on own store; preview then approved live | Luna | High | T027, T046, T047, T048, T028 | Pending |
| T036 | Token usage and cost check in Google AI Studio | Luna | Medium | T014 | Pending |
| T037 | Privacy policy, terms and Shopify distribution/review readiness | Luna | Medium | T011, T002 | Pending |
| T038 | Pilot with 2–3 brands only after permitted distribution and billing | Luna | Medium | T035, T037, T030, T036 | Pending |
| T048 | GitHub-only queue restart, duplicate prevention, isolation and secret leakage tests | Luna | High | T025, T046, T047 | Pending |

### Phase 8: Google Cloud & Firebase (later)

| ID | Task | Model | Level | Depends on | Status |
|---|---|---|---|---|---|
| T049 | Explicit owner opt-in: create independent Google Cloud/Firebase project, billing and region audit | Luna | Medium | T035 | Pending |
| T050 | Firestore authoritative state adapter: jobs, ledgers, lease, mode epoch; rules and indexes | Luna | High | T049, T043 | Pending |
| T051 | Cloud Run service/control API and worker container/Cloud Run Jobs; scale-to-zero | Luna | High | T049, T042, T004 | Pending |
| T052 | Secret Manager, service accounts, GitHub OIDC/WIF and least privilege | Luna | High | T049, T051 | Pending |
| T053 | Cloud Scheduler authenticated trigger; disable duplicate cron execution | Luna | High | T051, T052, T050 | Pending |
| T054 | Firebase auth/session integration, tenant access rules and emulator tests | Luna | High | T050, T051, T052, T009 | Pending |
| T055 | Google free-tier quotas: preflight guards, budget alerts, max instances, log/registry controls | Luna | High | T049, T050, T051, T053 | Pending |
| T056 | Cloud worker adapter, shared contract parity and staging preview test | Luna | High | T051, T052, T053, T054, T055, T015 | Pending |

### Phase 9: Hybrid switch & failover QA

| ID | Task | Model | Level | Depends on | Status |
|---|---|---|---|---|---|
| T057 | Migrate GitHub queue/ledger/checkpoints to Firestore after drain; reconcile counts and IDs | Luna | High | T056, T048 | Pending |
| T058 | Atomic mode controller, shared leases and fencing; GitHub and Cloud use same state authority | Luna | High | T057, T045, T052 | Pending |
| T059 | Switch GitHub OFF → Cloud ON and reverse; auto fallback on eligible failures, never dual writers | Luna | High | T058 | Pending |
| T060 | Failover, interrupted write, quota exhaustion, rollback, multi-tenant and cost tests | Luna | High | T059, T056, T055 | Pending |
| T061 | Production acceptance: both modes verified; runbook and dashboard evidence | Luna | Medium | T060, T035 | Pending |
