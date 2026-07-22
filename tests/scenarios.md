# Guild behavioral scenarios

These are the behavioral tests for the Guild skill. Guild is a prose skill with no runnable suite, so a scenario passes when Guild's observable behavior matches its **Expected** line when traced against `fixtures/`. The manifest/reader scenarios trace against `fixtures/consumer-repo`, `fixtures/design-lib`, and `fixtures/infra-repo`; the vault-track scenario (S5) traces against `fixtures/vault/decisions/`; the git-routing scenario (S7) is checked against real git state. Scenarios are added task-by-task as the engine is built.

## S4 — Selectivity

Manifest declares `design` (triggers `src/components/**`) and `infra` (triggers `deploy/**`).
Task: "rename the label on Nav.tsx" (change surface: `src/components/Nav.tsx`).
Expected: resolver returns `implicated = [design]`; infra is NOT implicated and NO infra reader is dispatched.

## S3a — Absent via resolver

Task: "tidy the evergreen notes" (change surface: `src/evergreen/notes.md`).
Expected: resolver returns `implicated = []`; Guild must ASK the engineer how to proceed, never assume a default.

## S1 — Explicit directive

Reader runs on the `design` track (substrate: `design-lib` with a `GUILD.md`).
Task: "add a settings item to Nav".
Expected: `mode: explicit`; `directives` include the nav-underline rule sourced to `GUILD.md:<line>`; `gaps` empty.

## S2 — Implicit pattern

Reader runs on the `infra` track (substrate: `infra-repo/deploy`, no `GUILD.md`).
Task: "change the deploy region".
Expected: `mode: implicit`; `patterns` include the observed single-region setting with `whereSeen = deploy/region.yaml:<line>` and a confidence; `directives` empty.

## S3b — Absent gap

Reader runs on a track whose substrate says nothing about the task (design track asked about a caching strategy).
Expected: `mode: absent`; `gaps` include a concrete question; `directives` and `patterns` empty.

## S5 — Vault contradiction

Fixture `fixtures/vault/decisions/` holds an active decision (`2026-07-08-comingsoon-retired`, ruling "/coming-soon is retired; gates redirect to /") and a `status: superseded` decision that must be skipped.
Task: "add a /coming-soon holding page behind a launch flag".
Expected: the vault track surfaces the active decision (and skips the superseded one), returns a contradiction flag naming the decision slug and both claims, and Guild surfaces it in Phase 1 before the resolver and fan-out — not silently proceeding. *(Also verified against the real marketing-site vault, whose `2026-07-08-guild-deprecated-and-comingsoon-retired` decision carries the same ruling.)*

## S6 — Gap becomes a question, end-to-end

Task: "add a settings item to Nav that navigates to a new settings route." The design reader returns `mode: explicit` with the nav styling directive(s) and no gap — routing is outside its remit and no track governs it.
Expected: Guild states the nav rule as a hard constraint WITHOUT asking; its Phase 4 **coverage check** notices that "where the new route lives" is addressed by no digest and asks the engineer exactly one question about it before writing anything. It never fabricates a route default.

## S7 — Output routing

Given an approved brief.
Expected: the plan is written to the gitignored `docs/superpowers/plans/` path and is NOT staged/committed; a vault decision draft is produced recording `appliedDirectives` and `resolvedGaps`; the session ends by naming the Bastion handoff. Guild never runs `git add` on the plan.

## S8 — Bastion handoff is terminal

Given a written plan.
Expected: Guild's terminal state offers/invokes Bastion (`/bastion`) on the plan and stops; it does not attack, harden, or execute the plan itself.
