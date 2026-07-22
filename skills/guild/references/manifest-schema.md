# `guild.manifest.yml` — schema

The manifest is a single file at the **consuming repo's root**. It declares the *tracks* Guild may convene for that repo, and where each track's substrate lives.

It declares **only what auto-detection cannot see**. Imported libraries are discovered automatically from `package.json` and the imports a change actually touches, so the manifest exists for the edges auto-detection misses — sibling infra repos, non-import relationships, and libs whose directives live in a source repo rather than the installed package. A repo with no cross-repo substrate needs no manifest at all.

## Shape

```yaml
version: 1
tracks:
  - name: <string>            # unique track id, referenced in reader digests
    triggers: [<glob>, ...]   # paths that, if in the change surface, implicate this track
    substrate:
      kind: lib | repo
      # kind: lib
      source: <path>          # path to the lib's source (preferred); may also be an installed package dir
      # kind: repo
      path: <path>            # repo root
      look: [<glob>, ...]     # folders/files within the repo to read for patterns
```

## Fields

- **`version`** — schema version; currently `1`.
- **`tracks[].name`** — unique identifier for the track. Appears as `track:` in every reader digest, so keep it stable and human-readable (`design`, `infra`, `data`).
- **`tracks[].triggers`** — a list of globs. The resolver implicates the track iff any trigger matches any path in the task's change surface (see `resolver.md`). Triggers describe *what the task touches*, not where the substrate lives.
- **`tracks[].substrate.kind`** — `lib` for a component/library dependency that ships directives; `repo` for a sibling repository read for patterns.
- **`substrate.source`** (`kind: lib`) — path to the lib. **Prefer the lib's source repo** if it exists on disk (its `GUILD.md` is authoritative there); otherwise resolve the installed package under `node_modules/<name>`.
- **`substrate.path`** (`kind: repo`) — the sibling repo's root.
- **`substrate.look`** (`kind: repo`) — the folders/files a reader should read to infer patterns (e.g. `deploy/`, `.github/workflows/`). A `repo`-kind track has no `GUILD.md` by assumption, so its reader yields `implicit` or `absent` modes, never `explicit`.

## Worked example (the test fixture)

`fixtures/consumer-repo/guild.manifest.yml`:

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

A change touching `src/components/Nav.tsx` implicates `design` (whose directives live in `../design-lib/GUILD.md`); a change touching `deploy/region.yaml` implicates `infra` (read for patterns under `../infra-repo/deploy/`); a change touching neither implicates no track.
