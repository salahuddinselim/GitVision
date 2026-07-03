# Product

## Register

product

## Users

Primarily Git beginners and students following a structured curriculum (the platform includes a `/classroom` mode, suggesting instructor-led or self-paced course use). They arrive unsure of core concepts — commits, branches, merges — and are often intimidated by the real Git CLI's unforgiving error messages and irreversible-feeling commands. Their context: sitting down to actually practice, not just read about Git. The job to be done is building working mental models of Git's internals (the object graph, refs, the index) through safe, reversible, visualized experimentation — via an in-browser terminal, file explorer, and animated commit graph — rather than through documentation alone.

## Product Purpose

GitVision is an interactive Git learning platform: a client-side Git simulator (terminal + file explorer + commit graph visualization) paired with full command documentation and guided lessons. It exists because Git is taught badly — as a list of commands to memorize — when it's actually a small set of graph operations that become obvious once you can see them happen. Success looks like a learner who previously feared `rebase` or `reset --hard` running it confidently in the playground, watching the graph update, and understanding *why* it did what it did.

## Brand Personality

Confident, Encouraging, Precise. Premium, dev-tool-grade craft (think Linear, Vercel, Raycast) applied to an educational product — the interface should feel trustworthy and well-made, never toy-like, but it must not intimidate. It explains itself clearly, gives visible positive feedback for small wins (a successful commit, a resolved conflict), and never talks down to the learner. Precision matters because this is teaching Git's actual internal model — the visuals (commit graph, diffs, file states) must be accurate, not decorative.

## Anti-references

Generic AI-SaaS template look: cream/sand backgrounds, gradient-text hero headlines, tiny uppercase tracked eyebrows above every section, hero-metric-stat blocks, identical icon-card grids. The current homepage (`src/app/page.tsx`) already exhibits some of these (gradient-text "GitVision" headline, generic gradient blob backgrounds) and should be reworked over time rather than treated as the established brand baseline. Also avoid the opposite failure mode — a dense, personality-free corporate/enterprise admin-dashboard feel; this is a learning product, not an internal ops tool.

## Design Principles

1. **Show, don't tell.** Every Git concept should have a live, animated visual counterpart (graph, diff, file tree) — prefer direct manipulation and visualization over prose explanation.
2. **Reversible feels safe.** Since this is a simulator, the UI should actively communicate "nothing here can actually break anything," lowering the fear threshold that makes real Git intimidating.
3. **Precision over decoration.** Visual choices (colors, motion, layout) must reinforce correct understanding of Git's model, not just look impressive — a commit graph's geometry, colors, and connections are semantically meaningful, not arbitrary.
4. **Confident craft, encouraging voice.** Premium dev-tool visual quality paired with copy that celebrates progress and never shames mistakes.
5. **Practice what you preach.** As a tool for developers, GitVision's own codebase and design system should model good engineering and design practice.

## Accessibility & Inclusion

WCAG AA baseline: contrast ratios of ≥4.5:1 for body text and ≥3:1 for large text/UI components, full keyboard navigation (especially for the terminal and playground), and proper screen-reader labeling throughout. Given the animated commit graph and terminal output, respect `prefers-reduced-motion` with crossfade/instant alternatives for all non-essential motion.
