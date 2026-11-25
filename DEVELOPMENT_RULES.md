# Permanent development rules

1. Preserve existing working functionality.
2. Inspect before modifying.
3. Backup before EVERY implementation command; never skip.
4. Never expose secrets/API keys.
5. Never hardcode credentials.
6. Reuse existing architecture where appropriate.
7. Avoid duplicate services/models.
8. Do not rewrite working modules unnecessarily.
9. Make incremental changes.
10. Keep backward compatibility unless explicitly approved otherwise.
11. Validate after implementation.
12. Update documentation after every task.
13. Record every modified/created/deleted file.
14. Never mark a stage COMPLETE without verification.
15. Never fabricate test results.
16. Never fabricate previous development history.
17. Clearly distinguish VERIFIED from INFERRED information.
18. If requirements conflict with existing architecture, STOP and document the conflict before destructive changes.
19. Do not automatically clean/delete build or cache directories unless explicitly requested.
20. Source code remains the technical source of truth.

## Mandatory command order

1. Read README_FIRST and the complete mandatory governance reading order.
2. Determine current project stage from MASTER_WORKFLOW and CURRENT_STATUS; verify against code.
3. Create timestamped SOURCE_BACKUP_YYYY-MM-DD_HH-mm-ss_BEFORE_TASK-NAME.zip in backups; verify exists, nonzero size, readable entries and important source directories. The helper also compares every entry SHA256. On failure STOP and report BACKUP FAILED — SOURCE CODE NOT MODIFIED.
4. Create/update next TASK_NUMBER_SHORT_NAME.md with verified backup and starting stage.
5. Inspect relevant implementation.
6. Make the smallest safe authorized implementation; never silently redesign or remove functioning behavior.
7. Run appropriate validation/tests, without live external writes unless authorized.
8. Update status/workflow, decisions/issues, next task, changelog and append-only activity log.
9. Record all created/modified/deleted files and validation evidence in task.
10. Report actual results and limitations.
11. STOP. Do not implement the next stage automatically.

Backup source/configuration includes applicable lib/src/app/platform/backend/frontend/scripts/tests/manifests/schema and current AI_WORKSPACE documents. Exclude generated/heavy directories (build, .gradle, .dart_tool, node_modules, dist, coverage, caches/temp/logs/IDE caches), binaries/APK/AAB and AI_WORKSPACE/backups. Exclude existing root backup/ too. Never include secrets unnecessarily; document only setting/environment names. Record exclusions and restoration implications. Existing ZIPs are immutable. Backup must precede source edits, including maintenance scripts outside this workspace.

For each meaningful action append timestamp, Agent, Task ID, Stage, Action, Files affected, Result, Validation, Notes. Never rewrite previous log entries. Maintain task records and concise changelog entries. At each major stage update a compact handoff referencing canonical documents, without copying source. Initial setup exceptionally bootstraps workspace and inspects code before its first backup; it never changes application source.

Legacy specification is intent, not license to replace sqflite/http/setState with proposed alternatives. Live Shopify writes require explicit authorization. New session user instructions supersede local guidance; document any material exception.
