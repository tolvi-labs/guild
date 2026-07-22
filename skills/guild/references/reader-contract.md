# Reader digest — the track reader's output contract

A **track reader** is a subagent Guild dispatches for one implicated track. Its entire job is to read that track's substrate and report what it found. It **reports; it never decides.** The reader's final message IS the digest object below — nothing else.

## Digest shape

```json
{
  "track": "<string>",
  "mode": "explicit | implicit | absent",
  "directives": [
    { "rule": "<verbatim rule from a GUILD.md>", "source": "<file>:<line>" }
  ],
  "patterns": [
    { "observation": "<inferred pattern>", "whereSeen": "<file>:<line>", "confidence": "high | medium | low" }
  ],
  "gaps": [
    { "question": "<what to ask the engineer>", "why": "<why the substrate can't answer it>" }
  ]
}
```

## The three modes (the legibility ladder)

- **`explicit`** — the substrate carries a `GUILD.md` (or `.guild/`) directive that governs the task. Populate `directives` with the verbatim rule(s) and their `source`. Downstream, an explicit directive is a **hard constraint** — Guild applies it without asking.
- **`implicit`** — no directive governs the task, but the code/config shows a relevant pattern. Populate `patterns` with the observation, where it was seen, and a confidence. Downstream, an implicit pattern is a **proposal to confirm** — never a law.
- **`absent`** — the substrate says nothing about what the task needs. Populate `gaps` with concrete questions. Downstream, every gap becomes an **engineer question**.

## Invariants

A reader selects **exactly one** mode and populates only that mode's array:

- `mode: explicit` ⇒ `directives` non-empty **and** `patterns` and `gaps` both empty.
- `mode: implicit` ⇒ `patterns` non-empty **and** `directives` and `gaps` both empty.
- `mode: absent` ⇒ `gaps` non-empty **and** `directives` and `patterns` both empty.
- A reader on a `repo`-kind track (no `GUILD.md`) can only return `implicit` or `absent`, never `explicit`.

When a track has a governing directive it returns `explicit`; any facet of the task its directives don't cover is **not** emitted as a reader gap — Guild's Phase 4 coverage check owns every un-addressed aspect, so gap-detection lives in exactly one place. `absent` is for when the track has *nothing* relevant to the task at all.

**The reader never fills a gap.** If the substrate does not cover something the task needs, that is for the engineer to decide (via a reader `gap` when the whole track is silent, or via the coverage check otherwise) — never a directive to invent or a pattern to assume. This is the mechanized form of "ask, don't assume textbook."
