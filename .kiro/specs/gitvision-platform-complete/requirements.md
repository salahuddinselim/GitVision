# Requirements Document

## Introduction

GitVision is a Next.js 16 / React 19 / Tailwind CSS v4 / TypeScript interactive Git visualization learning platform. The codebase exists but has accumulated 30 bugs ranging from build-breaking import errors to functional regressions, alongside incomplete UI pages. This spec covers two parallel workstreams:

1. **Bug Fixes** — Resolve all 30 identified defects so the application builds and runs correctly.
2. **UI Completion** — Implement the full product design across all pages and components to deliver a VSCode + GitHub-inspired educational visualization engine.

The platform simulates Git entirely in the browser via a Zustand store (`useGitStore`), renders an interactive terminal via `@xterm/xterm`, visualizes commit graphs via `@xyflow/react`, and persists data via IndexedDB. All pages must be Next.js App Router Server Components where possible, with `"use client"` used only where browser APIs or interactivity are required.

---

## Glossary

- **Application**: The GitVision Next.js application running at `https://gitvision.dev`.
- **Build**: The Next.js production build produced by `next build`.
- **CommandInput**: The `src/components/CommandInput.tsx` component — a form that accepts user text and dispatches it to `processCommand`.
- **ConflictResolver**: The `src/components/ConflictResolver.tsx` component for interactive merge conflict resolution.
- **FileExplorer**: The `src/components/FileExplorer.tsx` component that renders the virtual filesystem tree.
- **GitGraph**: The `src/components/GitGraph.tsx` component that renders the commit DAG using `@xyflow/react`.
- **GitStore**: The Zustand store exported from `src/store/gitStore.ts` as `useGitStore`, which simulates all Git operations in memory.
- **Navbar**: The `src/components/Navbar.tsx` component rendered in the root layout.
- **Providers**: The `src/components/Providers.tsx` component that wraps the application with `ThemeProvider` from `next-themes`.
- **RootLayout**: The `src/app/layout.tsx` file that wraps every page.
- **SearchBar**: The `src/components/SearchBar.tsx` component providing fuzzy search across commands and pages.
- **SEO_Component**: The legacy `src/components/SEO.tsx` file that incorrectly renders `<title>` and `<meta>` tags as JSX.
- **SplitView**: The `src/components/SplitView.tsx` component that manages the three-panel playground layout with view-mode switching.
- **StagingArea**: The `src/components/StagingArea.tsx` component that displays staged and unstaged files.
- **Terminal**: The `src/components/Terminal.tsx` component that wraps `@xterm/xterm` and renders command history.
- **TerminalStore**: The Zustand store exported from `src/store/gitStore.ts` as `useTerminalStore`, which holds command history and current input.
- **ThemeProvider**: The `next-themes` provider that enables dark/light mode switching.
- **Utility_cn**: The `src/lib/cn.ts` utility function that merges Tailwind class names.

---

## Requirements

### Requirement 1: Build-Breaking Import Fixes

**User Story:** As a developer, I want the application to compile without errors, so that I can run and deploy GitVision.

#### Acceptance Criteria

1. WHEN the Build is executed, THE Terminal component SHALL import `@xterm/xterm` instead of `xterm` and import `@xterm/xterm/css/xterm.css` instead of `xterm/css/xterm.css`.
2. WHEN the Build is executed, THE `src/types/globals.d.ts` file SHALL declare the `@xterm/xterm` module instead of the `xterm` module, and SHALL declare the `@xterm/xterm/css/xterm.css` module instead of `xterm/css/xterm.css`.
3. WHEN the Build is executed, THE `src/app/internals/page.tsx` file SHALL import `Network` or `TreePine` from `lucide-react` instead of the non-existent `Trees` export.
4. WHEN the Build is executed, THE Application SHALL produce zero TypeScript compilation errors related to missing or incorrect module declarations.

### Requirement 2: Root Layout Wiring

**User Story:** As a user, I want every page to display the navigation bar and respect my theme preference, so that I can navigate the site and use dark or light mode consistently.

#### Acceptance Criteria

