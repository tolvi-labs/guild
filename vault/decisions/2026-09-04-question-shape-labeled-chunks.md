---
tags: [decision, guild]
date: 2026-09-04
repo: guild
status: active
ticket: none
user_impact: medium
product_area: Developer tooling
---

# Guild and Bastion reformat per-question output to labeled chunks, not one paragraph

**Date:** 2026-09-04
**Repo:** guild

## Why
Guild's Phase 4 gap-resolution questions were rendering as one dense paragraph — context, proposal, and the actual yes/no ask all run together — which is hard to scan, especially when several questions land back to back in a session. Reviewing `github.com/ayghri/i-have-adhd` (a Claude Code skill that reshapes agent output for readability) surfaced the transferable principle: cue-labeled short chunks beat prose, and the actionable ask should never be buried mid-paragraph.

## How
- Added a **"Question shape"** instruction block to Phase 4, right after the existing "ask one question at a time" line: a `Q<n> — <short label>` header, then `Context:` / `Proposal:` / `Risks:` / `Confirm:` lines, one fact per line.
- `Proposal` and `Risks` are explicitly optional — omit a label with nothing to say. `Risks` in particular is meant only for questions where a wrong answer has real stakes, not every question; it was added after a user review round that flagged it as the one missing piece.
- The identical template was applied to Bastion's Step 4 grill questions in the same session (see the paired decision in `bastion/vault/decisions/2026-09-04-question-shape-labeled-chunks.md`), so the two tools in the pipeline hand off with a consistent question shape. Bastion's header additionally keeps its existing source-tier tag (`[source: vault | CLAUDE.md/as-built | general judgment]`) — the new shape wraps that mandatory source-transparency requirement rather than replacing it.
- Deliberately scoped narrow: only the per-turn question format changed. Bastion's Step 6 "HARDENED PLAN" delivery block was already a clean fenced template and stays as-is; Guild's final agreed-brief JSON is a routing artifact, not meant for on-screen reading, and stays as-is too.
- **Rejected:** reformatting the final deliverable blocks as well (scope creep beyond the actual complaint, which was specifically the wall-of-text per-question turns). Also rejected a `Step N of M` running counter like `i-have-adhd`'s — there is no natural total to count against, since the gap/question count is dynamic per task, and the existing `Q<n>` numbering already signals progress without a false denominator.

## Outcome
Guild's Phase 4 gap-resolution questions and Bastion's Step 4 grill questions now render as scannable labeled chunks instead of a single paragraph. `skills/tolvi-guild/SKILL.md` (this repo) and `skills/tolvi-bastion/SKILL.md` (bastion repo) both updated.

See also: [[2026-09-04-question-shape-labeled-chunks]] (bastion repo, same slug, paired decision)
