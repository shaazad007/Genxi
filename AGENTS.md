# Mandatory project development governance

READ README.md BEFORE MODIFYING THE PROJECT, then follow its complete mandatory reading order and DEVELOPMENT_RULES.md for every development command.

Determine the current authoritative stage, create and VERIFY a timestamped source ZIP before any implementation, and create/update a numbered task record before editing application source. If backup fails, STOP: BACKUP FAILED — SOURCE CODE NOT MODIFIED.

Inspect actual code; preserve working architecture and functionality; implement only the authorized task; validate; update status, workflow, issues, decisions, next task, changelog, and append-only activity log; record all created/modified/deleted files; report and STOP. Never automatically advance to the next stage. AI_WORKSPACE contains governance and maintenance tools, never application runtime code.

MASTER_WORKFLOW.md is the sole authoritative stage numbering. Legacy CHATGPT_PROJECT_HANDOFF and PROJECT_AI_AGENT_MASTER_SPEC are historical/product-intent references. Verify their claims against actual source. Current session user instructions take precedence. Never copy credentials into documentation or backups unnecessarily; never perform live Shopify writes without explicit authorization.

# Universal Agent Rules: Anti-Loop & Token Safety

## 1. Retry Limits
- If the same command fails twice, do NOT run it a third time unchanged.
- Before any retry, state in one line: (a) the root cause, (b) what you changed.
- "Retry hoping it works" is forbidden. Every retry must differ from the previous attempt.
- After 3 total failed attempts at the same goal (even with different approaches), STOP and report to the user: what you tried, what failed, your best hypothesis, and what you need.

## 2. Diagnose Before Acting
- Read the FULL error message first. Classify it: environment/lock/permission, config/dependency, code logic, test assertion, or timeout.
- Fix the classified cause, not the symptom.
- Do not re-run the whole suite to check a one-file change. Run only the specific test/file.

## 3. Time Limits
- Any single command expected to run longer than 3 minutes must use a timeout.
- If a command hangs with no output for 2 minutes, kill it and diagnose. Do not wait indefinitely.
- Never start a long-running or watch-mode process (dev servers, `--watch`, emulators) in the foreground without a timeout or background mode.

## 4. No Repeated Reads or Searches
- Do not re-read a file you already read unless it changed.
- Do not repeat the same search or grep with the same query.
- Keep a short running note of what is already known so it is not rediscovered.

## 5. Scope Discipline
- Fix only what was asked. Do not refactor, upgrade dependencies, or "clean up" unrelated code while debugging.
- Do not delete build/cache directories, lockfiles, or generated files as a first resort. Try targeted fixes first.
- Never use destructive commands (`rm -rf`, `git reset --hard`, force push) without asking.
- Do not build/run if you required to build/run ask to owner before or tell to owner build/rund.

## 6. Checkpoints
- After every 5 tool calls without clear progress, pause and write: goal, what is done, what is blocking, next single step.
- If the next step is the same as a previous failed step, change approach or ask the user.

## 7. Stuck Protocol
When stuck, stop and output:
1. Goal
2. What was tried (with results)
3. Root cause hypothesis
4. Options with trade-offs
5. The question for the user
   Do not continue burning tokens after this point until the user responds.

## 8. Windows-Specific
- File lock / "failed to delete" / DLL permission errors: kill the lingering processes first (`taskkill /F /IM <app>.exe /T`), then retry once. Never kill the agent's own parent process.
- Prefer simple `cmd` commands over complex PowerShell one-liners. In PowerShell, escape `$` variables properly or write a `.ps1` script file instead of inline code.

## 9. Flutter-Specific (ignore if not Flutter)
- `pumpAndSettle` timeout means an infinite animation, loader, stream, or timer is active. Replace with `await tester.pump(const Duration(milliseconds: 500));` or pump a fixed number of frames.
- Use `--no-pub` on repeated test runs after the first successful `pub get`.
- Run a single test file (`flutter test path/to/test.dart`) while iterating, not the full suite.

## 10. Output Discipline
- Keep progress messages short. No long summaries after each step.
- Do not paste full logs; quote only the relevant error lines.
