# Panelverse Design System

## 1. Product and brand direction

Panelverse is a collaborative comic publishing platform for creators and readers.

- **Design direction:** Hybrid Universe — one recognizable brand system with purpose-built public reader and creator-workspace experiences.
- **Personality:** Bold Creative Collective with a premium storytelling influence.
- **Qualities:** expressive, not chaotic; creative, not childish; premium, not pretentious; collaborative, not corporate; ambitious, not intimidating.
- **Component style:** Soft & Modern — moderate rounding, subtle borders, restrained shadows, clear hierarchy.
- **Theme strategy:** light-first platform surfaces; dark surroundings for both reading modes.
- **Iconography:** minimal editorial line icons; comic-inspired accents are reserved for branding and promotional moments, not dense production tools.

## 2. Color tokens

### Brand palette

| Token | Initial value | Intended use |
|---|---|---|
| `ink` | `#171717` | Primary text, dark surfaces, strong contrast |
| `paper` | `#F7F0E3` | Warm light page/background surfaces |
| `comic-red` | `#E44735` | Primary brand/action accent |
| `golden-yellow` | `#F2C14E` | Secondary accent, highlights, attention cues |

These are approved starting values, not a substitute for contrast testing. Do not assume every palette pair is accessible.

### Semantic tokens

Define semantic tokens in code instead of scattering raw hex values through components.

| Semantic token | Role |
|---|---|
| `--color-bg` | Default page background, initially paper |
| `--color-surface` | Cards, panels, menus |
| `--color-surface-muted` | Subtle inset or secondary surface |
| `--color-text` | Primary text, initially ink |
| `--color-text-muted` | Supporting text with readable contrast |
| `--color-border` | Default divider and outline |
| `--color-primary` | Main action accent, initially comic red |
| `--color-primary-foreground` | Text/icon color on primary actions; choose after contrast testing |
| `--color-accent` | Secondary accent, initially golden yellow |
| `--color-focus` | Visible keyboard focus ring |
| `--color-success` | Success state |
| `--color-warning` | Warning state |
| `--color-danger` | Error/destructive state |
| `--color-info` | Informational state |

Create a separate dark-reader semantic layer: `--reader-bg`, `--reader-surface`, `--reader-text`, `--reader-text-muted`, `--reader-border`, and `--reader-focus`. Reading controls must remain visible without overpowering the artwork.

Status colors are semantic, not decorative. Pair color with a text label or icon; never communicate a state through color alone.

## 3. Typography

- **UI/body:** Inter.
- **Headings and brand accents:** Space Grotesk.
- Use a restrained hierarchy. Headings may be expressive, but production screens must prioritize clarity and scanning.
- Body text should remain comfortably readable; avoid tiny metadata, especially on mobile.
- Use tabular numerals for episode numbers, timestamps, counts, and progress values when useful.
- Avoid long all-caps labels. Use sentence case for controls and navigation.

