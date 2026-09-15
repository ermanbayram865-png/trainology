# Trainology Calculator Governance

This document is the single source of truth for calculator development lifecycle decisions. Runtime catalog data remains in application code.

## Decision Priority

1. Scientific accuracy
2. Real user value
3. Brand trust
4. Long-term brand value
5. Business goals
6. Short-term engagement

## Lifecycle States

- `ACTIVE`: Supported production product; normal scoped maintenance is allowed.
- `SCIENTIFIC_FINAL_LOCK`: Scientific model and claim boundaries are complete. Reopening requires material new evidence, an identified scientific error, an implementation bug, or an explicit Trainology scientific revision.
- `FINAL_LOCK`: The product's scientific and functional contracts are locked. Changes require a separately scoped unlock/review for a real P0/P1 bug or new scientific audit.
- `IN_REVISION`: Product under an explicitly tracked revision; do not assume its current contract is final.
- `DECOMMISSIONED`: Removed product or surface; it must not be restored without an explicit product decision.

Scientific status is independent from release QA. `MANUAL_BROWSER_PENDING` means the scientific model is locked but the product is not yet `RELEASE_COMPLETE`.

## Current Product Status

| Product or surface | Canonical route | Scientific/lifecycle state | Visual state | Release QA | Notes |
| --- | --- | --- | --- | --- | --- |
| Energy Lab / Kalori Hedefi Simülatörü | `/calculators/calorie` | `ACTIVE` · `SCIENTIFIC_FINAL_LOCK` · `FINAL_LOCK` | `VISUAL_SYSTEM_FINALIZED` | `MANUAL_BROWSER_PENDING` | Canonical energy calculator. `/analysis` is a non-indexed legacy redirect only. The scientific model, functional contract, and Energy → Macro handoff contract are locked. |
| Makro Planlayıcı | `/calculators/macro` | `SCIENTIFIC_FINAL_LOCK` | `VISUAL_SYSTEM_FINALIZED` | `MANUAL_BROWSER_PENDING` | Current protein branches, 30% starting fat allocation, carbohydrate remainder, 4/4/9 conversion, informational fiber reference, validation, and fail-closed behavior are locked. |
| Günlük Protein Referansı | `/calculators/protein` | `SCIENTIFIC_FINAL_LOCK` | `VISUAL_SYSTEM_FINALIZED` | `MANUAL_BROWSER_PENDING` | Current age, training, goal, range, anchor, scope, safety, calculation-weight, validation, and fail-closed behavior are locked. |
| Günlük Su Alımı Rehberi | None | `DECOMMISSIONED` | Not applicable | Not applicable | The scientifically defensible EFSA-based implementation provided a population-level total-water reference but insufficient calculator-specific personalization/value for the active Trainology calculator suite. Unsupported weight-, activity-, exercise-, or climate-based numeric formulas were intentionally not introduced to manufacture personalization. |
| FFMI Analizi | `/calculators/ffmi` | `SCIENTIFIC_FINAL_LOCK` | `VISUAL_SYSTEM_FINALIZED` | `MANUAL_BROWSER_PENDING` | Scientific lock scope is defined below. |
| BMI / healthy-weight | `/calculators/healthy-weight` | `DECOMMISSIONED` | Not applicable | Not applicable | Independent product route, catalog/sitemap entry, standalone engine/export, and product tests are removed. Internal BMI logic required by active calculators is not this product. |
| 1RM | `/calculators/1rm` | `DECOMMISSIONED` | Not applicable | Not applicable | Protected by decommission regression tests. |
| Training Load | `/calculators/training-load` | `DECOMMISSIONED` | Not applicable | Not applicable | Protected by decommission regression tests. |
| Performance | `/calculators/performance` | `DECOMMISSIONED` | Not applicable | Not applicable | Protected by decommission regression tests. |
| Movement Library | None | `DECOMMISSIONED` surface | Not applicable | Not applicable | Routes, data, and public entry points must remain absent. |
| Exercise Fluid Guide | Former Water sub-product | `DECOMMISSIONED` | Not applicable | Not applicable | Tab UI, duration/environment/perceived-sweat workflow, and active guide logic are removed. |
| Sweat Rate Calculator | Former Water sub-product | `DECOMMISSIONED` | Not applicable | Not applicable | Pre/post bodyweight, fluid/urine, sweat-loss, sweat-rate formulas, UI, exports, and dedicated tests are removed. |

The final public calculator suite contains exactly four products:

1. Energy Lab / Kalori Hedefi Simülatörü
2. Makro Planlayıcı
3. Günlük Protein Referansı
4. FFMI Analizi

## Scientific Change Policy

Adding or changing a formula, threshold, coefficient, classification, percentile, reference band, or ideal/optimal claim requires an explicit Scientific Claim Lock in the task. Record source, claim, implementation location, scope limits, and regression coverage together. Do not change a scientific engine outside the task scope or use diagnostic, guaranteed, or unsupported ideal/optimal language.

## Macro and Protein Scientific Claim Lock

