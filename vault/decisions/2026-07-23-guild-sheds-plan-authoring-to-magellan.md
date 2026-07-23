---
tags: [decision, guild]
date: 2026-07-23
repo: guild
status: active
ticket: none
user_impact: high
product_area: Product scope
---

# Guild sheds plan-authoring to Magellan and becomes the comprehension-forcing vault-gap tool

**Date:** 2026-07-23
**Repo:** guild

## Why

Guild's relaunched identity (marketing-site [[2026-07-21-guild-relaunch-and-unified-stack]]) is "the substrate-grounded planning engine" that brainstorms the *how* and *writes the plan* (SKILL Phase 5). Two problems. First, a tool-generated plan lets the engineer rubber-stamp it without ever understanding the work — the exact anti-pattern the vault exists to prevent. Second, the plan artifact has specialized execution, context, and cost requirements that a brainstorm tool should not own. So Guild sheds plan-authoring: it keeps the part that is genuinely valuable — forcing the engineer to understand the work — and hands the execution-optimized plan to a new tool, Magellan (see [[2026-07-23-magellan-execution-optimized-plan-compiler]]).

## How

- **Reframe: comprehension-forcing, not plan-generating.** Guild's job becomes to make the engineer understand the work by surfacing where the vault is silent about the live code the task touches, and making the engineer resolve those gaps — which grows the vault as a side effect. It no longer hands back a plan to approve.
- **Grounded in Guild's existing structure — a small change, not a rewrite.** Guild's Phase 4 already *is* gap-resolution ("every gap becomes one engineer question; never fill a gap yourself"). So the reframe is: keep Phases 1–4 (recall, resolve/selectivity, fan-out, engineer-in-loop gap-resolution), sharpen Phase 4's coverage-check toward *vault gaps confirmed against the code*, and **drop Phase 5** (plan authoring). Guild's output is the approved brief (`{how, scope, appliedDirectives, resolvedGaps}`) plus a more complete vault — not a plan.
- **Selectivity keeps it from becoming a firehose.** Most code has no decision behind it, and that is correct. Guild flags only *consequential* ambiguity the vault ought to resolve but does not, scoped to the task's blast radius. This leans on the existing resolver and its selectivity guarantee (`references/resolver.md`) rather than fighting them.
- **Targeted comprehension, deliberately.** This forces depth at the consequential unknowns, not comprehensive proof of understanding the whole scope. That is the intended trade: dive where the risk is, not everywhere.
- **The engineer owns the how; nobody hands them a finished plan.** Phase 4 is already engineer-in-loop and hard-gated on the how and the scope. Magellan then compiles the approved approach; Bastion hardens it. Removing Phase 5 removes the rubber-stamp surface.
- **Boundary with Bastion, sharpened.** Guild checks the vault for *completeness* against the code (where is the map blank over live territory?); Bastion checks the approach for *compliance* against the vault (does it violate recorded precedent?). Completeness vs. compliance — cleaner than the old "brainstorm the plan / harden the plan" pairing.
- **Pipeline.** Guild (brief) → Bastion (harden approach) → Magellan (compile task DAG) → execute. Bastion moves one slot earlier — it hardens the brief, not a finished plan — so Magellan's expensive per-task context compilation runs once, last.

## Outcome

Guild is reframed from the substrate-grounded planning engine to the comprehension-forcing vault-gap tool: it keeps Phases 1–4, sharpens the coverage-check toward vault-gaps-confirmed-against-code, and drops Phase 5, whose plan-authoring role spins out to [[2026-07-23-magellan-execution-optimized-plan-compiler]]. Its deliverable is the approved brief plus a fuller vault. Reconciliation debt: the Guild `SKILL.md` (description "brainstorm the how and write the plan," Phases 5–6) must be rewritten, and the marketing-site positioning + stack in [[2026-07-21-guild-relaunch-and-unified-stack]] (`Vault → Guild → Bastion → Forge`, Guild as "the planning engine") must be reconciled to insert Magellan and reposition Guild as comprehension.
