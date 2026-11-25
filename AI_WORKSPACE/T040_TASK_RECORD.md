# T040 ? Create separate private Genxi repository

- Status: Implemented (source imported and statically validated; GitHub push pending)
- Authorization: user requested T040. Authenticated GitHub login `shaazad007` matches the upstream owner and has admin permission.
- Dependency: T039 Done.
- Intended scope: create the independent private Genxi repository, copy only authorized source, keep inherited workflows disabled, reset project identity, and exclude credentials, production data, old queue/history, caches, artifacts, and private shop identifiers.
- Acceptance: private target repository exists; clean source is present with provenance; no live inherited workflow is enabled; package/app identity is independent; backup and verification evidence recorded.
- Prerequisites: target `shaazad007/Genxi` exists and is private/empty; `gh` is authenticated as `shaazad007`; `DEVELOPMENT_RULES.md` exists. User directed this session to ignore `MASTER_WORKFLOW.md`; no stage transition is asserted. Workspace currently has no Git repository.
- Pre-implementation backup: `backups/SOURCE_BACKUP_2026-11-25_15-45-59_BEFORE_T040_REPO_IMPORT.zip` (41,536 bytes; SHA-256 verified for 23/23 entries against source; no source edits made before backup).
- Source provenance: `shaazad007/AutogenSeo` commit `1d22e41cf4827dd36305cdc30a8114341d6e6995`.
- Imported: `engine/index.js`, `engine/lib/*.js` (18 JavaScript files total); `engine/package.json`, `engine/README.md`, `engine/PROVENANCE.md`; root `.gitignore` updated. IDE-local `.idea/` state, local properties, and backup archives are excluded from Git. Two brand-specific sanitizer files were neutralized to use `GENXI_BRAND_NAME` / `GENXI_BRAND_URL`.
- Static validation: 18/18 JavaScript files pass `node --check`; 16 files byte-match pinned upstream, two expected brand-neutralized differences; package is private and starts in preview mode; no workflow, flagged credential pattern, or old brand identifiers found. Tests/builds not run.
- Next action: initialize clean `main`, commit the migration and governance records, then push to the already-created private `shaazad007/Genxi`; verify remote contents and workflow state before marking Done.
