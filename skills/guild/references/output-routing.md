# Output routing — where Guild's artifacts go

Guild produces two artifacts from an approved brief. They go to different homes, and one of them is never committed.

## The plan — never committed

Plans are pre-code artifacts; their value is review before code exists. So:

- **Canonical home:** your ticket tracker or wiki — wherever the plan gets peer-reviewed.
- **Local working copy:** allowed under a gitignored `docs/plans/YYYY-MM-DD-<feature>.md`, for the session only.
- **Never `git add` the plan.** It is globally gitignored; do not force-add it. A committed plan rots the moment code moves past it.

Write the plan using the writing-plans task structure: exact file paths, a `Consumes`/`Produces` interfaces block per task, bite-sized TDD steps, and no placeholders.

## The durable why — a vault decision

The rationale outlives the plan, so it goes to the vault, not the repo tree:

- **Home:** the repo's `vault/decisions/YYYY-MM-DD-<slug>.md` (Why / How / Outcome altitude), written with `tolvi sync decision`.
- **Content:** the approach chosen; the `appliedDirectives` that constrained it (with their sources); the `resolvedGaps` (each question and the engineer's answer). This is what the next session's vault track will read.

## Commit hygiene (for the code the plan later produces)

- Message format: `[TICKET-ID] Short imperative description`, followed by a body of what-and-why bullets.
- **Never** add a `Co-Authored-By` trailer or any AI/assistant attribution.
