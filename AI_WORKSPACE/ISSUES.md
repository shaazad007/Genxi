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
