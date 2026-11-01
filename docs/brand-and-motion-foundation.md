# PageProwl Brand & Motion Foundation — Pass 1 (formerly Panelverse)

**Status:** Initial implementation-ready proposal based on the approved Panel P direction. This extends the approved Phase 2 design system without reopening product-scope decisions.

## 1. Logo system

- **Direction:** The Panel P — a bold geometric P built from comic-panel shapes.
- **Primary palette:** Ink `#171717`, Paper `#F7F0E3`, Comic Red `#E44735`, Golden Yellow `#F2C14E`.
- **Primary wordmark:** `PAGEPROWL`, with optional descriptor `COMICS / CREATORS / TOGETHER` (formerly `PANELVERSE`).
- **Compact mark:** Panel P symbol for tight navigation and app/browser icons.
- **Favicon:** Simplified symbol on a dark square for small-size contrast.

### Assets
- `public/brand/pageprowl-wordmark.svg` (and legacy `panelverse-wordmark.svg`) — for light surfaces.
- `public/brand/pageprowl-wordmark-dark-bg.svg` (and legacy `panelverse-wordmark-dark-bg.svg`) — for dark surfaces.
- `public/brand/pageprowl-icon.svg` (and legacy `panelverse-icon.svg`) — compact icon.
- `assets/favicon.svg` — favicon source.

These are first-pass vector assets. Inspect them in-browser and adjust geometry/spacing before considering them final. They are not a claim of trademark clearance.

### Usage
- Use the full wordmark in roomy public-brand placements and selected Studio entry points.
- Use the compact mark in tight navigation and small branded moments.
- Do not stretch, skew, recolor arbitrarily, or add effects to the logo.
- Omit the descriptor in small placements.
- Verify the favicon at 16, 32, and 48 px; simplify further if detail becomes unclear.

## 2. Existing design tokens

Preserve the Phase 2 palette as source of truth:
- Ink: `#171717`
- Paper: `#F7F0E3`
- Comic Red: `#E44735`
- Golden Yellow: `#F2C14E`

Do not silently replace these with colors from illustrative mockups. Check contrast for all semantic colors.

## 3. Suggested supporting tokens

Adapt to existing code conventions; do not duplicate equivalent tokens already in the project.

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

## 4. Motion principles

Motion should communicate interaction, hierarchy, and state—not decorate every element.

- Fast feedback for buttons, focus, and pressed states.
- Standard transitions for menus, tabs, cards, and small panels.
- Emphasis transitions for dialogs and meaningful section entrances.
- Prefer opacity and small transforms over large movement.
- Avoid scroll-jacking, heavy parallax, constant animation, or motion that competes with comic artwork.
- Respect `prefers-reduced-motion: reduce`.
- Never rely on animation alone to communicate status or success.

Suggested timings:
- Hover/pressed/focus: 100–150 ms.
- Menus and popovers: 140–200 ms.
- Dialogs and section transitions: 180–280 ms.
- Upload indicators must reflect real progress; never fabricate progress.
- Keep skeleton shimmer restrained and reduce/disable it for reduced-motion users.

## 5. Depth and surfaces

- Use Paper as a supporting canvas, not as a reason to leave large areas visually empty.
- Establish hierarchy through surface contrast, spacing, borders, and restrained shadows.
- Use real cover artwork when available; do not fabricate production comics or activity.
- Public discovery can use larger artwork-led hero compositions.
- Studio should remain task-oriented, with branded accents and artwork where they help orientation.
- Empty states should feel intentional, with concise guidance and one clear next action.
- Reserve the dark immersive environment for reading experiences and selected dark-brand placements.
- Do not add a hero banner to every screen; match visual weight to the page's purpose.

## 6. Accessibility and performance

- Maintain visible keyboard focus and check contrast.
- Use semantic controls and accessible names.
- Do not communicate status by color alone.
- Keep motion lightweight and avoid layout shifts.
- Respect reduced-motion preferences.
- Ensure all screens remain usable when motion is disabled.

## 7. Acceptance checklist

- [ ] Wordmark and icon render on light and dark surfaces.
- [ ] Favicon remains legible at 16, 32, and 48 px.
- [ ] Assets are local, not loaded from third-party URLs.
- [ ] Existing Phase 2 colors and typography remain intact.
- [ ] Motion tokens reuse existing conventions rather than duplicate them.
- [ ] Reduced-motion preference is respected.
- [ ] Focus, hover, pressed, disabled, loading, and error states remain clear.
- [ ] No fake metrics, fake activity, or unapproved feature navigation is introduced.
- [ ] Responsive behavior remains intact.
