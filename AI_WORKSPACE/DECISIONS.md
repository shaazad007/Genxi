# Decisions and Audit Dispositions

## DEC-001 — T039 audit disposition (2026-11-25)

- Finding: upstream provenance pinned to `shaazad007/AutogenSeo` commit `1d22e41cf4827dd36305cdc30a8114341d6e6995`; license metadata is absent and package metadata says `UNLICENSED` / `private: true`.
- Disposition: mark T039 Done for the source audit. User explicitly requested T040; authenticated GitHub login `shaazad007` matches the upstream owner and has admin permission, so task-specific authorization for the private migration is established. Keep T040 Pending until the private destination and required governance setup are available.
- This task-specific authorization does not create an open-source license or permit public redistribution.

## DEC-002 ? Private source import scope (2026-11-25)

- Imported the pinned engine allowlist only; omitted all upstream workflows, store config/data, preview output, queues/history/logs, and fixture-driven tests. The Genxi package remains private and defaults to preview.
- Replaced the upstream store name/url sanitizer literals with configurable `GENXI_BRAND_NAME` and `GENXI_BRAND_URL` environment values. No numeric stage or stage transition is asserted; `MASTER_WORKFLOW.md` was ignored for this session per user direction.