1. THE RootLayout SHALL import `globals.css` from the canonical location `src/app/globals.css`.
2. THE RootLayout SHALL render the Navbar component inside the `<body>` element, above `{children}`.
3. THE RootLayout SHALL wrap `{children}` with the Providers component so that `ThemeProvider` is active on every page.
4. WHEN a user visits any page, THE Navbar SHALL be visible at the top of the viewport.
5. WHEN a user visits any page, THE ThemeProvider SHALL apply the correct color scheme based on the user's stored preference, defaulting to dark mode.

### Requirement 3: Dead File and Stale Artifact Removal

**User Story:** As a developer, I want the repository to contain only files that are actually used, so that the codebase is clean and the build is not confused by stale artifacts.

#### Acceptance Criteria

1. THE Application SHALL NOT contain the file `src/app/client.tsx`.
2. THE Application SHALL NOT contain the file `src/app/globals.html`.
3. THE Application SHALL NOT contain the file `src/next.config.ts` (the canonical config is at the project root).
4. THE Application SHALL NOT contain the file `src/tailwind.config.ts` (the canonical config is at the project root).
5. THE Application SHALL NOT list `react-router-dom` as a dependency in `package.json`.

### Requirement 4: robots.ts Route Correction

**User Story:** As a search engine crawler, I want a correctly formatted robots.txt response, so that I can index the site properly.

#### Acceptance Criteria

1. THE Application SHALL NOT contain the file `src/app/robots.txt/page.tsx`.
2. THE Application SHALL contain the file `src/app/robots.ts` that exports a default function returning a `MetadataRoute.Robots` object.
3. WHEN a crawler requests `/robots.txt`, THE Application SHALL respond with `User-agent: *`, `Allow: /`, `Disallow: /api/`, `Disallow: /_next/`, and the sitemap URL `https://gitvision.dev/sitemap.xml`.

### Requirement 5: SEO via Metadata Exports

**User Story:** As a developer, I want each page to export Next.js `metadata` objects for SEO, so that search engines and social platforms receive correct page titles and descriptions.

#### Acceptance Criteria

1. THE SEO_Component file `src/components/SEO.tsx` SHALL be deleted from the codebase.
2. WHEN any page previously used the SEO_Component, THE page SHALL instead export a `metadata` constant or `generateMetadata` function using the Next.js App Router metadata API.
3. THE RootLayout SHALL export a `metadata` object with the site-wide default title template `"%s | GitVision"` and a default description.
4. WHEN a page exports its own `metadata.title`, THE Application SHALL render the full title using the template from the RootLayout.

### Requirement 6: Navbar Active State and Navigation

**User Story:** As a user, I want the Navbar to highlight the current page and navigate without full-page reloads, so that I always know where I am and the site feels fast.

#### Acceptance Criteria

1. THE Navbar SHALL use `usePathname()` from `next/navigation` to determine the current route instead of `window.location.pathname`.
2. THE Navbar SHALL render navigation links using the Next.js `<Link>` component instead of `<a>` tags.
3. WHEN the current pathname matches a navigation item's `href`, THE Navbar SHALL apply the active style (`bg-primary/10 text-primary`) to that item.
4. THE Navbar SHALL render a hamburger menu button on viewports narrower than the `md` breakpoint.
5. WHEN the hamburger button is clicked, THE Navbar SHALL toggle a mobile navigation drawer that lists all navigation links.

### Requirement 7: globals.css Consolidation

**User Story:** As a developer, I want a single canonical globals.css file that is imported by the root layout, so that styles are applied consistently and there are no duplicate style definitions.

#### Acceptance Criteria

1. THE Application SHALL have exactly one `globals.css` file, located at `src/app/globals.css`.
2. IF a duplicate `globals.css` exists at any other path, THEN THE Application SHALL delete it.
3. THE RootLayout SHALL import `globals.css` from `src/app/globals.css` as its only global stylesheet import.

### Requirement 8: CommandInput Wired to TerminalStore

**User Story:** As a user, I want the commands I type in the input field to appear in the terminal with their output, so that I can see the results of my Git commands.

