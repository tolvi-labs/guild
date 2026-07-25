# Authoring `GUILD.md` — the directive convention

A library or component pack publishes its Guild directives so that any repo consuming it inherits them automatically when that track is convened.

## Where directives live

- **A lib publishes a `GUILD.md` at its root**, mirroring `CLAUDE.md`. This is the authoritative, `explicit` source for that track.
- **A folder-scoped concern may use a `.guild/` directory** (e.g. `.guild/directives.md`) when a single root file is too coarse.
- **A repo with no `GUILD.md`** is read for *patterns* via the manifest's `substrate.look` paths. Such a track can only ever be `implicit` or `absent` — never `explicit`.

## How to write a directive

Each directive is **one imperative line with its rationale attached**, so a reader can cite it verbatim and Guild can explain the constraint to the engineer:

> - Every interactive nav item MUST use the shared `navLink` underline-on-active treatment — a bespoke per-item border regresses the active-state bug where only one item underlined.

The rule comes first (imperative, testable); the *why* follows the em-dash. Keep one rule per line so a reader can attach a precise `source: <file>:<line>`.

## What NOT to put in a `GUILD.md`

Directives are constraints, not knowledge dumps. A `GUILD.md` is not a place to encode team lore, tutorials, or API documentation — that rebuilds the "static block of prose is the weakest shape" anti-pattern. If a rule cannot be stated as an imperative line a reader can cite, it is probably not a directive.
