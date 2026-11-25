# Next Task

- Task: T040 — Create separate private Genxi repository and copy source only after rights are clear.
- Status: Implemented (T040 source import statically validated; private GitHub push pending).
- Authorization: user explicitly started T040; authenticated account `shaazad007` is the upstream owner and has admin permission.
- Prerequisites: target `shaazad007/Genxi` is private and empty; `gh` authenticated as `shaazad007`; `DEVELOPMENT_RULES.md` exists. User directed this session to ignore `MASTER_WORKFLOW.md`; no stage transition is asserted.
- Backup: `backups/SOURCE_BACKUP_2026-11-25_15-45-59_BEFORE_T040_REPO_IMPORT.zip`, 41,536 bytes; 23/23 ZIP entries SHA-256 verified.
- Imported allowlist into `engine/`; 18 JavaScript syntax checks pass, no old brand/credential patterns or workflows found.
- Next: commit to clean `main`, push to private `shaazad007/Genxi`, verify remote contents, then close T040 without advancing phases.
