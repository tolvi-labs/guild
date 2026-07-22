---
name: guild
description: Use for brainstorming HOW to solve a task and writing its implementation plan. Grounds the brainstorm in the actual codebase substrate (a lib's GUILD.md, an infra repo's config) and your vault, keeps the engineer in the loop on every scope decision, and asks rather than assuming textbook defaults. Terminal handoff is Bastion.
---

# Guild

Guild brainstorms *how* to solve the task at hand — grounded in what the substrate actually says — and writes the implementation plan. It applies existing guardrails and patterns, keeps you in the loop on every scope decision, and asks rather than assuming where the substrate is silent. Hardening the resulting plan is Bastion's job, not Guild's.

**Announce at start:** "Using Guild to brainstorm the how and write the plan."

Pipeline: **Guild (brainstorm → plan) → Bastion (harden) → execute.**

## Reference contracts (read as needed)

- `references/manifest-schema.md` — the `guild.manifest.yml` shape.
- `references/resolver.md` — how a task implicates tracks; the selectivity guarantee.
- `references/reader-contract.md` — the reader digest and the legibility ladder.
- `references/vault-track.md` — the always-on vault track and the contradiction check.
- `references/guild-directives.md` — the `GUILD.md` authoring convention.
- `agents/track-reader.md` — the reader subagent dispatched per implicated track.

## Phase 1 — Recall (the vault is always convened)

Follow `references/vault-track.md`: run `tolvi recall` for the target repo and read its `vault/decisions/` (optionally `tolvi ask "<task query>" --json` when an API key is set), scoped to the task. Collect the active decisions as a `vault` digest (`mode: explicit`). If any decision's ruling is logically negated by the task, raise its **contradiction flag now** and resolve it with the engineer before going further — do not proceed silently, and do not silently override the decision.

## Phase 2 — Resolve (which tracks are implicated)

Follow `references/resolver.md`. Determine the task's anticipated change surface; when it is ambiguous, ask the engineer. Match it against each track's `triggers` in `guild.manifest.yml` to produce `implicated = [{name, kind, location, look}]` (`look` carried for `repo` tracks so the fan-out needs nothing more from the manifest). If `implicated` is empty, do not assume a default — ask the engineer how to proceed. **A non-implicated track is never read.**

## Phase 3 — Fan-out (read the implicated substrate)

Dispatch one `track-reader` subagent (`agents/track-reader.md`) per implicated track, in parallel, passing `{track, kind, location, look, taskSummary}`. Do NOT dispatch readers for non-implicated tracks. Collect each digest. The readers report; they do not decide.

## Phase 4 — Brainstorm the how (engineer-in-the-loop, hard-gated)

You now hold the vault digest and one digest per implicated track. Converge the *how* and the *scope* with the engineer, one question at a time:

- **Explicit directives** (from a `GUILD.md` or an active decision) are **hard constraints**. State them as fixed; do not ask whether to follow them.
- **Implicit patterns** are **proposals to confirm**. Present each with its `whereSeen` and confidence, and ask the engineer to confirm or override.
- **Every `gap`** (from any reader) and **every contradiction flag** becomes **one engineer question**. Never fill a gap yourself, and never assume a textbook default.
- **Coverage check.** A reader only reports within its own track's remit, so before finalizing, list the aspects the task requires and confirm each is addressed by a digest (a directive or a pattern). Any required aspect that **no digest addresses** — because no track governs it — is itself a gap: ask the engineer one question about it. Never assume a default for an un-addressed aspect.
- Ask one question at a time; prefer multiple-choice when it fits.

**HARD-GATE:** Do not finalize a brief — and do not proceed to writing any plan — until the engineer has explicitly approved BOTH the *how* and the *scope* (what is in and what is out).

The output of this phase is the **agreed brief**:

```json
{
  "how": "<the chosen approach>",
  "scope": "<explicit in-scope / out-of-scope>",
  "appliedDirectives": [ "<directive + source that constrained the how>" ],
  "resolvedGaps": [ { "question": "<asked>", "answer": "<the engineer's decision>" } ]
}
```

## Phase 5 — Write the plan and route the outputs

From the agreed brief, produce two artifacts. Follow `references/output-routing.md`.

1. **The plan.** Write it as a task-by-task plan (exact paths, `Consumes`/`Produces` per task, bite-sized TDD steps, no placeholders) to a gitignored working copy `docs/plans/YYYY-MM-DD-<feature>.md`. **Do not `git add` it** — its canonical home is your ticket tracker or wiki for review.
2. **The durable why.** Draft a vault decision in the repo's `vault/decisions/` (via `tolvi sync decision`) capturing the approach, the `appliedDirectives` (with sources), and the `resolvedGaps`. This becomes substrate the vault track reads next session.

## Phase 6 — Hand off to Bastion (terminal)

Hardening the plan is Bastion's job, not Guild's. Offer to invoke `/bastion` on the freshly written plan, and stop. Do not attack, harden, or execute the plan yourself — that is the crucible's role, and execution is the downstream flow's role. This is Guild's terminal state.
