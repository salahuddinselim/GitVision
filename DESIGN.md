---
name: GitVision
description: An interactive Git learning platform — terminal, file explorer, and commit graph visualization for beginners and students.
colors:
  background: "#0f0f11"
  surface: "#161b22"
  surface-hover: "#1c2129"
  border: "#30363d"
  signal-blue: "#38a6ff"
  muted: "#8b949e"
  foreground: "#e6edf3"
  destructive: "#cb4343"
  success: "#3fb950"
  warning: "#d29922"
  graph-magenta: "#f778ba"
  graph-teal: "#39d2c0"
  graph-violet: "#bc8cff"
  graph-coral: "#ff7b72"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
  mono:
    fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.signal-blue}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  button-primary-hover:
    backgroundColor: "{colors.signal-blue}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "24px"
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
---

# Design System: GitVision

## 1. Overview

**Creative North Star: "The Command-Line Classroom"**

GitVision is a real developer surface — dark, monospace-native, GitHub-adjacent — that has been quietly built to teach. It never pretends to be a toy: the terminal is a real terminal, the commit graph is a real graph, the diffs are real diffs. What makes it a classroom rather than just a tool is what surrounds those primitives: generous breathing room, calm and legible type, and small moments of positive feedback (a resolved conflict, a completed lesson) that a production dev tool wouldn't bother with. The system draws confidence from technical precision, not decoration — colors and shapes carry meaning (a commit's graph color is data, not styling), and premium craft comes from restraint and consistency rather than visual noise.

This system explicitly rejects the generic AI-SaaS template look: no cream/sand backgrounds, no gradient-text hero headlines, no tiny uppercase eyebrow labels stacked above every section, no hero-metric-stat blocks, no interchangeable icon-card grids. It equally rejects the cold, personality-free enterprise-dashboard look — GitVision is warm at the edges (encouraging copy, celebratory micro-moments) even while its core chrome stays technical and precise.

**Key Characteristics:**
- Near-black canvas with a single bright signal-blue accent, not a multi-hue rainbow
- Monospace type appears anywhere Git output, hashes, or code live; humanist sans everywhere else
- Depth comes from layered surface steps (background → surface → surface-hover), not drop shadows
- The commit graph's per-branch color palette is the one place saturated color is expected and welcome
- Every irreversible-feeling action (reset, rebase, force-push) gets calm, reassuring UI language — this is a simulator, and the interface should never let the learner forget that

## 2. Colors

The palette is restrained-to-committed: one true accent (signal blue) plus a deep, low-chroma near-black neutral ramp. The graph palette is the deliberate exception — a full, saturated set reserved exclusively for distinguishing commit branches.

### Primary
- **Electric Signal Blue** (`#38a6ff` dark / `#2563eb` light): The single accent. Used for primary CTAs, active nav states, links, focus rings, and the terminal cursor. Bright and slightly electric — it should read like an active signal, not a corporate swatch.

### Neutral
- **Near-Black Canvas** (`#0f0f11`): The page background. Deliberately just off pure black — avoids the harshness of `#000` while staying unambiguously dark.
- **Raised Surface** (`#161b22`): Cards, panels, the terminal chrome, sidebar. One step up from canvas.
- **Surface Hover** (`#1c2129`): Hover/active state for anything built on Raised Surface.
- **Hairline Border** (`#30363d`): The only border color in the system. Used at low opacity (`/50`) on most cards for a softer separation.
- **Foreground Text** (`#e6edf3`): Primary text color. Off-white, not pure white, to sit comfortably on the near-black canvas.
- **Muted Text** (`#8b949e`): Secondary text, captions, timestamps, placeholder copy. Must still clear 4.5:1 against both background and surface — verify before use in body copy, not just labels.

### Semantic
- **Success Green** (`#3fb950`): Successful command output, resolved conflicts, completed lesson steps.
- **Warning Amber** (`#d29922`): Caution states — a command that could be destructive, an unstaged change.
- **Destructive Red** (`#cb4343`): Errors, failed commands, irreversible-action confirmations.

