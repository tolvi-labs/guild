---
tags: [decision, fixture]
date: 2026-07-08
status: active
---

# /coming-soon is retired; product-release gates redirect to /

Ruling: `/coming-soon` now redirects to `/`, and the launch-site `FlagGate` was removed. Re-introducing a coming-soon page behind a launch flag recreates an infinite redirect loop, so it must not be added back.
