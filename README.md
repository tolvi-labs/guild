# Guild

**Substrate-grounded brainstorming & planning for Claude Code.**

Guild is a Claude Code skill that works out *how* to solve a task against the guardrails already in your codebase — applying whatever rules and patterns exist, keeping you in the loop on every scope decision, and asking rather than assuming where your code is silent — then writes the implementation plan and hands it to [Bastion](https://github.com/tolvi-labs/bastion) to harden.

It is the planning layer of the Tolvi stack:

```
Guild (brainstorm the how → write the plan) → Bastion (harden) → execute
```

## Install

```shell
git clone https://github.com/tolvi-labs/guild
cd guild
./install.sh          # symlinks skills/guild into ~/.claude/skills/guild
```

Invoke `/guild` in any Claude Code session. Use `./install.sh --copy` for a frozen snapshot, or `--uninstall` to remove.

## The core idea

A capable model will confidently invent a plausible-but-wrong answer when the codebase hasn't told it what to do. Guild's job is to make the codebase tell it, and where the code is silent, to make *you* decide rather than let the model guess. Every reader is a thin scope wrapper that recalls from substrate and carries no knowledge in its prompt; correctness lives in the substrate and the vault, not in the agent.

### Tracks and substrate

A consuming repo declares only what auto-detection can't see, in one `guild.manifest.yml` at its root:

```yaml
version: 1
tracks:
  - name: design
    triggers: ["src/components/**", "**/*.tsx"]
    substrate: { kind: lib, source: "../design-lib" }
  - name: infra
    triggers: ["deploy/**", "**/*.tf"]
    substrate: { kind: repo, path: "../infra-repo", look: ["deploy/"] }
```

A **lib** track points at a library that publishes its rules as a `GUILD.md` at its root (mirroring `CLAUDE.md`). A **repo** track points at a sibling repo, read for patterns via its `look:` folders.

### The legibility ladder

When a track is implicated, a `track-reader` subagent reads its substrate and returns a digest with a `mode`:

| mode | source | how Guild treats it |
|---|---|---|
| `explicit` | a `GUILD.md` directive or an active vault decision | **hard constraint** |
| `implicit` | a pattern inferred from code | **proposal to confirm** |
| `absent` | the substrate is silent | **an engineer question** |

A reader is structurally forbidden from filling a gap itself. That mechanizes "ask, don't assume the textbook default."

### The six phases

1. **Recall** — the vault is always convened (`tolvi recall` + the repo's `vault/decisions/`); a task that contradicts a standing decision is flagged before any question.
2. **Resolve** — match the change surface against each track's triggers; a non-implicated track is never read.
3. **Fan-out** — one `track-reader` per implicated track, in parallel.
4. **Brainstorm** — converge the how and the scope one question at a time; nothing proceeds until you approve both.
5. **Write the plan** — and deposit the durable *why* as a vault decision.
6. **Hand off to Bastion** — offer `/bastion` on the plan, and stop. Guild never hardens or executes.

## Repo layout

```
skills/guild/
  SKILL.md            # the six-phase orchestrator
  references/         # the contracts (manifest schema, resolver, reader contract, vault track, GUILD.md convention, output routing)
  agents/track-reader.md
fixtures/             # behavioral test substrate
tests/scenarios.md    # behavioral scenarios
vault/                # the project's decision record (see vault/README.md)
```

## Contributing

Guild keeps its decision record in the open (`vault/`). Changing how the tool behaves? Capture the *why* with `tolvi sync`. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

Apache 2.0 — see [LICENSE](LICENSE).