#### Acceptance Criteria

1. WHEN a user submits a command via CommandInput, THE CommandInput SHALL call `processCommand` from GitStore with the input value.
2. WHEN `processCommand` returns a result, THE CommandInput SHALL call `addEntry` on TerminalStore with a `CommandHistoryEntry` containing the original command, the result message, the current timestamp, and the type `"output"` or `"error"` based on the result's `success` field.
3. WHEN a command is submitted, THE CommandInput SHALL clear the input field via `clearInput` from TerminalStore.
4. IF the input is empty or contains only whitespace, THEN THE CommandInput SHALL NOT call `processCommand`.
5. WHEN a user presses the up arrow key in CommandInput, THE CommandInput SHALL populate the input with the previous command from TerminalStore history.
6. WHEN a user presses the down arrow key in CommandInput, THE CommandInput SHALL populate the input with the next command from TerminalStore history, or clear the input if at the end of history.

### Requirement 9: Terminal Wired to TerminalStore History

**User Story:** As a user, I want the xterm.js terminal to display all commands and their outputs from the session history, so that I have a persistent, scrollable record of my work.

#### Acceptance Criteria

1. WHEN the Terminal component is rendered in `playground/page.tsx`, THE playground page SHALL pass `useTerminalStore().history` as the `entries` prop to Terminal.
2. WHEN a new entry is added to TerminalStore history, THE Terminal SHALL append that entry's command and output to the xterm.js display without re-rendering the entire history.
3. THE Terminal SHALL display command entries prefixed with `$ ` in the default foreground color.
4. THE Terminal SHALL display error entries in red (`\x1b[31m`).
5. THE Terminal SHALL display output entries in the default foreground color.

### Requirement 10: Terminal xterm.js Initialization Fix

**User Story:** As a developer, I want the Terminal component to initialize xterm.js addons only once, so that there are no memory leaks or duplicate addon registrations.

#### Acceptance Criteria

1. THE Terminal component SHALL create the `FitAddon` instance exactly once during the xterm.js initialization `useEffect`, not on every `entries` update.
2. THE Terminal component SHALL store the `FitAddon` instance in a ref so it can be reused for subsequent `fit()` calls.
3. WHEN the `entries` prop changes, THE Terminal SHALL call `fitAddon.fit()` using the stored ref rather than creating a new `FitAddon`.
4. THE Terminal component SHALL NOT import `useCallback` unless it is used.

### Requirement 11: IndexedDB SSR Guard

**User Story:** As a developer, I want `db.ts` to be safe to import in Server Components, so that the build does not fail due to `indexedDB` being undefined in the Node.js environment.

#### Acceptance Criteria

1. THE `openDB` function in `src/lib/db.ts` SHALL check `typeof window !== "undefined"` before calling `indexedDB.open`.
2. IF `openDB` is called in a non-browser environment, THEN THE `openDB` function SHALL return a rejected Promise with a descriptive error message.
3. THE `dbGet`, `dbSet`, `dbGetAll`, `dbDelete`, and `dbClear` functions SHALL propagate the rejection from `openDB` without additional `indexedDB` calls.

### Requirement 12: Utility cn Uses tailwind-merge

**User Story:** As a developer, I want the `cn` utility to correctly merge conflicting Tailwind classes, so that conditional class logic produces the expected styles.

#### Acceptance Criteria

1. THE `cn` function in `src/lib/cn.ts` SHALL call `twMerge(clsx(...inputs))` using the installed `tailwind-merge` and `clsx` packages.
2. WHEN two conflicting Tailwind utility classes are passed to `cn` (e.g., `"p-2"` and `"p-4"`), THE `cn` function SHALL return only the last one (`"p-4"`).
3. THE `cn` function SHALL accept the same argument types as `clsx` (strings, arrays, objects, falsy values).

### Requirement 13: processCommand Argument Parsing Fix

**User Story:** As a user, I want Git commands with arguments to be parsed correctly, so that commands like `git commit -m "my message"` work as expected.

#### Acceptance Criteria