| Rule | Locked claim boundary | Evidence status |
| --- | --- | --- |
| 0.83 g/kg/day | General-adult population reference where currently applicable; not an exact personal requirement. | Direct EFSA adult PRI support. |
| 1.0–1.2 g/kg/day | Older-adult reference where currently applicable; individual context still matters. | Direct older-adult guideline support. |
| 1.2 g/kg/day | Cautious Trainology starting reference during fat loss in the current non-training branch; not universal, optimal, mandatory, minimum, or maximum. | Derived from energy-restriction evidence; population-dependent rather than a universal direct requirement. |
| 1.4–2.0 g/kg/day | Practical exercise-context range where currently applicable; no deterministic selection within the range. | Direct healthy exercising-adult position-stand support. |
| 1.6 g/kg/day | Evidence-informed resistance-training starting reference; not a universal optimum or exact requirement. | Supported by resistance-training meta-analysis context. |
| 1.6–2.0 g/kg/day | Practical resistance-training plus fat-loss range with 1.6 as the starting reference; no user-specific point is claimed. | Evidence-informed product range combining resistance-training and energy-restriction contexts. |
| BMI ≥30 calculation weight | If BMI <30 use actual weight; otherwise use `min(actualWeight, 30 × heightM²)` for the current Macro and Protein protein branches. This is a conservative Trainology calculation convention, not ideal, healthy, target, or clinically validated physiological-requirement weight. | Indirect and population-dependent evidence; convention prevents indefinite scaling with actual weight at higher BMI. |

These claims must not be silently expanded to new populations. Macro and Protein scientific engines may be reopened only for material new evidence, an identified scientific error, an implementation bug, or an explicit Trainology scientific revision.

## Final Lock Policy

Energy Lab is `FINAL_LOCK`. Its NASEM 2023 EER implementation, secondary Mifflin–St Jeor RMR estimate, input boundaries, activity model, BMI and scope gates, fixed 10% fat-loss starting deficit, 500 kcal cap, raw ≤1,200 output-withholding gate, ×1.00/×1.05 gain policy, display rounding, result availability rules, and Energy → Macro prefill eligibility contract must not change during normal design or polish work in Phases 2–6. Reopening requires a separately scoped unlock/review for a real P0/P1 bug or a new scientific audit.

FFMI's formulas, reference dataset, measurement gate, scientific claim language, uncertainty behavior, validation/scope behavior, and relevant regression tests are locked against unrelated changes. An explicit FFMI task may change them when it also updates scientific traceability and regression coverage.

The decommissioned Water products must remain absent. This includes Günlük Su Alımı Rehberi, Exercise Fluid Guide, and Sweat Rate Calculator. Do not restore a weight-based daily formula, 1 mL/kcal, Holliday–Segar, fixed exercise-minute addition, fixed temperature/humidity addition, automatic beverage-only conversion, or water-turnover equation presented as a drinking target.

## Decommission Policy

Do not restore decommissioned products or surfaces from old prompts, Git history, stale documentation, generated output, or empty local directories. A return requires a new explicit product decision and a separately scoped implementation task. Absence regression tests remain the mechanical protection.

## Persistence

Default: personal calculator inputs and results remain in transient in-page state and are not persisted unless an explicit product requirement approves otherwise.

| Active calculator | Verified behavior |
| --- | --- |
| Energy Lab | Transient React state; no local/session storage, cookie, IndexedDB, or server handoff. |
| Macro | Transient state; reads an optional validated `calories` query parameter and otherwise starts blank. No storage or server persistence. |
| Protein | Transient client state; no repository implementation of storage or server persistence. |
| FFMI | Transient client state; regression tests prohibit stored inputs/results/history. |

Approved exception: Energy Lab may transfer only the selected validated calorie target to Macro as `?calories=...`. Do not include age, height, weight, health scope, or the full result. URL values may be retained in browser history, shared URLs, and hosting logs, so the handoff must remain low sensitivity and minimal.

## Validation

Calculator engines must fail closed independently of the UI. Missing, malformed, non-finite, invalid enum, unknown, and out-of-scope inputs must not produce numeric results. Test technical limits, exact boundaries, and inclusive/exclusive behavior.

## Rounding

Canonical calculations use full precision. Display formatting and rounding are separate from calculation logic. Intermediate rounding is allowed only when the documented scientific method requires it.

## QA

- Primary desktop: 1366x768 at 100% browser zoom.
- Secondary desktop: 1920x1080.
- Mobile: 360px and 375px widths or greater.
- Keyboard: complete the flow, reach every control, see focus, understand errors, and receive result announcements.
- Source-contract tests supplement but do not replace real browser QA.

Do not use CSS zoom, transform scaling, hidden content, clipping, unreadably small text, or unnecessary sticky CTAs to simulate a pass.

## Release Verification

Run checks in this order:

1. Targeted tests.
2. Relevant calculator regressions.
3. `npm test`.
4. `npm run typecheck`.
5. `npm run lint`.
6. `npm run build` with a valid public HTTPS `NEXT_PUBLIC_SITE_URL` supplied by the environment.
7. `git diff --check`.
8. `git status --short` and final diff review.

UI changes additionally require the viewport and keyboard QA above. Never generate or hard-code a secret for verification.
