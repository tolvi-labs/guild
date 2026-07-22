# Contributing to Guild

Guild is a Claude Code skill that works out *how* to solve a task against the guardrails already in your codebase, then writes the plan and hands it to Bastion to harden. Contributions welcome — with one rule that's different here.

## The rule that's different: change the tool, record the why

This project keeps its decision record in the open, in [`vault/`](vault/), and **a change to how the skill behaves must come with the reasoning.** If your PR changes Guild's behavior (a phase, the legibility ladder, the reader contract, the manifest schema), include a vault decision that captures *why*:

```shell
tolvi sync decision "Short imperative title"   # writes vault/decisions/YYYY-MM-DD-<slug>.md
```

Commit it alongside your code. PRs that change behavior without a decision will be asked to add one. This is the product dogfooding itself: the vault is how Tolvi tools stay legible to the people and agents working on them.

## What belongs in the public vault

Engineering decisions only — the *why* of the code. **Never** put client or project names, JIRA keys, business strategy, competitive analysis, revenue, PII, or security-incident specifics in this repo; those belong in a private vault. Use placeholders like `PROJ-142` for tickets. See [`vault/README.md`](vault/README.md).

## Local setup

```shell
git clone https://github.com/tolvi-labs/guild
cd guild
./install.sh          # symlinks skills/guild into ~/.claude/skills/guild (invoke with /guild)
```

To point Guild at a repo's substrate, add a `guild.manifest.yml` at that repo's root (see the [README](README.md)); a library publishes its rules as a `GUILD.md`.

## Standards

- Match the existing prose and structure of `SKILL.md` and the `references/`.
- Keep readers thin: they report substrate, they never decide. Correctness lives in the substrate and the vault, not in the prompt.
- One decision per behavior change. Session logs stay out of this repo.
