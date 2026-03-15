---
name: nightly-workspace-commit
description: Review the workspace git repo, commit legitimate changes, and push them to GitHub. Use when the nightly workspace commit cron job runs.
---

# Nightly Workspace Commit

Review the git repo at `/Users/adamsmith/.openclaw/workspace`, commit legitimate changes, and push them to GitHub.

## Workflow

1. Change to `/Users/adamsmith/.openclaw/workspace`.
2. Run `git status` to inspect changes.
3. Review changed files before committing.
4. If there are no changes, stop and report that no commit was needed.
5. If changes look questionable, risky, or contain secrets, do not commit. Report what you found and stop.
6. If changes are legitimate:
   - Stage all intended changes with `git add -A`
   - Create a clear commit message that summarizes the changes
   - Commit the changes
   - Push with a normal `git push origin main`
7. Report what you did and the commit message used.

## Guardrails

- Do not commit secrets or credentials.
- Do not use force push.
- Do not change git config.
- Do not rewrite history.
