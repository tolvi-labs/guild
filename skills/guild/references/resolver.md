# Resolver — how a task implicates tracks

The resolver decides which tracks Guild convenes for a task, and thereby which reader subagents are dispatched. It runs after vault recall and before the reader fan-out.

## Input

- The parsed `guild.manifest.yml` for the consuming repo (see `manifest-schema.md`).
- The task's **anticipated change surface**: the set of paths/globs the work is expected to touch.

## Algorithm

1. **Determine the change surface.** Infer the set of paths the task will touch from the task description and the repo layout. When this is ambiguous, **ask the engineer** rather than guessing — the change surface drives everything downstream.
2. **Match tracks.** For each track in the manifest, mark it *implicated* iff **any** of its `triggers` globs matches **any** path in the change surface.
3. **Emit the result.** Produce an ordered list `implicated = [ { name, kind, location, look } ]`, where `location` is `substrate.source` for a `lib` track and `substrate.path` for a `repo` track, and `look` is `substrate.look` for a `repo` track (omitted/empty for a `lib` track). Carrying `look` here means the fan-out dispatch needs nothing from the manifest beyond this tuple.
4. **Handle the empty case.** If `implicated` is empty, **do not assume a default approach** — ask the engineer how to proceed. An empty result means the substrate is silent, which is the `absent` rung of the legibility ladder at the resolver level.

## Selectivity guarantee

**A non-implicated track is never read.** Exactly one reader is dispatched per implicated track, and none for the rest. This keeps Guild proportionate: a two-file change touching one track convenes one reader; a change touching nothing convenes none and goes straight to the engineer.

## Worked trace (fixture)

Against `fixtures/consumer-repo/guild.manifest.yml`:

- Task "rename the label on `Nav.tsx`" → change surface `{ src/components/Nav.tsx }`. `design.triggers` (`src/components/**`) matches; `infra.triggers` do not. → `implicated = [ { name: design, kind: lib, location: ../design-lib, look: [] } ]`. The infra reader is **not** dispatched. *(Scenario S4.)*
- Task "tidy the evergreen notes" → change surface `{ src/evergreen/notes.md }`. No track's triggers match. → `implicated = []` → **ask the engineer**; no reader is dispatched. *(Scenario S3a.)*
