---
version: "alpha"
name: "Polyglow"
description: "A multilingual editorial Astro theme with a black, white, and gray interface, image-led glass cards, compact archives, dark mode, Astro view transitions, Pagefind search, and long-form typography."
colors:
  background: "#FFFFFF"
  foreground: "#0A0A0A"
  card: "#FFFFFF"
  cardForeground: "#0A0A0A"
  popover: "#FFFFFF"
  popoverForeground: "#0A0A0A"
  primary: "#171717"
  primaryForeground: "#FAFAFA"
  secondary: "#F5F5F5"
  secondaryForeground: "#171717"
  muted: "#F5F5F5"
  mutedForeground: "#737373"
  accent: "#F5F5F5"
  accentForeground: "#171717"
  destructive: "#DC2626"
  border: "#E5E5E5"
  input: "#E5E5E5"
  ring: "#737373"
  darkBackground: "#0A0A0A"
  darkForeground: "#FAFAFA"
  darkCard: "#171717"
  darkPopover: "#171717"
  darkPrimary: "#E5E5E5"
  darkPrimaryForeground: "#171717"
  darkSecondary: "#262626"
  darkSecondaryForeground: "#FAFAFA"
  darkMuted: "#262626"
  darkMutedForeground: "#A3A3A3"
  darkAccent: "#262626"
  darkAccentForeground: "#FAFAFA"
  darkBorder: "#262626"
  darkInput: "#262626"
  darkRing: "#A3A3A3"
  glassOverlay: "#000000"
  glassOverlayStrong: "#262626"
  glassBorder: "#FFFFFF"
  glassSurfaceLight: "#FFFFFF"
typography:
  sans:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: "1.5"
    letterSpacing: "0px"
  heading:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: "1.15"
    letterSpacing: "0px"
  heroTitle:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "3rem"
    fontWeight: 800
    lineHeight: "1.05"
    letterSpacing: "0px"
  articleBody:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: "2rem"
    letterSpacing: "0px"
  nav:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: "1.25"
    letterSpacing: "0px"
  label:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: "1.25"
    letterSpacing: "0.025em"
  small:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: "1.5"
    letterSpacing: "0px"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
  card: "24px"
  hero: "28px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  page-x: "16px"
  page-x-sm: "20px"
  page-x-md: "24px"
  section-y: "40px"
components:
  page:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.sans}"
  page-dark:
    backgroundColor: "{colors.darkBackground}"
    textColor: "{colors.darkForeground}"
    typography: "{typography.sans}"
  post-card:
    backgroundColor: "{colors.glassOverlay}"
    textColor: "{colors.primaryForeground}"
    rounded: "{rounded.card}"
    padding: "{spacing.md}"
  article-hero-panel:
    backgroundColor: "{colors.glassOverlayStrong}"
    textColor: "{colors.primaryForeground}"
    rounded: "{rounded.xl}"
    padding: "{spacing.lg}"
  text-card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.cardForeground}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  taxonomy-card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  nav-link:
    textColor: "{colors.mutedForeground}"
    typography: "{typography.nav}"
  primary-button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primaryForeground}"
    rounded: "{rounded.md}"
    padding: "12px"
  secondary-button:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondaryForeground}"
    rounded: "{rounded.md}"
    padding: "12px"
  search-input:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: "{spacing.md}"
  meta-pill:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.pill}"
    padding: "{spacing.sm}"
  glass-meta-pill:
    backgroundColor: "{colors.glassOverlayStrong}"
    textColor: "{colors.primaryForeground}"
    rounded: "{rounded.pill}"
    padding: "{spacing.sm}"
  destructive-button:
    backgroundColor: "{colors.destructive}"
    textColor: "{colors.primaryForeground}"
    rounded: "{rounded.md}"
    padding: "12px"
---

## Overview

Polyglow is a multilingual editorial publishing interface built on Astro static
output. The live visual system is implemented in `src/styles/global.css`; this
file records the same system as tokens and design rules so later UI work keeps
the current theme intact.

The current interface is neutral, content-first, image-led, and compact. The
light theme uses white reading surfaces, near-black text, and restrained gray
structure. It also uses strong real imagery, glass panels over post covers and
article heroes, quiet navigation, dense archive rows, readable prose, Pagefind
search styling, Astro view transitions, and a light/dark theme switcher.

## Theme Model

Runtime theming lives in `src/styles/global.css`. Tailwind v4 token namespaces
map to semantic CSS variables, then `:root` and `.dark` provide the live light
and dark values.

`DESIGN.md` stores sRGB approximations of the current OKLCH runtime tokens.

## Color System

The interface palette is black, white, and gray:

- `background` and `foreground` define the main reading surface.
- `card`, `popover`, `secondary`, `muted`, and `accent` support cards,
  dropdowns, hover states, chips, search results, and low-emphasis UI.
- `primary` and `primaryForeground` define high-emphasis actions, links,
  current-location indicators and focus treatment through neutral contrast.
- `border`, `input`, and `ring` define structure and focus affordances.
- `destructive` is the only semantic hue and remains reserved for destructive
  or error states; it is not a brand or navigation color.
- `glassOverlay`, `glassOverlayStrong`, `glassBorder`, and
  `glassSurfaceLight` support post-card panels, article hero panels, dropdowns,
  and mobile navigation.

The light page background and elevated cards remain white, separated by neutral
borders, shadows, and spacing. Dark mode keeps the same neutral hierarchy with
darker surfaces and lighter text. Use the dark tokens as design references;
runtime switching stays in CSS.

## Typography

The project uses a system sans stack throughout. This keeps startup fast,
supports all configured locales, and avoids external font loading.
Available optical sizing is enabled at the document root.

