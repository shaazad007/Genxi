# UNIVERSAL PROJECT MASTER DISCIPLINE

**Version:** 1.0  
**Use:** Codex, Gemini, GPT ya kisi bhi coding agent ke saath  
**Goal:** Project ko chat memory se independent banana, taake PC/account/session change hone par kaam wahi se resume ho.

## 1) Golden Rule
Agent kisi bhi implementation se pehle:
1. `README.md`
2. `AGENTS.md` agar mojood ho
3. `PROJECT_MASTER_DISCIPLINE.md`
4. `workspace/MASTER_TASKS.md`
5. `workspace/CURRENT_STATUS.md`
6. `workspace/CURRENT_TASK.md`
7. `workspace/LAST_CHECKPOINT.md`
8. latest relevant `workspace/agent_logs/`
9. `git status`, current branch, `git log -10 --oneline`, aur zarurat par `git diff`

read/check kare.

**Source of truth:** project files + Git. Chat history secondary hai.

---

## 2) Required Structure

Agar compatible structure pehle se nahi hai to agent ye banaye:

```text
project-root/
├─ README.md
├─ AGENTS.md
├─ PROJECT_MASTER_DISCIPLINE.md
└─ workspace/
   ├─ MASTER_TASKS.md
   ├─ CURRENT_STATUS.md
   ├─ CURRENT_TASK.md
   ├─ LAST_CHECKPOINT.md
   ├─ CHANGELOG_AGENT.md
   ├─ RECOVERY.md
   ├─ DECISIONS.md
   ├─ BLOCKERS.md
   ├─ agent_logs/
   ├─ phases/
   ├─ addons/
   │  ├─ inbox/
   │  ├─ integrated/
   │  └─ rejected/
   └─ dashboard/
      ├─ MASTER_DASHBOARD.html
      ├─ dashboard_data.json
      └─ render_dashboard.*
```

Agar existing project mein similar governance already ho to duplicate files/folders mat banao. Existing system ko is discipline se map karo.

---

## 3) `MASTER_TASKS.md`

Project ki official task registry.

Har task mein:

| Field | Required |
|---|---|
| ID | Unique task ID |
| Phase | Phase/add-on |
| Task Name | Short name |
| Model | Assigned model |
| Reasoning | Low / Medium / High / Xhigh / Max |
| Dependency | Independent ya dependent task |
| Status | 🔴 / 🟡 / ✅ / ⛔ |
| Brief | Roman Urdu short objective |
| Acceptance | Completion proof |
| Evidence | Test/commit/file proof |

Status:
- 🔴 Pending = start nahi hua
- 🟡 Implementation = kaam chal raha hai/incomplete
- ✅ Complete = code + required tests/evidence complete
- ⛔ Blocked = dependency/owner action required

**Incomplete task ko kabhi ✅ mark na karo.**

---

## 4) `CURRENT_STATUS.md`

Project ka current snapshot:

```text
Project:
Current Phase:
Current Active Task:
Last Completed Task:
Overall Progress:
Current Branch:
Last Known Good Commit:
Known Blockers:
Next Recommended Task:
Last Updated:
Updated By:
```

Task completion, new blocker, phase integration ya deploy ke baad update karo.

---

## 5) `CURRENT_TASK.md`

Sirf active task ki exact state:

```text
Task ID:
Task Name:
Phase:
Assigned Model:
Reasoning:
Status:
Branch:
Dependency:
Objective:
Scope:
Out of Scope:
Files Expected To Change:
Acceptance Criteria:
Tests Required:
Owner Gate:
Started At:
Last Updated:
```

Agar koi task active nahi:
`NO ACTIVE TASK`

---

## 6) `LAST_CHECKPOINT.md`

Laptop shutdown, agent limit, crash ya PC change ke baad exact resume point.

Har meaningful milestone ke baad update karo; task end ka intezar zaroori nahi.

```text
Task:
Status:
Checkpoint Time:
Agent:
Branch:
Last Commit:

COMPLETED SO FAR:
- ...

CURRENT EXACT POSITION:
- ...

NEXT EXACT ACTION:
1. ...
2. ...

FILES CHANGED:
- ...

TESTS RUN:
- ...

TEST RESULTS:
- ...

KNOWN RISKS:
- ...

BLOCKER:
- None / details

DO NOT REPEAT:
- ...
```