1. THE `processCommand` function in GitStore SHALL split the input string into parts using whitespace tokenization.
2. WHEN parsing a `git commit -m` command, THE `processCommand` function SHALL extract the commit message using `parts.slice(2).join(" ")` rather than string replacement patterns.
3. WHEN parsing a `git add` command, THE `processCommand` function SHALL extract the path argument using `parts[2]` rather than string replacement patterns.
4. WHEN a command is unrecognized, THE `processCommand` function SHALL return `{ success: false, message: "command not found: <input>" }`.

### Requirement 14: gitCommit Branch Tracking Fix

**User Story:** As a user, I want `git status` to show the correct branch name after committing, so that I always know which branch I am on.

#### Acceptance Criteria

1. WHEN `gitCommit` creates a new commit, THE GitStore SHALL update the current branch's `commitHash` to the new commit hash.
2. WHEN `gitCommit` creates a new commit, THE GitStore SHALL set `head` to the name of the current branch (e.g., `"master"`), not the commit hash.
3. WHEN `gitStatus` is called after a commit, THE output SHALL display `"On branch master"` (or the current branch name), not a detached HEAD hash.
4. WHEN `gitCheckout` switches to a branch, THE GitStore SHALL set `head` to the branch name and `detachedHead` to `false`.

### Requirement 15: SplitView View Mode Toggle

**User Story:** As a user, I want to switch between combined, terminal-only, and graph-only views in the playground, so that I can focus on the panel most relevant to my current task.

#### Acceptance Criteria

1. THE SplitView component SHALL maintain a `viewMode` state variable with values `"combined"`, `"terminal"`, or `"graph"`.
2. WHEN the "combined" button is clicked, THE SplitView SHALL set `viewMode` to `"combined"` and display all three panels.
3. WHEN the "terminal" button is clicked, THE SplitView SHALL set `viewMode` to `"terminal"` and display only the terminal panel at full width.
4. WHEN the "graph" button is clicked, THE SplitView SHALL set `viewMode` to `"graph"` and display only the GitGraph and StagingArea panels.
5. THE view mode button corresponding to the current `viewMode` SHALL be styled with the active (`bg-primary text-primary-foreground`) class.
6. THE view mode buttons SHALL each have an `onClick` handler that updates `viewMode`.

### Requirement 16: merge-conflicts Page dangerouslySetInnerHTML Removal

**User Story:** As a developer, I want the merge-conflicts page to use proper JSX instead of `dangerouslySetInnerHTML`, so that the content is safe and type-correct.

#### Acceptance Criteria

1. THE `src/app/merge-conflicts/page.tsx` file SHALL NOT use `dangerouslySetInnerHTML` for any static content.
2. WHEN the resolution steps list contains inline code elements, THE page SHALL render them as `<code>` JSX elements.
3. THE page SHALL render all content using standard React JSX without raw HTML injection.

### Requirement 17: learn/layout.tsx Cleanup

**User Story:** As a developer, I want `learn/layout.tsx` to be a Server Component with no unused imports, so that it renders efficiently and the build has no warnings.

#### Acceptance Criteria

1. THE `src/app/learn/layout.tsx` file SHALL NOT contain the `"use client"` directive.
2. THE `src/app/learn/layout.tsx` file SHALL NOT import `motion` from `framer-motion`.
3. THE `src/app/learn/layout.tsx` file SHALL NOT import any other symbol that is not used in the component.
4. THE sidebar links in `learn/layout.tsx` SHALL either point to existing routes or be replaced with stub pages at those routes.

### Requirement 18: sitemap.ts /404 Removal

**User Story:** As a search engine crawler, I want the sitemap to contain only valid, indexable URLs, so that crawlers do not waste budget on error pages.

#### Acceptance Criteria

1. THE `src/app/sitemap.ts` file SHALL NOT include an entry with the URL `https://gitvision.dev/404`.
2. THE sitemap SHALL include all other valid application routes.

### Requirement 19: Unused Import Cleanup

**User Story:** As a developer, I want all source files to be free of unused imports, so that the build produces no warnings and the bundle is not unnecessarily large.