Suggested type scale (adjust to the existing app's implementation conventions):

| Token | Suggested size | Typical use |
|---|---:|---|
| `text-xs` | 12px | Secondary metadata; use sparingly |
| `text-sm` | 14px | Labels, compact supporting text |
| `text-base` | 16px | Default body and form text |
| `text-lg` | 18px | Emphasized body/subhead |
| `text-xl` | 20px | Small section headings |
| `text-2xl` | 24px | Page section headings |
| `text-3xl` | 30px | Page titles on compact layouts |
| `text-4xl` | 36px | Large desktop page titles or promotional headings |

Use fluid sizing only where it improves the responsive layout; do not let large headings push essential actions below the fold on small screens.

## 4. Spacing, layout, shape, and elevation

Use a consistent 4px-based spacing rhythm.

| Token | Value |
|---|---:|
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-5` | 20px |
| `space-6` | 24px |
| `space-8` | 32px |
| `space-10` | 40px |
| `space-12` | 48px |
| `space-16` | 64px |

- Keep a clear separation between page-level sections and controls within a section.
- Prefer alignment and whitespace over heavy borders or decoration.
- Use moderate radii consistently: small for inputs and compact controls, medium for cards, larger only for prominent feature surfaces.
- Use shadows sparingly for elevation and overlays. Avoid using shadow as the only way to communicate boundaries.
- Establish readable maximum widths for long-form text and series descriptions.
- Keep creator workspaces dense enough for productive work, but not crowded.

## 5. Responsive breakpoints

| Range | Intended behavior |
|---|---|
| Mobile | `<640px` |
| Large mobile | `640–767px` |
| Tablet | `768–1023px` |
| Desktop | `1024–1279px` |
| Wide desktop | `≥1280px` |

Treat these as layout guides, not rigid rules for every component.

- **Desktop:** full creator sidebar and multi-column production layout where justified.
- **Tablet:** compact or collapsible sidebar; panels may stack or become tabs.
- **Mobile:** public browsing and reading are first-class; support essential creator actions, but do not force complex production editing into a narrow layout.
- Avoid horizontal page overflow. If a work area truly requires horizontal movement, constrain it to that work area and make the behavior apparent.

## 6. Navigation and layout shells

### Public shell
- Simple, reader-focused navigation.
- Primary destinations: home/discovery, browse/search, and authentication or creator entry where appropriate to the existing MVP.
- Mobile navigation must remain compact and keyboard accessible.
- Public pages must not expose private drafts or team-only metadata.

### Creator shell
- Dedicated authenticated workspace.
- Desktop: full sidebar with clear active state.
- Tablet: compact/collapsible sidebar.
- Mobile: drawer or compact navigation pattern.
- Series-level navigation and episode-level navigation must be visually distinct.
- Display only destinations and actions allowed by the user's role.

### Reader shell
- Dark environment in both reader modes.
- Artwork remains the visual focus.
- Controls are minimal and context-aware, with accessible alternatives to gestures.
- Avoid persistent overlays that obscure meaningful artwork.

## 7. Core component behavior

### Buttons
Variants: primary, secondary, tertiary/ghost, destructive, icon-only. Sizes should be consistent and touch-friendly.

Every interactive button needs:
- default, hover, focus-visible, active, disabled, and loading states as applicable;
- a clear accessible name;
- disabled/loading behavior that prevents duplicate submissions;
- confirmation for consequential actions where the product workflow requires it.

Do not make a button appear active if its action is not implemented.

### Forms and inputs
- Persistent visible labels; placeholders are supplementary, not labels.
- Inline validation near the field and a form-level summary for submission failures where useful.
- Preserve entered values when a recoverable submission error occurs.
- Use appropriate input types and autocomplete hints.
- Clearly distinguish validation errors from server/network errors.

### Cards and lists
- Use consistent spacing and alignment.
- Make the primary action obvious without making every nested element a separate competing target.
- Keep clickable regions keyboard accessible.
- Use real content and real status values; do not fabricate social proof or activity.

### Status badges
- Use text plus color/icon for Draft, In Review, Ready to Publish, and Published.
- Keep review status distinct from publication status if the underlying workflow models them separately.
- Do not invent additional lifecycle states without approval.

### Dialogs and sheets
- Use for confirmations or focused short tasks, not as a default home for complex workflows.
- Provide a visible close/cancel path when safe.
- Manage focus appropriately and return focus to the trigger when closed.
- Mobile filters may use a sheet/drawer.

### Feedback and notifications
- Confirm successful actions in context.
- Explain failures in plain language and provide a recovery path where possible.
- Do not expose internal stack traces or sensitive server details.

## 8. Reader requirements

### Shared
- Dark surroundings and strong artwork priority.
- Clear series/episode context and access to episode navigation.
- Progress information only when supported by reliable data.
- Controls must be discoverable and operable with keyboard and assistive technology.
- Preserve the distinction between public availability and private/unpublished content.

### Vertical-scroll mode
- Natural continuous scrolling.
- Images should scale to the reading column without distortion.
- Avoid controls that cover artwork.
- Episode completion/transition should be clear and not interrupt reading unnecessarily.

### Paginated mode
- Clear previous/next page controls and current progress when available.
- Keyboard navigation should be provided where appropriate and should not hijack typing in controls.
- Touch/swipe gestures may supplement, but not replace, visible accessible controls.
- The default reader mode follows the episode's configured format.

## 9. Accessibility and quality bar

- Target WCAG 2.2 AA for applicable UI.
- Test text and interactive-component contrast, including brand red and yellow combinations.
- Visible focus indicators for keyboard navigation.
- Logical heading order and landmarks.
- Correct accessible names, roles, and states for controls.
- Respect reduced-motion preferences.
- Do not rely on color alone for status.
- Ensure touch targets are comfortably usable; aim for approximately 44×44 CSS pixels where practical.
- Images require appropriate alternative text where meaningful; decorative images should be ignored by assistive technology.
- Forms must have associated labels and understandable errors.
- Dialogs, menus, drawers, and reader controls must work with keyboard.
- Test responsive layouts at the documented breakpoints and at intermediate widths.

## 10. Loading, empty, error, and disabled states

- **Loading:** preserve layout where possible; use skeletons only when they improve perceived stability.
- **Empty:** explain what is absent and show a relevant next action only if that action is permitted and in scope.
- **Error:** plain-language explanation and retry/recovery when meaningful.
- **Permission denied:** explain that access is unavailable without revealing private resource details.
- **Not found:** show a clear unavailable/not-found state without exposing whether a private record exists.
- **Disabled:** visually distinguish unavailable actions and provide explanation where the reason may be unclear.

## 11. Content and imagery rules

- Use real platform data once connected.
- During development, use clearly identified fixtures, never fake “trending” or popularity claims in production.
- Keep image aspect ratios intentional and avoid stretching comic artwork.
- Provide a graceful fallback for missing covers, thumbnails, or episode images.
- Never reveal draft episode art or private production content through public routes or image URLs.