Ye interruption recovery ki sab se important file hai.

---

## 7) `CHANGELOG_AGENT.md`

Permanent concise history:

```text
Date/Time:
Agent/Model:
Task ID:
Files Changed:
What Changed:
Tests:
Commit:
Result:
```

Secrets ya raw debug dumps yahan nahi.

---

## 8) `RECOVERY.md`

Naya agent/session ye order follow kare:
1. README + AGENTS + discipline
2. `git status`
3. current branch
4. `git log -10 --oneline`
5. CURRENT_STATUS
6. CURRENT_TASK
7. LAST_CHECKPOINT
8. latest relevant agent log
9. uncommitted diff
10. same active task resume

Git aur checkpoint disagree karein to implementation rok kar discrepancy report karo.

---

## 9) `DECISIONS.md`

Important decisions dobara debate na hon:

```text
Decision ID:
Date:
Decision:
Reason:
Alternatives Rejected:
Affected Tasks/Files:
Can Revisit?: Yes/No
```

---

## 10) `BLOCKERS.md`

```text
Blocker ID:
Related Task:
Problem:
Owner Action Needed:
Technical Action Needed:
Since:
Status:
```

---

## 11) `agent_logs/`

Har session ka detailed log:

`YYYY-MM-DD_AGENT_SESSION.md`

Include:
- startup state
- findings
- files touched
- tests
- errors
- handoff

Tokens, passwords, OAuth secrets ya private keys kabhi log na karo.

---

## 12) Git Discipline

Branch preferred:

```text
task/<TASK-ID>-short-name
```

Checkpoint commits:

```text
checkpoint: C2-05 audit complete
checkpoint: C2-05 backend implemented
checkpoint: C2-05 storefront updated
complete: C2-05 zero-idle-storefront
```

Agar session/limit khatam hone ka chance ho:
1. safe code state
2. possible tests
3. LAST_CHECKPOINT update
4. CURRENT_TASK update
5. status 🟡 hi rakho
6. safe checkpoint commit
7. remote configured ho to push

---

## 13) Dashboard Discipline

Dashboard `MASTER_TASKS` ka visual mirror hai; separate truth source nahi.

Columns:
- ID
- Phase
- Task Name
- Model
- Reasoning
- Dependency
- Ready/Blocked
- Status
- Roman Urdu Brief
- Last Updated

Status change par:
1. task board update
2. dashboard data update
3. HTML regenerate/update
4. consistency verify

Mismatch mein task board + Git evidence priority hai.

---

## 14) Model / Reasoning Discipline

General rule:
- simple formatting/UI/text → light/cheap model + Low
- bounded coding → efficient model + Medium
- multi-file integration/debug → strong model + High
- architecture/security/migration/concurrency → advanced model + Xhigh
- Max sirf exceptional case mein

Expensive/advanced model ko simple rename, formatting, docs cleanup ya status update par use na karo.

---

## 15) Add-on / Future Phase System

Future feature ki standalone MD yahan drop hogi:

```text
workspace/addons/inbox/
```

Example:
`ADDON_VIDEO_CAMPAIGNS.md`

Har agent startup par inbox scan kare.

### Inbox empty
Normal work continue.

### New file mili
Implementation start **mat karo**.

Owner ko Roman Urdu mein bolo:

```text
Naya add-on mila hai: ADDON_VIDEO_CAMPAIGNS.md
Kya isko official project phase bana kar Master Tasks + Dashboard + Dependencies mein integrate karun?
Yes/No
```

Owner ke `Yes` ke baghair integration nahi.

---

## 16) Add-on Integration Procedure

Owner `Yes` bole to:
1. add-on read
2. duplicate/conflict check
3. phase ID assign
4. unique task IDs
5. dependencies map
6. model/reasoning review
7. acceptance criteria verify
8. `workspace/phases/PHASE_<ID>_<NAME>.md` create/update
9. MASTER_TASKS mein add
10. dashboard sync
11. DECISIONS mein integration record
12. source add-on ko `addons/integrated/` mein move/mark
13. new tasks 🔴 se start
14. existing active task ko owner priority change ke baghair disturb na karo