#### Acceptance Criteria

1. THE `src/app/page.tsx` file SHALL NOT import `useAnimation` from `framer-motion`.
2. THE `src/app/internals/page.tsx` file SHALL NOT import `Layers` from `lucide-react`.
3. THE `src/components/Terminal.tsx` file SHALL NOT import `useCallback` from `react`.
4. THE `src/components/FeatureCard.tsx` file SHALL NOT import from `ui/card` if the import is unused.
5. WHEN the Build is executed, THE Application SHALL produce zero TypeScript or ESLint warnings about unused imports in the files listed above.

### Requirement 20: Radix UI Component Implementations

**User Story:** As a developer, I want the Tabs, Dialog, and Toast UI stub components to use the installed Radix UI packages, so that they are accessible and functional.

#### Acceptance Criteria

1. THE `src/components/ui/tabs.tsx` component SHALL be implemented using `@radix-ui/react-tabs`.
2. THE `src/components/ui/dialog.tsx` component SHALL be implemented using `@radix-ui/react-dialog`.
3. THE `src/components/ui/toast.tsx` component SHALL be implemented using `@radix-ui/react-toast`.
4. WHEN a Tabs component is rendered, THE Application SHALL display the correct tab panel for the selected tab.
5. WHEN a Dialog component is rendered and its trigger is activated, THE Application SHALL display the dialog overlay and content.
6. WHEN a Toast is triggered, THE Application SHALL display the toast notification and dismiss it after the configured duration.

### Requirement 21: parseGitLog Parser Fix

**User Story:** As a user, I want `git log` output to display correct commit information, so that I can review my repository history accurately.

#### Acceptance Criteria

1. THE `parseGitLog` function SHALL apply its regex to the correct line of the log output.
2. WHEN `git log` is called, THE output SHALL display each commit's hash, author, date, and message in the correct format.
3. WHEN `git log` is called on a repository with zero commits, THE output SHALL be an empty string.

---

## Requirements — Part 2: UI Completion

### Requirement 22: Design System and Theme

**User Story:** As a user, I want a consistent, polished visual design across all pages, so that the platform feels professional and is easy to use.

#### Acceptance Criteria

1. THE Application SHALL support dark mode (default) and light mode, toggled via the ThemeToggle component.
2. THE Application SHALL use the color palette defined in `globals.css`: background `#0f0f11`, surface `#161b22`, primary `#38a6ff`.
3. THE Application SHALL use Inter as the UI font and JetBrains Mono as the code/terminal font.
4. THE Application SHALL apply glassmorphism card styles (backdrop blur, semi-transparent background, border) via the `.glass` utility class.
5. THE Application SHALL use Framer Motion for page entry animations (`opacity: 0 → 1`, `y: 20 → 0`) on all major page sections.
6. THE Application SHALL be fully responsive across mobile (< 768px), tablet (768px–1024px), and desktop (> 1024px) viewports.
7. WHEN a user focuses any interactive element, THE Application SHALL display a visible focus ring using the primary color.

### Requirement 23: Landing Page Completion

**User Story:** As a visitor, I want a compelling landing page that demonstrates GitVision's capabilities, so that I understand the platform's value and am motivated to start learning.

#### Acceptance Criteria

1. THE landing page (`/`) SHALL render a hero section with an animated terminal demo that cycles through a sequence of Git commands.
2. THE landing page SHALL render an animated Git commit graph in the hero section that updates as the terminal demo progresses.
3. THE landing page SHALL render a feature cards grid with at least 8 feature cards, each with an icon, title, and description.
4. THE landing page SHALL render a "Why GitVision" section with a comparison or benefit list.
5. THE landing page SHALL render an interactive demo preview section with a link to `/playground`.
6. THE landing page SHALL render a blog preview section showing the 3 most recent blog post cards.
7. THE landing page SHALL render a testimonials section with at least 3 testimonial cards.
8. THE landing page SHALL render an FAQ accordion section using the `@radix-ui/react-accordion` package.
9. THE landing page SHALL render a footer with navigation links, social links, and copyright text.
10. THE landing page SHALL export a `metadata` object with the title `"GitVision | Learn Git Visually"` and a description.
11. THE landing page SHALL NOT use `"use client"` at the file level; interactive sections SHALL be extracted into separate Client Components.