Article prose uses `1rem` type with `2rem` line height. Chinese, Japanese, and
Korean prose uses justified text where supported. Arabic pages rely on the
document `dir="rtl"` value and start-aligned prose. Headings are compact and
strong. Navigation and metadata stay small, with normal or slight positive
tracking only where the current UI already uses uppercase labels.

Article links keep a visible muted underline, soften on press, and show a clear
outline for keyboard focus.

Do not use viewport-scaled font sizes. Do not use negative letter spacing.

## Layout

The standard page frame is `max-w-6xl` with responsive horizontal padding.
Most pages use 16px on mobile and 24px on wider screens.

Article prose centers at `max-w-2xl`, which keeps long-form lines near 60-75
characters. Article media remains at `max-w-3xl` unless a page template
intentionally gives it a wider surface.
Archive, taxonomy, and search pages favor scanning density and compact rows
over promotional composition.

The homepage has three code-supported modes in `SITE_CONFIG.homepage.layout`:
`cover`, `archive`, and `text`. The default implementation currently uses
`cover`.

## Cards and Glass

Post cover cards use full-bleed imagery with a gradient and a glass content
panel. The glass panel uses dark translucent backgrounds, subtle white borders,
blur, and restrained shadow.

Article heroes use the same image-first language, with a centered glass title
panel over the image. Header, dropdown, and mobile navigation share the glass
language, but the fixed header itself uses theme background and border tokens
for legibility.

Text cards and taxonomy cards stay quiet: white surfaces in light mode, small
radius, thin neutral border, and modest hover movement.

Do not create cards inside cards. Do not turn full page sections into floating
cards.

## Shapes

The base runtime radius is 10px. Small controls use 6px, standard buttons and
dropdown items use 8px, regular cards use 10px to 14px, image cards use 24px to
28px, and metadata chips use fully rounded pills.

## Component Guidance

- **Header and nav:** compact height, theme background, subtle border, grouped
  category dropdowns, search, language switcher, theme switcher, and mobile nav.
  The current primary destination keeps the standard underline visible, uses
  stronger text weight, and exposes `aria-current="page"`.
- **Post cards:** image-first with readable glass panels and real imagery.
- **Article page:** image hero, compact metadata, centered readable prose, and
  related posts.
- **Archive list:** dense rows, tabular dates, truncated titles where needed,
  and no oversized cards.
- **Taxonomy pages:** compact link grids, pills, and paginated post grids.
- **Search:** Pagefind controls follow background, foreground, border, ring,
  and radius tokens.
- **Widgets:** GTM, AdSense, and x402 remain visually silent unless enabled by
  configuration.
- **Icons:** use `src/components/ui/Icon.astro` and the Lucide allowlist in
  `astro.config.mjs`.

### Press feedback

- **Rest:** preserve the entry's established color, opacity, position, and
  geometry.
- **Press:** respond in the first rendered frame with a restrained compositor
  scale and opacity change. Apply this language consistently to header action
  controls, post cards, archive rows, taxonomy entries, pagination, and primary
  action buttons.
- **Cancel:** when a pointer leaves the target or the gesture is cancelled,
  return directly to rest without triggering an action.
- **Commit:** after a successful release, let the native link or control action
  own the next state. Do not add a second bounce, displacement, or delayed
  confirmation.
- Keep `:focus-visible` treatment clear during every state. Press feedback must
  not change box dimensions, spacing, or document flow.

### RTL spatial mapping

- Treat inline start and inline end as the source of truth for drawer origins,
  disclosure anchors, spacing, alignment, and directional navigation icons.
- Mobile drawers enter from the logical end side and leave along the same path:
  right in LTR and left in RTL.
- Header disclosures remain attached to their trigger and inside the viewport in
  both directions. Visual mirroring must not reorder keyboard focus or change
  the localized route order.
- Current-location styling and category hierarchy retain the same semantics in
  both directions; directional icons mirror without changing their action.

### Adaptive materials

- Ordinary preferences retain the image-led glass language, translucent
  surfaces, and backdrop blur described above.
- `prefers-reduced-transparency: reduce` replaces functional glass surfaces
  with opaque card or background colors and removes backdrop blur. Image-card
  text panels use a stable dark surface so white text remains readable.
- `prefers-contrast: more` uses solid surfaces, foreground-colored structural
  borders, and shadow-free separation. Image-card panels use a solid dark
  surface with a white border.
- When both preferences are active, the stronger contrast treatment wins while
  every covered surface remains opaque and blur-free.
- Apply these rules to post-card panels, mobile navigation, header disclosures,
  Pagefind search input and fallback, taxonomy entries, pagination, and other
  functional glass badges. Preserve light, dark, LTR, and RTL semantics.

### Reduced motion

- Ordinary preferences retain the existing restrained, interruptible motion and
  the LTR/RTL paths documented above.
- `prefers-reduced-motion: reduce` removes drawer travel, dropdown displacement,
  card and image scale, hover lift, smooth scrolling, placeholder scale, and
  ClientRouter view-transition animation.
- Pressed controls retain immediate opacity or color feedback without scale or
  displacement. Year selection retains its pressed background and commits on
  native click while its overflow rail scrolls immediately.
- Small state indicators such as disclosure chevrons may update immediately;
  they must not introduce delayed completion or keep modal state waiting for a
  spatial transition.

The prose wrapper class is `content-prose`. Treat it as a stable CSS API
unless the rename is part of a deliberate cleanup across components, CSS, and
tests.

## Visual Constraints

- Keep UI text inside its container at mobile, tablet, and desktop sizes.
- Preserve multilingual and RTL layout behavior.
- Preserve real image-led surfaces for post cards and article heroes.
- Avoid decorative background blobs, one-note color palettes, and nested cards.
- Avoid visible UI text that explains implementation details.
