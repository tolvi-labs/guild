# AGENTS.md

Guidance for coding agents working in this repo. Humans: see [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## What this is

Guild is substrate-grounded brainstorming and planning, shipped as a Claude Code skill. It works out *how* against the guardrails already in your codebase, and asks the engineer where the code is silent rather than assuming a textbook default.

## Layout

- `skills/tolvi-guild/` is the skill.
- `tests/scenarios.md` holds the behavioral scenarios. `fixtures/` backs them.
- `.claude-plugin/plugin.json` is the manifest.

## Conventions

- **Ask rather than assume.** Where the codebase does not answer a question, the skill must put it to the engineer. Silently picking a convention is the failure this exists to prevent.
- **It produces an approved brief, not a plan.** Plan-authoring belongs downstream. The terminal handoff is Bastion.
- **Scenarios are the test suite.** Change behavior, change `tests/scenarios.md` in the same commit.

## What not to do

- Do not let Guild choose the approach. It grounds and questions; the engineer decides.
