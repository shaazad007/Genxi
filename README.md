# Project README — Universal Development & Agent Workflow

This README is the common entry point for any project managed with AI coding agents (Codex, ChatGPT or other development agents). Keep it in the project root. Project-specific requirements, architecture, task IDs and technology choices belong in the project plan, not in this universal file.

## 1. Standard project control files

| File | Purpose |
| --- | --- |
| `README.md` | Universal project entry point and startup workflow (this file). |
| `AGENTS.md` | Project-specific agent instructions, repository rules and working boundaries. |
| `PROJECT_MASTER_DISCIPLINE.md` | Shared development discipline, quality gates and verification rules. |
| `README_AGENT_BOOTSTRAP_SNIPPET.md` | Standard startup prompt/instructions for initializing an agent session. |
| `<PROJECT>_PLAN.md` | Project-specific scope, architecture, phases, task IDs, dependencies, acceptance criteria and status. |
| `<project>-dashboard.html` | Interactive development dashboard reflecting the actual task status. |

Names in angle brackets are patterns, not literal filenames. For example, Genxi uses `GENXI_PLAN.md` and `genxi-dashboard.html`. If a project uses other names, discover them from `AGENTS.md` and the root directory; do not create duplicate planning files. An existing `tasks.json` or other canonical task registry must also be respected if the project declares it authoritative.

## 2. Mandatory agent initialization

Before editing code or starting a task:

1. Confirm the intended project root and repository, branch, current commit and working-tree status. If the repository does not yet exist, treat that as a foundation task, not as a successful check.
2. Read `AGENTS.md` (including applicable nested agent instructions), `PROJECT_MASTER_DISCIPLINE.md` and `README_AGENT_BOOTSTRAP_SNIPPET.md` in full.
3. Read the project plan and the dashboard task data; identify the actual task registry and any referenced specifications, approved UI prototypes or acceptance criteria.
4. Inspect the relevant existing source code, configuration, tests and previous evidence. Do not assume a project is empty or that a feature is already wired.
5. Verify project identity, selected task, dependencies, permitted scope and environment. Report any contradictions or missing required inputs before affected work proceeds; do not silently rewrite requirements.
6. Continue with authorized, unblocked work. Do not restart completed phases or create unrelated workspaces.

The actual instructions in the existing control files apply; this README is a common navigation guide, not a replacement for them. Honor the project-specific authority and conflict-resolution rules. If instructions conflict and the existing rules do not resolve the conflict, report the issue and avoid the affected change until resolved.

## 3. Task execution lifecycle

- Start only the requested task, or the next eligible task when autonomous continuation has explicitly been authorized. Respect phase gates and dependencies.
- Preserve existing task IDs. A dependency must meet the required completion state before dependent work starts. Never bypass a blocked task by changing its status.
- Inspect → implement → integrate/wire → test → verify acceptance → record evidence → synchronize task status → report.
- Use the project's actual status vocabulary. When the plan uses `Pending`, `Implemented`, `Done`: Pending means not started or blocked; Implemented means code exists but acceptance is not fully verified; Done means the required verification and acceptance criteria passed. Do not invent extra status labels. If a different registry is authoritative, use its definitions.
- A UI mockup, stub, successful compilation or commit alone does not prove end-to-end completion. Verify real integrations and representative failure paths where applicable. If credentials, devices or external services are missing, report which tests remain unverified.
- Keep the plan, dashboard and any declared task registry consistent. Update statuses only with supporting evidence, ideally in the same commit. Recalculate progress from verified completion, not estimates. Keep blocked/pending tasks visible.
- Record task ID, changed paths, test commands/results, evidence references, remaining blockers and commit SHA when available. Use the evidence directory specified by the project.

## 4. Universal development rules