Conflict ho to auto-integrate mat karo; owner ko Replace / Extend / Reject options do.

---

## 17) Phase File Standard

```text
# PHASE <ID> — <NAME>

Goal:
Why:
Scope:
Out of Scope:
Dependencies:
Owner Decisions:
Tasks:
Acceptance Criteria:
Risks:
Rollback:
Status:
```

---

## 18) Interruption Protocol

Laptop band, AI limit finish, network issue, terminal crash:

Naya agent task zero se restart nahi kare.

Usko:
- checkpoint
- Git diff
- test state
- current task

dekh kar wahi se continue karna hai.

State unclear ho to pehle read-only audit; destructive rollback nahi.

---

## 19) Agent Handoff

Outgoing agent session end se pehle update kare:
- CURRENT_TASK
- LAST_CHECKPOINT
- CHANGELOG_AGENT
- session log
- MASTER_TASKS
- dashboard
- Git checkpoint

Incoming agent previous chat maangne se pehle project files/Git read kare aur already-done work repeat na kare.

---

## 20) Security

Kabhi commit/log na karo:
- API tokens
- refresh tokens
- client secrets
- passwords
- service account private keys
- production cookies

Use `.env`, ignored local credential files, Secret Manager ya secure storage. `.gitignore` verify karo.

---

## 21) Owner Gates

Owner approval ke baghair:
- production deploy
- live Shopify/theme destructive change
- destructive DB migration
- credential rotation
- project delete
- billing-affecting scale-up
- new add-on integration
- completed task rewrite

na karo, jab tak project-specific governance explicitly allow na kare.

---

## 22) Startup Checklist

```text
[ ] README read
[ ] AGENTS read (agar hai)
[ ] PROJECT_MASTER_DISCIPLINE read
[ ] git status checked
[ ] branch checked
[ ] MASTER_TASKS read
[ ] CURRENT_STATUS read
[ ] CURRENT_TASK read
[ ] LAST_CHECKPOINT read
[ ] addons/inbox scanned
[ ] blockers checked
[ ] active task identified
[ ] owner gate checked
```

Implementation uske baad.

---

## 23) Shutdown Checklist

```text
[ ] CURRENT_TASK updated
[ ] LAST_CHECKPOINT updated
[ ] MASTER_TASKS truthful
[ ] CURRENT_STATUS updated if needed
[ ] CHANGELOG_AGENT updated
[ ] session log saved
[ ] dashboard synchronized
[ ] tests/results recorded
[ ] git status reviewed
[ ] checkpoint/final commit created if safe
[ ] push if project workflow requires
```

---

## 24) Owner-facing Roman Urdu Report

```text
Task: C2-05
Status: 🟡 Implementation

Kya complete hua:
- ...

Abhi kahan rukay:
- ...

Test:
- ...

Next exact step:
- ...

Owner action:
- None
```

---

## 25) Universal Resume Instruction

```text
README.md, AGENTS.md aur PROJECT_MASTER_DISCIPLINE.md read karo.
Phir workspace/MASTER_TASKS.md, CURRENT_STATUS.md, CURRENT_TASK.md,
LAST_CHECKPOINT.md aur latest relevant agent log read karo.
git status, current branch, git log -10 --oneline aur relevant git diff inspect karo.
Agar koi task 🟡 Implementation mein hai to usi ko last verified checkpoint se resume karo.
Already completed kaam repeat mat karo.
Kisi naye task par mat jao jab tak current task complete, blocked ya owner-reprioritized na ho.
Har meaningful milestone ke baad checkpoint + task board + dashboard sync karo.
Owner-facing update Roman Urdu mein do.
```

---

## 26) Golden Rules Summary

1. Project files > chat memory.
2. Git evidence > agent claim.
3. Incomplete = 🟡.
4. Active task ko be-wajah chhor kar new task start nahi.
5. Har meaningful milestone par checkpoint.
6. New add-on → detect → owner confirmation → integrate.
7. Dashboard task state ka mirror.
8. Existing governance inspect kiye baghair duplicate system nahi.
9. Secrets logs/commits mein nahi.
10. Naya PC/account/session files + Git se resume kare.