### The Commit Graph Palette (signature, not decorative)
A 15-color rotation (`#58a6ff #3fb950 #d29922 #f778ba #39d2c0 #bc8cff #ff7b72 #79c0ff #56d364 #e3b341 #f0883e #db6d28 #a371f7 #7ee787 #ffa657`) assigns one color per branch lane in the commit graph, cycling by branch index. This is the one place the system uses full, high-chroma saturation — because in this context, color IS information (which lane a commit belongs to), not styling.

### Named Rules
**The One Accent Rule.** Signal Blue is the only saturated color allowed outside the commit graph and semantic states. If a new UI element wants a second bright color "for interest," that instinct is wrong — reach for weight, spacing, or a graph-palette color instead, never a fresh hue.

**The Graph Color Is Data Rule.** Commit-graph colors are assigned by branch/lane index and must stay consistent for a given branch across renders. Never reassign them for decorative variety.

## 3. Typography

**Display/Body Font:** System sans stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`) — no custom webfont is loaded. This keeps the interface fast and native-feeling, which fits a dev-tool register better than a designed display face would.
**Mono Font:** `'JetBrains Mono', 'Fira Code', ui-monospace, monospace` — every terminal line, diff, commit hash, and inline code token.

**Character:** One neutral system sans carries all UI and prose; monospace is reserved strictly for anything that represents real Git/file-system output. The contrast between the two families is itself a signal to the learner: "this text is interface, that text is what Git actually produced."

### Hierarchy
- **Display** (800 weight, `clamp(2.25rem, 5vw, 3.75rem)`, 1.1 line-height, -0.02em tracking): Hero headings only — one per page, typically the landing page or a lesson's title screen.
- **Headline** (700 weight, 1.875rem/30px, 1.25 line-height): Section headers within a page (e.g. "Features", "Getting Started").
- **Title** (600 weight, 1.125rem/18px, 1.3 line-height): Card titles, panel headers, dialog titles.
- **Body** (400 weight, 1rem/16px, 1.6 line-height, max 65–75ch): Paragraph copy, lesson content, descriptions.
- **Label** (500 weight, 0.875rem/14px, 1.4 line-height): Buttons, nav items, form labels, badges.
- **Mono** (400 weight, 0.875rem/14px, 1.6 line-height): Terminal output, diffs, commit hashes, inline code.

### Named Rules
**The Display Ceiling Rule.** Hero type never exceeds `3.75rem` (60px) even at its clamp maximum. This is a teaching tool, not a marketing billboard — the type should invite reading, not shout.
**The Mono-Means-Real Rule.** Monospace is reserved for text that is, or represents, actual Git/filesystem output. Never use it decoratively on UI chrome that isn't representing real system data.

## 4. Elevation

GitVision is layered, not lifted. Depth is conveyed primarily through the three-step surface ramp (Canvas → Raised Surface → Surface Hover) and hairline borders, not through drop shadows. Shadows are reserved for genuinely floating elements — dropdowns, dialogs, toasts, the floating AI assistant button — where something needs to visually separate from the entire page stack, not just from its neighbor.

### Shadow Vocabulary
- **Panel Shadow** (`shadow-lg`, ~`0 10px 15px -3px rgb(0 0 0 / 0.3)`): Dropdown menus, command autocomplete popovers, the AI assistant panel.
- **Overlay Shadow** (`shadow-2xl`, ~`0 25px 50px -12px rgb(0 0 0 / 0.5)`): Modal dialogs, the search command palette — anything that sits above a backdrop.
- **Accent Glow** (`shadow-lg shadow-primary/10`): A soft blue-tinted glow used sparingly on hover for primary CTAs and feature cards, reinforcing the single-accent rule rather than adding a new color.

### Named Rules
**The Flat-Card Rule.** Standard content cards (feature cards, doc cards, sidebar items) get a border and surface-color shift only — never a resting shadow. A shadow appearing on a card at rest is a bug, not a style choice.

## 5. Components

### Buttons
- **Shape:** `rounded-md` (8px) as the default; `rounded-xl` (16px) reserved for large hero/marketing CTAs only, not in-app actions.
- **Primary:** Signal Blue background, white text, medium weight, `12px 20px` padding. Reserved for the single most important action in a given view (Run Command, Start Lesson, Open Playground).
- **Ghost/Secondary:** Transparent background, foreground text, hairline border on hover only (`hover:bg-accent`). Used for everything that isn't the primary action.
- **Hover/Focus:** Subtle scale (`1.02–1.05`) and a soft accent glow on primary buttons only; ghost buttons get a background-color shift, never scale. All interactive elements need a visible `focus-visible` ring in Signal Blue for keyboard navigation.

### Cards
- **Corner Style:** `rounded-lg` (12px) for standard content cards; `rounded-xl` (16px) for larger feature/hero cards.
- **Background:** Raised Surface, frequently at reduced opacity (`bg-surface/50`) with `backdrop-blur-sm` over the canvas for a subtle layering effect.
- **Border:** Hairline Border at 50% opacity (`border-gray-700/50`) as the default; full opacity on hover to signal interactivity.
- **Shadow Strategy:** None at rest (see Flat-Card Rule); Accent Glow on hover only for interactive/clickable cards.
- **Internal Padding:** 24px (`p-6`) standard.

### Inputs / Fields
- **Style:** Transparent or Canvas background, hairline border, `rounded-sm` (6px), `8px 12px` padding, mono font when the field represents a command (terminal input) and sans font for ordinary forms.
- **Focus:** A 1px Signal Blue ring (`focus-visible:ring-1 focus-visible:ring-ring`), no glow or scale — inputs should feel precise, not bouncy.
- **Disabled:** 50% opacity, `cursor-not-allowed`.

### Navigation
- **Style:** Fixed top bar on Raised Surface with a hairline bottom border. Nav items use Label typography, `rounded-md` hover backgrounds, and a Signal Blue underline or background tint for the active route (via `usePathname`, not manual path matching).
- **Mobile:** Slide-down hamburger menu, same token vocabulary as desktop, no separate mobile-only styling.

### The Commit Graph (signature component)
The graph is SVG-rendered nodes and edges on Canvas background, each branch lane colored from the 15-step Graph Palette by branch index. Nodes are filled circles at a consistent radius; edges are smooth curved paths, never straight diagonal lines, so branch/merge topology reads clearly at a glance. This is the product's single most important visual — treat any change to it as a comprehension change, not just a style change.

### Terminal
Raised Surface panel with a distinct chrome bar (traffic-light dots + a label, echoing familiar terminal UI), mono font throughout, command history in muted text and current input in foreground text. Success output in Success Green, errors in Destructive Red — the terminal is the one place semantic color is used liberally, because it's mirroring real CLI conventions the learner will eventually see outside GitVision too.

## 6. Do's and Don'ts

### Do:
- **Do** keep Signal Blue (`#38a6ff`) as the only non-semantic, non-graph saturated accent in the system.
- **Do** use the three-step surface ramp (Canvas → Raised Surface → Surface Hover) for all depth/hierarchy, reserving shadows for true overlays (dropdowns, dialogs, toasts).
- **Do** reserve monospace type strictly for real Git/filesystem output — terminal, diffs, hashes, inline code.
- **Do** verify muted-gray text (`#8b949e`) hits 4.5:1 contrast wherever it's used for body copy, not just captions.
- **Do** treat the commit graph's per-branch color as meaningful data, kept stable across re-renders.
- **Do** pair every destructive-feeling action (reset, rebase, force-push simulation) with calm, reassuring copy that reminds the learner this is safe to try.

### Don't:
- **Don't** use `background-clip: text` gradient headlines — per PRODUCT.md, this reads as generic AI-SaaS template output, and the current homepage's gradient "GitVision" wordmark should be migrated to a solid Foreground or Signal Blue treatment.
- **Don't** add tiny uppercase tracked eyebrow labels ("FEATURES", "HOW IT WORKS") above sections — this is the current AI-tell scaffold and is explicitly banned by PRODUCT.md's anti-references.
- **Don't** introduce a second bright accent hue for "visual interest" — every non-graph, non-semantic color decision should route back to Signal Blue, weight, or spacing instead.
- **Don't** apply resting shadows to standard content cards; a shadow at rest on a flat card is a bug per the Flat-Card Rule.
- **Don't** let hero/display type exceed the `3.75rem` ceiling — this is a teaching tool, not a marketing billboard.
- **Don't** build a dense, personality-free admin-dashboard surface even for "power user" screens — GitVision's tone stays Confident, Encouraging, Precise everywhere, not just on the landing page.