### Requirement 24: Playground Page Completion

**User Story:** As a learner, I want a fully functional three-panel playground, so that I can practice Git commands and see the results visualized in real time.

#### Acceptance Criteria

1. THE playground page (`/playground`) SHALL render a three-panel layout: FileExplorer on the left (260px), Terminal in the center, and GitGraph + StagingArea on the right (320px).
2. THE playground page SHALL pass `useTerminalStore().history` as the `entries` prop to the Terminal component.
3. THE playground page SHALL render the CommandInput component below the Terminal.
4. THE playground page SHALL render the SplitView view mode toggle buttons that switch between `"combined"`, `"terminal"`, and `"graph"` modes.
5. THE playground page SHALL render a replay timeline via the ReplayTimeline component.
6. WHEN the repository is not initialized, THE playground page SHALL display a welcome screen with instructions to run `git init`.
7. WHEN the repository is initialized, THE playground page SHALL display the full three-panel layout.
8. THE playground page SHALL export a `metadata` object with the title `"Playground"`.

### Requirement 25: Docs Page and Command Pages Completion

**User Story:** As a learner, I want a searchable documentation hub with individual pages for every Git command, so that I can quickly find reference material and examples.

#### Acceptance Criteria

1. THE docs index page (`/docs`) SHALL render a sidebar with links to all command pages grouped by category.
2. THE docs index page SHALL render a search input that filters the command cards grid by command name or description.
3. THE docs index page SHALL render a command cards grid where each card shows the command name, a short description, and a difficulty badge.
4. EACH git command page (e.g., `/docs/git-add`) SHALL render: the command syntax in a CodeBlock, a prose explanation, an options table, at least two usage examples in CodeBlocks, a visual diagram or animation, a common mistakes section, a related commands list, and a "Try in Playground" link.
5. EACH git command page SHALL export a `metadata` object with the command name as the title.
6. THE docs pages SHALL be Server Components.

### Requirement 26: Learn Page Completion

**User Story:** As a learner, I want structured learning tracks with progress tracking, so that I can follow a guided curriculum from beginner to advanced.

#### Acceptance Criteria

1. THE learn index page (`/learn`) SHALL render three learning track cards: Beginner, Intermediate, and Advanced, each with a description and lesson count.
2. THE learn index page SHALL render lesson cards within each track, each showing the lesson title, estimated duration, and a completion status indicator.
3. THE learn index page SHALL render an interactive demo section that links to the playground.
4. THE learn layout SHALL render a sticky sidebar with the full lesson navigation tree.
5. THE learn layout SHALL be a Server Component (no `"use client"` directive).
6. ALL sidebar links in the learn layout SHALL point to routes that exist or have stub pages.
7. THE learn index page SHALL export a `metadata` object with the title `"Learn Git"`.

### Requirement 27: Merge Conflicts Page Completion

**User Story:** As a learner, I want an interactive conflict resolver that responds to my choices, so that I can practice resolving merge conflicts hands-on.

#### Acceptance Criteria

1. THE merge-conflicts page SHALL render a side-by-side diff view showing the current branch version and the incoming branch version.
2. THE merge-conflicts page SHALL render three resolution buttons: "Accept Current", "Accept Incoming", and "Combine Both".
3. WHEN a resolution button is clicked, THE page SHALL update the resolved output panel to show the chosen resolution.
4. WHEN a resolution is selected, THE page SHALL display a success state indicating the conflict is resolved.
5. THE page SHALL render a step-by-step resolution guide using proper JSX (no `dangerouslySetInnerHTML`).
6. THE page SHALL export a `metadata` object with the title `"Merge Conflict Resolver"`.

### Requirement 28: Internals Page Completion

**User Story:** As an advanced learner, I want animated diagrams of Git's object model, so that I can understand how Git stores data internally.

