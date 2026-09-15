<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Trainology repository rules

## Scope

- Change only files required by the task. Do not perform unrelated cleanup or refactoring.
- At the start of a task, run `git status --short` and preserve existing user-owned dirty and untracked changes.
- Read `docs/calculator-governance.md` before changing a calculator, its scientific claims, or its lifecycle.

## Scientific calculators

- Do not add a formula, threshold, coefficient, classification, percentile, reference band, or ideal/optimal claim without an explicit Scientific Claim Lock in the task.
- Do not change an existing scientific engine unless the task explicitly includes that engine.
- Preserve source -> claim -> implementation -> regression-test traceability.
- Keep engines independent from UI and fail closed: missing, non-finite, invalid, unknown, or out-of-scope input must not produce a numeric result.
- Use full precision for canonical calculations. Keep display rounding separate, and round intermediate values only when the scientific method requires it.
- Do not present health diagnoses or unsupported ideal/optimal language.

## Final lock

- Do not change a `FINAL_LOCK` product without an explicitly scoped task. A final lock is changeable when the task explicitly authorizes it.
- FFMI is `FINAL_LOCK`. In unrelated work, do not change its formulas, reference dataset, measurement gate, scientific claim language, uncertainty behavior, validation/scope behavior, or relevant regression tests.

## Decommission

- Read the decommission list from `docs/calculator-governance.md`.
- Do not restore a `DECOMMISSIONED` product because it appears in an old prompt, Git history, stale documentation, or an empty directory.

## Persistence

- Unless a product requirement explicitly says otherwise, do not persist personal calculator inputs or results in `localStorage`, `sessionStorage`, cookies, IndexedDB, or server storage.
- Use URL parameters only for a documented low-sensitivity handoff. The approved Energy Lab -> Macro exception transfers only a validated calorie target.

## Responsive and accessibility

- Primary desktop QA is 1366x768 at 100% browser zoom. Also check 1920x1080 and mobile widths of 360/375px or greater.
- Do not use CSS zoom, transform scaling, content hiding, clipping, unreadably small typography, or unnecessary sticky CTAs to fake viewport fit.
- Preserve semantic native controls, keyboard access, visible focus, associated errors, appropriate `aria-invalid`/`aria-describedby`, approximately 44px targets, and result announcements where appropriate.
- Source-contract tests do not replace real browser QA.

## Git

- Do not use destructive Git commands or erase user changes with reset, clean, or checkout overwrite.
- Commit, push, tag, release, and deploy only when explicitly requested.
- Before the final response, inspect `git diff`, `git diff --check`, and `git status --short`.

## Environment

- Do not print secret values or commit `.env` files. Treat every `NEXT_PUBLIC_*` value as browser-visible and never place a secret in one.
- Do not invent missing secrets.
