# Open Issues

## ISSUE-001 — No general upstream license

- Related tasks: T040 and downstream source migration tasks
- Finding: the audited upstream repository has no license metadata, no root `LICENSE`/`LICENCE`/`COPYING` file, and `package.json` declares `UNLICENSED` and `private: true`.
- Task-specific disposition: user explicitly started T040; authenticated GitHub login `shaazad007` matches the upstream owner and has admin permission. This authorizes the requested private migration for this task.
- Scope limit: upstream remains `UNLICENSED`; this does not grant a general public license. Do not publicly redistribute without separate rights.
- Status: Resolved for the authorized private migration; source has not yet been copied.

## ISSUE-002 — Required workflow and development-rule files missing

- Finding: `MASTER_WORKFLOW.md` and `DEVELOPMENT_RULES.md` are absent; this workspace has no `.git` repository; GitHub CLI 2.105.0 is installed but `gh auth status` returns exit code 1; the connected GitHub tools have no repository-creation action; target `shaazad007/Genxi` returns 404.
- Impact: authoritative numbered stage and development-command rules cannot be verified, and no authenticated CLI channel can create the requested private GitHub repository.
- Owner action: complete `gh auth login` for the intended GitHub account, and provide the missing authoritative governance files or authorize establishing them.
- Status: Open; no application source copied and no workflow transition recorded.
