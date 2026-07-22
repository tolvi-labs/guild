# Guild directives — design-lib

- Every interactive nav item MUST use the shared `navLink` underline-on-active treatment (lime bottom border when active) — a bespoke per-item border regresses the active-state bug where only one item underlined.
- A new interactive control placed inside an `aria-hidden` region MUST move `aria-hidden` onto the animated body only, so the control stays reachable.