#### Acceptance Criteria

1. THE internals page SHALL render animated object model diagrams for blob, tree, commit, and tag objects using Framer Motion.
2. THE internals page SHALL render a SHA-1 hash explanation section with a visual hash calculation example.
3. THE internals page SHALL render a packfiles section explaining delta compression.
4. THE internals page SHALL render a refs section explaining HEAD, branches, tags, and remote refs.
5. THE internals page SHALL import `Network` or `TreePine` from `lucide-react` instead of the non-existent `Trees` export.
6. THE internals page SHALL NOT import `Layers` from `lucide-react` unless it is used.
7. THE internals page SHALL export a `metadata` object with the title `"Git Internals"`.

### Requirement 29: Classroom Page

**User Story:** As a teacher, I want a classroom mode UI, so that I can create sessions and guide students through Git concepts.

#### Acceptance Criteria

1. THE classroom page (`/classroom`) SHALL render a teacher mode UI with a "Create Session" button.
2. THE classroom page SHALL render a session sharing mockup that displays a shareable session URL.
3. THE classroom page SHALL render a student list panel showing connected students (with placeholder data).
4. THE classroom page SHALL export a `metadata` object with the title `"Classroom"`.

### Requirement 30: Blog Page

**User Story:** As a visitor, I want a blog with filterable posts, so that I can find Git tutorials and tips relevant to my skill level.

#### Acceptance Criteria

1. THE blog page (`/blog`) SHALL render a featured post card at the top of the page.
2. THE blog page SHALL render a post grid with at least 6 post cards, each showing title, excerpt, date, tag, and read time.
3. THE blog page SHALL render tag filter buttons that filter the post grid by difficulty tag (Beginner, Intermediate, Advanced).
4. WHEN a tag filter is active, THE blog page SHALL display only posts matching that tag.
5. THE blog page SHALL export a `metadata` object with the title `"Blog"`.

### Requirement 31: Linux Basics Page

**User Story:** As a beginner, I want a Linux command reference with interactive examples, so that I can learn the shell commands needed to use Git effectively.

#### Acceptance Criteria

1. THE linux-basics page (`/linux-basics`) SHALL render command cards for at least 20 common Linux/shell commands.
2. EACH command card SHALL show the command name, syntax, description, and at least one usage example in a CodeBlock.
3. THE linux-basics page SHALL render a search input that filters command cards by name or description.
4. THE linux-basics page SHALL export a `metadata` object with the title `"Linux Basics"`.

### Requirement 32: Commands Reference Page

**User Story:** As a user, I want a searchable, filterable command reference grid, so that I can quickly look up any Git command.

#### Acceptance Criteria

1. THE commands page (`/commands`) SHALL render a search input that filters the command grid by name or description.
2. THE commands page SHALL render category filter buttons (e.g., Basics, Branching, Remote, Advanced) that filter the grid.
3. THE commands page SHALL render a card for each Git command showing the command name, short description, difficulty badge, and a link to its docs page.
4. WHEN both a search query and a category filter are active, THE commands page SHALL apply both filters simultaneously.
5. THE commands page SHALL export a `metadata` object with the title `"Git Commands Reference"`.

### Requirement 33: 404 Not Found Page

**User Story:** As a user, I want a styled 404 page when I navigate to a non-existent route, so that I understand the page doesn't exist and can navigate back.

#### Acceptance Criteria

1. THE Application SHALL contain a `src/app/not-found.tsx` file that exports a default `NotFound` component.
2. THE not-found page SHALL render a styled error message indicating the page was not found.
3. THE not-found page SHALL render a link back to the home page (`/`).
4. THE not-found page SHALL be consistent with the application's design system (dark background, primary color accents).

### Requirement 34: Navbar Component Completion

**User Story:** As a user, I want a fully functional sticky navbar with active state, mobile menu, and search, so that I can navigate the site on any device.

#### Acceptance Criteria

