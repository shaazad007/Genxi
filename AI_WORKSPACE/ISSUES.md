# Open Issues

## ISSUE-001 — No general upstream license

- Related tasks: T040 and downstream source migration tasks
- Finding: the audited upstream repository has no license metadata, no root `LICENSE`/`LICENCE`/`COPYING` file, and `package.json` declares `UNLICENSED` and `private: true`.
- Task-specific disposition: user explicitly started T040; authenticated GitHub login `shaazad007` matches the upstream owner and has admin permission. This authorizes the requested private migration for this task.
- Scope limit: upstream remains `UNLICENSED`; this does not grant a general public license. Do not publicly redistribute without separate rights.
- Status: Resolved for the authorized private migration; source is copied only to the private Genxi repository.

## ISSUE-002 — Initial GitHub/governance blockers (resolved)

- Resolution: `DEVELOPMENT_RULES.md` was provided, the user directed this session to ignore `MASTER_WORKFLOW.md`, GitHub CLI authenticated as `shaazad007`, and the private target repository was created and verified.
- Status: Resolved. No numeric stage was asserted.

## ISSUE-003 — Placeholder Kotlin package identifier

- Related task: T002
- Finding: `engine/package.json` uses private package name `genxi-engine` and Gradle root name is `genxi`, but the existing root Kotlin starter still declares `org.example`. The planned Flutter application ID `com.genxi.app` is not present or validated.
- Impact: the Kotlin starter is not the Genxi app and must not be shipped as such. T002 must establish and validate the actual Shopify/Flutter app identifiers.
- Status: Open; no application package was changed during T041.

## ISSUE-004 — GitHub Actions enabled before preview validation

- Related task: T044
- Finding: repository Actions setting is enabled, while the repository currently has zero workflow files and zero workflow runs; no repository secrets, variables or environments are configured.
- Impact: a future workflow could execute as soon as added. `GENXI_PLAN.md` says to keep inherited Actions disabled until Genxi preview tests pass.
- Owner/technical action: review or disable Actions before adding a workflow in T044. T041 was an audit; no repository setting was changed.
- Status: Open; no inherited workflow is currently present or running.
