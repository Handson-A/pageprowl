# Panelverse — Pass 1: Brand Foundation & Antigravity Implementation Brief

**Purpose:** Integrate the approved Panel P brand direction into the existing Panelverse application without duplicating work that may already be complete. This pass extends the approved Phase 2 design system; it does not reopen product-scope decisions.

## Instructions to Antigravity

Read this document and the existing Panelverse documentation, especially `docs/design-system.md`, `docs/decision-register.md`, and `docs/antigravity-handoff.md`.

**First inspect the repository and existing implementation.** Determine whether the logo, favicon, design tokens, and motion/accessibility conventions already exist. Reuse and improve working implementations rather than creating duplicates. Preserve uncommitted user changes.

Then implement only the missing or incomplete items described below.

- Do not perform the full dashboard redesign in this pass; that belongs to Pass 2.
- Do not add fake series, statistics, activity, or production comic content.
- Do not add unapproved features or reopen settled MVP decisions.
- Do not commit, push, merge, deploy, or perform destructive operations.
- Run available checks and report actual results. Do not claim anything was tested unless it was.

## 1. Approved brand direction

- **Concept:** The Panel P.
- **Construction:** A bold geometric P assembled from comic-panel shapes.
- **Character:** Editorial, confident, creative, modern; not childish or cluttered.
- **Primary palette:** Ink `#171717`, Paper `#F7F0E3`, Comic Red `#E44735`, Golden Yellow `#F2C14E`.
- **Primary wordmark:** `PANELVERSE`, with optional descriptor `COMICS / CREATORS / TOGETHER`.
- **Compact mark:** Panel P symbol.
- **Favicon:** Simplified symbol with strong contrast and a clear silhouette at small sizes.

## 2. Supplied assets

- `assets/panelverse-wordmark.svg` — wordmark for light surfaces.
- `assets/panelverse-wordmark-dark-bg.svg` — wordmark for dark surfaces.
- `assets/panelverse-icon.svg` — compact icon.
- `assets/favicon.svg` — favicon source.

These are initial SVG assets. Inspect them in-browser and refine geometry or spacing if needed before considering them final. They are not a claim of trademark clearance.

### Usage rules

- Use the full wordmark in roomy public-brand placements and selected Studio entry points.
- Use the compact mark in tight navigation, browser/app icons, and small branded moments.
- Omit the descriptor in small placements.
- Do not stretch, skew, recolor arbitrarily, or add effects to the logo.
- On light surfaces, use the light-surface wordmark; on dark surfaces, use the dark-background variant.
- Verify the favicon at 16, 32, and 48 px. Simplify it further if details become unclear.
- Store assets locally; do not rely on third-party image URLs.

For Next.js App Router, use the existing metadata conventions. If appropriate, place the favicon at `app/icon.svg` and other brand assets under `public/brand/`. Avoid duplicate favicon sources unless the app genuinely needs them.

## 3. Existing design tokens

Preserve the Phase 2 palette and typography as the source of truth. Do not silently replace them with colors from illustrative mockups.

Suggested supporting tokens below are defaults only. Adapt to the existing conventions and do not duplicate equivalent tokens already present.

```css
:root {
  --pv-color-ink: #171717;
  --pv-color-paper: #F7F0E3;
  --pv-color-red: #E44735;
  --pv-color-yellow: #F2C14E;
  --pv-color-surface: #FFFFFF;
  --pv-color-surface-muted: #F4EBDD;
  --pv-color-border: #E2D5C2;
  --pv-color-text-muted: #625D55;
  --pv-color-success: #237A4B;
  --pv-color-warning: #9A6500;
  --pv-color-danger: #B42318;

  --pv-radius-sm: 6px;
  --pv-radius-md: 10px;
  --pv-radius-lg: 16px;
  --pv-radius-xl: 22px;

  --pv-shadow-card: 0 4px 16px rgb(23 23 23 / 6%);
  --pv-shadow-overlay: 0 16px 48px rgb(23 23 23 / 18%);

  --pv-motion-fast: 120ms;
  --pv-motion-standard: 200ms;
  --pv-motion-emphasis: 280ms;
  --pv-ease-standard: cubic-bezier(.2, .7, .2, 1);
}
```

Only add semantic colors after checking their contrast and role. Keep the design system cohesive rather than creating parallel token systems.

## 4. Motion principles

Motion should communicate interaction, hierarchy, and state—not decorate every element.

- Use fast feedback for buttons, focus, and pressed states.
- Use standard transitions for menus, tabs, cards, and small panels.
- Use emphasis transitions for dialogs and meaningful section entrances.
- Prefer opacity and small transforms over large, distracting movement.
- Avoid scroll-jacking, heavy parallax, constant animation, and movement that competes with comic artwork.
- Respect `prefers-reduced-motion: reduce`; remove or minimize nonessential movement.
- Never rely on animation alone to communicate status or success.
- Upload progress must reflect actual progress; never fabricate progress.

Suggested timings:
- Hover/pressed/focus feedback: 100–150 ms.
- Menus and popovers: 140–200 ms.
- Dialogs and section transitions: 180–280 ms.
- Keep skeleton shimmer restrained and reduce or disable it for reduced-motion users.

## 5. Depth and surface principles

- Use Paper as a supporting canvas, not as a reason to leave large areas visually empty.
- Establish hierarchy through surface contrast, spacing, borders, and restrained shadows.
- Use real cover artwork when available; do not fabricate production comics or activity.
- Public discovery may use larger artwork-led hero compositions.
- Studio should remain task-oriented, with branded accents and artwork where they help orientation.
- Empty states should feel intentional, with concise guidance and one clear next action.
- Reserve the dark immersive environment for reading experiences and selected dark-brand placements.
- Do not add a hero banner to every screen; match visual weight to the page's purpose.

## 6. Accessibility and performance

- Maintain visible keyboard focus and check contrast for text, controls, badges, and focus indicators.
- Use semantic controls and accessible names.
- Do not communicate status by color alone.
- Keep animation lightweight and avoid layout shifts.
- Respect reduced-motion preferences.
- Ensure screens remain fully usable when motion is disabled.
- Keep assets optimized and responsive.

## 7. Implementation sequence

1. Inspect the existing app, metadata, brand assets, design tokens, and motion conventions.
2. Report what already exists and identify only the genuine gaps.
3. Integrate or refine the logo and favicon where needed.
4. Reuse or add supporting tokens without duplicating existing ones.
5. Ensure reduced-motion and accessibility behavior is correct.
6. Run available lint, type-check, test, and build commands.
7. Review the diff for accidental changes, duplicates, fake data, or unrelated modifications.

## 8. Acceptance checklist

- [ ] Existing work was inspected before editing; completed work was reused.
- [ ] Wordmark and icon render clearly on light and dark surfaces.
- [ ] Favicon is recognizable at 16, 32, and 48 px.
- [ ] Brand assets are local and use the approved Panelverse palette.
- [ ] Existing Phase 2 colors and typography remain intact.
- [ ] Supporting tokens reuse existing conventions rather than duplicate them.
- [ ] Reduced-motion preference is respected.
- [ ] Focus, hover, pressed, disabled, loading, and error states remain clear.
- [ ] No fake metrics, fake activity, or unapproved navigation/features were introduced.
- [ ] Responsive behavior remains intact.
- [ ] Verification results and any untested items are reported honestly.

## 9. Completion report

Report:
1. What was already implemented.
2. What was added or refined.
3. Files changed.
4. Commands run and actual results.
5. Anything not verified and why.
6. Any remaining blockers.

Do not commit, push, merge, or deploy. The developer will review and commit manually.