1. THE Navbar SHALL be sticky (`position: sticky; top: 0`) with a backdrop blur effect.
2. THE Navbar SHALL use `usePathname()` from `next/navigation` for active link detection.
3. THE Navbar SHALL render all navigation links as Next.js `<Link>` components.
4. THE Navbar SHALL render a hamburger menu icon on mobile viewports that toggles a mobile navigation drawer.
5. THE Navbar SHALL render a search icon button that opens the SearchBar modal overlay.
6. WHEN the SearchBar is open, THE Application SHALL display a modal overlay with a fuzzy search input.
7. WHEN the user presses the `/` key, THE Application SHALL open the SearchBar modal.

### Requirement 35: GitGraph Component Completion

**User Story:** As a user, I want the commit graph to render a proper DAG with branch lanes, so that I can visually understand the repository's branch and merge history.

#### Acceptance Criteria

1. THE GitGraph component SHALL render commit nodes and edges using `@xyflow/react`.
2. WHEN the GitStore has commits, THE GitGraph SHALL render one node per commit with the short hash and message as labels.
3. WHEN a commit has a parent, THE GitGraph SHALL render a directed edge from the parent node to the child node.
4. WHEN multiple branches exist, THE GitGraph SHALL render each branch in a separate horizontal lane.
5. WHEN the HEAD branch pointer changes, THE GitGraph SHALL update to highlight the HEAD commit node.
6. THE GitGraph SHALL re-render automatically when the GitStore commits or branches change.

### Requirement 36: FileExplorer Component Completion

**User Story:** As a user, I want a file explorer with expand/collapse folders and status color coding, so that I can see the state of my virtual filesystem at a glance.

#### Acceptance Criteria

1. THE FileExplorer component SHALL render the virtual filesystem from GitStore as a tree view.
2. THE FileExplorer SHALL render folder nodes that can be expanded or collapsed by clicking.
3. THE FileExplorer SHALL color-code file status: untracked in gray, modified in yellow, staged in green, committed in the default foreground color.
4. WHEN a file's status changes in GitStore, THE FileExplorer SHALL update its color coding without a full page reload.

### Requirement 37: StagingArea Component Completion

**User Story:** As a user, I want the staging area to show real-time updates as I stage and unstage files, so that I always know what will be included in my next commit.

#### Acceptance Criteria

1. THE StagingArea component SHALL read staged and unstaged files from GitStore.
2. WHEN a file is staged via `git add`, THE StagingArea SHALL immediately display it in the "Staged Changes" section.
3. WHEN a file is unstaged, THE StagingArea SHALL move it to the "Unstaged Changes" section.
4. THE StagingArea SHALL display the count of staged files.

### Requirement 38: SearchBar Component Completion

**User Story:** As a user, I want a keyboard-accessible search modal that finds commands and pages, so that I can navigate the site quickly without using the mouse.

#### Acceptance Criteria

1. THE SearchBar component SHALL render as a modal overlay when activated.
2. WHEN the user types in the SearchBar input, THE SearchBar SHALL display matching results from the Git command list and page titles using fuzzy matching.
3. WHEN the user presses Enter or clicks a result, THE SearchBar SHALL navigate to the corresponding page or docs entry.
4. WHEN the user presses Escape, THE SearchBar SHALL close.
5. WHEN the user presses the `/` key on any page (outside an input), THE Application SHALL open the SearchBar.

### Requirement 39: Server Component Compliance

**User Story:** As a developer, I want all pages that do not require browser APIs or interactivity to be Server Components, so that the application benefits from server-side rendering and reduced client bundle size.

#### Acceptance Criteria

1. THE following pages SHALL be Server Components (no `"use client"` directive at the file level): `/docs`, all `/docs/git-*` pages, `/blog`, `/linux-basics`, `/commands`, `/internals`, `/learn` layout, `/classroom`.
2. WHEN a page requires client-side interactivity (e.g., state, event handlers, browser APIs), THE interactive portion SHALL be extracted into a separate Client Component file.
3. THE `src/app/learn/layout.tsx` file SHALL NOT contain the `"use client"` directive.
4. THE `src/app/robots.ts` and `src/app/sitemap.ts` files SHALL be plain TypeScript modules with no React component exports.
