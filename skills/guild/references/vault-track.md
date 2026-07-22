# The vault track — always convened

The vault is a track like any other, with one difference: it is convened on **every** session, not by manifest triggers. It carries the accumulated *why* — prior decisions and their rejected alternatives — that the code cannot.

## When it runs

At session open, before the resolver and the manifest-track fan-out:

1. Run `tolvi recall` for the target repo to surface the last session's open items and the actively-constraining decisions.
2. Read the repo's `vault/decisions/` (and, when `ANTHROPIC_API_KEY` is set, run `tolvi ask "<task query>" --json` for ranked retrieval), scoped to the task.

## What it produces

A digest with `track: "vault"`, using the **same contract** as any other track (`reader-contract.md`) — no special-casing downstream. Each relevant, `status: active` decision enters as a `directives` entry:

- `rule`: the decision's ruling (its operative constraint / `## Outcome`), stated as a constraint.
- `source`: the decision filename.
- `mode: explicit` — a committed decision is a hard constraint, exactly like a `GUILD.md` directive.

Decisions whose frontmatter `status` is `superseded`, `deprecated`, or `draft` are skipped — they are not active substrate.

## The contradiction check

Beyond surfacing directives, the vault track screens the task against the recalled decisions. If a decision's ruling is **logically negated** by what the task proposes, emit a contradiction flag and surface it to the engineer **in Phase 1, before the resolver and reader fan-out run** — a task that fundamentally conflicts with a committed decision should not spend reader dispatches until the conflict is resolved:

```json
{
  "contradicts": true,
  "decision": "<decision-slug>",
  "claim": "<what the task proposes>",
  "ruling": "<what the decision says>"
}
```

Guild does not silently proceed past a contradiction, and does not silently override the decision — it names the conflict and lets the engineer decide (rework the task, or supersede the decision via the `/supersede` flow).

## Why this is the biggest accuracy lever

Because the vault is always convened and its decisions enter as hard constraints, Guild never re-proposes something already decided or superseded, and it catches contradictions before spending question budget. The decision Guild itself deposits at the end of a session becomes vault substrate the next session reads — a compounding loop.
