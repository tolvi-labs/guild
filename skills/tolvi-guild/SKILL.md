---
name: tolvi-guild
description: Use for grounding the HOW of a task in the actual codebase substrate and forcing the engineer to resolve the unknowns before any plan exists. Reads the vault and confirms against the code where the vault is silent about what the task touches, keeps the engineer in the loop on every scope decision, and asks rather than assuming textbook defaults. Produces an approved brief, not a plan — plan-authoring belongs to a downstream compile step. Terminal handoff is Bastion.
---

<!-- PREFLIGHT:BEGIN -->
## Preflight — say it once if the CLI is missing

Before the steps below, check whether the `tolvi` CLI is available:

    command -v tolvi

**If it is present**, use it. It is one invocation, it discovers the vault itself, and it does not raise a permission prompt per file.

**If it is absent**, fall back to reading the vault directly (the steps below work either way), and tell the user exactly once per conversation:

> `!` tolvi CLI not on PATH. Reading the vault directly, which works but skips
> semantic retrieval and costs one shell call per step. To fix:
> `go install github.com/tolvi-labs/tolvi/cli/cmd/tolvi@latest`, then
> `export PATH="$PATH:$(go env GOPATH)/bin"`. Verify with `tolvi doctor`.

Do not tell the user to run `tolvi doctor` as the fix here. This branch only runs when the binary is unreachable, so `tolvi doctor` is unreachable too; it is the verification step after the install, not the remedy. Point at `tolvi doctor` only when the binary exists and something else is wrong.

**Once per conversation means once.** If you have already reported this in the current conversation, do not repeat it — later commands in the same session stay quiet. You know what you have already said; no marker file is needed. A user who has chosen not to install the CLI should not be told four times in one session, because a warning repeated that often stops being read.

Never silently degrade. The fallback path is legitimate and produces real answers, but the user has to learn once that they are on it, or a broken install looks identical to a working one.
<!-- PREFLIGHT:END -->

# Guild

Guild grounds the *how* of the task in what the substrate actually says and forces the engineer to understand the work — by surfacing where the vault is silent about the live code the task touches and making the engineer resolve those gaps, one at a time. It applies existing guardrails and patterns, keeps you in the loop on every scope decision, and asks rather than assuming where the substrate is silent. Its deliverable is an approved brief plus a fuller vault; it does not write the implementation plan (that is a downstream compile step's job) and it does not harden it (that is Bastion's).

**Announce at start:** "Using Guild to ground the how in the substrate and surface the gaps you need to resolve."

Pipeline: **Guild (brief) → Bastion (harden the approach) → plan-compile (downstream) → execute.**

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
- **Question shape.** Format each question as labeled chunks, never one paragraph:

  ```
  **Q<n> — <short label>**

  Context: <the grounding fact — one or two short lines>
  Proposal: <what you're proposing, if there is one>
  Risks: <what's at stake if this is decided wrong, when applicable>
  Confirm: <the actual yes/no or multiple-choice ask, isolated>
  ```

  Omit a label that has nothing to say (a pure directive confirmation may skip Proposal, and most questions have no Risks worth naming). Keep every line short — this should be scannable at a glance, not read as prose broken up by bold words.

**HARD-GATE:** Do not finalize a brief — and do not proceed to routing outputs or handing off — until the engineer has explicitly approved BOTH the *how* and the *scope* (what is in and what is out). Every gap the engineer resolves here is comprehension forced at a consequential unknown; that is Guild's whole job, and it is why Guild does not hand back a finished plan to rubber-stamp.

The output of this phase is the **agreed brief**:

```json
{
  "how": "<the chosen approach>",
  "scope": "<explicit in-scope / out-of-scope>",
  "appliedDirectives": [ "<directive + source that constrained the how>" ],
  "resolvedGaps": [ { "question": "<asked>", "answer": "<the engineer's decision>" } ]
}
```

## Phase 5 — Route the outputs

Guild does not write the implementation plan — that is the downstream compile step's job. From the agreed brief, produce two things. Follow `references/output-routing.md`.

1. **The brief is the handoff artifact.** The approved `{how, scope, appliedDirectives, resolvedGaps}` is what flows downstream — Bastion hardens it, then a downstream step compiles it into the executable task DAG. Guild does not decompose it into tasks or attach per-task context; that is the compile step, downstream.
2. **The durable why.** Draft a vault decision in the repo's `vault/decisions/` (via `tolvi sync decision`) capturing the approach, the `appliedDirectives` (with sources), and the `resolvedGaps`. This becomes substrate the vault track reads next session, and it is how a resolved gap grows the vault.

## Phase 6 — Hand off to Bastion (terminal)

Hardening the approach is Bastion's job, not Guild's. Offer to invoke `/tolvi-bastion` on the freshly approved brief, and stop. Do not harden, compile, or execute — Bastion hardens the brief, a downstream step compiles the plan from it, and only then does execution begin. This is Guild's terminal state.