- Work in the authorized project root. Keep source, tests, configuration and documentation organized there; do not scatter duplicate projects across directories.
- Protect existing user changes. Never overwrite unrelated work, reset history, copy production data or modify another project's repository without authorization.
- Reuse existing tested components where appropriate, but audit compatibility, license, provenance and security. For a duplicated project, keep identity, credentials, environments, deployment targets and runtime data independent.
- Follow the approved design and functional scope. Do not add unnecessary screens, features, dependencies or services without authorization.
- Wire UI controls to the correct application logic, persistence and backend where required. Do not present mocked values or placeholder success messages as real results.
- Keep secrets outside source control, client binaries and logs. Provide safe environment templates with placeholder values; never include actual keys, tokens or passwords.
- Use the platform's proper validation/build/test commands after detecting the actual technology stack. Do not assume every project uses Flutter, Node.js, Firebase or any particular provider.
- Preserve data integrity with validation, appropriate access controls, error handling, bounded retries and idempotency where relevant.
- For external APIs, cloud hosting or CI/CD, verify current limits and pricing. Respect the project's approved budget and free-tier policy; never enable paid resources, deploy to production or perform destructive operations without appropriate authorization.
- Treat generated builds, artifacts, migrations and releases as verified only after the applicable checks actually pass. Clearly distinguish local tests, simulated tests and live tests.

## 5. Dashboard and progress discipline

The HTML dashboard is a task-status view, not evidence of implementation by itself. Open it in a browser to inspect phases, dependencies and progress. Follow its existing data format and interaction design. Do not mark a task complete merely to advance the progress bar. Keep its task IDs, names, dependency references and statuses aligned with the canonical plan/registry; validate that there are no missing IDs, duplicate IDs or dependency cycles after authorized planning changes.

## 6. Starting or resuming an agent session

Open a terminal in the correct project folder. Example (Windows PowerShell, Genxi only):

```powershell
Set-Location 'C:\sara\genxi'
Get-ChildItem -Force
codex
```

Use your actual project path and available agent CLI. The example does not install Codex or create a repository. If the project provides a dedicated startup script, prefer that script.

Copy this universal initialization prompt into your coding agent:

```text
Initialize this project in the current working directory.
Read README.md, AGENTS.md, PROJECT_MASTER_DISCIPLINE.md and
README_AGENT_BOOTSTRAP_SNIPPET.md. Discover and read the actual project plan,
HTML dashboard and any authoritative task registry or referenced specification.
Follow the applicable agent instructions and project discipline.
Verify the project root, repository/branch (if initialized), current status,
last verified evidence, task dependencies and actual source state.
Do not create duplicate project folders, change unrelated repositories or
claim unverified work as complete. Report any missing files or blockers.
If I have assigned a task, execute it only when eligible; otherwise report
the current progress and the next ready task. Continue autonomously only if
explicitly authorized. After verified work, record evidence and synchronize
all required task-status files. Use the project's reporting language.
```

For a specific task, use the project's existing command format (for example, `Task T039 shuru karo` for a project using that ID). For a resumed session, first re-read the current files and working tree; prior chat context is not a substitute for the latest project state.

## 7. Build and run instructions

This section is intentionally stack-neutral. The agent must locate the actual setup/build/run commands in the project plan or maintained technical documentation and add a project-specific quickstart in the designated documentation file when required. Include prerequisites, environment variable names, development/test commands and production deployment prerequisites. Do not place real credentials in documentation or claim that commands have run when they have not.

## 8. End-of-task report

Use the project's mandated reporting format, if defined. Otherwise include:

- Project name, task ID and status.
- Work completed and changed files.
- Verification commands, actual results and evidence location.
- Remaining blockers, limitations and untested integrations.
- Plan/dashboard synchronization and commit SHA (if committed).
- Next eligible task, or required owner decision.

## 9. Reusing this README

Copy this file unchanged into each new project's root alongside the appropriate agent instructions, discipline file, bootstrap snippet, project plan and dashboard. The filenames, task IDs, stack, implementation scope, repository, cloud providers and runtime credentials of one project must not be assumed to apply to another.

**Core principle:** one authorized workspace, one declared source of task truth, evidence-based completion, synchronized progress and independent project identity.
