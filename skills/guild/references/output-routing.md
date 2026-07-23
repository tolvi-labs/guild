# Output routing — where Guild's artifacts go

Guild produces two artifacts from an approved brief: the brief itself (the downstream handoff) and the durable why (a vault decision). Guild does **not** produce the implementation plan — that is Magellan's compile step, downstream of Bastion.

## The brief — the downstream handoff

The approved brief is what flows to the next stage; it is not committed:

- **Content:** `{how, scope, appliedDirectives, resolvedGaps}` — the engineer-approved approach and scope, the directives that constrained the how, and each resolved gap.
- **Downstream:** Bastion hardens the brief (the approach), then Magellan compiles it into the executable task DAG. Guild does not decompose the brief into tasks or attach per-task context — that decomposition-plus-context-compilation is the compile step, and it belongs to Magellan.
- **Not Guild's job:** exact file paths, a `Consumes`/`Produces` interfaces block per task, and bite-sized TDD steps are Magellan's output (a Forge `tasks.json` superset), compiled from the hardened brief.

## The durable why — a vault decision

The rationale outlives the plan, so it goes to the vault, not the repo tree:

- **Home:** the repo's `vault/decisions/YYYY-MM-DD-<slug>.md` (Why / How / Outcome altitude), written with `tolvi sync decision`.
- **Content:** the approach chosen; the `appliedDirectives` that constrained it (with their sources); the `resolvedGaps` (each question and the engineer's answer). This is what the next session's vault track will read.

## Commit hygiene (for the code the plan later produces)

- Message format: `[TICKET-ID] Short imperative description`, followed by a body of what-and-why bullets.
- **Never** add a `Co-Authored-By` trailer or any AI/assistant attribution.
