# README Agent Bootstrap Snippet

Is block ko apne project ke `README.md` ke start ya `AI Agent Instructions` section mein paste karein:

```md
## AI Agent Startup Rule

Kisi bhi implementation, debugging, planning ya file edit se pehle `AGENTS.md` (agar mojood ho) aur root ki `PROJECT_MASTER_DISCIPLINE.md` lazmi read karo. Us discipline ke mutabiq `workspace/MASTER_TASKS.md`, `CURRENT_STATUS.md`, `CURRENT_TASK.md`, `LAST_CHECKPOINT.md`, latest relevant agent log, Git state aur `workspace/addons/inbox/` check karo. Agar koi task 🟡 Implementation mein ho to usi ko verified checkpoint se resume karo; already-done kaam repeat na karo. Naya add-on mile to owner se confirmation liye baghair integrate/implement na karo. Har meaningful milestone ke baad checkpoint, task board aur dashboard sync karna mandatory hai. Owner-facing report Roman Urdu mein do.
```

## New session mein agent ko dene wali short command

```text
README.md aur AGENTS.md read karo aur unki startup instructions strictly follow karo. Current project state ko files + Git se recover karke wahi se continue karo.
```

## Optional extra-strict version

```text
README.md + AGENTS.md read karo. PROJECT_MASTER_DISCIPLINE follow karo. Pehle project state recover karo; bina checkpoint/task board/Git verify kiye koi naya kaam start mat karo.
```
